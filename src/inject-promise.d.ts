export interface InjectPromiseOptions<P> {
    values: {
        [name: string]: (props: P) => Promise<any>;
    };
    shouldReload: (newProps: P, oldProps: P) => boolean;
}
/**
 * Injects the promise's value when it's resolved.
 * @inject
 * <name> resolved value
 * <name> promise is unresolved, reload<Name> and set<Name>
 * @param options
 */
export declare function injectPromise<P = any>(options: InjectPromiseOptions<P>): (Component: any) => any;
