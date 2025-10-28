import { useState, useEffect } from 'react';

export type Platform = 'ios' | 'android' | 'web';

export const usePlatform = (): Platform => {
  const [platform, setPlatform] = useState<Platform>('web');

  useEffect(() => {
    const htmlClass = document.documentElement.className;
    if (htmlClass.includes('platform-android')) {
      setPlatform('android');
    } else if (htmlClass.includes('platform-ios')) {
      setPlatform('ios');
    } else {
      setPlatform('web');
    }
  }, []);

  return platform;
};
