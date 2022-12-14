import React, {useState} from 'react';
import axios from "axios";
import {BASE_URL} from "../../utils";
import {IUser, Video} from "../../types";
import NoResults from "../../components/NoResults";
import {useRouter} from "next/router";
import VideoCard from "../../components/VideoCard";
import useAuthStore from "../../store/authStore";
import Link from "next/link";
import Image from "next/image";
import {GoVerified} from "react-icons/go";

const SearchTerm = ({videos}: { videos: Video[] }) => {
    const [showUserVideo, setShowUserVideo] = useState<boolean>(true)
    const [isAccounts, setIsAccounts] = useState<boolean>(true)
    const router = useRouter()
    const {searchTerm}: any = router.query
    const {allUsers} = useAuthStore()
    const accounts = showUserVideo ? 'border-b-2 border-black' : 'text-gray-400'
    const isVideos = !showUserVideo ? 'border-b-2 border-black' : 'text-gray-400'
    const searchedAccounts = allUsers.filter((user: IUser) =>
        user.userName.toLowerCase().includes(searchTerm.toLowerCase()))
    return (
        <div className='w-full'>
            <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
                <p className={`text-xl font-semibold cursor-pointer mt-2 
                    ${accounts}`}
                   onClick={() => setIsAccounts(true)}
                >Accounts</p>
                <p className={`text-xl font-semibold cursor-pointer mt-2
                     ${isVideos}`}
                   onClick={() => setIsAccounts(false)}

                >Videos</p>
            </div>
            {isAccounts ?
                <div className='md:mt-16'>
                    {searchedAccounts.length > 0 ? (
                            searchedAccounts.map((user: IUser, idx: number) => (
                                <Link href={`/profile/${user._id}`} key={idx}>
                                    <div className="flex gap-3 p-2 border-gray-200
                                     cursor-pointer border-b-2 rounded">
                                        <Image
                                            src={user.image}
                                            width={50}
                                            height={50}
                                            alt='user profile'
                                            className='rounded-full'
                                        />
                                        <div className=''>
                                            <p className=' flex gap-1 items-center
                                          text-lg font-bold text-primary'>
                                                {user?.userName}
                                                <GoVerified className='text-blue-400'/></p>
                                            <p className='capitalize text-xs text-gray-400'>
                                                {user?.userName}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))) :
                        <NoResults text={`No video results for ${searchTerm}`}/>}
                </div> :
                <div className='md:t-16 flex flex-wrap gap-6 md:justify-start'>
                    {videos.length ? (
                            videos.map((video, idx) =>
                                <VideoCard post={video} key={idx}/>)) :
                        <NoResults text={`No video results for ${searchTerm}`}/>}
                </div>}
        </div>
    );
};
export const getServerSideProps = async ({params: {searchTerm}}: {
    params: { searchTerm: string }
}) => {
    const res = await axios.get(`${BASE_URL}/api/search/${searchTerm}`)
    return {props: {videos: res.data}}

}
export default SearchTerm;