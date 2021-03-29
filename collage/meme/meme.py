import os

from meme import (
    constants,
    settings,
    utils
)

class Meme():
    s3_frame_prefix = 'https://dev-meme-tube.s3.amazonaws.com/frames'
    s3_meme_prefix = 'https://dev-meme-tube.s3.amazonaws.com/memes'

    def __init__(
        self,
        vtag,
        timestamp,
        comment,
        bottom=False,
        font_fill=constants.FONT_FILL_DEFAULT,
        font_style=constants.FONT_STYLE_DEFAULT,
        font_size=constants.FONT_SIZE_DEFAULT):
        self.vtag = vtag
        self.timestamp = timestamp
        self.comment = comment
        self.bottom = bottom
        self.font_fill = font_fill
        self.font_style = font_style
        self.font_size = font_size
        
        self._set_s3_meme_object_name()
        self._set_s3_frame_object_name()
        self._set_local_meme_filename()
        self._set_local_frame_filename()

    def youtube_artifacts_to_meme(self):
        download_res = utils.download_frame_from_s3(
            settings.AWS_STORAGE_BUCKET_NAME, self.frame_s3_obj_name, self.frame_local_filename)

        meme_res = utils.meme_comment_to_frame(self.meme_local_filename, self.frame_local_filename, self.comment)

        upload_res = utils.upload_meme_to_s3(settings.AWS_STORAGE_BUCKET_NAME, self.meme_local_filename, self.meme_s3_obj_name)

        return download_res and meme_res and upload_res

    def get_s3_meme(self):
        return '{}/{}/{}.png'.format(self.s3_meme_prefix, self.vtag, self.timestamp)

    def get_s3_frame(self):
        return '{}/{}/{}.png'.format(self.s3_frame_prefix, self.vtag, self.timestamp)


    def clean_artifacts(self):
        utils.clean_local_artifacts(self.meme_local_filename, self.frame_local_filename)

    def _set_s3_meme_object_name(self):
        self.meme_s3_obj_name = '{}/{}/{}.png'.format(
            settings.AWS_MEMES_DIR, self.vtag, self.timestamp)

    def _set_s3_frame_object_name(self):
        self.frame_s3_obj_name = '{}/{}/{}.png'.format(
            settings.AWS_FRAMES_DIR, self.vtag, self.timestamp)

    def _set_local_meme_filename(self):
        self.meme_local_filename = '{}/{}/{}.png'.format(
            settings.LOCAL_MEME_DIR, self.vtag, self.timestamp)

    def _set_local_frame_filename(self):
        self.frame_local_filename = '{}/{}/{}.png'.format(
            settings.LOCAL_FRAME_DIR, self.vtag, self.timestamp)

    def _print_local_artifacts(self):
        return {
                'meme': self.meme_local_filename,
                'frame': self.frame_local_filename
            }
