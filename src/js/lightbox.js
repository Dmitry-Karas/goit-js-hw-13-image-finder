import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';
import lightboxTpl from '../templates/lightbox.hbs';
import { galleryRef } from './refs';
import { ligtboxSpinner } from './spinner';

function onLightboxShow(e) {
  if (e.target.nodeName !== 'IMG') {
    return;
  }

  // Создание и открытие модалки
  createLightbox(e).show();

  // Реф на модалку
  const lightboxRef = document.querySelector('.basicLightbox');

  // Запуск спиннера
  ligtboxSpinner.spin(lightboxRef);

  // Обновление картинки
  e.target.src = e.target.dataset.fullsize;

  // Остановка спиннера при загрузке
  e.target.onload = () => ligtboxSpinner.stop();
}

function createLightbox(e) {
  const markup = lightboxTpl(e.target.dataset);

  // Тогглит класс с отключением скролла на боди при открытой модалке
  const opts = {
    onShow() {
      document.body.classList.add('is-hidden');
    },
    onClose() {
      document.body.classList.remove('is-hidden');
    },
  };

  return basicLightbox.create(markup, opts);
}

galleryRef.addEventListener('click', onLightboxShow);
