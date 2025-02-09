const { act } = require('react-dom/test-utils');
const { wait } = require('./shared/promise');
require('./shared/polyfill');

// https://enzymejs.github.io/enzyme/docs/guides/jsdom.html
const { JSDOM } = require('jsdom');
const { configure } = require('enzyme');
const Adapter = require('@wojtekmaj/enzyme-adapter-react-17');

configure({ adapter: new Adapter() });

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost/?projectId=test',
});
const { window } = jsdom;

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
global.requestAnimationFrame = function (callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function (id) {
  clearTimeout(id);
};
copyProps(window, global);

window.fetch = () => {
  return Promise.resolve({
    text() {
      return Promise.resolve(null);
    },
    json() {
      return Promise.resolve(null);
    },
  });
};

global.componentLoad = async function (component) {
  await wait(1000);
  await act(async () => {
    await wait(0);
    component.update();
  });
};

global.throwOnErrorBoundary = function (component) {
  component.find('ErrorBoundary').forEach((e) => {
    if (e.find({ type: 'fatal' }).length) {
      // Weird ways to find the actual error message
      throw new Error(e.find('Highlight').props().children);
    }
  });
};
