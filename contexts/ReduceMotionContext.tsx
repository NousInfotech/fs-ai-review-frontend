"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

const ReduceMotionContext = createContext(false);

type PerformanceState = {
  isIPhone: boolean;
  isLowPerformance: boolean;
  reduceMotion: boolean;
};

const PerformanceContext = createContext<PerformanceState>({
  isIPhone: false,
  isLowPerformance: false,
  reduceMotion: false,
});

function isSafariOrIOS(): boolean {
  if (typeof window === "undefined") return true;
  const ua = window.navigator.userAgent;
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(ua) && !/Chrome|Chromium|CriOS/.test(ua);
  return isIOS || isSafari;
}

function detectPerformance(currentReduceMotion: boolean): PerformanceState {
  if (typeof window === "undefined") {
    return { isIPhone: false, isLowPerformance: true, reduceMotion: currentReduceMotion };
  }

  const ua = window.navigator.userAgent || "";
  const isIPhone =
    /iPhone|iPod/.test(ua) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  const smallScreen = window.innerWidth < 768;
  // @ts-ignore
  const maybeLowMemory = typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 4;

  const isLowPerformance = isIPhone || smallScreen || !!maybeLowMemory;

  return { isIPhone, isLowPerformance, reduceMotion: currentReduceMotion };
}

export function ReduceMotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [reduce, setReduce] = useState(true);
  const [performance, setPerformance] = useState<PerformanceState>({
    isIPhone: false,
    isLowPerformance: true,
    reduceMotion: true,
  });

  useEffect(() => {
    const updateFromEnvironment = () => {
      const isMobile = window.innerWidth < 768;
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const safariOrIOS = isSafariOrIOS();

      const nextReduce = isMobile || prefersReduced || safariOrIOS;
      setReduce(nextReduce);
      setPerformance(detectPerformance(nextReduce));
    };

    updateFromEnvironment();

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => updateFromEnvironment();

    mql.addEventListener("change", onChange);
    window.addEventListener("resize", onChange);

    return () => {
      mql.removeEventListener("change", onChange);
      window.removeEventListener("resize", onChange);
    };
  }, []);

  return (
    <ReduceMotionContext.Provider value={reduce}>
      <PerformanceContext.Provider value={performance}>
        {children}
      </PerformanceContext.Provider>
    </ReduceMotionContext.Provider>
  );
}

export function useReduceMotion() {
  return useContext(ReduceMotionContext);
}

export function usePerformance() {
  return useContext(PerformanceContext);
}

