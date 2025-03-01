import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EDPPage from './pages/EDPPage';
import UnitPage from './pages/UnitPage';
import OHubPage from './pages/OHubPage';
import TeamPage from './pages/TeamPage';
import InvestorPage from './pages/InvestorPage';
import EventsPage from './pages/EventsPage';
import ContactPage from './pages/ContactPage';
import MarketplacePage from './pages/MarketplacePage';
import InnovationPage from './pages/InnovationPage';
import TrackSubmissionsPage from './pages/TrackSubmissionsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/edp" element={<EDPPage />} />
        <Route path="/unit/:unitNumber" element={<UnitPage />} />
        <Route path="/ohub" element={<OHubPage />} />
        <Route path="/team/:type" element={<TeamPage />} />
        <Route path="/investors/:section" element={<InvestorPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/innovation" element={<InnovationPage />} />
        <Route path="/track-submissions" element={<TrackSubmissionsPage />} />
      </Routes>
    </Router>
  );
}

export default App;