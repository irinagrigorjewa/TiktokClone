import React, {useEffect, useState} from 'react';
import {FaCloudUploadAlt} from "react-icons/fa";
import {client} from "../utils/client";
import {SanityAssetDocument} from "@sanity/client";
import {topics} from "../utils/constants";
import useAuthStore from "../store/authStore";
import axios from "axios";
import {useRouter} from "next/router";
import {BASE_URL} from "../utils";
import {MdDelete} from "react-icons/md";

const Upload = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [wrongFileType, setWrongFileType] = useState<boolean>(false)
    const [videoAsset, setVideoAsset] = useState<SanityAssetDocument | undefined>()
    const [caption, setCaption] = useState('')
    const [topic, setTopic] = useState<string>(topics[0].name)
    const [savingPost, setSavingPost] = useState<boolean>(false)
    const {userProfile}: { userProfile: any } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (!userProfile) router.push('/')
    }, [userProfile, router])

    const uploadVideo = async (e: any) => {
        debugger
        const selectedFile = e.target.files[0]
        const fileTypes = ['video/mp4', 'video/webm', 'video/ogg']

        if (fileTypes.includes(selectedFile.type)) {
            setWrongFileType(false)
            setIsLoading(true)

            client.assets
                .upload('file', selectedFile,
                    {
                        contentType: selectedFile.type,
                        filename: selectedFile.name
                    })
                .then((data) => {
                    setVideoAsset(data)
                    setIsLoading(false)

                })
        } else {
            setIsLoading(false)
            setWrongFileType(true)
        }
    }
    const handlePost = async () => {
        if (caption && topic && videoAsset?._id) {
            setSavingPost(true)
            const document = {
                _type: 'post',
                caption,
                video: {
                    _type: 'file',
                    asset: {
                        _type: 'reference',
                        _ref: videoAsset?._id
                    }
                },
                userId: userProfile?._id,
                postedBy: {
                    _type: 'postedBy',
                    _ref: userProfile?._id
                },
                topic
            }
            await axios.post(`${BASE_URL}/api/post`, document)
            router.push('/')
        }

    }
    const handleDiscard = () => {
        setSavingPost(false)
        setVideoAsset(undefined)
        setCaption('')
        setTopic('')
    }
    return (
        <div className='upload flex w-full h-full absolute left-0 top-[60px] lg:top-[70px] mb-10 pt-10
        lg:pt-20 bg-[#f8f8f8] justify-center'>
            <div className="bg-white rounded-lg xl:h-[80vh] w-[80%] flex flex-wrap gap-6 justify-center
             items-center p-14 pt-6">
                <div>
                    <div>
                        <p className='text-2xl font-bold'>Upload video</p>
                        <p className='text-md text-gray-400 mt-1'>
                            Post a video to your account</p>
                    </div>
                    <div className="border-dashed rounded-xl border-4
                    border-gray-200 flex justify-center flex-col items-center cursor-pointer
                    outline-none mt-10 w-[260px] h-[460px] p-10 hover:border-red-300 hover:bg-gray-100">
                        {isLoading ?

                            <p className='text-center text-3xl text-red-400 font-semibold'>
                                Uploading...
                            </p>
                            :
                            <div>
                                {videoAsset ?
                                    <div className='rounded-3xl w-[300px] p-4 flex flex-col gap-6
                                     justify-center items-center'>
                                        <video
                                            src={videoAsset?.url}
                                            loop
                                            controls
                                            className='rounded-xl h-[462px] mt-16 bg-black'
                                        ></video>
                                        <div className="flex">
                                            <p></p>
                                            <button
                                                type='button'
                                                onClick={() => {
                                                }}>
                                                <MdDelete/>
                                            </button>
                                        </div>
                                    </div> :
                                    <label className='cursor-pointer'>
                                        <div className='flex flex-col items-center
                                        justify-center h-full'>
                                            <div className='flex flex-col items-center
                                        justify-center'>
                                                <p className='font-bold text-xl'>
                                                    <FaCloudUploadAlt className='text-6xl text-gray-300'/>
                                                </p>
                                                <p className='text-xl text-center
                                                 font-semibold'>
                                                    Select video to upload
                                                </p>
                                            </div>
                                            <p className='text-gray-400 text-center mt-10 text-sm
                                            leading-10
                                            '>MP4 o rWebM or ogg<br/>
                                                720x1280 resolution or higher<br/>
                                                Up to 10 minutes<br/>
                                                Less than 2 GB
                                            </p>
                                            <p className='bg-[#f51997] text-center mt-8 rounded
                                            text-md text-white font-medium p-2 w-52 outline-none'>
                                                Select File
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            name='upload-video'
                                            className='w-0 h-0'
                                            onChange={(e) => uploadVideo(e)}
                                        />
                                    </label>
                                }
                            </div>
                        }
                        {wrongFileType &&
                            <p className='text-center text-xl text-red-400 font-semibold mt-4 w-[250px]'>
                                Please select a video file</p>
                        }
                    </div>

                </div>
                <div className='flex flex-col gap-3 pb-10'>
                    <label className='text-md font-medium'>Caption</label>
                    <input
                        className='rounded text-md border-2 outline-one border-gray-200 p-2'
                        type="text"
                        value={caption}
                        onChange={(e: any) => {
                            setCaption(e.target.value)
                        }}
                    />

                    <label>Choose a topic</label>

                    <select className='border-2 outline-none text-md capitalize'
                            onChange={(e: any) => {
                                setTopic(e.target.value)
                            }}>
                        {topics.map((topic) => (
                            <option
                                value={topic.name}
                                key={topic.name}
                                className='outline-none capitalize bg-white text-gray-700 text-md p-2
                                    hover:bg-slate-300'>
                                {topic.name}
                            </option>))}
                    </select>
                    <div className="flex gap-6 mt-10">
                        <button
                            className='border-gray-300 border-2 text-md font-medium
                            p-2 rounded w-28 lg:w-44 outline-none font-medium'
                            onClick={handleDiscard}>
                            Discard
                        </button>
                        <button
                            type='button'
                            className='bg-[#f51997] text-white text-md font-medium p-2
                            rounded w-28 lg:w-44 outline-none font-medium'
                            onClick={handlePost}>
                            {savingPost? 'Posting...': 'Post'}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Upload;