const nextEnv = require('next-env');
const dotenvLoad = require('dotenv-load');
const withSass = require('@zeit/next-sass');

dotenvLoad();

const withNextEnv = nextEnv();
module.exports = withNextEnv(withSass());
