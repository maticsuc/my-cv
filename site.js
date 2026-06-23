(function() {
  const html = document.documentElement;
  const systemThemePreference = window.matchMedia('(prefers-color-scheme: light)');
  const getSystemTheme = () => systemThemePreference.matches ? 'light' : 'dark';
  const getSavedTheme = () => localStorage.getItem('theme');
  const applyTheme = (theme) => html.setAttribute('data-theme', theme);

  applyTheme(getSavedTheme() || getSystemTheme());

  window.initSite = function(translations) {
    const themeToggle = document.getElementById('theme-toggle');
    const languageToggle = document.getElementById('language-toggle');
    const hasLanguageToggle = Boolean(languageToggle);
    let currentLanguage = hasLanguageToggle ? localStorage.getItem('language') || 'en' : 'en';

    function updateLanguage(lang) {
      currentLanguage = lang;
      if (hasLanguageToggle) {
        localStorage.setItem('language', lang);
      }

      document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
          element.innerHTML = translations[lang][key];
        }
      });

      if (hasLanguageToggle) {
        languageToggle.querySelector('.lang-text').textContent = lang === 'en' ? 'SL' : 'EN';
      }

      html.setAttribute('lang', lang);
    }

    if (themeToggle) {
      themeToggle.addEventListener('click', function() {
        const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
      });
    }

    systemThemePreference.addEventListener('change', function() {
      if (!getSavedTheme()) {
        applyTheme(getSystemTheme());
      }
    });

    if (hasLanguageToggle) {
      languageToggle.addEventListener('click', function() {
        updateLanguage(currentLanguage === 'en' ? 'sl' : 'en');
      });
    }

    updateLanguage(currentLanguage);

    if (window.lucide) {
      window.lucide.createIcons();
    }

    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
      setTimeout(() => {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
          loadingOverlay.style.display = 'none';
        }, 500);
      }, 800);
    }
  };
})();
