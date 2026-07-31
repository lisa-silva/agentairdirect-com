const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'assets', 'dollar-cursor-trail.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'assets', 'dollar-cursor-trail.css'), 'utf8');
const renderedPages = [
  'index.html',
  'intel.html',
  'disclaimer.html',
  'privacypolicy.html',
  'refund.html',
  'terms.html',
  'success-agentairdirect.html'
];

function createBrowserFixture({ precisePointer = true, reducedMotion = false, touchPoints = 0 } = {}) {
  const documentListeners = new Map();
  const windowListeners = new Map();
  const animationFrames = new Map();
  const timers = new Map();
  let nextId = 1;

  class FakeElement {
    constructor(tagName) {
      this.tagName = tagName;
      this.children = [];
      this.parentNode = null;
      this.listeners = new Map();
      this.attributes = new Map();
      this.style = {
        setProperty(name, value) {
          this[name] = String(value);
        }
      };
    }

    appendChild(child) {
      child.parentNode = this;
      this.children.push(child);
      return child;
    }

    remove() {
      if (!this.parentNode) return;
      this.parentNode.children = this.parentNode.children.filter((child) => child !== this);
      this.parentNode = null;
    }

    setAttribute(name, value) {
      this.attributes.set(name, value);
    }

    addEventListener(type, listener) {
      this.listeners.set(type, listener);
    }
  }

  function mediaQuery(matches) {
    const listeners = new Set();
    return {
      matches,
      addEventListener(type, listener) {
        if (type === 'change') listeners.add(listener);
      },
      removeEventListener(type, listener) {
        if (type === 'change') listeners.delete(listener);
      },
      addListener(listener) {
        listeners.add(listener);
      },
      removeListener(listener) {
        listeners.delete(listener);
      }
    };
  }

  const preciseMedia = mediaQuery(precisePointer);
  const reducedMedia = mediaQuery(reducedMotion);
  const body = new FakeElement('body');
  const document = {
    body,
    hidden: false,
    readyState: 'complete',
    createElement: (tagName) => new FakeElement(tagName),
    addEventListener: (type, listener) => documentListeners.set(type, listener),
    removeEventListener: (type) => documentListeners.delete(type)
  };
  const window = {
    navigator: { maxTouchPoints: touchPoints },
    matchMedia(query) {
      return query.includes('prefers-reduced-motion') ? reducedMedia : preciseMedia;
    },
    addEventListener: (type, listener) => windowListeners.set(type, listener),
    removeEventListener: (type) => windowListeners.delete(type),
    requestAnimationFrame(callback) {
      const id = nextId++;
      animationFrames.set(id, callback);
      return id;
    },
    cancelAnimationFrame: (id) => animationFrames.delete(id),
    setTimeout(callback) {
      const id = nextId++;
      timers.set(id, callback);
      return id;
    },
    clearTimeout: (id) => timers.delete(id)
  };

  vm.runInNewContext(script, { window, document, navigator: window.navigator, Math, Set, Array });

  return {
    document,
    documentListeners,
    window,
    windowListeners,
    runAnimationFrame(timestamp) {
      const pending = Array.from(animationFrames.values());
      animationFrames.clear();
      pending.forEach((callback) => callback(timestamp));
    },
    runTimers() {
      const pending = Array.from(timers.values());
      timers.clear();
      pending.forEach((callback) => callback());
    }
  };
}

test('cursor trail assets are loaded once on every rendered public page', () => {
  renderedPages.forEach((page) => {
    const html = fs.readFileSync(path.join(root, page), 'utf8');
    assert.equal((html.match(/assets\/dollar-cursor-trail\.css/g) || []).length, 1, page);
    assert.equal((html.match(/assets\/dollar-cursor-trail\.js/g) || []).length, 1, page);
  });
});

test('cursor trail is gated for pointer precision, motion preference, touch, and visibility', () => {
  assert.match(script, /\(hover: hover\) and \(pointer: fine\) and \(min-width: 769px\)/);
  assert.match(script, /prefers-reduced-motion: reduce/);
  assert.match(script, /\(navigator\.maxTouchPoints \|\| 0\) === 0/);
  assert.match(script, /!document\.hidden/);
  assert.match(script, /visibilitychange/);
});

test('cursor trail is bounded, non-interactive, and cleans up particles', () => {
  assert.match(script, /this\.maxParticles = settings\.maxParticles \|\| 12/);
  assert.match(script, /this\.particles\.size >= this\.maxParticles/);
  assert.match(script, /animationend/);
  assert.match(script, /window\.removeEventListener\('pointermove'/);
  assert.match(styles, /pointer-events: none !important/g);
  assert.match(styles, /overflow: hidden/);
});

test('desktop particles are bounded, expire, and clear when the page becomes hidden', () => {
  const fixture = createBrowserFixture();
  const pointerMove = fixture.windowListeners.get('pointermove');

  assert.equal(fixture.document.body.children.length, 1);
  assert.equal(typeof pointerMove, 'function');

  for (let index = 0; index < 20; index += 1) {
    pointerMove({ clientX: index * 20, clientY: index * 12, pointerType: 'mouse' });
    fixture.runAnimationFrame(100 + index * 100);
  }

  assert.equal(fixture.window.dollarCursorTrail.particles.size, 12);
  fixture.runTimers();
  assert.equal(fixture.window.dollarCursorTrail.particles.size, 0);

  pointerMove({ clientX: 500, clientY: 300, pointerType: 'mouse' });
  fixture.runAnimationFrame(2200);
  fixture.document.hidden = true;
  fixture.documentListeners.get('visibilitychange')();

  assert.equal(fixture.document.body.children.length, 0);
  assert.equal(fixture.window.dollarCursorTrail.active, false);
  assert.equal(fixture.windowListeners.has('pointermove'), false);
});

test('touch, small-pointer, and reduced-motion environments do not mount the trail', () => {
  [
    createBrowserFixture({ touchPoints: 1 }),
    createBrowserFixture({ precisePointer: false }),
    createBrowserFixture({ reducedMotion: true })
  ].forEach((fixture) => {
    assert.equal(fixture.document.body.children.length, 0);
    assert.equal(fixture.window.dollarCursorTrail.active, false);
    assert.equal(fixture.windowListeners.has('pointermove'), false);
  });
});
