import { Link } from "react-router-dom";
import { useRestitutions } from "../../hooks/useRestitutions";
import { Loading, Empty } from "../../components/ui/States";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { format } from "../../lib/utils";

const statusMap: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" | "info" }> = {
  PENDING: { label: "En attente", variant: "warning" },
  VERIFIED: { label: "Vérifiée", variant: "info" },
  COMPLETED: { label: "Terminée", variant: "success" },
  REJECTED: { label: "Refusée", variant: "danger" },
  CANCELLED: { label: "Annulée", variant: "danger" },
};

export default function RestitutionsList() {
  const { data: restitutions, isLoading, error } = useRestitutions();

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-12 text-red-600">Erreur lors du chargement</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Restitutions</h1>
        <Link to="/restitutions/new">
          <Button>Nouvelle restitution</Button>
        </Link>
      </div>

      {!restitutions || restitutions.length === 0 ? (
        <Empty title="Aucune restitution" description="Vous n'avez pas encore de restitutions en cours." />
      ) : (
        <div className="grid gap-4">
          {restitutions.map((restitution) => (
            <Link key={restitution.id} to={`/restitutions/${restitution.id}`} className="block">
              <div className="card p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={statusMap[restitution.status]?.variant || "default"}>
                        {statusMap[restitution.status]?.label || restitution.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      Match #{restitution.matchId?.slice(0, 8) ?? "-"}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      {format(new Date(restitution.createdAt), "dd/MM/yyyy HH:mm")}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
