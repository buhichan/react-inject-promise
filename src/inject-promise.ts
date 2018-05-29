
import * as React from "react"
import { capitalize } from './utils';

export interface InjectPromiseOptions<P>{
    values:{[name:string]:(props:P)=>Promise<any>},
    shouldReload:(newProps:P,oldProps:P)=>boolean,
    usePromiseAll?:boolean
}

/**
 * Injects the promise's value when it's resolved.
 * @inject 
 * <name> resolved value
 * <name> promise is unresolved, reload<Name> and set<Name>
 * @param options 
 */
export function injectPromise<P=any>(options:InjectPromiseOptions<P>){
    return Component=>class InjectPromise extends React.PureComponent<P>{
        initialState=Object.keys(options.values).reduce((state,name)=>{
            const capitalizedName = capitalize(name)
            state[name]=undefined
            state[name+"Loading"]=true
            state["reload"+capitalizedName]=()=>{
                this.resolvePromise(this.props)
            }
            state["set"+capitalizedName]=(value)=>{
                this.setState({[name]:value})
            }
            return state
        },{})
        state=this.initialState
        componentDidMount(){
            this.resolvePromise(this.props)
        }
        componentDidUpdate(nextProps){
            this.resolvePromise(nextProps)
        }
        resolvePromise=(props:P)=>{
            if(props === this.props /*componentDidMount*/||options.shouldReload(props,this.props)){
                if(props !== this.props)
                    this.setState(this.initialState)
                return Promise.all(
                    Object.keys(options.values).map(name=>{
                        return options.values[name](props).then(value=>[name,value])
                    })
                ).then(entries=>{
                    const newState = entries.reduce((state,[name,value])=>{
                        state[name]=value
                        state[name+"Loading"]=false
                        return state
                    },{})
                    this.setState(newState)
                })
            }
        }
        render(){
            return React.createElement(Component,{
                ...this.props as any,
                ...this.state
            },this.props.children)
        }
    } as any
}