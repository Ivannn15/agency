'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiFetch } from '../../../lib/apiClient';
import { useAuth } from '../../../lib/hooks/useAuth';
import { Shell } from '../../../components/layouts/Shell';

export default function ClientsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [clients, setClients] = useState<any[]>([]);
  const [newClient, setNewClient] = useState({ name: '', companyName: '', contactEmail: '' });
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

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

  const filteredClients = useMemo(() => {
    if (statusFilter === 'ALL') return clients;
    return clients.filter((c) => c.status === statusFilter);
  }, [clients, statusFilter]);

  return (
    <Shell>
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500">Agency workspace</p>
          <h1 className="text-2xl font-semibold">Clients</h1>
        </div>
        <select
          className="border rounded px-3 py-2 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="PAUSED">Paused</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <form onSubmit={createClient} className="card space-y-2">
          <h2 className="font-semibold">Add client</h2>
          <p className="text-sm text-gray-500">Create a new client record and start attaching projects.</p>
          <input
            className="border p-2 rounded w-full"
            placeholder="Name"
            value={newClient.name}
            onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
          />
          <input
            className="border p-2 rounded w-full"
            placeholder="Company name"
            value={newClient.companyName}
            onChange={(e) => setNewClient({ ...newClient, companyName: e.target.value })}
          />
          <input
            className="border p-2 rounded w-full"
            placeholder="Contact email"
            value={newClient.contactEmail}
            onChange={(e) => setNewClient({ ...newClient, contactEmail: e.target.value })}
          />
          <button className="btn-primary" type="submit">
            Save client
          </button>
        </form>
        <div className="lg:col-span-2 card">
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
              {filteredClients.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="py-2">
                    <Link className="text-blue-600 font-semibold" href={`/clients/${c.id}`}>
                      {c.name}
                    </Link>
                    <p className="text-xs text-gray-500">{c.contactEmail || 'No contact email'}</p>
                  </td>
                  <td>{c.companyName || '-'}</td>
                  <td>
                    <span
                      className={`badge ${
                        c.status === 'ACTIVE' ? 'badge-green' : c.status === 'PAUSED' ? 'badge-amber' : 'badge-slate'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td>{c.projects?.length || 0}</td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
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
