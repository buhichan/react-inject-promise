# React Inject Promise
Hocs which resolve and inject various things.
- Used with recompose is recommended.

## Install
`npm install react-inject-promise` or `yarn add react-inject-promise`

## injectPromise
Inject the resolved value of a promise, along with the 

```tsx
import * as React from "react"
import {injectPromise} from "react-inject-promise"

@injectPromise({
    values:{
        users:(props)=>fetch(`/users?group=${props.group}`).then(r=>r.json())
    },
    shouldReload=(props,nextProps)=>props.group!==nextProps.group
})
class Haha extends React.PureComponent<any,any>{
    render(){
        const {users,reloadUsers,setUsers,usersLoading} = this.props
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