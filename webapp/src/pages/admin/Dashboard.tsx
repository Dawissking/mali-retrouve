import { useAdminStats, useIncidents } from "../../hooks/useAdmin";
import { Loading } from "../../components/ui/States";
import { Card } from "../../components/ui/Card";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: incidents, isLoading: incidentsLoading } = useIncidents();

  if (statsLoading || incidentsLoading) return <Loading />;

  const openIncidents = incidents?.filter((i) => i.status === "DETECTED" || i.status === "ANALYZED" || i.status === "CONTAINED") || [];

  const totalDeclarations = stats?.declarations?.reduce((acc: number, d: any) => acc + (d._count?._all ?? 0), 0) ?? 0;
  const totalMatches = stats?.matches?.reduce((acc: number, m: any) => acc + (m._count?._all ?? 0), 0) ?? 0;
  const totalUsers = stats?.users?._count?._all ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Tableau de bord administrateur</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <p className="text-sm font-medium text-gray-500">Déclarations</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{totalDeclarations}</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-gray-500">Correspondances</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{totalMatches}</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-gray-500">Restitutions</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{0}</p>
        </Card>
        <Card>
          <p className="text-sm font-medium text-gray-500">Utilisateurs</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{totalUsers}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Centres</h2>
          <p className="text-3xl font-bold text-gray-900">{0}</p>
          <p className="text-sm text-gray-500 mt-1">Centres opérationnels</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Incidents ouverts</h2>
          <p className="text-3xl font-bold text-gray-900">{openIncidents.length}</p>
          <p className="text-sm text-gray-500 mt-1">Nécessitent une attention</p>
        </Card>
      </div>
    </div>
  );
}
