import { useState } from "react";
import { useIncidents, useCreateIncident } from "../../hooks/useAdmin";
import { Loading, Empty } from "../../components/ui/States";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Modal } from "../../components/ui/Modal";
import { format } from "../../lib/utils";

export default function Incidents() {
  const { data: incidents, isLoading, error, refetch } = useIncidents();
  const createIncident = useCreateIncident();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState("");
  const [severity, setSeverity] = useState<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">("MEDIUM");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-12 text-red-600">Erreur lors du chargement</div>;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createIncident.mutateAsync({ type, description, severity, title });
      setIsModalOpen(false);
      setType("");
      setTitle("");
      setDescription("");
      refetch();
    } catch {
      // error handled by mutation
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Incidents</h1>
        <Button onClick={() => setIsModalOpen(true)}>Signaler un incident</Button>
      </div>

      {!incidents || incidents.length === 0 ? (
        <Empty title="Aucun incident" description="Aucun incident n'a été signalé." />
      ) : (
        <div className="grid gap-4">
          {incidents.map((incident) => (
            <div key={incident.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-gray-900">{incident.type}</h3>
                    <Badge variant={incident.status === "DETECTED" || incident.status === "ANALYZED" || incident.status === "CONTAINED" ? "danger" : "success"}>
                      {incident.status === "DETECTED" || incident.status === "ANALYZED" || incident.status === "CONTAINED" ? "Ouvert" : "Résolu"}
                    </Badge>
                  </div>
                  <p className="text-gray-600">{incident.description}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {format(new Date(incident.createdAt), "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Signaler un incident">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Titre" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input label="Type" value={type} onChange={(e) => setType(e.target.value)} required />
          <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <div className="flex gap-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Annuler</Button>
            <Button type="submit" isLoading={createIncident.isPending}>Signaler</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
