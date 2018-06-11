![travis ci](https://travis-ci.org/buhichan/redux-schema-form.svg?branch=master)

# React Inject Promise
Hocs which resolve and inject various things.
- Used with recompose is recommended.

## Install
`npm install react-inject-promise` or `yarn add react-inject-promise`

## injectPromise

```typescript
type ReactComponent<Props> = React.StatelessComponent<Props>|React.ComponentClass<Props>;

// A hoc(higher-order-component)
injectPromise<Props>(arg:{
    values:{
        [name:string]:(props:Props)=>Promise<any>
    },
    shouldReload:(p1:Props,p2:Props)=>boolean
})(Component:ReactComponent<Props>)
```

Inject the promise(s), the injected props are:
- [name]: the user-defined name of that promise. 
- [name]Loading
    - Whether the promise status is "resolving" 
- reload[Name] [Name] is capitalized [name]
    - Reload the promise, which could means re-fetch data from remote api.
- set[Name]
    - Manully update the resolved value

## RenderPromise
Render a function as children, the argument passed to that function is similar to 'injectPromise':
- value
- valueLoading
- reloadValue
- setValue

## How to use

### Usage 1
```tsx
import * as React from "react"
import {injectPromise} from "react-inject-promise"

@injectPromise({
    values:{
        users:(props)=>fetch(`/users?group=${props.group}`).then(r=>r.json()),
        //todos: ...
    },
    shouldReload=(props,nextProps)=>props.group!==nextProps.group
})
class Haha extends React.PureComponent<any,any>{
    render(){
        const {
            users, // undefined or the resolved value
            reloadUsers, // a callback to re-resolve the promise
            setUsers, // set the resolved value manually
            usersLoading // whether the promise is not resolved yet.
        } = this.props
        if(usersLoading)
            return <div>loading...</div>
        return <div>
            {
                JSON.stringify(users)
            }
            <button onClick={reloadUsers}>Reload Users</button>
            <button onClick={()=>{
                fetch(`addUser`,{
                    body:JSON.stringify({name:'Shane'})
                }).then((newUser)=>{
                    setUsers(users.concat(newUser))
                    //or reloadUser()
                })
            }}>Add User</button>
        </div>
    }
}
```

### Usage 2:

```tsx
import * as React from "react"
import {RenderPromise} from "react-inject-promise"

const fetchUsers = (groupId)=>fetch(`/users?group=${groupId}`).then(r=>r.json())

function Component(props){
    /*
     * when reloadFlag changes, the 'promise' prop will be re-called, e.g. reload data from remote API.
     * it is ok to pass an inline function as 'promise' props, because RenderPromise will only use the first 'promise' prop it sees, except when reloadFlag has changed.
     */
    return <RenderPromise promise={()=>fetchUsers(props.groupId)} reloadFlag={props.groupId}>
        {({
            value,
            valueLoading,
            setValue,
            reloadValue
        })=>{
            return valueLoading?"loading...":<p>{value}</p>
        }}
    </RenderPromise>
}

```