import { useNotifications, useMarkNotificationRead } from "../../hooks/useNotifications";
import { Loading } from "../../components/ui/States";
import { Empty } from "../../components/ui/States";
import { Button } from "../../components/ui/Button";
import { format } from "../../lib/utils";

export default function Notifications() {
  const { data: notifications, isLoading, error } = useNotifications();
  const markRead = useMarkNotificationRead("");

  if (isLoading) return <Loading />;
  if (error) return <div className="text-center py-12 text-red-600">Erreur lors du chargement</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h1>

      {!notifications || notifications.length === 0 ? (
        <Empty title="Aucune notification" description="Vous n'avez pas encore de notifications." />
      ) : (
        <div className="grid gap-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`card p-6 ${notification.status !== "READ" ? "border-l-4 border-l-brand-500" : ""}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-gray-900">{notification.subject}</h3>
                    {notification.status !== "READ" && (
                      <span className="w-2 h-2 bg-brand-500 rounded-full" aria-label="Non lu" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{notification.bodyTemplate}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {format(new Date(notification.createdAt), "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
                {notification.status !== "READ" && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => markRead.mutate(undefined, { onSuccess: () => {} })}
                  >
                    Marquer comme lu
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
