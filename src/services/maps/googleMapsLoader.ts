import { Loader } from '@googlemaps/js-api-loader';

let loaderInstance: Loader | null = null;

export const getGoogleMapsLoader = (apiKey?: string): Loader | null => {
  const key = apiKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!key || key.trim() === '') {
    return null;
  }

  if (!loaderInstance) {
    loaderInstance = new Loader({
      apiKey: key,
      version: 'weekly',
      libraries: ['places', 'geometry', 'visualization'],
    });
  }

  return loaderInstance;
};

export const hasValidGoogleMapsKey = (customKey?: string): boolean => {
  const key = customKey || import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  return Boolean(key && key.trim().length > 10 && !key.includes('YOUR_'));
};
