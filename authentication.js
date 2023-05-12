module.exports = {
  type: 'oauth2',
  test: {
    body: { project_id: '{{bundle.authData.project_id}}' },
    headers: {
      Authorization: 'Bearer {{bundle.authData.access_token}}',
      'X-PROJECT-ID': '{{bundle.authData.project_id}}',
    },
    method: 'POST',
    params: { q: 'My name is Jeff', target: 'de' },
    url: 'https://translation.googleapis.com/language/translate/v2',
  },
  fields: [
    {
      computed: false,
      key: 'project_id',
      required: true,
      label: 'Project ID',
      type: 'string',
      helpText: 'You can get this ID Number from Google Cloud Console',
      default: 'translation-386217',
    },
  ],
  oauth2Config: {
    authorizeUrl: {
      url: 'https://accounts.google.com/o/oauth2/auth',
      params: {
        client_id: '{{process.env.CLIENT_ID}}',
        state: '{{bundle.inputData.state}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        response_type: 'code',
      },
    },
    getAccessToken: {
      body: {
        code: '{{bundle.inputData.code}}',
        client_id: '{{process.env.CLIENT_ID}}',
        client_secret: '{{process.env.CLIENT_SECRET}}',
        grant_type: 'authorization_code',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json',
      },
      method: 'POST',
      url: 'https://oauth2.googleapis.com/token',
    },
    refreshAccessToken: {
      body: {
        refresh_token: '{{bundle.authData.refresh_token}}',
        grant_type: 'refresh_token',
        client_id: '{{process.env.CLIENT_ID}}',
        client_secret: '{{process.env.CLIENT_SECRET}}',
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        accept: 'application/json',
      },
      method: 'POST',
      url: 'https://oauth2.googleapis.com/token',
    },
    scope:
      'https://www.googleapis.com/auth/cloud-translation https://www.googleapis.com/auth/cloud-platform',
    autoRefresh: false,
  },
};
