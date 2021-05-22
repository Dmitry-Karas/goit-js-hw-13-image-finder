import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/Angeler.css';
import { alert, defaults, Stack } from '@pnotify/core';

defaults.styling = 'angeler';
defaults.icons = 'angeler';
defaults.mode = 'light';
defaults.mouseReset = false;

const myStack = new Stack({
  dir1: 'down',
  dir2: 'left',
  firstpos1: 25,
  firstpos2: 25,
  maxOpen: Infinity,
  modal: false,
});

export const errorMsg = () =>
  alert({
    type: 'error',
    text: 'Invalid query!',
    sticker: false,
    delay: 2000,
    closer: false,
    stack: myStack,
  });
