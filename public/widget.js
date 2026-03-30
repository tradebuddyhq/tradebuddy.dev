(function () {
  'use strict';

  var API_BASE = 'https://mytradebuddy.com/api';
  var script = document.currentScript;
  if (!script) return;

  var theme = script.getAttribute('data-theme') || 'dark';
  var category = script.getAttribute('data-category') || '';
  var type = script.getAttribute('data-type') || '';
  var limit = parseInt(script.getAttribute('data-limit') || '5', 10);

  var isDark = theme === 'dark';

  var colors = {
    bg: isDark ? '#161b22' : '#ffffff',
    border: isDark ? '#30363d' : '#e0e0e0',
    text: isDark ? '#e6edf3' : '#1a1a1a',
    muted: isDark ? '#8b949e' : '#666666',
    subtle: isDark ? '#6e7681' : '#999999',
    green: '#1EB969',
    blue: '#198CD7',
    hoverBg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
  };

  function el(tag, styles, text) {
    var node = document.createElement(tag);
    if (styles) Object.assign(node.style, styles);
    if (text) node.textContent = text;
    return node;
  }

  var container = el('div', {
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    background: colors.bg,
    border: '1px solid ' + colors.border,
    borderRadius: '12px',
    overflow: 'hidden',
    maxWidth: '400px',
    fontSize: '14px',
    lineHeight: '1.5',
    color: colors.text,
  });

  // Header
  var header = el('div', {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 16px',
    borderBottom: '1px solid ' + colors.border,
    fontWeight: '700',
    fontSize: '14px',
  });
  var icon = document.createElement('span');
  icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="' + colors.green + '" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>';
  header.appendChild(icon);
  header.appendChild(el('span', {}, 'Trade Buddy'));
  container.appendChild(header);

  // Items container
  var items = el('div', { padding: '4px 0' });
  container.appendChild(items);

  // Loading state
  var loading = el('div', {
    padding: '24px 16px',
    textAlign: 'center',
    color: colors.muted,
    fontSize: '13px',
  }, 'Loading listings...');
  items.appendChild(loading);

  // Footer
  var footer = el('div', {
    padding: '12px 16px',
    borderTop: '1px solid ' + colors.border,
    textAlign: 'center',
  });
  var link = el('a', {
    fontSize: '13px',
    color: colors.blue,
    textDecoration: 'none',
    fontWeight: '600',
  }, 'View all on Trade Buddy →');
  link.href = 'https://mytradebuddy.com';
  link.target = '_blank';
  link.rel = 'noopener';
  link.addEventListener('mouseenter', function () { link.style.textDecoration = 'underline'; });
  link.addEventListener('mouseleave', function () { link.style.textDecoration = 'none'; });
  footer.appendChild(link);
  container.appendChild(footer);

  // Insert widget
  script.parentNode.insertBefore(container, script);

  // Fetch listings
  fetch(API_BASE + '/listings.php')
    .then(function (res) { return res.json(); })
    .then(function (data) {
      items.innerHTML = '';
      if (!data.success || !data.listings || data.listings.length === 0) {
        items.appendChild(el('div', {
          padding: '24px 16px',
          textAlign: 'center',
          color: colors.muted,
          fontSize: '13px',
        }, 'No listings available.'));
        return;
      }

      var filtered = data.listings;
      if (category) {
        filtered = filtered.filter(function (l) { return l.category === category; });
      }
      if (type) {
        filtered = filtered.filter(function (l) { return l.type === type; });
      }
      filtered = filtered.slice(0, limit);

      if (filtered.length === 0) {
        items.appendChild(el('div', {
          padding: '24px 16px',
          textAlign: 'center',
          color: colors.muted,
          fontSize: '13px',
        }, 'No matching listings.'));
        return;
      }

      filtered.forEach(function (listing) {
        var row = el('div', {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          cursor: 'default',
          transition: 'background 0.1s',
        });
        row.addEventListener('mouseenter', function () { row.style.background = colors.hoverBg; });
        row.addEventListener('mouseleave', function () { row.style.background = 'transparent'; });

        var info = el('div', { display: 'flex', flexDirection: 'column', gap: '2px' });
        info.appendChild(el('span', { fontWeight: '600', fontSize: '14px', color: colors.text }, listing.title));
        info.appendChild(el('span', { fontSize: '12px', color: colors.subtle }, listing.category + ' · ' + listing.condition));
        row.appendChild(info);

        var price = listing.type === 'Donate' ? 'Free' : '$' + (listing.price || 0);
        row.appendChild(el('span', {
          fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
          fontSize: '14px',
          fontWeight: '700',
          color: colors.green,
          whiteSpace: 'nowrap',
        }, price));

        items.appendChild(row);
      });
    })
    .catch(function () {
      items.innerHTML = '';
      items.appendChild(el('div', {
        padding: '24px 16px',
        textAlign: 'center',
        color: '#f85149',
        fontSize: '13px',
      }, 'Failed to load listings.'));
    });
})();
