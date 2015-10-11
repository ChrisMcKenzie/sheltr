import r from 'rethinkdb';

export function OrgListFilter(id) {
  return (q) => q.filter({organizationId: id});
}

export function OrgSingleFilter(id) {
  return (q) => r.branch(
    q('organizationId').eq(id),
    q,
    null
  );
}
