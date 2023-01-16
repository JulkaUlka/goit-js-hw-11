import './css/styles.css';
import { FetchPictures } from './fetchPictures';

import Notiflix from 'notiflix';

const searchFormEl = document.querySelector('#search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');
const searchBtnEl = document.querySelector('.search-btn');

const fetchPictures = new FetchPictures();

const onSearchFormSubmit = async event => {
  event.preventDefault();

  searchBtnEl.disabled = true;
  searchBtnEl.classList.add('disabled');

  fetchPictures.q = event.target.elements.searchQuery.value;
  fetchPictures.page = 1;

  try {
    const data = await fetchPictures.fetchPhotosByQuery();
    
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      event.target.reset();
      loadMoreBtnEl.classList.add('is-hidden');
      galleryListEl.innerHTML = '';

      return;
    }

    if (data.totalHits > 1 && data.totalHits !== data.hits.length) {
      loadMoreBtnEl.classList.remove('is-hidden');
    }

    galleryListEl.innerHTML = createGalleryCards(data.hits);
  } catch (err) {
    console.log(err);
  } finally {
    searchBtnEl.disabled = false;
    searchBtnEl.classList.remove('disabled');
  }
};

const onLoadMoreBtnClick = async event => {
  event.target.disabled = true;
  event.target.classList.add('disabled');

  fetchPictures.page += 1;

  try {
    const data = await fetchPictures.fetchPhotosByQuery();

    galleryListEl.insertAdjacentHTML(
      'beforeend',
      createGalleryCards(data.hits)
    );

    if (data.totalHits === data.total) {
      loadMoreBtnEl.classList.add('is-hidden');
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (err) {
    console.log(err);
  } finally {
    event.target.disabled = false;
    event.target.classList.remove('disabled');
  }
};

function createGalleryCards(cardInfo) {
  const galleryCardsArr = cardInfo.map(el => {
    return `
  <div class="photo-card">
  <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes:</b> ${el.likes}
    </p>
    <p class="info-item">
      <b>Views:</b> ${el.views}
    </p>
    <p class="info-item">
      <b>Comments:</b> ${el.comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b> ${el.downloads}
    </p>
  </div>
</div>
        `;
  });

  return galleryCardsArr.join('');
}
searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
