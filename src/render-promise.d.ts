/// <reference types="react" />
import * as React from "react";
export declare class RenderPromise extends React.PureComponent<{
    promise: () => Promise<any>;
    reloadFlag?: any;
}> {
    container: any;
    render(): JSX.Element;
}
