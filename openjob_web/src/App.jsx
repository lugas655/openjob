import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ManageJobs from './pages/ManageJobs'
import ManageCompanies from './pages/ManageCompanies'
import ManageCategories from './pages/ManageCategories'
import JobApplications from './pages/JobApplications'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/manage/jobs" element={<ManageJobs />} />
            <Route path="/manage/jobs/:jobId/applications" element={<JobApplications />} />
            <Route path="/manage/companies" element={<ManageCompanies />} />
            <Route path="/manage/categories" element={<ManageCategories />} />
          </Routes>
        </main>
        <footer className="bg-slate-900 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-slate-400">&copy; 2026 OpenJob. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </AuthProvider>
  )
}

export default App
