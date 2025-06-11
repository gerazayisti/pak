"use client"

import { useState, useEffect } from "react"
import { X, Bell } from "lucide-react"
import { cn } from "@/lib/utils"

export type NotificationType = {
  id: string
  title: string
  message: string
  type: "success" | "error" | "info" | "database"
  timestamp: Date
  location?: "header" | "bottom"
}

interface NotificationProps {
  notification: NotificationType
  onClose: (id: string) => void
}

const bgColor = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  info: "bg-blue-50 border-blue-200",
  database: "bg-purple-50 border-purple-200",
}

const textColor = {
  success: "text-green-800",
  error: "text-red-800",
  info: "text-blue-800",
  database: "text-purple-800",
}

export function Notification({ notification, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(notification.id), 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [notification.id, onClose])

  const position = notification.location === "header" 
    ? "top-4 right-4" 
    : "bottom-4 right-4"

  return (
    <div
      className={cn(
        "fixed z-50 w-96 rounded-lg border p-4 shadow-lg transition-all duration-300",
        bgColor[notification.type],
        position,
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className={cn("font-medium", textColor[notification.type])}>{notification.title}</h4>
          <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
          <p className="mt-1 text-xs text-gray-500">
            {notification.timestamp.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onClose(notification.id), 300)
          }}
          className="ml-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export function NotificationContainer({ location = "bottom" }: { location?: "header" | "bottom" }) {
  const [notifications, setNotifications] = useState<NotificationType[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addNotification = (notification: Omit<NotificationType, "id" | "timestamp">) => {
    const newNotification: NotificationType = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      location,
    }
    setNotifications((prev) => [...prev, newNotification])
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  if (location === "header") {
    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-gray-600 hover:text-gray-900"
        >
          <Bell className="h-6 w-6" />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </button>
        {isOpen && (
          <div className="absolute right-0 mt-2 w-96 rounded-lg border bg-white shadow-lg">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Notifications</h3>
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500">Aucune notification</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "rounded-lg border p-3",
                        bgColor[notification.type]
                      )}
                    >
                      <h4 className={cn("font-medium", textColor[notification.type])}>
                        {notification.title}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {notification.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-4">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  )
} 