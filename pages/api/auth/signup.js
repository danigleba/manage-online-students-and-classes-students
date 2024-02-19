import { db } from "@/utils/firebase"
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore"

export default async function (req, res) {
    const { user } = req.body
    try {
        // Check if user already exists
        const studentRef = collection(db, "students")
        const studentSnap = await getDocs(query(studentRef, where("email", "==", user.email)))
        let studentExists = false
        
        studentSnap.forEach((doc) => {
            if (doc.exists()) {
                tutorExists = true
            }
        })

        if (studentExists) {
            res.status(200).json({ studentExists: true })
        } else {
            await setDoc(doc(db, "students", `${user.uid}`), { 
                email: user.email,
                username: user.displayName,
                profile_url: user.photoURL,
                tutors: []
            })
            res.status(200).json({ studentExists: true })
        }
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}