import React from "react";
import { Window, WindowContent, Button, Fieldset, TextField } from "react95";
// Import Supabase client (adjust path if necessary)
// Import createClient directly
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client only if environment variables are available
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Only create the client if both URL and key are available
const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null;

export default function UploadModal({ onClose }) {
  // Define arrays inside the component scope
  const years = [
    { value: '2024', label: '2024' },
    { value: '2025', label: '2025' },
    // Add more years if needed
  ];
  const months = [
    { value: 'January', label: 'January' },
    { value: 'February', label: 'February' },
    { value: 'March', label: 'March' },
    { value: 'April', label: 'April' },
    { value: 'May', label: 'May' },
    { value: 'June', label: 'June' },
    { value: 'July', label: 'July' },
    { value: 'August', label: 'August' },
    { value: 'September', label: 'September' },
    { value: 'October', label: 'October' },
    { value: 'November', label: 'November' },
    { value: 'December', label: 'December' },
  ];

  // Explicitly get initial values
  const initialYear = years[0]?.value;
  const initialMonth = months[0]?.value;
  // console.log("Directly read initial values - Year:", initialYear, "Month:", initialMonth); // Keep for debugging if needed

  const [selectedYear, setSelectedYear] = React.useState(initialYear);
  const [selectedMonth, setSelectedMonth] = React.useState(initialMonth);
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [fileNameDisplay, setFileNameDisplay] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false); // Added loading state

  // Define stable onChange handlers using useCallback
  const handleYearChange = React.useCallback((event) => {
    const newValue = event.target.value;
    // Log the raw value received from Select
    // console.log("handleYearChange received:", newValue); // Keep for debugging if needed
    // Check if the received value is valid before updating state
    if (newValue !== undefined && newValue !== null) {
      setSelectedYear(newValue);
      // console.log("Year state updated to:", newValue); // Keep for debugging if needed
    } else {
      console.error("Received invalid value for year:", newValue);
    }
  }, []); // No dependencies needed as setSelectedYear is stable

  const handleMonthChange = React.useCallback((event) => {
    const newValue = event.target.value;
    // Log the raw value received from Select
    // console.log("handleMonthChange received:", newValue); // Keep for debugging if needed
    // Check if the received value is valid before updating state
    if (newValue !== undefined && newValue !== null) {
      setSelectedMonth(newValue);
      // console.log("Month state updated to:", newValue); // Keep for debugging if needed
    } else {
      console.error("Received invalid value for month:", newValue);
    }
  }, []); // No dependencies needed as setSelectedMonth is stable

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setFileNameDisplay(file.name); // Show the selected file name
    } else {
      setSelectedFile(null);
      setFileNameDisplay("");
    }
  };

  const handleUploadClick = async () => { // Made async
    if (!selectedFile || !selectedYear || !selectedMonth) {
      alert("Please select a year, month, and file to upload.");
      return;
    }

    // Check if Supabase client is initialized
    if (!supabase) {
      alert("Supabase client is not configured. Please check environment variables.");
      setIsUploading(false); // Ensure loading state is reset
      return;
    }

    setIsUploading(true); // Start loading

    try {
      // 1. Get user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error(userError?.message || "Authentication error: User not found.");
      }
      const userId = user.id;

      // 2. Prepare file details
      // Sanitize the original filename to remove spaces and potentially problematic characters
      const sanitizedOriginalName = selectedFile.name.replace(/[\\s]+/g, '_').replace(/[^\\w.\\-_]/g, '');
      // Construct the final filename with timestamp and sanitized name
      const fileName = `${Date.now()}_${sanitizedOriginalName}`;
      // Store file directly in the root of the bucket using the sanitized name.
      const filePath = `${fileName}`;
      const bucketName = 'photos'; // *** Confirm this bucket name ***

      // 3. Upload to Storage
      console.log(`Uploading ${fileName} to ${bucketName}/${filePath}`);
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, selectedFile, {
            cacheControl: '3600', // Optional: Add cache control
            upsert: false // Optional: Don't overwrite existing files with the same name
        });

      if (uploadError) {
        console.error("Storage Upload Error:", uploadError);
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }
      console.log("File uploaded successfully to storage.");


      // 4. Insert into Database
      console.log("Inserting metadata into photo_files table...");
      const { error: insertError } = await supabase
        .from('photo_files')
        .insert({
          file_name: fileName, // Use the timestamped name
          file_path: filePath, // Store the full path used in storage
          file_size: selectedFile.size,
          file_type: selectedFile.type,
          year: selectedYear,
          month: selectedMonth,
          uploaded_by: userId,
          // team_id: null, // Set team_id if applicable and available
        });

      if (insertError) {
        console.error("Database Insert Error:", insertError);
        // Attempt to delete the file from storage if DB insert fails to avoid orphans
        console.warn(`Database insert failed. Attempting to remove uploaded file: ${filePath}`);
        await supabase.storage.from(bucketName).remove([filePath]);
        throw new Error(`Failed to save photo metadata: ${insertError.message}`);
      }
      console.log("Metadata inserted successfully into database.");


      // 5. Success
      alert("Upload successful!");
      onClose(); // Close modal on success

    } catch (error) {
      console.error("Upload process failed:", error);
      alert(`Upload failed: ${error.message}`);
      // Potentially add more specific error handling or UI feedback
    } finally {
      setIsUploading(false); // Stop loading regardless of outcome
    }
  };


  // Ref to trigger file input click
  const fileInputRef = React.useRef(null);

  // Log state just before render
  // console.log("Rendering UploadModal - Year:", selectedYear, "Month:", selectedMonth); // Keep for debugging if needed

  return (
    <Window
      className="upload-modal"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 100
      }}
      width="350"
      height="auto"
      icon={<img src={require("../../assets/folder-open.png")} alt="" width="20" height="20" />}
      title="Upload Photo"
      defaultPosition={{ }}
      menu={[
        { name: 'File', list: <></> },
        { name: 'Help', list: <></> },
      ]}
    >
      <WindowContent style={{ padding: '1rem' }}>
        <Fieldset label="Select Destination:" style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
            {/* Standard HTML select for Year */}
            <select
              value={selectedYear}
              onChange={handleYearChange}
              style={{ width: '100px', height: '28px' /* Adjust height as needed */ }}
            >
              {years.map(year => (
                <option key={year.value} value={year.value}>
                  {year.label}
                </option>
              ))}
            </select>

            {/* Standard HTML select for Month */}
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              style={{ width: '150px', height: '28px' /* Adjust height as needed */ }}
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        </Fieldset>

        <Fieldset label="Select File:" style={{ marginBottom: '1rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <TextField
                value={fileNameDisplay}
                placeholder="No file selected..."
                readOnly
                style={{ flexGrow: 1 }}
             />
             <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
             />
             <Button onClick={() => fileInputRef.current?.click()}>
               Browse...
             </Button>
           </div>
        </Fieldset>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
          <Button onClick={handleUploadClick} disabled={!selectedFile || isUploading}>
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
          <Button onClick={onClose} disabled={isUploading}>Cancel</Button>
        </div>
      </WindowContent>
    </Window>
  );
} 