'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../../../lib/apiClient';
import { useAuth } from '../../../lib/hooks/useAuth';
import { Shell } from '../../../components/layouts/Shell';

export default function ClientsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [clients, setClients] = useState<any[]>([]);
  const [newClient, setNewClient] = useState({ name: '', companyName: '', contactEmail: '' });

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role === 'CLIENT') router.push('/portal');
      else fetchClients();
    }
  }, [user, loading]);

  const fetchClients = async () => {
    const data = await apiFetch('/clients');
    setClients(data);
  };

  const createClient = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/clients', { method: 'POST', body: newClient });
    setNewClient({ name: '', companyName: '', contactEmail: '' });
    fetchClients();
  };

  return (
    <Shell>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Clients</h1>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <form onSubmit={createClient} className="card space-y-2">
          <h2 className="font-semibold">Add client</h2>
          <input className="border p-2 rounded w-full" placeholder="Name" value={newClient.name} onChange={(e) => setNewClient({ ...newClient, name: e.target.value })} />
          <input className="border p-2 rounded w-full" placeholder="Company name" value={newClient.companyName} onChange={(e) => setNewClient({ ...newClient, companyName: e.target.value })} />
          <input className="border p-2 rounded w-full" placeholder="Contact email" value={newClient.contactEmail} onChange={(e) => setNewClient({ ...newClient, contactEmail: e.target.value })} />
          <button className="btn-primary" type="submit">
            Save
          </button>
        </form>
        <div className="col-span-2 card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Client</th>
                <th>Company</th>
                <th>Status</th>
                <th>Projects</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="py-2">
                    <a className="text-blue-600" href={`/clients/${c.id}`}>
                      {c.name}
                    </a>
                  </td>
                  <td>{c.companyName || '-'}</td>
                  <td>{c.status}</td>
                  <td>{c.projects?.length || 0}</td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    No clients yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
