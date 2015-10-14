import config from './config';
import {events} from './events';
import glob from 'glob';

export function load() {
  glob(__dirname + '/plugins/*.js', {}, (err, files) => {
    files.forEach((file) => {
      var plugin = require(file);
      if (plugin.hasOwnProperty('isEnabled') && plugin.isEnabled()) {
        console.log('Loaded plugin: ' + plugin.name());
        plugin.register(events);
      }
    });
  });
}
