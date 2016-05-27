import OAuth2PasswordGrant from 'ember-simple-auth/authenticators/oauth2-password-grant';

export default OAuth2PasswordGrant.extend({
  // serverTokenEndpoint: 'http://localhost:3030/api/auth/local',
  // jwt
  // serverTokenEndpoint: 'http://localhost:3030/api/auth/token',
  serverTokenEndpoint: 'http://localhost:3030/auth/pass',

  // loopback
  // serverTokenEndpoint: 'http://localhost:3000/oauth/authorize',
  clientId: "ember-client"
});
