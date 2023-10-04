import {createContext} from "react";

export const Context = createContext({
    setLogged: (_value: boolean) => { },
    fullName: '',
    isLogged: false,
    office:'',
    compressed:'',
    scan:''
})