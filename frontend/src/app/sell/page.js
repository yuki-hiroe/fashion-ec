'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SellPage() {
  const router = useRouter();

  // 管理者専用に変更したため、このページは無効化
  useEffect(() => {
    alert('商品の出品は管理者のみ可能です');
    router.push('/');
  }, []);

  return null;

}