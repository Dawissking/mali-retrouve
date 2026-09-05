import { useParams } from "react-router-dom";
import { useCenter, useCenterAgents } from "../../hooks/useCenters";
import { Loading } from "../../components/ui/States";
import { Badge } from "../../components/ui/Badge";

export default function CenterDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: center, isLoading, error } = useCenter(id!);
  const { data: agents, isLoading: agentsLoading } = useCenterAgents(id!);

  if (isLoading) return <Loading />;
  if (error || !center) return <div className="text-center py-12 text-red-600">Centre introuvable</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{center.name}</h1>

      <div className="card p-8 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations du centre</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
            <p className="text-gray-900">{center.address}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
            <p className="text-gray-900">{"-"}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="text-gray-900">{"-"}</p>
          </div>
        </div>
      </div>

      <div className="card p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Agents du centre</h2>
        {agentsLoading ? (
          <Loading />
        ) : (
          <div className="grid gap-4">
            {agents?.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">
                    {agent.user.email}
                  </p>
                  <p className="text-sm text-gray-500">{agent.user.email}</p>
                </div>
                <Badge variant={agent.user.role === "auditor" ? "info" : "default"}>{agent.user.role}</Badge>
              </div>
            ))}
            {!agents || agents.length === 0 && (
              <p className="text-gray-500 text-center py-4">Aucun agent dans ce centre</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
