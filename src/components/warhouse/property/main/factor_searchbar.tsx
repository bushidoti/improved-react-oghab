import {Select} from "antd";
import React, {useContext} from "react";
import {Context} from "../../../../context";

const FactorSearchBar = () => {
    const context = useContext(Context)
    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    return (
        <Select placeholder={`فاکتور را انتخاب کنید`}
                            optionFilterProp="children"
                            style={{width: 400}}
                            allowClear
                            showSearch
                            loading={context.loadingAjax}
                            onChange={value => context.setCurrentPropertyFactor(value)}
                            filterOption={filterOption}
                            options={context.listPropertyFactor.map((item:any) => ({
                                label: ' کد سیستم ' + item.code +   ' شناسه فاکتور '  + item.jsonData[0].document_code + ' انبار ' + item.inventory,
                                value: item.code
                            }))}
                    />
    )
}
export default FactorSearchBar