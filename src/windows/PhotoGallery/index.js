import React from "react";
import { Bar, Button, List, ListItem, Divider } from "react95";
import { useRecoilValue } from "recoil";

import FileTree from "../../components/FileTree";
import Icon from "./Icon";
import UploadModal from "./UploadModal";

import { photoFilesQuery } from "../../store";
import { TRENDING_TREE } from "../../constants";

// Import Supabase client to use in development
import { createClient } from "@supabase/supabase-js";

import "./styles.scss";

// Test image (a reliable public image for testing)
import testImage from "../../assets/photo.png";

// Supabase configuration from environment variables
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;
const BUCKET_NAME = 'photos'; // The bucket name used in UploadModal

// Initialize Supabase client
const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

console.log("Supabase URL:", SUPABASE_URL);
console.log("Supabase ANON Key available:", !!SUPABASE_ANON_KEY);
console.log("Supabase client initialized:", !!supabase);

function PhotoGalleryContent({ onViewImage }) {
  const photos = useRecoilValue(photoFilesQuery);
  const [selectedFolder, setSelectedFolder] = React.useState("Photos");
  const [currentPath, setCurrentPath] = React.useState("Photos");
  const [folderContents, setFolderContents] = React.useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [isFileMenuOpen, setIsFileMenuOpen] = React.useState(false);
  
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
        // Check if photo has a real URL to display
        let imageUrl = testImage; // Always use test image for thumbnails in gallery
        let actualImageUrl = null;
        
        // For the image viewer
        if (photo.file_path) {
          try {
            // Create a public URL for the image in Supabase storage
            if (supabase) {
              const { data } = supabase
                .storage
                .from(BUCKET_NAME)
                .getPublicUrl(photo.file_path);
              
              if (data && data.publicUrl) {
                actualImageUrl = data.publicUrl;
                console.log("Generated Supabase public URL using SDK:", actualImageUrl);
              } else {
                // Fallback to direct URL construction
                actualImageUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${photo.file_path}`;
                console.log("Fallback to direct URL:", actualImageUrl);
              }
            } else {
              // If Supabase client isn't available, construct URL directly
              actualImageUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${photo.file_path}`;
              console.log("No Supabase client, using direct URL:", actualImageUrl);
            }
          } catch (error) {
            console.error("Error generating public URL:", error);
            actualImageUrl = testImage; // Fallback to test image on error
          }
        } else if (photo.url) {
          actualImageUrl = photo.url;
          console.log("Using photo.url directly:", actualImageUrl);
        } else {
          actualImageUrl = testImage;
          console.log("No URL available, using test image");
        }

        console.log("Full photo object:", photo);
        
        return {
          id: photo.id,
          name: photo.file_name || "Untitled Photo",
          type: "photo",
          avatar: imageUrl, // Small image icon 
          actualImage: actualImageUrl, // Full-size image for viewer
          author: photo.uploaded_by || "",
          size: photo.file_size ? `${Math.round(photo.file_size / 1024)} KB` : 'Unknown',
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
        // Instead of opening local modal, use the prop function
        if (onViewImage) {
          onViewImage(item);
        } else {
          console.warn("onViewImage prop not provided to PhotoGallery");
        }
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
    </>
  );
}

// Wrap the main content component with Suspense
export default function PhotoGallery({ onViewImage }) {
  return (
    <React.Suspense fallback={<p>Loading photos...</p>}> {/* Simple fallback */}
      <PhotoGalleryContent onViewImage={onViewImage} />
    </React.Suspense>
  );
}
