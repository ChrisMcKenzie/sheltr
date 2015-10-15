import {events} from '../events';
import config from '../config';
import Keen from 'keen-js';

export function register() {
  var client = new Keen({
    projectId: config.get('plugins:keen:projectId'),
    writeKey: config.get('plugins:keen:writeKey'),
  });

  events.onAny(function(val) {
    client.addEvent(this.event, val, function(err, res) {
      if (err) {
        console.log('keen: ' + err);
      }
    });
  });
}

export function isEnabled() {
  return typeof config.get('plugins:keen:projectId') !== 'undefined' &&
    typeof config.get('plugins:keen:writeKey') !== 'undefined';
}

export function name() {
  return 'keen.io';
}
