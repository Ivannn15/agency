'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '../../../lib/apiClient';
import { useAuth } from '../../../lib/hooks/useAuth';
import { Shell } from '../../../components/layouts/Shell';

export default function ClientPortalPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [overview, setOverview] = useState<any>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role !== 'CLIENT') router.push('/dashboard');
      else fetchOverview();
    }
  }, [user, loading]);

  const fetchOverview = async () => {
    const data = await apiFetch('/client/overview');
    setOverview(data);
  };

  if (!overview) return <Shell>Loading...</Shell>;

  return (
    <Shell>
      <h1 className="text-2xl font-semibold">{overview.client.name}</h1>
      <div className="grid gap-3">
        {overview.projects.map((p: any) => (
          <div key={p.id} className="card">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-gray-500">{p.status}</p>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              {p.reports.map((r: any) => (
                <div key={r.id} className="flex justify-between text-sm">
                  <span>{r.title}</span>
                  <Link className="text-blue-600" href={`/reports/${r.id}`}>
                    View
                  </Link>
                </div>
              ))}
              {p.reports.length === 0 && <p className="text-sm text-gray-500">No published reports yet</p>}
            </div>
          </div>
        ))}
      </div>
    </Shell>
  );
}
