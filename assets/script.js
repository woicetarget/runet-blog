(function () {
  var list = document.querySelector('.grid');
  if (!list) return;

  var items = Array.prototype.slice.call(list.children);
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  var search = document.getElementById('search');
  var empty = document.getElementById('empty');
  var params = new URLSearchParams(window.location.search);
  var state = { cat: params.get('c') || 'all', q: params.get('q') || '' };

  function normalize(text) {
    return text.toLowerCase().replace(/ё/g, 'е').replace(/[^a-z0-9а-я]+/g, ' ').trim();
  }

  var words = items.map(function (item) {
    return ' ' + normalize(item.getAttribute('data-text')) + ' ';
  });

  function render() {
    var q = normalize(state.q);
    var tokens = q ? q.split(' ') : [];
    var shown = 0;

    items.forEach(function (item, i) {
      var okCat = state.cat === 'all' || item.getAttribute('data-cat') === state.cat;
      // каждое слово запроса должно совпасть с началом какого-нибудь слова в статье
      var okText = tokens.every(function (token) {
        return words[i].indexOf(' ' + token) !== -1;
      });
      item.hidden = !(okCat && okText);
      if (!item.hidden) shown += 1;
    });

    chips.forEach(function (chip) {
      chip.setAttribute('aria-pressed', String(chip.getAttribute('data-cat') === state.cat));
    });

    empty.hidden = shown !== 0;

    var next = new URLSearchParams();
    if (state.cat !== 'all') next.set('c', state.cat);
    if (q) next.set('q', state.q.trim());
    var query = next.toString();
    try {
      window.history.replaceState(null, '', window.location.pathname + (query ? '?' + query : '') + window.location.hash);
    } catch (e) {
      /* file:// и закрытые окна не дают менять адрес — фильтр работает и без этого */
    }
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      state.cat = chip.getAttribute('data-cat');
      render();
    });
  });

  search.value = state.q;
  search.addEventListener('input', function () {
    state.q = search.value;
    render();
  });

  render();
})();
