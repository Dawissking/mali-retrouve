import { Link } from "react-router-dom";
import { useAgentMatchQueue } from "../../hooks/useMatches";
import { useValidateMatch } from "../../hooks/useMatches";
import { Loading, Empty } from "../../components/ui/States";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { format } from "../../lib/utils";

const statusMap: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" | "info" }> = {
  CANDIDATE: { label: "Candidat", variant: "warning" },
  POTENTIAL: { label: "Potentiel", variant: "info" },
  TO_VERIFY: { label: "À vérifier", variant: "warning" },
  CONFIRMED: { label: "Confirmée", variant: "success" },
  REJECTED: { label: "Refusée", variant: "danger" },
  CLOSED: { label: "Fermée", variant: "default" },
};

export default function MatchesQueue() {
  const { data: matches, isLoading, error } = useAgentMatchQueue();

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-12 text-red-600">Erreur lors du chargement</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">File de correspondances</h1>

      {!matches || matches.length === 0 ? (
        <Empty title="Aucune correspondance en attente" description="La file est vide pour le moment." />
      ) : (
        <div className="grid gap-4">
          {matches.map((match) => (
            <div key={match.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant={statusMap[match.status]?.variant || "default"}>
                      {statusMap[match.status]?.label || match.status}
                    </Badge>
                    {match.score !== undefined && (
                      <span className="text-sm text-gray-500">
                        Score: {Math.round(match.score * 100)}%
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    Déclaration #{match.lostDeclarationId.slice(0, 8)} ↔ #{match.foundDeclarationId.slice(0, 8)}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {format(new Date(match.createdAt), "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Link to={`/matches/${match.id}`}>
                    <Button size="sm">Traiter</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
