import { useState } from "react";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Loading } from "../../components/ui/States";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../lib/axios";

type RequestType = "ACCESS" | "DELETION";

export default function RightsPage() {
  const { user } = useAuth();
  const [requestType, setRequestType] = useState<RequestType | null>(null);
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setIsLoading(true);
    try {
      if (requestType === "ACCESS") {
        const { data } = await api.get("/admin/me/data");
        setResult("Votre demande d'accès a été enregistrée. Vous recevrez vos données par email.");
      } else {
        await api.delete("/admin/me", { data: { reason } });
        setResult("Votre demande de suppression a été enregistrée. Un délai de 30 jours s'applique avant suppression définitive.");
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "Erreur lors de la demande");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="card p-8 text-center">
          <p className="text-gray-600 mb-4">Vous devez être connecté pour exercer vos droits.</p>
          <a href="/login" className="text-brand-600 hover:underline">Se connecter</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mes droits (RGPD / Loi 2013-015)</h1>

      <div className="card p-8">
        <p className="text-gray-600 mb-6">
          Conformément à la Loi malienne n° 2013-015 et au RGPD, vous disposez des droits suivants :
        </p>

        <div className="space-y-4 mb-8">
          <div className="p-4 bg-brand-50 rounded-md">
            <h3 className="font-medium text-brand-900">Droit d'accès</h3>
            <p className="text-sm text-brand-800 mt-1">Obtenir une copie de toutes les données personnelles vous concernant.</p>
          </div>
          <div className="p-4 bg-brand-50 rounded-md">
            <h3 className="font-medium text-brand-900">Droit de rectification</h3>
            <p className="text-sm text-brand-800 mt-1">Corriger vos données personnelles inexactes ou incomplets.</p>
          </div>
          <div className="p-4 bg-brand-50 rounded-md">
            <h3 className="font-medium text-brand-900">Droit à l'oubli</h3>
            <p className="text-sm text-brand-800 mt-1">Demander la suppression de vos données. Un délai de grâce de 30 jours s'applique.</p>
          </div>
        </div>

        {!requestType ? (
          <div className="flex gap-4">
            <Button onClick={() => setRequestType("ACCESS")} className="flex-1">
              Demander mes données
            </Button>
            <Button onClick={() => setRequestType("DELETION")} variant="secondary" className="flex-1">
              Demander la suppression
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                {requestType === "ACCESS"
                  ? "Vous allez recevoir un export de toutes vos données personnelles."
                  : "La suppression est effective après un délai de 30 jours. Certaines données peuvent être conservées pour obligations légales."}
              </p>
            </div>

            {requestType === "DELETION" && (
              <Input
                label="Motif de la demande (optionnel)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Raison de la suppression..."
              />
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {result && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-600">{result}</p>
              </div>
            )}

            <div className="flex gap-4">
              <Button type="button" variant="secondary" onClick={() => { setRequestType(null); setResult(null); setError(""); }}>
                Annuler
              </Button>
              <Button type="submit" isLoading={isLoading}>
                Confirmer
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
