import React from "react";
import { Bar, Button } from "react95";
// Import Recoil hooks and state
import { useRecoilState } from "recoil";
import { windowObj } from "../../store";

// Removed FileTree import
import Icon from "./Icon";

// Remove if not used for documents
// import { trending } from "../../store";
// Removed TRENDING_TREE import

import "./styles.scss";

// Removed FAKE_DOCUMENT_TREE
// --- Fake Data Start ---
// const FAKE_DOCUMENT_TREE = [ ... ]; // Removed

const FAKE_DOCUMENTS_DATA = {
  "Documents": {
    "3 months.doc": { url: "#", avatar: require("../../assets/wordpad.png"), author: "User" },
    "poem.doc": { url: "#", avatar: require("../../assets/wordpad.png"), author: "User" },
    "My letter about me.doc": { url: "#", avatar: require("../../assets/wordpad.png"), author: "User" },
    "1 month.doc": { url: "#", avatar: require("../../assets/wordpad.png"), author: "User" },
  }
};
// --- Fake Data End ---


export default function DocumentGallery() {
  const [currentPath, setCurrentPath] = React.useState("Documents");
  const [folderContents, setFolderContents] = React.useState([]);
  // Get Recoil state setter
  const [currentWindows, setWindows] = useRecoilState(windowObj);

  // Initialize folder contents
  React.useEffect(() => {
    setFolderContents(getCurrentFolderContents());
  // }, [currentPath]); // Dependency removed as currentPath doesn't change folder contents anymore
  }, []); // Run only once on mount


  // Get the current folder's contents using fake data
  const getCurrentFolderContents = () => {
    // Always return the contents of the main "Documents" folder
    const mainFolderData = FAKE_DOCUMENTS_DATA["Documents"];
    if (!mainFolderData) return [];

    return Object.keys(mainFolderData).map(itemName => ({
        name: itemName,
        type: 'file', // Assume all items in FAKE_DOCUMENTS_DATA are files
        avatar: mainFolderData[itemName].avatar || require("../../assets/wordpad.png"), // Fallback icon
        author: mainFolderData[itemName].author || "",
      })) || [];
  };


  const handleItemClick = (item) => { // Renamed from handleFolderClick
    if (!item || typeof item !== 'object') return;
    // Handle clicks on files (e.g., open the file)
    // console.log("Clicked on file:", item.name); // Placeholder action removed

    // Update the global window state to open the document viewer
    const updated = {
      documentViewer: {
        ...currentWindows.documentViewer,
        label: item.name, // Set label to document name
        header: `Notepad - ${item.name}`, // Set header dynamically
        visibility: [true, true],
        currentDocument: item, // Pass the full item object
      },
    };

    window.setTimeout(() => {
      setWindows({ ...currentWindows, ...updated });
    }, 300); // Timeout ensures smooth transition
  };

  // Get breadcrumb for display - Simplified as there's only one view now
  const getBreadcrumb = () => {
    return "Documents"; // Always show Documents
  };

  // Get window title
  const getWindowTitle = () => {
    return `Exploring - My Documents`;
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
              src={`${require("../../assets/shaylaOS.png")}`}
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
          <p className="fullWidth">
             Contents of '{getBreadcrumb()}'
           </p>
        </div>
        <div className="flex flex-auto trendingWindow__panels">
          <div className="flex flex-wrap trendingWindow__panel -icons -fullWidth scrollable -yOnly">
            {folderContents && folderContents.length > 0 ? (
              folderContents.map((item, index) => (
                item && (
                  <Icon
                    key={`${item.name || 'unknown'}-${index}`}
                    avatar={item.avatar}
                    name={item.name || 'Unknown'}
                    owner={item.author || ""}
                    highlighted={false}
                    onSingleClick={() => { /* Select item? */ }}
                    onDoubleClick={() => handleItemClick(item)}
                  />
                )
              ))
            ) : (
               <p>This folder is empty.</p>
            )}
          </div>
        </div>

        <div className="trendingWindow__footer">
          <p>{folderContents ? folderContents.length : 0} items</p>
        </div>
      </section>
    </>
  );
}
