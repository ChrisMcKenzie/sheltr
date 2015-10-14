'use strict';

import {EventEmitter2} from 'eventemitter2';

export var events = new EventEmitter2({
  wildcard: true,

  delimiter: '::',
});
