import {
  getHomePageDetailsUrl,
  getMovieDetailInfoUrl,
  getMediaMetaInfoById,
  getLatestReleases,
  Default_Search
} from './url';
import axios from 'axios';
import debounce from 'lodash.debounce';
import alert from '../component/Utils/alert';

const handleErrors = response => {
  if (!response.ok) throw Error(response.statusText);
  return response;
};

export const requestMovieScreen = () => {
  fetch(getHomePageDetailsUrl)
    .then(response => response.json())
    .then(result => {
      // console.log('result---',result)
      return result;
    })
    .catch(error => {
      console.error(error);
    });
};

export const requestMovieSwimlane = async () => {
  try {
    const response = await axios.get(getHomePageDetailsUrl);
    return response.data;
  } catch (error) {
    console.error('###-----', error);
  }
};

// export const requestMovieDetailScreen = (id, callback, type) => {
//   const postBody = {
//     method: 'POST',
//     header: { 'Content-Type': 'application/json' },
//     body: JSON.stringify({
//       mediaId: id,
//       recommendation: type ? true : false,
//       credits: type ? true : false,
//     }),
//   };
//   fetch(getMovieDetailInfoUrl, postBody)
//     .then(response => response.json())
//     .then(result => {
//       callback(result);
//     })
//     .catch(error => {
//       console.error(error);
//     });
// };

export const requestMovieDetailScreen = (id, callback, type) => {
  const requestBody = {
    mediaId: id,
    recommendation: type ? true : false,
    credits: type ? true : false,
  };

  axios
    .post(getMovieDetailInfoUrl, requestBody)
    .then(response => {
      callback(response.data);
    })
    .catch(error => {
      throw error;
    });
};

export const requestMovieDetails = (id, type) => {
  return new Promise((resolve, reject) => {
    // console.log('on detail screen')
    const requestBody = {
      mediaId: id,
      recommendation: true,
      credits: true,
    };

    axios
      .post(getMovieDetailInfoUrl, requestBody)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
    // }
  });
};

export async function requestGetLatest() {
  const postBody = {
    method: 'GET',
    header: { 'Content-Type': 'application/json' },
  };
  try {
    const responseData = await fetch(getLatestReleases, postBody).then(
      response => response.json(),
    );
    return responseData;
  } catch (error) {
    throw error;
  }
}

export const requestMediaMetaInfo = (id, token, callback) => {

  const postBody = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      mediaUuid: id,
    }),
  };
  // console.log('requestMediaMetaInfo postBody', postBody);
  fetch(getMediaMetaInfoById, postBody)
    .then(response => response.json())
    .then(result => {
      // console.log('requestMediaMetaInfo result-----', result)
      if (result.message === 'Unauthorized') {
        alert('Access is Unauthorized!')
      } else if (result.message === 'Access Denied') {
        alert('Access is Unauthorized!')
      } else {
        callback(result);
      }

    })
    .catch(error => {
      console.error('requestMediaMetaInfo---', error);
    });
};



export const SearchDefault = (callback) => {

  const postBody = {
    method: 'GET'
  };
  console.log('postBody', postBody);
  fetch(Default_Search, postBody)
    .then(response => response.json())
    .then(result => {
      callback(result);
    })
    .catch(error => {
      console.error('requestMediaMetaInfo---', error);
    });
};

export const SearchByFilter = (filter, callback1) => {

  const postBody = {
    method: 'POST',
    body: JSON.stringify({
      query: {
        query_string: {
          query: `*${filter}*`,
          fields: ["title^2", "actors", "directors"]
        }
      }
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic YWRtaW46QWRtaW5AMTIzNA==`,
    },
  };
  console.log('postBody', postBody);
  fetch(
    `https://search-movies-search-cbollzxsj5qgxetpqolmd7srpq.us-west-2.es.amazonaws.com/movies-search/_search?pretty=true&filter_path=hits.hits._source.id,hits.hits._source.title,hits.hits._source.mediaUuid,hits.hits._source.poster_path`
    // `https://search-movies-search-cbollzxsj5qgxetpqolmd7srpq.us-west-2.es.amazonaws.com/movies-search/_search?q=title:*${filter}*&pretty=true&filter_path=hits.hits._source.id,hits.hits._source.title,hits.hits._source.mediaUuid,hits.hits._source.poster_path`
    , postBody)
    .then(response => response.json())
    .then(result => {
      callback1(result);
    })
    .catch(error => {
      console.error('requestMediaMetaInfo---', error);
    });
};
