const authentication = require('./authentication');
const translateDocumentCreate = require('./creates/translate_document.js');

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,
  creates: { [translateDocumentCreate.key]: translateDocumentCreate },
};
