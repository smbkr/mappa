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
