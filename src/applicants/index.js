import r from 'rethinkdb';
import Collection from '../collection';

function matchesFilter(row) {
  return r.table('applicants')
  .filter(row('filters').merge({
    type: r.branch(
      row('type').eq('provider'),
      'seeker',
      'provider'
    ),
  }));
}

function notArchived(q) {
  return q.filter(r.row('status').ne('archived'));
}

function getMatchesCount(q) {
  return q.map(function(row) {
    return row.merge({
      matches: matchesFilter(row)
        .filter(
          function(doc) {
            return doc('status').eq('');
          },
          {
            default: true,
          }
        ).count(),
    });
  });
}

function getMatches(q) {
  return q.merge(function(applicant) {
    return {
      matches: matchesFilter(applicant).coerceTo('array'),
    };
  });
}

export default class Applicants extends Collection {
  constructor() {
    // Call parent class and tell it what table we are using
    super('applicants');
  }

  filter(params) {
    return super.filter(params, notArchived, getMatchesCount);
  }

  getById(id) {
    return super.getById(id, getMatches);
  }

  update(id, applicant) {
    if (typeof applicant.dob !== 'undefined') {
      applicant.dob = new Date(applicant.dob);
    }
    return super.update(id, applicant);
  }

  insert(applicant) {
    if (typeof applicant.dob !== 'undefined') {
      applicant.dob = new Date(applicant.dob);
    }
    return super.insert(applicant);
  }
}
