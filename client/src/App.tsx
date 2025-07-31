import Layout from './routes/Layout';
import Home from './routes/Home';
import Selection from './routes/leader/Selection';
import Overview from './routes/leader/Overview';
import Prioritizer from './routes/Prioritizer';
import NotFound from './components/NotFound';
import WaitingRoom from './components/WaitingRoom';
import { Route, Routes } from 'react-router';
import { useEffect, useState } from 'react';
import { fetchPong } from './api/fetch';

export default function App() {

  const [serverAwake, setServerAwake] = useState(false);

  useEffect(() => {
    // try to ping backend on load
      fetchPong()
      .then(() => setServerAwake(true))
      .catch(() => setTimeout(() => setServerAwake(true), 60000));
  }, []);

  if (!serverAwake) return <WaitingRoom />;

  return (
    <Routes>
      <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="leader">
            <Route index element={<NotFound />} />
            <Route path="selection" element={ <Selection /> }/>
            <Route path="overview/:civilization" element={ <Overview /> } />
          </Route>
          <Route path="science-advisor" element={ <Prioritizer /> } />
          <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
