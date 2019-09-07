const util = require('./lib/util');

const mardnode = {
  name: 'mardnode',
  script: 'bin/main.js',
  instances: 1,
  autorestart: true,
  watch: false,
  max_memory_restart: '250M',
  out_file: '/dev/null',
  error_file: '/dev/null',
  env: {
    NODE_ENV: 'development',
    MARDNODE_DB: 'mardnodeDev'
  },
  env_production: {
    NODE_ENV: 'production',
    MARDNODE_DB: 'mardnode'
  }
};

function makeLogger(app) {
  return {
    name: `${app.name}-log`,
    script: 'npm',
    args: `run transporter`,
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '50M',
    out_file: '/dev/null',
    error_file: '/dev/null',
    env: {
      APP_NAME: app.name,
      FORCE_COLOR: true
    },
    env_production: {
      APP_NAME: app.name,
      FORCE_COLOR: true
    }
  };
}

const argv = util.parseArgv();
const environment = argv.env || 'development';

if (environment === 'development') {
  mardnode.name = 'mardnodeDev';
} else if (environment === 'production') {
  mardnode.name = 'mardnode';
  mardnode.exec_mode = 'cluster';
} else {
  throw new Error(`env=${environment} is not supported`);
}

module.exports = {
  apps: [mardnode, makeLogger(mardnode)]
};