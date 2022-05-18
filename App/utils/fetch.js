var axios = require('axios').default;

/**
 * Attaches a given access token to a MS Graph API call
 * @param endpoint: REST API endpoint to call
 * @param accessToken: raw access token string
 */
async function fetch(endpoint, accessToken) {
  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };

  console.log('request made to web API at: ' + new Date().toString());

  try {
    const response = await axios.get(endpoint, options);
    return await response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = fetch;
