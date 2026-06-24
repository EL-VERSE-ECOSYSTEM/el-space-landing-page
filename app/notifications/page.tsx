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
import { Card } from "@/components/ui/card";
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
    bg: "bg-slate-700/10",
    color: "text-slate-700",
    badgeColor: "bg-slate-700/10 text-slate-700 border-slate-700/20",
    label: "Project",
  },
  message: {
    icon: MessageSquare,
    bg: "bg-warning/10",
    color: "text-warning",
    badgeColor: "bg-warning/10 text-warning border-warning/20",
    label: "Message",
  },
  payment: {
    icon: CreditCard,
    bg: "bg-slate-500/10",
    color: "text-slate-500",
    badgeColor: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    label: "Payment",
  },
  system: {
    icon: Settings,
    bg: "bg-muted",
    color: "text-muted-foreground",
    badgeColor: "bg-muted text-muted-foreground border-border",
    label: "System",
  },
};

// Notification Icon Component
function NotificationIcon({ type, size = "default" }: { type: NotificationType; size?: "sm" | "default" }) {
  const config = typeConfig[type];
  const Icon = config.icon;
  const sizeClasses = size === "sm" ? "size-4" : "size-5";

  return (
    <div className={cn("flex items-center justify-center rounded-full shadow-sm", config.bg, size === "sm" ? "size-9" : "size-11")}>
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
        "group relative flex gap-6 rounded-[2rem] border p-6 transition-all duration-300",
        notification.read
          ? "bg-card border-border hover:border-slate-700/20 opacity-80"
          : "bg-card border-slate-700/30 shadow-xl shadow-primary/5 hover:border-slate-700"
      )}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute top-4 right-4 size-2.5 rounded-full bg-slate-700 animate-pulse" />
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
              className="h-7 gap-1 px-2 text-xs text-slate-700 hover:bg-slate-700/10"
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
            className={cn("h-7 gap-1 px-2 text-xs", notification.read ? "text-slate-500 hover:text-slate-700" : "text-slate-600 hover:text-slate-700")}
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
    <div className="flex items-center gap-4 rounded-[2rem] border border-border bg-card p-5 shadow-sm">
      <div className={cn("flex items-center justify-center rounded-2xl size-12 shadow-inner", color)}>
        <Icon className="size-6" />
      </div>
      <div>
        <p className="text-2xl font-black text-foreground tracking-tighter">{value}</p>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
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
    <div className="min-h-screen bg-background text-foreground pt-24 pb-12">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase">Nexus <span className="text-slate-700">Intelligence</span></h1>
            <p className="mt-2 text-muted-foreground font-medium text-lg">Central synchronization of all node activity.</p>
          </div>
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Button onClick={markAllRead} className="bg-slate-700 hover:bg-slate-700/90 text-slate-700-foreground font-black uppercase tracking-widest text-[10px] h-12 px-6 rounded-2xl shadow-xl shadow-primary/20">
                <CheckCheck className="mr-2 h-4 w-4" />
                Clear Backlog
              </Button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card border-border rounded-[1.5rem] p-6 shadow-xl shadow-black/5">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-2xl h-12 w-12 bg-slate-700/10 text-slate-700 border border-slate-700/20 shadow-inner">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <p className="text-3xl font-black text-foreground tracking-tighter">{notifications.length}</p>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Global Syncs</p>
              </div>
            </div>
          </Card>
          <Card className="bg-card border-border rounded-[1.5rem] p-6 shadow-xl shadow-black/5">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-2xl h-12 w-12 bg-slate-700/10 text-slate-700 border border-slate-700/20 shadow-inner">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-3xl font-black text-foreground tracking-tighter">{unreadCount}</p>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Priority Intel</p>
              </div>
            </div>
          </Card>
          <Card className="bg-card border-border rounded-[1.5rem] p-6 shadow-xl shadow-black/5">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-2xl h-12 w-12 bg-accent/10 text-accent border border-accent/20 shadow-inner">
                <FolderKanban className="h-6 w-6" />
              </div>
              <div>
                <p className="text-3xl font-black text-foreground tracking-tighter">{projectCount}</p>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Missions</p>
              </div>
            </div>
          </Card>
          <Card className="bg-card border-border rounded-[1.5rem] p-6 shadow-xl shadow-black/5">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center rounded-2xl h-12 w-12 bg-warning/10 text-warning border border-warning/20 shadow-inner">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <p className="text-3xl font-black text-foreground tracking-tighter">{messageCount}</p>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Comms</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex flex-wrap items-center gap-3 bg-card border border-border rounded-[2rem] p-2.5 shadow-inner">
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
                  "flex items-center gap-3 rounded-[1.25rem] px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all",
                  activeFilter === filter.key
                    ? "bg-slate-700 text-slate-700-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {filter.label}
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[9px] font-black",
                  activeFilter === filter.key
                    ? "bg-slate-700-foreground/20 text-slate-700-foreground"
                    : "bg-muted-foreground/10 text-muted-foreground"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
          <div className="ml-auto flex items-center gap-2 pr-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markFilterRead} className="text-muted-foreground hover:text-slate-700 font-black uppercase tracking-widest text-[9px]">
                Purge Filter Read
              </Button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-6">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[3rem] border-2 border-dashed border-border bg-card/50 py-24 shadow-inner">
              <Bell className="mb-6 h-16 w-16 text-muted-foreground/10" />
              <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Signal Neutral</h3>
              <p className="mt-2 text-muted-foreground font-medium max-w-xs text-center">
                {activeFilter === "unread"
                  ? "All data synchronized. No priority alerts detected."
                  : "No intel records found in this sector."}
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
