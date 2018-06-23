
import * as React from "react"
import { capitalize } from './utils';

export interface InjectPromiseOptions<P>{
    values:{[name:string]:(props:P)=>Promise<any>},
    shouldReload:(newProps:P,oldProps:P)=>boolean,
}

type InjectedPromiseState = {
    [props:string]:any
}

/**
 * Injects the promise's value when it's resolved.
 * @inject 
 * <name> resolved value
 * <name> promise is unresolved, reload<Name> and set<Name>
 * @param options 
 */
export function injectPromise<P=any>(options:InjectPromiseOptions<P>){
    return (Component:any)=>class InjectPromise extends React.PureComponent<P>{
        initialState=Object.keys(options.values).reduce((state,name)=>{
            const capitalizedName = capitalize(name)
            state[name]=undefined
            state[name+"Loading"]=true
            state["reload"+capitalizedName]=()=>{
                return this.resolvePromise(this.props)
            }
            state["set"+capitalizedName]=(value:any)=>{
                this.setState({[name]:value})
            }
            return state
        },{} as InjectedPromiseState)
        state=this.initialState
        componentDidMount(){
            this.resolvePromise(this.props)
        }
        componentDidUpdate(prevProps:P){
            if(options.shouldReload(this.props,prevProps)){
                this.setState(this.initialState)
                return this.resolvePromise(this.props)
            }
        }
        resolvePromise=(props:P)=>{
            return Promise.all(
                Object.keys(options.values).map(name=>{
                    return options.values[name](props).then(value=>[name,value])
                })
            ).then(entries=>{
                const newState = entries.reduce((state,[name,value])=>{
                    state[name]=value
                    state[name+"Loading"]=false
                    return state
                },{} as InjectedPromiseState)
                this.setState(newState)
            })
        }
        render(){
            return React.createElement(Component,{
                ...this.props as any,
                ...this.state
            },this.props.children)
        }
    } as any
}