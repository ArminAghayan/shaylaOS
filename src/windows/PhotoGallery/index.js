import React from "react";
import { Bar, Button } from "react95";
import { useRecoilValue } from "recoil";

import FileTree from "../../components/FileTree";
import Shortcuts from "./Shortcuts";
import Icon from "./Icon";

import { trending } from "../../store";
import { TRENDING_TREE } from "../../constants";

import "./styles.scss";

export default function PhotoGallery() {
  const photos = useRecoilValue(trending);
  const [shortcuts, setShortcuts] = React.useState({});
  const [selectedFolder, setSelectedFolder] = React.useState("Photos");
  const [currentPath, setCurrentPath] = React.useState("Photos");
  const [folderContents, setFolderContents] = React.useState([]);
  
  // Initialize folder contents
  React.useEffect(() => {
    setFolderContents(getCurrentFolderContents());
  }, [currentPath]);
  
  React.useEffect(() => {
    if (selectedFolder && photos && photos[selectedFolder]) {
      setShortcuts(photos[selectedFolder]);
    }
  }, [photos, selectedFolder]);

  const handleTreeClick = (folderPath) => {
    if (!folderPath) return;
    
    // Parse the folder path
    setCurrentPath(folderPath);
    
    const pathParts = folderPath.split("/");
    if (pathParts.length >= 1) {
      const folderName = pathParts[pathParts.length - 1];
      setSelectedFolder(folderName);
      
      if (folderName && photos && photos[folderName]) {
        setShortcuts(photos[folderName]);
      }
    }
  };

  // Get the current folder's contents
  const getCurrentFolderContents = () => {
    if (!currentPath) return [];
    
    const pathParts = currentPath.split("/");
    
    // Main Photos folder - show years
    if (currentPath === "Photos") {
      return TRENDING_TREE[0]?.object?.entries?.map(entry => ({
        name: entry.name,
        type: "folder",
        avatar: require("../../assets/folder-closed.png"),
        author: ""
      })) || [];
    }
    // Year folder - show months
    else if (pathParts.length === 2 && (pathParts[1] === "2024" || pathParts[1] === "2025")) {
      const months = [
        "January", "February", "March", "April", 
        "May", "June", "July", "August", 
        "September", "October", "November", "December"
      ];
      
      return months.map(month => ({
        name: month,
        type: "folder",
        avatar: require("../../assets/folder-closed.png"),
        author: ""
      }));
    }
    // Month folder - show photos (empty for now)
    else if (pathParts.length === 3) {
      return [];
    }
    
    return [];
  };

  const handleFolderClick = (folder) => {
    if (!folder || typeof folder !== 'object') return;
    
    if (currentPath === "Photos") {
      handleTreeClick(`Photos/${folder.name}`);
    } else {
      const pathParts = currentPath.split("/");
      if (pathParts.length === 2) {
        // From year to month
        handleTreeClick(`${currentPath}/${folder.name}`);
      }
    }
  };

  // Get breadcrumb for display
  const getBreadcrumb = () => {
    if (!currentPath) return "Photos";
    
    const pathParts = currentPath.split("/");
    if (pathParts.length === 1) return pathParts[0];
    if (pathParts.length === 2) return `${pathParts[0]}/${pathParts[1]}`;
    if (pathParts.length === 3) return `${pathParts[0]}/${pathParts[1]}/${pathParts[2]}`;
    return currentPath;
  };
  
  // Get window title
  const getWindowTitle = () => {
    return `Exploring - My Photos`;
  };

  return (
    <>
      <section className="flex flex-column explorerWindow mostFollowedWindow">
        <div className="flex justify-between explorerWindow__header">
          <div className="flex flex-auto items-center explorerWindow__headerButtons">
            <Bar className="explorerWindow__bar" />
            <Button variant="menu" size="sm">
              File
            </Button>
            <Button variant="menu" size="sm">
              Edit
            </Button>
            <Button variant="menu" size="sm">
              View
            </Button>
          </div>
          <div className="flex explorerWindow__logo">
            <div className="explorerWindow__logoBg" />
            <img
              src={`${require("../../assets/win-logo.png")}`}
              alt=""
              width="30"
              className="pixelated"
            />
          </div>
        </div>
        <div className="flex explorerWindow__titleBar">
          <img
            src={require("../../assets/folder-open.png")}
            alt=""
            className="pixelated mr-1"
            width="16"
            height="16"
          />
          <span>{currentPath}</span>
        </div>
        <div className="flex trendingWindow__panelHeader">
          <p>All Folders</p>
          <p>
            Contents of folder '{getBreadcrumb()}'
          </p>
        </div>
        <div className="flex flex-auto trendingWindow__panels">
          <div className="trendingWindow__panel -tree scrollable -yOnly">
            <FileTree
              files={TRENDING_TREE}
              titleRow="Photos"
              onRowClick={() => ""}
              onFileClick={handleTreeClick}
            />
          </div>

          <div className="flex flex-wrap trendingWindow__panel -icons scrollable -yOnly">
            {folderContents && folderContents.length > 0 ? (
              folderContents.map((folder, index) => (
                folder && (
                  <Icon
                    key={`${folder.name || 'unknown'}-${index}`}
                    avatar={folder.avatar}
                    name={folder.name || 'Unknown'}
                    owner={folder.author || ""}
                    highlighted={false}
                    onSingleClick={() => {}}
                    onDoubleClick={() => handleFolderClick(folder)}
                  />
                )
              ))
            ) : (
              photos && selectedFolder && photos[selectedFolder] ? (
                <Shortcuts shortcuts={photos[selectedFolder]} type="photos" />
              ) : null
            )}
          </div>
        </div>

        <div className="trendingWindow__footer">
          <p>{(folderContents && folderContents.length) || (shortcuts ? Object.keys(shortcuts).length : 0)} items</p>
        </div>
      </section>
    </>
  );
}
