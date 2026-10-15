import Image from "next/image";
import { notFound } from "next/navigation";
import SearchBar from "../../components/SearchBar";
import BookActions from "../../components/BookActions";

type Book = {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  audioLink?: string;
  averageRating?: number;
  totalRating?: number;
  keyIdeas?: number;
  type?: string;
  tags?: string[];
  summary?: string;
  bookDescription?: string;
  authorDescription?: string;
  subscriptionRequired?: boolean;
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
    typeof book.subTitle === "string" &&
    typeof book.imageLink === "string"
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

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBook(id);
  const description = book.bookDescription ?? book.summary;

  return (
    <>
      <SearchBar />
      <div className="row">
        <div className="container">
          <div className="inner__wrapper">
          <article className="inner__book">
            <h1 className="inner-book__title">{book.title}</h1>
            <div className="inner-book__author">{book.author}</div>
            <p className="inner-book__sub--title">{book.subTitle}</p>

            <div className="inner-book__wrapper">
              <div className="inner-book__description--wrapper">
                {book.averageRating !== undefined && (
                  <div className="inner-book__description">
                    <span aria-hidden="true">★</span>
                    <span>
                      {book.averageRating}
                      {book.totalRating !== undefined &&
                        ` (${book.totalRating} ratings)`}
                    </span>
                  </div>
                )}
                {book.type && (
                  <div className="inner-book__description">{book.type}</div>
                )}
                {book.keyIdeas !== undefined && (
                  <div className="inner-book__description">
                    {book.keyIdeas} key ideas
                  </div>
                )}
              </div>
            </div>

            <BookActions
              bookId={book.id}
              isPremium={book.subscriptionRequired === true}
              hasAudio={Boolean(book.audioLink)}
            />

            {book.audioLink && !book.subscriptionRequired && (
              <audio
                id="audio"
                className="book-detail__audio"
                controls
                preload="none"
                src={book.audioLink}
              >
                Your browser does not support audio playback.
              </audio>
            )}

            <section id="summary">
              <h2 className="inner-book__secondary--title">What&apos;s it about?</h2>
              {book.tags && book.tags.length > 0 && (
                <div className="inner-book__tags--wrapper">
                  {book.tags.map((tag) => (
                    <span className="inner-book__tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {description && (
                <p className="inner-book__book--description book-detail__text">
                  {description}
                </p>
              )}
            </section>

            {book.authorDescription && (
              <section>
                <h2 className="inner-book__author--title">About the author</h2>
                <p className="inner-book__author--description book-detail__text">
                  {book.authorDescription}
                </p>
              </section>
            )}
          </article>

          <figure className="inner-book--img-wrapper">
            <Image
              className="book__image"
              src={book.imageLink}
              alt={book.title}
              width={300}
              height={300}
              unoptimized
            />
          </figure>
          </div>
        </div>
      </div>
    </>
  );
}
