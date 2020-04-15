const nextEnv = require('next-env');
const dotenvLoad = require('dotenv-load');

dotenvLoad();

const withNextEnv = nextEnv();

module.exports = withNextEnv({
  // Your Next.js config.
});

const withSass = require('@zeit/next-sass');
module.exports = withSass({ });
