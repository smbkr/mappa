# Mappa

[![smbkr](https://circleci.com/gh/smbkr/mappa/tree/master.svg?style=svg)](https://circleci.com/gh/smbkr/mappa/tree/master)

_Mappa_ is a utility written with TypeScript & Node.js, which will traverse a
website, starting with a given url, creating a map of all static assets (images,
scripts and stylesheets) and links (internal and external) that the page depends
on, following all internal links and crawling them also.

## Building

If you have Node & NPM on your machine, build with the following:

```sh
npm install
npm run clean
npm run build
```

## Usage

After [building](#building), you can run _Mappa_ like so:
`npm run start 'https://www.example.org'`.

Once it has finished crawling form the provided URL, it will write the sitemap
to stdout. The format for the sitemap is:

```json
{
  "https://www.example.org/": {
    "links": ["/foo"],
    "assets": ["foo.jpg", "bar.css"]
  },
  "https://www.example.org/foo": {
    "links": ["https://www.twitter.com/example"],
    "assets": ["twitter-badge.png", "hack-the-planet.js"]
  }
}
```

## Testing

The following steps will create a clean build, plus lint and run the test suite:

```sh
npm run clean // Not strictly necessary
npm run lint
npm run build
npm run test
```

## Caveats

There is not currently much in the way of error handling. If a page fetch fails
for any reason (4xx, 5xx), that page is essentially just skipped. The utility
could be improved by retrying where the error is temporary (5xx) within a
reasonable threshold.

There is no logging. It would be helpful to log errors, such as the above.

It is quite slow, links related to a page are fetched asynchronously, but it's
at the mercy of the network speed, and there is no feedback that things are
happening. This could be improved by streaming the sitemap to stdout instead of
waiting for it to finish.

I think there is a concurrency problem, in that multiple pages could link to
page X, and we could end up with several requests for page X in flight. The
`Mapper.loadPage` method checks at it's beginning if the page is already in the
sitemap, but doesn't add the page to the sitemap until we have fetched it and
parsed the assets. There is a race condition between the check and adding the
page to the sitemap.

It would be helpful to add a `max-depth` config flag, as we could end up with an
extremely deep map if we start parsing very large websites (don't test this out
on Wikipedia for example).

Deduplication in the parser is inefficient &mdash; we should just avoid adding
elements twice instead of removing the duplicates at the end.
