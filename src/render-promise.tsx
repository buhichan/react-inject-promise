import * as React from "react"

import { injectPromise } from "./inject-promise";

export class RenderPromise extends React.PureComponent<{promise:()=>Promise<any>,reloadFlag?:any}>{
    container = injectPromise({
        values:{
            value:(props)=>this.props.promise()
        },
        shouldReload:(p1,p2)=>p1.reloadFlag!==p2.reloadFlag
    })(
        ({children,...props})=>children(props)
    )
    render(){
        return <this.container {...this.props} />
    }
}