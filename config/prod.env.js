'use strict';
module.exports = {
  NODE_ENV: '"production"',
  RAVEN_DSN: JSON.stringify(process.env.RAVEN_DSN) || 'null'
};
