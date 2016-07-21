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

  test('Camelizes double nested in arrays objects', (assert) => {
    const elem = {items_in_array: [{item: 1}, {item: 2}]};
    const elems = [Object.assign({}, elem), Object.assign({}, elem)];
    const out = camelize({elems});
    assert('equal', out.elems[0].itemsInArray[0].item, 1);
    assert('equal', out.elems[0].itemsInArray[1].item, 2);
    assert('equal', out.elems[1].itemsInArray[0].item, 1);
    assert('equal', out.elems[1].itemsInArray[1].item, 2);
  });

  test('Canelizes nested dot notation objects', (assert) => {
    const input = {'persons.last_name': 'lastName'};
    const out = camelize(input);
    assert('equal', out.personsLastName, 'lastName');
  });

  test('Camelizes all but excented keys', (assert) => {
    const date = new Date();
    const input = {person: {birth_date: {g_t: date}}};
    const out = camelize(input, ['g_t']);
    assert('equal', out.person.birthDate.g_t, date);
  });

  test('Camelizes all but nested in arrays excented keys', (assert) => {
    const date = new Date();
    const input = {persons: [{birth_date: {$gt: date}}, {birth_date: {$lt: date}}]};
    const out = camelize(input, ['$gt', '$lt']);
    assert('equal', out.persons[0].birthDate['$gt'], date);
    assert('equal', out.persons[1].birthDate['$lt'], date);
  });
});
