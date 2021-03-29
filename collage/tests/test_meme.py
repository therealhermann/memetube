import unittest
import pathlib
import json

from meme import (meme, utils)

TEST_DIR = pathlib.Path(__file__).parent.absolute()

class TestMemeMethods(unittest.TestCase): 
      
    @classmethod
    def setUpClass(cls):
        filename = '{}/{}'.format(TEST_DIR, 'data/meme.json')
        with open(filename) as json_file:
            cls._data = json.loads(json_file.read())
        
    # Finds the test data
    def test_json_data(self):
        has_comment = 'comment' in self._data
        has_long_comment = 'longComment' in self._data
        has_extra_long_comment = 'extraLongComment' in self._data
        has_images = 'images' in self._data
        
        self.assertTrue(has_comment)
        self.assertTrue(has_long_comment)
        self.assertTrue(has_extra_long_comment)
        self.assertTrue(has_images)

    def test_meme_with_comment_on_top(self):
        result = utils.meme_comment_to_frame(
            'test', self._data['images'][0], self._data['comment'])
        self.assertTrue(result)

    def test_meme_with_long_comment_on_top(self):
        result = utils.meme_comment_to_frame(
            'test', self._data['images'][1], self._data['longComment'])
        self.assertTrue(result)

    def test_meme_with_extra_long_comment_on_top(self):
        result = utils.meme_comment_to_frame(
            'test', self._data['images'][2], self._data['extraLongComment'])
        self.assertTrue(result)

    def test_meme_with_comment_on_bottom(self):
        result = utils.meme_comment_to_frame(
            'test', self._data['images'][0], self._data['comment'], bottom=True)
        self.assertTrue(result)

    def test_meme_with_long_comment_on_bottom(self):
        result = utils.meme_comment_to_frame(
            'test', self._data['images'][1], self._data['longComment'], bottom=True)
        self.assertTrue(result)

    def test_meme_with_extra_long_comment_on_bottom(self):
        result = utils.meme_comment_to_frame(
            'test', self._data['images'][2], self._data['extraLongComment'], bottom=True)
        self.assertTrue(result)

    def test_get_s3_meme_data(self):
        meme_obj = meme.Meme(self._data['vTag'], self._data['timestamp'], self._data['comment'])

        meme_obj.youtube_artifacts_to_meme()
        meme_obj.clean_artifacts()

        self.assertTrue(True)

    def test_live_demo(self):
        meme_obj = meme.Meme(self._data['vTag'], self._data['timestamp'], self._data['comment'])
        meme_obj.youtube_artifacts_to_meme()
        meme_obj.clean_artifacts()

