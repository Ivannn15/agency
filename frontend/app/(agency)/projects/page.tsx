'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../../lib/apiClient';
import { useAuth } from '../../../lib/hooks/useAuth';
import { Shell } from '../../../components/layouts/Shell';

export default function ProjectsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role === 'CLIENT') router.push('/portal');
      else fetchProjects();
    }
  }, [user, loading]);

  const fetchProjects = async () => {
    const data = await apiFetch('/projects');
    setProjects(data);
  };

  return (
    <Shell>
      <h1 className="text-2xl font-semibold">Projects</h1>
      <div className="grid gap-3">
        {projects.map((p) => (
          <div key={p.id} className="card flex justify-between items-center">
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-gray-500">{p.client?.name}</p>
            </div>
            <a className="text-blue-600" href={`/projects/${p.id}`}>
              View
            </a>
          </div>
        ))}
        {projects.length === 0 && <p className="text-sm text-gray-500">No projects yet</p>}
      </div>
    </Shell>
  );
}
