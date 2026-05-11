const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll(".reveal");
const stickyCall = document.querySelector(".sticky-call");
const rotatingCities = document.querySelectorAll(".rotating-city");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 50, 220)}ms`;
    revealObserver.observe(item);
  });
}

const syncHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
  stickyCall?.classList.toggle("is-visible", window.scrollY > 150);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

if (rotatingCities.length > 0) {
  const cities = [
    "\u0411\u041b\u0410\u0413\u041e\u0415\u0412\u0413\u0420\u0410\u0414",
    "\u0421\u041e\u0424\u0418\u042f",
    "\u0421\u0410\u041d\u0414\u0410\u041d\u0421\u041a\u0418",
    "\u041f\u0415\u0422\u0420\u0418\u0427",
    "\u0414\u0423\u041f\u041d\u0418\u0426\u0410",
    "\u041f\u0415\u0420\u041d\u0418\u041a",
  ];

  let cityIndex = 0;
  const animationDuration = 360;

  const applyCity = () => {
    const city = cities[cityIndex];

    rotatingCities.forEach((item) => {
      item.textContent = city;
    });

    cityIndex = (cityIndex + 1) % cities.length;
  };

  applyCity();

  if (reduceMotion) {
    window.setInterval(applyCity, 2000);
  } else {
    window.setInterval(() => {
      rotatingCities.forEach((item) => {
        item.classList.add("is-exiting");
      });

      window.setTimeout(() => {
        rotatingCities.forEach((item) => {
          item.classList.remove("is-exiting");
          item.classList.add("is-entering");
        });

        applyCity();

        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            rotatingCities.forEach((item) => {
              item.classList.remove("is-entering");
            });
          });
        });
      }, animationDuration / 2);
    }, 2000);
  }
}
