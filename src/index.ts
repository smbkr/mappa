import Mapper from './lib/mapper';

process.on('uncaughtException', err => {
  console.error(err);
});

// I can't wait for top level await
async function main() {
  const mapper = new Mapper();
  const startUrl = process.argv[2];
  const siteMap = await mapper.start(startUrl);
  console.log(siteMap);
}

main();
