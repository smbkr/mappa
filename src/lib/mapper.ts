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

    this.siteMap[pageUrl.href] = { assets, links };

    await Promise.all(this.loadRelatedLinks(links));

    return;
  }

  private loadRelatedLinks(links: string[]): Array<Promise<void>> {
    return links.map(link => {
      const parsed = url.parse(url.resolve(this.hostname, link));
      if (this.isInternalLink(parsed)) {
        // Recursively fetch related pages
        return new Promise(() => true);
      }
    });
  }

  private isInternalLink(parsedUrl: UrlWithStringQuery): boolean {
    return (
      parsedUrl.protocol.startsWith('http') &&
      parsedUrl.hostname === this.hostname
    );
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
