(function () {
  'use strict';

  var PRECISE_POINTER_QUERY = '(hover: hover) and (pointer: fine) and (min-width: 769px)';
  var REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
  var COLORS = ['#34d399', '#6ee7b7', '#a3e635'];

  class DollarCursorTrail {
    constructor(options) {
      var settings = options || {};

      this.maxParticles = settings.maxParticles || 12;
      this.minInterval = settings.minInterval || 85;
      this.minDistance = settings.minDistance || 10;
      this.particles = new Set();
      this.precisePointer = window.matchMedia(PRECISE_POINTER_QUERY);
      this.reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
      this.container = null;
      this.frameId = 0;
      this.lastEmitTime = 0;
      this.lastEmitX = null;
      this.lastEmitY = null;
      this.pointerX = 0;
      this.pointerY = 0;
      this.active = false;
      this.mounted = false;

      this.handlePointerMove = this.handlePointerMove.bind(this);
      this.handleEnvironmentChange = this.handleEnvironmentChange.bind(this);
      this.handlePageHide = this.handlePageHide.bind(this);
      this.handlePageShow = this.handlePageShow.bind(this);
      this.emitParticle = this.emitParticle.bind(this);
    }

    mount() {
      if (this.mounted) return;

      this.mounted = true;
      document.addEventListener('visibilitychange', this.handleEnvironmentChange);
      window.addEventListener('pagehide', this.handlePageHide);
      window.addEventListener('pageshow', this.handlePageShow);
      this.addMediaListener(this.precisePointer);
      this.addMediaListener(this.reducedMotion);
      this.handleEnvironmentChange();
    }

    destroy() {
      if (!this.mounted) return;

      this.stop();
      document.removeEventListener('visibilitychange', this.handleEnvironmentChange);
      window.removeEventListener('pagehide', this.handlePageHide);
      window.removeEventListener('pageshow', this.handlePageShow);
      this.removeMediaListener(this.precisePointer);
      this.removeMediaListener(this.reducedMotion);
      this.mounted = false;
    }

    addMediaListener(query) {
      if (typeof query.addEventListener === 'function') {
        query.addEventListener('change', this.handleEnvironmentChange);
      } else {
        query.addListener(this.handleEnvironmentChange);
      }
    }

    removeMediaListener(query) {
      if (typeof query.removeEventListener === 'function') {
        query.removeEventListener('change', this.handleEnvironmentChange);
      } else {
        query.removeListener(this.handleEnvironmentChange);
      }
    }

    shouldRun() {
      return this.precisePointer.matches &&
        !this.reducedMotion.matches &&
        (navigator.maxTouchPoints || 0) === 0 &&
        !document.hidden;
    }

    handleEnvironmentChange() {
      if (this.shouldRun()) {
        this.start();
      } else {
        this.stop();
      }
    }

    handlePageHide() {
      this.stop();
    }

    handlePageShow() {
      this.handleEnvironmentChange();
    }

    start() {
      if (this.active || !document.body) return;

      this.container = document.createElement('div');
      this.container.className = 'dollar-cursor-trail';
      this.container.setAttribute('aria-hidden', 'true');
      document.body.appendChild(this.container);
      window.addEventListener('pointermove', this.handlePointerMove, { passive: true });
      this.active = true;
    }

    stop() {
      if (this.active) {
        window.removeEventListener('pointermove', this.handlePointerMove);
      }

      this.active = false;
      this.lastEmitTime = 0;
      this.lastEmitX = null;
      this.lastEmitY = null;

      if (this.frameId) {
        window.cancelAnimationFrame(this.frameId);
        this.frameId = 0;
      }

      Array.from(this.particles).forEach(this.removeParticle, this);

      if (this.container) {
        this.container.remove();
        this.container = null;
      }
    }

    handlePointerMove(event) {
      if (!this.active || (event.pointerType && event.pointerType !== 'mouse')) return;

      this.pointerX = event.clientX;
      this.pointerY = event.clientY;

      if (!this.frameId) {
        this.frameId = window.requestAnimationFrame(this.emitParticle);
      }
    }

    emitParticle(timestamp) {
      this.frameId = 0;
      if (!this.active || !this.container || document.hidden) return;

      var distance = this.lastEmitX === null
        ? Infinity
        : Math.hypot(this.pointerX - this.lastEmitX, this.pointerY - this.lastEmitY);

      if (timestamp - this.lastEmitTime < this.minInterval || distance < this.minDistance) return;

      this.lastEmitTime = timestamp;
      this.lastEmitX = this.pointerX;
      this.lastEmitY = this.pointerY;

      if (this.particles.size >= this.maxParticles) {
        this.removeParticle(this.particles.values().next().value);
      }

      this.createParticle();
    }

    createParticle() {
      var particle = document.createElement('span');
      var duration = this.randomBetween(780, 1050);
      var startRotation = this.randomBetween(-18, 18);
      var endRotation = startRotation + this.randomBetween(-28, 28);
      var x = this.pointerX + this.randomBetween(-4, 4);
      var y = this.pointerY + this.randomBetween(-3, 3);
      var self = this;
      var fallbackId;

      particle.className = 'dollar-cursor-trail__particle';
      particle.textContent = '$';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.setProperty('--dollar-color', COLORS[Math.floor(Math.random() * COLORS.length)]);
      particle.style.setProperty('--dollar-size', this.randomBetween(10, 14) + 'px');
      var opacity = this.randomBetween(27, 43) / 100;
      particle.style.setProperty('--dollar-opacity', opacity);
      particle.style.setProperty('--dollar-mid-opacity', opacity * 0.72);
      particle.style.setProperty('--dollar-duration', duration + 'ms');
      particle.style.setProperty('--dollar-drift-x', this.randomBetween(-13, 13) + 'px');
      particle.style.setProperty('--dollar-drift-y', this.randomBetween(-32, -18) + 'px');
      particle.style.setProperty('--dollar-start-rotation', startRotation + 'deg');
      particle.style.setProperty('--dollar-end-rotation', endRotation + 'deg');
      particle.style.setProperty('--dollar-end-scale', this.randomBetween(88, 112) / 100);

      function remove() {
        window.clearTimeout(fallbackId);
        self.removeParticle(particle);
      }

      particle.addEventListener('animationend', remove, { once: true });
      this.container.appendChild(particle);
      this.particles.add(particle);
      fallbackId = window.setTimeout(remove, duration + 150);
      particle.dollarCursorTimeout = fallbackId;
    }

    removeParticle(particle) {
      if (!particle) return;

      window.clearTimeout(particle.dollarCursorTimeout);
      this.particles.delete(particle);
      particle.remove();
    }

    randomBetween(min, max) {
      return Math.random() * (max - min) + min;
    }
  }

  window.DollarCursorTrail = DollarCursorTrail;

  function initializeDollarCursorTrail() {
    if (window.dollarCursorTrail) return;

    window.dollarCursorTrail = new DollarCursorTrail();
    window.dollarCursorTrail.mount();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDollarCursorTrail, { once: true });
  } else {
    initializeDollarCursorTrail();
  }
})();
