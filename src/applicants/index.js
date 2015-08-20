import r from 'rethinkdb';
import debug from 'debug';
import Collection from '../collection';

export default class Applicants extends Collection {
  constructor(){
    // call parent class and tell it what table we are using
    super('applicants');
  }
}
