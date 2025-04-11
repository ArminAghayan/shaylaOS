import React, { useState, useRef, useEffect } from "react";
import { Button, Progress, Window, WindowContent, WindowHeader } from "react95";
import "./styles.scss";

const MusicPlayer = ({ playlist = [], onClose }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState("");
  const [error, setError] = useState("");
  
  const audioRef = useRef(null);
  
  const currentTrack = playlist[currentTrackIndex] || {};
  
  // Load track with authentication if needed
  useEffect(() => {
    const loadTrack = async () => {
      if (playlist.length === 0) return;
      
      setIsLoading(true);
      setError("");
      
      try {
        // First try the direct URL
        if (currentTrack.url) {
          setAudioSrc(currentTrack.url);
        }
        
        // If there's an authentication function, use it as fallback
        if (currentTrack.getAuthContent) {
          // Store the current track index to compare after async operation
          const trackIndexAtStart = currentTrackIndex;
          
          const authenticatedUrl = await currentTrack.getAuthContent();
          
          // Only update if we're still on the same track
          if (trackIndexAtStart === currentTrackIndex && authenticatedUrl) {
            setAudioSrc(authenticatedUrl);
          }
        }
      } catch (err) {
        console.error("Error loading audio:", err);
        setError("Could not load audio file");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTrack();
  }, [playlist, currentTrackIndex, currentTrack]);
  
  // Set up audio src when it changes
  useEffect(() => {
    if (audioRef.current && audioSrc) {
      audioRef.current.src = audioSrc;
      audioRef.current.load();
    }
  }, [audioSrc]);
  
  // Set up audio event listeners
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    
    const handleTimeUpdate = () => setCurrentTime(audioElement.currentTime);
    const handleDurationChange = () => setDuration(audioElement.duration || 0);
    const handleEnded = () => {
      if (currentTrackIndex < playlist.length - 1) {
        setCurrentTrackIndex(currentTrackIndex + 1);
      } else {
        setIsPlaying(false);
      }
    };
    
    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('durationchange', handleDurationChange);
    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('error', (e) => {
      console.error("Audio error:", e);
      setError("Error playing audio file");
    });
    
    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('durationchange', handleDurationChange);
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.removeEventListener('error', () => {});
    };
  }, [currentTrackIndex, playlist.length]);
  
  // Play/pause control
  useEffect(() => {
    if (audioRef.current && audioSrc) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            console.error("Error playing audio:", e);
            setIsPlaying(false);
            
            // If public URL fails, try authenticated URL
            if (currentTrack.getAuthContent && !audioSrc.startsWith('blob:')) {
              handleAuthenticatedPlayback();
            } else {
              setError("Could not play audio file");
            }
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioSrc]);
  
  // Handle authenticated playback
  const handleAuthenticatedPlayback = async () => {
    if (!currentTrack.getAuthContent) return;
    
    setIsLoading(true);
    try {
      const authenticatedUrl = await currentTrack.getAuthContent();
      if (authenticatedUrl) {
        setAudioSrc(authenticatedUrl);
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Error getting authenticated content:", err);
      setError("Could not access audio file");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handlePlayPause = () => {
    if (error && currentTrack.getAuthContent) {
      // If there was an error but we have auth function, try that
      handleAuthenticatedPlayback();
    } else {
      setIsPlaying(!isPlaying);
    }
  };
  
  const handlePrevious = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };
  
  const handleNext = () => {
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };
  
  const handleSeek = (e) => {
    const percent = e.target.value / 100;
    const newTime = duration * percent;
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };
  
  // Format time (seconds) to MM:SS
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage
  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
  
  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      // Revoke any blob URLs we created to avoid memory leaks
      if (audioSrc && audioSrc.startsWith('blob:')) {
        URL.revokeObjectURL(audioSrc);
      }
    };
  }, [audioSrc]);
  
  return (
    <Window className="win95-music-player">
      <WindowHeader className="player-header">
        <span>ShaylaOS Music Player</span>
        <Button onClick={onClose} className="close-button">X</Button>
      </WindowHeader>
      <WindowContent className="player-content">
        <div className="now-playing">
          <p className="track-title">{currentTrack.title || "No track selected"}</p>
          {isLoading && <p className="status-message">Loading audio...</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
        
        <div className="time-display">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        
        <div className="progress-container">
          <input
            type="range"
            min="0"
            max="100"
            value={progressPercentage}
            onChange={handleSeek}
            className="progress-slider"
            disabled={isLoading || error}
          />
        </div>
        
        <div className="controls">
          <Button 
            onClick={handlePrevious} 
            disabled={currentTrackIndex === 0 || playlist.length === 0 || isLoading}
          >
            ◀◀
          </Button>
          <Button 
            onClick={handlePlayPause} 
            disabled={playlist.length === 0 || (isLoading && !error)}
          >
            {isPlaying ? "❚❚" : "▶"}
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={currentTrackIndex === playlist.length - 1 || playlist.length === 0 || isLoading}
          >
            ▶▶
          </Button>
        </div>
        
        <audio ref={audioRef} />
      </WindowContent>
    </Window>
  );
};

export default MusicPlayer; 