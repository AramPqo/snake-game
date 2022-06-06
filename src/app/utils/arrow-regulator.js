export const calculate = () => {
  const inp = document.getElementById('arrowSizeRegulator');

  inp.addEventListener('input', (event) => {
    if (window.innerWidth <= 680) {
      const value = event.target.value;
      const mobileArrows = document.getElementById('mobileArrows');

      mobileArrows.style.width = `${value}px`;
      mobileArrows.style.height = `${value}px`;
    }
  });

}