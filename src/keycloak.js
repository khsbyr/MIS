import Keycloak from 'keycloak-js';

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
// const keycloak = Keycloak({
//   url: 'http://localhost:8080/auth',
//   realm: 'demo',
//   clientId: 'react-test',
// });

const keycloak = Keycloak('/keycloak.json');

export default keycloak;
