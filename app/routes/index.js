const bodyParser = require('body-parser');

module.exports.setup = function setup(server, serviceLocator) {
  const mainController = serviceLocator.get('mainController');

  // parse application/x-www-form-urlencoded
  server.use(bodyParser.urlencoded({ extended: false }))
 
  // parse application/json
  server.use(bodyParser.json())

  // router.get('/vehicles/:modelYear/:manufacturer/:model', (req, res) => {
    // router.post('/vehicles', (req, res) => {
  server.get({
    path: '/',
    name: 'app health check',
    version: '1.0.0'
  }, (req, res) => res.send('Welcome to the Test API Service'));

  server.get({
    path: '/vehicles/:modelYear/:manufacturer/:model',
    name: 'Login a user ',
    version: '1.0.0'
  }, checkToken, (req, res) => mainController.getVehicleRecords(req, res));

  // create customer
  server.post({
    path: '/vehicles',
    name: 'creates a new customer',
    version: '1.0.0'
  }, (req, res) => mainController.postVehicleData(req, res));

};
