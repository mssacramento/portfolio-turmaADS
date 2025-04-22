/**
 * PORTFÓLIO - FUNCIONALIDADES PRINCIPAIS
 * 1. Alternador de tema (dark/light) com persistência no localStorage
 * 2. Rolagem suave para âncoras com offset para a navegação fixa
 * 3. Navegação ativa ao rolar com debounce para performance
 * 4. Animações de aparecimento com Intersection Observer
 * 5. Formulário de contato com validação básica
 * 6. Ícones de e-mail clicáveis com fallback
 */

document.addEventListener("DOMContentLoaded", function () {
  // ===== 1. ALTERNADOR DE TEMA (COM PERSISTÊNCIA) =====
  const themeToggle = document.querySelector(".theme-toggle");
  const savedTheme = localStorage.getItem("portfolio-theme") || "light";

  // Aplicar tema salvo ao carregar
  document.body.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener("click", () => {
    const newTheme =
      document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("portfolio-theme", newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector("i");
    icon.classList.toggle("fa-moon", theme === "light");
    icon.classList.toggle("fa-sun", theme === "dark");
  }

  // ===== 2. ROLAGEM SUAVE COM OFFSET =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        const offset = 80; // Ajuste para a navegação fixa
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          offset;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        // Atualiza a URL sem recarregar a página
        history.pushState(null, null, targetId);
      }
    });
  });

  // ===== 3. NAVEGAÇÃO ATIVA (COM DEBOUNCE) =====
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".sticky-nav a");

  // Debounce para melhor performance
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveNav, 100);
  });

  function updateActiveNav() {
    let current = "";
    const scrollPosition = window.pageYOffset + 200; // Offset para ativar antes

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href").includes(current)
      );
    });
  }

  // Atualizar ao carregar
  updateActiveNav();

  // ===== 4. ANIMAÇÕES DE APARECIMENTO =====
  const fadeObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Para de observar após aparecer
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px", // Ativa 50px antes do elemento entrar na viewport
    }
  );

  document
    .querySelectorAll(".fade-in")
    .forEach((el) => fadeObserver.observe(el));

  // ===== 5. FORMULÁRIO DE CONTATO =====
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Validação básica
      const nameInput = this.querySelector("[name='nome']");
      const emailInput = this.querySelector("[name='email']");
      const messageInput = this.querySelector("[name='mensagem']");

      if (
        !nameInput.value.trim() ||
        !emailInput.value.trim() ||
        !messageInput.value.trim()
      ) {
        alert("Por favor, preencha todos os campos!");
        return;
      }

      if (!/^\S+@\S+\.\S+$/.test(emailInput.value)) {
        alert("Por favor, insira um e-mail válido!");
        return;
      }

      // Simulação de envio
      alert("Mensagem enviada com sucesso! Em breve retornarei.");
      this.reset();

      // Aqui você pode adicionar o fetch() real para enviar o formulário
    });
  }

  // ===== 6. ÍCONES DE E-MAIL CLICÁVEIS =====
  document.querySelectorAll("[data-email]").forEach((el) => {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      const subject = encodeURIComponent("Contato através do Portfólio");
      const mailtoUrl = `mailto:maiara.sacramento@kroton.com.br?subject=${subject}`;

      // Fallback para caso o mailto: falhe
      try {
        window.location.href = mailtoUrl;
      } catch (error) {
        console.error("Erro ao abrir cliente de e-mail:", error);
        // Copia o e-mail para a área de transferência como fallback
        navigator.clipboard
          .writeText("maiara.sacramento@kroton.com.br")
          .then(() => alert("E-mail copiado para a área de transferência!"))
          .catch(() =>
            prompt(
              "Copie o e-mail manualmente:",
              "maiara.sacramento@kroton.com.br"
            )
          );
      }
    });
  });
});
