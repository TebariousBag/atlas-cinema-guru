"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { IoFolderOpen } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { HiClock } from "react-icons/hi";

type Activity = {
  id: string;
  timestamp: Date;
  activity: "FAVORITED" | "WATCH_LATER";
  title: string;
};

export default function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isExpanded) {
      fetch("/api/activities")
        .then((res) => res.json())
        .then((data) => setActivities(data.activities || []))
        .catch(() => setActivities([]));
    }
  }, [isExpanded]);

  const navLinks = [
    {
      href: "/",
      label: "Home",
      icon: <IoFolderOpen className={isExpanded ? "h-6 w-6" : "h-8 w-8"} />,
    },
    {
      href: "/favorites",
      label: "Favorites",
      icon: <FaStar className={isExpanded ? "h-6 w-6" : "h-8 w-8"} />,
    },
    {
      href: "/watch-later",
      label: "Watch Later",
      icon: <HiClock className={isExpanded ? "h-6 w-6" : "h-8 w-8"} />,
    },
  ];

  const formatActivity = (activity: Activity) => {
    const action = activity.activity === "FAVORITED" ? "Favorited" : "Added";
    const suffix = activity.activity === "WATCH_LATER" ? " to watch later" : "";
    return `${action} ${activity.title}${suffix}`;
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString();
  };

  if (!isMounted) {
    return (
      <aside className="fixed left-0 top-[52px] z-40 h-[calc(100vh-52px)] w-16 bg-[#1ED2AF] text-white">
        <nav className="flex flex-col gap-2 p-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-center rounded px-3 py-2 transition-colors hover:bg-white/10"
            >
              {link.icon}
            </Link>
          ))}
        </nav>
      </aside>
    );
  }

  return (
    <aside
      className={`fixed left-0 top-[52px] z-40 h-[calc(100vh-52px)] bg-[#1ED2AF] text-white transition-all duration-300 ${
        isExpanded ? "w-64" : "w-16"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onClick={() => setIsExpanded(!isExpanded)}
      suppressHydrationWarning
    >
      <nav className="flex flex-col gap-2 p-3">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 rounded px-3 py-2 transition-colors ${
              pathname === link.href ? "bg-white/20" : "hover:bg-white/10"
            } ${!isExpanded ? "justify-center" : ""}`}
          >
            {link.icon}
            {isExpanded && (
              <span className="whitespace-nowrap text-sm font-medium">
                {link.label}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {isExpanded && (
        <div className="mt-4 border-t border-white/20 p-3">
          <h3 className="mb-3 text-sm font-semibold text-[#00003c]">
            Latest Activities
          </h3>
          <div
            className="flex flex-col gap-2 overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 280px)" }}
          >
            {activities.length === 0 ? (
              <p className="text-xs text-[#00003c] opacity-70">
                No activities yet
              </p>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="text-xs text-[#00003c]">
                  <p className="opacity-70">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                  <p className="mt-1">
                    {formatActivity(activity).split(activity.title)[0]}
                    <span className="font-bold">{activity.title}</span>
                    {formatActivity(activity).split(activity.title)[1]}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
