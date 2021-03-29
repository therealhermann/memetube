import sys
import json
from flask import Flask, render_template, request
from flask_cors import CORS, cross_origin

from meme.meme import Meme

app = Flask(__name__)
CORS(app, support_credentials=True)

@app.route('/meme', methods=['POST'])
@cross_origin(supports_credentials=True)
def index():
	if request.json:
		print(request.args)
		print(request.json)
		vtag = request.json['vTag']
		timestamp = request.json['timestamp']
		bottom = False if 'bottom' not in request.json else request.json['bottom']
		comment = request.json['comment']

		collage = Meme(vtag, timestamp, comment)
		status = collage.youtube_artifacts_to_meme()
		collage.clean_artifacts()

		return {
			"success": status,
			"memeS3Url": collage.get_s3_meme()
		}

	return {
		"success": False,
		"message": "Missing json data",
		"memeS3Url": ""
	}

app.run()
