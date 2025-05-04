import React, { useState, useEffect, useRef } from 'react';
import logo from '../../assets/logo.svg';
import Swal from 'sweetalert2';
import axios from 'axios';
import ApiConfig from '../config/LocalConfigApi';
import styled from 'styled-components';


// Styled component for the typing indicator
const StyledWrapper = styled.div`
  .typing-indicator {
    width: 60px;
    height: 30px;
    position: relative;
    z-index: 4;
  }

  .typing-circle {
    width: 8px;
    height: 8px;
    position: absolute;
    border-radius: 50%;
    background-color: #000;
    left: 15%;
    transform-origin: 50%;
    animation: typing-circle7124 0.5s alternate infinite ease;
  }

  @keyframes typing-circle7124 {
    0% {
      top: 20px;
      height: 5px;
      border-radius: 50px 50px 25px 25px;
      transform: scaleX(1.7);
    }

    40% {
      height: 8px;
      border-radius: 50%;
      transform: scaleX(1);
    }

    100% {
      top: 0%;
    }
  }

  .typing-circle:nth-child(2) {
    left: 45%;
    animation-delay: 0.2s;
  }

  .typing-circle:nth-child(3) {
    left: auto;
    right: 15%;
    animation-delay: 0.3s;
  }

  .typing-shadow {
    width: 5px;
    height: 4px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 30px;
    transform-origin: 50%;
    z-index: 3;
    left: 15%;
    filter: blur(1px);
    animation: typing-shadow046 0.5s alternate infinite ease;
  }

  @keyframes typing-shadow046 {
    0% {
      transform: scaleX(1.5);
    }

    40% {
      transform: scaleX(1);
      opacity: 0.7;
    }

    100% {
      transform: scaleX(0.2);
      opacity: 0.4;
    }
  }

  .typing-shadow:nth-child(4) {
    left: 45%;
    animation-delay: 0.2s;
  }

  .typing-shadow:nth-child(5) {
    left: auto;
    right: 15%;
    animation-delay: 0.3s;
  }
`;

function Rightbar({ user, analysisResult }) {
  const conversationContainerRef = useRef(null);
  const [convo, setConvo] = useState({
    messages: [
      {
        title: "You are an AI that analyzes video insights.",
        response: "Analyze this video data: ",
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(false); // State to track loading

  // Scroll to the bottom of the conversation container whenever messages change
  useEffect(() => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
    }
  }, [convo.messages]); // Trigger effect when `convo.messages` changes

  if (user === null) {
    return <div></div>;
  }

  const contents = [
    {
      title: 'Key Statistics',
      description: 'Extract any statistics mentioned in the video, such as numbers, percentages, etc.',
    },
    {
      title: 'Target Audience',
      description: 'Identify the target audience for the video. This could be based on the language, tone, or content of the video.',
    },
    {
      title: 'Key Points',
      description: 'Extract the key points made in the video. This could be a list of topics, ideas, or arguments.',
    },
    {
      title: 'Potential Improvements',
      description: 'Suggest potential improvements to the video. This could be based on the content, delivery, or presentation.',
    },
  ];

  const processResponse = async (title, description, analysisResult) => {
    try {
      const response = await axios.post(`${ApiConfig.apiURL}processPrompt`, {
        title,
        description,
        analysisResult,
      });
      return response.data;
    } catch (error) {
      alert('Error in fetching data');
      console.log(error);
    }
  };

  const handleClick = async (content) => {
    if (analysisResult === null) {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Please get a result first!',
      });
      return;
    }

    // Add the clicked title to the conversation immediately
    setConvo((prevConvo) => ({
      messages: [
        ...prevConvo.messages,
        {
          title: content.title,
          response: null, // Set response to null initially
        },
      ],
    }));

    setIsLoading(true); // Start loading

    try {
      const responseData = await processResponse(content.title, content.description, analysisResult);
      console.log('Response: ', responseData);

      // Update the conversation with the API response
      setConvo((prevConvo) => {
        const updatedMessages = prevConvo.messages.map((message, index) => {
          if (index === prevConvo.messages.length - 1) {
            const { response } = responseData;
            return {
              ...message,
              response: response,
            };
          }
          return message;
        });

        return {
          messages: updatedMessages,
        };
      });
    } catch (error) {
      alert('Error in fetching data');
      console.log(error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="w-96 shadow-md fixed top-24 right-0 bottom-0 pb-6 bg-white rounded-l-lg p-4 overflow-auto">
      <div className="flex flex-col gap-4 items-center h-full">
        <h1 className="text-xl font-normal text-gray-600 py-4">What can I help with?</h1>

        {contents.map((content, index) => (
          <div
            className="bg-gray-100 bg-opacity-60 cursor-pointer text-gray-800 px-4 py-3 rounded-lg w-full h-12 overflow-hidden div_hov"
            key={index}
            onClick={() => handleClick(content)}
          >
            <div className="title_hov">{content.title}</div>
            <div className="text-xs leading-6 text-gray-500 font-light">{content.description}</div>
          </div>
        ))}

        {/* Conversation Box */}
        <div className="h-96 overflow-y-auto w-full" ref={conversationContainerRef}>
          {convo.messages.map((message, index) => (
            <div className="flex flex-col gap-6 w-full mt-10" key={index}>
              {/* User Message */}
              <div className="flex w-full gap-2">
                <div className="flex w-full gap-2">
                  <div className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full text-sm mt-4">
                    {message.title}
                  </div>
                  <div className="bg-sky-600 rounded-full text-center text-white text-sm w-6 p-4 h-6 flex items-center justify-center">
                    {user.acc_email.substring(0, 2).toLowerCase()}
                  </div>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex w-full gap-2">
                <div>
                  <img src={logo} alt="logo" className="w-8 h-8" />
                </div>
                <div className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg w-full text-sm mt-4">
                  {message.response === null ? (
                    <StyledWrapper>
                      <div className="typing-indicator">
                        <div className="typing-circle" />
                        <div className="typing-circle" />
                        <div className="typing-circle" />
                        <div className="typing-shadow" />
                        <div className="typing-shadow" />
                        <div className="typing-shadow" />
                      </div>
                    </StyledWrapper>
                  ) : (
                    <div>
                      <div className='leading-6'
                        dangerouslySetInnerHTML={{ __html: message.response }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Rightbar;