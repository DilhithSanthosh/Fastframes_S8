from pydantic import BaseModel

class FBVideoData(BaseModel):
    user_id: str
    video_interpolated_pairs: dict