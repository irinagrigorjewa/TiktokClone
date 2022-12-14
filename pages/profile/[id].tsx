import React, {useEffect, useState} from 'react';
import axios from "axios";
import {BASE_URL} from "../../utils";
import {IUser, Video} from "../../types";
import useAuthStore from "../../store/authStore";
import Image from "next/image";
import {GoVerified} from "react-icons/go";
import VideoCard from "../../components/VideoCard";
import NoResults from "../../components/NoResults";

interface IProps {
    data: {
        user: IUser,
        userVideo: Video[],
        userLikedVideo: Video[]
    }
}

const Profile = ({data}: IProps) => {
    const {user, userVideo, userLikedVideo} = data
    const [showUserVideo, setShowUserVideo] = useState<boolean>(true)
    // const [isAccounts, setIsAccounts] = useState<boolean>(true)
    const [videosList, setVideosList] = useState<Video[]>([])
    const videos = showUserVideo ? 'border-b-2 border-black' : 'text-gray-400'
    const likedVideos = !showUserVideo ? 'border-b-2 border-black' : 'text-gray-400'

    useEffect(() => {
        if (showUserVideo) {
            setVideosList(userVideo)
        } else {
            setVideosList(userLikedVideo)
        }
    }, [showUserVideo, userLikedVideo])
    return (
        <div className='w-full'>
            <div className="flex gap-6 md:gap-10 mb-4 bg-white w-full">
                <div className="w-16 h-16 md:w-32 md:h-32">
                    <Image src={user?.image}
                           alt='user image'
                           width={120}
                           height={120}
                           className='rounded-full'
                           layout='responsive'
                    />
                </div>
                <div className="flex flex-col items-center justify-center">
                    <p className='md:text-2xl tracing-wider flex gap-1 items-center
                     justify-center text-md font-bold text-primary lowercase'>
                        {user?.userName}
                        <GoVerified className='text-blue-400'/></p>
                    <p className='capitalize text-xs text-gray-400'>
                        {user?.userName}
                    </p>
                </div>
            </div>

            <div>
                <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
                    <p className={`text-xl font-semibold cursor-pointer mt-2 
                    ${videos}`}
                       onClick={() => setShowUserVideo(true)}
                    >Videos</p>
                    <p className={`text-xl font-semibold cursor-pointer mt-2
                     ${likedVideos}`}
                       onClick={() => setShowUserVideo(false)}

                    >Liked</p>
                </div>
                <div className="flex gap-6 lex-wrap">
                    <div className="mt-2">
                        {videosList?.length > 0 ? (
                                videosList.map((post: Video, idx: number) => (
                                    <VideoCard post={post} key={idx}/>))) :
                            (<NoResults text={''}/>)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};
export const getServerSideProps = async ({params: {id}}: {
    params: { id: string }
}) => {
    const res = await axios.get(`${BASE_URL}/api/profile/${id}`)
    return {
        props: {data: res.data}
    }

}
export default Profile;