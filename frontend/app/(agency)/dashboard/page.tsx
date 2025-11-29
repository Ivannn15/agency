'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../../lib/apiClient';
import { useAuth } from '../../../lib/hooks/useAuth';
import { Shell } from '../../../components/layouts/Shell';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>({ clients: 0, projects: 0, reports: [] });

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role === 'CLIENT') router.push('/portal');
      else fetchData();
    }
  }, [user, loading]);

  const fetchData = async () => {
    const clients = await apiFetch('/clients');
    const projects = await apiFetch('/projects');
    const reports = await apiFetch('/reports?status=PUBLISHED');
    setStats({ clients: clients.length, projects: projects.length, reports: reports.slice(0, 5) });
  };

  return (
    <Shell>
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="card">
            <p className="text-sm text-gray-500">Active clients</p>
            <p className="text-3xl font-semibold">{stats.clients}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Projects</p>
            <p className="text-3xl font-semibold">{stats.projects}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Recent reports</p>
            <p className="text-3xl font-semibold">{stats.reports.length}</p>
          </div>
        </div>
        <div className="card">
          <h2 className="font-semibold mb-2">Latest published reports</h2>
          <div className="space-y-2">
            {stats.reports.map((r: any) => (
              <div key={r.id} className="flex justify-between border-b pb-2 last:border-none">
                <div>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-sm text-gray-500">{r.project?.client?.name}</p>
                </div>
                <a className="text-blue-600" href={`/reports/${r.id}`}>
                  View
                </a>
              </div>
            ))}
            {stats.reports.length === 0 && <p className="text-sm text-gray-500">No reports yet</p>}
          </div>
        </div>
      </div>
    </Shell>
  );
}
