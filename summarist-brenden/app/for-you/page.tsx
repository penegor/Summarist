import Image from "next/image";
import SearchBar from "../components/SearchBar";
import BookCarousel from "../components/BookCarousel";

type Book = {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  type: string;
  averageRating: number;
  keyIdeas: number;
  subscriptionRequired: boolean;
};

async function getBooks(
  status: "selected" | "recommended" | "suggested",
): Promise<Book[]> {
  try {
    const response = await fetch(
      `https://us-central1-summaristt.cloudfunctions.net/getBooks?status=${status}`,
      { cache: "no-store" },
    );

    if (!response.ok) return [];

    const data: Book[] | { value?: Book[] } = await response.json();
    return Array.isArray(data) ? data : data.value ?? [];
  } catch {
    return [];
  }
}

function BookCards({
  books,
  label,
  emptyMessage,
}: {
  books: Book[];
  label: string;
  emptyMessage: string;
}) {
  return (
    <BookCarousel
      books={books}
      label={label}
      emptyMessage={emptyMessage}
    />
  );
}

export default async function ForYou() {
  const [selectedBooks, recommendedBooks, suggestedBooks] = await Promise.all([
    getBooks("selected"),
    getBooks("recommended"),
    getBooks("suggested"),
  ]);
  const selectedBook = selectedBooks[0];

  return (
    <>
      <div id="__next">
        <div className="wrapper">
          <SearchBar />
          <div className="row">
            <div className="container">
              <div className="for-you__wrapper">
                <div className="for-you__title">Selected just for you</div>
                {selectedBook ? (
                  <a href={`/book/${selectedBook.id}`} className="selected__book">
                    {selectedBook.subscriptionRequired && (
                      <div className="book__pill">Premium</div>
                    )}
                    <div className="selected__book--sub-title">
                      {selectedBook.subTitle}
                    </div>
                    <div className="selected__book--line"></div>
                    <div className="selected__book--content">
                      <figure
                        className="book__img--wrapper"
                      >
                        <Image
                          src={selectedBook.imageLink}
                          alt={selectedBook.title}
                          className="book__image"
                          width={140}
                          height={180}
                          unoptimized
                        />
                      </figure>
                      <div className="selected__book--text">
                        <div className="selected__book--title">
                          {selectedBook.title}
                        </div>
                        <div className="selected__book--author">
                          {selectedBook.author}
                        </div>
                        <div className="selected__book--duration-wrapper">
                          <div className="selected__book--icon">
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth="0"
                              viewBox="0 0 16 16"
                              height="1em"
                              width="1em"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                            </svg>
                          </div>
                          <div className="selected__book--duration">
                            {selectedBook.type}
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                ) : (
                  <div className="selected__book">
                    Selected book is currently unavailable.
                  </div>
                )}
                <div>
                  <div className="for-you__title">Recommended For You</div>
                  <div className="for-you__sub--title">
                    We think you&apos;ll love these
                  </div>
                  <BookCards
                    books={recommendedBooks}
                    label="Recommended books"
                    emptyMessage="Recommended books are currently unavailable."
                  />
                </div>
                <div>
                  <div className="for-you__title">Suggested Books</div>
                  <div className="for-you__sub--title">Browse those books</div>
                  <BookCards
                    books={suggestedBooks}
                    label="Suggested books"
                    emptyMessage="Suggested books are currently unavailable."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
