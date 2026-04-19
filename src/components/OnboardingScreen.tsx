import { useState } from "react";
import { MoveLeft, MoveRight } from "lucide-react";
import type { AppScreen } from "../types";
import onboardingImage from "../assets/Robot.png";
import onboardingImageBlur from "../assets/RobotBlur.png";

const SLIDES = [
  {
    title: "Unlock the Power Of Future AI",
    description:
      "Chat with the smartest AI Future\nExperience power of AI with us",
  },
  {
    title: "Your Intelligent Assistant",
    description: "Get instant answers and personalized\nsupport available 24/7",
  },
  {
    title: "Secure & Smart Finance",
    description: "Your data protected with\nthe highest security standards",
  },
];

interface Props {
  goTo: (s: AppScreen) => void;
}

export function OnboardingScreen({ goTo }: Props) {
  const [current, setCurrent] = useState(0);

  function finishOnboarding() {
    localStorage.setItem("has_seen_onboarding", "true");
    goTo("chat");
  }

  function next() {
    if (current < SLIDES.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      finishOnboarding(); 
    }
  }

  function prev() {
    if (current > 0) setCurrent((c) => c - 1);
  }

  const slide = SLIDES[current];

  return (
    <div className="flex flex-col h-screen bg-[#111111]">
      {/* Skip */}
      <div className="flex justify-end px-6 pt-6 pb-2 shrink-0">
        <button
          onClick={finishOnboarding}
          className="text-white font-body font-medium text-base hover:opacity-70 transition-opacity"
        >
          Skip
        </button>
      </div>

      <div className="flex justify-center items-center relative">
        <img
          src={onboardingImageBlur}
          alt=""
          className="absolute z-0 opacity-50 blur-2xl scale-110"
        />

        <img
          src={onboardingImage}
          alt="onboarding"
          className="relative z-10 w-[336px] h-[438.45px] object-cover"
        />
      </div>

      <div className="flex justify-center gap-2 mt-6 shrink-0">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: "8px",
              height: "8px",
              background: i === current ? "#ffffff" : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>

      <div className="flex-1 px-6 pt-6 pb-2 text-center" key={current}>
        <h2 className="font-display font-bold text-white text-[28px] leading-tight mb-3 animate-fade-up">
          {slide.title}
        </h2>

        <p
          className="font-body text-[#888] text-sm leading-relaxed whitespace-pre-line animate-fade-up"
          style={{
            animationDelay: "60ms",
            animationFillMode: "both",
            opacity: 0,
          }}
        >
          {slide.description}
        </p>
      </div>

      <div className="pb-12 pt-4 flex justify-center shrink-0">
        <div className="flex flex-row items-center bg-[#1c1c1c] rounded-[20px]">
          <button
            onClick={prev}
            disabled={current === 0}
            className="flex items-center justify-center w-20 h-16 hover:bg-[#252525] rounded-l-[20px] transition-colors disabled:opacity-30"
          >
            <MoveLeft size={20} className="text-white/70" />
          </button>

          <div className="w-0.5 h-7 bg-neutral-200" />

          <button
            onClick={next}
            className="flex items-center justify-center w-20 h-16 hover:bg-[#252525] rounded-r-[20px] transition-colors"
          >
            <MoveRight size={20} className="text-white/70" />
          </button>
        </div>
      </div>
    </div>
  );
}
