var dE=Object.defineProperty;var uE=Object.getPrototypeOf;var cE=Reflect.get;var hh=t=>{throw TypeError(t)};var hE=(t,e,i)=>e in t?dE(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i;var mh=(t,e,i)=>hE(t,typeof e!="symbol"?e+"":e,i),Ol=(t,e,i)=>e.has(t)||hh("Cannot "+i);var A=(t,e,i)=>(Ol(t,e,"read from private field"),i?i.call(t):e.get(t)),We=(t,e,i)=>e.has(t)?hh("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),Qe=(t,e,i,a)=>(Ol(t,e,"write to private field"),a?a.call(t,i):e.set(t,i),i),dt=(t,e,i)=>(Ol(t,e,"access private method"),i);var Jn=(t,e,i)=>cE(uE(t),i,e);import{R as Mn,r as xn}from"./index-Bs8wFp6R.js";import{H as mE,C as pE}from"./hls-MmTFPL5i.js";import{C as es,M as vE}from"./mixin-DIQKSja0.js";var fE=Object.create,Qm=Object.defineProperty,EE=Object.getOwnPropertyDescriptor,_E=Object.getOwnPropertyNames,bE=Object.getPrototypeOf,gE=Object.prototype.hasOwnProperty,jm=function(t,e){return function(){return t&&(e=t(t=0)),e}},Je=function(t,e){return function(){return e||t((e={exports:{}}).exports,e),e.exports}},yE=function(t,e,i,a){if(e&&typeof e=="object"||typeof e=="function")for(var r=_E(e),n=0,s=r.length,o;n<s;n++)o=r[n],!gE.call(t,o)&&o!==i&&Qm(t,o,{get:(function(l){return e[l]}).bind(null,o),enumerable:!(a=EE(e,o))||a.enumerable});return t},_t=function(t,e,i){return i=t!=null?fE(bE(t)):{},yE(!t||!t.__esModule?Qm(i,"default",{value:t,enumerable:!0}):i,t)},si=Je(function(t,e){var i;typeof window<"u"?i=window:typeof global<"u"?i=global:typeof self<"u"?i=self:i={},e.exports=i});function ka(t,e){return e!=null&&typeof Symbol<"u"&&e[Symbol.hasInstance]?!!e[Symbol.hasInstance](t):ka(t,e)}var wa=jm(function(){wa()});function Zm(t){"@swc/helpers - typeof";return t&&typeof Symbol<"u"&&t.constructor===Symbol?"symbol":typeof t}var Xm=jm(function(){}),Jm=Je(function(t,e){var i=Array.prototype.slice;e.exports=a;function a(r,n){for(("length"in r)||(r=[r]),r=i.call(r);r.length;){var s=r.shift(),o=n(s);if(o)return o;s.childNodes&&s.childNodes.length&&(r=i.call(s.childNodes).concat(r))}}}),TE=Je(function(t,e){wa(),e.exports=i;function i(a,r){if(!ka(this,i))return new i(a,r);this.data=a,this.nodeValue=a,this.length=a.length,this.ownerDocument=r||null}i.prototype.nodeType=8,i.prototype.nodeName="#comment",i.prototype.toString=function(){return"[object Comment]"}}),AE=Je(function(t,e){wa(),e.exports=i;function i(a,r){if(!ka(this,i))return new i(a);this.data=a||"",this.length=this.data.length,this.ownerDocument=r||null}i.prototype.type="DOMTextNode",i.prototype.nodeType=3,i.prototype.nodeName="#text",i.prototype.toString=function(){return this.data},i.prototype.replaceData=function(a,r,n){var s=this.data,o=s.substring(0,a),l=s.substring(a+r,s.length);this.data=o+n+l,this.length=this.data.length}}),ep=Je(function(t,e){e.exports=i;function i(a){var r=this,n=a.type;a.target||(a.target=r),r.listeners||(r.listeners={});var s=r.listeners[n];if(s)return s.forEach(function(o){a.currentTarget=r,typeof o=="function"?o(a):o.handleEvent(a)});r.parentNode&&r.parentNode.dispatchEvent(a)}}),tp=Je(function(t,e){e.exports=i;function i(a,r){var n=this;n.listeners||(n.listeners={}),n.listeners[a]||(n.listeners[a]=[]),n.listeners[a].indexOf(r)===-1&&n.listeners[a].push(r)}}),ip=Je(function(t,e){e.exports=i;function i(a,r){var n=this;if(n.listeners&&n.listeners[a]){var s=n.listeners[a],o=s.indexOf(r);o!==-1&&s.splice(o,1)}}}),kE=Je(function(t,e){Xm(),e.exports=a;var i=["area","base","br","col","embed","hr","img","input","keygen","link","menuitem","meta","param","source","track","wbr"];function a(u){switch(u.nodeType){case 3:return p(u.data);case 8:return"<!--"+u.data+"-->";default:return r(u)}}function r(u){var d=[],v=u.tagName;return u.namespaceURI==="http://www.w3.org/1999/xhtml"&&(v=v.toLowerCase()),d.push("<"+v+c(u)+o(u)),i.indexOf(v)>-1?d.push(" />"):(d.push(">"),u.childNodes.length?d.push.apply(d,u.childNodes.map(a)):u.textContent||u.innerText?d.push(p(u.textContent||u.innerText)):u.innerHTML&&d.push(u.innerHTML),d.push("</"+v+">")),d.join("")}function n(u,d){var v=Zm(u[d]);return d==="style"&&Object.keys(u.style).length>0?!0:u.hasOwnProperty(d)&&(v==="string"||v==="boolean"||v==="number")&&d!=="nodeName"&&d!=="className"&&d!=="tagName"&&d!=="textContent"&&d!=="innerText"&&d!=="namespaceURI"&&d!=="innerHTML"}function s(u){if(typeof u=="string")return u;var d="";return Object.keys(u).forEach(function(v){var f=u[v];v=v.replace(/[A-Z]/g,function(b){return"-"+b.toLowerCase()}),d+=v+":"+f+";"}),d}function o(u){var d=u.dataset,v=[];for(var f in d)v.push({name:"data-"+f,value:d[f]});return v.length?l(v):""}function l(u){var d=[];return u.forEach(function(v){var f=v.name,b=v.value;f==="style"&&(b=s(b)),d.push(f+'="'+m(b)+'"')}),d.length?" "+d.join(" "):""}function c(u){var d=[];for(var v in u)n(u,v)&&d.push({name:v,value:u[v]});for(var f in u._attributes)for(var b in u._attributes[f]){var E=u._attributes[f][b],T=(E.prefix?E.prefix+":":"")+b;d.push({name:T,value:E.value})}return u.className&&d.push({name:"class",value:u.className}),d.length?l(d):""}function p(u){var d="";return typeof u=="string"?d=u:u&&(d=u.toString()),d.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function m(u){return p(u).replace(/"/g,"&quot;")}}),ap=Je(function(t,e){wa();var i=Jm(),a=ep(),r=tp(),n=ip(),s=kE(),o="http://www.w3.org/1999/xhtml";e.exports=l;function l(c,p,m){if(!ka(this,l))return new l(c);var u=m===void 0?o:m||null;this.tagName=u===o?String(c).toUpperCase():c,this.nodeName=this.tagName,this.className="",this.dataset={},this.childNodes=[],this.parentNode=null,this.style={},this.ownerDocument=p||null,this.namespaceURI=u,this._attributes={},this.tagName==="INPUT"&&(this.type="text")}l.prototype.type="DOMElement",l.prototype.nodeType=1,l.prototype.appendChild=function(c){return c.parentNode&&c.parentNode.removeChild(c),this.childNodes.push(c),c.parentNode=this,c},l.prototype.replaceChild=function(c,p){c.parentNode&&c.parentNode.removeChild(c);var m=this.childNodes.indexOf(p);return p.parentNode=null,this.childNodes[m]=c,c.parentNode=this,p},l.prototype.removeChild=function(c){var p=this.childNodes.indexOf(c);return this.childNodes.splice(p,1),c.parentNode=null,c},l.prototype.insertBefore=function(c,p){c.parentNode&&c.parentNode.removeChild(c);var m=p==null?-1:this.childNodes.indexOf(p);return m>-1?this.childNodes.splice(m,0,c):this.childNodes.push(c),c.parentNode=this,c},l.prototype.setAttributeNS=function(c,p,m){var u=null,d=p,v=p.indexOf(":");if(v>-1&&(u=p.substr(0,v),d=p.substr(v+1)),this.tagName==="INPUT"&&p==="type")this.type=m;else{var f=this._attributes[c]||(this._attributes[c]={});f[d]={value:m,prefix:u}}},l.prototype.getAttributeNS=function(c,p){var m=this._attributes[c],u=m&&m[p]&&m[p].value;return this.tagName==="INPUT"&&p==="type"?this.type:typeof u!="string"?null:u},l.prototype.removeAttributeNS=function(c,p){var m=this._attributes[c];m&&delete m[p]},l.prototype.hasAttributeNS=function(c,p){var m=this._attributes[c];return!!m&&p in m},l.prototype.setAttribute=function(c,p){return this.setAttributeNS(null,c,p)},l.prototype.getAttribute=function(c){return this.getAttributeNS(null,c)},l.prototype.removeAttribute=function(c){return this.removeAttributeNS(null,c)},l.prototype.hasAttribute=function(c){return this.hasAttributeNS(null,c)},l.prototype.removeEventListener=n,l.prototype.addEventListener=r,l.prototype.dispatchEvent=a,l.prototype.focus=function(){},l.prototype.toString=function(){return s(this)},l.prototype.getElementsByClassName=function(c){var p=c.split(" "),m=[];return i(this,function(u){if(u.nodeType===1){var d=u.className||"",v=d.split(" ");p.every(function(f){return v.indexOf(f)!==-1})&&m.push(u)}}),m},l.prototype.getElementsByTagName=function(c){c=c.toLowerCase();var p=[];return i(this.childNodes,function(m){m.nodeType===1&&(c==="*"||m.tagName.toLowerCase()===c)&&p.push(m)}),p},l.prototype.contains=function(c){return i(this,function(p){return c===p})||!1}}),wE=Je(function(t,e){wa();var i=ap();e.exports=a;function a(r){if(!ka(this,a))return new a;this.childNodes=[],this.parentNode=null,this.ownerDocument=r||null}a.prototype.type="DocumentFragment",a.prototype.nodeType=11,a.prototype.nodeName="#document-fragment",a.prototype.appendChild=i.prototype.appendChild,a.prototype.replaceChild=i.prototype.replaceChild,a.prototype.removeChild=i.prototype.removeChild,a.prototype.toString=function(){return this.childNodes.map(function(r){return String(r)}).join("")}}),SE=Je(function(t,e){e.exports=i;function i(a){}i.prototype.initEvent=function(a,r,n){this.type=a,this.bubbles=r,this.cancelable=n},i.prototype.preventDefault=function(){}}),IE=Je(function(t,e){wa();var i=Jm(),a=TE(),r=AE(),n=ap(),s=wE(),o=SE(),l=ep(),c=tp(),p=ip();e.exports=m;function m(){if(!ka(this,m))return new m;this.head=this.createElement("head"),this.body=this.createElement("body"),this.documentElement=this.createElement("html"),this.documentElement.appendChild(this.head),this.documentElement.appendChild(this.body),this.childNodes=[this.documentElement],this.nodeType=9}var u=m.prototype;u.createTextNode=function(d){return new r(d,this)},u.createElementNS=function(d,v){var f=d===null?null:String(d);return new n(v,this,f)},u.createElement=function(d){return new n(d,this)},u.createDocumentFragment=function(){return new s(this)},u.createEvent=function(d){return new o(d)},u.createComment=function(d){return new a(d,this)},u.getElementById=function(d){d=String(d);var v=i(this.childNodes,function(f){if(String(f.id)===d)return f});return v||null},u.getElementsByClassName=n.prototype.getElementsByClassName,u.getElementsByTagName=n.prototype.getElementsByTagName,u.contains=n.prototype.contains,u.removeEventListener=p,u.addEventListener=c,u.dispatchEvent=l}),RE=Je(function(t,e){var i=IE();e.exports=new i}),rp=Je(function(t,e){var i=typeof global<"u"?global:typeof window<"u"?window:{},a=RE(),r;typeof document<"u"?r=document:(r=i["__GLOBAL_DOCUMENT_CACHE@4"],r||(r=i["__GLOBAL_DOCUMENT_CACHE@4"]=a)),e.exports=r});function LE(t){if(Array.isArray(t))return t}function CE(t,e){var i=t==null?null:typeof Symbol<"u"&&t[Symbol.iterator]||t["@@iterator"];if(i!=null){var a=[],r=!0,n=!1,s,o;try{for(i=i.call(t);!(r=(s=i.next()).done)&&(a.push(s.value),!(e&&a.length===e));r=!0);}catch(l){n=!0,o=l}finally{try{!r&&i.return!=null&&i.return()}finally{if(n)throw o}}return a}}function DE(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function rd(t,e){(e==null||e>t.length)&&(e=t.length);for(var i=0,a=new Array(e);i<e;i++)a[i]=t[i];return a}function np(t,e){if(t){if(typeof t=="string")return rd(t,e);var i=Object.prototype.toString.call(t).slice(8,-1);if(i==="Object"&&t.constructor&&(i=t.constructor.name),i==="Map"||i==="Set")return Array.from(i);if(i==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i))return rd(t,e)}}function yi(t,e){return LE(t)||CE(t,e)||np(t,e)||DE()}var bn=_t(si()),ph=_t(si()),ME=_t(si()),xE={now:function(){var t=ME.default.performance,e=t&&t.timing,i=e&&e.navigationStart,a=typeof i=="number"&&typeof t.now=="function"?i+t.now():Date.now();return Math.round(a)}},Oe=xE,On=function(){var t,e,i;if(typeof((t=ph.default.crypto)===null||t===void 0?void 0:t.getRandomValues)=="function"){i=new Uint8Array(32),ph.default.crypto.getRandomValues(i);for(var a=0;a<32;a++)i[a]=i[a]%16}else{i=[];for(var r=0;r<32;r++)i[r]=Math.random()*16|0}var n=0;e="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(l){var c=l==="x"?i[n]:i[n]&3|8;return n++,c.toString(16)});var s=Oe.now(),o=s==null?void 0:s.toString(16).substring(3);return o?e.substring(0,28)+o:e},sp=function(){return("000000"+(Math.random()*Math.pow(36,6)<<0).toString(36)).slice(-6)},kt=function(t){if(t&&typeof t.nodeName<"u")return t.muxId||(t.muxId=sp()),t.muxId;var e;try{e=document.querySelector(t)}catch{}return e&&!e.muxId&&(e.muxId=t),(e==null?void 0:e.muxId)||t},Mo=function(t){var e;t&&typeof t.nodeName<"u"?(e=t,t=kt(e)):e=document.querySelector(t);var i=e&&e.nodeName?e.nodeName.toLowerCase():"";return[e,t,i]};function OE(t){if(Array.isArray(t))return rd(t)}function NE(t){if(typeof Symbol<"u"&&t[Symbol.iterator]!=null||t["@@iterator"]!=null)return Array.from(t)}function PE(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function wt(t){return OE(t)||NE(t)||np(t)||PE()}var ua={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4},$E=function(t){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:3,i,a,r,n,s,o=[console,t],l=(i=console.trace).bind.apply(i,wt(o)),c=(a=console.info).bind.apply(a,wt(o)),p=(r=console.debug).bind.apply(r,wt(o)),m=(n=console.warn).bind.apply(n,wt(o)),u=(s=console.error).bind.apply(s,wt(o)),d=e;return{trace:function(){for(var v=arguments.length,f=new Array(v),b=0;b<v;b++)f[b]=arguments[b];if(!(d>ua.TRACE))return l.apply(void 0,wt(f))},debug:function(){for(var v=arguments.length,f=new Array(v),b=0;b<v;b++)f[b]=arguments[b];if(!(d>ua.DEBUG))return p.apply(void 0,wt(f))},info:function(){for(var v=arguments.length,f=new Array(v),b=0;b<v;b++)f[b]=arguments[b];if(!(d>ua.INFO))return c.apply(void 0,wt(f))},warn:function(){for(var v=arguments.length,f=new Array(v),b=0;b<v;b++)f[b]=arguments[b];if(!(d>ua.WARN))return m.apply(void 0,wt(f))},error:function(){for(var v=arguments.length,f=new Array(v),b=0;b<v;b++)f[b]=arguments[b];if(!(d>ua.ERROR))return u.apply(void 0,wt(f))},get level(){return d},set level(v){v!==this.level&&(d=v??e)}}},re=$E("[mux]"),Nl=_t(si());function nd(){var t=Nl.default.doNotTrack||Nl.default.navigator&&Nl.default.navigator.doNotTrack;return t==="1"}function $(t){if(t===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}wa();function _e(t,e){if(!ka(t,e))throw new TypeError("Cannot call a class as a function")}function vh(t,e){for(var i=0;i<e.length;i++){var a=e[i];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(t,a.key,a)}}function bt(t,e,i){return e&&vh(t.prototype,e),i&&vh(t,i),t}function I(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}function yr(t){return yr=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)},yr(t)}function UE(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&(t=yr(t),t!==null););return t}function gs(t,e,i){return typeof Reflect<"u"&&Reflect.get?gs=Reflect.get:gs=function(a,r,n){var s=UE(a,r);if(s){var o=Object.getOwnPropertyDescriptor(s,r);return o.get?o.get.call(n||a):o.value}},gs(t,e,i||t)}function sd(t,e){return sd=Object.setPrototypeOf||function(i,a){return i.__proto__=a,i},sd(t,e)}function HE(t,e){if(typeof e!="function"&&e!==null)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&sd(t,e)}function BE(t,e){if(t==null)return{};var i={},a=Object.keys(t),r,n;for(n=0;n<a.length;n++)r=a[n],!(e.indexOf(r)>=0)&&(i[r]=t[r]);return i}function WE(t,e){if(t==null)return{};var i=BE(t,e),a,r;if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);for(r=0;r<n.length;r++)a=n[r],!(e.indexOf(a)>=0)&&Object.prototype.propertyIsEnumerable.call(t,a)&&(i[a]=t[a])}return i}function FE(){if(typeof Reflect>"u"||!Reflect.construct||Reflect.construct.sham)return!1;if(typeof Proxy=="function")return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),!0}catch{return!1}}Xm();function KE(t,e){return e&&(Zm(e)==="object"||typeof e=="function")?e:$(t)}function VE(t){var e=FE();return function(){var i=yr(t),a;if(e){var r=yr(this).constructor;a=Reflect.construct(i,arguments,r)}else a=i.apply(this,arguments);return KE(this,a)}}var xt=function(t){return Nn(t)[0]},Nn=function(t){if(typeof t!="string"||t==="")return["localhost"];var e=/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/,i=t.match(e)||[],a=i[4],r;return a&&(r=(a.match(/[^\.]+\.[^\.]+$/)||[])[0]),[a,r]},Pl=_t(si()),qE={exists:function(){var t=Pl.default.performance,e=t&&t.timing;return e!==void 0},domContentLoadedEventEnd:function(){var t=Pl.default.performance,e=t&&t.timing;return e&&e.domContentLoadedEventEnd},navigationStart:function(){var t=Pl.default.performance,e=t&&t.timing;return e&&e.navigationStart}},xo=qE;function Le(t,e,i){i=i===void 0?1:i,t[e]=t[e]||0,t[e]+=i}function Pn(t){for(var e=1;e<arguments.length;e++){var i=arguments[e]!=null?arguments[e]:{},a=Object.keys(i);typeof Object.getOwnPropertySymbols=="function"&&(a=a.concat(Object.getOwnPropertySymbols(i).filter(function(r){return Object.getOwnPropertyDescriptor(i,r).enumerable}))),a.forEach(function(r){I(t,r,i[r])})}return t}function YE(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);i.push.apply(i,a)}return i}function Su(t,e){return e=e??{},Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):YE(Object(e)).forEach(function(i){Object.defineProperty(t,i,Object.getOwnPropertyDescriptor(e,i))}),t}var GE=["x-cdn","content-type"],op=["x-request-id","cf-ray","x-amz-cf-id","x-akamai-request-id"],zE=GE.concat(op);function Iu(t){t=t||"";var e={},i=t.trim().split(/[\r\n]+/);return i.forEach(function(a){if(a){var r=a.split(": "),n=r.shift();n&&(zE.indexOf(n.toLowerCase())>=0||n.toLowerCase().indexOf("x-litix-")===0)&&(e[n]=r.join(": "))}}),e}function Oo(t){if(t){var e=op.find(function(i){return t[i]!==void 0});return e?t[e]:void 0}}var QE=function(t){var e={};for(var i in t){var a=t[i],r=a["DATA-ID"].search("io.litix.data.");if(r!==-1){var n=a["DATA-ID"].replace("io.litix.data.","");e[n]=a.VALUE}}return e},lp=QE,ts=function(t){if(!t)return{};var e=xo.navigationStart(),i=t.loading,a=i?i.start:t.trequest,r=i?i.first:t.tfirst,n=i?i.end:t.tload;return{bytesLoaded:t.total,requestStart:Math.round(e+a),responseStart:Math.round(e+r),responseEnd:Math.round(e+n)}},Or=function(t){if(!(!t||typeof t.getAllResponseHeaders!="function"))return Iu(t.getAllResponseHeaders())},jE=function(t,e,i){var a=arguments.length>4?arguments[4]:void 0,r=t.log,n=t.utils.secondsToMs,s=function(b){var E=parseInt(a.version),T;return E===1&&b.programDateTime!==null&&(T=b.programDateTime),E===0&&b.pdt!==null&&(T=b.pdt),T};if(!xo.exists()){r.warn("performance timing not supported. Not tracking HLS.js.");return}var o=function(b,E){return t.emit(e,b,E)},l=function(b,E){var T=E.levels,_=E.audioTracks,w=E.url,R=E.stats,x=E.networkDetails,U=E.sessionData,K={},Q={};T.forEach(function(be,Ke){K[Ke]={width:be.width,height:be.height,bitrate:be.bitrate,attrs:be.attrs}}),_.forEach(function(be,Ke){Q[Ke]={name:be.name,language:be.lang,bitrate:be.bitrate}});var W=ts(R),H=W.bytesLoaded,He=W.requestStart,et=W.responseStart,tt=W.responseEnd;o("requestcompleted",Su(Pn({},lp(U)),{request_event_type:b,request_bytes_loaded:H,request_start:He,request_response_start:et,request_response_end:tt,request_type:"manifest",request_hostname:xt(w),request_response_headers:Or(x),request_rendition_lists:{media:K,audio:Q,video:{}}}))};i.on(a.Events.MANIFEST_LOADED,l);var c=function(b,E){var T=E.details,_=E.level,w=E.networkDetails,R=E.stats,x=ts(R),U=x.bytesLoaded,K=x.requestStart,Q=x.responseStart,W=x.responseEnd,H=T.fragments[T.fragments.length-1],He=s(H)+n(H.duration);o("requestcompleted",{request_event_type:b,request_bytes_loaded:U,request_start:K,request_response_start:Q,request_response_end:W,request_current_level:_,request_type:"manifest",request_hostname:xt(T.url),request_response_headers:Or(w),video_holdback:T.holdBack&&n(T.holdBack),video_part_holdback:T.partHoldBack&&n(T.partHoldBack),video_part_target_duration:T.partTarget&&n(T.partTarget),video_target_duration:T.targetduration&&n(T.targetduration),video_source_is_live:T.live,player_manifest_newest_program_time:isNaN(He)?void 0:He})};i.on(a.Events.LEVEL_LOADED,c);var p=function(b,E){var T=E.details,_=E.networkDetails,w=E.stats,R=ts(w),x=R.bytesLoaded,U=R.requestStart,K=R.responseStart,Q=R.responseEnd;o("requestcompleted",{request_event_type:b,request_bytes_loaded:x,request_start:U,request_response_start:K,request_response_end:Q,request_type:"manifest",request_hostname:xt(T.url),request_response_headers:Or(_)})};i.on(a.Events.AUDIO_TRACK_LOADED,p);var m=function(b,E){var T=E.stats,_=E.networkDetails,w=E.frag;T=T||w.stats;var R=ts(T),x=R.bytesLoaded,U=R.requestStart,K=R.responseStart,Q=R.responseEnd,W=_?Or(_):void 0,H={request_event_type:b,request_bytes_loaded:x,request_start:U,request_response_start:K,request_response_end:Q,request_hostname:_?xt(_.responseURL):void 0,request_id:W?Oo(W):void 0,request_response_headers:W,request_media_duration:w.duration,request_url:_==null?void 0:_.responseURL};w.type==="main"?(H.request_type="media",H.request_current_level=w.level,H.request_video_width=(i.levels[w.level]||{}).width,H.request_video_height=(i.levels[w.level]||{}).height,H.request_labeled_bitrate=(i.levels[w.level]||{}).bitrate):H.request_type=w.type,o("requestcompleted",H)};i.on(a.Events.FRAG_LOADED,m);var u=function(b,E){var T=E.frag,_=T.start,w=s(T),R={currentFragmentPDT:w,currentFragmentStart:n(_)};o("fragmentchange",R)};i.on(a.Events.FRAG_CHANGED,u);var d=function(b,E){var T=E.type,_=E.details,w=E.response,R=E.fatal,x=E.frag,U=E.networkDetails,K=(x==null?void 0:x.url)||E.url||"",Q=U?Or(U):void 0;if((_===a.ErrorDetails.MANIFEST_LOAD_ERROR||_===a.ErrorDetails.MANIFEST_LOAD_TIMEOUT||_===a.ErrorDetails.FRAG_LOAD_ERROR||_===a.ErrorDetails.FRAG_LOAD_TIMEOUT||_===a.ErrorDetails.LEVEL_LOAD_ERROR||_===a.ErrorDetails.LEVEL_LOAD_TIMEOUT||_===a.ErrorDetails.AUDIO_TRACK_LOAD_ERROR||_===a.ErrorDetails.AUDIO_TRACK_LOAD_TIMEOUT||_===a.ErrorDetails.SUBTITLE_LOAD_ERROR||_===a.ErrorDetails.SUBTITLE_LOAD_TIMEOUT||_===a.ErrorDetails.KEY_LOAD_ERROR||_===a.ErrorDetails.KEY_LOAD_TIMEOUT)&&o("requestfailed",{request_error:_,request_url:K,request_hostname:xt(K),request_id:Q?Oo(Q):void 0,request_type:_===a.ErrorDetails.FRAG_LOAD_ERROR||_===a.ErrorDetails.FRAG_LOAD_TIMEOUT?"media":_===a.ErrorDetails.AUDIO_TRACK_LOAD_ERROR||_===a.ErrorDetails.AUDIO_TRACK_LOAD_TIMEOUT?"audio":_===a.ErrorDetails.SUBTITLE_LOAD_ERROR||_===a.ErrorDetails.SUBTITLE_LOAD_TIMEOUT?"subtitle":_===a.ErrorDetails.KEY_LOAD_ERROR||_===a.ErrorDetails.KEY_LOAD_TIMEOUT?"encryption":"manifest",request_error_code:w==null?void 0:w.code,request_error_text:w==null?void 0:w.text}),R){var W,H="".concat(K?"url: ".concat(K,`
`):"")+"".concat(w&&(w.code||w.text)?"response: ".concat(w.code,", ").concat(w.text,`
`):"")+"".concat(E.reason?"failure reason: ".concat(E.reason,`
`):"")+"".concat(E.level?"level: ".concat(E.level,`
`):"")+"".concat(E.parent?"parent stream controller: ".concat(E.parent,`
`):"")+"".concat(E.buffer?"buffer length: ".concat(E.buffer,`
`):"")+"".concat(E.error?"error: ".concat(E.error,`
`):"")+"".concat(E.event?"event: ".concat(E.event,`
`):"")+"".concat(E.err?"error message: ".concat((W=E.err)===null||W===void 0?void 0:W.message,`
`):"");o("error",{player_error_code:T,player_error_message:_,player_error_context:H})}};i.on(a.Events.ERROR,d);var v=function(b,E){var T=E.frag,_=T&&T._url||"";o("requestcanceled",{request_event_type:b,request_url:_,request_type:"media",request_hostname:xt(_)})};i.on(a.Events.FRAG_LOAD_EMERGENCY_ABORTED,v);var f=function(b,E){var T=E.level,_=i.levels[T];if(_&&_.attrs&&_.attrs.BANDWIDTH){var w=_.attrs.BANDWIDTH,R,x=parseFloat(_.attrs["FRAME-RATE"]);isNaN(x)||(R=x),w?o("renditionchange",{video_source_fps:R,video_source_bitrate:w,video_source_width:_.width,video_source_height:_.height,video_source_rendition_name:_.name,video_source_codec:_==null?void 0:_.videoCodec}):r.warn("missing BANDWIDTH from HLS manifest parsed by HLS.js")}};i.on(a.Events.LEVEL_SWITCHED,f),i._stopMuxMonitor=function(){i.off(a.Events.MANIFEST_LOADED,l),i.off(a.Events.LEVEL_LOADED,c),i.off(a.Events.AUDIO_TRACK_LOADED,p),i.off(a.Events.FRAG_LOADED,m),i.off(a.Events.FRAG_CHANGED,u),i.off(a.Events.ERROR,d),i.off(a.Events.FRAG_LOAD_EMERGENCY_ABORTED,v),i.off(a.Events.LEVEL_SWITCHED,f),i.off(a.Events.DESTROYING,i._stopMuxMonitor),delete i._stopMuxMonitor},i.on(a.Events.DESTROYING,i._stopMuxMonitor)},ZE=function(t){t&&typeof t._stopMuxMonitor=="function"&&t._stopMuxMonitor()},fh=function(t,e){if(!t||!t.requestEndDate)return{};var i=xt(t.url),a=t.url,r=t.bytesLoaded,n=new Date(t.requestStartDate).getTime(),s=new Date(t.firstByteDate).getTime(),o=new Date(t.requestEndDate).getTime(),l=isNaN(t.duration)?0:t.duration,c=typeof e.getMetricsFor=="function"?e.getMetricsFor(t.mediaType).HttpList:e.getDashMetrics().getHttpRequests(t.mediaType),p;c.length>0&&(p=Iu(c[c.length-1]._responseHeaders||""));var m=p?Oo(p):void 0;return{requestStart:n,requestResponseStart:s,requestResponseEnd:o,requestBytesLoaded:r,requestResponseHeaders:p,requestMediaDuration:l,requestHostname:i,requestUrl:a,requestId:m}},XE=function(t,e){if(typeof e.getCurrentRepresentationForType=="function"){var i=e.getCurrentRepresentationForType(t);return i?{currentLevel:i.absoluteIndex,renditionWidth:i.width||null,renditionHeight:i.height||null,renditionBitrate:i.bandwidth}:{}}var a=e.getQualityFor(t),r=e.getCurrentTrackFor(t).bitrateList;return r?{currentLevel:a,renditionWidth:r[a].width||null,renditionHeight:r[a].height||null,renditionBitrate:r[a].bandwidth}:{}},JE=function(t){var e;return(e=t.match(/.*codecs\*?="(.*)"/))===null||e===void 0?void 0:e[1]},e_=function(t){try{var e,i,a=(i=t.getVersion)===null||i===void 0||(e=i.call(t))===null||e===void 0?void 0:e.split(".").map(function(r){return parseInt(r)})[0];return a}catch{return!1}},t_=function(t,e,i){var a=t.log;if(!i||!i.on){a.warn("Invalid dash.js player reference. Monitoring blocked.");return}var r=e_(i),n=function(T,_){return t.emit(e,T,_)},s=function(T){var _=T.type,w=T.data,R=(w||{}).url;n("requestcompleted",{request_event_type:_,request_start:0,request_response_start:0,request_response_end:0,request_bytes_loaded:-1,request_type:"manifest",request_hostname:xt(R),request_url:R})};i.on("manifestLoaded",s);var o={},l=function(T){if(typeof T.getRequests!="function")return null;var _=T.getRequests({state:"executed"});return _.length===0?null:_[_.length-1]},c=function(T){var _=T.type,w=T.fragmentModel,R=T.chunk,x=l(w);p({type:_,request:x,chunk:R})},p=function(T){var _=T.type,w=T.chunk,R=T.request,x=(w||{}).mediaInfo,U=x||{},K=U.type,Q=U.bitrateList;Q=Q||[];var W={};Q.forEach(function(it,Ce){W[Ce]={},W[Ce].width=it.width,W[Ce].height=it.height,W[Ce].bitrate=it.bandwidth,W[Ce].attrs={}}),K==="video"?o.video=W:K==="audio"?o.audio=W:o.media=W;var H=fh(R,i),He=H.requestStart,et=H.requestResponseStart,tt=H.requestResponseEnd,be=H.requestResponseHeaders,Ke=H.requestMediaDuration,$t=H.requestHostname,Ve=H.requestUrl,yt=H.requestId;n("requestcompleted",{request_event_type:_,request_start:He,request_response_start:et,request_response_end:tt,request_bytes_loaded:-1,request_type:K+"_init",request_response_headers:be,request_hostname:$t,request_id:yt,request_url:Ve,request_media_duration:Ke,request_rendition_lists:o})};r>=4?i.on("initFragmentLoaded",p):i.on("initFragmentLoaded",c);var m=function(T){var _=T.type,w=T.fragmentModel,R=T.chunk,x=l(w);u({type:_,request:x,chunk:R})},u=function(T){var _=T.type,w=T.chunk,R=T.request,x=w||{},U=x.mediaInfo,K=x.start,Q=U||{},W=Q.type,H=fh(R,i),He=H.requestStart,et=H.requestResponseStart,tt=H.requestResponseEnd,be=H.requestBytesLoaded,Ke=H.requestResponseHeaders,$t=H.requestMediaDuration,Ve=H.requestHostname,yt=H.requestUrl,it=H.requestId,Ce=XE(W,i),Be=Ce.currentLevel,qe=Ce.renditionWidth,Sa=Ce.renditionHeight,Zn=Ce.renditionBitrate;n("requestcompleted",{request_event_type:_,request_start:He,request_response_start:et,request_response_end:tt,request_bytes_loaded:be,request_type:W,request_response_headers:Ke,request_hostname:Ve,request_id:it,request_url:yt,request_media_start_time:K,request_media_duration:$t,request_current_level:Be,request_labeled_bitrate:Zn,request_video_width:qe,request_video_height:Sa})};r>=4?i.on("mediaFragmentLoaded",u):i.on("mediaFragmentLoaded",m);var d={video:void 0,audio:void 0,totalBitrate:void 0},v=function(){if(d.video&&typeof d.video.bitrate=="number"){if(!(d.video.width&&d.video.height)){a.warn("have bitrate info for video but missing width/height");return}var T=d.video.bitrate;if(d.audio&&typeof d.audio.bitrate=="number"&&(T+=d.audio.bitrate),T!==d.totalBitrate)return d.totalBitrate=T,{video_source_bitrate:T,video_source_height:d.video.height,video_source_width:d.video.width,video_source_codec:JE(d.video.codec)}}},f=function(T,_,w){var R=T.mediaType;if(R==="audio"||R==="video"){var x;if(typeof i.getRepresentationsByType=="function")if(T.newRepresentation)x={bitrate:T.newRepresentation.bandwidth,width:T.newRepresentation.width,height:T.newRepresentation.height,qualityIndex:T.newRepresentation.absoluteIndex};else{var U=i.getRepresentationsByType(R);if(U&&typeof T.newQuality=="number"){var K=U.find(function(W){return W.absoluteIndex===T.newQuality||W.index===T.newQuality});K&&(x={bitrate:K.bandwidth,width:K.width,height:K.height,qualityIndex:T.newQuality})}}else{if(typeof T.newQuality!="number"){a.warn("missing evt.newQuality in qualityChangeRendered event",T);return}x=i.getBitrateInfoListFor(R).find(function(W){var H=W.qualityIndex;return H===T.newQuality})}if(!(x&&typeof x.bitrate=="number")){a.warn("missing bitrate info for ".concat(R));return}d[R]=Su(Pn({},x),{codec:i.getCurrentTrackFor(R).codec});var Q=v();Q&&n("renditionchange",Q)}};i.on("qualityChangeRendered",f);var b=function(T){var _=T.request,w=T.mediaType;_=_||{},n("requestcanceled",{request_event_type:_.type+"_"+_.action,request_url:_.url,request_type:w,request_hostname:xt(_.url)})};i.on("fragmentLoadingAbandoned",b);var E=function(T){var _=T.error,w,R,x=(_==null||(w=_.data)===null||w===void 0?void 0:w.request)||{},U=(_==null||(R=_.data)===null||R===void 0?void 0:R.response)||{};(_==null?void 0:_.code)===27&&n("requestfailed",{request_error:x.type+"_"+x.action,request_url:x.url,request_hostname:xt(x.url),request_type:x.mediaType,request_error_code:U.status,request_error_text:U.statusText});var K="".concat(x!=null&&x.url?"url: ".concat(x.url,`
`):"")+"".concat(U!=null&&U.status||U!=null&&U.statusText?"response: ".concat(U==null?void 0:U.status,", ").concat(U==null?void 0:U.statusText,`
`):"");n("error",{player_error_code:_==null?void 0:_.code,player_error_message:_==null?void 0:_.message,player_error_context:K})};i.on("error",E),i._stopMuxMonitor=function(){i.off("manifestLoaded",s),i.off("initFragmentLoaded",p),i.off("mediaFragmentLoaded",u),i.off("qualityChangeRendered",f),i.off("error",E),i.off("fragmentLoadingAbandoned",b),delete i._stopMuxMonitor}},i_=function(t){t&&typeof t._stopMuxMonitor=="function"&&t._stopMuxMonitor()},Eh=0,a_=(function(){function t(){_e(this,t),I(this,"_listeners",void 0)}return bt(t,[{key:"on",value:function(e,i,a){return i._eventEmitterGuid=i._eventEmitterGuid||++Eh,this._listeners=this._listeners||{},this._listeners[e]=this._listeners[e]||[],a&&(i=i.bind(a)),this._listeners[e].push(i),i}},{key:"off",value:function(e,i){var a=this._listeners&&this._listeners[e];a&&a.forEach(function(r,n){r._eventEmitterGuid===i._eventEmitterGuid&&a.splice(n,1)})}},{key:"one",value:function(e,i,a){var r=this;i._eventEmitterGuid=i._eventEmitterGuid||++Eh;var n=function(){r.off(e,n),i.apply(a||this,arguments)};n._eventEmitterGuid=i._eventEmitterGuid,this.on(e,n)}},{key:"emit",value:function(e,i){var a=this;if(this._listeners){i=i||{};var r=this._listeners["before"+e]||[],n=this._listeners["before*"]||[],s=this._listeners[e]||[],o=this._listeners["after"+e]||[],l=function(c,p){c=c.slice(),c.forEach(function(m){m.call(a,{type:e},p)})};l(r,i),l(n,i),l(s,i),l(o,i)}}}]),t})(),r_=a_,$l=_t(si()),n_=(function(){function t(e){var i=this;_e(this,t),I(this,"_playbackHeartbeatInterval",void 0),I(this,"_playheadShouldBeProgressing",void 0),I(this,"pm",void 0),this.pm=e,this._playbackHeartbeatInterval=null,this._playheadShouldBeProgressing=!1,e.on("playing",function(){i._playheadShouldBeProgressing=!0}),e.on("play",this._startPlaybackHeartbeatInterval.bind(this)),e.on("playing",this._startPlaybackHeartbeatInterval.bind(this)),e.on("adbreakstart",this._startPlaybackHeartbeatInterval.bind(this)),e.on("adplay",this._startPlaybackHeartbeatInterval.bind(this)),e.on("adplaying",this._startPlaybackHeartbeatInterval.bind(this)),e.on("devicewake",this._startPlaybackHeartbeatInterval.bind(this)),e.on("viewstart",this._startPlaybackHeartbeatInterval.bind(this)),e.on("rebufferstart",this._startPlaybackHeartbeatInterval.bind(this)),e.on("pause",this._stopPlaybackHeartbeatInterval.bind(this)),e.on("ended",this._stopPlaybackHeartbeatInterval.bind(this)),e.on("viewend",this._stopPlaybackHeartbeatInterval.bind(this)),e.on("error",this._stopPlaybackHeartbeatInterval.bind(this)),e.on("aderror",this._stopPlaybackHeartbeatInterval.bind(this)),e.on("adpause",this._stopPlaybackHeartbeatInterval.bind(this)),e.on("adended",this._stopPlaybackHeartbeatInterval.bind(this)),e.on("adbreakend",this._stopPlaybackHeartbeatInterval.bind(this)),e.on("seeked",function(){e.data.player_is_paused?i._stopPlaybackHeartbeatInterval():i._startPlaybackHeartbeatInterval()}),e.on("timeupdate",function(){i._playbackHeartbeatInterval!==null&&e.emit("playbackheartbeat")}),e.on("devicesleep",function(a,r){i._playbackHeartbeatInterval!==null&&($l.default.clearInterval(i._playbackHeartbeatInterval),e.emit("playbackheartbeatend",{viewer_time:r.viewer_time}),i._playbackHeartbeatInterval=null)})}return bt(t,[{key:"_startPlaybackHeartbeatInterval",value:function(){var e=this;this._playbackHeartbeatInterval===null&&(this.pm.emit("playbackheartbeat"),this._playbackHeartbeatInterval=$l.default.setInterval(function(){e.pm.emit("playbackheartbeat")},this.pm.playbackHeartbeatTime))}},{key:"_stopPlaybackHeartbeatInterval",value:function(){this._playheadShouldBeProgressing=!1,this._playbackHeartbeatInterval!==null&&($l.default.clearInterval(this._playbackHeartbeatInterval),this.pm.emit("playbackheartbeatend"),this._playbackHeartbeatInterval=null)}}]),t})(),s_=n_,o_=function t(e){var i=this;_e(this,t),I(this,"viewErrored",void 0),e.on("viewinit",function(){i.viewErrored=!1}),e.on("error",function(a,r){try{var n=e.errorTranslator({player_error_code:r.player_error_code,player_error_message:r.player_error_message,player_error_context:r.player_error_context,player_error_severity:r.player_error_severity,player_error_business_exception:r.player_error_business_exception});n&&(e.data.player_error_code=n.player_error_code||r.player_error_code,e.data.player_error_message=n.player_error_message||r.player_error_message,e.data.player_error_context=n.player_error_context||r.player_error_context,e.data.player_error_severity=n.player_error_severity||r.player_error_severity,e.data.player_error_business_exception=n.player_error_business_exception||r.player_error_business_exception,i.viewErrored=!0)}catch(s){e.mux.log.warn("Exception in error translator callback.",s),i.viewErrored=!0}}),e.on("aftererror",function(){var a,r,n,s,o;(a=e.data)===null||a===void 0||delete a.player_error_code,(r=e.data)===null||r===void 0||delete r.player_error_message,(n=e.data)===null||n===void 0||delete n.player_error_context,(s=e.data)===null||s===void 0||delete s.player_error_severity,(o=e.data)===null||o===void 0||delete o.player_error_business_exception})},l_=o_,d_=(function(){function t(e){_e(this,t),I(this,"_watchTimeTrackerLastCheckedTime",void 0),I(this,"pm",void 0),this.pm=e,this._watchTimeTrackerLastCheckedTime=null,e.on("playbackheartbeat",this._updateWatchTime.bind(this)),e.on("playbackheartbeatend",this._clearWatchTimeState.bind(this))}return bt(t,[{key:"_updateWatchTime",value:function(e,i){var a=i.viewer_time;this._watchTimeTrackerLastCheckedTime===null&&(this._watchTimeTrackerLastCheckedTime=a),Le(this.pm.data,"view_watch_time",a-this._watchTimeTrackerLastCheckedTime),this._watchTimeTrackerLastCheckedTime=a}},{key:"_clearWatchTimeState",value:function(e,i){this._updateWatchTime(e,i),this._watchTimeTrackerLastCheckedTime=null}}]),t})(),u_=d_,c_=(function(){function t(e){var i=this;_e(this,t),I(this,"_playbackTimeTrackerLastPlayheadPosition",void 0),I(this,"_lastTime",void 0),I(this,"_isAdPlaying",void 0),I(this,"_callbackUpdatePlaybackTime",void 0),I(this,"pm",void 0),this.pm=e,this._playbackTimeTrackerLastPlayheadPosition=-1,this._lastTime=Oe.now(),this._isAdPlaying=!1,this._callbackUpdatePlaybackTime=null,e.on("viewinit",function(){i.pm.data.view_playing_time_ms_cumulative=0});var a=this._startPlaybackTimeTracking.bind(this);e.on("playing",a),e.on("adplaying",a);var r=function(){i.pm.data.player_is_paused||a()};e.on("seeked",r),e.on("rebufferend",r);var n=this._stopPlaybackTimeTracking.bind(this);e.on("playbackheartbeatend",n),e.on("seeking",n),e.on("rebufferstart",n),e.on("adplaying",function(){i._isAdPlaying=!0}),e.on("adended",function(){i._isAdPlaying=!1}),e.on("adpause",function(){i._isAdPlaying=!1}),e.on("adbreakstart",function(){i._isAdPlaying=!1}),e.on("adbreakend",function(){i._isAdPlaying=!1}),e.on("adplay",function(){i._isAdPlaying=!1}),e.on("viewinit",function(){i._playbackTimeTrackerLastPlayheadPosition=-1,i._lastTime=Oe.now(),i._isAdPlaying=!1,i._callbackUpdatePlaybackTime=null})}return bt(t,[{key:"_startPlaybackTimeTracking",value:function(){this._callbackUpdatePlaybackTime===null&&(this._callbackUpdatePlaybackTime=this._updatePlaybackTime.bind(this),this._playbackTimeTrackerLastPlayheadPosition=this.pm.data.player_playhead_time,this._lastTime=Oe.now(),this.pm.on("playbackheartbeat",this._callbackUpdatePlaybackTime))}},{key:"_stopPlaybackTimeTracking",value:function(){this._callbackUpdatePlaybackTime&&(this._updatePlaybackTime(),this.pm.off("playbackheartbeat",this._callbackUpdatePlaybackTime),this._callbackUpdatePlaybackTime=null,this._playbackTimeTrackerLastPlayheadPosition=-1)}},{key:"_updatePlaybackTime",value:function(){var e=this.pm.data.player_playhead_time||0,i=Oe.now(),a=i-this._lastTime,r=-1;this._playbackTimeTrackerLastPlayheadPosition>=0&&e>this._playbackTimeTrackerLastPlayheadPosition?r=e-this._playbackTimeTrackerLastPlayheadPosition:this._isAdPlaying&&(r=a),r>0&&r<=1e3&&Le(this.pm.data,"view_content_playback_time",r),this._callbackUpdatePlaybackTime!==null&&a>0&&a<=1e3&&(this._isAdPlaying&&Le(this.pm.data,"ad_playing_time_ms_cumulative",a),Le(this.pm.data,"view_playing_time_ms_cumulative",a)),this._playbackTimeTrackerLastPlayheadPosition=e,this._lastTime=i}}]),t})(),h_=c_,m_=(function(){function t(e){_e(this,t),I(this,"pm",void 0),this.pm=e;var i=this._updatePlayheadTime.bind(this);e.on("playbackheartbeat",i),e.on("playbackheartbeatend",i),e.on("timeupdate",i),e.on("destroy",function(){e.off("timeupdate",i)})}return bt(t,[{key:"_updateMaxPlayheadPosition",value:function(){this.pm.data.view_max_playhead_position=typeof this.pm.data.view_max_playhead_position>"u"?this.pm.data.player_playhead_time:Math.max(this.pm.data.view_max_playhead_position,this.pm.data.player_playhead_time)}},{key:"_updatePlayheadTime",value:function(e,i){var a=this,r=function(){a.pm.currentFragmentPDT&&a.pm.currentFragmentStart&&(a.pm.data.player_program_time=a.pm.currentFragmentPDT+a.pm.data.player_playhead_time-a.pm.currentFragmentStart)};if(i&&i.player_playhead_time)this.pm.data.player_playhead_time=i.player_playhead_time,r(),this._updateMaxPlayheadPosition();else if(this.pm.getPlayheadTime){var n=this.pm.getPlayheadTime();typeof n<"u"&&(this.pm.data.player_playhead_time=n,r(),this._updateMaxPlayheadPosition())}}}]),t})(),p_=m_,_h=300*1e3,v_=function t(e){if(_e(this,t),!e.disableRebufferTracking){var i,a=function(n,s){r(s),i=void 0},r=function(n){if(i){var s=n.viewer_time-i;Le(e.data,"view_rebuffer_duration",s),i=n.viewer_time,e.data.view_rebuffer_duration>_h&&(e.emit("viewend"),e.send("viewend"),e.mux.log.warn("Ending view after rebuffering for longer than ".concat(_h,"ms, future events will be ignored unless a programchange or videochange occurs.")))}e.data.view_watch_time>=0&&e.data.view_rebuffer_count>0&&(e.data.view_rebuffer_frequency=e.data.view_rebuffer_count/e.data.view_watch_time,e.data.view_rebuffer_percentage=e.data.view_rebuffer_duration/e.data.view_watch_time)};e.on("playbackheartbeat",function(n,s){return r(s)}),e.on("rebufferstart",function(n,s){i||(Le(e.data,"view_rebuffer_count",1),i=s.viewer_time,e.one("rebufferend",a))}),e.on("viewinit",function(){i=void 0,e.off("rebufferend",a)})}},f_=v_,E_=(function(){function t(e){var i=this;_e(this,t),I(this,"_lastCheckedTime",void 0),I(this,"_lastPlayheadTime",void 0),I(this,"_lastPlayheadTimeUpdatedTime",void 0),I(this,"_rebuffering",void 0),I(this,"pm",void 0),this.pm=e,!(e.disableRebufferTracking||e.disablePlayheadRebufferTracking)&&(this._lastCheckedTime=null,this._lastPlayheadTime=null,this._lastPlayheadTimeUpdatedTime=null,e.on("playbackheartbeat",this._checkIfRebuffering.bind(this)),e.on("playbackheartbeatend",this._cleanupRebufferTracker.bind(this)),e.on("seeking",function(){i._cleanupRebufferTracker(null,{viewer_time:Oe.now()})}))}return bt(t,[{key:"_checkIfRebuffering",value:function(e,i){if(this.pm.seekingTracker.isSeeking||this.pm.adTracker.isAdBreak||!this.pm.playbackHeartbeat._playheadShouldBeProgressing){this._cleanupRebufferTracker(e,i);return}if(this._lastCheckedTime===null){this._prepareRebufferTrackerState(i.viewer_time);return}if(this._lastPlayheadTime!==this.pm.data.player_playhead_time){this._cleanupRebufferTracker(e,i,!0);return}var a=i.viewer_time-this._lastPlayheadTimeUpdatedTime;typeof this.pm.sustainedRebufferThreshold=="number"&&a>=this.pm.sustainedRebufferThreshold&&(this._rebuffering||(this._rebuffering=!0,this.pm.emit("rebufferstart",{viewer_time:this._lastPlayheadTimeUpdatedTime}))),this._lastCheckedTime=i.viewer_time}},{key:"_clearRebufferTrackerState",value:function(){this._lastCheckedTime=null,this._lastPlayheadTime=null,this._lastPlayheadTimeUpdatedTime=null}},{key:"_prepareRebufferTrackerState",value:function(e){this._lastCheckedTime=e,this._lastPlayheadTime=this.pm.data.player_playhead_time,this._lastPlayheadTimeUpdatedTime=e}},{key:"_cleanupRebufferTracker",value:function(e,i){var a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1;if(this._rebuffering)this._rebuffering=!1,this.pm.emit("rebufferend",{viewer_time:i.viewer_time});else{if(this._lastCheckedTime===null)return;var r=this.pm.data.player_playhead_time-this._lastPlayheadTime,n=i.viewer_time-this._lastPlayheadTimeUpdatedTime;typeof this.pm.minimumRebufferDuration=="number"&&r>0&&n-r>this.pm.minimumRebufferDuration&&(this._lastCheckedTime=null,this.pm.emit("rebufferstart",{viewer_time:this._lastPlayheadTimeUpdatedTime}),this.pm.emit("rebufferend",{viewer_time:this._lastPlayheadTimeUpdatedTime+n-r}))}a?this._prepareRebufferTrackerState(i.viewer_time):this._clearRebufferTrackerState()}}]),t})(),__=E_,b_=(function(){function t(e){var i=this;_e(this,t),I(this,"pm",void 0),this.pm=e,e.on("viewinit",function(){var a=e.data,r=a.view_id;if(!a.view_program_changed){var n=function(s,o){var l=o.viewer_time;(s.type==="playing"&&typeof e.data.view_time_to_first_frame>"u"||s.type==="adplaying"&&(typeof e.data.view_time_to_first_frame>"u"||i._inPrerollPosition()))&&i.calculateTimeToFirstFrame(l||Oe.now(),r)};e.one("playing",n),e.one("adplaying",n),e.one("viewend",function(){e.off("playing",n),e.off("adplaying",n)})}})}return bt(t,[{key:"_inPrerollPosition",value:function(){return typeof this.pm.data.view_content_playback_time>"u"||this.pm.data.view_content_playback_time<=1e3}},{key:"calculateTimeToFirstFrame",value:function(e,i){i===this.pm.data.view_id&&(this.pm.watchTimeTracker._updateWatchTime(null,{viewer_time:e}),this.pm.data.view_time_to_first_frame=this.pm.data.view_watch_time,(this.pm.data.player_autoplay_on||this.pm.data.video_is_autoplay)&&this.pm.pageLoadInitTime&&(this.pm.data.view_aggregate_startup_time=this.pm.data.view_start+this.pm.data.view_watch_time-this.pm.pageLoadInitTime))}}]),t})(),g_=b_,y_=function t(e){var i=this;_e(this,t),I(this,"_lastPlayerHeight",void 0),I(this,"_lastPlayerWidth",void 0),I(this,"_lastPlayheadPosition",void 0),I(this,"_lastSourceHeight",void 0),I(this,"_lastSourceWidth",void 0),e.on("viewinit",function(){i._lastPlayheadPosition=-1});var a=["pause","rebufferstart","seeking","error","adbreakstart","hb","renditionchange","orientationchange","viewend","playbackmodechange"],r=["playing","hb","renditionchange","orientationchange","playbackmodechange"];a.forEach(function(n){e.on(n,function(){if(i._lastPlayheadPosition>=0&&e.data.player_playhead_time>=0&&i._lastPlayerWidth>=0&&i._lastSourceWidth>0&&i._lastPlayerHeight>=0&&i._lastSourceHeight>0){var s=e.data.player_playhead_time-i._lastPlayheadPosition;if(s<0){i._lastPlayheadPosition=-1;return}var o=Math.min(i._lastPlayerWidth/i._lastSourceWidth,i._lastPlayerHeight/i._lastSourceHeight),l=Math.max(0,o-1),c=Math.max(0,1-o);e.data.view_max_upscale_percentage=Math.max(e.data.view_max_upscale_percentage||0,l),e.data.view_max_downscale_percentage=Math.max(e.data.view_max_downscale_percentage||0,c),Le(e.data,"view_total_content_playback_time",s),Le(e.data,"view_total_upscaling",l*s),Le(e.data,"view_total_downscaling",c*s)}i._lastPlayheadPosition=-1})}),r.forEach(function(n){e.on(n,function(){i._lastPlayheadPosition=e.data.player_playhead_time,i._lastPlayerWidth=e.data.player_width,i._lastPlayerHeight=e.data.player_height,i._lastSourceWidth=e.data.video_source_width,i._lastSourceHeight=e.data.video_source_height})})},T_=y_,A_=2e3,k_=function t(e){var i=this;_e(this,t),I(this,"isSeeking",void 0),this.isSeeking=!1;var a=-1,r=function(){var n=Oe.now(),s=(e.data.viewer_time||n)-(a||n);Le(e.data,"view_seek_duration",s),e.data.view_max_seek_time=Math.max(e.data.view_max_seek_time||0,s),i.isSeeking=!1,a=-1};e.on("seeking",function(n,s){if(Object.assign(e.data,s),i.isSeeking&&s.viewer_time-a<=A_){a=s.viewer_time;return}i.isSeeking&&r(),i.isSeeking=!0,a=s.viewer_time,Le(e.data,"view_seek_count",1),e.send("seeking")}),e.on("seeked",function(){r()}),e.on("viewend",function(){i.isSeeking&&(r(),e.send("seeked")),i.isSeeking=!1,a=-1})},w_=k_,bh=function(t,e){t.push(e),t.sort(function(i,a){return i.viewer_time-a.viewer_time})},S_=["adbreakstart","adrequest","adresponse","adplay","adplaying","adpause","adended","adbreakend","aderror","adclicked","adskipped"],I_=(function(){function t(e){var i=this;_e(this,t),I(this,"_adHasPlayed",void 0),I(this,"_adRequests",void 0),I(this,"_adResponses",void 0),I(this,"_currentAdRequestNumber",void 0),I(this,"_currentAdResponseNumber",void 0),I(this,"_prerollPlayTime",void 0),I(this,"_wouldBeNewAdPlay",void 0),I(this,"isAdBreak",void 0),I(this,"pm",void 0),this.pm=e,e.on("viewinit",function(){i.isAdBreak=!1,i._currentAdRequestNumber=0,i._currentAdResponseNumber=0,i._adRequests=[],i._adResponses=[],i._adHasPlayed=!1,i._wouldBeNewAdPlay=!0,i._prerollPlayTime=void 0}),S_.forEach(function(r){return e.on(r,i._updateAdData.bind(i))});var a=function(){i.isAdBreak=!1};e.on("adbreakstart",function(){i.isAdBreak=!0}),e.on("play",a),e.on("playing",a),e.on("viewend",a),e.on("adrequest",function(r,n){n=Object.assign({ad_request_id:"generatedAdRequestId"+i._currentAdRequestNumber++},n),bh(i._adRequests,n),Le(e.data,"view_ad_request_count"),i.inPrerollPosition()&&(e.data.view_preroll_requested=!0,i._adHasPlayed||Le(e.data,"view_preroll_request_count"))}),e.on("adresponse",function(r,n){n=Object.assign({ad_request_id:"generatedAdRequestId"+i._currentAdResponseNumber++},n),bh(i._adResponses,n);var s=i.findAdRequest(n.ad_request_id);s&&Le(e.data,"view_ad_request_time",Math.max(0,n.viewer_time-s.viewer_time))}),e.on("adplay",function(r,n){i._adHasPlayed=!0,i._wouldBeNewAdPlay&&(i._wouldBeNewAdPlay=!1,Le(e.data,"view_ad_played_count")),i.inPrerollPosition()&&!e.data.view_preroll_played&&(e.data.view_preroll_played=!0,i._adRequests.length>0&&(e.data.view_preroll_request_time=Math.max(0,n.viewer_time-i._adRequests[0].viewer_time)),e.data.view_start&&(e.data.view_startup_preroll_request_time=Math.max(0,n.viewer_time-e.data.view_start)),i._prerollPlayTime=n.viewer_time)}),e.on("adplaying",function(r,n){i.inPrerollPosition()&&typeof e.data.view_preroll_load_time>"u"&&typeof i._prerollPlayTime<"u"&&(e.data.view_preroll_load_time=n.viewer_time-i._prerollPlayTime,e.data.view_startup_preroll_load_time=n.viewer_time-i._prerollPlayTime)}),e.on("adclicked",function(r,n){i._wouldBeNewAdPlay||Le(e.data,"view_ad_clicked_count")}),e.on("adskipped",function(r,n){i._wouldBeNewAdPlay||Le(e.data,"view_ad_skipped_count")}),e.on("adended",function(){i._wouldBeNewAdPlay=!0}),e.on("aderror",function(){i._wouldBeNewAdPlay=!0})}return bt(t,[{key:"inPrerollPosition",value:function(){return typeof this.pm.data.view_content_playback_time>"u"||this.pm.data.view_content_playback_time<=1e3}},{key:"findAdRequest",value:function(e){for(var i=0;i<this._adRequests.length;i++)if(this._adRequests[i].ad_request_id===e)return this._adRequests[i]}},{key:"_updateAdData",value:function(e,i){if(this.inPrerollPosition()){if(!this.pm.data.view_preroll_ad_tag_hostname&&i.ad_tag_url){var a=yi(Nn(i.ad_tag_url),2),r=a[0],n=a[1];this.pm.data.view_preroll_ad_tag_domain=n,this.pm.data.view_preroll_ad_tag_hostname=r}if(!this.pm.data.view_preroll_ad_asset_hostname&&i.ad_asset_url){var s=yi(Nn(i.ad_asset_url),2),o=s[0],l=s[1];this.pm.data.view_preroll_ad_asset_domain=l,this.pm.data.view_preroll_ad_asset_hostname=o}this.pm.data.ad_type="preroll"}this.pm.data.ad_asset_url=i==null?void 0:i.ad_asset_url,this.pm.data.ad_tag_url=i==null?void 0:i.ad_tag_url,this.pm.data.ad_creative_id=i==null?void 0:i.ad_creative_id,this.pm.data.ad_id=i==null?void 0:i.ad_id,this.pm.data.ad_universal_id=i==null?void 0:i.ad_universal_id,i!=null&&i.ad_type&&(this.pm.data.ad_type=i==null?void 0:i.ad_type)}}]),t})(),R_=I_,L_=function t(e){var i=this;_e(this,t),I(this,"lastWallClockTime",void 0);var a=function(){i.lastWallClockTime=Oe.now(),e.on("before*",r)},r=function(n){var s=Oe.now(),o=i.lastWallClockTime;i.lastWallClockTime=s,s-o>3e4&&(e.emit("devicesleep",{viewer_time:o}),Object.assign(e.data,{viewer_time:o}),e.send("devicesleep"),e.emit("devicewake",{viewer_time:s}),Object.assign(e.data,{viewer_time:s}),e.send("devicewake"))};e.one("playbackheartbeat",a),e.on("playbackheartbeatend",function(){e.off("before*",r),e.one("playbackheartbeat",a)})},C_=L_,Ul=_t(si()),dp=(function(t){return t()})(function(){var t=function(){for(var i=0,a={};i<arguments.length;i++){var r=arguments[i];for(var n in r)a[n]=r[n]}return a};function e(i){function a(r,n,s){var o;if(typeof document<"u"){if(arguments.length>1){if(s=t({path:"/"},a.defaults,s),typeof s.expires=="number"){var l=new Date;l.setMilliseconds(l.getMilliseconds()+s.expires*864e5),s.expires=l}try{o=JSON.stringify(n),/^[\{\[]/.test(o)&&(n=o)}catch{}return i.write?n=i.write(n,r):n=encodeURIComponent(String(n)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),r=encodeURIComponent(String(r)),r=r.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent),r=r.replace(/[\(\)]/g,escape),document.cookie=[r,"=",n,s.expires?"; expires="+s.expires.toUTCString():"",s.path?"; path="+s.path:"",s.domain?"; domain="+s.domain:"",s.secure?"; secure":""].join("")}r||(o={});for(var c=document.cookie?document.cookie.split("; "):[],p=/(%[0-9A-Z]{2})+/g,m=0;m<c.length;m++){var u=c[m].split("="),d=u.slice(1).join("=");d.charAt(0)==='"'&&(d=d.slice(1,-1));try{var v=u[0].replace(p,decodeURIComponent);if(d=i.read?i.read(d,v):i(d,v)||d.replace(p,decodeURIComponent),this.json)try{d=JSON.parse(d)}catch{}if(r===v){o=d;break}r||(o[v]=d)}catch{}}return o}}return a.set=a,a.get=function(r){return a.call(a,r)},a.getJSON=function(){return a.apply({json:!0},[].slice.call(arguments))},a.defaults={},a.remove=function(r,n){a(r,"",t(n,{expires:-1}))},a.withConverter=e,a}return e(function(){})}),up="muxData",D_=function(t){return Object.entries(t).map(function(e){var i=yi(e,2),a=i[0],r=i[1];return"".concat(a,"=").concat(r)}).join("&")},M_=function(t){return t.split("&").reduce(function(e,i){var a=yi(i.split("="),2),r=a[0],n=a[1],s=+n,o=n&&s==n?s:n;return e[r]=o,e},{})},cp=function(){var t;try{t=M_(dp.get(up)||"")}catch{t={}}return t},hp=function(t){try{dp.set(up,D_(t),{expires:365})}catch{}},x_=function(){var t=cp();return t.mux_viewer_id=t.mux_viewer_id||On(),t.msn=t.msn||Math.random(),hp(t),{mux_viewer_id:t.mux_viewer_id,mux_sample_number:t.msn}},O_=function(){var t=cp(),e=Oe.now();return t.session_start&&(t.sst=t.session_start,delete t.session_start),t.session_id&&(t.sid=t.session_id,delete t.session_id),t.session_expires&&(t.sex=t.session_expires,delete t.session_expires),(!t.sex||t.sex<e)&&(t.sid=On(),t.sst=e),t.sex=e+1500*1e3,hp(t),{session_id:t.sid,session_start:t.sst,session_expires:t.sex}};function N_(t,e){var i=e.beaconCollectionDomain,a=e.beaconDomain;if(i){var r=/localhost(?::\d+)?$/.test(i)?"http://":"https://";return r+i}t=t||"inferred";var n=a||"litix.io";return t.match(/^[a-z0-9]+$/)?"https://"+t+"."+n:"https://img.litix.io/a.gif"}var P_={a:"env",b:"beacon",c:"custom",d:"ad",e:"event",f:"experiment",i:"internal",m:"mux",n:"response",p:"player",q:"request",r:"retry",s:"session",t:"timestamp",u:"viewer",v:"video",w:"page",x:"view",y:"sub"},$_=mp(P_),U_={ad:"ad",af:"affiliate",ag:"aggregate",ap:"api",al:"application",ao:"audio",ar:"architecture",as:"asset",au:"autoplay",av:"average",bi:"bitrate",bn:"brand",br:"break",bw:"browser",by:"bytes",bz:"business",ca:"cached",cb:"cancel",cc:"codec",cd:"code",cg:"category",ch:"changed",ci:"client",ck:"clicked",cl:"canceled",cm:"cmcd",cn:"config",co:"count",ce:"counter",cp:"complete",cq:"creator",cr:"creative",cs:"captions",ct:"content",cu:"current",cv:"cumulative",cx:"connection",cz:"context",da:"data",dg:"downscaling",dm:"domain",dn:"cdn",do:"downscale",dr:"drm",dp:"dropped",du:"duration",dv:"device",dy:"dynamic",eb:"enabled",ec:"encoding",ed:"edge",en:"end",eg:"engine",em:"embed",er:"error",ep:"experiments",es:"errorcode",et:"errortext",ee:"event",ev:"events",ex:"expires",ez:"exception",fa:"failed",fi:"first",fm:"family",ft:"format",fp:"fps",fq:"frequency",fr:"frame",fs:"fullscreen",ha:"has",hb:"holdback",he:"headers",ho:"host",hn:"hostname",ht:"height",id:"id",ii:"init",in:"instance",ip:"ip",is:"is",ke:"key",la:"language",lb:"labeled",le:"level",li:"live",ld:"loaded",lo:"load",lw:"low",ls:"lists",lt:"latency",ma:"max",md:"media",me:"message",mf:"manifest",mi:"mime",ml:"midroll",mm:"min",mn:"manufacturer",mo:"model",mp:"mode",ms:"ms",mx:"mux",ne:"newest",nm:"name",no:"number",on:"on",or:"origin",os:"os",pa:"paused",pb:"playback",pd:"producer",pe:"percentage",pf:"played",pg:"program",ph:"playhead",pi:"plugin",pl:"preroll",pn:"playing",po:"poster",pp:"pip",pr:"preload",ps:"position",pt:"part",pv:"previous",py:"property",px:"pop",pz:"plan",ra:"rate",rd:"requested",re:"rebuffer",rf:"rendition",rg:"range",rm:"remote",ro:"ratio",rp:"response",rq:"request",rs:"requests",sa:"sample",sd:"skipped",se:"session",sh:"shift",sk:"seek",sm:"stream",so:"source",sq:"sequence",sr:"series",ss:"status",st:"start",su:"startup",sv:"server",sw:"software",sy:"severity",ta:"tag",tc:"tech",te:"text",tg:"target",th:"throughput",ti:"time",tl:"total",to:"to",tt:"title",ty:"type",ug:"upscaling",un:"universal",up:"upscale",ur:"url",us:"user",va:"variant",vd:"viewed",vi:"video",ve:"version",vw:"view",vr:"viewer",wd:"width",wa:"watch",wt:"waiting"},gh=mp(U_);function mp(t){var e={};for(var i in t)t.hasOwnProperty(i)&&(e[t[i]]=i);return e}function od(t){var e={},i={};return Object.keys(t).forEach(function(a){var r=!1;if(t.hasOwnProperty(a)&&t[a]!==void 0){var n=a.split("_"),s=n[0],o=$_[s];o||(re.info("Data key word `"+n[0]+"` not expected in "+a),o=s+"_"),n.splice(1).forEach(function(l){l==="url"&&(r=!0),gh[l]?o+=gh[l]:Number.isInteger(Number(l))?o+=l:(re.info("Data key word `"+l+"` not expected in "+a),o+="_"+l+"_")}),r?i[o]=t[a]:e[o]=t[a]}}),Object.assign(e,i)}var ha=_t(si()),H_=_t(rp()),B_={maxBeaconSize:300,maxQueueLength:3600,baseTimeBetweenBeacons:1e4,maxPayloadKBSize:500},W_=56*1024,F_=["hb","requestcompleted","requestfailed","requestcanceled"],K_="https://img.litix.io",Ti=function(t){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};this._beaconUrl=t||K_,this._eventQueue=[],this._postInFlight=!1,this._resendAfterPost=!1,this._failureCount=0,this._sendTimeout=!1,this._options=Object.assign({},B_,e)};Ti.prototype.queueEvent=function(t,e){var i=Object.assign({},e);return this._eventQueue.length<=this._options.maxQueueLength||t==="eventrateexceeded"?(this._eventQueue.push(i),this._sendTimeout||this._startBeaconSending(),this._eventQueue.length<=this._options.maxQueueLength):!1};Ti.prototype.flushEvents=function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:!1;if(t&&this._eventQueue.length===1){this._eventQueue.pop();return}this._eventQueue.length&&this._sendBeaconQueue(),this._startBeaconSending()};Ti.prototype.destroy=function(){var t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:!1;this.destroyed=!0,t?this._clearBeaconQueue():this.flushEvents(),ha.default.clearTimeout(this._sendTimeout)};Ti.prototype._clearBeaconQueue=function(){var t=this._eventQueue.length>this._options.maxBeaconSize?this._eventQueue.length-this._options.maxBeaconSize:0,e=this._eventQueue.slice(t);t>0&&Object.assign(e[e.length-1],od({mux_view_message:"event queue truncated"}));var i=this._createPayload(e);pp(this._beaconUrl,i,!0,function(){})};Ti.prototype._sendBeaconQueue=function(){var t=this;if(this._postInFlight){this._resendAfterPost=!0;return}var e=this._eventQueue.slice(0,this._options.maxBeaconSize);this._eventQueue=this._eventQueue.slice(this._options.maxBeaconSize),this._postInFlight=!0;var i=this._createPayload(e),a=Oe.now();pp(this._beaconUrl,i,!1,function(r,n){n?(t._eventQueue=e.concat(t._eventQueue),t._failureCount+=1,re.info("Error sending beacon: "+n)):t._failureCount=0,t._roundTripTime=Oe.now()-a,t._postInFlight=!1,t._resendAfterPost&&(t._resendAfterPost=!1,t._eventQueue.length>0&&t._sendBeaconQueue())})};Ti.prototype._getNextBeaconTime=function(){if(!this._failureCount)return this._options.baseTimeBetweenBeacons;var t=Math.pow(2,this._failureCount-1);return t=t*Math.random(),(1+t)*this._options.baseTimeBetweenBeacons};Ti.prototype._startBeaconSending=function(){var t=this;ha.default.clearTimeout(this._sendTimeout),!this.destroyed&&(this._sendTimeout=ha.default.setTimeout(function(){t._eventQueue.length&&t._sendBeaconQueue(),t._startBeaconSending()},this._getNextBeaconTime()))};Ti.prototype._createPayload=function(t){var e=this,i={transmission_timestamp:Math.round(Oe.now())};this._roundTripTime&&(i.rtt_ms=Math.round(this._roundTripTime));var a,r,n,s=function(){a=JSON.stringify({metadata:i,events:r||t}),n=a.length/1024},o=function(){return n<=e._options.maxPayloadKBSize};return s(),o()||(re.info("Payload size is too big ("+n+" kb). Removing unnecessary events."),r=t.filter(function(l){return F_.indexOf(l.e)===-1}),s()),o()||(re.info("Payload size still too big ("+n+" kb). Cropping fields.."),r.forEach(function(l){for(var c in l){var p=l[c],m=50*1024;typeof p=="string"&&p.length>m&&(l[c]=p.substring(0,m))}}),s()),a};var V_=typeof H_.default.exitPictureInPicture=="function"?function(t){return t.length<=W_}:function(t){return!1},pp=function(t,e,i,a){if(i&&navigator&&navigator.sendBeacon&&navigator.sendBeacon(t,e)){a();return}if(ha.default.fetch){ha.default.fetch(t,{method:"POST",body:e,headers:{"Content-Type":"text/plain"},keepalive:V_(e)}).then(function(n){return a(null,n.ok?null:"Error")}).catch(function(n){return a(null,n)});return}if(ha.default.XMLHttpRequest){var r=new ha.default.XMLHttpRequest;r.onreadystatechange=function(){if(r.readyState===4)return a(null,r.status!==200?"error":void 0)},r.open("POST",t),r.setRequestHeader("Content-Type","text/plain"),r.send(e);return}a()},q_=Ti,Y_=["env_key","view_id","view_sequence_number","player_sequence_number","beacon_domain","player_playhead_time","viewer_time","mux_api_version","event","video_id","player_instance_id","player_error_code","player_error_message","player_error_context","player_error_severity","player_error_business_exception","view_playing_time_ms_cumulative","ad_playing_time_ms_cumulative"],G_=["adplay","adplaying","adpause","adfirstquartile","admidpoint","adthirdquartile","adended","adresponse","adrequest"],z_=["ad_id","ad_creative_id","ad_universal_id"],Q_=["viewstart","error","ended","viewend"],j_=600*1e3,Z_=(function(){function t(e,i){var a=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};_e(this,t);var r,n,s,o,l,c,p,m,u,d,v,f;I(this,"mux",void 0),I(this,"envKey",void 0),I(this,"options",void 0),I(this,"eventQueue",void 0),I(this,"sampleRate",void 0),I(this,"disableCookies",void 0),I(this,"respectDoNotTrack",void 0),I(this,"previousBeaconData",void 0),I(this,"lastEventTime",void 0),I(this,"rateLimited",void 0),I(this,"pageLevelData",void 0),I(this,"viewerData",void 0),this.mux=e,this.envKey=i,this.options=a,this.previousBeaconData=null,this.lastEventTime=0,this.rateLimited=!1,this.eventQueue=new q_(N_(this.envKey,this.options));var b;this.sampleRate=(b=this.options.sampleRate)!==null&&b!==void 0?b:1;var E;this.disableCookies=(E=this.options.disableCookies)!==null&&E!==void 0?E:!1;var T;this.respectDoNotTrack=(T=this.options.respectDoNotTrack)!==null&&T!==void 0?T:!1,this.previousBeaconData=null,this.lastEventTime=0,this.rateLimited=!1,this.pageLevelData={mux_api_version:this.mux.API_VERSION,mux_embed:this.mux.NAME,mux_embed_version:this.mux.VERSION,viewer_application_name:(r=this.options.platform)===null||r===void 0?void 0:r.name,viewer_application_version:(n=this.options.platform)===null||n===void 0?void 0:n.version,viewer_application_engine:(s=this.options.platform)===null||s===void 0?void 0:s.layout,viewer_device_name:(o=this.options.platform)===null||o===void 0?void 0:o.product,viewer_device_category:"",viewer_device_manufacturer:(l=this.options.platform)===null||l===void 0?void 0:l.manufacturer,viewer_os_family:(p=this.options.platform)===null||p===void 0||(c=p.os)===null||c===void 0?void 0:c.family,viewer_os_architecture:(u=this.options.platform)===null||u===void 0||(m=u.os)===null||m===void 0?void 0:m.architecture,viewer_os_version:(v=this.options.platform)===null||v===void 0||(d=v.os)===null||d===void 0?void 0:d.version,page_url:Ul.default===null||Ul.default===void 0||(f=Ul.default.location)===null||f===void 0?void 0:f.href},this.viewerData=this.disableCookies?{}:x_()}return bt(t,[{key:"send",value:function(e,i){if(!(!e||!(i!=null&&i.view_id))){if(this.respectDoNotTrack&&nd())return re.info("Not sending `"+e+"` because Do Not Track is enabled");if(!i||typeof i!="object")return re.error("A data object was expected in send() but was not provided");var a=this.disableCookies?{}:O_(),r=Su(Pn({},this.pageLevelData,i,a,this.viewerData),{event:e,env_key:this.envKey});r.user_id&&(r.viewer_user_id=r.user_id,delete r.user_id);var n,s=((n=r.mux_sample_number)!==null&&n!==void 0?n:0)>=this.sampleRate,o=this._deduplicateBeaconData(e,r),l=od(o);if(this.lastEventTime=this.mux.utils.now(),s)return re.info("Not sending event due to sample rate restriction",e,r,l);if(this.envKey||re.info("Missing environment key (envKey) - beacons will be dropped if the video source is not a valid mux video URL",e,r,l),!this.rateLimited)if(re.info("Sending event",e,r,l),this.rateLimited=!this.eventQueue.queueEvent(e,l),this.mux.WINDOW_UNLOADING&&e==="viewend")this.eventQueue.destroy(!0);else{if(this.mux.WINDOW_HIDDEN&&e==="hb")this.eventQueue.flushEvents(!0);else if(Q_.indexOf(e)>=0){if(e==="error"&&i.player_error_severity==="warning")return;this.eventQueue.flushEvents()}if(this.rateLimited)return r.event="eventrateexceeded",l=od(r),this.eventQueue.queueEvent(r.event,l),re.error("Beaconing disabled due to rate limit.")}}}},{key:"destroy",value:function(){this.eventQueue.destroy(!1)}},{key:"_deduplicateBeaconData",value:function(e,i){var a=this,r={},n=i.view_id;if(n==="-1"||e==="viewstart"||e==="viewend"||!this.previousBeaconData||this.mux.utils.now()-this.lastEventTime>=j_)r=Pn({},i),n&&(this.previousBeaconData=r),n&&e==="viewend"&&(this.previousBeaconData=null);else{var s=e.indexOf("request")===0;Object.entries(i).forEach(function(o){var l=yi(o,2),c=l[0],p=l[1];a.previousBeaconData&&(p!==a.previousBeaconData[c]||Y_.indexOf(c)>-1||a.objectHasChanged(s,c,p,a.previousBeaconData[c])||a.eventRequiresKey(e,c))&&(r[c]=p,a.previousBeaconData[c]=p)})}return r}},{key:"objectHasChanged",value:function(e,i,a,r){return!e||i.indexOf("request_")!==0?!1:i==="request_response_headers"||typeof a!="object"||typeof r!="object"?!0:Object.keys(a||{}).length!==Object.keys(r||{}).length}},{key:"eventRequiresKey",value:function(e,i){return!!(e==="renditionchange"&&i.indexOf("video_source_")===0||z_.includes(i)&&G_.includes(e)||e==="playbackmodechange"&&i.indexOf("player_playback_mode")===0)}}]),t})(),X_=function t(e){_e(this,t);var i=0,a=0,r=0,n=0,s=0,o=0,l=0,c=function(u,d){var v=d.request_start,f=d.request_response_start,b=d.request_response_end,E=d.request_bytes_loaded;n++;var T,_;if(f?(T=f-(v??0),_=(b??0)-f):_=(b??0)-(v??0),_>0&&E&&E>0){var w=E/_*8e3;s++,a+=E,r+=_,e.data.view_min_request_throughput=Math.min(e.data.view_min_request_throughput||1/0,w),e.data.view_average_request_throughput=a/r*8e3,e.data.view_request_count=n,T>0&&(i+=T,e.data.view_max_request_latency=Math.max(e.data.view_max_request_latency||0,T),e.data.view_average_request_latency=i/s)}},p=function(u,d){n++,o++,e.data.view_request_count=n,e.data.view_request_failed_count=o},m=function(u,d){n++,l++,e.data.view_request_count=n,e.data.view_request_canceled_count=l};e.on("requestcompleted",c),e.on("requestfailed",p),e.on("requestcanceled",m)},J_=X_,eb=3600*1e3,tb=function t(e){var i=this;_e(this,t),I(this,"_lastEventTime",void 0),e.on("before*",function(a,r){var n=r.viewer_time,s=Oe.now(),o=i._lastEventTime;if(i._lastEventTime=s,o&&s-o>eb){var l=Object.keys(e.data).reduce(function(p,m){return m.indexOf("video_")===0?Object.assign(p,I({},m,e.data[m])):p},{});e.mux.log.info("Received event after at least an hour inactivity, creating a new view");var c=e.playbackHeartbeat._playheadShouldBeProgressing;e._resetView(Object.assign({viewer_time:n},l)),e.playbackHeartbeat._playheadShouldBeProgressing=c,e.playbackHeartbeat._playheadShouldBeProgressing&&a.type!=="play"&&a.type!=="adbreakstart"&&(e.emit("play",{viewer_time:n}),a.type!=="playing"&&e.emit("playing",{viewer_time:n}))}})},ib=tb,ab=function t(e){_e(this,t);var i=function(o){var l=rb(o),c=nb(o);if(l!=null&&!yh(l,n)&&s<=c){n=l,s=c;var p={video_cdn:l};e.emit("cdnchange",p)}},a=null,r=null,n=null,s=0;e.on("viewinit",function(){a=null,r=null,n=null,s=0}),e.on("beforecdnchange",function(o,l){var c=l==null?void 0:l.video_cdn;c&&(typeof l.video_previous_cdn>"u"||l.video_previous_cdn===null)&&(yh(c,r)?l.video_previous_cdn=a??void 0:(l.video_previous_cdn=r??void 0,a=r,r=c))}),e.on("requestcompleted",function(o,l){i(l)})};function yh(t,e){return(t==null?void 0:t.toLowerCase())===(e==null?void 0:e.toLowerCase())}function rb(t){var e;return t!=null&&t.request_type&&(t.request_type==="media"||t.request_type==="video")&&!((e=t.request_response_headers)===null||e===void 0)&&e["x-cdn"]?t.request_response_headers["x-cdn"]:t!=null&&t.video_cdn?t.video_cdn:null}function nb(t){return t!=null&&t.request_start?t.request_start:t!=null&&t.viewer_time?t.viewer_time:Date.now()}var sb=ab,ob=function(t){try{return JSON.parse(t),!0}catch{return!1}},lb=function t(e){var i=this;_e(this,t),I(this,"_emittingAutomaticEvent",!1),I(this,"_hasInitialized",!1),I(this,"_currentMode","standard"),e.on("viewstart",function(){i._hasInitialized||(i._hasInitialized=!0,i._currentMode=e.data.player_playback_mode||"standard",i._emittingAutomaticEvent=!0,e.emit("playbackmodechange",{player_playback_mode:i._currentMode,player_playback_mode_data:"{}"}),i._emittingAutomaticEvent=!1)}),e.on("viewend",function(){i._hasInitialized=!1}),e.on("playbackmodechange",function(a,r){i._emittingAutomaticEvent||(r.player_playback_mode_data?ob(r.player_playback_mode_data)||(e.mux.log.warn("Invalid JSON string for player_playback_mode_data"),r.player_playback_mode_data="{}"):r.player_playback_mode_data="{}",e.data.player_playback_mode_data=r.player_playback_mode_data,e.data.player_playback_mode=r.player_playback_mode,i._currentMode=r.player_playback_mode)})},db=lb,ub=(function(){function t(e){_e(this,t),I(this,"pm",void 0),I(this,"_currentRangeStart",void 0),I(this,"_lastPlayheadTime",void 0),this.pm=e,this._currentRangeStart=null,this._lastPlayheadTime=null,e.on("playbackheartbeat",this._updatePlaybackRange.bind(this)),e.on("playbackheartbeatend",this._endPlaybackRange.bind(this))}return bt(t,[{key:"_updateLastRangeEnd",value:function(){var e=this.pm.data.video_playback_ranges;if(e&&e.length>0){var i=this.pm.data.player_playhead_time||0;e[e.length-1][1]=i}}},{key:"_updatePlaybackRange",value:function(){var e,i=this.pm.data.player_playhead_time||0;if(!(!this.pm.disableAdPlaybackRangeFiltering&&!((e=this.pm.adTracker)===null||e===void 0)&&e.isAdBreak&&this._lastPlayheadTime!==null&&i<this._lastPlayheadTime)){if(this._lastPlayheadTime!==null&&this._currentRangeStart!==null){var a=Math.abs(i-this._lastPlayheadTime);if(a>1e3){var r=this.pm.data.video_playback_ranges;r&&r.length>0&&(r[r.length-1][1]=this._lastPlayheadTime),this._currentRangeStart=null}}if(this._currentRangeStart===null){var n=this.pm.data.video_playback_ranges||[];n.length>0&&n[n.length-1][1]===i?this._currentRangeStart=n[n.length-1][0]:(this._currentRangeStart=i,n.push([i,i])),this.pm.data.video_playback_ranges=n}else this._updateLastRangeEnd();this._lastPlayheadTime=i}}},{key:"_endPlaybackRange",value:function(){this._currentRangeStart!==null&&(this._updateLastRangeEnd(),this._currentRangeStart=null,this._lastPlayheadTime=null)}}]),t})(),cb=ub,jt=Object.freeze({CELLULAR:"cellular",WIFI:"wifi",WIRED:"wired",OTHER:"other",NO_CONNECTION:"no_connection",UNKNOWN:"unknown"}),hb=function(t){if(!t)return jt.UNKNOWN;switch(t){case"cellular":case"wimax":return jt.CELLULAR;case"wifi":return jt.WIFI;case"ethernet":return jt.WIRED;case"none":return jt.NO_CONNECTION;case"bluetooth":case"other":return jt.OTHER;case"unknown":return jt.UNKNOWN;default:return jt.OTHER}},mb=function(t){return typeof t=="object"&&"connection"in t&&typeof t.connection=="object"},Qi=_t(si()),pb=(function(){function t(e){var i=this;_e(this,t),I(this,"pm",void 0),I(this,"lastType",void 0),I(this,"lastLowDataMode",void 0),this.pm=e,this.pm.one("viewinit",function(){var a,r=i.emit.bind(i);r(),Qi.default.addEventListener("online",r),Qi.default.addEventListener("offline",r),(a=t.connection)===null||a===void 0||a.addEventListener("change",r),i.pm.on("destroy",function(){var n;(n=t.connection)===null||n===void 0||n.removeEventListener("change",r),Qi.default.removeEventListener("online",r),Qi.default.removeEventListener("offline",r)})})}return bt(t,[{key:"type",get:function(){var e,i;return((e=Qi.default.navigator)===null||e===void 0?void 0:e.onLine)===!1?jt.NO_CONNECTION:!((i=t.connection)===null||i===void 0)&&i.type?hb(t.connection.type):jt.UNKNOWN}},{key:"lowDataMode",get:function(){var e;return(e=t.connection)===null||e===void 0?void 0:e.saveData}},{key:"emit",value:function(){var e=this.type,i=this.lowDataMode;e===this.lastType&&i===this.lastLowDataMode||(this.lastType=e,this.lastLowDataMode=i,this.pm.emit("networkchange",Pn({viewer_connection_type:e},i!==void 0&&{viewer_connection_low_data_mode:i})))}}],[{key:"connection",get:function(){return mb(Qi.default.navigator)?Qi.default.navigator.connection:null}}]),t})(),vb=pb,fb=["viewstart","ended","loadstart","pause","play","playing","ratechange","waiting","adplay","adpause","adended","aderror","adplaying","adrequest","adresponse","adbreakstart","adbreakend","adfirstquartile","admidpoint","adthirdquartile","rebufferstart","rebufferend","seeked","error","hb","requestcompleted","requestfailed","requestcanceled","renditionchange","networkchange","cdnchange","playbackmodechange"],Eb=new Set(["requestcompleted","requestfailed","requestcanceled"]),_b=(function(t){HE(i,t);var e=VE(i);function i(a,r,n){_e(this,i);var s;s=e.call(this),I($(s),"pageLoadEndTime",void 0),I($(s),"pageLoadInitTime",void 0),I($(s),"_destroyed",void 0),I($(s),"_heartBeatTimeout",void 0),I($(s),"adTracker",void 0),I($(s),"dashjs",void 0),I($(s),"data",void 0),I($(s),"disablePlayheadRebufferTracking",void 0),I($(s),"disableRebufferTracking",void 0),I($(s),"disableAdPlaybackRangeFiltering",void 0),I($(s),"errorTracker",void 0),I($(s),"errorTranslator",void 0),I($(s),"emitTranslator",void 0),I($(s),"getAdData",void 0),I($(s),"getPlayheadTime",void 0),I($(s),"getStateData",void 0),I($(s),"stateDataTranslator",void 0),I($(s),"hlsjs",void 0),I($(s),"id",void 0),I($(s),"longResumeTracker",void 0),I($(s),"minimumRebufferDuration",void 0),I($(s),"mux",void 0),I($(s),"playbackEventDispatcher",void 0),I($(s),"playbackHeartbeat",void 0),I($(s),"playbackHeartbeatTime",void 0),I($(s),"playheadTime",void 0),I($(s),"seekingTracker",void 0),I($(s),"sustainedRebufferThreshold",void 0),I($(s),"watchTimeTracker",void 0),I($(s),"currentFragmentPDT",void 0),I($(s),"currentFragmentStart",void 0),s.pageLoadInitTime=xo.navigationStart(),s.pageLoadEndTime=xo.domContentLoadedEventEnd();var o={debug:!1,minimumRebufferDuration:250,sustainedRebufferThreshold:1e3,playbackHeartbeatTime:25,beaconDomain:"litix.io",sampleRate:1,disableCookies:!1,respectDoNotTrack:!1,disableRebufferTracking:!1,disablePlayheadRebufferTracking:!1,disableAdPlaybackRangeFiltering:!1,errorTranslator:function(u){return u},emitTranslator:function(){for(var u=arguments.length,d=new Array(u),v=0;v<u;v++)d[v]=arguments[v];return d},stateDataTranslator:function(u){return u}};s.mux=a,s.id=r,n!=null&&n.beaconDomain&&s.mux.log.warn("The `beaconDomain` setting has been deprecated in favor of `beaconCollectionDomain`. Please change your integration to use `beaconCollectionDomain` instead of `beaconDomain`."),n=Object.assign(o,n),n.data=n.data||{},n.data.property_key&&(n.data.env_key=n.data.property_key,delete n.data.property_key),re.level=n.debug?ua.DEBUG:ua.WARN,s.getPlayheadTime=n.getPlayheadTime,s.getStateData=n.getStateData||function(){return{}},s.getAdData=n.getAdData||function(){},s.minimumRebufferDuration=n.minimumRebufferDuration,s.sustainedRebufferThreshold=n.sustainedRebufferThreshold,s.playbackHeartbeatTime=n.playbackHeartbeatTime,s.disableRebufferTracking=n.disableRebufferTracking,s.disableRebufferTracking&&s.mux.log.warn("Disabling rebuffer tracking. This should only be used in specific circumstances as a last resort when your player is known to unreliably track rebuffering."),s.disablePlayheadRebufferTracking=n.disablePlayheadRebufferTracking,s.disableAdPlaybackRangeFiltering=n.disableAdPlaybackRangeFiltering,s.errorTranslator=n.errorTranslator,s.emitTranslator=n.emitTranslator,s.stateDataTranslator=n.stateDataTranslator,s.playbackEventDispatcher=new Z_(a,n.data.env_key,n),s.data={player_instance_id:On(),mux_sample_rate:n.sampleRate,beacon_domain:n.beaconCollectionDomain||n.beaconDomain},s.data.view_sequence_number=1,s.data.player_sequence_number=1;var l=(function(){typeof this.data.view_start>"u"&&(this.data.view_start=this.mux.utils.now(),this.emit("viewstart"),this.emit("renditionchange"))}).bind($(s));if(s.on("viewinit",function(u,d){this._resetVideoData(),this._resetViewData(),this._resetErrorData(),this._updateStateData(),Object.assign(this.data,d),this._initializeViewData(),this.one("play",l),this.one("adbreakstart",l)}),s.on("videochange",function(u,d){this._resetView(d)}),s.on("programchange",function(u,d){this.data.player_is_paused&&this.mux.log.warn("The `programchange` event is intended to be used when the content changes mid playback without the video source changing, however the video is not currently playing. If the video source is changing please use the videochange event otherwise you will lose startup time information."),this._resetView(Object.assign(d,{view_program_changed:!0})),l(),this.emit("play"),this.emit("playing")}),s.on("fragmentchange",function(u,d){this.currentFragmentPDT=d.currentFragmentPDT,this.currentFragmentStart=d.currentFragmentStart}),s.on("destroy",s.destroy),typeof window<"u"&&typeof window.addEventListener=="function"&&typeof window.removeEventListener=="function"){var c=function(){var u=typeof s.data.view_start<"u";s.mux.WINDOW_HIDDEN=document.visibilityState==="hidden",u&&s.mux.WINDOW_HIDDEN&&(s.data.player_is_paused||s.emit("hb"))};window.addEventListener("visibilitychange",c,!1);var p=function(u){u.persisted||s.destroy()};window.addEventListener("pagehide",p,!1),s.on("destroy",function(){window.removeEventListener("visibilitychange",c),window.removeEventListener("pagehide",p)})}s.on("playerready",function(u,d){Object.assign(this.data,d)}),fb.forEach(function(u){s.on(u,function(d,v){u.indexOf("ad")!==0&&this._updateStateData(),Object.assign(this.data,v),this._sanitizeData()}),s.on("after"+u,function(){(u!=="error"||this.errorTracker.viewErrored)&&this.send(u)})}),s.on("viewend",function(u,d){Object.assign(s.data,d)});var m=function(u){var d=this.mux.utils.now();this.data.player_init_time&&(this.data.player_startup_time=d-this.data.player_init_time),this.pageLoadInitTime=this.data.page_load_init_time||this.pageLoadInitTime,this.pageLoadEndTime=this.data.page_load_end_time||this.pageLoadEndTime,!this.mux.PLAYER_TRACKED&&this.pageLoadInitTime&&(this.mux.PLAYER_TRACKED=!0,(this.data.player_init_time||this.pageLoadEndTime)&&(this.data.page_load_time=Math.min(this.data.player_init_time||1/0,this.pageLoadEndTime||1/0)-this.pageLoadInitTime)),this.send("playerready"),delete this.data.player_startup_time,delete this.data.page_load_time};return s.one("playerready",m),s.longResumeTracker=new ib($(s)),s.errorTracker=new l_($(s)),new C_($(s)),s.seekingTracker=new w_($(s)),s.playheadTime=new p_($(s)),s.playbackHeartbeat=new s_($(s)),new T_($(s)),s.watchTimeTracker=new u_($(s)),new h_($(s)),new cb($(s)),s.adTracker=new R_($(s)),new __($(s)),new f_($(s)),new g_($(s)),new J_($(s)),new sb($(s)),new db($(s)),new vb($(s)),n.hlsjs&&s.addHLSJS(n),n.dashjs&&s.addDashJS(n),s.emit("viewinit",n.data),s}return bt(i,[{key:"emit",value:function(a,r){var n,s=Object.assign({viewer_time:this.mux.utils.now()},r),o=[a,s];if(this.emitTranslator)try{o=this.emitTranslator(a,s)}catch(l){this.mux.log.warn("Exception in emit translator callback.",l)}o!=null&&o.length&&(n=gs(yr(i.prototype),"emit",this)).call.apply(n,[this].concat(wt(o)))}},{key:"destroy",value:function(){this._destroyed||(this._destroyed=!0,typeof this.data.view_start<"u"&&(this.emit("viewend"),this.send("viewend")),this.playbackEventDispatcher.destroy(),this.removeHLSJS(),this.removeDashJS(),window.clearTimeout(this._heartBeatTimeout))}},{key:"send",value:function(a){if(this.data.view_id){var r=Object.assign({},this.data),n=["player_program_time","player_manifest_newest_program_time","player_live_edge_program_time","player_program_time","video_holdback","video_part_holdback","video_target_duration","video_part_target_duration"];if(r.video_source_is_live===void 0&&(r.player_source_duration===1/0||r.video_source_duration===1/0?r.video_source_is_live=!0:(r.player_source_duration>0||r.video_source_duration>0)&&(r.video_source_is_live=!1)),r.video_source_is_live||n.forEach(function(c){r[c]=void 0}),r.video_source_url=r.video_source_url||r.player_source_url,r.video_source_url){var s=yi(Nn(r.video_source_url),2),o=s[0],l=s[1];r.video_source_domain=l,r.video_source_hostname=o}delete r.ad_request_id,r.video_playback_ranges&&(r.video_playback_range=JSON.stringify(r.video_playback_ranges.filter(function(c){return c[0]!==c[1]}).map(function(c){return"".concat(c[0],":").concat(c[1])})),delete r.video_playback_ranges),this.playbackEventDispatcher.send(a,r),this.data.view_sequence_number++,this.data.player_sequence_number++,Eb.has(a)||this._restartHeartBeat(),a==="viewend"&&delete this.data.view_id}}},{key:"_resetView",value:function(a){this.emit("viewend"),this.send("viewend"),this.emit("viewinit",a)}},{key:"_updateStateData",value:function(){var a,r=this.getStateData();if(typeof this.stateDataTranslator=="function")try{r=this.stateDataTranslator(r)}catch(s){this.mux.log.warn("Exception in stateDataTranslator translator callback.",s)}if(!((a=this.data)===null||a===void 0)&&a.video_cdn&&r!=null&&r.video_cdn){r.video_cdn;var n=WE(r,["video_cdn"]);r=n}Object.assign(this.data,r),this.playheadTime._updatePlayheadTime(),this._sanitizeData()}},{key:"_sanitizeData",value:function(){var a=this,r=["player_width","player_height","video_source_width","video_source_height","player_playhead_time","video_source_bitrate"];r.forEach(function(s){var o=parseInt(a.data[s],10);a.data[s]=isNaN(o)?void 0:o});var n=["player_source_url","video_source_url"];n.forEach(function(s){if(a.data[s]){var o=a.data[s].toLowerCase();(o.indexOf("data:")===0||o.indexOf("blob:")===0)&&(a.data[s]="MSE style URL")}})}},{key:"_resetVideoData",value:function(){var a=this;Object.keys(this.data).forEach(function(r){r.indexOf("video_")===0&&delete a.data[r]})}},{key:"_resetViewData",value:function(){var a=this;Object.keys(this.data).forEach(function(r){r.indexOf("view_")===0&&delete a.data[r]}),this.data.view_sequence_number=1}},{key:"_resetErrorData",value:function(){delete this.data.player_error_code,delete this.data.player_error_message,delete this.data.player_error_context,delete this.data.player_error_severity,delete this.data.player_error_business_exception}},{key:"_initializeViewData",value:function(){var a=this,r=this.data.view_id=On(),n=function(){r===a.data.view_id&&Le(a.data,"player_view_count",1)};this.data.player_is_paused?this.one("play",n):n()}},{key:"_restartHeartBeat",value:function(){var a=this;window.clearTimeout(this._heartBeatTimeout),this._heartBeatTimeout=window.setTimeout(function(){a.data.player_is_paused||a.emit("hb")},1e4)}},{key:"addHLSJS",value:function(a){if(!a.hlsjs){this.mux.log.warn("You must pass a valid hlsjs instance in order to track it.");return}if(this.hlsjs){this.mux.log.warn("An instance of HLS.js is already being monitored for this player.");return}this.hlsjs=a.hlsjs,jE(this.mux,this.id,a.hlsjs,{},a.Hls||window.Hls)}},{key:"removeHLSJS",value:function(){this.hlsjs&&(ZE(this.hlsjs),this.hlsjs=void 0)}},{key:"addDashJS",value:function(a){if(!a.dashjs){this.mux.log.warn("You must pass a valid dashjs instance in order to track it.");return}if(this.dashjs){this.mux.log.warn("An instance of Dash.js is already being monitored for this player.");return}this.dashjs=a.dashjs,t_(this.mux,this.id,a.dashjs)}},{key:"removeDashJS",value:function(){this.dashjs&&(i_(this.dashjs),this.dashjs=void 0)}}]),i})(r_),bb=_b,Nr=_t(rp());function Hl(){return Nr.default&&!!(Nr.default.fullscreenElement||Nr.default.webkitFullscreenElement||Nr.default.mozFullScreenElement||Nr.default.msFullscreenElement)}var gb=["loadstart","pause","play","playing","seeking","seeked","timeupdate","ratechange","stalled","waiting","error","ended"],yb={1:"MEDIA_ERR_ABORTED",2:"MEDIA_ERR_NETWORK",3:"MEDIA_ERR_DECODE",4:"MEDIA_ERR_SRC_NOT_SUPPORTED"};function Tb(t,e,i){var a=yi(Mo(e),3),r=a[0],n=a[1],s=a[2],o=t.log,l=t.utils.getComputedStyle,c=t.utils.secondsToMs,p={automaticErrorTracking:!0};if(r){if(s!=="video"&&s!=="audio")return o.error("The element of `"+n+"` was not a media element.")}else return o.error("No element was found with the `"+n+"` query selector.");r.mux&&(r.mux.destroy(),delete r.mux,o.warn("Already monitoring this video element, replacing existing event listeners"));var m={getPlayheadTime:function(){return c(r.currentTime)},getStateData:function(){var d,v,f,b=((d=(v=this).getPlayheadTime)===null||d===void 0?void 0:d.call(v))||c(r.currentTime),E=this.hlsjs&&this.hlsjs.url,T=this.dashjs&&typeof this.dashjs.getSource=="function"&&this.dashjs.getSource(),_={player_is_paused:r.paused,player_width:parseInt(l(r,"width")),player_height:parseInt(l(r,"height")),player_autoplay_on:r.autoplay,player_preload_on:r.preload,player_language_code:r.lang,player_is_fullscreen:Hl(),video_poster_url:r.poster,video_source_url:E||T||r.currentSrc,video_source_duration:c(r.duration),video_source_height:r.videoHeight,video_source_width:r.videoWidth,view_dropped_frame_count:r==null||(f=r.getVideoPlaybackQuality)===null||f===void 0?void 0:f.call(r).droppedVideoFrames};if(r.getStartDate&&b>0){var w=r.getStartDate();if(w&&typeof w.getTime=="function"&&w.getTime()){var R=w.getTime();if(_.player_program_time=R+b,r.seekable.length>0){var x=R+r.seekable.end(r.seekable.length-1);_.player_live_edge_program_time=x}}}return _}};i=Object.assign(p,i,m),i.data=Object.assign({player_software:"HTML5 Video Element",player_mux_plugin_name:"VideoElementMonitor",player_mux_plugin_version:t.VERSION},i.data),r.mux=r.mux||{},r.mux.deleted=!1,r.mux.emit=function(d,v){t.emit(n,d,v)},r.mux.updateData=function(d){r.mux.emit("hb",d)};var u=function(){o.error("The monitor for this video element has already been destroyed.")};r.mux.destroy=function(){Object.keys(r.mux.listeners).forEach(function(d){r.removeEventListener(d,r.mux.listeners[d],!1)}),delete r.mux.listeners,r.mux.fullscreenChangeListener&&(document.removeEventListener("fullscreenchange",r.mux.fullscreenChangeListener,!1),delete r.mux.fullscreenChangeListener),r.mux.destroy=u,r.mux.swapElement=u,r.mux.emit=u,r.mux.addHLSJS=u,r.mux.addDashJS=u,r.mux.removeHLSJS=u,r.mux.removeDashJS=u,r.mux.updateData=u,r.mux.setEmitTranslator=u,r.mux.setStateDataTranslator=u,r.mux.setGetPlayheadTime=u,r.mux.deleted=!0,t.emit(n,"destroy")},r.mux.swapElement=function(d){var v=yi(Mo(d),3),f=v[0],b=v[1],E=v[2];if(f){if(E!=="video"&&E!=="audio")return t.log.error("The element of `"+b+"` was not a media element.")}else return t.log.error("No element was found with the `"+b+"` query selector.");f.muxId=r.muxId,delete r.muxId,f.mux=f.mux||{},f.mux.listeners=Object.assign({},r.mux.listeners),delete r.mux.listeners,Object.keys(f.mux.listeners).forEach(function(T){r.removeEventListener(T,f.mux.listeners[T],!1),f.addEventListener(T,f.mux.listeners[T],!1)}),f.mux.fullscreenChangeListener=r.mux.fullscreenChangeListener,delete r.mux.fullscreenChangeListener,f.mux.swapElement=r.mux.swapElement,f.mux.destroy=r.mux.destroy,delete r.mux,r=f},r.mux.addHLSJS=function(d){t.addHLSJS(n,d)},r.mux.addDashJS=function(d){t.addDashJS(n,d)},r.mux.removeHLSJS=function(){t.removeHLSJS(n)},r.mux.removeDashJS=function(){t.removeDashJS(n)},r.mux.setEmitTranslator=function(d){t.setEmitTranslator(n,d)},r.mux.setStateDataTranslator=function(d){t.setStateDataTranslator(n,d)},r.mux.setGetPlayheadTime=function(d){d||(d=i.getPlayheadTime),t.setGetPlayheadTime(n,d)},t.init(n,i),t.emit(n,"playerready"),r.paused||(t.emit(n,"play"),r.readyState>2&&t.emit(n,"playing")),r.mux.listeners={},gb.forEach(function(d){d==="error"&&!i.automaticErrorTracking||(r.mux.listeners[d]=function(){var v={};if(d==="error"){if(!r.error||r.error.code===1)return;v.player_error_code=r.error.code,v.player_error_message=yb[r.error.code]||r.error.message}t.emit(n,d,v)},r.addEventListener(d,r.mux.listeners[d],!1))}),r.mux.listeners.enterpictureinpicture=function(){t.emit(n,"playbackmodechange",{player_playback_mode:"pip",player_playback_mode_data:"{}"})},r.mux.listeners.leavepictureinpicture=function(){var d=Hl()?"fullscreen":"standard";t.emit(n,"playbackmodechange",{player_playback_mode:d,player_playback_mode_data:"{}"})},r.addEventListener("enterpictureinpicture",r.mux.listeners.enterpictureinpicture,!1),r.addEventListener("leavepictureinpicture",r.mux.listeners.leavepictureinpicture,!1),r.mux.fullscreenChangeListener=function(){var d=Hl(),v=document.fullscreenElement;if(d&&(v===r||v!=null&&v.contains(r)))t.emit(n,"playbackmodechange",{player_playback_mode:"fullscreen",player_playback_mode_data:"{}"});else if(!d){var f=document.pictureInPictureElement===r,b=f?"pip":"standard";t.emit(n,"playbackmodechange",{player_playback_mode:b,player_playback_mode_data:"{}"})}},document.addEventListener("fullscreenchange",r.mux.fullscreenChangeListener,!1)}function Ab(t,e,i,a){var r=a;if(t&&typeof t[e]=="function")try{r=t[e].apply(t,i)}catch(n){re.info("safeCall error",n)}return r}var gn=_t(si()),Na;gn.default&&gn.default.WeakMap&&(Na=new WeakMap);function kb(t,e){if(!t||!e||!gn.default||typeof gn.default.getComputedStyle!="function")return"";var i;return Na&&Na.has(t)&&(i=Na.get(t)),i||(i=gn.default.getComputedStyle(t,null),Na&&Na.set(t,i)),i.getPropertyValue(e)}function wb(t){return Math.floor(t*1e3)}var ji={TARGET_DURATION:"#EXT-X-TARGETDURATION",PART_INF:"#EXT-X-PART-INF",SERVER_CONTROL:"#EXT-X-SERVER-CONTROL",INF:"#EXTINF",PROGRAM_DATE_TIME:"#EXT-X-PROGRAM-DATE-TIME",VERSION:"#EXT-X-VERSION",SESSION_DATA:"#EXT-X-SESSION-DATA"},hl=function(t){return this.buffer="",this.manifest={segments:[],serverControl:{},sessionData:{}},this.currentUri={},this.process(t),this.manifest};hl.prototype.process=function(t){var e;for(this.buffer+=t,e=this.buffer.indexOf(`
`);e>-1;e=this.buffer.indexOf(`
`))this.processLine(this.buffer.substring(0,e)),this.buffer=this.buffer.substring(e+1)};hl.prototype.processLine=function(t){var e=t.indexOf(":"),i=Lb(t,e),a=i[0],r=i.length===2?Ru(i[1]):void 0;if(a[0]!=="#")this.currentUri.uri=a,this.manifest.segments.push(this.currentUri),this.manifest.targetDuration&&!("duration"in this.currentUri)&&(this.currentUri.duration=this.manifest.targetDuration),this.currentUri={};else switch(a){case ji.TARGET_DURATION:{if(!isFinite(r)||r<0)return;this.manifest.targetDuration=r,this.setHoldBack();break}case ji.PART_INF:{Bl(this.manifest,i),this.manifest.partInf.partTarget&&(this.manifest.partTargetDuration=this.manifest.partInf.partTarget),this.setHoldBack();break}case ji.SERVER_CONTROL:{Bl(this.manifest,i),this.setHoldBack();break}case ji.INF:{r===0?this.currentUri.duration=.01:r>0&&(this.currentUri.duration=r);break}case ji.PROGRAM_DATE_TIME:{var n=r,s=new Date(n);this.manifest.dateTimeString||(this.manifest.dateTimeString=n,this.manifest.dateTimeObject=s),this.currentUri.dateTimeString=n,this.currentUri.dateTimeObject=s;break}case ji.VERSION:{Bl(this.manifest,i);break}case ji.SESSION_DATA:{var o=Cb(i[1]),l=lp(o);Object.assign(this.manifest.sessionData,l)}}};hl.prototype.setHoldBack=function(){var t=this.manifest,e=t.serverControl,i=t.targetDuration,a=t.partTargetDuration;if(e){var r="holdBack",n="partHoldBack",s=i&&i*3,o=a&&a*2;i&&!e.hasOwnProperty(r)&&(e[r]=s),s&&e[r]<s&&(e[r]=s),a&&!e.hasOwnProperty(n)&&(e[n]=a*3),a&&e[n]<o&&(e[n]=o)}};var Bl=function(t,e){var i=vp(e[0].replace("#EXT-X-","")),a;Rb(e[1])?(a={},a=Object.assign(Ib(e[1]),a)):a=Ru(e[1]),t[i]=a},vp=function(t){return t.toLowerCase().replace(/-(\w)/g,function(e){return e[1].toUpperCase()})},Ru=function(t){if(t.toLowerCase()==="yes"||t.toLowerCase()==="no")return t.toLowerCase()==="yes";var e=t.indexOf(":")!==-1?t:parseFloat(t);return isNaN(e)?t:e},Sb=function(t){var e={},i=t.split("=");if(i.length>1){var a=vp(i[0]);e[a]=Ru(i[1])}return e},Ib=function(t){for(var e=t.split(","),i={},a=0;e.length>a;a++){var r=e[a],n=Sb(r);i=Object.assign(n,i)}return i},Rb=function(t){return t.indexOf("=")>-1},Lb=function(t,e){return e===-1?[t]:[t.substring(0,e),t.substring(e+1)]},Cb=function(t){var e={};if(t){var i=t.search(","),a=t.slice(0,i),r=t.slice(i+1),n=[a,r];return n.forEach(function(s,o){for(var l=s.replace(/['"]+/g,"").split("="),c=0;c<l.length;c++)l[c]==="DATA-ID"&&(e["DATA-ID"]=l[1-c]),l[c]==="VALUE"&&(e.VALUE=l[1-c])}),{data:e}}},Db=hl,Mb={safeCall:Ab,safeIncrement:Le,getComputedStyle:kb,secondsToMs:wb,assign:Object.assign,headersStringToObject:Iu,cdnHeadersToRequestId:Oo,extractHostnameAndDomain:Nn,extractHostname:xt,manifestParser:Db,generateShortID:sp,generateUUID:On,now:Oe.now,findMediaElement:Mo},xb=Mb,Ob={PLAYER_READY:"playerready",VIEW_INIT:"viewinit",VIDEO_CHANGE:"videochange",PLAY:"play",PAUSE:"pause",PLAYING:"playing",TIME_UPDATE:"timeupdate",SEEKING:"seeking",SEEKED:"seeked",REBUFFER_START:"rebufferstart",REBUFFER_END:"rebufferend",ERROR:"error",ENDED:"ended",RENDITION_CHANGE:"renditionchange",ORIENTATION_CHANGE:"orientationchange",PLAYBACK_MODE_CHANGE:"playbackmodechange",NETWORK_CHANGE:"networkchange",AD_REQUEST:"adrequest",AD_RESPONSE:"adresponse",AD_BREAK_START:"adbreakstart",AD_PLAY:"adplay",AD_PLAYING:"adplaying",AD_PAUSE:"adpause",AD_FIRST_QUARTILE:"adfirstquartile",AD_MID_POINT:"admidpoint",AD_THIRD_QUARTILE:"adthirdquartile",AD_ENDED:"adended",AD_BREAK_END:"adbreakend",AD_ERROR:"aderror",REQUEST_COMPLETED:"requestcompleted",REQUEST_FAILED:"requestfailed",REQUEST_CANCELLED:"requestcanceled",HEARTBEAT:"hb",DESTROY:"destroy"},Nb=Ob,Pb="mux-embed",$b="5.18.0",Ub="2.1",ye={},Vi=function(t){var e=arguments;typeof t=="string"?Vi.hasOwnProperty(t)?bn.default.setTimeout(function(){e=Array.prototype.splice.call(e,1),Vi[t].apply(null,e)},0):re.warn("`"+t+"` is an unknown task"):typeof t=="function"?bn.default.setTimeout(function(){t(Vi)},0):re.warn("`"+t+"` is invalid.")},Hb={loaded:Oe.now(),NAME:Pb,VERSION:$b,API_VERSION:Ub,PLAYER_TRACKED:!1,monitor:function(t,e){return Tb(Vi,t,e)},destroyMonitor:function(t){var e=yi(Mo(t),1),i=e[0];i&&i.mux&&typeof i.mux.destroy=="function"?i.mux.destroy():re.error("A video element monitor for `"+t+"` has not been initialized via `mux.monitor`.")},addHLSJS:function(t,e){var i=kt(t);ye[i]?ye[i].addHLSJS(e):re.error("A monitor for `"+i+"` has not been initialized.")},addDashJS:function(t,e){var i=kt(t);ye[i]?ye[i].addDashJS(e):re.error("A monitor for `"+i+"` has not been initialized.")},removeHLSJS:function(t){var e=kt(t);ye[e]?ye[e].removeHLSJS():re.error("A monitor for `"+e+"` has not been initialized.")},removeDashJS:function(t){var e=kt(t);ye[e]?ye[e].removeDashJS():re.error("A monitor for `"+e+"` has not been initialized.")},init:function(t,e){nd()&&e&&e.respectDoNotTrack&&re.info("The browser's Do Not Track flag is enabled - Mux beaconing is disabled.");var i=kt(t);ye[i]=new bb(Vi,i,e)},emit:function(t,e,i){var a=kt(t);ye[a]?(ye[a].emit(e,i),e==="destroy"&&delete ye[a]):re.error("A monitor for `"+a+"` has not been initialized.")},updateData:function(t,e){var i=kt(t);ye[i]?ye[i].emit("hb",e):re.error("A monitor for `"+i+"` has not been initialized.")},setEmitTranslator:function(t,e){var i=kt(t);ye[i]?ye[i].emitTranslator=e:re.error("A monitor for `"+i+"` has not been initialized.")},setStateDataTranslator:function(t,e){var i=kt(t);ye[i]?ye[i].stateDataTranslator=e:re.error("A monitor for `"+i+"` has not been initialized.")},setGetPlayheadTime:function(t,e){var i=kt(t);ye[i]?ye[i].getPlayheadTime=e:re.error("A monitor for `"+i+"` has not been initialized.")},checkDoNotTrack:nd,log:re,utils:xb,events:Nb,WINDOW_HIDDEN:!1,WINDOW_UNLOADING:!1};Object.assign(Vi,Hb);typeof bn.default<"u"&&typeof bn.default.addEventListener=="function"&&bn.default.addEventListener("pagehide",function(t){t.persisted||(Vi.WINDOW_UNLOADING=!0)},!1);var Lu=Vi;/*!
* JavaScript Cookie v2.1.3
* https://github.com/js-cookie/js-cookie
*
* Copyright 2006, 2015 Klaus Hartl & Fagner Brack
* Released under the MIT license
*/var q=mE,ee={VIDEO:"video",THUMBNAIL:"thumbnail",STORYBOARD:"storyboard",DRM:"drm"},N={NOT_AN_ERROR:0,NETWORK_OFFLINE:2000002,NETWORK_UNKNOWN_ERROR:2e6,NETWORK_NO_STATUS:2000001,NETWORK_INVALID_URL:24e5,NETWORK_NOT_FOUND:2404e3,NETWORK_NOT_READY:2412e3,NETWORK_GENERIC_SERVER_FAIL:25e5,NETWORK_TOKEN_MISSING:2403201,NETWORK_TOKEN_MALFORMED:2412202,NETWORK_TOKEN_EXPIRED:2403210,NETWORK_TOKEN_AUD_MISSING:2403221,NETWORK_TOKEN_AUD_MISMATCH:2403222,NETWORK_TOKEN_SUB_MISMATCH:2403232,ENCRYPTED_ERROR:5e6,ENCRYPTED_UNSUPPORTED_KEY_SYSTEM:5000001,ENCRYPTED_GENERATE_REQUEST_FAILED:5000002,ENCRYPTED_UPDATE_LICENSE_FAILED:5000003,ENCRYPTED_UPDATE_SERVER_CERT_FAILED:5000004,ENCRYPTED_CDM_ERROR:5000005,ENCRYPTED_OUTPUT_RESTRICTED:5000006,ENCRYPTED_MISSING_TOKEN:5000002},ml=t=>t===ee.VIDEO?"playback":t,Si=class Yr extends Error{constructor(e,i=Yr.MEDIA_ERR_CUSTOM,a,r){var n;super(e),this.name="MediaError",this.code=i,this.context=r,this.fatal=a??(i>=Yr.MEDIA_ERR_NETWORK&&i<=Yr.MEDIA_ERR_ENCRYPTED),this.message||(this.message=(n=Yr.defaultMessages[this.code])!=null?n:"")}};Si.MEDIA_ERR_ABORTED=1,Si.MEDIA_ERR_NETWORK=2,Si.MEDIA_ERR_DECODE=3,Si.MEDIA_ERR_SRC_NOT_SUPPORTED=4,Si.MEDIA_ERR_ENCRYPTED=5,Si.MEDIA_ERR_CUSTOM=100,Si.defaultMessages={1:"You aborted the media playback",2:"A network error caused the media download to fail.",3:"A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.",4:"An unsupported error occurred. The server or network failed, or your browser does not support this format.",5:"The media is encrypted and there are no keys to decrypt it."};var L=Si,Bb=t=>t==null,Cu=(t,e)=>Bb(e)?!1:t in e,ld={ANY:"any",MUTED:"muted"},J={ON_DEMAND:"on-demand",LIVE:"live",UNKNOWN:"unknown"},ei={MSE:"mse",NATIVE:"native"},Gr={HEADER:"header",QUERY:"query",NONE:"none"},No=Object.values(Gr),_i={M3U8:"application/vnd.apple.mpegurl",MP4:"video/mp4"},Th={HLS:_i.M3U8};[...Object.values(_i)];var Yk={upTo720p:"720p",upTo1080p:"1080p",upTo1440p:"1440p",upTo2160p:"2160p"},Gk={noLessThan480p:"480p",noLessThan540p:"540p",noLessThan720p:"720p",noLessThan1080p:"1080p",noLessThan1440p:"1440p",noLessThan2160p:"2160p"},zk={DESCENDING:"desc"},Wb="en",dd={code:Wb},Ie=(t,e,i,a,r=t)=>{r.addEventListener(e,i,a),t.addEventListener("teardown",()=>{r.removeEventListener(e,i)},{once:!0})};function Fb(t,e,i){e&&i>e&&(i=e);for(let a=0;a<t.length;a++)if(t.start(a)<=i&&t.end(a)>=i)return!0;return!1}var Du=t=>{let e=t.indexOf("?");if(e<0)return[t];let i=t.slice(0,e),a=t.slice(e);return[i,a]},pl=t=>{let{type:e}=t;if(e){let i=e.toUpperCase();return Cu(i,Th)?Th[i]:e}return Kb(t)},fp=t=>t==="VOD"?J.ON_DEMAND:J.LIVE,Ep=t=>t==="EVENT"?Number.POSITIVE_INFINITY:t==="VOD"?Number.NaN:0,Kb=t=>{let{src:e}=t;if(!e)return"";let i="";try{i=new URL(e).pathname}catch{console.error("invalid url")}let a=i.lastIndexOf(".");if(a<0)return qb(t)?_i.M3U8:"";let r=i.slice(a+1).toUpperCase();return Cu(r,_i)?_i[r]:""},Vb="mux.com",qb=({src:t,customDomain:e=Vb})=>{let i;try{i=new URL(`${t}`)}catch{return!1}let a=i.protocol==="https:",r=i.hostname===`stream.${e}`.toLowerCase(),n=i.pathname.split("/"),s=n.length===2,o=!(n!=null&&n[1].includes("."));return a&&r&&s&&o},cr=t=>{let e=(t??"").split(".")[1];if(e)try{let i=e.replace(/-/g,"+").replace(/_/g,"/"),a=decodeURIComponent(atob(i).split("").map(function(r){return"%"+("00"+r.charCodeAt(0).toString(16)).slice(-2)}).join(""));return JSON.parse(a)}catch{return}},Yb=({exp:t},e=Date.now())=>!t||t*1e3<e,Gb=({sub:t},e)=>t!==e,zb=({aud:t},e)=>!t,Qb=({aud:t},e)=>t!==e,_p="en";function O(t,e=!0){var i,a;let r=e&&(a=(i=dd)==null?void 0:i[t])!=null?a:t,n=e?dd.code:_p;return new jb(r,n)}var jb=class{constructor(e,i=(a=>(a=dd)!=null?a:_p)()){this.message=e,this.locale=i}format(e){return this.message.replace(/\{(\w+)\}/g,(i,a)=>{var r;return(r=e[a])!=null?r:""})}toString(){return this.message}},Zb=Object.values(ld),Ah=t=>typeof t=="boolean"||typeof t=="string"&&Zb.includes(t),Xb=(t,e,i)=>{let{autoplay:a}=t,r=!1,n=!1,s=Ah(a)?a:!!a,o=()=>{r||Ie(e,"playing",()=>{r=!0},{once:!0})};if(o(),Ie(e,"loadstart",()=>{r=!1,o(),Wl(e,s)},{once:!0}),Ie(e,"loadstart",()=>{i||(t.streamType&&t.streamType!==J.UNKNOWN?n=t.streamType===J.LIVE:n=!Number.isFinite(e.duration)),Wl(e,s)},{once:!0}),i&&i.once(q.Events.LEVEL_LOADED,(l,c)=>{var p;t.streamType&&t.streamType!==J.UNKNOWN?n=t.streamType===J.LIVE:n=(p=c.details.live)!=null?p:!1}),!s){let l=()=>{!n||Number.isFinite(t.startTime)||(i!=null&&i.liveSyncPosition?e.currentTime=i.liveSyncPosition:Number.isFinite(e.seekable.end(0))&&(e.currentTime=e.seekable.end(0)))};i&&Ie(e,"play",()=>{e.preload==="metadata"?i.once(q.Events.LEVEL_UPDATED,l):l()},{once:!0})}return l=>{r||(s=Ah(l)?l:!!l,Wl(e,s))}},Wl=(t,e)=>{if(!e)return;let i=t.muted,a=()=>t.muted=i;switch(e){case ld.ANY:t.play().catch(()=>{t.muted=!0,t.play().catch(a)});break;case ld.MUTED:t.muted=!0,t.play().catch(a);break;default:t.play().catch(()=>{});break}},Jb=({preload:t,src:e},i,a)=>{let r=m=>{m!=null&&["","none","metadata","auto"].includes(m)?i.setAttribute("preload",m):i.removeAttribute("preload")};if(!a)return r(t),r;let n=!1,s=!1,o=a.config.maxBufferLength,l=a.config.maxBufferSize,c=m=>{r(m);let u=m??i.preload;s||u==="none"||(u==="metadata"?(a.config.maxBufferLength=1,a.config.maxBufferSize=1):(a.config.maxBufferLength=o,a.config.maxBufferSize=l),p())},p=()=>{!n&&e&&(n=!0,a.loadSource(e))};return Ie(i,"play",()=>{s=!0,a.config.maxBufferLength=o,a.config.maxBufferSize=l,p()},{once:!0}),c(t),c};function eg(t,e){var i;if(!("videoTracks"in t))return;let a=new WeakMap;e.on(q.Events.MANIFEST_PARSED,function(c,p){l();let m=t.addVideoTrack("main");m.selected=!0;for(let[u,d]of p.levels.entries()){let v=m.addRendition(d.url[0],d.width,d.height,d.videoCodec,d.bitrate);a.set(d,`${u}`),v.id=`${u}`}}),e.on(q.Events.AUDIO_TRACKS_UPDATED,function(c,p){o();for(let m of p.audioTracks){let u=m.default?"main":"alternative",d=t.addAudioTrack(u,m.name,m.lang);d.id=`${m.id}`,m.default&&(d.enabled=!0)}});let r=()=>{var c;let p=+((c=[...t.audioTracks].find(u=>u.enabled))==null?void 0:c.id),m=e.audioTracks.map(u=>u.id);p!=e.audioTrack&&m.includes(p)&&(e.audioTrack=p)};t.audioTracks.addEventListener("change",r),e.on(q.Events.LEVELS_UPDATED,function(c,p){var m;let u=t.videoTracks[(m=t.videoTracks.selectedIndex)!=null?m:0];if(!u)return;let d=p.levels.map(v=>a.get(v));for(let v of t.videoRenditions)v.id&&!d.includes(v.id)&&u.removeRendition(v)});let n=c=>{let p=c.target.selectedIndex;p!=e.nextLevel&&(e.nextLevel=p)};(i=t.videoRenditions)==null||i.addEventListener("change",n);let s=()=>{for(let c of t.videoTracks)t.removeVideoTrack(c)},o=()=>{for(let c of t.audioTracks)t.removeAudioTrack(c)},l=()=>{s(),o()};e.once(q.Events.DESTROYING,()=>{var c,p;l(),(c=t.audioTracks)==null||c.removeEventListener("change",r),(p=t.videoRenditions)==null||p.removeEventListener("change",n)})}var Fl=t=>"time"in t?t.time:t.startTime;function tg(t,e){e.on(q.Events.NON_NATIVE_TEXT_TRACKS_FOUND,(r,{tracks:n})=>{n.forEach(s=>{var o,l;let c=(o=s.subtitleTrack)!=null?o:s.closedCaptions,p=e.subtitleTracks.findIndex(({lang:u,name:d,type:v})=>u==(c==null?void 0:c.lang)&&d===s.label&&v.toLowerCase()===s.kind),m=((l=s._id)!=null?l:s.default)?"default":`${s.kind}${p}`;Mu(t,s.kind,s.label,c==null?void 0:c.lang,m,s.default)})});let i=()=>{if(!e.subtitleTracks.length)return;let r=Array.from(t.textTracks).find(o=>o.id&&o.mode==="showing"&&["subtitles","captions"].includes(o.kind));if(!r)return;let n=e.subtitleTracks[e.subtitleTrack],s=n?n.default?"default":`${e.subtitleTracks[e.subtitleTrack].type.toLowerCase()}${e.subtitleTrack}`:void 0;if(e.subtitleTrack<0||(r==null?void 0:r.id)!==s){let o=e.subtitleTracks.findIndex(({lang:l,name:c,type:p,default:m})=>r.id==="default"&&m||l==r.language&&c===r.label&&p.toLowerCase()===r.kind);e.subtitleTrack=o}(r==null?void 0:r.id)===s&&r.cues&&Array.from(r.cues).forEach(o=>{r.addCue(o)})};t.textTracks.addEventListener("change",i),e.on(q.Events.CUES_PARSED,(r,{track:n,cues:s})=>{let o=t.textTracks.getTrackById(n);if(!o)return;let l=o.mode==="disabled";l&&(o.mode="hidden"),s.forEach(c=>{var p;(p=o.cues)!=null&&p.getCueById(c.id)||o.addCue(c)}),l&&(o.mode="disabled")}),e.once(q.Events.DESTROYING,()=>{t.textTracks.removeEventListener("change",i),t.querySelectorAll("track[data-removeondestroy]").forEach(r=>{r.remove()})});let a=()=>{Array.from(t.textTracks).forEach(r=>{var n,s;if(!["subtitles","caption"].includes(r.kind)&&(r.label==="thumbnails"||r.kind==="chapters")){if(!((n=r.cues)!=null&&n.length)){let o="track";r.kind&&(o+=`[kind="${r.kind}"]`),r.label&&(o+=`[label="${r.label}"]`);let l=t.querySelector(o),c=(s=l==null?void 0:l.getAttribute("src"))!=null?s:"";l==null||l.removeAttribute("src"),setTimeout(()=>{l==null||l.setAttribute("src",c)},0)}r.mode!=="hidden"&&(r.mode="hidden")}})};e.once(q.Events.MANIFEST_LOADED,a),e.once(q.Events.MEDIA_ATTACHED,a)}function Mu(t,e,i,a,r,n){let s=document.createElement("track");return s.kind=e,s.label=i,a&&(s.srclang=a),r&&(s.id=r),n&&(s.default=!0),s.track.mode=["subtitles","captions"].includes(e)?"disabled":"hidden",s.setAttribute("data-removeondestroy",""),t.append(s),s.track}function ig(t,e){let i=Array.prototype.find.call(t.querySelectorAll("track"),a=>a.track===e);i==null||i.remove()}function jn(t,e,i){var a;return(a=Array.from(t.querySelectorAll("track")).find(r=>r.track.label===e&&r.track.kind===i))==null?void 0:a.track}async function bp(t,e,i,a){let r=jn(t,i,a);return r||(r=Mu(t,a,i),r.mode="hidden",await new Promise(n=>setTimeout(()=>n(void 0),0))),r.mode!=="hidden"&&(r.mode="hidden"),[...e].sort((n,s)=>Fl(s)-Fl(n)).forEach(n=>{var s,o;let l=n.value,c=Fl(n);if("endTime"in n&&n.endTime!=null)r==null||r.addCue(new VTTCue(c,n.endTime,a==="chapters"?l:JSON.stringify(l??null)));else{let p=Array.prototype.findIndex.call(r==null?void 0:r.cues,v=>v.startTime>=c),m=(s=r==null?void 0:r.cues)==null?void 0:s[p],u=m?m.startTime:Number.isFinite(t.duration)?t.duration:Number.MAX_SAFE_INTEGER,d=(o=r==null?void 0:r.cues)==null?void 0:o[p-1];d&&(d.endTime=c),r==null||r.addCue(new VTTCue(c,u,a==="chapters"?l:JSON.stringify(l??null)))}}),t.textTracks.dispatchEvent(new Event("change",{bubbles:!0,composed:!0})),r}var xu="cuepoints",gp=Object.freeze({label:xu});async function yp(t,e,i=gp){return bp(t,e,i.label,"metadata")}var ud=t=>({time:t.startTime,value:JSON.parse(t.text)});function ag(t,e={label:xu}){let i=jn(t,e.label,"metadata");return i!=null&&i.cues?Array.from(i.cues,a=>ud(a)):[]}function Tp(t,e={label:xu}){var i,a;let r=jn(t,e.label,"metadata");if(!((i=r==null?void 0:r.activeCues)!=null&&i.length))return;if(r.activeCues.length===1)return ud(r.activeCues[0]);let{currentTime:n}=t,s=Array.prototype.find.call((a=r.activeCues)!=null?a:[],({startTime:o,endTime:l})=>o<=n&&l>n);return ud(s||r.activeCues[0])}async function rg(t,e=gp){return new Promise(i=>{Ie(t,"loadstart",async()=>{let a=await yp(t,[],e);Ie(t,"cuechange",()=>{let r=Tp(t);if(r){let n=new CustomEvent("cuepointchange",{composed:!0,bubbles:!0,detail:r});t.dispatchEvent(n)}},{},a),i(a)})})}var Ou="chapters",Ap=Object.freeze({label:Ou}),cd=t=>({startTime:t.startTime,endTime:t.endTime,value:t.text});async function kp(t,e,i=Ap){return bp(t,e,i.label,"chapters")}function ng(t,e={label:Ou}){var i;let a=jn(t,e.label,"chapters");return(i=a==null?void 0:a.cues)!=null&&i.length?Array.from(a.cues,r=>cd(r)):[]}function wp(t,e={label:Ou}){var i,a;let r=jn(t,e.label,"chapters");if(!((i=r==null?void 0:r.activeCues)!=null&&i.length))return;if(r.activeCues.length===1)return cd(r.activeCues[0]);let{currentTime:n}=t,s=Array.prototype.find.call((a=r.activeCues)!=null?a:[],({startTime:o,endTime:l})=>o<=n&&l>n);return cd(s||r.activeCues[0])}async function sg(t,e=Ap){return new Promise(i=>{Ie(t,"loadstart",async()=>{let a=await kp(t,[],e);Ie(t,"cuechange",()=>{let r=wp(t);if(r){let n=new CustomEvent("chapterchange",{composed:!0,bubbles:!0,detail:r});t.dispatchEvent(n)}},{},a),i(a)})})}function og(t,e){if(e){let i=e.playingDate;if(i!=null)return new Date(i.getTime()-t.currentTime*1e3)}return typeof t.getStartDate=="function"?t.getStartDate():new Date(NaN)}function lg(t,e){if(e&&e.playingDate)return e.playingDate;if(typeof t.getStartDate=="function"){let i=t.getStartDate();return new Date(i.getTime()+t.currentTime*1e3)}return new Date(NaN)}var yn={VIDEO:"v",THUMBNAIL:"t",STORYBOARD:"s",DRM:"d"},dg=t=>{if(t===ee.VIDEO)return yn.VIDEO;if(t===ee.DRM)return yn.DRM},ug=(t,e)=>{var i,a;let r=ml(t),n=`${r}Token`;return(i=e.tokens)!=null&&i[r]?(a=e.tokens)==null?void 0:a[r]:Cu(n,e)?e[n]:void 0},Po=(t,e,i,a,r=!1,n=!(s=>(s=globalThis.navigator)==null?void 0:s.onLine)())=>{var s,o;if(n){let E=O("Your device appears to be offline",r),T,_=L.MEDIA_ERR_NETWORK,w=new L(E,_,!1,T);return w.errorCategory=e,w.muxCode=N.NETWORK_OFFLINE,w.data=t,w}let l="status"in t?t.status:t.code,c=Date.now(),p=L.MEDIA_ERR_NETWORK;if(l===200)return;let m=ml(e),u=ug(e,i),d=dg(e),[v]=Du((s=i.playbackId)!=null?s:"");if(!l||!v)return;let f=cr(u);if(u&&!f){let E=O("The {tokenNamePrefix}-token provided is invalid or malformed.",r).format({tokenNamePrefix:m}),T=O("Compact JWT string: {token}",r).format({token:u}),_=new L(E,p,!0,T);return _.errorCategory=e,_.muxCode=N.NETWORK_TOKEN_MALFORMED,_.data=t,_}if(l>=500){let E=new L("",p,a??!0);return E.errorCategory=e,E.muxCode=N.NETWORK_UNKNOWN_ERROR,E}if(l===403)if(f){if(Yb(f,c)){let E={timeStyle:"medium",dateStyle:"medium"},T=O("The video’s secured {tokenNamePrefix}-token has expired.",r).format({tokenNamePrefix:m}),_=O("Expired at: {expiredDate}. Current time: {currentDate}.",r).format({expiredDate:new Intl.DateTimeFormat("en",E).format((o=f.exp)!=null?o:0*1e3),currentDate:new Intl.DateTimeFormat("en",E).format(c)}),w=new L(T,p,!0,_);return w.errorCategory=e,w.muxCode=N.NETWORK_TOKEN_EXPIRED,w.data=t,w}if(Gb(f,v)){let E=O("The video’s playback ID does not match the one encoded in the {tokenNamePrefix}-token.",r).format({tokenNamePrefix:m}),T=O("Specified playback ID: {playbackId} and the playback ID encoded in the {tokenNamePrefix}-token: {tokenPlaybackId}",r).format({tokenNamePrefix:m,playbackId:v,tokenPlaybackId:f.sub}),_=new L(E,p,!0,T);return _.errorCategory=e,_.muxCode=N.NETWORK_TOKEN_SUB_MISMATCH,_.data=t,_}if(zb(f)){let E=O("The {tokenNamePrefix}-token is formatted with incorrect information.",r).format({tokenNamePrefix:m}),T=O("The {tokenNamePrefix}-token has no aud value. aud value should be {expectedAud}.",r).format({tokenNamePrefix:m,expectedAud:d}),_=new L(E,p,!0,T);return _.errorCategory=e,_.muxCode=N.NETWORK_TOKEN_AUD_MISSING,_.data=t,_}if(Qb(f,d)){let E=O("The {tokenNamePrefix}-token is formatted with incorrect information.",r).format({tokenNamePrefix:m}),T=O("The {tokenNamePrefix}-token has an incorrect aud value: {aud}. aud value should be {expectedAud}.",r).format({tokenNamePrefix:m,expectedAud:d,aud:f.aud}),_=new L(E,p,!0,T);return _.errorCategory=e,_.muxCode=N.NETWORK_TOKEN_AUD_MISMATCH,_.data=t,_}}else{let E=O("Authorization error trying to access this {category} URL. If this is a signed URL, you might need to provide a {tokenNamePrefix}-token.",r).format({tokenNamePrefix:m,category:e}),T=O("Specified playback ID: {playbackId}",r).format({playbackId:v}),_=new L(E,p,a??!0,T);return _.errorCategory=e,_.muxCode=N.NETWORK_TOKEN_MISSING,_.data=t,_}if(l===412){let E=O("This playback-id may belong to a live stream that is not currently active or an asset that is not ready.",r),T=O("Specified playback ID: {playbackId}",r).format({playbackId:v}),_=new L(E,p,a??!0,T);return _.errorCategory=e,_.muxCode=N.NETWORK_NOT_READY,_.streamType=i.streamType===J.LIVE?"live":i.streamType===J.ON_DEMAND?"on-demand":"unknown",_.data=t,_}if(l===404){let E=O("This URL or playback-id does not exist. You may have used an Asset ID or an ID from a different resource.",r),T=O("Specified playback ID: {playbackId}",r).format({playbackId:v}),_=new L(E,p,a??!0,T);return _.errorCategory=e,_.muxCode=N.NETWORK_NOT_FOUND,_.data=t,_}if(l===400){let E=O("The URL or playback-id was invalid. You may have used an invalid value as a playback-id."),T=O("Specified playback ID: {playbackId}",r).format({playbackId:v}),_=new L(E,p,a??!0,T);return _.errorCategory=e,_.muxCode=N.NETWORK_INVALID_URL,_.data=t,_}let b=new L("",p,a??!0);return b.errorCategory=e,b.muxCode=N.NETWORK_UNKNOWN_ERROR,b.data=t,b},kh=q.DefaultConfig.capLevelController,cg={"720p":921600,"1080p":2073600,"1440p":4194304,"2160p":8294400};function hg(t){let e=t.toLowerCase().trim();return cg[e]}var hd=class zr extends kh{constructor(e){super(e)}static setMaxAutoResolution(e,i){i?zr.maxAutoResolution.set(e,i):zr.maxAutoResolution.delete(e)}getMaxAutoResolution(){var e;let i=this.hls;return(e=zr.maxAutoResolution.get(i))!=null?e:void 0}get levels(){var e;return(e=this.hls.levels)!=null?e:[]}getValidLevels(e){return this.levels.filter((i,a)=>this.isLevelAllowed(i)&&a<=e)}getMaxLevelCapped(e){let i=this.getValidLevels(e),a=this.getMaxAutoResolution();if(!a)return super.getMaxLevel(e);let r=hg(a);if(!r)return super.getMaxLevel(e);let n=i.filter(l=>l.width*l.height<=r),s=n.findIndex(l=>l.width*l.height===r);if(s!==-1){let l=n[s];return i.findIndex(c=>c===l)}if(n.length===0)return 0;let o=n[n.length-1];return i.findIndex(l=>l===o)}getMaxLevel(e){if(this.getMaxAutoResolution()!==void 0)return this.getMaxLevelCapped(e);let i=super.getMaxLevel(e),a=this.getValidLevels(e);if(!a[i])return i;let r=Math.min(a[i].width,a[i].height),n=zr.minMaxResolution;return r>=n?i:kh.getMaxLevelByMediaSize(a,n*(16/9),n)}};hd.minMaxResolution=720,hd.maxAutoResolution=new WeakMap;var mg=hd,md=mg,pg="com.apple.fps.1_0",vg="application/vnd.apple.mpegurl",fg=({mediaEl:t,getAppCertificate:e,getLicenseKey:i,saveAndDispatchError:a,drmTypeCb:r})=>{if(!window.WebKitMediaKeys||!("onwebkitneedkey"in t)){console.error("No WebKitMediaKeys. FairPlay may not be supported");let u=O("Cannot play DRM-protected content with current security configuration on this browser. Try playing in another browser."),d=new L(u,L.MEDIA_ERR_ENCRYPTED,!0);return d.errorCategory=ee.DRM,d.muxCode=N.ENCRYPTED_CDM_ERROR,a(t,d),()=>{}}let n=t,s=e(),o=null,l=u=>{(async()=>{try{n.webkitKeys||c();let d=await s;if(u.initData===null||d==null)return;let v=Eg(u.initData,d);p(v)}catch(d){console.error("Could not start encrypted playback due to exception",d),a(n,d)}})()},c=()=>{try{let u=new WebKitMediaKeys(pg);n.webkitSetMediaKeys(u),r()}catch{let u="Cannot play DRM-protected content with current security configuration on this browser. Try playing in another browser.",d=new L(u,L.MEDIA_ERR_ENCRYPTED,!0);throw d.errorCategory=ee.DRM,d.muxCode=N.ENCRYPTED_UNSUPPORTED_KEY_SYSTEM,d}},p=u=>{let d=n.webkitKeys.createSession(vg,u),v=async E=>{try{let T=E.message,_=await i(T);d.update(_)}catch(T){console.error("Error on FairPlay session message",T),a(t,T)}},f=E=>{let T=E.target.error;if(!T)return;console.error(`Internal Webkit Key Session Error - sysCode: ${T.systemCode} code: ${T.code}`);let _=O("The DRM Content Decryption Module system had an internal failure. Try reloading the page, upading your browser, or playing in another browser."),w=new L(_,L.MEDIA_ERR_ENCRYPTED,!0);w.errorCategory=ee.DRM,w.muxCode=N.ENCRYPTED_CDM_ERROR,a(t,w)},b=()=>{d.removeEventListener("webkitkeymessage",v),d.removeEventListener("webkitkeyerror",f),t.removeEventListener("teardown",b),"webkitCurrentPlaybackTargetIsWireless"in t&&t.removeEventListener("webkitcurrentplaybacktargetiswirelesschanged",b),o=null;try{d.close()}catch{}};"webkitCurrentPlaybackTargetIsWireless"in t&&t.addEventListener("webkitcurrentplaybacktargetiswirelesschanged",b,{once:!0}),d.addEventListener("webkitkeymessage",v),d.addEventListener("webkitkeyerror",f),t.addEventListener("teardown",b),o=b},m=()=>{t.removeEventListener("webkitneedkey",l),t.removeEventListener("teardown",m),o==null||o();try{n.webkitSetMediaKeys(null)}catch{}};return t.addEventListener("webkitneedkey",l),t.addEventListener("teardown",m,{once:!0}),m},Eg=(t,e)=>{let i=bg(_g(t)),a=new Uint8Array(t),r=new Uint8Array(i),n=new Uint8Array(e),s=a.byteLength+4+n.byteLength+4+r.byteLength,o=new Uint8Array(s),l=0,c=m=>{o.set(m,l),l+=m.byteLength},p=m=>{let u=new DataView(o.buffer),d=m.byteLength;u.setUint32(l,d,!0),l+=4,c(m)};return c(a),p(r),p(n),o},_g=t=>new TextDecoder("utf-16le").decode(t).replace("skd://","").slice(1);function bg(t){let e=new ArrayBuffer(t.length*2),i=new DataView(e);for(let a=0;a<t.length;a++)i.setUint16(a*2,t.charCodeAt(a),!0);return e}var gg=({mediaEl:t,getAppCertificate:e,getLicenseKey:i,saveAndDispatchError:a,drmTypeCb:r,fallbackToWebkitFairplay:n})=>{let s=null,o=async m=>{try{let u=m.initDataType;if(u!=="skd"){console.error(`Received unexpected initialization data type "${u}"`);return}t.mediaKeys||await l(u);let d=m.initData;if(d==null){console.error(`Could not start encrypted playback due to missing initData in ${m.type} event`);return}await c(u,d)}catch(u){a(t,u);return}},l=async m=>{let u=await navigator.requestMediaKeySystemAccess("com.apple.fps",[{initDataTypes:[m],videoCapabilities:[{contentType:"application/vnd.apple.mpegurl",robustness:""}],distinctiveIdentifier:"not-allowed",persistentState:"not-allowed",sessionTypes:["temporary"]}]).then(v=>(r(),v)).catch(()=>{let v=O("Cannot play DRM-protected content with current security configuration on this browser. Try playing in another browser."),f=new L(v,L.MEDIA_ERR_ENCRYPTED,!0);f.errorCategory=ee.DRM,f.muxCode=N.ENCRYPTED_UNSUPPORTED_KEY_SYSTEM,a(t,f)});if(!u)return;let d=await u.createMediaKeys();try{let v=await e();await d.setServerCertificate(v).catch(()=>{let f=O("Your server certificate failed when attempting to set it. This may be an issue with a no longer valid certificate."),b=new L(f,L.MEDIA_ERR_ENCRYPTED,!0);return b.errorCategory=ee.DRM,b.muxCode=N.ENCRYPTED_UPDATE_SERVER_CERT_FAILED,Promise.reject(b)})}catch(v){a(t,v);return}await t.setMediaKeys(d)},c=async(m,u)=>{let d=t.mediaKeys.createSession(),v=async E=>{let T=E.message,_=await i(T);try{await d.update(_)}catch{let w=O("Failed to update DRM license. This may be an issue with the player or your protected content."),R=new L(w,L.MEDIA_ERR_ENCRYPTED,!0);R.errorCategory=ee.DRM,R.muxCode=N.ENCRYPTED_UPDATE_LICENSE_FAILED,a(t,R)}},f=()=>{let E=T=>{let _;if(T==="internal-error"){let w=O("The DRM Content Decryption Module system had an internal failure. Try reloading the page, upading your browser, or playing in another browser.");_=new L(w,L.MEDIA_ERR_ENCRYPTED,!0),_.errorCategory=ee.DRM,_.muxCode=N.ENCRYPTED_CDM_ERROR}else if(T==="output-restricted"||T==="output-downscaled"){let w=O("DRM playback is being attempted in an environment that is not sufficiently secure. User may see black screen.");_=new L(w,L.MEDIA_ERR_ENCRYPTED,!1),_.errorCategory=ee.DRM,_.muxCode=N.ENCRYPTED_OUTPUT_RESTRICTED}_&&a(t,_)};d.keyStatuses.forEach(T=>E(T))};d.addEventListener("keystatuseschange",f),d.addEventListener("message",v);let b=async()=>{d.removeEventListener("keystatuseschange",f),d.removeEventListener("message",v),"webkitCurrentPlaybackTargetIsWireless"in t&&t.removeEventListener("webkitcurrentplaybacktargetiswirelesschanged",b),t.removeEventListener("teardown",b),await d.close().catch(E=>{console.warn("There was an error when closing EME session",E)}),s=null};"webkitCurrentPlaybackTargetIsWireless"in t&&t.addEventListener("webkitcurrentplaybacktargetiswirelesschanged",b,{once:!0}),t.addEventListener("teardown",b,{once:!0}),s=b,await d.generateRequest(m,u).catch(async E=>{if(E.name==="NotSupportedError"&&"webkitCurrentPlaybackTargetIsWireless"in t&&t.webkitCurrentPlaybackTargetIsWireless)console.warn("Failed to generate a DRM license request. Attempting to fallback to Webkit DRM"),n==null||n();else{let T=O("Failed to generate a DRM license request. This may be an issue with the player or your protected content."),_=new L(T,L.MEDIA_ERR_ENCRYPTED,!0);return _.errorCategory=ee.DRM,_.muxCode=N.ENCRYPTED_GENERATE_REQUEST_FAILED,console.error("Failed to generate license request",E),Promise.reject(_)}})},p=async()=>{t.removeEventListener("encrypted",o),t.removeEventListener("teardown",p),s&&await s(),await t.setMediaKeys(null).catch(()=>{})};return t.addEventListener("encrypted",o),t.addEventListener("teardown",p,{once:!0}),p},ys={FAIRPLAY:"fairplay",PLAYREADY:"playready",WIDEVINE:"widevine"},yg=t=>{if(t.includes("fps"))return ys.FAIRPLAY;if(t.includes("playready"))return ys.PLAYREADY;if(t.includes("widevine"))return ys.WIDEVINE},Tg=t=>{let e=t.split(`
`).find((i,a,r)=>a&&r[a-1].startsWith("#EXT-X-STREAM-INF"));return fetch(e).then(i=>i.status!==200?Promise.reject(i):i.text())},Ag=t=>{let e=t.split(`
`).filter(a=>a.startsWith("#EXT-X-SESSION-DATA"));if(!e.length)return{};let i={};for(let a of e){let r=wg(a),n=r["DATA-ID"];n&&(i[n]={...r})}return{sessionData:i}},kg=/([A-Z0-9-]+)="?(.*?)"?(?:,|$)/g;function wg(t){let e=[...t.matchAll(kg)];return Object.fromEntries(e.map(([,i,a])=>[i,a]))}var Sg=t=>{var e,i,a;let r=t.split(`
`),n=(i=((e=r.find(c=>c.startsWith("#EXT-X-PLAYLIST-TYPE")))!=null?e:"").split(":")[1])==null?void 0:i.trim(),s=fp(n),o=Ep(n),l;if(s===J.LIVE){let c=r.find(p=>p.startsWith("#EXT-X-PART-INF"));if(c)l=+c.split(":")[1].split("=")[1]*2;else{let p=r.find(u=>u.startsWith("#EXT-X-TARGETDURATION")),m=(a=p==null?void 0:p.split(":"))==null?void 0:a[1];l=+(m??6)*3}}return{streamType:s,targetLiveWindow:o,liveEdgeStartOffset:l}},Ig=async(t,e)=>{if(e===_i.MP4)return{streamType:J.ON_DEMAND,targetLiveWindow:Number.NaN,liveEdgeStartOffset:void 0,sessionData:void 0};if(e===_i.M3U8){let i=await fetch(t);if(!i.ok)return Promise.reject(i);let a=await i.text(),r=await Tg(a);return{...Ag(a),...Sg(r)}}return console.error(`Media type ${e} is an unrecognized or unsupported type for src ${t}.`),{streamType:void 0,targetLiveWindow:void 0,liveEdgeStartOffset:void 0,sessionData:void 0}},Rg=async(t,e,i=pl({src:t}))=>{var a,r,n,s;let{streamType:o,targetLiveWindow:l,liveEdgeStartOffset:c,sessionData:p}=await Ig(t,i),m=p==null?void 0:p["com.apple.hls.chapters"];(m!=null&&m.URI||m!=null&&m.VALUE.toLocaleLowerCase().startsWith("http"))&&Nu((a=m.URI)!=null?a:m.VALUE,e),((r=ue.get(e))!=null?r:{}).liveEdgeStartOffset=c,((n=ue.get(e))!=null?n:{}).targetLiveWindow=l,e.dispatchEvent(new CustomEvent("targetlivewindowchange",{composed:!0,bubbles:!0})),((s=ue.get(e))!=null?s:{}).streamType=o,e.dispatchEvent(new CustomEvent("streamtypechange",{composed:!0,bubbles:!0}))},Nu=async(t,e)=>{var i,a;try{let r=await fetch(t);if(!r.ok)throw new Error(`Failed to fetch Mux metadata: ${r.status} ${r.statusText}`);let n=await r.json(),s={};if(!((i=n==null?void 0:n[0])!=null&&i.metadata))return;for(let l of n[0].metadata)l.key&&l.value&&(s[l.key]=l.value);((a=ue.get(e))!=null?a:{}).metadata=s;let o=new CustomEvent("muxmetadata");e.dispatchEvent(o)}catch(r){console.error(r)}},Lg=t=>{var e;let i=t.type,a=fp(i),r=Ep(i),n,s=!!((e=t.partList)!=null&&e.length);return a===J.LIVE&&(n=s?t.partTarget*2:t.targetduration*3),{streamType:a,targetLiveWindow:r,liveEdgeStartOffset:n,lowLatency:s}},Cg=(t,e,i)=>{var a,r,n,s,o,l,c,p;let{streamType:m,targetLiveWindow:u,liveEdgeStartOffset:d,lowLatency:v}=Lg(t);if(m===J.LIVE){v?(i.config.backBufferLength=(a=i.userConfig.backBufferLength)!=null?a:4,i.config.maxFragLookUpTolerance=(r=i.userConfig.maxFragLookUpTolerance)!=null?r:.001,i.config.abrBandWidthUpFactor=(n=i.userConfig.abrBandWidthUpFactor)!=null?n:i.config.abrBandWidthFactor):i.config.backBufferLength=(s=i.userConfig.backBufferLength)!=null?s:8;let f=Object.freeze({get length(){return e.seekable.length},start(b){return e.seekable.start(b)},end(b){var E;return b>this.length||b<0||Number.isFinite(e.duration)?e.seekable.end(b):(E=i.liveSyncPosition)!=null?E:e.seekable.end(b)}});((o=ue.get(e))!=null?o:{}).seekable=f}((l=ue.get(e))!=null?l:{}).liveEdgeStartOffset=d,((c=ue.get(e))!=null?c:{}).targetLiveWindow=u,e.dispatchEvent(new CustomEvent("targetlivewindowchange",{composed:!0,bubbles:!0})),((p=ue.get(e))!=null?p:{}).streamType=m,e.dispatchEvent(new CustomEvent("streamtypechange",{composed:!0,bubbles:!0}))},wh,Sh,Sp=(Sh=(wh=globalThis==null?void 0:globalThis.navigator)==null?void 0:wh.userAgent)!=null?Sh:"",Ih,Rh,Lh,Dg=(Lh=(Rh=(Ih=globalThis==null?void 0:globalThis.navigator)==null?void 0:Ih.userAgentData)==null?void 0:Rh.platform)!=null?Lh:"",Mg=Sp.toLowerCase().includes("android")||["x11","android"].some(t=>Dg.toLowerCase().includes(t)),xg=t=>/^((?!chrome|android).)*safari/i.test(Sp)&&!!t.canPlayType("application/vnd.apple.mpegurl"),ue=new WeakMap,bi="mux.com",Ch,Dh,Ip=(Dh=(Ch=q).isSupported)==null?void 0:Dh.call(Ch),Og=t=>Mg||!xg(t),Pu=()=>{if(typeof window<"u")return Lu.utils.now()},Ng=Lu.utils.generateUUID,pd=({playbackId:t,customDomain:e=bi,maxResolution:i,minResolution:a,renditionOrder:r,programStartTime:n,programEndTime:s,assetStartTime:o,assetEndTime:l,playbackToken:c,tokens:{playback:p=c}={},extraSourceParams:m={}}={})=>{if(!t)return;let[u,d=""]=Du(t),v=new URL(`https://stream.${e}/${u}.m3u8${d}`);return p||v.searchParams.has("token")?(v.searchParams.forEach((f,b)=>{b!="token"&&v.searchParams.delete(b)}),p&&v.searchParams.set("token",p)):(i&&v.searchParams.set("max_resolution",i),a&&(v.searchParams.set("min_resolution",a),i&&+i.slice(0,-1)<+a.slice(0,-1)&&console.error("minResolution must be <= maxResolution","minResolution",a,"maxResolution",i)),r&&v.searchParams.set("rendition_order",r),n&&v.searchParams.set("program_start_time",`${n}`),s&&v.searchParams.set("program_end_time",`${s}`),o&&v.searchParams.set("asset_start_time",`${o}`),l&&v.searchParams.set("asset_end_time",`${l}`),Object.entries(m).forEach(([f,b])=>{b!=null&&v.searchParams.set(f,b)})),v.toString()},vl=t=>{if(!t)return;let[e]=t.split("?");return e||void 0},$u=t=>{if(!t||!t.startsWith("https://stream."))return;let[e]=new URL(t).pathname.slice(1).split(/\.m3u8|\//);return e||void 0},Pg=t=>{var e,i,a;return(e=t==null?void 0:t.metadata)!=null&&e.video_id?t.metadata.video_id:Pp(t)&&(a=(i=vl(t.playbackId))!=null?i:$u(t.src))!=null?a:t.src},Rp=t=>{var e;return(e=ue.get(t))==null?void 0:e.error},$g=t=>{var e;return(e=ue.get(t))==null?void 0:e.metadata},vd=t=>{var e,i;return(i=(e=ue.get(t))==null?void 0:e.streamType)!=null?i:J.UNKNOWN},Ug=t=>{var e,i;return(i=(e=ue.get(t))==null?void 0:e.targetLiveWindow)!=null?i:Number.NaN},Uu=t=>{var e,i;return(i=(e=ue.get(t))==null?void 0:e.seekable)!=null?i:t.seekable},Hg=t=>{var e;let i=(e=ue.get(t))==null?void 0:e.liveEdgeStartOffset;if(typeof i!="number")return Number.NaN;let a=Uu(t);return a.length?a.end(a.length-1)-i:Number.NaN},Bg=t=>{var e;return(e=ue.get(t))==null?void 0:e.coreReference},Hu=.034,Wg=(t,e,i=Hu)=>Math.abs(t-e)<=i,Lp=(t,e,i=Hu)=>t>e||Wg(t,e,i),Fg=(t,e=Hu)=>t.paused&&Lp(t.currentTime,t.duration,e),Cp=(t,e)=>{var i,a,r;if(!e||!t.buffered.length)return;if(t.readyState>2)return!1;let n=e.currentLevel>=0?(a=(i=e.levels)==null?void 0:i[e.currentLevel])==null?void 0:a.details:(r=e.levels.find(m=>!!m.details))==null?void 0:r.details;if(!n||n.live)return;let{fragments:s}=n;if(!(s!=null&&s.length))return;if(t.currentTime<t.duration-(n.targetduration+.5))return!1;let o=s[s.length-1];if(t.currentTime<=o.start)return!1;let l=o.start+o.duration/2,c=t.buffered.start(t.buffered.length-1),p=t.buffered.end(t.buffered.length-1);return l>c&&l<p},Dp=(t,e)=>t.ended||t.loop?t.ended:e&&Cp(t,e)?!0:Fg(t),Mp=(t,e,i)=>{xp(e,i,t);let{metadata:a={}}=t,{view_session_id:r=Ng()}=a,n=Pg(t);a.view_session_id=r,a.video_id=n,t.metadata=a;let s=u=>{var d;(d=e.mux)==null||d.emit("hb",{view_drm_type:u})};t.drmTypeCb=s,t.fallbackToWebkitFairplay=async()=>{var u;let d=!e.paused,v=e.currentTime;t.useWebkitFairplay=!0;let f=t.muxDataKeepSession;t.muxDataKeepSession=!0;let b=(u=ue.get(e))==null?void 0:u.coreReference;Mp(t,e,b),t.muxDataKeepSession=f,t.useWebkitFairplay=!1,d&&await e.play().then(()=>{e.currentTime=v}).catch(()=>{}),e.currentTime=v},ue.set(e,{retryCount:0});let o=Kg(t,e),l=Jb(t,e,o);t!=null&&t.muxDataKeepSession&&e!=null&&e.mux&&!e.mux.deleted?o&&e.mux.addHLSJS({hlsjs:o,Hls:o?q:void 0}):jg(t,e,o),Zg(t,e,o),rg(e),sg(e);let c=Xb(t,e,o),p={engine:o,setAutoplay:c,setPreload:l},m=ue.get(e);return m&&(m.coreReference=p),p},xp=(t,e,i)=>{let a=e==null?void 0:e.engine;t!=null&&t.mux&&!t.mux.deleted&&(i!=null&&i.muxDataKeepSession?a&&t.mux.removeHLSJS():(t.mux.destroy(),delete t.mux)),a&&(a.detachMedia(),a.destroy()),t&&(t.hasAttribute("src")&&(t.removeAttribute("src"),t.load()),t.removeEventListener("error",Up),t.removeEventListener("error",fd),t.removeEventListener("durationchange",$p),ue.delete(t),t.dispatchEvent(new Event("teardown")))};function Op(t,e){var i;let a=pl(t);if(a!==_i.M3U8)return!0;let r=!a||((i=e.canPlayType(a))!=null?i:!0),{preferPlayback:n}=t,s=n===ei.MSE,o=n===ei.NATIVE,l=Ip&&(s||Og(e));return r&&(o||!l)}var Kg=(t,e)=>{let{debug:i,streamType:a,startTime:r=-1,metadata:n,preferCmcd:s,_hlsConfig:o={},maxAutoResolution:l}=t,c=pl(t)===_i.M3U8,p=Op(t,e);if(c&&!p&&Ip){let m={backBufferLength:30,renderTextTracksNatively:!1,liveDurationInfinity:!0,capLevelOnFPSDrop:!0},u=Vg(a),d=qg(t),v=[Gr.QUERY,Gr.HEADER].includes(s)?{useHeaders:s===Gr.HEADER,sessionId:n==null?void 0:n.view_session_id,contentId:n==null?void 0:n.video_id}:void 0,f=Qg(t),b=new q({debug:i,startPosition:r,cmcd:v,xhrSetup:(E,T)=>{var _,w;if(s&&s!==Gr.QUERY)return;let R=new URL(T);if(!R.searchParams.has("CMCD"))return;let x=((w=(_=R.searchParams.get("CMCD"))==null?void 0:_.split(","))!=null?w:[]).filter(U=>U.startsWith("sid")||U.startsWith("cid")).join(",");R.searchParams.set("CMCD",x),E.open("GET",R)},...m,...f,...u,...d,...o});return f.capLevelController===md&&l!==void 0&&md.setMaxAutoResolution(b,l),b.on(q.Events.MANIFEST_PARSED,async function(E,T){var _,w;let R=(_=T.sessionData)==null?void 0:_["com.apple.hls.chapters"];(R!=null&&R.URI||R!=null&&R.VALUE.toLocaleLowerCase().startsWith("http"))&&Nu((w=R==null?void 0:R.URI)!=null?w:R==null?void 0:R.VALUE,e)}),b}},Vg=t=>t===J.LIVE?{backBufferLength:8}:{},qg=t=>{let{tokens:{drm:e}={},playbackId:i,drmTypeCb:a}=t,r=vl(i);return!e||!r?{}:{emeEnabled:!0,drmSystems:{"com.apple.fps":{licenseUrl:Ts(t,"fairplay"),serverCertificateUrl:Np(t,"fairplay")},"com.widevine.alpha":{licenseUrl:Ts(t,"widevine")},"com.microsoft.playready":{licenseUrl:Ts(t,"playready")}},requestMediaKeySystemAccessFunc:(n,s)=>(n==="com.widevine.alpha"&&(s=[...s.map(o=>{var l;let c=(l=o.videoCapabilities)==null?void 0:l.map(p=>({...p,robustness:"HW_SECURE_ALL"}));return{...o,videoCapabilities:c}}),...s]),navigator.requestMediaKeySystemAccess(n,s).then(o=>{let l=yg(n);return a==null||a(l),o}))}},Yg=async t=>{let e=await fetch(t);return e.status!==200?Promise.reject(e):await e.arrayBuffer()},Gg=async(t,e)=>{let i=await fetch(e,{method:"POST",headers:{"Content-type":"application/octet-stream"},body:t});if(i.status!==200)return Promise.reject(i);let a=await i.arrayBuffer();return new Uint8Array(a)},zg=(t,e)=>{let i={mediaEl:e,getAppCertificate:()=>Yg(Np(t,"fairplay")).catch(a=>{if(a instanceof Response){let r=Po(a,ee.DRM,t);return console.error("mediaError",r==null?void 0:r.message,r==null?void 0:r.context),r?Promise.reject(r):Promise.reject(new Error("Unexpected error in app cert request"))}return Promise.reject(a)}),getLicenseKey:a=>Gg(a,Ts(t,"fairplay")).catch(r=>{if(r instanceof Response){let n=Po(r,ee.DRM,t);return console.error("mediaError",n==null?void 0:n.message,n==null?void 0:n.context),n?Promise.reject(n):Promise.reject(new Error("Unexpected error in license key request"))}return Promise.reject(r)}),saveAndDispatchError:Hi,drmTypeCb:()=>{var a;(a=t.drmTypeCb)==null||a.call(t,ys.FAIRPLAY)}};if(t.useWebkitFairplay)fg(i);else{let a={fallbackToWebkitFairplay:async()=>{var n;await r(),(n=t.fallbackToWebkitFairplay)==null||n.call(t)},...i},r=gg(a)}},Ts=({playbackId:t,tokens:{drm:e}={},customDomain:i=bi},a)=>{let r=vl(t);return`https://license.${i.toLocaleLowerCase().endsWith(bi)?i:bi}/license/${a}/${r}?token=${e}`},Np=({playbackId:t,tokens:{drm:e}={},customDomain:i=bi},a)=>{let r=vl(t);return`https://license.${i.toLocaleLowerCase().endsWith(bi)?i:bi}/appcert/${a}/${r}?token=${e}`},Pp=({playbackId:t,src:e,customDomain:i})=>{if(t)return!0;if(typeof e!="string")return!1;let a=window==null?void 0:window.location.href,r=new URL(e,a).hostname.toLocaleLowerCase();return r.includes(bi)||!!i&&r.includes(i.toLocaleLowerCase())},Qg=(t,e)=>{let i={};return i.capLevelToPlayerSize=t.capRenditionToPlayerSize,i.capLevelToPlayerSize==null?(i.capLevelController=md,i.capLevelToPlayerSize=!0):i.capLevelController=pE,i},jg=(t,e,i)=>{var a;let{envKey:r,disableTracking:n,muxDataSDK:s=Lu,muxDataSDKOptions:o={}}=t,l=Pp(t);if(!n&&(r||l)){let{playerInitTime:c,playerSoftwareName:p,playerSoftwareVersion:m,beaconCollectionDomain:u,debug:d,disableCookies:v}=t,f={...t.metadata,video_title:((a=t==null?void 0:t.metadata)==null?void 0:a.video_title)||void 0},b=E=>typeof E.player_error_code=="string"?!1:typeof t.errorTranslator=="function"?t.errorTranslator(E):E;s.monitor(e,{debug:d,beaconCollectionDomain:u,hlsjs:i,Hls:i?q:void 0,automaticErrorTracking:!1,errorTranslator:b,disableCookies:v,...o,data:{...r?{env_key:r}:{},player_software_name:p,player_software:p,player_software_version:m,player_init_time:c,...f}})}},Zg=(t,e,i)=>{var a,r;let n=Op(t,e),{src:s,customDomain:o=bi}=t,l=()=>{e.ended||t.disablePseudoEnded||!Dp(e,i)||(Cp(e,i)?e.currentTime=e.buffered.end(e.buffered.length-1):e.dispatchEvent(new Event("ended")))},c,p,m=()=>{let u=Uu(e),d,v;u.length>0&&(d=u.start(0),v=u.end(0)),(p!==v||c!==d)&&e.dispatchEvent(new CustomEvent("seekablechange",{composed:!0})),c=d,p=v};if(Ie(e,"durationchange",m),e&&n){let u=pl(t);if(typeof s=="string"){if(s.endsWith(".mp4")&&s.includes(o)){let f=$u(s),b=new URL(`https://stream.${o}/${f}/metadata.json`);Nu(b.toString(),e)}let d=()=>{if(vd(e)!==J.LIVE||Number.isFinite(e.duration))return;let f=setInterval(m,1e3);e.addEventListener("teardown",()=>{clearInterval(f)},{once:!0}),Ie(e,"durationchange",()=>{Number.isFinite(e.duration)&&clearInterval(f)})},v=async()=>Rg(s,e,u).then(d).catch(f=>{if(f instanceof Response){let b=Po(f,ee.VIDEO,t);if(b){Hi(e,b);return}}});if(e.preload==="none"){let f=()=>{v(),e.removeEventListener("loadedmetadata",b)},b=()=>{v(),e.removeEventListener("play",f)};Ie(e,"play",f,{once:!0}),Ie(e,"loadedmetadata",b,{once:!0})}else v();(a=t.tokens)!=null&&a.drm?zg(t,e):Ie(e,"encrypted",()=>{let f=O("Attempting to play DRM-protected content without providing a DRM token."),b=new L(f,L.MEDIA_ERR_ENCRYPTED,!0);b.errorCategory=ee.DRM,b.muxCode=N.ENCRYPTED_MISSING_TOKEN,Hi(e,b)},{once:!0}),e.setAttribute("src",s),t.startTime&&(((r=ue.get(e))!=null?r:{}).startTime=t.startTime,e.addEventListener("durationchange",$p,{once:!0}))}else e.removeAttribute("src");e.addEventListener("error",Up),e.addEventListener("error",fd),e.addEventListener("emptied",()=>{e.querySelectorAll("track[data-removeondestroy]").forEach(d=>{d.remove()})},{once:!0}),Ie(e,"pause",l),Ie(e,"seeked",l),Ie(e,"play",()=>{e.ended||Lp(e.currentTime,e.duration)&&(e.currentTime=e.seekable.length?e.seekable.start(0):0)})}else i&&s?(i.once(q.Events.LEVEL_LOADED,(u,d)=>{Cg(d.details,e,i),m(),vd(e)===J.LIVE&&!Number.isFinite(e.duration)&&(i.on(q.Events.LEVEL_UPDATED,m),Ie(e,"durationchange",()=>{Number.isFinite(e.duration)&&i.off(q.Events.LEVELS_UPDATED,m)}))}),i.on(q.Events.ERROR,(u,d)=>{var v,f;let b=Xg(d,t);if(b.muxCode===N.NETWORK_NOT_READY){let E=(v=ue.get(e))!=null?v:{},T=(f=E.retryCount)!=null?f:0;if(T<6){let _=T===0?5e3:6e4,w=new L(`Retrying in ${_/1e3} seconds...`,b.code,b.fatal);Object.assign(w,b),Hi(e,w);let R=setTimeout(()=>{E.retryCount=T+1,d.details==="manifestLoadError"&&d.url&&i.loadSource(d.url)},_);e.addEventListener("teardown",()=>clearTimeout(R),{once:!0});return}else{E.retryCount=0;let _=new L('Try again later or <a href="#" onclick="window.location.reload(); return false;" style="color: #4a90e2;">click here to retry</a>',b.code,b.fatal);Object.assign(_,b),Hi(e,_);return}}Hi(e,b)}),i.on(q.Events.MANIFEST_LOADED,()=>{let u=ue.get(e);u&&u.error&&(u.error=null,u.retryCount=0,e.dispatchEvent(new Event("emptied")),e.dispatchEvent(new Event("loadstart")))}),e.addEventListener("error",fd),Ie(e,"waiting",l),eg(t,i),tg(e,i),i.attachMedia(e)):console.error("It looks like the video you're trying to play will not work on this system! If possible, try upgrading to the newest versions of your browser or software.")};function $p(t){var e;let i=t.target,a=(e=ue.get(i))==null?void 0:e.startTime;if(a&&Fb(i.seekable,i.duration,a)){let r=i.preload==="auto";r&&(i.preload="none"),i.currentTime=a,r&&(i.preload="auto")}}async function Up(t){if(!t.isTrusted)return;t.stopImmediatePropagation();let e=t.target;if(!(e!=null&&e.error))return;let{message:i,code:a}=e.error,r=new L(i,a);if(e.src&&a===L.MEDIA_ERR_SRC_NOT_SUPPORTED&&e.readyState===HTMLMediaElement.HAVE_NOTHING){setTimeout(()=>{var n;let s=(n=Rp(e))!=null?n:e.error;(s==null?void 0:s.code)===L.MEDIA_ERR_SRC_NOT_SUPPORTED&&Hi(e,r)},500);return}if(e.src&&(a!==L.MEDIA_ERR_DECODE||a!==void 0))try{let{status:n}=await fetch(e.src);r.data={response:{code:n}}}catch{}Hi(e,r)}function Hi(t,e){var i;e.fatal&&(((i=ue.get(t))!=null?i:{}).error=e,t.dispatchEvent(new CustomEvent("error",{detail:e})))}function fd(t){var e,i;if(!(t instanceof CustomEvent)||!(t.detail instanceof L))return;let a=t.target,r=t.detail;!r||!r.fatal||(((e=ue.get(a))!=null?e:{}).error=r,(i=a.mux)==null||i.emit("error",{player_error_code:r.code,player_error_message:r.message,player_error_context:r.context}))}var Xg=(t,e)=>{var i,a,r;t.fatal?console.error("getErrorFromHlsErrorData()",t):e.debug&&console.warn("getErrorFromHlsErrorData() (non-fatal)",t);let n={[q.ErrorTypes.NETWORK_ERROR]:L.MEDIA_ERR_NETWORK,[q.ErrorTypes.MEDIA_ERROR]:L.MEDIA_ERR_DECODE,[q.ErrorTypes.KEY_SYSTEM_ERROR]:L.MEDIA_ERR_ENCRYPTED},s=p=>[q.ErrorDetails.KEY_SYSTEM_LICENSE_REQUEST_FAILED,q.ErrorDetails.KEY_SYSTEM_SERVER_CERTIFICATE_REQUEST_FAILED].includes(p.details)?L.MEDIA_ERR_NETWORK:n[p.type],o=p=>{if(p.type===q.ErrorTypes.KEY_SYSTEM_ERROR)return ee.DRM;if(p.type===q.ErrorTypes.NETWORK_ERROR)return ee.VIDEO},l,c=s(t);if(c===L.MEDIA_ERR_NETWORK&&t.response){let p=(i=o(t))!=null?i:ee.VIDEO;l=(a=Po(t.response,p,e,t.fatal))!=null?a:new L("",c,t.fatal)}else if(c===L.MEDIA_ERR_ENCRYPTED)if(t.details===q.ErrorDetails.KEY_SYSTEM_NO_CONFIGURED_LICENSE){let p=O("Attempting to play DRM-protected content without providing a DRM token.");l=new L(p,L.MEDIA_ERR_ENCRYPTED,t.fatal),l.errorCategory=ee.DRM,l.muxCode=N.ENCRYPTED_MISSING_TOKEN}else if(t.details===q.ErrorDetails.KEY_SYSTEM_NO_ACCESS){let p=O("Cannot play DRM-protected content with current security configuration on this browser. Try playing in another browser.");l=new L(p,L.MEDIA_ERR_ENCRYPTED,t.fatal),l.errorCategory=ee.DRM,l.muxCode=N.ENCRYPTED_UNSUPPORTED_KEY_SYSTEM}else if(t.details===q.ErrorDetails.KEY_SYSTEM_NO_SESSION){let p=O("Failed to generate a DRM license request. This may be an issue with the player or your protected content.");l=new L(p,L.MEDIA_ERR_ENCRYPTED,!0),l.errorCategory=ee.DRM,l.muxCode=N.ENCRYPTED_GENERATE_REQUEST_FAILED}else if(t.details===q.ErrorDetails.KEY_SYSTEM_SESSION_UPDATE_FAILED){let p=O("Failed to update DRM license. This may be an issue with the player or your protected content.");l=new L(p,L.MEDIA_ERR_ENCRYPTED,t.fatal),l.errorCategory=ee.DRM,l.muxCode=N.ENCRYPTED_UPDATE_LICENSE_FAILED}else if(t.details===q.ErrorDetails.KEY_SYSTEM_SERVER_CERTIFICATE_UPDATE_FAILED){let p=O("Your server certificate failed when attempting to set it. This may be an issue with a no longer valid certificate.");l=new L(p,L.MEDIA_ERR_ENCRYPTED,t.fatal),l.errorCategory=ee.DRM,l.muxCode=N.ENCRYPTED_UPDATE_SERVER_CERT_FAILED}else if(t.details===q.ErrorDetails.KEY_SYSTEM_STATUS_INTERNAL_ERROR){let p=O("The DRM Content Decryption Module system had an internal failure. Try reloading the page, upading your browser, or playing in another browser.");l=new L(p,L.MEDIA_ERR_ENCRYPTED,t.fatal),l.errorCategory=ee.DRM,l.muxCode=N.ENCRYPTED_CDM_ERROR}else if(t.details===q.ErrorDetails.KEY_SYSTEM_STATUS_OUTPUT_RESTRICTED){let p=O("DRM playback is being attempted in an environment that is not sufficiently secure. User may see black screen.");l=new L(p,L.MEDIA_ERR_ENCRYPTED,!1),l.errorCategory=ee.DRM,l.muxCode=N.ENCRYPTED_OUTPUT_RESTRICTED}else l=new L(t.error.message,L.MEDIA_ERR_ENCRYPTED,t.fatal),l.errorCategory=ee.DRM,l.muxCode=N.ENCRYPTED_ERROR;else l=new L("",c,t.fatal);return l.context||(l.context=`${t.url?`url: ${t.url}
`:""}${t.response&&(t.response.code||t.response.text)?`response: ${t.response.code}, ${t.response.text}
`:""}${t.reason?`failure reason: ${t.reason}
`:""}${t.level?`level: ${t.level}
`:""}${t.parent?`parent stream controller: ${t.parent}
`:""}${t.buffer?`buffer length: ${t.buffer}
`:""}${t.error?`error: ${t.error}
`:""}${t.event?`event: ${t.event}
`:""}${t.err?`error message: ${(r=t.err)==null?void 0:r.message}
`:""}`),l.data=t,l},Hp=t=>{throw TypeError(t)},Bu=(t,e,i)=>e.has(t)||Hp("Cannot "+i),Te=(t,e,i)=>(Bu(t,e,"read from private field"),i?i.call(t):e.get(t)),ut=(t,e,i)=>e.has(t)?Hp("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),Lt=(t,e,i,a)=>(Bu(t,e,"write to private field"),e.set(t,i),i),is=(t,e,i)=>(Bu(t,e,"access private method"),i),Jg=()=>{try{return"0.30.5"}catch{}return"UNKNOWN"},e0=Jg(),t0=()=>e0,i0=`
<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" part="logo" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2" viewBox="0 0 1600 500"><g fill="#fff"><path d="M994.287 93.486c-17.121 0-31-13.879-31-31 0-17.121 13.879-31 31-31 17.121 0 31 13.879 31 31 0 17.121-13.879 31-31 31m0-93.486c-34.509 0-62.484 27.976-62.484 62.486v187.511c0 68.943-56.09 125.033-125.032 125.033s-125.03-56.09-125.03-125.033V62.486C681.741 27.976 653.765 0 619.256 0s-62.484 27.976-62.484 62.486v187.511C556.772 387.85 668.921 500 806.771 500c137.851 0 250.001-112.15 250.001-250.003V62.486c0-34.51-27.976-62.486-62.485-62.486M1537.51 468.511c-17.121 0-31-13.879-31-31 0-17.121 13.879-31 31-31 17.121 0 31 13.879 31 31 0 17.121-13.879 31-31 31m-275.883-218.509-143.33 143.329c-24.402 24.402-24.402 63.966 0 88.368 24.402 24.402 63.967 24.402 88.369 0l143.33-143.329 143.328 143.329c24.402 24.4 63.967 24.402 88.369 0 24.403-24.402 24.403-63.966.001-88.368l-143.33-143.329.001-.004 143.329-143.329c24.402-24.402 24.402-63.965 0-88.367s-63.967-24.402-88.369 0L1349.996 161.63 1206.667 18.302c-24.402-24.401-63.967-24.402-88.369 0s-24.402 63.965 0 88.367l143.329 143.329v.004ZM437.511 468.521c-17.121 0-31-13.879-31-31 0-17.121 13.879-31 31-31 17.121 0 31 13.879 31 31 0 17.121-13.879 31-31 31M461.426 4.759C438.078-4.913 411.2.432 393.33 18.303L249.999 161.632 106.669 18.303C88.798.432 61.922-4.913 38.573 4.759 15.224 14.43-.001 37.214-.001 62.488v375.026c0 34.51 27.977 62.486 62.487 62.486 34.51 0 62.486-27.976 62.486-62.486V213.341l80.843 80.844c24.404 24.402 63.965 24.402 88.369 0l80.843-80.844v224.173c0 34.51 27.976 62.486 62.486 62.486s62.486-27.976 62.486-62.486V62.488c0-25.274-15.224-48.058-38.573-57.729" style="fill-rule:nonzero"/></g></svg>`,y={BEACON_COLLECTION_DOMAIN:"beacon-collection-domain",CUSTOM_DOMAIN:"custom-domain",DEBUG:"debug",DISABLE_TRACKING:"disable-tracking",DISABLE_COOKIES:"disable-cookies",DISABLE_PSEUDO_ENDED:"disable-pseudo-ended",DRM_TOKEN:"drm-token",PLAYBACK_TOKEN:"playback-token",ENV_KEY:"env-key",MAX_RESOLUTION:"max-resolution",MIN_RESOLUTION:"min-resolution",MAX_AUTO_RESOLUTION:"max-auto-resolution",RENDITION_ORDER:"rendition-order",PROGRAM_START_TIME:"program-start-time",PROGRAM_END_TIME:"program-end-time",ASSET_START_TIME:"asset-start-time",ASSET_END_TIME:"asset-end-time",METADATA_URL:"metadata-url",PLAYBACK_ID:"playback-id",PLAYER_SOFTWARE_NAME:"player-software-name",PLAYER_SOFTWARE_VERSION:"player-software-version",PLAYER_INIT_TIME:"player-init-time",PREFER_CMCD:"prefer-cmcd",PREFER_PLAYBACK:"prefer-playback",START_TIME:"start-time",STREAM_TYPE:"stream-type",TARGET_LIVE_WINDOW:"target-live-window",LIVE_EDGE_OFFSET:"live-edge-offset",TYPE:"type",LOGO:"logo",CAP_RENDITION_TO_PLAYER_SIZE:"cap-rendition-to-player-size"},a0=Object.values(y),Mh=t0(),xh="mux-video",Qr,As,jr,ks,ws,Ss,Is,Rs,Zr,Ls,mt,ia,Cs,Xr,r0=class extends es{constructor(){super(),ut(this,mt),ut(this,Qr),ut(this,As),ut(this,jr,{}),ut(this,ks,{}),ut(this,ws),ut(this,Ss),ut(this,Is),ut(this,Rs),ut(this,Zr,""),ut(this,Ls,e=>{var i;let a=$g(this.nativeEl),r=(i=this.metadata)!=null?i:{};this.metadata={...a,...r},(a==null?void 0:a["com.mux.video.branding"])==="mux-free-plan"&&(Lt(this,Zr,"default"),this.updateLogo())}),ut(this,Cs),Lt(this,As,Pu())}static get NAME(){return xh}static get VERSION(){return Mh}static get observedAttributes(){var e;return[...a0,...(e=es.observedAttributes)!=null?e:[]]}static getLogoHTML(e){return!e||e==="false"?"":e==="default"?i0:`<img part="logo" src="${e}" />`}static getTemplateHTML(e={}){var i;return`
      ${es.getTemplateHTML(e)}
      <style>
        :host {
          position: relative;
        }
        slot[name="logo"] {
          display: flex;
          justify-content: end;
          position: absolute;
          top: 1rem;
          right: 1rem;
          opacity: 0;
          transition: opacity 0.25s ease-in-out;
          z-index: 1;
        }
        slot[name="logo"]:has([part="logo"]) {
          opacity: 1;
        }
        slot[name="logo"] [part="logo"] {
          width: 5rem;
          pointer-events: none;
          user-select: none;
        }
      </style>
      <slot name="logo">
        ${this.getLogoHTML((i=e[y.LOGO])!=null?i:"")}
      </slot>
    `}get preferCmcd(){var e;return(e=this.getAttribute(y.PREFER_CMCD))!=null?e:void 0}set preferCmcd(e){e!==this.preferCmcd&&(e?No.includes(e)?this.setAttribute(y.PREFER_CMCD,e):console.warn(`Invalid value for preferCmcd. Must be one of ${No.join()}`):this.removeAttribute(y.PREFER_CMCD))}get playerInitTime(){return this.hasAttribute(y.PLAYER_INIT_TIME)?+this.getAttribute(y.PLAYER_INIT_TIME):Te(this,As)}set playerInitTime(e){e!=this.playerInitTime&&(e==null?this.removeAttribute(y.PLAYER_INIT_TIME):this.setAttribute(y.PLAYER_INIT_TIME,`${+e}`))}get playerSoftwareName(){var e;return(e=Te(this,Is))!=null?e:xh}set playerSoftwareName(e){Lt(this,Is,e)}get playerSoftwareVersion(){var e;return(e=Te(this,Ss))!=null?e:Mh}set playerSoftwareVersion(e){Lt(this,Ss,e)}get _hls(){var e;return(e=Te(this,mt,ia))==null?void 0:e.engine}get mux(){var e;return(e=this.nativeEl)==null?void 0:e.mux}get error(){var e;return(e=Rp(this.nativeEl))!=null?e:null}get errorTranslator(){return Te(this,Rs)}set errorTranslator(e){Lt(this,Rs,e)}get src(){return this.getAttribute("src")}set src(e){e!==this.src&&(e==null?this.removeAttribute("src"):this.setAttribute("src",e))}get type(){var e;return(e=this.getAttribute(y.TYPE))!=null?e:void 0}set type(e){e!==this.type&&(e?this.setAttribute(y.TYPE,e):this.removeAttribute(y.TYPE))}get preload(){let e=this.getAttribute("preload");return e===""?"auto":["none","metadata","auto"].includes(e)?e:super.preload}set preload(e){e!=this.getAttribute("preload")&&(["","none","metadata","auto"].includes(e)?this.setAttribute("preload",e):this.removeAttribute("preload"))}get debug(){return this.getAttribute(y.DEBUG)!=null}set debug(e){e!==this.debug&&(e?this.setAttribute(y.DEBUG,""):this.removeAttribute(y.DEBUG))}get disableTracking(){return this.hasAttribute(y.DISABLE_TRACKING)}set disableTracking(e){e!==this.disableTracking&&this.toggleAttribute(y.DISABLE_TRACKING,!!e)}get disableCookies(){return this.hasAttribute(y.DISABLE_COOKIES)}set disableCookies(e){e!==this.disableCookies&&(e?this.setAttribute(y.DISABLE_COOKIES,""):this.removeAttribute(y.DISABLE_COOKIES))}get disablePseudoEnded(){return this.hasAttribute(y.DISABLE_PSEUDO_ENDED)}set disablePseudoEnded(e){e!==this.disablePseudoEnded&&(e?this.setAttribute(y.DISABLE_PSEUDO_ENDED,""):this.removeAttribute(y.DISABLE_PSEUDO_ENDED))}get startTime(){let e=this.getAttribute(y.START_TIME);if(e==null)return;let i=+e;return Number.isNaN(i)?void 0:i}set startTime(e){e!==this.startTime&&(e==null?this.removeAttribute(y.START_TIME):this.setAttribute(y.START_TIME,`${e}`))}get playbackId(){var e;return this.hasAttribute(y.PLAYBACK_ID)?this.getAttribute(y.PLAYBACK_ID):(e=$u(this.src))!=null?e:void 0}set playbackId(e){e!==this.playbackId&&(e?this.setAttribute(y.PLAYBACK_ID,e):this.removeAttribute(y.PLAYBACK_ID))}get maxResolution(){var e;return(e=this.getAttribute(y.MAX_RESOLUTION))!=null?e:void 0}set maxResolution(e){e!==this.maxResolution&&(e?this.setAttribute(y.MAX_RESOLUTION,e):this.removeAttribute(y.MAX_RESOLUTION))}get minResolution(){var e;return(e=this.getAttribute(y.MIN_RESOLUTION))!=null?e:void 0}set minResolution(e){e!==this.minResolution&&(e?this.setAttribute(y.MIN_RESOLUTION,e):this.removeAttribute(y.MIN_RESOLUTION))}get maxAutoResolution(){var e;return(e=this.getAttribute(y.MAX_AUTO_RESOLUTION))!=null?e:void 0}set maxAutoResolution(e){e==null?this.removeAttribute(y.MAX_AUTO_RESOLUTION):this.setAttribute(y.MAX_AUTO_RESOLUTION,e)}get renditionOrder(){var e;return(e=this.getAttribute(y.RENDITION_ORDER))!=null?e:void 0}set renditionOrder(e){e!==this.renditionOrder&&(e?this.setAttribute(y.RENDITION_ORDER,e):this.removeAttribute(y.RENDITION_ORDER))}get programStartTime(){let e=this.getAttribute(y.PROGRAM_START_TIME);if(e==null)return;let i=+e;return Number.isNaN(i)?void 0:i}set programStartTime(e){e==null?this.removeAttribute(y.PROGRAM_START_TIME):this.setAttribute(y.PROGRAM_START_TIME,`${e}`)}get programEndTime(){let e=this.getAttribute(y.PROGRAM_END_TIME);if(e==null)return;let i=+e;return Number.isNaN(i)?void 0:i}set programEndTime(e){e==null?this.removeAttribute(y.PROGRAM_END_TIME):this.setAttribute(y.PROGRAM_END_TIME,`${e}`)}get assetStartTime(){let e=this.getAttribute(y.ASSET_START_TIME);if(e==null)return;let i=+e;return Number.isNaN(i)?void 0:i}set assetStartTime(e){e==null?this.removeAttribute(y.ASSET_START_TIME):this.setAttribute(y.ASSET_START_TIME,`${e}`)}get assetEndTime(){let e=this.getAttribute(y.ASSET_END_TIME);if(e==null)return;let i=+e;return Number.isNaN(i)?void 0:i}set assetEndTime(e){e==null?this.removeAttribute(y.ASSET_END_TIME):this.setAttribute(y.ASSET_END_TIME,`${e}`)}get customDomain(){var e;return(e=this.getAttribute(y.CUSTOM_DOMAIN))!=null?e:void 0}set customDomain(e){e!==this.customDomain&&(e?this.setAttribute(y.CUSTOM_DOMAIN,e):this.removeAttribute(y.CUSTOM_DOMAIN))}get capRenditionToPlayerSize(){var e;return((e=this._hlsConfig)==null?void 0:e.capLevelToPlayerSize)!=null?this._hlsConfig.capLevelToPlayerSize:Te(this,Cs)}set capRenditionToPlayerSize(e){Lt(this,Cs,e)}get drmToken(){var e;return(e=this.getAttribute(y.DRM_TOKEN))!=null?e:void 0}set drmToken(e){e!==this.drmToken&&(e?this.setAttribute(y.DRM_TOKEN,e):this.removeAttribute(y.DRM_TOKEN))}get playbackToken(){var e,i,a,r;if(this.hasAttribute(y.PLAYBACK_TOKEN))return(e=this.getAttribute(y.PLAYBACK_TOKEN))!=null?e:void 0;if(this.hasAttribute(y.PLAYBACK_ID)){let[,n]=Du((i=this.playbackId)!=null?i:"");return(a=new URLSearchParams(n).get("token"))!=null?a:void 0}if(this.src)return(r=new URLSearchParams(this.src).get("token"))!=null?r:void 0}set playbackToken(e){e!==this.playbackToken&&(e?this.setAttribute(y.PLAYBACK_TOKEN,e):this.removeAttribute(y.PLAYBACK_TOKEN))}get tokens(){let e=this.getAttribute(y.PLAYBACK_TOKEN),i=this.getAttribute(y.DRM_TOKEN);return{...Te(this,ks),...e!=null?{playback:e}:{},...i!=null?{drm:i}:{}}}set tokens(e){Lt(this,ks,e??{})}get ended(){return Dp(this.nativeEl,this._hls)}get envKey(){var e;return(e=this.getAttribute(y.ENV_KEY))!=null?e:void 0}set envKey(e){e!==this.envKey&&(e?this.setAttribute(y.ENV_KEY,e):this.removeAttribute(y.ENV_KEY))}get beaconCollectionDomain(){var e;return(e=this.getAttribute(y.BEACON_COLLECTION_DOMAIN))!=null?e:void 0}set beaconCollectionDomain(e){e!==this.beaconCollectionDomain&&(e?this.setAttribute(y.BEACON_COLLECTION_DOMAIN,e):this.removeAttribute(y.BEACON_COLLECTION_DOMAIN))}get streamType(){var e;return(e=this.getAttribute(y.STREAM_TYPE))!=null?e:vd(this.nativeEl)}set streamType(e){e!==this.streamType&&(e?this.setAttribute(y.STREAM_TYPE,e):this.removeAttribute(y.STREAM_TYPE))}get targetLiveWindow(){return this.hasAttribute(y.TARGET_LIVE_WINDOW)?+this.getAttribute(y.TARGET_LIVE_WINDOW):Ug(this.nativeEl)}set targetLiveWindow(e){e!=this.targetLiveWindow&&(e==null?this.removeAttribute(y.TARGET_LIVE_WINDOW):this.setAttribute(y.TARGET_LIVE_WINDOW,`${+e}`))}get liveEdgeStart(){var e,i;if(this.hasAttribute(y.LIVE_EDGE_OFFSET)){let{liveEdgeOffset:a}=this,r=(e=this.nativeEl.seekable.end(0))!=null?e:0,n=(i=this.nativeEl.seekable.start(0))!=null?i:0;return Math.max(n,r-a)}return Hg(this.nativeEl)}get liveEdgeOffset(){if(this.hasAttribute(y.LIVE_EDGE_OFFSET))return+this.getAttribute(y.LIVE_EDGE_OFFSET)}set liveEdgeOffset(e){e!=this.liveEdgeOffset&&(e==null?this.removeAttribute(y.LIVE_EDGE_OFFSET):this.setAttribute(y.LIVE_EDGE_OFFSET,`${+e}`))}get seekable(){return Uu(this.nativeEl)}async addCuePoints(e){return yp(this.nativeEl,e)}get activeCuePoint(){return Tp(this.nativeEl)}get cuePoints(){return ag(this.nativeEl)}async addChapters(e){return kp(this.nativeEl,e)}get activeChapter(){return wp(this.nativeEl)}get chapters(){return ng(this.nativeEl)}getStartDate(){return og(this.nativeEl,this._hls)}get currentPdt(){return lg(this.nativeEl,this._hls)}get preferPlayback(){let e=this.getAttribute(y.PREFER_PLAYBACK);if(e===ei.MSE||e===ei.NATIVE)return e}set preferPlayback(e){e!==this.preferPlayback&&(e===ei.MSE||e===ei.NATIVE?this.setAttribute(y.PREFER_PLAYBACK,e):this.removeAttribute(y.PREFER_PLAYBACK))}get metadata(){return{...this.getAttributeNames().filter(e=>e.startsWith("metadata-")&&![y.METADATA_URL].includes(e)).reduce((e,i)=>{let a=this.getAttribute(i);return a!=null&&(e[i.replace(/^metadata-/,"").replace(/-/g,"_")]=a),e},{}),...Te(this,jr)}}set metadata(e){Lt(this,jr,e??{}),this.mux&&this.mux.emit("hb",Te(this,jr))}get _hlsConfig(){return Te(this,ws)}set _hlsConfig(e){Lt(this,ws,e)}get logo(){var e;return(e=this.getAttribute(y.LOGO))!=null?e:Te(this,Zr)}set logo(e){e?this.setAttribute(y.LOGO,e):this.removeAttribute(y.LOGO)}load(){Mp(this,this.nativeEl,Te(this,mt,ia))}unload(){xp(this.nativeEl,Te(this,mt,ia),this)}attributeChangedCallback(e,i,a){var r,n;switch(es.observedAttributes.includes(e)&&!["src","autoplay","preload"].includes(e)&&super.attributeChangedCallback(e,i,a),e){case y.PLAYER_SOFTWARE_NAME:this.playerSoftwareName=a??void 0;break;case y.PLAYER_SOFTWARE_VERSION:this.playerSoftwareVersion=a??void 0;break;case"src":{let s=!!i,o=!!a;!s&&o?is(this,mt,Xr).call(this):s&&!o?this.unload():s&&o&&(this.unload(),is(this,mt,Xr).call(this));break}case"autoplay":if(a===i)break;(r=Te(this,mt,ia))==null||r.setAutoplay(this.autoplay);break;case"preload":if(a===i)break;(n=Te(this,mt,ia))==null||n.setPreload(a);break;case y.PLAYBACK_ID:case y.CUSTOM_DOMAIN:case y.MAX_RESOLUTION:case y.MIN_RESOLUTION:case y.RENDITION_ORDER:case y.PROGRAM_START_TIME:case y.PROGRAM_END_TIME:case y.ASSET_START_TIME:case y.ASSET_END_TIME:case y.PLAYBACK_TOKEN:this.src=pd(this);break;case y.DEBUG:{let s=this.debug;this.mux&&console.info("Cannot toggle debug mode of mux data after initialization. Make sure you set all metadata to override before setting the src."),this._hls&&(this._hls.config.debug=s);break}case y.METADATA_URL:a&&fetch(a).then(s=>s.json()).then(s=>this.metadata=s).catch(()=>console.error(`Unable to load or parse metadata JSON from metadata-url ${a}!`));break;case y.STREAM_TYPE:(a==null||a!==i)&&this.dispatchEvent(new CustomEvent("streamtypechange",{composed:!0,bubbles:!0}));break;case y.TARGET_LIVE_WINDOW:(a==null||a!==i)&&this.dispatchEvent(new CustomEvent("targetlivewindowchange",{composed:!0,bubbles:!0,detail:this.targetLiveWindow}));break;case y.LOGO:(a==null||a!==i)&&this.updateLogo();break;case y.DISABLE_TRACKING:{if(a==null||a!==i){let s=this.currentTime,o=this.paused;this.unload(),is(this,mt,Xr).call(this).then(()=>{this.currentTime=s,o||this.play()})}break}case y.DISABLE_COOKIES:{(a==null||a!==i)&&this.disableCookies&&document.cookie.split(";").forEach(s=>{s.trim().startsWith("muxData")&&(document.cookie=s.replace(/^ +/,"").replace(/=.*/,"=;expires="+new Date().toUTCString()+";path=/"))});break}case y.CAP_RENDITION_TO_PLAYER_SIZE:(a==null||a!==i)&&(this.capRenditionToPlayerSize=a!=null?!0:void 0)}}updateLogo(){if(!this.shadowRoot)return;let e=this.shadowRoot.querySelector('slot[name="logo"]');if(!e)return;let i=this.constructor.getLogoHTML(Te(this,Zr)||this.logo);e.innerHTML=i}connectedCallback(){var e,i;(e=super.connectedCallback)==null||e.call(this),(i=this.nativeEl)==null||i.addEventListener("muxmetadata",Te(this,Ls)),this.nativeEl&&this.src&&!Te(this,mt,ia)&&is(this,mt,Xr).call(this)}disconnectedCallback(){var e,i;(e=this.nativeEl)==null||e.removeEventListener("muxmetadata",Te(this,Ls)),this.unload(),(i=super.disconnectedCallback)==null||i.call(this)}handleEvent(e){e.target===this.nativeEl&&this.dispatchEvent(new CustomEvent(e.type,{composed:!0,detail:e.detail}))}};Qr=new WeakMap,As=new WeakMap,jr=new WeakMap,ks=new WeakMap,ws=new WeakMap,Ss=new WeakMap,Is=new WeakMap,Rs=new WeakMap,Zr=new WeakMap,Ls=new WeakMap,mt=new WeakSet,ia=function(){return Bg(this.nativeEl)},Cs=new WeakMap,Xr=async function(){Te(this,Qr)||(await Lt(this,Qr,Promise.resolve()),Lt(this,Qr,null),this.load())};const qi=new WeakMap;class Kl extends Error{}class n0 extends Error{}const s0=["application/x-mpegURL","application/vnd.apple.mpegurl","audio/mpegurl"],o0=globalThis.WeakRef?class extends Set{add(t){super.add(new WeakRef(t))}forEach(t){super.forEach(e=>{const i=e.deref();i&&t(i)})}}:Set;function l0(t){var e,i,a;(i=(e=globalThis.chrome)==null?void 0:e.cast)!=null&&i.isAvailable?(a=globalThis.cast)!=null&&a.framework?t():customElements.whenDefined("google-cast-button").then(t):globalThis.__onGCastApiAvailable=()=>{customElements.whenDefined("google-cast-button").then(t)}}function d0(){return globalThis.chrome}function u0(){var i;const t="https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1";if((i=globalThis.chrome)!=null&&i.cast||document.querySelector(`script[src="${t}"]`))return;const e=document.createElement("script");e.src=t,document.head.append(e)}function Fi(){var t,e;return(e=(t=globalThis.cast)==null?void 0:t.framework)==null?void 0:e.CastContext.getInstance()}function Wu(){var t;return(t=Fi())==null?void 0:t.getCurrentSession()}function Fu(){var t;return(t=Wu())==null?void 0:t.getSessionObj().media[0]}function c0(t){return new Promise((e,i)=>{Fu().editTracksInfo(t,e,i)})}function h0(t){return new Promise((e,i)=>{Fu().getStatus(t,e,i)})}function Oh(t){return Fi().setOptions({...Bp(),...t})}function Bp(){return{receiverApplicationId:"CC1AD845",autoJoinPolicy:"origin_scoped",androidReceiverCompatible:!1,language:"en-US",resumeSavedSession:!0}}function m0(t){if(!t)return;const e=/\.([a-zA-Z0-9]+)(?:\?.*)?$/,i=t.match(e);return i?i[1]:null}function p0(t){const e=t.split(`
`),i=[];for(let a=0;a<e.length;a++)if(e[a].trim().startsWith("#EXT-X-STREAM-INF")){const n=e[a+1]?e[a+1].trim():"";n&&!n.startsWith("#")&&i.push(n)}return i}function v0(t){return t.split(`
`).find(a=>!a.trim().startsWith("#")&&a.trim()!=="")}async function f0(t){try{const i=(await fetch(t,{method:"HEAD"})).headers.get("Content-Type");return s0.some(a=>i===a)}catch(e){return console.error("Error while trying to get the Content-Type of the manifest",e),!1}}async function E0(t){try{const e=await(await fetch(t)).text();let i=e;const a=p0(e);if(a.length>0){const s=new URL(a[0],t).toString();i=await(await fetch(s)).text()}const r=v0(i);return m0(r)}catch(e){console.error("Error while trying to parse the manifest playlist",e);return}}const Ds=new o0,oi=new WeakSet;let Se;l0(()=>{var t,e,i,a;if(!((e=(t=globalThis.chrome)==null?void 0:t.cast)!=null&&e.isAvailable)){console.debug("chrome.cast.isAvailable",(a=(i=globalThis.chrome)==null?void 0:i.cast)==null?void 0:a.isAvailable);return}Se||(Se=cast.framework,Fi().addEventListener(Se.CastContextEventType.CAST_STATE_CHANGED,r=>{Ds.forEach(n=>{var s,o;return(o=(s=qi.get(n)).onCastStateChanged)==null?void 0:o.call(s,r)})}),Fi().addEventListener(Se.CastContextEventType.SESSION_STATE_CHANGED,r=>{Ds.forEach(n=>{var s,o;return(o=(s=qi.get(n)).onSessionStateChanged)==null?void 0:o.call(s,r)})}),Ds.forEach(r=>{var n,s;return(s=(n=qi.get(r)).init)==null?void 0:s.call(n)}))});let Nh=0;var z,gr,Ge,Mt,Ea,_a,Wi,cl,Qn,ne,aa,Wp,Fp,Ed,Kp,_d,Vp,bd;class _0 extends EventTarget{constructor(i){super();We(this,ne);We(this,z);We(this,gr);We(this,Ge);We(this,Mt);We(this,Ea,"disconnected");We(this,_a,!1);We(this,Wi,new Set);We(this,cl,new WeakMap);We(this,Qn,()=>dt(this,ne,bd).call(this));Qe(this,z,i),Ds.add(this),qi.set(this,{init:()=>dt(this,ne,_d).call(this),onCastStateChanged:()=>dt(this,ne,Ed).call(this),onSessionStateChanged:()=>dt(this,ne,Kp).call(this),getCastPlayer:()=>A(this,ne,aa)}),dt(this,ne,_d).call(this)}destroy(){var i,a,r;(a=(i=A(this,z))==null?void 0:i.textTracks)==null||a.removeEventListener("change",A(this,Qn)),A(this,Mt)&&((r=A(this,Ge))!=null&&r.controller)&&Object.entries(A(this,Mt)).forEach(([n,s])=>{A(this,Ge).controller.removeEventListener(n,s)}),A(this,z)&&oi.delete(A(this,z)),Qe(this,gr,!1)}get state(){return A(this,Ea)}async watchAvailability(i){if(A(this,z).disableRemotePlayback)throw new Kl("disableRemotePlayback attribute is present.");return A(this,cl).set(i,++Nh),A(this,Wi).add(i),queueMicrotask(()=>i(dt(this,ne,Fp).call(this))),Nh}async cancelWatchAvailability(i){if(A(this,z).disableRemotePlayback)throw new Kl("disableRemotePlayback attribute is present.");i?A(this,Wi).delete(i):A(this,Wi).clear()}async prompt(){var a,r,n,s;if(A(this,z).disableRemotePlayback)throw new Kl("disableRemotePlayback attribute is present.");if(!((r=(a=globalThis.chrome)==null?void 0:a.cast)!=null&&r.isAvailable))throw new n0("The RemotePlayback API is disabled on this platform.");const i=oi.has(A(this,z));oi.add(A(this,z)),Oh(A(this,z).castOptions),Object.entries(A(this,Mt)).forEach(([o,l])=>{A(this,Ge).controller.addEventListener(o,l)});try{await Fi().requestSession()}catch(o){if(i||oi.delete(A(this,z)),o==="cancel")return;throw new Error(o)}(s=(n=qi.get(A(this,z)))==null?void 0:n.loadOnPrompt)==null||s.call(n)}}z=new WeakMap,gr=new WeakMap,Ge=new WeakMap,Mt=new WeakMap,Ea=new WeakMap,_a=new WeakMap,Wi=new WeakMap,cl=new WeakMap,Qn=new WeakMap,ne=new WeakSet,aa=function(){if(oi.has(A(this,z)))return A(this,Ge)},Wp=function(){oi.has(A(this,z))&&(Object.entries(A(this,Mt)).forEach(([i,a])=>{A(this,Ge).controller.removeEventListener(i,a)}),oi.delete(A(this,z)),A(this,z).muted=A(this,Ge).isMuted,A(this,z).currentTime=A(this,Ge).savedPlayerState.currentTime,A(this,Ge).savedPlayerState.isPaused===!1&&A(this,z).play())},Fp=function(){var a;const i=(a=Fi())==null?void 0:a.getCastState();return i&&i!=="NO_DEVICES_AVAILABLE"},Ed=function(){const i=Fi().getCastState();if(oi.has(A(this,z))&&i==="CONNECTING"&&(Qe(this,Ea,"connecting"),this.dispatchEvent(new Event("connecting"))),!A(this,_a)&&(i!=null&&i.includes("CONNECT"))){Qe(this,_a,!0);for(let a of A(this,Wi))a(!0)}else if(A(this,_a)&&(!i||i==="NO_DEVICES_AVAILABLE")){Qe(this,_a,!1);for(let a of A(this,Wi))a(!1)}},Kp=async function(){var a;const{SESSION_RESUMED:i}=Se.SessionState;if(Fi().getSessionState()===i&&A(this,z).castSrc===((a=Fu())==null?void 0:a.media.contentId)){oi.add(A(this,z)),Object.entries(A(this,Mt)).forEach(([r,n])=>{A(this,Ge).controller.addEventListener(r,n)});try{await h0(new chrome.cast.media.GetStatusRequest)}catch(r){console.error(r)}A(this,Mt)[Se.RemotePlayerEventType.IS_PAUSED_CHANGED](),A(this,Mt)[Se.RemotePlayerEventType.PLAYER_STATE_CHANGED]()}},_d=function(){!Se||A(this,gr)||(Qe(this,gr,!0),Oh(A(this,z).castOptions),A(this,z).textTracks.addEventListener("change",A(this,Qn)),dt(this,ne,Ed).call(this),Qe(this,Ge,new Se.RemotePlayer),new Se.RemotePlayerController(A(this,Ge)),Qe(this,Mt,{[Se.RemotePlayerEventType.IS_CONNECTED_CHANGED]:({value:i})=>{i===!0?(Qe(this,Ea,"connected"),this.dispatchEvent(new Event("connect"))):(dt(this,ne,Wp).call(this),Qe(this,Ea,"disconnected"),this.dispatchEvent(new Event("disconnect")))},[Se.RemotePlayerEventType.DURATION_CHANGED]:()=>{A(this,z).dispatchEvent(new Event("durationchange"))},[Se.RemotePlayerEventType.VOLUME_LEVEL_CHANGED]:()=>{A(this,z).dispatchEvent(new Event("volumechange"))},[Se.RemotePlayerEventType.IS_MUTED_CHANGED]:()=>{A(this,z).dispatchEvent(new Event("volumechange"))},[Se.RemotePlayerEventType.CURRENT_TIME_CHANGED]:()=>{var i;(i=A(this,ne,aa))!=null&&i.isMediaLoaded&&A(this,z).dispatchEvent(new Event("timeupdate"))},[Se.RemotePlayerEventType.VIDEO_INFO_CHANGED]:()=>{A(this,z).dispatchEvent(new Event("resize"))},[Se.RemotePlayerEventType.IS_PAUSED_CHANGED]:()=>{A(this,z).dispatchEvent(new Event(this.paused?"pause":"play"))},[Se.RemotePlayerEventType.PLAYER_STATE_CHANGED]:()=>{var i,a;((i=A(this,ne,aa))==null?void 0:i.playerState)!==chrome.cast.media.PlayerState.PAUSED&&A(this,z).dispatchEvent(new Event({[chrome.cast.media.PlayerState.PLAYING]:"playing",[chrome.cast.media.PlayerState.BUFFERING]:"waiting",[chrome.cast.media.PlayerState.IDLE]:"emptied"}[(a=A(this,ne,aa))==null?void 0:a.playerState]))},[Se.RemotePlayerEventType.IS_MEDIA_LOADED_CHANGED]:async()=>{var i;(i=A(this,ne,aa))!=null&&i.isMediaLoaded&&(await Promise.resolve(),dt(this,ne,Vp).call(this))}}))},Vp=function(){dt(this,ne,bd).call(this)},bd=async function(){var u,d,v;if(!A(this,ne,aa))return;const a=(((u=A(this,Ge).mediaInfo)==null?void 0:u.tracks)??[]).filter(({type:f})=>f===chrome.cast.media.TrackType.TEXT),r=[...A(this,z).textTracks].filter(({kind:f})=>f==="subtitles"||f==="captions"),n=a.map(({language:f,name:b,trackId:E})=>{const{mode:T}=r.find(_=>_.language===f&&_.label===b)??{};return T?{mode:T,trackId:E}:!1}).filter(Boolean),o=n.filter(({mode:f})=>f!=="showing").map(({trackId:f})=>f),l=n.find(({mode:f})=>f==="showing"),c=((v=(d=Wu())==null?void 0:d.getSessionObj().media[0])==null?void 0:v.activeTrackIds)??[];let p=c;if(c.length&&(p=p.filter(f=>!o.includes(f))),l!=null&&l.trackId&&(p=[...p,l.trackId]),p=[...new Set(p)],!((f,b)=>f.length===b.length&&f.every(E=>b.includes(E)))(c,p))try{const f=new chrome.cast.media.EditTracksInfoRequest(p);await c0(f)}catch(f){console.error(f)}};const b0=t=>{var e,i,a,r,n,s,j,qp;return e=class extends t{constructor(){super(...arguments);We(this,s);We(this,i,{paused:!1});We(this,a,Bp());We(this,r);We(this,n)}get remote(){return A(this,n)?A(this,n):d0()?this.isConnected?(this.disableRemotePlayback||u0(),qi.set(this,{loadOnPrompt:()=>dt(this,s,qp).call(this)}),Qe(this,n,new _0(this))):void 0:super.remote}disconnectedCallback(){var m,u;(m=A(this,n))==null||m.destroy(),Qe(this,n,null),qi.delete(this),(u=super.disconnectedCallback)==null||u.call(this)}attributeChangedCallback(m,u,d){if(super.attributeChangedCallback(m,u,d),m==="cast-receiver"&&d){A(this,a).receiverApplicationId=d;return}if(A(this,s,j))switch(m){case"cast-stream-type":case"cast-src":this.load();break}}async load(){var b;if(!A(this,s,j))return super.load();const m=new chrome.cast.media.MediaInfo(this.castSrc,this.castContentType);m.customData=this.castCustomData;const u=[...this.querySelectorAll("track")].filter(({kind:E,src:T})=>T&&(E==="subtitles"||E==="captions")),d=[];let v=0;if(u.length&&(m.tracks=u.map(E=>{const T=++v;d.length===0&&E.track.mode==="showing"&&d.push(T);const _=new chrome.cast.media.Track(T,chrome.cast.media.TrackType.TEXT);return _.trackContentId=E.src,_.trackContentType="text/vtt",_.subtype=E.kind==="captions"?chrome.cast.media.TextTrackType.CAPTIONS:chrome.cast.media.TextTrackType.SUBTITLES,_.name=E.label,_.language=E.srclang,_})),this.castStreamType==="live"?m.streamType=chrome.cast.media.StreamType.LIVE:m.streamType=chrome.cast.media.StreamType.BUFFERED,m.metadata=new chrome.cast.media.GenericMediaMetadata,m.metadata.title=this.title,m.metadata.images=[{url:this.poster}],f0(this.castSrc)){const E=await E0(this.castSrc);(E==null?void 0:E.includes("m4s"))||(E==null?void 0:E.includes("mp4"))?(m.hlsSegmentFormat=chrome.cast.media.HlsSegmentFormat.FMP4,m.hlsVideoSegmentFormat=chrome.cast.media.HlsVideoSegmentFormat.FMP4):E!=null&&E.includes("ts")&&(m.hlsSegmentFormat=chrome.cast.media.HlsSegmentFormat.TS,m.hlsVideoSegmentFormat=chrome.cast.media.HlsVideoSegmentFormat.TS)}const f=new chrome.cast.media.LoadRequest(m);f.currentTime=super.currentTime??0,f.autoplay=!A(this,i).paused,f.activeTrackIds=d,await((b=Wu())==null?void 0:b.loadMedia(f)),this.dispatchEvent(new Event("volumechange"))}play(){var m;if(A(this,s,j)){A(this,s,j).isPaused&&((m=A(this,s,j).controller)==null||m.playOrPause());return}return super.play()}pause(){var m;if(A(this,s,j)){A(this,s,j).isPaused||(m=A(this,s,j).controller)==null||m.playOrPause();return}super.pause()}get castOptions(){return A(this,a)}get castReceiver(){return this.getAttribute("cast-receiver")??void 0}set castReceiver(m){this.castReceiver!=m&&this.setAttribute("cast-receiver",`${m}`)}get castSrc(){var m;return this.getAttribute("cast-src")??((m=this.querySelector("source"))==null?void 0:m.src)??this.currentSrc}set castSrc(m){this.castSrc!=m&&this.setAttribute("cast-src",`${m}`)}get castContentType(){return this.getAttribute("cast-content-type")??void 0}set castContentType(m){this.setAttribute("cast-content-type",`${m}`)}get castStreamType(){return this.getAttribute("cast-stream-type")??this.streamType??void 0}set castStreamType(m){this.setAttribute("cast-stream-type",`${m}`)}get castCustomData(){return A(this,r)}set castCustomData(m){const u=typeof m;if(!["object","undefined"].includes(u)){console.error(`castCustomData must be nullish or an object but value was of type ${u}`);return}Qe(this,r,m)}get readyState(){if(A(this,s,j))switch(A(this,s,j).playerState){case chrome.cast.media.PlayerState.IDLE:return 0;case chrome.cast.media.PlayerState.BUFFERING:return 2;default:return 3}return super.readyState}get paused(){return A(this,s,j)?A(this,s,j).isPaused:super.paused}get muted(){var m;return A(this,s,j)?(m=A(this,s,j))==null?void 0:m.isMuted:super.muted}set muted(m){var u;if(A(this,s,j)){(m&&!A(this,s,j).isMuted||!m&&A(this,s,j).isMuted)&&((u=A(this,s,j).controller)==null||u.muteOrUnmute());return}super.muted=m}get volume(){var m;return A(this,s,j)?((m=A(this,s,j))==null?void 0:m.volumeLevel)??1:super.volume}set volume(m){var u;if(A(this,s,j)){A(this,s,j).volumeLevel=+m,(u=A(this,s,j).controller)==null||u.setVolumeLevel();return}super.volume=m}get duration(){var m,u;return A(this,s,j)&&((m=A(this,s,j))!=null&&m.isMediaLoaded)?((u=A(this,s,j))==null?void 0:u.duration)??NaN:super.duration}get currentTime(){var m,u;return A(this,s,j)&&((m=A(this,s,j))!=null&&m.isMediaLoaded)?((u=A(this,s,j))==null?void 0:u.currentTime)??0:super.currentTime}set currentTime(m){var u;if(A(this,s,j)){A(this,s,j).currentTime=m,(u=A(this,s,j).controller)==null||u.seek();return}super.currentTime=m}},i=new WeakMap,a=new WeakMap,r=new WeakMap,n=new WeakMap,s=new WeakSet,j=function(){var m,u;return(u=(m=qi.get(this.remote))==null?void 0:m.getCastPlayer)==null?void 0:u.call(m)},qp=async function(){A(this,i).paused=Jn(e.prototype,this,"paused"),Jn(e.prototype,this,"pause").call(this),this.muted=Jn(e.prototype,this,"muted");try{await this.load()}catch(m){console.error(m)}},mh(e,"observedAttributes",[...t.observedAttributes??[],"cast-src","cast-content-type","cast-stream-type","cast-receiver"]),e};var Yp=t=>{throw TypeError(t)},Gp=(t,e,i)=>e.has(t)||Yp("Cannot "+i),g0=(t,e,i)=>(Gp(t,e,"read from private field"),i?i.call(t):e.get(t)),y0=(t,e,i)=>e.has(t)?Yp("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),T0=(t,e,i,a)=>(Gp(t,e,"write to private field"),e.set(t,i),i),zp=class{addEventListener(){}removeEventListener(){}dispatchEvent(e){return!0}};if(typeof DocumentFragment>"u"){class t extends zp{}globalThis.DocumentFragment=t}var A0=class extends zp{},k0={get(t){},define(t,e,i){},getName(t){return null},upgrade(t){},whenDefined(t){return Promise.resolve(A0)}},w0={customElements:k0},S0=typeof window>"u"||typeof globalThis.customElements>"u",Vl=S0?w0:globalThis,Ms,Ph=class extends b0(vE(r0)){constructor(){super(...arguments),y0(this,Ms)}get autoplay(){let t=this.getAttribute("autoplay");return t===null?!1:t===""?!0:t}set autoplay(t){let e=this.autoplay;t!==e&&(t?this.setAttribute("autoplay",typeof t=="string"?t:""):this.removeAttribute("autoplay"))}get muxCastCustomData(){return{mux:{playbackId:this.playbackId,minResolution:this.minResolution,maxResolution:this.maxResolution,renditionOrder:this.renditionOrder,customDomain:this.customDomain,tokens:{drm:this.drmToken},envKey:this.envKey,metadata:this.metadata,disableCookies:this.disableCookies,disableTracking:this.disableTracking,beaconCollectionDomain:this.beaconCollectionDomain,startTime:this.startTime,preferCmcd:this.preferCmcd}}}get castCustomData(){var t;return(t=g0(this,Ms))!=null?t:this.muxCastCustomData}set castCustomData(t){T0(this,Ms,t)}};Ms=new WeakMap;Vl.customElements.get("mux-video")||(Vl.customElements.define("mux-video",Ph),Vl.MuxVideoElement=Ph);const D={MEDIA_PLAY_REQUEST:"mediaplayrequest",MEDIA_PAUSE_REQUEST:"mediapauserequest",MEDIA_MUTE_REQUEST:"mediamuterequest",MEDIA_UNMUTE_REQUEST:"mediaunmuterequest",MEDIA_LOOP_REQUEST:"medialooprequest",MEDIA_VOLUME_REQUEST:"mediavolumerequest",MEDIA_SEEK_REQUEST:"mediaseekrequest",MEDIA_AIRPLAY_REQUEST:"mediaairplayrequest",MEDIA_ENTER_FULLSCREEN_REQUEST:"mediaenterfullscreenrequest",MEDIA_EXIT_FULLSCREEN_REQUEST:"mediaexitfullscreenrequest",MEDIA_PREVIEW_REQUEST:"mediapreviewrequest",MEDIA_ENTER_PIP_REQUEST:"mediaenterpiprequest",MEDIA_EXIT_PIP_REQUEST:"mediaexitpiprequest",MEDIA_ENTER_CAST_REQUEST:"mediaentercastrequest",MEDIA_EXIT_CAST_REQUEST:"mediaexitcastrequest",MEDIA_SHOW_TEXT_TRACKS_REQUEST:"mediashowtexttracksrequest",MEDIA_HIDE_TEXT_TRACKS_REQUEST:"mediahidetexttracksrequest",MEDIA_SHOW_SUBTITLES_REQUEST:"mediashowsubtitlesrequest",MEDIA_DISABLE_SUBTITLES_REQUEST:"mediadisablesubtitlesrequest",MEDIA_TOGGLE_SUBTITLES_REQUEST:"mediatogglesubtitlesrequest",MEDIA_PLAYBACK_RATE_REQUEST:"mediaplaybackraterequest",MEDIA_RENDITION_REQUEST:"mediarenditionrequest",MEDIA_AUDIO_TRACK_REQUEST:"mediaaudiotrackrequest",MEDIA_SEEK_TO_LIVE_REQUEST:"mediaseektoliverequest",REGISTER_MEDIA_STATE_RECEIVER:"registermediastatereceiver",UNREGISTER_MEDIA_STATE_RECEIVER:"unregistermediastatereceiver"},X={MEDIA_CHROME_ATTRIBUTES:"mediachromeattributes",MEDIA_CONTROLLER:"mediacontroller"},Qp={MEDIA_AIRPLAY_UNAVAILABLE:"mediaAirplayUnavailable",MEDIA_AUDIO_TRACK_ENABLED:"mediaAudioTrackEnabled",MEDIA_AUDIO_TRACK_LIST:"mediaAudioTrackList",MEDIA_AUDIO_TRACK_UNAVAILABLE:"mediaAudioTrackUnavailable",MEDIA_BUFFERED:"mediaBuffered",MEDIA_CAST_UNAVAILABLE:"mediaCastUnavailable",MEDIA_CHAPTERS_CUES:"mediaChaptersCues",MEDIA_CURRENT_TIME:"mediaCurrentTime",MEDIA_DURATION:"mediaDuration",MEDIA_ENDED:"mediaEnded",MEDIA_ERROR:"mediaError",MEDIA_ERROR_CODE:"mediaErrorCode",MEDIA_ERROR_MESSAGE:"mediaErrorMessage",MEDIA_FULLSCREEN_UNAVAILABLE:"mediaFullscreenUnavailable",MEDIA_HAS_PLAYED:"mediaHasPlayed",MEDIA_HEIGHT:"mediaHeight",MEDIA_IS_AIRPLAYING:"mediaIsAirplaying",MEDIA_IS_CASTING:"mediaIsCasting",MEDIA_IS_FULLSCREEN:"mediaIsFullscreen",MEDIA_IS_PIP:"mediaIsPip",MEDIA_LOADING:"mediaLoading",MEDIA_MUTED:"mediaMuted",MEDIA_LOOP:"mediaLoop",MEDIA_PAUSED:"mediaPaused",MEDIA_PIP_UNAVAILABLE:"mediaPipUnavailable",MEDIA_PLAYBACK_RATE:"mediaPlaybackRate",MEDIA_PREVIEW_CHAPTER:"mediaPreviewChapter",MEDIA_PREVIEW_COORDS:"mediaPreviewCoords",MEDIA_PREVIEW_IMAGE:"mediaPreviewImage",MEDIA_PREVIEW_TIME:"mediaPreviewTime",MEDIA_RENDITION_LIST:"mediaRenditionList",MEDIA_RENDITION_SELECTED:"mediaRenditionSelected",MEDIA_RENDITION_UNAVAILABLE:"mediaRenditionUnavailable",MEDIA_SEEKABLE:"mediaSeekable",MEDIA_STREAM_TYPE:"mediaStreamType",MEDIA_SUBTITLES_LIST:"mediaSubtitlesList",MEDIA_SUBTITLES_SHOWING:"mediaSubtitlesShowing",MEDIA_TARGET_LIVE_WINDOW:"mediaTargetLiveWindow",MEDIA_TIME_IS_LIVE:"mediaTimeIsLive",MEDIA_VOLUME:"mediaVolume",MEDIA_VOLUME_LEVEL:"mediaVolumeLevel",MEDIA_VOLUME_UNAVAILABLE:"mediaVolumeUnavailable",MEDIA_LANG:"mediaLang",MEDIA_WIDTH:"mediaWidth"},jp=Object.entries(Qp),h=jp.reduce((t,[e,i])=>(t[e]=i.toLowerCase(),t),{}),I0={USER_INACTIVE_CHANGE:"userinactivechange",BREAKPOINTS_CHANGE:"breakpointchange",BREAKPOINTS_COMPUTED:"breakpointscomputed"},ni=jp.reduce((t,[e,i])=>(t[e]=i.toLowerCase(),t),{...I0});Object.entries(ni).reduce((t,[e,i])=>{const a=h[e];return a&&(t[i]=a),t},{userinactivechange:"userinactive"});const R0=Object.entries(h).reduce((t,[e,i])=>{const a=ni[e];return a&&(t[i]=a),t},{userinactive:"userinactivechange"}),ai={SUBTITLES:"subtitles",CAPTIONS:"captions",CHAPTERS:"chapters",METADATA:"metadata"},hr={DISABLED:"disabled",SHOWING:"showing"},ql={MOUSE:"mouse",PEN:"pen",TOUCH:"touch"},rt={UNAVAILABLE:"unavailable",UNSUPPORTED:"unsupported"},pi={LIVE:"live",ON_DEMAND:"on-demand",UNKNOWN:"unknown"},L0={FULLSCREEN:"fullscreen"};function C0(t){return t==null?void 0:t.map(M0).join(" ")}function D0(t){return t==null?void 0:t.split(/\s+/).map(x0)}function M0(t){if(t){const{id:e,width:i,height:a}=t;return[e,i,a].filter(r=>r!=null).join(":")}}function x0(t){if(t){const[e,i,a]=t.split(":");return{id:e,width:+i,height:+a}}}function O0(t){return t==null?void 0:t.map(P0).join(" ")}function N0(t){return t==null?void 0:t.split(/\s+/).map($0)}function P0(t){if(t){const{id:e,kind:i,language:a,label:r}=t;return[e,i,a,r].filter(n=>n!=null).join(":")}}function $0(t){if(t){const[e,i,a,r]=t.split(":");return{id:e,kind:i,language:a,label:r}}}function U0(t){return t.replace(/[-_]([a-z])/g,(e,i)=>i.toUpperCase())}function Ku(t){return typeof t=="number"&&!Number.isNaN(t)&&Number.isFinite(t)}function Zp(t){return typeof t!="string"?!1:!isNaN(t)&&!isNaN(parseFloat(t))}const Xp=t=>new Promise(e=>setTimeout(e,t)),H0={"Start airplay":"Start airplay","Stop airplay":"Stop airplay",Audio:"Audio",Captions:"Captions","Enable captions":"Enable captions","Disable captions":"Disable captions","Start casting":"Start casting","Stop casting":"Stop casting","Enter fullscreen mode":"Enter fullscreen mode","Exit fullscreen mode":"Exit fullscreen mode",Mute:"Mute",Unmute:"Unmute",Loop:"Loop","Enter picture in picture mode":"Enter picture in picture mode","Exit picture in picture mode":"Exit picture in picture mode",Play:"Play",Pause:"Pause","Playback rate":"Playback rate","Playback rate {playbackRate}":"Playback rate {playbackRate}",Quality:"Quality","Seek backward":"Seek backward","Seek forward":"Seek forward",Settings:"Settings",Auto:"Auto","audio player":"audio player","video player":"video player",volume:"volume",seek:"seek","closed captions":"closed captions","current playback rate":"current playback rate","playback time":"playback time","media loading":"media loading",settings:"settings","audio tracks":"audio tracks",quality:"quality",play:"play",pause:"pause",mute:"mute",unmute:"unmute","chapter: {chapterName}":"chapter: {chapterName}",live:"live",Off:"Off","start airplay":"start airplay","stop airplay":"stop airplay","start casting":"start casting","stop casting":"stop casting","enter fullscreen mode":"enter fullscreen mode","exit fullscreen mode":"exit fullscreen mode","enter picture in picture mode":"enter picture in picture mode","exit picture in picture mode":"exit picture in picture mode","seek to live":"seek to live","playing live":"playing live","seek back {seekOffset} seconds":"seek back {seekOffset} seconds","seek forward {seekOffset} seconds":"seek forward {seekOffset} seconds","Network Error":"Network Error","Decode Error":"Decode Error","Source Not Supported":"Source Not Supported","Encryption Error":"Encryption Error","A network error caused the media download to fail.":"A network error caused the media download to fail.","A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.":"A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format.","An unsupported error occurred. The server or network failed, or your browser does not support this format.":"An unsupported error occurred. The server or network failed, or your browser does not support this format.","The media is encrypted and there are no keys to decrypt it.":"The media is encrypted and there are no keys to decrypt it.",hour:"hour",hours:"hours",minute:"minute",minutes:"minutes",second:"second",seconds:"seconds","{time} remaining":"{time} remaining","{currentTime} of {totalTime}":"{currentTime} of {totalTime}","video not loaded, unknown time.":"video not loaded, unknown time."};var $h;const Yl={en:H0};let gd=(($h=globalThis.navigator)==null?void 0:$h.language)||"en";const B0=t=>{gd=t},W0=t=>{var e,i,a;const[r]=gd.split("-");return((e=Yl[gd])==null?void 0:e[t])||((i=Yl[r])==null?void 0:i[t])||((a=Yl.en)==null?void 0:a[t])||t},C=(t,e={})=>W0(t).replace(/\{(\w+)\}/g,(i,a)=>a in e?String(e[a]):`{${a}}`),Uh=[{singular:"hour",plural:"hours"},{singular:"minute",plural:"minutes"},{singular:"second",plural:"seconds"}],F0=(t,e)=>{const i=C(t===1?Uh[e].singular:Uh[e].plural);return`${t} ${i}`},Tn=t=>{if(!Ku(t))return"";const e=Math.abs(t),i=e!==t,a=new Date(0,0,0,0,0,e,0),n=[a.getHours(),a.getMinutes(),a.getSeconds()].map((s,o)=>s&&F0(s,o)).filter(s=>s).join(", ");return i?C("{time} remaining",{time:n}):n};function Yi(t,e){let i=!1;t<0&&(i=!0,t=0-t),t=t<0?0:t;let a=Math.floor(t%60),r=Math.floor(t/60%60),n=Math.floor(t/3600);const s=Math.floor(e/60%60),o=Math.floor(e/3600);return(isNaN(t)||t===1/0)&&(n=r=a="0"),n=n>0||o>0?n+":":"",r=((n||s>=10)&&r<10?"0"+r:r)+":",a=a<10?"0"+a:a,(i?"-":"")+n+r+a}let Jp=class{addEventListener(){}removeEventListener(){}dispatchEvent(){return!0}};class ev extends Jp{}let Hh=class extends ev{constructor(){super(...arguments),this.role=null}};class K0{observe(){}unobserve(){}disconnect(){}}const tv={createElement:function(){return new $n.HTMLElement},createElementNS:function(){return new $n.HTMLElement},addEventListener(){},removeEventListener(){},dispatchEvent(t){return!1}},$n={ResizeObserver:K0,document:tv,Node:ev,Element:Hh,HTMLElement:class extends Hh{constructor(){super(...arguments),this.innerHTML=""}get content(){return new $n.DocumentFragment}},DocumentFragment:class extends Jp{},customElements:{get:function(){},define:function(){},whenDefined:function(){}},localStorage:{getItem(t){return null},setItem(t,e){},removeItem(t){}},CustomEvent:function(){},getComputedStyle:function(){},navigator:{languages:[],get userAgent(){return""}},matchMedia(t){return{matches:!1,media:t}},DOMParser:class{parseFromString(e,i){return{body:{textContent:e}}}}},iv="global"in globalThis&&(globalThis==null?void 0:globalThis.global)===globalThis||typeof window>"u"||typeof window.customElements>"u",av=Object.keys($n).every(t=>t in globalThis),g=iv&&!av?$n:globalThis,ke=iv&&!av?tv:globalThis.document,Bh=new WeakMap,Vu=t=>{let e=Bh.get(t);return e||Bh.set(t,e=new Set),e},rv=new g.ResizeObserver(t=>{for(const e of t)for(const i of Vu(e.target))i(e)});function Tr(t,e){Vu(t).add(e),rv.observe(t)}function Ar(t,e){const i=Vu(t);i.delete(e),i.size||rv.unobserve(t)}function lt(t){const e={};for(const i of t)e[i.name]=i.value;return e}function Xe(t){var e;return(e=yd(t))!=null?e:Rr(t,"media-controller")}function yd(t){var e;const{MEDIA_CONTROLLER:i}=X,a=t.getAttribute(i);if(a)return(e=fl(t))==null?void 0:e.getElementById(a)}const nv=(t,e,i=".value")=>{const a=t.querySelector(i);a&&(a.textContent=e)},V0=(t,e)=>{const i=`slot[name="${e}"]`,a=t.shadowRoot.querySelector(i);return a?a.children:[]},sv=(t,e)=>V0(t,e)[0],Ai=(t,e)=>!t||!e?!1:t!=null&&t.contains(e)?!0:Ai(t,e.getRootNode().host),Rr=(t,e)=>{if(!t)return null;const i=t.closest(e);return i||Rr(t.getRootNode().host,e)};function qu(t=document){var e;const i=t==null?void 0:t.activeElement;return i?(e=qu(i.shadowRoot))!=null?e:i:null}function fl(t){var e;const i=(e=t==null?void 0:t.getRootNode)==null?void 0:e.call(t);return i instanceof ShadowRoot||i instanceof Document?i:null}function ov(t,{depth:e=3,checkOpacity:i=!0,checkVisibilityCSS:a=!0}={}){if(t.checkVisibility)return t.checkVisibility({checkOpacity:i,checkVisibilityCSS:a});let r=t;for(;r&&e>0;){const n=getComputedStyle(r);if(i&&n.opacity==="0"||a&&n.visibility==="hidden"||n.display==="none")return!1;r=r.parentElement,e--}return!0}function q0(t,e,i,a){const r=a.x-i.x,n=a.y-i.y,s=r*r+n*n;if(s===0)return 0;const o=((t-i.x)*r+(e-i.y)*n)/s;return Math.max(0,Math.min(1,o))}function Re(t,e){const i=Y0(t,a=>a===e);return i||Yu(t,e)}function Y0(t,e){var i,a;let r;for(r of(i=t.querySelectorAll("style:not([media])"))!=null?i:[]){let n;try{n=(a=r.sheet)==null?void 0:a.cssRules}catch{continue}for(const s of n??[])if(e(s.selectorText))return s}}function Yu(t,e){var i,a;const r=(i=t.querySelectorAll("style:not([media])"))!=null?i:[],n=r==null?void 0:r[r.length-1];if(!(n!=null&&n.sheet))return console.warn("Media Chrome: No style sheet found on style tag of",t),{style:{setProperty:()=>{},removeProperty:()=>"",getPropertyValue:()=>""}};const s=n==null?void 0:n.sheet.insertRule(`${e}{}`,n.sheet.cssRules.length);return(a=n.sheet.cssRules)==null?void 0:a[s]}function se(t,e,i=Number.NaN){const a=t.getAttribute(e);return a!=null?+a:i}function ve(t,e,i){const a=+i;if(i==null||Number.isNaN(a)){t.hasAttribute(e)&&t.removeAttribute(e);return}se(t,e,void 0)!==a&&t.setAttribute(e,`${a}`)}function Y(t,e){return t.hasAttribute(e)}function G(t,e,i){if(i==null){t.hasAttribute(e)&&t.removeAttribute(e);return}Y(t,e)!=i&&t.toggleAttribute(e,i)}function ce(t,e,i=null){var a;return(a=t.getAttribute(e))!=null?a:i}function oe(t,e,i){if(i==null){t.hasAttribute(e)&&t.removeAttribute(e);return}const a=`${i}`;ce(t,e,void 0)!==a&&t.setAttribute(e,a)}var lv=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},At=(t,e,i)=>(lv(t,e,"read from private field"),i?i.call(t):e.get(t)),G0=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},as=(t,e,i,a)=>(lv(t,e,"write to private field"),e.set(t,i),i),$e;function z0(t){return`
    <style>
      :host {
        display: var(--media-control-display, var(--media-gesture-receiver-display, inline-block));
        box-sizing: border-box;
      }
    </style>
  `}class El extends g.HTMLElement{constructor(){if(super(),G0(this,$e,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=lt(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[X.MEDIA_CONTROLLER,h.MEDIA_PAUSED]}attributeChangedCallback(e,i,a){var r,n,s,o,l;e===X.MEDIA_CONTROLLER&&(i&&((n=(r=At(this,$e))==null?void 0:r.unassociateElement)==null||n.call(r,this),as(this,$e,null)),a&&this.isConnected&&(as(this,$e,(s=this.getRootNode())==null?void 0:s.getElementById(a)),(l=(o=At(this,$e))==null?void 0:o.associateElement)==null||l.call(o,this)))}connectedCallback(){var e,i;this.tabIndex=-1,this.setAttribute("aria-hidden","true"),as(this,$e,Q0(this)),this.getAttribute(X.MEDIA_CONTROLLER)&&((i=(e=At(this,$e))==null?void 0:e.associateElement)==null||i.call(e,this)),At(this,$e)&&(At(this,$e).addEventListener("pointerdown",this),At(this,$e).addEventListener("click",this),At(this,$e).hasAttribute("tabindex")||(At(this,$e).tabIndex=0))}disconnectedCallback(){var e,i,a,r;this.getAttribute(X.MEDIA_CONTROLLER)&&((i=(e=At(this,$e))==null?void 0:e.unassociateElement)==null||i.call(e,this)),(a=At(this,$e))==null||a.removeEventListener("pointerdown",this),(r=At(this,$e))==null||r.removeEventListener("click",this),as(this,$e,null)}handleEvent(e){var i;const a=(i=e.composedPath())==null?void 0:i[0];if(["video","media-controller"].includes(a==null?void 0:a.localName)){if(e.type==="pointerdown")this._pointerType=e.pointerType;else if(e.type==="click"){const{clientX:n,clientY:s}=e,{left:o,top:l,width:c,height:p}=this.getBoundingClientRect(),m=n-o,u=s-l;if(m<0||u<0||m>c||u>p||c===0&&p===0)return;const d=this._pointerType||"mouse";if(this._pointerType=void 0,d===ql.TOUCH){this.handleTap(e);return}else if(d===ql.MOUSE||d===ql.PEN){this.handleMouseClick(e);return}}}}get mediaPaused(){return Y(this,h.MEDIA_PAUSED)}set mediaPaused(e){G(this,h.MEDIA_PAUSED,e)}handleTap(e){}handleMouseClick(e){const i=this.mediaPaused?D.MEDIA_PLAY_REQUEST:D.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new g.CustomEvent(i,{composed:!0,bubbles:!0}))}}$e=new WeakMap;El.shadowRootOptions={mode:"open"};El.getTemplateHTML=z0;function Q0(t){var e;const i=t.getAttribute(X.MEDIA_CONTROLLER);return i?(e=t.getRootNode())==null?void 0:e.getElementById(i):Rr(t,"media-controller")}g.customElements.get("media-gesture-receiver")||g.customElements.define("media-gesture-receiver",El);var Wh=El,Gu=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},fe=(t,e,i)=>(Gu(t,e,"read from private field"),i?i.call(t):e.get(t)),Ye=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},St=(t,e,i,a)=>(Gu(t,e,"write to private field"),e.set(t,i),i),Nt=(t,e,i)=>(Gu(t,e,"access private method"),i),Jr,$o,Pa,kr,nr,Td,$a,xs,Ad,dv,kd,uv,Un,_l,bl,zu,wr,Hn,Ii,Os;const P={AUDIO:"audio",AUTOHIDE:"autohide",BREAKPOINTS:"breakpoints",GESTURES_DISABLED:"gesturesdisabled",KEYBOARD_CONTROL:"keyboardcontrol",NO_AUTOHIDE:"noautohide",USER_INACTIVE:"userinactive",AUTOHIDE_OVER_CONTROLS:"autohideovercontrols"};function j0(t){return`
    <style>
      
      :host([${h.MEDIA_IS_FULLSCREEN}]) ::slotted([slot=media]) {
        outline: none;
      }

      :host {
        box-sizing: border-box;
        position: relative;
        display: inline-block;
        line-height: 0;
        background-color: var(--media-background-color, #000);
        overflow: hidden;
      }

      :host(:not([${P.AUDIO}])) [part~=layer]:not([part~=media-layer]) {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        flex-flow: column nowrap;
        align-items: start;
        pointer-events: none;
        background: none;
      }

      slot[name=media] {
        display: var(--media-slot-display, contents);
      }

      
      :host([${P.AUDIO}]) slot[name=media] {
        display: var(--media-slot-display, none);
      }

      
      :host([${P.AUDIO}]) [part~=layer][part~=gesture-layer] {
        height: 0;
        display: block;
      }

      
      :host(:not([${P.AUDIO}])[${P.GESTURES_DISABLED}]) ::slotted([slot=gestures-chrome]),
          :host(:not([${P.AUDIO}])[${P.GESTURES_DISABLED}]) media-gesture-receiver[slot=gestures-chrome] {
        display: none;
      }

      
      ::slotted(:not([slot=media]):not([slot=poster]):not(media-loading-indicator):not([role=dialog]):not([hidden])) {
        pointer-events: auto;
      }

      :host(:not([${P.AUDIO}])) *[part~=layer][part~=centered-layer] {
        align-items: center;
        justify-content: center;
      }

      :host(:not([${P.AUDIO}])) ::slotted(media-gesture-receiver[slot=gestures-chrome]),
      :host(:not([${P.AUDIO}])) media-gesture-receiver[slot=gestures-chrome] {
        align-self: stretch;
        flex-grow: 1;
      }

      slot[name=middle-chrome] {
        display: inline;
        flex-grow: 1;
        pointer-events: none;
        background: none;
      }

      
      ::slotted([slot=media]),
      ::slotted([slot=poster]) {
        width: 100%;
        height: 100%;
      }

      
      :host(:not([${P.AUDIO}])) .spacer {
        flex-grow: 1;
      }

      
      :host(:-webkit-full-screen) {
        
        width: 100% !important;
        height: 100% !important;
      }

      
      ::slotted(:not([slot=media]):not([slot=poster]):not([${P.NO_AUTOHIDE}]):not([hidden]):not([role=dialog])) {
        opacity: 1;
        transition: var(--media-control-transition-in, opacity 0.25s);
      }

      
      :host([${P.USER_INACTIVE}]:not([${h.MEDIA_PAUSED}]):not([${h.MEDIA_IS_AIRPLAYING}]):not([${h.MEDIA_IS_CASTING}]):not([${P.AUDIO}])) ::slotted(:not([slot=media]):not([slot=poster]):not([${P.NO_AUTOHIDE}]):not([role=dialog])) {
        opacity: 0;
        transition: var(--media-control-transition-out, opacity 1s);
      }

      :host([${P.USER_INACTIVE}]:not([${P.NO_AUTOHIDE}]):not([${h.MEDIA_PAUSED}]):not([${h.MEDIA_IS_CASTING}]):not([${P.AUDIO}])) ::slotted([slot=media]) {
        cursor: none;
      }

      :host([${P.USER_INACTIVE}][${P.AUTOHIDE_OVER_CONTROLS}]:not([${P.NO_AUTOHIDE}]):not([${h.MEDIA_PAUSED}]):not([${h.MEDIA_IS_CASTING}]):not([${P.AUDIO}])) * {
        --media-cursor: none;
        cursor: none;
      }


      ::slotted(media-control-bar)  {
        align-self: stretch;
      }

      
      :host(:not([${P.AUDIO}])[${h.MEDIA_HAS_PLAYED}]) slot[name=poster] {
        display: none;
      }

      ::slotted([role=dialog]) {
        width: 100%;
        height: 100%;
        align-self: center;
      }

      ::slotted([role=menu]) {
        align-self: end;
      }
    </style>

    <slot name="media" part="layer media-layer"></slot>
    <slot name="poster" part="layer poster-layer"></slot>
    <slot name="gestures-chrome" part="layer gesture-layer">
      <media-gesture-receiver slot="gestures-chrome">
        <template shadowrootmode="${Wh.shadowRootOptions.mode}">
          ${Wh.getTemplateHTML({})}
        </template>
      </media-gesture-receiver>
    </slot>
    <span part="layer vertical-layer">
      <slot name="top-chrome" part="top chrome"></slot>
      <slot name="middle-chrome" part="middle chrome"></slot>
      <slot name="centered-chrome" part="layer centered-layer center centered chrome"></slot>
      
      <slot part="bottom chrome"></slot>
    </span>
    <slot name="dialog" part="layer dialog-layer"></slot>
  `}const Z0=Object.values(h),X0="sm:384 md:576 lg:768 xl:960";function J0(t){cv(t.target,t.contentRect.width)}function cv(t,e){var i;if(!t.isConnected)return;const a=(i=t.getAttribute(P.BREAKPOINTS))!=null?i:X0,r=e1(a),n=t1(r,e);let s=!1;if(Object.keys(r).forEach(o=>{if(n.includes(o)){t.hasAttribute(`breakpoint${o}`)||(t.setAttribute(`breakpoint${o}`,""),s=!0);return}t.hasAttribute(`breakpoint${o}`)&&(t.removeAttribute(`breakpoint${o}`),s=!0)}),s){const o=new CustomEvent(ni.BREAKPOINTS_CHANGE,{detail:n});t.dispatchEvent(o)}t.breakpointsComputed||(t.breakpointsComputed=!0,t.dispatchEvent(new CustomEvent(ni.BREAKPOINTS_COMPUTED,{bubbles:!0,composed:!0})))}function e1(t){const e=t.split(/\s+/);return Object.fromEntries(e.map(i=>i.split(":")))}function t1(t,e){return Object.keys(t).filter(i=>e>=parseInt(t[i]))}class gl extends g.HTMLElement{constructor(){if(super(),Ye(this,Ad),Ye(this,kd),Ye(this,Un),Ye(this,bl),Ye(this,wr),Ye(this,Jr,void 0),Ye(this,$o,0),Ye(this,Pa,null),Ye(this,kr,null),Ye(this,nr,void 0),this.breakpointsComputed=!1,Ye(this,Td,e=>{const i=this.media;for(const a of e){if(a.type!=="childList")continue;const r=a.removedNodes;for(const n of r){if(n.slot!="media"||a.target!=this)continue;let s=a.previousSibling&&a.previousSibling.previousElementSibling;if(!s||!i)this.mediaUnsetCallback(n);else{let o=s.slot!=="media";for(;(s=s.previousSibling)!==null;)s.slot=="media"&&(o=!1);o&&this.mediaUnsetCallback(n)}}if(i)for(const n of a.addedNodes)n===i&&this.handleMediaUpdated(i)}}),Ye(this,$a,!1),Ye(this,xs,e=>{fe(this,$a)||(setTimeout(()=>{J0(e),St(this,$a,!1)},0),St(this,$a,!0))}),Ye(this,Ii,void 0),Ye(this,Os,()=>{if(!fe(this,Ii).assignedElements({flatten:!0}).length){fe(this,Pa)&&this.mediaUnsetCallback(fe(this,Pa));return}this.handleMediaUpdated(this.media)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=lt(this.attributes),i=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(i):this.shadowRoot.innerHTML=i}St(this,Jr,new MutationObserver(fe(this,Td)))}static get observedAttributes(){return[P.AUTOHIDE,P.GESTURES_DISABLED].concat(Z0).filter(e=>![h.MEDIA_RENDITION_LIST,h.MEDIA_AUDIO_TRACK_LIST,h.MEDIA_CHAPTERS_CUES,h.MEDIA_WIDTH,h.MEDIA_HEIGHT,h.MEDIA_ERROR,h.MEDIA_ERROR_MESSAGE].includes(e))}attributeChangedCallback(e,i,a){e.toLowerCase()==P.AUTOHIDE&&(this.autohide=a)}get media(){let e=this.querySelector(":scope > [slot=media]");return(e==null?void 0:e.nodeName)=="SLOT"&&(e=e.assignedElements({flatten:!0})[0]),e}async handleMediaUpdated(e){e&&(St(this,Pa,e),e.localName.includes("-")&&await g.customElements.whenDefined(e.localName),this.mediaSetCallback(e))}connectedCallback(){var e;fe(this,Jr).observe(this,{childList:!0,subtree:!0}),Tr(this,fe(this,xs));const i=this.getAttribute(P.AUDIO)!=null,a=C(i?"audio player":"video player");this.setAttribute("role","region"),this.setAttribute("aria-label",a),this.handleMediaUpdated(this.media),this.setAttribute(P.USER_INACTIVE,""),cv(this,this.getBoundingClientRect().width);const r=this.querySelector(":scope > slot[slot=media]");r&&(St(this,Ii,r),fe(this,Ii).addEventListener("slotchange",fe(this,Os))),this.addEventListener("pointerdown",this),this.addEventListener("pointermove",this),this.addEventListener("pointerup",this),this.addEventListener("mouseleave",this),this.addEventListener("keyup",this),(e=g.window)==null||e.addEventListener("mouseup",this)}disconnectedCallback(){var e;Ar(this,fe(this,xs)),clearTimeout(fe(this,kr)),fe(this,Jr).disconnect(),this.media&&this.mediaUnsetCallback(this.media),(e=g.window)==null||e.removeEventListener("mouseup",this),this.removeEventListener("pointerdown",this),this.removeEventListener("pointermove",this),this.removeEventListener("pointerup",this),this.removeEventListener("mouseleave",this),this.removeEventListener("keyup",this),fe(this,Ii)&&(fe(this,Ii).removeEventListener("slotchange",fe(this,Os)),St(this,Ii,null)),St(this,$a,!1)}mediaSetCallback(e){}mediaUnsetCallback(e){St(this,Pa,null)}handleEvent(e){switch(e.type){case"pointerdown":St(this,$o,e.timeStamp);break;case"pointermove":Nt(this,Ad,dv).call(this,e);break;case"pointerup":Nt(this,kd,uv).call(this,e);break;case"mouseleave":Nt(this,Un,_l).call(this);break;case"mouseup":this.removeAttribute(P.KEYBOARD_CONTROL);break;case"keyup":Nt(this,wr,Hn).call(this),this.setAttribute(P.KEYBOARD_CONTROL,"");break}}set autohide(e){const i=Number(e);St(this,nr,isNaN(i)?0:i)}get autohide(){return(fe(this,nr)===void 0?2:fe(this,nr)).toString()}get breakpoints(){return ce(this,P.BREAKPOINTS)}set breakpoints(e){oe(this,P.BREAKPOINTS,e)}get audio(){return Y(this,P.AUDIO)}set audio(e){G(this,P.AUDIO,e)}get gesturesDisabled(){return Y(this,P.GESTURES_DISABLED)}set gesturesDisabled(e){G(this,P.GESTURES_DISABLED,e)}get keyboardControl(){return Y(this,P.KEYBOARD_CONTROL)}set keyboardControl(e){G(this,P.KEYBOARD_CONTROL,e)}get noAutohide(){return Y(this,P.NO_AUTOHIDE)}set noAutohide(e){G(this,P.NO_AUTOHIDE,e)}get autohideOverControls(){return Y(this,P.AUTOHIDE_OVER_CONTROLS)}set autohideOverControls(e){G(this,P.AUTOHIDE_OVER_CONTROLS,e)}get userInteractive(){return Y(this,P.USER_INACTIVE)}set userInteractive(e){G(this,P.USER_INACTIVE,e)}}Jr=new WeakMap;$o=new WeakMap;Pa=new WeakMap;kr=new WeakMap;nr=new WeakMap;Td=new WeakMap;$a=new WeakMap;xs=new WeakMap;Ad=new WeakSet;dv=function(t){if(t.pointerType!=="mouse"&&t.timeStamp-fe(this,$o)<250)return;Nt(this,bl,zu).call(this),clearTimeout(fe(this,kr));const e=this.hasAttribute(P.AUTOHIDE_OVER_CONTROLS);([this,this.media].includes(t.target)||e)&&Nt(this,wr,Hn).call(this)};kd=new WeakSet;uv=function(t){if(t.pointerType==="touch"){const e=!this.hasAttribute(P.USER_INACTIVE);[this,this.media].includes(t.target)&&e?Nt(this,Un,_l).call(this):Nt(this,wr,Hn).call(this)}else t.composedPath().some(e=>["media-play-button","media-fullscreen-button"].includes(e==null?void 0:e.localName))&&Nt(this,wr,Hn).call(this)};Un=new WeakSet;_l=function(){if(fe(this,nr)<0||this.hasAttribute(P.USER_INACTIVE))return;this.setAttribute(P.USER_INACTIVE,"");const t=new g.CustomEvent(ni.USER_INACTIVE_CHANGE,{composed:!0,bubbles:!0,detail:!0});this.dispatchEvent(t)};bl=new WeakSet;zu=function(){if(!this.hasAttribute(P.USER_INACTIVE))return;this.removeAttribute(P.USER_INACTIVE);const t=new g.CustomEvent(ni.USER_INACTIVE_CHANGE,{composed:!0,bubbles:!0,detail:!1});this.dispatchEvent(t)};wr=new WeakSet;Hn=function(){Nt(this,bl,zu).call(this),clearTimeout(fe(this,kr));const t=parseInt(this.autohide);t<0||St(this,kr,setTimeout(()=>{Nt(this,Un,_l).call(this)},t*1e3))};Ii=new WeakMap;Os=new WeakMap;gl.shadowRootOptions={mode:"open"};gl.getTemplateHTML=j0;g.customElements.get("media-container")||g.customElements.define("media-container",gl);var hv=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},xe=(t,e,i)=>(hv(t,e,"read from private field"),i?i.call(t):e.get(t)),Pr=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},rs=(t,e,i,a)=>(hv(t,e,"write to private field"),e.set(t,i),i),Ua,Ha,Uo,ma,ui,Ri;class Qu{constructor(e,i,{defaultValue:a}={defaultValue:void 0}){Pr(this,ui),Pr(this,Ua,void 0),Pr(this,Ha,void 0),Pr(this,Uo,void 0),Pr(this,ma,new Set),rs(this,Ua,e),rs(this,Ha,i),rs(this,Uo,new Set(a))}[Symbol.iterator](){return xe(this,ui,Ri).values()}get length(){return xe(this,ui,Ri).size}get value(){var e;return(e=[...xe(this,ui,Ri)].join(" "))!=null?e:""}set value(e){var i;e!==this.value&&(rs(this,ma,new Set),this.add(...(i=e==null?void 0:e.split(" "))!=null?i:[]))}toString(){return this.value}item(e){return[...xe(this,ui,Ri)][e]}values(){return xe(this,ui,Ri).values()}forEach(e,i){xe(this,ui,Ri).forEach(e,i)}add(...e){var i,a;e.forEach(r=>xe(this,ma).add(r)),!(this.value===""&&!((i=xe(this,Ua))!=null&&i.hasAttribute(`${xe(this,Ha)}`)))&&((a=xe(this,Ua))==null||a.setAttribute(`${xe(this,Ha)}`,`${this.value}`))}remove(...e){var i;e.forEach(a=>xe(this,ma).delete(a)),(i=xe(this,Ua))==null||i.setAttribute(`${xe(this,Ha)}`,`${this.value}`)}contains(e){return xe(this,ui,Ri).has(e)}toggle(e,i){return typeof i<"u"?i?(this.add(e),!0):(this.remove(e),!1):this.contains(e)?(this.remove(e),!1):(this.add(e),!0)}replace(e,i){return this.remove(e),this.add(i),e===i}}Ua=new WeakMap;Ha=new WeakMap;Uo=new WeakMap;ma=new WeakMap;ui=new WeakSet;Ri=function(){return xe(this,ma).size?xe(this,ma):xe(this,Uo)};const i1=(t="")=>t.split(/\s+/),mv=(t="")=>{const[e,i,a]=t.split(":"),r=a?decodeURIComponent(a):void 0;return{kind:e==="cc"?ai.CAPTIONS:ai.SUBTITLES,language:i,label:r}},yl=(t="",e={})=>i1(t).map(i=>{const a=mv(i);return{...e,...a}}),pv=t=>t?Array.isArray(t)?t.map(e=>typeof e=="string"?mv(e):e):typeof t=="string"?yl(t):[t]:[],wd=({kind:t,label:e,language:i}={kind:"subtitles"})=>e?`${t==="captions"?"cc":"sb"}:${i}:${encodeURIComponent(e)}`:i,Bn=(t=[])=>Array.prototype.map.call(t,wd).join(" "),a1=(t,e)=>i=>i[t]===e,vv=t=>{const e=Object.entries(t).map(([i,a])=>a1(i,a));return i=>e.every(a=>a(i))},An=(t,e=[],i=[])=>{const a=pv(i).map(vv),r=n=>a.some(s=>s(n));Array.from(e).filter(r).forEach(n=>{n.mode=t})},Tl=(t,e=()=>!0)=>{if(!(t!=null&&t.textTracks))return[];const i=typeof e=="function"?e:vv(e);return Array.from(t.textTracks).filter(i)},fv=t=>{var e;return!!((e=t.mediaSubtitlesShowing)!=null&&e.length)||t.hasAttribute(h.MEDIA_SUBTITLES_SHOWING)},r1=t=>{var e;const{media:i,fullscreenElement:a}=t;try{const r=a&&"requestFullscreen"in a?"requestFullscreen":a&&"webkitRequestFullScreen"in a?"webkitRequestFullScreen":void 0;if(r){const n=(e=a[r])==null?void 0:e.call(a);if(n instanceof Promise)return n.catch(()=>{})}else i!=null&&i.webkitEnterFullscreen?i.webkitEnterFullscreen():i!=null&&i.requestFullscreen&&i.requestFullscreen()}catch(r){console.error(r)}},Fh="exitFullscreen"in ke?"exitFullscreen":"webkitExitFullscreen"in ke?"webkitExitFullscreen":"webkitCancelFullScreen"in ke?"webkitCancelFullScreen":void 0,n1=t=>{var e;const{documentElement:i}=t;if(Fh){const a=(e=i==null?void 0:i[Fh])==null?void 0:e.call(i);if(a instanceof Promise)return a.catch(()=>{})}},en="fullscreenElement"in ke?"fullscreenElement":"webkitFullscreenElement"in ke?"webkitFullscreenElement":void 0,s1=t=>{const{documentElement:e,media:i}=t,a=e==null?void 0:e[en];return!a&&"webkitDisplayingFullscreen"in i&&"webkitPresentationMode"in i&&i.webkitDisplayingFullscreen&&i.webkitPresentationMode===L0.FULLSCREEN?i:a},o1=t=>{var e;const{media:i,documentElement:a,fullscreenElement:r=i}=t;if(!i||!a)return!1;const n=s1(t);if(!n)return!1;if(n===r||n===i)return!0;if(n.localName.includes("-")){let s=n.shadowRoot;if(!(en in s))return Ai(n,r);for(;s!=null&&s[en];){if(s[en]===r)return!0;s=(e=s[en])==null?void 0:e.shadowRoot}}return!1},l1="fullscreenEnabled"in ke?"fullscreenEnabled":"webkitFullscreenEnabled"in ke?"webkitFullscreenEnabled":void 0,d1=t=>{const{documentElement:e,media:i}=t;return!!(e!=null&&e[l1])||i&&"webkitSupportsFullscreen"in i};let ns;const ju=()=>{var t,e;return ns||(ns=(e=(t=ke)==null?void 0:t.createElement)==null?void 0:e.call(t,"video"),ns)},u1=async(t=ju())=>{if(!t)return!1;const e=t.volume;t.volume=e/2+.1;const i=new AbortController,a=await Promise.race([c1(t,i.signal),h1(t,e)]);return i.abort(),a},c1=(t,e)=>new Promise(i=>{t.addEventListener("volumechange",()=>i(!0),{signal:e})}),h1=async(t,e)=>{for(let i=0;i<10;i++){if(t.volume===e)return!1;await Xp(10)}return t.volume!==e},m1=/.*Version\/.*Safari\/.*/.test(g.navigator.userAgent),Ev=(t=ju())=>g.matchMedia("(display-mode: standalone)").matches&&m1?!1:typeof(t==null?void 0:t.requestPictureInPicture)=="function",_v=(t=ju())=>d1({documentElement:ke,media:t}),p1=_v(),v1=Ev(),f1=!!g.WebKitPlaybackTargetAvailabilityEvent,E1=!!g.chrome,Ho=t=>Tl(t.media,e=>[ai.SUBTITLES,ai.CAPTIONS].includes(e.kind)).sort((e,i)=>e.kind>=i.kind?1:-1),bv=t=>Tl(t.media,e=>e.mode===hr.SHOWING&&[ai.SUBTITLES,ai.CAPTIONS].includes(e.kind)),gv=(t,e)=>{const i=Ho(t),a=bv(t),r=!!a.length;if(i.length){if(e===!1||r&&e!==!0)An(hr.DISABLED,i,a);else if(e===!0||!r&&e!==!1){let n=i[0];const{options:s}=t;if(!(s!=null&&s.noSubtitlesLangPref)){const p=g.localStorage.getItem("media-chrome-pref-subtitles-lang"),m=p?[p,...g.navigator.languages]:g.navigator.languages,u=i.filter(d=>m.some(v=>d.language.toLowerCase().startsWith(v.split("-")[0]))).sort((d,v)=>{const f=m.findIndex(E=>d.language.toLowerCase().startsWith(E.split("-")[0])),b=m.findIndex(E=>v.language.toLowerCase().startsWith(E.split("-")[0]));return f-b});u[0]&&(n=u[0])}const{language:o,label:l,kind:c}=n;An(hr.DISABLED,i,a),An(hr.SHOWING,i,[{language:o,label:l,kind:c}])}}},Zu=(t,e)=>t===e?!0:t==null||e==null||typeof t!=typeof e?!1:typeof t=="number"&&Number.isNaN(t)&&Number.isNaN(e)?!0:typeof t!="object"?!1:Array.isArray(t)?_1(t,e):Object.entries(t).every(([i,a])=>i in e&&Zu(a,e[i])),_1=(t,e)=>{const i=Array.isArray(t),a=Array.isArray(e);return i!==a?!1:i||a?t.length!==e.length?!1:t.every((r,n)=>Zu(r,e[n])):!0},b1=Object.values(pi);let Bo;const g1=u1().then(t=>(Bo=t,Bo)),y1=async(...t)=>{await Promise.all(t.filter(e=>e).map(async e=>{if(!("localName"in e&&e instanceof g.HTMLElement))return;const i=e.localName;if(!i.includes("-"))return;const a=g.customElements.get(i);a&&e instanceof a||(await g.customElements.whenDefined(i),g.customElements.upgrade(e))}))},T1=new g.DOMParser,A1=t=>t&&(T1.parseFromString(t,"text/html").body.textContent||t),tn={mediaError:{get(t,e){const{media:i}=t;if((e==null?void 0:e.type)!=="playing")return i==null?void 0:i.error},mediaEvents:["emptied","error","playing"]},mediaErrorCode:{get(t,e){var i;const{media:a}=t;if((e==null?void 0:e.type)!=="playing")return(i=a==null?void 0:a.error)==null?void 0:i.code},mediaEvents:["emptied","error","playing"]},mediaErrorMessage:{get(t,e){var i,a;const{media:r}=t;if((e==null?void 0:e.type)!=="playing")return(a=(i=r==null?void 0:r.error)==null?void 0:i.message)!=null?a:""},mediaEvents:["emptied","error","playing"]},mediaWidth:{get(t){var e;const{media:i}=t;return(e=i==null?void 0:i.videoWidth)!=null?e:0},mediaEvents:["resize"]},mediaHeight:{get(t){var e;const{media:i}=t;return(e=i==null?void 0:i.videoHeight)!=null?e:0},mediaEvents:["resize"]},mediaPaused:{get(t){var e;const{media:i}=t;return(e=i==null?void 0:i.paused)!=null?e:!0},set(t,e){var i;const{media:a}=e;a&&(t?a.pause():(i=a.play())==null||i.catch(()=>{}))},mediaEvents:["play","playing","pause","emptied"]},mediaHasPlayed:{get(t,e){const{media:i}=t;return i?e?e.type==="playing":!i.paused:!1},mediaEvents:["playing","emptied"]},mediaEnded:{get(t){var e;const{media:i}=t;return(e=i==null?void 0:i.ended)!=null?e:!1},mediaEvents:["seeked","ended","emptied"]},mediaPlaybackRate:{get(t){var e;const{media:i}=t;return(e=i==null?void 0:i.playbackRate)!=null?e:1},set(t,e){const{media:i}=e;i&&Number.isFinite(+t)&&(i.playbackRate=+t)},mediaEvents:["ratechange","loadstart"]},mediaMuted:{get(t){var e;const{media:i}=t;return(e=i==null?void 0:i.muted)!=null?e:!1},set(t,e){const{media:i,options:{noMutedPref:a}={}}=e;if(i){i.muted=t;try{const r=g.localStorage.getItem("media-chrome-pref-muted")!==null,n=i.hasAttribute("muted");if(a){r&&g.localStorage.removeItem("media-chrome-pref-muted");return}if(n&&!r)return;g.localStorage.setItem("media-chrome-pref-muted",t?"true":"false")}catch(r){console.debug("Error setting muted pref",r)}}},mediaEvents:["volumechange"],stateOwnersUpdateHandlers:[(t,e)=>{const{options:{noMutedPref:i}}=e,{media:a}=e;if(!(!a||a.muted||i))try{const r=g.localStorage.getItem("media-chrome-pref-muted")==="true";tn.mediaMuted.set(r,e),t(r)}catch(r){console.debug("Error getting muted pref",r)}}]},mediaLoop:{get(t){const{media:e}=t;return e==null?void 0:e.loop},set(t,e){const{media:i}=e;i&&(i.loop=t)},mediaEvents:["medialooprequest"]},mediaVolume:{get(t){var e;const{media:i}=t;return(e=i==null?void 0:i.volume)!=null?e:1},set(t,e){const{media:i,options:{noVolumePref:a}={}}=e;if(i){try{t==null?g.localStorage.removeItem("media-chrome-pref-volume"):!i.hasAttribute("muted")&&!a&&g.localStorage.setItem("media-chrome-pref-volume",t.toString())}catch(r){console.debug("Error setting volume pref",r)}Number.isFinite(+t)&&(i.volume=+t)}},mediaEvents:["volumechange"],stateOwnersUpdateHandlers:[(t,e)=>{const{options:{noVolumePref:i}}=e;if(!i)try{const{media:a}=e;if(!a)return;const r=g.localStorage.getItem("media-chrome-pref-volume");if(r==null)return;tn.mediaVolume.set(+r,e),t(+r)}catch(a){console.debug("Error getting volume pref",a)}}]},mediaVolumeLevel:{get(t){const{media:e}=t;return typeof(e==null?void 0:e.volume)>"u"?"high":e.muted||e.volume===0?"off":e.volume<.5?"low":e.volume<.75?"medium":"high"},mediaEvents:["volumechange"]},mediaCurrentTime:{get(t){var e;const{media:i}=t;return(e=i==null?void 0:i.currentTime)!=null?e:0},set(t,e){const{media:i}=e;!i||!Ku(t)||(i.currentTime=t)},mediaEvents:["timeupdate","loadedmetadata"]},mediaDuration:{get(t){const{media:e,options:{defaultDuration:i}={}}=t;return i&&(!e||!e.duration||Number.isNaN(e.duration)||!Number.isFinite(e.duration))?i:Number.isFinite(e==null?void 0:e.duration)?e.duration:Number.NaN},mediaEvents:["durationchange","loadedmetadata","emptied"]},mediaLoading:{get(t){const{media:e}=t;return(e==null?void 0:e.readyState)<3},mediaEvents:["waiting","playing","emptied"]},mediaSeekable:{get(t){var e;const{media:i}=t;if(!((e=i==null?void 0:i.seekable)!=null&&e.length))return;const a=i.seekable.start(0),r=i.seekable.end(i.seekable.length-1);if(!(!a&&!r))return[Number(a.toFixed(3)),Number(r.toFixed(3))]},mediaEvents:["loadedmetadata","emptied","progress","seekablechange"]},mediaBuffered:{get(t){var e;const{media:i}=t,a=(e=i==null?void 0:i.buffered)!=null?e:[];return Array.from(a).map((r,n)=>[Number(a.start(n).toFixed(3)),Number(a.end(n).toFixed(3))])},mediaEvents:["progress","emptied"]},mediaStreamType:{get(t){const{media:e,options:{defaultStreamType:i}={}}=t,a=[pi.LIVE,pi.ON_DEMAND].includes(i)?i:void 0;if(!e)return a;const{streamType:r}=e;if(b1.includes(r))return r===pi.UNKNOWN?a:r;const n=e.duration;return n===1/0?pi.LIVE:Number.isFinite(n)?pi.ON_DEMAND:a},mediaEvents:["emptied","durationchange","loadedmetadata","streamtypechange"]},mediaTargetLiveWindow:{get(t){const{media:e}=t;if(!e)return Number.NaN;const{targetLiveWindow:i}=e,a=tn.mediaStreamType.get(t);return(i==null||Number.isNaN(i))&&a===pi.LIVE?0:i},mediaEvents:["emptied","durationchange","loadedmetadata","streamtypechange","targetlivewindowchange"]},mediaTimeIsLive:{get(t){const{media:e,options:{liveEdgeOffset:i=10}={}}=t;if(!e)return!1;if(typeof e.liveEdgeStart=="number")return Number.isNaN(e.liveEdgeStart)?!1:e.currentTime>=e.liveEdgeStart;if(!(tn.mediaStreamType.get(t)===pi.LIVE))return!1;const r=e.seekable;if(!r)return!0;if(!r.length)return!1;const n=r.end(r.length-1)-i;return e.currentTime>=n},mediaEvents:["playing","timeupdate","progress","waiting","emptied"]},mediaSubtitlesList:{get(t){return Ho(t).map(({kind:e,label:i,language:a})=>({kind:e,label:i,language:a}))},mediaEvents:["loadstart"],textTracksEvents:["addtrack","removetrack"]},mediaSubtitlesShowing:{get(t){return bv(t).map(({kind:e,label:i,language:a})=>({kind:e,label:i,language:a}))},mediaEvents:["loadstart"],textTracksEvents:["addtrack","removetrack","change"],stateOwnersUpdateHandlers:[(t,e)=>{var i,a;const{media:r,options:n}=e;if(!r)return;const s=o=>{var l;!n.defaultSubtitles||o&&![ai.CAPTIONS,ai.SUBTITLES].includes((l=o==null?void 0:o.track)==null?void 0:l.kind)||gv(e,!0)};return r.addEventListener("loadstart",s),(i=r.textTracks)==null||i.addEventListener("addtrack",s),(a=r.textTracks)==null||a.addEventListener("removetrack",s),()=>{var o,l;r.removeEventListener("loadstart",s),(o=r.textTracks)==null||o.removeEventListener("addtrack",s),(l=r.textTracks)==null||l.removeEventListener("removetrack",s)}}]},mediaChaptersCues:{get(t){var e;const{media:i}=t;if(!i)return[];const[a]=Tl(i,{kind:ai.CHAPTERS});return Array.from((e=a==null?void 0:a.cues)!=null?e:[]).map(({text:r,startTime:n,endTime:s})=>({text:A1(r),startTime:n,endTime:s}))},mediaEvents:["loadstart","loadedmetadata"],textTracksEvents:["addtrack","removetrack","change"],stateOwnersUpdateHandlers:[(t,e)=>{var i;const{media:a}=e;if(!a)return;const r=a.querySelector('track[kind="chapters"][default][src]'),n=(i=a.shadowRoot)==null?void 0:i.querySelector(':is(video,audio) > track[kind="chapters"][default][src]');return r==null||r.addEventListener("load",t),n==null||n.addEventListener("load",t),()=>{r==null||r.removeEventListener("load",t),n==null||n.removeEventListener("load",t)}}]},mediaIsPip:{get(t){var e,i;const{media:a,documentElement:r}=t;if(!a||!r||!r.pictureInPictureElement)return!1;if(r.pictureInPictureElement===a)return!0;if(r.pictureInPictureElement instanceof HTMLMediaElement)return(e=a.localName)!=null&&e.includes("-")?Ai(a,r.pictureInPictureElement):!1;if(r.pictureInPictureElement.localName.includes("-")){let n=r.pictureInPictureElement.shadowRoot;for(;n!=null&&n.pictureInPictureElement;){if(n.pictureInPictureElement===a)return!0;n=(i=n.pictureInPictureElement)==null?void 0:i.shadowRoot}}return!1},set(t,e){const{media:i}=e;if(i)if(t){if(!ke.pictureInPictureEnabled){console.warn("MediaChrome: Picture-in-picture is not enabled");return}if(!i.requestPictureInPicture){console.warn("MediaChrome: The current media does not support picture-in-picture");return}const a=()=>{console.warn("MediaChrome: The media is not ready for picture-in-picture. It must have a readyState > 0.")};i.requestPictureInPicture().catch(r=>{if(r.code===11){if(!i.src){console.warn("MediaChrome: The media is not ready for picture-in-picture. It must have a src set.");return}if(i.readyState===0&&i.preload==="none"){const n=()=>{i.removeEventListener("loadedmetadata",s),i.preload="none"},s=()=>{i.requestPictureInPicture().catch(a),n()};i.addEventListener("loadedmetadata",s),i.preload="metadata",setTimeout(()=>{i.readyState===0&&a(),n()},1e3)}else throw r}else throw r})}else ke.pictureInPictureElement&&ke.exitPictureInPicture()},mediaEvents:["enterpictureinpicture","leavepictureinpicture"]},mediaRenditionList:{get(t){var e;const{media:i}=t;return[...(e=i==null?void 0:i.videoRenditions)!=null?e:[]].map(a=>({...a}))},mediaEvents:["emptied","loadstart"],videoRenditionsEvents:["addrendition","removerendition"]},mediaRenditionSelected:{get(t){var e,i,a;const{media:r}=t;return(a=(i=r==null?void 0:r.videoRenditions)==null?void 0:i[(e=r.videoRenditions)==null?void 0:e.selectedIndex])==null?void 0:a.id},set(t,e){const{media:i}=e;if(!(i!=null&&i.videoRenditions)){console.warn("MediaController: Rendition selection not supported by this media.");return}const a=t,r=Array.prototype.findIndex.call(i.videoRenditions,n=>n.id==a);i.videoRenditions.selectedIndex!=r&&(i.videoRenditions.selectedIndex=r)},mediaEvents:["emptied"],videoRenditionsEvents:["addrendition","removerendition","change"]},mediaAudioTrackList:{get(t){var e;const{media:i}=t;return[...(e=i==null?void 0:i.audioTracks)!=null?e:[]]},mediaEvents:["emptied","loadstart"],audioTracksEvents:["addtrack","removetrack"]},mediaAudioTrackEnabled:{get(t){var e,i;const{media:a}=t;return(i=[...(e=a==null?void 0:a.audioTracks)!=null?e:[]].find(r=>r.enabled))==null?void 0:i.id},set(t,e){const{media:i}=e;if(!(i!=null&&i.audioTracks)){console.warn("MediaChrome: Audio track selection not supported by this media.");return}const a=t;for(const r of i.audioTracks)r.enabled=a==r.id},mediaEvents:["emptied"],audioTracksEvents:["addtrack","removetrack","change"]},mediaIsFullscreen:{get(t){return o1(t)},set(t,e,i){var a,r;t?(r1(e),i.detail&&!((a=e.media)!=null&&a.inert)&&((r=e.media)==null||r.focus())):n1(e)},rootEvents:["fullscreenchange","webkitfullscreenchange"],mediaEvents:["webkitbeginfullscreen","webkitendfullscreen","webkitpresentationmodechanged"]},mediaIsCasting:{get(t){var e;const{media:i}=t;return!(i!=null&&i.remote)||((e=i.remote)==null?void 0:e.state)==="disconnected"?!1:!!i.remote.state},set(t,e){var i,a;const{media:r}=e;if(r&&!(t&&((i=r.remote)==null?void 0:i.state)!=="disconnected")&&!(!t&&((a=r.remote)==null?void 0:a.state)!=="connected")){if(typeof r.remote.prompt!="function"){console.warn("MediaChrome: Casting is not supported in this environment");return}r.remote.prompt().catch(()=>{})}},remoteEvents:["connect","connecting","disconnect"]},mediaIsAirplaying:{get(){return!1},set(t,e){const{media:i}=e;if(i){if(!(i.webkitShowPlaybackTargetPicker&&g.WebKitPlaybackTargetAvailabilityEvent)){console.error("MediaChrome: received a request to select AirPlay but AirPlay is not supported in this environment");return}i.webkitShowPlaybackTargetPicker()}},mediaEvents:["webkitcurrentplaybacktargetiswirelesschanged"]},mediaFullscreenUnavailable:{get(t){const{media:e}=t;if(!p1||!_v(e))return rt.UNSUPPORTED}},mediaPipUnavailable:{get(t){const{media:e}=t;if(!v1||!Ev(e))return rt.UNSUPPORTED;if(e!=null&&e.disablePictureInPicture)return rt.UNAVAILABLE}},mediaVolumeUnavailable:{get(t){const{media:e}=t;if(Bo===!1||(e==null?void 0:e.volume)==null)return rt.UNSUPPORTED},stateOwnersUpdateHandlers:[t=>{Bo==null&&g1.then(e=>t(e?void 0:rt.UNSUPPORTED))}]},mediaCastUnavailable:{get(t,{availability:e="not-available"}={}){var i;const{media:a}=t;if(!E1||!((i=a==null?void 0:a.remote)!=null&&i.state))return rt.UNSUPPORTED;if(!(e==null||e==="available"))return rt.UNAVAILABLE},stateOwnersUpdateHandlers:[(t,e)=>{var i;const{media:a}=e;return a?(a.disableRemotePlayback||a.hasAttribute("disableremoteplayback")||(i=a==null?void 0:a.remote)==null||i.watchAvailability(n=>{t({availability:n?"available":"not-available"})}).catch(n=>{n.name==="NotSupportedError"?t({availability:null}):t({availability:"not-available"})}),()=>{var n;(n=a==null?void 0:a.remote)==null||n.cancelWatchAvailability().catch(()=>{})}):void 0}]},mediaAirplayUnavailable:{get(t,e){if(!f1)return rt.UNSUPPORTED;if((e==null?void 0:e.availability)==="not-available")return rt.UNAVAILABLE},mediaEvents:["webkitplaybacktargetavailabilitychanged"],stateOwnersUpdateHandlers:[(t,e)=>{var i;const{media:a}=e;return a?(a.disableRemotePlayback||a.hasAttribute("disableremoteplayback")||(i=a==null?void 0:a.remote)==null||i.watchAvailability(n=>{t({availability:n?"available":"not-available"})}).catch(n=>{n.name==="NotSupportedError"?t({availability:null}):t({availability:"not-available"})}),()=>{var n;(n=a==null?void 0:a.remote)==null||n.cancelWatchAvailability().catch(()=>{})}):void 0}]},mediaRenditionUnavailable:{get(t){var e;const{media:i}=t;if(!(i!=null&&i.videoRenditions))return rt.UNSUPPORTED;if(!((e=i.videoRenditions)!=null&&e.length))return rt.UNAVAILABLE},mediaEvents:["emptied","loadstart"],videoRenditionsEvents:["addrendition","removerendition"]},mediaAudioTrackUnavailable:{get(t){var e,i;const{media:a}=t;if(!(a!=null&&a.audioTracks))return rt.UNSUPPORTED;if(((i=(e=a.audioTracks)==null?void 0:e.length)!=null?i:0)<=1)return rt.UNAVAILABLE},mediaEvents:["emptied","loadstart"],audioTracksEvents:["addtrack","removetrack"]},mediaLang:{get(t){const{options:{mediaLang:e}={}}=t;return e??"en"}}},k1={[D.MEDIA_PREVIEW_REQUEST](t,e,{detail:i}){var a,r,n;const{media:s}=e,o=i??void 0;let l,c;if(s&&o!=null){const[d]=Tl(s,{kind:ai.METADATA,label:"thumbnails"}),v=Array.prototype.find.call((a=d==null?void 0:d.cues)!=null?a:[],(f,b,E)=>b===0?f.endTime>o:b===E.length-1?f.startTime<=o:f.startTime<=o&&f.endTime>o);if(v){const f=/'^(?:[a-z]+:)?\/\//i.test(v.text)||(r=s==null?void 0:s.querySelector('track[label="thumbnails"]'))==null?void 0:r.src,b=new URL(v.text,f);c=new URLSearchParams(b.hash).get("#xywh").split(",").map(T=>+T),l=b.href}}const p=t.mediaDuration.get(e);let u=(n=t.mediaChaptersCues.get(e).find((d,v,f)=>v===f.length-1&&p===d.endTime?d.startTime<=o&&d.endTime>=o:d.startTime<=o&&d.endTime>o))==null?void 0:n.text;return i!=null&&u==null&&(u=""),{mediaPreviewTime:o,mediaPreviewImage:l,mediaPreviewCoords:c,mediaPreviewChapter:u}},[D.MEDIA_PAUSE_REQUEST](t,e){t["mediaPaused"].set(!0,e)},[D.MEDIA_PLAY_REQUEST](t,e){var i,a,r,n;const s="mediaPaused",l=t.mediaStreamType.get(e)===pi.LIVE,c=!((i=e.options)!=null&&i.noAutoSeekToLive),p=t.mediaTargetLiveWindow.get(e)>0;if(l&&c&&!p){const m=(a=t.mediaSeekable.get(e))==null?void 0:a[1];if(m){const u=(n=(r=e.options)==null?void 0:r.seekToLiveOffset)!=null?n:0,d=m-u;t.mediaCurrentTime.set(d,e)}}t[s].set(!1,e)},[D.MEDIA_PLAYBACK_RATE_REQUEST](t,e,{detail:i}){const a="mediaPlaybackRate",r=i;t[a].set(r,e)},[D.MEDIA_MUTE_REQUEST](t,e){t["mediaMuted"].set(!0,e)},[D.MEDIA_UNMUTE_REQUEST](t,e){const i="mediaMuted";t.mediaVolume.get(e)||t.mediaVolume.set(.25,e),t[i].set(!1,e)},[D.MEDIA_LOOP_REQUEST](t,e,{detail:i}){const a="mediaLoop",r=!!i;return t[a].set(r,e),{mediaLoop:r}},[D.MEDIA_VOLUME_REQUEST](t,e,{detail:i}){const a="mediaVolume",r=i;r&&t.mediaMuted.get(e)&&t.mediaMuted.set(!1,e),t[a].set(r,e)},[D.MEDIA_SEEK_REQUEST](t,e,{detail:i}){const a="mediaCurrentTime",r=i;t[a].set(r,e)},[D.MEDIA_SEEK_TO_LIVE_REQUEST](t,e){var i,a,r;const n="mediaCurrentTime",s=(i=t.mediaSeekable.get(e))==null?void 0:i[1];if(Number.isNaN(Number(s)))return;const o=(r=(a=e.options)==null?void 0:a.seekToLiveOffset)!=null?r:0,l=s-o;t[n].set(l,e)},[D.MEDIA_SHOW_SUBTITLES_REQUEST](t,e,{detail:i}){var a;const{options:r}=e,n=Ho(e),s=pv(i),o=(a=s[0])==null?void 0:a.language;o&&!r.noSubtitlesLangPref&&g.localStorage.setItem("media-chrome-pref-subtitles-lang",o),An(hr.SHOWING,n,s)},[D.MEDIA_DISABLE_SUBTITLES_REQUEST](t,e,{detail:i}){const a=Ho(e),r=i??[];An(hr.DISABLED,a,r)},[D.MEDIA_TOGGLE_SUBTITLES_REQUEST](t,e,{detail:i}){gv(e,i)},[D.MEDIA_RENDITION_REQUEST](t,e,{detail:i}){const a="mediaRenditionSelected",r=i;t[a].set(r,e)},[D.MEDIA_AUDIO_TRACK_REQUEST](t,e,{detail:i}){const a="mediaAudioTrackEnabled",r=i;t[a].set(r,e)},[D.MEDIA_ENTER_PIP_REQUEST](t,e){const i="mediaIsPip";t.mediaIsFullscreen.get(e)&&t.mediaIsFullscreen.set(!1,e),t[i].set(!0,e)},[D.MEDIA_EXIT_PIP_REQUEST](t,e){t["mediaIsPip"].set(!1,e)},[D.MEDIA_ENTER_FULLSCREEN_REQUEST](t,e,i){const a="mediaIsFullscreen";t.mediaIsPip.get(e)&&t.mediaIsPip.set(!1,e),t[a].set(!0,e,i)},[D.MEDIA_EXIT_FULLSCREEN_REQUEST](t,e){t["mediaIsFullscreen"].set(!1,e)},[D.MEDIA_ENTER_CAST_REQUEST](t,e){const i="mediaIsCasting";t.mediaIsFullscreen.get(e)&&t.mediaIsFullscreen.set(!1,e),t[i].set(!0,e)},[D.MEDIA_EXIT_CAST_REQUEST](t,e){t["mediaIsCasting"].set(!1,e)},[D.MEDIA_AIRPLAY_REQUEST](t,e){t["mediaIsAirplaying"].set(!0,e)}},w1=({media:t,fullscreenElement:e,documentElement:i,stateMediator:a=tn,requestMap:r=k1,options:n={},monitorStateOwnersOnlyWithSubscriptions:s=!0})=>{const o=[],l={options:{...n}};let c=Object.freeze({mediaPreviewTime:void 0,mediaPreviewImage:void 0,mediaPreviewCoords:void 0,mediaPreviewChapter:void 0});const p=f=>{f!=null&&(Zu(f,c)||(c=Object.freeze({...c,...f}),o.forEach(b=>b(c))))},m=()=>{const f=Object.entries(a).reduce((b,[E,{get:T}])=>(b[E]=T(l),b),{});p(f)},u={};let d;const v=async(f,b)=>{var E,T,_,w,R,x,U,K,Q,W,H,He,et,tt,be,Ke;const $t=!!d;if(d={...l,...d??{},...f},$t)return;await y1(...Object.values(f));const Ve=o.length>0&&b===0&&s,yt=l.media!==d.media,it=((E=l.media)==null?void 0:E.textTracks)!==((T=d.media)==null?void 0:T.textTracks),Ce=((_=l.media)==null?void 0:_.videoRenditions)!==((w=d.media)==null?void 0:w.videoRenditions),Be=((R=l.media)==null?void 0:R.audioTracks)!==((x=d.media)==null?void 0:x.audioTracks),qe=((U=l.media)==null?void 0:U.remote)!==((K=d.media)==null?void 0:K.remote),Sa=l.documentElement!==d.documentElement,Zn=!!l.media&&(yt||Ve),eh=!!((Q=l.media)!=null&&Q.textTracks)&&(it||Ve),th=!!((W=l.media)!=null&&W.videoRenditions)&&(Ce||Ve),ih=!!((H=l.media)!=null&&H.audioTracks)&&(Be||Ve),ah=!!((He=l.media)!=null&&He.remote)&&(qe||Ve),rh=!!l.documentElement&&(Sa||Ve),xl=Zn||eh||th||ih||ah||rh,Ia=o.length===0&&b===1&&s,nh=!!d.media&&(yt||Ia),sh=!!((et=d.media)!=null&&et.textTracks)&&(it||Ia),oh=!!((tt=d.media)!=null&&tt.videoRenditions)&&(Ce||Ia),lh=!!((be=d.media)!=null&&be.audioTracks)&&(Be||Ia),dh=!!((Ke=d.media)!=null&&Ke.remote)&&(qe||Ia),uh=!!d.documentElement&&(Sa||Ia),ch=nh||sh||oh||lh||dh||uh;if(!(xl||ch)){Object.entries(d).forEach(([te,xr])=>{l[te]=xr}),m(),d=void 0;return}Object.entries(a).forEach(([te,{get:xr,mediaEvents:iE=[],textTracksEvents:aE=[],videoRenditionsEvents:rE=[],audioTracksEvents:nE=[],remoteEvents:sE=[],rootEvents:oE=[],stateOwnersUpdateHandlers:lE=[]}])=>{u[te]||(u[te]={});const at=he=>{const ge=xr(l,he);p({[te]:ge})};let De;De=u[te].mediaEvents,iE.forEach(he=>{De&&Zn&&(l.media.removeEventListener(he,De),u[te].mediaEvents=void 0),nh&&(d.media.addEventListener(he,at),u[te].mediaEvents=at)}),De=u[te].textTracksEvents,aE.forEach(he=>{var ge,Tt;De&&eh&&((ge=l.media.textTracks)==null||ge.removeEventListener(he,De),u[te].textTracksEvents=void 0),sh&&((Tt=d.media.textTracks)==null||Tt.addEventListener(he,at),u[te].textTracksEvents=at)}),De=u[te].videoRenditionsEvents,rE.forEach(he=>{var ge,Tt;De&&th&&((ge=l.media.videoRenditions)==null||ge.removeEventListener(he,De),u[te].videoRenditionsEvents=void 0),oh&&((Tt=d.media.videoRenditions)==null||Tt.addEventListener(he,at),u[te].videoRenditionsEvents=at)}),De=u[te].audioTracksEvents,nE.forEach(he=>{var ge,Tt;De&&ih&&((ge=l.media.audioTracks)==null||ge.removeEventListener(he,De),u[te].audioTracksEvents=void 0),lh&&((Tt=d.media.audioTracks)==null||Tt.addEventListener(he,at),u[te].audioTracksEvents=at)}),De=u[te].remoteEvents,sE.forEach(he=>{var ge,Tt;De&&ah&&((ge=l.media.remote)==null||ge.removeEventListener(he,De),u[te].remoteEvents=void 0),dh&&((Tt=d.media.remote)==null||Tt.addEventListener(he,at),u[te].remoteEvents=at)}),De=u[te].rootEvents,oE.forEach(he=>{De&&rh&&(l.documentElement.removeEventListener(he,De),u[te].rootEvents=void 0),uh&&(d.documentElement.addEventListener(he,at),u[te].rootEvents=at)});const Xn=u[te].stateOwnersUpdateHandlers;if(Xn&&xl&&(Array.isArray(Xn)?Xn:[Xn]).forEach(ge=>{typeof ge=="function"&&ge()}),ch){const he=lE.map(ge=>ge(at,d)).filter(ge=>typeof ge=="function");u[te].stateOwnersUpdateHandlers=he.length===1?he[0]:he}else xl&&(u[te].stateOwnersUpdateHandlers=void 0)}),Object.entries(d).forEach(([te,xr])=>{l[te]=xr}),m(),d=void 0};return v({media:t,fullscreenElement:e,documentElement:i,options:n}),{dispatch(f){const{type:b,detail:E}=f;if(r[b]&&c.mediaErrorCode==null){p(r[b](a,l,f));return}b==="mediaelementchangerequest"?v({media:E}):b==="fullscreenelementchangerequest"?v({fullscreenElement:E}):b==="documentelementchangerequest"?v({documentElement:E}):b==="optionschangerequest"&&(Object.entries(E??{}).forEach(([T,_])=>{l.options[T]=_}),m())},getState(){return c},subscribe(f){return v({},o.length+1),o.push(f),f(c),()=>{const b=o.indexOf(f);b>=0&&(v({},o.length-1),o.splice(b,1))}}}};var Xu=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},M=(t,e,i)=>(Xu(t,e,"read from private field"),i?i.call(t):e.get(t)),ct=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},It=(t,e,i,a)=>(Xu(t,e,"write to private field"),e.set(t,i),i),$r=(t,e,i)=>(Xu(t,e,"access private method"),i),vi,an,V,ti,rn,Ft,Ns,nn,Ps,Sd,ba,$s,Id,Rd,yv;const Tv=["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter"," ","f","m","k","c","l","j",">","<","p"],Kh=10,Vh=.025,qh=.25,S1=.25,I1=2,S={DEFAULT_SUBTITLES:"defaultsubtitles",DEFAULT_STREAM_TYPE:"defaultstreamtype",DEFAULT_DURATION:"defaultduration",FULLSCREEN_ELEMENT:"fullscreenelement",HOTKEYS:"hotkeys",KEYBOARD_BACKWARD_SEEK_OFFSET:"keyboardbackwardseekoffset",KEYBOARD_FORWARD_SEEK_OFFSET:"keyboardforwardseekoffset",KEYBOARD_DOWN_VOLUME_STEP:"keyboarddownvolumestep",KEYBOARD_UP_VOLUME_STEP:"keyboardupvolumestep",KEYS_USED:"keysused",LANG:"lang",LOOP:"loop",LIVE_EDGE_OFFSET:"liveedgeoffset",NO_AUTO_SEEK_TO_LIVE:"noautoseektolive",NO_DEFAULT_STORE:"nodefaultstore",NO_HOTKEYS:"nohotkeys",NO_MUTED_PREF:"nomutedpref",NO_SUBTITLES_LANG_PREF:"nosubtitleslangpref",NO_VOLUME_PREF:"novolumepref",SEEK_TO_LIVE_OFFSET:"seektoliveoffset"};class Av extends gl{constructor(){super(),ct(this,Ps),ct(this,$s),ct(this,Rd),this.mediaStateReceivers=[],this.associatedElementSubscriptions=new Map,ct(this,vi,new Qu(this,S.HOTKEYS)),ct(this,an,void 0),ct(this,V,void 0),ct(this,ti,null),ct(this,rn,void 0),ct(this,Ft,void 0),ct(this,Ns,i=>{var a;(a=M(this,V))==null||a.dispatch(i)}),ct(this,nn,void 0),ct(this,ba,i=>{const{key:a,shiftKey:r}=i;if(!(r&&(a==="/"||a==="?")||Tv.includes(a))){this.removeEventListener("keyup",M(this,ba));return}this.keyboardShortcutHandler(i)}),this.associateElement(this);let e={};It(this,rn,i=>{Object.entries(i).forEach(([a,r])=>{if(a in e&&e[a]===r)return;this.propagateMediaState(a,r);const n=a.toLowerCase(),s=new g.CustomEvent(R0[n],{composed:!0,detail:r});this.dispatchEvent(s)}),e=i})}static get observedAttributes(){return super.observedAttributes.concat(S.NO_HOTKEYS,S.HOTKEYS,S.DEFAULT_STREAM_TYPE,S.DEFAULT_SUBTITLES,S.DEFAULT_DURATION,S.NO_MUTED_PREF,S.NO_VOLUME_PREF,S.LANG,S.LOOP,S.LIVE_EDGE_OFFSET,S.SEEK_TO_LIVE_OFFSET,S.NO_AUTO_SEEK_TO_LIVE)}get mediaStore(){return M(this,V)}set mediaStore(e){var i,a;if(M(this,V)&&((i=M(this,Ft))==null||i.call(this),It(this,Ft,void 0)),It(this,V,e),!M(this,V)&&!this.hasAttribute(S.NO_DEFAULT_STORE)){$r(this,Ps,Sd).call(this);return}It(this,Ft,(a=M(this,V))==null?void 0:a.subscribe(M(this,rn)))}get fullscreenElement(){var e;return(e=M(this,an))!=null?e:this}set fullscreenElement(e){var i;this.hasAttribute(S.FULLSCREEN_ELEMENT)&&this.removeAttribute(S.FULLSCREEN_ELEMENT),It(this,an,e),(i=M(this,V))==null||i.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement})}get defaultSubtitles(){return Y(this,S.DEFAULT_SUBTITLES)}set defaultSubtitles(e){G(this,S.DEFAULT_SUBTITLES,e)}get defaultStreamType(){return ce(this,S.DEFAULT_STREAM_TYPE)}set defaultStreamType(e){oe(this,S.DEFAULT_STREAM_TYPE,e)}get defaultDuration(){return se(this,S.DEFAULT_DURATION)}set defaultDuration(e){ve(this,S.DEFAULT_DURATION,e)}get noHotkeys(){return Y(this,S.NO_HOTKEYS)}set noHotkeys(e){G(this,S.NO_HOTKEYS,e)}get keysUsed(){return ce(this,S.KEYS_USED)}set keysUsed(e){oe(this,S.KEYS_USED,e)}get liveEdgeOffset(){return se(this,S.LIVE_EDGE_OFFSET)}set liveEdgeOffset(e){ve(this,S.LIVE_EDGE_OFFSET,e)}get noAutoSeekToLive(){return Y(this,S.NO_AUTO_SEEK_TO_LIVE)}set noAutoSeekToLive(e){G(this,S.NO_AUTO_SEEK_TO_LIVE,e)}get noVolumePref(){return Y(this,S.NO_VOLUME_PREF)}set noVolumePref(e){G(this,S.NO_VOLUME_PREF,e)}get noMutedPref(){return Y(this,S.NO_MUTED_PREF)}set noMutedPref(e){G(this,S.NO_MUTED_PREF,e)}get noSubtitlesLangPref(){return Y(this,S.NO_SUBTITLES_LANG_PREF)}set noSubtitlesLangPref(e){G(this,S.NO_SUBTITLES_LANG_PREF,e)}get noDefaultStore(){return Y(this,S.NO_DEFAULT_STORE)}set noDefaultStore(e){G(this,S.NO_DEFAULT_STORE,e)}attributeChangedCallback(e,i,a){var r,n,s,o,l,c,p,m,u,d,v,f;if(super.attributeChangedCallback(e,i,a),e===S.NO_HOTKEYS)a!==i&&a===""?(this.hasAttribute(S.HOTKEYS)&&console.warn("Media Chrome: Both `hotkeys` and `nohotkeys` have been set. All hotkeys will be disabled."),this.disableHotkeys()):a!==i&&a===null&&this.enableHotkeys();else if(e===S.HOTKEYS)M(this,vi).value=a;else if(e===S.DEFAULT_SUBTITLES&&a!==i)(r=M(this,V))==null||r.dispatch({type:"optionschangerequest",detail:{defaultSubtitles:this.hasAttribute(S.DEFAULT_SUBTITLES)}});else if(e===S.DEFAULT_STREAM_TYPE)(s=M(this,V))==null||s.dispatch({type:"optionschangerequest",detail:{defaultStreamType:(n=this.getAttribute(S.DEFAULT_STREAM_TYPE))!=null?n:void 0}});else if(e===S.LIVE_EDGE_OFFSET&&a!==i)(o=M(this,V))==null||o.dispatch({type:"optionschangerequest",detail:{liveEdgeOffset:this.hasAttribute(S.LIVE_EDGE_OFFSET)?+this.getAttribute(S.LIVE_EDGE_OFFSET):void 0,seekToLiveOffset:this.hasAttribute(S.SEEK_TO_LIVE_OFFSET)?+this.getAttribute(S.SEEK_TO_LIVE_OFFSET):this.hasAttribute(S.LIVE_EDGE_OFFSET)?+this.getAttribute(S.LIVE_EDGE_OFFSET):void 0}});else if(e===S.SEEK_TO_LIVE_OFFSET&&a!==i)(l=M(this,V))==null||l.dispatch({type:"optionschangerequest",detail:{seekToLiveOffset:this.hasAttribute(S.SEEK_TO_LIVE_OFFSET)?+this.getAttribute(S.SEEK_TO_LIVE_OFFSET):this.hasAttribute(S.LIVE_EDGE_OFFSET)?+this.getAttribute(S.LIVE_EDGE_OFFSET):void 0}});else if(e===S.NO_AUTO_SEEK_TO_LIVE)(c=M(this,V))==null||c.dispatch({type:"optionschangerequest",detail:{noAutoSeekToLive:this.hasAttribute(S.NO_AUTO_SEEK_TO_LIVE)}});else if(e===S.FULLSCREEN_ELEMENT){const b=a?(p=this.getRootNode())==null?void 0:p.getElementById(a):void 0;It(this,an,b),(m=M(this,V))==null||m.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement})}else e===S.LANG&&a!==i?(B0(a),(u=M(this,V))==null||u.dispatch({type:"optionschangerequest",detail:{mediaLang:a}})):e===S.LOOP&&a!==i?(d=M(this,V))==null||d.dispatch({type:D.MEDIA_LOOP_REQUEST,detail:a!=null}):e===S.NO_VOLUME_PREF&&a!==i?(v=M(this,V))==null||v.dispatch({type:"optionschangerequest",detail:{noVolumePref:this.hasAttribute(S.NO_VOLUME_PREF)}}):e===S.NO_MUTED_PREF&&a!==i&&((f=M(this,V))==null||f.dispatch({type:"optionschangerequest",detail:{noMutedPref:this.hasAttribute(S.NO_MUTED_PREF)}}))}connectedCallback(){var e,i,a;this.associateElement(this),!M(this,V)&&!this.hasAttribute(S.NO_DEFAULT_STORE)&&$r(this,Ps,Sd).call(this),(e=M(this,V))==null||e.dispatch({type:"documentelementchangerequest",detail:ke}),(i=M(this,V))==null||i.dispatch({type:"fullscreenelementchangerequest",detail:this.fullscreenElement}),super.connectedCallback(),M(this,V)&&!M(this,Ft)&&It(this,Ft,(a=M(this,V))==null?void 0:a.subscribe(M(this,rn))),M(this,nn)!==void 0&&M(this,V)&&this.media&&setTimeout(()=>{var r,n,s;(n=(r=this.media)==null?void 0:r.textTracks)!=null&&n.length&&((s=M(this,V))==null||s.dispatch({type:D.MEDIA_TOGGLE_SUBTITLES_REQUEST,detail:M(this,nn)}))},0),this.hasAttribute(S.NO_HOTKEYS)?this.disableHotkeys():this.enableHotkeys()}disconnectedCallback(){var e,i,a,r,n,s;if((e=super.disconnectedCallback)==null||e.call(this),this.disableHotkeys(),M(this,V)){const o=M(this,V).getState();It(this,nn,!!((i=o.mediaSubtitlesShowing)!=null&&i.length)),(a=M(this,V))==null||a.dispatch({type:"fullscreenelementchangerequest",detail:void 0}),(r=M(this,V))==null||r.dispatch({type:"documentelementchangerequest",detail:void 0}),(n=M(this,V))==null||n.dispatch({type:D.MEDIA_TOGGLE_SUBTITLES_REQUEST,detail:!1})}M(this,Ft)&&((s=M(this,Ft))==null||s.call(this),It(this,Ft,void 0)),this.unassociateElement(this),M(this,ti)&&(M(this,ti).remove(),It(this,ti,null))}mediaSetCallback(e){var i;super.mediaSetCallback(e),(i=M(this,V))==null||i.dispatch({type:"mediaelementchangerequest",detail:e}),e.hasAttribute("tabindex")||(e.tabIndex=-1)}mediaUnsetCallback(e){var i;super.mediaUnsetCallback(e),(i=M(this,V))==null||i.dispatch({type:"mediaelementchangerequest",detail:void 0})}propagateMediaState(e,i){zh(this.mediaStateReceivers,e,i)}associateElement(e){if(!e)return;const{associatedElementSubscriptions:i}=this;if(i.has(e))return;const a=this.registerMediaStateReceiver.bind(this),r=this.unregisterMediaStateReceiver.bind(this),n=x1(e,a,r);Object.values(D).forEach(s=>{e.addEventListener(s,M(this,Ns))}),i.set(e,n)}unassociateElement(e){if(!e)return;const{associatedElementSubscriptions:i}=this;if(!i.has(e))return;i.get(e)(),i.delete(e),Object.values(D).forEach(r=>{e.removeEventListener(r,M(this,Ns))})}registerMediaStateReceiver(e){if(!e)return;const i=this.mediaStateReceivers;i.indexOf(e)>-1||(i.push(e),M(this,V)&&Object.entries(M(this,V).getState()).forEach(([r,n])=>{zh([e],r,n)}))}unregisterMediaStateReceiver(e){const i=this.mediaStateReceivers,a=i.indexOf(e);a<0||i.splice(a,1)}enableHotkeys(){this.addEventListener("keydown",$r(this,$s,Id))}disableHotkeys(){this.removeEventListener("keydown",$r(this,$s,Id)),this.removeEventListener("keyup",M(this,ba))}get hotkeys(){return M(this,vi)}set hotkeys(e){oe(this,S.HOTKEYS,e)}keyboardShortcutHandler(e){var i,a,r,n,s,o,l,c,p;const m=e.target;if(((r=(a=(i=m.getAttribute(S.KEYS_USED))==null?void 0:i.split(" "))!=null?a:m==null?void 0:m.keysUsed)!=null?r:[]).map(E=>E==="Space"?" ":E).filter(Boolean).includes(e.key))return;let d,v,f;if(!(M(this,vi).contains(`no${e.key.toLowerCase()}`)||e.key===" "&&M(this,vi).contains("nospace")||e.shiftKey&&(e.key==="/"||e.key==="?")&&M(this,vi).contains("noshift+/")))switch(e.key){case" ":case"k":d=M(this,V).getState().mediaPaused?D.MEDIA_PLAY_REQUEST:D.MEDIA_PAUSE_REQUEST,this.dispatchEvent(new g.CustomEvent(d,{composed:!0,bubbles:!0}));break;case"m":d=this.mediaStore.getState().mediaVolumeLevel==="off"?D.MEDIA_UNMUTE_REQUEST:D.MEDIA_MUTE_REQUEST,this.dispatchEvent(new g.CustomEvent(d,{composed:!0,bubbles:!0}));break;case"f":d=this.mediaStore.getState().mediaIsFullscreen?D.MEDIA_EXIT_FULLSCREEN_REQUEST:D.MEDIA_ENTER_FULLSCREEN_REQUEST,this.dispatchEvent(new g.CustomEvent(d,{composed:!0,bubbles:!0}));break;case"c":this.dispatchEvent(new g.CustomEvent(D.MEDIA_TOGGLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0}));break;case"ArrowLeft":case"j":{const E=this.hasAttribute(S.KEYBOARD_BACKWARD_SEEK_OFFSET)?+this.getAttribute(S.KEYBOARD_BACKWARD_SEEK_OFFSET):Kh;v=Math.max(((n=this.mediaStore.getState().mediaCurrentTime)!=null?n:0)-E,0),f=new g.CustomEvent(D.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:v}),this.dispatchEvent(f);break}case"ArrowRight":case"l":{const E=this.hasAttribute(S.KEYBOARD_FORWARD_SEEK_OFFSET)?+this.getAttribute(S.KEYBOARD_FORWARD_SEEK_OFFSET):Kh;v=Math.max(((s=this.mediaStore.getState().mediaCurrentTime)!=null?s:0)+E,0),f=new g.CustomEvent(D.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:v}),this.dispatchEvent(f);break}case"ArrowUp":{const E=this.hasAttribute(S.KEYBOARD_UP_VOLUME_STEP)?+this.getAttribute(S.KEYBOARD_UP_VOLUME_STEP):Vh;v=Math.min(((o=this.mediaStore.getState().mediaVolume)!=null?o:1)+E,1),f=new g.CustomEvent(D.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:v}),this.dispatchEvent(f);break}case"ArrowDown":{const E=this.hasAttribute(S.KEYBOARD_DOWN_VOLUME_STEP)?+this.getAttribute(S.KEYBOARD_DOWN_VOLUME_STEP):Vh;v=Math.max(((l=this.mediaStore.getState().mediaVolume)!=null?l:1)-E,0),f=new g.CustomEvent(D.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:v}),this.dispatchEvent(f);break}case"<":{const E=(c=this.mediaStore.getState().mediaPlaybackRate)!=null?c:1;v=Math.max(E-qh,S1).toFixed(2),f=new g.CustomEvent(D.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:v}),this.dispatchEvent(f);break}case">":{const E=(p=this.mediaStore.getState().mediaPlaybackRate)!=null?p:1;v=Math.min(E+qh,I1).toFixed(2),f=new g.CustomEvent(D.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:v}),this.dispatchEvent(f);break}case"/":case"?":{e.shiftKey&&$r(this,Rd,yv).call(this);break}case"p":{d=this.mediaStore.getState().mediaIsPip?D.MEDIA_EXIT_PIP_REQUEST:D.MEDIA_ENTER_PIP_REQUEST,f=new g.CustomEvent(d,{composed:!0,bubbles:!0}),this.dispatchEvent(f);break}}}}vi=new WeakMap;an=new WeakMap;V=new WeakMap;ti=new WeakMap;rn=new WeakMap;Ft=new WeakMap;Ns=new WeakMap;nn=new WeakMap;Ps=new WeakSet;Sd=function(){var t;this.mediaStore=w1({media:this.media,fullscreenElement:this.fullscreenElement,options:{defaultSubtitles:this.hasAttribute(S.DEFAULT_SUBTITLES),defaultDuration:this.hasAttribute(S.DEFAULT_DURATION)?+this.getAttribute(S.DEFAULT_DURATION):void 0,defaultStreamType:(t=this.getAttribute(S.DEFAULT_STREAM_TYPE))!=null?t:void 0,liveEdgeOffset:this.hasAttribute(S.LIVE_EDGE_OFFSET)?+this.getAttribute(S.LIVE_EDGE_OFFSET):void 0,seekToLiveOffset:this.hasAttribute(S.SEEK_TO_LIVE_OFFSET)?+this.getAttribute(S.SEEK_TO_LIVE_OFFSET):this.hasAttribute(S.LIVE_EDGE_OFFSET)?+this.getAttribute(S.LIVE_EDGE_OFFSET):void 0,noAutoSeekToLive:this.hasAttribute(S.NO_AUTO_SEEK_TO_LIVE),noVolumePref:this.hasAttribute(S.NO_VOLUME_PREF),noMutedPref:this.hasAttribute(S.NO_MUTED_PREF),noSubtitlesLangPref:this.hasAttribute(S.NO_SUBTITLES_LANG_PREF)}})};ba=new WeakMap;$s=new WeakSet;Id=function(t){var e;const{metaKey:i,altKey:a,key:r,shiftKey:n}=t,s=n&&(r==="/"||r==="?");if(s&&((e=M(this,ti))!=null&&e.open)){this.removeEventListener("keyup",M(this,ba));return}if(i||a||!s&&!Tv.includes(r)){this.removeEventListener("keyup",M(this,ba));return}const o=t.target,l=o instanceof HTMLElement&&(o.tagName.toLowerCase()==="media-volume-range"||o.tagName.toLowerCase()==="media-time-range");[" ","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(r)&&!(M(this,vi).contains(`no${r.toLowerCase()}`)||r===" "&&M(this,vi).contains("nospace"))&&!l&&t.preventDefault(),this.addEventListener("keyup",M(this,ba),{once:!0})};Rd=new WeakSet;yv=function(){M(this,ti)||(It(this,ti,ke.createElement("media-keyboard-shortcuts-dialog")),this.appendChild(M(this,ti))),M(this,ti).open=!0};const R1=Object.values(h),L1=Object.values(Qp),kv=t=>{var e,i,a,r;let{observedAttributes:n}=t.constructor;!n&&((e=t.nodeName)!=null&&e.includes("-"))&&(g.customElements.upgrade(t),{observedAttributes:n}=t.constructor);const s=(r=(a=(i=t==null?void 0:t.getAttribute)==null?void 0:i.call(t,X.MEDIA_CHROME_ATTRIBUTES))==null?void 0:a.split)==null?void 0:r.call(a,/\s+/);return Array.isArray(n||s)?(n||s).filter(o=>R1.includes(o)):[]},C1=t=>{var e,i;return(e=t.nodeName)!=null&&e.includes("-")&&g.customElements.get((i=t.nodeName)==null?void 0:i.toLowerCase())&&!(t instanceof g.customElements.get(t.nodeName.toLowerCase()))&&g.customElements.upgrade(t),L1.some(a=>a in t)},Ld=t=>C1(t)||!!kv(t).length,Yh=t=>{var e;return(e=t==null?void 0:t.join)==null?void 0:e.call(t,":")},Gh={[h.MEDIA_SUBTITLES_LIST]:Bn,[h.MEDIA_SUBTITLES_SHOWING]:Bn,[h.MEDIA_SEEKABLE]:Yh,[h.MEDIA_BUFFERED]:t=>t==null?void 0:t.map(Yh).join(" "),[h.MEDIA_PREVIEW_COORDS]:t=>t==null?void 0:t.join(" "),[h.MEDIA_RENDITION_LIST]:C0,[h.MEDIA_AUDIO_TRACK_LIST]:O0},D1=async(t,e,i)=>{var a,r;if(t.isConnected||await Xp(0),typeof i=="boolean"||i==null)return G(t,e,i);if(typeof i=="number")return ve(t,e,i);if(typeof i=="string")return oe(t,e,i);if(Array.isArray(i)&&!i.length)return t.removeAttribute(e);const n=(r=(a=Gh[e])==null?void 0:a.call(Gh,i))!=null?r:i;return t.setAttribute(e,n)},M1=t=>{var e;return!!((e=t.closest)!=null&&e.call(t,'*[slot="media"]'))},ra=(t,e)=>{if(M1(t))return;const i=(r,n)=>{var s,o;Ld(r)&&n(r);const{children:l=[]}=r??{},c=(o=(s=r==null?void 0:r.shadowRoot)==null?void 0:s.children)!=null?o:[];[...l,...c].forEach(m=>ra(m,n))},a=t==null?void 0:t.nodeName.toLowerCase();if(a.includes("-")&&!Ld(t)){g.customElements.whenDefined(a).then(()=>{i(t,e)});return}i(t,e)},zh=(t,e,i)=>{t.forEach(a=>{if(e in a){a[e]=i;return}const r=kv(a),n=e.toLowerCase();r.includes(n)&&D1(a,n,i)})},x1=(t,e,i)=>{ra(t,e);const a=p=>{var m;const u=(m=p==null?void 0:p.composedPath()[0])!=null?m:p.target;e(u)},r=p=>{var m;const u=(m=p==null?void 0:p.composedPath()[0])!=null?m:p.target;i(u)};t.addEventListener(D.REGISTER_MEDIA_STATE_RECEIVER,a),t.addEventListener(D.UNREGISTER_MEDIA_STATE_RECEIVER,r);const n=p=>{p.forEach(m=>{const{addedNodes:u=[],removedNodes:d=[],type:v,target:f,attributeName:b}=m;v==="childList"?(Array.prototype.forEach.call(u,E=>ra(E,e)),Array.prototype.forEach.call(d,E=>ra(E,i))):v==="attributes"&&b===X.MEDIA_CHROME_ATTRIBUTES&&(Ld(f)?e(f):i(f))})};let s=[];const o=p=>{const m=p.target;m.name!=="media"&&(s.forEach(u=>ra(u,i)),s=[...m.assignedElements({flatten:!0})],s.forEach(u=>ra(u,e)))};t.addEventListener("slotchange",o);const l=new MutationObserver(n);return l.observe(t,{childList:!0,attributes:!0,subtree:!0}),()=>{ra(t,i),t.removeEventListener("slotchange",o),l.disconnect(),t.removeEventListener(D.REGISTER_MEDIA_STATE_RECEIVER,a),t.removeEventListener(D.UNREGISTER_MEDIA_STATE_RECEIVER,r)}};g.customElements.get("media-controller")||g.customElements.define("media-controller",Av);var O1=Av;const Ra={PLACEMENT:"placement",BOUNDS:"bounds"};function N1(t){return`
    <style>
      :host {
        --_tooltip-background-color: var(--media-tooltip-background-color, var(--media-secondary-color, rgba(20, 20, 30, .7)));
        --_tooltip-background: var(--media-tooltip-background, var(--_tooltip-background-color));
        --_tooltip-arrow-half-width: calc(var(--media-tooltip-arrow-width, 12px) / 2);
        --_tooltip-arrow-height: var(--media-tooltip-arrow-height, 5px);
        --_tooltip-arrow-background: var(--media-tooltip-arrow-color, var(--_tooltip-background-color));
        position: relative;
        pointer-events: none;
        display: var(--media-tooltip-display, inline-flex);
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        z-index: var(--media-tooltip-z-index, 1);
        background: var(--_tooltip-background);
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        font: var(--media-font,
          var(--media-font-weight, 400)
          var(--media-font-size, 13px) /
          var(--media-text-content-height, var(--media-control-height, 18px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        padding: var(--media-tooltip-padding, .35em .7em);
        border: var(--media-tooltip-border, none);
        border-radius: var(--media-tooltip-border-radius, 5px);
        filter: var(--media-tooltip-filter, drop-shadow(0 0 4px rgba(0, 0, 0, .2)));
        white-space: var(--media-tooltip-white-space, nowrap);
      }

      :host([hidden]) {
        display: none;
      }

      img, svg {
        display: inline-block;
      }

      #arrow {
        position: absolute;
        width: 0px;
        height: 0px;
        border-style: solid;
        display: var(--media-tooltip-arrow-display, block);
      }

      :host(:not([placement])),
      :host([placement="top"]) {
        position: absolute;
        bottom: calc(100% + var(--media-tooltip-distance, 12px));
        left: 50%;
        transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
      }
      :host(:not([placement])) #arrow,
      :host([placement="top"]) #arrow {
        top: 100%;
        left: 50%;
        border-width: var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width);
        border-color: var(--_tooltip-arrow-background) transparent transparent transparent;
        transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
      }

      :host([placement="right"]) {
        position: absolute;
        left: calc(100% + var(--media-tooltip-distance, 12px));
        top: 50%;
        transform: translate(0, -50%);
      }
      :host([placement="right"]) #arrow {
        top: 50%;
        right: 100%;
        border-width: var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width) 0;
        border-color: transparent var(--_tooltip-arrow-background) transparent transparent;
        transform: translate(0, -50%);
      }

      :host([placement="bottom"]) {
        position: absolute;
        top: calc(100% + var(--media-tooltip-distance, 12px));
        left: 50%;
        transform: translate(calc(-50% - var(--media-tooltip-offset-x, 0px)), 0);
      }
      :host([placement="bottom"]) #arrow {
        bottom: 100%;
        left: 50%;
        border-width: 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height) var(--_tooltip-arrow-half-width);
        border-color: transparent transparent var(--_tooltip-arrow-background) transparent;
        transform: translate(calc(-50% + var(--media-tooltip-offset-x, 0px)), 0);
      }

      :host([placement="left"]) {
        position: absolute;
        right: calc(100% + var(--media-tooltip-distance, 12px));
        top: 50%;
        transform: translate(0, -50%);
      }
      :host([placement="left"]) #arrow {
        top: 50%;
        left: 100%;
        border-width: var(--_tooltip-arrow-half-width) 0 var(--_tooltip-arrow-half-width) var(--_tooltip-arrow-height);
        border-color: transparent transparent transparent var(--_tooltip-arrow-background);
        transform: translate(0, -50%);
      }
      
      :host([placement="none"]) #arrow {
        display: none;
      }
    </style>
    <slot></slot>
    <div id="arrow"></div>
  `}class Al extends g.HTMLElement{constructor(){if(super(),this.updateXOffset=()=>{var e;if(!ov(this,{checkOpacity:!1,checkVisibilityCSS:!1}))return;const i=this.placement;if(i==="left"||i==="right"){this.style.removeProperty("--media-tooltip-offset-x");return}const a=getComputedStyle(this),r=(e=Rr(this,"#"+this.bounds))!=null?e:Xe(this);if(!r)return;const{x:n,width:s}=r.getBoundingClientRect(),{x:o,width:l}=this.getBoundingClientRect(),c=o+l,p=n+s,m=a.getPropertyValue("--media-tooltip-offset-x"),u=m?parseFloat(m.replace("px","")):0,d=a.getPropertyValue("--media-tooltip-container-margin"),v=d?parseFloat(d.replace("px","")):0,f=o-n+u-v,b=c-p+u+v;if(f<0){this.style.setProperty("--media-tooltip-offset-x",`${f}px`);return}if(b>0){this.style.setProperty("--media-tooltip-offset-x",`${b}px`);return}this.style.removeProperty("--media-tooltip-offset-x")},!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=lt(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}if(this.arrowEl=this.shadowRoot.querySelector("#arrow"),Object.prototype.hasOwnProperty.call(this,"placement")){const e=this.placement;delete this.placement,this.placement=e}}static get observedAttributes(){return[Ra.PLACEMENT,Ra.BOUNDS]}get placement(){return ce(this,Ra.PLACEMENT)}set placement(e){oe(this,Ra.PLACEMENT,e)}get bounds(){return ce(this,Ra.BOUNDS)}set bounds(e){oe(this,Ra.BOUNDS,e)}}Al.shadowRootOptions={mode:"open"};Al.getTemplateHTML=N1;g.customElements.get("media-tooltip")||g.customElements.define("media-tooltip",Al);var Qh=Al,Ju=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Ae=(t,e,i)=>(Ju(t,e,"read from private field"),i?i.call(t):e.get(t)),La=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},ss=(t,e,i,a)=>(Ju(t,e,"write to private field"),e.set(t,i),i),P1=(t,e,i)=>(Ju(t,e,"access private method"),i),Kt,sr,Bi,Ba,Us,Cd,wv;const ki={TOOLTIP_PLACEMENT:"tooltipplacement",DISABLED:"disabled",NO_TOOLTIP:"notooltip"};function $1(t,e={}){return`
    <style>
      :host {
        position: relative;
        font: var(--media-font,
          var(--media-font-weight, bold)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        padding: var(--media-button-padding, var(--media-control-padding, 10px));
        justify-content: var(--media-button-justify-content, center);
        display: inline-flex;
        align-items: center;
        vertical-align: middle;
        box-sizing: border-box;
        transition: background .15s linear;
        pointer-events: auto;
        cursor: var(--media-cursor, pointer);
        -webkit-tap-highlight-color: transparent;
      }

      
      :host(:focus-visible) {
        box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        outline: 0;
      }
      
      :host(:where(:focus)) {
        box-shadow: none;
        outline: 0;
      }

      :host(:hover) {
        background: var(--media-control-hover-background, rgba(50 50 70 / .7));
      }

      svg, img, ::slotted(svg), ::slotted(img) {
        width: var(--media-button-icon-width);
        height: var(--media-button-icon-height, var(--media-control-height, 24px));
        transform: var(--media-button-icon-transform);
        transition: var(--media-button-icon-transition);
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        vertical-align: middle;
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
      }

      media-tooltip {
        
        max-width: 0;
        overflow-x: clip;
        opacity: 0;
        transition: opacity .3s, max-width 0s 9s;
      }

      :host(:hover) media-tooltip,
      :host(:focus-visible) media-tooltip {
        max-width: 100vw;
        opacity: 1;
        transition: opacity .3s;
      }

      :host([notooltip]) slot[name="tooltip"] {
        display: none;
      }
    </style>

    ${this.getSlotTemplateHTML(t,e)}

    <slot name="tooltip">
      <media-tooltip part="tooltip" aria-hidden="true">
        <template shadowrootmode="${Qh.shadowRootOptions.mode}">
          ${Qh.getTemplateHTML({})}
        </template>
        <slot name="tooltip-content">
          ${this.getTooltipContentHTML(t)}
        </slot>
      </media-tooltip>
    </slot>
  `}function U1(t,e){return`
    <slot></slot>
  `}function H1(){return""}class Ne extends g.HTMLElement{constructor(){if(super(),La(this,Cd),La(this,Kt,void 0),this.preventClick=!1,this.tooltipEl=null,La(this,sr,e=>{this.preventClick||this.handleClick(e),setTimeout(Ae(this,Bi),0)}),La(this,Bi,()=>{var e,i;(i=(e=this.tooltipEl)==null?void 0:e.updateXOffset)==null||i.call(e)}),La(this,Ba,e=>{const{key:i}=e;if(!this.keysUsed.includes(i)){this.removeEventListener("keyup",Ae(this,Ba));return}this.preventClick||this.handleClick(e)}),La(this,Us,e=>{const{metaKey:i,altKey:a,key:r}=e;if(i||a||!this.keysUsed.includes(r)){this.removeEventListener("keyup",Ae(this,Ba));return}this.addEventListener("keyup",Ae(this,Ba),{once:!0})}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=lt(this.attributes),i=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(i):this.shadowRoot.innerHTML=i}this.tooltipEl=this.shadowRoot.querySelector("media-tooltip")}static get observedAttributes(){return["disabled",ki.TOOLTIP_PLACEMENT,X.MEDIA_CONTROLLER,h.MEDIA_LANG]}enable(){this.addEventListener("click",Ae(this,sr)),this.addEventListener("keydown",Ae(this,Us)),this.tabIndex=0}disable(){this.removeEventListener("click",Ae(this,sr)),this.removeEventListener("keydown",Ae(this,Us)),this.removeEventListener("keyup",Ae(this,Ba)),this.tabIndex=-1}attributeChangedCallback(e,i,a){var r,n,s,o,l;e===X.MEDIA_CONTROLLER?(i&&((n=(r=Ae(this,Kt))==null?void 0:r.unassociateElement)==null||n.call(r,this),ss(this,Kt,null)),a&&this.isConnected&&(ss(this,Kt,(s=this.getRootNode())==null?void 0:s.getElementById(a)),(l=(o=Ae(this,Kt))==null?void 0:o.associateElement)==null||l.call(o,this))):e==="disabled"&&a!==i?a==null?this.enable():this.disable():e===ki.TOOLTIP_PLACEMENT&&this.tooltipEl&&a!==i?this.tooltipEl.placement=a:e===h.MEDIA_LANG&&(this.shadowRoot.querySelector('slot[name="tooltip-content"]').innerHTML=this.constructor.getTooltipContentHTML()),Ae(this,Bi).call(this)}connectedCallback(){var e,i,a;const{style:r}=Re(this.shadowRoot,":host");r.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),this.hasAttribute("disabled")?this.disable():this.enable(),this.setAttribute("role","button");const n=this.getAttribute(X.MEDIA_CONTROLLER);n&&(ss(this,Kt,(e=this.getRootNode())==null?void 0:e.getElementById(n)),(a=(i=Ae(this,Kt))==null?void 0:i.associateElement)==null||a.call(i,this)),g.customElements.whenDefined("media-tooltip").then(()=>P1(this,Cd,wv).call(this))}disconnectedCallback(){var e,i;this.disable(),(i=(e=Ae(this,Kt))==null?void 0:e.unassociateElement)==null||i.call(e,this),ss(this,Kt,null),this.removeEventListener("mouseenter",Ae(this,Bi)),this.removeEventListener("focus",Ae(this,Bi)),this.removeEventListener("click",Ae(this,sr))}get keysUsed(){return["Enter"," "]}get tooltipPlacement(){return ce(this,ki.TOOLTIP_PLACEMENT)}set tooltipPlacement(e){oe(this,ki.TOOLTIP_PLACEMENT,e)}get mediaController(){return ce(this,X.MEDIA_CONTROLLER)}set mediaController(e){oe(this,X.MEDIA_CONTROLLER,e)}get disabled(){return Y(this,ki.DISABLED)}set disabled(e){G(this,ki.DISABLED,e)}get noTooltip(){return Y(this,ki.NO_TOOLTIP)}set noTooltip(e){G(this,ki.NO_TOOLTIP,e)}handleClick(e){}}Kt=new WeakMap;sr=new WeakMap;Bi=new WeakMap;Ba=new WeakMap;Us=new WeakMap;Cd=new WeakSet;wv=function(){this.addEventListener("mouseenter",Ae(this,Bi)),this.addEventListener("focus",Ae(this,Bi)),this.addEventListener("click",Ae(this,sr));const t=this.tooltipPlacement;t&&this.tooltipEl&&(this.tooltipEl.placement=t)};Ne.shadowRootOptions={mode:"open"};Ne.getTemplateHTML=$1;Ne.getSlotTemplateHTML=U1;Ne.getTooltipContentHTML=H1;g.customElements.get("media-chrome-button")||g.customElements.define("media-chrome-button",Ne);const jh=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.13 3H3.87a.87.87 0 0 0-.87.87v13.26a.87.87 0 0 0 .87.87h3.4L9 16H5V5h16v11h-4l1.72 2h3.4a.87.87 0 0 0 .87-.87V3.87a.87.87 0 0 0-.86-.87Zm-8.75 11.44a.5.5 0 0 0-.76 0l-4.91 5.73a.5.5 0 0 0 .38.83h9.82a.501.501 0 0 0 .38-.83l-4.91-5.73Z"/>
</svg>
`;function B1(t){return`
    <style>
      :host([${h.MEDIA_IS_AIRPLAYING}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${h.MEDIA_IS_AIRPLAYING}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${h.MEDIA_IS_AIRPLAYING}]) slot[name=tooltip-enter],
      :host(:not([${h.MEDIA_IS_AIRPLAYING}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${jh}</slot>
      <slot name="exit">${jh}</slot>
    </slot>
  `}function W1(){return`
    <slot name="tooltip-enter">${C("start airplay")}</slot>
    <slot name="tooltip-exit">${C("stop airplay")}</slot>
  `}const Zh=t=>{const e=t.mediaIsAirplaying?C("stop airplay"):C("start airplay");t.setAttribute("aria-label",e)};class ec extends Ne{static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_IS_AIRPLAYING,h.MEDIA_AIRPLAY_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),Zh(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===h.MEDIA_IS_AIRPLAYING&&Zh(this)}get mediaIsAirplaying(){return Y(this,h.MEDIA_IS_AIRPLAYING)}set mediaIsAirplaying(e){G(this,h.MEDIA_IS_AIRPLAYING,e)}get mediaAirplayUnavailable(){return ce(this,h.MEDIA_AIRPLAY_UNAVAILABLE)}set mediaAirplayUnavailable(e){oe(this,h.MEDIA_AIRPLAY_UNAVAILABLE,e)}handleClick(){const e=new g.CustomEvent(D.MEDIA_AIRPLAY_REQUEST,{composed:!0,bubbles:!0});this.dispatchEvent(e)}}ec.getSlotTemplateHTML=B1;ec.getTooltipContentHTML=W1;g.customElements.get("media-airplay-button")||g.customElements.define("media-airplay-button",ec);const F1=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`,K1=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`;function V1(t){return`
    <style>
      :host([aria-checked="true"]) slot[name=off] {
        display: none !important;
      }

      
      :host(:not([aria-checked="true"])) slot[name=on] {
        display: none !important;
      }

      :host([aria-checked="true"]) slot[name=tooltip-enable],
      :host(:not([aria-checked="true"])) slot[name=tooltip-disable] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="on">${F1}</slot>
      <slot name="off">${K1}</slot>
    </slot>
  `}function q1(){return`
    <slot name="tooltip-enable">${C("Enable captions")}</slot>
    <slot name="tooltip-disable">${C("Disable captions")}</slot>
  `}const Xh=t=>{t.setAttribute("aria-checked",fv(t).toString())};class tc extends Ne{static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_SUBTITLES_LIST,h.MEDIA_SUBTITLES_SHOWING]}connectedCallback(){super.connectedCallback(),this.setAttribute("role","button"),this.setAttribute("aria-label",C("closed captions")),Xh(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===h.MEDIA_SUBTITLES_SHOWING&&Xh(this)}get mediaSubtitlesList(){return Jh(this,h.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){em(this,h.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return Jh(this,h.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){em(this,h.MEDIA_SUBTITLES_SHOWING,e)}handleClick(){this.dispatchEvent(new g.CustomEvent(D.MEDIA_TOGGLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0}))}}tc.getSlotTemplateHTML=V1;tc.getTooltipContentHTML=q1;const Jh=(t,e)=>{const i=t.getAttribute(e);return i?yl(i):[]},em=(t,e,i)=>{if(!(i!=null&&i.length)){t.removeAttribute(e);return}const a=Bn(i);t.getAttribute(e)!==a&&t.setAttribute(e,a)};g.customElements.get("media-captions-button")||g.customElements.define("media-captions-button",tc);const Y1='<svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/></g></svg>',G1='<svg aria-hidden="true" viewBox="0 0 24 24"><g><path class="cast_caf_icon_arch0" d="M1,18 L1,21 L4,21 C4,19.3 2.66,18 1,18 L1,18 Z"/><path class="cast_caf_icon_arch1" d="M1,14 L1,16 C3.76,16 6,18.2 6,21 L8,21 C8,17.13 4.87,14 1,14 L1,14 Z"/><path class="cast_caf_icon_arch2" d="M1,10 L1,12 C5.97,12 10,16.0 10,21 L12,21 C12,14.92 7.07,10 1,10 L1,10 Z"/><path class="cast_caf_icon_box" d="M21,3 L3,3 C1.9,3 1,3.9 1,5 L1,8 L3,8 L3,5 L21,5 L21,19 L14,19 L14,21 L21,21 C22.1,21 23,20.1 23,19 L23,5 C23,3.9 22.1,3 21,3 L21,3 Z"/><path class="cast_caf_icon_boxfill" d="M5,7 L5,8.63 C8,8.6 13.37,14 13.37,17 L19,17 L19,7 Z"/></g></svg>';function z1(t){return`
    <style>
      :host([${h.MEDIA_IS_CASTING}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${h.MEDIA_IS_CASTING}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${h.MEDIA_IS_CASTING}]) slot[name=tooltip-enter],
      :host(:not([${h.MEDIA_IS_CASTING}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${Y1}</slot>
      <slot name="exit">${G1}</slot>
    </slot>
  `}function Q1(){return`
    <slot name="tooltip-enter">${C("Start casting")}</slot>
    <slot name="tooltip-exit">${C("Stop casting")}</slot>
  `}const tm=t=>{const e=t.mediaIsCasting?C("stop casting"):C("start casting");t.setAttribute("aria-label",e)};class ic extends Ne{static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_IS_CASTING,h.MEDIA_CAST_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),tm(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===h.MEDIA_IS_CASTING&&tm(this)}get mediaIsCasting(){return Y(this,h.MEDIA_IS_CASTING)}set mediaIsCasting(e){G(this,h.MEDIA_IS_CASTING,e)}get mediaCastUnavailable(){return ce(this,h.MEDIA_CAST_UNAVAILABLE)}set mediaCastUnavailable(e){oe(this,h.MEDIA_CAST_UNAVAILABLE,e)}handleClick(){const e=this.mediaIsCasting?D.MEDIA_EXIT_CAST_REQUEST:D.MEDIA_ENTER_CAST_REQUEST;this.dispatchEvent(new g.CustomEvent(e,{composed:!0,bubbles:!0}))}}ic.getSlotTemplateHTML=z1;ic.getTooltipContentHTML=Q1;g.customElements.get("media-cast-button")||g.customElements.define("media-cast-button",ic);var ac=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},ga=(t,e,i)=>(ac(t,e,"read from private field"),e.get(t)),li=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},rc=(t,e,i,a)=>(ac(t,e,"write to private field"),e.set(t,i),i),Zi=(t,e,i)=>(ac(t,e,"access private method"),i),Wo,Wn,Aa,Hs,Dd,Md,Sv,xd,Iv,Od,Rv,Nd,Lv,Pd,Cv;function j1(t){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        display: var(--media-dialog-display, inline-flex);
        justify-content: center;
        align-items: center;
        
        transition-behavior: allow-discrete;
        visibility: hidden;
        opacity: 0;
        transform: translateY(2px) scale(.99);
        pointer-events: none;
      }

      :host([open]) {
        transition: display .2s, visibility 0s, opacity .2s ease-out, transform .15s ease-out;
        visibility: visible;
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: auto;
      }

      #content {
        display: flex;
        position: relative;
        box-sizing: border-box;
        width: min(320px, 100%);
        word-wrap: break-word;
        max-height: 100%;
        overflow: auto;
        text-align: center;
        line-height: 1.4;
      }
    </style>
    ${this.getSlotTemplateHTML(t)}
  `}function Z1(t){return`
    <slot id="content"></slot>
  `}const Ur={OPEN:"open",ANCHOR:"anchor"};class Lr extends g.HTMLElement{constructor(){super(),li(this,Hs),li(this,Md),li(this,xd),li(this,Od),li(this,Nd),li(this,Pd),li(this,Wo,!1),li(this,Wn,null),li(this,Aa,null)}static get observedAttributes(){return[Ur.OPEN,Ur.ANCHOR]}get open(){return Y(this,Ur.OPEN)}set open(e){G(this,Ur.OPEN,e)}handleEvent(e){switch(e.type){case"invoke":Zi(this,Od,Rv).call(this,e);break;case"focusout":Zi(this,Nd,Lv).call(this,e);break;case"keydown":Zi(this,Pd,Cv).call(this,e);break}}connectedCallback(){Zi(this,Hs,Dd).call(this),this.role||(this.role="dialog"),this.addEventListener("invoke",this),this.addEventListener("focusout",this),this.addEventListener("keydown",this)}disconnectedCallback(){this.removeEventListener("invoke",this),this.removeEventListener("focusout",this),this.removeEventListener("keydown",this)}attributeChangedCallback(e,i,a){Zi(this,Hs,Dd).call(this),e===Ur.OPEN&&a!==i&&(this.open?Zi(this,Md,Sv).call(this):Zi(this,xd,Iv).call(this))}focus(){rc(this,Wn,qu());const e=!this.dispatchEvent(new Event("focus",{composed:!0,cancelable:!0})),i=!this.dispatchEvent(new Event("focusin",{composed:!0,bubbles:!0,cancelable:!0}));if(e||i)return;const a=this.querySelector('[autofocus], [tabindex]:not([tabindex="-1"]), [role="menu"]');a==null||a.focus()}get keysUsed(){return["Escape","Tab"]}}Wo=new WeakMap;Wn=new WeakMap;Aa=new WeakMap;Hs=new WeakSet;Dd=function(){if(!ga(this,Wo)&&(rc(this,Wo,!0),!this.shadowRoot)){this.attachShadow(this.constructor.shadowRootOptions);const t=lt(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(t),queueMicrotask(()=>{const{style:e}=Re(this.shadowRoot,":host");e.setProperty("transition","display .15s, visibility .15s, opacity .15s ease-in, transform .15s ease-in")})}};Md=new WeakSet;Sv=function(){var t;(t=ga(this,Aa))==null||t.setAttribute("aria-expanded","true"),this.dispatchEvent(new Event("open",{composed:!0,bubbles:!0})),this.addEventListener("transitionend",()=>this.focus(),{once:!0})};xd=new WeakSet;Iv=function(){var t;(t=ga(this,Aa))==null||t.setAttribute("aria-expanded","false"),this.dispatchEvent(new Event("close",{composed:!0,bubbles:!0}))};Od=new WeakSet;Rv=function(t){rc(this,Aa,t.relatedTarget),Ai(this,t.relatedTarget)||(this.open=!this.open)};Nd=new WeakSet;Lv=function(t){var e;Ai(this,t.relatedTarget)||((e=ga(this,Wn))==null||e.focus(),ga(this,Aa)&&ga(this,Aa)!==t.relatedTarget&&this.open&&(this.open=!1))};Pd=new WeakSet;Cv=function(t){var e,i,a,r,n;const{key:s,ctrlKey:o,altKey:l,metaKey:c}=t;o||l||c||this.keysUsed.includes(s)&&(t.preventDefault(),t.stopPropagation(),s==="Tab"?(t.shiftKey?(i=(e=this.previousElementSibling)==null?void 0:e.focus)==null||i.call(e):(r=(a=this.nextElementSibling)==null?void 0:a.focus)==null||r.call(a),this.blur()):s==="Escape"&&((n=ga(this,Wn))==null||n.focus(),this.open=!1))};Lr.shadowRootOptions={mode:"open"};Lr.getTemplateHTML=j1;Lr.getSlotTemplateHTML=Z1;g.customElements.get("media-chrome-dialog")||g.customElements.define("media-chrome-dialog",Lr);var nc=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},me=(t,e,i)=>(nc(t,e,"read from private field"),i?i.call(t):e.get(t)),Pe=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Li=(t,e,i,a)=>(nc(t,e,"write to private field"),e.set(t,i),i),Ct=(t,e,i)=>(nc(t,e,"access private method"),i),Vt,kl,Bs,Ws,Dt,Fo,Fs,Ks,Vs,sc,Dv,qs,$d,Ys,Ud,Ko,oc,Hd,Mv,Bd,xv,Wd,Ov,Fd,Nv;function X1(t){return`
    <style>
      :host {
        --_focus-box-shadow: var(--media-focus-box-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        --_media-range-padding: var(--media-range-padding, var(--media-control-padding, 10px));

        box-shadow: var(--_focus-visible-box-shadow, none);
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        height: calc(var(--media-control-height, 24px) + 2 * var(--_media-range-padding));
        display: inline-flex;
        align-items: center;
        
        vertical-align: middle;
        box-sizing: border-box;
        position: relative;
        width: 100px;
        transition: background .15s linear;
        cursor: var(--media-cursor, pointer);
        pointer-events: auto;
        touch-action: none; 
      }

      
      input[type=range]:focus {
        outline: 0;
      }
      input[type=range]:focus::-webkit-slider-runnable-track {
        outline: 0;
      }

      :host(:hover) {
        background: var(--media-control-hover-background, rgb(50 50 70 / .7));
      }

      #leftgap {
        padding-left: var(--media-range-padding-left, var(--_media-range-padding));
      }

      #rightgap {
        padding-right: var(--media-range-padding-right, var(--_media-range-padding));
      }

      #startpoint,
      #endpoint {
        position: absolute;
      }

      #endpoint {
        right: 0;
      }

      #container {
        
        width: var(--media-range-track-width, 100%);
        transform: translate(var(--media-range-track-translate-x, 0px), var(--media-range-track-translate-y, 0px));
        position: relative;
        height: 100%;
        display: flex;
        align-items: center;
        min-width: 40px;
      }

      #range {
        
        display: var(--media-time-range-hover-display, block);
        bottom: var(--media-time-range-hover-bottom, -7px);
        height: var(--media-time-range-hover-height, max(100% + 7px, 25px));
        width: 100%;
        position: absolute;
        cursor: var(--media-cursor, pointer);

        -webkit-appearance: none; 
        -webkit-tap-highlight-color: transparent;
        background: transparent; 
        margin: 0;
        z-index: 1;
      }

      @media (hover: hover) {
        #range {
          bottom: var(--media-time-range-hover-bottom, -5px);
          height: var(--media-time-range-hover-height, max(100% + 5px, 20px));
        }
      }

      
      
      #range::-webkit-slider-thumb {
        -webkit-appearance: none;
        background: transparent;
        width: .1px;
        height: .1px;
      }

      
      #range::-moz-range-thumb {
        background: transparent;
        border: transparent;
        width: .1px;
        height: .1px;
      }

      #appearance {
        height: var(--media-range-track-height, 4px);
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        position: absolute;
        
        will-change: transform;
      }

      #track {
        background: var(--media-range-track-background, rgb(255 255 255 / .2));
        border-radius: var(--media-range-track-border-radius, 1px);
        border: var(--media-range-track-border, none);
        outline: var(--media-range-track-outline);
        outline-offset: var(--media-range-track-outline-offset);
        backdrop-filter: var(--media-range-track-backdrop-filter);
        -webkit-backdrop-filter: var(--media-range-track-backdrop-filter);
        box-shadow: var(--media-range-track-box-shadow, none);
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      #progress,
      #pointer {
        position: absolute;
        height: 100%;
        will-change: width;
      }

      #progress {
        background: var(--media-range-bar-color, var(--media-primary-color, rgb(238 238 238)));
        transition: var(--media-range-track-transition);
      }

      #pointer {
        background: var(--media-range-track-pointer-background);
        border-right: var(--media-range-track-pointer-border-right);
        transition: visibility .25s, opacity .25s;
        visibility: hidden;
        opacity: 0;
      }

      @media (hover: hover) {
        :host(:hover) #pointer {
          transition: visibility .5s, opacity .5s;
          visibility: visible;
          opacity: 1;
        }
      }

      #thumb,
      ::slotted([slot=thumb]) {
        width: var(--media-range-thumb-width, 10px);
        height: var(--media-range-thumb-height, 10px);
        transition: var(--media-range-thumb-transition);
        transform: var(--media-range-thumb-transform, none);
        opacity: var(--media-range-thumb-opacity, 1);
        translate: -50%;
        position: absolute;
        left: 0;
        cursor: var(--media-cursor, pointer);
      }

      #thumb {
        border-radius: var(--media-range-thumb-border-radius, 10px);
        background: var(--media-range-thumb-background, var(--media-primary-color, rgb(238 238 238)));
        box-shadow: var(--media-range-thumb-box-shadow, 1px 1px 1px transparent);
        border: var(--media-range-thumb-border, none);
      }

      :host([disabled]) #thumb {
        background-color: #777;
      }

      .segments #appearance {
        height: var(--media-range-segment-hover-height, 7px);
      }

      #track {
        clip-path: url(#segments-clipping);
      }

      #segments {
        --segments-gap: var(--media-range-segments-gap, 2px);
        position: absolute;
        width: 100%;
        height: 100%;
      }

      #segments-clipping {
        transform: translateX(calc(var(--segments-gap) / 2));
      }

      #segments-clipping:empty {
        display: none;
      }

      #segments-clipping rect {
        height: var(--media-range-track-height, 4px);
        y: calc((var(--media-range-segment-hover-height, 7px) - var(--media-range-track-height, 4px)) / 2);
        transition: var(--media-range-segment-transition, transform .1s ease-in-out);
        transform: var(--media-range-segment-transform, scaleY(1));
        transform-origin: center;
      }

      /* Visible label for accessibility - positioned off-screen but technically visible (Firefox requires visible labels) */
      #range-label {
        position: absolute;
        left: -10000px;
        background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        pointer-events: none;
      }
    </style>
    <div id="leftgap"></div>
    <div id="container">
      <div id="startpoint"></div>
      <div id="endpoint"></div>
      <div id="appearance">
        <div id="track" part="track">
          <div id="pointer"></div>
          <div id="progress" part="progress"></div>
        </div>
        <slot name="thumb">
          <div id="thumb" part="thumb"></div>
        </slot>
        <svg id="segments" aria-hidden="true"><clipPath id="segments-clipping"></clipPath></svg>
      </div>
        <input id="range" type="range" min="0" max="1" step="any" value="0">
        <label for="range" id="range-label"></label>

      ${this.getContainerTemplateHTML(t)}
    </div>
    <div id="rightgap"></div>
  `}function J1(t){return""}class Cr extends g.HTMLElement{constructor(){if(super(),Pe(this,sc),Pe(this,qs),Pe(this,Ys),Pe(this,Ko),Pe(this,Hd),Pe(this,Bd),Pe(this,Wd),Pe(this,Fd),Pe(this,Vt,void 0),Pe(this,kl,void 0),Pe(this,Bs,void 0),Pe(this,Ws,void 0),Pe(this,Dt,{}),Pe(this,Fo,[]),Pe(this,Fs,()=>{if(this.range.matches(":focus-visible")){const{style:e}=Re(this.shadowRoot,":host");e.setProperty("--_focus-visible-box-shadow","var(--_focus-box-shadow)")}}),Pe(this,Ks,()=>{const{style:e}=Re(this.shadowRoot,":host");e.removeProperty("--_focus-visible-box-shadow")}),Pe(this,Vs,()=>{const e=this.shadowRoot.querySelector("#segments-clipping");e&&e.parentNode.append(e)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=lt(this.attributes),i=this.constructor.getTemplateHTML(e);this.shadowRoot.setHTMLUnsafe?this.shadowRoot.setHTMLUnsafe(i):this.shadowRoot.innerHTML=i}this.container=this.shadowRoot.querySelector("#container"),Li(this,Bs,this.shadowRoot.querySelector("#startpoint")),Li(this,Ws,this.shadowRoot.querySelector("#endpoint")),this.range=this.shadowRoot.querySelector("#range"),this.appearance=this.shadowRoot.querySelector("#appearance")}static get observedAttributes(){return["disabled","aria-disabled",X.MEDIA_CONTROLLER]}attributeChangedCallback(e,i,a){var r,n,s,o,l;e===X.MEDIA_CONTROLLER?(i&&((n=(r=me(this,Vt))==null?void 0:r.unassociateElement)==null||n.call(r,this),Li(this,Vt,null)),a&&this.isConnected&&(Li(this,Vt,(s=this.getRootNode())==null?void 0:s.getElementById(a)),(l=(o=me(this,Vt))==null?void 0:o.associateElement)==null||l.call(o,this))):(e==="disabled"||e==="aria-disabled"&&i!==a)&&(a==null?(this.range.removeAttribute(e),Ct(this,qs,$d).call(this)):(this.range.setAttribute(e,a),Ct(this,Ys,Ud).call(this)))}connectedCallback(){var e,i,a;const{style:r}=Re(this.shadowRoot,":host");r.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`),me(this,Dt).pointer=Re(this.shadowRoot,"#pointer"),me(this,Dt).progress=Re(this.shadowRoot,"#progress"),me(this,Dt).thumb=Re(this.shadowRoot,'#thumb, ::slotted([slot="thumb"])'),me(this,Dt).activeSegment=Re(this.shadowRoot,"#segments-clipping rect:nth-child(0)");const n=this.getAttribute(X.MEDIA_CONTROLLER);n&&(Li(this,Vt,(e=this.getRootNode())==null?void 0:e.getElementById(n)),(a=(i=me(this,Vt))==null?void 0:i.associateElement)==null||a.call(i,this)),this.updateBar(),this.shadowRoot.addEventListener("focusin",me(this,Fs)),this.shadowRoot.addEventListener("focusout",me(this,Ks)),Ct(this,qs,$d).call(this),Tr(this.container,me(this,Vs))}disconnectedCallback(){var e,i;Ct(this,Ys,Ud).call(this),(i=(e=me(this,Vt))==null?void 0:e.unassociateElement)==null||i.call(e,this),Li(this,Vt,null),this.shadowRoot.removeEventListener("focusin",me(this,Fs)),this.shadowRoot.removeEventListener("focusout",me(this,Ks)),Ar(this.container,me(this,Vs))}updatePointerBar(e){var i;(i=me(this,Dt).pointer)==null||i.style.setProperty("width",`${this.getPointerRatio(e)*100}%`)}updateBar(){var e,i;const a=this.range.valueAsNumber*100;(e=me(this,Dt).progress)==null||e.style.setProperty("width",`${a}%`),(i=me(this,Dt).thumb)==null||i.style.setProperty("left",`${a}%`)}updateSegments(e){const i=this.shadowRoot.querySelector("#segments-clipping");if(i.textContent="",this.container.classList.toggle("segments",!!(e!=null&&e.length)),!(e!=null&&e.length))return;const a=[...new Set([+this.range.min,...e.flatMap(n=>[n.start,n.end]),+this.range.max])];Li(this,Fo,[...a]);const r=a.pop();for(const[n,s]of a.entries()){const[o,l]=[n===0,n===a.length-1],c=o?"calc(var(--segments-gap) / -1)":`${s*100}%`,m=`calc(${((l?r:a[n+1])-s)*100}%${o||l?"":" - var(--segments-gap)"})`,u=ke.createElementNS("http://www.w3.org/2000/svg","rect"),d=Yu(this.shadowRoot,`#segments-clipping rect:nth-child(${n+1})`);d.style.setProperty("x",c),d.style.setProperty("width",m),i.append(u)}}getPointerRatio(e){return q0(e.clientX,e.clientY,me(this,Bs).getBoundingClientRect(),me(this,Ws).getBoundingClientRect())}get dragging(){return this.hasAttribute("dragging")}handleEvent(e){switch(e.type){case"pointermove":Ct(this,Fd,Nv).call(this,e);break;case"input":this.updateBar();break;case"pointerenter":Ct(this,Hd,Mv).call(this,e);break;case"pointerdown":Ct(this,Ko,oc).call(this,e);break;case"pointerup":Ct(this,Bd,xv).call(this);break;case"pointerleave":Ct(this,Wd,Ov).call(this);break}}get keysUsed(){return["ArrowUp","ArrowRight","ArrowDown","ArrowLeft"]}}Vt=new WeakMap;kl=new WeakMap;Bs=new WeakMap;Ws=new WeakMap;Dt=new WeakMap;Fo=new WeakMap;Fs=new WeakMap;Ks=new WeakMap;Vs=new WeakMap;sc=new WeakSet;Dv=function(t){const e=me(this,Dt).activeSegment;if(!e)return;const i=this.getPointerRatio(t),r=`#segments-clipping rect:nth-child(${me(this,Fo).findIndex((n,s,o)=>{const l=o[s+1];return l!=null&&i>=n&&i<=l})+1})`;(e.selectorText!=r||!e.style.transform)&&(e.selectorText=r,e.style.setProperty("transform","var(--media-range-segment-hover-transform, scaleY(2))"))};qs=new WeakSet;$d=function(){this.hasAttribute("disabled")||!this.isConnected||(this.addEventListener("input",this),this.addEventListener("pointerdown",this),this.addEventListener("pointerenter",this))};Ys=new WeakSet;Ud=function(){var t,e;this.removeEventListener("input",this),this.removeEventListener("pointerdown",this),this.removeEventListener("pointerenter",this),this.removeEventListener("pointerleave",this),(t=g.window)==null||t.removeEventListener("pointerup",this),(e=g.window)==null||e.removeEventListener("pointermove",this)};Ko=new WeakSet;oc=function(t){var e;Li(this,kl,t.composedPath().includes(this.range)),(e=g.window)==null||e.addEventListener("pointerup",this,{once:!0})};Hd=new WeakSet;Mv=function(t){var e;t.pointerType!=="mouse"&&Ct(this,Ko,oc).call(this,t),this.addEventListener("pointerleave",this,{once:!0}),(e=g.window)==null||e.addEventListener("pointermove",this)};Bd=new WeakSet;xv=function(){var t;(t=g.window)==null||t.removeEventListener("pointerup",this),this.toggleAttribute("dragging",!1),this.range.disabled=this.hasAttribute("disabled")};Wd=new WeakSet;Ov=function(){var t,e;this.removeEventListener("pointerleave",this),(t=g.window)==null||t.removeEventListener("pointermove",this),this.toggleAttribute("dragging",!1),this.range.disabled=this.hasAttribute("disabled"),(e=me(this,Dt).activeSegment)==null||e.style.removeProperty("transform")};Fd=new WeakSet;Nv=function(t){t.pointerType==="pen"&&t.buttons===0||(this.toggleAttribute("dragging",t.buttons===1||t.pointerType!=="mouse"),this.updatePointerBar(t),Ct(this,sc,Dv).call(this,t),this.dragging&&(t.pointerType!=="mouse"||!me(this,kl))&&(this.range.disabled=!0,this.range.valueAsNumber=this.getPointerRatio(t),this.range.dispatchEvent(new Event("input",{bubbles:!0,composed:!0}))))};Cr.shadowRootOptions={mode:"open"};Cr.getTemplateHTML=X1;Cr.getContainerTemplateHTML=J1;g.customElements.get("media-chrome-range")||g.customElements.define("media-chrome-range",Cr);var Pv=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},os=(t,e,i)=>(Pv(t,e,"read from private field"),i?i.call(t):e.get(t)),ey=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},ls=(t,e,i,a)=>(Pv(t,e,"write to private field"),e.set(t,i),i),qt;function ty(t){return`
    <style>
      :host {
        
        box-sizing: border-box;
        display: var(--media-control-display, var(--media-control-bar-display, inline-flex));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        --media-loading-indicator-icon-height: 44px;
      }

      ::slotted(media-time-range),
      ::slotted(media-volume-range) {
        min-height: 100%;
      }

      ::slotted(media-time-range),
      ::slotted(media-clip-selector) {
        flex-grow: 1;
      }

      ::slotted([role="menu"]) {
        position: absolute;
      }
    </style>

    <slot></slot>
  `}class lc extends g.HTMLElement{constructor(){if(super(),ey(this,qt,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=lt(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[X.MEDIA_CONTROLLER]}attributeChangedCallback(e,i,a){var r,n,s,o,l;e===X.MEDIA_CONTROLLER&&(i&&((n=(r=os(this,qt))==null?void 0:r.unassociateElement)==null||n.call(r,this),ls(this,qt,null)),a&&this.isConnected&&(ls(this,qt,(s=this.getRootNode())==null?void 0:s.getElementById(a)),(l=(o=os(this,qt))==null?void 0:o.associateElement)==null||l.call(o,this)))}connectedCallback(){var e,i,a;const r=this.getAttribute(X.MEDIA_CONTROLLER);r&&(ls(this,qt,(e=this.getRootNode())==null?void 0:e.getElementById(r)),(a=(i=os(this,qt))==null?void 0:i.associateElement)==null||a.call(i,this))}disconnectedCallback(){var e,i;(i=(e=os(this,qt))==null?void 0:e.unassociateElement)==null||i.call(e,this),ls(this,qt,null)}}qt=new WeakMap;lc.shadowRootOptions={mode:"open"};lc.getTemplateHTML=ty;g.customElements.get("media-control-bar")||g.customElements.define("media-control-bar",lc);var $v=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},ds=(t,e,i)=>($v(t,e,"read from private field"),i?i.call(t):e.get(t)),iy=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},us=(t,e,i,a)=>($v(t,e,"write to private field"),e.set(t,i),i),Yt;function ay(t,e={}){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        background: var(--media-text-background, var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7))));
        padding: var(--media-control-padding, 10px);
        display: inline-flex;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
        box-sizing: border-box;
        text-align: center;
        pointer-events: auto;
      }

      
      :host(:focus-visible) {
        box-shadow: inset 0 0 0 2px rgb(27 127 204 / .9);
        outline: 0;
      }

      
      :host(:where(:focus)) {
        box-shadow: none;
        outline: 0;
      }
    </style>

    ${this.getSlotTemplateHTML(t,e)}
  `}function ry(t,e){return`
    <slot></slot>
  `}class Gi extends g.HTMLElement{constructor(){if(super(),iy(this,Yt,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=lt(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[X.MEDIA_CONTROLLER]}attributeChangedCallback(e,i,a){var r,n,s,o,l;e===X.MEDIA_CONTROLLER&&(i&&((n=(r=ds(this,Yt))==null?void 0:r.unassociateElement)==null||n.call(r,this),us(this,Yt,null)),a&&this.isConnected&&(us(this,Yt,(s=this.getRootNode())==null?void 0:s.getElementById(a)),(l=(o=ds(this,Yt))==null?void 0:o.associateElement)==null||l.call(o,this)))}connectedCallback(){var e,i,a;const{style:r}=Re(this.shadowRoot,":host");r.setProperty("display",`var(--media-control-display, var(--${this.localName}-display, inline-flex))`);const n=this.getAttribute(X.MEDIA_CONTROLLER);n&&(us(this,Yt,(e=this.getRootNode())==null?void 0:e.getElementById(n)),(a=(i=ds(this,Yt))==null?void 0:i.associateElement)==null||a.call(i,this))}disconnectedCallback(){var e,i;(i=(e=ds(this,Yt))==null?void 0:e.unassociateElement)==null||i.call(e,this),us(this,Yt,null)}}Yt=new WeakMap;Gi.shadowRootOptions={mode:"open"};Gi.getTemplateHTML=ay;Gi.getSlotTemplateHTML=ry;g.customElements.get("media-text-display")||g.customElements.define("media-text-display",Gi);var Uv=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},im=(t,e,i)=>(Uv(t,e,"read from private field"),i?i.call(t):e.get(t)),ny=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},sy=(t,e,i,a)=>(Uv(t,e,"write to private field"),e.set(t,i),i),sn;function oy(t,e){return`
    <slot>${Yi(e.mediaDuration)}</slot>
  `}class Hv extends Gi{constructor(){var e;super(),ny(this,sn,void 0),sy(this,sn,this.shadowRoot.querySelector("slot")),im(this,sn).textContent=Yi((e=this.mediaDuration)!=null?e:0)}static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_DURATION]}attributeChangedCallback(e,i,a){e===h.MEDIA_DURATION&&(im(this,sn).textContent=Yi(+a)),super.attributeChangedCallback(e,i,a)}get mediaDuration(){return se(this,h.MEDIA_DURATION)}set mediaDuration(e){ve(this,h.MEDIA_DURATION,e)}}sn=new WeakMap;Hv.getSlotTemplateHTML=oy;g.customElements.get("media-duration-display")||g.customElements.define("media-duration-display",Hv);const ly={2:C("Network Error"),3:C("Decode Error"),4:C("Source Not Supported"),5:C("Encryption Error")},dy={2:C("A network error caused the media download to fail."),3:C("A media error caused playback to be aborted. The media could be corrupt or your browser does not support this format."),4:C("An unsupported error occurred. The server or network failed, or your browser does not support this format."),5:C("The media is encrypted and there are no keys to decrypt it.")},dc=t=>{var e,i;return t.code===1?null:{title:(e=ly[t.code])!=null?e:`Error ${t.code}`,message:(i=dy[t.code])!=null?i:t.message}};var Bv=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},uy=(t,e,i)=>(Bv(t,e,"read from private field"),i?i.call(t):e.get(t)),cy=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},hy=(t,e,i,a)=>(Bv(t,e,"write to private field"),e.set(t,i),i),Gs;function my(t){return`
    <style>
      :host {
        background: rgb(20 20 30 / .8);
      }

      #content {
        display: block;
        padding: 1.2em 1.5em;
      }

      h3,
      p {
        margin-block: 0 .3em;
      }
    </style>
    <slot name="error-${t.mediaerrorcode}" id="content">
      ${Wv({code:+t.mediaerrorcode,message:t.mediaerrormessage})}
    </slot>
  `}function py(t){return t.code&&dc(t)!==null}function Wv(t){var e;const{title:i,message:a}=(e=dc(t))!=null?e:{};let r="";return i&&(r+=`<slot name="error-${t.code}-title"><h3>${i}</h3></slot>`),a&&(r+=`<slot name="error-${t.code}-message"><p>${a}</p></slot>`),r}const am=[h.MEDIA_ERROR_CODE,h.MEDIA_ERROR_MESSAGE];class wl extends Lr{constructor(){super(...arguments),cy(this,Gs,null)}static get observedAttributes(){return[...super.observedAttributes,...am]}formatErrorMessage(e){return this.constructor.formatErrorMessage(e)}attributeChangedCallback(e,i,a){var r;if(super.attributeChangedCallback(e,i,a),!am.includes(e))return;const n=(r=this.mediaError)!=null?r:{code:this.mediaErrorCode,message:this.mediaErrorMessage};if(this.open=py(n),this.open&&(this.shadowRoot.querySelector("slot").name=`error-${this.mediaErrorCode}`,this.shadowRoot.querySelector("#content").innerHTML=this.formatErrorMessage(n),!this.hasAttribute("aria-label"))){const{title:s}=dc(n);s&&this.setAttribute("aria-label",s)}}get mediaError(){return uy(this,Gs)}set mediaError(e){hy(this,Gs,e)}get mediaErrorCode(){return se(this,"mediaerrorcode")}set mediaErrorCode(e){ve(this,"mediaerrorcode",e)}get mediaErrorMessage(){return ce(this,"mediaerrormessage")}set mediaErrorMessage(e){oe(this,"mediaerrormessage",e)}}Gs=new WeakMap;wl.getSlotTemplateHTML=my;wl.formatErrorMessage=Wv;g.customElements.get("media-error-dialog")||g.customElements.define("media-error-dialog",wl);var Fv=wl,vy=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},wi=(t,e,i)=>(vy(t,e,"read from private field"),i?i.call(t):e.get(t)),rm=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Wa,Fa;function fy(t){return`
    <style>
      :host {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 9999;
        background: rgb(20 20 30 / .8);
        backdrop-filter: blur(10px);
      }

      #content {
        display: block;
        width: clamp(400px, 40vw, 700px);
        max-width: 90vw;
        text-align: left;
      }

      h2 {
        margin: 0 0 1.5rem 0;
        font-size: 1.5rem;
        font-weight: 500;
        text-align: center;
      }

      .shortcuts-table {
        width: 100%;
        border-collapse: collapse;
      }

      .shortcuts-table tr {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .shortcuts-table tr:last-child {
        border-bottom: none;
      }

      .shortcuts-table td {
        padding: 0.75rem 0.5rem;
      }

      .shortcuts-table td:first-child {
        text-align: right;
        padding-right: 1rem;
        width: 40%;
        min-width: 120px;
      }

      .shortcuts-table td:last-child {
        padding-left: 1rem;
      }

      .key {
        display: inline-block;
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        font-weight: 500;
        min-width: 1.5rem;
        text-align: center;
        margin: 0 0.2rem;
      }

      .description {
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.95rem;
      }

      .key-combo {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.3rem;
      }

      .key-separator {
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.9rem;
      }
    </style>
    <slot id="content">
      ${Ey()}
    </slot>
  `}function Ey(){return`
    <h2>Keyboard Shortcuts</h2>
    <table class="shortcuts-table">${[{keys:["Space","k"],description:"Toggle Playback"},{keys:["m"],description:"Toggle mute"},{keys:["f"],description:"Toggle fullscreen"},{keys:["c"],description:"Toggle captions or subtitles, if available"},{keys:["p"],description:"Toggle Picture in Picture"},{keys:["←","j"],description:"Seek back 10s"},{keys:["→","l"],description:"Seek forward 10s"},{keys:["↑"],description:"Turn volume up"},{keys:["↓"],description:"Turn volume down"},{keys:["< (SHIFT+,)"],description:"Decrease playback rate"},{keys:["> (SHIFT+.)"],description:"Increase playback rate"}].map(({keys:i,description:a})=>`
      <tr>
        <td>
          <div class="key-combo">${i.map((n,s)=>s>0?`<span class="key-separator">or</span><span class="key">${n}</span>`:`<span class="key">${n}</span>`).join("")}</div>
        </td>
        <td class="description">${a}</td>
      </tr>
    `).join("")}</table>
  `}class Kv extends Lr{constructor(){super(...arguments),rm(this,Wa,e=>{var i;if(!this.open)return;const a=(i=this.shadowRoot)==null?void 0:i.querySelector("#content");if(!a)return;const r=e.composedPath(),n=r[0]===this||r.includes(this),s=r.includes(a);n&&!s&&(this.open=!1)}),rm(this,Fa,e=>{if(!this.open)return;const i=e.shiftKey&&(e.key==="/"||e.key==="?");(e.key==="Escape"||i)&&!e.ctrlKey&&!e.altKey&&!e.metaKey&&(this.open=!1,e.preventDefault(),e.stopPropagation())})}connectedCallback(){super.connectedCallback(),this.open&&(this.addEventListener("click",wi(this,Wa)),document.addEventListener("keydown",wi(this,Fa)))}disconnectedCallback(){this.removeEventListener("click",wi(this,Wa)),document.removeEventListener("keydown",wi(this,Fa))}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e==="open"&&(this.open?(this.addEventListener("click",wi(this,Wa)),document.addEventListener("keydown",wi(this,Fa))):(this.removeEventListener("click",wi(this,Wa)),document.removeEventListener("keydown",wi(this,Fa))))}}Wa=new WeakMap;Fa=new WeakMap;Kv.getSlotTemplateHTML=fy;g.customElements.get("media-keyboard-shortcuts-dialog")||g.customElements.define("media-keyboard-shortcuts-dialog",Kv);var Vv=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},_y=(t,e,i)=>(Vv(t,e,"read from private field"),e.get(t)),by=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},gy=(t,e,i,a)=>(Vv(t,e,"write to private field"),e.set(t,i),i),zs;const yy=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M16 3v2.5h3.5V9H22V3h-6ZM4 9h2.5V5.5H10V3H4v6Zm15.5 9.5H16V21h6v-6h-2.5v3.5ZM6.5 15H4v6h6v-2.5H6.5V15Z"/>
</svg>`,Ty=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M18.5 6.5V3H16v6h6V6.5h-3.5ZM16 21h2.5v-3.5H22V15h-6v6ZM4 17.5h3.5V21H10v-6H4v2.5Zm3.5-11H4V9h6V3H7.5v3.5Z"/>
</svg>`;function Ay(t){return`
    <style>
      :host([${h.MEDIA_IS_FULLSCREEN}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      
      :host(:not([${h.MEDIA_IS_FULLSCREEN}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${h.MEDIA_IS_FULLSCREEN}]) slot[name=tooltip-enter],
      :host(:not([${h.MEDIA_IS_FULLSCREEN}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${yy}</slot>
      <slot name="exit">${Ty}</slot>
    </slot>
  `}function ky(){return`
    <slot name="tooltip-enter">${C("Enter fullscreen mode")}</slot>
    <slot name="tooltip-exit">${C("Exit fullscreen mode")}</slot>
  `}const nm=t=>{const e=t.mediaIsFullscreen?C("exit fullscreen mode"):C("enter fullscreen mode");t.setAttribute("aria-label",e)};class uc extends Ne{constructor(){super(...arguments),by(this,zs,null)}static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_IS_FULLSCREEN,h.MEDIA_FULLSCREEN_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),nm(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===h.MEDIA_IS_FULLSCREEN&&nm(this)}get mediaFullscreenUnavailable(){return ce(this,h.MEDIA_FULLSCREEN_UNAVAILABLE)}set mediaFullscreenUnavailable(e){oe(this,h.MEDIA_FULLSCREEN_UNAVAILABLE,e)}get mediaIsFullscreen(){return Y(this,h.MEDIA_IS_FULLSCREEN)}set mediaIsFullscreen(e){G(this,h.MEDIA_IS_FULLSCREEN,e)}handleClick(e){gy(this,zs,e);const i=_y(this,zs)instanceof PointerEvent,a=this.mediaIsFullscreen?new g.CustomEvent(D.MEDIA_EXIT_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0}):new g.CustomEvent(D.MEDIA_ENTER_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0,detail:i});this.dispatchEvent(a)}}zs=new WeakMap;uc.getSlotTemplateHTML=Ay;uc.getTooltipContentHTML=ky;g.customElements.get("media-fullscreen-button")||g.customElements.define("media-fullscreen-button",uc);const{MEDIA_TIME_IS_LIVE:Qs,MEDIA_PAUSED:kn}=h,{MEDIA_SEEK_TO_LIVE_REQUEST:wy,MEDIA_PLAY_REQUEST:Sy}=D,Iy='<svg viewBox="0 0 6 12" aria-hidden="true"><circle cx="3" cy="6" r="2"></circle></svg>';function Ry(t){return`
    <style>
      :host { --media-tooltip-display: none; }
      
      slot[name=indicator] > *,
      :host ::slotted([slot=indicator]) {
        
        min-width: auto;
        fill: var(--media-live-button-icon-color, rgb(140, 140, 140));
        color: var(--media-live-button-icon-color, rgb(140, 140, 140));
      }

      :host([${Qs}]:not([${kn}])) slot[name=indicator] > *,
      :host([${Qs}]:not([${kn}])) ::slotted([slot=indicator]) {
        fill: var(--media-live-button-indicator-color, rgb(255, 0, 0));
        color: var(--media-live-button-indicator-color, rgb(255, 0, 0));
      }

      :host([${Qs}]:not([${kn}])) {
        cursor: var(--media-cursor, not-allowed);
      }

      slot[name=text]{
        text-transform: uppercase;
      }

    </style>

    <slot name="indicator">${Iy}</slot>
    
    <slot name="spacer">&nbsp;</slot><slot name="text">${C("live")}</slot>
  `}const sm=t=>{var e;const i=t.mediaPaused||!t.mediaTimeIsLive,a=C(i?"seek to live":"playing live");t.setAttribute("aria-label",a);const r=(e=t.shadowRoot)==null?void 0:e.querySelector('slot[name="text"]');r&&(r.textContent=C("live")),i?t.removeAttribute("aria-disabled"):t.setAttribute("aria-disabled","true")};class qv extends Ne{static get observedAttributes(){return[...super.observedAttributes,Qs,kn]}connectedCallback(){super.connectedCallback(),sm(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),sm(this)}get mediaPaused(){return Y(this,h.MEDIA_PAUSED)}set mediaPaused(e){G(this,h.MEDIA_PAUSED,e)}get mediaTimeIsLive(){return Y(this,h.MEDIA_TIME_IS_LIVE)}set mediaTimeIsLive(e){G(this,h.MEDIA_TIME_IS_LIVE,e)}handleClick(){!this.mediaPaused&&this.mediaTimeIsLive||(this.dispatchEvent(new g.CustomEvent(wy,{composed:!0,bubbles:!0})),this.hasAttribute(kn)&&this.dispatchEvent(new g.CustomEvent(Sy,{composed:!0,bubbles:!0})))}}qv.getSlotTemplateHTML=Ry;g.customElements.get("media-live-button")||g.customElements.define("media-live-button",qv);var Yv=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Hr=(t,e,i)=>(Yv(t,e,"read from private field"),i?i.call(t):e.get(t)),om=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Br=(t,e,i,a)=>(Yv(t,e,"write to private field"),e.set(t,i),i),Gt,js;const cs={LOADING_DELAY:"loadingdelay",NO_AUTOHIDE:"noautohide"},Gv=500,Ly=`
<svg aria-hidden="true" viewBox="0 0 100 100">
  <path d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50">
    <animateTransform
       attributeName="transform"
       attributeType="XML"
       type="rotate"
       dur="1s"
       from="0 50 50"
       to="360 50 50"
       repeatCount="indefinite" />
  </path>
</svg>
`;function Cy(t){return`
    <style>
      :host {
        display: var(--media-control-display, var(--media-loading-indicator-display, inline-block));
        vertical-align: middle;
        box-sizing: border-box;
        --_loading-indicator-delay: var(--media-loading-indicator-transition-delay, ${Gv}ms);
      }

      #status {
        color: rgba(0,0,0,0);
        width: 0px;
        height: 0px;
      }

      :host slot[name=icon] > *,
      :host ::slotted([slot=icon]) {
        opacity: var(--media-loading-indicator-opacity, 0);
        transition: opacity 0.15s;
      }

      :host([${h.MEDIA_LOADING}]:not([${h.MEDIA_PAUSED}])) slot[name=icon] > *,
      :host([${h.MEDIA_LOADING}]:not([${h.MEDIA_PAUSED}])) ::slotted([slot=icon]) {
        opacity: var(--media-loading-indicator-opacity, 1);
        transition: opacity 0.15s var(--_loading-indicator-delay);
      }

      :host #status {
        visibility: var(--media-loading-indicator-opacity, hidden);
        transition: visibility 0.15s;
      }

      :host([${h.MEDIA_LOADING}]:not([${h.MEDIA_PAUSED}])) #status {
        visibility: var(--media-loading-indicator-opacity, visible);
        transition: visibility 0.15s var(--_loading-indicator-delay);
      }

      svg, img, ::slotted(svg), ::slotted(img) {
        width: var(--media-loading-indicator-icon-width);
        height: var(--media-loading-indicator-icon-height, 100px);
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        vertical-align: middle;
      }
    </style>

    <slot name="icon">${Ly}</slot>
    <div id="status" role="status" aria-live="polite">${C("media loading")}</div>
  `}class cc extends g.HTMLElement{constructor(){if(super(),om(this,Gt,void 0),om(this,js,Gv),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=lt(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[X.MEDIA_CONTROLLER,h.MEDIA_PAUSED,h.MEDIA_LOADING,cs.LOADING_DELAY]}attributeChangedCallback(e,i,a){var r,n,s,o,l;e===cs.LOADING_DELAY&&i!==a?this.loadingDelay=Number(a):e===X.MEDIA_CONTROLLER&&(i&&((n=(r=Hr(this,Gt))==null?void 0:r.unassociateElement)==null||n.call(r,this),Br(this,Gt,null)),a&&this.isConnected&&(Br(this,Gt,(s=this.getRootNode())==null?void 0:s.getElementById(a)),(l=(o=Hr(this,Gt))==null?void 0:o.associateElement)==null||l.call(o,this)))}connectedCallback(){var e,i,a;const r=this.getAttribute(X.MEDIA_CONTROLLER);r&&(Br(this,Gt,(e=this.getRootNode())==null?void 0:e.getElementById(r)),(a=(i=Hr(this,Gt))==null?void 0:i.associateElement)==null||a.call(i,this))}disconnectedCallback(){var e,i;(i=(e=Hr(this,Gt))==null?void 0:e.unassociateElement)==null||i.call(e,this),Br(this,Gt,null)}get loadingDelay(){return Hr(this,js)}set loadingDelay(e){Br(this,js,e);const{style:i}=Re(this.shadowRoot,":host");i.setProperty("--_loading-indicator-delay",`var(--media-loading-indicator-transition-delay, ${e}ms)`)}get mediaPaused(){return Y(this,h.MEDIA_PAUSED)}set mediaPaused(e){G(this,h.MEDIA_PAUSED,e)}get mediaLoading(){return Y(this,h.MEDIA_LOADING)}set mediaLoading(e){G(this,h.MEDIA_LOADING,e)}get mediaController(){return ce(this,X.MEDIA_CONTROLLER)}set mediaController(e){oe(this,X.MEDIA_CONTROLLER,e)}get noAutohide(){return Y(this,cs.NO_AUTOHIDE)}set noAutohide(e){G(this,cs.NO_AUTOHIDE,e)}}Gt=new WeakMap;js=new WeakMap;cc.shadowRootOptions={mode:"open"};cc.getTemplateHTML=Cy;g.customElements.get("media-loading-indicator")||g.customElements.define("media-loading-indicator",cc);const Dy=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M16.5 12A4.5 4.5 0 0 0 14 8v2.18l2.45 2.45a4.22 4.22 0 0 0 .05-.63Zm2.5 0a6.84 6.84 0 0 1-.54 2.64L20 16.15A8.8 8.8 0 0 0 21 12a9 9 0 0 0-7-8.77v2.06A7 7 0 0 1 19 12ZM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25A6.92 6.92 0 0 1 14 18.7v2.06A9 9 0 0 0 17.69 19l2 2.05L21 19.73l-9-9L4.27 3ZM12 4 9.91 6.09 12 8.18V4Z"/>
</svg>`,lm=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4Z"/>
</svg>`,My=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M3 9v6h4l5 5V4L7 9H3Zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4ZM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54Z"/>
</svg>`;function xy(t){return`
    <style>
      :host(:not([${h.MEDIA_VOLUME_LEVEL}])) slot[name=icon] slot:not([name=high]),
      :host([${h.MEDIA_VOLUME_LEVEL}=high]) slot[name=icon] slot:not([name=high]) {
        display: none !important;
      }

      :host([${h.MEDIA_VOLUME_LEVEL}=off]) slot[name=icon] slot:not([name=off]) {
        display: none !important;
      }

      :host([${h.MEDIA_VOLUME_LEVEL}=low]) slot[name=icon] slot:not([name=low]) {
        display: none !important;
      }

      :host([${h.MEDIA_VOLUME_LEVEL}=medium]) slot[name=icon] slot:not([name=medium]) {
        display: none !important;
      }

      :host(:not([${h.MEDIA_VOLUME_LEVEL}=off])) slot[name=tooltip-unmute],
      :host([${h.MEDIA_VOLUME_LEVEL}=off]) slot[name=tooltip-mute] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="off">${Dy}</slot>
      <slot name="low">${lm}</slot>
      <slot name="medium">${lm}</slot>
      <slot name="high">${My}</slot>
    </slot>
  `}function Oy(){return`
    <slot name="tooltip-mute">${C("Mute")}</slot>
    <slot name="tooltip-unmute">${C("Unmute")}</slot>
  `}const dm=t=>{const e=t.mediaVolumeLevel==="off",i=C(e?"unmute":"mute");t.setAttribute("aria-label",i)};class hc extends Ne{static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_VOLUME_LEVEL]}connectedCallback(){super.connectedCallback(),dm(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===h.MEDIA_VOLUME_LEVEL&&dm(this)}get mediaVolumeLevel(){return ce(this,h.MEDIA_VOLUME_LEVEL)}set mediaVolumeLevel(e){oe(this,h.MEDIA_VOLUME_LEVEL,e)}handleClick(){const e=this.mediaVolumeLevel==="off"?D.MEDIA_UNMUTE_REQUEST:D.MEDIA_MUTE_REQUEST;this.dispatchEvent(new g.CustomEvent(e,{composed:!0,bubbles:!0}))}}hc.getSlotTemplateHTML=xy;hc.getTooltipContentHTML=Oy;g.customElements.get("media-mute-button")||g.customElements.define("media-mute-button",hc);const um=`<svg aria-hidden="true" viewBox="0 0 28 24">
  <path d="M24 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Zm-1 16H5V5h18v14Zm-3-8h-7v5h7v-5Z"/>
</svg>`;function Ny(t){return`
    <style>
      :host([${h.MEDIA_IS_PIP}]) slot[name=icon] slot:not([name=exit]) {
        display: none !important;
      }

      :host(:not([${h.MEDIA_IS_PIP}])) slot[name=icon] slot:not([name=enter]) {
        display: none !important;
      }

      :host([${h.MEDIA_IS_PIP}]) slot[name=tooltip-enter],
      :host(:not([${h.MEDIA_IS_PIP}])) slot[name=tooltip-exit] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="enter">${um}</slot>
      <slot name="exit">${um}</slot>
    </slot>
  `}function Py(){return`
    <slot name="tooltip-enter">${C("Enter picture in picture mode")}</slot>
    <slot name="tooltip-exit">${C("Exit picture in picture mode")}</slot>
  `}const cm=t=>{const e=t.mediaIsPip?C("exit picture in picture mode"):C("enter picture in picture mode");t.setAttribute("aria-label",e)};class mc extends Ne{static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_IS_PIP,h.MEDIA_PIP_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),cm(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===h.MEDIA_IS_PIP&&cm(this)}get mediaPipUnavailable(){return ce(this,h.MEDIA_PIP_UNAVAILABLE)}set mediaPipUnavailable(e){oe(this,h.MEDIA_PIP_UNAVAILABLE,e)}get mediaIsPip(){return Y(this,h.MEDIA_IS_PIP)}set mediaIsPip(e){G(this,h.MEDIA_IS_PIP,e)}handleClick(){const e=this.mediaIsPip?D.MEDIA_EXIT_PIP_REQUEST:D.MEDIA_ENTER_PIP_REQUEST;this.dispatchEvent(new g.CustomEvent(e,{composed:!0,bubbles:!0}))}}mc.getSlotTemplateHTML=Ny;mc.getTooltipContentHTML=Py;g.customElements.get("media-pip-button")||g.customElements.define("media-pip-button",mc);var $y=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Ca=(t,e,i)=>($y(t,e,"read from private field"),i?i.call(t):e.get(t)),Uy=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Ci;const Gl={RATES:"rates"},zv=[1,1.2,1.5,1.7,2],or=1;function Hy(t){return`
    <style>
      :host {
        min-width: 5ch;
        padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
      }
    </style>
    <slot name="icon">${t.mediaplaybackrate||or}x</slot>
  `}function By(){return C("Playback rate")}class pc extends Ne{constructor(){var e;super(),Uy(this,Ci,new Qu(this,Gl.RATES,{defaultValue:zv})),this.container=this.shadowRoot.querySelector('slot[name="icon"]'),this.container.innerHTML=`${(e=this.mediaPlaybackRate)!=null?e:or}x`}static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_PLAYBACK_RATE,Gl.RATES]}attributeChangedCallback(e,i,a){if(super.attributeChangedCallback(e,i,a),e===Gl.RATES&&(Ca(this,Ci).value=a),e===h.MEDIA_PLAYBACK_RATE){const r=a?+a:Number.NaN,n=Number.isNaN(r)?or:r;this.container.innerHTML=`${n}x`,this.setAttribute("aria-label",C("Playback rate {playbackRate}",{playbackRate:n}))}}get rates(){return Ca(this,Ci)}set rates(e){e?Array.isArray(e)?Ca(this,Ci).value=e.join(" "):typeof e=="string"&&(Ca(this,Ci).value=e):Ca(this,Ci).value=""}get mediaPlaybackRate(){return se(this,h.MEDIA_PLAYBACK_RATE,or)}set mediaPlaybackRate(e){ve(this,h.MEDIA_PLAYBACK_RATE,e)}handleClick(){var e,i;const a=Array.from(Ca(this,Ci).values(),s=>+s).sort((s,o)=>s-o),r=(i=(e=a.find(s=>s>this.mediaPlaybackRate))!=null?e:a[0])!=null?i:or,n=new g.CustomEvent(D.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:r});this.dispatchEvent(n)}}Ci=new WeakMap;pc.getSlotTemplateHTML=Hy;pc.getTooltipContentHTML=By;g.customElements.get("media-playback-rate-button")||g.customElements.define("media-playback-rate-button",pc);const Wy=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="m6 21 15-9L6 3v18Z"/>
</svg>`,Fy=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M6 20h4V4H6v16Zm8-16v16h4V4h-4Z"/>
</svg>`;function Ky(t){return`
    <style>
      :host([${h.MEDIA_PAUSED}]) slot[name=pause],
      :host(:not([${h.MEDIA_PAUSED}])) slot[name=play] {
        display: none !important;
      }

      :host([${h.MEDIA_PAUSED}]) slot[name=tooltip-pause],
      :host(:not([${h.MEDIA_PAUSED}])) slot[name=tooltip-play] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="play">${Wy}</slot>
      <slot name="pause">${Fy}</slot>
    </slot>
  `}function Vy(){return`
    <slot name="tooltip-play">${C("Play")}</slot>
    <slot name="tooltip-pause">${C("Pause")}</slot>
  `}const hm=t=>{const e=t.mediaPaused?C("play"):C("pause");t.setAttribute("aria-label",e)};class vc extends Ne{static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_PAUSED,h.MEDIA_ENDED]}connectedCallback(){super.connectedCallback(),hm(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),(e===h.MEDIA_PAUSED||e===h.MEDIA_LANG)&&hm(this)}get mediaPaused(){return Y(this,h.MEDIA_PAUSED)}set mediaPaused(e){G(this,h.MEDIA_PAUSED,e)}handleClick(){const e=this.mediaPaused?D.MEDIA_PLAY_REQUEST:D.MEDIA_PAUSE_REQUEST;this.dispatchEvent(new g.CustomEvent(e,{composed:!0,bubbles:!0}))}}vc.getSlotTemplateHTML=Ky;vc.getTooltipContentHTML=Vy;g.customElements.get("media-play-button")||g.customElements.define("media-play-button",vc);const Ut={PLACEHOLDER_SRC:"placeholdersrc",SRC:"src"};function qy(t){return`
    <style>
      :host {
        pointer-events: none;
        display: var(--media-poster-image-display, inline-block);
        box-sizing: border-box;
      }

      img {
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
        min-height: 100%;
        background-repeat: no-repeat;
        background-position: var(--media-poster-image-background-position, var(--media-object-position, center));
        background-size: var(--media-poster-image-background-size, var(--media-object-fit, contain));
        object-fit: var(--media-object-fit, contain);
        object-position: var(--media-object-position, center);
      }
    </style>

    <img part="poster img" aria-hidden="true" id="image"/>
  `}const Yy=t=>{t.style.removeProperty("background-image")},Gy=(t,e)=>{t.style["background-image"]=`url('${e}')`};class fc extends g.HTMLElement{static get observedAttributes(){return[Ut.PLACEHOLDER_SRC,Ut.SRC]}constructor(){if(super(),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=lt(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}this.image=this.shadowRoot.querySelector("#image")}attributeChangedCallback(e,i,a){e===Ut.SRC&&(a==null?this.image.removeAttribute(Ut.SRC):this.image.setAttribute(Ut.SRC,a)),e===Ut.PLACEHOLDER_SRC&&(a==null?Yy(this.image):Gy(this.image,a))}get placeholderSrc(){return ce(this,Ut.PLACEHOLDER_SRC)}set placeholderSrc(e){oe(this,Ut.SRC,e)}get src(){return ce(this,Ut.SRC)}set src(e){oe(this,Ut.SRC,e)}}fc.shadowRootOptions={mode:"open"};fc.getTemplateHTML=qy;g.customElements.get("media-poster-image")||g.customElements.define("media-poster-image",fc);var Qv=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},zy=(t,e,i)=>(Qv(t,e,"read from private field"),i?i.call(t):e.get(t)),Qy=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},jy=(t,e,i,a)=>(Qv(t,e,"write to private field"),e.set(t,i),i),Zs;class Zy extends Gi{constructor(){super(),Qy(this,Zs,void 0),jy(this,Zs,this.shadowRoot.querySelector("slot"))}static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_PREVIEW_CHAPTER,h.MEDIA_LANG]}attributeChangedCallback(e,i,a){if(super.attributeChangedCallback(e,i,a),(e===h.MEDIA_PREVIEW_CHAPTER||e===h.MEDIA_LANG)&&a!==i&&a!=null)if(zy(this,Zs).textContent=a,a!==""){const r=C("chapter: {chapterName}",{chapterName:a});this.setAttribute("aria-valuetext",r)}else this.removeAttribute("aria-valuetext")}get mediaPreviewChapter(){return ce(this,h.MEDIA_PREVIEW_CHAPTER)}set mediaPreviewChapter(e){oe(this,h.MEDIA_PREVIEW_CHAPTER,e)}}Zs=new WeakMap;g.customElements.get("media-preview-chapter-display")||g.customElements.define("media-preview-chapter-display",Zy);var jv=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},hs=(t,e,i)=>(jv(t,e,"read from private field"),i?i.call(t):e.get(t)),Xy=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},ms=(t,e,i,a)=>(jv(t,e,"write to private field"),e.set(t,i),i),zt;function Jy(t){return`
    <style>
      :host {
        box-sizing: border-box;
        display: var(--media-control-display, var(--media-preview-thumbnail-display, inline-block));
        overflow: hidden;
      }

      img {
        display: none;
        position: relative;
      }
    </style>
    <img crossorigin loading="eager" decoding="async">
  `}class Sl extends g.HTMLElement{constructor(){if(super(),Xy(this,zt,void 0),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=lt(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[X.MEDIA_CONTROLLER,h.MEDIA_PREVIEW_IMAGE,h.MEDIA_PREVIEW_COORDS]}connectedCallback(){var e,i,a;const r=this.getAttribute(X.MEDIA_CONTROLLER);r&&(ms(this,zt,(e=this.getRootNode())==null?void 0:e.getElementById(r)),(a=(i=hs(this,zt))==null?void 0:i.associateElement)==null||a.call(i,this))}disconnectedCallback(){var e,i;(i=(e=hs(this,zt))==null?void 0:e.unassociateElement)==null||i.call(e,this),ms(this,zt,null)}attributeChangedCallback(e,i,a){var r,n,s,o,l;[h.MEDIA_PREVIEW_IMAGE,h.MEDIA_PREVIEW_COORDS].includes(e)&&this.update(),e===X.MEDIA_CONTROLLER&&(i&&((n=(r=hs(this,zt))==null?void 0:r.unassociateElement)==null||n.call(r,this),ms(this,zt,null)),a&&this.isConnected&&(ms(this,zt,(s=this.getRootNode())==null?void 0:s.getElementById(a)),(l=(o=hs(this,zt))==null?void 0:o.associateElement)==null||l.call(o,this)))}get mediaPreviewImage(){return ce(this,h.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){oe(this,h.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewCoords(){const e=this.getAttribute(h.MEDIA_PREVIEW_COORDS);if(e)return e.split(/\s+/).map(i=>+i)}set mediaPreviewCoords(e){if(!e){this.removeAttribute(h.MEDIA_PREVIEW_COORDS);return}this.setAttribute(h.MEDIA_PREVIEW_COORDS,e.join(" "))}update(){const e=this.mediaPreviewCoords,i=this.mediaPreviewImage;if(!(e&&i))return;const[a,r,n,s]=e,o=i.split("#")[0],l=getComputedStyle(this),{maxWidth:c,maxHeight:p,minWidth:m,minHeight:u}=l,d=l.getPropertyValue("--media-preview-thumbnail-object-fit").trim()||"contain";let v,f;if(d==="fill"){const x=parseInt(c)/n,U=parseInt(p)/s,K=parseInt(m)/n,Q=parseInt(u)/s;v=x<1?x:Math.max(x,K),f=U<1?U:Math.max(U,Q)}else{const x=Math.min(parseInt(c)/n,parseInt(p)/s),U=Math.max(parseInt(m)/n,parseInt(u)/s),Q=x<1?x:U>1?U:1;v=Q,f=Q}const{style:b}=Re(this.shadowRoot,":host"),E=Re(this.shadowRoot,"img").style,T=this.shadowRoot.querySelector("img"),w=Math.min(v,f)<1?"min":"max";b.setProperty(`${w}-width`,"initial","important"),b.setProperty(`${w}-height`,"initial","important"),b.width=`${n*v}px`,b.height=`${s*f}px`;const R=()=>{E.width=`${this.imgWidth*v}px`,E.height=`${this.imgHeight*f}px`,E.display="block"};T.src!==o&&(T.onload=()=>{this.imgWidth=T.naturalWidth,this.imgHeight=T.naturalHeight,R(),T.onload=null},T.src=o,R()),R(),E.transform=`translate(-${a*v}px, -${r*f}px)`}}zt=new WeakMap;Sl.shadowRootOptions={mode:"open"};Sl.getTemplateHTML=Jy;g.customElements.get("media-preview-thumbnail")||g.customElements.define("media-preview-thumbnail",Sl);var mm=Sl,Zv=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},pm=(t,e,i)=>(Zv(t,e,"read from private field"),i?i.call(t):e.get(t)),eT=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},tT=(t,e,i,a)=>(Zv(t,e,"write to private field"),e.set(t,i),i),on;class iT extends Gi{constructor(){super(),eT(this,on,void 0),tT(this,on,this.shadowRoot.querySelector("slot")),pm(this,on).textContent=Yi(0)}static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_PREVIEW_TIME]}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===h.MEDIA_PREVIEW_TIME&&a!=null&&(pm(this,on).textContent=Yi(parseFloat(a)))}get mediaPreviewTime(){return se(this,h.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){ve(this,h.MEDIA_PREVIEW_TIME,e)}}on=new WeakMap;g.customElements.get("media-preview-time-display")||g.customElements.define("media-preview-time-display",iT);const Da={SEEK_OFFSET:"seekoffset"},zl=30,aT=t=>`
  <svg aria-hidden="true" viewBox="0 0 20 24">
    <defs>
      <style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style>
    </defs>
    <text class="text value" transform="translate(2.18 19.87)">${t}</text>
    <path d="M10 6V3L4.37 7 10 10.94V8a5.54 5.54 0 0 1 1.9 10.48v2.12A7.5 7.5 0 0 0 10 6Z"/>
  </svg>`;function rT(t,e){return`
    <slot name="icon">${aT(e.seekOffset)}</slot>
  `}const nT=(t,e)=>{t.setAttribute("aria-label",C("seek back {seekOffset} seconds",{seekOffset:e}))};function sT(){return C("Seek backward")}const oT=0;class Ec extends Ne{static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_CURRENT_TIME,Da.SEEK_OFFSET]}connectedCallback(){super.connectedCallback(),this.seekOffset=se(this,Da.SEEK_OFFSET,zl)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),nT(this,this.seekOffset),e===Da.SEEK_OFFSET&&(this.seekOffset=se(this,Da.SEEK_OFFSET,zl))}get seekOffset(){return se(this,Da.SEEK_OFFSET,zl)}set seekOffset(e){ve(this,Da.SEEK_OFFSET,e),this.setAttribute("aria-label",C("seek back {seekOffset} seconds",{seekOffset:this.seekOffset})),nv(sv(this,"icon"),this.seekOffset)}get mediaCurrentTime(){return se(this,h.MEDIA_CURRENT_TIME,oT)}set mediaCurrentTime(e){ve(this,h.MEDIA_CURRENT_TIME,e)}handleClick(){const e=Math.max(this.mediaCurrentTime-this.seekOffset,0),i=new g.CustomEvent(D.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(i)}}Ec.getSlotTemplateHTML=rT;Ec.getTooltipContentHTML=sT;g.customElements.get("media-seek-backward-button")||g.customElements.define("media-seek-backward-button",Ec);const Ma={SEEK_OFFSET:"seekoffset"},Ql=30,lT=t=>`
  <svg aria-hidden="true" viewBox="0 0 20 24">
    <defs>
      <style>.text{font-size:8px;font-family:Arial-BoldMT, Arial;font-weight:700;}</style>
    </defs>
    <text class="text value" transform="translate(8.9 19.87)">${t}</text>
    <path d="M10 6V3l5.61 4L10 10.94V8a5.54 5.54 0 0 0-1.9 10.48v2.12A7.5 7.5 0 0 1 10 6Z"/>
  </svg>`;function dT(t,e){return`
    <slot name="icon">${lT(e.seekOffset)}</slot>
  `}const uT=(t,e)=>{t.setAttribute("aria-label",C("seek forward {seekOffset} seconds",{seekOffset:e}))};function cT(){return C("Seek forward")}const hT=0;class _c extends Ne{static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_CURRENT_TIME,Ma.SEEK_OFFSET]}connectedCallback(){super.connectedCallback(),this.seekOffset=se(this,Ma.SEEK_OFFSET,Ql)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),uT(this,this.seekOffset),e===Ma.SEEK_OFFSET&&(this.seekOffset=se(this,Ma.SEEK_OFFSET,Ql))}get seekOffset(){return se(this,Ma.SEEK_OFFSET,Ql)}set seekOffset(e){ve(this,Ma.SEEK_OFFSET,e),this.setAttribute("aria-label",C("seek forward {seekOffset} seconds",{seekOffset:this.seekOffset})),nv(sv(this,"icon"),this.seekOffset)}get mediaCurrentTime(){return se(this,h.MEDIA_CURRENT_TIME,hT)}set mediaCurrentTime(e){ve(this,h.MEDIA_CURRENT_TIME,e)}handleClick(){const e=this.mediaCurrentTime+this.seekOffset,i=new g.CustomEvent(D.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(i)}}_c.getSlotTemplateHTML=dT;_c.getTooltipContentHTML=cT;g.customElements.get("media-seek-forward-button")||g.customElements.define("media-seek-forward-button",_c);var bc=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Ot=(t,e,i)=>(bc(t,e,"read from private field"),i?i.call(t):e.get(t)),Xi=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},gc=(t,e,i,a)=>(bc(t,e,"write to private field"),e.set(t,i),i),Pi=(t,e,i)=>(bc(t,e,"access private method"),i),Ka,ri,Il,yc,Xv,Vo,Tc,ln,Xs,Js,Kd;const Di={REMAINING:"remaining",SHOW_DURATION:"showduration",NO_TOGGLE:"notoggle"},vm=[...Object.values(Di),h.MEDIA_CURRENT_TIME,h.MEDIA_DURATION,h.MEDIA_SEEKABLE],Jv=["Enter"," "],mT="&nbsp;/&nbsp;",Vd=(t,{timesSep:e=mT}={})=>{var i,a;const r=(i=t.mediaCurrentTime)!=null?i:0,[,n]=(a=t.mediaSeekable)!=null?a:[];let s=0;Number.isFinite(t.mediaDuration)?s=t.mediaDuration:Number.isFinite(n)&&(s=n);const o=t.remaining?Yi(0-(s-r)):Yi(r);return t.showDuration?`${o}${e}${Yi(s)}`:o},pT=t=>{var e;const i=t.mediaCurrentTime,[,a]=(e=t.mediaSeekable)!=null?e:[];let r=null;if(Number.isFinite(t.mediaDuration)?r=t.mediaDuration:Number.isFinite(a)&&(r=a),i==null||r===null){t.setAttribute("aria-valuetext",C("video not loaded, unknown time."));return}const n=t.remaining?Tn(0-(r-i)):Tn(i);if(!t.showDuration){t.setAttribute("aria-valuetext",n);return}const s=Tn(r),o=C("{currentTime} of {totalTime}",{currentTime:n,totalTime:s});t.setAttribute("aria-valuetext",o)};function vT(t,e){return`
    <slot>${Vd(e)}</slot>
  `}const fT=t=>{t.setAttribute("aria-label",C("playback time"))};class ef extends Gi{constructor(){super(),Xi(this,yc),Xi(this,Vo),Xi(this,ln),Xi(this,Js),Xi(this,Ka,void 0),Xi(this,ri,null),Xi(this,Il,e=>{const{metaKey:i,altKey:a,key:r}=e;if(i||a||!Jv.includes(r)){this.removeEventListener("keyup",Ot(this,ri));return}this.addEventListener("keyup",Ot(this,ri))}),gc(this,Ka,this.shadowRoot.querySelector("slot")),Ot(this,Ka).innerHTML=`${Vd(this)}`}static get observedAttributes(){return[...super.observedAttributes,...vm,"disabled"]}connectedCallback(){const{style:e}=Re(this.shadowRoot,":host(:hover:not([notoggle]))");e.setProperty("cursor","var(--media-cursor, pointer)"),e.setProperty("background","var(--media-control-hover-background, rgba(50 50 70 / .7))"),this.setAttribute("aria-label",C("playback time")),Pi(this,ln,Xs).call(this),super.connectedCallback()}toggleTimeDisplay(){this.noToggle||(this.hasAttribute("remaining")?this.removeAttribute("remaining"):this.setAttribute("remaining",""))}disconnectedCallback(){this.disable(),Pi(this,Vo,Tc).call(this),super.disconnectedCallback()}attributeChangedCallback(e,i,a){fT(this),vm.includes(e)?this.update():e==="disabled"&&a!==i?a==null?Pi(this,ln,Xs).call(this):Pi(this,Js,Kd).call(this):e===Di.NO_TOGGLE&&a!==i&&(this.noToggle?Pi(this,Js,Kd).call(this):Pi(this,ln,Xs).call(this)),super.attributeChangedCallback(e,i,a)}enable(){this.noToggle||(this.tabIndex=0)}disable(){this.tabIndex=-1}get remaining(){return Y(this,Di.REMAINING)}set remaining(e){G(this,Di.REMAINING,e)}get showDuration(){return Y(this,Di.SHOW_DURATION)}set showDuration(e){G(this,Di.SHOW_DURATION,e)}get noToggle(){return Y(this,Di.NO_TOGGLE)}set noToggle(e){G(this,Di.NO_TOGGLE,e)}get mediaDuration(){return se(this,h.MEDIA_DURATION)}set mediaDuration(e){ve(this,h.MEDIA_DURATION,e)}get mediaCurrentTime(){return se(this,h.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){ve(this,h.MEDIA_CURRENT_TIME,e)}get mediaSeekable(){const e=this.getAttribute(h.MEDIA_SEEKABLE);if(e)return e.split(":").map(i=>+i)}set mediaSeekable(e){if(e==null){this.removeAttribute(h.MEDIA_SEEKABLE);return}this.setAttribute(h.MEDIA_SEEKABLE,e.join(":"))}update(){const e=Vd(this);pT(this),e!==Ot(this,Ka).innerHTML&&(Ot(this,Ka).innerHTML=e)}}Ka=new WeakMap;ri=new WeakMap;Il=new WeakMap;yc=new WeakSet;Xv=function(){Ot(this,ri)||(gc(this,ri,t=>{const{key:e}=t;if(!Jv.includes(e)){this.removeEventListener("keyup",Ot(this,ri));return}this.toggleTimeDisplay()}),this.addEventListener("keydown",Ot(this,Il)),this.addEventListener("click",this.toggleTimeDisplay))};Vo=new WeakSet;Tc=function(){Ot(this,ri)&&(this.removeEventListener("keyup",Ot(this,ri)),this.removeEventListener("keydown",Ot(this,Il)),this.removeEventListener("click",this.toggleTimeDisplay),gc(this,ri,null))};ln=new WeakSet;Xs=function(){!this.noToggle&&!this.hasAttribute("disabled")&&(this.setAttribute("role","button"),this.enable(),Pi(this,yc,Xv).call(this))};Js=new WeakSet;Kd=function(){this.removeAttribute("role"),this.disable(),Pi(this,Vo,Tc).call(this)};ef.getSlotTemplateHTML=vT;g.customElements.get("media-time-display")||g.customElements.define("media-time-display",ef);var tf=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Me=(t,e,i)=>(tf(t,e,"read from private field"),e.get(t)),Ht=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},nt=(t,e,i,a)=>(tf(t,e,"write to private field"),e.set(t,i),i),ET=(t,e,i,a)=>({set _(r){nt(t,e,r)},get _(){return Me(t,e)}}),Va,eo,qa,dn,to,io,ao,Ya,na,ro;class _T{constructor(e,i,a){Ht(this,Va,void 0),Ht(this,eo,void 0),Ht(this,qa,void 0),Ht(this,dn,void 0),Ht(this,to,void 0),Ht(this,io,void 0),Ht(this,ao,void 0),Ht(this,Ya,void 0),Ht(this,na,0),Ht(this,ro,(r=performance.now())=>{nt(this,na,requestAnimationFrame(Me(this,ro))),nt(this,dn,performance.now()-Me(this,qa));const n=1e3/this.fps;if(Me(this,dn)>n){nt(this,qa,r-Me(this,dn)%n);const s=1e3/((r-Me(this,eo))/++ET(this,to)._),o=(r-Me(this,io))/1e3/this.duration;let l=Me(this,ao)+o*this.playbackRate;l-Me(this,Va).valueAsNumber>0?nt(this,Ya,this.playbackRate/this.duration/s):(nt(this,Ya,.995*Me(this,Ya)),l=Me(this,Va).valueAsNumber+Me(this,Ya)),this.callback(l)}}),nt(this,Va,e),this.callback=i,this.fps=a}start(){Me(this,na)===0&&(nt(this,qa,performance.now()),nt(this,eo,Me(this,qa)),nt(this,to,0),Me(this,ro).call(this))}stop(){Me(this,na)!==0&&(cancelAnimationFrame(Me(this,na)),nt(this,na,0))}update({start:e,duration:i,playbackRate:a}){const r=e-Me(this,Va).valueAsNumber,n=Math.abs(i-this.duration);(r>0||r<-.03||n>=.5)&&this.callback(e),nt(this,ao,e),nt(this,io,performance.now()),this.duration=i,this.playbackRate=a}}Va=new WeakMap;eo=new WeakMap;qa=new WeakMap;dn=new WeakMap;to=new WeakMap;io=new WeakMap;ao=new WeakMap;Ya=new WeakMap;na=new WeakMap;ro=new WeakMap;var Ac=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},de=(t,e,i)=>(Ac(t,e,"read from private field"),i?i.call(t):e.get(t)),we=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},pt=(t,e,i,a)=>(Ac(t,e,"write to private field"),e.set(t,i),i),Et=(t,e,i)=>(Ac(t,e,"access private method"),i),Ga,$i,qo,wn,Yo,no,Fn,Kn,za,Qa,un,qd,af,Yd,Go,kc,zo,wc,Qo,Sc,Gd,rf,Vn,jo,zd,nf;const bT=t=>{const e=t.range,i=Tn(+sf(t)),a=Tn(+t.mediaSeekableEnd),r=i&&a?C("{currentTime} of {totalTime}",{currentTime:i,totalTime:a}):C("video not loaded, unknown time.");e.setAttribute("aria-valuetext",r)};function gT(t){return`
    <style>
      :host {
        --media-box-border-radius: 4px;
        --media-box-padding-left: 10px;
        --media-box-padding-right: 10px;
        --media-preview-border-radius: var(--media-box-border-radius);
        --media-box-arrow-offset: var(--media-box-border-radius);
        --_control-background: var(--media-control-background, var(--media-secondary-color, rgb(20 20 30 / .7)));
        --_preview-background: var(--media-preview-background, var(--_control-background));

        
        contain: layout;
      }

      #buffered {
        background: var(--media-time-range-buffered-color, rgb(255 255 255 / .4));
        position: absolute;
        height: 100%;
        will-change: width;
      }

      #preview-rail,
      #current-rail {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 100%;
        pointer-events: none;
        will-change: transform;
      }

      [part~="box"] {
        width: min-content;
        
        position: absolute;
        bottom: 100%;
        flex-direction: column;
        align-items: center;
        transform: translateX(-50%);
      }

      [part~="current-box"] {
        display: var(--media-current-box-display, var(--media-box-display, flex));
        margin: var(--media-current-box-margin, var(--media-box-margin, 0 0 5px));
        visibility: hidden;
      }

      [part~="preview-box"] {
        display: var(--media-preview-box-display, var(--media-box-display, flex));
        margin: var(--media-preview-box-margin, var(--media-box-margin, 0 0 5px));
        transition-property: var(--media-preview-transition-property, visibility, opacity);
        transition-duration: var(--media-preview-transition-duration-out, .25s);
        transition-delay: var(--media-preview-transition-delay-out, 0s);
        visibility: hidden;
        opacity: 0;
      }

      :host(:is([${h.MEDIA_PREVIEW_IMAGE}], [${h.MEDIA_PREVIEW_TIME}])[dragging]) [part~="preview-box"] {
        transition-duration: var(--media-preview-transition-duration-in, .5s);
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
        opacity: 1;
      }

      @media (hover: hover) {
        :host(:is([${h.MEDIA_PREVIEW_IMAGE}], [${h.MEDIA_PREVIEW_TIME}]):hover) [part~="preview-box"] {
          transition-duration: var(--media-preview-transition-duration-in, .5s);
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
          opacity: 1;
        }
      }

      media-preview-thumbnail,
      ::slotted(media-preview-thumbnail) {
        visibility: hidden;
        
        transition: visibility 0s .25s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-thumbnail-background, var(--_preview-background));
        box-shadow: var(--media-preview-thumbnail-box-shadow, 0 0 4px rgb(0 0 0 / .2));
        max-width: var(--media-preview-thumbnail-max-width, 180px);
        max-height: var(--media-preview-thumbnail-max-height, 160px);
        min-width: var(--media-preview-thumbnail-min-width, 120px);
        min-height: var(--media-preview-thumbnail-min-height, 80px);
        border: var(--media-preview-thumbnail-border);
        border-radius: var(--media-preview-thumbnail-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius) 0 0);
      }

      :host([${h.MEDIA_PREVIEW_IMAGE}][dragging]) media-preview-thumbnail,
      :host([${h.MEDIA_PREVIEW_IMAGE}][dragging]) ::slotted(media-preview-thumbnail) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        visibility: visible;
      }

      @media (hover: hover) {
        :host([${h.MEDIA_PREVIEW_IMAGE}]:hover) media-preview-thumbnail,
        :host([${h.MEDIA_PREVIEW_IMAGE}]:hover) ::slotted(media-preview-thumbnail) {
          transition-delay: var(--media-preview-transition-delay-in, .25s);
          visibility: visible;
        }

        :host([${h.MEDIA_PREVIEW_TIME}]:hover) {
          --media-time-range-hover-display: block;
        }
      }

      media-preview-chapter-display,
      ::slotted(media-preview-chapter-display) {
        font-size: var(--media-font-size, 13px);
        line-height: 17px;
        min-width: 0;
        visibility: hidden;
        
        transition: min-width 0s, border-radius 0s, margin 0s, padding 0s, visibility 0s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-chapter-background, var(--_preview-background));
        border-radius: var(--media-preview-chapter-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius)
          var(--media-preview-border-radius) var(--media-preview-border-radius));
        padding: var(--media-preview-chapter-padding, 3.5px 9px);
        margin: var(--media-preview-chapter-margin, 0 0 5px);
        text-shadow: var(--media-preview-chapter-text-shadow, 0 0 4px rgb(0 0 0 / .75));
      }

      :host([${h.MEDIA_PREVIEW_IMAGE}]) media-preview-chapter-display,
      :host([${h.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-chapter-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-chapter-border-radius, 0);
        padding: var(--media-preview-chapter-padding, 3.5px 9px 0);
        margin: var(--media-preview-chapter-margin, 0);
        min-width: 100%;
      }

      media-preview-chapter-display[${h.MEDIA_PREVIEW_CHAPTER}],
      ::slotted(media-preview-chapter-display[${h.MEDIA_PREVIEW_CHAPTER}]) {
        visibility: visible;
      }

      media-preview-chapter-display:not([aria-valuetext]),
      ::slotted(media-preview-chapter-display:not([aria-valuetext])) {
        display: none;
      }

      media-preview-time-display,
      ::slotted(media-preview-time-display),
      media-time-display,
      ::slotted(media-time-display) {
        font-size: var(--media-font-size, 13px);
        line-height: 17px;
        min-width: 0;
        
        transition: min-width 0s, border-radius 0s;
        transition-delay: calc(var(--media-preview-transition-delay-out, 0s) + var(--media-preview-transition-duration-out, .25s));
        background: var(--media-preview-time-background, var(--_preview-background));
        border-radius: var(--media-preview-time-border-radius,
          var(--media-preview-border-radius) var(--media-preview-border-radius)
          var(--media-preview-border-radius) var(--media-preview-border-radius));
        padding: var(--media-preview-time-padding, 3.5px 9px);
        margin: var(--media-preview-time-margin, 0);
        text-shadow: var(--media-preview-time-text-shadow, 0 0 4px rgb(0 0 0 / .75));
        transform: translateX(min(
          max(calc(50% - var(--_box-width) / 2),
          calc(var(--_box-shift, 0))),
          calc(var(--_box-width) / 2 - 50%)
        ));
      }

      :host([${h.MEDIA_PREVIEW_IMAGE}]) media-preview-time-display,
      :host([${h.MEDIA_PREVIEW_IMAGE}]) ::slotted(media-preview-time-display) {
        transition-delay: var(--media-preview-transition-delay-in, .25s);
        border-radius: var(--media-preview-time-border-radius,
          0 0 var(--media-preview-border-radius) var(--media-preview-border-radius));
        min-width: 100%;
      }

      :host([${h.MEDIA_PREVIEW_TIME}]:hover) {
        --media-time-range-hover-display: block;
      }

      [part~="arrow"],
      ::slotted([part~="arrow"]) {
        display: var(--media-box-arrow-display, inline-block);
        transform: translateX(min(
          max(calc(50% - var(--_box-width) / 2 + var(--media-box-arrow-offset)),
          calc(var(--_box-shift, 0))),
          calc(var(--_box-width) / 2 - 50% - var(--media-box-arrow-offset))
        ));
        
        border-color: transparent;
        border-top-color: var(--media-box-arrow-background, var(--_control-background));
        border-width: var(--media-box-arrow-border-width,
          var(--media-box-arrow-height, 5px) var(--media-box-arrow-width, 6px) 0);
        border-style: solid;
        justify-content: center;
        height: 0;
      }
    </style>
    <div id="preview-rail">
      <slot name="preview" part="box preview-box">
        <media-preview-thumbnail>
          <template shadowrootmode="${mm.shadowRootOptions.mode}">
            ${mm.getTemplateHTML({})}
          </template>
        </media-preview-thumbnail>
        <media-preview-chapter-display></media-preview-chapter-display>
        <media-preview-time-display></media-preview-time-display>
        <slot name="preview-arrow"><div part="arrow"></div></slot>
      </slot>
    </div>
    <div id="current-rail">
      <slot name="current" part="box current-box">
        
      </slot>
    </div>
  `}const ps=(t,e=t.mediaCurrentTime)=>{const i=Number.isFinite(t.mediaSeekableStart)?t.mediaSeekableStart:0,a=Number.isFinite(t.mediaDuration)?t.mediaDuration:t.mediaSeekableEnd;if(Number.isNaN(a))return 0;const r=(e-i)/(a-i);return Math.max(0,Math.min(r,1))},sf=(t,e=t.range.valueAsNumber)=>{const i=Number.isFinite(t.mediaSeekableStart)?t.mediaSeekableStart:0,a=Number.isFinite(t.mediaDuration)?t.mediaDuration:t.mediaSeekableEnd;return Number.isNaN(a)?0:e*(a-i)+i};class Ic extends Cr{constructor(){super(),we(this,qd),we(this,Go),we(this,zo),we(this,Qo),we(this,Gd),we(this,Vn),we(this,zd),we(this,Ga,null),we(this,$i,void 0),we(this,qo,void 0),we(this,wn,void 0),we(this,Yo,void 0),we(this,no,void 0),we(this,Fn,void 0),we(this,Kn,void 0),we(this,za,void 0),we(this,Qa,void 0),we(this,un,()=>{Et(this,qd,af).call(this)?de(this,$i).start():de(this,$i).stop()}),we(this,Yd,a=>{this.dragging||(Ku(a)&&(this.range.valueAsNumber=a),de(this,Qa)||this.updateBar())}),this.shadowRoot.querySelector("#track").insertAdjacentHTML("afterbegin",'<div id="buffered" part="buffered"></div>'),pt(this,qo,this.shadowRoot.querySelectorAll('[part~="box"]')),pt(this,Yo,this.shadowRoot.querySelector('[part~="preview-box"]')),pt(this,no,this.shadowRoot.querySelector('[part~="current-box"]'));const i=getComputedStyle(this);pt(this,Fn,parseInt(i.getPropertyValue("--media-box-padding-left"))),pt(this,Kn,parseInt(i.getPropertyValue("--media-box-padding-right"))),pt(this,$i,new _T(this.range,de(this,Yd),60))}static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_PAUSED,h.MEDIA_DURATION,h.MEDIA_SEEKABLE,h.MEDIA_CURRENT_TIME,h.MEDIA_PREVIEW_IMAGE,h.MEDIA_PREVIEW_TIME,h.MEDIA_PREVIEW_CHAPTER,h.MEDIA_BUFFERED,h.MEDIA_PLAYBACK_RATE,h.MEDIA_LOADING,h.MEDIA_ENDED]}connectedCallback(){var e;super.connectedCallback(),this.range.setAttribute("aria-label",C("seek")),de(this,un).call(this),pt(this,Ga,this.getRootNode()),(e=de(this,Ga))==null||e.addEventListener("transitionstart",this)}disconnectedCallback(){var e;super.disconnectedCallback(),de(this,$i).stop(),(e=de(this,Ga))==null||e.removeEventListener("transitionstart",this),pt(this,Ga,null)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),i!=a&&(e===h.MEDIA_CURRENT_TIME||e===h.MEDIA_PAUSED||e===h.MEDIA_ENDED||e===h.MEDIA_LOADING||e===h.MEDIA_DURATION||e===h.MEDIA_SEEKABLE?(de(this,$i).update({start:ps(this),duration:this.mediaSeekableEnd-this.mediaSeekableStart,playbackRate:this.mediaPlaybackRate}),de(this,un).call(this),bT(this)):e===h.MEDIA_BUFFERED&&this.updateBufferedBar(),(e===h.MEDIA_DURATION||e===h.MEDIA_SEEKABLE)&&(this.mediaChaptersCues=de(this,za),this.updateBar()))}get mediaChaptersCues(){return de(this,za)}set mediaChaptersCues(e){var i;pt(this,za,e),this.updateSegments((i=de(this,za))==null?void 0:i.map(a=>({start:ps(this,a.startTime),end:ps(this,a.endTime)})))}get mediaPaused(){return Y(this,h.MEDIA_PAUSED)}set mediaPaused(e){G(this,h.MEDIA_PAUSED,e)}get mediaLoading(){return Y(this,h.MEDIA_LOADING)}set mediaLoading(e){G(this,h.MEDIA_LOADING,e)}get mediaDuration(){return se(this,h.MEDIA_DURATION)}set mediaDuration(e){ve(this,h.MEDIA_DURATION,e)}get mediaCurrentTime(){return se(this,h.MEDIA_CURRENT_TIME)}set mediaCurrentTime(e){ve(this,h.MEDIA_CURRENT_TIME,e)}get mediaPlaybackRate(){return se(this,h.MEDIA_PLAYBACK_RATE,1)}set mediaPlaybackRate(e){ve(this,h.MEDIA_PLAYBACK_RATE,e)}get mediaBuffered(){const e=this.getAttribute(h.MEDIA_BUFFERED);return e?e.split(" ").map(i=>i.split(":").map(a=>+a)):[]}set mediaBuffered(e){if(!e){this.removeAttribute(h.MEDIA_BUFFERED);return}const i=e.map(a=>a.join(":")).join(" ");this.setAttribute(h.MEDIA_BUFFERED,i)}get mediaSeekable(){const e=this.getAttribute(h.MEDIA_SEEKABLE);if(e)return e.split(":").map(i=>+i)}set mediaSeekable(e){if(e==null){this.removeAttribute(h.MEDIA_SEEKABLE);return}this.setAttribute(h.MEDIA_SEEKABLE,e.join(":"))}get mediaSeekableEnd(){var e;const[,i=this.mediaDuration]=(e=this.mediaSeekable)!=null?e:[];return i}get mediaSeekableStart(){var e;const[i=0]=(e=this.mediaSeekable)!=null?e:[];return i}get mediaPreviewImage(){return ce(this,h.MEDIA_PREVIEW_IMAGE)}set mediaPreviewImage(e){oe(this,h.MEDIA_PREVIEW_IMAGE,e)}get mediaPreviewTime(){return se(this,h.MEDIA_PREVIEW_TIME)}set mediaPreviewTime(e){ve(this,h.MEDIA_PREVIEW_TIME,e)}get mediaEnded(){return Y(this,h.MEDIA_ENDED)}set mediaEnded(e){G(this,h.MEDIA_ENDED,e)}updateBar(){super.updateBar(),this.updateBufferedBar(),this.updateCurrentBox()}updateBufferedBar(){var e;const i=this.mediaBuffered;if(!i.length)return;let a;if(this.mediaEnded)a=1;else{const n=this.mediaCurrentTime,[,s=this.mediaSeekableStart]=(e=i.find(([o,l])=>o<=n&&n<=l))!=null?e:[];a=ps(this,s)}const{style:r}=Re(this.shadowRoot,"#buffered");r.setProperty("width",`${a*100}%`)}updateCurrentBox(){if(!this.shadowRoot.querySelector('slot[name="current"]').assignedElements().length)return;const i=Re(this.shadowRoot,"#current-rail"),a=Re(this.shadowRoot,'[part~="current-box"]'),r=Et(this,Go,kc).call(this,de(this,no)),n=Et(this,zo,wc).call(this,r,this.range.valueAsNumber),s=Et(this,Qo,Sc).call(this,r,this.range.valueAsNumber);i.style.transform=`translateX(${n})`,i.style.setProperty("--_range-width",`${r.range.width}`),a.style.setProperty("--_box-shift",`${s}`),a.style.setProperty("--_box-width",`${r.box.width}px`),a.style.setProperty("visibility","initial")}handleEvent(e){switch(super.handleEvent(e),e.type){case"input":Et(this,zd,nf).call(this);break;case"pointermove":Et(this,Gd,rf).call(this,e);break;case"pointerup":de(this,Qa)&&pt(this,Qa,!1);break;case"pointerdown":pt(this,Qa,!0);break;case"pointerleave":Et(this,Vn,jo).call(this,null);break;case"transitionstart":Ai(e.target,this)&&setTimeout(()=>de(this,un).call(this),0);break}}}Ga=new WeakMap;$i=new WeakMap;qo=new WeakMap;wn=new WeakMap;Yo=new WeakMap;no=new WeakMap;Fn=new WeakMap;Kn=new WeakMap;za=new WeakMap;Qa=new WeakMap;un=new WeakMap;qd=new WeakSet;af=function(){return this.isConnected&&!this.mediaPaused&&!this.mediaLoading&&!this.mediaEnded&&this.mediaSeekableEnd>0&&ov(this)};Yd=new WeakMap;Go=new WeakSet;kc=function(t){var e;const a=((e=this.getAttribute("bounds")?Rr(this,`#${this.getAttribute("bounds")}`):this.parentElement)!=null?e:this).getBoundingClientRect(),r=this.range.getBoundingClientRect(),n=t.offsetWidth,s=-(r.left-a.left-n/2),o=a.right-r.left-n/2;return{box:{width:n,min:s,max:o},bounds:a,range:r}};zo=new WeakSet;wc=function(t,e){let i=`${e*100}%`;const{width:a,min:r,max:n}=t.box;if(!a)return i;if(Number.isNaN(r)||(i=`max(${`calc(1 / var(--_range-width) * 100 * ${r}% + var(--media-box-padding-left))`}, ${i})`),!Number.isNaN(n)){const o=`calc(1 / var(--_range-width) * 100 * ${n}% - var(--media-box-padding-right))`;i=`min(${i}, ${o})`}return i};Qo=new WeakSet;Sc=function(t,e){const{width:i,min:a,max:r}=t.box,n=e*t.range.width;if(n<a+de(this,Fn)){const s=t.range.left-t.bounds.left-de(this,Fn);return`${n-i/2+s}px`}if(n>r-de(this,Kn)){const s=t.bounds.right-t.range.right-de(this,Kn);return`${n+i/2-s-t.range.width}px`}return 0};Gd=new WeakSet;rf=function(t){const e=[...de(this,qo)].some(p=>t.composedPath().includes(p));if(!this.dragging&&(e||!t.composedPath().includes(this))){Et(this,Vn,jo).call(this,null);return}const i=this.mediaSeekableEnd;if(!i)return;const a=Re(this.shadowRoot,"#preview-rail"),r=Re(this.shadowRoot,'[part~="preview-box"]'),n=Et(this,Go,kc).call(this,de(this,Yo));let s=(t.clientX-n.range.left)/n.range.width;s=Math.max(0,Math.min(1,s));const o=Et(this,zo,wc).call(this,n,s),l=Et(this,Qo,Sc).call(this,n,s);a.style.transform=`translateX(${o})`,a.style.setProperty("--_range-width",`${n.range.width}`),r.style.setProperty("--_box-shift",`${l}`),r.style.setProperty("--_box-width",`${n.box.width}px`);const c=Math.round(de(this,wn))-Math.round(s*i);Math.abs(c)<1&&s>.01&&s<.99||(pt(this,wn,s*i),Et(this,Vn,jo).call(this,de(this,wn)))};Vn=new WeakSet;jo=function(t){this.dispatchEvent(new g.CustomEvent(D.MEDIA_PREVIEW_REQUEST,{composed:!0,bubbles:!0,detail:t}))};zd=new WeakSet;nf=function(){de(this,$i).stop();const t=sf(this);this.dispatchEvent(new g.CustomEvent(D.MEDIA_SEEK_REQUEST,{composed:!0,bubbles:!0,detail:t}))};Ic.shadowRootOptions={mode:"open"};Ic.getContainerTemplateHTML=gT;g.customElements.get("media-time-range")||g.customElements.define("media-time-range",Ic);var yT=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},fm=(t,e,i)=>(yT(t,e,"read from private field"),i?i.call(t):e.get(t)),TT=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},so;const AT=1,kT=t=>t.mediaMuted?0:t.mediaVolume,wT=t=>`${Math.round(t*100)}%`;class ST extends Cr{constructor(){super(...arguments),TT(this,so,()=>{const e=this.range.value,i=new g.CustomEvent(D.MEDIA_VOLUME_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(i)})}static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_VOLUME,h.MEDIA_MUTED,h.MEDIA_VOLUME_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),this.range.setAttribute("aria-label",C("volume")),this.range.addEventListener("input",fm(this,so))}disconnectedCallback(){this.range.removeEventListener("input",fm(this,so)),super.disconnectedCallback()}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),(e===h.MEDIA_VOLUME||e===h.MEDIA_MUTED)&&(this.range.valueAsNumber=kT(this),this.range.setAttribute("aria-valuetext",wT(this.range.valueAsNumber)),this.updateBar())}get mediaVolume(){return se(this,h.MEDIA_VOLUME,AT)}set mediaVolume(e){ve(this,h.MEDIA_VOLUME,e)}get mediaMuted(){return Y(this,h.MEDIA_MUTED)}set mediaMuted(e){G(this,h.MEDIA_MUTED,e)}get mediaVolumeUnavailable(){return ce(this,h.MEDIA_VOLUME_UNAVAILABLE)}set mediaVolumeUnavailable(e){oe(this,h.MEDIA_VOLUME_UNAVAILABLE,e)}}so=new WeakMap;g.customElements.get("media-volume-range")||g.customElements.define("media-volume-range",ST);function IT(t){return`
      <style>
        :host {
          min-width: 4ch;
          padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
          width: 100%;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 1rem;
          font-weight: var(--media-button-font-weight, normal);
        }

        #checked-indicator {
          display: none;
        }

        :host([${h.MEDIA_LOOP}]) #checked-indicator {
          display: block;
        }
      </style>
      
      <span id="icon">
     </span>

      <div id="checked-indicator">
        <svg aria-hidden="true" viewBox="0 1 24 24" part="checked-indicator indicator">
          <path d="m10 15.17 9.193-9.191 1.414 1.414-10.606 10.606-6.364-6.364 1.414-1.414 4.95 4.95Z"/>
        </svg>
      </div>
    `}function RT(){return C("Loop")}class Rc extends Ne{constructor(){super(...arguments),this.container=null}static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_LOOP]}connectedCallback(){var e;super.connectedCallback(),this.container=((e=this.shadowRoot)==null?void 0:e.querySelector("#icon"))||null,this.container&&(this.container.textContent=C("Loop"))}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===h.MEDIA_LOOP&&this.container&&this.setAttribute("aria-checked",this.mediaLoop?"true":"false")}get mediaLoop(){return Y(this,h.MEDIA_LOOP)}set mediaLoop(e){G(this,h.MEDIA_LOOP,e)}handleClick(){const e=!this.mediaLoop,i=new g.CustomEvent(D.MEDIA_LOOP_REQUEST,{composed:!0,bubbles:!0,detail:e});this.dispatchEvent(i)}}Rc.getSlotTemplateHTML=IT;Rc.getTooltipContentHTML=RT;g.customElements.get("media-loop-button")||g.customElements.define("media-loop-button",Rc);var of=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},F=(t,e,i)=>(of(t,e,"read from private field"),i?i.call(t):e.get(t)),Xt=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Ei=(t,e,i,a)=>(of(t,e,"write to private field"),e.set(t,i),i),ja,oo,sa,cn,Mi,xi,Oi,oa,Za,lo,Rt;const Em=1,_m=0,LT=1,CT={processCallback(t,e,i){if(i){for(const[a,r]of e)if(a in i){const n=i[a];typeof n=="boolean"&&r instanceof Pt&&typeof r.element[r.attributeName]=="boolean"?r.booleanValue=n:typeof n=="function"&&r instanceof Pt?r.element[r.attributeName]=n:r.value=n}}}};class Rl extends g.DocumentFragment{constructor(e,i,a=CT){var r;super(),Xt(this,ja,void 0),Xt(this,oo,void 0),this.append(e.content.cloneNode(!0)),Ei(this,ja,lf(this)),Ei(this,oo,a),(r=a.createCallback)==null||r.call(a,this,F(this,ja),i),a.processCallback(this,F(this,ja),i)}update(e){F(this,oo).processCallback(this,F(this,ja),e)}}ja=new WeakMap;oo=new WeakMap;const lf=(t,e=[])=>{let i,a;for(const r of t.attributes||[])if(r.value.includes("{{")){const n=new MT;for([i,a]of gm(r.value))if(!i)n.append(a);else{const s=new Pt(t,r.name,r.namespaceURI);n.append(s),e.push([a,s])}r.value=n.toString()}for(const r of t.childNodes)if(r.nodeType===Em&&!(r instanceof HTMLTemplateElement))lf(r,e);else{const n=r.data;if(r.nodeType===Em||n.includes("{{")){const s=[];if(n)for([i,a]of gm(n))if(!i)s.push(new Text(a));else{const o=new Dr(t);s.push(o),e.push([a,o])}else if(r instanceof HTMLTemplateElement){const o=new cf(t,r);s.push(o),e.push([o.expression,o])}r.replaceWith(...s.flatMap(o=>o.replacementNodes||[o]))}}return e},bm={},gm=t=>{let e="",i=0,a=bm[t],r=0,n;if(a)return a;for(a=[];n=t[r];r++)n==="{"&&t[r+1]==="{"&&t[r-1]!=="\\"&&t[r+2]&&++i==1?(e&&a.push([_m,e]),e="",r++):n==="}"&&t[r+1]==="}"&&t[r-1]!=="\\"&&!--i?(a.push([LT,e.trim()]),e="",r++):e+=n||"";return e&&a.push([_m,(i>0?"{{":"")+e]),bm[t]=a},DT=11;class df{get value(){return""}set value(e){}toString(){return this.value}}const uf=new WeakMap;class MT{constructor(){Xt(this,sa,[])}[Symbol.iterator](){return F(this,sa).values()}get length(){return F(this,sa).length}item(e){return F(this,sa)[e]}append(...e){for(const i of e)i instanceof Pt&&uf.set(i,this),F(this,sa).push(i)}toString(){return F(this,sa).join("")}}sa=new WeakMap;class Pt extends df{constructor(e,i,a){super(),Xt(this,oa),Xt(this,cn,""),Xt(this,Mi,void 0),Xt(this,xi,void 0),Xt(this,Oi,void 0),Ei(this,Mi,e),Ei(this,xi,i),Ei(this,Oi,a)}get attributeName(){return F(this,xi)}get attributeNamespace(){return F(this,Oi)}get element(){return F(this,Mi)}get value(){return F(this,cn)}set value(e){F(this,cn)!==e&&(Ei(this,cn,e),!F(this,oa,Za)||F(this,oa,Za).length===1?e==null?F(this,Mi).removeAttributeNS(F(this,Oi),F(this,xi)):F(this,Mi).setAttributeNS(F(this,Oi),F(this,xi),e):F(this,Mi).setAttributeNS(F(this,Oi),F(this,xi),F(this,oa,Za).toString()))}get booleanValue(){return F(this,Mi).hasAttributeNS(F(this,Oi),F(this,xi))}set booleanValue(e){if(!F(this,oa,Za)||F(this,oa,Za).length===1)this.value=e?"":null;else throw new DOMException("Value is not fully templatized")}}cn=new WeakMap;Mi=new WeakMap;xi=new WeakMap;Oi=new WeakMap;oa=new WeakSet;Za=function(){return uf.get(this)};class Dr extends df{constructor(e,i){super(),Xt(this,lo,void 0),Xt(this,Rt,void 0),Ei(this,lo,e),Ei(this,Rt,i?[...i]:[new Text])}get replacementNodes(){return F(this,Rt)}get parentNode(){return F(this,lo)}get nextSibling(){return F(this,Rt)[F(this,Rt).length-1].nextSibling}get previousSibling(){return F(this,Rt)[0].previousSibling}get value(){return F(this,Rt).map(e=>e.textContent).join("")}set value(e){this.replace(e)}replace(...e){const i=e.flat().flatMap(a=>a==null?[new Text]:a.forEach?[...a]:a.nodeType===DT?[...a.childNodes]:a.nodeType?[a]:[new Text(a)]);i.length||i.push(new Text),Ei(this,Rt,xT(F(this,Rt)[0].parentNode,F(this,Rt),i,this.nextSibling))}}lo=new WeakMap;Rt=new WeakMap;class cf extends Dr{constructor(e,i){const a=i.getAttribute("directive")||i.getAttribute("type");let r=i.getAttribute("expression")||i.getAttribute(a)||"";r.startsWith("{{")&&(r=r.trim().slice(2,-2).trim()),super(e),this.expression=r,this.template=i,this.directive=a}}function xT(t,e,i,a=null){let r=0,n,s,o,l=i.length,c=e.length;for(;r<l&&r<c&&e[r]==i[r];)r++;for(;r<l&&r<c&&i[l-1]==e[c-1];)a=i[--c,--l];if(r==c)for(;r<l;)t.insertBefore(i[r++],a);if(r==l)for(;r<c;)t.removeChild(e[r++]);else{for(n=e[r];r<l;)o=i[r++],s=n?n.nextSibling:a,n==o?n=s:r<l&&i[r]==s?(t.replaceChild(o,n),n=s):t.insertBefore(o,n);for(;n!=a;)s=n.nextSibling,t.removeChild(n),n=s}return i}const ym={string:t=>String(t)};class hf{constructor(e){this.template=e,this.state=void 0}}const pa=new WeakMap,va=new WeakMap,Qd={partial:(t,e)=>{e[t.expression]=new hf(t.template)},if:(t,e)=>{var i;if(mf(t.expression,e))if(pa.get(t)!==t.template){pa.set(t,t.template);const a=new Rl(t.template,e,Lc);t.replace(a),va.set(t,a)}else(i=va.get(t))==null||i.update(e);else t.replace(""),pa.delete(t),va.delete(t)}},OT=Object.keys(Qd),Lc={processCallback(t,e,i){var a,r;if(i)for(const[n,s]of e){if(s instanceof cf){if(!s.directive){const l=OT.find(c=>s.template.hasAttribute(c));l&&(s.directive=l,s.expression=s.template.getAttribute(l))}(a=Qd[s.directive])==null||a.call(Qd,s,i);continue}let o=mf(n,i);if(o instanceof hf){pa.get(s)!==o.template?(pa.set(s,o.template),o=new Rl(o.template,o.state,Lc),s.value=o,va.set(s,o)):(r=va.get(s))==null||r.update(o.state);continue}o?(s instanceof Pt&&s.attributeName.startsWith("aria-")&&(o=String(o)),s instanceof Pt?typeof o=="boolean"?s.booleanValue=o:typeof o=="function"?s.element[s.attributeName]=o:s.value=o:(s.value=o,pa.delete(s),va.delete(s))):s instanceof Pt?s.value=void 0:(s.value=void 0,pa.delete(s),va.delete(s))}}},Tm={"!":t=>!t,"!!":t=>!!t,"==":(t,e)=>t==e,"!=":(t,e)=>t!=e,">":(t,e)=>t>e,">=":(t,e)=>t>=e,"<":(t,e)=>t<e,"<=":(t,e)=>t<=e,"??":(t,e)=>t??e,"|":(t,e)=>{var i;return(i=ym[e])==null?void 0:i.call(ym,t)}};function NT(t){return PT(t,{boolean:/true|false/,number:/-?\d+\.?\d*/,string:/(["'])((?:\\.|[^\\])*?)\1/,operator:/[!=><][=!]?|\?\?|\|/,ws:/\s+/,param:/[$a-z_][$\w]*/i}).filter(({type:e})=>e!=="ws")}function mf(t,e={}){var i,a,r,n,s,o,l;const c=NT(t);if(c.length===0||c.some(({type:p})=>!p))return Wr(t);if(((i=c[0])==null?void 0:i.token)===">"){const p=e[(a=c[1])==null?void 0:a.token];if(!p)return Wr(t);const m={...e};p.state=m;const u=c.slice(2);for(let d=0;d<u.length;d+=3){const v=(r=u[d])==null?void 0:r.token,f=(n=u[d+1])==null?void 0:n.token,b=(s=u[d+2])==null?void 0:s.token;v&&f==="="&&(m[v]=Fr(b,e))}return p}if(c.length===1)return vs(c[0])?Fr(c[0].token,e):Wr(t);if(c.length===2){const p=(o=c[0])==null?void 0:o.token,m=Tm[p];if(!m||!vs(c[1]))return Wr(t);const u=Fr(c[1].token,e);return m(u)}if(c.length===3){const p=(l=c[1])==null?void 0:l.token,m=Tm[p];if(!m||!vs(c[0])||!vs(c[2]))return Wr(t);const u=Fr(c[0].token,e);if(p==="|")return m(u,c[2].token);const d=Fr(c[2].token,e);return m(u,d)}}function Wr(t){return console.warn(`Warning: invalid expression \`${t}\``),!1}function vs({type:t}){return["number","boolean","string","param"].includes(t)}function Fr(t,e){const i=t[0],a=t.slice(-1);return t==="true"||t==="false"?t==="true":i===a&&["'",'"'].includes(i)?t.slice(1,-1):Zp(t)?parseFloat(t):e[t]}function PT(t,e){let i,a,r;const n=[];for(;t;){r=null,i=t.length;for(const s in e)a=e[s].exec(t),a&&a.index<i&&(r={token:a[0],type:s,matches:a.slice(1)},i=a.index);i&&n.push({token:t.substr(0,i),type:void 0}),r&&n.push(r),t=t.substr(i+(r?r.token.length:0))}return n}var Cc=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Ni=(t,e,i)=>(Cc(t,e,"read from private field"),i?i.call(t):e.get(t)),Ji=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},fi=(t,e,i,a)=>(Cc(t,e,"write to private field"),e.set(t,i),i),jl=(t,e,i)=>(Cc(t,e,"access private method"),i),mr,uo,pr,Xa,jd,pf,co,Zd,hn;const Zl={mediatargetlivewindow:"targetlivewindow",mediastreamtype:"streamtype"},vf=ke.createElement("template");vf.innerHTML=`
  <style>
    :host {
      display: inline-block;
      line-height: 0;
    }

    media-controller {
      width: 100%;
      height: 100%;
    }

    media-captions-button:not([mediasubtitleslist]),
    media-captions-menu:not([mediasubtitleslist]),
    media-captions-menu-button:not([mediasubtitleslist]),
    media-audio-track-menu[mediaaudiotrackunavailable],
    media-audio-track-menu-button[mediaaudiotrackunavailable],
    media-rendition-menu[mediarenditionunavailable],
    media-rendition-menu-button[mediarenditionunavailable],
    media-volume-range[mediavolumeunavailable],
    media-airplay-button[mediaairplayunavailable],
    media-fullscreen-button[mediafullscreenunavailable],
    media-cast-button[mediacastunavailable],
    media-pip-button[mediapipunavailable] {
      display: none;
    }
  </style>
`;class Ll extends g.HTMLElement{constructor(){super(),Ji(this,jd),Ji(this,co),Ji(this,mr,void 0),Ji(this,uo,void 0),Ji(this,pr,void 0),Ji(this,Xa,void 0),Ji(this,hn,void 0),this.shadowRoot?this.renderRoot=this.shadowRoot:(this.renderRoot=this.attachShadow({mode:"open"}),this.createRenderer()),fi(this,Xa,new MutationObserver(e=>{var i;this.mediaController&&!((i=this.mediaController)!=null&&i.breakpointsComputed)||e.some(a=>{const r=a.target;return r===this?!0:r.localName!=="media-controller"?!1:!!(Zl[a.attributeName]||a.attributeName.startsWith("breakpoint"))})&&this.render()})),fi(this,hn,this.render.bind(this)),jl(this,jd,pf).call(this,"template")}get mediaController(){return this.renderRoot.querySelector("media-controller")}get template(){var e;return(e=Ni(this,mr))!=null?e:this.constructor.template}set template(e){if(e===null){this.removeAttribute("template");return}typeof e=="string"?this.setAttribute("template",e):e instanceof HTMLTemplateElement&&(fi(this,mr,e),fi(this,pr,null),this.createRenderer())}get props(){var e,i,a;const r=[...Array.from((i=(e=this.mediaController)==null?void 0:e.attributes)!=null?i:[]).filter(({name:s})=>Zl[s]||s.startsWith("breakpoint")),...Array.from(this.attributes)],n={};for(const s of r){const o=(a=Zl[s.name])!=null?a:U0(s.name);let{value:l}=s;l!=null?(Zp(l)&&(l=parseFloat(l)),n[o]=l===""?!0:l):n[o]=!1}return n}attributeChangedCallback(e,i,a){e==="template"&&i!=a&&jl(this,co,Zd).call(this)}connectedCallback(){this.addEventListener(ni.BREAKPOINTS_COMPUTED,Ni(this,hn)),Ni(this,Xa).observe(this,{attributes:!0}),Ni(this,Xa).observe(this.renderRoot,{attributes:!0,subtree:!0}),jl(this,co,Zd).call(this)}disconnectedCallback(){this.removeEventListener(ni.BREAKPOINTS_COMPUTED,Ni(this,hn)),Ni(this,Xa).disconnect()}createRenderer(){this.template instanceof HTMLTemplateElement&&this.template!==Ni(this,uo)&&(fi(this,uo,this.template),this.renderer=new Rl(this.template,this.props,this.constructor.processor),this.renderRoot.textContent="",this.renderRoot.append(vf.content.cloneNode(!0),this.renderer))}render(){var e;(e=this.renderer)==null||e.update(this.props)}}mr=new WeakMap;uo=new WeakMap;pr=new WeakMap;Xa=new WeakMap;jd=new WeakSet;pf=function(t){if(Object.prototype.hasOwnProperty.call(this,t)){const e=this[t];delete this[t],this[t]=e}};co=new WeakSet;Zd=function(){var t;const e=this.getAttribute("template");if(!e||e===Ni(this,pr))return;const i=this.getRootNode(),a=(t=i==null?void 0:i.getElementById)==null?void 0:t.call(i,e);if(a){fi(this,pr,e),fi(this,mr,a),this.createRenderer();return}$T(e)&&(fi(this,pr,e),UT(e).then(r=>{const n=ke.createElement("template");n.innerHTML=r,fi(this,mr,n),this.createRenderer()}).catch(console.error))};hn=new WeakMap;Ll.observedAttributes=["template"];Ll.processor=Lc;function $T(t){if(!/^(\/|\.\/|https?:\/\/)/.test(t))return!1;const e=/^https?:\/\//.test(t)?void 0:location.origin;try{new URL(t,e)}catch{return!1}return!0}async function UT(t){const e=await fetch(t);if(e.status!==200)throw new Error(`Failed to load resource: the server responded with a status of ${e.status}`);return e.text()}g.customElements.get("media-theme")||g.customElements.define("media-theme",Ll);function HT({anchor:t,floating:e,placement:i}){const a=BT({anchor:t,floating:e}),{x:r,y:n}=FT(a,i);return{x:r,y:n}}function BT({anchor:t,floating:e}){return{anchor:WT(t,e.offsetParent),floating:{x:0,y:0,width:e.offsetWidth,height:e.offsetHeight}}}function WT(t,e){var i;const a=t.getBoundingClientRect(),r=(i=e==null?void 0:e.getBoundingClientRect())!=null?i:{x:0,y:0};return{x:a.x-r.x,y:a.y-r.y,width:a.width,height:a.height}}function FT({anchor:t,floating:e},i){const a=KT(i)==="x"?"y":"x",r=a==="y"?"height":"width",n=ff(i),s=t.x+t.width/2-e.width/2,o=t.y+t.height/2-e.height/2,l=t[r]/2-e[r]/2;let c;switch(n){case"top":c={x:s,y:t.y-e.height};break;case"bottom":c={x:s,y:t.y+t.height};break;case"right":c={x:t.x+t.width,y:o};break;case"left":c={x:t.x-e.width,y:o};break;default:c={x:t.x,y:t.y}}switch(i.split("-")[1]){case"start":c[a]-=l;break;case"end":c[a]+=l;break}return c}function ff(t){return t.split("-")[0]}function KT(t){return["top","bottom"].includes(ff(t))?"y":"x"}class Dc extends Event{constructor({action:e="auto",relatedTarget:i,...a}){super("invoke",a),this.action=e,this.relatedTarget=i}}class VT extends Event{constructor({newState:e,oldState:i,...a}){super("toggle",a),this.newState=e,this.oldState=i}}var Mc=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Z=(t,e,i)=>(Mc(t,e,"read from private field"),i?i.call(t):e.get(t)),ie=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},vt=(t,e,i,a)=>(Mc(t,e,"write to private field"),e.set(t,i),i),ae=(t,e,i)=>(Mc(t,e,"access private method"),i),Qt,Ki,gi,ho,mn,ya,qn,Xd,Ef,Zo,xc,Xo,mo,Jd,eu,_f,tu,bf,iu,gf,vr,fr,Er,Yn,Jo,Oc,au,yf,Nc,Tf,ru,Af,Pc,kf,nu,wf,su,Sf,Sn,el,ou,If,In,tl,po,lu;function Sr({type:t,text:e,value:i,checked:a}){const r=ke.createElement("media-chrome-menu-item");r.type=t,r.part.add("menu-item"),r.part.add(t),r.value=i,r.checked=a;const n=ke.createElement("span");return n.textContent=e,r.append(n),r}function Ta(t,e){let i=t.querySelector(`:scope > [slot="${e}"]`);if((i==null?void 0:i.nodeName)=="SLOT"&&(i=i.assignedElements({flatten:!0})[0]),i)return i=i.cloneNode(!0),i;const a=t.shadowRoot.querySelector(`[name="${e}"] > svg`);return a?a.cloneNode(!0):""}function qT(t){return`
    <style>
      :host {
        font: var(--media-font,
          var(--media-font-weight, normal)
          var(--media-font-size, 14px) /
          var(--media-text-content-height, var(--media-control-height, 24px))
          var(--media-font-family, helvetica neue, segoe ui, roboto, arial, sans-serif));
        color: var(--media-text-color, var(--media-primary-color, rgb(238 238 238)));
        --_menu-bg: rgb(20 20 30 / .8);
        background: var(--media-menu-background, var(--media-control-background, var(--media-secondary-color, var(--_menu-bg))));
        border-radius: var(--media-menu-border-radius);
        border: var(--media-menu-border, none);
        display: var(--media-menu-display, inline-flex) !important;
        
        transition: var(--media-menu-transition-in,
          visibility 0s,
          opacity .2s ease-out,
          transform .15s ease-out,
          left .2s ease-in-out,
          min-width .2s ease-in-out,
          min-height .2s ease-in-out
        ) !important;
        
        visibility: var(--media-menu-visibility, visible);
        opacity: var(--media-menu-opacity, 1);
        max-height: var(--media-menu-max-height, var(--_menu-max-height, 300px));
        transform: var(--media-menu-transform-in, translateY(0) scale(1));
        flex-direction: column;
        
        min-height: 0;
        position: relative;
        bottom: var(--_menu-bottom);
        box-sizing: border-box;
      } 

      @-moz-document url-prefix() {
        :host{
          --_menu-bg: rgb(20 20 30);
        }
      }

      :host([hidden]) {
        transition: var(--media-menu-transition-out,
          visibility .15s ease-in,
          opacity .15s ease-in,
          transform .15s ease-in
        ) !important;
        visibility: var(--media-menu-hidden-visibility, hidden);
        opacity: var(--media-menu-hidden-opacity, 0);
        max-height: var(--media-menu-hidden-max-height,
          var(--media-menu-max-height, var(--_menu-max-height, 300px)));
        transform: var(--media-menu-transform-out, translateY(2px) scale(.99));
        pointer-events: none;
      }

      :host([slot="submenu"]) {
        background: none;
        width: 100%;
        min-height: 100%;
        position: absolute;
        bottom: 0;
        right: -100%;
      }

      #container {
        display: flex;
        flex-direction: column;
        min-height: 0;
        transition: transform .2s ease-out;
        transform: translate(0, 0);
      }

      #container.has-expanded {
        transition: transform .2s ease-in;
        transform: translate(-100%, 0);
      }

      button {
        background: none;
        color: inherit;
        border: none;
        padding: 0;
        font: inherit;
        outline: inherit;
        display: inline-flex;
        align-items: center;
      }

      slot[name="header"][hidden] {
        display: none;
      }

      slot[name="header"] > *,
      slot[name="header"]::slotted(*) {
        padding: .4em .7em;
        border-bottom: 1px solid rgb(255 255 255 / .25);
        cursor: var(--media-cursor, default);
      }

      slot[name="header"] > button[part~="back"],
      slot[name="header"]::slotted(button[part~="back"]) {
        cursor: var(--media-cursor, pointer);
      }

      svg[part~="back"] {
        height: var(--media-menu-icon-height, var(--media-control-height, 24px));
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        display: block;
        margin-right: .5ch;
      }

      slot:not([name]) {
        gap: var(--media-menu-gap);
        flex-direction: var(--media-menu-flex-direction, column);
        overflow: var(--media-menu-overflow, hidden auto);
        display: flex;
        min-height: 0;
      }

      :host([role="menu"]) slot:not([name]) {
        padding-block: .4em;
      }

      slot:not([name])::slotted([role="menu"]) {
        background: none;
      }

      media-chrome-menu-item > span {
        margin-right: .5ch;
        max-width: var(--media-menu-item-max-width);
        text-overflow: ellipsis;
        overflow: hidden;
      }
    </style>
    <style id="layout-row" media="width:0">

      slot[name="header"] > *,
      slot[name="header"]::slotted(*) {
        padding: .4em .5em;
      }

      slot:not([name]) {
        gap: var(--media-menu-gap, .25em);
        flex-direction: var(--media-menu-flex-direction, row);
        padding-inline: .5em;
      }

      media-chrome-menu-item {
        padding: .3em .5em;
      }

      media-chrome-menu-item[aria-checked="true"] {
        background: var(--media-menu-item-checked-background, rgb(255 255 255 / .2));
      }

      
      media-chrome-menu-item::part(checked-indicator) {
        display: var(--media-menu-item-checked-indicator-display, none);
      }
    </style>
    <div id="container" part="container">
      <slot name="header" hidden>
        <button part="back button" aria-label="Back to previous menu">
          <slot name="back-icon">
            <svg aria-hidden="true" viewBox="0 0 20 24" part="back indicator">
              <path d="m11.88 17.585.742-.669-4.2-4.665 4.2-4.666-.743-.669-4.803 5.335 4.803 5.334Z"/>
            </svg>
          </slot>
          <slot name="title"></slot>
        </button>
      </slot>
      <slot></slot>
    </div>
    <slot name="checked-indicator" hidden></slot>
  `}const ea={STYLE:"style",HIDDEN:"hidden",DISABLED:"disabled",ANCHOR:"anchor"};class gt extends g.HTMLElement{constructor(){if(super(),ie(this,Xd),ie(this,Zo),ie(this,mo),ie(this,eu),ie(this,tu),ie(this,iu),ie(this,Er),ie(this,Jo),ie(this,au),ie(this,Nc),ie(this,ru),ie(this,Pc),ie(this,nu),ie(this,su),ie(this,Sn),ie(this,ou),ie(this,In),ie(this,po),ie(this,Qt,null),ie(this,Ki,null),ie(this,gi,null),ie(this,ho,new Set),ie(this,mn,void 0),ie(this,ya,!1),ie(this,qn,null),ie(this,Xo,()=>{const e=Z(this,ho),i=new Set(this.items);for(const a of e)i.has(a)||this.dispatchEvent(new CustomEvent("removemenuitem",{detail:a}));for(const a of i)e.has(a)||this.dispatchEvent(new CustomEvent("addmenuitem",{detail:a}));vt(this,ho,i)}),ie(this,vr,()=>{ae(this,Er,Yn).call(this),ae(this,Jo,Oc).call(this,!1)}),ie(this,fr,()=>{ae(this,Er,Yn).call(this)}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=lt(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}this.container=this.shadowRoot.querySelector("#container"),this.defaultSlot=this.shadowRoot.querySelector("slot:not([name])"),vt(this,mn,new MutationObserver(Z(this,Xo)))}static get observedAttributes(){return[ea.DISABLED,ea.HIDDEN,ea.STYLE,ea.ANCHOR,X.MEDIA_CONTROLLER]}static formatMenuItemText(e,i){return e}enable(){this.addEventListener("click",this),this.addEventListener("focusout",this),this.addEventListener("keydown",this),this.addEventListener("invoke",this),this.addEventListener("toggle",this)}disable(){this.removeEventListener("click",this),this.removeEventListener("focusout",this),this.removeEventListener("keyup",this),this.removeEventListener("invoke",this),this.removeEventListener("toggle",this)}handleEvent(e){switch(e.type){case"slotchange":ae(this,Xd,Ef).call(this,e);break;case"invoke":ae(this,eu,_f).call(this,e);break;case"click":ae(this,au,yf).call(this,e);break;case"toggle":ae(this,ru,Af).call(this,e);break;case"focusout":ae(this,nu,wf).call(this,e);break;case"keydown":ae(this,su,Sf).call(this,e);break}}connectedCallback(){var e,i;Z(this,mn).observe(this.defaultSlot,{childList:!0}),vt(this,qn,Yu(this.shadowRoot,":host")),ae(this,mo,Jd).call(this),this.hasAttribute("disabled")||this.enable(),this.role||(this.role="menu"),vt(this,Qt,yd(this)),(i=(e=Z(this,Qt))==null?void 0:e.associateElement)==null||i.call(e,this),this.hidden||(Tr(Gn(this),Z(this,vr)),Tr(this,Z(this,fr))),ae(this,Zo,xc).call(this),this.shadowRoot.addEventListener("slotchange",this)}disconnectedCallback(){var e,i;Z(this,mn).disconnect(),Ar(Gn(this),Z(this,vr)),Ar(this,Z(this,fr)),this.disable(),(i=(e=Z(this,Qt))==null?void 0:e.unassociateElement)==null||i.call(e,this),vt(this,Qt,null),vt(this,Ki,null),vt(this,gi,null),this.shadowRoot.removeEventListener("slotchange",this)}attributeChangedCallback(e,i,a){var r,n,s,o;e===ea.HIDDEN&&a!==i?(Z(this,ya)||vt(this,ya,!0),this.hidden?ae(this,iu,gf).call(this):ae(this,tu,bf).call(this),this.dispatchEvent(new VT({oldState:this.hidden?"open":"closed",newState:this.hidden?"closed":"open",bubbles:!0}))):e===X.MEDIA_CONTROLLER?(i&&((n=(r=Z(this,Qt))==null?void 0:r.unassociateElement)==null||n.call(r,this),vt(this,Qt,null)),a&&this.isConnected&&(vt(this,Qt,yd(this)),(o=(s=Z(this,Qt))==null?void 0:s.associateElement)==null||o.call(s,this))):e===ea.DISABLED&&a!==i?a==null?this.enable():this.disable():e===ea.STYLE&&a!==i&&ae(this,mo,Jd).call(this)}formatMenuItemText(e,i){return this.constructor.formatMenuItemText(e,i)}get anchor(){return this.getAttribute("anchor")}set anchor(e){this.setAttribute("anchor",`${e}`)}get anchorElement(){var e;return this.anchor?(e=fl(this))==null?void 0:e.querySelector(`#${this.anchor}`):null}get items(){return this.defaultSlot.assignedElements({flatten:!0}).filter(YT)}get radioGroupItems(){return this.items.filter(e=>e.role==="menuitemradio")}get checkedItems(){return this.items.filter(e=>e.checked)}get value(){var e,i;return(i=(e=this.checkedItems[0])==null?void 0:e.value)!=null?i:""}set value(e){const i=this.items.find(a=>a.value===e);i&&ae(this,po,lu).call(this,i)}focus(){if(vt(this,Ki,qu()),this.items.length){ae(this,In,tl).call(this,this.items[0]),this.items[0].focus();return}const e=this.querySelector('[autofocus], [tabindex]:not([tabindex="-1"]), [role="menu"]');e==null||e.focus()}handleSelect(e){var i;const a=ae(this,Sn,el).call(this,e);a&&(ae(this,po,lu).call(this,a,a.type==="checkbox"),Z(this,gi)&&!this.hidden&&((i=Z(this,Ki))==null||i.focus(),this.hidden=!0))}get keysUsed(){return["Enter","Escape","Tab"," ","ArrowDown","ArrowUp","Home","End"]}handleMove(e){var i,a;const{key:r}=e,n=this.items,s=(a=(i=ae(this,Sn,el).call(this,e))!=null?i:ae(this,ou,If).call(this))!=null?a:n[0],o=n.indexOf(s);let l=Math.max(0,o);r==="ArrowDown"?l++:r==="ArrowUp"?l--:e.key==="Home"?l=0:e.key==="End"&&(l=n.length-1),l<0&&(l=n.length-1),l>n.length-1&&(l=0),ae(this,In,tl).call(this,n[l]),n[l].focus()}}Qt=new WeakMap;Ki=new WeakMap;gi=new WeakMap;ho=new WeakMap;mn=new WeakMap;ya=new WeakMap;qn=new WeakMap;Xd=new WeakSet;Ef=function(t){const e=t.target;for(const i of e.assignedNodes({flatten:!0}))i.nodeType===3&&i.textContent.trim()===""&&i.remove();["header","title"].includes(e.name)&&ae(this,Zo,xc).call(this),e.name||Z(this,Xo).call(this)};Zo=new WeakSet;xc=function(){const t=this.shadowRoot.querySelector('slot[name="header"]'),e=this.shadowRoot.querySelector('slot[name="title"]');t.hidden=e.assignedNodes().length===0&&t.assignedNodes().length===0};Xo=new WeakMap;mo=new WeakSet;Jd=function(){var t;const e=this.shadowRoot.querySelector("#layout-row"),i=(t=getComputedStyle(this).getPropertyValue("--media-menu-layout"))==null?void 0:t.trim();e.setAttribute("media",i==="row"?"":"width:0")};eu=new WeakSet;_f=function(t){vt(this,gi,t.relatedTarget),Ai(this,t.relatedTarget)||(this.hidden=!this.hidden)};tu=new WeakSet;bf=function(){var t;(t=Z(this,gi))==null||t.setAttribute("aria-expanded","true"),this.addEventListener("transitionend",()=>this.focus(),{once:!0}),Tr(Gn(this),Z(this,vr)),Tr(this,Z(this,fr))};iu=new WeakSet;gf=function(){var t;(t=Z(this,gi))==null||t.setAttribute("aria-expanded","false"),Ar(Gn(this),Z(this,vr)),Ar(this,Z(this,fr))};vr=new WeakMap;fr=new WeakMap;Er=new WeakSet;Yn=function(t){if(this.hasAttribute("mediacontroller")&&!this.anchor||this.hidden||!this.anchorElement)return;const{x:e,y:i}=HT({anchor:this.anchorElement,floating:this,placement:"top-start"});t??(t=this.offsetWidth);const r=Gn(this).getBoundingClientRect(),n=r.width-e-t,s=r.height-i-this.offsetHeight,{style:o}=Z(this,qn);o.setProperty("position","absolute"),o.setProperty("right",`${Math.max(0,n)}px`),o.setProperty("--_menu-bottom",`${s}px`);const l=getComputedStyle(this),p=o.getPropertyValue("--_menu-bottom")===l.bottom?s:parseFloat(l.bottom),m=r.height-p-parseFloat(l.marginBottom);this.style.setProperty("--_menu-max-height",`${m}px`)};Jo=new WeakSet;Oc=function(t){const e=this.querySelector('[role="menuitem"][aria-haspopup][aria-expanded="true"]'),i=e==null?void 0:e.querySelector('[role="menu"]'),{style:a}=Z(this,qn);if(t||a.setProperty("--media-menu-transition-in","none"),i){const r=i.offsetHeight,n=Math.max(i.offsetWidth,e.offsetWidth);this.style.setProperty("min-width",`${n}px`),this.style.setProperty("min-height",`${r}px`),ae(this,Er,Yn).call(this,n)}else this.style.removeProperty("min-width"),this.style.removeProperty("min-height"),ae(this,Er,Yn).call(this);a.removeProperty("--media-menu-transition-in")};au=new WeakSet;yf=function(t){var e;if(t.stopPropagation(),t.composedPath().includes(Z(this,Nc,Tf))){(e=Z(this,Ki))==null||e.focus(),this.hidden=!0;return}const i=ae(this,Sn,el).call(this,t);!i||i.hasAttribute("disabled")||(ae(this,In,tl).call(this,i),this.handleSelect(t))};Nc=new WeakSet;Tf=function(){var t;return(t=this.shadowRoot.querySelector('slot[name="header"]').assignedElements({flatten:!0}))==null?void 0:t.find(i=>i.matches('button[part~="back"]'))};ru=new WeakSet;Af=function(t){if(t.target===this)return;ae(this,Pc,kf).call(this);const e=Array.from(this.querySelectorAll('[role="menuitem"][aria-haspopup]'));for(const i of e)i.invokeTargetElement!=t.target&&t.newState=="open"&&i.getAttribute("aria-expanded")=="true"&&!i.invokeTargetElement.hidden&&i.invokeTargetElement.dispatchEvent(new Dc({relatedTarget:i}));for(const i of e)i.setAttribute("aria-expanded",`${!i.submenuElement.hidden}`);ae(this,Jo,Oc).call(this,!0)};Pc=new WeakSet;kf=function(){const e=this.querySelector('[role="menuitem"] > [role="menu"]:not([hidden])');this.container.classList.toggle("has-expanded",!!e)};nu=new WeakSet;wf=function(t){var e;Ai(this,t.relatedTarget)||(Z(this,ya)&&((e=Z(this,Ki))==null||e.focus()),Z(this,gi)&&Z(this,gi)!==t.relatedTarget&&!this.hidden&&(this.hidden=!0))};su=new WeakSet;Sf=function(t){var e,i,a,r,n;const{key:s,ctrlKey:o,altKey:l,metaKey:c}=t;if(!(o||l||c)&&this.keysUsed.includes(s))if(t.preventDefault(),t.stopPropagation(),s==="Tab"){if(Z(this,ya)){this.hidden=!0;return}t.shiftKey?(i=(e=this.previousElementSibling)==null?void 0:e.focus)==null||i.call(e):(r=(a=this.nextElementSibling)==null?void 0:a.focus)==null||r.call(a),this.blur()}else s==="Escape"?((n=Z(this,Ki))==null||n.focus(),Z(this,ya)&&(this.hidden=!0)):s==="Enter"||s===" "?this.handleSelect(t):this.handleMove(t)};Sn=new WeakSet;el=function(t){return t.composedPath().find(e=>["menuitemradio","menuitemcheckbox"].includes(e.role))};ou=new WeakSet;If=function(){return this.items.find(t=>t.tabIndex===0)};In=new WeakSet;tl=function(t){for(const e of this.items)e.tabIndex=e===t?0:-1};po=new WeakSet;lu=function(t,e){const i=[...this.checkedItems];t.type==="radio"&&this.radioGroupItems.forEach(a=>a.checked=!1),e?t.checked=!t.checked:t.checked=!0,this.checkedItems.some((a,r)=>a!=i[r])&&this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))};gt.shadowRootOptions={mode:"open"};gt.getTemplateHTML=qT;function YT(t){return["menuitem","menuitemradio","menuitemcheckbox"].includes(t==null?void 0:t.role)}function Gn(t){var e;return(e=t.getAttribute("bounds")?Rr(t,`#${t.getAttribute("bounds")}`):Xe(t)||t.parentElement)!=null?e:t}g.customElements.get("media-chrome-menu")||g.customElements.define("media-chrome-menu",gt);var $c=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},ze=(t,e,i)=>($c(t,e,"read from private field"),i?i.call(t):e.get(t)),di=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Xl=(t,e,i,a)=>($c(t,e,"write to private field"),e.set(t,i),i),lr=(t,e,i)=>($c(t,e,"access private method"),i),vo,Rn,du,Rf,il,Uc,Hc,Lf,ii,Ja,uu,fo,cu;function GT(t){return`
    <style>
      :host {
        transition: var(--media-menu-item-transition,
          background .15s linear,
          opacity .2s ease-in-out
        );
        outline: var(--media-menu-item-outline, 0);
        outline-offset: var(--media-menu-item-outline-offset, -1px);
        cursor: var(--media-cursor, pointer);
        display: flex;
        align-items: center;
        align-self: stretch;
        justify-self: stretch;
        white-space: nowrap;
        white-space-collapse: collapse;
        text-wrap: nowrap;
        padding: .4em .8em .4em 1em;
      }

      :host(:focus-visible) {
        box-shadow: var(--media-menu-item-focus-shadow, inset 0 0 0 2px rgb(27 127 204 / .9));
        outline: var(--media-menu-item-hover-outline, 0);
        outline-offset: var(--media-menu-item-hover-outline-offset,  var(--media-menu-item-outline-offset, -1px));
      }

      :host(:hover) {
        cursor: var(--media-cursor, pointer);
        background: var(--media-menu-item-hover-background, rgb(92 92 102 / .5));
        outline: var(--media-menu-item-hover-outline);
        outline-offset: var(--media-menu-item-hover-outline-offset,  var(--media-menu-item-outline-offset, -1px));
      }

      :host([aria-checked="true"]) {
        background: var(--media-menu-item-checked-background);
      }

      :host([hidden]) {
        display: none;
      }

      :host([disabled]) {
        pointer-events: none;
        color: rgba(255, 255, 255, .3);
      }

      slot:not([name]) {
        width: 100%;
      }

      slot:not([name="submenu"]) {
        display: inline-flex;
        align-items: center;
        transition: inherit;
        opacity: var(--media-menu-item-opacity, 1);
      }

      slot[name="description"] {
        justify-content: end;
      }

      slot[name="description"] > span {
        display: inline-block;
        margin-inline: 1em .2em;
        max-width: var(--media-menu-item-description-max-width, 100px);
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: .8em;
        font-weight: 400;
        text-align: right;
        position: relative;
        top: .04em;
      }

      slot[name="checked-indicator"] {
        display: none;
      }

      :host(:is([role="menuitemradio"],[role="menuitemcheckbox"])) slot[name="checked-indicator"] {
        display: var(--media-menu-item-checked-indicator-display, inline-block);
      }

      
      svg, img, ::slotted(svg), ::slotted(img) {
        height: var(--media-menu-item-icon-height, var(--media-control-height, 24px));
        fill: var(--media-icon-color, var(--media-primary-color, rgb(238 238 238)));
        display: block;
      }

      
      [part~="indicator"],
      ::slotted([part~="indicator"]) {
        fill: var(--media-menu-item-indicator-fill,
          var(--media-icon-color, var(--media-primary-color, rgb(238 238 238))));
        height: var(--media-menu-item-indicator-height, 1.25em);
        margin-right: .5ch;
      }

      [part~="checked-indicator"] {
        visibility: hidden;
      }

      :host([aria-checked="true"]) [part~="checked-indicator"] {
        visibility: visible;
      }
    </style>
    <slot name="checked-indicator">
      <svg aria-hidden="true" viewBox="0 1 24 24" part="checked-indicator indicator">
        <path d="m10 15.17 9.193-9.191 1.414 1.414-10.606 10.606-6.364-6.364 1.414-1.414 4.95 4.95Z"/>
      </svg>
    </slot>
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="description"></slot>
    <slot name="suffix">
      ${this.getSuffixSlotInnerHTML(t)}
    </slot>
    <slot name="submenu"></slot>
  `}function zT(t){return""}const ht={TYPE:"type",VALUE:"value",CHECKED:"checked",DISABLED:"disabled"};class zi extends g.HTMLElement{constructor(){if(super(),di(this,du),di(this,il),di(this,Hc),di(this,fo),di(this,vo,!1),di(this,Rn,void 0),di(this,ii,()=>{var e,i;this.submenuElement.items&&this.setAttribute("submenusize",`${this.submenuElement.items.length}`);const a=this.shadowRoot.querySelector('slot[name="description"]'),r=(e=this.submenuElement.checkedItems)==null?void 0:e[0],n=(i=r==null?void 0:r.dataset.description)!=null?i:r==null?void 0:r.text,s=ke.createElement("span");s.textContent=n??"",a.replaceChildren(s)}),di(this,Ja,e=>{const{key:i}=e;if(!this.keysUsed.includes(i)){this.removeEventListener("keyup",ze(this,Ja));return}this.handleClick(e)}),di(this,uu,e=>{const{metaKey:i,altKey:a,key:r}=e;if(i||a||!this.keysUsed.includes(r)){this.removeEventListener("keyup",ze(this,Ja));return}this.addEventListener("keyup",ze(this,Ja),{once:!0})}),!this.shadowRoot){this.attachShadow(this.constructor.shadowRootOptions);const e=lt(this.attributes);this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(e)}}static get observedAttributes(){return[ht.TYPE,ht.DISABLED,ht.CHECKED,ht.VALUE]}enable(){this.hasAttribute("tabindex")||this.setAttribute("tabindex","-1"),Kr(this)&&!this.hasAttribute("aria-checked")&&this.setAttribute("aria-checked","false"),this.addEventListener("click",this),this.addEventListener("keydown",this)}disable(){this.removeAttribute("tabindex"),this.removeEventListener("click",this),this.removeEventListener("keydown",this),this.removeEventListener("keyup",this)}handleEvent(e){switch(e.type){case"slotchange":lr(this,du,Rf).call(this,e);break;case"click":this.handleClick(e);break;case"keydown":ze(this,uu).call(this,e);break;case"keyup":ze(this,Ja).call(this,e);break}}attributeChangedCallback(e,i,a){e===ht.CHECKED&&Kr(this)&&!ze(this,vo)?this.setAttribute("aria-checked",a!=null?"true":"false"):e===ht.TYPE&&a!==i?this.role="menuitem"+a:e===ht.DISABLED&&a!==i&&(a==null?this.enable():this.disable())}connectedCallback(){this.hasAttribute(ht.DISABLED)||this.enable(),this.role="menuitem"+this.type,Xl(this,Rn,hu(this,this.parentNode)),lr(this,fo,cu).call(this),this.submenuElement&&lr(this,il,Uc).call(this),this.shadowRoot.addEventListener("slotchange",this)}disconnectedCallback(){this.disable(),lr(this,fo,cu).call(this),Xl(this,Rn,null),this.shadowRoot.removeEventListener("slotchange",this)}get invokeTarget(){return this.getAttribute("invoketarget")}set invokeTarget(e){this.setAttribute("invoketarget",`${e}`)}get invokeTargetElement(){var e;return this.invokeTarget?(e=fl(this))==null?void 0:e.querySelector(`#${this.invokeTarget}`):this.submenuElement}get submenuElement(){return this.shadowRoot.querySelector('slot[name="submenu"]').assignedElements({flatten:!0})[0]}get type(){var e;return(e=this.getAttribute(ht.TYPE))!=null?e:""}set type(e){this.setAttribute(ht.TYPE,`${e}`)}get value(){var e;return(e=this.getAttribute(ht.VALUE))!=null?e:this.text}set value(e){this.setAttribute(ht.VALUE,e)}get text(){var e;return((e=this.textContent)!=null?e:"").trim()}get checked(){if(Kr(this))return this.getAttribute("aria-checked")==="true"}set checked(e){Kr(this)&&(Xl(this,vo,!0),this.setAttribute("aria-checked",e?"true":"false"),e?this.part.add("checked"):this.part.remove("checked"))}handleClick(e){Kr(this)||this.invokeTargetElement&&Ai(this,e.target)&&this.invokeTargetElement.dispatchEvent(new Dc({relatedTarget:this}))}get keysUsed(){return["Enter"," "]}}vo=new WeakMap;Rn=new WeakMap;du=new WeakSet;Rf=function(t){const e=t.target;if(!(e!=null&&e.name))for(const a of e.assignedNodes({flatten:!0}))a instanceof Text&&a.textContent.trim()===""&&a.remove();e.name==="submenu"&&(this.submenuElement?lr(this,il,Uc).call(this):lr(this,Hc,Lf).call(this))};il=new WeakSet;Uc=async function(){this.setAttribute("aria-haspopup","menu"),this.setAttribute("aria-expanded",`${!this.submenuElement.hidden}`),this.submenuElement.addEventListener("change",ze(this,ii)),this.submenuElement.addEventListener("addmenuitem",ze(this,ii)),this.submenuElement.addEventListener("removemenuitem",ze(this,ii)),ze(this,ii).call(this)};Hc=new WeakSet;Lf=function(){this.removeAttribute("aria-haspopup"),this.removeAttribute("aria-expanded"),this.submenuElement.removeEventListener("change",ze(this,ii)),this.submenuElement.removeEventListener("addmenuitem",ze(this,ii)),this.submenuElement.removeEventListener("removemenuitem",ze(this,ii)),ze(this,ii).call(this)};ii=new WeakMap;Ja=new WeakMap;uu=new WeakMap;fo=new WeakSet;cu=function(){var t;const e=(t=ze(this,Rn))==null?void 0:t.radioGroupItems;if(!e)return;let i=e.filter(a=>a.getAttribute("aria-checked")==="true").pop();i||(i=e[0]);for(const a of e)a.setAttribute("aria-checked","false");i==null||i.setAttribute("aria-checked","true")};zi.shadowRootOptions={mode:"open"};zi.getTemplateHTML=GT;zi.getSuffixSlotInnerHTML=zT;function Kr(t){return t.type==="radio"||t.type==="checkbox"}function hu(t,e){if(!t)return null;const{host:i}=t.getRootNode();return!e&&i?hu(t,i):e!=null&&e.items?e:hu(e,e==null?void 0:e.parentNode)}g.customElements.get("media-chrome-menu-item")||g.customElements.define("media-chrome-menu-item",zi);function QT(t){return`
    ${gt.getTemplateHTML(t)}
    <style>
      :host {
        --_menu-bg: rgb(20 20 30 / .8);
        background: var(--media-settings-menu-background,
            var(--media-menu-background,
              var(--media-control-background,
                var(--media-secondary-color, var(--_menu-bg)))));
        min-width: var(--media-settings-menu-min-width, 170px);
        border-radius: 2px 2px 0 0;
        overflow: hidden;
      }

      @-moz-document url-prefix() {
        :host{
          --_menu-bg: rgb(20 20 30);
        }
      }

      :host([role="menu"]) {
        
        justify-content: end;
      }

      slot:not([name]) {
        justify-content: var(--media-settings-menu-justify-content);
        flex-direction: var(--media-settings-menu-flex-direction, column);
        overflow: visible;
      }

      #container.has-expanded {
        --media-settings-menu-item-opacity: 0;
      }
    </style>
  `}class Cf extends gt{get anchorElement(){return this.anchor!=="auto"?super.anchorElement:Xe(this).querySelector("media-settings-menu-button")}}Cf.getTemplateHTML=QT;g.customElements.get("media-settings-menu")||g.customElements.define("media-settings-menu",Cf);function jT(t){return`
    ${zi.getTemplateHTML.call(this,t)}
    <style>
      slot:not([name="submenu"]) {
        opacity: var(--media-settings-menu-item-opacity, var(--media-menu-item-opacity));
      }

      :host([aria-expanded="true"]:hover) {
        background: transparent;
      }
    </style>
  `}function ZT(t){return`
    <svg aria-hidden="true" viewBox="0 0 20 24">
      <path d="m8.12 17.585-.742-.669 4.2-4.665-4.2-4.666.743-.669 4.803 5.335-4.803 5.334Z"/>
    </svg>
  `}class Cl extends zi{}Cl.shadowRootOptions={mode:"open"};Cl.getTemplateHTML=jT;Cl.getSuffixSlotInnerHTML=ZT;g.customElements.get("media-settings-menu-item")||g.customElements.define("media-settings-menu-item",Cl);class Mr extends Ne{connectedCallback(){super.connectedCallback(),this.invokeTargetElement&&this.setAttribute("aria-haspopup","menu")}get invokeTarget(){return this.getAttribute("invoketarget")}set invokeTarget(e){this.setAttribute("invoketarget",`${e}`)}get invokeTargetElement(){var e;return this.invokeTarget?(e=fl(this))==null?void 0:e.querySelector(`#${this.invokeTarget}`):null}handleClick(){var e;(e=this.invokeTargetElement)==null||e.dispatchEvent(new Dc({relatedTarget:this}))}}g.customElements.get("media-chrome-menu-button")||g.customElements.define("media-chrome-menu-button",Mr);function XT(){return`
    <style>
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M4.5 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm7.5 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
      </svg>
    </slot>
  `}function JT(){return C("Settings")}class Bc extends Mr{static get observedAttributes(){return[...super.observedAttributes,"target"]}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-label",C("settings"))}get invokeTargetElement(){return this.invokeTarget!=null?super.invokeTargetElement:Xe(this).querySelector("media-settings-menu")}}Bc.getSlotTemplateHTML=XT;Bc.getTooltipContentHTML=JT;g.customElements.get("media-settings-menu-button")||g.customElements.define("media-settings-menu-button",Bc);var Wc=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Df=(t,e,i)=>(Wc(t,e,"read from private field"),i?i.call(t):e.get(t)),fs=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},mu=(t,e,i,a)=>(Wc(t,e,"write to private field"),e.set(t,i),i),Es=(t,e,i)=>(Wc(t,e,"access private method"),i),pn,al,Eo,pu,_o,vu;class eA extends gt{constructor(){super(...arguments),fs(this,Eo),fs(this,_o),fs(this,pn,[]),fs(this,al,void 0)}static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_AUDIO_TRACK_LIST,h.MEDIA_AUDIO_TRACK_ENABLED,h.MEDIA_AUDIO_TRACK_UNAVAILABLE]}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===h.MEDIA_AUDIO_TRACK_ENABLED&&i!==a?this.value=a:e===h.MEDIA_AUDIO_TRACK_LIST&&i!==a&&(mu(this,pn,N0(a??"")),Es(this,Eo,pu).call(this))}connectedCallback(){super.connectedCallback(),this.addEventListener("change",Es(this,_o,vu))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",Es(this,_o,vu))}get anchorElement(){var e;return this.anchor!=="auto"?super.anchorElement:(e=Xe(this))==null?void 0:e.querySelector("media-audio-track-menu-button")}get mediaAudioTrackList(){return Df(this,pn)}set mediaAudioTrackList(e){mu(this,pn,e),Es(this,Eo,pu).call(this)}get mediaAudioTrackEnabled(){var e;return(e=ce(this,h.MEDIA_AUDIO_TRACK_ENABLED))!=null?e:""}set mediaAudioTrackEnabled(e){oe(this,h.MEDIA_AUDIO_TRACK_ENABLED,e)}}pn=new WeakMap;al=new WeakMap;Eo=new WeakSet;pu=function(){if(Df(this,al)===JSON.stringify(this.mediaAudioTrackList))return;mu(this,al,JSON.stringify(this.mediaAudioTrackList));const t=this.mediaAudioTrackList;this.defaultSlot.textContent="",t.sort((e,i)=>e.id.localeCompare(i.id,void 0,{numeric:!0}));for(const e of t){const i=this.formatMenuItemText(e.label,e),a=Sr({type:"radio",text:i,value:`${e.id}`,checked:e.enabled});a.prepend(Ta(this,"checked-indicator")),this.defaultSlot.append(a)}};_o=new WeakSet;vu=function(){if(this.value==null)return;const t=new g.CustomEvent(D.MEDIA_AUDIO_TRACK_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(t)};g.customElements.get("media-audio-track-menu")||g.customElements.define("media-audio-track-menu",eA);const tA=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M11 17H9.5V7H11v10Zm-3-3H6.5v-4H8v4Zm6-5h-1.5v6H14V9Zm3 7h-1.5V8H17v8Z"/>
  <path d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-2 0a8 8 0 1 0-16 0 8 8 0 0 0 16 0Z"/>
</svg>`;function iA(){return`
    <style>
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">${tA}</slot>
  `}function aA(){return C("Audio")}const Am=t=>{const e=C("Audio");t.setAttribute("aria-label",e)};class Fc extends Mr{static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_AUDIO_TRACK_ENABLED,h.MEDIA_AUDIO_TRACK_UNAVAILABLE]}connectedCallback(){super.connectedCallback(),Am(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===h.MEDIA_LANG&&Am(this)}get invokeTargetElement(){var e;return this.invokeTarget!=null?super.invokeTargetElement:(e=Xe(this))==null?void 0:e.querySelector("media-audio-track-menu")}get mediaAudioTrackEnabled(){var e;return(e=ce(this,h.MEDIA_AUDIO_TRACK_ENABLED))!=null?e:""}set mediaAudioTrackEnabled(e){oe(this,h.MEDIA_AUDIO_TRACK_ENABLED,e)}}Fc.getSlotTemplateHTML=iA;Fc.getTooltipContentHTML=aA;g.customElements.get("media-audio-track-menu-button")||g.customElements.define("media-audio-track-menu-button",Fc);var Kc=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},rA=(t,e,i)=>(Kc(t,e,"read from private field"),e.get(t)),Jl=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},nA=(t,e,i,a)=>(Kc(t,e,"write to private field"),e.set(t,i),i),_s=(t,e,i)=>(Kc(t,e,"access private method"),i),rl,bo,fu,go,Eu;const sA=`
  <svg aria-hidden="true" viewBox="0 0 26 24" part="captions-indicator indicator">
    <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
  </svg>`;function oA(t){return`
    ${gt.getTemplateHTML(t)}
    <slot name="captions-indicator" hidden>${sA}</slot>
  `}class Mf extends gt{constructor(){super(...arguments),Jl(this,bo),Jl(this,go),Jl(this,rl,void 0)}static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_SUBTITLES_LIST,h.MEDIA_SUBTITLES_SHOWING]}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===h.MEDIA_SUBTITLES_LIST&&i!==a?_s(this,bo,fu).call(this):e===h.MEDIA_SUBTITLES_SHOWING&&i!==a&&(this.value=a||"",_s(this,bo,fu).call(this))}connectedCallback(){super.connectedCallback(),this.addEventListener("change",_s(this,go,Eu))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",_s(this,go,Eu))}get anchorElement(){return this.anchor!=="auto"?super.anchorElement:Xe(this).querySelector("media-captions-menu-button")}get mediaSubtitlesList(){return km(this,h.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){wm(this,h.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return km(this,h.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){wm(this,h.MEDIA_SUBTITLES_SHOWING,e)}}rl=new WeakMap;bo=new WeakSet;fu=function(){var t;const e=rA(this,rl)!==JSON.stringify(this.mediaSubtitlesList),i=this.value!==this.getAttribute(h.MEDIA_SUBTITLES_SHOWING);if(!e&&!i)return;nA(this,rl,JSON.stringify(this.mediaSubtitlesList)),this.defaultSlot.textContent="";const a=!this.value,r=Sr({type:"radio",text:this.formatMenuItemText(C("Off")),value:"off",checked:a});r.prepend(Ta(this,"checked-indicator")),this.defaultSlot.append(r);const n=this.mediaSubtitlesList;for(const s of n){const o=Sr({type:"radio",text:this.formatMenuItemText(s.label,s),value:wd(s),checked:this.value==wd(s)});o.prepend(Ta(this,"checked-indicator")),((t=s.kind)!=null?t:"subs")==="captions"&&o.append(Ta(this,"captions-indicator")),this.defaultSlot.append(o)}};go=new WeakSet;Eu=function(){const t=this.mediaSubtitlesShowing,e=this.getAttribute(h.MEDIA_SUBTITLES_SHOWING),i=this.value!==e;if(t!=null&&t.length&&i&&this.dispatchEvent(new g.CustomEvent(D.MEDIA_DISABLE_SUBTITLES_REQUEST,{composed:!0,bubbles:!0,detail:t})),!this.value||!i)return;const a=new g.CustomEvent(D.MEDIA_SHOW_SUBTITLES_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(a)};Mf.getTemplateHTML=oA;const km=(t,e)=>{const i=t.getAttribute(e);return i?yl(i):[]},wm=(t,e,i)=>{if(!(i!=null&&i.length)){t.removeAttribute(e);return}const a=Bn(i);t.getAttribute(e)!==a&&t.setAttribute(e,a)};g.customElements.get("media-captions-menu")||g.customElements.define("media-captions-menu",Mf);const lA=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`,dA=`<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`;function uA(){return`
    <style>
      :host([data-captions-enabled="true"]) slot[name=off] {
        display: none !important;
      }

      
      :host(:not([data-captions-enabled="true"])) slot[name=on] {
        display: none !important;
      }

      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>

    <slot name="icon">
      <slot name="on">${lA}</slot>
      <slot name="off">${dA}</slot>
    </slot>
  `}function cA(){return C("Captions")}const Sm=t=>{t.setAttribute("data-captions-enabled",fv(t).toString())},Im=t=>{t.setAttribute("aria-label",C("closed captions"))};class Vc extends Mr{static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_SUBTITLES_LIST,h.MEDIA_SUBTITLES_SHOWING,h.MEDIA_LANG]}connectedCallback(){super.connectedCallback(),Im(this),Sm(this)}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===h.MEDIA_SUBTITLES_SHOWING?Sm(this):e===h.MEDIA_LANG&&Im(this)}get invokeTargetElement(){var e;return this.invokeTarget!=null?super.invokeTargetElement:(e=Xe(this))==null?void 0:e.querySelector("media-captions-menu")}get mediaSubtitlesList(){return Rm(this,h.MEDIA_SUBTITLES_LIST)}set mediaSubtitlesList(e){Lm(this,h.MEDIA_SUBTITLES_LIST,e)}get mediaSubtitlesShowing(){return Rm(this,h.MEDIA_SUBTITLES_SHOWING)}set mediaSubtitlesShowing(e){Lm(this,h.MEDIA_SUBTITLES_SHOWING,e)}}Vc.getSlotTemplateHTML=uA;Vc.getTooltipContentHTML=cA;const Rm=(t,e)=>{const i=t.getAttribute(e);return i?yl(i):[]},Lm=(t,e,i)=>{if(!(i!=null&&i.length)){t.removeAttribute(e);return}const a=Bn(i);t.getAttribute(e)!==a&&t.setAttribute(e,a)};g.customElements.get("media-captions-menu-button")||g.customElements.define("media-captions-menu-button",Vc);var xf=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},er=(t,e,i)=>(xf(t,e,"read from private field"),i?i.call(t):e.get(t)),ed=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},xa=(t,e,i)=>(xf(t,e,"access private method"),i),Ui,tr,vn,yo,_u;const td={RATES:"rates"};class hA extends gt{constructor(){super(),ed(this,tr),ed(this,yo),ed(this,Ui,new Qu(this,td.RATES,{defaultValue:zv})),xa(this,tr,vn).call(this)}static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_PLAYBACK_RATE,td.RATES]}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===h.MEDIA_PLAYBACK_RATE&&i!=a?(this.value=a,xa(this,tr,vn).call(this)):e===td.RATES&&i!=a&&(er(this,Ui).value=a,xa(this,tr,vn).call(this))}connectedCallback(){super.connectedCallback(),this.addEventListener("change",xa(this,yo,_u))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",xa(this,yo,_u))}get anchorElement(){return this.anchor!=="auto"?super.anchorElement:Xe(this).querySelector("media-playback-rate-menu-button")}get rates(){return er(this,Ui)}set rates(e){e?Array.isArray(e)?er(this,Ui).value=e.join(" "):typeof e=="string"&&(er(this,Ui).value=e):er(this,Ui).value="",xa(this,tr,vn).call(this)}get mediaPlaybackRate(){return se(this,h.MEDIA_PLAYBACK_RATE,or)}set mediaPlaybackRate(e){ve(this,h.MEDIA_PLAYBACK_RATE,e)}}Ui=new WeakMap;tr=new WeakSet;vn=function(){this.defaultSlot.textContent="";const t=this.mediaPlaybackRate,e=new Set(Array.from(er(this,Ui)).map(a=>Number(a)));t>0&&!e.has(t)&&e.add(t);const i=Array.from(e).sort((a,r)=>a-r);for(const a of i){const r=Sr({type:"radio",text:this.formatMenuItemText(`${a}x`,a),value:a.toString(),checked:t===a});r.prepend(Ta(this,"checked-indicator")),this.defaultSlot.append(r)}};yo=new WeakSet;_u=function(){if(!this.value)return;const t=new g.CustomEvent(D.MEDIA_PLAYBACK_RATE_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(t)};g.customElements.get("media-playback-rate-menu")||g.customElements.define("media-playback-rate-menu",hA);const To=1;function mA(t){return`
    <style>
      :host {
        min-width: 5ch;
        padding: var(--media-button-padding, var(--media-control-padding, 10px 5px));
      }
      
      :host([aria-expanded="true"]) slot {
        display: block;
      }

      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">${t.mediaplaybackrate||To}x</slot>
  `}function pA(){return C("Playback rate")}class qc extends Mr{static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_PLAYBACK_RATE]}constructor(){var e;super(),this.container=this.shadowRoot.querySelector('slot[name="icon"]'),this.container.innerHTML=`${(e=this.mediaPlaybackRate)!=null?e:To}x`}attributeChangedCallback(e,i,a){if(super.attributeChangedCallback(e,i,a),e===h.MEDIA_PLAYBACK_RATE){const r=a?+a:Number.NaN,n=Number.isNaN(r)?To:r;this.container.innerHTML=`${n}x`,this.setAttribute("aria-label",C("Playback rate {playbackRate}",{playbackRate:n}))}}get invokeTargetElement(){return this.invokeTarget!=null?super.invokeTargetElement:Xe(this).querySelector("media-playback-rate-menu")}get mediaPlaybackRate(){return se(this,h.MEDIA_PLAYBACK_RATE,To)}set mediaPlaybackRate(e){ve(this,h.MEDIA_PLAYBACK_RATE,e)}}qc.getSlotTemplateHTML=mA;qc.getTooltipContentHTML=pA;g.customElements.get("media-playback-rate-menu-button")||g.customElements.define("media-playback-rate-menu-button",qc);var Yc=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},fn=(t,e,i)=>(Yc(t,e,"read from private field"),i?i.call(t):e.get(t)),bs=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Cm=(t,e,i,a)=>(Yc(t,e,"write to private field"),e.set(t,i),i),Oa=(t,e,i)=>(Yc(t,e,"access private method"),i),En,dr,ir,_n,Ao,bu;class vA extends gt{constructor(){super(...arguments),bs(this,ir),bs(this,Ao),bs(this,En,[]),bs(this,dr,{})}static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_RENDITION_LIST,h.MEDIA_RENDITION_SELECTED,h.MEDIA_RENDITION_UNAVAILABLE,h.MEDIA_HEIGHT]}static formatMenuItemText(e,i){return super.formatMenuItemText(e,i)}static formatRendition(e,{showBitrate:i=!1}={}){const a=`${Math.min(e.width,e.height)}p`;if(i&&e.bitrate){const r=e.bitrate/1e6,n=`${r.toFixed(r<1?1:0)} Mbps`;return`${a} (${n})`}return this.formatMenuItemText(a,e)}static compareRendition(e,i){var a,r;return i.height===e.height?((a=i.bitrate)!=null?a:0)-((r=e.bitrate)!=null?r:0):i.height-e.height}attributeChangedCallback(e,i,a){super.attributeChangedCallback(e,i,a),e===h.MEDIA_RENDITION_SELECTED&&i!==a?(this.value=a??"auto",Oa(this,ir,_n).call(this)):e===h.MEDIA_RENDITION_LIST&&i!==a?(Cm(this,En,D0(a)),Oa(this,ir,_n).call(this)):e===h.MEDIA_HEIGHT&&i!==a&&Oa(this,ir,_n).call(this)}connectedCallback(){super.connectedCallback(),this.addEventListener("change",Oa(this,Ao,bu))}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("change",Oa(this,Ao,bu))}get anchorElement(){return this.anchor!=="auto"?super.anchorElement:Xe(this).querySelector("media-rendition-menu-button")}get mediaRenditionList(){return fn(this,En)}set mediaRenditionList(e){Cm(this,En,e),Oa(this,ir,_n).call(this)}get mediaRenditionSelected(){return ce(this,h.MEDIA_RENDITION_SELECTED)}set mediaRenditionSelected(e){oe(this,h.MEDIA_RENDITION_SELECTED,e)}get mediaHeight(){return se(this,h.MEDIA_HEIGHT)}set mediaHeight(e){ve(this,h.MEDIA_HEIGHT,e)}compareRendition(e,i){return this.constructor.compareRendition(e,i)}formatMenuItemText(e,i){return this.constructor.formatMenuItemText(e,i)}formatRendition(e,i){return this.constructor.formatRendition(e,i)}showRenditionBitrate(e){return this.mediaRenditionList.some(i=>i!==e&&i.height===e.height&&i.bitrate!==e.bitrate)}}En=new WeakMap;dr=new WeakMap;ir=new WeakSet;_n=function(){if(fn(this,dr).mediaRenditionList===JSON.stringify(this.mediaRenditionList)&&fn(this,dr).mediaHeight===this.mediaHeight)return;fn(this,dr).mediaRenditionList=JSON.stringify(this.mediaRenditionList),fn(this,dr).mediaHeight=this.mediaHeight;const t=this.mediaRenditionList.sort(this.compareRendition.bind(this)),e=t.find(s=>s.id===this.mediaRenditionSelected);for(const s of t)s.selected=s===e;this.defaultSlot.textContent="";const i=!this.mediaRenditionSelected;for(const s of t){const o=this.formatRendition(s,{showBitrate:this.showRenditionBitrate(s)}),l=Sr({type:"radio",text:o,value:`${s.id}`,checked:s.selected&&!i});l.prepend(Ta(this,"checked-indicator")),this.defaultSlot.append(l)}const a=e&&this.showRenditionBitrate(e),r=i?e?this.formatMenuItemText(`${C("Auto")} • ${this.formatRendition(e,{showBitrate:a})}`,e):this.formatMenuItemText(`${C("Auto")} (${this.mediaHeight}p)`):this.formatMenuItemText(C("Auto")),n=Sr({type:"radio",text:r,value:"auto",checked:i});n.dataset.description=r,n.prepend(Ta(this,"checked-indicator")),this.defaultSlot.append(n)};Ao=new WeakSet;bu=function(){if(this.value==null)return;const t=new g.CustomEvent(D.MEDIA_RENDITION_REQUEST,{composed:!0,bubbles:!0,detail:this.value});this.dispatchEvent(t)};g.customElements.get("media-rendition-menu")||g.customElements.define("media-rendition-menu",vA);const fA=`<svg aria-hidden="true" viewBox="0 0 24 24">
  <path d="M13.5 2.5h2v6h-2v-2h-11v-2h11v-2Zm4 2h4v2h-4v-2Zm-12 4h2v6h-2v-2h-3v-2h3v-2Zm4 2h12v2h-12v-2Zm1 4h2v6h-2v-2h-8v-2h8v-2Zm4 2h7v2h-7v-2Z" />
</svg>`;function EA(){return`
    <style>
      :host([aria-expanded="true"]) slot[name=tooltip] {
        display: none;
      }
    </style>
    <slot name="icon">${fA}</slot>
  `}function _A(){return C("Quality")}class Gc extends Mr{static get observedAttributes(){return[...super.observedAttributes,h.MEDIA_RENDITION_SELECTED,h.MEDIA_RENDITION_UNAVAILABLE,h.MEDIA_HEIGHT]}connectedCallback(){super.connectedCallback(),this.setAttribute("aria-label",C("quality"))}get invokeTargetElement(){return this.invokeTarget!=null?super.invokeTargetElement:Xe(this).querySelector("media-rendition-menu")}get mediaRenditionSelected(){return ce(this,h.MEDIA_RENDITION_SELECTED)}set mediaRenditionSelected(e){oe(this,h.MEDIA_RENDITION_SELECTED,e)}get mediaHeight(){return se(this,h.MEDIA_HEIGHT)}set mediaHeight(e){ve(this,h.MEDIA_HEIGHT,e)}}Gc.getSlotTemplateHTML=EA;Gc.getTooltipContentHTML=_A;g.customElements.get("media-rendition-menu-button")||g.customElements.define("media-rendition-menu-button",Gc);var zc=(t,e,i)=>{if(!e.has(t))throw TypeError("Cannot "+i)},Zt=(t,e,i)=>(zc(t,e,"read from private field"),i?i.call(t):e.get(t)),Bt=(t,e,i)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,i)},Of=(t,e,i,a)=>(zc(t,e,"write to private field"),e.set(t,i),i),ft=(t,e,i)=>(zc(t,e,"access private method"),i),Ir,zn,Dl,ca,ur,Qc,Nf,ko,gu,wo,yu,Pf,nl,sl,So;function bA(t){return`
      ${gt.getTemplateHTML(t)}
      <style>
        :host {
          --_menu-bg: rgb(20 20 30 / .8);
          background: var(--media-settings-menu-background,
            var(--media-menu-background,
              var(--media-control-background,
                var(--media-secondary-color, var(--_menu-bg)))));
          min-width: var(--media-settings-menu-min-width, 170px);
          border-radius: 2px;
          overflow: hidden;
        }
      </style>
    `}class $f extends gt{constructor(){super(),Bt(this,zn),Bt(this,ca),Bt(this,Qc),Bt(this,ko),Bt(this,yu),Bt(this,Ir,!1),Bt(this,wo,e=>{const i=e.target,a=(i==null?void 0:i.nodeName)==="VIDEO",r=ft(this,ko,gu).call(this,i);(a||r)&&(Zt(this,Ir)?ft(this,ca,ur).call(this):ft(this,yu,Pf).call(this,e))}),Bt(this,nl,e=>{const i=e.target,a=this.contains(i),r=e.button===2,n=(i==null?void 0:i.nodeName)==="VIDEO",s=ft(this,ko,gu).call(this,i);a||r&&(n||s)||ft(this,ca,ur).call(this)}),Bt(this,sl,e=>{e.key==="Escape"&&ft(this,ca,ur).call(this)}),Bt(this,So,e=>{var i,a;const r=e.target;if((i=r.matches)!=null&&i.call(r,'button[invoke="copy"]')){const n=(a=r.closest("media-context-menu-item"))==null?void 0:a.querySelector('input[slot="copy"]');n&&navigator.clipboard.writeText(n.value)}ft(this,ca,ur).call(this)}),this.setAttribute("noautohide",""),ft(this,zn,Dl).call(this)}connectedCallback(){super.connectedCallback(),Xe(this).addEventListener("contextmenu",Zt(this,wo)),this.addEventListener("click",Zt(this,So))}disconnectedCallback(){super.disconnectedCallback(),Xe(this).removeEventListener("contextmenu",Zt(this,wo)),this.removeEventListener("click",Zt(this,So)),document.removeEventListener("mousedown",Zt(this,nl)),document.removeEventListener("keydown",Zt(this,sl))}}Ir=new WeakMap;zn=new WeakSet;Dl=function(){this.hidden=!Zt(this,Ir)};ca=new WeakSet;ur=function(){Of(this,Ir,!1),ft(this,zn,Dl).call(this)};Qc=new WeakSet;Nf=function(){document.querySelectorAll("media-context-menu").forEach(e=>{var i;e!==this&&ft(i=e,ca,ur).call(i)})};ko=new WeakSet;gu=function(t){return t?t.hasAttribute("slot")&&t.getAttribute("slot")==="media"?!0:t.nodeName.includes("-")&&t.tagName.includes("-")?t.hasAttribute("src")||t.hasAttribute("poster")||t.hasAttribute("preload")||t.hasAttribute("playsinline"):!1:!1};wo=new WeakMap;yu=new WeakSet;Pf=function(t){t.preventDefault(),ft(this,Qc,Nf).call(this),Of(this,Ir,!0),this.style.position="fixed",this.style.left=`${t.clientX}px`,this.style.top=`${t.clientY}px`,ft(this,zn,Dl).call(this),document.addEventListener("mousedown",Zt(this,nl),{once:!0}),document.addEventListener("keydown",Zt(this,sl),{once:!0})};nl=new WeakMap;sl=new WeakMap;So=new WeakMap;$f.getTemplateHTML=bA;g.customElements.get("media-context-menu")||g.customElements.define("media-context-menu",$f);function gA(t){return`
    ${zi.getTemplateHTML.call(this,t)}
    <style>
        ::slotted(*) {
            color: var(--media-text-color, white);
            text-decoration: none;
            border: none;
            background: none;
            cursor: pointer;
            padding: 0;
            min-height: var(--media-control-height, 24px);
        }
    </style>
  `}class jc extends zi{}jc.shadowRootOptions={mode:"open"};jc.getTemplateHTML=gA;g.customElements.get("media-context-menu-item")||g.customElements.define("media-context-menu-item",jc);var Uf=t=>{throw TypeError(t)},Zc=(t,e,i)=>e.has(t)||Uf("Cannot "+i),B=(t,e,i)=>(Zc(t,e,"read from private field"),i?i.call(t):e.get(t)),Ue=(t,e,i)=>e.has(t)?Uf("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(t):e.set(t,i),Ze=(t,e,i,a)=>(Zc(t,e,"write to private field"),e.set(t,i),i),Ee=(t,e,i)=>(Zc(t,e,"access private method"),i),Ml=class{addEventListener(){}removeEventListener(){}dispatchEvent(t){return!0}};if(typeof DocumentFragment>"u"){class t extends Ml{}globalThis.DocumentFragment=t}var Xc=class extends Ml{},yA=class extends Ml{},TA={get(t){},define(t,e,i){},getName(t){return null},upgrade(t){},whenDefined(t){return Promise.resolve(Xc)}},Io,AA=class{constructor(t,e={}){Ue(this,Io),Ze(this,Io,e==null?void 0:e.detail)}get detail(){return B(this,Io)}initCustomEvent(){}};Io=new WeakMap;function kA(t,e){return new Xc}var Hf={document:{createElement:kA},DocumentFragment,customElements:TA,CustomEvent:AA,EventTarget:Ml,HTMLElement:Xc,HTMLVideoElement:yA},Bf=typeof window>"u"||typeof globalThis.customElements>"u",Jt=Bf?Hf:globalThis,ol=Bf?Hf.document:globalThis.document;function wA(t){let e="";return Object.entries(t).forEach(([i,a])=>{a!=null&&(e+=`${Tu(i)}: ${a}; `)}),e?e.trim():void 0}function Tu(t){return t.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()}function Wf(t){return t.replace(/[-_]([a-z])/g,(e,i)=>i.toUpperCase())}function st(t){if(t==null)return;let e=+t;return Number.isNaN(e)?void 0:e}function Ff(t){let e=SA(t).toString();return e?"?"+e:""}function SA(t){let e={};for(let i in t)t[i]!=null&&(e[i]=t[i]);return new URLSearchParams(e)}var Kf=(t,e)=>!t||!e?!1:t.contains(e)?!0:Kf(t,e.getRootNode().host),Vf="mux.com",IA=()=>{try{return"3.11.7"}catch{}return"UNKNOWN"},RA=IA(),qf=()=>RA,LA=(t,{token:e,customDomain:i=Vf,thumbnailTime:a,programTime:r}={})=>{var n;let s=e==null?a:void 0,{aud:o}=(n=cr(e))!=null?n:{};if(!(e&&o!=="t"))return`https://image.${i}/${t}/thumbnail.webp${Ff({token:e,time:s,program_time:r})}`},CA=(t,{token:e,customDomain:i=Vf,programStartTime:a,programEndTime:r}={})=>{var n;let{aud:s}=(n=cr(e))!=null?n:{};if(!(e&&s!=="s"))return`https://image.${i}/${t}/storyboard.vtt${Ff({token:e,format:"webp",program_start_time:a,program_end_time:r})}`},Jc=t=>{if(t){if([J.LIVE,J.ON_DEMAND].includes(t))return t;if(t!=null&&t.includes("live"))return J.LIVE}},DA={crossorigin:"crossOrigin",playsinline:"playsInline"};function MA(t){var e;return(e=DA[t])!=null?e:Wf(t)}var ar,rr,je,xA=class{constructor(t,e){Ue(this,ar),Ue(this,rr),Ue(this,je,[]),Ze(this,ar,t),Ze(this,rr,e)}[Symbol.iterator](){return B(this,je).values()}get length(){return B(this,je).length}get value(){var t;return(t=B(this,je).join(" "))!=null?t:""}set value(t){var e;t!==this.value&&(Ze(this,je,[]),this.add(...(e=t==null?void 0:t.split(" "))!=null?e:[]))}toString(){return this.value}item(t){return B(this,je)[t]}values(){return B(this,je).values()}keys(){return B(this,je).keys()}forEach(t){B(this,je).forEach(t)}add(...t){var e,i;t.forEach(a=>{this.contains(a)||B(this,je).push(a)}),!(this.value===""&&!((e=B(this,ar))!=null&&e.hasAttribute(`${B(this,rr)}`)))&&((i=B(this,ar))==null||i.setAttribute(`${B(this,rr)}`,`${this.value}`))}remove(...t){var e;t.forEach(i=>{B(this,je).splice(B(this,je).indexOf(i),1)}),(e=B(this,ar))==null||e.setAttribute(`${B(this,rr)}`,`${this.value}`)}contains(t){return B(this,je).includes(t)}toggle(t,e){return typeof e<"u"?e?(this.add(t),!0):(this.remove(t),!1):this.contains(t)?(this.remove(t),!1):(this.add(t),!0)}replace(t,e){this.remove(t),this.add(e)}};ar=new WeakMap,rr=new WeakMap,je=new WeakMap;var Yf=`[mux-player ${qf()}]`;function ci(...t){console.warn(Yf,...t)}function ot(...t){console.error(Yf,...t)}function Dm(t){var e;let i=(e=t.message)!=null?e:"";t.context&&(i+=` ${t.context}`),t.file&&(i+=` ${O("Read more: ")}
https://github.com/muxinc/elements/blob/main/errors/${t.file}`),ci(i)}var Fe={AUTOPLAY:"autoplay",CROSSORIGIN:"crossorigin",LOOP:"loop",MUTED:"muted",PLAYSINLINE:"playsinline",PRELOAD:"preload"},la={VOLUME:"volume",PLAYBACKRATE:"playbackrate",MUTED:"muted"},Mm=Object.freeze({length:0,start(t){let e=t>>>0;if(e>=this.length)throw new DOMException(`Failed to execute 'start' on 'TimeRanges': The index provided (${e}) is greater than or equal to the maximum bound (${this.length}).`);return 0},end(t){let e=t>>>0;if(e>=this.length)throw new DOMException(`Failed to execute 'end' on 'TimeRanges': The index provided (${e}) is greater than or equal to the maximum bound (${this.length}).`);return 0}}),OA=Object.values(Fe).filter(t=>Fe.PLAYSINLINE!==t),NA=Object.values(la),PA=[...OA,...NA],$A=class extends Jt.HTMLElement{static get observedAttributes(){return PA}constructor(){super()}attributeChangedCallback(t,e,i){var a,r;switch(t){case la.MUTED:{this.media&&(this.media.muted=i!=null,this.media.defaultMuted=i!=null);return}case la.VOLUME:{let n=(a=st(i))!=null?a:1;this.media&&(this.media.volume=n);return}case la.PLAYBACKRATE:{let n=(r=st(i))!=null?r:1;this.media&&(this.media.playbackRate=n,this.media.defaultPlaybackRate=n);return}}}play(){var t,e;return(e=(t=this.media)==null?void 0:t.play())!=null?e:Promise.reject()}pause(){var t;(t=this.media)==null||t.pause()}load(){var t;(t=this.media)==null||t.load()}get media(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("mux-video")}get audioTracks(){return this.media.audioTracks}get videoTracks(){return this.media.videoTracks}get audioRenditions(){return this.media.audioRenditions}get videoRenditions(){return this.media.videoRenditions}get paused(){var t,e;return(e=(t=this.media)==null?void 0:t.paused)!=null?e:!0}get duration(){var t,e;return(e=(t=this.media)==null?void 0:t.duration)!=null?e:NaN}get ended(){var t,e;return(e=(t=this.media)==null?void 0:t.ended)!=null?e:!1}get buffered(){var t,e;return(e=(t=this.media)==null?void 0:t.buffered)!=null?e:Mm}get seekable(){var t,e;return(e=(t=this.media)==null?void 0:t.seekable)!=null?e:Mm}get readyState(){var t,e;return(e=(t=this.media)==null?void 0:t.readyState)!=null?e:0}get videoWidth(){var t,e;return(e=(t=this.media)==null?void 0:t.videoWidth)!=null?e:0}get videoHeight(){var t,e;return(e=(t=this.media)==null?void 0:t.videoHeight)!=null?e:0}get currentSrc(){var t,e;return(e=(t=this.media)==null?void 0:t.currentSrc)!=null?e:""}get currentTime(){var t,e;return(e=(t=this.media)==null?void 0:t.currentTime)!=null?e:0}set currentTime(t){this.media&&(this.media.currentTime=Number(t))}get volume(){var t,e;return(e=(t=this.media)==null?void 0:t.volume)!=null?e:1}set volume(t){this.media&&(this.media.volume=Number(t))}get playbackRate(){var t,e;return(e=(t=this.media)==null?void 0:t.playbackRate)!=null?e:1}set playbackRate(t){this.media&&(this.media.playbackRate=Number(t))}get defaultPlaybackRate(){var t;return(t=st(this.getAttribute(la.PLAYBACKRATE)))!=null?t:1}set defaultPlaybackRate(t){t!=null?this.setAttribute(la.PLAYBACKRATE,`${t}`):this.removeAttribute(la.PLAYBACKRATE)}get crossOrigin(){return Vr(this,Fe.CROSSORIGIN)}set crossOrigin(t){this.setAttribute(Fe.CROSSORIGIN,`${t}`)}get autoplay(){return Vr(this,Fe.AUTOPLAY)!=null}set autoplay(t){t?this.setAttribute(Fe.AUTOPLAY,typeof t=="string"?t:""):this.removeAttribute(Fe.AUTOPLAY)}get loop(){return Vr(this,Fe.LOOP)!=null}set loop(t){t?this.setAttribute(Fe.LOOP,""):this.removeAttribute(Fe.LOOP)}get muted(){var t,e;return(e=(t=this.media)==null?void 0:t.muted)!=null?e:!1}set muted(t){this.media&&(this.media.muted=!!t)}get defaultMuted(){return Vr(this,Fe.MUTED)!=null}set defaultMuted(t){t?this.setAttribute(Fe.MUTED,""):this.removeAttribute(Fe.MUTED)}get playsInline(){return Vr(this,Fe.PLAYSINLINE)!=null}set playsInline(t){ot("playsInline is set to true by default and is not currently supported as a setter.")}get preload(){return this.media?this.media.preload:this.getAttribute("preload")}set preload(t){["","none","metadata","auto"].includes(t)?this.setAttribute(Fe.PRELOAD,t):this.removeAttribute(Fe.PRELOAD)}};function Vr(t,e){return t.media?t.media.getAttribute(e):t.getAttribute(e)}var xm=$A,UA=`:host {
  --media-control-display: var(--controls);
  --media-loading-indicator-display: var(--loading-indicator);
  --media-dialog-display: var(--dialog);
  --media-play-button-display: var(--play-button);
  --media-live-button-display: var(--live-button);
  --media-seek-backward-button-display: var(--seek-backward-button);
  --media-seek-forward-button-display: var(--seek-forward-button);
  --media-mute-button-display: var(--mute-button);
  --media-captions-button-display: var(--captions-button);
  --media-captions-menu-button-display: var(--captions-menu-button, var(--media-captions-button-display));
  --media-rendition-menu-button-display: var(--rendition-menu-button);
  --media-audio-track-menu-button-display: var(--audio-track-menu-button);
  --media-airplay-button-display: var(--airplay-button);
  --media-pip-button-display: var(--pip-button);
  --media-fullscreen-button-display: var(--fullscreen-button);
  --media-cast-button-display: var(--cast-button, var(--_cast-button-drm-display));
  --media-playback-rate-button-display: var(--playback-rate-button);
  --media-playback-rate-menu-button-display: var(--playback-rate-menu-button);
  --media-volume-range-display: var(--volume-range);
  --media-time-range-display: var(--time-range);
  --media-time-display-display: var(--time-display);
  --media-duration-display-display: var(--duration-display);
  --media-title-display-display: var(--title-display);

  display: inline-block;
  line-height: 0;
  width: 100%;
}

a {
  color: #fff;
  font-size: 0.9em;
  text-decoration: underline;
}

media-theme {
  display: inline-block;
  line-height: 0;
  width: 100%;
  height: 100%;
  direction: ltr;
}

media-poster-image {
  display: inline-block;
  line-height: 0;
  width: 100%;
  height: 100%;
}

media-poster-image:not([src]):not([placeholdersrc]) {
  display: none;
}

::part(top),
[part~='top'] {
  --media-control-display: var(--controls, var(--top-controls));
  --media-play-button-display: var(--play-button, var(--top-play-button));
  --media-live-button-display: var(--live-button, var(--top-live-button));
  --media-seek-backward-button-display: var(--seek-backward-button, var(--top-seek-backward-button));
  --media-seek-forward-button-display: var(--seek-forward-button, var(--top-seek-forward-button));
  --media-mute-button-display: var(--mute-button, var(--top-mute-button));
  --media-captions-button-display: var(--captions-button, var(--top-captions-button));
  --media-captions-menu-button-display: var(
    --captions-menu-button,
    var(--media-captions-button-display, var(--top-captions-menu-button))
  );
  --media-rendition-menu-button-display: var(--rendition-menu-button, var(--top-rendition-menu-button));
  --media-audio-track-menu-button-display: var(--audio-track-menu-button, var(--top-audio-track-menu-button));
  --media-airplay-button-display: var(--airplay-button, var(--top-airplay-button));
  --media-pip-button-display: var(--pip-button, var(--top-pip-button));
  --media-fullscreen-button-display: var(--fullscreen-button, var(--top-fullscreen-button));
  --media-cast-button-display: var(--cast-button, var(--top-cast-button, var(--_cast-button-drm-display)));
  --media-playback-rate-button-display: var(--playback-rate-button, var(--top-playback-rate-button));
  --media-playback-rate-menu-button-display: var(
    --captions-menu-button,
    var(--media-playback-rate-button-display, var(--top-playback-rate-menu-button))
  );
  --media-volume-range-display: var(--volume-range, var(--top-volume-range));
  --media-time-range-display: var(--time-range, var(--top-time-range));
  --media-time-display-display: var(--time-display, var(--top-time-display));
  --media-duration-display-display: var(--duration-display, var(--top-duration-display));
  --media-title-display-display: var(--title-display, var(--top-title-display));
}

::part(center),
[part~='center'] {
  --media-control-display: var(--controls, var(--center-controls));
  --media-play-button-display: var(--play-button, var(--center-play-button));
  --media-live-button-display: var(--live-button, var(--center-live-button));
  --media-seek-backward-button-display: var(--seek-backward-button, var(--center-seek-backward-button));
  --media-seek-forward-button-display: var(--seek-forward-button, var(--center-seek-forward-button));
  --media-mute-button-display: var(--mute-button, var(--center-mute-button));
  --media-captions-button-display: var(--captions-button, var(--center-captions-button));
  --media-captions-menu-button-display: var(
    --captions-menu-button,
    var(--media-captions-button-display, var(--center-captions-menu-button))
  );
  --media-rendition-menu-button-display: var(--rendition-menu-button, var(--center-rendition-menu-button));
  --media-audio-track-menu-button-display: var(--audio-track-menu-button, var(--center-audio-track-menu-button));
  --media-airplay-button-display: var(--airplay-button, var(--center-airplay-button));
  --media-pip-button-display: var(--pip-button, var(--center-pip-button));
  --media-fullscreen-button-display: var(--fullscreen-button, var(--center-fullscreen-button));
  --media-cast-button-display: var(--cast-button, var(--center-cast-button, var(--_cast-button-drm-display)));
  --media-playback-rate-button-display: var(--playback-rate-button, var(--center-playback-rate-button));
  --media-playback-rate-menu-button-display: var(
    --playback-rate-menu-button,
    var(--media-playback-rate-button-display, var(--center-playback-rate-menu-button))
  );
  --media-volume-range-display: var(--volume-range, var(--center-volume-range));
  --media-time-range-display: var(--time-range, var(--center-time-range));
  --media-time-display-display: var(--time-display, var(--center-time-display));
  --media-duration-display-display: var(--duration-display, var(--center-duration-display));
}

::part(bottom),
[part~='bottom'] {
  --media-control-display: var(--controls, var(--bottom-controls));
  --media-play-button-display: var(--play-button, var(--bottom-play-button));
  --media-live-button-display: var(--live-button, var(--bottom-live-button));
  --media-seek-backward-button-display: var(--seek-backward-button, var(--bottom-seek-backward-button));
  --media-seek-forward-button-display: var(--seek-forward-button, var(--bottom-seek-forward-button));
  --media-mute-button-display: var(--mute-button, var(--bottom-mute-button));
  --media-captions-button-display: var(--captions-button, var(--bottom-captions-button));
  --media-captions-menu-button-display: var(
    --captions-menu-button,
    var(--media-captions-button-display, var(--bottom-captions-menu-button))
  );
  --media-rendition-menu-button-display: var(--rendition-menu-button, var(--bottom-rendition-menu-button));
  --media-audio-track-menu-button-display: var(--audio-track-menu-button, var(--bottom-audio-track-menu-button));
  --media-airplay-button-display: var(--airplay-button, var(--bottom-airplay-button));
  --media-pip-button-display: var(--pip-button, var(--bottom-pip-button));
  --media-fullscreen-button-display: var(--fullscreen-button, var(--bottom-fullscreen-button));
  --media-cast-button-display: var(--cast-button, var(--bottom-cast-button, var(--_cast-button-drm-display)));
  --media-playback-rate-button-display: var(--playback-rate-button, var(--bottom-playback-rate-button));
  --media-playback-rate-menu-button-display: var(
    --playback-rate-menu-button,
    var(--media-playback-rate-button-display, var(--bottom-playback-rate-menu-button))
  );
  --media-volume-range-display: var(--volume-range, var(--bottom-volume-range));
  --media-time-range-display: var(--time-range, var(--bottom-time-range));
  --media-time-display-display: var(--time-display, var(--bottom-time-display));
  --media-duration-display-display: var(--duration-display, var(--bottom-duration-display));
  --media-title-display-display: var(--title-display, var(--bottom-title-display));
}

:host([no-tooltips]) {
  --media-tooltip-display: none;
}
`,qr=new WeakMap,HA=class Gf{constructor(e,i){this.element=e,this.type=i,this.element.addEventListener(this.type,this);let a=qr.get(this.element);a&&a.set(this.type,this)}set(e){if(typeof e=="function")this.handleEvent=e.bind(this.element);else if(typeof e=="object"&&typeof e.handleEvent=="function")this.handleEvent=e.handleEvent.bind(e);else{this.element.removeEventListener(this.type,this);let i=qr.get(this.element);i&&i.delete(this.type)}}static for(e){qr.has(e.element)||qr.set(e.element,new Map);let i=e.attributeName.slice(2),a=qr.get(e.element);return a&&a.has(i)?a.get(i):new Gf(e.element,i)}};function BA(t,e){return t instanceof Pt&&t.attributeName.startsWith("on")?(HA.for(t).set(e),t.element.removeAttributeNS(t.attributeNamespace,t.attributeName),!0):!1}function WA(t,e){return e instanceof zf&&t instanceof Dr?(e.renderInto(t),!0):!1}function FA(t,e){return e instanceof DocumentFragment&&t instanceof Dr?(e.childNodes.length&&t.replace(...e.childNodes),!0):!1}function KA(t,e){if(t instanceof Pt){let i=t.attributeNamespace,a=t.element.getAttributeNS(i,t.attributeName);return String(e)!==a&&(t.value=String(e)),!0}return t.value=String(e),!0}function VA(t,e){if(t instanceof Pt&&e instanceof Element){let i=t.element;return i[t.attributeName]!==e&&(t.element.removeAttributeNS(t.attributeNamespace,t.attributeName),i[t.attributeName]=e),!0}return!1}function qA(t,e){if(typeof e=="boolean"&&t instanceof Pt){let i=t.attributeNamespace,a=t.element.hasAttributeNS(i,t.attributeName);return e!==a&&(t.booleanValue=e),!0}return!1}function YA(t,e){return e===!1&&t instanceof Dr?(t.replace(""),!0):!1}function GA(t,e){VA(t,e)||qA(t,e)||BA(t,e)||YA(t,e)||WA(t,e)||FA(t,e)||KA(t,e)}var id=new Map,Om=new WeakMap,Nm=new WeakMap,zf=class{constructor(t,e,i){this.strings=t,this.values=e,this.processor=i,this.stringsKey=this.strings.join("")}get template(){if(id.has(this.stringsKey))return id.get(this.stringsKey);{let t=ol.createElement("template"),e=this.strings.length-1;return t.innerHTML=this.strings.reduce((i,a,r)=>i+a+(r<e?`{{ ${r} }}`:""),""),id.set(this.stringsKey,t),t}}renderInto(t){var e;let i=this.template;if(Om.get(t)!==i){Om.set(t,i);let r=new Rl(i,this.values,this.processor);Nm.set(t,r),t instanceof Dr?t.replace(...r.children):t.appendChild(r);return}let a=Nm.get(t);(e=a==null?void 0:a.update)==null||e.call(a,this.values)}},zA={processCallback(t,e,i){var a;if(i){for(let[r,n]of e)if(r in i){let s=(a=i[r])!=null?a:"";GA(n,s)}}}};function Ro(t,...e){return new zf(t,e,zA)}function QA(t,e){t.renderInto(e)}var jA=t=>{let{tokens:e}=t;return e.drm?":host(:not([cast-receiver])) { --_cast-button-drm-display: none; }":""},ZA=t=>Ro`
  <style>
    ${jA(t)}
    ${UA}
  </style>
  ${tk(t)}
`,XA=t=>{let e=t.hotKeys?`${t.hotKeys}`:"";return Jc(t.streamType)==="live"&&(e+=" noarrowleft noarrowright"),e},JA={TOP:"top",CENTER:"center",BOTTOM:"bottom",LAYER:"layer",MEDIA_LAYER:"media-layer",POSTER_LAYER:"poster-layer",VERTICAL_LAYER:"vertical-layer",CENTERED_LAYER:"centered-layer",GESTURE_LAYER:"gesture-layer",CONTROLLER_LAYER:"controller",BUTTON:"button",RANGE:"range",THUMB:"thumb",DISPLAY:"display",CONTROL_BAR:"control-bar",MENU_BUTTON:"menu-button",MENU:"menu",MENU_ITEM:"menu-item",OPTION:"option",POSTER:"poster",LIVE:"live",PLAY:"play",PRE_PLAY:"pre-play",SEEK_BACKWARD:"seek-backward",SEEK_FORWARD:"seek-forward",MUTE:"mute",CAPTIONS:"captions",AIRPLAY:"airplay",PIP:"pip",FULLSCREEN:"fullscreen",CAST:"cast",PLAYBACK_RATE:"playback-rate",VOLUME:"volume",TIME:"time",TITLE:"title",AUDIO_TRACK:"audio-track",RENDITION:"rendition"},ek=Object.values(JA).join(", "),tk=t=>{var e,i,a,r,n,s,o,l,c,p,m,u,d,v,f,b,E,T,_,w,R,x,U,K,Q,W,H,He,et,tt,be,Ke,$t,Ve,yt,it,Ce,Be,qe;return Ro`
  <media-theme
    template="${t.themeTemplate||!1}"
    defaultstreamtype="${(e=t.defaultStreamType)!=null?e:!1}"
    hotkeys="${XA(t)||!1}"
    nohotkeys="${t.noHotKeys||!t.hasSrc||!1}"
    noautoseektolive="${!!((i=t.streamType)!=null&&i.includes(J.LIVE))&&t.targetLiveWindow!==0}"
    novolumepref="${t.novolumepref||!1}"
    nomutedpref="${t.nomutedpref||!1}"
    disabled="${!t.hasSrc||t.isDialogOpen}"
    audio="${(a=t.audio)!=null?a:!1}"
    style="${(r=wA({"--media-primary-color":t.primaryColor,"--media-secondary-color":t.secondaryColor,"--media-accent-color":t.accentColor}))!=null?r:!1}"
    defaultsubtitles="${!t.defaultHiddenCaptions}"
    forwardseekoffset="${(n=t.forwardSeekOffset)!=null?n:!1}"
    backwardseekoffset="${(s=t.backwardSeekOffset)!=null?s:!1}"
    playbackrates="${(o=t.playbackRates)!=null?o:!1}"
    defaultshowremainingtime="${(l=t.defaultShowRemainingTime)!=null?l:!1}"
    defaultduration="${(c=t.defaultDuration)!=null?c:!1}"
    hideduration="${(p=t.hideDuration)!=null?p:!1}"
    title="${(m=t.title)!=null?m:!1}"
    videotitle="${(u=t.videoTitle)!=null?u:!1}"
    proudlydisplaymuxbadge="${(d=t.proudlyDisplayMuxBadge)!=null?d:!1}"
    exportparts="${ek}"
    onclose="${t.onCloseErrorDialog}"
    onfocusin="${t.onFocusInErrorDialog}"
  >
    <mux-video
      slot="media"
      inert="${(v=t.noHotKeys)!=null?v:!1}"
      target-live-window="${(f=t.targetLiveWindow)!=null?f:!1}"
      stream-type="${(b=Jc(t.streamType))!=null?b:!1}"
      crossorigin="${(E=t.crossOrigin)!=null?E:""}"
      playsinline
      autoplay="${(T=t.autoplay)!=null?T:!1}"
      muted="${(_=t.muted)!=null?_:!1}"
      loop="${(w=t.loop)!=null?w:!1}"
      preload="${(R=t.preload)!=null?R:!1}"
      debug="${(x=t.debug)!=null?x:!1}"
      prefer-cmcd="${(U=t.preferCmcd)!=null?U:!1}"
      disable-tracking="${(K=t.disableTracking)!=null?K:!1}"
      disable-cookies="${(Q=t.disableCookies)!=null?Q:!1}"
      prefer-playback="${(W=t.preferPlayback)!=null?W:!1}"
      start-time="${t.startTime!=null?t.startTime:!1}"
      beacon-collection-domain="${(H=t.beaconCollectionDomain)!=null?H:!1}"
      player-init-time="${(He=t.playerInitTime)!=null?He:!1}"
      player-software-name="${(et=t.playerSoftwareName)!=null?et:!1}"
      player-software-version="${(tt=t.playerSoftwareVersion)!=null?tt:!1}"
      env-key="${(be=t.envKey)!=null?be:!1}"
      custom-domain="${(Ke=t.customDomain)!=null?Ke:!1}"
      src="${t.src?t.src:t.playbackId?pd(t):!1}"
      cast-src="${t.src?t.src:t.playbackId?pd(t):!1}"
      cast-receiver="${($t=t.castReceiver)!=null?$t:!1}"
      drm-token="${(yt=(Ve=t.tokens)==null?void 0:Ve.drm)!=null?yt:!1}"
      exportparts="video"
      disable-pseudo-ended="${(it=t.disablePseudoEnded)!=null?it:!1}"
      max-auto-resolution="${(Ce=t.maxAutoResolution)!=null?Ce:!1}"
      cap-rendition-to-player-size="${(Be=t.capRenditionToPlayerSize)!=null?Be:!1}"
    >
      ${t.storyboard?Ro`<track label="thumbnails" default kind="metadata" src="${t.storyboard}" />`:Ro``}
      <slot></slot>
    </mux-video>
    <slot name="poster" slot="poster">
      <media-poster-image
        part="poster"
        exportparts="poster, img"
        src="${t.poster?t.poster:!1}"
        placeholdersrc="${(qe=t.placeholder)!=null?qe:!1}"
      ></media-poster-image>
    </slot>
  </media-theme>
`},Qf=t=>t.charAt(0).toUpperCase()+t.slice(1),ik=(t,e=!1)=>{var i,a;if(t.muxCode){let r=Qf((i=t.errorCategory)!=null?i:"video"),n=ml((a=t.errorCategory)!=null?a:ee.VIDEO);if(t.muxCode===N.NETWORK_OFFLINE)return O("Your device appears to be offline",e);if(t.muxCode===N.NETWORK_TOKEN_EXPIRED)return O("{category} URL has expired",e).format({category:r});if([N.NETWORK_TOKEN_SUB_MISMATCH,N.NETWORK_TOKEN_AUD_MISMATCH,N.NETWORK_TOKEN_AUD_MISSING,N.NETWORK_TOKEN_MALFORMED].includes(t.muxCode))return O("{category} URL is formatted incorrectly",e).format({category:r});if(t.muxCode===N.NETWORK_TOKEN_MISSING)return O("Invalid {categoryName} URL",e).format({categoryName:n});if(t.muxCode===N.NETWORK_NOT_FOUND)return O("{category} does not exist",e).format({category:r});if(t.muxCode===N.NETWORK_NOT_READY){let s=t.streamType==="live"?"Live stream":"Video";return O("{mediaType} is not currently available",e).format({mediaType:s})}}if(t.code){if(t.code===L.MEDIA_ERR_NETWORK)return O("Network Error",e);if(t.code===L.MEDIA_ERR_DECODE)return O("Media Error",e);if(t.code===L.MEDIA_ERR_SRC_NOT_SUPPORTED)return O("Source Not Supported",e)}return O("Error",e)},ak=(t,e=!1)=>{var i,a;if(t.muxCode){let r=Qf((i=t.errorCategory)!=null?i:"video"),n=ml((a=t.errorCategory)!=null?a:ee.VIDEO);return t.muxCode===N.NETWORK_OFFLINE?O("Check your internet connection and try reloading this video.",e):t.muxCode===N.NETWORK_TOKEN_EXPIRED?O("The video’s secured {tokenNamePrefix}-token has expired.",e).format({tokenNamePrefix:n}):t.muxCode===N.NETWORK_TOKEN_SUB_MISMATCH?O("The video’s playback ID does not match the one encoded in the {tokenNamePrefix}-token.",e).format({tokenNamePrefix:n}):t.muxCode===N.NETWORK_TOKEN_MALFORMED?O("{category} URL is formatted incorrectly",e).format({category:r}):[N.NETWORK_TOKEN_AUD_MISMATCH,N.NETWORK_TOKEN_AUD_MISSING].includes(t.muxCode)?O("The {tokenNamePrefix}-token is formatted with incorrect information.",e).format({tokenNamePrefix:n}):[N.NETWORK_TOKEN_MISSING,N.NETWORK_INVALID_URL].includes(t.muxCode)?O("The video URL or {tokenNamePrefix}-token are formatted with incorrect or incomplete information.",e).format({tokenNamePrefix:n}):t.muxCode===N.NETWORK_NOT_FOUND?"":t.message}return t.code&&(t.code===L.MEDIA_ERR_NETWORK||t.code===L.MEDIA_ERR_DECODE||(t.code,L.MEDIA_ERR_SRC_NOT_SUPPORTED)),t.message},rk=(t,e=!1)=>{let i=ik(t,e).toString(),a=ak(t,e).toString();return{title:i,message:a}},nk=t=>{if(t.muxCode){if(t.muxCode===N.NETWORK_TOKEN_EXPIRED)return"403-expired-token.md";if(t.muxCode===N.NETWORK_TOKEN_MALFORMED)return"403-malformatted-token.md";if([N.NETWORK_TOKEN_AUD_MISMATCH,N.NETWORK_TOKEN_AUD_MISSING].includes(t.muxCode))return"403-incorrect-aud-value.md";if(t.muxCode===N.NETWORK_TOKEN_SUB_MISMATCH)return"403-playback-id-mismatch.md";if(t.muxCode===N.NETWORK_TOKEN_MISSING)return"missing-signed-tokens.md";if(t.muxCode===N.NETWORK_NOT_FOUND)return"404-not-found.md";if(t.muxCode===N.NETWORK_NOT_READY)return"412-not-playable.md"}if(t.code){if(t.code===L.MEDIA_ERR_NETWORK)return"";if(t.code===L.MEDIA_ERR_DECODE)return"media-decode-error.md";if(t.code===L.MEDIA_ERR_SRC_NOT_SUPPORTED)return"media-src-not-supported.md"}return""},jf=(t,e)=>{let i=nk(t);return{message:t.message,context:t.context,file:i}},sk=`<template id="media-theme-gerwig">
  <style>
    @keyframes pre-play-hide {
      0% {
        transform: scale(1);
        opacity: 1;
      }

      30% {
        transform: scale(0.7);
      }

      100% {
        transform: scale(1.5);
        opacity: 0;
      }
    }

    :host {
      --_primary-color: var(--media-primary-color, #fff);
      --_secondary-color: var(--media-secondary-color, transparent);
      --_accent-color: var(--media-accent-color, #fa50b5);
      --_text-color: var(--media-text-color, #000);

      --media-icon-color: var(--_primary-color);
      --media-control-background: var(--_secondary-color);
      --media-control-hover-background: var(--_accent-color);
      --media-time-buffered-color: rgba(255, 255, 255, 0.4);
      --media-preview-time-text-shadow: none;
      --media-control-height: 14px;
      --media-control-padding: 6px;
      --media-tooltip-container-margin: 6px;
      --media-tooltip-distance: 18px;

      color: var(--_primary-color);
      display: inline-block;
      width: 100%;
      height: 100%;
    }

    :host([audio]) {
      --_secondary-color: var(--media-secondary-color, black);
      --media-preview-time-text-shadow: none;
    }

    :host([audio]) ::slotted([slot='media']) {
      height: 0px;
    }

    :host([audio]) media-loading-indicator {
      display: none;
    }

    :host([audio]) media-controller {
      background: transparent;
    }

    :host([audio]) media-controller::part(vertical-layer) {
      background: transparent;
    }

    :host([audio]) media-control-bar {
      width: 100%;
      background-color: var(--media-control-background);
    }

    /*
     * 0.433s is the transition duration for VTT Regions.
     * Borrowed here, so the captions don't move too fast.
     */
    media-controller {
      --media-webkit-text-track-transform: translateY(0) scale(0.98);
      --media-webkit-text-track-transition: transform 0.433s ease-out 0.3s;
    }
    media-controller:is([mediapaused], :not([userinactive])) {
      --media-webkit-text-track-transform: translateY(-50px) scale(0.98);
      --media-webkit-text-track-transition: transform 0.15s ease;
    }

    /*
     * CSS specific to iOS devices.
     * See: https://stackoverflow.com/questions/30102792/css-media-query-to-target-only-ios-devices/60220757#60220757
     */
    @supports (-webkit-touch-callout: none) {
      /* Disable subtitle adjusting for iOS Safari */
      media-controller[mediaisfullscreen] {
        --media-webkit-text-track-transform: unset;
        --media-webkit-text-track-transition: unset;
      }
    }

    media-time-range {
      --media-box-padding-left: 6px;
      --media-box-padding-right: 6px;
      --media-range-bar-color: var(--_accent-color);
      --media-time-range-buffered-color: var(--_primary-color);
      --media-range-track-color: transparent;
      --media-range-track-background: rgba(255, 255, 255, 0.4);
      --media-range-thumb-background: radial-gradient(
        circle,
        #000 0%,
        #000 25%,
        var(--_accent-color) 25%,
        var(--_accent-color)
      );
      --media-range-thumb-width: 12px;
      --media-range-thumb-height: 12px;
      --media-range-thumb-transform: scale(0);
      --media-range-thumb-transition: transform 0.3s;
      --media-range-thumb-opacity: 1;
      --media-preview-background: var(--_primary-color);
      --media-box-arrow-background: var(--_primary-color);
      --media-preview-thumbnail-border: 5px solid var(--_primary-color);
      --media-preview-border-radius: 5px;
      --media-text-color: var(--_text-color);
      --media-control-hover-background: transparent;
      --media-preview-chapter-text-shadow: none;
      color: var(--_accent-color);
      padding: 0 6px;
    }

    :host([audio]) media-time-range {
      --media-preview-time-padding: 1.5px 6px;
      --media-preview-box-margin: 0 0 -5px;
    }

    media-time-range:hover {
      --media-range-thumb-transform: scale(1);
    }

    media-preview-thumbnail {
      border-bottom-width: 0;
    }

    [part~='menu'] {
      border-radius: 2px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      bottom: 50px;
      padding: 2.5px 10px;
    }

    [part~='menu']::part(indicator) {
      fill: var(--_accent-color);
    }

    [part~='menu']::part(menu-item) {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      padding: 6px 10px;
      min-height: 34px;
    }

    [part~='menu']::part(checked) {
      font-weight: 700;
    }

    media-captions-menu,
    media-rendition-menu,
    media-audio-track-menu,
    media-playback-rate-menu {
      position: absolute; /* ensure they don't take up space in DOM on load */
      --media-menu-background: var(--_primary-color);
      --media-menu-item-checked-background: transparent;
      --media-text-color: var(--_text-color);
      --media-menu-item-hover-background: transparent;
      --media-menu-item-hover-outline: var(--_accent-color) solid 1px;
    }

    media-rendition-menu {
      min-width: 140px;
    }

    /* The icon is a circle so make it 16px high instead of 14px for more balance. */
    media-audio-track-menu-button {
      --media-control-padding: 5px;
      --media-control-height: 16px;
    }

    media-playback-rate-menu-button {
      --media-control-padding: 6px 3px;
      min-width: 4.4ch;
    }

    media-playback-rate-menu {
      --media-menu-flex-direction: row;
      --media-menu-item-checked-background: var(--_accent-color);
      --media-menu-item-checked-indicator-display: none;
      margin-right: 6px;
      padding: 0;
      --media-menu-gap: 0.25em;
    }

    media-playback-rate-menu[part~='menu']::part(menu-item) {
      padding: 6px 6px 6px 8px;
    }

    media-playback-rate-menu[part~='menu']::part(checked) {
      color: #fff;
    }

    :host(:not([audio])) media-time-range {
      /* Adding px is required here for calc() */
      --media-range-padding: 0px;
      background: transparent;
      z-index: 10;
      height: 10px;
      bottom: -3px;
      width: 100%;
    }

    media-control-bar :is([role='button'], [role='switch'], button) {
      line-height: 0;
    }

    media-control-bar :is([part*='button'], [part*='range'], [part*='display']) {
      border-radius: 3px;
    }

    .spacer {
      flex-grow: 1;
      background-color: var(--media-control-background, rgba(20, 20, 30, 0.7));
    }

    media-control-bar[slot~='top-chrome'] {
      min-height: 42px;
      pointer-events: none;
    }

    media-control-bar {
      --gradient-steps:
        hsl(0 0% 0% / 0) 0%, hsl(0 0% 0% / 0.013) 8.1%, hsl(0 0% 0% / 0.049) 15.5%, hsl(0 0% 0% / 0.104) 22.5%,
        hsl(0 0% 0% / 0.175) 29%, hsl(0 0% 0% / 0.259) 35.3%, hsl(0 0% 0% / 0.352) 41.2%, hsl(0 0% 0% / 0.45) 47.1%,
        hsl(0 0% 0% / 0.55) 52.9%, hsl(0 0% 0% / 0.648) 58.8%, hsl(0 0% 0% / 0.741) 64.7%, hsl(0 0% 0% / 0.825) 71%,
        hsl(0 0% 0% / 0.896) 77.5%, hsl(0 0% 0% / 0.951) 84.5%, hsl(0 0% 0% / 0.987) 91.9%, hsl(0 0% 0%) 100%;
    }

    :host([title]) media-control-bar[slot='top-chrome']::before,
    :host([videotitle]) media-control-bar[slot='top-chrome']::before {
      content: '';
      position: absolute;
      width: 100%;
      padding-bottom: min(100px, 25%);
      background: linear-gradient(to top, var(--gradient-steps));
      opacity: 0.8;
      pointer-events: none;
    }

    :host(:not([audio])) media-control-bar[part~='bottom']::before {
      content: '';
      position: absolute;
      width: 100%;
      bottom: 0;
      left: 0;
      padding-bottom: min(100px, 25%);
      background: linear-gradient(to bottom, var(--gradient-steps));
      opacity: 0.8;
      z-index: 1;
      pointer-events: none;
    }

    media-control-bar[part~='bottom'] > * {
      z-index: 20;
    }

    media-control-bar[part~='bottom'] {
      padding: 6px 6px;
    }

    media-control-bar[slot~='top-chrome'] > * {
      --media-control-background: transparent;
      --media-control-hover-background: transparent;
      position: relative;
    }

    media-controller::part(vertical-layer) {
      transition: background-color 1s;
    }

    media-controller:is([mediapaused], :not([userinactive]))::part(vertical-layer) {
      background-color: var(--controls-backdrop-color, var(--controls, transparent));
      transition: background-color 0.25s;
    }

    .center-controls {
      --media-button-icon-width: 100%;
      --media-button-icon-height: auto;
      --media-tooltip-display: none;
      pointer-events: none;
      width: 100%;
      display: flex;
      flex-flow: row;
      align-items: center;
      justify-content: center;
      paint-order: stroke;
      stroke: rgba(102, 102, 102, 1);
      stroke-width: 0.3px;
      text-shadow:
        0 0 2px rgb(0 0 0 / 0.25),
        0 0 6px rgb(0 0 0 / 0.25);
    }

    .center-controls media-play-button {
      --media-control-background: transparent;
      --media-control-hover-background: transparent;
      --media-control-padding: 0;
      width: 40px;
      filter: drop-shadow(0 0 2px rgb(0 0 0 / 0.25)) drop-shadow(0 0 6px rgb(0 0 0 / 0.25));
    }

    [breakpointsm] .center-controls media-play-button {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      transition: background 0.4s;
      padding: 24px;
      --media-control-background: #000;
      --media-control-hover-background: var(--_accent-color);
    }

    .center-controls media-seek-backward-button,
    .center-controls media-seek-forward-button {
      --media-control-background: transparent;
      --media-control-hover-background: transparent;
      padding: 0;
      margin: 0 20px;
      width: max(33px, min(8%, 40px));
      text-shadow:
        0 0 2px rgb(0 0 0 / 0.25),
        0 0 6px rgb(0 0 0 / 0.25);
    }

    [breakpointsm]:not([audio]) .center-controls.pre-playback {
      display: grid;
      align-items: initial;
      justify-content: initial;
      height: 100%;
      overflow: hidden;
    }

    [breakpointsm]:not([audio]) .center-controls.pre-playback media-play-button {
      place-self: var(--_pre-playback-place, center);
      grid-area: 1 / 1;
      margin: 16px;
    }

    /* Show and hide controls or pre-playback state */

    [breakpointsm]:is([mediahasplayed], :not([mediapaused])):not([audio])
      .center-controls.pre-playback
      media-play-button {
      /* Using \`forwards\` would lead to a laggy UI after the animation got in the end state */
      animation: 0.3s linear pre-play-hide;
      opacity: 0;
      pointer-events: none;
    }

    .autoplay-unmute {
      --media-control-hover-background: transparent;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 0 2px rgb(0 0 0 / 0.25)) drop-shadow(0 0 6px rgb(0 0 0 / 0.25));
    }

    .autoplay-unmute-btn {
      --media-control-height: 16px;
      border-radius: 8px;
      background: #000;
      color: var(--_primary-color);
      display: flex;
      align-items: center;
      padding: 8px 16px;
      font-size: 18px;
      font-weight: 500;
      cursor: pointer;
    }

    .autoplay-unmute-btn:hover {
      background: var(--_accent-color);
    }

    [breakpointsm] .autoplay-unmute-btn {
      --media-control-height: 30px;
      padding: 14px 24px;
      font-size: 26px;
    }

    .autoplay-unmute-btn svg {
      margin: 0 6px 0 0;
    }

    [breakpointsm] .autoplay-unmute-btn svg {
      margin: 0 10px 0 0;
    }

    media-controller:not([audio]):not([mediahasplayed]) *:is(media-control-bar, media-time-range) {
      display: none;
    }

    media-error-dialog:not([mediaerrorcode]) {
      opacity: 0;
    }

    media-loading-indicator {
      --media-loading-icon-width: 100%;
      --media-button-icon-height: auto;
      display: var(--media-control-display, var(--media-loading-indicator-display, flex));
      pointer-events: none;
      position: absolute;
      width: min(15%, 150px);
      flex-flow: row;
      align-items: center;
      justify-content: center;
    }

    /* Intentionally don't target the div for transition but the children
     of the div. Prevents messing with media-chrome's autohide feature. */
    media-loading-indicator + div * {
      transition: opacity 0.15s;
      opacity: 1;
    }

    media-loading-indicator[medialoading]:not([mediapaused]) ~ div > * {
      opacity: 0;
      transition-delay: 400ms;
    }

    media-volume-range {
      width: min(100%, 100px);
      --media-range-padding-left: 10px;
      --media-range-padding-right: 10px;
      --media-range-thumb-width: 12px;
      --media-range-thumb-height: 12px;
      --media-range-thumb-background: radial-gradient(
        circle,
        #000 0%,
        #000 25%,
        var(--_primary-color) 25%,
        var(--_primary-color)
      );
      --media-control-hover-background: none;
    }

    media-time-display {
      white-space: nowrap;
    }

    /* Generic style for explicitly disabled controls */
    media-control-bar[part~='bottom'] [disabled],
    media-control-bar[part~='bottom'] [aria-disabled='true'] {
      opacity: 60%;
      cursor: not-allowed;
    }

    media-text-display {
      --media-font-size: 16px;
      --media-control-padding: 14px;
      font-weight: 500;
    }

    media-play-button.animated *:is(g, path) {
      transition: all 0.3s;
    }

    media-play-button.animated[mediapaused] .pause-icon-pt1 {
      opacity: 0;
    }

    media-play-button.animated[mediapaused] .pause-icon-pt2 {
      transform-origin: center center;
      transform: scaleY(0);
    }

    media-play-button.animated[mediapaused] .play-icon {
      clip-path: inset(0 0 0 0);
    }

    media-play-button.animated:not([mediapaused]) .play-icon {
      clip-path: inset(0 0 0 100%);
    }

    media-seek-forward-button,
    media-seek-backward-button {
      --media-font-weight: 400;
    }

    .mute-icon {
      display: inline-block;
    }

    .mute-icon :is(path, g) {
      transition: opacity 0.5s;
    }

    .muted {
      opacity: 0;
    }

    media-mute-button[mediavolumelevel='low'] :is(.volume-medium, .volume-high),
    media-mute-button[mediavolumelevel='medium'] :is(.volume-high) {
      opacity: 0;
    }

    media-mute-button[mediavolumelevel='off'] .unmuted {
      opacity: 0;
    }

    media-mute-button[mediavolumelevel='off'] .muted {
      opacity: 1;
    }

    /**
     * Our defaults for these buttons are to hide them at small sizes
     * users can override this with CSS
     */
    media-controller:not([breakpointsm]):not([audio]) {
      --bottom-play-button: none;
      --bottom-seek-backward-button: none;
      --bottom-seek-forward-button: none;
      --bottom-time-display: none;
      --bottom-playback-rate-menu-button: none;
      --bottom-pip-button: none;
    }

    [part='mux-badge'] {
      position: absolute;
      bottom: 10px;
      right: 10px;
      z-index: 2;
      opacity: 0.6;
      transition:
        opacity 0.2s ease-in-out,
        bottom 0.2s ease-in-out;
    }

    [part='mux-badge']:hover {
      opacity: 1;
    }

    [part='mux-badge'] a {
      font-size: 14px;
      font-family: var(--_font-family);
      color: var(--_primary-color);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    [part='mux-badge'] .mux-badge-text {
      transition: opacity 0.5s ease-in-out;
      opacity: 0;
    }

    [part='mux-badge'] .mux-badge-logo {
      width: 40px;
      height: auto;
      display: inline-block;
    }

    [part='mux-badge'] .mux-badge-logo svg {
      width: 100%;
      height: 100%;
      fill: white;
    }

    media-controller:not([userinactive]):not([mediahasplayed]) [part='mux-badge'],
    media-controller:not([userinactive]) [part='mux-badge'],
    media-controller[mediahasplayed][mediapaused] [part='mux-badge'] {
      transition: bottom 0.1s ease-in-out;
    }

    media-controller[userinactive]:not([mediapaused]) [part='mux-badge'] {
      transition: bottom 0.2s ease-in-out 0.62s;
    }

    media-controller:not([userinactive]) [part='mux-badge'] .mux-badge-text,
    media-controller[mediahasplayed][mediapaused] [part='mux-badge'] .mux-badge-text {
      opacity: 1;
    }

    media-controller[userinactive]:not([mediapaused]) [part='mux-badge'] .mux-badge-text {
      opacity: 0;
    }

    media-controller[userinactive]:not([mediapaused]) [part='mux-badge'] {
      bottom: 10px;
    }

    media-controller:not([userinactive]):not([mediahasplayed]) [part='mux-badge'] {
      bottom: 10px;
    }

    media-controller:not([userinactive])[mediahasplayed] [part='mux-badge'],
    media-controller[mediahasplayed][mediapaused] [part='mux-badge'] {
      bottom: calc(28px + var(--media-control-height, 0px) + var(--media-control-padding, 0px) * 2);
    }
  </style>

  <template partial="TitleDisplay">
    <template if="videotitle">
      <template if="videotitle != true">
        <media-text-display part="top title display" class="title-display">{{videotitle}}</media-text-display>
      </template>
    </template>
    <template if="!videotitle">
      <template if="title">
        <media-text-display part="top title display" class="title-display">{{title}}</media-text-display>
      </template>
    </template>
  </template>

  <template partial="PlayButton">
    <media-play-button
      part="{{section ?? 'bottom'}} play button"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
      class="animated"
    >
      <svg aria-hidden="true" viewBox="0 0 18 14" slot="icon">
        <g class="play-icon">
          <path
            d="M15.5987 6.2911L3.45577 0.110898C2.83667 -0.204202 2.06287 0.189698 2.06287 0.819798V13.1802C2.06287 13.8103 2.83667 14.2042 3.45577 13.8891L15.5987 7.7089C16.2178 7.3938 16.2178 6.6061 15.5987 6.2911Z"
          />
        </g>
        <g class="pause-icon">
          <path
            class="pause-icon-pt1"
            d="M5.90709 0H2.96889C2.46857 0 2.06299 0.405585 2.06299 0.9059V13.0941C2.06299 13.5944 2.46857 14 2.96889 14H5.90709C6.4074 14 6.81299 13.5944 6.81299 13.0941V0.9059C6.81299 0.405585 6.4074 0 5.90709 0Z"
          />
          <path
            class="pause-icon-pt2"
            d="M15.1571 0H12.2189C11.7186 0 11.313 0.405585 11.313 0.9059V13.0941C11.313 13.5944 11.7186 14 12.2189 14H15.1571C15.6574 14 16.063 13.5944 16.063 13.0941V0.9059C16.063 0.405585 15.6574 0 15.1571 0Z"
          />
        </g>
      </svg>
    </media-play-button>
  </template>

  <template partial="PrePlayButton">
    <media-play-button
      part="{{section ?? 'center'}} play button pre-play"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    >
      <svg aria-hidden="true" viewBox="0 0 18 14" slot="icon" style="transform: translate(3px, 0)">
        <path
          d="M15.5987 6.2911L3.45577 0.110898C2.83667 -0.204202 2.06287 0.189698 2.06287 0.819798V13.1802C2.06287 13.8103 2.83667 14.2042 3.45577 13.8891L15.5987 7.7089C16.2178 7.3938 16.2178 6.6061 15.5987 6.2911Z"
        />
      </svg>
    </media-play-button>
  </template>

  <template partial="SeekBackwardButton">
    <media-seek-backward-button
      seekoffset="{{backwardseekoffset}}"
      part="{{section ?? 'bottom'}} seek-backward button"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    >
      <svg viewBox="0 0 22 14" aria-hidden="true" slot="icon">
        <path
          d="M3.65 2.07888L0.0864 6.7279C-0.0288 6.87812 -0.0288 7.12188 0.0864 7.2721L3.65 11.9211C3.7792 12.0896 4 11.9703 4 11.7321V2.26787C4 2.02968 3.7792 1.9104 3.65 2.07888Z"
        />
        <text transform="translate(6 12)" style="font-size: 14px; font-family: 'ArialMT', 'Arial'">
          {{backwardseekoffset}}
        </text>
      </svg>
    </media-seek-backward-button>
  </template>

  <template partial="SeekForwardButton">
    <media-seek-forward-button
      seekoffset="{{forwardseekoffset}}"
      part="{{section ?? 'bottom'}} seek-forward button"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    >
      <svg viewBox="0 0 22 14" aria-hidden="true" slot="icon">
        <g>
          <text transform="translate(-1 12)" style="font-size: 14px; font-family: 'ArialMT', 'Arial'">
            {{forwardseekoffset}}
          </text>
          <path
            d="M18.35 11.9211L21.9136 7.2721C22.0288 7.12188 22.0288 6.87812 21.9136 6.7279L18.35 2.07888C18.2208 1.91041 18 2.02968 18 2.26787V11.7321C18 11.9703 18.2208 12.0896 18.35 11.9211Z"
          />
        </g>
      </svg>
    </media-seek-forward-button>
  </template>

  <template partial="MuteButton">
    <media-mute-button part="bottom mute button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg viewBox="0 0 18 14" slot="icon" class="mute-icon" aria-hidden="true">
        <g class="unmuted">
          <path
            d="M6.76786 1.21233L3.98606 3.98924H1.19937C0.593146 3.98924 0.101743 4.51375 0.101743 5.1607V6.96412L0 6.99998L0.101743 7.03583V8.83926C0.101743 9.48633 0.593146 10.0108 1.19937 10.0108H3.98606L6.76773 12.7877C7.23561 13.2547 8 12.9007 8 12.2171V1.78301C8 1.09925 7.23574 0.745258 6.76786 1.21233Z"
          />
          <path
            class="volume-low"
            d="M10 3.54781C10.7452 4.55141 11.1393 5.74511 11.1393 6.99991C11.1393 8.25471 10.7453 9.44791 10 10.4515L10.7988 11.0496C11.6734 9.87201 12.1356 8.47161 12.1356 6.99991C12.1356 5.52821 11.6735 4.12731 10.7988 2.94971L10 3.54781Z"
          />
          <path
            class="volume-medium"
            d="M12.3778 2.40086C13.2709 3.76756 13.7428 5.35806 13.7428 7.00026C13.7428 8.64246 13.2709 10.233 12.3778 11.5992L13.2106 12.1484C14.2107 10.6185 14.739 8.83796 14.739 7.00016C14.739 5.16236 14.2107 3.38236 13.2106 1.85156L12.3778 2.40086Z"
          />
          <path
            class="volume-high"
            d="M15.5981 0.75L14.7478 1.2719C15.7937 2.9919 16.3468 4.9723 16.3468 7C16.3468 9.0277 15.7937 11.0082 14.7478 12.7281L15.5981 13.25C16.7398 11.3722 17.343 9.211 17.343 7C17.343 4.789 16.7398 2.6268 15.5981 0.75Z"
          />
        </g>
        <g class="muted">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M4.39976 4.98924H1.19937C1.19429 4.98924 1.17777 4.98961 1.15296 5.01609C1.1271 5.04369 1.10174 5.09245 1.10174 5.1607V8.83926C1.10174 8.90761 1.12714 8.95641 1.15299 8.984C1.17779 9.01047 1.1943 9.01084 1.19937 9.01084H4.39977L7 11.6066V2.39357L4.39976 4.98924ZM7.47434 1.92006C7.4743 1.9201 7.47439 1.92002 7.47434 1.92006V1.92006ZM6.76773 12.7877L3.98606 10.0108H1.19937C0.593146 10.0108 0.101743 9.48633 0.101743 8.83926V7.03583L0 6.99998L0.101743 6.96412V5.1607C0.101743 4.51375 0.593146 3.98924 1.19937 3.98924H3.98606L6.76786 1.21233C7.23574 0.745258 8 1.09925 8 1.78301V12.2171C8 12.9007 7.23561 13.2547 6.76773 12.7877Z"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M15.2677 9.30323C15.463 9.49849 15.7796 9.49849 15.9749 9.30323C16.1701 9.10796 16.1701 8.79138 15.9749 8.59612L14.2071 6.82841L15.9749 5.06066C16.1702 4.8654 16.1702 4.54882 15.9749 4.35355C15.7796 4.15829 15.4631 4.15829 15.2678 4.35355L13.5 6.1213L11.7322 4.35348C11.537 4.15822 11.2204 4.15822 11.0251 4.35348C10.8298 4.54874 10.8298 4.86532 11.0251 5.06058L12.7929 6.82841L11.0251 8.59619C10.8299 8.79146 10.8299 9.10804 11.0251 9.3033C11.2204 9.49856 11.537 9.49856 11.7323 9.3033L13.5 7.53552L15.2677 9.30323Z"
          />
        </g>
      </svg>
    </media-mute-button>
  </template>

  <template partial="PipButton">
    <media-pip-button part="bottom pip button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="icon">
        <path
          d="M15.9891 0H2.011C0.9004 0 0 0.9003 0 2.0109V11.989C0 13.0996 0.9004 14 2.011 14H15.9891C17.0997 14 18 13.0997 18 11.9891V2.0109C18 0.9003 17.0997 0 15.9891 0ZM17 11.9891C17 12.5465 16.5465 13 15.9891 13H2.011C1.4536 13 1.0001 12.5465 1.0001 11.9891V2.0109C1.0001 1.4535 1.4536 0.9999 2.011 0.9999H15.9891C16.5465 0.9999 17 1.4535 17 2.0109V11.9891Z"
        />
        <path
          d="M15.356 5.67822H8.19523C8.03253 5.67822 7.90063 5.81012 7.90063 5.97282V11.3836C7.90063 11.5463 8.03253 11.6782 8.19523 11.6782H15.356C15.5187 11.6782 15.6506 11.5463 15.6506 11.3836V5.97282C15.6506 5.81012 15.5187 5.67822 15.356 5.67822Z"
        />
      </svg>
    </media-pip-button>
  </template>

  <template partial="CaptionsMenu">
    <media-captions-menu-button part="bottom captions button">
      <svg aria-hidden="true" viewBox="0 0 18 14" slot="on">
        <path
          d="M15.989 0H2.011C0.9004 0 0 0.9003 0 2.0109V11.9891C0 13.0997 0.9004 14 2.011 14H15.989C17.0997 14 18 13.0997 18 11.9891V2.0109C18 0.9003 17.0997 0 15.989 0ZM4.2292 8.7639C4.5954 9.1902 5.0935 9.4031 5.7233 9.4031C6.1852 9.4031 6.5544 9.301 6.8302 9.0969C7.1061 8.8933 7.2863 8.614 7.3702 8.26H8.4322C8.3062 8.884 8.0093 9.3733 7.5411 9.7273C7.0733 10.0813 6.4703 10.2581 5.732 10.2581C5.108 10.2581 4.5699 10.1219 4.1168 9.8489C3.6637 9.5759 3.3141 9.1946 3.0685 8.7058C2.8224 8.2165 2.6994 7.6511 2.6994 7.009C2.6994 6.3611 2.8224 5.7927 3.0685 5.3034C3.3141 4.8146 3.6637 4.4323 4.1168 4.1559C4.5699 3.88 5.108 3.7418 5.732 3.7418C6.4703 3.7418 7.0733 3.922 7.5411 4.2818C8.0094 4.6422 8.3062 5.1461 8.4322 5.794H7.3702C7.2862 5.4283 7.106 5.1368 6.8302 4.921C6.5544 4.7052 6.1852 4.5968 5.7233 4.5968C5.0934 4.5968 4.5954 4.8116 4.2292 5.2404C3.8635 5.6696 3.6804 6.259 3.6804 7.009C3.6804 7.7531 3.8635 8.3381 4.2292 8.7639ZM11.0974 8.7639C11.4636 9.1902 11.9617 9.4031 12.5915 9.4031C13.0534 9.4031 13.4226 9.301 13.6984 9.0969C13.9743 8.8933 14.1545 8.614 14.2384 8.26H15.3004C15.1744 8.884 14.8775 9.3733 14.4093 9.7273C13.9415 10.0813 13.3385 10.2581 12.6002 10.2581C11.9762 10.2581 11.4381 10.1219 10.985 9.8489C10.5319 9.5759 10.1823 9.1946 9.9367 8.7058C9.6906 8.2165 9.5676 7.6511 9.5676 7.009C9.5676 6.3611 9.6906 5.7927 9.9367 5.3034C10.1823 4.8146 10.5319 4.4323 10.985 4.1559C11.4381 3.88 11.9762 3.7418 12.6002 3.7418C13.3385 3.7418 13.9415 3.922 14.4093 4.2818C14.8776 4.6422 15.1744 5.1461 15.3004 5.794H14.2384C14.1544 5.4283 13.9742 5.1368 13.6984 4.921C13.4226 4.7052 13.0534 4.5968 12.5915 4.5968C11.9616 4.5968 11.4636 4.8116 11.0974 5.2404C10.7317 5.6696 10.5486 6.259 10.5486 7.009C10.5486 7.7531 10.7317 8.3381 11.0974 8.7639Z"
        />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 18 14" slot="off">
        <path
          d="M5.73219 10.258C5.10819 10.258 4.57009 10.1218 4.11699 9.8488C3.66389 9.5758 3.31429 9.1945 3.06869 8.7057C2.82259 8.2164 2.69958 7.651 2.69958 7.0089C2.69958 6.361 2.82259 5.7926 3.06869 5.3033C3.31429 4.8145 3.66389 4.4322 4.11699 4.1558C4.57009 3.8799 5.10819 3.7417 5.73219 3.7417C6.47049 3.7417 7.07348 3.9219 7.54128 4.2817C8.00958 4.6421 8.30638 5.146 8.43238 5.7939H7.37039C7.28639 5.4282 7.10618 5.1367 6.83039 4.9209C6.55459 4.7051 6.18538 4.5967 5.72348 4.5967C5.09358 4.5967 4.59559 4.8115 4.22939 5.2403C3.86369 5.6695 3.68058 6.2589 3.68058 7.0089C3.68058 7.753 3.86369 8.338 4.22939 8.7638C4.59559 9.1901 5.09368 9.403 5.72348 9.403C6.18538 9.403 6.55459 9.3009 6.83039 9.0968C7.10629 8.8932 7.28649 8.6139 7.37039 8.2599H8.43238C8.30638 8.8839 8.00948 9.3732 7.54128 9.7272C7.07348 10.0812 6.47049 10.258 5.73219 10.258Z"
        />
        <path
          d="M12.6003 10.258C11.9763 10.258 11.4382 10.1218 10.9851 9.8488C10.532 9.5758 10.1824 9.1945 9.93685 8.7057C9.69075 8.2164 9.56775 7.651 9.56775 7.0089C9.56775 6.361 9.69075 5.7926 9.93685 5.3033C10.1824 4.8145 10.532 4.4322 10.9851 4.1558C11.4382 3.8799 11.9763 3.7417 12.6003 3.7417C13.3386 3.7417 13.9416 3.9219 14.4094 4.2817C14.8777 4.6421 15.1745 5.146 15.3005 5.7939H14.2385C14.1545 5.4282 13.9743 5.1367 13.6985 4.9209C13.4227 4.7051 13.0535 4.5967 12.5916 4.5967C11.9617 4.5967 11.4637 4.8115 11.0975 5.2403C10.7318 5.6695 10.5487 6.2589 10.5487 7.0089C10.5487 7.753 10.7318 8.338 11.0975 8.7638C11.4637 9.1901 11.9618 9.403 12.5916 9.403C13.0535 9.403 13.4227 9.3009 13.6985 9.0968C13.9744 8.8932 14.1546 8.6139 14.2385 8.2599H15.3005C15.1745 8.8839 14.8776 9.3732 14.4094 9.7272C13.9416 10.0812 13.3386 10.258 12.6003 10.258Z"
        />
        <path
          d="M15.9891 1C16.5465 1 17 1.4535 17 2.011V11.9891C17 12.5465 16.5465 13 15.9891 13H2.0109C1.4535 13 1 12.5465 1 11.9891V2.0109C1 1.4535 1.4535 0.9999 2.0109 0.9999L15.9891 1ZM15.9891 0H2.0109C0.9003 0 0 0.9003 0 2.0109V11.9891C0 13.0997 0.9003 14 2.0109 14H15.9891C17.0997 14 18 13.0997 18 11.9891V2.0109C18 0.9003 17.0997 0 15.9891 0Z"
        />
      </svg>
    </media-captions-menu-button>
    <media-captions-menu
      hidden
      anchor="auto"
      part="bottom captions menu"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
      exportparts="menu-item"
    >
      <div slot="checked-indicator">
        <style>
          .indicator {
            position: relative;
            top: 1px;
            width: 0.9em;
            height: auto;
            fill: var(--_accent-color);
            margin-right: 5px;
          }

          [aria-checked='false'] .indicator {
            display: none;
          }
        </style>
        <svg viewBox="0 0 14 18" class="indicator">
          <path
            d="M12.252 3.48c-.115.033-.301.161-.425.291-.059.063-1.407 1.815-2.995 3.894s-2.897 3.79-2.908 3.802c-.013.014-.661-.616-1.672-1.624-.908-.905-1.702-1.681-1.765-1.723-.401-.27-.783-.211-1.176.183a1.285 1.285 0 0 0-.261.342.582.582 0 0 0-.082.35c0 .165.01.205.08.35.075.153.213.296 2.182 2.271 1.156 1.159 2.17 2.159 2.253 2.222.189.143.338.196.539.194.203-.003.412-.104.618-.299.205-.193 6.7-8.693 6.804-8.903a.716.716 0 0 0 .085-.345c.01-.179.005-.203-.062-.339-.124-.252-.45-.531-.746-.639a.784.784 0 0 0-.469-.027"
            fill-rule="evenodd"
          />
        </svg></div
    ></media-captions-menu>
  </template>

  <template partial="AirplayButton">
    <media-airplay-button part="bottom airplay button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="icon">
        <path
          d="M16.1383 0H1.8618C0.8335 0 0 0.8335 0 1.8617V10.1382C0 11.1664 0.8335 12 1.8618 12H3.076C3.1204 11.9433 3.1503 11.8785 3.2012 11.826L4.004 11H1.8618C1.3866 11 1 10.6134 1 10.1382V1.8617C1 1.3865 1.3866 0.9999 1.8618 0.9999H16.1383C16.6135 0.9999 17.0001 1.3865 17.0001 1.8617V10.1382C17.0001 10.6134 16.6135 11 16.1383 11H13.9961L14.7989 11.826C14.8499 11.8785 14.8798 11.9432 14.9241 12H16.1383C17.1665 12 18.0001 11.1664 18.0001 10.1382V1.8617C18 0.8335 17.1665 0 16.1383 0Z"
        />
        <path
          d="M9.55061 8.21903C9.39981 8.06383 9.20001 7.98633 9.00011 7.98633C8.80021 7.98633 8.60031 8.06383 8.44951 8.21903L4.09771 12.697C3.62471 13.1838 3.96961 13.9998 4.64831 13.9998H13.3518C14.0304 13.9998 14.3754 13.1838 13.9023 12.697L9.55061 8.21903Z"
        />
      </svg>
    </media-airplay-button>
  </template>

  <template partial="FullscreenButton">
    <media-fullscreen-button part="bottom fullscreen button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="enter">
        <path
          d="M1.00745 4.39539L1.01445 1.98789C1.01605 1.43049 1.47085 0.978289 2.02835 0.979989L6.39375 0.992589L6.39665 -0.007411L2.03125 -0.020011C0.920646 -0.023211 0.0176463 0.874489 0.0144463 1.98509L0.00744629 4.39539H1.00745Z"
        />
        <path
          d="M17.0144 2.03431L17.0076 4.39541H18.0076L18.0144 2.03721C18.0176 0.926712 17.1199 0.0237125 16.0093 0.0205125L11.6439 0.0078125L11.641 1.00781L16.0064 1.02041C16.5638 1.02201 17.016 1.47681 17.0144 2.03431Z"
        />
        <path
          d="M16.9925 9.60498L16.9855 12.0124C16.9839 12.5698 16.5291 13.022 15.9717 13.0204L11.6063 13.0078L11.6034 14.0078L15.9688 14.0204C17.0794 14.0236 17.9823 13.1259 17.9855 12.0153L17.9925 9.60498H16.9925Z"
        />
        <path
          d="M0.985626 11.9661L0.992426 9.60498H-0.0074737L-0.0142737 11.9632C-0.0174737 13.0738 0.880226 13.9767 1.99083 13.98L6.35623 13.9926L6.35913 12.9926L1.99373 12.98C1.43633 12.9784 0.983926 12.5236 0.985626 11.9661Z"
        />
      </svg>
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="exit">
        <path
          d="M5.39655 -0.0200195L5.38955 2.38748C5.38795 2.94488 4.93315 3.39708 4.37565 3.39538L0.0103463 3.38278L0.00744629 4.38278L4.37285 4.39538C5.48345 4.39858 6.38635 3.50088 6.38965 2.39028L6.39665 -0.0200195H5.39655Z"
        />
        <path
          d="M12.6411 2.36891L12.6479 0.0078125H11.6479L11.6411 2.36601C11.6379 3.47651 12.5356 4.37951 13.6462 4.38271L18.0116 4.39531L18.0145 3.39531L13.6491 3.38271C13.0917 3.38111 12.6395 2.92641 12.6411 2.36891Z"
        />
        <path
          d="M12.6034 14.0204L12.6104 11.613C12.612 11.0556 13.0668 10.6034 13.6242 10.605L17.9896 10.6176L17.9925 9.61759L13.6271 9.60499C12.5165 9.60179 11.6136 10.4995 11.6104 11.6101L11.6034 14.0204H12.6034Z"
        />
        <path
          d="M5.359 11.6315L5.3522 13.9926H6.3522L6.359 11.6344C6.3622 10.5238 5.4645 9.62088 4.3539 9.61758L-0.0115043 9.60498L-0.0144043 10.605L4.351 10.6176C4.9084 10.6192 5.3607 11.074 5.359 11.6315Z"
        />
      </svg>
    </media-fullscreen-button>
  </template>

  <template partial="CastButton">
    <media-cast-button part="bottom cast button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="enter">
        <path
          d="M16.0072 0H2.0291C0.9185 0 0.0181 0.9003 0.0181 2.011V5.5009C0.357 5.5016 0.6895 5.5275 1.0181 5.5669V2.011C1.0181 1.4536 1.4716 1 2.029 1H16.0072C16.5646 1 17.0181 1.4536 17.0181 2.011V11.9891C17.0181 12.5465 16.5646 13 16.0072 13H8.4358C8.4746 13.3286 8.4999 13.6611 8.4999 13.9999H16.0071C17.1177 13.9999 18.018 13.0996 18.018 11.989V2.011C18.0181 0.9003 17.1178 0 16.0072 0ZM0 6.4999V7.4999C3.584 7.4999 6.5 10.4159 6.5 13.9999H7.5C7.5 9.8642 4.1357 6.4999 0 6.4999ZM0 8.7499V9.7499C2.3433 9.7499 4.25 11.6566 4.25 13.9999H5.25C5.25 11.1049 2.895 8.7499 0 8.7499ZM0.0181 11V14H3.0181C3.0181 12.3431 1.675 11 0.0181 11Z"
        />
      </svg>
      <svg viewBox="0 0 18 14" aria-hidden="true" slot="exit">
        <path
          d="M15.9891 0H2.01103C0.900434 0 3.35947e-05 0.9003 3.35947e-05 2.011V5.5009C0.338934 5.5016 0.671434 5.5275 1.00003 5.5669V2.011C1.00003 1.4536 1.45353 1 2.01093 1H15.9891C16.5465 1 17 1.4536 17 2.011V11.9891C17 12.5465 16.5465 13 15.9891 13H8.41773C8.45653 13.3286 8.48183 13.6611 8.48183 13.9999H15.989C17.0996 13.9999 17.9999 13.0996 17.9999 11.989V2.011C18 0.9003 17.0997 0 15.9891 0ZM-0.0180664 6.4999V7.4999C3.56593 7.4999 6.48193 10.4159 6.48193 13.9999H7.48193C7.48193 9.8642 4.11763 6.4999 -0.0180664 6.4999ZM-0.0180664 8.7499V9.7499C2.32523 9.7499 4.23193 11.6566 4.23193 13.9999H5.23193C5.23193 11.1049 2.87693 8.7499 -0.0180664 8.7499ZM3.35947e-05 11V14H3.00003C3.00003 12.3431 1.65693 11 3.35947e-05 11Z"
        />
        <path d="M2.15002 5.634C5.18352 6.4207 7.57252 8.8151 8.35282 11.8499H15.8501V2.1499H2.15002V5.634Z" />
      </svg>
    </media-cast-button>
  </template>

  <template partial="LiveButton">
    <media-live-button part="{{section ?? 'top'}} live button" disabled="{{disabled}}" aria-disabled="{{disabled}}">
      <span slot="text">Live</span>
    </media-live-button>
  </template>

  <template partial="PlaybackRateMenu">
    <media-playback-rate-menu-button part="bottom playback-rate button"></media-playback-rate-menu-button>
    <media-playback-rate-menu
      hidden
      anchor="auto"
      rates="{{playbackrates}}"
      exportparts="menu-item"
      part="bottom playback-rate menu"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    ></media-playback-rate-menu>
  </template>

  <template partial="VolumeRange">
    <media-volume-range
      part="bottom volume range"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    ></media-volume-range>
  </template>

  <template partial="TimeDisplay">
    <media-time-display
      remaining="{{defaultshowremainingtime}}"
      showduration="{{!hideduration}}"
      part="bottom time display"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    ></media-time-display>
  </template>

  <template partial="TimeRange">
    <media-time-range part="bottom time range" disabled="{{disabled}}" aria-disabled="{{disabled}}" exportparts="thumb">
      <media-preview-thumbnail slot="preview"></media-preview-thumbnail>
      <media-preview-chapter-display slot="preview"></media-preview-chapter-display>
      <media-preview-time-display slot="preview"></media-preview-time-display>
      <div slot="preview" part="arrow"></div>
    </media-time-range>
  </template>

  <template partial="AudioTrackMenu">
    <media-audio-track-menu-button part="bottom audio-track button">
      <svg aria-hidden="true" slot="icon" viewBox="0 0 18 16">
        <path d="M9 15A7 7 0 1 1 9 1a7 7 0 0 1 0 14Zm0 1A8 8 0 1 0 9 0a8 8 0 0 0 0 16Z" />
        <path
          d="M5.2 6.3a.5.5 0 0 1 .5.5v2.4a.5.5 0 1 1-1 0V6.8a.5.5 0 0 1 .5-.5Zm2.4-2.4a.5.5 0 0 1 .5.5v7.2a.5.5 0 0 1-1 0V4.4a.5.5 0 0 1 .5-.5ZM10 5.5a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.4-.8a.5.5 0 0 1 .5.5v5.6a.5.5 0 0 1-1 0V5.2a.5.5 0 0 1 .5-.5Z"
        />
      </svg>
    </media-audio-track-menu-button>
    <media-audio-track-menu
      hidden
      anchor="auto"
      part="bottom audio-track menu"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
      exportparts="menu-item"
    >
      <div slot="checked-indicator">
        <style>
          .indicator {
            position: relative;
            top: 1px;
            width: 0.9em;
            height: auto;
            fill: var(--_accent-color);
            margin-right: 5px;
          }

          [aria-checked='false'] .indicator {
            display: none;
          }
        </style>
        <svg viewBox="0 0 14 18" class="indicator">
          <path
            d="M12.252 3.48c-.115.033-.301.161-.425.291-.059.063-1.407 1.815-2.995 3.894s-2.897 3.79-2.908 3.802c-.013.014-.661-.616-1.672-1.624-.908-.905-1.702-1.681-1.765-1.723-.401-.27-.783-.211-1.176.183a1.285 1.285 0 0 0-.261.342.582.582 0 0 0-.082.35c0 .165.01.205.08.35.075.153.213.296 2.182 2.271 1.156 1.159 2.17 2.159 2.253 2.222.189.143.338.196.539.194.203-.003.412-.104.618-.299.205-.193 6.7-8.693 6.804-8.903a.716.716 0 0 0 .085-.345c.01-.179.005-.203-.062-.339-.124-.252-.45-.531-.746-.639a.784.784 0 0 0-.469-.027"
            fill-rule="evenodd"
          />
        </svg>
      </div>
    </media-audio-track-menu>
  </template>

  <template partial="RenditionMenu">
    <media-rendition-menu-button part="bottom rendition button">
      <svg aria-hidden="true" slot="icon" viewBox="0 0 18 14">
        <path
          d="M2.25 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM9 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm6.75 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
        />
      </svg>
    </media-rendition-menu-button>
    <media-rendition-menu
      hidden
      anchor="auto"
      part="bottom rendition menu"
      disabled="{{disabled}}"
      aria-disabled="{{disabled}}"
    >
      <div slot="checked-indicator">
        <style>
          .indicator {
            position: relative;
            top: 1px;
            width: 0.9em;
            height: auto;
            fill: var(--_accent-color);
            margin-right: 5px;
          }

          [aria-checked='false'] .indicator {
            opacity: 0;
          }
        </style>
        <svg viewBox="0 0 14 18" class="indicator">
          <path
            d="M12.252 3.48c-.115.033-.301.161-.425.291-.059.063-1.407 1.815-2.995 3.894s-2.897 3.79-2.908 3.802c-.013.014-.661-.616-1.672-1.624-.908-.905-1.702-1.681-1.765-1.723-.401-.27-.783-.211-1.176.183a1.285 1.285 0 0 0-.261.342.582.582 0 0 0-.082.35c0 .165.01.205.08.35.075.153.213.296 2.182 2.271 1.156 1.159 2.17 2.159 2.253 2.222.189.143.338.196.539.194.203-.003.412-.104.618-.299.205-.193 6.7-8.693 6.804-8.903a.716.716 0 0 0 .085-.345c.01-.179.005-.203-.062-.339-.124-.252-.45-.531-.746-.639a.784.784 0 0 0-.469-.027"
            fill-rule="evenodd"
          />
        </svg>
      </div>
    </media-rendition-menu>
  </template>

  <template partial="MuxBadge">
    <div part="mux-badge">
      <a href="https://www.mux.com/player" target="_blank">
        <span class="mux-badge-text">Powered by</span>
        <div class="mux-badge-logo">
          <svg
            viewBox="0 0 1600 500"
            style="fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 2"
          >
            <g>
              <path
                d="M994.287,93.486c-17.121,-0 -31,-13.879 -31,-31c0,-17.121 13.879,-31 31,-31c17.121,-0 31,13.879 31,31c0,17.121 -13.879,31 -31,31m0,-93.486c-34.509,-0 -62.484,27.976 -62.484,62.486l0,187.511c0,68.943 -56.09,125.033 -125.032,125.033c-68.942,-0 -125.03,-56.09 -125.03,-125.033l0,-187.511c0,-34.51 -27.976,-62.486 -62.485,-62.486c-34.509,-0 -62.484,27.976 -62.484,62.486l0,187.511c0,137.853 112.149,250.003 249.999,250.003c137.851,-0 250.001,-112.15 250.001,-250.003l0,-187.511c0,-34.51 -27.976,-62.486 -62.485,-62.486"
                style="fill-rule: nonzero"
              ></path>
              <path
                d="M1537.51,468.511c-17.121,-0 -31,-13.879 -31,-31c0,-17.121 13.879,-31 31,-31c17.121,-0 31,13.879 31,31c0,17.121 -13.879,31 -31,31m-275.883,-218.509l-143.33,143.329c-24.402,24.402 -24.402,63.966 0,88.368c24.402,24.402 63.967,24.402 88.369,-0l143.33,-143.329l143.328,143.329c24.402,24.4 63.967,24.402 88.369,-0c24.403,-24.402 24.403,-63.966 0.001,-88.368l-143.33,-143.329l0.001,-0.004l143.329,-143.329c24.402,-24.402 24.402,-63.965 0,-88.367c-24.402,-24.402 -63.967,-24.402 -88.369,-0l-143.329,143.328l-143.329,-143.328c-24.402,-24.401 -63.967,-24.402 -88.369,-0c-24.402,24.402 -24.402,63.965 0,88.367l143.329,143.329l0,0.004Z"
                style="fill-rule: nonzero"
              ></path>
              <path
                d="M437.511,468.521c-17.121,-0 -31,-13.879 -31,-31c0,-17.121 13.879,-31 31,-31c17.121,-0 31,13.879 31,31c0,17.121 -13.879,31 -31,31m23.915,-463.762c-23.348,-9.672 -50.226,-4.327 -68.096,13.544l-143.331,143.329l-143.33,-143.329c-17.871,-17.871 -44.747,-23.216 -68.096,-13.544c-23.349,9.671 -38.574,32.455 -38.574,57.729l0,375.026c0,34.51 27.977,62.486 62.487,62.486c34.51,-0 62.486,-27.976 62.486,-62.486l0,-224.173l80.843,80.844c24.404,24.402 63.965,24.402 88.369,-0l80.843,-80.844l0,224.173c0,34.51 27.976,62.486 62.486,62.486c34.51,-0 62.486,-27.976 62.486,-62.486l0,-375.026c0,-25.274 -15.224,-48.058 -38.573,-57.729"
                style="fill-rule: nonzero"
              ></path>
            </g>
          </svg>
        </div>
      </a>
    </div>
  </template>

  <media-controller
    part="controller"
    defaultstreamtype="{{defaultstreamtype ?? 'on-demand'}}"
    breakpoints="sm:470"
    gesturesdisabled="{{disabled}}"
    hotkeys="{{hotkeys}}"
    nohotkeys="{{nohotkeys}}"
    novolumepref="{{novolumepref}}"
    audio="{{audio}}"
    noautoseektolive="{{noautoseektolive}}"
    defaultsubtitles="{{defaultsubtitles}}"
    defaultduration="{{defaultduration ?? false}}"
    keyboardforwardseekoffset="{{forwardseekoffset}}"
    keyboardbackwardseekoffset="{{backwardseekoffset}}"
    exportparts="layer, media-layer, poster-layer, vertical-layer, centered-layer, gesture-layer"
    style="--_pre-playback-place:{{preplaybackplace ?? 'center'}}"
  >
    <slot name="media" slot="media"></slot>
    <slot name="poster" slot="poster"></slot>

    <media-loading-indicator slot="centered-chrome" noautohide></media-loading-indicator>

    <template if="!audio">
      <media-error-dialog slot="dialog" noautohide></media-error-dialog>
      <!-- Pre-playback UI -->
      <!-- same for both on-demand and live -->
      <div slot="centered-chrome" class="center-controls pre-playback">
        <template if="!breakpointsm">{{>PlayButton section="center"}}</template>
        <template if="breakpointsm">{{>PrePlayButton section="center"}}</template>
      </div>

      <!-- Mux Badge -->
      <template if="proudlydisplaymuxbadge"> {{>MuxBadge}} </template>

      <!-- Autoplay centered unmute button -->
      <!--
        todo: figure out how show this with available state variables
        needs to show when:
        - autoplay is enabled
        - playback has been successful
        - audio is muted
        - in place / instead of the pre-plaback play button
        - not to show again after user has interacted with this button
          - OR user has interacted with the mute button in the control bar
      -->
      <!--
        There should be a >MuteButton to the left of the "Unmute" text, but a templating bug
        makes it appear even if commented out in the markup, add it back when code is un-commented
      -->
      <!-- <div slot="centered-chrome" class="autoplay-unmute">
        <div role="button" class="autoplay-unmute-btn">Unmute</div>
      </div> -->

      <template if="streamtype == 'on-demand'">
        <template if="breakpointsm">
          <media-control-bar part="control-bar top" slot="top-chrome">{{>TitleDisplay}} </media-control-bar>
        </template>
        {{>TimeRange}}
        <media-control-bar part="control-bar bottom">
          {{>PlayButton}} {{>SeekBackwardButton}} {{>SeekForwardButton}} {{>TimeDisplay}} {{>MuteButton}}
          {{>VolumeRange}}
          <div class="spacer"></div>
          {{>RenditionMenu}} {{>PlaybackRateMenu}} {{>AudioTrackMenu}} {{>CaptionsMenu}} {{>AirplayButton}}
          {{>CastButton}} {{>PipButton}} {{>FullscreenButton}}
        </media-control-bar>
      </template>

      <template if="streamtype == 'live'">
        <media-control-bar part="control-bar top" slot="top-chrome">
          {{>LiveButton}}
          <template if="breakpointsm"> {{>TitleDisplay}} </template>
        </media-control-bar>
        <template if="targetlivewindow > 0">{{>TimeRange}}</template>
        <media-control-bar part="control-bar bottom">
          {{>PlayButton}}
          <template if="targetlivewindow > 0">{{>SeekBackwardButton}} {{>SeekForwardButton}}</template>
          {{>MuteButton}} {{>VolumeRange}}
          <div class="spacer"></div>
          {{>RenditionMenu}} {{>AudioTrackMenu}} {{>CaptionsMenu}} {{>AirplayButton}} {{>CastButton}} {{>PipButton}}
          {{>FullscreenButton}}
        </media-control-bar>
      </template>
    </template>

    <template if="audio">
      <template if="streamtype == 'on-demand'">
        <template if="title">
          <media-control-bar part="control-bar top">{{>TitleDisplay}}</media-control-bar>
        </template>
        <media-control-bar part="control-bar bottom">
          {{>PlayButton}}
          <template if="breakpointsm"> {{>SeekBackwardButton}} {{>SeekForwardButton}} </template>
          {{>MuteButton}}
          <template if="breakpointsm">{{>VolumeRange}}</template>
          {{>TimeDisplay}} {{>TimeRange}}
          <template if="breakpointsm">{{>PlaybackRateMenu}}</template>
          {{>AirplayButton}} {{>CastButton}}
        </media-control-bar>
      </template>

      <template if="streamtype == 'live'">
        <template if="title">
          <media-control-bar part="control-bar top">{{>TitleDisplay}}</media-control-bar>
        </template>
        <media-control-bar part="control-bar bottom">
          {{>PlayButton}} {{>LiveButton section="bottom"}} {{>MuteButton}}
          <template if="breakpointsm">
            {{>VolumeRange}}
            <template if="targetlivewindow > 0"> {{>SeekBackwardButton}} {{>SeekForwardButton}} </template>
          </template>
          <template if="targetlivewindow > 0"> {{>TimeDisplay}} {{>TimeRange}} </template>
          <template if="!targetlivewindow"><div class="spacer"></div></template>
          {{>AirplayButton}} {{>CastButton}}
        </media-control-bar>
      </template>
    </template>

    <slot></slot>
  </media-controller>
</template>
`,Au=ol.createElement("template");"innerHTML"in Au&&(Au.innerHTML=sk);var Pm,$m,Zf=class extends Ll{};Zf.template=($m=(Pm=Au.content)==null?void 0:Pm.children)==null?void 0:$m[0];Jt.customElements.get("media-theme-gerwig")||Jt.customElements.define("media-theme-gerwig",Zf);var ok="gerwig",hi={SRC:"src",POSTER:"poster"},k={STYLE:"style",DEFAULT_HIDDEN_CAPTIONS:"default-hidden-captions",PRIMARY_COLOR:"primary-color",SECONDARY_COLOR:"secondary-color",ACCENT_COLOR:"accent-color",FORWARD_SEEK_OFFSET:"forward-seek-offset",BACKWARD_SEEK_OFFSET:"backward-seek-offset",PLAYBACK_TOKEN:"playback-token",THUMBNAIL_TOKEN:"thumbnail-token",STORYBOARD_TOKEN:"storyboard-token",FULLSCREEN_ELEMENT:"fullscreen-element",DRM_TOKEN:"drm-token",STORYBOARD_SRC:"storyboard-src",THUMBNAIL_TIME:"thumbnail-time",AUDIO:"audio",NOHOTKEYS:"nohotkeys",HOTKEYS:"hotkeys",PLAYBACK_RATES:"playbackrates",DEFAULT_SHOW_REMAINING_TIME:"default-show-remaining-time",DEFAULT_DURATION:"default-duration",TITLE:"title",VIDEO_TITLE:"video-title",PLACEHOLDER:"placeholder",THEME:"theme",DEFAULT_STREAM_TYPE:"default-stream-type",TARGET_LIVE_WINDOW:"target-live-window",EXTRA_SOURCE_PARAMS:"extra-source-params",NO_VOLUME_PREF:"no-volume-pref",NO_MUTED_PREF:"no-muted-pref",CAST_RECEIVER:"cast-receiver",NO_TOOLTIPS:"no-tooltips",PROUDLY_DISPLAY_MUX_BADGE:"proudly-display-mux-badge",DISABLE_PSEUDO_ENDED:"disable-pseudo-ended"},ku=["audio","backwardseekoffset","defaultduration","defaultshowremainingtime","defaultsubtitles","noautoseektolive","disabled","exportparts","forwardseekoffset","hideduration","hotkeys","nohotkeys","playbackrates","defaultstreamtype","streamtype","style","targetlivewindow","template","title","videotitle","novolumepref","nomutedpref","proudlydisplaymuxbadge"];function lk(t,e){var i,a,r;return{src:!t.playbackId&&t.src,playbackId:t.playbackId,hasSrc:!!t.playbackId||!!t.src||!!t.currentSrc,poster:t.poster,storyboard:((i=t.media)==null?void 0:i.currentSrc)&&t.storyboard,storyboardSrc:t.getAttribute(k.STORYBOARD_SRC),fullscreenElement:t.getAttribute(k.FULLSCREEN_ELEMENT),placeholder:t.getAttribute("placeholder"),themeTemplate:uk(t),thumbnailTime:!t.tokens.thumbnail&&t.thumbnailTime,autoplay:t.autoplay,crossOrigin:t.crossOrigin,loop:t.loop,noHotKeys:t.hasAttribute(k.NOHOTKEYS),hotKeys:t.getAttribute(k.HOTKEYS),muted:t.muted,paused:t.paused,preload:t.preload,envKey:t.envKey,preferCmcd:t.preferCmcd,debug:t.debug,disableTracking:t.disableTracking,disableCookies:t.disableCookies,tokens:t.tokens,beaconCollectionDomain:t.beaconCollectionDomain,maxResolution:t.maxResolution,minResolution:t.minResolution,maxAutoResolution:t.maxAutoResolution,programStartTime:t.programStartTime,programEndTime:t.programEndTime,assetStartTime:t.assetStartTime,assetEndTime:t.assetEndTime,renditionOrder:t.renditionOrder,metadata:t.metadata,playerInitTime:t.playerInitTime,playerSoftwareName:t.playerSoftwareName,playerSoftwareVersion:t.playerSoftwareVersion,startTime:t.startTime,preferPlayback:t.preferPlayback,audio:t.audio,defaultStreamType:t.defaultStreamType,targetLiveWindow:t.getAttribute(y.TARGET_LIVE_WINDOW),streamType:Jc(t.getAttribute(y.STREAM_TYPE)),primaryColor:t.getAttribute(k.PRIMARY_COLOR),secondaryColor:t.getAttribute(k.SECONDARY_COLOR),accentColor:t.getAttribute(k.ACCENT_COLOR),forwardSeekOffset:t.forwardSeekOffset,backwardSeekOffset:t.backwardSeekOffset,defaultHiddenCaptions:t.defaultHiddenCaptions,defaultDuration:t.defaultDuration,defaultShowRemainingTime:t.defaultShowRemainingTime,hideDuration:ck(t),playbackRates:t.getAttribute(k.PLAYBACK_RATES),customDomain:(a=t.getAttribute(y.CUSTOM_DOMAIN))!=null?a:void 0,title:t.getAttribute(k.TITLE),videoTitle:(r=t.getAttribute(k.VIDEO_TITLE))!=null?r:t.getAttribute(k.TITLE),novolumepref:t.hasAttribute(k.NO_VOLUME_PREF),nomutedpref:t.hasAttribute(k.NO_MUTED_PREF),proudlyDisplayMuxBadge:t.hasAttribute(k.PROUDLY_DISPLAY_MUX_BADGE),castReceiver:t.castReceiver,disablePseudoEnded:t.hasAttribute(k.DISABLE_PSEUDO_ENDED),capRenditionToPlayerSize:t.capRenditionToPlayerSize,...e,extraSourceParams:t.extraSourceParams}}var dk=Fv.formatErrorMessage;Fv.formatErrorMessage=t=>{var e,i;if(t instanceof L){let a=rk(t,!1);return`
      ${a!=null&&a.title?`<h3>${a.title}</h3>`:""}
      ${a!=null&&a.message||a!=null&&a.linkUrl?`<p>
        ${a==null?void 0:a.message}
        ${a!=null&&a.linkUrl?`<a
              href="${a.linkUrl}"
              target="_blank"
              rel="external noopener"
              aria-label="${(e=a.linkText)!=null?e:""} ${O("(opens in a new window)")}"
              >${(i=a.linkText)!=null?i:a.linkUrl}</a
            >`:""}
      </p>`:""}
    `}return dk(t)};function uk(t){var e,i;let a=t.theme;if(a){let r=(i=(e=t.getRootNode())==null?void 0:e.getElementById)==null?void 0:i.call(e,a);if(r&&r instanceof HTMLTemplateElement)return r;a.startsWith("media-theme-")||(a=`media-theme-${a}`);let n=Jt.customElements.get(a);if(n!=null&&n.template)return n.template}}function ck(t){var e;let i=(e=t.mediaController)==null?void 0:e.querySelector("media-time-display");return i&&getComputedStyle(i).getPropertyValue("--media-duration-display-display").trim()==="none"}function Um(t){let e=t.videoTitle?{video_title:t.videoTitle}:{};return t.getAttributeNames().filter(i=>i.startsWith("metadata-")).reduce((i,a)=>{let r=t.getAttribute(a);return r!==null&&(i[a.replace(/^metadata-/,"").replace(/-/g,"_")]=r),i},e)}var hk=Object.values(y),mk=Object.values(hi),pk=Object.values(k),Hm=qf(),Bm="mux-player",Wm={isDialogOpen:!1},vk={redundant_streams:!0},Lo,Ln,Co,da,Do,Cn,ll,dl,_r,Dn,br,ul,pe,mi,Xf,wu,fa,Fm,Km,Vm,qm,fk=class extends xm{constructor(){super(),Ue(this,pe),Ue(this,Lo),Ue(this,Ln,!1),Ue(this,Co,{}),Ue(this,da,!0),Ue(this,Do,new xA(this,"hotkeys")),Ue(this,Cn),Ue(this,ll,()=>Ee(this,pe,fa).call(this)),Ue(this,dl,()=>Ee(this,pe,fa).call(this)),Ue(this,_r,()=>Ee(this,pe,fa).call(this)),Ue(this,Dn),Ue(this,br,{...Wm,onCloseErrorDialog:t=>{var e;((e=t.composedPath()[0])==null?void 0:e.localName)==="media-error-dialog"&&Ee(this,pe,wu).call(this,{isDialogOpen:!1})},onFocusInErrorDialog:t=>{var e;((e=t.composedPath()[0])==null?void 0:e.localName)==="media-error-dialog"&&(Kf(this,ol.activeElement)||t.preventDefault())}}),Ue(this,ul,t=>{var e;let i=(e=this.media)==null?void 0:e.error;if(!(i instanceof L)){let{message:r,code:n}=i??{};i=new L(r,n)}if(!(i!=null&&i.fatal)){ci(i),i.data&&ci(`${i.name} data:`,i.data);return}let a=jf(i);a.message&&Dm(a),ot(i),i.data&&ot(`${i.name} data:`,i.data),Ee(this,pe,wu).call(this,{isDialogOpen:!0})}),Ze(this,Lo,Pu()),this.attachShadow({mode:"open"}),Ee(this,pe,Xf).call(this),this.isConnected&&Ee(this,pe,mi).call(this)}static get NAME(){return Bm}static get VERSION(){return Hm}static get observedAttributes(){var t;return[...(t=xm.observedAttributes)!=null?t:[],...mk,...hk,...pk]}get mediaTheme(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("media-theme")}get mediaController(){var t,e;return(e=(t=this.mediaTheme)==null?void 0:t.shadowRoot)==null?void 0:e.querySelector("media-controller")}connectedCallback(){Ee(this,pe,mi).call(this);let t=this.media;t&&(t.metadata=Um(this))}disconnectedCallback(){var t,e,i,a,r,n,s,o;(t=B(this,Cn))==null||t.disconnect(),(e=this.media)==null||e.removeEventListener("streamtypechange",B(this,ll)),(i=this.media)==null||i.removeEventListener("loadstart",B(this,dl)),this.removeEventListener("error",B(this,ul)),this.media&&(this.media.errorTranslator=void 0),(r=(a=this.media)==null?void 0:a.textTracks)==null||r.removeEventListener("addtrack",B(this,_r)),(s=(n=this.media)==null?void 0:n.textTracks)==null||s.removeEventListener("removetrack",B(this,_r)),(o=B(this,Dn))==null||o.call(this),Ze(this,Dn,void 0),Ze(this,Ln,!1)}attributeChangedCallback(t,e,i){switch(Ee(this,pe,mi).call(this),super.attributeChangedCallback(t,e,i),t){case k.HOTKEYS:B(this,Do).value=i;break;case k.THUMBNAIL_TIME:{i!=null&&this.tokens.thumbnail&&ci(O("Use of thumbnail-time with thumbnail-token is currently unsupported. Ignore thumbnail-time.").toString());break}case k.THUMBNAIL_TOKEN:{if(i){let a=cr(i);if(a){let{aud:r}=a,n=yn.THUMBNAIL;r!==n&&ci(O("The {tokenNamePrefix}-token has an incorrect aud value: {aud}. aud value should be {expectedAud}.").format({aud:r,expectedAud:n,tokenNamePrefix:"thumbnail"}))}}break}case k.STORYBOARD_TOKEN:{if(i){let a=cr(i);if(a){let{aud:r}=a,n=yn.STORYBOARD;r!==n&&ci(O("The {tokenNamePrefix}-token has an incorrect aud value: {aud}. aud value should be {expectedAud}.").format({aud:r,expectedAud:n,tokenNamePrefix:"storyboard"}))}}break}case k.DRM_TOKEN:{if(i){let a=cr(i);if(a){let{aud:r}=a,n=yn.DRM;r!==n&&ci(O("The {tokenNamePrefix}-token has an incorrect aud value: {aud}. aud value should be {expectedAud}.").format({aud:r,expectedAud:n,tokenNamePrefix:"drm"}))}}break}case y.PLAYBACK_ID:{i!=null&&i.includes("?token")&&ot(O("The specificed playback ID {playbackId} contains a token which must be provided via the playback-token attribute.").format({playbackId:i}));break}case y.STREAM_TYPE:{i&&![J.LIVE,J.ON_DEMAND,J.UNKNOWN].includes(i)?["ll-live","live:dvr","ll-live:dvr"].includes(this.streamType)?this.targetLiveWindow=i.includes("dvr")?Number.POSITIVE_INFINITY:0:Dm({file:"invalid-stream-type.md",message:O("Invalid stream-type value supplied: `{streamType}`. Please provide stream-type as either: `on-demand` or `live`").format({streamType:this.streamType})}):i===J.LIVE?this.getAttribute(k.TARGET_LIVE_WINDOW)==null&&(this.targetLiveWindow=0):this.targetLiveWindow=Number.NaN;break}case k.FULLSCREEN_ELEMENT:{if(i!=null||i!==e){let a=ol.getElementById(i),r=a==null?void 0:a.querySelector("mux-player");this.mediaController&&a&&r&&(this.mediaController.fullscreenElement=a)}break}case y.CAP_RENDITION_TO_PLAYER_SIZE:{(i==null||i!==e)&&(this.capRenditionToPlayerSize=i!=null?!0:void 0);break}}[y.PLAYBACK_ID,hi.SRC,k.PLAYBACK_TOKEN].includes(t)&&e!==i&&Ze(this,br,{...B(this,br),...Wm}),Ee(this,pe,fa).call(this,{[MA(t)]:i})}async requestFullscreen(t){var e;if(!(!this.mediaController||this.mediaController.hasAttribute(h.MEDIA_IS_FULLSCREEN)))return(e=this.mediaController)==null||e.dispatchEvent(new Jt.CustomEvent(D.MEDIA_ENTER_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0})),new Promise((i,a)=>{var r;(r=this.mediaController)==null||r.addEventListener(ni.MEDIA_IS_FULLSCREEN,()=>i(),{once:!0})})}async exitFullscreen(){var t;if(!(!this.mediaController||!this.mediaController.hasAttribute(h.MEDIA_IS_FULLSCREEN)))return(t=this.mediaController)==null||t.dispatchEvent(new Jt.CustomEvent(D.MEDIA_EXIT_FULLSCREEN_REQUEST,{composed:!0,bubbles:!0})),new Promise((e,i)=>{var a;(a=this.mediaController)==null||a.addEventListener(ni.MEDIA_IS_FULLSCREEN,()=>e(),{once:!0})})}get preferCmcd(){var t;return(t=this.getAttribute(y.PREFER_CMCD))!=null?t:void 0}set preferCmcd(t){t!==this.preferCmcd&&(t?No.includes(t)?this.setAttribute(y.PREFER_CMCD,t):ci(`Invalid value for preferCmcd. Must be one of ${No.join()}`):this.removeAttribute(y.PREFER_CMCD))}get hasPlayed(){var t,e;return(e=(t=this.mediaController)==null?void 0:t.hasAttribute(h.MEDIA_HAS_PLAYED))!=null?e:!1}get inLiveWindow(){var t;return(t=this.mediaController)==null?void 0:t.hasAttribute(h.MEDIA_TIME_IS_LIVE)}get _hls(){var t;return(t=this.media)==null?void 0:t._hls}get mux(){var t;return(t=this.media)==null?void 0:t.mux}get theme(){var t;return(t=this.getAttribute(k.THEME))!=null?t:ok}set theme(t){this.setAttribute(k.THEME,`${t}`)}get themeProps(){let t=this.mediaTheme;if(!t)return;let e={};for(let i of t.getAttributeNames()){if(ku.includes(i))continue;let a=t.getAttribute(i);e[Wf(i)]=a===""?!0:a}return e}set themeProps(t){var e,i;Ee(this,pe,mi).call(this);let a={...this.themeProps,...t};for(let r in a){if(ku.includes(r))continue;let n=t==null?void 0:t[r];typeof n=="boolean"||n==null?(e=this.mediaTheme)==null||e.toggleAttribute(Tu(r),!!n):(i=this.mediaTheme)==null||i.setAttribute(Tu(r),n)}}get playbackId(){var t;return(t=this.getAttribute(y.PLAYBACK_ID))!=null?t:void 0}set playbackId(t){t?this.setAttribute(y.PLAYBACK_ID,t):this.removeAttribute(y.PLAYBACK_ID)}get src(){var t,e;return this.playbackId?(t=ta(this,hi.SRC))!=null?t:void 0:(e=this.getAttribute(hi.SRC))!=null?e:void 0}set src(t){t?this.setAttribute(hi.SRC,t):this.removeAttribute(hi.SRC)}get poster(){var t;let e=this.getAttribute(hi.POSTER);if(e!=null)return e;let{tokens:i}=this;if(i.playback&&!i.thumbnail){ci("Missing expected thumbnail token. No poster image will be shown");return}if(this.playbackId&&!this.audio)return LA(this.playbackId,{customDomain:this.customDomain,thumbnailTime:(t=this.thumbnailTime)!=null?t:this.startTime,programTime:this.programStartTime,token:i.thumbnail})}set poster(t){t||t===""?this.setAttribute(hi.POSTER,t):this.removeAttribute(hi.POSTER)}get storyboardSrc(){var t;return(t=this.getAttribute(k.STORYBOARD_SRC))!=null?t:void 0}set storyboardSrc(t){t?this.setAttribute(k.STORYBOARD_SRC,t):this.removeAttribute(k.STORYBOARD_SRC)}get storyboard(){let{tokens:t}=this;if(this.storyboardSrc&&!t.storyboard)return this.storyboardSrc;if(!(this.audio||!this.playbackId||!this.streamType||[J.LIVE,J.UNKNOWN].includes(this.streamType)||t.playback&&!t.storyboard))return CA(this.playbackId,{customDomain:this.customDomain,token:t.storyboard,programStartTime:this.programStartTime,programEndTime:this.programEndTime})}get audio(){return this.hasAttribute(k.AUDIO)}set audio(t){if(!t){this.removeAttribute(k.AUDIO);return}this.setAttribute(k.AUDIO,"")}get hotkeys(){return B(this,Do)}get nohotkeys(){return this.hasAttribute(k.NOHOTKEYS)}set nohotkeys(t){if(!t){this.removeAttribute(k.NOHOTKEYS);return}this.setAttribute(k.NOHOTKEYS,"")}get thumbnailTime(){return st(this.getAttribute(k.THUMBNAIL_TIME))}set thumbnailTime(t){this.setAttribute(k.THUMBNAIL_TIME,`${t}`)}get videoTitle(){var t,e;return(e=(t=this.getAttribute(k.VIDEO_TITLE))!=null?t:this.getAttribute(k.TITLE))!=null?e:""}set videoTitle(t){t!==this.videoTitle&&(t?this.setAttribute(k.VIDEO_TITLE,t):this.removeAttribute(k.VIDEO_TITLE))}get placeholder(){var t;return(t=ta(this,k.PLACEHOLDER))!=null?t:""}set placeholder(t){this.setAttribute(k.PLACEHOLDER,`${t}`)}get primaryColor(){var t,e;let i=this.getAttribute(k.PRIMARY_COLOR);if(i!=null||this.mediaTheme&&(i=(e=(t=Jt.getComputedStyle(this.mediaTheme))==null?void 0:t.getPropertyValue("--_primary-color"))==null?void 0:e.trim(),i))return i}set primaryColor(t){this.setAttribute(k.PRIMARY_COLOR,`${t}`)}get secondaryColor(){var t,e;let i=this.getAttribute(k.SECONDARY_COLOR);if(i!=null||this.mediaTheme&&(i=(e=(t=Jt.getComputedStyle(this.mediaTheme))==null?void 0:t.getPropertyValue("--_secondary-color"))==null?void 0:e.trim(),i))return i}set secondaryColor(t){this.setAttribute(k.SECONDARY_COLOR,`${t}`)}get accentColor(){var t,e;let i=this.getAttribute(k.ACCENT_COLOR);if(i!=null||this.mediaTheme&&(i=(e=(t=Jt.getComputedStyle(this.mediaTheme))==null?void 0:t.getPropertyValue("--_accent-color"))==null?void 0:e.trim(),i))return i}set accentColor(t){this.setAttribute(k.ACCENT_COLOR,`${t}`)}get defaultShowRemainingTime(){return this.hasAttribute(k.DEFAULT_SHOW_REMAINING_TIME)}set defaultShowRemainingTime(t){t?this.setAttribute(k.DEFAULT_SHOW_REMAINING_TIME,""):this.removeAttribute(k.DEFAULT_SHOW_REMAINING_TIME)}get playbackRates(){if(this.hasAttribute(k.PLAYBACK_RATES))return this.getAttribute(k.PLAYBACK_RATES).trim().split(/\s*,?\s+/).map(t=>Number(t)).filter(t=>!Number.isNaN(t)).sort((t,e)=>t-e)}set playbackRates(t){if(!t){this.removeAttribute(k.PLAYBACK_RATES);return}this.setAttribute(k.PLAYBACK_RATES,t.join(" "))}get forwardSeekOffset(){var t;return(t=st(this.getAttribute(k.FORWARD_SEEK_OFFSET)))!=null?t:10}set forwardSeekOffset(t){this.setAttribute(k.FORWARD_SEEK_OFFSET,`${t}`)}get backwardSeekOffset(){var t;return(t=st(this.getAttribute(k.BACKWARD_SEEK_OFFSET)))!=null?t:10}set backwardSeekOffset(t){this.setAttribute(k.BACKWARD_SEEK_OFFSET,`${t}`)}get defaultHiddenCaptions(){return this.hasAttribute(k.DEFAULT_HIDDEN_CAPTIONS)}set defaultHiddenCaptions(t){t?this.setAttribute(k.DEFAULT_HIDDEN_CAPTIONS,""):this.removeAttribute(k.DEFAULT_HIDDEN_CAPTIONS)}get defaultDuration(){return st(this.getAttribute(k.DEFAULT_DURATION))}set defaultDuration(t){t==null?this.removeAttribute(k.DEFAULT_DURATION):this.setAttribute(k.DEFAULT_DURATION,`${t}`)}get playerInitTime(){return this.hasAttribute(y.PLAYER_INIT_TIME)?st(this.getAttribute(y.PLAYER_INIT_TIME)):B(this,Lo)}set playerInitTime(t){t!=this.playerInitTime&&(t==null?this.removeAttribute(y.PLAYER_INIT_TIME):this.setAttribute(y.PLAYER_INIT_TIME,`${+t}`))}get playerSoftwareName(){var t;return(t=this.getAttribute(y.PLAYER_SOFTWARE_NAME))!=null?t:Bm}get playerSoftwareVersion(){var t;return(t=this.getAttribute(y.PLAYER_SOFTWARE_VERSION))!=null?t:Hm}get beaconCollectionDomain(){var t;return(t=this.getAttribute(y.BEACON_COLLECTION_DOMAIN))!=null?t:void 0}set beaconCollectionDomain(t){t!==this.beaconCollectionDomain&&(t?this.setAttribute(y.BEACON_COLLECTION_DOMAIN,t):this.removeAttribute(y.BEACON_COLLECTION_DOMAIN))}get maxResolution(){var t;return(t=this.getAttribute(y.MAX_RESOLUTION))!=null?t:void 0}set maxResolution(t){t!==this.maxResolution&&(t?this.setAttribute(y.MAX_RESOLUTION,t):this.removeAttribute(y.MAX_RESOLUTION))}get minResolution(){var t;return(t=this.getAttribute(y.MIN_RESOLUTION))!=null?t:void 0}set minResolution(t){t!==this.minResolution&&(t?this.setAttribute(y.MIN_RESOLUTION,t):this.removeAttribute(y.MIN_RESOLUTION))}get maxAutoResolution(){var t;return(t=this.getAttribute(y.MAX_AUTO_RESOLUTION))!=null?t:void 0}set maxAutoResolution(t){t==null?this.removeAttribute(y.MAX_AUTO_RESOLUTION):this.setAttribute(y.MAX_AUTO_RESOLUTION,t)}get renditionOrder(){var t;return(t=this.getAttribute(y.RENDITION_ORDER))!=null?t:void 0}set renditionOrder(t){t!==this.renditionOrder&&(t?this.setAttribute(y.RENDITION_ORDER,t):this.removeAttribute(y.RENDITION_ORDER))}get programStartTime(){return st(this.getAttribute(y.PROGRAM_START_TIME))}set programStartTime(t){t==null?this.removeAttribute(y.PROGRAM_START_TIME):this.setAttribute(y.PROGRAM_START_TIME,`${t}`)}get programEndTime(){return st(this.getAttribute(y.PROGRAM_END_TIME))}set programEndTime(t){t==null?this.removeAttribute(y.PROGRAM_END_TIME):this.setAttribute(y.PROGRAM_END_TIME,`${t}`)}get assetStartTime(){return st(this.getAttribute(y.ASSET_START_TIME))}set assetStartTime(t){t==null?this.removeAttribute(y.ASSET_START_TIME):this.setAttribute(y.ASSET_START_TIME,`${t}`)}get assetEndTime(){return st(this.getAttribute(y.ASSET_END_TIME))}set assetEndTime(t){t==null?this.removeAttribute(y.ASSET_END_TIME):this.setAttribute(y.ASSET_END_TIME,`${t}`)}get extraSourceParams(){return this.hasAttribute(k.EXTRA_SOURCE_PARAMS)?[...new URLSearchParams(this.getAttribute(k.EXTRA_SOURCE_PARAMS)).entries()].reduce((t,[e,i])=>(t[e]=i,t),{}):vk}set extraSourceParams(t){t==null?this.removeAttribute(k.EXTRA_SOURCE_PARAMS):this.setAttribute(k.EXTRA_SOURCE_PARAMS,new URLSearchParams(t).toString())}get customDomain(){var t;return(t=this.getAttribute(y.CUSTOM_DOMAIN))!=null?t:void 0}set customDomain(t){t!==this.customDomain&&(t?this.setAttribute(y.CUSTOM_DOMAIN,t):this.removeAttribute(y.CUSTOM_DOMAIN))}get envKey(){var t;return(t=ta(this,y.ENV_KEY))!=null?t:void 0}set envKey(t){this.setAttribute(y.ENV_KEY,`${t}`)}get noVolumePref(){return this.hasAttribute(k.NO_VOLUME_PREF)}set noVolumePref(t){t?this.setAttribute(k.NO_VOLUME_PREF,""):this.removeAttribute(k.NO_VOLUME_PREF)}get noMutedPref(){return this.hasAttribute(k.NO_MUTED_PREF)}set noMutedPref(t){t?this.setAttribute(k.NO_MUTED_PREF,""):this.removeAttribute(k.NO_MUTED_PREF)}get debug(){return ta(this,y.DEBUG)!=null}set debug(t){t?this.setAttribute(y.DEBUG,""):this.removeAttribute(y.DEBUG)}get disableTracking(){return ta(this,y.DISABLE_TRACKING)!=null}set disableTracking(t){this.toggleAttribute(y.DISABLE_TRACKING,!!t)}get disableCookies(){return ta(this,y.DISABLE_COOKIES)!=null}set disableCookies(t){t?this.setAttribute(y.DISABLE_COOKIES,""):this.removeAttribute(y.DISABLE_COOKIES)}get streamType(){var t,e,i;return(i=(e=this.getAttribute(y.STREAM_TYPE))!=null?e:(t=this.media)==null?void 0:t.streamType)!=null?i:J.UNKNOWN}set streamType(t){this.setAttribute(y.STREAM_TYPE,`${t}`)}get defaultStreamType(){var t,e,i;return(i=(e=this.getAttribute(k.DEFAULT_STREAM_TYPE))!=null?e:(t=this.mediaController)==null?void 0:t.getAttribute(k.DEFAULT_STREAM_TYPE))!=null?i:J.ON_DEMAND}set defaultStreamType(t){t?this.setAttribute(k.DEFAULT_STREAM_TYPE,t):this.removeAttribute(k.DEFAULT_STREAM_TYPE)}get targetLiveWindow(){var t,e;return this.hasAttribute(k.TARGET_LIVE_WINDOW)?+this.getAttribute(k.TARGET_LIVE_WINDOW):(e=(t=this.media)==null?void 0:t.targetLiveWindow)!=null?e:Number.NaN}set targetLiveWindow(t){t==this.targetLiveWindow||Number.isNaN(t)&&Number.isNaN(this.targetLiveWindow)||(t==null?this.removeAttribute(k.TARGET_LIVE_WINDOW):this.setAttribute(k.TARGET_LIVE_WINDOW,`${+t}`))}get liveEdgeStart(){var t;return(t=this.media)==null?void 0:t.liveEdgeStart}get startTime(){return st(ta(this,y.START_TIME))}set startTime(t){this.setAttribute(y.START_TIME,`${t}`)}get preferPlayback(){let t=this.getAttribute(y.PREFER_PLAYBACK);if(t===ei.MSE||t===ei.NATIVE)return t}set preferPlayback(t){t!==this.preferPlayback&&(t===ei.MSE||t===ei.NATIVE?this.setAttribute(y.PREFER_PLAYBACK,t):this.removeAttribute(y.PREFER_PLAYBACK))}get metadata(){var t;return(t=this.media)==null?void 0:t.metadata}set metadata(t){if(Ee(this,pe,mi).call(this),!this.media){ot("underlying media element missing when trying to set metadata. metadata will not be set.");return}this.media.metadata={...Um(this),...t}}get _hlsConfig(){var t;return(t=this.media)==null?void 0:t._hlsConfig}set _hlsConfig(t){if(Ee(this,pe,mi).call(this),!this.media){ot("underlying media element missing when trying to set _hlsConfig. _hlsConfig will not be set.");return}this.media._hlsConfig=t}async addCuePoints(t){var e;if(Ee(this,pe,mi).call(this),!this.media){ot("underlying media element missing when trying to addCuePoints. cuePoints will not be added.");return}return(e=this.media)==null?void 0:e.addCuePoints(t)}get activeCuePoint(){var t;return(t=this.media)==null?void 0:t.activeCuePoint}get cuePoints(){var t,e;return(e=(t=this.media)==null?void 0:t.cuePoints)!=null?e:[]}addChapters(t){var e;if(Ee(this,pe,mi).call(this),!this.media){ot("underlying media element missing when trying to addChapters. chapters will not be added.");return}return(e=this.media)==null?void 0:e.addChapters(t)}get activeChapter(){var t;return(t=this.media)==null?void 0:t.activeChapter}get chapters(){var t,e;return(e=(t=this.media)==null?void 0:t.chapters)!=null?e:[]}getStartDate(){var t;return(t=this.media)==null?void 0:t.getStartDate()}get currentPdt(){var t;return(t=this.media)==null?void 0:t.currentPdt}get tokens(){let t=this.getAttribute(k.PLAYBACK_TOKEN),e=this.getAttribute(k.DRM_TOKEN),i=this.getAttribute(k.THUMBNAIL_TOKEN),a=this.getAttribute(k.STORYBOARD_TOKEN);return{...B(this,Co),...t!=null?{playback:t}:{},...e!=null?{drm:e}:{},...i!=null?{thumbnail:i}:{},...a!=null?{storyboard:a}:{}}}set tokens(t){Ze(this,Co,t??{})}get playbackToken(){var t;return(t=this.getAttribute(k.PLAYBACK_TOKEN))!=null?t:void 0}set playbackToken(t){this.setAttribute(k.PLAYBACK_TOKEN,`${t}`)}get drmToken(){var t;return(t=this.getAttribute(k.DRM_TOKEN))!=null?t:void 0}set drmToken(t){this.setAttribute(k.DRM_TOKEN,`${t}`)}get thumbnailToken(){var t;return(t=this.getAttribute(k.THUMBNAIL_TOKEN))!=null?t:void 0}set thumbnailToken(t){this.setAttribute(k.THUMBNAIL_TOKEN,`${t}`)}get storyboardToken(){var t;return(t=this.getAttribute(k.STORYBOARD_TOKEN))!=null?t:void 0}set storyboardToken(t){this.setAttribute(k.STORYBOARD_TOKEN,`${t}`)}addTextTrack(t,e,i,a){var r;let n=(r=this.media)==null?void 0:r.nativeEl;if(n)return Mu(n,t,e,i,a)}removeTextTrack(t){var e;let i=(e=this.media)==null?void 0:e.nativeEl;if(i)return ig(i,t)}get textTracks(){var t;return(t=this.media)==null?void 0:t.textTracks}get castReceiver(){var t;return(t=this.getAttribute(k.CAST_RECEIVER))!=null?t:void 0}set castReceiver(t){t!==this.castReceiver&&(t?this.setAttribute(k.CAST_RECEIVER,t):this.removeAttribute(k.CAST_RECEIVER))}get castCustomData(){var t;return(t=this.media)==null?void 0:t.castCustomData}set castCustomData(t){if(!this.media){ot("underlying media element missing when trying to set castCustomData. castCustomData will not be set.");return}this.media.castCustomData=t}get noTooltips(){return this.hasAttribute(k.NO_TOOLTIPS)}set noTooltips(t){if(!t){this.removeAttribute(k.NO_TOOLTIPS);return}this.setAttribute(k.NO_TOOLTIPS,"")}get proudlyDisplayMuxBadge(){return this.hasAttribute(k.PROUDLY_DISPLAY_MUX_BADGE)}set proudlyDisplayMuxBadge(t){t?this.setAttribute(k.PROUDLY_DISPLAY_MUX_BADGE,""):this.removeAttribute(k.PROUDLY_DISPLAY_MUX_BADGE)}get capRenditionToPlayerSize(){var t;return(t=this.media)==null?void 0:t.capRenditionToPlayerSize}set capRenditionToPlayerSize(t){if(!this.media){ot("underlying media element missing when trying to set capRenditionToPlayerSize");return}this.media.capRenditionToPlayerSize=t}};Lo=new WeakMap,Ln=new WeakMap,Co=new WeakMap,da=new WeakMap,Do=new WeakMap,Cn=new WeakMap,ll=new WeakMap,dl=new WeakMap,_r=new WeakMap,Dn=new WeakMap,br=new WeakMap,ul=new WeakMap,pe=new WeakSet,mi=function(){var t,e,i,a;if(!B(this,Ln)){Ze(this,Ln,!0),Ee(this,pe,fa).call(this);try{if(customElements.upgrade(this.mediaTheme),!(this.mediaTheme instanceof Jt.HTMLElement))throw""}catch{ot("<media-theme> failed to upgrade!")}try{customElements.upgrade(this.media)}catch{ot("underlying media element failed to upgrade!")}try{if(customElements.upgrade(this.mediaController),!(this.mediaController instanceof O1))throw""}catch{ot("<media-controller> failed to upgrade!")}Ee(this,pe,Fm).call(this),Ee(this,pe,Km).call(this),Ee(this,pe,Vm).call(this),Ze(this,da,(e=(t=this.mediaController)==null?void 0:t.hasAttribute(P.USER_INACTIVE))!=null?e:!0),Ee(this,pe,qm).call(this),(i=this.media)==null||i.addEventListener("streamtypechange",B(this,ll)),(a=this.media)==null||a.addEventListener("loadstart",B(this,dl))}},Xf=function(){var t,e;try{(t=window==null?void 0:window.CSS)==null||t.registerProperty({name:"--media-primary-color",syntax:"<color>",inherits:!0}),(e=window==null?void 0:window.CSS)==null||e.registerProperty({name:"--media-secondary-color",syntax:"<color>",inherits:!0})}catch{}},wu=function(t){Object.assign(B(this,br),t),Ee(this,pe,fa).call(this)},fa=function(t={}){QA(ZA(lk(this,{...B(this,br),...t})),this.shadowRoot)},Fm=function(){let t=e=>{var i,a;if(!(e!=null&&e.startsWith("theme-")))return;let r=e.replace(/^theme-/,"");if(ku.includes(r))return;let n=this.getAttribute(e);n!=null?(i=this.mediaTheme)==null||i.setAttribute(r,n):(a=this.mediaTheme)==null||a.removeAttribute(r)};Ze(this,Cn,new MutationObserver(e=>{for(let{attributeName:i}of e)t(i)})),B(this,Cn).observe(this,{attributes:!0}),this.getAttributeNames().forEach(t)},Km=function(){this.addEventListener("error",B(this,ul)),this.media&&(this.media.errorTranslator=(t={})=>{var e,i,a;if(!(((e=this.media)==null?void 0:e.error)instanceof L))return t;let r=jf((i=this.media)==null?void 0:i.error);return{player_error_code:(a=this.media)==null?void 0:a.error.code,player_error_message:r.message?String(r.message):t.player_error_message,player_error_context:r.context?String(r.context):t.player_error_context}})},Vm=function(){var t,e,i,a;(e=(t=this.media)==null?void 0:t.textTracks)==null||e.addEventListener("addtrack",B(this,_r)),(a=(i=this.media)==null?void 0:i.textTracks)==null||a.addEventListener("removetrack",B(this,_r))},qm=function(){var t,e;if(!/Firefox/i.test(navigator.userAgent))return;let i,a=new WeakMap,r=()=>this.streamType===J.LIVE&&!this.secondaryColor&&this.offsetWidth>=800,n=(c,p,m=!1)=>{r()||Array.from(c&&c.activeCues||[]).forEach(u=>{if(!(!u.snapToLines||u.line<-5||u.line>=0&&u.line<10))if(!p||this.paused){let d=u.text.split(`
`).length,v=-3;this.streamType===J.LIVE&&(v=-2);let f=v-d;if(u.line===f&&!m)return;a.has(u)||a.set(u,u.line),u.line=f}else setTimeout(()=>{u.line=a.get(u)||"auto"},500)})},s=()=>{var c,p;n(i,(p=(c=this.mediaController)==null?void 0:c.hasAttribute(P.USER_INACTIVE))!=null?p:!1)},o=()=>{var c,p;let m=Array.from(((p=(c=this.mediaController)==null?void 0:c.media)==null?void 0:p.textTracks)||[]).filter(u=>["subtitles","captions"].includes(u.kind)&&u.mode==="showing")[0];m!==i&&(i==null||i.removeEventListener("cuechange",s)),i=m,i==null||i.addEventListener("cuechange",s),n(i,B(this,da))};o(),(t=this.textTracks)==null||t.addEventListener("change",o),(e=this.textTracks)==null||e.addEventListener("addtrack",o);let l=()=>{var c,p;let m=(p=(c=this.mediaController)==null?void 0:c.hasAttribute(P.USER_INACTIVE))!=null?p:!0;B(this,da)!==m&&(Ze(this,da,m),n(i,B(this,da)))};this.addEventListener("userinactivechange",l),Ze(this,Dn,()=>{var c,p;i==null||i.removeEventListener("cuechange",s),(c=this.textTracks)==null||c.removeEventListener("change",o),(p=this.textTracks)==null||p.removeEventListener("addtrack",o),this.removeEventListener("userinactivechange",l)})};function ta(t,e){return t.media?t.media.getAttribute(e):t.getAttribute(e)}var Ym=fk,Jf=class{addEventListener(){}removeEventListener(){}dispatchEvent(t){return!0}};if(typeof DocumentFragment>"u"){class t extends Jf{}globalThis.DocumentFragment=t}var Ek=class extends Jf{},_k={get(t){},define(t,e,i){},getName(t){return null},upgrade(t){},whenDefined(t){return Promise.resolve(Ek)}},bk={customElements:_k},gk=typeof window>"u"||typeof globalThis.customElements>"u",ad=gk?bk:globalThis;ad.customElements.get("mux-player")||(ad.customElements.define("mux-player",Ym),ad.MuxPlayerElement=Ym);var eE=parseInt(Mn.version)>=19,Gm={className:"class",classname:"class",htmlFor:"for",crossOrigin:"crossorigin",viewBox:"viewBox",playsInline:"playsinline",autoPlay:"autoplay",playbackRate:"playbackrate"},yk=t=>t==null,Tk=(t,e)=>yk(e)?!1:t in e,Ak=t=>t.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`),kk=(t,e)=>{if(!(!eE&&typeof e=="boolean"&&!e)){if(Tk(t,Gm))return Gm[t];if(typeof e<"u")return/[A-Z]/.test(t)?Ak(t):t}},wk=(t,e)=>!eE&&typeof t=="boolean"?"":t,Sk=(t={})=>{let{ref:e,...i}=t;return Object.entries(i).reduce((a,[r,n])=>{let s=kk(r,n);if(!s)return a;let o=wk(n);return a[s]=o,a},{})};function zm(t,e){if(typeof t=="function")return t(e);t!=null&&(t.current=e)}function Ik(...t){return e=>{let i=!1,a=t.map(r=>{let n=zm(r,e);return!i&&typeof n=="function"&&(i=!0),n});if(i)return()=>{for(let r=0;r<a.length;r++){let n=a[r];typeof n=="function"?n():zm(t[r],null)}}}}function Rk(...t){return xn.useCallback(Ik(...t),t)}var Lk=Object.prototype.hasOwnProperty,Ck=(t,e)=>{if(Object.is(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;if(Array.isArray(t))return!Array.isArray(e)||t.length!==e.length?!1:t.some((r,n)=>e[n]===r);let i=Object.keys(t),a=Object.keys(e);if(i.length!==a.length)return!1;for(let r=0;r<i.length;r++)if(!Lk.call(e,i[r])||!Object.is(t[i[r]],e[i[r]]))return!1;return!0},tE=(t,e,i)=>!Ck(e,t[i]),Dk=(t,e,i)=>{t[i]=e},Mk=(t,e,i,a=Dk,r=tE)=>xn.useEffect(()=>{let n=i==null?void 0:i.current;n&&r(n,e,t)&&a(n,e,t)},[i==null?void 0:i.current,e]),Wt=Mk,xk=()=>{try{return"3.11.7"}catch{}return"UNKNOWN"},Ok=xk(),Nk=()=>Ok,le=(t,e,i)=>xn.useEffect(()=>{let a=e==null?void 0:e.current;if(!a||!i)return;let r=t,n=i;return a.addEventListener(r,n),()=>{a.removeEventListener(r,n)}},[e==null?void 0:e.current,i,t]),Pk=Mn.forwardRef(({children:t,...e},i)=>Mn.createElement("mux-player",{suppressHydrationWarning:!0,...Sk(e),ref:i},t)),$k=(t,e)=>{let{onAbort:i,onCanPlay:a,onCanPlayThrough:r,onEmptied:n,onLoadStart:s,onLoadedData:o,onLoadedMetadata:l,onProgress:c,onDurationChange:p,onVolumeChange:m,onRateChange:u,onResize:d,onWaiting:v,onPlay:f,onPlaying:b,onTimeUpdate:E,onPause:T,onSeeking:_,onSeeked:w,onStalled:R,onSuspend:x,onEnded:U,onError:K,onCuePointChange:Q,onChapterChange:W,metadata:H,tokens:He,paused:et,playbackId:tt,playbackRates:be,currentTime:Ke,themeProps:$t,extraSourceParams:Ve,castCustomData:yt,_hlsConfig:it,...Ce}=e;return Wt("tokens",He,t),Wt("playbackId",tt,t),Wt("playbackRates",be,t),Wt("metadata",H,t),Wt("extraSourceParams",Ve,t),Wt("_hlsConfig",it,t),Wt("themeProps",$t,t),Wt("castCustomData",yt,t),Wt("paused",et,t,(Be,qe)=>{qe!=null&&(qe?Be.pause():Be.play())},(Be,qe,Sa)=>Be.hasAttribute("autoplay")&&!Be.hasPlayed?!1:tE(Be,qe,Sa)),Wt("currentTime",Ke,t,(Be,qe)=>{qe!=null&&(Be.currentTime=qe)}),le("abort",t,i),le("canplay",t,a),le("canplaythrough",t,r),le("emptied",t,n),le("loadstart",t,s),le("loadeddata",t,o),le("loadedmetadata",t,l),le("progress",t,c),le("durationchange",t,p),le("volumechange",t,m),le("ratechange",t,u),le("resize",t,d),le("waiting",t,v),le("play",t,f),le("playing",t,b),le("timeupdate",t,E),le("pause",t,T),le("seeking",t,_),le("seeked",t,w),le("stalled",t,R),le("suspend",t,x),le("ended",t,U),le("error",t,K),le("cuepointchange",t,Q),le("chapterchange",t,W),[Ce]},Uk=Nk(),Hk="mux-player-react",Bk=Mn.forwardRef((t,e)=>{var i;let a=xn.useRef(null),r=Rk(a,e),[n]=$k(a,t),[s]=xn.useState((i=t.playerInitTime)!=null?i:Pu());return Mn.createElement(Pk,{ref:r,defaultHiddenCaptions:t.defaultHiddenCaptions,playerSoftwareName:Hk,playerSoftwareVersion:Uk,playerInitTime:s,...n})}),rw=Bk;export{Yk as MaxResolution,L as MediaError,Gk as MinResolution,zk as RenditionOrder,rw as default,Pu as generatePlayerInitTime,Hk as playerSoftwareName,Uk as playerSoftwareVersion};
