import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import HomePage from './pages/Home'
import DashboardPage from './pages/Dashboard'
import WatchlistPage from './pages/Watchlist'
import ComparePage from './pages/Compare'
import LoginPage from './pages/Login'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/dashboard' element={<DashboardPage />} />
          <Route path='/watchlist' element={<WatchlistPage />} />
          <Route path='/compare' element={<ComparePage />} />
          <Route path='/login' element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
