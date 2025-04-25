emailjs.init("_MzkZjTQUDdf2lRlW");

// b) Přidáme posluchač odeslání
document.getElementById("contact-form")
  .addEventListener("submit", function(e) {
    e.preventDefault();

    const status = document.getElementById("form-status");

    emailjs.sendForm(
      "service_jz0p45j",   // tvé Service ID
      "template_r1zs899",  // tvé Template ID (z Email Templates)
      this                 // odkaz na <form>
    )
    .then(function() {
      status.textContent = "Zpráva byla úspěšně odeslána!";
      status.classList.add("visible");
      this.reset();
    }.bind(this))
    .catch(function(err) {
      console.error("EmailJS error:", err);
      status.textContent = "Něco se nepovedlo, zkus to prosím později.";
      status.style.color = "salmon";
      status.classList.add("visible");
    });
  });