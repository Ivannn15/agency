'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch } from '../../../../lib/apiClient';
import { useAuth } from '../../../../lib/hooks/useAuth';
import { Shell } from '../../../../components/layouts/Shell';

export default function ClientReportPage() {
  const { reportId } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) router.push('/login');
      else if (user.role !== 'CLIENT') router.push('/dashboard');
      else fetchReport();
    }
  }, [user, loading]);

  const fetchReport = async () => {
    const data = await apiFetch(`/client/reports/${reportId}`);
    setReport(data);
  };

  if (!report) return <Shell>Loading...</Shell>;

  const kpis = report.kpisJson || {};

  return (
    <Shell>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">{report.title}</h1>
          <p className="text-sm text-gray-500">{report.project?.name}</p>
        </div>
        <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-sm">Published</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="card space-y-2">
          <h2 className="font-semibold">Summary</h2>
          <p>{report.summary}</p>
          <h3 className="font-semibold">Highlights</h3>
          <p>{report.highlights || '-'}</p>
          <h3 className="font-semibold">Issues</h3>
          <p>{report.issues || '-'}</p>
          <h3 className="font-semibold">Next steps</h3>
          <p>{report.nextSteps || '-'}</p>
        </div>
        <div className="card space-y-2">
          <h2 className="font-semibold">KPIs</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.keys(kpis).length === 0 && <p>No KPIs provided.</p>}
            {Object.entries(kpis).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="capitalize">{key}</span>
                <span className="font-semibold">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
