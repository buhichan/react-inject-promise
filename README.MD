![travis ci](https://travis-ci.org/buhichan/redux-schema-form.svg?branch=master)

# React Inject Promise
Hocs which resolve and inject various things.
- Used with recompose is recommended.

## Install
`npm install react-inject-promise` or `yarn add react-inject-promise`

## injectPromise
Inject the resolved value of an object map of functions that accept props and returns promises, along with:
- name+"Loading", where name is the key of that promise
    - True if the promise status is "resolving" 
- reload+Name, Name is capitalized name
    - Reload the promise, which could means re-get data from api.
- set+Name
    - Manully update the resolved value

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
            usersLoading // whether the promise is in pending state
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

function Haha(){
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