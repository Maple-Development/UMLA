import { module, test } from 'qunit';
import { setupTest } from 'umla/tests/helpers';

module('Unit | Route | library', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:library');
    assert.ok(route);
  });
});
