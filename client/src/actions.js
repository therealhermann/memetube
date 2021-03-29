export const YOUTUBE_PUPPETEER_REQUEST = 'YOUTUBE_PUPPETEER_REQUEST';
export const YOUTUBE_PUPPETEER_SUCCESS = 'YOUTUBE_PUPPETEER_SUCCESS';
export const MEMIFY_REQUEST = 'MEMIFY_REQUEST';
export const MEMIFY_SUCCESS = 'MEMIFY_SUCCESS';

export function youtuePuppeteerRequest(isLoading, url) {
	return {
     type: YOUTUBE_PUPPETEER_REQUEST,
     isLoading,
     url
	}
}

export function youtuePuppeteerSuccess(isLoading, vTag, channel, title, frames, comments) {
   return {
     type: YOUTUBE_PUPPETEER_SUCCESS,
     vTag,
     channel,
     isLoading,
     title,
     frames,
     comments,
   }
}

export function memifyRequest(isLoading) {
   return {
     type: MEMIFY_REQUEST,
     isLoading
   }
}

export function memifySuccess(isLoading, memeS3Url) {
  console.log("success")
  console.log(memeS3Url)
   return {
     type: MEMIFY_SUCCESS,
     isLoading,
     memeS3Url
   }
}
