import React, {Fragment, useEffect, useState} from "react";
import LayoutForm from "./components/layout/layout";
import {Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/login/login";
import '././App.css';
import {Context} from "./context";
import {Loading} from "./components/loading/loading";
import axios from "axios";
import Url from "./components/api-configue";


const App: React.FC = () => {
  const navigate = useNavigate();
  const [isLogged , setLogged] = useState(false)
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState('');
  const [office, setOffice] = useState('');




   useEffect(() => {
        if(isLogged){
                          (async () => {
                        const {data} = (await axios.get(`${Url}/name/`, {
                          headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                          }
                        }));
                      setFullName(data.message);
                })()
        }

    }, [isLogged]);

    useEffect(() => {
        if(isLogged){
           (async () => {

                    const {data} = (await axios.get(`${Url}/home/`, {
                      headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                      }
                    }));
                  setOffice(data.message);
            })()
        }
    }, [isLogged]);

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
                  setLogged,
                  fullName,
                  isLogged,
                  office
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