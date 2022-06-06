import './main.scss';
import { alert } from './app/utils/alert';
import { run } from './app/app';

const startBtn = document.getElementById('start');
startBtn.addEventListener('click', () => {
  run();
  alert.hide();
});

run();