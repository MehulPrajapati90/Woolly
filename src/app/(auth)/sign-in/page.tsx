"use client"

import { Button } from '@/components/ui/button';
import { signIn } from '@/lib/auth-client';
import { Github, Shell } from 'lucide-react';
import Link from 'next/link';

const LoginPage = () => {

    return (
        <section className='relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-16'>
            <div className='pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-r from-red-700/35 via-orange-500/20 to-black blur-3xl' />
            <div className='pointer-events-none absolute left-1/2 top-1/2 h-72 w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-red-700/45 via-orange-400/50 to-red-900/45 blur-[110px]' />

            <div className='relative w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-1 shadow-2xl shadow-red-950/30 backdrop-blur-xl'>
                <div className='rounded-[1.35rem] border border-white/10 bg-black/70 p-8'>
                    <Link href={'/'} className="flex items-center gap-2">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-sm font-bold">
                            <Shell className="p-[0.2px]" />
                        </div>
                        <span className="text-lg font-semibold font-sans tracking-wide text-white/90">
                            Wooly
                        </span>
                    </Link>

                    <h2 className='mb-1 mt-6 text-2xl font-semibold text-white'>Sign in to Wooly</h2>
                    <p className="text-sm text-white/60">Welcome back. Continue to manage your online events.</p>

                    <div className='mt-7 grid grid-cols-1 gap-3'>
                        <Button
                            variant='outline'
                            className='h-11 w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white'
                            onClick={() => signIn.social({
                                provider: 'google',
                                callbackURL: "/"
                            })}
                        >
                            <Github className='mr-2 h-4 w-4' />
                            Sign in with Google
                        </Button>
                    </div>

                    <p className='mt-5 text-center text-xs text-white/45'>
                        By continuing, you agree to our Terms and Privacy Policy.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default LoginPage;
