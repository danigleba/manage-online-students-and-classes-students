import { use, useEffect, useState } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import Cookies from "js-cookie"
import { auth } from "@/utils/firebase"
import { onAuthStateChanged } from "firebase/auth"
import AddClassesButton from "./AddClassesButton"

export default function Headers(props) {
    const router = useRouter()
    const userCookie = Cookies.get("userCookie")
    const [userData, setUserData] = useState()
 
    const handleAuth = async () => {
        const params = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = params.get("access_token") 
        const userData = await fetchUserData(accessToken ? accessToken : Cookies.get("accesCookie"))
        await setUserData(userData)
        if (!userCookie) {
            if (accessToken) {
                Cookies.set("accesCookie", accessToken, { expires: 30 })
                Cookies.set("userCookie", userData.id, { expires: 30 })
                checkUserInFirestore(userData)
            } else router.push("/signup")
        } else checkUserInFirestore(userData)
    }

    const fetchUserData = async (accessToken) => {
        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.ok) {
                const userData = await response.json();
                setUserData(userData)
                return userData;
            } else {
                throw new Error("Failed to fetch user data");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    }

    const checkUserInFirestore = async (user) => {
        const url = "/api/auth/checkIfStudentInFB?uid=" + user?.id
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
        const data = await response.json()
        if (data.userExists == false) {
            uploadUserToFirebase(user)
        } else getUserFromFirebase(user)
    }

    const uploadUserToFirebase = async (userData) => {
            const response = await fetch("/api/auth/uploadNewStudent", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ user: userData })
            })
            const data = await response.json() 
            console.log(data.newStudent)
            setUserData(data.newStudent)
    }
      
    const getUserFromFirebase = async (user) => {
        const response = await fetch("/api/auth/getStudent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ user: user })
        })
        const data = await response.json() 
        console.log(data)
        setUserData(data.user)
    }

    useEffect(() => {
        handleAuth()
    }, [Cookies])

    useEffect(() => {
        console.log(userData)
    }, [userData])
    return (
        <main className='pb-28 md:pb-32 w-full'>
            <div className="fixed px-6 md:px-10 py-3 flex justify-between items-center bg-white w-screen border-b boder-[#dddddd] gap-6">
                <div>
                    <button onClick={() => router.push("/")}>
                        <Image alt="Cornelio's logo" height={100} width={100} src="https://firebasestorage.googleapis.com/v0/b/cornelio-9f37a.appspot.com/o/logo.png?alt=media&token=36fa1da0-40a9-4e2e-a6f7-9f3fc5d77510&_gl=1*1x34fcy*_ga*Njg1NzExNjYxLjE2OTA2MzY3Mjk.*_ga_CW55HF8NVT*MTY5ODYwMjYxMS4xOTUuMS4xNjk4NjA0OTMyLjQ3LjAuMA.." />
                    </button>
                </div>
                <div className='hidden md:flex font-semibold text-lg gap-12'>
                    <a href="/">Clases</a>
                    <a href="/#files">Documentos</a>
                    <a href="/calendar">Calendario</a>
                </div>
                <div className="flex items-center gap-4">
                    <AddClassesButton tutorId={userData?.tutors?.[0]?.id}/>                  
                    <div>
                        <p className="hidden md:flex font-semibold text-lg">{userData?.name}</p>
                    </div>
                    {props?.user?.photoURL && (<Image className='rounded-full' alt="Tutor's profile picture" height={50} width={50} src={userData?.picture}/>)}
                </div>
            </div>
        </main>
    )
}