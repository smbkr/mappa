import axios from 'axios';

class Requester {
  async get(url: string): Promise<string> {
    let response;
    try {
      response = await axios.get(url);
    } catch (err) {
      return '';
    }

    return response.data;
  }
}

export default Requester;
