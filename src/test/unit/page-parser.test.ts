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

test('It parses linked scripts in a page', async assert => {
  const scriptPath = '/static/main.js';
  const pageData = `<script src="${scriptPath}"></script>`;

  const parser = new PageParser();
  const actual = await parser.getAssets(pageData);

  const expected = [scriptPath];
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
    '/static/main.js',
  ];
  assert.deepEqual(actual.sort(), expected.sort());
});

test('It parses external assets', async assert => {
  const imagePath = 'https://example.org/hello.jpg';
  const pageData = `<img src="${imagePath}">`;

  const parser = new PageParser();
  const actual = await parser.getAssets(pageData);

  const expected = [imagePath];
  assert.deepEqual(actual, expected);
});

test('It parses the links in a page', async assert => {
  const linkUrl = 'https://example.org/';
  const pageData = `<a href="${linkUrl}">Hello</a>`;

  const parser = new PageParser();
  const actual = await parser.getLinks(pageData);

  const expected = [linkUrl];
  assert.deepEqual(actual, expected);
});
