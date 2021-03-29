import os


DEBUG = os.getenv('DEBUG', False)

# AWS conf
AWS_ROLE = os.getenv('AWS_ROLE', '')
AWS_PROFILE = os.getenv('AWS_PROFILE', 'meme-tube-dev')
AWS_STORAGE_BUCKET_NAME = os.getenv('AWS_STORAGE_BUCKET_NAME', 'dev-meme-tube')
AWS_MEMES_DIR = os.getenv('AWS_CLIP_DIR', 'memes')
AWS_FRAMES_DIR = os.getenv('AWS_CLIP_DIR', 'frames')

# Temp local storage
ROOT_DIR = os.getcwd()
TMP_ARTIFACTS_DIR = os.path.join(ROOT_DIR, 'tmp') if DEBUG else '/tmp'
LOCAL_FRAME_DIR  = os.getenv(
    'LOCAL_FRAME_DIR ', os.path.join(TMP_ARTIFACTS_DIR, 'frames')
)
LOCAL_MEME_DIR = os.getenv(
    'LOCAL_MEME_DIR', os.path.join(TMP_ARTIFACTS_DIR, 'memes')
)
