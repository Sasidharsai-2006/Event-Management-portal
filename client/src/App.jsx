import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getMe } from './store/slices/authSlice'
import { reset } from './store/slices/authSlice'

// Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import LoadingSpinner from './components/ui/LoadingSpinner'

// Pages
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import Clubs from './pages/Clubs'
import ClubDetails from './pages/ClubDetails'
import Profile from './pages/Profile'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminEvents from './pages/admin/AdminEvents'
import AdminClubs from './pages/admin/AdminClubs'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import CreateEvent from './pages/CreateEvent'
import CreateClub from './pages/CreateClub'
import Results from './pages/Results'

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isLoading } = useSelector((state) => state.auth)
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />
  }
  
  return children
}

// Public Route Component (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { user, isLoading } = useSelector((state) => state.auth)
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  if (user) {
    return <Navigate to="/" replace />
  }
  
  return children
}

function App() {
  const dispatch = useDispatch()
  const { user, isLoading } = useSelector((state) => state.auth)

  useEffect(() => {
    // Reset auth state on app load
    dispatch(reset())
    
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (token && !user) {
      dispatch(getMe())
    }
  }, [dispatch, user])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/clubs/:id" element={<ClubDetails />} />
          <Route path="/results" element={<Results />} />
          
          {/* Auth Routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } 
          />
          
          {/* Protected Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-event" 
            element={
              <ProtectedRoute requiredRole="club_rep">
                <CreateEvent />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-club" 
            element={
              <ProtectedRoute>
                <CreateClub />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminUsers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/events" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminEvents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/clubs" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminClubs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/analytics" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminAnalytics />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  )
}

export default App
