import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { globalStyles } from '@theme/globalStyles';
import SchedulerPage from './pages/Scheduler/SchedulerPage';
import StudioPage from './pages/Studio/StudioPage';
import LoginPage from './pages/Login/LoginPage';
import SignUpPage from './pages/SignUp/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage';
import ProtectedRoute from '@auth/ProtectedRoute';

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
            path="/studio/*"
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
