import {Route, Routes} from "react-router-dom";
import React, {useContext} from "react";
import RegisterContract from "../contract/register/page";
import UploadContract from "../contract/upload/page";
import RegisterDocument from "../document/register/page";
import UploadDocument from "../document/upload/page";
import RegisterProduct from "../warhouse/product/register/page";
import ReportProduct from "../warhouse/product/report/page";
import RecycleProperty from "../warhouse/property/recycle/page";
import RegisterProperty from "../warhouse/property/register/page";
import SentProperty from "../warhouse/property/sent/page";
import RegisterPersonal from "../personal/register/page";
import UploadPersonal from "../personal/upload/page";
import Handling from "../warhouse/handling/page";
import {Logout} from "../login/logout";
import {Context} from "../../context";
import MainContract from "../contract/main/page";
import MainPersonal from "../personal/main/page";
import MainProduct from "../warhouse/product/main/page";
import MainProperty from "../warhouse/property/main/page";
import Edit from "../personal/register/edit";
import Home from "../home/home";
import PageNotFound from "../notfound/not_found";
import NoAccess from "../noaccess/no_access";
import Card from "../warhouse/product/card/card";
import ProductFactor from "../warhouse/product/report/factor";
import ProductCheck from "../warhouse/product/report/check";
import {UploadProductDocs} from "../warhouse/product/upload/upload";
import {EditDoc} from "../warhouse/product/register/edit";
import EditContract from "../contract/register/edit";
import MainDocument from "../document/main/page";
import EditImmovable from "../document/register/edit_immovable";
import EditMovable from "../document/register/edit_movable";
import {UploadPropertyFactor} from "../warhouse/property/upload/upload";
import PropertyFactor from "../warhouse/property/main/factor";

export const RouteLayout = () => {
    const context = useContext(Context)

    return (
         <Routes>
                <Route path={'/contract'} element={<MainContract/>}/>
                <Route path={'/contract/register'} element={<RegisterContract/>}/>
                <Route path={'/contract/report'} element={<MainContract/>}/>
                <Route path={'/contract/upload'} element={<UploadContract/>}/>
                <Route path={'/document'} element={<MainDocument/>}/>
                <Route path={'/document/register'} element={<RegisterDocument/>}/>
                <Route path={'/document/report'} element={<MainDocument/>}/>
                <Route path={'/document/upload'} element={<UploadDocument/>}/>
                <Route path={`/document/movable/edit/${context.currentDocProperty}`} element={<EditMovable/>}/>
                <Route path={`/document/immovable/edit/${context.currentDocProperty}`} element={<EditImmovable/>}/>
                <Route path={`/contract/edit/${context.currentContract}`} element={<EditContract/>}/>
                <Route path={'/personal'} element={<MainPersonal/>}/>
                <Route path={'/personal/register'} element={<RegisterPersonal/>}/>
                <Route path={`/personal/edit/${context.currentPersonal}`} element={<Edit/>}/>
                <Route path={'/personal/report'} element={<MainPersonal/>}/>
                <Route path={'/personal/upload'} element={<UploadPersonal/>}/>
                <Route path={'/warhouse/product'} element={<MainProduct/>}/>
                <Route path={`/warhouse/product/edit/${context.currentProduct}`} element={<Card/>}/>
                <Route path={`/warhouse/product/editDoc/${context.currentProductDoc}/${context.currentProductDoc === 'فاکتور' ? context.currentProductFactor : context.currentProductCheck }`} element={<EditDoc/>}/>
                <Route path={`/warhouse/product/factor/${context.currentProductFactor}`}
                       element={<ProductFactor/>}/>
                <Route path={`/warhouse/product/check/${context.currentProductCheck}`}
                       element={<ProductCheck/>}/>
                <Route path={'/warhouse/product/register'} element={<RegisterProduct/>}/>
                <Route path={'/warhouse/product/upload'} element={<UploadProductDocs/>}/>
                <Route path={'/warhouse/product/report'} element={<ReportProduct/>}/>
                <Route path={'/warhouse/property'} element={<MainProperty/>}/>
                <Route path={'/warhouse/property/register'} element={<RegisterProperty/>}/>
                <Route path={'/warhouse/property/report'} element={<MainProperty/>}/>
                <Route path={'/warhouse/property/sent'} element={<SentProperty/>}/>
                 <Route path={`/warhouse/property/factor/${context.currentPropertyFactor}`}
                           element={<PropertyFactor/>}/>
                <Route path={'/warhouse/property/recycle'} element={<RecycleProperty/>}/>
                <Route path={'/warhouse/property/upload'} element={<UploadPropertyFactor/>}/>
                <Route path={'/warhouse/handling'} element={<Handling/>}/>
                <Route path={'/'} element={<Home/>}/>
                <Route path={'/logout'} element={<Logout/>}/>
                <Route path={'/no_access'} element={<NoAccess/>}/>
                <Route path="*" element={<PageNotFound/>}/>
         </Routes>
    )
}