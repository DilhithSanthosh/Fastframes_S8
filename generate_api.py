import os
import sys
import time
import copy
import shutil
import random

import cv2 as cv

import torch
import numpy as np
from tqdm import tqdm

import utils

MODEL = "cain" # cain_encdec
BATCH_SIZE = 32
WORKERS = 5

#PARAMS
random_seed = 12345
depth = 3

#DATA PATH
data_root = 'data/temp' # stores temp videos from users under 'data/temp/user_id/frames_loc'
data_set = 'custom'

#image
image_format = 'png'

device = torch.device('cuda')
torch.backends.cudnn.enabled = True
torch.backends.cudnn.benchmark = True

torch.manual_seed(random_seed)
torch.cuda.manual_seed(random_seed)




##### Build Model #####
if MODEL == 'cain_encdec':
    from model.cain_encdec import CAIN_EncDec
    print('Building model: CAIN_EncDec')
    model = CAIN_EncDec(depth=depth, start_filts=32)
elif MODEL == 'cain':
    from model.cain import CAIN
    print("Building model: CAIN")
    model = CAIN(depth=depth)
else:
    raise NotImplementedError("Unknown model!")
# Just make every model to DataParallel
model = torch.nn.DataParallel(model).to(device)
#print(model)

print('# of parameters: %d' % sum(p.numel() for p in model.parameters()))


# load checkpoint: model
    #utils.load_checkpoint(args, model, optimizer=None)
checkpoint = torch.load('pretrained_cain.pth')
start_epoch = checkpoint['epoch'] + 1
model.load_state_dict(checkpoint['state_dict'])
del checkpoint



def generate(files_loc, epoch):
    print('Evaluating for epoch = %d' % epoch)

    # dataset #
    data_root = files_loc

    ##### Load Dataset #####
    test_loader = utils.load_dataset(
        data_set, data_root, BATCH_SIZE, BATCH_SIZE//2, WORKERS, img_fmt=image_format)
    model.eval()

    t = time.time()
    with torch.no_grad():
        for i, (images, meta) in enumerate(tqdm(test_loader, desc='Generating', ncols=80, leave=False)):

            # Build input batch
            im1, im2 = images[0].to(device), images[1].to(device)

            # Forward
            out, _ = model(im1, im2)

            # Save result images
            for b in range(images[0].size(0)):
                paths = meta['imgpath'][0][b].split('/')
                fp = data_root
                fp = os.path.join(fp, paths[-1][:-4])   # remove '.png' extension
                
                # Decide float index
                i1_str = paths[-1][:-4]
                i2_str = meta['imgpath'][1][b].split('/')[-1][:-4]
                try:
                    i1 = float(i1_str.split('_')[-1])
                except ValueError:
                    i1 = 0.0
                try:
                    i2 = float(i2_str.split('_')[-1])
                    if i2 == 0.0:
                        i2 = 1.0
                except ValueError:
                    i2 = 1.0
                fpos = max(0, fp.rfind('_'))
                # fInd = (i1 + i2) / 2
                # savepath = "%s_%06f.%s" % (fp[:fpos], fInd, image_format)

                fInd = int((i1 + i2) / 2)
                savepath = "%s_%06d.%s" % (fp[:fpos], fInd, image_format)

                utils.save_image(out[b], savepath)
                    
            # Print progress
            # print('im_processed: {:d}/{:d} {:.3f}s   \r'.format(i + 1, len(test_loader), time.time() - t))

    # return 
    return 


""" API Entry """
def interpolate_images(runs, files_loc, target_fps=37):
    '''Interpolates images using CAIN model and returns the interpolated frames location'''

    for _ in range(runs):
        
        # run test
        generate(files_loc, start_epoch)

def extract_frames(file_loc,user_id, video_loc):
    '''Extracts frames from video and returns the location of the extracted frames'''

    # extract frames from video
    video_path =  file_loc
    video_path_without_ext = video_path.split('.')[0]
    frames_loc = f'{video_path_without_ext}/_frames'
    print("frames location: ", frames_loc)
    os.makedirs(frames_loc, exist_ok=True)
    # os.system(f'ffmpeg -i {video_path} -vf "fps=10" {frames_loc}/frame_%04d.png')
    
    # extract using opencv
    cap = cv.VideoCapture(video_path)
    i = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        cv.imwrite(f'{frames_loc}/frame_{i:06d}.png', frame)
        i += 16
    
    #delete original video
    os.remove(video_path)

    return frames_loc

def interpolate_video(runs, file_loc,user_id, video_loc):
    '''Interpolates video using CAIN model and returns the interpolated video location'''

    # get the framerate of the video
    cap = cv.VideoCapture(file_loc)
    actual_fps = cap.get(cv.CAP_PROP_FPS)
    cap.release()

    # set the target framerate
    target_fps = actual_fps
    for i in range(runs):
        target_fps += (target_fps - 1)
    target_fps = int(target_fps)

    # extract frames from video
    frames_loc = extract_frames(file_loc, user_id, video_loc)

    # run interpolation
    interpolate_images(runs, frames_loc)

    # stitch frames to video
    video_loc = stitch_frames(video_loc, frames_loc, target_fps)

    # delete frames
    shutil.rmtree(frames_loc)

    return video_loc    

def stitch_frames(video_loc,frames_dir, target_fps=37):

    # stitch frames to video
    video_path = video_loc
    video_path_without_ext = video_path.split('.')[0]

    # stitch using opencv

    # Get list of frame filenames sorted numerically
    frame_filenames = sorted(os.listdir(frames_dir), key=lambda x: int(x.split('_')[1].split('.')[0]))

    # Set video properties
    output_video_filename = f'{video_path_without_ext}_interpolated.mp4'
    frame_width, frame_height = cv.imread(os.path.join(frames_dir, frame_filenames[0])).shape[1], cv.imread(os.path.join(frames_dir, frame_filenames[0])).shape[0]

    # Define codec and create VideoWriter object
    fourcc = cv.VideoWriter_fourcc(*'avc1')
    out = cv.VideoWriter(output_video_filename, fourcc, target_fps, (frame_width, frame_height))

    # Iterate over frames and stitch them into video
    for frame_filename in frame_filenames:
        frame_path = os.path.join(frames_dir, frame_filename)
        frame = cv.imread(frame_path)
        out.write(frame)
    
    # Release VideoWriter object
    out.release()

    print(f"Video stitched successfully and saved as '{output_video_filename}'")



    return f'{video_path_without_ext}_interpolated.mp4'