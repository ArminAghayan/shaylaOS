import React from "react";
import { useRecoilState } from "recoil";

import WindowFrame, {
  Welcome,
  About,
  DocumentGallery,
  PhotoGallery,
  OurMusic,
  DocumentViewer,
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
  // Add the mapping for OurMusic
  ourMusic: OurMusic,
  // Add the mapping for DocumentViewer
  documentViewer: DocumentViewer,
};

// Accept onPlayTrack and onViewImage props
export default function Windows({ onPlayTrack, onViewImage }) {
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

    // Check if the component is OurMusic and pass the prop
    if (name === "ourMusic") {
      return <Comp onPlayTrack={onPlayTrack} />;
    }
    
    // Pass onViewImage to PhotoGallery
    if (name === "photoGallery") {
      return <Comp onViewImage={onViewImage} />;
    }
    
    // Render other components normally
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
