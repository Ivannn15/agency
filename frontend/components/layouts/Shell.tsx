'use client';
import Link from 'next/link';
import { useAuth } from '../../lib/hooks/useAuth';

export function Shell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  return (
    <div>
      <header className="bg-white border-b border-gray-200">
        <div className="container-page flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-semibold text-blue-700">
              AgencyRoom
            </Link>
            {user && (
              <nav className="flex gap-3 text-sm text-gray-700">
                {user.role !== 'CLIENT' && (
                  <>
                    <Link href="/dashboard">Dashboard</Link>
                    <Link href="/clients">Clients</Link>
                    <Link href="/projects">Projects</Link>
                    <Link href="/reports">Reports</Link>
                  </>
                )}
                {user.role === 'CLIENT' && <Link href="/portal">Portal</Link>}
              </nav>
            )}
          </div>
          <div className="text-sm flex items-center gap-3">
            {user ? (
              <>
                <div className="text-right leading-tight">
                  <p className="font-semibold">{user.fullName}</p>
                  <p className="text-gray-500 text-xs">{user.role.replace('_', ' ')}</p>
                </div>
                <button className="btn-secondary" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <Link className="btn-primary" href="/login">
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="container-page space-y-6">{children}</main>
    </div>
  );
}
