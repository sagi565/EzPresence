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
import TermsOfServicePage from './pages/Legal/TermsOfServicePage';
import PrivacyPolicyPage from './pages/Legal/PrivacyPolicyPage';
import HomePage from './pages/Home/HomePage';

function App() {
  return (
    <>
      <style>{globalStyles}</style>
      <BrowserRouter>
        <Routes>
          {/* public legal pages */}
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

          {/* public auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/auth/action" element={<AuthActionPage />} />

          <Route
            path="/tell-us-who-you-are"
            element={
              <ProtectedRoute>
                <CreateUserPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-your-first-brand"
            element={
              <ProtectedRoute>
                <CreateBrandPage />
              </ProtectedRoute>
            }
          />

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
            path="/studio/:section?"
            element={
              <ProtectedRoute>
                <StudioPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/scheduler" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;