import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CiUser } from 'react-icons/ci';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';

const AdminPanel = () => {
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (user?.role !== ROLE.ADMIN) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className='min-h-screen flex flex-col md:flex-row'>
            <aside className='bg-white border-r border-gray-300 w-full md:max-w-xs p-4'>
                <div className='flex flex-col items-center'>
                    <div className='relative flex flex-col items-center cursor-pointer'>
                        {user?.profilePic ? (
                            <img src={user?.profilePic} className='w-20 h-20 rounded-full' alt={user?.name} />
                        ) : (
                            <CiUser className='text-5xl' />
                        )}
                        <p className='capitalize text-lg font-semibold'>{user?.name}</p>
                        <p className='text-sm'>{user?.role}</p>
                    </div>
                </div>
                <nav className='mt-6'>
                    <Link to={"all-users"} className='block px-4 py-2 mt-2 text-gray-700 rounded-lg hover:bg-green-600 hover:text-white transition-colors duration-200'>Todos los Usuarios</Link>
                    <Link to={"all-products"} className='block px-4 py-2 mt-2 text-gray-700 rounded-lg hover:bg-green-600 hover:text-white transition-colors duration-200'>Todos Productos</Link>
                </nav>
            </aside>
            <main className='flex-1 p-4'>
                <Outlet />
            </main>
        </div>
    );
}

export default AdminPanel;
