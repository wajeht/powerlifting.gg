// Main function that returns an object with methods to control link preloading
function createPreloadLinksOnHover() {
  // Set to store already cached URLs
  const cache = new Set();

  // Create a link element for prefetching
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'prefetch';
  document.head.appendChild(preloadLink);

  // Configuration object with default values
  const config = {
    hoverDelay: 50,        // Delay before preloading starts (ms)
    maxConcurrent: 2,      // Maximum number of concurrent preloads
    timeout: 3000,         // Timeout for preload requests (ms)
    preloadExternal: false, // Whether to preload external links
    preloadSubdomains: true, // Whether to preload subdomain links
    logErrors: true        // Whether to log preloading errors
  };

  // Counter for active preload requests
  let activePreloads = 0;

  // Function to preload a given URL
  function preload(url) {
    // Skip if URL is already cached or max concurrent preloads reached
    if (cache.has(url) || activePreloads >= config.maxConcurrent) return;

    activePreloads++;
    cache.add(url);

    // Create an AbortController for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    fetch(url, { signal: controller.signal, mode: 'no-cors' })
      .then(() => {
        preloadLink.href = url; // Set the preload link's href on successful fetch
      })
      .catch((error) => {
        if (error.name !== 'AbortError' && config.logErrors) {
          console.warn(`Failed to preload ${url}:`, error);
        }
      })
      .finally(() => {
        clearTimeout(timeoutId);
        activePreloads--;
      });
  }

  // Function to determine if a URL should be preloaded
  function shouldPreload(url) {
    if (!url) return false;

    const linkUrl = new URL(url, window.location.origin);
    const currentDomain = window.location.hostname;

    // Function to get the base domain
    function getBaseDomain(domain) {
      const parts = domain.split('.');
      return parts.slice(-2).join('.');
    }

    const linkBaseDomain = getBaseDomain(linkUrl.hostname);
    const currentBaseDomain = getBaseDomain(currentDomain);

    // Check if it's a subdomain or the same domain
    const isSubdomainOrSameDomain = linkBaseDomain === currentBaseDomain;

    // Allow if it's a subdomain/same domain and subdomain preloading is enabled
    if (isSubdomainOrSameDomain && config.preloadSubdomains) {
      return true;
    }

    // Allow if it's external and external preloading is enabled
    if (!isSubdomainOrSameDomain && config.preloadExternal) {
      return true;
    }

    // Disallow if it's external and external preloading is disabled
    if (!isSubdomainOrSameDomain && !config.preloadExternal) {
      return false;
    }

    // Exclude certain protocols from preloading
    return !['#', 'mailto:', 'tel:', 'sms:', 'file:'].some(protocol => url.startsWith(protocol));
  }

  // Event handler for mouse enter on links
  function handleMouseEnter() {
    const url = this.href;
    if (shouldPreload(url)) {
      setTimeout(() => preload(url), config.hoverDelay);
    }
  }

  // Function to attach event listeners to all links
  function attachListeners() {
    document.querySelectorAll('a').forEach(link => {
      link.addEventListener('mouseenter', handleMouseEnter, { passive: true });
    });
  }

  // Initialization function
  function init(userConfig = {}) {
    Object.assign(config, userConfig);

    // Disable preloading if data saver mode is detected
    if ('connection' in navigator && navigator.connection.saveData) {
      console.log('Data saver mode detected. Preloading disabled.');
      return;
    }

    // Attach listeners when the page is fully loaded
    window.addEventListener('load', attachListeners);
  }

  // Return public methods
  return {
    init,
    preloadNow(url) {
      if (shouldPreload(url)) preload(url);
    }
  };
}

// Create an instance of the preloader
const preloadLinksOnHover = createPreloadLinksOnHover();

// Initialize with default settings
preloadLinksOnHover.init();

// Example of custom initialization:
// preloadLinksOnHover.init({
//   hoverDelay: 100,
//   maxConcurrent: 3,
//   preloadExternal: true,
//   preloadSubdomains: true
// });
