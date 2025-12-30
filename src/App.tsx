import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { globalStyles } from '@theme/globalStyles';
import SchedulerPage from './pages/Scheduler/SchedulerPage';
import StudioPage from './pages/Studio/StudioPage';
import ContentPage from './pages/Content/ContentPage';
import LoginPage from './pages/Auth/Login/LoginPage';
import SignUpPage from './pages/Auth/SignUp/SignUpPage';
import ForgotPasswordPage from './pages/Auth/ForgotPassword/ForgotPasswordPage';
import EmailVerificationPage from './pages/Auth/EmailVerification/EmailVerificationPage';
import ProtectedRoute from '@auth/ProtectedRoute';
import AuthActionPage from './pages/Auth/AuthAction/AuthActionPage';
import ResetPasswordPage from './pages/Auth/ResetPassword/ResetPAsswordPage';
import CreateBrandPage from './pages/CreateBrand/CreateBrandPage';
import CreateUserPage from './pages/CreateUser/CreateUserPage';
import { useAuth } from '@auth/AuthProvider';

// A special wrapper for pages that require auth but not full profile/brand setup
function AuthOnlyRoute({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(155, 93, 229, 0.2)',
          borderTopColor: '#9b5de5',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <p style={{ color: '#6b7280', fontSize: '16px', fontWeight: 500 }}>Loading...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!user.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }
  
  return children;
}

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
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/auth/action" element={<AuthActionPage />} />
          
          {/* User profile setup route - requires auth but allows users without profile */}
          <Route
            path="/tell-us-who-you-are"
            element={
              <AuthOnlyRoute>
                <CreateUserPage />
              </AuthOnlyRoute>
            }
          />
          
          {/* Brand creation route - requires auth and profile but allows users without brands */}
          <Route
            path="/create-your-first-brand"
            element={
              <AuthOnlyRoute>
                <CreateBrandPage />
              </AuthOnlyRoute>
            }
          />

          {/* protected app routes - requires auth, profile, AND at least one brand */}
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
              </ProtectedRoute>
            } 
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