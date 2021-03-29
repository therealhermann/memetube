import os
import re
import datetime
import boto3
import botocore

from botocore.exceptions import ClientError
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from dateutil.tz import tzlocal

from meme import (
    constants,
    settings
)

session = boto3.Session(profile_name=settings.AWS_PROFILE)

def meme_comment_to_frame(
    meme_filename,
    frame_filename,
    comment,
    font_style=constants.FONT_STYLE_DEFAULT,
    font_size=constants.FONT_SIZE_DEFAULT,
    font_fill=constants.FONT_FILL_DEFAULT,
    bg_fill=constants.BG_FILL_DEFAULT,
    bottom=constants.COMMENT_POSITION_DEFAULT,
    test=settings.DEBUG
):
    '''
    Write a meme caption on the top or bottom of the frame. Save the result as a meme png.

    Params:
        -- meme_filename {string} - Local path to store combine frame and comment
        -- frame_filename {string} - Local path to the YouTube screenshot frame
        -- comment {string} - Meme caption
        -- font_style {string} - Path to a ttf file for the font style
        -- font_size {int} - Font size
        -- font_fill {tuple{3}} - Color of the meme caption
        -- bg_fill {tuple{4}} - Background color for the caption 
        -- bottom {bool} - Postion the caption on the bottom when True
        -- test {bool} - Optional boolean used in testing
    '''
    try:
        # Load file
        im = Image.open(frame_filename)
        W, H = im.size

        # Format comment
        caption, x, y = _comment_to_caption(comment, constants.COMMENT_WIDTH)
        font = ImageFont.truetype(font_style, font_size)

        # Compose a background
        caption_border = 100
        bg_width = W
        bg_height = (font_size * y) + caption_border + H
        im = _compose_image_with_background(
            im, bg_width, bg_height, bg_fill=bg_fill, bottom=bottom)

        # Add caption
        draw = ImageDraw.Draw(im)
        offset_w = (bg_width // 2) - (x // 2) * (font_size // 2)  # center
        offset_h = ((bg_height - H) // 2) - (y * (font_size // 2))
        offset_h = H + offset_h if bottom else offset_h
        offset = (offset_w, offset_h)
        draw.text(offset, caption, fill=font_fill, font=font)

        # Create a path and save the file
        _validate_path(meme_filename)
        if test:
            im.show()
        else:
            im.save(meme_filename)

        return True
    except FileNotFoundError:
        return False

def get_all_frames_from_s3(bucket, vtag):
    '''
    Gets a list images on s3 for a given youtube id.

    Params:
        -- bucket {string} - S3 bucket name
        -- vtag {string} - YouTube vtag
    '''
    bucket = session.resource('s3').Bucket(bucket)
    prefix = os.path.join(settings.AWS_FRAMES_DIR, vtag)
    return [obj.key for obj in bucket.objects.filter(Prefix=prefix)]

def upload_meme_to_s3(bucket, filename, key):
    '''
    Uploads a meme from local dir to s3.

    Params:
        -- bucket {string} - S3 bucket name
        -- filename {string} - Local filename for the s3 object
        -- key {string} - Object prefix
    '''
    try:
        if not _is_path_exists(filename):
            return False

        s3 = session.client('s3')
        s3.upload_file(filename, bucket, key)
        return True
    except ClientError as e:
        print(e)
        # Not found
        return False

def download_frame_from_s3(bucket, key, filename):
    '''
    Gets a frame from s3 and saves to settings.LOCAL_CLIP_DIR.

    Params:
        -- bucket {string} - S3 bucket name
        -- key {string} - Object prefix
        -- filename {string} - Local filename for the s3 object
    '''
    try:
        if not _is_path_exists(filename):
            _validate_path(filename)
            s3 = session.client('s3')
            s3.download_file(bucket, key, filename)
        return True
    except ClientError as e:
        print(e)
        # Not found
        return False

def clean_local_artifacts(meme_filename, frame_filename):
    '''
    Free up some memory by deleting unsued images

    Params:
        -- meme_filename {string} - Local path to for meme png file
        -- frame_filename {string} - Local path to the YouTube screenshot frame png file
    '''
    if _is_path_exists(meme_filename):
        print('Recycling meme filename 🚮')
        _delete_artifacts(meme_filename)

    if _is_path_exists(frame_filename):
        print('Recycling frame filename 🚮')
        _delete_artifacts(frame_filename)

def _comment_to_caption(comment, max_width):
    '''
    Formats YouTube comment to be the meme caption.

    Params:
        -- comment {string} - YouTube comment.
        -- max_width {int} - Max number of characters per line.
    '''
    curr_max_width = 0
    curr_width = 0
    curr_height = 1

    if len(comment) > max_width:
        caption = comment.split(' ')
        for i in range(len(caption)):
            caption[i] = caption[i].strip()

            if curr_width + len(caption[i]) > max_width:
                curr_max_width = curr_width if curr_width > curr_max_width else curr_max_width
                curr_width = 0
                curr_height += 1
                caption[i] += '\n'
            else:
                curr_width += len(caption[i]) + 1 # word + space char

        return ' '.join(caption), curr_max_width, curr_height

    return comment, len(comment), curr_height

def _compose_image_with_background(
    im,
    bg_width,
    bg_height,
    bg_fill=constants.BG_FILL_DEFAULT,
    bottom=constants.COMMENT_POSITION_DEFAULT
    ):
    '''
    Compose the YouTube frame with a background to write the text on

    Params:
        -- im {Image} - Local path to store combined frame and comment
        -- bg_width {int} - Background width
        -- bg_height {int} - Background height
        -- bg_fill {tuple{4}} - Background color for the caption 
        -- bottom {bool} - Postion the caption background on the bottom when True
    '''
    background = Image.new(constants.COLOR_CHANNEL, (bg_width, bg_height), bg_fill)

    # Create text space at top or bottom
    bg_w, bg_h = background.size
    offset_w = 0
    offset_h = 0 if bottom else bg_h - im.height
    offset = (offset_w, offset_h)

    background.paste(im, offset)
    return background

def _exists_object_on_s3(bucket, key):
    '''
    Determines if an s3 object exits.

    Note folders return 'false', they not objects,

    Params:
        -- bucket {string} - S3 bucket name
        -- key {string} - Object prefix
    '''
    s3 = session.client('s3')
    try:
        s3.head_object(Bucket=bucket, Key=os.path.join(
            settings.AWS_FRAMES_DIR, key))
        return True
    except ClientError as e:
        # Not found
        return False

def _validate_path(p):
    folders = p.split('/')
    folders.pop()
    _create_dir('/'.join(folders))

def _delete_artifacts(d):
    pth = Path(d)
    pth.unlink(missing_ok=True)

    folders = d.split('/')
    folders.pop()
    parent_dir = '/'.join(folders)
    
    if _is_dir_empty(parent_dir):
        _delete_dir(parent_dir)

def _create_dir(d):
    try:
        Path(d).mkdir(parents=True)
    except FileExistsError:
        pass

def _delete_dir(d):
    pth = Path(d)
    for child in pth.glob('*'):
        if child.is_file():
            child.unlink(missing_ok=True)
        else:
            _delete_dir(child)
    pth.rmdir()

def _is_path_exists(p):
    return Path(p).exists()

def _is_dir_empty(d):
    return not any(Path(d).iterdir())
