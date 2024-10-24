import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Accueil from './pages/Accueil';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Header from './component/Header';
import Footer from './component/Footer';

function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Accueil />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/signup' element={<SignUp />}/>
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
