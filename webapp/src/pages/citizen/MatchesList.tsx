import { Link } from "react-router-dom";
import { useMatches } from "../../hooks/useMatches";
import { useAcceptMatch, useRejectMatch } from "../../hooks/useMatches";
import { Loading } from "../../components/ui/States";
import { Empty } from "../../components/ui/States";
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

export default function MatchesList() {
  const { data: matches, isLoading, error } = useMatches();

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-12 text-red-600">Erreur lors du chargement</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mes correspondances</h1>

      {!matches || matches.length === 0 ? (
        <Empty title="Aucune correspondance" description="Vous n'avez pas encore de correspondances pour vos déclarations." />
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
                    Correspondance entre déclarations #{match.lostDeclarationId.slice(0, 8)} et #{match.foundDeclarationId.slice(0, 8)}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {format(new Date(match.createdAt), "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  {(match.status === "CANDIDATE" || match.status === "POTENTIAL" || match.status === "TO_VERIFY") && (
                    <>
                      <Link to={`/matches/${match.id}`}>
                        <Button size="sm">Voir</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
