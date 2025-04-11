import React from "react";
import { Bar, Button, List, ListItem, Divider } from "react95";
import { useRecoilValue } from "recoil";

import FileTree from "../../components/FileTree";
import Icon from "./Icon";
import UploadModal from "./UploadModal";
import ImageViewerModal from "./ImageViewerModal";

import { photoFilesQuery } from "../../store";
import { TRENDING_TREE } from "../../constants";

import "./styles.scss";



function PhotoGalleryContent() {
  const photos = useRecoilValue(photoFilesQuery);
  const [selectedFolder, setSelectedFolder] = React.useState("Photos");
  const [currentPath, setCurrentPath] = React.useState("Photos");
  const [folderContents, setFolderContents] = React.useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [isFileMenuOpen, setIsFileMenuOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [isImageViewerOpen, setIsImageViewerOpen] = React.useState(false);
  
  const handleTreeClick = (folderPath) => {
    if (!folderPath) return;
    
    // Parse the folder path
    setCurrentPath(folderPath);
    
    const pathParts = folderPath.split("/");
    if (pathParts.length >= 1) {
      const folderName = pathParts[pathParts.length - 1];
      setSelectedFolder(folderName);
    }
  };

  // Get the current folder's contents
  const getCurrentFolderContents = React.useCallback(() => {
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
    // Month folder - show photos
    else if (pathParts.length === 3) {
      const year = pathParts[1];
      const month = pathParts[2];
      
      console.log("[PhotoGallery] Checking folder:", currentPath);
      console.log("[PhotoGallery] Extracted Year:", year, "Type:", typeof year);
      console.log("[PhotoGallery] Extracted Month:", month, "Type:", typeof month);
      console.log("[PhotoGallery] Photos data (raw):", photos);
      
      if (!photos || !Array.isArray(photos)) return []; // Ensure photos is an array

      // Filter photos for the selected year and month
      const monthPhotos = photos.filter(
        (p) => {
          const yearMatch = p.year && p.year.toString() === year;
          const monthMatch = p.month && p.month === month;
          // Log comparison for each photo
          console.log(`[PhotoGallery] Comparing: Photo Year=${p.year}(${typeof p.year}), Month=${p.month}(${typeof p.month}) with Target Year=${year}, Month=${month}. YearMatch=${yearMatch}, MonthMatch=${monthMatch}`);
          return yearMatch && monthMatch;
        }
      );
      
      console.log("[PhotoGallery] Filtered photos for month:", monthPhotos);

      // Map photo data to the format needed by the Icon component
      return monthPhotos.map((photo) => {
        // Construct the public URL for the photo - ALWAYS use placeholder
        // const imageUrl = photo.file_path 
        //   ? `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${photo.file_path}` 
        //   : require("../../assets/photo.png"); // Fallback icon
        const imageUrl = require("../../assets/photo.png");

        return {
          id: photo.id, // Add id for key prop later if needed
          name: photo.file_name || "Untitled Photo",
          type: "photo", // Differentiate from folders
          avatar: imageUrl,
          author: photo.uploaded_by || "", // Or handle differently if needed
        };
      });
    }
    
    return [];
  }, [currentPath, photos]);

  // Initialize folder contents
  React.useEffect(() => {
    setFolderContents(getCurrentFolderContents());
  }, [currentPath, getCurrentFolderContents]);

  const handleItemClick = (item) => {
    if (!item || typeof item !== 'object') return;

    if (item.type === "folder") {
        if (currentPath === "Photos") {
          handleTreeClick(`Photos/${item.name}`);
        } else {
          const pathParts = currentPath.split("/");
          if (pathParts.length === 2) {
            // From year to month
            handleTreeClick(`${currentPath}/${item.name}`);
          }
        }
    } else if (item.type === "photo") {
        // Open the photo in the image viewer
        setSelectedImage(item);
        setIsImageViewerOpen(true);
    }
  };

  // Get breadcrumb for display
  const getBreadcrumb = () => {
    if (!currentPath) return "Photos";
    return currentPath.replace(/\//g, '\\\\');
  };
  
  // Get window title
  const getWindowTitle = () => {
    return `Exploring - ${getBreadcrumb()}`;
  };

  // Placeholder for actual upload logic
  const handleUpload = (year, month, file) => {
    console.log(`Uploading ${file.name} to ${month}, ${year}`);
    // TODO: Implement actual file upload logic (e.g., API call, state update)
    setIsUploadModalOpen(false); // Close modal after initiating upload
  };

  return (
    <>
      <section className="flex flex-column explorerWindow mostFollowedWindow">
        <div className="flex justify-between explorerWindow__header">
          <div className="flex flex-auto items-center explorerWindow__headerButtons relative">
            <Bar className="explorerWindow__bar" />
            <Button
              variant="menu"
              size="sm"
              onClick={() => setIsFileMenuOpen(!isFileMenuOpen)}
              active={isFileMenuOpen}
            >
              File
            </Button>
            {isFileMenuOpen && (
              <List
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '100%',
                  zIndex: 10
                }}
                onClick={() => setIsFileMenuOpen(false)}
              >
                <ListItem onClick={() => setIsUploadModalOpen(true)}>
                  Upload...
                </ListItem>
                <Divider />
                <ListItem disabled>Close</ListItem>
              </List>
            )}
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
          <span>{getWindowTitle()}</span>
        </div>
        <div className="flex trendingWindow__panelHeader">
          <p>All Folders</p>
          <p>
            Contents of '{getBreadcrumb()}'
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
                    onDoubleClick={() => handleItemClick(folder)}
                  />
                )
              ))
            ) : (
              currentPath.split('/').length === 3 ? (
                 <p style={{ padding: '10px', color: 'gray' }}>No photos in this month yet. Use File &gt; Upload to add some!</p>
              ) : (
                 <p style={{ padding: '10px', color: 'gray' }}>Select a month folder to view photos.</p>
              )
            )}
          </div>
        </div>

        <div className="trendingWindow__footer">
          <p>{folderContents ? folderContents.length : 0} items</p>
        </div>
      </section>

      {/* Render the upload modal conditionally */}
      {isUploadModalOpen && (
        <UploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleUpload}
        />
      )}

      {/* Render the image viewer modal conditionally */}
      {isImageViewerOpen && selectedImage && (
        <ImageViewerModal
          onClose={() => setIsImageViewerOpen(false)}
          image={selectedImage}
        />
      )}
    </>
  );
}

// Wrap the main content component with Suspense
export default function PhotoGallery() {
  return (
    <React.Suspense fallback={<p>Loading photos...</p>}> {/* Simple fallback */}
      <PhotoGalleryContent />
    </React.Suspense>
  );
}
