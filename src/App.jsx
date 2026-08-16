import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './views/Home.jsx'
import SearchResults from './views/SearchResults.jsx'
import Category from './views/Category.jsx'
import Entry from './views/Entry.jsx'
import TrafficFines from './views/TrafficFines.jsx'
import Bookmarks from './views/Bookmarks.jsx'
import HireStart from './views/HireStart.jsx'
import HireMatches from './views/HireMatches.jsx'
import About from './views/About.jsx'
import NotFound from './views/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="category/:id" element={<Category />} />
        <Route path="entry/:id" element={<Entry />} />
        <Route path="traffic" element={<TrafficFines />} />
        <Route path="bookmarks" element={<Bookmarks />} />
        <Route path="hire" element={<HireStart />} />
        <Route path="hire/matches" element={<HireMatches />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
