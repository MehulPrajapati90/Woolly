import { SiteHeader } from '@/components/dashboard/site-header';
import { AppSidebar } from '@/components/dashboard/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { requireAuth } from '@/utils/auth-utils';
import React from 'react'

const HomeLayout = async ({ children }: { children: React.ReactNode }) => {
    await requireAuth();
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}

export default HomeLayout;