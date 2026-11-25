/* Nuoyong Empire Hotel — site behaviour.
   ONE central config: change phone/email/address here and every
   link, form and footer on the site follows. */
const NUOYONG = {
  name: "Nuoyong Empire Hotel",
  phoneDisplay: "055 130 5021",
  phoneAltDisplay: "050 222 6333",
  phoneIntl: "233551305021",
  phoneAltIntl: "233502226333",
  whatsapp: "233551305021",
  email: "nuoyongempirehotel2015@gmail.com",
  address: "Mase Road 15, Sombo Residential Area, Wa, Upper West Region, Ghana",
  mapsUrl: "https://www.google.com/maps/place/Nuoyong+Empire+Hotel/@10.05739,-2.51846,848m/data=!3m2!1e3!4b1!4m6!3m5!1s0xfd9e4b0f8f7d0a9:0x0000000000000000!8m2!3d10.05739!4d-2.51846",
  mapsSearch: "https://www.google.com/maps/search/?api=1&query=Nuoyong+Empire+Hotel+Wa+Ghana",
  googleReviews: "https://www.google.com/maps/search/?api=1&query=Nuoyong+Empire+Hotel+Wa+Ghana",
  tripadvisor: "https://www.tripadvisor.com/Hotel_Review-g2123527-d12866703-Reviews-Nuoyong_Empire_Hotel-Wa_Upper_West_Region.html",
  checkIn: "12:30 – 23:30",
  checkOut: "12:00"
};

document.addEventListener("DOMContentLoaded", () => {
  /* ---- Mobile nav ---- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
  }

  /* ---- Footer year ---- */
  document.querySelectorAll("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });

  /* ---- One authored moment: the garden photo develops to full colour ---- */
  const moments = document.querySelectorAll(".develop");
  if (moments.length) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      moments.forEach(m => m.classList.add("in"));
    } else {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        });
      }, { threshold: 0.35 });
      moments.forEach(m => io.observe(m));
    }
  }

  /* ---- Gallery lightbox ---- */
  const figures = Array.from(document.querySelectorAll(".masonry figure"));
  const lb = document.querySelector(".lightbox");
  if (figures.length && lb) {
    const lbImg = lb.querySelector("img");
    const lbCap = lb.querySelector(".lb-cap");
    let idx = 0;
    const show = i => {
      idx = (i + figures.length) % figures.length;
      const img = figures[idx].querySelector("img");
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = figures[idx].querySelector("figcaption").textContent.trim();
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    const close = () => { lb.classList.remove("open"); document.body.style.overflow = ""; };
    figures.forEach((f, i) => f.addEventListener("click", () => show(i)));
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-prev").addEventListener("click", e => { e.stopPropagation(); show(idx - 1); });
    lb.querySelector(".lb-next").addEventListener("click", e => { e.stopPropagation(); show(idx + 1); });
    lb.addEventListener("click", e => { if (e.target === lb) close(); });
    document.addEventListener("keydown", e => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(idx - 1);
      if (e.key === "ArrowRight") show(idx + 1);
    });
  }

  /* ---- Gallery filter ---- */
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.filter;
      document.querySelectorAll(".masonry figure").forEach(f => {
        f.style.display = (cat === "all" || f.dataset.cat === cat) ? "" : "none";
      });
    });
  });

  /* ---- Room detail thumbnails ---- */
  document.querySelectorAll(".thumb-row img").forEach(t => {
    t.addEventListener("click", () => {
      const main = document.querySelector("#roomMain");
      if (!main) return;
      main.src = t.dataset.full || t.src;
      main.alt = t.alt;
      document.querySelectorAll(".thumb-row img").forEach(x => x.classList.remove("active"));
      t.classList.add("active");
    });
  });

  /* ---- Booking enquiry form -> WhatsApp ---- */
  document.querySelectorAll(".booking-form").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      const err = form.querySelector(".form-error");
      const ok = form.querySelector(".form-ok");
      const get = n => (form.querySelector('[name="' + n + '"]') || {}).value || "";
      const name = get("name").trim();
      const phone = get("phone").trim();
      const checkIn = get("checkin");
      const checkOut = get("checkout");
      if (!name || !phone) {
        err.textContent = "Please add your name and phone number so the hotel can reach you.";
        err.classList.add("show");
        return;
      }
      if (checkIn && checkOut && checkOut <= checkIn) {
        err.textContent = "Check-out must be after check-in. Please pick your dates again.";
        err.classList.add("show");
        return;
      }
      err.classList.remove("show");
      const lines = [
        "Hello Nuoyong Empire Hotel, I would like to enquire about a stay.",
        "Name: " + name,
        "Phone: " + phone,
        get("email") ? "Email: " + get("email").trim() : null,
        checkIn ? "Check-in: " + checkIn : null,
        checkOut ? "Check-out: " + checkOut : null,
        get("guests") ? "Guests: " + get("guests") : null,
        get("rooms") ? "Rooms: " + get("rooms") : null,
        get("room") ? "Preferred room: " + get("room") : null,
        get("requests") ? "Requests: " + get("requests").trim() : null,
        "",
        "Please let me know the rates and availability. Thank you."
      ].filter(x => x !== null);
      const url = "https://wa.me/" + NUOYONG.whatsapp + "?text=" + encodeURIComponent(lines.join("\n"));
      const okPanel = form.querySelector(".form-ok");
      if (okPanel) {
        okPanel.innerHTML =
          "<h3>Your enquiry is ready.</h3>" +
          "<p>Your message has been prepared for WhatsApp. The hotel will confirm the rate and availability — this is an enquiry, not a confirmed reservation.</p>" +
          "<p><a class='btn btn-primary' href='" + url + "' target='_blank' rel='noopener'>Open WhatsApp to send it</a></p>" +
          "<p class='small'>If WhatsApp does not open, you can call the hotel on <a href='tel:+233551305021'>055 130 5021</a>.</p>";
        okPanel.classList.add("show");
        form.querySelector(".form-fields").style.display = "none";
        form.querySelector(".form-submit-row").style.display = "none";
        okPanel.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      window.open(url, "_blank");
    });
  });

  /* ---- Hero search -> enquiry ---- */
  document.querySelectorAll(".hero-search").forEach(hs => {
    hs.addEventListener("submit", e => {
      e.preventDefault();
      const get = n => (hs.querySelector('[name="' + n + '"]') || {}).value || "";
      const lines = [
        "Hello Nuoyong Empire Hotel, I would like to enquire about a stay.",
        get("checkin") ? "Check-in: " + get("checkin") : null,
        get("checkout") ? "Check-out: " + get("checkout") : null,
        get("guests") ? "Guests: " + get("guests") : null,
        get("rooms") ? "Rooms: " + get("rooms") : null,
        "",
        "Please let me know the rates and availability. Thank you."
      ].filter(x => x !== null);
      window.open("https://wa.me/" + NUOYONG.whatsapp + "?text=" + encodeURIComponent(lines.join("\n")), "_blank");
    });
  });

  /* ---- "Book this room" buttons -> enquiry ---- */
  document.querySelectorAll("[data-book-room]").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const room = btn.dataset.bookRoom;
      const lines = [
        "Hello Nuoyong Empire Hotel, I would like to enquire about a stay.",
        "Preferred room: " + room,
        "",
        "Please let me know the rates and availability. Thank you."
      ];
      window.open("https://wa.me/" + NUOYONG.whatsapp + "?text=" + encodeURIComponent(lines.join("\n")), "_blank");
    });
  });
});

/* ---- Live preview expiry countdown (7 days) ---- */
(function () {
  /* Live preview expiry — change PREVIEW_EXPIRY to move the date, or remove
     the preview bar and this script to take the countdown off the site. */
  var PREVIEW_EXPIRY = new Date("2026-12-02T23:59:00Z");
  var bar = document.getElementById("previewBar");
  var expired = document.getElementById("previewExpired");
  /* Keep the sticky header sitting just below the countdown bar, whatever
     height the bar wraps to (desktop one line, mobile three). */
  function syncHeaderOffset() {
    var h = bar ? bar.offsetHeight : 0;
    document.documentElement.style.setProperty("--preview-h", h + "px");
  }
  syncHeaderOffset();
  window.addEventListener("resize", syncHeaderOffset);
  /* Slim on scroll: keep the bar pinned, collapse it to the countdown only. */
  var slim = false;
  function onScroll() {
    var shouldSlim = window.scrollY > 40;
    if (shouldSlim !== slim) {
      slim = shouldSlim;
      if (bar) bar.classList.toggle("slim", slim);
      syncHeaderOffset();
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  function pad(n) { return String(n).padStart(2, "0"); }
  function set(id, v) { var el = document.getElementById(id); if (el) el.textContent = pad(v); }
  function tick() {
    var diff = PREVIEW_EXPIRY - Date.now();
    if (diff <= 0) {
      if (bar) bar.style.display = "none";
      if (expired) expired.hidden = false;
      syncHeaderOffset();
      return;
    }
    var s = Math.floor(diff / 1000);
    var d = Math.floor(s / 86400); s -= d * 86400;
    var h = Math.floor(s / 3600); s -= h * 3600;
    var m = Math.floor(s / 60); s -= m * 60;
    set("pvDays", d); set("pvHours", h); set("pvMins", m); set("pvSecs", s);
  }
  tick();
  setInterval(tick, 1000);
})();

/* ---- Back to top (small button above the WhatsApp button) ---- */
(function () {
  var btn = document.createElement("button");
  btn.className = "to-top";
  btn.type = "button";
  btn.setAttribute("aria-label", "Back to top");
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>';
  document.body.appendChild(btn);
  var shown = false;
  function onScroll() {
    var shouldShow = window.scrollY > 300;
    if (shouldShow !== shown) {
      shown = shouldShow;
      btn.classList.toggle("show", shown);
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  btn.addEventListener("click", function () {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });
})();
