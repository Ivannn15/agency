import Link from 'next/link';

const highlights = [
  {
    title: 'Client-ready reports',
    body: 'Publish digestible campaign recaps with KPIs, highlights, and next steps without fiddling in docs.',
  },
  {
    title: 'Project visibility',
    body: 'Give every client a live portal with their active projects, statuses, and published reports.',
  },
  {
    title: 'Agency-friendly',
    body: 'Built for small teams – onboard an agency, add clients, invite managers, and ship updates fast.',
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="page-hero">
        <div className="container-page flex flex-col gap-6">
          <div>
            <h1>Client reporting, without the chaos</h1>
            <p>
              AgencyRoom is a lightweight client portal for marketing agencies. Register your agency, add clients and
              projects, and publish reports your customers will actually read.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/register" className="btn-primary">
              Create your agency
            </Link>
            <Link href="/login" className="btn-secondary">
              Log in
            </Link>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-blue-100">
            <span className="badge badge-slate bg-white/20 text-white">No setup fees</span>
            <span className="badge badge-slate bg-white/20 text-white">Client-ready in minutes</span>
            <span className="badge badge-slate bg-white/20 text-white">Built for small teams</span>
          </div>
        </div>
      </section>
      <section className="container-page grid gap-6 md:grid-cols-3 -mt-10">
        {highlights.map((item) => (
          <div key={item.title} className="card">
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
