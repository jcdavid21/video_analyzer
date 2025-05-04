import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './components/user/Home';
import Login from './components/user/Login';
import Signup from './components/user/Signup';
import Faqs from './components/user/Faqs';
import HowItWorks from './components/user/HowItWorks';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
