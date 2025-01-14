type ImagePaths = {
  logo: string;
  placeholder: string;
  logoPlaceholder: {
    png: string;
    svg: string;
  };
  socialIcons: {
    google: string;
    facebook: string;
    spotify: string;
  };
  amenities: {
    wifi: string;
    parking: string;
    pool: string;
    ac: string;
  };
};

export const images: ImagePaths = {
  logo: '/images/logo.svg',
  placeholder: '/images/placeholder.jpg',
  logoPlaceholder: {
    png: '/images/logo-placeholder.png',
    svg: '/images/logo-placeholder.svg',
  },
  socialIcons: {
    google: '/images/socialIcons/google.svg',
    facebook: '/images/socialIcons/facebook.svg',
    spotify: '/images/socialIcons/spotify.svg',
  },
  amenities: {
    wifi: '/images/amenities/wifi.svg',
    parking: '/images/amenities/parking.svg',
    pool: '/images/amenities/pool.svg',
    ac: '/images/amenities/ac.svg',
  },
};