import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import Leftbar from "./Leftbar";
import ApiUrl from "../config/LocalConfigApi"
import styled from 'styled-components';
import GetAccountId from "../config/LocalStorage.jsx";
import { GoTag } from "react-icons/go";
import { FaShareAlt, FaSmile } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { MdOutlineFormatLineSpacing, MdOutlineAssessment,
    MdLockOutline
 } from "react-icons/md";
import { FaStreetView } from "react-icons/fa6";
import { BsStars } from "react-icons/bs";
import Rightbar from "./Rightbar.jsx";
import { CiSearch } from "react-icons/ci";
import { RiEmotionFill, RiEmotionNormalFill } from "react-icons/ri";
import { TbMoodCrazyHappyFilled } from "react-icons/tb";
import { PiSmileySadFill } from "react-icons/pi";
import Swal from "sweetalert2";



function Home() {
    const [videoFile, setVideoFile] = useState(null);
    const [previewURL, setPreviewURL] = useState(""); 
    const [loading, setLoading] = useState(false);
    const [viewVideo, setViewVideo] = useState(false);
    const [error, setError] = useState("");
    const [analysisResult, setAnalysisResult] = useState(null); // New state for response data
    const acc_id = GetAccountId();  // Get account ID from
    const [user, setUser] = useState(null);
    const [date, setDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [logs, setLogs] = useState([]);
    const [showLogs, setShowLogs] = useState(false);

    const items_nav = [
        { id: 1, name: "Summary", icon: <MdOutlineFormatLineSpacing /> },
        { id: 2, name: "Impact on Audience", icon: <FaStreetView /> },
        { id: 3, name: "Effective Analysis", icon: <BsStars /> },
        { id: 4, name: "Assessment", icon: <MdOutlineAssessment /> },
        { id: 5, name: "Audience Emotion", icon: <RiEmotionFill /> },
    ]
    const [current_nav, setCurrentNav] = useState(items_nav[0]);
    
    

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.get(`${ApiUrl.apiURL}user/${acc_id}`);
                console.log(response);
                if (response.data) {
                    setUser(response.data);
                }
                window.scrollTo(0, 0);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        setFormattedDate(date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }));
    }, [date]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideoFile(file);
            setViewVideo(!viewVideo);
            setPreviewURL(URL.createObjectURL(file));  // Create a preview URL
        }
    };

    useEffect(() => {
        if (videoFile) {
            setPreviewURL(URL.createObjectURL(videoFile));
        }
    }, [videoFile]);


    const uploadVideo = async () => {
        const formData = new FormData();
        formData.append("video", videoFile);

        try {
            const response = await axios.post(`${ApiUrl.apiURL}upload-video`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data.videoPath;
        } catch (error) {
            throw new Error("Error uploading video");
        }
    };

    const processVideo = async (videoPath) => {
        try {
            const response = await axios.post(`${ApiUrl.apiURL}process-video`, { videoPath });
            console.log(response.data);
            return response.data;  // Return the entire response
        } catch (error) {
            throw new Error("Error processing video");
        }
    };

    const handleSubmit = async () => {
        if (!videoFile) {
            alert("Please select a video file");
            return;
        }

        setLoading(true);
        setError("");
        setAnalysisResult(null);

        Swal.fire({
            title: "Processing Video",
            html: "Please wait while we analyze your video...",
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });
        

        try {
            const videoPath = await uploadVideo();
            const response = await processVideo(videoPath);
            setAnalysisResult(response);  // Store response data
            Swal.close();
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const highlightText = (text, searchQuery) => {
        if (!searchQuery) return text;
    
        // Create a regex pattern to match the search query (case-insensitive)
        const regex = new RegExp(`(${searchQuery})`, "gi");
    
        // Split the text by the regex pattern and wrap matches in a span
        return text.split(regex).map((part, index) =>
            regex.test(part) ? (
                <span key={index} className="bg-yellow-200">{part}</span>
            ) : (
                part
            )
        );
    };
  
    return (
        <div>
            <Navbar user={user} />
            <Leftbar />
            <div className="flex items-center justify-center bg-slate-100">
                <div className="flex flex-col mt-28 mr-28 con-vid" style={{maxWidth: "1200px"}} >
                    {/* File Input */}
                    {!viewVideo ? (
                        <StyledWrapper className=" bg-slate-800 w-full flex items-center justify-center rounded-lg" style={{height: "500px"}}>
                        <div className="input-div">
                            <input className="input" accept="video/*" name="file" type="file"
                            onChange={handleFileChange} />
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" strokeLinejoin="round" strokeLinecap="round" viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor" className="icon"><polyline points="16 16 12 12 8 16" /><line y2={21} x2={12} y1={12} x1={12} /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /><polyline points="16 16 12 12 8 16" /></svg>
                        </div>
                    </StyledWrapper>
                    ) : (
                        <div className="w-full">
                            <video 
                                src={previewURL} 
                                controls 
                                className="w-full mb-4 rounded-lg"
                                style={{height: "500px"}}
                            />
                            <div className="p-4 bg-slate-200 shadow-sm flex items-center justify-between rounded-lg">
                                <p className="text-sm text-gray-500">Selected Video: {videoFile.name}</p>
                                {/* remove */}
                                <div>
                                    <button 
                                        onClick={() => {
                                            setVideoFile(null);
                                            setViewVideo(!viewVideo);
                                        }} 
                                        className="text-white bg-red-500 px-4 py-2 
                                        rounded text-sm" 
                                    >
                                        Remove
                                    </button>
                                    <button 
                                        onClick={handleSubmit} 
                                        disabled={loading} 
                                        className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400 text-sm ml-2"
                                    >
                                        {loading ? "Processing..." : "Process Video"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 mt-8 mb-5">
                            <div className="py-4 px-6 bg-sky-600 rounded-full text-center text-white text-lg w-12 h-12 flex items-center justify-center">
                                {user && <>{user.acc_email.substring(0, 2).toLowerCase()}</>}
                            </div>

                            <div className="leading-8 text-gray-600 font-extralight text-sm">
                                <p>{user && user.acc_email}</p>
                                <p className="text-xs">{formattedDate}</p>
                            </div>

                            <div className="flex items-center gap-2 text-gray-600 font-extralight text-base">
                                <GoTag />
                                <p>Video Analyzer</p>
                            </div>

                            <div className="flex items-center gap-1 text-gray-600 font-extralight text-base">
                                <MdLockOutline />
                                <p>Private</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="bg-blue-500 flex items-center gap-2 text-white px-5 py-3 rounded text-sm hover:bg-blue-600">
                                <FaShareAlt /> Share
                            </button>

                            <button className="bg-white flex items-center gap-2 text-gray-500 px-5 py-3 rounded text-sm ml-2 hover:bg-gray-100 hover:text-gray-700">
                                <FiDownload /> Download
                            </button>
                        </div>
                    </div>

                    <div className="bg-white px-4 pt-4 pb-4 rounded-lg mb-10">
                        <div className="flex items-center border-b border-b-gray-400 gap-4">
                            {items_nav.map((item) => (
                                <div key={item.id} className={`flex items-center pb-2 gap-2 cursor-pointer ${current_nav.id === item.id ? "text-blue-500 border-b-2 border-b-blue-500" : "text-gray-500"}`} onClick={() => setCurrentNav(item)}>
                                    {item.icon}
                                    <p>{item.name}</p>
                                </div>
                            ))}
                        </div>
                        
                        <div className="border-b border-b-gray-400 pb-2">
                            <div className="mt-3 w-full flex items-center gap-3 bg-gray-100 p-3 rounded-full focus-within:ring-1 focus-within:ring-gray-300">
                                <CiSearch className="text-gray-800 text-xl" />
                                <input 
                                    type="text" 
                                    className="w-full bg-transparent outline-none p-1 text-gray-700 placeholder-gray-400" 
                                    name="search" 
                                    id="search" 
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        {/* result */}
                        <div style={{height: "550px", maxHeight:"550px"}} className="overflow-y-auto">
                            {!analysisResult && (
                                <div className="mt-2 w-full p-4 text-start">
                                    <h2 className="text-lg font-medium mb-4">
                                        Analysis Result
                                    </h2>
                                    <p
                                    className="font-light leading-7 text-gray-500" style={{fontSize: "15px"}}>No analysis result available</p>
                                </div>
                            )}
                            {analysisResult && current_nav.id === 1 && (
                                <div className="mt-2 w-full p-4 text-start">
                                    <h2 className="text-lg font-medium mb-4">
                                        {highlightText(analysisResult.summary.summary.title, searchQuery)}
                                    </h2>
                                    <p className="font-light leading-7 text-gray-500" style={{ fontSize: "15px" }}>
                                        {highlightText(analysisResult.summary.summary.content, searchQuery)}
                                    </p>
                                </div>
                            )}

                            {analysisResult && current_nav.id === 2 && (
                                <div className="mt-2 w-full p-4 text-start">
                                    <h2 className="text-lg font-medium mb-4">
                                        {highlightText(analysisResult.summary.impact.title, searchQuery)}
                                    </h2>
                                    <p className="font-light leading-7 text-gray-500" style={{ fontSize: "15px" }}>
                                        {highlightText(analysisResult.summary.impact.content, searchQuery)}
                                    </p>
                                </div>
                            )}

                            {analysisResult && current_nav.id === 3 && (
                                <div className="mt-2 w-full p-4 text-start">
                                    <h2 className="text-lg font-medium mb-4">
                                        {highlightText(analysisResult.summary.advertisement_effectiveness.title, searchQuery)}
                                    </h2>
                                    <p className="font-light leading-7 text-gray-500" style={{ fontSize: "15px" }}>
                                        {highlightText(analysisResult.summary.advertisement_effectiveness.content, searchQuery)}
                                    </p>

                                    <h2 className="text-lg font-medium mt-4">
                                        {highlightText(analysisResult.summary.visual_appeal.title, searchQuery)}
                                    </h2>
                                    <p className="font-light leading-7 text-gray-500" style={{ fontSize: "15px" }}>
                                        {highlightText(analysisResult.summary.visual_appeal.content, searchQuery)}
                                    </p>
                                </div>
                            )}

                            {analysisResult && current_nav.id === 4 && (
                                <div className="mt-2 w-full p-4 text-start">
                                    <h2 className="text-lg font-medium mb-4">
                                        {highlightText(analysisResult.summary.overall_assessment.title, searchQuery)}
                                    </h2>
                                    <p className="font-light leading-7 text-gray-500" style={{ fontSize: "15px" }}>
                                        {highlightText(analysisResult.summary.overall_assessment.content, searchQuery)}
                                    </p>
                                </div>
                            )}

                            {analysisResult && current_nav.id === 5 && (
                                <div className="mt-2 w-full p-4 text-start">
                                    <h2 className="text-lg font-medium mb-10">
                                        Possible Audience Emotions
                                    </h2>
                                    <div className="flex items-center justify-center gap-16 text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <RiEmotionFill className="text-5xl text-green-500" />
                                            <p>Happy</p>
                                            <p>
                                                {highlightText(analysisResult.summary.viewer_emotions.content.Happy, searchQuery)}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <RiEmotionNormalFill className="text-5xl text-yellow-500" />
                                            <p>Neutral</p>
                                            <p>
                                                {highlightText(analysisResult.summary.viewer_emotions.content.Neutral, searchQuery)}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <TbMoodCrazyHappyFilled className="text-5xl text-blue-500" />
                                            <p>Excited</p>
                                            <p>
                                                {highlightText(analysisResult.summary.viewer_emotions.content.Excited, searchQuery)}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <PiSmileySadFill className="text-5xl text-red-500" />
                                            <p>Sad</p>
                                            <p>
                                                {highlightText(analysisResult.summary.viewer_emotions.content.Sad, searchQuery)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-10">
                                        <h2 className="text-lg font-medium mb-4">
                                            Reasoning:
                                        </h2>
                                        <p className="font-light leading-7 mb-4 text-gray-500" style={{ fontSize: "15px" }}>
                                            <strong className="text-gray-700">Happy: </strong>
                                            {highlightText(analysisResult.summary.viewer_emotions.reason.Happy, searchQuery)}
                                        </p>
                                        <p className="font-light leading-7 mb-4 text-gray-500" style={{ fontSize: "15px" }}>
                                            <strong className="text-gray-700">Neutral: </strong>
                                            {highlightText(analysisResult.summary.viewer_emotions.reason.Neutral, searchQuery)}
                                        </p>
                                        <p className="font-light leading-7 mb-4 text-gray-500" style={{ fontSize: "15px" }}>
                                            <strong className="text-gray-700">Excited: </strong>
                                            {highlightText(analysisResult.summary.viewer_emotions.reason.Excited, searchQuery)}
                                        </p>
                                        <p className="font-light leading-7 text-gray-500" style={{ fontSize: "15px" }}>
                                            <strong className="text-gray-700">Sad: </strong>
                                            {highlightText(analysisResult.summary.viewer_emotions.reason.Sad, searchQuery)}
                                        </p>
                                    </div>
                                </div>
                            )}


                        </div>
                    </div>


                    {/* Error Message */}
                    {error && <p className="text-red-500 mt-2">{error}</p>}

                </div>
            </div>
            <Rightbar user={user} analysisResult={analysisResult} />
        </div>
    );
}

const StyledWrapper = styled.div`
  .input-div {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 2px solid rgb(1, 235, 252);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    box-shadow: 0px 0px 100px rgb(1, 235, 252) , inset 0px 0px 10px rgb(1, 235, 252),0px 0px 5px rgb(255, 255, 255);
    animation: flicker 2s linear infinite;
  }

  .icon {
    color: rgb(1, 235, 252);
    font-size: 2rem;
    cursor: pointer;
    animation: iconflicker 2s linear infinite;
  }

  .input {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer !important;
  }

  @keyframes flicker {
    0% {
      border: 2px solid rgb(1, 235, 252);
      box-shadow: 0px 0px 100px rgb(1, 235, 252) , inset 0px 0px 10px rgb(1, 235, 252),0px 0px 5px rgb(255, 255, 255);
    }

    5% {
      border: 2px solid transparent;
      box-shadow: none;
    }

    10% {
      border: 2px solid rgb(1, 235, 252);
      box-shadow: 0px 0px 100px rgb(1, 235, 252) , inset 0px 0px 10px rgb(1, 235, 252),0px 0px 5px rgb(255, 255, 255);
    }

    25% {
      border: 2px solid transparent;
      box-shadow: none;
    }

    30% {
      border: 2px solid rgb(1, 235, 252);
      box-shadow: 0px 0px 100px rgb(1, 235, 252) , inset 0px 0px 10px rgb(1, 235, 252),0px 0px 5px rgb(255, 255, 255);
    }

    100% {
      border: 2px solid rgb(1, 235, 252);
      box-shadow: 0px 0px 100px rgb(1, 235, 252) , inset 0px 0px 10px rgb(1, 235, 252),0px 0px 5px rgb(255, 255, 255);
    }
  }

  @keyframes iconflicker {
    0% {
      opacity: 1;
    }

    5% {
      opacity: 0.2;
    }

    10% {
      opacity: 1;
    }

    25% {
      opacity: 0.2;
    }

    30% {
      opacity: 1;
    }

    100% {
      opacity: 1;
    }
  }`;

export default Home;
