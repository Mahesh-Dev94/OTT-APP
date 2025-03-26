export const ROOT_URL_AWS =
  'https://vt1qpaizsf.execute-api.us-west-2.amazonaws.com/OTTAppMediaInterface';
const S3_URL = 'https://s3.us-west-2.amazonaws.com/rsi.content.media/';
export const getHomePageDetailsUrl =
  'https://vt1qpaizsf.execute-api.us-west-2.amazonaws.com/OTTAppMediaInterface/getHomePageDetails';
const cloud_url = 'https://d2c2f55v22jux4.cloudfront.net/';
export const getMovieDetailInfoUrl =
  'https://vt1qpaizsf.execute-api.us-west-2.amazonaws.com/OTTAppMediaInterface/getMovieDetailInfo';
export const getMediaMetaInfoById =
  'https://vt1qpaizsf.execute-api.us-west-2.amazonaws.com/OTTAppMediaInterface/getMediaMetaInfoById';

export const getLatestReleases =
  'https://vt1qpaizsf.execute-api.us-west-2.amazonaws.com/OTTAppMediaInterface/getLatestReleases';

  export const Default_Search='https://vt1qpaizsf.execute-api.us-west-2.amazonaws.com/OTTAppMediaInterface/getDefaultSearchPageResponse';

  
export const getImageUrl = (path, key = 'uri', width = 'w500') => {
  return {[key]: `${cloud_url}${path}`}; // S3_URL+path ;

};
export const dashMediaName = 'dash-iso_config_media_vod_pkg';
export const hlsMediaName = 'hls_config_media_vod_pkg';
export const mediaOutput = (outputs, type) => {
  const dashData = outputs.find(data => data.packageConfigId === type);
  return dashData !== undefined ? dashData.assetUrl : null;
};
