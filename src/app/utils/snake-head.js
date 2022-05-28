import { snake, grid } from '../matrix';

export const takeHeadIndex = () => snake[0];
export const takeHead = () => grid[takeHeadIndex()];
