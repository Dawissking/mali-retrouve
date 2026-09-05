import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateRestitution } from "../../hooks/useRestitutions";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";

export default function RestitutionForm() {
  const [matchId, setMatchId] = useState("");
  const [declarationId, setDeclarationId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const createRestitution = useCreateRestitution();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await createRestitution.mutateAsync({ declarationId, matchId });
      navigate("/restitutions");
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || "Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Préparer une restitution</h1>

      <Card>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="ID de la déclaration"
            value={declarationId}
            onChange={(e) => setDeclarationId(e.target.value)}
            required
          />
          <Input
            label="ID du match"
            value={matchId}
            onChange={(e) => setMatchId(e.target.value)}
          />
          <div className="flex gap-4">
            <Button type="button" variant="secondary" onClick={() => navigate("/restitutions")}>
              Annuler
            </Button>
            <Button type="submit" isLoading={isLoading} className="flex-1">
              Créer la restitution
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
