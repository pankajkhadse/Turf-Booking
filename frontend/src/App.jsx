import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Layout        from './components/layout/Layout'
import HomePage      from './pages/HomePage'
import TurfsPage     from './pages/TurfsPage'
import TurfDetailPage from './pages/TurfDetailPage'
import BookingPage   from './pages/BookingPage'
import BookingsPage  from './pages/BookingsPage'
import LoginPage     from './pages/LoginPage'
import RegisterPage  from './pages/RegisterPage'
import OwnerDashboard from './pages/OwnerDashboard'
import NotFoundPage  from './pages/NotFoundPage'

// Protect routes based on auth state and role
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }
  return children
}

const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/"        element={<HomePage />} />
        <Route path="/turfs"   element={<TurfsPage />} />
        <Route path="/turfs/:id" element={<TurfDetailPage />} />

        <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        <Route path="/book/:turfId" element={
          <ProtectedRoute allowedRoles={['client']}>
            <BookingPage />
          </ProtectedRoute>
        } />

        <Route path="/bookings" element={
          <ProtectedRoute allowedRoles={['client']}>
            <BookingsPage />
          </ProtectedRoute>
        } />

        <Route path="/owner/dashboard" element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerDashboard />
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
