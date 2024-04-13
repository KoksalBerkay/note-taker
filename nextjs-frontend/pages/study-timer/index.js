import React, { useState, useEffect } from "react";
import TimerNavbar from "../../components/ui/TimerNavbar";

const StudyTimerPage = () => {
  const [isPauseButtonActive, setIsPauseButtonActive] = useState(false);
  const [stage, setStage] = useState("work");
  const [isStatisticsOpen, setIsStatisticsOpen] = useState(false);

  // Pause button resets when stage changes
  useEffect(() => {
    setIsPauseButtonActive(false);
  }, [stage]);

  const handlePauseButtonClick = () => {
    setIsPauseButtonActive((prevState) => !prevState);
    toggleButtonRingEffect("pauseButton");
  };

  const handleNextButtonClick = () => {
    setStage((prevStage) => (prevStage === "work" ? "break" : "work"));
    toggleButtonRingEffect("nextButton");
  };

  const handleStatisticsButtonClick = () => {
    setIsStatisticsOpen((prevState) => !prevState);
    toggleButtonRingEffect("statisticsButton");
  };

  const toggleButtonRingEffect = (buttonId) => {
    const button = document.getElementById(buttonId);
    button.classList.toggle("ring-2");
    if (stage === "break") {
      button.classList.toggle("ring-green-600");
    } else {
      button.classList.toggle("ring-blue-600");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <TimerNavbar />
      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="space-y-8 text-center">
          <h1
            className={`text-3xl font-bold ${
              stage === "work" ? "text-blue-500" : "text-green-500"
            }`}
          >
            {stage === "work" ? "Work" : "Break"} Stage
          </h1>
          <div
            className={`text-8xl font-bold ${
              stage === "work" ? "text-blue-500" : "text-green-500"
            }`}
          >
            00:00
          </div>
        </div>
        <div className="flex space-x-8 mt-12">
          <button
            id="pauseButton"
            className={`bg-blue-500 text-white rounded-full p-6 transition hover:bg-blue-600 ${
              stage === "break" && "bg-green-500 hover:bg-green-600"
            }`}
            onClick={handlePauseButtonClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              {isPauseButtonActive ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                />
              )}
            </svg>
          </button>
          <button
            id="nextButton"
            // className="bg-blue-500 text-white rounded-full p-4 transition hover:bg-blue-600"
            className={`bg-blue-500 text-white rounded-full p-4 transition hover:bg-blue-600 ${
              stage === "break" && "bg-green-500 hover:bg-green-600"
            }`}
            onClick={handleNextButtonClick}
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
            id="statisticsButton"
            className={`bg-blue-500 text-white px-8 py-4 rounded-md text-xl transition hover:bg-blue-600 ${
              stage === "break" && "bg-green-500 hover:bg-green-600"
            }`}
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
