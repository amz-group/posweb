import { useEffect, useState } from 'react';
import { api } from '@/api/supabaseClient';

let cachedLogo = null;
let fetchPromise = null;

export function useSiteLogo() {
  const [logo, setLogo] = useState(cachedLogo);
  const [loading, setLoading] = useState(cachedLogo === null);

  useEffect(() => {
    if (cachedLogo !== null) {
      setLogo(cachedLogo);
      setLoading(false);
      return;
    }

    if (!fetchPromise) {
      fetchPromise = api.entities.SiteSetting.list('-created_date', 1)
        .then((data) => {
          cachedLogo = data && data[0] ? data[0] : null;
          return cachedLogo;
        })
        .catch(() => {
          cachedLogo = null;
          return null;
        });
    }

    fetchPromise.then((result) => {
      setLogo(result);
      setLoading(false);
    });
  }, []);

  const refresh = async () => {
    fetchPromise = null;
    cachedLogo = null;
    setLoading(true);
    try {
      const data = await api.entities.SiteSetting.list('-created_date', 1);
      cachedLogo = data && data[0] ? data[0] : null;
      setLogo(cachedLogo);
    } catch {
      cachedLogo = null;
      setLogo(null);
    } finally {
      setLoading(false);
    }
  };

  return { logo, loading, refresh };
}
