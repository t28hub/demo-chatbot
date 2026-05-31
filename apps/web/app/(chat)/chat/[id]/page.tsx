import type { UUID } from '@demo-chatbot/core';
import { notFound } from 'next/navigation';
import { z } from 'zod';

import { Panel } from '@/components/chat/panel';

export default async function Page({ params }: PageProps<'/chat/[id]'>) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) {
    notFound();
  }
  return <Panel id={id as UUID} />;
}
