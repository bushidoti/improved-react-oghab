import {createContext} from "react";

export const Context = createContext({
    setLogged: (_value: boolean) => {
    },
     setCurrentProductDoc: (_value: string) => {
    },
    setCurrentPersonal: (_value: number) => {
    },
    setCurrentContract: (_value: number) => {
    },
    setCurrentProduct: (_value: number) => {
    },
    setCurrentProductFactor: (_value: number) => {
    },
    setCurrentProductCheck: (_value: number) => {
    },
    fullName: '',
    isLogged: false,
    office: '',
    currentProductDoc: '',
    compressed: '',
    currentPersonal: 0,
    currentProductCheck: 0,
    currentProduct: 0,
    currentContract: 0,
    currentProductFactor: 0,
    scan: '',
    permission: ''
})