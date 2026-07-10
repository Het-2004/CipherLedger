import {BrowserRouter,Routes,Route} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Blockchain from "./pages/Blockchain";
import Wallet from "./pages/Wallet";
import Mining from "./pages/Mining";
import Navbar from "./components/Navbar";


function App(){

  return(
      <BrowserRouter>

        <Navbar/>

        <Routes>

          <Route
              path="/"
              element={<Dashboard/>}
          />

          <Route
              path="/blocks"
              element={<Blockchain/>}
          />


          <Route
              path="/wallet"
              element={<Wallet/>}
          />


          <Route
              path="/mine"
              element={<Mining/>}
          />

        </Routes>

      </BrowserRouter>
  )
}


export default App;