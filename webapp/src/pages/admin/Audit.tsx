import { useState } from "react";
import { useAuditLogs } from "../../hooks/useAdmin";
import { Loading } from "../../components/ui/States";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { format } from "../../lib/utils";

export default function Audit() {
  const [resourceType, setResourceType] = useState("");
  const [resourceId, setResourceId] = useState("");
  const { data: logs, isLoading, error } = useAuditLogs({ entityType: resourceType, entityId: resourceId });

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-12 text-red-600">Erreur lors du chargement</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Journaux d'audit</h1>

      <div className="card p-6 mb-6">
        <div className="flex gap-4">
          <Input
            label="Type de ressource"
            value={resourceType}
            onChange={(e) => setResourceType(e.target.value)}
            placeholder="Ex: declaration"
            className="flex-1"
          />
          <Input
            label="ID de ressource"
            value={resourceId}
            onChange={(e) => setResourceId(e.target.value)}
            placeholder="Ex: 123"
            className="flex-1"
          />
        </div>
      </div>

      {!logs || logs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Aucun journal trouvé</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acteur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ressource</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.actorId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.action}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.entityType} #{log.entityId ? log.entityId.slice(0, 8) : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(log.occurredAt), "dd/MM/yyyy HH:mm")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
