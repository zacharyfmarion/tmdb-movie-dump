import axios from 'axios';

// Get API key from the environment
const API_KEY = process.env.TMDB_TOKEN;

const ROOT_PATH = 'https://api.themoviedb.org/3';

// Auth params that will be merged into all tmdb queries
const rootParams = { api_key: API_KEY };

export default (path, params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await axios.get(ROOT_PATH + path, {
        params: {
          ...rootParams,
          ...params,
        },
      });
      resolve(result.data);
    } catch (err) {
      reject(err);
    }
  });
};
