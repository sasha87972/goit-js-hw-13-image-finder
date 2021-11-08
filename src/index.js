import './sass/main.scss';
import ImagesApiService from './apiService';
import cardGallery from './templates/cardGallery.hbs';
import * as basicLightbox from 'basiclightbox';
import { error } from '../node_modules/@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/BrightTheme.css';

const refs = {
  searchForm: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  anchor: document.querySelector('#anchor'),
};
let total = 0;
const imagesApiService = new ImagesApiService();
const render = async () => {
  const fetchImg = await imagesApiService.fetchImages();
  const appendImg = appendImages(fetchImg);
}

refs.searchForm.addEventListener('submit', searchImages);
refs.gallery.addEventListener('click', onClick);

function searchImages(event) {
  event.preventDefault();
  imagesApiService.query = event.currentTarget.elements.query.value;

  if (imagesApiService.query === '') {
    error({
      title: '!!!',
      text: 'Enter search request!',
      closer: false,
      sticker: false,
      hide: true,
      delay: 1000,
      remove: true,
    });
    return;
  }
  imagesApiService.resetPage();
  clearGallery();
  render();
  imagesApiService.incrementPage();
}

function appendImages(images) {
  refs.gallery.insertAdjacentHTML('beforeend', cardGallery(images));
  total = images.total;
  refs.searchForm.query.value = '';
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

const onLoadMore = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && imagesApiService.query !== '') {
      render();
      imagesApiService.incrementPage();
    }
  });
}

const options = {
  rootMargin: '120px',
  threshold: 1,
};

const observer = new IntersectionObserver(onLoadMore, options);
observer.observe(refs.anchor);

function onClick(evt) {
  if (evt.target.nodeName !== 'IMG') {
    return;
  }

  const instance = basicLightbox.create(`<img src="${evt.target.dataset.url}">`);
  instance.show();
}
