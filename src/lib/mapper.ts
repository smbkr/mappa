import url, { UrlWithStringQuery } from 'url';
import PageParser from './page-parser';
import Requester from './requester';

class Mapper {
  private hostname: string;
  private siteMap: SiteMap = {};

  constructor(
    private parser = new PageParser(),
    private requester = new Requester(),
  ) {}

  async start(startUrl: string): Promise<SiteMap> {
    const parsedUrl = url.parse(startUrl);
    this.hostname = parsedUrl.host;

    await this.loadPage(parsedUrl);

    return this.siteMap;
  }

  private async loadPage(pageUrl: UrlWithStringQuery): Promise<void> {
    const pageData = await this.requester.get(pageUrl.href);

    const [assets, links] = await Promise.all([
      this.parser.getAssets(pageData),
      this.parser.getLinks(pageData),
    ]);

    this.siteMap[pageUrl.path] = { assets, links };
  }
}

interface PageData {
  assets: string[];
  links: string[];
}

interface SiteMap {
  [key: string]: PageData;
}

export default Mapper;
