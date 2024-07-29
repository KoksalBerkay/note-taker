import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/router";
import { Disclosure } from "@headlessui/react";
import { MicrophoneIcon } from "@heroicons/react/20/solid";
import { Bars3Icon, XMarkIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import toast, { Toaster } from "react-hot-toast";

const Navbar = () => {
  const router = useRouter();

  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef(null);

  const startRecording = async () => {
    setIsRecording(true);

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/notes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "start",
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message);
    } else {
      if (router.pathname === "/") {
        router.reload();
      } else {
        router.push("/");
      }
    }
    setIsRecording(false);
  };

  const stopRecording = async () => {
    setIsRecording(false);

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/notes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "stop",
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message);
    } else {
      toast.success("Audio recording stopped successfully.");
    }
  };

  const handleUploadClick = () => {
    // Click the file picker
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/upload-audio",
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      toast.error(errorData.message);
    } else {
      toast.success("Audio file uploaded successfully.");
      if (router.pathname === "/") {
        router.reload();
      } else {
        router.push("/");
      }
    }
  };

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div
                  onClick={() => {
                    router.push("/");
                  }}
                  className="flex flex-shrink-0 items-center cursor-pointer"
                ></div>
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  <Link
                    href="/"
                    className="inline-flex items-center border-b-2 border-blue-500 px-1 pt-1 text-sm font-medium text-gray-900"
                  >
                    See Summaries
                  </Link>
                  <Link
                    href="/study-timer"
                    className="inline-flex items-center border-b-2 border-blue-500 px-1 pt-1 text-sm font-medium text-gray-900"
                  >
                    Study Timer
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="relative inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 mr-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-upload mr-2"
                      viewBox="0 0 16 16"
                    >
                      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                      <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
                    </svg>

                    <span>Upload</span>
                  </button>
                  {isRecording ? (
                    <button
                      type="button"
                      onClick={stopRecording}
                      className="relative inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      <XCircleIcon
                        className="-ml-1 mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                      <span>Stop</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={startRecording}
                      className="relative inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <MicrophoneIcon
                        className="-ml-1 mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                      <span>Record</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {}
              <Disclosure.Button
                as="a"
                href="/"
                className="block border-l-4 border-blue-500 bg-blue-50 py-2 pl-3 pr-4 text-base font-medium text-blue-700 sm:pl-5 sm:pr-6"
              >
                See Summaries
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="/study-timer"
                className="block border-l-4 border-blue-500 bg-blue-50 py-2 pl-3 pr-4 text-base font-medium text-blue-700 sm:pl-5 sm:pr-6"
              >
                Study Timer
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>

          <Toaster
            position="bottom-left"
            toastOptions={{ style: { fontSize: "1.25rem" } }}
          />
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
