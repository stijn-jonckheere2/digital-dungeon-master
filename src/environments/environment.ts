// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,

  database: {
    apiKey: "AIzaSyBqhxlpbErCF557lZd0-0qsXPubgMZzC_4",
    authDomain: "digital-dungeon-master-dev.firebaseapp.com",
    databaseURL: "https://digital-dungeon-master-dev.firebaseio.com",
    projectId: "digital-dungeon-master-dev",
    storageBucket: "digital-dungeon-master-dev.appspot.com",
    messagingSenderId: "259994406067"
  },

  authZero: {
    clientID: "w2DOJNRWBOxnCfe2oYYSowIS5U8C4PaZ",
    domain: "midlin.eu.auth0.com",
    responseType: "token id_token",
    audience: "https://midlin.eu.auth0.com/userinfo",
    redirectUri: "http://localhost:4200/redirecting",
    scope: "openid"
  }

};
