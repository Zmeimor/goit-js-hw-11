import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import "../node_modules/simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { parameters, runSearch } from './api';
import { fadeEffect } from './preloader';

const searchForm = document.querySelector('#search-form');
const gallerySection = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
const closeBtn = document.querySelector('.close-btn');

let requestSearch = '';
loadMore.style.display = 'none';
closeBtn.style.display = 'none';

searchForm.addEventListener('submit', event => {
  event.preventDefault();
  gallerySection.innerHTML = '';
  loadMore.style.display = 'none';

  const {
    elements: { searchQuery },
  } = event.currentTarget;
  runSearch(searchQuery.value).then(res => {
    // console.log(res);
    const { hits, total, totalHits } = res;
    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
        {
          timeout: 3000,
        }
      );
      gallerySection.innerHTML = '';
      return;
    }
    Notify.info(`Hooray! We found ${totalHits} images.`, { timeout: 3000 });
    screenPhoto(res);
    closeBtn.style.display = 'block';

    if (hits.length >= 40) {
      loadMore.style.display = 'block';
    }

    closeBtn.addEventListener('click', () => {
      gallerySection.innerHTML = '';
      closeBtn.style.display = 'none';
    });
  });
});

function screenPhoto(galleryItems) {
  const { hits: photos } = galleryItems;
  makeInsertPhoto(photos);

  new SimpleLightbox('.gallery a');
  // new SimpleLightbox('.gallery a', {
  //   captionDelay: 500,
  //   doubleTapZoom: 1.3,
  //   rtl: true,
  // });
}

function makeInsertPhoto(photos) {
  const markup = photos
    .map(card => {
      return `<div class="photo-card">
        <a class="gallery-item" href="${card.largeImageURL}">
          <img
            class="gallery__image"
            src="${card.webformatURL}"
            alt="${card.tags}"
            loading="lazy"
        /></a>
        <div class="info">
          <div class="info__box">
            <p class="info-item">
              <b class="material-symbols-outlined">thumb_up</b>
            </p>
            <p class="info-counter">${card.likes.toLocaleString()}</p>
          </div>
          <div class="info__box">
            <p class="info-item">
              <b class="material-symbols-outlined">visibility</b>
            </p>
            <p class="info-counter">${card.views.toLocaleString()}</p>
          </div>
          <div class="info__box">
            <p class="info-item">
              <b class="material-symbols-outlined">forum</b>
            </p>
            <p class="info-counter">${card.comments.toLocaleString()}</p>
          </div>
          <div class="info__box">
            <p class="info-item">
              <b class="material-symbols-outlined">download</b>
            </p>
            <p class="info-counter">${card.downloads.toLocaleString()}</p>
          </div>
        </div>
      </div>`;
    })
    .join('');
  gallerySection.insertAdjacentHTML('beforeend', markup);
}

loadMore.addEventListener('click', () => {
  runSearch(requestSearch).then(res => {
    let totalPages = res.totalHits / parameters.per_page;
    screenPhoto(res);
    if (parameters.page >= totalPages) {
      loadMore.style.display = 'none';
      Notify.info("We're sorry, but you've reached the end of search results.");
      loadMore.style.display = 'block';
    }
  });
});

window.addEventListener('load', fadeEffect);
