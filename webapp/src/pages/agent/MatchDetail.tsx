import { useParams, Link } from "react-router-dom";
import { useAgentMatchDetail, useValidateMatch } from "../../hooks/useMatches";
import { Loading } from "../../components/ui/States";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { format } from "../../lib/utils";

const statusMap: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" | "info" }> = {
  CANDIDATE: { label: "Candidat", variant: "warning" },
  POTENTIAL: { label: "Potentiel", variant: "info" },
  TO_VERIFY: { label: "À vérifier", variant: "warning" },
  CONFIRMED: { label: "Confirmée", variant: "success" },
  REJECTED: { label: "Refusée", variant: "danger" },
  CLOSED: { label: "Fermée", variant: "default" },
};

export default function MatchDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: match, isLoading, error } = useAgentMatchDetail(id!);
  const validateMatch = useValidateMatch(id!);

  if (isLoading) return <Loading />;
  if (error || !match) return <div className="text-center py-12 text-red-600">Correspondance introuvable</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to="/matches" className="text-sm text-gray-500 hover:text-gray-700">
          ← Retour à la file
        </Link>
      </div>

      <div className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <Badge variant={statusMap[match.status]?.variant || "default"}>
            {statusMap[match.status]?.label || match.status}
          </Badge>
          {match.score !== undefined && (
            <span className="text-sm text-gray-500">
              Score de confiance: {Math.round(match.score * 100)}%
            </span>
          )}
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Déclaration (perte)</h3>
              <p className="text-gray-900">#{match.lostDeclarationId.slice(0, 8)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Déclaration correspondante (trouvée)</h3>
              <p className="text-gray-900">#{match.foundDeclarationId.slice(0, 8)}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Date de création</h3>
            <p className="text-gray-900">{format(new Date(match.createdAt), "dd MMMM yyyy à HH:mm")}</p>
          </div>
        </div>

        {(match.status === "CANDIDATE" || match.status === "POTENTIAL" || match.status === "TO_VERIFY") && (
          <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
            <Button
              variant="primary"
              onClick={() => validateMatch.mutate({ decision: "VALIDATED" })}
              isLoading={validateMatch.isPending}
            >
              Valider
            </Button>
            <Button
              variant="danger"
              onClick={() => validateMatch.mutate({ decision: "REJECTED" })}
              isLoading={validateMatch.isPending}
            >
              Rejeter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}