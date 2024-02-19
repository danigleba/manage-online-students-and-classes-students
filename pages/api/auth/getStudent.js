import {db} from '@/utils/firebase'
import { doc, getDoc } from "firebase/firestore"; 

export default async function (req, res) {
    const { user } = req.body
    try {
        const studetRef = doc(db, "students", `${user.id}`)
        const studentSnap = await getDoc(studetRef)
        const studentData = studentSnap.data()
        res.status(200).json({ user: studentData})
    } catch (error) {
        res.status(500).json(error)
    }
}