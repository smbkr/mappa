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
        const asset = $(element).attr(assetType.attr);
        if (asset) {
          parsedAssets.push(asset);
        }
      });

      return parsedAssets;
    }, []);

    return this.deduplicate(assets);
  }

  async getLinks(pageData: string): Promise<string[]> {
    const $ = cheerio.load(pageData);
    const links = [];
    $('a').each((_, element) => {
      links.push($(element).attr('href'));
    });

    return this.deduplicate(links);
  }

  private deduplicate<T>(array: Array<T>): Array<T> {
    return [...new Set(array)];
  }
}

interface AssetType {
  tag: string;
  attr: string;
}

export default PageParser;
