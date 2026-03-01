import { useMemo } from 'react';
import { CalendarIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import DropdownMenu from './DropdownMenu';

type Notification = {
  id: number;
  title: string;
  message: string;
  read: boolean;
  time: string;
  eventId?: string;
  type?: 'system' | 'event' | 'promo';
};

export const NotificationMenu = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onClose,
}: {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: number) => void;
  onClose: () => void;
}) => {
  // Group notifications by event
  const groupedNotifications = useMemo(() => {
    return notifications.reduce(
      (acc, notif) => {
        const key = notif.eventId || 'general';
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(notif);
        return acc;
      },
      {} as Record<string, Notification[]>
    );
  }, [notifications]);

  return (
    <DropdownMenu isOpen={true} onClose={onClose} className="w-80">
      <div className="px-4 py-3 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Notifications
          </p>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {unreadCount} unread
              </p>
            )}
            <button
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              onClick={() => {
                notifications.forEach(
                  (notif) => !notif.read && onMarkAsRead(notif.id)
                );
              }}
            >
              Mark all as read
            </button>
          </div>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {Object.entries(groupedNotifications).map(([eventId, eventNotifs]) => (
          <div key={eventId}>
            {eventId !== 'general' && (
              <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30">
                {eventNotifs[0].title.includes('MTN Bushfire')
                  ? 'MTN Bushfire'
                  : 'Event Updates'}
              </div>
            )}
            {eventNotifs.map((notif) => (
              <div
                key={notif.id}
                className={`px-4 py-3 text-sm ${
                  !notif.read
                    ? 'bg-blue-50/50 dark:bg-blue-900/10'
                    : 'bg-white dark:bg-gray-800'
                } hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer`}
                onClick={() => onMarkAsRead(notif.id)}
              >
                <div className="flex items-start">
                  {notif.type === 'event' && (
                    <CalendarIcon className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {notif.title}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {notif.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex border-t border-gray-200/50 dark:border-gray-700/50">
        <Link
          href="/notifications/settings"
          className="flex-1 text-center px-4 py-3 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/20 transition-colors"
          onClick={onClose}
        >
          <Cog6ToothIcon className="h-4 w-4 inline mr-1" />
          Settings
        </Link>
        <Link
          href="/notifications"
          className="flex-1 text-center px-4 py-3 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors border-l border-gray-200/50 dark:border-gray-700/50"
          onClick={onClose}
        >
          View all
        </Link>
      </div>
    </DropdownMenu>
  );
};

export default NotificationMenu;
