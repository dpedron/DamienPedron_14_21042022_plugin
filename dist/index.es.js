import e,{useState as t,useEffect as o}from"react";import n from"prop-types";function r({options:n,selectId:r,theme:i}){const[a,l]=t(!1),[d,s]=t([]),[c,p]=t(0),m=document.getElementById(r),u=document.getElementById(r).value||"",h=document.getElementById(r).size,g=document.getElementById(`${r}-list`),f=document.getElementById(`${r}-button`),b=document.getElementById(`${r}-button-title`),v=document.querySelector(".option"),y=n.find((e=>""===e.value)),x=n.findIndex((e=>""===e.value)),E=h>0;!a&&E&&l(!0);const w=document.getElementById(r).disabled;function k(){if(void 0!==n[c]&&n[c]&&(!n[c].disabled||y)&&"optgroup"!==n[c].type&&(b&&(b.innerText=n[c].name,m.value=b.innerText,""!==m.value&&m.dispatchEvent(new Event("change",{bubbles:!0}))),g&&E)){const e=[...g.children].find((e=>e.classList.contains("selected")));e&&(m.value=e.innerText,""!==m.value&&m.dispatchEvent(new Event("change",{bubbles:!0})))}}function I(e){l(!1),p([...d].findIndex((t=>e.target.innerText===t.innerText))),e.target.classList.add("selected"),[...e.target.parentElement.children].forEach((t=>!(t.className.includes("selected")&&t.id===e.target.id)&&t.classList.remove("selected")))}function N(e,t){return"optgroup"===n[e].type||n[e].disabled?(p(t),t):(p(e),e)}o((()=>{!function(){if(null===b)return;let e=c;if(y)e=x;else{if(("optgroup"===n[e].type||n[e].disabled)&&void 0!==n[e+1])do{e++}while("optgroup"===n[e].type||n[e].disabled);p(e)}}(),k(),function(){const e=document.getElementById(`${r}-list`),t=document.getElementById(`${r}-button`);s(a?e.children:t.parentElement.previousElementSibling.children)}(),function(){if(E||""===m.value)return;g&&-1!==c&&void 0!==g.children[c]&&(g.children[c].focus(),s(g.children))}(),E&&w&&[...d].forEach((e=>e.classList.add("disabled")))})),document.onclick=e=>{document.querySelector(".handle-click")===e.target&&l(!1)};const $=e=>"s"===e?"12px":"m"===e?"16px":"l"===e?"24px":"16px";function T(e){let t=c,o=t;if(e.target.classList.contains("option")&&"Tab"===e.code)I(e);else if(!f&&!E||"Tab"!==e.code){if(e.preventDefault(),t>=1&&("ArrowUp"===e.code||"ArrowLeft"===e.code)&&!e.altKey){do{t>=1&&t--}while(t>=1&&("optgroup"===n[t].type||n[t].disabled));N(t,o),g&&E&&(g.children[t].focus(),m.value=document.activeElement.innerText)}if(c<n.length-1&&("ArrowDown"===e.code||"ArrowRight"===e.code)&&!e.altKey){do{t++}while(("optgroup"===n[t].type||n[t].disabled)&&t<n.length-2);N(t,o),g&&E&&(0===c&&document.activeElement===g&&(t=0,p(t)),g.children[t].focus(),m.value=document.activeElement.innerText)}if("Home"===e.code||"PageUp"===e.code){let e=0;for(;("optgroup"===n[e].type||n[e].disabled)&&e<n.length-2;)e++;N(e,o),g&&E&&(g.children[N(e,o)].focus(),m.value=document.activeElement.innerText)}if("End"===e.code||"PageDown"===e.code){let e=n.length-1;for(;("optgroup"===n[e].type||n[e].disabled)&&e>1;)e--;N(e,o),g&&E&&(g.children[N(e,o)].focus(),m.value=document.activeElement.innerText)}if(a&&(!E&&("Escape"===e.code||e.altKey&&"ArrowUp"===e.code)&&(f.focus(),l(!1)),d.length>0&&("Enter"!==e.code&&"Space"!==e.code||(!E&&f.focus(),e.target.classList.contains("option")&&I(e)))),!a){if("Enter"===e.code)return;(e.altKey&&"ArrowDown"===e.code||"Space"===e.code)&&l(!0)}k()}}return e.createElement("div",{className:"select-wrapper"},!E&&e.createElement("div",{className:"select-button "+(w?"disabled":""),"data-theme":i,id:`${r}-button`,onKeyDown:e=>{T(e)},onClick:()=>l(!a),tabIndex:w?"-1":"0"},e.createElement("span",{"data-theme":i,id:`${r}-button-title`},u),e.createElement("svg",{className:"chevron "+(w?"disabled":""),"data-theme":i,xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 384 512"},e.createElement("path",{d:"M192 384c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L192 306.8l137.4-137.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-160 160C208.4 380.9 200.2 384 192 384z"}))),a&&e.createElement(e.Fragment,null,!E&&e.createElement("div",{className:"handle-click"}),e.createElement("ul",{id:`${r}-list`,className:"list "+(E?"":"no-size"),style:{height:v&&E&&h*v.clientHeight+"px"},tabIndex:w||!E?"-1":"0","data-theme":i,onKeyDown:e=>{T(e)}},n.map(((t,o)=>"optgroup"===t.type?e.createElement(e.Fragment,{key:`${t.name}${o}`},e.createElement("li",{"data-theme":i,key:`${t.name}`,className:"optgroup"},t.name),void 0!==t.options&&"option"===t.options.type&&e.createElement("li",{style:{display:""===t.props.value?"none":"list-item"},key:t.options.props.children,id:`${r}-${t.options.props.children}`,className:"option "+(t.props.disabled?"disabled":""),"data-theme":i,onClick:e=>I(e),tabIndex:t.props.disabled?"-1":"0",onKeyDown:e=>{T(e)}},t.props.imgsrc&&e.createElement("img",{alt:"",className:"option-pic",src:t.props.imgsrc,width:$(t.props.imgsize)}),e.createElement("span",{className:"option-text","data-theme":i},t.options.props.children)),t.options&&t.options.length>1&&t.options.map((t=>e.createElement("li",{style:{display:""===t.props.value?"none":"list-item"},key:t.props.children,id:`${r}-${t.props.children}`,"data-theme":i,className:"option "+(t.props.disabled?"disabled":""),onClick:e=>I(e),tabIndex:t.props.disabled?"-1":"0",onKeyDown:e=>{T(e)}},t.props.imgsrc&&e.createElement("img",{alt:"",className:"option-pic",src:t.props.imgsrc,width:$(t.props.imgsize)}),e.createElement("span",{className:"option-text","data-theme":i},t.props.children))))):e.createElement("li",{style:{display:""===t.value?"none":"list-item"},key:t.name,id:`${r}-${t.name}`,"data-theme":i,className:"option "+(t.disabled?"disabled":""),onClick:e=>I(e),tabIndex:t.disabled||E?"-1":"0",onKeyDown:e=>{T(e)}},t.imgsrc&&e.createElement("img",{alt:"",className:"option-pic",src:t.imgsrc,width:$(t.imgsize)}),e.createElement("span",{className:"option-text","data-theme":i},t.name)))))))}function i({children:n,theme:i="default"}){const[a,l]=t(!1),d=n.props.id;o((()=>{document.getElementById(d).style.display="none",l(!0)}));let s=[],c=e=>s.push({name:e.props.children,type:e.type,value:e.props.value,imgsrc:e.props.imgsrc,imgsize:e.props.imgsize||"16px",disabled:e.props.disabled});return void 0===n.props.children?s.push({name:"no-option",type:"option",disabled:!0}):void 0===n.props.children.length?c(n.props.children):n.props.children.forEach((e=>{"optgroup"===e.type?(s.push({name:e.props.label,type:e.type}),e.props.children&&e.props.children.forEach((e=>{c(e)}))):void 0===e.length?c(e):e.forEach((e=>{c(e)}))})),e.createElement(e.Fragment,null,n,a&&e.createElement(r,{options:s,selectId:d,theme:i}))}!function(e,t){void 0===t&&(t={});var o=t.insertAt;if(e&&"undefined"!=typeof document){var n=document.head||document.getElementsByTagName("head")[0],r=document.createElement("style");r.type="text/css","top"===o&&n.firstChild?n.insertBefore(r,n.firstChild):n.appendChild(r),r.styleSheet?r.styleSheet.cssText=e:r.appendChild(document.createTextNode(e))}}(":root{--background-color:#fff;--border-color:#ced4da;--text-color:#000;--active-text-color:#fff;--active-background-color:#007fff;--disabled-color:grey;--chevron-filter-disabled:brightness(0) saturate(100%) invert(96%) sepia(0%) saturate(173%) hue-rotate(189deg) brightness(94%) contrast(80%)}.select-wrapper{padding:0;position:relative}.optgroup{font-weight:700;padding:5px}.optgroup,.option{background-color:var(--background-color);color:var(--text-color)}.option{align-items:center;cursor:pointer;display:flex;padding:5px 10px}.option:focus,.option:hover,.selected{background:var(--active-background-color);color:var(--active-text-color)}.select-button{align-items:center;background:var(--background-color);border:1px solid var(--border-color);border-radius:.25rem;color:var(--text-color);cursor:pointer;display:flex;justify-content:space-between;padding:6px 16px}.chevron{filter:var(--chevron-filter);height:15px}.list{border:1px solid var(--border-color);list-style-type:none;margin:0;max-height:420px;overflow-y:auto;padding-left:0;position:absolute;width:100%}.no-size{z-index:10}.label{margin:16px 0 0;padding:0}.option-pic,.option-text{pointer-events:none}.option-text{padding:0 16px}.disabled{color:var(--disabled-color);pointer-events:none}.chevron.disabled{filter:var(--chevron-filter-disabled)}.handle-click{height:100vh;left:0;position:fixed;top:0;width:100%;z-index:9}[data-theme=light]{--background-color:#fcfdfe;--border-color:#e9f0f8;--text-color:#afc9e6;--active-text-color:#fcfdfe;--active-background-color:#afc9e6;--disabled-color:#ededed;--chevron-filter:brightness(0) saturate(100%) invert(84%) sepia(11%) saturate(668%) hue-rotate(174deg) brightness(92%) contrast(97%);--chevron-filter-disabled:brightness(0) saturate(100%) invert(97%) sepia(3%) saturate(821%) hue-rotate(213deg) brightness(114%) contrast(86%)}[data-theme=dark]{--background-color:#212a2e;--border-color:grey;--text-color:#d3d3d3;--active-text-color:#fff;--active-background-color:grey;--disabled-color:grey;--chevron-filter:brightness(0) saturate(100%) invert(92%) sepia(2%) saturate(14%) hue-rotate(85deg) brightness(96%) contrast(85%);--chevron-filter-disabled:brightness(0) saturate(100%) invert(57%) sepia(0%)}"),r.propTypes={options:n.array,selectId:n.string.isRequired,theme:n.string},i.propTypes={children:n.object,theme:n.string};export{i as default};