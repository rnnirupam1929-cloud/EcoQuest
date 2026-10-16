import{a as Tu,r as Iu}from"./App-Cicqkrmf.js";function _u(e,t){for(var n=0;n<t.length;n++){const r=t[n];if(typeof r!="string"&&!Array.isArray(r)){for(const s in r)if(s!=="default"&&!(s in e)){const o=Object.getOwnPropertyDescriptor(r,s);o&&Object.defineProperty(e,s,o.get?o:{enumerable:!0,get:()=>r[s]})}}}return Object.freeze(Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}))}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Au=1e-7,Du=1e-4;class Nu{constructor(t,n){this.backend=t,this.dataMover=n,this.data=new WeakMap,this.dataIdsCount=0}get(t){return this.data.has(t)||this.dataMover.moveData(this.backend,t),this.data.get(t)}set(t,n){this.dataIdsCount++,this.data.set(t,n)}has(t){return this.data.has(t)}delete(t){return this.dataIdsCount--,this.data.delete(t)}numDataIds(){return this.dataIdsCount}}class Fs{refCount(t){return pt("refCount")}incRef(t){return pt("incRef")}timerAvailable(){return!0}time(t){return pt("time")}read(t){return pt("read")}readSync(t){return pt("readSync")}readToGPU(t,n){return pt("readToGPU")}numDataIds(){return pt("numDataIds")}disposeData(t,n){return pt("disposeData")}write(t,n,r){return pt("write")}move(t,n,r,s,o){return pt("move")}createTensorFromGPUData(t,n,r){return pt("createTensorFromGPUData")}memory(){return pt("memory")}floatPrecision(){return pt("floatPrecision")}epsilon(){return this.floatPrecision()===32?Au:Du}dispose(){return pt("dispose")}}function pt(e){throw new Error(`'${e}' not yet implemented or not found in the registry. This kernel may not be supported by the tfjs backend you have chosen`)}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Bs(e){let t=e.length,n=0;for(;t>0;)n=Math.random()*t|0,t--,gn(e,t,n)}function Mu(e,t){if(e.length!==t.length)throw new Error(`Array sizes must match to be shuffled together First array length was ${e.length}Second array length was ${t.length}`);let n=e.length,r=0;for(;n>0;)r=Math.random()*n|0,n--,gn(e,n,r),gn(t,n,r)}function De(e,t,n){return Math.max(e,Math.min(t,n))}function Fu(e){return e%2===0?e:e+1}function gn(e,t,n){const r=e[t];e[t]=e[n],e[n]=r}function Bu(e){let t=0;for(let n=0;n<e.length;n++)t+=e[n];return t}function Ru(e,t){const n=Math.random();return t*n+(1-n)*e}function Cu(e,t){let n=0;for(let r=0;r<e.length;r++){const s=Number(e[r])-Number(t[r]);n+=s*s}return n}function p(e,t){if(!e)throw new Error(typeof t=="string"?t:t())}function ht(e,t,n=""){p(Ft(e,t),()=>n+` Shapes ${e} and ${t} must match`)}function ce(e){p(e!=null,()=>"The input to the tensor constructor must be a non-null value.")}function G(e){if(e.length===0)return 1;let t=e[0];for(let n=1;n<e.length;n++)t*=e[n];return t}function Pu(e){return e.length===0}function Rs(e,t){if(e===t)return!0;if(e==null||t==null||e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==null&&t[n]!==null&&e[n]!==t[n])return!1;return!0}function Ft(e,t){if(e===t)return!0;if(e==null||t==null||e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0}function we(e){return e%1===0}function Ou(e){if(Math.tanh!=null)return Math.tanh(e);if(e===1/0)return 1;if(e===-1/0)return-1;{const t=Math.exp(2*e);return(t-1)/(t+1)}}function Lu(e){const t=Math.ceil(Math.sqrt(e));return[t,Math.ceil(e/t)]}function Wu(e){const t=new Uint32Array(e);for(let n=0;n<e;++n)t[n]=n;return Bs(t),t}function Ie(e,t){return t<=e.length?e:e+" ".repeat(t-e.length)}function qu(e,t=s=>0,n,r){return new Promise((s,o)=>{let a=0;const i=()=>{if(e()){s();return}a++;const c=t(a);if(n!=null&&a>=n){o();return}r!=null?r(i,c):setTimeout(i,c)};i()})}function Uu(e,t){let n=1,r=-1;for(let o=0;o<e.length;++o)if(e[o]>=0)n*=e[o];else if(e[o]===-1){if(r!==-1)throw Error(`Shapes can only have 1 implicit size. Found -1 at dim ${r} and dim ${o}`);r=o}else if(e[o]<0)throw Error(`Shapes can not be < 0. Found ${e[o]} at dim ${o}`);if(r===-1){if(t>0&&t!==n)throw Error(`Size(${t}) must match the product of shape ${e}`);return e}if(n===0)throw Error(`Cannot infer the missing size in [${e}] when there are 0 elements`);if(t%n!==0)throw Error(`The implicit shape can't be a fractional number. Got ${t} / ${n}`);const s=e.slice();return s[r]=t/n,s}function Ke(e,t){const n=t.length;return e=e==null?t.map((r,s)=>s):[].concat(e),p(e.every(r=>r>=-n&&r<n),()=>`All values in axis param must be in range [-${n}, ${n}) but got axis ${e}`),p(e.every(r=>we(r)),()=>`All values in axis param must be integers but got axis ${e}`),e.map(r=>r<0?n+r:r)}function Cs(e,t){const n=[],r=[],s=t!=null&&Array.isArray(t)&&t.length===0,o=t==null||s?null:Ke(t,e).sort();let a=0;for(let i=0;i<e.length;++i){if(o!=null){if(o[a]===i&&e[i]!==1)throw new Error(`Can't squeeze axis ${i} since its dim '${e[i]}' is not 1`);(o[a]==null||o[a]>i)&&e[i]===1&&(n.push(e[i]),r.push(i)),o[a]<=i&&a++}e[i]!==1&&(n.push(e[i]),r.push(i))}return{newShape:n,keptDims:r}}function Ps(e,t){return kr(e,t)}function kr(e,t){let n=null;if(e==null||e==="float32")n=new Float32Array(t);else if(e==="int32")n=new Int32Array(t);else if(e==="bool")n=new Uint8Array(t);else if(e==="string")n=new Array(t);else throw new Error(`Unknown data type ${e}`);return n}function Os(e,t){for(let n=0;n<e.length;n++){const r=e[n];if(isNaN(r)||!isFinite(r))throw Error(`A tensor of type ${t} being uploaded contains ${r}.`)}}function Ls(e){return e==="bool"||e==="complex64"||e==="float32"||e==="int32"||e==="string"}function Gu(e,t){return!(t==="complex64"||t==="float32"&&e!=="complex64"||t==="int32"&&e!=="float32"&&e!=="complex64"||t==="bool"&&e==="bool")}function mn(e){if(e==="float32"||e==="int32")return 4;if(e==="complex64")return 8;if(e==="bool")return 1;throw new Error(`Unknown dtype ${e}`)}function Ws(e){if(e==null)return 0;let t=0;return e.forEach(n=>t+=n.length),t}function Lt(e){return typeof e=="string"||e instanceof String}function qs(e){return typeof e=="boolean"}function Us(e){return typeof e=="number"}function Ve(e){return Array.isArray(e)?Ve(e[0]):e instanceof Float32Array?"float32":e instanceof Int32Array||e instanceof Uint8Array||e instanceof Uint8ClampedArray?"int32":Us(e)?"float32":Lt(e)?"string":qs(e)?"bool":"float32"}function Gt(e){return!!(e&&e.constructor&&e.call&&e.apply)}function bn(e,t){for(let n=t;n<e;++n)if(e%n===0)return n;return e}function ke(e){const t=e.length;if(t<2)return[];const n=new Array(t-1);n[t-2]=e[t-1];for(let r=t-3;r>=0;--r)n[r]=n[r+1]*e[r+1];return n}function Gs(e,t,n,r=!1){const s=new Array;if(t.length===1){const o=t[0]*(r?2:1);for(let a=0;a<o;a++)s[a]=n[e+a]}else{const o=t[0],a=t.slice(1),i=a.reduce((c,u)=>c*u)*(r?2:1);for(let c=0;c<o;c++)s[c]=Gs(e+c*i,a,n,r)}return s}function fe(e,t,n=!1){if(e.length===0)return t[0];const r=e.reduce((s,o)=>s*o)*(n?2:1);if(r===0)return[];if(r!==t.length)throw new Error(`[${e}] does not match the input size ${t.length}${n?" for a complex tensor":""}.`);return Gs(0,e,t,n)}function zu(e,t){if(Array.isArray(e))return e;if(t==="float32")return e instanceof Float32Array?e:new Float32Array(e);if(t==="int32")return e instanceof Int32Array?e:new Int32Array(e);if(t==="bool"||t==="string")return Uint8Array.from(new Int32Array(e));throw new Error(`Unknown dtype ${t}`)}function xr(e,t){const n=Tn(e,t);for(let r=0;r<n.length;r++)n[r]=1;return n}function Tn(e,t){if(t==null||t==="float32"||t==="complex64")return new Float32Array(e);if(t==="int32")return new Int32Array(e);if(t==="bool")return new Uint8Array(e);throw new Error(`Unknown data type ${t}`)}function Ku(e,t){const n=e.reduce((r,s)=>r*s,1);if(t==null||t==="float32")return fe(e,new Float32Array(n));if(t==="int32")return fe(e,new Int32Array(n));if(t==="bool")return fe(e,new Uint8Array(n));throw new Error(`Unknown data type ${t}`)}function mt(e){e.forEach(t=>{p(Number.isInteger(t)&&t>=0,()=>`Tensor must have a shape comprised of positive integers but got shape [${e}].`)})}function Vu(e,t,n){if(t===0)return 0;if(t===1)return e[0];let r=e[e.length-1];for(let s=0;s<e.length-1;++s)r+=n[s]*e[s];return r}function Hu(e,t,n){if(t===0)return[];if(t===1)return[e];const r=new Array(t);for(let s=0;s<r.length-1;++s)r[s]=Math.floor(e/n[s]),e-=r[s]*n[s];return r[r.length-1]=e,r}function In(e){return e&&e.then&&typeof e.then=="function"}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const cs="tfjsflags";class zs{constructor(t){this.global=t,this.flags={},this.flagRegistry={},this.urlFlags={},this.getQueryParams=ju,this.populateURLFlags()}setPlatform(t,n){this.platform!=null&&(L().getBool("IS_TEST")||L().getBool("PROD")||console.warn(`Platform ${this.platformName} has already been set. Overwriting the platform with ${t}.`)),this.platformName=t,this.platform=n}registerFlag(t,n,r){if(this.flagRegistry[t]={evaluationFn:n,setHook:r},this.urlFlags[t]!=null){const s=this.urlFlags[t];L().getBool("IS_TEST")||L().getBool("PROD")||console.warn(`Setting feature override from URL ${t}: ${s}.`),this.set(t,s)}}async getAsync(t){return t in this.flags?this.flags[t]:(this.flags[t]=await this.evaluateFlag(t),this.flags[t])}get(t){if(t in this.flags)return this.flags[t];const n=this.evaluateFlag(t);if(In(n))throw new Error(`Flag ${t} cannot be synchronously evaluated. Please use getAsync() instead.`);return this.flags[t]=n,this.flags[t]}getNumber(t){return this.get(t)}getBool(t){return this.get(t)}getString(t){return this.get(t)}getFlags(){return this.flags}get features(){return this.flags}set(t,n){if(this.flagRegistry[t]==null)throw new Error(`Cannot set flag ${t} as it has not been registered.`);this.flags[t]=n,this.flagRegistry[t].setHook!=null&&this.flagRegistry[t].setHook(n)}evaluateFlag(t){if(this.flagRegistry[t]==null)throw new Error(`Cannot evaluate flag '${t}': no evaluation function found.`);return this.flagRegistry[t].evaluationFn()}setFlags(t){this.flags=Object.assign({},t)}reset(){this.flags={},this.urlFlags={},this.populateURLFlags()}populateURLFlags(){if(typeof this.global>"u"||typeof this.global.location>"u"||typeof this.global.location.search>"u")return;const t=this.getQueryParams(this.global.location.search);cs in t&&t[cs].split(",").forEach(r=>{const[s,o]=r.split(":");this.urlFlags[s]=Zu(s,o)})}}function ju(e){const t={};return e.replace(/[?&]([^=?&]+)(?:=([^&]*))?/g,(n,...r)=>(Xu(t,r[0],r[1]),r.join("="))),t}function Xu(e,t,n){e[decodeURIComponent(t)]=decodeURIComponent(n||"")}function Zu(e,t){const n=t.toLowerCase();return n==="true"||n==="false"?n==="true":`${+n}`===n?+n:t}function L(){return vr}let vr=null;function Yu(e){vr=e}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */let Gn;function Ks(){if(Gn==null){let e;if(typeof window<"u")e=window;else if(typeof global<"u")e=global;else if(typeof process<"u")e=process;else if(typeof self<"u")e=self;else throw new Error("Could not find a global object");Gn=e}return Gn}function Ju(){const e=Ks();return e._tfGlobals==null&&(e._tfGlobals=new Map),e._tfGlobals}function Sr(e,t){const n=Ju();if(n.has(e))return n.get(e);{const r=t();return n.set(e,r),n.get(e)}}const Vs="Abs",Hs="Acos",js="Acosh",Tr="Add",Xs="AddN",Zs="All",Ys="Any",Js="ArgMax",Qs="ArgMin",to="Asin",eo="Asinh",no="Atan",ro="Atanh",so="Atan2",oo="AvgPool",Qu="AvgPoolGrad",ao="AvgPool3D",tl="AvgPool3DGrad",io="BatchMatMul",co="BatchToSpaceND",uo="Bincount",lo="BitwiseAnd",el="BroadcastTo",ho="BroadcastArgs",Ir="Cast",fo="Ceil",po="ClipByValue",go="Complex",mo="ComplexAbs",bo="Concat",wo="Conv2D",yo="Conv2DBackpropFilter",$o="Conv2DBackpropInput",Eo="Conv3D",nl="Conv3DBackpropFilterV2",ko="Conv3DBackpropInputV2",xo="Cos",vo="Cosh",So="Cumprod",To="Cumsum",Io="CropAndResize",_o="DenseBincount",Ao="DepthToSpace",Do="DepthwiseConv2dNative",No="DepthwiseConv2dNativeBackpropFilter",Mo="DepthwiseConv2dNativeBackpropInput",Fo="Diag",Bo="Dilation2D",rl="Dilation2DBackpropInput",sl="Dilation2DBackpropFilter",_r="Draw",Ro="RealDiv",Co="Einsum",Po="Elu",ol="EluGrad",Oo="Erf",Lo="Equal",Wo="Exp",qo="ExpandDims",Uo="Expm1",Go="FFT",zo="Fill",Ko="FlipLeftRight",Vo="Floor",Ho="FloorDiv",jo="FusedBatchNorm",Xo="GatherV2",Zo="GatherNd",Yo="Greater",Jo="GreaterEqual",Ar="Identity",Qo="IFFT",ta="Imag",ea="IsFinite",na="IsInf",ra="IsNan",sa="LeakyRelu",oa="Less",aa="LessEqual",ia="LinSpace",ca="Log",ua="Log1p",la="LogicalAnd",ha="LogicalNot",fa="LogicalOr",al="LogicalXor",il="LogSoftmax",cl="LowerBound",da="LRN",ul="LRNGrad",ll="MatrixBandPart",pa="Max",ga="Maximum",ma="MaxPool",hl="MaxPoolGrad",ba="MaxPool3D",fl="MaxPool3DGrad",wa="MaxPoolWithArgmax",ya="Mean",$a="Min",Ea="Minimum",ka="MirrorPad",xa="Mod",va="Multinomial",Sa="Multiply",Ta="Neg",Ia="NotEqual",_a="NonMaxSuppressionV3",Aa="NonMaxSuppressionV4",Da="NonMaxSuppressionV5",Na="OnesLike",Ma="OneHot",Fa="Pack",Ba="PadV2",dl="Pool",Ra="Pow",Ca="Prelu",Pa="Prod",Oa="RaggedGather",La="RaggedRange",Wa="RaggedTensorToTensor",qa="Range",Ua="Real",Ga="Reciprocal",za="Relu",Ka="Reshape",Va="ResizeNearestNeighbor",pl="ResizeNearestNeighborGrad",Ha="ResizeBilinear",gl="ResizeBilinearGrad",ja="Relu6",Xa="Reverse",Za="Round",Ya="Rsqrt",Ja="ScatterNd",Qa="TensorScatterUpdate",ti="SearchSorted",ei="Select",ni="Selu",ri="Slice",si="Sin",oi="Sinh",ai="Sign",ii="Sigmoid",ci="Softplus",ui="Sqrt",li="Sum",hi="SpaceToBatchND",fi="SplitV",di="Softmax",pi="SparseFillEmptyRows",gi="SparseReshape",mi="SparseSegmentMean",bi="SparseSegmentSum",wi="SparseToDense",yi="SquaredDifference",ml="Square",$i="StaticRegexReplace",Ei="StridedSlice",ki="StringNGrams",xi="StringSplit",vi="StringToHashBucketFast",Si="Sub",Ti="Tan",Ii="Tanh",Dr="Tile",_i="TopK",Ai="Transform",rn="Transpose",Di="Unique",Ni="Unpack",Mi="UnsortedSegmentSum",bl="UpperBound",Fi="ZerosLike",Bi="Step",Yn="FromPixels",Ri="RotateWithOffset",Jn="_FusedMatMul",Qn="FusedConv2D",tr="FusedDepthwiseConv2D";/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Pt(...e){L().getBool("IS_TEST")||L().getBool("PROD")||console.warn(...e)}function wl(...e){L().getBool("IS_TEST")||L().getBool("PROD")||console.log(...e)}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ye=Sr("kernelRegistry",()=>new Map),Ne=Sr("gradRegistry",()=>new Map);function Me(e,t){const n=Nr(e,t);return ye.get(n)}function er(e){return Ne.get(e)}function wn(e){const t=ye.entries(),n=[];for(;;){const{done:r,value:s}=t.next();if(r)break;const[o,a]=s,[i]=o.split("_");i===e&&n.push(a)}return n}function Ci(e){const{kernelName:t,backendName:n}=e,r=Nr(t,n);ye.has(r)&&Pt(`The kernel '${t}' for backend '${n}' is already registered`),ye.set(r,e)}function yl(e){const{kernelName:t}=e;Ne.has(t)&&L().getBool("DEBUG")&&Pt(`Overriding the gradient for '${t}'`),Ne.set(t,e)}function $l(e,t){const n=Nr(e,t);if(!ye.has(n))throw new Error(`The kernel '${e}' for backend '${t}' is not registered`);ye.delete(n)}function El(e){if(!Ne.has(e))throw new Error(`The gradient '${e}' for backend is not registered`);Ne.delete(e)}function kl(e,t){wn(e).forEach(r=>{const s=Object.assign({},r,{backendName:t});Ci(s)})}function Nr(e,t){return`${t}_${e}`}/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Pi(e){return e instanceof Float32Array||e instanceof Int32Array||e instanceof Uint8Array||e instanceof Uint8ClampedArray}var zn,us;function xl(){if(us)return zn;us=1,zn=t;var e=null;try{e=new WebAssembly.Instance(new WebAssembly.Module(new Uint8Array([0,97,115,109,1,0,0,0,1,13,2,96,0,1,127,96,4,127,127,127,127,1,127,3,7,6,0,1,1,1,1,1,6,6,1,127,1,65,0,11,7,50,6,3,109,117,108,0,1,5,100,105,118,95,115,0,2,5,100,105,118,95,117,0,3,5,114,101,109,95,115,0,4,5,114,101,109,95,117,0,5,8,103,101,116,95,104,105,103,104,0,0,10,191,1,6,4,0,35,0,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,126,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,127,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,128,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,129,34,4,66,32,135,167,36,0,32,4,167,11,36,1,1,126,32,0,173,32,1,173,66,32,134,132,32,2,173,32,3,173,66,32,134,132,130,34,4,66,32,135,167,36,0,32,4,167,11])),{}).exports}catch{}function t(k,m,I){this.low=k|0,this.high=m|0,this.unsigned=!!I}t.prototype.__isLong__,Object.defineProperty(t.prototype,"__isLong__",{value:!0});function n(k){return(k&&k.__isLong__)===!0}t.isLong=n;var r={},s={};function o(k,m){var I,F,C;return m?(k>>>=0,(C=0<=k&&k<256)&&(F=s[k],F)?F:(I=i(k,(k|0)<0?-1:0,!0),C&&(s[k]=I),I)):(k|=0,(C=-128<=k&&k<128)&&(F=r[k],F)?F:(I=i(k,k<0?-1:0,!1),C&&(r[k]=I),I))}t.fromInt=o;function a(k,m){if(isNaN(k))return m?B:v;if(m){if(k<0)return B;if(k>=y)return R}else{if(k<=-$)return M;if(k+1>=$)return N}return k<0?a(-k,m).neg():i(k%g|0,k/g|0,m)}t.fromNumber=a;function i(k,m,I){return new t(k,m,I)}t.fromBits=i;var c=Math.pow;function u(k,m,I){if(k.length===0)throw Error("empty string");if(k==="NaN"||k==="Infinity"||k==="+Infinity"||k==="-Infinity")return v;if(typeof m=="number"?(I=m,m=!1):m=!!m,I=I||10,I<2||36<I)throw RangeError("radix");var F;if((F=k.indexOf("-"))>0)throw Error("interior hyphen");if(F===0)return u(k.substring(1),m,I).neg();for(var C=a(c(I,8)),O=v,q=0;q<k.length;q+=8){var Z=Math.min(8,k.length-q),st=parseInt(k.substring(q,q+Z),I);if(Z<8){var Q=a(c(I,Z));O=O.mul(Q).add(a(st))}else O=O.mul(C),O=O.add(a(st))}return O.unsigned=m,O}t.fromString=u;function h(k,m){return typeof k=="number"?a(k,m):typeof k=="string"?u(k,m):i(k.low,k.high,typeof m=="boolean"?m:k.unsigned)}t.fromValue=h;var l=65536,f=1<<24,g=l*l,y=g*g,$=y/2,E=o(f),v=o(0);t.ZERO=v;var B=o(0,!0);t.UZERO=B;var S=o(1);t.ONE=S;var _=o(1,!0);t.UONE=_;var A=o(-1);t.NEG_ONE=A;var N=i(-1,2147483647,!1);t.MAX_VALUE=N;var R=i(-1,-1,!0);t.MAX_UNSIGNED_VALUE=R;var M=i(0,-2147483648,!1);t.MIN_VALUE=M;var x=t.prototype;return x.toInt=function(){return this.unsigned?this.low>>>0:this.low},x.toNumber=function(){return this.unsigned?(this.high>>>0)*g+(this.low>>>0):this.high*g+(this.low>>>0)},x.toString=function(m){if(m=m||10,m<2||36<m)throw RangeError("radix");if(this.isZero())return"0";if(this.isNegative())if(this.eq(M)){var I=a(m),F=this.div(I),C=F.mul(I).sub(this);return F.toString(m)+C.toInt().toString(m)}else return"-"+this.neg().toString(m);for(var O=a(c(m,6),this.unsigned),q=this,Z="";;){var st=q.div(O),Q=q.sub(st.mul(O)).toInt()>>>0,tt=Q.toString(m);if(q=st,q.isZero())return tt+Z;for(;tt.length<6;)tt="0"+tt;Z=""+tt+Z}},x.getHighBits=function(){return this.high},x.getHighBitsUnsigned=function(){return this.high>>>0},x.getLowBits=function(){return this.low},x.getLowBitsUnsigned=function(){return this.low>>>0},x.getNumBitsAbs=function(){if(this.isNegative())return this.eq(M)?64:this.neg().getNumBitsAbs();for(var m=this.high!=0?this.high:this.low,I=31;I>0&&(m&1<<I)==0;I--);return this.high!=0?I+33:I+1},x.isZero=function(){return this.high===0&&this.low===0},x.eqz=x.isZero,x.isNegative=function(){return!this.unsigned&&this.high<0},x.isPositive=function(){return this.unsigned||this.high>=0},x.isOdd=function(){return(this.low&1)===1},x.isEven=function(){return(this.low&1)===0},x.equals=function(m){return n(m)||(m=h(m)),this.unsigned!==m.unsigned&&this.high>>>31===1&&m.high>>>31===1?!1:this.high===m.high&&this.low===m.low},x.eq=x.equals,x.notEquals=function(m){return!this.eq(m)},x.neq=x.notEquals,x.ne=x.notEquals,x.lessThan=function(m){return this.comp(m)<0},x.lt=x.lessThan,x.lessThanOrEqual=function(m){return this.comp(m)<=0},x.lte=x.lessThanOrEqual,x.le=x.lessThanOrEqual,x.greaterThan=function(m){return this.comp(m)>0},x.gt=x.greaterThan,x.greaterThanOrEqual=function(m){return this.comp(m)>=0},x.gte=x.greaterThanOrEqual,x.ge=x.greaterThanOrEqual,x.compare=function(m){if(n(m)||(m=h(m)),this.eq(m))return 0;var I=this.isNegative(),F=m.isNegative();return I&&!F?-1:!I&&F?1:this.unsigned?m.high>>>0>this.high>>>0||m.high===this.high&&m.low>>>0>this.low>>>0?-1:1:this.sub(m).isNegative()?-1:1},x.comp=x.compare,x.negate=function(){return!this.unsigned&&this.eq(M)?M:this.not().add(S)},x.neg=x.negate,x.add=function(m){n(m)||(m=h(m));var I=this.high>>>16,F=this.high&65535,C=this.low>>>16,O=this.low&65535,q=m.high>>>16,Z=m.high&65535,st=m.low>>>16,Q=m.low&65535,tt=0,$t=0,it=0,bt=0;return bt+=O+Q,it+=bt>>>16,bt&=65535,it+=C+st,$t+=it>>>16,it&=65535,$t+=F+Z,tt+=$t>>>16,$t&=65535,tt+=I+q,tt&=65535,i(it<<16|bt,tt<<16|$t,this.unsigned)},x.subtract=function(m){return n(m)||(m=h(m)),this.add(m.neg())},x.sub=x.subtract,x.multiply=function(m){if(this.isZero())return v;if(n(m)||(m=h(m)),e){var I=e.mul(this.low,this.high,m.low,m.high);return i(I,e.get_high(),this.unsigned)}if(m.isZero())return v;if(this.eq(M))return m.isOdd()?M:v;if(m.eq(M))return this.isOdd()?M:v;if(this.isNegative())return m.isNegative()?this.neg().mul(m.neg()):this.neg().mul(m).neg();if(m.isNegative())return this.mul(m.neg()).neg();if(this.lt(E)&&m.lt(E))return a(this.toNumber()*m.toNumber(),this.unsigned);var F=this.high>>>16,C=this.high&65535,O=this.low>>>16,q=this.low&65535,Z=m.high>>>16,st=m.high&65535,Q=m.low>>>16,tt=m.low&65535,$t=0,it=0,bt=0,tn=0;return tn+=q*tt,bt+=tn>>>16,tn&=65535,bt+=O*tt,it+=bt>>>16,bt&=65535,bt+=q*Q,it+=bt>>>16,bt&=65535,it+=C*tt,$t+=it>>>16,it&=65535,it+=O*Q,$t+=it>>>16,it&=65535,it+=q*st,$t+=it>>>16,it&=65535,$t+=F*tt+C*Q+O*st+q*Z,$t&=65535,i(bt<<16|tn,$t<<16|it,this.unsigned)},x.mul=x.multiply,x.divide=function(m){if(n(m)||(m=h(m)),m.isZero())throw Error("division by zero");if(e){if(!this.unsigned&&this.high===-2147483648&&m.low===-1&&m.high===-1)return this;var I=(this.unsigned?e.div_u:e.div_s)(this.low,this.high,m.low,m.high);return i(I,e.get_high(),this.unsigned)}if(this.isZero())return this.unsigned?B:v;var F,C,O;if(this.unsigned){if(m.unsigned||(m=m.toUnsigned()),m.gt(this))return B;if(m.gt(this.shru(1)))return _;O=B}else{if(this.eq(M)){if(m.eq(S)||m.eq(A))return M;if(m.eq(M))return S;var q=this.shr(1);return F=q.div(m).shl(1),F.eq(v)?m.isNegative()?S:A:(C=this.sub(m.mul(F)),O=F.add(C.div(m)),O)}else if(m.eq(M))return this.unsigned?B:v;if(this.isNegative())return m.isNegative()?this.neg().div(m.neg()):this.neg().div(m).neg();if(m.isNegative())return this.div(m.neg()).neg();O=v}for(C=this;C.gte(m);){F=Math.max(1,Math.floor(C.toNumber()/m.toNumber()));for(var Z=Math.ceil(Math.log(F)/Math.LN2),st=Z<=48?1:c(2,Z-48),Q=a(F),tt=Q.mul(m);tt.isNegative()||tt.gt(C);)F-=st,Q=a(F,this.unsigned),tt=Q.mul(m);Q.isZero()&&(Q=S),O=O.add(Q),C=C.sub(tt)}return O},x.div=x.divide,x.modulo=function(m){if(n(m)||(m=h(m)),e){var I=(this.unsigned?e.rem_u:e.rem_s)(this.low,this.high,m.low,m.high);return i(I,e.get_high(),this.unsigned)}return this.sub(this.div(m).mul(m))},x.mod=x.modulo,x.rem=x.modulo,x.not=function(){return i(~this.low,~this.high,this.unsigned)},x.and=function(m){return n(m)||(m=h(m)),i(this.low&m.low,this.high&m.high,this.unsigned)},x.or=function(m){return n(m)||(m=h(m)),i(this.low|m.low,this.high|m.high,this.unsigned)},x.xor=function(m){return n(m)||(m=h(m)),i(this.low^m.low,this.high^m.high,this.unsigned)},x.shiftLeft=function(m){return n(m)&&(m=m.toInt()),(m&=63)===0?this:m<32?i(this.low<<m,this.high<<m|this.low>>>32-m,this.unsigned):i(0,this.low<<m-32,this.unsigned)},x.shl=x.shiftLeft,x.shiftRight=function(m){return n(m)&&(m=m.toInt()),(m&=63)===0?this:m<32?i(this.low>>>m|this.high<<32-m,this.high>>m,this.unsigned):i(this.high>>m-32,this.high>=0?0:-1,this.unsigned)},x.shr=x.shiftRight,x.shiftRightUnsigned=function(m){if(n(m)&&(m=m.toInt()),m&=63,m===0)return this;var I=this.high;if(m<32){var F=this.low;return i(F>>>m|I<<32-m,I>>>m,this.unsigned)}else return m===32?i(I,0,this.unsigned):i(I>>>m-32,0,this.unsigned)},x.shru=x.shiftRightUnsigned,x.shr_u=x.shiftRightUnsigned,x.toSigned=function(){return this.unsigned?i(this.low,this.high,!1):this},x.toUnsigned=function(){return this.unsigned?this:i(this.low,this.high,!0)},x.toBytes=function(m){return m?this.toBytesLE():this.toBytesBE()},x.toBytesLE=function(){var m=this.high,I=this.low;return[I&255,I>>>8&255,I>>>16&255,I>>>24,m&255,m>>>8&255,m>>>16&255,m>>>24]},x.toBytesBE=function(){var m=this.high,I=this.low;return[m>>>24,m>>>16&255,m>>>8&255,m&255,I>>>24,I>>>16&255,I>>>8&255,I&255]},t.fromBytes=function(m,I,F){return F?t.fromBytesLE(m,I):t.fromBytesBE(m,I)},t.fromBytesLE=function(m,I){return new t(m[0]|m[1]<<8|m[2]<<16|m[3]<<24,m[4]|m[5]<<8|m[6]<<16|m[7]<<24,I)},t.fromBytesBE=function(m,I){return new t(m[4]<<24|m[5]<<16|m[6]<<8|m[7],m[0]<<24|m[1]<<16|m[2]<<8|m[3],I)},zn}var Oi=xl();const Li=Tu(Oi),vl=_u({__proto__:null,default:Li},[Oi]);/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Yt=Li||vl;function He(e){return Yt.fromString(e,!0,16)}const Wi=He("c3a5c85c97cb3127"),Zt=He("b492b66fbe98f273"),ut=He("9ae16a3b2f90404f");function nr(e){return e.xor(e.shru(47))}function qi(e,t,n){const r=e.slice(t,t+n);return Yt.fromBytes(Array.from(r),!0,!0)}function K(e,t){return qi(e,t,8)}function ls(e,t){return qi(e,t,4)}function ot(e,t){return t===0?e:e.shru(t).or(e.shl(64-t))}function qt(e,t,n=He("9ddfea08eb382d69")){let r=e.xor(t).mul(n);r=r.xor(r.shru(47));let s=t.xor(r).mul(n);return s=s.xor(s.shru(47)),s=s.mul(n),s}function Sl(e,t,n,r,s,o){s=s.add(e),o=ot(o.add(s).add(r),21);const a=s;return s=s.add(t),s=s.add(n),o=o.add(ot(s,44)),[s.add(r),o.add(a)]}function en(e,t,n,r){return Sl(K(e,t),K(e,t+8),K(e,t+16),K(e,t+24),n,r)}function Tl(e,t=e.length){if(t>=8){const n=ut.add(t*2),r=K(e,0).add(ut),s=K(e,t-8),o=ot(s,37).mul(n).add(r),a=ot(r,25).add(s).mul(n);return qt(o,a,n)}if(t>=4){const n=ut.add(t*2),r=ls(e,0);return qt(r.shl(3).add(t),ls(e,t-4),n)}if(t>0){const n=e[0],r=e[t>>1],s=e[t-1],o=n+(r<<8),a=t+(s<<2);return nr(ut.mul(o).xor(Wi.mul(a))).mul(ut)}return ut}function Il(e,t=e.length){const n=ut.add(t*2),r=K(e,0).mul(Zt),s=K(e,8),o=K(e,t-8).mul(n),a=K(e,t-16).mul(ut);return qt(ot(r.add(s),43).add(ot(o,30)).add(a),r.add(ot(s.add(ut),18)).add(o),n)}function _l(e,t=e.length){const n=ut.add(t*2),r=K(e,0).mul(ut),s=K(e,8),o=K(e,t-8).mul(n),a=K(e,t-16).mul(ut),i=ot(r.add(s),43).add(ot(o,30)).add(a),c=qt(i,r.add(ot(s.add(ut),18)).add(o),n),u=K(e,16).mul(n),h=K(e,24),l=i.add(K(e,t-32)).mul(n),f=c.add(K(e,t-24)).mul(n);return qt(ot(u.add(h),43).add(ot(l,30)).add(f),u.add(ot(h.add(r),18)).add(l),n)}function Al(e,t=e.length){const n=Yt.fromNumber(81,!0);if(t<=32)return t<=16?Tl(e,t):Il(e,t);if(t<=64)return _l(e,t);let r=n,s=n.mul(Zt).add(113),o=nr(s.mul(ut).add(113)).mul(ut),a=[Yt.UZERO,Yt.UZERO],i=[Yt.UZERO,Yt.UZERO];r=r.mul(ut).add(K(e,0));let c=0;const u=(t-1>>6)*64,h=u+(t-1&63)-63;do r=ot(r.add(s).add(a[0]).add(K(e,c+8)),37).mul(Zt),s=ot(s.add(a[1]).add(K(e,c+48)),42).mul(Zt),r=r.xor(i[1]),s=s.add(a[0]).add(K(e,c+40)),o=ot(o.add(i[0]),33).mul(Zt),a=en(e,c,a[1].mul(Zt),r.add(i[0])),i=en(e,c+32,o.add(i[1]),s.add(K(e,c+16))),[o,r]=[r,o],c+=64;while(c!==u);const l=Zt.add(o.and(255).shl(1));return c=h,i[0]=i[0].add(t-1&63),a[0]=a[0].add(i[0]),i[0]=i[0].add(a[0]),r=ot(r.add(s).add(a[0]).add(K(e,c+8)),37).mul(l),s=ot(s.add(a[1]).add(K(e,c+48)),42).mul(l),r=r.xor(i[1].mul(9)),s=s.add(a[0].mul(9).add(K(e,c+40))),o=ot(o.add(i[0]),33).mul(l),a=en(e,c,a[1].mul(l),r.add(i[0])),i=en(e,c+32,o.add(i[1]),s.add(K(e,c+16))),[o,r]=[r,o],qt(qt(a[0],i[0],l).add(nr(s).mul(Wi)).add(o),qt(a[1],i[1],l).add(r),l)}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Dl(e,t){return t==="string"?je(e):_n([e],t)}function Nl(e,t){return e instanceof Float32Array&&t==="float32"||e instanceof Int32Array&&t==="int32"||e instanceof Uint8Array&&t==="bool"}function _n(e,t){if(t==="string")throw new Error("Cannot convert a string[] to a TypedArray");if(Array.isArray(e)&&(e=zt(e)),L().getBool("DEBUG")&&Os(e,t),Nl(e,t))return e;if(t==null||t==="float32"||t==="complex64")return new Float32Array(e);if(t==="int32")return new Int32Array(e);if(t==="bool"){const n=new Uint8Array(e.length);for(let r=0;r<n.length;++r)Math.round(e[r])!==0&&(n[r]=1);return n}else throw new Error(`Unknown data type ${t}`)}function Fe(){return L().platform.now()}function Ml(e,t){return L().platform.fetch(e,t)}function je(e,t="utf-8"){return t=t||"utf-8",L().platform.encode(e,t)}function yn(e,t="utf-8"){return t=t||"utf-8",L().platform.decode(e,t)}function at(e){return L().platform.isTypedArray!=null?L().platform.isTypedArray(e):Pi(e)}function zt(e,t=[],n=!1){if(t==null&&(t=[]),typeof e=="boolean"||typeof e=="number"||typeof e=="string"||In(e)||e==null||at(e)&&n)t.push(e);else if(Array.isArray(e)||at(e))for(let r=0;r<e.length;++r)zt(e[r],t,n);else{let r=-1;for(const s of Object.keys(e))/^([1-9]+[0-9]*|0)$/.test(s)&&(r=Math.max(r,Number(s)));for(let s=0;s<=r;s++)zt(e[s],t,n)}return t}const Fl=Object.freeze(Object.defineProperty({__proto__:null,arraysEqual:Ft,arraysEqualWithNull:Rs,assert:p,assertNonNegativeIntegerDimensions:mt,assertNonNull:ce,assertShapesMatch:ht,bytesFromStringArray:Ws,bytesPerElement:mn,checkConversionForErrors:Os,clamp:De,computeStrides:ke,convertBackendValuesAndArrayBuffer:zu,createScalarValue:Dl,createShuffledIndices:Wu,decodeString:yn,distSquared:Cu,encodeString:je,fetch:Ml,fingerPrint64:Al,flatten:zt,getArrayFromDType:kr,getTypedArrayFromDType:Ps,hasEncodingLoss:Gu,hexToLong:He,indexToLoc:Hu,inferDtype:Ve,inferFromImplicitShape:Uu,isBoolean:qs,isFunction:Gt,isInt:we,isNumber:Us,isPromise:In,isScalarShape:Pu,isString:Lt,isTypedArray:at,isValidDtype:Ls,locToIndex:Vu,makeOnesTypedArray:xr,makeZerosNestedTypedArray:Ku,makeZerosTypedArray:Tn,nearestDivisor:bn,nearestLargerEven:Fu,now:Fe,parseAxisParam:Ke,randUniform:Ru,repeatedTry:qu,rightPad:Ie,shuffle:Bs,shuffleCombo:Mu,sizeFromShape:G,sizeToSquarishShape:Lu,squeezeShape:Cs,sum:Bu,swap:gn,tanh:Ou,toNestedArray:fe,toTypedArray:_n},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Bl{constructor(t,n){this.backendTimer=t,this.logger=n,n==null&&(this.logger=new Cl)}profileKernel(t,n,r){let s;const o=()=>{s=r()};let a;const i=Fe();if(this.backendTimer.timerAvailable())a=this.backendTimer.time(o);else{o();for(const u of s)u.dataSync();a=Promise.resolve({kernelMs:Fe()-i})}if(L().getBool("CHECK_COMPUTATION_FOR_ERRORS"))for(let u=0;u<s.length;u++){const h=s[u];h.data().then(l=>{Rl(l,h.dtype,t)})}return{kernelName:t,outputs:s,inputs:n,timeMs:a.then(u=>u.kernelMs),extraInfo:a.then(u=>u.getExtraProfileInfo!=null?u.getExtraProfileInfo():"")}}logKernelProfile(t){const{kernelName:n,outputs:r,timeMs:s,inputs:o,extraInfo:a}=t;r.forEach(i=>{Promise.all([i.data(),s,a]).then(c=>{this.logger.logKernelProfile(n,i,c[0],c[1],o,c[2])})})}}function Rl(e,t,n){if(t!=="float32")return!1;for(let r=0;r<e.length;r++){const s=e[r];if(isNaN(s)||!isFinite(s))return console.warn(`Found ${s} in the result of '${n}'`),!0}return!1}class Cl{logKernelProfile(t,n,r,s,o,a){const i=typeof s=="number"?Ie(`${s}ms`,9):s.error,c=Ie(t,25),u=n.rank,h=n.size,l=Ie(n.shape.toString(),14);let f="";for(const g in o){const y=o[g];if(y!=null){const $=y.shape||n.shape,E=$.length;f+=`${g}: ${E}D ${E>0?$:""} `}}console.log(`%c${c}	%c${i}	%c${u}D ${l}	%c${h}	%c${f}	%c${a}`,"font-weight:bold","color:red","color:blue","color: orange","color: green","color: steelblue")}}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Pl(e,t,n){const r={},s={};for(let c=0;c<t.length;c++)r[t[c].id]=!0;for(let c=0;c<e.length;c++){const u=e[c],h=u.inputs;for(const l in h){const f=h[l];let g=!1;for(let y=0;y<t.length;y++)if(r[f.id]){u.outputs.forEach($=>r[$.id]=!0),g=!0,s[u.id]=!0;break}if(g)break}}const o={};o[n.id]=!0;const a={};for(let c=e.length-1;c>=0;c--){const u=e[c],h=u.inputs;for(let l=0;l<u.outputs.length;l++)if(o[u.outputs[l].id]){for(const f in h)o[h[f].id]=!0,a[u.id]=!0;break}}const i=[];for(let c=0;c<e.length;c++){const u=e[c];if(s[u.id]&&a[u.id]){const h={};for(const f in u.inputs){const g=u.inputs[f];r[g.id]&&(h[f]=g)}const l=Object.assign({},u);l.inputs=h,l.outputs=u.outputs,i.push(l)}}return i}function Ol(e,t,n,r){for(let s=t.length-1;s>=0;s--){const o=t[s],a=[];if(o.outputs.forEach(c=>{const u=e[c.id];u!=null?a.push(u):a.push(null)}),o.gradient==null)throw new Error(`Cannot compute gradient: gradient function not found for ${o.kernelName}.`);const i=o.gradient(a);for(const c in o.inputs){if(!(c in i))throw new Error(`Cannot backprop through input ${c}. Available gradients found: ${Object.keys(i)}.`);const u=n(()=>i[c]());if(u.dtype!=="float32")throw new Error(`Error in gradient for op ${o.kernelName}. The gradient of input ${c} must have 'float32' dtype, but has '${u.dtype}'`);const h=o.inputs[c];if(!Ft(u.shape,h.shape))throw new Error(`Error in gradient for op ${o.kernelName}. The gradient of input '${c}' has shape '${u.shape}', which does not match the shape of the input '${h.shape}'`);if(e[h.id]==null)e[h.id]=u;else{const l=e[h.id];e[h.id]=r(l,u),l.dispose()}}}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const hs=20,ve=3,Kn=7;function Ll(e,t,n,r){const s=ke(t),o=Wl(e,t,n,s),a=t.length,i=sn(e,t,n,s,o),c=["Tensor"];return r&&(c.push(`  dtype: ${n}`),c.push(`  rank: ${a}`),c.push(`  shape: [${t}]`),c.push("  values:")),c.push(i.map(u=>"    "+u).join(`
`)),c.join(`
`)}function Wl(e,t,n,r){const s=G(t),o=r[r.length-1],a=new Array(o).fill(0),i=t.length,c=n==="complex64"?Te(e):e;if(i>1)for(let u=0;u<s/o;u++){const h=u*o;for(let l=0;l<o;l++)a[l]=Math.max(a[l],Se(c[h+l],0,n).length)}return a}function Se(e,t,n){let r;return Array.isArray(e)?r=`${parseFloat(e[0].toFixed(Kn))} + ${parseFloat(e[1].toFixed(Kn))}j`:Lt(e)?r=`'${e}'`:n==="bool"?r=Ui(e):r=parseFloat(e.toFixed(Kn)).toString(),Ie(r,t)}function Ui(e){return e===0?"false":"true"}function sn(e,t,n,r,s,o=!0){const a=n==="complex64"?2:1,i=t[0],c=t.length;if(c===0){if(n==="complex64"){const $=Te(e);return[Se($[0],0,n)]}return n==="bool"?[Ui(e[0])]:[e[0].toString()]}if(c===1){if(i>hs){const E=ve*a;let v=Array.from(e.slice(0,E)),B=Array.from(e.slice((i-ve)*a,i*a));return n==="complex64"&&(v=Te(v),B=Te(B)),["["+v.map((S,_)=>Se(S,s[_],n)).join(", ")+", ..., "+B.map((S,_)=>Se(S,s[i-ve+_],n)).join(", ")+"]"]}return["["+(n==="complex64"?Te(e):Array.from(e)).map((E,v)=>Se(E,s[v],n)).join(", ")+"]"]}const u=t.slice(1),h=r.slice(1),l=r[0]*a,f=[];if(i>hs){for(let $=0;$<ve;$++){const E=$*l,v=E+l;f.push(...sn(e.slice(E,v),u,n,h,s,!1))}f.push("...");for(let $=i-ve;$<i;$++){const E=$*l,v=E+l;f.push(...sn(e.slice(E,v),u,n,h,s,$===i-1))}}else for(let $=0;$<i;$++){const E=$*l,v=E+l;f.push(...sn(e.slice(E,v),u,n,h,s,$===i-1))}const g=c===2?",":"";f[0]="["+(i>0?f[0]+g:"");for(let $=1;$<f.length-1;$++)f[$]=" "+f[$]+g;let y=`,
`;for(let $=2;$<c;$++)y+=`
`;return f[f.length-1]=" "+f[f.length-1]+"]"+(o?"":y),f}function Te(e){const t=[];for(let n=0;n<e.length;n+=2)t.push([e[n],e[n+1]]);return t}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class $n{constructor(t,n,r){if(this.dtype=n,this.shape=t.slice(),this.size=G(t),r!=null){const s=r.length;p(s===this.size,()=>`Length of values '${s}' does not match the size inferred by the shape '${this.size}'.`)}if(n==="complex64")throw new Error("complex64 dtype TensorBuffers are not supported. Please create a TensorBuffer for the real and imaginary parts separately and call tf.complex(real, imag).");this.values=r||kr(n,this.size),this.strides=ke(t)}set(t,...n){n.length===0&&(n=[0]),p(n.length===this.rank,()=>`The number of provided coordinates (${n.length}) must match the rank (${this.rank})`);const r=this.locToIndex(n);this.values[r]=t}get(...t){t.length===0&&(t=[0]);let n=0;for(const s of t){if(s<0||s>=this.shape[n]){const o=`Requested out of range element at ${t}.   Buffer shape=${this.shape}`;throw new Error(o)}n++}let r=t[t.length-1];for(let s=0;s<t.length-1;++s)r+=this.strides[s]*t[s];return this.values[r]}locToIndex(t){if(this.rank===0)return 0;if(this.rank===1)return t[0];let n=t[t.length-1];for(let r=0;r<t.length-1;++r)n+=this.strides[r]*t[r];return n}indexToLoc(t){if(this.rank===0)return[];if(this.rank===1)return[t];const n=new Array(this.shape.length);for(let r=0;r<n.length-1;++r)n[r]=Math.floor(t/this.strides[r]),t-=n[r]*this.strides[r];return n[n.length-1]=t,n}get rank(){return this.shape.length}toTensor(){return xt().makeTensor(this.values,this.shape,this.dtype)}}let xt=null,ue=null;function ql(e){xt=e}function Ul(e){ue=e}class et{constructor(t,n,r,s){this.kept=!1,this.isDisposedInternal=!1,this.shape=t.slice(),this.dtype=n||"float32",this.size=G(t),this.strides=ke(t),this.dataId=r,this.id=s,this.rankType=this.rank<5?this.rank.toString():"higher"}get rank(){return this.shape.length}async buffer(){const t=await this.data();return ue.buffer(this.shape,this.dtype,t)}bufferSync(){return ue.buffer(this.shape,this.dtype,this.dataSync())}async array(){const t=await this.data();return fe(this.shape,t,this.dtype==="complex64")}arraySync(){return fe(this.shape,this.dataSync(),this.dtype==="complex64")}async data(){this.throwIfDisposed();const t=xt().read(this.dataId);if(this.dtype==="string"){const n=await t;try{return n.map(r=>yn(r))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}}return t}dataToGPU(t){return this.throwIfDisposed(),xt().readToGPU(this.dataId,t)}dataSync(){this.throwIfDisposed();const t=xt().readSync(this.dataId);if(this.dtype==="string")try{return t.map(n=>yn(n))}catch{throw new Error("Failed to decode the string bytes into utf-8. To get the original bytes, call tensor.bytes().")}return t}async bytes(){this.throwIfDisposed();const t=await xt().read(this.dataId);return this.dtype==="string"?t:new Uint8Array(t.buffer)}dispose(){this.isDisposed||(this.kerasMask&&this.kerasMask.dispose(),xt().disposeTensor(this),this.isDisposedInternal=!0)}get isDisposed(){return this.isDisposedInternal}throwIfDisposed(){if(this.isDisposed)throw new Error("Tensor is disposed.")}print(t=!1){return ue.print(this,t)}clone(){return this.throwIfDisposed(),ue.clone(this)}toString(t=!1){const n=this.dataSync();return Ll(n,this.shape,this.dtype,t)}cast(t){return this.throwIfDisposed(),ue.cast(this,t)}variable(t=!0,n,r){return this.throwIfDisposed(),xt().makeVariable(this,t,n,r)}}Object.defineProperty(et,Symbol.hasInstance,{value:e=>!!e&&e.data!=null&&e.dataSync!=null&&e.throwIfDisposed!=null});function Gi(){return Sr("Tensor",()=>et)}Gi();class Be extends et{constructor(t,n,r,s){super(t.shape,t.dtype,t.dataId,s),this.trainable=n,this.name=r}assign(t){if(t.dtype!==this.dtype)throw new Error(`dtype of the new value (${t.dtype}) and previous value (${this.dtype}) must match`);if(!Ft(t.shape,this.shape))throw new Error(`shape of the new value (${t.shape}) and previous value (${this.shape}) must match`);xt().disposeTensor(this),this.dataId=t.dataId,xt().incRef(this,null)}dispose(){xt().disposeVariable(this),this.isDisposedInternal=!0}}Object.defineProperty(Be,Symbol.hasInstance,{value:e=>e instanceof et&&e.assign!=null&&e.assign instanceof Function});/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var rr;(function(e){e.R0="R0",e.R1="R1",e.R2="R2",e.R3="R3",e.R4="R4",e.R5="R5",e.R6="R6"})(rr||(rr={}));var sr;(function(e){e.float32="float32",e.int32="int32",e.bool="int32",e.complex64="complex64"})(sr||(sr={}));var or;(function(e){e.float32="float32",e.int32="int32",e.bool="bool",e.complex64="complex64"})(or||(or={}));var ar;(function(e){e.float32="float32",e.int32="float32",e.bool="float32",e.complex64="complex64"})(ar||(ar={}));var ir;(function(e){e.float32="complex64",e.int32="complex64",e.bool="complex64",e.complex64="complex64"})(ir||(ir={}));const Gl={float32:ar,int32:sr,bool:or,complex64:ir};function An(e,t){if(e==="string"||t==="string"){if(e==="string"&&t==="string")return"string";throw new Error(`Can not upcast ${e} with ${t}`)}return Gl[e][t]}function zl(e){return An(e,"int32")}function zi(e){return e!=null&&typeof e=="object"&&"texture"in e&&e.texture instanceof WebGLTexture}function Ki(e){return typeof GPUBuffer<"u"&&e!=null&&typeof e=="object"&&"buffer"in e&&e.buffer instanceof GPUBuffer}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function J(e,t){if(e.dtype===t.dtype)return[e,t];const n=An(e.dtype,t.dtype);return[e.cast(n),t.cast(n)]}function Vi(e,t){p(e.dtype===t.dtype,()=>`The dtypes of the first(${e.dtype}) and second(${t.dtype}) input must match`)}function Kl(e,t){return t.some(n=>n.id===e.id)}function Mr(e){const t=[];return Hi(e,t,new Set),t}function Hi(e,t,n){if(e==null)return;if(e instanceof et){t.push(e);return}if(!Vl(e))return;const r=e;for(const s in r){const o=r[s];n.has(o)||(n.add(o),Hi(o,t,n))}}function Vl(e){return Array.isArray(e)||typeof e=="object"}const Hl=Object.freeze(Object.defineProperty({__proto__:null,assertTypesMatch:Vi,getTensorsInContainer:Mr,isTensorInList:Kl,makeTypesMatch:J},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Vn(e){return e.kernelName!=null}class fs{constructor(){this.registeredVariables={},this.nextTapeNodeId=0,this.numBytes=0,this.numTensors=0,this.numStringTensors=0,this.numDataBuffers=0,this.gradientDepth=0,this.kernelDepth=0,this.scopeStack=[],this.numDataMovesStack=[],this.nextScopeId=0,this.tensorInfo=new WeakMap,this.profiling=!1,this.activeProfile={newBytes:0,newTensors:0,peakBytes:0,kernels:[],result:null,get kernelNames(){return Array.from(new Set(this.kernels.map(t=>t.name)))}}}dispose(){for(const t in this.registeredVariables)this.registeredVariables[t].dispose()}}class $e{constructor(t){this.ENV=t,this.registry={},this.registryFactory={},this.pendingBackendInitId=0,this.state=new fs}async ready(){if(this.pendingBackendInit!=null)return this.pendingBackendInit.then(()=>{});if(this.backendInstance!=null)return;const t=this.getSortedBackends();for(let n=0;n<t.length;n++){const r=t[n];if(await this.initializeBackend(r).success){await this.setBackend(r);return}}throw new Error("Could not initialize any backends, all backend initializations failed.")}get backend(){if(this.pendingBackendInit!=null)throw new Error(`Backend '${this.backendName}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);if(this.backendInstance==null){const{name:t,asyncInit:n}=this.initializeBackendsAndReturnBest();if(n)throw new Error(`The highest priority backend '${t}' has not yet been initialized. Make sure to await tf.ready() or await tf.setBackend() before calling other methods`);this.setBackend(t)}return this.backendInstance}backendNames(){return Object.keys(this.registryFactory)}findBackend(t){if(!(t in this.registry))if(t in this.registryFactory){const{asyncInit:n}=this.initializeBackend(t);if(n)return null}else return null;return this.registry[t]}findBackendFactory(t){return t in this.registryFactory?this.registryFactory[t].factory:null}registerBackend(t,n,r=1){return t in this.registryFactory?(Pt(`${t} backend was already registered. Reusing existing backend factory.`),!1):(this.registryFactory[t]={factory:n,priority:r},!0)}async setBackend(t){if(this.registryFactory[t]==null)throw new Error(`Backend name '${t}' not found in registry`);if(this.backendName=t,this.registry[t]==null){this.backendInstance=null;const{success:n,asyncInit:r}=this.initializeBackend(t);if(!(r?await n:n))return!1}return this.backendInstance=this.registry[t],this.setupRegisteredKernels(),this.profiler=new Bl(this.backendInstance),!0}setupRegisteredKernels(){wn(this.backendName).forEach(n=>{n.setupFunc!=null&&n.setupFunc(this.backendInstance)})}disposeRegisteredKernels(t){wn(t).forEach(r=>{r.disposeFunc!=null&&r.disposeFunc(this.registry[t])})}initializeBackend(t){const n=this.registryFactory[t];if(n==null)throw new Error(`Cannot initialize backend ${t}, no registration found.`);try{const r=n.factory();if(r&&!(r instanceof Fs)&&typeof r.then=="function"){const s=++this.pendingBackendInitId,o=r.then(a=>s<this.pendingBackendInitId?!1:(this.registry[t]=a,this.pendingBackendInit=null,!0)).catch(a=>(s<this.pendingBackendInitId||(this.pendingBackendInit=null,Pt(`Initialization of backend ${t} failed`),Pt(a.stack||a.message)),!1));return this.pendingBackendInit=o,{success:o,asyncInit:!0}}else return this.registry[t]=r,{success:!0,asyncInit:!1}}catch(r){return Pt(`Initialization of backend ${t} failed`),Pt(r.stack||r.message),{success:!1,asyncInit:!1}}}removeBackend(t){if(!(t in this.registryFactory))throw new Error(`${t} backend not found in registry`);this.backendName===t&&this.pendingBackendInit!=null&&this.pendingBackendInitId++,t in this.registry&&(this.disposeRegisteredKernels(t),this.registry[t].dispose(),delete this.registry[t]),delete this.registryFactory[t],this.backendName===t&&(this.pendingBackendInit=null,this.backendName=null,this.backendInstance=null)}getSortedBackends(){if(Object.keys(this.registryFactory).length===0)throw new Error("No backend found in registry.");return Object.keys(this.registryFactory).sort((t,n)=>this.registryFactory[n].priority-this.registryFactory[t].priority)}initializeBackendsAndReturnBest(){const t=this.getSortedBackends();for(let n=0;n<t.length;n++){const r=t[n],{success:s,asyncInit:o}=this.initializeBackend(r);if(o||s)return{name:r,asyncInit:o}}throw new Error("Could not initialize any backends, all backend initializations failed.")}moveData(t,n){const r=this.state.tensorInfo.get(n),s=r.backend,o=this.readSync(n),a=s.refCount(n);s.disposeData(n,!0),r.backend=t,t.move(n,o,r.shape,r.dtype,a),this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack[this.state.numDataMovesStack.length-1]++}tidy(t,n){let r=null;if(n==null){if(typeof t!="function")throw new Error("Please provide a function to tidy()");n=t}else{if(typeof t!="string"&&!(t instanceof String))throw new Error("When calling with two arguments, the first argument to tidy() must be a string");if(typeof n!="function")throw new Error("When calling with two arguments, the 2nd argument to tidy() must be a function");r=t}let s;return this.scopedRun(()=>this.startScope(r),()=>this.endScope(s),()=>(s=n(),s instanceof Promise&&console.error("Cannot return a Promise inside of tidy."),s))}scopedRun(t,n,r){t();try{const s=r();return n(),s}catch(s){throw n(),s}}nextTensorId(){return $e.nextTensorId++}nextVariableId(){return $e.nextVariableId++}clone(t){const n=w.runKernel(Ar,{x:t}),r={x:t},s=a=>({x:()=>{const i="float32",c={x:a},u={dtype:i};return w.runKernel(Ir,c,u)}}),o=[];return this.addTapeNode(this.state.activeScope.name,r,[n],s,o,{}),n}runKernel(t,n,r){if(this.backendName==null&&this.backend,!(Me(t,this.backendName)!=null))throw new Error(`Kernel '${t}' not registered for backend '${this.backendName}'`);return this.runKernelFunc({kernelName:t,inputs:n,attrs:r})}shouldCheckForMemLeaks(){return this.ENV.getBool("IS_TEST")}checkKernelForMemLeak(t,n,r){const s=this.backend.numDataIds();let o=0;r.forEach(c=>{o+=c.dtype==="complex64"?3:1});const a=this.state.numDataMovesStack[this.state.numDataMovesStack.length-1],i=s-n-o-a;if(i>0)throw new Error(`Backend '${this.backendName}' has an internal memory leak (${i} data ids) after running '${t}'`)}runKernelFunc(t){let n,r=[];const s=this.isTapeOn(),o=this.state.numBytes,a=this.state.numTensors;this.shouldCheckForMemLeaks()&&this.state.numDataMovesStack.push(0);let i;this.backendName==null&&this.backend;let c;const u=Vn(t)?t.kernelName:this.state.activeScope!=null?this.state.activeScope.name:"";if(Vn(t)){const{kernelName:y,inputs:$,attrs:E}=t;this.backendName==null&&this.backend;const v=Me(y,this.backendName);p(v!=null,()=>`Cannot find registered kernel '${y}' for backend '${this.backendName}'`),i=()=>{const B=this.backend.numDataIds();c=v.kernelFunc({inputs:$,attrs:E,backend:this.backend});const S=Array.isArray(c)?c:[c];this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(y,B,S);const _=S.map(A=>A.rank!=null?A:this.makeTensorFromTensorInfo(A));if(s){const A=this.getTensorsForGradient(y,$,_);r=this.saveTensorsForBackwardMode(A)}return _}}else{const{forwardFunc:y}=t,$=E=>{s&&(r=E.map(v=>this.keep(this.clone(v))))};i=()=>{const E=this.backend.numDataIds();c=this.tidy(()=>y(this.backend,$));const v=Array.isArray(c)?c:[c];return this.shouldCheckForMemLeaks()&&this.checkKernelForMemLeak(u,E,v),v}}const{inputs:h,attrs:l}=t,f=Vn(t)?null:t.backwardsFunc;let g;return this.scopedRun(()=>this.state.kernelDepth++,()=>this.state.kernelDepth--,()=>{!this.ENV.getBool("DEBUG")&&!this.state.profiling?n=i():(g=this.profiler.profileKernel(u,h,()=>i()),this.ENV.getBool("DEBUG")&&this.profiler.logKernelProfile(g),n=g.outputs)}),s&&this.addTapeNode(u,h,n,f,r,l),this.state.profiling&&this.state.activeProfile.kernels.push({name:u,bytesAdded:this.state.numBytes-o,totalBytesSnapshot:this.state.numBytes,tensorsAdded:this.state.numTensors-a,totalTensorsSnapshot:this.state.numTensors,inputShapes:Object.keys(h).map(y=>h[y]!=null?h[y].shape:null),outputShapes:n.map(y=>y.shape),kernelTimeMs:g.timeMs,extraInfo:g.extraInfo}),Array.isArray(c)?n:n[0]}saveTensorsForBackwardMode(t){return t.map(r=>this.keep(this.clone(r)))}getTensorsForGradient(t,n,r){const s=er(t);if(s!=null){const o=s.inputsToSave||[],a=s.outputsToSave||[];let i;s.saveAllInputs?(p(Array.isArray(n),()=>"saveAllInputs is true, expected inputs to be an array."),i=Object.keys(n).map(u=>n[u])):i=o.map(u=>n[u]);const c=r.filter((u,h)=>a[h]);return i.concat(c)}return[]}makeTensor(t,n,r,s){if(t==null)throw new Error("Values passed to engine.makeTensor() are null");r=r||"float32",s=s||this.backend;let o=t;r==="string"&&Lt(t[0])&&(o=t.map(c=>je(c)));const a=s.write(o,n,r),i=new et(n,r,a,this.nextTensorId());if(this.trackTensor(i,s),r==="string"){const c=this.state.tensorInfo.get(a),u=Ws(o);this.state.numBytes+=u-c.bytes,c.bytes=u}return i}makeTensorFromDataId(t,n,r,s){r=r||"float32";const o={dataId:t,shape:n,dtype:r};return this.makeTensorFromTensorInfo(o,s)}makeTensorFromTensorInfo(t,n){const{dataId:r,shape:s,dtype:o}=t,a=new et(s,o,r,this.nextTensorId());return this.trackTensor(a,n),a}makeVariable(t,n=!0,r,s){r=r||this.nextVariableId().toString(),s!=null&&s!==t.dtype&&(t=t.cast(s));const o=new Be(t,n,r,this.nextTensorId());if(this.state.registeredVariables[o.name]!=null)throw new Error(`Variable with name ${o.name} was already registered`);return this.state.registeredVariables[o.name]=o,this.incRef(o,this.backend),o}trackTensor(t,n){this.state.numTensors++,t.dtype==="string"&&this.state.numStringTensors++;let r=0;t.dtype!=="complex64"&&t.dtype!=="string"&&(r=t.size*mn(t.dtype)),this.state.numBytes+=r,this.state.tensorInfo.has(t.dataId)||(this.state.numDataBuffers++,this.state.tensorInfo.set(t.dataId,{backend:n||this.backend,dtype:t.dtype,shape:t.shape,bytes:r})),t instanceof Be||this.track(t)}incRef(t,n){this.trackTensor(t,n),this.backend.incRef(t.dataId)}removeDataId(t,n){this.state.tensorInfo.has(t)&&this.state.tensorInfo.get(t).backend===n&&(this.state.tensorInfo.delete(t),this.state.numDataBuffers--)}disposeTensor(t){if(!this.state.tensorInfo.has(t.dataId))return;const n=this.state.tensorInfo.get(t.dataId);if(this.state.numTensors--,t.dtype==="string"&&(this.state.numStringTensors--,this.state.numBytes-=n.bytes),t.dtype!=="complex64"&&t.dtype!=="string"){const r=t.size*mn(t.dtype);this.state.numBytes-=r}n.backend.disposeData(t.dataId)&&this.removeDataId(t.dataId,n.backend)}disposeVariables(){for(const t in this.state.registeredVariables){const n=this.state.registeredVariables[t];this.disposeVariable(n)}}disposeVariable(t){this.disposeTensor(t),this.state.registeredVariables[t.name]!=null&&delete this.state.registeredVariables[t.name]}memory(){const t=this.backend.memory();return t.numTensors=this.state.numTensors,t.numDataBuffers=this.state.numDataBuffers,t.numBytes=this.state.numBytes,this.state.numStringTensors>0&&(t.unreliable=!0,t.reasons==null&&(t.reasons=[]),t.reasons.push("Memory usage by string tensors is approximate (2 bytes per character)")),t}async profile(t){this.state.profiling=!0;const n=this.state.numBytes,r=this.state.numTensors;this.state.activeProfile.kernels=[],this.state.activeProfile.result=await t(),this.state.profiling=!1,this.state.activeProfile.peakBytes=Math.max(...this.state.activeProfile.kernels.map(s=>s.totalBytesSnapshot)),this.state.activeProfile.newBytes=this.state.numBytes-n,this.state.activeProfile.newTensors=this.state.numTensors-r;for(const s of this.state.activeProfile.kernels)s.kernelTimeMs=await s.kernelTimeMs,s.extraInfo=await s.extraInfo;return this.state.activeProfile}isTapeOn(){return this.state.gradientDepth>0&&this.state.kernelDepth===0}addTapeNode(t,n,r,s,o,a){const i={id:this.state.nextTapeNodeId++,kernelName:t,inputs:n,outputs:r,saved:o},c=er(t);c!=null&&(s=c.gradFunc),s!=null&&(i.gradient=u=>(u=u.map((h,l)=>{if(h==null){const f=r[l],g=Tn(f.size,f.dtype);return this.makeTensor(g,f.shape,f.dtype)}return h}),s(u.length>1?u:u[0],o,a))),this.state.activeTape.push(i)}keep(t){return t.kept=!0,t}startTape(){this.state.gradientDepth===0&&(this.state.activeTape=[]),this.state.gradientDepth++}endTape(){this.state.gradientDepth--}startScope(t){const n={track:[],name:"unnamed scope",id:this.state.nextScopeId++};t&&(n.name=t),this.state.scopeStack.push(n),this.state.activeScope=n}endScope(t){const n=Mr(t),r=new Set(n.map(o=>o.id));for(let o=0;o<this.state.activeScope.track.length;o++){const a=this.state.activeScope.track[o];!a.kept&&!r.has(a.id)&&a.dispose()}const s=this.state.scopeStack.pop();this.state.activeScope=this.state.scopeStack.length===0?null:this.state.scopeStack[this.state.scopeStack.length-1],n.forEach(o=>{!o.kept&&o.scopeId===s.id&&this.track(o)})}gradients(t,n,r,s=!1){if(p(n.length>0,()=>"gradients() received an empty list of xs."),r!=null&&r.dtype!=="float32")throw new Error(`dy must have 'float32' dtype, but has '${r.dtype}'`);const o=this.scopedRun(()=>this.startTape(),()=>this.endTape(),()=>this.tidy("forward",t));p(o instanceof et,()=>"The result y returned by f() must be a tensor.");const a=Pl(this.state.activeTape,n,o);if(!s&&a.length===0&&n.length>0)throw new Error("Cannot compute gradient of y=f(x) with respect to x. Make sure that the f you passed encloses all operations that lead from x to y.");return this.tidy("backward",()=>{const i={};i[o.id]=r??jl(o.shape),Ol(i,a,u=>this.tidy(u),Xl);const c=n.map(u=>i[u.id]);return this.state.gradientDepth===0&&(this.state.activeTape.forEach(u=>{for(const h of u.saved)h.dispose()}),this.state.activeTape=null),{value:o,grads:c}})}customGrad(t){return p(Gt(t),()=>"The f passed in customGrad(f) must be a function."),(...n)=>{p(n.every(i=>i instanceof et),()=>"The args passed in customGrad(f)(x1, x2,...) must all be tensors");let r;const s={};n.forEach((i,c)=>{s[c]=i});const o=(i,c)=>(r=t(...n,c),p(r.value instanceof et,()=>"The function f passed in customGrad(f) must return an object where `obj.value` is a tensor"),p(Gt(r.gradFunc),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function."),r.value),a=(i,c)=>{const u=r.gradFunc(i,c),h=Array.isArray(u)?u:[u];p(h.length===n.length,()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns the same number of tensors as inputs passed to f(...)."),p(h.every(f=>f instanceof et),()=>"The function f passed in customGrad(f) must return an object where `obj.gradFunc` is a function that returns a list of only tensors.");const l={};return h.forEach((f,g)=>{l[g]=()=>f}),l};return this.runKernelFunc({forwardFunc:o,backwardsFunc:a,inputs:s})}}readSync(t){return this.state.tensorInfo.get(t).backend.readSync(t)}read(t){return this.state.tensorInfo.get(t).backend.read(t)}readToGPU(t,n){return this.state.tensorInfo.get(t).backend.readToGPU(t,n)}async time(t){const n=Fe(),r=await this.backend.time(t);return r.wallMs=Fe()-n,r}track(t){return this.state.activeScope!=null&&(t.scopeId=this.state.activeScope.id,this.state.activeScope.track.push(t)),t}get registeredVariables(){return this.state.registeredVariables}reset(){this.pendingBackendInitId++,this.state.dispose(),this.ENV.reset(),this.state=new fs;for(const t in this.registry)this.disposeRegisteredKernels(t),this.registry[t].dispose(),delete this.registry[t];this.backendName=null,this.backendInstance=null,this.pendingBackendInit=null}}$e.nextTensorId=0;$e.nextVariableId=0;function jl(e){const t=xr(G(e),"float32");return w.makeTensor(t,e,"float32")}function ji(){const e=Ks();if(e._tfengine==null){const t=new zs(e);e._tfengine=new $e(t)}return Yu(e._tfengine.ENV),ql(()=>e._tfengine),e._tfengine}const w=ji();function Xl(e,t){const n={a:e,b:t};return w.runKernel(Tr,n)}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Zl(){return typeof navigator<"u"&&navigator!=null}let cr;function Yl(e){cr=e}function Jl(e){if(cr!==void 0)return cr;if(e||Zl()){if(e||(e=navigator),e.product==="ReactNative")return!0;const t=e.userAgent||e.vendor||(typeof window<"u"?window.opera:"");if(!t){const n=e;return n.userAgentData&&n.userAgentData.mobile}return/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0,4))}return!1}function Xi(){return typeof window<"u"&&window.document!=null||typeof WorkerGlobalScope<"u"}const Ql=Object.freeze(Object.defineProperty({__proto__:null,isBrowser:Xi,isMobile:Jl,mockIsMobile:Yl},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const dt=L();dt.registerFlag("DEBUG",()=>!1,e=>{e&&console.warn("Debugging mode is ON. The output of every math call will be downloaded to CPU and checked for NaNs. This significantly impacts performance.")});dt.registerFlag("IS_BROWSER",()=>Xi());dt.registerFlag("IS_NODE",()=>typeof process<"u"&&typeof process.versions<"u"&&typeof process.versions.node<"u");dt.registerFlag("IS_CHROME",()=>typeof navigator<"u"&&navigator!=null&&navigator.userAgent!=null&&/Chrome/.test(navigator.userAgent)&&/Google Inc/.test(navigator.vendor));dt.registerFlag("IS_SAFARI",()=>typeof navigator<"u"&&navigator!=null&&navigator.userAgent!=null&&/Safari/.test(navigator.userAgent)&&/Apple/.test(navigator.vendor));dt.registerFlag("PROD",()=>!1);dt.registerFlag("TENSORLIKE_CHECK_SHAPE_CONSISTENCY",()=>dt.getBool("DEBUG"));dt.registerFlag("DEPRECATION_WARNINGS_ENABLED",()=>!0);dt.registerFlag("IS_TEST",()=>!1);dt.registerFlag("CHECK_COMPUTATION_FOR_ERRORS",()=>dt.getBool("DEBUG"));dt.registerFlag("WRAP_TO_IMAGEBITMAP",()=>!1);dt.registerFlag("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU",()=>!1);dt.registerFlag("USE_SETTIMEOUTCUSTOM",()=>!1);/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function _t(e,t){let n=e;if(at(e))return t==="string"?[]:[e.length];if(zi(e)){const s=e.channels||"RGBA";return[e.height,e.width*s.length]}else if(Ki(e))return[e.buffer.size/(t==null?4:mn(t))];if(!Array.isArray(e))return[];const r=[];for(;Array.isArray(n)||at(n)&&t!=="string";)r.push(n.length),n=n[0];return Array.isArray(e)&&L().getBool("TENSORLIKE_CHECK_SHAPE_CONSISTENCY")&&Zi(e,r,[]),r}function Zi(e,t,n){if(n=n||[],!Array.isArray(e)&&!at(e)){p(t.length===0,()=>`Element arr[${n.join("][")}] is a primitive, but should be an array/TypedArray of ${t[0]} elements`);return}p(t.length>0,()=>`Element arr[${n.join("][")}] should be a primitive, but is an array of ${e.length} elements`),p(e.length===t[0],()=>`Element arr[${n.join("][")}] should have ${t[0]} elements, but has ${e.length} elements`);const r=t.slice(1);for(let s=0;s<e.length;++s)Zi(e[s],r,n.concat(s))}function ds(e,t,n,r){if(e!=="string_or_numeric"){if(e==null)throw new Error("Expected dtype cannot be null.");if(e!=="numeric"&&e!==t||e==="numeric"&&t==="string")throw new Error(`Argument '${n}' passed to '${r}' must be ${e} tensor, but got ${t} tensor`)}}function d(e,t,n,r="numeric"){if(e instanceof Gi())return ds(r,e.dtype,t,n),e;let s=Ve(e);if(s!=="string"&&["bool","int32","float32"].indexOf(r)>=0&&(s=r),ds(r,s,t,n),e==null||!at(e)&&!Array.isArray(e)&&typeof e!="number"&&typeof e!="boolean"&&typeof e!="string"){const c=e==null?"null":e.constructor.name;throw new Error(`Argument '${t}' passed to '${n}' must be a Tensor or TensorLike, but got '${c}'`)}const o=_t(e,s);!at(e)&&!Array.isArray(e)&&(e=[e]);const i=s!=="string"?_n(e,s):zt(e,[],!0);return w.makeTensor(i,o,s)}function Re(e,t,n,r="numeric"){if(!Array.isArray(e))throw new Error(`Argument ${t} passed to ${n} must be a \`Tensor[]\` or \`TensorLike[]\``);return e.map((o,a)=>d(o,`${t}[${a}]`,n,r))}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Yi="__op";function b(e){const t=Object.keys(e);if(t.length!==1)throw new Error(`Please provide an object with a single key (operation name) mapping to a function. Got an object with ${t.length} keys.`);let n=t[0];const r=e[n];n.endsWith("_")&&(n=n.substring(0,n.length-1)),n=n+Yi;const s=(...o)=>{w.startScope(n);try{const a=r(...o);return In(a)&&console.error("Cannot return a Promise inside of tidy."),w.endScope(a),a}catch(a){throw w.endScope(null),a}};return Object.defineProperty(s,"name",{value:n,configurable:!0}),s}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function th(e,t){const n=d(e,"real","complex"),r=d(t,"imag","complex");ht(n.shape,r.shape,`real and imag shapes, ${n.shape} and ${r.shape}, must match in call to tf.complex().`);const s={real:n,imag:r};return w.runKernel(go,s)}const Kt=b({complex_:th});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ht(e,t,n,r){if(r==null)r=Ve(e);else if(r==="complex64")throw new Error("Cannot construct a complex64 tensor directly. Please use tf.complex(real, imag).");if(Ki(e)||zi(e)){if(r!=="float32"&&r!=="int32")throw new Error(`Creating tensor from GPU data only supports 'float32'|'int32' dtype, while the dtype is ${r}.`);return w.backend.createTensorFromGPUData(e,t||n,r)}if(!at(e)&&!Array.isArray(e)&&typeof e!="number"&&typeof e!="boolean"&&typeof e!="string")throw new Error("values passed to tensor(values) must be a number/boolean/string or an array of numbers/booleans/strings, or a TypedArray");if(t!=null){mt(t);const s=G(t),o=G(n);p(s===o,()=>`Based on the provided shape, [${t}], the tensor should have ${s} values but has ${o}`);for(let a=0;a<n.length;++a){const i=n[a],c=a===n.length-1?i!==G(t.slice(a)):!0;p(n[a]===t[a]||!c,()=>`Error creating a new Tensor. Inferred shape (${n}) does not match the provided shape (${t}). `)}}return!at(e)&&!Array.isArray(e)&&(e=[e]),t=t||n,e=r!=="string"?_n(e,r):zt(e,[],!0),w.makeTensor(e,t,r)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function de(e,t,n){const r=_t(e,n);return Ht(e,t,r,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const ee={float32:4,float16:2,int32:4,uint16:2,uint8:1,bool:1,complex64:8};class St{static join(t){return new St(t).slice()}constructor(t){if(this.shards=[],this.previousShardIndex=0,t==null||(t instanceof Array||(t=[t]),t=t.map(r=>at(r)?r.buffer:r),t.length===0))return;this.bufferUniformSize=t[0].byteLength;let n=0;for(let r=0;r<t.length;r++){const s=t[r];r!==t.length-1&&s.byteLength!==this.bufferUniformSize&&(this.bufferUniformSize=void 0);const o=n+s.byteLength;this.shards.push({buffer:s,start:n,end:o}),n=o}this.shards.length===0&&(this.byteLength=0),this.byteLength=this.shards[this.shards.length-1].end}slice(t=0,n=this.byteLength){if(this.shards.length===0)return new ArrayBuffer(0);if(t=isNaN(Number(t))?0:t,n=isNaN(Number(n))?0:n,t=Math.max(0,t),n=Math.min(this.byteLength,n),n<=t)return new ArrayBuffer(0);const r=this.findShardForByte(t);if(r===-1)throw new Error(`Could not find start shard for byte ${t}`);const s=n-t,o=new ArrayBuffer(s),a=new Uint8Array(o);let i=0;for(let c=r;c<this.shards.length;c++){const u=this.shards[c],l=t+i-u.start,f=i,y=Math.min(n,u.end)-u.start,$=new Uint8Array(u.buffer,l,y-l);if(a.set($,f),i+=$.length,n<u.end)break}return o}findShardForByte(t){if(this.shards.length===0||t<0||t>=this.byteLength)return-1;if(this.bufferUniformSize!=null)return this.previousShardIndex=Math.floor(t/this.bufferUniformSize),this.previousShardIndex;function n(s){return t<s.start?-1:t>=s.end?1:0}if(n(this.shards[this.previousShardIndex])===0)return this.previousShardIndex;const r=eh(this.shards,n);return r===-1?-1:(this.previousShardIndex=r,this.previousShardIndex)}}function eh(e,t){let n=0,r=e.length;for(;n<=r;){const s=Math.floor((r-n)/2)+n,o=t(e[s]);if(o===0)return s;o<0?r=s:n=s+1}return-1}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function nh(){L().set("PROD",!0)}function rh(){L().set("DEBUG",!0)}function sh(){L().set("DEPRECATION_WARNINGS_ENABLED",!1),console.warn("TensorFlow.js deprecation warnings have been disabled.")}function oh(e){L().getBool("DEPRECATION_WARNINGS_ENABLED")&&console.warn(e+" You can disable deprecation warnings with tf.disableDeprecationWarnings().")}function ah(){w.disposeVariables()}function ih(){return w}function ch(){return w.memory()}function uh(e){return w.profile(e)}function nt(e,t){return w.tidy(e,t)}function ft(e){Mr(e).forEach(n=>n.dispose())}function Ji(e){return w.keep(e)}function lh(e){return w.time(e)}function hh(e){return w.setBackend(e)}function fh(){return w.ready()}function Qi(){return w.backendName}function dh(e){w.removeBackend(e)}function ph(e){return w.findBackend(e)}function gh(e){return w.findBackendFactory(e)}function mh(e,t,n=1){return w.registerBackend(e,t,n)}function tc(){return w.backend}function bh(e,t){L().setPlatform(e,t)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Vt=4;async function wh(e,t){const n=[],r=[],s=Array.isArray(e)?e.map(a=>a.name):Object.keys(e);for(let a=0;a<s.length;++a){const i=s[a],c=Array.isArray(e)?e[a].tensor:e[i];if(c.dtype!=="float32"&&c.dtype!=="int32"&&c.dtype!=="bool"&&c.dtype!=="string"&&c.dtype!=="complex64")throw new Error(`Unsupported dtype in weight '${i}': ${c.dtype}`);const u={name:i,shape:c.shape,dtype:c.dtype};if(c.dtype==="string"){const h=new Promise(async l=>{const f=await c.bytes(),g=f.reduce((E,v)=>E+v.length,0)+Vt*f.length,y=new Uint8Array(g);let $=0;for(let E=0;E<f.length;E++){const v=f[E],B=new Uint8Array(new Uint32Array([v.length]).buffer);y.set(B,$),$+=Vt,y.set(v,$),$+=v.length}l(y)});r.push(h)}else r.push(c.data());t!=null&&(u.group=t),n.push(u)}const o=await Promise.all(r);return{data:kh(o),specs:n}}function ec(e,t){const n=new St(e),r={};let s=0;for(const o of t){const a=yh(o,(i,c)=>n.slice(s+i,s+c));r[o.name]=nc(o,n.slice(s,s+a)),s+=a}return r}function yh(e,t){const n=G(e.shape);let r;if("quantization"in e){const s=e.quantization;r=ee[s.dtype]}else if(e.dtype==="string"){let s=0;for(let o=0;o<n;o++)s+=Vt+new Uint32Array(t(s,s+Vt))[0];return s}else r=ee[e.dtype];return n*r}async function $h(e,t){const n=G(e.shape);let r;if("quantization"in e){const s=e.quantization;r=ee[s.dtype]}else if(e.dtype==="string"){let s=0;for(let o=0;o<n;o++)s+=Vt+new Uint32Array(await t(s,s+Vt))[0];return s}else r=ee[e.dtype];return n*r}function nc(e,t){const n=e.name,r=e.dtype,s=e.shape,o=G(s);let a,i=0;if("quantization"in e){const c=e.quantization;if(c.dtype==="uint8"||c.dtype==="uint16"){if(!("min"in c&&"scale"in c))throw new Error(`Weight ${e.name} with quantization ${c.dtype} doesn't have corresponding metadata min and scale.`)}else if(c.dtype==="float16"){if(r!=="float32")throw new Error(`Weight ${e.name} is quantized with ${c.dtype} which only supports weights of type float32 not ${r}.`)}else throw new Error(`Weight ${e.name} has unknown quantization dtype ${c.dtype}. Supported quantization dtypes are: 'uint8', 'uint16', and 'float16'.`);const u=ee[c.dtype],h=c.dtype==="uint8"?new Uint8Array(t):new Uint16Array(t);if(r==="float32")if(c.dtype==="uint8"||c.dtype==="uint16"){a=new Float32Array(h.length);for(let l=0;l<h.length;l++){const f=h[l];a[l]=f*c.scale+c.min}}else if(c.dtype==="float16")a=Ah()(h);else throw new Error(`Unsupported quantization type ${c.dtype} for weight type float32.`);else if(r==="int32"){if(c.dtype!=="uint8"&&c.dtype!=="uint16")throw new Error(`Unsupported quantization type ${c.dtype} for weight type int32.`);a=new Int32Array(h.length);for(let l=0;l<h.length;l++){const f=h[l];a[l]=Math.round(f*c.scale+c.min)}}else throw new Error(`Unsupported dtype in weight '${n}': ${r}`);i+=o*u}else if(r==="string"){const c=G(e.shape);a=[];for(let u=0;u<c;u++){const h=new Uint32Array(t.slice(i,i+Vt))[0];i+=Vt;const l=new Uint8Array(t.slice(i,i+h));a.push(l),i+=h}}else{const c=ee[r];if(r==="float32")a=new Float32Array(t);else if(r==="int32")a=new Int32Array(t);else if(r==="bool")a=new Uint8Array(t);else if(r==="complex64"){a=new Float32Array(t);const u=new Float32Array(a.length/2),h=new Float32Array(a.length/2);for(let y=0;y<u.length;y++)u[y]=a[y*2],h[y]=a[y*2+1];const l=de(u,s,"float32"),f=de(h,s,"float32"),g=Kt(l,f);return l.dispose(),f.dispose(),g}else throw new Error(`Unsupported dtype in weight '${n}': ${r}`);i+=o*c}return de(a,s,r)}async function ps(e,t,n){let r=new Uint8Array(t);for(;r.byteLength<n;){const{done:s,value:o}=await e.read();if(s&&o==null){const i=n-r.byteLength;throw new Error(`Reader is done but ${i} bytes are still expected`)}const a=new Uint8Array(r.length+o.byteLength);a.set(r,0),a.set(new Uint8Array(o),r.length),r=a}return r.buffer}async function Eh(e,t){const n={},r=e.getReader();let s=new ArrayBuffer(0);for(const o of t){const a=await $h(o,async(u,h)=>(s=await ps(r,s,h),s.slice(u,h)));s=await ps(r,s,a);const i=s.slice(0,a);s=s.slice(a);const c=nc(o,i);if(n[o.name]=c,Qi()==="webgpu"){const u=tc();"uploadToGPU"in u&&G(c.shape)>=L().get("WEBGPU_CPU_HANDOFF_SIZE_THRESHOLD")&&u.uploadToGPU(c.dataId)}}return n}function kh(e){if(e===null)throw new Error(`Invalid input value: ${JSON.stringify(e)}`);let t=0;const n=[];e.forEach(o=>{if(t+=o.byteLength,n.push(o.byteLength===o.buffer.byteLength?o:new o.constructor(o)),!(o instanceof Float32Array||o instanceof Int32Array||o instanceof Uint8Array))throw new Error(`Unsupported TypedArray subtype: ${o.constructor.name}`)});const r=new Uint8Array(t);let s=0;return n.forEach(o=>{r.set(new Uint8Array(o.buffer),s),s+=o.byteLength}),r.buffer}const Fr=typeof Buffer<"u"&&(typeof Blob>"u"||typeof atob>"u"||typeof btoa>"u");function gs(e){return Fr?Buffer.byteLength(e,"utf8"):new Blob([e]).size}function xh(e){if(Fr)return Buffer.from(e).toString("base64");const t=new Uint8Array(e);let n="";for(let r=0,s=t.length;r<s;r++)n+=String.fromCharCode(t[r]);return btoa(n)}function vh(e){if(Fr){const r=Buffer.from(e,"base64");return r.buffer.slice(r.byteOffset,r.byteOffset+r.byteLength)}const t=atob(e),n=new Uint8Array(t.length);for(let r=0;r<t.length;++r)n.set([t.charCodeAt(r)],r);return n.buffer}function Sh(e){return St.join(e)}function ms(e){for(e=e.trim();e.endsWith("/");)e=e.slice(0,e.length-1);const n=e.split("/");return n[n.length-1]}function rc(e,t){const n={modelTopology:e.modelTopology,format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy,weightsManifest:t};return e.signature!=null&&(n.signature=e.signature),e.userDefinedMetadata!=null&&(n.userDefinedMetadata=e.userDefinedMetadata),e.modelInitializer!=null&&(n.modelInitializer=e.modelInitializer),e.initializerSignature!=null&&(n.initializerSignature=e.initializerSignature),e.trainingConfig!=null&&(n.trainingConfig=e.trainingConfig),n}function sc(e,t,n){const r={modelTopology:e.modelTopology,format:e.format,generatedBy:e.generatedBy,convertedBy:e.convertedBy};if(e.trainingConfig!=null&&(r.trainingConfig=e.trainingConfig),e.weightsManifest!=null){if(!t)throw new Error("modelJSON has weightsManifest but weightSpecs is null");if(!n)throw new Error("modelJSON has weightsManifest but weightData is null");r.weightSpecs=t,r.weightData=n}return e.signature!=null&&(r.signature=e.signature),e.userDefinedMetadata!=null&&(r.userDefinedMetadata=e.userDefinedMetadata),e.modelInitializer!=null&&(r.modelInitializer=e.modelInitializer),e.initializerSignature!=null&&(r.initializerSignature=e.initializerSignature),r}async function Br(e,t){let n,r;return e.weightsManifest!=null&&([n,r]=await t(e.weightsManifest)),sc(e,n,r)}function Xe(e){if(e.modelTopology instanceof ArrayBuffer)throw new Error("Expected JSON model topology, received ArrayBuffer.");return{dateSaved:new Date,modelTopologyType:"JSON",modelTopologyBytes:e.modelTopology==null?0:gs(JSON.stringify(e.modelTopology)),weightSpecsBytes:e.weightSpecs==null?0:gs(JSON.stringify(e.weightSpecs)),weightDataBytes:e.weightData==null?0:new St(e.weightData).byteLength}}function ur(e){const t=[];for(const n of e)t.push(...n.weights);return t}function Th(){const e=n=>{let r=n<<13,s=0;for(;(r&8388608)===0;)s-=8388608,r<<=1;return r&=-8388609,s+=947912704,r|s},t=new Uint32Array(2048);t[0]=0;for(let n=1;n<1024;n++)t[n]=e(n);for(let n=1024;n<2048;n++)t[n]=939524096+(n-1024<<13);return t}function Ih(){const e=new Uint32Array(64);e[0]=0,e[31]=1199570944,e[32]=2147483648,e[63]=3347054592;for(let t=1;t<31;t++)e[t]=t<<23;for(let t=33;t<63;t++)e[t]=2147483648+(t-32<<23);return e}function _h(){const e=new Uint32Array(64);for(let t=0;t<64;t++)e[t]=1024;return e[0]=e[32]=0,e}function Ah(){const e=Th(),t=Ih(),n=_h();return r=>{const s=new ArrayBuffer(4*r.length),o=new Uint32Array(s);for(let a=0;a<r.length;a++){const i=r[a],c=e[n[i>>10]+(i&1023)]+t[i>>10];o[a]=c}return new Float32Array(s)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Y{constructor(){this.saveRouters=[],this.loadRouters=[]}static getInstance(){return Y.instance==null&&(Y.instance=new Y),Y.instance}static registerSaveRouter(t){Y.getInstance().saveRouters.push(t)}static registerLoadRouter(t){Y.getInstance().loadRouters.push(t)}static getSaveHandlers(t){return Y.getHandlers(t,"save")}static getLoadHandlers(t,n){return Y.getHandlers(t,"load",n)}static getHandlers(t,n,r){const s=[];return(n==="load"?Y.getInstance().loadRouters:Y.getInstance().saveRouters).forEach(a=>{const i=a(t,r);i!==null&&s.push(i)}),s}}const Dh=e=>Y.registerSaveRouter(e),Nh=e=>Y.registerLoadRouter(e),Mh=e=>Y.getSaveHandlers(e),Fh=(e,t)=>Y.getLoadHandlers(e,t);/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const lr="tensorflowjs",hr=1,Jt="models_store",Wt="model_info_store";function oc(){if(!L().getBool("IS_BROWSER"))throw new Error("Failed to obtain IndexedDB factory because the current environmentis not a web browser.");const e=typeof window>"u"?self:window,t=e.indexedDB||e.mozIndexedDB||e.webkitIndexedDB||e.msIndexedDB||e.shimIndexedDB;if(t==null)throw new Error("The current browser does not appear to support IndexedDB.");return t}function fr(e){const t=e.result;t.createObjectStore(Jt,{keyPath:"modelPath"}),t.createObjectStore(Wt,{keyPath:"modelPath"})}class ne{constructor(t){if(this.indexedDB=oc(),t==null||!t)throw new Error("For IndexedDB, modelPath must not be null, undefined or empty.");this.modelPath=t}async save(t){if(t.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");return this.databaseAction(this.modelPath,t)}async load(){return this.databaseAction(this.modelPath)}databaseAction(t,n){return new Promise((r,s)=>{const o=this.indexedDB.open(lr,hr);o.onupgradeneeded=()=>fr(o),o.onsuccess=()=>{const a=o.result;if(n==null){const i=a.transaction(Jt,"readonly"),u=i.objectStore(Jt).get(this.modelPath);u.onsuccess=()=>{if(u.result==null)return a.close(),s(new Error(`Cannot find model with path '${this.modelPath}' in IndexedDB.`));r(u.result.modelArtifacts)},u.onerror=h=>(a.close(),s(u.error)),i.oncomplete=()=>a.close()}else{n.weightData=St.join(n.weightData);const i=Xe(n),c=a.transaction(Wt,"readwrite");let u=c.objectStore(Wt),h;try{h=u.put({modelPath:this.modelPath,modelArtifactsInfo:i})}catch(f){return s(f)}let l;h.onsuccess=()=>{l=a.transaction(Jt,"readwrite");const f=l.objectStore(Jt);let g;try{g=f.put({modelPath:this.modelPath,modelArtifacts:n,modelArtifactsInfo:i})}catch(y){return s(y)}g.onsuccess=()=>r({modelArtifactsInfo:i}),g.onerror=y=>{u=c.objectStore(Wt);const $=u.delete(this.modelPath);$.onsuccess=()=>(a.close(),s(g.error)),$.onerror=E=>(a.close(),s(g.error))}},h.onerror=f=>(a.close(),s(h.error)),c.oncomplete=()=>{l==null?a.close():l.oncomplete=()=>a.close()}}},o.onerror=a=>s(o.error)})}}ne.URL_SCHEME="indexeddb://";const ac=e=>L().getBool("IS_BROWSER")&&!Array.isArray(e)&&e.startsWith(ne.URL_SCHEME)?Bh(e.slice(ne.URL_SCHEME.length)):null;Y.registerSaveRouter(ac);Y.registerLoadRouter(ac);function Bh(e){return new ne(e)}function Rh(e){return e.startsWith(ne.URL_SCHEME)?e.slice(ne.URL_SCHEME.length):e}class Ch{constructor(){this.indexedDB=oc()}async listModels(){return new Promise((t,n)=>{const r=this.indexedDB.open(lr,hr);r.onupgradeneeded=()=>fr(r),r.onsuccess=()=>{const s=r.result,o=s.transaction(Wt,"readonly"),i=o.objectStore(Wt).getAll();i.onsuccess=()=>{const c={};for(const u of i.result)c[u.modelPath]=u.modelArtifactsInfo;t(c)},i.onerror=c=>(s.close(),n(i.error)),o.oncomplete=()=>s.close()},r.onerror=s=>n(r.error)})}async removeModel(t){return t=Rh(t),new Promise((n,r)=>{const s=this.indexedDB.open(lr,hr);s.onupgradeneeded=()=>fr(s),s.onsuccess=()=>{const o=s.result,a=o.transaction(Wt,"readwrite"),i=a.objectStore(Wt),c=i.get(t);let u;c.onsuccess=()=>{if(c.result==null)return o.close(),r(new Error(`Cannot find model with path '${t}' in IndexedDB.`));{const h=i.delete(t),l=()=>{u=o.transaction(Jt,"readwrite");const g=u.objectStore(Jt).delete(t);g.onsuccess=()=>n(c.result.modelArtifactsInfo),g.onerror=y=>r(c.error)};h.onsuccess=l,h.onerror=f=>(l(),o.close(),r(c.error))}},c.onerror=h=>(o.close(),r(c.error)),a.oncomplete=()=>{u==null?o.close():u.oncomplete=()=>o.close()}},s.onerror=o=>r(s.error)})}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Dt="/",le="tensorflowjs_models",ic="info",Ph="model_topology",Oh="weight_specs",Lh="weight_data",Wh="model_metadata";function cc(e){return{info:[le,e,ic].join(Dt),topology:[le,e,Ph].join(Dt),weightSpecs:[le,e,Oh].join(Dt),weightData:[le,e,Lh].join(Dt),modelMetadata:[le,e,Wh].join(Dt)}}function uc(e){for(const t of Object.values(e))window.localStorage.removeItem(t)}function qh(e){const t=e.split(Dt);if(t.length<3)throw new Error(`Invalid key format: ${e}`);return t.slice(1,t.length-1).join(Dt)}function Uh(e){return e.startsWith(re.URL_SCHEME)?e.slice(re.URL_SCHEME.length):e}class re{constructor(t){if(!L().getBool("IS_BROWSER")||typeof window>"u"||typeof window.localStorage>"u")throw new Error("The current environment does not support local storage.");if(this.LS=window.localStorage,t==null||!t)throw new Error("For local storage, modelPath must not be null, undefined or empty.");this.modelPath=t,this.keys=cc(this.modelPath)}async save(t){if(t.modelTopology instanceof ArrayBuffer)throw new Error("BrowserLocalStorage.save() does not support saving model topology in binary formats yet.");{const n=JSON.stringify(t.modelTopology),r=JSON.stringify(t.weightSpecs),s=Xe(t),o=St.join(t.weightData);try{this.LS.setItem(this.keys.info,JSON.stringify(s)),this.LS.setItem(this.keys.topology,n),this.LS.setItem(this.keys.weightSpecs,r),this.LS.setItem(this.keys.weightData,xh(o));const a={format:t.format,generatedBy:t.generatedBy,convertedBy:t.convertedBy,signature:t.signature!=null?t.signature:void 0,userDefinedMetadata:t.userDefinedMetadata!=null?t.userDefinedMetadata:void 0,modelInitializer:t.modelInitializer!=null?t.modelInitializer:void 0,initializerSignature:t.initializerSignature!=null?t.initializerSignature:void 0,trainingConfig:t.trainingConfig!=null?t.trainingConfig:void 0};return this.LS.setItem(this.keys.modelMetadata,JSON.stringify(a)),{modelArtifactsInfo:s}}catch{throw uc(this.keys),new Error(`Failed to save model '${this.modelPath}' to local storage: size quota being exceeded is a possible cause of this failure: modelTopologyBytes=${s.modelTopologyBytes}, weightSpecsBytes=${s.weightSpecsBytes}, weightDataBytes=${s.weightDataBytes}.`)}}}async load(){const t=JSON.parse(this.LS.getItem(this.keys.info));if(t==null)throw new Error(`In local storage, there is no model with name '${this.modelPath}'`);if(t.modelTopologyType!=="JSON")throw new Error("BrowserLocalStorage does not support loading non-JSON model topology yet.");const n={},r=JSON.parse(this.LS.getItem(this.keys.topology));if(r==null)throw new Error(`In local storage, the topology of model '${this.modelPath}' is missing.`);n.modelTopology=r;const s=JSON.parse(this.LS.getItem(this.keys.weightSpecs));if(s==null)throw new Error(`In local storage, the weight specs of model '${this.modelPath}' are missing.`);n.weightSpecs=s;const o=this.LS.getItem(this.keys.modelMetadata);if(o!=null){const i=JSON.parse(o);n.format=i.format,n.generatedBy=i.generatedBy,n.convertedBy=i.convertedBy,i.signature!=null&&(n.signature=i.signature),i.userDefinedMetadata!=null&&(n.userDefinedMetadata=i.userDefinedMetadata),i.modelInitializer!=null&&(n.modelInitializer=i.modelInitializer),i.initializerSignature!=null&&(n.initializerSignature=i.initializerSignature),i.trainingConfig!=null&&(n.trainingConfig=i.trainingConfig)}const a=this.LS.getItem(this.keys.weightData);if(a==null)throw new Error(`In local storage, the binary weight values of model '${this.modelPath}' are missing.`);return n.weightData=vh(a),n}}re.URL_SCHEME="localstorage://";const lc=e=>L().getBool("IS_BROWSER")&&!Array.isArray(e)&&e.startsWith(re.URL_SCHEME)?Gh(e.slice(re.URL_SCHEME.length)):null;Y.registerSaveRouter(lc);Y.registerLoadRouter(lc);function Gh(e){return new re(e)}class zh{constructor(){p(L().getBool("IS_BROWSER"),()=>"Current environment is not a web browser"),p(typeof window>"u"||typeof window.localStorage<"u",()=>"Current browser does not appear to support localStorage"),this.LS=window.localStorage}async listModels(){const t={},n=le+Dt,r=Dt+ic;for(let s=0;s<this.LS.length;++s){const o=this.LS.key(s);if(o.startsWith(n)&&o.endsWith(r)){const a=qh(o);t[a]=JSON.parse(this.LS.getItem(o))}}return t}async removeModel(t){t=Uh(t);const n=cc(t);if(this.LS.getItem(n.info)==null)throw new Error(`Cannot find model at path '${t}'`);const r=JSON.parse(this.LS.getItem(n.info));return uc(n),r}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const pe="://";class ct{constructor(){this.managers={}}static getInstance(){return ct.instance==null&&(ct.instance=new ct),ct.instance}static registerManager(t,n){p(t!=null,()=>"scheme must not be undefined or null."),t.endsWith(pe)&&(t=t.slice(0,t.indexOf(pe))),p(t.length>0,()=>"scheme must not be an empty string.");const r=ct.getInstance();p(r.managers[t]==null,()=>`A model store manager is already registered for scheme '${t}'.`),r.managers[t]=n}static getManager(t){const n=ct.getInstance().managers[t];if(n==null)throw new Error(`Cannot find model manager for scheme '${t}'`);return n}static getSchemes(){return Object.keys(ct.getInstance().managers)}}function on(e){if(e.indexOf(pe)===-1)throw new Error(`The url string provided does not contain a scheme. Supported schemes are: ${ct.getSchemes().join(",")}`);return{scheme:e.split(pe)[0],path:e.split(pe)[1]}}async function hc(e,t,n=!1){p(e!==t,()=>`Old path and new path are the same: '${e}'`);const r=Y.getLoadHandlers(e);p(r.length>0,()=>`Copying failed because no load handler is found for source URL ${e}.`),p(r.length<2,()=>`Copying failed because more than one (${r.length}) load handlers for source URL ${e}.`);const s=r[0],o=Y.getSaveHandlers(t);p(o.length>0,()=>`Copying failed because no save handler is found for destination URL ${t}.`),p(o.length<2,()=>`Copying failed because more than one (${r.length}) save handlers for destination URL ${t}.`);const a=o[0],i=on(e).scheme,c=on(e).path,u=i===on(e).scheme,h=await s.load();n&&u&&await ct.getManager(i).removeModel(c);const l=await a.save(h);return n&&!u&&await ct.getManager(i).removeModel(c),l.modelArtifactsInfo}async function Kh(){const e=ct.getSchemes(),t={};for(const n of e){const r=await ct.getManager(n).listModels();for(const s in r){const o=n+pe+s;t[o]=r[s]}}return t}async function Vh(e){const t=on(e);return ct.getManager(t.scheme).removeModel(t.path)}async function Hh(e,t){return hc(e,t,!1)}async function jh(e,t){return hc(e,t,!0)}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Xh{constructor(){this.messageName="setTimeoutCustom",this.functionRefs=[],this.handledMessageCount=0,this.hasEventListener=!1}fetch(t,n){return fetch(t,n)}now(){return performance.now()}encode(t,n){if(n!=="utf-8"&&n!=="utf8")throw new Error(`Browser's encoder only supports utf-8, but got ${n}`);return this.textEncoder==null&&(this.textEncoder=new TextEncoder),this.textEncoder.encode(t)}decode(t,n){return new TextDecoder(n).decode(t)}setTimeoutCustom(t,n){if(typeof window>"u"||!L().getBool("USE_SETTIMEOUTCUSTOM")){setTimeout(t,n);return}this.functionRefs.push(t),setTimeout(()=>{window.postMessage({name:this.messageName,index:this.functionRefs.length-1},"*")},n),this.hasEventListener||(this.hasEventListener=!0,window.addEventListener("message",r=>{if(r.source===window&&r.data.name===this.messageName){r.stopPropagation();const s=this.functionRefs[r.data.index];s(),this.handledMessageCount++,this.handledMessageCount===this.functionRefs.length&&(this.functionRefs=[],this.handledMessageCount=0)}},!0))}isTypedArray(t){return Pi(t)}}if(L().get("IS_BROWSER")){L().setPlatform("browser",new Xh);try{ct.registerManager(re.URL_SCHEME,new zh)}catch{}try{ct.registerManager(ne.URL_SCHEME,new Ch)}catch{}}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Zh={importFetch:()=>require("node-fetch")};let Hn;class Yh{constructor(){this.util=require("util"),this.textEncoder=new this.util.TextEncoder}fetch(t,n){return L().global.fetch!=null?L().global.fetch(t,n):(Hn==null&&(Hn=Zh.importFetch()),Hn(t,n))}now(){const t=process.hrtime();return t[0]*1e3+t[1]/1e6}encode(t,n){if(n!=="utf-8"&&n!=="utf8")throw new Error(`Node built-in encoder only supports utf-8, but got ${n}`);return this.textEncoder.encode(t)}decode(t,n){return t.length===0?"":new this.util.TextDecoder(n).decode(t)}isTypedArray(t){return this.util.types.isFloat32Array(t)||this.util.types.isInt32Array(t)||this.util.types.isUint8Array(t)||this.util.types.isUint8ClampedArray(t)}}L().get("IS_NODE")&&!L().get("IS_BROWSER")&&L().setPlatform("node",new Yh);/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Nt(e,t="float32",n){return t=t||"float32",mt(e),new $n(e,t,n)}/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Jh(e,t){const n=d(e,"x","cast");if(!Ls(t))throw new Error(`Failed to cast to unknown dtype ${t}`);if(t==="string"&&n.dtype!=="string"||t!=="string"&&n.dtype==="string")throw new Error("Only strings can be casted to strings");const r={x:n},s={dtype:t};return w.runKernel(Ir,r,s)}const j=b({cast_:Jh});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qh(e){const n={x:d(e,"x","clone","string_or_numeric")};return w.runKernel(Ar,n)}const te=b({clone_:Qh});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function fc(e,t=!1){console.log(e.toString(t))}/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */ji();const tf={buffer:Nt,cast:j,clone:te,print:fc};Ul(tf);/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ef(e,t){let n=d(e,"a","add"),r=d(t,"b","add");[n,r]=J(n,r);const s={a:n,b:r};return w.runKernel(Tr,s)}const P=b({add_:ef});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function nf(e,t){let n=d(e,"a","floorDiv"),r=d(t,"b","floorDiv");[n,r]=J(n,r);const s={a:n,b:r};return w.runKernel(Ho,s)}const dc=b({floorDiv_:nf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function rf(e,t){let n=d(e,"a","div"),r=d(t,"b","div");if([n,r]=J(n,r),n.dtype==="int32"&&r.dtype==="int32")return dc(n,r);const s={a:n,b:r},o={};return w.runKernel(Ro,s,o)}const H=b({div_:rf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function sf(e,t){let n=d(e,"a","mul"),r=d(t,"b","mul");[n,r]=J(n,r);const s={a:n,b:r};return w.runKernel(Sa,s)}const D=b({mul_:sf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function of(e){const t=d(e,"x","abs");if(t.dtype==="complex64"){const n={x:t};return w.runKernel(mo,n)}else{const n={x:t};return w.runKernel(Vs,n)}}const wt=b({abs_:of});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function af(e){const n={x:d(e,"x","acos")};return w.runKernel(Hs,n)}const cf=b({acos_:af});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function uf(e){const n={x:d(e,"x","acosh")};return w.runKernel(js,n)}const lf=b({acosh_:uf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function hf(e){p(Array.isArray(e),()=>"The argument passed to tf.addN() must be a list of tensors"),p(e.length>=1,()=>`Must pass at least one tensor to tf.addN(), but got ${e.length}`);const t=e.map((s,o)=>d(s,`tensors${o}`,"addN")),n=t[0];t.forEach(s=>{if(s.dtype!==n.dtype)throw new Error("All tensors passed to tf.addN() must have the same dtype")}),t.forEach(s=>{if(!Ft(s.shape,n.shape))throw new Error("All tensors passed to tf.addN() must have the same shape")});const r=t;return w.runKernel(Xs,r)}const ff=b({addN_:hf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function df(e,t=null,n=!1){const s={x:d(e,"x","all","bool")},o={axis:t,keepDims:n};return w.runKernel(Zs,s,o)}const pf=b({all_:df});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function gf(e,t=null,n=!1){const s={x:d(e,"x","any","bool")},o={axis:t,keepDims:n};return w.runKernel(Ys,s,o)}const mf=b({any_:gf});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function bf(e,t=0){const r={x:d(e,"x","argMax")},s={axis:t};return w.runKernel(Js,r,s)}const wf=b({argMax_:bf});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function yf(e,t=0){const r={x:d(e,"x","argMin")},s={axis:t};return w.runKernel(Qs,r,s)}const $f=b({argMin_:yf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ef(e){const n={x:d(e,"x","asin")};return w.runKernel(to,n)}const kf=b({asin_:Ef});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function xf(e){const n={x:d(e,"x","asinh")};return w.runKernel(eo,n)}const vf=b({asinh_:xf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Sf(e){const n={x:d(e,"x","atan")};return w.runKernel(no,n)}const Tf=b({atan_:Sf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function If(e,t){let n=d(e,"a","atan2"),r=d(t,"b","atan2");[n,r]=J(n,r);const s={a:n,b:r};return w.runKernel(so,s)}const _f=b({atan2_:If});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Af(e){const n={x:d(e,"x","atanh")};return w.runKernel(ro,n)}const Df=b({atanh_:Af});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Nf(e,t,n,r,s="NHWC",o){const a=e[3],i=[...t,a],c=mc(s);return Ze(e,i,n,o,r,null,null,c)}function pc(e,t,n,r,s,o,a="channelsLast"){const[i,c]=Ce(t);let u;if(a==="channelsLast")u=[i,c,e[3],e[3]];else if(a==="channelsFirst")u=[i,c,e[1],e[1]];else throw new Error(`Unknown dataFormat ${a}`);return Ze(e,u,n,r,s,o,!1,a)}function Mf(e,t,n,r,s,o,a="NDHWC"){const[i,c,u]=dr(t);let h,l;if(a==="NDHWC")l="channelsLast",h=[i,c,u,e[4],e[4]];else if(a==="NCDHW")l="channelsFirst",h=[i,c,u,e[1],e[1]];else throw new Error(`Unknown dataFormat ${a}`);return gc(e,h,n,r,s,!1,l,o)}function Ze(e,t,n,r,s,o,a=!1,i="channelsLast"){let[c,u,h,l]=[-1,-1,-1,-1];if(i==="channelsLast")[c,u,h,l]=e;else if(i==="channelsFirst")[c,l,u,h]=e;else throw new Error(`Unknown dataFormat ${i}`);const[f,g,,y]=t,[$,E]=Ce(n),[v,B]=Ce(r),S=ge(f,v),_=ge(g,B),{padInfo:A,outHeight:N,outWidth:R}=Rf(s,u,h,$,E,S,_,o,i),M=a?y*l:y;let x;return i==="channelsFirst"?x=[c,M,N,R]:i==="channelsLast"&&(x=[c,N,R,M]),{batchSize:c,dataFormat:i,inHeight:u,inWidth:h,inChannels:l,outHeight:N,outWidth:R,outChannels:M,padInfo:A,strideHeight:$,strideWidth:E,filterHeight:f,filterWidth:g,effectiveFilterHeight:S,effectiveFilterWidth:_,dilationHeight:v,dilationWidth:B,inShape:e,outShape:x,filterShape:t}}function gc(e,t,n,r,s,o=!1,a="channelsLast",i){let[c,u,h,l,f]=[-1,-1,-1,-1,-1];if(a==="channelsLast")[c,u,h,l,f]=e;else if(a==="channelsFirst")[c,f,u,h,l]=e;else throw new Error(`Unknown dataFormat ${a}`);const[g,y,$,,E]=t,[v,B,S]=dr(n),[_,A,N]=dr(r),R=ge(g,_),M=ge(y,A),x=ge($,N),{padInfo:k,outDepth:m,outHeight:I,outWidth:F}=Cf(s,u,h,l,v,B,S,R,M,x,i),C=o?E*f:E;let O;return a==="channelsFirst"?O=[c,C,m,I,F]:a==="channelsLast"&&(O=[c,m,I,F,C]),{batchSize:c,dataFormat:a,inDepth:u,inHeight:h,inWidth:l,inChannels:f,outDepth:m,outHeight:I,outWidth:F,outChannels:C,padInfo:k,strideDepth:v,strideHeight:B,strideWidth:S,filterDepth:g,filterHeight:y,filterWidth:$,effectiveFilterDepth:R,effectiveFilterHeight:M,effectiveFilterWidth:x,dilationDepth:_,dilationHeight:A,dilationWidth:N,inShape:e,outShape:O,filterShape:t}}function Ff(e,t,n,r,s){r==null&&(r=Rr(e,t,n));const o=e[0],a=e[1],i=Pe((o-t+2*r)/n+1,s),c=Pe((a-t+2*r)/n+1,s);return[i,c]}function Bf(e,t,n,r,s,o){s==null&&(s=Rr(e,t[0],r[0]));const a=[0,0,0,n];for(let i=0;i<3;i++)e[i]+2*s>=t[i]&&(a[i]=Pe((e[i]-t[i]+2*s)/r[i]+1,o));return a}function Rr(e,t,n,r=1){const s=ge(t,r);return Math.floor((e[0]*(n-1)-n+s)/2)}function Ce(e){return typeof e=="number"?[e,e,e]:e.length===2?[e[0],e[1],1]:e}function dr(e){return typeof e=="number"?[e,e,e]:e}function ge(e,t){return t<=1?e:e+(e-1)*(t-1)}function Rf(e,t,n,r,s,o,a,i,c){let u,h,l;if(typeof e=="number"){u={top:e,bottom:e,left:e,right:e,type:e===0?"VALID":"NUMBER"};const g=Ff([t,n],o,r,e,i);h=g[0],l=g[1]}else if(e==="same"){h=Math.ceil(t/r),l=Math.ceil(n/s);const f=Math.max(0,(h-1)*r+o-t),g=Math.max(0,(l-1)*s+a-n),y=Math.floor(f/2),$=f-y,E=Math.floor(g/2),v=g-E;u={top:y,bottom:$,left:E,right:v,type:"SAME"}}else if(e==="valid")u={top:0,bottom:0,left:0,right:0,type:"VALID"},h=Math.ceil((t-o+1)/r),l=Math.ceil((n-a+1)/s);else if(typeof e=="object"){const f=c==="channelsLast"?e[1][0]:e[2][0],g=c==="channelsLast"?e[1][1]:e[2][1],y=c==="channelsLast"?e[2][0]:e[3][0],$=c==="channelsLast"?e[2][1]:e[3][1];u={top:f,bottom:g,left:y,right:$,type:f===0&&g===0&&y===0&&$===0?"VALID":"EXPLICIT"},h=Pe((t-o+f+g)/r+1,i),l=Pe((n-a+y+$)/s+1,i)}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:u,outHeight:h,outWidth:l}}function Cf(e,t,n,r,s,o,a,i,c,u,h){let l,f,g,y;if(e==="valid"&&(e=0),typeof e=="number"){l={top:e,bottom:e,left:e,right:e,front:e,back:e,type:e===0?"VALID":"NUMBER"};const E=Bf([t,n,r,1],[i,c,u],1,[s,o,a],e,h);f=E[0],g=E[1],y=E[2]}else if(e==="same"){f=Math.ceil(t/s),g=Math.ceil(n/o),y=Math.ceil(r/a);const $=(f-1)*s+i-t,E=(g-1)*o+c-n,v=(y-1)*a+u-r,B=Math.floor($/2),S=$-B,_=Math.floor(E/2),A=E-_,N=Math.floor(v/2),R=v-N;l={top:_,bottom:A,left:N,right:R,front:B,back:S,type:"SAME"}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:l,outDepth:f,outHeight:g,outWidth:y}}function Pe(e,t){if(!t)return Math.trunc(e);switch(t){case"round":return Math.round(e);case"ceil":return Math.ceil(e);case"floor":return Math.floor(e);default:throw new Error(`Unknown roundingMode ${t}`)}}function Oe(e){const[t,n,r]=Ce(e);return t===1&&n===1&&r===1}function Bt(e,t){return Oe(e)||Oe(t)}function se(e){return Ce(e).every(t=>t>0)}function mc(e){if(e==="NHWC")return"channelsLast";if(e==="NCHW")return"channelsFirst";throw new Error(`Unknown dataFormat ${e}`)}function kt(e,t,n){if(n!=null){if(typeof t=="string")throw Error(`Error in ${e}: pad must be an integer when using dimRoundingMode ${n} but got pad ${t}.`);if(typeof t=="number")p(we(t),()=>`Error in ${e}: pad must be an integer when using dimRoundingMode ${n} but got pad ${t}.`);else if(typeof t=="object")t.forEach(r=>{r.forEach(s=>{p(we(s),()=>`Error in ${e}: pad must be an integer when using dimRoundingMode ${n} but got pad ${s}.`)})});else throw Error(`Error in ${e}: Unknown padding parameter: ${t}`)}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Pf(e,t){const r={x:d(e,"x","reshape","string_or_numeric")},s={shape:t};return w.runKernel(Ka,r,s)}const T=b({reshape_:Pf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Of(e,t,n,r,s){const o=d(e,"x","avgPool","float32"),a=1;p(Bt(n,a),()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`);let i=o,c=!1;o.rank===3&&(c=!0,i=T(o,[1,o.shape[0],o.shape[1],o.shape[2]])),p(i.rank===4,()=>`Error in avgPool: x must be rank 4 but got rank ${i.rank}.`),kt("avgPool",r,s);const u={x:i},h={filterSize:t,strides:n,pad:r,dimRoundingMode:s};let l=w.runKernel(oo,u,h);return l=j(l,o.dtype),c?T(l,[l.shape[1],l.shape[2],l.shape[3]]):l}const bc=b({avgPool_:Of});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Lf(e,t,n,r,s,o="NDHWC"){const a=d(e,"x","avgPool3d","float32");let i=a,c=!1;a.rank===4&&(c=!0,i=T(a,[1,a.shape[0],a.shape[1],a.shape[2],a.shape[3]])),p(i.rank===5,()=>`Error in avgPool3d: x must be rank 5 but got rank ${i.rank}.`),p(o==="NDHWC",()=>`Error in avgPool3d: Only NDHWC is currently supported, but got dataFormat of ${o}`),p(typeof n=="number"&&n>0||Array.isArray(n)&&n[0]>0&&n[1]>0&&n[2]>0,()=>`Error in avgPool3d: Stride must be > 0, but got '${n}'`),kt("avgPool3d",r,s);const u={x:i},h={filterSize:t,strides:n,pad:r,dimRoundingMode:s,dataFormat:o};let l=w.runKernel(ao,u,h);return l=j(l,i.dtype),c?T(l,[l.shape[1],l.shape[2],l.shape[3],l.shape[4]]):l}const Wf=b({avgPool3d_:Lf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function qf(e,t=0){p(e.length>=1,()=>"Pass at least one tensor to concat");const n=Re(e,"tensors","concat","string_or_numeric");if(n[0].dtype==="complex64"&&n.forEach(o=>{if(o.dtype!=="complex64")throw new Error(`Cannot concatenate complex64 tensors with a tensor
          with dtype ${o.dtype}. `)}),n.length===1)return te(n[0]);const r=n,s={axis:t};return w.runKernel(bo,r,s)}const gt=b({concat_:qf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Uf(e,t,n=!1,r=!1){let s=d(e,"a","matMul"),o=d(t,"b","matMul");[s,o]=J(s,o);const a={a:s,b:o},i={transposeA:n,transposeB:r};return w.runKernel(io,a,i)}const U=b({matMul_:Uf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gf(e){const n={x:d(e,"x","sigmoid","float32")};return w.runKernel(ii,n)}const me=b({sigmoid_:Gf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function zf(e,t,n){const r=d(e,"x","slice","string_or_numeric");if(r.rank===0)throw new Error("Slicing scalar is not possible");const s={x:r},o={begin:t,size:n};return w.runKernel(ri,s,o)}const X=b({slice_:zf});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Kf(e){const n={x:d(e,"x","tanh","float32")};return w.runKernel(Ii,n)}const pr=b({tanh_:Kf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Vf(e,t,n,r,s,o){const a=d(e,"forgetBias","basicLSTMCell"),i=d(t,"lstmKernel","basicLSTMCell"),c=d(n,"lstmBias","basicLSTMCell"),u=d(r,"data","basicLSTMCell"),h=d(s,"c","basicLSTMCell"),l=d(o,"h","basicLSTMCell"),f=gt([u,l],1),g=U(f,i),y=P(g,c),$=y.shape[0],E=y.shape[1]/4,v=[$,E],B=X(y,[0,0],v),S=X(y,[0,E],v),_=X(y,[0,E*2],v),A=X(y,[0,E*3],v),N=P(D(me(B),pr(S)),D(h,me(P(a,_)))),R=D(pr(N),me(A));return[N,R]}const Hf=b({basicLSTMCell_:Vf});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function jf(e,t,n){const r=d(e,"x","batchToSpaceND"),s=t.reduce((i,c)=>i*c);p(r.rank>=1+t.length,()=>`input rank is ${r.rank} but should be > than blockShape.length ${t.length}`),p(n.length===t.length,()=>`crops.length is ${n.length} but should be equal to blockShape.length  ${t.length}`),p(r.shape[0]%s===0,()=>`input tensor batch is ${r.shape[0]} but is not divisible by the product of the elements of blockShape ${t.join(" * ")} === ${s}`);const o={x:r},a={blockShape:t,crops:n};return w.runKernel(co,o,a)}const wc=b({batchToSpaceND_:jf});function Xf(e){let t;return e.rank===0||e.rank===1?t=T(e,[1,1,1,e.size]):e.rank===2?t=T(e,[1,1,e.shape[0],e.shape[1]]):e.rank===3?t=T(e,[1,e.shape[0],e.shape[1],e.shape[2]]):t=e,t}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Zf(e,t,n,r,s,o){o==null&&(o=.001);const a=d(e,"x","batchNorm"),i=d(t,"mean","batchNorm"),c=d(n,"variance","batchNorm");let u;s!=null&&(u=d(s,"scale","batchNorm"));let h;r!=null&&(h=d(r,"offset","batchNorm")),p(i.rank===c.rank,()=>"Batch normalization gradient requires mean and variance to have equal ranks."),p(h==null||i.rank===h.rank,()=>"Batch normalization gradient requires mean and offset to have equal ranks."),p(u==null||i.rank===u.rank,()=>"Batch normalization gradient requires mean and scale to have equal ranks.");const f={x:Xf(a),scale:u,offset:h,mean:i,variance:c},g={varianceEpsilon:o},y=w.runKernel(jo,f,g);return T(y,a.shape)}const Dn=b({batchNorm_:Zf});function Yf(e,t,n,r,s,o){const a=d(e,"x","batchNorm"),i=d(t,"mean","batchNorm"),c=d(n,"variance","batchNorm");let u;s!=null&&(u=d(s,"scale","batchNorm"));let h;return r!=null&&(h=d(r,"offset","batchNorm")),p(a.rank===2,()=>`Error in batchNorm2D: x must be rank 2 but got rank ${a.rank}.`),p(i.rank===2||i.rank===1,()=>`Error in batchNorm2D: mean must be rank 2 or rank 1 but got rank ${i.rank}.`),p(c.rank===2||c.rank===1,()=>`Error in batchNorm2D: variance must be rank 2 or rank 1 but got rank ${c.rank}.`),u!=null&&p(u.rank===2||u.rank===1,()=>`Error in batchNorm2D: scale must be rank 2 or rank 1 but got rank ${u.rank}.`),h!=null&&p(h.rank===2||h.rank===1,()=>`Error in batchNorm2D: offset must be rank 2 or rank 1 but got rank ${h.rank}.`),Dn(a,i,c,h,u,o)}const Jf=b({batchNorm2d_:Yf});function Qf(e,t,n,r,s,o){const a=d(e,"x","batchNorm"),i=d(t,"mean","batchNorm"),c=d(n,"variance","batchNorm");let u;s!=null&&(u=d(s,"scale","batchNorm"));let h;return r!=null&&(h=d(r,"offset","batchNorm")),p(a.rank===3,()=>`Error in batchNorm3D: x must be rank 3 but got rank ${a.rank}.`),p(i.rank===3||i.rank===1,()=>`Error in batchNorm3D: mean must be rank 3 or rank 1 but got rank ${i.rank}.`),p(c.rank===3||c.rank===1,()=>`Error in batchNorm3D: variance must be rank 3 or rank 1 but got rank ${c.rank}.`),u!=null&&p(u.rank===3||u.rank===1,()=>`Error in batchNorm3D: scale must be rank 3 or rank 1 but got rank ${u.rank}.`),h!=null&&p(h.rank===3||h.rank===1,()=>`Error in batchNorm3D: offset must be rank 3 or rank 1 but got rank ${h.rank}.`),Dn(a,i,c,h,u,o)}const td=b({batchNorm3d_:Qf});function ed(e,t,n,r,s,o){const a=d(e,"x","batchNorm"),i=d(t,"mean","batchNorm"),c=d(n,"variance","batchNorm");let u;s!=null&&(u=d(s,"scale","batchNorm"));let h;return r!=null&&(h=d(r,"offset","batchNorm")),p(a.rank===4,()=>`Error in batchNorm4D: x must be rank 4 but got rank ${a.rank}.`),p(i.rank===4||i.rank===1,()=>`Error in batchNorm4D: mean must be rank 4 or rank 1 but got rank ${i.rank}.`),p(c.rank===4||c.rank===1,()=>`Error in batchNorm4D: variance must be rank 4 or rank 1 but got rank ${c.rank}.`),u!=null&&p(u.rank===4||u.rank===1,()=>`Error in batchNorm4D: scale must be rank 4 or rank 1 but got rank ${u.rank}.`),h!=null&&p(h.rank===4||h.rank===1,()=>`Error in batchNorm4D: offset must be rank 4 or rank 1 but got rank ${h.rank}.`),Dn(a,i,c,h,u,o)}const nd=b({batchNorm4d_:ed});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function rd(e,t,n){const r=d(e,"x","bincount"),s=d(t,"weights","bincount");p(r.dtype==="int32",()=>`Error in bincount: input dtype must be int32, but got ${r.dtype}`),p(n>=0,()=>`size must be non-negative, but got ${n}.`),p(s.size===r.size||s.size===0,()=>`Error in bincount: weights must have the same size as input or0-length, but got input shape: ${r.shape}, weights shape: ${s.shape}.`);const o={x:r,weights:s},a={size:n};return w.runKernel(uo,o,a)}const yc=b({bincount_:rd});/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function sd(e,t){const n=d(e,"x","bitwiseAnd"),r=d(t,"y","bitwiseAnd");if(!Ft(n.shape,r.shape))throw new Error(`BitwiseAnd: Tensors must have the same shape. x: ${n.shape}, y: ${r.shape}`);if(n.dtype!=="int32"||r.dtype!=="int32")throw new Error(`BitwiseAnd: Only supports 'int32' values in tensor, found type of x: ${n.dtype} and type of y: ${r.dtype}`);const s={a:n,b:r};return w.runKernel(lo,s)}const od=b({bitwiseAnd_:sd});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ad(e,t){const n=d(e,"s0","broadcastArgs","int32"),r=d(t,"s1","broadcastArgs","int32");if(n.rank!==1)throw new Error(`broadcastArgs(): first input must be a vector (rank=1). Has rank ${n.rank}`);if(r.rank!==1)throw new Error(`broadcastArgs(): second input must be a vector (rank=1). Has rank ${r.rank}`);const s={s0:n,s1:r};return w.runKernel(ho,s)}const id=b({broadcastArgs_:ad});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function cd(e,t){let n=d(e,"broadcastTo","x");const r=n.shape;if(mt(t),t.length<n.rank)throw new Error(`broadcastTo(): shape.length=${t.length} < input.rank=${n.rank}.`);if(t.length>n.rank){const u=n.shape.slice();for(;u.length<t.length;)u.unshift(1);n=T(n,u)}const s=n.shape,o=Array.from(t);for(let u=t.length-1;u>=0;u--)if(s[u]===t[u])o[u]=1;else if(n.shape[u]!==1)throw new Error(`broadcastTo(): [${r}] cannot be broadcast to [${t}].`);if(o.map((u,h)=>u>1?h:-1).filter(u=>u>=0).length===0)return te(n);const i={x:n},c={reps:o};return w.runKernel(Dr,i,c)}const an=b({broadcastTo_:cd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ud(e){const n={x:d(e,"x","ceil","float32")};return w.runKernel(fo,n)}const ld=b({ceil_:ud});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ye(e,t,n){mt(e),n=n||Ve(t);const r={shape:e,value:t,dtype:n};return w.runKernel(zo,{},r)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function hd(e,t,n){const r=d(e,"x","clipByValue");if(p(t<=n,()=>`Error in clip: min (${t}) must be less than or equal to max (${n}).`),t===n)return Ye(r.shape,t,r.dtype);const s={x:r},o={clipValueMin:t,clipValueMax:n};return w.runKernel(po,s,o)}const fd=b({clipByValue_:hd});function dd(e){return gt(e,0)}const pd=b({concat1d_:dd});function gd(e,t){return gt(e,t)}const md=b({concat2d_:gd});function bd(e,t){return gt(e,t)}const wd=b({concat3d_:bd});function yd(e,t){return gt(e,t)}const $d=b({concat4d_:yd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ed(e,t,n,r,s="NHWC",o=[1,1],a){const i=d(e,"x","conv2d","float32"),c=d(t,"filter","conv2d","float32");let u=i,h=!1;i.rank===3&&(h=!0,u=T(i,[1,i.shape[0],i.shape[1],i.shape[2]])),p(u.rank===4,()=>`Error in conv2d: input must be rank 4, but got rank ${u.rank}.`),p(c.rank===4,()=>`Error in conv2d: filter must be rank 4, but got rank ${c.rank}.`),kt("conv2d",r,a);const l=s==="NHWC"?u.shape[3]:u.shape[1];p(l===c.shape[2],()=>`Error in conv2d: depth of input (${l}) must match input depth for filter ${c.shape[2]}.`),p(Bt(n,o),()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${n} and dilations '${o}'`),p(se(o),()=>"Error in conv2D: Dilated rates should be larger than 0."),p(se(n),()=>"Error in conv2D: Strides should be larger than 0.");const f={x:u,filter:c},g={strides:n,pad:r,dataFormat:s,dilations:o,dimRoundingMode:a},y=w.runKernel(wo,f,g);return h?T(y,[y.shape[1],y.shape[2],y.shape[3]]):y}const Nn=b({conv2d_:Ed});function kd(e,t,n,r,s="NWC",o=1,a){const i=d(e,"x","conv1d"),c=d(t,"filter","conv1d");let u=i,h=!1;i.rank===2&&(h=!0,u=T(i,[1,i.shape[0],i.shape[1]])),p(u.rank===3,()=>`Error in conv1d: input must be rank 3, but got rank ${u.rank}.`),p(c.rank===3,()=>`Error in conv1d: filter must be rank 3, but got rank ${c.rank}.`),kt("conv1d",r,a),p(u.shape[2]===c.shape[1],()=>`Error in conv1d: depth of input (${u.shape[2]}) must match input depth for filter ${c.shape[1]}.`),p(Bt(n,o),()=>`Error in conv1D: Either stride or dilation must be 1. Got stride ${n} and dilation '${o}'`),p(se(o),()=>"Error in conv1D: Dilated rates should be larger than 0."),p(se(n),()=>"Error in conv1D: Stride should be larger than 0."),p(s==="NWC",()=>`Error in conv1d: got dataFormat of ${s} but only NWC is currently supported.`);const l=T(c,[1,c.shape[0],c.shape[1],c.shape[2]]),f=T(u,[u.shape[0],1,u.shape[1],u.shape[2]]),E=Nn(f,l,[1,n],r,"NHWC",[1,o],a);return h?T(E,[E.shape[2],E.shape[3]]):T(E,[E.shape[0],E.shape[2],E.shape[3]])}const xd=b({conv1d_:kd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function vd(e,t,n,r,s,o="NHWC",a){p(e.length===t.rank,()=>`Length of inShape (${e.length}) and rank of dy (${t.rank}) must match`);let i=e,c=t,u=!1;t.rank===3&&(u=!0,c=T(t,[1,t.shape[0],t.shape[1],t.shape[2]]),i=[1,e[0],e[1],e[2]]),p(i.length===4,()=>`Error in conv2dDerInput: inShape must be length 4, but got length ${i.length}.`),p(c.rank===4,()=>`Error in conv2dDerInput: dy must be rank 4, but got rank ${c.rank}`),p(n.rank===4,()=>`Error in conv2dDerInput: filter must be rank 4, but got rank ${n.rank}`);const h=o==="NHWC"?i[3]:i[1],l=o==="NHWC"?c.shape[3]:c.shape[1];p(h===n.shape[2],()=>`Error in conv2dDerInput: depth of input (${h}) must match input depth for filter ${n.shape[2]}.`),p(l===n.shape[3],()=>`Error in conv2dDerInput: depth of output (${l}) must match output depth for filter ${n.shape[3]}.`),kt("conv2dDerInput",s,a);const f={dy:c,filter:n},g={strides:r,pad:s,dataFormat:o,dimRoundingMode:a,inputShape:i},y=w.runKernel($o,f,g);return u?T(y,[y.shape[1],y.shape[2],y.shape[3]]):y}const $c=b({conv2DBackpropInput_:vd});function Sd(e,t,n,r,s,o){const a=d(e,"x","conv2dTranspose"),i=d(t,"filter","conv2dTranspose");return $c(n,a,i,r,s,"NHWC",o)}const Td=b({conv2dTranspose_:Sd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Id(e,t,n,r,s="NDHWC",o=[1,1,1]){const a=d(e,"x","conv3d"),i=d(t,"filter","conv3d");let c=a,u=!1;a.rank===4&&(u=!0,c=T(a,[1,a.shape[0],a.shape[1],a.shape[2],a.shape[3]])),p(c.rank===5,()=>`Error in conv3d: input must be rank 5, but got rank ${c.rank}.`),p(i.rank===5,()=>`Error in conv3d: filter must be rank 5, but got rank ${i.rank}.`),p(c.shape[4]===i.shape[3],()=>`Error in conv3d: depth of input (${c.shape[4]}) must match input depth for filter ${i.shape[3]}.`),p(Bt(n,o),()=>`Error in conv3D: Either strides or dilations must be 1. Got strides ${n} and dilations '${o}'`),p(s==="NDHWC",()=>`Error in conv3d: got dataFormat of ${s} but only NDHWC is currently supported.`),p(se(o),()=>"Error in conv3D: Dilated rates should be larger than 0."),p(se(n),()=>"Error in conv3D: Strides should be larger than 0.");const h={x:c,filter:i},l={strides:n,pad:r,dataFormat:s,dilations:o},f=w.runKernel(Eo,h,l);return u?T(f,[f.shape[1],f.shape[2],f.shape[3],f.shape[4]]):f}const _d=b({conv3d_:Id});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ad(e,t,n,r,s){p(e.length===t.rank,()=>`Length of inShape (${e.length}) and rank of dy (${t.rank}) must match`);let o=e,a=t,i=!1;t.rank===4&&(i=!0,a=T(t,[1,t.shape[0],t.shape[1],t.shape[2],t.shape[3]]),o=[1,e[0],e[1],e[2],e[3]]);const c=o[4],u=a.shape[4];p(o.length===5,()=>`Error in conv3dDerInput: inShape must be length 5, but got length ${o.length}.`),p(a.rank===5,()=>`Error in conv3dDerInput: dy must be rank 5, but got rank ${a.rank}`),p(n.rank===5,()=>`Error in conv3dDerInput: filter must be rank 5, but got rank ${n.rank}`),p(c===n.shape[3],()=>`Error in conv3dDerInput: depth of input (${c}) must match input depth for filter ${n.shape[3]}.`),p(u===n.shape[4],()=>`Error in conv3dDerInput: depth of output (${u}) must match output depth for filter ${n.shape[4]}.`);const h={dy:a,filter:n},l={pad:s,strides:r,inputShape:o},f=w.runKernel(ko,h,l);return i?T(f,[f.shape[1],f.shape[2],f.shape[3],f.shape[4]]):f}const Dd=b({conv3DBackpropInput_:Ad});function Nd(e,t,n,r,s){const o=d(e,"x","conv3dTranspose"),a=d(t,"filter","conv3dTranspose");return Dd(n,o,a,r,s)}const Md=b({conv3dTranspose_:Nd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Fd(e){const n={x:d(e,"x","cos","float32")};return w.runKernel(xo,n)}const Bd=b({cos_:Fd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Rd(e){const n={x:d(e,"x","cosh","float32")};return w.runKernel(vo,n)}const Cd=b({cosh_:Rd});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Pd(e,t=0,n=!1,r=!1){const o={x:d(e,"x","cumprod")},a={axis:t,exclusive:n,reverse:r};return w.runKernel(So,o,a)}const Od=b({cumprod_:Pd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ld(e,t=0,n=!1,r=!1){const o={x:d(e,"x","cumsum")},a={axis:t,exclusive:n,reverse:r};return w.runKernel(To,o,a)}const Wd=b({cumsum_:Ld});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function qd(e,t,n,r=!1){const s=d(e,"x","denseBincount"),o=d(t,"weights","denseBincount");p(s.dtype==="int32",()=>`Error in denseBincount: input dtype must be int32, but got ${s.dtype}`),p(s.rank<=2,()=>`Error in denseBincount: input must be at most rank 2, but got rank ${s.rank}.`),p(n>=0,()=>`size must be non-negative, but got ${n}.`),p(o.size===s.size||o.size===0,()=>`Error in denseBincount: weights must have the same shape as x or 0-length, but got x shape: ${s.shape}, weights shape: ${o.shape}.`);const a={x:s,weights:o},i={size:n,binaryOutput:r};return w.runKernel(_o,a,i)}const Ud=b({denseBincount_:qd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gd(e,t,n="NHWC"){const r=d(e,"x","depthToSpace","float32"),s=n==="NHWC"?r.shape[1]:r.shape[2],o=n==="NHWC"?r.shape[2]:r.shape[3],a=n==="NHWC"?r.shape[3]:r.shape[1];p(t>1,()=>`blockSize should be > 1 for depthToSpace, but was: ${t}`),p(s*t>=0,()=>`Negative dimension size caused by overflow when multiplying
    ${s} and ${t}  for depthToSpace with input shape
    ${r.shape}`),p(o*t>=0,()=>`Negative dimension size caused by overflow when multiplying
    ${o} and ${t} for depthToSpace with input shape
        ${r.shape}`),p(a%(t*t)===0,()=>`Dimension size must be evenly divisible by ${t*t} but is ${a} for depthToSpace with input shape ${r.shape}`);const i={x:r},c={blockSize:t,dataFormat:n};return w.runKernel(Ao,i,c)}const zd=b({depthToSpace_:Gd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Kd(e,t,n,r,s="NHWC",o=[1,1],a){const i=d(e,"x","depthwiseConv2d","float32"),c=d(t,"filter","depthwiseConv2d","float32");let u=i,h=!1;i.rank===3&&(h=!0,u=T(i,[1,i.shape[0],i.shape[1],i.shape[2]])),p(u.rank===4,()=>`Error in depthwiseConv2d: input must be rank 4, but got rank ${u.rank}.`),p(c.rank===4,()=>`Error in depthwiseConv2d: filter must be rank 4, but got rank ${c.rank}.`);const l=s==="NHWC"?u.shape[3]:u.shape[1];p(l===c.shape[2],()=>`Error in depthwiseConv2d: number of input channels (${l}) must match the inChannels dimension in filter ${c.shape[2]}.`),kt("depthwiseConv2d",r,a);const f={x:u,filter:c},g={strides:n,pad:r,dataFormat:s,dilations:o,dimRoundingMode:a},y=w.runKernel(Do,f,g);return h?T(y,[y.shape[1],y.shape[2],y.shape[3]]):y}const Cr=b({depthwiseConv2d_:Kd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Vd(e){const n={x:d(e,"x","diag")};return w.runKernel(Fo,n)}const Hd=b({diag_:Vd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function jd(e,t,n,r,s=[1,1],o="NHWC"){const a=d(e,"x","dilation2d"),i=d(t,"filter","dilation2d");p(a.rank===3||a.rank===4,()=>`Error in dilation2d: input must be rank 3 or 4, but got rank ${a.rank}.`),p(i.rank===3,()=>`Error in dilation2d: filter must be rank 3, but got rank ${i.rank}.`),p(o==="NHWC",()=>`Error in dilation2d: Only NHWC is currently supported, but got dataFormat of ${o}`);let c=a,u=!1;a.rank===3&&(c=T(a,[1,a.shape[0],a.shape[1],a.shape[2]]),u=!0),p(c.shape[3]===i.shape[2],()=>`Error in dilation2d:  input and filter must have the same depth: ${c.shape[3]} vs ${i.shape[2]}`);const h={x:c,filter:i},l={strides:n,pad:r,dilations:s},f=w.runKernel(Bo,h,l);return u?T(f,[f.shape[1],f.shape[2],f.shape[3]]):f}const Xd=b({dilation2d_:jd});/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ec(e,t){const n=e.length,r=[];for(let s=0;s<n;s++){const o=n-1-s,a=e[o]||1;(t[t.length-1-s]||1)>1&&a===1&&r.unshift(o)}return r}function Pr(e,t){const n=[];for(let r=0;r<t.length;r++){const s=e[e.length-r-1],o=t.length-r-1,a=t[o];(s==null||s===1&&a>1)&&n.unshift(o)}return n}function rt(e,t){const n=Math.max(e.length,t.length),r=new Array(n);for(let s=0;s<n;s++){let o=e[e.length-s-1];o==null&&(o=1);let a=t[t.length-s-1];if(a==null&&(a=1),o===1)r[n-s-1]=a;else if(a===1)r[n-s-1]=o;else if(o!==a){const i=`Operands could not be broadcast together with shapes ${e} and ${t}.`;throw Error(i)}else r[n-s-1]=o}return r}const Zd=Object.freeze(Object.defineProperty({__proto__:null,assertAndGetBroadcastShape:rt,getBroadcastDims:Ec,getReductionAxes:Pr},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Yd(e,t){let n=d(e,"a","equal","string_or_numeric"),r=d(t,"b","equal","string_or_numeric");[n,r]=J(n,r),rt(n.shape,r.shape);const s={a:n,b:r};return w.runKernel(Lo,s)}const kc=b({equal_:Yd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Jd(e,t,n){const r=d(t,"a","where"),s=d(n,"b","where"),o=d(e,"condition","where","bool"),a=rt(rt(o.shape,r.shape),s.shape),i=an(o,a),c=an(r,a),u=an(s,a),h={condition:i,t:c,e:u};return w.runKernel(ei,h)}const Ut=b({where_:Jd});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qd(e){const n={x:d(e,"x","zerosLike")};return w.runKernel(Fi,n)}const yt=b({zerosLike_:Qd});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function tp(e,t){let n=d(e,"a","div"),r=d(t,"b","div");[n,r]=J(n,r);const s=H(n,r),o=yt(s),a=kc(r,o);return Ut(a,o,s)}const ep=b({divNoNan_:tp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function np(e,t){const n=d(e,"t1","dot"),r=d(t,"t2","dot");p((n.rank===1||n.rank===2)&&(r.rank===1||r.rank===2),()=>`Error in dot: inputs must all be rank 1 or 2, but got ranks ${n.rank} and ${r.rank}.`);const s=n.rank===1?n.size:n.shape[1],o=r.rank===1?r.size:r.shape[0];if(p(s===o,()=>`Error in dot: inner dimensions of inputs must match, but got ${s} and ${o}.`),n.rank===1&&r.rank===1){const a=T(n,[1,-1]),i=T(r,[-1,1]),c=U(a,i);return T(c,[])}else if(n.rank===1&&r.rank===2){const a=T(n,[1,-1]),i=T(r,[r.shape[0],r.shape[1]]),c=U(a,i);return T(c,[c.size])}else if(n.rank===2&&r.rank===1){const a=T(r,[-1,1]),i=U(n,a);return T(i,[i.size])}else{const a=T(r,[r.shape[0],r.shape[1]]);return U(n,a)}}const rp=b({dot_:np});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function sp(e,...t){const n=t.map((s,o)=>d(s,`tensors${o}`,"einsum")),r={equation:e};return w.runKernel(Co,n,r)}const he=b({einsum_:sp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function op(e){const n={x:d(e,"x","elu","float32")};return w.runKernel(Po,n)}const xc=b({elu_:op});/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ap(e,t){const n=d(e,"x","ensureShape","string_or_numeric");if(!Rs(n.shape,t))throw new Error(`EnsureShape: Shape of tensor ${n.shape} is not compatible with expected shape ${t}`);return e}const ip=b({ensureShape_:ap});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function cp(e){let t=d(e,"x","erf");p(t.dtype==="int32"||t.dtype==="float32",()=>"Input dtype must be `int32` or `float32`."),t.dtype==="int32"&&(t=j(t,"float32"));const n={x:t};return w.runKernel(Oo,n)}const up=b({erf_:cp});/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Or(e,t){for(let n=0;n<e.length;++n)if(e[e.length-n-1]!==t-1-n)return!1;return!0}function vc(e,t,n){const r=e.length+t.length,s=[];let o=0,a=0;for(let i=0;i<r;i++)n.indexOf(i)===-1?s.push(e[o++]):s.push(t[a++]);return s}function lp(e,t){const n=[],r=e.length;for(let o=0;o<r;o++)t.indexOf(o)===-1&&n.push(e[o]);const s=t.map(o=>e[o]);return[n,s]}function Je(e,t){const n=t.map(r=>1);return vc(e,n,t)}function hp(e,t,n){p(Or(t,n),()=>`${e} supports only inner-most axes for now. Got axes ${t} and rank-${n} input.`)}function fp(e,t){if(Or(e,t))return null;const n=[];for(let r=0;r<t;++r)e.indexOf(r)===-1&&n.push(r);return e.forEach(r=>n.push(r)),n}function dp(e){return e.map((t,n)=>[n,t]).sort((t,n)=>t[1]-n[1]).map(t=>t[0])}function pp(e,t){const n=[];for(let r=t-e;r<t;++r)n.push(r);return n}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function gp(e,t=null,n=!1){const s={x:d(e,"x","max")},o={reductionIndices:t,keepDims:n};return w.runKernel(pa,s,o)}const be=b({max_:gp});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function mp(e,t=null,n=!1){const s={x:d(e,"x","min")},o={axis:t,keepDims:n};return w.runKernel($a,s,o)}const gr=b({min_:mp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function bp(e,t){let n=d(e,"base","pow"),r=d(t,"exp","pow");[n,r]=J(n,r);const s={a:n,b:r};return w.runKernel(Ra,s)}const Le=b({pow_:bp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function z(e,t){if((at(e)&&t!=="string"||Array.isArray(e))&&t!=="complex64")throw new Error("Error creating a new Scalar: value must be a primitive (number|boolean|string)");if(t==="string"&&at(e)&&!(e instanceof Uint8Array))throw new Error("When making a scalar from encoded string, the value must be `Uint8Array`.");return Ht(e,[],[],t)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function wp(e){const n={x:d(e,"x","sqrt","float32")};return w.runKernel(ui,n)}const Mt=b({sqrt_:wp});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function yp(e){const t=d(e,"x","square"),n={};return w.runKernel("Square",{x:t},n)}const vt=b({square_:yp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $p(e,t=null,n=!1){let r=d(e,"x","sum");r.dtype==="bool"&&(r=j(r,"int32"));const s={x:r},o={axis:t,keepDims:n};return w.runKernel(li,s,o)}const V=b({sum_:$p});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ep(e,t="euclidean",n=null,r=!1){e=d(e,"x","norm");const s=Sc(e,t,n);let o=s.shape;if(r){const a=Ke(n,e.shape);o=Je(s.shape,a)}return T(s,o)}function Sc(e,t,n=null){if(e.rank===0)return wt(e);if(e.rank!==1&&n===null)return Sc(T(e,[-1]),t,n);if(e.rank===1||typeof n=="number"||Array.isArray(n)&&n.length===1){if(t===1)return V(wt(e),n);if(t===1/0)return be(wt(e),n);if(t===-1/0)return gr(wt(e),n);if(t==="euclidean"||t===2)return Mt(V(Le(wt(e),z(2,"int32")),n));throw new Error(`Error in norm: invalid ord value: ${t}`)}if(Array.isArray(n)&&n.length===2){if(t===1)return be(V(wt(e),n[0]),n[1]-1);if(t===1/0)return be(V(wt(e),n[1]),n[0]);if(t===-1/0)return gr(V(wt(e),n[1]),n[0]);if(t==="fro"||t==="euclidean")return Mt(V(vt(e),n));throw new Error(`Error in norm: invalid ord value: ${t}`)}throw new Error(`Error in norm: invalid axis: ${n}`)}const Mn=b({norm_:Ep});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function kp(e,t=null,n=!1){return Mn(e,"euclidean",t,n)}const xp=b({euclideanNorm_:kp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function vp(e){const n={x:d(e,"x","exp")};return w.runKernel(Wo,n)}const oe=b({exp_:vp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Sp(e,t=0){const n=d(e,"x","expandDims","string_or_numeric");p(t<=n.rank,()=>"Axis must be <= rank of the tensor");const r={input:n},s={dim:t};return w.runKernel(qo,r,s)}const Ct=b({expandDims_:Sp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Tp(e){const n={x:d(e,"x","expm1")};return w.runKernel(Uo,n)}const Ip=b({expm1_:Tp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function _p(e,t){const n=d(e,"x","tile","string_or_numeric");p(n.rank===t.length,()=>`Error in transpose: rank of input ${n.rank} must match length of reps ${t}.`);const r={x:n},s={reps:t};return w.runKernel(Dr,r,s)}const _e=b({tile_:_p});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ap(e,t,n,r="float32"){t==null&&(t=e);const s=Nt([e,t],r),o=e<=t?e:t;for(let i=0;i<o;++i)s.set(1,i,i);const a=T(s.toTensor(),[e,t]);if(n==null)return a;if(n.length===1)return _e(Ct(a,0),[n[0],1,1]);if(n.length===2)return _e(Ct(Ct(a,0),0),[n[0],n[1],1,1]);if(n.length===3)return _e(Ct(Ct(Ct(a,0),0),0),[n[0],n[1],n[2],1,1]);throw new Error(`eye() currently supports only 1D and 2D batchShapes, but received ${n.length}D.`)}const Tc=b({eye_:Ap});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Dp(e){const n={x:d(e,"x","floor","float32")};return w.runKernel(Vo,n)}const Ic=b({floor_:Dp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Np(e,t,n=0,r=0){const s=d(e,"x","gather"),o=d(t,"indices","gather","int32"),a={x:s,indices:o},i={axis:n,batchDims:r};return w.runKernel(Xo,a,i)}const _c=b({gather_:Np});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Mp(e,t){let n=d(e,"a","greater","string_or_numeric"),r=d(t,"b","greater","string_or_numeric");[n,r]=J(n,r),rt(n.shape,r.shape);const s={a:n,b:r};return w.runKernel(Yo,s)}const Fn=b({greater_:Mp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Fp(e,t){let n=d(e,"a","greaterEqual","string_or_numeric"),r=d(t,"b","greaterEqual","string_or_numeric");[n,r]=J(n,r),rt(n.shape,r.shape);const s={a:n,b:r};return w.runKernel(Jo,s)}const Ac=b({greaterEqual_:Fp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Bp(e){const n={input:d(e,"input","imag")};return w.runKernel(ta,n)}const Bn=b({imag_:Bp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Rp(e){const n={x:d(e,"x","isFinite")};return w.runKernel(ea,n)}const Cp=b({isFinite_:Rp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Pp(e){const n={x:d(e,"x","isInf")};return w.runKernel(na,n)}const Op=b({isInf_:Pp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Lp(e){const n={x:d(e,"x","isNaN")};return w.runKernel(ra,n)}const Wp=b({isNaN_:Lp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function qp(e,t=.2){const r={x:d(e,"x","leakyRelu")},s={alpha:t};return w.runKernel(sa,r,s)}const Dc=b({leakyRelu_:qp});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Up(e,t){let n=d(e,"a","less","string_or_numeric"),r=d(t,"b","less","string_or_numeric");[n,r]=J(n,r),rt(n.shape,r.shape);const s={a:n,b:r};return w.runKernel(oa,s)}const mr=b({less_:Up});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gp(e,t){let n=d(e,"a","lessEqual","string_or_numeric"),r=d(t,"b","lessEqual","string_or_numeric");[n,r]=J(n,r),rt(n.shape,r.shape);const s={a:n,b:r};return w.runKernel(aa,s)}const Lr=b({lessEqual_:Gp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function zp(e,t,n){if(n<=0)throw new Error("The number of values should be positive.");const r={start:e,stop:t,num:n};return w.runKernel(ia,{},r)}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Kp(e,t=5,n=1,r=1,s=.5){const o=d(e,"x","localResponseNormalization");p(o.rank===4||o.rank===3,()=>`Error in localResponseNormalization: x must be rank 3 or 4 but got
               rank ${o.rank}.`),p(we(t),()=>`Error in localResponseNormalization: depthRadius must be an integer but got depthRadius ${t}.`);let a=o,i=!1;o.rank===3&&(i=!0,a=T(o,[1,o.shape[0],o.shape[1],o.shape[2]]));const c={x:a},u={depthRadius:t,bias:n,alpha:r,beta:s},h=w.runKernel(da,c,u);return i?T(h,[h.shape[1],h.shape[2],h.shape[3]]):h}const Vp=b({localResponseNormalization_:Kp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Hp(e){const n={x:d(e,"x","log","float32")};return w.runKernel(ca,n)}const We=b({log_:Hp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function jp(e){const n={x:d(e,"x","log1p")};return w.runKernel(ua,n)}const Nc=b({log1p_:jp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Xp(e){return p(Gt(e),()=>"The f passed in grad(f) must be a function"),(t,n)=>{const r=d(t,"x","tf.grad","string_or_numeric"),s=n!=null?d(n,"dy","tf.grad"):null;return w.tidy(()=>{const{value:o,grads:a}=w.gradients(()=>e(r),[r],s);return s!=null&&ht(o.shape,s.shape,"The shape of dy passed in grad(f)(x, dy) must match the shape returned by f(x)"),Rn(a),a[0]})}}function Zp(e){return p(Gt(e),()=>"The f passed in grads(f) must be a function"),(t,n)=>{p(Array.isArray(t),()=>"The args passed in grads(f)(args) must be an array of `Tensor`s or `TensorLike`s");const r=Re(t,"args","tf.grads","string_or_numeric"),s=n!=null?d(n,"dy","tf.grads"):null;return w.tidy(()=>{const{value:o,grads:a}=w.gradients(()=>e(...r),r,s);return s!=null&&ht(o.shape,s.shape,"The shape of dy passed in grads(f)([x1,...], dy) must match the shape returned by f([x1,...])"),Rn(a),a})}}function Yp(e){return p(Gt(e),()=>"The f passed in valueAndGrad(f) must be a function"),(t,n)=>{p(t instanceof et,()=>"The x passed in valueAndGrad(f)(x) must be a tensor"),p(n==null||n instanceof et,()=>"The dy passed in valueAndGrad(f)(x, dy) must be a tensor");const{grads:r,value:s}=w.gradients(()=>e(t),[t],n);return Rn(r),{grad:r[0],value:s}}}function Jp(e){return p(Gt(e),()=>"The f passed in valueAndGrads(f) must be a function"),(t,n)=>{p(Array.isArray(t)&&t.every(s=>s instanceof et),()=>"The args passed in valueAndGrads(f)(args) must be array of tensors"),p(n==null||n instanceof et,()=>"The dy passed in valueAndGrads(f)(args, dy) must be a tensor");const r=w.gradients(()=>e(...t),t,n);return n!=null&&ht(r.value.shape,n.shape,"The shape of dy passed in valueAndGrads(f)([x1,...], dy) must match the shape returned by f([x1,...])"),Rn(r.grads),r}}function Mc(e,t){p(Gt(e),()=>"The f passed in variableGrads(f) must be a function"),p(t==null||Array.isArray(t)&&t.every(u=>u instanceof Be),()=>"The varList passed in variableGrads(f, varList) must be an array of variables");const n=t!=null;if(!n){t=[];for(const u in w.registeredVariables)t.push(w.registeredVariables[u])}const r=n?t.filter(u=>!u.trainable):null,s=t.length;t=t.filter(u=>u.trainable),p(t.length>0,()=>`variableGrads() expects at least one of the input variables to be trainable, but none of the ${s} variables is trainable.`);const o=!0,{value:a,grads:i}=w.gradients(e,t,null,o);p(i.some(u=>u!=null),()=>"Cannot find a connection between any variable and the result of the loss function y=f(x). Please make sure the operations that use variables are inside the function f passed to minimize()."),p(a.rank===0,()=>`The f passed in variableGrads(f) must return a scalar, but it returned a rank-${a.rank} tensor`);const c={};return t.forEach((u,h)=>{i[h]!=null&&(c[u.name]=i[h])}),r!=null&&r.forEach(u=>c[u.name]=null),{value:a,grads:c}}function At(e){return w.customGrad(e)}function Rn(e){if(e.filter(n=>n==null).length>0)throw new Error(`Cannot compute gradient of y=f(x) with respect to x. Make sure that
    the f you passed encloses all operations that lead from x to y.`)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qp(e){const n={x:d(e,"x","neg")};return w.runKernel(Ta,n)}const It=b({neg_:Qp});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function tg(e){const n={x:d(e,"x","softplus")};return w.runKernel(ci,n)}const Fc=b({softplus_:tg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function eg(e){const t=d(e,"x","logSigmoid");return At(r=>({value:It(Fc(It(r))),gradFunc:a=>D(a,me(It(r)))}))(t)}const ng=b({logSigmoid_:eg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function rg(e,t){let n=d(e,"a","sub"),r=d(t,"b","sub");[n,r]=J(n,r);const s={a:n,b:r};return w.runKernel(Si,s)}const W=b({sub_:rg});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function sg(e,t=-1){const n=d(e,"logits","logSoftmax");if(t===-1&&(t=n.rank-1),t!==n.rank-1)throw Error(`Log Softmax along a non-last dimension is not yet supported. Logits was rank ${n.rank} and axis was ${t}`);return At((s,o)=>{const i=be(s,t,!0),c=W(s,i),u=W(j(c,"float32"),We(V(oe(c),t,!0)));return o([u]),{value:u,gradFunc:(l,f)=>{const[g]=f,y=!0,$=oe(g);return W(l,D(V(l,t,y),$))}}})(n)}const og=b({logSoftmax_:sg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ag(e,t=null,n=!1){const r=d(e,"x","logSumExp"),s=Ke(t,r.shape),o=be(r,s,!0),a=W(r,o),i=oe(a),c=V(i,s),u=We(c),h=P(T(o,u.shape),u);if(n){const l=Je(h.shape,s);return T(h,l)}return h}const Bc=b({logSumExp_:ag});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ig(e,t){const n=d(e,"a","logicalAnd","bool"),r=d(t,"b","logicalAnd","bool");rt(n.shape,r.shape);const s={a:n,b:r};return w.runKernel(la,s)}const En=b({logicalAnd_:ig});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function cg(e){const n={x:d(e,"x","logicalNot","bool")};return w.runKernel(ha,n)}const Rc=b({logicalNot_:cg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ug(e,t){const n=d(e,"a","logicalOr","bool"),r=d(t,"b","logicalOr","bool");rt(n.shape,r.shape);const s={a:n,b:r};return w.runKernel(fa,s)}const Cc=b({logicalOr_:ug});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function lg(e,t){const n=d(e,"a","logicalXor","bool"),r=d(t,"b","logicalXor","bool");return rt(n.shape,r.shape),En(Cc(e,t),Rc(En(e,t)))}const hg=b({logicalXor_:lg});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const nn=2147483648;function fg(e,t,n="left"){const r=d(e,"sortedSequence","searchSorted"),s=d(t,"values","searchSorted"),o=r.shape[r.shape.length-1],a=s.shape[s.shape.length-1],i=T(r,[-1,o]),c=T(s,[-1,a]);if(i.rank<2)throw new Error("Sorted input argument must be at least 2-dimensional");if(i.shape[0]!==c.shape[0])throw new Error("Leading dimension of 'sortedSequence' and 'values' must match.");if(G(c.shape)>=nn)throw new Error(`values tensor size must less than ${nn}`);if(i.shape[1]>=nn)throw new Error(`trailing dim_size must less than ${nn} for int32 output type, was ${i.shape[1]}`);const u={sortedSequence:i,values:c},h={side:n};return w.runKernel(ti,u,h)}const Wr=b({searchSorted_:fg});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function dg(e,t){return Wr(e,t,"left")}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function pg(e,t,n,r,s){const o=d(e,"x","maxPool"),a=1;let i=o,c=!1;o.rank===3&&(c=!0,i=T(o,[1,o.shape[0],o.shape[1],o.shape[2]])),p(i.rank===4,()=>`Error in maxPool: input must be rank 4 but got rank ${i.rank}.`),p(Bt(n,a),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${n} and dilations '${a}'`),kt("maxPool",r,s);const u={x:i},h={filterSize:t,strides:n,pad:r,dimRoundingMode:s},l=w.runKernel(ma,u,h);return c?T(l,[l.shape[1],l.shape[2],l.shape[3]]):l}const Pc=b({maxPool_:pg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function gg(e,t=[1,1,1],n,r,s,o="NDHWC"){const a=d(e,"x","maxPool3d");let i=a,c=!1;a.rank===4&&(c=!0,i=T(a,[1,a.shape[0],a.shape[1],a.shape[2],a.shape[3]])),p(i.rank===5,()=>`Error in maxPool3d: x must be rank 5 but got rank ${i.rank}.`),p(o==="NDHWC",()=>`Error in maxPool3d: Only NDHWC is currently supported, but got dataFormat of ${o}`),kt("maxPool3d",r,s);const u={x:i},h={filterSize:t,strides:n,pad:r,dimRoundingMode:s,dataFormat:o},l=w.runKernel(ba,u,h);return c?T(l,[l.shape[1],l.shape[2],l.shape[3],l.shape[4]]):l}const mg=b({maxPool3d_:gg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function bg(e,t,n,r,s=!1){const a={x:d(e,"x","maxPoolWithArgmax")},i={filterSize:t,strides:n,pad:r,includeBatchInIndex:s},c=w.runKernel(wa,a,i);return{result:c[0],indexes:c[1]}}const wg=b({maxPoolWithArgmax_:bg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function yg(e,t){let n=d(e,"a","maximum"),r=d(t,"b","maximum");[n,r]=J(n,r),n.dtype==="bool"&&(n=j(n,"int32"),r=j(r,"int32")),rt(n.shape,r.shape);const s={a:n,b:r};return w.runKernel(ga,s)}const Oc=b({maximum_:yg});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $g(e,t=null,n=!1){const s={x:d(e,"x","mean")},o={axis:t,keepDims:n};return w.runKernel(ya,s,o)}const kn=b({mean_:$g});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ee(e,t="float32"){if(mt(e),t==="complex64"){const r=Ee(e,"float32"),s=Ee(e,"float32");return Kt(r,s)}const n=Tn(G(e),t);return w.makeTensor(n,e,t)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qt(e,t="float32"){if(mt(e),t==="complex64"){const r=Qt(e,"float32"),s=Ee(e,"float32");return Kt(r,s)}const n=xr(G(e),t);return w.makeTensor(n,e,t)}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Eg(e,t,{indexing:n="xy"}={}){if(n!=="xy"&&n!=="ij")throw new TypeError(`${n} is not a valid third argument to meshgrid`);if(e===void 0)return[];let r=d(e,"x","meshgrid",e instanceof et?e.dtype:"float32");if(t===void 0)return[r];let s=d(t,"y","meshgrid",t instanceof et?t.dtype:"float32");const o=G(r.shape),a=G(s.shape);return n==="xy"?(r=T(r,[1,-1]),s=T(s,[-1,1]),[U(Qt([a,1],r.dtype),r),U(s,Qt([1,o],s.dtype))]):(r=T(r,[-1,1]),s=T(s,[1,-1]),[U(r,Qt([1,a],r.dtype)),U(Qt([o,1],s.dtype),s)])}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function kg(e,t){let n=d(e,"a","minimum"),r=d(t,"b","minimum");[n,r]=J(n,r),n.dtype==="bool"&&(n=j(n,"int32"),r=j(r,"int32")),rt(n.shape,r.shape);const s={a:n,b:r};return w.runKernel(Ea,s)}const xn=b({minimum_:kg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function xg(e,t,n){p(n==="reflect"||n==="symmetric",()=>`Invalid mode. Mode must be either reflect or symmetric. Got ${n}.`);const r=d(e,"x","mirrorPad");if(r.rank===0)throw new Error("mirrorPad(scalar) is not defined. Pass non-scalar to mirrorPad");p(t.length===r.rank,()=>`Padding doesn't match input. Must be ${r.rank}. Got ${t.length}.`);const s=n==="reflect"?1:0;for(let i=0;i<r.rank;i++)p(t[i].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),p(t[i][0]>=0&&t[i][0]<=r.shape[i]-s&&t[i][1]>=0&&t[i][1]<=r.shape[i]-s,()=>`Padding in dimension ${i} cannot be greater than or equal to ${r.shape[i]-s} or less than 0 for input of shape ${r.shape}`);const o={paddings:t,mode:n},a={x:r};return w.runKernel(ka,a,o)}const vg=b({mirrorPad_:xg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Sg(e,t){let n=d(e,"a","mod"),r=d(t,"b","mod");[n,r]=J(n,r);const s={a:n,b:r};return w.runKernel(xa,s)}const Tg=b({mod_:Sg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ig(e,t=null,n=!1){e=d(e,"x","moments");const r=Ke(t,e.shape),s=kn(e,r,n);let o=s.shape;n||(o=Je(s.shape,r));const a=vt(W(j(e,"float32"),T(s,o))),i=kn(a,r,n);return{mean:s,variance:i}}const _g=b({moments_:Ig});function Ag(e,t,n,r){const s=d(t,"data","multiRNNCell"),o=Re(n,"c","multiRNNCell"),a=Re(r,"h","multiRNNCell");let i=s;const c=[];for(let l=0;l<e.length;l++){const f=e[l](i,o[l],a[l]);c.push(f[0]),c.push(f[1]),i=f[1]}const u=[],h=[];for(let l=0;l<c.length;l+=2)u.push(c[l]),h.push(c[l+1]);return[u,h]}const Dg=b({multiRNNCell_:Ag});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ng(e,t,n,r=!1){const s=d(e,"logits","multinomial"),o=s.size,a=s.rank;if(o<2)throw new Error(`Error in multinomial: you need at least 2 outcomes, but got ${o}.`);if(a>2)throw new Error(`Rank of probabilities must be 1 or 2, but is ${a}`);n=n||Math.random();const c={logits:a===1?T(s,[1,-1]):s},u={numSamples:t,seed:n,normalized:r},h=w.runKernel(va,c,u);return a===1?T(h,[h.size]):h}const Mg=b({multinomial_:Ng});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Fg(e,t){let n=d(e,"a","notEqual","string_or_numeric"),r=d(t,"b","notEqual","string_or_numeric");[n,r]=J(n,r),rt(n.shape,r.shape);const s={a:n,b:r};return w.runKernel(Ia,s)}const Lc=b({notEqual_:Fg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Bg(e,t,n=1,r=0,s="int32"){if(t<2)throw new Error(`Error in oneHot: depth must be >=2, but it is ${t}`);const a={indices:d(e,"indices","oneHot","int32")},i={dtype:s,depth:t,onValue:n,offValue:r};return w.runKernel(Ma,a,i)}const br=b({oneHot_:Bg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Rg(e){const n={x:d(e,"x","onesLike")};return w.runKernel(Na,n)}const Cg=b({onesLike_:Rg});function Pg(e,t){const n=d(e,"v1","outerProduct"),r=d(t,"v2","outerProduct");p(n.rank===1&&r.rank===1,()=>`Error in outerProduct: inputs must be rank 1, but got ranks ${n.rank} and ${r.rank}.`);const s=T(n,[-1,1]),o=T(r,[1,-1]);return U(s,o)}const Og=b({outerProduct_:Pg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Lg(e,t,n=0){const r=d(e,"x","pad");if(r.rank===0)throw new Error("pad(scalar) is not defined. Pass non-scalar to pad");const s={paddings:t,constantValue:n},o={x:r};return w.runKernel(Ba,o,s)}const Qe=b({pad_:Lg});function Wg(e,t,n=0){return p(t.length===2,()=>"Invalid number of paddings. Must be length of 2."),Qe(e,[t],n)}const qg=b({pad1d_:Wg});function Ug(e,t,n=0){return p(t.length===2&&t[0].length===2&&t[1].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),Qe(e,t,n)}const Gg=b({pad2d_:Ug});function zg(e,t,n=0){return p(t.length===3&&t[0].length===2&&t[1].length===2&&t[2].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),Qe(e,t,n)}const Kg=b({pad3d_:zg});function Vg(e,t,n=0){return p(t.length===4&&t[0].length===2&&t[1].length===2&&t[2].length===2&&t[3].length===2,()=>"Invalid number of paddings. Must be length of 2 each."),Qe(e,t,n)}const Hg=b({pad4d_:Vg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function jg(e,t,n){const r=d(e,"x","spaceToBatchND");p(r.rank>=1+t.length,()=>`input rank ${r.rank} should be > than [blockShape] ${t.length}`),p(n.length===t.length,()=>`paddings.shape[0] ${n.length} must be equal to [blockShape] ${t.length}`),p(r.shape.reduce((a,i,c)=>c>0&&c<=t.length?a&&(i+n[c-1][0]+n[c-1][1])%t[c-1]===0:a,!0),()=>`input spatial dimensions ${r.shape.slice(1)} with paddings ${n.toString()} must be divisible by blockShapes ${t.toString()}`);const s={x:r},o={blockShape:t,paddings:n};return w.runKernel(hi,s,o)}const Wc=b({spaceToBatchND_:jg});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Xg(e,t,n,r,s,o,a){s==null&&(s=[1,1]),o==null&&(o=1),r===0&&(r="valid");const i=d(e,"x","maxPool");let c=i,u=!1;i.rank===3&&(u=!0,c=T(i,[1,i.shape[0],i.shape[1],i.shape[2]])),p(Bt(o,s),()=>`Error in pool: Either strides or dilations must be 1. Got strides ${o} and dilations '${s}'`);const h=pc(c.shape,t,o,s,r),l=[h.dilationHeight,h.dilationWidth];let f;r==="same"?f=Yg([h.filterHeight,h.filterWidth],l):f=[[0,0],[0,0]];const g=l[0]===1&&l[1]===1,[y,$]=Zg([h.inHeight,h.inWidth],l,f),E=g?r:"valid",v=g?c:Wc(c,l,y),S=(n==="avg"?()=>bc(v,t,o,E,a):()=>Pc(v,t,o,E,a))(),_=g?S:wc(S,l,$);return u?T(_,[_.shape[1],_.shape[2],_.shape[3]]):_}function Zg(e,t,n){const r=n.map(h=>h[0]),s=n.map(h=>h[1]),o=e.concat(r,s),a=t.map((h,l)=>(h-o[l]%h)%h),i=s.map((h,l)=>h+a[l]),c=t.map((h,l)=>[r[l],i[l]]),u=t.map((h,l)=>[0,a[l]]);return[c,u]}function Yg(e,t){const r=e.map((a,i)=>a+(a-1)*(t[i]-1)).map(a=>a-1),s=r.map(a=>Math.floor(a/2)),o=r.map((a,i)=>a-s[i]);return r.map((a,i)=>[s[i],o[i]])}const Jg=b({pool_:Xg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qg(e,t){const n=d(e,"x","prelu"),r=d(t,"alpha","prelu"),s={x:n,alpha:r};return w.runKernel(Ca,s)}const qc=b({prelu_:Qg});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function tm(e,t=null,n=!1){let r=d(e,"x","prod");r.dtype==="bool"&&(r=j(r,"int32"));const s={x:r},o={axis:t,keepDims:n};return w.runKernel(Pa,s,o)}const em=b({prod_:tm});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function nm(e,t,n,r){const s=e.map((h,l)=>d(h,`tensors${l}`,"raggedGather","int32")),o=d(t,"paramsDenseValues","raggedGather"),a=d(n,"indices","raggedGather","int32"),i={paramsNestedSplits:s,paramsDenseValues:o,indices:a},c={outputRaggedRank:r},u=w.runKernel(Oa,i,c);return{outputNestedSplits:u.slice(0,u.length-1),outputDenseValues:u[u.length-1]}}const rm=b({raggedGather_:nm});/**
 * @license
 * Copyright 2022 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function sm(e,t,n){const r=d(e,"starts","raggedRange"),s=d(t,"limits","raggedRange",r.dtype),o=d(n,"deltas","raggedRange",r.dtype),a={starts:r,limits:s,deltas:o},i=w.runKernel(La,a);return{rtNestedSplits:i[0],rtDenseValues:i[1]}}const om=b({raggedRange_:sm});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function am(e,t,n,r,s){const o=d(e,"shape","raggedTensorToTensor","int32"),a=d(t,"values","raggedTensorToTensor"),i=d(n,"defaultValue","raggedTensorToTensor",a.dtype),c=r.map((l,f)=>d(l,`tensors${f}`,"raggedTensorToTensor","int32")),u={shape:o,values:a,defaultValue:i,rowPartitionTensors:c},h={rowPartitionTypes:s};return w.runKernel(Wa,u,h)}const im=b({raggedTensorToTensor_:am});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function cm(e,t,n){mt(e);const r=G(e);let s=null;if(n==null||n==="float32")s=new Float32Array(r);else if(n==="int32")s=new Int32Array(r);else if(n==="bool")s=new Uint8Array(r);else throw new Error(`Unknown data type ${n}`);for(let o=0;o<r;o++)s[o]=t();return w.makeTensor(s,e,n)}const um=b({rand_:cm});var cn={exports:{}},lm=cn.exports,bs;function hm(){return bs||(bs=1,(function(e){(function(t,n,r){function s(c){var u=this,h=i();u.next=function(){var l=2091639*u.s0+u.c*23283064365386963e-26;return u.s0=u.s1,u.s1=u.s2,u.s2=l-(u.c=l|0)},u.c=1,u.s0=h(" "),u.s1=h(" "),u.s2=h(" "),u.s0-=h(c),u.s0<0&&(u.s0+=1),u.s1-=h(c),u.s1<0&&(u.s1+=1),u.s2-=h(c),u.s2<0&&(u.s2+=1),h=null}function o(c,u){return u.c=c.c,u.s0=c.s0,u.s1=c.s1,u.s2=c.s2,u}function a(c,u){var h=new s(c),l=u&&u.state,f=h.next;return f.int32=function(){return h.next()*4294967296|0},f.double=function(){return f()+(f()*2097152|0)*11102230246251565e-32},f.quick=f,l&&(typeof l=="object"&&o(l,h),f.state=function(){return o(h,{})}),f}function i(){var c=4022871197,u=function(h){h=String(h);for(var l=0;l<h.length;l++){c+=h.charCodeAt(l);var f=.02519603282416938*c;c=f>>>0,f-=c,f*=c,c=f>>>0,f-=c,c+=f*4294967296}return(c>>>0)*23283064365386963e-26};return u}n&&n.exports?n.exports=a:this.alea=a})(lm,e)})(cn)),cn.exports}var un={exports:{}},fm=un.exports,ws;function dm(){return ws||(ws=1,(function(e){(function(t,n,r){function s(i){var c=this,u="";c.x=0,c.y=0,c.z=0,c.w=0,c.next=function(){var l=c.x^c.x<<11;return c.x=c.y,c.y=c.z,c.z=c.w,c.w^=c.w>>>19^l^l>>>8},i===(i|0)?c.x=i:u+=i;for(var h=0;h<u.length+64;h++)c.x^=u.charCodeAt(h)|0,c.next()}function o(i,c){return c.x=i.x,c.y=i.y,c.z=i.z,c.w=i.w,c}function a(i,c){var u=new s(i),h=c&&c.state,l=function(){return(u.next()>>>0)/4294967296};return l.double=function(){do var f=u.next()>>>11,g=(u.next()>>>0)/4294967296,y=(f+g)/(1<<21);while(y===0);return y},l.int32=u.next,l.quick=l,h&&(typeof h=="object"&&o(h,u),l.state=function(){return o(u,{})}),l}n&&n.exports?n.exports=a:this.xor128=a})(fm,e)})(un)),un.exports}var ln={exports:{}},pm=ln.exports,ys;function gm(){return ys||(ys=1,(function(e){(function(t,n,r){function s(i){var c=this,u="";c.next=function(){var l=c.x^c.x>>>2;return c.x=c.y,c.y=c.z,c.z=c.w,c.w=c.v,(c.d=c.d+362437|0)+(c.v=c.v^c.v<<4^(l^l<<1))|0},c.x=0,c.y=0,c.z=0,c.w=0,c.v=0,i===(i|0)?c.x=i:u+=i;for(var h=0;h<u.length+64;h++)c.x^=u.charCodeAt(h)|0,h==u.length&&(c.d=c.x<<10^c.x>>>4),c.next()}function o(i,c){return c.x=i.x,c.y=i.y,c.z=i.z,c.w=i.w,c.v=i.v,c.d=i.d,c}function a(i,c){var u=new s(i),h=c&&c.state,l=function(){return(u.next()>>>0)/4294967296};return l.double=function(){do var f=u.next()>>>11,g=(u.next()>>>0)/4294967296,y=(f+g)/(1<<21);while(y===0);return y},l.int32=u.next,l.quick=l,h&&(typeof h=="object"&&o(h,u),l.state=function(){return o(u,{})}),l}n&&n.exports?n.exports=a:this.xorwow=a})(pm,e)})(ln)),ln.exports}var hn={exports:{}},mm=hn.exports,$s;function bm(){return $s||($s=1,(function(e){(function(t,n,r){function s(i){var c=this;c.next=function(){var h=c.x,l=c.i,f,g;return f=h[l],f^=f>>>7,g=f^f<<24,f=h[l+1&7],g^=f^f>>>10,f=h[l+3&7],g^=f^f>>>3,f=h[l+4&7],g^=f^f<<7,f=h[l+7&7],f=f^f<<13,g^=f^f<<9,h[l]=g,c.i=l+1&7,g};function u(h,l){var f,g=[];if(l===(l|0))g[0]=l;else for(l=""+l,f=0;f<l.length;++f)g[f&7]=g[f&7]<<15^l.charCodeAt(f)+g[f+1&7]<<13;for(;g.length<8;)g.push(0);for(f=0;f<8&&g[f]===0;++f);for(f==8?g[7]=-1:g[f],h.x=g,h.i=0,f=256;f>0;--f)h.next()}u(c,i)}function o(i,c){return c.x=i.x.slice(),c.i=i.i,c}function a(i,c){i==null&&(i=+new Date);var u=new s(i),h=c&&c.state,l=function(){return(u.next()>>>0)/4294967296};return l.double=function(){do var f=u.next()>>>11,g=(u.next()>>>0)/4294967296,y=(f+g)/(1<<21);while(y===0);return y},l.int32=u.next,l.quick=l,h&&(h.x&&o(h,u),l.state=function(){return o(u,{})}),l}n&&n.exports?n.exports=a:this.xorshift7=a})(mm,e)})(hn)),hn.exports}var fn={exports:{}},wm=fn.exports,Es;function ym(){return Es||(Es=1,(function(e){(function(t,n,r){function s(i){var c=this;c.next=function(){var h=c.w,l=c.X,f=c.i,g,y;return c.w=h=h+1640531527|0,y=l[f+34&127],g=l[f=f+1&127],y^=y<<13,g^=g<<17,y^=y>>>15,g^=g>>>12,y=l[f]=y^g,c.i=f,y+(h^h>>>16)|0};function u(h,l){var f,g,y,$,E,v=[],B=128;for(l===(l|0)?(g=l,l=null):(l=l+"\0",g=0,B=Math.max(B,l.length)),y=0,$=-32;$<B;++$)l&&(g^=l.charCodeAt(($+32)%l.length)),$===0&&(E=g),g^=g<<10,g^=g>>>15,g^=g<<4,g^=g>>>13,$>=0&&(E=E+1640531527|0,f=v[$&127]^=g+E,y=f==0?y+1:0);for(y>=128&&(v[(l&&l.length||0)&127]=-1),y=127,$=512;$>0;--$)g=v[y+34&127],f=v[y=y+1&127],g^=g<<13,f^=f<<17,g^=g>>>15,f^=f>>>12,v[y]=g^f;h.w=E,h.X=v,h.i=y}u(c,i)}function o(i,c){return c.i=i.i,c.w=i.w,c.X=i.X.slice(),c}function a(i,c){i==null&&(i=+new Date);var u=new s(i),h=c&&c.state,l=function(){return(u.next()>>>0)/4294967296};return l.double=function(){do var f=u.next()>>>11,g=(u.next()>>>0)/4294967296,y=(f+g)/(1<<21);while(y===0);return y},l.int32=u.next,l.quick=l,h&&(h.X&&o(h,u),l.state=function(){return o(u,{})}),l}n&&n.exports?n.exports=a:this.xor4096=a})(wm,e)})(fn)),fn.exports}var dn={exports:{}},$m=dn.exports,ks;function Em(){return ks||(ks=1,(function(e){(function(t,n,r){function s(i){var c=this,u="";c.next=function(){var l=c.b,f=c.c,g=c.d,y=c.a;return l=l<<25^l>>>7^f,f=f-g|0,g=g<<24^g>>>8^y,y=y-l|0,c.b=l=l<<20^l>>>12^f,c.c=f=f-g|0,c.d=g<<16^f>>>16^y,c.a=y-l|0},c.a=0,c.b=0,c.c=-1640531527,c.d=1367130551,i===Math.floor(i)?(c.a=i/4294967296|0,c.b=i|0):u+=i;for(var h=0;h<u.length+20;h++)c.b^=u.charCodeAt(h)|0,c.next()}function o(i,c){return c.a=i.a,c.b=i.b,c.c=i.c,c.d=i.d,c}function a(i,c){var u=new s(i),h=c&&c.state,l=function(){return(u.next()>>>0)/4294967296};return l.double=function(){do var f=u.next()>>>11,g=(u.next()>>>0)/4294967296,y=(f+g)/(1<<21);while(y===0);return y},l.int32=u.next,l.quick=l,h&&(typeof h=="object"&&o(h,u),l.state=function(){return o(u,{})}),l}n&&n.exports?n.exports=a:this.tychei=a})($m,e)})(dn)),dn.exports}var pn={exports:{}},km=pn.exports,xs;function xm(){return xs||(xs=1,(function(e){(function(t,n,r){var s=256,o=6,a=52,i="random",c=r.pow(s,o),u=r.pow(2,a),h=u*2,l=s-1,f;function g(_,A,N){var R=[];A=A==!0?{entropy:!0}:A||{};var M=v(E(A.entropy?[_,S(n)]:_??B(),3),R),x=new y(R),k=function(){for(var m=x.g(o),I=c,F=0;m<u;)m=(m+F)*s,I*=s,F=x.g(1);for(;m>=h;)m/=2,I/=2,F>>>=1;return(m+F)/I};return k.int32=function(){return x.g(4)|0},k.quick=function(){return x.g(4)/4294967296},k.double=k,v(S(x.S),n),(A.pass||N||function(m,I,F,C){return C&&(C.S&&$(C,x),m.state=function(){return $(x,{})}),F?(r[i]=m,I):m})(k,M,"global"in A?A.global:this==r,A.state)}function y(_){var A,N=_.length,R=this,M=0,x=R.i=R.j=0,k=R.S=[];for(N||(_=[N++]);M<s;)k[M]=M++;for(M=0;M<s;M++)k[M]=k[x=l&x+_[M%N]+(A=k[M])],k[x]=A;(R.g=function(m){for(var I,F=0,C=R.i,O=R.j,q=R.S;m--;)I=q[C=l&C+1],F=F*s+q[l&(q[C]=q[O=l&O+I])+(q[O]=I)];return R.i=C,R.j=O,F})(s)}function $(_,A){return A.i=_.i,A.j=_.j,A.S=_.S.slice(),A}function E(_,A){var N=[],R=typeof _,M;if(A&&R=="object")for(M in _)try{N.push(E(_[M],A-1))}catch{}return N.length?N:R=="string"?_:_+"\0"}function v(_,A){for(var N=_+"",R,M=0;M<N.length;)A[l&M]=l&(R^=A[l&M]*19)+N.charCodeAt(M++);return S(A)}function B(){try{var _;return f&&(_=f.randomBytes)?_=_(s):(_=new Uint8Array(s),(t.crypto||t.msCrypto).getRandomValues(_)),S(_)}catch{var A=t.navigator,N=A&&A.plugins;return[+new Date,t,N,t.screen,S(n)]}}function S(_){return String.fromCharCode.apply(0,_)}if(v(r.random(),n),e.exports){e.exports=g;try{f=Iu}catch{}}else r["seed"+i]=g})(typeof self<"u"?self:km,[],Math)})(pn)),pn.exports}var jn,vs;function vm(){if(vs)return jn;vs=1;var e=hm(),t=dm(),n=gm(),r=bm(),s=ym(),o=Em(),a=xm();return a.alea=e,a.xor128=t,a.xorwow=n,a.xorshift7=r,a.xor4096=s,a.tychei=o,jn=a,jn}var qr=vm();/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Sm=.001,Uc=.1;function Tm(e,t,n){return n==null&&(n=Ur()),wr(e,t,(r,s)=>Gr(r,s,n))}function Ur(){return w.backend.floatPrecision()===32?Sm:Uc}function wr(e,t,n){let r=!0;if((at(e)||at(t))&&(r=!1),at(e)&&at(t)&&(r=!0),r){const a=e.constructor.name,i=t.constructor.name;if(a!==i)throw new Error(`Arrays are of different type. Actual: ${a}. Expected: ${i}`)}if(Array.isArray(e)&&Array.isArray(t)){const a=_t(e),i=_t(t);if(!Ft(a,i))throw new Error(`Arrays have different shapes. Actual: [${a}]. Expected: [${i}]`)}const s=at(e)?e:zt(e),o=at(t)?t:zt(t);if(s.length!==o.length)throw new Error(`Arrays have different lengths actual: ${s.length} vs expected: ${o.length}.
Actual:   ${s}.
Expected: ${o}.`);for(let a=0;a<o.length;++a){const i=s[a],c=o[a];if(!n(i,c))throw new Error(`Arrays differ: actual[${a}] = ${i}, expected[${a}] = ${c}.
Actual:   ${s}.
Expected: ${o}.`)}typeof expect<"u"&&expect().nothing()}function Im(e,t){e().then(()=>t.fail(),()=>t()),typeof expect<"u"&&expect().nothing()}function _m(e,t){const n=typeof t=="string"||typeof t=="number"||typeof t=="boolean"?[t]:t;return Lt(e)||Lt(e[0])||Lt(t)||Lt(t[0])?wr(e,n,(r,s)=>r==s):wr(e,t,(r,s)=>Gr(r,s,0))}function Am(e,t,n){if(n==null&&(n=Ur()),!Gr(e,t,n))throw new Error(`Numbers differ: actual === ${e}, expected === ${t}`);typeof expect<"u"&&expect().nothing()}function Gr(e,t,n){return!isFinite(e)&&!isFinite(t)?!0:!(isNaN(e)||isNaN(t)||Math.abs(e-t)>n)}function Dm(e,t,n){for(let r=0;r<e.length;r++)if(e[r]<t||e[r]>n)throw new Error(`Value out of range:${e[r]} low: ${t}, high: ${n}`)}function Nm(e,t){const n=new Float32Array(e),r=new Float32Array(t);if(n.length!==r.length)throw new Error(`Expected ArrayBuffer to be of length ${r.length}, but it was ${n.length}`);for(let s=0;s<r.length;s++)if(n[s]!==r[s])throw new Error(`Expected ArrayBuffer value at ${s} to be ${r[s]} but got ${n[s]} instead`)}function Gc(e){for(let t=0;t<e.length;t++){const n=e[t];Array.isArray(n)?Gc(n):e[t]=je(n)}return e}function Mm(e){const t=document.createElement("video");return"playsInline"in t&&(t.playsInline=!0),t.muted=!0,t.loop=!0,t.style.position="fixed",t.style.left="0px",t.style.top="0px",t.preload="auto",t.appendChild(e),new Promise(n=>{t.addEventListener("loadeddata",r=>n(t)),t.load()})}async function Fm(e){await e.play(),"requestVideoFrameCallback"in e&&await new Promise(t=>{e.requestVideoFrameCallback(t)})}const Bm=Object.freeze(Object.defineProperty({__proto__:null,TEST_EPSILON_FLOAT16:Uc,createVideoElement:Mm,encodeStrings:Gc,expectArrayBuffersEqual:Nm,expectArraysClose:Tm,expectArraysEqual:_m,expectNumbersClose:Am,expectPromiseToFail:Im,expectValuesInRange:Dm,play:Fm,testEpsilon:Ur},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class zr{constructor(t,n,r,s,o){this.mean=t,this.stdDev=n,this.dtype=r,this.nextVal=NaN,this.truncated=s,this.truncated&&(this.upper=this.mean+this.stdDev*2,this.lower=this.mean-this.stdDev*2);const a=o||Math.random();this.random=qr.alea(a.toString())}nextValue(){if(!isNaN(this.nextVal)){const s=this.nextVal;return this.nextVal=NaN,s}let t,n,r=!1;for(;!r;){let s,o,a;do s=2*this.random()-1,o=2*this.random()-1,a=s*s+o*o;while(a>=1||a===0);const i=Math.sqrt(-2*Math.log(a)/a);t=this.mean+this.stdDev*s*i,n=this.mean+this.stdDev*o*i,(!this.truncated||this.isValidTruncated(t))&&(r=!0)}return(!this.truncated||this.isValidTruncated(n))&&(this.nextVal=this.convertValue(n)),this.convertValue(t)}convertValue(t){return this.dtype==null||this.dtype==="float32"?t:Math.round(t)}isValidTruncated(t){return t<=this.upper&&t>=this.lower}}class Rm{constructor(t,n,r,s){this.alpha=t,this.beta=1/n,this.dtype=r;const o=s||Math.random();this.randu=qr.alea(o.toString()),this.randn=new zr(0,1,r,!1,this.randu()),t<1?this.d=t+2/3:this.d=t-1/3,this.c=1/Math.sqrt(9*this.d)}nextValue(){let t,n,r,s,o,a;for(;;){do s=this.randn.nextValue(),a=1+this.c*s;while(a<=0);if(a*=a*a,t=s*s,n=1-.331*t*t,r=.5*t+this.d*(1-a+Math.log(a)),o=this.randu(),o<n||Math.log(o)<r)break}return a=1/this.beta*this.d*a,this.alpha<1&&(a*=Math.pow(this.randu(),1/this.alpha)),this.convertValue(a)}convertValue(t){return this.dtype==="float32"?t:Math.round(t)}}class Cm{constructor(t=0,n=1,r,s){if(this.canReturnFloat=()=>this.dtype==null||this.dtype==="float32",this.min=t,this.range=n-t,this.dtype=r,s==null&&(s=Math.random()),typeof s=="number"&&(s=s.toString()),!this.canReturnFloat()&&this.range<=1)throw new Error(`The difference between ${t} - ${n} <= 1 and dtype is not float`);this.random=qr.alea(s)}convertValue(t){return this.canReturnFloat()?t:Math.round(t)}nextValue(){return this.convertValue(this.min+this.range*this.random())}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Pm(e,t,n=1,r="float32",s){if(mt(e),n==null&&(n=1),r==null&&(r="float32"),r!=="float32"&&r!=="int32")throw new Error(`Unsupported data type ${r}`);const o=new Rm(t,n,r,s),a=Nt(e,r);for(let i=0;i<a.values.length;i++)a.values[i]=o.nextValue();return a.toTensor()}const Om=b({randomGamma_:Pm});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Lm(e,t=0,n=1,r,s){if(mt(e),r!=null&&r==="bool")throw new Error(`Unsupported data type ${r}`);const o=new zr(t,n,r,!1,s),a=Nt(e,r);for(let i=0;i<a.values.length;i++)a.values[i]=o.nextValue();return a.toTensor()}const zc=b({randomNormal_:Lm});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Wm(e,t,n){if(t!=null&&t==="bool")throw new Error(`Unsupported data type ${t}`);return zc(e,0,1,t,n)}const qm=b({randomStandardNormal_:Wm});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Um(e,t=0,n=1,r="float32",s){mt(e);const o=Nt(e,r),a=new Cm(t,n,null,s);for(let i=0;i<o.values.length;i++)o.values[i]=a.nextValue();return o.toTensor()}const Kr=b({randomUniform_:Um});/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gm(e,t,n,r){return Kr(e,t,n,"int32",r)}const zm=b({randomUniformInt_:Gm});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function qe(e,t,n=1,r="float32"){if(n===0)throw new Error("Cannot have a step of zero");const s={start:e,stop:t,step:n,dtype:r};return w.runKernel(qa,{},s)}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Km(e){const n={input:d(e,"input","real")};return w.runKernel(Ua,n)}const Ue=b({real_:Km});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Vm(e){const n={x:d(e,"x","reciprocal")};return w.runKernel(Ga,n)}const Hm=b({reciprocal_:Vm});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function jm(e){const n={x:d(e,"x","relu")};return w.runKernel(za,n)}const Cn=b({relu_:jm});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Xm(e){const n={x:d(e,"x","relu6")};return w.runKernel(ja,n)}const Kc=b({relu6_:Xm});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Zm(e,t){const r={x:d(e,"x","reverse")},s={dims:t};return w.runKernel(Xa,r,s)}const ae=b({reverse_:Zm});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ym(e){const t=d(e,"x","reverse");return p(t.rank===1,()=>`Error in reverse1D: x must be rank 1 but got rank ${t.rank}.`),ae(t,0)}const Jm=b({reverse1d_:Ym});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qm(e,t){const n=d(e,"x","reverse");return p(n.rank===2,()=>`Error in reverse2D: x must be rank 2 but got rank ${n.rank}.`),ae(n,t)}const tb=b({reverse2d_:Qm});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function eb(e,t){const n=d(e,"x","reverse");return p(n.rank===3,()=>`Error in reverse3D: x must be rank 3 but got rank ${n.rank}.`),ae(n,t)}const nb=b({reverse3d_:eb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function rb(e,t){const n=d(e,"x","reverse");return p(n.rank===4,()=>`Error in reverse4D: x must be rank 4 but got rank ${n.rank}.`),ae(n,t)}const sb=b({reverse4d_:rb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ob(e){const n={x:d(e,"x","round")};return w.runKernel(Za,n)}const Vc=b({round_:ob});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ab(e){const n={x:d(e,"x","rsqrt","float32")};return w.runKernel(Ya,n)}const ib=b({rsqrt_:ab});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function cb(e){const n={x:d(e,"x","selu")};return w.runKernel(ni,n)}const ub=b({selu_:cb});function lb(e,t,n,r,s,o=[1,1],a="NHWC"){const i=d(e,"x","separableConv2d"),c=d(t,"depthwiseFilter","separableConv2d"),u=d(n,"pointwiseFilter","separableConv2d");let h=i,l=!1;if(i.rank===3&&(l=!0,h=T(i,[1,i.shape[0],i.shape[1],i.shape[2]])),a==="NCHW")throw new Error("separableConv2d currently does not support dataFormat NCHW; only NHWC is supported");p(h.rank===4,()=>`Error in separableConv2d: input must be rank 4, but got rank ${h.rank}.`),p(c.rank===4,()=>`Error in separableConv2d: depthwise filter must be rank 4, but got rank ${c.rank}.`),p(u.rank===4,()=>`Error in separableConv2d: pointwise filter must be rank 4, but got rank ${c.rank}.`),p(u.shape[0]===1,()=>`Error in separableConv2d: the first dimension of pointwise filter  must be 1, but got ${u.shape[0]}.`),p(u.shape[1]===1,()=>`Error in separableConv2d: the second dimension of pointwise filter must be 1, but got ${u.shape[1]}.`);const f=c.shape[2],g=c.shape[3];p(u.shape[2]===f*g,()=>`Error in separableConv2d: the third dimension of pointwise filter must be ${f*g}, but got ${u.shape[2]}.`);const y=Cr(h,c,r,s,a,o),E=Nn(y,u,1,"valid",a);return l?T(E,[E.shape[1],E.shape[2],E.shape[3]]):E}const hb=b({separableConv2d_:lb});/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function fb(e,t){const n=d(e,"x","setdiff1d"),r=d(t,"y","setdiff1d");p(n.dtype===r.dtype,()=>`x and y should have the same dtype, but got x (${n.dtype}) and y (${r.dtype}).`),p(n.rank===1,()=>`x should be 1D tensor, but got x (${n.shape}).`),p(r.rank===1,()=>`y should be 1D tensor, but got y (${r.shape}).`);const s=await n.data(),o=await r.data(),a=new Set(o);let i=0;for(let h=0;h<s.length;h++)a.has(s[h])||i++;const c=new $n([i],n.dtype),u=new $n([i],"int32");for(let h=0,l=0;h<s.length;h++)a.has(s[h])||(c.values[l]=s[h],u.values[l]=h,l++);return[c.toTensor(),u.toTensor()]}const db=fb;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function pb(e){const n={x:d(e,"x","sign")};return w.runKernel(ai,n)}const gb=b({sign_:pb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function mb(e){const n={x:d(e,"x","sin","float32")};return w.runKernel(si,n)}const bb=b({sin_:mb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function wb(e){const n={x:d(e,"x","sinh")};return w.runKernel(oi,n)}const yb=b({sinh_:wb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $b(e,t,n){const r=d(e,"x","slice1d");return p(r.rank===1,()=>`slice1d expects a rank-1 tensor, but got a rank-${r.rank} tensor`),X(r,[t],[n])}const Eb=b({slice1d_:$b});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function kb(e,t,n){const r=d(e,"x","slice2d");return p(r.rank===2,()=>`slice2d expects a rank-2 tensor, but got a rank-${r.rank} tensor`),X(r,t,n)}const xb=b({slice2d_:kb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function vb(e,t,n){const r=d(e,"x","slice3d");return p(r.rank===3,()=>`slice3d expects a rank-3 tensor, but got a rank-${r.rank} tensor`),X(r,t,n)}const Sb=b({slice3d_:vb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Tb(e,t,n){const r=d(e,"x","slice4d");return p(r.rank===4,()=>`slice4d expects a rank-4 tensor, but got a rank-${r.rank} tensor`),X(r,t,n)}const Ib=b({slice4d_:Tb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function _b(e,t=-1){const n=d(e,"logits","softmax","float32");if(t===-1&&(t=n.rank-1),t!==n.rank-1)throw Error(`Softmax along a non-last dimension is not yet supported. Logits was rank ${n.rank} and dim was ${t}`);const r={logits:n},s={dim:t};return w.runKernel(di,r,s)}const Ab=b({softmax_:_b});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Db(e){p(e.dtype==="complex64",()=>`The dtype for tf.spectral.fft() must be complex64 but got ${e.dtype}.`);const t={input:e};return w.runKernel(Go,t)}const Vr=b({fft_:Db});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Nb(e){p(e.dtype==="complex64",()=>`The dtype for tf.spectral.ifft() must be complex64 but got ${e.dtype}.`);const t={input:e};return w.runKernel(Qo,t)}const vn=b({ifft_:Nb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Mb(e){const t=e.shape[e.shape.length-1],n=e.size/t;let r;if(t<=2){const s=T(e,[n,t]);r=vn(s)}else{const s=[n,2*(t-1)],o=T(Ue(e),[n,t]),a=T(Bn(e),[n,t]),i=ae(X(o,[0,1],[n,t-2]),1),c=D(ae(X(a,[0,1],[n,t-2]),1),z(-1)),u=gt([o,i],1),h=gt([a,c],1),l=T(Kt(u,h),[s[0],s[1]]);r=vn(l)}if(r=Ue(r),e.rank===3&&e.shape[0]!==0){const s=r,o=e.shape[0];r=T(r,[o,r.shape[0]/o,r.shape[1]]),s.dispose()}return r}const Hc=b({irfft_:Mb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Fb(e,t,n=0){const s={x:d(e,"x","split")},o={numOrSizeSplits:t,axis:n};return w.runKernel(fi,s,o)}const Ge=b({split_:Fb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Bb(e,t){p(e.dtype==="float32",()=>`The dtype for rfft() must be real value but got ${e.dtype}`);let n=e.shape[e.shape.length-1];const r=e.size/n;let s;if(t!=null&&t<n){const y=e.shape.map(E=>0),$=e.shape.map(E=>E);$[e.shape.length-1]=t,s=X(e,y,$),n=t}else if(t!=null&&t>n){const y=e.shape.map($=>$);y[e.shape.length-1]=t-n,s=gt([e,Ee(y)],e.shape.length-1),n=t}else s=e;const o=yt(s),a=T(Kt(s,o),[r,n]),i=Vr(a),c=Math.floor(n/2)+1,u=Ue(i),h=Bn(i),l=Ge(u,[c,n-c],u.shape.length-1),f=Ge(h,[c,n-c],h.shape.length-1),g=s.shape.slice();return g[s.shape.length-1]=c,T(Kt(l[0],f[0]),g)}const Hr=b({rfft_:Bb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Rb(e,t){let n=d(e,"a","squaredDifference"),r=d(t,"b","squaredDifference");[n,r]=J(n,r),rt(n.shape,r.shape);const s={a:n,b:r},o={};return w.runKernel(yi,s,o)}const jc=b({squaredDifference_:Rb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Cb(e,t){const n=d(e,"x","squeeze","string_or_numeric");return T(n,Cs(n.shape,t).newShape)}const jr=b({squeeze_:Cb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Pb(e,t=0){const n=Re(e,"tensors","stack","string_or_numeric");p(n.length>=1,()=>"Pass at least one tensor to tf.stack"),n.length>0&&p(t<=n[0].rank,()=>"Axis must be <= rank of the tensor");const r=n,s={axis:t};return w.runKernel(Fa,r,s)}const ze=b({stack_:Pb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ob(e,t=0){const r={x:d(e,"x","step")},s={alpha:t};return w.runKernel(Bi,r,s)}const Xc=b({step_:Ob});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Lb(e,t,n,r,s=0,o=0,a=0,i=0,c=0){const h={x:d(e,"x","stridedSlice","string_or_numeric")},l={begin:t,end:n,strides:r,beginMask:s,endMask:o,ellipsisMask:a,newAxisMask:i,shrinkAxisMask:c};return w.runKernel(Ei,h,l)}const Wb=b({stridedSlice_:Lb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function qb(e){const n={x:d(e,"x","tan","float32")};return w.runKernel(Ti,n)}const Ub=b({tan_:qb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Et(e,t){ce(e);const n=_t(e,t);if(n.length!==1)throw new Error("tensor1d() requires values to be a flat/TypedArray");return Ht(e,null,n,t)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ae(e,t,n){if(ce(e),t!=null&&t.length!==2)throw new Error("tensor2d() requires shape to have two numbers");const r=_t(e,n);if(r.length!==2&&r.length!==1)throw new Error("tensor2d() requires values to be number[][] or flat/TypedArray");if(r.length===1&&t==null)throw new Error("tensor2d() requires shape to be provided when `values` are a flat/TypedArray");return Ht(e,t,r,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Zc(e,t,n){if(ce(e),t!=null&&t.length!==3)throw new Error("tensor3d() requires shape to have three numbers");const r=_t(e,n);if(r.length!==3&&r.length!==1)throw new Error("tensor3d() requires values to be number[][][] or flat/TypedArray");if(r.length===1&&t==null)throw new Error("tensor3d() requires shape to be provided when `values` are a flat array");return Ht(e,t,r,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gb(e,t,n){if(ce(e),t!=null&&t.length!==4)throw new Error("tensor4d() requires shape to have four numbers");const r=_t(e,n);if(r.length!==4&&r.length!==1)throw new Error("tensor4d() requires values to be number[][][][] or flat/TypedArray");if(r.length===1&&t==null)throw new Error("tensor4d() requires shape to be provided when `values` are a flat array");return Ht(e,t,r,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function zb(e,t,n){if(ce(e),t!=null&&t.length!==5)throw new Error("tensor5d() requires shape to have five numbers");const r=_t(e,n);if(r.length!==5&&r.length!==1)throw new Error("tensor5d() requires values to be number[][][][][] or flat/TypedArray");if(r.length===1&&t==null)throw new Error("tensor5d() requires shape to be provided when `values` are a flat array");return Ht(e,t,r,n)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Kb(e,t,n){if(ce(e),t!=null&&t.length!==6)throw new Error("tensor6d() requires shape to have six numbers");const r=_t(e,n);if(r.length!==6&&r.length!==1)throw new Error("tensor6d() requires values to be number[][][][][][] or flat/TypedArray");if(r.length===1&&t==null)throw new Error("tensor6d() requires shape to be provided when `values` are a flat array");return t=t||r,Ht(e,t,r,n)}function Xr(e,t,n){const r=t.rank>1?t.shape[t.rank-1]:1,s=t.rank>1?t.rank-1:1,o=`Must have updates.shape = indices.shape[:batchDim] + shape[sliceDim:], got updates.shape: ${n.shape}, indices.shape: ${t.shape}, shape: ${e}, sliceDim: ${r}, and batchDim: ${s}.`;if(n.rank<s)throw new Error(o+` update.rank < ${s}. `);if(e.length<r+(n.rank-s))throw new Error(o+` Output shape length < ${r+(n.rank-s)}`);if(n.rank!==s+e.length-r)throw new Error(o+` update.rank != ${s+e.length-r}`);for(let a=0;a<s;++a)if(n.shape[a]!==t.shape[a])throw new Error(o+` updates.shape[${a}] (${n.shape[a]}) != indices.shape[${a}] (${t.shape[a]}).`);for(let a=0;a<n.rank-s;++a)if(n.shape[a+s]!==e[a+r])throw new Error(o+` updates.shape[${a+s}] (${n.shape[a+s]}) != shape[${a+s}] (${e[a+s]})`)}function Pn(e,t,n){if(t.rank<1)throw new Error(`tf.scatterND() expects the indices to be rank 1 or higher, but the rank was ${t.rank}.`);if(e.rank<1)throw new Error(`tf.scatterND() expects the updates to be rank 1 or higher, but the rank was ${e.rank}.`);if(t.dtype!=="int32")throw new Error(`The dtype of 'indices' should be int32, but got dtype: ${t.dtype}`);if(n.length<1)throw new Error(`Output rank must be greater or equal to 1, but got shape: ${n}`);if(n.length===0){if(t.size===0)throw new Error(`Indices specified for empty output. indices shape: ${t.shape}`);if(e.size===0)throw new Error(`Updates specified for empty output. updates shape: ${e.shape}`)}Xr(n,t,e)}function Yc(e,t,n){const r=t.shape.length,s=r>1?t.shape[r-1]:1,o=n.length;let a=1;for(let l=s;l<o;++l)a*=n[l];const i=s<1?1:s,c=G(t.shape)/i,u=[...ke(n.slice(0,s)),1],h=G(n);return{sliceRank:s,numUpdates:c,sliceSize:a,strides:u,outputSize:h}}const Vb=Object.freeze(Object.defineProperty({__proto__:null,calculateShapes:Yc,validateInput:Pn,validateUpdateShape:Xr},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Hb(e,t,n){const r=d(e,"tensor","tensorScatterupdate"),s=d(t,"indices","tensorScatterupdate","int32"),o=d(n,"updates","tensorScatterupdate");if(Pn(o,s,r.shape),r.dtype!==o.dtype)throw new Error(`tensor and updates must have the same dtype, instead they are ${r.dtype} and ${o.dtype}.`);const a={tensor:r,indices:s,updates:o},i={};return w.runKernel(Qa,a,i)}const jb=b({tensorScatterUpdate_:Hb});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Xb(e,t=1,n=!0){const r=d(e,"x","topk");if(r.rank===0)throw new Error("topk() expects the input to be of rank 1 or higher");const s=r.shape[r.shape.length-1];if(t<0)throw new Error(`'k' passed to topk() must be >= 0 but got ${t}`);if(t>s)throw new Error(`'k' passed to topk() must be <= the last dimension (${s}) but got ${t}`);const o={x:r},a={k:t,sorted:n},[i,c]=w.runKernel(_i,o,a);return{values:i,indices:c}}const Zb=b({topk_:Xb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Yb(e,t=0,n=1,r,s){if(mt(e),r!=null&&r==="bool")throw new Error("Unsupported data type $ { dtype }");const o=new zr(t,n,r,!0,s),a=Nt(e,r);for(let i=0;i<a.values.length;i++)a.values[i]=o.nextValue();return a.toTensor()}const Jb=b({truncatedNormal_:Yb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qb(e,t=0){const n=d(e,"x","unique","string_or_numeric");p(n.rank>0,()=>"The input tensor must be at least 1D");const r={x:n},s={axis:t},[o,a]=w.runKernel(Di,r,s);return{values:o,indices:a}}const tw=b({unique_:Qb});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ew(e,t,n){const r=d(e,"x","unsortedSegmentSum"),s=d(t,"segmentIds","unsortedSegmentSum","int32");p(we(n),()=>"numSegments must be of dtype int");const o={x:r,segmentIds:s},a={numSegments:n};return w.runKernel(Mi,o,a)}const nw=b({unsortedSegmentSum_:ew});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function rw(e,t=0){const n=d(e,"x","unstack","string_or_numeric");p(t>=-n.shape.length&&t<n.shape.length,()=>`Axis = ${t} is not in [-${n.shape.length}, ${n.shape.length})`);const r={value:n},s={axis:t};return w.runKernel(Ni,r,s)}const Zr=b({unstack_:rw});/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function sw(e,t){return Wr(e,t,"right")}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ow(e,t=!0,n,r){return w.makeVariable(e,t,n,r)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Jc(e,t){const n=[];for(let o=0;o<t.length;o++)t[o]&&n.push(o);const r=Nt(e,"int32"),s=Nt([n.length,e.length],"int32");for(let o=0;o<n.length;o++){const a=r.indexToLoc(n[o]),i=o*e.length;s.values.set(a,i)}return s.toTensor()}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function aw(e){const t=d(e,"condition","whereAsync","bool"),n=await t.data(),r=Jc(t.shape,n);return e!==t&&t.dispose(),r}const Qc=aw;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function iw(e,t,n){const r=d(e,"tensor","boolMask"),s=d(t,"mask","boolMask","bool"),o=n??0,a=s.rank,i=r.shape;p(a>0,()=>"mask cannot be scalar"),ht(i.slice(o,o+a),s.shape,"mask's shape must match the first K dimensions of tensor's shape,");let c=1;for(let $=o;$<o+a;$++)c*=i[$];const u=i.slice(0,o).concat([c],i.slice(o+a)),h=T(r,u),l=T(s,[-1]),f=await Qc(l),g=jr(f,[1]),y=_c(h,g,o);return e!==r&&r.dispose(),t!==s&&s.dispose(),g.dispose(),h.dispose(),l.dispose(),f.dispose(),y}const cw=iw;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function uw(e,t,n){const r=d(e,"x","transpose");if(t==null&&(t=r.shape.map((a,i)=>i).reverse()),p(r.rank===t.length,()=>`Error in transpose: rank of input ${r.rank} must match length of perm ${t}.`),t.forEach(a=>{p(a>=0&&a<r.rank,()=>`All entries in 'perm' must be between 0 and ${r.rank-1} but got ${t}`)}),r.rank<=1)return r.clone();const s={x:r},o={perm:t};return r.dtype==="complex64"?nt(()=>{let a=Ue(r),i=Bn(r);return a=w.runKernel(rn,{x:a},o),i=w.runKernel(rn,{x:i},o),n&&(i=It(i)),Kt(a,i)}):w.runKernel(rn,s,o)}const Sn=b({transpose_:uw});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function lw(e,t,n,r,s=!0){const o=d(e,"v","movingAverage"),a=d(t,"x","movingAverage"),i=d(n,"decay","movingAverage");Vi(o,a),p(Ft(o.shape,a.shape),()=>"Shape mismatch in v and x");const c=z(1),u=W(c,i);let h=D(W(a,o),u);if(s){p(r!=null,()=>"When using zeroDebias: true, step is required.");const l=d(r,"step","movingAverage");h=H(h,W(c,Le(i,l)))}return P(o,h)}const hw=b({movingAverage_:lw});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function fw(e,t,n){mt(n);const r=d(e,"indices","scatterND","int32"),s=d(t,"updates","scatterND");Pn(s,r,n);const o={indices:r,updates:s},a={shape:n};return w.runKernel(Ja,o,a)}const dw=b({scatterND_:fw});function pw(e,t,n,r){if(e.dtype!=="int32")throw new Error(`tf.sparseToDense() expects the indices to be int32 type, but the dtype was ${e.dtype}.`);if(e.rank>2)throw new Error(`sparseIndices should be a scalar, vector, or matrix, but got shape ${e.shape}.`);const s=e.rank>0?e.shape[0]:1,o=e.rank>1?e.shape[1]:1;if(n.length!==o)throw new Error(`outputShape has incorrect number of elements:, ${n.length}, should be: ${o}.`);const a=t.size;if(!(t.rank===0||t.rank===1&&a===s))throw new Error(`sparseValues has incorrect shape ${t.shape}, should be [] or [${s}]`);if(t.dtype!==r.dtype)throw new Error("sparseValues.dtype must match defaultValues.dtype")}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function gw(e,t,n,r=0){mt(n);const s=d(e,"sparseIndices","sparseToDense","int32"),o=d(t,"sparseValues","sparseToDense","string_or_numeric"),a=d(r,"defaultValue","sparseToDense",o.dtype);pw(s,o,n,a);const i={sparseIndices:s,sparseValues:o,defaultValue:a},c={outputShape:n};return w.runKernel(wi,i,c)}const mw=b({sparseToDense_:gw});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function bw(e,t){const n=d(t,"indices","gatherND","int32"),s={params:d(e,"x","gatherND","string_or_numeric"),indices:n};return w.runKernel(Zo,s)}const ww=b({gatherND_:bw});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function yw(e,t){if(t==null)return e.shape.slice();if(Ft(e.shape,t))return t;if(e.shape.length===t.length){const n=[];for(let r=0;r<e.shape.length;r++)t[r]==null&&e.shape[r]!=null?n.push(e.shape[r]):n.push(t[r]);return n}return t}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function $w(e,t,n,r){const s=d(e,"x","dropout");if(p(s.dtype==="float32",()=>`x has to be a floating point tensor since it's going to be scaled, but got a ${s.dtype} tensor instead.`),p(t>=0&&t<1,()=>`rate must be a float in the range [0, 1), but got ${t}.`),t===0)return e instanceof et?s.clone():s;const o=yw(s,n),a=1-t,i=H(Ic(P(Kr(o,0,1,"float32",r),a)),a);return D(s,i)}const Ew=b({dropout_:$w});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function tu(e){return Math.floor(Math.pow(2,Math.ceil(Math.log(e)/Math.log(2))))}function Yr(e,t,n){const r=1-e%2,s=new Float32Array(e);for(let o=0;o<e;++o){const a=2*Math.PI*o/(e+r-1);s[o]=t-n*Math.cos(a)}return Et(s,"float32")}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function kw(e,t,n=1){const r=d(e,"predictions","inTopK"),s=d(t,"targets","inTopK");p(r.rank>1,()=>`inTopK() expects the predictions to be of rank 2 or higher, but got ${r.rank}`),p(r.rank-1===s.rank,()=>`predictions rank should be 1 larger than targets rank, but got predictions rank ${r.rank} and targets rank ${s.rank}`),ht(r.shape.slice(0,r.shape.length-1),s.shape,"predictions's shape should be align with the targets' shape, except the last dimension.");const o=r.shape[r.shape.length-1];p(n>0&&n<=o,()=>`'k' passed to inTopK() must be > 0 && <= the predictions last dimension (${o}), but got ${n}`);const a=await r.data(),i=await s.data(),[c,u]=[a.length/o,o],h=Ps("bool",c);for(let l=0;l<c;l++){const f=l*u,g=a.subarray(f,f+u),y=[];for(let $=0;$<g.length;$++)y.push({value:g[$],index:$});y.sort(($,E)=>E.value-$.value),h[l]=0;for(let $=0;$<n;$++)if(y[$].index===i[l]){h[l]=1;break}}return e!==r&&r.dispose(),t!==s&&s.dispose(),de(h,s.shape,"bool")}const xw=kw;/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function vw(e,t,n,r,s,o="NHWC",a){let i=e;e.rank===3&&(i=T(e,[1,e.shape[0],e.shape[1],e.shape[2]]));let c=t;c.rank===3&&(c=T(t,[1,t.shape[0],t.shape[1],t.shape[2]])),p(i.rank===4,()=>`Error in conv2dDerFilter: input must be rank 4, but got shape ${i.shape}.`),p(c.rank===4,()=>`Error in conv2dDerFilter: dy must be rank 4, but got shape ${c.shape}.`),p(n.length===4,()=>`Error in conv2dDerFilter: filterShape must be length 4, but got ${n}.`);const u=o==="NHWC"?i.shape[3]:i.shape[1],h=o==="NHWC"?c.shape[3]:c.shape[1];p(u===n[2],()=>`Error in conv2dDerFilter: depth of input ${u}) must match input depth in filter (${n[2]}.`),p(h===n[3],()=>`Error in conv2dDerFilter: depth of dy (${h}) must match output depth for filter (${n[3]}).`),kt("conv2dDerFilter",s,a);const l={x:i,dy:c},f={strides:r,pad:s,dataFormat:o,dimRoundingMode:a,filterShape:n};return w.runKernel(yo,l,f)}const Sw=b({conv2DBackpropFilter_:vw});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function On(e,t,n){if(n==null||n==="linear")return e;if(n==="relu")return D(e,Xc(t));throw new Error(`Cannot compute gradient for fused activation ${n}.`)}function Ln(e,t){let n=t;const r=Pr(e.shape,t.shape);return r.length>0&&(n=V(n,r)),T(n,e.shape)}function Wn(e,t,n,r){if(t==="linear")return e;if(t==="relu")return Cn(e);if(t==="elu")return xc(e);if(t==="relu6")return Kc(e);if(t==="prelu")return qc(e,n);if(t==="leakyrelu")return Dc(e,r);if(t==="sigmoid")return me(e);throw new Error(`Unknown fused activation ${t}.`)}const qn=(e,t)=>!(e>0)||t==="linear";/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Tw({x:e,filter:t,strides:n,pad:r,dataFormat:s="NHWC",dilations:o=[1,1],dimRoundingMode:a,bias:i,activation:c="linear",preluActivationWeights:u,leakyreluAlpha:h}){if(c=c||"linear",qn(w.state.gradientDepth,c)===!1){p(s==="NHWC",()=>`Error in fused conv2d: got dataFormat of ${s} but only NHWC is currently supported for the case of gradient depth is 0 and the activation is not linear.`);let N=Nn(e,t,n,r,s,o,a);return i!=null&&(N=P(N,i)),Wn(N,c,u,h)}const l=d(e,"x","conv2d","float32"),f=d(t,"filter","conv2d","float32");let g=l,y=!1;l.rank===3&&(y=!0,g=T(l,[1,l.shape[0],l.shape[1],l.shape[2]])),p(g.rank===4,()=>`Error in fused conv2d: input must be rank 4, but got rank ${g.rank}.`),p(f.rank===4,()=>`Error in fused conv2d: filter must be rank 4, but got rank ${f.rank}.`),kt("fused conv2d",r,a);const $=s==="NHWC"?g.shape[3]:g.shape[1];p(f.shape[2]===$,()=>`Error in conv2d: depth of input (${$}) must match input depth for filter ${f.shape[2]}.`),p(Bt(n,o),()=>`Error in conv2D: Either strides or dilations must be 1. Got strides ${n} and dilations '${o}'`);const E=Ze(g.shape,f.shape,n,o,r,a);let v;i!=null&&(v=d(i,"bias","fused conv2d"),[v]=J(v,l),s==="NHWC"?rt(E.outShape,v.shape):(p(v.shape.length<=1,()=>`Error in fused conv2d: only supports scalar or 1-D Tensor bias for NCHW format but got the bias of rank-${v.shape.length}.`),p(v.shape.length===0||v.shape[0]===E.outChannels||v.shape[0]===1,()=>`Error in fused conv2d: bias shape (${v.shape}) is not compatible with the number of output channels (${E.outChannels})`)));let B;if(u!=null){const N=u.shape;if(p(N.length<=1||N.length===3,()=>`Error in fused conv2d: only supports scalar, 1-D Tensor or 3-D Tensor PReLU activation weights but got a tensor of rank-${N.length}.`),N.length===1)p(N[0]===1||N[0]===E.outChannels,()=>`Error in fused conv2d: PReLU activation weights (${N}) is not compatible with the number of output channels (${E.outChannels}).`);else if(N.length===3)try{rt(N,E.outShape)}catch{const M=`Error in fused conv2d: PReLU activation weights (${N}) is not compatible with the output shape of the conv2d (${E.outShape}).`;throw Error(M)}B=d(u,"prelu weights","fused conv2d")}const S=(N,R)=>{p(s==="NHWC",()=>`Error in gradient of fused conv2D: got dataFormat of ${s} but only NHWC is currently supported.`);const[M,x,k,m]=R,I=On(N,k,c);p(Oe(o),()=>`Error in gradient of fused conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '${o}'`);const F=$c(x.shape,I,M,n,r),C=Sw(x,I,M.shape,n,r),O=[F,C];if(m!=null){const q=Ln(m,I);O.push(q)}return O},_={x:g,filter:f,bias:v,preluActivationWeights:B},A={strides:n,pad:r,dataFormat:s,dilations:o,dimRoundingMode:a,activation:c,leakyreluAlpha:h};return i==null?At((R,M,x)=>{let k=w.runKernel(Qn,_,A);return x([M,R,k]),y&&(k=T(k,[k.shape[1],k.shape[2],k.shape[3]])),{value:k,gradFunc:S}})(g,f):At((R,M,x,k)=>{let m=w.runKernel(Qn,_,A);return k([M,R,m,x]),y&&(m=T(m,[m.shape[1],m.shape[2],m.shape[3]])),{value:m,gradFunc:S}})(g,f,v)}const Iw=b({fusedConv2d_:Tw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function _w(e,t,n,r,s,o=[1,1],a){let i=e;e.rank===3&&(i=T(e,[1,e.shape[0],e.shape[1],e.shape[2]]));let c=t;c.rank===3&&(c=T(t,[1,t.shape[0],t.shape[1],t.shape[2]]));const u={x:i,dy:c},h={strides:r,pad:s,dimRoundingMode:a,dilations:o,filterShape:n};return w.runKernel(No,u,h)}const Aw=b({depthwiseConv2dNativeBackpropFilter_:_w});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Dw(e,t,n,r,s,o=[1,1],a){let i=t,c=!1;t.rank===3&&(c=!0,i=T(t,[1,t.shape[0],t.shape[1],t.shape[2]]));const u={dy:i,filter:n},h={strides:r,pad:s,dimRoundingMode:a,dilations:o,inputShape:e},l=w.runKernel(Mo,u,h);return c?T(l,[l.shape[1],l.shape[2],l.shape[3]]):l}const Nw=b({depthwiseConv2dNativeBackpropInput_:Dw});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Mw({x:e,filter:t,strides:n,pad:r,dataFormat:s="NHWC",dilations:o=[1,1],dimRoundingMode:a,bias:i,activation:c="linear",preluActivationWeights:u,leakyreluAlpha:h}){if(qn(w.state.gradientDepth,c)===!1){let A=Cr(e,t,n,r,s,o,a);return i!=null&&(A=P(A,i)),Wn(A,c,u,h)}const l=d(e,"x","depthwiseConv2d","float32"),f=d(t,"filter","depthwiseConv2d","float32");let g=l,y=!1;l.rank===3&&(y=!0,g=T(l,[1,l.shape[0],l.shape[1],l.shape[2]])),p(g.rank===4,()=>`Error in fused depthwiseConv2d: input must be rank 4, but got rank ${g.rank}.`),p(f.rank===4,()=>`Error in fused depthwiseConv2d: filter must be rank 4, but got rank ${f.rank}.`),p(g.shape[3]===f.shape[2],()=>`Error in fused depthwiseConv2d: number of input channels (${g.shape[3]}) must match the inChannels dimension in filter ${f.shape[2]}.`),o==null&&(o=[1,1]),p(Bt(n,o),()=>`Error in fused depthwiseConv2d: Either strides or dilations must be 1. Got strides ${n} and dilations '${o}'`),kt("fused depthwiseConv2d",r,a);const $=Ze(g.shape,f.shape,n,o,r,a,!0);let E;i!=null&&(E=d(i,"bias","fused conv2d"),[E]=J(E,l),rt($.outShape,E.shape));let v;u!=null&&(v=d(u,"prelu weights","fused depthwiseConv2d"));const B=(A,N)=>{p(Oe(o),()=>`Error in gradient of fused depthwiseConv2d: dilation rates greater than 1 are not yet supported. Got dilations '${o}'`);const[R,M,x,k]=N,m=On(A,x,c),I=Nw(M.shape,m,R,n,r,o,a),F=Aw(M,m,R.shape,n,r,o,a);if(k!=null){const C=Ln(E,m);return[I,F,C]}return[I,F]},S={x:g,filter:f,bias:E,preluActivationWeights:v},_={strides:n,pad:r,dataFormat:s,dilations:o,dimRoundingMode:a,activation:c,leakyreluAlpha:h};return i==null?At((N,R,M)=>{let x=w.runKernel(tr,S,_);return M([R,N,x]),y&&(x=T(x,[x.shape[1],x.shape[2],x.shape[3]])),{value:x,gradFunc:B}})(g,f):At((N,R,M,x)=>{let k=w.runKernel(tr,S,_);return x([R,N,k,M]),y&&(k=T(k,[k.shape[1],k.shape[2],k.shape[3]])),{value:k,gradFunc:B}})(g,f,E)}const Fw=b({fusedDepthwiseConv2d_:Mw});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Bw({a:e,b:t,transposeA:n=!1,transposeB:r=!1,bias:s,activation:o="linear",preluActivationWeights:a,leakyreluAlpha:i=.2}){if(qn(w.state.gradientDepth,o)===!1){let m=U(e,t,n,r);return s!=null&&(m=P(m,s)),Wn(m,o,a,i)}let c=d(e,"a","fused matMul"),u=d(t,"b","fused matMul");[c,u]=J(c,u);const h=n?c.shape[c.rank-2]:c.shape[c.rank-1],l=r?u.shape[u.rank-1]:u.shape[u.rank-2],f=n?c.shape[c.rank-1]:c.shape[c.rank-2],g=r?u.shape[u.rank-2]:u.shape[u.rank-1],y=c.shape.slice(0,-2),$=u.shape.slice(0,-2),E=G(y),v=G($);p(h===l,()=>`Error in fused matMul: inner shapes (${h}) and (${l}) of Tensors with shapes ${c.shape} and ${u.shape} and transposeA=${n} and transposeB=${r} must match.`);const S=rt(c.shape.slice(0,-2),u.shape.slice(0,-2)).concat([f,g]),_=n?T(c,[E,h,f]):T(c,[E,f,h]),A=r?T(u,[v,g,l]):T(u,[v,l,g]);let N;s!=null&&(N=d(s,"bias","fused matMul"),[N]=J(N,c),rt(S,N.shape));let R;a!=null&&(R=d(a,"prelu weights","fused matMul"));const M=(m,I)=>{const[F,C,O,q]=I,Z=On(T(m,O.shape),O,o);let st,Q;if(!n&&!r?(st=U(Z,C,!1,!0),Q=U(F,Z,!0,!1)):!n&&r?(st=U(Z,C,!1,!1),Q=U(Z,F,!0,!1)):n&&!r?(st=U(C,Z,!1,!0),Q=U(F,Z,!1,!1)):(st=U(C,Z,!0,!0),Q=U(Z,F,!0,!0)),s!=null){const tt=Ln(q,Z);return[st,Q,tt]}else return[st,Q]},x={a:_,b:A,bias:N,preluActivationWeights:R},k={transposeA:n,transposeB:r,activation:o,leakyreluAlpha:i};return s==null?At((I,F,C)=>{const O=w.runKernel(Jn,x,k);return C([I,F,O]),{value:T(O,S),gradFunc:M}})(_,A):At((I,F,C,O)=>{const q=w.runKernel(Jn,x,k);return O([I,F,q,C]),{value:T(q,S),gradFunc:M}})(_,A,N)}const Rw=b({fusedMatMul_:Bw});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Cw=Object.freeze(Object.defineProperty({__proto__:null,conv2d:Iw,depthwiseConv2d:Fw,matMul:Rw},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Pw(e){return Yr(e,.54,.46)}const Ow=b({hammingWindow_:Pw});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Lw(e){return Yr(e,.5,.5)}const eu=b({hannWindow_:Lw});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Ww(e,t,n,r=!1,s=0){let o=0;const a=[];for(;o+t<=e.size;)a.push(X(e,o,t)),o+=n;if(r)for(;o<e.size;){const i=o+t-e.size,c=gt([X(e,o,t-i),Ye([i],s)]);a.push(c),o+=n}return a.length===0?Ae([],[0,t]):T(gt(a),[a.length,t])}const nu=b({frame_:Ww});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function qw(e,t,n,r,s=eu){r==null&&(r=tu(t));const o=nu(e,t,n),a=D(o,s(t));return Hr(a,r)}const Uw=b({stft_:qw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Gw(e,t,n,r,s="bilinear",o=0){const a=d(e,"image","cropAndResize"),i=d(t,"boxes","cropAndResize","float32"),c=d(n,"boxInd","cropAndResize","int32"),u=i.shape[0];p(a.rank===4,()=>`Error in cropAndResize: image must be rank 4,but got rank ${a.rank}.`),p(i.rank===2&&i.shape[1]===4,()=>`Error in cropAndResize: boxes must be have size [${u},4] but had shape ${i.shape}.`),p(c.rank===1&&c.shape[0]===u,()=>`Error in cropAndResize: boxInd must be have size [${u}] but had shape ${i.shape}.`),p(r.length===2,()=>`Error in cropAndResize: cropSize must be of length 2, but got length ${r.length}.`),p(r[0]>=1&&r[1]>=1,()=>`cropSize must be atleast [1,1], but was ${r}`),p(s==="bilinear"||s==="nearest",()=>`method must be bilinear or nearest, but was ${s}`);const h={image:a,boxes:i,boxInd:c},l={method:s,extrapolationValue:o,cropSize:r};return w.runKernel(Io,h,l)}const zw=b({cropAndResize_:Gw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Kw(e){const t=d(e,"image","flipLeftRight","float32");p(t.rank===4,()=>`Error in flipLeftRight: image must be rank 4,but got rank ${t.rank}.`);const n={image:t};return w.runKernel(Ko,n,{})}const Vw=b({flipLeftRight_:Kw});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Hw(e){const t=d(e,"image","grayscaleToRGB"),n=t.rank-1,r=t.shape[n];p(t.rank>=2,()=>`Error in grayscaleToRGB: images must be at least rank 2, but got rank ${t.rank}.`),p(r===1,()=>`Error in grayscaleToRGB: last dimension of a grayscale image should be size 1, but got size ${r}.`);const s=new Array(t.rank);return s.fill(1,0,n),s[n]=3,_e(t,s)}const jw=b({grayscaleToRGB_:Hw});/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Xw(e){const t=d(e,"image","RGBToGrayscale"),n=t.rank-1,r=t.shape[n];p(t.rank>=2,()=>`Error in RGBToGrayscale: images must be at least rank 2, but got rank ${t.rank}.`),p(r===3,()=>`Error in RGBToGrayscale: last dimension of an RGB image should be size 3, but got size ${r}.`);const s=t.dtype,o=j(t,"float32"),a=Et([.2989,.587,.114]);let i;switch(t.rank){case 2:i=he("ij,j->i",o,a);break;case 3:i=he("ijk,k->ij",o,a);break;case 4:i=he("ijkl,l->ijk",o,a);break;case 5:i=he("ijklm,m->ijkl",o,a);break;case 6:i=he("ijklmn,n->ijklm",o,a);break;default:throw new Error("Not a valid tensor rank.")}return i=Ct(i,-1),j(i,s)}const Zw=b({rgbToGrayscale_:Xw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Yw(e,t,n=0,r=.5){const s=d(e,"image","rotateWithOffset","float32");p(s.rank===4,()=>`Error in rotateWithOffset: image must be rank 4,but got rank ${s.rank}.`);const o={image:s},a={radians:t,fillValue:n,center:r};return w.runKernel(Ri,o,a)}const Jw=b({rotateWithOffset_:Yw});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function xe(e,t,n,r,s,o){r==null&&(r=.5),s==null&&(s=Number.NEGATIVE_INFINITY),o==null&&(o=0);const a=e.shape[0];return n=Math.min(n,a),p(0<=r&&r<=1,()=>`iouThreshold must be in [0, 1], but was '${r}'`),p(e.rank===2,()=>`boxes must be a 2D tensor, but was of rank '${e.rank}'`),p(e.shape[1]===4,()=>`boxes must have 4 columns, but 2nd dimension was ${e.shape[1]}`),p(t.rank===1,()=>"scores must be a 1D tensor"),p(t.shape[0]===a,()=>`scores has incompatible shape with boxes. Expected ${a}, but was ${t.shape[0]}`),p(0<=o&&o<=1,()=>`softNmsSigma must be in [0, 1], but was '${o}'`),{maxOutputSize:n,iouThreshold:r,scoreThreshold:s,softNmsSigma:o}}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Qw(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY){const o=d(e,"boxes","nonMaxSuppression","float32"),a=d(t,"scores","nonMaxSuppression","float32"),i=xe(o,a,n,r,s);n=i.maxOutputSize,r=i.iouThreshold,s=i.scoreThreshold;const c={maxOutputSize:n,iouThreshold:r,scoreThreshold:s};return w.runKernel(_a,{boxes:o,scores:a},c)}const t0=b({nonMaxSuppression_:Qw});/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function e0(e,t,n){const r=n0(e,t,n),s=r<0?-(r+1):r;e.splice(s,0,t)}function n0(e,t,n){return s0(e,t,n||r0)}function r0(e,t){return e>t?1:e<t?-1:0}function s0(e,t,n){let r=0,s=e.length,o=0,a=!1;for(;r<s;){o=r+(s-r>>>1);const i=n(t,e[o]);i>0?r=o+1:(s=o,a=!i)}return a?r:-r-1}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function ru(e,t,n,r,s){return Jr(e,t,n,r,s,0)}function su(e,t,n,r,s,o){return Jr(e,t,n,r,s,0,!1,o,!0)}function ou(e,t,n,r,s,o){return Jr(e,t,n,r,s,o,!0)}function Jr(e,t,n,r,s,o,a=!1,i=!1,c=!1){const u=[];for(let E=0;E<t.length;E++)t[E]>s&&u.push({score:t[E],boxIndex:E,suppressBeginIndex:0});u.sort(Ss);const h=o>0?-.5/o:0,l=[],f=[];for(;l.length<n&&u.length>0;){const E=u.pop(),{score:v,boxIndex:B,suppressBeginIndex:S}=E;if(v<s)break;let _=!1;for(let A=l.length-1;A>=S;--A){const N=o0(e,B,l[A]);if(N>=r){_=!0;break}if(E.score=E.score*a0(r,h,N),E.score<=s)break}E.suppressBeginIndex=l.length,_||(E.score===v?(l.push(B),f.push(E.score)):E.score>s&&e0(u,E,Ss))}const g=l.length,y=n-g;i&&y>0&&(l.push(...new Array(y).fill(0)),f.push(...new Array(y).fill(0)));const $={selectedIndices:l};return a&&($.selectedScores=f),c&&($.validOutputs=g),$}function o0(e,t,n){const r=e.subarray(t*4,t*4+4),s=e.subarray(n*4,n*4+4),o=Math.min(r[0],r[2]),a=Math.min(r[1],r[3]),i=Math.max(r[0],r[2]),c=Math.max(r[1],r[3]),u=Math.min(s[0],s[2]),h=Math.min(s[1],s[3]),l=Math.max(s[0],s[2]),f=Math.max(s[1],s[3]),g=(i-o)*(c-a),y=(l-u)*(f-h);if(g<=0||y<=0)return 0;const $=Math.max(o,u),E=Math.max(a,h),v=Math.min(i,l),B=Math.min(c,f),S=Math.max(v-$,0)*Math.max(B-E,0);return S/(g+y-S)}function a0(e,t,n){const r=Math.exp(t*n*n);return n<=e?r:0}function Ss(e,t){return e.score-t.score||e.score===t.score&&t.boxIndex-e.boxIndex}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function i0(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY){const o=d(e,"boxes","nonMaxSuppressionAsync"),a=d(t,"scores","nonMaxSuppressionAsync"),i=xe(o,a,n,r,s);n=i.maxOutputSize,r=i.iouThreshold,s=i.scoreThreshold;const c=await Promise.all([o.data(),a.data()]),u=c[0],h=c[1],{selectedIndices:l}=ru(u,h,n,r,s);return o!==e&&o.dispose(),a!==t&&a.dispose(),Et(l,"int32")}const c0=i0;/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function u0(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY,o=0){const a=d(e,"boxes","nonMaxSuppression"),i=d(t,"scores","nonMaxSuppression"),c=xe(a,i,n,r,s,o);n=c.maxOutputSize,r=c.iouThreshold,s=c.scoreThreshold,o=c.softNmsSigma;const u={boxes:a,scores:i},h={maxOutputSize:n,iouThreshold:r,scoreThreshold:s,softNmsSigma:o},l=w.runKernel(Da,u,h);return{selectedIndices:l[0],selectedScores:l[1]}}const l0=b({nonMaxSuppressionWithScore_:u0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function h0(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY,o=0){const a=d(e,"boxes","nonMaxSuppressionAsync"),i=d(t,"scores","nonMaxSuppressionAsync"),c=xe(a,i,n,r,s,o);n=c.maxOutputSize,r=c.iouThreshold,s=c.scoreThreshold,o=c.softNmsSigma;const u=await Promise.all([a.data(),i.data()]),h=u[0],l=u[1],{selectedIndices:f,selectedScores:g}=ou(h,l,n,r,s,o);return a!==e&&a.dispose(),i!==t&&i.dispose(),{selectedIndices:Et(f,"int32"),selectedScores:Et(g)}}const f0=h0;/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function d0(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY,o=!1){const a=d(e,"boxes","nonMaxSuppression"),i=d(t,"scores","nonMaxSuppression"),c=xe(a,i,n,r,s,null),u=c.maxOutputSize,h=c.iouThreshold,l=c.scoreThreshold,f={boxes:a,scores:i},g={maxOutputSize:u,iouThreshold:h,scoreThreshold:l,padToMaxOutputSize:o},y=w.runKernel(Aa,f,g);return{selectedIndices:y[0],validOutputs:y[1]}}const p0=b({nonMaxSuppressionPadded_:d0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function g0(e,t,n,r=.5,s=Number.NEGATIVE_INFINITY,o=!1){const a=d(e,"boxes","nonMaxSuppressionAsync"),i=d(t,"scores","nonMaxSuppressionAsync"),c=xe(a,i,n,r,s,null),u=c.maxOutputSize,h=c.iouThreshold,l=c.scoreThreshold,[f,g]=await Promise.all([a.data(),i.data()]),{selectedIndices:y,validOutputs:$}=su(f,g,u,h,l,o);return a!==e&&a.dispose(),i!==t&&i.dispose(),{selectedIndices:Et(y,"int32"),validOutputs:z($,"int32")}}const m0=g0;/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function b0(e,t,n=!1,r=!1){const s=d(e,"images","resizeBilinear");p(s.rank===3||s.rank===4,()=>`Error in resizeBilinear: x must be rank 3 or 4, but got rank ${s.rank}.`),p(t.length===2,()=>`Error in resizeBilinear: new shape must 2D, but got shape ${t}.`),p(r===!1||n===!1,()=>"Error in resizeBilinear: If halfPixelCenters is true, alignCorners must be false.");let o=s,a=!1;s.rank===3&&(a=!0,o=T(s,[1,s.shape[0],s.shape[1],s.shape[2]]));const i={images:o},c={alignCorners:n,halfPixelCenters:r,size:t},u=w.runKernel(Ha,i,c);return a?T(u,[u.shape[1],u.shape[2],u.shape[3]]):u}const w0=b({resizeBilinear_:b0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function y0(e,t,n=!1,r=!1){const s=d(e,"images","resizeNearestNeighbor");p(s.rank===3||s.rank===4,()=>`Error in resizeNearestNeighbor: x must be rank 3 or 4, but got rank ${s.rank}.`),p(t.length===2,()=>`Error in resizeNearestNeighbor: new shape must 2D, but got shape ${t}.`),p(s.dtype==="float32"||s.dtype==="int32",()=>"`images` must have `int32` or `float32` as dtype"),p(r===!1||n===!1,()=>"Error in resizeNearestNeighbor: If halfPixelCenters is true, alignCorners must be false.");let o=s,a=!1;s.rank===3&&(a=!0,o=T(s,[1,s.shape[0],s.shape[1],s.shape[2]]));const i={images:o},c={alignCorners:n,halfPixelCenters:r,size:t},u=w.runKernel(Va,i,c);return a?T(u,[u.shape[1],u.shape[2],u.shape[3]]):u}const $0=b({resizeNearestNeighbor_:y0});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function E0(e,t="binary",n=!1,r=.5){const s=d(e,"image","threshold"),o=.2989,a=.587,i=.114,c=s.shape[0]*s.shape[1];let u=D(Et([r]),255),h,l,f,g;if(p(s.rank===3,()=>`Error in threshold: image must be rank 3,but got rank ${s.rank}.`),p(s.shape[2]===3||s.shape[2]===1,()=>`Error in threshold: image color channel must be equal to 3 or 1but got ${s.shape[2]}.`),p(s.dtype==="int32"||s.dtype==="float32",()=>`Error in dtype: image dtype must be int32 or float32,but got dtype ${s.dtype}.`),p(t==="otsu"||t==="binary",()=>`Method must be binary or otsu, but was ${t}`),s.shape[2]===3){[h,l,f]=Ge(s,[1,1,1],-1);const E=D(h,o),v=D(l,a),B=D(f,i);g=P(P(E,v),B)}else g=e;if(t==="otsu"){const E=yc(j(Vc(g),"int32"),de([]),256);u=k0(E,c)}const y=n?Lr(g,u):Fn(g,u);return j(D(y,255),"int32")}function k0(e,t){let n=Et([-1]),r=Et([0]),s=Et([0]),o,a,i,c,u,h;for(let l=0;l<e.size-1;l++){o=X(e,0,l+1),a=X(e,l+1),u=H(V(o),t),h=H(V(a),t);const f=V(D(o,qe(0,o.size)));i=H(f,V(o));const g=Ye(a.shape,o.size),y=P(qe(0,a.size),g),$=D(a,y);c=H(V($),V(a));const E=W(i,c),v=W(i,c),B=D(u,h);s=D(D(B,E),v);const S=Fn(s,r);r=Ut(S,s,r),n=Ut(S,Et([l]),n)}return n}const x0=b({threshold_:E0});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function v0(e,t,n="nearest",r="constant",s=0,o){const a=d(e,"image","transform","float32"),i=d(t,"transforms","transform","float32");p(a.rank===4,()=>`Error in transform: image must be rank 4,but got rank ${a.rank}.`),p(i.rank===2&&(i.shape[0]===a.shape[0]||i.shape[0]===1)&&i.shape[1]===8,()=>"Error in transform: Input transform should be batch x 8 or 1 x 8"),p(o==null||o.length===2,()=>`Error in transform: outputShape must be [height, width] or null, but got ${o}.`);const c={image:a,transforms:i},u={interpolation:n,fillMode:r,fillValue:s,outputShape:o};return w.runKernel(Ai,c,u)}const S0=b({transform_:v0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function T0(e,t,n){const r=d(e,"a","bandPart");p(r.rank>=2,()=>`bandPart(): Rank must be at least 2, got ${r.rank}.`);const s=r.shape,[o,a]=r.shape.slice(-2);let i,c;typeof t=="number"?(p(t%1===0,()=>`bandPart(): numLower must be an integer, got ${t}.`),p(t<=o,()=>`bandPart(): numLower (${t}) must not be greater than the number of rows (${o}).`),i=d(t<0?o:t,"numLower","bandPart")):(p(t.dtype==="int32",()=>"bandPart(): numLower's dtype must be an int32."),i=Ut(mr(t,0),o,xn(t,o))),typeof n=="number"?(p(n%1===0,()=>`bandPart(): numUpper must be an integer, got ${n}.`),p(n<=a,()=>`bandPart(): numUpper (${n}) must not be greater than the number of columns (${a}).`),c=d(n<0?a:n,"numUpper","bandPart")):(p(n.dtype==="int32",()=>"bandPart(): numUpper's dtype must be an int32."),c=Ut(mr(n,0),a,xn(n,a)));const u=T(qe(0,o,1,"int32"),[-1,1]),h=qe(0,a,1,"int32"),l=W(u,h),f=En(Lr(l,i),Ac(l,It(c))),g=Ee([o,a],r.dtype);return T(ze(Zr(T(r,[-1,o,a])).map(y=>Ut(f,y,g))),s)}const I0=b({bandPart_:T0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function _0(e){let t;if(Array.isArray(e)){t=!1,p(e!=null&&e.length>0,()=>"Gram-Schmidt process: input must not be null, undefined, or empty");const s=e[0].shape[0];for(let o=1;o<e.length;++o)p(e[o].shape[0]===s,()=>`Gram-Schmidt: Non-unique lengths found in the input vectors: (${e[o].shape[0]} vs. ${s})`)}else t=!0,e=Ge(e,e.shape[0],0).map(s=>jr(s,[0]));p(e.length<=e[0].shape[0],()=>`Gram-Schmidt: Number of vectors (${e.length}) exceeds number of dimensions (${e[0].shape[0]}).`);const n=[],r=e;for(let s=0;s<e.length;++s)n.push(w.tidy(()=>{let o=r[s];if(s>0)for(let a=0;a<s;++a){const i=D(V(D(n[a],o)),n[a]);o=W(o,i)}return H(o,Mn(o,"euclidean"))}));return t?ze(n,0):n}const A0=b({gramSchmidt_:_0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function D0(e,t=!1){if(p(e.rank>=2,()=>`qr() requires input tensor to have a rank >= 2, but got rank ${e.rank}`),e.rank===2)return Ts(e,t);{const n=e.shape.slice(0,e.shape.length-2).reduce((c,u)=>c*u),r=Zr(T(e,[n,e.shape[e.shape.length-2],e.shape[e.shape.length-1]]),0),s=[],o=[];r.forEach(c=>{const[u,h]=Ts(c,t);s.push(u),o.push(h)});const a=T(ze(s,0),e.shape),i=T(ze(o,0),e.shape);return[a,i]}}function Ts(e,t=!1){return w.tidy(()=>{p(e.shape.length===2,()=>`qr2d() requires a 2D Tensor, but got a ${e.shape.length}D Tensor.`);const n=e.shape[0],r=e.shape[1];let s=Tc(n),o=te(e);const a=Ae([[1]],[1,1]);let i=te(a);const c=n>=r?r:n;for(let u=0;u<c;++u){const h=o,l=i,f=s;[i,o,s]=w.tidy(()=>{const g=X(o,[u,u],[n-u,1]),y=Mn(g),$=X(o,[u,u],[1,1]),E=Ut(Fn($,0),Ae([[-1]]),Ae([[1]])),v=W($,D(E,y)),B=H(g,v);B.shape[0]===1?i=te(a):i=gt([a,X(B,[1,0],[B.shape[0]-1,B.shape[1]])],0);const S=It(H(U(E,v),y)),_=X(o,[u,0],[n-u,r]),A=D(S,i),N=Sn(i);if(u===0)o=W(_,U(A,U(N,_)));else{const x=W(_,U(A,U(N,_)));o=gt([X(o,[0,0],[u,r]),x],0)}const R=Sn(A),M=X(s,[0,u],[n,s.shape[1]-u]);if(u===0)s=W(M,U(U(M,i),R));else{const x=W(M,U(U(M,i),R));s=gt([X(s,[0,0],[n,u]),x],1)}return[i,o,s]}),ft([h,l,f])}return!t&&n>r&&(s=X(s,[0,0],[n,r]),o=X(o,[0,0],[r,r])),[s,o]})}const N0=b({qr_:D0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var lt;(function(e){e[e.NONE=0]="NONE",e[e.MEAN=1]="MEAN",e[e.SUM=2]="SUM",e[e.SUM_BY_NONZERO_WEIGHTS=3]="SUM_BY_NONZERO_WEIGHTS"})(lt||(lt={}));function M0(e,t,n=lt.SUM_BY_NONZERO_WEIGHTS){const r=d(e,"losses","computeWeightedLoss");let s=null;t!=null&&(s=d(t,"weights","computeWeightedLoss"));const o=s==null?r:D(r,s);if(n===lt.NONE)return o;if(n===lt.SUM)return V(o);if(n===lt.MEAN){if(s==null)return kn(o);{const a=r.size/s.size,i=H(V(o),V(s));return a>1?H(i,z(a)):i}}if(n===lt.SUM_BY_NONZERO_WEIGHTS){if(s==null)return H(V(o),z(r.size));{const a=D(s,Qt(r.shape)),i=j(V(Lc(a,z(0))),"float32");return H(V(o),i)}}throw Error(`Unknown reduction: ${n}`)}const Rt=b({computeWeightedLoss_:M0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function F0(e,t,n,r=lt.SUM_BY_NONZERO_WEIGHTS){const s=d(e,"labels","absoluteDifference"),o=d(t,"predictions","absoluteDifference");let a=null;n!=null&&(a=d(n,"weights","absoluteDifference")),ht(s.shape,o.shape,"Error in absoluteDifference: ");const i=wt(W(s,o));return Rt(i,a,r)}const B0=b({absoluteDifference_:F0});function R0(e,t,n,r,s=lt.SUM_BY_NONZERO_WEIGHTS){const o=d(e,"labels","cosineDistance"),a=d(t,"predictions","cosineDistance");let i=null;r!=null&&(i=d(r,"weights","cosineDistance")),ht(o.shape,a.shape,"Error in cosineDistance: ");const c=z(1),u=W(c,V(D(o,a),n,!0));return Rt(u,i,s)}const C0=b({cosineDistance_:R0});function P0(e,t,n,r=lt.SUM_BY_NONZERO_WEIGHTS){let s=d(e,"labels","hingeLoss");const o=d(t,"predictions","hingeLoss");let a=null;n!=null&&(a=d(n,"weights","hingeLoss")),ht(s.shape,o.shape,"Error in hingeLoss: ");const i=z(1);s=W(D(z(2),s),i);const c=Cn(W(i,D(s,o)));return Rt(c,a,r)}const O0=b({hingeLoss_:P0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function L0(e,t,n,r=1,s=lt.SUM_BY_NONZERO_WEIGHTS){const o=d(e,"labels","huberLoss"),a=d(t,"predictions","huberLoss");let i=null;n!=null&&(i=d(n,"weights","huberLoss")),ht(o.shape,a.shape,"Error in huberLoss: ");const c=z(r),u=wt(W(a,o)),h=xn(u,c),l=W(u,h),f=P(D(z(.5),vt(h)),D(c,l));return Rt(f,i,s)}const W0=b({huberLoss_:L0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function q0(e,t,n,r=1e-7,s=lt.SUM_BY_NONZERO_WEIGHTS){const o=d(e,"labels","logLoss"),a=d(t,"predictions","logLoss");let i=null;n!=null&&(i=d(n,"weights","logLoss")),ht(o.shape,a.shape,"Error in logLoss: ");const c=z(1),u=z(r),h=It(D(o,We(P(a,u)))),l=D(W(c,o),We(P(W(c,a),u))),f=W(h,l);return Rt(f,i,s)}const U0=b({logLoss_:q0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function G0(e,t,n,r=lt.SUM_BY_NONZERO_WEIGHTS){const s=d(e,"labels","meanSquaredError"),o=d(t,"predictions","meanSquaredError");let a=null;n!=null&&(a=d(n,"weights","meanSquaredError")),ht(s.shape,o.shape,"Error in meanSquaredError: ");const i=jc(s,o);return Rt(i,a,r)}const z0=b({meanSquaredError_:G0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function K0(e,t){const n=d(e,"labels","sigmoidCrossEntropyWithLogits"),r=d(t,"logits","sigmoidCrossEntropyWithLogits");ht(n.shape,r.shape,"Error in sigmoidCrossEntropyWithLogits: ");const s=Cn(r),o=D(r,n),a=Nc(oe(It(wt(r))));return P(W(s,o),a)}function V0(e,t,n,r=0,s=lt.SUM_BY_NONZERO_WEIGHTS){let o=d(e,"multiClassLabels","sigmoidCrossEntropy");const a=d(t,"logits","sigmoidCrossEntropy");let i=null;if(n!=null&&(i=d(n,"weights","sigmoidCrossEntropy")),ht(o.shape,a.shape,"Error in sigmoidCrossEntropy: "),r>0){const u=z(r),h=z(1),l=z(.5);o=P(D(o,W(h,u)),D(l,u))}const c=K0(o,a);return Rt(c,i,s)}const H0=b({sigmoidCrossEntropy_:V0});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function j0(e,t,n=-1){if(n===-1&&(n=t.rank-1),n!==t.rank-1)throw Error(`Softmax cross entropy along a non-last dimension is not yet supported. Labels / logits was rank ${t.rank} and dim was ${n}`);return At((s,o,a)=>{const c=Bc(o,[n],!0),u=W(j(o,"float32"),c);a([s,u]);const h=It(D(u,s));return{value:V(h,[n]),gradFunc:(g,y)=>{const[$,E]=y,v=Je(g.shape,[n]);return[D(T(g,v),W(j($,"float32"),oe(E))),D(T(g,v),W(oe(E),j($,"float32")))]}}})(e,t)}function X0(e,t,n,r=0,s=lt.SUM_BY_NONZERO_WEIGHTS){let o=d(e,"onehotLabels","softmaxCrossEntropy");const a=d(t,"logits","softmaxCrossEntropy");let i=null;if(n!=null&&(i=d(n,"weights","softmaxCrossEntropy")),ht(o.shape,a.shape,"Error in softmaxCrossEntropy: "),r>0){const u=z(r),h=z(1),l=z(o.shape[1]);o=P(D(o,W(h,u)),H(u,l))}const c=j0(o,a);return Rt(c,i,s)}const Z0=b({softmaxCrossEntropy_:X0});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Y0(e,t,n,r){const s=d(e,"indices","sparseFillEmptyRows","int32"),o=d(t,"values","sparseFillEmptyRows"),a=d(n,"denseShape","sparseFillEmptyRows","int32"),i=d(r,"defaultValue","sparseFillEmptyRows",o.dtype);if(s.rank!==2)throw new Error(`Indices should be Tensor2D but received shape
        ${s.shape}`);if(o.rank!==1)throw new Error(`Values should be Tensor1D but received shape ${o.shape}`);if(a.rank!==1)throw new Error(`Dense shape should be Tensor1D but received shape ${a.shape}`);if(i.rank!==0)throw new Error(`Default value should be a scalar but received shape ${i.shape}`);const c={indices:s,values:o,denseShape:a,defaultValue:i},u=w.runKernel(pi,c);return{outputIndices:u[0],outputValues:u[1],emptyRowIndicator:u[2],reverseIndexMap:u[3]}}const J0=b({sparseFillEmptyRows_:Y0});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Q0(e,t,n){const r=d(e,"inputIndices","sparseReshape","int32"),s=d(t,"inputShape","sparseReshape","int32"),o=d(n,"newShape","sparseReshape","int32");if(r.rank!==2)throw new Error(`Input indices should be Tensor2D but received shape
        ${r.shape}`);if(s.rank!==1)throw new Error(`Input shape should be Tensor1D but received shape ${s.shape}`);if(o.rank!==1)throw new Error(`New shape should be Tensor1D but received shape ${o.shape}`);const a={inputIndices:r,inputShape:s,newShape:o},i=w.runKernel(gi,a);return{outputIndices:i[0],outputShape:i[1]}}const t1=b({sparseReshape_:Q0});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function e1(e,t,n){const r=d(e,"data","sparseSegmentMean"),s=d(t,"indices","sparseSegmentMean","int32"),o=d(n,"segmentIds","sparseSegmentMean","int32");if(r.rank<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(s.rank!==1)throw new Error(`Indices should be Tensor1D but received shape
          ${s.shape}`);if(o.rank!==1)throw new Error(`Segment ids should be Tensor1D but received shape
          ${o.shape}`);const a={data:r,indices:s,segmentIds:o};return w.runKernel(mi,a)}const n1=b({sparseSegmentMean_:e1});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function r1(e,t,n){const r=d(e,"data","sparseSegmentSum"),s=d(t,"indices","sparseSegmentSum","int32"),o=d(n,"segmentIds","sparseSegmentSum","int32");if(r.rank<1)throw new Error("Data should be at least 1 dimensional but received scalar");if(s.rank!==1)throw new Error(`Indices should be Tensor1D but received shape
         ${s.shape}`);if(o.rank!==1)throw new Error(`Segment ids should be Tensor1D but received shape
         ${o.shape}`);const a={data:r,indices:s,segmentIds:o};return w.runKernel(bi,a)}const s1=b({sparseSegmentSum_:r1});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function o1(e,t,n,r,s,o,a,i){const c=d(e,"data","stringNGrams","string");if(c.dtype!=="string")throw new Error("Data must be of datatype string");if(c.shape.length!==1)throw new Error(`Data must be a vector, saw: ${c.shape}`);const u=d(t,"dataSplits","stringNGrams");if(u.dtype!=="int32")throw new Error("Data splits must be of datatype int32");const h={separator:n,nGramWidths:r,leftPad:s,rightPad:o,padWidth:a,preserveShortSequences:i},l={data:c,dataSplits:u},f=w.runKernel(ki,l,h);return{nGrams:f[0],nGramsSplits:f[1]}}const a1=b({stringNGrams_:o1});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function i1(e,t,n=!0){const r=d(e,"input","stringSplit","string"),s=d(t,"delimiter","stringSplit","string");if(r.rank!==1)throw new Error(`Input should be Tensor1D but received shape ${r.shape}`);if(s.rank!==0)throw new Error(`Delimiter should be a scalar but received shape ${s.shape}`);const o={skipEmpty:n},a={input:r,delimiter:s},i=w.runKernel(xi,a,o);return{indices:i[0],values:i[1],shape:i[2]}}const c1=b({stringSplit_:i1});/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function u1(e,t){const n=d(e,"input","stringToHashBucketFast","string"),r={numBuckets:t};if(t<=0)throw new Error("Number of buckets must be at least 1");const s={input:n};return w.runKernel(vi,s,r)}const l1=b({stringToHashBucketFast_:u1});/**
 * @license
 * Copyright 2023 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function h1(e,t,n,r=!0){const s=d(e,"input","staticRegexReplace","string"),o={pattern:t,rewrite:n,replaceGlobal:r};return w.runKernel($i,{x:s},o)}const f1=b({staticRegexReplace_:h1});/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const d1={fft:Vr,ifft:vn,rfft:Hr,irfft:Hc},p1={hammingWindow:Ow,hannWindow:eu,frame:nu,stft:Uw},g1={flipLeftRight:Vw,grayscaleToRGB:jw,resizeNearestNeighbor:$0,resizeBilinear:w0,rgbToGrayscale:Zw,rotateWithOffset:Jw,cropAndResize:zw,nonMaxSuppression:t0,nonMaxSuppressionAsync:c0,nonMaxSuppressionWithScore:l0,nonMaxSuppressionWithScoreAsync:f0,nonMaxSuppressionPadded:p0,nonMaxSuppressionPaddedAsync:m0,threshold:x0,transform:S0},m1={bandPart:I0,gramSchmidt:A0,qr:N0},b1={absoluteDifference:B0,computeWeightedLoss:Rt,cosineDistance:C0,hingeLoss:O0,huberLoss:W0,logLoss:U0,meanSquaredError:z0,sigmoidCrossEntropy:H0,softmaxCrossEntropy:Z0},w1={sparseFillEmptyRows:J0,sparseReshape:t1,sparseSegmentMean:n1,sparseSegmentSum:s1},y1={stringNGrams:a1,stringSplit:c1,stringToHashBucketFast:l1,staticRegexReplace:f1};/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const $1=new Map,yr=new Map;class au{getClassName(){return this.constructor.className}static fromConfig(t,n){return new t(n)}}class Ot{constructor(){this.classNameMap={}}static getMap(){return Ot.instance==null&&(Ot.instance=new Ot),Ot.instance}static register(t){Ot.getMap().classNameMap[t.className]=[t,t.fromConfig]}}function iu(e,t,n){p(e.className!=null,()=>"Class being registered does not have the static className property defined."),p(typeof e.className=="string",()=>"className is required to be a string, but got type "+typeof e.className),p(e.className.length>0,()=>"Class being registered has an empty-string as its className, which is disallowed."),typeof t>"u"&&(t="Custom"),typeof n>"u"&&(n=e.className);const r=n,s=t+">"+r;return Ot.register(e),$1.set(s,e),yr.set(e,s),e}function E1(e){return yr.has(e)?yr.get(e):e.className}const k1=Object.freeze(Object.defineProperty({__proto__:null,Serializable:au,SerializationMap:Ot,getRegisteredName:E1,registerClass:iu},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class jt extends au{minimize(t,n=!1,r){const{value:s,grads:o}=this.computeGradients(t,r);if(r!=null){const a=r.map(i=>({name:i.name,tensor:o[i.name]}));this.applyGradients(a)}else this.applyGradients(o);return ft(o),n?s:(s.dispose(),null)}get iterations(){return this.iterations_==null&&(this.iterations_=0),this.iterations_}incrementIterations(){this.iterations_=this.iterations+1}computeGradients(t,n){return Mc(t,n)}dispose(){this.iterations_!=null&&ft(this.iterations_)}async saveIterations(){return this.iterations_==null&&(this.iterations_=0),{name:"iter",tensor:z(this.iterations_,"int32")}}async getWeights(){throw new Error("getWeights() is not implemented for this optimizer yet.")}async setWeights(t){throw new Error(`setWeights() is not implemented for this optimizer class ${this.getClassName()}`)}async extractIterations(t){return this.iterations_=(await t[0].tensor.data())[0],t.slice(1)}}Object.defineProperty(jt,Symbol.hasInstance,{value:e=>e.minimize!=null&&e.computeGradients!=null&&e.applyGradients!=null});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Qr extends jt{static get className(){return"Adadelta"}constructor(t,n,r=null){super(),this.learningRate=t,this.rho=n,this.epsilon=r,this.accumulatedGrads=[],this.accumulatedUpdates=[],r==null&&(this.epsilon=w.backend.epsilon())}applyGradients(t){(Array.isArray(t)?t.map(r=>r.name):Object.keys(t)).forEach((r,s)=>{const o=w.registeredVariables[r],a=!1;this.accumulatedGrads[s]==null&&(this.accumulatedGrads[s]={originalName:`${r}/accum_grad`,variable:nt(()=>yt(o).variable(a))}),this.accumulatedUpdates[s]==null&&(this.accumulatedUpdates[s]={originalName:`${r}/accum_var`,variable:nt(()=>yt(o).variable(a))});const i=Array.isArray(t)?t[s].tensor:t[r];if(i==null)return;const c=this.accumulatedGrads[s].variable,u=this.accumulatedUpdates[s].variable;nt(()=>{const h=P(D(c,this.rho),D(vt(i),1-this.rho)),l=D(H(Mt(P(u,this.epsilon)),Mt(P(c,this.epsilon))),i),f=P(D(u,this.rho),D(vt(l),1-this.rho));c.assign(h),u.assign(f);const g=P(D(l,-this.learningRate),o);o.assign(g)})}),this.incrementIterations()}dispose(){this.accumulatedUpdates!=null&&(ft(this.accumulatedGrads.map(t=>t.variable)),ft(this.accumulatedUpdates.map(t=>t.variable)))}async getWeights(){const t=[...this.accumulatedGrads,...this.accumulatedUpdates];return[await this.saveIterations()].concat(t.map(n=>({name:n.originalName,tensor:n.variable})))}async setWeights(t){t=await this.extractIterations(t);const n=t.length/2,r=!1;this.accumulatedGrads=t.slice(0,n).map(s=>({originalName:s.name,variable:s.tensor.variable(r)})),this.accumulatedUpdates=t.slice(n,n*2).map(s=>({originalName:s.name,variable:s.tensor.variable(r)}))}getConfig(){return{learningRate:this.learningRate,rho:this.rho,epsilon:this.epsilon}}static fromConfig(t,n){return new t(n.learningRate,n.rho,n.epsilon)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class ts extends jt{static get className(){return"Adagrad"}constructor(t,n=.1){super(),this.learningRate=t,this.initialAccumulatorValue=n,this.accumulatedGrads=[]}applyGradients(t){(Array.isArray(t)?t.map(r=>r.name):Object.keys(t)).forEach((r,s)=>{const o=w.registeredVariables[r];this.accumulatedGrads[s]==null&&(this.accumulatedGrads[s]={originalName:`${r}/accumulator`,variable:nt(()=>Ye(o.shape,this.initialAccumulatorValue).variable(!1))});const a=Array.isArray(t)?t[s].tensor:t[r];if(a==null)return;const i=this.accumulatedGrads[s].variable;nt(()=>{const c=P(i,vt(a));i.assign(c);const u=P(D(H(a,Mt(P(c,w.backend.epsilon()))),-this.learningRate),o);o.assign(u)})}),this.incrementIterations()}dispose(){this.accumulatedGrads!=null&&ft(this.accumulatedGrads.map(t=>t.variable))}async getWeights(){return[await this.saveIterations()].concat(this.accumulatedGrads.map(t=>({name:t.originalName,tensor:t.variable})))}async setWeights(t){t=await this.extractIterations(t);const n=!1;this.accumulatedGrads=t.map(r=>({originalName:r.name,variable:r.tensor.variable(n)}))}getConfig(){return{learningRate:this.learningRate,initialAccumulatorValue:this.initialAccumulatorValue}}static fromConfig(t,n){return new t(n.learningRate,n.initialAccumulatorValue)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class es extends jt{static get className(){return"Adam"}constructor(t,n,r,s=null){super(),this.learningRate=t,this.beta1=n,this.beta2=r,this.epsilon=s,this.accumulatedFirstMoment=[],this.accumulatedSecondMoment=[],nt(()=>{this.accBeta1=z(n).variable(),this.accBeta2=z(r).variable()}),s==null&&(this.epsilon=w.backend.epsilon())}applyGradients(t){const n=Array.isArray(t)?t.map(r=>r.name):Object.keys(t);nt(()=>{const r=W(1,this.accBeta1),s=W(1,this.accBeta2);n.forEach((o,a)=>{const i=w.registeredVariables[o],c=!1;this.accumulatedFirstMoment[a]==null&&(this.accumulatedFirstMoment[a]={originalName:`${o}/m`,variable:nt(()=>yt(i).variable(c))}),this.accumulatedSecondMoment[a]==null&&(this.accumulatedSecondMoment[a]={originalName:`${o}/v`,variable:nt(()=>yt(i).variable(c))});const u=Array.isArray(t)?t[a].tensor:t[o];if(u==null)return;const h=this.accumulatedFirstMoment[a].variable,l=this.accumulatedSecondMoment[a].variable,f=P(D(h,this.beta1),D(u,1-this.beta1)),g=P(D(l,this.beta2),D(vt(u),1-this.beta2)),y=H(f,r),$=H(g,s);h.assign(f),l.assign(g);const E=P(D(H(y,P(Mt($),this.epsilon)),-this.learningRate),i);i.assign(E)}),this.accBeta1.assign(D(this.accBeta1,this.beta1)),this.accBeta2.assign(D(this.accBeta2,this.beta2))}),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.accBeta2.dispose(),this.accumulatedFirstMoment!=null&&ft(this.accumulatedFirstMoment.map(t=>t.variable)),this.accumulatedSecondMoment!=null&&ft(this.accumulatedSecondMoment.map(t=>t.variable))}async getWeights(){const t=[...this.accumulatedFirstMoment,...this.accumulatedSecondMoment];return[await this.saveIterations()].concat(t.map(n=>({name:n.originalName,tensor:n.variable})))}async setWeights(t){t=await this.extractIterations(t),nt(()=>{this.accBeta1.assign(Le(this.beta1,this.iterations_+1)),this.accBeta2.assign(Le(this.beta2,this.iterations_+1))});const n=t.length/2,r=!1;this.accumulatedFirstMoment=t.slice(0,n).map(s=>({originalName:s.name,variable:s.tensor.variable(r)})),this.accumulatedSecondMoment=t.slice(n,n*2).map(s=>({originalName:s.name,variable:s.tensor.variable(r)}))}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon}}static fromConfig(t,n){return new t(n.learningRate,n.beta1,n.beta2,n.epsilon)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class ns extends jt{static get className(){return"Adamax"}constructor(t,n,r,s=null,o=0){super(),this.learningRate=t,this.beta1=n,this.beta2=r,this.epsilon=s,this.decay=o,this.accumulatedFirstMoment=[],this.accumulatedWeightedInfNorm=[],nt(()=>{this.iteration=z(0).variable(),this.accBeta1=z(n).variable()}),s==null&&(this.epsilon=w.backend.epsilon())}applyGradients(t){const n=Array.isArray(t)?t.map(r=>r.name):Object.keys(t);nt(()=>{const r=W(1,this.accBeta1),s=H(-this.learningRate,P(D(this.iteration,this.decay),1));n.forEach((o,a)=>{const i=w.registeredVariables[o],c=!1;this.accumulatedFirstMoment[a]==null&&(this.accumulatedFirstMoment[a]={originalName:`${o}/m`,variable:yt(i).variable(c)}),this.accumulatedWeightedInfNorm[a]==null&&(this.accumulatedWeightedInfNorm[a]={originalName:`${o}/v`,variable:yt(i).variable(c)});const u=Array.isArray(t)?t[a].tensor:t[o];if(u==null)return;const h=this.accumulatedFirstMoment[a].variable,l=this.accumulatedWeightedInfNorm[a].variable,f=P(D(h,this.beta1),D(u,1-this.beta1)),g=D(l,this.beta2),y=wt(u),$=Oc(g,y);h.assign(f),l.assign($);const E=P(D(H(s,r),H(f,P($,this.epsilon))),i);i.assign(E)}),this.iteration.assign(P(this.iteration,1)),this.accBeta1.assign(D(this.accBeta1,this.beta1))}),this.incrementIterations()}dispose(){this.accBeta1.dispose(),this.iteration.dispose(),this.accumulatedFirstMoment!=null&&ft(this.accumulatedFirstMoment.map(t=>t.variable)),this.accumulatedWeightedInfNorm!=null&&ft(this.accumulatedWeightedInfNorm.map(t=>t.variable))}async getWeights(){throw new Error("getWeights() is not implemented for Adamax yet.")}async setWeights(t){throw new Error("setWeights() is not implemented for Adamax yet.")}getConfig(){return{learningRate:this.learningRate,beta1:this.beta1,beta2:this.beta2,epsilon:this.epsilon,decay:this.decay}}static fromConfig(t,n){return new t(n.learningRate,n.beta1,n.beta2,n.epsilon,n.decay)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Un extends jt{static get className(){return"SGD"}constructor(t){super(),this.learningRate=t,this.setLearningRate(t)}applyGradients(t){(Array.isArray(t)?t.map(r=>r.name):Object.keys(t)).forEach((r,s)=>{const o=Array.isArray(t)?t[s].tensor:t[r];if(o==null)return;const a=w.registeredVariables[r];nt(()=>{const i=P(D(this.c,o),a);a.assign(i)})}),this.incrementIterations()}setLearningRate(t){this.learningRate=t,this.c!=null&&this.c.dispose(),this.c=Ji(z(-t))}dispose(){this.c.dispose()}async getWeights(){return[await this.saveIterations()]}async setWeights(t){if(t=await this.extractIterations(t),t.length!==0)throw new Error("SGD optimizer does not have settable weights.")}getConfig(){return{learningRate:this.learningRate}}static fromConfig(t,n){return new t(n.learningRate)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class rs extends Un{static get className(){return"Momentum"}constructor(t,n,r=!1){super(t),this.learningRate=t,this.momentum=n,this.useNesterov=r,this.accumulations=[],this.m=z(this.momentum)}applyGradients(t){(Array.isArray(t)?t.map(r=>r.name):Object.keys(t)).forEach((r,s)=>{const o=w.registeredVariables[r];this.accumulations[s]==null&&(this.accumulations[s]={originalName:`${r}/momentum`,variable:nt(()=>yt(o).variable(!1))});const a=this.accumulations[s].variable,i=Array.isArray(t)?t[s].tensor:t[r];i!=null&&nt(()=>{let c;const u=P(D(this.m,a),i);this.useNesterov?c=P(D(this.c,P(i,D(u,this.m))),o):c=P(D(this.c,u),o),a.assign(u),o.assign(c)})}),this.incrementIterations()}dispose(){this.m.dispose(),this.accumulations!=null&&ft(this.accumulations.map(t=>t.variable))}setMomentum(t){this.momentum=t}async getWeights(){return[await this.saveIterations()].concat(this.accumulations.map(t=>({name:t.originalName,tensor:t.variable})))}async setWeights(t){t=await this.extractIterations(t);const n=!1;this.accumulations=t.map(r=>({originalName:r.name,variable:r.tensor.variable(n)}))}getConfig(){return{learningRate:this.learningRate,momentum:this.momentum,useNesterov:this.useNesterov}}static fromConfig(t,n){return new t(n.learningRate,n.momentum,n.useNesterov)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class ss extends jt{static get className(){return"RMSProp"}constructor(t,n=.9,r=0,s=null,o=!1){if(super(),this.learningRate=t,this.decay=n,this.momentum=r,this.epsilon=s,this.accumulatedMeanSquares=[],this.accumulatedMoments=[],this.accumulatedMeanGrads=[],this.centered=o,s==null&&(this.epsilon=w.backend.epsilon()),t==null)throw new Error("learningRate for RMSPropOptimizer must be defined.")}applyGradients(t){(Array.isArray(t)?t.map(r=>r.name):Object.keys(t)).forEach((r,s)=>{const o=w.registeredVariables[r],a=!1;this.accumulatedMeanSquares[s]==null&&(this.accumulatedMeanSquares[s]={originalName:`${r}/rms`,variable:nt(()=>yt(o).variable(a))}),this.accumulatedMoments[s]==null&&(this.accumulatedMoments[s]={originalName:`${r}/momentum`,variable:nt(()=>yt(o).variable(a))}),this.accumulatedMeanGrads[s]==null&&this.centered&&(this.accumulatedMeanGrads[s]={originalName:`${r}/mg`,variable:nt(()=>yt(o).variable(a))});const i=Array.isArray(t)?t[s].tensor:t[r];if(i==null)return;const c=this.accumulatedMeanSquares[s].variable,u=this.accumulatedMoments[s].variable;nt(()=>{const h=P(D(c,this.decay),D(vt(i),1-this.decay));if(this.centered){const l=this.accumulatedMeanGrads[s].variable,f=P(D(l,this.decay),D(i,1-this.decay)),g=H(D(i,this.learningRate),Mt(W(h,P(vt(f),this.epsilon)))),y=P(D(u,this.momentum),g);c.assign(h),l.assign(f),u.assign(y);const $=W(o,y);o.assign($)}else{const l=P(D(c,this.decay),D(vt(i),1-this.decay)),f=P(D(u,this.momentum),H(D(i,this.learningRate),Mt(P(l,this.epsilon))));c.assign(l),u.assign(f);const g=W(o,f);o.assign(g)}})}),this.incrementIterations()}dispose(){this.accumulatedMeanSquares!=null&&ft(this.accumulatedMeanSquares.map(t=>t.variable)),this.accumulatedMeanGrads!=null&&this.centered&&ft(this.accumulatedMeanGrads.map(t=>t.variable)),this.accumulatedMoments!=null&&ft(this.accumulatedMoments.map(t=>t.variable))}async getWeights(){const t=[...this.accumulatedMeanSquares,...this.accumulatedMoments];return this.centered&&t.push(...this.accumulatedMeanGrads),[await this.saveIterations()].concat(t.map(n=>({name:n.originalName,tensor:n.variable})))}async setWeights(t){t=await this.extractIterations(t);const n=this.centered?t.length/3:t.length/2,r=!1;this.accumulatedMeanSquares=t.slice(0,n).map(s=>({originalName:s.name,variable:s.tensor.variable(r)})),this.accumulatedMoments=t.slice(n,n*2).map(s=>({originalName:s.name,variable:s.tensor.variable(r)})),this.centered&&(this.accumulatedMeanGrads=t.slice(n*2,n*3).map(s=>({originalName:s.name,variable:s.tensor.variable(r)})))}getConfig(){return{learningRate:this.learningRate,decay:this.decay,momentum:this.momentum,epsilon:this.epsilon,centered:this.centered}}static fromConfig(t,n){return new t(n.learningRate,n.decay,n.momentum,n.epsilon,n.centered)}}/**
 * @license
 * Copyright 2022 Google LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const x1=[Qr,ts,es,ns,rs,ss,Un];function v1(){for(const e of x1)iu(e)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const S1="model",T1=".json",I1=".weights.bin";function Is(e){return new Promise(t=>setTimeout(t)).then(e)}class ie{constructor(t){if(!L().getBool("IS_BROWSER"))throw new Error("browserDownloads() cannot proceed because the current environment is not a browser.");t.startsWith(ie.URL_SCHEME)&&(t=t.slice(ie.URL_SCHEME.length)),(t==null||t.length===0)&&(t=S1),this.modelJsonFileName=t+T1,this.weightDataFileName=t+I1}async save(t){if(typeof document>"u")throw new Error("Browser downloads are not supported in this environment since `document` is not present");const n=St.join(t.weightData),r=window.URL.createObjectURL(new Blob([n],{type:"application/octet-stream"}));if(t.modelTopology instanceof ArrayBuffer)throw new Error("BrowserDownloads.save() does not support saving model topology in binary formats yet.");{const s=[{paths:["./"+this.weightDataFileName],weights:t.weightSpecs}],o=rc(t,s),a=window.URL.createObjectURL(new Blob([JSON.stringify(o)],{type:"application/json"})),i=this.modelJsonAnchor==null?document.createElement("a"):this.modelJsonAnchor;if(i.download=this.modelJsonFileName,i.href=a,await Is(()=>i.dispatchEvent(new MouseEvent("click"))),t.weightData!=null){const c=this.weightDataAnchor==null?document.createElement("a"):this.weightDataAnchor;c.download=this.weightDataFileName,c.href=r,await Is(()=>c.dispatchEvent(new MouseEvent("click")))}return{modelArtifactsInfo:Xe(t)}}}}ie.URL_SCHEME="downloads://";class _1{constructor(t){if(t==null||t.length<1)throw new Error(`When calling browserFiles, at least 1 file is required, but received ${t}`);this.jsonFile=t[0],this.weightsFiles=t.slice(1)}async load(){return new Promise((t,n)=>{const r=new FileReader;r.onload=s=>{const o=JSON.parse(s.target.result),a=o.modelTopology;if(a==null){n(new Error(`modelTopology field is missing from file ${this.jsonFile.name}`));return}if(o.weightsManifest==null){n(new Error(`weightManifest field is missing from file ${this.jsonFile.name}`));return}if(this.weightsFiles.length===0){t({modelTopology:a});return}const c=Br(o,u=>this.loadWeights(u));t(c)},r.onerror=s=>n(`Failed to read model topology and weights manifest JSON from file '${this.jsonFile.name}'. BrowserFiles supports loading Keras-style tf.Model artifacts only.`),r.readAsText(this.jsonFile)})}loadWeights(t){const n=[],r=[];for(const a of t)n.push(...a.weights),r.push(...a.paths);const s=this.checkManifestAndWeightFiles(t),o=r.map(a=>this.loadWeightsFile(a,s[a]));return Promise.all(o).then(a=>[n,a])}loadWeightsFile(t,n){return new Promise((r,s)=>{const o=new FileReader;o.onload=a=>{const i=a.target.result;r(i)},o.onerror=a=>s(`Failed to weights data from file of path '${t}'.`),o.readAsArrayBuffer(n)})}checkManifestAndWeightFiles(t){const n=[],r=this.weightsFiles.map(o=>ms(o.name)),s={};for(const o of t)o.paths.forEach(a=>{const i=ms(a);if(n.indexOf(i)!==-1)throw new Error(`Duplicate file basename found in weights manifest: '${i}'`);if(n.push(i),r.indexOf(i)===-1)throw new Error(`Weight file with basename '${i}' is not provided.`);s[a]=this.weightsFiles[r.indexOf(i)]});if(n.length!==this.weightsFiles.length)throw new Error(`Mismatch in the number of files in weights manifest (${n.length}) and the number of weight files provided (${this.weightsFiles.length}).`);return s}}const A1=e=>L().getBool("IS_BROWSER")&&!Array.isArray(e)&&e.startsWith(ie.URL_SCHEME)?D1(e.slice(ie.URL_SCHEME.length)):null;Y.registerSaveRouter(A1);function D1(e="model"){return new ie(e)}function N1(e){return new _1(e)}/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function _s(e,t,n,r){a(e),n=n??0,r=r??1,i(n,r);let s=0;const o=c=>(c.then(u=>{const h=n+ ++s/e.length*(r-n);return t(h),u}),c);function a(c){p(c!=null&&Array.isArray(c)&&c.length>0,()=>"promises must be a none empty array")}function i(c,u){p(c>=0&&c<=1,()=>`Progress fraction must be in range [0, 1], but got startFraction ${c}`),p(u>=0&&u<=1,()=>`Progress fraction must be in range [0, 1], but got endFraction ${u}`),p(u>=c,()=>`startFraction must be no more than endFraction, but got startFraction ${c} and endFraction ${u}`)}return Promise.all(e.map(o))}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */async function cu(e,t){t==null&&(t={});const n=t.fetchFunc==null?L().platform.fetch:t.fetchFunc,r=e.map(l=>n(l,t.requestInit,{isBinary:!0})),i=(t.onProgress==null?await Promise.all(r):await _s(r,t.onProgress,0,.5)).map(l=>l.arrayBuffer());return t.onProgress==null?await Promise.all(i):await _s(i,t.onProgress,.5,1)}function M1(e,t){var n;const r=t.fetchFunc==null?L().platform.fetch:t.fetchFunc;let s=0,o;return(n=t.onProgress)===null||n===void 0||n.call(t,0),new ReadableStream({pull:async a=>{for(var i;s<e.length;){o||(o=(await r(e[s],t.requestInit,{isBinary:!0})).body.getReader());const{done:c,value:u}=await o.read();if(c){s++,o=void 0,(i=t.onProgress)===null||i===void 0||i.call(t,s/e.length);continue}a.enqueue(u);return}a.close()}})}async function F1(e,t="",n,r){return uu(a=>cu(a,{requestInit:r}))(e,t,n)}function uu(e){return async(t,n="",r)=>{const s=t.map(()=>!1),o={},a=r!=null?r.map(()=>!1):[],i=[];if(t.forEach((g,y)=>{let $=0;g.weights.forEach(E=>{const v="quantization"in E?E.quantization.dtype:E.dtype,B=ee[v]*G(E.shape),S=()=>{s[y]=!0,o[y]==null&&(o[y]=[]),o[y].push({manifestEntry:E,groupOffset:$,sizeBytes:B})};r!=null?r.forEach((_,A)=>{_===E.name&&(S(),a[A]=!0)}):S(),i.push(E.name),$+=B})}),!a.every(g=>g)){const g=r.filter((y,$)=>!a[$]);throw new Error(`Could not find weights in manifest with names: ${g.join(", ")}. 
Manifest JSON has weights with names: ${i.join(", ")}.`)}const c=s.reduce((g,y,$)=>(y&&g.push($),g),[]),u=[];c.forEach(g=>{t[g].paths.forEach(y=>{const $=n+(n.endsWith("/")?"":"/")+y;u.push($)})});const h=await e(u),l={};let f=0;return c.forEach(g=>{const y=t[g].paths.length,$=new St(h.slice(f,f+y));o[g].forEach(v=>{const B=$.slice(v.groupOffset,v.groupOffset+v.sizeBytes),S=ec(B,[v.manifestEntry]);for(const _ in S)l[_]=S[_]}),f+=y}),l}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const B1="application/octet-stream",R1="application/json";class os{constructor(t,n){if(this.DEFAULT_METHOD="POST",n==null&&(n={}),this.weightPathPrefix=n.weightPathPrefix,this.weightUrlConverter=n.weightUrlConverter,n.fetchFunc!=null?(p(typeof n.fetchFunc=="function",()=>"Must pass a function that matches the signature of `fetch` (see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)"),this.fetch=n.fetchFunc):this.fetch=L().platform.fetch,p(t!=null&&t.length>0,()=>"URL path for http must not be null, undefined or empty."),Array.isArray(t)&&p(t.length===2,()=>`URL paths for http must have a length of 2, (actual length is ${t.length}).`),this.path=t,n.requestInit!=null&&n.requestInit.body!=null)throw new Error("requestInit is expected to have no pre-existing body, but has one.");this.requestInit=n.requestInit||{},this.loadOptions=n}async save(t){if(t.modelTopology instanceof ArrayBuffer)throw new Error("BrowserHTTPRequest.save() does not support saving model topology in binary formats yet.");const n=Object.assign({method:this.DEFAULT_METHOD},this.requestInit);n.body=new FormData;const r=[{paths:["./model.weights.bin"],weights:t.weightSpecs}],s=rc(t,r);if(n.body.append("model.json",new Blob([JSON.stringify(s)],{type:R1}),"model.json"),t.weightData!=null){const a=St.join(t.weightData);n.body.append("model.weights.bin",new Blob([a],{type:B1}),"model.weights.bin")}const o=await this.fetch(this.path,n);if(o.ok)return{modelArtifactsInfo:Xe(t),responses:[o]};throw new Error(`BrowserHTTPRequest.save() failed due to HTTP response status ${o.status}.`)}async loadModelJSON(){const t=await this.fetch(this.path,this.requestInit);if(!t.ok)throw new Error(`Request to ${this.path} failed with status code ${t.status}. Please verify this URL points to the model JSON of the model to load.`);let n;try{n=await t.json()}catch{let a=`Failed to parse model JSON of response from ${this.path}.`;throw this.path.endsWith(".pb")?a+=" Your path contains a .pb file extension. Support for .pb models have been removed in TensorFlow.js 1.0 in favor of .json models. You can re-convert your Python TensorFlow model using the TensorFlow.js 1.0 conversion scripts or you can convert your.pb models with the 'pb2json'NPM script in the tensorflow/tfjs-converter repository.":a+=" Please make sure the server is serving valid JSON for this request.",new Error(a)}const r=n.modelTopology,s=n.weightsManifest;if(r==null&&s==null)throw new Error(`The JSON from HTTP path ${this.path} contains neither model topology or manifest for weights.`);return n}async load(){if(this.loadOptions.streamWeights)return this.loadStream();const t=await this.loadModelJSON();return Br(t,n=>this.loadWeights(n))}async loadStream(){const t=await this.loadModelJSON(),n=await this.getWeightUrls(t.weightsManifest),r=ur(t.weightsManifest),s=()=>M1(n,this.loadOptions);return Object.assign(Object.assign({},t),{weightSpecs:r,getWeightStream:s})}async getWeightUrls(t){const n=Array.isArray(this.path)?this.path[1]:this.path,[r,s]=C1(n),o=this.weightPathPrefix||r,a=[],i=[];for(const c of t)for(const u of c.paths)this.weightUrlConverter!=null?i.push(this.weightUrlConverter(u)):a.push(o+u+s);return this.weightUrlConverter&&a.push(...await Promise.all(i)),a}async loadWeights(t){const n=await this.getWeightUrls(t),r=ur(t),s=await cu(n,this.loadOptions);return[r,s]}}os.URL_SCHEME_REGEX=/^https?:\/\//;function C1(e){const t=e.lastIndexOf("/"),n=e.lastIndexOf("?"),r=e.substring(0,t),s=n>t?e.substring(n):"";return[r+"/",s]}function $r(e){return e.match(os.URL_SCHEME_REGEX)!=null}const lu=(e,t)=>{if(typeof fetch>"u"&&(t==null||t.fetchFunc==null))return null;{let n=!0;if(Array.isArray(e)?n=e.every(r=>$r(r)):n=$r(e),n)return as(e,t)}return null};Y.registerSaveRouter(lu);Y.registerLoadRouter(lu);function as(e,t){return new os(e,t)}function P1(e,t){return as(e,t)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Xn{constructor(t){this.modelArtifacts=t}load(){return this.modelArtifacts}}class hu{constructor(t){this.saveHandler=t}save(t){return this.saveHandler(t)}}class O1{constructor(t){t.load&&(this.load=()=>Promise.resolve(t.load())),t.save&&(this.save=n=>Promise.resolve(t.save(n)))}}function L1(e,t,n,r){const s=arguments;return new O1(fu(...s))}function fu(e,t,n,r){return arguments.length===1?e.modelTopology!=null||e.weightSpecs!=null?new Xn(e):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new Xn({modelTopology:e})):(console.warn("Please call tf.io.fromMemory() with only one argument. The argument should be of type ModelArtifacts. The multi-argument signature of tf.io.fromMemory() has been deprecated and will be removed in a future release."),new Xn({modelTopology:e,weightSpecs:t,weightData:n,trainingConfig:r}))}function W1(e){return new hu(e)}function q1(e){return new hu(e)}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const U1=Object.freeze(Object.defineProperty({__proto__:null,CompositeArrayBuffer:St,browserFiles:N1,browserHTTPRequest:P1,concatenateArrayBuffers:Sh,copyModel:Hh,decodeWeights:ec,decodeWeightsStream:Eh,encodeWeights:wh,fromMemory:L1,fromMemorySync:fu,getLoadHandlers:Fh,getModelArtifactsForJSON:Br,getModelArtifactsForJSONSync:sc,getModelArtifactsInfoForJSON:Xe,getSaveHandlers:Mh,getWeightSpecs:ur,http:as,isHTTPScheme:$r,listModels:Kh,loadWeights:F1,moveModel:jh,registerLoadRouter:Nh,registerSaveRouter:Dh,removeModel:Vh,weightsLoaderFactory:uu,withSaveHandler:W1,withSaveHandlerSync:q1},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function G1(e,t,n){const r=d(e,"labels","confusionMatrix"),s=d(t,"predictions","confusionMatrix");p(n==null||n>0&&Number.isInteger(n),()=>`If provided, numClasses must be a positive integer, but got ${n}`),p(r.rank===1,()=>`Expected the rank of labels to be 1, but got ${r.rank}`),p(s.rank===1,()=>`Expected the rank of predictions to be 1, but got ${s.rank}`),p(r.shape[0]===s.shape[0],()=>`Mismatch in the number of examples: ${r.shape[0]} vs. ${s.shape[0]}. Labels and predictions should have the same number of elements.`),p(n>0&&Number.isInteger(n),()=>`numClasses is required to be a positive integer, but got ${n}`);const o=br(j(r,"int32"),n),a=br(j(s,"int32"),n),i=Sn(o),c=U(i,a);return j(c,"int32")}const z1=b({confusionMatrix_:G1});/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const K1=Object.freeze(Object.defineProperty({__proto__:null,confusionMatrix:z1},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */let Xt,As=!1;function du(e,t=3){if(t>4)throw new Error("Cannot construct Tensor with more than 4 channels from pixels.");if(e==null)throw new Error("pixels passed to tf.browser.fromPixels() can not be null");let n=!1,r=!1,s=!1,o=!1,a=!1,i=!1;if(e.data instanceof Uint8Array)n=!0;else if(typeof ImageData<"u"&&e instanceof ImageData)r=!0;else if(typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement)s=!0;else if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement)o=!0;else if(e.getContext!=null)a=!0;else if(typeof ImageBitmap<"u"&&e instanceof ImageBitmap)i=!0;else throw new Error(`pixels passed to tf.browser.fromPixels() must be either an HTMLVideoElement, HTMLImageElement, HTMLCanvasElement, ImageData in browser, or OffscreenCanvas, ImageData in webworker or {data: Uint32Array, width: number, height: number}, but was ${e.constructor.name}`);if(Me(Yn,w.backendName)!=null){const y={pixels:e},$={numChannels:t};return w.runKernel(Yn,y,$)}const[u,h]=s?[e.videoWidth,e.videoHeight]:[e.width,e.height];let l;if(a)l=e.getContext("2d").getImageData(0,0,u,h).data;else if(r||n)l=e.data;else if(o||s||i){if(Xt==null)if(typeof document>"u")if(typeof OffscreenCanvas<"u"&&typeof OffscreenCanvasRenderingContext2D<"u")Xt=new OffscreenCanvas(1,1).getContext("2d");else throw new Error("Cannot parse input in current context. Reason: OffscreenCanvas Context2D rendering is not supported.");else Xt=document.createElement("canvas").getContext("2d",{willReadFrequently:!0});Xt.canvas.width=u,Xt.canvas.height=h,Xt.drawImage(e,0,0,u,h),l=Xt.getImageData(0,0,u,h).data}let f;if(t===4)f=new Int32Array(l);else{const y=u*h;f=new Int32Array(y*t);for(let $=0;$<y;$++)for(let E=0;E<t;++E)f[$*t+E]=l[$*4+E]}return Zc(f,[h,u,t],"int32")}function V1(e){return e!=null&&e.data instanceof Uint8Array}function H1(){return typeof window<"u"&&typeof ImageBitmap<"u"&&window.hasOwnProperty("createImageBitmap")}function j1(e){return e!=null&&e.width!==0&&e.height!==0}function X1(e){return H1()&&!(e instanceof ImageBitmap)&&j1(e)&&!V1(e)}async function Z1(e,t=3){let n=null;if(L().getBool("WRAP_TO_IMAGEBITMAP")&&X1(e)){let r;try{r=await createImageBitmap(e,{premultiplyAlpha:"none"})}catch{r=null}r!=null&&r.width===e.width&&r.height===e.height?n=r:n=e}else n=e;return du(n,t)}function pu(e){if(e.rank!==2&&e.rank!==3)throw new Error(`toPixels only supports rank 2 or 3 tensors, got rank ${e.rank}.`);const t=e.rank===2?1:e.shape[2];if(t>4||t===2)throw new Error(`toPixels only supports depth of size 1, 3 or 4 but got ${t}`);if(e.dtype!=="float32"&&e.dtype!=="int32")throw new Error(`Unsupported type for toPixels: ${e.dtype}. Please use float32 or int32 tensors.`)}function Y1(e){const t=(e==null?void 0:e.alpha)||1;if(t>1||t<0)throw new Error(`Alpha value ${t} is suppoed to be in range [0 - 1].`)}async function J1(e,t){let n=d(e,"img","toPixels");if(!(e instanceof et)){const u=n;n=j(u,"int32"),u.dispose()}pu(n);const[r,s]=n.shape.slice(0,2),o=n.rank===2?1:n.shape[2],a=await n.data(),i=n.dtype==="float32"?255:1,c=new Uint8ClampedArray(s*r*4);for(let u=0;u<r*s;++u){const h=[0,0,0,255];for(let f=0;f<o;f++){const g=a[u*o+f];if(n.dtype==="float32"){if(g<0||g>1)throw new Error(`Tensor values for a float32 Tensor must be in the range [0 - 1] but encountered ${g}.`)}else if(n.dtype==="int32"&&(g<0||g>255))throw new Error(`Tensor values for a int32 Tensor must be in the range [0 - 255] but encountered ${g}.`);o===1?(h[0]=g*i,h[1]=g*i,h[2]=g*i):h[f]=g*i}const l=u*4;c[l+0]=Math.round(h[0]),c[l+1]=Math.round(h[1]),c[l+2]=Math.round(h[2]),c[l+3]=Math.round(h[3])}if(t!=null){As||Me(_r,w.backendName)!=null&&(console.warn("tf.browser.toPixels is not efficient to draw tensor on canvas. Please try tf.browser.draw instead."),As=!0),t.width=s,t.height=r;const u=t.getContext("2d"),h=new ImageData(c,s,r);u.putImageData(h,0,0)}return n!==e&&n.dispose(),c}function Q1(e,t,n){let r=d(e,"img","draw");if(!(e instanceof et)){const a=r;r=j(a,"int32"),a.dispose()}pu(r),Y1(n==null?void 0:n.imageOptions);const s={image:r},o={canvas:t,options:n};w.runKernel(_r,s,o)}const ty=b({fromPixels_:du}),ey=Object.freeze(Object.defineProperty({__proto__:null,draw:Q1,fromPixels:ty,fromPixelsAsync:Z1,toPixels:J1},Symbol.toStringTag,{value:"Module"}));function gu(e,t){const n=e.shape.length,r=t.shape.length;if(n<1)throw new Error(`tf.gatherND() expects the input to be rank 1 or higher, but the rank was ${n}.`);if(r<1)throw new Error(`tf.gatherND() expects the indices to be rank 1 or higher, but the rank was ${r}.`);if(t.dtype!=="int32")throw new Error(`tf.gatherND() expects the indices to be int32 type, but the dtype was ${t.dtype}.`);if(t.shape[r-1]>n)throw new Error(`index innermost dimension length must be <= tensor rank; saw: ${t.shape[r-1]} vs. ${n}`);if(G(e.shape)===0)throw new Error(`Requested more than 0 entries, but input is empty. Input shape: ${e.shape}.`);const s=t.shape,o=s[s.length-1];let a=1;for(let l=0;l<s.length-1;++l)a*=s[l];const i=e.shape,c=s.slice();c.pop();let u=1;for(let l=o;l<n;++l)u*=i[l],c.push(i[l]);const h=[...ke(e.shape).map(l=>l/u),1].slice(0,o);return[c,a,u,h]}const ny=Object.freeze(Object.defineProperty({__proto__:null,prepareAndValidate:gu},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Er=-2,ry=-1;function sy(e,t,n){const r=e.shape.length;p(r===t.length,()=>`Error in slice${r}D: Length of begin ${t} must match the rank of the array (${r}).`),p(r===n.length,()=>`Error in slice${r}D: Length of size ${n} must match the rank of the array (${r}).`);for(let s=0;s<r;++s)p(t[s]+n[s]<=e.shape[s],()=>`Error in slice${r}D: begin[${s}] + size[${s}] (${t[s]+n[s]}) would overflow input.shape[${s}] (${e.shape[s]})`)}function oy(e){const t=[];let n=0;for(;e>0;)e&1&&t.push(n),e/=2,n++;return t}function ay(e,t,n){const r=[];for(let s=0;s<e.length;s++)r[s]=Math.ceil((t[s]-e[s])/n[s]);return r}function mu(e,t,n,r){const s=[...e];for(let o=s.length;o<r.length;o++)s.push(1);for(let o=0;o<n;o++)o===0?s[t]=1:(s.splice(t,0,1),s.pop());return s}function bu(e,t,n){return n<=e?n:n-(t-1)}function wu(e,t){const n=[];for(let r=0;r<e;r++)n.push(t+r);return n}function iy(e,t,n,r,s,o,a,i,c){const u=e.length;let h=new Array(u),l=new Array(u),f=new Array(u);if(t.length&&n>0){const g=t[0],y=n+1;h=yu(a,g,y,r,e),l=$u(i,g,y,s,e),f=mu(o,g,y,e)}else for(let g=0;g<u;g++)h[g]=ku(a,r,o,e,g,c),l[g]=xu(i,s,o,e,g,c),f[g]=Eu(o,g,c);return{begin:h,end:l,strides:f}}function yu(e,t,n,r,s){const o=[...s],a=wu(n,t);for(let i=0;i<o.length;i++)if(a.indexOf(i)>-1)o[i]=0;else{const c=bu(t,n,i);let u=r[c];e&1<<c&&(u=0),o[i]=u}return o}function $u(e,t,n,r,s){const o=[...s],a=wu(n,t);for(let i=0;i<o.length;i++)if(a.indexOf(i)>-1)o[i]=Number.MAX_SAFE_INTEGER;else{const c=bu(t,n,i);let u=r[c];e&1<<c&&(u=Number.MAX_SAFE_INTEGER),o[i]=u}for(let i=0;i<o.length;i++){const c=s[i];o[i]<0&&(o[i]+=c),o[i]=De(0,o[i],s[i])}return o}function Eu(e,t,n){let r=e[t];return(n&1<<t||r==null)&&(r=1),r}function ku(e,t,n,r,s,o){let a=t[s];const i=n[s]||1;(e&1<<s||o&1<<s||a==null)&&(i>0?a=Number.MIN_SAFE_INTEGER:a=Number.MAX_SAFE_INTEGER);const c=r[s];return a<0&&(a+=c),a=De(0,a,c-1),a}function xu(e,t,n,r,s,o){let a=t[s];const i=n[s]||1;(e&1<<s||o&1<<s||a==null)&&(i>0?a=Number.MAX_SAFE_INTEGER:a=Number.MIN_SAFE_INTEGER);const c=r[s];return a<0&&(a+=c),i>0?a=De(0,a,c):a=De(-1,a,c-1),a}function cy(e,t,n){let r=n.length;for(let s=0;s<n.length;s++)if(n[s]>1){r=s;break}for(let s=r+1;s<n.length;s++)if(t[s]>0||n[s]!==e[s])return!1;return!0}function uy(e,t){let n=e.length>0?e[e.length-1]:1;for(let r=0;r<e.length-1;r++)n+=e[r]*t[r];return n}function ly(e,t,n){let r;const s=e.shape.length;typeof t=="number"?r=[t,...new Array(s-1).fill(0)]:t.length<s?r=t.concat(new Array(s-t.length).fill(0)):r=t.slice(),r.forEach(a=>{p(a!==-1,()=>"slice() does not support negative begin indexing.")});let o;return n==null?o=new Array(s).fill(-1):typeof n=="number"?o=[n,...new Array(s-1).fill(-1)]:n.length<s?o=n.concat(new Array(s-n.length).fill(-1)):o=n,o=o.map((a,i)=>a>=0?a:(p(a===-1,()=>`Negative size values should be exactly -1 but got ${a} for the slice() size at index ${i}.`),e.shape[i]-r[i])),[r,o]}function hy(e,t,n,r,s,o,a,i,c){let u;if(r==null?(u=new Array(t.length),u.fill(1)):u=r,a!=null&&(a&a-1)!==0)throw new Error("Multiple ellipses in slice is not allowed.");let h=!1;const l={dims:u.length,numAddAxisAfterEllipsis:0,begin:t.slice(),end:n.slice(),strides:u.slice(),beginMask:s,endMask:o,ellipsisMask:a,newAxisMask:i,shrinkAxisMask:c};for(let S=0;S<l.dims;S++)h&&(1<<S&i)!==0&&l.numAddAxisAfterEllipsis++,1<<S&a&&(h=!0);h||(l.ellipsisMask|=1<<l.dims,l.dims++);const f={dims:e.length,beginMask:0,endMask:0,beginValid:!1,endValid:!1};fy(l,f);let g=!0,y=!0,$=!0;const E=[],v=[];for(let S=0;S<e.length;++S){if(f.strides[S]===0)throw Error(`strides[${S}] must be non-zero`);const _=!!(f.shrinkAxisMask&1<<S),A=e[S];if(A===-1){E.push(_?1:-1);continue}const N=[f.beginMask&1<<S,f.endMask&1<<S],R=[f.strides[S]>0?0:-1,f.strides[S]>0?A:A-1];if(_&&f.strides[S]<=0)throw Error("only stride 1 allowed on non-range indexing.");$=$&&f.strides[S]===1;const M=!!(f.beginMask&1<<S&&f.endMask&1<<S);if(f.beginValid&&f.endValid){if(_){const I=f.begin[S]<0?A+f.begin[S]:f.begin[S];if(f.begin[S]=I,f.end[S]=f.begin[S]+1,I<0||I>=A)throw Error(`slice index ${f.begin[S]} of dimension ${S} out of bounds.`)}else f.begin[S]=Ds(f.begin[S],0,f.strides[S],A,N,R),f.end[S]=Ds(f.end[S],1,f.strides[S],A,N,R);const m=f.strides[S]===1&&f.begin[S]===0&&f.end[S]===A;g=g&&m,y=y&&(S===0&&f.strides[S]===1||m)}else g=g&&f.strides[S]===1&&M,y=y&&(S===0&&f.strides[S]===1||M);let x,k=!1;if(f.beginValid&&f.endValid?(x=f.end[S]-f.begin[S],k=!0):_?(x=1,k=!0):M&&A>=0&&(f.strides[S]<0?x=-A:x=A,k=!0),k){let m;x===0||x<0!=f.strides[S]<0?m=0:m=Math.trunc(x/f.strides[S])+(x%f.strides[S]!==0?1:0),E.push(m)}else E.push(-1)}for(let S=0;S<f.finalShapeGatherIndices.length;++S){const _=f.finalShapeGatherIndices[S];_>=0?v.push(E[_]):_===Er&&v.push(1)}return{finalShapeSparse:v.filter((S,_)=>f.finalShapeGatherIndices[_]!==Er),finalShape:v,isIdentity:g,sliceDim0:y,isSimpleSlice:$,begin:f.begin,end:f.end,strides:f.strides}}function fy(e,t){t.beginMask=0,t.endMask=0,t.shrinkAxisMask=0;let n=0;t.beginValid=e.begin!=null,t.endValid=e.end!=null,t.begin=new Array(t.dims),t.end=new Array(t.dims),t.strides=new Array(t.dims),t.finalShapeGatherIndices=[],t.finalShapeGatherIndicesSparse=[],t.inputShapeGatherIndicesSparse=new Array(t.dims);for(let r=0;r<e.dims;r++)if(1<<r&e.ellipsisMask){const s=Math.min(t.dims-(e.dims-r)+1+e.numAddAxisAfterEllipsis,t.dims);for(;n<s;n++)t.begin[n]=0,t.end[n]=0,t.strides[n]=1,t.beginMask|=1<<n,t.endMask|=1<<n,t.finalShapeGatherIndices.push(n),t.finalShapeGatherIndicesSparse.push(-1),t.inputShapeGatherIndicesSparse[n]=r}else if(1<<r&e.newAxisMask)t.finalShapeGatherIndices.push(Er),t.finalShapeGatherIndicesSparse.push(-1);else{if(n===t.begin.length)throw Error(`Index out of range using input dim ${n}; input has only ${t.dims} dims, ${t.begin.length}.`);e.begin!=null&&(t.begin[n]=e.begin[r]),e.end!=null&&(t.end[n]=e.end[r]),t.strides[n]=e.strides[r],e.beginMask&1<<r&&(t.beginMask|=1<<n),e.endMask&1<<r&&(t.endMask|=1<<n),e.shrinkAxisMask&1<<r?(t.finalShapeGatherIndices.push(ry),t.finalShapeGatherIndicesSparse.push(-1),t.shrinkAxisMask|=1<<n):(t.finalShapeGatherIndices.push(n),t.finalShapeGatherIndicesSparse.push(r)),t.inputShapeGatherIndicesSparse[n]=r,n++}}function Ds(e,t,n,r,s,o){if(s[t])return n>0?o[t]:o[t+1&1];{const a=e<0?r+e:e;return a<o[0]?o[0]:a>o[1]?o[1]:a}}const vu=Object.freeze(Object.defineProperty({__proto__:null,assertParamsValid:sy,computeFlatOffset:uy,computeOutShape:ay,getNormalizedAxes:iy,isSliceContinous:cy,maskToAxes:oy,parseSliceParams:ly,sliceInfo:hy,startForAxis:ku,startIndicesWithElidedDims:yu,stopForAxis:xu,stopIndicesWithElidedDims:$u,stridesForAxis:Eu,stridesWithElidedDims:mu},Symbol.toStringTag,{value:"Module"}));/** @license See the LICENSE file. */const dy="4.22.0";/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */class Su{static sgd(t){return new Un(t)}static momentum(t,n,r=!1){return new rs(t,n,r)}static rmsprop(t,n=.9,r=0,s=null,o=!1){return new ss(t,n,r,s,o)}static adam(t=.001,n=.9,r=.999,s=null){return new es(t,n,r,s)}static adadelta(t=.001,n=.95,r=null){return new Qr(t,n,r)}static adamax(t=.002,n=.9,r=.999,s=null,o=0){return new ns(t,n,r,s,o)}static adagrad(t,n=.1){return new ts(t,n)}}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const py=Su;/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const gy=typeof requestAnimationFrame<"u"?requestAnimationFrame:typeof setImmediate<"u"?setImmediate:e=>e();function my(){return new Promise(e=>gy(()=>e()))}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function by(e,t){const n=e[0].length;e.forEach((s,o)=>{p(s.length===n,()=>`Error in concat${n}D: rank of tensors[${o}] must be the same as the rank of the rest (${n})`)}),p(t>=0&&t<n,()=>`Error in concat${n}D: axis must be between 0 and ${n-1}.`);const r=e[0];e.forEach((s,o)=>{for(let a=0;a<n;a++)p(a===t||s[a]===r[a],()=>`Error in concat${n}D: Shape of tensors[${o}] (${s}) does not match the shape of the rest (${r}) along the non-concatenated axis ${o}.`)})}function wy(e,t){const n=e[0].slice();for(let r=1;r<e.length;r++)n[t]+=e[r][t];return n}/**
 * @license
 * Copyright 2022 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */var Tt;(function(e){e[e.FIRST_DIM_SIZE=0]="FIRST_DIM_SIZE",e[e.VALUE_ROWIDS=1]="VALUE_ROWIDS",e[e.ROW_LENGTHS=2]="ROW_LENGTHS",e[e.ROW_SPLITS=3]="ROW_SPLITS",e[e.ROW_LIMITS=4]="ROW_LIMITS",e[e.ROW_STARTS=5]="ROW_STARTS"})(Tt||(Tt={}));function yy(e,t,n){let r=new Array;if(n==null&&t==null)return r;if(t==null)for(;r.length<e+n.length;)r.push(-1);else r=t.slice();if(n==null)return r;if(e+n.length!==r.length)throw new Error(`rt input.shape and shape=${t} are incompatible: rt input.rank = ${e+n.length}, but shape.rank = ${r.length}`);for(let s=1;s<n.length;++s){const o=n[s],a=r[r.length-n.length+s],i=r[a];if(o>=0)if(i>=0){if(i!==o)throw new Error(`rt input.shape and shape=${t} are incompatible: rt input.shape[${s+e}] = ${o} but shape[${s+e}] = ${i}`)}else r[a]=o}return r}function $y(e){const t={FIRST_DIM_SIZE:Tt.FIRST_DIM_SIZE,VALUE_ROWIDS:Tt.VALUE_ROWIDS,ROW_LENGTHS:Tt.ROW_LENGTHS,ROW_SPLITS:Tt.ROW_SPLITS,ROW_LIMITS:Tt.ROW_LIMITS,ROW_STARTS:Tt.ROW_STARTS},n=[];for(const r of e)if(r in t)n.push(t[r]);else break;return n}function Ey(e){return e.length===0?0:e[0]===Tt.FIRST_DIM_SIZE?e.length-1:e.length}function ky(e,t){if(e==null||t==null)return;const n=e.length,r=t.length;if(n>=r)throw new Error(`defaultValue.shape=${e} and ragged tensor flatValues.shape=${t}, are incompatible: defaultValue.rank = ${n} must be less than ragged tensor input flatValues.rank = ${r})`);for(let s=0;s<Math.min(n,r-1);++s){const o=e[s],a=t[s+1];if(o>=0&&a>=0&&o!==1&&o!==a)throw new Error(`defaultValue.shape=${e}, and ragged tensor input flatValues.shape=${t} are incompatible: defaultValue.shape[${s-e.length}] = ${o} but ragged tensor input.flatValues.shape[${s-e.length}] = ${a}`)}}/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const is=30;function xy(e){return e<=is?e:bn(e,Math.floor(Math.sqrt(e)))}/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function vy(e,t,n){const r=n*(typeof e=="number"?e:e[0]),s=t*(typeof e=="number"?e:e[1]);return[r,s]}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Sy(e,t,n,r=!0){let s=[];if(r)s=s.concat(t.slice(0)),s.push(e[0]/n),s=s.concat(e.slice(1));else{s=s.concat(e[0]);const o=t.length;for(let a=0;a<o;++a)s=s.concat([e[a+1]/t[a],t[a]]);s=s.concat(e.slice(o+1))}return s}function Ty(e,t,n=!0){const r=[];if(n){r.push(t);for(let s=t+1;s<e;++s)s<=2*t?(r.push(s),r.push(s-(t+1))):r.push(s)}else{const s=[],o=[];for(let a=1;a<e;++a)a>=t*2+1||a%2===1?o.push(a):s.push(a);r.push(...s),r.push(0),r.push(...o)}return r}function Iy(e,t,n,r=!0){const s=[];r?s.push(e[0]/n):s.push(e[0]*n);for(let o=1;o<e.length;++o)o<=t.length?r?s.push(t[o-1]*e[o]):s.push(e[o]/t[o-1]):s.push(e[o]);return s}function _y(e,t){const n=[0];for(let r=0;r<t;++r)n.push(e[r][0]);return n}function Ay(e,t,n){const r=e.slice(0,1);for(let s=0;s<n;++s)r.push(e[s+1]-t[s][0]-t[s][1]);return r}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Dy=1.7580993408473768,Ny=1.0507009873554805;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const My=.3275911,Fy=.254829592,By=-.284496736,Ry=1.421413741,Cy=-1.453152027,Py=1.061405429;/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function Oy(e,t){if(e.length!==t.length)throw new Error(`Cannot merge real and imag arrays of different lengths. real:${e.length}, imag: ${t.length}.`);const n=new Float32Array(e.length*2);for(let r=0;r<n.length;r+=2)n[r]=e[r/2],n[r+1]=t[r/2];return n}function Ly(e){const t=new Float32Array(e.length/2),n=new Float32Array(e.length/2);for(let r=0;r<e.length;r+=2)t[r/2]=e[r],n[r/2]=e[r+1];return{real:t,imag:n}}function Wy(e){const t=Math.ceil(e.length/4),n=new Float32Array(t),r=new Float32Array(t);for(let s=0;s<e.length;s+=4)n[Math.floor(s/4)]=e[s],r[Math.floor(s/4)]=e[s+1];return{real:n,imag:r}}function qy(e){const t=Math.floor(e.length/4),n=new Float32Array(t),r=new Float32Array(t);for(let s=2;s<e.length;s+=4)n[Math.floor(s/4)]=e[s],r[Math.floor(s/4)]=e[s+1];return{real:n,imag:r}}function Uy(e,t){const n=e[t*2],r=e[t*2+1];return{real:n,imag:r}}function Gy(e,t,n,r){e[r*2]=t,e[r*2+1]=n}function zy(e,t){const n=new Float32Array(e/2),r=new Float32Array(e/2);for(let s=0;s<Math.ceil(e/2);s++){const o=(t?2:-2)*Math.PI*(s/e);n[s]=Math.cos(o),r[s]=Math.sin(o)}return{real:n,imag:r}}function Ky(e,t,n){const r=(n?2:-2)*Math.PI*(e/t),s=Math.cos(r),o=Math.sin(r);return{real:s,imag:o}}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const Zn="->",Vy=/->/g,Ns=",",Ms="...";function Hy(e,t){e=e.replace(/\s/g,"");const n=(e.length-e.replace(Vy,"").length)/Zn.length;if(n<1)throw new Error("Equations without an arrow are not supported.");if(n>1)throw new Error(`Equation must contain exactly one arrow ("${Zn}").`);const[r,s]=e.split(Zn);p(r.indexOf(Ms)===-1,()=>`The ellipsis notation ("${Ms}") is not supported yet.`);const o=r.split(Ns),a=o.length;if(t!==a)throw new Error(`Expected ${a} input tensors, received ${t}`);if(a>2)throw new Error("Support for more than 2 input tensors is not implemented yet.");const i=[];for(let f=0;f<s.length;++f){const g=s[f];if(!o.some(y=>y.indexOf(g)!==-1))throw new Error(`Output subscripts contain the label ${g} not present in the input subscripts.`);i.indexOf(g)===-1&&i.push(g)}for(let f=0;f<r.length;++f){const g=r[f];i.indexOf(g)===-1&&g!==Ns&&i.push(g)}const c=new Array(o.length);for(let f=0;f<a;++f){if(new Set(o[f].split("")).size!==o[f].length)throw new Error(`Found duplicate axes in input component ${o[f]}. Support for duplicate axes in input is not implemented yet.`);c[f]=[];for(let g=0;g<o[f].length;++g)c[f].push(i.indexOf(o[f][g]))}const u=i.length,h=s.length,l=[];for(let f=h;f<u;++f)l.push(f);return{allDims:i,summedDims:l,idDims:c}}function jy(e,t){let n=new Array(e);n.fill(-1);for(let s=0;s<t.length;++s)n[t[s]]=s;const r=[];for(let s=0;s<e;++s)n[s]===-1&&r.push(s);return n=n.filter(s=>s!==-1),{permutationIndices:n,expandDims:r}}function Xy(e,t,n){const r=new Array(e);for(let s=0;s<n.length;++s){const o=n[s].shape;for(let a=0;a<t[s].length;++a)r[t[s][a]]===void 0?r[t[s][a]]=o[a]:p(r[t[s][a]]===o[a],()=>`Expected dimension ${r[t[s][a]]} at axis ${a} of input shaped ${JSON.stringify(o)}, but got dimension ${o[a]}`)}}function Zy(e,t){const n=e,r=[];let s=0;e.length===0&&n.push(-1),s=e.length+1;for(let a=0;a<s;++a)r.push([]);const o=[];for(let a=0;a<n.length;++a){const i=n[a],c=Jy(t,i);for(const u of c)o.indexOf(u)===-1&&(r[a].push(u),o.push(u))}return{path:n,steps:r}}function Yy(e){return e.every((t,n)=>t===n)}function Jy(e,t){const n=[];for(let r=0;r<e.length;++r)(e[r].length===0||e[r].indexOf(t)!==-1||t===-1)&&n.push(r);return n}function Qy(e,t,n=0){let r=[];if(typeof t=="number")p(e.shape[n]%t===0,()=>"Number of splits must evenly divide the axis."),r=new Array(t).fill(e.shape[n]/t);else{const s=t.reduce((a,i)=>(i===-1&&(a+=1),a),0);p(s<=1,()=>"There should be only one negative value in split array.");const o=t.indexOf(-1);if(o!==-1){const a=t.reduce((i,c)=>c>0?i+c:i);t[o]=e.shape[n]-a}p(e.shape[n]===t.reduce((a,i)=>a+i),()=>"The sum of sizes must match the size of the axis dimension."),r=t}return r}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function t$(e){return`Received SparseTensor with denseShape[0] = 0 but
  indices.shape[0] = ${e}`}function e$(e,t){return`indices(${e}, 0) is invalid: ${t} < 0`}function n$(e,t,n){return`indices(${e}, 0) is invalid: ${t} >= ${n}`}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function r$(e,t){return`only one output dimension may be -1, not both ${e} and ${t}`}function s$(e,t){return`size ${e} must be non-negative, not ${t}`}function o$(){return"reshape cannot infer the missing input size for an empty tensor unless all specified input sizes are non-zero"}function a$(e,t){const n=G(e),r=G(t);return`Input to reshape is a SparseTensor with ${n}
  dense values, but the requested shape requires a multiple of ${r}. inputShape=${e} outputShape= ${t}`}function i$(e,t){const n=G(e),r=G(t);return`Input to reshape is a tensor with ${n} dense values, but the requested shape has ${r}. inputShape=${e} outputShape=${t}`}/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function c$(){return"segment ids must be >= 0"}function u$(){return"segment ids are not increasing"}function l$(e,t){return`Segment id ${e} out of range [0, ${t}), possibly because segmentIds input is not sorted.`}function h$(e,t,n){return`Bad: indices[${e}] == ${t} out of range [0, ${n})`}/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function f$(e,t){let n=!1,r;for(e<=is?(r=e,n=!0):r=bn(e,Math.floor(Math.sqrt(e)));!n;)r>t||r===e?n=!0:r=bn(e,r+1);return r}function d$(e,t,n){const r=[],s=e.length;for(let o=0;o<s;o++)o!==t?r.push(e[o]):r.push(n);return r}function p$(e,t,n,r){const s=t.shape.length,o=e.shape.length;if(r!==0&&(r<-s||r>s))throw new Error(`Expect batchDims in the range of [-${s}, ${s}], but got ${r}`);if(r<0&&(r+=s),r>o)throw new Error(`batchDims (${r}) must be less than rank(x) (
    ${o}).`);if(n<r)throw new Error(`batchDims (${r}) must be less than or equal to axis (${n}).`);for(let l=0;l<r;++l)if(e.shape[l]!==t.shape[l])throw new Error(`x.shape[${l}]: ${e.shape[l]} should be equal to indices.shape[${l}]: ${t.shape[l]}.`);const a=e.shape[n],i=[];let c=1,u=1,h=1;for(let l=0;l<r;++l)i.push(e.shape[l]),c*=e.shape[l];for(let l=r;l<n;l++)i.push(e.shape[l]),u*=e.shape[l];for(let l=r;l<s;l++)i.push(t.shape[l]);for(let l=n+1;l<o;l++)i.push(e.shape[l]),h*=e.shape[l];return{batchSize:c,sliceSize:h,outerSize:u,dimSize:a,outputShape:i}}const g$=Object.freeze(Object.defineProperty({__proto__:null,collectGatherOpShapeInfo:p$,computeOutShape:d$,segOpComputeOptimalWindowSize:f$},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */function m$(e){try{return e.map(t=>yn(t))}catch(t){throw new Error(`Failed to decode encoded string bytes into utf-8, error: ${t}`)}}function b$(e){return e.map(t=>je(t))}const w$=Object.freeze(Object.defineProperty({__proto__:null,ERF_A1:Fy,ERF_A2:By,ERF_A3:Ry,ERF_A4:Cy,ERF_A5:Py,ERF_P:My,PARALLELIZE_THRESHOLD:is,get RowPartitionType(){return Tt},SELU_SCALE:Ny,SELU_SCALEALPHA:Dy,applyActivation:Wn,assertAndGetBroadcastShape:rt,assertAxesAreInnerMostDims:hp,assertParamsConsistent:by,assignToTypedArray:Gy,axesAreInnerMostDims:Or,calculateShapes:Yc,checkEinsumDimSizes:Xy,checkPadOnDimRoundingMode:kt,combineLocations:vc,combineRaggedTensorToTensorShapes:yy,complexWithEvenIndex:Wy,complexWithOddIndex:qy,computeConv2DInfo:Ze,computeConv3DInfo:gc,computeDefaultPad:Rr,computeDilation2DInfo:Nf,computeOptimalWindowSize:xy,computeOutAndReduceShapes:lp,computeOutShape:wy,computePool2DInfo:pc,computePool3DInfo:Mf,convertConv2DDataFormat:mc,decodeEinsumEquation:Hy,eitherStridesOrDilationsAreOne:Bt,expandShapeToKeepDim:Je,exponent:Ky,exponents:zy,fromStringArrayToUint8:b$,fromUint8ToStringArray:m$,getAxesPermutation:fp,getBroadcastDims:Ec,getComplexWithIndex:Uy,getEinsumComputePath:Zy,getEinsumPermutation:jy,getFusedBiasGradient:Ln,getFusedDyActivation:On,getImageCenter:vy,getInnerMostAxes:pp,getPermuted:Ty,getRaggedRank:Ey,getReductionAxes:Pr,getReshaped:Sy,getReshapedPermuted:Iy,getRowPartitionTypesHelper:$y,getSliceBeginCoords:_y,getSliceSize:Ay,getSparseFillEmptyRowsIndicesDenseShapeMismatch:t$,getSparseFillEmptyRowsNegativeIndexErrorMessage:e$,getSparseFillEmptyRowsOutOfRangeIndexErrorMessage:n$,getSparseReshapeEmptyTensorZeroOutputDimErrorMessage:o$,getSparseReshapeInputOutputMismatchErrorMessage:i$,getSparseReshapeInputOutputMultipleErrorMessage:a$,getSparseReshapeMultipleNegativeOneOutputDimErrorMessage:r$,getSparseReshapeNegativeOutputDimErrorMessage:s$,getSparseSegmentReductionIndicesOutOfRangeErrorMessage:h$,getSparseSegmentReductionNegativeSegmentIdsErrorMessage:c$,getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage:u$,getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage:l$,getUndoAxesPermutation:dp,isIdentityPermutation:Yy,log:wl,mergeRealAndImagArrays:Oy,prepareAndValidate:gu,prepareSplitSize:Qy,segment_util:g$,shouldFuse:qn,slice_util:vu,splitRealAndImagArrays:Ly,stridesOrDilationsArePositive:se,tupleValuesAreOne:Oe,upcastType:An,validateDefaultValueShape:ky,validateInput:Pn,validateUpdateShape:Xr,warn:Pt},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */const y$=Object.freeze(Object.defineProperty({__proto__:null,nonMaxSuppressionV3Impl:ru,nonMaxSuppressionV4Impl:su,nonMaxSuppressionV5Impl:ou,whereImpl:Jc},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */v1();const E$=Object.freeze(Object.defineProperty({__proto__:null,Abs:Vs,Acos:Hs,Acosh:js,AdadeltaOptimizer:Qr,AdagradOptimizer:ts,AdamOptimizer:es,AdamaxOptimizer:ns,Add:Tr,AddN:Xs,All:Zs,Any:Ys,ArgMax:Js,ArgMin:Qs,Asin:to,Asinh:eo,Atan:no,Atan2:so,Atanh:ro,AvgPool:oo,AvgPool3D:ao,AvgPool3DGrad:tl,AvgPoolGrad:Qu,BatchMatMul:io,BatchToSpaceND:co,Bincount:uo,BitwiseAnd:lo,BroadcastArgs:ho,BroadcastTo:el,Cast:Ir,Ceil:fo,ClipByValue:po,Complex:go,ComplexAbs:mo,Concat:bo,Conv2D:wo,Conv2DBackpropFilter:yo,Conv2DBackpropInput:$o,Conv3D:Eo,Conv3DBackpropFilterV2:nl,Conv3DBackpropInputV2:ko,Cos:xo,Cosh:vo,CropAndResize:Io,Cumprod:So,Cumsum:To,DataStorage:Nu,DenseBincount:_o,DepthToSpace:Ao,DepthwiseConv2dNative:Do,DepthwiseConv2dNativeBackpropFilter:No,DepthwiseConv2dNativeBackpropInput:Mo,Diag:Fo,Dilation2D:Bo,Dilation2DBackpropFilter:sl,Dilation2DBackpropInput:rl,Draw:_r,get ENV(){return vr},Einsum:Co,Elu:Po,EluGrad:ol,Environment:zs,Equal:Lo,Erf:Oo,Exp:Wo,ExpandDims:qo,Expm1:Uo,FFT:Go,Fill:zo,FlipLeftRight:Ko,Floor:Vo,FloorDiv:Ho,FromPixels:Yn,FusedBatchNorm:jo,FusedConv2D:Qn,FusedDepthwiseConv2D:tr,GatherNd:Zo,GatherV2:Xo,Greater:Yo,GreaterEqual:Jo,IFFT:Qo,Identity:Ar,Imag:ta,IsFinite:ea,IsInf:na,IsNan:ra,KernelBackend:Fs,LRN:da,LRNGrad:ul,LeakyRelu:sa,Less:oa,LessEqual:aa,LinSpace:ia,Log:ca,Log1p:ua,LogSoftmax:il,LogicalAnd:la,LogicalNot:ha,LogicalOr:fa,LogicalXor:al,LowerBound:cl,MatrixBandPart:ll,Max:pa,MaxPool:ma,MaxPool3D:ba,MaxPool3DGrad:fl,MaxPoolGrad:hl,MaxPoolWithArgmax:wa,Maximum:ga,Mean:ya,Min:$a,Minimum:Ea,MirrorPad:ka,Mod:xa,MomentumOptimizer:rs,Multinomial:va,Multiply:Sa,Neg:Ta,NonMaxSuppressionV3:_a,NonMaxSuppressionV4:Aa,NonMaxSuppressionV5:Da,NotEqual:Ia,OP_SCOPE_SUFFIX:Yi,OneHot:Ma,OnesLike:Na,Optimizer:jt,OptimizerConstructors:Su,Pack:Fa,PadV2:Ba,Pool:dl,Pow:Ra,Prelu:Ca,Prod:Pa,RMSPropOptimizer:ss,RaggedGather:Oa,RaggedRange:La,RaggedTensorToTensor:Wa,Range:qa,get Rank(){return rr},Real:Ua,RealDiv:Ro,Reciprocal:Ga,get Reduction(){return lt},Relu:za,Relu6:ja,Reshape:Ka,ResizeBilinear:Ha,ResizeBilinearGrad:gl,ResizeNearestNeighbor:Va,ResizeNearestNeighborGrad:pl,Reverse:Xa,RotateWithOffset:Ri,Round:Za,Rsqrt:Ya,SGDOptimizer:Un,ScatterNd:Ja,SearchSorted:ti,Select:ei,Selu:ni,Sigmoid:ii,Sign:ai,Sin:si,Sinh:oi,Slice:ri,Softmax:di,Softplus:ci,SpaceToBatchND:hi,SparseFillEmptyRows:pi,SparseReshape:gi,SparseSegmentMean:mi,SparseSegmentSum:bi,SparseToDense:wi,SplitV:fi,Sqrt:ui,Square:ml,SquaredDifference:yi,StaticRegexReplace:$i,Step:Bi,StridedSlice:Ei,StringNGrams:ki,StringSplit:xi,StringToHashBucketFast:vi,Sub:Si,Sum:li,Tan:Ti,Tanh:Ii,Tensor:et,TensorBuffer:$n,TensorScatterUpdate:Qa,Tile:Dr,TopK:_i,Transform:Ai,Transpose:rn,Unique:Di,Unpack:Ni,UnsortedSegmentSum:Mi,UpperBound:bl,Variable:Be,ZerosLike:Fi,_FusedMatMul:Jn,abs:wt,acos:cf,acosh:lf,add:P,addN:ff,all:pf,any:mf,argMax:wf,argMin:$f,asin:kf,asinh:vf,atan:Tf,atan2:_f,atanh:Df,avgPool:bc,avgPool3d:Wf,backend:tc,backend_util:w$,basicLSTMCell:Hf,batchNorm:Dn,batchNorm2d:Jf,batchNorm3d:td,batchNorm4d:nd,batchToSpaceND:wc,bincount:yc,bitwiseAnd:od,booleanMaskAsync:cw,broadcastArgs:id,broadcastTo:an,broadcast_util:Zd,browser:ey,buffer:Nt,cast:j,ceil:ld,clipByValue:fd,clone:te,complex:Kt,concat:gt,concat1d:pd,concat2d:md,concat3d:wd,concat4d:$d,conv1d:xd,conv2d:Nn,conv2dTranspose:Td,conv3d:_d,conv3dTranspose:Md,copyRegisteredKernels:kl,cos:Bd,cosh:Cd,cosineWindow:Yr,cumprod:Od,cumsum:Wd,customGrad:At,denseBincount:Ud,deprecationWarn:oh,depthToSpace:zd,depthwiseConv2d:Cr,device_util:Ql,diag:Hd,dilation2d:Xd,disableDeprecationWarnings:sh,dispose:ft,disposeVariables:ah,div:H,divNoNan:ep,dot:rp,dropout:Ew,einsum:he,elu:xc,enableDebugMode:rh,enableProdMode:nh,enclosingPowerOfTwo:tu,engine:ih,ensureShape:ip,env:L,equal:kc,erf:up,euclideanNorm:xp,exp:oe,expandDims:Ct,expm1:Ip,eye:Tc,fft:Vr,fill:Ye,findBackend:ph,findBackendFactory:gh,floor:Ic,floorDiv:dc,fused:Cw,gather:_c,gatherND:ww,gather_util:ny,getBackend:Qi,getGradient:er,getKernel:Me,getKernelsForBackend:wn,grad:Xp,grads:Zp,greater:Fn,greaterEqual:Ac,ifft:vn,imag:Bn,image:g1,inTopKAsync:xw,io:U1,irfft:Hc,isFinite:Cp,isInf:Op,isNaN:Wp,keep:Ji,kernel_impls:y$,leakyRelu:Dc,less:mr,lessEqual:Lr,linalg:m1,linspace:zp,localResponseNormalization:Vp,log:We,log1p:Nc,logSigmoid:ng,logSoftmax:og,logSumExp:Bc,logicalAnd:En,logicalNot:Rc,logicalOr:Cc,logicalXor:hg,losses:b1,lowerBound:dg,matMul:U,math:K1,max:be,maxPool:Pc,maxPool3d:mg,maxPoolWithArgmax:wg,maximum:Oc,mean:kn,memory:ch,meshgrid:Eg,min:gr,minimum:xn,mirrorPad:vg,mod:Tg,moments:_g,movingAverage:hw,mul:D,multiRNNCell:Dg,multinomial:Mg,neg:It,nextFrame:my,norm:Mn,notEqual:Lc,oneHot:br,ones:Qt,onesLike:Cg,op:b,outerProduct:Og,pad:Qe,pad1d:qg,pad2d:Gg,pad3d:Kg,pad4d:Hg,pool:Jg,pow:Le,prelu:qc,print:fc,prod:em,profile:uh,raggedGather:rm,raggedRange:om,raggedTensorToTensor:im,rand:um,randomGamma:Om,randomNormal:zc,randomStandardNormal:qm,randomUniform:Kr,randomUniformInt:zm,range:qe,ready:fh,real:Ue,reciprocal:Hm,registerBackend:mh,registerGradient:yl,registerKernel:Ci,relu:Cn,relu6:Kc,removeBackend:dh,reshape:T,reverse:ae,reverse1d:Jm,reverse2d:tb,reverse3d:nb,reverse4d:sb,rfft:Hr,round:Vc,rsqrt:ib,scalar:z,scatterND:dw,scatter_util:Vb,searchSorted:Wr,selu:ub,separableConv2d:hb,serialization:k1,setBackend:hh,setPlatform:bh,setdiff1dAsync:db,sigmoid:me,sign:gb,signal:p1,sin:bb,sinh:yb,slice:X,slice1d:Eb,slice2d:xb,slice3d:Sb,slice4d:Ib,slice_util:vu,softmax:Ab,softplus:Fc,spaceToBatchND:Wc,sparse:w1,sparseToDense:mw,spectral:d1,split:Ge,sqrt:Mt,square:vt,squaredDifference:jc,squeeze:jr,stack:ze,step:Xc,stridedSlice:Wb,string:y1,sub:W,sum:V,sumOutType:zl,tan:Ub,tanh:pr,tensor:de,tensor1d:Et,tensor2d:Ae,tensor3d:Zc,tensor4d:Gb,tensor5d:zb,tensor6d:Kb,tensorScatterUpdate:jb,tensor_util:Hl,test_util:Bm,tidy:nt,tile:_e,time:lh,topk:Zb,train:py,transpose:Sn,truncatedNormal:Jb,unique:tw,unregisterGradient:El,unregisterKernel:$l,unsortedSegmentSum:nw,unstack:Zr,upcastType:An,upperBound:sw,util:Fl,valueAndGrad:Yp,valueAndGrads:Jp,variable:ow,variableGrads:Mc,version_core:dy,where:Ut,whereAsync:Qc,zeros:Ee,zerosLike:yt},Symbol.toStringTag,{value:"Module"}));export{li as $,my as A,Jc as B,z as C,Nu as D,Xi as E,mh as F,rt as G,go as H,Ar as I,Dl as J,Fs as K,sa as L,An as M,m$ as N,Sa as O,Ca as P,Uu as Q,Ka as R,we as S,xy as T,Ke as U,fp as V,pp as W,hp as X,lp as Y,Je as Z,zl as _,Lu as a,dp as a$,rn as a0,Jn as a1,Vs as a2,Hs as a3,js as a4,Tr as a5,Xs as a6,Zs as a7,Ys as a8,Js as a9,uo as aA,lo as aB,ho as aC,Ia as aD,Ua as aE,Ir as aF,Ee as aG,Gu as aH,fo as aI,po as aJ,mo as aK,wy as aL,ta as aM,bo as aN,by as aO,wo as aP,mc as aQ,Ze as aR,yo as aS,$o as aT,Eo as aU,gc as aV,nl as aW,ko as aX,xo as aY,vo as aZ,Io as a_,Qs as aa,to as ab,eo as ac,no as ad,so as ae,ro as af,oo as ag,Bt as ah,pc as ai,ao as aj,Mf as ak,tl as al,Qu as am,io as an,jo as ao,ri as ap,ly as aq,sy as ar,cy as as,uy as at,co as au,Sy as av,Ty as aw,Iy as ax,_y as ay,Ay as az,p as b,fl as b$,So as b0,To as b1,_o as b2,Ao as b3,Do as b4,No as b5,Mo as b6,Fo as b7,Bo as b8,Nf as b9,Yn as bA,Qn as bB,tr as bC,Zo as bD,gu as bE,Xo as bF,p$ as bG,Yo as bH,Jo as bI,Qo as bJ,ea as bK,na as bL,ra as bM,oa as bN,aa as bO,ia as bP,ca as bQ,ua as bR,la as bS,ha as bT,fa as bU,da as bV,ul as bW,pa as bX,ga as bY,ma as bZ,ba as b_,Co as ba,Hy as bb,Xy as bc,Zy as bd,jy as be,Yy as bf,Po as bg,ol as bh,Lo as bi,Oo as bj,My as bk,Fy as bl,By as bm,Ry as bn,Cy as bo,Py as bp,Wo as bq,qo as br,Uo as bs,Go as bt,zo as bu,Ve as bv,kr as bw,Ko as bx,Vo as by,Ho as bz,Cs as c,ml as c$,hl as c0,wa as c1,ya as c2,$a as c3,Ea as c4,ka as c5,xa as c6,Ro as c7,Si as c8,di as c9,pl as cA,Xa as cB,Ri as cC,vy as cD,Za as cE,Ya as cF,Ja as cG,Yc as cH,ti as cI,ei as cJ,ni as cK,Dy as cL,Ny as cM,ii as cN,ai as cO,si as cP,oi as cQ,ci as cR,hi as cS,pi as cT,gi as cU,mi as cV,bi as cW,wi as cX,fi as cY,Qy as cZ,ui as c_,va as ca,Ta as cb,_a as cc,ru as cd,Aa as ce,su as cf,Da as cg,ou as ch,Ma as ci,Fi as cj,Na as ck,Fa as cl,ht as cm,Ba as cn,Ra as co,Pa as cp,Oa as cq,La as cr,Wa as cs,qa as ct,Ga as cu,za as cv,ja as cw,Ha as cx,gl as cy,Va as cz,Ft as d,Al as d$,yi as d0,$i as d1,Bi as d2,Ei as d3,hy as d4,ay as d5,ki as d6,xi as d7,vi as d8,Ti as d9,qy as dA,zy as dB,Gy as dC,Ky as dD,Hu as dE,qr as dF,De as dG,$y as dH,Ey as dI,Tt as dJ,ky as dK,yy as dL,T as dM,an as dN,b$ as dO,t$ as dP,e$ as dQ,n$ as dR,r$ as dS,s$ as dT,o$ as dU,a$ as dV,i$ as dW,c$ as dX,u$ as dY,l$ as dZ,h$ as d_,Ii as da,Qa as db,Dr as dc,_i as dd,Ai as de,Di as df,Ni as dg,Mi as dh,d$ as di,f$ as dj,Ci as dk,zu as dl,Tn as dm,$n as dn,xr as dp,Vu as dq,_n as dr,sl as ds,fe as dt,Ku as du,rl as dv,_r as dw,Uy as dx,Ly as dy,Wy as dz,L as e,xp as e$,gn as e0,te as e1,Yi as e2,wt as e3,cf as e4,lf as e5,P as e6,ff as e7,pf as e8,mf as e9,wd as eA,$d as eB,xd as eC,Nn as eD,Td as eE,_d as eF,Md as eG,Bd as eH,Cd as eI,Yr as eJ,Od as eK,Wd as eL,Ud as eM,zd as eN,Cr as eO,Hd as eP,Xd as eQ,H as eR,ep as eS,rp as eT,Ew as eU,he as eV,xc as eW,tu as eX,ip as eY,kc as eZ,up as e_,wf as ea,$f as eb,kf as ec,vf as ed,Tf as ee,_f as ef,Df as eg,bc as eh,Wf as ei,Hf as ej,Dn as ek,Jf as el,td as em,nd as en,wc as eo,yc as ep,od as eq,cw as er,id as es,j as et,ld as eu,fd as ev,Kt as ew,gt as ex,pd as ey,md as ez,ke as f,Qe as f$,oe as f0,Ct as f1,Ip as f2,Tc as f3,Vr as f4,Ye as f5,Ic as f6,dc as f7,Cw as f8,_c as f9,b1 as fA,dg as fB,U as fC,be as fD,Pc as fE,mg as fF,wg as fG,Oc as fH,kn as fI,Eg as fJ,gr as fK,xn as fL,vg as fM,Tg as fN,_g as fO,hw as fP,D as fQ,Dg as fR,Mg as fS,It as fT,Mn as fU,Lc as fV,br as fW,Qt as fX,Cg as fY,b as fZ,Og as f_,ww as fa,Fn as fb,Ac as fc,vn as fd,Bn as fe,g1 as ff,xw as fg,Hc as fh,Cp as fi,Op as fj,Wp as fk,Dc as fl,mr as fm,Lr as fn,m1 as fo,zp as fp,Vp as fq,We as fr,Nc as fs,ng as ft,og as fu,Bc as fv,En as fw,Rc as fx,Cc as fy,hg as fz,w$ as g,Ub as g$,qg as g0,Gg as g1,Kg as g2,Hg as g3,Jg as g4,Le as g5,qc as g6,fc as g7,em as g8,rm as g9,me as gA,gb as gB,p1 as gC,bb as gD,yb as gE,X as gF,Eb as gG,xb as gH,Sb as gI,Ib as gJ,Ab as gK,Fc as gL,Wc as gM,w1 as gN,mw as gO,d1 as gP,Ge as gQ,Mt as gR,vt as gS,jc as gT,jr as gU,ze as gV,Xc as gW,Wb as gX,y1 as gY,W as gZ,V as g_,om as ga,im as gb,um as gc,Om as gd,zc as ge,qm as gf,Kr as gg,zm as gh,qe as gi,Ue as gj,Hm as gk,Cn as gl,Kc as gm,ae as gn,Jm as go,tb as gp,nb as gq,sb as gr,Hr as gs,Vc as gt,ib as gu,dw as gv,Wr as gw,ub as gx,hb as gy,db as gz,Ec as h,pr as h0,de as h1,Et as h2,Ae as h3,Zc as h4,Gb as h5,zb as h6,Kb as h7,jb as h8,_e as h9,Zb as ha,Sn as hb,Jb as hc,tw as hd,nw as he,Zr as hf,sw as hg,ow as hh,Ut as hi,Qc as hj,yt as hk,Ji as hl,In as hm,U1 as hn,Eh as ho,et as hp,ft as hq,ur as hr,sc as hs,fu as ht,E$ as hu,Jl as i,qu as j,ih as k,Fe as l,Oy as m,Fu as n,yn as o,Nt as p,zt as q,Ie as r,G as s,Bu as t,Lt as u,je as v,Pt as w,Ps as x,nt as y,mn as z};
