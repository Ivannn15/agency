'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '../../../lib/apiClient';
import { useAuth } from '../../../lib/hooks/useAuth';
import { Shell } from '../../../components/layouts/Shell';

export default function ProjectsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [newProject, setNewProject] = useState({ name: '', description: '', clientId: '', status: 'PLANNED' });

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role === 'CLIENT') router.push('/portal');
      else {
        fetchProjects();
        fetchClients();
      }
    }
  }, [user, loading]);

  const fetchProjects = async () => {
    const data = await apiFetch('/projects');
    setProjects(data);
  };

  const fetchClients = async () => {
    const data = await apiFetch('/clients');
    setClients(data);
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/projects', { method: 'POST', body: newProject });
    setNewProject({ name: '', description: '', clientId: '', status: 'PLANNED' });
    fetchProjects();
  };

  return (
    <Shell>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500">Agency workspace</p>
          <h1 className="text-2xl font-semibold">Projects</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <form onSubmit={createProject} className="card space-y-2">
          <h2 className="font-semibold">Start a new project</h2>
          <input
            className="border p-2 rounded w-full"
            placeholder="Project name"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          />
          <select
            className="border p-2 rounded w-full"
            value={newProject.clientId}
            onChange={(e) => setNewProject({ ...newProject, clientId: e.target.value })}
          >
            <option value="">Select client</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
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
          <textarea
            className="border p-2 rounded w-full"
            placeholder="What are the goals?"
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />
          <button className="btn-primary" type="submit">
            Create project
          </button>
        </form>
        <div className="lg:col-span-2 card">
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="flex justify-between items-center border-b pb-3 last:border-none">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-500">{p.client?.name}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="badge badge-blue">{p.status}</span>
                    <span className="badge badge-slate">{p.reports?.length || 0} reports</span>
                  </div>
                </div>
                <Link className="text-blue-600" href={`/projects/${p.id}`}>
                  View
                </Link>
              </div>
            ))}
            {projects.length === 0 && <p className="text-sm text-gray-500">No projects yet</p>}
          </div>
        </div>
      </div>
    </Shell>
  );
}
