#!/usr/bin/env node
'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

// Get the id of the latest movie, which is constantly updated on the API
var getLatestMovieId = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
    var res;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return (0, _tmdbRequest2.default)('/movie/latest');

          case 3:
            res = _context.sent;
            return _context.abrupt('return', res.id);

          case 7:
            _context.prev = 7;
            _context.t0 = _context['catch'](0);

            console.log('Could not get the latest movie');
            return _context.abrupt('return', -1);

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 7]]);
  }));

  return function getLatestMovieId() {
    return _ref.apply(this, arguments);
  };
}();

// Get movies starting from id 1 all the way until there are no more ids


var getMovies = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
    var movies, latestMovieId, movieIndex, numMovies, res;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            movies = [];
            _context2.next = 3;
            return getLatestMovieId();

          case 3:
            latestMovieId = _context2.sent;
            movieIndex = 1;
            numMovies = 0;
            // We keep iterating until we get to the latest movie

          case 6:
            if (!(!_commander2.default.maxEntries || numMovies <= parseInt(_commander2.default.maxEntries))) {
              _context2.next = 19;
              break;
            }

            _context2.prev = 7;
            _context2.next = 10;
            return (0, _tmdbRequest2.default)('/movie/' + movieIndex);

          case 10:
            res = _context2.sent;

            if (validMovie(res)) {
              movies.push(processMovie(res));
              numMovies++;
            }
            _context2.next = 16;
            break;

          case 14:
            _context2.prev = 14;
            _context2.t0 = _context2['catch'](7);

          case 16:
            movieIndex++;
            _context2.next = 6;
            break;

          case 19:
            saveMovies(movies);

          case 20:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[7, 14]]);
  }));

  return function getMovies() {
    return _ref2.apply(this, arguments);
  };
}();

var _tmdbRequest = require('./tmdbRequest');

var _tmdbRequest2 = _interopRequireDefault(_tmdbRequest);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_commander2.default.version('0.1.0').option('-m, --max-entries [entries]', 'Max number of entries to process').option('-o, --out-file [filename]', 'File name for the json dump').parse(process.argv);

// Attributes of the movie object that we will save


/**
 * Small node script to save all movies stored in the tMDB database in a flat
 * JSON format that can be read by pandas for data processing
 *
 * @author Zachary Marion
 */

var SAVED_ATTRIBUTES = ['id', 'budget', 'revenue', 'title', 'popularity', 'vote_average', 'vote_count'];

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
  return Object.keys(movie).filter(function (key) {
    return SAVED_ATTRIBUTES.includes(key);
  }).reduce(function (obj, key) {
    obj[key] = movie[key];
    return obj;
  }, {});
}

/**
 * Save the movies to disk
 * @param {array} movies - Array of tMDB movie objects
 */
function saveMovies(movies) {
  _fs2.default.writeFile(_commander2.default.outFile || 'movies.json', JSON.stringify({ movies: movies }), function (err) {
    if (err) {
      console.log('Failed to save movies');
      return;
    }
    console.log('Movies saved');
  });
}

getMovies();