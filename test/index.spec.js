const {suite} = require('suitape');
const camelobj = require('./../index');

suite('camelobj object', (test) => {
  test('Returns same value if input is not an object', (assert) => {
    [1, 'hola', true, new Date()].forEach(input => {
      const out = camelobj(input);
      assert('equal', out, input);
    });
  });

  test('Camelizes single property object', (assert) => {
    const input = {last_name: 'lastName'};
    const out = camelobj(input);
    Object.keys(out).forEach(key => assert('equal', key, out[key]));
  });

  test('Camelizes multiple property object', (assert) => {
    const input = {last_name: 'lastName', name: 'name', is_full_name: 'isFullName'};
    const out = camelobj(input);
    Object.keys(out).forEach(key => assert('equal', key, out[key]));
  });

  test('Camelizes nested objects', (assert) => {
    const input = {person: {last_name: 'lastName', job: {job_title: 'jobTitle'}}};
    const out = camelobj(input);
    assert('equal', out.person.lastName, 'lastName');
    assert('equal', out.person.job.jobTitle, 'jobTitle');
  });

  test('Camelizes nested in arrays objects', (assert) => {
    const input = {persons: [{last_name: 'lastName', job: {job_title: 'jobTitle'}}]};
    const out = camelobj(input);
    assert('equal', out.persons[0].lastName, 'lastName');
    assert('equal', out.persons[0].job.jobTitle, 'jobTitle');
  });

  test('Camelizes double nested in arrays objects', (assert) => {
    const elem = {items_in_array: [{item: 1}, {item: 2}]};
    const elems = [Object.assign({}, elem), Object.assign({}, elem)];
    const out = camelobj({elems});
    assert('equal', out.elems[0].itemsInArray[0].item, 1);
    assert('equal', out.elems[0].itemsInArray[1].item, 2);
    assert('equal', out.elems[1].itemsInArray[0].item, 1);
    assert('equal', out.elems[1].itemsInArray[1].item, 2);
  });

  test('Camelizes nested dot notation objects', (assert) => {
    const input = {'persons.last_name': 'lastName'};
    const out = camelobj(input);
    assert('equal', out.personsLastName, 'lastName');
  });

  test('Camelizes all but excented keys', (assert) => {
    const date = new Date();
    const input = {person: {birth_date: {g_t: date}}};
    const out = camelobj(input, ['g_t']);
    assert('equal', out.person.birthDate.g_t, date);
  });

  test('Camelizes all but nested in arrays excented keys', (assert) => {
    const date = new Date();
    const input = {persons: [{birth_date: {$gt: date}}, {birth_date: {$lt: date}}]};
    const out = camelobj(input, ['$gt', '$lt']);
    assert('equal', out.persons[0].birthDate['$gt'], date);
    assert('equal', out.persons[1].birthDate['$lt'], date);
  });

  test('Should leave values of array untouched', (assert) => {
    const input = {post_ids: ['1', '2']};
    const out = camelobj(input);
    assert('equal', out.postIds[0], '1');
    assert('equal', out.postIds[1], '2');
  });

  test('Camelizes arrays', (assert) => {
    const input = [{foo_bar: 'baz'}, {hoge_kage: 'piyo'}];
    const out = camelobj(input);
    assert('equal', out[0].fooBar, 'baz');
    assert('equal', out[1].hogeKage, 'piyo');
  });
});
