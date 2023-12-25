import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { FC } from 'react'
import NavBar from './Components/NavBar'
import Samples from './Components/Samples';
import Main from './Components/Main';
import Detail from './Components/DetailofSample';
import Missions from './Components/Missions';
import Bag from './Components/Bag';
import { Provider } from 'react-redux';
import { store } from './reduxToolkit';
import Login from './Components/Login';
import Auth from './Components/Auth';
import SampleMod from './Components/SampleMod';
import EditSample from './Components/EditSample';

const App: FC = () => {

  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <NavBar />
          <Routes>
            <Route path="/MSRM/" element={<Main />} />
            <Route path="/MSRM/samples" element={<Samples />} />
            <Route path="/MSRM/detail/:id" element={<Detail />} />
            <Route path="/MSRM/missions" element={<Missions />} />
            <Route path="/MSRM/mission/detail/:id" element={<Bag />} />
            <Route path="/MSRM/login" element={<Login />} />
            <Route path="/MSRM/auth" element={<Auth />} />
            <Route path="/MSRM/admin/samples" element={<SampleMod />} />
            <Route path="/MSRM/admin/edit_sample/:id" element={<EditSample />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App