import ApiService from './apiService';
import imageCardTpl from '../../src/templates/ImageCard.hbs';
import { Spinner } from 'spin.js';
import { errorMsg } from './notifications';
import { loadObserver, styleObserver } from './observer';
import { searchFormRef, galleryRef, getCardRefs } from './refs';
import { previewSpinnerOpts } from './spinner';

const API = new ApiService();

// Очистка галереи
function clearGallery() {
  galleryRef.innerHTML = '';
}

// Рендер галерии
function renderGalleryMarkup(markup) {
  galleryRef.insertAdjacentHTML('beforeend', markup);
}

// Добавление спиннера и обзерверов на загрузку и стили карточек
function observeCards(cards, lastCard) {
  cards.forEach(card => {
    addPreviewSpinner(card);

    styleObserver.observe(card);
  });

  loadObserver.observe(lastCard);
}

// Добавляет спиннер на незагруженные изображения
function addPreviewSpinner(card) {
  const image = card.querySelector('IMG');
  const previewSpinner = new Spinner(previewSpinnerOpts);

  if (!image.dataset.loaded) {
    previewSpinner.spin(card);
  }

  image.dataset.loaded = true;

  image.onload = () => {
    previewSpinner.stop();
  };
}

// Коллбек для слушателя сабмита формы
function onSearch(e) {
  e.preventDefault(); // Убирает перезагрузку страницы при сабмите

  API.query = e.currentTarget.elements.query.value; // Добавляет значение поля поиска

  // Проверка на недопустимые символы
  if (!RegExp(/^\p{L}/, 'u').test(API.query)) {
    return errorMsg();
  }

  API.resetPage(); // Сбрасывает значение страницы при новом поиске

  API.getImages(API.searchQuery)
    .then(images => {
      const markup = imageCardTpl(images); // Создает разметку

      clearGallery(); // Очищает галлерею
      renderGalleryMarkup(markup); // Рендерит новую галлерею

      const cardRefs = getCardRefs(); // Получает ссылки на текущие элементы галлереи

      observeCards(cardRefs.allCards, cardRefs.lastCard); // Добавление обзервера и спиннера

      setTimeout(() => {
        window.scrollTo({ top: 240, behavior: 'smooth' });
      }, 500);
    })
    .catch(errorMsg)
    .finally(() => {
      searchFormRef.reset(); // Сброс формы
    });
}

// Догружает карточки галлереи
export function onLoadMore() {
  API.getImages(API.searchQuery).then(images => {
    const markup = imageCardTpl(images);

    renderGalleryMarkup(markup);

    const cardRefs = getCardRefs();

    observeCards(cardRefs.allCards, cardRefs.lastCard);
  });
}

searchFormRef.addEventListener('submit', onSearch);
