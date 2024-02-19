import { Inter } from 'next/font/google'
import { auth } from '@/utils/firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const router = useRouter()
    const googleProvider = new GoogleAuthProvider()

    useEffect(() => {
        router.push("/login")
    }, [])
    return (
        <main className="mx-6">
        </main>
    )
}