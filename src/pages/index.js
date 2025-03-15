/**
 * DEPRECATED: This file is being kept for reference only.
 * The main application now uses the App Router (src/app/page.tsx).
 * 
 * This file should NOT be deleted without careful consideration to avoid
 * breaking changes in version control or deployment processes.
 */

// Original redirect logic commented out to prevent conflicts
/*
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/');
  }, [router]);

  return null;
}
*/

// Export an empty component to avoid build errors
export default function DeprecatedHome() {
  return null;
} 