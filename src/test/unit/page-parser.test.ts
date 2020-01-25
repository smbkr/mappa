import test from 'tape-async';
import path from 'path';
import fs from 'fs';
import PageParser from '../../lib/page-parser';

const fixturesPath = path.resolve('test-fixtures');

test('It parses images in a page', async assert => {
  const imagePath = 'hello.jpg';
  const pageData = `<img src="${imagePath}">`;

  const parser = new PageParser();
  const actual = await parser.getAssets(pageData);

  const expected = [imagePath];
  assert.deepEqual(actual, expected);
});

test('It parses linked stylesheets in a page', async assert => {
  const cssPath = '/assets/style.css';
  const pageData = `<link href="${cssPath}" />`;

  const parser = new PageParser();
  const actual = await parser.getAssets(pageData);

  const expected = [cssPath];
  assert.deepEqual(actual, expected);
});

test('It parses mixed content from a page', async assert => {
  const pageData = String(fs.readFileSync(`${fixturesPath}/example.html`));

  const parser = new PageParser();
  const actual = await parser.getAssets(pageData);

  const expected = [
    '/assets/style.css',
    '/images/image-one.jpg',
    '/images/image-two.jpg',
  ];
  assert.deepEqual(actual.sort(), expected.sort());
});
