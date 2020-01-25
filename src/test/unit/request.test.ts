import test from 'tape-async';
import nock from 'nock';
import Requester from '../../lib/requester';

const hostname = 'https://example.org';
const path = '/foo';

test('It returns page data on success', async assert => {
  nock(hostname)
    .get(path)
    .reply(200, 'Hello');

  const requester = new Requester();
  const response = await requester.get(hostname + path);

  assert.equal(response, 'Hello');
});

test('It returns empty string on failure', async assert => {
  nock(hostname)
    .get(path)
    .reply(500, 'All Your Base Are Belong To Us ☠️');

  const requester = new Requester();
  const response = await requester.get(hostname + path);

  assert.equal(response, '');
});
