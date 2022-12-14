import React, {useEffect, useState} from 'react';
import Image from "next/image";
import Link from "next/link";
import Logo from '../utils/tiktik-logo.png'
import {GoogleLogin, googleLogout} from "@react-oauth/google";
import {createOrGetUser} from "../utils";
import useAuthStore from "../store/authStore";
import {IoMdAdd} from "react-icons/io";
import {AiOutlineLogout} from "react-icons/ai";
import {BiSearch} from "react-icons/bi";
import {useRouter} from "next/router";
import {IUser} from "../types";

const Navbar = () => {
    const [user, setUser] = useState<IUser | null>()

    const {userProfile, addUser, removeUser} = useAuthStore()
    const [searchValue, setSearchValue] = useState()
    useEffect(() => {
        setUser(userProfile)
    }, [userProfile])
    const router = useRouter()
    const handleSearch = (e: { preventDefault: () => void }) => {
        e.preventDefault()
        if (searchValue) {
            router.push(`/search/${searchValue}`)
        }
    }
    return (
        <div className='navbar w-full flex justify-between items-center py-2 px-4 border-gray-200 border-b-2'>
            <Link href='/'>
                <div className='w-[100px] md:w-[130px]'>
                    <Image
                        className='cursor-pointer'
                        src={Logo}
                        alt='TikTik'
                        layout='responsive'
                    />

                </div>
            </Link>
            <div className='relative hidden md:block'>
                <form onSubmit={handleSearch}
                      className='absolute md:static top-10 left-20 bg-white'
                >
                    <input
                        className='bg-primary p-2 md:text-md font-medium
                        border-gray-100 border-2 focus:outline-none
                         focus:border-2
                        focus:border-gray-300 w-[300px] md:w-[350px]
                        rounded-full md:top-0'
                        type="text"
                        value={searchValue}
                        onChange={(e: any) => {
                            setSearchValue(e.target.value)
                        }}
                        placeholder='Search accounts and videos'
                    />
                    <button onClick={() => {
                    }} className='right-6 top-4 border-gray-100 pl-4 text-2xl'>
                        <BiSearch/>
                    </button>
                </form>
            </div>
            <div>
                {userProfile ?
                    <div className='flex gap-5 md:gap-10'>
                        <Link href='/upload'>
                            <button className='border-2 px-2 md:px-4 gap-2
                        flex items-center font-semibold text-md'>
                                <IoMdAdd className='text-xl'/>{''}
                                <span className='hidden md:block'>Upload</span>
                            </button>
                        </Link>
                        {user?.image &&
                            (<Link href='/'>
                                <Image
                                    src={user.image}
                                    alt='profile photo'
                                    width={40}
                                    height={40}
                                    className='rounded-full cursor-pointer'
                                />
                            </Link>)}
                        <button
                            className='border-2 p-2 rounded-full cursor-pointer outline-none shadow-md'
                            type='button'
                            onClick={() => {
                                googleLogout()
                                removeUser()
                            }
                            }>

                            <AiOutlineLogout color='red' fontSize={21}/>
                        </button>
                    </div> :
                    <GoogleLogin
                        onSuccess={(response) => {
                            createOrGetUser(response, addUser)
                        }}
                        onError={() => {
                            console.log('Login Failed')
                        }}
                    />}
            </div>
        </div>
    );
};

export default Navbar;