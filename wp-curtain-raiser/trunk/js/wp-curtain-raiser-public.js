/**
 * WP Curtain Raiser — Public JS
 * Version: 1.6.2
 *
 * Pure vanilla JS — zero dependencies.
 * Animation is driven by CSS transitions; JS only toggles CSS classes.
 * Settings injected via wp_localize_script as `wpCurtainRaiserData`.
 *
 * Milestones implemented here:
 *   v1.1 — vanilla JS, CSS class toggling, touch swipe
 *   v1.3 — focus trap, focus management, aria-live announcements
 *   v1.4 — countdown timer
 *   v1.5 — wcr:ready / wcr:open / wcr:close custom DOM events
 *   v1.6 — REST polling for remote reveal
 */
( function () {
    'use strict';

    // -----------------------------------------------------------------------
    // Config (injected by PHP via wp_localize_script)
    // -----------------------------------------------------------------------
    var cfg   = window.wpCurtainRaiserData || {};
    var speed = parseInt( cfg.animationSpeed, 10 ) || 2000;

    // -----------------------------------------------------------------------
    // State
    // -----------------------------------------------------------------------
    var isOpen = false;

    // -----------------------------------------------------------------------
    // DOM references — resolved in init()
    // -----------------------------------------------------------------------
    var overlay, leftPanel, rightPanel, rope, countdown, liveRegion;

    // -----------------------------------------------------------------------
    // Initialise
    // -----------------------------------------------------------------------

    function init() {
        overlay    = document.getElementById( 'wcr-overlay' );
        leftPanel  = document.querySelector( '.wp-curtain-left-curtain' );
        rightPanel = document.querySelector( '.wp-curtain-right-curtain' );
        rope       = document.querySelector( '.wp-curtain-rope' );
        countdown  = document.getElementById( 'wcr-countdown' );
        liveRegion = document.getElementById( 'wcr-live' );

        if ( ! leftPanel || ! rightPanel || ! rope ) {
            return; // Curtain HTML not present.
        }

        // Push saved animation speed to CSS custom property.
        document.documentElement.style.setProperty( '--wcr-speed', speed + 'ms' );

        // --- Rope interactions ---
        rope.addEventListener( 'click', function ( e ) {
            e.preventDefault();
            toggle( 'click' );
        } );

        rope.addEventListener( 'keydown', function ( e ) {
            if ( e.key === 'Enter' || e.key === ' ' ) {
                e.preventDefault();
                toggle( 'click' );
            }
        } );

        // --- Escape key (close from anywhere) ---
        document.addEventListener( 'keydown', function ( e ) {
            if ( e.key === 'Escape' && isOpen ) {
                close( 'keyboard' );
            }
        } );

        // --- Touch swipe-up on panels ---
        attachSwipe( leftPanel );
        attachSwipe( rightPanel );

        // --- v1.3: Focus trap while curtain is closed ---
        installFocusTrap();

        // --- v1.4: Countdown timer ---
        startCountdown();

        // --- v1.6: REST polling for remote reveal ---
        startPolling();

        // --- v1.5: Ready event ---
        dispatch( 'wcr:ready', { options: cfg } );
    }

    // -----------------------------------------------------------------------
    // Open / Close / Toggle
    // -----------------------------------------------------------------------

    function toggle( trigger ) {
        isOpen ? close( trigger ) : open( trigger );
    }

    /**
     * Open the curtain.
     *
     * @param {string} trigger  'click' | 'swipe' | 'countdown' | 'remote'
     */
    function open( trigger ) {
        leftPanel.classList.add( 'wp-curtain--open' );
        rightPanel.classList.add( 'wp-curtain--open' );
        rope.classList.add( 'wp-curtain-rope--visible' );
        rope.setAttribute( 'aria-expanded', 'true' );
        isOpen = true;

        // v1.3 — Move focus to first focusable page element (behind the curtain).
        var firstBehind = getFirstFocusableOutsideOverlay();
        if ( firstBehind ) {
            firstBehind.focus();
        }

        // v1.3 — Announce to screen readers.
        if ( liveRegion ) {
            liveRegion.textContent = ( cfg.i18n && cfg.i18n.curtainOpened ) || 'Curtain opened';
        }

        // v1.5 — Custom DOM event.
        dispatch( 'wcr:open', { trigger: trigger || 'click' } );
    }

    /**
     * Close the curtain.
     *
     * @param {string} trigger  'click' | 'keyboard' | 'remote'
     */
    function close( trigger ) {
        leftPanel.classList.remove( 'wp-curtain--open' );
        rightPanel.classList.remove( 'wp-curtain--open' );
        rope.classList.remove( 'wp-curtain-rope--visible' );
        rope.setAttribute( 'aria-expanded', 'false' );
        isOpen = false;

        // v1.3 — Return focus to the rope.
        rope.focus();

        // v1.3 — Announce to screen readers.
        if ( liveRegion ) {
            liveRegion.textContent = ( cfg.i18n && cfg.i18n.curtainClosed ) || 'Curtain closed';
        }

        // v1.5 — Custom DOM event.
        dispatch( 'wcr:close', { trigger: trigger || 'click' } );
    }

    // -----------------------------------------------------------------------
    // v1.3 — Focus trap
    // -----------------------------------------------------------------------

    /**
     * While the curtain is CLOSED, Tab/Shift+Tab must cycle only within the
     * overlay (in practice, just the rope <a>). When the curtain is OPEN the
     * trap is released and normal page tab order resumes.
     */
    function installFocusTrap() {
        if ( ! overlay ) { return; }

        document.addEventListener( 'keydown', function ( e ) {
            if ( isOpen || e.key !== 'Tab' ) { return; }

            var focusable = Array.prototype.slice.call(
                overlay.querySelectorAll(
                    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            ).filter( isVisible );

            if ( focusable.length === 0 ) { return; }

            var first = focusable[0];
            var last  = focusable[ focusable.length - 1 ];

            if ( e.shiftKey ) {
                if ( document.activeElement === first ) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if ( document.activeElement === last ) {
                    e.preventDefault();
                    first.focus();
                }
            }
        } );
    }

    /**
     * Find the first focusable element in the page that is NOT inside the overlay
     * AND is actually rendered in the viewport (not a visually-hidden skip link).
     * Used to move focus when the curtain opens.
     *
     * @returns {Element|null}
     */
    function getFirstFocusableOutsideOverlay() {
        var all = Array.prototype.slice.call(
            document.body.querySelectorAll(
                'a[href], button:not([disabled]), input:not([disabled]), ' +
                'select:not([disabled]), textarea:not([disabled]), ' +
                '[tabindex]:not([tabindex="-1"])'
            )
        );

        for ( var i = 0; i < all.length; i++ ) {
            var el = all[ i ];
            if ( overlay && overlay.contains( el ) ) { continue; }
            if ( ! isVisible( el ) ) { continue; }
            // Skip visually-hidden elements (skip-to-content links, SR-only text, etc.)
            // that have no meaningful on-screen size.
            var rect = el.getBoundingClientRect();
            if ( rect.width < 2 || rect.height < 2 ) { continue; }
            return el;
        }
        return null;
    }

    /**
     * Check whether an element is visible in the layout.
     *
     * @param  {Element} el
     * @returns {boolean}
     */
    function isVisible( el ) {
        var style = window.getComputedStyle( el );
        return style.display !== 'none' &&
               style.visibility !== 'hidden' &&
               style.opacity !== '0';
    }

    // -----------------------------------------------------------------------
    // Touch / swipe support
    // -----------------------------------------------------------------------

    function attachSwipe( el ) {
        var startY = null;

        el.addEventListener( 'touchstart', function ( e ) {
            startY = e.touches[0].clientY;
        }, { passive: true } );

        el.addEventListener( 'touchend', function ( e ) {
            if ( startY === null ) { return; }
            var deltaY = startY - e.changedTouches[0].clientY;
            if ( deltaY > 40 && ! isOpen ) {
                open( 'swipe' );
            }
            startY = null;
        }, { passive: true } );
    }

    // -----------------------------------------------------------------------
    // v1.4 — Countdown timer
    // -----------------------------------------------------------------------

    function startCountdown() {
        if ( ! cfg.countdownEnabled || ! cfg.countdownTarget || ! countdown ) {
            return;
        }

        var target = cfg.countdownTarget; // Unix ms from PHP (strtotime * 1000)

        var intervalId = setInterval( function () {
            var remaining = target - Date.now();

            if ( remaining <= 0 ) {
                clearInterval( intervalId );
                countdown.textContent = '';
                if ( ! isOpen ) {
                    open( 'countdown' );
                }
                return;
            }

            var totalSec = Math.floor( remaining / 1000 );
            var h = Math.floor( totalSec / 3600 );
            var m = Math.floor( ( totalSec % 3600 ) / 60 );
            var s = totalSec % 60;

            countdown.textContent = pad( h ) + ':' + pad( m ) + ':' + pad( s );
        }, 1000 );
    }

    /** Zero-pad a number to at least 2 digits. */
    function pad( n ) {
        return String( n ).padStart( 2, '0' );
    }

    // -----------------------------------------------------------------------
    // v1.5 — Custom DOM events
    // -----------------------------------------------------------------------

    /**
     * Dispatch a CustomEvent on document.
     *
     * @param {string} name    Event name (e.g. 'wcr:open')
     * @param {object} detail  Event detail payload
     */
    function dispatch( name, detail ) {
        var e;
        try {
            e = new CustomEvent( name, { bubbles: true, cancelable: false, detail: detail } );
        } catch ( _ ) {
            // Fallback for very old environments (not required for WP 6.x).
            e = document.createEvent( 'CustomEvent' );
            e.initCustomEvent( name, true, false, detail );
        }
        document.dispatchEvent( e );
    }

    // -----------------------------------------------------------------------
    // v1.6 — REST polling for remote reveal
    // -----------------------------------------------------------------------

    function startPolling() {
        var token = cfg.pollToken;
        if ( ! token ) { return; }

        var restBase = ( cfg.restUrl || '' ) + 'wcr/v1/status';

        // Timestamp of the last remote state change we already applied.
        // The endpoint is idempotent (every poller sees the same state), so
        // this is what makes each signal act exactly once per client.
        var lastApplied = 0;

        var pollId = setInterval( function () {
            var url = restBase + '?token=' + encodeURIComponent( token );

            fetch( url, { credentials: 'same-origin' } )
                .then( function ( res ) { return res.json(); } )
                .then( function ( data ) {
                    if ( data.expired ) {
                        clearInterval( pollId );
                        return;
                    }

                    var changed = parseInt( data.changed, 10 ) || 0;
                    if ( ! changed || changed === lastApplied ) {
                        return; // No new signal since the last one we handled.
                    }
                    lastApplied = changed;

                    if ( data.triggered && ! isOpen ) {
                        open( 'remote' );
                    } else if ( data.closed && isOpen ) {
                        close( 'remote' );
                    }
                } )
                .catch( function () {
                    // Network error — continue polling silently.
                } );
        }, 2000 );
    }

    // -----------------------------------------------------------------------
    // Boot
    // -----------------------------------------------------------------------

    if ( document.readyState === 'loading' ) {
        document.addEventListener( 'DOMContentLoaded', init );
    } else {
        init(); // DOM already ready (deferred script loaded after parse).
    }

} )();
