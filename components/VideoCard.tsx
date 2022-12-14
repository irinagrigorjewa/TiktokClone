import React, {useEffect, useRef, useState} from 'react';
import {Video} from "../types";
import {NextPage} from "next";
import Link from "next/link";
import Image from "next/image";
import {GoVerified} from "react-icons/go";
import {Simulate} from "react-dom/test-utils";
import playing = Simulate.playing;
import {BsFillPauseFill, BsFillPlayFill} from "react-icons/bs";
import {HiVolumeOff, HiVolumeUp} from "react-icons/hi";

interface IProps {
    post: Video
}

const VideoCard: NextPage<IProps> = ({post}) => {
    const [isHover, setIsHover] = useState(false)
    const [playing, setPlaying] = useState(false)
    const [isVideoMuted, setIsVideoMuted] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    const onVideoPress = () => {
        if (playing) {
            videoRef?.current?.pause()
            setPlaying(false)
        } else {
            videoRef?.current?.play()
            setPlaying(true)

        }
    }
    useEffect(() => {
        if (videoRef?.current) {
            videoRef.current.muted = isVideoMuted
        }
    }, [isVideoMuted])
    return (
        <div className='flex flex-col border-b-2 border-gray-200 pb-6'>
            <div className="flex gap-3 p-2 cursor-pointer">
                <div className="md:w-16 md:h-16 w-10 h-10">
                    <div>
                        <Link href={`/profile/${post.postedBy._id}`}>
                            <div className='flex items-center gap-2'>
                                <p className='flex items-center gap-2 md:text-md
                            font-bold text-primary'>
                                    {post.postedBy.userName}{` 
                            `}
                                    <GoVerified className='text-blue-400 text-md'/>
                                </p>
                            </div>
                        </Link>
                    </div>
                    {/*<>*/}
                    {/*    <Image src={post.postedBy.image} alt='profile photo'*/}
                    {/*           width={62} height={62}*/}
                    {/*           className='rounded-full'*/}
                    {/*           layout='responsive'*/}
                    {/*    />*/}
                    {/*</>*/}
                </div>
            </div>
            <div className="lg:ml-20 flex gap-4 relative">
                <div className="rounded-3xl" onMouseEnter={() => {
                    setIsHover(true)
                }}
                     onMouseLeave={() => {
                         setIsHover(false)
                     }}
                >
                    <Link href={`/detail/${post._id}`}>
                        <video
                            className='lg:w-[600px] h-[300px] md:h-[400px] lg:h-[530px]
                            w-[200px] rounded-2xl cursor-pointer bg-gray-100'
                            src={post.video.asset.url}
                            loop
                            ref={videoRef}
                        ></video>
                    </Link>
                    {isHover && <div className='absolute bottom-6 cursor-pointer left-8
                    md:left-14 lg:left-0 flex gap-10 lg:justify-between w-[100px]
                    md:w-[50px] p-3'>
                        {playing ?
                            <button onClick={onVideoPress}>
                                <BsFillPauseFill
                                    className='text-black text-2xl lg:text-4xl'/>
                            </button> :
                            <button onClick={onVideoPress}>
                                <BsFillPlayFill
                                    className='text-black text-2xl lg:text-4xl'/>
                            </button>
                        }
                        {isVideoMuted ?
                            <button onClick={() => setIsVideoMuted(true)}>
                                <HiVolumeOff
                                    className='text-black text-2xl lg:text-4xl'/>
                            </button> :
                            <button onClick={() => setIsVideoMuted(false)}>
                                <HiVolumeUp
                                    className='text-black text-2xl lg:text-4xl'/>
                            </button>
                        }
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default VideoCard;