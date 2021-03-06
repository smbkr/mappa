import Mapper from './lib/mapper';

// I can't wait for top level await
async function main() {
  const mapper = new Mapper();
  const startUrl = process.argv[2];
  let siteMap;
  try {
    siteMap = await mapper.start(startUrl);
    console.log(siteMap);
  } catch (err) {
    console.error(err);
  }
}

main();
