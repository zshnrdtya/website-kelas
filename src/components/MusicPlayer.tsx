"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const wasPlayingBeforeHideRef = useRef(false);

  // Fade in audio helper
  const fadeInAudio = (audio: HTMLAudioElement, targetVolume = 0.45, durationMs = 2500) => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    audio.volume = 0;
    const stepTime = 50;
    const stepVolume = targetVolume / (durationMs / stepTime);

    fadeIntervalRef.current = setInterval(() => {
      if (audio.paused) {
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
        return;
      }
      if (audio.volume + stepVolume >= targetVolume) {
        audio.volume = targetVolume;
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
      } else {
        audio.volume = Math.min(targetVolume, audio.volume + stepVolume);
      }
    }, stepTime);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const tryAutoPlay = () => {
      if (document.hidden) return;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          fadeInAudio(audio, 0.45, 2500);
        })
        .catch(() => {
          // Autoplay blocked by browser policy without prior gesture
          setIsPlaying(false);
        });
    };

    // 1. Initial attempt
    tryAutoPlay();

    // 2. If blocked by browser, trigger on first user interaction anywhere
    const handleFirstGesture = () => {
      if (document.hidden) return;
      if (audio.paused && !userInteracted) {
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            fadeInAudio(audio, 0.45, 2000);
          })
          .catch(() => {});
      }
    };

    window.addEventListener("click", handleFirstGesture, { once: true });
    window.addEventListener("touchstart", handleFirstGesture, { once: true });
    window.addEventListener("keydown", handleFirstGesture, { once: true });

    // 3. Pause when switching tab, minimizing, or returning to phone/laptop home
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab or window is hidden / minimized / switched away
        if (!audio.paused) {
          wasPlayingBeforeHideRef.current = true;
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
          }
          audio.pause();
          setIsPlaying(false);
        }
      } else {
        // Tab is visible again
        if (wasPlayingBeforeHideRef.current) {
          wasPlayingBeforeHideRef.current = false;
          audio
            .play()
            .then(() => {
              setIsPlaying(true);
              fadeInAudio(audio, 0.45, 1500);
            })
            .catch(() => {});
        }
      }
    };

    const handlePageHide = () => {
      if (!audio.paused) {
        wasPlayingBeforeHideRef.current = true;
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
        audio.pause();
        setIsPlaying(false);
      }
    };

    const handlePageShow = () => {
      if (wasPlayingBeforeHideRef.current && !document.hidden) {
        wasPlayingBeforeHideRef.current = false;
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            fadeInAudio(audio, 0.45, 1500);
          })
          .catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("click", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    };
  }, [userInteracted]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setUserInteracted(true);

    if (isPlaying) {
      wasPlayingBeforeHideRef.current = false;
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
      }
      audio.pause();
      setIsPlaying(false);
    } else {
      wasPlayingBeforeHideRef.current = false;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          fadeInAudio(audio, 0.45, 1500);
        })
        .catch(() => {});
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src="/asset-song/rumah-kita.mp3"
        loop
        preload="auto"
      />

      {/* Floating Neobrutalist Music Player Button */}
      <motion.button
        type="button"
        onClick={toggleMusic}
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={`flex items-center gap-2.5 sm:gap-3.5 px-3.5 py-2.5 sm:px-4 sm:py-3 border-3 sm:border-4 border-black font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all cursor-pointer ${
          isPlaying
            ? "bg-neo-yellow text-black"
            : "bg-neo-white text-black hover:bg-neutral-100"
        }`}
        title={isPlaying ? "Matikan Lagu (Pause)" : "Putar Lagu Rumah Kita"}
      >
        {/* Equalizer Wave / Disc Icon */}
        <div className="flex items-end gap-0.5 h-4 sm:h-5 w-4 sm:w-5 justify-center shrink-0">
          {isPlaying ? (
            <>
              <span className="w-1 bg-black animate-[bounce_0.8s_infinite] h-full" />
              <span className="w-1 bg-black animate-[bounce_1.1s_infinite] h-3/4" />
              <span className="w-1 bg-black animate-[bounce_0.9s_infinite] h-1/2" />
            </>
          ) : (
            <span className="text-base sm:text-lg leading-none">🔇</span>
          )}
        </div>

        {/* Track Title */}
        <div className="text-left flex flex-col">
          <span className="text-xs sm:text-sm font-black tracking-tight leading-tight">
            Rumah Kita
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-neutral-700 hidden sm:inline-block leading-none">
            God Bless • {isPlaying ? "Memutar..." : "Jeda"}
          </span>
        </div>

        {/* Status Badge */}
        <span
          className={`text-[10px] font-black uppercase px-2 py-0.5 border border-black shrink-0 ${
            isPlaying ? "bg-black text-neo-yellow" : "bg-neutral-200 text-neutral-800"
          }`}
        >
          {isPlaying ? "ON" : "OFF"}
        </span>
      </motion.button>
    </div>
  );
}
