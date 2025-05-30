(function () {
  'use strict';

  // Enhanced VR-compatible menu for Pano2VR
  let pano = null;
  let isVRActive = false;
  let vrMenuSkin = null;
  let menuContainer = null;

  // CSS Styles with Pano2VR VR mode fixes
  const styles = `
    <style id="virtual-tours-menu-styles">
      .vt-menu-container {
        position: absolute !important;
        transform: translate3d(-50%, -50%, 0) !important;
        top: 20px;
        right: 20px;
        z-index: 999999 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        pointer-events: auto !important;
        backface-visibility: hidden !important;
        will-change: transform, opacity !important;
      }
      
      /* Force visibility in VR mode */
      .vt-menu-container.vr-mode {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        transform: translate(-50%, -50%) translateZ(1000px) !important;
        z-index: 2147483647 !important;
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        pointer-events: auto !important;
        isolation: isolate !important;
      }
      
      /* Ensure WebGL compatibility */
      .vt-menu-container * {
        transform-style: preserve-3d !important;
        -webkit-transform-style: preserve-3d !important;
      }
      
      .vt-menu-toggle {
        background: linear-gradient(135deg, #ffb300 0%, #ffa000 100%);
        color: #222;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 8px;
        padding: 0.8em 1.2em;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.6em;
        white-space: nowrap;
        pointer-events: auto !important;
        -webkit-user-select: none;
        user-select: none;
        position: relative;
        transform: translateZ(0) !important;
      }
      
      .vr-mode .vt-menu-toggle {
        padding: 1.5em 2em;
        font-size: 1.4rem;
        border-radius: 12px;
        background: rgba(255, 179, 0, 0.95) !important;
        color: #000 !important;
        border: 3px solid rgba(255, 255, 255, 0.8);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6);
        transform: translateZ(100px) !important;
      }
      
      .vt-menu-toggle:hover {
        background: linear-gradient(135deg, #ffa000 0%, #ff8f00 100%);
        transform: translateY(-2px) translateZ(0) !important;
        box-shadow: 0 6px 25px rgba(0, 0, 0, 0.5);
      }
      
      .vr-mode .vt-menu-toggle:hover {
        transform: scale(1.1) translateZ(100px) !important;
        box-shadow: 0 12px 40px rgba(255, 179, 0, 0.6);
      }
      
      .vt-menu-content {
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 12px;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(15px);
        border: 2px solid rgba(0, 0, 0, 0.1);
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        min-width: 300px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-15px) translateZ(0);
        transition: all 0.4s ease;
        padding: 1.8em;
        pointer-events: auto !important;
        max-height: 70vh;
        overflow-y: auto;
        z-index: 999999 !important;
      }
      
      .vr-mode .vt-menu-content {
        position: fixed !important;
        top: 50% !important;
        left: 50% !important;
        right: auto !important;
        transform: translate(-50%, -50%) translateY(-15px) translateZ(200px) !important;
        margin-top: 0;
        background: rgba(0, 0, 0, 0.95) !important;
        color: white !important;
        min-width: 400px;
        max-width: 600px;
        border: 3px solid rgba(255, 179, 0, 0.6);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(20px);
      }
      
      .vr-mode .vt-menu-content.open {
        transform: translate(-50%, -50%) translateZ(200px) !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      
      .vt-menu-content.open {
        opacity: 1;
        visibility: visible;
        transform: translateY(0) translateZ(0);
      }
      
      .vt-buttons {
        display: flex;
        flex-direction: column;
        gap: 1em;
        align-items: stretch;
        width: 100%;
      }
      
      .vr-mode .vt-buttons {
        gap: 1.5em;
      }
      
      .vt-subtitle {
        font-size: 1.2em;
        font-weight: 700;
        color: #333;
        margin-bottom: 1em;
        text-align: center;
        width: 100%;
      }
      
      .vr-mode .vt-subtitle {
        color: #ffb300;
        font-size: 1.6em;
        margin-bottom: 1.5em;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      }
      
      .vt-link-btn {
        width: 100%;
        padding: 1em 1.2em;
        background: linear-gradient(135deg, #ffb300 0%, #ffa000 100%);
        color: #222;
        text-decoration: none;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 500;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
        text-align: center;
        border: none;
        cursor: pointer;
        pointer-events: auto !important;
        display: block;
        transform: translateZ(0) !important;
      }
      
      .vr-mode .vt-link-btn {
        padding: 1.3em 1.6em;
        font-size: 1.2rem;
        border-radius: 10px;
        background: rgba(255, 179, 0, 0.2);
        color: #fff !important;
        border: 2px solid rgba(255, 179, 0, 0.5);
        backdrop-filter: blur(10px);
        transform: translateZ(10px) !important;
      }
      
      .vt-link-btn:hover {
        background: linear-gradient(135deg, #ffa000 0%, #ff8f00 100%);
        transform: translateY(-2px) translateZ(0) !important;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        text-decoration: none;
        color: #222;
      }
      
      .vr-mode .vt-link-btn:hover {
        background: rgba(255, 179, 0, 0.4) !important;
        color: #fff !important;
        transform: scale(1.05) translateZ(10px) !important;
        box-shadow: 0 8px 30px rgba(255, 179, 0, 0.5);
        border-color: rgba(255, 179, 0, 0.8);
      }
      
      .vt-menu-icon {
        transition: transform 0.4s ease;
        font-size: 0.8em;
      }
      
      .vt-menu-toggle.active .vt-menu-icon {
        transform: rotate(180deg);
      }
      
      .vr-close-btn {
        position: absolute;
        top: 16px;
        right: 16px;
        background: rgba(255, 60, 60, 0.8);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        width: 45px;
        height: 45px;
        display: none;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 22px;
        font-weight: bold;
        transition: all 0.3s ease;
        z-index: 10;
        transform: translateZ(50px) !important;
      }
      
      .vr-mode .vr-close-btn {
        display: flex !important;
      }
      
      .vr-close-btn:hover {
        background: rgba(255, 40, 40, 1);
        transform: scale(1.2) translateZ(50px) !important;
        box-shadow: 0 6px 20px rgba(255, 60, 60, 0.5);
      }
      
      /* VR Detection Indicator */
      .vr-indicator {
        position: fixed !important;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.9);
        color: #ffb300;
        padding: 0.8em 1.5em;
        border-radius: 25px;
        font-size: 1em;
        font-weight: 600;
        display: none;
        z-index: 999999 !important;
        border: 2px solid rgba(255, 179, 0, 0.5);
        backdrop-filter: blur(15px);
        animation: vr-pulse 2s infinite;
        transform: translateZ(500px) !important;
      }
      
      @keyframes vr-pulse {
        0%, 100% { 
          opacity: 0.8; 
          transform: translateZ(500px) scale(1);
        }
        50% { 
          opacity: 1; 
          transform: translateZ(500px) scale(1.05);
        }
      }
      
      .vr-mode .vr-indicator {
        display: block !important;
      }
      
      /* Force hardware acceleration */
      .vt-menu-container,
      .vt-menu-container * {
        -webkit-transform: translateZ(0);
        -moz-transform: translateZ(0);
        -ms-transform: translateZ(0);
        -o-transform: translateZ(0);
        transform: translateZ(0);
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        -ms-backface-visibility: hidden;
        backface-visibility: hidden;
        -webkit-perspective: 1000px;
        -moz-perspective: 1000px;
        -ms-perspective: 1000px;
        perspective: 1000px;
      }
      
      /* Pano2VR specific overrides */
      #pano {
        overflow: visible !important;
      }
      
      .pnlm-container {
        overflow: visible !important;
      }
      
      /* Mobile VR specific styles */
      @media screen and (orientation: landscape) and (max-height: 500px) {
        .vr-mode .vt-menu-container {
          transform: translate(-50%, -50%) translateZ(2000px) !important;
        }
        
        .vr-mode .vt-menu-content {
          transform: translate(-50%, -50%) translateZ(2200px) !important;
        }
        
        .vr-mode .vt-menu-content.open {
          transform: translate(-50%, -50%) translateZ(2200px) !important;
        }
      }
    </style>
  `;

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

  // Enhanced Pano2VR VR detection
  function detectPano2VRMode() {
    let vrActive = false;

    // Method 1: Check Pano2VR global object
    if (window.pano || window.viewer) {
      pano = window.pano || window.viewer;

      // Check if VR mode is active via Pano2VR API
      if (pano && typeof pano.getVRMode === 'function') {
        vrActive = pano.getVRMode();
      }

      // Alternative: Check for VR device
      if (pano && typeof pano.getVRDevice === 'function') {
        const vrDevice = pano.getVRDevice();
        vrActive = vrDevice && vrDevice.isPresenting;
      }
    }

    if (navigator.xr) {
      // This is handled asynchronously, but we can check for active sessions
      navigator.xr.isSessionSupported('immersive-vr').then(supported => {
        if (supported) {
          // Additional VR session checks could go here
        }
      }).catch(() => { });
    }

    const canvas = document.querySelector('canvas');
    const panoContainer = document.getElementById('pano') || document.querySelector('.pnlm-container');

    if (canvas && panoContainer) {
      const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
      const canvasStyle = window.getComputedStyle(canvas);
      const containerStyle = window.getComputedStyle(panoContainer);

      // Check for VR-specific styling changes
      if (isFullscreen &&
        (canvasStyle.width === '100vw' || canvasStyle.width === '100%') &&
        (containerStyle.transform !== 'none' || containerStyle.perspective !== 'none')) {
        vrActive = true;
      }
    }

    // Method 4: Check for mobile VR indicators
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
      const isLandscape = window.innerWidth > window.innerHeight;
      const isFullscreen = document.fullscreenElement || screen.width === window.innerWidth;

      if (isLandscape && isFullscreen && window.DeviceOrientationEvent) {
        vrActive = true;
      }
    }

    // Method 5: Check for URL parameters or hash changes
    const urlParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    if (urlParams.get('vr') === 'true' || hash.includes('vr') || hash.includes('cardboard')) {
      vrActive = true;
    }

    // Update VR state
    if (vrActive !== isVRActive) {
      isVRActive = vrActive;
      if (vrActive) {
        enableVRMode();
      } else {
        disableVRMode();
      }
    }
  }

  function enableVRMode() {
    console.log('Enabling VR mode for menu');

    const container = document.getElementById('vt-menu-container');
    const indicator = document.getElementById('vr-indicator');

    if (container) {
      container.classList.add('vr-mode');

      // Force re-render to ensure visibility
      container.style.display = 'none';
      container.offsetHeight; // Trigger reflow
      container.style.display = 'block';

      // Additional DOM manipulation to ensure visibility
      container.style.position = 'fixed';
      container.style.zIndex = '2147483647';
      container.style.pointerEvents = 'auto';
      container.style.visibility = 'visible';
      container.style.opacity = '1';
    }

    if (indicator) {
      indicator.style.display = 'block';
    }

    // Pano2VR specific: Try to add menu to different containers
    const panoCanvas = document.querySelector('canvas');
    const panoContainer = document.getElementById('pano') || document.querySelector('.pnlm-container') || document.body;

    if (panoCanvas && container) {
      // Try to insert menu after canvas
      try {
        panoCanvas.parentNode.insertBefore(container, panoCanvas.nextSibling);
      } catch (e) {
        console.warn('Could not reposition menu:', e);
      }
    }

    // Force hardware acceleration
    if (container) {
      container.style.transform = 'translate(-50%, -50%) translateZ(1000px)';
      container.style.willChange = 'transform, opacity';
    }

  }

  function disableVRMode() {
    console.log('Disabling VR mode for menu');

    const container = document.getElementById('vt-menu-container');
    const indicator = document.getElementById('vr-indicator');

    if (container) {
      container.classList.remove('vr-mode');
      // Reset styles
      container.style.position = '';
      container.style.top = '';
      container.style.left = '';
      container.style.transform = '';
      container.style.zIndex = '';
    }

    if (indicator) {
      indicator.style.display = 'none';
    }
  }

  function initMenu() {
    try {
      // Add styles
      document.head.insertAdjacentHTML('beforeend', styles);

      // Find the best container for the menu
      let targetContainer = document.getElementById('pano-container') ||
        document.getElementById('pano') ||
        document.querySelector('.pnlm-container') ||
        document.querySelector('[id*="pano"]') ||
        document.body;

      // Add menu
      targetContainer.insertAdjacentHTML('beforeend', menuHTML);
      menuContainer = document.getElementById('vt-menu-container');

      // Add event listeners
      const toggle = document.getElementById('vt-menu-toggle');
      const content = document.getElementById('vt-menu-content');
      const closeBtn = document.getElementById('vr-close-btn');

      if (toggle && content) {
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
      }

      if (closeBtn) {
        closeBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          e.preventDefault();
          closeMenu();
        });
      }

      document.querySelectorAll('.ggskin.ggskin_container')[0]
        .addEventListener('click', function (e) {

          console.log('clicked')
        });

      document.addEventListener('click', function (e) {
        if (!e.target.closest('.vt-menu-container')) {
          closeMenu();
        }
      }, true);

      // Keyboard support
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          closeMenu();
        }
      });

      // Start VR detection
      detectPano2VRMode();
      setInterval(detectPano2VRMode, 1000);

      // Listen for Pano2VR events if available
      if (window.pano || window.viewer) {
        const panoObj = window.pano || window.viewer;

        // Try to bind to VR mode change events
        if (typeof panoObj.on === 'function') {
          panoObj.on('vrModeChange', function (vrMode) {
            isVRActive = vrMode;
            if (vrMode) {
              enableVRMode();
            } else {
              disableVRMode();
            }
          });
        }
      }

      // Handle fullscreen changes
      ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange'].forEach(event => {
        document.addEventListener(event, function () {
          setTimeout(detectPano2VRMode, 100);
        });
      });

      // Handle orientation changes (mobile VR)
      window.addEventListener('orientationchange', function () {
        setTimeout(detectPano2VRMode, 300);
      });

      console.log('Pano2VR VR Menu initialized successfully');

    } catch (error) {
      console.error('Error initializing Pano2VR VR Menu:', error);
    }

  }

  function openMenu() {
    const content = document.getElementById('vt-menu-content');
    const toggle = document.getElementById('vt-menu-toggle');

    if (content && toggle) {
      content.classList.add('open');
      toggle.classList.add('active');

      // In VR mode, ensure menu is visible
      if (isVRActive) {
        content.style.display = 'block';
        content.style.visibility = 'visible';
        content.style.opacity = '1';
        content.style.pointerEvents = 'auto';
      }
    }
  }

  function closeMenu() {
    const content = document.getElementById('vt-menu-content');
    const toggle = document.getElementById('vt-menu-toggle');

    if (content && toggle) {
      content.classList.remove('open');
      toggle.classList.remove('active');
    }
  }

  // Initialize when ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenu);
  } else {
    initMenu();
  }

  // Also try to initialize after a delay to catch late-loading Pano2VR
  setTimeout(function () {
    if (!menuContainer) {
      initMenu();
    }
  }, 2000);


  // Public API
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
      return isVRActive;
    },
    forceVRDetection: detectPano2VRMode,
    reinitialize: initMenu
  };

})();