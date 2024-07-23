import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Works, StarsCanvas } from './components';
import { Portfolio, Login, Register, Reset, Customize, Preview } from './Pages';

const App = () => {
  return (
    // Base name will be the username of the user
    <BrowserRouter> 
      <Routes>
        {/* <Route exact path="/" element={<Login />} /> */}
        {/* <Route exact path="/register" element={<Register />} /> */}
        <Route path="/Portfolio/:userId" element={<Portfolio />} />
        <Route path="/reset" element={<Reset />} />
        <Route path="/Create" element = {<Customize />} />
        <Route path="/Preview" element = {<div style={{zoom: "80%"}}><Preview /></div>} />
        <Route path="/" element = {
          <div>
            <Login />
            <StarsCanvas />
          </div>
            } />
        <Route path="/register" element = {
          <div>
            <Register />
            <StarsCanvas />
          </div>
            } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
