import * as tslib_1 from "tslib";
import * as React from "react";
import { capitalize } from './utils';
/**
 * Injects the promise's value when it's resolved.
 * @inject
 * <name> resolved value
 * <name> promise is unresolved, reload<Name> and set<Name>
 * @param options
 */
export function injectPromise(options) {
    return function (Component) { return /** @class */ (function (_super) {
        tslib_1.__extends(InjectPromise, _super);
        function InjectPromise() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.initialState = Object.keys(options.values).reduce(function (state, name) {
                var capitalizedName = capitalize(name);
                state[name] = undefined;
                state[name + "Loading"] = true;
                state["reload" + capitalizedName] = function () {
                    return _this.resolvePromise(_this.props).then(function (res) { return res[name]; });
                };
                state["set" + capitalizedName] = function (value) {
                    _this.setState((_a = {}, _a[name] = value, _a));
                    var _a;
                };
                return state;
            }, {});
            _this.state = _this.initialState;
            _this.resolvePromise = function (props) {
                return Promise.all(Object.keys(options.values).map(function (name) {
                    return options.values[name](props).then(function (value) { return [name, value]; });
                })).then(function (entries) {
                    var newState = entries.reduce(function (state, _a) {
                        var name = _a[0], value = _a[1];
                        state[name] = value;
                        state[name + "Loading"] = false;
                        return state;
                    }, {});
                    _this.setState(newState);
                    return newState;
                });
            };
            return _this;
        }
        InjectPromise.prototype.componentDidMount = function () {
            this.resolvePromise(this.props);
        };
        InjectPromise.prototype.componentDidUpdate = function (prevProps) {
            if (options.shouldReload(this.props, prevProps)) {
                this.setState(this.initialState);
                return this.resolvePromise(this.props);
            }
        };
        InjectPromise.prototype.render = function () {
            return React.createElement(Component, tslib_1.__assign({}, this.props, this.state), this.props.children);
        };
        return InjectPromise;
    }(React.PureComponent)); };
}
//# sourceMappingURL=inject-promise.js.map