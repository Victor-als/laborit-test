import { useScreen } from "./hooks/useScreen";
import { SplashScreen } from "./components/SplashScreen";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { ChatScreen } from "./components/ChatScreen";

export function App() {
  const { screen, goTo } = useScreen();
  return (
    <div style={{ height: "100%" }} className="bg-[#111111]">
      {screen === "splash" && <SplashScreen />}
      {screen === "onboarding" && <OnboardingScreen goTo={goTo} />}
      {screen === "chat" && <ChatScreen goTo={goTo} />}
    </div>
  );
}
