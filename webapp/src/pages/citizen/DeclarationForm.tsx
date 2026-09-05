import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreateDeclaration } from "../../hooks/useDeclarations";
import { useCategories, useDomains, useTypes, useZones } from "../../hooks/useCatalog";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export default function DeclarationForm() {
  const [searchParams] = useSearchParams();
  const initialNature = (searchParams.get("nature") as "DOCUMENT" | "OBJET") || "DOCUMENT";
  const navigate = useNavigate();
  const createDeclaration = useCreateDeclaration();

  const [nature, setNature] = useState<"DOCUMENT" | "OBJET">(initialNature);
  const [declarationType, setDeclarationType] = useState<"LOSS" | "FOUND">(initialNature === "DOCUMENT" ? "LOSS" : "FOUND");
  const [categoryId, setCategoryId] = useState("");
  const [domainId, setDomainId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [description, setDescription] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [locationDesc, setLocationDesc] = useState("");
  const [regionId, setRegionId] = useState("");
  const [cercleId, setCercleId] = useState("");
  const [communeId, setCommuneId] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: domains, isLoading: domainsLoading } = useDomains(categoryId ? categories?.find((c) => c.id === categoryId)?.code : undefined);
  const { data: types, isLoading: typesLoading } = useTypes(domainId ? domains?.find((d) => d.id === domainId)?.code : undefined, nature);
  const { data: zones, isLoading: zonesLoading } = useZones();

  const regionOptions = zones || [];
  const cercleOptions = regionOptions.find((r: any) => r.id === regionId)?.cercles || [];
  const communeOptions = cercleOptions.find((c: any) => c.id === cercleId)?.communes || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await createDeclaration.mutateAsync({
        nature,
        type: declarationType,
        categoryId,
        domainId,
        typeId,
        description,
        documentNumber: documentNumber || undefined,
        locationDesc,
        regionId,
        cercleId,
        communeId,
        eventDate: new Date(eventDate).toISOString(),
      });
      navigate("/declarations");
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || "Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {declarationType === "LOSS" ? "Déclarer une perte" : "Signaler une trouvaille"}
      </h1>

      <Card>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => { setDeclarationType("LOSS"); setNature("DOCUMENT"); }}
              className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors ${
                declarationType === "LOSS" ? "border-red-500 bg-red-50 text-red-700" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              J'ai perdu
            </button>
            <button
              type="button"
              onClick={() => { setDeclarationType("FOUND"); setNature("OBJET"); }}
              className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors ${
                declarationType === "FOUND" ? "border-green-500 bg-green-50 text-green-700" : "border-gray-200 hover:border-gray-300"
              }`}
            >
              J'ai trouvé
            </button>
          </div>

          <Select
            label="Nature"
            value={nature}
            onChange={(e) => setNature(e.target.value as "DOCUMENT" | "OBJET")}
            options={[
              { value: "DOCUMENT", label: "Document" },
              { value: "OBJET", label: "Objet" },
            ]}
            required
          />

          <Select
            label="Catégorie"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setDomainId("");
              setTypeId("");
            }}
            options={categories?.map((c) => ({ value: c.id, label: c.labelFr })) || []}
            required
            disabled={categoriesLoading}
          />

          {categoryId && (
            <Select
              label="Domaine"
              value={domainId}
              onChange={(e) => {
                setDomainId(e.target.value);
                setTypeId("");
              }}
              options={domains?.map((d) => ({ value: d.id, label: d.labelFr })) || []}
              required
              disabled={domainsLoading}
            />
          )}

          {domainId && (
            <Select
              label="Type"
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
              options={types?.map((t) => ({ value: t.id, label: t.labelFr })) || []}
              required
              disabled={typesLoading}
            />
          )}

          <Input
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <Input
            label="Numéro de document (optionnel)"
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
          />

          <Input
            label="Date de l'événement"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />

          <Input
            label="Localisation"
            value={locationDesc}
            onChange={(e) => setLocationDesc(e.target.value)}
            placeholder="Ex: Marché de Médina, Bamako"
            required
          />

          <Select
            label="Région"
            value={regionId}
            onChange={(e) => {
              setRegionId(e.target.value);
              setCercleId("");
              setCommuneId("");
            }}
            options={regionOptions.map((r) => ({ value: r.id, label: r.labelFr }))}
            required
            disabled={zonesLoading}
          />

          {regionId && (
            <Select
              label="Cercle"
              value={cercleId}
              onChange={(e) => {
                setCercleId(e.target.value);
                setCommuneId("");
              }}
               options={cercleOptions.map((c: any) => ({ value: c.id, label: c.labelFr }))}
              required
              disabled={!regionId}
            />
          )}

          {cercleId && (
            <Select
              label="Commune"
              value={communeId}
              onChange={(e) => setCommuneId(e.target.value)}
               options={communeOptions.map((c: any) => ({ value: c.id, label: c.labelFr }))}
              required
              disabled={!cercleId}
            />
          )}

          <div className="flex gap-4">
            <Button type="button" variant="secondary" onClick={() => navigate("/declarations")}>
              Annuler
            </Button>
            <Button type="submit" isLoading={isLoading} className="flex-1">
              Enregistrer le brouillon
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
