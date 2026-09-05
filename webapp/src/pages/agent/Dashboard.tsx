import { useAgentMatchQueue } from "../../hooks/useMatches";
import { useRestitutions } from "../../hooks/useRestitutions";
import { useAdminStats } from "../../hooks/useAdmin";
import { Loading } from "../../components/ui/States";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { data: queue, isLoading: queueLoading } = useAgentMatchQueue();
  const { data: restitutions, isLoading: restitutionsLoading } = useRestitutions();
  const { data: stats, isLoading: statsLoading } = useAdminStats();

  const pendingMatches = queue?.filter((m) => m.status === "CANDIDATE" || m.status === "POTENTIAL" || m.status === "TO_VERIFY") || [];
  const pendingRestitutions = restitutions?.filter((r) => r.status === "PENDING" || r.status === "VERIFIED") || [];

  if (queueLoading || restitutionsLoading || statsLoading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Correspondances en attente</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{pendingMatches.length}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/matches">
              <Button variant="outline" size="sm">Voir la file</Button>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Restitutions en cours</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{pendingRestitutions.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <Link to="/restitutions">
              <Button variant="outline" size="sm">Voir les restitutions</Button>
            </Link>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Déclarations totales</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.declarations?.reduce((acc: number, d: any) => acc + (d._count?._all ?? 0), 0) ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
