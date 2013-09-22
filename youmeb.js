(function (window, angular) {
  'use strict';

  function forEach(arr, fn) {
    if (Array.prototype.forEach) {
      Array.prototype.forEach.call(arr, fn);
    } else {
      var i, len;
      for (i = 0, len = arr.length; i < len; i += 1) {
        fn(arr[i]);
      }
    }
  }

  angular.module('youmeb', [])
    .service('$youmeb', ['$http', '$q', function ($http, $q) {
      var generateUrl;
      var request;
      var routes;
      var api;

      this.api = api = {};

      this.generateUrl = generateUrl = function (key, params) {
        var route;

        if (!routes.hasOwnProperty(key)) {
          return;
        }

        route = routes[key];

        return route.path.replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function (_, slash, format, key, capture, optional) {
          slash = slash || '';
          return (optional ? '' : slash) + params[key];
        });
      };

      // 如果 method 沒定義而且 route.methods 有包含 all 的話，method 就會是 POST
      // 不包含 all 的時候以陣列的第一個值當作 method
      this.request = request = function (method, key, params, data) {
        switch (arguments.length) {
          // request(key)
          case 1:
            key = method;
            method = undefined;
            params = {};
            data = {};
            break;
          // request(method, key, params)
          // request(key, params, data)
          case 3:
            if (typeof key === 'object') {
              data = params;
              params = key;
              key = method;
              method = undefined;
            } else {
              data = {};
            }
            break;
          default:
            return;
        }

        var route = routes[key];
        var deferred = $q.defer();

        if (!method) {
          if (!!~route.methods.indexOf('all')) {
            method = 'POST';
          } else {
            method = route.methods[0];
          }
        }

        method = method.toUpperCase();

        $http({
          method: method,
          url: generateUrl(key, params),
          data: data
        })
          .success(function () {
            deferred.resolve.apply(deferred, arguments);
          })
          .error(function () {
            deferred.reject.apply(deferred, arguments);
          });

        return deferred.promise;
      };

      this.getRoutes = function () {
        return routes;
      };

      this.promise = $http.get('/youmeb/routes.json').success(function (data) {
        routes = data;
        
        // 取得所有 route 名稱
        // 排序
        var keys = (Object.keys ? function () {
          return Object.keys(routes);
        } : function () {
          var i;
          var keys = [];
          for (i in routes) {
            if (routes.hasOwnProperty(i)) {
              keys.push(i);
            }
          }
          return keys;
        })().sort();

        forEach(keys, function (key) {
          var names = key.replace(/\\\./g, '\uffff').split('.');
          var last = names.pop();
          var parent_ = api;

          forEach(names, function (name) {
            name = name.replace(/\uffff/g, '.');
            if (!parent_[name]) {
              parent_[name] = {};
            }
            parent_ = parent_[name];
          });

          if (last) {
            parent_[last] = function (method, params, data) {
              var args;
              if (typeof method === 'object') {
                args = [key, method || {}, params || {}];
              } else {
                args = [method, key, params || {}, data || {}];
              }
              return request.apply(this, args);
            };
          }
        });

      });

    }]);

})(this, this.angular);
