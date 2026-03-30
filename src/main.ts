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
  initWebhookEvents,
  initWebhookTabs,
  initApiKeyTabs,
  initWidgetConfigurator,
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
  initWebhookEvents();
  initWebhookTabs();
  initApiKeyTabs();
  initWidgetConfigurator();
  initSmoothScroll();
  initScrollSpy();
  initMobileNav();
});
