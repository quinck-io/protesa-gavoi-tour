// Virtual Tours Menu Script
(function () {
    'use strict';

    // CSS Styles
    const styles = `
    <style id="virtual-tours-menu-styles">
      .vt-menu-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
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
        background: white;
        border-radius: 10px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        min-width: 280px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        border: 1px solid rgba(0, 0, 0, 0.1);
        display: flex;
        justify-content: center;
        padding: 1.5em;
        padding-left: 0;
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
        border-bottom: 8px solid white;
        filter: drop-shadow(0 -2px 4px rgba(0, 0, 0, 0.1));
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
      
      .vt-subtitle {
        font-size: 1.1em;
        font-weight: 600;
        color: #333;
        margin-bottom: 0.5em;
        text-align: center;
        width: 100%;
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
      }
      
      .vt-link-btn:hover {
        background: #ffa000;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        text-decoration: none;
        color: #222;
      }
      
      .vt-menu-icon {
        transition: transform 0.3s ease;
      }
      
      .vt-menu-toggle.active .vt-menu-icon {
        transform: rotate(180deg);
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
    </style>
  `;

    // HTML Structure
    const menuHTML = `
    <div class="vt-menu-container">
      <button class="vt-menu-toggle" id="vt-menu-toggle">
        <span>Tour Virtuali</span>
        <span class="vt-menu-icon">▼</span>
      </button>
      <div class="vt-menu-content" id="vt-menu-content">
        <div class="vt-buttons">
          <div class="vt-subtitle">Scopri i tour virtuali</div>
          <a class="vt-link-btn" href="/CasermaBetza/">Caserma Betza</a>
          <a class="vt-link-btn" href="/ChiesaDiSanGavino/">Chiesa di San Gavino</a>
          <a class="vt-link-btn" href="/ChiesaDiSantAntioco/">Chiesa di Sant'Antioco</a>
          <a class="vt-link-btn" href="/ChiesaSanBattista/">Chiesa di San Battista</a>
          <a class="vt-link-btn" href="/DomosDeJanasUniai/">Domos De Janas UNIAI</a>
          <a class="vt-link-btn" href="/DomusDeJanasS'Iscrithola/">Domos De Janas S'Iscrithola</a>
          <a class="vt-link-btn" href="/ILCarmelo/">Il Carmelo</a>
          <a class="vt-link-btn" href="/MuseoCasaPorcuSatta/">Museo Casa Porcu-Satta</a>
          <a class="vt-link-btn" href="/MuseoDelFioreSardo/">Museo del Fiore Sardo</a>
          <a class="vt-link-btn" href="/NuragheTalaighe/">Nuraghe Talaighè</a>
          <a class="vt-link-btn" href="/SantuarioDiSaItra/">Santuario Di Sa Itra</a>
        </div>
      </div>
    </div>
  `;

    // Initialize the menu
    function initVirtualToursMenu() {
        // Add styles to head
        document.head.insertAdjacentHTML('beforeend', styles);

        // Add menu to body
        document.body.insertAdjacentHTML('beforeend', menuHTML);

        // Add event listeners
        const toggle = document.getElementById('vt-menu-toggle');
        const content = document.getElementById('vt-menu-content');

        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = content.classList.contains('open');

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.vt-menu-container')) {
                closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });

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

    // Public API for manual control
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
        }
    };

})();