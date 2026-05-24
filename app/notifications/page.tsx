"use client";
import React from 'react';

import { useState, useMemo, useEffect } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  MessageSquare,
  FolderKanban,
  CreditCard,
  Settings,
  TrendingUp,
  Users,
  AlertCircle,
  Clock,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Types
type NotificationType = "project" | "message" | "payment" | "system";
type FilterType = "all" | "unread" | "projects" | "messages" | "payments";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  avatar?: string;
  avatarFallback: string;
  relatedId?: string;
  relatedUrl?: string;
}

// Helper: relative time formatter
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  const diffWeek = Math.floor(diffDay / 7);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? "s" : ""} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  if (diffWeek < 4) return `${diffWeek} week${diffWeek > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined });
}

// Notification type config
const typeConfig: Record<NotificationType, { icon: typeof FolderKanban; bg: string; color: string; badgeColor: string; label: string }> = {
  project: {
    icon: FolderKanban,
    bg: "bg-cyan-100 dark:bg-cyan-900/30",
    color: "text-cyan-600 dark:text-cyan-400",
    badgeColor: "bg-cyan-100 text-cyan-700 border-cyan-200",
    label: "Project",
  },
  message: {
    icon: MessageSquare,
    bg: "bg-amber-100 dark:bg-amber-900/30",
    color: "text-amber-600 dark:text-amber-400",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
    label: "Message",
  },
  payment: {
    icon: CreditCard,
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    color: "text-emerald-600 dark:text-emerald-400",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
    label: "Payment",
  },
  system: {
    icon: Settings,
    bg: "bg-slate-100 dark:bg-slate-800/50",
    color: "text-slate-600 dark:text-slate-400",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    label: "System",
  },
};

// Notification Icon Component
function NotificationIcon({ type, size = "default" }: { type: NotificationType; size?: "sm" | "default" }) {
  const config = typeConfig[type];
  const Icon = config.icon;
  const sizeClasses = size === "sm" ? "size-4" : "size-5";

  return (
    <div className={cn("flex items-center justify-center rounded-full", config.bg, size === "sm" ? "size-9" : "size-11")}>
      <Icon className={cn(sizeClasses, config.color)} />
    </div>
  );
}

// Single Notification Item Component
function NotificationItem({
  notification,
  onToggleRead,
  onDelete,
}: {
  notification: Notification;
  onToggleRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const config = typeConfig[notification.type];

  return (
    <div
      className={cn(
        "group relative flex gap-4 rounded-xl border p-4 transition-all duration-200 hover:shadow-md",
        notification.read
          ? "bg-white border-slate-200 hover:border-slate-300"
          : "bg-white border-cyan-200 shadow-sm hover:border-cyan-300"
      )}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute top-4 right-4 size-2.5 rounded-full bg-cyan-500 animate-pulse" />
      )}

      {/* Avatar / Icon */}
      <div className="shrink-0">
        <Avatar className="size-11 border border-slate-200">
          <AvatarFallback className={cn("text-sm font-semibold", config.bg, config.color)}>
            {notification.avatarFallback}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn("text-xs font-medium", config.badgeColor)}>
            {config.label}
          </Badge>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock className="size-3" />
            {formatRelativeTime(notification.timestamp)}
          </span>
        </div>

        <h4 className={cn("text-sm font-semibold leading-tight", !notification.read ? "text-slate-900" : "text-slate-700")}>
          {notification.title}
        </h4>

        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {notification.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          {notification.relatedUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50"
              onClick={() => {
                // In a real app, use router.push(notification.relatedUrl)
                console.log("Navigate to:", notification.relatedUrl);
              }}
            >
              <ExternalLink className="size-3" />
              View Details
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className={cn("h-7 gap-1 px-2 text-xs", notification.read ? "text-slate-500 hover:text-slate-700" : "text-amber-600 hover:text-amber-700")}
            onClick={() => onToggleRead(notification.id)}
          >
            {notification.read ? (
              <>
                <AlertCircle className="size-3" />
                Mark Unread
              </>
            ) : (
              <>
                <Check className="size-3" />
                Mark Read
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(notification.id)}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({ icon: Icon, label, value, color }: { icon: typeof Bell; label: string; value: number | string; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className={cn("flex items-center justify-center rounded-lg size-10", color)}>
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}

// Main Page Component
export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      fetchNotifications();
    }
  }, [authLoading, user]);

  const fetchNotifications = async () => {
    try {
      const userId = user?.id || '';
      if (!userId) {
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/notifications?userId=${userId}`);
      const data = await response.json();
      
      if (data.success && data.notifications) {
        const mapped = data.notifications.map((n: any) => ({
          id: n.id,
          type: (['project', 'message', 'payment', 'system'].includes(n.type) ? n.type : 'system') as NotificationType,
          title: n.title,
          description: n.message,
          timestamp: new Date(n.created_at),
          read: n.status === 'read' || n.read === true,
          avatarFallback: n.title.charAt(0),
          relatedUrl: n.action_url
        }));
        setNotifications(mapped);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }

  // Computed values
  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const projectCount = useMemo(() => notifications.filter((n) => n.type === "project").length, [notifications]);
  const messageCount = useMemo(() => notifications.filter((n) => n.type === "message").length, [notifications]);
  const paymentCount = useMemo(() => notifications.filter((n) => n.type === "payment").length, [notifications]);

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    switch (activeFilter) {
      case "unread":
        return notifications.filter((n) => !n.read);
      case "projects":
        return notifications.filter((n) => n.type === "project");
      case "messages":
        return notifications.filter((n) => n.type === "message");
      case "payments":
        return notifications.filter((n) => n.type === "payment");
      default:
        return notifications;
    }
  }, [notifications, activeFilter]);

  // Handlers
  const toggleRead = async (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (!notification) return;

    const newReadStatus = !notification.read;

    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: newReadStatus } : n))
    );

    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationId: id,
          status: newReadStatus ? 'read' : 'unread'
        })
      });
    } catch (error) {
      console.error('Failed to update notification status');
    }
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markFilterRead = () => {
    const idsToMark = new Set(filteredNotifications.map((n) => n.id));
    setNotifications((prev) =>
      prev.map((n) => (idsToMark.has(n.id) ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAllRead = () => {
    setNotifications((prev) => prev.filter((n) => !n.read));
  };

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: "All" },
    { key: "unread", label: "Unread" },
    { key: "projects", label: "Projects" },
    { key: "messages", label: "Messages" },
    { key: "payments", label: "Payments" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Notifications</h1>
            <p className="mt-1 text-slate-300">Stay updated with your latest activity</p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllRead} className="border-slate-600 text-white hover:bg-slate-800/50 transition-all">
                <CheckCheck className="mr-2 h-4 w-4" />
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 backdrop-blur-sm p-4 hover:border-cyan-500/50 transition-all">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-lg h-10 w-10 bg-cyan-500/20 text-cyan-400">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{notifications.length}</p>
                <p className="text-xs text-slate-400">Total Notifications</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-4 hover:border-cyan-500/50 transition-all">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-lg h-10 w-10 bg-cyan-500/20 text-cyan-400">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{unreadCount}</p>
                <p className="text-xs text-slate-400">Unread</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/5 p-4 hover:border-purple-500/50 transition-all">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-lg h-10 w-10 bg-purple-500/20 text-purple-400">
                <FolderKanban className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{projectCount}</p>
                <p className="text-xs text-slate-400">Projects</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-4 hover:border-yellow-500/50 transition-all">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-lg h-10 w-10 bg-yellow-500/20 text-yellow-400">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{messageCount}</p>
                <p className="text-xs text-slate-400">Messages</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm p-2">
          {filters.map((filter) => {
            const count =
              filter.key === "all"
                ? notifications.length
                : filter.key === "unread"
                ? unreadCount
                : filter.key === "projects"
                ? projectCount
                : filter.key === "messages"
                ? messageCount
                : paymentCount;

            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  activeFilter === filter.key
                    ? "bg-cyan-500/20 text-cyan-300"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                )}
              >
                {filter.label}
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium",
                  activeFilter === filter.key
                    ? "bg-cyan-500/30 text-cyan-300"
                    : "bg-slate-700/50 text-slate-400"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
          <div className="ml-auto flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markFilterRead} className="text-slate-300 hover:bg-slate-800/50">
                Mark filter read
              </Button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm py-16">
              <Bell className="mb-4 h-12 w-12 text-slate-600" />
              <h3 className="text-lg font-semibold text-white">No notifications</h3>
              <p className="mt-1 text-slate-400">
                {activeFilter === "unread"
                  ? "All caught up! No unread notifications."
                  : "No notifications in this category yet."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onToggleRead={toggleRead}
                onDelete={deleteNotification}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
