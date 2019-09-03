const util = require('./util');

const mardnode = {
  name: 'mardnode',
  script: 'npm',
  args: 'start',
  instances: 1,
  autorestart: false,
  watch: false,
  max_memory_restart: '250M',
  out_file: '/dev/null',
  error_file: '/dev/null',
  env: {
    NODE_ENV: 'development',
    MARDNODE_DB: 'botDev',
    MARDNODE_LOG_EXTREME: 'false',
    MARDNODE_LOG_FLUSH_TIME: '10000',
    MARDNODE_GO_HORSE: 'go'
  },
  env_production: {
    NODE_ENV: 'production',
    MARDNODE_DB: 'bot',
    MARDNODE_LOG_EXTREME: 'false',
    MARDNODE_LOG_FLUSH_TIME: '10000',
    MARDNODE_GO_HORSE: 'go'
  }
};

const argv = util.parseArgv();
const environment = argv.env || 'development';

if (environment === 'development') {

} else if (environment === 'production') {

} else {
  throw new Error(`env=${environment} is not supported`);
}

module.exports = {
  apps: [mardnode]
};