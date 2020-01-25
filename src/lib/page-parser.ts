import cheerio from 'cheerio';

class PageParser {
  private assetTypes: AssetType[] = [
    {
      tag: 'img',
      attr: 'src',
    },
  ];

  async getAssets(pageData: string): Promise<string[]> {
    const $ = cheerio.load(pageData);
    const assets = this.assetTypes.map(assetType => {
      return $(assetType.tag).attr(assetType.attr);
    });

    return Array.isArray(assets) ? assets : [assets];
  }
}

interface AssetType {
  tag: string;
  attr: string;
}

export default PageParser;
