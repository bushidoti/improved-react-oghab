import {createContext} from "react";

export const Context = createContext({
    setLogged: (_value: boolean) => {
    },
     setCurrentProductDoc: (_value: string) => {
    },
    setCurrentPersonal: (_value: number) => {
    },
    setCurrentPropertyForm: (_value: string) => {
    },
    setCurrentContract: (_value: number) => {
    },
    setCurrentProduct: (_value: number) => {
    },
    setCurrentProductFactor: (_value: number) => {
    },
    setCurrentDocProperty: (_value: number) => {
    },
    setCurrentProductCheck: (_value: number) => {
    },
    fullName: '',
    isLogged: false,
    office: '',
    currentProductDoc: '',
    compressed: '',
    currentPropertyForm: '',
    currentPersonal: 0,
    currentDocProperty: 0,
    currentProductCheck: 0,
    currentProduct: 0,
    currentContract: 0,
    currentProductFactor: 0,
    scan: '',
    permission: ''
})