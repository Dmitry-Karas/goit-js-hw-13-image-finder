import { onLoadMore } from './imageFinder';
import { back2TopBtnRef } from './refs';

const loadOpts = {
  rootMargin: '100px',
  threshold: 0,
};

export const loadObserver = new IntersectionObserver(onEntryLoad, loadOpts);
export const styleObserver = new IntersectionObserver(onEntryStyle);
export const back2topObserver = new IntersectionObserver(onEntryBack2top);

function onEntryBack2top(entries) {
  back2TopBtnRef.classList.add('show');

  entries.forEach(entry => {
    if (entry.isIntersecting) {
      back2TopBtnRef.classList.remove('show');
    }
  });
}

function onEntryLoad(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      onLoadMore();

      loadObserver.unobserve(entry.target);
    }
  });
}

function onEntryStyle(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = 1;
      entry.target.style.transform = 'scale(1)';
    }
  });
}
