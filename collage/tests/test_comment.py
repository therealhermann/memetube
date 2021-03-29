import unittest
import pathlib
import json
from meme import (
    constants,
    utils
)


TEST_DIR = pathlib.Path(__file__).parent.absolute()


class TestCommenteMethods(unittest.TestCase): 
      
    @classmethod
    def setUpClass(cls):
        filename = '{}/{}'.format(TEST_DIR, 'data/comment.json')
        with open(filename) as json_file:
            cls._data = json.loads(json_file.read())
        
    # Finds the test data
    def test_json_data(self):
        has_comment = 'comment' in self._data
        has_long_comment = 'longComment' in self._data
        has_extra_long_comment = 'extraLongComment' in self._data
        
        self.assertTrue(has_comment)
        self.assertTrue(has_long_comment)
        self.assertTrue(has_extra_long_comment)
  
    def test_comment(self):
        comment = self._data['comment']
        cc, length, height = utils._comment_to_caption(comment, constants.COMMENT_WIDTH)
        expected_height = 1

        self.assertTrue(len(comment) <= constants.COMMENT_WIDTH)
        self.assertEqual(length, len(comment))
        self.assertEqual(height, 1)

    def test_long_comment(self):
        comment = self._data['longComment']
        cc, length, height = utils._comment_to_caption(
            comment, constants.COMMENT_WIDTH)
        expected_height = int(len(comment)/constants.COMMENT_WIDTH)

        self.assertTrue(len(comment) > constants.COMMENT_WIDTH * 2)
        self.assertTrue(constants.COMMENT_WIDTH >= length)
        self.assertTrue(height >= expected_height)

    def test_extra_long_comment(self):
        comment = self._data['extraLongComment']
        cc, length, height = utils._comment_to_caption(
            comment, constants.COMMENT_WIDTH)
        expected_height = int(len(comment)/constants.COMMENT_WIDTH)

        self.assertTrue(len(comment) > constants.COMMENT_WIDTH * 4)
        self.assertTrue(constants.COMMENT_WIDTH >= length)
        self.assertTrue(height >= expected_height)
