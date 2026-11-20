(function (root) {
  var own = (typeof document !== 'undefined' && document.currentScript && document.currentScript.src) || '';
  var BASE = own.replace(/[^/]*$/, '');

  function index(count, date) {
    var d = date ? new Date(date) : new Date();
    var day = Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 86400000);
    return ((day % count) + count) % count;
  }

  function mount(el, opts) {
    if (!el || typeof fetch !== 'function') return Promise.resolve(null);
    opts = opts || {};
    var base = opts.base || BASE;
    return fetch(base + 'snakes.json').then(function (r) { return r.json(); }).then(function (data) {
      var list = data.animals || [];
      if (!list.length) return null;
      var animal = opts.id
        ? list.filter(function (a) { return a.id === opts.id; })[0]
        : list[index(list.length, opts.date)];
      if (!animal) return null;
      return fetch(base + animal.file).then(function (r) { return r.text(); }).then(function (svg) {
        el.textContent = '';
        el.insertAdjacentHTML('afterbegin', svg);
        el.dataset.animal = animal.id;
        return animal;
      });
    });
  }

  root.Snake = { index: index, mount: mount };
})(typeof window !== 'undefined' ? window : this);
