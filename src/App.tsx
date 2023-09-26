import React, {Fragment, useEffect, useState} from "react";
import LayoutForm from "./components/layout/layout";
import {Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/login/login";
import '././App.css';
import {Context} from "./context";
import {Loading} from "./components/loading/loading";


const App: React.FC = () => {
  const navigate = useNavigate();
  const [isLogged , setLogged] = useState(false)
  const [loading, setLoading] = useState(true)

   useEffect(() => {
      if (localStorage.getItem('access_token') !== null) {
        setLogged(true);
      }else {
        navigate('/login');
      }
  },[isLogged, navigate]);

  useEffect(() => {
          if (document.readyState === "complete"){
              setLoading(false)
          }
  }, [])

  return (
      <Fragment>
          {loading ?
                <Loading/>
                  :
              <Context.Provider value={{
                  setLogged:setLogged
              }}>
                {isLogged ?
                        <Routes>
                            <Route path={'*'} element={<LayoutForm/>}>

                            </Route>
                        </Routes>
                    :
                    <Routes>
                        <Route path={'/'}>
                          <Route path={'/login'} element={<Login/>}/>
                        </Route>
                    </Routes>
                }
            </Context.Provider>
          }
      </Fragment>
  );
};

export default App;