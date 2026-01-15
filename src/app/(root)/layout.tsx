import RootProvider from '@/components/provider/root-provider'
import React from 'react'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <RootProvider>
            {children}
        </RootProvider>
    )
}

export default RootLayout;