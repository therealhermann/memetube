import React, { useState } from 'react';
import { youtubeExp } from '../../constants';
import './Search.css';

function Search(props) {
	const [url, setUrl] = useState(props.url);

	const onSearch = () => {
		if (isYouTubeUrlValid(url)) {
			let isLoading = true;
			props.search(isLoading, url);
		} else {
			alert("Bad YouTube url request");
		}
	}

	const isYouTubeUrlValid = (url) => { return youtubeExp.test(url); }

	return (
		<div className='Search'>
			<form className="d-flex" onSubmit={() => onSearch() }>
		        <input 
		        	className="form-control"
		        	type="search"
		        	placeholder="Search"
		        	aria-label="Search"
		        	value={url}
		        	onChange={e => setUrl(e.target.value)}/>
		        <button className="btn btn-success" type="button" onClick={() => onSearch() }>Meme</button>
		     </form>
		</div>
	);
}

export default Search;
