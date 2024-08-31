import Head from "next/head";
import Markdown from "react-markdown";
import Navbar from "../../components/ui/Navbar";

import { useRouter } from "next/router";
import { Switch } from "@headlessui/react";
import { useEffect, useState } from "react";

const classNames = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

const Note = () => {
  const router = useRouter();

  const [note, setNote] = useState({});
  const [showTranscript, setShowTranscript] = useState(false);
  const [inputText, setInputText] = useState("");
  const [questions, setQuestions] = useState([]); // Store questions and answers

  const parseDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/notes/${router.query.id}/chat`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch note");
        }
        const data = await response.json();

        // Validate and process the note data
        const noteData = data.data || {};

        // Ensure `questions` and `answers` are arrays
        const questions = Array.isArray(noteData.questions)
          ? noteData.questions
          : [];
        const answers = Array.isArray(noteData.answers) ? noteData.answers : [];

        // Set note data
        setNote(noteData);

        // Combine questions and answers into an array of objects
        const combinedQA = questions.map((question, index) => ({
          question,
          answer: answers[index] || "No answer available.", // Handle missing answers
        }));

        // Update state with questions and answers
        setQuestions(combinedQA);
      } catch (error) {
        console.error("Error fetching note:", error);
      }
    };

    if (router.query.id) {
      fetchNote();
    }
  }, [router.query.id]);

  const pageTitle = router.query.id
    ? `NoteTaker - Note ${router.query.id.toString()}`
    : "NoteTaker";

  const handleSend = async () => {
    if (!inputText.trim()) return;

    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
          "/api/notes/" +
          router.query.id +
          "/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: inputText,
          }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      const data = await response.json();
      setQuestions((prev) => [
        ...prev,
        { question: inputText, answer: data.data.response },
      ]);
      setInputText(""); // Clear the textbox after sending
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <Navbar />
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <main className="p-24">
        {note.date && (
          <>
            <h1 className="text-3xl md:text-5xl font-bold text-center">
              Note from {parseDate(note.date)}
            </h1>
            <hr className="my-10" />
          </>
        )}
        <Switch.Group as="div" className="flex items-center">
          <Switch
            checked={showTranscript}
            onChange={setShowTranscript}
            className={classNames(
              showTranscript ? "bg-blue-600" : "bg-gray-200",
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            )}
          >
            <span
              aria-hidden="true"
              className={classNames(
                showTranscript ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
              )}
            />
          </Switch>
          <Switch.Label as="span" className="ml-3">
            <span className="text-sm font-medium text-gray-900">
              Show Transcript
            </span>
          </Switch.Label>
        </Switch.Group>
        <br />
        <hr />
        <br />
        <div className="grid justify-items-center space-y-5">
          <Markdown className="prose">{note.summary}</Markdown>
        </div>
        <br />
        <hr />
        {showTranscript && (
          <div className="grid justify-items-center space-y-5">
            <br />
            <h1 className="text-4xl font-bold">Transcript</h1>
            <Markdown className="prose">{note.transcript}</Markdown>
          </div>
        )}
        {questions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Chat History</h2>
            <ul>
              {questions.map((qa, index) => (
                <li key={index} className="mb-4">
                  <strong>Q:</strong> {qa.question}
                  <br />
                  <strong>A:</strong> <Markdown>{qa.answer}</Markdown>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      <div className="fixed bottom-0 left-0 w-full bg-white p-2 border-t border-gray-300 shadow-md">
        <div className="flex justify-center">
          <textarea
            className="w-full md:w-1/2 p-2 text-base border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={1}
            placeholder="Type your message here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            className="ml-2 px-4 py-2 bg-blue-600 text-white text-base rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleSend}
            disabled={!inputText.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default Note;
