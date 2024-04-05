# model for video meta data which includes the original video path, interpolated video path and the user id
from pydantic import BaseModel

class VideoData(BaseModel):
    original_video_url: str
    interpolated_video_url: str
    user_id: str


VideoData.__doc__ = '''Model for video meta data which includes the original video path, interpolated video path and the user id'''