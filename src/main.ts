import {
  initInstallCopy,
  initQuickStart,
  initApiSidebar,
  initCodeTabs,
  initCopyButtons,
  initTrySignIn,
  initTryListings,
  initSmoothScroll,
  initScrollSpy,
  initMobileNav,
} from './interactions';

// Initialize all interactive features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initInstallCopy();
  initQuickStart();
  initApiSidebar();
  initCodeTabs();
  initCopyButtons();
  initTrySignIn();
  initTryListings();
  initSmoothScroll();
  initScrollSpy();
  initMobileNav();
});
