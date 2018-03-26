#!/usr/bin/env node

/**
 * Small node script to save all movies stored in the tMDB database in a flat
 * JSON format that can be read by pandas for data processing
 *
 * @author Zachary Marion
 */

import tmdbRequest from './tmdbRequest';
import program from 'commander';
import fs from 'fs';

program
  .version('0.1.0')
  .option('-m, --max-entries [entries]', 'Max number of entries to process')
  .parse(process.argv);

// Attributes of the movie object that we will save
const SAVED_ATTRIBUTES = [
  'id',
  'budget',
  'revenue',
  'title',
  'popularity',
  'vote_average',
  'vote_count',
];

/**
 * Determine whether a movie should be added to the dump based on it's attributes
 * @param {object} movie - The tMDB movie object returned from the API
 * @returns {boolean}
 */
function validMovie(movie) {
  return !movie.adult && movie.status === 'Released';
}

/**
 * Process movie by returning attributes only whitelisted in SAVE_ATTRIBUTES
 * @param {object} movie - The tMDB movie object returned from the API
 * @returns {object}
 */
function processMovie(movie) {
  return Object.keys(movie)
    .filter(key => SAVED_ATTRIBUTES.includes(key))
    .reduce((obj, key) => {
      obj[key] = movie[key];
      return obj;
    }, {});
}

/**
 * Save the movies to disk
 * @param {array} movies - Array of tMDB movie objects
 */
function saveMovies(movies) {
  fs.writeFile('movies.json', JSON.stringify({ movies: movies }), err => {
    if (err) {
      console.log('Failed to save movies');
      return;
    }
    console.log('Movies saved');
  });
}

// Get the id of the latest movie, which is constantly updated on the API
async function getLatestMovieId() {
  try {
    const res = await tmdbRequest(`/movie/latest`);
    return res.id;
  } catch (err) {
    console.log('Could not get the latest movie');
    return -1;
  }
}

// Get movies starting from id 1 all the way until there are no more ids
async function getMovies() {
  let movies = [];
  const latestMovieId = await getLatestMovieId();
  let movieIndex = 1;
  let numMovies = 0;
  // We keep iterating until we get to the latest movie
  while (movieIndex <= 10) {
    if (program.maxEntries && numMovies >= parseInt(program.maxEntries)) break;
    try {
      const res = await tmdbRequest(`/movie/${movieIndex}`);
      if (validMovie(res)) {
        movies.push(processMovie(res));
        numMovies++;
      }
    } catch (err) {}
    movieIndex++;
  }
  saveMovies(movies);
}

getMovies();
