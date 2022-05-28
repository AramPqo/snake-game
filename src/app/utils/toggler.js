const toggle = (el, isActive, className) => {
  if (isActive) {
    el.classList.add(className);
  } else {
    el.classList.remove(className);
  }
};

export const toggleClass = (el, isActive, className = 'snake') => {
  if (!Array.isArray(className)) {
    className = [className];
  }

  for (let i = 0; i < className.length; i++) {
    toggle(el, isActive, className[i]);
  }
}

export const togglePoint = (el, isCreate) => {
  let points = ['apple', 'banana', 'orange', 'grape', 'kiwi'];

  if (isCreate) {
    el.classList.add(points[Math.floor(Math.random() * points.length)]);
  } else {
    const fruit = points.find(f => f === el.classList.value);
    el.classList.remove(fruit);
  }
}
