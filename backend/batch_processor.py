from video_processor import process_video
import os


def batch_process_videos():
    folder_path = "../../static/static/sample_batch"
    output_path = "../../static/static/flagged_frames"
    results = []

    for filename in os.listdir(folder_path):
        if filename.endswith('.mp4'):
            file_path = os.path.join(folder_path, filename)
            flags = process_video(file_path, output_path)
            results.extend(flags)

    return results
