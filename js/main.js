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

  const daoModal = document.querySelector('[data-dao-modal]');
  const daoTriggers = Array.from(document.querySelectorAll('[data-dao-trigger]'));

  if (daoModal && daoTriggers.length) {
    const daoModalImage = daoModal.querySelector('[data-dao-modal-image]');
    const daoModalTitle = daoModal.querySelector('[data-dao-modal-title]');
    const daoModalDescription = daoModal.querySelector('[data-dao-modal-description]');
    const daoCloseElements = Array.from(daoModal.querySelectorAll('[data-dao-close]'));
    let lastFocusedElement = null;
    let closeTimer = null;

    function clearDaoCloseTimer() {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
    }

    function populateDaoModal(trigger) {
      if (daoModalImage) {
        daoModalImage.src = trigger.dataset.daoImage || '';
        daoModalImage.alt = trigger.dataset.daoAlt || '';
      }

      if (daoModalTitle) {
        daoModalTitle.textContent = trigger.dataset.daoTitle || '';
      }

      if (daoModalDescription) {
        daoModalDescription.textContent = trigger.dataset.daoDescription || '';
      }
    }

    function openDaoModal(trigger) {
      lastFocusedElement = trigger;
      clearDaoCloseTimer();
      populateDaoModal(trigger);
      daoModal.hidden = false;
      body.classList.add('dao-modal-open');

      window.requestAnimationFrame(function() {
        daoModal.classList.add('is-open');
      });

      const closeButton = daoModal.querySelector('.dao-modal__close');

      if (closeButton) {
        closeButton.focus();
      }
    }

    function closeDaoModal() {
      if (daoModal.hidden) {
        return;
      }

      daoModal.classList.remove('is-open');
      body.classList.remove('dao-modal-open');
      clearDaoCloseTimer();
      closeTimer = window.setTimeout(function() {
        daoModal.hidden = true;

        if (daoModalImage) {
          daoModalImage.removeAttribute('src');
          daoModalImage.alt = '';
        }

        if (daoModalTitle) {
          daoModalTitle.textContent = '';
        }

        if (daoModalDescription) {
          daoModalDescription.textContent = '';
        }

        if (lastFocusedElement) {
          lastFocusedElement.focus();
          lastFocusedElement = null;
        }

        closeTimer = null;
      }, 180);
    }

    daoTriggers.forEach(trigger => {
      trigger.addEventListener('click', function() {
        openDaoModal(this);
      });
    });

    daoCloseElements.forEach(element => {
      element.addEventListener('click', function(event) {
        event.preventDefault();
        closeDaoModal();
      });
    });

    window.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && !daoModal.hidden) {
        closeDaoModal();
      }
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
