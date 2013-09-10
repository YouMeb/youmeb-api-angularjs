youmeb-api-angularjs
====================

    var app = angular.module('app', ['youmeb']);

    app.controller('example', ['$youmeb', function ($youmeb) {

      // 載入 /youmeb/routes.json
      $youmeb.promise.then(function () {

        // 產生網址
        $youmeb.generateUrl('name.name.name', params);

        // 發出 request
        $youmeb.api.name.name.name([method,] params, data);

      });
    }]);
