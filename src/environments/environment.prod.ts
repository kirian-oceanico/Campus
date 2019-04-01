export const environment = {
  production: true,
  
  domain: 'https://campus.oceanomedicina.com',
  apiUrl: 'https://api.oceano.com',
  dsUrl: 'https://ds.oceano.com',
  ssoUrl: 'https://sso.oceano.com',
  suiteUrl: 'https://suite.oceano.com',
  
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

  ssoLoginUrl: 'https://sso.oceano.com/sso/login',
  ssoRedirectUrl: 'https://sso.oceano.com/sso/redirect?licencia_id=',

  apiPasswordChange: '/api/user/change_password/',

  recoveryMail: '/api/user/forgot_password',
  
  newPassword: '/api/user/forgot_password/change',
  getConsumerProducts: 'https://ds.oceano.com/api/product/stamp_user?stamp_id=4&user_id=',
  // getConsumerProducts: './mocks/list-products.json',

  icon_key: '/assets/img/icon-key.png'
};
