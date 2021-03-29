import React, { useState } from 'react';

import ArrowBack from "../../static/arrow_back_white_24dp.svg";
import ArrowForward from "../../static/arrow_forward_white_24dp.svg";
import './Frame.css';

function Frame(props) {
	const [index, setIndex] = useState(0);

	const raiseIndex = (index) => {
		let isTooHigh = index >= props.frames.length - 1;
		let newIndex = isTooHigh ? 0 : index + 1;
		setIndex(newIndex);
		props.onIndexChange(newIndex);
	}

	const reduceIndex = (index) => {
		let isTooLow = index <= 0;
		let newIndex = isTooLow ? props.frames.length - 1 : index - 1;
		setIndex(newIndex);
		props.onIndexChange(newIndex);
	}
	return (
		<div className="Frame"> 
			<header className="Frame-content-info">
				<h1>{ props.title }</h1>
			</header>

			<div className="Frame-wrapper">
				<div className="Frame-wrapper-frame">
					<button className="Frame-wrapper-nav-btn" onClick={() => reduceIndex(index)} type="button">
						<img src={ArrowBack} alt="prev"/>
					</button>
					<img src={ props.frames[index].frame } alt="{ props.title }"/>
					<button className="Frame-wrapper-nav-btn" onClick={() => raiseIndex(index)} type="button">
						<img src={ArrowForward} alt="Next"/>
					</button>
				</div>
			</div>
			<footer className="Frame-content-info">
				<h4>{ props.channel }</h4>
			</footer>
		</div>
	);
}

export default Frame;
