import r from 'rethinkdb';
import Collection from '../collection';

export default class Applicants extends Collection {
  constructor() {
    // Call parent class and tell it what table we are using
    super('applicants');
  }

  filter(params) {
    var baseQuery = this.q;
    return super.filter(params, function(q) {
      return q.map(function(row) {
        return row.merge({
          matches: r.table('applicants').filter(row('filters').merge({
            type: r.branch(
              row('type').eq('provider'),
              'seeker',
              'provider'
            ),
          })).count(),
        });
      });
    });
  }

  insert(applicant) {
    applicant.dob = new Date(applicant.dob);
    return super.insert(applicant);
  }

  findProviders(seeker) {
    return super.query(function(q) {
      return q;
    });
  }
}
