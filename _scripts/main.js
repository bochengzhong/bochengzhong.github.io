$(function() {
  const THEME_STORAGE_KEY = 'theme-preference';
  const root = document.documentElement;
  const body = document.body;
  const themeButtons = Array.from(document.querySelectorAll('[data-theme-option]'));
  const prefersDarkQuery = window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

  function getStoredThemePreference() {
    try {
      const storedValue = window.localStorage.getItem(THEME_STORAGE_KEY);

      if (storedValue === 'light' || storedValue === 'dark' || storedValue === 'auto') {
        return storedValue;
      }
    } catch (error) {}

    return 'auto';
  }

  function setStoredThemePreference(value) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, value);
    } catch (error) {}
  }

  function shouldUseDarkTheme(preference) {
    return (
      preference === 'dark' ||
      (preference === 'auto' && prefersDarkQuery && prefersDarkQuery.matches)
    );
  }

  function syncThemeButtons(preference) {
    themeButtons.forEach(button => {
      const isActive = button.dataset.themeOption === preference;

      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function applyThemePreference(preference) {
    const useDarkTheme = shouldUseDarkTheme(preference);

    root.classList.toggle('night', useDarkTheme);
    body.classList.toggle('night', useDarkTheme);
    syncThemeButtons(preference);
  }

  let themePreference = getStoredThemePreference();
  applyThemePreference(themePreference);

  themeButtons.forEach(button => {
    button.addEventListener('click', function() {
      themePreference = this.dataset.themeOption;
      setStoredThemePreference(themePreference);
      applyThemePreference(themePreference);
    });
  });

  if (prefersDarkQuery) {
    const handleSystemThemeChange = function() {
      if (getStoredThemePreference() === 'auto') {
        themePreference = 'auto';
        applyThemePreference(themePreference);
      }
    };

    if (typeof prefersDarkQuery.addEventListener === 'function') {
      prefersDarkQuery.addEventListener('change', handleSystemThemeChange);
    } else if (typeof prefersDarkQuery.addListener === 'function') {
      prefersDarkQuery.addListener(handleSystemThemeChange);
    }
  }

  const intro = document.querySelector('.intro');
  const topButton = document.getElementById('top-button');
  const $topButton = $('#top-button');

  if (intro && topButton) {
    const introHeight = intro.offsetHeight;

    window.addEventListener(
      'scroll',
      function() {
        if (window.scrollY > introHeight) {
          $topButton.fadeIn();
        } else {
          $topButton.fadeOut();
        }
      },
      false
    );

    topButton.addEventListener('click', function() {
      $('html, body').animate({ scrollTop: 0 }, 500);
    });
  }

  const hand = document.querySelector('.emoji.wave-hand');

  if (hand) {
    function waveOnLoad() {
      hand.classList.add('wave');
      setTimeout(function() {
        hand.classList.remove('wave');
      }, 2000);
    }

    setTimeout(function() {
      waveOnLoad();
    }, 1000);

    hand.addEventListener('mouseover', function() {
      hand.classList.add('wave');
    });

    hand.addEventListener('mouseout', function() {
      hand.classList.remove('wave');
    });
  }

  if (window.ScrollReveal) {
    window.sr = ScrollReveal({
      reset: false,
      duration: 600,
      easing: 'cubic-bezier(.694,0,.335,1)',
      scale: 1,
      viewFactor: 0.3,
    });

    sr.reveal('.background');
    sr.reveal('.skills');
    sr.reveal('.experience', { viewFactor: 0.2 });
    sr.reveal('.featured-projects', { viewFactor: 0.1 });
    sr.reveal('.other-projects', { viewFactor: 0.05 });
  }
});
