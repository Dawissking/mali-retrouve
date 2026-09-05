import { useAuth } from "../../contexts/AuthContext";
import { Card } from "../../components/ui/Card";

export default function Profile() {
  const { user } = useAuth();
  const firstName = user?.citizenProfile?.firstName || user?.firstName || "";
  const lastName = user?.citizenProfile?.lastName || user?.lastName || "";

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon profil</h1>

      <Card>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-brand-700">
                {firstName[0]}{lastName[0]}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {firstName} {lastName}
              </h2>
              <p className="text-sm text-gray-500">{user?.phoneE164}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Prénom</h3>
              <p className="text-gray-900">{firstName || "-"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Nom</h3>
              <p className="text-gray-900">{lastName || "-"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
              <p className="text-gray-900">{user?.phoneE164}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Rôle</h3>
              <p className="text-gray-900 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
