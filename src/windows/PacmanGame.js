import React, { useEffect, useState } from 'react';
import Pacman from 'react-pacman';
import './PacmanGame.css';

function PacmanGame() {
  const [gameKey, setGameKey] = useState(0);

  // Add setImmediate polyfill for browser compatibility
  useEffect(() => {
    // Polyfill for setImmediate (which isn't available in some browsers)
    if (!window.setImmediate) {
      window.setImmediate = function(callback) {
        return setTimeout(callback, 0);
      };
    }
    
    return () => {
      // Clean up
    };
  }, []);

  // Function to restart the game by remounting the component
  const restartGame = () => {
    setGameKey(prev => prev + 1);
  };

  return (
    <div className="pacman-container">
      <Pacman 
        key={gameKey} 
        onEnd={() => {
          // After game ends, show restart button
          setTimeout(() => {
            const gameOverElem = document.querySelector('.game-over');
            if (gameOverElem) {
              const restartBtn = document.createElement('button');
              restartBtn.innerText = 'Play Again';
              restartBtn.className = 'restart-button';
              restartBtn.onclick = restartGame;
              gameOverElem.appendChild(restartBtn);
            }
          }, 1000); // Wait a bit for game over to appear
        }}
      />
    </div>
  );
}

export default PacmanGame; 