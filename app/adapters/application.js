import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: 'http://localhost:3030',
  namespace: 'api',
  authorizer: 'authorizer:application',
  // defaultSerializer: 'feathers-serializer',
  defaultSerializer: '-default',

  // loopback
  // host: 'http://localhost:3000',
  // namespace: 'api',
  // defaultSerializer: 'JSONSerializer'
});
