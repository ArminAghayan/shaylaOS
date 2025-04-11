import React from "react";
import { useRecoilState } from "recoil";
import Draggable from "react-draggable";

import StartupSound from "../../components/StartupSound";
import MusicPlayer from "../../components/MusicPlayer";
import Taskbar from "../Taskbar";
import Windows from "./Windows";
import DesktopButton from "./DesktopButton";
import useLocalStorage from "../../hooks/useLocalStorage";
import { WINDOW_OBJ } from "../../constants";
import { windowObj } from "../../store";
import reducer, {
  SET_LOADING,
  SET_TASKBAR,
  SET_ICONS,
  SET_WINDOWS,
} from "./reducer";

import "./styles.scss";

const desktopIcons = (() => {
  console.log("WINDOW_OBJ keys:", Object.keys(WINDOW_OBJ));
  console.log("About icon:", WINDOW_OBJ.about.desktopIcon);
  
  const icons = Object.keys(WINDOW_OBJ)
    .filter((name) => {
      console.log(`Checking ${name} icon:`, WINDOW_OBJ[name].desktopIcon);
      return !!WINDOW_OBJ[name].desktopIcon;
    })
    .sort(
      (a, b) => WINDOW_OBJ[a].desktopPosition - WINDOW_OBJ[b].desktopPosition
    );
  
  console.log("Final desktop icons:", icons);
  return icons;
})();

export default function Desktop() {
  const [currentWindows, setWindows] = useRecoilState(windowObj);
  // const limit = useRecoilValue(apiLimit);
  const [active, setActive] = React.useState("");
  // eslint-disable-next-line no-unused-vars
  const [soundStorage, _] = useLocalStorage("github95_noSound");

  // Add state for music player
  const [playlist, setPlaylist] = React.useState([]);
  const [showPlayer, setShowPlayer] = React.useState(false);

  const [
    { showLoader, showTaskbar, showIcons, showWindows },
    dispatch,
  ] = reducer();

  const handleDesktopClick = ({ target }) => {
    const { name } = target.dataset;
    setActive(name || "");
  };

  const handleButtonDblClick = (name) => (e) => {
    e.stopPropagation();
    const updated = {
      [name]: {
        ...currentWindows[name],
        visibility: [true, true],
      },
    };

    window.setTimeout(() => {
      setWindows({ ...currentWindows, ...updated });
    }, 300);
  };

  // Add handler to play a track
  const handlePlayTrack = (trackItem) => {
     // Basic setup, assuming trackItem structure from OurMusic
     // Needs getFileUrl logic or similar passed/imported if complex
     // For now, assuming a simple structure { url: '...', title: '...' }
     // We might need to adjust this based on how getFileUrl is handled globally
     console.log("Playing track in Desktop:", trackItem); // Debugging
     if (trackItem && trackItem.url) {
       setPlaylist([trackItem]); // Set playlist with the single track
       setShowPlayer(true);
     } else {
       // If we need the authenticated fetch logic from OurMusic's getFileUrl:
       // We'd need to either move getFileUrl here (requires supabase client)
       // or pass a function down to OurMusic that can fetch the URL/blob.
       // For now, log an error if the simple URL isn't present.
       console.error("Track item does not have a URL:", trackItem);
       // Example: If trackItem has getAuthContent like before:
       // trackItem.getAuthContent().then(blobUrl => {
       //   if (blobUrl) {
       //     setPlaylist([{ url: blobUrl, title: trackItem.title }]);
       //     setShowPlayer(true);
       //   } else {
       //      console.error("Failed to get authenticated content URL");
       //   }
       // });
     }
  };

  // Add handler to close the player
  const handleClosePlayer = () => {
    setShowPlayer(false);
    setPlaylist([]); // Clear playlist on close
  };

  React.useEffect(() => {
    // @ts-ignore
    dispatch({ type: SET_LOADING });
    window.setTimeout(() => {
      // @ts-ignore
      dispatch({ type: SET_TASKBAR });
    }, 500);
    window.setTimeout(() => {
      // @ts-ignore
      dispatch({ type: SET_ICONS });
    }, 1250);
    window.setTimeout(() => {
      // @ts-ignore
      dispatch({ type: SET_WINDOWS });
    }, 2500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const toggle = showLoader ? "add" : "remove";
    document.body.classList[toggle]("isLoading");
  }, [showLoader]);

  return (
    <>
      {showTaskbar && (
        <>
          <Taskbar />
          {soundStorage !== "Off" && <StartupSound />}
        </>
      )}
      <main>
        <section className="desktop">
          <section
            className="flex flex-column desktop__background"
            onClick={handleDesktopClick}
          >
            {showIcons && (
              <>
                {desktopIcons.map((name) => {
                  const { label, desktopIcon } = WINDOW_OBJ[name];
                  console.log(`Rendering ${name} with icon:`, desktopIcon);
                  return (
                    <React.Fragment key={name}>
                      {desktopIcon && (
                        <DesktopButton
                          name={name}
                          label={label}
                          icon={desktopIcon}
                          active={active}
                          onDoubleClick={handleButtonDblClick(name)}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </>
            )}
          </section>

          {showWindows && <Windows onPlayTrack={handlePlayTrack} />}
        </section>
      </main>
      {showPlayer && (
        <Draggable handle=".player-header">
          <div className="music-player-container" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <MusicPlayer playlist={playlist} onClose={handleClosePlayer} />
          </div>
        </Draggable>
      )}
    </>
  );
}
