# Music Upload Functionality

This document explains how to use the music upload functionality in the application.

## Overview

The music upload system allows team members to upload and share music files with their team. It uses Supabase's Row Level Security (RLS) to ensure that only authorized users can access, upload, and manage music files.

## File Structure

Music files are stored with the following organization:
- All files are uploaded to the "music-file" bucket in Supabase Storage
- Files follow the path pattern: `teams/{team_id}/{filename}`
- Example: `teams/123e4567-e89b-12d3-a456-426614174000/mysong.mp3`

## Database Schema

The music files metadata is stored in the `music_files` table with the following fields:
- `id`: UUID primary key
- `file_name`: The name of the music file
- `file_path`: The complete storage path
- `file_size`: Size of the file in bytes
- `file_type`: The MIME type of the file (e.g., "audio/mpeg")
- `team_id`: The UUID of the team it belongs to
- `uploaded_by`: The user who uploaded the file (set automatically by RLS)
- `created_at`: Timestamp of when the file was uploaded
- `title`: Optional title for the music file
- `artist`: Optional artist name

## Security Rules (RLS)

The application enforces the following security rules:
1. Users can only view music files from teams they are members of
2. Only the file uploader and team admins can update music files
3. Only the file uploader and team admins can delete music files
4. Users can only upload files to their team's folder in storage

## How to Use

### Uploading Music Files
1. Open the "Our Music" application
2. Select your team from the dropdown
3. Click the "File" menu and select "Upload"
4. Choose an audio file from your computer
5. The file will be uploaded and appear in the list

### Playing Music Files
1. Click on a music file in the list
2. The file will start playing automatically

### Managing Music Files
- Only the person who uploaded a file or team admins can delete files
- To rename or update metadata, right-click on a file and select "Properties"

## Utility Functions

For developers, the following utility functions are available:

```javascript
// Import music utilities
import { uploadMusicFile, getTeamMusicFiles, getMusicFileUrl, deleteMusicFile } from "../utilities/musicUtils";

// Upload a new music file
const { data, error } = await uploadMusicFile(file, teamId, {
  title: "My Custom Title",
  artist: "Artist Name" 
});

// Get all music files for a team
const { data, error } = await getTeamMusicFiles(teamId);

// Get a streaming URL for a music file
const { url, error } = await getMusicFileUrl(filePath);

// Delete a music file
const { success, error } = await deleteMusicFile(fileId, filePath);
```

## Troubleshooting

- **Upload fails**: Ensure you are a member of the selected team
- **Can't see files**: Confirm you are logged in and a member of the team
- **Can't play files**: Check if the file format is supported by your browser 