import React, { useState } from 'react';
import './Meme.css';

function Meme(props) {

	return (
		<div className="Meme"> 
			<header className="Meme-header">
				<h1> {props.title} </h1>
			</header>
			<div className="Meme-wrapper">
				<div className="Meme-wrapper-Meme">
					<img src={ props.memeS3Url } alt="D&D Story: Ep 19- Demanding Answers"/>

				</div>
			</div>
		</div>
	);
}

export default Meme;
