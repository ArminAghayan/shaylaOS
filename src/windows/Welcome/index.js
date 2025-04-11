import React from "react";
import { useRecoilState } from "recoil";
import { Anchor, Button, Divider } from "react95";

import { windowObj } from "../../store";
import useLocalStorage from "../../hooks/useLocalStorage";
import useNewWindow from "../../hooks/useNewWindow";
import ErrorPopup from "../../components/ErrorPopup";

import "./styles.scss";

export default function Welcome() {
  const [currentWindows, setWindows] = useRecoilState(windowObj);
  // eslint-disable-next-line no-unused-vars
  const [_, setStorage] = useLocalStorage("github95_welcome", true);
  const open = useNewWindow();
  const [showLovePopup, setShowLovePopup] = React.useState(false);

  const handleMoreClick = () => {
    const updated = {
      about: {
        ...currentWindows.about,
        visibility: [true, true],
      },
    };

    window.setTimeout(() => {
      setWindows({ ...currentWindows, ...updated });
    }, 300);
  };

  const handleCodeClick = () => {
    open("github95", "edwardpayton");
  };

  const handleCloseClick = () => {
    const updated = {
      welcome: {
        ...currentWindows.welcome,
        visibility: [false, false],
      },
    };

    setWindows({ ...currentWindows, ...updated });

    setStorage(false);
  };

  const handleLoveClick = () => {
    setShowLovePopup(true);
  };

  const handleLovePopupClose = () => {
    setShowLovePopup(false);
  };

  return (
    <div className="p2 flex flex-column welcome">
      <h1 className="mb2 welcome__title">
        Welcome to <span className="welcome__ghText">Shayla</span>
        <span className="welcome__95Text">OS</span>
      </h1>
      <p>This will be our virtual computer for our love</p>
      <p className="mb2">
        This is where all our memories will be stored for our kids to see!
      </p>
      <div className="flex flex-auto">
        <div className="p2 bevelBorder welcome__body">
          <div className="mb2 flex flex-auto">
            <div>
              <img
                src={require("../../assets/lightbulb-exclamation.png").default}
                alt=""
                className="pixelated"
              />
            </div>
            <div className="pl2">
              <p>
                To browse our memories, you just click
                <br />
                the ShaylaOS button, and then the programs icon.
              </p>
            </div>
          </div>
          <div className="center">
            <img
              src={require("../../assets/welcome-computer.png").default}
              alt=""
              className="pixelated"
            />
          </div>
        </div>
        <div className="pl2 flex flex-column justify-between welcome__buttons">
          <div className="flex flex-column">
            
            <Button
              data-name="edwardpaytongithub95"
              className="mt1"
              onClick={handleLoveClick}
            >
              Love you
            </Button>
            <Divider className="welcome__hr" />
            <Button onClick={handleCloseClick}>Never show again</Button>
          </div>

        
        </div>
      </div>
      
      {showLovePopup && (
        <ErrorPopup
          header="Message from ShaylaOS"
          dismissable={true}
          onClose={handleLovePopupClose}
        >
          <p>Love you more ❤️</p>
        </ErrorPopup>
      )}
    </div>
  );
}
