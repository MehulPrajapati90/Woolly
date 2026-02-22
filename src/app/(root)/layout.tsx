import RootProvider from '@/components/provider/root-provider'
import { requireAuth } from '@/utils/auth-utils';
import React from 'react'

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
    // await requireAuth();
    return (
        <RootProvider>
            {children}
        </RootProvider>
    )
}

export default RootLayout;