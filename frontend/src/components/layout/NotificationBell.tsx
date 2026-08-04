import {
  Bell,
  UserPlus,
  CheckCircle,
  XCircle,
  Shield,
} from "lucide-react";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { notificationApi } from "@/api/notification";
import type { Notification } from "@/types/notification";
function NotificationIcon(type: string) {
  switch (type) {
    case "Registration":
      return <UserPlus className="h-4 w-4 text-blue-500" />;

    case "Approval":
      return <CheckCircle className="h-4 w-4 text-green-500" />;

    case "Rejection":
      return <XCircle className="h-4 w-4 text-red-500" />;

    default:
      return <Shield className="h-4 w-4 text-muted-foreground" />;
  }
}
export function NotificationBell() {
  const queryClient = useQueryClient();

  const { data = [] } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: notificationApi.getNotifications,
    refetchInterval: 30000,
  });
  console.table(data);
  const markRead = useMutation({
    mutationFn: notificationApi.markRead,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
  });

  const markAllRead = useMutation({
  mutationFn: notificationApi.markAllRead,

  onSuccess: async () => {
    await queryClient.invalidateQueries({
      queryKey: ["notifications"],
    });

    await queryClient.refetchQueries({
      queryKey: ["notifications"],
    });
  },
});

  const unreadCount = data.filter((n) => !n.is_read).length;

  return (
  <DropdownMenu>

    <DropdownMenuTrigger asChild>

      <button className="relative p-2 rounded-lg hover:bg-muted">

        <Bell className="h-5 w-5" />

        {unreadCount > 0 && (
          <span
            className="absolute
                       -top-1
                       -right-1
                       h-5
                       w-5
                       rounded-full
                       bg-red-600
                       text-white
                       text-[10px]
                       flex
                       items-center
                       justify-center"
          >
            {unreadCount}
          </span>
        )}

      </button>

    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="end"
      className="w-96 p-0"
    >

      <div className="flex items-center justify-between p-4 border-b">

        <h3 className="font-semibold">

          Notifications

        </h3>

        {unreadCount > 0 && (
        <button
          onClick={() => markAllRead.mutate()}
          disabled={markAllRead.isPending}
          className="text-xs text-primary hover:underline disabled:opacity-50"
        >
          {markAllRead.isPending ? "Updating..." : "Mark all as read"}
        </button>
      )}

      </div>

      <div className="max-h-96 overflow-y-auto">

        {data.length === 0 ? (

          <div className="p-6 text-center text-muted-foreground">

            No notifications

          </div>

        ) : (

          data.map((notification) => (

            <button
              key={notification.notification_id}
              onClick={() =>
                markRead.mutate(notification.notification_id)
              }
              className={`w-full
                text-left
                px-4
                py-3
                border-b
                hover:bg-muted
                transition
                ${
                  Number(notification.is_read) === 0
                    ? "bg-primary/5"
                    : "opacity-70"
                }`}
            >

              <div className="flex gap-3">

                <div className="mt-1">

                  {NotificationIcon(notification.type)}

                </div>

                <div className="flex-1">

                  <div className="flex justify-between">

                    <span className="font-medium">

                      {notification.title}

                    </span>

                    {!notification.is_read && (
                      <span className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                    )}

                  </div>

                  <p className="text-sm text-muted-foreground mt-1">

                    {notification.message}

                  </p>

                  <p className="text-xs text-muted-foreground mt-2">

                    {new Date(
                      notification.created_at
                    ).toLocaleString()}

                  </p>

                </div>

              </div>

            </button>

          ))

        )}

      </div>

    </DropdownMenuContent>

  </DropdownMenu>
);
}