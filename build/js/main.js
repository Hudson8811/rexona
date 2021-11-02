// ./../../node_modules/jquery/dist/jquery.min.js

/**
 * Generates event when user makes new movement (like a swipe on a touchscreen).
 * @version 1.2.0
 * @link https://github.com/Promo/wheel-indicator
 * @license MIT
 */

/* global module, window, document */

var WheelIndicator = (function() {
    function Module(options) {
        var DEFAULTS = {
            callback: function(){},
            elem: document,
            preventMouse: true
        };

        this.eventWheel = 'onwheel' in document ? 'wheel' : 'mousewheel';
        this._options = extend(DEFAULTS, options);
        this._deltaArray = [ 0, 0, 0 ];
        this._isAcceleration = false;
        this._isStopped = true;
        this._direction = '';
        this._timer = '';
        this._isWorking = true;

        var self = this;
        this._wheelHandler = function(event) {
            if (self._isWorking) {
                processDelta.call(self, event);

                if (self._options.preventMouse) {
                    preventDefault(event);
                }
            }
        };

        addEvent(this._options.elem, this.eventWheel, this._wheelHandler);
    }

    Module.prototype = {
        constructor: Module,

        turnOn: function(){
            this._isWorking = true;

            return this;
        },

        turnOff: function(){
            this._isWorking = false;

            return this;
        },

        setOptions: function(options){
            this._options = extend(this._options, options);

            return this;
        },

        getOption: function(option){
            var neededOption = this._options[option];

            if (neededOption !== undefined) {
                return neededOption;
            }

            throw new Error('Unknown option');
        },

        destroy: function(){
            removeEvent(this._options.elem, this.eventWheel, this._wheelHandler);

            return this;
        }
    };

    function triggerEvent(event){
        event.direction = this._direction;

        this._options.callback(event);
    }

    var getDeltaY = function(event){
        if (event.wheelDelta && !event.deltaY) {
            getDeltaY = function(event) {
                return event.wheelDelta * -1;
            };
        } else {
            getDeltaY = function(event) {
                return event.deltaY;
            };
        }

        return getDeltaY(event);
    };

    function preventDefault(event){
        event = event || window.event;

        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    }

    function processDelta(event) {
        var
            self = this,
            delta = getDeltaY(event);

        if (delta === 0) return;

        var direction = delta > 0 ? 'down' : 'up',
            arrayLength = self._deltaArray.length,
            changedDirection = false,
            repeatDirection = 0,
            sustainableDirection, i;

        clearTimeout(self._timer);

        self._timer = setTimeout(function() {
            self._deltaArray = [ 0, 0, 0 ];
            self._isStopped = true;
            self._direction = direction;
        }, 150);

        //check how many of last three deltas correspond to certain direction
        for(i = 0; i < arrayLength; i++) {
            if(self._deltaArray[i] !== 0) {
                self._deltaArray[i] > 0 ? ++repeatDirection : --repeatDirection;
            }
        }

        //if all of last three deltas is greater than 0 or lesser than 0 then direction is switched
        if (Math.abs(repeatDirection) === arrayLength) {
            //determine type of sustainable direction
            //(three positive or negative deltas in a row)
            sustainableDirection = repeatDirection > 0 ? 'down' : 'up';

            if(sustainableDirection !== self._direction) {
                //direction is switched
                changedDirection = true;
                self._direction = direction;
            }
        }

        //if wheel`s moving and current event is not the first in array
        if (!self._isStopped){
            if(changedDirection) {
                self._isAcceleration = true;

                triggerEvent.call(this, event);
            } else {
                //check only if movement direction is sustainable
                if(Math.abs(repeatDirection) === arrayLength) {
                    //must take deltas to don`t get a bug
                    //[-116, -109, -103]
                    //[-109, -103, 1] - new impulse

                    analyzeArray.call(this, event);
                }
            }
        }

        //if wheel is stopped and current delta value is the first in array
        if (self._isStopped) {
            self._isStopped = false;
            self._isAcceleration = true;
            self._direction = direction;

            triggerEvent.call(this, event);
        }

        self._deltaArray.shift();
        self._deltaArray.push(delta);
    }

    function analyzeArray(event) {
        var
            deltaArray0Abs  = Math.abs(this._deltaArray[0]),
            deltaArray1Abs  = Math.abs(this._deltaArray[1]),
            deltaArray2Abs  = Math.abs(this._deltaArray[2]),
            deltaAbs        = Math.abs(getDeltaY(event));

        if((deltaAbs       > deltaArray2Abs) &&
            (deltaArray2Abs > deltaArray1Abs) &&
            (deltaArray1Abs > deltaArray0Abs)) {

            if(!this._isAcceleration) {
                triggerEvent.call(this, event);
                this._isAcceleration = true;
            }
        }

        if((deltaAbs < deltaArray2Abs) &&
            (deltaArray2Abs <= deltaArray1Abs)) {
            this._isAcceleration = false;
        }
    }

    function addEvent(elem, type, handler){
        if(elem.addEventListener) {
            elem.addEventListener(type, handler, false);
        } else if (elem.attachEvent) {
            elem.attachEvent('on' + type, handler);
        }
    }

    function removeEvent(elem, type, handler) {
        if (elem.removeEventListener) {
            elem.removeEventListener(type, handler, false);
        } else if (elem.detachEvent) {
            elem.detachEvent('on'+ type, handler);
        }
    }

    function extend(defaults, options) {
        var extended = {},
            prop;

        for (prop in defaults) {
            if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                extended[prop] = defaults[prop];
            }
        }

        for (prop in options) {
            if (Object.prototype.hasOwnProperty.call(options, prop)) {
                extended[prop] = options[prop];
            }
        }

        return extended;
    }

    return Module;
}());

if (typeof exports === 'object') {
    module.exports = WheelIndicator;
}
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.AOS=t():e.AOS=t()}(this,function(){return function(e){function t(o){if(n[o])return n[o].exports;var i=n[o]={exports:{},id:o,loaded:!1};return e[o].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n={};return t.m=e,t.c=n,t.p="dist/",t(0)}([function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}var i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},r=n(1),a=(o(r),n(6)),u=o(a),c=n(7),f=o(c),s=n(8),d=o(s),l=n(9),p=o(l),m=n(10),b=o(m),v=n(11),y=o(v),g=n(14),h=o(g),w=[],k=!1,x={offset:120,delay:0,easing:"ease",duration:400,disable:!1,once:!1,startEvent:"DOMContentLoaded",throttleDelay:99,debounceDelay:50,disableMutationObserver:!1},j=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(e&&(k=!0),k)return w=(0,y.default)(w,x),(0,b.default)(w,x.once),w},O=function(){w=(0,h.default)(),j()},_=function(){w.forEach(function(e,t){e.node.removeAttribute("data-aos"),e.node.removeAttribute("data-aos-easing"),e.node.removeAttribute("data-aos-duration"),e.node.removeAttribute("data-aos-delay")})},S=function(e){return e===!0||"mobile"===e&&p.default.mobile()||"phone"===e&&p.default.phone()||"tablet"===e&&p.default.tablet()||"function"==typeof e&&e()===!0},z=function(e){x=i(x,e),w=(0,h.default)();var t=document.all&&!window.atob;return S(x.disable)||t?_():(document.querySelector("body").setAttribute("data-aos-easing",x.easing),document.querySelector("body").setAttribute("data-aos-duration",x.duration),document.querySelector("body").setAttribute("data-aos-delay",x.delay),"DOMContentLoaded"===x.startEvent&&["complete","interactive"].indexOf(document.readyState)>-1?j(!0):"load"===x.startEvent?window.addEventListener(x.startEvent,function(){j(!0)}):document.addEventListener(x.startEvent,function(){j(!0)}),window.addEventListener("resize",(0,f.default)(j,x.debounceDelay,!0)),window.addEventListener("orientationchange",(0,f.default)(j,x.debounceDelay,!0)),window.addEventListener("scroll",(0,u.default)(function(){(0,b.default)(w,x.once)},x.throttleDelay)),x.disableMutationObserver||(0,d.default)("[data-aos]",O),w)};e.exports={init:z,refresh:j,refreshHard:O}},function(e,t){},,,,,function(e,t){(function(t){"use strict";function n(e,t,n){function o(t){var n=b,o=v;return b=v=void 0,k=t,g=e.apply(o,n)}function r(e){return k=e,h=setTimeout(s,t),_?o(e):g}function a(e){var n=e-w,o=e-k,i=t-n;return S?j(i,y-o):i}function c(e){var n=e-w,o=e-k;return void 0===w||n>=t||n<0||S&&o>=y}function s(){var e=O();return c(e)?d(e):void(h=setTimeout(s,a(e)))}function d(e){return h=void 0,z&&b?o(e):(b=v=void 0,g)}function l(){void 0!==h&&clearTimeout(h),k=0,b=w=v=h=void 0}function p(){return void 0===h?g:d(O())}function m(){var e=O(),n=c(e);if(b=arguments,v=this,w=e,n){if(void 0===h)return r(w);if(S)return h=setTimeout(s,t),o(w)}return void 0===h&&(h=setTimeout(s,t)),g}var b,v,y,g,h,w,k=0,_=!1,S=!1,z=!0;if("function"!=typeof e)throw new TypeError(f);return t=u(t)||0,i(n)&&(_=!!n.leading,S="maxWait"in n,y=S?x(u(n.maxWait)||0,t):y,z="trailing"in n?!!n.trailing:z),m.cancel=l,m.flush=p,m}function o(e,t,o){var r=!0,a=!0;if("function"!=typeof e)throw new TypeError(f);return i(o)&&(r="leading"in o?!!o.leading:r,a="trailing"in o?!!o.trailing:a),n(e,t,{leading:r,maxWait:t,trailing:a})}function i(e){var t="undefined"==typeof e?"undefined":c(e);return!!e&&("object"==t||"function"==t)}function r(e){return!!e&&"object"==("undefined"==typeof e?"undefined":c(e))}function a(e){return"symbol"==("undefined"==typeof e?"undefined":c(e))||r(e)&&k.call(e)==d}function u(e){if("number"==typeof e)return e;if(a(e))return s;if(i(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=i(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(l,"");var n=m.test(e);return n||b.test(e)?v(e.slice(2),n?2:8):p.test(e)?s:+e}var c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},f="Expected a function",s=NaN,d="[object Symbol]",l=/^\s+|\s+$/g,p=/^[-+]0x[0-9a-f]+$/i,m=/^0b[01]+$/i,b=/^0o[0-7]+$/i,v=parseInt,y="object"==("undefined"==typeof t?"undefined":c(t))&&t&&t.Object===Object&&t,g="object"==("undefined"==typeof self?"undefined":c(self))&&self&&self.Object===Object&&self,h=y||g||Function("return this")(),w=Object.prototype,k=w.toString,x=Math.max,j=Math.min,O=function(){return h.Date.now()};e.exports=o}).call(t,function(){return this}())},function(e,t){(function(t){"use strict";function n(e,t,n){function i(t){var n=b,o=v;return b=v=void 0,O=t,g=e.apply(o,n)}function r(e){return O=e,h=setTimeout(s,t),_?i(e):g}function u(e){var n=e-w,o=e-O,i=t-n;return S?x(i,y-o):i}function f(e){var n=e-w,o=e-O;return void 0===w||n>=t||n<0||S&&o>=y}function s(){var e=j();return f(e)?d(e):void(h=setTimeout(s,u(e)))}function d(e){return h=void 0,z&&b?i(e):(b=v=void 0,g)}function l(){void 0!==h&&clearTimeout(h),O=0,b=w=v=h=void 0}function p(){return void 0===h?g:d(j())}function m(){var e=j(),n=f(e);if(b=arguments,v=this,w=e,n){if(void 0===h)return r(w);if(S)return h=setTimeout(s,t),i(w)}return void 0===h&&(h=setTimeout(s,t)),g}var b,v,y,g,h,w,O=0,_=!1,S=!1,z=!0;if("function"!=typeof e)throw new TypeError(c);return t=a(t)||0,o(n)&&(_=!!n.leading,S="maxWait"in n,y=S?k(a(n.maxWait)||0,t):y,z="trailing"in n?!!n.trailing:z),m.cancel=l,m.flush=p,m}function o(e){var t="undefined"==typeof e?"undefined":u(e);return!!e&&("object"==t||"function"==t)}function i(e){return!!e&&"object"==("undefined"==typeof e?"undefined":u(e))}function r(e){return"symbol"==("undefined"==typeof e?"undefined":u(e))||i(e)&&w.call(e)==s}function a(e){if("number"==typeof e)return e;if(r(e))return f;if(o(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=o(t)?t+"":t}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(d,"");var n=p.test(e);return n||m.test(e)?b(e.slice(2),n?2:8):l.test(e)?f:+e}var u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},c="Expected a function",f=NaN,s="[object Symbol]",d=/^\s+|\s+$/g,l=/^[-+]0x[0-9a-f]+$/i,p=/^0b[01]+$/i,m=/^0o[0-7]+$/i,b=parseInt,v="object"==("undefined"==typeof t?"undefined":u(t))&&t&&t.Object===Object&&t,y="object"==("undefined"==typeof self?"undefined":u(self))&&self&&self.Object===Object&&self,g=v||y||Function("return this")(),h=Object.prototype,w=h.toString,k=Math.max,x=Math.min,j=function(){return g.Date.now()};e.exports=n}).call(t,function(){return this}())},function(e,t){"use strict";function n(e,t){var n=window.document,r=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver,a=new r(o);i=t,a.observe(n.documentElement,{childList:!0,subtree:!0,removedNodes:!0})}function o(e){e&&e.forEach(function(e){var t=Array.prototype.slice.call(e.addedNodes),n=Array.prototype.slice.call(e.removedNodes),o=t.concat(n).filter(function(e){return e.hasAttribute&&e.hasAttribute("data-aos")}).length;o&&i()})}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){};t.default=n},function(e,t){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function o(){return navigator.userAgent||navigator.vendor||window.opera||""}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),r=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,a=/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,u=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i,c=/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,f=function(){function e(){n(this,e)}return i(e,[{key:"phone",value:function(){var e=o();return!(!r.test(e)&&!a.test(e.substr(0,4)))}},{key:"mobile",value:function(){var e=o();return!(!u.test(e)&&!c.test(e.substr(0,4)))}},{key:"tablet",value:function(){return this.mobile()&&!this.phone()}}]),e}();t.default=new f},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e,t,n){var o=e.node.getAttribute("data-aos-once");t>e.position?e.node.classList.add("aos-animate"):"undefined"!=typeof o&&("false"===o||!n&&"true"!==o)&&e.node.classList.remove("aos-animate")},o=function(e,t){var o=window.pageYOffset,i=window.innerHeight;e.forEach(function(e,r){n(e,i+o,t)})};t.default=o},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=n(12),r=o(i),a=function(e,t){return e.forEach(function(e,n){e.node.classList.add("aos-init"),e.position=(0,r.default)(e.node,t.offset)}),e};t.default=a},function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=n(13),r=o(i),a=function(e,t){var n=0,o=0,i=window.innerHeight,a={offset:e.getAttribute("data-aos-offset"),anchor:e.getAttribute("data-aos-anchor"),anchorPlacement:e.getAttribute("data-aos-anchor-placement")};switch(a.offset&&!isNaN(a.offset)&&(o=parseInt(a.offset)),a.anchor&&document.querySelectorAll(a.anchor)&&(e=document.querySelectorAll(a.anchor)[0]),n=(0,r.default)(e).top,a.anchorPlacement){case"top-bottom":break;case"center-bottom":n+=e.offsetHeight/2;break;case"bottom-bottom":n+=e.offsetHeight;break;case"top-center":n+=i/2;break;case"bottom-center":n+=i/2+e.offsetHeight;break;case"center-center":n+=i/2+e.offsetHeight/2;break;case"top-top":n+=i;break;case"bottom-top":n+=e.offsetHeight+i;break;case"center-top":n+=e.offsetHeight/2+i}return a.anchorPlacement||a.offset||isNaN(t)||(o=t),n+o};t.default=a},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e){for(var t=0,n=0;e&&!isNaN(e.offsetLeft)&&!isNaN(e.offsetTop);)t+=e.offsetLeft-("BODY"!=e.tagName?e.scrollLeft:0),n+=e.offsetTop-("BODY"!=e.tagName?e.scrollTop:0),e=e.offsetParent;return{top:n,left:t}};t.default=n},function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e){return e=e||document.querySelectorAll("[data-aos]"),Array.prototype.map.call(e,function(e){return{node:e}})};t.default=n}])});
/* eslint-disable object-shorthand */
/* eslint-disable max-len */

function setActiveBlock(selector) {
  document.querySelector(selector).classList.add('active');
}
function moveToTargetBlock(selector) {
  document.querySelector(selector).scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}
/* eslint-disable max-len */
function chooseYourCharacter(hero) {
  const HEROES = {
    '1': {
      name: 'Юля Коваль',
      declension: 'Юли',
      position: 'блогер, путешественница',
      photo: 'hero-1.png',
      story: 'Неловких моментов не бывает только у тех, кто ничего не делает. В моем случае такие ситуации обычно происходят, когда я не могу рассчитать время и опаздываю на встречи, это заставляет меня испытывать стресс, нервничать и переживать. Приключений, когда у меня дрожали руки и бросало в пот, в жизни было много. Одна из таких ситуаций произошла во время съемок программы «Орел и решка», и она чуть не стоила мне и команде жизни. Мы спускались в шахту в Африке на глубину 1500 метров. Давили отсутствие воздуха и кромешная тьма. Еще бы, полтора километра вглубь нашей планеты! Там абсолютно не было никакого воздуха, было темно и страшно. Мы шли по маленькой самодельной лестнице — это была даже не лестница, а просто палки! И тут с грохотом во мраке взорвался динамит. ',
      answers: ['Я сжала волю в кулак, сконцентрировалась и пошла вперед', 'Вместе с режиссером мы запаниковали, я дернулась и оступилась на лестнице' ],
      storyEnding: {
        correct: 'Режиссер нашей программы был в предынфарктном состоянии, его просто выносили. У меня сработал инстинкт самосохранения. Меня бросило в пот, руки дрожали. Иногда такое происходит у меня, когда лечу в самолете: несмотря на количество перелетов, я очень сильно боюсь летать. В шахте у меня случился настоящий стресс. Хотелось просто остаться в живых, не умереть ни от инфаркта, ни от завала в шахте. Однако там я увидела абсолютно другой мир. В шахте за $5 в месяц люди пашут так, как мы никогда в жизни не работали. Они рискуют жизнью каждый день. Поход туда того стоил — это опыт, это воспоминания. Приходить в себя было некогда, съемки продолжались. Когда я вышла из шахты, пришлось выбросить рубашку, она была насквозь мокрая и грязная. Воспользовалась дезодорантом «Рексона» и пошла дальше — забираться на вулкан.',
        wrong: 'С жутким треском сломалась перекладина. В абсолютной темноте и задымлении я упала в какую-то расщелину и повредила ногу. Оператор оказался проворнее и полез к выходу. Уже на улице он вызвал службу спасения. Специалисты ехали долго, зато вытащили нас с режиссером из шахты всего за 15 минут. Съемки прервались из-за вывихнутой ноги и перелома руки. Это была просто катастрофа!',
      },
      advise: {
        hero: 'Ко всем съемкам и мероприятиям я готовлюсь и настраиваюсь заранее. Учитывая свою активность, эмоциональность и эмпатичность, я не могу назвать себя Мисс Самообладание — 2021, мне еще предстоит постигнуть эту прекрасную черту характера. Даже сейчас, рассказывая про то, как справиться со стрессом, я чувствую, что испытываю его. Вряд ли в ближайшее время я запущу марафон, как выходить из сложных и неловких ситуаций. Реально рабочая схема — это в трудной стрессовой ситуации построить себе дорожную карту. Важно не хвататься сразу за всё, а выбрать дело, которое важнее и проще сделать, удобнее решить именно сейчас, и выстраивать план, постепенно выполняя все дела. В целом я достаточно часто сталкиваюсь со стрессом на работе, в путешествиях и в личной жизни — в такие моменты я концентрируюсь и не допускаю паники. Также я стараюсь чаще улыбаться: хорошее настроение 100%-но добавляет красок в жизнь и снижает стресс.',
        rexona: 'Если вы часто путешествуете, то точно сталкиваетесь с перепадами температур. Специально для таких ситуаций была создана новинка — «Rexona Термозащита». Технология Motionsense в антиперспирантах способствует освобождению дополнительного аромата при повышении влаги, а оболочка водорастворимых микрокапсул с капельками эфирных масел внутри растворяется при выделении пота. Неприятный запах заменяется приятными душистыми веществами, которые чувствуются активнее при интенсивном движении. Будь то забег по шахтам или прыжок с парашютом, умные антиперспиранты линейки «RexonaТермозащита» обеспечивают постоянную защиту от влаги и защиту от пота и запаха в течение дня. Особенно актуальна линейка будет в зимний период, когда есть резкие перепады из теплого помещения на холод и обратно.',
      },
    },
    '2': {
      name: 'Дарья Смирнова',
      declension: 'Даши',
      position: 'преподаватель английского языка, блогер, эксперт-лингвист',
      photo: 'hero-2.png',
      story: 'Не знаю, насколько это стрессовая история, но неловкая точно. В то время я еще ездила к своим ученикам, а не занималась онлайн. Я приезжаю к одному ученику, который был в 8-м или 9-м классе тогда. Приехала, провела урок, уехала. Приезжаю на второй или третий урок к нему, и он достает планшет, чтобы ответить домашнее задание. И тут я вижу, что у него весь iPad забит моими фотографиями.',
      answers: [ 'Возможно, у меня и округлились глаза, но я постаралась не подать виду', 'Я запаниковала и решила выяснить отношения с учеником' ],
      storyEnding: {
        correct: 'Мы проверили домашнее задание, урок прошел как ни в чем не бывало, но к нему я больше не ездила. Родителям сказала, что у меня настолько переполнено расписание, что, к сожалению, они поздно обратились, а я отдаю предпочтение старым клиентам.',
        wrong: 'Урок сорвался. Родители не поняли, что произошло, не заплатили за занятие, а ребенок остался с разбитым сердцем. В такой неловкой ситуации было бы лучше сохранить самообладание, но у меня не получилось.',
      },
      advise: {
        hero: 'Я бы не назвала себя хладнокровным человеком, но, мне кажется, это вопрос моей деятельности — она связана с умением спокойно все объяснять и легко доносить информацию. В любой стрессовой ситуации я спокойна, представляя, будто я на уроке. После уже может быть катастрофа, но во время неловких ситуаций я абстрагируюсь. Также важно ценить себя и свое время. Однажды мы сидели в кафе со знакомыми и друзьями, и тут один парень начал рассказывать, что очень хочет заняться английским языком, и я уже поняла, к чему идет дело. Я стараюсь с друзьями не заниматься, потому что разделяю работу и личные контакты. Конечно же, он говорит, что хотел бы со мной заниматься, спрашивает, сколько стоит занятие. Я отвечаю, он удивляется, что так дорого. И говорит: «А ты скидку не можешь сделать? Мы же знакомые!» После того случая у меня выработался один ответ на такие просьбы. Я всегда отвечаю: «Ну раз мы друзья, может, ты мне больше заплатишь?» Иногда стрессовые ситуации зависят не от тебя: например, когда я была совсем зеленой, меня пригласили в Google поработать переводчиком на интервью с Джейсоном Стейтемом. Я думала, что он меня не понимает, когда переводила вопросы, а оказалось, что не работало оборудование, а не мой английский.',
        rexona: 'Чтобы выглядеть холоднокровно в любой ситуации, попробуйте Rexona Clinical Protection. Антиперспирант в три раза эффективнее базового антиперспиранта согласно тестам. Уникальная технология Defence+ образует микропленку на поверхности кожи, которая защищает от пота и запаха до 96 часов и регулирует повышенное потоотделение даже в экстремальных ситуациях: например, при серьезном стрессе, жаре и во время спорта.',
      },
    },
    '3': {
      name: 'Анастасия Постригай',
      declension: 'Насти',
      position: 'искусствовед, основатель самой крупной в России онлайн-школы по изучению истории искусства OP-POP-ART',
      photo: 'hero-3.png',
      story: 'Лето в Москве выдалось крайне жарким, но на мою активность это не повлияло — нужно было много двигаться и работать. Этим летом мы снимали видео для моего канала на YouTube, были интересные истории, много активности и образов. Естественно, съемки проходят в студии при закрытых окнах, вентилятор включить невозможно, это гарантированный брак по звуку. То есть если на улице плюс 30, то у нас в студии уже почти преисподняя. И так 7–8 часов подряд. Я на съемки, понятно, принарядилась, не подумав, что эта жара и движения не пощадят даже такую не потеющую девушку, как я. Стало ясно, что на блузке останутся следы, значит, надо что-то делать. Моя гример предложила лайфхак: наклеить на подмышки ежедневные прокладки, чтобы избежать конфуза в эфире. Совместными усилиями создали грандиозную многосоставную конструкцию, которая с честью выполнила свою функцию — блузку мы сохранили в первозданном виде, запись прошла отлично, несмотря на жару и мою активную жестикуляцию. Как только выдалась возможность, я вырвалась из душной студии и побежала в коридор, где было чуть-чуть прохладнее. Иду, размахиваю руками, чтобы хоть немного охладиться. Мне навстречу — молодой человек. Как только мы поравнялись, прямо из рукава моей блузки выпадает та самая злосчастная конструкция из ежедневных прокладок и планирует ему под ноги!',
      answers: [ 'Обычно я не краснею, но тут, кажется, сделалась пунцовой. Правда быстро взяла себя в руки и, практически не думая, выпалила: «После того, что вы увидели, теперь, видимо, должны на мне жениться!', 'Я пискнула и ретировалась' ],
      storyEnding: {
        correct: 'Уж не знаю, что он там подумал, может, решил, что я ненормальная, но виду не подал. Мы посмеялись и разошлись каждый в свою сторону. Думаю, что только чувство юмора спасло меня от последующей рефлексии и неприятного осадка, который обычно оставляют такие щекотливые ситуации.',
        wrong: 'Жуткий конфуз! Пришлось бежать с места преступления! До сих пор вспоминаю, и мне неловко. Момент, который часто всплывает, когда пытаешься уснуть. У каждого есть такая ситуация, которая всегда не вовремя всплывает в памяти!',
      },
      advise: {
        hero: 'Я всегда стараюсь выходить из неловких ситуаций с юмором. Это гораздо лучше, чем шаркать ножкой, извиняться, еще больше усугубляя неловкость. Обычно у меня получается разрядить обстановку шуткой. Если я знаю, что мне предстоит стрессовая ситуация — сложные переговоры или еще что-то не сильно приятное, — я стараюсь заранее представить самый страшный и драматичный вариант ее развития, посмотреть на него со всех сторон. Обычно после такого анализа приходишь к выводу, что глобально ничего такого ужасного, даже если все пойдет наперекосяк, нет. Это можно пережить, если все живы и здоровы. Это помогает мне настроиться и пережить грядущий стресс. Конечно, как у всех, бывает и такое, что с эмоциями справиться не получается. Тогда я договариваюсь с собой. Позволяю себе выплескивать негатив, но недолго, минут десять. А потом беру себя в руки, потому что понимаю, что если позволю себе нервничать дольше, то потом мне это аукнется бессонницей, головной болью и прочими неврозами. А оно мне надо? Могу сказать честно: я, как и любой человек, с завидной регулярностью попадаю в самые разные, не всегда приятные ситуации. Но, как говорится, если нельзя победить — возглавь! И в этом мне помогают вера, дисциплина и чувство юмора.',
        rexona: 'Спасти дизайнерское платье или другую одежду от следов и разводов в любых стрессовых ситуациях поможет антиперспирант-аэрозоль Rexona «Антибактериальная и невидимая защита». Он защищает от пота и запаха на 48 часов, помогает черному оставаться черным, а белому — белым, чтобы модная одежда выглядела опрятно и красиво в любой ситуации. Антиперспирант защищает от бактерий и не раздражает нежную кожу в зоне подмышек. Кстати, спрей и карандаш можно использовать и для ног, чтобы предотвратить пот, избежать натирания и чувствовать свежесть.',
      },
    },
    '4': {
      name: 'Ольга Панасенкова',
      declension: 'Оли',
      position: 'основательница и руководитель нейл-студии Ananasnails, топ-мастер маникюра',
      photo: 'hero-4.png',
      story: 'Однажды я была в отпуске в Казани, а новый мастер написала, что не может выйти на работу — у нее полная запись на весь день с 11 утра до 10 вечера. Я была на озере под названием Кабан и каталась на лодке. Отпуск у меня бывает редко, и я стараюсь проводить его активно: больше двигаться, смотреть новые места и открывать для себя разные заведения и развлечения. То, что произошло, повергло меня в шок. В момент сообщения мастера в 23:00 в голове начали бурлить мысли: «Ты в себе вообще? Что за отношение? Ведь сколько раз я шла навстречу, почему так? И договор был: в случае мысли про увольнение отработать обязательно последние дни, где полная запись». Заменить никто не может, все сотрудники заняты. Либо я срочно ищу билет и вылетаю в Москву, чтобы самостоятельно обслужить клиентов, либо обзваниваю их и отменяю. Хотелось плакать или кричать. Единственное, что я смогла выдавить из себя сквозь зубы, были слова: «Спасибо за такое отношение». Рефлексировать долго над ситуацией было нельзя, я злилась и прокручивала в голове варианты решения. Романтическая поездка на лодке стала совсем не романтичной. Что делать? Я понимала, что никак нельзя падать лицом в грязь, и имидж очень важен. Пока я металась, начался дождь. Я в середине озера на лодке, никого рядом. Можно еще больше стресса в этой ситуации? Теперь стоял выбор: утонуть с лодкой или спастись и отменять запись.',
      answers: [ 'Вдох-выдох. Я дождалась, когда закончится паника, и спокойно двинулась к берегу', 'Поддавшись панике, я закричала: «Помогите, я так больше не могу!»' ],
      storyEnding: {
        correct: 'Постепенно дождь пошел на спад, как и накал моих эмоций. Пришлось звонить клиентам лично, но уже утром. Я приносила извинения, что было очень неловко: терпеть не могу извиняться за других, но я несу ответственность. Когда с клиентами на связь выходит владелец салона, то их лояльность гораздо лучше. Клиенты были в шоке не меньше меня, все пошли навстречу. Одной девушке пришлось сделать огромную скидку, чтобы сохранить хорошее отношение. Да, я разово потеряла немного в деньгах, но знала, что так будет лучше. Отношение и честность решают всё. Все с пониманием к этому отнеслись и перенесли запись на другой день, всё сделали, всем довольны. Безвыходных ситуаций не бывает. Было очень тревожно, потому что люди могли реагировать разным образом, не хотелось, чтобы ситуация как-то сказалась на имидже студии.',
        wrong: 'В лодке был спасательный жилет, но воду выгребать было нечем. Дрожащими руками стала набирать номер службы спасения. Когда меня забрали спасатели, я выдохнула и собралась с мыслями. Сойдя на берег, я поехала в аэропорт искать билет. Ближайший вылет, на который доступны билеты, был только утром. Плюс время в пути. Так или иначе я везде опаздывала, оставалось лишь вечернее время для обслуживания клиентов моего мастера. Саму девушку пришлось уволить из-за такой безответственности, а мне — пожертвовать редким отпуском. Не утонула, и на том спасибо!',
      },
      advise: {
        hero: 'К стрессам я привыкла. Например, пробки на дорогах, и я понимаю, что меня будет ждать клиент. Естественно, я сначала предупреждаю человека, понимаю, что реакция может быть абсолютно разной. Чаще адекватная. Бывали случаи, что человеку неудобно, тогда я делала большую скидку и переносила сеанс на любое другое удобное время. Все бывает, иногда и к нам опаздывают клиенты, тогда мы тоже идем навстречу. Стрессовые ситуации несильно выводят меня из себя, нахожу решение очень быстро. Важно собраться и не теряться, каждый вопрос абсолютно решаем. Как работодатель я часто провожу собеседования и не всегда понимаю, как выстроить коммуникацию или, например, отказать человеку. В музыкальной школе еще в подростковом возрасте у меня дрожали руки, и преподаватель говорила: «Бойтесь перед сценой, но не на сцене». Это всегда работает! Если ты нервничаешь, лучше в этот момент ничего не делать, с горячей головой можно натворить дел. Лучше взять небольшую паузу и потом решить вопрос, например, после того как подышал — есть специальная техника дыхания.',
        rexona: 'Абсолютная уверенность и гибкость — вот то, что отличает хорошего руководителя от остальных. Антиперспирант «Rexona Абсолютная уверенность» подстроится под любой ритм вашей жизни. Вместе с защитой от пота и запаха в течение 48 часов технология Motionsense дарит ощущение свежести, а микрокапсулы, нанесенные на поверхность кожи, раскрываются при каждом движении. Вместо пота средство дарит приятный аромат грейпфрута и яблока. Чем больше движения и работы, тем надежнее защита. «Абсолютная уверенность» нужна, чтобы освободить мысли от неловких ситуаций и заботы о внешнем виде и сосредоточиться на главном — достижении новых целей!',
      },
    },
    '5': {
      name: 'Анна Захарова',
      declension: 'Ани',
      position: 'актриса театра и кино, хореограф',
      photo: 'hero-5.png',
      story: 'Мы с мужем часто путешествуем, и прошлым летом решили открыть для себя Алтай. В тех краях без машины никуда, поэтому мы арендовали джип. Муж у меня без прав (водительских, конечно), поэтому за рулем все 2500 км была я. Спасибо возможностям внедорожника, так как мы были даже на тех «диких» дорогах, на которые изначально не собирались: перевал Кату-Ярык и долина Чулышмана, вам привет! Все путешествие шло как по маслу. Но в последний день… В последний день мы решили увидеть «всё, что не успели», и рванули на гору Чёртов палец. Ох, какая же она оказалась для меня Чёртова! Крадёмся на машине наверх, дорога разбита, ямы, мимо лихо мчатся уазики, но я не спешу, доезжаем почти до верха, решаем оставить машину и пройти пешком. Сходили, сделали фотографии, пора возвращаться. Но… нужно развернуться. А там обрыв. Я, нисколько не сомневаясь в своих навыках вождения, сажусь, делаю привычные движения и понимаю, что машина начинает скатываться с горы задом в этот обрыв. Она мне не поддается. Начинаю паниковать (внимание) не потому, что мы в ней, а потому, что она арендована, а как же мы ее вернем, если она в обрыв скатится? Резко тормоз. Резко ручник. Холодный пот.',
      answers: [ 'Вдох-выдох. Выключаю всё, закрываю глаза и думаю, что делать', 'Муж закричал, я запаниковала и начала резко двигаться' ],
      storyEnding: {
        correct: 'Вокруг ни души. Видимость почти нулевая (мимо проехавшие до этого уазики оставили свой след). Сердце колотится страшно, но нужно перестать паниковать. Мои медитативные рассуждения, холодный ум и упорство Козерога привели к мысли, что полный привод после такого большого пути просто не может подвести, и я справлюсь. На третьей попытке мы буквально выкарабкались из этого обрыва. Далее почти всю дорогу до города от избытка чувств и усталости у меня катились градом слезы, остаток пути сопровождал очень отборный мат',
        wrong: 'От резких движений машина продолжает скатываться в неизвестность, вокруг туман и никого. В итоге все закончилось службой спасения и разбитой машиной. И остаток отпуска мы провели в больнице.',
      },
      advise: {
        hero: 'Собраться и не опускать руки — лучшее, что можно сделать в любой стрессовой ситуации. Идеально — взять паузу на пару минут, перевести дыхание и подумать, как выйти из сомнительной ситуации. Главное, помнить, что всегда есть решение.',
        rexona: 'В самых стрессовых ситуациях для творческих и чувствительных натур подойдет антиперспирант или дезодорант «Rexona Гипоаллергенный без запаха». Он защищает на 48 часов, и будет действовать, даже если вы застрянете надолго в сломанном лифте или в дорожной колее. Средство не содержит спирта, красителей и парабенов, не перебивает запах ваших духов и подходит для людей, склонных к аллергии и раздражениям кожи.',
      },
    },
  };

  return HEROES[hero];
}
/* eslint-disable max-len */

const maxTextLength = 170;

function fillText(text, elem, story = false, readable = false) {
  if (!story) {
    elem.textContent = text;
  } else {
    if (text.length > maxTextLength) {
      const begining = text.substring(0, maxTextLength),
        ending = text.substring(maxTextLength);

      elem.querySelector('p').innerHTML = `<span class="story-item__text">${begining}</span><span class="story-item__dots">...</span><span class="story-item__hidden">${ending}</span>`;

      if (!readable) {
        elem.querySelector('.js-more').style.display = 'block';
      }
    } else {
      elem.querySelector('p').textContent = text;
    }
  }
}
function fillPhoto(photo, name, position, elem) {
  elem.src = `./images/${photo}`;
  elem.alt = `${name} — ${position}`;
}
function fillQuestionBlock(hero) {
  const block = document.getElementById('question'),
    photo = block.querySelector('img'),
    name = block.querySelector('.question-story__person-name'),
    position = block.querySelector('.question-story__person-position'),
    story = block.querySelector('.question-story__item'),
    buttons = block.querySelectorAll('.question-answers__buttons-item');

  fillPhoto(hero.photo, hero.name, hero.position, photo);

  fillText(hero.name, name);
  fillText(hero.position, position);
  fillText(hero.story, story, true);

  buttons.forEach((item, index) => {
    item.querySelector('.question-answers__buttons-text').textContent = hero.answers[index];
  });
}
function fillAnswerBlock(hero, answer) {
  const block = document.getElementById('answer'),
    photo = block.querySelector('img'),
    name = block.querySelector('.answer-story__person-name'),
    position = block.querySelector('.answer-story__person-position'),
    story = block.querySelector('.answer-story__item'),
    storyTitle = story.querySelector('.answer-story__item-title'),
    advise = block.querySelector('.answer-advise'),
    togglerText = block.querySelector('.switch__toggler-text--hero');

  fillPhoto(hero.photo, hero.name, hero.position, photo);
  fillText(hero.name, name);
  fillText(hero.position, position);

  if (answer === 'correct') {
    storyTitle.textContent = 'Так и было!';

    fillText(hero.storyEnding.correct, story, true);
  } else {
    storyTitle.textContent = 'Было не так';

    fillText(hero.storyEnding.wrong, story, true);
  }

  fillText(hero.declension, togglerText);

  fillText(hero.advise.hero, advise, true);
}

function navigation() {
  const SECTIONS = [ '#first', '#women', '#question', '#answer', '#checklist', '#test' ];

  let selectedHero = {},
    currentSection = 0;

  const getSectionIndex = elem => {
    for (const key in SECTIONS) {
      if (SECTIONS[key] === elem) return key;
    }
  };

  const indicator = new WheelIndicator({
    elem: document.querySelector('.main'),
    // preventMouse: true,
    callback: function(e) {
      if (e.direction === 'down') {
        if (currentSection < SECTIONS.length - 1) {
          if (document.querySelector(SECTIONS[currentSection + 1]).classList.contains('active')) {
            currentSection++;
          } else {
            currentSection = 4;
          }

          moveToTargetBlock(SECTIONS[currentSection]);
        }
      } else if (e.direction === 'up') {
        if (currentSection > 0) {
          if (document.querySelector(SECTIONS[currentSection - 1]).classList.contains('active')) {
            currentSection--;
          } else {
            if (document.querySelector(SECTIONS[currentSection - 2]).classList.contains('active')) {
              currentSection = 2;
            } else {
              currentSection = 1;
            }
          }

          moveToTargetBlock(SECTIONS[currentSection]);
        }
      }
    }
  });

  document.addEventListener('mouseover', e => {
    if (e.target.closest('.js-scrollable')) {
      indicator._options.preventMouse = false;
    } else {
      indicator._options.preventMouse = true;
    }
  });

  document.querySelectorAll('.js-scrollable').forEach(item => {
    item.addEventListener('mouseleave', () => {
      if (item.classList.contains('question-story__item-text')) {
        currentSection = 2;
      }

      if (item.classList.contains('answer-story__item-text') || item.classList.contains('answer-advise__text')) {
        currentSection = 3;
      }
    });
  });

  document.addEventListener('click', e => {
    if (e.target.classList.contains('js-nav')) {
      if (e.target.tagName.toLowerCase() === 'a') {
        e.preventDefault();
      }

      if (e.target.dataset.target) {
        document.querySelectorAll('.js-radio').forEach(item => {
          item.checked = false;
        });

        if (document.querySelector('.readable')) {
          document.querySelectorAll('.readable').forEach(item => {
            item.classList.remove('readable');

            item.querySelector('.js-more').style.display = 'block';
          });
        }

        document.getElementById('answer').classList.remove('active');

        selectedHero = chooseYourCharacter(e.target.dataset.target);

        fillQuestionBlock(selectedHero);
      }

      if (e.target.dataset.answer) {
        fillAnswerBlock(selectedHero, e.target.dataset.answer);
      }

      if (!e.target.classList.contains('answer-advise__another')) {
        setActiveBlock(e.target.dataset.nav);
        currentSection++;
      } else {
        currentSection = 1;
      }

      setTimeout(() => {
        moveToTargetBlock(e.target.dataset.nav);
      }, 200);
    }

    if (e.target.classList.contains('js-more')) {
      e.preventDefault();

      e.target.style.display = 'none';
      e.target.closest('.js-more-parent').classList.add('readable');
    }

    if (e.target.classList.contains('js-advise-toggler')) {
      const advise = e.target.closest('.answer-advise'),
        readable = (e.target.closest('.answer-advise').querySelector('.js-more').style.display === 'none') ? true : false;

      if (e.target.checked) {
        fillText(selectedHero.advise.rexona, advise, true, readable);
      } else {
        fillText(selectedHero.advise.hero, advise, true, readable);
      }
    }
  });
}
/* eslint-disable max-len */
function setActiveSection(sections, current) {
  sections.forEach((item, index) => {
    if (index !== current) {
      item.classList.remove('active');
    } else {
      item.classList.add('active');
    }
  });
}
function calcResult(array) {
  const answers = {};

  let max = 0,
    resultKey = '';

  array.forEach(item => {
    if (answers[item]) {
      answers[item]++;
    } else {
      answers[item] = 1;
    }
  });

  for (const key in answers) {
    if (answers[key] > max) {
      max = +answers[key];
      resultKey = key;
    }
  }

  return resultKey;
}
function postData(body) {
  return fetch('/save_form/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  });
}

function quiz() {
  const RESULTS = {
    '1': {
      title: 'Выиграйте подарок для настоящей карьеристки!',
      text: 'Кажется, пошатнуть ваше внутреннее равновесие могут только рабочие вопросы. Карьера — дело тонкое, берегите себя! Почувствовать себя уверенно в любой ситуации поможет подарок от Rexona!',
    },
    '2': {
      title: 'Выиграйте подарок для экстремалки!',
      text: 'Больше адреналина и вдохновения! Ваше тело явно требует новых впечатлений, и ничто не должно мешать ими наслаждаться. Почувствовать себя уверенно в любой ситуации поможет подарок от Rexona!',
    },
    '3': {
      title: 'Выиграйте подарок для романтической натуры!',
      text: 'Вы натура утонченная, как героини песен Валерия Меладзе. Девушка из высшего общества должна наслаждаться романтикой и красотой момента, а не страдать в поте лица. Почувствовать себя уверенно в любой ситуации поможет подарок от Rexona!',
    },
    '4': {
      title: 'Выиграйте подарок для истинной модницы!',
      text: 'Разные носки иногда хорошо сочетаются и придают образу изюминку. Меньше стресса и тревоги, тогда точно покорите модный Олимп! Почувствовать себя уверенно в любой ситуации поможет подарок от Rexona!',
    },
  };

  const quiz = document.getElementById('test'),
    sections = quiz.querySelectorAll('.quiz-sections__item'),
    result = document.getElementById('result'),
    resultTitle = quiz.querySelector('.quiz-reg__title'),
    resultText = quiz.querySelector('.quiz-reg__text'),
    answers = [],
    modal = document.querySelector('.quiz-modal'),
    modalRegistration = modal.querySelector('.quiz-modal__first'),
    modalLoader = modal.querySelector('.quiz-modal__loader'),
    modalAfter = modal.querySelector('.quiz-modal__after'),
    modalError = modal.querySelector('.quiz-modal__error'),
    form = quiz.querySelector('form');

  let activeSection = 0;

  quiz.addEventListener('click', e => {
    if (e.target.classList.contains('js-quiz-nav')) {
      e.preventDefault();

      activeSection++;
      setActiveSection(sections, activeSection);
    }

    if (e.target.classList.contains('quiz-answer__input')) {
      activeSection++;

      answers.push(e.target.dataset.value);

      if (activeSection === sections.length - 1) {
        resultTitle.textContent = RESULTS[calcResult(answers)].title;
        resultText.textContent = RESULTS[calcResult(answers)].text;
        result.value = calcResult(answers);
      }

      setTimeout(() => {
        setActiveSection(sections, activeSection);
      }, 300);
    }

    if (e.target.classList.contains('quiz-reg__cta-button')) {
      e.preventDefault();

      modal.classList.add('active');
    }

    if (e.target.classList.contains('js-quiz-reg')) {
      e.preventDefault();

      result.value = 0;
      modal.classList.add('active');
    }

    if (e.target.classList.contains('quiz-modal__overlay') || e.target.classList.contains('quiz-modal__close')) {
      modal.classList.remove('active');
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    modalRegistration.style.display = 'none';
    modalLoader.style.display = 'block';

    const formData = new FormData(form),
      body = {};

    formData.forEach((value, key) => {
      body[key] = value;
    });

    postData(body)
      .then(response => {
        if (response.status !== 200) {
          throw new Error('Network status is not 200');
        }

        return response.json();
      })
      .then(data => {
        if (data.error_no === 0) {

          setTimeout(() => {
            modalLoader.style.display = 'none';
            modalAfter.style.display = 'block';
          }, 2000);

        } else if (data.error_no > 0) {

          setTimeout(() => {
            modalLoader.style.display = 'none';
            modalRegistration.style.display = 'block';

            modalError.textContent = data.error_text;
            modalError.style.display = 'block';
          }, 2000);

        }
      })
      .catch(error => {
        console.error(error);

        setTimeout(() => {
          modalLoader.style.display = 'none';
          modalRegistration.style.display = 'block';
          modalError.style.display = 'block';
        }, 2000);
      });
  });
}
function heroes() {
  const heroes = document.querySelectorAll('.heroes-item');

  document.addEventListener('click', e => {
    if (e.target.closest('.heroes-item')) {
      setActiveHero(heroes);
    }
  });
}

function setActiveHero(heroes) {
  heroes.forEach(item => {
    if (item.querySelector('input').checked) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  AOS.init();
  navigation();
  heroes();
  quiz();
});
//# sourceMappingURL=maps/main.js.map
