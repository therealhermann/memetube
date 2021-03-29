import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { 
	youtuePuppeteerRequest,
	youtuePuppeteerSuccess,
	memifyRequest,
	memifySuccess
} from '../actions';
import { getResultsData } from '../puppeteerHandler';

import Search from '../component/Search/Search';


function Landing(props) {
	const history = useHistory();

	const search = async (isLoading, url) => {
		props.search(true, url);
		const data = await getResultsData(url);

		props.setResults(false, data.vTag, data.channel, data.title, data.frames, data.comments);

		if (props.history) {
			props.history.push('/result');
		}
	}

	return (
		<div>
		  <Search
		  	url={props.url}
		  	isLoading={props.isLoading}
		  	search={search}/>
	    </div>
	);
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.isLoading,
    url: state.url
  };
};

const mapDispatchToProps = (dispatch) => {
	return {
		search: (isLoading, url) => dispatch(youtuePuppeteerRequest(isLoading, url)),
		setResults: (isLoading, vTag, channel, title, frames, comments) => dispatch(youtuePuppeteerSuccess(isLoading, vTag, channel, title, frames, comments)),
	}
};

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
