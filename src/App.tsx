import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SchedulerPage from '@pages/Scheduler/SchedulerPage';
import StudioPage from '@pages/Studio/StudioPage';
import { globalStyles } from '@theme/globalStyles';

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
          <Route path="*" element={<Navigate to="/studio" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;