(function () {
  var translations = window.archiveTranslations || {};
  var language = 'ko';
  try { language = localStorage.getItem('abalon-language') || 'ko'; } catch (error) {}
  var originals = [];
  var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
  while (walker.nextNode()) {
    var node = walker.currentNode;
    if (node.parentNode.closest('script, style, .archive-translate')) continue;
    var key = node.nodeValue.trim().replace(/\s+/g, ' ');
    if (Object.prototype.hasOwnProperty.call(translations, key)) {
      originals.push({node: node, original: node.nodeValue, translated: translations[key]});
    }
  }
  var button = document.getElementById('archive-language-switch');
  if (!button) return;
  function render() {
    originals.forEach(function (entry) {
      var match = entry.original.match(/^(\s*)([\s\S]*?)(\s*)$/);
      entry.node.nodeValue = language === 'en' ? match[1] + entry.translated + match[3] : entry.original;
    });
    document.documentElement.lang = language;
    button.textContent = language === 'en' ? 'Korean' : 'English';
    button.setAttribute('aria-label', language === 'en' ? 'Switch to Korean' : 'Translate to English');
  }
  button.addEventListener('click', function () {
    language = language === 'en' ? 'ko' : 'en';
    try { localStorage.setItem('abalon-language', language); } catch (error) {}
    render();
  });
  var appearanceToggle = document.getElementById('appearance-toggle');
  var appearanceOptions = document.getElementById('appearance-options');
  var recovered = document.getElementById('appearance-recovered');
  var tech = document.getElementById('appearance-tech');
  var late = document.getElementById('appearance-late');
  var stone = document.getElementById('appearance-stone');
  var rough = document.getElementById('appearance-rough');
  var blood = document.getElementById('appearance-blood');
  var logo = 'text';
  try { logo = new URLSearchParams(window.location.search).get('logo') || localStorage.getItem('abalon-logo') || 'text'; } catch (error) {}
  if (logo !== 'image' && logo !== 'studio' && logo !== 'entertainment') logo = 'text';
  var textLogo = document.getElementById('logo-text');
  var imageLogo = document.getElementById('logo-image');
  var studioLogo = document.getElementById('logo-studio');
  var entertainmentLogo = document.getElementById('logo-entertainment');
  var logoImage = document.querySelector('img[alt="Abalon"]');
  var appearance = 'recovered';
  try { appearance = new URLSearchParams(window.location.search).get('appearance') || localStorage.getItem('abalon-appearance') || 'recovered'; } catch (error) {}
  if (appearance !== 'tech' && appearance !== 'late' && appearance !== 'stone' && appearance !== 'rough' && appearance !== 'blood') appearance = 'recovered';
  var newsDots = Array.prototype.slice.call(document.querySelectorAll('img[src^="news_files/news-dot.gif"]')).map(function (img) {
    return { node: img, original: img.getAttribute('src') };
  });
  var themedImages = Array.prototype.slice.call(document.querySelectorAll('img[src^="placeholders/"]')).map(function (img) {
    return { node: img, original: img.getAttribute('src') };
  });
  function applyAppearance(name) {
    appearance = name;
    document.documentElement.dataset.appearance = name;
    document.querySelectorAll('a[href]').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#' || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) return;
      var parts = href.split('#');
      var pathAndQuery = parts[0].split('?');
      if (!/\.html?$/i.test(pathAndQuery[0])) return;
      var params = new URLSearchParams(pathAndQuery[1] || '');
      params.set('appearance', name);
      params.delete('resolution');
      params.set('logo', logo);
      link.setAttribute('href', pathAndQuery[0] + '?' + params.toString() + (parts.length > 1 ? '#' + parts.slice(1).join('#') : ''));
    });
    newsDots.forEach(function (item) {
      item.node.setAttribute('src', name === 'recovered' ? item.original : 'placeholders/' + name + '/news-dot.svg');
    });
    themedImages.forEach(function (item) {
      var source = name === 'recovered' ? item.original : item.original.replace('placeholders/', 'placeholders/' + name + '/') + (item.original.indexOf('?') === -1 ? '?' : '&') + 'theme=6';
      item.node.setAttribute('src', source);
    });
    applyLogo();
    recovered.setAttribute('aria-pressed', String(name === 'recovered'));
    tech.setAttribute('aria-pressed', String(name === 'tech'));
    late.setAttribute('aria-pressed', String(name === 'late'));
    stone.setAttribute('aria-pressed', String(name === 'stone'));
    rough.setAttribute('aria-pressed', String(name === 'rough'));
    blood.setAttribute('aria-pressed', String(name === 'blood'));
    recovered.textContent = name === 'recovered' ? 'Recovered ✓' : 'Recovered';
    tech.textContent = name === 'tech' ? '90s Tech ✓' : '90s Tech';
    late.textContent = name === 'late' ? 'Late 90s ✓' : 'Late 90s';
    stone.textContent = name === 'stone' ? 'Stone ✓' : 'Stone';
    rough.textContent = name === 'rough' ? 'Rough Stone ✓' : 'Rough Stone';
    blood.textContent = name === 'blood' ? 'Dark Fantasy ✓' : 'Dark Fantasy';
  }
  function applyLogo() {
    if (logoImage && logo !== 'text') logoImage.setAttribute('src', logo === 'studio' ? 'abalon-studio-logo.png' : (logo === 'entertainment' ? 'abalon-entertainment-logo.png' : 'abalon-logo.png'));
    if (logoImage) logoImage.style.objectFit = logo !== 'text' ? 'contain' : '';
    textLogo.setAttribute('aria-pressed', String(logo === 'text'));
    imageLogo.setAttribute('aria-pressed', String(logo === 'image'));
    studioLogo.setAttribute('aria-pressed', String(logo === 'studio'));
    entertainmentLogo.setAttribute('aria-pressed', String(logo === 'entertainment'));
    textLogo.textContent = logo === 'text' ? 'Text ✓' : 'Text';
    imageLogo.textContent = logo === 'image' ? 'Abalon logo ✓' : 'Abalon logo';
    studioLogo.textContent = logo === 'studio' ? 'Abalon Studio ✓' : 'Abalon Studio';
    entertainmentLogo.textContent = logo === 'entertainment' ? 'Abalon Entertainment ✓' : 'Abalon Entertainment';
  }
  function selectLogo(name) {
    logo = name;
    try { localStorage.setItem('abalon-logo', name); } catch (error) {}
    applyAppearance(appearance);
    appearanceOptions.hidden = true;
    appearanceToggle.setAttribute('aria-expanded', 'false');
    appearanceToggle.focus();
  }
  textLogo.addEventListener('click', function () { selectLogo('text'); });
  imageLogo.addEventListener('click', function () { selectLogo('image'); });
  studioLogo.addEventListener('click', function () { selectLogo('studio'); });
  entertainmentLogo.addEventListener('click', function () { selectLogo('entertainment'); });
  function selectAppearance(name) {
    applyAppearance(name);
    try { localStorage.setItem('abalon-appearance', name); } catch (error) {}
    appearanceOptions.hidden = true;
    appearanceToggle.setAttribute('aria-expanded', 'false');
    appearanceToggle.focus();
  }
  appearanceToggle.addEventListener('click', function () {
    var expanded = appearanceToggle.getAttribute('aria-expanded') === 'true';
    appearanceToggle.setAttribute('aria-expanded', String(!expanded));
    appearanceOptions.hidden = expanded;
  });
  recovered.addEventListener('click', function () { selectAppearance('recovered'); });
  tech.addEventListener('click', function () { selectAppearance('tech'); });
  late.addEventListener('click', function () { selectAppearance('late'); });
  stone.addEventListener('click', function () { selectAppearance('stone'); });
  rough.addEventListener('click', function () { selectAppearance('rough'); });
  blood.addEventListener('click', function () { selectAppearance('blood'); });
  applyAppearance(appearance);
  render();
}());
