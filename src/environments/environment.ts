// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

//exp//ort const environment = {
//  production: false,
//  domain: 'http://localhost:4200',
//  apiUrl: 'http://api-dev.oceano.com',
//  dsUrl: 'http://ds-dev.oceano.com',
//  ssoLoginUrl: 'http://sso-dev.oceano.com/sso/login',
//  pathPublic: 'public',
//  pathLogin: 'login',
//  pathRegistro: 'registro',
//  pathPassRecovery: 'recuperar'
//};

export const environment = {
  production: false,
  
  domain: 'http://localhost:4200',
  apiUrl: 'http://api-dev.oceano.com',
  dsUrl: 'http://ds-dev.oceano.com',
  ssoUrl: 'https://sso.oceano.com',
  suiteUrl: 'http://suite.oceano.com',
  
  pathPublic: 'public',
  pathLogin: 'login',
  pathRegistro: 'registro',
  pathPassRecovery: 'recuperar',
  pathTermsAndConditions: 'terminos-y-condiciones',

  pathCampus: 'campus',
  pathAcount: 'mi-cuenta',
  pathCourses: 'mis-cursos',
  pathCertificates: 'mis-certificaciones',
  pathCertificateRequest: 'pedir-certificacion',
  pathPasswordChange: 'cambiar-contrasena',

  ssoLoginUrl: 'http://sso-dev.oceano.com/sso/login',
  ssoRedirectUrl: 'https://sso.oceano.com/sso/redirect?licencia_id=',

  apiPasswordChange: '/api/user/change_password/',

  recoveryMail: '/api/user/forgot_password',
  
  newPassword: '/api/user/forgot_password/change',
  getConsumerProducts: 'http://ds-dev.oceano.com/api/product/stamp_user?stamp_id=4&user_id=',
  // getConsumerProducts: './mocks/list-products.json',

  icon_key: '/assets/img/icon-key.png'
};
