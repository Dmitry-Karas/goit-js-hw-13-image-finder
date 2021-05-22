import { back2TopBtnRef, searchFormRef } from './refs';
import { back2topObserver } from './observer';

back2topObserver.observe(searchFormRef);

function onClick() {
  window.scrollTo({ top, behavior: 'smooth' });
}

back2TopBtnRef.addEventListener('click', onClick);
