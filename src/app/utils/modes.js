import { Subject } from 'rxjs';

export const mode$ = new Subject();
const form = document.querySelector('form[name="modeSwitcher"]');

for (let i = 0; i < form.length; i++) {
  form[i].addEventListener('change', function () {
    mode$.next(this.value);
  });
}
