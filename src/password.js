'use strict';
import {fork} from 'child_process';

const ROUNDS = 10;

// Taken from https://github.com/NodeBB/NodeBB/blob/master/src/password.js
// because it's awesome;
(function(module) {

  module.hash = function(password) {
    return new Promise(function(resolve, reject) {
      forkChild({type: 'hash', rounds: ROUNDS, password: password},
        function(err, res) {
          if (err) {
            reject(err);
          }

          resolve(res);
        });
    });
  };

  module.compare = function(password, hash, callback) {
    forkChild({type: 'compare', password: password, hash: hash}, callback);
  };

  function forkChild(message, callback) {
    var child = fork(__dirname + '/bcrypt', {
        silent: true,
      });

    child.on('message', function(msg) {
      if (msg.err) {
        return callback(new Error(msg.err));
      }

      callback(null, msg.result);
    });

    child.send(message);
  }

  return module;
})(exports);
