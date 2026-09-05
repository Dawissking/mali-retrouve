import { useCenters } from "../../hooks/useCenters";
import { Loading, Empty } from "../../components/ui/States";
import { Badge } from "../../components/ui/Badge";
import { Card } from "../../components/ui/Card";

export default function AgentsList() {
  const { data: centers } = useCenters();
  const agents = centers?.flatMap((c) => c.id ? [] : []) || [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Agents</h1>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {centers?.map((center) => (
                <tr key={center.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{center.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{("-")}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="info">Centre</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
