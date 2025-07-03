import Layout from './routes/Layout';
import Home from './routes/Home';
import Selection from './routes/leader/Selection';
import Overview from './routes/leader/Overview';
import NotFound from './components/NotFound';
import { Route, Routes } from 'react-router';

export default function App() {

  return (
    <Routes>
      <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="leader">
            <Route index element={<NotFound />} />
            <Route path="selection" element={ <Selection /> }/>
            <Route path="overview/:civilization" element={ <Overview /> } />
          </Route>
          <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
