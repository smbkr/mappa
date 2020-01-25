import cheerio from 'cheerio';

class PageParser {
  private assetTypes: AssetType[] = [
    {
      tag: 'img',
      attr: 'src',
    },
    {
      tag: 'link',
      attr: 'href',
    },
    {
      tag: 'script',
      attr: 'src',
    },
  ];

  async getAssets(pageData: string): Promise<string[]> {
    const $ = cheerio.load(pageData);
    const assets = this.assetTypes.reduce((parsedAssets, assetType) => {
      $(assetType.tag).each((_, element) => {
        parsedAssets.push($(element).attr(assetType.attr));
      });

      return parsedAssets;
    }, []);

    return assets.filter(Boolean);
  }

  async getLinks(pageData: string): Promise<string[]> {
    const $ = cheerio.load(pageData);
    const links = [];
    $('a').each((_, element) => {
      links.push($(element).attr('href'));
    });

    return links.filter(Boolean);
  }
}

interface AssetType {
  tag: string;
  attr: string;
}

export default PageParser;
