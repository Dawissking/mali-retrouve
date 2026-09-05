import { useParams, Link } from "react-router-dom";
import { useDeclaration, useDeclareTransition } from "../../hooks/useDeclarations";
import { Loading } from "../../components/ui/States";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { format } from "../../lib/utils";

const statusMap: Record<string, { label: string; variant: "default" | "success" | "warning" | "danger" | "info" }> = {
  BROUILLON: { label: "Brouillon", variant: "default" },
  SOUMISE: { label: "Soumise", variant: "info" },
  EN_ATTENTE_RAPPROCHEMENT: { label: "En attente de rapprochement", variant: "warning" },
  CORRESPONDANCE_TROUVEE: { label: "Correspondance trouvée", variant: "success" },
  EN_VALIDATION_HUMAINE: { label: "En validation humaine", variant: "warning" },
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

export default function DeclarationDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: declaration, isLoading, error } = useDeclaration(id!);
  const transition = useDeclareTransition(id!);

  if (isLoading) return <Loading />;
  if (error || !declaration) return <div className="text-center py-12 text-red-600">Déclaration introuvable</div>;

  const eventDate = declaration.eventDate;
  const locationDesc = declaration.type === "LOSS" ? declaration.lossLocationDesc : declaration.findLocationDesc;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to="/declarations" className="text-sm text-gray-500 hover:text-gray-700">
          ← Retour aux déclarations
        </Link>
      </div>

      <div className="card p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Déclaration #{declaration.id.slice(0, 8)}</h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant={declaration.nature === "DOCUMENT" ? "info" : "success"}>
                {declaration.nature === "DOCUMENT" ? "Document" : "Objet"}
              </Badge>
              <Badge variant={declaration.type === "LOSS" ? "danger" : "success"}>
                {declaration.type === "LOSS" ? "Perte" : "Trouvaille"}
              </Badge>
              <Badge variant={statusMap[declaration.status]?.variant || "default"}>
                {statusMap[declaration.status]?.label || declaration.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
            <p className="text-gray-900">{declaration.description}</p>
          </div>

          {declaration.documentNumber && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Numéro de document</h3>
              <p className="text-gray-900">{declaration.documentNumber}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Date de l'événement</h3>
              <p className="text-gray-900">{format(new Date(eventDate || declaration.createdAt), "dd MMMM yyyy")}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Créé le</h3>
              <p className="text-gray-900">{format(new Date(declaration.createdAt), "dd/MM/yyyy HH:mm")}</p>
            </div>
          </div>

          {locationDesc && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Localisation</h3>
              <p className="text-gray-900">{locationDesc}</p>
            </div>
          )}

          {declaration.photos.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Photos</h3>
              <div className="grid grid-cols-3 gap-4">
                {declaration.photos.map((photo) => (
                  <div key={photo.id} className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                    {photo.filename}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {declaration.status === "BROUILLON" && (
          <div className="mt-8 pt-6 border-t border-gray-200 flex gap-4">
            <Button
              variant="primary"
              onClick={() => transition.mutate({ event: "SUBMIT" }, { onSuccess: () => {} })}
              isLoading={transition.isPending}
            >
              Soumettre
            </Button>
            <Button variant="danger" onClick={() => transition.mutate({ event: "CANCEL_DRAFT" })}>
              Annuler
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
