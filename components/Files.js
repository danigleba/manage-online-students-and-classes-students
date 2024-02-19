import { useEffect, useState } from 'react'
import { GrDocumentText } from 'react-icons/gr'
import { BsArrowRight } from 'react-icons/bs'
import { IoDocumentText } from "react-icons/io5";

export default function Files(props) {
    const [files, setFiles] = useState([])
  
    useEffect(() => {
        fetch("/api/files/get_files?student_email=" + props?.user?.email)
        .then(response => response.json())
        .then(data => setFiles(data.data))
    }, [props?.user])
  return (
    <main id="files" className="pt-8 mx-4 md:mx-10">
      <h2 className='mb-6'>Documentos</h2>
      <div className="">
      {files.length > 0 ? (
          <div className="flex grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 text-center font-medium">
            {files.map((item, index) => (
              <a target="_blank" href={item.downloadURL}  key={item.id || index}>
                <div className="px-8 w-full bg-white  border border-[#dddddd] duration-200 rounded-xl p-4 flex justify-between items-center">
                  <div className="truncate flex items-center gap-4">
                    <div className='w-max'>
                      <IoDocumentText size={20} color="#222222"/>
                    </div>
                    <p className="truncate">{item.name}</p>
                  </div>
                  <div>
                  </div>
                </div>
              </a>
            ))} 
          </div>
        ) : (
            <div className='mx-4 md:mx-6 flex-col justify-center'>
              <p className='text-center font-light text-md md:text-lg'>Aún no tienes ningún documento.</p>
            </div>
        )}
          </div>
    </main>
  )
}