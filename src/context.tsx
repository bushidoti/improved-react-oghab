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
    setLoadingAjax: (_value: boolean) => {
    },
    setCurrentProductCheck: (_value: number) => {
    },
    setCurrentPropertyFactor: (_value: number) => {
    },
    setPropertyCapsule: (_value: (oldArray: any) => any[]) => {
    },
    setPropertyTab: (_value: string) => {
    },
    setCurrentPropertyTable: (_value: string) => {
    },
    fullName: '',
    isLogged: false,
    loadingAjax: false,
    office: '',
    currentPropertyTable: '',
    propertyTab: '',
    currentProductDoc: '',
    propertyCapsule: [],
    compressed: '',
    currentPropertyForm: '',
    currentPersonal: 0,
    currentDocProperty: 0,
    currentProductCheck: 0,
    currentPropertyFactor: 0,
    currentProduct: 0,
    currentContract: 0,
    currentProductFactor: 0,
    scan: '',
    permission: ''
})