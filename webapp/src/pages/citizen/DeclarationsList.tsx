import { Link } from "react-router-dom";
import { useDeclarations } from "../../hooks/useDeclarations";
import { Loading } from "../../components/ui/States";
import { Empty } from "../../components/ui/States";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { format } from "../../lib/utils";

const statusMap: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" | "info" }> = {
  BROUILLON: { label: "Brouillon", variant: "default" },
  SOUMISE: { label: "Soumise", variant: "info" },
  EN_ATTENTE_RAPPROCHEMENT: { label: "En attente", variant: "warning" },
  CORRESPONDANCE_TROUVEE: { label: "Correspondance", variant: "success" },
  EN_VALIDATION_HUMAINE: { label: "En validation", variant: "warning" },
  VALIDEE: { label: "Validée", variant: "success" },
  RESTITUTION_PLANIFIEE: { label: "Restitution planifiée", variant: "info" },
  RESTITUEE: { label: "Restituée", variant: "success" },
  CLOTUREE: { label: "Clôturée", variant: "default" },
  REJETEE: { label: "Rejetée", variant: "danger" },
  ARCHIVEE: { label: "Archivée", variant: "default" },
  EXPIREE: { label: "Expirée", variant: "danger" },
  SUSPENDUE: { label: "Suspendue", variant: "warning" },
  CONTESTEE: { label: "Contestée", variant: "warning" },
};

export default function DeclarationsList() {
  const { data: declarations, isLoading, error, refetch } = useDeclarations();

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-12 text-red-600">Erreur lors du chargement des déclarations</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes déclarations</h1>
        <Link to="/declarations/new">
          <Button>Nouvelle déclaration</Button>
        </Link>
      </div>

      {!declarations || declarations.length === 0 ? (
        <Empty
          title="Aucune déclaration"
          description="Vous n'avez pas encore créé de déclaration. Commencez par en créer une."
          action={
            <Link to="/declarations/new">
              <Button>Créer une déclaration</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4">
          {declarations.map((decl) => (
            <Link key={decl.id} to={`/declarations/${decl.id}`} className="block">
              <div className="card p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant={decl.type === "LOSS" ? "danger" : "success"}>
                        {decl.type === "LOSS" ? "Perdu" : "Trouvé"}
                      </Badge>
                      <Badge variant={statusMap[decl.status]?.variant || "default"}>
                        {statusMap[decl.status]?.label || decl.status}
                      </Badge>
                    </div>
                    <p className="text-gray-900 font-medium line-clamp-2">{decl.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {(decl.type === "LOSS" ? decl.lossLocationDesc : decl.findLocationDesc) ?? "-"} • {decl.eventDate ? format(new Date(decl.eventDate), "dd MMM yyyy") : "-"}
                    </p>
                  </div>
                  <div className="text-sm text-gray-400 ml-4">
                    {format(new Date(decl.createdAt), "dd/MM/yyyy")}
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
