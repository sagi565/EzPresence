import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SchedulerPage from '@pages/Scheduler/SchedulerPage';
import StudioPage from '@pages/Studio/StudioPage';
import { globalStyles } from '@theme/globalStyles';
import LoginPage from '@pages/Login/LoginPage'
import SignUpPage from '@pages/SignUp/SignUpPage'

function App() {
  return (
    <>
      <style>{globalStyles}</style>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/studio" replace />} />
          <Route path="/scheduler" element={<SchedulerPage />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/studio/:section" element={<StudioPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<Navigate to="/studio" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;