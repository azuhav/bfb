import './App.css'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { About } from './pages/About.jsx'
import { Merge } from './pages/Merge.jsx'

const App = () => {
  return (
    <Router>
      <div className='nav-buttons'>
        <Link to='/'>
          <button>Merge</button>
        </Link>
        <Link to='/about'>
          <button>About</button>
        </Link>
      </div>
      <Routes>
        <Route path='/' element={<Merge />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </Router>
  )
}

export default App
