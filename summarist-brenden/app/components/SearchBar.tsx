"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";
import logo from "../../public/logo.png";

type SearchBook = {
  id: string;
  title: string;
  author: string;
  imageLink: string;
};

type SearchState = {
  query: string;
  status: "success" | "error";
  results?: SearchBook[];
  errorMessage?: string;
};

let searchableBooksRequest: Promise<SearchBook[]> | undefined;

function isSearchBook(value: unknown): value is SearchBook {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const book = value as Record<string, unknown>;
  return (
    typeof book.id === "string" &&
    typeof book.title === "string" &&
    typeof book.author === "string" &&
    typeof book.imageLink === "string"
  );
}

async function fetchSearchableBooks(): Promise<SearchBook[]> {
  const statuses = ["selected", "recommended", "suggested"] as const;
  const responses = await Promise.all(
    statuses.map((status) =>
      fetch(
        `https://us-central1-summaristt.cloudfunctions.net/getBooks?status=${status}`,
      ),
    ),
  );

  const booksById = new Map<string, SearchBook>();

  for (const response of responses) {
    if (!response.ok) {
      throw new Error(`Book search failed (${response.status}).`);
    }

    const data: unknown = await response.json();
    const books =
      Array.isArray(data)
        ? data
        : typeof data === "object" && data !== null && "value" in data
          ? (data as { value?: unknown }).value
          : undefined;

    if (!Array.isArray(books) || !books.every(isSearchBook)) {
      throw new Error("Book search returned an invalid result.");
    }

    for (const book of books) {
      booksById.set(book.id, book);
    }
  }

  return Array.from(booksById.values());
}

function getSearchableBooks(): Promise<SearchBook[]> {
  if (!searchableBooksRequest) {
    searchableBooksRequest = fetchSearchableBooks().catch((error: unknown) => {
      searchableBooksRequest = undefined;
      throw error;
    });
  }

  return searchableBooksRequest;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [searchState, setSearchState] = useState<SearchState | null>(null);
  const normalizedQuery = query.trim().toLocaleLowerCase();

  useEffect(() => {
    let isCurrentSearch = true;

    if (!normalizedQuery) {
      return () => {
        isCurrentSearch = false;
      };
    }

    getSearchableBooks()
      .then((books) => {
        if (isCurrentSearch) {
          setSearchState({
            query: normalizedQuery,
            status: "success",
            results: books
              .filter((book) =>
                book.title.toLocaleLowerCase().includes(normalizedQuery),
              )
              .slice(0, 8),
          });
        }
      })
      .catch((error: unknown) => {
        if (isCurrentSearch) {
          setSearchState({
            query: normalizedQuery,
            status: "error",
            errorMessage:
              error instanceof Error
                ? error.message
                : "Unable to search books. Please try again.",
          });
        }
      });

    return () => {
      isCurrentSearch = false;
    };
  }, [normalizedQuery]);

  const hasMatchingSearchState = searchState?.query === normalizedQuery;
  const isLoading = Boolean(normalizedQuery) && !hasMatchingSearchState;
  const results =
    hasMatchingSearchState && searchState.status === "success"
      ? searchState.results ?? []
      : [];
  const errorMessage =
    hasMatchingSearchState && searchState.status === "error"
      ? searchState.errorMessage
      : undefined;

  return (
    <header className="search__background">
      <div className="search__wrapper">
        <Link href="/for-you" aria-label="Summarist home">
          <div
            className="book-detail__logo">
          </div>
        </Link>
        <div className="search__content">
          <label className="search__input--wrapper">
            <input
              className="search__input"
              placeholder="Search for Books"
              type="search"
              role="combobox"
              aria-autocomplete="list"
              aria-label="Search books by title"
              aria-expanded={Boolean(normalizedQuery)}
              aria-controls="book-search-results"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <span className="search__icon" aria-hidden="true">
              <AiOutlineSearch />
            </span>
          </label>
          {normalizedQuery && (
            <div
              id="book-search-results"
              className="search__results"
              role="listbox"
              aria-label="Book search results"
            >
              {isLoading ? (
                <p className="search__results-message">Searching books...</p>
              ) : errorMessage ? (
                <p className="search__results-message" role="alert">
                  {errorMessage}
                </p>
              ) : results.length > 0 ? (
                results.map((book) => (
                  <Link
                    className="search__result"
                    href={`/book/${book.id}`}
                    key={book.id}
                    role="option"
                    aria-selected="false"
                    onClick={() => setQuery("")}
                  >
                    <Image
                      src={book.imageLink}
                      alt=""
                      width={48}
                      height={64}
                      unoptimized
                    />
                    <span>
                      <span className="search__result-title">{book.title}</span>
                      <span className="search__result-author">{book.author}</span>
                    </span>
                  </Link>
                ))
              ) : (
                <p className="search__results-message">No books found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
