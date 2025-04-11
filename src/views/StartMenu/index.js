import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { Button, List, ListItem, Divider } from "react95";

import { windowObj } from "../../store";
import useLocalStorage from "../../hooks/useLocalStorage";
import { useAuth } from "../../context/AuthContext";

import "./styles.scss";

export default function StartMenu() {
  const [soundStorage, setStorage] = useLocalStorage("github95_noSound", "On");
  const [currentWindows, setWindows] = useRecoilState(windowObj);
  const [isOpen, setOpen] = React.useState(false);
  const refMenu = React.useRef(undefined);
  const { signOut } = useAuth();

  const toggleMenu = (toggle) => {
    setOpen(toggle);
    if (toggle) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleButtonClick = () => {
    toggleMenu(!isOpen);
  };

  const handleListClick = (name) => () => {
    const updated = {
      [name]: {
        ...currentWindows[name],
        visibility: [true, true],
      },
    };
    window.setTimeout(() => {
      setWindows({ ...currentWindows, ...updated });
    }, 300);
    toggleMenu(false);
  };

  const handleClickOutside = ({ target }) => {
    if (refMenu.current && refMenu.current.contains(target)) return;
    toggleMenu(false);
  };

  const handleSoundToggle = () => {
    const storageValue = {
      Off: "On",
      On: "Off",
    };
    setStorage(storageValue[soundStorage]);
  };

  const handleShutdown = async () => {
    document.removeEventListener("mousedown", handleClickOutside);
    toggleMenu(false);
    await signOut();
  };

  return (
    <div className="startMenu" ref={refMenu}>
      <div className={`startMenu__slide${isOpen ? " -isOpen" : ""}`}>
        <List
          horizontalAlign="left"
          verticalAlign="top"
          className="startMenu__menu"
        >
          <ListItem onClick={handleListClick("photoGallery")} data-name="photoGallery">
            <p className="startMenu__menuItem">
              <img
                src={`${require("../../assets/folder-closed.png")}`}
                alt=""
                width="20"
                className="pixelated"
              />
              Photo Gallery
            </p>
          </ListItem>
          <ListItem onClick={handleListClick("documentGallery")} data-name="documentGallery">
            <p className="startMenu__menuItem">
              <img
                src={`${require("../../assets/folder-closed.png")}`}
                alt=""
                width="20"
                className="pixelated"
              />
              Document Gallery
            </p>
          </ListItem>
          <ListItem onClick={handleListClick("about")} data-name="about">
            <p className="startMenu__menuItem">
              <img
                src={`${require("../../assets/wordpad.png")}`}
                alt=""
                width="20"
                className="pixelated"
              />
              About
            </p>
          </ListItem>
          <Divider />
          <ListItem onClick={handleSoundToggle}>
            <p className="startMenu__menuItem -soundItem">
              Startup sound: <span className="badge -grey">{soundStorage}</span>
            </p>
          </ListItem>
          <Divider />
          <ListItem onClick={handleShutdown}>
            <p className="startMenu__menuItem -shutdownItem">
              <img
                src={`${require("../../assets/shutdown.png")}`}
                alt=""
                width="20"
                className="pixelated"
              />
              Shut Down
            </p>
          </ListItem>
        </List>
      </div>
      <Button
        data-name="start-menu"
        onClick={handleButtonClick}
        active={isOpen}
        className="mr1 startMenu__triggerButton"
      >
        <img
          src={require("../../assets/shaylaOS.png")}
          alt=""
          className="pixelated startMenu__logo"
        />
        ShaylaOS
      </Button>
    </div>
  );
}
