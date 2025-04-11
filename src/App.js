import React, { useEffect } from "react";
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { styleReset } from "react95";
import original from "react95/dist/themes/original";

import Desktop from "./views/Desktop";
import Login from "./views/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TeamProvider } from "./context/TeamContext";

import { menubarButtons, focusedElement } from "./store";

import "./App.css";

const ResetStyles = createGlobalStyle`
  ${styleReset}
`;

function AppWrapper() {
  const [focused, setfocused] = useRecoilState(focusedElement);
  const currentButtons = useRecoilValue(menubarButtons);
  const { user, loading } = useAuth();

  const handleClick = React.useCallback(
    (e) => {
      if (e.target.dataset && e.target.dataset.name === "start-menu") return;
      const closest = e.target.closest("[data-name]");
      if (!closest) return setfocused("");
      const { name } = closest.dataset;
      setfocused(name);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [focused, setfocused, currentButtons]
  );

  useEffect(() => {
    if (user) {
      document.addEventListener("click", handleClick);
      document.addEventListener("touchstart", handleClick);
      return () => {
        document.removeEventListener("click", handleClick);
        document.removeEventListener("touchstart", handleClick);
      };
    }
  }, [user, handleClick]);

  if (loading) {
    return (
      <div className="flex justify-center items-center login">
      </div>
    );
  }

  return (
    <>
      {user ? (
        <Desktop />
      ) : (
        <Login onLogin={() => {}} />
      )}
    </>
  );
}

const App = () => {
  return (
    <RecoilRoot>
      <AuthProvider>
        <TeamProvider>
          <ResetStyles />
          <ThemeProvider theme={original}>
            <AppWrapper />
          </ThemeProvider>
        </TeamProvider>
      </AuthProvider>
    </RecoilRoot>
  );
};

export default App;
