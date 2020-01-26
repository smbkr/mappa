import test from 'tape-async';
import iSpy from 'i-spy';
import Mapper from '../../lib/mapper';
import PageParser from '../../lib/page-parser';
import Requester from '../../lib/requester';

test('creating a map for a single page with no links and one asset', async assert => {
  const requester = ({
    get: iSpy.createSpy(() => Promise.resolve('')),
  } as any) as Requester;
  const parser = ({
    getAssets: iSpy.createSpy(() => Promise.resolve(['/foo.jpg'])),
    getLinks: iSpy.createSpy(() => Promise.resolve([])),
  } as any) as PageParser;
  const mapper = new Mapper(parser, requester);

  const expected = {
    '/foo': {
      links: [],
      assets: ['/foo.jpg'],
    },
  };
  const actual = await mapper.start('/foo');

  assert.deepEqual(actual, expected);
});
