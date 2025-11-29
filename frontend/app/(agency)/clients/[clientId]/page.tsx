'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '../../../../lib/apiClient';
import { useAuth } from '../../../../lib/hooks/useAuth';
import { Shell } from '../../../../components/layouts/Shell';

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'ARCHIVED', label: 'Archived' },
];

export default function ClientDetailPage() {
  const { clientId } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [client, setClient] = useState<any>(null);
  const [newProject, setNewProject] = useState({ name: '', description: '', status: 'PLANNED' });

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role === 'CLIENT') router.push('/portal');
      else fetchClient();
    }
  }, [user, loading]);

  const fetchClient = async () => {
    const data = await apiFetch(`/clients/${clientId}`);
    setClient(data);
  };

  const updateStatus = async (status: string) => {
    await apiFetch(`/clients/${clientId}`, { method: 'PATCH', body: { status } });
    fetchClient();
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/projects', {
      method: 'POST',
      body: { ...newProject, clientId },
    });
    setNewProject({ name: '', description: '', status: 'PLANNED' });
    fetchClient();
  };

  if (!client) return <Shell>Loading...</Shell>;

  return (
    <Shell>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Client</p>
          <h1 className="text-3xl font-semibold">{client.name}</h1>
          <p className="text-gray-500 text-sm">{client.companyName || 'No company name on file'}</p>
        </div>
        <select
          className="border rounded px-3 py-2 text-sm"
          value={client.status}
          onChange={(e) => updateStatus(e.target.value)}
        >
          {statusOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card space-y-2">
          <h2 className="font-semibold">Contact</h2>
          <div className="text-sm text-gray-700">
            <p>Email: {client.contactEmail || 'Not provided'}</p>
            <p>Phone: {client.contactPhone || 'Not provided'}</p>
          </div>
        </div>
        <div className="card lg:col-span-2 space-y-2">
          <h2 className="font-semibold">Projects</h2>
          <div className="grid gap-3">
            {client.projects.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between border rounded px-3 py-2">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.status}</p>
                </div>
                <Link className="text-blue-600 text-sm" href={`/projects/${p.id}`}>
                  View
                </Link>
              </div>
            ))}
            {client.projects.length === 0 && <p className="text-sm text-gray-500">No projects yet</p>}
          </div>
        </div>
      </div>

      <div className="card mt-4">
        <h3 className="font-semibold mb-2">Kick off a new project</h3>
        <form onSubmit={createProject} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm">Name</label>
            <input
              className="border p-2 rounded w-full"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              placeholder="Monthly growth program"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm">Status</label>
            <select
              className="border p-2 rounded w-full"
              value={newProject.status}
              onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
            >
              <option value="PLANNED">Planned</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="PAUSED">Paused</option>
              <option value="DONE">Done</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-sm">Description</label>
            <textarea
              className="border p-2 rounded w-full"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              placeholder="Goals, channels, deliverables"
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button className="btn-primary" type="submit">
              Create project
            </button>
          </div>
        </form>
      </div>
    </Shell>
  );
}
