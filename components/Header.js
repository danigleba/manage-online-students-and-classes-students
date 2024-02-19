import { useEffect } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import { auth } from "@/utils/firebase"
import { onAuthStateChanged } from "firebase/auth"
import AddClassesButton from "./AddClassesButton"

export default function Headers(props) {
    const router = useRouter()
 
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
          if (!user) {
            router.push("/login")
          } 
        })    
    }, [])
    return (
        <main className='pb-28 md:pb-32 w-full'>
            <div className="fixed px-6 md:px-10 py-3 flex justify-between items-center bg-white w-screen border-b boder-[#dddddd]">
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
                    <div className="hidden md:block">
                    <AddClassesButton user={props?.user} />
                    </div>
                    <div>
                        <p className="hidden md:flex font-semibold text-lg">{props?.user?.displayName}</p>
                    </div>
                    {props?.user?.photoURL && (<Image className='rounded-full' alt="Tutor's profile picture" height={50} width={50} src={props?.user?.photoURL}/>)}
                </div>
            </div>
        </main>
    )
}