'use client';

import { useEffect } from 'react';

const HomePage = () => {
  useEffect(() => {
    window.location.href = '/dashboard';
  }, []);

  return null;
};

export default HomePage;
