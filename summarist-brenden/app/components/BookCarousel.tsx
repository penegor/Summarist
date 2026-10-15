"use client";

import Image from "next/image";
import { useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaLightbulb } from "react-icons/fa6";

type Book = {
  id: string;
  author: string;
  title: string;
  subTitle: string;
  imageLink: string;
  averageRating: number;
  keyIdeas: number;
  subscriptionRequired: boolean;
};

export default function BookCarousel({
  books,
  label,
  emptyMessage,
}: {
  books: Book[];
  label: string;
  emptyMessage: string;
}) {
  const carouselRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const firstBook = carousel.querySelector<HTMLElement>(
      ".for-you__recommended--books-link",
    );
    const distance = firstBook
      ? firstBook.offsetWidth + 16
      : carousel.clientWidth * 0.8;
    carousel.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  }

  if (books.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <div className="book-carousel">
      <button
        className="book-carousel__control"
        type="button"
        aria-label={`Scroll ${label} left`}
        onClick={() => scroll("left")}
      >
        <FaChevronLeft aria-hidden="true" />
      </button>
      <div
        className="for-you__recommended--books"
        ref={carouselRef}
        role="region"
        aria-label={label}
        tabIndex={0}
      >
        {books.map((book) => (
          <a
            className="for-you__recommended--books-link"
            href={`/book/${book.id}`}
            key={book.id}
          >
            {book.subscriptionRequired && (
              <div className="book__pill">Premium</div>
            )}
            <figure className="book__image--wrapper" style={{ marginBottom: 8 }}>
              <Image
                className="book__image"
                src={book.imageLink}
                alt={book.title}
                width={180}
                height={180}
                unoptimized
              />
            </figure>
            <div className="recommended__book--title">{book.title}</div>
            <div className="recommended__book--author">{book.author}</div>
            <div className="recommended__book--sub-title">{book.subTitle}</div>
            <div className="recommended__book--details-wrapper">
              <div className="recommended__book--details">
                <div className="recommended__book--details-icon">
                  <FaLightbulb aria-hidden="true" />
                </div>
                <div className="recommended__book--details-text">
                  {book.keyIdeas} key ideas
                </div>
              </div>
              <div className="recommended__book--details">
                <div className="recommended__book--details-icon">
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 1024 1024"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M908.1 353.1l-253.9-36.9L540.7 86.1c-3.1-6.3-8.2-11.4-14.5-14.5-15.8-7.8-35-1.3-42.9 14.5L369.8 316.2l-253.9 36.9c-7 1-13.4 4.3-18.3 9.3a32.05 32.05 0 0 0 .6 45.3l183.7 179.1-43.4 252.9a31.95 31.95 0 0 0 46.4 33.7L512 754l227.1 119.4c6.2 3.3 13.4 4.4 20.3 3.2 17.4-3 29.1-19.5 26.1-36.9l-43.4-252.9 183.7-179.1c5-4.9 8.3-11.3 9.3-18.3 2.7-17.5-9.5-33.7-27-36.3zM664.8 561.6l36.1 210.3L512 672.7 323.1 772l36.1-210.3-152.8-149L417.6 382 512 190.7 606.4 382l211.2 30.7-152.8 148.9z"></path>
                  </svg>
                </div>
                <div className="recommended__book--details-text">
                  {book.averageRating}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
      <button
        className="book-carousel__control"
        type="button"
        aria-label={`Scroll ${label} right`}
        onClick={() => scroll("right")}
      >
        <FaChevronRight aria-hidden="true" />
      </button>
    </div>
  );
}
