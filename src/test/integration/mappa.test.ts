import test from 'tape-async';
import nock from 'nock';
import fs from 'fs';
import path from 'path';
import Mapper from '../../lib/mapper';

const fixturesPath = path.resolve('test-fixtures');

test('Mapping www.smbkr.xyz', async assert => {
  const mapper = new Mapper();
  const pageData = String(
    fs.readFileSync(`${fixturesPath}/www.smbkr.xyz.html`),
  );
  nock('https://www.smbkr.xyz')
    .get(() => true)
    .reply(200, pageData);

  const expected = {
    'https://www.smbkr.xyz/': {
      assets: [
        'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.2/css/bulma.min.css',
        'https://use.fontawesome.com/releases/v5.0.4/js/brands.js',
        'https://use.fontawesome.com/releases/v5.0.4/js/fontawesome.js',
      ],
      links: [
        'https://www.linkedin.com/in/stuart-baker-29305a110/',
        'https://github.com/smbkr',
      ],
    },
  };
  const actual = await mapper.start('https://www.smbkr.xyz');

  assert.deepEqual(actual, expected);

  nock.cleanAll();
});
