import { Inter } from "next/font/google"
import Header from "@/components/Header"
import { useState, useEffect } from "react"
import {onAuthStateChanged} from "firebase/auth"
import {auth} from "@/utils/firebase"
import Image from "next/image"
import { useRouter } from "next/router"
import { stripe } from "@stripe/stripe-js"
import { DateTimePicker } from "@mui/x-date-pickers"
import { LocalizationProvider } from '@mui/x-date-pickers';
import { renderTimeViewClock } from "@mui/x-date-pickers"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import 'dayjs/locale/en-gb';
import { loadStripe } from "@stripe/stripe-js"
import { IoSearch } from "react-icons/io5";
import BottomNavBar from "@/components/BottomNavBar"

const inter = Inter({ subsets: ["latin"] })
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

export default function Home() {
    const router = useRouter()
    const [tutor, setTutor] = useState(router.query.tutor || "");
    const [state, setState] = useState("Find tutor")
    const [user, setUser] = useState({})
    const [tutorInput, setTutorInput] = useState("")
    const [matchTutor, setMatchTutor] = useState({})
    const [paidCalsses, setPaidClasses] = useState(null)
    const [price, setPrice] = useState(0)
    const [nClasses, setNClasses] = useState()
    const [clientSecret, setClientSecret] = useState()
    const [allowBooking, setAllowBooking] = useState(false)
    //Class booking 
    const [selectedDate, setSelectedDate] = useState("")
    const [day, setDay] = useState("")
    const [time, setTime] = useState("")
    const [selectedClasses, setSelectedClasses] = useState([])

    //Booking classes
    const findTutor = async () => {
        const url = "/api/classes/find_tutor?tutor=" + tutorInput   
        fetch(url)
            .then(response => response.json())
            .then(data => setMatchTutor(data.data[0]))    
    }

    const addTutor = async () => {
        const url = "/api/classes/add_tutor?matchTutor=" + (tutor == "" ? matchTutor.email : tutor) + "&email=" + user?.email
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
    }

    function getPaidClasses() {
        const url = "/api/classes/get_paid_classes?tutor_email=" + (tutor == "" ? matchTutor.email : tutor) + "&student_email=" + user?.email
        fetch(url)
            .then(response => response.json())
            .then(data => setPaidClasses(data.data))
    }

    const selectTutor = async () => {
        router.push(`/book?tutor=${matchTutor.email}`)
    }

    const bookClasses = async () => {
        if (allowBooking) {
            if (day != "" && time != "") {
                const url = "/api/classes/add_classes?tutor_email=" + matchTutor?.email + "&tutor_profile=" + matchTutor?.profile_url + "&tutor_username=" + matchTutor?.username + "&student_email=" + user?.email  + "&student_username=" + user?.username + "&time=" + time + "&profile_url=" + user?.profile_url  + "&day=" + day + "&recurring=" + recurring + "&nRecurring=" + nRecurring
                fetch(url)
                    .then(response => response.json())
                    .then(data => setPaidClasses(data.data))

                const url2 = "/api/classes/delete_paid_classes?tutor_email=" + matchTutor?.email + "&student_email=" + user?.email + "&nBooked=" + nRecurring + "&recurring=" + recurring
                fetch(url2)
                    .then(response => response.json())
                    .then(data => setPaidClasses(data.data)) 
            }
        } else {
            console.log("Esta hora ya esta reservada")
        }
    }

    const checlAvailability = async () => {
        const url = "/api/classes/check_availability?day=" + day + "&time=" + time
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        })
        const data = await response.json()
        console.log(data)
        if (data.isAvailable == false) {
            setAllowBooking(false)
        } else {
            setAllowBooking(true)
        }
    }

    //Buying classes
    const createPaymentIntent = async (price) => {
        if (price > 0) {
            const stripe = await stripePromise

            const url = "/api/stripe/create-payment-intent?tutor_email=" + matchTutor?.email + "&student_email" + user?.email + "&price=" + price
            const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                }
            })
            const data = await response.json()
            setClientSecret(data.clientSecret)
        }   
    }

    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
            const url = "/api/auth/getStudent?email=" + auth.currentUser.email
            fetch(url)
                .then(response => response.json())
                .then(data => setUser(data.data))     
        } 
      })    
    }, [])

    useEffect(() => {
        setTutor(router.query.tutor || "")
    }, [router])

    useEffect(() => {
        if (user != {} && tutor != "") {
            addTutor()
            getPaidClasses()
        }
    },[user, tutor])

    useEffect(() => {
        findTutor()
      }, [tutorInput])

    useEffect(() => {
        if (price == (1*matchTutor?.prices?.one_class * 100)) {
            setNClasses(1)
        } else if (price == (10*matchTutor?.prices?.ten_classes * 100)) {
            setNClasses(10)
        } else if (price == (20*matchTutor?.prices?.twenty_classes * 100)) {
            setNClasses(20)
        }
    }, [price])

    useEffect(() => {
        if (paidCalsses > 0) {
            setState("Find spot")
        } else if (paidCalsses == 0) {
            setState("Buy classes")
        }
    }, [paidCalsses])
      
    useEffect(() => {
        if (day != "" && time != "") {
            checlAvailability()
        }
    }, [day, time])

    useEffect(() => {
        console.log(selectedDate)
    }, [selectedDate])
   return (
    <main>
        <Header user={auth.currentUser}/>
        <div className="mx-4 md:mx-10 flex justify-center">
            {/*Tutor search*/}
            {paidCalsses == null ? (
                <div className="flex flex-col justify-start items-center w-screen h-96">
                        <h2 className="mb-4 flex items-start justify-center text-center">¿Con quién quieres hacer clases?</h2>
                        <div className="flex items-center gap-4 px-4 border border-[#dddddd] text-[#222222] text-sm rounded-full md:w-1/2 w-full p-2.5">
                            <IoSearch size={17} color="#222222" />
                            <input onChange={(e) => setTutorInput(e.target.value)} placeholder="Nombre Apellido" className="outline-none w-full"/>
                        </div>
                        <div className="w-full my-4 border-b border-[#dddddd]"></div>
                        {!matchTutor && (
                            <p className="text-center font-light text-md md:text-lg pt-12">No hemos encontrado ningún tutor con ese nombre... <br/>Encuentra a tu tutor escribiendo su nombre en el buscador.</p>
                        )}
                    {matchTutor ? (
                        <button onClick={selectTutor} className="w-full px-8 py-4 bg-white hover:bg-[#f4f4f4] duration-200 border border-[#dddddd] rounded-md flex justify-between items-center">
                            <div className="flex items-center gap-4 justify-start">    
                                {matchTutor.profile_url && (<Image className="rounded-full" alt="Tutor's profile picture" height={50} width={50} src={matchTutor.profile_url}/>)}
                                <div className="text-left">
                                    <p className="font-bold text-lg text-[#252422]">{matchTutor?.username}</p>
                                    <p className="font-light text-md text-[#252422] truncate">{matchTutor?.email}</p>

                                </div>
                            </div>
                        </button>
                    ) : (<></>)}
                </div>
            ) : (<></>)}
            {/*Book classes*/}
            {paidCalsses > 0 ? (
                    <div className="flex justify-center items-center flex-col w-full md:w-2/3">
                        <h2 className="bg-12 font-bold text-2xl md:text-3xl text-center pb-12">Tienes {paidCalsses} clases más con {matchTutor?.username || tutor}</h2>
                        <div className="flex flex-col md:flex-row gap-16 w-full">
                            <div className="w-full space-y-6">
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                                    <DateTimePicker 
                                        viewRenderers={{
                                            hours: renderTimeViewClock,
                                            minutes: renderTimeViewClock,
                                            seconds: renderTimeViewClock,
                                        }} 
                                        className="w-full text-blck" 
                                        sx={{ color: 'red' }}                                        
                                        //onChange={(e) => setSelectedDate(e.target.value)}
                                        label="¿Cuándo quiere hacer clase?" />
                                </LocalizationProvider>
                               
                                <button onClick={bookClasses} className="py-2 rounded-md bg-[#252422] hover:bg-[#000000] duration-200 text-white font-medium w-full">Añadir clase al carrito</button>
                            </div>
                            <div className="h-full border border-[#dddddd]"></div>
                            <div className="w-full flex justify-center items-center space-y-6 text-center">
                                {selectedClasses.length > 0 && (
                                    <button onClick={bookClasses} className="py-2 rounded-md bg-[#eb4c60] hover:bg-[#d63c4f] duration-200 text-white font-medium w-full">Reservar classes</button>
                                )}
                                <p>No tienes ninguna clase en el carrito.</p>
                            </div>
                        </div>
                        
                    </div>
                    ) : (<></>)}
            {/*Buy classes*/}
            {paidCalsses == 0 ? (
                <div className="w-full">
                    <h2 className="text-center text-2xl md:text-3xl md:pb-6">Packs de clases con {matchTutor?.username.substring(0, matchTutor.username.indexOf(" "))}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-4 text-center font-bold text-lg rounded">
                        <div className="checkout-card md:mt-11" onClick={() => createPaymentIntent(1*matchTutor.prices.one_class * 100)} type="submit">
                            <p className="bg-[#f4f4f4] rounded-md py-1">1 clase</p>
                            <p className="text-3xl">25€</p>
                            <button className="checkout-btn">Comprar</button> 
                            <div className="font-normal text-xs">   
                                <p className="pb-2">Todas las clases son de 1 hora.</p>
                                <p>Toda clase cancelada será devuelta al alumno.</p>
                            </div>
                        </div>
                        <div className="flex flex-col w-full items-center justify-center">
                            <div className="font-semibold bg-[#eb4c60] w-1/2 text-center text-white rounded-full mb-2 py-1">
                                <p>Más popular</p>
                            </div>
                            <div className="checkout-card border-[#eb4c60] border-2 w-full" onClick={() => createPaymentIntent(10*matchTutor.prices.ten_classes * 100)} type="submit">
                                <p className="bg-[#eb4c60] text-white rounded-md py-1">10 clases</p>
                                <p className="text-3xl">20€<a className="text-lg font-light"> / clase</a></p>
                                <button className="checkout-btn">Comprar</button> 
                                <div className="font-normal text-xs">   
                                    <p className="pb-2">Todas las clases son de 1 hora.</p>
                                    <p>Toda clase cancelada será devuelta al alumno.</p>
                                </div>
                            </div>
                        </div>
                        <div className="checkout-card md:mt-11" onClick={() => createPaymentIntent(20*matchTutor.prices.twenty_classes * 100)} type="submit">
                            <p className="bg-[#f4f4f4] rounded-md py-1">20 clases</p>
                            <p className="text-3xl">15€<a className="text-lg font-light"> / clase</a></p>
                            <button className="checkout-btn">Comprar</button> 
                            <div className="font-normal text-xs">   
                                <p className="pb-2">Todas las clases son de 1 hora.</p>
                                <p>Toda clase cancelada será devuelta al alumno.</p>
                            </div>
                        </div>

                    </div>
                        {/*
                    <button onClick={createPaymentIntent}>Chektou</button>

                <Elements stripe={stripePromise}>
                        <CheckoutForm nClasses={nClasses} clientSecret={clientSecret} student_email={user?.email} tutor_email={matchTutor?.email} />
                    </Elements>*/}
                </div>
            ) : (<></>)}
                    </div>
        <BottomNavBar />
    </main>
  )
}
