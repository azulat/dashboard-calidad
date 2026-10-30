var ne=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function U(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var E={exports:{}},n={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var h=Symbol.for("react.element"),D=Symbol.for("react.portal"),V=Symbol.for("react.fragment"),F=Symbol.for("react.strict_mode"),N=Symbol.for("react.profiler"),z=Symbol.for("react.provider"),H=Symbol.for("react.context"),B=Symbol.for("react.forward_ref"),W=Symbol.for("react.suspense"),G=Symbol.for("react.memo"),K=Symbol.for("react.lazy"),S=Symbol.iterator;function Z(e){return e===null||typeof e!="object"?null:(e=S&&e[S]||e["@@iterator"],typeof e=="function"?e:null)}var $={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},j=Object.assign,L={};function d(e,t,r){this.props=e,this.context=t,this.refs=L,this.updater=r||$}d.prototype.isReactComponent={};d.prototype.setState=function(e,t){if(typeof e!="object"&&typeof e!="function"&&e!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,e,t,"setState")};d.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")};function O(){}O.prototype=d.prototype;function w(e,t,r){this.props=e,this.context=t,this.refs=L,this.updater=r||$}var x=w.prototype=new O;x.constructor=w;j(x,d.prototype);x.isPureReactComponent=!0;var g=Array.isArray,M=Object.prototype.hasOwnProperty,b={current:null},P={key:!0,ref:!0,__self:!0,__source:!0};function A(e,t,r){var o,u={},i=null,s=null;if(t!=null)for(o in t.ref!==void 0&&(s=t.ref),t.key!==void 0&&(i=""+t.key),t)M.call(t,o)&&!P.hasOwnProperty(o)&&(u[o]=t[o]);var l=arguments.length-2;if(l===1)u.children=r;else if(1<l){for(var c=Array(l),f=0;f<l;f++)c[f]=arguments[f+2];u.children=c}if(e&&e.defaultProps)for(o in l=e.defaultProps,l)u[o]===void 0&&(u[o]=l[o]);return{$$typeof:h,type:e,key:i,ref:s,props:u,_owner:b.current}}function J(e,t){return{$$typeof:h,type:e.type,key:t,ref:e.ref,props:e.props,_owner:e._owner}}function C(e){return typeof e=="object"&&e!==null&&e.$$typeof===h}function Q(e){var t={"=":"=0",":":"=2"};return"$"+e.replace(/[=:]/g,function(r){return t[r]})}var R=/\/+/g;function _(e,t){return typeof e=="object"&&e!==null&&e.key!=null?Q(""+e.key):t.toString(36)}function k(e,t,r,o,u){var i=typeof e;(i==="undefined"||i==="boolean")&&(e=null);var s=!1;if(e===null)s=!0;else switch(i){case"string":case"number":s=!0;break;case"object":switch(e.$$typeof){case h:case D:s=!0}}if(s)return s=e,u=u(s),e=o===""?"."+_(s,0):o,g(u)?(r="",e!=null&&(r=e.replace(R,"$&/")+"/"),k(u,t,r,"",function(f){return f})):u!=null&&(C(u)&&(u=J(u,r+(!u.key||s&&s.key===u.key?"":(""+u.key).replace(R,"$&/")+"/")+e)),t.push(u)),1;if(s=0,o=o===""?".":o+":",g(e))for(var l=0;l<e.length;l++){i=e[l];var c=o+_(i,l);s+=k(i,t,r,c,u)}else if(c=Z(e),typeof c=="function")for(e=c.call(e),l=0;!(i=e.next()).done;)i=i.value,c=o+_(i,l++),s+=k(i,t,r,c,u);else if(i==="object")throw t=String(e),Error("Objects are not valid as a React child (found: "+(t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t)+"). If you meant to render a collection of children, use an array instead.");return s}function m(e,t,r){if(e==null)return e;var o=[],u=0;return k(e,o,"","",function(i){return t.call(r,i,u++)}),o}function X(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(r){(e._status===0||e._status===-1)&&(e._status=1,e._result=r)},function(r){(e._status===0||e._status===-1)&&(e._status=2,e._result=r)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var a={current:null},v={transition:null},Y={ReactCurrentDispatcher:a,ReactCurrentBatchConfig:v,ReactCurrentOwner:b};function I(){throw Error("act(...) is not supported in production builds of React.")}n.Children={map:m,forEach:function(e,t,r){m(e,function(){t.apply(this,arguments)},r)},count:function(e){var t=0;return m(e,function(){t++}),t},toArray:function(e){return m(e,function(t){return t})||[]},only:function(e){if(!C(e))throw Error("React.Children.only expected to receive a single React element child.");return e}};n.Component=d;n.Fragment=V;n.Profiler=N;n.PureComponent=w;n.StrictMode=F;n.Suspense=W;n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Y;n.act=I;n.cloneElement=function(e,t,r){if(e==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+e+".");var o=j({},e.props),u=e.key,i=e.ref,s=e._owner;if(t!=null){if(t.ref!==void 0&&(i=t.ref,s=b.current),t.key!==void 0&&(u=""+t.key),e.type&&e.type.defaultProps)var l=e.type.defaultProps;for(c in t)M.call(t,c)&&!P.hasOwnProperty(c)&&(o[c]=t[c]===void 0&&l!==void 0?l[c]:t[c])}var c=arguments.length-2;if(c===1)o.children=r;else if(1<c){l=Array(c);for(var f=0;f<c;f++)l[f]=arguments[f+2];o.children=l}return{$$typeof:h,type:e.type,key:u,ref:i,props:o,_owner:s}};n.createContext=function(e){return e={$$typeof:H,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},e.Provider={$$typeof:z,_context:e},e.Consumer=e};n.createElement=A;n.createFactory=function(e){var t=A.bind(null,e);return t.type=e,t};n.createRef=function(){return{current:null}};n.forwardRef=function(e){return{$$typeof:B,render:e}};n.isValidElement=C;n.lazy=function(e){return{$$typeof:K,_payload:{_status:-1,_result:e},_init:X}};n.memo=function(e,t){return{$$typeof:G,type:e,compare:t===void 0?null:t}};n.startTransition=function(e){var t=v.transition;v.transition={};try{e()}finally{v.transition=t}};n.unstable_act=I;n.useCallback=function(e,t){return a.current.useCallback(e,t)};n.useContext=function(e){return a.current.useContext(e)};n.useDebugValue=function(){};n.useDeferredValue=function(e){return a.current.useDeferredValue(e)};n.useEffect=function(e,t){return a.current.useEffect(e,t)};n.useId=function(){return a.current.useId()};n.useImperativeHandle=function(e,t,r){return a.current.useImperativeHandle(e,t,r)};n.useInsertionEffect=function(e,t){return a.current.useInsertionEffect(e,t)};n.useLayoutEffect=function(e,t){return a.current.useLayoutEffect(e,t)};n.useMemo=function(e,t){return a.current.useMemo(e,t)};n.useReducer=function(e,t,r){return a.current.useReducer(e,t,r)};n.useRef=function(e){return a.current.useRef(e)};n.useState=function(e){return a.current.useState(e)};n.useSyncExternalStore=function(e,t,r){return a.current.useSyncExternalStore(e,t,r)};n.useTransition=function(){return a.current.useTransition()};n.version="18.3.1";E.exports=n;var p=E.exports;const oe=U(p);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),T=(...e)=>e.filter((t,r,o)=>!!t&&t.trim()!==""&&o.indexOf(t)===r).join(" ").trim();/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var te={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const re=p.forwardRef(({color:e="currentColor",size:t=24,strokeWidth:r=2,absoluteStrokeWidth:o,className:u="",children:i,iconNode:s,...l},c)=>p.createElement("svg",{ref:c,...te,width:t,height:t,stroke:e,strokeWidth:o?Number(r)*24/Number(t):r,className:T("lucide",u),...l},[...s.map(([f,q])=>p.createElement(f,q)),...Array.isArray(i)?i:[i]]));/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=(e,t)=>{const r=p.forwardRef(({className:o,...u},i)=>p.createElement(re,{ref:i,iconNode:t,className:T(`lucide-${ee(e)}`,o),...u}));return r.displayName=`${e}`,r};/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ue=y("CalendarRange",[["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M16 2v4",key:"4m81vk"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M17 14h-6",key:"bkmgh3"}],["path",{d:"M13 18H7",key:"bb0bb7"}],["path",{d:"M7 14h.01",key:"1qa3f1"}],["path",{d:"M17 18h.01",key:"1bdyru"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ie=y("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ce=y("CircleCheck",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=y("Layers",[["path",{d:"m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z",key:"8b97xw"}],["path",{d:"m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65",key:"dd6zsq"}],["path",{d:"m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65",key:"ep9fru"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=y("RotateCcw",[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=y("SlidersHorizontal",[["line",{x1:"21",x2:"14",y1:"4",y2:"4",key:"obuewd"}],["line",{x1:"10",x2:"3",y1:"4",y2:"4",key:"1q6298"}],["line",{x1:"21",x2:"12",y1:"12",y2:"12",key:"1iu8h1"}],["line",{x1:"8",x2:"3",y1:"12",y2:"12",key:"ntss68"}],["line",{x1:"21",x2:"16",y1:"20",y2:"20",key:"14d8ph"}],["line",{x1:"12",x2:"3",y1:"20",y2:"20",key:"m0wm8r"}],["line",{x1:"14",x2:"14",y1:"2",y2:"6",key:"14e1ph"}],["line",{x1:"8",x2:"8",y1:"10",y2:"14",key:"1i6ji0"}],["line",{x1:"16",x2:"16",y1:"18",y2:"22",key:"1lctlv"}]]);/**
 * @license lucide-react v0.460.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fe=y("TrendingUp",[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]]);export{ce as C,le as L,oe as R,ae as S,fe as T,se as a,ie as b,ne as c,ue as d,U as g,p as r};
