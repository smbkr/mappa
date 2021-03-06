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

test('It ignores inline scripts', async assert => {
  const pageData = `
  <script>
    window.alert('Hack The Planet!');
  </script>
  `;

  const parser = new PageParser();
  const actual = await parser.getAssets(pageData);

  assert.deepEqual(actual, []);
});

test('It parses mixed content from a page', async assert => {
  const pageData = `
    <link rel="stylesheet" href="/assets/style.css" />
    <a href="https://www.google.com">External Link</a>
    <a href="/foo.html">Internal Link</a>
    <img src="/images/image-one.jpg" />
    <img src="/images/image-two.jpg" />
    <script src="/static/main.js"></script>
  `;

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

test('It de-duplicates links', async assert => {
  const linkUrl = 'https://example.org/';
  const pageData = `
    <a href="${linkUrl}">Hello</a>
    <a href="${linkUrl}">is it me</a>
    <a href="${linkUrl}">you're looking for?</a>
  `;

  const parser = new PageParser();
  const actual = await parser.getLinks(pageData);

  const expected = [linkUrl];
  assert.deepEqual(actual, expected);
});

test('It de-duplicates assets', async assert => {
  const imagePath = 'hello.jpg';
  const pageData = `
    <img src="${imagePath}">
    <img src="${imagePath}">
    <img src="${imagePath}">
  `;

  const parser = new PageParser();
  const actual = await parser.getAssets(pageData);

  const expected = [imagePath];
  assert.deepEqual(actual, expected);
});
