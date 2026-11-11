import type { Metadata } from 'next';
import { InnerPage } from '@/components/InnerPage';
import { pageByPath } from '@/content/site';
import { pageMeta } from '@/lib/meta';

const page = pageByPath('/privacidade')!;

export const metadata: Metadata = pageMeta(page);

export default function Page() {
  return <InnerPage page={page} />;
}
