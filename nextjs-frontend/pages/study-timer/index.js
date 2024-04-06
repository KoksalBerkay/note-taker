import React, { useState } from "react";
import TimerNavbar from "../../components/ui/TimerNavbar";

const StudyTimerPage = () => {
  const handleLeftButtonClick = () => {
    console.log("Left Button clicked");
    // Add your custom logic here
  };

  const handleRightButtonClick = () => {
    console.log("Right Button clicked");
    // Add your custom logic here
  };

  const handleStatisticsButtonClick = () => {
    console.log("Statistics Button clicked");
    // Add your custom logic here
  };

  return (
    <div className="flex flex-col h-screen">
      <TimerNavbar />
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="space-y-8 text-center">
          <h1 className="text-3xl font-bold text-blue-500">Stage</h1>
          <div className="text-8xl font-bold text-blue-500">00:00</div>
        </div>
        <div className="flex space-x-8 mt-12">
          <button
            className="bg-blue-500 text-white rounded-full p-6"
            onClick={handleLeftButtonClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
              />
            </svg>
          </button>
          <button
            className="bg-blue-500 text-white rounded-full p-4"
            onClick={handleRightButtonClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z"
              />
            </svg>
          </button>
        </div>
        <div className="mt-12">
          <button
            className="bg-blue-500 text-white px-8 py-4 rounded-md text-xl"
            onClick={handleStatisticsButtonClick}
          >
            📈 Statistics
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyTimerPage;
