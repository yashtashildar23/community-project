import Layout from './components/Layout';
import { useRoute } from './lib/router';
import Home from './pages/Home';
import Helplines from './pages/Helplines';
import Toolkit from './pages/Toolkit';
import Screeners from './pages/Screeners';
import Mood from './pages/Mood';
import Library from './pages/Library';
import Article from './pages/Article';

function renderPage(path) {
  if (path === '/') return <Home />;
  if (path === '/helplines') return <Helplines />;
  if (path === '/toolkit') return <Toolkit />;
  if (path === '/screeners') return <Screeners />;
  if (path === '/mood') return <Mood />;
  if (path === '/library') return <Library />;
  if (path.startsWith('/library/')) {
    return <Article id={decodeURIComponent(path.slice('/library/'.length))} />;
  }
  return <Home />;
}

export default function App() {
  const path = useRoute();
  return <Layout path={path}>{renderPage(path)}</Layout>;
}
