import {useContext, useEffect} from "react";
import axios from "axios";
import Url from "../api-configue";
import {Context} from "../../context";

export const Logout = () => {
      const context = useContext(Context)

     const prom = async  () => {
          window.location.href = '/login'
    }

    const func = async () => {
          if (context.isLogged){
                await prom().then(() => {
                      try { axios.post(`${Url}/logout/`,{
                            refresh_token:localStorage.getItem('refresh_token')
                        } ,{headers: {
                            'Content-Type': 'application/json'
                        }});
                        localStorage.clear();
                        axios.defaults.headers.common['Authorization'] = null;
                    } catch (e) {
                    }
                 });
          }
    }

       useEffect(() => {
            void func()
          },
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [])

    return (
        <div></div>
    )
}