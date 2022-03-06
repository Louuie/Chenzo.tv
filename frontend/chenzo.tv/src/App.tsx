import React from 'react';
import { Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import CreatePoll from './components/Poll/CreatePoll';
import Poll from './components/Poll/Poll';

function App() {
  return (
    <Routes>
      <Route path='/poll/create' element={<CreatePoll />}/><Route path='/poll/:id' element={<Poll />}/>
    </Routes>
  );
}

export default App;
