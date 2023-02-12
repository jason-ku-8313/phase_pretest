import React, { useState } from 'react'
import './App.css';
import Welcome from './components/Welcome';
import Canvas from './components/Canvas';
import CommentDialog from './components/CommentDialog';
import { UserContext } from './context/UserContext';

function App() {

  const [user, setUser] = useState({ username: 'Anonymous' });
  return (
    <div className="App">
      <UserContext.Provider value={{ user, setUser }}>
        <Welcome />
        <Canvas />
        <CommentDialog />
      </UserContext.Provider>
    </div>
  );
}

export default App;
