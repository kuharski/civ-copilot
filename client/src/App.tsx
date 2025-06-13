import Layout from './routes/Layout'
import Home from './routes/Home'
import Selection from './routes/leader/Selection'
import Overview from './routes/leader/Overview';
import { Route, Routes } from 'react-router';

export default function App() {

  // const [result, setResult] = useState<string>('Loading…');

  // useEffect(() => {
  //   // Because “proxy”: "http://localhost:3000" is in client/package.json,
  //   // fetch("/health") will actually request http://localhost:3000/health
  //   fetch('/api/health')
  //     .then((res) => {
  //       // If status is not in the 200‐299 range, throw an error to be caught below
  //       if (!res.ok) {
  //         throw new Error(`HTTP error! status: ${res.status}`);
  //       }
  //       return res.json(); // Parse the JSON body
  //     })
  //     .then((json) => {
  //       // Convert the JSON object into a string for display
  //       setResult(JSON.stringify(json, null, 2)); 
  //       // The second/third arguments of JSON.stringify pretty‐print with 2 spaces
  //     })
  //     .catch((err) => {
  //       // If anything went wrong (network, non‐2xx status, parse error), show it here
  //       setResult(`Error fetching /health: ${err.message}`);
  //     });
  // }, []);

  return (
    <Routes>
      <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="leader">
            <Route path="selection" element={ <Selection /> }/>
            <Route path="overview" element={ <Overview /> } />
          </Route>
      </Route>
    </Routes>

  );
}
