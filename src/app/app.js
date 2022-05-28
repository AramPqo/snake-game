import { fromEvent, timer, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, takeUntil, map, switchMap, debounceTime, filter, tap } from 'rxjs/operators';
import { alert } from './utils/alert';
import { grid, snake, matrix, createSquares } from './matrix';
import { toggleClass, togglePoint } from './utils/toggler';
import { mode$ } from './utils/modes';
import { speedInp, switchNumber, keyCodes, transformCodes, squareCount } from './utils/constants';
import { takeHeadIndex, takeHead } from './utils/snake-head';

let speed = 500;
let activeMode = 'classic';
let point = Math.floor(Math.random() * squareCount);
let direction = 1;
let activeKeyCode = 39;
let subscription;

togglePoint(grid[point], true);

// Speed Controller
fromEvent(speedInp, 'input').pipe(
  tap(event => {
    speed = parseInt(+event.target.value);
    const speedEl = document.getElementById('speed');
    speedEl.innerHTML = `${speed}<small>ms</small>`;
  }),
  debounceTime(500),
  tap(_ => startTimer$.next(speed))).subscribe();

// Timer
const startTimer$ = new BehaviorSubject(speed)
  .pipe(switchMap(period => timer(0, parseInt(period))));

// Key Press
const keyPress$ =
  fromEvent(document, 'keyup').pipe(
    filter((e) => e.keyCode <= 40 && e.keyCode >= 37),
    map(e => e.keyCode),
    map(keyCode =>
      (
        activeKeyCode &&
        keyCode === 37 && activeKeyCode === 39 ||
        keyCode === 39 && activeKeyCode === 37 ||
        keyCode === 38 && activeKeyCode === 40 ||
        keyCode === 40 && activeKeyCode === 38
      ) ? activeKeyCode : keyCode
    ),
    distinctUntilChanged(),
    switchMap((keyCode) => startTimer$.pipe(map(index => keyCode))),
    tap(keyCode => {
      direction = keyCodes[keyCode];
      if (activeKeyCode !== keyCode) {
        toggleClass(grid[snake[0]], false, transformCodes[activeKeyCode]);
      }

      move(keyCode);
    })
  );

// First streem
const go$ = new BehaviorSubject(0).pipe(
  switchMap(_ => startTimer$),
  tap(_ => move(39)),
  takeUntil(keyPress$)
);

const generatePoint = () => {
  const newPoint = Math.floor(Math.random() * squareCount);
  togglePoint(grid[point], false);
  point = newPoint;
  togglePoint(grid[point], true);
}

const toggleHead = (isCreate) => toggleClass(takeHead(), isCreate, [transformCodes[activeKeyCode], 'head']);
const eatPoint = () => {
  snake.push(takeHeadIndex() + direction);
  generatePoint();
}

const move = (keyCode) => {
  if (
    activeMode === 'hard' &&
    (
      (direction === 1 && ((takeHeadIndex() + direction) % switchNumber) === 0) ||
      (direction === -1 && ((takeHeadIndex()) % switchNumber) === 0)
    ) ||
    snake.filter((v, i, arr) => arr.indexOf(v) !== i).length ||
    takeHeadIndex() < 0
  ) {
    endGame();
  } else {
    activeKeyCode = keyCode;
    let tmp = snake.pop();
    toggleClass(grid[tmp], false);
    toggleHead(false);

    snake.unshift(takeHeadIndex() + direction);

    if (takeHead()) {
      if (point === takeHeadIndex()) {
        eatPoint();
      }

      toggleHead(true);
      toggleClass(takeHead(), true);
    } else {
      endGame();
    }
  }
}

mode$.subscribe(mode => {
  activeMode = mode;
  if (activeMode === 'hard') {
    toggleClass(matrix, false, 'classic');
    toggleClass(matrix, true, 'hard');
  } else {
    toggleClass(matrix, false, 'hard');
    toggleClass(matrix, true, 'classic');
  }
});

const endGame = () => {
  if (takeHead()) {
    toggleClass(takeHead(), false, 'head');
    toggleClass(takeHead(), false, transformCodes[activeKeyCode]);
  }

  for (let i = 0; i < snake.length; i++) {
    const removedSnake = grid[snake[i]];
    if (removedSnake) {
      toggleClass(removedSnake, false);
    }
  }

  reset();
  alert.show();
}

const reset = () => {
  subscription.unsubscribe();
  direction = 1;
  activeKeyCode = 39;
  createSquares();
}

export const run = () => {
  subscription = keyPress$.subscribe();
  go$.subscribe();
}