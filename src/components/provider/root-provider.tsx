import { redirectToHomeIfSession } from '@/utils/auth-utils';
import React from 'react'

const RootProvider = async ({ children }: { children: React.ReactNode }) => {
    await redirectToHomeIfSession();
    return (
        <div>
            {children}
        </div>
    )
}

export default RootProvider;