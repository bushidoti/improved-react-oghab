import React, {Fragment, useEffect, useState} from "react";
import LayoutForm from "./components/layout/layout";
import {Route, Routes, useNavigate} from "react-router-dom";
import Login from "./components/login/login";
import '././App.css';
import {Context} from "./context";
import {Loading} from "./components/loading/loading";
import axios from "axios";
import Url from "./components/api-configue";
import Compressor from "compressorjs";
import {Banner} from "./components/layout/banner";

declare global {
    interface Window {
        MozWebSocket: any;
        ws: any;
        send: any;
    }
}

const App: React.FC = () => {
    const navigate = useNavigate();
    const [isLogged, setLogged] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingAjax, setLoadingAjax] = useState(false)
    const [fullName, setFullName] = useState('');
    const [office, setOffice] = useState('');
    const [scan, setScan] = useState('');
    const [compress, setCompress] = useState('');
    const [compressed, setCompressed] = useState('');
    const [currentProductDoc, setCurrentProductDoc] = useState<string>('');
    const [currentPersonal, setCurrentPersonal] = useState<number>(0)
    const [currentContract, setCurrentContract] = useState<number>(0)
    const [currentDocProperty, setCurrentDocProperty] = useState<number>(0)
    const [currentProduct, setCurrentProduct] = useState<number>(0)
    const [currentProperty, setCurrentProperty] = useState<number>(0)
    const [currentProductFactor, setCurrentProductFactor] = useState<number>(0)
    const [currentPropertyFactor, setCurrentPropertyFactor] = useState<number>(0)
    const [currentProductCheck, setCurrentProductCheck] = useState<number>(0)
    const [permission, setPermission] = useState('');
    const [propertyCapsule, setPropertyCapsule] = useState<any>([]);
    const [currentPropertyForm, setCurrentPropertyForm] = useState<string>('');
    const [currentPropertyTable, setCurrentPropertyTable] = useState<string>('');
    const [propertyTab, setPropertyTab] = useState<string>('ثبت اولیه / خرید');
    const [listPropertyFactor, setListPropertyFactor] = useState<any>([]);


    useEffect(() => {
        (async () => {
            if (isLogged) {
                const {data} = (await axios.get(`${Url}/permission/`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                    }
                }));
                setPermission(data.message);
            }
        })()
    }, [isLogged]);

    useEffect(() => {
        (async () => {
            if (isLogged) {
                const {data} = (await axios.get(`${Url}/permission/`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
                    }
                }));
                setPermission(data.message);
            }
        })()
    }, [isLogged]);


    useEffect(() => {
        if (isLogged) {
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

     const fetchData = async () => {
        setLoading(true)
        await axios.get(`${Url}/api/factor_property/?fields=code,jsonData,inventory&inventory=${permission === 'مدیر' ? '' : office }`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            }
        }).then(response => {
            return response
        }).then(async data => {
            setListPropertyFactor(data.data)
        }).catch((error) => {
            if (error.request.status === 403) {
                navigate('/')
            }
        }).finally(() => setLoading(false)
        )
    }

    useEffect(() => {
                if (isLogged) {
                    void fetchData()
                }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isLogged])


    useEffect(() => {
        if (isLogged) {
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
        } else {
            navigate('/login');
        }
    }, [isLogged, navigate]);

    useEffect(() => {
        if (document.readyState === "complete") {
            setTimeout(() => setLoading(false), 3000)
        }
    }, [])


    if (document.readyState === "complete") {
        const wsImpl = window.WebSocket || window.MozWebSocket;

        window.ws = new wsImpl('ws://localhost:8181/');

        window.ws.onmessage = function (e: { data: any; }) {
            if (typeof e.data === "string") {
                //IF Received Data is String
            } else if (e.data instanceof ArrayBuffer) {
                //IF Received Data is ArrayBuffer
            } else if (e.data instanceof Blob) {
                const f = e.data;
                const reader = new FileReader();
                reader.onload = function (e) {

                    // @ts-ignore
                    setScan(e.target.result.replace('data:application/octet-stream;base64,', 'data:image/jpg;base64,'))
                    // @ts-ignore
                    setCompress(e.target.result.replace('data:application/octet-stream;base64,', ''))
                }
                reader.readAsDataURL(f);
            }
        };
    }

    const imageContent = atob(compress);
    const buffer = new ArrayBuffer(imageContent.length);
    const view = new Uint8Array(buffer);
    for (let n = 0; n < imageContent.length; n++) {
        view[n] = imageContent.charCodeAt(n);
    }
    const type = 'image/jpeg';
    const blob = new Blob([buffer], {type});
    const file = new File([blob], 'we', {lastModified: new Date().getTime(), type});


    new Compressor(file, {
        quality: 0.8,

        // The compression process is asynchronous,
        // which means you have to access the `result` in the `success` hook function.
        success(result) {

            // The third parameter is required for server
            const reader = new FileReader();
            reader.readAsDataURL(result);
            reader.onloadend = function () {
                const base64data = reader.result;
                // @ts-ignore
                setCompressed(base64data);
            }
            // Send the compressed image file to server with XMLHttpRequest.

        },
        error() {
        },
    });


    return (
        <Fragment>

            {loading ?
                <Loading/>
                :
                <Context.Provider value={{
                    setLogged,
                    currentContract,
                    listPropertyFactor,
                    setCurrentContract,
                    fullName,
                    setCurrentProductDoc,
                    setCurrentDocProperty,
                    currentDocProperty,
                    setLoadingAjax,
                    setCurrentPropertyFactor,
                    currentPropertyFactor,
                    loadingAjax,
                    currentProductDoc,
                    setCurrentProperty,
                    currentProperty,
                    setCurrentProduct,
                    setCurrentProductCheck,
                    setPropertyCapsule,
                    propertyCapsule,
                    currentProductCheck,
                    setCurrentProductFactor,
                    setCurrentPropertyTable,
                    currentPropertyTable,
                    currentPropertyForm,
                    setCurrentPropertyForm,
                    currentProductFactor,
                    setPropertyTab,
                    propertyTab,
                    currentProduct,
                    scan,
                    compressed,
                    isLogged,
                    currentPersonal,
                    setCurrentPersonal,
                    permission,
                    office
                }}>
                    {isLogged ?
                        <>
                            <Banner/>
                            <Routes>
                                <Route path={'*'} element={<LayoutForm/>}>

                                </Route>
                            </Routes>
                        </>
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