(function () {
  'use strict';

  // CSS Styles - Modified for VR compatibility
  const styles = `
            <style id="virtual-tours-menu-styles">
              .vt-menu-container {
                position: absolute;
                top: 20px;
                right: 20px;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                pointer-events: auto;
              }
              
              .vt-menu-container.vr-mode {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 999999;
              }
              
              .vt-menu-toggle {
                background: #ffb300;
                color: #222;
                border: none;
                border-radius: 7px;
                padding: 0.7em 1em;
                font-size: 1rem;
                font-weight: 500;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.5em;
                white-space: nowrap;
                pointer-events: auto;
                -webkit-user-select: none;
                user-select: none;
              }
              
              .vr-mode .vt-menu-toggle {
                padding: 1em 1.5em;
                font-size: 1.2rem;
                border-radius: 10px;
              }
              
              .vt-menu-toggle:hover {
                background: #ffa000;
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
              }
              
              .vt-menu-content {
                position: absolute;
                top: 100%;
                right: 0;
                margin-top: 10px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 10px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                min-width: 280px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                border: 1px solid rgba(0, 0, 0, 0.2);
                display: flex;
                justify-content: center;
                padding: 1.5em;
                padding-left: 0;
                pointer-events: auto;
                max-height: 70vh;
                overflow-y: auto;
              }
              
              .vr-mode .vt-menu-content {
                position: fixed;
                top: 50%;
                left: 50%;
                right: auto;
                transform: translate(-50%, -50%) translateY(-10px);
                margin-top: 0;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                min-width: 350px;
                max-width: 500px;
                border: 2px solid rgba(255, 255, 255, 0.3);
              }
              
              .vr-mode .vt-menu-content.open {
                transform: translate(-50%, -50%);
              }
              
              .vt-menu-content.open {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
              }
              
              .vt-menu-content::before {
                content: '';
                position: absolute;
                top: -8px;
                right: 20px;
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-bottom: 8px solid rgba(255, 255, 255, 0.95);
                filter: drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.1));
              }
              
              .vr-mode .vt-menu-content::before {
                display: none;
              }
              
              .vt-buttons {
                flex: 0 0 220px;
                min-width: 120px;
                display: flex;
                flex-direction: column;
                gap: 0.7em;
                align-items: flex-start;
                justify-content: flex-start;
                align-self: stretch;
              }
              
              .vr-mode .vt-buttons {
                min-width: 300px;
                gap: 1em;
              }
              
              .vt-subtitle {
                font-size: 1.1em;
                font-weight: 600;
                color: #333;
                margin-bottom: 0.5em;
                text-align: center;
                width: 100%;
              }
              
              .vr-mode .vt-subtitle {
                color: white;
                font-size: 1.3em;
                margin-bottom: 1em;
              }
              
              .vt-link-btn {
                width: 100%;
                padding: 0.5em 0.7em;
                background: #ffb300;
                color: #222;
                text-decoration: none;
                border-radius: 7px;
                font-size: 1rem;
                font-weight: 500;
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
                transition: background 0.18s, box-shadow 0.18s;
                text-align: center;
                border: none;
                outline: none;
                margin: 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: block;
                cursor: pointer;
                pointer-events: auto;
              }
              
              .vr-mode .vt-link-btn {
                padding: 1em 1.2em;
                font-size: 1.1rem;
                border-radius: 10px;
                background: rgba(255, 179, 0, 0.9);
                color: #fff;
                border: 1px solid rgba(255, 255, 255, 0.3);
              }
              
              .vt-link-btn:hover {
                background: #ffa000;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                text-decoration: none;
                color: #222;
              }
              
              .vr-mode .vt-link-btn:hover {
                background: rgba(255, 160, 0, 1);
                color: #fff;
                transform: scale(1.05);
                box-shadow: 0 4px 15px rgba(255, 179, 0, 0.4);
              }
              
              .vt-menu-icon {
                transition: transform 0.3s ease;
              }
              
              .vt-menu-toggle.active .vt-menu-icon {
                transform: rotate(180deg);
              }
              
              .vr-close-btn {
                position: absolute;
                top: 15px;
                right: 15px;
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                width: 35px;
                height: 35px;
                display: none;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 18px;
                transition: all 0.3s ease;
              }
              
              .vr-mode .vr-close-btn {
                display: flex;
              }
              
              .vr-close-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
              }
              
              @media (max-width: 768px) {
                .vt-menu-container {
                  top: 15px;
                  right: 15px;
                }
                
                .vt-menu-content {
                  min-width: 250px;
                  right: -10px;
                }
                
                .vt-menu-toggle {
                  padding: 0.6em 0.8em;
                  font-size: 0.9rem;
                }
              }
              
              /* VR Detection Styles */
              .vr-indicator {
                position: absolute;
                bottom: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 0.5em 1em;
                border-radius: 20px;
                font-size: 0.8em;
                display: none;
                z-index: 9999;
              }
              
              .vr-mode .vr-indicator {
                display: block;
              }
            </style>
          `;

  // HTML Structure - Enhanced for VR
  const menuHTML = `
            <div class="vt-menu-container" id="vt-menu-container">
              <button class="vt-menu-toggle" id="vt-menu-toggle">
                <span>Tour Virtuali</span>
                <span class="vt-menu-icon">▼</span>
              </button>
              <div class="vt-menu-content" id="vt-menu-content">
                <button class="vr-close-btn" id="vr-close-btn">×</button>
                <div class="vt-buttons">
                  <div class="vt-subtitle">Scopri i tour virtuali</div>
                  <a class="vt-link-btn" href="/CasermaBetza/" data-tour="CasermaBetza">Caserma Betza</a>
                  <a class="vt-link-btn" href="/ChiesaDiSanGavino/" data-tour="ChiesaDiSanGavino">Chiesa di San Gavino</a>
                  <a class="vt-link-btn" href="/ChiesaDiSantAntioco/" data-tour="ChiesaDiSantAntioco">Chiesa di Sant'Antioco</a>
                  <a class="vt-link-btn" href="/ChiesaSanBattista/" data-tour="ChiesaSanBattista">Chiesa di San Battista</a>
                  <a class="vt-link-btn" href="/DomosDeJanasUniai/" data-tour="DomosDeJanasUniai">Domos De Janas UNIAI</a>
                  <a class="vt-link-btn" href="/DomusDeJanasS'Iscrithola/" data-tour="DomusDeJanasS'Iscrithola">Domos De Janas S'Iscrithola</a>
                  <a class="vt-link-btn" href="/ILCarmelo/" data-tour="ILCarmelo">Il Carmelo</a>
                  <a class="vt-link-btn" href="/MuseoCasaPorcuSatta/" data-tour="MuseoCasaPorcuSatta">Museo Casa Porcu-Satta</a>
                  <a class="vt-link-btn" href="/MuseoDelFioreSardo/" data-tour="MuseoDelFioreSardo">Museo del Fiore Sardo</a>
                  <a class="vt-link-btn" href="/NuragheTalaighe/" data-tour="NuragheTalaighe">Nuraghe Talaighè</a>
                  <a class="vt-link-btn" href="/SantuarioDiSaItra/" data-tour="SantuarioDiSaItra">Santuario Di Sa Itra</a>
                </div>
              </div>
            </div>
            <div class="vr-indicator" id="vr-indicator">VR Mode Active</div>
          `;

  let isVRMode = false;

  // VR Detection
  function detectVRMode() {
    // Check for VR display
    if (navigator.getVRDisplays) {
      navigator.getVRDisplays().then(displays => {
        displays.forEach(display => {
          if (display.isPresenting) {
            enableVRMode();
          }
        });
      });
    }

    // Check for WebXR
    if (navigator.xr) {
      navigator.xr.isSessionSupported('immersive-vr').then(supported => {
        if (supported) {
          // Additional VR session detection could go here
        }
      });
    }

    // Fallback: Check for fullscreen + device orientation (mobile VR)
    if (document.fullscreenElement &&
      window.orientation !== undefined &&
      screen.orientation &&
      screen.orientation.angle !== 0) {
      enableVRMode();
    }
  }

  function enableVRMode() {
    isVRMode = true;
    const container = document.getElementById('vt-menu-container');
    if (container) {
      container.classList.add('vr-mode');
    }
    console.log('VR Mode enabled for menu');
  }

  function disableVRMode() {
    isVRMode = false;
    const container = document.getElementById('vt-menu-container');
    if (container) {
      container.classList.remove('vr-mode');
    }
    console.log('VR Mode disabled for menu');
  }

  // Initialize the menu
  function initVirtualToursMenu() {
    // Add styles to head
    document.head.insertAdjacentHTML('beforeend', styles);

    // Add menu to the pano container instead of body
    const panoContainer = document.getElementById('pano-container') || document.body;
    panoContainer.insertAdjacentHTML('beforeend', menuHTML);

    // Add event listeners
    const toggle = document.getElementById('vt-menu-toggle');
    const content = document.getElementById('vt-menu-content');
    const closeBtn = document.getElementById('vr-close-btn');

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      const isOpen = content.classList.contains('open');

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    closeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      closeMenu();
    });

    // Enhanced click handling for VR
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.vt-menu-container')) {
        closeMenu();
      }
    }, true);

    // Close menu on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeMenu();
      }
    });

    // VR mode detection
    setInterval(detectVRMode, 1000);

    // Handle fullscreen changes
    document.addEventListener('fullscreenchange', detectVRMode);
    document.addEventListener('webkitfullscreenchange', detectVRMode);

    function openMenu() {
      content.classList.add('open');
      toggle.classList.add('active');
      toggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      content.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVirtualToursMenu);
  } else {
    initVirtualToursMenu();
  }

  // Enhanced Public API
  window.VirtualToursMenu = {
    show: function () {
      const container = document.querySelector('.vt-menu-container');
      if (container) container.style.display = 'block';
    },
    hide: function () {
      const container = document.querySelector('.vt-menu-container');
      if (container) container.style.display = 'none';
    },
    toggle: function () {
      const toggle = document.getElementById('vt-menu-toggle');
      if (toggle) toggle.click();
    },
    enableVRMode: enableVRMode,
    disableVRMode: disableVRMode,
    isVRMode: function () {
      return isVRMode;
    }
  };

})();