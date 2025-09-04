export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export const pageview = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

export const trackEvent = (eventName, parameters = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters);
  }
};

export const trackPurchase = (value, currency = 'USD') => {
  trackEvent('Purchase', { value, currency });
};

export const trackAddToCart = (value, currency = 'USD') => {
  trackEvent('AddToCart', { value, currency });
};

export const trackLead = () => {
  trackEvent('Lead');
};