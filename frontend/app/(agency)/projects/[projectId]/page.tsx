'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '../../../../lib/apiClient';
import { useAuth } from '../../../../lib/hooks/useAuth';
import { Shell } from '../../../../components/layouts/Shell';

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [reportForm, setReportForm] = useState({ title: '', periodStart: '', periodEnd: '', summary: '' });

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role === 'CLIENT') router.push('/portal');
      else fetchProject();
    }
  }, [user, loading]);

  const fetchProject = async () => {
    const data = await apiFetch(`/projects/${projectId}`);
    setProject(data);
  };

  const createReport = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/reports', { method: 'POST', body: { ...reportForm, projectId } });
    setReportForm({ title: '', periodStart: '', periodEnd: '', summary: '' });
    fetchProject();
  };

  if (!project) return <Shell>Loading...</Shell>;

  return (
    <Shell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{project.name}</h1>
          <p className="text-gray-600 text-sm">{project.client?.name}</p>
        </div>
        <span className="text-sm px-2 py-1 bg-gray-100 rounded">{project.status}</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="card col-span-2 space-y-2">
          <h2 className="font-semibold mb-2">Reports</h2>
          {project.reports.map((r: any) => (
            <div key={r.id} className="border p-3 rounded flex justify-between items-center">
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="text-sm text-gray-500">{r.status}</p>
              </div>
              <a className="text-blue-600" href={`/reports/${r.id}`}>
                View / edit
              </a>
            </div>
          ))}
          {project.reports.length === 0 && <p className="text-sm text-gray-500">No reports</p>}
        </div>
        <form onSubmit={createReport} className="card space-y-2">
          <h2 className="font-semibold">Create report</h2>
          <input className="border p-2 rounded w-full" placeholder="Title" value={reportForm.title} onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })} />
          <input className="border p-2 rounded w-full" type="date" value={reportForm.periodStart} onChange={(e) => setReportForm({ ...reportForm, periodStart: e.target.value })} />
          <input className="border p-2 rounded w-full" type="date" value={reportForm.periodEnd} onChange={(e) => setReportForm({ ...reportForm, periodEnd: e.target.value })} />
          <textarea className="border p-2 rounded w-full" placeholder="Summary" value={reportForm.summary} onChange={(e) => setReportForm({ ...reportForm, summary: e.target.value })} />
          <button className="btn-primary" type="submit">
            Save
          </button>
        </form>
      </div>
    </Shell>
  );
}
