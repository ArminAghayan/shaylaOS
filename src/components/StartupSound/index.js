import React from "react";
import { Howl } from "howler";
import startupSound from "../../assets/startup-sound.wav";

export default function StartupSound() {
  const refSound = React.useRef(undefined);

  React.useEffect(() => {
    refSound.current = new Howl({
      src: [startupSound],
      volume: 0.5,
      onend: () => {
        refSound.current = null;
      },
    });
    
    // Play the sound immediately after it's loaded
    refSound.current.once("load", function () {
      this.play();
    });
    
    // Add error handling
    refSound.current.on('loaderror', function(id, err) {
      console.error('Sound loading error:', err);
    });
    
    // Clean up on unmount
    return () => {
      if (refSound.current) {
        refSound.current.unload();
      }
    };
  }, []);

  return null;
}
