import { toggleClass } from './utils/toggler';
import { squareCount } from './utils/constants';

const currentSnake = () => Array(8).fill(0).map((v, i) => i).reverse();

export let grid;
export const matrix = document.getElementById('matrix');
export let snake = currentSnake();
export const createSquares = () => {
  grid = document.querySelectorAll('#matrix div');
  snake = currentSnake();

  for (let i = 0; i < 8; i++) {
    toggleClass(grid[i], true);
  }

  toggleClass(grid[snake[0]], true, ['right', 'head']);
};


for (let i = 0; i < squareCount; i++) {
  const node = document.createElement('div');
  matrix.appendChild(node);
}

createSquares();
