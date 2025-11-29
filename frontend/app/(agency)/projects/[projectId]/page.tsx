'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '../../../../lib/apiClient';
import { useAuth } from '../../../../lib/hooks/useAuth';
import { Shell } from '../../../../components/layouts/Shell';

const statusOptions = ['PLANNED', 'IN_PROGRESS', 'PAUSED', 'DONE'];

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [projectForm, setProjectForm] = useState<any>({});
  const [newReport, setNewReport] = useState({ title: '', periodStart: '', periodEnd: '', summary: '' });

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
    setProjectForm({ ...data, startDate: data.startDate?.substring(0, 10) || '', endDate: data.endDate?.substring(0, 10) || '' });
  };

  const saveProject = async () => {
    await apiFetch(`/projects/${projectId}`, { method: 'PATCH', body: projectForm });
    fetchProject();
  };

  const createReport = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/reports', { method: 'POST', body: { ...newReport, projectId } });
    setNewReport({ title: '', periodStart: '', periodEnd: '', summary: '' });
    fetchProject();
  };

  if (!project) return <Shell>Loading...</Shell>;

  return (
    <Shell>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Project</p>
          <h1 className="text-3xl font-semibold">{project.name}</h1>
          <p className="text-gray-500 text-sm">{project.client?.name}</p>
        </div>
        <span className="badge badge-blue">{project.status}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card space-y-3">
          <h2 className="font-semibold">Project details</h2>
          <div className="space-y-1">
            <label className="text-sm">Name</label>
            <input
              className="border p-2 rounded w-full"
              value={projectForm.name || ''}
              onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Status</label>
            <select
              className="border p-2 rounded w-full"
              value={projectForm.status || 'PLANNED'}
              onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-sm">Start date</label>
              <input
                type="date"
                className="border p-2 rounded w-full"
                value={projectForm.startDate || ''}
                onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm">End date</label>
              <input
                type="date"
                className="border p-2 rounded w-full"
                value={projectForm.endDate || ''}
                onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm">Description</label>
            <textarea
              className="border p-2 rounded w-full"
              value={projectForm.description || ''}
              onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
            />
          </div>
          <button className="btn-primary" onClick={saveProject} type="button">
            Save project
          </button>
        </div>

        <div className="card lg:col-span-2 space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Reports</h2>
            <span className="badge badge-slate">{project.reports?.length || 0} total</span>
          </div>
          <div className="space-y-2">
            {project.reports.map((r: any) => (
              <div key={r.id} className="flex items-center justify-between border-b pb-2 last:border-none">
                <div>
                  <p className="font-medium">{r.title}</p>
                  <p className="text-xs text-gray-500">{r.status}</p>
                </div>
                <Link className="text-blue-600" href={`/reports/${r.id}`}>
                  Open
                </Link>
              </div>
            ))}
            {project.reports.length === 0 && <p className="text-sm text-gray-500">No reports yet</p>}
          </div>

          <div className="border-t pt-3">
            <h3 className="font-semibold mb-2">Draft a report</h3>
            <form onSubmit={createReport} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2 space-y-1">
                <label className="text-sm">Title</label>
                <input
                  className="border p-2 rounded w-full"
                  value={newReport.title}
                  onChange={(e) => setNewReport({ ...newReport, title: e.target.value })}
                  placeholder="April performance recap"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Period start</label>
                <input
                  type="date"
                  className="border p-2 rounded w-full"
                  value={newReport.periodStart}
                  onChange={(e) => setNewReport({ ...newReport, periodStart: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm">Period end</label>
                <input
                  type="date"
                  className="border p-2 rounded w-full"
                  value={newReport.periodEnd}
                  onChange={(e) => setNewReport({ ...newReport, periodEnd: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-sm">Summary</label>
                <textarea
                  className="border p-2 rounded w-full"
                  value={newReport.summary}
                  onChange={(e) => setNewReport({ ...newReport, summary: e.target.value })}
                  placeholder="Key results and highlights"
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button className="btn-primary" type="submit">
                  Create draft
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Shell>
  );
}
