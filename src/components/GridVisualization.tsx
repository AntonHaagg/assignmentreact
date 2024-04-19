import React from 'react';
import './GridVisualization.css';

interface GridVisualizationProps {
  width: number;
  height: number;
  robotX: number;
  robotY: number;
  robotOrientation: 'N' | 'E' | 'S' | 'W';
  onChangeSize: (newWidth: number, newHeight: number) => void;
}

const GridVisualization: React.FC<GridVisualizationProps> = ({ width, height, robotX, robotY, robotOrientation, onChangeSize }) => {
  const squareSize = Math.min(width, height) * 50; // Adjust size as needed
  const horizontalLines: JSX.Element[] = [];
  const verticalLines: JSX.Element[] = [];

  const squareStyle = {
    width: `${squareSize}px`,
    height: `${squareSize}px`,
    backgroundColor: '#666666', 
    margin: 'auto',
    position: 'relative',
  };

  const horizontalLineStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '1px',
    backgroundColor: 'white',
  };

  const verticalLineStyle: React.CSSProperties = {
    position: 'absolute',
    width: '1px',
    height: '100%',
    backgroundColor: 'white',
  };

  const gap = squareSize / height;
  const verticalGap = squareSize / width;

  for (let i = 1; i < height; i++) {
    const lineTop = i * gap;
    horizontalLines.push(
      <div className="horizontal-line" key={i} style={{ ...horizontalLineStyle, top: `${lineTop}px` }} />
    );
  }

  for (let i = 1; i < width; i++) {
    const lineLeft = i * verticalGap;
    verticalLines.push(
      <div className="vertical-line" key={i} style={{ ...verticalLineStyle, left: `${lineLeft}px` }} />
    );
  }

  const arrowIcons: { [key: string]: string } = {
    N: '↑',
    E: '→',
    S: '↓',
    W: '←',
  };

  const arrowStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${(robotY + 0.5) * gap}px`,
    left: `${(robotX + 0.5) * verticalGap}px`,
    transform: 'translate(-50%, -50%)',
    width: '20px',
    height: '20px',
    fontSize: '24px',
    lineHeight: '20px',
    textAlign: 'center',
    zIndex: 2,
    color: 'green',
  };

  return (
    <div className="grid">
      <div className="square" style={squareStyle}>
        {horizontalLines}
        {verticalLines}
        {/* Arrow element */}
        <div className="arrow" style={arrowStyle}>
          {arrowIcons[robotOrientation]}
        </div>
      </div>
    </div>
  );
};

export default GridVisualization;
