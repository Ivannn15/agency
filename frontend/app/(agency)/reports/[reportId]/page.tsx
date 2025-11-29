'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '../../../../lib/apiClient';
import { useAuth } from '../../../../lib/hooks/useAuth';
import { Shell } from '../../../../components/layouts/Shell';

export default function ReportDetailPage() {
  const { reportId } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role === 'CLIENT') router.push('/portal');
      else fetchReport();
    }
  }, [user, loading]);

  const fetchReport = async () => {
    const data = await apiFetch(`/reports/${reportId}`);
    setReport(data);
    setForm({ ...data, kpisJson: data.kpisJson || {} });
  };

  const save = async () => {
    await apiFetch(`/reports/${reportId}`, { method: 'PATCH', body: { ...form, kpisJson: form.kpisJson } });
    fetchReport();
  };

  const publish = async () => {
    await apiFetch(`/reports/${reportId}/publish`, { method: 'POST' });
    fetchReport();
  };

  if (!report) return <Shell>Loading...</Shell>;

  return (
    <Shell>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">{report.title}</h1>
          <p className="text-sm text-gray-500">{report.project?.client?.name}</p>
        </div>
        <span className="px-2 py-1 rounded bg-gray-100 text-sm">{report.status}</span>
      </div>
      <div className="card space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Title</label>
            <input className="border p-2 rounded w-full" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm">Period start</label>
              <input type="date" className="border p-2 rounded w-full" value={form.periodStart?.substring(0, 10) || ''} onChange={(e) => setForm({ ...form, periodStart: e.target.value })} />
            </div>
            <div>
              <label className="text-sm">Period end</label>
              <input type="date" className="border p-2 rounded w-full" value={form.periodEnd?.substring(0, 10) || ''} onChange={(e) => setForm({ ...form, periodEnd: e.target.value })} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Summary</label>
            <textarea className="border p-2 rounded w-full" value={form.summary || ''} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm">Highlights</label>
              <textarea className="border p-2 rounded w-full" value={form.highlights || ''} onChange={(e) => setForm({ ...form, highlights: e.target.value })} />
            </div>
            <div>
              <label className="text-sm">Issues</label>
              <textarea className="border p-2 rounded w-full" value={form.issues || ''} onChange={(e) => setForm({ ...form, issues: e.target.value })} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm">Next steps</label>
            <textarea className="border p-2 rounded w-full" value={form.nextSteps || ''} onChange={(e) => setForm({ ...form, nextSteps: e.target.value })} />
          </div>
          <div className="card bg-gray-50">
            <h3 className="font-semibold mb-2">KPIs</h3>
            {['impressions', 'clicks', 'ctr', 'cost', 'conversions', 'cpa', 'roas'].map((k) => (
              <div key={k} className="flex items-center justify-between text-sm mb-1">
                <label className="capitalize">{k}</label>
                <input
                  className="border p-1 rounded w-32"
                  value={form.kpisJson?.[k] || ''}
                  onChange={(e) => setForm({ ...form, kpisJson: { ...form.kpisJson, [k]: e.target.value } })}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-primary" onClick={save} type="button">
            Save
          </button>
          {report.status === 'DRAFT' && (
            <button className="btn-secondary" onClick={publish} type="button">
              Publish
            </button>
          )}
        </div>
      </div>
    </Shell>
  );
}
