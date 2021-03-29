import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Landing from './Landing';
import Frame from '../component/Frame/Frame';
import Comment from '../component/Comment/Comment';

import { memifyRequest, memifySuccess } from '../actions';
import { getMemeCollage } from '../puppeteerHandler';


function Result(props) {
	console.log({ props })
	const history = useHistory();
	const [frameIndex, setFrameIndex] = useState(0);
	const [commentIndex, setCommentIndex] = useState(0);

	const onMeme = async () => {
		if (props.url) {
			props.requestMeme(true);
			const data = await getMemeCollage(
				props.vTag, 
				props.frames[frameIndex].timestamp, 
				props.comments[commentIndex].text
			);
			console.log({data})
			props.setMeme(false, data.memeS3Url);
			props.history.push('/congrats');
		}
	}

	return (
		<div>
		  <Landing/>
		  <Frame title={props.title} channel= {props.channel} frames={props.frames} onIndexChange={setFrameIndex}/>
	      <Comment comments={props.comments} onIndexChange={setCommentIndex}/>
	      <button className="App-meme-button btn btn-info" type="button" onClick={() => onMeme() }>Meme</button>
	    </div>
	);
}

const mapStateToProps = (state) => {
	console.log({state})
  return {
    isLoading: state.isLoading,
    vTag: state.vTag,
    url: state.url,
    title: state.title,
    channel: state.channel,
    comments: state.comments,
    frames: state.frames,
  };
};

const mapDispatchToProps = (dispatch) => {
	return {
		requestMeme: (isLoading) => dispatch(memifyRequest(isLoading)),
		setMeme: (isLoading, memeS3Url) => dispatch(memifySuccess(isLoading, memeS3Url))
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Result);
