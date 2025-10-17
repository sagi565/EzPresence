import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { globalStyles } from '@theme/globalStyles';
import SchedulerPage from './pages/Scheduler/SchedulerPage';
import StudioPage from './pages/Studio/StudioPage';
import ContentPage from './pages/Content/ContentPage';
import LoginPage from './pages/Login/LoginPage';
import SignUpPage from './pages/SignUp/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage';
import EmailVerificationPage from './pages/EmailVerification/EmailVerificationPage';
import ProtectedRoute from '@auth/ProtectedRoute';
import AuthActionPage from './pages/AuthAction/AuthActionPage';
import VerificationHandler from './pages/VerificationHandler/VerificationHandler';

function App() {
  return (
    <>
      <style>{globalStyles}</style>
      <BrowserRouter>
        <Routes>
          {/* public auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/verify-email-pending" element={<VerificationHandler />} />
          <Route path="/auth/action" element={<AuthActionPage />} />

          {/* protected app routes */}
          <Route
            path="/scheduler"
            element={
              <ProtectedRoute>
                <SchedulerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/content"
            element={
              <ProtectedRoute>
                <ContentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/studio/*"
            element={
              <ProtectedRoute>
                <StudioPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/studio/:section" 
            element={
              <ProtectedRoute>
                <StudioPage />
              </ProtectedRoute>} 
            />
            
          {/* fallback */}
          <Route path="/" element={<Navigate to="/scheduler" replace />} />
          <Route path="*" element={<Navigate to="/scheduler" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;