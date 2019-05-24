// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: true,

  database: {
    apiKey: 'AIzaSyA8J2ryEam-6m4WAoM3k1CT75ylhQPUWLQ',
    authDomain: 'digital-dungeon-master.firebaseapp.com',
    databaseURL: 'https://digital-dungeon-master.firebaseio.com',
    projectId: 'digital-dungeon-master',
    storageBucket: 'digital-dungeon-master.appspot.com',
    messagingSenderId: '165971576370',
  },

  authZero: {
    clientID: 'sPwD5NzgX12pkJQoyUVNqdDT9usmuwNC',
    domain: 'midlin.eu.auth0.com',
    responseType: 'token id_token',
    audience: 'https://midlin.eu.auth0.com/userinfo',
    redirectUri: 'http://ddm.netlify.com/redirecting',
    scope: 'openid',
    prompt: 'none'
  }

};
