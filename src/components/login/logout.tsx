import {useContext, useEffect} from "react";
import axios from "axios";
import Url from "../api-configue";
import {Context} from "../../context";

export const Logout = () => {
    const context = useContext(Context)


    const func = async () => {
          if (context.isLogged){
                      try { axios.post(`${Url}/logout/`,{
                            refresh_token:localStorage.getItem('refresh_token')
                        } ,{headers: {
                            'Content-Type': 'application/json'
                        }}).then(() => {
                               localStorage.clear();
                               axios.defaults.headers.common['Authorization'] = null;
                        }
                        ).finally(() => {
                           window.location.reload()
                        })

                    } catch (e) {
                    }

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