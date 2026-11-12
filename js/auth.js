(() => {
  "use strict";

  const USERS_KEY = "northernSkyUsers";
  const CURRENT_USER_KEY = "northernSkyCurrentUser";
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
    } catch {
      return [];
    }
  };

  const ensureDemoUser = () => {
    const users = getUsers();
    if (users.some((user) => user.email === "test@test.ru")) return;
    users.push({
      name: "Тестовый наблюдатель",
      email: "test@test.ru",
      password: "123456",
      createdAt: "2026-11-12T18:00:00.000Z"
    });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const setError = (inputId, message) => {
    const input = document.getElementById(inputId);
    const error = document.querySelector(`[data-error-for="${inputId}"]`);
    input?.classList.toggle("invalid", Boolean(message));
    input?.setAttribute("aria-invalid", String(Boolean(message)));
    if (error) error.textContent = message;
  };

  const clearErrors = (form) => {
    form.querySelectorAll(".invalid").forEach((input) => {
      input.classList.remove("invalid");
      input.removeAttribute("aria-invalid");
    });
    form.querySelectorAll(".field-error").forEach((node) => { node.textContent = ""; });
  };

  const setMessage = (id, message, type = "error") => {
    const node = document.getElementById(id);
    if (!node) return;
    node.className = `form-message auth-message ${type}`;
    node.textContent = message;
  };

  const switchPanel = (target) => {
    const login = target === "login";
    const loginPanel = document.getElementById("loginPanel");
    const registerPanel = document.getElementById("registerPanel");
    const loginTab = document.getElementById("loginTab");
    const registerTab = document.getElementById("registerTab");

    loginPanel.hidden = !login;
    registerPanel.hidden = login;
    loginPanel.classList.toggle("active", login);
    registerPanel.classList.toggle("active", !login);
    loginTab.classList.toggle("active", login);
    registerTab.classList.toggle("active", !login);
    loginTab.setAttribute("aria-selected", String(login));
    registerTab.setAttribute("aria-selected", String(!login));
    window.history.replaceState(null, "", login ? "auth.html#login" : "auth.html#register");
    window.setTimeout(() => (login ? document.getElementById("loginEmail") : document.getElementById("registerName"))?.focus(), 0);
  };

  const initTabs = () => {
    document.getElementById("loginTab")?.addEventListener("click", () => switchPanel("login"));
    document.getElementById("registerTab")?.addEventListener("click", () => switchPanel("register"));
    document.querySelectorAll("[data-switch]").forEach((button) => {
      button.addEventListener("click", () => switchPanel(button.dataset.switch));
    });
    if (window.location.hash === "#register") switchPanel("register");
  };

  const initPasswordToggles = () => {
    document.querySelectorAll(".password-toggle").forEach((button) => {
      button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.target);
        if (!input) return;
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        button.setAttribute("aria-label", show ? "Скрыть пароль" : "Показать пароль");
        button.textContent = show ? "◌" : "◉";
      });
    });
  };

  const initLogin = () => {
    const form = document.getElementById("loginForm");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      clearErrors(form);
      setMessage("loginMessage", "", "");

      const email = form.elements.email.value.trim().toLocaleLowerCase("ru");
      const password = form.elements.password.value;
      let valid = true;

      if (!emailPattern.test(email)) {
        setError("loginEmail", "Введите корректный email.");
        valid = false;
      }
      if (!password) {
        setError("loginPassword", "Введите пароль.");
        valid = false;
      }
      if (!valid) return;

      const user = getUsers().find((item) => item.email === email && item.password === password);
      if (!user) {
        setMessage("loginMessage", "Неверный email или пароль.");
        return;
      }

      const session = { name: user.name, email: user.email, createdAt: user.createdAt };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(session));
      setMessage("loginMessage", "Вход выполнен. Открываем кабинет…", "success");
      window.setTimeout(() => { window.location.href = "cabinet.html"; }, 450);
    });
  };

  const initRegistration = () => {
    const form = document.getElementById("registerForm");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      clearErrors(form);
      setMessage("registerMessage", "", "");

      const name = form.elements.name.value.trim().replace(/\s+/g, " ");
      const email = form.elements.email.value.trim().toLocaleLowerCase("ru");
      const password = form.elements.password.value;
      const confirm = form.elements.confirm.value;
      const terms = form.elements.terms.checked;
      const users = getUsers();
      let valid = true;

      if (name.length < 2) {
        setError("registerName", "Введите имя — минимум 2 символа.");
        valid = false;
      }
      if (!emailPattern.test(email)) {
        setError("registerEmail", "Введите корректный email.");
        valid = false;
      } else if (users.some((user) => user.email === email)) {
        setError("registerEmail", "Пользователь с таким email уже существует.");
        valid = false;
      }
      if (password.length < 6) {
        setError("registerPassword", "Пароль должен быть не короче 6 символов.");
        valid = false;
      }
      if (!confirm) {
        setError("registerConfirm", "Повторите пароль.");
        valid = false;
      } else if (confirm !== password) {
        setError("registerConfirm", "Пароли не совпадают.");
        valid = false;
      }
      if (!terms) {
        setError("registerTerms", "Подтвердите согласие с правилами.");
        valid = false;
      }
      if (!valid) return;

      const user = { name, email, password, createdAt: new Date().toISOString() };
      users.push(user);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ name, email, createdAt: user.createdAt }));
      setMessage("registerMessage", "Аккаунт создан. Открываем кабинет…", "success");
      window.setTimeout(() => { window.location.href = "cabinet.html"; }, 500);
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    ensureDemoUser();
    initTabs();
    initPasswordToggles();
    initLogin();
    initRegistration();
  });
})();
