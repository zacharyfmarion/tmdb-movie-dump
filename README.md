# TMDB Movie Dump

This is a small node project to download all the movies in the TMDB database.

# Use

First you need to get an API key from tmdb as described [here](https://developers.themoviedb.org/3/getting-started/introduction). Then assign this key to a value called `TMDB_TOKEN` in your environment. You can run the cli with `node dist/index.js`. There are several command line arguments that can be accessed with `node dist/index.js --help`:

```
Options:

  -V, --version                output the version number
  -m, --max-entries [entries]  Max number of entries to process
  -o, --out-file [filename]    File name for the json dump
  -h, --help                   output usage information
```

## Developing

To run the project you need to install the dependencies with `npm install` or `yarn install` install the babel-cli with `yarn global add babel-cli`. Then you can run `yarn start` or `npm start` to begin the download process.

## Building

The production version can be built with `yarn build`. This will run babel and compile the files in `src` into the `dist` directory.
