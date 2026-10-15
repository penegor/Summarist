"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FaBackward, FaForward, FaPause, FaPlay, FaStop } from "react-icons/fa";

const WORDS_PER_MINUTE = 165;
const WORDS_PER_CHUNK = 40;
const SKIP_SECONDS = 15;

type PlaybackState = "idle" | "playing" | "paused" | "ended";

function formatTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function estimateDuration(wordCount: number) {
  return (wordCount / WORDS_PER_MINUTE) * 60;
}

export default function SummaryAudioPlayer({
  summary,
  title,
}: {
  summary: string;
  title: string;
}) {
  const words = useMemo(() => summary.trim().split(/\s+/).filter(Boolean), [summary]);
  const chunks = useMemo(() => {
    const result: string[][] = [];
    for (let index = 0; index < words.length; index += WORDS_PER_CHUNK) {
      result.push(words.slice(index, index + WORDS_PER_CHUNK));
    }
    return result;
  }, [words]);
  const duration = estimateDuration(words.length);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const currentTimeRef = useRef(0);
  const wordIndexRef = useRef(0);
  const playbackStateRef = useRef<PlaybackState>("idle");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const mountedRef = useRef(true);

  const updatePlaybackState = (state: PlaybackState) => {
    playbackStateRef.current = state;
    setPlaybackState(state);
  };

  const updateCurrentTime = (time: number) => {
    const boundedTime = Math.min(duration, Math.max(0, time));
    currentTimeRef.current = boundedTime;
    setCurrentTime(boundedTime);
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakFromWord = (startWord: number) => {
    if (!("speechSynthesis" in window) || !("SpeechSynthesisUtterance" in window)) {
      setErrorMessage("Text-to-speech is not supported by this browser.");
      updatePlaybackState("idle");
      return;
    }

    const safeStartWord = Math.min(words.length, Math.max(0, startWord));
    if (safeStartWord >= words.length) {
      updateCurrentTime(duration);
      wordIndexRef.current = words.length;
      updatePlaybackState("ended");
      return;
    }

    const chunkIndex = Math.floor(safeStartWord / WORDS_PER_CHUNK);
    const chunkWordOffset = safeStartWord % WORDS_PER_CHUNK;
    const chunkWords = chunks[chunkIndex].slice(chunkWordOffset);
    const utterance = new SpeechSynthesisUtterance(chunkWords.join(" "));
    utterance.rate = 1;
    utteranceRef.current = utterance;
    wordIndexRef.current = safeStartWord;
    setErrorMessage("");

    utterance.onboundary = (event) => {
      if (!mountedRef.current || event.name !== "word") return;
      const spokenWords = utterance.text
        .slice(0, event.charIndex)
        .trim()
        .split(/\s+/)
        .filter(Boolean).length;
      const absoluteWord = Math.min(
        words.length,
        safeStartWord + spokenWords,
      );
      wordIndexRef.current = absoluteWord;
      updateCurrentTime(estimateDuration(absoluteWord));
    };
    utterance.onend = () => {
      if (!mountedRef.current || playbackStateRef.current !== "playing") return;
      const nextWord = safeStartWord + chunkWords.length;
      wordIndexRef.current = nextWord;
      updateCurrentTime(estimateDuration(nextWord));
      if (nextWord < words.length) {
        speakFromWord(nextWord);
      } else {
        updateCurrentTime(duration);
        updatePlaybackState("ended");
      }
    };
    utterance.onerror = (event) => {
      if (!mountedRef.current || event.error === "canceled" || event.error === "interrupted") return;
      setErrorMessage("Unable to read the summary aloud.");
      updatePlaybackState("paused");
    };

    updatePlaybackState("playing");
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (playbackState !== "playing") return;

    const intervalId = window.setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        const nextTime = Math.min(duration, currentTimeRef.current + 0.25);
        currentTimeRef.current = nextTime;
        setCurrentTime(nextTime);
      }
    }, 250);

    return () => window.clearInterval(intervalId);
  }, [playbackState, duration]);

  const handlePlayPause = () => {
    if (playbackState === "playing") {
      window.speechSynthesis.pause();
      updatePlaybackState("paused");
      return;
    }

    if (playbackState === "paused" && utteranceRef.current) {
      window.speechSynthesis.resume();
      updatePlaybackState("playing");
      return;
    }

    speakFromWord(wordIndexRef.current >= words.length ? 0 : wordIndexRef.current);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    wordIndexRef.current = 0;
    updateCurrentTime(0);
    updatePlaybackState("idle");
    setErrorMessage("");
  };

  const seekTo = (time: number) => {
    const targetTime = Math.min(duration, Math.max(0, time));
    const targetWord = Math.min(
      words.length,
      Math.floor((targetTime / Math.max(duration, 1)) * words.length),
    );
    const wasPlaying = playbackStateRef.current === "playing";
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    wordIndexRef.current = targetWord;
    updateCurrentTime(targetTime);

    if (wasPlaying) {
      speakFromWord(targetWord);
    } else {
      updatePlaybackState("paused");
    }
  };

  const skipBy = (seconds: number) => {
    seekTo(currentTimeRef.current + seconds);
  };

  return (
    <section className="summary-player" aria-label={`Audio summary for ${title}`}>
      <div className="summary-player__progress">
        <span>{formatTime(currentTime)}</span>
        <input
          aria-label="Seek through summary"
          className="summary-player__seek"
          type="range"
          min="0"
          max={duration || 1}
          step="0.1"
          value={currentTime}
          onChange={(event) => seekTo(Number(event.target.value))}
        />
        <span>Total {formatTime(duration)}</span>
      </div>
      <div className="summary-player__controls">
        <button
          type="button"
          className="summary-player__button summary-player__skip"
          onClick={() => skipBy(-SKIP_SECONDS)}
          aria-label={`Skip back ${SKIP_SECONDS} seconds`}
          disabled={duration === 0}
        >
          <FaBackward aria-hidden="true" />
          <span>{SKIP_SECONDS}</span>
        </button>
        <button
          type="button"
          className="summary-player__button summary-player__play"
          onClick={handlePlayPause}
          aria-label={playbackState === "playing" ? "Pause summary" : "Play summary"}
          disabled={duration === 0}
        >
          {playbackState === "playing" ? (
            <FaPause aria-hidden="true" />
          ) : (
            <FaPlay aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          className="summary-player__button summary-player__stop"
          onClick={handleStop}
          aria-label="Stop summary"
          disabled={playbackState === "idle" && currentTime === 0}
        >
          <FaStop aria-hidden="true" />
        </button>
        <button
          type="button"
          className="summary-player__button summary-player__skip"
          onClick={() => skipBy(SKIP_SECONDS)}
          aria-label={`Skip forward ${SKIP_SECONDS} seconds`}
          disabled={duration === 0}
        >
          <span>{SKIP_SECONDS}</span>
          <FaForward aria-hidden="true" />
        </button>
      </div>
      <p className="summary-player__duration-note">
        Estimated duration; actual speech time may vary by browser and voice.
      </p>
      {errorMessage && (
        <p className="summary-player__error" role="alert">
          {errorMessage}
        </p>
      )}
    </section>
  );
}
