'use strict';

var path = require('path');

module.exports = function () {

  this.$({
    name: '',
    path: ''
  });

  this.js = {
    name: 'jsfile',
    path: '/youmeb/youmeb-api-angular.js',
    handler: function () {
      this.response.sendfile(path.join(__dirname, '../youmeb.js'));
    }
  };

  this.minjs = {
    name: 'minjsfile',
    path: '/youmeb/youmeb-api-angular.min.js',
    handler: function () {
      this.response.sendfile(path.join(__dirname, '../youmeb.min.js'));
    }
  };

};
