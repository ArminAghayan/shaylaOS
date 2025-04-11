import React from "react";
import { useRecoilState } from "recoil";

import WindowFrame, {
  Welcome,
  About,
  DocumentGallery,
  PhotoGallery,
} from "../../windows";

// Import the PacmanGame component
import PacmanGame from "../../windows/PacmanGame";

import { windowObj } from "../../store";
import useLocalStorage from "../../hooks/useLocalStorage";

const componentList = {
  welcome: Welcome,
  about: About,
  documentGallery: DocumentGallery,
  photoGallery: PhotoGallery,
  // Add the mapping for Pacman
  pacman: PacmanGame,
};

export default function Windows() {
  const [currentWindows, setWindows] = useRecoilState(windowObj);
  // eslint-disable-next-line no-unused-vars
  const [welcomeStorage, _] = useLocalStorage("github95_welcome");

  const handleCloseWindow = (name) => {
    const updated = {
      [name]: {
        ...currentWindows[name],
        visibility: [false, false],
      },
    };
    setWindows({
      ...currentWindows,
      ...updated,
    });
  };

  const getContent = (name) => {
    const Comp = componentList[name];
    if (Comp === undefined) return <DocumentGallery />;

    return <Comp />;
  };

  const getCssName = (name) => {
     if(name in componentList) return name;
     return "repositoryDetails";
  }

  return (
    <>
      {Object.keys(currentWindows).map((name) => {
        const content = getContent(name);
        const cssName = getCssName(name);
        if (name === "welcome" && welcomeStorage === false) return null;
        return (
          <WindowFrame
            key={name}
            name={name}
            cssName={cssName}
            window={currentWindows[name]}
            onClose={handleCloseWindow}
          >
            {content}
          </WindowFrame>
        );
      })}
    </>
  );
}
