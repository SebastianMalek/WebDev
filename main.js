document.getElementById("y").textContent = new Date().getFullYear();
// cień pod sticky header po lekkim scrollu

window.addEventListener("scroll", () => {
  document.body.classList.toggle("scrolled", window.scrollY > 8);
});

// podświetlanie aktywnego linku w menu
const links = document.querySelectorAll(".nav a");
const targets = [...links]
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      const id = "#" + e.target.id;
      const link = document.querySelector(`.nav a[href="${id}"]`);
      if (!link) return;
      if (e.isIntersecting) {
        links.forEach((l) => l.classList.remove("active"));
        link.classList.add("active");
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 }
);

targets.forEach((t) => io.observe(t));

const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = document.getElementById("form-status");
    // honeypot
    if (form.website && form.website.value.trim() !== "") {
      status.textContent = "Błąd: podejrzenie spamu.";
      return;
    }
    const data = new FormData(form);
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        form.reset();
        status.textContent = "Dziękuję! Odpowiem w 24h.";
      } else {
        status.textContent = "Coś poszło nie tak. Napisz na e-mail.";
      }
    } catch {
      status.textContent = "Błąd sieci. Spróbuj ponownie.";
    }
  });
}
