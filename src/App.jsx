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
import Support from './views/Support.jsx'
import SupportThread from './views/SupportThread.jsx'
import Recordings from './views/Recordings.jsx'
import About from './views/About.jsx'
import NotFound from './views/NotFound.jsx'

import AdminApp from './views/admin/AdminApp.jsx'
import AdminDashboard from './views/admin/AdminDashboard.jsx'
import AdminContent from './views/admin/AdminContent.jsx'
import AdminContentEdit from './views/admin/AdminContentEdit.jsx'
import AdminLawyers from './views/admin/AdminLawyers.jsx'
import AdminLawyerEdit from './views/admin/AdminLawyerEdit.jsx'
import AdminCases from './views/admin/AdminCases.jsx'
import AdminSupport from './views/admin/AdminSupport.jsx'

export default function App() {
  return (
    <Routes>
      {/* Public app */}
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="category/:id" element={<Category />} />
        <Route path="entry/:id" element={<Entry />} />
        <Route path="traffic" element={<TrafficFines />} />
        <Route path="bookmarks" element={<Bookmarks />} />
        <Route path="hire" element={<HireStart />} />
        <Route path="hire/matches" element={<HireMatches />} />
        <Route path="support" element={<Support />} />
        <Route path="support/:id" element={<SupportThread />} />
        <Route path="recordings" element={<Recordings />} />
        <Route path="about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin console (separate shell + auth gate) */}
      <Route path="/admin" element={<AdminApp />}>
        <Route index element={<AdminDashboard />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="content/new" element={<AdminContentEdit />} />
        <Route path="content/:id" element={<AdminContentEdit />} />
        <Route path="lawyers" element={<AdminLawyers />} />
        <Route path="lawyers/new" element={<AdminLawyerEdit />} />
        <Route path="lawyers/:id" element={<AdminLawyerEdit />} />
        <Route path="cases" element={<AdminCases />} />
        <Route path="support" element={<AdminSupport />} />
        <Route path="support/:id" element={<AdminSupport />} />
      </Route>
    </Routes>
  )
}
