"use client"

import * as React from "react"
import { useState, useEffect } from 'react';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Bookmark,
  GalleryVerticalEnd,
  Map,
  Bell,
  HelpCircle,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  teams: [
    {
      name: "FIRA",
      logo: GalleryVerticalEnd,
      plan: "Financial Intelligent Requisition Assistant",
    },
  ],
  navMain: [
    {
      title: "Dashboard Insights",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "#",
        },
        {
          title: "AI Predictions",
          url: "#",
        },
        {
          title: "Performance Metrics",
          url: "#",
        },
      ],
    },
    {
      title: "Requisitions Management",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Create New Requisition",
          url: "#",
        },
        {
          title: "Pending Approvals",
          url: "#",
        },
        {
          title: "Completed Requisitions",
          url: "#",
        },
      ],
    },
    {
      title: "Inventory",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Current Stock Levels",
          url: "#",
        },
        {
          title: "Low Stock Alerts",
          url: "#",
        },
        {
          title: "Order History",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Profile Settings",
          url: "#",
        },
        {
          title: "System Preferences",
          url: "#",
        },
        {
          title: "Account Management",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "AI Recommendations",
      url: "#",
      icon: Bookmark,
    },
    {
      name: "Notifications",
      url: "#",
      icon: Bell,
    },
    {
      name: "Help & Support",
      url: "#",
      icon: HelpCircle,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = useState({
    name:"",
    email:"",
    avatar: "/avatars/shadcn.jpg",
  });

  const token = sessionStorage.getItem('jtwtToken');

  useEffect(() => {
    if (token) {
      const fetchUserData = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/users/profiles', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUserData({
              name: data.name,
              email: data.email,
              avatar: '/avatars/shadcn.jpg',
            });
          } else {
            console.error("Failed to fetch user data");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, [token]); //run effect when token changes
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
