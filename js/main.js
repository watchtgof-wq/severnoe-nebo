(() => {
  "use strict";

  const STORAGE = {
    currentUser: "northernSkyCurrentUser",
    theme: "northernSkyTheme",
    favorites: "northernSkyFavorites"
  };

  const MATERIALS = [
    {
      id: 1,
      symbol: "✦",
      title: "Полярная звезда",
      category: "Созвездия",
      difficulty: "Легко",
      short: "Главный ориентир севера, который почти не меняет положение за ночь.",
      description: "Полярная звезда находится рядом с северным полюсом мира. Найдите ковш Большой Медведицы и мысленно продолжите линию через две крайние звезды примерно на пять таких расстояний.",
      season: "Круглый год",
      instrument: "Глаза",
      direction: "Север",
      background: "linear-gradient(145deg, #10243d, #1b4d6b)",
      accent: "#d9ff6b"
    },
    {
      id: 2,
      symbol: "W",
      title: "Кассиопея",
      category: "Созвездия",
      difficulty: "Легко",
      short: "Пять ярких звёзд в форме буквы W напротив Большой Медведицы.",
      description: "Кассиопея хорошо заметна в северной части неба. Её характерная ломаная фигура помогает ориентироваться, когда Большая Медведица находится низко над горизонтом.",
      season: "Осень — зима",
      instrument: "Глаза",
      direction: "Северо-восток",
      background: "linear-gradient(145deg, #1c1c44, #503f78)",
      accent: "#b8a8ff"
    },
    {
      id: 3,
      symbol: "♃",
      title: "Юпитер",
      category: "Планеты",
      difficulty: "Легко",
      short: "Очень яркая планета; в бинокль рядом видны четыре спутника.",
      description: "Юпитер выглядит как яркая немерцающая точка. Даже небольшой бинокль показывает до четырёх галилеевых спутников, которые каждую ночь меняют взаимное положение.",
      season: "Зависит от года",
      instrument: "Бинокль",
      direction: "По эклиптике",
      background: "linear-gradient(145deg, #4a2d26, #bd7852)",
      accent: "#ffd29a"
    },
    {
      id: 4,
      symbol: "♀",
      title: "Венера",
      category: "Планеты",
      difficulty: "Легко",
      short: "Самая яркая после Луны — появляется вечером или перед рассветом.",
      description: "Венеру называют вечерней или утренней звездой, хотя это планета. Она всегда находится недалеко от Солнца и видна только вскоре после заката или перед восходом.",
      season: "Зависит от года",
      instrument: "Глаза",
      direction: "Запад / восток",
      background: "linear-gradient(145deg, #593719, #d8a23c)",
      accent: "#fff0a8"
    },
    {
      id: 5,
      symbol: "M31",
      title: "Галактика Андромеды",
      category: "Дальний космос",
      difficulty: "Средне",
      short: "Ближайшая крупная галактика — слабое овальное пятно в тёмном небе.",
      description: "M31 — самый далёкий объект, который обычно можно увидеть без оптики. Ищите её осенью между созвездиями Андромеды и Кассиопеи; боковое зрение помогает заметить слабое свечение.",
      season: "Август — декабрь",
      instrument: "Глаза / бинокль",
      direction: "Восток",
      background: "linear-gradient(145deg, #151f3a, #546799)",
      accent: "#bcd4ff"
    },
    {
      id: 6,
      symbol: "M42",
      title: "Туманность Ориона",
      category: "Дальний космос",
      difficulty: "Легко",
      short: "Звёздная колыбель в мече Ориона, заметная даже без телескопа.",
      description: "Под тремя звёздами пояса Ориона находится его меч. Средняя точка в нём выглядит слегка размытой — это яркая область рождения новых звёзд, удалённая примерно на 1 300 световых лет.",
      season: "Ноябрь — март",
      instrument: "Бинокль",
      direction: "Юг",
      background: "linear-gradient(145deg, #183839, #397d74)",
      accent: "#8fffd8"
    },
    {
      id: 7,
      symbol: "⋰",
      title: "Плеяды",
      category: "Дальний космос",
      difficulty: "Легко",
      short: "Компактная россыпь из шести-семи звёзд, похожая на мини-ковш.",
      description: "Рассеянное скопление Плеяды находится в Тельце. Невооружённым глазом видно несколько звёзд, а бинокль превращает их в богатую искрящуюся россыпь.",
      season: "Октябрь — март",
      instrument: "Бинокль",
      direction: "Юго-восток",
      background: "linear-gradient(145deg, #18284c, #315f94)",
      accent: "#9fd8ff"
    },
    {
      id: 8,
      symbol: "☄",
      title: "Метеорный след",
      category: "Дальний космос",
      difficulty: "Терпение",
      short: "Короткая вспышка частицы, сгорающей высоко в атмосфере.",
      description: "Во время метеорных потоков просто смотрите на широкий участок неба и не используйте оптику. Лучшее время обычно наступает после полуночи, когда наблюдатель оказывается на передней стороне Земли.",
      season: "Август / декабрь",
      instrument: "Глаза",
      direction: "Всё небо",
      background: "linear-gradient(145deg, #351c2f, #8f3f58)",
      accent: "#ff9db2"
    }
  ];

  const readJSON = (key, fallback) => {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      return value ?? fallback;
    } catch {
      return fallback;
    }
  };

  const getCurrentUser = () => readJSON(STORAGE.currentUser, null);

  const favoriteKey = () => {
    const user = getCurrentUser();
    return `${STORAGE.favorites}:${user?.email || "guest"}`;
  };

  const getFavorites = () => readJSON(favoriteKey(), []);

  const saveFavorites = (ids) => {
    localStorage.setItem(favoriteKey(), JSON.stringify(ids));
  };

  const initials = (name = "") => name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

  let toastTimer;
  const showToast = (message) => {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2600);
  };

  const setTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE.theme, theme);
    document.querySelectorAll(".theme-icon").forEach((icon) => {
      icon.textContent = theme === "dark" ? "☼" : "☾";
    });
    const color = theme === "dark" ? "#07111f" : "#f1f3eb";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
  };

  const updateAuthUI = () => {
    const user = getCurrentUser();
    document.body.classList.toggle("logged-in", Boolean(user));
    document.querySelectorAll(".header-user-name").forEach((node) => {
      node.textContent = user?.name || "";
    });
    document.querySelectorAll(".user-avatar").forEach((node) => {
      node.textContent = initials(user?.name || "");
    });
  };

  const logout = () => {
    localStorage.removeItem(STORAGE.currentUser);
    window.location.href = "index.html";
  };

  const toggleFavorite = (id) => {
    const favorites = getFavorites();
    const exists = favorites.includes(id);
    const next = exists ? favorites.filter((item) => item !== id) : [...favorites, id];
    saveFavorites(next);
    showToast(exists ? "Удалено из избранного" : "Добавлено в ваш маршрут");
    return !exists;
  };

  const cardTemplate = (item) => {
    const active = getFavorites().includes(item.id);
    return `
      <article class="object-card" data-id="${item.id}" style="--card-bg:${item.background};--card-accent:${item.accent}">
        <div class="card-cover">
          <span class="difficulty-badge">${item.difficulty}</span>
          <button class="favorite-button ${active ? "active" : ""}" type="button" data-favorite="${item.id}" aria-label="${active ? "Удалить из избранного" : "Добавить в избранное"}" aria-pressed="${active}">${active ? "♥" : "♡"}</button>
          <span class="cover-symbol" aria-hidden="true">${item.symbol}</span>
        </div>
        <div class="card-body">
          <span class="card-category">${item.category}</span>
          <h3>${item.title}</h3>
          <p class="card-description">${item.short}</p>
          <button class="card-more" type="button" data-open="${item.id}">Подробнее <span aria-hidden="true">→</span></button>
        </div>
      </article>`;
  };

  const renderCardsInto = (container, items) => {
    if (!container) return;
    container.innerHTML = items.map(cardTemplate).join("");
  };

  const openMaterial = (id) => {
    const item = MATERIALS.find((material) => material.id === id);
    const modal = document.getElementById("objectModal");
    const content = document.getElementById("modalContent");
    if (!item || !modal || !content) return;

    content.innerHTML = `
      <div class="modal-cover" style="--card-bg:${item.background};--card-accent:${item.accent}">
        <span class="cover-symbol" aria-hidden="true">${item.symbol}</span>
      </div>
      <div class="modal-body">
        <span class="card-category" style="--card-accent:${item.accent}">${item.category} · ${item.difficulty}</span>
        <h2 id="modalTitle">${item.title}</h2>
        <p>${item.description}</p>
        <div class="modal-facts">
          <div><small>Когда искать</small><strong>${item.season}</strong></div>
          <div><small>Что взять</small><strong>${item.instrument}</strong></div>
          <div><small>Направление</small><strong>${item.direction}</strong></div>
        </div>
        <button class="button button-primary modal-favorite" type="button" data-favorite="${item.id}">${getFavorites().includes(item.id) ? "Убрать из маршрута" : "Добавить в маршрут"} <span aria-hidden="true">${getFavorites().includes(item.id) ? "♥" : "♡"}</span></button>
      </div>`;

    if (typeof modal.showModal === "function") modal.showModal();
  };

  const initCatalog = () => {
    const grid = document.getElementById("cardsGrid");
    if (!grid) return;
    const search = document.getElementById("objectSearch");
    const filterList = document.getElementById("filterList");
    const emptyState = document.getElementById("emptyState");
    let activeFilter = "Все";

    const render = () => {
      const query = search?.value.trim().toLocaleLowerCase("ru") || "";
      const filtered = MATERIALS.filter((item) => {
        const matchesCategory = activeFilter === "Все" || item.category === activeFilter;
        const haystack = `${item.title} ${item.short} ${item.category}`.toLocaleLowerCase("ru");
        return matchesCategory && haystack.includes(query);
      });
      renderCardsInto(grid, filtered);
      emptyState.hidden = filtered.length > 0;
    };

    filterList?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      activeFilter = button.dataset.filter;
      filterList.querySelectorAll(".filter-button").forEach((item) => item.classList.toggle("active", item === button));
      render();
    });

    search?.addEventListener("input", render);
    document.getElementById("resetFilters")?.addEventListener("click", () => {
      activeFilter = "Все";
      if (search) search.value = "";
      filterList?.querySelectorAll(".filter-button").forEach((button) => button.classList.toggle("active", button.dataset.filter === "Все"));
      render();
    });

    render();
  };

  const initCardActions = () => {
    document.addEventListener("click", (event) => {
      const favorite = event.target.closest("[data-favorite]");
      if (favorite) {
        const id = Number(favorite.dataset.favorite);
        const active = toggleFavorite(id);
        document.querySelectorAll(`[data-favorite="${id}"]`).forEach((button) => {
          button.classList.toggle("active", active);
          button.setAttribute("aria-pressed", String(active));
          if (button.classList.contains("favorite-button")) {
            button.textContent = active ? "♥" : "♡";
            button.setAttribute("aria-label", active ? "Удалить из избранного" : "Добавить в избранное");
          } else if (button.classList.contains("modal-favorite")) {
            button.innerHTML = `${active ? "Убрать из маршрута" : "Добавить в маршрут"} <span aria-hidden="true">${active ? "♥" : "♡"}</span>`;
          }
        });
        refreshCabinetFavorites();
        return;
      }

      const opener = event.target.closest("[data-open]");
      if (opener) openMaterial(Number(opener.dataset.open));
    });

    const modal = document.getElementById("objectModal");
    document.querySelector(".modal-close")?.addEventListener("click", () => modal?.close());
    modal?.addEventListener("click", (event) => {
      if (event.target === modal) modal.close();
    });
  };

  const initSlider = () => {
    const slider = document.querySelector(".story-slider");
    if (!slider) return;
    const slides = [...slider.querySelectorAll(".slide")];
    const dotsContainer = slider.querySelector(".slider-dots");
    let current = 0;
    let timer;

    dotsContainer.innerHTML = slides.map((_, index) => `<button class="slider-dot ${index === 0 ? "active" : ""}" type="button" data-slide-to="${index}" aria-label="Перейти к слайду ${index + 1}" aria-current="${index === 0 ? "true" : "false"}"></button>`).join("");

    const show = (index) => {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        const active = slideIndex === current;
        slide.classList.toggle("active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });
      dotsContainer.querySelectorAll(".slider-dot").forEach((dot, dotIndex) => {
        const active = dotIndex === current;
        dot.classList.toggle("active", active);
        dot.setAttribute("aria-current", String(active));
      });
    };

    const stop = () => window.clearInterval(timer);
    const start = () => {
      stop();
      timer = window.setInterval(() => show(current + 1), 5000);
    };

    slider.querySelector(".next")?.addEventListener("click", () => { show(current + 1); start(); });
    slider.querySelector(".prev")?.addEventListener("click", () => { show(current - 1); start(); });
    dotsContainer.addEventListener("click", (event) => {
      const dot = event.target.closest("[data-slide-to]");
      if (!dot) return;
      show(Number(dot.dataset.slideTo));
      start();
    });
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    slider.addEventListener("focusin", stop);
    slider.addEventListener("focusout", start);
    start();
  };

  const initNavigation = () => {
    const menu = document.getElementById("mainNav");
    const button = document.getElementById("menuButton");
    button?.addEventListener("click", () => {
      const open = menu?.classList.toggle("open");
      button.classList.toggle("open", Boolean(open));
      button.setAttribute("aria-expanded", String(Boolean(open)));
    });
    menu?.addEventListener("click", (event) => {
      if (!event.target.closest("a")) return;
      menu.classList.remove("open");
      button?.classList.remove("open");
      button?.setAttribute("aria-expanded", "false");
    });
    document.querySelectorAll(".logout-button").forEach((node) => node.addEventListener("click", logout));
  };

  const initTheme = () => {
    const stored = localStorage.getItem(STORAGE.theme);
    const preferred = window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
    setTheme(stored || preferred);
    document.querySelectorAll(".theme-toggle").forEach((button) => {
      button.addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));
    });
  };

  const initReveal = () => {
    const elements = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        instance.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
  };

  const initNewsletter = () => {
    const form = document.getElementById("newsletterForm");
    const input = document.getElementById("newsletterEmail");
    const message = document.getElementById("newsletterMessage");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      message.className = `form-message ${valid ? "success" : "error"}`;
      message.textContent = valid ? "Готово! Будем писать только по делу." : "Проверьте адрес электронной почты.";
      if (valid) form.reset();
    });
  };

  const refreshCabinetFavorites = () => {
    const container = document.getElementById("favoriteCards");
    const empty = document.getElementById("cabinetEmpty");
    const counter = document.getElementById("favoritesCount");
    if (!container || !empty) return;
    const ids = getFavorites();
    const items = MATERIALS.filter((item) => ids.includes(item.id));
    renderCardsInto(container, items);
    container.hidden = items.length === 0;
    empty.hidden = items.length > 0;
    if (counter) counter.textContent = String(items.length);
  };

  const initCabinet = () => {
    const content = document.getElementById("cabinetContent");
    const denied = document.getElementById("accessDenied");
    if (!content || !denied) return;
    const user = getCurrentUser();
    if (!user) {
      denied.hidden = false;
      content.hidden = true;
      return;
    }

    denied.hidden = true;
    content.hidden = false;
    document.getElementById("cabinetName").textContent = user.name;
    document.getElementById("profileName").textContent = user.name;
    document.getElementById("profileEmail").textContent = user.email;
    document.getElementById("profileAvatar").textContent = initials(user.name);
    document.getElementById("profileDate").textContent = new Date(user.createdAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
    refreshCabinetFavorites();

    document.getElementById("clearFavorites")?.addEventListener("click", () => {
      if (getFavorites().length === 0) {
        showToast("В избранном пока ничего нет");
        return;
      }
      saveFavorites([]);
      refreshCabinetFavorites();
      showToast("Избранное очищено");
    });
  };

  const init = () => {
    initTheme();
    updateAuthUI();
    initNavigation();
    initCatalog();
    initCardActions();
    initSlider();
    initReveal();
    initNewsletter();
    initCabinet();
    document.querySelectorAll(".current-year").forEach((node) => { node.textContent = String(new Date().getFullYear()); });
  };

  window.SkyApp = {
    MATERIALS,
    STORAGE,
    getCurrentUser,
    getFavorites,
    showToast,
    updateAuthUI
  };

  document.addEventListener("DOMContentLoaded", init);
})();
