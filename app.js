const toggleButtons = document.querySelectorAll('.toggle-button');
const forms = document.querySelectorAll('.auth-form');

toggleButtons.forEach((button) => {
  button.addEventListener('click', () => {
    toggleButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    forms.forEach((form) => {
      form.classList.toggle('active', form.id === button.dataset.target);
    });
  });
});
