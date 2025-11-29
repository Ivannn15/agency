'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '../../../../lib/apiClient';
import { useAuth } from '../../../../lib/hooks/useAuth';
import { Shell } from '../../../../components/layouts/Shell';

export default function ClientDetailPage() {
  const { clientId } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [client, setClient] = useState<any>(null);
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });

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

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/projects', { method: 'POST', body: { ...projectForm, clientId } });
    setProjectForm({ name: '', description: '' });
    fetchClient();
  };

  if (!client) return <Shell>Loading...</Shell>;

  return (
    <Shell>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{client.name}</h1>
          <p className="text-gray-600 text-sm">{client.companyName}</p>
        </div>
        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">{client.status}</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="card col-span-2">
          <h2 className="font-semibold mb-2">Projects</h2>
          <div className="space-y-2">
            {client.projects.map((p: any) => (
              <div key={p.id} className="border p-3 rounded flex justify-between items-center">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-500">{p.status}</p>
                </div>
                <a className="text-blue-600" href={`/projects/${p.id}`}>
                  View
                </a>
              </div>
            ))}
            {client.projects.length === 0 && <p className="text-sm text-gray-500">No projects yet</p>}
          </div>
        </div>
        <form onSubmit={createProject} className="card space-y-2">
          <h2 className="font-semibold">Add project</h2>
          <input className="border p-2 rounded w-full" placeholder="Project name" value={projectForm.name} onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} />
          <textarea className="border p-2 rounded w-full" placeholder="Description" value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} />
          <button className="btn-primary" type="submit">
            Create
          </button>
        </form>
      </div>
    </Shell>
  );
}
