import test from 'tape-async';
import path from 'path';
import fs from 'fs';
import PageParser from '../../lib/page-parser';

const fixturesPath = path.resolve('test-fixtures');

test('It returns the images linked in a page', async assert => {
  const pageData = String(fs.readFileSync(`${fixturesPath}/one-image.html`));

  const parser = new PageParser();
  const actual = await parser.getAssets(pageData);

  const expected = ['hello.jpg'];
  assert.deepEqual(actual, expected);
});
