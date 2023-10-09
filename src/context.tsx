import {createContext} from "react";

export const Context = createContext({
    setLogged: (_value: boolean) => { },
    setCurrentPersonal: (_value: number) => { },
    setCurrentProduct: (_value: number) => { },
    fullName: '',
    isLogged: false,
    office:'',
    compressed:'',
    currentPersonal:0,
    currentProduct:0,
    scan:'',
    permission:''
})