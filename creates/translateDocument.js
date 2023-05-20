const http = require('https'); // require('http') if your URL is not https
const FormData = require('form-data');

const stashPDFfunction = (z, bundle) => {
  // use standard auth to request the file
  const filePromise = z.request({
    url: bundle.inputData.downloadUrl,
    raw: true,
  });
  // and swap it for a stashed URL
  return z.stashFile(filePromise);
};

const perform = async (z, bundle) => {
  
  if(!'target_language' in bundle.inputData)
  {
    return { 
      error: false,
      file: ''
    }
  }
  
  // bundle.inputData.file will in fact be an URL where the file data can be
  // downloaded from which we do via a stream
  //const stream = await makeDownloadStream(bundle.inputData.file, z);

  //const form = new FormData();
  //form.append('file', stream);

  // All set! Resume the stream
  //stream.resume();

  let response;
  let options;
  let results;

  //create GS bucket. Ignore 409 error that the bucket is already created.
  options = {
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

  response  = await z.request(options);

  results = response.json;
  
  if (results.error) {
    if (
      !(results.error.code === 409 &&
      results.error.message ===
        'Your previous request to create the named bucket succeeded and you already own it.')
      )
    {
      throw new z.errors.Error(results.error.message, results.error.code);
    }
  }
  z.console.log(bundle.inputData.file);

  //Translate Document Stream and Save Translated File to GS
  const location = 'us-east1-b';
  options = {
    skipThrowForStatus: true,
    url: `https://translation.googleapis.com/v3/projects/${bundle.authData.project_id}/locations/${location}:translateDocument`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${bundle.authData.access_token}`,
    },
    body: {
      target_language_code: bundle.inputData.target_language,
      document_input_config: {
        mimeType: 'application/pdf',
        content: bundle.inputData.file
      },
      document_output_config: {
        gcsDestination: {
          outputUriPrefix:`gs://${bundle.authData.project_id}-bucket`
        }
      },
      isTranslateNativePdfOnly: true
    },
  };
  response = await z.request(options);
  results = response.json;

  // if (results.error) {
  //   throw new z.errors.Error(results.error.message, results.error.code);
  // }
    
  return response.data;
  
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
        key: 'file',
        required: true,
        type: 'file',
        label: 'File'
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
    sample: {
      file: 'SAMPLE FILE',
      error: false
    }
  },
};
