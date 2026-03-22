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
