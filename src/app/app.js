import { fromEvent, timer, BehaviorSubject, merge, of } from 'rxjs';
import { distinctUntilChanged, map, switchMap, debounceTime, filter, tap } from 'rxjs/operators';
import { alert } from './utils/alert';
import { grid, snake, matrix, createSquares } from './matrix';
import { toggleClass, togglePoint } from './utils/toggler';
import { mode$ } from './utils/modes';
import { sppedRegulator, switchNumber, keyCodes, transformCodes, squareCount } from './utils/constants';
import { takeHeadIndex, takeHead } from './utils/snake-head';

let speed = 500;
let activeMode = 'classic';
let point = Math.floor(Math.random() * squareCount);
let direction = 1;
let activeKeyCode = 39;
let subscription;

const mobileArrows$ = Array(document.getElementById('mobileArrows').children).map((v) => fromEvent(v, 'click'));
const keyUpEvent$ = fromEvent(document, 'keyup').pipe(
  filter((e) => e.keyCode <= 40 && e.keyCode >= 37),
  map(e => e.keyCode)
);

const mobileEvents$ = (
  merge(...mobileArrows$).pipe(map(event => +event.target.getAttribute('keyCode')))
);

togglePoint(grid[point], true);

// Timer
const startTimer$ = new BehaviorSubject(speed)
  .pipe(
    switchMap(period => timer(0, parseInt(period)))
  );

// Speed Controller
fromEvent(sppedRegulator, 'input').pipe(
  debounceTime(600),
  map(event => parseInt(+event.target.value)),
  tap(speed => {
    const speedEl = document.getElementById('speed');
    speedEl.innerHTML = `${speed}<small>ms</small>`;
  })).subscribe(startTimer$);


// Key Press
const keyPress$ =
  merge(
    of(39),
    keyUpEvent$,
    mobileEvents$
  ).pipe(
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
    tap(() => {
      if (window.innerWidth <= 680) {
        navigator.vibrate(300);
      }
    }),
    switchMap((keyCode) => startTimer$.pipe(map(index => keyCode))),
    tap(keyCode => {
      direction = keyCodes[keyCode];
      if (activeKeyCode !== keyCode) {
        toggleClass(grid[snake[0]], false, transformCodes[activeKeyCode]);
      }

      move(keyCode);
    })
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
}
