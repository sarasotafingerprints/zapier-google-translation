const authentication = require('./authentication');
const translateDocumentCreate = require('./creates/translate_document.js');

const hydrators = require('./hydrators');
const newFile = require('./triggers/newFile');
const uploadFileV10 = require('./creates/uploadFile_v10');


module.exports = {
  // This is just shorthand to reference the installed dependencies you have.
  // Zapier will need to know these before we can upload.
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,

  // Any hydrators go here
  hydrators,

  // If you want your triggers to show up, you better include it here!
  triggers: {
    [newFile.key]: newFile,
  },

  // If you want your creates to show up, you better include it here!
  creates: {
    [uploadFileV10.key]: uploadFileV10,
    [translateDocumentCreate.key]: translateDocumentCreate
  },
};

