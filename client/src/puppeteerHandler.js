import axios from 'axios';
import {
	puppeteerPort,
	puppeteerBaseFrameEndpoint,
	puppeteerBaseCommentEndpoint,
	collagePort,
	collageBaseEndpoint,
	frameCountDefault
} from './constants';

export async function getMemeCollage(vTag, timestamp, comment, bottom=false) {
	const response = await requestBuilder(collagePort, collageBaseEndpoint, { vTag, timestamp, comment, bottom});
	return {
		memeS3Url: response.data.memeS3Url
	}
}

export async function getResultsData(url, count=frameCountDefault) {
	var port = puppeteerPort;
	var vTag = '';
	var title = '';
	var channel = '';
	var frames = [{ timestamp: 0, frame: "https://www.speedsecuregcc.com/uploads/products/default.jpg"}];
	var comments = [{ text: "", votes: 0}];
	
	await Promise.all([
		getFramesData(port, url, count).then(data => {
			vTag = vTag ? vTag : data.vTag;
			title = title ? title : data.title;
			channel = channel ? channel : data.channel;
			frames = data.frames;
		}),
		getCommentsData(port, url).then(data => {
			vTag = vTag ? vTag : data.vTag;
			title = title ? title : data.title;
			channel = channel ? channel : data.channel;
			comments = data.comments;
		})
	]);

	return {vTag, title, channel, frames, comments};	
}


async function getFramesData(port, url, count){
    const response = await requestBuilder(port, puppeteerBaseFrameEndpoint, { url, count });
    var i;
    var frames = [];
	for (i = 0; i < response.data.data.timestamps.length; i++) {
	  frames.push({ 
	  	timestamp: response.data.data.timestamps[i],
	  	frame: response.data.data.frames[i]
	  });
	}
    return {
    	vTag: response.data.data.vTag,
    	title: response.data.data.contentInfo.title,
    	channel: response.data.data.contentInfo.channel,
    	frames: frames,
    	count: frames.length
    }
}

async function getCommentsData(port, url){
    const response = await requestBuilder(port, puppeteerBaseCommentEndpoint + "/all", { url });

    return {
    	vTag: response.data.data.vTag,
    	title: response.data.data.contentInfo.title,
    	channel: response.data.data.contentInfo.channel,
    	comments: response.data.data.comments,
    	count: response.data.data.count
    }
}

const requestBuilder = async(port, url, data) => {
	return await axios({
		method: 'POST',
		url: 'http://localhost:' + port + url,
		headers: {
			"Content-Type": "application/json"
		}, 
		data: JSON.stringify(data)
	});
}
