document.addEventListener('DOMContentLoaded', () => {
  const toggles = document.querySelectorAll('.toggle-password');

  toggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const targetId = toggle.getAttribute('data-target');
      const input = document.getElementById(targetId);

      if (input) {
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
      }
    });
  });
});
