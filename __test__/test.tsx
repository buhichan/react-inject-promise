import "jest"
import { injectPromise } from '../src/inject-promise'
import { RenderPromise } from '../src/render-promise'
import * as TestRenderer from 'react-test-renderer'
import * as React from "react"

describe("Test Injecting Promise.", ()=>{
    function makeComponent(){
        const fooPromise = jest.fn(()=>new Promise(resolve=>setTimeout(()=>{
            resolve("bar")
        }, 100)))
        const Comp = injectPromise({
            values:{
                foo:fooPromise
            },
            shouldReload:(p1,p2)=>p1.far !== p2.far
        })((props)=>{
            return <div {...props} />
        })
        const renderer = TestRenderer.create(<Comp />)
        const div = renderer.root.findByType("div")
        return {div,fooPromise,renderer,Comp}
    }
    it('should render the underlying component',()=>{
        const {div} = makeComponent()
        expect(div).toBeDefined()
    })
    it('should inject some props',()=>{
        const {div} = makeComponent()
        expect('foo' in div.props).toBeTruthy()
        expect(div.props.fooLoading).toBe(true)
        expect(div.props.reloadFoo).toBeInstanceOf(Function)
        expect(div.props.setFoo).toBeInstanceOf(Function)
    })
    it('should resolve promise',(done)=>{
        const {renderer,fooPromise,div} = makeComponent()
        setTimeout(()=>{
            expect(div.props.foo).toBe("bar")
            expect(div.props.fooLoading).toBe(false)
            expect(fooPromise).toHaveBeenCalledTimes(1)
            done()
        }, 200)
    })
    it('should reload promise when shouldReload returns true',(done)=>{
        const {div,fooPromise,renderer,Comp} = makeComponent()
        setTimeout(()=>{
            renderer.update(<Comp far={2} />)
            const div = renderer.root.findByType("div")
            expect(div.props.foo).toBeUndefined()
            expect(div.props.fooLoading).toBe(true)
            expect(fooPromise).toHaveBeenCalledTimes(2)
            done()
        }, 101)
    })
    it('should reload promise when reload<PropName> is called',(done)=>{
        const {Comp,fooPromise,renderer,div} = makeComponent()
        setTimeout(()=>{
            const promise = div.props.reloadFoo()
            expect(promise).toBeInstanceOf(Promise)
            promise.then(()=>{
                expect(fooPromise).toHaveBeenCalledTimes(2)
                done()
            })
        }, 101)
    })
    it('should set the value when set<Value> is called',(done)=>{
        const {Comp,fooPromise,div} = makeComponent()
        setTimeout(()=>{
            expect(div.props.foo).toBe("bar")
            div.props.setFoo("boo")
            expect(div.props.foo).toBe("boo")
            expect(div.props.fooLoading).toBe(false)
            expect(fooPromise).toHaveBeenCalledTimes(1)
            done()
        }, 101)
    })
})

describe("Test Render Promise",()=>{
    function makeComponent(){
        const fooPromise = jest.fn(()=>new Promise(resolve=>setTimeout(()=>{
            resolve("bar")
        }, 100)))
        const Comp = ({far,promise=fooPromise})=>{
            return <RenderPromise promise={promise} reloadFlag={far}>
                {injected=>{
                    return <div {...injected} /> 
                }}
            </RenderPromise>
        }
        const renderer = TestRenderer.create(<Comp far={1} />)
        const div = renderer.root.findByType("div")
        return {div,fooPromise,renderer,Comp}
    }
    it('should render the underlying component',()=>{
        const {div} = makeComponent()
        expect(div).toBeDefined()
    })
    it('should inject some props',()=>{
        const {div,fooPromise} = makeComponent()
        expect('value' in div.props).toBeTruthy()
        expect(div.props.valueLoading).toBe(true)
        expect(div.props.reloadValue).toBeInstanceOf(Function)
        expect(div.props.setValue).toBeInstanceOf(Function)
    })
    it('should resolve promise',(done)=>{
        const {div,fooPromise} = makeComponent()
        setTimeout(()=>{
            expect(div.props.value).toBe("bar")
            expect(div.props.valueLoading).toBe(false)
            expect(fooPromise).toHaveBeenCalledTimes(1)
            done()
        }, 200)
    })
    it('should reload promise when shouldReload returns true',(done)=>{
        const {div,fooPromise,Comp,renderer} = makeComponent()
        setTimeout(()=>{
            renderer.update(<Comp far={2} />)
            expect(div.props.value).toBeUndefined()
            expect(div.props.valueLoading).toBe(true)
            expect(fooPromise).toHaveBeenCalledTimes(2)
            done()
        }, 101)
    })
    it('should reload promise when reload<PropName> is called',(done)=>{
        const {Comp,fooPromise,div} = makeComponent()
        setTimeout(()=>{
            const promise = div.props.reloadValue()
            expect(promise).toBeInstanceOf(Promise)
            promise.then(()=>{
                expect(div.props.value).toBe("bar")
                expect(fooPromise).toHaveBeenCalledTimes(2)
                done()
            })
        }, 101)
    })
    it('should set the value when set<Value> is called',(done)=>{
        const {Comp,div,fooPromise} = makeComponent()
        setTimeout(()=>{
            div.props.setValue("boo")
            expect(div.props.value).toBe("boo")
            expect(div.props.valueLoading).toBe(false)
            expect(fooPromise).toHaveBeenCalledTimes(1)
            done()
        }, 101)
    })
    it('should not reload the value even if promise prop is changed',()=>{
        const {Comp,div,renderer,fooPromise} = makeComponent()
        const newPromise = jest.fn(()=>Promise.resolve("gua"))
        renderer.update(<Comp far={1} promise={newPromise} />)
        expect(newPromise).toHaveBeenCalledTimes(0)
        expect(fooPromise).toHaveBeenCalledTimes(1)
    })
})