const {suite} = require('suitape');
const camelize = require('./../index');

suite('camelize object', (test) => {
  test('Returns undefined if input is not an object', (assert) => {
    [1, 'hola', true, [{a: 1}], new Date()].forEach(input => {
      const out = camelize(input);
      assert('equal', typeof out, 'undefined');
    });
  });

  test('Camelizes single property object', (assert) => {
    const input = {last_name: 'lastName'};
    const out = camelize(input);
    Object.keys(out).forEach(key => assert('equal', key, out[key]));
  });

  test('Camelizes multiple property object', (assert) => {
    const input = {last_name: 'lastName', name: 'name', is_full_name: 'isFullName'};
    const out = camelize(input);
    Object.keys(out).forEach(key => assert('equal', key, out[key]));
  });

  test('Camelizes nested objects', (assert) => {
    const input = {person: {last_name: 'lastName', job: {job_title: 'jobTitle'}}};
    const out = camelize(input);
    assert('equal', out.person.lastName, 'lastName');
    assert('equal', out.person.job.jobTitle, 'jobTitle');
  });

  test('Camelizes nested in arrays objects', (assert) => {
    const input = {persons: [{last_name: 'lastName', job: {job_title: 'jobTitle'}}]};
    const out = camelize(input);
    assert('equal', out.persons[0].lastName, 'lastName');
    assert('equal', out.persons[0].job.jobTitle, 'jobTitle');
  });

  test('Canelizes nested dot notation objects', (assert) => {
    const input = {'persons.last_name': 'lastName'};
    const out = camelize(input);
    assert('equal', out.personsLastName, 'lastName');
  });
});
