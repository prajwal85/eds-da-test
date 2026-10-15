/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND site-wide cleanup (AEM Core Components site).
 * All selectors verified in migration-work/cleaned.html (wknd.site/us/en/adventures.html).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Overlays / non-content widgets that could interfere with block parsing.
    WebImporter.DOMUtils.remove(element, [
      // Adobe Audience Manager ID sync pixel: <iframe id="destination_publishing_iframe_wkndsite_0" class="aamIframeLoaded">
      'iframe.aamIframeLoaded',
      '[id^="destination_publishing_iframe"]',
      // Mobile nav toggle: <div id="toggleNav"><a href="#mobileNav" class="toggle">
      '#toggleNav',
      // Mobile nav drawer: <div id="mobileNav" class="cmp-navigation--mobile">
      '#mobileNav',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Global chrome (non-authorable).
    WebImporter.DOMUtils.remove(element, [
      // Header XF: <header class="experiencefragment cmp-experiencefragment--header ...">
      'header.experiencefragment',
      '.cmp-experiencefragment--header',
      // Footer XF: <footer class="experiencefragment cmp-experiencefragment--footer ...">
      'footer.experiencefragment',
      '.cmp-experiencefragment--footer',
      // Sign-in utility: <div class="sign-in-buttons ..."><div class="wknd-sign-in-buttons">
      '.sign-in-buttons',
      '.wknd-sign-in-buttons',
      // Language navigation: <div class="languagenavigation cmp-languagenavigation--header ...">
      '.languagenavigation',
      // Hidden spacer separators: <div class="separator cmp-separator--hidden cmp-separator--space-small ...">
      '.separator.cmp-separator--hidden',
      // Decorative divider closing "Current Adventures": <div class="separator ..."><hr class="cmp-separator__horizontal-rule">
      // An <hr> would become an empty trailing section in EDS.
      'main .separator',
      // Leftover non-authorable elements
      'iframe',
      'noscript',
      'link',
      'script',
      'style',
    ]);

    // Strip tracking / data-layer attributes from remaining elements.
    element.querySelectorAll('[data-cmp-data-layer]').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer');
    });
  }
}
