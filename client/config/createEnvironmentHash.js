/* eslint header/header: "off" */
/* eslint @typescript-eslint/no-var-requires: "off" */
/* eslint @typescript-eslint/explicit-function-return-type: "off" */

'use strict';
const { createHash } = require('crypto');

module.exports = (env) => {
  const hash = createHash('md5');
  hash.update(JSON.stringify(env));

  return hash.digest('hex');
};
