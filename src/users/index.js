import Collection from '../collection';

export default class Users extends Collection {
  constructor() {
    super('users');
  }

  getById(id, ...decorators) {
    decorators.push(function(q) {
      return q.without('password');
    });
    return super.getById(id, ...decorators);
  }

  filter(query, ...decorators) {
    decorators.push(function(q) {
      return q.without('password');
    });
    return super.filter(query, ...decorators);
  }

  getByUsername(username) {
    return this.query(function(q) {
      return q.getAll(username, {index: 'username'});
    });
  }
}
