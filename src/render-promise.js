import * as tslib_1 from "tslib";
import * as React from "react";
import { injectPromise } from "./inject-promise";
var RenderPromise = /** @class */ (function (_super) {
    tslib_1.__extends(RenderPromise, _super);
    function RenderPromise() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.container = injectPromise({
            values: {
                value: function () { return _this.props.promise(); }
            },
            shouldReload: function (p1, p2) { return p1.reloadFlag !== p2.reloadFlag; }
        })(function (_a) {
            var children = _a.children, props = tslib_1.__rest(_a, ["children"]);
            return children(props);
        });
        return _this;
    }
    RenderPromise.prototype.render = function () {
        return React.createElement(this.container, tslib_1.__assign({}, this.props));
    };
    return RenderPromise;
}(React.PureComponent));
export { RenderPromise };
//# sourceMappingURL=render-promise.js.map