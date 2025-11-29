'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '../../../lib/apiClient';
import { useAuth } from '../../../lib/hooks/useAuth';
import { Shell } from '../../../components/layouts/Shell';

export default function ReportsListPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<any[]>([]);
  const [status, setStatus] = useState<string>('ALL');

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role === 'CLIENT') router.push('/portal');
      else fetchReports();
    }
  }, [user, loading, status]);

  const fetchReports = async () => {
    const query = status === 'ALL' ? '' : `?status=${status}`;
    const data = await apiFetch(`/reports${query}`);
    setReports(data);
  };

  const displayedReports = useMemo(() => reports, [reports]);

  return (
    <Shell>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500">Agency workspace</p>
          <h1 className="text-2xl font-semibold">Reports</h1>
        </div>
        <select
          className="border rounded px-3 py-2 text-sm"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="ALL">All statuses</option>
          <option value="DRAFT">Drafts</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>
      <div className="card space-y-3">
        {displayedReports.map((r) => (
          <div key={r.id} className="flex items-center justify-between border-b pb-3 last:border-none">
            <div>
              <p className="font-semibold">{r.title}</p>
              <p className="text-sm text-gray-500">{r.project?.client?.name}</p>
              <div className="flex gap-2 mt-1">
                <span className={`badge ${r.status === 'PUBLISHED' ? 'badge-green' : 'badge-amber'}`}>{r.status}</span>
                <span className="badge badge-slate">
                  {new Date(r.periodStart).toLocaleDateString()} - {new Date(r.periodEnd).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Link className="text-blue-600" href={`/reports/${r.id}`}>
              Open
            </Link>
          </div>
        ))}
        {displayedReports.length === 0 && <p className="text-sm text-gray-500">No reports found</p>}
      </div>
    </Shell>
  );
}
