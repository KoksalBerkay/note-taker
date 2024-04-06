import Head from "next/head";
import Card from "../components/ui/Card";
import Navbar from "../components/ui/Navbar";

import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const Home = () => {
  const router = useRouter();

  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/notes"
      );
      const data = await response.json();
      setCards(data.data);
      // console.log(data.data);
    };

    fetchCards();
  }, []);

  return (
    <>
      <Navbar />
      <Head>
        <title>NoteTaker</title>
      </Head>
      <main className={`p-24 ${inter.className}`}>
        <h1 className="text-4xl md:text-6xl font-bold text-center">
          Class Summaries
        </h1>
        <hr className="my-10" />
        <div className="space-y-5">
          {cards ? (
            cards.map((card) => (
              <Card
                key={card.id}
                date={card.date}
                summary={card.summary}
                url={`/notes/${card.id}`}
                router={router}
              />
            ))
          ) : (
            <p className="text-center">No summaries yet.</p>
          )}
        </div>
      </main>
    </>
  );
};

export default Home;
