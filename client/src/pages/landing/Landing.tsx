import { useEffect } from "react";

import { LandingSections } from "./sections";

export default function Landing() {
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = prev;
    };
  }, []);

  return (
    <div className="lp-keep min-h-screen bg-background text-ink">
      <LandingSections />
    </div>
  );
}
