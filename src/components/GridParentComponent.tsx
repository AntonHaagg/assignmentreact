import React, { useState } from 'react';
import GridVisualization from './GridVisualization.tsx';
import './styles.css';

const ParentComponent: React.FC = () => {
  const [width, setWidth] = useState<number>(5);
  const [height, setHeight] = useState<number>(5);
  const [robotX, setRobotX] = useState<number>(0);
  const [robotY, setRobotY] = useState<number>(0);
  const [robotOrientation, setRobotOrientation] = useState<'N' | 'E' | 'S' | 'W'>('N');
  const [robotInstructions, setRobotInstructions] = useState<string>('');
  const [commands, setCommands] = useState<string>('');


  const handleChangeSize = (newWidth: number, newHeight: number) => {
    setWidth(newWidth);
    setHeight(newHeight);
  };

const handleWidthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  let newWidth = Number(event.target.value);
  if (newWidth <= 1) {
    newWidth = 1;
  }

  if (newWidth >= 10) {
    newWidth = 10;
  }
  setWidth(newWidth);
};

const handleHeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  let newHeight = Number(event.target.value);
  if (newHeight <= 1) {
    newHeight = 1;
  }

  if (newHeight >= 10) {
    newHeight = 10;
  }
  setHeight(newHeight);
};

  const handleRobotXChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRobotX(Number(event.target.value));
  };

  const handleRobotYChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRobotY(Number(event.target.value));
  };

  const handleOrientationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRobotOrientation(event.target.value as 'N' | 'E' | 'S' | 'W');
  };

  const handleInstructionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRobotInstructions(event.target.value);
    setCommands(event.target.value);
  };

  const simulateRobotMovement = async (robotStates, navigationResultType) => {
    const updateRobot = async (index) => {
      if (index === robotStates.length) {
        const lastState = robotStates[robotStates.length - 1];
        let alertMessage;
        if (navigationResultType === "FINISHED") {
          alertMessage = `Report: ${lastState.position.x.value} ${lastState.position.y.value} ${lastState.orientation}`;
        } else if (navigationResultType === "ENTERED_VOID") {
          alertMessage = `ERROR: Out of bounds at ${lastState.position.x.value} ${lastState.position.y.value} ${lastState.orientation}`;
        } else if (navigationResultType === "INVALID_NAVIGATION_COMMAND") {
          alertMessage = "ERROR: Invalid robot instructions";
        } else {
          alertMessage = "Unknown error";
        }
  
        alert(alertMessage);
  
        return;
      }
  
      const state = robotStates[index];
      const { x, y } = state.position;
      let orientation = state.orientation;
  
      if (orientation === "NORTH") {
        orientation = "N";
      } else if (orientation === "EAST") {
        orientation = "E";
      } else if (orientation === "SOUTH") {
        orientation = "S";
      } else if (orientation === "WEST") {
        orientation = "W";
      }
  
      setRobotX(x.value);
      setRobotY(y.value);
      setRobotOrientation(orientation);
  
      await new Promise(resolve => setTimeout(resolve, 500));
  
      updateRobot(index + 1);
    };
  
    updateRobot(0);
  };
  
  
  
  
  const handleStart = async () => {

    if (width === 0 || height === 0 || robotInstructions === '') {
      alert('Please fill in all fields before starting.');
      return; 
    }
    const data = {
      width: width,
      height: height,
      x: robotX,
      y: robotY,
      orientation: robotOrientation,
      commands: robotInstructions
    };
  
    try {
      const response = await fetch('http://localhost:8080/api/navigate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log('Navigation result:', result);
  
        await simulateRobotMovement(result.robotStates, result.navigationResultType);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

return (
  <div className="parent-container">
    {}
    <fieldset className="input-box room-size">
  <legend>ROOM SIZE</legend>
  <div>
    <label className="label" htmlFor="widthInput">Width:</label>
    <input className="input-field" type="number" id="widthInput" value={width} onChange={handleWidthChange} />
  </div>
  <div>
    <label className="label" htmlFor="heightInput">Height:</label>
    <input className="input-field" type="number" id="heightInput" value={height} onChange={handleHeightChange} />
  </div>
</fieldset>

<fieldset className="input-box robot-position">
  <legend>ROBOT STARTING POSITION</legend>
  <div>
    <label className="label" htmlFor="robotXInput">Robot X:</label>
    <input className="input-field" type="number" id="robotXInput" value={robotX} onChange={handleRobotXChange} />
  </div>
  <div>
    <label className="label" htmlFor="robotYInput">Robot Y:</label>
    <input className="input-field" type="number" id="robotYInput" value={robotY} onChange={handleRobotYChange} />
  </div>
  <div>
    <label className="label" htmlFor="orientationSelect">Robot Orientation:</label>
    <select id="orientationSelect" value={robotOrientation} onChange={handleOrientationChange}>
      <option value="N">N</option>
      <option value="E">E</option>
      <option value="S">S</option>
      <option value="W">W</option>
    </select>
  </div>
  <div>
    <label className="label" htmlFor="instructionsInput">Robot Commands:</label>
    <input className="input-field" type="text" id="instructionsInput" value={robotInstructions} onChange={handleInstructionsChange} />
  </div>
</fieldset>

    {}
    <GridVisualization
      width={width}
      height={height}
      robotX={robotX}
      robotY={robotY}
      robotOrientation={robotOrientation}
      onChangeSize={handleChangeSize}
    />
    <button className="start-button" disabled={width === 0 || height === 0 || robotInstructions === ''} onClick={handleStart}>Start</button>
  </div>
);

};

export default ParentComponent;
