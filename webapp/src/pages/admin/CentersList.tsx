import { Link } from "react-router-dom";
import { useCenters } from "../../hooks/useCenters";
import { Loading, Empty } from "../../components/ui/States";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { format } from "../../lib/utils";

export default function CentersList() {
  const { data: centers, isLoading, error } = useCenters();

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-12 text-red-600">Erreur lors du chargement</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Centres</h1>
        <Button>Ajouter un centre</Button>
      </div>

      {!centers || centers.length === 0 ? (
        <Empty title="Aucun centre" description="Aucun centre n'est enregistré pour le moment." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {centers.map((center) => (
            <Link key={center.id} to={`/centers/${center.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <h3 className="text-lg font-semibold text-gray-900">{center.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{center.address}</p>
                <p className="text-xs text-gray-400 mt-2">ID: {center.id}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
