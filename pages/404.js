// this file is for redirect to home in nextjs framework
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    //ls ./src/pages/[lang]
    router.replace('/');
  }, [router]);

  return null;
}
