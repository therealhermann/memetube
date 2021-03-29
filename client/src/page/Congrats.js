import { connect } from 'react-redux';
import Meme from '../component/Meme/Meme';

function Congrats(props) {
	console.log({props})
	return (
		<div>
		  <h1>Congrats!</h1>
	      <Meme title={props.title} memeS3Url={props.memeS3Url}/>
	    </div>
	);
}

const mapStateToProps = (state) => {
  return {
  	isLoading: state.isLoading,
    url: state.url,
    title: state.title,
    memeS3Url: state.memeS3Url
  };
};


export default connect(mapStateToProps, null)(Congrats);
