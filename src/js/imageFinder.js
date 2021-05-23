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

  // Добавляет спиннер, если картинка не загружена
  if (!image.dataset.loaded) {
    previewSpinner.spin(card);
  }

  image.onload = () => {
    previewSpinner.stop(); // Останавливает спиннер после загрузки картинки
    image.dataset.loaded = true; // Добавляет дата-аттрибут для идентификации загруженных картинок
  };
}

// Создает галлерею
function makeGallery(images) {
  const markup = imageCardTpl(images); // Создание разметки

  renderGalleryMarkup(markup); // Рендер разметки

  const cardRefs = getCardRefs(); // Получение ссылок на текущие элементы галлереи

  observeCards(cardRefs.allCards, cardRefs.lastCard); // Добавление обзерверов и спиннера
}

// Коллбек для слушателя сабмита формы
async function onSearch(e) {
  e.preventDefault(); // Убирает перезагрузку страницы при сабмите

  API.query = e.currentTarget.elements.query.value; // Добавляет значение поля поиска

  // Проверка на недопустимые символы
  if (!RegExp(/^\p{L}/, 'u').test(API.query)) {
    return errorMsg();
  }

  API.resetPage(); // Сбрасывает значение страницы при новом поиске

  const images = await API.getImages(API.searchQuery);

  try {
    clearGallery();
    makeGallery(images);

    setTimeout(() => {
      window.scrollTo({ top: 240, behavior: 'smooth' });
    }, 600);
  } catch {
    errorMsg();
  } finally {
    searchFormRef.reset(); // Сброс формы
  }
}

// Догружает карточки галлереи
export async function onLoadMore() {
  const images = await API.getImages(API.searchQuery);

  try {
    makeGallery(images);
  } catch (err) {
    console.log(err);
  }
}

searchFormRef.addEventListener('submit', onSearch);
