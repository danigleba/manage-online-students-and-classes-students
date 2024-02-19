import { db } from "@/utils/firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"

export default async function handler(req, res) {
    const { user } = req.body
    try {
        const studentRef = doc(db, "students", `${user.id}`)
        const newStudent = await setDoc(studentRef, {
            id: user.id,
            picture: user.picture,
            name: user.name, 
            given_name: user.given_name, 
            family_name: user.family_name, 
            locale: user.locale,
        })
        const studentSnap = await getDoc(studentRef)
        const studentData = studentSnap.data()
        res.status(201).json({ newStudent: studentData })
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" })
    }
} 