import {createContext} from "react";

type SetValueBool = (_value: boolean) => void;
type SetValueNumber = (_value: number) => void;
type SetValueString = (_value: string) => void;
type SetValueAny = (_value: (oldArray: any) => any[]) => void;


type ContextType = {
  isLogged: boolean;
  loadingAjax: boolean;
  fullName: string;
  currentProductFactor: number;
  currentProductCheck: number;
  currentProperty: number;
  currentContract: number;
  currentPropertyFactor: number;
  currentProduct: number;
  currentPersonal: number;
  currentDocProperty: number;
  currentProductDoc: string;
  permissionD: string[];
  currentPropertyForm: string;
  compressed: string;
  scan: string;
  office: string;
  currentPropertyTable: string;
  propertyTab: string;
  permission: string;
  path: string;
  listPropertyFactor: any[];
  propertyCapsule: any[];
  setLogged: SetValueBool;
  setLoadingAjax: SetValueBool;
  setCurrentProduct: SetValueNumber;
  setCurrentContract: SetValueNumber;
  setCurrentProductFactor: SetValueNumber;
  setCurrentProperty: SetValueNumber;
  setCurrentProductCheck: SetValueNumber;
  setCurrentPropertyFactor: SetValueNumber;
  setCurrentPersonal: SetValueNumber;
  setCurrentDocProperty: SetValueNumber;
  setCurrentProductDoc: SetValueString;
  setCompressed: SetValueString;
  setCurrentPropertyTable: SetValueString;
  setPropertyCapsule: SetValueAny;
  setCurrentPropertyForm: SetValueString;
  setPropertyTab: SetValueString;
};

export const Context = createContext<ContextType>({
    setLogged:() => {},
    setCurrentProductDoc:() => {},
    setCurrentPersonal:() => {},
    setCurrentProperty:() => {},
    setCurrentPropertyForm:() => {},
    setCurrentContract:() => {},
    setCurrentProduct:() => {},
    setCurrentProductFactor:() => {},
    setCurrentDocProperty:() => {},
    setCompressed:() => {},
    setLoadingAjax:() => {},
    setCurrentProductCheck:() => {},
    setCurrentPropertyFactor:() => {},
    setPropertyCapsule:() => {},
    setPropertyTab:() => {},
    setCurrentPropertyTable:() => {},
    fullName: '',
    isLogged: false,
    loadingAjax: false,
    office: '',
    currentPropertyTable: '',
    propertyTab: '',
    currentProductDoc: '',
    propertyCapsule: [],
    listPropertyFactor: [],
    compressed: '',
    path: '',
    currentPropertyForm: '',
    currentPersonal: 0,
    currentDocProperty: 0,
    currentProperty: 0,
    currentProductCheck: 0,
    currentPropertyFactor: 0,
    currentProduct: 0,
    currentContract: 0,
    currentProductFactor: 0,
    scan: '',
    permission: '',
    permissionD: []
})