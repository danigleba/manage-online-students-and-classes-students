import Head from "next/head"
import { Inter } from 'next/font/google'
import { auth } from '@/utils/firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { FcGoogle } from "react-icons/fc"

const inter = Inter({ subsets: ['latin'] })

export default function Login() {
    const router = useRouter()
    const googleProvider = new GoogleAuthProvider()

    const googleAuthUrl = "https://accounts.google.com/o/oauth2/auth"
    const clientId = "605098004143-qhd7j3t7fb1p72sllu320fgg9b21f6bj.apps.googleusercontent.com"
    const redirectUri = "http://localhost:3000"
    const scope = "https://www.googleapis.com/auth/calendar.events%20https://www.googleapis.com/auth/userinfo.profile"

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;
            const calendarAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=token`;
            window.location.href = calendarAuthUrl
        } catch (error) {
            console.error("Google login error:", error);
        }    
    }

/*
    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider)
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user: auth.currentUser})
            })
            const data = await response.json()
            if (data.studentExists == true) {
                router.push("/")
            }
          } catch (error) {
                console.error("Google login error:", error);
          }    
    }*/
    return (
        <>
            <Head>
                <title>Alba | Login</title>
                <meta name="description" content="Your meta description goes here" />
                <meta name="author" content="Cornelio Tutors" />
                <link rel="icon" href="/icon.png" />
                <link rel="canonical" href="https://tutors.getcornelio.com/"/>
                <meta property="og:title" content="Cornelio Tutors" />
                <meta property="og:description" content="Your meta description goes here" />
                <meta property="og:image" content="https://example.com/og-image.jpg" />
            </Head>
            <main>   
                <div className="flex justify-center md:grid grid-cols-2 w-full">
                <div className="hidden md:block">
                    <div className="bg-cover bg-center bg-[url('https://firebasestorage.googleapis.com/v0/b/cornelio-9f37a.appspot.com/o/stock_pictures%2Fauth_bg-students.jpg?alt=media&token=9ae115a6-fdaf-41a6-bf0b-1d0780fc9016')] w-full h-screen"></div>
                </div>
                <div className="h-screen w-full flex px-6 md:px-10 flex-col space-y-3 justify-center text-center items-center">
                    <Image className="absolute mb-72" alt="alba's logo" width={150} height={150} src="https://firebasestorage.googleapis.com/v0/b/cornelio-9f37a.appspot.com/o/logo.png?alt=media&token=36fa1da0-40a9-4e2e-a6f7-9f3fc5d77510&_gl=1*1x34fcy*_ga*Njg1NzExNjYxLjE2OTA2MzY3Mjk.*_ga_CW55HF8NVT*MTY5ODYwMjYxMS4xOTUuMS4xNjk4NjA0OTMyLjQ3LjAuMA.." />
                    <p className="font-bold text-2xl text-[#222222]">Iniciar sesión</p>
                    <div className="border-t w-full flex justify-center border-[#dddddd]"></div>
                    <div className="flex justify-center w-full">
                    <button onClick={handleGoogleSignIn} className="shadow-[0px_0px_15px_rgb(0,0,0,0.02)] duration-200 gap-4 w-full md:px-16 py-2 bg-[#f7f7f7] hover:bg-[#dddddd] border border-[#dddddd] flex items-center text-[#222222] justify-center rounded-lg font-bold">
                        <FcGoogle size={20}/>
                        <p>Entrar con Google</p>
                    </button>
                    </div>
                    <p className="pt-2 text-[#222222]">¿Aún no tienes una cuenta? <a href="/signup" className="text-blue-400 underline">Regístrate</a></p>
                </div>
                </div>
            </main>
        </>
    )
}