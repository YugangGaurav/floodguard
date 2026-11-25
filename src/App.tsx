import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

// All 13 Pages
import { Overview } from './pages/Overview';
import { FloodMap } from './pages/FloodMap';
import { Forecast } from './pages/Forecast';
import { Sensors } from './pages/Sensors';
import { RiverMonitoring } from './pages/RiverMonitoring';
import { Rainfall } from './pages/Rainfall';
import { HistoricalAnalysis } from './pages/HistoricalAnalysis';
import { Alerts } from './pages/Alerts';
import { EmergencyResponse } from './pages/EmergencyResponse';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Overview />} />
            <Route path="map" element={<FloodMap />} />
            <Route path="forecast" element={<Forecast />} />
            <Route path="sensors" element={<Sensors />} />
            <Route path="rivers" element={<RiverMonitoring />} />
            <Route path="rainfall" element={<Rainfall />} />
            <Route path="historical" element={<HistoricalAnalysis />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="emergency" element={<EmergencyResponse />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
