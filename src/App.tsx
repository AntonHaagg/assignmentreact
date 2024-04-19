import React from 'react';
import GridVisualization from './components/GridVisualization.tsx';
import ParentComponent from './components/GridParentComponent.tsx';


const App: React.FC = () => {
  return (
    <div className="App">
      <ParentComponent />
    </div>
  );
};

export default App;