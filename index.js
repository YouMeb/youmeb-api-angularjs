'use strict';

var path = require('path');

module.exports = function ($routes) {
  
  $routes.source(path.join(__dirname, 'controllers'));

};
