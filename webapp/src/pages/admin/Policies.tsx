import { usePolicies, useUpdatePolicy } from "../../hooks/useAdmin";
import { Loading } from "../../components/ui/States";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useState } from "react";

export default function Policies() {
  const { data: policies, isLoading, error } = usePolicies();
  const updatePolicy = useUpdatePolicy();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-12 text-red-600">Erreur lors du chargement</div>;

  const startEdit = (key: string, value: string) => {
    setEditingKey(key);
    setEditValue(value);
  };

  const saveEdit = (key: string) => {
    updatePolicy.mutate({ key, value: editValue }, { onSuccess: () => setEditingKey(null) });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Politiques système</h1>

      <div className="card p-8">
        <div className="space-y-6">
          {policies?.map((policy) => (
            <div key={policy.key} className="flex items-start justify-between py-4 border-b border-gray-100 last:border-0">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{policy.key}</h3>
                <p className="text-sm text-gray-500 mt-1">{policy.description}</p>
              </div>
              <div className="ml-4 flex items-center gap-2">
                {editingKey === policy.key ? (
                  <>
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-48"
                    />
                    <Button
                      size="sm"
                      onClick={() => saveEdit(policy.key)}
                      isLoading={updatePolicy.isPending}
                    >
                      Sauvegarder
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-gray-700 w-48 truncate">{policy.value}</span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => startEdit(policy.key, policy.value)}
                    >
                      Modifier
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
          {!policies || policies.length === 0 && (
            <p className="text-gray-500 text-center py-8">Aucune politique configurée</p>
          )}
        </div>
      </div>
    </div>
  );
}
