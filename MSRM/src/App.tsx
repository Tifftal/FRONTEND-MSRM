import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { FC } from 'react'
import NavBar from './Components/NavBar'
import Samples from './Components/Samples';
import Main from './Components/Main';
import Detail from './Components/DetailofSample';

const App: FC = () => {

  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/FRONTEND-MSRM/" element={<Main />} />
          <Route path="/FRONTEND-MSRM/samples" element={<Samples />} />
          <Route path="/FRONTEND-MSRM/detail/:id" element={<Detail />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App