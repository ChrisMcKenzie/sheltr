import r from 'rethinkdb';
import Collection from '../collection';

export default class Organizations extends Collection {
  constructor() {
    // Call parent class and tell it what table we are using
    super('organizations');
  }
}
