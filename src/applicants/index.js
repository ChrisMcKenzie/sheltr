import Collection from '../collection';

export default class Applicants extends Collection {
  constructor() {
    // Call parent class and tell it what table we are using
    super('applicants');
  }

  insert(applicant) {
    applicant.dob = new Date(applicant.dob);
    return super.insert(applicant);
  }
}
