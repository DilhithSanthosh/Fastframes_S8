from fastapi import FastAPI, UploadFile, File, Response, Header, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from typing import Annotated, Optional, Union
import numpy as np
from PIL import Image
from typing import List
from    generate_api import interpolate_images, interpolate_video
from tempfile import TemporaryDirectory
from zipfile import ZipFile
import os
import traceback
from common import generate_uuid

from firebase import Firebase

from data_models import VideoData, FBVideoData

app = FastAPI()
#enable cors

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def authenticate(Authorization : Annotated[Union[str,None],Header()] = None):
    if Authorization is None:
        raise HTTPException(status_code=400, detail="Authorization token is missing.")
    try:
        decoded_token = Firebase.verify_token(Authorization)
        yield decoded_token
    except:
        traceback.print_exc()
        raise HTTPException(status_code=401, detail="Invalid authorization token.")

@app.get("/hello")
def hello():
    return {"Hello": "World"}

@app.post("/images", dependencies=[Depends(authenticate)])
def process_images(files: List[UploadFile], user: dict = Depends(authenticate)):

    # check if there are two files
    if len(files) != 2:
        return {"error": "Please provide two images."}
    
    # create temp folder with these images
    with TemporaryDirectory() as temp_dir:
        for i, file in enumerate(files):
            with open(f"{temp_dir}/{i}.jpg", "wb") as f:
                f.write(file.file.read())
        
        # interpolate images
        interpolate_images(temp_dir)

        # zip the images and return
        with ZipFile(f"{temp_dir}/images.zip", "w") as z:
            # zip all the images in the temp folder
            for file in os.listdir(temp_dir):
                z.write(f"{temp_dir}/{file}")
            
        # return the zip file
        with open(f"{temp_dir}/images.zip", "rb") as f:
            return Response(content=f.read(), media_type="application/zip", headers={"Content-Disposition": "attachment; filename=images.zip"})

@app.post("/video", dependencies=[Depends(authenticate)])
def process_video(file: UploadFile = File(...), interpolationFactor: Annotated[str, Header()] = "2", user: dict = Depends(authenticate)):

        #get user id
        user_id = user["uid"]
        print(type(file), file)
        #check if file is video
        allowed_extensions = (".mp4", ".avi", ".mov")
        if not any(file.filename.endswith(ext) for ext in allowed_extensions):
            return {"error": "Only video files are allowed."}
    
        # create temp folder with this video
        with TemporaryDirectory() as temp_dir:
            uuid = generate_uuid()
            #create the folders if they don't exist
            os.makedirs(f"{temp_dir}/{user_id}/{uuid}", exist_ok=True)
            with open(f"{temp_dir}/{user_id}/{uuid}/video.mp4", "wb") as f:
                f.write(file.file.read())

            
            video_loc = f"{temp_dir}/{user_id}/{uuid}/video.mp4"
            interpolated_video_loc = f"{temp_dir}/{user_id}/{uuid}/interpolated_video.mp4"

            # upload video to firebase and get the url
            original_dest_loc = f"{user_id}/{uuid}/video.mp4" # destination location in firebase
            original_video_url = Firebase.upload_file(video_loc, original_dest_loc)

            # interpolate video
            video_loc = interpolate_video(int(interpolationFactor),video_loc,user_id,"test.mp4") # runs should bee set according to user input
    
            # upload the interpolated video to firebase and get the url
            interpolated_dest_loc = f"{user_id}/{uuid}/interpolated_video.mp4" # destination location in firebase
            interpolated_video_url = Firebase.upload_file(video_loc, interpolated_dest_loc)

            #generate data for firebase
            new_video_data = FBVideoData(user_id=user_id,video_interpolated_pairs=dict({original_dest_loc:interpolated_dest_loc}))
            new_video_data_dict = new_video_data.dict()

            #add data to firebase
            Firebase.set_doc("videos",user_id,new_video_data_dict)
            
            # return the urls
            return {"original_video_url": original_video_url, "interpolated_video_url": interpolated_video_url, "video_id": uuid}   
        
@app.get("/test", response_class=FileResponse, dependencies=[Depends(authenticate)])
def return_blob(token : dict = Depends(authenticate)):
    return "./data/temp/test/test_interpolated.mp4"