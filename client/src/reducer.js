import { 
  YOUTUBE_PUPPETEER_REQUEST,
  YOUTUBE_PUPPETEER_SUCCESS,
  MEMIFY_REQUEST,
  MEMIFY_SUCCESS
 } from './actions';

const initialState = {
  isLoading: false,
  vTag: "",
  title: "",
  channel: "",
  url: "",
  frames: [{ timestamp: 0, frame: "https://www.speedsecuregcc.com/uploads/products/default.jpg"}],
  comments: [{ text: "", votes: 0}],
  memeS3Url: "https://www.speedsecuregcc.com/uploads/products/default.jpg"
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case YOUTUBE_PUPPETEER_REQUEST:
      console.log({action})
      return {
        ...state,
        isLoading: action.isLoading,
        url: action.url        
      }
    case YOUTUBE_PUPPETEER_SUCCESS:
      console.log({action})
      return {
        ...state,
        isLoading: action.isLoading,
        channel: action.channel,
        vTag: action.vTag,
        title: action.title,
        frames: action.frames,
        comments: action.comments
      }
    case MEMIFY_REQUEST:
      return {
        ...state,
        isLoading: action.isLoading
      }
    case MEMIFY_SUCCESS:
      console.log("success")
      console.log({action})
      return {
        ...state,
        isLoading: action.isLoading,
        memeS3Url: action.memeS3Url
      }
    default:
      return state
  }
}
