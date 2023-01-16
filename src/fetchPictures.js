import axios from 'axios';

export class FetchPictures {
  static BASE_URL = 'https://pixabay.com/api/';

  constructor() {
    this.page = 1;
    this.q = null;
  }

  async fetchPhotosByQuery(q) {
    const searchParams = {
      params: {
        key: '28877724-a03a9cbe7251f515debe20b20',
        q: this.q,
        page: this.page,
        per_page: 40,
        orientation: 'horizontal',
        image_type: 'photo',
        safesearch: true,
      },
    };

    return await axios.get(`${FetchPictures.BASE_URL}`, searchParams);
  }
}
