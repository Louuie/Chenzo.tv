import React from 'react';
import { Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import CreatePoll from './components/Poll/CreatePoll';
import AdminLogin from './components/Login/AdminLogin';
import Poll from './components/Poll/Poll';
import AdminCallback from './components/Login/AdminCallback';

function App() {
  return (
    <Routes>
      <Route path='/poll/create' element={<CreatePoll />}/><Route path='/poll/:id' element={<Poll />}/><Route path='/admin/login' element={<AdminLogin />}/><Route path='/admin/login/callback' element={<AdminCallback />}></Route>
      
    </Routes>
  );
}

export default App;
