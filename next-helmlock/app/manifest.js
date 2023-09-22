import { MetadataRoute } from 'next';

export default function manifest() {
  return {
    name: 'Helmlock',
    short_name: 'Helmlock',
    description: 'A cashless rental locker for motorcycle helmets',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
