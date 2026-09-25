(function () {
  var nav = document.getElementById("nav");
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  var year = document.getElementById("year");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (year) year.textContent = String(new Date().getFullYear());

  if (reduced) {
    document.body.classList.add("is-ready");
    document.body.classList.remove("is-loading");
  } else {
    document.body.classList.add("is-loading");
    window.setTimeout(function () {
      document.body.classList.add("is-ready");
      document.body.classList.remove("is-loading");
    }, 2300);
  }

  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 12);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links.addEventListener("click", function (event) {
    if (event.target.closest("a")) {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduced || !("IntersectionObserver" in window) || CSS.supports("animation-timeline", "view()")) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18 });
    reveals.forEach(function (el) { observer.observe(el); });
  }

  var tabs = Array.prototype.slice.call(document.querySelectorAll(".price-nav [role='tab']"));
  function selectTab(tab) {
    tabs.forEach(function (item) {
      var selected = item === tab;
      item.setAttribute("aria-selected", selected ? "true" : "false");
      item.tabIndex = selected ? 0 : -1;
      var panel = document.getElementById(item.getAttribute("aria-controls"));
      if (panel) panel.hidden = !selected;
    });
  }
  tabs.forEach(function (tab, index) {
    tab.addEventListener("click", function () { selectTab(tab); });
    tab.addEventListener("keydown", function (event) {
      var next = index;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % tabs.length;
      else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      else return;
      event.preventDefault();
      tabs[next].focus();
      selectTab(tabs[next]);
    });
  });

  var dialog = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCap = document.getElementById("lightbox-cap");
  document.querySelectorAll(".shot button").forEach(function (button) {
    button.addEventListener("click", function () {
      lightboxImg.src = button.getAttribute("data-full");
      lightboxImg.alt = button.getAttribute("data-caption") || "";
      lightboxCap.textContent = button.getAttribute("data-caption") || "";
      if (typeof dialog.showModal === "function") dialog.showModal();
    });
  });

  var form = document.getElementById("book-form");
  var hint = document.getElementById("form-hint");
  if (!form) return;
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    var data = new FormData(form);
    var lines = [
      "Hi Aleigha, I'd like to book a home visit.",
      "Name: " + data.get("name"),
      "Service: " + data.get("service")
    ];
    if (data.get("day")) lines.push("Preferred day: " + data.get("day"));
    if (data.get("area")) lines.push("Area: " + data.get("area"));
    if (data.get("note")) lines.push("Note: " + data.get("note"));
    var url = "https://wa.me/447359811298?text=" + encodeURIComponent(lines.join("\n"));
    hint.textContent = "Opening WhatsApp…";
    window.open(url, "_blank", "noopener");
  });
})();
