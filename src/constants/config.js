const isDevEnv = process.env.NODE_ENV === 'development';

export default {
  // App Details
  appName: 'Assignment',

  // Build Configuration - eg. Debug or Release?
  isDevEnv,

  // Date Format
  dateFormat: 'Do MMM YYYY',

  // Api Key
  apiKey: '22907ab1c4830499c6f448ee8846a29c',

  // Images Base Url
  imageBaseUrl: 'https://image.tmdb.org/t/p/w500',

  // Api
  apiBaseUrl: isDevEnv
    ? 'https://api.themoviedb.org/3'
    : 'https://api.themoviedb.org/3',
};
