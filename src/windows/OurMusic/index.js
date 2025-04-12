import React, { useState, useEffect, useCallback } from "react";
import { Bar, Button, List, ListItem, Divider } from "react95";
import Icon from "./Icon";
import { createClient } from "@supabase/supabase-js";
import "./styles.scss";

// Initialize Supabase client only if environment variables are available
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Debug: Log environment variables (masked for security)
console.log("Supabase URL defined:", !!supabaseUrl);
console.log("Supabase Key defined:", !!supabaseKey);
if (supabaseUrl) console.log("URL starts with:", supabaseUrl.substring(0, 10) + "...");

// Only create the client if both URL and key are available
const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Create fake music data similar to the document structure
const FAKE_MUSIC_DATA = {
  "Music": {
    "Electronic Mix.mp3": { url: "#", avatar: require("../../assets/CD.png"), author: "User" },
  }
};

export default function OurMusic({ onPlayTrack }) {
  const [currentPath] = useState("Music");
  const [folderContents, setFolderContents] = useState([]);
  const [fileOpen, setFileOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  // Remove state for player and playlist from here
  // const [showPlayer, setShowPlayer] = useState(false);
  // const [playlist, setPlaylist] = useState([]);
  
  // Get the current folder's contents using fake data
  const getCurrentFolderContents = () => {
    // Always return the contents of the main "Music" folder
    const mainFolderData = FAKE_MUSIC_DATA["Music"];
    if (!mainFolderData) return [];

    return Object.keys(mainFolderData).map(itemName => ({
        name: itemName,
        type: 'file', // Assume all items in FAKE_MUSIC_DATA are files
        avatar: mainFolderData[itemName].avatar || require("../../assets/CD.png"), // Fallback icon
        author: mainFolderData[itemName].author || "",
      })) || [];
  };

  // Fetch music files for the authenticated user
  const fetchMusicFiles = useCallback(async () => {
    if (!supabase) {
      // If Supabase is not configured, use fake data
      setFolderContents(getCurrentFolderContents());
      return;
    }
    
    try {
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        // No authenticated user, use fake data
        setFolderContents(getCurrentFolderContents());
        return;
      }
      
      // Fetch all music files without team filtering
      const { data, error } = await supabase
        .from('music_files')
        .select('*');
        
      if (!error && data) {
        // Format file data for display
        setFolderContents(data.map(file => {
          // Format dates
          const createdDate = file.created_at ? new Date(file.created_at).toLocaleDateString() : 'Unknown';
          
          // Get file extension for better display
          const fileExt = file.file_name ? file.file_name.split('.').pop().toLowerCase() : '';
          
          return {
            name: file.file_name,
            type: 'file',
            avatar: require("../../assets/CD.png"),
            author: file.artist || "Unknown Artist",
            uploader: file.uploaded_by,
            uploadDate: createdDate,
            path: file.file_path || file.file_name,
            id: file.id,
            fileType: file.file_type || `audio/${fileExt}`,
            size: file.file_size ? `${Math.round(file.file_size/1024)} KB` : 'Unknown'
          };
        }));
      } else {
        console.error("Error fetching music files:", error);
        // Fallback to fake data if there's an error
        setFolderContents(getCurrentFolderContents());
      }
    } catch (error) {
      console.error("Error fetching music files:", error);
      // Fallback to fake data
      setFolderContents(getCurrentFolderContents());
    }
  }, []);

  // Initialize folder contents - only run once on mount
  useEffect(() => {
    // Fetch music files on component mount
    fetchMusicFiles();
  }, [fetchMusicFiles]); 

  // Handle file upload
  const handleUpload = async () => {
    // If Supabase is not configured, show message
    if (!supabase) {
      alert("Supabase not configured. Please set environment variables.");
      return;
    }
    
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'audio/*'; // Accept only audio files
    
    // Handle file selection
    fileInput.onchange = async (e) => {
      if (!e.target.files || e.target.files.length === 0) return;
      
      // Use let instead of const to allow reassignment
      let file = e.target.files[0];
      setIsUploading(true);
      
      try {
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        
        if (!currentUser) {
          alert("You must be logged in to upload files.");
          setIsUploading(false);
          return;
        }
        
        // Check if file with same name already exists
        const fileName = file.name;
        const { data: existingFiles } = await supabase
          .from('music_files')
          .select('id, file_name')
          .eq('file_name', fileName);
          
        // If file exists, confirm overwrite or generate unique name
        if (existingFiles && existingFiles.length > 0) {
          if (!window.confirm(`A file named "${fileName}" already exists. Replace it?`)) {
            // Generate unique name if user doesn't want to replace
            const nameParts = fileName.split('.');
            const extension = nameParts.pop();
            const baseName = nameParts.join('.');
            const timestamp = new Date().getTime();
            const newFileName = `${baseName}_${timestamp}.${extension}`;
            
            // Create new file instead of reassigning constant
            const newFile = new File([file], newFileName, { type: file.type });
            file = newFile;
          }
        }
        
        // Upload file to Supabase Storage directly without nested folders
        const filePath = file.name;
        const { error: uploadError } = await supabase.storage
          .from('music-file')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (uploadError) throw uploadError;
        
        // Get public URL for the uploaded file
        const { data } = supabase.storage
          .from('music-file')
          .getPublicUrl(filePath);
          
        // Use the URL data or remove it if not needed
        console.log("File public URL:", data?.publicUrl);
          
        // Save file metadata to database with complete information
        const { error: fileError } = await supabase
          .from('music_files')
          .insert([{
            file_name: file.name,
            file_path: filePath,
            file_size: file.size,
            file_type: file.type,
            uploaded_by: currentUser.id,
            title: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
            artist: currentUser.email || "Unknown Artist", // Default to user email
            created_at: new Date(),
            updated_at: new Date()
          }]);
          
        if (fileError) throw fileError;
        
        // Refresh file list
        fetchMusicFiles();
        
        alert("File uploaded successfully!");
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file: " + error.message);
      } finally {
        setIsUploading(false);
        setFileOpen(false); // Close the dropdown
      }
    };
    
    // Trigger the file input click
    fileInput.click();
  };

  // Get public URL or authenticated blob URL for a file
  const getFileUrl = useCallback(async (filePath) => {
    if (!supabase || !filePath) return null;
    
    try {
      // Try getting public URL first
      const { data: publicData } = supabase.storage
        .from('music-file')
        .getPublicUrl(filePath);
      
      if (publicData && publicData.publicUrl) {
        // Check if the public URL is accessible (basic check)
        try {
          const response = await fetch(publicData.publicUrl, { method: 'HEAD' });
          if (response.ok) {
             return { url: publicData.publicUrl };
          } 
          // If HEAD request fails (e.g., CORS or 404), fall through to authenticated download
        } catch (headError) {
          // Fall through if HEAD request fails
          console.warn("Public URL HEAD check failed, trying authenticated download:", headError);
        }
      }

      // If public URL is not accessible or doesn't exist, try authenticated download
      const { data: blobData, error: downloadError } = await supabase.storage
        .from('music-file')
        .download(filePath);
        
      if (downloadError) {
        console.error("Error downloading file:", downloadError);
        return null;
      }
      
      // Create a blob URL from the downloaded data
      const blobUrl = URL.createObjectURL(blobData);
      return { url: blobUrl }; // Return blob URL
      
    } catch (error) {
      console.error("Error getting file URL:", error);
      return null;
    }
  }, []); // Add dependencies if needed, supabase should be stable

  // Modified to call onPlayTrack with resolved URL
  const handleItemClick = useCallback(async (item) => {
    if (!item || typeof item !== 'object' || !onPlayTrack) return;
    
    // Get the file URL (public or blob)
    const fileData = await getFileUrl(item.path || item.name);
    
    if (fileData && fileData.url) {
      // Call the handler passed from Desktop with the resolved URL and title
      onPlayTrack({ 
        url: fileData.url, 
        title: item.name || "Unknown" 
      });
    } else {
      console.error("Could not get file URL for playback");
      alert("Error: Could not load the selected music file."); // User feedback
    }
  }, [onPlayTrack, getFileUrl]); // Add dependencies

  // Get breadcrumb for display - Simplified as there's only one view now
  const getBreadcrumb = () => {
    return "Music"; // Always show Music
  };

  return (
    <React.Fragment>
      <section className="flex flex-column explorerWindow mostFollowedWindow">
        <div className="flex justify-between explorerWindow__header">
          <div className="flex flex-auto items-center explorerWindow__headerButtons">
            <Bar className="explorerWindow__bar" />
            <div style={{ position: 'relative' }}>
              <Button
                variant="menu"
                size="sm"
                onClick={() => {
                  setFileOpen(!fileOpen);
                  setEditOpen(false);
                  setViewOpen(false);
                }}
              >
                File
              </Button>
              {fileOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 999 }}>
                  <List>
                    <ListItem onClick={handleUpload} disabled={isUploading}>
                      {isUploading ? 'Uploading...' : 'Upload'}
                    </ListItem>
                    <Divider />
                    <ListItem disabled>Music</ListItem>
                    <ListItem disabled>Videos</ListItem>
                  </List>
                </div>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <Button
                variant="menu"
                size="sm"
                onClick={() => {
                  setEditOpen(!editOpen);
                  setFileOpen(false);
                  setViewOpen(false);
                }}
              >
                Edit
              </Button>
              {editOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 999 }}>
                  <List>
                    <ListItem disabled>Option 1</ListItem>
                    <ListItem disabled>Option 2</ListItem>
                    <ListItem disabled>Option 3</ListItem>
                  </List>
                </div>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <Button
                variant="menu"
                size="sm"
                onClick={() => {
                  setViewOpen(!viewOpen);
                  setFileOpen(false);
                  setEditOpen(false);
                }}
              >
                View
              </Button>
              {viewOpen && (
                <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 999 }}>
                  <List>
                    <ListItem disabled>Option 1</ListItem>
                    <ListItem disabled>Option 2</ListItem>
                    <ListItem disabled>Option 3</ListItem>
                  </List>
                </div>
              )}
            </div>
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
            {isUploading ? (
              <p>Uploading file...</p>
            ) : folderContents && folderContents.length > 0 ? (
              folderContents.map((item, index) => (
                item && (
                  <Icon
                    key={`${item.name || 'unknown'}-${index}`}
                    name={item.name || 'Unknown'}
                    type={item.type}
                    avatar={item.avatar}
                    author={item.author || ""}
                    size={item.size}
                    date={item.uploadDate}
                    highlighted={false}
                    onSingleClick={() => { /* Add single click behavior if needed */ }}
                    onDoubleClick={() => handleItemClick(item)}
                  />
                )
              ))
            ) : (
              <p>No files found.</p>
            )}
          </div>
        </div>
      </section>
    </React.Fragment>
  );
}