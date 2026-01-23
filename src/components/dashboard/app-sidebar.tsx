"use client"

import * as React from "react"
import {
  IconBrandSafari,
  IconCalendarMonth,
  IconCamera,
  IconCategory,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/dashboard/nav-documents"
import { NavMain } from "@/components/dashboard/nav-main"
import { NavSecondary } from "@/components/dashboard/nav-secondary"
import { NavUser } from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useRequireAuth } from "@/hooks/query/auth"
import Link from "next/link"

const data = {
  navMain: [
    {
      title: "Events",
      url: "/events",
      icon: IconDashboard,
    },
    {
      title: "Calendars",
      url: "/calendars",
      icon: IconCalendarMonth,
    },
    {
      title: "Discover",
      url: "/discover",
      icon: IconBrandSafari,
    },
    {
      title: "Category",
      url: "/category",
      icon: IconCategory,
    },
    {
      title: "Team",
      url: "#",
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      name: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],
}

interface UserInterface {
  name: string
  email: string
  image?: string
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { data: UserData } = useRequireAuth();

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/home">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Woolly</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={UserData?.user as unknown as UserInterface} />
      </SidebarFooter>
    </Sidebar>
  )
}
