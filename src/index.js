import './main.scss';
import { run } from './app/app';
import { alert } from './app/utils/alert';

const startBtn = document.getElementById('start');
startBtn.addEventListener('click', () => {
  run();
  alert.hide();
});

run();