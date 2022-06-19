export const alert = {
  show() {
    this.alert = document.getElementById('alert');
    this.alert.style.display = 'block';
  },

  hide() {
    this.alert.style.display = 'none';
  }
}
