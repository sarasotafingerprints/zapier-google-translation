const perform = async (z, bundle) => {
  let options = {
    skipThrowForStatus: true,
    url: 'https://storage.googleapis.com/storage/v1/b',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${bundle.authData.access_token}`,
    },
    params: {
      project: bundle.authData.project_id,
      predefinedAcl: 'authenticatedRead',
      predefinedDefaultObjectAcl: 'authenticatedRead',
      projection: 'noAcl',
    },
    body: {
      name: `${bundle.authData.project_id}-bucket`,
    },
  };

  return z.request(options).then((response) => {
    //response.throwForStatus();

    const results = response.json;
    if (results.error) {
      if (
        results.error.code === 409 &&
        results.error.message ===
          'Your previous request to create the named bucket succeeded and you already own it.'
      ) {
        response.skipThrowForStatus = true; //V10 only
      } else {
        throw new z.errors.Error(results.error.message, results.error.code);
      }
    }

    //todo: get file contents
    //const content = 'Hello world!';
    //const url = await z.stashFile(content, content.length, 'hello.txt', 'text/plain');

    // You can do any parsing you need for results here before returning them
    options = {
      skipThrowForStatus: true,
      url: `https://storage.googleapis.com/upload/storage/v1/b/${bundle.authData.project_id}-bucket/o`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${bundle.authData.access_token}`,
      },
      params: {
        name: 'file',
        uploadType: 'media',
      },
      body: {
        contentType: '',
      },
    };
    return z.request(options).then((response) => {
      const results = response.json;
      if (results.error) {
        throw new z.errors.Error(results.error.message, results.error.code);
      }

      // You can do any parsing you need for results here before returning them

      return results;
    });
  });
};

module.exports = {
  key: 'translate_document',
  noun: 'Document',
  display: {
    label: 'Translate Document',
    description: 'Translates a Document',
    hidden: false,
  },
  operation: {
    inputFields: [
      {
        key: 'file_uri',
        label: 'File URI',
        type: 'string',
        helpText: 'URI for a file to be translated.',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'target_language',
        label: 'Desired Language',
        type: 'string',
        choices: [
          { sample: 'German', value: 'de', label: 'German' },
          { sample: 'French', value: 'fr', label: 'French' },
          { sample: 'Italian', value: 'it', label: 'Italian' },
          { sample: 'Spanish', value: 'es', label: 'Spanish' },
        ],
        required: false,
        list: false,
        altersDynamicFields: false,
      },
    ],
    perform: perform,
  },
};
