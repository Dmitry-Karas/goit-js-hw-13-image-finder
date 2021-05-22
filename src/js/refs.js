export const searchFormRef = document.querySelector('#search-form');
export const galleryRef = document.querySelector('.gallery');
export const back2TopBtnRef = document.querySelector('.back2top');

// Получение текущих ссылок на карточки галлереи
export function getCardRefs() {
  return {
    allCards: document.querySelectorAll('.gallery-item'),
    lastCard: document.querySelector('.gallery-item:last-child'),
  };
}
