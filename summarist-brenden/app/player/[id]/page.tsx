import Image from "next/image";
import { notFound } from "next/navigation";
import SummaryAudioPlayer from "../../components/SummaryAudioPlayer";
import SearchBar from "../../components/SearchBar";

type Book = {
  id: string;
  title: string;
  author: string;
  imageLink: string;
  audioLink?: string;
  summary?: string;
};

function isBook(data: unknown): data is Book {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const book = data as Record<string, unknown>;
  return (
    typeof book.id === "string" &&
    typeof book.title === "string" &&
    typeof book.author === "string" &&
    typeof book.imageLink === "string" &&
    (book.audioLink === undefined || typeof book.audioLink === "string") &&
    (book.summary === undefined || typeof book.summary === "string")
  );
}

async function getBook(id: string): Promise<Book> {
  const response = await fetch(
    `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${encodeURIComponent(id)}`,
    { cache: "no-store" },
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(`Unable to load book (${response.status}).`);
  }

  const data: unknown = await response.json();
  if (!isBook(data)) {
    throw new Error("The book service returned an invalid book.");
  }

  return data;
}

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBook(id);

  return (
    <>
      <SearchBar />
      <main className="player-page">
        <section className="player-page__book" aria-labelledby="player-title">
          <Image
            className="player-page__cover"
            src={book.imageLink}
            alt={`Cover of ${book.title}`}
            width={180}
            height={240}
            unoptimized
          />
          <div className="player-page__details">
            <h1 id="player-title" className="audio__book--summary-title">
              {book.title}
            </h1>
            <p className="audio__track--author">{book.author}</p>
          </div>
        </section>

        {book.summary ? (
          <section className="audio__book--summary" aria-labelledby="summary-title">
            <h2 id="summary-title" className="audio__book--summary-title">
              Book summary
            </h2>
            <p className="audio__book--summary-text">{book.summary}</p>
            <SummaryAudioPlayer summary={book.summary} title={book.title} />
          </section>
        ) : (
          <p role="status">A summary is not available for this book.</p>
        )}
      </main>
    </>
  );
}
