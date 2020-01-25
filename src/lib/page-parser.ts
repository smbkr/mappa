import cheerio from 'cheerio';

class PageParser {
  async getAssets(pageData: string): Promise<string[]> {
    const $ = cheerio.load(pageData);
    const assets = $('img').prop('src');

    return Array.isArray(assets) ? assets : [assets];
  }
}

export default PageParser;
