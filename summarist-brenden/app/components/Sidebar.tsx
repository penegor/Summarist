"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import {
  AiFillHome,
  AiOutlineBook,
  AiOutlineClose,
  AiOutlineHighlight,
  AiOutlineLogout,
  AiOutlineMenu,
  AiOutlineQuestionCircle,
  AiOutlineSearch,
  AiOutlineSetting,
} from "react-icons/ai";
import { auth } from "../firebase";
import logo from "../../public/logo.png";

export default function Sidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError("");

    try {
      await signOut(auth);
      setIsOpen(false);
      router.replace("/");
    } catch (error) {
      setLogoutError(
        error instanceof Error
          ? error.message
          : "Unable to log out. Please try again.",
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className="sidebar__toggle--btn"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="main-sidebar"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <AiOutlineClose aria-hidden="true" /> : <AiOutlineMenu aria-hidden="true" />}
      </button>
      <div
        className={`sidebar__overlay${isOpen ? "" : " sidebar__overlay--hidden"}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <aside
        id="main-sidebar"
        className={`sidebar${isOpen ? " sidebar--opened" : " sidebar--closed"}`}
        aria-label="Main sidebar"
      >
        <div className="sidebar__logo">
          <Image src={logo} alt="Summarist" width={495} height={114} />
        </div>
        <div className="sidebar__wrapper">
          <div className="sidebar__top">
            <Link className="sidebar__link--wrapper" href="/for-you" onClick={() => setIsOpen(false)}>
              <div className="sidebar__link--line active--tab" />
              <div className="sidebar__icon--wrapper">
                <AiFillHome aria-hidden="true" />
              </div>
              <div className="sidebar__link--text">For you</div>
            </Link>
            <div
              className="sidebar__link--wrapper sidebar__link--not-allowed"
              aria-disabled="true"
            >
              <div className="sidebar__link--line" />
              <div className="sidebar__icon--wrapper">
                <AiOutlineBook aria-hidden="true" />
              </div>
              <div className="sidebar__link--text">My Library</div>
            </div>
            <div
              className="sidebar__link--wrapper sidebar__link--not-allowed"
              aria-disabled="true"
            >
              <div className="sidebar__link--line" />
              <div className="sidebar__icon--wrapper">
                <AiOutlineHighlight aria-hidden="true" />
              </div>
              <div className="sidebar__link--text">Highlights</div>
            </div>
            <div
              className="sidebar__link--wrapper sidebar__link--not-allowed"
              aria-disabled="true"
            >
              <div className="sidebar__link--line" />
              <div className="sidebar__icon--wrapper">
                <AiOutlineSearch aria-hidden="true" />
              </div>
              <div className="sidebar__link--text">Search</div>
            </div>
          </div>
          <div className="sidebar__bottom">
            {logoutError && (
              <p className="sidebar__logout-error" role="alert">
                {logoutError}
              </p>
            )}
            <Link className="sidebar__link--wrapper" href="/settings" onClick={() => setIsOpen(false)}>
              <div className="sidebar__link--line" />
              <div className="sidebar__icon--wrapper">
                <AiOutlineSetting aria-hidden="true" />
              </div>
              <div className="sidebar__link--text">Settings</div>
            </Link>
            <div
              className="sidebar__link--wrapper sidebar__link--not-allowed"
              aria-disabled="true"
            >
              <div className="sidebar__link--line" />
              <div className="sidebar__icon--wrapper">
                <AiOutlineQuestionCircle aria-hidden="true" />
              </div>
              <div className="sidebar__link--text">Help &amp; Support</div>
            </div>
            <button
              type="button"
              className="sidebar__link--wrapper sidebar__logout-button"
              onClick={() => void handleLogout()}
              disabled={isLoggingOut}
            >
              <div className="sidebar__link--line" />
              <div className="sidebar__icon--wrapper">
                <AiOutlineLogout aria-hidden="true" />
              </div>
              <div className="sidebar__link--text">
                {isLoggingOut ? "Logging out..." : "Logout"}
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}