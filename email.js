document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    status.textContent = 'Odesílám…';

    const data = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        status.textContent = 'Díky za zprávu, ozvu se co nejdříve!';
        form.reset();
      } else {
        const json = await res.json();
        throw new Error(json.error || 'Chyba při odesílání');
      }
    } catch (err) {
      status.textContent = 'Něco se nepovedlo – zkus to prosím později.';
      console.error('Formspree error:', err);
    }
  });
});
