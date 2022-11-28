export const alert = {
  show() {
    this.backdrop = document.getElementById('backdrop');
    this.alert = document.getElementById('alert');

    this.alert.style.display = 'block';
    this.backdrop.style.display = 'block';
  },

  hide() {
    this.alert.style.display = 'none';
    this.backdrop.style.display = 'none';
  }
}
