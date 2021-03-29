import React, { useState } from 'react';
import ArrowBack from "../../static/arrow_back_white_24dp.svg";
import ArrowForward from "../../static/arrow_forward_white_24dp.svg";

import './Comment.css';

function Comment(props) {
	const [index, setIndex] = useState(0);

	const raiseIndex = (index) => {
		let isTooHigh = index >= props.comments.length - 1;
		let newIndex = isTooHigh ? 0 : index + 1;
		setIndex(newIndex);
		props.onIndexChange(newIndex);
	}

	const reduceIndex = (index) => {
		let isTooLow = index <= 0;
		let newIndex = isTooLow ? props.comments.length - 1 : index - 1;
		setIndex(newIndex);
		props.onIndexChange(newIndex);
	}

	return (
		<div className="Comment">
			<header className="Comment-header">
				<h3>Select a comment:</h3>
			</header>
			<div className="Comment-wrapper">
				<button className="Comment-wrapper-nav-btn" onClick={() => reduceIndex(index)} type="button">
					<img src={ArrowBack} alt="prev"/>
				</button>
				<div className="Comment-wrapper-comment">
					
					<p>{ props.comments[index].text } <span>{ props.comments[index].votes }</span></p>
				</div>
				<button className="Comment-wrapper-nav-btn" onClick={() => raiseIndex(index)} type="button">
					<img src={ArrowForward} alt="Next"/>
				</button>
			</div>
		</div>
	);
}

export default Comment;
