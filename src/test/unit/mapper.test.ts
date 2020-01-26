import test from 'tape-async';
import iSpy from 'i-spy';
import Mapper from '../../lib/mapper';
import PageParser from '../../lib/page-parser';
import Requester from '../../lib/requester';

const requesterStub = ({
  get: iSpy.createSpy(() => Promise.resolve('')),
} as any) as Requester;

test('creating a map for a single page with no links and one asset', async assert => {
  const parser = ({
    getAssets: iSpy.createSpy(() => Promise.resolve(['/foo.jpg'])),
    getLinks: iSpy.createSpy(() => Promise.resolve([])),
  } as any) as PageParser;
  const mapper = new Mapper(parser, requesterStub);

  const expected = {
    'https://www.example.org/foo': {
      links: [],
      assets: ['/foo.jpg'],
    },
  };
  const actual = await mapper.start('https://www.example.org/foo');

  assert.deepEqual(actual, expected);
});

test('creating a map for a page that links to an external page', async assert => {
  const parser = ({
    getAssets: iSpy.createSpy(() => Promise.resolve([])),
    getLinks: iSpy.createSpy(() => Promise.resolve(['https://www.cuvva.com'])),
  } as any) as PageParser;
  const mapper = new Mapper(parser, requesterStub);

  const expected = {
    'https://www.example.org/foo': {
      links: ['https://www.cuvva.com'],
      assets: [],
    },
  };
  const actual = await mapper.start('https://www.example.org/foo');

  assert.deepEqual(actual, expected);
});

test('creating a map for a page that links to an internal page', async assert => {
  const linkGenerator = (function*() {
    yield ['/an-internal-page'];
    yield ['https://www.cuvva.com'];
  })();
  const parser = ({
    getAssets: iSpy.createSpy(() => Promise.resolve([])),
    getLinks: iSpy.createSpy(() => {
      return Promise.resolve(linkGenerator.next().value);
    }),
  } as any) as PageParser;
  const mapper = new Mapper(parser, requesterStub);

  const expected = {
    'https://www.example.org/foo': {
      links: ['/an-internal-page'],
      assets: [],
    },
    'https://www.example.org/an-internal-page': {
      links: ['https://www.cuvva.com'],
      assets: [],
    },
  };
  const actual = await mapper.start('https://www.example.org/foo');

  assert.deepEqual(actual, expected);
});

test('creating a map for a pair of recursive internal links', async assert => {
  const linkGenerator = (function*() {
    yield ['/to-you'];
    yield ['/to-me'];
  })();
  const parser = ({
    getAssets: iSpy.createSpy(() => Promise.resolve([])),
    getLinks: iSpy.createSpy(() => {
      return Promise.resolve(linkGenerator.next().value);
    }),
  } as any) as PageParser;
  const mapper = new Mapper(parser, requesterStub);

  const expected = {
    'https://www.example.org/to-me': {
      links: ['/to-you'],
      assets: [],
    },
    'https://www.example.org/to-you': {
      links: ['/to-me'],
      assets: [],
    },
  };
  (requesterStub.get as iSpy.Spy).reset();
  const actual = await mapper.start('https://www.example.org/to-me');

  assert.deepEqual(actual, expected);
  const requesterCallCount = (requesterStub.get as iSpy.Spy).callCount();
  assert.equal(2, requesterCallCount, 'only requested each page once');
});
