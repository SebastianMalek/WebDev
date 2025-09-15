/* Rok w stopce */
const y = document.getElementById("y");
if (y) y.textContent = String(new Date().getFullYear());

/* Cień pod sticky headerem */
const toggleScrolled = () =>
  document.body.classList.toggle("scrolled", window.scrollY > 8);
toggleScrolled();
window.addEventListener("scroll", toggleScrolled, { passive: true });

/* Podświetlanie aktywnego linku w menu */
const navLinks = Array.from(document.querySelectorAll(".nav a")).filter((a) =>
  (a.getAttribute("href") || "").startsWith("#")
);

const sections = navLinks
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

if (sections.length && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = `#${entry.target.id}`;
        const link = document.querySelector(`.nav a[href="${id}"]`);
        if (!link) return;

        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove("active"));
          link.classList.add("active");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0.01 }
  );

  sections.forEach((el) => io.observe(el));
}

/* Wysyłka formularza (Formspree) */
const form = document.getElementById("contact-form");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = document.getElementById("form-status");

    // honeypot
    if (form.website && form.website.value.trim() !== "") {
      if (status) status.textContent = "Błąd: podejrzenie spamu.";
      return;
    }

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        form.reset();
        if (status) status.textContent = "Dziękuję! Odpowiem w 24h.";
      } else {
        let msg = "Coś poszło nie tak. Napisz na e-mail.";
        try {
          const json = await res.json();
          if (json?.errors?.length)
            msg = json.errors.map((e) => e.message).join(", ");
          if (json?.error) msg = json.error;
        } catch {}
        if (status) status.textContent = msg;
      }
    } catch {
      if (status) status.textContent = "Błąd sieci. Spróbuj ponownie.";
    }
  });
}
