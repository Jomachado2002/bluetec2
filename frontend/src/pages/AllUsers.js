import React, { useEffect, useState } from 'react'
import SummaryApi from '../common'
import { toast } from 'react-toastify'
import { CiEdit } from "react-icons/ci";
import moment from 'moment'
import ChangeUserRole from '../components/ChangeUserRole';

const AllUsers = () => {
    const [allUser, setAllUsers] = useState([])
    const [ openUpdateRole , setOpenUpdateRole ] = useState (false)
    const [updateUserDetails, setUpdateUserDetails] = useState ({
        email:"",
        name:"",
        role:"",
        _id:""
    })
    
    const fetchAllUsers = async()=>{
        const fetchData = await fetch (SummaryApi.allUser.url,{
            method: SummaryApi.allUser.method,
            credentials : 'include'
        })

        const dataResponse = await fetchData.json()

        if(dataResponse.success){
            setAllUsers(dataResponse.data)
        }
        if(dataResponse.error){
            toast.error(dataResponse.message)
        }
    }    
    useEffect(()=>{
        fetchAllUsers()

    },[])
    return (
    <div className='bg-green-50'>
        <table className = 'w-full userTable '>
            <thead>
                <tr className= 'bg-blue-950 text-white'>
                <th>Sr.</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Creado en la fecha</th>
                <th>Accion</th>
                </tr>
            </thead>
            
            <tbody className='pb-4 bg-green-50'>
            {
                allUser.map((el,index) =>{
                    return(
                        <tr>
                            <td>{index+1}</td>
                            <td>{el?.name}</td>
                            <td>{el?.email}</td>
                            <td>{el?.role}</td>
                            <td>{moment(el?.createdAt).format('lll')}</td>
                            <td>
                                <button className= 'bg-blue-100 p-2 rounded-full cursor-pointer hover:bg-white'
                                 onClick={()=>{
                                 setUpdateUserDetails(el)
                                 setOpenUpdateRole(true)
                                }}
                                 >
                                <CiEdit/>
                                </button>
                            </td>
                        </tr>
                    )
                })
            }
            </tbody>
        </table>
            {
                openUpdateRole && (
        <ChangeUserRole 
        onClose={()=>setOpenUpdateRole(false)} 
        name={updateUserDetails.name}
        email={updateUserDetails.email}
        role={updateUserDetails.role}
        userId={updateUserDetails._id} 
        callFunc={fetchAllUsers}/>
                )
            }
        
    </div>
  )
}

export default AllUsers
