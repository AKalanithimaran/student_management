import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Analytics from './pages/Analytics.jsx';
import AppLayout from './layout/AppLayout.jsx';

const App = () => {
  return (
    <BrowserRouter future={{ v7_relativeSplatPath: true }}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<Home />} />
          <Route path="/analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
