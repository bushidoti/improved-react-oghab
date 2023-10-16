var __html = require('./index.html.js');
var template = {__html: __html};
export const Loading = () => {
    return (
        <>
            <span dangerouslySetInnerHTML={template}/>
        </>
    )
}