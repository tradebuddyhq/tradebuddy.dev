import { endpoints, quickStartSteps } from './api-data';

const API_BASE = 'https://mytradebuddy.com/api';

// ─── Copy to clipboard ───
export function copyToClipboard(text: string, btn: HTMLButtonElement): void {
  navigator.clipboard.writeText(text);
  const original = btn.textContent;
  btn.textContent = 'Copied!';
  btn.classList.add('copied');
  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove('copied');
  }, 2000);
}

// ─── Install command copy ───
export function initInstallCopy(): void {
  const el = document.getElementById('hero-install');
  if (!el) return;
  el.addEventListener('click', () => {
    navigator.clipboard.writeText('npm install @tradebuddy/sdk');
    const hint = el.querySelector('.copy-hint') as HTMLElement;
    hint.textContent = 'Copied!';
    hint.style.color = 'var(--green)';
    setTimeout(() => {
      hint.textContent = 'Click to copy';
      hint.style.color = '';
    }, 2000);
  });
}

// ─── Quick start step switching ───
export function initQuickStart(): void {
  const steps = document.querySelectorAll<HTMLElement>('.qs-step');
  const panels = document.querySelectorAll<HTMLElement>('.qs-panel');

  steps.forEach((step, index) => {
    step.addEventListener('click', () => {
      steps.forEach((s, i) => s.classList.toggle('active', i === index));
      panels.forEach((p, i) => p.classList.toggle('active', i === index));
    });
  });
}

// ─── API sidebar navigation ───
export function initApiSidebar(): void {
  const navItems = document.querySelectorAll<HTMLElement>('.api-nav-item');
  const endpointPanels = document.querySelectorAll<HTMLElement>('.api-endpoint');

  navItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      endpointPanels.forEach((p, i) => p.classList.toggle('active', i === index));
    });
  });
}

// ─── Code tab switching ───
export function initCodeTabs(): void {
  document.querySelectorAll<HTMLElement>('.code-tabs').forEach(tabGroup => {
    const tabs = tabGroup.querySelectorAll<HTMLButtonElement>('.code-tab');
    const block = tabGroup.closest('.code-block');
    if (!block) return;

    const panels = block.querySelectorAll<HTMLElement>('.code-panel');

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        panels.forEach((p, i) => p.classList.toggle('active', i === index));
      });
    });
  });
}

// ─── Copy buttons on code blocks ───
export function initCopyButtons(): void {
  document.querySelectorAll<HTMLButtonElement>('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const block = btn.closest('.code-block') || btn.closest('.quickstart-code');
      if (!block) return;
      const activePanel = block.querySelector('.code-panel.active');
      if (!activePanel) return;
      copyToClipboard(activePanel.textContent || '', btn);
    });
  });
}

// ─── Try it: Sign In ───
export function initTrySignIn(): void {
  const btn = document.getElementById('try-signin-btn') as HTMLButtonElement | null;
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const email = (document.getElementById('try-email') as HTMLInputElement).value;
    const password = (document.getElementById('try-password') as HTMLInputElement).value;
    const responseDiv = document.getElementById('try-response')!;
    const statusEl = document.getElementById('try-status')!;
    const resultEl = document.getElementById('try-result')!;

    if (!email || !password) {
      responseDiv.classList.add('visible');
      statusEl.className = 'status-error';
      statusEl.textContent = 'Error';
      resultEl.textContent = JSON.stringify({ error: 'Please fill in both fields' }, null, 2);
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
      const res = await fetch(`${API_BASE}/auth.php?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      responseDiv.classList.add('visible');
      statusEl.className = data.success ? 'status-200' : 'status-error';
      statusEl.textContent = data.success ? '200 OK' : 'Error';
      resultEl.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      responseDiv.classList.add('visible');
      statusEl.className = 'status-error';
      statusEl.textContent = 'Network Error';
      resultEl.textContent = JSON.stringify({ error: (err as Error).message }, null, 2);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Send Request';
    }
  });
}

// ─── Try it: Listings ───
export function initTryListings(): void {
  const btn = document.getElementById('try-listings-btn') as HTMLButtonElement | null;
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const responseDiv = document.getElementById('try-listings-response')!;
    const statusEl = document.getElementById('try-listings-status')!;
    const resultEl = document.getElementById('try-listings-result')!;

    btn.disabled = true;
    btn.textContent = 'Fetching...';

    try {
      const res = await fetch(`${API_BASE}/listings.php`);
      const data = await res.json();
      responseDiv.classList.add('visible');
      statusEl.className = 'status-200';
      statusEl.textContent = `200 OK — ${data.listings?.length ?? 0} listings`;
      resultEl.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      responseDiv.classList.add('visible');
      statusEl.className = 'status-error';
      statusEl.textContent = 'Network Error';
      resultEl.textContent = JSON.stringify({ error: (err as Error).message }, null, 2);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Fetch Listings';
    }
  });
}

// ─── Webhook event switching ───
export function initWebhookEvents(): void {
  const events = document.querySelectorAll<HTMLElement>('.webhook-event');
  const payloadPanel = document.querySelector<HTMLElement>('[data-wh-panel="payload"]');
  if (!events.length || !payloadPanel) return;

  const payloads: Record<string, string> = {
    'listing.created': `// POST to your endpoint
{
  "event": "listing.created",
  "timestamp": 1711843200000,
  "data": {
    "id": "sell_42",
    "type": "Sell",
    "title": "Graphing Calculator",
    "price": 35,
    "category": "Electronics",
    "condition": "Like New",
    "sellerName": "Jane Doe",
    "sellerEmail": "jane@school.edu"
  }
}`,
    'listing.sold': `// POST to your endpoint
{
  "event": "listing.sold",
  "timestamp": 1711843500000,
  "data": {
    "id": "sell_42",
    "type": "Sell",
    "title": "Graphing Calculator",
    "price": 35,
    "buyerName": "Alex Smith",
    "buyerEmail": "alex@school.edu",
    "sellerName": "Jane Doe"
  }
}`,
    'listing.deleted': `// POST to your endpoint
{
  "event": "listing.deleted",
  "timestamp": 1711844000000,
  "data": {
    "id": "sell_42",
    "reason": "sold",
    "deletedBy": "seller"
  }
}`,
    'user.created': `// POST to your endpoint
{
  "event": "user.created",
  "timestamp": 1711844500000,
  "data": {
    "id": 42,
    "name": "Jane Doe",
    "email": "jane@school.edu",
    "createdAt": 1711844500000
  }
}`,
    'user.deleted': `// POST to your endpoint
{
  "event": "user.deleted",
  "timestamp": 1711845000000,
  "data": {
    "id": 42,
    "email": "jane@school.edu",
    "listingsRemoved": 3
  }
}`,
  };

  events.forEach(ev => {
    ev.addEventListener('click', () => {
      events.forEach(e => e.classList.remove('active'));
      ev.classList.add('active');
      const eventName = ev.getAttribute('data-event') || '';
      const pre = payloadPanel.querySelector('pre');
      if (pre && payloads[eventName]) {
        pre.textContent = payloads[eventName];
      }
    });
  });
}

// ─── Webhook tabs ───
export function initWebhookTabs(): void {
  const tabs = document.querySelectorAll<HTMLButtonElement>('[data-wh-tab]');
  const panels = document.querySelectorAll<HTMLElement>('[data-wh-panel]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-wh-tab');
      panels.forEach(p => p.classList.toggle('active', p.getAttribute('data-wh-panel') === target));
    });
  });
}

// ─── API Key tabs ───
export function initApiKeyTabs(): void {
  const tabs = document.querySelectorAll<HTMLButtonElement>('[data-ak-tab]');
  const panels = document.querySelectorAll<HTMLElement>('[data-ak-panel]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-ak-tab');
      panels.forEach(p => p.classList.toggle('active', p.getAttribute('data-ak-panel') === target));
    });
  });
}

// ─── Widget configurator ───
export function initWidgetConfigurator(): void {
  const themeToggles = document.querySelectorAll<HTMLButtonElement>('.widget-toggle-btn');
  const preview = document.getElementById('widget-preview-inner');
  const categorySelect = document.getElementById('widget-category') as HTMLSelectElement | null;
  const typeSelect = document.getElementById('widget-type') as HTMLSelectElement | null;
  const limitSelect = document.getElementById('widget-limit') as HTMLSelectElement | null;
  const embedOutput = document.getElementById('widget-embed-output');
  const copyBtn = document.getElementById('widget-copy-btn') as HTMLButtonElement | null;

  let theme = 'dark';
  let category = '';
  let type = '';
  let limit = '5';

  function updateEmbed() {
    if (!embedOutput) return;
    let attrs = `  <span class="cb">src</span>=<span class="cs">"https://tradebuddy.dev/widget.js"</span>\n  <span class="cb">data-theme</span>=<span class="cs">"${theme}"</span>`;
    if (category) attrs += `\n  <span class="cb">data-category</span>=<span class="cs">"${category}"</span>`;
    if (type) attrs += `\n  <span class="cb">data-type</span>=<span class="cs">"${type}"</span>`;
    attrs += `\n  <span class="cb">data-limit</span>=<span class="cs">"${limit}"</span>`;
    embedOutput.innerHTML = `<pre>&lt;<span class="ck">script</span>\n${attrs}\n&gt;&lt;/<span class="ck">script</span>&gt;</pre>`;
  }

  themeToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      themeToggles.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      theme = btn.getAttribute('data-theme') || 'dark';
      if (preview) {
        preview.classList.toggle('light', theme === 'light');
      }
      updateEmbed();
    });
  });

  categorySelect?.addEventListener('change', () => { category = categorySelect.value; updateEmbed(); });
  typeSelect?.addEventListener('change', () => { type = typeSelect.value; updateEmbed(); });
  limitSelect?.addEventListener('change', () => { limit = limitSelect.value; updateEmbed(); });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      let plain = `<script\n  src="https://tradebuddy.dev/widget.js"\n  data-theme="${theme}"`;
      if (category) plain += `\n  data-category="${category}"`;
      if (type) plain += `\n  data-type="${type}"`;
      plain += `\n  data-limit="${limit}"\n></script>`;
      navigator.clipboard.writeText(plain);
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.add('copied');
      setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('copied'); }, 2000);
    });
  }
}

// ─── Smooth scroll ───
export function initSmoothScroll(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e: Event) => {
      e.preventDefault();
      const href = a.getAttribute('href');
      if (!href) return;
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ─── Scroll-based nav highlighting ───
export function initScrollSpy(): void {
  const sections = document.querySelectorAll<HTMLElement>('section[id]');

  const update = (): void => {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector<HTMLAnchorElement>(`.nav-links a[href="#${id}"]`);
      if (!link) return;

      if (scrollY >= top && scrollY < top + height) {
        link.style.color = 'var(--text)';
        link.style.background = 'rgba(255,255,255,0.06)';
      } else {
        link.style.color = '';
        link.style.background = '';
      }
    });
  };

  window.addEventListener('scroll', update, { passive: true });
}

// ─── Mobile nav toggle ───
export function initMobileNav(): void {
  const toggle = document.getElementById('nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });
}
