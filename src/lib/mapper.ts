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
    if (this.siteMap[pageUrl.href]) {
      return;
    }

    const pageData = await this.requester.get(pageUrl.href);
    const [assets, links] = await Promise.all([
      this.parser.getAssets(pageData),
      this.parser.getLinks(pageData),
    ]);

    this.siteMap[pageUrl.href] = { assets, links };

    await Promise.all(this.loadRelatedLinks(pageUrl, links));

    return;
  }

  private loadRelatedLinks(
    currentPage: UrlWithStringQuery,
    links: string[],
  ): Array<Promise<void>> {
    return links.map(link => {
      const absoluteUrl = url.parse(url.resolve(currentPage.href, link));
      if (
        this.isInternalLink(absoluteUrl) &&
        absoluteUrl.path !== currentPage.path
      ) {
        return this.loadPage(absoluteUrl);
      }
    });
  }

  private isInternalLink(link: UrlWithStringQuery): boolean {
    return link.protocol.startsWith('http') && link.hostname === this.hostname;
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
