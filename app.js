/* NITRO — motor do sistema. Carregado por index.html. */

/* Módulo ES é buscado com regras de origem cruzada; arquivo de disco tem
   origem `null` e o navegador recusa antes de rodar. */
(function () {
'use strict';

/* ══════════════════════════════════════════════════════════════════════════
   AUTOCORE — gestão inteligente para oficinas
   Arquivo único, sem etapa de build. Preact + htm (12 KB), gráficos em SVG
   próprio. Fase 2: motor de análise, CRM, prontuário, relatórios, automações.
   ══════════════════════════════════════════════════════════════════════════ */

/* ─── CONEXÃO ──────────────────────────────────────────────────────────────
   A chave abaixo é a `anon` (publishable). Ela É pública por desenho: viaja
   em toda requisição de todo cliente Supabase e não há como escondê-la num
   arquivo servido ao navegador. Quem impede que ela leia a base inteira não
   é o segredo — é a RLS do banco, aplicada pelo arquivo 03_seguranca.sql.
   Com RLS ligada, esta chave sozinha alcança exatamente duas funções: as do
   link do cliente. Sem RLS, ela é acesso total. Confira rodando
   `select * from public.auditoria_do_banco()`.

   NUNCA coloque aqui a chave `service_role`: ela ignora RLS por definição.
   Vazio = modo demonstração: dados fictícios, nada é gravado.              */
const SUPABASE_URL = "https://mwmrqgttbwqmuwjhznfq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13bXJxZ3R0YndxbXV3amh6bmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0NTAyNzgsImV4cCI6MjEwMTAyNjI3OH0.r9UCtiLSpRZhfIb4Knfbd_g3j1gYpzwlUqWBySkY_34";

/* ─── ENTRADA POR USUÁRIO ─────────────────────────────────────────────────
   A oficina entra com "Oficinarickauto", não com um e-mail. O Supabase Auth
   exige formato de e-mail, então o nome de usuário ganha este domínio aqui
   antes de sair. É só costura de formato: quem digita nunca vê.

   A SENHA NÃO MORA NESTE ARQUIVO, e não pode morar. Qualquer pessoa abre o
   código-fonte da página e lê o que estiver escrito aqui — deixar a senha
   dentro dele seria o mesmo que abrir a base para a internet inteira, e
   tornaria inútil toda a RLS do banco.

   Ela é digitada UMA VEZ por aparelho. A sessão fica guardada e se renova
   sozinha, então o balcão não vê esta tela de novo.                       */
const DOMINIO_INTERNO = "rickauto.local";
const paraEmail = (u) => {
  const t = String(u || '').trim().toLowerCase();
  return t.includes('@') ? t : t.replace(/[^a-z0-9._-]/g, '') + '@' + DOMINIO_INTERNO;
};
const OFICINA_PADRAO = {
  nome: "Minha oficina",
  documento: "",
  telefone: "",
  email: "",
  endereco: "",
  logo: null,                 // data URL, definida em Ajustes
  cor: "#2F62F5",             // destaque das ações
  corBarra: "#12224A",        // barra lateral
};
const PISO_MARGEM = 30;        // margem mínima antes de exigir aprovação
const VALIDADE_PADRAO = 7;     // dias de validade do orçamento
const DIAS_INATIVO = 180;      // cliente sem visita vira "precisa de retorno"
const KM_ENTRE_REVISOES = 10000;
const GARANTIA_PADRAO = 90;    // dias de garantia do serviço, a partir da entrega
/* ─────────────────────────────────────────────────────────────────────── */

/* ══════════════════════════════════════════════════════════════════════════
   BIBLIOTECAS EMBUTIDAS — Preact 10.22.0 (MIT) + htm 3.1.1 (Apache-2.0)

   Antes vinham de https://esm.sh a cada carregamento, e isso é ponto único
   de falha num sistema de oficina: CDN fora do ar, ou internet instável no
   galpão, e o sistema não abre. Embutidas, o arquivo se basta — o que vale
   também para o link que o cliente recebe por WhatsApp.

   Cada uma vive dentro da própria função. As duas são minificadas e usam os
   mesmos nomes de uma letra no topo (`n`, `l`, `u`, `t`); soltas no mesmo
   escopo elas se sobrescrevem e o arquivo nem chega a carregar.
   ══════════════════════════════════════════════════════════════════════════ */
const __PREACT__ = (function () {
var n,l,u,t,i,o,r,f,e,c,s,a,h={},p=[],v=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,y=Array.isArray;function d(n,l){for(var u in l)n[u]=l[u];return n}function w(n){var l=n.parentNode;l&&l.removeChild(n)}function _(l,u,t){var i,o,r,f={};for(r in u)"key"==r?i=u[r]:"ref"==r?o=u[r]:f[r]=u[r];if(arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):t),"function"==typeof l&&null!=l.defaultProps)for(r in l.defaultProps)void 0===f[r]&&(f[r]=l.defaultProps[r]);return g(l,f,i,o,null)}function g(n,t,i,o,r){var f={type:n,props:t,key:i,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:null==r?++u:r,__i:-1,__u:0};return null==r&&null!=l.vnode&&l.vnode(f),f}function m(){return{current:null}}function k(n){return n.children}function b(n,l){this.props=n,this.context=l}function x(n,l){if(null==l)return n.__?x(n.__,n.__i+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return"function"==typeof n.type?x(n):null}function C(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return C(n)}}function M(n){(!n.__d&&(n.__d=!0)&&i.push(n)&&!P.__r++||o!==l.debounceRendering)&&((o=l.debounceRendering)||r)(P)}function P(){var n,u,t,o,r,e,c,s;for(i.sort(f);n=i.shift();)n.__d&&(u=i.length,o=void 0,e=(r=(t=n).__v).__e,c=[],s=[],t.__P&&((o=d({},r)).__v=r.__v+1,l.vnode&&l.vnode(o),O(t.__P,o,r,t.__n,t.__P.namespaceURI,32&r.__u?[e]:null,c,null==e?x(r):e,!!(32&r.__u),s),o.__v=r.__v,o.__.__k[o.__i]=o,j(c,o,s),o.__e!=e&&C(o)),i.length>u&&i.sort(f));P.__r=0}function S(n,l,u,t,i,o,r,f,e,c,s){var a,v,y,d,w,_=t&&t.__k||p,g=l.length;for(u.__d=e,$(u,l,_),e=u.__d,a=0;a<g;a++)null!=(y=u.__k[a])&&"boolean"!=typeof y&&"function"!=typeof y&&(v=-1===y.__i?h:_[y.__i]||h,y.__i=a,O(n,y,v,i,o,r,f,e,c,s),d=y.__e,y.ref&&v.ref!=y.ref&&(v.ref&&N(v.ref,null,y),s.push(y.ref,y.__c||d,y)),null==w&&null!=d&&(w=d),65536&y.__u||v.__k===y.__k?(e&&!e.isConnected&&(e=x(v)),e=I(y,e,n)):"function"==typeof y.type&&void 0!==y.__d?e=y.__d:d&&(e=d.nextSibling),y.__d=void 0,y.__u&=-196609);u.__d=e,u.__e=w}function $(n,l,u){var t,i,o,r,f,e=l.length,c=u.length,s=c,a=0;for(n.__k=[],t=0;t<e;t++)r=t+a,null!=(i=n.__k[t]=null==(i=l[t])||"boolean"==typeof i||"function"==typeof i?null:"string"==typeof i||"number"==typeof i||"bigint"==typeof i||i.constructor==String?g(null,i,null,null,null):y(i)?g(k,{children:i},null,null,null):void 0===i.constructor&&i.__b>0?g(i.type,i.props,i.key,i.ref?i.ref:null,i.__v):i)?(i.__=n,i.__b=n.__b+1,f=L(i,u,r,s),i.__i=f,o=null,-1!==f&&(s--,(o=u[f])&&(o.__u|=131072)),null==o||null===o.__v?(-1==f&&a--,"function"!=typeof i.type&&(i.__u|=65536)):f!==r&&(f===r+1?a++:f>r?s>e-r?a+=f-r:a--:f<r?f==r-1&&(a=f-r):a=0,f!==t+a&&(i.__u|=65536))):(o=u[r])&&null==o.key&&o.__e&&0==(131072&o.__u)&&(o.__e==n.__d&&(n.__d=x(o)),V(o,o,!1),u[r]=null,s--);if(s)for(t=0;t<c;t++)null!=(o=u[t])&&0==(131072&o.__u)&&(o.__e==n.__d&&(n.__d=x(o)),V(o,o))}function I(n,l,u){var t,i;if("function"==typeof n.type){for(t=n.__k,i=0;t&&i<t.length;i++)t[i]&&(t[i].__=n,l=I(t[i],l,u));return l}n.__e!=l&&(u.insertBefore(n.__e,l||null),l=n.__e);do{l=l&&l.nextSibling}while(null!=l&&8===l.nodeType);return l}function H(n,l){return l=l||[],null==n||"boolean"==typeof n||(y(n)?n.some(function(n){H(n,l)}):l.push(n)),l}function L(n,l,u,t){var i=n.key,o=n.type,r=u-1,f=u+1,e=l[u];if(null===e||e&&i==e.key&&o===e.type&&0==(131072&e.__u))return u;if(t>(null!=e&&0==(131072&e.__u)?1:0))for(;r>=0||f<l.length;){if(r>=0){if((e=l[r])&&0==(131072&e.__u)&&i==e.key&&o===e.type)return r;r--}if(f<l.length){if((e=l[f])&&0==(131072&e.__u)&&i==e.key&&o===e.type)return f;f++}}return-1}function T(n,l,u){"-"===l[0]?n.setProperty(l,null==u?"":u):n[l]=null==u?"":"number"!=typeof u||v.test(l)?u:u+"px"}function A(n,l,u,t,i){var o;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else{if("string"==typeof t&&(n.style.cssText=t=""),t)for(l in t)u&&l in u||T(n.style,l,"");if(u)for(l in u)t&&u[l]===t[l]||T(n.style,l,u[l])}else if("o"===l[0]&&"n"===l[1])o=l!==(l=l.replace(/(PointerCapture)$|Capture$/i,"$1")),l=l.toLowerCase()in n||"onFocusOut"===l||"onFocusIn"===l?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+o]=u,u?t?u.u=t.u:(u.u=e,n.addEventListener(l,o?s:c,o)):n.removeEventListener(l,o?s:c,o);else{if("http://www.w3.org/2000/svg"==i)l=l.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if("width"!=l&&"height"!=l&&"href"!=l&&"list"!=l&&"form"!=l&&"tabIndex"!=l&&"download"!=l&&"rowSpan"!=l&&"colSpan"!=l&&"role"!=l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null==u||!1===u&&"-"!==l[4]?n.removeAttribute(l):n.setAttribute(l,u))}}function F(n){return function(u){if(this.l){var t=this.l[u.type+n];if(null==u.t)u.t=e++;else if(u.t<t.u)return;return t(l.event?l.event(u):u)}}}function O(n,u,t,i,o,r,f,e,c,s){var a,h,p,v,w,_,g,m,x,C,M,P,$,I,H,L=u.type;if(void 0!==u.constructor)return null;128&t.__u&&(c=!!(32&t.__u),r=[e=u.__e=t.__e]),(a=l.__b)&&a(u);n:if("function"==typeof L)try{if(m=u.props,x=(a=L.contextType)&&i[a.__c],C=a?x?x.props.value:a.__:i,t.__c?g=(h=u.__c=t.__c).__=h.__E:("prototype"in L&&L.prototype.render?u.__c=h=new L(m,C):(u.__c=h=new b(m,C),h.constructor=L,h.render=q),x&&x.sub(h),h.props=m,h.state||(h.state={}),h.context=C,h.__n=i,p=h.__d=!0,h.__h=[],h._sb=[]),null==h.__s&&(h.__s=h.state),null!=L.getDerivedStateFromProps&&(h.__s==h.state&&(h.__s=d({},h.__s)),d(h.__s,L.getDerivedStateFromProps(m,h.__s))),v=h.props,w=h.state,h.__v=u,p)null==L.getDerivedStateFromProps&&null!=h.componentWillMount&&h.componentWillMount(),null!=h.componentDidMount&&h.__h.push(h.componentDidMount);else{if(null==L.getDerivedStateFromProps&&m!==v&&null!=h.componentWillReceiveProps&&h.componentWillReceiveProps(m,C),!h.__e&&(null!=h.shouldComponentUpdate&&!1===h.shouldComponentUpdate(m,h.__s,C)||u.__v===t.__v)){for(u.__v!==t.__v&&(h.props=m,h.state=h.__s,h.__d=!1),u.__e=t.__e,u.__k=t.__k,u.__k.forEach(function(n){n&&(n.__=u)}),M=0;M<h._sb.length;M++)h.__h.push(h._sb[M]);h._sb=[],h.__h.length&&f.push(h);break n}null!=h.componentWillUpdate&&h.componentWillUpdate(m,h.__s,C),null!=h.componentDidUpdate&&h.__h.push(function(){h.componentDidUpdate(v,w,_)})}if(h.context=C,h.props=m,h.__P=n,h.__e=!1,P=l.__r,$=0,"prototype"in L&&L.prototype.render){for(h.state=h.__s,h.__d=!1,P&&P(u),a=h.render(h.props,h.state,h.context),I=0;I<h._sb.length;I++)h.__h.push(h._sb[I]);h._sb=[]}else do{h.__d=!1,P&&P(u),a=h.render(h.props,h.state,h.context),h.state=h.__s}while(h.__d&&++$<25);h.state=h.__s,null!=h.getChildContext&&(i=d(d({},i),h.getChildContext())),p||null==h.getSnapshotBeforeUpdate||(_=h.getSnapshotBeforeUpdate(v,w)),S(n,y(H=null!=a&&a.type===k&&null==a.key?a.props.children:a)?H:[H],u,t,i,o,r,f,e,c,s),h.base=u.__e,u.__u&=-161,h.__h.length&&f.push(h),g&&(h.__E=h.__=null)}catch(n){u.__v=null,c||null!=r?(u.__e=e,u.__u|=c?160:32,r[r.indexOf(e)]=null):(u.__e=t.__e,u.__k=t.__k),l.__e(n,u,t)}else null==r&&u.__v===t.__v?(u.__k=t.__k,u.__e=t.__e):u.__e=z(t.__e,u,t,i,o,r,f,c,s);(a=l.diffed)&&a(u)}function j(n,u,t){u.__d=void 0;for(var i=0;i<t.length;i++)N(t[i],t[++i],t[++i]);l.__c&&l.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u)})}catch(n){l.__e(n,u.__v)}})}function z(l,u,t,i,o,r,f,e,c){var s,a,p,v,d,_,g,m=t.props,k=u.props,b=u.type;if("svg"===b?o="http://www.w3.org/2000/svg":"math"===b?o="http://www.w3.org/1998/Math/MathML":o||(o="http://www.w3.org/1999/xhtml"),null!=r)for(s=0;s<r.length;s++)if((d=r[s])&&"setAttribute"in d==!!b&&(b?d.localName===b:3===d.nodeType)){l=d,r[s]=null;break}if(null==l){if(null===b)return document.createTextNode(k);l=document.createElementNS(o,b,k.is&&k),r=null,e=!1}if(null===b)m===k||e&&l.data===k||(l.data=k);else{if(r=r&&n.call(l.childNodes),m=t.props||h,!e&&null!=r)for(m={},s=0;s<l.attributes.length;s++)m[(d=l.attributes[s]).name]=d.value;for(s in m)if(d=m[s],"children"==s);else if("dangerouslySetInnerHTML"==s)p=d;else if("key"!==s&&!(s in k)){if("value"==s&&"defaultValue"in k||"checked"==s&&"defaultChecked"in k)continue;A(l,s,null,d,o)}for(s in k)d=k[s],"children"==s?v=d:"dangerouslySetInnerHTML"==s?a=d:"value"==s?_=d:"checked"==s?g=d:"key"===s||e&&"function"!=typeof d||m[s]===d||A(l,s,d,m[s],o);if(a)e||p&&(a.__html===p.__html||a.__html===l.innerHTML)||(l.innerHTML=a.__html),u.__k=[];else if(p&&(l.innerHTML=""),S(l,y(v)?v:[v],u,t,i,"foreignObject"===b?"http://www.w3.org/1999/xhtml":o,r,f,r?r[0]:t.__k&&x(t,0),e,c),null!=r)for(s=r.length;s--;)null!=r[s]&&w(r[s]);e||(s="value",void 0!==_&&(_!==l[s]||"progress"===b&&!_||"option"===b&&_!==m[s])&&A(l,s,_,m[s],o),s="checked",void 0!==g&&g!==l[s]&&A(l,s,g,m[s],o))}return l}function N(n,u,t){try{"function"==typeof n?n(u):n.current=u}catch(n){l.__e(n,t)}}function V(n,u,t){var i,o;if(l.unmount&&l.unmount(n),(i=n.ref)&&(i.current&&i.current!==n.__e||N(i,null,u)),null!=(i=n.__c)){if(i.componentWillUnmount)try{i.componentWillUnmount()}catch(n){l.__e(n,u)}i.base=i.__P=null}if(i=n.__k)for(o=0;o<i.length;o++)i[o]&&V(i[o],u,t||"function"!=typeof n.type);t||null==n.__e||w(n.__e),n.__c=n.__=n.__e=n.__d=void 0}function q(n,l,u){return this.constructor(n,u)}function B(u,t,i){var o,r,f,e;l.__&&l.__(u,t),r=(o="function"==typeof i)?null:i&&i.__k||t.__k,f=[],e=[],O(t,u=(!o&&i||t).__k=_(k,null,[u]),r||h,h,t.namespaceURI,!o&&i?[i]:r?null:t.firstChild?n.call(t.childNodes):null,f,!o&&i?i:r?r.__e:t.firstChild,o,e),j(f,u,e)}function D(n,l){B(n,l,D)}function E(l,u,t){var i,o,r,f,e=d({},l.props);for(r in l.type&&l.type.defaultProps&&(f=l.type.defaultProps),u)"key"==r?i=u[r]:"ref"==r?o=u[r]:e[r]=void 0===u[r]&&void 0!==f?f[r]:u[r];return arguments.length>2&&(e.children=arguments.length>3?n.call(arguments,2):t),g(l.type,e,i||l.key,o||l.ref,null)}function G(n,l){var u={__c:l="__cC"+a++,__:n,Consumer:function(n,l){return n.children(l)},Provider:function(n){var u,t;return this.getChildContext||(u=[],(t={})[l]=this,this.getChildContext=function(){return t},this.shouldComponentUpdate=function(n){this.props.value!==n.value&&u.some(function(n){n.__e=!0,M(n)})},this.sub=function(n){u.push(n);var l=n.componentWillUnmount;n.componentWillUnmount=function(){u.splice(u.indexOf(n),1),l&&l.call(n)}}),n.children}};return u.Provider.__=u.Consumer.contextType=u}n=p.slice,l={__e:function(n,l,u,t){for(var i,o,r;l=l.__;)if((i=l.__c)&&!i.__)try{if((o=i.constructor)&&null!=o.getDerivedStateFromError&&(i.setState(o.getDerivedStateFromError(n)),r=i.__d),null!=i.componentDidCatch&&(i.componentDidCatch(n,t||{}),r=i.__d),r)return i.__E=i}catch(l){n=l}throw n}},u=0,t=function(n){return null!=n&&null==n.constructor},b.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=d({},this.state),"function"==typeof n&&(n=n(d({},u),this.props)),n&&d(u,n),null!=n&&this.__v&&(l&&this._sb.push(l),M(this))},b.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),M(this))},b.prototype.render=k,i=[],r="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,f=function(n,l){return n.__v.__b-l.__v.__b},P.__r=0,e=0,c=F(!1),s=F(!0),a=0;
return { Component: b, Fragment: k, cloneElement: E, createContext: G, createElement: _, createRef: m, h: _, hydrate: D, isValidElement: t, options: l, render: B, toChildArray: H };
})();

const __HTM__ = (function () {
var n=function(t,s,r,e){var u;s[0]=0;for(var h=1;h<s.length;h++){var p=s[h++],a=s[h]?(s[0]|=p?1:2,r[s[h++]]):s[++h];3===p?e[0]=a:4===p?e[1]=Object.assign(e[1]||{},a):5===p?(e[1]=e[1]||{})[s[++h]]=a:6===p?e[1][s[++h]]+=a+"":p?(u=t.apply(a,n(t,a,r,["",null])),e.push(u),a[0]?s[0]|=2:(s[h-2]=0,s[h]=u)):e.push(a)}return e},t=new Map;return function(s){var r=t.get(this);return r||(r=new Map,t.set(this,r)),(r=n(this,r.get(s)||(r.set(s,r=function(n){for(var t,s,r=1,e="",u="",h=[0],p=function(n){1===r&&(n||(e=e.replace(/^\s*\n\s*|\s*\n\s*$/g,"")))?h.push(0,n,e):3===r&&(n||e)?(h.push(3,n,e),r=2):2===r&&"..."===e&&n?h.push(4,n,0):2===r&&e&&!n?h.push(5,0,!0,e):r>=5&&((e||!n&&5===r)&&(h.push(r,0,e,s),r=6),n&&(h.push(r,n,0,s),r=6)),e=""},a=0;a<n.length;a++){a&&(1===r&&p(),p(a));for(var l=0;l<n[a].length;l++)t=n[a][l],1===r?"<"===t?(p(),h=[h],r=3):e+=t:4===r?"--"===e&&">"===t?(r=1,e=""):e=t+e[0]:u?t===u?u="":e+=t:'"'===t||"'"===t?u=t:">"===t?(p(),r=1):r&&("="===t?(r=5,s=e,e=""):"/"===t&&(r<5||">"===n[a][l+1])?(p(),3===r&&(h=h[0]),r=h,(h=h[0]).push(2,0,r),r=0):" "===t||"\t"===t||"\n"===t||"\r"===t?(p(),r=2):e+=t),3===r&&"!--"===e&&(r=4,h=h[0])}return p(),h}(s)),r),arguments,[])).length>1?r:r[0]}
})();

const __HOOKS__ = (function () {
const n = __PREACT__.options;var t,r,u,i,o=0,f=[],c=[],e=n,a=e.__b,v=e.__r,l=e.diffed,m=e.__c,s=e.unmount,d=e.__;function h(n,t){e.__h&&e.__h(r,n,o||t),o=0;var u=r.__H||(r.__H={__:[],__h:[]});return n>=u.__.length&&u.__.push({__V:c}),u.__[n]}function p(n){return o=1,y(D,n)}function y(n,u,i){var o=h(t++,2);if(o.t=n,!o.__c&&(o.__=[i?i(u):D(void 0,u),function(n){var t=o.__N?o.__N[0]:o.__[0],r=o.t(t,n);t!==r&&(o.__N=[r,o.__[1]],o.__c.setState({}))}],o.__c=r,!r.u)){var f=function(n,t,r){if(!o.__c.__H)return!0;var u=o.__c.__H.__.filter(function(n){return!!n.__c});if(u.every(function(n){return!n.__N}))return!c||c.call(this,n,t,r);var i=!1;return u.forEach(function(n){if(n.__N){var t=n.__[0];n.__=n.__N,n.__N=void 0,t!==n.__[0]&&(i=!0)}}),!(!i&&o.__c.props===n)&&(!c||c.call(this,n,t,r))};r.u=!0;var c=r.shouldComponentUpdate,e=r.componentWillUpdate;r.componentWillUpdate=function(n,t,r){if(this.__e){var u=c;c=void 0,f(n,t,r),c=u}e&&e.call(this,n,t,r)},r.shouldComponentUpdate=f}return o.__N||o.__}function _(n,u){var i=h(t++,3);!e.__s&&C(i.__H,u)&&(i.__=n,i.i=u,r.__H.__h.push(i))}function A(n,u){var i=h(t++,4);!e.__s&&C(i.__H,u)&&(i.__=n,i.i=u,r.__h.push(i))}function F(n){return o=5,q(function(){return{current:n}},[])}function T(n,t,r){o=6,A(function(){return"function"==typeof n?(n(t()),function(){return n(null)}):n?(n.current=t(),function(){return n.current=null}):void 0},null==r?r:r.concat(n))}function q(n,r){var u=h(t++,7);return C(u.__H,r)?(u.__V=n(),u.i=r,u.__h=n,u.__V):u.__}function x(n,t){return o=8,q(function(){return n},t)}function P(n){var u=r.context[n.__c],i=h(t++,9);return i.c=n,u?(null==i.__&&(i.__=!0,u.sub(r)),u.props.value):n.__}function V(n,t){e.useDebugValue&&e.useDebugValue(t?t(n):n)}function b(n){var u=h(t++,10),i=p();return u.__=n,r.componentDidCatch||(r.componentDidCatch=function(n,t){u.__&&u.__(n,t),i[1](n)}),[i[0],function(){i[1](void 0)}]}function g(){var n=h(t++,11);if(!n.__){for(var u=r.__v;null!==u&&!u.__m&&null!==u.__;)u=u.__;var i=u.__m||(u.__m=[0,0]);n.__="P"+i[0]+"-"+i[1]++}return n.__}function j(){for(var n;n=f.shift();)if(n.__P&&n.__H)try{n.__H.__h.forEach(z),n.__H.__h.forEach(B),n.__H.__h=[]}catch(t){n.__H.__h=[],e.__e(t,n.__v)}}e.__b=function(n){r=null,a&&a(n)},e.__=function(n,t){n&&t.__k&&t.__k.__m&&(n.__m=t.__k.__m),d&&d(n,t)},e.__r=function(n){v&&v(n),t=0;var i=(r=n.__c).__H;i&&(u===r?(i.__h=[],r.__h=[],i.__.forEach(function(n){n.__N&&(n.__=n.__N),n.__V=c,n.__N=n.i=void 0})):(i.__h.forEach(z),i.__h.forEach(B),i.__h=[],t=0)),u=r},e.diffed=function(n){l&&l(n);var t=n.__c;t&&t.__H&&(t.__H.__h.length&&(1!==f.push(t)&&i===e.requestAnimationFrame||((i=e.requestAnimationFrame)||w)(j)),t.__H.__.forEach(function(n){n.i&&(n.__H=n.i),n.__V!==c&&(n.__=n.__V),n.i=void 0,n.__V=c})),u=r=null},e.__c=function(n,t){t.some(function(n){try{n.__h.forEach(z),n.__h=n.__h.filter(function(n){return!n.__||B(n)})}catch(r){t.some(function(n){n.__h&&(n.__h=[])}),t=[],e.__e(r,n.__v)}}),m&&m(n,t)},e.unmount=function(n){s&&s(n);var t,r=n.__c;r&&r.__H&&(r.__H.__.forEach(function(n){try{z(n)}catch(n){t=n}}),r.__H=void 0,t&&e.__e(t,r.__v))};var k="function"==typeof requestAnimationFrame;function w(n){var t,r=function(){clearTimeout(u),k&&cancelAnimationFrame(t),setTimeout(n)},u=setTimeout(r,100);k&&(t=requestAnimationFrame(r))}function z(n){var t=r,u=n.__c;"function"==typeof u&&(n.__c=void 0,u()),r=t}function B(n){var t=r;n.__c=n.__(),r=t}function C(n,t){return!n||n.length!==t.length||t.some(function(t,r){return t!==n[r]})}function D(n,t){return"function"==typeof t?t(n):t}
return { useCallback: x, useContext: P, useDebugValue: V, useEffect: _, useErrorBoundary: b, useId: g, useImperativeHandle: T, useLayoutEffect: A, useMemo: q, useReducer: y, useRef: F, useState: p };
})();

const { h, render, createContext, Component } = __PREACT__;
const { useState, useMemo, useEffect, useRef, useContext, useCallback } = __HOOKS__;
const html = __HTM__.bind(h);


/* ══ FORMATADORES ══ */
/* O dinheiro da oficina mora numa área só. `brl` é o formatador de tela e
   obedece ao cofre; `brlBruto` é o formatador de contrato — documento,
   mensagem ao cliente, auditoria e exportação nunca podem sair mascarados.
   Quem imprime valor de um registro só (a OS que o cliente está vendo no
   balcão) também usa o bruto: o cofre esconde o resultado do negócio, não o
   orçamento de quem contratou o serviço. */
const COFRE = { aberto: false, sigilo: true, temSenha: false };
const MASCARA_VALOR = 'R$ ••••';
const valorOculto = () => COFRE.sigilo && !COFRE.aberto;

const brlBruto = (n) => (Number(n) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const brlCurtoBruto = (n) => {
  const v = Number(n) || 0;
  if (Math.abs(v) >= 1000) return 'R$ ' + (v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mil';
  return brlBruto(v);
};
const brl = (n) => valorOculto() ? MASCARA_VALOR : brlBruto(n);
const brlCurto = (n) => valorOculto() ? MASCARA_VALOR : brlCurtoBruto(n);
/* CORREÇÃO · o estoque comparava e somava campo cru do banco.
   `select=*` devolve a linha como ela está: coluna nula, coluna que a
   instalação antiga não tem, e número que chega como texto. Três estragos
   diferentes saíam daí, todos silenciosos:
     `p.quantidade <= p.estoque_minimo`  com dois textos vira comparação de
       string — '10' <= '2' é verdadeiro, e a peça com dez na prateleira
       entrava na conta de "a repor";
     `p.quantidade === 0`                com o texto '0' é falso, e a peça
       zerada não era contada;
     `p.quantidade * p.custo_medio`      com coluna ausente vira NaN, que os
       formatadores transformam em R$ 0,00 — número errado com cara de certo.
   `num` é o único ponto de entrada de número do estoque daqui para a frente. */
const num = (v) => {
  if (typeof v === 'number') return isFinite(v) ? v : 0;
  if (v == null || v === '') return 0;
  const n = Number(v);
  return isFinite(n) ? n : 0;
};

const inteiro = (n) => (Number(n) || 0).toLocaleString('pt-BR');
const pct = (n) => (Number(n) || 0).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%';
const digitos = (s) => String(s || '').replace(/\D/g, '');

const fmtDoc = (d) => {
  const v = digitos(d);
  if (v.length === 11) return v.slice(0,3) + '.' + v.slice(3,6) + '.' + v.slice(6,9) + '-' + v.slice(9);
  if (v.length === 14) return v.slice(0,2) + '.' + v.slice(2,5) + '.' + v.slice(5,8) + '/' + v.slice(8,12) + '-' + v.slice(12);
  return d || '—';
};
const mascDoc = (d) => {
  const v = digitos(d);
  if (v.length === 11) return '***.' + v.slice(3,6) + '.' + v.slice(6,9) + '-**';
  if (v.length === 14) return '**.' + v.slice(2,5) + '.' + v.slice(5,8) + '/****-**';
  return '—';
};
/* ─── FASE 13.9 · NÚMERO ESCRITO COMO SE ESCREVE NO BRASIL ─────────────────
   O sistema lia valor com `Number(campo.value)`. Em JavaScript o ponto é
   separador DECIMAL: `Number('5.000')` devolve 5, não cinco mil. Quem digitava
   o preço do jeito daqui lançava peça de cinco mil reais por cinco — e a
   margem saía em -99.900%, como apareceu no orçamento do motor.

   Pior: o campo era `type="number"` com `placeholder="0,00"`. Ele ensinava a
   digitar vírgula e o navegador descartava a vírgula, zerando o campo. As duas
   formas naturais de escrever dinheiro no Brasil estavam quebradas.        */
function numeroBR(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  let t = String(v ?? '').trim().replace(/\s|R\$/gi, '');
  if (!t) return 0;
  const negativo = t.startsWith('-');
  t = t.replace(/[^0-9.,]/g, '');
  if (!t) return 0;
  const ponto = t.includes('.'), virgula = t.includes(',');
  let n;
  if (ponto && virgula) {
    /* Os dois presentes: manda o último. Cobre 1.234,56 (daqui) e 1,234.56
       (de fora), que aparece quando o valor vem colado de planilha. */
    n = t.lastIndexOf('.') > t.lastIndexOf(',')
      ? Number(t.replace(/,/g, ''))
      : Number(t.replace(/\./g, '').replace(',', '.'));
  } else if (virgula) {
    n = Number(t.replace(',', '.'));
  } else if (ponto) {
    /* Só ponto é ambíguo. Grupos exatos de três dígitos são milhar —
       "5.000" e "1.234.567". Qualquer outra coisa é decimal: "10.50",
       "5.5". A regra erra em quem escreve "10.500" querendo dez e meio,
       que não é como ninguém escreve dinheiro aqui. */
    n = /^\d{1,3}(\.\d{3})+$/.test(t) ? Number(t.replace(/\./g, '')) : Number(t);
  } else n = Number(t);
  if (!Number.isFinite(n)) return 0;
  return negativo ? -n : n;
}
/** Só a parte inteira, para quilometragem, ano e quantidade. */
const inteiroBR = (v) => Math.trunc(numeroBR(v));

const fmtTel = (t) => {
  const v = digitos(t);
  if (v.length === 13 && v.startsWith('55')) return fmtTel(v.slice(2));
  if (v.length === 12 && v.startsWith('55')) return fmtTel(v.slice(2));
  if (v.length === 11) return '(' + v.slice(0,2) + ') ' + v.slice(2,7) + '-' + v.slice(7);
  if (v.length === 10) return '(' + v.slice(0,2) + ') ' + v.slice(2,6) + '-' + v.slice(6);
  return t || '—';
};

/* ─── FASE 13 · TELEFONE QUE SERVE PARA ALGUMA COISA ───────────────────────
   O campo era texto livre e gravava com `digitos()`: saía `11940198651`, sem
   código de país. O WhatsApp exige o número internacional inteiro — sem o
   `55` na frente o endereço `wa.me` abre uma conversa vazia com um número
   que não existe, que é como a oficina descobre o problema: mandando o
   orçamento para o vazio.

   Aqui o campo passa a se formatar enquanto a pessoa digita, e a conversão
   para o formato do WhatsApp acontece num lugar só. */

/** Máscara progressiva: (11) 94019-8651. Aceita colar com ou sem o 55. */
const mascararTel = (bruto) => {
  let v = digitos(bruto).slice(0, 13);
  if (v.length > 11 && v.startsWith('55')) v = v.slice(2);
  v = v.slice(0, 11);
  if (v.length <= 2) return v.length ? '(' + v : '';
  if (v.length <= 6) return '(' + v.slice(0, 2) + ') ' + v.slice(2);
  if (v.length <= 10) return '(' + v.slice(0, 2) + ') ' + v.slice(2, 6) + '-' + v.slice(6);
  return '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
};

/** Só os dígitos nacionais, sem DDI: é o que vai para o banco. */
const telNacional = (t) => {
  let v = digitos(t);
  if (v.length > 11 && v.startsWith('55')) v = v.slice(2);
  return v.slice(0, 11);
};

/** Celular brasileiro: 11 dígitos, DDD válido, nono dígito 9.
    Fixo de 10 dígitos passa, mas não recebe WhatsApp — o aviso diz isso. */
const telValido = (t) => {
  const v = telNacional(t);
  if (v.length !== 10 && v.length !== 11) return false;
  const ddd = Number(v.slice(0, 2));
  if (ddd < 11 || ddd > 99) return false;
  return v.length === 10 || v[2] === '9';
};
const telEhCelular = (t) => telNacional(t).length === 11 && telNacional(t)[2] === '9';

/** Formato exigido pelo endereço wa.me: 55 + DDD + número, sem sinal algum. */
const telWhatsApp = (t) => {
  const v = telNacional(t);
  return v.length >= 10 ? '55' + v : '';
};
/* "2026-07-28" é lido como meia-noite UTC pelo construtor de Date — no Brasil
   isso cai às 21h do dia anterior. Datas sem hora precisam ser montadas como
   locais, senão o caixa do dia sai vazio e o vencimento aparece um dia antes. */
const dataLocal = (v) => {
  if (v instanceof Date) return v;
  const t = String(v || '');
  const m = t.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(t);
};

const fmtData = (iso) => iso ? dataLocal(iso).toLocaleDateString('pt-BR') : '—';
const fmtDataLonga = (iso) => iso ? dataLocal(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';
const fmtMesAno = (iso) => new Date(iso).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }).replace('.', '');
const diasDesde = (iso) => Math.max(0, Math.floor((Date.now() - dataLocal(iso).getTime()) / 86400000));
/* Vencimento é data, não instante. Comparar meia-noite com "agora" fazia o
   título que vence hoje nascer vencido ("Vencido há 0d") e o orçamento que
   venceu ontem dizer que ainda vale ("vence em 0 dias"). Os dois lados
   passam a ser o começo do dia. */
const comecoDoDia = (v) => { const d = v ? dataLocal(v) : new Date(); d.setHours(0, 0, 0, 0); return d; };
const diasAte = (iso) => Math.round((comecoDoDia(iso).getTime() - comecoDoDia().getTime()) / 86400000);
const venceu = (iso) => Boolean(iso) && diasAte(iso) < 0;
const mesesDesde = (iso) => Math.floor(diasDesde(iso) / 30.44);
const somaDiasData = (iso, d) => new Date(dataLocal(iso).getTime() + d * 86400000);
const somaDias = (iso, d) => somaDiasData(iso, d).toISOString();
const iniciais = (nome) => String(nome || '?').trim().split(/\s+/).slice(0, 2).map(p => p[0]).join('').toUpperCase();

/* AUDITORIA: `new Date().toISOString().slice(0,10)` devolve a data em UTC.
   Em São Paulo, das 21h à meia-noite o UTC já está no dia seguinte — o
   recebimento das 22h caía no caixa de amanhã, o vencimento nascia um dia
   adiantado e o fechamento do dia não batia com o dinheiro na gaveta.
   Toda data gravada passa a nascer daqui. */
const iso10 = (d) => {
  const x = d instanceof Date ? d : new Date(d || Date.now());
  return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0')
       + '-' + String(x.getDate()).padStart(2, '0');
};
const hojeISO = () => iso10(new Date());

const validaPlaca = (p) => /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(String(p || '').toUpperCase().replace(/[^A-Z0-9]/g, ''));
/* AUDITORIA: a validação só contava dígitos. Todo CPF e CNPJ da base de
   demonstração deste arquivo tem dígito verificador ERRADO e passava. Em
   produção isso vira nota fiscal recusada e cobrança que não sai — e o erro
   só aparece meses depois, quando ninguém lembra do cadastro. O banco agora
   confere de verdade; aqui a tela avisa antes de mandar. */
const validaCPF = (d) => {
  const v = digitos(d);
  if (v.length !== 11 || /^(\d)\1{10}$/.test(v)) return false;
  let s = 0;
  for (let i = 0; i < 9; i++) s += +v[i] * (10 - i);
  let d1 = 11 - (s % 11); if (d1 >= 10) d1 = 0;
  s = 0;
  for (let i = 0; i < 10; i++) s += +v[i] * (11 - i);
  let d2 = 11 - (s % 11); if (d2 >= 10) d2 = 0;
  return d1 === +v[9] && d2 === +v[10];
};
const validaCNPJ = (d) => {
  const v = digitos(d);
  if (v.length !== 14 || /^(\d)\1{13}$/.test(v)) return false;
  const conta = (base, pesos) => {
    const s = pesos.reduce((t, p, i) => t + +base[i] * p, 0) % 11;
    return s < 2 ? 0 : 11 - s;
  };
  const d1 = conta(v, [5,4,3,2,9,8,7,6,5,4,3,2]);
  const d2 = conta(v, [6,5,4,3,2,9,8,7,6,5,4,3,2]);
  return d1 === +v[12] && d2 === +v[13];
};
const validaDoc = (d) => { const v = digitos(d); return validaCPF(v) || validaCNPJ(v); };
/* AUDITORIA: era 'x' + Math.random(), 8 caracteres. Dois problemas: o banco
   espera uuid, e 8 caracteres de Math.random colidem — com 10 mil registros a
   chance de duas linhas nascerem com o mesmo id passa de 1%, e a colisão
   sobrescreve o registro anterior sem aviso nenhum. */
const novoId = () => (crypto.randomUUID ? crypto.randomUUID()
  : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    }));

const checklistVazio = () => ({
  hora_entrada: new Date().toISOString(),
  combustivel: '1/2', itens: [], avarias: [], observacoes: '',
});

/* A oficina escolhe uma cor; o sistema deriva os tons a partir dela.
   Pedir cinco cores ao usuário garantiria combinação ruim. */
const hexRgb = (h) => [1, 3, 5].map(i => parseInt(String(h).slice(i, i + 2), 16) || 0);
const rgbHex = (a) => '#' + a.map(x => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('');
const escurecer = (h, f) => rgbHex(hexRgb(h).map(c => c * f));
const clarear   = (h, f) => rgbHex(hexRgb(h).map(c => c + (255 - c) * f));

/* ══ DOMÍNIO ══ */
const ETAPAS = [
  { id:'entrada',     nome:'Recepção',             curto:'Recepção',    situacao:'aberto' },
  { id:'diagnostico', nome:'Diagnóstico',          curto:'Diagnóstico', situacao:'aberto' },
  { id:'orcamento',   nome:'Orçamento',            curto:'Orçamento',   situacao:'aberto' },
  { id:'aprovacao',   nome:'Aguardando aprovação', curto:'Aprovação',   situacao:'aguardando' },
  { id:'execucao',    nome:'Em execução',          curto:'Execução',    situacao:'execucao' },
  { id:'pecas',       nome:'Aguardando peças',     curto:'Peças',       situacao:'aguardando' },
  { id:'finalizacao', nome:'Finalização',          curto:'Finalização', situacao:'execucao' },
  { id:'lavagem',     nome:'Lavagem',              curto:'Lavagem',     situacao:'execucao' },
  { id:'entrega',     nome:'Pronto para entrega',  curto:'Entrega',     situacao:'pronto' },
];
const TERMINAIS = {
  concluida: { id:'concluida', nome:'Concluída', curto:'Concluída', situacao:'finalizado' },
  cancelada: { id:'cancelada', nome:'Cancelada', curto:'Cancelada', situacao:'cancelado' },
};
const etapaPor = (id) => ETAPAS.find(e => e.id === id) || TERMINAIS[id] || { id, nome:id, curto:id, situacao:'aberto' };
const etapaNome = (id) => etapaPor(id).nome;
const etapaIndice = (id) => ETAPAS.findIndex(e => e.id === id);
const ehAtiva = (o) => o.etapa !== 'concluida' && o.etapa !== 'cancelada';

const SITUACOES = {
  aberto:{nome:'Em aberto',selo:''}, aguardando:{nome:'Aguardando',selo:'alerta'},
  execucao:{nome:'Em execução',selo:'info'}, pronto:{nome:'Pronto',selo:'ciano'},
  finalizado:{nome:'Finalizado',selo:'ok'}, cancelado:{nome:'Cancelado',selo:'erro'},
};

/* Capacidades em vez de cargos: um sistema que pergunta "esse papel é gerente?"
   precisa ser reescrito a cada cargo novo; um que pergunta "esse papel pode
   excluir?" só ganha uma linha na tabela abaixo. */
const CAPACIDADES = [
  ['ver',        'Visualizar'],
  ['criar',      'Criar registros'],
  ['editar',     'Editar registros'],
  ['excluir',    'Excluir registros'],
  ['custo',      'Custo de peça e margem'],
  ['financeiro', 'Financeiro'],
  ['gestao',     'Relatórios e automações'],
  ['auditoria',  'Auditoria'],
  ['usuarios',   'Gerenciar usuários'],
  ['config',     'Configurações da oficina'],
  ['restaurar',  'Restaurar backup'],
];

const PAPEIS = {
  dono: { nome:'Dono', descricao:'Acesso total, inclusive restaurar backup',
    pode:['ver','criar','editar','excluir','custo','financeiro','gestao','auditoria','usuarios','config','restaurar'] },
  gerente: { nome:'Gerente', descricao:'Opera e administra, mas não sobrescreve a base',
    pode:['ver','criar','editar','excluir','custo','financeiro','gestao','auditoria','usuarios','config'] },
  atendente: { nome:'Atendente', descricao:'Balcão: cadastra, abre ordem e recebe',
    pode:['ver','criar','editar','financeiro_parcial'] },
  mecanico: { nome:'Mecânico', descricao:'Bancada: vê a ordem e move a etapa, sem preço de custo',
    pode:['ver','editar'] },
  limitado: { nome:'Consulta', descricao:'Só leitura, para estagiário ou contador',
    pode:['ver'] },
};

const pode = (papel, cap) => Boolean(PAPEIS[papel]?.pode.includes(cap));

/* Atalhos herdados das fases anteriores, agora derivados das capacidades. */
Object.entries(PAPEIS).forEach(([id, p]) => {
  p.custo = pode(id, 'custo');
  p.financeiro = pode(id, 'financeiro') ? true : (p.pode.includes('financeiro_parcial') ? 'parcial' : false);
  p.cadastro = pode(id, 'criar');
  p.gestao = pode(id, 'gestao');
});

/* ══ CHECKLIST DE ENTRADA ══ */
const NIVEIS_COMBUSTIVEL = ['Reserva', '1/4', '1/2', '3/4', 'Cheio'];

const ITENS_VEICULO = ['Documento', 'Estepe', 'Macaco', 'Chave de roda', 'Triângulo',
  'Extintor', 'Tapetes', 'Multimídia', 'Carregador', 'Chave reserva'];

const TIPOS_AVARIA = ['Risco', 'Amassado', 'Trinca', 'Falta peça', 'Pintura desgastada', 'Farol/lanterna'];

/* Vista superior do carro. Marcar a avaria tocando no lugar é mais rápido no
   balcão do que preencher um formulário — e sai igual no papel. */
const ZONAS_CARRO = [
  { id:'pc_diant',  nome:'Para-choque dianteiro', curto:'P.C.',  x:18, y:10,  w:84, h:14 },
  { id:'capo',      nome:'Capô',                  curto:'Capô',  x:18, y:26,  w:84, h:30 },
  { id:'pl_esq',    nome:'Para-lama esquerdo',    curto:'PL',    x:18, y:58,  w:12, h:16 },
  { id:'parabrisa', nome:'Para-brisa',            curto:'Vidro', x:30, y:58,  w:60, h:16 },
  { id:'pl_dir',    nome:'Para-lama direito',     curto:'PL',    x:90, y:58,  w:12, h:16 },
  { id:'porta_de',  nome:'Porta dianteira esq.',  curto:'DE',    x:18, y:76,  w:12, h:30 },
  { id:'teto',      nome:'Teto',                  curto:'Teto',  x:30, y:76,  w:60, h:56 },
  { id:'porta_dd',  nome:'Porta dianteira dir.',  curto:'DD',    x:90, y:76,  w:12, h:30 },
  { id:'porta_te',  nome:'Porta traseira esq.',   curto:'TE',    x:18, y:108, w:12, h:24 },
  { id:'porta_td',  nome:'Porta traseira dir.',   curto:'TD',    x:90, y:108, w:12, h:24 },
  { id:'vidro_tras',nome:'Vidro traseiro',        curto:'Vidro', x:30, y:134, w:60, h:14 },
  { id:'tampa',     nome:'Tampa traseira',        curto:'Tampa', x:18, y:150, w:84, h:28 },
  { id:'pc_tras',   nome:'Para-choque traseiro',  curto:'P.C.',  x:18, y:180, w:84, h:14 },
];
const OUTROS_LOCAIS = ['Rodas', 'Vidros laterais', 'Interior', 'Compartimento do motor', 'Faróis e lanternas'];
const localNome = (id) => ZONAS_CARRO.find(z => z.id === id)?.nome || id;

const TIPOS_ANEXO = [
  { id:'entrada',     nome:'Foto de entrada',  icone:'camera' },
  { id:'servico',     nome:'Foto do serviço',  icone:'chave' },
  { id:'peca',        nome:'Foto de peça',     icone:'caixa' },
  { id:'documento',   nome:'Documento',        icone:'arquivo' },
  { id:'nota',        nome:'Nota fiscal',      icone:'arquivo' },
  { id:'comprovante', nome:'Comprovante',      icone:'carteira' },
];
const LIMITE_ANEXO = 1.5 * 1024 * 1024;   // 1,5 MB por arquivo

const STATUS_ORCAMENTO = {
  rascunho:   { nome:'Em elaboração',        selo:'' },
  aguardando: { nome:'Aguardando aprovação', selo:'alerta' },
  aprovado:   { nome:'Aprovado',             selo:'ok' },
  recusado:   { nome:'Recusado',             selo:'erro' },
  expirado:   { nome:'Expirado',             selo:'erro' },
};

/* FASE 13: esta lista era fixa, com iniciais no lugar do identificador —
   'CS', 'AR', 'JN'. A coluna `mecanico_id` do banco é uuid e referencia
   `usuarios`: 'CS' derrubava a ordem inteira por sintaxe inválida, e o
   responsável mostrado na tela era um funcionário que não existia na
   oficina. Com banco, a equipe real substitui a de demonstração na carga. */
let MECANICOS = [
  { id:'CS', nome:'Carlos Santana' }, { id:'AR', nome:'Ana Ribeiro' }, { id:'JN', nome:'Jorge Nunes' },
];
const sincronizarMecanicos = (usuarios) => {
  const equipe = (usuarios || []).filter(u => u.ativo !== false && u.id && u.nome)
    .map(u => ({ id: u.id, nome: u.nome, papel: u.papel }));
  if (equipe.length) MECANICOS = equipe;
};
const mecanicoNome = (id) => {
  if (!id) return 'Sem responsável definido';
  return MECANICOS.find(m => m.id === id)?.nome || id;
};

const NAV = [
  { grupo:'Operação' },
  { id:'painel',     nome:'Painel',            icone:'painel' },
  { id:'patio',      nome:'Pátio',             icone:'colunas' },
  { id:'ordens',     nome:'Ordens de serviço', icone:'prancheta' },
  { id:'preventiva', nome:'Preventiva',        icone:'faisca' },
  { id:'garantias',  nome:'Garantias',         icone:'check' },
  { id:'agenda',     nome:'Agenda',            icone:'calendario' },
  { grupo:'Cadastros' },
  { id:'clientes',   nome:'Clientes',          icone:'pessoas' },
  { id:'veiculos',   nome:'Veículos',          icone:'carro' },
  { id:'estoque',    nome:'Estoque',           icone:'caixa' },
  { grupo:'Gestão' },
  { id:'financeiro', nome:'Contas e caixa',    icone:'carteira' },
  { id:'relatorios', nome:'Relatórios',        icone:'grafico' },
  { id:'automacoes', nome:'Automações',        icone:'raio' },
  { id:'auditoria',  nome:'Auditoria',         icone:'arquivo' },
  { id:'ajustes',    nome:'Ajustes',           icone:'engrenagem' },
];
const NAV_MOBILE = ['painel', 'patio', 'nova', 'clientes', 'mais'];

/* ══ ÍCONES — traçado inline, sem dependência de biblioteca ══ */
const TRACOS = {
  painel:'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',
  colunas:'M4 4h4v16H4zM10 4h4v11h-4zM16 4h4v16h-4z',
  prancheta:'M9 3h6v4H9zM6 5H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1M8 12h8M8 16h5',
  pessoas:'M16 20v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8M22 20v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  pessoa:'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 1 0 8 4 4 0 0 1 0-8',
  carro:'M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13M5 13h14v5H5zM7 18v2M17 18v2M7.5 15.5h.01M16.5 15.5h.01',
  caixa:'M21 8l-9-5-9 5 9 5zM3 8v8l9 5 9-5V8M12 13v8',
  carteira:'M3 7a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM17 12h.01M3 9h18',
  calendario:'M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 9h18M8 3v4M16 3v4',
  grafico:'M4 20V10M10 20V4M16 20v-7M22 20H2',
  raio:'M13 2 4 14h7l-1 8 9-12h-7l1-8z',
  engrenagem:'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.1-2.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3 1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1 2.7H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z',
  busca:'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16M21 21l-4.3-4.3',
  mais:'M12 5v14M5 12h14', x:'M18 6 6 18M6 6l12 12',
  sino:'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  sol:'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  lua:'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8',
  cima:'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
  baixo:'M23 18l-9.5-9.5-5 5L1 6M17 18h6v-6',
  alerta:'M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
  check:'M20 6 9 17l-5-5',
  relogio:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M12 6v6l4 2',
  chave:'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.8-3.8a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9l-3.8 3.8z',
  seta:'M5 12h14M12 5l7 7-7 7', voltar:'M19 12H5M12 19l-7-7 7-7',
  menu:'M4 6h16M4 12h16M4 18h16',
  lixo:'M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6',
  camera:'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  faisca:'M12 3v3M12 18v3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M3 12h3M18 12h3M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6',
  telefone:'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z',
  mensagem:'M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 20.5l1.5-5.2A8.4 8.4 0 0 1 3.6 11a8.4 8.4 0 0 1 8.4-9 8.4 8.4 0 0 1 9 8.5z',
  imprimir:'M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z',
  arquivo:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
  alvo:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4',
  lapis:'M4 20h4L19.5 8.5a2.8 2.8 0 0 0-4-4L4 16zM14.5 5.5l4 4',
  historico:'M3 3v5h5M3.05 13A9 9 0 1 0 6 5.3L3 8M12 7v5l4 2',
};
const Icone = ({ nome, tam = 17, cor }) => html`
  <svg width=${tam} height=${tam} viewBox="0 0 24 24" fill="none" stroke=${cor || 'currentColor'}
       stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex-shrink:0">
    <path d=${TRACOS[nome] || ''} />
  </svg>`;

/* ══════════════════════════════════════════════════════════════════════════
   DADOS
   A base é fixa; o histórico é gerado a partir de modelos de serviço com
   sorteio determinístico. Sem passado, relatórios e prontuários ficariam
   vazios e não haveria como julgar se prestam.
   ══════════════════════════════════════════════════════════════════════════ */


/* AUDITORIA: lia de uma lista fixa dentro do arquivo. Com isso o pacote
   "Revisão completa" inseria na ordem uma pastilha Bosch a R$ 258 numa
   oficina que nunca cadastrou essa peça — e o item saía com um `peca_id`
   que não existe no estoque dela, quebrando a baixa e o custo. Agora a
   busca é no catálogo real; o pacote é sugestão, o preço é dela. */
let CATALOGO_ATUAL = [];
const pecaPorCodigo = (c) => CATALOGO_ATUAL.find(p => String(p.codigo).toUpperCase() === String(c).toUpperCase());

/** Pacotes de serviço: a oficina repete os mesmos combos o ano inteiro. */
/* `mo` é o preço da mão de obra; `hh` é o custo da hora do mecânico nela.
   Serviço com custo zero inflaria a margem e desativaria o piso de 30%. */
const MODELOS_SERVICO = [
  { nome:'Revisão completa',         mo:890, hh:400, pecas:[['OLE-5W30',4],['FIL-0091',1],['FIL-0142',1]] },
  { nome:'Troca de óleo e filtros',  mo:180, hh:75,  pecas:[['OLE-5W30',4],['FIL-0091',1]] },
  { nome:'Freio dianteiro',          mo:340, hh:150, pecas:[['FRE-0118',1],['FRE-0224',1]] },
  { nome:'Suspensão traseira',       mo:520, hh:245, pecas:[['SUS-0330',2],['SUS-0512',2]] },
  { nome:'Ar-condicionado',          mo:640, hh:280, pecas:[['ARC-R134',1],['FIL-0142',1]] },
  { nome:'Revisão elétrica',         mo:290, hh:130, pecas:[['ELE-0077',4],['BAT-0060',1]] },
  { nome:'Embreagem',                mo:980, hh:470, pecas:[['EMB-0450',1]] },
  { nome:'Correia dentada',          mo:780, hh:360, pecas:[['COR-0210',1]] },
  { nome:'Troca de pneus',           mo:220, hh:90,  pecas:[['PNE-2656',4]] },
];

/* Intervalos de referência por serviço. Alimentam a manutenção preventiva,
   as recomendações e os alertas — uma tabela só, um lugar para ajustar. */
const INTERVALOS = [
  { servico:'Troca de óleo e filtros', km:10000, meses:12, peso:3 },
  { servico:'Revisão completa',        km:20000, meses:12, peso:3 },
  { servico:'Freio dianteiro',         km:30000, meses:24, peso:3 },
  { servico:'Ar-condicionado',         km:20000, meses:12, peso:1 },
  { servico:'Revisão elétrica',        km:40000, meses:36, peso:2 },
  { servico:'Suspensão traseira',      km:60000, meses:48, peso:1 },
  { servico:'Troca de pneus',          km:50000, meses:48, peso:3 },
  { servico:'Correia dentada',         km:60000, meses:48, peso:3 },
  { servico:'Embreagem',               km:80000, meses:72, peso:1 },
];


/* ══════════════════════════════════════════════════════════════════════════
   BASE INICIAL
   O sistema nasce vazio. A oficina que recebe o arquivo cadastra os próprios
   clientes, veículos e peças — nada de nome, placa ou valor inventado
   aparecendo na tela de quem está trabalhando de verdade.

   Conectado ao banco esta função nem chega a ser usada: `carregarDoBanco`
   substitui tudo antes da primeira tela. Ela existe para o arquivo abrir
   sozinho, sem conexão, e para o link do cliente funcionar.
   ══════════════════════════════════════════════════════════════════════════ */
function gerarDados() {
  return {
    clientes: [], veiculos: [], pecas: [], ordens: [], itens: [], eventos: [],
    lancamentos: [], usuarios: [], auditoria: [], tarefas: [], agendamentos: [],
    anexos: [], backups: [], lidos: [],

    /* Duas listas nascem preenchidas de propósito: são configuração, não
       dado de cliente. A oficina liga, desliga e reescreve como quiser. */
    automacoes: [
      { id:'a1', nome:'Lembrete de revisão',          gatilho:'Veículo passou de 10.000 km desde a última revisão', canal:'whatsapp', ativa:false },
      { id:'a2', nome:'Retorno de cliente inativo',   gatilho:'Cliente sem visita há mais de 6 meses',              canal:'whatsapp', ativa:false },
      { id:'a3', nome:'Orçamento sem resposta',       gatilho:'Aguardando aprovação há mais de 3 dias',             canal:'whatsapp', ativa:false },
      { id:'a4', nome:'Veículo pronto para retirada', gatilho:'Ordem entra na etapa de entrega',                    canal:'whatsapp', ativa:false },
      { id:'a5', nome:'Cobrança de título vencido',   gatilho:'Conta a receber vence sem baixa',                    canal:'email',    ativa:false },
      { id:'a6', nome:'Pesquisa de satisfação',       gatilho:'Três dias após a entrega do veículo',                canal:'email',    ativa:false },
    ],
    modelosMensagem: [
      { id:'mm1', nome:'Veículo em andamento', gatilho:'Cliente pergunta como está o carro',
        texto:'Olá, {{cliente}}! Seu {{veiculo}} está em {{etapa}} aqui na {{oficina}}. A previsão de entrega é {{previsao}}. Qualquer novidade eu aviso por aqui.' },
      { id:'mm2', nome:'Orçamento para aprovação', gatilho:'Orçamento pronto e enviado',
        texto:'Olá, {{cliente}}! O orçamento do {{veiculo}} ficou em {{total}}, sendo {{pecas}} em peças e {{maodeobra}} em mão de obra. Vale até {{validade}}. Posso liberar o serviço?' },
      { id:'mm3', nome:'Veículo pronto', gatilho:'Ordem entra em entrega',
        texto:'Boa notícia, {{cliente}}! O {{veiculo}} está pronto para retirada na {{oficina}}. Estamos abertos de segunda a sexta até as 18h e sábado até as 12h.' },
      { id:'mm4', nome:'Lembrete de revisão', gatilho:'Veículo atinge o intervalo previsto',
        texto:'Olá, {{cliente}}! O {{veiculo}} já rodou {{km}} desde a última {{servico}} aqui. Quer que eu reserve um horário nesta semana?' },
      { id:'mm5', nome:'Agradecimento após a entrega', gatilho:'Três dias depois da entrega',
        texto:'Oi, {{cliente}}! Passando para saber se está tudo certo com o {{veiculo}}. Se aparecer qualquer coisa, é só chamar — o serviço tem garantia de 90 dias.' },
    ],
    oficina: { ...OFICINA_PADRAO },
  };
}

/* ══ CUSTO INTERNO E LUCRO ═════════════════════════════════════════════════
   O vocabulário do dinheiro da peça passa a ser um só, e ele mora aqui.

   "Custo da Oficina" é o que a peça custou para entrar na prateleira. Nunca
   sai desta máquina: não vai para o pacote do portal, não entra no PDF e não
   aparece para papel sem a capacidade `custo`. "Valor para o Cliente" é o
   que está no orçamento — é o único número que o cliente lê.

   As colunas do banco continuam `custo_medio`/`preco_venda` (peça) e
   `custo_unitario`/`preco_unitario` (item da ordem). Renomear coluna
   quebraria a sincronia com quem já tem base gravada; o que muda é o nome
   na tela, que é onde a confusão acontecia.                                */
const CUSTO_OFICINA = 'Custo da Oficina';
const VALOR_CLIENTE = 'Valor para o Cliente';

/** Lucro de uma unidade. Aceita texto do formulário ou número do banco. */
const lucroUnitario = (custo, valor) => numeroBR(valor) - numeroBR(custo);
/** Lucro da linha inteira da ordem, já multiplicado pela quantidade. */
const lucroDoItem = (i) => (Number(i.quantidade) || 0) * lucroUnitario(i.custo_unitario, i.preco_unitario);
/** Margem sobre o valor cobrado. Sem valor cobrado não há margem a declarar. */
const margemDe = (custo, valor) => {
  const v = numeroBR(valor);
  return v > 0 ? (lucroUnitario(custo, valor) / v) * 100 : 0;
};

/* ══════════════════════════════════════════════════════════════════════════
   CÁLCULOS — a margem sempre considera o desconto
   ══════════════════════════════════════════════════════════════════════════ */
function totaisDaOS(itens, desconto = 0) {
  const venda = itens.reduce((s, i) => s + i.quantidade * i.preco_unitario, 0);
  const custo = itens.reduce((s, i) => s + i.quantidade * i.custo_unitario, 0);
  const pecas = itens.filter(i => i.tipo === 'peca').reduce((s, i) => s + i.quantidade * i.preco_unitario, 0);
  const servicos = venda - pecas;
  const liquido = venda - desconto;
  const margem = liquido > 0 ? ((liquido - custo) / liquido) * 100 : 0;
  return { venda, custo, pecas, servicos, desconto, liquido, margem, lucro: liquido - custo };
}

/** Índices montados uma vez por recálculo. Sem eles, cada ordem varria a
    lista inteira de itens: quadrático, e a interface travava com base grande. */
function montarIndices(d) {
  const itensPorOS = new Map();
  (d.itens || []).forEach(i => {
    const lista = itensPorOS.get(i.os_id);
    if (lista) lista.push(i); else itensPorOS.set(i.os_id, [i]);
  });
  const agrupar = (arr, chave) => {
    const m = new Map();
    (arr || []).forEach(x => { const k = x[chave]; const l = m.get(k); if (l) l.push(x); else m.set(k, [x]); });
    return m;
  };
  return {
    itensPorOS,
    veiculoPorId: new Map((d.veiculos || []).map(v => [v.id, v])),
    clientePorId: new Map((d.clientes || []).map(c => [c.id, c])),
    eventosPorOS: agrupar(d.eventos, 'os_id'),
  };
}

/** Status do orçamento, derivado. Guardar em coluna daria dois lugares para a
    mesma verdade — e um deles ficaria desatualizado. */
function statusDoOrcamento(o) {
  if (o.recusado_em) return 'recusado';
  if (o.aprovada_em) return 'aprovado';
  if (o.etapa !== 'aprovacao') return 'rascunho';
  const vence = somaDias(o.aberta_em, o.validade_dias || VALIDADE_PADRAO);
  return new Date(vence) < new Date() ? 'expirado' : 'aguardando';
}

function comporOS(o, d, ix) {
  const idx = ix || montarIndices(d);
  const itens = idx.itensPorOS.get(o.id) || [];
  return {
    ...o,
    veiculo: idx.veiculoPorId.get(o.veiculo_id),
    cliente: idx.clientePorId.get(o.cliente_id),
    itens,
    totais: totaisDaOS(itens, o.desconto),
    dias: diasDesde(o.aberta_em),
    situacao: etapaPor(o.etapa).situacao,
    statusOrcamento: statusDoOrcamento(o),
    // Só ordem viva tem validade a exibir; calcular para as 6 mil concluídas
    // custava um toISOString cada, sem nenhum uso.
    validade: (o.aberta_em && ehAtiva(o)) ? somaDias(o.aberta_em, o.validade_dias || VALIDADE_PADRAO) : null,
    checklist: o.checklist || null,
    // Garantia só existe depois da entrega — antes disso não há o que garantir.
    // Guardada como Date: converter para texto aqui custava um toISOString por
    // ordem concluída, e são milhares.
    garantiaAte: o.concluida_em ? somaDiasData(o.concluida_em, o.garantia_dias || GARANTIA_PADRAO) : null,
    tsConcluida: o.concluida_em ? dataLocal(o.concluida_em).getTime() : null,
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   MANUTENÇÃO PREVENTIVA
   Projeta o próximo serviço de cada veículo cruzando quilometragem, data da
   última execução e ritmo de rodagem medido nas passagens anteriores.
   ══════════════════════════════════════════════════════════════════════════ */
function planoDoVeiculo(v, concluidas) {
  if (concluidas.length === 0) return { kmDia: null, itens: [] };

  const primeira = concluidas[concluidas.length - 1];
  const diasCorridos = diasDesde(primeira.concluida_em);
  const kmRodados = v.km_atual - primeira.km_entrada;
  // Ritmo próprio do veículo; sem histórico suficiente, média de mercado.
  const kmDia = (diasCorridos > 25 && kmRodados > 0) ? kmRodados / diasCorridos : 42;

  const itens = INTERVALOS.map(iv => {
    const feita = concluidas.find(o => o.itens.some(i => i.tipo === 'servico' && i.descricao === iv.servico));
    const baseKm = feita ? feita.km_entrada : primeira.km_entrada;
    const baseData = feita ? feita.concluida_em : primeira.concluida_em;

    const kmDesde = Math.max(0, v.km_atual - baseKm);
    const kmFalta = iv.km - kmDesde;
    const mesesDesdeBase = mesesDesde(baseData);
    const mesesFalta = iv.meses - mesesDesdeBase;
    const diasPorKm = kmFalta > 0 ? Math.round(kmFalta / Math.max(kmDia, 1)) : 0;
    const diasPorTempo = mesesFalta > 0 ? Math.round(mesesFalta * 30.44) : 0;
    const diasFalta = Math.min(diasPorKm, diasPorTempo);

    const passou = kmFalta <= 0 || mesesFalta <= 0;
    /* Sem execução registrada aqui não dá para afirmar que venceu — o cliente
       pode ter feito em outro lugar. Vira pendência de confirmação, não alerta. */
    const situacao = !feita
      ? (passou && concluidas.length >= 2 ? 'sem_registro' : 'ok')
      : passou ? 'vencido' : (diasFalta <= 45 ? 'proximo' : 'ok');

    return {
      servico: iv.servico, intervaloKm: iv.km, intervaloMeses: iv.meses, peso: iv.peso,
      nunca: !feita, baseKm, baseData, kmDesde, kmFalta, mesesFalta, diasFalta,
      previsao: somaDias(new Date().toISOString(), Math.max(0, diasFalta)),
      progresso: Math.min(100, (kmDesde / iv.km) * 100), situacao,
    };
  }).sort((a, b) => {
    const ordem = { vencido: 0, proximo: 1, sem_registro: 2, ok: 3 };
    if (ordem[a.situacao] !== ordem[b.situacao]) return ordem[a.situacao] - ordem[b.situacao];
    return a.diasFalta - b.diasFalta;
  });

  return { kmDia, itens };
}

/* ══════════════════════════════════════════════════════════════════════════
   RECOMENDAÇÕES
   Três bases distintas, e cada sugestão diz de qual saiu. Sugestão sem
   origem declarada é chute com cara de dado.
   ══════════════════════════════════════════════════════════════════════════ */
function montarPadroes(concluidas) {
  const porModelo = {}, porMarca = {}, geral = {}, sequencia = {}, porVeiculo = {};
  concluidas.forEach(o => {
    const s = o.itens.find(i => i.tipo === 'servico');
    if (!s || !o.veiculo) return;
    const nome = s.descricao;
    geral[nome] = (geral[nome] || 0) + 1;
    (porModelo[o.veiculo.modelo] = porModelo[o.veiculo.modelo] || {})[nome] = (porModelo[o.veiculo.modelo]?.[nome] || 0) + 1;
    (porMarca[o.veiculo.marca] = porMarca[o.veiculo.marca] || {})[nome] = (porMarca[o.veiculo.marca]?.[nome] || 0) + 1;
    (porVeiculo[o.veiculo_id] = porVeiculo[o.veiculo_id] || []).push({ nome, data: o.concluida_em, km: o.km_entrada });
  });
  // O que costuma vir logo depois de cada serviço, na história de cada veículo
  Object.values(porVeiculo).forEach(lista => {
    lista.sort((a, b) => String(a.data).localeCompare(String(b.data)));
    for (let i = 0; i < lista.length - 1; i++) {
      const de = lista[i].nome, para = lista[i + 1].nome;
      if (de === para) continue;
      (sequencia[de] = sequencia[de] || {})[para] = (sequencia[de]?.[para] || 0) + 1;
    }
  });
  const totais = {};
  Object.entries(porModelo).forEach(([k, v]) => { totais[k] = Object.values(v).reduce((a, b) => a + b, 0); });
  return { porModelo, porMarca, geral, sequencia, totaisModelo: totais, totalGeral: concluidas.length };
}

/** Sugestões para um veículo. `forca` alta = vale oferecer no balcão hoje. */
function recomendar(v, padroes) {
  if (!v) return [];
  const recs = [];
  const jaFez = new Set(v.concluidas.flatMap(o => o.itens.filter(i => i.tipo === 'servico').map(i => i.descricao)));

  (v.plano?.itens || []).filter(p => p.situacao !== 'ok').slice(0, 3).forEach(p => recs.push({
    id: 'prev-' + p.servico, servico: p.servico, titulo: p.servico,
    forca: p.situacao === 'vencido' ? 'alta' : p.situacao === 'proximo' ? 'media' : 'baixa',
    motivo: p.situacao === 'vencido'
      ? 'Passou ' + inteiro(Math.abs(p.kmFalta)) + ' km do intervalo de ' + inteiro(p.intervaloKm) + ' km.'
      : p.situacao === 'proximo'
        ? 'Faltam cerca de ' + inteiro(p.kmFalta) + ' km — previsto para ' + fmtData(p.previsao) + '.'
        : 'Nunca passou por aqui para este serviço, e o carro já rodou ' + inteiro(p.kmDesde) + ' km desde a primeira visita. Vale perguntar ao cliente quando foi a última vez.',
    base: p.nunca ? 'Sem evidência nos nossos registros — confirmar com o cliente'
                  : 'Última vez em ' + fmtData(p.baseData) + ', com ' + inteiro(p.baseKm) + ' km',
  }));

  // O que donos do mesmo modelo fazem e este veículo nunca fez
  const doModelo = padroes.porModelo[v.modelo] || {};
  const amostraModelo = padroes.totaisModelo[v.modelo] || 0;
  const fonte = amostraModelo >= 6 ? { mapa: doModelo, n: amostraModelo, rotulo: 'ordens de ' + v.modelo }
                                   : { mapa: padroes.geral, n: padroes.totalGeral, rotulo: 'ordens da oficina' };
  Object.entries(fonte.mapa).sort((a, b) => b[1] - a[1])
    .filter(([nome]) => !jaFez.has(nome) && !recs.some(r => r.servico === nome))
    .slice(0, 2).forEach(([nome, qtd]) => recs.push({
      id: 'modelo-' + nome, servico: nome, forca: 'baixa', titulo: nome,
      motivo: Math.round((qtd / fonte.n) * 100) + '% dos casos parecidos passaram por este serviço. Este veículo nunca fez aqui.',
      base: 'Com base em ' + fonte.n + ' ' + fonte.rotulo,
    }));

  // O que costuma vir depois do último serviço feito
  const ultimoServico = v.ultima?.itens.find(i => i.tipo === 'servico')?.descricao;
  const depois = padroes.sequencia[ultimoServico];
  if (depois) {
    const [nome, qtd] = Object.entries(depois).sort((a, b) => b[1] - a[1])[0];
    if (!recs.some(r => r.servico === nome)) recs.push({
      id: 'seq-' + nome, servico: nome, forca: 'baixa', titulo: nome,
      motivo: 'Costuma ser o serviço seguinte depois de ' + ultimoServico.toLowerCase() + '.',
      base: 'Observado ' + qtd + (qtd === 1 ? ' vez' : ' vezes') + ' no histórico',
    });
  }
  return recs.slice(0, 5);
}

function calcularMetricas(d) {
  const ix = montarIndices(d);
  const ordens = d.ordens.map(o => comporOS(o, d, ix));
  const concluidas = ordens.filter(o => o.etapa === 'concluida');
  const ativas = ordens.filter(ehAtiva);

  // Agrupamentos usados adiante: sem eles, cada cliente e cada veículo
  // percorreria a lista completa de ordens.
  const porCliente = new Map(), porVeiculo = new Map();
  ordens.forEach(o => {
    const a = porCliente.get(o.cliente_id); if (a) a.push(o); else porCliente.set(o.cliente_id, [o]);
    const b = porVeiculo.get(o.veiculo_id); if (b) b.push(o); else porVeiculo.set(o.veiculo_id, [o]);
  });
  const concluidasDe = (mapa, id) => (mapa.get(id) || []).filter(o => o.etapa === 'concluida')
    .sort((a, b) => (b.tsConcluida || 0) - (a.tsConcluida || 0));

  const meses = [];
  for (let i = 11; i >= 0; i--) {
    const ref = new Date(); ref.setDate(1); ref.setMonth(ref.getMonth() - i);
    meses.push({ chave: ref.getFullYear() + '-' + String(ref.getMonth() + 1).padStart(2, '0'),
      rotulo: fmtMesAno(ref.toISOString()), receita: 0, custo: 0, ordens: 0 });
  }
  const porChave = Object.fromEntries(meses.map(m => [m.chave, m]));
  concluidas.forEach(o => {
    const dt = new Date(o.concluida_em || o.aberta_em);
    const chave = dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0');
    if (porChave[chave]) {
      porChave[chave].receita += o.totais.liquido;
      porChave[chave].custo += o.totais.custo;
      porChave[chave].ordens += 1;
    }
  });

  const mesAtual = meses[meses.length - 1];
  const anteriores = meses.slice(0, -1).filter(m => m.receita > 0);
  const mediaAnterior = anteriores.length ? anteriores.reduce((s, m) => s + m.receita, 0) / anteriores.length : 0;
  const ticket = concluidas.length ? concluidas.reduce((s, o) => s + o.totais.liquido, 0) / concluidas.length : 0;
  const margemMedia = concluidas.length ? concluidas.reduce((s, o) => s + o.totais.margem, 0) / concluidas.length : 0;

  /* Cada ordem é atribuída ao seu serviço principal, com receita, custo e
     lucro completos. Somar só a mão de obra responderia a pergunta errada. */
  const servicos = {};
  concluidas.forEach(o => {
    const s = o.itens.find(i => i.tipo === 'servico');
    const nome = s ? s.descricao : 'Serviços avulsos';
    servicos[nome] = servicos[nome] || { nome, qtd: 0, valor: 0, custo: 0, lucro: 0 };
    servicos[nome].qtd += 1;
    servicos[nome].valor += o.totais.liquido;
    servicos[nome].custo += o.totais.custo;
    servicos[nome].lucro += o.totais.lucro;
  });
  const mix = Object.values(servicos).map(x => ({ ...x,
    ticket: x.valor / x.qtd, margem: x.valor > 0 ? (x.lucro / x.valor) * 100 : 0,
  })).sort((a, b) => b.valor - a.valor);
  const mixLucro = [...mix].sort((a, b) => b.lucro - a.lucro);

  const usoPecas = {};
  concluidas.forEach(o => o.itens.filter(i => i.tipo === 'peca' && i.peca_id).forEach(i => {
    usoPecas[i.peca_id] = usoPecas[i.peca_id] || { peca_id: i.peca_id, qtd: 0, valor: 0 };
    usoPecas[i.peca_id].qtd += i.quantidade;
    usoPecas[i.peca_id].valor += i.quantidade * i.preco_unitario;
  }));

  // Tempo médio por etapa, a partir dos eventos registrados
  const duracoes = {};
  ix.eventosPorOS.forEach(lista => {
    lista.sort((a, b) => String(a.criado_em).localeCompare(String(b.criado_em)));
    for (let i = 0; i < lista.length - 1; i++) {
      const et = lista[i].para_etapa;
      const dur = (new Date(lista[i + 1].criado_em) - new Date(lista[i].criado_em)) / 86400000;
      duracoes[et] = duracoes[et] || { etapa: et, total: 0, n: 0 };
      duracoes[et].total += dur; duracoes[et].n += 1;
    }
  });
  const tempoEtapa = Object.values(duracoes).map(x => ({ etapa: x.etapa, media: x.total / x.n }))
    .sort((a, b) => b.media - a.media);

  const porMecanico = new Map(MECANICOS.map(m => [m.id, { ordens: 0, receita: 0 }]));
  concluidas.forEach(o => { const x = porMecanico.get(o.mecanico); if (x) { x.ordens++; x.receita += o.totais.liquido; } });
  const produtividade = MECANICOS.map(m => {
    const x = porMecanico.get(m.id);
    return { ...m, ordens: x.ordens, receita: x.receita, ticket: x.ordens ? x.receita / x.ordens : 0 };
  }).sort((a, b) => b.receita - a.receita);

  const veiculosPorCliente = new Map();
  (d.veiculos || []).forEach(v => {
    const l = veiculosPorCliente.get(v.cliente_id); if (l) l.push(v); else veiculosPorCliente.set(v.cliente_id, [v]);
  });
  const clientes = d.clientes.map(c => {
    const suas = concluidasDe(porCliente, c.id);
    const gasto = suas.reduce((s, o) => s + o.totais.liquido, 0);
    const ultima = suas[0]?.concluida_em || null;
    return { ...c,
      veiculos: veiculosPorCliente.get(c.id) || [],
      ordens: porCliente.get(c.id) || [],
      concluidas: suas, gasto, ultima,
      ticket: suas.length ? gasto / suas.length : 0,
      inativo: ultima ? diasDesde(ultima) > DIAS_INATIVO : false };
  });

  const veiculos = d.veiculos.map(v => {
    const suas = concluidasDe(porVeiculo, v.id);
    const ultima = suas[0];
    const kmDesdeRevisao = ultima ? v.km_atual - ultima.km_entrada : null;
    const plano = planoDoVeiculo(v, suas);
    const vencidos = plano.itens.filter(i => i.situacao === 'vencido');
    const proximos = plano.itens.filter(i => i.situacao === 'proximo');
    const semRegistro = plano.itens.filter(i => i.situacao === 'sem_registro');
    return { ...v,
      cliente: ix.clientePorId.get(v.cliente_id),
      ordens: porVeiculo.get(v.id) || [],
      concluidas: suas, ultima, kmDesdeRevisao, plano, vencidos, proximos, semRegistro,
      gasto: suas.reduce((s, o) => s + o.totais.liquido, 0),
      // Urgência pondera peso do serviço e atraso: ordena a tela de preventiva
      urgencia: vencidos.reduce((s, i) => s + i.peso * 2, 0) + proximos.reduce((s, i) => s + i.peso, 0)
              + semRegistro.reduce((s, i) => s + i.peso * 0.4, 0),
      revisaoVencida: kmDesdeRevisao != null && kmDesdeRevisao >= KM_ENTRE_REVISOES,
      revisaoProxima: kmDesdeRevisao != null && kmDesdeRevisao >= KM_ENTRE_REVISOES * 0.85 && kmDesdeRevisao < KM_ENTRE_REVISOES };
  });

  /* Garantia: só existe depois da entrega, e vence sozinha. */
  const agora = Date.now();
  const garantias = concluidas.filter(o => o.garantiaAte).map(o => ({
    os: o, ate: o.garantiaAte,
    dias: Math.ceil((o.garantiaAte.getTime() - agora) / 86400000),
  })).sort((a, b) => a.dias - b.dias);
  const garantiasVigentes = garantias.filter(g => g.dias >= 0);
  const garantiasPorVeiculo = new Map();
  garantiasVigentes.forEach(g => {
    const l = garantiasPorVeiculo.get(g.os.veiculo_id);
    if (l) l.push(g); else garantiasPorVeiculo.set(g.os.veiculo_id, [g]);
  });

  /* Veículo entregue mas não pago: estado que não é etapa do pátio, e sim
     um título em aberto ligado à ordem. Derivar evita duas verdades. */
  const ordemPorId = new Map(ordens.map(x => [x.id, x]));
  const aguardandoPagamento = (d.lancamentos || [])
    .filter(l => l.tipo === 'receber' && l.status === 'aberto' && l.os_id && ordemPorId.has(l.os_id))
    .map(l => ({ lancamento: l, os: ordemPorId.get(l.os_id) }));

  /* Movimento de caixa por período: o que entrou e o que saiu de fato. */
  const inicioDia = new Date(); inicioDia.setHours(0, 0, 0, 0);
  const inicioSemana = new Date(inicioDia); inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay());
  const inicioDoMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  /* Um passe pelos lançamentos e um pelas ordens alimentam os três períodos.
     Três chamadas independentes varriam a base inteira três vezes. */
  const marcos = [['dia', inicioDia.getTime()], ['semana', inicioSemana.getTime()], ['mes', inicioDoMes.getTime()]];
  const caixa = Object.fromEntries(marcos.map(([k]) =>
    [k, { entradas: 0, saidas: 0, saldo: 0, faturado: 0, ordens: 0, lancamentos: [] }]));
  (d.lancamentos || []).forEach(l => {
    if (l.status !== 'pago' || !l.pago_em) return;
    const ts = dataLocal(l.pago_em).getTime();
    marcos.forEach(([k, inicio]) => {
      if (ts < inicio) return;
      const c = caixa[k];
      c.lancamentos.push(l);
      if (l.tipo === 'receber') c.entradas += l.valor; else c.saidas += l.valor;
    });
  });
  concluidas.forEach(o => {
    if (!o.tsConcluida) return;
    marcos.forEach(([k, inicio]) => {
      if (o.tsConcluida < inicio) return;
      caixa[k].faturado += o.totais.liquido;
      caixa[k].ordens += 1;
    });
  });
  marcos.forEach(([k]) => { caixa[k].saldo = caixa[k].entradas - caixa[k].saidas; });

  const padroes = montarPadroes(concluidas);
  const preventiva = veiculos.filter(v => v.urgencia > 0).sort((a, b) => b.urgencia - a.urgencia);
  const mesAnterior = meses[meses.length - 2];
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const diaDoMes = new Date().getDate();
  return {
    ordens, ativas, concluidas, meses, mesAtual, mesAnterior, mediaAnterior, ticket, margemMedia,
    mix, mixLucro, usoPecas, tempoEtapa, produtividade, clientes, veiculos, padroes, preventiva, diaDoMes,
    garantias, garantiasVigentes, garantiasPorVeiculo, aguardandoPagamento, caixa,
    projecaoMes: diaDoMes > 5 ? (mesAtual.receita / diaDoMes) * 30 : null,
    lucroMes: mesAtual.receita - mesAtual.custo,
    recorrentes: clientes.filter(c => c.concluidas.length >= 3),
    inativos: clientes.filter(c => c.inativo),
    emAberto: ativas.reduce((s, o) => s + o.totais.liquido, 0),
    aguardandoAprovacao: ativas.filter(o => o.etapa === 'aprovacao'),
    prontas: ativas.filter(o => o.etapa === 'entrega'),
    concluidasMes: concluidas.filter(o => o.tsConcluida >= inicioMes.getTime()),
    travadas: ativas.filter(o => o.dias >= 6),
    estoqueBaixo: d.pecas.filter(p => p.quantidade <= p.estoque_minimo),
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   MOTOR DE ANÁLISE
   Uma única lógica alimenta o assistente do painel e a central de
   notificações. Duas features separadas divergiriam na primeira mudança.
   ══════════════════════════════════════════════════════════════════════════ */
const GRAVIDADE_ORDEM = { critico:0, atencao:1, informativo:2, positivo:3 };

function analisar(d, m) {
  const achados = [];
  const add = (a) => achados.push(a);

  const parados = m.aguardandoAprovacao.filter(o => o.dias >= 2);
  if (m.aguardandoAprovacao.length > 0) add({
    id:'aprovacao', gravidade: parados.length ? 'atencao' : 'informativo', icone:'relogio', categoria:'operacao',
    titulo: m.aguardandoAprovacao.length + (m.aguardandoAprovacao.length === 1 ? ' orçamento aguarda aprovação' : ' orçamentos aguardam aprovação'),
    texto: parados.length
      ? parados.length + (parados.length === 1 ? ' está parado' : ' estão parados') + ' há dois dias ou mais. Uma ligação costuma destravar.'
      : 'Enviados recentemente. Vale acompanhar nos próximos dias.',
    acao:{ rotulo:'Ver ordens', ir:'ordens' },
  });

  m.travadas.forEach(o => add({
    id:'travada-' + o.id, gravidade: o.dias >= 8 ? 'critico' : 'atencao', icone:'carro', categoria:'operacao',
    titulo: o.veiculo?.marca + ' ' + o.veiculo?.modelo + ' parado há ' + o.dias + ' dias',
    texto: 'OS ' + o.numero + ', placa ' + o.veiculo?.placa + ', em ' + etapaNome(o.etapa).toLowerCase() + '. Carro parado não fatura e ocupa vaga.',
    acao:{ rotulo:'Abrir ordem', abrirOS:o.id },
  }));

  d.pecas.filter(p => p.quantidade === 0).forEach(p => add({
    id:'zerado-' + p.id, gravidade:'critico', icone:'caixa', categoria:'estoque',
    titulo: p.descricao + ' zerada',
    texto: 'Código ' + p.codigo + '. Sem saldo — qualquer ordem que precisar dela vai travar.',
    acao:{ rotulo:'Ver estoque', ir:'estoque' },
  }));

  const baixas = d.pecas.filter(p => p.quantidade > 0 && p.quantidade <= p.estoque_minimo);
  if (baixas.length > 0) add({
    id:'estoque-baixo', gravidade:'atencao', icone:'caixa', categoria:'estoque',
    titulo: baixas.length + (baixas.length === 1 ? ' peça está no estoque mínimo' : ' peças estão no estoque mínimo'),
    texto: baixas.slice(0,3).map(p => p.descricao).join(', ') + (baixas.length > 3 ? ' e mais ' + (baixas.length - 3) + '.' : '.'),
    acao:{ rotulo:'Ver estoque', ir:'estoque' },
  });

  m.clientes.filter(c => c.inativo).forEach(c => add({
    id:'inativo-' + c.id, gravidade:'informativo', icone:'pessoa', categoria:'clientes',
    titulo: c.nome + ' não aparece há ' + mesesDesde(c.ultima) + ' meses',
    texto: 'Já gastou ' + brl(c.gasto) + ' aqui em ' + c.concluidas.length + (c.concluidas.length === 1 ? ' visita' : ' visitas') + '. Cliente antigo custa menos que cliente novo.',
    acao:{ rotulo:'Abrir ficha', abrirCliente:c.id },
  }));

  m.preventiva.filter(v => v.vencidos.length || v.proximos.length).slice(0, 6).forEach(v => {
    const venc = v.vencidos, alvo = venc[0] || v.proximos[0];
    add({
      id:'prev-' + v.id, gravidade: venc.length ? 'atencao' : 'informativo', icone:'faisca', categoria:'clientes',
      titulo: v.marca + ' ' + v.modelo + (venc.length
        ? ' com ' + venc.length + (venc.length === 1 ? ' serviço vencido' : ' serviços vencidos')
        : ' perto de ' + alvo.servico.toLowerCase()),
      texto: 'Placa ' + v.placa + ', de ' + v.cliente?.nome + '. ' + (venc.length
        ? alvo.servico + ' passou ' + inteiro(Math.abs(alvo.kmFalta)) + ' km do intervalo.'
        : 'Previsto para ' + fmtData(alvo.previsao) + ', no ritmo de ' + inteiro(Math.round(v.plano.kmDia * 30)) + ' km por mês.'),
      acao:{ rotulo:'Abrir prontuário', abrirVeiculo:v.id },
    });
  });

  const vencidos = d.lancamentos.filter(l => l.tipo === 'receber' && l.status === 'aberto' && venceu(l.vencimento));
  if (vencidos.length > 0) add({
    id:'vencido', gravidade:'critico', icone:'carteira', categoria:'financeiro',
    titulo: brl(vencidos.reduce((s, l) => s + l.valor, 0)) + ' vencidos a receber',
    texto: vencidos.length + (vencidos.length === 1 ? ' título passou' : ' títulos passaram') + ' do vencimento sem baixa.',
    acao:{ rotulo:'Ver financeiro', ir:'financeiro' },
  });

  const aPagar = d.lancamentos.filter(l => l.tipo === 'pagar' && l.status === 'aberto' && diasAte(l.vencimento) >= 0 && diasAte(l.vencimento) <= 5);
  if (aPagar.length > 0) add({
    id:'pagar-proximo', gravidade:'informativo', icone:'carteira', categoria:'financeiro',
    titulo: brl(aPagar.reduce((s, l) => s + l.valor, 0)) + ' a pagar nos próximos cinco dias',
    texto: aPagar.slice(0,2).map(l => l.descricao).join(', ') + (aPagar.length > 2 ? ' e mais ' + (aPagar.length - 2) + '.' : '.'),
    acao:{ rotulo:'Ver financeiro', ir:'financeiro' },
  });

  if (m.mediaAnterior > 0) {
    const dif = ((m.mesAtual.receita - m.mediaAnterior) / m.mediaAnterior) * 100;
    const diaDoMes = new Date().getDate();
    const projecao = diaDoMes > 5 ? (m.mesAtual.receita / diaDoMes) * 30 : null;
    if (dif < -12 && diaDoMes > 10) add({
      id:'faturamento', gravidade:'atencao', icone:'baixo', categoria:'financeiro',
      titulo: 'Faturamento do mês ' + pct(Math.abs(dif)) + ' abaixo da média',
      texto: projecao
        ? 'No ritmo atual o mês fecha perto de ' + brlCurto(projecao) + ', contra média de ' + brlCurto(m.mediaAnterior) + '.'
        : 'Média dos meses anteriores: ' + brlCurto(m.mediaAnterior) + '.',
      acao:{ rotulo:'Ver relatórios', ir:'relatorios' },
    });
    else if (dif > 12) add({
      id:'faturamento-bom', gravidade:'positivo', icone:'cima', categoria:'financeiro',
      titulo: 'Faturamento ' + pct(dif) + ' acima da média',
      texto: brlCurto(m.mesAtual.receita) + ' no mês, contra média de ' + brlCurto(m.mediaAnterior) + ' nos anteriores.',
      acao:{ rotulo:'Ver relatórios', ir:'relatorios' },
    });
  }

  const magras = m.ativas.filter(o => o.totais.venda > 0 && o.totais.margem < PISO_MARGEM);
  if (magras.length > 0) {
    const pior = [...magras].sort((a, b) => a.totais.margem - b.totais.margem)[0];
    add({
      id:'margem', gravidade:'atencao', icone:'alvo', categoria:'financeiro',
      titulo: magras.length + (magras.length === 1 ? ' ordem está' : ' ordens estão') + ' abaixo do piso de ' + PISO_MARGEM + '%',
      texto: 'Menor margem: ' + pct(pior.totais.margem) + ' na OS ' + pior.numero + '. O desconto entra na conta.',
      acao:{ rotulo:'Abrir ordem', abrirOS:pior.id },
    });
  }

  m.aguardandoAprovacao.filter(o => o.validade && diasAte(o.validade) <= 2).forEach(o => add({
    id:'validade-' + o.id, gravidade:'atencao', icone:'relogio', categoria:'operacao',
    titulo: 'Orçamento da OS ' + o.numero + (diasAte(o.validade) < 0 ? ' venceu' : ' vence em ' + diasAte(o.validade) + ' dia(s)'),
    texto: brl(o.totais.liquido) + ' para ' + o.cliente?.nome + '. Depois da validade o preço da peça pode ter mudado.',
    acao:{ rotulo:'Abrir ordem', abrirOS:o.id },
  }));

  const semGiro = d.pecas.filter(p => p.quantidade > 0 && !m.usoPecas[p.id]);
  if (semGiro.length > 0) add({
    id:'sem-giro', gravidade:'informativo', icone:'caixa', categoria:'estoque',
    titulo: semGiro.length + (semGiro.length === 1 ? ' peça parada' : ' peças paradas') + ' no estoque',
    texto: 'Sem saída no período, com ' + brl(semGiro.reduce((s, p) => s + p.quantidade * p.custo_medio, 0)) + ' de capital imobilizado.',
    acao:{ rotulo:'Ver estoque', ir:'estoque' },
  });

  return achados.sort((a, b) => GRAVIDADE_ORDEM[a.gravidade] - GRAVIDADE_ORDEM[b.gravidade]);
}

/* ══════════════════════════════════════════════════════════════════════════
   ASSISTENTE DA OFICINA
   Entende a pergunta e responde com número calculado, não estimado. Um modelo
   de linguagem seria pior aqui: ele pode errar o valor do faturamento. A
   linguagem natural fica na conversa; a aritmética fica no código.
   Para respostas abertas, `responderComIA` abaixo é o ponto de encaixe — e
   ele exige um proxy no servidor, nunca uma chave dentro deste arquivo.
   ══════════════════════════════════════════════════════════════════════════ */
const normalizar = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const SUGESTOES = [
  'Como está o desempenho da oficina este mês?',
  'Quais serviços deram mais lucro?',
  'Quais clientes precisam de retorno?',
  'Quais veículos estão próximos de manutenção?',
  'Quais peças estão com estoque baixo?',
  'Quanto tenho a receber?',
  'Quem são meus melhores clientes?',
  'Qual mecânico produziu mais?',
  'O que está travado no pátio?',
  'Quanto tempo leva um serviço aqui?',
];

const INTENCOES = [
  {
    id: 'desempenho',
    chaves: ['desempenho', 'como esta a oficina', 'como vai a oficina', 'como esta o mes', 'faturamento', 'faturei', 'resultado do mes', 'como estamos', 'balanco', 'receita'],
    responder: (m) => {
      const dif = m.mediaAnterior > 0 ? ((m.mesAtual.receita - m.mediaAnterior) / m.mediaAnterior) * 100 : 0;
      const sinal = dif >= 0 ? 'acima' : 'abaixo';
      return {
        resumo: 'Até agora o mês soma ' + brl(m.mesAtual.receita) + ' em ' + m.mesAtual.ordens +
          (m.mesAtual.ordens === 1 ? ' ordem concluída' : ' ordens concluídas') + ', ' + pct(Math.abs(dif)) + ' ' + sinal +
          ' da média dos meses anteriores' + (m.projecaoMes ? '. No ritmo atual o mês deve fechar perto de ' + brl(m.projecaoMes) : '') + '.',
        linhas: [
          { titulo: 'Faturado no mês', valor: brl(m.mesAtual.receita) },
          { titulo: 'Média dos meses anteriores', valor: brl(m.mediaAnterior) },
          { titulo: 'Lucro do mês', valor: brl(m.lucroMes) },
          { titulo: 'Ticket médio', valor: brl(m.ticket) },
          { titulo: 'Margem média', valor: pct(m.margemMedia) },
          { titulo: 'Veículos no pátio agora', valor: String(m.ativas.length) },
        ],
        acao: { rotulo: 'Ver relatórios', ir: 'relatorios' },
      };
    },
  },
  {
    id: 'lucro',
    chaves: ['mais lucro', 'lucrativ', 'rentav', 'melhor servico', 'servico que da mais', 'onde ganho mais', 'margem por servico', 'quais servicos'],
    responder: (m) => {
      const top = m.mixLucro.slice(0, 5);
      if (top.length === 0) return { resumo: 'Ainda não há ordens concluídas suficientes para comparar serviços.' };
      const p = top[0];
      return {
        resumo: 'Quem mais deixou lucro foi ' + p.nome.toLowerCase() + ': ' + brl(p.lucro) + ' em ' + p.qtd +
          (p.qtd === 1 ? ' execução' : ' execuções') + ', com margem de ' + pct(p.margem) + '. Note que faturar muito e lucrar muito nem sempre andam juntos.',
        linhas: top.map(x => ({ titulo: x.nome, apoio: x.qtd + 'x · margem ' + pct(x.margem), valor: brl(x.lucro) })),
        acao: { rotulo: 'Ver relatórios', ir: 'relatorios' },
      };
    },
  },
  {
    id: 'retorno',
    chaves: ['precisam de retorno', 'clientes sumidos', 'nao voltam', 'nao retornam', 'clientes perdidos', 'cliente inativo', 'inativos', 'quem sumiu', 'trazer de volta'],
    responder: (m) => {
      if (m.inativos.length === 0) return { resumo: 'Nenhum cliente passou de ' + Math.round(DIAS_INATIVO / 30) + ' meses sem aparecer. Sua retenção está boa.' };
      const soma = m.inativos.reduce((s, c) => s + c.gasto, 0);
      return {
        resumo: m.inativos.length + (m.inativos.length === 1 ? ' cliente está' : ' clientes estão') + ' há mais de ' +
          Math.round(DIAS_INATIVO / 30) + ' meses sem passar aqui. Juntos já deixaram ' + brl(soma) +
          ' na oficina — trazer de volta custa menos que conquistar cliente novo.',
        linhas: m.inativos.map(c => ({ titulo: c.nome, apoio: fmtTel(c.telefone) + ' · ' + c.concluidas.length + ' passagens', valor: mesesDesde(c.ultima) + ' meses' })),
        acao: { rotulo: 'Ver a fila de contato', ir: 'automacoes' },
      };
    },
  },
  {
    id: 'preventiva',
    chaves: ['proximos de manutencao', 'perto da revisao', 'preventiva', 'manutencao preventiva', 'quais veiculos', 'revisao vencida', 'precisam de revisao', 'troca de oleo vencida'],
    responder: (m) => {
      if (m.preventiva.length === 0) return { resumo: 'Nenhum veículo da base está com serviço vencido ou próximo do vencimento.' };
      const venc = m.preventiva.filter(v => v.vencidos.length);
      const semReg = m.preventiva.filter(v => !v.vencidos.length && !v.proximos.length && v.semRegistro.length);
      return {
        resumo: m.preventiva.length + (m.preventiva.length === 1 ? ' veículo pede' : ' veículos pedem') + ' atenção' +
          (venc.length ? ', sendo ' + venc.length + ' com serviço comprovadamente vencido' : '') +
          '. A previsão usa a quilometragem que cada carro roda por mês de verdade.' +
          (semReg.length ? ' Outros ' + semReg.length + ' têm serviço sem registro aqui — pode ter sido feito em outro lugar, vale confirmar antes de oferecer.' : ''),
        linhas: m.preventiva.slice(0, 6).map(v => {
          const alvo = v.vencidos[0] || v.proximos[0] || v.semRegistro[0];
          return { titulo: v.marca + ' ' + v.modelo + ' · ' + v.placa,
            apoio: v.cliente?.nome + ' · ' + alvo.servico.toLowerCase(),
            valor: v.vencidos.length ? 'vencido' : v.proximos.length ? 'em ' + alvo.diasFalta + 'd' : 'confirmar' };
        }),
        acao: { rotulo: 'Abrir preventiva', ir: 'preventiva' },
      };
    },
  },
  {
    id: 'estoque',
    chaves: ['estoque baixo', 'peca acabando', 'pecas acabando', 'falta peca', 'preciso comprar', 'estoque minimo', 'repor', 'estoque'],
    responder: (m, d) => {
      const zeradas = d.pecas.filter(p => p.quantidade === 0);
      const baixas = d.pecas.filter(p => p.quantidade > 0 && p.quantidade <= p.estoque_minimo);
      if (zeradas.length === 0 && baixas.length === 0) return { resumo: 'Nenhuma peça está no mínimo. Estoque saudável.' };
      return {
        resumo: (zeradas.length ? zeradas.length + (zeradas.length === 1 ? ' peça está zerada' : ' peças estão zeradas') + ' e ' : '') +
          baixas.length + (baixas.length === 1 ? ' está' : ' estão') + ' no estoque mínimo. Peça zerada trava ordem e segura carro no pátio.',
        linhas: [...zeradas, ...baixas].map(p => ({ titulo: p.descricao, apoio: p.codigo + ' · prateleira ' + p.localizacao,
          valor: p.quantidade === 0 ? 'zerada' : p.quantidade + ' un' })),
        acao: { rotulo: 'Ver estoque', ir: 'estoque' },
      };
    },
  },
  {
    id: 'financeiro',
    chaves: ['a receber', 'quanto tenho a receber', 'a pagar', 'contas', 'caixa', 'vencido', 'cobranca', 'inadimpl', 'financeiro'],
    responder: (m, d) => {
      const receber = d.lancamentos.filter(l => l.tipo === 'receber' && l.status === 'aberto');
      const pagar = d.lancamentos.filter(l => l.tipo === 'pagar' && l.status === 'aberto');
      const vencidos = receber.filter(l => venceu(l.vencimento));
      const soma = (a) => a.reduce((s, l) => s + l.valor, 0);
      return {
        resumo: 'Você tem ' + brl(soma(receber)) + ' a receber e ' + brl(soma(pagar)) + ' a pagar em aberto' +
          (vencidos.length ? '. Atenção: ' + brl(soma(vencidos)) + ' já passaram do vencimento sem baixa' : '') + '.',
        linhas: [
          { titulo: 'A receber em aberto', apoio: receber.length + ' títulos', valor: brl(soma(receber)) },
          { titulo: 'Vencido sem baixa', apoio: vencidos.length + ' títulos', valor: brl(soma(vencidos)) },
          { titulo: 'A pagar em aberto', apoio: pagar.length + ' títulos', valor: brl(soma(pagar)) },
          { titulo: 'Saldo projetado', valor: brl(soma(receber) - soma(pagar)) },
        ],
        acao: { rotulo: 'Ver financeiro', ir: 'financeiro' },
      };
    },
  },
  {
    id: 'melhores',
    chaves: ['melhores clientes', 'melhor cliente', 'maiores clientes', 'quem gasta mais', 'top clientes', 'clientes vip'],
    responder: (m) => {
      const top = m.clientes.filter(c => c.gasto > 0).sort((a, b) => b.gasto - a.gasto).slice(0, 5);
      return {
        resumo: top.length ? top[0].nome + ' é quem mais deixou dinheiro aqui: ' + brl(top[0].gasto) + ' em ' +
          top[0].concluidas.length + ' passagens, ticket médio de ' + brl(top[0].ticket) + '.' : 'Ainda sem histórico suficiente.',
        linhas: top.map(c => ({ titulo: c.nome, apoio: c.concluidas.length + ' passagens · ticket ' + brl(c.ticket), valor: brl(c.gasto) })),
        acao: { rotulo: 'Ver clientes', ir: 'clientes' },
      };
    },
  },
  {
    id: 'equipe',
    chaves: ['mecanico', 'quem produziu', 'produtividade', 'equipe', 'funcionario', 'quem trabalhou mais'],
    responder: (m) => ({
      resumo: m.produtividade[0] ? m.produtividade[0].nome + ' lidera com ' + m.produtividade[0].ordens +
        ' ordens concluídas e ' + brl(m.produtividade[0].receita) + ' gerados. Vale olhar o ticket junto com a quantidade: quem faz menos ordens pode estar pegando os serviços maiores.' : 'Sem dados.',
      linhas: m.produtividade.map(p => ({ titulo: p.nome, apoio: p.ordens + ' ordens · ticket ' + brl(p.ticket), valor: brl(p.receita) })),
      acao: { rotulo: 'Ver relatórios', ir: 'relatorios' },
    }),
  },
  {
    id: 'tempo',
    chaves: ['quanto tempo', 'demora', 'prazo', 'ciclo', 'tempo medio', 'onde perco tempo', 'gargalo'],
    responder: (m) => {
      const total = m.tempoEtapa.reduce((s, x) => s + x.media, 0);
      const pior = m.tempoEtapa[0];
      return {
        resumo: 'Da recepção à conclusão o ciclo médio é de ' + total.toFixed(1) + ' dias' +
          (pior ? ', e a etapa que mais segura é ' + etapaNome(pior.etapa).toLowerCase() + ', com ' + pior.media.toFixed(1) + ' dias em média' : '') + '.',
        linhas: m.tempoEtapa.map(t => ({ titulo: etapaNome(t.etapa), valor: t.media.toFixed(1) + ' dias' })),
        acao: { rotulo: 'Ver relatórios', ir: 'relatorios' },
      };
    },
  },
  {
    id: 'patio',
    chaves: ['patio', 'travado', 'parado', 'atrasado', 'quantos carros', 'na oficina agora', 'o que esta preso'],
    responder: (m) => ({
      resumo: m.ativas.length + ' veículos estão na oficina agora, somando ' + brl(m.emAberto) + ' ainda não faturados' +
        (m.travadas.length ? '. ' + m.travadas.length + (m.travadas.length === 1 ? ' está parado' : ' estão parados') + ' há seis dias ou mais — carro parado não fatura e ocupa vaga' : '. Nada travado') + '.',
      linhas: (m.travadas.length ? m.travadas : m.ativas).slice(0, 6).map(o => ({
        titulo: o.veiculo?.marca + ' ' + o.veiculo?.modelo + ' · ' + o.veiculo?.placa,
        apoio: 'OS ' + o.numero + ' · ' + etapaNome(o.etapa).toLowerCase(), valor: o.dias + ' dias' })),
      acao: { rotulo: 'Abrir pátio', ir: 'patio' },
    }),
  },
  {
    id: 'aprovacao',
    chaves: ['orcamento parado', 'aguardando aprovacao', 'nao aprovaram', 'orcamentos pendentes', 'esperando resposta'],
    responder: (m) => ({
      resumo: m.aguardandoAprovacao.length === 0 ? 'Nenhum orçamento aguardando resposta do cliente.'
        : m.aguardandoAprovacao.length + (m.aguardandoAprovacao.length === 1 ? ' orçamento aguarda' : ' orçamentos aguardam') +
          ' aprovação, somando ' + brl(m.aguardandoAprovacao.reduce((s, x) => s + x.totais.liquido, 0)) + '. Uma ligação costuma destravar mais que um lembrete.',
      linhas: m.aguardandoAprovacao.map(o => ({ titulo: o.cliente?.nome, apoio: o.veiculo?.marca + ' ' + o.veiculo?.modelo + ' · OS ' + o.numero, valor: brl(o.totais.liquido) })),
      acao: { rotulo: 'Ver ordens', ir: 'ordens' },
    }),
  },
  {
    id: 'ajuda',
    chaves: ['ajuda', 'o que voce faz', 'o que voce sabe', 'como funciona', 'quem e voce', 'comandos', 'pode fazer'],
    responder: () => ({
      resumo: 'Eu leio os dados da sua oficina e respondo em números. Não invento nada: tudo o que eu digo sai de uma conta feita sobre as suas ordens, clientes, peças e contas. Pergunte com suas palavras — algumas coisas que sei responder:',
      sugestoes: SUGESTOES,
    }),
  },
];

/** Pontua por especificidade: frase longa vence palavra solta. */
function interpretar(pergunta) {
  const q = normalizar(pergunta);
  let melhor = null, maior = 0;
  INTENCOES.forEach(i => {
    const nota = i.chaves.reduce((s, c) => s + (q.includes(normalizar(c)) ? c.length : 0), 0);
    if (nota > maior) { maior = nota; melhor = i; }
  });
  return maior > 0 ? melhor : null;
}

function responder(pergunta, d, m) {
  const intencao = interpretar(pergunta);
  if (!intencao) return {
    resumo: 'Essa eu não consegui entender. Eu respondo sobre faturamento, lucro por serviço, clientes, manutenção preventiva, estoque, financeiro, equipe e o que está no pátio. Tente de outro jeito ou escolha abaixo:',
    sugestoes: SUGESTOES, naoEntendi: true,
  };
  return { ...intencao.responder(m, d), intencao: intencao.id };
}

/* Ponto de encaixe para um modelo de linguagem em perguntas abertas.
   A chamada TEM de sair de uma Edge Function do Supabase: chave de API dentro
   deste arquivo fica visível para qualquer um que abra o console do navegador.
   O padrão certo continua sendo este — calcular os fatos aqui e mandar apenas
   o resumo numérico para o modelo redigir, nunca deixá-lo inventar valores. */
async function responderComIA(pergunta, fatos, urlDaFuncao) {
  if (!urlDaFuncao) return null;
  const r = await fetch(urlDaFuncao, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pergunta, fatos }),
  });
  if (!r.ok) throw new Error('Assistente indisponível');
  return (await r.json()).texto;
}

/* ══════════════════════════════════════════════════════════════════════════
   AUDITORIA — quem fez o quê, quando
   ══════════════════════════════════════════════════════════════════════════ */
const ACOES_AUDITAVEIS = {
  os_criada:      { rotulo: 'Abriu ordem',            icone: 'prancheta', tom: 'info' },
  os_etapa:       { rotulo: 'Moveu ordem',            icone: 'colunas',   tom: '' },
  os_valor:       { rotulo: 'Alterou valor da ordem', icone: 'carteira',  tom: 'alerta' },
  os_aprovada:    { rotulo: 'Registrou aprovação',    icone: 'check',     tom: 'ok' },
  os_editada:     { rotulo: 'Editou ordem',           icone: 'prancheta', tom: '' },
  cliente_criado: { rotulo: 'Cadastrou cliente',      icone: 'pessoas',   tom: 'info' },
  cliente_editado:{ rotulo: 'Editou cliente',         icone: 'pessoa',    tom: '' },
  veiculo_criado: { rotulo: 'Cadastrou veículo',      icone: 'carro',     tom: 'info' },
  lancamento_baixa:{ rotulo: 'Baixou título',         icone: 'carteira',  tom: 'ok' },
  automacao:      { rotulo: 'Alterou automação',      icone: 'raio',      tom: '' },
  oficina:        { rotulo: 'Alterou dados da oficina', icone: 'engrenagem', tom: 'alerta' },
  usuario:        { rotulo: 'Alterou usuário',        icone: 'pessoa',    tom: 'alerta' },
  tarefa:            { rotulo: 'Concluiu tarefa',     icone: 'check',   tom: 'ok' },
  backup_criado:     { rotulo: 'Gerou backup',        icone: 'arquivo', tom: 'info' },
  backup_restaurado: { rotulo: 'Restaurou backup',    icone: 'voltar',  tom: 'alerta' },
  os_recusada:       { rotulo: 'Registrou recusa',    icone: 'x',       tom: 'alerta' },
  anexo_removido:    { rotulo: 'Removeu anexo',       icone: 'lixo',    tom: 'alerta' },
  registro_excluido: { rotulo: 'Excluiu registro',  icone: 'lixo',      tom: 'erro' },
  veiculo_editado:   { rotulo: 'Editou veículo',    icone: 'carro',     tom: '' },
  peca_criada:       { rotulo: 'Cadastrou peça',    icone: 'caixa',     tom: 'info' },
  peca_editada:      { rotulo: 'Editou peça',       icone: 'caixa',     tom: '' },
  estoque_ajustado:  { rotulo: 'Ajustou estoque',   icone: 'caixa',     tom: 'alerta' },
  os_itens:          { rotulo: 'Alterou itens da ordem', icone: 'prancheta', tom: 'alerta' },
  os_cancelada:      { rotulo: 'Cancelou ordem',    icone: 'x',         tom: 'erro' },
  lancamento_criado: { rotulo: 'Lançou título',     icone: 'carteira',  tom: 'info' },
  lancamento_editado:{ rotulo: 'Editou título',     icone: 'carteira',  tom: '' },
};

function registro(usuario, papel, acao, alvo, detalhe) {
  return { id: novoId(), criado_em: new Date().toISOString(), usuario, papel, acao, alvo, detalhe };
}

/* ══════════════════════════════════════════════════════════════════════════
   PERFORMANCE
   Duas defesas simples que decidem se o sistema aguenta base grande: não
   refiltrar a cada tecla, e não desenhar mil linhas que ninguém vai ler.
   ══════════════════════════════════════════════════════════════════════════ */
function useAtraso(valor, ms = 260) {
  const [lento, setLento] = useState(valor);
  useEffect(() => { const t = setTimeout(() => setLento(valor), ms); return () => clearTimeout(t); }, [valor, ms]);
  return lento;
}

/** Paginação por demanda: rende o mesmo com 20 ou com 20 mil registros. */
function usePagina(lista, passo = 40) {
  const [limite, setLimite] = useState(passo);
  useEffect(() => { setLimite(passo); }, [lista.length, passo]);
  return { visiveis: lista.slice(0, limite), restantes: Math.max(0, lista.length - limite),
           mais: () => setLimite(l => l + passo) };
}

const BotaoMais = ({ restantes, aoClicar }) => restantes > 0 ? html`
  <div style="padding:14px;text-align:center;border-top:1px solid var(--linha-suave)">
    <button class="btn btn-neutro" onClick=${aoClicar}>Mostrar mais ${Math.min(restantes, 40)} de ${inteiro(restantes)}</button>
  </div>` : null;

/* ══════════════════════════════════════════════════════════════════════════
   ERROS
   O usuário nunca vê a mensagem técnica. Ela vai para o console, onde serve
   a quem pode consertar.
   ══════════════════════════════════════════════════════════════════════════ */
const MENSAGENS_ERRO = {
  arquivo: 'Não foi possível ler esse arquivo. Confira se ele é um backup do Nitro e tente de novo.',
  integridade: 'Esse arquivo de backup está corrompido ou foi alterado. Use outra cópia.',
  rede: 'Sem conexão com o servidor. Verifique a internet e tente novamente.',
  permissao: 'Seu perfil não permite essa ação. Fale com o dono ou o gerente da oficina.',
  generico: 'Não foi possível concluir essa ação. Tente novamente ou fale com o suporte.',
};

function tentar(fn, avisar, tipo = 'generico') {
  try { return fn(); }
  catch (erro) { console.error('[Nitro]', erro); avisar(MENSAGENS_ERRO[tipo] || MENSAGENS_ERRO.generico); return null; }
}

/* ══════════════════════════════════════════════════════════════════════════
   BACKUP
   Soma de verificação FNV-1a sobre o conteúdo. Detecta arquivo truncado,
   corrompido ou editado à mão — não é assinatura criptográfica, e o rótulo
   na tela diz isso. Proteção contra adulteração deliberada exige servidor.
   ══════════════════════════════════════════════════════════════════════════ */
/* AUDITORIA: `agendamentos` não estava nesta lista. Como a lista manda no
   backup, na restauração e na exportação, a agenda inteira desaparecia a
   cada restauração — sem erro, sem aviso, sem forma de recuperar. Era a
   falha mais cara do arquivo: perda silenciosa de dado.                    */
const TABELAS = ['clientes','veiculos','pecas','ordens','itens','eventos','lancamentos',
                 'automacoes','usuarios','auditoria','tarefas','modelosMensagem','anexos',
                 'agendamentos'];
const VERSAO_BACKUP = 5;
const LIMITE_BACKUPS = 12;      // cópias mantidas em memória
const INTERVALO_BACKUP = 10 * 60 * 1000;   // automático a cada 10 minutos

function somaVerificacao(texto) {
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

function contarRegistros(d) {
  return TABELAS.reduce((acc, t) => { acc[t] = (d[t] || []).length; return acc; }, {});
}

function montarBackup(d, tipo, autor) {
  const conteudo = {};
  TABELAS.forEach(t => { conteudo[t] = d[t] || []; });
  // O binário da foto não entra no JSON: em produção ele vive no Storage e é
  // copiado junto com o banco. Aqui vai só o cadastro do anexo.
  conteudo.anexos = (d.anexos || []).map(({ url, ...resto }) => ({ ...resto, externo: true }));
  conteudo.oficina = d.oficina;
  const texto = JSON.stringify(conteudo);
  return {
    id: novoId(), versao: VERSAO_BACKUP, criado_em: new Date().toISOString(), tipo, autor,
    sistema: 'Nitro', oficina: d.oficina?.nome,
    registros: contarRegistros(d), total: TABELAS.reduce((s, t) => s + (d[t] || []).length, 0),
    bytes: texto.length, soma: somaVerificacao(texto), conteudo,
  };
}

/** Recusa arquivo que não é backup, de versão futura, ou com soma divergente. */
function conferirBackup(obj) {
  /* Aceita o nome antigo: uma cópia gerada antes da troca de nome precisa
     continuar restaurando. Renomear o sistema não pode invalidar backup. */
  const marcas = ['Nitro', 'Nitro'];
  if (!obj || !marcas.includes(obj.sistema) || !obj.conteudo) return { ok: false, motivo: 'arquivo' };
  if (Number(obj.versao) > VERSAO_BACKUP) return { ok: false, motivo: 'versao' };
  const faltando = TABELAS.filter(t => !Array.isArray(obj.conteudo[t]));
  if (faltando.length > 3) return { ok: false, motivo: 'arquivo' };
  if (obj.soma && somaVerificacao(JSON.stringify(obj.conteudo)) !== obj.soma) return { ok: false, motivo: 'integridade' };
  /* Arquivo de fora não escreve na cadeia de protótipos. */
  if (temChaveProibida(obj.conteudo)) return { ok: false, motivo: 'arquivo' };
  return { ok: true };
}

/* CORREÇÃO · o saldo e o mínimo são comparados em vinte lugares do arquivo —
   painel, lista, achados, copiloto, relatório, exportação, aviso de falta na
   OS. Consertar vinte comparações uma a uma deixa a vigésima primeira por
   consertar. A linha da peça é normalizada uma vez, na porta de entrada, e
   todos passam a comparar número com número. Só as quatro colunas numéricas
   do catálogo são tocadas; o resto da linha entra intacto, inclusive coluna
   que esta instalação tenha e o arquivo não conheça. */
const normalizarPecas = (lista) => (lista || []).map(p => (p && typeof p === 'object')
  ? { ...p, quantidade: num(p.quantidade), estoque_minimo: num(p.estoque_minimo),
      custo_medio: num(p.custo_medio), preco_venda: num(p.preco_venda) }
  : p);

function aplicarBackup(d, bk) {
  const novo = { ...d };
  TABELAS.forEach(t => { if (Array.isArray(bk.conteudo[t])) novo[t] = bk.conteudo[t]; });
  /* Backup antigo pode trazer o saldo como texto: normaliza na restauração
     pelo mesmo motivo que na carga do banco. */
  if (Array.isArray(bk.conteudo.pecas)) novo.pecas = normalizarPecas(bk.conteudo.pecas);
  if (bk.conteudo.oficina) novo.oficina = { ...OFICINA_PADRAO, ...bk.conteudo.oficina };
  return novo;
}

function baixarArquivo(nome, texto) {
  /* O tipo era fixo em JSON, mas esta função também baixa CSV: o Excel
     recebia planilha rotulada como JSON e abria como texto cru numa coluna
     só. O tipo agora sai da extensão. */
  const ext = String(nome || '').split('.').pop().toLowerCase();
  const tipos = { csv:'text/csv;charset=utf-8', json:'application/json',
                  txt:'text/plain;charset=utf-8', html:'text/html;charset=utf-8' };
  const blob = new Blob([texto], { type: tipos[ext] || 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = nome;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/* ── AUDITORIA (fase 16): copiar deixa de ser fé ────────────────────────────
   Oito lugares copiavam texto; quatro avisavam "copiado" sem conferir nada.
   E `navigator.clipboard?.writeText(x).then(...)` engana quem lê: o
   encadeamento opcional curto-circuita a EXPRESSÃO INTEIRA, então fora de
   HTTPS — oficina em rede local, que é comum — o `.then` nunca roda, nada é
   copiado e nada é dito. O balcão cola vazio no WhatsApp achando que colou o
   orçamento.

   `copiarTexto` devolve uma promessa de verdadeiro/falso e tenta o caminho
   antigo (`execCommand`) quando a API moderna não existe. `copiarE` é o
   atalho para os botões: copia e avisa o que realmente aconteceu.          */
async function copiarTexto(texto) {
  const t = String(texto ?? '');
  if (!t) return false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(t);
      return true;
    }
  } catch (_) { /* cai no caminho antigo */ }
  /* Sem contexto seguro sobra o `execCommand`, que ainda funciona em todos os
     navegadores usados no balcão. Precisa de um elemento na página. */
  try {
    const cx = document.createElement('textarea');
    cx.value = t;
    cx.setAttribute('readonly', '');
    cx.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
    document.body.appendChild(cx);
    cx.select(); cx.setSelectionRange(0, t.length);
    const ok = document.execCommand('copy');
    cx.remove();
    return Boolean(ok);
  } catch (_) { return false; }
}

/** Copia e conta a verdade. `aoFalhar` permite uma mensagem mais específica. */
const copiarE = (texto, avisar, msgOk, aoFalhar) =>
  copiarTexto(texto).then(ok => {
    avisar(ok ? msgOk : (aoFalhar || 'Não deu para copiar. Selecione o texto na tela e copie à mão.'));
    return ok;
  });

const nomeArquivoBackup = (d, quando) =>
  'nitro-' + String(d.oficina?.nome || 'oficina').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  + '-' + new Date(quando).toISOString().slice(0, 16).replace(/[:T]/g, '') + '.json';

/* Exportação em CSV, para quem quer abrir no Excel ou levar ao contador. */
function paraCSV(linhas) {
  if (!linhas.length) return '';
  const cols = [...new Set(linhas.flatMap(l => Object.keys(l)))];
  const escapar = (v) => {
    if (v == null) return '';
    const t = typeof v === 'object' ? JSON.stringify(v) : String(v);
    return /[";\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
  };
  return [cols.join(';'), ...linhas.map(l => cols.map(c => escapar(l[c])).join(';'))].join('\n');
}

/* ══ CONTEXTO ══ */
const Ctx = createContext(null);
const usar = () => useContext(Ctx);

/* ══ PRIMITIVOS ══ */
const Placa = ({ valor, tam = '' }) => html`
  <span class=${'placa' + (tam ? ' ' + tam : '')} title=${'Placa ' + valor}>
    <span class="faixa">BRASIL</span>
    <span class="valor">${String(valor || '').slice(0,3)}<span style="opacity:.3;margin:0 1px">·</span>${String(valor || '').slice(3)}</span>
  </span>`;

const Selo = ({ tom = '', children, icone }) => html`
  <span class=${'selo' + (tom ? ' selo-' + tom : '')}>
    ${icone ? html`<${Icone} nome=${icone} tam=${12} />` : null}${children}
  </span>`;

const SeloSituacao = ({ etapa }) => {
  const e = etapaPor(etapa);
  return html`<${Selo} tom=${SITUACOES[e.situacao].selo}><i class=${'ponto ' + e.situacao}></i>${e.nome}<//>`;
};

const Cartao = ({ children, classe = '', nu }) => html`
  <section class=${'cartao' + (nu ? ' nu' : '') + (classe ? ' ' + classe : '')}>${children}</section>`;

const Regua = ({ etapa, dias }) => {
  const i = etapaIndice(etapa);
  const fim = etapa === 'concluida';
  const tom = fim ? '' : dias >= 6 ? ' travado' : dias >= 3 ? ' alerta' : '';
  return html`<div class=${'regua' + tom} role="img" aria-label=${etapaNome(etapa)}>
    ${ETAPAS.map((_, k) => html`<i key=${k} class=${fim ? 'feito' : k < i ? 'feito' : k === i ? 'atual' : ''}></i>`)}
  </div>`;
};

const Envelhecimento = ({ dias }) => {
  const p = Math.min(dias / 7, 1) * 100;
  const cor = dias >= 6 ? 'var(--erro)' : dias >= 3 ? 'var(--alerta)' : 'var(--ok)';
  return html`<div class="envelhece">
    <div class="barra"><i style=${'width:' + Math.max(p,7) + '%;background:' + cor}></i></div>
    <span class="dias" style=${'color:' + cor}>${dias}d</span>
  </div>`;
};

/* ── AUDITORIA (fase 16): foco preso dentro da janela ──────────────────────
   Os modais já se anunciavam com `role="dialog" aria-modal="true"`, mas o
   foco continuava lá atrás: quem navega por teclado ou usa leitor de tela
   abria a janela e seguia tabulando pela tela de baixo, sem saber que havia
   um diálogo aberto. `aria-modal` sem gestão de foco é uma promessa que a
   interface não cumpre.

   O gancho faz as três coisas que faltavam: leva o foco para dentro ao
   abrir, mantém o Tab girando entre os controles da janela e devolve o foco
   a quem abriu quando ela fecha.                                           */
const FOCAVEIS = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),' +
                 'textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/* Janelas empilham: o detalhe da ordem abre o modal de documento, que abre o
   de envio. Se todas as travas escutassem o teclado ao mesmo tempo, a de fora
   puxaria o foco de volta para si e a de dentro ficaria inalcançável. Só a
   última da pilha responde. */
const PILHA_FOCO = [];

function usarFocoPreso(ref) {
  useEffect(() => {
    const caixa = ref.current;
    if (!caixa) return;
    const veioDe = document.activeElement;
    PILHA_FOCO.push(caixa);

    const dentro = () => [...caixa.querySelectorAll(FOCAVEIS)]
      .filter(e => e.offsetWidth > 0 || e.offsetHeight > 0 || e === document.activeElement);

    /* O foco vai para a própria janela, não para o primeiro campo: focar um
       campo abre o teclado do celular em toda confirmação, inclusive nas que
       só têm "Voltar" e "Confirmar". O leitor de tela anuncia o diálogo do
       mesmo jeito, que é o que faltava. */
    if (!caixa.hasAttribute('tabindex')) caixa.setAttribute('tabindex', '-1');
    const id = requestAnimationFrame(() => caixa.focus({ preventScroll: true }));

    const girar = (e) => {
      if (e.key !== 'Tab') return;
      if (PILHA_FOCO[PILHA_FOCO.length - 1] !== caixa) return;
      const l = dentro();
      if (!l.length) { e.preventDefault(); caixa.focus({ preventScroll: true }); return; }
      const primeiro = l[0], ultimo = l[l.length - 1];
      if (!caixa.contains(document.activeElement)) { e.preventDefault(); primeiro.focus(); return; }
      if (e.shiftKey && document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
    };
    document.addEventListener('keydown', girar, true);
    return () => {
      cancelAnimationFrame(id);
      document.removeEventListener('keydown', girar, true);
      const i = PILHA_FOCO.indexOf(caixa);
      if (i >= 0) PILHA_FOCO.splice(i, 1);
      /* Devolver o foco a um elemento que saiu do documento no meio do
         caminho jogaria o foco para o `body` — daí a conferência. */
      if (veioDe && document.contains(veioDe) && typeof veioDe.focus === 'function')
        veioDe.focus({ preventScroll: true });
    };
  }, []);
}

const Campo = ({ rotulo, ajuda, erro, children }) => html`
  <label class="campo">
    <span>${rotulo}</span>
    ${children}
    ${erro ? html`<span class="erro-campo">${erro}</span>` : ajuda ? html`<span class="ajuda">${ajuda}</span>` : null}
  </label>`;

/* A ilustração sai da tabela ARTE_DA_TELA (fase 8), traduzindo o ícone que a
   tela já pedia. `arte` força uma peça específica quando fizer sentido. */
const Vazio = ({ icone = 'busca', titulo, apoio, acao, arte }) => html`
  <div class="vazio">
    <${Ilustracao} nome=${arte || ARTE_DA_TELA[icone] || 'engrenagem'} tam=${104} halo />
    <p class="titulo">${titulo}</p>
    ${apoio ? html`<p class="apoio">${apoio}</p>` : null}
    ${acao}
  </div>`;

const Modal = ({ titulo, subtitulo, aoFechar, children, rodape, largura }) => {
  const caixa = useRef(null);
  usarFocoPreso(caixa);
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') aoFechar(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [aoFechar]);
  return html`
    <div class="cortina" onClick=${(e) => { if (e.target === e.currentTarget) aoFechar(); }}>
      <div class="modal" ref=${caixa} role="dialog" aria-modal="true" aria-label=${titulo} style=${largura ? 'max-width:' + largura + 'px' : ''}>
        <div class="modal-topo">
          <div><h2>${titulo}</h2>${subtitulo ? html`<p class="silencioso">${subtitulo}</p>` : null}</div>
          <button class="btn btn-fantasma btn-icone" onClick=${aoFechar} aria-label="Fechar"><${Icone} nome="x" /></button>
        </div>
        <div class="modal-corpo">${children}</div>
        ${rodape ? html`<div class="modal-rodape">${rodape}</div>` : null}
      </div>
    </div>`;
};

const Abas = ({ itens, ativa, aoTrocar }) => html`
  <div class="abas" role="tablist">
    ${itens.map(i => html`<button key=${i.id} class="aba" role="tab" aria-selected=${ativa === i.id} onClick=${() => aoTrocar(i.id)}>${i.nome}</button>`)}
  </div>`;

const Interruptor = ({ ligado, aoTrocar, rotulo }) => html`
  <button class="interruptor" role="switch" aria-checked=${ligado} aria-label=${rotulo} onClick=${aoTrocar}><i></i></button>`;

const ChaveValor = ({ chave, valor, forte }) => html`
  <div class="chave-valor">
    <span class="secundario">${chave}</span>
    <span class=${forte ? 'num' : ''} style=${forte ? 'font-size:15px' : 'font-weight:500'}>${valor}</span>
  </div>`;

const Indicador = ({ rotulo, valor, variacao, apoio, acento }) => html`
  <${Cartao} classe="indicador">
    <div class="rotulo">${rotulo}</div>
    <div style="display:flex;align-items:flex-end;gap:8px;margin-top:7px">
      <span class="valor" style=${acento ? 'color:' + acento : ''}>${valor}</span>
      ${variacao != null ? html`
        <span class="variacao" style=${'color:' + (variacao >= 0 ? 'var(--ok)' : 'var(--erro)') + ';padding-bottom:3px'}>
          <${Icone} nome=${variacao >= 0 ? 'cima' : 'baixo'} tam=${13} />${pct(Math.abs(variacao))}
        </span>` : null}
    </div>
    ${apoio ? html`<div class="apoio">${apoio}</div>` : null}
  <//>`;

/* ══ GRÁFICOS — SVG próprio, sem biblioteca ══ */
function GraficoArea({ dados, altura = 210, chaves = ['receita', 'despesa'] }) {
  /* A última linha do desenho lê `dados[dados.length - 1]` para pousar o
     ponto final. Com lista vazia isso é `dados[-1]`, que é indefinido, e a
     tela inteira caía — painel em branco numa oficina sem histórico. */
  if (!dados || !dados.length) return html`<p class="silencioso">Ainda sem dados no período.</p>`;
  const L = 46, R = 8, T = 12, B = 26, larg = 640;
  const cx = larg - L - R, cy = altura - T - B;
  const max = Math.max(1, ...dados.flatMap(d => chaves.map(k => d[k] || 0))) * 1.12;
  const px = (i) => L + (i / Math.max(1, dados.length - 1)) * cx;
  const py = (v) => T + cy - ((v || 0) / max) * cy;
  const linha = (k) => dados.map((d, i) => (i ? 'L' : 'M') + px(i).toFixed(1) + ',' + py(d[k]).toFixed(1)).join(' ');
  const area = linha(chaves[0]) + ' L' + px(dados.length - 1).toFixed(1) + ',' + (T + cy) + ' L' + px(0).toFixed(1) + ',' + (T + cy) + ' Z';
  const marcas = [0, 0.5, 1].map(f => max * f);

  return html`
    <svg viewBox=${'0 0 ' + larg + ' ' + altura} width="100%" height=${altura} role="img" aria-label="Evolução mensal">
      <defs><linearGradient id="g-area" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--azul-acao)" stop-opacity=".22" />
        <stop offset="100%" stop-color="var(--azul-acao)" stop-opacity="0" />
      </linearGradient></defs>
      ${marcas.map((v, i) => html`
        <g key=${i}>
          <line x1=${L} y1=${py(v)} x2=${larg - R} y2=${py(v)} stroke="var(--linha-suave)" stroke-width="1" />
          <text x=${L - 8} y=${py(v) + 4} text-anchor="end" font-size="11" fill="var(--tinta-3)" font-family="var(--mono)">${Math.round(v / 1000)}k</text>
        </g>`)}
      <path d=${area} fill="url(#g-area)" />
      <path d=${linha(chaves[0])} fill="none" stroke="var(--azul-acao)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" />
      ${chaves[1] ? html`<path d=${linha(chaves[1])} fill="none" stroke="var(--roxo)" stroke-width="1.6" stroke-dasharray="4 4" stroke-linejoin="round" />` : null}
      ${dados.map((d, i) => html`<text key=${i} x=${px(i)} y=${altura - 8} text-anchor="middle" font-size="10.5" fill="var(--tinta-3)">${d.rotulo}</text>`)}
      <circle cx=${px(dados.length - 1)} cy=${py(dados[dados.length - 1][chaves[0]])} r="4" fill="var(--azul-acao)" stroke="var(--superficie)" stroke-width="2" />
    </svg>`;
}

function Barras({ dados, formato = brlCurto, cor = 'var(--azul-acao)', corSec = 'var(--ciano)' }) {
  if (!dados || dados.length === 0) return html`<p class="silencioso">Ainda sem dados suficientes.</p>`;
  const max = Math.max(1, ...dados.map(d => d.valor));
  return html`
    <div style="display:flex;flex-direction:column;gap:11px">
      ${dados.map((d, i) => html`
        <div key=${d.nome}>
          <div style="display:flex;justify-content:space-between;gap:10px;font-size:12.5px;margin-bottom:4px">
            <span class="secundario corta">${d.nome}</span>
            <span class="mono" style="font-weight:600;white-space:nowrap">${formato(d.valor)}</span>
          </div>
          <div style="height:7px;border-radius:99px;background:var(--linha-suave);overflow:hidden">
            <i style=${'display:block;height:100%;border-radius:99px;width:' + ((d.valor / max) * 100) + '%;background:' + (i === 0 ? cor : corSec) + ';opacity:' + (i === 0 ? 1 : 0.3 + (1 - i / dados.length) * 0.4)}></i>
          </div>
        </div>`)}
    </div>`;
}

/* ══ ASSISTENTE — o cartão de achado serve painel e notificações ══ */
function Achado({ a, lido }) {
  const { irPara, abrirOS, abrirCliente, abrirVeiculo } = usar();
  const agir = () => {
    if (a.acao?.abrirOS) abrirOS(a.acao.abrirOS);
    else if (a.acao?.abrirCliente) abrirCliente(a.acao.abrirCliente);
    else if (a.acao?.abrirVeiculo) abrirVeiculo(a.acao.abrirVeiculo);
    else if (a.acao?.ir) irPara(a.acao.ir);
  };
  return html`
    <button class=${'achado' + (lido ? ' lido' : '')} onClick=${agir}>
      <span class=${'icone ' + a.gravidade}><${Icone} nome=${a.icone} tam=${16} /></span>
      <span style="flex:1;min-width:0">
        <span class="titulo" style="display:block">${a.titulo}</span>
        <span class="texto" style="display:block">${a.texto}</span>
        ${a.acao ? html`<span style="display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:600;color:var(--azul-acao);margin-top:7px">
          ${a.acao.rotulo}<${Icone} nome="seta" tam=${13} /></span>` : null}
      </span>
    </button>`;
}

function GavetaNotificacoes({ aoFechar }) {
  const { achados, dados, acoes } = usar();
  const caixaGaveta = useRef(null);
  usarFocoPreso(caixaGaveta);
  const [filtro, setFiltro] = useState('todas');
  /* AUDITORIA (volume): a lista era desenhada inteira. Com 10 mil ordens a
     análise devolve mais de nove mil achados, e nove mil cartões no DOM
     travam a aba antes de o primeiro aparecer. Medido: 10.000 ordens →
     9.052 achados. O teto sobe sob demanda. */
  const [teto, setTeto] = useState(40);
  const CATS = [
    { id:'todas', nome:'Todas' }, { id:'operacao', nome:'Operação' },
    { id:'estoque', nome:'Estoque' }, { id:'financeiro', nome:'Financeiro' }, { id:'clientes', nome:'Clientes' },
  ];
  const lista = achados.filter(a => filtro === 'todas' || a.categoria === filtro);
  const naoLidos = achados.filter(a => !dados.lidos.includes(a.id)).length;

  return html`
    <div class="gaveta-fundo" onClick=${e => { if (e.target === e.currentTarget) aoFechar(); }}>
      <aside class="gaveta" ref=${caixaGaveta} role="dialog" aria-modal="true" aria-label="Central de notificações">
        <div class="gaveta-topo">
          <div>
            <h2>Notificações</h2>
            <p class="silencioso">${naoLidos > 0 ? naoLidos + ' sem leitura' : 'Tudo em dia'}</p>
          </div>
          <div style="display:flex;gap:6px">
            ${naoLidos > 0 ? html`<button class="btn btn-fantasma btn-p" onClick=${acoes.lerTudo}>Marcar lidas</button>` : null}
            <button class="btn btn-fantasma btn-icone" onClick=${aoFechar} aria-label="Fechar"><${Icone} nome="x" /></button>
          </div>
        </div>
        <div style="padding:12px 14px 0"><div class="filtros">
          ${CATS.map(c => html`<button key=${c.id} class="filtro" aria-pressed=${filtro === c.id} onClick=${() => setFiltro(c.id)}>${c.nome}</button>`)}
        </div></div>
        <div class="gaveta-corpo">
          ${lista.length === 0
            ? html`<${Vazio} icone="check" titulo="Nada por aqui" apoio="Nenhum alerta nesta categoria. A oficina está no rumo." />`
            : html`
              ${lista.slice(0, teto).map(a => html`<${Achado} key=${a.id} a=${a} lido=${dados.lidos.includes(a.id)} />`)}
              ${lista.length > teto ? html`
                <button class="btn btn-neutro btn-bloco" style="margin-top:10px"
                  onClick=${() => setTeto(x => x + 40)}>Ver mais (${lista.length - teto} restantes)</button>` : null}`}
        </div>
      </aside>
    </div>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   PAINEL INTELIGENTE
   ══════════════════════════════════════════════════════════════════════════ */
function TelaPainel() {
  const { dados, metricas, achados, papel, irPara, abrirNotificacoes, abrirCliente } = usar();
  const m = metricas;
  const podeCusto = PAPEIS[papel].custo;
  const dif = m.mediaAnterior > 0 ? ((m.mesAtual.receita - m.mediaAnterior) / m.mediaAnterior) * 100 : null;
  const gastos = dados.lancamentos.filter(l => l.tipo === 'pagar' && l.status === 'aberto');
  const paraRetorno = m.clientes.filter(c => c.inativo);
  const topo = achados.filter(a => a.gravidade !== 'positivo').slice(0, 4);

  return html`
    <div style="display:flex;flex-direction:column;gap:16px">

      ${/* O assistente vem primeiro: quem abre o sistema quer saber o que fazer hoje */ ''}
      <${Cartao}>
        <div class="cartao-topo">
          <div style="display:flex;align-items:center;gap:9px">
            <span style="width:30px;height:30px;border-radius:9px;background:var(--roxo-fundo);color:var(--roxo);display:flex;align-items:center;justify-content:center">
              <${Icone} nome="faisca" tam=${16} /></span>
            <div>
              <h3>O que precisa da sua atenção</h3>
              <p class="silencioso">${achados.length} ${achados.length === 1 ? 'ponto identificado' : 'pontos identificados'} nos dados de hoje</p>
            </div>
          </div>
          <button class="btn btn-neutro btn-p esconde-mobile" onClick=${abrirNotificacoes}>Ver todos<${Icone} nome="seta" tam=${13} /></button>
        </div>
        ${topo.length === 0
          ? html`<div class="aviso aviso-ok"><${Icone} nome="check" tam=${16} />
              <span>Nenhum ponto crítico. Pátio girando, estoque no lugar e contas em dia.</span></div>`
          : html`<div class="grade g-2">${topo.map(a => html`<${Achado} key=${a.id} a=${a} />`)}</div>`}
      <//>

      ${/* A leitura de três segundos */ ''}
      <div class="faixa-situacao">
        <button onClick=${() => irPara('patio')}>
          <div class="n">${m.ativas.length}</div>
          <div class="r"><i class="ponto execucao"></i>Veículos na oficina</div>
        </button>
        <button onClick=${() => irPara('ordens')}>
          <div class="n" style=${m.aguardandoAprovacao.length ? 'color:var(--alerta)' : ''}>${m.aguardandoAprovacao.length}</div>
          <div class="r"><i class="ponto aguardando"></i>Aguardando aprovação</div>
        </button>
        <button onClick=${() => irPara('ordens')}>
          <div class="n">${m.prontas.length}</div>
          <div class="r"><i class="ponto pronto"></i>Prontos para entrega</div>
        </button>
        <button onClick=${() => irPara('financeiro')}>
          <div class="n" style=${m.aguardandoPagamento.length ? 'color:var(--erro)' : ''}>${m.aguardandoPagamento.length}</div>
          <div class="r"><i class="ponto cancelado"></i>Aguardando pagamento</div>
        </button>
        <button onClick=${() => irPara('relatorios')}>
          <div class="n">${m.concluidasMes.length}</div>
          <div class="r"><i class="ponto finalizado"></i>Finalizados no mês</div>
        </button>
      </div>

      <div class="grade g-4">
        <${Indicador} rotulo="Faturamento do mês" valor=${brlCurto(m.mesAtual.receita)} variacao=${dif}
          apoio=${'Média dos meses anteriores: ' + brlCurto(m.mediaAnterior)} />
        <${Indicador} rotulo="Em aberto no pátio" valor=${brlCurto(m.emAberto)} acento="var(--azul-acao)"
          apoio=${m.ativas.length + ' ordens ainda não faturadas'} />
        <${Indicador} rotulo="Gastos em aberto" valor=${brlCurto(gastos.reduce((s, l) => s + l.valor, 0))}
          apoio=${gastos.length + ' contas a pagar'} />
        <${Indicador} rotulo="Veículos cadastrados" valor=${dados.veiculos.length}
          apoio=${dados.clientes.length + ' clientes na base'} />
      </div>

      <div class="grade g-2-1">
        <${Cartao}>
          <div class="cartao-topo">
            <div><h3>Receita e custo por mês</h3><p class="silencioso">Doze meses, com base nas ordens concluídas</p></div>
            <div style="display:flex;gap:14px;font-size:12px" class="secundario esconde-mobile">
              <span style="display:inline-flex;align-items:center;gap:6px"><i style="width:9px;height:3px;border-radius:2px;background:var(--azul-acao);display:inline-block"></i>Receita</span>
              <span style="display:inline-flex;align-items:center;gap:6px"><i style="width:9px;height:3px;border-radius:2px;background:var(--roxo);display:inline-block"></i>Custo</span>
            </div>
          </div>
          <${GraficoArea} dados=${m.meses} chaves=${['receita', 'custo']} />
        <//>
        <${Cartao}>
          <div class="cartao-topo"><div><h3>Serviços que mais faturam</h3><p class="silencioso">Acumulado do período</p></div></div>
          <${Barras} dados=${m.mix.slice(0, 6)} />
        <//>
      </div>

      <div class="grade g-2-1">
        <${Cartao}>
          <div class="cartao-topo">
            <div><h3>Fila do pátio</h3><p class="silencioso">${m.ativas.length} veículos distribuídos nas etapas</p></div>
            <button class="btn btn-neutro btn-p esconde-mobile" onClick=${() => irPara('patio')}>Abrir pátio<${Icone} nome="seta" tam=${13} /></button>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:8px">
            ${ETAPAS.map(e => {
              const n = m.ativas.filter(o => o.etapa === e.id).length;
              return html`
                <button key=${e.id} onClick=${() => irPara('patio')}
                  style="flex:1;min-width:102px;text-align:left;padding:10px 12px;background:var(--superficie-2);border:1px solid var(--linha);border-radius:10px">
                  <div style="display:flex;align-items:center;gap:5px;font-size:11.5px;color:var(--tinta-3);font-weight:500">
                    <i class=${'ponto ' + e.situacao}></i>${e.curto}</div>
                  <div class="num" style=${'font-size:21px;margin-top:2px;color:' + (n ? 'var(--tinta)' : 'var(--tinta-3)')}>${String(n).padStart(2, '0')}</div>
                </button>`;
            })}
          </div>
        <//>

        <${Cartao}>
          <div class="cartao-topo"><div>
            <h3>Clientes para retornar</h3>
            <p class="silencioso">Sem passar aqui há mais de ${Math.round(DIAS_INATIVO / 30)} meses</p>
          </div></div>
          ${paraRetorno.length === 0
            ? html`<p class="silencioso">Nenhum cliente inativo. Boa retenção.</p>`
            : html`<div style="display:flex;flex-direction:column;gap:11px">
                ${paraRetorno.slice(0, 5).map(c => html`
                  <button key=${c.id} onClick=${() => abrirCliente(c.id)} style="display:flex;align-items:center;gap:10px;width:100%;text-align:left">
                    <span class="avatar" style="width:32px;height:32px;font-size:11.5px">${iniciais(c.nome)}</span>
                    <div style="flex:1;min-width:0">
                      <div class="corta" style="font-size:13px;font-weight:500">${c.nome}</div>
                      <div class="silencioso">${mesesDesde(c.ultima)} meses · ${brl(c.gasto)} no histórico</div>
                    </div>
                    <${Icone} nome="telefone" tam=${15} cor="var(--tinta-3)" />
                  </button>`)}
              </div>`}
        <//>
      </div>

      ${!podeCusto ? html`
        <div class="aviso aviso-info"><${Icone} nome="alerta" tam=${16} />
          <span>Você está no perfil de ${PAPEIS[papel].nome.toLowerCase()}. Custo de peça e margem ficam ocultos.</span></div>` : null}
    </div>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   PÁTIO — arraste por ponteiro (mouse e toque); no celular, outra interação
   ══════════════════════════════════════════════════════════════════════════ */
function FichaOS({ ordem, aoAbrir, aoIniciarArrasto, arrastando, compacta }) {
  const { dados } = usar();
  return html`
    <article class=${'ficha' + (arrastando ? ' arrastando' : '')}
      onPointerDown=${aoIniciarArrasto} onClick=${aoAbrir} role="button" tabIndex="0"
      onKeyDown=${(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); aoAbrir(); } }}
      aria-label=${'OS ' + ordem.numero + ', ' + ordem.veiculo?.marca + ' ' + ordem.veiculo?.modelo}>
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px">
        <${Placa} valor=${ordem.veiculo?.placa} tam="p" />
        <span class="mono" style="font-size:10.5px;color:var(--tinta-3);padding-top:3px">#${ordem.numero}</span>
      </div>
      <div>
        <div class="modelo corta">${ordem.veiculo?.marca} ${ordem.veiculo?.modelo}</div>
        <div class="silencioso corta">${ordem.cliente?.nome}</div>
      </div>
      ${!compacta ? html`<${Envelhecimento} dias=${ordem.dias} />` : null}
      <div class="rodape">
        <span class="mono" style="font-size:13px;font-weight:600">${brlBruto(ordem.totais.liquido)}</span>
        ${comMecanicos(dados) && ordem.mecanico
          ? html`<span class="mec" title=${mecanicoNome(ordem.mecanico)}>${iniciais(mecanicoNome(ordem.mecanico))}</span>`
          : null}
      </div>
    </article>`;
}

function TelaPatio() {
  const { metricas, acoes, abrirOS, ehMobile } = usar();
  const [etapaAtiva, setEtapaAtiva] = useState('entrada');
  const [arraste, setArraste] = useState(null);
  const refArraste = useRef(null);
  const ativas = metricas.ativas;

  const iniciarArrasto = (ordem) => (ev) => {
    if (ehMobile || ev.button === 1 || ev.button === 2) return;
    const alvo = ev.currentTarget;
    const inicio = { x: ev.clientX, y: ev.clientY };
    let ativo = false;
    alvo.setPointerCapture(ev.pointerId);
    const mover = (e) => {
      if (!ativo && Math.hypot(e.clientX - inicio.x, e.clientY - inicio.y) < 8) return;
      if (!ativo) { ativo = true; refArraste.current = ordem.id; setArraste({ id: ordem.id, x: e.clientX, y: e.clientY, col: null }); }
      const sob = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-coluna]');
      setArraste(a => a && { ...a, x: e.clientX, y: e.clientY, col: sob?.dataset.coluna || null });
    };
    const soltar = (e) => {
      alvo.releasePointerCapture?.(ev.pointerId);
      alvo.removeEventListener('pointermove', mover);
      alvo.removeEventListener('pointerup', soltar);
      alvo.removeEventListener('pointercancel', soltar);
      if (ativo) {
        const sob = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-coluna]');
        if (sob?.dataset.coluna) acoes.moverOS(ordem.id, sob.dataset.coluna);
        setTimeout(() => { refArraste.current = null; }, 0);
      }
      setArraste(null);
    };
    alvo.addEventListener('pointermove', mover);
    alvo.addEventListener('pointerup', soltar);
    alvo.addEventListener('pointercancel', soltar);
  };
  const abrir = (o) => () => { if (!refArraste.current) abrirOS(o.id); };

  if (ehMobile) {
    const daEtapa = ativas.filter(o => o.etapa === etapaAtiva);
    return html`
      <div style="display:flex;flex-direction:column;gap:14px">
        <div class="rolagem" style="margin:0 -14px;padding:0 14px">
          <div class="filtros" style="flex-wrap:nowrap;width:max-content">
            ${ETAPAS.map(e => {
              const n = ativas.filter(o => o.etapa === e.id).length;
              return html`<button key=${e.id} class="filtro" aria-pressed=${etapaAtiva === e.id} onClick=${() => setEtapaAtiva(e.id)}>
                ${e.curto}${n ? html` <span class="mono" style="opacity:.7">${n}</span>` : ''}</button>`;
            })}
          </div>
        </div>
        ${daEtapa.length === 0
          ? html`<${Cartao}><${Vazio} icone="carro" titulo=${'Nenhum veículo em ' + etapaNome(etapaAtiva).toLowerCase()}
              apoio="Toque em outra etapa ou registre a entrada de um veículo." /><//>`
          : html`<div style="display:flex;flex-direction:column;gap:10px">
              ${daEtapa.map(o => html`
                <div key=${o.id} style="display:flex;flex-direction:column;gap:8px">
                  <${FichaOS} ordem=${o} aoAbrir=${() => abrirOS(o.id)} aoIniciarArrasto=${() => {}} />
                  <div style="display:flex;gap:8px">
                    ${etapaIndice(o.etapa) > 0 ? html`
                      <button class="btn btn-neutro" style="flex:1" onClick=${() => acoes.moverOS(o.id, ETAPAS[etapaIndice(o.etapa) - 1].id)}>
                        <${Icone} nome="voltar" tam=${14} />Voltar</button>` : null}
                    <button class="btn btn-primario" style="flex:2" onClick=${() => acoes.avancar(o)}>
                      ${o.etapa === 'entrega' ? 'Concluir e entregar' : 'Avançar para ' + ETAPAS[etapaIndice(o.etapa) + 1].curto.toLowerCase()}
                      <${Icone} nome="seta" tam=${14} /></button>
                  </div>
                </div>`)}
            </div>`}
      </div>`;
  }

  const emArraste = arraste && ativas.find(o => o.id === arraste.id);
  return html`
    <div>
      <div class="patio">
        ${ETAPAS.map(col => {
          const fichas = ativas.filter(o => o.etapa === col.id);
          const total = fichas.reduce((s, o) => s + o.totais.liquido, 0);
          return html`
            <div key=${col.id} data-coluna=${col.id} class=${'coluna' + (arraste?.col === col.id ? ' alvo' : '')}>
              <div class="coluna-topo">
                <span class="titulo"><i class=${'ponto ' + col.situacao}></i>${col.curto}</span>
                <span class="qtd">${fichas.length}</span>
              </div>
              <div class="total">${total ? brlCurtoBruto(total) : '—'}</div>
              ${fichas.map(o => html`<${FichaOS} key=${o.id} ordem=${o} arrastando=${arraste?.id === o.id}
                aoIniciarArrasto=${iniciarArrasto(o)} aoAbrir=${abrir(o)} />`)}
              ${fichas.length === 0 ? html`<div class="solte">Solte um veículo aqui</div>` : null}
            </div>`;
        })}
      </div>
      ${emArraste ? html`
        <div class="fantasma" style=${'left:' + (arraste.x - 110) + 'px;top:' + (arraste.y - 34) + 'px'}>
          <${FichaOS} ordem=${emArraste} aoAbrir=${() => {}} aoIniciarArrasto=${() => {}} compacta />
        </div>` : null}
    </div>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   ORDENS DE SERVIÇO
   ══════════════════════════════════════════════════════════════════════════ */
function TelaOrdens() {
  const { metricas, abrirOS, ehMobile, irPara, papel } = usar();
  const [busca, setBusca] = useState('');
  const buscaLenta = useAtraso(busca);
  const [filtro, setFiltro] = useState('ativas');

  const FILTROS = [
    { id:'ativas', nome:'No pátio' }, { id:'aprovacao', nome:'Aguardando aprovação' },
    { id:'execucao', nome:'Em execução' }, { id:'entrega', nome:'Prontas' }, { id:'concluida', nome:'Concluídas' },
  ];

  const lista = useMemo(() => {
    const q = buscaLenta.trim().toLowerCase();
    return metricas.ordens.filter(o => {
      const okF = filtro === 'ativas' ? ehAtiva(o)
        : filtro === 'execucao' ? o.situacao === 'execucao' : o.etapa === filtro;
      const okQ = !q || [o.veiculo?.placa, o.cliente?.nome, o.veiculo?.modelo, o.veiculo?.marca, String(o.numero)]
        .some(x => String(x || '').toLowerCase().includes(q));
      return okF && okQ;
    }).sort((a, b) => filtro === 'concluida'
      ? new Date(b.concluida_em) - new Date(a.concluida_em) : b.dias - a.dias);
  }, [busca, filtro, metricas]);

  const cabecalho = html`
    <div style="display:flex;flex-wrap:wrap;gap:11px;padding:14px;border-bottom:1px solid var(--linha)">
      <div class="busca">
        <${Icone} nome="busca" tam=${15} cor="var(--tinta-3)" />
        <input value=${busca} onInput=${e => setBusca(e.target.value)} placeholder="Placa, número da OS, cliente ou modelo" aria-label="Buscar ordens" />
      </div>
      <div class="filtros">
        ${FILTROS.map(f => html`<button key=${f.id} class="filtro" aria-pressed=${filtro === f.id} onClick=${() => setFiltro(f.id)}>${f.nome}</button>`)}
      </div>
    </div>`;

  const pagina = usePagina(lista, 40);

  if (lista.length === 0) return html`
    <${Cartao} nu>${cabecalho}
      <${Vazio} titulo="Nenhuma ordem encontrada" apoio="Ajuste a busca ou os filtros. Se o veículo acabou de chegar, registre a entrada."
        acao=${html`<button class="btn btn-primario" style="margin-top:6px" onClick=${() => irPara('nova')}><${Icone} nome="mais" tam=${15} />Nova ordem</button>`} />
    <//>`;

  if (ehMobile) return html`
    <div style="display:flex;flex-direction:column;gap:12px">
      <${Cartao} nu>${cabecalho}<//>
      ${pagina.visiveis.map(o => html`
        <${Cartao} key=${o.id}>
          <button style="width:100%;text-align:left;display:flex;flex-direction:column;gap:11px" onClick=${() => abrirOS(o.id)}>
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px">
              <${Placa} valor=${o.veiculo?.placa} />
              <span class="mono" style="font-size:11.5px;color:var(--tinta-3)">OS ${o.numero}</span>
            </div>
            <div>
              <div style="font-size:14.5px;font-weight:600">${o.veiculo?.marca} ${o.veiculo?.modelo}</div>
              <div class="silencioso">${o.cliente?.nome}</div>
            </div>
            <${Regua} etapa=${o.etapa} dias=${o.dias} />
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
              <${SeloSituacao} etapa=${o.etapa} />
              <span class="mono" style="font-size:15px;font-weight:600">${brlBruto(o.totais.liquido)}</span>
            </div>
          </button>
          ${/* FASE 18 · fora do botão do cartão: botão dentro de botão é HTML
               inválido e o leitor de tela anuncia os dois como um só. */ ''}
          ${ehAtiva(o) && pode(papel, 'editar') ? html`
            <div style="display:flex;justify-content:flex-end;margin-top:10px;padding-top:10px;border-top:1px solid var(--linha-suave)">
              <button class="btn btn-neutro btn-p" onClick=${() => abrirOS(o.id, { editar: true })}>
                <${Icone} nome="lapis" tam=${14} />Editar ordem</button>
            </div>` : null}
        <//>`)}
      <${BotaoMais} restantes=${pagina.restantes} aoClicar=${pagina.mais} />
    </div>`;

  return html`
    <${Cartao} nu>
      ${cabecalho}
      <div class="rolagem">
        <table class="tabela">
          <thead><tr>
            <th>OS</th><th>Veículo</th><th>Cliente</th><th>Situação</th>
            <th style="width:120px">Progresso</th><th class="dir">Dias</th><th class="dir">Valor</th>
            <th class="dir" style="width:56px">Editar</th>
          </tr></thead>
          <tbody>
            ${pagina.visiveis.map(o => html`
              <tr key=${o.id} style="cursor:pointer" onClick=${() => abrirOS(o.id)} tabIndex="0"
                  onKeyDown=${e => { if (e.key === 'Enter') abrirOS(o.id); }}>
                <td class="mono" style="font-size:12.5px;color:var(--tinta-2)">${o.numero}</td>
                <td><div style="display:flex;align-items:center;gap:11px">
                  <${Placa} valor=${o.veiculo?.placa} tam="p" />
                  <div>
                    <div style="font-size:13.5px;font-weight:500">${o.veiculo?.marca} ${o.veiculo?.modelo}</div>
                    <div class="silencioso">${o.veiculo?.ano_modelo} · ${inteiro(o.km_entrada)} km</div>
                  </div>
                </div></td>
                <td class="secundario" style="font-size:13.5px">${o.cliente?.nome}</td>
                <td><${SeloSituacao} etapa=${o.etapa} /></td>
                <td><${Regua} etapa=${o.etapa} dias=${o.dias} /></td>
                <td class="dir mono" style=${'font-size:12.5px;font-weight:600;color:' + (o.etapa === 'concluida' ? 'var(--tinta-3)' : o.dias >= 6 ? 'var(--erro)' : o.dias >= 3 ? 'var(--alerta)' : 'var(--tinta-3)')}>
                  ${o.etapa === 'concluida' ? fmtData(o.concluida_em) : o.dias + 'd'}</td>
                <td class="dir mono" style="font-size:13.5px;font-weight:600">${brlBruto(o.totais.liquido)}</td>
                <td class="dir">
                  ${ehAtiva(o) && pode(papel, 'editar') ? html`
                    <span class="acoes-linha" onClick=${e => e.stopPropagation()}>
                      <button title="Editar ordem" aria-label=${'Editar a ordem ' + o.numero}
                        onClick=${e => { e.stopPropagation(); abrirOS(o.id, { editar: true }); }}>
                        <${Icone} nome="lapis" tam=${15} /></button>
                    </span>` : html`<span class="silencioso">—</span>`}
                </td>
              </tr>`)}
          </tbody>
        </table>
      </div>
      <${BotaoMais} restantes=${pagina.restantes} aoClicar=${pagina.mais} />
    <//>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   DETALHE DA OS E ORÇAMENTO PROFISSIONAL
   ══════════════════════════════════════════════════════════════════════════ */
function DetalheOS({ id, aoFechar, editarAoAbrir }) {
  const { dados, metricas, acoes, papel, avisar, abrirVeiculo, abrirCliente, abrirDocumento } = usar();
  const [aba, setAba] = useState('resumo');
  const [enviando, setEnviando] = useState(false);
  const [documento, setDocumento] = useState(null);
  const [recusando, setRecusando] = useState(null);
  /* FASE 18 · a ordem chega já aberta em edição quando o toque veio do lápis
     da lista. Quem abriu pelo cartão continua caindo no resumo, como antes. */
  const [editando, setEditando] = useState(Boolean(editarAoAbrir));
  /* Contador, não booleano: cada toque no atalho precisa remontar o editor de
     itens já aberto, inclusive quando ele acabou de ser fechado. */
  const [pedirItem, setPedirItem] = useState(0);
  const o = metricas.ordens.find(x => x.id === id);
  if (!o) return null;
  const podeEditar = ehAtiva(o) && pode(papel, 'editar');
  const nAnexos = dados.anexos.filter(a => a.os_id === id).length;
  const podeCusto = PAPEIS[papel].custo;
  const t = o.totais;
  const eventos = dados.eventos.filter(e => e.os_id === o.id).sort((a, b) => new Date(a.criado_em) - new Date(b.criado_em));
  const proxima = ETAPAS[etapaIndice(o.etapa) + 1];
  const validadeDias = o.validade ? diasAte(o.validade) : null;

  return html`
    <${Modal} titulo=${'Ordem ' + o.numero} subtitulo=${o.veiculo?.marca + ' ' + o.veiculo?.modelo + ' · aberta em ' + fmtData(o.aberta_em)}
      aoFechar=${aoFechar} largura=${680}
      rodape=${html`
        <${EncerrarOS} os=${o} aoFechar=${aoFechar} />
        <button class="btn btn-neutro" onClick=${() => setDocumento('os')}><${Icone} nome="imprimir" tam=${15} />Documentos</button>
        <button class="btn btn-zap" onClick=${() => setEnviando(true)}><${Icone} nome="zap" tam=${16} />Enviar ao cliente</button>
        ${o.etapa === 'aprovacao'
          ? html`
            <button class="btn btn-neutro" onClick=${() => setRecusando('')}><${Icone} nome="x" tam=${15} />Recusado</button>
            <button class="btn btn-sucesso" onClick=${() => { acoes.aprovarOS(o.id); avisar('Orçamento da OS ' + o.numero + ' aprovado pelo cliente.'); }}>
              <${Icone} nome="check" tam=${15} />Registrar aprovação</button>`
          : ehAtiva(o)
            ? html`<button class="btn ${o.etapa === 'entrega' ? 'btn-sucesso' : 'btn-primario'}" onClick=${() => { acoes.avancar(o); aoFechar(); }}>
                ${o.etapa === 'entrega' ? 'Concluir e entregar' : 'Avançar para ' + (proxima ? proxima.curto.toLowerCase() : 'conclusão')}
                <${Icone} nome="seta" tam=${14} /></button>`
            : null}`}>

      <div style="display:flex;align-items:center;gap:13px" class="nao-imprime">
        <${Placa} valor=${o.veiculo?.placa} />
        <div style="flex:1;min-width:0">
          <button onClick=${() => abrirVeiculo(o.veiculo_id)} style="font-size:15px;font-weight:600;text-align:left;color:var(--tinta)">
            ${o.veiculo?.marca} ${o.veiculo?.modelo}</button>
          <div class="silencioso">${o.veiculo?.ano_modelo} · ${o.veiculo?.cor} · ${inteiro(o.km_entrada)} km na entrada</div>
        </div>
        <${SeloSituacao} etapa=${o.etapa} />
      </div>

      ${/* FASE 18 · era o buraco relatado pela oficina: aberta a ordem, o que
           o cliente contou virava pedra. Apareceu barulho novo na suspensão,
           o carro voltou com outra reclamação, a quilometragem foi anotada
           errada no balcão — nada disso tinha onde entrar, e a saída era
           cancelar e abrir tudo de novo. O botão fica no alto, ao lado da
           situação, visível em qualquer aba. */ ''}
      ${podeEditar ? html`
        <div class="barra-editar nao-imprime">
          <button class="btn btn-primario" onClick=${() => setEditando(true)}>
            <${Icone} nome="lapis" tam=${15} />Editar ordem</button>
          <button class="btn btn-neutro" onClick=${() => { setAba('orcamento'); setPedirItem(n => n + 1); }}>
            <${Icone} nome="mais" tam=${15} />Incluir peça ou serviço</button>
          <span class="silencioso" style="flex:1;min-width:120px">Relato, quilometragem, garantia e orçamento
            seguem editáveis enquanto a ordem estiver aberta.</span>
        </div>` : null}

      <${Regua} etapa=${o.etapa} dias=${o.dias} />

      <div class="abas nao-imprime" role="tablist">
        ${[['resumo','Resumo'],['orcamento','Orçamento'],['checklist','Entrada'],
           ['anexos', 'Anexos' + (nAnexos ? ' (' + nAnexos + ')' : '')],['historico','Andamento']].map(([k, nome]) => html`
          <button key=${k} class="aba" role="tab" aria-selected=${aba === k} onClick=${() => setAba(k)}>${nome}</button>`)}
      </div>

      ${aba === 'resumo' ? html`
        <div style="display:flex;flex-direction:column;gap:14px">
          <div>
            <span class="rotulo">Cliente</span>
            <button onClick=${() => abrirCliente(o.cliente_id)} style="display:flex;align-items:center;gap:10px;margin-top:6px;width:100%;text-align:left">
              <span class="avatar" style="width:34px;height:34px;font-size:12.5px">${iniciais(o.cliente?.nome)}</span>
              <div style="flex:1">
                <div style="font-size:13.5px;font-weight:500">${o.cliente?.nome}</div>
                <div class="silencioso mono">${podeCusto ? fmtDoc(o.cliente?.documento) : mascDoc(o.cliente?.documento)} · ${fmtTel(o.cliente?.telefone)}</div>
              </div>
              <${Icone} nome="seta" tam=${15} cor="var(--tinta-3)" />
            </button>
          </div>
          <div>
            <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
              <span class="rotulo">Relato do cliente</span>
              ${podeEditar ? html`
                <button class="btn btn-neutro btn-p nao-imprime" onClick=${() => setEditando(true)}>
                  <${Icone} nome="lapis" tam=${13} />Acrescentar queixa</button>` : null}
            </div>
            <p class="secundario" style="font-size:13.5px;margin-top:5px;white-space:pre-wrap">${o.relato || '—'}</p>
          </div>
          <${Campo} rotulo="Diagnóstico e observação técnica" ajuda="Fica registrado no prontuário do veículo para sempre.">
            <textarea class="entrada" value=${o.obs_tecnica || ''}
              placeholder="O que foi encontrado, o que foi feito e o que fica para a próxima."
              onInput=${e => acoes.editarOS(o.id, { obs_tecnica: e.target.value })}></textarea>
          <//>
          ${comMecanicos(dados) ? html`
          <div>
            <span class="rotulo">Responsável</span>
            <div style="display:flex;align-items:center;gap:9px;margin-top:6px">
              <span class="avatar" style="width:30px;height:30px;font-size:11px;background:var(--roxo-fundo);color:var(--roxo)">${o.mecanico}</span>
              <span style="font-size:13.5px">${mecanicoNome(o.mecanico)}</span>
            </div>
          </div>` : null}
        </div>` : null}

      ${aba === 'orcamento' ? html`
        <div style="display:flex;flex-direction:column;gap:14px">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap">
            <span class="rotulo">Situação do orçamento</span>
            <${Selo} tom=${STATUS_ORCAMENTO[o.statusOrcamento].selo}>${STATUS_ORCAMENTO[o.statusOrcamento].nome}<//>
          </div>
          ${o.recusado_em ? html`
            <div class="aviso aviso-erro"><${Icone} nome="x" tam=${16} />
              <span>Recusado em ${fmtData(o.recusado_em)}${o.motivo_recusa ? ': ' + o.motivo_recusa : '.'}</span></div>` : null}
          ${o.etapa === 'aprovacao' && validadeDias != null ? html`
            <div class=${'aviso ' + (validadeDias < 0 ? 'aviso-erro' : validadeDias <= 2 ? 'aviso-alerta' : 'aviso-info')}>
              <${Icone} nome="relogio" tam=${16} />
              <span>${validadeDias < 0
                ? 'Orçamento vencido há ' + Math.abs(validadeDias) + ' dia(s). Reconfira o preço das peças antes de reenviar.'
                : 'Válido por mais ' + validadeDias + ' dia(s), até ' + fmtData(o.validade) + '.'}</span>
            </div>` : null}

          ${o.aprovada_em ? html`
            <div class="aviso aviso-ok"><${Icone} nome="check" tam=${16} />
              <span>Aprovado pelo cliente em ${fmtData(o.aprovada_em)}.</span></div>` : null}

          ${/* FASE 17 · ordem sem um item sequer é sempre defeito: ou a
               gravação dos itens não chegou ao servidor, ou a ordem foi aberta
               antes de lançar. Nos dois casos, o que o cliente recebe é um
               orçamento de zero real. Dizer isso aqui é mais barato do que
               descobrir pelo cliente. */ ''}
          ${o.itens.length === 0 ? html`
            <div class="aviso aviso-erro"><${Icone} nome="alerta" tam=${16} />
              <span><b>Esta ordem está sem itens.</b> Se você lançou peças ou serviços aqui,
                eles não chegaram ao servidor — confira a faixa de aviso no topo. Não envie ao
                cliente antes de resolver: o orçamento sairia zerado.</span></div>` : null}

          ${/* FASE 18 · o formulário de lançar item existia, mas morava no pé
               do bloco de mão de obra, atrás de um botão cinza. Quem precisava
               acrescentar a peça descoberta no diagnóstico não achava, e
               concluía que a ordem estava fechada para mudança. Ele sobe para
               o alto da aba, que é onde a pessoa chega quando o orçamento
               mudou. */ ''}
          <div class="nao-imprime"><${EditorItensOS} key=${'itens-' + pedirItem} os=${o} iniciarAberto=${pedirItem > 0} /></div>

          <div>
            <span class="rotulo">Peças</span>
            <div style="margin-top:6px">
              ${o.itens.filter(i => i.tipo === 'peca').length === 0
                ? html`<p class="silencioso" style="padding:6px 0">Nenhuma peça lançada.</p>`
                : o.itens.filter(i => i.tipo === 'peca').map(i => html`
                  <div key=${i.id} class="linha-item">
                    <span class="marca"><${Icone} nome="caixa" tam=${15} /></span>
                    <div style="flex:1;min-width:0">
                      <div style="font-size:13.5px;font-weight:500">${i.descricao}</div>
                      <div class="silencioso">qtd ${i.quantidade} × ${brlBruto(i.preco_unitario)}${podeCusto && i.custo_unitario ? ' · ' + CUSTO_OFICINA.toLowerCase() + ' ' + brlBruto(i.custo_unitario) + ' · lucro ' + brlBruto(lucroDoItem(i)) : ''}</div>
                    </div>
                    <span class="mono" style="font-size:13.5px;font-weight:600">${brlBruto(i.quantidade * i.preco_unitario)}</span>
                    <${RemoverItem} os=${o} item=${i} />
                  </div>`)}
            </div>
          </div>

          <div>
            <span class="rotulo">Mão de obra</span>
            <div style="margin-top:6px">
              ${o.itens.filter(i => i.tipo === 'servico').length === 0
                ? html`<p class="silencioso" style="padding:6px 0">Nenhum serviço lançado.</p>`
                : o.itens.filter(i => i.tipo === 'servico').map(i => html`
                  <div key=${i.id} class="linha-item">
                    <span class="marca"><${Icone} nome="chave" tam=${15} /></span>
                    <div style="flex:1;min-width:0"><div style="font-size:13.5px;font-weight:500">${i.descricao}</div></div>
                    <span class="mono" style="font-size:13.5px;font-weight:600">${brlBruto(i.quantidade * i.preco_unitario)}</span>
                    <${RemoverItem} os=${o} item=${i} />
                  </div>`)}
            </div>
          </div>

          <div class="nao-imprime" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            ${/* onChange (e não onInput): grava ao sair do campo. Com onInput,
                  digitar "260" gerava três linhas de auditoria — 2, 26 e 260. */ ''}
            <${Campo} rotulo="Desconto" ajuda="Aplicado ao sair do campo">
              <input class="entrada mono" type="text" inputmode="decimal" autocomplete="off" placeholder="0,00" value=${o.desconto || ''}
                onChange=${e => acoes.editarOS(o.id, { desconto: Math.max(0, numeroBR(e.target.value)) })} />
            <//>
            <${Campo} rotulo="Validade" ajuda="Dias a partir da abertura">
              <input class="entrada mono" type="number" min="1" value=${o.validade_dias || VALIDADE_PADRAO}
                onChange=${e => acoes.editarOS(o.id, { validade_dias: Math.max(1, Number(e.target.value) || VALIDADE_PADRAO) })} />
            <//>
          </div>

          <${Campo} rotulo="Observações do orçamento" ajuda="Sai no documento enviado ao cliente.">
            <textarea class="entrada" value=${o.obs_orcamento || ''}
              placeholder="Ex.: valor não inclui alinhamento; prazo de dois dias úteis após aprovação."
              onInput=${e => acoes.editarOS(o.id, { obs_orcamento: e.target.value })}></textarea>
          <//>

          <div style="background:var(--superficie-2);border-radius:var(--raio);padding:14px">
            <div class="resumo-linha"><span class="secundario">Peças</span><span class="mono">${brlBruto(t.pecas)}</span></div>
            <div class="resumo-linha"><span class="secundario">Mão de obra</span><span class="mono">${brlBruto(t.servicos)}</span></div>
            ${t.desconto > 0 ? html`<div class="resumo-linha"><span class="secundario">Desconto</span>
              <span class="mono" style="color:var(--erro)">− ${brlBruto(t.desconto)}</span></div>` : null}
            <div class="resumo-total">
              <span style="font-weight:600">Total</span>
              <span class="num" style="font-size:21px">${brlBruto(t.liquido)}</span>
            </div>
          </div>

          ${podeCusto && t.venda > 0 ? html`
            <div class="nao-imprime">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:7px">
                <span class="secundario" style="font-size:13px">Margem da ordem</span>
                <span class="num" style=${'font-size:17px;color:' + (t.margem >= PISO_MARGEM ? 'var(--ok)' : 'var(--alerta)')}>${pct(t.margem)}</span>
              </div>
              <div style="height:6px;border-radius:99px;background:var(--linha-suave);overflow:hidden">
                <i style=${'display:block;height:100%;border-radius:99px;width:' + Math.max(0, Math.min(t.margem, 100)) + '%;background:' + (t.margem >= PISO_MARGEM ? 'var(--ok)' : 'var(--alerta)')}></i>
              </div>
              ${t.margem < PISO_MARGEM
                ? html`<div class="aviso aviso-alerta" style="margin-top:11px"><${Icone} nome="alerta" tam=${15} />
                    <span>Abaixo do piso de ${PISO_MARGEM}%. O desconto de ${brlBruto(t.desconto)} entra na conta — esta ordem precisa de aprovação do gerente.</span></div>`
                : html`<p class="silencioso" style="margin-top:7px">Lucro de ${brlBruto(t.lucro)} sobre o total já descontado.</p>`}
            </div>` : null}
        </div>` : null}

      ${aba === 'checklist' ? html`
        <div style="display:flex;flex-direction:column;gap:14px">
          ${ehAtiva(o) && pode(papel, 'editar')
            ? html`<${ChecklistEntrada} valor=${o.checklist || checklistVazio()} compacto
                aoMudar=${(c) => acoes.editarChecklist(o.id, c)} veiculo=${o.veiculo} />`
            : html`<${ResumoChecklist} checklist=${o.checklist} veiculo=${o.veiculo} />`}
          ${!ehAtiva(o) ? html`<p class="silencioso">Ordem encerrada: o checklist fica como registro e não pode mais ser alterado.</p>` : null}
        </div>` : null}

      ${aba === 'anexos' ? html`<${Anexos} osId=${o.id} />` : null}

      ${aba === 'historico' ? html`
        <div class="tempo">
          ${eventos.length === 0
            ? html`<p class="silencioso">Sem movimentações registradas.</p>`
            : eventos.map((e, i) => html`
              <div key=${e.id} class="tempo-item">
                <div class="tempo-eixo">
                  <span class=${'bola' + (i === eventos.length - 1 ? ' destaque' : '')}></span>
                  ${i < eventos.length - 1 ? html`<span class="fio"></span>` : null}
                </div>
                <div class="tempo-corpo">
                  <div style="font-size:13.5px;font-weight:500">${etapaNome(e.para_etapa)}</div>
                  <div class="silencioso">${fmtData(e.criado_em)} · ${e.usuario}</div>
                </div>
              </div>`)}
        </div>` : null}

      ${editando ? html`<${FormEditarOS} os=${o} aoFechar=${() => setEditando(false)}
        aoPedirItens=${() => { setEditando(false); setAba('orcamento'); setPedirItem(n => n + 1); }} />` : null}

      ${enviando ? html`<${ModalEnvio} os=${o} aoFechar=${() => setEnviando(false)} />` : null}

      ${documento ? html`
        <${Modal} titulo="Imprimir documento" subtitulo=${'Ordem ' + o.numero} aoFechar=${() => setDocumento(null)}
          rodape=${html`<button class="btn btn-neutro" onClick=${() => setDocumento(null)}>Fechar</button>`}>
          <p class="silencioso">Escolha o documento. Todos saem com o logotipo e os dados cadastrados em Ajustes.</p>
          <div style="display:flex;flex-direction:column;gap:8px">
            ${[['os','Ordem de serviço','Para o arquivo da oficina e para o cliente acompanhar'],
               ['orcamento','Orçamento','Com validade, prazo e linha de aprovação'],
               ['entrega','Comprovante de entrega','Confere os itens deixados e informa a garantia']].map(([t, nome, apoio]) => html`
              <button key=${t} class="recomendacao" onClick=${() => { setDocumento(null); abrirDocumento({ tipo: t, os: o }); }}>
                <span class="marca-rec"><${Icone} nome=${DOCUMENTOS[t].icone} tam=${14} /></span>
                <span style="flex:1;min-width:0;text-align:left">
                  <span style="display:block;font-size:13px;font-weight:600">${nome}</span>
                  <span class="silencioso" style="display:block;margin-top:2px">${apoio}</span>
                </span>
                <${Icone} nome="seta" tam=${15} cor="var(--tinta-3)" />
              </button>`)}
          </div>
        <//>` : null}

      ${recusando !== null ? html`
        <${Modal} titulo="Registrar recusa do orçamento" subtitulo=${'OS ' + o.numero + ' · ' + o.cliente?.nome}
          aoFechar=${() => setRecusando(null)}
          rodape=${html`
            <button class="btn btn-neutro" onClick=${() => setRecusando(null)}>Cancelar</button>
            <button class="btn" style="background:var(--erro);color:#fff"
              onClick=${() => { acoes.recusarOS(o.id, recusando); avisar('Recusa registrada. A ordem foi cancelada.'); setRecusando(null); aoFechar(); }}>
              Confirmar recusa</button>`}>
          <div class="aviso aviso-alerta"><${Icone} nome="alerta" tam=${16} />
            <span>A ordem será cancelada e o veículo sai do pátio. O registro fica no histórico do cliente
            e ajuda a entender por que orçamentos não fecham.</span></div>
          <${Campo} rotulo="Motivo" ajuda="Preço, prazo, vai fazer em outro lugar, desistiu do conserto...">
            <textarea class="entrada" value=${recusando} autofocus
              placeholder="Ex.: cliente achou o valor alto e vai pesquisar."
              onInput=${e => setRecusando(e.target.value)}></textarea>
          <//>
        <//>` : null}
    <//>`;
}

/** Envio digital: a estrutura está pronta, a integração entra na próxima fase. */
function ModalEnvio({ os, aoFechar }) {
  const { avisar, dados } = usar();
  const OFICINA = dados.oficina;
  const [canal, setCanal] = useState('whatsapp');
  const nomes = { whatsapp:'WhatsApp', email:'E-mail', sms:'SMS' };
  const texto = 'Olá, ' + String(os.cliente?.nome || '').split(' ')[0] + '! Aqui é da ' + OFICINA.nome +
    '. O orçamento do seu ' + os.veiculo?.marca + ' ' + os.veiculo?.modelo + ' (placa ' + os.veiculo?.placa +
    ') ficou em ' + brlBruto(os.totais.liquido) + ', sendo ' + brlBruto(os.totais.pecas) + ' em peças e ' +
    brlBruto(os.totais.servicos) + ' em mão de obra. Válido até ' +
    fmtData(os.validade || somaDias(os.aberta_em, os.validade_dias || VALIDADE_PADRAO)) + '. Podemos seguir?';

  return html`
    <${Modal} titulo="Enviar orçamento" subtitulo=${'OS ' + os.numero + ' para ' + os.cliente?.nome} aoFechar=${aoFechar}
      rodape=${html`
        <button class="btn btn-neutro" onClick=${aoFechar}>Fechar</button>
        <button class="btn btn-primario" onClick=${() => { copiarE(texto, avisar, 'Mensagem copiada. Cole no aplicativo.'); aoFechar(); }}>
          <${Icone} nome="arquivo" tam=${15} />Copiar mensagem</button>`}>
      <div class="filtros">
        ${Object.entries(nomes).map(([id, nome]) => html`
          <button key=${id} class="filtro" aria-pressed=${canal === id} onClick=${() => setCanal(id)}>${nome}</button>`)}
      </div>
      <div class="aviso aviso-info"><${Icone} nome="alerta" tam=${16} />
        <span>O envio automático ainda não está ligado. A mensagem sai pronta abaixo — copie e cole por enquanto.
        A integração de ${nomes[canal]} se conecta em Automações.</span></div>
      <${Campo} rotulo="Prévia da mensagem">
        <textarea class="entrada" style="min-height:130px" readonly value=${texto}></textarea>
      <//>
    <//>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   FICHA DO CLIENTE — visão de CRM
   ══════════════════════════════════════════════════════════════════════════ */
function FichaCliente({ id, aoFechar }) {
  const { metricas, acoes, papel, irPara, abrirVeiculo, abrirOS } = usar();
  const [aba, setAba] = useState('veiculos');
  const c = metricas.clientes.find(x => x.id === id);
  if (!c) return null;
  const podeVerDoc = PAPEIS[papel].custo || papel === 'atendente';

  return html`
    <${Modal} titulo=${c.nome} subtitulo=${'Cliente desde ' + fmtDataLonga(c.desde)} aoFechar=${aoFechar} largura=${680}
      rodape=${html`
        <button class="btn btn-neutro" onClick=${() => { aoFechar(); irPara('nova'); }}><${Icone} nome="mais" tam=${15} />Nova ordem</button>
        <a class="btn btn-primario" href=${'tel:' + digitos(c.telefone)}><${Icone} nome="telefone" tam=${15} />Ligar</a>`}>

      <div style="display:flex;align-items:center;gap:13px">
        <span class="avatar" style="width:48px;height:48px;font-size:16px">${iniciais(c.nome)}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:16px;font-weight:600">${c.nome}</div>
          <div class="silencioso mono">${podeVerDoc ? fmtDoc(c.documento) : mascDoc(c.documento)} · ${fmtTel(c.telefone)}</div>
        </div>
        ${c.gasto > 20000 ? html`<${Selo} tom="roxo">VIP<//>` : null}
        ${c.inativo ? html`<${Selo} tom="alerta" icone="relogio">Sem retorno<//>` : null}
      </div>

      <div class="grade g-4" style="gap:9px">
        ${[['Total gasto', brlCurto(c.gasto)], ['Ordens', c.concluidas.length],
           ['Ticket médio', brlCurto(c.ticket)], ['Última visita', c.ultima ? fmtData(c.ultima) : '—']].map(([k, v]) => html`
          <div key=${k} style="background:var(--superficie-2);border-radius:var(--raio);padding:11px">
            <div class="rotulo" style="font-size:10px">${k}</div>
            <div class="num" style="font-size:16px;margin-top:3px">${v}</div>
          </div>`)}
      </div>

      <div class="abas" role="tablist">
        ${[['veiculos','Veículos'],['historico','Histórico'],['notas','Notas e preferências']].map(([k, nome]) => html`
          <button key=${k} class="aba" role="tab" aria-selected=${aba === k} onClick=${() => setAba(k)}>${nome}</button>`)}
      </div>

      ${aba === 'veiculos' ? html`
        <div style="display:flex;flex-direction:column;gap:9px">
          ${c.veiculos.length === 0
            ? html`<p class="silencioso">Nenhum veículo vinculado ainda.</p>`
            : c.veiculos.map(v => {
                const mv = metricas.veiculos.find(x => x.id === v.id);
                return html`
                  <button key=${v.id} onClick=${() => abrirVeiculo(v.id)}
                    style="display:flex;align-items:center;gap:12px;padding:11px;border:1px solid var(--linha);border-radius:var(--raio);text-align:left;width:100%">
                    <${Placa} valor=${v.placa} />
                    <div style="flex:1;min-width:0">
                      <div style="font-size:13.5px;font-weight:600">${v.marca} ${v.modelo}</div>
                      <div class="silencioso">${v.ano_modelo} · ${inteiro(v.km_atual)} km · ${mv ? mv.concluidas.length : 0} passagens</div>
                    </div>
                    ${mv && mv.revisaoVencida ? html`<${Selo} tom="alerta">Revisão<//>` : null}
                    <${Icone} nome="seta" tam=${15} cor="var(--tinta-3)" />
                  </button>`;
              })}
        </div>` : null}

      ${aba === 'historico' ? html`
        <div class="tempo">
          ${c.concluidas.length === 0
            ? html`<${Vazio} icone="historico" titulo="Ainda sem serviços concluídos" apoio="O histórico começa a se formar depois da primeira entrega." />`
            : c.concluidas.map((o, i) => html`
              <div key=${o.id} class="tempo-item">
                <div class="tempo-eixo">
                  <span class=${'bola' + (i === 0 ? ' destaque' : '')}></span>
                  ${i < c.concluidas.length - 1 ? html`<span class="fio"></span>` : null}
                </div>
                <div class="tempo-corpo">
                  <button onClick=${() => abrirOS(o.id)} style="text-align:left;width:100%">
                    <div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px">
                      <span style="font-size:13.5px;font-weight:600">${o.itens.find(x => x.tipo === 'servico')?.descricao || 'Serviço'}</span>
                      <span class="mono" style="font-size:13px;font-weight:600">${brlBruto(o.totais.liquido)}</span>
                    </div>
                    <div class="silencioso">${fmtData(o.concluida_em)} · OS ${o.numero} · ${o.veiculo?.marca} ${o.veiculo?.modelo}</div>
                  </button>
                </div>
              </div>`)}
        </div>` : null}

      ${aba === 'notas' ? html`
        <div style="display:flex;flex-direction:column;gap:14px">
          <${Campo} rotulo="Observações internas" ajuda="Só a equipe vê. Combinações, histórico de cobrança, cuidados.">
            <textarea class="entrada" value=${c.observacoes || ''}
              placeholder="Ex.: paga sempre em dinheiro; prefere retirar no sábado de manhã."
              onInput=${e => acoes.editarCliente(c.id, { observacoes: e.target.value })}></textarea>
          <//>
          <${Campo} rotulo="Preferências" ajuda="Como esse cliente gosta de ser atendido.">
            <textarea class="entrada" value=${c.preferencias || ''}
              placeholder="Ex.: avisar por WhatsApp; só aceita peça original."
              onInput=${e => acoes.editarCliente(c.id, { preferencias: e.target.value })}></textarea>
          <//>
          <div>
            <span class="rotulo">Contato</span>
            <div style="margin-top:6px">
              <${ChaveValor} chave="Telefone" valor=${fmtTel(c.telefone)} />
              <${ChaveValor} chave="E-mail" valor=${c.email || '—'} />
              <${ChaveValor} chave="Cidade" valor=${(c.cidade || '—') + (c.uf ? ' / ' + c.uf : '')} />
            </div>
          </div>
        </div>` : null}
    <//>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   PRONTUÁRIO DO VEÍCULO
   ══════════════════════════════════════════════════════════════════════════ */
function Prontuario({ id, aoFechar }) {
  const { metricas, abrirOS, abrirCliente, papel, abrirDocumento } = usar();
  const v = metricas.veiculos.find(x => x.id === id);
  if (!v) return null;
  const garantias = metricas.garantiasPorVeiculo.get(id) || [];
  const podeCusto = PAPEIS[papel].custo;

  const mapa = {};
  v.concluidas.forEach(o => o.itens.filter(i => i.tipo === 'peca').forEach(i => {
    mapa[i.descricao] = mapa[i.descricao] || { nome: i.descricao, qtd: 0, ultima: o.concluida_em };
    mapa[i.descricao].qtd += i.quantidade;
    if (new Date(o.concluida_em) > new Date(mapa[i.descricao].ultima)) mapa[i.descricao].ultima = o.concluida_em;
  }));
  const trocadas = Object.values(mapa).sort((a, b) => new Date(b.ultima) - new Date(a.ultima));

  const primeira = v.concluidas[v.concluidas.length - 1];
  const kmPorMes = primeira && v.concluidas.length > 1
    ? Math.round((v.km_atual - primeira.km_entrada) / Math.max(1, mesesDesde(primeira.concluida_em))) : null;

  return html`
    <${Modal} titulo=${v.marca + ' ' + v.modelo} subtitulo=${'Prontuário completo · ' + v.concluidas.length + ' passagens registradas'}
      aoFechar=${aoFechar} largura=${700}
      rodape=${html`
        <button class="btn btn-neutro" onClick=${aoFechar}>Fechar</button>
        <button class="btn btn-primario" onClick=${() => { aoFechar(); abrirDocumento({ tipo:'historico', veiculo:v }); }}>
          <${Icone} nome="imprimir" tam=${15} />Imprimir histórico</button>`}>

      <div style="display:flex;align-items:center;gap:15px;flex-wrap:wrap">
        <${Placa} valor=${v.placa} tam="g" />
        <div style="flex:1;min-width:180px">
          <div style="font-size:16px;font-weight:600">${v.marca} ${v.modelo}</div>
          <div class="silencioso">${v.ano_modelo} · ${v.cor} · ${inteiro(v.km_atual)} km</div>
          <button onClick=${() => abrirCliente(v.cliente_id)} style="display:inline-flex;align-items:center;gap:5px;font-size:12.5px;font-weight:600;color:var(--azul-acao);margin-top:5px">
            <${Icone} nome="pessoa" tam=${13} />${v.cliente?.nome}</button>
        </div>
        ${v.revisaoVencida ? html`<${Selo} tom="alerta" icone="faisca">Revisão vencida<//>`
          : v.revisaoProxima ? html`<${Selo} tom="info" icone="faisca">Revisão próxima<//>` : null}
      </div>

      <div class="grade g-4" style="gap:9px">
        ${[['Desde a revisão', v.kmDesdeRevisao != null ? inteiro(v.kmDesdeRevisao) + ' km' : '—'],
           ['Rodagem', kmPorMes ? inteiro(kmPorMes) + ' km/mês' : '—'],
           ['Investido', brlCurtoBruto(v.gasto)],
           ['Última visita', v.ultima ? fmtData(v.ultima.concluida_em) : '—']].map(([k, val]) => html`
          <div key=${k} style="background:var(--superficie-2);border-radius:var(--raio);padding:11px">
            <div class="rotulo" style="font-size:10px">${k}</div>
            <div class="num" style="font-size:15px;margin-top:3px">${val}</div>
          </div>`)}
      </div>

      <div>
        <span class="rotulo">Fotos do veículo</span>
        <div style="margin-top:9px"><${FotosDoVeiculo} veiculoId=${v.id} compacta /></div>
      </div>

      ${v.kmDesdeRevisao != null && v.kmDesdeRevisao > 0 ? html`
        <div>
          <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:6px">
            <span class="secundario">Intervalo até a próxima revisão</span>
            <span class="mono" style="font-weight:600">${inteiro(v.kmDesdeRevisao)} / ${inteiro(KM_ENTRE_REVISOES)} km</span>
          </div>
          <div style="height:7px;border-radius:99px;background:var(--linha-suave);overflow:hidden">
            <i style=${'display:block;height:100%;border-radius:99px;width:' + Math.min(100, (v.kmDesdeRevisao / KM_ENTRE_REVISOES) * 100) + '%;background:' + (v.revisaoVencida ? 'var(--alerta)' : 'var(--ciano)')}></i>
          </div>
        </div>` : null}

      ${garantias.length > 0 ? html`
        <div>
          <span class="rotulo">Garantias em curso</span>
          <div style="margin-top:8px">
            ${garantias.map(g => html`
              <div key=${g.os.id} class="chave-valor">
                <span>
                  <span style="font-weight:500">${g.os.itens.find(i => i.tipo === 'servico')?.descricao || 'Serviço'}</span>
                  <span class="silencioso" style="display:block">OS ${g.os.numero} · entregue em ${fmtData(g.os.concluida_em)}</span>
                </span>
                <span class=${'selo-garantia ' + situacaoGarantia(g.dias)}>até ${fmtData(g.ate)}</span>
              </div>`)}
          </div>
        </div>` : null}

      ${v.plano?.itens?.some(i => i.situacao !== 'ok') ? html`
        <div>
          <span class="rotulo">Previsão de manutenção</span>
          <div style="margin-top:8px">
            ${v.plano.itens.filter(i => i.situacao !== 'ok').slice(0, 4).map(i => html`
              <div key=${i.servico} class="item-prev">
                <div style="flex:1;min-width:0">
                  <div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px">
                    <span style="font-size:13px;font-weight:500">${i.servico}</span>
                    <span class="mono" style=${'font-size:12px;font-weight:600;color:' + (i.situacao === 'vencido' ? 'var(--alerta)' : 'var(--tinta-3)')}>
                      ${i.situacao === 'vencido' ? 'vencido' : i.situacao === 'proximo' ? fmtData(i.previsao) : 'a confirmar'}</span>
                  </div>
                  <div class="medidor" style="margin-top:5px">
                    <i style=${'width:' + Math.min(100, i.progresso) + '%;background:' + (i.situacao === 'vencido' ? 'var(--alerta)' : i.situacao === 'proximo' ? 'var(--ciano)' : 'var(--linha)')}></i>
                  </div>
                </div>
              </div>`)}
          </div>
          <p class="silencioso" style="margin-top:8px">Projeção pelo ritmo real deste carro: cerca de ${inteiro(Math.round((v.plano.kmDia || 0) * 30))} km por mês.</p>
        </div>` : null}

      ${trocadas.length > 0 ? html`
        <div>
          <span class="rotulo">Peças já substituídas</span>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">
            ${trocadas.slice(0, 8).map(p => html`<${Selo} key=${p.nome}>${p.nome} · ${fmtData(p.ultima)}<//>`)}
          </div>
        </div>` : null}

      <div>
        <span class="rotulo">Linha do tempo</span>
        <div class="tempo" style="margin-top:10px">
          ${v.concluidas.length === 0
            ? html`<${Vazio} icone="historico" titulo="Prontuário em branco"
                apoio="Este veículo ainda não teve serviço concluído aqui. A primeira entrega abre o histórico." />`
            : v.concluidas.map((o, i) => html`
              <div key=${o.id} class="tempo-item">
                <div class="tempo-eixo">
                  <span class=${'bola' + (i === 0 ? ' destaque' : '')}></span>
                  ${i < v.concluidas.length - 1 ? html`<span class="fio"></span>` : null}
                </div>
                <div class="tempo-corpo">
                  <button onClick=${() => abrirOS(o.id)} style="text-align:left;width:100%">
                    <div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px">
                      <span style="font-size:13.5px;font-weight:600">${o.itens.find(x => x.tipo === 'servico')?.descricao || 'Serviço'}</span>
                      <span class="mono" style="font-size:13px;font-weight:600">${brlBruto(o.totais.liquido)}</span>
                    </div>
                    <div class="silencioso">${fmtDataLonga(o.concluida_em)} · ${inteiro(o.km_entrada)} km · OS ${o.numero}</div>
                    ${o.itens.filter(x => x.tipo === 'peca').length > 0 ? html`
                      <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:7px">
                        ${o.itens.filter(x => x.tipo === 'peca').map(x => html`
                          <span key=${x.id} class="selo" style="font-size:11px">${x.descricao}${x.quantidade > 1 ? ' ×' + x.quantidade : ''}</span>`)}
                      </div>` : null}
                    ${o.obs_tecnica ? html`<p class="silencioso" style="margin-top:7px;font-style:italic">“${o.obs_tecnica}”</p>` : null}
                    ${podeCusto ? html`<div class="silencioso" style="margin-top:5px">Margem de ${pct(o.totais.margem)}</div>` : null}
                  </button>
                </div>
              </div>`)}
        </div>
      </div>
    <//>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   NOVA ORDEM — assistente guiado, cada passo com tela e validação próprias
   ══════════════════════════════════════════════════════════════════════════ */
const PASSOS = ['Cliente e veículo', 'Entrada', 'Itens', 'Revisão'];

function ResumoOrcamento({ t, podeCusto, r, setR }) {
  return html`
    <${Cartao}>
      <h3 style="margin-bottom:12px">Orçamento</h3>
      <div class="resumo-linha"><span class="secundario">Peças</span><span class="mono">${brlBruto(t.pecas)}</span></div>
      <div class="resumo-linha"><span class="secundario">Mão de obra</span><span class="mono">${brlBruto(t.servicos)}</span></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-top:12px">
        <${Campo} rotulo="Desconto">
          <input class="entrada mono" type="text" inputmode="decimal" autocomplete="off" placeholder="0,00" value=${r.desconto || ''}
            onInput=${e => setR(x => ({ ...x, desconto: numeroBR(e.target.value) }))} />
        <//>
        <${Campo} rotulo="Validade" ajuda="dias">
          <input class="entrada mono" type="number" min="1" value=${r.validade_dias}
            onInput=${e => setR(x => ({ ...x, validade_dias: Number(e.target.value) || VALIDADE_PADRAO }))} />
        <//>
      </div>
      <div class="resumo-total">
        <span style="font-weight:600">Total</span>
        <span class="num" style="font-size:21px">${brlBruto(t.liquido)}</span>
      </div>
      ${podeCusto && t.venda > 0 ? html`
        <div class="bloco-interno" style="margin-top:14px">
          <span class="aviso-interno"><${Icone} nome="cadeado" tam=${12} />Interno · não sai para o cliente</span>
          <div class="resumo-linha"><span class="secundario">${CUSTO_OFICINA}</span>
            <span class="mono">${brlBruto(t.custo)}</span></div>
          <div class="resumo-linha"><span class="secundario">${VALOR_CLIENTE}</span>
            <span class="mono">${brlBruto(t.liquido)}</span></div>
          <div class="linha-lucro">
            <span style="font-weight:600;font-size:13px">Lucro</span>
            <span class="valor-lucro" style=${'color:' + (t.lucro >= 0 ? 'var(--ok)' : 'var(--erro)')}>${brlBruto(t.lucro)}</span>
          </div>
          <div>
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
              <span class="secundario" style="font-size:12.5px">Margem</span>
              <span class="num" style=${'font-size:14px;color:' + (t.margem >= PISO_MARGEM ? 'var(--ok)' : 'var(--alerta)')}>${pct(t.margem)}</span>
            </div>
            <div style="height:6px;border-radius:99px;background:var(--linha-suave);overflow:hidden">
              <i style=${'display:block;height:100%;border-radius:99px;transition:width .4s cubic-bezier(.16,1,.3,1);width:' + Math.max(0, Math.min(t.margem, 100)) + '%;background:' + (t.margem >= PISO_MARGEM ? 'var(--ok)' : 'var(--alerta)')}></i>
            </div>
          </div>
          ${t.margem < PISO_MARGEM ? html`
            <div class="aviso aviso-alerta"><${Icone} nome="alerta" tam=${15} />
              <span>Abaixo do piso de ${PISO_MARGEM}%. O desconto entra na conta — precisa de aprovação do gerente.</span></div>` : null}
        </div>` : null}
    <//>`;
}

/* ─── FASE 17 · O RASCUNHO DA ORDEM ────────────────────────────────────────
   Era o defeito relatado como "coloquei item a item e não salvou nada; só o
   carro ficou". E era exatamente isso: até o toque em "Abrir ordem", TUDO o
   que este assistente coleta — veículo, relato, quilometragem, checklist e a
   lista de itens — vive só na memória desta tela. O veículo sobrevivia porque
   quem o gravou foi o formulário dele, que salva na hora.

   Bastava sair da tela para o pátio, tocar no menu, ou o navegador do celular
   descartar a aba em segundo plano — coisa que o Safari faz sozinho quando a
   memória aperta, e a oficina lança orçamento longo com o telefone na mão.
   Nenhum aviso, nenhum resto: a ordem simplesmente nunca existiu.

   Agora cada mudança cai no armazenamento local. Voltar à tela devolve tudo
   onde estava, e sair com item lançado avisa antes.                        */
const CHAVE_RASCUNHO = 'nitro.rascunho-os';
const RASCUNHO_VALIDADE = 72 * 3600 * 1000;   // três dias: OS de sexta abre na segunda

const rascunhoVazio = () => ({ cliente_id:'', veiculo_id:'', km_entrada:'', relato:'',
  itens:[], desconto:0, mecanico:'', validade_dias:VALIDADE_PADRAO, obs_orcamento:'',
  garantia_dias:GARANTIA_PADRAO, checklist: checklistVazio() });

function lerRascunhoOS() {
  const g = memoria.ler(CHAVE_RASCUNHO);
  if (!g || typeof g !== 'object' || !g.r) return null;
  if (!g.em || Date.now() - new Date(g.em).getTime() > RASCUNHO_VALIDADE) {
    memoria.apagar(CHAVE_RASCUNHO); return null;
  }
  /* Rascunho sem nada dentro não é rascunho: oferecer a recuperação de uma
     tela em branco só assusta. */
  const temAlgo = g.r.veiculo_id || g.r.relato || g.r.km_entrada || (g.r.itens || []).length;
  return temAlgo ? g : null;
}
const gravarRascunhoOS = (r, passo) =>
  memoria.gravar(CHAVE_RASCUNHO, { r, passo, em: new Date().toISOString() });
const apagarRascunhoOS = () => memoria.apagar(CHAVE_RASCUNHO);

function TelaNovaOS() {
  const { dados, metricas, acoes, papel, irPara, avisar, abrirOS } = usar();
  /* Lido uma vez, na montagem: ler no render faria a tela oferecer de novo o
     rascunho que a pessoa acabou de descartar. */
  const [recuperado] = useState(lerRascunhoOS);
  const [avisoRascunho, setAvisoRascunho] = useState(Boolean(recuperado));
  const [passo, setPasso] = useState(() => recuperado?.passo || 0);
  const [erros, setErros] = useState({});
  const [r, setR] = useState(() => ({ ...rascunhoVazio(), ...(recuperado?.r || {}) }));

  /* Grava a cada mudança. É texto curto (uma ordem completa dá poucos KB) e
     `memoria` já engole navegador com armazenamento bloqueado. */
  const refSalvo = useRef(false);
  useEffect(() => {
    /* A primeira passada é a montagem: gravar aqui sobrescreveria o rascunho
       recuperado com ele mesmo, o que é inofensivo, mas gravar a tela em
       branco de quem só passou pela tela não é. */
    const vazio = !r.veiculo_id && !r.relato && !r.km_entrada && !r.itens.length;
    if (vazio) { if (refSalvo.current) apagarRascunhoOS(); return; }
    refSalvo.current = true;
    gravarRascunhoOS(r, passo);
  }, [r, passo]);

  /* Fechar a aba com item lançado e ordem não aberta perde o orçamento. O
     rascunho já protege contra isso, mas o aviso evita a viagem. */
  useEffect(() => {
    if (!r.itens.length) return;
    const sair = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', sair);
    return () => window.removeEventListener('beforeunload', sair);
  }, [r.itens.length]);

  const descartarRascunho = () => {
    apagarRascunhoOS();
    refSalvo.current = false;
    setR(rascunhoVazio());
    setPasso(0);
    setAvisoRascunho(false);
    avisar('Rascunho descartado. A tela começou do zero.');
  };
  const [buscaVeic, setBuscaVeic] = useState('');
  /* FASE 18 · o carro que não está na base parava a abertura pela metade: era
     sair para Cadastros, voltar e procurar de novo. Agora o cadastro acontece
     por cima do assistente, e o veículo recém-criado já entra escolhido. */
  const [cadastrando, setCadastrando] = useState(false);
  const [novo, setNovo] = useState({ tipo:'peca', descricao:'', quantidade:1, custo_unitario:'', preco_unitario:'', peca_id:null });
  /* O salto automático depois de escolher o veículo precisa ser cancelável:
     sair da tela com o relógio armado trocaria o passo de uma tela que não
     existe mais. */
  const refSalto = useRef(null);
  useEffect(() => () => clearTimeout(refSalto.current), []);

  const podeCusto = PAPEIS[papel].custo;
  /* Lucro da linha que ainda está sendo digitada: quem lança precisa ver o
     resultado antes de gravar, não depois. */
  const lucroPrevisto = (inteiroBR(novo.quantidade) || 1) * lucroUnitario(novo.custo_unitario, novo.preco_unitario);
  const veiculo = dados.veiculos.find(v => v.id === r.veiculo_id);
  const cliente = dados.clientes.find(c => c.id === r.cliente_id);
  const vMetrica = metricas.veiculos.find(v => v.id === r.veiculo_id);
  const t = totaisDaOS(r.itens, numeroBR(r.desconto));

  const validar = (p) => {
    const e = {};
    if (p === 0 && !r.veiculo_id) e.veiculo = 'Escolha o veículo que está entrando.';
    if (p === 1) {
      if (!r.km_entrada) e.km = 'Informe a quilometragem de entrada.';
      if (!r.relato.trim()) e.relato = 'Registre o que o cliente relatou.';
    }
    if (p === 2 && r.itens.length === 0) e.itens = 'Lance ao menos um item para gerar o orçamento.';
    setErros(e);
    return Object.keys(e).length === 0;
  };
  /* Trocar de passo sem voltar ao topo deixa quem está no celular olhando o
     meio de um formulário que acabou de começar. */
  const irParaPasso = (p) => {
    clearTimeout(refSalto.current);
    setPasso(p);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };
  const avancar = () => {
    if (validar(passo)) { irParaPasso(Math.min(passo + 1, PASSOS.length - 1)); return; }
    /* Erro que aparece fora da vista é erro que não existe: a tela vai até
       ele em vez de esperar que a pessoa procure o que travou. */
    requestAnimationFrame(() => {
      const alvo = document.querySelector('[aria-invalid="true"], .erro-campo');
      if (!alvo) return;
      alvo.scrollIntoView({ block: 'center', behavior: 'smooth' });
      if (alvo.matches('[aria-invalid="true"]')) alvo.focus({ preventScroll: true });
    });
  };

  const adicionar = () => {
    if (!novo.descricao.trim() || !novo.preco_unitario) return;
    setR(x => ({ ...x, itens: [...x.itens, { id:novoId(), tipo:novo.tipo, peca_id:novo.peca_id,
      descricao:novo.descricao.trim(), quantidade:inteiroBR(novo.quantidade) || 1,
      custo_unitario:numeroBR(novo.custo_unitario), preco_unitario:numeroBR(novo.preco_unitario) }] }));
    setNovo({ tipo:'peca', descricao:'', quantidade:1, custo_unitario:'', preco_unitario:'', peca_id:null });
    setErros(e => ({ ...e, itens: null }));
  };

  const usarPeca = (p) => setNovo({ tipo:'peca', descricao:p.descricao, quantidade:1,
    custo_unitario:String(p.custo_medio), preco_unitario:String(p.preco_venda), peca_id:p.id });

  const usarModelo = (m) => {
    /* AUDITORIA: fazia `p.id` direto. Numa oficina que ainda não cadastrou o
       estoque — que é toda oficina no primeiro dia — `pecaPorCodigo` devolvia
       undefined e a tela caía ao clicar no pacote de serviço. Agora a mão de
       obra entra sempre e as peças que faltam viram aviso, não travamento. */
    const linhas = [{ id:novoId(), tipo:'servico', peca_id:null, descricao:m.nome,
                      quantidade:1, custo_unitario:0, preco_unitario:m.mo }];
    const faltando = [];
    m.pecas.forEach(([cod, qtd]) => {
      const p = pecaPorCodigo(cod);
      if (!p) { faltando.push(cod); return; }
      linhas.push({ id:novoId(), tipo:'peca', peca_id:p.id, descricao:p.descricao, quantidade:qtd,
        custo_unitario:p.custo_medio, preco_unitario:p.preco_venda });
    });
    setR(x => ({ ...x, itens: [...x.itens, ...linhas] }));
    setErros(e => ({ ...e, itens: null }));
    if (faltando.length) {
      avisar(faltando.length === 1
        ? 'Mão de obra incluída. A peça ' + faltando[0] + ' ainda não está no seu estoque — cadastre ou adicione o item à mão.'
        : 'Mão de obra incluída. ' + faltando.length + ' peças deste pacote ainda não estão no seu estoque.');
    }
  };

  /* FASE 13: terminar o cadastro e cair no pátio deixava o envio ao cliente
     a três toques de distância — e por isso ele quase não acontecia. A ordem
     recém-criada abre na hora, com o botão de WhatsApp no rodapé. */
  /* AUDITORIA: o botão chamava `criarOS` direto, sem trava. Dois cliques
     rápidos — que acontecem sozinhos em celular com toque duplo, e acontecem
     de propósito quando a tela demora a responder — abriam DUAS ordens, com
     números diferentes, para o mesmo carro. A segunda só seria descoberta no
     fechamento do caixa. A guarda é uma referência, não estado: estado só
     vale no render seguinte, e o segundo clique chega antes disso. */
  /* AUDITORIA (fase 15): a trava contra o clique duplo funcionava, mas o
     botão lia `abrindo.current` dentro do render — referência não dispara
     desenho novo, então ele nunca ficava cinza e nunca dizia "Abrindo…". A
     referência continua sendo a trava (ela vale já no clique seguinte); o
     estado ao lado existe só para a tela contar o que está acontecendo. */
  const abrindo = useRef(false);
  const [abrindoAgora, setAbrindoAgora] = useState(false);
  const concluir = () => {
    if (abrindo.current) return;
    abrindo.current = true;
    setAbrindoAgora(true);
    try {
      const nova = acoes.criarOS(r);
      /* O rascunho só sai depois de a ordem nascer. Apagar antes e a criação
         falhar deixaria a pessoa sem a ordem e sem o que digitou. */
      apagarRascunhoOS();
      refSalvo.current = false;
      avisar('Ordem ' + nova.numero + ' aberta. Envie o orçamento pelo botão verde.');
      irPara('patio');
      abrirOS(nova.id);
    } catch (e) {
      abrindo.current = false;
      setAbrindoAgora(false);
      avisar('Não deu para abrir a ordem: ' + (e.message || 'erro desconhecido'));
    }
  };

  const veiculosFiltrados = useMemo(() => {
    const q = buscaVeic.trim().toLowerCase();
    if (!q) return metricas.veiculos.slice(0, 6);
    return metricas.veiculos.filter(v => [v.placa, v.marca, v.modelo, v.cliente?.nome]
      .some(x => String(x || '').toLowerCase().includes(q))).slice(0, 8);
  }, [buscaVeic, metricas]);

  return html`
    <div class="entra" style="display:flex;flex-direction:column;gap:16px">
      ${avisoRascunho ? html`
        <div class="faixa-rascunho" role="status">
          <${Icone} nome="atualizar" tam=${16} />
          <span>Recuperei o que você tinha lançado${recuperado?.r?.itens?.length
            ? ' — ' + recuperado.r.itens.length + (recuperado.r.itens.length === 1 ? ' item' : ' itens') : ''}.
            Nada se perdeu.</span>
          <span class="acoes">
            <button class="btn btn-neutro btn-p" onClick=${() => setAvisoRascunho(false)}>Continuar</button>
            <button class="btn btn-neutro btn-p" onClick=${descartarRascunho}>Começar do zero</button>
          </span>
        </div>` : null}
      <${Cartao}>
        <div class="passos">
          ${PASSOS.map((p, i) => html`
            <button key=${p} class="passo" data-estado=${i === passo ? 'atual' : i < passo ? 'feito' : 'futuro'}
              onClick=${() => { if (i < passo) irParaPasso(i); }} disabled=${i > passo}
              aria-current=${i === passo ? 'step' : undefined} title=${p}>
              <span class="bola">${i < passo ? html`<${Icone} nome="check" tam=${12} />` : i + 1}</span>
              <span class="esconde-mobile">${p}</span>
            </button>`)}
        </div>
        ${/* No celular o nome do passo não cabe dentro da pastilha; sem ele a
             pessoa vê quatro bolinhas e nenhuma indicação do que está fazendo. */ ''}
        <div class="passo-atual so-mobile">
          <b>${PASSOS[passo]}</b>
          <span class="silencioso mono">${passo + 1} de ${PASSOS.length}</span>
        </div>
        <div class="trilha-passo" role="progressbar" aria-valuemin="1" aria-valuemax=${PASSOS.length}
          aria-valuenow=${passo + 1} aria-label=${'Passo ' + (passo + 1) + ' de ' + PASSOS.length}>
          <i style=${'width:' + Math.round(((passo + 1) / PASSOS.length) * 100) + '%'}></i>
        </div>
      <//>

      ${passo === 0 ? html`
        <${Cartao}>
          <div class="cartao-topo"><div><h3>Qual veículo está entrando?</h3>
            <p class="silencioso">Busque pela placa — é o mais rápido no balcão.</p></div></div>
          <div class="busca" style="margin-bottom:14px">
            <${Icone} nome="busca" tam=${15} cor="var(--tinta-3)" />
            <input value=${buscaVeic} onInput=${e => setBuscaVeic(e.target.value)} placeholder="Placa, modelo ou nome do cliente" aria-label="Buscar veículo" />
          </div>
          ${erros.veiculo ? html`<p class="erro-campo" style="margin-bottom:10px">${erros.veiculo}</p>` : null}
          <div style="display:flex;flex-direction:column;gap:8px">
            ${veiculosFiltrados.map(v => {
              const sel = r.veiculo_id === v.id;
              return html`
                <button key=${v.id}
                  onClick=${() => {
                    setR(x => ({ ...x, veiculo_id:v.id, cliente_id:v.cliente_id, km_entrada:String(v.km_atual) }));
                    setErros({});
                    /* Este passo tem uma decisão só. Pedir um toque a mais no
                       "Continuar" é pedir confirmação de algo que a tela já
                       está mostrando confirmado. A pausa curta existe para o
                       sinal de escolhido aparecer antes da troca — e o botão
                       Voltar traz de volta em um toque. */
                    clearTimeout(refSalto.current);
                    refSalto.current = setTimeout(() => irParaPasso(1), 320);
                  }}
                  style=${'display:flex;align-items:center;gap:12px;padding:11px;border-radius:var(--raio);text-align:left;width:100%;border:1px solid ' + (sel ? 'var(--azul-acao)' : 'var(--linha)') + ';background:' + (sel ? 'var(--info-fundo)' : 'var(--superficie)')}>
                  <${Placa} valor=${v.placa} tam="p" />
                  <div style="flex:1;min-width:0">
                    <div style="font-size:13.5px;font-weight:600">${v.marca} ${v.modelo}</div>
                    <div class="silencioso">${v.cliente?.nome} · ${inteiro(v.km_atual)} km · ${v.concluidas.length} passagens</div>
                  </div>
                  ${v.revisaoVencida ? html`<${Selo} tom="alerta">Revisão<//>` : null}
                  ${sel ? html`<${Icone} nome="check" tam=${17} cor="var(--azul-acao)" />` : null}
                </button>`;
            })}
            ${veiculosFiltrados.length === 0 ? html`
              <${Vazio} icone="carro" titulo="Nenhum veículo com esse dado" apoio="Cadastre cliente e veículo aqui mesmo — a ordem continua de onde parou."
                acao=${html`<button class="btn btn-primario" style="margin-top:6px" onClick=${() => setCadastrando(true)}>
                  <${Icone} nome="mais" tam=${15} />Cadastrar cliente e veículo</button>`} />` : null}
          </div>
          ${veiculosFiltrados.length > 0 && pode(papel, 'criar') ? html`
            <button class="btn btn-neutro btn-bloco" style="margin-top:12px" onClick=${() => setCadastrando(true)}>
              <${Icone} nome="mais" tam=${15} />Não está na lista? Cadastrar cliente e veículo</button>` : null}
        <//>` : null}

      ${passo === 1 ? html`
        <div class="grade g-2-1">
          <${Cartao}>
            <div class="cartao-topo"><div><h3>Registro de entrada</h3>
              <p class="silencioso">O que o cliente contou e como o carro chegou.</p></div></div>
            <div style="display:flex;flex-direction:column;gap:14px">
              <${Campo} rotulo="Quilometragem de entrada" erro=${erros.km} ajuda=${'Última leitura registrada: ' + inteiro(veiculo?.km_atual) + ' km'}>
                <input class="entrada mono" type="text" inputmode="numeric" autocomplete="off" value=${r.km_entrada}
                  aria-invalid=${Boolean(erros.km)} onInput=${e => setR(x => ({ ...x, km_entrada: e.target.value }))} />
              <//>
              <${Campo} rotulo="Relato do cliente" erro=${erros.relato} ajuda="Escreva com as palavras do cliente. É o que o mecânico vai ler.">
                <textarea class="entrada" value=${r.relato} aria-invalid=${Boolean(erros.relato)}
                  placeholder="Ex.: barulho ao frear em baixa velocidade, começou na semana passada"
                  onInput=${e => setR(x => ({ ...x, relato: e.target.value }))}></textarea>
              <//>
              ${comMecanicos(dados) ? html`
              <${Campo} rotulo="Mecânico responsável">
                <select class="entrada" value=${r.mecanico} onInput=${e => setR(x => ({ ...x, mecanico: e.target.value }))}>
                  <option value="">Definir depois</option>
                  ${MECANICOS.map(m => html`<option key=${m.id} value=${m.id}>${m.nome}</option>`)}
                </select>
              <//>` : null}
            </div>
          <//>
          <div style="display:flex;flex-direction:column;gap:14px">
            ${vMetrica && vMetrica.concluidas.length > 0 ? html`
              <${Cartao}>
                <h3 style="margin-bottom:4px">O que já foi feito aqui</h3>
                <p class="silencioso" style="margin-bottom:12px">Últimas passagens deste veículo.</p>
                <div style="display:flex;flex-direction:column;gap:9px">
                  ${vMetrica.concluidas.slice(0, 3).map(o => html`
                    <div key=${o.id} style="font-size:12.5px">
                      <div style="font-weight:500">${o.itens.find(i => i.tipo === 'servico')?.descricao || 'Serviço'}</div>
                      <div class="silencioso">${fmtData(o.concluida_em)} · ${inteiro(o.km_entrada)} km</div>
                    </div>`)}
                </div>
                ${vMetrica.revisaoVencida ? html`
                  <div class="aviso aviso-alerta" style="margin-top:12px"><${Icone} nome="faisca" tam=${15} />
                    <span>Rodou ${inteiro(vMetrica.kmDesdeRevisao)} km desde a última revisão. Vale oferecer.</span></div>` : null}
              <//>` : null}
            ${r.veiculo_id ? html`<${AvisoGarantia} veiculoId=${r.veiculo_id} />` : null}
            <${Cartao}>
              <h3 style="margin-bottom:4px">Garantia deste serviço</h3>
              <p class="silencioso" style="margin-bottom:12px">Sai impressa na ordem e no comprovante de entrega.</p>
              <${Campo} rotulo="Prazo em dias" ajuda=${'Padrão da oficina: ' + GARANTIA_PADRAO + ' dias'}>
                <input class="entrada mono" type="number" min="0" value=${r.garantia_dias}
                  onInput=${e => setR(x => ({ ...x, garantia_dias: Number(e.target.value) || 0 }))} />
              <//>
            <//>
          </div>
        </div>

        <${Cartao}>
          <div class="cartao-topo"><div>
            <h3>Checklist de entrada</h3>
            <p class="silencioso">Combustível, itens deixados e avarias que já vieram no carro.</p>
          </div>
          <${Selo} icone="camera">Fotos após abrir a ordem<//></div>
          <${ChecklistEntrada} valor=${r.checklist} aoMudar=${(c) => setR(x => ({ ...x, checklist: c }))} veiculo=${veiculo} />
        <//>` : null}

      ${passo === 2 ? html`
        <div class="grade g-2-1">
          <div style="display:flex;flex-direction:column;gap:14px">
            <${Cartao}>
              <div class="cartao-topo"><div><h3>Peças e mão de obra</h3>
                <p class="silencioso">Custo e preço congelam no momento do lançamento.</p></div></div>
              ${erros.itens ? html`<p class="erro-campo" style="margin-bottom:10px">${erros.itens}</p>` : null}
              ${r.itens.length === 0
                ? html`<p class="silencioso" style="padding:10px 0">Nenhum item lançado. Use um pacote pronto ou lance um item avulso.</p>`
                : r.itens.map(i => {
                    const mg = i.preco_unitario ? margemDe(i.custo_unitario, i.preco_unitario) : 100;
                    return html`
                      <div key=${i.id} class="linha-item">
                        <span class="marca"><${Icone} nome=${i.tipo === 'peca' ? 'caixa' : 'chave'} tam=${15} /></span>
                        <div style="flex:1;min-width:0">
                          <div style="font-size:13.5px;font-weight:500">${i.descricao}</div>
                          <div class="silencioso">${i.tipo === 'peca' ? 'Peça' : 'Serviço'} · qtd ${i.quantidade}</div>
                          ${podeCusto && i.custo_unitario ? html`
                            <div class="silencioso corta" style="margin-top:2px">
                              ${CUSTO_OFICINA} ${brlBruto(i.quantidade * i.custo_unitario)} ·
                              lucro <b style=${'color:' + (lucroDoItem(i) >= 0 ? 'var(--ok)' : 'var(--erro)')}>${brlBruto(lucroDoItem(i))}</b>
                            </div>` : null}
                        </div>
                        ${podeCusto ? html`<${Selo} tom=${mg >= PISO_MARGEM ? 'ok' : mg >= 20 ? 'alerta' : 'erro'}>${Math.round(mg)}%<//>` : null}
                        <span class="mono" style="font-size:13.5px;font-weight:600;min-width:80px;text-align:right">${brlBruto(i.quantidade * i.preco_unitario)}</span>
                        <button class="btn btn-fantasma btn-icone" aria-label=${'Remover ' + i.descricao}
                          onClick=${() => setR(x => ({ ...x, itens: x.itens.filter(y => y.id !== i.id) }))}><${Icone} nome="lixo" tam=${15} /></button>
                      </div>`;
                  })}
            <//>

            <${Cartao}>
              <h3 style="margin-bottom:12px">Lançar item avulso</h3>
              <div class="grade-lancar">
                <${Campo} rotulo="Tipo">
                  <select class="entrada" value=${novo.tipo} onInput=${e => setNovo(n => ({ ...n, tipo: e.target.value }))}>
                    <option value="peca">Peça</option><option value="servico">Serviço</option>
                  </select>
                <//>
                <${Campo} rotulo="Descrição">
                  <input class="entrada" value=${novo.descricao} placeholder="Ex.: pastilha de freio dianteira"
                    onInput=${e => setNovo(n => ({ ...n, descricao: e.target.value }))}
                    onKeyDown=${e => { if (e.key === 'Enter') adicionar(); }} />
                <//>
              </div>
              <div class=${'grade-valores' + (podeCusto ? '' : ' sem-custo')} style="margin-top:11px">
                <${Campo} rotulo="Qtd">
                  <input class="entrada mono" type="number" min="1" value=${novo.quantidade} onInput=${e => setNovo(n => ({ ...n, quantidade: e.target.value }))} />
                <//>
                ${podeCusto ? html`
                  <${Campo} rotulo=${CUSTO_OFICINA} ajuda="Interno · o cliente não vê">
                    <input class="entrada mono" type="text" inputmode="decimal" autocomplete="off" placeholder="0,00" value=${novo.custo_unitario}
                      onInput=${e => setNovo(n => ({ ...n, custo_unitario: e.target.value }))} />
                  <//>` : null}
                <div class="campo-valor">
                  <${Campo} rotulo=${VALOR_CLIENTE} ajuda="Sai na ordem de serviço">
                    <input class="entrada mono" type="text" inputmode="decimal" autocomplete="off" placeholder="0,00" value=${novo.preco_unitario}
                      onInput=${e => setNovo(n => ({ ...n, preco_unitario: e.target.value }))}
                      onKeyDown=${e => { if (e.key === 'Enter') adicionar(); }} />
                  <//>
                </div>
              </div>
              ${podeCusto && numeroBR(novo.preco_unitario) > 0 ? html`
                <div class="linha-lucro" style="margin-top:12px">
                  <span class="secundario" style="font-size:12.5px">Lucro desta linha</span>
                  <span class="valor-lucro" style=${'color:' + (lucroPrevisto >= 0 ? 'var(--ok)' : 'var(--erro)')}>
                    ${brlBruto(lucroPrevisto)}</span>
                </div>` : null}
              <button class="btn btn-neutro btn-bloco" style="margin-top:13px" onClick=${adicionar}
                disabled=${!novo.descricao.trim() || !novo.preco_unitario}>
                <${Icone} nome="mais" tam=${15} />Adicionar à ordem</button>
            <//>
          </div>

          <div style="display:flex;flex-direction:column;gap:14px">
            <${Cartao}>
              <h3 style="margin-bottom:4px">Pacotes prontos</h3>
              <p class="silencioso" style="margin-bottom:12px">Serviço e peças de uma vez, com preço de tabela.</p>
              <div style="display:flex;flex-direction:column;gap:7px">
                ${MODELOS_SERVICO.slice(0, 6).map(m => html`
                  <button key=${m.nome} onClick=${() => usarModelo(m)}
                    style="display:flex;align-items:center;gap:10px;text-align:left;padding:9px;border-radius:9px;border:1px solid var(--linha)">
                    <span style="width:28px;height:28px;border-radius:8px;background:var(--superficie-2);color:var(--tinta-3);display:flex;align-items:center;justify-content:center">
                      <${Icone} nome="chave" tam=${14} /></span>
                    <div style="flex:1;min-width:0">
                      <div class="corta" style="font-size:12.5px;font-weight:500">${m.nome}</div>
                      <div class="silencioso">${m.pecas.length} ${m.pecas.length === 1 ? 'peça' : 'peças'} + mão de obra</div>
                    </div>
                    <${Icone} nome="mais" tam=${15} cor="var(--azul-acao)" />
                  </button>`)}
              </div>
              <div style="border-top:1px solid var(--linha-suave);margin-top:12px;padding-top:12px">
                <p class="silencioso" style="margin-bottom:9px">Ou puxe direto do estoque:</p>
                <div style="display:flex;flex-direction:column;gap:6px">
                  ${dados.pecas.filter(p => p.quantidade > 0).slice(0, 4).map(p => html`
                    <button key=${p.id} onClick=${() => usarPeca(p)}
                      style="display:flex;align-items:center;gap:9px;text-align:left;padding:7px 9px;border-radius:8px;border:1px solid var(--linha)">
                      <div style="flex:1;min-width:0">
                        <div class="corta" style="font-size:12px;font-weight:500">${p.descricao}</div>
                        <div class="silencioso mono" style="font-size:11px">${p.codigo} · ${p.quantidade} un</div>
                      </div>
                      <span class="mono" style="font-size:12px;font-weight:600">${brlBruto(p.preco_venda)}</span>
                    </button>`)}
                </div>
              </div>
            <//>
            <${CartaoRecomendacoes} veiculo=${vMetrica} aoAdicionar=${(nome) => {
              const mod = MODELOS_SERVICO.find(x => x.nome === nome);
              if (mod) usarModelo(mod);
            }} />
            <${ResumoOrcamento} t=${t} podeCusto=${podeCusto} r=${r} setR=${setR} />
          </div>
        </div>` : null}

      ${passo === 3 ? html`
        <div class="grade g-2-1">
          <${Cartao}>
            <div class="cartao-topo"><div><h3>Confira antes de abrir</h3>
              <p class="silencioso">Depois de aberta, a ordem entra na fila do pátio.</p></div></div>
            <div style="display:flex;align-items:center;gap:13px;padding-bottom:14px;border-bottom:1px solid var(--linha-suave)">
              <${Placa} valor=${veiculo?.placa} />
              <div>
                <div style="font-size:14.5px;font-weight:600">${veiculo?.marca} ${veiculo?.modelo}</div>
                <div class="silencioso">${cliente?.nome} · entrada com ${inteiro(r.km_entrada)} km</div>
              </div>
            </div>
            <div style="padding:14px 0;border-bottom:1px solid var(--linha-suave)">
              <span class="rotulo">Relato</span>
              <p class="secundario" style="font-size:13.5px;margin-top:5px">${r.relato}</p>
            </div>
            <div style="padding:14px 0;border-bottom:1px solid var(--linha-suave)">
              <span class="rotulo">Checklist de entrada</span>
              <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:7px">
                <${Selo} tom="ciano">Combustível ${r.checklist.combustivel}<//>
                <${Selo}>${r.checklist.itens.length} ${r.checklist.itens.length === 1 ? 'item' : 'itens'}<//>
                <${Selo} tom=${r.checklist.avarias.length ? 'alerta' : 'ok'}>
                  ${r.checklist.avarias.length ? r.checklist.avarias.length + ' avaria(s)' : 'Sem avarias'}<//>
                <${Selo}>Garantia ${r.garantia_dias} dias<//>
              </div>
            </div>
            <div style="padding:14px 0;border-bottom:1px solid var(--linha-suave)">
              <span class="rotulo">Situação inicial</span>
              <div style="display:flex;align-items:center;gap:9px;margin-top:7px;flex-wrap:wrap">
                <${SeloSituacao} etapa="entrada" />
                <span class="silencioso">Depois de aberta, a ordem caminha pelas etapas do pátio até Concluída.</span>
              </div>
            </div>
            <div style="padding-top:14px">
              <span class="rotulo">${r.itens.length} ${r.itens.length === 1 ? 'item' : 'itens'}</span>
              <div style="margin-top:8px">
                ${r.itens.map(i => html`
                  <div key=${i.id} class="linha-item" style="padding:8px 0">
                    <span class="marca"><${Icone} nome=${i.tipo === 'peca' ? 'caixa' : 'chave'} tam=${14} /></span>
                    <div style="flex:1;min-width:0"><div style="font-size:13px">${i.descricao}</div></div>
                    <span class="mono" style="font-size:13px;font-weight:600">${brlBruto(i.quantidade * i.preco_unitario)}</span>
                  </div>`)}
              </div>
            </div>
          <//>
          <div style="display:flex;flex-direction:column;gap:14px">
            <${ResumoOrcamento} t=${t} podeCusto=${podeCusto} r=${r} setR=${setR} />
          </div>
        </div>` : null}

      ${/* MELHORIA 3: a ação de seguir sai do fim do documento e passa a
           morar numa barra que gruda no rodapé da tela. Ela sobe junto com o
           teclado (--teclado, medido pelo visualViewport) e, como a IA está
           fora de cena durante a abertura, não existe mais nada que possa
           cobri-la. */ ''}
      <div class="barra-passo">
        <button class="btn btn-neutro" onClick=${() => {
            if (passo !== 0) { irParaPasso(passo - 1); return; }
            /* Sair do passo 1 não joga fora o que já foi digitado: o rascunho
               fica e a tela diz isso, senão a pessoa evita sair com medo. */
            if (r.itens.length || r.relato || r.veiculo_id)
              avisar('Guardei como rascunho. É só voltar em Nova OS que ele reaparece.');
            irPara('patio');
          }}>
          <${Icone} nome="voltar" tam=${15} /><span class=${passo === 0 ? '' : 'esconde-mobile'}>${passo === 0 ? 'Cancelar' : 'Voltar'}</span></button>
        ${t.liquido > 0 ? html`
          <div class="total-passo">
            <span class="rotulo">${VALOR_CLIENTE}</span>
            <span class="mono">${brlBruto(t.liquido)}</span>
          </div>` : html`<span style="flex:1"></span>`}
        ${passo < PASSOS.length - 1
          ? html`<button class="btn btn-primario btn-g" onClick=${avancar}>
              Continuar<${Icone} nome="seta" tam=${16} /></button>`
          : html`<button class="btn btn-primario btn-g" onClick=${concluir} disabled=${abrindoAgora}>
              <${Icone} nome=${abrindoAgora ? 'relogio' : 'check'} tam=${17} />
              ${abrindoAgora ? 'Abrindo…' : 'Abrir ordem'}</button>`}
      </div>

      ${cadastrando ? html`
        <${FormCadastro} aoFechar=${() => setCadastrando(false)}
          aoCriar=${({ clienteId, veiculoId }) => {
            if (!veiculoId) return;
            /* O veículo recém-nascido entra escolhido e o assistente segue
               para a entrada: quem cadastrou já disse qual carro é. */
            setR(x => ({ ...x, veiculo_id: veiculoId, cliente_id: clienteId }));
            setErros({});
            setBuscaVeic('');
            clearTimeout(refSalto.current);
            refSalto.current = setTimeout(() => irParaPasso(1), 320);
          }} />` : null}
    </div>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   CADASTROS
   ══════════════════════════════════════════════════════════════════════════ */
function FormCliente({ aoFechar, registro }) {
  const { acoes, avisar } = usar();
  const [f, setF] = useState(() => registro
    ? { tipo: registro.tipo || 'fisica', nome: registro.nome || '', documento: registro.documento || '',
        telefone: registro.telefone || '', email: registro.email || '',
        cidade: registro.cidade || '', uf: registro.uf || 'SP' }
    : { tipo:'fisica', nome:'', documento:'', telefone:'', email:'', cidade:'', uf:'SP' });
  const [erros, setErros] = useState({});
  const salvar = () => {
    const e = {};
    if (!f.nome.trim()) e.nome = 'O nome é obrigatório.';
    if (!f.telefone.trim()) e.telefone = 'É como a oficina avisa que o carro ficou pronto.';
    /* FASE 13: número incompleto entrava calado e só aparecia como problema
       na hora de mandar o orçamento — quando já não dava para perguntar. */
    else if (!telValido(f.telefone)) e.telefone = 'Faltam dígitos. Use DDD + número, como (11) 94019-8651.';
    if (f.documento && !validaDoc(f.documento)) e.documento = 'CPF tem 11 dígitos, CNPJ tem 14.';
    setErros(e);
    if (Object.keys(e).length) return;
    const campos = { ...f, documento: digitos(f.documento), telefone: telNacional(f.telefone) };
    if (registro) { acoes.editarCliente(registro.id, campos, 'Cadastro atualizado'); avisar(f.nome.trim() + ' atualizado.'); }
    else { acoes.criarCliente(campos); avisar(f.nome.trim() + ' cadastrado.'); }
    aoFechar();
  };
  return html`
    <${Modal} titulo=${registro ? 'Editar cliente' : 'Novo cliente'} subtitulo=${registro ? registro.nome : null} aoFechar=${aoFechar}
      rodape=${html`<button class="btn btn-neutro" onClick=${aoFechar}>Cancelar</button>
        <button class="btn btn-primario" onClick=${salvar}>${registro ? 'Salvar alterações' : 'Salvar cliente'}</button>`}>
      <p class="silencioso">Só nome e telefone são obrigatórios. O resto entra depois.</p>
      <div class="filtros">
        ${[['fisica','Pessoa física'],['juridica','Empresa']].map(([id, nome]) => html`
          <button key=${id} class="filtro" aria-pressed=${f.tipo === id} onClick=${() => setF(x => ({ ...x, tipo: id }))}>${nome}</button>`)}
      </div>
      <${Campo} rotulo=${f.tipo === 'fisica' ? 'Nome completo' : 'Razão social'} erro=${erros.nome}>
        <input class="entrada" value=${f.nome} aria-invalid=${Boolean(erros.nome)} onInput=${e => setF(x => ({ ...x, nome: e.target.value }))} />
      <//>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <${Campo} rotulo="Telefone" erro=${erros.telefone}
          ajuda=${f.telefone && telValido(f.telefone) && !telEhCelular(f.telefone) ? 'Fixo — não recebe WhatsApp' : 'Celular com WhatsApp'}>
          <input class="entrada mono" inputmode="tel" placeholder="(11) 90000-0000"
            value=${mascararTel(f.telefone)} maxlength="16"
            aria-invalid=${Boolean(erros.telefone)}
            onInput=${e => setF(x => ({ ...x, telefone: mascararTel(e.target.value) }))} />
        <//>
        <${Campo} rotulo=${f.tipo === 'fisica' ? 'CPF' : 'CNPJ'} erro=${erros.documento} ajuda="Opcional">
          <input class="entrada mono" inputmode="numeric" value=${f.documento}
            aria-invalid=${Boolean(erros.documento)} onInput=${e => setF(x => ({ ...x, documento: e.target.value }))} />
        <//>
      </div>
      <div style="display:grid;grid-template-columns:2fr 1fr;gap:12px">
        <${Campo} rotulo="Cidade" ajuda="Opcional">
          <input class="entrada" value=${f.cidade} onInput=${e => setF(x => ({ ...x, cidade: e.target.value }))} />
        <//>
        <${Campo} rotulo="UF">
          <input class="entrada" maxlength="2" value=${f.uf} onInput=${e => setF(x => ({ ...x, uf: e.target.value.toUpperCase() }))} />
        <//>
      </div>
    <//>`;
}

/* FASE 18 · a tela ganhou um modo `embutida`: sem barra própria, lendo a
   busca de fora e delegando o botão de criar. É o que permite Clientes e
   Veículos viverem sob o mesmo teto sem duplicar a lista de nenhum dos dois.
   Sozinha, ela continua se comportando exatamente como antes. */
function TelaClientes({ embutida, busca: buscaFora, aoNovo }) {
  const { metricas, acoes, papel, abrirCliente } = usar();
  const [editando, setEditando] = useState(null);
  const [excluir, setExcluir] = useState(null);
  const [buscaLocal, setBuscaLocal] = useState('');
  const busca = embutida ? (buscaFora || '') : buscaLocal;
  const buscaLenta = useAtraso(busca);
  const [filtro, setFiltro] = useState('todos');
  const [form, setForm] = useState(false);
  /* Cliente que vai ganhar mais um carro sem passar por outra tela. */
  const [carroNovo, setCarroNovo] = useState(null);
  const abrirNovo = aoNovo || (() => setForm(true));
  const podeVerDoc = PAPEIS[papel].custo || papel === 'atendente';

  const lista = useMemo(() => {
    const q = buscaLenta.trim().toLowerCase();
    return metricas.clientes
      .filter(c => filtro === 'inativos' ? c.inativo : filtro === 'vip' ? c.gasto > 20000 : true)
      .filter(c => !q || [c.nome, c.telefone, c.documento, ...c.veiculos.map(v => v.placa)].some(x => String(x || '').toLowerCase().includes(q)))
      .sort((a, b) => b.gasto - a.gasto);
  }, [buscaLenta, filtro, metricas]);

  return html`
    <div style="display:flex;flex-direction:column;gap:14px">
      ${embutida ? html`
        <div class="filtros">
          ${[['todos','Todos'],['vip','Melhores'],['inativos','Sem retorno']].map(([id, nome]) => html`
            <button key=${id} class="filtro" aria-pressed=${filtro === id} onClick=${() => setFiltro(id)}>${nome}</button>`)}
        </div>` : html`
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <div class="busca">
          <${Icone} nome="busca" tam=${15} cor="var(--tinta-3)" />
          <input value=${buscaLocal} onInput=${e => setBuscaLocal(e.target.value)} placeholder="Nome, telefone, documento ou placa" aria-label="Buscar clientes" />
        </div>
        <div class="filtros">
          ${[['todos','Todos'],['vip','Melhores'],['inativos','Sem retorno']].map(([id, nome]) => html`
            <button key=${id} class="filtro" aria-pressed=${filtro === id} onClick=${() => setFiltro(id)}>${nome}</button>`)}
        </div>
        ${/* FASE 17 · Estoque, financeiro, agenda e usuários já escondiam o
             botão de criar para quem não tem a capacidade. Clientes e veículos
             não — e o mecânico, que só tem `ver` e `editar`, abria o cadastro
             e criava registro. O banco recusaria pela RLS, mas só depois de a
             pessoa digitar tudo. Esconder antes é o padrão do arquivo. */ ''}
        ${pode(papel, 'criar') ? html`
          <button class="btn btn-primario" onClick=${abrirNovo}>
            <${Icone} nome="mais" tam=${15} /><span class="esconde-mobile">Novo cliente</span></button>` : null}
      </div>`}

      ${lista.length === 0
        ? html`<${Cartao}><${Vazio} icone="pessoas" titulo="Nenhum cliente aqui"
            apoio="Confira a busca e os filtros, ou cadastre agora — leva menos de um minuto."
            acao=${html`<button class="btn btn-primario" style="margin-top:6px" onClick=${abrirNovo}>Cadastrar cliente</button>`} /><//>`
        : html`<div class="grade g-3">
            ${lista.map(c => html`
              <${Cartao} key=${c.id}>
                <button style="width:100%;text-align:left" onClick=${() => abrirCliente(c.id)}>
                  <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:11px">
                    <div style="display:flex;align-items:center;gap:11px;min-width:0">
                      <span class="avatar" style="width:38px;height:38px;font-size:13px">${iniciais(c.nome)}</span>
                      <div style="min-width:0">
                        <div class="corta" style="font-size:14px;font-weight:600">${c.nome}</div>
                        <div class="silencioso mono">${podeVerDoc ? fmtDoc(c.documento) : mascDoc(c.documento)}</div>
                      </div>
                    </div>
                    ${c.inativo ? html`<${Selo} tom="alerta">${mesesDesde(c.ultima)}m<//>`
                      : c.gasto > 20000 ? html`<${Selo} tom="roxo">VIP<//>` : null}
                  </div>
                  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:15px">
                    ${[['Veículos', c.veiculos.length], ['Ordens', c.concluidas.length], ['Total', brlCurto(c.gasto)]].map(([k, v]) => html`
                      <div key=${k}>
                        <div class="rotulo" style="font-size:10px">${k}</div>
                        <div style="font-size:13px;font-weight:500;margin-top:2px">${v}</div>
                      </div>`)}
                  </div>
                  <div style="display:flex;gap:7px;margin-top:12px;flex-wrap:wrap">
                    ${c.veiculos.slice(0, 3).map(v => html`<${Placa} key=${v.id} valor=${v.placa} tam="p" />`)}
                    ${c.veiculos.length > 3 ? html`<span class="selo">+${c.veiculos.length - 3}</span>` : null}
                  </div>
                </button>
                ${/* Fora do botão do cartão: botão dentro de botão é HTML inválido
                     e o leitor de tela anuncia os dois como um só. */ ''}
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:10px;padding-top:10px;border-top:1px solid var(--linha-suave)">
                  ${/* FASE 18 · o segundo carro do mesmo dono era o caminho mais
                       longo do sistema: sair de Clientes, entrar em Veículos,
                       procurar o nome de novo na lista de donos. Daqui ele sai
                       com o dono já preenchido. */ ''}
                  ${pode(papel, 'criar') ? html`
                    <button class="btn btn-neutro btn-p" onClick=${() => setCarroNovo(c)}>
                      <${Icone} nome="carro" tam=${14} />Add veículo</button>` : html`<span></span>`}
                  <${AcoesLinha} nome=${c.nome} aoEditar=${() => setEditando(c)} aoExcluir=${() => setExcluir(c)} />
                </div>
              <//>`)}
          </div>`}

      ${form ? html`<${FormCliente} aoFechar=${() => setForm(false)} />` : null}
      ${editando ? html`<${FormCliente} registro=${editando} aoFechar=${() => setEditando(null)} />` : null}
      ${carroNovo ? html`<${FormVeiculo} clienteInicial=${carroNovo.id} aoFechar=${() => setCarroNovo(null)} />` : null}
      ${excluir ? html`<${ConfirmarExclusao} tipo="cliente" id=${excluir.id} rotulo="cliente"
        nome=${excluir.nome}
        descricao="O cadastro sai da base. Os veículos e as ordens deste cliente saem junto — a janela conta quantos antes de você confirmar."
        aoFechar=${() => setExcluir(null)} aoConfirmar=${() => acoes.excluirCliente(excluir.id)} />` : null}
    </div>`;
}

function FormVeiculo({ aoFechar, registro, clienteInicial }) {
  const { dados, acoes, avisar } = usar();
  const [f, setF] = useState(() => registro
    ? { cliente_id: registro.cliente_id || '', placa: registro.placa || '', marca: registro.marca || '',
        modelo: registro.modelo || '', ano_modelo: registro.ano_modelo ? String(registro.ano_modelo) : '',
        cor: registro.cor || '', km_atual: String(registro.km_atual ?? '') }
    : { cliente_id: clienteInicial || '', placa:'', marca:'', modelo:'', ano_modelo:'', cor:'', km_atual:'' });
  const [erros, setErros] = useState({});
  /* Veículo novo ainda não tem id, então as fotos ficam aqui até o salvar. */
  const [fotos, setFotos] = useState([]);
  const jaAnexadas = registro ? (dados.anexos || []).filter(a => a.veiculo_id === registro.id) : [];
  const salvar = () => {
    const e = {};
    const placa = f.placa.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!f.cliente_id) e.cliente = 'Escolha o dono do veículo.';
    if (!validaPlaca(placa)) e.placa = 'Use o formato ABC1234 ou ABC1D23.';
    else if (dados.veiculos.some(v => v.placa === placa && v.id !== registro?.id)) e.placa = 'Esta placa já está cadastrada.';
    if (!f.marca.trim()) e.marca = 'Informe a marca.';
    if (!f.modelo.trim()) e.modelo = 'Informe o modelo.';
    setErros(e);
    if (Object.keys(e).length) return;
    const campos = { ...f, placa, ano_modelo: Number(f.ano_modelo) || null, km_atual: inteiroBR(f.km_atual) };
    /* O id sai daqui e é passado adiante: `criarVeiculo` não devolve nada, e
       sem o id não haveria a que amarrar as fotos recém-escolhidas. */
    const idVeiculo = registro ? registro.id : novoId();
    if (registro) { acoes.editarVeiculo(idVeiculo, campos, 'Cadastro do veículo atualizado'); }
    else { acoes.criarVeiculo({ id: idVeiculo, ...campos }); }
    fotos.forEach(ft => acoes.anexar({ veiculo_id: idVeiculo, tipo: 'veiculo', ...ft }));
    avisar('Veículo ' + placa + (registro ? ' atualizado' : ' cadastrado')
      + (fotos.length ? ' · ' + fotos.length + (fotos.length === 1 ? ' foto' : ' fotos') : '') + '.');
    aoFechar();
  };
  return html`
    <${Modal} titulo=${registro ? 'Editar veículo' : 'Novo veículo'} subtitulo=${registro ? registro.placa : null} aoFechar=${aoFechar}
      rodape=${html`<button class="btn btn-neutro" onClick=${aoFechar}>Cancelar</button>
        <button class="btn btn-primario" onClick=${salvar}>${registro ? 'Salvar alterações' : 'Salvar veículo'}</button>`}>
      <${Campo} rotulo="Dono" erro=${erros.cliente}>
        <select class="entrada" value=${f.cliente_id} aria-invalid=${Boolean(erros.cliente)} onInput=${e => setF(x => ({ ...x, cliente_id: e.target.value }))}>
          <option value="">Escolha o cliente</option>
          ${dados.clientes.map(c => html`<option key=${c.id} value=${c.id}>${c.nome}</option>`)}
        </select>
      <//>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:end">
        <${Campo} rotulo="Placa" erro=${erros.placa} ajuda="Formato antigo ou Mercosul">
          <input class="entrada mono" style="text-transform:uppercase" maxlength="7" value=${f.placa}
            aria-invalid=${Boolean(erros.placa)} onInput=${e => setF(x => ({ ...x, placa: e.target.value }))} />
        <//>
        <div style="display:flex;justify-content:center;padding-bottom:6px">
          ${validaPlaca(f.placa) ? html`<${Placa} valor=${f.placa.toUpperCase()} />` : html`<span class="silencioso">A placa aparece aqui</span>`}
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <${Campo} rotulo="Marca" erro=${erros.marca}>
          <input class="entrada" value=${f.marca} aria-invalid=${Boolean(erros.marca)} onInput=${e => setF(x => ({ ...x, marca: e.target.value }))} />
        <//>
        <${Campo} rotulo="Modelo" erro=${erros.modelo}>
          <input class="entrada" value=${f.modelo} aria-invalid=${Boolean(erros.modelo)} onInput=${e => setF(x => ({ ...x, modelo: e.target.value }))} />
        <//>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
        <${Campo} rotulo="Ano"><input class="entrada mono" type="number" value=${f.ano_modelo} onInput=${e => setF(x => ({ ...x, ano_modelo: e.target.value }))} /><//>
        <${Campo} rotulo="Cor"><input class="entrada" value=${f.cor} onInput=${e => setF(x => ({ ...x, cor: e.target.value }))} /><//>
        <${Campo} rotulo="KM atual"><input class="entrada mono" type="text" inputmode="numeric" value=${f.km_atual} onInput=${e => setF(x => ({ ...x, km_atual: e.target.value }))} /><//>
      </div>

      <div>
        <span class="rotulo">Fotos do veículo</span>
        <p class="silencioso" style="margin:4px 0 10px">Registre o estado na entrada: lataria, painel e o que já
          chegou avariado. É o que resolve discussão depois da entrega.</p>
        ${jaAnexadas.length ? html`
          <div style="margin-bottom:10px">
            <${Miniaturas} itens=${jaAnexadas}
              aoRemover=${(a) => { acoes.removerAnexo(a.id); avisar('Foto removida.'); }} />
          </div>` : null}
        ${fotos.length ? html`
          <div style="margin-bottom:10px">
            <${Miniaturas} pendente itens=${fotos}
              aoRemover=${(a, i) => setFotos(l => l.filter((_, k) => k !== i))} />
          </div>` : null}
        <${EntradaDeMidia} compacta aoReceber=${(ft) => setFotos(l => [...l, ft])} />
      </div>
    <//>`;
}

function TelaVeiculos({ embutida, busca: buscaFora, aoNovo }) {
  const { metricas, acoes, papel, abrirVeiculo } = usar();
  const [editando, setEditando] = useState(null);
  const [excluir, setExcluir] = useState(null);
  const [buscaLocal, setBuscaLocal] = useState('');
  const busca = embutida ? (buscaFora || '') : buscaLocal;
  const buscaLenta = useAtraso(busca);
  const [filtro, setFiltro] = useState('todos');
  const [form, setForm] = useState(false);
  const abrirNovo = aoNovo || (() => setForm(true));

  const lista = useMemo(() => {
    const q = buscaLenta.trim().toLowerCase();
    return metricas.veiculos
      .filter(v => filtro === 'revisao' ? (v.revisaoVencida || v.revisaoProxima) : true)
      .filter(v => !q || [v.placa, v.marca, v.modelo, v.cliente?.nome].some(x => String(x || '').toLowerCase().includes(q)));
  }, [buscaLenta, filtro, metricas]);

  return html`
    <div style="display:flex;flex-direction:column;gap:14px">
      ${embutida ? html`
        <div class="filtros">
          ${[['todos','Todos'],['revisao','Revisão prevista']].map(([id, nome]) => html`
            <button key=${id} class="filtro" aria-pressed=${filtro === id} onClick=${() => setFiltro(id)}>${nome}</button>`)}
        </div>` : html`
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <div class="busca">
          <${Icone} nome="busca" tam=${15} cor="var(--tinta-3)" />
          <input value=${buscaLocal} onInput=${e => setBuscaLocal(e.target.value)} placeholder="Placa, marca, modelo ou dono" aria-label="Buscar veículos" />
        </div>
        <div class="filtros">
          ${[['todos','Todos'],['revisao','Revisão prevista']].map(([id, nome]) => html`
            <button key=${id} class="filtro" aria-pressed=${filtro === id} onClick=${() => setFiltro(id)}>${nome}</button>`)}
        </div>
        ${pode(papel, 'criar') ? html`
          <button class="btn btn-primario" onClick=${abrirNovo}>
            <${Icone} nome="mais" tam=${15} /><span class="esconde-mobile">Novo veículo</span></button>` : null}
      </div>`}

      ${lista.length === 0
        ? html`<${Cartao}><${Vazio} icone="carro" titulo="Nenhum veículo encontrado"
            apoio="Cadastre o veículo para abrir ordens e montar o prontuário."
            acao=${html`<button class="btn btn-primario" style="margin-top:6px" onClick=${abrirNovo}>Cadastrar veículo</button>`} /><//>`
        : html`<${Cartao} nu>
            <div class="rolagem">
              <table class="tabela">
                <thead><tr><th>Placa</th><th>Veículo</th><th>Dono</th><th class="dir">KM</th><th class="dir">Desde a revisão</th><th class="dir">Passagens</th><th class="dir"><span class="esconde-mobile">Ações</span></th></tr></thead>
                <tbody>
                  ${lista.map(v => html`
                    <tr key=${v.id} style="cursor:pointer" onClick=${() => abrirVeiculo(v.id)}>
                      <td><${Placa} valor=${v.placa} tam="p" /></td>
                      <td>
                        <div style="font-size:13.5px;font-weight:500">${v.marca} ${v.modelo}</div>
                        <div class="silencioso">${v.ano_modelo || '—'} · ${v.cor || '—'}</div>
                      </td>
                      <td class="secundario" style="font-size:13.5px">${v.cliente?.nome}</td>
                      <td class="dir mono" style="font-size:12.5px">${inteiro(v.km_atual)}</td>
                      <td class="dir">
                        ${v.kmDesdeRevisao == null ? html`<span class="silencioso">—</span>`
                          : html`<${Selo} tom=${v.revisaoVencida ? 'alerta' : v.revisaoProxima ? 'info' : ''}>${inteiro(v.kmDesdeRevisao)} km<//>`}
                      </td>
                      <td class="dir"><${Selo}>${v.concluidas.length}<//></td>
                      <td class="dir"><${AcoesLinha} nome=${v.placa}
                        aoEditar=${() => setEditando(v)} aoExcluir=${() => setExcluir(v)} /></td>
                    </tr>`)}
                </tbody>
              </table>
            </div>
          <//>`}

      ${form ? html`<${FormVeiculo} aoFechar=${() => setForm(false)} />` : null}
      ${editando ? html`<${FormVeiculo} registro=${editando} aoFechar=${() => setEditando(null)} />` : null}
      ${excluir ? html`<${ConfirmarExclusao} tipo="veiculo" id=${excluir.id} rotulo="veículo"
        nome=${excluir.placa + ' · ' + excluir.marca + ' ' + excluir.modelo}
        descricao="O veículo sai da base junto com o prontuário, o plano de manutenção e as ordens de serviço dele."
        aoFechar=${() => setExcluir(null)} aoConfirmar=${() => acoes.excluirVeiculo(excluir.id)} />` : null}
    </div>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   ESTOQUE
   ══════════════════════════════════════════════════════════════════════════ */
function TelaEstoque() {
  const { dados, acoes, metricas, papel } = usar();
  const [busca, setBusca] = useState('');
  const buscaLenta = useAtraso(busca);
  const [filtro, setFiltro] = useState('todas');
  const [form, setForm] = useState(null);       // null | 'novo' | peça em edição
  const [excluir, setExcluir] = useState(null);
  const podeCusto = PAPEIS[papel].custo;

  /* CORREÇÃO · o filtro "Em falta" comparava os dois campos crus. Vindos do
     banco como texto, `'10' <= '2'` é comparação de string e dá verdadeiro:
     a peça com dez na prateleira aparecia na lista de falta e a com nove
     abaixo de um mínimo dez ficava de fora. O painel logo acima já lê pelo
     `num`; a lista tem de contar a mesma coisa, ou as duas metades da mesma
     tela discordam entre si. */
  const lista = useMemo(() => {
    const q = buscaLenta.trim().toLowerCase();
    return dados.pecas
      .filter(p => !q || [p.codigo, p.descricao, p.marca, p.localizacao].some(x => String(x || '').toLowerCase().includes(q)))
      .filter(p => filtro === 'falta' ? num(p.quantidade) <= num(p.estoque_minimo)
        : filtro === 'parada' ? !metricas.usoPecas[p.id] : true)
      .sort((a, b) => (num(a.quantidade) - num(a.estoque_minimo)) - (num(b.quantidade) - num(b.estoque_minimo)));
  }, [buscaLenta, filtro, dados, metricas]);

  return html`
    <div style="display:flex;flex-direction:column;gap:14px">
      <${PainelEstoque} />

      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <div class="busca">
          <${Icone} nome="busca" tam=${15} cor="var(--tinta-3)" />
          <input value=${busca} onInput=${e => setBusca(e.target.value)} placeholder="Código, descrição, marca ou prateleira" aria-label="Buscar peças" />
        </div>
        <div class="filtros">
          ${[['todas','Todas'],['falta','Em falta'],['parada','Sem giro']].map(([id, nome]) => html`
            <button key=${id} class="filtro" aria-pressed=${filtro === id} onClick=${() => setFiltro(id)}>${nome}</button>`)}
        </div>
        ${pode(papel, 'criar') ? html`
          <button class="btn btn-primario" style="margin-left:auto" onClick=${() => setForm('novo')}>
            <${Icone} nome="mais" tam=${15} /><span class="esconde-mobile">Nova peça</span></button>` : null}
      </div>

      ${lista.length === 0
        ? html`<${Cartao}>${dados.pecas.length === 0
            ? html`<${Vazio} icone="caixa" titulo="Seu estoque está pronto para receber os primeiros itens"
                apoio="Cadastre as peças que você mais usa e o sistema passa a avisar quando o saldo cair abaixo do mínimo."
                acao=${pode(papel, 'criar') ? html`<button class="btn btn-primario" onClick=${() => setForm('novo')}>Cadastrar primeira peça</button>` : null} />`
            : html`<${Vazio} icone="busca" titulo="Nenhuma peça nesta combinação"
                apoio="Ajuste a busca ou troque o filtro — o estoque tem ${dados.pecas.length} peças cadastradas." />`}<//>`
        : html`<${Cartao} nu>
            <div class="rolagem">
              <table class="tabela">
                <thead><tr>
                  <th>Código</th><th>Peça</th><th>Prateleira</th><th class="dir">Saldo</th><th class="dir">Mínimo</th>
                  <th class="dir">Saídas</th>${podeCusto ? html`<th class="dir">Custo</th>` : null}<th class="dir">Preço</th>
                  <th class="dir"><span class="esconde-mobile">Ações</span></th>
                </tr></thead>
                <tbody>
                  ${lista.map(p => {
                    const saldo = num(p.quantidade), minimo = num(p.estoque_minimo);
                    const falta = saldo <= minimo;
                    const uso = metricas.usoPecas[p.id];
                    return html`
                      <tr key=${p.id}>
                        <td class="mono" style="font-size:12.5px;color:var(--tinta-2)">${p.codigo}</td>
                        <td>
                          <div style="font-size:13.5px;font-weight:500">${p.descricao}</div>
                          <div class="silencioso">${p.marca}</div>
                        </td>
                        <td class="mono secundario" style="font-size:12.5px">${p.localizacao}</td>
                        <td class="dir"><${Selo} tom=${saldo === 0 ? 'erro' : falta ? 'alerta' : ''} icone=${falta ? 'alerta' : null}>${saldo}<//></td>
                        <td class="dir mono silencioso">${minimo}</td>
                        <td class="dir mono" style="font-size:12.5px;color:var(--tinta-3)">${uso ? uso.qtd : '—'}</td>
                        ${podeCusto ? html`<td class="dir mono" style="font-size:12.5px;color:var(--tinta-2)">${brlBruto(p.custo_medio)}</td>` : null}
                        <td class="dir mono" style="font-size:13px;font-weight:600">${brlBruto(p.preco_venda)}</td>
                        <td class="dir"><${AcoesLinha} nome=${p.descricao}
                          aoEditar=${() => setForm(p)} aoExcluir=${() => setExcluir(p)} /></td>
                      </tr>`;
                  })}
                </tbody>
              </table>
            </div>
          <//>`}

      ${form ? html`<${FormPeca} registro=${form === 'novo' ? null : form} aoFechar=${() => setForm(null)} />` : null}
      ${excluir ? html`<${ConfirmarExclusao} tipo="peca" id=${excluir.id} rotulo="peça"
        nome=${excluir.codigo + ' · ' + excluir.descricao}
        descricao="A peça sai do catálogo do estoque. As ordens que já a usaram continuam iguais."
        aoFechar=${() => setExcluir(null)} aoConfirmar=${() => acoes.excluirPeca(excluir.id)} />` : null}
    </div>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   FINANCEIRO
   ══════════════════════════════════════════════════════════════════════════ */
function TelaFinanceiro() {
  const { dados, metricas, acoes, papel, avisar } = usar();
  const [aba, setAba] = useState('movimento');
  const [periodo, setPeriodo] = useState('dia');
  const [lancando, setLancando] = useState(null);   // null | 'novo' | título em edição
  const [excluir, setExcluir] = useState(null);
  const acesso = PAPEIS[papel].financeiro;

  if (!acesso) return html`<${Cartao}><${Vazio} icone="carteira" titulo="Financeiro restrito"
    apoio=${'O perfil de ' + PAPEIS[papel].nome.toLowerCase() + ' não tem acesso a esta área. Fale com o gerente se precisar de algo daqui.'} /><//>`;

  const lista = dados.lancamentos.filter(l => l.tipo === aba);
  const aberto = lista.filter(l => l.status === 'aberto');
  const vencido = aberto.filter(l => venceu(l.vencimento));
  const soma = (a) => a.reduce((s, l) => s + l.valor, 0);
  const mov = metricas.caixa[periodo];
  const ROTULOS = { dia: 'hoje', semana: 'nesta semana', mes: 'neste mês' };
  const JANELAS = { dia: 'Somente hoje', semana: 'De domingo até agora', mes: 'Do dia 1º até agora' };

  if (aba === 'movimento') return html`
    <div style="display:flex;flex-direction:column;gap:14px" class="entra">
      <div class="filtros">
        ${[['movimento','Movimento do caixa'],['receber','Contas a receber'],['pagar','Contas a pagar']].map(([id, nome]) => html`
          <button key=${id} class="filtro" aria-pressed=${aba === id} onClick=${() => setAba(id)}
            disabled=${acesso === 'parcial' && id === 'pagar'}>${nome}</button>`)}
      </div>
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <div class="filtros">
          ${[['dia','Hoje'],['semana','Semana'],['mes','Mês']].map(([id, nome]) => html`
            <button key=${id} class="filtro" aria-pressed=${periodo === id} onClick=${() => setPeriodo(id)}>${nome}</button>`)}
        </div>
        <span class="silencioso">${JANELAS[periodo]}</span>
      </div>
      <div class="grade g-4">
        <${Indicador} rotulo=${'Entrou ' + ROTULOS[periodo]} valor=${brlCurto(mov.entradas)} acento="var(--ok)"
          apoio="Recebimentos com baixa registrada" />
        <${Indicador} rotulo=${'Saiu ' + ROTULOS[periodo]} valor=${brlCurto(mov.saidas)} acento=${mov.saidas ? 'var(--erro)' : ''}
          apoio="Compras, peças e despesas pagas" />
        <${Indicador} rotulo="Saldo do período" valor=${brlCurto(mov.saldo)}
          acento=${mov.saldo >= 0 ? 'var(--ok)' : 'var(--erro)'} apoio="Entradas menos saídas" />
        <${Indicador} rotulo=${'Faturado ' + ROTULOS[periodo]} valor=${brlCurto(mov.faturado)}
          apoio=${mov.ordens + ' ordens concluídas · ainda pode não ter entrado no caixa'} />
      </div>
      <${PainelResultado} />
      <div class="aviso aviso-info">
        <${Icone} nome="carteira" tam=${16} />
        <span>Faturado e recebido são coisas diferentes: o carro pode sair hoje e o dinheiro entrar no dia 30.
        O saldo acima conta só o que teve baixa; o faturamento conta o serviço entregue.</span>
      </div>
      <${Cartao} nu>
        <div style="padding:16px 18px;border-bottom:1px solid var(--linha)">
          <h3>Lançamentos com baixa ${ROTULOS[periodo]}</h3>
          <p class="silencioso">${mov.lancamentos.length} ${mov.lancamentos.length === 1 ? 'movimento' : 'movimentos'}</p>
        </div>
        ${mov.lancamentos.length === 0
          ? html`<${Vazio} icone="carteira" titulo=${'Nenhum movimento ' + ROTULOS[periodo]}
              apoio="Assim que um título receber baixa, ele aparece aqui." />`
          : html`<div class="rolagem"><table class="tabela">
              <thead><tr><th>Descrição</th><th>Categoria</th><th>Baixa em</th><th class="dir">Valor</th></tr></thead>
              <tbody>
                ${mov.lancamentos.map(l => html`
                  <tr key=${l.id}>
                    <td style="font-size:13.5px;font-weight:500">${l.descricao}</td>
                    <td class="secundario" style="font-size:13px">${l.categoria}</td>
                    <td class="mono" style="font-size:12.5px">${fmtData(l.pago_em)}</td>
                    <td class="dir mono" style=${'font-size:13.5px;font-weight:600;color:' + (l.tipo === 'pagar' ? 'var(--erro)' : 'var(--ok)')}>
                      ${l.tipo === 'pagar' ? '− ' : '+ '}${brl(l.valor)}</td>
                  </tr>`)}
              </tbody>
            </table></div>`}
      <//>
    </div>`;

  return html`
    <div style="display:flex;flex-direction:column;gap:14px">
      <div class="grade g-3">
        <${Indicador} rotulo=${aba === 'receber' ? 'A receber em aberto' : 'A pagar em aberto'} valor=${brlCurto(soma(aberto))} apoio=${aberto.length + ' título(s)'} />
        <${Indicador} rotulo="Vencido" valor=${brlCurto(soma(vencido))} acento=${vencido.length ? 'var(--erro)' : 'var(--ok)'}
          apoio=${vencido.length ? vencido.length + ' em atraso' : 'Nada em atraso'} />
        <${Indicador} rotulo="Liquidado" valor=${brlCurto(soma(lista.filter(l => l.status === 'pago')))} apoio="Baixas confirmadas" />
      </div>

      <div class="filtros">
        ${[['movimento','Movimento do caixa'],['receber','Contas a receber'],['pagar','Contas a pagar']].map(([id, nome]) => html`
          <button key=${id} class="filtro" aria-pressed=${aba === id} onClick=${() => setAba(id)}
            disabled=${acesso === 'parcial' && id === 'pagar'}>${nome}</button>`)}
      </div>

      ${acesso === 'parcial' ? html`
        <div class="aviso aviso-info"><${Icone} nome="alerta" tam=${16} />
          <span>Como atendente você registra recebimentos. Contas a pagar ficam com o gerente.</span></div>` : null}

      ${pode(papel, 'criar') ? html`
        <div style="display:flex;justify-content:flex-end">
          <button class="btn btn-primario" onClick=${() => setLancando('novo')}>
            <${Icone} nome="mais" tam=${15} />${aba === 'receber' ? 'Novo recebimento' : 'Nova despesa'}</button>
        </div>` : null}

      <${Cartao} nu>
        <div class="rolagem">
          <table class="tabela">
            <thead><tr><th>Descrição</th><th>Categoria</th><th>Vencimento</th><th>Situação</th><th class="dir">Valor</th><th></th></tr></thead>
            <tbody>
              ${lista.map(l => {
                const atrasado = l.status === 'aberto' && venceu(l.vencimento);
                return html`
                  <tr key=${l.id}>
                    <td style="font-size:13.5px;font-weight:500">${l.descricao}</td>
                    <td class="secundario" style="font-size:13px">${l.categoria}</td>
                    <td class="mono" style="font-size:12.5px">${fmtData(l.vencimento)}</td>
                    <td><${Selo} tom=${l.status === 'pago' ? 'ok' : atrasado ? 'erro' : ''}>
                      ${l.status === 'pago' ? 'Liquidado' : atrasado ? 'Vencido há ' + Math.abs(diasAte(l.vencimento)) + 'd' : 'Em aberto'}<//></td>
                    <td class="dir mono" style=${'font-size:13.5px;font-weight:600;color:' + (l.tipo === 'pagar' ? 'var(--erro)' : 'var(--tinta)')}>
                      ${l.tipo === 'pagar' ? '− ' : ''}${brl(l.valor)}</td>
                    <td class="dir">
                      <span style="display:inline-flex;align-items:center;gap:6px;justify-content:flex-end">
                        ${l.status === 'aberto' ? html`
                          <button class="btn btn-neutro btn-p" onClick=${() => { acoes.baixarLancamento(l.id); avisar('Baixa registrada.'); }}>
                            <${Icone} nome="check" tam=${13} />Baixar</button>` : null}
                        <${AcoesLinha} nome=${l.descricao}
                          aoEditar=${l.status === 'aberto' ? () => setLancando(l) : null}
                          aoExcluir=${() => setExcluir(l)} />
                      </span>
                    </td>
                  </tr>`;
              })}
            </tbody>
          </table>
        </div>
      <//>

      ${lancando ? html`<${FormLancamento} registro=${lancando === 'novo' ? null : lancando}
        tipoInicial=${aba === 'receber' ? 'receber' : 'pagar'} aoFechar=${() => setLancando(null)} />` : null}
      ${excluir ? html`<${ConfirmarExclusao} tipo="lancamento" id=${excluir.id} rotulo="título"
        nome=${excluir.descricao + ' · ' + brl(excluir.valor)}
        descricao="O título sai do contas a pagar/receber e deixa de contar nos relatórios."
        aoFechar=${() => setExcluir(null)} aoConfirmar=${() => acoes.excluirLancamento(excluir.id)} />` : null}
    </div>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   RELATÓRIOS
   ══════════════════════════════════════════════════════════════════════════ */
function TelaRelatorios() {
  const { dados, metricas, papel } = usar();
  const [aba, setAba] = useState('financeiro');
  const m = metricas;
  const podeCusto = PAPEIS[papel].custo;

  if (!PAPEIS[papel].gestao) return html`<${Cartao}><${Vazio} icone="grafico" titulo="Relatórios restritos"
    apoio=${'O perfil de ' + PAPEIS[papel].nome.toLowerCase() + ' não tem acesso aos relatórios de gestão.'} /><//>`;

  const ABAS = [{ id:'financeiro', nome:'Financeiro' }, { id:'operacional', nome:'Operacional' },
                { id:'clientes', nome:'Clientes' }, { id:'estoque', nome:'Estoque' }];

  const recorrentes = m.clientes.filter(c => c.concluidas.length >= 3);
  const inativos = m.clientes.filter(c => c.inativo).sort((a, b) => b.gasto - a.gasto);
  const pecasUsadas = Object.values(m.usoPecas).map(u => {
    const p = dados.pecas.find(x => x.id === u.peca_id);
    return { nome: p ? p.descricao : '—', valor: u.qtd };
  }).sort((a, b) => b.valor - a.valor);
  const paradas = dados.pecas.filter(p => p.quantidade > 0 && !m.usoPecas[p.id]);
  const tempoTotal = m.tempoEtapa.reduce((s, x) => s + x.media, 0);

  return html`
    <div style="display:flex;flex-direction:column;gap:16px">
      <${Abas} itens=${ABAS} ativa=${aba} aoTrocar=${setAba} />

      ${aba === 'financeiro' ? html`
        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="grade g-4">
            <${Indicador} rotulo="Receita no mês" valor=${brlCurto(m.mesAtual.receita)} apoio=${m.mesAtual.ordens + ' ordens concluídas'} />
            <${Indicador} rotulo="Ticket médio" valor=${brl(m.ticket)} apoio="Média de todas as ordens concluídas" />
            ${podeCusto ? html`<${Indicador} rotulo="Margem média" valor=${pct(m.margemMedia)}
              acento=${m.margemMedia >= PISO_MARGEM ? 'var(--ok)' : 'var(--alerta)'} apoio=${'Piso configurado em ' + PISO_MARGEM + '%'} />` : null}
            <${Indicador} rotulo="Receita acumulada" valor=${brlCurto(m.meses.reduce((s, x) => s + x.receita, 0))} apoio="Últimos doze meses" />
          </div>
          <${Cartao}>
            <div class="cartao-topo"><div><h3>Receita mensal</h3>
              <p class="silencioso">Faturamento realizado por mês de conclusão</p></div></div>
            <${GraficoArea} dados=${m.meses} chaves=${['receita', 'custo']} altura=${230} />
          <//>
          <div class="grade g-2">
            <${Cartao}>
              <h3 style="margin-bottom:4px">Serviços que mais faturam</h3>
              <p class="silencioso" style="margin-bottom:14px">Por valor acumulado</p>
              <${Barras} dados=${m.mix.slice(0, 8)} />
            <//>
            <${Cartao}>
              <h3 style="margin-bottom:4px">Serviços mais realizados</h3>
              <p class="silencioso" style="margin-bottom:14px">Por quantidade de execuções</p>
              <${Barras} dados=${[...m.mix].sort((a, b) => b.qtd - a.qtd).slice(0, 8).map(s => ({ nome:s.nome, valor:s.qtd }))}
                formato=${v => v + 'x'} cor="var(--ciano)" corSec="var(--roxo)" />
            <//>
          </div>
        </div>` : null}

      ${aba === 'operacional' ? html`
        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="grade g-4">
            <${Indicador} rotulo="Ordens concluídas" valor=${m.concluidas.length} apoio="Total no histórico" />
            <${Indicador} rotulo="No pátio agora" valor=${m.ativas.length} acento=${m.travadas.length ? 'var(--alerta)' : ''}
              apoio=${m.travadas.length + ' paradas há 6 dias ou mais'} />
            <${Indicador} rotulo="Ciclo médio" valor=${tempoTotal ? tempoTotal.toFixed(1) + ' dias' : '—'} apoio="Da recepção à conclusão" />
            <${Indicador} rotulo="Concluídas no mês" valor=${m.concluidasMes.length} apoio="Mês corrente" />
          </div>
          <div class="grade g-2">
            <${Cartao}>
              <h3 style="margin-bottom:4px">Onde o tempo é gasto</h3>
              <p class="silencioso" style="margin-bottom:14px">Média de permanência em cada etapa</p>
              <${Barras} dados=${m.tempoEtapa.map(t => ({ nome: etapaNome(t.etapa), valor: Number(t.media.toFixed(1)) }))}
                formato=${v => v + ' dias'} cor="var(--alerta)" corSec="var(--ciano)" />
            <//>
            ${comMecanicos(dados) ? html`
            <${Cartao}>
              <h3 style="margin-bottom:4px">Produtividade por mecânico</h3>
              <p class="silencioso" style="margin-bottom:14px">Ordens concluídas e receita gerada</p>
              <div style="display:flex;flex-direction:column;gap:11px">
                ${m.produtividade.map(p => html`
                  <div key=${p.id} style="display:flex;align-items:center;gap:11px">
                    <span class="avatar" style="width:32px;height:32px;font-size:11px;background:var(--roxo-fundo);color:var(--roxo)">${p.id}</span>
                    <div style="flex:1;min-width:0">
                      <div style="font-size:13px;font-weight:500">${p.nome}</div>
                      <div class="silencioso">${p.ordens} ordens · ticket de ${brlCurto(p.ticket)}</div>
                    </div>
                    <span class="mono" style="font-size:13px;font-weight:600">${brlCurto(p.receita)}</span>
                  </div>`)}
              </div>
            <//>` : null}
          </div>
        </div>` : null}

      ${aba === 'clientes' ? html`
        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="grade g-4">
            <${Indicador} rotulo="Clientes na base" valor=${m.clientes.length} apoio=${dados.veiculos.length + ' veículos vinculados'} />
            <${Indicador} rotulo="Recorrentes" valor=${recorrentes.length} acento="var(--ok)" apoio="Três ou mais passagens" />
            <${Indicador} rotulo="Sem retorno" valor=${inativos.length} acento=${inativos.length ? 'var(--alerta)' : ''}
              apoio=${'Mais de ' + Math.round(DIAS_INATIVO / 30) + ' meses sem aparecer'} />
            <${Indicador} rotulo="Receita a recuperar" valor=${brlCurto(inativos.reduce((s, c) => s + c.ticket, 0))}
              apoio="Ticket médio dos inativos, se voltassem" />
          </div>
          <div class="grade g-2">
            <${Cartao}>
              <h3 style="margin-bottom:4px">Melhores clientes</h3>
              <p class="silencioso" style="margin-bottom:14px">Por valor acumulado na oficina</p>
              <${Barras} dados=${m.clientes.filter(c => c.gasto > 0).sort((a, b) => b.gasto - a.gasto).slice(0, 8).map(c => ({ nome:c.nome, valor:c.gasto }))} />
            <//>
            <${Cartao}>
              <h3 style="margin-bottom:4px">Precisam de retorno</h3>
              <p class="silencioso" style="margin-bottom:14px">Ordenados por quanto já gastaram aqui</p>
              ${inativos.length === 0
                ? html`<p class="silencioso">Nenhum cliente inativo. Boa retenção.</p>`
                : html`<div style="display:flex;flex-direction:column;gap:11px">
                    ${inativos.map(c => html`
                      <div key=${c.id} style="display:flex;align-items:center;gap:11px">
                        <span class="avatar" style="width:32px;height:32px;font-size:11.5px">${iniciais(c.nome)}</span>
                        <div style="flex:1;min-width:0">
                          <div class="corta" style="font-size:13px;font-weight:500">${c.nome}</div>
                          <div class="silencioso">${mesesDesde(c.ultima)} meses · ${fmtTel(c.telefone)}</div>
                        </div>
                        <span class="mono" style="font-size:12.5px;font-weight:600">${brlCurto(c.gasto)}</span>
                      </div>`)}
                  </div>`}
            <//>
          </div>
        </div>` : null}

      ${aba === 'estoque' ? html`
        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="grade g-4">
            <${Indicador} rotulo="Itens no catálogo" valor=${dados.pecas.length} apoio="Peças cadastradas" />
            <${Indicador} rotulo="Em falta" valor=${m.estoqueBaixo.length} acento=${m.estoqueBaixo.length ? 'var(--alerta)' : ''} apoio="No mínimo ou abaixo" />
            <${Indicador} rotulo="Sem giro" valor=${paradas.length} apoio="Nenhuma saída no período" />
            ${podeCusto ? html`<${Indicador} rotulo="Capital parado" valor=${brlCurto(paradas.reduce((s, p) => s + p.quantidade * p.custo_medio, 0))}
              acento=${paradas.length ? 'var(--alerta)' : ''} apoio="Dinheiro dormindo na prateleira" />` : null}
          </div>
          <div class="grade g-2">
            <${Cartao}>
              <h3 style="margin-bottom:4px">Peças mais utilizadas</h3>
              <p class="silencioso" style="margin-bottom:14px">Por quantidade aplicada em ordens</p>
              <${Barras} dados=${pecasUsadas.slice(0, 8)} formato=${v => v + ' un'} cor="var(--ciano)" corSec="var(--roxo)" />
            <//>
            <${Cartao}>
              <h3 style="margin-bottom:4px">Produtos parados</h3>
              <p class="silencioso" style="margin-bottom:14px">Sem saída — candidatos a promoção ou devolução</p>
              ${paradas.length === 0
                ? html`<p class="silencioso">Todo o estoque teve saída no período.</p>`
                : html`<div style="display:flex;flex-direction:column;gap:11px">
                    ${paradas.map(p => html`
                      <div key=${p.id} style="display:flex;align-items:center;gap:11px">
                        <span style="width:32px;height:32px;border-radius:9px;background:var(--superficie-2);color:var(--tinta-3);display:flex;align-items:center;justify-content:center">
                          <${Icone} nome="caixa" tam=${15} /></span>
                        <div style="flex:1;min-width:0">
                          <div class="corta" style="font-size:13px;font-weight:500">${p.descricao}</div>
                          <div class="silencioso mono">${p.codigo} · ${p.quantidade} un na ${p.localizacao}</div>
                        </div>
                        ${podeCusto ? html`<span class="mono" style="font-size:12.5px;font-weight:600">${brl(p.quantidade * p.custo_medio)}</span>` : null}
                      </div>`)}
                  </div>`}
            <//>
          </div>
        </div>` : null}
    </div>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   AUTOMAÇÕES — estrutura pronta; a integração entra na próxima fase
   ══════════════════════════════════════════════════════════════════════════ */
const CANAIS = { whatsapp:{ nome:'WhatsApp', icone:'mensagem' }, email:{ nome:'E-mail', icone:'arquivo' }, sms:{ nome:'SMS', icone:'telefone' } };

function TelaAutomacoes() {
  const { dados, metricas, acoes, papel, achados, avisar } = usar();
  const [aba, setAba] = useState('regras');
  const [novaTarefa, setNovaTarefa] = useState('');
  const OFICINA = dados.oficina;
  if (!PAPEIS[papel].gestao) return html`<${Cartao}><${Vazio} icone="raio" titulo="Automações restritas"
    apoio="Só dono e gerente configuram as regras de comunicação com o cliente." /><//>`;

  /* Fila de mensagens: o que sairia hoje se os canais estivessem ligados. */
  const fila = [];
  dados.automacoes.filter(a => a.ativa).forEach(a => {
    if (a.id === 'a1') metricas.preventiva.filter(v => v.vencidos.length).forEach(v => {
      const alvo = v.vencidos[0];
      fila.push({ id: a.id + v.id, regra: a.nome, canal: a.canal, para: v.cliente?.nome, contato: v.cliente?.telefone,
        texto: 'Olá, ' + String(v.cliente?.nome).split(' ')[0] + '! O ' + v.marca + ' ' + v.modelo + ' já passou do intervalo de ' +
          alvo.servico.toLowerCase() + ' (' + inteiro(alvo.intervaloKm) + ' km). Quer que eu reserve um horário nesta semana?' });
    });
    if (a.id === 'a2') metricas.inativos.forEach(c => fila.push({
      id: a.id + c.id, regra: a.nome, canal: a.canal, para: c.nome, contato: c.telefone,
      texto: 'Olá, ' + String(c.nome).split(' ')[0] + '! Faz ' + mesesDesde(c.ultima) + ' meses que você não passa na ' + OFICINA.nome + '. Que tal uma revisão de cortesia?' }));
    if (a.id === 'a3') metricas.aguardandoAprovacao.filter(o => o.dias >= 3).forEach(o => fila.push({
      id: a.id + o.id, regra: a.nome, canal: a.canal, para: o.cliente?.nome, contato: o.cliente?.telefone,
      texto: 'Passando para lembrar do orçamento do ' + o.veiculo?.marca + ' ' + o.veiculo?.modelo + ': ' + brlBruto(o.totais.liquido) + ', válido até ' + fmtData(o.validade) + '.' }));
    if (a.id === 'a4') metricas.prontas.forEach(o => fila.push({
      id: a.id + o.id, regra: a.nome, canal: a.canal, para: o.cliente?.nome, contato: o.cliente?.telefone,
      texto: 'Boa notícia! O ' + o.veiculo?.marca + ' ' + o.veiculo?.modelo + ' está pronto para retirada na ' + OFICINA.nome + '.' }));
  });

  /* Rotinas internas: o que a oficina precisa fazer, não o que o cliente recebe. */
  const sugeridas = [];
  dados.pecas.filter(p => p.quantidade === 0).forEach(p => sugeridas.push({
    id: 'tz-' + p.id, titulo: 'Comprar ' + p.descricao.toLowerCase(), origem: 'Peça zerada no estoque', responsavel: 'Renata Salgado' }));
  dados.lancamentos.filter(l => l.tipo === 'receber' && l.status === 'aberto' && venceu(l.vencimento)).forEach(l => sugeridas.push({
    id: 'tc-' + l.id, titulo: 'Cobrar ' + l.descricao.toLowerCase() + ' (' + brlBruto(l.valor) + ')', origem: 'Título vencido sem baixa', responsavel: 'Beatriz Antunes' }));
  metricas.ativas.filter(o => o.etapa === 'finalizacao').forEach(o => sugeridas.push({
    id: 'tf-' + o.id, titulo: 'Conferir ' + o.veiculo?.marca + ' ' + o.veiculo?.modelo + ' antes da entrega', origem: 'Ordem entrou em finalização', responsavel: mecanicoNome(o.mecanico) }));
  metricas.travadas.forEach(o => sugeridas.push({
    id: 'tt-' + o.id, titulo: 'Destravar OS ' + o.numero + ' (' + o.dias + ' dias parada)', origem: 'Veículo parado há 6 dias ou mais', responsavel: 'Renata Salgado' }));
  const jaCriadas = new Set(dados.tarefas.map(t => t.origemId));
  const pendentesSugeridas = sugeridas.filter(t => !jaCriadas.has(t.id));

  const ABAS = [{ id:'regras', nome:'Regras' }, { id:'fila', nome:'Fila de mensagens' },
                { id:'tarefas', nome:'Rotinas internas' }, { id:'mensagens', nome:'Modelos de texto' }];

  return html`
    <div style="display:flex;flex-direction:column;gap:16px" class="entra">
      <div class="aviso aviso-info">
        <${Icone} nome="raio" tam=${16} />
        <div><strong>Nenhum canal está conectado ainda.</strong> As regras já rodam sobre os dados reais e montam a fila.
        Quando o WhatsApp for ligado, essa mesma fila passa a sair sozinha — nada aqui será refeito.</div>
      </div>

      <${Abas} itens=${ABAS} ativa=${aba} aoTrocar=${setAba} />

      ${aba === 'regras' ? html`
        <div class="grade g-2">
          <${Cartao}>
            <div class="cartao-topo"><div><h3>Regras de comunicação</h3>
              <p class="silencioso">O que dispara uma mensagem e por onde ela sai</p></div></div>
            <div style="display:flex;flex-direction:column">
              ${dados.automacoes.map(a => html`
                <div key=${a.id} style="display:flex;align-items:center;gap:12px;padding:12px 0;border-top:1px solid var(--linha-suave)">
                  <span style=${'width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center;background:' + (a.ativa ? 'var(--info-fundo)' : 'var(--superficie-2)') + ';color:' + (a.ativa ? 'var(--azul-acao)' : 'var(--tinta-3)')}>
                    <${Icone} nome=${CANAIS[a.canal].icone} tam=${15} /></span>
                  <div style="flex:1;min-width:0">
                    <div style="font-size:13.5px;font-weight:500">${a.nome}</div>
                    <div class="silencioso">${a.gatilho} · via ${CANAIS[a.canal].nome}</div>
                  </div>
                  <${Interruptor} ligado=${a.ativa} rotulo=${a.nome} aoTrocar=${() => acoes.alternarAutomacao(a.id, a.nome, !a.ativa)} />
                </div>`)}
            </div>
          <//>
          <div style="display:flex;flex-direction:column;gap:14px">
            <${Cartao}>
              <div class="cartao-topo"><div><h3>Canais</h3><p class="silencioso">Conexão entra na próxima fase</p></div></div>
              <div style="display:flex;flex-direction:column;gap:9px">
                ${Object.entries(CANAIS).map(([id, c]) => html`
                  <div key=${id} style="display:flex;align-items:center;gap:11px;padding:11px;border:1px solid var(--linha);border-radius:var(--raio)">
                    <span style="width:30px;height:30px;border-radius:8px;background:var(--superficie-2);color:var(--tinta-3);display:flex;align-items:center;justify-content:center">
                      <${Icone} nome=${c.icone} tam=${15} /></span>
                    <div style="flex:1"><div style="font-size:13px;font-weight:500">${c.nome}</div>
                      <div class="silencioso">Não conectado</div></div>
                    <button class="btn btn-neutro btn-p" disabled>Conectar</button>
                  </div>`)}
              </div>
            <//>
            <${Cartao}>
              <h3 style="margin-bottom:4px">Sinais monitorados</h3>
              <p class="silencioso" style="margin-bottom:12px">O mesmo motor que alimenta o assistente e as notificações</p>
              <${ChaveValor} chave="Pontos identificados hoje" valor=${achados.length} forte />
              <${ChaveValor} chave="Regras ativas" valor=${dados.automacoes.filter(a => a.ativa).length} />
              <${ChaveValor} chave="Mensagens na fila" valor=${fila.length} />
              <${ChaveValor} chave="Rotinas sugeridas" valor=${pendentesSugeridas.length} />
            <//>
          </div>
        </div>` : null}

      ${aba === 'fila' ? html`
        <${Cartao} nu>
          <div style="padding:16px 18px;border-bottom:1px solid var(--linha)">
            <h3>Fila de mensagens</h3>
            <p class="silencioso">${fila.length === 0 ? 'Nada a enviar hoje.' : fila.length + ' mensagens sairiam agora com as regras ligadas.'}</p>
          </div>
          ${fila.length === 0
            ? html`<${Vazio} icone="check" titulo="Fila vazia" apoio="Nenhuma regra ativa encontrou situação para comunicar hoje." />`
            : html`<div style="padding:14px;display:flex;flex-direction:column;gap:9px">
                ${fila.map(f => html`
                  <div key=${f.id} style="display:flex;gap:11px;padding:12px;border:1px solid var(--linha);border-radius:var(--raio)">
                    <span style="width:32px;height:32px;border-radius:9px;background:var(--ciano-fundo);color:var(--ciano);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                      <${Icone} nome=${CANAIS[f.canal].icone} tam=${15} /></span>
                    <div style="flex:1;min-width:0">
                      <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap">
                        <span style="font-size:13px;font-weight:600">${f.para}</span>
                        <span class="silencioso mono">${fmtTel(f.contato)}</span>
                        <${Selo}>${f.regra}<//>
                      </div>
                      <p class="silencioso" style="margin-top:5px;line-height:1.45">${f.texto}</p>
                    </div>
                    <button class="btn btn-neutro btn-p" onClick=${() => copiarE(f.texto, avisar, 'Mensagem copiada.')}>Copiar</button>
                  </div>`)}
              </div>`}
        <//>` : null}

      ${aba === 'tarefas' ? html`
        <div class="grade g-2-1">
          <${Cartao}>
            <div class="cartao-topo"><div><h3>Tarefas da equipe</h3>
              <p class="silencioso">${dados.tarefas.filter(t => !t.feita).length} em aberto</p></div></div>
            <div style="display:flex;gap:8px;margin-bottom:6px">
              <input class="entrada" value=${novaTarefa} placeholder="Escrever uma tarefa e pressionar Enter"
                onInput=${e => setNovaTarefa(e.target.value)}
                onKeyDown=${e => { if (e.key === 'Enter' && novaTarefa.trim()) { acoes.criarTarefa({ titulo:novaTarefa.trim(), origem:'Criada manualmente' }); setNovaTarefa(''); avisar('Tarefa criada.'); } }} />
            </div>
            ${dados.tarefas.length === 0
              ? html`<${Vazio} icone="check" titulo="Nenhuma tarefa aberta" apoio="Crie acima ou aceite uma das rotinas sugeridas ao lado." />`
              : dados.tarefas.map(t => html`
                <div key=${t.id} class=${'tarefa' + (t.feita ? ' feita' : '')}>
                  <button class="marcador" role="checkbox" aria-checked=${t.feita} aria-label=${'Concluir ' + t.titulo}
                    onClick=${() => acoes.alternarTarefa(t.id)}><${Icone} nome="check" tam=${13} /></button>
                  <div style="flex:1;min-width:0">
                    <div class="titulo-tarefa" style="font-size:13.5px;font-weight:500">${t.titulo}</div>
                    <div class="silencioso">${t.origem}${t.responsavel ? ' · ' + t.responsavel : ''}${t.prazo ? ' · até ' + fmtData(t.prazo) : ''}</div>
                  </div>
                  ${pode(papel, 'excluir') ? html`
                    <button class="remover" aria-label=${'Excluir ' + t.titulo} title="Excluir tarefa"
                      onClick=${() => { acoes.excluirTarefa(t.id); avisar('Tarefa removida.'); }}>
                      <${Icone} nome="lixo" tam=${14} /></button>` : null}
                </div>`)}
          <//>

          <${Cartao}>
            <div class="cartao-topo"><div><h3>Rotinas sugeridas</h3>
              <p class="silencioso">Situações detectadas que viram tarefa em um toque</p></div></div>
            ${pendentesSugeridas.length === 0
              ? html`<p class="silencioso">Nada pendente. Toda situação detectada já virou tarefa.</p>`
              : html`<div style="display:flex;flex-direction:column;gap:8px">
                  ${pendentesSugeridas.slice(0, 8).map(t => html`
                    <div key=${t.id} class="recomendacao">
                      <span class="marca-rec"><${Icone} nome="raio" tam=${14} /></span>
                      <div style="flex:1;min-width:0">
                        <div style="font-size:13px;font-weight:500">${t.titulo}</div>
                        <p class="base-amostra" style="margin-top:3px">${t.origem} · sugerido para ${t.responsavel}</p>
                        <button class="btn btn-neutro btn-p" style="margin-top:8px"
                          onClick=${() => { acoes.criarTarefa({ ...t, origemId:t.id }); avisar('Tarefa criada para ' + t.responsavel + '.'); }}>
                          <${Icone} nome="mais" tam=${13} />Criar tarefa</button>
                      </div>
                    </div>`)}
                </div>`}
          <//>
        </div>` : null}

      ${aba === 'mensagens' ? html`
        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="aviso aviso-alerta">
            <${Icone} nome="mensagem" tam=${16} />
            <span>Tom da casa: profissional, amigável e direto. O texto entre chaves duplas é trocado pelos dados
            da ordem no envio — mexa nas palavras à vontade, mas preserve as chaves.</span>
          </div>
          <div class="grade g-2">
            ${dados.modelosMensagem.map(mm => html`
              <${Cartao} key=${mm.id}>
                <div class="cartao-topo"><div>
                  <h4>${mm.nome}</h4>
                  <p class="silencioso">${mm.gatilho}</p>
                </div><${Icone} nome="mensagem" tam=${16} cor="var(--tinta-3)" /></div>
                <textarea class="entrada" style="min-height:104px" value=${mm.texto}
                  onInput=${e => acoes.editarModelo(mm.id, e.target.value)}></textarea>
                <button class="btn btn-neutro btn-p" style="margin-top:10px"
                  onClick=${() => copiarE(mm.texto, avisar, 'Modelo copiado.')}>
                  <${Icone} nome="arquivo" tam=${13} />Copiar modelo</button>
              <//>`)}
          </div>
        </div>` : null}
    </div>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   AJUSTES
   ══════════════════════════════════════════════════════════════════════════ */
function TelaAjustes() {
  const { dados, acoes, papel, setPapel, tema, setTema, modo, avisar, medida } = usar();
  const [aba, setAba] = useState('identidade');
  const [novoUsuario, setNovoUsuario] = useState(null);
  const [excluirUsuario, setExcluirUsuario] = useState(null);
  const usuarioAtual = dados.usuarios.find(u => u.papel === papel && u.ativo) || dados.usuarios[0];
  const of = dados.oficina;
  const gestor = PAPEIS[papel].gestao;

  const enviarLogo = (e) => {
    const arq = e.target.files?.[0];
    if (!arq) return;
    if (arq.size > 400 * 1024) { avisar('Escolha uma imagem de até 400 KB.'); return; }
    const leitor = new FileReader();
    /* AUDITORIA: os outros dois usos de FileReader no arquivo tratam a falha;
       este não. Arquivo ilegível não virava logotipo nem mensagem — só
       silêncio, e a pessoa tentando de novo sem saber o que houve. */
    leitor.onerror = () => avisar(MENSAGENS_ERRO.arquivo);
    leitor.onload = () => {
      /* O navegador declara o tipo pelo nome do arquivo; conferir o conteúdo
         lido evita guardar qualquer outra coisa no lugar do logotipo. */
      const url = imagemSegura(leitor.result);
      if (!url) { avisar('Não reconheci esse arquivo como imagem. Envie PNG, JPG ou SVG.'); return; }
      acoes.editarOficina({ logo: url }, 'Logotipo atualizado');
      avisar('Logotipo atualizado.');
    };
    leitor.readAsDataURL(arq);
  };

  const ABAS = [{ id:'identidade', nome:'Identidade' }, { id:'modulos', nome:'Módulos' },
                { id:'usuarios', nome:'Usuários' },
                { id:'acesso', nome:'Permissões' }, { id:'backup', nome:'Backup e segurança' },
                { id:'sistema', nome:'Sistema' }];

  return html`
    <div style="display:flex;flex-direction:column;gap:16px" class="entra">
      <${Abas} itens=${ABAS} ativa=${aba} aoTrocar=${setAba} />

      ${aba === 'identidade' ? html`
        <div class="grade g-2">
          <${Cartao}>
            <div class="cartao-topo"><div><h3>Marca da oficina</h3>
              <p class="silencioso">Aparece na barra lateral, no orçamento e na ordem impressa</p></div></div>
            <div style="display:flex;flex-direction:column;gap:14px">
              <${Campo} rotulo="Logotipo" ajuda="PNG ou SVG com fundo transparente, até 400 KB">
                <label class="alvo-logo">
                  ${of.logo ? html`<img src=${of.logo} alt="Logotipo da oficina" />`
                            : html`<span style="display:flex;align-items:center;gap:8px"><${Icone} nome="camera" tam=${17} />Escolher arquivo</span>`}
                  <input type="file" accept="image/*" style="display:none" onChange=${enviarLogo} disabled=${!gestor} />
                </label>
              <//>
              ${of.logo ? html`<button class="btn btn-neutro btn-p" onClick=${() => acoes.editarOficina({ logo:null }, 'Logotipo removido')}>
                <${Icone} nome="lixo" tam=${13} />Remover logotipo</button>` : null}

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <${Campo} rotulo="Cor de destaque" ajuda="Botões e indicadores">
                  <div class="escolher-cor">
                    <input type="color" value=${of.cor} disabled=${!gestor}
                      onInput=${e => acoes.editarOficina({ cor: e.target.value }, 'Cor de destaque alterada')} />
                    <span class="mono" style="font-size:12.5px">${of.cor}</span>
                  </div>
                <//>
                <${Campo} rotulo="Cor da barra lateral" ajuda="A presença institucional">
                  <div class="escolher-cor">
                    <input type="color" value=${of.corBarra} disabled=${!gestor}
                      onInput=${e => acoes.editarOficina({ corBarra: e.target.value }, 'Cor da barra alterada')} />
                    <span class="mono" style="font-size:12.5px">${of.corBarra}</span>
                  </div>
                <//>
              </div>
              <p class="silencioso">Os demais tons são derivados dessas duas. Pedir cinco cores garantiria combinação ruim.</p>
              ${gestor ? html`<button class="btn btn-neutro btn-p"
                onClick=${() => acoes.editarOficina({ cor:OFICINA_PADRAO.cor, corBarra:OFICINA_PADRAO.corBarra }, 'Cores restauradas')}>
                Voltar às cores originais</button>` : null}
            </div>
          <//>

          <${Cartao}>
            <div class="cartao-topo"><div><h3>Dados cadastrais</h3>
              <p class="silencioso">Saem no orçamento enviado ao cliente</p></div></div>
            <div style="display:flex;flex-direction:column;gap:12px">
              <${Campo} rotulo="Nome">
                <input class="entrada" value=${of.nome} disabled=${!gestor}
                  onInput=${e => acoes.editarOficina({ nome: e.target.value }, 'Nome alterado')} />
              <//>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                <${Campo} rotulo="CNPJ">
                  <input class="entrada mono" value=${of.documento} disabled=${!gestor}
                    onInput=${e => acoes.editarOficina({ documento: e.target.value }, 'CNPJ alterado')} />
                <//>
                <${Campo} rotulo="Telefone" ajuda=${of.telefone && !telValido(of.telefone) ? 'Faltam dígitos' : 'Aparece no orçamento e no link do cliente'}>
                  <input class="entrada mono" inputmode="tel" placeholder="(11) 90000-0000"
                    maxlength="16" value=${mascararTel(of.telefone)} disabled=${!gestor}
                    aria-invalid=${Boolean(of.telefone && !telValido(of.telefone))}
                    onInput=${e => acoes.editarOficina({ telefone: telNacional(e.target.value) }, 'Telefone alterado')} />
                <//>
              </div>
              <${Campo} rotulo="E-mail">
                <input class="entrada" value=${of.email} disabled=${!gestor}
                  onInput=${e => acoes.editarOficina({ email: e.target.value }, 'E-mail alterado')} />
              <//>
              <${Campo} rotulo="Endereço">
                <input class="entrada" value=${of.endereco} disabled=${!gestor}
                  onInput=${e => acoes.editarOficina({ endereco: e.target.value }, 'Endereço alterado')} />
              <//>
            </div>
            ${!gestor ? html`<div class="aviso aviso-info" style="margin-top:12px"><${Icone} nome="alerta" tam=${15} />
              <span>Só dono e gerente alteram os dados da oficina. Toda mudança fica registrada na auditoria.</span></div>` : null}
          <//>

          ${/* FASE 17 · esta é a única fonte do contato que o cliente lê: o
               cabeçalho do orçamento, o da ordem impressa, o PDF do WhatsApp e
               o link do portal saem todos daqui. Não havia lugar nenhum onde
               a oficina pudesse CONFERIR isso antes de mandar — só descobria
               pelo cliente. Agora confere no mesmo lugar em que edita. */ ''}
          <${Cartao}>
            <div class="cartao-topo"><div><h3>O que o cliente vê</h3>
              <p class="silencioso">Exatamente o cabeçalho que sai no orçamento, no PDF e no link</p></div></div>

            <div style="border:1px solid var(--linha);border-radius:var(--raio);padding:14px;background:#fff;color:#101828">
              <div style="display:flex;align-items:center;gap:11px">
                ${of.logo ? html`<img src=${of.logo} alt="" style="max-height:38px;max-width:64px;object-fit:contain" />` : null}
                <div style="min-width:0">
                  <div style="font-size:15px;font-weight:700;line-height:1.2">${of.nome || '—'}</div>
                  <div style="font-size:10.5px;color:#4A5468;margin-top:3px">
                    ${of.documento ? 'CNPJ ' + fmtDoc(of.documento) : ''}${of.telefone ? (of.documento ? ' · ' : '') + fmtTel(of.telefone) : ''}
                  </div>
                  <div style="font-size:10.5px;color:#4A5468">${of.endereco || ''}</div>
                </div>
              </div>
            </div>

            ${(() => {
              const faltas = [];
              if (!String(of.nome || '').trim() || of.nome === OFICINA_PADRAO.nome)
                faltas.push('O nome ainda é o de fábrica — o cliente vai receber um orçamento sem a sua marca.');
              if (!String(of.telefone || '').trim())
                faltas.push('Sem telefone: o cliente não tem como responder ao orçamento.');
              else if (!telValido(of.telefone))
                faltas.push('O telefone está incompleto e vai sair errado no documento.');
              if (!String(of.endereco || '').trim())
                faltas.push('Sem endereço: o documento sai sem onde o carro está.');
              if (!faltas.length) return html`
                <div class="aviso aviso-ok" style="margin-top:12px"><${Icone} nome="check" tam=${16} />
                  <span>Contato completo. É este o telefone que o cliente vai ver e usar para responder.</span></div>`;
              return html`
                <div class="aviso aviso-alerta" style="margin-top:12px"><${Icone} nome="alerta" tam=${16} />
                  <div><b>Confira antes de enviar orçamento.</b>
                    <ul class="consequencias" style="margin-top:6px">
                      ${faltas.map(f => html`<li key=${f}>${f}</li>`)}
                    </ul></div></div>`;
            })()}

            <p class="silencioso" style="margin-top:12px;line-height:1.5">
              Se o telefone acima não for o da oficina, corrija no cartão ao lado: ele é o único
              contato que sai para o cliente, em todos os documentos e no link. A alteração vai
              para o servidor na hora — se algo impedir, aparece a faixa vermelha no topo.
            </p>
          <//>
        </div>` : null}

      ${aba === 'modulos' ? html`<${PainelModulos} />` : null}

      ${excluirUsuario ? html`<${ConfirmarExclusao} tipo="usuario" id=${excluirUsuario.id} rotulo="usuário"
        nome=${excluirUsuario.nome}
        descricao="O acesso é removido da lista. A trilha de auditoria continua guardando o que essa pessoa fez."
        aoFechar=${() => setExcluirUsuario(null)} aoConfirmar=${() => acoes.excluirUsuario(excluirUsuario.id)} />` : null}

      ${aba === 'usuarios' ? html`
        <div style="display:flex;flex-direction:column;gap:14px">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
            <p class="silencioso">${dados.usuarios.filter(u => u.ativo).length} ativos de ${dados.usuarios.length} cadastrados</p>
            ${gestor ? html`<button class="btn btn-primario" onClick=${() => setNovoUsuario({ nome:'', email:'', papel:'mecanico' })}>
              <${Icone} nome="mais" tam=${15} />Novo usuário</button>` : null}
          </div>
          <${Cartao} nu>
            <div class="rolagem">
              <table class="tabela">
                <thead><tr><th>Pessoa</th><th>E-mail</th><th>Papel</th><th>Desde</th><th class="dir">Acesso</th></tr></thead>
                <tbody>
                  ${dados.usuarios.map(u => html`
                    <tr key=${u.id} style=${u.ativo ? '' : 'opacity:.55'}>
                      <td><div style="display:flex;align-items:center;gap:10px">
                        <span class="avatar" style="width:32px;height:32px;font-size:11.5px">${iniciais(u.nome)}</span>
                        <span style="font-size:13.5px;font-weight:500">${u.nome}</span>
                      </div></td>
                      <td class="secundario" style="font-size:12.5px">${u.email}</td>
                      <td>
                        ${gestor ? html`
                          <select class="entrada" style="height:32px;font-size:12.5px;max-width:140px" value=${u.papel}
                            onInput=${e => acoes.editarUsuario(u.id, { papel: e.target.value }, u.nome, 'Papel alterado para ' + PAPEIS[e.target.value].nome)}>
                            ${Object.entries(PAPEIS).map(([id, pp]) => html`<option key=${id} value=${id}>${pp.nome}</option>`)}
                          </select>`
                        : html`<${Selo}>${PAPEIS[u.papel].nome}<//>`}
                      </td>
                      <td class="mono silencioso" style="font-size:12px">${fmtData(u.desde)}</td>
                      <td class="dir">
                        <span style="display:inline-flex;align-items:center;gap:10px;justify-content:flex-end">
                          ${gestor
                            ? html`<${Interruptor} ligado=${u.ativo} rotulo=${'Acesso de ' + u.nome}
                                aoTrocar=${() => acoes.editarUsuario(u.id, { ativo: !u.ativo }, u.nome, u.ativo ? 'Acesso desativado' : 'Acesso reativado')} />`
                            : html`<${Selo} tom=${u.ativo ? 'ok' : ''}>${u.ativo ? 'Ativo' : 'Inativo'}<//>`}
                          ${/* Nunca sobre a própria conta: quem apaga o próprio acesso
                               fica de fora do sistema sem ter como voltar. */ ''}
                          ${u.id !== usuarioAtual?.id
                            ? html`<${AcoesLinha} nome=${u.nome} aoExcluir=${() => setExcluirUsuario(u)} />` : null}
                        </span>
                      </td>
                    </tr>`)}
                </tbody>
              </table>
            </div>
          <//>
          ${novoUsuario ? html`
            <${Modal} titulo="Novo usuário" aoFechar=${() => setNovoUsuario(null)}
              rodape=${html`<button class="btn btn-neutro" onClick=${() => setNovoUsuario(null)}>Cancelar</button>
                <button class="btn btn-primario" disabled=${!novoUsuario.nome.trim() || !novoUsuario.email.trim()}
                  onClick=${() => { acoes.criarUsuario(novoUsuario); avisar(novoUsuario.nome + ' adicionado à equipe.'); setNovoUsuario(null); }}>
                  Adicionar</button>`}>
              <${Campo} rotulo="Nome completo">
                <input class="entrada" value=${novoUsuario.nome} onInput=${e => setNovoUsuario(u => ({ ...u, nome: e.target.value }))} />
              <//>
              <${Campo} rotulo="E-mail" ajuda="É por onde a pessoa vai entrar no sistema">
                <input class="entrada" type="email" value=${novoUsuario.email} onInput=${e => setNovoUsuario(u => ({ ...u, email: e.target.value }))} />
              <//>
              <${Campo} rotulo="Papel" ajuda="Define o que essa pessoa enxerga">
                <select class="entrada" value=${novoUsuario.papel} onInput=${e => setNovoUsuario(u => ({ ...u, papel: e.target.value }))}>
                  ${Object.entries(PAPEIS).map(([id, pp]) => html`<option key=${id} value=${id}>${pp.nome}</option>`)}
                </select>
              <//>
            <//>` : null}
        </div>` : null}

      ${aba === 'acesso' ? html`
        <div style="display:flex;flex-direction:column;gap:14px">
          <${Cartao}>
            <div class="cartao-topo"><div><h3>O que cada papel enxerga</h3>
              <p class="silencioso">No sistema conectado isso é aplicado pelo banco, não pela interface</p></div></div>
            <div class="rolagem">
              <table class="tabela">
                <thead><tr><th>Capacidade</th>${Object.entries(PAPEIS).map(([id, pp]) => html`<th key=${id} class="dir">${pp.nome}</th>`)}</tr></thead>
                <tbody>
                  ${CAPACIDADES.map(([chave, rot]) => html`
                    <tr key=${chave}>
                      <td style="font-size:13.5px;font-weight:500">${rot}</td>
                      ${Object.entries(PAPEIS).map(([id, pp]) => html`
                        <td key=${id} class="dir">
                          ${pode(id, chave) ? html`<${Icone} nome="check" tam=${16} cor="var(--ok)" />`
                            : (chave === 'financeiro' && pp.pode.includes('financeiro_parcial')) ? html`<${Selo} tom="alerta">Parcial<//>`
                            : html`<${Icone} nome="x" tam=${15} cor="var(--tinta-3)" />`}
                        </td>`)}
                    </tr>`)}
                </tbody>
              </table>
            </div>
            <div style="margin-top:14px">
              ${Object.entries(PAPEIS).map(([id, pp]) => html`
                <div key=${id} class="chave-valor">
                  <span style="font-weight:500">${pp.nome}</span>
                  <span class="silencioso" style="text-align:right;max-width:62%">${pp.descricao}</span>
                </div>`)}
            </div>
          <//>
          <${Cartao}>
            <h3 style="margin-bottom:4px">Ver o sistema como</h3>
            <p class="silencioso" style="margin-bottom:14px">Recurso de demonstração. Conectado ao banco, o papel vem da sua conta e não pode ser trocado aqui.</p>
            <div class="filtros">
              ${Object.entries(PAPEIS).map(([id, pp]) => html`
                <button key=${id} class="filtro" aria-pressed=${papel === id} onClick=${() => setPapel(id)}>${pp.nome}</button>`)}
            </div>
          <//>
        </div>` : null}

      ${aba === 'backup' ? html`<${PainelBackup} />` : null}

      ${aba === 'sistema' ? html`
        <div style="display:flex;flex-direction:column;gap:16px">
        <${PainelDiagnostico} />
        <div class="grade g-2">
          <${Cartao}>
            <h3 style="margin-bottom:4px">Conexão</h3>
            <p class="silencioso" style="margin-bottom:14px">De onde o sistema lê e grava os dados.</p>
            ${modo === 'demo'
              ? html`<div class="aviso aviso-alerta"><${Icone} nome="alerta" tam=${16} />
                  <div><strong>Modo demonstração.</strong> Dados fictícios; ao recarregar, tudo volta ao início.
                  Para conectar, preencha <code class="mono">SUPABASE_URL</code> e <code class="mono">SUPABASE_ANON_KEY</code> no topo deste arquivo.</div></div>`
              : html`<div class="aviso aviso-ok"><${Icone} nome="check" tam=${16} />
                  <span>Conectado ao Supabase. Toda gravação passa pelas políticas de RLS do banco.</span></div>`}
          <//>
          <${Cartao}>
            <h3 style="margin-bottom:4px">Assistente</h3>
            <p class="silencioso" style="margin-bottom:14px">Como as respostas são produzidas.</p>
            <div class="aviso aviso-info"><${Icone} nome="faisca" tam=${16} />
              <span>O assistente calcula cada número a partir dos seus dados — ele não estima nem inventa.
              Para perguntas abertas há um encaixe pronto para um modelo de linguagem, que precisa rodar
              numa função do servidor: chave de API dentro deste arquivo ficaria visível para qualquer um.</span></div>
          <//>
          <${Cartao}>
            <h3 style="margin-bottom:4px">Desempenho medido</h3>
            <p class="silencioso" style="margin-bottom:14px">Tempo real gasto no último recálculo, nesta máquina.</p>
            <${ChaveValor} chave="Métricas e agregações" valor=${(medida?.current?.metricas || 0).toFixed(1) + ' ms'} forte />
            <${ChaveValor} chave="Motor de análise" valor=${(medida?.current?.analise || 0).toFixed(1) + ' ms'} />
            <${ChaveValor} chave="Registros em memória" valor=${inteiro(TABELAS.reduce((t, x) => t + (dados[x] || []).length, 0))} />
            <${ChaveValor} chave="Listas longas" valor="Paginadas de 40 em 40" />
            <${ChaveValor} chave="Campos de busca" valor="Refiltram 260 ms após a digitação" />
          <//>

          <${Cartao}>
            <h3 style="margin-bottom:4px">Regras de negócio</h3>
            <p class="silencioso" style="margin-bottom:14px">Valem para todo o sistema. Definidas no topo do arquivo.</p>
            <${ChaveValor} chave="Piso de margem" valor=${PISO_MARGEM + '%'} forte />
            <${ChaveValor} chave="Validade do orçamento" valor=${VALIDADE_PADRAO + ' dias'} />
            <${ChaveValor} chave="Cliente vira inativo em" valor=${Math.round(DIAS_INATIVO / 30) + ' meses'} />
            <${ChaveValor} chave="Serviços com intervalo definido" valor=${INTERVALOS.length} />
          <//>
          <${Cartao}>
            <h3 style="margin-bottom:4px">Aparência</h3>
            <p class="silencioso" style="margin-bottom:14px">O tema claro é o padrão porque o galpão tem luz demais para telas escuras.</p>
            <div class="filtros">
              ${[['claro','Claro'],['escuro','Escuro']].map(([id, nome]) => html`
                <button key=${id} class="filtro" aria-pressed=${tema === id} onClick=${() => setTema(id)}>${nome}</button>`)}
            </div>
          <//>
        </div>
        </div>` : null}
    </div>`;
}

const TelaEmConstrucao = ({ nome }) => html`
  <${Cartao}><${Vazio} icone="relogio" titulo=${nome + ' entra na próxima fase'}
    apoio="Painel, pátio, ordens, cadastros, estoque, financeiro, relatórios e automações já operam." /><//>`;

/* Preço de tabela de um pacote: alimenta a receita potencial da preventiva. */
const valorDoServico = (nome) => {
  const m = MODELOS_SERVICO.find(x => x.nome === nome);
  if (!m) return 0;
  return m.mo + m.pecas.reduce((s, [cod, q]) => s + (pecaPorCodigo(cod)?.preco_venda || 0) * q, 0);
};

/* ══════════════════════════════════════════════════════════════════════════
   ASSISTENTE — a conversa
   ══════════════════════════════════════════════════════════════════════════ */
function BolhaResposta({ r }) {
  const { irPara } = usar();
  return html`
    <div class="bolha ia">
      <p>${r.resumo}</p>
      ${r.linhas && r.linhas.length ? html`
        <div style="margin-top:11px">
          ${r.linhas.map((l, i) => html`
            <div key=${i} class="dado-linha">
              <span style="min-width:0">
                <span class="destaque" style="display:block">${l.titulo}</span>
                ${l.apoio ? html`<span class="silencioso" style="font-size:11.5px">${l.apoio}</span>` : null}
              </span>
              <span class="mono" style="font-weight:600;white-space:nowrap">${l.valor}</span>
            </div>`)}
        </div>` : null}
      ${r.acao ? html`
        <button class="btn btn-neutro btn-p" style="margin-top:11px" onClick=${() => irPara(r.acao.ir)}>
          ${r.acao.rotulo}<${Icone} nome="seta" tam=${13} /></button>` : null}
    </div>`;
}

function GavetaAssistente({ aoFechar }) {
  const { dados, metricas, achados } = usar();
  const [texto, setTexto] = useState('');
  const [pensando, setPensando] = useState(false);
  const fim = useRef(null);
  const caixaGaveta = useRef(null);
  usarFocoPreso(caixaGaveta);
  /* Relógio da resposta com dono: fechar a gaveta antes dele disparar cancela. */
  const relogioResposta = useRef(null);
  useEffect(() => () => clearTimeout(relogioResposta.current), []);
  const [msgs, setMsgs] = useState(() => {
    const critico = achados.find(a => a.gravidade === 'critico') || achados[0];
    return [{ id: 'ini', de: 'ia', resposta: {
      resumo: 'Oi, Lucas. Eu leio os dados da oficina e respondo em números — nada aqui é estimativa.' +
        (critico ? ' O ponto mais urgente de hoje: ' + critico.titulo.toLowerCase() + '.' : ' Hoje não há nada crítico em aberto.'),
      sugestoes: SUGESTOES.slice(0, 5),
    } }];
  });

  useEffect(() => { fim.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [msgs, pensando]);

  const enviar = (pergunta) => {
    const q = String(pergunta || '').trim();
    if (!q || pensando) return;
    setMsgs(m => [...m, { id: novoId(), de: 'eu', texto: q }]);
    setTexto('');
    setPensando(true);
    // Pausa curta só para a resposta não aparecer antes da pergunta na tela.
    /* AUDITORIA: o relógio ficava solto. Fechar a gaveta dentro dos 320ms
       deixava a closure viva escrevendo estado em componente desmontado. */
    clearTimeout(relogioResposta.current);
    relogioResposta.current = setTimeout(() => {
      setMsgs(m => [...m, { id: novoId(), de: 'ia', resposta: responder(q, dados, metricas) }]);
      setPensando(false);
    }, 320);
  };

  const ultima = msgs[msgs.length - 1];
  const chips = ultima?.de === 'ia' ? ultima.resposta?.sugestoes : null;

  return html`
    <div class="gaveta-fundo" onClick=${e => { if (e.target === e.currentTarget) aoFechar(); }}>
      <aside class="gaveta" ref=${caixaGaveta} role="dialog" aria-modal="true" aria-label="Assistente da oficina">
        <div class="gaveta-topo">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="width:32px;height:32px;border-radius:9px;background:var(--roxo-fundo);color:var(--roxo);display:flex;align-items:center;justify-content:center">
              <${Icone} nome="faisca" tam=${17} /></span>
            <div>
              <h2>Assistente</h2>
              <p class="silencioso">Responde com os números da sua oficina</p>
            </div>
          </div>
          <button class="btn btn-fantasma btn-icone" onClick=${aoFechar} aria-label="Fechar"><${Icone} nome="x" /></button>
        </div>

        <div class="conversa">
          ${msgs.map(m => m.de === 'eu'
            ? html`<div key=${m.id} class="bolha eu">${m.texto}</div>`
            : html`<${BolhaResposta} key=${m.id} r=${m.resposta} />`)}
          ${pensando ? html`
            <div class="bolha ia" style="width:auto;padding:0">
              <div class="digitando" aria-label="Consultando os dados"><i></i><i></i><i></i></div>
            </div>` : null}
          <div ref=${fim}></div>
        </div>

        ${chips && chips.length ? html`
          <div class="sugestoes">
            ${chips.map(q => html`<button key=${q} class="sugestao" onClick=${() => enviar(q)}>${q}</button>`)}
          </div>` : null}

        <div class="compositor">
          <input class="entrada" value=${texto} placeholder="Pergunte com suas palavras" aria-label="Sua pergunta"
            onInput=${e => setTexto(e.target.value)} onKeyDown=${e => { if (e.key === 'Enter') enviar(texto); }} />
          <button class="btn btn-primario btn-icone" onClick=${() => enviar(texto)} disabled=${!texto.trim() || pensando} aria-label="Enviar">
            <${Icone} nome="seta" tam=${16} /></button>
        </div>
      </aside>
    </div>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   RECOMENDAÇÕES — cartão reutilizável
   ══════════════════════════════════════════════════════════════════════════ */
function CartaoRecomendacoes({ veiculo, aoAdicionar, titulo = 'Sugestões para este veículo' }) {
  const { metricas } = usar();
  const recs = useMemo(() => recomendar(veiculo, metricas.padroes), [veiculo, metricas]);
  if (!veiculo) return null;
  return html`
    <${Cartao}>
      <div class="cartao-topo"><div>
        <h3>${titulo}</h3>
        <p class="silencioso">Auxílio, não obrigação — cada sugestão diz de onde saiu.</p>
      </div></div>
      ${recs.length === 0
        ? html`<p class="silencioso">Nada a sugerir agora. Este veículo está em dia com os intervalos.</p>`
        : html`<div style="display:flex;flex-direction:column;gap:8px">
            ${recs.map(r => html`
              <div key=${r.id} class="recomendacao">
                <span class=${'marca-rec' + (r.forca === 'alta' ? ' alta' : '')}>
                  <${Icone} nome=${r.forca === 'alta' ? 'alerta' : 'faisca'} tam=${14} /></span>
                <div style="flex:1;min-width:0">
                  <div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap">
                    <span style="font-size:13px;font-weight:600">${r.titulo}</span>
                    ${valorDoServico(r.servico) > 0 ? html`<span class="mono" style="font-size:12px;color:var(--tinta-3)">≈ ${brlBruto(valorDoServico(r.servico))}</span>` : null}
                  </div>
                  <p class="silencioso" style="margin-top:3px;line-height:1.45">${r.motivo}</p>
                  <p class="base-amostra" style="margin-top:4px">${r.base}</p>
                  ${aoAdicionar && MODELOS_SERVICO.some(m => m.nome === r.servico) ? html`
                    <button class="btn btn-neutro btn-p" style="margin-top:8px" onClick=${() => aoAdicionar(r.servico)}>
                      <${Icone} nome="mais" tam=${13} />Incluir no orçamento</button>` : null}
                </div>
              </div>`)}
          </div>`}
    <//>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   MANUTENÇÃO PREVENTIVA
   ══════════════════════════════════════════════════════════════════════════ */
function TelaPreventiva() {
  const { metricas, abrirVeiculo, abrirCliente, irPara } = usar();
  const [filtro, setFiltro] = useState('todos');
  const [busca, setBusca] = useState('');
  const buscaLenta = useAtraso(busca);
  const m = metricas;

  const lista = useMemo(() => {
    const q = buscaLenta.trim().toLowerCase();
    return m.preventiva
      .filter(v => filtro === 'vencidos' ? v.vencidos.length
        : filtro === 'proximos' ? (!v.vencidos.length && v.proximos.length)
        : filtro === 'confirmar' ? (!v.vencidos.length && !v.proximos.length && v.semRegistro.length) : true)
      .filter(v => !q || [v.placa, v.marca, v.modelo, v.cliente?.nome].some(x => String(x || '').toLowerCase().includes(q)));
  }, [m, filtro, buscaLenta]);

  const comVencido = m.preventiva.filter(v => v.vencidos.length);
  const potencial = m.preventiva.reduce((s, v) =>
    s + [...v.vencidos, ...v.proximos].reduce((t, i) => t + valorDoServico(i.servico), 0), 0);

  return html`
    <div style="display:flex;flex-direction:column;gap:14px" class="entra">
      <div class="grade g-4">
        <${Indicador} rotulo="Vencidos" valor=${comVencido.length} acento=${comVencido.length ? 'var(--alerta)' : 'var(--ok)'}
          apoio="Com execução registrada aqui e intervalo estourado" />
        <${Indicador} rotulo="Vencem em 45 dias" valor=${m.preventiva.filter(v => !v.vencidos.length && v.proximos.length).length}
          apoio="Previsão pelo ritmo real de cada carro" />
        <${Indicador} rotulo="A confirmar" valor=${m.preventiva.filter(v => !v.vencidos.length && !v.proximos.length && v.semRegistro.length).length}
          apoio="Sem registro do serviço aqui — perguntar ao cliente" />
        <${Indicador} rotulo="Receita potencial" valor=${brlCurto(potencial)} acento="var(--azul-acao)"
          apoio="Se os serviços previstos forem feitos aqui" />
      </div>

      <div class="aviso aviso-info">
        <${Icone} nome="faisca" tam=${16} />
        <span>A previsão cruza o intervalo do serviço, a data e a quilometragem da última execução e quantos km
        aquele carro roda por mês de verdade — um carro de frota que faz 3.000 km/mês é avisado antes de um que faz 600.
        Quando o serviço nunca passou por aqui, o sistema não afirma que venceu: marca como <strong>a confirmar</strong>,
        porque o cliente pode ter feito em outro lugar.</span>
      </div>

      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <div class="busca">
          <${Icone} nome="busca" tam=${15} cor="var(--tinta-3)" />
          <input value=${busca} onInput=${e => setBusca(e.target.value)} placeholder="Placa, modelo ou dono" aria-label="Buscar veículos" />
        </div>
        <div class="filtros">
          ${[['todos','Todos'],['vencidos','Vencidos'],['proximos','Vencem em breve'],['confirmar','A confirmar']].map(([id, nome]) => html`
            <button key=${id} class="filtro" aria-pressed=${filtro === id} onClick=${() => setFiltro(id)}>${nome}</button>`)}
        </div>
      </div>

      ${lista.length === 0
        ? html`<${Cartao}><${Vazio} icone="check" titulo="Nenhum veículo nesta faixa"
            apoio="Troque o filtro ou aguarde — a previsão se move sozinha conforme a quilometragem entra nas ordens." /><//>`
        : html`<div class="grade g-2">
            ${lista.map(v => html`
              <${Cartao} key=${v.id}>
                <div style="display:flex;align-items:center;gap:12px;margin-bottom:13px">
                  <${Placa} valor=${v.placa} />
                  <div style="flex:1;min-width:0">
                    <button onClick=${() => abrirVeiculo(v.id)} style="font-size:14px;font-weight:600;text-align:left;color:var(--tinta)">
                      ${v.marca} ${v.modelo}</button>
                    <button onClick=${() => abrirCliente(v.cliente_id)} class="silencioso corta" style="display:block;text-align:left">
                      ${v.cliente?.nome} · ${fmtTel(v.cliente?.telefone)}</button>
                  </div>
                  ${v.vencidos.length
                    ? html`<${Selo} tom="alerta" icone="alerta">${v.vencidos.length} vencido${v.vencidos.length > 1 ? 's' : ''}<//>`
                    : v.proximos.length ? html`<${Selo} tom="info" icone="relogio">Em breve<//>`
                    : html`<${Selo} icone="alerta">A confirmar<//>`}
                </div>
                <div class="silencioso" style="margin-bottom:9px">
                  ${inteiro(v.km_atual)} km · roda cerca de ${inteiro(Math.round(v.plano.kmDia * 30))} km por mês
                </div>
                <div>
                  ${[...v.vencidos, ...v.proximos, ...v.semRegistro].slice(0, 4).map(i => html`
                    <div key=${i.servico} class="item-prev">
                      <div style="flex:1;min-width:0">
                        <div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px">
                          <span style="font-size:13px;font-weight:500">${i.servico}</span>
                          <span class="mono" style=${'font-size:12px;font-weight:600;color:' + (i.situacao === 'vencido' ? 'var(--alerta)' : 'var(--tinta-3)')}>
                            ${i.situacao === 'vencido' ? '+' + inteiro(Math.abs(i.kmFalta)) + ' km'
                              : i.situacao === 'proximo' ? 'em ' + i.diasFalta + 'd' : 'a confirmar'}</span>
                        </div>
                        <div class="medidor" style="margin-top:5px">
                          <i style=${'width:' + Math.min(100, i.progresso) + '%;background:' + (i.situacao === 'vencido' ? 'var(--alerta)' : i.situacao === 'proximo' ? 'var(--ciano)' : 'var(--linha)')}></i>
                        </div>
                        <div class="silencioso" style="margin-top:4px;font-size:11.5px">
                          Intervalo de ${inteiro(i.intervaloKm)} km · ${i.nunca
                            ? 'nunca feito aqui — o carro rodou ' + inteiro(i.kmDesde) + ' km desde a primeira visita'
                            : 'última em ' + fmtData(i.baseData) + ', com ' + inteiro(i.baseKm) + ' km'}
                        </div>
                      </div>
                    </div>`)}
                </div>
                <div style="display:flex;gap:8px;margin-top:13px">
                  <a class="btn btn-neutro btn-p" style="flex:1" href=${'tel:' + digitos(v.cliente?.telefone)}>
                    <${Icone} nome="telefone" tam=${13} />Ligar</a>
                  <button class="btn btn-primario btn-p" style="flex:1" onClick=${() => irPara('nova')}>
                    <${Icone} nome="mais" tam=${13} />Abrir ordem</button>
                </div>
              <//>`)}
          </div>`}
    </div>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   AUDITORIA
   ══════════════════════════════════════════════════════════════════════════ */
function TelaAuditoria() {
  const { dados, papel } = usar();
  const [busca, setBusca] = useState('');
  const buscaLenta = useAtraso(busca);
  const [quem, setQuem] = useState('todos');
  if (!PAPEIS[papel].gestao) return html`<${Cartao}><${Vazio} icone="arquivo" titulo="Auditoria restrita"
    apoio="Só dono e gerente consultam o registro de alterações." /><//>`;

  const pessoas = [...new Set(dados.auditoria.map(a => a.usuario))];
  const lista = dados.auditoria
    .filter(a => quem === 'todos' || a.usuario === quem)
    .filter(a => { const q = buscaLenta.trim().toLowerCase();
      return !q || [a.usuario, a.alvo, a.detalhe, ACOES_AUDITAVEIS[a.acao]?.rotulo].some(x => String(x || '').toLowerCase().includes(q)); });
  const pagina = usePagina(lista, 40);

  const hoje = dados.auditoria.filter(a => diasDesde(a.criado_em) < 1).length;
  const sensiveis = dados.auditoria.filter(a => ['os_valor','usuario','oficina'].includes(a.acao)).length;

  return html`
    <div style="display:flex;flex-direction:column;gap:14px" class="entra">
      <div class="grade g-3">
        <${Indicador} rotulo="Registros no total" valor=${dados.auditoria.length} apoio="Desde o início da operação" />
        <${Indicador} rotulo="Nas últimas 24 horas" valor=${hoje} apoio="Movimentação recente da equipe" />
        <${Indicador} rotulo="Ações sensíveis" valor=${sensiveis} acento=${sensiveis ? 'var(--alerta)' : ''}
          apoio="Valor de ordem, usuários e dados da oficina" />
      </div>

      <div class="aviso aviso-info">
        <${Icone} nome="alerta" tam=${16} />
        <span>Nesta demonstração o registro vive na memória do navegador. Conectado ao Supabase, ele vira tabela
        com escrita por trigger — nem o dono consegue apagar linha, que é o que faz uma auditoria valer alguma coisa.</span>
      </div>

      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <div class="busca">
          <${Icone} nome="busca" tam=${15} cor="var(--tinta-3)" />
          <input value=${busca} onInput=${e => setBusca(e.target.value)} placeholder="Usuário, ação ou alvo" aria-label="Buscar no registro" />
        </div>
        <div class="filtros">
          <button class="filtro" aria-pressed=${quem === 'todos'} onClick=${() => setQuem('todos')}>Todos</button>
          ${pessoas.map(n => html`<button key=${n} class="filtro" aria-pressed=${quem === n} onClick=${() => setQuem(n)}>${n.split(' ')[0]}</button>`)}
        </div>
      </div>

      <${Cartao}>
        ${lista.length === 0
          ? html`<${Vazio} icone="arquivo" titulo="Nada registrado nesta combinação"
              apoio="A trilha guarda cada alteração feita no sistema. Troque o usuário, a ação ou o período para encontrar o que procura." />`
          : pagina.visiveis.map(a => {
              const def = ACOES_AUDITAVEIS[a.acao] || { rotulo: a.acao, icone: 'arquivo', tom: '' };
              const cor = def.tom === 'alerta' ? 'var(--alerta-fundo);color:var(--alerta)'
                : def.tom === 'ok' ? 'var(--ok-fundo);color:var(--ok)'
                : def.tom === 'info' ? 'var(--info-fundo);color:var(--azul-acao)'
                : 'var(--superficie-2);color:var(--tinta-3)';
              return html`
                <div key=${a.id} class="aud">
                  <span class="selo-acao" style=${'background:' + cor}><${Icone} nome=${def.icone} tam=${15} /></span>
                  <div style="min-width:0">
                    <div style="font-size:13.5px">
                      <span style="font-weight:600">${a.usuario}</span>
                      <span class="secundario"> ${def.rotulo.toLowerCase()} </span>
                      <span style="font-weight:500">${a.alvo}</span>
                    </div>
                    <div class="silencioso">${a.detalhe}</div>
                  </div>
                  <div style="text-align:right;white-space:nowrap">
                    <div class="mono" style="font-size:12px">${fmtData(a.criado_em)}</div>
                    <div class="silencioso" style="font-size:11px">
                      ${new Date(a.criado_em).toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' })} · ${PAPEIS[a.papel]?.nome || a.papel}
                    </div>
                  </div>
                </div>`;
            })}
      <//>
    </div>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   CHECKLIST DE ENTRADA
   O que protege a oficina numa discussão de avaria não é a boa memória do
   atendente: é o papel assinado com o desenho do carro marcado.
   ══════════════════════════════════════════════════════════════════════════ */
function MapaAvarias({ avarias = [], aoMarcar, somenteLeitura }) {
  const marcados = new Set(avarias.map(a => a.local));
  return html`
    <svg class="carro-mapa" viewBox="0 0 120 204" role="img" aria-label="Vista superior do veículo para marcar avarias">
      <rect x="16" y="8" width="88" height="188" rx="20" class="contorno" />
      ${ZONAS_CARRO.map(z => html`
        <g key=${z.id}>
          <rect x=${z.x} y=${z.y} width=${z.w} height=${z.h} rx="3"
            class=${'zona' + (marcados.has(z.id) ? ' marcada' : '')}
            style=${somenteLeitura ? 'cursor:default;pointer-events:none' : ''}
            onClick=${() => !somenteLeitura && aoMarcar(z.id)}>
            <title>${z.nome}</title>
          </rect>
          ${z.w >= 30 ? html`<text class="zona-rotulo" x=${z.x + z.w / 2} y=${z.y + z.h / 2 + 2.5}>${z.curto}</text>` : null}
        </g>`)}
      ${ZONAS_CARRO.filter(z => marcados.has(z.id)).map(z => html`
        <circle key=${'m' + z.id} cx=${z.x + z.w / 2} cy=${z.y + z.h / 2} r="4"
          fill="var(--alerta)" stroke="#fff" stroke-width="1.4" />`)}
    </svg>`;
}

function ChecklistEntrada({ valor, aoMudar, veiculo, compacto }) {
  const c = valor || checklistVazio();
  const mudar = (campos) => aoMudar({ ...c, ...campos });
  const marcarZona = (local) => mudar({ avarias: [...c.avarias, { id: novoId(), local, tipo: 'Risco', observacao: '' }] });
  const alternarItem = (item) => mudar({ itens: c.itens.includes(item) ? c.itens.filter(i => i !== item) : [...c.itens, item] });

  return html`
    <div style="display:flex;flex-direction:column;gap:16px">
      <div>
        <span class="rotulo">Nível de combustível</span>
        <div class="combustivel" style="margin-top:7px">
          ${NIVEIS_COMBUSTIVEL.map(n => html`
            <button key=${n} aria-pressed=${c.combustivel === n} onClick=${() => mudar({ combustivel: n })}>${n}</button>`)}
        </div>
      </div>

      <div>
        <span class="rotulo">Itens deixados no veículo</span>
        <p class="silencioso" style="margin:4px 0 8px">Marque o que ficou dentro do carro. É a lista que se confere na entrega.</p>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${ITENS_VEICULO.map(i => html`
            <button key=${i} class="etiqueta" aria-pressed=${c.itens.includes(i)} onClick=${() => alternarItem(i)}>${i}</button>`)}
        </div>
      </div>

      <div>
        <span class="rotulo">Avarias já existentes</span>
        <p class="silencioso" style="margin:4px 0 10px">Toque no lugar do carro. Marcar o que já estava riscado é o que evita a discussão depois.</p>
        <div class=${compacto ? '' : 'grade g-2'} style=${compacto ? '' : 'align-items:start'}>
          <div style="background:var(--superficie-2);border-radius:var(--raio);padding:12px">
            <${MapaAvarias} avarias=${c.avarias} aoMarcar=${marcarZona} />
            <div style="display:flex;flex-wrap:wrap;gap:5px;margin-top:10px;justify-content:center">
              ${OUTROS_LOCAIS.map(l => html`
                <button key=${l} class="etiqueta" style="font-size:11.5px;padding:4px 9px" onClick=${() => marcarZona(l)}>+ ${l}</button>`)}
            </div>
          </div>
          <div>
            ${c.avarias.length === 0
              ? html`<p class="silencioso" style="padding:14px 0">Nenhuma avaria marcada. Se o carro chegou sem nada, deixe assim — isso também é registro.</p>`
              : c.avarias.map(a => html`
                <div key=${a.id} class="linha-item" style="align-items:flex-start">
                  <span class="marca" style="background:var(--alerta-fundo);color:var(--alerta)">
                    <${Icone} nome="alerta" tam=${14} /></span>
                  <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:7px">
                    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                      <span style="font-size:13px;font-weight:600">${localNome(a.local)}</span>
                      <select class="entrada" style="height:28px;font-size:12px;max-width:150px;padding:0 8px"
                        value=${a.tipo} onInput=${e => mudar({ avarias: c.avarias.map(x => x.id === a.id ? { ...x, tipo: e.target.value } : x) })}>
                        ${TIPOS_AVARIA.map(t => html`<option key=${t} value=${t}>${t}</option>`)}
                      </select>
                    </div>
                    <input class="entrada" style="height:32px;font-size:12.5px" placeholder="Descreva: tamanho, lado, se já existia"
                      value=${a.observacao}
                      onInput=${e => mudar({ avarias: c.avarias.map(x => x.id === a.id ? { ...x, observacao: e.target.value } : x) })} />
                  </div>
                  <button class="btn btn-fantasma btn-icone" aria-label="Remover avaria"
                    onClick=${() => mudar({ avarias: c.avarias.filter(x => x.id !== a.id) })}><${Icone} nome="lixo" tam=${14} /></button>
                </div>`)}
          </div>
        </div>
      </div>

      <${Campo} rotulo="Observações da entrada" ajuda="Combinações feitas no balcão, estado geral, o que o cliente pediu para não mexer.">
        <textarea class="entrada" value=${c.observacoes} placeholder="Ex.: cliente pediu para não mexer no rádio; veículo chegou de guincho."
          onInput=${e => mudar({ observacoes: e.target.value })}></textarea>
      <//>
    </div>`;
}

/** Versão só de leitura, usada no detalhe da ordem e nos documentos. */
function ResumoChecklist({ checklist, veiculo, semMapa }) {
  const c = checklist;
  if (!c) return html`<p class="silencioso">Esta ordem foi aberta sem checklist de entrada.</p>`;
  return html`
    <div style="display:flex;flex-direction:column;gap:14px">
      <div class="grade g-3" style="gap:9px">
        ${[['Entrada', c.hora_entrada ? fmtData(c.hora_entrada) + ' às ' + new Date(c.hora_entrada).toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' }) : '—'],
           ['Combustível', c.combustivel || '—'],
           ['Avarias registradas', String((c.avarias || []).length)]].map(([k, v]) => html`
          <div key=${k} style="background:var(--superficie-2);border-radius:var(--raio);padding:11px">
            <div class="rotulo" style="font-size:10px">${k}</div>
            <div style="font-size:13.5px;font-weight:600;margin-top:3px">${v}</div>
          </div>`)}
      </div>
      ${(c.itens || []).length ? html`
        <div>
          <span class="rotulo">Itens deixados no veículo</span>
          <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:7px">
            ${c.itens.map(i => html`<${Selo} key=${i} tom="ciano">${i}<//>`)}
          </div>
        </div>` : null}
      ${(c.avarias || []).length ? html`
        <div class=${semMapa ? '' : 'grade g-2'} style="align-items:start">
          ${!semMapa ? html`<div style="background:var(--superficie-2);border-radius:var(--raio);padding:12px">
            <${MapaAvarias} avarias=${c.avarias} somenteLeitura />
          </div>` : null}
          <div>
            <span class="rotulo">Avarias na entrada</span>
            <div style="margin-top:6px">
              ${c.avarias.map(a => html`
                <div key=${a.id} class="chave-valor" style="align-items:flex-start">
                  <span style="font-weight:500">${localNome(a.local)}</span>
                  <span style="text-align:right;max-width:60%">
                    <span class="selo selo-alerta">${a.tipo}</span>
                    ${a.observacao ? html`<span class="silencioso" style="display:block;margin-top:3px">${a.observacao}</span>` : null}
                  </span>
                </div>`)}
            </div>
          </div>
        </div>` : null}
      ${c.observacoes ? html`
        <div>
          <span class="rotulo">Observações da entrada</span>
          <p class="secundario" style="font-size:13.5px;margin-top:5px">${c.observacoes}</p>
        </div>` : null}
    </div>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   ANEXOS
   No navegador as imagens ficam em memória. Conectado ao banco, elas vão para
   o Storage do Supabase e o backup guarda o caminho, não o binário.
   ══════════════════════════════════════════════════════════════════════════ */
function Anexos({ osId, compacto }) {
  const { dados, acoes, papel, avisar } = usar();
  const [tipo, setTipo] = useState('entrada');
  const [ampliado, setAmpliado] = useState(null);
  const meus = dados.anexos.filter(a => a.os_id === osId);
  const podeEnviar = pode(papel, 'editar');

  return html`
    <div style="display:flex;flex-direction:column;gap:12px">
      ${podeEnviar ? html`
        <div>
          <div class="filtros" style="margin-bottom:9px">
            ${TIPOS_ANEXO.map(t => html`
              <button key=${t.id} class="filtro" aria-pressed=${tipo === t.id} onClick=${() => setTipo(t.id)}>${t.nome}</button>`)}
          </div>
          ${/* Fase 10: arrastar, galeria, câmera e colar, em vez de só clicar. */ ''}
          <${EntradaDeMidia} aceitaPdf aoReceber=${(f) => acoes.anexar({ os_id: osId, tipo, ...f })} />
        </div>` : null}

      ${meus.length === 0
        ? html`<p class="silencioso">Nenhum arquivo anexado a esta ordem.</p>`
        : html`
          <div class="galeria">
            ${meus.map(a => html`
              <div key=${a.id} class="anexo" onClick=${() => a.formato?.startsWith('image') && setAmpliado(a)}>
                ${a.formato?.startsWith('image')
                  ? html`<img src=${a.url} alt=${a.nome} loading="lazy" />`
                  : html`<div class="anexo-doc"><${Icone} nome="arquivo" tam=${20} /><span class="corta">${a.nome}</span></div>`}
                <span class="rotulo-anexo">${TIPOS_ANEXO.find(t => t.id === a.tipo)?.nome || a.tipo}</span>
                ${podeEnviar ? html`
                  <button class="remover" aria-label=${'Remover ' + a.nome}
                    onClick=${(e) => { e.stopPropagation(); acoes.removerAnexo(a.id); avisar('Anexo removido.'); }}>
                    <${Icone} nome="x" tam=${12} /></button>` : null}
              </div>`)}
          </div>`}

      ${!compacto ? html`
        <p class="silencioso">${meus.length} ${meus.length === 1 ? 'arquivo' : 'arquivos'} ·
        ${Math.round(meus.reduce((t, a) => t + (a.bytes || 0), 0) / 1024)} KB nesta ordem.
        No modo demonstração as imagens ficam na memória do navegador e não entram no arquivo de backup —
        conectado ao banco, elas vão para o Storage e são copiadas junto com ele.</p>` : null}

      ${ampliado ? html`
        <div class="lupa" onClick=${() => setAmpliado(null)}>
          <div style="display:flex;flex-direction:column;align-items:center;gap:12px">
            <img src=${ampliado.url} alt=${ampliado.nome} />
            <div style="color:#fff;font-size:13px">${ampliado.nome} · ${TIPOS_ANEXO.find(t => t.id === ampliado.tipo)?.nome}</div>
          </div>
        </div>` : null}
    </div>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   GARANTIA
   A pergunta que o balcão faz é sempre a mesma: "esse serviço ainda está na
   garantia?". A tela existe para responder isso em um campo de busca.
   ══════════════════════════════════════════════════════════════════════════ */
const situacaoGarantia = (dias) => dias < 0 ? 'vencida' : dias <= 15 ? 'vencendo' : 'vigente';

function TelaGarantias() {
  const { metricas, abrirOS, abrirVeiculo } = usar();
  const [busca, setBusca] = useState('');
  const buscaLenta = useAtraso(busca);
  const [filtro, setFiltro] = useState('vigentes');
  const m = metricas;

  const lista = useMemo(() => {
    const q = buscaLenta.trim().toLowerCase();
    return m.garantias
      .filter(g => filtro === 'vigentes' ? g.dias >= 0 : filtro === 'vencidas' ? g.dias < 0 : true)
      .filter(g => !q || [g.os.veiculo?.placa, g.os.cliente?.nome, g.os.veiculo?.modelo, String(g.os.numero),
        g.os.itens.find(i => i.tipo === 'servico')?.descricao].some(x => String(x || '').toLowerCase().includes(q)));
  }, [m, filtro, buscaLenta]);

  const pagina = usePagina(lista, 40);
  const vencendo = m.garantiasVigentes.filter(g => g.dias <= 15);
  const coberto = m.garantiasVigentes.reduce((s, g) => s + g.os.totais.liquido, 0);

  return html`
    <div style="display:flex;flex-direction:column;gap:14px" class="entra">
      <div class="grade g-4">
        <${Indicador} rotulo="Garantias vigentes" valor=${m.garantiasVigentes.length} acento="var(--ok)"
          apoio=${'Prazo padrão de ' + GARANTIA_PADRAO + ' dias após a entrega'} />
        <${Indicador} rotulo="Vencem em 15 dias" valor=${vencendo.length} acento=${vencendo.length ? 'var(--alerta)' : ''}
          apoio="Momento de oferecer a revisão seguinte" />
        <${Indicador} rotulo="Valor sob garantia" valor=${brlCurto(coberto)}
          apoio="Soma dos serviços ainda cobertos" />
        <${Indicador} rotulo="Já encerradas" valor=${m.garantias.length - m.garantiasVigentes.length}
          apoio="Fora do prazo, mantidas no histórico" />
      </div>

      <${Cartao}>
        <div class="cartao-topo"><div>
          <h3>Este serviço ainda está na garantia?</h3>
          <p class="silencioso">Digite a placa, o nome do cliente ou o número da ordem</p>
        </div></div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
          <div class="busca" style="height:44px">
            <${Icone} nome="busca" tam=${16} cor="var(--tinta-3)" />
            <input value=${busca} onInput=${e => setBusca(e.target.value)} style="font-size:15px"
              placeholder="Placa ou nome do cliente" aria-label="Consultar garantia" />
          </div>
          <div class="filtros">
            ${[['vigentes','Vigentes'],['vencidas','Encerradas'],['todas','Todas']].map(([id, nome]) => html`
              <button key=${id} class="filtro" aria-pressed=${filtro === id} onClick=${() => setFiltro(id)}>${nome}</button>`)}
          </div>
        </div>
      <//>

      ${lista.length === 0
        ? html`<${Cartao}><${Vazio} icone="check"
            titulo=${busca.trim() ? 'Nada encontrado com esse dado' : 'Nenhuma garantia nesta faixa'}
            apoio=${busca.trim()
              ? 'Se o serviço foi feito aqui e não aparece, confira a placa — a garantia começa a contar na entrega do veículo.'
              : 'A garantia nasce quando a ordem é concluída e o veículo entregue.'} /><//>`
        : html`<${Cartao} nu>
            <div class="rolagem">
              <table class="tabela">
                <thead><tr><th>Veículo</th><th>Cliente</th><th>Serviço</th><th>Entregue em</th><th>Garantia até</th><th class="dir">Valor</th><th class="dir">Situação</th></tr></thead>
                <tbody>
                  ${pagina.visiveis.map(g => {
                    const sit = situacaoGarantia(g.dias);
                    return html`
                      <tr key=${g.os.id} style="cursor:pointer" onClick=${() => abrirOS(g.os.id)}>
                        <td><div style="display:flex;align-items:center;gap:10px">
                          <${Placa} valor=${g.os.veiculo?.placa} tam="p" />
                          <span style="font-size:13px;font-weight:500">${g.os.veiculo?.marca} ${g.os.veiculo?.modelo}</span>
                        </div></td>
                        <td class="secundario" style="font-size:13px">${g.os.cliente?.nome}</td>
                        <td style="font-size:13px">${g.os.itens.find(i => i.tipo === 'servico')?.descricao || '—'}</td>
                        <td class="mono" style="font-size:12.5px">${fmtData(g.os.concluida_em)}</td>
                        <td class="mono" style="font-size:12.5px">${fmtData(g.ate)}</td>
                        <td class="dir mono" style="font-size:13px;font-weight:600">${brlBruto(g.os.totais.liquido)}</td>
                        <td class="dir">
                          <span class=${'selo-garantia ' + sit}>
                            ${sit === 'vencida' ? 'Encerrada'
                              : sit === 'vencendo' ? 'Faltam ' + g.dias + 'd'
                              : g.dias + ' dias'}
                          </span>
                        </td>
                      </tr>`;
                  })}
                </tbody>
              </table>
            </div>
            <${BotaoMais} restantes=${pagina.restantes} aoClicar=${pagina.mais} />
          <//>`}
    </div>`;
}

/* Aviso que aparece ao abrir ordem para veículo com garantia em curso. */
function AvisoGarantia({ veiculoId }) {
  const { metricas, abrirOS } = usar();
  const ativas = metricas.garantiasPorVeiculo.get(veiculoId) || [];
  if (ativas.length === 0) return null;
  return html`
    <div class="aviso aviso-ok">
      <${Icone} nome="check" tam=${16} />
      <div>
        <strong>Este veículo tem garantia em curso.</strong>
        ${ativas.slice(0, 2).map(g => html`
          <span key=${g.os.id} style="display:block;margin-top:4px">
            ${g.os.itens.find(i => i.tipo === 'servico')?.descricao || 'Serviço'} da OS ${g.os.numero},
            entregue em ${fmtData(g.os.concluida_em)} — cobertura até ${fmtData(g.ate)} (${g.dias} dias).
            <button style="color:inherit;text-decoration:underline;font-weight:600" onClick=${() => abrirOS(g.os.id)}>ver ordem</button>
          </span>`)}
        <span style="display:block;margin-top:5px">Se a queixa for a mesma, o serviço não deve ser cobrado.</span>
      </div>
    </div>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   DOCUMENTOS IMPRIMÍVEIS
   Quatro papéis que a oficina entrega ao cliente. Todos saem com o logotipo,
   os dados cadastrados e uma linha de assinatura — impressão direta ou PDF
   pelo próprio navegador, sem depender de biblioteca externa.
   ══════════════════════════════════════════════════════════════════════════ */
function CabecalhoDoc({ oficina, titulo, numero, data }) {
  return html`
    <div class="cabecalho-doc">
      <div class="marca-doc">
        ${oficina.logo ? html`<img src=${oficina.logo} alt="" />` : null}
        <div>
          <h1>${oficina.nome}</h1>
          <div style="font-size:10.5px;color:#4A5468;margin-top:3px">
            ${oficina.documento ? 'CNPJ ' + oficina.documento : ''}${oficina.telefone ? ' · ' + fmtTel(oficina.telefone) : ''}
          </div>
          <div style="font-size:10.5px;color:#4A5468">${oficina.endereco || ''}</div>
        </div>
      </div>
      <div style="text-align:right">
        <div style="font-size:15px;font-weight:700;text-transform:uppercase;letter-spacing:.04em">${titulo}</div>
        ${numero ? html`<div style="font-size:20px;font-weight:700;font-family:var(--mono)">Nº ${numero}</div>` : null}
        <div style="font-size:10.5px;color:#4A5468;margin-top:2px">Emitido em ${fmtData(data || new Date().toISOString())}</div>
      </div>
    </div>`;
}

const CampoDoc = ({ rotulo, valor }) => html`
  <div><div class="campo-doc">${rotulo}</div><div class="valor-doc">${valor || '—'}</div></div>`;

function BlocoPartes({ os }) {
  return html`
    <div class="bloco grade-doc">
      <div>
        <h2>Cliente</h2>
        <div style="display:flex;flex-direction:column;gap:6px">
          <${CampoDoc} rotulo="Nome" valor=${os.cliente?.nome} />
          <${CampoDoc} rotulo="Documento" valor=${fmtDoc(os.cliente?.documento)} />
          <${CampoDoc} rotulo="Telefone" valor=${fmtTel(os.cliente?.telefone)} />
        </div>
      </div>
      <div>
        <h2>Veículo</h2>
        <div style="display:flex;flex-direction:column;gap:6px">
          <${CampoDoc} rotulo="Placa" valor=${os.veiculo?.placa} />
          <${CampoDoc} rotulo="Modelo" valor=${(os.veiculo?.marca || '') + ' ' + (os.veiculo?.modelo || '') + ' · ' + (os.veiculo?.ano_modelo || '')} />
          <${CampoDoc} rotulo="Cor / KM na entrada" valor=${(os.veiculo?.cor || '—') + ' · ' + inteiro(os.km_entrada) + ' km'} />
        </div>
      </div>
    </div>`;
}

function TabelaItens({ os, comCusto }) {
  const pecas = os.itens.filter(i => i.tipo === 'peca');
  const servicos = os.itens.filter(i => i.tipo === 'servico');
  const linha = (i) => html`
    <tr key=${i.id}>
      <td>${i.descricao}</td>
      <td class="dir">${i.quantidade}</td>
      <td class="dir">${brlBruto(i.preco_unitario)}</td>
      <td class="dir">${brlBruto(i.quantidade * i.preco_unitario)}</td>
    </tr>`;
  return html`
    <div class="bloco">
      <h2>Mão de obra</h2>
      <table>
        <thead><tr><th>Serviço</th><th class="dir">Qtd</th><th class="dir">Unitário</th><th class="dir">Total</th></tr></thead>
        <tbody>${servicos.length ? servicos.map(linha) : html`<tr><td colspan="4" style="color:#6A7385">Sem mão de obra lançada.</td></tr>`}</tbody>
      </table>
      <h2 style="margin-top:16px">Peças e materiais</h2>
      <table>
        <thead><tr><th>Peça</th><th class="dir">Qtd</th><th class="dir">Unitário</th><th class="dir">Total</th></tr></thead>
        <tbody>${pecas.length ? pecas.map(linha) : html`<tr><td colspan="4" style="color:#6A7385">Sem peças lançadas.</td></tr>`}</tbody>
      </table>
      <table style="margin-top:16px;max-width:300px;margin-left:auto">
        <tbody>
          <tr><td>Mão de obra</td><td class="dir">${brlBruto(os.totais.servicos)}</td></tr>
          <tr><td>Peças</td><td class="dir">${brlBruto(os.totais.pecas)}</td></tr>
          ${os.totais.desconto > 0 ? html`<tr><td>Desconto</td><td class="dir">− ${brlBruto(os.totais.desconto)}</td></tr>` : null}
          <tr><td style="font-size:14px;font-weight:700;border-bottom:none;padding-top:9px">Total</td>
              <td class="dir" style="font-size:16px;font-weight:700;border-bottom:none;padding-top:9px">${brlBruto(os.totais.liquido)}</td></tr>
        </tbody>
      </table>
    </div>`;
}

function FolhaOS({ os, oficina }) {
  return html`
    <div class="folha">
      <${CabecalhoDoc} oficina=${oficina} titulo="Ordem de Serviço" numero=${os.numero} data=${os.aberta_em} />
      <${BlocoPartes} os=${os} />
      <div class="bloco">
        <h2>Problema informado pelo cliente</h2>
        <p>${os.relato || '—'}</p>
      </div>
      <div class="bloco">
        <h2>Diagnóstico e observações técnicas</h2>
        <p>${os.obs_tecnica || 'Sem diagnóstico registrado.'}</p>
      </div>
      <${TabelaItens} os=${os} />
      ${os.obs_orcamento ? html`<div class="bloco"><h2>Observações</h2><p>${os.obs_orcamento}</p></div>` : null}
      <div class="bloco grade-doc">
        ${comMecanicos(oficina) ? html`<${CampoDoc} rotulo="Responsável pelo serviço" valor=${mecanicoNome(os.mecanico)} />` : null}
        <${CampoDoc} rotulo="Situação" valor=${etapaNome(os.etapa)} />
        <${CampoDoc} rotulo="Abertura" valor=${fmtData(os.aberta_em)} />
        <${CampoDoc} rotulo="Garantia" valor=${(os.garantia_dias || GARANTIA_PADRAO) + ' dias após a entrega'} />
      </div>
      <div class="assinaturas">
        <div class="assinatura">${os.cliente?.nome || 'Cliente'}</div>
        <div class="assinatura">${oficina.nome}</div>
      </div>
      <div class="rodape-doc">
        Documento gerado pelo Nitro em ${fmtData(new Date().toISOString())}.
        Garantia de ${os.garantia_dias || GARANTIA_PADRAO} dias sobre a mão de obra e as peças aplicadas, contados da entrega do veículo.
      </div>
    </div>`;
}

function FolhaOrcamento({ os, oficina }) {
  const st = STATUS_ORCAMENTO[os.statusOrcamento];
  return html`
    <div class="folha">
      <${CabecalhoDoc} oficina=${oficina} titulo="Orçamento" numero=${os.numero} data=${os.aberta_em} />
      <${BlocoPartes} os=${os} />
      <div class="bloco">
        <h2>Serviço solicitado</h2>
        <p>${os.relato || '—'}</p>
      </div>
      <${TabelaItens} os=${os} />
      <div class="bloco grade-doc">
        <${CampoDoc} rotulo="Situação" valor=${st?.nome} />
        <${CampoDoc} rotulo="Válido até" valor=${fmtData(os.validade || somaDias(os.aberta_em, os.validade_dias || VALIDADE_PADRAO))} />
        <${CampoDoc} rotulo="Prazo de execução" valor=${(os.prazo_dias || 2) + ' dias úteis após a aprovação'} />
        <${CampoDoc} rotulo="Garantia" valor=${(os.garantia_dias || GARANTIA_PADRAO) + ' dias'} />
      </div>
      ${os.obs_orcamento ? html`<div class="bloco"><h2>Observações</h2><p>${os.obs_orcamento}</p></div>` : null}
      <div class="bloco" style="background:#F2F4F8;padding:12px 14px;border-radius:6px;font-size:11.5px;color:#4A5468">
        Este orçamento é uma previsão. Serviços adicionais identificados durante a execução serão comunicados
        e só executados após nova autorização. Peças substituídas ficam à disposição do cliente por 30 dias.
      </div>
      <div class="assinaturas">
        <div class="assinatura">Aprovo o orçamento — ${os.cliente?.nome || 'Cliente'}</div>
        <div class="assinatura">${oficina.nome}</div>
      </div>
      <div class="rodape-doc">Emitido pelo Nitro em ${fmtData(new Date().toISOString())} · Orçamento nº ${os.numero}</div>
    </div>`;
}

function FolhaEntrega({ os, oficina, checklist }) {
  return html`
    <div class="folha">
      <${CabecalhoDoc} oficina=${oficina} titulo="Comprovante de Entrega" numero=${os.numero} data=${os.entregue_em || new Date().toISOString()} />
      <${BlocoPartes} os=${os} />
      <div class="bloco">
        <h2>Serviços executados</h2>
        <table>
          <thead><tr><th>Descrição</th><th class="dir">Qtd</th></tr></thead>
          <tbody>${os.itens.map(i => html`<tr key=${i.id}><td>${i.descricao}</td><td class="dir">${i.quantidade}</td></tr>`)}</tbody>
        </table>
      </div>
      ${checklist ? html`
        <div class="bloco">
          <h2>Conferência da entrega</h2>
          <div class="grade-doc">
            <${CampoDoc} rotulo="Combustível na entrada" valor=${checklist.combustivel} />
            <${CampoDoc} rotulo="Itens devolvidos" valor=${(checklist.itens || []).join(', ') || 'Nenhum item registrado'} />
          </div>
          ${(checklist.avarias || []).length ? html`
            <p style="margin-top:10px;font-size:11.5px;color:#4A5468">
              Avarias registradas na entrada: ${checklist.avarias.map(a => localNome(a.local) + ' (' + a.tipo + ')').join('; ')}.
            </p>` : null}
        </div>` : null}
      <div class="bloco grade-doc">
        <${CampoDoc} rotulo="Valor total" valor=${brlBruto(os.totais.liquido)} />
        <${CampoDoc} rotulo="Data da entrega" valor=${fmtData(os.entregue_em || new Date().toISOString())} />
        ${comMecanicos(oficina) ? html`<${CampoDoc} rotulo="Responsável" valor=${mecanicoNome(os.mecanico)} />` : null}
        <${CampoDoc} rotulo="Garantia até" valor=${os.garantiaAte ? fmtData(os.garantiaAte) : (os.garantia_dias || GARANTIA_PADRAO) + ' dias após hoje'} />
      </div>
      <div class="bloco" style="background:#F2F4F8;padding:12px 14px;border-radius:6px;font-size:11.5px;color:#4A5468">
        Declaro ter recebido o veículo acima nas condições descritas, conferido os itens deixados e
        estar ciente do prazo de garantia de ${os.garantia_dias || GARANTIA_PADRAO} dias sobre os serviços executados.
      </div>
      <div class="assinaturas">
        <div class="assinatura">${os.cliente?.nome || 'Cliente'} — recebi o veículo</div>
        <div class="assinatura">${oficina.nome} — entreguei</div>
      </div>
      <div class="rodape-doc">Emitido pelo Nitro em ${fmtData(new Date().toISOString())}</div>
    </div>`;
}

function FolhaHistorico({ veiculo, oficina }) {
  /* Documento impresso não pode quebrar na frente do cliente. Hoje só existe
     um ponto de chamada e ele passa o veículo já composto, mas a folha sai
     na impressora com alguém esperando: se um dia chegar um veículo cru,
     ela imprime vazia em vez de derrubar a tela. */
  const concluidas = Array.isArray(veiculo && veiculo.concluidas) ? veiculo.concluidas : [];
  const total = concluidas.reduce((s, o) => s + (o?.totais?.liquido || 0), 0);
  return html`
    <div class="folha">
      <${CabecalhoDoc} oficina=${oficina} titulo="Histórico do Veículo" numero=${veiculo.placa} />
      <div class="bloco grade-doc">
        <${CampoDoc} rotulo="Veículo" valor=${veiculo.marca + ' ' + veiculo.modelo + ' · ' + (veiculo.ano_modelo || '')} />
        <${CampoDoc} rotulo="Placa" valor=${veiculo.placa} />
        <${CampoDoc} rotulo="Proprietário" valor=${veiculo.cliente?.nome} />
        <${CampoDoc} rotulo="Quilometragem atual" valor=${inteiro(veiculo.km_atual) + ' km'} />
      </div>
      <div class="bloco">
        <h2>Serviços realizados nesta oficina</h2>
        <table>
          <thead><tr><th>Data</th><th class="dir">KM</th><th>Serviço</th><th>Peças aplicadas</th><th class="dir">Valor</th></tr></thead>
          <tbody>
            ${concluidas.length === 0
              ? html`<tr><td colspan="5" style="color:#6A7385">Nenhum serviço concluído registrado.</td></tr>`
              : concluidas.map(o => html`
                <tr key=${o.id}>
                  <td>${fmtData(o.concluida_em)}</td>
                  <td class="dir">${inteiro(o.km_entrada)}</td>
                  <td>${o.itens.find(i => i.tipo === 'servico')?.descricao || '—'}</td>
                  <td style="font-size:11px">${o.itens.filter(i => i.tipo === 'peca').map(i => i.descricao).join('; ') || '—'}</td>
                  <td class="dir">${brlBruto(o.totais.liquido)}</td>
                </tr>`)}
          </tbody>
        </table>
        <table style="margin-top:12px;max-width:280px;margin-left:auto">
          <tbody><tr><td style="font-weight:700;border-bottom:none">Total investido</td>
            <td class="dir" style="font-weight:700;border-bottom:none">${brlBruto(total)}</td></tr></tbody>
        </table>
      </div>
      ${veiculo.plano?.itens?.some(i => i.situacao !== 'ok') ? html`
        <div class="bloco">
          <h2>Manutenções previstas</h2>
          <table>
            <thead><tr><th>Serviço</th><th>Intervalo</th><th>Situação</th></tr></thead>
            <tbody>
              ${veiculo.plano.itens.filter(i => i.situacao !== 'ok').map(i => html`
                <tr key=${i.servico}>
                  <td>${i.servico}</td>
                  <td>${inteiro(i.intervaloKm)} km ou ${i.intervaloMeses} meses</td>
                  <td>${i.situacao === 'vencido' ? 'Vencido' : i.situacao === 'proximo' ? 'Previsto para ' + fmtData(i.previsao) : 'Sem registro nesta oficina'}</td>
                </tr>`)}
            </tbody>
          </table>
        </div>` : null}
      <div class="rodape-doc">
        Documento gerado pelo Nitro em ${fmtData(new Date().toISOString())}.
        Contém apenas os serviços executados nesta oficina.
      </div>
    </div>`;
}

const DOCUMENTOS = {
  os:        { nome:'Ordem de serviço',      icone:'prancheta' },
  orcamento: { nome:'Orçamento',             icone:'arquivo' },
  entrega:   { nome:'Comprovante de entrega',icone:'check' },
  historico: { nome:'Histórico do veículo',  icone:'historico' },
};

function ModalDocumento({ tipo, os, veiculo, aoFechar }) {
  const { dados, avisar } = usar();
  const oficina = dados.oficina;
  /* FASE 13: `window.print()` não gera arquivo — abre a caixa de impressão e
     conta com a pessoa achar "Salvar como PDF" no meio dos destinos. No
     celular esse caminho quase não existe. Ordem e orçamento agora saem como
     arquivo de verdade; entrega e histórico seguem pela impressão, que é o
     que esses dois já faziam bem. */
  const temArquivo = (tipo === 'os' || tipo === 'orcamento') && os;
  const baixarPdf = () => {
    try {
      baixarBlob(nomeArquivoOS(os, oficina, tipo),
        pdfDaOrdem(os, oficina, { tipo, enderecoCliente: enderecoPublico(os) }));
    } catch (e) { avisar('Falha ao gerar o PDF: ' + (e.message || '')); }
  };
  const folha =
    tipo === 'os'        ? html`<${FolhaOS} os=${os} oficina=${oficina} />` :
    tipo === 'orcamento' ? html`<${FolhaOrcamento} os=${os} oficina=${oficina} />` :
    tipo === 'entrega'   ? html`<${FolhaEntrega} os=${os} oficina=${oficina} checklist=${os?.checklist} />` :
                           html`<${FolhaHistorico} veiculo=${veiculo} oficina=${oficina} />`;
  return html`
    <${Modal} titulo=${DOCUMENTOS[tipo].nome} subtitulo="Confira antes de imprimir" aoFechar=${aoFechar} largura=${880}
      rodape=${html`
        <button class="btn btn-neutro" onClick=${aoFechar}>Fechar</button>
        <button class="btn btn-neutro" onClick=${() => window.print()}>
          <${Icone} nome="imprimir" tam=${15} />Imprimir</button>
        ${temArquivo
          ? html`<button class="btn btn-primario" onClick=${baixarPdf}>
              <${Icone} nome="baixar" tam=${15} />Baixar PDF</button>`
          : null}`}>
      <p class="silencioso nao-imprime">
        ${temArquivo
          ? 'O PDF sai pronto, com os dados cadastrados em Ajustes e a linha de assinatura. Para enviar ao cliente, use o botão verde no rodapé da ordem.'
          : 'Escolha "Salvar como PDF" no destino da impressão para guardar este documento.'}
      </p>
      <div style="border:1px solid var(--linha);border-radius:var(--raio);overflow:hidden">${folha}</div>
    <//>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   BACKUP E SEGURANÇA — a aba de Ajustes
   ══════════════════════════════════════════════════════════════════════════ */
function PainelBackup() {
  const { dados, acoes, papel, avisar, modo } = usar();
  const [janela, setJanela] = useState(30);
  const [confirmar, setConfirmar] = useState(null);
  const entrada = useRef(null);
  const podeRestaurar = pode(papel, 'restaurar');
  const podeBaixar = pode(papel, 'gestao');

  const lista = dados.backups.filter(b => diasDesde(b.criado_em) <= janela);
  const ultimo = dados.backups[0];

  const baixar = () => tentar(() => {
    const bk = montarBackup(dados, 'manual', 'Download');
    baixarArquivo(nomeArquivoBackup(dados, bk.criado_em), JSON.stringify(bk, null, 2));
    acoes.registrarBackup(bk, 'Backup baixado para o computador');
    avisar('Backup baixado. Guarde uma cópia fora deste computador.');
  }, avisar);

  const exportarCSV = (tabela) => tentar(() => {
    const csv = paraCSV(dados[tabela] || []);
    if (!csv) { avisar('Não há dados nessa tabela para exportar.'); return; }
    baixarArquivo('nitro-' + tabela + '-' + new Date().toISOString().slice(0, 10) + '.csv', csv);
    avisar(tabela + ': ' + (dados[tabela] || []).length + ' registros exportados.');
  }, avisar);

  const lerArquivo = (e) => {
    const arq = e.target.files?.[0];
    if (!arq) return;
    const leitor = new FileReader();
    leitor.onerror = () => avisar(MENSAGENS_ERRO.arquivo);
    leitor.onload = () => {
      let obj;
      try { obj = JSON.parse(leitor.result); }
      catch (erro) { console.error('[Nitro]', erro); avisar(MENSAGENS_ERRO.arquivo); return; }
      const check = conferirBackup(obj);
      if (!check.ok) {
        avisar(check.motivo === 'versao'
          ? 'Esse backup vem de uma versão mais nova do Nitro. Atualize o sistema antes de restaurar.'
          : MENSAGENS_ERRO[check.motivo] || MENSAGENS_ERRO.arquivo);
        return;
      }
      setConfirmar({ ...obj, origem: 'arquivo', nomeArquivo: arq.name });
    };
    leitor.readAsText(arq);
    e.target.value = '';
  };

  return html`
    <div style="display:flex;flex-direction:column;gap:14px">
      <div class="grade g-3">
        <${Indicador} rotulo="Último backup" valor=${ultimo ? fmtData(ultimo.criado_em) : '—'}
          apoio=${ultimo ? new Date(ultimo.criado_em).toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' }) + ' · ' + ultimo.tipo : 'Nenhum ainda'}
          acento=${ultimo && diasDesde(ultimo.criado_em) === 0 ? 'var(--ok)' : 'var(--alerta)'} />
        <${Indicador} rotulo="Cópias guardadas" valor=${dados.backups.length}
          apoio=${'Automático a cada 10 minutos, últimas ' + LIMITE_BACKUPS} />
        <${Indicador} rotulo="Registros protegidos" valor=${inteiro(ultimo?.total || 0)}
          apoio=${ultimo ? Math.round(ultimo.bytes / 1024) + ' KB por cópia' : 'Sem cópias'} />
      </div>

      <div class=${'aviso ' + (modo === 'demo' ? 'aviso-alerta' : 'aviso-ok')}>
        <${Icone} nome="alerta" tam=${16} />
        <div>
          ${modo === 'demo'
            ? html`<span><strong>O que aqui é real e o que não é.</strong> Baixar o backup gera um arquivo de verdade no seu
                computador, com soma de verificação — esse é o seu seguro. As cópias listadas abaixo vivem na memória do
                navegador e somem ao recarregar a página. Backup automático que sobrevive a um HD queimado é o do banco:
                com o Supabase conectado, são cópias diárias e recuperação a qualquer ponto no tempo.</span>`
            : html`<span>Conectado ao Supabase: cópias diárias automáticas no servidor e recuperação por ponto no tempo.
                O download abaixo é a sua cópia externa, fora da nuvem.</span>`}
        </div>
      </div>

      <div class="grade g-2">
        <${Cartao}>
          <div class="cartao-topo"><div><h3>Baixar cópia</h3>
            <p class="silencioso">Arquivo único com tudo, para guardar fora daqui</p></div></div>
          <button class="btn btn-primario btn-bloco" onClick=${baixar} disabled=${!podeBaixar}>
            <${Icone} nome="arquivo" tam=${16} />Baixar backup completo</button>
          <p class="silencioso" style="margin-top:10px">
            Inclui ${inteiro(TABELAS.reduce((t, x) => t + (dados[x] || []).length, 0))} registros de ${TABELAS.length} tabelas,
            mais os dados e a identidade visual da oficina. O arquivo carrega uma soma de verificação:
            se ele for truncado ou editado, a restauração recusa.
          </p>
          <div style="border-top:1px solid var(--linha-suave);margin-top:14px;padding-top:14px">
            <p class="silencioso" style="margin-bottom:9px">Ou exporte uma tabela em CSV, para abrir no Excel:</p>
            <div class="filtros">
              ${[['clientes','Clientes'],['veiculos','Veículos'],['ordens','Ordens'],['lancamentos','Financeiro'],['pecas','Estoque']].map(([t, rot]) => html`
                <button key=${t} class="filtro" onClick=${() => exportarCSV(t)} disabled=${!podeBaixar}>${rot}</button>`)}
            </div>
          </div>
        <//>

        <${Cartao}>
          <div class="cartao-topo"><div><h3>Restaurar</h3>
            <p class="silencioso">De um arquivo baixado ou de uma cópia desta sessão</p></div></div>
          ${!podeRestaurar ? html`
            <div class="aviso aviso-info"><${Icone} nome="alerta" tam=${15} />
              <span>Só o dono restaura backup. É a ação mais destrutiva do sistema — ela sobrescreve tudo.</span></div>`
          : html`
            <button class="btn btn-neutro btn-bloco" onClick=${() => entrada.current?.click()}>
              <${Icone} nome="arquivo" tam=${16} />Escolher arquivo de backup</button>
            <input ref=${entrada} type="file" accept="application/json,.json" style="display:none" onChange=${lerArquivo} />
            <div class="aviso aviso-alerta" style="margin-top:12px">
              <${Icone} nome="alerta" tam=${15} />
              <span>A restauração substituirá os dados atuais pela versão selecionada.</span>
            </div>`}
        <//>
      </div>

      <${Cartao} nu>
        <div style="padding:16px 18px;border-bottom:1px solid var(--linha);display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">
          <div>
            <h3>Histórico de cópias</h3>
            <p class="silencioso">${lista.length} ${lista.length === 1 ? 'cópia' : 'cópias'} nos últimos ${janela} dias</p>
          </div>
          <div class="filtros">
            ${[7, 14, 30].map(d => html`
              <button key=${d} class="filtro" aria-pressed=${janela === d} onClick=${() => setJanela(d)}>${d} dias</button>`)}
          </div>
        </div>
        ${lista.length === 0
          ? html`<${Vazio} icone="arquivo" titulo="Nenhuma cópia nessa janela"
              apoio="A primeira cópia automática é feita na abertura do sistema; as seguintes, a cada dez minutos." />`
          : html`<div style="padding:6px 18px 14px">
              ${lista.map(b => html`
                <div key=${b.id} class="aud">
                  <span class="selo-acao" style=${'background:' + (b.tipo === 'automatico' ? 'var(--info-fundo);color:var(--azul-acao)' : 'var(--ok-fundo);color:var(--ok)')}>
                    <${Icone} nome=${b.tipo === 'automatico' ? 'relogio' : 'arquivo'} tam=${15} /></span>
                  <div style="min-width:0">
                    <div style="font-size:13.5px;font-weight:500">
                      ${fmtDataLonga(b.criado_em)} às ${new Date(b.criado_em).toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' })}
                    </div>
                    <div class="silencioso">
                      ${inteiro(b.total)} registros · ${Math.round(b.bytes / 1024)} KB ·
                      <span class="mono">soma ${b.soma}</span> · ${b.tipo === 'automatico' ? 'automático' : b.autor}
                    </div>
                  </div>
                  <div style="display:flex;gap:6px;align-items:center">
                    <button class="btn btn-neutro btn-p" onClick=${() => tentar(() => {
                      baixarArquivo(nomeArquivoBackup(dados, b.criado_em), JSON.stringify(b, null, 2));
                      avisar('Cópia baixada.');
                    }, avisar)}>Baixar</button>
                    ${podeRestaurar ? html`
                      <button class="btn btn-neutro btn-p" onClick=${() => setConfirmar({ ...b, origem: 'sessao' })}>Restaurar</button>` : null}
                  </div>
                </div>`)}
            </div>`}
      <//>

      ${confirmar ? html`
        <${Modal} titulo="Restaurar backup" subtitulo=${confirmar.origem === 'arquivo' ? confirmar.nomeArquivo : 'Cópia desta sessão'}
          aoFechar=${() => setConfirmar(null)}
          rodape=${html`
            <button class="btn btn-neutro" onClick=${() => setConfirmar(null)}>Cancelar</button>
            <button class="btn btn-perigo" style="background:var(--erro);color:#fff" onClick=${() => {
              acoes.restaurarBackup(confirmar);
              avisar('Backup de ' + fmtData(confirmar.criado_em) + ' restaurado.');
              setConfirmar(null);
            }}><${Icone} nome="voltar" tam=${15} />Restaurar mesmo assim</button>`}>
          <div class="aviso aviso-erro">
            <${Icone} nome="alerta" tam=${16} />
            <span>A restauração substituirá os dados atuais pela versão selecionada. O que foi feito depois
            de ${fmtData(confirmar.criado_em)} será perdido.</span>
          </div>
          <div>
            <span class="rotulo">Cópia selecionada</span>
            <div style="margin-top:6px">
              <${ChaveValor} chave="Data" valor=${fmtDataLonga(confirmar.criado_em)} forte />
              <${ChaveValor} chave="Horário" valor=${new Date(confirmar.criado_em).toLocaleTimeString('pt-BR')} />
              <${ChaveValor} chave="Oficina" valor=${confirmar.oficina || '—'} />
              <${ChaveValor} chave="Total de registros" valor=${inteiro(confirmar.total)} />
              <${ChaveValor} chave="Integridade" valor=${html`<${Selo} tom="ok" icone="check">Verificada<//>`} />
            </div>
          </div>
          <div>
            <span class="rotulo">O que vai mudar</span>
            <div style="margin-top:6px">
              ${TABELAS.filter(t => (confirmar.registros?.[t] || 0) !== (dados[t] || []).length).map(t => {
                const dep = confirmar.registros?.[t] || 0, hoje = (dados[t] || []).length;
                return html`
                  <div key=${t} class="chave-valor">
                    <span class="secundario" style="text-transform:capitalize">${t}</span>
                    <span class="mono">${inteiro(hoje)} → <span style=${'color:' + (dep < hoje ? 'var(--erro)' : 'var(--ok)')}>${inteiro(dep)}</span></span>
                  </div>`;
              })}
              ${TABELAS.every(t => (confirmar.registros?.[t] || 0) === (dados[t] || []).length)
                ? html`<p class="silencioso">Nenhuma diferença de quantidade — o conteúdo dos registros ainda pode diferir.</p>` : null}
            </div>
          </div>
        <//>` : null}
    </div>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   BARREIRA DE ERRO
   Se uma tela quebrar, o resto do sistema continua de pé e o usuário recebe
   uma saída, não uma página branca com pilha de execução.
   ══════════════════════════════════════════════════════════════════════════ */
class Barreira extends Component {
  constructor(props) { super(props); this.state = { falhou: false }; }
  static getDerivedStateFromError() { return { falhou: true }; }
  componentDidCatch(erro, info) { console.error('[Nitro] falha em', this.props.onde, erro, info); }
  componentDidUpdate(anterior) { if (anterior.chave !== this.props.chave && this.state.falhou) this.setState({ falhou: false }); }
  render() {
    if (!this.state.falhou) return this.props.children;
    return html`
      <${Cartao}>
        <${Vazio} icone="alerta" titulo="Esta tela não pôde ser aberta"
          apoio="O restante do sistema continua funcionando. Tente de novo ou vá para outra tela — se persistir, fale com o suporte."
          acao=${html`<button class="btn btn-primario" style="margin-top:6px"
            onClick=${() => this.setState({ falhou: false })}>Tentar de novo</button>`} />
      <//>`;
  }
}

/* ══════════════════════════════════════════════════════════════════════════
   FASE 6 — CAMADA DE EVOLUÇÃO
   Tudo daqui para baixo é aditivo. Nenhuma função, tabela, id, componente ou
   tela das fases anteriores foi alterado: esta camada só lê o que já existe
   (dados, metricas, achados) e acrescenta leitura nova em cima.

   Organização:
     6.1  Ícones e utilidades novas
     6.2  Loja reativa (preferências que não tocam na base)
     6.3  Provedores de IA — estrutura pronta, nenhuma API chamada
     6.4  Motor de sugestões local (as "regras inteligentes")
     6.5  Alertas complementares (mesmo formato dos achados existentes)
     6.6  Rentabilidade, relatórios e pacote do portal
     6.7  Gráficos e peças de interface novas
     6.8  Telas novas
     6.9  Registro no menu e nas rotas
   ══════════════════════════════════════════════════════════════════════════ */

/* ══ 6.1 ÍCONES NOVOS ══
   Object.assign acrescenta traços ao mapa existente sem redefinir nenhum. */
Object.assign(TRACOS, {
  tv:        'M3 5h18a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1M8 20h8M12 16v4',
  tempo:     'M5 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4M5 8v8M5 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4M11 6h9M11 18h6M11 12h4',
  lucro:     'M3 17l5.5-5.5 3.5 3.5L21 6M15 6h6v6',
  exportar:  'M12 3v12M8 11l4 4 4-4M4 19h16',
  robo:      'M12 2v3M5 5h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1M9 11h.01M15 11h.01M9 15h6',
  elo:       'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1',
  escudo:    'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  expandir:  'M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3',
});

/* Download com o tipo certo: o CSV existente sai como JSON e algumas versões
   do Excel reclamam. Função nova, a antiga continua onde estava. */
function baixarTexto(nome, texto, mime = 'text/csv;charset=utf-8') {
  const blob = new Blob(['\ufeff' + texto], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = nome;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const apelidoArquivo = (nome) => String(nome || 'oficina').toLowerCase().normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* Placa parcial: o cliente reconhece o carro dele, quem passa na recepção não
   consegue anotar a placa inteira de um desconhecido. */
const placaParcial = (p) => {
  const v = String(p || '').toUpperCase();
  return v.length >= 7 ? v.slice(0, 4) + '•' + v.slice(5) : v;
};

const primeiroNome = (nome) => String(nome || '').trim().split(/\s+/)[0] || '—';

/* ══ 6.2 LOJA REATIVA ══
   Preferências da camada nova (provedor de IA, modo do painel de TV) moram
   aqui, fora de `dados`. Assim nada entra no backup, no CSV nem no Supabase —
   a base continua com exatamente as mesmas tabelas e colunas de antes.
   Para persistir depois, basta trocar `ler`/`gravar` por uma tabela nova. */
function criarLoja(inicial) {
  let estado = inicial;
  const ouvintes = new Set();
  return {
    ler: () => estado,
    gravar: (parcial) => {
      estado = { ...estado, ...(typeof parcial === 'function' ? parcial(estado) : parcial) };
      ouvintes.forEach(f => f(estado));
    },
    assinar: (f) => { ouvintes.add(f); return () => ouvintes.delete(f); },
  };
}

function usarLoja(loja) {
  const [, redesenhar] = useState(0);
  useEffect(() => loja.assinar(() => redesenhar(n => n + 1)), [loja]);
  return [loja.ler(), loja.gravar];
}

const lojaIA = criarLoja({
  provedor: 'local',      // 'local' | 'openai' | 'gemini' | 'claude'
  modelo: '',
  chave: '',              // nunca sai daqui nesta fase
  enviarDadosPessoais: false,
  ultimoTeste: null,
});

const lojaTV = criarLoja({ rodizio: true, segundos: 12, mostrarTempo: true });

/* ══ 6.3 PROVEDORES DE IA ══
   Contrato único. Hoje só `local` executa; os demais existem com endpoint,
   modelo e formato de corpo já definidos, e recusam com uma mensagem clara.
   Ligar um deles depois é implementar `analisar` — nada mais no sistema muda. */
const RECADO_SEM_API = 'Provedor externo ainda não conectado. O Nitro está respondendo pelas regras locais.';

const PROVEDORES_IA = [
  {
    id: 'local', nome: 'Regras locais', icone: 'faisca',
    resumo: 'Analisa a própria base da oficina. Não envia nada para fora, não custa nada e funciona sem internet.',
    precisaChave: false, modelos: [],
    disponivel: () => true,
    analisar: (pacote) => ({ origem: 'local', geradoEm: new Date().toISOString(), itens: pacote.sugestoes }),
  },
  {
    id: 'openai', nome: 'OpenAI', icone: 'robo',
    resumo: 'GPT via API. Redige textos mais soltos e resume histórico longo.',
    precisaChave: true, modelos: ['gpt-4o-mini', 'gpt-4o'],
    endpoint: 'https://api.openai.com/v1/chat/completions',
    corpo: (pacote, cfg) => ({ model: cfg.modelo || 'gpt-4o-mini', messages: [
      { role: 'system', content: INSTRUCAO_IA }, { role: 'user', content: JSON.stringify(pacote.contexto) }] }),
    disponivel: (cfg) => Boolean(cfg.chave),
    analisar: async () => { throw new Error(RECADO_SEM_API); },
  },
  {
    id: 'gemini', nome: 'Google Gemini', icone: 'robo',
    resumo: 'Gemini via API. Boa relação de custo para volume alto de ordens.',
    precisaChave: true, modelos: ['gemini-2.0-flash', 'gemini-2.0-pro'],
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    corpo: (pacote) => ({ contents: [{ parts: [{ text: INSTRUCAO_IA + '\n' + JSON.stringify(pacote.contexto) }] }] }),
    disponivel: (cfg) => Boolean(cfg.chave),
    analisar: async () => { throw new Error(RECADO_SEM_API); },
  },
  {
    id: 'claude', nome: 'Anthropic Claude', icone: 'robo',
    resumo: 'Claude via API. Costuma ir bem em texto técnico e em explicação para o cliente.',
    precisaChave: true, modelos: ['claude-sonnet-4-5', 'claude-haiku-4-5'],
    endpoint: 'https://api.anthropic.com/v1/messages',
    corpo: (pacote, cfg) => ({ model: cfg.modelo || 'claude-sonnet-4-5', max_tokens: 1024,
      system: INSTRUCAO_IA, messages: [{ role: 'user', content: JSON.stringify(pacote.contexto) }] }),
    disponivel: (cfg) => Boolean(cfg.chave),
    analisar: async () => { throw new Error(RECADO_SEM_API); },
  },
];

const INSTRUCAO_IA = [
  'Você apoia a recepção de uma oficina mecânica no Brasil.',
  'Responda em português do Brasil, em frases curtas, sem prometer prazo nem preço.',
  'Toda sugestão precisa citar o dado que a originou (km, data, histórico).',
  'Nunca invente serviço que não esteja no catálogo enviado.',
].join(' ');

const provedorIA = (id) => PROVEDORES_IA.find(p => p.id === id) || PROVEDORES_IA[0];

/* O que sairia da oficina se um provedor externo fosse ligado. Fica visível na
   tela para o dono conferir antes de autorizar: nome e documento só vão se ele
   marcar, e mesmo assim o documento vai mascarado. */
function montarContextoIA(d, m, cfg) {
  const pessoal = cfg?.enviarDadosPessoais;
  return {
    oficina: { nome: d.oficina.nome, cidade: 'BR' },
    periodo: { mes: m.mesAtual.chave, ordensConcluidas: m.concluidas.length, ativas: m.ativas.length },
    catalogoServicos: m.mix.slice(0, 14).map(s => ({ servico: s.nome, ticket: Math.round(s.ticket) })),
    intervalos: INTERVALOS.map(i => ({ servico: i.servico, km: i.km, meses: i.meses })),
    veiculos: m.preventiva.slice(0, 12).map(v => ({
      ref: v.placa.slice(0, 3) + '***', modelo: v.marca + ' ' + v.modelo, km: v.km_atual,
      cliente: pessoal ? v.cliente?.nome : undefined,
      vencidos: v.vencidos.map(i => i.servico), proximos: v.proximos.map(i => i.servico),
    })),
    ordensAbertas: m.ativas.slice(0, 12).map(o => ({
      numero: o.numero, etapa: o.etapa, dias: o.dias, itens: o.itens.length,
      valor: Math.round(o.totais.liquido),
    })),
  };
}

/* ══ 6.4 MOTOR DE SUGESTÕES LOCAL ══
   Cada regra é um objeto isolado: id, quando roda, e o que escreve. Acrescentar
   uma regra é acrescentar um item na lista — nada mais precisa saber dela.
   `escopo` diz onde a regra aparece: veículo, cliente, ordem ou oficina.    */
const REGRAS_IA = [
  {
    id: 'ritmo-oleo', escopo: 'veiculo', peso: 9,
    quando: ({ v }) => v && v.concluidas.length >= 2,
    gerar: ({ v }) => {
      const trocas = v.concluidas.filter(o => o.itens.some(i => i.tipo === 'servico' && /óleo/i.test(i.descricao)))
        .map(o => o.km_entrada).sort((a, b) => a - b);
      if (trocas.length < 2) return null;
      const vaos = trocas.slice(1).map((km, i) => km - trocas[i]).filter(x => x > 500);
      if (!vaos.length) return null;
      const medio = Math.round(vaos.reduce((s, x) => s + x, 0) / vaos.length / 500) * 500;
      const desde = v.km_atual - trocas[trocas.length - 1];
      return {
        tom: desde >= medio ? 'alta' : 'normal',
        titulo: 'Este veículo costuma trocar óleo a cada ' + inteiro(medio) + ' km',
        texto: desde >= medio
          ? 'Já rodou ' + inteiro(desde) + ' km desde a última troca registrada aqui. Está no ponto.'
          : 'Rodou ' + inteiro(desde) + ' km desde a última. Faltam cerca de ' + inteiro(medio - desde) + ' km.',
        fonte: 'Média de ' + vaos.length + ' intervalo(s) medido(s) no próprio carro',
      };
    },
  },
  {
    id: 'cliente-sumido', escopo: 'cliente', peso: 8,
    quando: ({ c }) => c && c.ultima && mesesDesde(c.ultima) >= 6,
    gerar: ({ c }) => ({
      tom: mesesDesde(c.ultima) >= 12 ? 'alta' : 'normal',
      titulo: primeiroNome(c.nome) + ' está há ' + mesesDesde(c.ultima) + ' meses sem manutenção',
      texto: 'Última passagem em ' + fmtData(c.ultima) + '. Já deixou ' + brl(c.gasto) + ' na oficina em '
        + c.concluidas.length + (c.concluidas.length === 1 ? ' visita' : ' visitas') + '.',
      fonte: 'Histórico do cliente',
    }),
  },
  {
    id: 'cliente-fiel', escopo: 'cliente', peso: 4,
    quando: ({ c }) => c && c.concluidas.length >= 5,
    gerar: ({ c }) => ({
      tom: 'oferta',
      titulo: primeiroNome(c.nome) + ' já realizou ' + c.concluidas.length + ' serviços aqui',
      texto: 'Ticket médio de ' + brl(c.ticket) + '. Cliente desse porte costuma aceitar revisão completa e '
        + 'aceita bem condição de fidelidade.',
      fonte: 'Contagem de ordens concluídas',
    }),
  },
  {
    id: 'alinhamento', escopo: 'veiculo', peso: 6,
    quando: ({ v }) => v && v.concluidas.length > 0
      && !v.concluidas.some(o => o.itens.some(i => /alinhamento/i.test(i.descricao)) && diasDesde(o.concluida_em) < 300),
    gerar: ({ v }) => {
      const gatilho = v.concluidas.find(o => o.itens.some(i => /pneu|suspens|amortec/i.test(i.descricao)));
      return {
        tom: 'oferta',
        titulo: 'Vale oferecer alinhamento',
        texto: gatilho
          ? 'Houve ' + (gatilho.itens.find(i => /pneu|suspens|amortec/i.test(i.descricao))?.descricao || 'serviço de suspensão')
            + ' em ' + fmtData(gatilho.concluida_em) + ' e não há alinhamento registrado depois.'
          : 'Sem alinhamento registrado nos últimos dez meses, com ' + inteiro(v.km_atual) + ' km no odômetro.',
        fonte: 'Ordens do próprio veículo',
      };
    },
  },
  {
    id: 'balanceamento', escopo: 'veiculo', peso: 5,
    quando: ({ v }) => v && v.km_atual > 0
      && !v.concluidas.some(o => o.itens.some(i => /balanceamento/i.test(i.descricao)) && diasDesde(o.concluida_em) < 240),
    gerar: () => ({
      tom: 'oferta',
      titulo: 'Vale oferecer balanceamento',
      texto: 'Serviço curto, entra junto com o que já está agendado e evita desgaste irregular do pneu.',
      fonte: 'Sem registro nos últimos oito meses',
    }),
  },
  {
    id: 'garantia-ativa', escopo: 'veiculo', peso: 7,
    quando: ({ v, garantias }) => garantias && garantias.length > 0,
    gerar: ({ garantias }) => {
      const g = garantias[0];
      return {
        tom: g.dias <= 15 ? 'alta' : 'normal',
        titulo: 'Veículo possui garantia ativa',
        texto: (g.os.itens.find(i => i.tipo === 'servico')?.descricao || 'Serviço') + ' da OS ' + g.os.numero
          + ' coberto até ' + fmtData(g.ate) + (g.dias <= 15 ? ' — faltam ' + g.dias + ' dias.' : '.')
          + ' Retorno relacionado a esse serviço não deve ser cobrado.',
        fonte: 'Garantia de ' + (g.os.garantia_dias || GARANTIA_PADRAO) + ' dias a partir da entrega',
      };
    },
  },
  {
    id: 'pecas-faltando', escopo: 'ordem', peso: 10,
    quando: ({ o, faltantes }) => o && faltantes && faltantes.length > 0,
    gerar: ({ o, faltantes }) => ({
      tom: 'alta',
      titulo: 'Existem peças em falta para concluir esta OS',
      texto: faltantes.map(f => f.descricao + ' (precisa ' + f.precisa + ', tem ' + f.tem + ')').join('; ')
        + '. Sem compra, a ordem trava em execução.',
      fonte: 'Cruzamento dos itens da OS ' + o.numero + ' com o saldo do estoque',
    }),
  },
  {
    id: 'orcamento-baixo', escopo: 'ordem', peso: 8,
    quando: ({ o, m }) => {
      if (!o || o.totais.venda <= 0) return false;
      const s = o.itens.find(i => i.tipo === 'servico');
      const ref = s && m.mix.find(x => x.nome === s.descricao);
      return Boolean(ref && ref.qtd >= 3 && o.totais.liquido < ref.ticket * 0.78);
    },
    gerar: ({ o, m }) => {
      const s = o.itens.find(i => i.tipo === 'servico');
      const ref = m.mix.find(x => x.nome === s.descricao);
      return {
        tom: 'alta',
        titulo: 'Este orçamento pode estar abaixo da média',
        texto: brl(o.totais.liquido) + ' contra ticket médio de ' + brl(ref.ticket) + ' em '
          + ref.qtd + ' ordens de ' + s.descricao.toLowerCase() + '. Confira desconto e itens esquecidos.',
        fonte: 'Comparação com o histórico do mesmo serviço',
      };
    },
  },
  {
    id: 'margem-piso', escopo: 'ordem', peso: 7, sigiloso: 'custo',
    quando: ({ o }) => o && o.totais.venda > 0 && o.totais.margem < PISO_MARGEM,
    gerar: ({ o }) => ({
      tom: 'alta',
      titulo: 'Margem abaixo do piso de ' + PISO_MARGEM + '%',
      texto: 'Esta ordem está em ' + pct(o.totais.margem) + ' depois do desconto de ' + brl(o.desconto) + '.',
      fonte: 'Cálculo sobre custo de peça e mão de obra da própria OS',
    }),
  },
  {
    id: 'mecanico-topo', escopo: 'oficina', peso: 3,
    quando: ({ m }) => m.produtividade.length > 1 && m.produtividade[0].ordens > 0,
    gerar: ({ m }) => {
      const [p1, p2] = m.produtividade;
      return {
        tom: 'normal',
        titulo: p1.nome + ' tem a maior produtividade',
        texto: p1.ordens + ' ordens e ' + brlCurto(p1.receita) + ' gerados, contra ' + p2.ordens
          + ' de ' + primeiroNome(p2.nome) + '. Ticket médio de ' + brl(p1.ticket) + '.',
        fonte: 'Ordens concluídas atribuídas a cada mecânico',
      };
    },
  },
  {
    id: 'parados', escopo: 'oficina', peso: 9,
    quando: ({ m }) => m.travadas.length > 0,
    gerar: ({ m }) => ({
      tom: 'alta',
      titulo: 'Existem ' + m.travadas.length + ' veículo(s) parados há muitos dias',
      texto: m.travadas.slice(0, 3).map(o => o.veiculo?.modelo + ' (' + o.dias + 'd)').join(', ')
        + '. Vaga ocupada é faturamento que não gira.',
      fonte: 'Ordens ativas com seis dias ou mais desde a abertura',
    }),
  },
  {
    id: 'preventiva-carteira', escopo: 'oficina', peso: 6,
    quando: ({ m }) => m.preventiva.filter(v => v.vencidos.length).length >= 2,
    gerar: ({ m }) => {
      const alvo = m.preventiva.filter(v => v.vencidos.length);
      const potencial = alvo.reduce((s, v) => s + v.vencidos.reduce((t, i) => t + (valorDoServico(i.servico) || 0), 0), 0);
      return {
        tom: 'oferta',
        titulo: alvo.length + ' veículos da carteira estão com serviço vencido',
        texto: 'Se metade voltar, são cerca de ' + brlCurto(potencial * 0.5) + ' de serviço já identificado. '
          + 'Lista pronta na tela de preventiva.',
        fonte: 'Projeção por km rodado e data da última execução',
      };
    },
  },
];

/* Sugestões para a recepção: o que oferecer junto, sem empurrar serviço. */
const OFERTAS_RECEPCAO = [
  { chave: /óleo|revis/i, oferecer: ['Troca de filtro de ar', 'Troca de filtro de combustível'],
    motivo: 'Filtros costumam ser trocados junto com o óleo e evitam segunda parada.' },
  { chave: /freio/i, oferecer: ['Troca de fluido de freio'],
    motivo: 'Fluido de freio tem validade por tempo, não por km. Com o carro no elevador, o custo cai.' },
  { chave: /pneu|suspens|amortec/i, oferecer: ['Alinhamento', 'Balanceamento'],
    motivo: 'Depois de mexer em suspensão ou pneu, alinhar é o padrão de qualquer manual.' },
  { chave: /ar.?condicionado/i, oferecer: ['Troca de filtro de cabine'],
    motivo: 'Filtro de cabine é o que mais afeta o cheiro do ar — reclamação comum depois da higienização.' },
  { chave: /correia|motor/i, oferecer: ['Troca de fluido de arrefecimento', 'Inspeção de mangueiras'],
    motivo: 'Com o motor aberto, fluidos e mangueiras saem por uma fração do valor cheio.' },
];

function sugestoesRecepcao(itens) {
  const nomes = (itens || []).filter(i => i.tipo === 'servico').map(i => i.descricao);
  const vistos = new Set(nomes.map(n => n.toLowerCase()));
  const saida = [];
  OFERTAS_RECEPCAO.forEach(regra => {
    if (!nomes.some(n => regra.chave.test(n))) return;
    regra.oferecer.forEach(nome => {
      if (vistos.has(nome.toLowerCase())) return;
      vistos.add(nome.toLowerCase());
      saida.push({ id: 'ofr-' + nome, servico: nome, motivo: regra.motivo, valor: valorDoServico(nome) });
    });
  });
  return saida;
}

/* Peças da ordem sem saldo suficiente no estoque.
   Recebe um índice opcional: varrer d.pecas por item deixaria a checagem
   quadrática, e ela roda para toda ordem ativa a cada recálculo. */
const indicePecas = (d) => new Map((d.pecas || []).map(p => [p.id, p]));

function pecasFaltantes(o, d, indice) {
  if (!o) return [];
  const ix = indice || indicePecas(d);
  const faltas = [];
  o.itens.forEach(i => {
    if (i.tipo !== 'peca' || !i.peca_id) return;
    const p = ix.get(i.peca_id);
    if (p && p.quantidade < i.quantidade) faltas.push({ descricao: i.descricao, precisa: i.quantidade, tem: p.quantidade });
  });
  return faltas;
}

/** Roda o motor no escopo pedido e devolve a lista já ordenada por peso. */
function pensar(escopo, ctx) {
  return REGRAS_IA
    .filter(r => r.escopo === escopo)
    .map(r => {
      let saida = null;
      try { saida = r.quando(ctx) ? r.gerar(ctx) : null; } catch (e) { saida = null; }
      return saida ? { id: r.id, peso: r.peso, sigiloso: r.sigiloso || null, ...saida } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.peso - a.peso);
}

/** Leitura completa da oficina — é o que o painel do assistente mostra e o que
    seria enviado a um provedor externo, se algum fosse ligado. */
function lerOficina(d, m) {
  const itens = [...pensar('oficina', { d, m })];
  const ixPecas = indicePecas(d);

  /* Toda ordem ativa entra. Cortar por posição na lista silenciava justamente
     a regra de peça faltando quando o pátio passava de oito carros — que é
     quando ela mais importa. O índice acima mantém o custo linear. */
  m.ativas.forEach(o => {
    const faltantes = pecasFaltantes(o, d, ixPecas);
    pensar('ordem', { o, m, d, faltantes }).forEach(s => itens.push({ ...s,
      id: s.id + '-' + o.id, alvo: { abrirOS: o.id }, refIcone: 'prancheta', ref: 'OS ' + o.numero }));
  });

  /* Veículos que estão na oficina agora + os mais urgentes da carteira. O
     recepcionista precisa do carro que está no elevador, não só do ranking. */
  const alvoVeiculos = new Map();
  m.ativas.forEach(o => { if (o.veiculo) alvoVeiculos.set(o.veiculo_id, m.veiculos.find(v => v.id === o.veiculo_id)); });
  m.preventiva.slice(0, 8).forEach(v => alvoVeiculos.set(v.id, v));
  [...alvoVeiculos.values()].filter(Boolean).forEach(v => {
    const garantias = m.garantiasPorVeiculo.get(v.id) || [];
    pensar('veiculo', { v, m, d, garantias }).forEach(s => itens.push({ ...s,
      id: s.id + '-' + v.id, alvo: { abrirVeiculo: v.id }, refIcone: 'carro', ref: v.marca + ' ' + v.modelo }));
  });

  m.clientes.filter(c => c.concluidas.length > 0).forEach(c => {
    pensar('cliente', { c, m, d }).forEach(s => itens.push({ ...s,
      id: s.id + '-' + c.id, alvo: { abrirCliente: c.id }, refIcone: 'pessoa', ref: c.nome }));
  });

  const ordem = { alta: 0, oferta: 1, normal: 2 };
  return itens.sort((a, b) => (ordem[a.tom] - ordem[b.tom]) || (b.peso - a.peso));
}

/* ══ 6.5 ALERTAS COMPLEMENTARES ══
   Mesmo formato dos achados da fase 2 (id, gravidade, icone, categoria,
   titulo, texto, acao), então o cartão <Achado/> existente renderiza os dois
   sem saber a diferença. O motor original continua intocado.            */
function alertasExtras(d, m) {
  const extras = [];
  const add = (a) => extras.push(a);

  m.garantiasVigentes.filter(g => g.dias <= 15).forEach(g => add({
    id: 'gar-vencendo-' + g.os.id, gravidade: g.dias <= 5 ? 'atencao' : 'informativo',
    icone: 'escudo', categoria: 'operacao',
    titulo: 'Garantia da OS ' + g.os.numero + (g.dias <= 0 ? ' vence hoje' : ' vence em ' + g.dias + ' dias'),
    texto: (g.os.veiculo?.marca || '') + ' ' + (g.os.veiculo?.modelo || '') + ', placa ' + (g.os.veiculo?.placa || '—')
      + '. Cobertura até ' + fmtData(g.ate) + '. Vale uma ligação de cortesia antes de encerrar.',
    acao: { rotulo: 'Abrir ordem', abrirOS: g.os.id },
  }));

  const ixPecas = indicePecas(d);
  m.ativas.forEach(o => {
    const faltas = pecasFaltantes(o, d, ixPecas);
    if (!faltas.length) return;
    add({
      id: 'falta-peca-' + o.id, gravidade: 'critico', icone: 'caixa', categoria: 'estoque',
      titulo: 'OS ' + o.numero + ' sem peça para concluir',
      texto: faltas.map(f => f.descricao + ' — precisa ' + f.precisa + ', há ' + f.tem).join('; ')
        + '. ' + (o.veiculo?.marca || '') + ' ' + (o.veiculo?.modelo || '') + ' fica parado até a compra.',
      acao: { rotulo: 'Abrir ordem', abrirOS: o.id },
    });
  });

  const ciclo = m.tempoEtapa.reduce((s, x) => s + x.media, 0);
  if (ciclo > 0) {
    m.ativas.filter(o => o.dias > ciclo * 1.8 && o.dias >= 4).slice(0, 6).forEach(o => add({
      id: 'atrasada-' + o.id, gravidade: 'atencao', icone: 'relogio', categoria: 'operacao',
      titulo: 'OS ' + o.numero + ' passou do ciclo médio da oficina',
      texto: o.dias + ' dias em aberto contra ciclo médio de ' + ciclo.toFixed(1)
        + ' dias. Etapa atual: ' + etapaNome(o.etapa).toLowerCase() + '.',
      acao: { rotulo: 'Abrir ordem', abrirOS: o.id },
    }));
  }

  const prontos = m.prontas.filter(o => o.dias >= 2);
  if (prontos.length) add({
    id: 'retirada-parada', gravidade: 'atencao', icone: 'carro', categoria: 'operacao',
    titulo: prontos.length + (prontos.length === 1 ? ' veículo pronto' : ' veículos prontos') + ' sem retirada',
    texto: 'Já liberados e ocupando vaga. ' + prontos.slice(0, 3).map(o => o.veiculo?.modelo).join(', ') + '.',
    acao: { rotulo: 'Ver pátio', ir: 'patio' },
  });

  const aReceber = m.aguardandoPagamento;
  if (aReceber.length) add({
    id: 'entregue-sem-pagar', gravidade: 'atencao', icone: 'carteira', categoria: 'financeiro',
    titulo: brl(aReceber.reduce((s, x) => s + x.lancamento.valor, 0)) + ' entregues e ainda não recebidos',
    texto: aReceber.length + (aReceber.length === 1 ? ' ordem entregue' : ' ordens entregues') + ' com título em aberto.',
    acao: { rotulo: 'Ver financeiro', ir: 'financeiro' },
  });

  const semGarantiaDefinida = m.ativas.filter(o => (o.garantia_dias ?? GARANTIA_PADRAO) === 0);
  if (semGarantiaDefinida.length) add({
    id: 'sem-garantia', gravidade: 'informativo', icone: 'escudo', categoria: 'operacao',
    titulo: semGarantiaDefinida.length + ' ordem(ns) sem prazo de garantia',
    texto: 'Ordem sem garantia declarada vira discussão na volta do cliente. O padrão da casa é '
      + GARANTIA_PADRAO + ' dias.',
    acao: { rotulo: 'Ver ordens', ir: 'ordens' },
  });

  const semVeiculoRodando = m.veiculos.filter(v => v.concluidas.length === 0);
  if (semVeiculoRodando.length >= 3) add({
    id: 'cadastro-frio', gravidade: 'informativo', icone: 'carro', categoria: 'clientes',
    titulo: semVeiculoRodando.length + ' veículos cadastrados nunca voltaram',
    texto: 'Cadastro sem nenhuma ordem concluída. É a lista mais barata de reativação que existe.',
    acao: { rotulo: 'Ver veículos', ir: 'veiculos' },
  });

  return extras.sort((a, b) => GRAVIDADE_ORDEM[a.gravidade] - GRAVIDADE_ORDEM[b.gravidade]);
}

/* ══ 6.6 RENTABILIDADE, RELATÓRIOS E PORTAL ══ */

/** Lucro por mecânico. As métricas existentes trazem receita; aqui entra
    custo, lucro e margem, sem tocar no cálculo original. */
function lucroPorMecanico(m) {
  const mapa = new Map(MECANICOS.map(x => [x.id, { ...x, ordens: 0, receita: 0, custo: 0, lucro: 0, horas: 0 }]));
  m.concluidas.forEach(o => {
    const r = mapa.get(o.mecanico);
    if (!r) return;
    r.ordens += 1; r.receita += o.totais.liquido; r.custo += o.totais.custo; r.lucro += o.totais.lucro;
  });
  return [...mapa.values()].map(r => ({ ...r,
    margem: r.receita > 0 ? (r.lucro / r.receita) * 100 : 0,
    ticket: r.ordens ? r.receita / r.ordens : 0,
  })).sort((a, b) => b.lucro - a.lucro);
}

/** Despesas agrupadas por categoria, só o que teve baixa. */
function despesasPorCategoria(d, desdeTs) {
  const mapa = new Map();
  (d.lancamentos || []).filter(l => l.tipo === 'pagar' && l.status === 'pago' && l.pago_em)
    .filter(l => !desdeTs || dataLocal(l.pago_em).getTime() >= desdeTs)
    .forEach(l => {
      const at = mapa.get(l.categoria) || { nome: l.categoria, valor: 0, n: 0 };
      at.valor += l.valor; at.n += 1; mapa.set(l.categoria, at);
    });
  return [...mapa.values()].sort((a, b) => b.valor - a.valor);
}

/** Comparativo entre o mês corrente, o anterior e a média dos doze meses. */
function comparativoMensal(m) {
  const atual = m.mesAtual, anterior = m.mesAnterior;
  const cheios = m.meses.slice(0, -1).filter(x => x.receita > 0);
  const media = cheios.length ? cheios.reduce((s, x) => s + x.receita, 0) / cheios.length : 0;
  const lucroDe = (x) => x ? x.receita - x.custo : 0;
  const varia = (a, b) => b > 0 ? ((a - b) / b) * 100 : null;
  return {
    receita: { atual: atual.receita, anterior: anterior?.receita || 0, media,
      difAnterior: varia(atual.receita, anterior?.receita || 0), difMedia: varia(atual.receita, media) },
    lucro: { atual: lucroDe(atual), anterior: lucroDe(anterior),
      difAnterior: varia(lucroDe(atual), lucroDe(anterior)) },
    ordens: { atual: atual.ordens, anterior: anterior?.ordens || 0,
      difAnterior: varia(atual.ordens, anterior?.ordens || 0) },
    ticket: { atual: atual.ordens ? atual.receita / atual.ordens : 0,
      anterior: anterior?.ordens ? anterior.receita / anterior.ordens : 0,
      difAnterior: varia(atual.ordens ? atual.receita / atual.ordens : 0,
        anterior?.ordens ? anterior.receita / anterior.ordens : 0) },
    projecao: m.projecaoMes,
  };
}

/** Pacote que o portal do cliente exibiria. Só sai daqui o que o cliente pode
    ver: sem custo de peça, sem margem, sem documento, sem observação interna. */
function pacotePortal(o, d, m) {
  if (!o) return null;
  const etapa = etapaPor(o.etapa);
  const passos = ETAPAS.map((e, i) => ({
    id: e.id, nome: e.nome,
    estado: o.etapa === 'concluida' ? 'feito'
      : e.id === o.etapa ? 'atual' : (i < etapaIndice(o.etapa) ? 'feito' : 'pendente'),
  }));
  const fotos = (d.anexos || []).filter(a => a.os_id === o.id
    && ['entrada', 'servico', 'peca'].includes(a.tipo) && String(a.formato || '').startsWith('image'));
  const garantia = o.garantiaAte
    ? { ate: o.garantiaAte, dias: Math.ceil((o.garantiaAte.getTime() - Date.now()) / 86400000),
        prazo: o.garantia_dias || GARANTIA_PADRAO }
    : null;
  const historico = (m.veiculos.find(v => v.id === o.veiculo_id)?.concluidas || [])
    .slice(0, 6).map(x => ({ numero: x.numero, data: x.concluida_em, km: x.km_entrada,
      servico: x.itens.find(i => i.tipo === 'servico')?.descricao || 'Serviço', valor: x.totais.liquido }));
  return {
    referencia: 'OS-' + String(o.numero).padStart(5, '0'),
    token: tokenPortal(o),
    cliente: primeiroNome(o.cliente?.nome),
    veiculo: { modelo: (o.veiculo?.marca || '') + ' ' + (o.veiculo?.modelo || ''), placa: o.veiculo?.placa, km: o.km_entrada },
    situacao: { etapa: etapa.id, nome: etapa.nome, situacao: etapa.situacao, desde: o.aberta_em, dias: o.dias },
    passos,
    orcamento: {
      status: o.statusOrcamento,
      itens: o.itens.map(i => ({ descricao: i.descricao, tipo: i.tipo, quantidade: i.quantidade,
        total: i.quantidade * i.preco_unitario })),
      desconto: o.desconto, total: o.totais.liquido,
      validade: o.validade, aprovadaEm: o.aprovada_em,
    },
    fotos: fotos.map(a => ({ id: a.id, url: a.url, rotulo: TIPOS_ANEXO.find(t => t.id === a.tipo)?.nome || 'Foto' })),
    garantia, historico,
    mecanico: mecanicoNome(o.mecanico),
    entregaPrevista: o.validade,
  };
}

/* Referência pública estável, derivada da própria ordem: mesma OS gera sempre
   o mesmo código, e o código não revela o número sequencial nem o cliente.
   Quando o portal for ao ar, isto vira coluna com índice — a assinatura da
   função não muda. */
/** Doze caracteres sorteados. `aleatorio` permite semear na base de
    demonstração; sem ele, usa o gerador do navegador. */
/* AUDITORIA: usava Math.random(). O gerador do V8 (xorshift128+) tem o
   estado interno recuperável a partir de poucas saídas — quem abrisse um
   único link do próprio orçamento conseguia prever o token de todas as
   outras ordens e ler nome, documento, veículo e valores dos demais
   clientes. Com banco, o token nasce no servidor (app.token_novo, 20 bytes
   de gen_random_bytes) e este caminho só serve à base de demonstração.    */
function sortearToken(aleatorio) {
  const letras = 'abcdefghijkmnpqrstuvwxyz23456789';   // sem l, o, 0 e 1
  let t = '';
  if (!aleatorio && crypto?.getRandomValues) {
    const bytes = crypto.getRandomValues(new Uint8Array(20));
    for (let i = 0; i < 20; i++) t += letras[bytes[i] % letras.length];
    return t;
  }
  const r = aleatorio || Math.random;
  for (let i = 0; i < 20; i++) t += letras[Math.floor(r() * letras.length)];
  return t;
}

/* AUDITORIA (fase 12): a queda para o número saiu daqui. Ela derivava o token
   de `numero + aberta_em` com um algoritmo que mora neste arquivo público —
   qualquer pessoa recalculava o endereço de qualquer ordem antiga e lia o
   orçamento do cliente dos outros. Sem token gravado agora não há link, que é
   a resposta certa: link que não existe é melhor do que link que se adivinha. */
function tokenPortal(o) {
  return (o && typeof o.portal_token === 'string' && o.portal_token.length >= 8) ? o.portal_token : '';
}

/* ══ 6.7 GRÁFICOS E PEÇAS NOVAS ══ */

const CORES_SERIE = ['var(--azul-acao)', 'var(--ciano)', 'var(--roxo)', 'var(--alerta)', 'var(--ok)', 'var(--tinta-3)'];

/** Rosca em SVG puro, no mesmo espírito dos gráficos já existentes. */
function Rosca({ dados, tamanho = 176, espessura = 26, formato = brlCurto }) {
  if (!dados || !dados.length) return html`<p class="silencioso">Ainda sem dados suficientes.</p>`;
  const total = dados.reduce((s, d) => s + d.valor, 0);
  if (total <= 0) return html`<p class="silencioso">Nenhum valor no período.</p>`;
  const r = (tamanho - espessura) / 2;
  const c = tamanho / 2;
  const volta = 2 * Math.PI * r;
  let acumulado = 0;
  return html`
    <div class="rosca-bloco">
      <svg width=${tamanho} height=${tamanho} viewBox=${'0 0 ' + tamanho + ' ' + tamanho}
        role="img" aria-label="Distribuição por categoria" style="flex-shrink:0">
        <circle cx=${c} cy=${c} r=${r} fill="none" stroke="var(--linha-suave)" stroke-width=${espessura} />
        ${dados.map((d, i) => {
          const fatia = (d.valor / total) * volta;
          const deslocamento = -acumulado;
          acumulado += fatia;
          return html`<circle key=${d.nome} cx=${c} cy=${c} r=${r} fill="none"
            stroke=${CORES_SERIE[i % CORES_SERIE.length]} stroke-width=${espessura}
            stroke-dasharray=${fatia.toFixed(2) + ' ' + (volta - fatia).toFixed(2)}
            stroke-dashoffset=${deslocamento.toFixed(2)}
            transform=${'rotate(-90 ' + c + ' ' + c + ')'} />`;
        })}
        <text x=${c} y=${c - 3} text-anchor="middle" font-size="12" fill="var(--tinta-3)" font-family="var(--fonte)">Total</text>
        <text x=${c} y=${c + 15} text-anchor="middle" font-size="15" font-weight="600" fill="var(--tinta)"
          font-family="var(--mono)">${formato(total)}</text>
      </svg>
      <div class="rosca-legenda">
        ${dados.map((d, i) => html`
          <div key=${d.nome}>
            <span class="bolinha" style=${'background:' + CORES_SERIE[i % CORES_SERIE.length]}></span>
            <span class="nome-cat corta">${d.nome}</span>
            <span class="val-cat">${formato(d.valor)}</span>
            <span class="silencioso" style="width:42px;text-align:right">${pct((d.valor / total) * 100)}</span>
          </div>`)}
      </div>
    </div>`;
}

/** Colunas mensais com duas séries — receita e lucro lado a lado. */
function GraficoColunas({ dados, altura = 220, chaves = ['receita', 'lucro'], rotulos = ['Receita', 'Lucro'] }) {
  const L = 46, R = 8, T = 14, B = 26, larg = 640;
  const cx = larg - L - R, cy = altura - T - B;
  const max = Math.max(1, ...dados.flatMap(d => chaves.map(k => d[k] || 0))) * 1.14;
  const passo = cx / Math.max(1, dados.length);
  const larguraBarra = Math.min(15, (passo - 6) / chaves.length);
  const py = (v) => T + cy - (Math.max(0, v) / max) * cy;
  const marcas = [0, 0.5, 1].map(f => max * f);
  return html`
    <svg viewBox=${'0 0 ' + larg + ' ' + altura} width="100%" height=${altura} role="img"
      aria-label=${rotulos.join(' e ') + ' por mês'}>
      ${marcas.map((v, i) => html`
        <g key=${i}>
          <line x1=${L} y1=${py(v)} x2=${larg - R} y2=${py(v)} stroke="var(--linha-suave)" stroke-width="1" />
          <text x=${L - 8} y=${py(v) + 4} text-anchor="end" font-size="11" fill="var(--tinta-3)"
            font-family="var(--mono)">${Math.round(v / 1000)}k</text>
        </g>`)}
      ${dados.map((d, i) => html`
        <g key=${d.rotulo}>
          ${chaves.map((k, j) => {
            const alturaBarra = Math.max(1, T + cy - py(d[k] || 0));
            const x = L + i * passo + (passo - larguraBarra * chaves.length - 3) / 2 + j * (larguraBarra + 3);
            return html`<rect key=${k} x=${x.toFixed(1)} y=${py(d[k] || 0).toFixed(1)}
              width=${larguraBarra.toFixed(1)} height=${alturaBarra.toFixed(1)} rx="3"
              fill=${j === 0 ? 'var(--azul-acao)' : 'var(--ciano)'} opacity=${j === 0 ? 1 : .85} />`;
          })}
          <text x=${(L + i * passo + passo / 2).toFixed(1)} y=${altura - 8} text-anchor="middle"
            font-size="10.5" fill="var(--tinta-3)">${d.rotulo}</text>
        </g>`)}
    </svg>`;
}

/** Cartão de sugestão do assistente — usado no painel e no rodapé das telas. */
function Sugestao({ s, aoAbrir }) {
  return html`
    <div class="ia-sugestao">
      <span class=${'ia-marca' + (s.tom === 'alta' ? ' alta' : s.tom === 'oferta' ? ' oferta' : '')}>
        <${Icone} nome=${s.tom === 'alta' ? 'alerta' : s.tom === 'oferta' ? 'faisca' : 'robo'} tam=${15} /></span>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap">
          <span style="font-size:13px;font-weight:600">${s.titulo}</span>
          ${s.ref ? html`<span class="silencioso" style="display:inline-flex;align-items:center;gap:4px">
            <${Icone} nome=${s.refIcone || 'seta'} tam=${12} />${s.ref}</span>` : null}
        </div>
        <p class="silencioso" style="margin-top:3px;line-height:1.45">${s.texto}</p>
        <p class="ia-fonte">${s.fonte}</p>
        ${s.alvo && aoAbrir ? html`
          <button class="btn btn-neutro btn-p" style="margin-top:8px" onClick=${() => aoAbrir(s.alvo)}>
            Abrir<${Icone} nome="seta" tam=${13} /></button>` : null}
      </div>
    </div>`;
}

/* ══ 6.8 TELAS NOVAS ══════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────────────────────────────
   CENTRO DE ALERTAS
   Junta o motor de análise da fase 2 com as regras novas em uma tela só.
   O sino do topo continua funcionando exatamente como antes.
   ────────────────────────────────────────────────────────────────────────── */
function TelaAlertas() {
  const { dados, metricas, achados, acoes, irPara, papel } = usar();
  const [teto, setTeto] = useState(60);   // ver AUDITORIA de volume na gaveta
  const extras = useMemo(() => alertasExtras(dados, metricas), [dados, metricas]);

  /* Alertas que revelam margem ou custo não aparecem para quem não tem a
     capacidade `custo` — mesma regra que o resto do sistema aplica no
     prontuário, no orçamento e nos relatórios. A lista é declarada aqui e
     não no motor: o motor continua produzindo tudo, cada tela decide o que
     mostra. Isso mantém a gaveta do sino exatamente como sempre foi. */
  const ALERTAS_DE_CUSTO = ['margem'];
  const podeCusto = PAPEIS[papel].custo;
  const filtrarSigilo = (lista) => podeCusto ? lista : lista.filter(a => !ALERTAS_DE_CUSTO.includes(a.id));

  const todos = useMemo(() => filtrarSigilo([...achados, ...extras])
    .sort((a, b) => GRAVIDADE_ORDEM[a.gravidade] - GRAVIDADE_ORDEM[b.gravidade]), [achados, extras, podeCusto]);

  const [gravidade, setGravidade] = useState('tudo');
  const [categoria, setCategoria] = useState('todas');

  const CATS = [
    { id: 'todas', nome: 'Todas as áreas' }, { id: 'operacao', nome: 'Operação' },
    { id: 'estoque', nome: 'Estoque' }, { id: 'financeiro', nome: 'Financeiro' }, { id: 'clientes', nome: 'Clientes' },
  ];
  const NIVEIS = [
    { id: 'critico', nome: 'Críticos', apoio: 'Resolver hoje' },
    { id: 'atencao', nome: 'Atenção', apoio: 'Esta semana' },
    { id: 'informativo', nome: 'Informativos', apoio: 'Quando der' },
    { id: 'positivo', nome: 'Positivos', apoio: 'Está indo bem' },
  ];

  const conta = (g) => todos.filter(a => a.gravidade === g).length;
  const lista = todos
    .filter(a => gravidade === 'tudo' || a.gravidade === gravidade)
    .filter(a => categoria === 'todas' || a.categoria === categoria);

  const porGrupo = NIVEIS.map(n => ({ ...n, itens: lista.filter(a => a.gravidade === n.id) })).filter(g => g.itens.length);
  const naoLidos = todos.filter(a => !dados.lidos.includes(a.id) && a.gravidade !== 'positivo').length;

  return html`
    <div style="display:flex;flex-direction:column;gap:16px" class="entra">

      <div class="painel-gravidade">
        <button aria-pressed=${gravidade === 'tudo'} onClick=${() => setGravidade('tudo')}>
          <div class="n">${todos.length}</div>
          <div class="r">Todos os alertas</div>
        </button>
        ${NIVEIS.map(n => html`
          <button key=${n.id} aria-pressed=${gravidade === n.id} onClick=${() => setGravidade(g => g === n.id ? 'tudo' : n.id)}>
            <div class="n" style=${conta(n.id) && n.id !== 'positivo' ? 'color:var(--' + (n.id === 'critico' ? 'erro' : n.id === 'atencao' ? 'alerta' : 'tinta') + ')' : ''}>${conta(n.id)}</div>
            <div class="r"><i class=${'pastilha ' + n.id}></i>${n.nome}</div>
          </button>`)}
      </div>

      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <div class="filtros">
          ${CATS.map(c => html`
            <button key=${c.id} class="filtro" aria-pressed=${categoria === c.id} onClick=${() => setCategoria(c.id)}>${c.nome}</button>`)}
        </div>
        <span style="flex:1"></span>
        ${naoLidos > 0 ? html`
          <button class="btn btn-neutro btn-p" onClick=${acoes.lerTudo}>
            <${Icone} nome="check" tam=${13} />Marcar ${naoLidos} como lidos</button>` : null}
      </div>

      ${todos.filter(a => a.gravidade === 'critico').length === 0 ? html`
        <div class="aviso aviso-ok"><${Icone} nome="check" tam=${16} />
          <span>Nenhum alerta crítico agora. O que estiver abaixo é acompanhamento, não urgência.</span></div>` : null}

      ${porGrupo.length === 0
        ? html`<${Cartao}><${Vazio} icone="check" titulo="Nada nesta combinação"
            apoio="Troque o nível ou a área para ver os demais alertas." /><//>`
        : porGrupo.map(g => html`
          <div key=${g.id}>
            <div class="grupo-alerta">
              <i class=${'pastilha ' + g.id}></i>
              <span class="titulo">${g.nome}</span>
              <span class="silencioso">${g.itens.length} · ${g.apoio}</span>
              <span class="fio-grupo"></span>
            </div>
            <div class="grade g-2">
              ${g.itens.slice(0, teto).map(a => html`<${Achado} key=${a.id} a=${a} lido=${dados.lidos.includes(a.id)} />`)}
              ${g.itens.length > teto ? html`
                <button class="btn btn-neutro btn-bloco" style="margin-top:10px"
                  onClick=${() => setTeto(x => x + 60)}>
                  Ver mais ${Math.min(60, g.itens.length - teto)} de ${g.itens.length - teto} restantes</button>` : null}
            </div>
          </div>`)}

      <${Cartao}>
        <div class="cartao-topo"><div>
          <h3>De onde vem cada alerta</h3>
          <p class="silencioso">Nada aqui é digitado à mão: tudo é lido da base a cada mudança.</p>
        </div></div>
        <div class="grade g-3" style="gap:10px">
          ${[['Operação', 'Pátio, prazos, garantias e ordens paradas', 'colunas'],
             ['Estoque', 'Saldo mínimo, peça zerada e item sem giro', 'caixa'],
             ['Financeiro', 'Vencimentos, recebimentos e margem', 'carteira'],
             ['Clientes', 'Retorno, preventiva e cadastro frio', 'pessoas'],
             ['Garantia', 'Cobertura vencendo nos próximos 15 dias', 'escudo'],
             ['Ritmo', 'Ordens acima do ciclo médio da própria oficina', 'relogio']].map(([t, d, ic]) => html`
            <div key=${t} style="display:flex;gap:10px;padding:11px;background:var(--superficie-2);border-radius:var(--raio)">
              <span style="width:28px;height:28px;border-radius:8px;background:var(--superficie);color:var(--tinta-3);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <${Icone} nome=${ic} tam=${14} /></span>
              <div>
                <div style="font-size:12.5px;font-weight:600">${t}</div>
                <div class="silencioso" style="line-height:1.4">${d}</div>
              </div>
            </div>`)}
        </div>
      <//>
    </div>`;
}

/* ──────────────────────────────────────────────────────────────────────────
   LINHA DO TEMPO DO VEÍCULO
   Prontuário continua onde estava e como estava. Aqui a mesma história vem
   completa: primeira visita, ordens abertas e fechadas, km, fotos, garantia,
   peças, mecânico, valor de cada passagem e total acumulado.
   ────────────────────────────────────────────────────────────────────────── */
function LinhaTempo({ veiculoId, compacto }) {
  const { dados, metricas, abrirOS, papel } = usar();
  const v = metricas.veiculos.find(x => x.id === veiculoId);
  const podeCusto = PAPEIS[papel].custo;

  const eventos = useMemo(() => {
    if (!v) return [];
    const garantias = metricas.garantias.filter(g => g.os.veiculo_id === v.id);
    const lista = (v.ordens || []).map(o => {
      const quando = o.concluida_em || o.aberta_em;
      const g = garantias.find(x => x.os.id === o.id);
      return {
        os: o, quando, ts: dataLocal(quando).getTime(),
        aberta: ehAtiva(o), cancelada: o.etapa === 'cancelada',
        garantia: g || null,
        fotos: (dados.anexos || []).filter(a => a.os_id === o.id && String(a.formato || '').startsWith('image')),
        servicos: o.itens.filter(i => i.tipo === 'servico'),
        pecas: o.itens.filter(i => i.tipo === 'peca'),
      };
    });
    return lista.sort((a, b) => b.ts - a.ts);
  }, [v, dados.anexos, metricas.garantias]);

  if (!v) return html`<${Cartao}><${Vazio} icone="carro" titulo="Veículo não encontrado" /><//>`;

  const primeira = eventos[eventos.length - 1];
  const totalGasto = v.concluidas.reduce((s, o) => s + o.totais.liquido, 0);
  const totalCliente = metricas.clientes.find(c => c.id === v.cliente_id)?.gasto || 0;
  const mecanicos = [...new Set(v.concluidas.map(o => o.mecanico))];

  return html`
    <div style="display:flex;flex-direction:column;gap:15px">
      ${!compacto ? html`
        <div class="lt-cabeca">
          <${Placa} valor=${v.placa} tam="g" />
          <div style="flex:1;min-width:170px">
            <div style="font-size:16px;font-weight:600">${v.marca} ${v.modelo}</div>
            <div class="silencioso">${v.ano_modelo} · ${v.cor} · ${inteiro(v.km_atual)} km · ${v.cliente?.nome}</div>
          </div>
          ${v.revisaoVencida ? html`<${Selo} tom="alerta" icone="faisca">Revisão vencida<//>` : null}
          ${(metricas.garantiasPorVeiculo.get(v.id) || []).length ? html`<${Selo} tom="ok" icone="escudo">Garantia ativa<//>` : null}
        </div>` : null}

      <div class="lt-resumo">
        ${[['Primeira visita', primeira ? fmtData(primeira.quando) : '—'],
           ['Passagens', eventos.length],
           ['Concluídas', v.concluidas.length],
           ['Gasto no veículo', brlCurtoBruto(totalGasto)],
           ['Gasto do cliente', brlCurtoBruto(totalCliente)],
           ['Mecânicos', mecanicos.length || '—']].map(([k, val]) => html`
          <div key=${k}>
            <div class="rotulo" style="font-size:10px">${k}</div>
            <div class="num" style="font-size:15px;margin-top:3px">${val}</div>
          </div>`)}
      </div>

      ${eventos.length === 0
        ? html`<${Vazio} icone="historico" titulo="Nenhuma passagem registrada"
            apoio="A linha do tempo começa na primeira ordem aberta para este veículo." />`
        : html`
          <div class="lt-lista">
            ${eventos.map((e, i) => {
              const ehPrimeira = i === eventos.length - 1;
              const classe = e.aberta ? 'aberta' : i === 0 ? 'atual' : ehPrimeira ? 'primeira' : '';
              return html`
                <div key=${e.os.id} class="lt-item">
                  <div class="lt-eixo">
                    <span class=${'lt-marco ' + classe}>
                      <${Icone} nome=${e.cancelada ? 'x' : e.aberta ? 'relogio' : ehPrimeira ? 'faisca' : 'check'} tam=${13} /></span>
                    ${i < eventos.length - 1 ? html`<span class="lt-fio"></span>` : null}
                  </div>
                  <div class="lt-corpo">
                    <button class="lt-cartao" onClick=${() => abrirOS(e.os.id)}>
                      <div class="lt-linha1">
                        <span class="lt-servico">
                          ${e.servicos.length ? e.servicos.map(s => s.descricao).join(' + ') : 'Ordem sem serviço lançado'}
                        </span>
                        <span class="lt-valor">${brlBruto(e.os.totais.liquido)}</span>
                      </div>

                      <div class="lt-meta">
                        <span><${Icone} nome="calendario" tam=${12} />${fmtDataLonga(e.quando)}</span>
                        <span><${Icone} nome="carro" tam=${12} />${inteiro(e.os.km_entrada)} km</span>
                        <span><${Icone} nome="prancheta" tam=${12} />OS ${e.os.numero}</span>
                        <span><${Icone} nome="pessoa" tam=${12} />${mecanicoNome(e.os.mecanico)}</span>
                        ${e.os.desconto > 0 ? html`<span><${Icone} nome="alvo" tam=${12} />desconto de ${brlBruto(e.os.desconto)}</span>` : null}
                      </div>

                      <div class="lt-selos">
                        ${e.aberta ? html`<${SeloSituacao} etapa=${e.os.etapa} />` : null}
                        ${e.cancelada ? html`<${Selo} tom="erro">Cancelada<//>` : null}
                        ${e.garantia ? html`
                          <span class=${'selo-garantia ' + situacaoGarantia(e.garantia.dias)}>
                            <${Icone} nome="escudo" tam=${12} />
                            ${e.garantia.dias >= 0 ? 'garantia até ' + fmtData(e.garantia.ate) : 'garantia vencida em ' + fmtData(e.garantia.ate)}
                          </span>` : null}
                        ${ehPrimeira ? html`<${Selo} tom="roxo">Primeira visita<//>` : null}
                      </div>

                      ${e.pecas.length ? html`
                        <div class="lt-selos">
                          ${e.pecas.map(p => html`
                            <span key=${p.id} class="selo" style="font-size:11px">
                              ${p.descricao}${p.quantidade > 1 ? ' ×' + p.quantidade : ''}</span>`)}
                        </div>` : null}

                      ${e.fotos.length ? html`
                        <div class="lt-fotos">
                          ${e.fotos.slice(0, 6).map(f => html`
                            <span key=${f.id} class="lt-foto"><img src=${f.url} alt=${f.nome} loading="lazy" /></span>`)}
                          ${e.fotos.length > 6 ? html`<span class="silencioso" style="align-self:center">+${e.fotos.length - 6}</span>` : null}
                        </div>` : null}

                      ${e.os.obs_tecnica ? html`<p class="lt-nota">${e.os.obs_tecnica}</p>` : null}
                      ${e.os.motivo_recusa ? html`<p class="lt-nota">Recusado: ${e.os.motivo_recusa}</p>` : null}
                      ${podeCusto && e.os.etapa === 'concluida' ? html`
                        <div class="silencioso" style="margin-top:6px">
                          Custo ${brlBruto(e.os.totais.custo)} · lucro ${brlBruto(e.os.totais.lucro)} · margem ${pct(e.os.totais.margem)}</div>` : null}
                    </button>
                  </div>
                </div>`;
            })}
          </div>`}
    </div>`;
}

function TelaTimeline() {
  const { dados, metricas, abrirVeiculo } = usar();
  const [busca, setBusca] = useState('');
  const buscaLenta = useAtraso(busca);
  const [escolhido, setEscolhido] = useState(null);

  const ordenados = useMemo(() => {
    const q = String(buscaLenta || '').trim().toLowerCase();
    return metricas.veiculos
      .filter(v => !q || [v.placa, v.marca, v.modelo, v.cliente?.nome].some(x => String(x || '').toLowerCase().includes(q)))
      .sort((a, b) => {
        const ta = a.ultima ? dataLocal(a.ultima.concluida_em).getTime() : 0;
        const tb = b.ultima ? dataLocal(b.ultima.concluida_em).getTime() : 0;
        return tb - ta;
      });
  }, [metricas.veiculos, buscaLenta]);

  const alvo = escolhido || ordenados[0]?.id || null;

  return html`
    <div class="grade g-2-1 entra" style="align-items:start">
      <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
        ${alvo
          ? html`<${Cartao}>
              <div class="cartao-topo">
                <div><h3>Histórico completo</h3>
                  <p class="silencioso">Ordem por ordem, do mais recente para a primeira visita</p></div>
                <button class="btn btn-neutro btn-p esconde-mobile" onClick=${() => abrirVeiculo(alvo)}>
                  Abrir prontuário<${Icone} nome="seta" tam=${13} /></button>
              </div>
              <${LinhaTempo} veiculoId=${alvo} />
            <//>`
          : html`<${Cartao}><${Vazio} icone="carro" titulo="Nenhum veículo encontrado"
              apoio="Ajuste a busca ao lado para localizar pela placa, modelo ou dono." /><//>`}
      </div>

      <${Cartao}>
        <div class="cartao-topo"><div>
          <h3>Escolha o veículo</h3>
          <p class="silencioso">${ordenados.length} na base, os que passaram há menos tempo primeiro</p>
        </div></div>
        <div class="busca" style="margin-bottom:11px">
          <${Icone} nome="busca" tam=${15} cor="var(--tinta-3)" />
          <input value=${busca} onInput=${e => setBusca(e.target.value)}
            placeholder="Placa, modelo ou dono" aria-label="Buscar veículo" />
        </div>
        <div class="lista-escolha">
          ${ordenados.slice(0, 60).map(v => html`
            <button key=${v.id} class="opcao-veiculo" aria-pressed=${alvo === v.id} onClick=${() => setEscolhido(v.id)}>
              <${Placa} valor=${v.placa} tam="p" />
              <div style="flex:1;min-width:0">
                <div class="corta" style="font-size:13px;font-weight:600">${v.marca} ${v.modelo}</div>
                <div class="silencioso corta">${v.cliente?.nome || '—'} · ${v.concluidas.length} passagens</div>
              </div>
              ${v.revisaoVencida ? html`<i class="pastilha atencao" title="Revisão vencida"></i>` : null}
            </button>`)}
          ${ordenados.length === 0 ? html`<p class="silencioso">Nada encontrado com esse termo.</p>` : null}
        </div>
      <//>
    </div>`;
}

/* ──────────────────────────────────────────────────────────────────────────
   PAINEL TV — sala de espera
   Quatro colunas, letra grande e nenhum dado pessoal: sem nome, sem telefone,
   sem valor. A placa aparece parcial, o suficiente para o dono reconhecer.
   ────────────────────────────────────────────────────────────────────────── */
const FAIXAS_TV = [
  { id: 'analise',  nome: 'Em análise',          cor: '#8FA6D8', etapas: ['entrada', 'diagnostico', 'orcamento', 'aprovacao'] },
  { id: 'execucao', nome: 'Em execução',         cor: '#5C8AFF', etapas: ['execucao', 'finalizacao', 'lavagem'] },
  { id: 'pecas',    nome: 'Aguardando peças',    cor: '#E0A33A', etapas: ['pecas'] },
  { id: 'pronto',   nome: 'Pronto para retirada', cor: '#2CC3D6', etapas: ['entrega'] },
];

function QuadroTV({ inteiraTela, aoSair }) {
  const { dados, metricas } = usar();
  const [tv] = usarLoja(lojaTV);
  const [agora, setAgora] = useState(() => new Date());
  const [pagina, setPagina] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setAgora(new Date()), 20000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (!tv.rodizio) { setPagina(0); return; }
    const t = setInterval(() => setPagina(p => p + 1), Math.max(5, tv.segundos) * 1000);
    return () => clearInterval(t);
  }, [tv.rodizio, tv.segundos]);

  const colunas = FAIXAS_TV.map(f => ({
    ...f,
    fila: metricas.ativas
      .filter(o => f.etapas.includes(o.etapa))
      .sort((a, b) => b.dias - a.dias),
  }));

  const porPagina = 6;
  const maxPaginas = Math.max(1, ...colunas.map(c => Math.ceil(c.fila.length / porPagina)));
  const p = maxPaginas > 1 ? pagina % maxPaginas : 0;

  return html`
    <div class=${'tv-tela' + (inteiraTela ? '' : ' embutido')}>
      <div class="tv-topo">
        <div class="tv-marca">
          ${dados.oficina.logo
            ? html`<img src=${dados.oficina.logo} alt="" />`
            : html`<span style="width:40px;height:40px;border-radius:11px;background:rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <${Icone} nome="chave" tam=${20} cor="#fff" /></span>`}
          <div style="min-width:0">
            <div class="oficina-nome corta">${dados.oficina.nome}</div>
            <div class="oficina-sub">Acompanhamento de serviços</div>
          </div>
        </div>
        <div class="tv-relogio">
          <div class="hora">${agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div>
          <div class="data">${agora.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        </div>
      </div>

      <div class="tv-grade">
        ${colunas.map(c => {
          const inicio = p * porPagina;
          const visiveis = c.fila.slice(inicio, inicio + porPagina);
          const mostradas = visiveis.length ? visiveis : c.fila.slice(0, porPagina);
          return html`
            <div key=${c.id} class="tv-coluna">
              <div class="tv-coluna-topo">
                <i class="tv-farol" style=${'background:' + c.cor}></i>
                <span class="rotulo-col">${c.nome}</span>
                <span class="qtd-col">${String(c.fila.length).padStart(2, '0')}</span>
              </div>
              <div class="tv-fila">
                ${mostradas.length === 0
                  ? html`<div class="tv-vazio">Nenhum veículo nesta etapa</div>`
                  : mostradas.map((o, i) => html`
                    <div key=${o.id} class=${'tv-ficha' + (c.id === 'pronto' ? ' pronto' : '')}
                      style=${'animation-delay:' + (i * 0.05).toFixed(2) + 's'}>
                      <div style="min-width:0">
                        <div class="placa-tv">${placaParcial(o.veiculo?.placa)}</div>
                        <div class="modelo-tv corta">${o.veiculo?.marca} ${o.veiculo?.modelo}</div>
                      </div>
                      ${tv.mostrarTempo ? html`<span class="tempo-tv">${o.dias === 0 ? 'hoje' : o.dias + 'd'}</span>` : null}
                    </div>`)}
                ${c.fila.length > porPagina && maxPaginas > 1
                  ? html`<div class="tv-mais">página ${p + 1} de ${maxPaginas}</div>` : null}
              </div>
            </div>`;
        })}
      </div>

      <div class="tv-rodape">
        <span>${metricas.ativas.length} veículos na oficina</span>
        <span>A placa aparece parcial por privacidade · procure o modelo do seu carro</span>
      </div>

      ${inteiraTela ? html`
        <button class="btn btn-neutro tv-sair nao-imprime" onClick=${aoSair}>
          <${Icone} nome="x" tam=${15} />Sair do modo TV</button>` : null}
    </div>`;
}

function TelaPainelTV() {
  const { metricas, avisar } = usar();
  const [tv, setTV] = usarLoja(lojaTV);
  const [cheia, setCheia] = useState(false);

  /* Sair pelo Esc ou pelo botão do próprio navegador mantém os dois estados
     em acordo — senão a tela volta e o app continua achando que está cheia. */
  useEffect(() => {
    if (!cheia) return;
    const sair = () => { if (!document.fullscreenElement) setCheia(false); };
    const tecla = (e) => { if (e.key === 'Escape') setCheia(false); };
    document.addEventListener('fullscreenchange', sair);
    window.addEventListener('keydown', tecla);
    return () => { document.removeEventListener('fullscreenchange', sair); window.removeEventListener('keydown', tecla); };
  }, [cheia]);

  const entrar = async () => {
    setCheia(true);
    try { await document.documentElement.requestFullscreen?.(); }
    catch (e) { avisar('O navegador não liberou a tela cheia. O painel continua funcionando nesta janela.'); }
  };
  const sair = () => {
    setCheia(false);
    if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  };

  if (cheia) return html`<${QuadroTV} inteiraTela aoSair=${sair} />`;

  return html`
    <div style="display:flex;flex-direction:column;gap:15px" class="entra">
      <div class="grade g-4">
        ${FAIXAS_TV.map(f => html`
          <${Indicador} key=${f.id} rotulo=${f.nome}
            valor=${metricas.ativas.filter(o => f.etapas.includes(o.etapa)).length}
            apoio=${f.etapas.map(e => etapaPor(e).curto).join(' · ')} />`)}
      </div>

      <${QuadroTV} />

      <div class="grade g-2">
        <${Cartao}>
          <div class="cartao-topo"><div>
            <h3>Como usar na sala de espera</h3>
            <p class="silencioso">Uma tela, um navegador, nenhum aplicativo extra</p>
          </div></div>
          <div style="display:flex;flex-direction:column;gap:11px">
            ${[['Abra em tela cheia', 'O botão abaixo usa a tela inteira do monitor ou da TV. Sair é pelo Esc.'],
               ['Deixe a aba aberta', 'O quadro se atualiza sozinho conforme as ordens mudam de etapa no pátio.'],
               ['Nada de dado pessoal', 'Não aparecem nome, telefone, documento nem valor. A placa sai parcial.']].map(([t, d], i) => html`
              <div key=${t} style="display:flex;gap:11px">
                <span class="avatar" style="width:26px;height:26px;font-size:11px">${i + 1}</span>
                <div><div style="font-size:13px;font-weight:600">${t}</div>
                  <div class="silencioso" style="line-height:1.45">${d}</div></div>
              </div>`)}
          </div>
          <button class="btn btn-primario" style="margin-top:14px;width:100%" onClick=${entrar}>
            <${Icone} nome="expandir" tam=${15} />Abrir em tela cheia</button>
        <//>

        <${Cartao}>
          <div class="cartao-topo"><div>
            <h3>Ajustes do painel</h3>
            <p class="silencioso">Valem só para esta tela e não alteram nada do sistema</p>
          </div></div>
          <div style="display:flex;flex-direction:column;gap:4px">
            <div class="chave-valor">
              <span><span style="font-weight:500">Rodízio automático</span>
                <span class="silencioso" style="display:block">Alterna as páginas quando a fila é maior que a coluna</span></span>
              <${Interruptor} ligado=${tv.rodizio} rotulo="Rodízio automático"
                aoTrocar=${() => setTV({ rodizio: !tv.rodizio })} />
            </div>
            <div class="chave-valor">
              <span><span style="font-weight:500">Mostrar tempo de permanência</span>
                <span class="silencioso" style="display:block">Dias desde a abertura da ordem</span></span>
              <${Interruptor} ligado=${tv.mostrarTempo} rotulo="Mostrar tempo"
                aoTrocar=${() => setTV({ mostrarTempo: !tv.mostrarTempo })} />
            </div>
          </div>
          <div style="margin-top:12px">
            <${Campo} rotulo="Segundos por página" ajuda="Entre 5 e 60 segundos">
              <input class="entrada mono" type="number" min="5" max="60" value=${tv.segundos}
                onInput=${e => setTV({ segundos: Math.min(60, Math.max(5, Number(e.target.value) || 12)) })} />
            <//>
          </div>
        <//>
      </div>
    </div>`;
}

/* ──────────────────────────────────────────────────────────────────────────
   RENTABILIDADE
   O Financeiro atual continua respondendo "quanto entrou e quanto saiu".
   Esta tela responde "de onde vem o lucro" — por serviço, por mecânico e por
   categoria de despesa, com comparativo entre períodos.
   ────────────────────────────────────────────────────────────────────────── */
function TelaRentabilidade() {
  const { dados, metricas, papel } = usar();
  const m = metricas;
  const [janela, setJanela] = useState('12m');

  if (!PAPEIS[papel].gestao || !PAPEIS[papel].custo) return html`
    <${Cartao}><${Vazio} icone="lucro" titulo="Rentabilidade restrita"
      apoio=${'O perfil de ' + PAPEIS[papel].nome.toLowerCase() + ' não enxerga custo de peça nem margem. Fale com o gerente.'} /><//>`;

  const desdeTs = useMemo(() => {
    if (janela === 'mes') return new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
    if (janela === '3m') { const d = new Date(); d.setMonth(d.getMonth() - 3); return d.getTime(); }
    const d = new Date(); d.setMonth(d.getMonth() - 12); return d.getTime();
  }, [janela]);

  const concluidasJanela = m.concluidas.filter(o => (o.tsConcluida || 0) >= desdeTs);
  const receita = concluidasJanela.reduce((s, o) => s + o.totais.liquido, 0);
  const custo = concluidasJanela.reduce((s, o) => s + o.totais.custo, 0);
  const lucro = receita - custo;
  const despesas = despesasPorCategoria(dados, desdeTs);
  const totalDespesas = despesas.reduce((s, d) => s + d.valor, 0);
  const resultado = lucro - totalDespesas;

  const porMecanico = useMemo(() => lucroPorMecanico(m), [m]);
  const comp = useMemo(() => comparativoMensal(m), [m]);
  const mesesGrafico = m.meses.map(x => ({ ...x, lucro: x.receita - x.custo }));

  const servicos = useMemo(() => {
    const mapa = {};
    concluidasJanela.forEach(o => {
      const s = o.itens.find(i => i.tipo === 'servico');
      const nome = s ? s.descricao : 'Serviços avulsos';
      mapa[nome] = mapa[nome] || { nome, qtd: 0, receita: 0, custo: 0, lucro: 0 };
      mapa[nome].qtd += 1;
      mapa[nome].receita += o.totais.liquido;
      mapa[nome].custo += o.totais.custo;
      mapa[nome].lucro += o.totais.lucro;
    });
    return Object.values(mapa)
      .map(x => ({ ...x, margem: x.receita > 0 ? (x.lucro / x.receita) * 100 : 0, lucroUnit: x.lucro / x.qtd }))
      .sort((a, b) => b.lucro - a.lucro);
  }, [concluidasJanela]);

  const seta = (v) => v == null ? null : html`
    <span class="dif-comp" style=${'color:' + (v >= 0 ? 'var(--ok)' : 'var(--erro)')}>
      <${Icone} nome=${v >= 0 ? 'cima' : 'baixo'} tam=${12} />${pct(Math.abs(v))} vs mês anterior</span>`;

  return html`
    <div style="display:flex;flex-direction:column;gap:15px" class="entra">
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <div class="filtros">
          ${[['mes', 'Mês atual'], ['3m', 'Últimos 3 meses'], ['12m', 'Últimos 12 meses']].map(([id, nome]) => html`
            <button key=${id} class="filtro" aria-pressed=${janela === id} onClick=${() => setJanela(id)}>${nome}</button>`)}
        </div>
        <span class="silencioso">${concluidasJanela.length} ordens concluídas no recorte</span>
      </div>

      <div class="grade g-4">
        <${Indicador} rotulo="Receita do período" valor=${brlCurto(receita)} apoio=${concluidasJanela.length + ' ordens'} />
        <${Indicador} rotulo="Custo de peça e mão de obra" valor=${brlCurto(custo)}
          apoio=${'Margem bruta de ' + pct(receita > 0 ? (lucro / receita) * 100 : 0)} />
        <${Indicador} rotulo="Lucro bruto" valor=${brlCurto(lucro)} acento="var(--ok)" apoio="Receita menos custo direto" />
        <${Indicador} rotulo="Resultado após despesas" valor=${brlCurto(resultado)}
          acento=${resultado >= 0 ? 'var(--ok)' : 'var(--erro)'} apoio=${brlCurto(totalDespesas) + ' de despesa paga no período'} />
      </div>

      <${Cartao}>
        <div class="cartao-topo"><div>
          <h3>Comparativo do mês</h3>
          <p class="silencioso">Mês corrente contra o anterior e contra a média dos doze meses</p>
        </div></div>
        <div class="comparativo">
          <div>
            <div class="rot-comp">Receita</div>
            <div class="val-comp">${brlCurto(comp.receita.atual)}</div>
            ${seta(comp.receita.difAnterior)}
            <div class="silencioso" style="margin-top:3px">Média: ${brlCurto(comp.receita.media)}</div>
          </div>
          <div>
            <div class="rot-comp">Lucro bruto</div>
            <div class="val-comp">${brlCurto(comp.lucro.atual)}</div>
            ${seta(comp.lucro.difAnterior)}
            <div class="silencioso" style="margin-top:3px">Anterior: ${brlCurto(comp.lucro.anterior)}</div>
          </div>
          <div>
            <div class="rot-comp">Ordens</div>
            <div class="val-comp">${comp.ordens.atual}</div>
            ${seta(comp.ordens.difAnterior)}
            <div class="silencioso" style="margin-top:3px">Anterior: ${comp.ordens.anterior}</div>
          </div>
          <div>
            <div class="rot-comp">Ticket médio</div>
            <div class="val-comp">${brlCurto(comp.ticket.atual)}</div>
            ${seta(comp.ticket.difAnterior)}
            <div class="silencioso" style="margin-top:3px">Anterior: ${brlCurto(comp.ticket.anterior)}</div>
          </div>
          ${comp.projecao ? html`
            <div>
              <div class="rot-comp">Projeção de fechamento</div>
              <div class="val-comp">${brlCurto(comp.projecao)}</div>
              <div class="silencioso" style="margin-top:3px">No ritmo dos ${m.diaDoMes} primeiros dias</div>
            </div>` : null}
        </div>
      <//>

      <${Cartao}>
        <div class="cartao-topo">
          <div><h3>Evolução mensal</h3><p class="silencioso">Receita e lucro bruto lado a lado, doze meses</p></div>
          <div style="display:flex;gap:14px;font-size:12px" class="secundario esconde-mobile">
            <span style="display:inline-flex;align-items:center;gap:6px"><i style="width:9px;height:9px;border-radius:2px;background:var(--azul-acao);display:inline-block"></i>Receita</span>
            <span style="display:inline-flex;align-items:center;gap:6px"><i style="width:9px;height:9px;border-radius:2px;background:var(--ciano);display:inline-block"></i>Lucro</span>
          </div>
        </div>
        <${GraficoColunas} dados=${mesesGrafico} chaves=${['receita', 'lucro']} rotulos=${['Receita', 'Lucro']} />
      <//>

      <div class="grade g-2-1">
        <${Cartao}>
          <div class="cartao-topo"><div>
            <h3>Lucro por serviço</h3>
            <p class="silencioso">O que mais fatura nem sempre é o que mais sobra</p>
          </div></div>
          ${servicos.length === 0
            ? html`<p class="silencioso">Nenhuma ordem concluída no período escolhido.</p>`
            : html`<div>
                ${servicos.slice(0, 9).map(s => {
                  const maxL = Math.max(...servicos.map(x => x.receita));
                  return html`
                    <div key=${s.nome} class="linha-lucro">
                      <div style="min-width:0">
                        <div class="corta" style="font-size:13px;font-weight:500">${s.nome}</div>
                        <div class="silencioso">${s.qtd}× · ${brl(s.lucroUnit)} de lucro por ordem · margem ${pct(s.margem)}</div>
                      </div>
                      <div style="text-align:right">
                        <div class="mono" style="font-size:13px;font-weight:600">${brlCurto(s.lucro)}</div>
                        <div class="silencioso mono">de ${brlCurto(s.receita)}</div>
                      </div>
                      <div class="barra-dupla">
                        <i style=${'width:' + ((s.lucro / maxL) * 100).toFixed(1) + '%;background:var(--ok)'}></i>
                        <i style=${'width:' + ((s.custo / maxL) * 100).toFixed(1) + '%;background:var(--alerta);opacity:.55'}></i>
                      </div>
                    </div>`;
                })}
                <p class="silencioso" style="margin-top:10px">Verde é lucro, âmbar é custo. A soma das duas barras é a receita do serviço.</p>
              </div>`}
        <//>

        <${Cartao}>
          <div class="cartao-topo"><div>
            <h3>Despesas por categoria</h3>
            <p class="silencioso">Somente contas com baixa registrada</p>
          </div></div>
          <${Rosca} dados=${despesas} />
        <//>
      </div>

      ${comMecanicos(dados) ? html`
      <${Cartao}>
        <div class="cartao-topo"><div>
          <h3>Lucro por mecânico</h3>
          <p class="silencioso">Receita gerada, custo aplicado e o que sobrou em cada ordem concluída</p>
        </div></div>
        <div class="rolagem">
          <table class="tabela">
            <thead><tr><th>Mecânico</th><th class="dir">Ordens</th><th class="dir">Receita</th>
              <th class="dir">Custo</th><th class="dir">Lucro</th><th class="dir">Margem</th><th class="dir">Ticket</th></tr></thead>
            <tbody>
              ${porMecanico.map(p => html`
                <tr key=${p.id}>
                  <td>
                    <div style="display:flex;align-items:center;gap:10px">
                      <span class="avatar" style="width:30px;height:30px;font-size:11px;background:var(--roxo-fundo);color:var(--roxo)">${p.id}</span>
                      <span style="font-size:13.5px;font-weight:500">${p.nome}</span>
                    </div>
                  </td>
                  <td class="dir mono">${p.ordens}</td>
                  <td class="dir mono">${brlCurto(p.receita)}</td>
                  <td class="dir mono secundario">${brlCurto(p.custo)}</td>
                  <td class="dir mono" style="font-weight:600">${brlCurto(p.lucro)}</td>
                  <td class="dir"><${Selo} tom=${p.margem >= PISO_MARGEM ? 'ok' : 'alerta'}>${pct(p.margem)}<//></td>
                  <td class="dir mono">${brlCurto(p.ticket)}</td>
                </tr>`)}
            </tbody>
          </table>
        </div>
        <p class="silencioso" style="margin-top:11px">A ordem é atribuída ao mecânico responsável no cadastro.
          Serviço executado a quatro mãos aparece só para quem assinou a OS.</p>
      <//>` : null}
    </div>`;
}

/* ──────────────────────────────────────────────────────────────────────────
   CENTRAL DE RELATÓRIOS
   Oito relatórios montados sobre as mesmas métricas já calculadas. Cada um
   declara colunas e linhas; a tabela, o CSV e a impressão saem do mesmo lugar.
   ────────────────────────────────────────────────────────────────────────── */
const RELATORIOS = [
  {
    id: 'clientes', nome: 'Clientes', icone: 'pessoas',
    resumo: 'Base completa com gasto acumulado, frequência e tempo desde a última visita.',
    montar: ({ m }) => ({
      colunas: [['nome', 'Cliente'], ['telefone', 'Telefone'], ['cidade', 'Cidade'], ['veiculos', 'Veículos'],
        ['visitas', 'Visitas'], ['gasto', 'Gasto total', 'moeda'], ['ticket', 'Ticket médio', 'moeda'],
        ['ultima', 'Última visita'], ['situacao', 'Situação']],
      linhas: m.clientes.map(c => ({
        nome: c.nome, telefone: fmtTel(c.telefone), cidade: (c.cidade || '—') + (c.uf ? '/' + c.uf : ''),
        veiculos: c.veiculos.length, visitas: c.concluidas.length, gasto: c.gasto, ticket: c.ticket,
        ultima: c.ultima ? fmtData(c.ultima) : '—',
        situacao: c.inativo ? 'Sem retorno' : c.concluidas.length >= 3 ? 'Recorrente' : 'Ativo',
      })).sort((a, b) => b.gasto - a.gasto),
    }),
  },
  {
    id: 'veiculos', nome: 'Veículos', icone: 'carro',
    resumo: 'Frota atendida, quilometragem, passagens e situação da revisão.',
    montar: ({ m }) => ({
      colunas: [['placa', 'Placa'], ['veiculo', 'Veículo'], ['ano', 'Ano'], ['dono', 'Dono'],
        ['km', 'Km atual', 'inteiro'], ['passagens', 'Passagens'], ['gasto', 'Investido', 'moeda'],
        ['ultima', 'Última visita'], ['revisao', 'Revisão']],
      linhas: m.veiculos.map(v => ({
        placa: v.placa, veiculo: v.marca + ' ' + v.modelo, ano: v.ano_modelo || '—', dono: v.cliente?.nome || '—',
        km: v.km_atual, passagens: v.concluidas.length, gasto: v.gasto,
        ultima: v.ultima ? fmtData(v.ultima.concluida_em) : '—',
        revisao: v.revisaoVencida ? 'Vencida' : v.revisaoProxima ? 'Próxima' : 'Em dia',
      })).sort((a, b) => b.gasto - a.gasto),
    }),
  },
  {
    id: 'faturamento', nome: 'Faturamento', icone: 'grafico',
    resumo: 'Mês a mês com receita, custo, lucro e número de ordens concluídas.',
    sigilosas: ['custo', 'lucro', 'margem'],
    montar: ({ m }) => ({
      colunas: [['mes', 'Mês'], ['ordens', 'Ordens'], ['receita', 'Receita', 'moeda'],
        ['custo', 'Custo', 'moeda'], ['lucro', 'Lucro', 'moeda'], ['margem', 'Margem', 'pct'],
        ['ticket', 'Ticket médio', 'moeda']],
      linhas: m.meses.map(x => ({
        mes: x.rotulo, ordens: x.ordens, receita: x.receita, custo: x.custo,
        lucro: x.receita - x.custo, margem: x.receita > 0 ? ((x.receita - x.custo) / x.receita) * 100 : 0,
        ticket: x.ordens ? x.receita / x.ordens : 0,
      })),
    }),
  },
  {
    id: 'estoque', nome: 'Estoque', icone: 'caixa',
    resumo: 'Saldo, mínimo, valor imobilizado e giro de cada item do catálogo.',
    sigilosas: ['custo', 'imobilizado'],
    montar: ({ d, m }) => ({
      colunas: [['codigo', 'Código'], ['descricao', 'Descrição'], ['local', 'Localização'],
        ['saldo', 'Saldo'], ['minimo', 'Mínimo'], ['custo', 'Custo médio', 'moeda'],
        ['imobilizado', 'Imobilizado', 'moeda'], ['saidas', 'Saídas'], ['situacao', 'Situação']],
      linhas: d.pecas.map(p => {
        const uso = m.usoPecas[p.id];
        return {
          codigo: p.codigo, descricao: p.descricao, local: p.localizacao,
          saldo: p.quantidade, minimo: p.estoque_minimo, custo: p.custo_medio,
          imobilizado: p.quantidade * p.custo_medio, saidas: uso ? uso.qtd : 0,
          situacao: p.quantidade === 0 ? 'Zerado' : p.quantidade <= p.estoque_minimo ? 'Abaixo do mínimo'
            : !uso ? 'Sem giro' : 'Normal',
        };
      }).sort((a, b) => b.imobilizado - a.imobilizado),
    }),
  },
  {
    id: 'financeiro', nome: 'Financeiro', icone: 'carteira',
    resumo: 'Todos os títulos a receber e a pagar, com vencimento e baixa.',
    montar: ({ d }) => ({
      colunas: [['tipo', 'Tipo'], ['descricao', 'Descrição'], ['categoria', 'Categoria'],
        ['vencimento', 'Vencimento'], ['baixa', 'Baixa'], ['forma', 'Forma'],
        ['valor', 'Valor', 'moeda'], ['situacao', 'Situação']],
      linhas: (d.lancamentos || []).map(l => ({
        tipo: l.tipo === 'receber' ? 'A receber' : 'A pagar', descricao: l.descricao, categoria: l.categoria,
        vencimento: fmtData(l.vencimento), baixa: l.pago_em ? fmtData(l.pago_em) : '—',
        forma: l.forma_pagamento || '—', valor: l.valor,
        situacao: l.status === 'pago' ? 'Liquidado'
          : dataLocal(l.vencimento) < new Date() ? 'Vencido' : 'Em aberto',
      })),
    }),
  },
  {
    id: 'garantia', nome: 'Garantias', icone: 'escudo',
    resumo: 'Serviços entregues com cobertura vigente, vencendo ou já encerrada.',
    montar: ({ m }) => ({
      colunas: [['os', 'OS'], ['servico', 'Serviço'], ['placa', 'Placa'], ['veiculo', 'Veículo'],
        ['cliente', 'Cliente'], ['entrega', 'Entrega'], ['ate', 'Cobertura até'],
        ['dias', 'Dias restantes'], ['situacao', 'Situação']],
      linhas: m.garantias.map(g => ({
        os: g.os.numero, servico: g.os.itens.find(i => i.tipo === 'servico')?.descricao || 'Serviço',
        placa: g.os.veiculo?.placa || '—', veiculo: (g.os.veiculo?.marca || '') + ' ' + (g.os.veiculo?.modelo || ''),
        cliente: g.os.cliente?.nome || '—', entrega: fmtData(g.os.concluida_em), ate: fmtData(g.ate),
        dias: g.dias, situacao: g.dias < 0 ? 'Vencida' : g.dias <= 15 ? 'Vencendo' : 'Vigente',
      })),
    }),
  },
  {
    id: 'pecas', nome: 'Peças aplicadas', icone: 'chave',
    resumo: 'O que mais sai da prateleira, em quantidade e em receita gerada.',
    montar: ({ d, m }) => ({
      colunas: [['codigo', 'Código'], ['descricao', 'Peça'], ['quantidade', 'Qtd aplicada'],
        ['receita', 'Receita gerada', 'moeda'], ['saldo', 'Saldo atual'], ['medio', 'Preço médio', 'moeda']],
      linhas: Object.values(m.usoPecas).map(u => {
        const p = d.pecas.find(x => x.id === u.peca_id);
        return {
          codigo: p?.codigo || '—', descricao: p?.descricao || '—', quantidade: u.qtd,
          receita: u.valor, saldo: p?.quantidade ?? 0, medio: u.qtd ? u.valor / u.qtd : 0,
        };
      }).sort((a, b) => b.receita - a.receita),
    }),
  },
  {
    id: 'produtividade', nome: 'Produtividade', icone: 'alvo',
    resumo: 'Desempenho por mecânico e tempo médio de permanência em cada etapa.',
    sigilosas: ['custo', 'lucro', 'margem'],
    montar: ({ m }) => ({
      colunas: [['nome', 'Mecânico'], ['ordens', 'Ordens'], ['receita', 'Receita', 'moeda'],
        ['custo', 'Custo', 'moeda'], ['lucro', 'Lucro', 'moeda'], ['margem', 'Margem', 'pct'],
        ['ticket', 'Ticket médio', 'moeda']],
      linhas: lucroPorMecanico(m).map(p => ({
        nome: p.nome, ordens: p.ordens, receita: p.receita, custo: p.custo,
        lucro: p.lucro, margem: p.margem, ticket: p.ticket,
      })),
      extra: m.tempoEtapa.map(t => ({ etapa: etapaNome(t.etapa), media: t.media })),
    }),
  },
];

function TelaCentralRelatorios() {
  const { dados, metricas, papel, avisar } = usar();
  const [ativo, setAtivo] = useState('clientes');

  if (!PAPEIS[papel].gestao) return html`
    <${Cartao}><${Vazio} icone="grafico" titulo="Relatórios restritos"
      apoio=${'O perfil de ' + PAPEIS[papel].nome.toLowerCase() + ' não tem acesso à central de relatórios.'} /><//>`;

  const rel = RELATORIOS.find(r => r.id === ativo) || RELATORIOS[0];
  const podeCusto = PAPEIS[papel].custo;
  /* `gestao` e `custo` andam juntas nos papéis de hoje, mas nada garante isso
     num papel novo. A coluna de custo sai do relatório inteiro — tela, CSV e
     impressão — em vez de depender de quem monta a tabela lembrar do filtro. */
  const conteudo = useMemo(() => {
    const bruto = rel.montar({ d: dados, m: metricas });
    if (podeCusto || !rel.sigilosas?.length) return bruto;
    return { ...bruto, colunas: bruto.colunas.filter(([k]) => !rel.sigilosas.includes(k)) };
  }, [rel, dados, metricas, podeCusto]);
  const { visiveis, restantes, mais } = usePagina(conteudo.linhas, 50);

  const formatar = (valor, tipo) => tipo === 'moeda' ? brlBruto(valor)
    : tipo === 'pct' ? pct(valor)
    : tipo === 'inteiro' ? inteiro(valor)
    : valor;

  const exportar = () => {
    if (!conteudo.linhas.length) { avisar('Não há linhas para exportar neste relatório.'); return; }
    const linhas = conteudo.linhas.map(l => {
      const saida = {};
      conteudo.colunas.forEach(([chave, rotulo, tipo]) => {
        saida[rotulo] = tipo === 'moeda' || tipo === 'pct'
          ? String(Number(l[chave] || 0).toFixed(2)).replace('.', ',')
          : l[chave];
      });
      return saida;
    });
    baixarTexto('nitro-' + apelidoArquivo(dados.oficina.nome) + '-' + rel.id + '-'
      + new Date().toISOString().slice(0, 10) + '.csv', paraCSV(linhas));
    avisar('Relatório de ' + rel.nome.toLowerCase() + ' exportado em CSV.');
  };

  return html`
    <div style="display:flex;flex-direction:column;gap:15px" class="entra">
      <div class="rel-cartoes nao-imprime">
        ${RELATORIOS.filter(r => !r.quando || r.quando(dados)).map(r => html`
          <button key=${r.id} class="rel-cartao" aria-pressed=${ativo === r.id} onClick=${() => setAtivo(r.id)}>
            <span class="marca-rel"><${Icone} nome=${r.icone} tam=${16} /></span>
            <span class="nome-rel">${r.nome}</span>
            <span class="desc-rel">${r.resumo}</span>
          </button>`)}
      </div>

      <${Cartao} nu>
        <div style="padding:16px 18px;border-bottom:1px solid var(--linha);display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap">
          <div>
            <h3>${rel.nome}</h3>
            <p class="silencioso">${conteudo.linhas.length} ${conteudo.linhas.length === 1 ? 'linha' : 'linhas'} ·
              gerado em ${fmtDataLonga(new Date().toISOString())}</p>
          </div>
          <div style="display:flex;gap:8px" class="nao-imprime">
            <button class="btn btn-neutro btn-p" onClick=${() => window.print()}>
              <${Icone} nome="imprimir" tam=${14} />Imprimir</button>
            <button class="btn btn-primario btn-p" onClick=${exportar}>
              <${Icone} nome="exportar" tam=${14} />Exportar CSV</button>
          </div>
        </div>

        ${conteudo.linhas.length === 0
          ? html`<${Vazio} icone="arquivo" titulo="Sem dados para este relatório"
              apoio="Assim que houver movimento, as linhas aparecem aqui." />`
          : html`
            <div class="rolagem">
              <table class="tabela">
                <thead><tr>
                  ${conteudo.colunas.map(([chave, rotulo, tipo]) => html`
                    <th key=${chave} class=${tipo ? 'dir' : ''}>${rotulo}</th>`)}
                </tr></thead>
                <tbody>
                  ${visiveis.map((l, i) => html`
                    <tr key=${i}>
                      ${conteudo.colunas.map(([chave, rotulo, tipo]) => html`
                        <td key=${chave} class=${tipo ? 'dir mono' : ''}
                          style=${tipo ? 'font-size:13px' : 'font-size:13.5px'}>${formatar(l[chave], tipo)}</td>`)}
                    </tr>`)}
                </tbody>
              </table>
            </div>
            ${restantes > 0 ? html`
              <div style="padding:13px;text-align:center;border-top:1px solid var(--linha-suave)" class="nao-imprime">
                <button class="btn btn-neutro btn-p" onClick=${mais}>Mostrar mais ${Math.min(50, restantes)} de ${restantes}</button>
              </div>` : null}`}
      <//>

      ${rel.id === 'produtividade' && conteudo.extra?.length ? html`
        <${Cartao}>
          <div class="cartao-topo"><div><h3>Tempo médio por etapa</h3>
            <p class="silencioso">Onde a ordem realmente espera</p></div></div>
          <${Barras} dados=${conteudo.extra.map(t => ({ nome: t.etapa, valor: Number(t.media.toFixed(1)) }))}
            formato=${v => v + ' dias'} cor="var(--alerta)" corSec="var(--ciano)" />
        <//>` : null}

      <div class="aviso aviso-info nao-imprime">
        <${Icone} nome="exportar" tam=${16} />
        <span>O CSV sai com ponto e vírgula e acentuação em UTF-8, que é o formato que o Excel em
          português abre com dois cliques. Os relatórios da tela anterior continuam onde estavam.</span>
      </div>
    </div>`;
}

/* ──────────────────────────────────────────────────────────────────────────
   ASSISTENTE INTELIGENTE
   O motor de regras roda local e responde hoje. A troca por um provedor
   externo é só escolher outro item na lista: nenhuma outra tela muda.
   ────────────────────────────────────────────────────────────────────────── */
function TelaAssistente() {
  const { dados, metricas, papel, irPara, abrirOS, abrirCliente, abrirVeiculo } = usar();
  const [cfg, setCfg] = usarLoja(lojaIA);
  const [aba, setAba] = useState('leitura');
  const [verPayload, setVerPayload] = useState(false);

  /* O sistema esconde custo e margem do mecânico e do atendente em toda tela.
     O assistente segue a mesma regra: sugestão marcada como sigilosa some
     inteira para quem não tem a capacidade, em vez de sair pela metade. */
  const podeCusto = PAPEIS[papel].custo;
  const sugestoes = useMemo(
    () => lerOficina(dados, metricas).filter(s => podeCusto || !s.sigiloso),
    [dados, metricas, podeCusto]);
  const regrasVisiveis = REGRAS_IA.filter(r => podeCusto || !r.sigiloso);
  const contexto = useMemo(() => montarContextoIA(dados, metricas, cfg), [dados, metricas, cfg]);
  const prov = provedorIA(cfg.provedor);

  const abrir = (alvo) => {
    if (alvo.abrirOS) abrirOS(alvo.abrirOS);
    else if (alvo.abrirCliente) abrirCliente(alvo.abrirCliente);
    else if (alvo.abrirVeiculo) abrirVeiculo(alvo.abrirVeiculo);
  };

  const porTom = (t) => sugestoes.filter(s => s.tom === t);
  /* Vale para todo carro que ainda está na oficina: um complemento aceito na
     execução ainda é uma parada a menos para o cliente. As etapas iniciais
     aparecem primeiro porque lá o orçamento ainda não foi assinado. */
  const recepcao = useMemo(() => {
    const cedo = ['entrada', 'diagnostico', 'orcamento', 'aprovacao'];
    return metricas.ativas
      .map(o => ({ os: o, cedo: cedo.includes(o.etapa), ofertas: sugestoesRecepcao(o.itens) }))
      .filter(x => x.ofertas.length)
      .sort((a, b) => (b.cedo - a.cedo) || (a.os.numero - b.os.numero))
      .slice(0, 8);
  }, [metricas.ativas]);

  const ABAS = [
    { id: 'leitura', nome: 'Leitura do dia' },
    { id: 'recepcao', nome: 'Sugestões para a recepção' },
    { id: 'motor', nome: 'Como o motor pensa' },
    { id: 'provedor', nome: 'Provedor de IA' },
  ];

  return html`
    <div style="display:flex;flex-direction:column;gap:15px" class="entra">
      <${Cartao}>
        <div class="cartao-topo">
          <div style="display:flex;align-items:center;gap:11px">
            <span style="width:36px;height:36px;border-radius:10px;background:var(--roxo-fundo);color:var(--roxo);display:flex;align-items:center;justify-content:center">
              <${Icone} nome="robo" tam=${19} /></span>
            <div>
              <h3>Assistente Inteligente</h3>
              <p class="silencioso">${sugestoes.length} observações a partir de ${metricas.concluidas.length} ordens concluídas
                e ${metricas.ativas.length} em andamento</p>
            </div>
          </div>
          <${Selo} tom=${cfg.provedor === 'local' ? 'ciano' : 'roxo'} icone="faisca">${prov.nome}<//>
        </div>
        <div class="grade g-3" style="gap:10px">
          ${[['Ação recomendada', porTom('alta').length, 'var(--alerta)'],
             ['Oportunidade de venda', porTom('oferta').length, 'var(--ciano)'],
             ['Observação', porTom('normal').length, 'var(--tinta-3)']].map(([r, n, cor]) => html`
            <div key=${r} style="background:var(--superficie-2);border-radius:var(--raio);padding:12px 14px">
              <div class="rotulo" style="font-size:10px">${r}</div>
              <div class="num" style=${'font-size:22px;margin-top:2px;color:' + cor}>${n}</div>
            </div>`)}
        </div>
      <//>

      <${Abas} itens=${ABAS} ativa=${aba} aoTrocar=${setAba} />

      ${aba === 'leitura' ? html`
        <div class="grade g-2">
          <${Cartao}>
            <div class="cartao-topo"><div><h3>Precisa de decisão</h3>
              <p class="silencioso">Custa dinheiro se ficar para amanhã</p></div></div>
            ${porTom('alta').length === 0
              ? html`<p class="silencioso">Nada pendente de decisão agora.</p>`
              : porTom('alta').slice(0, 8).map(s => html`<${Sugestao} key=${s.id} s=${s} aoAbrir=${abrir} />`)}
          <//>
          <${Cartao}>
            <div class="cartao-topo"><div><h3>Vale oferecer</h3>
              <p class="silencioso">Serviço que o histórico sustenta — sem empurrar nada</p></div></div>
            ${porTom('oferta').length === 0
              ? html`<p class="silencioso">Nenhuma oportunidade identificada no momento.</p>`
              : porTom('oferta').slice(0, 8).map(s => html`<${Sugestao} key=${s.id} s=${s} aoAbrir=${abrir} />`)}
          <//>
        </div>
        ${porTom('normal').length ? html`
          <${Cartao}>
            <div class="cartao-topo"><div><h3>Para saber</h3>
              <p class="silencioso">Contexto que ajuda na conversa com o cliente</p></div></div>
            ${porTom('normal').slice(0, 6).map(s => html`<${Sugestao} key=${s.id} s=${s} aoAbrir=${abrir} />`)}
          <//>` : null}` : null}

      ${aba === 'recepcao' ? html`
        <div style="display:flex;flex-direction:column;gap:14px">
          <div class="aviso aviso-info">
            <${Icone} nome="mensagem" tam=${16} />
            <span>São complementos com motivo declarado, para o atendente ter argumento —
              não para empurrar serviço. Se o cliente disser não, o motivo continua registrado.</span>
          </div>
          ${recepcao.length === 0
            ? html`<${Cartao}><${Vazio} icone="prancheta" titulo="Nenhuma ordem em recepção"
                apoio="Assim que entrar um veículo em diagnóstico ou orçamento, as sugestões aparecem aqui." /><//>`
            : recepcao.map(({ os, ofertas }) => html`
              <${Cartao} key=${os.id}>
                <div class="cartao-topo">
                  <div style="display:flex;align-items:center;gap:11px">
                    <${Placa} valor=${os.veiculo?.placa} tam="p" />
                    <div>
                      <h3>OS ${os.numero} · ${os.veiculo?.marca} ${os.veiculo?.modelo}</h3>
                      <p class="silencioso">${os.itens.filter(i => i.tipo === 'servico').map(i => i.descricao).join(', ') || 'Sem serviço lançado'}</p>
                    </div>
                  </div>
                  <button class="btn btn-neutro btn-p esconde-mobile" onClick=${() => abrirOS(os.id)}>
                    Abrir<${Icone} nome="seta" tam=${13} /></button>
                </div>
                ${ofertas.map(o => html`
                  <div key=${o.id} class="ia-sugestao">
                    <span class="ia-marca oferta"><${Icone} nome="mais" tam=${15} /></span>
                    <div style="flex:1;min-width:0">
                      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap">
                        <span style="font-size:13px;font-weight:600">${o.servico}</span>
                        ${o.valor > 0 ? html`<span class="mono silencioso">≈ ${brl(o.valor)}</span>` : null}
                      </div>
                      <p class="silencioso" style="margin-top:3px;line-height:1.45">${o.motivo}</p>
                    </div>
                  </div>`)}
              <//>`)}

          <${Cartao}>
            <div class="cartao-topo"><div><h3>Roteiro de manutenção preventiva</h3>
              <p class="silencioso">Os intervalos que o sistema acompanha em todo veículo</p></div></div>
            <div class="rolagem">
              <table class="tabela">
                <thead><tr><th>Serviço</th><th class="dir">Intervalo</th><th class="dir">Ou a cada</th>
                  <th class="dir">Veículos vencidos</th></tr></thead>
                <tbody>
                  ${INTERVALOS.map(iv => {
                    const n = metricas.veiculos.filter(v => v.vencidos.some(x => x.servico === iv.servico)).length;
                    return html`
                      <tr key=${iv.servico}>
                        <td style="font-size:13.5px;font-weight:500">${iv.servico}</td>
                        <td class="dir mono">${inteiro(iv.km)} km</td>
                        <td class="dir mono">${iv.meses} meses</td>
                        <td class="dir">${n > 0 ? html`<${Selo} tom="alerta">${n}<//>` : html`<span class="silencioso">—</span>`}</td>
                      </tr>`;
                  })}
                </tbody>
              </table>
            </div>
            <button class="btn btn-neutro btn-p" style="margin-top:12px" onClick=${() => irPara('preventiva')}>
              Ver a lista por veículo<${Icone} nome="seta" tam=${13} /></button>
          <//>
        </div>` : null}

      ${aba === 'motor' ? html`
        <div style="display:flex;flex-direction:column;gap:14px">
          <${Cartao}>
            <div class="cartao-topo"><div><h3>Regras ativas</h3>
              <p class="silencioso">Cada linha é um módulo isolado. Acrescentar regra não mexe nas outras.</p></div></div>
            <div class="rolagem">
              <table class="tabela">
                <thead><tr><th>Regra</th><th>Escopo</th><th class="dir">Peso</th><th class="dir">Disparos agora</th></tr></thead>
                <tbody>
                  ${regrasVisiveis.map(r => {
                    const n = sugestoes.filter(s => s.id === r.id || String(s.id).startsWith(r.id + '-')).length;
                    return html`
                      <tr key=${r.id}>
                        <td class="mono" style="font-size:12.5px">${r.id}</td>
                        <td class="secundario" style="font-size:13px;text-transform:capitalize">${r.escopo}</td>
                        <td class="dir mono">${r.peso}</td>
                        <td class="dir">${n > 0 ? html`<${Selo} tom="info">${n}<//>` : html`<span class="silencioso">—</span>`}</td>
                      </tr>`;
                  })}
                </tbody>
              </table>
            </div>
            ${REGRAS_IA.length !== regrasVisiveis.length ? html`
              <p class="silencioso" style="margin-top:10px">
                ${REGRAS_IA.length - regrasVisiveis.length} regra(s) sobre custo e margem ficam ocultas
                no perfil de ${PAPEIS[papel].nome.toLowerCase()}.</p>` : null}
          <//>
          <${Cartao}>
            <div class="cartao-topo"><div><h3>Por que sem API por enquanto</h3></div></div>
            <p class="secundario" style="line-height:1.6">
              As perguntas que a oficina faz todo dia — quanto faturei, quem está sem voltar, qual peça vai faltar —
              têm resposta exata na própria base. Um modelo de linguagem responderia parecido, às vezes errado, e
              cobraria por isso. As regras locais devolvem número calculado, funcionam sem internet e não mandam
              dado de cliente para fora.
            </p>
            <p class="secundario" style="line-height:1.6;margin-top:10px">
              O provedor externo entra quando a tarefa for redigir: explicar um orçamento em linguagem simples,
              resumir dez anos de prontuário, escrever a mensagem de retorno. A estrutura para isso já está pronta
              na aba ao lado — falta só a chave.
            </p>
          <//>
        </div>` : null}

      ${aba === 'provedor' ? html`
        <div style="display:flex;flex-direction:column;gap:14px">
          ${!PAPEIS[papel].config ? html`
            <div class="aviso aviso-info"><${Icone} nome="alerta" tam=${16} />
              <span>Só o dono e o gerente alteram esta configuração. Você pode conferir, mas não salvar.</span></div>` : null}

          <${Cartao}>
            <div class="cartao-topo"><div><h3>Motor de resposta</h3>
              <p class="silencioso">Escolha quem responde. Trocar aqui não altera nenhuma outra tela.</p></div></div>
            <div style="display:flex;flex-direction:column;gap:8px">
              ${PROVEDORES_IA.map(p => html`
                <button key=${p.id} class="ia-provedor" aria-pressed=${cfg.provedor === p.id}
                  disabled=${!pode(papel, 'config')} onClick=${() => setCfg({ provedor: p.id, modelo: p.modelos[0] || '' })}>
                  <span class="ia-marca" style=${p.id === 'local' ? 'background:var(--ciano-fundo);color:var(--ciano)' : ''}>
                    <${Icone} nome=${p.icone} tam=${15} /></span>
                  <div style="flex:1;min-width:0">
                    <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                      <span style="font-size:13.5px;font-weight:600">${p.nome}</span>
                      ${p.id === 'local' ? html`<${Selo} tom="ok">Em uso, sem custo<//>`
                        : p.disponivel(cfg) ? html`<${Selo} tom="info">Chave informada<//>`
                        : html`<${Selo}>Aguardando chave<//>`}
                    </div>
                    <p class="silencioso" style="margin-top:3px;line-height:1.45">${p.resumo}</p>
                    ${p.endpoint ? html`<p class="ia-fonte mono">${p.endpoint}</p>` : null}
                  </div>
                </button>`)}
            </div>
          <//>

          ${prov.precisaChave ? html`
            <${Cartao}>
              <div class="cartao-topo"><div><h3>Credenciais de ${prov.nome}</h3>
                <p class="silencioso">Guardadas apenas nesta sessão do navegador. Nada é enviado nesta fase.</p></div></div>
              <div class="grade g-2" style="gap:12px">
                <${Campo} rotulo="Chave de API" ajuda="Some ao recarregar a página — a versão conectada guarda no servidor, nunca no navegador.">
                  <input class="entrada mono" type="password" value=${cfg.chave} disabled=${!pode(papel, 'config')}
                    placeholder="cole a chave aqui" onInput=${e => setCfg({ chave: e.target.value })} />
                <//>
                <${Campo} rotulo="Modelo">
                  <select class="entrada" value=${cfg.modelo} disabled=${!pode(papel, 'config')}
                    onInput=${e => setCfg({ modelo: e.target.value })}>
                    ${prov.modelos.map(mo => html`<option key=${mo} value=${mo}>${mo}</option>`)}
                  </select>
                <//>
              </div>
              <div class="chave-valor" style="margin-top:12px">
                <span><span style="font-weight:500">Enviar nome do cliente</span>
                  <span class="silencioso" style="display:block">Desligado, o contexto sai com placa parcial e sem nome</span></span>
                <${Interruptor} ligado=${cfg.enviarDadosPessoais} rotulo="Enviar dados pessoais"
                  aoTrocar=${() => pode(papel, 'config') && setCfg({ enviarDadosPessoais: !cfg.enviarDadosPessoais })} />
              </div>
              <div class="aviso aviso-alerta" style="margin-top:12px">
                <${Icone} nome="alerta" tam=${16} />
                <span>${RECADO_SEM_API} Documento, telefone e endereço nunca entram no pacote, com ou sem a chave.</span>
              </div>
            <//>` : null}

          <${Cartao}>
            <div class="cartao-topo">
              <div><h3>O que sairia da oficina</h3>
                <p class="silencioso">Pacote montado agora, com os dados reais desta base</p></div>
              <button class="btn btn-neutro btn-p" onClick=${() => setVerPayload(v => !v)}>
                ${verPayload ? 'Ocultar' : 'Ver o pacote'}</button>
            </div>
            ${verPayload
              ? html`<pre class="ia-codigo">${JSON.stringify(contexto, null, 2)}</pre>`
              : html`<p class="secundario" style="line-height:1.6">
                  Catálogo de serviços, intervalos de manutenção, veículos com pendência (placa parcial),
                  ordens abertas e totais do mês. Sem documento, sem telefone, sem endereço, sem valor de custo.
                </p>`}
          <//>
        </div>` : null}
    </div>`;
}

/* ──────────────────────────────────────────────────────────────────────────
   PORTAL DO CLIENTE — preparação
   A estrutura fica pronta e visível: pacote público por ordem, referência
   estável e prévia do que o cliente veria. Não há acesso externo nesta fase.
   ────────────────────────────────────────────────────────────────────────── */
function PreviaPortal({ pacote }) {
  if (!pacote) return null;
  const proximo = pacote.passos.find(p => p.estado === 'atual');
  return html`
    <div class="portal-moldura">
      <div class="portal-barra">
        <${Icone} nome="chave" tam=${17} cor="#fff" />
        <div style="flex:1;min-width:0">
          <div style="font-size:13.5px;font-weight:700">Acompanhe seu veículo</div>
          <div style="font-size:11px;opacity:.75">${pacote.referencia}</div>
        </div>
      </div>
      <div class="portal-corpo">
        <div>
          <div style="font-size:15px;font-weight:600">Olá, ${pacote.cliente}</div>
          <div class="silencioso">${pacote.veiculo.modelo} · ${placaParcial(pacote.veiculo.placa)}</div>
        </div>

        <div style="background:var(--superficie);border:1px solid var(--linha);border-radius:var(--raio);padding:12px">
          <div class="rotulo" style="font-size:10px">Situação agora</div>
          <div style="font-size:15px;font-weight:600;margin-top:3px">${pacote.situacao.nome}</div>
          <div class="silencioso" style="margin-top:2px">
            ${proximo ? 'Na oficina há ' + pacote.situacao.dias + ' dia(s)' : 'Serviço encerrado'}</div>
        </div>

        <div class="portal-passos">
          ${pacote.passos.map((p, i) => html`
            <div key=${p.id} class=${'portal-passo ' + p.estado}>
              <div class="eixo-p">
                <span class="bola-p"></span>
                ${i < pacote.passos.length - 1 ? html`<span class="fio-p"></span>` : null}
              </div>
              <div class="txt-p">${p.nome}</div>
            </div>`)}
        </div>

        ${pacote.fotos.length ? html`
          <div>
            <span class="rotulo">Fotos do serviço</span>
            <div class="lt-fotos" style="margin-top:7px">
              ${pacote.fotos.slice(0, 4).map(f => html`
                <span key=${f.id} class="lt-foto"><img src=${f.url} alt=${f.rotulo} loading="lazy" /></span>`)}
            </div>
          </div>` : null}

        <div>
          <span class="rotulo">Orçamento</span>
          <div style="margin-top:6px">
            ${pacote.orcamento.itens.slice(0, 4).map((i, k) => html`
              <div key=${k} class="dado-linha">
                <span class="secundario corta">${i.descricao}${i.quantidade > 1 ? ' ×' + i.quantidade : ''}</span>
                <span class="mono">${brlBruto(i.total)}</span>
              </div>`)}
            ${pacote.orcamento.desconto > 0 ? html`
              <div class="dado-linha"><span class="secundario">Desconto</span>
                <span class="mono" style="color:var(--ok)">− ${brlBruto(pacote.orcamento.desconto)}</span></div>` : null}
            <div class="dado-linha" style="font-weight:600">
              <span>Total</span><span class="mono">${brlBruto(pacote.orcamento.total)}</span></div>
          </div>
        </div>

        ${pacote.garantia ? html`
          <div class=${'selo-garantia ' + (pacote.garantia.dias == null ? 'vigente' : situacaoGarantia(pacote.garantia.dias))}
               style="align-self:flex-start">
            <${Icone} nome="escudo" tam=${12} />
            ${/* Antes da entrega não existe data de fim: a garantia só começa a
                 correr quando o carro sai. Escrever "até —" fazia o cliente
                 achar que o campo tinha quebrado. */''}
            ${pacote.garantia.ate
              ? 'Garantia de ' + pacote.garantia.prazo + ' dias até ' + fmtData(pacote.garantia.ate)
              : 'Garantia de ' + pacote.garantia.prazo + ' dias a partir da entrega'}
          </div>` : null}

        ${pacote.historico.length ? html`
          <div>
            <span class="rotulo">Seu histórico aqui</span>
            <div style="margin-top:6px">
              ${pacote.historico.slice(0, 3).map(h => html`
                <div key=${h.numero} class="dado-linha">
                  <span class="secundario corta">${h.servico}<span class="silencioso" style="display:block">${fmtData(h.data)} · ${inteiro(h.km)} km</span></span>
                  <span class="mono">${brlBruto(h.valor)}</span>
                </div>`)}
            </div>
          </div>` : null}

        <p class="silencioso" style="text-align:center">Dúvidas? Fale com a recepção.</p>
      </div>
    </div>`;
}

function TelaPortal() {
  const { dados, metricas, papel, abrirOS, avisar } = usar();
  const [escolhida, setEscolhida] = useState(null);
  const [aba, setAba] = useState('previa');

  const candidatas = useMemo(() =>
    [...metricas.ativas, ...metricas.concluidas.slice(0, 8)].slice(0, 40), [metricas]);
  const os = candidatas.find(o => o.id === escolhida) || candidatas[0];
  const pacote = useMemo(() => pacotePortal(os, dados, metricas), [os, dados, metricas]);

  const cobertura = useMemo(() => {
    const total = metricas.ordens.length;
    const comFoto = metricas.ordens.filter(o => (dados.anexos || []).some(a => a.os_id === o.id)).length;
    const comGarantia = metricas.concluidas.filter(o => o.garantiaAte).length;
    return { total, comFoto, comGarantia };
  }, [metricas, dados.anexos]);

  /* Fase 9: o endereço passou a existir. A rota mora no fragmento da URL,
     então o mesmo arquivo servido em qualquer hospedagem já atende. */
  const copiar = () => {
    const texto = enderecoPublico(os);
    copiarE(texto, avisar, 'Link do cliente copiado. Ele abre só esta ordem.',
      'Não deu para copiar. O endereço está na tela — selecione e copie à mão.');
  };

  if (!os) return html`<${Cartao}><${Vazio} icone="elo" titulo="Nenhuma ordem para preparar"
    apoio="Assim que houver uma ordem aberta, o pacote do portal é montado aqui." /><//>`;

  return html`
    <div style="display:flex;flex-direction:column;gap:15px" class="entra">
      <div class="aviso aviso-info">
        <${Icone} nome="elo" tam=${16} />
        <span>O portal ainda não tem acesso externo. Esta tela mostra o que já está pronto por dentro:
          o pacote público de cada ordem, a referência estável e a prévia da tela do cliente.
          Publicar depois é servir esses mesmos dados em um endereço — nada aqui precisará mudar.</span>
      </div>

      <div class="grade g-4">
        <${Indicador} rotulo="Ordens com pacote pronto" valor=${cobertura.total} apoio="Toda ordem gera o seu" />
        <${Indicador} rotulo="Com foto para mostrar" valor=${cobertura.comFoto}
          acento=${cobertura.comFoto ? 'var(--ok)' : 'var(--alerta)'} apoio="Anexos de entrada, serviço ou peça" />
        <${Indicador} rotulo="Com garantia declarada" valor=${cobertura.comGarantia} apoio="Aparece como selo no portal" />
        <${Indicador} rotulo="Campos expostos" valor="9" apoio="Sem custo, margem, documento ou telefone" />
      </div>

      <div class="grade g-2-1" style="align-items:start">
        <div style="display:flex;flex-direction:column;gap:14px;min-width:0">
          <${Cartao}>
            <div class="cartao-topo">
              <div><h3>OS ${os.numero} · ${os.veiculo?.marca} ${os.veiculo?.modelo}</h3>
                <p class="silencioso">${etapaNome(os.etapa)} · ${os.cliente?.nome}</p></div>
              <button class="btn btn-neutro btn-p esconde-mobile" onClick=${() => abrirOS(os.id)}>
                Abrir ordem<${Icone} nome="seta" tam=${13} /></button>
            </div>

            <div style="display:flex;flex-direction:column;gap:9px">
              <div>
                <span class="rotulo">Referência pública</span>
                <div class="portal-campo" style="margin-top:6px">
                  <${Icone} nome="elo" tam=${14} />
                  <span>portal.${apelidoArquivo(dados.oficina.nome)}.com.br/os/${pacote.token}</span>
                  <button class="btn btn-fantasma btn-p" onClick=${copiar}>Copiar ao vivo</button>
                </div>
                <p class="silencioso" style="margin-top:5px">Derivada da própria ordem: não revela o número
                  sequencial nem permite adivinhar a OS seguinte.</p>
              </div>
            </div>
          <//>

          <${Cartao}>
            <div class="cartao-topo"><div><h3>Conteúdo do pacote</h3>
              <p class="silencioso">Exatamente o que sairia para o cliente — nada além disso</p></div></div>
            <${CompartilharOrdem} os=${os} pacote=${pacote} />

            <${Abas} itens=${[{ id: 'previa', nome: 'Prévia' }, { id: 'dados', nome: 'Dados' }, { id: 'regras', nome: 'Regras de exposição' }]}
              ativa=${aba} aoTrocar=${setAba} />
            <div style="margin-top:14px">
              ${aba === 'previa' ? html`<${PreviaPortal} pacote=${pacote} />` : null}
              ${aba === 'dados' ? html`<pre class="ia-codigo">${JSON.stringify({
                  ...pacote, fotos: pacote.fotos.map(f => ({ id: f.id, rotulo: f.rotulo, url: '(imagem)' })),
                }, null, 2)}</pre>` : null}
              ${aba === 'regras' ? html`
                <div style="display:flex;flex-direction:column;gap:4px">
                  ${[['Situação e etapa', 'Sim', 'ok'], ['Fotos de entrada, serviço e peça', 'Sim', 'ok'],
                     ['Itens e total do orçamento', 'Sim', 'ok'], ['Garantia e prazo', 'Sim', 'ok'],
                     ['Histórico do veículo', 'Sim', 'ok'], ['Nome completo do cliente', 'Só o primeiro nome', 'alerta'],
                     ['Placa', 'Parcial', 'alerta'], ['Custo de peça e margem', 'Nunca', 'erro'],
                     ['Documento, telefone e endereço', 'Nunca', 'erro'],
                     ['Observação técnica interna', 'Nunca', 'erro']].map(([campo, regra, tom]) => html`
                    <div key=${campo} class="chave-valor">
                      <span class="secundario">${campo}</span>
                      <${Selo} tom=${tom}>${regra}<//>
                    </div>`)}
                </div>` : null}
            </div>
          <//>
        </div>

        <${Cartao}>
          <div class="cartao-topo"><div><h3>Escolha a ordem</h3>
            <p class="silencioso">Ativas primeiro, depois as últimas entregas</p></div></div>
          <div class="lista-escolha">
            ${candidatas.map(o => html`
              <button key=${o.id} class="opcao-veiculo" aria-pressed=${os.id === o.id} onClick=${() => setEscolhida(o.id)}>
                <span class="avatar" style="width:32px;height:32px;font-size:11px">${o.numero}</span>
                <div style="flex:1;min-width:0">
                  <div class="corta" style="font-size:13px;font-weight:600">${o.veiculo?.marca} ${o.veiculo?.modelo}</div>
                  <div class="silencioso corta">${etapaPor(o.etapa).curto} · ${o.cliente?.nome}</div>
                </div>
                <i class=${'ponto ' + o.situacao}></i>
              </button>`)}
          </div>
        <//>
      </div>

      <${Cartao}>
        <div class="cartao-topo"><div><h3>O que falta para publicar</h3>
          <p class="silencioso">Estrutura interna pronta; o que resta é infraestrutura</p></div></div>
        <div class="grade g-2" style="gap:10px">
          ${[['Pacote público por ordem', 'Pronto', 'ok', 'Montado a partir das mesmas métricas do sistema.'],
             ['Referência estável e opaca', 'Pronto', 'ok', 'Mesma ordem gera sempre o mesmo código.'],
             ['Regras de exposição', 'Pronto', 'ok', 'Custo, documento e nota interna nunca entram.'],
             ['Prévia da tela do cliente', 'Pronto', 'ok', 'Renderiza com os componentes do próprio Design System.'],
             ['Endereço público', 'Pendente', 'alerta', 'Precisa de domínio e de uma rota servindo o pacote.'],
             ['Envio do link ao cliente', 'Pendente', 'alerta', 'A automação de WhatsApp já existe e entra aqui.']].map(([t, s, tom, d]) => html`
            <div key=${t} style="display:flex;gap:11px;padding:12px;background:var(--superficie-2);border-radius:var(--raio)">
              <span style="flex-shrink:0"><${Selo} tom=${tom}>${s}<//></span>
              <div style="min-width:0">
                <div style="font-size:13px;font-weight:600">${t}</div>
                <div class="silencioso" style="line-height:1.45">${d}</div>
              </div>
            </div>`)}
        </div>
      <//>
    </div>`;
}

/* ══ 6.9 REGISTRO ═══════════════════════════════════════════════════════════
   O menu ganha itens por splice — nenhuma entrada existente é reescrita.
   As rotas ficam em mapas próprios, consultados só quando a tela pedida não
   existe nos mapas originais.                                              */
const TELAS_EXTRA = {
  alertas:       () => html`<${TelaAlertas} />`,
  timeline:      () => html`<${TelaTimeline} />`,
  paineltv:      () => html`<${TelaPainelTV} />`,
  rentabilidade: () => html`<${TelaRentabilidade} />`,
  central:       () => html`<${TelaCentralRelatorios} />`,
  assistente:    () => html`<${TelaAssistente} />`,
  portal:        () => html`<${TelaPortal} />`,
};

const TITULOS_EXTRA = {
  alertas: (d, m, achados) => {
    const n = [...(achados || []), ...alertasExtras(d, m)].filter(a => a.gravidade === 'critico').length;
    return ['Centro de alertas', n ? n + ' ponto(s) crítico(s) agora' : 'Nenhum ponto crítico no momento'];
  },
  timeline: (d, m) => ['Linha do tempo', m.veiculos.length + ' veículos com histórico consultável'],
  paineltv: (d, m) => ['Painel TV', m.ativas.length + ' veículos no quadro da sala de espera'],
  rentabilidade: (d, m) => ['Rentabilidade', 'Lucro por serviço, por mecânico e por categoria'],
  central: () => ['Central de relatórios', RELATORIOS.length + ' relatórios prontos para exportar'],
  assistente: () => ['Assistente Inteligente', 'Leitura automática da base, com origem declarada'],
  portal: () => ['Portal do cliente', 'Estrutura pronta · acesso externo ainda não publicado'],
};

/* Inserção no menu, logo depois dos itens de cada grupo. */
(() => {
  const depoisDe = (id) => NAV.findIndex(n => n.id === id) + 1;
  NAV.splice(depoisDe('garantias'), 0,
    { id: 'alertas',  nome: 'Alertas',   icone: 'sino' },
    { id: 'paineltv', nome: 'Painel TV', icone: 'tv' });
  NAV.splice(depoisDe('veiculos'), 0,
    { id: 'timeline', nome: 'Linha do tempo', icone: 'tempo' });
  NAV.splice(depoisDe('relatorios'), 0,
    { id: 'rentabilidade', nome: 'Rentabilidade', icone: 'lucro' },
    { id: 'central',       nome: 'Central de relatórios', icone: 'exportar' });
  NAV.push(
    { grupo: 'Inteligência' },
    { id: 'assistente', nome: 'Assistente',        icone: 'robo' },
    { id: 'portal',     nome: 'Portal do cliente', icone: 'elo' });
})();

/* ══════════════════════════════════════════════════════════════════════════
   FASE 7 — CAMADA DE DECISÃO
   Mesma regra das fases anteriores: tudo daqui para baixo é aditivo. Esta
   camada não inventa dado nenhum — lê `dados`, `metricas` e `achados` que já
   existem e responde as perguntas que o dono da oficina faz de manhã.

   Organização:
     7.1  Ícones e módulos opcionais
     7.2  Leituras derivadas (dia, período, permanência, estoque)
     7.3  Peças de interface novas
     7.4  Telas novas e painéis encaixados nas telas existentes
     7.5  Registro no menu e nas rotas
   ══════════════════════════════════════════════════════════════════════════ */

/* ══ 7.1 ÍCONES E MÓDULOS ══════════════════════════════════════════════════ */
Object.assign(TRACOS, {
  radar:      'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20M12 12l5.7-5.7M12 16a4 4 0 1 0 0-8',
  moeda:      'M12 2v20M16.5 6H9.8a3.3 3.3 0 0 0 0 6.5h4.4a3.3 3.3 0 0 1 0 6.5H7',
  cronometro: 'M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16M12 10v4l2.6 1.6M9 2h6M18.5 5.5 20 4',
  estrela:    'M12 2.6l2.9 5.9 6.5 1-4.7 4.5 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.5l6.5-1z',
  medalha:    'M12 13.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11M8.4 12.4 7 22l5-2.7 5 2.7-1.4-9.6',
  blocos:     'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
});

/* Módulo opcional: a oficina que não registra funcionário não pode esbarrar
   em campo, coluna ou tela que exija mecânico. O contrário também vale — quem
   usa não perde nada. A chave mora em `oficina`, junto de cor e logotipo:
   é configuração do negócio, entra no backup e volta na restauração. */
const MODULOS_PADRAO = { mecanicos: true };
Object.assign(OFICINA_PADRAO, { modulos: { ...MODULOS_PADRAO } });

/* Aceita `dados` ou a própria `oficina` — as folhas de impressão recebem só a
   segunda, e não faria sentido dar contexto a elas por causa de um campo. */
const modulosDe = (x) => ({ ...MODULOS_PADRAO, ...((x?.oficina || x)?.modulos || {}) });
const comMecanicos = (x) => modulosDe(x).mecanicos !== false;

const MODULOS = [
  { id: 'mecanicos', nome: 'Controle de mecânicos', icone: 'medalha',
    resumo: 'Cada ordem passa a ter um responsável, e o sistema abre produtividade, tempo médio e desempenho por pessoa.',
    ligado: 'A tela de Mecânicos aparece no menu e o responsável entra na ordem, no orçamento e no termo de entrega.',
    desligado: 'Nenhum campo de mecânico é pedido em lugar nenhum. Ordens, relatórios e documentos seguem funcionando iguais.' },
];

/* A regra da fase 6 que elege o mecânico do mês só roda com o módulo ligado.
   Envolver a condição existente evita reescrever a regra. */
(() => {
  const regra = REGRAS_IA.find(r => r.id === 'mecanico-topo');
  if (regra) { const antes = regra.quando; regra.quando = (ctx) => comMecanicos(ctx.d) && antes(ctx); }
  const rel = RELATORIOS.find(r => r.id === 'produtividade');
  if (rel) rel.quando = (d) => comMecanicos(d);
})();

/* ══ 7.2 LEITURAS DERIVADAS ════════════════════════════════════════════════
   Nada disso vira estado: são funções puras sobre as métricas já calculadas,
   memorizadas na tela que usa. Guardar cópia seria uma segunda verdade.   */

/** Marcos de início de dia, semana, mês e ano, em milissegundos. */
function marcosDoCalendario() {
  const dia = new Date(); dia.setHours(0, 0, 0, 0);
  const semana = new Date(dia); semana.setDate(semana.getDate() - semana.getDay());
  return {
    dia: dia.getTime(),
    semana: semana.getTime(),
    mes: new Date(dia.getFullYear(), dia.getMonth(), 1).getTime(),
    ano: new Date(dia.getFullYear(), 0, 1).getTime(),
  };
}

/** Receita, custo, lucro e margem das ordens concluídas desde um instante. */
function resultadoDesde(m, desde) {
  const lista = m.concluidas.filter(o => o.tsConcluida && o.tsConcluida >= desde);
  const receita = lista.reduce((s, o) => s + o.totais.liquido, 0);
  const custo = lista.reduce((s, o) => s + o.totais.custo, 0);
  return { lista, ordens: lista.length, receita, custo, lucro: receita - custo,
    margem: receita > 0 ? ((receita - custo) / receita) * 100 : 0,
    ticket: lista.length ? receita / lista.length : 0 };
}

/** Quanto tempo o veículo fica aqui, da abertura até a conclusão. É a conta
    que o cliente faz quando pergunta "quando fica pronto?". */
function permanenciaMedia(m) {
  const l = m.concluidas.filter(o => o.aberta_em && (o.concluida_em || o.entregue_em));
  if (!l.length) return null;
  const soma = l.reduce((s, o) => s +
    Math.max(0, (new Date(o.concluida_em || o.entregue_em) - new Date(o.aberta_em)) / 86400000), 0);
  return soma / l.length;
}

/** As respostas da abertura do dia, em um objeto só: a tela não faz conta. */
function leituraDoDia(d, m) {
  const marcos = marcosDoCalendario();
  const hoje = resultadoDesde(m, marcos.dia);
  const mes = resultadoDesde(m, marcos.mes);
  const media = permanenciaMedia(m);
  const naEtapa = (id) => m.ativas.filter(o => o.etapa === id);
  return {
    marcos, hoje, mes, permanencia: media,
    caixaDia: m.caixa.dia,
    naOficina: m.ativas.length,
    aguardandoOrcamento: naEtapa('orcamento').length + naEtapa('diagnostico').length,
    aguardandoAprovacao: m.aguardandoAprovacao.length,
    aguardandoPecas: naEtapa('pecas').length,
    prontos: m.prontas.length,
    atrasadas: m.travadas,
    acimaDaMedia: media ? m.ativas.filter(o => o.dias > media * 1.5) : [],
    aReceber: m.aguardandoPagamento,
    retorno: m.inativos,
    maisVendidos: [...m.mix].sort((a, b) => b.qtd - a.qtd).slice(0, 5),
  };
}

/** Indicadores de estoque. Reposição real depende de registro de compra, que
    o sistema ainda não tem — então aqui vai cobertura, que é derivável do
    consumo já registrado. Prometer o que não existe seria pior que omitir. */
function leituraDoEstoque(d, m) {
  const pecas = d.pecas || [];
  const mesesDeHistorico = Math.max(1, m.meses.filter(x => x.ordens > 0).length);
  /* CORREÇÃO · tudo que vira conta passa por `num` antes. O saldo e o mínimo
     ficam guardados na própria linha como `saldo` e `minimo` para que nenhuma
     comparação daqui para baixo volte a ler o campo cru. */
  const enriquecidas = pecas.map(p => {
    const uso = m.usoPecas[p.id];
    const saldo = num(p.quantidade);
    const minimo = num(p.estoque_minimo);
    const custo = num(p.custo_medio);
    const saidas = uso ? num(uso.qtd) : 0;
    const consumoMes = saidas > 0 ? saidas / mesesDeHistorico : 0;
    return { ...p, saldo, minimo, custo,
      saidas, giro: uso ? num(uso.valor) : 0, consumoMes,
      cobertura: consumoMes > 0 ? saldo / consumoMes : null,
      parado: saldo > 0 && !uso, imobilizado: saldo * custo,
      /* Quanto custa subir esta peça até o mínimo. Fica na linha porque o
         cartão de reposição e o relatório precisam do mesmo número. */
      falta: Math.max(0, minimo - saldo),
      reposicao: Math.max(0, minimo - saldo) * custo };
  });
  const paradas = enriquecidas.filter(p => p.parado);
  const comCobertura = enriquecidas.filter(p => p.cobertura != null);
  const abaixoMinimo = enriquecidas.filter(p => p.saldo <= p.minimo);
  return {
    lista: enriquecidas,
    abaixoMinimo,
    zeradas: enriquecidas.filter(p => p.saldo === 0),
    paradas, capital: enriquecidas.reduce((s, p) => s + p.imobilizado, 0),
    capitalParado: paradas.reduce((s, p) => s + p.imobilizado, 0),
    reposicaoMinima: abaixoMinimo.reduce((s, p) => s + p.reposicao, 0),
    maisUsadas: [...enriquecidas].filter(p => p.saidas > 0).sort((a, b) => b.saidas - a.saidas).slice(0, 6),
    coberturaMedia: comCobertura.length
      ? comCobertura.reduce((s, p) => s + Math.min(p.cobertura, 24), 0) / comCobertura.length : null,
    mesesDeHistorico,
    /* Sem nenhuma saída registrada não há consumo, e sem consumo não há
       cobertura. O cartão precisa saber a diferença entre "a conta deu zero"
       e "ainda não há de onde tirar a conta". */
    semConsumo: comCobertura.length === 0,
    catalogoVazio: pecas.length === 0,
  };
}

/** Onde o lucro nasce, por recorte que o dono reconhece: peça x serviço,
    marca do veículo e veículo individual. */
function lucroPorRecorte(m, desde) {
  const lista = m.concluidas.filter(o => o.tsConcluida && o.tsConcluida >= desde);
  const somar = (mapa, chave, o, receita, custo) => {
    const atual = mapa.get(chave) || { nome: chave, receita: 0, custo: 0, ordens: 0 };
    atual.receita += receita; atual.custo += custo; atual.ordens += 1;
    mapa.set(chave, atual);
  };
  const marcas = new Map(), veiculos = new Map();
  let receitaPecas = 0, custoPecas = 0, receitaServicos = 0, custoServicos = 0;
  lista.forEach(o => {
    /* O desconto é dado na ordem inteira, não na linha. Distribuí-lo na
       proporção do valor bruto é o que faz a soma das categorias fechar
       exatamente com o líquido do período — sem isso, o cartão mostraria um
       lucro maior que o real e a tela ao lado discordaria dela mesma. */
    const bruto = o.totais.venda || 0;
    const fator = bruto > 0 ? (bruto - (o.totais.desconto || 0)) / bruto : 1;
    o.itens.forEach(i => {
      const valor = i.quantidade * i.preco_unitario * fator;
      const custo = i.quantidade * (i.custo_unitario || 0);
      if (i.tipo === 'peca') { receitaPecas += valor; custoPecas += custo; }
      else { receitaServicos += valor; custoServicos += custo; }
    });
    if (o.veiculo) {
      somar(marcas, o.veiculo.marca, o, o.totais.liquido, o.totais.custo);
      somar(veiculos, o.veiculo.marca + ' ' + o.veiculo.modelo, o, o.totais.liquido, o.totais.custo);
    }
  });
  const fechar = (mapa) => [...mapa.values()].map(x => ({ ...x, lucro: x.receita - x.custo,
    margem: x.receita > 0 ? ((x.receita - x.custo) / x.receita) * 100 : 0 })).sort((a, b) => b.lucro - a.lucro);
  return {
    ordens: lista.length,
    categorias: [
      { nome: 'Mão de obra', receita: receitaServicos, custo: custoServicos,
        lucro: receitaServicos - custoServicos,
        margem: receitaServicos > 0 ? ((receitaServicos - custoServicos) / receitaServicos) * 100 : 0 },
      { nome: 'Peças e materiais', receita: receitaPecas, custo: custoPecas, lucro: receitaPecas - custoPecas,
        margem: receitaPecas > 0 ? ((receitaPecas - custoPecas) / receitaPecas) * 100 : 0 },
    ],
    marcas: fechar(marcas), veiculos: fechar(veiculos).slice(0, 8),
  };
}

/** Produtividade com custo e margem — a versão da fase 6 trazia receita; o
    módulo de mecânicos precisa do desempenho inteiro. */
function desempenhoMecanicos(m) {
  const base = lucroPorMecanico(m);
  const tempos = new Map();
  m.concluidas.forEach(o => {
    if (!o.aberta_em || !(o.concluida_em || o.entregue_em)) return;
    const dias = Math.max(0, (new Date(o.concluida_em || o.entregue_em) - new Date(o.aberta_em)) / 86400000);
    const atual = tempos.get(o.mecanico) || { total: 0, n: 0 };
    atual.total += dias; atual.n += 1; tempos.set(o.mecanico, atual);
  });
  return base.map(p => {
    const t = tempos.get(p.id);
    return { ...p, dias: t && t.n ? t.total / t.n : null,
      abertas: m.ativas.filter(o => o.mecanico === p.id).length };
  });
}

/* ══ 7.3 PEÇAS DE INTERFACE ════════════════════════════════════════════════ */

/** Indicador grande. É o tijolo do painel novo: um número por cartão, com a
    frase que explica de onde ele saiu. */
function KPI({ rotulo, valor, apoio, icone = 'grafico', tom = '', variacao, aoClicar, ir }) {
  const corpo = html`
    <div class="cabeca">
      <span class="marca"><${Icone} nome=${icone} tam=${16} /></span>
      <span class="titulo-kpi">${rotulo}</span>
    </div>
    <div class="linha-valor">
      <span class="valor-kpi">${valor}</span>
      ${variacao != null && isFinite(variacao) ? html`
        <span class="variacao" style=${'color:' + (variacao >= 0 ? 'var(--ok)' : 'var(--erro)') + ';padding-bottom:4px'}>
          <${Icone} nome=${variacao >= 0 ? 'cima' : 'baixo'} tam=${13} />${pct(Math.abs(variacao))}
        </span>` : null}
    </div>
    ${apoio ? html`<div class="apoio-kpi">${apoio}</div>` : null}
    ${ir ? html`<span class="seta-kpi">${ir}<${Icone} nome="seta" tam=${13} /></span>` : null}`;

  return aoClicar
    ? html`<button class=${'kpi ' + tom} onClick=${aoClicar}>${corpo}</button>`
    : html`<div class=${'kpi ' + tom}>${corpo}</div>`;
}

/** Enquanto a leitura pesada não termina, o desenho do que vem. */
const Esqueleto = ({ altura = 92, quantos = 4 }) => html`
  <div class="kpi-grade">
    ${Array.from({ length: quantos }, (_, i) => html`
      <div key=${i} class="esqueleto" style=${'height:' + altura + 'px'}></div>`)}
  </div>`;

/** Barra de proporção com legenda — cabe onde a rosca seria grande demais. */
function Proporcao({ partes, formato = brlCurto }) {
  const total = partes.reduce((s, p) => s + Math.max(0, p.valor), 0);
  if (total <= 0) return html`<p class="silencioso">Sem valores no período.</p>`;
  return html`
    <div>
      <div class="proporcao">
        ${partes.map(p => html`<i key=${p.nome}
          style=${'width:' + ((Math.max(0, p.valor) / total) * 100).toFixed(2) + '%;background:' + p.cor}
          title=${p.nome}></i>`)}
      </div>
      <div class="legenda-proporcao">
        ${partes.map(p => html`<span key=${p.nome}><i style=${'background:' + p.cor}></i>
          ${p.nome} · <b class="mono">${formato(p.valor)}</b></span>`)}
      </div>
    </div>`;
}

/** Lista de leitura: substitui tabela quando a tela é estreita e quando a
    linha tem duas informações, não sete. */
const LinhaLeitura = ({ principal, apoio, cifra, posicao, aoClicar }) => {
  const dentro = html`
    ${posicao != null ? html`<span class="posicao">${posicao}</span>` : null}
    <span class="principal">${principal}${apoio ? html`<span class="apoio" style="display:block">${apoio}</span>` : null}</span>
    ${cifra ? html`<span class="cifra">${cifra}</span>` : null}`;
  return aoClicar
    ? html`<button class="linha-toque" onClick=${aoClicar}>${dentro}</button>`
    : html`<div>${dentro}</div>`;
};

/* ══ 7.4 TELAS NOVAS ═══════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────────────────────────────────────
   PAINEL — a leitura de poucos segundos
   Substitui a tela anterior na rota `painel`. A versão analítica não sumiu:
   virou a rota `analitico`, a um toque daqui, com os gráficos de sempre.
   ────────────────────────────────────────────────────────────────────────── */
function TelaPainelExecutivo() {
  const { dados, metricas, achados, papel, irPara, abrirNotificacoes, abrirOS } = usar();
  const m = metricas;
  const podeCusto = PAPEIS[papel].custo;
  const leitura = useMemo(() => leituraDoDia(dados, m), [dados, m]);
  const extras = useMemo(() => alertasExtras(dados, m), [dados, m]);
  const criticos = useMemo(() => [...achados, ...extras]
    .filter(a => a.gravidade === 'critico' || a.gravidade === 'atencao').slice(0, 3), [achados, extras]);

  const dif = m.mediaAnterior > 0 ? ((m.mesAtual.receita - m.mediaAnterior) / m.mediaAnterior) * 100 : null;
  const meses = useMemo(() => m.meses.slice(-6).map(x => ({ ...x, lucro: x.receita - x.custo })), [m.meses]);

  return html`
    <div class="entra" style="display:flex;flex-direction:column;gap:16px">

      <${FaixaBoasVindas} />

      ${/* Quatro números respondem o que o dono pergunta primeiro. */ ''}
      <div class="kpi-grade">
        <${KPI} icone="moeda" rotulo="Faturou hoje" valor=${brlCurto(leitura.hoje.receita)}
          apoio=${leitura.hoje.ordens ? leitura.hoje.ordens + (leitura.hoje.ordens === 1 ? ' ordem entregue' : ' ordens entregues') + ' hoje' : 'Nenhuma ordem entregue ainda'}
          aoClicar=${() => irPara('financeiro')} ir="Ver caixa" />
        ${podeCusto ? html`
          <${KPI} icone="lucro" tom="ok" rotulo="Lucro de hoje" valor=${brlCurto(leitura.hoje.lucro)}
            apoio=${leitura.hoje.receita > 0 ? 'Margem de ' + pct(leitura.hoje.margem) + ' no que saiu hoje' : 'A margem aparece na primeira entrega'}
            aoClicar=${() => irPara('rentabilidade')} ir="Ver rentabilidade" />` : null}
        <${KPI} icone="grafico" rotulo="Faturamento do mês" valor=${brlCurto(m.mesAtual.receita)} variacao=${dif}
          apoio=${'Média dos meses anteriores: ' + brlCurto(m.mediaAnterior)}
          aoClicar=${() => irPara('analitico')} ir="Ver análise" />
        ${podeCusto ? html`
          <${KPI} icone="carteira" tom="ok" rotulo="Lucro do mês" valor=${brlCurto(m.lucroMes)}
            apoio=${'Margem de ' + pct(m.mesAtual.receita > 0 ? (m.lucroMes / m.mesAtual.receita) * 100 : 0) + ' no mês corrente'}
            aoClicar=${() => irPara('rentabilidade')} ir="Ver rentabilidade" />` : null}
      </div>

      ${/* Situação do pátio: cinco perguntas, cinco números clicáveis. */ ''}
      <div class="faixa-situacao">
        <button onClick=${() => irPara('patio')}>
          <div class="n">${leitura.naOficina}</div>
          <div class="r"><i class="ponto execucao"></i>Veículos na oficina</div>
        </button>
        <button onClick=${() => irPara('ordens')}>
          <div class="n" style=${leitura.aguardandoOrcamento ? 'color:var(--alerta)' : ''}>${leitura.aguardandoOrcamento}</div>
          <div class="r"><i class="ponto aberto"></i>Aguardando orçamento</div>
        </button>
        <button onClick=${() => irPara('ordens')}>
          <div class="n" style=${leitura.aguardandoPecas ? 'color:var(--alerta)' : ''}>${leitura.aguardandoPecas}</div>
          <div class="r"><i class="ponto aguardando"></i>Aguardando peças</div>
        </button>
        <button onClick=${() => irPara('patio')}>
          <div class="n" style=${leitura.prontos ? 'color:var(--ok)' : ''}>${leitura.prontos}</div>
          <div class="r"><i class="ponto pronto"></i>Prontos para entrega</div>
        </button>
        <button onClick=${() => irPara('controle')}>
          <div class="n" style=${leitura.atrasadas.length ? 'color:var(--erro)' : ''}>${leitura.atrasadas.length}</div>
          <div class="r"><i class="ponto cancelado"></i>Passando do prazo</div>
        </button>
      </div>

      ${/* O que fazer agora. Se não há nada, a tela diz isso em uma linha. */ ''}
      <${Cartao}>
        <div class="cartao-topo">
          <div style="display:flex;align-items:center;gap:9px">
            <span style="width:30px;height:30px;border-radius:9px;background:var(--roxo-fundo);color:var(--roxo);display:flex;align-items:center;justify-content:center">
              <${Icone} nome="faisca" tam=${16} /></span>
            <div>
              <h3>Recomendações do dia</h3>
              <p class="silencioso">Lidas da própria base, sem depender de serviço externo</p>
            </div>
          </div>
          <button class="btn btn-neutro btn-p esconde-mobile" onClick=${abrirNotificacoes}>
            Ver todas<${Icone} nome="seta" tam=${13} /></button>
        </div>
        ${criticos.length === 0
          ? html`<div class="aviso aviso-ok"><${Icone} nome="check" tam=${16} />
              <span>Nada pedindo decisão agora. Pátio girando, estoque no lugar e contas em dia.</span></div>`
          : html`<div class="grade g-2">${criticos.map(a => html`<${Achado} key=${a.id} a=${a} />`)}</div>`}
      <//>

      ${/* O ritmo da casa: três medidas que explicam o resto. */ ''}
      <div class="grade g-3">
        <${KPI} icone="alvo" tom="ciano" rotulo="Ticket médio" valor=${brlCurto(m.ticket)}
          apoio=${m.concluidas.length + ' ordens concluídas no histórico'} />
        <${KPI} icone="cronometro" tom="roxo" rotulo="Permanência média"
          valor=${leitura.permanencia != null ? leitura.permanencia.toFixed(1) + ' dias' : '—'}
          apoio=${leitura.acimaDaMedia.length
            ? leitura.acimaDaMedia.length + ' veículo(s) bem acima dessa média agora'
            : 'Da abertura da ordem até a conclusão'}
          aoClicar=${leitura.acimaDaMedia.length ? () => irPara('patio') : null}
          ir=${leitura.acimaDaMedia.length ? 'Ver no pátio' : null} />
        <${KPI} icone="prancheta" rotulo="Concluídas no mês" valor=${m.concluidasMes.length}
          apoio=${'Em aberto no pátio: ' + brlCurto(m.emAberto)} aoClicar=${() => irPara('ordens')} ir="Ver ordens" />
      </div>

      <div class="grade g-2-1">
        <${Cartao}>
          <div class="cartao-topo">
            <div><h3>Receita e lucro por mês</h3><p class="silencioso">Últimos seis meses fechados pelas ordens concluídas</p></div>
            <button class="btn btn-neutro btn-p esconde-mobile" onClick=${() => irPara('analitico')}>
              Análise completa<${Icone} nome="seta" tam=${13} /></button>
          </div>
          <${GraficoColunas} dados=${meses} chaves=${podeCusto ? ['receita', 'lucro'] : ['receita']}
            rotulos=${podeCusto ? ['Receita', 'Lucro'] : ['Receita']} />
        <//>

        <${Cartao}>
          <div class="cartao-topo"><div>
            <h3>Serviços mais vendidos</h3>
            <p class="silencioso">Por quantidade de ordens</p>
          </div></div>
          ${leitura.maisVendidos.length === 0
            ? html`<p class="silencioso">Ainda sem serviços concluídos.</p>`
            : html`<div class="linhas-leitura">
                ${leitura.maisVendidos.map((s, i) => html`
                  <${LinhaLeitura} key=${s.nome} posicao=${i + 1} principal=${s.nome}
                    apoio=${s.qtd + (s.qtd === 1 ? ' ordem · ticket ' : ' ordens · ticket ') + brlCurto(s.ticket)}
                    cifra=${brlCurto(s.valor)} />`)}
              </div>`}
        <//>
      </div>

      ${!podeCusto ? html`
        <div class="aviso aviso-info"><${Icone} nome="alerta" tam=${16} />
          <span>Você está no perfil de ${PAPEIS[papel].nome.toLowerCase()}. Custo de peça, lucro e margem ficam ocultos.</span></div>` : null}
    </div>`;
}

/* ──────────────────────────────────────────────────────────────────────────
   CENTRO DE CONTROLE
   O painel responde "como vai a oficina". Esta tela responde "o que exige a
   minha decisão agora". Só entra aqui o que tem dono, prazo ou dinheiro.
   ────────────────────────────────────────────────────────────────────────── */
function TelaControle() {
  const { dados, metricas, achados, papel, irPara, abrirOS, abrirCliente } = usar();
  const m = metricas;
  const podeCusto = PAPEIS[papel].custo;
  const leitura = useMemo(() => leituraDoDia(dados, m), [dados, m]);
  const extras = useMemo(() => alertasExtras(dados, m), [dados, m]);
  const criticos = useMemo(() => [...achados, ...extras].filter(a => a.gravidade === 'critico'), [achados, extras]);
  const aReceberVencido = leitura.aReceber.filter(x => dataLocal(x.lancamento.vencimento) < new Date());

  const filas = [
    { id: 'orcamento', nome: 'Aguardando orçamento', icone: 'prancheta', tom: '',
      lista: m.ativas.filter(o => o.etapa === 'orcamento' || o.etapa === 'diagnostico'),
      frase: 'Veículo parado sem preço fechado não vira receita.' },
    { id: 'aprovacao', nome: 'Aguardando aprovação', icone: 'relogio', tom: 'alerta',
      lista: m.aguardandoAprovacao, frase: 'Orçamento enviado, resposta pendente do cliente.' },
    { id: 'pecas', nome: 'Aguardando peças', icone: 'caixa', tom: 'alerta',
      lista: m.ativas.filter(o => o.etapa === 'pecas'), frase: 'A ordem só anda quando a peça chega.' },
    { id: 'atrasadas', nome: 'Passando do prazo', icone: 'alerta', tom: 'erro',
      lista: leitura.atrasadas, frase: 'Seis dias ou mais no pátio, em qualquer etapa.' },
  ];

  return html`
    <div class="entra" style="display:flex;flex-direction:column;gap:16px">

      <div class="kpi-grade">
        <${KPI} icone="moeda" rotulo="Receita de hoje" valor=${brlCurto(leitura.hoje.receita)}
          apoio=${leitura.hoje.ordens + (leitura.hoje.ordens === 1 ? ' ordem entregue' : ' ordens entregues')} />
        ${podeCusto ? html`
          <${KPI} icone="lucro" tom="ok" rotulo="Lucro de hoje" valor=${brlCurto(leitura.hoje.lucro)}
            apoio=${'Margem de ' + pct(leitura.hoje.margem)} />` : null}
        <${KPI} icone="carteira" tom=${leitura.caixaDia.saldo >= 0 ? 'ok' : 'erro'} rotulo="Caixa do dia"
          valor=${brlCurto(leitura.caixaDia.saldo)}
          apoio=${'Entrou ' + brlCurto(leitura.caixaDia.entradas) + ' · saiu ' + brlCurto(leitura.caixaDia.saidas)}
          aoClicar=${() => irPara('financeiro')} ir="Abrir financeiro" />
        <${KPI} icone="relogio" tom=${aReceberVencido.length ? 'erro' : ''} rotulo="A receber vencido"
          valor=${brlCurto(aReceberVencido.reduce((s, x) => s + x.lancamento.valor, 0))}
          apoio=${aReceberVencido.length ? aReceberVencido.length + ' título(s) com vencimento passado' : 'Nenhum título vencido'}
          aoClicar=${() => irPara('financeiro')} ir="Cobrar" />
      </div>

      ${criticos.length > 0 ? html`
        <${Cartao}>
          <div class="cartao-topo"><div>
            <h3>Alertas importantes</h3>
            <p class="silencioso">${criticos.length} ${criticos.length === 1 ? 'ponto crítico' : 'pontos críticos'} agora</p>
          </div>
          <button class="btn btn-neutro btn-p esconde-mobile" onClick=${() => irPara('alertas')}>
            Central de alertas<${Icone} nome="seta" tam=${13} /></button></div>
          <div class="grade g-2">${criticos.slice(0, 4).map(a => html`<${Achado} key=${a.id} a=${a} />`)}</div>
        <//>` : null}

      ${/* As quatro filas que travam a oficina, cada uma com os nomes dentro. */ ''}
      <div class="grade g-2">
        ${filas.map(f => html`
          <${Cartao} key=${f.id}>
            <div class="cartao-topo">
              <div style="display:flex;align-items:center;gap:9px">
                <span class=${'marca-fila'} style=${'width:30px;height:30px;border-radius:9px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:var(--' + (f.tom === 'erro' ? 'erro' : f.tom === 'alerta' ? 'alerta' : 'info') + '-fundo);color:var(--' + (f.tom === 'erro' ? 'erro' : f.tom === 'alerta' ? 'alerta' : 'info') + ')'}>
                  <${Icone} nome=${f.icone} tam=${16} /></span>
                <div><h3>${f.nome}</h3><p class="silencioso">${f.frase}</p></div>
              </div>
              <span class="num" style="font-size:22px">${String(f.lista.length).padStart(2, '0')}</span>
            </div>
            ${f.lista.length === 0
              ? html`<p class="silencioso">Nenhuma ordem nesta situação.</p>`
              : html`<div class="linhas-leitura">
                  ${f.lista.slice(0, 4).map(o => html`
                    <${LinhaLeitura} key=${o.id} aoClicar=${() => abrirOS(o.id)}
                      principal=${'OS ' + o.numero + ' · ' + (o.veiculo?.marca || '') + ' ' + (o.veiculo?.modelo || '')}
                      apoio=${(o.cliente?.nome || 'Sem cliente') + ' · ' + o.dias + (o.dias === 1 ? ' dia no pátio' : ' dias no pátio')}
                      cifra=${brlCurto(o.totais.liquido)} />`)}
                  ${f.lista.length > 4 ? html`
                    <${LinhaLeitura} principal=${'e mais ' + (f.lista.length - 4) + ' ordem(ns)'}
                      aoClicar=${() => irPara('ordens')} />` : null}
                </div>`}
          <//>`)}
      </div>

      <div class="grade g-2">
        <${Cartao}>
          <div class="cartao-topo"><div>
            <h3>Clientes aguardando retorno</h3>
            <p class="silencioso">Sem passar aqui há mais de ${Math.round(DIAS_INATIVO / 30)} meses</p>
          </div></div>
          ${leitura.retorno.length === 0
            ? html`<p class="silencioso">Nenhum cliente inativo. Boa retenção.</p>`
            : html`<div class="linhas-leitura">
                ${leitura.retorno.slice(0, 6).map(c => html`
                  <${LinhaLeitura} key=${c.id} aoClicar=${() => abrirCliente(c.id)} principal=${c.nome}
                    apoio=${mesesDesde(c.ultima) + ' meses sem aparecer · ' + c.concluidas.length + ' passagens'}
                    cifra=${brlCurto(c.gasto)} />`)}
              </div>`}
        <//>

        <${Cartao}>
          <div class="cartao-topo"><div>
            <h3>Prontos para entrega</h3>
            <p class="silencioso">Avisar o cliente libera vaga no pátio</p>
          </div></div>
          ${m.prontas.length === 0
            ? html`<p class="silencioso">Nenhum veículo esperando retirada.</p>`
            : html`<div class="linhas-leitura">
                ${m.prontas.map(o => html`
                  <${LinhaLeitura} key=${o.id} aoClicar=${() => abrirOS(o.id)}
                    principal=${(o.veiculo?.marca || '') + ' ' + (o.veiculo?.modelo || '') + ' · ' + (o.veiculo?.placa || '')}
                    apoio=${(o.cliente?.nome || '') + ' · pronto há ' + o.dias + (o.dias === 1 ? ' dia' : ' dias')}
                    cifra=${brlCurto(o.totais.liquido)} />`)}
              </div>`}
        <//>
      </div>
    </div>`;
}

/* ──────────────────────────────────────────────────────────────────────────
   MECÂNICOS — módulo opcional
   Só existe com o módulo ligado. Se alguém chegar aqui pela rota com o
   módulo desligado, a tela explica e oferece o caminho, em vez de quebrar.
   ────────────────────────────────────────────────────────────────────────── */
function TelaMecanicos() {
  const { dados, metricas, papel, irPara } = usar();
  const m = metricas;
  if (!comMecanicos(dados)) return html`
    <${Cartao}><${Vazio} icone="medalha" titulo="Controle de mecânicos desligado"
      apoio="Esta oficina está configurada sem controle por mecânico. Nenhuma tela exige o campo e nada aqui é obrigatório."
      acao=${html`<button class="btn btn-primario" onClick=${() => irPara('ajustes')}>Abrir Ajustes › Módulos</button>`} /><//>`;

  const podeCusto = PAPEIS[papel].custo;
  const lista = useMemo(() => desempenhoMecanicos(m), [m]);
  const total = lista.reduce((s, p) => s + p.receita, 0);

  return html`
    <div class="entra" style="display:flex;flex-direction:column;gap:16px">
      <div class="kpi-grade">
        <${KPI} icone="pessoas" rotulo="Mecânicos ativos" valor=${lista.length}
          apoio=${m.ativas.length + ' ordens abertas distribuídas'} />
        <${KPI} icone="prancheta" rotulo="Ordens concluídas" valor=${lista.reduce((s, p) => s + p.ordens, 0)}
          apoio="Todo o histórico registrado" />
        <${KPI} icone="cronometro" tom="roxo" rotulo="Tempo médio por ordem"
          valor=${(() => { const c = lista.filter(p => p.dias != null); return c.length ? (c.reduce((s, p) => s + p.dias, 0) / c.length).toFixed(1) + ' dias' : '—'; })()}
          apoio="Da abertura à conclusão" />
        ${podeCusto ? html`
          <${KPI} icone="lucro" tom="ok" rotulo="Lucro gerado" valor=${brlCurto(lista.reduce((s, p) => s + p.lucro, 0))}
            apoio="Receita menos custo das ordens concluídas" />` : null}
      </div>

      <${Cartao}>
        <div class="cartao-topo"><div>
          <h3>Desempenho por mecânico</h3>
          <p class="silencioso">A ordem é atribuída ao responsável no cadastro; serviço a quatro mãos aparece para quem assinou</p>
        </div></div>
        <div style="display:flex;flex-direction:column;gap:15px">
          ${lista.map(p => html`
            <div key=${p.id}>
              <div style="display:flex;align-items:center;gap:11px;margin-bottom:7px">
                <span class="avatar" style="width:34px;height:34px;font-size:12px;background:var(--roxo-fundo);color:var(--roxo)">${p.id}</span>
                <div style="flex:1;min-width:0">
                  <div style="font-size:13.5px;font-weight:600">${p.nome}</div>
                  <div class="silencioso">${p.ordens} concluídas · ${p.abertas} em aberto
                    ${p.dias != null ? ' · ' + p.dias.toFixed(1) + ' dias em média' : ''}</div>
                </div>
                <div style="text-align:right">
                  <div class="mono" style="font-size:13.5px;font-weight:600">${brlCurto(p.receita)}</div>
                  ${podeCusto ? html`<div class="silencioso">lucro ${brlCurto(p.lucro)}</div>` : null}
                </div>
              </div>
              <div style="height:7px;border-radius:99px;background:var(--linha-suave);overflow:hidden">
                <i style=${'display:block;height:100%;border-radius:99px;background:var(--azul-acao);width:' +
                  (total > 0 ? (p.receita / total) * 100 : 0).toFixed(1) + '%'}></i>
              </div>
              ${podeCusto ? html`
                <div style="display:flex;justify-content:space-between;margin-top:5px">
                  <span class="silencioso">ticket ${brlCurto(p.ticket)}</span>
                  <${Selo} tom=${p.margem >= PISO_MARGEM ? 'ok' : 'alerta'}>${pct(p.margem)} de margem<//>
                </div>` : null}
            </div>`)}
        </div>
      <//>

      <div class="aviso aviso-info"><${Icone} nome="alerta" tam=${16} />
        <span>Este módulo é opcional. Desligado em Ajustes › Módulos, o campo de mecânico some de toda a oficina
        e nenhuma outra tela deixa de funcionar.</span></div>
    </div>`;
}

/* ──────────────────────────────────────────────────────────────────────────
   PAINEL DE RESULTADO — encaixa no Financeiro existente
   Receita, custo, lucro e margem por período, e de onde o lucro vem.
   ────────────────────────────────────────────────────────────────────────── */
function PainelResultado() {
  const { metricas, papel } = usar();
  const m = metricas;
  const podeCusto = PAPEIS[papel].custo;
  const [janela, setJanela] = useState('mes');
  const marcos = useMemo(() => marcosDoCalendario(), []);
  const res = useMemo(() => resultadoDesde(m, marcos[janela]), [m, marcos, janela]);
  const recorte = useMemo(() => lucroPorRecorte(m, marcos[janela]), [m, marcos, janela]);

  const NOMES = { dia: 'Hoje', semana: 'Semana', mes: 'Mês', ano: 'Ano' };
  const JANELAS = { dia: 'somente hoje', semana: 'de domingo até agora', mes: 'do dia 1º até agora', ano: 'de 1º de janeiro até agora' };

  return html`
    <${Cartao}>
      <div class="cartao-topo">
        <div><h3>Resultado do período</h3>
          <p class="silencioso">Ordens concluídas ${JANELAS[janela]} — faturamento, não caixa</p></div>
        <div class="filtros">
          ${Object.entries(NOMES).map(([id, nome]) => html`
            <button key=${id} class="filtro" aria-pressed=${janela === id} onClick=${() => setJanela(id)}>${nome}</button>`)}
        </div>
      </div>

      <div class="kpi-grade" style="margin-bottom:16px">
        <${KPI} icone="moeda" rotulo="Receita" valor=${brlCurto(res.receita)}
          apoio=${res.ordens + (res.ordens === 1 ? ' ordem concluída' : ' ordens concluídas')} />
        ${podeCusto ? html`
          <${KPI} icone="caixa" tom="alerta" rotulo="Custos" valor=${brlCurto(res.custo)}
            apoio="Peças e mão de obra aplicadas" />
          <${KPI} icone="lucro" tom="ok" rotulo="Lucro líquido" valor=${brlCurto(res.lucro)}
            apoio=${'Ticket médio de ' + brlCurto(res.ticket)} />
          <${KPI} icone="alvo" tom=${res.margem >= PISO_MARGEM ? 'ok' : 'alerta'} rotulo="Margem"
            valor=${pct(res.margem)} apoio=${'Piso definido pela oficina: ' + pct(PISO_MARGEM)} />`
        : html`<${KPI} icone="alvo" tom="ciano" rotulo="Ticket médio" valor=${brlCurto(res.ticket)}
            apoio="Custo e margem ficam ocultos neste perfil" />`}
      </div>

      ${res.ordens === 0
        ? html`<p class="silencioso">Nenhuma ordem concluída neste período.</p>`
        : html`
          <div class="grade g-2">
            ${podeCusto ? html`
              <div>
                <h4 style="margin-bottom:9px">De onde vem o lucro</h4>
                <${Proporcao} partes=${recorte.categorias.map((c, i) => ({ nome: c.nome, valor: c.lucro,
                  cor: i === 0 ? 'var(--azul-acao)' : 'var(--ciano)' }))} />
                <div class="linhas-leitura" style="margin-top:10px">
                  ${recorte.categorias.map(c => html`
                    <${LinhaLeitura} key=${c.nome} principal=${c.nome}
                      apoio=${'receita ' + brlCurto(c.receita) + ' · margem ' + pct(c.margem)}
                      cifra=${brlCurto(c.lucro)} />`)}
                </div>
              </div>` : null}

            <div>
              <h4 style="margin-bottom:9px">${podeCusto ? 'Lucro por marca' : 'Receita por marca'}</h4>
              ${recorte.marcas.length === 0
                ? html`<p class="silencioso">Sem veículos vinculados no período.</p>`
                : html`<div class="linhas-leitura">
                    ${recorte.marcas.slice(0, 6).map((x, i) => html`
                      <${LinhaLeitura} key=${x.nome} posicao=${i + 1} principal=${x.nome}
                        apoio=${x.ordens + (x.ordens === 1 ? ' ordem · margem ' : ' ordens · margem ') + pct(x.margem)}
                        cifra=${brlCurto(podeCusto ? x.lucro : x.receita)} />`)}
                  </div>`}
            </div>
          </div>

          <div style="margin-top:16px">
            <h4 style="margin-bottom:9px">${podeCusto ? 'Lucro por veículo' : 'Receita por veículo'}</h4>
            <div class="linhas-leitura">
              ${recorte.veiculos.map((x, i) => html`
                <${LinhaLeitura} key=${x.nome} posicao=${i + 1} principal=${x.nome}
                  apoio=${x.ordens + (x.ordens === 1 ? ' passagem' : ' passagens') + ' · receita ' + brlCurto(x.receita)}
                  cifra=${brlCurto(podeCusto ? x.lucro : x.receita)} />`)}
            </div>
          </div>`}
    <//>`;
}

/* ──────────────────────────────────────────────────────────────────────────
   PAINEL DO ESTOQUE — encaixa na tela de Estoque existente
   ────────────────────────────────────────────────────────────────────────── */
function PainelEstoque() {
  const { dados, metricas, papel, irPara, cofre } = usar();
  const podeCusto = PAPEIS[papel].custo;
  const e = useMemo(() => leituraDoEstoque(dados, metricas), [dados, metricas]);
  /* CORREÇÃO · a tela de Estoque não está em `ROTAS_COFRE`, então ela não tem
     portão nem cadeado. Os valores saíam como `R$ ••••` sem nada explicando de
     onde vinham os pontinhos e sem nenhum caminho para revelá-los: parecia
     campo quebrado. Agora a máscara se apresenta e se desfaz no lugar. */
  const mascarado = podeCusto && valorOculto();

  const cadeado = !mascarado ? null : html`
    <div class="aviso aviso-info" style="align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
      <span style="display:flex;align-items:center;gap:10px">
        <${Icone} nome="cadeado" tam=${16} />
        <span>Os valores desta tela estão guardados no cofre. Saldo, mínimo e giro seguem à vista.</span>
      </span>
      ${cofre.permitido
        ? html`<button class="btn btn-neutro btn-p" onClick=${cofre.destravar}>
            <${Icone} nome="cadeado-aberto" tam=${14} />Mostrar valores</button>`
        : html`<span class="silencioso">O perfil de ${cofre.papelNome} não abre valores.</span>`}
    </div>`;

  return html`
    <div style="display:flex;flex-direction:column;gap:13px">
      ${cadeado}
      <div class="kpi-grade">
        <${KPI} icone="alerta" tom=${e.abaixoMinimo.length ? 'alerta' : 'ok'} rotulo="Abaixo do mínimo"
          valor=${e.abaixoMinimo.length}
          apoio=${e.zeradas.length
            ? e.zeradas.length + (e.zeradas.length === 1 ? ' peça zerada pode travar' : ' peças zeradas podem travar') + ' uma ordem'
            : 'Nenhuma peça zerada'} />
        <${KPI} icone="caixa" rotulo="Peças sem giro" valor=${e.paradas.length}
          apoio=${e.paradas.length ? 'Sem nenhuma saída no histórico' : 'Todo o estoque tem saída registrada'} />
        ${podeCusto ? html`
          <${KPI} icone="carteira" rotulo="Capital em estoque" valor=${brlCurto(e.capital)}
            apoio="Custo médio × quantidade" />
          <${KPI} icone="moeda" tom=${e.capitalParado > 0 ? 'alerta' : ''} rotulo="Capital parado"
            valor=${brlCurto(e.capitalParado)}
            apoio=${e.capital > 0 ? pct((e.capitalParado / e.capital) * 100) + ' do estoque sem giro' : 'Estoque vazio'} />` : null}
        <${KPI} icone="cronometro" tom="ciano" rotulo="Cobertura média"
          valor=${e.coberturaMedia != null ? e.coberturaMedia.toFixed(1) + ' meses' : '—'}
          apoio=${e.semConsumo
            ? 'Aparece quando a primeira ordem com peça for concluída'
            : 'Pelo consumo dos últimos ' + e.mesesDeHistorico + (e.mesesDeHistorico === 1 ? ' mês' : ' meses') + ' com movimento'} />
      </div>

      <div class="grade g-2">
        <${Cartao}>
          <div class="cartao-topo"><div><h3>Peças mais utilizadas</h3>
            <p class="silencioso">Saídas registradas nas ordens concluídas</p></div></div>
          ${e.maisUsadas.length === 0
            ? html`<p class="silencioso">Nenhuma saída registrada ainda.</p>`
            : html`<div class="linhas-leitura">
                ${e.maisUsadas.map((p, i) => html`
                  <${LinhaLeitura} key=${p.id} posicao=${i + 1} principal=${p.descricao}
                    apoio=${p.saidas + ' saídas · saldo ' + p.saldo +
                      (p.cobertura != null ? ' · cobre ' + p.cobertura.toFixed(1) + ' meses' : '')}
                    cifra=${brlCurto(p.giro)} />`)}
              </div>`}
        <//>

        <${Cartao}>
          <div class="cartao-topo"><div><h3>Reposição</h3>
            <p class="silencioso">O que dá para afirmar hoje, e o que ainda falta</p></div></div>
          ${/* CORREÇÃO · o cartão mostrava três linhas com "—", "0" e pontinhos
                numa base sem consumo. Três campos vazios não são uma leitura:
                quem olha conclui que a tela quebrou. Sem catálogo e sem
                consumo o cartão diz o que falta acontecer, em uma frase. */
            e.catalogoVazio
            ? html`<p class="silencioso" style="line-height:1.6">Nenhuma peça cadastrada ainda. Assim que o catálogo
                tiver itens com saldo e mínimo, esta leitura passa a valer.</p>`
            : e.semConsumo
            ? html`
              <div class="linhas-leitura">
                <${LinhaLeitura} principal="Peças a repor" apoio="Saldo igual ou abaixo do mínimo definido"
                  cifra=${String(e.abaixoMinimo.length)} />
                ${podeCusto ? html`<${LinhaLeitura} principal="Valor da reposição mínima"
                  apoio="Custo de subir cada peça em falta até o mínimo"
                  cifra=${brlCurto(e.reposicaoMinima)} />` : null}
              </div>
              <p class="silencioso" style="margin-top:11px;line-height:1.6">A cobertura pelo consumo ainda não pode ser
                calculada: nenhuma peça saiu em ordem concluída. Ela aparece sozinha depois da primeira.</p>`
            : html`
              <div class="linhas-leitura">
                <${LinhaLeitura} principal="Cobertura pelo consumo"
                  apoio="Derivada das saídas já registradas — disponível agora"
                  cifra=${e.coberturaMedia.toFixed(1) + ' meses'} />
                <${LinhaLeitura} principal="Peças a repor" apoio="Saldo igual ou abaixo do mínimo definido"
                  cifra=${String(e.abaixoMinimo.length)} />
                ${podeCusto ? html`<${LinhaLeitura} principal="Valor da reposição mínima"
                  apoio="Custo de subir cada peça em falta até o mínimo"
                  cifra=${brlCurto(e.reposicaoMinima)} />` : null}
              </div>`}
          <div class="aviso aviso-info" style="margin-top:12px">
            <${Icone} nome="informacao" tam=${16} />
            <span>Tempo médio de reposição por fornecedor depende de registro de compra, que ainda não existe na base.
            Preferimos não estimar: o número apareceria confiável e não seria.</span>
          </div>
        <//>
      </div>
    </div>`;
}

/* ──────────────────────────────────────────────────────────────────────────
   MÓDULOS — encaixa em Ajustes
   ────────────────────────────────────────────────────────────────────────── */
function PainelModulos() {
  const { dados, acoes, papel, avisar } = usar();
  const gestor = PAPEIS[papel].gestao;
  const atuais = modulosDe(dados);

  const alternar = (mod) => {
    const novo = !atuais[mod.id];
    acoes.editarOficina({ modulos: { ...atuais, [mod.id]: novo } },
      mod.nome + (novo ? ' ativado' : ' desativado'));
    avisar(mod.nome + (novo ? ' ativado.' : ' desativado. Nada mais na oficina exige esse campo.'));
  };

  return html`
    <div class="grade g-2">
      <${Cartao}>
        <div class="cartao-topo"><div><h3>Módulos opcionais</h3>
          <p class="silencioso">Cada oficina trabalha de um jeito. O que não é usado não deve aparecer.</p></div></div>
        <div style="display:flex;flex-direction:column;gap:12px">
          ${MODULOS.map(mod => {
            const ligado = atuais[mod.id] !== false;
            return html`
              <div key=${mod.id} class="modulo">
                <span style=${'width:34px;height:34px;border-radius:10px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:var(--' +
                  (ligado ? 'info' : 'superficie') + '-fundo, var(--superficie));color:var(--' + (ligado ? 'info' : 'tinta-3') + ')'}>
                  <${Icone} nome=${mod.icone} tam=${17} /></span>
                <div style="flex:1;min-width:0">
                  <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
                    <h4>${mod.nome}</h4>
                    <${Selo} tom=${ligado ? 'ok' : ''}>${ligado ? 'Ativo' : 'Desligado'}<//>
                  </div>
                  <p class="silencioso" style="margin-top:4px;line-height:1.5">${mod.resumo}</p>
                  <p class="silencioso" style="margin-top:6px;line-height:1.5">
                    <b>${ligado ? 'Com ele ligado: ' : 'Com ele desligado: '}</b>${ligado ? mod.ligado : mod.desligado}</p>
                </div>
                <div class="estado">
                  ${gestor
                    ? html`<${Interruptor} ligado=${ligado} rotulo=${mod.nome} aoTrocar=${() => alternar(mod)} />`
                    : html`<span class="silencioso">Só dono e gerente alteram</span>`}
                </div>
              </div>`;
          })}
        </div>
      <//>

      <${Cartao}>
        <div class="cartao-topo"><div><h3>Como o sistema se comporta</h3>
          <p class="silencioso">Desligar um módulo esconde o recurso, nunca apaga dado</p></div></div>
        <div class="linhas-leitura">
          ${[['Ordem de serviço', 'O campo de responsável some do cadastro e da edição'],
             ['Pátio', 'O cartão do veículo deixa de exibir a sigla do mecânico'],
             ['Orçamento e termo de entrega', 'A linha de responsável não é impressa'],
             ['Relatórios e rentabilidade', 'Os recortes por mecânico saem da lista'],
             ['Assistente', 'A regra que elege o mecânico do mês deixa de rodar'],
             ['Dados já gravados', 'Continuam na base e voltam inteiros se o módulo for religado']]
            .map(([t, d]) => html`<${LinhaLeitura} key=${t} principal=${t} apoio=${d} />`)}
        </div>
      <//>
    </div>`;
}

/* ══ 7.5 REGISTRO ══════════════════════════════════════════════════════════
   Mesma técnica da fase 6: splice no menu e mapas próprios de rota. A única
   diferença é o campo `quando`, que permite a um item existir só quando o
   módulo correspondente estiver ligado.                                    */
Object.assign(TELAS_EXTRA, {
  controle:  () => html`<${TelaControle} />`,
  analitico: () => html`<${TelaPainel} />`,
  mecanicos: () => html`<${TelaMecanicos} />`,
});

Object.assign(TITULOS_EXTRA, {
  controle: (d, m) => ['Centro de Controle', 'O que precisa da sua decisão agora'],
  analitico: (d, m) => ['Painel analítico', 'Gráficos, mix de serviços e fila do pátio'],
  mecanicos: (d, m) => ['Mecânicos',
    comMecanicos(d) ? MECANICOS.length + ' na equipe · produtividade e desempenho' : 'Módulo desligado nesta oficina'],
});

(() => {
  const depoisDe = (id) => NAV.findIndex(n => n.id === id) + 1;
  NAV.splice(depoisDe('painel'), 0,
    { id: 'controle', nome: 'Centro de Controle', icone: 'radar' });
  NAV.splice(depoisDe('estoque'), 0,
    { id: 'mecanicos', nome: 'Mecânicos', icone: 'medalha', quando: (d) => comMecanicos(d) });
  /* Na barra inferior do celular cabem cinco. O Centro de Controle ocupa a
     vaga de Clientes, que continua a um toque em "Mais". */
  const i = NAV_MOBILE.indexOf('clientes');
  if (i >= 0) NAV_MOBILE.splice(i, 1, 'controle');
})();

/* ─── FASE 17 · O QUE A BASE REALMENTE TEM ─────────────────────────────────
   A regravação sem a coluna recusada mantém a oficina trabalhando, mas ela
   trabalha às cegas: se `custo_unitario` não existe em `itens`, o orçamento do
   cliente continua saindo certo e o cálculo de lucro, não — e ninguém fica
   sabendo. Faltava um jeito de PERGUNTAR ao banco o que ele tem.

   A sondagem é somente leitura, e é essa a graça: o PostgREST recusa
   `select=coluna_que_nao_existe` com o nome da coluna dentro da mensagem — o
   mesmo texto que a fila já sabe interpretar. Dá para descobrir o formato da
   tabela sem gravar uma linha sequer, sem registro de teste sujando a base.

   Uma requisição por tabela, mais uma por coluna faltante. Em base sadia é uma
   requisição por tabela e acabou.                                          */
const CAMPOS_ENVIADOS = {
  clientes: ['id','oficina_id','tipo','nome','documento','telefone','email','cidade','uf',
             'desde','observacoes','preferencias','excluido_em'],
  veiculos: ['id','oficina_id','cliente_id','placa','marca','modelo','ano_modelo','cor',
             'km_atual','excluido_em'],
  pecas: ['id','oficina_id','codigo','descricao','marca','localizacao','custo_medio',
          'preco_venda','quantidade','estoque_minimo','excluido_em'],
  ordens: ['id','oficina_id','numero','cliente_id','veiculo_id','etapa','km_entrada','desconto',
           'aberta_em','aprovada_em','concluida_em','entregue_em','mecanico_id','relato',
           'obs_tecnica','obs_orcamento','validade_dias','garantia_dias','recusado_em',
           'motivo_recusa','checklist','aprovado_por','portal_token','excluido_em'],
  itens: ['id','oficina_id','os_id','peca_id','tipo','descricao','quantidade',
          'custo_unitario','preco_unitario','excluido_em'],
  lancamentos: ['id','oficina_id','os_id','tipo','categoria','descricao','valor','vencimento',
                'status','pago_em','excluido_em'],
  anexos: ['id','oficina_id','os_id','veiculo_id','cliente_id','caminho','nome','bytes',
           'formato','tipo','autor','criado_em','excluido_em'],
  agendamentos: ['id','oficina_id','cliente_id','veiculo_id','data','hora','nome','veiculo',
                 'servico','observacao','situacao','excluido_em'],
  usuarios: ['id','oficina_id','nome','email','papel','ativo','desde','excluido_em'],
};

async function sondarColunas(nuvem, banco, campos) {
  const restantes = campos.slice();
  const faltando = [];
  for (let volta = 0; volta <= campos.length; volta++) {
    try {
      await nuvem.ler(banco, 'select=' + restantes.join(',') + '&limit=1');
      return { ok: true, faltando };
    } catch (e) {
      const coluna = colunaRecusada(e);
      if (coluna && restantes.includes(coluna)) {
        faltando.push(coluna);
        restantes.splice(restantes.indexOf(coluna), 1);
        continue;
      }
      /* Sem permissão de leitura não é defeito de formato: é o mecânico
         olhando o financeiro. A tabela é reportada como não conferida. */
      return { ok: false, faltando, motivo: e.message };
    }
  }
  return { ok: false, faltando, motivo: 'Não consegui concluir a leitura desta tabela.' };
}

function PainelDiagnostico() {
  const { modo } = usar();
  const nuvem = useMemo(
    () => modo === 'supabase' ? criarNuvem(SUPABASE_URL, SUPABASE_ANON_KEY) : null, [modo]);
  const [estado, setEstado] = useState('parado');   // parado | rodando | pronto
  const [linhas, setLinhas] = useState([]);
  const anotadas = COLUNAS_AUSENTES;

  const rodar = async () => {
    if (!nuvem) return;
    setEstado('rodando'); setLinhas([]);
    const saida = [];
    for (const [tela, campos] of Object.entries(CAMPOS_ENVIADOS)) {
      const banco = TABELA_BANCO[tela] || tela;
      let r;
      try { r = await sondarColunas(nuvem, banco, campos); }
      catch (e) { r = { ok: false, faltando: [], motivo: e.message }; }
      saida.push({ tela, banco, ...r });
      setLinhas(saida.slice());
    }
    setEstado('pronto');
  };

  const semColuna = linhas.filter(l => l.faltando.length);
  const naoConferidas = linhas.filter(l => !l.ok);

  return html`
    <${Cartao}>
      <div class="cartao-topo"><div><h3>Conferência do banco</h3>
        <p class="silencioso">Compara o que o sistema grava com o que a sua base aceita. Só leitura — nada é escrito.</p></div></div>

      ${Object.keys(anotadas).length ? html`
        <div class="aviso aviso-alerta" style="margin-bottom:12px"><${Icone} nome="alerta" tam=${16} />
          <div><b>O sistema já contornou colunas neste aparelho.</b>
            <ul class="consequencias" style="margin-top:6px">
              ${Object.entries(anotadas).map(([t, cs]) => html`
                <li key=${t}>${t}: ${cs.join(', ')}</li>`)}
            </ul>
            <p class="secundario" style="margin-top:7px;font-size:12.5px">Os registros foram salvos sem
              esses campos — nada se perdeu de vista, mas o que ia neles não está no banco.</p>
          </div></div>` : null}

      ${modo !== 'supabase' ? html`
        <div class="aviso aviso-info"><${Icone} nome="alerta" tam=${16} />
          <span>Em modo demonstração não há banco a conferir.</span></div>`
      : html`
        <button class="btn btn-neutro" disabled=${estado === 'rodando'} onClick=${rodar}>
          <${Icone} nome=${estado === 'rodando' ? 'relogio' : 'atualizar'} tam=${15} />
          ${estado === 'rodando' ? 'Conferindo…' : estado === 'pronto' ? 'Conferir de novo' : 'Conferir agora'}</button>`}

      ${linhas.length ? html`
        <div style="margin-top:14px">
          ${linhas.map(l => html`
            <div key=${l.tela} style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid var(--linha-suave)">
              <${Icone} nome=${l.ok && !l.faltando.length ? 'check' : 'alerta'} tam=${16}
                cor=${l.ok && !l.faltando.length ? 'var(--ok)' : l.ok ? 'var(--alerta)' : 'var(--tinta-3)'} />
              <div style="flex:1;min-width:0">
                <div style="font-size:13.5px;font-weight:600;text-transform:capitalize">${l.tela}</div>
                <div class="silencioso" style="font-size:12.5px;overflow-wrap:anywhere">
                  ${!l.ok ? 'Não conferida — ' + (l.motivo || 'sem acesso de leitura')
                    : l.faltando.length ? 'Sua base não tem: ' + l.faltando.join(', ')
                    : 'Todos os campos existem'}</div>
              </div>
            </div>`)}
        </div>` : null}

      ${estado === 'pronto' ? html`
        <div class=${'aviso ' + (semColuna.length ? 'aviso-alerta' : 'aviso-ok')} style="margin-top:12px">
          <${Icone} nome=${semColuna.length ? 'alerta' : 'check'} tam=${16} />
          <span>${semColuna.length
            ? semColuna.length + (semColuna.length === 1 ? ' tabela está' : ' tabelas estão')
              + ' sem algum campo que o sistema usa. O sistema continua gravando sem eles — '
              + 'mande esta lista a quem cuida do banco para acertar de vez.'
            : 'Formato conferido. Tudo que o sistema grava tem lugar na sua base.'}
            ${naoConferidas.length ? ' ' + naoConferidas.length + ' tabela(s) o seu perfil não pode ler.' : ''}</span>
        </div>` : null}
    <//>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   FASE 8 — IDENTIDADE VISUAL
   Aditiva como as anteriores. Duas ideias só:

   1. O sistema já tinha uma biblioteca de ícones própria — traço aberto,
      24×24, ponta arredondada. Em vez de trazer uma segunda, esta fase
      estende a mesma gramática para a escala de desenho. Ícone e ilustração
      passam a ser o mesmo traço em tamanhos diferentes, o que é o que
      realmente faz uma interface parecer desenhada por uma casa só.

   2. Tela vazia deixa de ser aviso e vira convite. Como todas elas já
      passavam pelo componente <Vazio/>, trocar o miolo dele melhora as
      dezenove de uma vez, sem tocar em nenhuma tela.
   ══════════════════════════════════════════════════════════════════════════ */

/* ══ 8.1 GEOMETRIA ═════════════════════════════════════════════════════════
   Engrenagem e raios saem de função: escrever dente por dente à mão dá
   assimetria, e são as duas formas que mais se repetem na identidade.    */

/** Roda dentada com dentes trapezoidais — o desenho clássico de engrenagem. */
function caminhoEngrenagem(cx, cy, rInt, rExt, dentes) {
  const passo = (Math.PI * 2) / dentes;
  const p = (r, a) => (cx + Math.cos(a) * r).toFixed(2) + ' ' + (cy + Math.sin(a) * r).toFixed(2);
  let d = '';
  for (let i = 0; i < dentes; i++) {
    const a = i * passo - Math.PI / 2;
    d += (i ? 'L' : 'M') + p(rExt, a) + 'L' + p(rExt, a + passo * .34)
       + 'L' + p(rInt, a + passo * .5) + 'L' + p(rInt, a + passo * .94);
  }
  return d + 'Z';
}

/** Traços radiais: sulco de pneu, raio de roda, ventilação de disco. */
function caminhoRaios(cx, cy, r1, r2, n, giro = 0) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = giro + (i / n) * Math.PI * 2;
    d += 'M' + (cx + Math.cos(a) * r1).toFixed(1) + ' ' + (cy + Math.sin(a) * r1).toFixed(1)
       + 'L' + (cx + Math.cos(a) * r2).toFixed(1) + ' ' + (cy + Math.sin(a) * r2).toFixed(1);
  }
  return d;
}

/* Ícone existente reaproveitado em escala de desenho: é literalmente o mesmo
   traço da barra lateral, ampliado. Daí a unidade visual sair de graça. */
const emEscala = (nome, x, y, fator, traco) =>
  '<g transform="translate(' + x + ' ' + y + ') scale(' + fator + ')" stroke-width="' +
  (traco || (1.5 / fator)).toFixed(2) + '"><path d="' + TRACOS[nome] + '"/></g>';

/* ══ 8.2 ILUSTRAÇÕES ═══════════════════════════════════════════════════════
   Todas em 64×64, traço aberto, sem cor própria: herdam a cor do bloco.
   A classe `apoio-arte` marca o preenchimento suave que dá volume.      */
const ARTES = {
  engrenagem:
    '<path class="apoio-arte" fill="currentColor" d="' + caminhoEngrenagem(32, 32, 17, 25, 9) + '"/>' +
    '<path d="' + caminhoEngrenagem(32, 32, 17, 25, 9) + '"/>' +
    '<circle cx="32" cy="32" r="9"/><circle cx="32" cy="32" r="3.2"/>',

  pneu:
    '<circle class="apoio-arte" fill="currentColor" cx="32" cy="32" r="25"/>' +
    '<circle cx="32" cy="32" r="25"/><circle cx="32" cy="32" r="14.5"/>' +
    '<circle cx="32" cy="32" r="5"/>' +
    '<path d="' + caminhoRaios(32, 32, 19, 25, 14) + '"/>' +
    '<path d="' + caminhoRaios(32, 32, 5.5, 14.5, 5, -Math.PI / 2) + '"/>',

  volante:
    '<circle cx="32" cy="32" r="25"/><circle cx="32" cy="32" r="20"/>' +
    '<circle class="apoio-arte" fill="currentColor" cx="32" cy="32" r="7.5"/>' +
    '<circle cx="32" cy="32" r="7.5"/>' +
    '<path d="M32 39.5V52M25 29.4 13.2 25.2M39 29.4 50.8 25.2"/>',

  pistao:
    '<rect class="apoio-arte" fill="currentColor" x="18" y="6" width="28" height="20" rx="4"/>' +
    '<rect x="18" y="6" width="28" height="20" rx="4"/>' +
    '<path d="M18 12.5h28M18 17.5h28"/><circle cx="32" cy="21.5" r="2.6"/>' +
    '<path d="M28.6 26 25.8 44M35.4 26 38.2 44"/>' +
    '<circle cx="32" cy="50" r="8.5"/><circle cx="32" cy="50" r="3.6"/>',

  disco:
    '<circle class="apoio-arte" fill="currentColor" cx="29" cy="32" r="23"/>' +
    '<circle cx="29" cy="32" r="23"/>' +
    '<circle cx="29" cy="32" r="16" stroke-dasharray="2.5 5.5"/>' +
    '<circle cx="29" cy="32" r="9"/><circle cx="29" cy="32" r="3"/>' +
    '<path d="M44 21h9a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4h-9z"/>',

  bateria:
    '<rect class="apoio-arte" fill="currentColor" x="7" y="19" width="50" height="32" rx="5"/>' +
    '<rect x="7" y="19" width="50" height="32" rx="5"/>' +
    '<path d="M17 19v-5h8v5M39 19v-5h8v5M7 28h50"/>' +
    '<path d="M21 37v8M17 41h8M39 41h8"/>',

  amortecedor:
    '<circle cx="32" cy="7.5" r="4.5"/><path d="M32 12v6"/>' +
    '<path d="M23 18 41 23 23 28 41 33 23 38 41 43"/>' +
    '<rect class="apoio-arte" fill="currentColor" x="24" y="41" width="16" height="14" rx="4"/>' +
    '<rect x="24" y="41" width="16" height="14" rx="4"/>' +
    '<circle cx="32" cy="58.5" r="4"/>',

  motor:
    '<path class="apoio-arte" fill="currentColor" d="M10 31a5 5 0 0 1 5-5h5v-7h15v7h7a5 5 0 0 1 5 5v2h6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-6v3a5 5 0 0 1-5 5H15a5 5 0 0 1-5-5z"/>' +
    '<path d="M10 31a5 5 0 0 1 5-5h5v-7h15v7h7a5 5 0 0 1 5 5v2h6a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-6v3a5 5 0 0 1-5 5H15a5 5 0 0 1-5-5z"/>' +
    '<circle cx="20.5" cy="41" r="6"/><circle cx="20.5" cy="41" r="2"/>' +
    '<path d="M25 19v-4M32 19v-4M37 35h8"/>',

  catraca:
    '<circle class="apoio-arte" fill="currentColor" cx="18" cy="18" r="10.5"/>' +
    '<path d="M25.5 25.5 46 46" stroke-width="6.5"/>' +
    '<circle cx="18" cy="18" r="10.5"/>' +
    '<rect x="14" y="14" width="8" height="8" rx="1.5" transform="rotate(45 18 18)"/>' +
    '<circle cx="50" cy="50" r="5.5"/>',

  chave: emEscala('chave', 4, 4, 2.35),

  ferramentas:
    '<path class="apoio-arte" fill="currentColor" d="' + caminhoEngrenagem(22, 41, 10, 15.5, 8) + '"/>' +
    '<path d="' + caminhoEngrenagem(22, 41, 10, 15.5, 8) + '"/>' +
    '<circle cx="22" cy="41" r="5"/>' +
    emEscala('chave', 29, 3, 1.4, 1.1),

  carro: emEscala('carro', 2, 6, 2.5),
};

/** Ilustração da identidade. Herda a cor do bloco onde está, então serve
    igual no cartão claro, no vazio e sobre o azul da vitrine. */
function Ilustracao({ nome, tam = 96, halo, classe = '' }) {
  const desenho = html`<svg class=${'arte ' + classe} viewBox="0 0 64 64" width=${tam} height=${tam}
    fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    role="presentation" aria-hidden="true"
    dangerouslySetInnerHTML=${{ __html: ARTES[nome] || ARTES.engrenagem }} />`;
  return halo ? html`<span class="arte-halo">${desenho}</span>` : desenho;
}

/* ══ 8.3 TELAS VAZIAS ══════════════════════════════════════════════════════
   O componente <Vazio/> guarda a mesma assinatura de antes (icone, titulo,
   apoio, acao) — as dezenove chamadas espalhadas pelo sistema não mudam uma
   letra. O que muda é o que ele desenha: a tabela abaixo traduz o ícone que
   a tela já pedia para a peça de oficina correspondente.                 */
const ARTE_DA_TELA = {
  check: 'ferramentas', carro: 'volante', pessoas: 'volante',
  caixa: 'pneu', alerta: 'disco', raio: 'bateria', carteira: 'bateria',
  relogio: 'amortecedor', grafico: 'pistao', lucro: 'pistao',
  prancheta: 'catraca', medalha: 'catraca', arquivo: 'catraca',
  historico: 'engrenagem', elo: 'engrenagem', engrenagem: 'engrenagem',
  busca: 'chave', chave: 'chave',
};

/* ══ 8.4 VITRINE DO PAINEL ═════════════════════════════════════════════════
   Uma faixa de abertura, não um enfeite: a saudação situa a hora, a frase
   gira sozinha e as três medidas ao lado são as mesmas do painel, clicáveis.
   Sem isso seria decoração ocupando a melhor área da tela.               */
const FRASES_ABERTURA = [
  'Vamos colocar mais veículos na estrada hoje.',
  'Cada serviço concluído é mais confiança do cliente.',
  'Organização gera produtividade.',
  'Excelência em cada manutenção.',
  'Pátio organizado, cliente avisado, caixa em dia.',
  'Diagnóstico bem feito economiza o retorno.',
  'A peça certa na hora certa mantém a ordem andando.',
  'O prazo que você cumpre é o que traz o cliente de volta.',
  'Serviço explicado é orçamento aprovado.',
  'Quem controla o custo escolhe o preço.',
];

/* Ornamento da vitrine: duas engrenagens engrenadas e um pneu cortado pela
   borda. Fica em 24% de opacidade e é recortado pelo próprio bloco. */
const ORNAMENTO_VITRINE =
  '<path d="' + caminhoEngrenagem(126, 48, 27, 40, 10) + '"/><circle cx="126" cy="48" r="14"/>' +
  '<path d="' + caminhoEngrenagem(62, 100, 15, 23, 8) + '"/><circle cx="62" cy="100" r="7.5"/>' +
  '<circle cx="196" cy="118" r="40"/><circle cx="196" cy="118" r="23"/>' +
  '<path d="' + caminhoRaios(196, 118, 30, 40, 12) + '"/>';

const saudacaoDoDia = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite';
};

function FaixaBoasVindas() {
  const { dados, metricas, papel, irPara } = usar();
  const [qual, setQual] = useState(() => Math.floor(Math.random() * FRASES_ABERTURA.length));

  /* Nove segundos: tempo de ler sem virar carrossel piscando. */
  useEffect(() => {
    const t = setInterval(() => setQual(n => (n + 1) % FRASES_ABERTURA.length), 9000);
    return () => clearInterval(t);
  }, []);

  const eu = dados.usuarios.find(u => u.papel === papel && u.ativo) || dados.usuarios[0];
  const leitura = useMemo(() => leituraDoDia(dados, metricas), [dados, metricas]);
  const medidas = [
    { rotulo: 'na oficina', valor: leitura.naOficina, ir: 'patio' },
    { rotulo: leitura.prontos === 1 ? 'pronto para entrega' : 'prontos para entrega', valor: leitura.prontos, ir: 'patio' },
    { rotulo: 'faturado hoje', valor: brlCurto(leitura.hoje.receita), ir: 'financeiro' },
  ];

  return html`
    <section class="vitrine">
      <div class="dizeres">
        <div class="saudacao">${saudacaoDoDia()}, ${primeiroNome(eu?.nome)}.</div>
        <p class="frase"><span key=${qual}>${FRASES_ABERTURA[qual]}</span></p>
        <div class="medidas">
          ${medidas.map(x => html`
            <button key=${x.rotulo} class="medida" onClick=${() => irPara(x.ir)}>
              <b>${x.valor}</b><span>${x.rotulo}</span>
            </button>`)}
        </div>
      </div>
      <svg class="ornamento" width="200" height="140" viewBox="0 0 200 140" fill="none"
        stroke="currentColor" stroke-width="2.1" stroke-linejoin="round" stroke-linecap="round"
        aria-hidden="true" dangerouslySetInnerHTML=${{ __html: ORNAMENTO_VITRINE }} />
    </section>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   FASE 9 — CADASTRO COMPLETO E ACESSO DO CLIENTE
   Aditiva como as anteriores.

   O sistema já declarava a capacidade `excluir` na tabela de papéis desde a
   primeira fase, mas nenhuma tela chegava a usá-la: dava para criar e editar,
   nunca para apagar. E o catálogo de peças não tinha nem cadastro. Esta fase
   fecha esses buracos com três regras:

     1. Excluir passa sempre por confirmação e sempre grava auditoria.
     2. Antes de excluir, o sistema consulta o que depende do registro. Se
        houver vínculo, ele explica e bloqueia em vez de deixar órfão.
     3. Quem não tem a capacidade `excluir` não vê o botão. Esconder é melhor
        que mostrar e recusar depois.
   ══════════════════════════════════════════════════════════════════════════ */

/* ══ 9.1 INTEGRIDADE ═══════════════════════════════════════════════════════
   Apagar cliente com ordem no pátio deixaria a ordem sem dono e o prontuário
   sem história. Cada tipo declara aqui o que o impede e o que só avisa.   */
/* ─── FASE 17 · QUEM DECIDE É A OFICINA ────────────────────────────────────
   Até aqui, vínculo era veto: ordem concluída, veículo com histórico ou
   cliente com carro no cadastro NUNCA podiam ser excluídos, e o botão saía
   cinza sem nenhum caminho adiante. Na prática isso significa que, depois do
   primeiro mês de uso, nada mais sai da base — inclusive o que entrou errado
   no primeiro dia, que é justamente o que mais precisa sair.

   O veto virou advertência com trava consciente: o sistema continua contando
   exatamente o que será levado junto, mas quem tem a capacidade `excluir`
   confirma digitando e segue. Isso é seguro por dois motivos que já existiam
   no arquivo: a exclusão no banco é `excluido_em` (lixeira, não DELETE) e
   toda ela grava auditoria com nome e hora.                                */
function vinculosDo(d, tipo, id) {
  const bloqueios = [], avisos = [];
  if (tipo === 'cliente') {
    const ordens = d.ordens.filter(o => o.cliente_id === id);
    const veiculos = d.veiculos.filter(v => v.cliente_id === id);
    if (ordens.length) bloqueios.push(ordens.length + (ordens.length === 1 ? ' ordem de serviço' : ' ordens de serviço') + ' no histórico deste cliente');
    if (veiculos.length) bloqueios.push(veiculos.length + (veiculos.length === 1 ? ' veículo vinculado' : ' veículos vinculados') + ' ao cadastro');
  }
  if (tipo === 'veiculo') {
    const ordens = d.ordens.filter(o => o.veiculo_id === id);
    if (ordens.length) bloqueios.push(ordens.length + (ordens.length === 1 ? ' ordem registrada' : ' ordens registradas') + ' para este veículo');
  }
  if (tipo === 'peca') {
    const p = d.pecas.find(x => x.id === id);
    const usos = d.itens.filter(i => i.peca_id === id).length;
    if (usos) avisos.push('Já foi usada em ' + usos + (usos === 1 ? ' ordem' : ' ordens') + '. O histórico dessas ordens continua intacto, mas a peça some do catálogo.');
    if (p && p.quantidade > 0) avisos.push('Ainda há ' + p.quantidade + ' em estoque, no valor de ' + brlBruto(p.quantidade * p.custo_medio) + '.');
  }
  if (tipo === 'ordem') {
    const o = d.ordens.find(x => x.id === id);
    if (o && o.etapa === 'concluida') bloqueios.push('Ordem concluída faz parte do faturamento e do histórico do veículo');
    if (o && ehAtiva(o)) bloqueios.push('Ordem ainda ativa no pátio — cancele antes de excluir');
    const titulos = d.lancamentos.filter(l => l.os_id === id);
    const pagos = titulos.filter(l => l.status === 'pago');
    if (pagos.length) bloqueios.push(pagos.length + (pagos.length === 1 ? ' título já baixado' : ' títulos já baixados') + ' no financeiro');
    else if (titulos.length) avisos.push(titulos.length + (titulos.length === 1 ? ' título em aberto será removido' : ' títulos em aberto serão removidos') + ' junto.');
    const anexos = (d.anexos || []).filter(a => a.os_id === id).length;
    if (anexos) avisos.push(anexos + (anexos === 1 ? ' anexo será removido' : ' anexos serão removidos') + ' junto.');
  }
  if (tipo === 'lancamento') {
    const l = d.lancamentos.find(x => x.id === id);
    if (l && l.status === 'pago') bloqueios.push('Título já baixado: excluir apagaria um movimento de caixa que já aconteceu');
    if (l && l.os_id) avisos.push('Título gerado por uma ordem de serviço. A ordem não é afetada.');
  }
  if (tipo === 'usuario') {
    const u = d.usuarios.find(x => x.id === id);
    const registros = d.auditoria.filter(a => a.usuario === u?.nome).length;
    if (registros) avisos.push(registros + (registros === 1 ? ' registro de auditoria mantém' : ' registros de auditoria mantêm') + ' o nome desta pessoa. Desativar o acesso preserva a trilha melhor do que excluir.');
  }
  /* `pode` continua existindo para não quebrar chamador antigo, mas hoje é
     sempre verdadeiro: o que era veto virou `exigeConfirmacao`. */
  return { bloqueios, avisos, pode: true, exigeConfirmacao: bloqueios.length > 0 };
}

/* O que vai junto quando o registro sai. Serve para o texto da confirmação e
   para a ação de exclusão usarem a MESMA contagem — antes o aviso dizia uma
   coisa e a exclusão fazia outra. */
function arrastoDaExclusao(d, tipo, id) {
  const ordensDe = (filtro) => (d.ordens || []).filter(filtro);
  if (tipo === 'ordem') {
    return { ordens: ordensDe(o => o.id === id).length,
      itens: (d.itens || []).filter(i => i.os_id === id).length,
      anexos: (d.anexos || []).filter(a => a.os_id === id).length,
      titulos: (d.lancamentos || []).filter(l => l.os_id === id).length, veiculos: 0 };
  }
  if (tipo === 'veiculo') {
    const ids = new Set(ordensDe(o => o.veiculo_id === id).map(o => o.id));
    return { ordens: ids.size,
      itens: (d.itens || []).filter(i => ids.has(i.os_id)).length,
      anexos: (d.anexos || []).filter(a => ids.has(a.os_id) || a.veiculo_id === id).length,
      titulos: (d.lancamentos || []).filter(l => ids.has(l.os_id)).length, veiculos: 0 };
  }
  if (tipo === 'cliente') {
    const carros = (d.veiculos || []).filter(v => v.cliente_id === id).map(v => v.id);
    const setCarros = new Set(carros);
    const ids = new Set(ordensDe(o => o.cliente_id === id || setCarros.has(o.veiculo_id)).map(o => o.id));
    return { veiculos: carros.length, ordens: ids.size,
      itens: (d.itens || []).filter(i => ids.has(i.os_id)).length,
      anexos: (d.anexos || []).filter(a => ids.has(a.os_id) || setCarros.has(a.veiculo_id) || a.cliente_id === id).length,
      titulos: (d.lancamentos || []).filter(l => ids.has(l.os_id)).length };
  }
  return { ordens: 0, itens: 0, anexos: 0, titulos: 0, veiculos: 0 };
}

/** Frase única com o que sai junto. Vazio quando o registro está solto. */
function frasesDoArrasto(a) {
  const p = [];
  if (a.veiculos) p.push(a.veiculos + (a.veiculos === 1 ? ' veículo' : ' veículos'));
  if (a.ordens)   p.push(a.ordens + (a.ordens === 1 ? ' ordem de serviço' : ' ordens de serviço'));
  if (a.itens)    p.push(a.itens + (a.itens === 1 ? ' item de orçamento' : ' itens de orçamento'));
  if (a.anexos)   p.push(a.anexos + (a.anexos === 1 ? ' anexo' : ' anexos'));
  if (a.titulos)  p.push(a.titulos + (a.titulos === 1 ? ' título do financeiro' : ' títulos do financeiro'));
  return p;
}

/* ══ 9.2 PEÇAS DE INTERFACE ════════════════════════════════════════════════ */

/** Editar e excluir na própria linha. Some para quem não tem a capacidade. */
function AcoesLinha({ nome, aoEditar, aoExcluir }) {
  const { papel } = usar();
  const editavel = aoEditar && pode(papel, 'editar');
  const removivel = aoExcluir && pode(papel, 'excluir');
  if (!editavel && !removivel) return null;
  const parar = (f) => (e) => { e.stopPropagation(); f(); };
  return html`
    <span class="acoes-linha" onClick=${e => e.stopPropagation()}>
      ${editavel ? html`<button onClick=${parar(aoEditar)} aria-label=${'Editar ' + nome} title="Editar">
        <${Icone} nome="lapis" tam=${15} /></button>` : null}
      ${removivel ? html`<button class="perigo" onClick=${parar(aoExcluir)} aria-label=${'Excluir ' + nome} title="Excluir">
        <${Icone} nome="lixo" tam=${15} /></button>` : null}
    </span>`;
}

/** Confirmação de exclusão. Mostra o que depende do registro antes de
    perguntar, e não deixa confirmar quando existe vínculo que bloqueia. */
const PALAVRA_EXCLUIR = 'EXCLUIR';

function ConfirmarExclusao({ tipo, id, nome, descricao, rotulo, aoConfirmar, aoFechar }) {
  const { dados, avisar, papel } = usar();
  const v = useMemo(() => vinculosDo(dados, tipo, id), [dados, tipo, id]);
  const arrasto = useMemo(() => frasesDoArrasto(arrastoDaExclusao(dados, tipo, id)), [dados, tipo, id]);
  const [confirmacao, setConfirmacao] = useState('');
  /* Papel sem a capacidade continua sem excluir. O que mudou é que o
     impedimento agora é de PERMISSÃO, não de vínculo — e o texto diz qual. */
  const permitido = pode(papel, 'excluir');
  const liberado = permitido &&
    (!v.exigeConfirmacao || confirmacao.trim().toUpperCase() === PALAVRA_EXCLUIR);
  const confirmar = () => {
    if (!liberado) return;
    aoConfirmar();
    avisar((nome || 'Registro') + ' excluído.');
    aoFechar();
  };
  return html`
    <${Modal} titulo=${'Excluir ' + (rotulo || tipo) + '?'} subtitulo=${nome} aoFechar=${aoFechar} largura=${520}
      rodape=${html`
        <button class="btn btn-neutro" onClick=${aoFechar}>Manter registro</button>
        <button class="btn btn-perigo" disabled=${!liberado} onClick=${confirmar}>
          <${Icone} nome="lixo" tam=${15} />Excluir definitivamente</button>`}>
      ${descricao ? html`<p class="secundario" style="line-height:1.55">${descricao}</p>` : null}

      ${!permitido ? html`
        <div class="bloqueio" style="margin-top:12px">
          <${Icone} nome="alerta" tam=${17} />
          <div><b>Seu perfil não exclui registros.</b>
            <p class="secundario" style="margin-top:5px;font-size:12.5px">Entre como dono ou gerente,
              ou peça a quem tem esse acesso.</p></div>
        </div>` : null}

      ${permitido && v.exigeConfirmacao ? html`
        <div class="bloqueio" style="margin-top:12px">
          <${Icone} nome="alerta" tam=${17} />
          <div>
            <b>Leia antes de seguir.</b>
            <ul class="consequencias" style="margin-top:7px">
              ${v.bloqueios.map(b => html`<li key=${b}>${b}</li>`)}
            </ul>
          </div>
        </div>` : null}

      ${permitido && arrasto.length ? html`
        <div class="aviso aviso-alerta" style="margin-top:12px">
          <${Icone} nome="alerta" tam=${16} />
          <span>Sai junto: ${arrasto.join(' · ')}.</span>
        </div>` : null}

      ${permitido ? html`
        <div class="aviso aviso-erro" style="margin-top:12px">
          <${Icone} nome="alerta" tam=${16} />
          <span>A exclusão fica registrada na auditoria com o seu nome. No servidor o registro vai
            para a lixeira (não é apagado de vez), então dá para recuperar pelo suporte.</span>
        </div>` : null}

      ${v.avisos.length ? html`
        <ul class="consequencias">${v.avisos.map(a => html`<li key=${a}>${a}</li>`)}</ul>` : null}

      ${permitido && v.exigeConfirmacao ? html`
        <div style="margin-top:14px">
          <${Campo} rotulo=${'Digite ' + PALAVRA_EXCLUIR + ' para liberar o botão'}
            ajuda="A trava existe para exclusão não acontecer por toque errado.">
            <input class="entrada mono" value=${confirmacao} autocomplete="off" autocapitalize="characters"
              placeholder=${PALAVRA_EXCLUIR} aria-label=${'Digite ' + PALAVRA_EXCLUIR}
              onInput=${e => setConfirmacao(e.target.value)} />
          <//>
        </div>` : null}
    <//>`;
}

/* ══ 9.3 CADASTRO DE PEÇAS ═════════════════════════════════════════════════
   O estoque era a única tabela sem cadastro: dava para ver o saldo e não
   dava para mexer nele. Aqui entram criar, editar e ajustar saldo.      */
function FormPeca({ registro, aoFechar }) {
  const { dados, acoes, avisar, papel } = usar();
  const [f, setF] = useState(() => registro
    ? { ...registro, custo_medio: String(registro.custo_medio), preco_venda: String(registro.preco_venda),
        quantidade: String(registro.quantidade), estoque_minimo: String(registro.estoque_minimo) }
    : { codigo:'', descricao:'', marca:'', localizacao:'', custo_medio:'', preco_venda:'',
        quantidade:'0', estoque_minimo:'1' });
  const [erros, setErros] = useState({});

  const custo = numeroBR(f.custo_medio);
  const venda = numeroBR(f.preco_venda);
  const margem = margemDe(f.custo_medio, f.preco_venda);
  const lucro = lucroUnitario(f.custo_medio, f.preco_venda);
  /* Papel sem a capacidade `custo` não vê o número nem por engano: o campo
     não é desenhado, e o valor que já estava gravado segue intacto no
     `salvar` porque ele lê `f`, não a tela. */
  const podeCusto = pode(papel, 'custo');

  const salvar = () => {
    const e = {};
    const codigo = f.codigo.trim().toUpperCase();
    if (!codigo) e.codigo = 'O código é como a peça é encontrada na prateleira.';
    else if (dados.pecas.some(p => p.codigo.toUpperCase() === codigo && p.id !== registro?.id))
      e.codigo = 'Já existe uma peça com este código.';
    if (!f.descricao.trim()) e.descricao = 'Descreva a peça.';
    if (venda <= 0) e.preco_venda = 'Informe o preço de venda.';
    if (custo > venda && venda > 0) e.preco_venda = 'O preço está abaixo do custo. Confira antes de salvar.';
    setErros(e);
    if (Object.keys(e).length) return;
    const campos = { codigo, descricao: f.descricao.trim(), marca: f.marca.trim(),
      localizacao: f.localizacao.trim(), custo_medio: custo, preco_venda: venda,
      quantidade: Math.max(0, inteiroBR(f.quantidade)),
      estoque_minimo: Math.max(0, Number(f.estoque_minimo) || 0) };
    if (registro) { acoes.editarPeca(registro.id, campos); avisar(campos.descricao + ' atualizada.'); }
    else { acoes.criarPeca(campos); avisar(campos.descricao + ' cadastrada no estoque.'); }
    aoFechar();
  };

  return html`
    <${Modal} titulo=${registro ? 'Editar peça' : 'Nova peça'} subtitulo=${registro ? registro.codigo : 'Cadastro do catálogo'}
      aoFechar=${aoFechar} largura=${620}
      rodape=${html`<button class="btn btn-neutro" onClick=${aoFechar}>Cancelar</button>
        <button class="btn btn-primario" onClick=${salvar}>${registro ? 'Salvar alterações' : 'Cadastrar peça'}</button>`}>
      <div style="display:grid;grid-template-columns:1fr 2fr;gap:12px">
        <${Campo} rotulo="Código" erro=${erros.codigo}>
          <input class="entrada mono" style="text-transform:uppercase" value=${f.codigo}
            aria-invalid=${Boolean(erros.codigo)} onInput=${e => setF(x => ({ ...x, codigo: e.target.value }))} />
        <//>
        <${Campo} rotulo="Descrição" erro=${erros.descricao}>
          <input class="entrada" value=${f.descricao} aria-invalid=${Boolean(erros.descricao)}
            onInput=${e => setF(x => ({ ...x, descricao: e.target.value }))} />
        <//>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <${Campo} rotulo="Marca" ajuda="Opcional">
          <input class="entrada" value=${f.marca} onInput=${e => setF(x => ({ ...x, marca: e.target.value }))} />
        <//>
        <${Campo} rotulo="Prateleira" ajuda="Onde a peça fica guardada">
          <input class="entrada mono" value=${f.localizacao} onInput=${e => setF(x => ({ ...x, localizacao: e.target.value }))} />
        <//>
      </div>
      ${podeCusto ? html`
        <div class="bloco-interno" style="margin-bottom:14px">
          <span class="aviso-interno"><${Icone} nome="cadeado" tam=${12} />Interno · nunca aparece para o cliente</span>
          <${Campo} rotulo=${CUSTO_OFICINA} ajuda="O que a peça custou para entrar na prateleira">
            <input class="entrada mono" type="text" inputmode="decimal" autocomplete="off" placeholder="0,00" value=${f.custo_medio}
              onInput=${e => setF(x => ({ ...x, custo_medio: e.target.value }))} />
          <//>
        </div>` : null}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <${Campo} rotulo=${VALOR_CLIENTE} erro=${erros.preco_venda}
          ajuda="É este o valor que sai na ordem de serviço">
          <input class="entrada mono" type="text" inputmode="decimal" autocomplete="off" placeholder="0,00" value=${f.preco_venda}
            aria-invalid=${Boolean(erros.preco_venda)} onInput=${e => setF(x => ({ ...x, preco_venda: e.target.value }))} />
        <//>
        ${podeCusto ? html`
          <div class="campo">
            <span>Lucro da peça</span>
            <div class=${'caixa-lucro' + (lucro < 0 ? ' negativo' : '')}>
              <span class="valor-lucro">${brlBruto(lucro)}</span>
              ${venda > 0 ? html`<span class="silencioso mono">${pct(margem)}</span>` : null}
            </div>
            <span class="ajuda">Calculado sozinho: ${VALOR_CLIENTE.toLowerCase()} menos ${CUSTO_OFICINA.toLowerCase()}</span>
          </div>` : null}
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <${Campo} rotulo="Saldo em estoque" ajuda=${registro ? 'Ajuste manual: fica na auditoria' : 'Quantidade inicial'}>
          <input class="entrada mono" type="number" min="0" value=${f.quantidade}
            onInput=${e => setF(x => ({ ...x, quantidade: e.target.value }))} />
        <//>
        <${Campo} rotulo="Estoque mínimo" ajuda="Abaixo disso o sistema avisa">
          <input class="entrada mono" type="number" min="0" value=${f.estoque_minimo}
            onInput=${e => setF(x => ({ ...x, estoque_minimo: e.target.value }))} />
        <//>
      </div>
    <//>`;
}

/* ══ 9.4 LANÇAMENTOS ═══════════════════════════════════════════════════════
   Dava para dar baixa em título, não para criar um. Uma conta de luz não
   nascia de ordem nenhuma e por isso não tinha como entrar no sistema.   */
const CATEGORIAS_RECEBER = ['Serviço', 'Peças', 'Retífica', 'Outros'];
const CATEGORIAS_PAGAR = ['Peças', 'Fornecedor', 'Aluguel', 'Energia', 'Água', 'Folha',
  'Impostos', 'Ferramentas', 'Marketing', 'Outros'];

function FormLancamento({ registro, tipoInicial, aoFechar }) {
  const { acoes, avisar } = usar();
  const [f, setF] = useState(() => registro
    ? { ...registro, valor: String(registro.valor) }
    : { tipo: tipoInicial || 'pagar', categoria: '', descricao: '', valor: '',
        vencimento: hojeISO() });
  const [erros, setErros] = useState({});
  const categorias = f.tipo === 'receber' ? CATEGORIAS_RECEBER : CATEGORIAS_PAGAR;

  const salvar = () => {
    const e = {};
    if (!f.descricao.trim()) e.descricao = 'Descreva o título para reconhecê-lo depois.';
    if (!(numeroBR(f.valor) > 0)) e.valor = 'Informe um valor maior que zero.';
    if (!f.vencimento) e.vencimento = 'Informe o vencimento.';
    setErros(e);
    if (Object.keys(e).length) return;
    const campos = { tipo: f.tipo, categoria: f.categoria || 'Outros', descricao: f.descricao.trim(),
      valor: numeroBR(f.valor), vencimento: f.vencimento };
    if (registro) { acoes.editarLancamento(registro.id, campos); avisar('Título atualizado.'); }
    else { acoes.criarLancamento(campos); avisar('Título de ' + brlBruto(campos.valor) + ' lançado.'); }
    aoFechar();
  };

  return html`
    <${Modal} titulo=${registro ? 'Editar título' : 'Novo lançamento'}
      subtitulo=${registro ? null : 'Entra em aberto; a baixa é registrada depois'}
      aoFechar=${aoFechar} largura=${540}
      rodape=${html`<button class="btn btn-neutro" onClick=${aoFechar}>Cancelar</button>
        <button class="btn btn-primario" onClick=${salvar}>${registro ? 'Salvar alterações' : 'Lançar'}</button>`}>
      ${!registro ? html`
        <div class="filtros">
          ${[['pagar', 'A pagar'], ['receber', 'A receber']].map(([id, nome]) => html`
            <button key=${id} class="filtro" aria-pressed=${f.tipo === id}
              onClick=${() => setF(x => ({ ...x, tipo: id, categoria: '' }))}>${nome}</button>`)}
        </div>` : null}
      <${Campo} rotulo="Descrição" erro=${erros.descricao}>
        <input class="entrada" value=${f.descricao} aria-invalid=${Boolean(erros.descricao)}
          placeholder=${f.tipo === 'pagar' ? 'Ex.: energia elétrica de julho' : 'Ex.: serviço avulso balcão'}
          onInput=${e => setF(x => ({ ...x, descricao: e.target.value }))} />
      <//>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <${Campo} rotulo="Valor" erro=${erros.valor}>
          <input class="entrada mono" type="text" inputmode="decimal" autocomplete="off" placeholder="0,00" value=${f.valor}
            aria-invalid=${Boolean(erros.valor)} onInput=${e => setF(x => ({ ...x, valor: e.target.value }))} />
        <//>
        <${Campo} rotulo="Vencimento" erro=${erros.vencimento}>
          <input class="entrada mono" type="date" value=${f.vencimento}
            aria-invalid=${Boolean(erros.vencimento)} onInput=${e => setF(x => ({ ...x, vencimento: e.target.value }))} />
        <//>
      </div>
      <${Campo} rotulo="Categoria" ajuda="Usada nos relatórios e no gráfico de despesas">
        <select class="entrada" value=${f.categoria} onInput=${e => setF(x => ({ ...x, categoria: e.target.value }))}>
          <option value="">Escolha a categoria</option>
          ${categorias.map(c => html`<option key=${c} value=${c}>${c}</option>`)}
        </select>
      <//>
    <//>`;
}

/* ══ 9.5 ITENS DA ORDEM ════════════════════════════════════════════════════
   Era o buraco mais sério: aberta a ordem, nenhuma peça ou serviço podia ser
   acrescentado. Na prática o diagnóstico sempre muda o orçamento.       */
function EditorItensOS({ os, iniciarAberto }) {
  const { dados, acoes, papel, avisar } = usar();
  const [novo, setNovo] = useState({ tipo:'peca', peca_id:'', descricao:'', quantidade:'1',
    custo_unitario:'', preco_unitario:'', baixar:true });
  const [aberto, setAberto] = useState(Boolean(iniciarAberto));
  const podeMexer = ehAtiva(os) && pode(papel, 'editar');
  /* AUDITORIA (fase 15): este formulário mostrava "Custo un." para qualquer
     papel com permissão de editar. O mecânico edita a ordem e NÃO tem a
     capacidade `custo` — e ao escolher uma peça do estoque o campo aparecia
     preenchido com o custo da oficina. O custo continua sendo gravado a
     partir do catálogo; o que muda é que ele para de ser desenhado. */
  const podeCusto = pode(papel, 'custo');
  if (!podeMexer) return null;

  const escolherPeca = (id) => {
    const p = dados.pecas.find(x => x.id === id);
    setNovo(n => ({ ...n, peca_id: id, descricao: p ? p.descricao : '',
      custo_unitario: p ? String(p.custo_medio) : '', preco_unitario: p ? String(p.preco_venda) : '' }));
  };

  const incluir = () => {
    const qtd = Math.max(1, inteiroBR(novo.quantidade) || 1);
    const preco = numeroBR(novo.preco_unitario);
    if (!novo.descricao.trim()) { avisar('Descreva o item antes de incluir.'); return; }
    if (preco <= 0) { avisar('Informe o preço do item.'); return; }
    acoes.adicionarItemOS(os.id, { tipo: novo.tipo, peca_id: novo.tipo === 'peca' ? (novo.peca_id || null) : null,
      descricao: novo.descricao.trim(), quantidade: qtd,
      custo_unitario: numeroBR(novo.custo_unitario), preco_unitario: preco });
    /* Baixa de estoque explícita: o sistema nunca mexeu no saldo sozinho e
       mudar isso por baixo dos panos bagunçaria o histórico de quem já usa. */
    const p = dados.pecas.find(x => x.id === novo.peca_id);
    if (novo.tipo === 'peca' && novo.baixar && p)
      acoes.ajustarEstoque(p.id, p.quantidade - qtd, 'Baixa pela OS ' + os.numero);
    avisar(novo.descricao.trim() + ' incluído na ordem.');
    setNovo({ tipo:'peca', peca_id:'', descricao:'', quantidade:'1', custo_unitario:'', preco_unitario:'', baixar:true });
    setAberto(false);
  };

  if (!aberto) return html`
    <button class="btn btn-neutro btn-bloco" onClick=${() => setAberto(true)}>
      <${Icone} nome="mais" tam=${15} />Incluir peça ou serviço nesta ordem</button>`;

  const pecaEscolhida = dados.pecas.find(x => x.id === novo.peca_id);
  const lucroDaLinha = Math.max(1, inteiroBR(novo.quantidade) || 1) * lucroUnitario(novo.custo_unitario, novo.preco_unitario);
  return html`
    <div class="novo-item">
      <div class="filtros">
        ${[['peca', 'Peça'], ['servico', 'Serviço']].map(([id, nome]) => html`
          <button key=${id} class="filtro" aria-pressed=${novo.tipo === id}
            onClick=${() => setNovo(n => ({ ...n, tipo: id, peca_id: '', descricao: '', custo_unitario: '', preco_unitario: '' }))}>${nome}</button>`)}
      </div>
      ${novo.tipo === 'peca' ? html`
        <${Campo} rotulo="Do estoque" ajuda="Ou deixe em branco e digite a descrição abaixo">
          <select class="entrada" value=${novo.peca_id} onInput=${e => escolherPeca(e.target.value)}>
            <option value="">Item avulso</option>
            ${dados.pecas.map(p => html`<option key=${p.id} value=${p.id}>
              ${p.codigo} · ${p.descricao} (saldo ${p.quantidade})</option>`)}
          </select>
        <//>` : null}
      <div class=${'campos' + (podeCusto ? '' : ' sem-custo')}>
        <${Campo} rotulo="Descrição">
          <input class="entrada" value=${novo.descricao} onInput=${e => setNovo(n => ({ ...n, descricao: e.target.value }))} />
        <//>
        <${Campo} rotulo="Qtd">
          <input class="entrada mono" type="number" min="1" value=${novo.quantidade}
            onInput=${e => setNovo(n => ({ ...n, quantidade: e.target.value }))} />
        <//>
        ${podeCusto ? html`
          <${Campo} rotulo=${CUSTO_OFICINA} ajuda="Interno">
            <input class="entrada mono" type="text" inputmode="decimal" autocomplete="off" placeholder="0,00" value=${novo.custo_unitario}
              onInput=${e => setNovo(n => ({ ...n, custo_unitario: e.target.value }))} />
          <//>` : null}
        <${Campo} rotulo=${VALOR_CLIENTE} ajuda="Sai na ordem">
          <input class="entrada mono" type="text" inputmode="decimal" autocomplete="off" placeholder="0,00" value=${novo.preco_unitario}
            onInput=${e => setNovo(n => ({ ...n, preco_unitario: e.target.value }))} />
        <//>
      </div>
      ${podeCusto && numeroBR(novo.preco_unitario) > 0 ? html`
        <div class="linha-lucro">
          <span class="secundario" style="font-size:12.5px">Lucro desta linha</span>
          <span class="valor-lucro" style=${'color:' + (lucroDaLinha >= 0 ? 'var(--ok)' : 'var(--erro)')}>
            ${brlBruto(lucroDaLinha)}</span>
        </div>` : null}
      ${pecaEscolhida ? html`
        <label style="display:flex;align-items:center;gap:9px;font-size:13px;color:var(--tinta-2)">
          <input type="checkbox" checked=${novo.baixar} onChange=${e => setNovo(n => ({ ...n, baixar: e.target.checked }))} />
          Dar baixa no estoque (saldo vai de ${pecaEscolhida.quantidade} para
          ${Math.max(0, pecaEscolhida.quantidade - (inteiroBR(novo.quantidade) || 1))})
        </label>` : null}
      <div style="display:flex;gap:8px;justify-content:flex-end">
        <button class="btn btn-neutro btn-p" onClick=${() => setAberto(false)}>Cancelar</button>
        <button class="btn btn-primario btn-p" onClick=${incluir}>Incluir na ordem</button>
      </div>
    </div>`;
}

/** Botão de remover item, usado dentro da lista já existente do orçamento. */
function RemoverItem({ os, item }) {
  const { acoes, papel, avisar } = usar();
  if (!ehAtiva(os) || !pode(papel, 'editar')) return null;
  return html`
    <button class="remover" title=${'Remover ' + item.descricao} aria-label=${'Remover ' + item.descricao}
      onClick=${() => { acoes.removerItemOS(os.id, item.id); avisar(item.descricao + ' removido da ordem.'); }}>
      <${Icone} nome="lixo" tam=${14} /></button>`;
}

/** Cancelar e excluir a ordem, no rodapé do detalhe. */
function EncerrarOS({ os, aoFechar }) {
  const { acoes, papel, avisar } = usar();
  const [confirmar, setConfirmar] = useState(null);
  const [motivo, setMotivo] = useState('');
  const ativa = ehAtiva(os);
  if (!pode(papel, 'editar')) return null;

  return html`
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${ativa ? html`
        <button class="btn btn-perigo-suave btn-p" onClick=${() => setConfirmar('cancelar')}>
          <${Icone} nome="x" tam=${14} />Cancelar ordem</button>` : null}
      ${/* FASE 17: o botão só existia para ordem já encerrada, e a confirmação
           ainda vetava a concluída — ou seja, não havia estado nenhum em que
           excluir fosse possível. Agora ele aparece sempre para quem tem a
           capacidade, e a decisão fica na confirmação. */ ''}
      ${pode(papel, 'excluir') ? html`
        <button class="btn btn-perigo-suave btn-p" onClick=${() => setConfirmar('excluir')}>
          <${Icone} nome="lixo" tam=${14} />Excluir ordem</button>` : null}

      ${confirmar === 'cancelar' ? html`
        <${Modal} titulo=${'Cancelar a OS ' + os.numero + '?'} largura=${480}
          subtitulo="O veículo sai do pátio e a ordem deixa de contar no faturamento"
          aoFechar=${() => setConfirmar(null)}
          rodape=${html`<button class="btn btn-neutro" onClick=${() => setConfirmar(null)}>Voltar</button>
            <button class="btn btn-perigo" onClick=${() => {
              acoes.cancelarOS(os.id, motivo.trim()); avisar('OS ' + os.numero + ' cancelada.');
              setConfirmar(null); aoFechar && aoFechar(); }}>Cancelar a ordem</button>`}>
          <p class="secundario" style="line-height:1.55">A ordem continua no histórico com a situação
            <b>cancelada</b> — nada é apagado. Isso preserva o registro do que foi combinado e por que não seguiu.</p>
          <${Campo} rotulo="Motivo" ajuda="Aparece na auditoria e na ficha do cliente">
            <textarea class="entrada" value=${motivo} placeholder="Ex.: cliente desistiu do serviço após o orçamento"
              onInput=${e => setMotivo(e.target.value)}></textarea>
          <//>
        <//>` : null}

      ${confirmar === 'excluir' ? html`
        <${ConfirmarExclusao} tipo="ordem" id=${os.id} rotulo="ordem de serviço" nome=${'OS ' + os.numero}
          descricao="A ordem sai da base junto com os itens, os eventos de etapa e os anexos."
          aoFechar=${() => setConfirmar(null)}
          aoConfirmar=${() => { acoes.excluirOS(os.id); aoFechar && aoFechar(); }} />` : null}
    </div>`;
}

/* ══ 9.6 ACESSO DO CLIENTE POR LINK ════════════════════════════════════════
   O portal existia como prévia interna: montava o pacote, aplicava as regras
   de exposição e desenhava a tela — mas não havia endereço que o cliente
   pudesse abrir. Como o sistema é um arquivo só, a rota vive no fragmento
   da URL (#/os/numero/token), que nenhum servidor precisa entender.

   O token sai de tokenPortal(), que já existia: mesma ordem, mesmo código,
   e nada nele permite descobrir outra ordem.                            */
const ROTA_PUBLICA = lerRota();   // fase 10: reconhece o link ao vivo e o independente

/** Endereço que o cliente recebe. Funciona em qualquer hospedagem estática. */
const baseDoEndereco = () => String(location.href || '').split('#')[0];
const enderecoPublico = (o) => tokenPortal(o)
  ? baseDoEndereco() + '#/os/' + o.numero + '/' + tokenPortal(o) : '';

function VistaPublica({ rota, dados, metricas }) {
  const ordem = metricas.ordens.find(o => o.numero === rota.numero);
  /* Comparar com o token gravado, e só com ele. */
  const valida = Boolean(ordem) && tokenPortal(ordem) !== '' && tokenPortal(ordem) === rota.token;
  const pacote = useMemo(() => (valida ? pacotePortal(ordem, dados, metricas) : null),
    [valida, ordem, dados, metricas]);

  const cabecalho = html`
    <header class="publico-topo">
      ${dados.oficina.logo
        ? html`<img src=${dados.oficina.logo} alt="" style="max-height:36px;max-width:120px;object-fit:contain" />`
        : html`<span style="width:34px;height:34px;border-radius:10px;background:var(--azul-acao);display:flex;align-items:center;justify-content:center">
            <${Icone} nome="chave" tam=${18} cor="#fff" /></span>`}
      <div style="min-width:0">
        <div class="nome corta">${dados.oficina.nome}</div>
        <div class="silencioso corta">${fmtTel(dados.oficina.telefone)}</div>
      </div>
    </header>`;

  if (!valida) return html`
    <div class="publico">
      ${cabecalho}
      <div class="publico-aviso">
        <${Vazio} icone="alerta" titulo="Este link não abre nenhuma ordem"
          apoio="Ou o endereço foi copiado pela metade, ou a ordem não existe mais. Fale com a oficina pelo telefone acima e peça um link novo." />
      </div>
    </div>`;

  return html`
    <div class="publico">
      ${cabecalho}
      <main class="publico-corpo"><${PreviaPortal} pacote=${pacote} /></main>
      <footer class="publico-rodape">
        Esta página mostra apenas a sua ordem de serviço. Custos internos, documentos e
        anotações da oficina não aparecem aqui.<br />
        ${dados.oficina.endereco}
      </footer>
    </div>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   FASE 10 — ENTRADA DE FOTOS E LINK QUE FUNCIONA SEM BANCO
   Aditiva como as anteriores. Duas frentes:

   1. Anexar arquivo só existia dentro da ordem de serviço, e só por clique:
      não havia arrastar, não havia câmera e o veículo não tinha foto nenhuma.
      Aqui entra uma entrada de mídia única — arrastar, galeria, câmera e
      colar — usada tanto no cadastro do veículo quanto na ordem.

   2. O portal dependia dos dois navegadores enxergarem a mesma base. O link
      independente resolve isso sem banco: o pacote do cliente vai compactado
      dentro do próprio endereço. É uma foto do momento, não o estado ao vivo.
   ══════════════════════════════════════════════════════════════════════════ */

/* ══ 10.1 ENTRADA DE MÍDIA ═════════════════════════════════════════════════ */
Object.assign(TRACOS, {
  'seta-direita': 'M5 12h14M13 6l6 6-6 6',
  galeria: 'M8 3h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2M6 7H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1M11 8.5h.01M21 12l-3.2-3-4.8 4.5',
  link: 'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5',
  copiar: 'M9 9h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
});

/* Uma foto de veículo é anexo como qualquer outro; só faltava o tipo. */
TIPOS_ANEXO.push({ id: 'veiculo', nome: 'Foto do veículo', icone: 'carro' });

/** Arrastar, escolher da galeria, tirar foto ou colar. Devolve o arquivo já
    lido como data URL, no formato que `acoes.anexar` espera. */
/** Reduz a foto no próprio navegador: no máximo 1600px no maior lado, JPEG.
    Uma lataria de 4000×3000 vira algo em torno de 300 KB sem perder o que
    interessa — o risco, o amassado, a placa. */
function reduzirImagem(arquivo, ladoMax = 1600, qualidade = 0.82) {
  return new Promise((ok, falhou) => {
    const url = URL.createObjectURL(arquivo);
    const img = new Image();
    img.onerror = () => { URL.revokeObjectURL(url); falhou(new Error('imagem ilegível')); };
    img.onload = () => {
      URL.revokeObjectURL(url);
      const escala = Math.min(1, ladoMax / Math.max(img.width, img.height));
      const l = Math.max(1, Math.round(img.width * escala));
      const a = Math.max(1, Math.round(img.height * escala));
      const tela = document.createElement('canvas');
      tela.width = l; tela.height = a;
      const ctx = tela.getContext('2d');
      /* Fundo branco: PNG com transparência vira preto ao virar JPEG. */
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, l, a);
      ctx.drawImage(img, 0, 0, l, a);
      tela.toBlob((b) => {
        if (!b) { falhou(new Error('falha ao comprimir')); return; }
        /* Se a redução não ajudou (foto já pequena e muito detalhada),
           devolve a original em vez de entregar algo pior. */
        if (b.size >= arquivo.size) { ok(arquivo); return; }
        const nome = String(arquivo.name || 'foto').replace(/\.[^.]+$/, '') + '.jpg';
        ok(new File([b], nome, { type: 'image/jpeg', lastModified: Date.now() }));
      }, 'image/jpeg', qualidade);
    };
    img.src = url;
  });
}

function EntradaDeMidia({ aoReceber, aceitaPdf, compacta }) {
  const { avisar } = usar();
  const daGaleria = useRef(null);
  const daCamera = useRef(null);
  const [arrastando, setArrastando] = useState(false);

  const processar = useCallback((arquivos) => {
    [...(arquivos || [])].forEach(async (arq) => {
      if (!arq) return;
      const ehImagem = String(arq.type || '').startsWith('image');
      if (!ehImagem && !(aceitaPdf && arq.type === 'application/pdf')) {
        avisar(arq.name + ': envie imagem' + (aceitaPdf ? ' ou PDF' : '') + '.'); return;
      }
      /* AUDITORIA (uso real): o teto de 1,5 MB recusava a foto e mandava a
         pessoa "reduzir antes de enviar" — sem dizer como. Celular atual
         produz de 3 a 8 MB por foto, então a recusa era o caso NORMAL, não a
         exceção. O balconista teria que sair do sistema, abrir um editor e
         voltar, para cada avaria fotografada.

         O teto vinha de quando a foto virava data URL dentro do estado, e
         quarenta delas estouravam o backup. Hoje o binário vai para o
         Storage, e o banco aceita até 15 MB. O limite virou herança de uma
         arquitetura que já mudou.

         Agora a foto é reduzida aqui, no navegador, antes de subir. */
      if (ehImagem && arq.size > LIMITE_ANEXO) {
        try {
          arq = await reduzirImagem(arq);
        } catch (_) {
          avisar(arq.name + ': não deu para reduzir esta imagem. Tente outra foto.'); return;
        }
        if (arq.size > LIMITE_ANEXO * 4) {
          avisar(arq.name + ' continua grande demais mesmo reduzida.'); return;
        }
      } else if (arq.size > LIMITE_ANEXO * 4) {
        avisar(arq.name + ' passa de 6 MB. Envie um arquivo menor.'); return;
      }
      const leitor = new FileReader();
      leitor.onerror = () => avisar(MENSAGENS_ERRO.arquivo);
      leitor.onload = () => {
        const url = String(leitor.result || '');
        const aceito = imagemSegura(url) || (aceitaPdf && /^data:application\/pdf;base64,[A-Za-z0-9+/=]+$/.test(url));
        if (!aceito) { avisar(arq.name + ': o conteúdo não confere com o tipo do arquivo.'); return; }
        /* `arquivo` viaja junto: em modo demonstração é ignorado, com banco
           é ele que sobe para o Storage. A data URL continua servindo à
           miniatura enquanto o envio acontece. */
        aoReceber({ nome: String(arq.name || 'foto.jpg').slice(0, 120), url,
          bytes: arq.size, formato: arq.type || 'image/jpeg', arquivo: arq });
      };
      leitor.readAsDataURL(arq);
    });
  }, [aoReceber, aceitaPdf, avisar]);

  /* Colar direto: no balcão a foto da avaria costuma vir do WhatsApp Web,
     e o caminho mais curto é Ctrl+V. Só reage a arquivo, nunca a texto. */
  /* AUDITORIA: o ouvinte era registrado no `window` por instância montada.
     Com a ficha da OS aberta (anexos) e o prontuário do veículo na mesma
     tela (fotos), um único Ctrl+V anexava a MESMA foto nos dois lugares.
     Agora só a área que tem o foco — ou a última em que se clicou —
     recebe o que foi colado. */
  const raiz = useRef(null);
  useEffect(() => {
    const colar = (e) => {
      const alvo = document.activeElement;
      const minha = raiz.current && (raiz.current.contains(alvo) || raiz.current === alvo
                    || raiz.current.dataset.ultimoFoco === '1');
      if (!minha) return;
      const arquivos = [...(e.clipboardData?.items || [])]
        .filter(i => i.kind === 'file').map(i => i.getAsFile()).filter(Boolean);
      if (arquivos.length) { e.preventDefault(); processar(arquivos); }
    };
    window.addEventListener('paste', colar);
    return () => window.removeEventListener('paste', colar);
  }, [processar]);

  /* Clicar na área a marca como destino do próximo Ctrl+V. */
  const marcarFoco = useCallback(() => {
    document.querySelectorAll('[data-ultimo-foco="1"]').forEach(n => { delete n.dataset.ultimoFoco; });
    if (raiz.current) raiz.current.dataset.ultimoFoco = '1';
  }, []);

  const receber = (e) => { processar(e.target.files); e.target.value = ''; };
  const aceita = aceitaPdf ? 'image/*,application/pdf' : 'image/*';

  return html`
    <div ref=${raiz} tabindex="0" onClick=${marcarFoco} onFocus=${marcarFoco}
      class=${'solta' + (arrastando ? ' ativa' : '') + (compacta ? ' compacta' : '')}
      onDragOver=${e => { e.preventDefault(); setArrastando(true); }}
      onDragEnter=${e => { e.preventDefault(); setArrastando(true); }}
      onDragLeave=${e => { if (!e.currentTarget.contains(e.relatedTarget)) setArrastando(false); }}
      onDrop=${e => { e.preventDefault(); setArrastando(false); processar(e.dataTransfer?.files); }}>
      <span class="marca-solta"><${Icone} nome="camera" tam=${20} /></span>
      <div>
        <div class="dizer">
          <span class="so-ponteiro">Arraste as fotos aqui</span>
          <span class="so-toque">Adicionar fotos</span>
        </div>
        <div class="apoio-solta">
          <span class="so-ponteiro">ou cole com Ctrl+V, ou use os botões abaixo · </span>
          ${aceitaPdf ? 'Imagens ou PDF' : 'Imagens'} · fotos grandes são reduzidas sozinhas
        </div>
      </div>
      <div class="botoes-midia">
        <button class="btn btn-neutro btn-p" onClick=${() => daGaleria.current?.click()}>
          <${Icone} nome="galeria" tam=${15} />Buscar na galeria</button>
        <button class="btn btn-neutro btn-p" onClick=${() => daCamera.current?.click()}>
          <${Icone} nome="camera" tam=${15} />Tirar foto</button>
      </div>
      <input ref=${daGaleria} type="file" multiple accept=${aceita} style="display:none" onChange=${receber} />
      ${/* `capture` faz o celular abrir a câmera traseira direto, sem passar
           pelo seletor de arquivos. No computador vira um seletor comum. */ ''}
      <input ref=${daCamera} type="file" accept="image/*" capture="environment"
        style="display:none" onChange=${receber} />
    </div>`;
}

/** Grade de miniaturas com ampliar e remover. Serve para arquivo já gravado
    e para o que ainda está pendente no formulário. */
function Miniaturas({ itens, aoRemover, pendente }) {
  const [ampliado, setAmpliado] = useState(null);
  if (!itens || !itens.length) return null;
  return html`
    <div class="galeria">
      ${itens.map((a, i) => html`
        <div key=${a.id || a.nome + i} class=${'anexo' + (pendente ? ' pendente' : '')}
          onClick=${() => String(a.formato || '').startsWith('image') && setAmpliado(a)}>
          ${String(a.formato || '').startsWith('image')
            ? html`<img src=${a.url} alt=${a.nome} loading="lazy" />`
            : html`<div class="anexo-doc"><${Icone} nome="arquivo" tam=${20} /><span class="corta">${a.nome}</span></div>`}
          ${pendente ? html`<span class="marca-pendente">nova</span>` : null}
          ${aoRemover ? html`
            <button class="remover" aria-label=${'Remover ' + a.nome}
              onClick=${e => { e.stopPropagation(); aoRemover(a, i); }}>
              <${Icone} nome="x" tam=${12} /></button>` : null}
        </div>`)}
      ${ampliado ? html`
        <div class="lupa" onClick=${() => setAmpliado(null)}>
          <div style="display:flex;flex-direction:column;align-items:center;gap:12px">
            <img src=${ampliado.url} alt=${ampliado.nome} />
            <div style="color:#fff;font-size:13px">${ampliado.nome}</div>
          </div>
        </div>` : null}
    </div>`;
}

/** Fotos de um veículo já cadastrado — usada no prontuário. */
function FotosDoVeiculo({ veiculoId, compacta }) {
  const { dados, acoes, papel, avisar } = usar();
  const fotos = (dados.anexos || []).filter(a => a.veiculo_id === veiculoId);
  const podeMexer = pode(papel, 'editar');
  return html`
    <div style="display:flex;flex-direction:column;gap:11px">
      ${fotos.length === 0 && !podeMexer
        ? html`<p class="silencioso">Nenhuma foto registrada para este veículo.</p>` : null}
      <${Miniaturas} itens=${fotos}
        aoRemover=${podeMexer ? (a) => { acoes.removerAnexo(a.id); avisar('Foto removida.'); } : null} />
      ${podeMexer ? html`
        <${EntradaDeMidia} compacta=${compacta}
          aoReceber=${(f) => { acoes.anexar({ veiculo_id: veiculoId, tipo:'veiculo', ...f });
            avisar('Foto adicionada ao veículo.'); }} />` : null}
    </div>`;
}

/* ══ 10.2 LINK INDEPENDENTE ════════════════════════════════════════════════
   O pacote do cliente vai compactado dentro do próprio endereço. Sem banco,
   sem servidor, sem nada para publicar além do arquivo.

   Limite honesto: as fotos NÃO entram. Cada uma vira uma data URL de algumas
   centenas de KB e o endereço estouraria em qualquer aplicativo de mensagem.
   Texto, valores, etapas e garantia cabem em torno de 1 KB depois de
   compactar. E, por ser uma foto do momento, o link não acompanha o carro:
   quando a etapa mudar, é preciso gerar outro.                            */

const paraBase64Url = (bytes) => {
  let bruto = '';
  for (let i = 0; i < bytes.length; i++) bruto += String.fromCharCode(bytes[i]);
  return btoa(bruto).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const deBase64Url = (texto) => {
  const base = texto.replace(/-/g, '+').replace(/_/g, '/');
  const bruto = atob(base + '='.repeat((4 - base.length % 4) % 4));
  const bytes = new Uint8Array(bruto.length);
  for (let i = 0; i < bruto.length; i++) bytes[i] = bruto.charCodeAt(i);
  return bytes;
};

/* CompressionStream existe nos navegadores atuais; onde não existir, o pacote
   vai sem compactação e o endereço só fica mais comprido. */
async function empacotar(objeto) {
  const bytes = new TextEncoder().encode(JSON.stringify(objeto));
  if (typeof CompressionStream === 'undefined') return '0' + paraBase64Url(bytes);
  const fluxo = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));
  return '1' + paraBase64Url(new Uint8Array(await new Response(fluxo).arrayBuffer()));
}
/* AUDITORIA (fase 12): antes isto lia o fluxo inteiro de uma vez. Um endereço
   de poucos kilobytes com deflate pode virar centenas de megabytes ao abrir —
   é a bomba de descompressão clássica, e derrubaria a aba do cliente com um
   link inocente. Agora a leitura é por pedaço e para no teto. */
async function lerAteOTeto(fluxo, teto) {
  const leitor = fluxo.getReader();
  const partes = [];
  let total = 0;
  while (true) {
    const { done, value } = await leitor.read();
    if (done) break;
    total += value.length;
    if (total > teto) { leitor.cancel(); throw new Error('Pacote acima do tamanho aceito.'); }
    partes.push(value);
  }
  const saida = new Uint8Array(total);
  let i = 0;
  partes.forEach(p => { saida.set(p, i); i += p.length; });
  return saida;
}

const TETO_ENDERECO = 300 * 1024;        // texto que cabe no endereço
const TETO_PACOTE = 2 * 1024 * 1024;     // depois de descompactar

async function desempacotar(carga) {
  if (typeof carga !== 'string' || carga.length < 2 || carga.length > TETO_ENDERECO)
    throw new Error('Pacote fora do tamanho aceito.');
  const bytes = deBase64Url(carga.slice(1));
  const cru = carga[0] !== '1' ? bytes
    : await lerAteOTeto(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw')), TETO_PACOTE);
  return higienizar(JSON.parse(new TextDecoder().decode(cru)));
}

/** O pacote do portal sem as fotos e sem os campos que só o sistema usa. */
function pacoteEnxuto(pacote, oficina) {
  /* O token fica fora: quem recebesse o link empacotado extrairia dele o
     endereço ao vivo, que não vence e mostra a ordem para sempre. */
  const { fotos, token, ...resto } = pacote;
  return { ...resto, fotos: [], geradoEm: new Date().toISOString(),
    oficina: { nome: oficina.nome, telefone: oficina.telefone, endereco: oficina.endereco } };
}

async function montarLinkIndependente(pacote, oficina) {
  return baseDoEndereco() + '#/v/' + await empacotar(pacoteEnxuto(pacote, oficina));
}

/* ══ 10.3 LEITURA DAS DUAS ROTAS ═══════════════════════════════════════════ */
/* A rota é lida uma só vez, na carga. Sem isto, colar o link na mesma aba
   não muda nada e parece que o link está quebrado. */
if (typeof window !== 'undefined') window.addEventListener('hashchange', () => location.reload());

function lerRota() {
  try {
    const h = String(location.hash || '');
    /* Tudo que chega pelo endereço tem teto. Sem isto, um endereço de dezenas
       de megabytes já custa caro antes mesmo de ser interpretado. */
    if (h.length > 320000) return null;
    const viva = h.match(/^#\/os\/(\d{1,9})\/([a-z0-9]{8,64})$/i);
    if (viva) return { tipo: 'viva', numero: Number(viva[1]), token: viva[2].toLowerCase() };
    const foto = h.match(/^#\/v\/([A-Za-z0-9\-_]{1,300000})$/);
    if (foto) return { tipo: 'foto', carga: foto[1] };
    return null;
  } catch (e) { return null; }
}

/** Vista do cliente quando o link carrega o próprio pacote. Não toca em
    `dados`: o que aparece na tela veio inteiro pelo endereço. */
function VistaEmpacotada({ carga }) {
  const [estado, setEstado] = useState({ carregando: true });
  useEffect(() => {
    let vivo = true;
    desempacotar(carga)
      .then(p => { if (vivo) setEstado({ pacote: p }); })
      .catch(() => { if (vivo) setEstado({ erro: true }); });
    return () => { vivo = false; };
  }, [carga]);

  const of = estado.pacote?.oficina;
  const cabecalho = html`
    <header class="publico-topo">
      <span style="width:34px;height:34px;border-radius:10px;background:var(--azul-acao);display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <${Icone} nome="chave" tam=${18} cor="#fff" /></span>
      <div style="min-width:0">
        <div class="nome corta">${of?.nome || 'Ordem de serviço'}</div>
        ${of?.telefone ? html`<div class="silencioso corta">${fmtTel(of.telefone)}</div>` : null}
      </div>
    </header>`;

  if (estado.carregando) return html`
    <div class="publico">${cabecalho}
      <main class="publico-corpo"><${Cartao}><div class="esqueleto" style="height:220px"></div><//></main>
    </div>`;

  if (estado.erro || !estado.pacote) return html`
    <div class="publico">${cabecalho}
      <div class="publico-aviso">
        <${Vazio} icone="alerta" titulo="Este link não pôde ser aberto"
          apoio="O endereço provavelmente foi copiado pela metade — links longos quebram em alguns aplicativos de mensagem. Peça à oficina que envie de novo." />
      </div>
    </div>`;

  return html`
    <div class="publico">
      ${cabecalho}
      <main class="publico-corpo"><${PreviaPortal} pacote=${estado.pacote} /></main>
      <footer class="publico-rodape">
        Esta página mostra apenas a sua ordem de serviço, na situação de
        ${fmtData(estado.pacote.geradoEm)}. Para saber o andamento depois disso, fale com a oficina.<br />
        ${of?.endereco || ''}
      </footer>
    </div>`;
}

/** Bloco de compartilhamento, usado na tela do Portal. */
function CompartilharOrdem({ os, pacote }) {
  const { dados, avisar } = usar();
  const [link, setLink] = useState(null);
  const [montando, setMontando] = useState(false);

  const gerar = async () => {
    setMontando(true);
    try {
      const url = await montarLinkIndependente(pacote, dados.oficina);
      setLink(url);
      const kb = Math.round(url.length / 1024 * 10) / 10;
      await copiarE(url, avisar, 'Link independente copiado · ' + kb + ' KB',
        'Link montado (' + kb + ' KB), mas não deu para copiar. Ele está logo abaixo.');
    } catch (e) {
      avisar('Não foi possível montar o link.');
    } finally { setMontando(false); }
  };

  const linkVivo = enderecoPublico(os);
  const copiarVivo = () => copiarE(linkVivo, avisar, 'Link ao vivo copiado.');

  return html`
    <${Cartao}>
      <div class="cartao-topo"><div>
        <h3>Enviar para o cliente</h3>
        <p class="silencioso">Dois endereços, com alcances diferentes</p>
      </div></div>

      <div style="display:flex;flex-direction:column;gap:16px">
        <div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <${Icone} nome="link" tam=${15} cor="var(--azul-acao)" />
            <b style="font-size:13.5px">Link independente</b>
            <${Selo} tom="ok">Funciona hoje<//>
          </div>
          <p class="silencioso" style="line-height:1.55;margin-bottom:9px">
            O orçamento inteiro viaja dentro do próprio endereço. Abre em qualquer celular,
            sem banco e sem servidor. É uma foto do momento: quando a etapa mudar, gere outro.
            As fotos do serviço não vão junto — cada uma deixaria o link grande demais para o WhatsApp.
          </p>
          <button class="btn btn-primario btn-p" disabled=${montando} onClick=${gerar}>
            <${Icone} nome="copiar" tam=${15} />${montando ? 'Montando…' : 'Gerar e copiar link'}</button>
          ${link ? html`
            <div class="link-cliente" style="margin-top:10px">
              <span class="endereco">${link}</span>
              <${Selo}>${Math.round(link.length / 1024 * 10) / 10} KB<//>
            </div>` : null}
        </div>

        <div style="border-top:1px solid var(--linha-suave);padding-top:14px">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <${Icone} nome="elo" tam=${15} cor="var(--tinta-3)" />
            <b style="font-size:13.5px">Link ao vivo</b>
            <${Selo} tom="alerta">Precisa de banco<//>
          </div>
          <p class="silencioso" style="line-height:1.55;margin-bottom:9px">
            Sempre mostra a situação atual, com as fotos. Só funciona quando os dados vêm de um
            banco compartilhado — hoje cada navegador monta a própria base de demonstração.
          </p>
          <button class="btn btn-neutro btn-p" onClick=${copiarVivo}>
            <${Icone} nome="copiar" tam=${15} />Copiar link ao vivo</button>
          <div class="link-cliente" style="margin-top:10px">
            <span class="endereco">${linkVivo}</span>
          </div>
        </div>
      </div>
    <//>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   FASE 9 — ÁREAS NO MENU E COFRE DE VALORES
   Aditiva como as anteriores. Duas ideias:

   1. O trilho chegou a vinte e três itens abertos ao mesmo tempo, e um menu
      que mostra tudo não mostra nada. Passa a exibir cinco áreas com o nome
      e o que cada uma resolve; o conteúdo abre no clique ou aparece ao lado
      quando o mouse encosta. Ninguém precisa mais varrer a lista inteira
      para achar Garantias.

   2. O dinheiro estava espalhado por dezoito telas, à vista de quem estivesse
      encostado no balcão. Agora tem endereço: a área financeira, atrás do
      cadeado no topo. Fora dela o valor aparece como R$ ••••, e a tela que
      só existe para mostrar número (relatório, rentabilidade, caixa) pede a
      chave na porta em vez de exibir um relatório inteiro mascarado.
   ══════════════════════════════════════════════════════════════════════════ */

Object.assign(TRACOS, {
  cadeado:          'M6 10h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1M8 10V7a4 4 0 0 1 8 0v3M12 15v2',
  'cadeado-aberto': 'M6 10h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1M8 10V7a4 4 0 0 1 7.7-1.4M12 15v2',
  'seta-dir':       'M9 5l7 7-7 7',
  /* CORREÇÃO · não havia ícone de informação no conjunto, então todo recado
     informativo pedia emprestado o `alerta` — o triângulo de exclamação. Com
     a cor da marca em cima, virava alarme. Círculo com "i" resolve. */
  informacao:       'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M12 11v5M12 7.6v.1',
});

/* Telas que existem só para mostrar valor. */
const ROTAS_COFRE = ['cofre', 'financeiro', 'rentabilidade', 'analitico', 'relatorios', 'central'];

/* O nome da área não basta: quem chega precisa saber o que tem dentro antes
   de abrir. A frase curta é a diferença entre um título e uma placa. */
const AREAS = {
  'Operação':     { icone: 'radar',   resumo: 'O dia a dia do pátio' },
  'Cadastros':    { icone: 'blocos',  resumo: 'Clientes, carros e peças' },
  'Financeiro':   { icone: 'cadeado', resumo: 'Caixa, contas e resultado' },
  'Gestão':       { icone: 'grafico', resumo: 'Relatórios e regras' },
  'Inteligência': { icone: 'robo',    resumo: 'Copiloto e portal' },
};

/** Agrupa o NAV plano nas áreas, respeitando os módulos desligados. */
const areasDoMenu = (dados) => {
  const areas = [];
  NAV.filter(n => !n.quando || n.quando(dados)).forEach(n => {
    if (n.grupo) areas.push({ nome: n.grupo, itens: [], ...(AREAS[n.grupo] || { icone: 'blocos', resumo: '' }) });
    else if (areas.length) areas[areas.length - 1].itens.push(n);
  });
  return areas.filter(a => a.itens.length);
};

/* Os selos que antes moravam soltos no JSX do trilho. Agora a área também
   sabe somar os próprios pendentes, que é o que aparece quando ela está
   fechada. */
const contagemNav = (id, d, m, achados) => {
  switch (id) {
    case 'patio':      return { n: m.ativas.length, urgente: false };
    case 'ordens':     return { n: m.aguardandoAprovacao.length, urgente: false };
    case 'estoque':    return { n: m.estoqueBaixo.length, urgente: true };
    case 'preventiva': return { n: m.preventiva.filter(v => v.vencidos.length).length, urgente: false };
    case 'garantias':  return { n: m.garantiasVigentes.filter(g => g.dias <= 15).length, urgente: false };
    case 'automacoes': return { n: d.tarefas.filter(t => !t.feita).length, urgente: false };
    case 'agenda':     return { n: agendaDoDia(d, chaveDia(new Date())).filter(a => a.situacao === 'marcado').length, urgente: false };
    case 'alertas':    return { n: (achados || []).filter(a => a.gravidade === 'critico').length, urgente: true };
    case 'financeiro': return { n: d.lancamentos.filter(l => l.tipo === 'receber' && l.status === 'aberto'
                                  && venceu(l.vencimento)).length, urgente: true };
    default:           return { n: 0, urgente: false };
  }
};
const contagemArea = (area, d, m, achados) => area.itens.reduce((soma, n) => {
  const c = contagemNav(n.id, d, m, achados);
  return { n: soma.n + c.n, urgente: soma.urgente || (c.urgente && c.n > 0) };
}, { n: 0, urgente: false });

/* ── 9.1 O TRILHO ───────────────────────────────────────────────────────── */
function TrilhoNav({ vista, irPara, ehMobile }) {
  const { dados, metricas, achados } = usar();
  const areas = useMemo(() => areasDoMenu(dados), [dados]);
  const areaDe = (v) => areas.find(a => a.itens.some(i => i.id === v))?.nome || null;
  const [aberta, setAberta] = useState(() => areaDe(vista) || areas[0]?.nome || null);
  const [voo, setVoo] = useState(null);
  const relogio = useRef(null);

  /* Chegar pelo atalho, pela busca ou por um cartão do painel também abre a
     área certa — senão o menu contaria uma história diferente da tela. */
  useEffect(() => { const a = areaDe(vista); if (a) setAberta(a); }, [vista]);
  useEffect(() => () => clearTimeout(relogio.current), []);

  const espiar = (nome, elemento) => {
    if (ehMobile || !elemento) return;
    clearTimeout(relogio.current);
    const r = elemento.getBoundingClientRect();
    setVoo({ nome, topo: Math.max(8, Math.min(r.top - 6, window.innerHeight - 320)), esquerda: r.right + 8 });
  };
  /* Sair do cabeçalho e entrar no painel passa por um vão de alguns pixels:
     sem essa carência de meio segundo o painel fecharia no caminho. */
  const largar = () => { clearTimeout(relogio.current); relogio.current = setTimeout(() => setVoo(null), 180); };
  const segurar = () => clearTimeout(relogio.current);

  const linha = (n, ondeVive) => {
    const c = contagemNav(n.id, dados, metricas, achados);
    return html`
      <button key=${ondeVive + n.id} class="trilho-item" aria-current=${vista === n.id ? 'page' : undefined}
        onClick=${() => { irPara(n.id); setVoo(null); }}>
        <${Icone} nome=${n.icone} tam=${16} />
        <span class="corta" style="flex:1">${n.nome}</span>
        ${c.n > 0 ? html`<span class=${'selo-num' + (c.urgente ? ' urgente' : '')}>${c.n}</span>` : null}
        ${n.breve ? html`<span class="selo-breve">em breve</span>` : null}
        ${n.cofre && !c.n ? html`<span class="cadeado-item"><${Icone} nome="cadeado" tam=${12} /></span>` : null}
      </button>`;
  };

  const areaVoando = voo ? areas.find(a => a.nome === voo.nome) : null;

  return html`
    <nav class="trilho-nav areas" aria-label="Áreas do sistema">
      ${areas.map(a => {
        const c = contagemArea(a, dados, metricas, achados);
        const expandida = aberta === a.nome;
        const temAtual = a.itens.some(i => i.id === vista);
        return html`
          <div key=${a.nome} class=${'trilho-area' + (temAtual ? ' tem-atual' : '')} onMouseLeave=${largar}>
            <button class="trilho-cabeca" aria-expanded=${expandida ? 'true' : 'false'}
              onClick=${() => { setVoo(null); setAberta(x => x === a.nome ? null : a.nome); }}
              onMouseEnter=${(e) => { if (expandida) largar(); else espiar(a.nome, e.currentTarget); }}
              onFocus=${(e) => { if (!expandida) espiar(a.nome, e.currentTarget); }}>
              <span class="marca-area"><${Icone} nome=${a.icone} tam=${15} /></span>
              <span class="nome-area">${a.nome}<small>${a.resumo}</small></span>
              ${c.n > 0 ? html`<span class=${'conta' + (c.urgente ? ' urgente' : '')}>${c.n}</span>` : null}
              <span class="giro"><${Icone} nome="seta-dir" tam=${14} /></span>
            </button>
            ${expandida ? html`<div class="trilho-lista">${a.itens.map(n => linha(n, 'i'))}</div>` : null}
          </div>`;
      })}

      ${areaVoando ? html`
        <div class="trilho-voo" style=${'top:' + voo.topo + 'px;left:' + voo.esquerda + 'px'}
          onMouseEnter=${segurar} onMouseLeave=${largar}>
          <div class="titulo-voo"><b>${areaVoando.nome}</b>
            <div class="silencioso">${areaVoando.resumo}</div></div>
          ${areaVoando.itens.map(n => linha(n, 'v'))}
        </div>` : null}
    </nav>`;
}

/* ── 9.2 O CADEADO DO TOPO ──────────────────────────────────────────────── */
function BotaoCofre() {
  const { cofre } = usar();
  if (!cofre.permitido) return html`
    <span class="cofre-pill sem-acesso" title=${'O perfil de ' + cofre.papelNome + ' não enxerga valores'}>
      <${Icone} nome="cadeado" tam=${15} /><span class="esconde-mobile">Valores travados</span></span>`;

  return html`
    <div style="display:flex;align-items:center;gap:6px">
      <button class=${'cofre-pill' + (cofre.aberto ? ' aberto' : '')} onClick=${cofre.abrir}
        aria-label=${cofre.aberto ? 'Ir para a área financeira' : 'Abrir a área financeira e mostrar os valores'}>
        <${Icone} nome=${cofre.aberto ? 'cadeado-aberto' : 'cadeado'} tam=${15} />
        <span class="esconde-mobile">${cofre.aberto ? 'Valores à mostra' : 'Área financeira'}</span>
      </button>
      ${cofre.aberto ? html`
        <button class="cofre-travar esconde-mobile" onClick=${cofre.travar} aria-label="Travar o cofre e esconder os valores">
          <${Icone} nome="cadeado" tam=${15} /></button>` : null}
    </div>`;
}

/** A porta da área financeira. Aparece no lugar da tela inteira. */
function CofrePortao({ vista }) {
  const { cofre } = usar();
  const nome = NAV.find(n => n.id === vista)?.nome || 'Esta tela';
  return html`
    <${Cartao} classe="entra">
      <div class="cofre-portao">
        <span class="anel"><${Icone} nome="cadeado" tam=${30} /></span>
        <div>
          <h2>${nome} fica na área financeira</h2>
          <p class="silencioso" style="margin-top:7px;line-height:1.6">
            Faturamento, custo, margem e contas ficam guardados em um lugar só. Assim o
            sistema pode ficar aberto no balcão sem mostrar o resultado da oficina para
            quem está do outro lado do vidro.</p>
        </div>
        ${cofre.permitido
          ? html`<button class="btn btn-primario" onClick=${cofre.abrir}>
              <${Icone} nome="cadeado-aberto" tam=${15} />Abrir a área financeira</button>`
          : html`<div class="aviso aviso-info"><${Icone} nome="alerta" tam=${16} />
              <span>O perfil de ${cofre.papelNome} não abre valores. Fale com o gerente.</span></div>`}
      </div>
    <//>`;
}

/* ── 9.3 A ÁREA FINANCEIRA ──────────────────────────────────────────────── */
function TelaCofre() {
  const { dados, metricas, papel, irPara, cofre } = usar();
  const m = metricas;
  const acesso = PAPEIS[papel].financeiro;
  const podeCusto = PAPEIS[papel].custo;
  const gestor = PAPEIS[papel].gestao;

  if (!acesso) return html`<${Cartao}><${Vazio} icone="carteira" titulo="Área financeira restrita"
    apoio=${'O perfil de ' + PAPEIS[papel].nome.toLowerCase() + ' não enxerga valores. Fale com o gerente se precisar de algo daqui.'} /><//>`;

  const emAberto = (tipo) => dados.lancamentos.filter(l => l.tipo === tipo && l.status === 'aberto');
  const receber = emAberto('receber'), pagar = emAberto('pagar');
  const vencidos = receber.filter(l => venceu(l.vencimento));
  const vencendo = pagar.filter(l => !venceu(l.vencimento) && diasAte(l.vencimento) <= 5);
  const soma = (a) => a.reduce((s, l) => s + l.valor, 0);
  const dia = m.caixa.dia;
  const dif = m.mediaAnterior > 0 ? ((m.mesAtual.receita - m.mediaAnterior) / m.mediaAnterior) * 100 : null;
  const margem = m.mesAtual.receita > 0 ? (m.lucroMes / m.mesAtual.receita) * 100 : 0;
  const meses = m.meses.slice(-6).map(x => ({ ...x, lucro: x.receita - x.custo }));
  const naoPago = m.aguardandoPagamento.reduce((s, x) => s + x.lancamento.valor, 0);

  const ATALHOS = [
    { id:'financeiro',    icone:'carteira',  nome:'Contas e caixa',        apoio:'Receber, pagar e dar baixa' },
    { id:'rentabilidade', icone:'lucro',     nome:'Rentabilidade',         apoio:'Lucro por serviço e por mecânico', exige:'custo' },
    { id:'analitico',     icone:'grafico',   nome:'Painel analítico',      apoio:'Gráficos, mix e fila do pátio' },
    { id:'relatorios',    icone:'prancheta', nome:'Relatórios',            apoio:'Financeiro, clientes e estoque',   exige:'gestao' },
    { id:'central',       icone:'exportar',  nome:'Central de relatórios', apoio:'Exportar para o contador',         exige:'gestao' },
  ].filter(a => a.exige === 'custo' ? podeCusto : a.exige === 'gestao' ? gestor : true);

  return html`
    <div class="entra" style="display:flex;flex-direction:column;gap:16px">

      <div class="cofre-estado">
        <${Icone} nome="cadeado-aberto" tam=${17} />
        <span style="flex:1;min-width:210px">Cofre aberto. Enquanto estiver assim, os valores voltam
          a aparecer nas outras telas também.</span>
        <span style="display:flex;align-items:center;gap:8px">
          <${Interruptor} ligado=${cofre.sigilo} aoTrocar=${cofre.alternarSigilo}
            rotulo="Esconder valores fora da área financeira" />
          <span class="silencioso">Esconder fora daqui</span>
        </span>
        <button class="btn btn-neutro btn-p" onClick=${cofre.travar}>
          <${Icone} nome="cadeado" tam=${13} />Travar agora</button>
      </div>

      ${/* O que o dono pergunta primeiro, agora em um lugar só. */ ''}
      <div class="kpi-grade">
        <${KPI} icone="moeda" tom=${dia.saldo >= 0 ? 'ok' : ''} rotulo="Caixa de hoje" valor=${brlCurto(dia.saldo)}
          apoio=${'Entrou ' + brlCurto(dia.entradas) + ' · saiu ' + brlCurto(dia.saidas)}
          aoClicar=${() => irPara('financeiro')} ir="Ver movimento" />
        <${KPI} icone="carteira" tom=${vencidos.length ? 'alerta' : ''} rotulo="A receber em aberto"
          valor=${brlCurto(soma(receber))}
          apoio=${vencidos.length
            ? vencidos.length + ' vencido(s) · ' + brlCurto(soma(vencidos))
            : receber.length + ' título(s), nenhum atrasado'}
          aoClicar=${() => irPara('financeiro')} ir="Ver contas" />
        ${acesso === 'parcial' ? null : html`
          <${KPI} icone="caixa" rotulo="A pagar em aberto" valor=${brlCurto(soma(pagar))}
            apoio=${vencendo.length ? vencendo.length + ' vence(m) em até cinco dias' : pagar.length + ' título(s) em aberto'}
            aoClicar=${() => irPara('financeiro')} ir="Ver contas" />`}
        <${KPI} icone="grafico" rotulo="Faturamento do mês" valor=${brlCurto(m.mesAtual.receita)} variacao=${dif}
          apoio=${'Média dos meses anteriores: ' + brlCurto(m.mediaAnterior)}
          aoClicar=${() => irPara('analitico')} ir="Ver análise" />
      </div>

      <div class="grade g-3">
        ${podeCusto ? html`
          <${KPI} icone="lucro" tom="ok" rotulo="Lucro do mês" valor=${brlCurto(m.lucroMes)}
            apoio=${'Margem de ' + pct(margem) + ' no mês corrente'}
            aoClicar=${() => irPara('rentabilidade')} ir="Ver rentabilidade" />` : null}
        <${KPI} icone="alvo" tom="ciano" rotulo="Ticket médio" valor=${brlCurto(m.ticket)}
          apoio=${m.concluidas.length + ' ordens concluídas no histórico'} />
        <${KPI} icone="prancheta" tom="roxo" rotulo="Em aberto no pátio" valor=${brlCurto(m.emAberto)}
          apoio=${m.ativas.length + ' ordens que ainda não viraram caixa'}
          aoClicar=${() => irPara('ordens')} ir="Ver ordens" />
      </div>

      <div class="grade g-2-1">
        <${Cartao}>
          <div class="cartao-topo"><div>
            <h3>Receita e lucro por mês</h3>
            <p class="silencioso">Últimos seis meses fechados pelas ordens concluídas</p>
          </div></div>
          <${GraficoColunas} dados=${meses} chaves=${podeCusto ? ['receita', 'lucro'] : ['receita']}
            rotulos=${podeCusto ? ['Receita', 'Lucro'] : ['Receita']} />
        <//>

        <${Cartao}>
          <div class="cartao-topo"><div>
            <h3>Para onde vai o faturamento</h3>
            <p class="silencioso">Mês corrente</p>
          </div></div>
          ${podeCusto
            ? html`<${Proporcao} partes=${[
                { nome:'Custo', valor: m.mesAtual.custo, cor:'var(--alerta)' },
                { nome:'Lucro', valor: m.lucroMes,       cor:'var(--ok)' }]} />`
            : html`<p class="silencioso">O perfil de ${PAPEIS[papel].nome.toLowerCase()} não enxerga custo nem margem.</p>`}
          <div style="margin-top:15px;display:flex;flex-direction:column;gap:9px">
            <${ChaveValor} chave="Faturado no mês" valor=${brl(m.mesAtual.receita)} forte />
            <${ChaveValor} chave="Projeção do mês" valor=${m.projecaoMes ? brl(m.projecaoMes) : '—'} />
            <${ChaveValor} chave="Entregue e ainda não pago" valor=${brl(naoPago)} />
          </div>
        <//>
      </div>

      <${PainelResultado} />

      <div>
        <div class="rotulo" style="margin-bottom:10px">O resto do dinheiro está aqui</div>
        <div class="atalhos-cofre">
          ${ATALHOS.map(a => html`
            <button key=${a.id} class="atalho-cofre" onClick=${() => irPara(a.id)}>
              <span class="marca"><${Icone} nome=${a.icone} tam=${16} /></span>
              <span style="min-width:0">
                <b style="display:block;font-size:13.5px">${a.nome}</b>
                <span class="silencioso">${a.apoio}</span>
              </span>
            </button>`)}
        </div>
      </div>
    </div>`;
}

/* ── 9.4 REGISTRO ───────────────────────────────────────────────────────── */
Object.assign(TELAS_EXTRA,   { cofre: () => html`<${TelaCofre} />` });
Object.assign(TITULOS_EXTRA, { cofre: () => ['Área financeira', 'Caixa, contas, resultado e margem em um lugar só'] });

/* O menu ganha a área Financeiro, que recebe as telas de dinheiro que estavam
   soltas em Gestão. Nada é reescrito: os itens são movidos inteiros. */
(() => {
  const tirar = (id) => { const i = NAV.findIndex(n => n.id === id); return i >= 0 ? NAV.splice(i, 1)[0] : null; };
  const mudados = ['financeiro', 'rentabilidade'].map(tirar).filter(Boolean);
  const ondeEraGestao = NAV.findIndex(n => n.grupo === 'Gestão');
  NAV.splice(ondeEraGestao < 0 ? NAV.length : ondeEraGestao, 0,
    { grupo: 'Financeiro' },
    { id: 'cofre', nome: 'Visão geral', icone: 'cadeado' },
    ...mudados,
    /* O painel analítico existia sem porta no menu: só se chegava nele
       clicando num cartão do painel. Agora tem endereço. */
    { id: 'analitico', nome: 'Painel analítico', icone: 'grafico' });

  NAV.forEach(n => { if (ROTAS_COFRE.includes(n.id)) n.cofre = true; });
  /* Agenda ainda não tem tela. Continua visível como roteiro, mas avisando. */
  const agenda = NAV.find(n => n.id === 'agenda');
  if (agenda) agenda.breve = true;
})();

/* ══════════════════════════════════════════════════════════════════════════
   FASE 10 — COPILOTO DA OFICINA
   Camada nova, encaixada por fora. Nada do que existia foi reescrito: as
   respostas numéricas continuam saindo de `responder()`, toda gravação
   continua passando por `acoes` — e portanto pela auditoria —, e o cofre da
   fase 9 continua mandando no que pode aparecer na tela.

   Três camadas, como um funcionário de verdade:
     cabeça   → entende o pedido e decide o que fazer com ele
     memória  → lembra da conversa, de quem pergunta e da própria oficina
     mãos     → as ferramentas que mexem no sistema, sempre com confirmação

   O que ele não faz, de propósito: afirmar defeito, inventar número e gravar
   sem perguntar. Um funcionário que chuta é pior do que nenhum.
   ══════════════════════════════════════════════════════════════════════════ */

Object.assign(TRACOS, { minimizar: 'M6 12h12' });

/* ── 10.1 MEMÓRIA ─────────────────────────────────────────────────────────
   Vive no módulo, não no componente: fechar o painel não pode apagar a
   conversa. Não entra em `dados` de propósito — memória de assistente não é
   dado da oficina e não deveria viajar dentro do backup. Quando o Supabase
   entrar, esta é a gaveta que passa a ser gravada por usuário.            */
const MEMORIA = {
  conversa: [],
  usuario: { preferencias: [], assuntos: {} },
  acoes: [],
  investigacao: null,
  config: { urlModelo: '', respostaCurta: false },
  vez: 0,
};
/* Repetir a mesma frase três vezes seguidas é o que denuncia um robô. */
const girar = (lista) => lista[MEMORIA.vez++ % lista.length];
const anotarAssunto = (id) => { MEMORIA.usuario.assuntos[id] = (MEMORIA.usuario.assuntos[id] || 0) + 1; };
const anotarAcao = (texto) => {
  MEMORIA.acoes.unshift({ texto, quando: new Date().toISOString() });
  MEMORIA.acoes = MEMORIA.acoes.slice(0, 30);
};

/** O que a oficina ensinou, lido da própria base — não é opinião, é contagem. */
const memoriaDaOficina = (d, m) => {
  const servicos = Object.entries(m.padroes.geral || {}).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const pecas = [...d.pecas].sort((a, b) => (b.preco_venda * b.quantidade) - (a.preco_venda * a.quantidade)).slice(0, 5);
  return { servicos, pecas, totalOrdens: m.concluidas.length, ticket: m.ticket };
};

/* ── 10.2 CONVERSA ────────────────────────────────────────────────────────
   Um colega responde "bom dia" antes de responder relatório.             */
const horaDoDia = () => { const h = new Date().getHours(); return h < 12 ? 'Bom dia' : h < 18 ? 'Boa tarde' : 'Boa noite'; };

const CONVERSA = [
  { id: 'saudacao', chaves: ['bom dia', 'boa tarde', 'boa noite', 'ola', 'oi', 'opa', 'e ai', 'eai', 'fala', 'salve'],
    responder: (ctx) => ({ resumo: girar([
      horaDoDia() + '! ' + (ctx.m.ativas.length ? 'Tem ' + ctx.m.ativas.length + ' carro(s) no pátio agora. Como está o movimento?' : 'Pátio vazio por aqui. Dia de colocar a papelada em dia?'),
      horaDoDia() + '! Tudo certo por aí? Se quiser, começo pelo resumo do dia.',
      horaDoDia() + ', ' + ctx.primeiroNome + '. Por onde a gente começa?',
    ]), sugestoes: ['Resumo do dia', 'O que precisa de decisão hoje?'] }) },

  { id: 'agradece', chaves: ['valeu', 'obrigad', 'vlw', 'brigado', 'agradec', 'show', 'perfeito', 'isso mesmo', 'top', 'boa'],
    responder: () => ({ resumo: girar([
      'Disponha! Precisando, estou por aqui.',
      'Por nada. Qualquer coisa é só chamar.',
      'Tranquilo. Vou ficando por aqui se aparecer mais alguma.',
    ]) }) },

  { id: 'riso', chaves: ['kkk', 'haha', 'rsrs', 'hehe', 'kk'],
    responder: () => ({ resumo: girar([
      'Tem carro que gosta de testar a paciência da gente mesmo.',
      'Essa eu já vi acontecer por aqui.',
      'Rindo para não chorar, né? Vamos ao próximo.',
    ]) }) },

  { id: 'tudobem', chaves: ['tudo bem', 'tudo bom', 'como voce esta', 'como vai voce', 'beleza'],
    responder: (ctx) => ({ resumo: girar([
      'Por aqui tudo certo — acabei de olhar a base e ' + (ctx.criticos ? 'tem ' + ctx.criticos + ' ponto(s) pedindo decisão.' : 'não tem nada crítico em aberto.'),
      'Tudo em ordem. E aí, dia corrido?',
    ]) }) },

  { id: 'quemsou', chaves: ['quem e voce', 'quem es voce', 'o que voce faz', 'voce e um robo', 'voce e humano', 'como voce funciona', 'o que voce sabe'],
    responder: () => ({ resumo: 'Sou o copiloto daqui da oficina. Leio os dados desta base, consulto cliente, veículo, estoque e financeiro, ajudo a investigar um defeito por eliminação e executo tarefas no sistema — sempre pedindo confirmação antes de gravar. O que eu não faço é afirmar defeito nem inventar número: quando não sei, eu digo que não sei.',
      sugestoes: ['O que você consegue fazer?', 'Meu carro está falhando', 'Resumo do dia'] }) },

  { id: 'capacidades', chaves: ['o que voce consegue', 'me ajuda com o que', 'quais comandos', 'ajuda', 'me ajude'],
    responder: () => ({ resumo: 'Posso fazer isto aqui:',
      passos: [
        'Consultar: "quem é o dono da placa ABC1D23", "tem pastilha do Onix?", "histórico desse carro"',
        'Executar: "cadastre o cliente João Silva 11988887777", "adicione óleo 5W30 na OS 2836", "me lembra de ligar para a Marina"',
        'Investigar defeito: "o carro está falhando", "não liga", "esquentando"',
        'Ler a oficina: "resumo do dia", "quanto tenho a receber", "quais peças estão acabando"',
      ], sugestoes: ['Resumo do dia', 'Quais peças estão acabando?'] }) },

  { id: 'tchau', chaves: ['tchau', 'falou', 'ate mais', 'ate logo', 'fui', 'valeu por hoje'],
    responder: () => ({ resumo: girar(['Até! Deixo a conversa salva aqui.', 'Falou. Se precisar, é só abrir de novo — não perco o fio.']) }) },
];

/* ── 10.3 INVESTIGAÇÃO DE DEFEITO ─────────────────────────────────────────
   Um mecânico experiente não chuta a peça: ele elimina possibilidades. O
   copiloto faz uma pergunta por vez, vai pesando as hipóteses e no fim
   entrega uma ordem de verificação — nunca um diagnóstico fechado.       */
const SINTOMAS = [
  {
    id: 'falha', nome: 'Motor falhando ou perdendo força',
    chaves: ['falhando', 'falha', 'engasga', 'engasgando', 'perde forca', 'perdendo forca', 'morre em movimento', 'tremendo', 'trepidando', 'sem forca'],
    perguntas: [
      { texto: 'A falha aparece mais quando?', opcoes: [
        { rotulo: 'Com o motor frio', pesos: { ignicao: 2, sensores: 1 } },
        { rotulo: 'Ao acelerar', pesos: { combustivel: 2, ignicao: 1 } },
        { rotulo: 'O tempo todo', pesos: { sensores: 2, admissao: 1 } } ] },
      { texto: 'A luz da injeção está acesa no painel?', opcoes: [
        { rotulo: 'Acesa', pesos: { sensores: 2, ignicao: 1 } },
        { rotulo: 'Piscando', pesos: { ignicao: 3 } },
        { rotulo: 'Apagada', pesos: { combustivel: 1, admissao: 2 } } ] },
      { texto: 'Faz quanto tempo que trocaram velas e filtros?', opcoes: [
        { rotulo: 'Menos de um ano', pesos: { combustivel: 1, sensores: 1 } },
        { rotulo: 'Mais de um ano', pesos: { ignicao: 2, combustivel: 2 } },
        { rotulo: 'Não sei dizer', pesos: {} } ] },
    ],
    hipoteses: [
      { id: 'ignicao', nome: 'Sistema de ignição', servico: 'vela',
        testes: ['Ler os códigos no scanner e olhar a falha por cilindro', 'Conferir velas: folga, cor do eletrodo e aperto', 'Medir resistência da bobina e testar cabos'] },
      { id: 'combustivel', nome: 'Alimentação de combustível', servico: 'filtro',
        testes: ['Medir pressão da linha com o manômetro', 'Verificar filtro de combustível e vazão da bomba', 'Avaliar o padrão de pulverização dos bicos'] },
      { id: 'sensores', nome: 'Sensores e leitura da injeção', servico: 'injecao',
        testes: ['Ler dados em tempo real: sonda lambda, MAF e TPS', 'Comparar a leitura com o valor esperado em marcha lenta', 'Checar chicote e mau contato nos conectores'] },
      { id: 'admissao', nome: 'Admissão e vazamento de ar', servico: 'limpeza',
        testes: ['Procurar entrada de ar falsa nas mangueiras', 'Limpar corpo de borboleta e checar a borboleta', 'Verificar filtro de ar saturado'] },
    ],
  },
  {
    id: 'naoliga', nome: 'Veículo não liga',
    chaves: ['nao liga', 'nao pega', 'nao da partida', 'nao arranca', 'nao esta ligando'],
    perguntas: [
      { texto: 'Quando você gira a chave, o motor chega a girar?', opcoes: [
        { rotulo: 'Gira mas não pega', pesos: { alimentacao: 3, imobilizador: 1 } },
        { rotulo: 'Só faz clique', pesos: { bateria: 2, partida: 3 } },
        { rotulo: 'Não faz nada', pesos: { bateria: 3, eletrica: 2 } } ] },
      { texto: 'As luzes do painel acendem normalmente?', opcoes: [
        { rotulo: 'Acendem fortes', pesos: { partida: 2, alimentacao: 2 } },
        { rotulo: 'Acendem fracas', pesos: { bateria: 3 } },
        { rotulo: 'Não acendem', pesos: { bateria: 2, eletrica: 3 } } ] },
    ],
    hipoteses: [
      { id: 'bateria', nome: 'Bateria e carga', servico: 'bateria',
        testes: ['Medir tensão em repouso e durante a partida', 'Testar carga e conferir bornes e massa', 'Medir tensão do alternador com o motor ligado'] },
      { id: 'partida', nome: 'Motor de partida', servico: 'partida',
        testes: ['Medir a tensão que chega no motor de partida', 'Testar o automático e a corrente de acionamento'] },
      { id: 'alimentacao', nome: 'Combustível e faísca', servico: 'bomba',
        testes: ['Ouvir a bomba escorvar ao ligar a chave', 'Medir pressão de combustível', 'Checar faísca em uma vela'] },
      { id: 'eletrica', nome: 'Elétrica geral', servico: 'eletrica',
        testes: ['Conferir fusíveis e relés da linha de partida', 'Verificar chave de ignição e cabos de massa'] },
      { id: 'imobilizador', nome: 'Imobilizador e chave', servico: 'chave',
        testes: ['Verificar se a luz do imobilizador apaga', 'Testar com a chave reserva'] },
    ],
  },
  {
    id: 'superaquece', nome: 'Motor esquentando',
    chaves: ['esquentando', 'superaquec', 'temperatura alta', 'fervendo', 'perdendo agua', 'ferveu'],
    perguntas: [
      { texto: 'O carro esquenta mais em qual situação?', opcoes: [
        { rotulo: 'Parado no trânsito', pesos: { ventoinha: 3, radiador: 1 } },
        { rotulo: 'Em movimento na estrada', pesos: { radiador: 2, bomba: 2 } },
        { rotulo: 'Nas duas', pesos: { valvula: 2, cabecote: 1 } } ] },
      { texto: 'Está faltando água no reservatório?', opcoes: [
        { rotulo: 'Some rápido', pesos: { cabecote: 3, radiador: 2 } },
        { rotulo: 'Some devagar', pesos: { radiador: 2 } },
        { rotulo: 'Nível estável', pesos: { valvula: 2, ventoinha: 2 } } ] },
    ],
    hipoteses: [
      { id: 'ventoinha', nome: 'Eletroventilador', servico: 'ventoinha',
        testes: ['Ver se a ventoinha liga com o motor quente', 'Testar relé, fusível e sensor de temperatura'] },
      { id: 'radiador', nome: 'Radiador e mangueiras', servico: 'radiador',
        testes: ['Teste de pressão do sistema para achar vazamento', 'Verificar colmeia obstruída e tampa do reservatório'] },
      { id: 'valvula', nome: 'Válvula termostática', servico: 'valvula',
        testes: ['Acompanhar a abertura pela temperatura das mangueiras', 'Testar a válvula fora do carro'] },
      { id: 'bomba', nome: 'Bomba d\u2019água e correia', servico: 'bomba',
        testes: ['Checar folga e vazamento pela bomba', 'Verificar tensão e estado da correia'] },
      { id: 'cabecote', nome: 'Junta do cabeçote', servico: 'cabecote',
        testes: ['Teste de gases no reservatório de expansão', 'Verificar óleo emulsionado e fumaça branca'] },
    ],
  },
  {
    id: 'freio', nome: 'Problema no freio',
    chaves: ['freio', 'freando', 'pedal do freio', 'rangendo ao frear', 'chiando ao frear', 'nao freia'],
    perguntas: [
      { texto: 'O que aparece quando você freia?', opcoes: [
        { rotulo: 'Chiado ou rangido', pesos: { pastilha: 3 } },
        { rotulo: 'Vibração no pedal', pesos: { disco: 3 } },
        { rotulo: 'Pedal afundando', pesos: { fluido: 3, cilindro: 1 } } ] },
      { texto: 'O carro puxa para algum lado ao frear?', opcoes: [
        { rotulo: 'Puxa para um lado', pesos: { cilindro: 3, pastilha: 1 } },
        { rotulo: 'Freia reto', pesos: { pastilha: 1, disco: 1 } } ] },
    ],
    hipoteses: [
      { id: 'pastilha', nome: 'Pastilhas e lonas', servico: 'pastilha',
        testes: ['Medir espessura da pastilha e conferir o desgaste irregular', 'Verificar se o sensor de desgaste encostou'] },
      { id: 'disco', nome: 'Discos', servico: 'disco',
        testes: ['Medir espessura e empenamento do disco com relógio comparador', 'Avaliar se cabe retífica ou troca'] },
      { id: 'fluido', nome: 'Fluido e sangria', servico: 'fluido',
        testes: ['Verificar nível e validade do fluido', 'Sangrar o sistema e procurar ar na linha'] },
      { id: 'cilindro', nome: 'Pinça ou cilindro travado', servico: 'pinca',
        testes: ['Conferir se a pinça está deslizando livre', 'Comparar temperatura das rodas depois de rodar'] },
    ],
  },
  {
    id: 'suspensao', nome: 'Barulho na suspensão',
    chaves: ['barulho na suspensao', 'batendo na lombada', 'suspensao', 'rangendo', 'barulho de batida', 'toc toc'],
    perguntas: [
      { texto: 'Como é o barulho?', opcoes: [
        { rotulo: 'Batida seca', pesos: { amortecedor: 2, bandeja: 2 } },
        { rotulo: 'Rangido', pesos: { bucha: 3 } },
        { rotulo: 'Estalo em curva', pesos: { bieleta: 2, homocinetica: 3 } } ] },
      { texto: 'O carro balança demais depois de uma lombada?', opcoes: [
        { rotulo: 'Balança bastante', pesos: { amortecedor: 3 } },
        { rotulo: 'Firme', pesos: { bucha: 1, bieleta: 1 } } ] },
    ],
    hipoteses: [
      { id: 'amortecedor', nome: 'Amortecedores e batentes', servico: 'amortecedor',
        testes: ['Teste de balanço e inspeção de vazamento de óleo', 'Verificar batente e coxim'] },
      { id: 'bandeja', nome: 'Bandeja e pivô', servico: 'bandeja',
        testes: ['Verificar folga no pivô com alavanca', 'Inspecionar coifa rompida'] },
      { id: 'bieleta', nome: 'Bieletas e barra estabilizadora', servico: 'bieleta',
        testes: ['Balançar a barra procurando folga', 'Conferir buchas da barra'] },
      { id: 'bucha', nome: 'Buchas e coxins', servico: 'bucha',
        testes: ['Inspecionar buchas ressecadas', 'Testar com o carro suspenso'] },
      { id: 'homocinetica', nome: 'Junta homocinética', servico: 'homocinetica',
        testes: ['Fazer curva fechada em baixa velocidade e ouvir o estalo', 'Conferir coifa da junta'] },
    ],
  },
  {
    id: 'arcondicionado', nome: 'Ar-condicionado não gela',
    chaves: ['ar condicionado', 'ar-condicionado', 'nao gela', 'nao esta gelando', 'ar quente'],
    perguntas: [
      { texto: 'Como está saindo o ar?', opcoes: [
        { rotulo: 'Sopra fraco', pesos: { filtro: 3, evaporador: 1 } },
        { rotulo: 'Sopra forte mas quente', pesos: { gas: 3, compressor: 2 } } ] },
      { texto: 'O compressor chega a ligar?', opcoes: [
        { rotulo: 'Liga e desliga rápido', pesos: { gas: 3 } },
        { rotulo: 'Não liga', pesos: { compressor: 3, eletrica: 2 } },
        { rotulo: 'Não sei', pesos: {} } ] },
    ],
    hipoteses: [
      { id: 'gas', nome: 'Carga de gás e vazamento', servico: 'ar',
        testes: ['Medir alta e baixa com o manifold', 'Procurar vazamento com lâmpada UV ou detector'] },
      { id: 'compressor', nome: 'Compressor e embreagem', servico: 'compressor',
        testes: ['Verificar acionamento da embreagem do compressor', 'Checar pressostato e chicote'] },
      { id: 'filtro', nome: 'Filtro de cabine e ventilação', servico: 'filtro de cabine',
        testes: ['Trocar o filtro de cabine', 'Verificar o ventilador interno'] },
      { id: 'evaporador', nome: 'Evaporador e condensador', servico: 'condensador',
        testes: ['Inspecionar condensador obstruído', 'Verificar dreno do evaporador'] },
      { id: 'eletrica', nome: 'Elétrica do sistema', servico: 'eletrica',
        testes: ['Conferir fusível e relé do ar', 'Testar sensor de pressão'] },
    ],
  },
  {
    id: 'fumaca', nome: 'Fumaça no escapamento',
    chaves: ['fumaca', 'fumando', 'saindo fumaca', 'escapamento fumando'],
    perguntas: [
      { texto: 'Qual a cor da fumaça?', opcoes: [
        { rotulo: 'Azulada', pesos: { oleo: 3 } },
        { rotulo: 'Branca e densa', pesos: { agua: 3 } },
        { rotulo: 'Preta', pesos: { mistura: 3 } } ] },
      { texto: 'Está consumindo óleo ou água fora do normal?', opcoes: [
        { rotulo: 'Óleo', pesos: { oleo: 2 } },
        { rotulo: 'Água', pesos: { agua: 3 } },
        { rotulo: 'Nenhum dos dois', pesos: { mistura: 2 } } ] },
    ],
    hipoteses: [
      { id: 'oleo', nome: 'Passagem de óleo para a câmara', servico: 'motor',
        testes: ['Teste de compressão e de estanqueidade', 'Verificar retentores de válvula e respiro do motor', 'Se houver turbina, checar folga e retentores'] },
      { id: 'agua', nome: 'Água na combustão', servico: 'cabecote',
        testes: ['Teste de gases no reservatório', 'Verificar óleo emulsionado na tampa de válvulas'] },
      { id: 'mistura', nome: 'Mistura rica', servico: 'injecao',
        testes: ['Ler a sonda lambda e a correção de combustível no scanner', 'Verificar filtro de ar e pulverização dos bicos'] },
    ],
  },
  {
    id: 'vibracao', nome: 'Vibração ou direção puxando',
    chaves: ['vibrando', 'vibracao', 'tremendo o volante', 'puxando para', 'direcao puxa', 'pneu gastando'],
    perguntas: [
      { texto: 'Em que velocidade aparece?', opcoes: [
        { rotulo: 'Acima de 80 km/h', pesos: { balanceamento: 3 } },
        { rotulo: 'Em qualquer velocidade', pesos: { roda: 2, rolamento: 2 } },
        { rotulo: 'Só ao frear', pesos: { disco: 3 } } ] },
      { texto: 'Onde você sente?', opcoes: [
        { rotulo: 'No volante', pesos: { balanceamento: 2, disco: 1 } },
        { rotulo: 'No banco / atrás', pesos: { roda: 2, rolamento: 1 } },
        { rotulo: 'Puxa para um lado', pesos: { geometria: 3 } } ] },
    ],
    hipoteses: [
      { id: 'balanceamento', nome: 'Balanceamento', servico: 'balanceamento',
        testes: ['Balancear as quatro rodas', 'Conferir empeno da roda'] },
      { id: 'geometria', nome: 'Alinhamento e geometria', servico: 'alinhamento',
        testes: ['Alinhar e conferir cambagem e convergência', 'Avaliar desgaste irregular dos pneus'] },
      { id: 'roda', nome: 'Pneus e rodas', servico: 'pneu',
        testes: ['Inspecionar bolha, deformação e calibragem', 'Fazer rodízio e reavaliar'] },
      { id: 'rolamento', nome: 'Rolamento de roda', servico: 'rolamento',
        testes: ['Ouvir o ruído variando na curva', 'Testar folga com a roda suspensa'] },
      { id: 'disco', nome: 'Disco de freio', servico: 'disco',
        testes: ['Medir empenamento do disco', 'Verificar aperto e desgaste das pastilhas'] },
    ],
  },
];

/** Ordena as hipóteses e diz o quanto dá para confiar no primeiro lugar. */
const ranquear = (sintoma, pesos) => {
  const lista = sintoma.hipoteses
    .map(h => ({ ...h, peso: pesos[h.id] || 0 }))
    .sort((a, b) => b.peso - a.peso);
  const topo = lista[0]?.peso || 0;
  const segundo = lista[1]?.peso || 0;
  const confianca = topo >= 4 && topo - segundo >= 2 ? 'alta' : topo >= 2 ? 'media' : 'baixa';
  return { lista: lista.filter(h => h.peso > 0).slice(0, 3), confianca };
};

/** Cruza a hipótese com o que a oficina já fez. Referência, nunca certeza. */
const quantasVezesAqui = (m, servico) => {
  const alvo = normalizar(servico);
  return Object.entries(m.padroes.geral || {})
    .filter(([nome]) => normalizar(nome).includes(alvo)).reduce((s, [, n]) => s + n, 0);
};

const fecharInvestigacao = (sintoma, pesos, ctx) => {
  const { lista, confianca } = ranquear(sintoma, pesos);
  MEMORIA.investigacao = null;
  if (!lista.length) return {
    resumo: 'Com o que você me contou eu ainda não consigo separar as possibilidades. O caminho mais honesto aqui é o scanner: ler os códigos e os dados em tempo real antes de trocar qualquer peça.',
    sugestoes: ['Investigar de novo', 'Resumo do dia'] };

  const hipoteses = lista.map(h => ({
    ...h, vezes: quantasVezesAqui(ctx.m, h.servico),
  }));
  return {
    resumo: 'Pelo que você descreveu, eu começaria por aqui — em ordem de possibilidade, não de certeza:',
    hipoteses, confianca,
    rodape: confianca === 'baixa'
      ? 'A separação entre as hipóteses ficou fraca. Antes de trocar peça, vale passar o scanner e refazer o teste.'
      : 'Nada disso é diagnóstico fechado: a palavra final é do teste na bancada.',
    sugestoes: ['Investigar outro defeito', 'Abrir uma ordem para esse carro'],
  };
};

/* ── 10.4 FERRAMENTAS ─────────────────────────────────────────────────────
   As mãos. Leitura responde na hora; gravação devolve uma confirmação e só
   executa depois do sim. Toda gravação passa por `acoes`, que já registra
   na auditoria — a IA não tem porta dos fundos.                          */
const RE_PLACA = /\b([A-Z]{3}[- ]?\d[A-Z0-9]\d{2})\b/i;
const RE_TELEFONE = /\b(\d{10,11})\b/;
const RE_NUMERO_OS = /\b(?:os|ordem)\s*n?º?\s*(\d{3,6})\b/i;
const soDigitos = (t) => String(t || '').replace(/\D/g, '');

/** Tira o "nome" de frases como "cadastre o cliente João Silva 11988887777". */
const extrairNome = (q) => {
  let t = q.replace(RE_TELEFONE, ' ').replace(/[.,;?]/g, ' ');
  const tirar = [
    /^\s*(por favor|pfv|pf)\s+/i,
    /^\s*(cadastr\w+|criar?|cria|inclu\w+|adicion\w+|registr\w+|busc\w+|procur\w+|ach\w+)\s+/i,
    /^\s*(um|uma|o|a|esse|essa|novo|nova)\s+/i,
    /^\s*(cliente|consumidor)\s+/i,
    /^\s*(chamad[oa]|de nome|com o nome|nome)\s+/i,
  ];
  let mudou = true;
  while (mudou) { mudou = false; tirar.forEach(re => { const n = t.replace(re, ''); if (n !== t) { t = n; mudou = true; } }); }
  return t.replace(/\s+/g, ' ').trim();
};

const FERRAMENTAS = [
  {
    id: 'buscar_cliente', grava: false,
    chaves: ['quem e o dono', 'dono da placa', 'buscar cliente', 'procurar cliente', 'dados do cliente',
             'telefone do', 'telefone da', 'contato do', 'contato da', 'achar cliente', 'quem e o cliente'],
    montar: (q, ctx) => {
      const placa = (q.match(RE_PLACA) || [])[1];
      const alvo = placa
        ? ctx.m.veiculos.find(v => soDigitos(v.placa) + normalizar(v.placa) === soDigitos(placa) + normalizar(placa)
            || normalizar(v.placa).replace(/[^a-z0-9]/g, '') === normalizar(placa).replace(/[^a-z0-9]/g, ''))
        : null;
      if (placa && !alvo) return { resposta: {
        resumo: 'Não achei a placa ' + placa.toUpperCase() + ' na base. Confere para mim se ela está cadastrada?',
        sugestoes: ['Quais veículos estão cadastrados?'] } };
      if (alvo) {
        const c = alvo.cliente;
        return { resposta: {
          resumo: alvo.marca + ' ' + alvo.modelo + ' ' + alvo.ano + ', placa ' + alvo.placa + '. O dono é ' + (c?.nome || 'não identificado') + '.',
          linhas: [
            { titulo: 'Telefone', apoio: c?.cidade || '', valor: fmtTel(c?.telefone) },
            { titulo: 'Passagens pela oficina', apoio: alvo.ultima ? 'última em ' + fmtData(alvo.ultima.concluida_em) : 'nenhuma concluída', valor: String(alvo.concluidas.length) },
            { titulo: 'Já investiu neste carro', valor: brl(alvo.gasto) },
          ],
          acao: c ? { rotulo: 'Abrir a ficha do cliente', fazer: () => ctx.abrirCliente(c.id) } : null,
          sugestoes: ['Histórico desse carro', 'O que esse carro precisa?'] } };
      }
      const termo = normalizar(extrairNome(q));
      const achados = termo.length >= 3
        ? ctx.m.clientes.filter(c => normalizar(c.nome).includes(termo) || soDigitos(c.telefone).includes(soDigitos(q))).slice(0, 5)
        : [];
      if (!achados.length) return { resposta: {
        resumo: 'Não encontrei esse cliente. Pode me dar a placa do carro ou o nome completo?', sugestoes: [] } };
      return { resposta: {
        resumo: achados.length === 1 ? 'Achei:' : 'Achei ' + achados.length + ' clientes com esse nome:',
        linhas: achados.map(c => ({ titulo: c.nome, apoio: (c.veiculos.length || 0) + ' veículo(s) · ' + (c.inativo ? 'sem retorno há tempo' : 'ativo'), valor: fmtTel(c.telefone) })),
        acao: { rotulo: 'Abrir a ficha de ' + achados[0].nome.split(' ')[0], fazer: () => ctx.abrirCliente(achados[0].id) } } };
    },
  },
  {
    id: 'criar_cliente', grava: true,
    chaves: ['cadastre o cliente', 'cadastrar cliente', 'criar cliente', 'novo cliente', 'cadastra o cliente', 'cadastre esse cliente'],
    montar: (q, ctx) => {
      if (!pode(ctx.papel, 'criar')) return { resposta: {
        resumo: 'O perfil de ' + PAPEIS[ctx.papel].nome.toLowerCase() + ' não cadastra cliente. Quem faz isso é o balcão ou o gerente.' } };
      const telefone = soDigitos((q.match(RE_TELEFONE) || [])[1] || '');
      const nome = extrairNome(q).replace(/\s*\b(com|telefone|fone|celular|numero)\b\s*/gi, ' ').trim();
      if (nome.split(' ').length < 2) return { resposta: {
        resumo: 'Consegui entender que é para cadastrar, mas preciso do nome completo. Escreve assim: "cadastre o cliente Maria Souza 11988887777".' } };
      return { confirmar: {
        titulo: 'Cadastrar ' + nome + '?',
        detalhe: telefone ? 'Telefone ' + fmtTel(telefone) + ' · pessoa física' : 'Sem telefone informado · pessoa física',
        fazer: () => {
          ctx.acoes.criarCliente({ tipo: 'fisica', nome, telefone, documento: '', email: '', cidade: '', uf: '' });
          anotarAcao('Cadastrou o cliente ' + nome);
          return { resumo: 'Pronto, ' + nome + ' está cadastrado. Quer que eu abra a tela de clientes para você completar documento e endereço?',
            acao: { rotulo: 'Abrir clientes', ir: 'clientes' } };
        } } };
    },
  },
  {
    id: 'historico_veiculo', grava: false,
    chaves: ['historico', 'ja passou aqui', 'o que ja fizemos', 'ultimas manutencoes', 'o que esse carro precisa', 'prontuario'],
    montar: (q, ctx) => {
      const placa = (q.match(RE_PLACA) || [])[1];
      const v = placa
        ? ctx.m.veiculos.find(x => normalizar(x.placa).replace(/[^a-z0-9]/g, '') === normalizar(placa).replace(/[^a-z0-9]/g, ''))
        : null;
      if (!v) return { resposta: {
        resumo: 'Me passa a placa que eu abro o histórico completo — o que já foi feito, quando e com qual quilometragem.' } };
      const ultimos = v.concluidas.slice(0, 4).map(o => ({
        titulo: o.itens.filter(i => i.tipo === 'servico').map(i => i.descricao).join(', ') || 'OS ' + o.numero,
        apoio: fmtData(o.concluida_em) + ' · ' + inteiro(o.km_entrada) + ' km',
        valor: brl(o.totais.liquido) }));
      const pendentes = v.vencidos.map(i => i.servico);
      return { resposta: {
        resumo: v.marca + ' ' + v.modelo + ' ' + v.ano + ' · ' + inteiro(v.km_atual) + ' km rodados. ' +
          (v.concluidas.length ? 'Passou ' + v.concluidas.length + ' vez(es) por aqui.' : 'Ainda não tem serviço concluído aqui.') +
          (pendentes.length ? ' Pelo plano de manutenção, está vencido: ' + pendentes.join(', ') + '.' : ' O plano de manutenção está em dia.'),
        linhas: ultimos,
        acao: { rotulo: 'Abrir o prontuário', fazer: () => ctx.abrirVeiculo(v.id) },
        sugestoes: ['Quem é o dono da placa ' + v.placa + '?'] } };
    },
  },
  {
    id: 'consultar_estoque', grava: false,
    chaves: ['tem em estoque', 'temos em estoque', 'tem peca', 'tem pastilha', 'tem filtro', 'tem oleo',
             'consultar estoque', 'quantas unidades', 'disponibilidade', 'quanto tem de'],
    montar: (q, ctx) => {
      const termo = normalizar(q).replace(/.*\b(tem|temos|estoque de|quanto tem de|disponibilidade de)\b/, '').replace(/\?/g, '').trim();
      const achados = ctx.dados.pecas.filter(p => {
        const alvo = normalizar(p.descricao + ' ' + p.codigo);
        return termo.split(/\s+/).filter(x => x.length >= 3).some(x => alvo.includes(x));
      }).slice(0, 6);
      if (!achados.length) return { resposta: {
        resumo: 'Não achei essa peça no estoque. Ela pode estar cadastrada com outro nome — quer que eu abra a tela de estoque para conferir?',
        acao: { rotulo: 'Abrir estoque', ir: 'estoque' } } };
      return { resposta: {
        resumo: 'Isto é o que tem no estoque:',
        linhas: achados.map(p => ({
          titulo: p.descricao,
          apoio: p.codigo + ' · ' + (p.quantidade === 0 ? 'zerada' : p.quantidade <= p.estoque_minimo ? 'abaixo do mínimo (' + p.estoque_minimo + ')' : 'saldo saudável') + ' · venda ' + brl(p.preco_venda),
          valor: p.quantidade + ' un' })),
        acao: { rotulo: 'Abrir estoque', ir: 'estoque' } } };
    },
  },
  {
    id: 'adicionar_item', grava: true,
    chaves: ['adicione', 'adicionar', 'inclua', 'incluir', 'lanca', 'lancar', 'poe na os', 'colocar na os'],
    montar: (q, ctx) => {
      const num = (q.match(RE_NUMERO_OS) || [])[1];
      if (!num) return { resposta: {
        resumo: 'Em qual ordem eu lanço? Escreve o número, assim: "adicione óleo 5W30 na OS 2836".' } };
      const os = ctx.m.ativas.find(o => String(o.numero) === String(num)) || ctx.m.ordens.find(o => String(o.numero) === String(num));
      if (!os) return { resposta: { resumo: 'Não encontrei a OS ' + num + ' na base.' } };
      if (os.etapa === 'concluida' || os.etapa === 'entrega') return { resposta: {
        resumo: 'A OS ' + num + ' já está em ' + etapaNome(os.etapa).toLowerCase() + '. Incluir item numa ordem fechada bagunça o faturamento — o certo é abrir uma nova.' } };
      const descricao = q.replace(RE_NUMERO_OS, ' ')
        .replace(/^.*?\b(adicione|adicionar|inclua|incluir|lanca|lancar|poe|colocar)\b/i, '')
        .replace(/\b(na|no|da|do|em|para|pra)\b\s*$/i, '').replace(/\s+/g, ' ').trim();
      if (descricao.length < 3) return { resposta: { resumo: 'O que exatamente eu lanço na OS ' + num + '?' } };
      const peca = ctx.dados.pecas.find(p => normalizar(descricao).includes(normalizar(p.descricao).slice(0, 8))
        || normalizar(p.descricao).includes(normalizar(descricao)));
      const preco = peca ? peca.preco_venda : 0;
      return { confirmar: {
        titulo: 'Lançar "' + (peca ? peca.descricao : descricao) + '" na OS ' + num + '?',
        detalhe: peca
          ? '1 un · ' + brlBruto(preco) + ' · saldo atual de ' + peca.quantidade + ' un no estoque'
          : 'Peça não encontrada no estoque: vai entrar sem preço, para você completar na ordem.',
        fazer: () => {
          ctx.acoes.adicionarItemOS(os.id, {
            tipo: 'peca', peca_id: peca ? peca.id : null,
            descricao: peca ? peca.descricao : descricao, quantidade: 1,
            custo_unitario: peca ? peca.custo_medio : 0, preco_unitario: preco });
          anotarAcao('Incluiu ' + (peca ? peca.descricao : descricao) + ' na OS ' + num);
          return { resumo: 'Lançado na OS ' + num + '.' + (peca ? '' : ' Como a peça não está no estoque, o preço ficou zerado — vale ajustar na ordem.'),
            acao: { rotulo: 'Abrir a OS ' + num, fazer: () => ctx.abrirOS(os.id) } };
        } } };
    },
  },
  {
    id: 'criar_tarefa', grava: true,
    chaves: ['me lembra', 'me lembre', 'anota', 'anotar', 'criar tarefa', 'nova tarefa', 'lembrete'],
    montar: (q, ctx) => {
      const titulo = q.replace(/^.*?\b(me lembra de|me lembre de|me lembra|me lembre|anota que|anota|anotar|criar tarefa|nova tarefa|lembrete)\b/i, '')
        .replace(/\s+/g, ' ').trim();
      if (titulo.length < 3) return { resposta: { resumo: 'Lembrar do quê? Me diz em uma frase que eu anoto.' } };
      return { confirmar: {
        titulo: 'Criar a tarefa "' + titulo + '"?',
        detalhe: 'Entra na lista de rotinas com prazo de dois dias, no seu nome.',
        fazer: () => {
          ctx.acoes.criarTarefa({ titulo, origem: 'Pedido no copiloto' });
          anotarAcao('Criou a tarefa: ' + titulo);
          return { resumo: 'Anotado. Está na lista de rotinas, em Automações.', acao: { rotulo: 'Ver rotinas', ir: 'automacoes' } };
        } } };
    },
  },
  {
    id: 'resumo_dia', grava: false,
    chaves: ['resumo do dia', 'como foi o dia', 'como esta o dia', 'resumo', 'me atualiza', 'situacao da oficina', 'o que precisa de decisao'],
    montar: (q, ctx) => {
      const l = leituraDoDia(ctx.dados, ctx.m);
      return { resposta: {
        resumo: 'Situação agora: ' + l.naOficina + ' carro(s) na oficina, ' + l.prontos + ' pronto(s) para entrega e ' +
          l.aguardandoAprovacao + ' orçamento(s) esperando o cliente responder.' +
          (l.atrasadas.length ? ' Atenção para ' + l.atrasadas.length + ' ordem(ns) passando do prazo.' : ' Nada passando do prazo.'),
        linhas: [
          { titulo: 'Faturado hoje', apoio: l.hoje.ordens + ' ordem(ns) entregue(s)', valor: brl(l.hoje.receita) },
          { titulo: 'Aguardando peças', valor: String(l.aguardandoPecas) },
          { titulo: 'Clientes sem retorno', apoio: 'sem passar aqui há mais de seis meses', valor: String(l.retorno.length) },
          { titulo: 'Peças abaixo do mínimo', valor: String(ctx.m.estoqueBaixo.length) },
        ],
        acao: { rotulo: 'Abrir o centro de controle', ir: 'controle' },
        sugestoes: ['O que está travado no pátio?', 'Quais peças estão acabando?'] } };
    },
  },
  {
    id: 'abrir_tela', grava: false,
    chaves: ['abre o', 'abra o', 'abre a', 'abra a', 'vai para', 'me leva para', 'ir para', 'abrir tela'],
    montar: (q, ctx) => {
      const t = normalizar(q);
      const alvo = NAV.filter(n => n.id).find(n => t.includes(normalizar(n.nome)) || t.includes(n.id));
      if (!alvo) return { resposta: { resumo: 'Qual tela? Posso abrir pátio, ordens, clientes, veículos, estoque, área financeira, relatórios e ajustes.' } };
      return { resposta: {
        resumo: 'Abrindo ' + alvo.nome + '.',
        acao: { rotulo: 'Ir para ' + alvo.nome, ir: alvo.id } } };
    },
  },
];

/* ── 10.5 O CÉREBRO ───────────────────────────────────────────────────────
   Ordem de leitura, do mais específico para o mais genérico. Investigação em
   andamento tem prioridade: quem está no meio de um diagnóstico não quer que
   a conversa mude de assunto sozinha.                                     */
/* "hoje foi corrido demais" caía na saudação porque "oi" está dentro de
   "foi". A chave passa a valer só no começo de uma palavra — o fim continua
   solto, senão "peca" não pegaria "peças", "cansad" não pegaria "cansado" e
   "kkk" não pegaria "kkkk", que é como as pessoas realmente escrevem. */
const escapar = (c) => c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const bateChave = (t, chaves) => chaves.some(c =>
  new RegExp('(^|[^a-z0-9])' + escapar(c)).test(t));

function pensarCopiloto(pergunta, ctx) {
  const q = String(pergunta || '').trim();
  const t = normalizar(q);

  /* 1. Investigação em andamento */
  const inv = MEMORIA.investigacao;
  if (inv) {
    const sintoma = SINTOMAS.find(x => x.id === inv.id);
    if (/\b(parar|cancelar|sair|deixa|esquece)\b/.test(t)) {
      MEMORIA.investigacao = null;
      return { resposta: { resumo: 'Sem problema, parei por aqui. Quando quiser retomar é só descrever o sintoma de novo.' } };
    }
    const pergAtual = sintoma.perguntas[inv.passo];
    const escolha = pergAtual.opcoes.find(o => t.includes(normalizar(o.rotulo)) || normalizar(o.rotulo).includes(t));
    const naoSei = /\bnao sei|nao seio|sei nao|talvez|nao tenho certeza\b/.test(t);
    if (escolha || naoSei) {
      const pesos = { ...inv.pesos };
      if (escolha) Object.entries(escolha.pesos).forEach(([k, v]) => { pesos[k] = (pesos[k] || 0) + v; });
      const passo = inv.passo + 1;
      if (passo >= sintoma.perguntas.length) return { resposta: fecharInvestigacao(sintoma, pesos, ctx) };
      MEMORIA.investigacao = { ...inv, passo, pesos };
      const prox = sintoma.perguntas[passo];
      return { resposta: { resumo: prox.texto, sugestoes: [...prox.opcoes.map(o => o.rotulo), 'Não sei'] } };
    }
    /* Não era resposta: a pessoa mudou de assunto. Encerra e segue a vida. */
    MEMORIA.investigacao = null;
  }

  /* 2. Resposta a uma oferta que eu mesmo fiz. É isto que transforma troca de
        mensagens em conversa: o "sim" só significa alguma coisa porque eu
        lembro do que perguntei antes. */
  const oferta = MEMORIA.oferta;
  if (oferta) {
    if (SIM.test(t)) { MEMORIA.oferta = null; anotarAssunto('conversa');
      return { resposta: oferta.executar(ctx) }; }
    if (NAO.test(t)) { MEMORIA.oferta = null;
      return { resposta: { resumo: girar(['Tudo bem. Fica para quando você quiser.', 'Sem problema. Estou por aqui.']) } }; }
    MEMORIA.oferta = null;   /* mudou de assunto: a oferta perde a validade */
  }

  /* 3. Conversa de gente */
  const social = CONVERSA.find(c => bateChave(t, c.chaves));
  if (social && t.split(/\s+/).length <= 6) {
    anotarAssunto('conversa');
    return { resposta: guardarOferta(social.responder(ctx)) };
  }
  const papo = PAPO.find(c => bateChave(t, c.chaves));
  if (papo && t.split(/\s+/).length <= 9) {
    anotarAssunto('conversa');
    MEMORIA.semEntender = 0;
    return { resposta: guardarOferta(papo.responder(ctx)) };
  }

  /* 3. Pedido ao sistema. Vem antes do sintoma porque as chaves aqui são
        frases inteiras ("tem pastilha de freio") e as do sintoma são palavras
        soltas ("freio") — sem esta ordem, consultar estoque viraria consulta
        médica. */
  const pedido = FERRAMENTAS.filter(f => f.grava).find(f => bateChave(t, f.chaves))
    || FERRAMENTAS.find(f => bateChave(t, f.chaves));
  if (pedido) {
    anotarAssunto(pedido.id);
    const saida = pedido.montar(q, ctx);
    if (saida.confirmar) return { resposta: { resumo: 'Confere para mim antes de eu gravar:', confirmar: saida.confirmar }, grava: true };
    if (saida.resposta) guardarOferta(saida.resposta);
    return saida;
  }

  /* 4. Sintoma: entra em modo investigação */
  const sintoma = SINTOMAS.find(x => bateChave(t, x.chaves));
  if (sintoma) {
    anotarAssunto('diagnostico');
    MEMORIA.investigacao = { id: sintoma.id, passo: 0, pesos: {} };
    const p = sintoma.perguntas[0];
    const jaVisto = quantasVezesAqui(ctx.m, sintoma.hipoteses[0].servico);
    return { resposta: {
      resumo: 'Vamos por partes. ' + sintoma.nome + ' tem mais de um caminho possível, então prefiro eliminar antes de apontar' +
        (jaVisto ? ' — só de serviço parecido esta oficina já fez ' + jaVisto + ' vez(es).' : '.') + '\n\n' + p.texto,
      sugestoes: [...p.opcoes.map(o => o.rotulo), 'Não sei'] } };
  }

  /* 5. Pergunta sobre os números: quem responde é o motor que já existia */
  const doDado = responder(q, ctx.dados, ctx.m);
  if (!doDado.naoEntendi) {
    anotarAssunto('dados');
    /* O cofre da fase 9 vale aqui também: número escondido continua escondido,
       mas com a porta do lado. */
    if (valorOculto() && /R\$ ••••/.test(JSON.stringify(doDado.linhas || []) + doDado.resumo)) {
      return { resposta: { ...doDado,
        rodape: 'Os valores estão guardados na área financeira. Abro para você?',
        acao: { rotulo: 'Abrir a área financeira', fazer: ctx.cofre.abrir } } };
    }
    return { resposta: doDado };
  }

  /* 6. Não entendi — mas não encerro. Primeiro tento adivinhar o campo pelo
        assunto que a frase menciona; só depois abro o cardápio. */
  const desvio = DESVIOS.find(x => bateChave(t, x.chaves));
  if (desvio) {
    MEMORIA.semEntender = 0;
    return { resposta: {
      resumo: 'Não peguei o pedido exato, mas entendi que é sobre ' + desvio.texto + '. Me diz de outro jeito, ou escolhe um caminho:',
      sugestoes: desvio.sugestoes } };
  }

  MEMORIA.semEntender = (MEMORIA.semEntender || 0) + 1;
  if (MEMORIA.semEntender === 1) return { resposta: {
    resumo: girar([
      'Essa eu não peguei. É sobre um carro, um cliente, o estoque, o dinheiro ou a agenda?',
      'Não consegui entender. Me dá uma pista: é papelada, peça, defeito ou número?',
    ]),
    sugestoes: ['É sobre um defeito', 'É sobre dinheiro', 'O que você consegue fazer?'] } };

  return { resposta: {
    resumo: 'Continuo sem pegar — e chutar seria pior. Eu penso aqui dentro do navegador, ' +
      'sem modelo de linguagem por trás, então converso bem sobre o que está na base e sobre defeito de carro. ' +
      'Isto aqui eu faço com certeza:',
    passos: [
      'Consultar: dono da placa, histórico do carro, peça no estoque, contas e faturamento',
      'Executar: cadastrar cliente, lançar item na OS, criar tarefa, marcar na agenda',
      'Investigar defeito por eliminação, uma pergunta por vez',
    ],
    sugestoes: ['Resumo do dia', 'Meu carro está falhando', 'O que tem na agenda hoje?'] } };
}

/* ── 10.6 O PAINEL ────────────────────────────────────────────────────────
   Mora ao lado, não por cima: abre, fecha e a conversa continua onde estava.
   O cabeçalho mostra em que tela você está, porque um colega que pergunta
   "onde você está mesmo?" a cada frase cansa.                            */
const SUGESTOES_TELA = {
  patio:      ['O que está travado no pátio?', 'Resumo do dia'],
  ordens:     ['O que está travado no pátio?', 'Resumo do dia'],
  estoque:    ['Quais peças estão acabando?', 'Tem pastilha de freio?'],
  clientes:   ['Quais clientes precisam de retorno?', 'Quem são meus melhores clientes?'],
  veiculos:   ['Quais veículos estão próximos de manutenção?'],
  cofre:      ['Quanto tenho a receber?', 'Como está o desempenho da oficina este mês?'],
  agenda:     ['O que tem na agenda hoje?', 'Quem vem amanhã?'],
  financeiro: ['Quanto tenho a receber?'],
  preventiva: ['Quais veículos estão próximos de manutenção?'],
  padrao:     ['Resumo do dia', 'Meu carro está falhando', 'O que você consegue fazer?'],
};

function BolhaCopiloto({ m, aoConfirmar, aoCancelar }) {
  const { irPara } = usar();
  const r = m.resposta || {};
  return html`
    <div class="bolha ia">
      <p style="white-space:pre-line">${r.resumo}</p>

      ${r.linhas && r.linhas.length ? html`
        <div style="margin-top:11px">
          ${r.linhas.map((l, i) => html`
            <div key=${i} class="dado-linha">
              <span style="min-width:0">
                <span class="destaque" style="display:block">${l.titulo}</span>
                ${l.apoio ? html`<span class="silencioso" style="font-size:11.5px">${l.apoio}</span>` : null}
              </span>
              ${l.valor ? html`<span class="mono" style="font-weight:600;white-space:nowrap">${l.valor}</span>` : null}
            </div>`)}
        </div>` : null}

      ${r.passos && r.passos.length ? html`
        <ol class="passos-copiloto">${r.passos.map((p, i) => html`<li key=${i}>${p}</li>`)}</ol>` : null}

      ${r.hipoteses ? html`
        <div style="margin-top:11px">
          ${r.hipoteses.map((h, i) => html`
            <div key=${h.id} class="hipotese-ia">
              <div class="cabeca">
                <span class="selo">${i + 1}º</span><b>${h.nome}</b>
              </div>
              <ol class="passos-copiloto" style="margin-top:4px">
                ${h.testes.map((t, j) => html`<li key=${j}>${t}</li>`)}
              </ol>
              ${h.vezes > 0 ? html`<p class="silencioso" style="margin-top:6px">
                Serviço parecido já apareceu ${h.vezes} vez(es) nesta oficina — referência, não conclusão.</p>` : null}
            </div>`)}
          <div class=${'confianca ' + r.confianca} style="margin-top:10px">
            <i></i>confiança ${r.confianca === 'alta' ? 'alta' : r.confianca === 'media' ? 'média' : 'baixa'}
          </div>
        </div>` : null}

      ${r.rodape ? html`<p class="silencioso" style="margin-top:10px;line-height:1.5">${r.rodape}</p>` : null}

      ${r.confirmar && !m.resolvido ? html`
        <div class="confirma-copiloto">
          <div>
            <b>${r.confirmar.titulo}</b>
            <div class="silencioso" style="margin-top:3px">${r.confirmar.detalhe}</div>
          </div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-primario btn-p" onClick=${() => aoConfirmar(m)}>
              <${Icone} nome="check" tam=${13} />Confirmar</button>
            <button class="btn btn-neutro btn-p" onClick=${() => aoCancelar(m)}>Cancelar</button>
          </div>
        </div>` : null}

      ${m.resolvido === 'cancelado' ? html`
        <p class="silencioso" style="margin-top:9px">Cancelado. Nada foi alterado.</p>` : null}

      ${r.acao ? html`
        <button class="btn btn-neutro btn-p" style="margin-top:11px"
          onClick=${() => r.acao.ir ? irPara(r.acao.ir) : r.acao.fazer && r.acao.fazer()}>
          ${r.acao.rotulo}<${Icone} nome="seta" tam=${13} /></button>` : null}
    </div>`;
}

function CopilotoPainel({ vista, titulo, aoFechar }) {
  const ctxApp = usar();
  const { dados, metricas, acoes, papel, cofre, achados } = ctxApp;
  const [texto, setTexto] = useState('');
  const [pensando, setPensando] = useState(false);
  const [aba, setAba] = useState('conversa');
  const [, redesenhar] = useState(0);
  const fim = useRef(null);
  const caixaGaveta = useRef(null);
  usarFocoPreso(caixaGaveta);
  const relogioResposta = useRef(null);
  useEffect(() => () => clearTimeout(relogioResposta.current), []);

  const primeiroNome = (dados.usuarios.find(u => u.papel === papel && u.ativo) || dados.usuarios[0])?.nome.split(' ')[0] || '';
  const criticos = achados.filter(a => a.gravidade === 'critico').length;

  const ctx = {
    dados, m: metricas, acoes, papel, cofre, primeiroNome, criticos,
    abrirOS: ctxApp.abrirOS, abrirCliente: ctxApp.abrirCliente, abrirVeiculo: ctxApp.abrirVeiculo,
  };

  const [msgs, setMsgs] = useState(() => MEMORIA.conversa.length ? MEMORIA.conversa : [{
    id: 'ini', de: 'ia', resposta: {
      resumo: horaDoDia() + ', ' + primeiroNome + '. Sou seu copiloto aqui na oficina — consulto a base, ajudo a investigar defeito e executo tarefas no sistema, sempre pedindo confirmação antes de gravar.',
      sugestoes: SUGESTOES_TELA[vista] || SUGESTOES_TELA.padrao,
    } }]);
  useEffect(() => { MEMORIA.conversa = msgs; }, [msgs]);
  useEffect(() => { fim.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [msgs, pensando, aba]);

  const enviar = (pergunta) => {
    const q = String(pergunta || '').trim();
    if (!q || pensando) return;
    setMsgs(m => [...m, { id: novoId(), de: 'eu', texto: q }]);
    setTexto('');
    setPensando(true);
    /* A pausa é só para a resposta não aparecer antes da pergunta na tela. */
    /* AUDITORIA: mesmo defeito do assistente — relógio sem dono. */
    clearTimeout(relogioResposta.current);
    relogioResposta.current = setTimeout(() => {
      let saida;
      try { saida = pensarCopiloto(q, ctx); }
      catch (e) {
        console.error('[copiloto]', e);
        saida = { resposta: { resumo: 'Me perdi processando isso. Tenta de novo com outras palavras?' } };
      }
      setMsgs(m => [...m, { id: novoId(), de: 'ia', resposta: saida.resposta, resolvido: null }]);
      setPensando(false);
    }, 300);
  };

  const confirmar = (msg) => {
    const resultado = msg.resposta.confirmar.fazer();
    setMsgs(m => [...m.map(x => x.id === msg.id ? { ...x, resolvido: 'feito' } : x),
      { id: novoId(), de: 'ia', resposta: resultado }]);
    redesenhar(n => n + 1);
  };
  const cancelar = (msg) => setMsgs(m => m.map(x => x.id === msg.id ? { ...x, resolvido: 'cancelado' } : x));

  const ultima = msgs[msgs.length - 1];
  const chips = ultima?.de === 'ia' && !ultima.resposta?.confirmar ? ultima.resposta?.sugestoes : null;
  const oficina = memoriaDaOficina(dados, metricas);

  return html`
    <div class="gaveta-fundo" onClick=${e => { if (e.target === e.currentTarget) aoFechar(); }}>
      <aside class="gaveta" ref=${caixaGaveta} role="dialog" aria-modal="true" aria-label="Copiloto da oficina">
        <div class="gaveta-topo">
          <div style="display:flex;align-items:center;gap:10px">
            <span style="width:32px;height:32px;border-radius:9px;background:var(--info-fundo);color:var(--azul-acao);display:flex;align-items:center;justify-content:center">
              <${Icone} nome="robo" tam=${17} /></span>
            <div>
              <h2>Copiloto</h2>
              <p class="silencioso">Consulta, investiga e executa — com confirmação</p>
            </div>
          </div>
          <div style="display:flex;gap:4px">
            <button class="btn btn-fantasma btn-icone" aria-label="Memória e ajustes"
              onClick=${() => setAba(a => a === 'memoria' ? 'conversa' : 'memoria')}>
              <${Icone} nome="historico" /></button>
            <button class="btn btn-fantasma btn-icone" onClick=${aoFechar} aria-label="Minimizar">
              <${Icone} nome="minimizar" /></button>
          </div>
        </div>

        <div class="copiloto-contexto">
          <${Icone} nome="alvo" tam=${13} />
          <span>Você está em <b>${titulo}</b>${cofre.aberto ? ' · cofre aberto' : ''}</span>
        </div>

        ${aba === 'memoria' ? html`
          <div class="conversa" style="gap:14px">
            <div>
              <div class="rotulo" style="margin-bottom:8px">O que eu aprendi desta oficina</div>
              ${oficina.servicos.length ? oficina.servicos.map(([nome, n]) => html`
                <div key=${nome} class="dado-linha">
                  <span class="destaque">${nome}</span>
                  <span class="mono" style="font-weight:600">${n}×</span>
                </div>`) : html`<p class="silencioso">Ainda sem serviço concluído para aprender padrão.</p>`}
              <p class="silencioso" style="margin-top:8px">Lido da base agora, não de um cadastro à parte:
                ${oficina.totalOrdens} ordem(ns) concluída(s), ticket médio de ${brl(oficina.ticket)}.</p>
            </div>

            <div>
              <div class="rotulo" style="margin-bottom:8px">O que eu fiz nesta sessão</div>
              ${MEMORIA.acoes.length ? MEMORIA.acoes.map((a, i) => html`
                <div key=${i} class="item" style="display:flex;gap:9px;padding:5px 0;font-size:12.5px">
                  <span class="mono silencioso">${new Date(a.quando).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span>${a.texto}</span>
                </div>`) : html`<p class="silencioso">Nada ainda. Toda gravação minha também entra na auditoria do sistema.</p>`}
            </div>

            <div>
              <div class="rotulo" style="margin-bottom:8px">Cérebro</div>
              <p class="silencioso" style="line-height:1.55">
                Hoje eu penso local: interpreto o pedido, leio esta base e respondo com o que dá para contar.
                Para linguagem aberta existe o encaixe de um modelo, e a chamada precisa sair de uma função
                no servidor — chave de API dentro deste arquivo ficaria visível para qualquer um.</p>
              <${Campo} rotulo="Endereço da função do modelo" ajuda="Deixe vazio para continuar só com o cérebro local">
                <input class="entrada" value=${MEMORIA.config.urlModelo} placeholder="https://…/functions/v1/copiloto"
                  onInput=${e => { MEMORIA.config.urlModelo = e.target.value; redesenhar(n => n + 1); }} />
              <//>
            </div>

            <button class="btn btn-neutro btn-p" onClick=${() => {
              MEMORIA.conversa = []; MEMORIA.investigacao = null;
              setMsgs([{ id: novoId(), de: 'ia', resposta: { resumo: 'Conversa limpa. Começamos de novo quando quiser.',
                sugestoes: SUGESTOES_TELA[vista] || SUGESTOES_TELA.padrao } }]);
              setAba('conversa');
            }}><${Icone} nome="lixo" tam=${13} />Limpar a conversa</button>
            <div ref=${fim}></div>
          </div>` : html`

          <div class="conversa">
            ${msgs.map(m => m.de === 'eu'
              ? html`<div key=${m.id} class="bolha eu">${m.texto}</div>`
              : html`<${BolhaCopiloto} key=${m.id} m=${m} aoConfirmar=${confirmar} aoCancelar=${cancelar} />`)}
            ${pensando ? html`
              <div class="bolha ia" style="width:auto;padding:0">
                <div class="digitando" aria-label="Pensando"><i></i><i></i><i></i></div>
              </div>` : null}
            <div ref=${fim}></div>
          </div>

          ${chips && chips.length ? html`
            <div class="sugestoes">
              ${chips.map(q => html`<button key=${q} class="sugestao" onClick=${() => enviar(q)}>${q}</button>`)}
            </div>` : null}

          <div class="compositor">
            <input class="entrada" value=${texto} placeholder="Peça com suas palavras" aria-label="Sua mensagem"
              onInput=${e => setTexto(e.target.value)} onKeyDown=${e => { if (e.key === 'Enter') enviar(texto); }} />
            <button class="btn btn-primario btn-icone" onClick=${() => enviar(texto)}
              disabled=${!texto.trim() || pensando} aria-label="Enviar">
              <${Icone} nome="seta" tam=${16} /></button>
          </div>`}
      </aside>
    </div>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   FASE 11 — SENHA, AGENDA E CONVERSA
   Três pedidos vindos do uso e uma correção de empilhamento (no CSS):

   1. A área financeira ganha senha própria, criada pelo dono na primeira
      abertura e recuperável por pergunta secreta ou código de resgate.
   2. A agenda deixa de ser promessa: semana, marcação, chegada e sugestão
      de quem já está com revisão vencida.
   3. O copiloto passa a conversar. Antes ele só entendia comando e número;
      quem respondia "lento" ouvia "não entendi", o que é a pior resposta
      possível de um colega.
   ══════════════════════════════════════════════════════════════════════════ */

/* ── 11.1 SENHA DA ÁREA FINANCEIRA ────────────────────────────────────────
   Trava de balcão, e o texto na tela diz isso. Sem servidor, qualquer segredo
   guardado aqui é verificável só do lado de cá — serve para o salão cheio,
   não contra quem abre o console. A senha de verdade nasce com o Supabase; o
   que fica pronto agora é o fluxo: criar, cobrar, errar, recuperar.       */
Object.assign(OFICINA_PADRAO, { cofre: null });

/* Espalha o texto num número só. Não é criptografia — é para o PIN não ficar
   legível em texto puro dentro do backup. */
const embaralhar = (t) => {
  /* O tempero continua 'autocore' de propósito: ele é a semente do hash
     local do modo demonstração, e trocá-lo invalidaria toda senha de cofre
     criada antes da troca de nome. É valor interno, ninguém o vê. Com banco
     conectado esta função nem é usada — lá a senha é bcrypt no servidor. */
  const base = 'autocore·cofre·' + String(t == null ? '' : t);
  let h = 2166136261;
  for (let i = 0; i < base.length; i++) { h ^= base.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(36);
};
const PERGUNTAS_RESGATE = [
  'Qual o nome da primeira oficina onde você trabalhou?',
  'Qual o modelo do seu primeiro carro?',
  'Qual o nome do seu primeiro mecânico chefe?',
  'Em que rua fica a oficina, sem o número?',
  'Qual o apelido que só a família usa?',
];
const gerarCodigoResgate = () => {
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c = '';
  for (let i = 0; i < 8; i++) c += letras[Math.floor(Math.random() * letras.length)];
  return c.slice(0, 4) + '-' + c.slice(4);
};

/* CORREÇÃO · o botão do último passo dizia "abrir a área financeira", porque
   destravar e ir para lá eram a mesma coisa. Com o cadeado do Estoque, o
   destrave pode terminar sem sair da tela — `cofre.destravar`. O rótulo passa
   a prometer só o que vale nos dois caminhos: os valores aparecem. */
function ModalSenhaCofre({ modo, aoFechar, aoLiberar }) {
  const { dados, acoes, avisar, cofreServidor } = usar();
  const cfg = dados.oficina.cofre;
  const [passo, setPasso] = useState(modo);
  const [senha, setSenha] = useState('');
  const [confirma, setConfirma] = useState('');
  const [pergunta, setPergunta] = useState(PERGUNTAS_RESGATE[0]);
  const [resposta, setResposta] = useState('');
  const [prova, setProva] = useState('');
  const [erro, setErro] = useState('');
  const [tentativas, setTentativas] = useState(0);
  const [bloqueio, setBloqueio] = useState(0);
  const [codigo, setCodigo] = useState('');
  const [perguntaGravada, setPerguntaGravada] = useState('');

  /* A pergunta de resgate mora no banco. Sem buscá-la, a tela de resgate
     mostrava "undefined" e ninguém lembrava o que tinha respondido. */
  useEffect(() => {
    if (!cofreServidor || passo !== 'resgatar') return;
    cofreServidor.pergunta().then(p => setPerguntaGravada(p || '')).catch(() => {});
  }, [passo, cofreServidor]);

  /* Espera crescente: não impede quem tem o arquivo, mas acaba com a tentativa
     de adivinhar PIN no teclado, que é o ataque possível no balcão. */
  useEffect(() => {
    if (bloqueio <= 0) return;
    const t = setInterval(() => setBloqueio(x => Math.max(0, x - 1)), 1000);
    return () => clearInterval(t);
  }, [bloqueio > 0]);

  const soNumero = (t) => t.replace(/\D/g, '').slice(0, 8);

  const criar = async () => {
    /* Com banco, o mínimo sobe para seis: quatro dígitos caem em
       milissegundos para quem tiver o hash, e agora o hash existe. */
    const minimo = cofreServidor ? 6 : 4;
    if (senha.length < minimo) { setErro('Use pelo menos ' + minimo + ' caracteres.'); return; }
    if (senha !== confirma) { setErro('As duas senhas não são iguais.'); return; }
    if (resposta.trim().length < 2) { setErro('Escreva a resposta da pergunta de resgate.'); return; }

    /* Servidor: a senha vira bcrypt lá e nunca volta. O código de resgate é
       mostrado uma vez e não é recuperável nem pelo dono do banco. */
    if (cofreServidor) {
      try {
        const codigoServidor = await cofreServidor.definir(senha, pergunta, resposta.trim());
        acoes.editarOficina({ cofre: { servidor: true } }, 'Senha da área financeira definida');
        setCodigo(codigoServidor); setErro(''); setPasso('guardar');
      } catch (e) { setErro(e.message); }
      return;
    }
    const novo = gerarCodigoResgate();
    acoes.editarOficina({ cofre: {
      senha: embaralhar(senha), pergunta,
      resposta: embaralhar(normalizar(resposta.trim())),
      codigo: embaralhar(novo), criadoEm: new Date().toISOString(),
    } }, 'Senha da área financeira definida');
    setCodigo(novo);
    setErro('');
    setPasso('guardar');
  };

  const conferir = async () => {
    if (bloqueio > 0) return;
    /* Servidor: a conferência, a contagem de tentativas e a espera acontecem
       no banco. O `setTimeout` daqui é enfeite — qualquer um o remove pelo
       console; o bloqueio do Postgres, não. */
    if (cofreServidor) {
      try {
        const r = await cofreServidor.abrir(senha);
        if (r?.ok) { setErro(''); setTentativas(0); aoLiberar(); return; }
        setSenha('');
        if (r?.motivo === 'bloqueado' || r?.segundos > 0) {
          setBloqueio(r.segundos || 60);
          setErro('Muitas tentativas. Aguarde para tentar de novo.');
        } else { setErro('Senha incorreta.'); }
        setTentativas(r?.tentativas || 0);
      } catch (e) { setErro(e.message); }
      return;
    }
    if (embaralhar(senha) === cfg.senha) { setErro(''); setTentativas(0); aoLiberar(); return; }
    const n = tentativas + 1;
    setTentativas(n);
    setSenha('');
    if (n >= 5) setBloqueio(60);
    else if (n >= 3) setBloqueio(15);
    setErro(n >= 3
      ? 'Senha errada pela ' + n + 'ª vez. Se não lembra, use o resgate abaixo — é para isso que ele existe.'
      : 'Senha errada. Tente de novo.');
  };

  const resgatar = async () => {
    const texto = prova.trim();
    /* Servidor: os dois hashes (resposta e código) são conferidos lá, com
       bcrypt. Nem a resposta nem o código voltam pela rede em momento
       algum — e o navegador não tem como saber qual dos dois acertou. */
    if (cofreServidor) {
      try {
        const r = await cofreServidor.recuperar(texto, texto);
        if (!r?.ok) { setErro('Não confere. Vale a resposta da pergunta ou o código de resgate.'); return; }
        setErro(''); setSenha(''); setConfirma(''); setResposta(''); setProva('');
        setPasso('criar');
        avisar('Resgate aceito. Defina a nova senha.');
      } catch (e) { setErro(e.message); }
      return;
    }
    const bate = embaralhar(normalizar(texto)) === cfg.resposta
      || embaralhar(texto.toUpperCase()) === cfg.codigo;
    if (!bate) { setErro('Não confere. Vale a resposta da pergunta ou o código de resgate.'); return; }
    setErro(''); setSenha(''); setConfirma(''); setResposta(''); setProva('');
    setPasso('criar');
    avisar('Resgate aceito. Defina a nova senha.');
  };

  const titulos = {
    criar: cfg ? 'Nova senha da área financeira' : 'Criar a senha da área financeira',
    pedir: 'Área financeira protegida',
    resgatar: 'Recuperar o acesso',
    guardar: 'Guarde o código de resgate',
  };

  return html`
    <${Modal} titulo=${titulos[passo]} largura=${passo === 'criar' ? 520 : 430} aoFechar=${aoFechar}
      subtitulo=${passo === 'pedir' ? 'Só quem tem a senha vê os valores' : null}
      rodape=${passo === 'guardar' ? html`
        <button class="btn btn-primario" onClick=${aoLiberar}>Guardei o código · destravar os valores</button>`
        : html`
        <button class="btn btn-neutro" onClick=${aoFechar}>Cancelar</button>
        ${passo === 'criar' ? html`<button class="btn btn-primario" onClick=${criar}>
          <${Icone} nome="cadeado" tam=${15} />Criar senha</button>` : null}
        ${passo === 'pedir' ? html`<button class="btn btn-primario" onClick=${conferir}
          disabled=${senha.length < (cofreServidor ? 6 : 4) || bloqueio > 0}>
          <${Icone} nome="cadeado-aberto" tam=${15} />${bloqueio > 0 ? 'Aguarde ' + bloqueio + 's' : 'Abrir'}</button>` : null}
        ${passo === 'resgatar' ? html`<button class="btn btn-primario" onClick=${resgatar} disabled=${!prova.trim()}>
          Conferir</button>` : null}`}>

      <div class="senha-cofre">
        ${passo === 'criar' ? html`
          <p class="silencioso" style="line-height:1.55">
            ${cofreServidor
              ? 'De seis caracteres para cima, letras e números. Ela vale para toda a área financeira: caixa, contas, rentabilidade e relatórios. Sem ela, os valores continuam como R$ •••• pelo sistema.'
              : 'De quatro a oito dígitos. Ela vale para toda a área financeira: caixa, contas, rentabilidade e relatórios. Sem ela, os valores continuam como R$ •••• pelo sistema.'}</p>
          ${/* Com banco a senha vira hash bcrypt no servidor e aceita letras.
                Sem banco, continua PIN numérico — quatro dígitos guardados só
                no navegador nunca foram controle de acesso de verdade. */ ''}
          <${Campo} rotulo="Senha" ajuda=${cofreServidor ? 'Pelo menos seis caracteres' : 'Só números, de 4 a 8 dígitos'}>
            <input class="entrada pin" type="password"
              inputMode=${cofreServidor ? 'text' : 'numeric'} value=${senha}
              onInput=${e => setSenha(cofreServidor ? e.target.value.slice(0, 64) : soNumero(e.target.value))} />
          <//>
          <${Campo} rotulo="Repita a senha">
            <input class="entrada pin" type="password"
              inputMode=${cofreServidor ? 'text' : 'numeric'} value=${confirma}
              onInput=${e => setConfirma(cofreServidor ? e.target.value.slice(0, 64) : soNumero(e.target.value))} />
          <//>
          <${Campo} rotulo="Pergunta de resgate" ajuda="Serve para recuperar o acesso se a senha fugir da cabeça">
            <select class="entrada" value=${pergunta} onChange=${e => setPergunta(e.target.value)}>
              ${PERGUNTAS_RESGATE.map(p => html`<option key=${p} value=${p}>${p}</option>`)}
            </select>
          <//>
          <${Campo} rotulo="Sua resposta" ajuda="Não diferencia maiúscula, minúscula nem acento">
            <input class="entrada" value=${resposta} onInput=${e => setResposta(e.target.value)} />
          <//>` : null}

        ${passo === 'pedir' ? html`
          <${Campo} rotulo="Senha" erro=${erro || null}
            ajuda=${bloqueio > 0 ? 'Muita tentativa seguida. Liberado em ' + bloqueio + ' segundo(s).' : null}>
            <input class="entrada pin" type="password" autoFocus value=${senha}
              inputMode=${cofreServidor ? 'text' : 'numeric'}
              autoComplete="off" name="cofre-senha" disabled=${bloqueio > 0}
              onInput=${e => { setSenha(soNumero(e.target.value)); }}
              onKeyDown=${e => { if (e.key === 'Enter' && senha.length >= 4) conferir(); }} />
          <//>
          <button class="btn btn-fantasma btn-p" style="align-self:flex-start"
            onClick=${() => { setErro(''); setPasso('resgatar'); }}>Esqueci a senha</button>` : null}

        ${passo === 'resgatar' ? html`
          <div class="aviso aviso-info"><${Icone} nome="alerta" tam=${16} />
            <span>${perguntaGravada || cfg?.pergunta || 'Pergunta de resgate'}</span></div>
          <${Campo} rotulo="Resposta ou código de resgate" erro=${erro || null}
            ajuda="Vale a resposta da pergunta acima ou o código de oito letras que apareceu na criação">
            <input class="entrada" autoFocus value=${prova} onInput=${e => setProva(e.target.value)}
              onKeyDown=${e => { if (e.key === 'Enter' && prova.trim()) resgatar(); }} />
          <//>` : null}

        ${passo === 'guardar' ? html`
          <p class="silencioso" style="line-height:1.55">
            Este é o código que abre a área financeira se a senha e a pergunta falharem.
            Ele aparece uma vez só — anote agora, de preferência fora do computador.</p>
          <div class="codigo-guardar">
            <span class="valor">${codigo}</span>
            <button class="btn btn-neutro btn-p" onClick=${() => copiarE(codigo, avisar, 'Código copiado.',
              'Não deu para copiar. Anote o código antes de fechar esta tela.')}>
              <${Icone} nome="copiar" tam=${14} />Copiar</button>
          </div>` : null}

        ${erro && passo === 'criar' ? html`<div class="aviso aviso-erro">
          <${Icone} nome="alerta" tam=${16} /><span>${erro}</span></div>` : null}

        ${passo !== 'guardar' ? html`
          <p class="silencioso" style="line-height:1.5;border-top:1px solid var(--linha-suave);padding-top:12px">
            Esta senha é uma trava de balcão: ela guarda a tela de quem está no salão. Ela não
            substitui o controle de acesso do servidor, que entra junto com o banco de dados.</p>` : null}
      </div>
    <//>`;
}

/* ── 11.2 AGENDA ──────────────────────────────────────────────────────────
   O item existia no menu e não levava a lugar nenhum. Agora leva: semana
   inteira à vista, marcação com dois cliques e — o que liga a agenda ao
   resto do sistema — a lista de quem já está com revisão vencida esperando
   ser chamado.                                                            */
const chaveDia = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const DIAS_CURTOS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];


const agendamentosDe = (d) => d.agendamentos || [];
const agendaDoDia = (d, chave) => agendamentosDe(d)
  .filter(a => a.data === chave && a.situacao !== 'cancelado')
  .sort((a, b) => String(a.hora).localeCompare(String(b.hora)));

function FormAgendamento({ registro, aoFechar }) {
  const { dados, acoes, avisar } = usar();
  const [f, setF] = useState(() => ({
    data: chaveDia(new Date()), hora: '09:00', nome: '', veiculo: '', servico: '', observacao: '',
    cliente_id: null, veiculo_id: null, ...registro }));
  const [erro, setErro] = useState('');
  const mudar = (k) => (e) => setF(x => ({ ...x, [k]: e.target.value }));

  const salvar = () => {
    if (!f.nome.trim()) { setErro('Escreva pelo menos o nome de quem vem.'); return; }
    if (!f.data) { setErro('Escolha o dia.'); return; }
    if (registro?.id) acoes.editarAgendamento(registro.id, f);
    else acoes.criarAgendamento(f);
    avisar(registro?.id ? 'Agendamento atualizado.' : 'Agendado para ' + fmtData(f.data) + ' às ' + f.hora + '.');
    aoFechar();
  };

  return html`
    <${Modal} titulo=${registro?.id ? 'Editar agendamento' : 'Novo agendamento'} largura=${520} aoFechar=${aoFechar}
      rodape=${html`
        <button class="btn btn-neutro" onClick=${aoFechar}>Cancelar</button>
        <button class="btn btn-primario" onClick=${salvar}><${Icone} nome="check" tam=${15} />Salvar</button>`}>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${erro ? html`<div class="aviso aviso-erro"><${Icone} nome="alerta" tam=${16} /><span>${erro}</span></div>` : null}
        <${Campo} rotulo="Cliente" ajuda="Pode ser alguém que ainda não está cadastrado">
          <input class="entrada" list="lista-clientes-agenda" value=${f.nome} onInput=${mudar('nome')} />
        <//>
        <datalist id="lista-clientes-agenda">
          ${dados.clientes.slice(0, 40).map(c => html`<option key=${c.id} value=${c.nome}></option>`)}
        </datalist>
        <${Campo} rotulo="Veículo" ajuda="Marca, modelo e placa">
          <input class="entrada" value=${f.veiculo} onInput=${mudar('veiculo')} />
        <//>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <${Campo} rotulo="Dia"><input class="entrada" type="date" value=${f.data} onInput=${mudar('data')} /><//>
          <${Campo} rotulo="Hora"><input class="entrada" type="time" value=${f.hora} onInput=${mudar('hora')} /><//>
        </div>
        <${Campo} rotulo="Serviço previsto">
          <input class="entrada" value=${f.servico} onInput=${mudar('servico')}
            placeholder="Revisão, troca de óleo, diagnóstico…" />
        <//>
        <${Campo} rotulo="Observação" ajuda="O que o cliente falou ao marcar">
          <textarea class="entrada" rows="2" value=${f.observacao} onInput=${mudar('observacao')}></textarea>
        <//>
      </div>
    <//>`;
}

function TelaAgenda() {
  const { dados, metricas, acoes, papel, irPara, avisar } = usar();
  const [semana, setSemana] = useState(0);
  const [form, setForm] = useState(null);
  const [aberto, setAberto] = useState(null);
  const podeMexer = pode(papel, 'criar');

  const dias = useMemo(() => {
    const base = new Date(); base.setHours(0, 0, 0, 0);
    base.setDate(base.getDate() - base.getDay() + semana * 7);
    return Array.from({ length: 7 }, (_, i) => { const d = new Date(base); d.setDate(base.getDate() + i); return d; });
  }, [semana]);

  const hojeChave = chaveDia(new Date());
  const naSemana = dias.reduce((s, d) => s + agendaDoDia(dados, chaveDia(d)).length, 0);
  const paraChamar = metricas.preventiva.filter(v => v.vencidos.length).slice(0, 6);
  const jaAgendado = new Set(agendamentosDe(dados).filter(a => a.situacao === 'marcado').map(a => a.veiculo_id).filter(Boolean));

  const agendarVeiculo = (v) => setForm({
    nome: v.cliente?.nome || '', cliente_id: v.cliente?.id || null,
    veiculo: v.marca + ' ' + v.modelo + ' · ' + v.placa, veiculo_id: v.id,
    servico: v.vencidos.map(i => i.servico).slice(0, 2).join(' e '),
    data: chaveDia(new Date()), hora: '09:00', observacao: 'Chamado pela manutenção vencida' });

  return html`
    <div class="entra" style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap">
        <div style="display:flex;align-items:center;gap:8px">
          <button class="btn btn-neutro btn-icone" onClick=${() => setSemana(x => x - 1)} aria-label="Semana anterior">
            <${Icone} nome="seta" tam=${15} cor="currentColor" /></button>
          <span class="rotulo" style="min-width:150px;text-align:center">
            ${semana === 0 ? 'Esta semana' : fmtData(chaveDia(dias[0])) + ' a ' + fmtData(chaveDia(dias[6]))}</span>
          <button class="btn btn-neutro btn-icone" onClick=${() => setSemana(x => x + 1)} aria-label="Próxima semana">
            <${Icone} nome="seta" tam=${15} /></button>
          ${semana !== 0 ? html`<button class="btn btn-fantasma btn-p" onClick=${() => setSemana(0)}>Voltar para hoje</button>` : null}
        </div>
        <div style="display:flex;align-items:center;gap:10px">
          <span class="silencioso">${naSemana} ${naSemana === 1 ? 'horário marcado' : 'horários marcados'}</span>
          ${podeMexer ? html`<button class="btn btn-primario" onClick=${() => setForm({ data: hojeChave })}>
            <${Icone} nome="mais" tam=${15} /><span class="esconde-mobile">Novo agendamento</span></button>` : null}
        </div>
      </div>

      <div class="agenda-semana">
        ${dias.map(d => {
          const chave = chaveDia(d);
          const lista = agendaDoDia(dados, chave);
          const ehHoje = chave === hojeChave;
          return html`
            <div key=${chave} class=${'agenda-dia' + (ehHoje ? ' hoje' : '') + (chave < hojeChave ? ' passado' : '')}>
              <div class="topo-dia">
                <span class="semana">${DIAS_CURTOS[d.getDay()]}</span>
                <span class="numero">${d.getDate()}</span>
              </div>
              <div class="lista">
                ${lista.length === 0
                  ? html`<div class="agenda-vazio">${podeMexer ? 'livre' : '—'}</div>`
                  : lista.map(a => html`
                    <button key=${a.id} class=${'marcacao ' + a.situacao} onClick=${() => setAberto(a)}>
                      <span class="hora">${a.hora}${a.situacao === 'chegou' ? ' · chegou' : ''}</span>
                      <span class="quem corta">${a.nome}</span>
                      ${a.servico ? html`<span class="oque">${a.servico}</span>` : null}
                    </button>`)}
                ${podeMexer ? html`
                  <button class="btn btn-fantasma btn-p" style="justify-content:center;opacity:.7"
                    onClick=${() => setForm({ data: chave, hora: '09:00' })} aria-label=${'Marcar em ' + fmtData(chave)}>
                    <${Icone} nome="mais" tam=${13} /></button>` : null}
              </div>
            </div>`;
        })}
      </div>

      <${Cartao}>
        <div class="cartao-topo"><div>
          <h3>Esperando ser chamado</h3>
          <p class="silencioso">Veículos com manutenção vencida que ainda não têm horário marcado</p>
        </div></div>
        ${paraChamar.length === 0
          ? html`<div class="aviso aviso-ok"><${Icone} nome="check" tam=${16} />
              <span>Ninguém com revisão vencida na fila. A agenda está em dia com a preventiva.</span></div>`
          : html`<div class="linhas-leitura">
              ${paraChamar.map(v => html`
                <div key=${v.id} style="display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid var(--linha-suave)">
                  <span style="flex:1;min-width:0">
                    <b style="display:block;font-size:13.5px">${v.marca} ${v.modelo} · ${v.placa}</b>
                    <span class="silencioso">${v.cliente?.nome || 'sem dono cadastrado'} · vencido: ${v.vencidos.map(i => i.servico).join(', ')}</span>
                  </span>
                  ${jaAgendado.has(v.id)
                    ? html`<${Selo} tom="ok" icone="check">Já marcado<//>`
                    : podeMexer ? html`<button class="btn btn-neutro btn-p" onClick=${() => agendarVeiculo(v)}>
                        <${Icone} nome="calendario" tam=${13} />Agendar</button>` : null}
                </div>`)}
            </div>`}
      <//>

      ${form ? html`<${FormAgendamento} registro=${form} aoFechar=${() => setForm(null)} />` : null}

      ${aberto ? html`
        <${Modal} titulo=${aberto.nome} subtitulo=${fmtData(aberto.data) + ' às ' + aberto.hora}
          largura=${430} aoFechar=${() => setAberto(null)}
          rodape=${html`
            <button class="btn btn-neutro" onClick=${() => setAberto(null)}>Fechar</button>
            ${podeMexer && aberto.situacao === 'marcado' ? html`
              <button class="btn btn-neutro" onClick=${() => { setForm(aberto); setAberto(null); }}>
                <${Icone} nome="lapis" tam=${14} />Editar</button>
              <button class="btn btn-primario" onClick=${() => {
                acoes.editarAgendamento(aberto.id, { situacao: 'chegou' });
                avisar('Chegada registrada. Abra a ordem de serviço quando o carro entrar.');
                setAberto(null); }}>
                <${Icone} nome="check" tam=${15} />Registrar chegada</button>` : null}`}>
          <div style="display:flex;flex-direction:column;gap:10px">
            <${ChaveValor} chave="Veículo" valor=${aberto.veiculo || '—'} />
            <${ChaveValor} chave="Serviço previsto" valor=${aberto.servico || '—'} />
            <${ChaveValor} chave="Situação" valor=${aberto.situacao === 'chegou' ? 'Chegou' : aberto.situacao === 'cancelado' ? 'Cancelado' : 'Marcado'} />
            ${aberto.observacao ? html`<div>
              <div class="rotulo" style="margin-bottom:4px">Observação</div>
              <p class="secundario" style="font-size:13px">${aberto.observacao}</p></div>` : null}
            ${podeMexer && aberto.situacao !== 'cancelado' ? html`
              <button class="btn btn-fantasma btn-p" style="align-self:flex-start;color:var(--erro)"
                onClick=${() => { acoes.editarAgendamento(aberto.id, { situacao: 'cancelado' });
                  avisar('Agendamento cancelado.'); setAberto(null); }}>
                <${Icone} nome="lixo" tam=${14} />Cancelar este horário</button>` : null}
            ${aberto.situacao === 'chegou' ? html`
              <button class="btn btn-neutro btn-p" style="align-self:flex-start"
                onClick=${() => { setAberto(null); irPara('nova'); }}>
                <${Icone} nome="mais" tam=${14} />Abrir ordem de serviço</button>` : null}
          </div>
        <//>` : null}
    </div>`;
}

Object.assign(TELAS_EXTRA, { agenda: () => html`<${TelaAgenda} />` });
Object.assign(TITULOS_EXTRA, {
  agenda: (d) => {
    const hoje = agendaDoDia(d, chaveDia(new Date())).length;
    return ['Agenda', hoje ? hoje + (hoje === 1 ? ' horário marcado para hoje' : ' horários marcados para hoje') : 'Nenhum horário marcado para hoje'];
  },
});
(() => {
  const ag = NAV.find(n => n.id === 'agenda');
  if (ag) delete ag.breve;   /* deixou de ser promessa */
})();

/* ── 11.3 O COPILOTO PASSA A CONVERSAR ────────────────────────────────────
   Quem respondeu "lento" ouviu "não consegui entender esse pedido". Um colega
   entenderia na hora que o movimento estava fraco e ofereceria o que fazer
   com um dia parado. O que faltava não era vocabulário: era o copiloto
   guardar o fio da conversa e nunca terminar uma frase sem devolver alguma
   coisa. Três peças resolvem isso:

     · PAPO      — o que uma pessoa diz e não é comando nem número
     · oferta    — quando ele pergunta "quer que eu…", o "sim" seguinte executa
     · desvio    — sem entender, ele chuta o assunto pelo campo mencionado
                   em vez de encerrar o diálogo                            */

const SIM = /^(sim|s|isso|isso ai|pode|pode ser|quero|manda|manda ver|bora|vamos|claro|com certeza|por favor|faz|faca|mostra|mostre|ok|ta bom|beleza|blz|aham|uhum|positivo)\b/;
const NAO = /^(nao|n|agora nao|depois|deixa|deixa pra la|esquece|nem|negativo)\b/;

const guardarOferta = (r) => { MEMORIA.oferta = r && r.oferta ? r.oferta : null; return r; };

const PAPO = [
  { id: 'movimento_fraco', chaves: ['lento', 'devagar', 'parado', 'fraco', 'vazio', 'sem movimento', 'morto', 'nao veio ninguem', 'caiu o movimento'],
    responder: (ctx) => ({
      resumo: girar([
        'Dia devagar dá para usar a favor: é quando dá tempo de correr atrás de quem já esteve aqui.',
        'Movimento fraco cansa mais que o corrido, eu sei. Mas é a hora de puxar cliente antigo.',
      ]) + ' Tem ' + ctx.m.inativos.length + ' cliente(s) sem aparecer há mais de seis meses e ' +
        ctx.m.preventiva.filter(v => v.vencidos.length).length + ' veículo(s) com revisão vencida.',
      sugestoes: ['Quais clientes precisam de retorno?', 'Quais veículos estão próximos de manutenção?'],
      oferta: { rotulo: 'listar quem chamar hoje',
        executar: (c) => ({
          resumo: 'Começaria por estes, do mais tempo sem aparecer para o menos:',
          linhas: c.m.inativos.slice(0, 5).map(x => ({
            titulo: x.nome, apoio: x.ultima ? 'última visita em ' + fmtData(x.ultima) : 'nunca concluiu serviço aqui',
            valor: fmtTel(x.telefone) })),
          rodape: 'A agenda aceita marcar o horário direto, sem esperar o carro chegar.',
          acao: { rotulo: 'Abrir a agenda', ir: 'agenda' } }) } }) },

  { id: 'movimento_forte', chaves: ['corrido', 'cheio', 'lotado', 'loucura', 'correria', 'movimentado', 'sem parar', 'a mil', 'nao paro'],
    responder: (ctx) => ({
      resumo: girar([
        'Dia cheio é bom sinal, desde que nada fique parado no meio do caminho.',
        'Correria boa é a que sai pela porta. A que preocupa é a que empaca no pátio.',
      ]) + ' Agora tem ' + ctx.m.ativas.length + ' carro(s) na oficina' +
        (ctx.m.travadas.length ? ' e ' + ctx.m.travadas.length + ' parado(s) há seis dias ou mais.' : ' e nenhum travado.'),
      sugestoes: ['O que está travado no pátio?', 'Resumo do dia'],
      oferta: { rotulo: 'mostrar o que está travado',
        executar: (c) => ({
          resumo: c.m.travadas.length ? 'Estes estão parados há mais tempo do que deveriam:' : 'Nada travado agora — o pátio está girando.',
          linhas: c.m.travadas.slice(0, 5).map(o => ({
            titulo: 'OS ' + o.numero + ' · ' + (o.veiculo?.marca || '') + ' ' + (o.veiculo?.modelo || ''),
            apoio: etapaNome(o.etapa), valor: o.dias + ' dias' })),
          acao: { rotulo: 'Abrir o pátio', ir: 'patio' } }) } }) },

  { id: 'cansaco', chaves: ['cansad', 'exaust', 'acabad', 'sem energia', 'estressad', 'nao aguento', 'que dia'],
    responder: () => ({
      resumo: girar([
        'Dia daqueles. Se quiser, eu adianto o que dá para adiantar daqui e você tira o pé.',
        'Entendo. Me passa o que está pesando que eu vejo o que consigo resolver na tela.',
      ]),
      sugestoes: ['Resumo do dia', 'O que precisa de decisão hoje?'] }) },

  { id: 'ruim', chaves: ['ruim', 'pessimo', 'complicado', 'dificil', 'osso', 'tenso', 'problema serio', 'chateado', 'nao foi bom'],
    responder: (ctx) => ({
      resumo: girar([
        'Puxa. Quer olhar junto onde está apertando? Às vezes é uma coisa só puxando o resto.',
        'Me conta o que aconteceu. Se for número, eu levanto; se for carro, a gente investiga.',
      ]),
      sugestoes: ['O que precisa de decisão hoje?', 'Quanto tenho a receber?'] }) },

  { id: 'bom', chaves: ['tranquilo', 'de boa', 'tudo certo', 'otimo', 'muito bom', 'sussa', 'na paz', 'foi bem', 'deu certo'],
    responder: () => ({
      resumo: girar([
        'Boa. Dia que corre liso é o que mantém a oficina em pé.',
        'Que bom. Se aparecer alguma, é só chamar.',
      ]) }) },

  { id: 'meta', chaves: ['voce nao conversa', 'nao conversa', 'so responde', 'voce e limitado', 'nao entende nada',
      'nao entendeu nada', 'fala direito', 'responde direito', 'burro', 'inutil', 'nao serve', 'que ia e essa', 'pessimo assistente'],
    responder: () => ({
      resumo: 'Justo — e prefiro admitir a fingir. Eu sou afiado em três coisas: os números desta base, ' +
        'consulta de cliente, veículo e estoque, e investigar defeito por eliminação. Papo solto ainda é meu ponto fraco, ' +
        'porque penso aqui dentro do navegador, sem modelo de linguagem por trás. Me joga o assunto que eu pego o fio.',
      sugestoes: ['O que você consegue fazer?', 'Resumo do dia', 'Meu carro está falhando'] }) },

  { id: 'e_voce', chaves: ['e voce', 'e vc', 'voce trabalha', 'voce dorme', 'voce cansa', 'voce gosta', 'voce ta bem'],
    responder: () => ({
      resumo: girar([
        'Por aqui, sempre igual: leio a base e fico à disposição. Não canso e não esqueço de nada da conversa.',
        'Eu fico bem enquanto a base estiver de pé. Vamos ao que interessa?',
      ]) }) },

  { id: 'espera', chaves: ['ta ai', 'esta ai', 'alo', 'hein', 'oi?', 'sumiu'],
    responder: () => ({ resumo: girar(['Estou aqui. Pode mandar.', 'Aqui firme. O que precisa?']) }) },

  { id: 'opiniao', chaves: ['o que voce acha', 'na sua opiniao', 'o que voce sugere', 'me da uma ideia', 'o que eu faco'],
    responder: (ctx) => ({
      resumo: ctx.criticos
        ? 'Se fosse eu, começaria pelo que está pegando fogo: tem ' + ctx.criticos + ' ponto(s) crítico(s) em aberto agora.'
        : 'Nada crítico em aberto. Num dia assim eu puxaria os clientes sem retorno e a preventiva vencida — é receita que já está na base, só falta ligar.',
      acao: { rotulo: 'Abrir o centro de controle', ir: 'controle' },
      sugestoes: ['Resumo do dia', 'Quais clientes precisam de retorno?'] }) },

  { id: 'elogio', chaves: ['mandou bem', 'gostei', 'muito bom voce', 'boa essa', 'ajudou'],
    responder: () => ({ resumo: girar(['Fico devendo essa. Precisando, é só chamar.', 'Que bom que serviu.']) }) },

  { id: 'engano', chaves: ['nao e isso', 'nao foi isso', 'errado', 'me confundi', 'digitei errado', 'nao era isso'],
    responder: () => ({
      resumo: 'Sem problema, me corrige. Se disser em outras palavras eu tento de novo — e se for mais fácil, escolhe uma opção abaixo.',
      sugestoes: ['O que você consegue fazer?', 'Resumo do dia'] }) },
];

/* Sem entender, ele não encerra: procura o campo que a frase menciona e
   oferece o caminho mais provável. Encerrar a conversa é o que faz o robô
   parecer robô. */
const DESVIOS = [
  { chaves: ['carro', 'veiculo', 'placa', 'moto', 'caminhonete'], texto: 'algum veículo',
    sugestoes: ['Quem é o dono da placa ABC1D23?', 'Quais veículos estão próximos de manutenção?'] },
  { chaves: ['cliente', 'dono', 'cliente novo', 'telefone', 'contato'], texto: 'algum cliente',
    sugestoes: ['Quais clientes precisam de retorno?', 'Quem são meus melhores clientes?'] },
  { chaves: ['peca', 'estoque', 'oleo', 'filtro', 'pastilha', 'pneu', 'comprar'], texto: 'peça ou estoque',
    sugestoes: ['Quais peças estão acabando?', 'Tem pastilha de freio?'] },
  { chaves: ['dinheiro', 'valor', 'preco', 'pagar', 'receber', 'caixa', 'lucro', 'fatur'], texto: 'dinheiro',
    sugestoes: ['Quanto tenho a receber?', 'Como está o desempenho da oficina este mês?'] },
  { chaves: ['prazo', 'atras', 'demora', 'parado', 'travad', 'patio'], texto: 'o andamento do pátio',
    sugestoes: ['O que está travado no pátio?', 'Resumo do dia'] },
  { chaves: ['barulho', 'ruido', 'defeito', 'problema no', 'nao funciona', 'estranho', 'cheiro'], texto: 'um defeito',
    sugestoes: ['Meu carro está falhando', 'Está esquentando'] },
  { chaves: ['horario', 'agenda', 'marcar', 'agendar', 'amanha', 'semana que vem'], texto: 'agenda',
    sugestoes: ['O que tem na agenda hoje?', 'Abrir agenda'] },
];

/* ── 11.4 FERRAMENTA NOVA: A AGENDA ─────────────────────────────────────── */
FERRAMENTAS.push({
  id: 'consultar_agenda', grava: false,
  chaves: ['agenda', 'agendado', 'marcado para', 'quem vem', 'tem horario', 'que horas vem', 'agendamento'],
  montar: (q, ctx) => {
    const t = normalizar(q);
    const d = new Date();
    if (t.includes('amanha')) d.setDate(d.getDate() + 1);
    const chave = chaveDia(d);
    const lista = agendaDoDia(ctx.dados, chave);
    const quando = t.includes('amanha') ? 'amanhã' : 'hoje';
    if (!lista.length) return { resposta: {
      resumo: 'Não tem ninguém marcado para ' + quando + '. Quer abrir a agenda para marcar?',
      acao: { rotulo: 'Abrir a agenda', ir: 'agenda' },
      oferta: { rotulo: 'abrir a agenda', executar: () => ({ resumo: 'Abrindo a agenda.', acao: { rotulo: 'Ir para a agenda', ir: 'agenda' } }) } } };
    return { resposta: {
      resumo: quando === 'hoje' ? 'Marcados para hoje:' : 'Marcados para amanhã:',
      linhas: lista.map(a => ({ titulo: a.nome, apoio: (a.veiculo || '') + (a.servico ? ' · ' + a.servico : ''), valor: a.hora })),
      acao: { rotulo: 'Abrir a agenda', ir: 'agenda' } } };
  },
});

/* ══════════════════════════════════════════════════════════════════════════
   FASE 12 — ENDURECIMENTO
   Varredura antes do banco. O que muda aqui não é funcionalidade: é o que
   acontece quando a entrada não é a esperada. Vale dizer com todas as letras
   o limite desta camada: enquanto o sistema roda inteiro no navegador, tudo
   que está deste lado é redução de superfície, não controle de acesso. Papel,
   senha do cofre e token de link só viram proteção de verdade quando o
   servidor recusar o pedido — a lista do que precisa ser refeito lá está no
   comentário do fim deste bloco.
   ══════════════════════════════════════════════════════════════════════════ */

/* Imagem que veio de fora só entra na tela se realmente for imagem. Vale para
   o logotipo enviado, para o anexo e para as fotos que chegam dentro do link
   do cliente. `data:text/html` num <img> não executa em navegador atual, mas
   deixar passar é confiar na boa vontade do próximo navegador. */
const imagemSegura = (url) => {
  const t = String(url == null ? '' : url);
  if (t.length > 3 * 1024 * 1024) return '';
  /* AUDITORIA: `svg+xml` saiu da lista. SVG não é imagem, é documento XML
     que aceita <script> e onload. Dentro de <img> o navegador atual não
     executa, mas basta o arquivo ser aberto em aba própria, virar logotipo
     embutido ou o próximo navegador afrouxar a regra para virar XSS com o
     domínio da oficina. Formato de foto não precisa de SVG.               */
  return /^data:image\/(png|jpeg|jpg|gif|webp|avif|bmp);base64,[A-Za-z0-9+/=]+$/i.test(t) ? t : '';
};

/* Chave que mexe na cadeia de protótipos não tem por que existir num backup
   nem num pacote de portal. Some antes de qualquer cópia. */
const CHAVES_PROIBIDAS = ['__proto__', 'constructor', 'prototype'];

/** Copia o valor mantendo a forma, mas com teto de profundidade, de tamanho
    de lista e de texto, e sem as chaves proibidas. */
function higienizar(valor, nivel = 0) {
  if (nivel > 8) return null;
  if (Array.isArray(valor)) return valor.slice(0, 400).map(x => higienizar(x, nivel + 1));
  if (valor && typeof valor === 'object') {
    const saida = {};
    Object.keys(valor).slice(0, 120).forEach(k => {
      if (CHAVES_PROIBIDAS.includes(k)) return;
      saida[k] = (k === 'url' || k === 'logo') ? imagemSegura(valor[k]) : higienizar(valor[k], nivel + 1);
    });
    return saida;
  }
  if (typeof valor === 'string') return valor.slice(0, 5000);
  if (typeof valor === 'number') return isFinite(valor) ? valor : 0;
  return valor;
}

/** Varre um objeto atrás de chave proibida sem copiar nada. */
function temChaveProibida(valor, nivel = 0) {
  if (nivel > 8 || !valor || typeof valor !== 'object') return false;
  if (Array.isArray(valor)) return valor.slice(0, 500).some(x => temChaveProibida(x, nivel + 1));
  return Object.keys(valor).some(k => CHAVES_PROIBIDAS.includes(k) || temChaveProibida(valor[k], nivel + 1));
}

/* ── O QUE FICA PARA O SERVIDOR ────────────────────────────────────────────
   Nada abaixo é implementável sem banco, e nenhum atalho daqui substitui:

   1. Permissão por papel precisa ser refeita em RLS no Postgres. O que este
      arquivo faz é esconder botão; quem chamar a API direto não passa por ele.
   2. A senha da área financeira precisa virar autenticação de verdade, com
      hash lento (bcrypt/argon2) no servidor. O embaralhamento local existe
      para o backup não guardar o PIN legível, e um PIN de quatro dígitos cai
      em milissegundos para quem tiver o arquivo.
   3. Token do link do cliente precisa nascer no servidor, com validade e com
      possibilidade de revogar. Aqui ele é sorteado no navegador.
   4. Restaurar backup precisa exigir reautenticação — é a operação que
      sobrescreve tudo, inclusive a própria senha guardada.
   5. Limite de tentativas precisa ser por conta e por IP, no servidor. O que
      existe aqui atrasa quem está no teclado, e só.
   6. Cabeçalhos HTTP no servidor: X-Frame-Options: DENY (ou frame-ancestors),
      X-Content-Type-Options: nosniff, HSTS e a mesma CSP do <head>.        */

/* ══════════════════════════════════════════════════════════════════════════
   NUVEM — camada de dados
   ══════════════════════════════════════════════════════════════════════════
   O aplicativo continua trabalhando sobre um objeto `dados` em memória, como
   sempre trabalhou. Esta camada faz três coisas e só três:

     1. carrega o banco para dentro desse objeto ao entrar;
     2. compara o objeto antes e depois de cada ação e manda ao banco só o
        que mudou;
     3. sobe arquivo para o Storage e guarda o caminho, nunca o binário.

   A escolha por comparação em vez de gravar em cada ação é deliberada: são
   mais de cinquenta ações no arquivo e uma que esquecesse de gravar seria um
   registro perdido que ninguém notaria até o cliente cobrar. Comparando, o
   que a tela mostra e o que o banco tem são a mesma coisa por construção.
   ══════════════════════════════════════════════════════════════════════════ */

const NUVEM_TABELAS = ['clientes','veiculos','pecas','ordens','itens','eventos',
  'lancamentos','automacoes','tarefas','modelosMensagem','anexos','agendamentos','usuarios'];

/* ─── FASE 13 · O DONO DA LINHA ────────────────────────────────────────────
   Toda tabela do banco tem `oficina_id uuid not null` e a política de escrita
   confere `with check (oficina_id = app.oficina_atual())`. O sistema nunca
   mandava essa coluna: toda inserção voltava 400, a fila tratava 400 como
   erro definitivo e descartava a tarefa. O topo dizia "Salvo" e o registro
   não existia — a ordem de serviço inteira sumia entre a tela e o servidor.

   O identificador chega no `meu_contexto` da carga inicial e fica aqui, num
   lugar só, porque a fila roda fora de qualquer componente e não teria como
   ler o estado da tela. */
let OFICINA_ID = null;
const definirOficinaAtual = (id) => { OFICINA_ID = id || null; };

/* AUDITORIA (Rick Auto): a oficina configurou `proxima_os = 2760` para o
   histórico em papel continuar batendo. Mas o sistema calculava o número com
   `Math.max(ordens) + 1` sobre o que estava na TELA, e numa base recém-criada
   a tela está vazia — a primeira ordem sairia como número 1, jogando fora a
   continuidade que alguém configurou de propósito. O contador só existe no
   banco, na tabela `numerador`, que o cliente não lia. */
let PROXIMA_OS_SERVIDOR = 0;
/* AUDITORIA (fase 16): a leitura do contador falhava calada. Se o usuário do
   Auth não estiver mapeado em `public.usuarios`, `app.oficina_atual()` devolve
   nulo, a função entrega 1 e a primeira ordem da oficina sai numerada como 1
   em vez de continuar a sequência do papel. Agora o estado fica registrado e
   a tela avisa na hora de abrir a ordem — não depois, no fechamento do caixa. */
let PROXIMA_OS_LIDA = false;
const definirProximaOS = (n) => {
  PROXIMA_OS_SERVIDOR = Number(n) > 0 ? Number(n) : 0;
  PROXIMA_OS_LIDA = PROXIMA_OS_SERVIDOR > 0;
};

/* `oficinas` é a própria dona (o tenant dela é o `id`); o resto carrega a
   coluna. Nenhuma outra tabela sincronizada fica de fora. */
const SEM_TENANT = new Set(['oficina']);

/* Coluna uuid não aceita 'CS'. A lista de mecânicos de demonstração usava
   iniciais como identificador e elas viajavam para `mecanico_id`, derrubando
   a ordem por sintaxe inválida mesmo depois do tenant resolvido. */
const ehUUID = (v) => typeof v === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

/* Nome na tela → nome no banco. */
const TABELA_BANCO = {
  clientes:'clientes', veiculos:'veiculos', pecas:'pecas', ordens:'ordens',
  itens:'itens', eventos:'eventos', lancamentos:'lancamentos',
  automacoes:'automacoes', tarefas:'tarefas', modelosMensagem:'modelos_mensagem',
  anexos:'anexos', agendamentos:'agendamentos', usuarios:'usuarios',
};

/* Tabelas que NÃO têm lixeira. `eventos` é registro de linha do tempo:
   só cresce, nunca some, e não tem coluna `excluido_em`. Filtrar por ela
   derrubava a carga inteira com "column eventos.excluido_em does not
   exist" — e o sistema não abria.
   Encontrado no primeiro acesso real, porque o servidor de teste respondia
   a qualquer consulta sem conferir se as colunas existiam. */
const SEM_LIXEIRA = new Set(['eventos']);

/* Campos que existem só na tela e não podem viajar para o banco: mandar um
   deles derruba a requisição inteira com "column does not exist" e a gravação
   some sem aviso. */
const CAMPOS_LOCAIS = {
  ordens: ['mecanico','itens','cliente','veiculo','totais'],
  /* AUDITORIA: `hash_sha256` era calculado e enviado, mas a tabela `anexos`
     não tem essa coluna. O binário subia para o Storage e a linha do banco
     voltava 400 — a foto ficava no servidor sem nenhum registro apontando
     para ela. Nenhum anexo aparecia na tela depois de recarregar, e o
     armazenamento enchia de arquivo órfão. A impressão continua servindo
     para conferir duplicata dentro da sessão; só não viaja. */
  anexos: ['url','hash_sha256','arquivo'],
  usuarios: ['senha'],
  itens: ['total','custo_total'],   // colunas geradas: o banco calcula
  pecas: ['valor_parado'],
};

/* ─── FASE 17 · COLUNA QUE O BANCO NÃO TEM ─────────────────────────────────
   Este arquivo já perdeu registro por isso três vezes — `hash_sha256` em
   anexos, `excluido_em` em eventos, `oficina_id` em tudo. O padrão é sempre o
   mesmo: a tela manda um campo que a tabela não tem, o PostgREST devolve 400
   com `PGRST204`, a fila trata 400 como erro definitivo e joga a linha fora.
   O topo diz "Salvo" e o registro não existe.

   `CAMPOS_LOCAIS` só protege contra o que alguém lembrou de listar. Isto
   protege contra o que ninguém lembrou: a coluna recusada é lida da própria
   mensagem do servidor, anotada, e a gravação é refeita sem ela. A anotação
   sobrevive ao recarregamento, então o segundo item da mesma ordem já sai
   certo na primeira tentativa.                                            */
const CHAVE_COLUNAS = 'nitro.colunas-ausentes';
let COLUNAS_AUSENTES = {};

const lerColunasAusentes = () => {
  const guardado = memoria.ler(CHAVE_COLUNAS);
  COLUNAS_AUSENTES = (guardado && typeof guardado === 'object') ? guardado : {};
  return COLUNAS_AUSENTES;
};
const anotarColunaAusente = (tabela, coluna) => {
  if (!tabela || !coluna) return false;
  const atual = COLUNAS_AUSENTES[tabela] || [];
  if (atual.includes(coluna)) return false;
  COLUNAS_AUSENTES = { ...COLUNAS_AUSENTES, [tabela]: [...atual, coluna] };
  memoria.gravar(CHAVE_COLUNAS, COLUNAS_AUSENTES);
  console.warn('[nitro] coluna ausente em ' + tabela + ': ' + coluna + ' — removida das próximas gravações.');
  return true;
};

/** Nome da coluna dentro da recusa do PostgREST, nas formas que ele usa. */
function colunaRecusada(erro) {
  const bruto = erro?.bruto || {};
  const texto = [bruto.message, bruto.details, bruto.hint, erro?.message].filter(Boolean).join(' ');
  const padroes = [
    /column ["']?([a-z0-9_]+)["']? of relation/i,
    /could not find the ["']?([a-z0-9_]+)["']? column/i,
    /column ["']?[a-z0-9_]+\.([a-z0-9_]+)["']? does not exist/i,
    /column ["']?([a-z0-9_]+)["']? does not exist/i,
  ];
  for (const p of padroes) { const m = texto.match(p); if (m) return m[1]; }
  return null;
}

const semLocais = (tabela, linha) => {
  const fora = [...(CAMPOS_LOCAIS[tabela] || []), ...(COLUNAS_AUSENTES[TABELA_BANCO[tabela] || tabela] || [])];
  const saida = {};
  Object.keys(linha).forEach(k => { if (!fora.includes(k)) saida[k] = linha[k]; });
  return saida;
};

/* ─── Cliente HTTP ─────────────────────────────────────────────────────────
   PostgREST direto, sem a biblioteca oficial: são quatro verbos e evitar
   mais 40 KB de download num arquivo único vale o trabalho. */
function criarNuvem(url, chave) {
  const base = String(url || '').replace(/\/+$/, '');
  let sessao = null;
  const ouvintes = new Set();
  const avisarEstado = (e) => ouvintes.forEach(f => { try { f(e); } catch (_) {} });

  const cabecalho = (extra = {}) => ({
    'apikey': chave,
    'Authorization': 'Bearer ' + (sessao?.access_token || chave),
    'Content-Type': 'application/json',
    ...extra,
  });

  /* Erro de banco vira frase de balcão. "duplicate key value violates unique
     constraint clientes_doc_unq" não diz nada a quem está atendendo. */
  const traduzir = (e) => {
    const t = String(e?.message || e?.msg || e || '');
    const d = String(e?.details || '') + ' ' + String(e?.hint || '');
    if (/clientes_doc_unq/.test(t + d))     return 'Já existe um cliente com este CPF ou CNPJ.';
    if (/veiculos_placa_unq/.test(t + d))   return 'Esta placa já está cadastrada nesta oficina.';
    if (/pecas_codigo_unq/.test(t + d))     return 'Já existe uma peça com este código.';
    if (/usuarios_email_unq/.test(t + d))   return 'Este e-mail já tem acesso ao sistema.';
    if (/documento_valido|documento_check/.test(t + d)) return 'CPF ou CNPJ inválido: confira os dígitos.';
    if (/placa_valida|placa_check/.test(t + d))  return 'Placa fora do padrão brasileiro.';
    if (/datas_ok/.test(t + d))             return 'As datas da ordem estão fora de ordem.';
    if (/lanc_baixa_ok/.test(t + d))        return 'Título marcado como pago precisa ter data de baixa.';
    if (/quantidade.*check|itens_quantidade/.test(t + d)) return 'A quantidade precisa ser maior que zero.';
    if (/em uso|foreign key|23503/.test(t + d)) return 'Este registro está em uso e não pode ser excluído.';
    if (/row-level security|42501|permission denied|insufficient/.test(t + d))
      return 'Seu perfil não tem permissão para esta operação.';
    if (/JWT|token is expired|invalid claim/i.test(t))
      return 'Sua sessão expirou. Entre novamente.';
    if (/Failed to fetch|NetworkError|network/i.test(t))
      return 'Sem conexão com o servidor. As alterações ficam guardadas e sobem sozinhas.';
    return t || 'Não foi possível concluir a operação.';
  };

  async function chamar(caminho, opcoes = {}, tentativa = 0) {
    let r;
    try {
      r = await fetch(base + caminho, { ...opcoes, headers: cabecalho(opcoes.headers) });
    } catch (rede) {
      /* Falha de rede é temporária por definição: três tentativas com espera
         crescente antes de desistir e devolver ao usuário. */
      if (tentativa < 3) {
        await new Promise(s => setTimeout(s, 400 * Math.pow(2, tentativa)));
        return chamar(caminho, opcoes, tentativa + 1);
      }
      throw new Error(traduzir(rede));
    }
    if (r.status === 401 && sessao?.refresh_token && tentativa < 1) {
      await renovar();
      return chamar(caminho, opcoes, tentativa + 1);
    }
    if (!r.ok) {
      let corpo = {};
      try { corpo = await r.json(); } catch (_) { corpo = { message: await r.text().catch(() => '') }; }
      const erro = new Error(traduzir(corpo));
      erro.bruto = corpo; erro.status = r.status;
      throw erro;
    }
    if (r.status === 204) return null;
    const texto = await r.text();
    return texto ? JSON.parse(texto) : null;
  }

  /* ─── Autenticação ─────────────────────────────────────────────────────── */
  async function entrar(email, senha) {
    const r = await fetch(base + '/auth/v1/token?grant_type=password', {
      method: 'POST',
      headers: { 'apikey': chave, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: String(email || '').trim().toLowerCase(), password: senha }),
    });
    const corpo = await r.json().catch(() => ({}));
    if (!r.ok) {
      const m = String(corpo.error_description || corpo.msg || '');
      if (/Invalid login/i.test(m)) throw new Error('E-mail ou senha incorretos.');
      if (/Email not confirmed/i.test(m)) throw new Error('Confirme o e-mail antes de entrar.');
      throw new Error(m || 'Não foi possível entrar.');
    }
    guardarSessao(corpo);
    return corpo;
  }

  async function cadastrar(email, senha, nome) {
    const r = await fetch(base + '/auth/v1/signup', {
      method: 'POST',
      headers: { 'apikey': chave, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: String(email || '').trim().toLowerCase(), password: senha,
                             data: { nome: nome || '' } }),
    });
    const corpo = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(corpo.msg || corpo.error_description || 'Não foi possível criar o acesso.');
    if (corpo.access_token) guardarSessao(corpo);
    return corpo;
  }

  async function recuperarSenha(email) {
    await fetch(base + '/auth/v1/recover', {
      method: 'POST',
      headers: { 'apikey': chave, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: String(email || '').trim().toLowerCase() }),
    });
    /* Resposta sempre igual, exista ou não a conta: dizer "e-mail não
       cadastrado" entrega a lista de quem tem acesso a quem perguntar. */
    return true;
  }

  async function renovar() {
    if (!sessao?.refresh_token) return null;
    const r = await fetch(base + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      headers: { 'apikey': chave, 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: sessao.refresh_token }),
    });
    if (!r.ok) { sair(); return null; }
    guardarSessao(await r.json());
    return sessao;
  }

  function guardarSessao(s) {
    if (!s?.access_token) return;
    sessao = { ...s, expira_em: Date.now() + (Number(s.expires_in) || 3600) * 1000 };
    memoria.gravar('nitro.sessao', sessao);
    /* Renova sozinho um minuto antes de vencer. Sem isso a primeira gravação
       depois de uma hora parada falhava com 401 e o usuário perdia o que
       tinha acabado de digitar. */
    clearTimeout(guardarSessao.t);
    const daqui = Math.max(5000, (Number(s.expires_in) || 3600) * 1000 - 60000);
    guardarSessao.t = setTimeout(() => renovar(), daqui);
    avisarEstado({ tipo: 'sessao', sessao });
  }

  function sair() {
    clearTimeout(guardarSessao.t);
    if (sessao?.access_token) {
      fetch(base + '/auth/v1/logout', { method: 'POST', headers: cabecalho() }).catch(() => {});
    }
    sessao = null;
    memoria.apagar('nitro.sessao');
    avisarEstado({ tipo: 'sessao', sessao: null });
  }

  function retomar() {
    const s = memoria.ler('nitro.sessao');
    if (s?.access_token && s.expira_em > Date.now() + 30000) { sessao = s; guardarSessao(s); return true; }
    if (s?.refresh_token) { sessao = s; renovar(); return true; }
    return false;
  }

  /* ─── Consulta e escrita ───────────────────────────────────────────────── */
  const rpc = (nome, args = {}) => chamar('/rest/v1/rpc/' + nome, {
    method: 'POST', body: JSON.stringify(args) });

  const ler = (tabela, consulta = '') =>
    chamar('/rest/v1/' + tabela + '?' + (consulta || 'select=*'));

  const inserir = (tabela, linhas) => chamar('/rest/v1/' + tabela, {
    method: 'POST',
    headers: { 'Prefer': 'return=representation,resolution=merge-duplicates' },
    body: JSON.stringify(linhas) });

  const alterar = (tabela, id, campos) => chamar(
    '/rest/v1/' + tabela + '?id=eq.' + encodeURIComponent(id), {
    method: 'PATCH', headers: { 'Prefer': 'return=representation' },
    body: JSON.stringify(campos) });

  /* Excluir é marcar. Não existe DELETE concedido no banco — de propósito. */
  const excluir = (tabela, id) => alterar(tabela, id, { excluido_em: new Date().toISOString() });

  /* ─── Storage ──────────────────────────────────────────────────────────── */
  const extensaoDe = (formato, nome) => {
    const m = { 'image/jpeg':'jpg', 'image/png':'png', 'image/webp':'webp', 'image/gif':'gif',
                'image/heic':'heic', 'image/avif':'avif', 'application/pdf':'pdf' };
    return m[formato] || (String(nome).match(/\.([a-z0-9]{2,5})$/i)?.[1] || 'bin').toLowerCase();
  };

  /* SHA-256 do conteúdo: é o que permite ao banco recusar o mesmo arquivo
     enviado duas vezes pelo clique duplo do balcão. */
  async function impressao(arquivo) {
    try {
      const buf = await arquivo.arrayBuffer();
      const h = await crypto.subtle.digest('SHA-256', buf);
      return [...new Uint8Array(h)].map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (_) { return null; }
  }

  async function enviarArquivo(arquivo, oficinaId, balde = 'anexos') {
    const agora = new Date();
    const caminho = [oficinaId, agora.getFullYear(),
      String(agora.getMonth() + 1).padStart(2, '0'),
      crypto.randomUUID() + '.' + extensaoDe(arquivo.type, arquivo.name)].join('/');

    const r = await fetch(base + '/storage/v1/object/' + balde + '/' + caminho, {
      method: 'POST',
      headers: { 'apikey': chave, 'Authorization': 'Bearer ' + (sessao?.access_token || chave),
                 'Content-Type': arquivo.type || 'application/octet-stream',
                 'x-upsert': 'false' },
      body: arquivo,
    });
    if (!r.ok) {
      const c = await r.json().catch(() => ({}));
      throw new Error(traduzir(c));
    }
    return { caminho, hash: await impressao(arquivo) };
  }

  /* URL assinada, com validade. O balde é privado: link permanente para foto
     de documento de cliente é vazamento com data marcada. */
  const cacheUrl = new Map();
  async function urlAssinada(caminho, segundos = 3600) {
    if (!caminho) return '';
    const guardado = cacheUrl.get(caminho);
    if (guardado && guardado.ate > Date.now()) return guardado.url;
    try {
      const r = await chamar('/storage/v1/object/sign/anexos/' + caminho, {
        method: 'POST', body: JSON.stringify({ expiresIn: segundos }) });
      const url = base + '/storage/v1' + r.signedURL;
      cacheUrl.set(caminho, { url, ate: Date.now() + (segundos - 120) * 1000 });
      return url;
    } catch (_) { return ''; }
  }

  /* Assinatura em lote: uma oficina com 300 fotos fazia 300 requisições ao
     abrir a galeria. O Storage assina todas de uma vez. */
  async function urlsAssinadas(caminhos, segundos = 3600) {
    const faltando = [...new Set(caminhos.filter(c => c && !(cacheUrl.get(c)?.ate > Date.now())))];
    for (let i = 0; i < faltando.length; i += 100) {
      const lote = faltando.slice(i, i + 100);
      try {
        const r = await chamar('/storage/v1/object/sign/anexos', {
          method: 'POST', body: JSON.stringify({ expiresIn: segundos, paths: lote }) });
        (r || []).forEach(x => {
          if (x.signedURL) cacheUrl.set(x.path,
            { url: base + '/storage/v1' + x.signedURL, ate: Date.now() + (segundos - 120) * 1000 });
        });
      } catch (_) { /* segue: a miniatura aparece como documento */ }
    }
    const saida = {};
    caminhos.forEach(c => { if (c && cacheUrl.get(c)) saida[c] = cacheUrl.get(c).url; });
    return saida;
  }

  async function apagarArquivo(caminho) {
    if (!caminho) return;
    try {
      await chamar('/storage/v1/object/anexos/' + caminho, { method: 'DELETE' });
      cacheUrl.delete(caminho);
    } catch (_) { /* a linha já foi para a lixeira; o binário some na faxina */ }
  }

  return { entrar, cadastrar, recuperarSenha, sair, retomar, renovar,
           rpc, ler, inserir, alterar, excluir,
           enviarArquivo, urlAssinada, urlsAssinadas, apagarArquivo,
           traduzir, aoMudar: (f) => { ouvintes.add(f); return () => ouvintes.delete(f); },
           get sessao() { return sessao; },
           get autenticado() { return Boolean(sessao?.access_token); } };
}

/* ─── Guarda-chuva do armazenamento local ──────────────────────────────────
   Modo anônimo e navegador com cookie bloqueado derrubam o localStorage com
   exceção. Nada aqui pode derrubar a aplicação: sem armazenamento o sistema
   funciona, só não lembra a sessão entre abas. */
const memoria = (() => {
  let disponivel = true;
  try { window.localStorage.setItem('_t', '1'); window.localStorage.removeItem('_t'); }
  catch (_) { disponivel = false; }
  const espelho = new Map();
  return {
    disponivel,
    ler(chave) {
      try { return disponivel ? JSON.parse(window.localStorage.getItem(chave) || 'null') : (espelho.get(chave) ?? null); }
      catch (_) { return null; }
    },
    gravar(chave, valor) {
      try { disponivel ? window.localStorage.setItem(chave, JSON.stringify(valor)) : espelho.set(chave, valor); }
      catch (_) { espelho.set(chave, valor); }
    },
    apagar(chave) {
      try { disponivel ? window.localStorage.removeItem(chave) : espelho.delete(chave); } catch (_) {}
    },
  };
})();

/* ══════════════════════════════════════════════════════════════════════════
   CARGA
   ══════════════════════════════════════════════════════════════════════════ */
async function carregarDoBanco(nuvem) {
  const contexto = await nuvem.rpc('meu_contexto');
  if (!contexto) throw new Error('Sua conta ainda não está vinculada a uma oficina. Peça ao dono para liberar o acesso.');

  /* Todas as tabelas de uma vez. Em série, a abertura levava o número de
     tabelas vezes a latência — quatorze idas ao servidor antes da primeira
     tela aparecer. */
  const pedidos = NUVEM_TABELAS.map(async (t) => {
    const banco = TABELA_BANCO[t];
    const ordem = ({ ordens:'numero.desc', clientes:'nome.asc', pecas:'codigo.asc',
                     lancamentos:'vencimento.asc', agendamentos:'data.asc',
                     eventos:'criado_em.asc', anexos:'criado_em.desc' })[t] || 'criado_em.desc';
    /* `excluido_em=is.null` é obrigatório onde a coluna existe: sem ele a
       lixeira aparece na tela como se nada tivesse sido excluído. Onde ela
       não existe, o filtro derruba a requisição. */
    const filtro = 'select=*'
      + (SEM_LIXEIRA.has(t) ? '' : '&excluido_em=is.null')
      + '&order=' + ordem + '&limit=20000';
    try { return [t, await nuvem.ler(banco, filtro)]; }
    catch (e) {
      /* Uma tabela sem permissão (o mecânico e o financeiro) não pode impedir
         o sistema de abrir. Ela vem vazia e a tela dela some do menu. */
      if (e.status === 401 || e.status === 403 || /permiss/i.test(e.message)) return [t, []];
      throw e;
    }
  });

  const partes = Object.fromEntries(await Promise.all(pedidos));
  const auditoria = await nuvem.ler('auditoria', 'select=*&order=criado_em.desc&limit=500').catch(() => []);
  const backups = await nuvem.ler('backups',
    'select=id,tipo,autor,total,bytes,soma,registros,criado_em&order=criado_em.desc&limit=12').catch(() => []);

  const usuarios = partes.usuarios || [];
  const porId = new Map(usuarios.map(u => [u.id, u]));

  return {
    ...partes,
    /* A tela lê `mecanico` como identificador simples; o banco guarda
       `mecanico_id`. A tradução acontece aqui, num lugar só. */
    ordens: (partes.ordens || []).map(o => ({ ...o, mecanico: o.mecanico_id,
      mecanico_nome: porId.get(o.mecanico_id)?.nome || '' })),
    /* `select=*` devolve a coluna como o PostgREST a serializa, e coluna
       `numeric` chega como texto em parte das instalações. Comparar texto com
       texto reordena o estoque inteiro: '10' <= '2' é verdadeiro. Normaliza
       aqui, antes de qualquer leitura. Como esta linha é a mesma que vai para
       `refUltimoSync`, a comparação de sincronização não enxerga diferença
       nenhuma e nada extra é gravado no servidor. */
    pecas: normalizarPecas(partes.pecas),
    modelosMensagem: partes.modelosMensagem || [],
    auditoria: (auditoria || []).map(a => ({ ...a, criado_em: a.criado_em })),
    backups: backups || [],
    /* FASE 17: o `id` da oficina é o que autoriza a gravação da própria linha
       em `diferenca` — sem ele, mudar nome, telefone, endereço ou logotipo em
       Ajustes ficava só na tela e voltava ao antigo no recarregamento. Era o
       defeito por trás de "o contato errado continua aparecendo para o
       cliente": a correção era feita e nunca chegava ao servidor.

       `meu_contexto` pode devolver o identificador em três lugares conforme a
       versão instalada da função. Aceitar os três é mais barato que descobrir
       qual delas está no ar. */
    oficina: { ...OFICINA_PADRAO, ...(contexto.oficina || {}),
               id: contexto.oficina?.id || contexto.oficina_id || contexto.id || null,
               cor: contexto.oficina?.cor || OFICINA_PADRAO.cor,
               corBarra: contexto.oficina?.cor_barra || OFICINA_PADRAO.corBarra,
               cofre: contexto.tem_cofre ? { servidor: true } : null },
    contexto,
    lidos: [],
  };
}

/* ══════════════════════════════════════════════════════════════════════════
   SINCRONIZAÇÃO POR COMPARAÇÃO
   Compara o estado anterior com o novo e manda ao banco só a diferença.
   ══════════════════════════════════════════════════════════════════════════ */
const IGNORAR_NA_COMPARACAO = new Set(['atualizado_em','criado_em','mecanico_nome','contexto']);

function diferenca(antes, depois) {
  const tarefas = [];
  for (const tela of NUVEM_TABELAS) {
    const a = antes?.[tela] || [];
    const d = depois?.[tela] || [];
    if (a === d) continue;                       // mesma referência: nada mudou
    const banco = TABELA_BANCO[tela];
    const mapaA = new Map(a.map(x => [x.id, x]));
    const mapaD = new Map(d.map(x => [x.id, x]));

    for (const [id, linha] of mapaD) {
      const anterior = mapaA.get(id);
      if (!anterior) { tarefas.push({ op:'inserir', tela, banco, id, linha }); continue; }
      if (anterior === linha) continue;
      const campos = {};
      for (const k of Object.keys(linha)) {
        if (IGNORAR_NA_COMPARACAO.has(k)) continue;
        if (JSON.stringify(anterior[k]) !== JSON.stringify(linha[k])) campos[k] = linha[k];
      }
      if (Object.keys(campos).length) tarefas.push({ op:'alterar', tela, banco, id, campos });
    }
    /* Sumiu da lista = foi excluído na tela. Vira soft delete no banco: o
       registro continua existindo e volta pela lixeira. */
    for (const [id] of mapaA) if (!mapaD.has(id)) tarefas.push({ op:'excluir', tela, banco, id });
  }

  /* A oficina não é lista: é uma linha só, e mora fora do laço acima. Sem
     este trecho, trocar cor, logotipo ou telefone não chegava ao banco. */
  const oa = antes?.oficina, od = depois?.oficina;
  if (oa && od && oa !== od) {
    const campos = {};
    const mapa = { nome:'nome', documento:'documento', telefone:'telefone', email:'email',
                   endereco:'endereco', cor:'cor', corBarra:'cor_barra', modulos:'modulos',
                   logo_caminho:'logo_caminho' };
    for (const [tela, banco] of Object.entries(mapa)) {
      if (JSON.stringify(oa[tela]) !== JSON.stringify(od[tela])) campos[banco] = od[tela];
    }
    /* O identificador vem do contexto; onde ele faltar, vale o que a fila já
       usa como dono das linhas — é a mesma oficina, lida de outro lugar. */
    const idOficina = od.id || OFICINA_ID;
    if (Object.keys(campos).length) {
      if (idOficina) {
        tarefas.push({ op:'alterar', tela:'oficina', banco:'oficinas', id: idOficina, campos });
      } else {
        /* FASE 17: aqui a alteração era descartada sem uma linha sequer no
           console. A pessoa corrigia o telefone que sai no orçamento, via o
           novo na tela, e o cliente continuava recebendo o antigo. Agora a
           tarefa vai à fila mesmo assim e falha alto, na faixa de aviso. */
        tarefas.push({ op:'alterar', tela:'oficina', banco:'oficinas', id: '—', campos });
      }
    }
  }
  return tarefas;
}

/* Fila com repetição. Escrita que falha por rede não pode sumir: fica aqui,
   sobe quando a conexão voltar, e o rodapé mostra quantas estão pendentes. */
/* Colunas de vínculo. As opcionais aceitam nulo por desenho — item avulso não
   tem peça de catálogo, agendamento de quem ligou não tem cadastro ainda. As
   obrigatórias não: sem elas o registro não pertence a nada. */
const VINCULOS_OPCIONAIS = ['peca_id', 'mecanico_id', 'usuario_id'];
const VINCULOS_OBRIGATORIOS = {
  itens: ['os_id'],
  veiculos: ['cliente_id'],
  ordens: ['cliente_id', 'veiculo_id'],
};

/* De quem esta linha depende. Serve para não gastar cinco tentativas e uma
   mensagem de chave estrangeira em cada filho quando o pai já foi recusado —
   e para a mensagem dizer o que realmente aconteceu. */
function paisDaLinha(tela, linha) {
  if (!linha) return [];
  const p = [];
  if (tela === 'itens' || tela === 'lancamentos') p.push(linha.os_id);
  if (tela === 'ordens') { p.push(linha.cliente_id); p.push(linha.veiculo_id); }
  if (tela === 'veiculos') p.push(linha.cliente_id);
  if (tela === 'anexos') { p.push(linha.os_id); p.push(linha.veiculo_id); p.push(linha.cliente_id); }
  if (tela === 'agendamentos') { p.push(linha.cliente_id); p.push(linha.veiculo_id); }
  return p.filter(Boolean);
}

function criarFila(nuvem, aoMudarEstado) {
  let pendentes = memoria.ler('nitro.fila') || [];
  let recusadas = memoria.ler('nitro.recusadas') || [];
  let rodando = false;
  let ultimoErro = null;
  /* Quem foi recusado nesta sessão. Filho de linha recusada não vai ao
     servidor: iria bater em chave estrangeira e voltar com um erro que não
     explica nada a quem está no balcão. */
  const idsRecusados = new Set((recusadas || []).map(r => r.id).filter(Boolean));
  /* O que foi inserido e ainda não foi conferido de volta. */
  let aConferir = [];

  lerColunasAusentes();

  const guardar = () => {
    memoria.gravar('nitro.fila', pendentes.slice(0, 500));
    memoria.gravar('nitro.recusadas', recusadas);
  };
  const estado = () => ({ pendentes: pendentes.length, rodando, erro: ultimoErro,
                          recusadas: recusadas.slice() });
  const anunciar = () => aoMudarEstado?.(estado());

  const recusar = (t, motivo) => {
    ultimoErro = motivo;
    if (t.id) idsRecusados.add(t.id);
    recusadas.unshift({ id: t.id, tela: t.tela, op: t.op, motivo,
                        em: new Date().toISOString() });
    recusadas = recusadas.slice(0, 50);
  };

  /* Uma passada só. Devolve o que precisa ser conferido depois. */
  async function executar(t) {
    /* O evento de etapa nasce no banco, pelo gatilho `tg_ordens_evento`.
       Mandar o de cá também duplicava toda a linha do tempo. */
    if (t.op === 'inserir' && t.tela === 'eventos') return null;

    if (t.op === 'inserir') {
      const linha = semLocais(t.tela, t.linha);
      delete linha.mecanico;
      if (t.tela === 'ordens') linha.mecanico_id = ehUUID(t.linha.mecanico) ? t.linha.mecanico : null;
      /* FASE 17 · mesma classe do defeito já corrigido em `mecanico_id`: valor
         que não é uuid numa coluna de vínculo derruba a linha inteira por
         sintaxe, antes mesmo de o banco olhar a regra. Onde o vínculo é
         opcional, o valor inválido vira nulo e o registro entra; onde ele é
         obrigatório, a recusa é explícita, porque gravar sem o vínculo criaria
         um item que não pertence a ordem nenhuma. */
      VINCULOS_OPCIONAIS.forEach(c => {
        if (c in linha && linha[c] != null && !ehUUID(linha[c])) linha[c] = null;
      });
      for (const c of (VINCULOS_OBRIGATORIOS[t.tela] || [])) {
        if (linha[c] != null && !ehUUID(linha[c])) {
          const e = new Error('O vínculo obrigatório deste registro está inválido ('
            + c + '). Lance de novo a partir do cadastro.');
          e.status = 400;
          throw e;
        }
      }
      if (!SEM_TENANT.has(t.tela)) {
        if (!OFICINA_ID) throw new Error('Oficina ainda não identificada — recarregue a página e entre de novo.');
        linha.oficina_id = OFICINA_ID;
      }
      await nuvem.inserir(t.banco, [linha]);
      return { tela: t.tela, banco: t.banco, id: t.id };
    } else if (t.op === 'alterar') {
      /* PATCH com identificador que não existe volta 200 com zero linhas
         alteradas: sucesso aparente, nada gravado. Onde o identificador é
         obrigatório e não veio, a recusa tem de ser explícita. */
      if (t.tela === 'oficina' && !ehUUID(t.id)) {
        const e = new Error('Não consegui identificar a sua oficina no servidor, '
          + 'então os dados que aparecem para o cliente não foram salvos. '
          + 'Saia e entre de novo; se repetir, avise o suporte.');
        e.status = 400;
        throw e;
      }
      const campos = semLocais(t.tela, t.campos);
      if (t.tela === 'ordens' && 'mecanico' in t.campos) {
        campos.mecanico_id = ehUUID(t.campos.mecanico) ? t.campos.mecanico : null;
        delete campos.mecanico;
      }
      /* O tenant nunca muda depois de gravado, e mandá-lo num UPDATE só daria
         chance de a linha trocar de dono por engano. */
      delete campos.oficina_id;
      if (Object.keys(campos).length) await nuvem.alterar(t.banco, t.id, campos);
      return null;
    } else if (t.op === 'excluir') {
      /* Tabela sem lixeira não aceita exclusão: o evento da linha do tempo
         é permanente por desenho. Some da tela local e fica no banco. */
      if (!SEM_LIXEIRA.has(t.tela)) await nuvem.excluir(t.banco, t.id);
      return null;
    } else if (t.op === 'rpc') {
      await nuvem.rpc(t.nome, t.args);
      return null;
    }
    return null;
  }

  /* FASE 17: coluna que a tabela não tem é anotada e a gravação refeita sem
     ela, na hora. Só uma volta por coluna, e no máximo seis — passou disso, é
     outro problema e vale recusar de verdade em vez de girar. */
  async function executarComReparo(t) {
    for (let volta = 0; volta < 6; volta++) {
      try { return await executar(t); }
      catch (e) {
        const coluna = colunaRecusada(e);
        if (!coluna || !anotarColunaAusente(t.banco, coluna)) throw e;
      }
    }
    return await executar(t);
  }

  /* Conferência: o que a fila disse que gravou existe mesmo no servidor? É a
     resposta para "salvou e sumiu". Uma leitura por tabela, só de `id`. */
  async function conferir(lista) {
    const porBanco = new Map();
    lista.forEach(x => {
      if (!x || !x.id || !ehUUID(x.id)) return;
      const l = porBanco.get(x.banco);
      if (l) l.push(x); else porBanco.set(x.banco, [x]);
    });
    for (const [banco, linhas] of porBanco) {
      for (let i = 0; i < linhas.length; i += 150) {
        const lote = linhas.slice(i, i + 150);
        try {
          const achados = await nuvem.ler(banco,
            'select=id&id=in.(' + lote.map(x => x.id).join(',') + ')&limit=200');
          const vivos = new Set((achados || []).map(x => x.id));
          lote.forEach(x => {
            if (vivos.has(x.id)) return;
            recusar({ id: x.id, tela: x.tela, op: 'inserir' },
              'O servidor aceitou o envio mas o registro não está lá. '
              + 'Lance de novo e, se repetir, avise o suporte.');
          });
        } catch (e) {
          /* Sem permissão de leitura nesta tabela a conferência não é
             possível — e não poder conferir não é motivo para alarmar. */
          console.warn('[nitro] conferência de ' + banco + ' indisponível:', e.message);
        }
      }
    }
  }

  async function girar() {
    if (rodando || !pendentes.length) return;
    rodando = true; ultimoErro = null; anunciar();
    while (pendentes.length) {
      const t = pendentes[0];
      /* Pai recusado: o filho não tem onde se prender. Sai da fila com a
         causa verdadeira em vez de "violates foreign key constraint". */
      if (t.op === 'inserir' && paisDaLinha(t.tela, t.linha).some(p => idsRecusados.has(p))) {
        recusar(t, 'Não entrou porque o registro principal também não entrou. '
                 + 'Resolva o aviso de cima e lance este de novo.');
        pendentes.shift(); guardar(); anunciar();
        continue;
      }
      try {
        const feito = await executarComReparo(t);
        if (feito) aConferir.push(feito);
        pendentes.shift(); guardar(); anunciar();
      } catch (e) {
        t.tentativas = (t.tentativas || 0) + 1;
        /* Erro de regra (documento inválido, sem permissão) não melhora com
           repetição: sai da fila avisando, senão trava tudo que vem atrás. */
        const permanente = e.status && e.status >= 400 && e.status < 500 && e.status !== 429;
        if (permanente || t.tentativas >= 5) {
          /* FASE 13: antes a tarefa era descartada e sobrava "0 pendentes ·
             tentar de novo" — um selo que não conta nada a ninguém. O que foi
             recusado fica registrado, com nome e motivo, e o selo passa a
             dizer quantos registros não entraram. */
          recusar(t, e.message);
          pendentes.shift(); guardar(); anunciar();
        } else {
          ultimoErro = e.message;
          rodando = false; anunciar();
          setTimeout(girar, Math.min(30000, 1000 * Math.pow(2, t.tentativas)));
          return;
        }
      }
    }
    rodando = false; anunciar();
    /* A conferência roda com a fila já vazia: ela lê, não escreve, e não pode
       segurar a próxima gravação. */
    if (aConferir.length) {
      const lote = aConferir; aConferir = [];
      try { await conferir(lote); } catch (_) {}
      guardar(); anunciar();
    }
  }

  return {
    empurrar(tarefas) {
      if (!tarefas?.length) return;
      pendentes.push(...tarefas); guardar(); anunciar(); girar();
    },
    girar, estado,
    limpar() { pendentes = []; guardar(); anunciar(); },
    /* Reenviar o que foi recusado só faz sentido depois que a causa mudou —
       o tenant chegou, o cadastro foi corrigido. Quem decide é a pessoa. */
    esquecerRecusadas() { recusadas = []; ultimoErro = null; idsRecusados.clear(); guardar(); anunciar(); },
  };
}


/* ══════════════════════════════════════════════════════════════════════════
   TELA DE ENTRADA
   Sem banco, o sistema abre direto na demonstração. Com banco, ninguém passa
   daqui sem sessão — e a sessão é do Supabase Auth, não um `if` de JavaScript.
   ══════════════════════════════════════════════════════════════════════════ */
function TelaEntrada({ nuvem, aoEntrar }) {
  const [modo, setModo] = useState('entrar');
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [erro, setErro] = useState('');
  const [recado, setRecado] = useState('');
  const [ocupado, setOcupado] = useState(false);

  const enviar = async () => {
    if (ocupado) return;
    setErro(''); setRecado(''); setOcupado(true);
    try {
      if (modo === 'entrar') {
        await nuvem.entrar(paraEmail(usuario), senha);
        aoEntrar();
      } else if (modo === 'criar') {
        if (senha.length < 8) throw new Error('A senha precisa de pelo menos oito caracteres.');
        const r = await nuvem.cadastrar(paraEmail(usuario), senha, nome);
        if (r.access_token) aoEntrar();
        else setRecado('Confirme o e-mail que enviamos e depois entre por aqui.');
      } else {
        await nuvem.recuperarSenha(paraEmail(usuario));
        /* Resposta igual exista ou não a conta: dizer "usuário não cadastrado"
           entrega a lista de quem tem acesso a quem perguntar. */
        setRecado('Se este usuário tiver e-mail cadastrado, o link de troca chega em instantes.');
      }
    } catch (e) { setErro(e.message); }
    finally { setOcupado(false); }
  };

  const teclado = (e) => { if (e.key === 'Enter') enviar(); };
  const pronto = usuario.trim() && (modo === 'esqueci' || senha.length > 0);

  const titulo = modo === 'entrar' ? 'Acesso ao sistema'
               : modo === 'criar'  ? 'Criar acesso' : 'Recuperar senha';
  const apoio  = modo === 'entrar' ? 'Você digita isto uma vez neste aparelho. Depois o sistema abre direto.'
               : modo === 'criar'  ? 'O primeiro acesso da oficina recebe o perfil de dono.'
               : 'A recuperação por e-mail vale para usuário com e-mail real. Se o acesso é interno, peça a troca a quem administra.';

  return html`
    <div class="pe-palco">
      <div class="pe-centro">
        <div class="pe-marca">
          <div class="pe-nome">NITRO</div>
          <div class="pe-regua"><i></i><i></i></div>
          <div class="pe-sub">Gestão para oficinas</div>
        </div>

        <div class="pe-cartao">
          <h1 class="pe-titulo">${titulo}</h1>
          <p class="pe-apoio">${apoio}</p>

          ${erro ? html`
            <div class="pe-recado erro" role="alert">
              <${Icone} nome="alerta" tam=${15} /><span>${erro}</span></div>` : null}
          ${recado ? html`
            <div class="pe-recado ok" role="status">
              <${Icone} nome="check" tam=${15} /><span>${recado}</span></div>` : null}

          ${modo === 'criar' ? html`
            <div class="pe-campo">
              <label class="pe-rotulo" for="pe-nome">Seu nome</label>
              <input id="pe-nome" class="pe-entrada" value=${nome}
                onInput=${e => setNome(e.target.value)} onKeyDown=${teclado}
                autocomplete="name" placeholder="Como aparece na ordem de serviço" />
            </div>` : null}

          <div class="pe-campo">
            <label class="pe-rotulo" for="pe-usuario">Usuário</label>
            <input id="pe-usuario" class="pe-entrada" value=${usuario}
              onInput=${e => setUsuario(e.target.value)} onKeyDown=${teclado}
              autocomplete="username" autocapitalize="none" autocorrect="off"
              spellcheck="false" placeholder="Oficinarickauto" />
            ${modo === 'entrar' ? html`<div class="pe-ajuda">Sem arroba e sem espaço.</div>` : null}
          </div>

          ${modo !== 'esqueci' ? html`
            <div class="pe-campo">
              <label class="pe-rotulo" for="pe-senha">Senha</label>
              <input id="pe-senha" class="pe-entrada" type="password" value=${senha}
                onInput=${e => setSenha(e.target.value)} onKeyDown=${teclado}
                autocomplete=${modo === 'criar' ? 'new-password' : 'current-password'} />
              ${modo === 'criar' ? html`<div class="pe-ajuda">Pelo menos oito caracteres.</div>` : null}
            </div>` : null}

          <button class="pe-botao" disabled=${ocupado || !pronto} onClick=${enviar}>
            ${ocupado
              ? html`<span class="pe-giro"></span>Verificando`
              : html`${modo === 'entrar' ? 'Entrar' : modo === 'criar' ? 'Criar acesso' : 'Enviar link'}
                     <${Icone} nome="seta-direita" tam=${15} cor="#fff" />`}
          </button>

          <div class="pe-links">
            ${modo !== 'entrar'
              ? html`<button class="pe-link" onClick=${() => { setModo('entrar'); setErro(''); setRecado(''); }}>Já tenho acesso</button>`
              : html`<button class="pe-link" onClick=${() => { setModo('criar'); setErro(''); setRecado(''); }}>Criar acesso</button>`}
            ${modo === 'entrar'
              ? html`<button class="pe-link" onClick=${() => { setModo('esqueci'); setErro(''); setRecado(''); }}>Esqueci a senha</button>`
              : html`<span></span>`}
          </div>
        </div>

        <div class="pe-rodape">Sistema por <span>BH SaaS Tecnologia</span></div>
      </div>
    </div>`;
}

/* Indicador de gravação. O balcão precisa saber, sem perguntar, se o que ele
   digitou já está no servidor. */
function SeloSincronia({ estado, aoTentar, aoAbrirRecusadas }) {
  if (!estado) return null;
  const { pendentes, rodando, erro } = estado;
  const recusadas = estado.recusadas || [];
  /* FASE 13: registro recusado não é registro pendente. Antes os dois caíam
     no mesmo selo e o resultado era "0 pendentes · tentar de novo": zero
     coisas esperando, e ainda assim um pedido de nova tentativa. Quem lia
     concluía que estava tudo certo — e não estava, tinha sumido. */
  /* As classes modificadoras são `selo-ok`, `selo-info`, `selo-alerta` e
     `selo-erro`. Aqui estava escrito `selo ok`, com espaço: duas classes, e a
     segunda não existe em lugar nenhum da folha. O selo nunca ficou verde,
     nem âmbar, nem vermelho — saiu cinza desde sempre, inclusive na hora de
     avisar que havia coisa por gravar. */
  if (recusadas.length) return html`
    <button class="selo selo-erro" onClick=${aoAbrirRecusadas}
      title="Toque para ver o que não entrou e por quê">
      <${Icone} nome="alerta" tam=${12} />
      ${recusadas.length} não ${recusadas.length === 1 ? 'gravado' : 'gravados'}</button>`;
  if (!pendentes && !erro) return html`
    <span class="selo selo-ok" title="Todas as alterações estão no servidor">
      <${Icone} nome="check" tam=${12} />Salvo</span>`;
  if (rodando) return html`
    <span class="selo selo-info"><${Icone} nome="atualizar" tam=${12} />Gravando ${pendentes}</span>`;
  return html`
    <button class="selo selo-alerta" onClick=${aoTentar}
      title=${erro || 'Alterações aguardando conexão'}>
      <${Icone} nome="alerta" tam=${12} />${pendentes} pendente${pendentes === 1 ? '' : 's'} · tentar de novo</button>`;
}

/* FASE 17: o selo de "não gravado" mede 90px e mora numa barra de topo que,
   no celular, ainda divide espaço com busca, botão de nova OS, cofre e sino.
   Quem perdeu uma ordem não viu selo nenhum. Registro que não entrou passa a
   ocupar uma faixa da largura inteira, acima do conteúdo, e ela não fecha
   sozinha — some quando a pessoa lê o que houve. */
function FaixaNaoGravado({ estado, aoAbrir }) {
  const n = estado?.recusadas?.length || 0;
  if (!n) return null;
  return html`
    <button class="faixa-nao-gravado" onClick=${aoAbrir}>
      <${Icone} nome="alerta" tam=${17} />
      <span style="flex:1;text-align:left">
        <b>${n} ${n === 1 ? 'registro não foi salvo' : 'registros não foram salvos'} no servidor.</b>
        ${' '}Toque para ver o que foi e por quê.
      </span>
      <${Icone} nome="seta" tam=${15} />
    </button>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   APLICAÇÃO
   ══════════════════════════════════════════════════════════════════════════ */
function App() {
  const [dados, setDados] = useState(gerarDados);
  /* ── Conexão ──────────────────────────────────────────────────────────── */
  const modo = (SUPABASE_URL && SUPABASE_ANON_KEY) ? 'supabase' : 'demo';
  const nuvem = useMemo(
    () => modo === 'supabase' ? criarNuvem(SUPABASE_URL, SUPABASE_ANON_KEY) : null, [modo]);
  const [autenticado, setAutenticado] = useState(() => Boolean(nuvem?.retomar()));
  const [carregando, setCarregando] = useState(false);
  const [falhaCarga, setFalhaCarga] = useState('');
  const [sincronia, setSincronia] = useState({ pendentes: 0, rodando: false, erro: null });
  const refUltimoSync = useRef(null);
  const fila = useMemo(
    () => nuvem ? criarFila(nuvem, setSincronia) : null, [nuvem]);
  const [vista, setVista] = useState('painel');
  const [papel, setPapel] = useState('gerente');
  const [tema, setTema] = useState('claro');
  const [osAberta, setOsAberta] = useState(null);
  /* FASE 18 · o lápis da lista abre a ordem já no formulário de edição; o
     cartão continua abrindo no resumo. Um estado à parte, e não um id
     enfeitado, porque `osAberta` é lido em vários lugares como id puro. */
  const [osEditando, setOsEditando] = useState(false);
  /* Qual lado da tela unificada de cadastros mostrar. Vive aqui porque quem
     escolhe é a navegação — o painel manda para clientes, o assistente de OS
     manda para veículos. */
  const [abaCadastro, setAbaCadastro] = useState('clientes');
  const [clienteAberto, setClienteAberto] = useState(null);
  const [veiculoAberto, setVeiculoAberto] = useState(null);
  const [notificacoes, setNotificacoes] = useState(false);
  const [assistente, setAssistente] = useState(false);
  const [copiloto, setCopiloto] = useState(false);
  const [documento, setDocumento] = useState(null);
  const [verRecusadas, setVerRecusadas] = useState(false);
  const [menuMobile, setMenuMobile] = useState(false);
  const [brinde, setBrinde] = useState(null);
  const [busca, setBusca] = useState('');
  const [cofreAberto, setCofreAberto] = useState(false);
  const [pedindoSenha, setPedindoSenha] = useState(null);   // null | 'criar' | 'pedir'
  /* Lembra que o destrave foi pedido de dentro de outra tela; lido em
     `liberarCofre`, que decide entre destravar e ficar ou destravar e ir. */
  const destravarSemSair = useRef(false);
  const [sigilo, setSigilo] = useState(true);
  const [ehMobile, setEhMobile] = useState(() => window.matchMedia('(max-width: 860px)').matches);

  /* ── MELHORIA 1: foco total na abertura da ordem ───────────────────────
     O botão do copiloto mora, no celular, na mesma faixa de 78px do rodapé
     onde ficam as ações do assistente de abertura — quem ia tocar em
     "Continuar" acertava o robô. Durante a abertura da OS a IA sai inteira
     de cena: painel, gaveta e botão. Sair da tela a traz de volta sozinha,
     inclusive quando a saída é a ordem recém-aberta. */
  const emFocoOS = vista === 'nova';
  const [iaMontada, setIaMontada] = useState(true);
  useEffect(() => {
    if (emFocoOS) { setCopiloto(false); setAssistente(false); setNotificacoes(false); }
  }, [emFocoOS]);
  /* Desmontar no mesmo quadro cortaria a animação de saída pela metade. O
     botão fica mais 240ms no ar, já marcado como "saindo", e some depois. */
  useEffect(() => {
    if (!emFocoOS) { setIaMontada(true); return; }
    const t = setTimeout(() => setIaMontada(false), 240);
    return () => clearTimeout(t);
  }, [emFocoOS]);

  /* ── MELHORIA 3: quanto do rodapé o teclado virtual está cobrindo ──────
     O teclado encolhe o viewport VISUAL e deixa o de layout do mesmo
     tamanho — é por isso que `position:sticky; bottom:0` sozinho continua
     sendo desenhado atrás dele. A medida vira `--teclado` e o CSS sobe a
     barra de ação por esse tanto. Navegador sem visualViewport fica com
     zero e se comporta como antes. */
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const raiz = document.documentElement;
    let quadro = 0;
    const medir = () => {
      quadro = 0;
      const coberto = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      /* A barra de endereço que recolhe também muda a altura; só o teclado
         come mais de cem pixels de uma vez. */
      const teclado = coberto > 110 ? Math.round(coberto) : 0;
      raiz.style.setProperty('--teclado', teclado + 'px');
      raiz.dataset.teclado = teclado ? 'aberto' : 'fechado';
    };
    const agendar = () => { if (!quadro) quadro = requestAnimationFrame(medir); };
    medir();
    vv.addEventListener('resize', agendar);
    vv.addEventListener('scroll', agendar);
    return () => {
      if (quadro) cancelAnimationFrame(quadro);
      vv.removeEventListener('resize', agendar);
      vv.removeEventListener('scroll', agendar);
      raiz.style.removeProperty('--teclado');
      delete raiz.dataset.teclado;
    };
  }, []);

  /* Espelho do estado no módulo. `brl` é função pura, chamada de quase cem
     lugares, e não teria como ler o contexto — a troca aqui vale para tudo
     que for desenhado depois. O link do cliente nunca entra no sigilo: ele é
     o dono do orçamento que está lendo. */
  COFRE.aberto = cofreAberto;
  COFRE.sigilo = sigilo && !ROTA_PUBLICA;
  COFRE.temSenha = Boolean(dados.oficina.cofre);
  /* Espelho do catálogo no módulo: `pecaPorCodigo` é função pura, chamada de
     fora de qualquer componente, e não teria como ler o contexto. */
  CATALOGO_ATUAL = dados.pecas;

  const usuarioAtual = dados.usuarios.find(u => u.papel === papel && u.ativo) || dados.usuarios[0];
  const medida = useRef({ metricas: 0, analise: 0 });
  const metricas = useMemo(() => {
    const t0 = performance.now();
    const r = calcularMetricas(dados);
    medida.current.metricas = performance.now() - t0;
    return r;
  }, [dados]);
  const achados = useMemo(() => {
    const t0 = performance.now();
    const r = analisar(dados, metricas);
    medida.current.analise = performance.now() - t0;
    return r;
  }, [dados, metricas, cofreAberto, sigilo]);
  const naoLidos = achados.filter(a => !dados.lidos.includes(a.id) && a.gravidade !== 'positivo').length;

  /* Trocar de papel para um que não enxerga dinheiro fecha o cofre sozinho. */
  useEffect(() => { if (!PAPEIS[papel].financeiro) setCofreAberto(false); }, [papel]);

  useEffect(() => { document.documentElement.dataset.tema = tema; }, [tema]);

  /* A oficina escolhe duas cores; os tons de apoio saem daqui. */
  useEffect(() => {
    const r = document.documentElement.style;
    const { cor, corBarra } = dados.oficina;
    r.setProperty('--azul-acao', cor);
    r.setProperty('--azul-acao-forte', tema === 'claro' ? escurecer(cor, .84) : clarear(cor, .18));
    r.setProperty('--info-fundo', tema === 'claro' ? clarear(cor, .90) : escurecer(cor, .26));
    r.setProperty('--trilho', tema === 'claro' ? corBarra : escurecer(corBarra, .55));
    r.setProperty('--info', cor);
  }, [dados.oficina.cor, dados.oficina.corBarra, tema]);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 860px)');
    const h = (e) => setEhMobile(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  useEffect(() => {
    if (!brinde) return;
    const t = setTimeout(() => setBrinde(null), 3600);
    return () => clearTimeout(t);
  }, [brinde]);

  /* ── Carga inicial ─────────────────────────────────────────────────────
     Só depois que os dados chegam é que a comparação começa a valer: iniciar
     antes faria a primeira sincronização enxergar a base de demonstração
     inteira como "registros novos" e tentar gravá-la por cima da real. */
  useEffect(() => {
    if (modo !== 'supabase' || !autenticado) return;
    let vivo = true;
    setCarregando(true); setFalhaCarga('');
    (async () => {
      try {
        const base = await carregarDoBanco(nuvem);
        /* Anexos vêm com caminho; a miniatura precisa de URL assinada. */
        const caminhos = (base.anexos || []).map(a => a.caminho).filter(Boolean);
        const urls = caminhos.length ? await nuvem.urlsAssinadas(caminhos) : {};
        base.anexos = (base.anexos || []).map(a => ({ ...a, url: urls[a.caminho] || '' }));
        if (!vivo) return;
        /* FASE 13: antes de qualquer gravação. A fila roda fora do componente
           e é aqui que ela descobre de quem é a linha que vai inserir. */
        definirOficinaAtual(base.oficina?.id || base.contexto?.oficina?.id);
        sincronizarMecanicos(base.usuarios);
        /* Sem a função no banco (instalação antiga) o valor fica zero e o
           cálculo volta a ser o local — nada quebra, só perde a continuidade. */
        nuvem.rpc('proxima_os').then(definirProximaOS)
          .catch(e => console.warn('[nitro] contador de ordens indisponível:', e.message));
        refUltimoSync.current = base;
        setDados(base);
        setPapel(base.contexto?.papel || 'gerente');
        nuvem.rpc('registrar_acesso').catch(() => {});
        fila.girar();
      } catch (e) {
        if (!vivo) return;
        setFalhaCarga(e.message);
        /* Sessão inválida derruba para a tela de entrada em vez de deixar a
           pessoa olhando uma tela vazia sem entender por quê. */
        if (/sess|JWT|expir/i.test(e.message)) { nuvem.sair(); setAutenticado(false); }
      } finally { if (vivo) setCarregando(false); }
    })();
    return () => { vivo = false; };
  }, [modo, autenticado, nuvem]);

  /* ── Gravação por comparação ───────────────────────────────────────────
     Cada ação da tela muda `dados`; aqui a diferença vira requisição. É o que
     dispensa lembrar de gravar em cinquenta lugares diferentes. */
  useEffect(() => {
    if (modo !== 'supabase' || !autenticado || !refUltimoSync.current) return;
    if (refUltimoSync.current === dados) return;
    const tarefas = diferenca(refUltimoSync.current, dados);
    refUltimoSync.current = dados;
    if (tarefas.length) fila.empurrar(tarefas);
  }, [dados, modo, autenticado]);

  /* Voltar a ter rede é o momento de esvaziar a fila. */
  useEffect(() => {
    if (modo !== 'supabase') return;
    const voltou = () => fila.girar();
    /* AUDITORIA: o `visibilitychange` era anônimo e a limpeza só removia o
       `online`. Cada vez que o efeito rodasse de novo sobraria mais um
       ouvinte pendurado, e voltar para a aba dispararia a fila várias vezes
       de uma vez. Hoje as dependências são estáveis e isso não acontece —
       mas é o tipo de defeito que só aparece depois que alguém mexe numa
       dependência achando que não tem consequência. */
    const aoVoltar = () => { if (!document.hidden) fila.girar(); };
    window.addEventListener('online', voltou);
    document.addEventListener('visibilitychange', aoVoltar);
    return () => {
      window.removeEventListener('online', voltou);
      document.removeEventListener('visibilitychange', aoVoltar);
    };
  }, [modo, fila]);

  /* Fechar a aba com gravação pendente perde trabalho: o navegador pergunta. */
  useEffect(() => {
    const sair = (e) => {
      if (sincronia.pendentes > 0) { e.preventDefault(); e.returnValue = ''; }
    };
    window.addEventListener('beforeunload', sair);
    return () => window.removeEventListener('beforeunload', sair);
  }, [sincronia.pendentes]);

  /* Backup automático: uma cópia ao abrir e outra a cada dez minutos. */
  const refBackup = useRef(false);
  useEffect(() => {
    if (refBackup.current) return;
    refBackup.current = true;
    /* Com banco, a cópia é feita pelo servidor: uma cópia em memória do
       navegador não sobrevive ao fechamento da aba, que é justamente quando
       ela faria falta. */
    if (modo === 'supabase') {
      const copiar = () => { if (autenticado) nuvem.rpc('backup_criar', { p_tipo: 'automatico' })
        .catch(e => console.warn('[nitro] backup automático falhou:', e.message)); };
      const t = setInterval(copiar, INTERVALO_BACKUP * 3);
      return () => clearInterval(t);
    }
    acoes.criarBackup('automatico');
    const t = setInterval(() => acoes.criarBackup('automatico'), INTERVALO_BACKUP);
    return () => clearInterval(t);
  }, [modo, autenticado]);

  /* Erro que escapa de tudo vira mensagem humana, nunca pilha de execução. */
  useEffect(() => {
    const falha = (e) => { console.error('[Nitro]', e.error || e.reason || e); setBrinde(MENSAGENS_ERRO.generico); };
    window.addEventListener('error', falha);
    window.addEventListener('unhandledrejection', falha);
    return () => { window.removeEventListener('error', falha); window.removeEventListener('unhandledrejection', falha); };
  }, []);
  useEffect(() => {
    const h = (e) => {
      const digitando = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
      /* AUDITORIA (fase 15): o Escape fechava a gaveta do assistente e
         esquecia o painel do copiloto, que é o que fica aberto na prática. */
      if (e.key === 'Escape') { setDocumento(null); setOsAberta(null); setClienteAberto(null); setVeiculoAberto(null); setNotificacoes(false); setAssistente(false); setCopiloto(false); setMenuMobile(false); setBusca(''); return; }
      if (digitando || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'n') { e.preventDefault(); setVista('nova'); setMenuMobile(false); }
      /* Durante a abertura da ordem o atalho do copiloto fica desligado:
         chamá-lo devolveria à tela exatamente o que ela acabou de tirar. */
      if (e.key === 'p' && !emFocoOS) { e.preventDefault(); setCopiloto(true); }
      if (e.key === '/') { e.preventDefault(); document.getElementById('busca-topo')?.focus(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [emFocoOS]);

  const avisar = useCallback((msg) => setBrinde(msg), []);
  /* FASE 18 · `clientes` e `veiculos` continuam sendo endereços válidos: são
     usados pelos achados, pelo painel e pelo assistente de abertura. Eles
     deixam de ser telas e passam a ser o mesmo destino com a aba já escolhida
     — quem chamava não precisou saber de nada. */
  const irPara = useCallback((v) => {
    let destino = v;
    if (v === 'clientes' || v === 'veiculos') { setAbaCadastro(v); destino = 'cadastros'; }
    setVista(destino); setMenuMobile(false); window.scrollTo(0, 0);
  }, []);

  /* O cadeado do topo faz as duas coisas de uma vez: destrava os valores e
     leva para onde eles moram. Fechar é um clique no cadeado ao lado. */
  const cofre = useMemo(() => ({
    aberto: cofreAberto,
    sigilo,
    permitido: Boolean(PAPEIS[papel].financeiro),
    papelNome: PAPEIS[papel].nome.toLowerCase(),
    abrir: () => {
      if (!PAPEIS[papel].financeiro) { setBrinde('Seu perfil não abre a área financeira.'); return; }
      /* Já aberto nesta sessão? Então é só levar até lá — cobrar senha a cada
         clique treinaria a pessoa a digitar no automático. */
      if (cofreAberto) { setVista('cofre'); setMenuMobile(false); window.scrollTo(0, 0); return; }
      setPedindoSenha(dados.oficina.cofre ? 'pedir' : 'criar');
    },
    /* CORREÇÃO · `abrir` sempre termina em `setVista('cofre')`, porque nasceu
       para o cadeado do topo, que é atalho e destrave ao mesmo tempo. Um
       cadeado dentro de outra tela precisa da outra metade sozinha: destravar
       o valor e deixar a pessoa onde ela estava. Quem chama daqui não perde a
       tela de Estoque no meio da conferência da prateleira. */
    destravar: () => {
      if (!PAPEIS[papel].financeiro) { setBrinde('Seu perfil não abre a área financeira.'); return; }
      if (cofreAberto) return;
      destravarSemSair.current = true;
      setPedindoSenha(dados.oficina.cofre ? 'pedir' : 'criar');
    },
    travar: () => { setCofreAberto(false); setBrinde('Cofre travado. Os valores saíram das telas.'); },
    alternarSigilo: () => setSigilo(s => !s),
    temSenha: Boolean(dados.oficina.cofre),
  }), [cofreAberto, sigilo, papel, dados.oficina.cofre]);

  const liberarCofre = useCallback(() => {
    setPedindoSenha(null);
    setCofreAberto(true);
    /* Pedido de dentro de outra tela: destrava e fica. Sem isso, conferir o
       capital do estoque jogava a pessoa na área financeira e ela tinha de
       voltar e reencontrar onde estava na lista. */
    if (destravarSemSair.current) {
      destravarSemSair.current = false;
      setBrinde('Cofre aberto. Os valores voltaram às telas.');
      return;
    }
    setVista('cofre'); setMenuMobile(false); window.scrollTo(0, 0);
  }, []);

  /* Com banco, a senha da área financeira é conferida no servidor, com hash
     bcrypt e espera crescente contada lá. O embaralhamento local existia só
     para o PIN não ficar legível no backup — nunca foi controle de acesso. */
  const cofreServidor = useMemo(() => modo !== 'supabase' ? null : ({
    definir: (senha, pergunta, resposta) =>
      nuvem.rpc('cofre_definir', { p_senha: senha, p_pergunta: pergunta, p_resposta: resposta }),
    abrir: (senha) => nuvem.rpc('cofre_abrir', { p_senha: senha }),
    recuperar: (resposta, codigo) =>
      nuvem.rpc('cofre_recuperar', { p_resposta: resposta || null, p_codigo: codigo || null }),
    pergunta: () => nuvem.rpc('cofre_pergunta'),
  }), [modo, nuvem]);

  const acoes = useMemo(() => {
    const quem = usuarioAtual?.nome || 'Sistema';
    const marcar = (d, osId, etapa) => ({ ...d,
      eventos: [...d.eventos, { id:novoId(), os_id:osId, para_etapa:etapa, criado_em:new Date().toISOString(), usuario:quem }] });
    // Toda mutação passa por aqui: auditoria que depende de lembrar de chamar não é auditoria.
    const aud = (d, acao, alvo, detalhe) => ({ ...d,
      auditoria: [registro(quem, papel, acao, alvo, detalhe), ...d.auditoria] });
    return {
      moverOS: (id, etapa) => setDados(d => {
        const o = d.ordens.find(x => x.id === id);
        return aud(marcar({ ...d, ordens: d.ordens.map(x => x.id === id ? { ...x, etapa } : x) }, id, etapa),
          'os_etapa', 'OS ' + o?.numero, etapaNome(o?.etapa) + ' para ' + etapaNome(etapa));
      }),
      avancar: (o) => {
        const i = etapaIndice(o.etapa);
        const proxima = i >= ETAPAS.length - 1 ? 'concluida' : ETAPAS[i + 1].id;
        const agora = new Date().toISOString();
        setDados(d => aud(marcar({ ...d,
          ordens: d.ordens.map(x => x.id === o.id ? { ...x, etapa: proxima,
            aprovada_em: proxima === 'execucao' && !x.aprovada_em ? agora : x.aprovada_em,
            concluida_em: proxima === 'concluida' ? agora : x.concluida_em,
            entregue_em: proxima === 'concluida' ? agora : x.entregue_em } : x),
          veiculos: proxima === 'concluida'
            ? d.veiculos.map(v => v.id === o.veiculo_id ? { ...v, km_atual: Math.max(v.km_atual, o.km_entrada) } : v)
            : d.veiculos,
        }, o.id, proxima), 'os_etapa', 'OS ' + o.numero, etapaNome(o.etapa) + ' para ' + etapaNome(proxima)));
      },
      aprovarOS: (id) => setDados(d => {
        const o = d.ordens.find(x => x.id === id);
        return aud(marcar({ ...d, ordens: d.ordens.map(x => x.id === id
          ? { ...x, etapa:'execucao', aprovada_em:new Date().toISOString(), aprovado_por:'cliente' } : x) }, id, 'execucao'),
          'os_aprovada', 'OS ' + o?.numero, 'Aprovação registrada pelo cliente');
      }),
      editarOS: (id, campos, detalhe) => setDados(d => {
        const o = d.ordens.find(x => x.id === id);
        const base = { ...d, ordens: d.ordens.map(x => x.id === id ? { ...x, ...campos } : x) };
        /* FASE 18 · quem chama com `detalhe` está gravando um formulário
           inteiro de uma vez — não é digitação solta, é decisão tomada. Esse
           caminho SEMPRE registra na auditoria, com o resumo pronto de quais
           campos mudaram. Sem o terceiro parâmetro nada muda: continua valendo
           a regra antiga, que só anota desconto e validade. */
        if (detalhe && o) {
          /* Quilometragem de entrada corrigida para cima também corrige o
             hodômetro do veículo: deixar os dois discordando faz o plano de
             revisão apontar para a leitura velha. */
          const km = 'km_entrada' in campos ? inteiroBR(campos.km_entrada) : null;
          const comKm = km == null ? base
            : { ...base, veiculos: base.veiculos.map(v => v.id === o.veiculo_id
                ? { ...v, km_atual: Math.max(Number(v.km_atual) || 0, km) } : v) };
          return aud(comKm, 'os_editada', 'OS ' + o.numero, detalhe);
        }
        // Só desconto e validade entram na trilha: texto digitado geraria ruído a cada tecla.
        if ('desconto' in campos && o && Number(campos.desconto) !== Number(o.desconto))
          return aud(base, 'os_valor', 'OS ' + o.numero, 'Desconto de ' + brlBruto(o.desconto) + ' para ' + brlBruto(campos.desconto));
        if ('validade_dias' in campos && o && campos.validade_dias !== o.validade_dias)
          return aud(base, 'os_editada', 'OS ' + o.numero, 'Validade de ' + o.validade_dias + ' para ' + campos.validade_dias + ' dias');
        return base;
      }),
      /* Sem `detalhe` não grava auditoria: os campos de observação salvam a
         cada tecla e gerariam uma linha de trilha por caractere. */
      editarCliente: (id, campos, detalhe) => setDados(d => {
        const base = { ...d, clientes: d.clientes.map(c => c.id === id ? { ...c, ...campos } : c) };
        return detalhe ? aud(base, 'cliente_editado', d.clientes.find(c => c.id === id)?.nome || 'Cliente', detalhe) : base;
      }),
      criarCliente: (c) => setDados(d => aud({ ...d,
        clientes: [{ id:novoId(), desde:new Date().toISOString(), observacoes:'', preferencias:'', ...c }, ...d.clientes] },
        'cliente_criado', c.nome, 'Cadastro criado')),
      criarVeiculo: (v) => setDados(d => aud({ ...d, veiculos: [{ id:novoId(), ...v }, ...d.veiculos] },
        'veiculo_criado', v.placa, v.marca + ' ' + v.modelo + ' vinculado ao cliente')),
      criarOS: (r) => {
        // Math.max() de array vazio devolve -Infinity: a primeira OS da oficina
        // sairia com número inválido. Encontrado testando a base zerada.
        /* O maior entre o que a tela conhece e o que o contador do banco diz.
           Com a tela vazia vale o contador; com a tela cheia vale o local, que
           já está à frente. Nenhum dos dois sozinho serve. */
        const local = dados.ordens.length ? Math.max(...dados.ordens.map(o => o.numero)) + 1 : 1;
        const numero = Math.max(local, PROXIMA_OS_SERVIDOR || 0, 1);
        /* Numeração recomeçando do 1 numa base ligada ao banco quase sempre
           quer dizer contador não lido, não oficina nova. Vale dizer antes. */
        if (numero === 1 && modo === 'supabase' && !PROXIMA_OS_LIDA)
          setBrinde('Esta ordem saiu como número 1 porque o contador do banco não respondeu. '
                  + 'Confira o cadastro do usuário em Ajustes antes de seguir.');
        const osId = novoId();
        const agora = new Date().toISOString();
        setDados(d => ({ ...d,
          ordens: [{ id:osId, numero, cliente_id:r.cliente_id, veiculo_id:r.veiculo_id, etapa:'entrada',
            km_entrada:inteiroBR(r.km_entrada), desconto:numeroBR(r.desconto), aberta_em:agora,
            aprovada_em:null, concluida_em:null, entregue_em:null, mecanico:r.mecanico, relato:r.relato,
            obs_tecnica:'', obs_orcamento:r.obs_orcamento || '', validade_dias:r.validade_dias || VALIDADE_PADRAO,
            garantia_dias: r.garantia_dias ?? GARANTIA_PADRAO, recusado_em:null, motivo_recusa:null,
            checklist: { ...(r.checklist || checklistVazio()), hora_entrada: agora }, aprovado_por:null,
            portal_token: sortearToken() }, ...d.ordens],
          itens: [...d.itens, ...r.itens.map(i => ({ ...i, os_id: osId }))],
          eventos: [...d.eventos, { id:novoId(), os_id:osId, para_etapa:'entrada', criado_em:agora, usuario:quem }],
          veiculos: d.veiculos.map(v => v.id === r.veiculo_id ? { ...v, km_atual: Math.max(v.km_atual, inteiroBR(r.km_entrada)) } : v),
          auditoria: [registro(quem, papel, 'os_criada', 'OS ' + numero, r.itens.length + ' itens · ' + brlBruto(totaisDaOS(r.itens, r.desconto).liquido)), ...d.auditoria],
        }));
        return { numero, id: osId };
      },
      baixarLancamento: (id) => setDados(d => {
        const l = d.lancamentos.find(x => x.id === id);
        return aud({ ...d, lancamentos: d.lancamentos.map(x => x.id === id ? { ...x, status:'pago', pago_em: hojeISO() } : x) },
          'lancamento_baixa', l?.descricao, (l?.tipo === 'pagar' ? 'Pagamento' : 'Recebimento') + ' de ' + brlBruto(l?.valor));
      }),
      alternarAutomacao: (id, nome, ligando) => setDados(d => aud(
        { ...d, automacoes: d.automacoes.map(a => a.id === id ? { ...a, ativa: !a.ativa } : a) },
        'automacao', nome, ligando ? 'Regra ativada' : 'Regra desativada')),
      editarOficina: (campos, detalhe) => setDados(d => {
        const base = { ...d, oficina: { ...d.oficina, ...campos } };
        return detalhe ? aud(base, 'oficina', 'Dados da oficina', detalhe) : base;
      }),
      criarUsuario: (u) => setDados(d => aud({ ...d,
        usuarios: [...d.usuarios, { id:novoId(), ativo:true, desde:new Date().toISOString(), ...u }] },
        'usuario', u.nome, 'Adicionado como ' + PAPEIS[u.papel].nome)),
      editarUsuario: (id, campos, nome, detalhe) => setDados(d => aud(
        { ...d, usuarios: d.usuarios.map(u => u.id === id ? { ...u, ...campos } : u) }, 'usuario', nome, detalhe)),
      criarTarefa: (t) => setDados(d => ({ ...d,
        tarefas: [{ id:novoId(), feita:false, responsavel:quem, prazo:iso10(somaDiasData(new Date().toISOString(), 2)), ...t }, ...d.tarefas] })),
      alternarTarefa: (id) => setDados(d => {
        const t = d.tarefas.find(x => x.id === id);
        const base = { ...d, tarefas: d.tarefas.map(x => x.id === id ? { ...x, feita: !x.feita } : x) };
        return t && !t.feita ? aud(base, 'tarefa', t.titulo, 'Marcada como concluída') : base;
      }),
      editarModelo: (id, texto) => setDados(d => ({ ...d,
        modelosMensagem: d.modelosMensagem.map(m => m.id === id ? { ...m, texto } : m) })),
      editarChecklist: (id, checklist) => setDados(d => ({ ...d,
        ordens: d.ordens.map(x => x.id === id ? { ...x, checklist } : x) })),
      recusarOS: (id, motivo) => setDados(d => {
        const x = d.ordens.find(y => y.id === id);
        return aud({ ...d, ordens: d.ordens.map(y => y.id === id
          ? { ...y, recusado_em: new Date().toISOString(), motivo_recusa: motivo, etapa: 'cancelada' } : y) },
          'os_recusada', 'OS ' + x?.numero, 'Orçamento recusado: ' + (motivo || 'sem motivo informado'));
      }),
      /* Com banco, o binário vai para o Storage e a linha guarda o caminho.
         Antes a foto virava data URL dentro do estado: quarenta fotos de
         1,5 MB são sessenta megabytes de base64 numa linha só de JSON — o
         backup estourava, a exportação travava a aba e o PostgREST recusava
         o corpo da requisição. */
      anexar: async (a) => {
        if (modo === 'supabase' && a.arquivo) {
          try {
            const { caminho, hash } = await nuvem.enviarArquivo(
              a.arquivo, dados.oficina.id, 'anexos');
            const url = await nuvem.urlAssinada(caminho);
            setDados(d => ({ ...d, anexos: [{
              id: novoId(), criado_em: new Date().toISOString(), autor: quem,
              caminho, hash_sha256: hash, url,
              nome: a.nome, bytes: a.bytes, formato: a.formato, tipo: a.tipo,
              os_id: a.os_id || null, veiculo_id: a.veiculo_id || null,
              cliente_id: a.cliente_id || null,
            }, ...d.anexos] }));
          } catch (e) { setBrinde(e.message); }
          return;
        }
        setDados(d => ({ ...d,
          anexos: [{ id: novoId(), criado_em: new Date().toISOString(), autor: quem, ...a }, ...d.anexos] }));
      },
      removerAnexo: (id) => setDados(d => {
        const a = d.anexos.find(x => x.id === id);
        /* A linha vai para a lixeira e o binário sai do Storage. Sem esta
           chamada o arquivo ficava pago e ocupando espaço para sempre. */
        if (modo === 'supabase' && a?.caminho) nuvem.apagarArquivo(a.caminho);
        return aud({ ...d, anexos: d.anexos.filter(x => x.id !== id) },
          'anexo_removido', a?.nome, TIPOS_ANEXO.find(t => t.id === a?.tipo)?.nome || 'Anexo');
      }),
      cadastroRapido: ({ cliente, veiculo }) => {
        const idCliente = novoId();
        setDados(d => {
          const base = { ...d,
            clientes: [{ id: idCliente, desde: new Date().toISOString(), observacoes: '', preferencias: '', ...cliente }, ...d.clientes],
            veiculos: [{ id: novoId(), cliente_id: idCliente, ...veiculo }, ...d.veiculos] };
          return aud(aud(base, 'cliente_criado', cliente.nome, 'Cadastro rápido no balcão'),
            'veiculo_criado', veiculo.placa, veiculo.marca + ' ' + veiculo.modelo + ' vinculado a ' + cliente.nome);
        });
        return idCliente;
      },
      criarBackup: (tipo) => setDados(d => {
        const bk = montarBackup(d, tipo, tipo === 'automatico' ? 'Sistema' : quem);
        const lista = [bk, ...d.backups].slice(0, LIMITE_BACKUPS);
        return tipo === 'automatico' ? { ...d, backups: lista }
          : aud({ ...d, backups: lista }, 'backup_criado', 'Cópia de ' + fmtData(bk.criado_em), inteiro(bk.total) + ' registros · soma ' + bk.soma);
      }),
      registrarBackup: (bk, detalhe) => setDados(d => aud(
        { ...d, backups: [bk, ...d.backups].slice(0, LIMITE_BACKUPS) },
        'backup_criado', 'Cópia de ' + fmtData(bk.criado_em), detalhe)),
      /* Com banco, restaurar é uma transação no servidor: ela confere a soma,
         guarda o estado atual antes de sobrescrever e desliga os gatilhos
         durante a carga. Nada disso é possível a partir do navegador. */
      restaurarNoServidor: async (id) => {
        try {
          const r = await nuvem.rpc('backup_restaurar', { p_id: id });
          setBrinde(r?.restaurados + ' registros restaurados. Recarregando…');
          setTimeout(() => window.location.reload(), 1200);
        } catch (e) { setBrinde(e.message); }
      },
      backupNoServidor: async (tipo) => {
        try {
          const r = await nuvem.rpc('backup_criar', { p_tipo: tipo || 'manual' });
          setBrinde('Cópia gravada no servidor: ' + inteiro(r?.total || 0) + ' registros.');
          const lista = await nuvem.ler('backups',
            'select=id,tipo,autor,total,bytes,soma,registros,criado_em&order=criado_em.desc&limit=12');
          setDados(d => ({ ...d, backups: lista || d.backups }));
        } catch (e) { setBrinde(e.message); }
      },
      restaurarBackup: (bk) => {
        /* Restaurar sobrescreve tudo — inclusive a senha da área financeira
           guardada em `oficina`. Sem esta trava, bastava restaurar um backup
           preparado para trocar a senha do cofre e entrar. */
        if (COFRE.temSenha && !COFRE.aberto) {
          setBrinde('Abra a área financeira antes de restaurar: o backup também troca a senha dela.');
          return;
        }
        setDados(d => {
        // A auditoria da restauração precisa sobreviver à própria restauração:
        // por isso ela é anexada ao histórico que vem do backup, não substituída.
        const restaurado = aplicarBackup(d, bk);
        const marca = registro(quem, papel, 'backup_restaurado', 'Cópia de ' + fmtData(bk.criado_em),
          inteiro(bk.total) + ' registros restaurados · soma ' + (bk.soma || '—'));
        return { ...restaurado, backups: d.backups, lidos: [],
                 auditoria: [marca, ...(restaurado.auditoria || []), ...d.auditoria].slice(0, 500) };
        });
      },
      /* ── Fase 9 ────────────────────────────────────────────────────────
         Toda exclusão grava auditoria: quem apagou o quê é justamente o
         registro que mais faz falta depois que o dado some. */
      /* FASE 17: excluía só a linha do cliente e deixava carro, ordem, item e
         anexo apontando para um dono que não existe mais. Antes isso não
         acontecia porque a tela vetava a exclusão; agora que ela é permitida,
         o arrasto precisa ser de verdade — e é o mesmo que a confirmação
         mostrou, porque as duas contam pela mesma regra. */
      excluirCliente: (id) => setDados(d => {
        const c = d.clientes.find(x => x.id === id);
        const carros = new Set((d.veiculos || []).filter(v => v.cliente_id === id).map(v => v.id));
        const osIds = new Set((d.ordens || []).filter(o => o.cliente_id === id || carros.has(o.veiculo_id)).map(o => o.id));
        const a = arrastoDaExclusao(d, 'cliente', id);
        return aud({ ...d,
          clientes: d.clientes.filter(x => x.id !== id),
          veiculos: d.veiculos.filter(v => !carros.has(v.id)),
          ordens: d.ordens.filter(o => !osIds.has(o.id)),
          itens: d.itens.filter(i => !osIds.has(i.os_id)),
          eventos: d.eventos.filter(e => !osIds.has(e.os_id)),
          anexos: (d.anexos || []).filter(x => !osIds.has(x.os_id) && !carros.has(x.veiculo_id) && x.cliente_id !== id),
          lancamentos: d.lancamentos.filter(l => !osIds.has(l.os_id)),
          agendamentos: (d.agendamentos || []).filter(g => g.cliente_id !== id && !carros.has(g.veiculo_id)),
        }, 'registro_excluido', c?.nome || 'Cliente',
           ['Cadastro de cliente excluído', ...frasesDoArrasto(a)].join(' · '));
      }),
      editarVeiculo: (id, campos, detalhe) => setDados(d => {
        const v = d.veiculos.find(x => x.id === id);
        return aud({ ...d, veiculos: d.veiculos.map(x => x.id === id ? { ...x, ...campos } : x) },
          'veiculo_editado', v?.placa || 'Veículo', detalhe || 'Cadastro atualizado');
      }),
      excluirVeiculo: (id) => setDados(d => {
        const v = d.veiculos.find(x => x.id === id);
        const osIds = new Set((d.ordens || []).filter(o => o.veiculo_id === id).map(o => o.id));
        const a = arrastoDaExclusao(d, 'veiculo', id);
        return aud({ ...d,
          veiculos: d.veiculos.filter(x => x.id !== id),
          ordens: d.ordens.filter(o => !osIds.has(o.id)),
          itens: d.itens.filter(i => !osIds.has(i.os_id)),
          eventos: d.eventos.filter(e => !osIds.has(e.os_id)),
          anexos: (d.anexos || []).filter(x => !osIds.has(x.os_id) && x.veiculo_id !== id),
          lancamentos: d.lancamentos.filter(l => !osIds.has(l.os_id)),
          agendamentos: (d.agendamentos || []).filter(g => g.veiculo_id !== id),
        }, 'registro_excluido', v?.placa || 'Veículo',
           [(v?.marca || '') + ' ' + (v?.modelo || '') + ' removido', ...frasesDoArrasto(a)].join(' · '));
      }),
      criarPeca: (p) => setDados(d => aud({ ...d, pecas: [{ id:novoId(), ...p }, ...d.pecas] },
        'peca_criada', p.codigo, p.descricao + ' · saldo inicial ' + p.quantidade)),
      editarPeca: (id, campos) => setDados(d => {
        const p = d.pecas.find(x => x.id === id);
        return aud({ ...d, pecas: d.pecas.map(x => x.id === id ? { ...x, ...campos } : x) },
          'peca_editada', p?.codigo || 'Peça', 'Cadastro da peça atualizado');
      }),
      excluirPeca: (id) => setDados(d => {
        const p = d.pecas.find(x => x.id === id);
        return aud({ ...d, pecas: d.pecas.filter(x => x.id !== id) },
          'registro_excluido', p?.codigo || 'Peça', (p?.descricao || '') + ' removida do catálogo');
      }),
      ajustarEstoque: (id, saldo, motivo) => setDados(d => {
        const p = d.pecas.find(x => x.id === id);
        if (!p) return d;
        const novo = Math.max(0, Math.round(saldo));
        return aud({ ...d, pecas: d.pecas.map(x => x.id === id ? { ...x, quantidade: novo } : x) },
          'estoque_ajustado', p.codigo, 'Saldo de ' + p.quantidade + ' para ' + novo + (motivo ? ' · ' + motivo : ''));
      }),
      adicionarItemOS: (osId, item) => setDados(d => {
        const o = d.ordens.find(x => x.id === osId);
        return aud({ ...d, itens: [...d.itens, { id:novoId(), os_id:osId, peca_id:null, ...item }] },
          'os_itens', 'OS ' + o?.numero, 'Incluído: ' + item.descricao + ' · ' + brlBruto(item.quantidade * item.preco_unitario));
      }),
      removerItemOS: (osId, itemId) => setDados(d => {
        const o = d.ordens.find(x => x.id === osId);
        const i = d.itens.find(x => x.id === itemId);
        return aud({ ...d, itens: d.itens.filter(x => x.id !== itemId) },
          'os_itens', 'OS ' + o?.numero, 'Removido: ' + (i?.descricao || 'item'));
      }),
      cancelarOS: (id, motivo) => setDados(d => {
        const o = d.ordens.find(x => x.id === id);
        return aud(marcar({ ...d, ordens: d.ordens.map(x => x.id === id
          ? { ...x, etapa:'cancelada', motivo_recusa: motivo || x.motivo_recusa,
              recusado_em: x.recusado_em || new Date().toISOString() } : x) }, id, 'cancelada'),
          'os_cancelada', 'OS ' + o?.numero, motivo || 'Sem motivo informado');
      }),
      excluirOS: (id) => setDados(d => {
        const o = d.ordens.find(x => x.id === id);
        return aud({ ...d,
          ordens: d.ordens.filter(x => x.id !== id),
          itens: d.itens.filter(x => x.os_id !== id),
          eventos: d.eventos.filter(x => x.os_id !== id),
          anexos: (d.anexos || []).filter(x => x.os_id !== id),
          lancamentos: d.lancamentos.filter(x => x.os_id !== id),
        }, 'registro_excluido', 'OS ' + o?.numero, 'Ordem, itens, eventos, anexos e títulos vinculados removidos');
      }),
      criarLancamento: (l) => setDados(d => aud({ ...d,
        lancamentos: [{ id:novoId(), status:'aberto', ...l }, ...d.lancamentos] },
        'lancamento_criado', l.descricao, (l.tipo === 'receber' ? 'A receber ' : 'A pagar ') + brlBruto(l.valor))),
      editarLancamento: (id, campos) => setDados(d => {
        const l = d.lancamentos.find(x => x.id === id);
        return aud({ ...d, lancamentos: d.lancamentos.map(x => x.id === id ? { ...x, ...campos } : x) },
          'lancamento_editado', l?.descricao || 'Título', 'Título atualizado');
      }),
      excluirLancamento: (id) => setDados(d => {
        const l = d.lancamentos.find(x => x.id === id);
        return aud({ ...d, lancamentos: d.lancamentos.filter(x => x.id !== id) },
          'registro_excluido', l?.descricao || 'Título', brlBruto(l?.valor) + ' removido do financeiro');
      }),
      excluirTarefa: (id) => setDados(d => {
        const t = d.tarefas.find(x => x.id === id);
        return aud({ ...d, tarefas: d.tarefas.filter(x => x.id !== id) },
          'registro_excluido', t?.titulo || 'Tarefa', 'Tarefa removida da lista');
      }),
      excluirUsuario: (id) => setDados(d => {
        const u = d.usuarios.find(x => x.id === id);
        return aud({ ...d, usuarios: d.usuarios.filter(x => x.id !== id) },
          'registro_excluido', u?.nome || 'Usuário', 'Acesso excluído do sistema');
      }),

      criarAgendamento: (a) => setDados(d => aud({ ...d,
        agendamentos: [{ id:novoId(), situacao:'marcado', ...a }, ...(d.agendamentos || [])] },
        'agendamento_criado', a.nome, fmtData(a.data) + ' às ' + a.hora + (a.servico ? ' · ' + a.servico : ''))),
      editarAgendamento: (id, campos) => setDados(d => {
        const a = (d.agendamentos || []).find(x => x.id === id);
        const detalhe = campos.situacao === 'chegou' ? 'Chegada registrada'
          : campos.situacao === 'cancelado' ? 'Horário cancelado' : 'Agendamento alterado';
        return aud({ ...d, agendamentos: (d.agendamentos || []).map(x => x.id === id ? { ...x, ...campos } : x) },
          'agendamento_editado', a?.nome || 'Agendamento', detalhe);
      }),

      lerTudo: () => setDados(d => ({ ...d, lidos: achados.map(a => a.id) })),
    };
  }, [dados.ordens, papel, achados, usuarioAtual]);

  const resultados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (q.length < 2) return [];
    const r = [];
    metricas.veiculos.forEach(v => {
      if ([v.placa, v.marca, v.modelo].some(x => String(x).toLowerCase().includes(q)))
        r.push({ tipo:'Veículo', titulo: v.marca + ' ' + v.modelo, apoio: v.placa, abrir: () => setVeiculoAberto(v.id) });
    });
    metricas.clientes.forEach(c => {
      if ([c.nome, c.telefone, c.documento].some(x => String(x || '').toLowerCase().includes(q)))
        r.push({ tipo:'Cliente', titulo: c.nome, apoio: fmtTel(c.telefone), abrir: () => setClienteAberto(c.id) });
    });
    metricas.ordens.forEach(o => {
      if (String(o.numero).includes(q))
        r.push({ tipo:'Ordem', titulo:'OS ' + o.numero, apoio: o.veiculo?.marca + ' ' + o.veiculo?.modelo, abrir: () => setOsAberta(o.id) });
    });
    return r.slice(0, 6);
  }, [busca, metricas]);

  const TITULOS = {
    painel: ['Painel', new Date().toLocaleDateString('pt-BR', { weekday:'long', day:'numeric', month:'long' })],
    patio: ['Pátio', ehMobile ? 'Escolha a etapa e avance os veículos' : 'Arraste os cartões entre as etapas'],
    ordens: ['Ordens de serviço', metricas.ativas.length + ' no pátio · ' + metricas.concluidas.length + ' concluídas'],
    preventiva: ['Manutenção preventiva', metricas.preventiva.filter(v => v.vencidos.length).length + ' veículos com serviço vencido'],
    auditoria: ['Auditoria', dados.auditoria.length + ' registros de alteração'],
    garantias: ['Garantias', metricas.garantiasVigentes.length + ' serviços ainda cobertos'],
    nova: ['Nova ordem de serviço', 'Entrada de veículo'],
    estoque: ['Estoque', metricas.estoqueBaixo.length ? metricas.estoqueBaixo.length + ' peças abaixo do mínimo' : 'Estoque saudável'],
    financeiro: ['Financeiro', 'Contas a receber e a pagar'],
    relatorios: ['Relatórios', 'Financeiro, operacional, clientes e estoque'],
    automacoes: ['Automações', 'Regras de comunicação com o cliente'],
    ajustes: ['Ajustes', 'Conexão, acesso e regras de negócio'],
  };
  const par = TITULOS[vista] || TITULOS_EXTRA[vista]?.(dados, metricas, achados) || [NAV.find(n => n.id === vista)?.nome || '', ''];
  const titulo = par[0], sub = par[1];

  const contexto = { dados, metricas, achados, acoes, papel, setPapel, tema, setTema, irPara, ehMobile, modo, avisar, medida, cofre, cofreServidor, nuvem,
    abrirOS: (id, op) => { setOsAberta(id); setOsEditando(Boolean(op && op.editar)); },
    abrirCliente: setClienteAberto, abrirVeiculo: setVeiculoAberto,
    abrirNotificacoes: () => setNotificacoes(true), abrirDocumento: setDocumento };

  const TELAS = {
    painel: html`<${TelaPainelExecutivo} />`, patio: html`<${TelaPatio} />`, ordens: html`<${TelaOrdens} />`,
    nova: html`<${TelaNovaOS} />`,
    cadastros: html`<${TelaCadastros} aba=${abaCadastro} aoTrocarAba=${setAbaCadastro} />`,
    estoque: html`<${TelaEstoque} />`, financeiro: html`<${TelaFinanceiro} />`, relatorios: html`<${TelaRelatorios} />`,
    automacoes: html`<${TelaAutomacoes} />`, ajustes: html`<${TelaAjustes} />`,
    preventiva: html`<${TelaPreventiva} />`, auditoria: html`<${TelaAuditoria} />`,
    garantias: html`<${TelaGarantias} />`,
  };
  const telaPedida = TELAS[vista] || TELAS_EXTRA[vista]?.() || html`<${TelaEmConstrucao} nome=${titulo} />`;
  /* Relatório inteiro mascarado é tela quebrada. A porta explica e abre.
     AUDITORIA (fase 12): a condição era `valorOculto()`, que também depende do
     sigilo. Quem desligasse "esconder fora daqui" dentro do cofre e depois
     travasse entrava em caixa, rentabilidade e relatórios sem digitar senha
     nenhuma — o sigilo é sobre mostrar número, a tranca é sobre entrar. */
  const conteudo = (ROTAS_COFRE.includes(vista) && !cofreAberto)
    ? html`<${CofrePortao} vista=${vista} />` : telaPedida;
  /* A chave inclui o cofre: memórias de tela guardam texto já formatado, e
     sem remontar elas continuariam mostrando o valor da versão anterior. */
  const chaveVista = vista + (cofreAberto ? '·aberto' : '') + (sigilo ? '' : '·livre');

  const navegacao = html`<${TrilhoNav} vista=${vista} irPara=${irPara} ehMobile=${ehMobile} />`;

  /* Link do cliente: chega por #/os/<numero>/<token> e não abre o sistema.
     Fica depois de todos os hooks para não alterar a ordem deles. */
  /* A vista do cliente ganhou barreira: o pacote chega pelo endereço e um
     campo faltando não pode virar tela branca na mão de quem só quer ver o
     orçamento. */
  /* ── Portas de entrada ─────────────────────────────────────────────────
     Depois de todos os hooks, para não alterar a ordem deles entre renders. */
  if (modo === 'supabase' && !ROTA_PUBLICA && !autenticado) {
    return html`<${TelaEntrada} nuvem=${nuvem} aoEntrar=${() => setAutenticado(true)} />`;
  }
  if (modo === 'supabase' && !ROTA_PUBLICA && carregando && !dados.contexto) {
    return html`
      <div style="min-height:100dvh;display:flex;flex-direction:column;align-items:center;
                  justify-content:center;gap:14px;background:var(--papel)">
        <span style="width:34px;height:34px;border:3px solid var(--linha);
                     border-top-color:var(--azul-acao);border-radius:99px;
                     animation:girar .8s linear infinite"></span>
        <p class="silencioso">Carregando a oficina…</p>
      </div>`;
  }
  if (modo === 'supabase' && !ROTA_PUBLICA && falhaCarga && !dados.contexto) {
    return html`
      <div style="min-height:100dvh;display:flex;align-items:center;justify-content:center;padding:24px">
        <div class="cartao" style="max-width:420px;padding:22px">
          <h2 style="margin-bottom:8px">Não deu para abrir a oficina</h2>
          <p class="secundario" style="margin-bottom:16px">${falhaCarga}</p>
          <div style="display:flex;gap:8px">
            <button class="btn btn-primario" onClick=${() => window.location.reload()}>Tentar de novo</button>
            <button class="btn btn-neutro" onClick=${() => { nuvem.sair(); setAutenticado(false); }}>Sair</button>
          </div>
        </div>
      </div>`;
  }

  if (ROTA_PUBLICA) return html`
    <${Ctx.Provider} value=${contexto}>
      <${Barreira} onde="link do cliente" chave=${ROTA_PUBLICA.tipo}>
        ${ROTA_PUBLICA.tipo === 'foto'
          ? html`<${VistaEmpacotada} carga=${ROTA_PUBLICA.carga} />`
          : html`<${VistaPublica} rota=${ROTA_PUBLICA} dados=${dados} metricas=${metricas} />`}
      <//>
    <//>`;

  return html`
    <${Ctx.Provider} value=${contexto}>
      <div class="app" data-foco=${emFocoOS ? 'os' : undefined}>
        <aside class="trilho">
          <div class="trilho-marca">
            ${dados.oficina.logo
              ? html`<img src=${dados.oficina.logo} alt="" style="max-height:32px;max-width:32px;object-fit:contain;flex-shrink:0" />`
              : html`<span style="width:30px;height:30px;border-radius:8px;background:var(--azul-acao);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                  <${Icone} nome="chave" tam=${16} cor="#fff" /></span>`}
            <div style="line-height:1.15;min-width:0">
              <div class="nome">Nitro</div>
              <div class="oficina corta">${dados.oficina.nome}</div>
            </div>
          </div>
          ${navegacao}
          <div class="trilho-rodape">
            <button class="trilho-usuario" onClick=${() => irPara('ajustes')}>
              <span style="width:30px;height:30px;border-radius:99px;background:rgba(255,255,255,.14);color:#fff;font-size:11.5px;font-weight:700;display:flex;align-items:center;justify-content:center">${iniciais(usuarioAtual?.nome)}</span>
              <div style="text-align:left;line-height:1.2;min-width:0">
                <div class="corta" style="font-size:12.5px;font-weight:600;color:#fff">${usuarioAtual?.nome}</div>
                <div style="font-size:11px;opacity:.7">${PAPEIS[papel].nome}</div>
              </div>
            </button>
          </div>
        </aside>

        <div class="corpo">
          <header class="topo">
            <button class="btn btn-fantasma btn-icone so-mobile" onClick=${() => setMenuMobile(true)} aria-label="Abrir menu">
              <${Icone} nome="menu" /></button>
            <div class="busca" style="max-width:420px;position:relative">
              <${Icone} nome="busca" tam=${15} cor="var(--tinta-3)" />
              <input id="busca-topo" value=${busca} onInput=${e => setBusca(e.target.value)}
                placeholder=${ehMobile ? 'Buscar' : 'Buscar por placa, OS, cliente ou telefone'} aria-label="Busca geral" />
              ${!ehMobile ? html`<kbd class="mono" style="font-size:10.5px;color:var(--tinta-3);border:1px solid var(--linha);border-radius:5px;padding:1px 6px">/</kbd>` : null}
              ${resultados.length > 0 ? html`
                <div style="position:absolute;top:44px;left:0;right:0;background:var(--elevado);border:1px solid var(--linha);border-radius:var(--raio);box-shadow:var(--sombra-alta);z-index:30;overflow:hidden">
                  ${resultados.map((x, i) => html`
                    <button key=${i} onClick=${() => { x.abrir(); setBusca(''); }}
                      style="display:flex;align-items:center;gap:11px;width:100%;padding:10px 13px;text-align:left;border-bottom:1px solid var(--linha-suave)">
                      <span class="selo" style="font-size:10.5px">${x.tipo}</span>
                      <span style="flex:1;font-size:13.5px;font-weight:500">${x.titulo}</span>
                      <span class="silencioso mono">${x.apoio}</span>
                    </button>`)}
                </div>` : null}
            </div>
            ${pode(papel, 'criar') ? html`
              <button class="btn btn-primario" onClick=${() => irPara('nova')}>
                <${Icone} nome="mais" tam=${15} /><span class="esconde-mobile">Nova OS</span></button>` : null}
            ${modo === 'supabase' ? html`
              <${SeloSincronia} estado=${sincronia} aoTentar=${() => fila.girar()}
                aoAbrirRecusadas=${() => setVerRecusadas(true)} />` : null}
            <${BotaoCofre} />
            <button class="btn btn-neutro btn-icone esconde-mobile" onClick=${() => setTema(t => t === 'claro' ? 'escuro' : 'claro')}
              aria-label=${tema === 'claro' ? 'Ativar tema escuro' : 'Ativar tema claro'}>
              <${Icone} nome=${tema === 'claro' ? 'lua' : 'sol'} tam=${15} /></button>
            <button class="btn btn-neutro btn-icone" style="position:relative" onClick=${() => setNotificacoes(true)}
              aria-label=${'Notificações' + (naoLidos ? ', ' + naoLidos + ' sem leitura' : '')}>
              <${Icone} nome="sino" tam=${15} />
              ${naoLidos > 0 ? html`<span style="position:absolute;top:4px;right:4px;min-width:15px;height:15px;padding:0 3px;border-radius:99px;background:var(--erro);color:#fff;font-size:9.5px;font-weight:700;display:flex;align-items:center;justify-content:center">${naoLidos}</span>` : null}
            </button>
          </header>

          <main class="conteudo">
            ${modo === 'supabase' ? html`
              <${FaixaNaoGravado} estado=${sincronia} aoAbrir=${() => setVerRecusadas(true)} />` : null}
            <div class="cabecalho-pagina">
              <div>
                <h1 style="text-transform:capitalize">${titulo}</h1>
                <p class="silencioso" style="margin-top:3px">${sub}</p>
              </div>
              ${vista === 'painel' ? html`
                <div style="display:flex;gap:8px;flex-wrap:wrap">
                  ${modo === 'demo' ? html`<${Selo} tom="roxo">Modo demonstração<//>` : null}
                  ${modo === 'supabase' ? html`<${Selo} tom="ciano" icone="check">Conectado ao banco<//>` : null}
                  <${Selo} tom="ok" icone="check">Caixa aberto<//>
                </div>` : null}
            </div>
            <${Barreira} onde=${vista} chave=${chaveVista}><div key=${chaveVista}>${conteudo}</div><//>
          </main>

          <nav class="barra-inferior" aria-label="Navegação principal">
            ${NAV_MOBILE.map(id => {
              if (id === 'nova') return html`
                <button key="nova" onClick=${() => irPara('nova')} aria-label="Nova ordem de serviço">
                  <span style="width:38px;height:38px;border-radius:11px;background:var(--azul-acao);color:#fff;display:flex;align-items:center;justify-content:center;margin-top:-12px;box-shadow:var(--sombra)">
                    <${Icone} nome="mais" tam=${20} /></span>
                  <span style="margin-top:-2px">Nova OS</span></button>`;
              if (id === 'mais') return html`
                <button key="mais" onClick=${() => setMenuMobile(true)}>
                  <${Icone} nome="menu" tam=${19} /><span>Mais</span></button>`;
              const n = NAV.find(x => x.id === id);
              return html`
                <button key=${id} aria-current=${vista === id ? 'page' : undefined} onClick=${() => irPara(id)}>
                  <${Icone} nome=${n.icone} tam=${19} /><span>${n.nome}</span></button>`;
            })}
          </nav>
        </div>

        ${menuMobile ? html`
          <div class="cortina" style="align-items:stretch;justify-content:flex-start;padding:0"
            onClick=${e => { if (e.target === e.currentTarget) setMenuMobile(false); }}>
            <aside style="width:272px;background:var(--trilho);display:flex;flex-direction:column;height:100%">
              <div class="trilho-marca">
                <span style="width:30px;height:30px;border-radius:8px;background:var(--azul-acao);display:flex;align-items:center;justify-content:center">
                  <${Icone} nome="chave" tam=${16} cor="#fff" /></span>
                <div style="line-height:1.15;flex:1">
                  <div class="nome">Nitro</div>
                  <div class="oficina corta">${dados.oficina.nome}</div>
                </div>
                <button class="btn btn-fantasma btn-icone" style="color:var(--trilho-texto)" onClick=${() => setMenuMobile(false)} aria-label="Fechar menu">
                  <${Icone} nome="x" /></button>
              </div>
              ${navegacao}
              <div class="trilho-rodape">
                <button class="trilho-item" onClick=${() => setTema(t => t === 'claro' ? 'escuro' : 'claro')}>
                  <${Icone} nome=${tema === 'claro' ? 'lua' : 'sol'} tam=${17} />
                  <span>Tema ${tema === 'claro' ? 'escuro' : 'claro'}</span></button>
              </div>
            </aside>
          </div>` : null}

        ${iaMontada ? html`
          <button class="flutuante" data-estado=${emFocoOS ? 'saindo' : 'entrando'}
            tabindex=${emFocoOS ? -1 : undefined} aria-hidden=${emFocoOS ? 'true' : undefined}
            onClick=${() => setCopiloto(true)} aria-label="Abrir o copiloto da oficina">
            <${Icone} nome="robo" tam=${18} /><span>Perguntar</span>
          </button>` : null}

        ${assistente && !emFocoOS ? html`<${GavetaAssistente} aoFechar=${() => setAssistente(false)} />` : null}
        ${copiloto && !emFocoOS ? html`<${CopilotoPainel} vista=${vista} titulo=${titulo} aoFechar=${() => setCopiloto(false)} />` : null}
        ${notificacoes ? html`<${GavetaNotificacoes} aoFechar=${() => setNotificacoes(false)} />` : null}
        ${verRecusadas ? html`<${ModalRecusadas} estado=${sincronia}
          aoFechar=${() => setVerRecusadas(false)}
          aoLimpar=${() => fila.esquecerRecusadas()} />` : null}
        ${osAberta ? html`<${DetalheOS} id=${osAberta} editarAoAbrir=${osEditando}
          aoFechar=${() => { setOsAberta(null); setOsEditando(false); }} />` : null}
        ${clienteAberto ? html`<${FichaCliente} id=${clienteAberto} aoFechar=${() => setClienteAberto(null)} />` : null}
        ${veiculoAberto ? html`<${Prontuario} id=${veiculoAberto} aoFechar=${() => setVeiculoAberto(null)} />` : null}
        ${documento ? html`<${ModalDocumento} tipo=${documento.tipo} os=${documento.os}
          veiculo=${documento.veiculo} aoFechar=${() => setDocumento(null)} />` : null}
        ${pedindoSenha ? html`<${ModalSenhaCofre} modo=${pedindoSenha}
          aoFechar=${() => { destravarSemSair.current = false; setPedindoSenha(null); }}
          aoLiberar=${liberarCofre} />` : null}
        ${brinde ? html`<div class="brinde" role="status">${brinde}</div>` : null}
      </div>
    <//>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   FASE 13 — O ARQUIVO, O ENVIO E A ASSINATURA
   Aditiva como as anteriores. Três buracos que apareceram no uso real:

   1. "Gerar PDF" era `window.print()`. Abria a caixa de impressão e esperava
      que a pessoa achasse "Salvar como PDF" no meio dos destinos. Nenhum
      arquivo era produzido pelo sistema — e no celular, que é onde a oficina
      trabalha, esse caminho quase não existe.

   2. WhatsApp aparecia como rótulo em quatro regras de automação, todas
      desligadas, e como aviso dizendo que a integração "se conecta em
      Automações". Não havia uma linha que enviasse coisa alguma.

   3. O link do cliente abria em modo leitura. Quem aprovava o orçamento era
      o funcionário, clicando "Registrar aprovação" — a oficina aprovando em
      nome de quem paga. O banco já tinha `portal_responder(token, aprova,
      motivo)` liberada para `anon` desde o primeiro dia; ninguém chamava.

   ══════════════════════════════════════════════════════════════════════════
   13.1 PDF ESCRITO À MÃO
   A política de conteúdo do próprio arquivo é `script-src 'self'`: buscar
   jsPDF num CDN é bloqueado pelo navegador antes de baixar. Como o documento
   é texto posicionado, tabela e linha, sai mais barato escrever o PDF do que
   afrouxar a política — que existe para impedir exatamente esse tipo de
   carga externa.

   PDF 1.4, fontes Helvetica e Helvetica-Bold (as catorze do padrão, que todo
   leitor tem e não precisam ser embutidas) com WinAnsiEncoding, que cobre o
   português inteiro: acento, cedilha, til.                                */

/* Larguras oficiais da Helvetica, em milésimos do corpo. Sem elas não há
   alinhamento à direita: coluna de dinheiro desalinhada é o que faz um
   documento parecer feito às pressas. */
/* Registro de largura fixa: 1 caractere + 4 dígitos. O formato compacto
   anterior — caractere seguido de 3 ou 4 dígitos sem delimitador — era
   ambíguo: '0556' podia ser o '0' medindo 556 ou o '05' medindo 56, e a
   expressão regular escolhia errado. Toda coluna alinhada à direita saía
   fora do lugar, porque a soma dava cinco vezes a largura real. */
function destrincharLarguras(bruto) {
  const t = {};
  for (let i = 0; i + 5 <= bruto.length; i += 5) t[bruto[i]] = Number(bruto.slice(i + 1, i + 5));
  return t;
}

const LARGURAS_HELV = destrincharLarguras(
  '00556105562055630556405565055660556705568055690556 0278!0278"0355#0556$0556%0889&0667\'0191(0333)0333*0389+0584,0278-0333.0278/0278:0278;0278<0584=0584>0584?0556@1015A0667B0667C0722D0722E0667F0611G0778H0722I0278J0500K0667L0556M0833N0722O0778P0667Q0778R0722S0667T0611U0722V0667W0944X0667Y0667Z0611[0278\\0278]0278^0469_0556`0333a0556b0556c0500d0556e0556f0278g0556h0556i0222j0222k0500l0222m0833n0556o0556p0556q0556r0333s0500t0278u0556v0500w0722x0500y0500z0500{0334|0260}0334~0584');

const LARGURAS_HELV_NEGRITO = destrincharLarguras(
  '00556105562055630556405565055660556705568055690556 0278!0333"0474#0556$0556%0889&0722\'0278(0333)0333*0389+0584,0278-0333.0278/0278:0333;0333<0584=0584>0584?0611@0975A0722B0722C0722D0722E0667F0611G0778H0722I0278J0556K0722L0611M0833N0722O0778P0667Q0778R0722S0667T0611U0722V0667W0944X0667Y0667Z0611[0333\\0278]0333^0584_0556`0333a0556b0611c0556d0611e0556f0333g0611h0611i0278j0278k0556l0278m0889n0611o0611p0611q0611r0389s0556t0333u0611v0556w0778x0556y0556z0500{0389|0280}0389~0584');

/* Letra acentuada tem a largura da letra sem acento. Vale para todas as do
   bloco Latin-1, que é o que o português usa. */
const SEM_ACENTO = 'AAAAAA CEEEEIIIIDNOOOOO OUUUUY  aaaaaa ceeeeiiiidnooooo ouuuuy y';
const larguraDoCaractere = (cp, negrito) => {
  const t = negrito ? LARGURAS_HELV_NEGRITO : LARGURAS_HELV;
  if (cp >= 32 && cp <= 126) return t[String.fromCharCode(cp)] ?? 556;
  if (cp >= 0xC0 && cp <= 0xFF) {
    const eq = SEM_ACENTO[cp - 0xC0];
    return eq && eq !== ' ' ? (t[eq] ?? 556) : 556;
  }
  return 556;
};

/** Largura de um texto, em pontos, para um dado corpo. */
function larguraTexto(txt, corpo, negrito) {
  let soma = 0;
  for (const ch of String(txt || '')) soma += larguraDoCaractere(ch.codePointAt(0), negrito);
  return (soma * corpo) / 1000;
}

/* Tipografia que o Unicode tem e o WinAnsi guarda em outro lugar. Sem esta
   tabela, o travessão dos títulos e as aspas curvas viravam interrogação. */
const WINANSI_FORA_DA_FAIXA = {
  0x2013: 0x96, 0x2014: 0x97, 0x2018: 0x91, 0x2019: 0x92,
  0x201C: 0x93, 0x201D: 0x94, 0x2022: 0x95, 0x2026: 0x85,
  0x20AC: 0x80, 0x2122: 0x99, 0x2039: 0x8B, 0x203A: 0x9B,
};
const byteWinAnsi = (cp) => cp <= 0xFF ? cp : (WINANSI_FORA_DA_FAIXA[cp] ?? 0x3F);

/** Texto → literal de string do PDF, já em bytes WinAnsi e com escapes. */
function literalPDF(txt) {
  const saida = [];
  for (const ch of String(txt ?? '')) {
    const b = byteWinAnsi(ch.codePointAt(0));
    if (b === 0x28 || b === 0x29 || b === 0x5C) saida.push(0x5C);   // ( ) \
    saida.push(b);
  }
  return saida;
}

/** Quebra um texto em linhas que cabem na largura pedida. */
function quebrarLinhas(txt, largura, corpo, negrito) {
  const palavras = String(txt || '').split(/\s+/).filter(Boolean);
  const linhas = [];
  let atual = '';
  for (const p of palavras) {
    const teste = atual ? atual + ' ' + p : p;
    if (larguraTexto(teste, corpo, negrito) > largura && atual) { linhas.push(atual); atual = p; }
    else atual = teste;
  }
  if (atual) linhas.push(atual);
  return linhas.length ? linhas : [''];
}

/* ── Imagem ────────────────────────────────────────────────────────────────
   Só JPEG. O PDF embute JPEG sem tocar nos bytes, pelo filtro /DCTDecode —
   é copiar e colar. PNG exigiria desfazer os filtros por linha e recomprimir,
   trabalho que não se paga para um traço de assinatura. Por isso o quadro de
   assinatura exporta em JPEG sobre fundo branco.                          */

/** Base64 → bytes. */
function bytesDeBase64(b64) {
  const bin = atob(b64);
  const saida = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) saida[i] = bin.charCodeAt(i);
  return saida;
}

/** Largura e altura lidas do marcador SOF do próprio JPEG. */
function medidasJPEG(bytes) {
  let i = 2;
  while (i < bytes.length - 9) {
    if (bytes[i] !== 0xFF) { i++; continue; }
    const marcador = bytes[i + 1];
    /* C0 a CF são início de quadro, menos C4 (Huffman), C8 (extensão) e CC
       (aritmética) — esses três não trazem dimensão. */
    if (marcador >= 0xC0 && marcador <= 0xCF &&
        marcador !== 0xC4 && marcador !== 0xC8 && marcador !== 0xCC) {
      return { altura: (bytes[i + 5] << 8) | bytes[i + 6],
               largura: (bytes[i + 7] << 8) | bytes[i + 8] };
    }
    i += 2 + ((bytes[i + 2] << 8) | bytes[i + 3]);
  }
  return null;
}

/* ── O construtor ──────────────────────────────────────────────────────────
   A4 em pontos: 595,28 × 841,89. A origem do PDF fica embaixo à esquerda;
   aqui o `y` conta de cima para baixo, como todo mundo lê, e a conversão
   acontece num lugar só.                                                   */
function criarPDF({ margem = 44 } = {}) {
  const LARG = 595.28, ALT = 841.89;
  const paginas = [];
  let fluxo = null;
  let corAtual = null;
  const imagens = [];        // XObjects, compartilhados por todas as páginas

  const abrirPagina = () => { fluxo = []; paginas.push(fluxo); return fluxo; };
  abrirPagina();

  const num = (n) => (Math.round(n * 100) / 100).toString();
  const emY = (y) => ALT - y;

  const definirCor = (hex, traco) => {
    const chave = (traco ? 'T' : 'F') + hex;
    if (corAtual === chave) return;
    corAtual = chave;
    const h = String(hex || '#000').replace('#', '');
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    fluxo.push(`${num(r)} ${num(g)} ${num(b)} ${traco ? 'RG' : 'rg'}`);
  };

  const api = {
    LARG, ALT, margem,
    get larguraUtil() { return LARG - margem * 2; },

    novaPagina() { abrirPagina(); corAtual = null; return api; },
    get paginas() { return paginas.length; },

    /** Escreve e devolve a altura consumida. `alinhar`: 'esq' | 'dir' | 'centro'. */
    texto(txt, x, y, { corpo = 10, negrito = false, cor = '#101418', alinhar = 'esq', largura = 0 } = {}) {
      const linha = String(txt ?? '');
      if (!linha) return 0;
      definirCor(cor, false);
      let px = x;
      if (alinhar === 'dir')    px = x - larguraTexto(linha, corpo, negrito);
      if (alinhar === 'centro') px = x + (largura - larguraTexto(linha, corpo, negrito)) / 2;
      const bytes = literalPDF(linha);
      fluxo.push(`BT /${negrito ? 'F2' : 'F1'} ${num(corpo)} Tf 1 0 0 1 ${num(px)} ${num(emY(y))} Tm`);
      fluxo.push({ literal: bytes });
      fluxo.push('ET');
      return corpo * 1.18;
    },

    /** Parágrafo com quebra automática. Devolve o `y` seguinte. */
    paragrafo(txt, x, y, largura, { corpo = 9.5, negrito = false, cor = '#3A4457', entre = 1.35 } = {}) {
      const linhas = quebrarLinhas(txt, largura, corpo, negrito);
      let cursor = y;
      for (const l of linhas) {
        api.texto(l, x, cursor, { corpo, negrito, cor });
        cursor += corpo * entre;
      }
      return cursor;
    },

    /** Desenha um JPEG em data URL. Devolve a altura usada, ou 0 se recusado. */
    imagem(dataUrl, x, y, larguraAlvo) {
      const m = /^data:image\/jpe?g;base64,([A-Za-z0-9+/=]+)$/.exec(String(dataUrl || ''));
      if (!m) return 0;
      let bytes, medidas;
      try { bytes = bytesDeBase64(m[1]); medidas = medidasJPEG(bytes); }
      catch (_) { return 0; }
      if (!medidas || !medidas.largura) return 0;
      const alturaAlvo = larguraAlvo * (medidas.altura / medidas.largura);
      const nome = 'Im' + (imagens.length + 1);
      imagens.push({ nome, bytes, ...medidas });
      fluxo.push('q');
      fluxo.push(`${num(larguraAlvo)} 0 0 ${num(alturaAlvo)} ${num(x)} ${num(emY(y + alturaAlvo))} cm`);
      fluxo.push(`/${nome} Do`);
      fluxo.push('Q');
      corAtual = null;   // `Q` restaura o estado gráfico: a cor volta ao anterior
      return alturaAlvo;
    },

    linha(x1, y1, x2, y2, { cor = '#D8DEE9', espessura = 0.6 } = {}) {
      definirCor(cor, true);
      fluxo.push(`${num(espessura)} w ${num(x1)} ${num(emY(y1))} m ${num(x2)} ${num(emY(y2))} l S`);
      return api;
    },

    retangulo(x, y, larg, alt, { preenche = '#F2F5FA', borda = null, espessura = 0.6 } = {}) {
      if (preenche) {
        definirCor(preenche, false);
        fluxo.push(`${num(x)} ${num(emY(y + alt))} ${num(larg)} ${num(alt)} re f`);
      }
      if (borda) {
        definirCor(borda, true);
        fluxo.push(`${num(espessura)} w ${num(x)} ${num(emY(y + alt))} ${num(larg)} ${num(alt)} re S`);
      }
      return api;
    },

    /** Monta os objetos, calcula a tabela de referência e devolve o Blob. */
    blob() {
      const bytes = [];
      const empurrarTexto = (s) => { for (const ch of s) bytes.push(byteWinAnsi(ch.codePointAt(0))); };
      const posicoes = [];
      const objeto = (n, corpoBytes) => {
        posicoes[n] = bytes.length;
        empurrarTexto(`${n} 0 obj\n`);
        corpoBytes.forEach(b => bytes.push(b));
        empurrarTexto('\nendobj\n');
      };
      const emBytes = (s) => { const a = []; for (const ch of s) a.push(byteWinAnsi(ch.codePointAt(0))); return a; };

      empurrarTexto('%PDF-1.4\n');
      /* Comentário com bytes altos: sinaliza aos leitores que o arquivo é
         binário e não deve sofrer conversão de fim de linha no transporte. */
      bytes.push(0x25, 0xE2, 0xE3, 0xCF, 0xD3, 0x0A);

      const idPagina = (i) => 4 + i * 2;
      const idFluxo  = (i) => 5 + i * 2;
      const idImagem = (k) => 4 + paginas.length * 2 + k;
      const totalObj = 3 + paginas.length * 2 + imagens.length;
      /* Todas as páginas enxergam todas as imagens. Uma assinatura repetida
         em duas páginas não é embutida duas vezes. */
      const recursoXObj = imagens.length
        ? ' /XObject << ' + imagens.map((im, k) => `/${im.nome} ${idImagem(k)} 0 R`).join(' ') + ' >>'
        : '';

      objeto(1, emBytes('<< /Type /Catalog /Pages 2 0 R >>'));
      objeto(2, emBytes('<< /Type /Pages /Kids ['
        + paginas.map((_, i) => `${idPagina(i)} 0 R`).join(' ')
        + `] /Count ${paginas.length} >>`));
      objeto(3, emBytes(
        '<< /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'
        + ' /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >> >>'));

      paginas.forEach((instrucoes, i) => {
        const corpo = [];
        instrucoes.forEach((ins, k) => {
          if (k) corpo.push(0x0A);
          if (typeof ins === 'string') emBytes(ins).forEach(b => corpo.push(b));
          else { corpo.push(0x28); ins.literal.forEach(b => corpo.push(b)); corpo.push(0x29, 0x20, 0x54, 0x6A); }
        });
        objeto(idPagina(i), emBytes(
          `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${num(LARG)} ${num(ALT)}]`
          + ` /Resources << /Font 3 0 R${recursoXObj} >> /Contents ${idFluxo(i)} 0 R >>`));
        objeto(idFluxo(i), [
          ...emBytes(`<< /Length ${corpo.length} >>\nstream\n`),
          ...corpo,
          ...emBytes('\nendstream'),
        ]);
      });

      imagens.forEach((im, k) => {
        objeto(idImagem(k), [
          ...emBytes('<< /Type /XObject /Subtype /Image'
            + ` /Width ${im.largura} /Height ${im.altura}`
            + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode'
            + ` /Length ${im.bytes.length} >>\nstream\n`),
          ...im.bytes,
          ...emBytes('\nendstream'),
        ]);
      });

      const inicioXref = bytes.length;
      empurrarTexto(`xref\n0 ${totalObj + 1}\n0000000000 65535 f \n`);
      for (let n = 1; n <= totalObj; n++) {
        empurrarTexto(String(posicoes[n] ?? 0).padStart(10, '0') + ' 00000 n \n');
      }
      empurrarTexto(`trailer\n<< /Size ${totalObj + 1} /Root 1 0 R >>\nstartxref\n${inicioXref}\n%%EOF\n`);

      return new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
    },
  };
  return api;
}

/* ══ 13.2 O DOCUMENTO ══════════════════════════════════════════════════════
   Mesma informação que a folha da tela, montada em coordenadas. O documento
   sai fechado: quem recebe não precisa do sistema para ler.                */

const nomeArquivoOS = (os, oficina, tipo) => {
  const limpo = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();
  return [tipo === 'orcamento' ? 'orcamento' : 'os', String(os.numero).padStart(4, '0'),
          limpo(os.veiculo?.placa) || limpo(oficina?.nome) || 'nitro'].filter(Boolean).join('-') + '.pdf';
};

/** Monta o PDF da ordem. `tipo`: 'os' | 'orcamento'. */
function pdfDaOrdem(os, oficina, { tipo = 'os', enderecoCliente = '' } = {}) {
  const pdf = criarPDF();
  const M = pdf.margem;
  const DIR = pdf.LARG - M;
  const UTIL = pdf.larguraUtil;
  const corMarca = oficina?.cor || '#12224A';
  const t = os.totais || totaisDaOS(os.itens || [], os.desconto || 0);
  let y = M;

  /* ── Cabeçalho ───────────────────────────────────────────────────────── */
  pdf.retangulo(M, y, UTIL, 66, { preenche: corMarca });
  pdf.texto(oficina?.nome || 'Oficina', M + 16, y + 26, { corpo: 15, negrito: true, cor: '#FFFFFF' });
  const contato = [oficina?.documento ? 'CNPJ ' + fmtDoc(oficina.documento) : '',
                   oficina?.telefone ? fmtTel(oficina.telefone) : ''].filter(Boolean).join('  ·  ');
  if (contato) pdf.texto(contato, M + 16, y + 43, { corpo: 8.5, cor: '#D8E0F5' });
  if (oficina?.endereco) pdf.texto(oficina.endereco, M + 16, y + 55, { corpo: 8, cor: '#B9C6E6' });

  const titulo = tipo === 'orcamento' ? 'ORÇAMENTO' : 'ORDEM DE SERVIÇO';
  pdf.texto(titulo, DIR - 16, y + 24, { corpo: 10, negrito: true, cor: '#FFFFFF', alinhar: 'dir' });
  pdf.texto('Nº ' + os.numero, DIR - 16, y + 42, { corpo: 17, negrito: true, cor: '#FFFFFF', alinhar: 'dir' });
  pdf.texto(fmtData(os.aberta_em), DIR - 16, y + 56, { corpo: 8, cor: '#D8E0F5', alinhar: 'dir' });
  y += 66 + 22;

  /* ── Cliente e veículo, lado a lado ──────────────────────────────────── */
  const meia = (UTIL - 14) / 2;
  const bloco = (x, rotulo, linhas) => {
    pdf.texto(rotulo, x, y + 10, { corpo: 7.5, negrito: true, cor: '#7A879C' });
    let cy = y + 25;
    linhas.filter(Boolean).forEach(([chave, valor], i) => {
      pdf.texto(chave, x, cy, { corpo: 7.5, cor: '#8A96AA' });
      pdf.texto(valor, x, cy + 11, { corpo: 10, negrito: i === 0, cor: '#101418' });
      cy += 26;
    });
    return cy;
  };
  const v = os.veiculo || {}, c = os.cliente || {};
  const fimA = bloco(M, 'CLIENTE', [
    ['Nome', c.nome || '—'],
    ['Documento', c.documento ? fmtDoc(c.documento) : '—'],
    ['Telefone', c.telefone ? fmtTel(c.telefone) : '—'],
  ]);
  const fimB = bloco(M + meia + 14, 'VEÍCULO', [
    ['Placa', v.placa || '—'],
    ['Modelo', [v.marca, v.modelo, v.ano_modelo].filter(Boolean).join(' · ') || '—'],
    ['Cor / KM na entrada', [v.cor, inteiro(os.km_entrada || 0) + ' km'].filter(Boolean).join(' · ')],
  ]);
  y = Math.max(fimA, fimB) + 6;
  pdf.linha(M, y, DIR, y);
  y += 20;

  /* ── Relato ──────────────────────────────────────────────────────────── */
  if (os.relato) {
    pdf.texto('RELATO DO CLIENTE', M, y, { corpo: 7.5, negrito: true, cor: '#7A879C' });
    y = pdf.paragrafo(os.relato, M, y + 14, UTIL, { corpo: 9.5, cor: '#2C3547' }) + 10;
  }

  /* ── Itens ───────────────────────────────────────────────────────────── */
  const colQtd = DIR - 210, colUnit = DIR - 120, colTot = DIR;
  pdf.retangulo(M, y, UTIL, 20, { preenche: '#EEF2F8' });
  pdf.texto('DESCRIÇÃO', M + 8, y + 13.5, { corpo: 7.5, negrito: true, cor: '#5A6679' });
  pdf.texto('QTD', colQtd, y + 13.5, { corpo: 7.5, negrito: true, cor: '#5A6679', alinhar: 'dir' });
  pdf.texto('UNITÁRIO', colUnit, y + 13.5, { corpo: 7.5, negrito: true, cor: '#5A6679', alinhar: 'dir' });
  pdf.texto('TOTAL', colTot - 8, y + 13.5, { corpo: 7.5, negrito: true, cor: '#5A6679', alinhar: 'dir' });
  y += 20;

  const itens = os.itens || [];
  const larguraDesc = colQtd - M - 70;
  itens.forEach((i, k) => {
    /* Quebra de página: o rodapé de assinatura precisa de espaço, então a
       conta é feita antes de desenhar e não depois de estourar. */
    if (y > pdf.ALT - 190) {
      pdf.novaPagina(); y = M;
      pdf.texto((oficina?.nome || 'Oficina') + ' · OS ' + os.numero + ' (continuação)',
        M, y + 10, { corpo: 8, cor: '#8A96AA' });
      y += 26;
    }
    const linhas = quebrarLinhas(i.descricao || '—', larguraDesc, 9.5, false);
    const alturaLinha = Math.max(22, 8 + linhas.length * 12);
    if (k % 2) pdf.retangulo(M, y, UTIL, alturaLinha, { preenche: '#FAFBFD' });
    linhas.forEach((l, n) => pdf.texto(l, M + 8, y + 14 + n * 12, { corpo: 9.5, cor: '#101418' }));
    pdf.texto(i.tipo === 'peca' ? 'Peça' : 'Serviço', M + 8, y + 14 + linhas.length * 12 - 1.5,
      { corpo: 7, cor: '#8A96AA' });
    pdf.texto(String(i.quantidade ?? 1), colQtd, y + 14, { corpo: 9.5, cor: '#3A4457', alinhar: 'dir' });
    pdf.texto(brlBruto(i.preco_unitario || 0), colUnit, y + 14, { corpo: 9.5, cor: '#3A4457', alinhar: 'dir' });
    pdf.texto(brlBruto((i.quantidade ?? 1) * (i.preco_unitario || 0)), colTot - 8, y + 14,
      { corpo: 9.5, negrito: true, cor: '#101418', alinhar: 'dir' });
    y += alturaLinha;
    pdf.linha(M, y, DIR, y, { cor: '#EDF1F7' });
  });
  if (!itens.length) {
    pdf.texto('Nenhum item lançado até aqui.', M + 8, y + 16, { corpo: 9.5, cor: '#8A96AA' });
    y += 28;
  }
  y += 16;

  /* ── Totais ──────────────────────────────────────────────────────────── */
  const larguraTotais = 220;
  const xT = DIR - larguraTotais;
  const linhaTotal = (rotulo, valor, { forte = false } = {}) => {
    pdf.texto(rotulo, xT, y, { corpo: forte ? 10.5 : 9, negrito: forte, cor: forte ? '#101418' : '#5A6679' });
    pdf.texto(valor, DIR, y, { corpo: forte ? 13 : 9.5, negrito: forte, cor: forte ? corMarca : '#2C3547', alinhar: 'dir' });
    y += forte ? 22 : 15;
  };
  linhaTotal('Peças', brlBruto(t.pecas));
  linhaTotal('Mão de obra', brlBruto(t.servicos));
  if (t.desconto > 0) linhaTotal('Desconto', '- ' + brlBruto(t.desconto));
  pdf.linha(xT, y - 4, DIR, y - 4);
  y += 10;
  linhaTotal('TOTAL', brlBruto(t.liquido), { forte: true });

  /* ── Condições ───────────────────────────────────────────────────────── */
  y += 6;
  const condicoes = [
    tipo === 'orcamento' && os.validade_dias ? 'Orçamento válido por ' + os.validade_dias + ' dias.' : '',
    os.garantia_dias ? 'Garantia de ' + os.garantia_dias + ' dias sobre o serviço executado.' : '',
    os.obs_orcamento || '',
  ].filter(Boolean).join(' ');
  if (condicoes) {
    pdf.texto('CONDIÇÕES', M, y, { corpo: 7.5, negrito: true, cor: '#7A879C' });
    y = pdf.paragrafo(condicoes, M, y + 14, UTIL - larguraTotais - 20, { corpo: 8.5, cor: '#5A6679' });
  }

  /* ── Aprovação ───────────────────────────────────────────────────────── */
  y = Math.max(y + 24, pdf.ALT - 132);
  if (os.aprovado_por && os.aprovada_em) {
    /* Já respondida pelo link: o documento diz quem aprovou e quando, e a
       linha de assinatura some — pedir rubrica no que já foi aceito é o tipo
       de papel que a oficina guarda sem saber para quê. */
    const temTraco = Boolean(os.assinatura_cliente);
    const altura = temTraco ? 96 : 44;
    pdf.retangulo(M, y, UTIL, altura, { preenche: '#E9F5EE', borda: '#BBDCC8' });
    pdf.texto('APROVADO PELO CLIENTE', M + 14, y + 18, { corpo: 8, negrito: true, cor: '#0F7A46' });
    pdf.texto((os.assinante_nome || os.cliente?.nome || os.aprovado_por) + '  ·  ' + fmtDataHora(os.aprovada_em),
      M + 14, y + 33, { corpo: 9.5, cor: '#1C6340' });
    if (temTraco) {
      /* O traço vem do quadro do link, na proporção em que foi desenhado. */
      pdf.imagem(os.assinatura_cliente, M + 14, y + 42, 190);
      pdf.linha(M + 14, y + 84, M + 204, y + 84, { cor: '#0F7A46', espessura: 0.7 });
      pdf.texto('Assinatura recolhida pelo link, sem papel.', M + 216, y + 66,
        { corpo: 7.5, cor: '#1C6340' });
    }
    y += altura + 16;
  } else {
    const meiaAss = (UTIL - 40) / 2;
    pdf.linha(M, y, M + meiaAss, y, { cor: '#101418', espessura: 0.8 });
    pdf.linha(DIR - meiaAss, y, DIR, y, { cor: '#101418', espessura: 0.8 });
    pdf.texto(os.cliente?.nome || 'Cliente', M + meiaAss / 2, y + 12,
      { corpo: 8, cor: '#5A6679', alinhar: 'centro', largura: 0 });
    pdf.texto(oficina?.nome || 'Oficina', DIR - meiaAss / 2, y + 12,
      { corpo: 8, cor: '#5A6679', alinhar: 'centro', largura: 0 });
    y += 30;
  }

  if (enderecoCliente) {
    pdf.texto('Aprove pelo celular: ' + enderecoCliente, M, y + 6, { corpo: 7.5, cor: corMarca });
    y += 14;
  }
  pdf.texto('Documento gerado pelo Nitro em ' + fmtDataHora(new Date().toISOString()),
    M, pdf.ALT - M + 6, { corpo: 7, cor: '#9AA5B8' });

  return pdf.blob();
}

/* ══ 13.3 ENVIO ════════════════════════════════════════════════════════════
   Duas rotas, porque celular e computador não têm a mesma capacidade:

   · No celular, `navigator.share` com arquivo abre a folha nativa e o
     WhatsApp aparece nela. O PDF vai anexado de verdade — é o "enviar direto
     ao contato do cliente" pedido.
   · No computador, o WhatsApp Web não aceita anexo por endereço. Então o
     arquivo é baixado e a conversa abre com o texto e o link já prontos.  */

const podeCompartilharArquivo = (arquivo) => {
  try { return Boolean(navigator.canShare && navigator.canShare({ files: [arquivo] })); }
  catch (_) { return false; }
};

function baixarBlob(nome, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = nome;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Texto da mensagem. Curto: o que não couber no visor não é lido. */
function mensagemDaOrdem(os, oficina, endereco, tipo) {
  const t = os.totais || totaisDaOS(os.itens || [], os.desconto || 0);
  const carro = [os.veiculo?.marca, os.veiculo?.modelo].filter(Boolean).join(' ');
  const primeiro = String(os.cliente?.nome || '').trim().split(/\s+/)[0] || 'tudo bem';
  const linhas = [
    `Olá, ${primeiro}! Aqui é da ${oficina?.nome || 'oficina'}.`,
    '',
    tipo === 'orcamento'
      ? `Segue o orçamento do seu ${carro}${os.veiculo?.placa ? ' (placa ' + os.veiculo.placa + ')' : ''}.`
      : `Segue a ordem de serviço nº ${os.numero} do seu ${carro}${os.veiculo?.placa ? ' (placa ' + os.veiculo.placa + ')' : ''}.`,
    `Total: ${brlBruto(t.liquido)}${t.desconto > 0 ? ' (já com desconto de ' + brlBruto(t.desconto) + ')' : ''}.`,
  ];
  if (tipo === 'orcamento' && os.validade_dias) linhas.push(`Válido por ${os.validade_dias} dias.`);
  if (endereco) {
    linhas.push('');
    linhas.push(os.etapa === 'aprovacao'
      ? `Para aprovar ou recusar direto pelo celular, é só abrir:\n${endereco}`
      : `Acompanhe pelo link: ${endereco}`);
  }
  return linhas.join('\n');
}

/** Abre a conversa do WhatsApp já com o texto. */
function abrirWhatsApp(telefone, texto) {
  const numero = telWhatsApp(telefone);
  if (!numero) return false;
  window.open('https://wa.me/' + numero + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
  return true;
}

/* ══ 13.4 O LADO DO CLIENTE ════════════════════════════════════════════════
   A vista pública procurava a ordem em `metricas.ordens` — o estado local da
   aba. Só que o link do cliente abre sem sessão: nada é carregado do banco, e
   `dados` continua sendo a base de demonstração. A ordem nunca estava lá.
   Resultado: todo link legítimo caía em "Este link não abre nenhuma ordem",
   que é exatamente o que apareceu no celular do cliente.

   O banco resolve isso desde o começo com `portal_consultar(token)`, liberada
   para `anon` e escrita para devolver só o que o cliente pode ver — sem custo
   de peça, sem margem, com o documento parcialmente mascarado. Faltava
   chamar.                                                                  */

const fmtDataHora = (iso) => {
  if (!iso) return '—';
  const d = dataLocal(iso);
  return d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

/** Resposta do `portal_consultar` → formato que `PreviaPortal` desenha. */
function pacoteDoServidor(resp) {
  if (!resp || !resp.ordem) return null;
  const o = resp.ordem, v = resp.veiculo || {}, c = resp.cliente || {};
  const itens = (resp.itens || []).map(i => ({
    descricao: i.descricao, tipo: i.tipo,
    quantidade: Number(i.quantidade) || 1, total: Number(i.total) || 0,
  }));
  const bruto = itens.reduce((s, i) => s + i.total, 0);
  const desconto = Number(o.desconto) || 0;
  const etapa = etapaPor(o.etapa);
  const iAtual = etapaIndice(o.etapa);
  return {
    referencia: 'OS-' + String(o.numero).padStart(5, '0'),
    numero: o.numero,
    etapa: o.etapa,
    token: '',
    cliente: primeiroNome(c.nome) || 'tudo bem',
    clienteNome: c.nome || '',
    veiculo: { modelo: [v.marca, v.modelo].filter(Boolean).join(' '), placa: v.placa, km: o.km_entrada },
    situacao: { etapa: etapa.id, nome: etapa.nome, situacao: etapa.situacao,
                desde: o.aberta_em, dias: diasDesde(o.aberta_em) },
    passos: ETAPAS.map((e, i) => ({ id: e.id, nome: e.nome,
      estado: o.etapa === 'concluida' ? 'feito' : e.id === o.etapa ? 'atual' : (i < iAtual ? 'feito' : 'pendente') })),
    orcamento: {
      status: o.etapa === 'aprovacao' ? 'aguardando' : (o.aprovada_em ? 'aprovado' : 'rascunho'),
      itens, desconto, total: bruto - desconto,
      validade: o.aberta_em && o.validade_dias ? somaDias(o.aberta_em, o.validade_dias) : null,
      aprovadaEm: o.aprovada_em,
    },
    /* O `portal_consultar` não devolve foto: o balde é privado e assinar URL
       exigiria sessão. A galeria fica de fora em vez de aparecer quebrada. */
    fotos: [],
    garantia: o.garantia_dias ? { prazo: o.garantia_dias, ate: null, dias: null } : null,
    historico: [],
    mecanico: '',
    entregaPrevista: null,
    relato: o.relato || '',
    observacoes: o.obs_orcamento || '',
    oficina: resp.oficina || {},
  };
}

/* ── Assinatura no dedo ────────────────────────────────────────────────────
   Canvas com eventos de ponteiro, que cobrem dedo, caneta e mouse com o mesmo
   código. A imagem sai como PNG em data URL e viaja junto da resposta.      */
function QuadroAssinatura({ aoMudar }) {
  const tela = useRef(null);
  const desenhando = useRef(false);
  const temTraco = useRef(false);

  useEffect(() => {
    const c = tela.current;
    if (!c) return;
    /* O canvas tem tamanho em CSS e tamanho em pixel. Sem acertar os dois, o
       traço sai deslocado do dedo em tela de alta densidade. */
    const proporcao = window.devicePixelRatio || 1;
    const caixa = c.getBoundingClientRect();
    c.width = Math.round(caixa.width * proporcao);
    c.height = Math.round(caixa.height * proporcao);
    const ctx = c.getContext('2d');
    ctx.scale(proporcao, proporcao);
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#101418';
  }, []);

  const ponto = (e) => {
    const c = tela.current.getBoundingClientRect();
    return { x: e.clientX - c.left, y: e.clientY - c.top };
  };
  const comecar = (e) => {
    e.preventDefault();
    desenhando.current = true;
    const ctx = tela.current.getContext('2d');
    const p = ponto(e);
    ctx.beginPath(); ctx.moveTo(p.x, p.y);
    tela.current.setPointerCapture?.(e.pointerId);
  };
  const mover = (e) => {
    if (!desenhando.current) return;
    e.preventDefault();
    const ctx = tela.current.getContext('2d');
    const p = ponto(e);
    ctx.lineTo(p.x, p.y); ctx.stroke();
    temTraco.current = true;
  };
  /* JPEG, não PNG: é o formato que entra no PDF sem recompressão. Como o
     canvas é transparente e o JPEG não tem transparência, o traço precisa ser
     achatado sobre branco antes — senão o fundo vira preto e a assinatura
     some dentro de um retângulo escuro. */
  const exportar = () => {
    const c = tela.current;
    const plano = document.createElement('canvas');
    plano.width = c.width; plano.height = c.height;
    const ctx = plano.getContext('2d');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, plano.width, plano.height);
    ctx.drawImage(c, 0, 0);
    return plano.toDataURL('image/jpeg', 0.82);
  };

  const terminar = () => {
    if (!desenhando.current) return;
    desenhando.current = false;
    aoMudar(temTraco.current ? exportar() : '');
  };
  const limpar = () => {
    const c = tela.current;
    c.getContext('2d').clearRect(0, 0, c.width, c.height);
    temTraco.current = false;
    aoMudar('');
  };

  return html`
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
        <span class="rotulo">Assine com o dedo</span>
        <button class="btn btn-neutro btn-p" onClick=${limpar}>Limpar</button>
      </div>
      <canvas ref=${tela}
        style="width:100%;height:150px;border:1px dashed var(--linha);border-radius:var(--raio);
               background:var(--superficie);touch-action:none;display:block;cursor:crosshair"
        onPointerDown=${comecar} onPointerMove=${mover}
        onPointerUp=${terminar} onPointerLeave=${terminar} onPointerCancel=${terminar}></canvas>
    </div>`;
}

/* ── Painel de resposta ────────────────────────────────────────────────── */
function PainelAprovacao({ pacote, token, nuvem, aoResponder }) {
  const [modo, setModo] = useState(null);      // null | 'aprovar' | 'recusar'
  const [nome, setNome] = useState(pacote.clienteNome || '');
  const [assinatura, setAssinatura] = useState('');
  const [motivo, setMotivo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');

  const responder = async (aprova) => {
    setErro('');
    if (aprova && !nome.trim()) { setErro('Escreva seu nome para confirmar a aprovação.'); return; }
    if (aprova && !assinatura) { setErro('Falta a assinatura. Desenhe no quadro acima.'); return; }
    if (!aprova && !motivo.trim()) { setErro('Diga o motivo — é o que a oficina usa para refazer o orçamento.'); return; }
    setEnviando(true);
    try {
      await nuvem.rpc('portal_responder', {
        p_token: token,
        p_aprova: aprova,
        p_motivo: aprova ? nome.trim() : motivo.trim(),
        p_assinatura: aprova ? assinatura : null,
      });
      aoResponder(aprova);
    } catch (e) {
      /* A função antiga não conhece `p_assinatura`. Em vez de deixar o cliente
         travado num link que não responde, a aprovação segue sem a imagem e o
         nome vai no motivo — que é o campo que sempre existiu. */
      const semColuna = /p_assinatura|function|does not exist|PGRST202/i.test(e.message || '');
      if (semColuna) {
        try {
          await nuvem.rpc('portal_responder', {
            p_token: token, p_aprova: aprova,
            p_motivo: aprova ? ('Aprovado por ' + nome.trim()) : motivo.trim(),
          });
          aoResponder(aprova);
          return;
        } catch (e2) { setErro(e2.message || 'Não deu para registrar a resposta.'); }
      } else setErro(e.message || 'Não deu para registrar a resposta.');
    } finally { setEnviando(false); }
  };

  if (!modo) return html`
    <div class="portal-acao">
      <div style="font-size:14.5px;font-weight:600;margin-bottom:3px">Podemos seguir com o serviço?</div>
      <p class="silencioso" style="margin-bottom:12px">
        Sua resposta chega na hora na oficina. Nada é executado antes disso.
      </p>
      <div style="display:grid;gap:8px">
        <button class="btn btn-sucesso" style="width:100%;justify-content:center"
          onClick=${() => setModo('aprovar')}>
          <${Icone} nome="check" tam=${16} />Aprovar orçamento</button>
        <button class="btn btn-neutro" style="width:100%;justify-content:center"
          onClick=${() => setModo('recusar')}>Não aprovar agora</button>
      </div>
    </div>`;

  if (modo === 'recusar') return html`
    <div class="portal-acao">
      <div style="font-size:14.5px;font-weight:600;margin-bottom:10px">O que não ficou bom?</div>
      <textarea class="entrada" rows="3" value=${motivo} placeholder="Ex.: valor acima do esperado; vou fazer só o freio."
        onInput=${e => setMotivo(e.target.value)}></textarea>
      ${erro ? html`<div class="erro-campo" style="margin-top:8px">${erro}</div>` : null}
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn btn-neutro" onClick=${() => { setModo(null); setErro(''); }}>Voltar</button>
        <button class="btn btn-primario" style="flex:1;justify-content:center"
          disabled=${enviando} onClick=${() => responder(false)}>
          ${enviando ? 'Enviando…' : 'Enviar resposta'}</button>
      </div>
    </div>`;

  return html`
    <div class="portal-acao">
      <div style="font-size:14.5px;font-weight:600;margin-bottom:3px">Aprovar ${brlBruto(pacote.orcamento.total)}</div>
      <p class="silencioso" style="margin-bottom:12px">
        Ao assinar, você autoriza a execução dos itens listados acima.
      </p>
      <${Campo} rotulo="Seu nome completo">
        <input class="entrada" value=${nome} onInput=${e => setNome(e.target.value)}
          placeholder="Como está no documento" />
      <//>
      <div style="margin-top:12px">
        <${QuadroAssinatura} aoMudar=${setAssinatura} />
      </div>
      ${erro ? html`<div class="erro-campo" style="margin-top:8px">${erro}</div>` : null}
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn btn-neutro" onClick=${() => { setModo(null); setErro(''); }}>Voltar</button>
        <button class="btn btn-sucesso" style="flex:1;justify-content:center"
          disabled=${enviando} onClick=${() => responder(true)}>
          ${enviando ? 'Registrando…' : 'Confirmar aprovação'}</button>
      </div>
    </div>`;
}

/* ── A vista, agora buscando no servidor ────────────────────────────────── */
VistaPublica = function VistaPublica({ rota, dados, metricas }) {
  const { nuvem, modo } = usar();
  const [estado, setEstado] = useState({ fase: 'carregando', pacote: null, erro: '' });
  const [resposta, setResposta] = useState(null);   // null | 'aprovada' | 'recusada'

  /* Sem banco (modo demonstração) o link continua lendo o estado local —
     é o único lugar onde a ordem existe. Com banco, quem responde é o
     `portal_consultar`, porque a aba do cliente não tem sessão nenhuma. */
  /* ── FASE 13.8 · ACOMPANHAR DE VERDADE ────────────────────────────────
     O link mostrava a etapa do momento em que a página foi aberta e parava
     ali. Quem deixasse a aba aberta esperando o carro ficar pronto via a
     mesma tela a manhã inteira, e voltava a ligar para a oficina — que é
     exatamente o telefonema que o link existia para evitar.

     Agora ele se atualiza sozinho: a cada 45 segundos, e também quando a
     pessoa volta para a aba. Sem banco não há o que atualizar. */
  const [atualizadoEm, setAtualizadoEm] = useState(null);
  const [buscando, setBuscando] = useState(false);

  const buscar = useCallback(async (silencioso) => {
    if (modo !== 'supabase' || !nuvem) return;
    if (!silencioso) setBuscando(true);
    try {
      const r = await nuvem.rpc('portal_consultar', { p_token: rota.token });
      const pacote = pacoteDoServidor(r);
      if (pacote) { setEstado({ fase: 'pronto', pacote, erro: '' }); setAtualizadoEm(new Date()); }
    } catch (_) {
      /* Falha em atualização de fundo não pode apagar o que já está na tela:
         o cliente perderia o orçamento por causa de um segundo sem sinal. */
    } finally { setBuscando(false); }
  }, [modo, nuvem, rota.token]);

  useEffect(() => {
    if (modo !== 'supabase' || estado.fase !== 'pronto') return;
    const relogio = setInterval(() => {
      if (!document.hidden) buscar(true);
    }, 45000);
    const aoVoltar = () => { if (!document.hidden) buscar(true); };
    document.addEventListener('visibilitychange', aoVoltar);
    return () => { clearInterval(relogio); document.removeEventListener('visibilitychange', aoVoltar); };
  }, [modo, estado.fase, buscar]);

  useEffect(() => {
    let vivo = true;
    if (modo !== 'supabase' || !nuvem) {
      const o = metricas.ordens.find(x => x.numero === rota.numero);
      const ok = o && tokenPortal(o) && tokenPortal(o) === rota.token;
      setEstado({ fase: ok ? 'pronto' : 'invalido',
                  pacote: ok ? pacotePortal(o, dados, metricas) : null, erro: '' });
      return;
    }
    (async () => {
      try {
        const r = await nuvem.rpc('portal_consultar', { p_token: rota.token });
        if (!vivo) return;
        const pacote = pacoteDoServidor(r);
        /* A função devolve nulo tanto para token inexistente quanto para link
           vencido — do lado de fora os dois são a mesma coisa: peça outro. */
        setEstado(pacote ? { fase: 'pronto', pacote, erro: '' }
                         : { fase: 'invalido', pacote: null, erro: '' });
        if (pacote) setAtualizadoEm(new Date());
      } catch (e) {
        if (!vivo) return;
        setEstado({ fase: 'erro', pacote: null, erro: e.message || 'Falha de conexão.' });
      }
    })();
    return () => { vivo = false; };
  }, [modo, nuvem, rota.token, rota.numero]);

  const oficina = estado.pacote?.oficina?.nome
    ? { ...dados.oficina, ...estado.pacote.oficina, corBarra: estado.pacote.oficina.cor_barra || dados.oficina.corBarra }
    : dados.oficina;

  const cabecalho = html`
    <header class="publico-topo">
      <span style="width:34px;height:34px;border-radius:10px;background:var(--azul-acao);
                   display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <${Icone} nome="chave" tam=${18} cor="#fff" /></span>
      <div style="min-width:0">
        <div class="nome corta">${oficina.nome}</div>
        <div class="silencioso corta">${fmtTel(oficina.telefone)}</div>
      </div>
      ${oficina.telefone ? html`
        <a class="btn btn-neutro btn-p" style="margin-left:auto;flex-shrink:0"
           href=${'tel:' + digitos(oficina.telefone)}>
          <${Icone} nome="telefone" tam=${13} />Ligar</a>` : null}
    </header>`;

  const moldura = (miolo) => html`<div class="publico">${cabecalho}${miolo}</div>`;

  if (estado.fase === 'carregando') return moldura(html`
    <div class="publico-aviso" style="display:flex;flex-direction:column;align-items:center;gap:12px;padding:60px 20px">
      <span style="width:30px;height:30px;border:3px solid var(--linha);border-top-color:var(--azul-acao);
                   border-radius:99px;animation:girar .8s linear infinite"></span>
      <p class="silencioso">Abrindo sua ordem de serviço…</p>
    </div>`);

  if (estado.fase === 'erro') return moldura(html`
    <div class="publico-aviso">
      <${Vazio} icone="alerta" titulo="Não deu para abrir agora"
        apoio=${estado.erro + ' Tente de novo em instantes ou fale com a oficina pelo telefone acima.'} />
      <div style="display:flex;justify-content:center;margin-top:14px">
        <button class="btn btn-primario" onClick=${() => window.location.reload()}>Tentar de novo</button>
      </div>
    </div>`);

  if (estado.fase === 'invalido' || !estado.pacote) return moldura(html`
    <div class="publico-aviso">
      <${Vazio} icone="alerta" titulo="Este link não abre nenhuma ordem"
        apoio="Ou o endereço foi copiado pela metade, ou o prazo dele venceu. Fale com a oficina pelo telefone acima e peça um link novo." />
    </div>`);

  const p = estado.pacote;
  const podeResponder = p.etapa === 'aprovacao' && modo === 'supabase' && !resposta;

  return moldura(html`
    <main class="publico-corpo">
      ${modo === 'supabase' ? html`
        <div class="portal-atualiza">
          <span class=${'pulso ' + (ehAtiva({ etapa: p.etapa }) ? 'vivo' : '')}></span>
          <span class="silencioso" style="flex:1;min-width:0">
            ${buscando ? 'Buscando novidades…'
              : atualizadoEm ? 'Atualizado às ' + atualizadoEm.toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' })
              : 'Acompanhando'}
          </span>
          <button class="btn btn-neutro btn-p" disabled=${buscando} onClick=${() => buscar(false)}>
            <${Icone} nome="atualizar" tam=${13} />Atualizar</button>
        </div>` : null}

      <${PreviaPortal} pacote=${p} />

      ${resposta ? html`
        <div class=${'portal-acao ' + (resposta === 'aprovada' ? 'aprovado' : 'recusado')}>
          <${Icone} nome=${resposta === 'aprovada' ? 'check' : 'alerta'} tam=${22}
            cor=${resposta === 'aprovada' ? 'var(--ok)' : 'var(--alerta)'} />
          <div style="font-size:15px;font-weight:600;margin-top:6px">
            ${resposta === 'aprovada' ? 'Aprovado. A oficina já foi avisada.' : 'Resposta registrada.'}
          </div>
          <p class="silencioso" style="margin-top:4px">
            ${resposta === 'aprovada'
              ? 'O serviço entra na fila de execução. Você pode fechar esta página.'
              : 'A oficina vai retomar o contato para ajustar o orçamento.'}
          </p>
        </div>` : null}

      ${podeResponder ? html`
        <${PainelAprovacao} pacote=${p} token=${rota.token} nuvem=${nuvem}
          aoResponder=${(ok) => setResposta(ok ? 'aprovada' : 'recusada')} />` : null}

      ${!podeResponder && !resposta && p.orcamento.aprovadaEm ? html`
        <div class="portal-acao aprovado">
          <${Icone} nome="check" tam=${20} cor="var(--ok)" />
          <div style="font-size:14px;font-weight:600;margin-top:5px">Orçamento já aprovado</div>
          <p class="silencioso" style="margin-top:3px">Em ${fmtDataHora(p.orcamento.aprovadaEm)}.</p>
        </div>` : null}

      <button class="btn btn-neutro" style="width:100%;justify-content:center;margin-top:12px"
        onClick=${() => baixarBlob(nomeArquivoOS({ numero: p.numero, veiculo: p.veiculo }, oficina, 'orcamento'),
          pdfDaOrdem({
            numero: p.numero, aberta_em: p.situacao.desde, km_entrada: p.veiculo.km,
            relato: p.relato, obs_orcamento: p.observacoes, desconto: p.orcamento.desconto,
            validade_dias: null, garantia_dias: p.garantia?.prazo,
            aprovado_por: p.orcamento.aprovadaEm ? 'cliente (link)' : null,
            aprovada_em: p.orcamento.aprovadaEm,
            cliente: { nome: p.clienteNome }, veiculo: p.veiculo,
            itens: p.orcamento.itens.map(i => ({ ...i, preco_unitario: i.total / (i.quantidade || 1) })),
            totais: { pecas: p.orcamento.itens.filter(i => i.tipo === 'peca').reduce((s, i) => s + i.total, 0),
                      servicos: p.orcamento.itens.filter(i => i.tipo !== 'peca').reduce((s, i) => s + i.total, 0),
                      desconto: p.orcamento.desconto, liquido: p.orcamento.total },
          }, oficina, { tipo: 'orcamento' }))}>
        <${Icone} nome="baixar" tam=${15} />Baixar em PDF</button>
    </main>
    <footer class="publico-rodape">
      Esta página mostra apenas a sua ordem de serviço. Custos internos, documentos e
      anotações da oficina não aparecem aqui.<br />
      ${oficina.endereco || ''}
    </footer>`);
};

/* ══ 13.5 O BOTÃO QUE ENVIA ════════════════════════════════════════════════
   O modal antigo tinha três abas — WhatsApp, E-mail, SMS —, um aviso de que
   nada disso estava ligado e um botão que copiava texto para a área de
   transferência. O que ele fazia, no fim, era pedir para a pessoa fazer o
   trabalho no aplicativo.

   Este manda. O PDF é montado na hora, o texto sai pronto e o destino é o
   número que já está no cadastro do cliente.                              */

ModalEnvio = function ModalEnvio({ os, aoFechar }) {
  const { avisar, dados, modo } = usar();
  const oficina = dados.oficina;
  const [tipo, setTipo] = useState(os.etapa === 'aprovacao' || !os.aprovada_em ? 'orcamento' : 'os');
  const [ocupado, setOcupado] = useState('');

  const endereco = modo === 'supabase' ? enderecoPublico(os) : '';
  const texto = mensagemDaOrdem(os, oficina, endereco, tipo);
  const numero = telWhatsApp(os.cliente?.telefone);
  const nomeArq = nomeArquivoOS(os, oficina, tipo);

  const montar = () => new File([pdfDaOrdem(os, oficina, { tipo, enderecoCliente: endereco })],
    nomeArq, { type: 'application/pdf' });

  /* Celular: folha nativa com o arquivo anexado — o WhatsApp aparece nela e o
     PDF vai junto de verdade. Computador: o WhatsApp Web não aceita anexo por
     endereço, então o arquivo desce e a conversa abre com o texto pronto. */
  const enviar = async () => {
    if (!numero) { avisar('Este cliente não tem telefone válido no cadastro. Corrija em Clientes.'); return; }
    setOcupado('enviando');
    try {
      const arquivo = montar();
      if (podeCompartilharArquivo(arquivo)) {
        try {
          await navigator.share({ files: [arquivo], text: texto,
            title: (tipo === 'orcamento' ? 'Orçamento' : 'Ordem de serviço') + ' ' + os.numero });
          avisar('Enviado. O PDF foi junto da mensagem.');
          aoFechar();
          return;
        } catch (e) {
          /* Cancelar a folha de compartilhamento não é erro: a pessoa mudou de
             ideia. Só cai para o outro caminho se falhou de verdade. */
          if (e && e.name === 'AbortError') { setOcupado(''); return; }
        }
      }
      baixarBlob(nomeArq, arquivo);
      abrirWhatsApp(numero, texto);
      avisar('PDF baixado e conversa aberta. Anexe o arquivo na conversa.');
      aoFechar();
    } catch (e) {
      avisar('Não deu para montar o documento: ' + (e.message || 'erro desconhecido'));
    } finally { setOcupado(''); }
  };

  const baixar = () => {
    setOcupado('pdf');
    try { baixarBlob(nomeArq, pdfDaOrdem(os, oficina, { tipo, enderecoCliente: endereco })); }
    catch (e) { avisar('Falha ao gerar o PDF: ' + (e.message || '')); }
    finally { setOcupado(''); }
  };

  const copiarLink = () => {
    if (!endereco) { avisar('O link do cliente só existe com o banco ligado.'); return; }
    copiarE(endereco, avisar, 'Link copiado.');
  };

  return html`
    <${Modal} titulo="Enviar ao cliente" subtitulo=${'OS ' + os.numero + ' · ' + (os.cliente?.nome || '')}
      aoFechar=${aoFechar}
      rodape=${html`
        <button class="btn btn-neutro" onClick=${aoFechar}>Fechar</button>
        <button class="btn btn-neutro" disabled=${Boolean(ocupado)} onClick=${baixar}>
          <${Icone} nome="baixar" tam=${15} />${ocupado === 'pdf' ? 'Gerando…' : 'Baixar PDF'}</button>
        <button class="btn btn-zap" disabled=${Boolean(ocupado) || !numero} onClick=${enviar}>
          <${Icone} nome="zap" tam=${16} />${ocupado === 'enviando' ? 'Abrindo…' : 'Enviar por WhatsApp'}</button>`}>

      <div class="filtros">
        ${[['orcamento', 'Orçamento'], ['os', 'Ordem de serviço']].map(([id, nome]) => html`
          <button key=${id} class="filtro" aria-pressed=${tipo === id} onClick=${() => setTipo(id)}>${nome}</button>`)}
      </div>

      <div class="envio-destino">
        <${Icone} nome="telefone" tam=${16} cor=${numero ? 'var(--ok)' : 'var(--erro)'} />
        <div style="flex:1;min-width:0">
          <div style="font-weight:600">${os.cliente?.nome || 'Cliente'}</div>
          <div class="silencioso mono">${numero ? fmtTel(os.cliente.telefone) : 'Sem telefone válido no cadastro'}</div>
        </div>
        ${numero && !telEhCelular(os.cliente?.telefone)
          ? html`<span class="selo selo-alerta">Fixo</span>`
          : numero ? html`<span class="selo selo-ok">WhatsApp</span>` : null}
      </div>

      ${!numero ? html`
        <div class="aviso aviso-erro"><${Icone} nome="alerta" tam=${16} />
          <span>Sem um celular com DDD no cadastro não há para onde enviar.
          Abra o cliente em Clientes e complete o telefone.</span></div>` : null}

      ${endereco ? html`
        <div style="margin-top:12px">
          <span class="rotulo">Link de aprovação</span>
          <div class="envio-link">
            <span class="mono corta" style="flex:1;min-width:0">${endereco}</span>
            <button class="btn btn-neutro btn-p" onClick=${copiarLink}>Copiar</button>
          </div>
          <p class="silencioso" style="margin-top:5px">
            ${os.etapa === 'aprovacao'
              ? 'Nesta etapa o cliente aprova e assina pelo próprio link, sem instalar nada.'
              : 'O link acompanha a ordem. A assinatura só é pedida na etapa de aprovação.'}
          </p>
        </div>` : null}

      <div style="margin-top:14px">
        <span class="rotulo">Mensagem</span>
        <textarea class="entrada" style="min-height:120px;margin-top:5px" readonly value=${texto}></textarea>
      </div>
    <//>`;
};

/* ══ 13.6 ÍCONES E ESTILO ══════════════════════════════════════════════════ */

Object.assign(TRACOS, {
  /* Usado no selo "Gravando N". Estava sendo pedido e não existia: o selo
     saía com um espaço em branco no lugar do símbolo. */
  atualizar: 'M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16',
  baixar: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
  /* Balão com o gancho do telefone dentro: lido como WhatsApp sem usar a
     marca, que é de terceiro e não entra num arquivo que a oficina publica. */
  zap: 'M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.5-4.7A8.5 8.5 0 1 1 20.5 11.6z'
     + 'M8.9 8.4c.3-.6 1.1-.6 1.4 0l.5 1.2-.6.9a4.7 4.7 0 0 0 2.4 2.4l.9-.6 1.2.5c.6.3.6 1.1 0 1.4'
     + '-.9.5-2.1.3-3.7-1s-2.3-2.7-2.1-3.9z',
});

const ESTILO_FASE_13 = `
/* ── Envio ao cliente ─────────────────────────────────────────────────── */
.btn-zap { background:#1FA855; border-color:#1FA855; color:#fff; font-weight:600; }
.btn-zap:hover:not(:disabled) { background:#18904A; border-color:#18904A; }
.btn-zap:disabled { opacity:.45; }

.envio-destino { display:flex; align-items:center; gap:11px; margin-top:13px; padding:11px 13px;
  background:var(--superficie-2); border:1px solid var(--linha); border-radius:var(--raio); }

.envio-link { display:flex; align-items:center; gap:8px; margin-top:5px; padding:8px 11px;
  background:var(--superficie-2); border:1px solid var(--linha); border-radius:var(--raio);
  font-size:12px; }

/* ── Barra de acompanhamento do link ──────────────────────────────────── */
.portal-atualiza { display:flex; align-items:center; gap:9px; margin-bottom:12px;
  padding:8px 12px; background:var(--superficie); border:1px solid var(--linha);
  border-radius:99px; font-size:12.5px; }
.portal-atualiza .pulso { width:8px; height:8px; border-radius:99px;
  background:var(--tinta-3); flex-shrink:0; }
.portal-atualiza .pulso.vivo { background:var(--ok); animation:bater 2s ease-in-out infinite; }
@keyframes bater { 0%,100% { opacity:1; transform:scale(1); }
                   50% { opacity:.45; transform:scale(.82); } }

/* ── Resposta do cliente no link ──────────────────────────────────────── */
.portal-acao { margin-top:14px; padding:16px; border-radius:var(--raio-g);
  background:var(--superficie); border:1px solid var(--linha); box-shadow:var(--sombra); }
.portal-acao.aprovado { background:var(--ok-fundo); border-color:transparent; text-align:center; }
.portal-acao.recusado { background:var(--alerta-fundo); border-color:transparent; text-align:center; }

/* O que foi recusado pela fila, listado por inteiro. */
.recusa-linha { display:flex; gap:11px; padding:11px 0; border-bottom:1px solid var(--linha-suave); }
.recusa-linha:last-child { border-bottom:0; }
.recusa-motivo { font-size:12.5px; color:var(--erro); margin-top:2px; word-break:break-word; }

@media print { .portal-acao, .envio-destino, .envio-link { display:none !important; } }
`;

(() => {
  const folha = document.createElement('style');
  folha.textContent = ESTILO_FASE_13;
  document.head.appendChild(folha);
})();

/* ══ 13.7 O QUE NÃO ENTROU ═════════════════════════════════════════════════
   A fila descartava tarefa recusada em silêncio. Agora ela guarda, e esta
   tela mostra o que foi, quando e por quê — em português, não em mensagem
   de banco.                                                               */

const NOME_DA_TABELA = {
  clientes:'Cliente', veiculos:'Veículo', pecas:'Peça', ordens:'Ordem de serviço',
  itens:'Item da ordem', eventos:'Andamento', lancamentos:'Lançamento',
  automacoes:'Automação', tarefas:'Tarefa', modelosMensagem:'Modelo de mensagem',
  anexos:'Anexo', agendamentos:'Agendamento', usuarios:'Usuário', oficina:'Dados da oficina',
};
const NOME_DA_OPERACAO = { inserir:'criado', alterar:'alterado', excluir:'excluído' };

function ModalRecusadas({ estado, aoFechar, aoLimpar }) {
  const lista = estado?.recusadas || [];
  return html`
    <${Modal} titulo="Não foi gravado" subtitulo=${lista.length + (lista.length === 1 ? ' registro' : ' registros')}
      aoFechar=${aoFechar}
      rodape=${html`
        <button class="btn btn-neutro" onClick=${aoFechar}>Fechar</button>
        <button class="btn btn-primario" onClick=${() => { aoLimpar(); aoFechar(); }}>Entendi, limpar aviso</button>`}>
      <div class="aviso aviso-alerta"><${Icone} nome="alerta" tam=${16} />
        <span>O servidor recusou estes registros. Eles continuam na tela, mas não estão salvos —
        fechar o navegador agora os perde. Corrija o que a mensagem aponta e lance de novo.</span></div>
      <div style="margin-top:12px">
        ${lista.map((r, i) => html`
          <div key=${i} class="recusa-linha">
            <${Icone} nome="alerta" tam=${16} cor="var(--erro)" />
            <div style="flex:1;min-width:0">
              <div style="font-weight:600;font-size:13.5px">
                ${NOME_DA_TABELA[r.tela] || r.tela} ${NOME_DA_OPERACAO[r.op] || r.op}</div>
              <div class="recusa-motivo">${r.motivo}</div>
              <div class="silencioso" style="font-size:11.5px;margin-top:3px">${fmtDataHora(r.em)}</div>
            </div>
          </div>`)}
      </div>
    <//>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   FASE 18 — A ORDEM QUE AINDA MUDA E O CADASTRO QUE ACONTECE DE UMA VEZ

   Duas queixas vindas do balcão, e as duas com a mesma raiz: o sistema
   tratava como definitivo aquilo que, na oficina, ainda está acontecendo.

   1. ORDEM EM ABERTO. O carro entra com \"barulho ao frear\". No elevador
      aparece coxim gasto e o cliente lembra do ar-condicionado. Nada disso
      tinha onde entrar: relato, quilometragem, mecânico e garantia só
      existiam dentro do assistente de abertura, e depois viravam pedra. A
      saída que a oficina encontrou sozinha foi cancelar a ordem e abrir
      outra — perdendo o número, o horário de entrada e o checklist.
      Agora existe um botão de editar, no alto do detalhe, visível em
      qualquer aba, e um lápis na lista de ordens.

   2. CLIENTE E VEÍCULO. Eram duas telas, e cadastrar quem chega com dois
      carros custava três idas ao menu. Passam a ser uma só, com busca
      compartilhada, e o formulário grava o dono e quantos carros forem
      necessários numa gravada só.
   ══════════════════════════════════════════════════════════════════════════ */

/* ══ 18.1 EDITAR A ORDEM EM ABERTO ═════════════════════════════════════════
   O formulário edita o que o assistente coletou e ninguém mais podia tocar.
   Peça e serviço continuam onde sempre estiveram, na aba do orçamento, e o
   botão do rodapé leva direto para lá: duplicar o lançamento de item em dois
   lugares diferentes é como se perde a conta do que foi lançado.        */

/** Junta a queixa nova ao relato sem apagar o que já estava escrito. Data na
    frente porque, três semanas depois, a ordem em que as coisas apareceram é
    metade da informação. */
const acrescentarAoRelato = (relato, texto) => {
  const novo = String(texto || '').trim();
  if (!novo) return relato || '';
  const carimbo = '[' + new Date().toLocaleDateString('pt-BR') + '] ';
  const antes = String(relato || '').trim();
  return antes ? antes + '\n' + carimbo + novo : carimbo + novo;
};

function FormEditarOS({ os, aoFechar, aoPedirItens }) {
  const { dados, acoes, papel, avisar } = usar();
  const podeCusto = pode(papel, 'custo');
  const [f, setF] = useState(() => ({
    relato: os.relato || '',
    km_entrada: String(os.km_entrada ?? ''),
    mecanico: os.mecanico || '',
    garantia_dias: String(os.garantia_dias ?? GARANTIA_PADRAO),
    validade_dias: String(os.validade_dias ?? VALIDADE_PADRAO),
    desconto: os.desconto ? String(os.desconto).replace('.', ',') : '',
    obs_tecnica: os.obs_tecnica || '',
    obs_orcamento: os.obs_orcamento || '',
  }));
  const [queixa, setQueixa] = useState('');
  const [erros, setErros] = useState({});
  const veiculo = dados.veiculos.find(v => v.id === os.veiculo_id);

  /* A queixa entra no relato pelo botão, não ao salvar: quem digita quer ver
     o texto tomar o lugar dele antes de confirmar, e quem desiste no meio não
     leva uma linha fantasma junto. */
  const juntarQueixa = () => {
    if (!queixa.trim()) return;
    setF(x => ({ ...x, relato: acrescentarAoRelato(x.relato, queixa) }));
    setQueixa('');
  };

  const montarResumo = () => {
    const mudou = [];
    if (f.relato.trim() !== String(os.relato || '').trim()) mudou.push('relato');
    if (inteiroBR(f.km_entrada) !== Number(os.km_entrada || 0)) mudou.push('quilometragem');
    if ((f.mecanico || '') !== (os.mecanico || '')) mudou.push('responsável');
    if (Number(f.garantia_dias) !== Number(os.garantia_dias ?? GARANTIA_PADRAO)) mudou.push('garantia');
    if (Number(f.validade_dias) !== Number(os.validade_dias ?? VALIDADE_PADRAO)) mudou.push('validade');
    if (numeroBR(f.desconto) !== Number(os.desconto || 0)) mudou.push('desconto');
    if (f.obs_tecnica !== (os.obs_tecnica || '')) mudou.push('diagnóstico');
    if (f.obs_orcamento !== (os.obs_orcamento || '')) mudou.push('observações');
    return mudou;
  };

  const salvar = (depois) => {
    const e = {};
    /* A queixa digitada e não juntada seria perdida em silêncio. Ela entra
       junto: ninguém digita numa caixa para depois jogar fora. */
    const relato = queixa.trim() ? acrescentarAoRelato(f.relato, queixa) : f.relato;
    if (!relato.trim()) e.relato = 'A ordem não pode ficar sem o relato do cliente.';
    if (!String(f.km_entrada).trim()) e.km = 'Informe a quilometragem de entrada.';
    setErros(e);
    if (Object.keys(e).length) return;

    const mudou = montarResumo();
    if (queixa.trim() && !mudou.includes('relato')) mudou.push('relato');
    if (!mudou.length) { aoFechar(); if (depois) depois(); return; }

    acoes.editarOS(os.id, {
      relato,
      km_entrada: inteiroBR(f.km_entrada),
      mecanico: f.mecanico,
      garantia_dias: Math.max(0, Number(f.garantia_dias) || 0),
      validade_dias: Math.max(1, Number(f.validade_dias) || VALIDADE_PADRAO),
      desconto: Math.max(0, numeroBR(f.desconto)),
      obs_tecnica: f.obs_tecnica,
      obs_orcamento: f.obs_orcamento,
    }, 'Alterado: ' + mudou.join(', '));
    avisar('Ordem ' + os.numero + ' atualizada.');
    setQueixa('');
    aoFechar();
    if (depois) depois();
  };

  const kmAtual = Number(veiculo?.km_atual || 0);
  const kmDigitado = inteiroBR(f.km_entrada);

  return html`
    <${Modal} titulo=${'Editar ordem ' + os.numero}
      subtitulo=${(os.veiculo?.marca || '') + ' ' + (os.veiculo?.modelo || '') + ' · ' + etapaNome(os.etapa)}
      aoFechar=${aoFechar} largura=${640}
      rodape=${html`
        <button class="btn btn-neutro" onClick=${aoFechar}>Cancelar</button>
        <button class="btn btn-neutro" onClick=${() => salvar(aoPedirItens)}>
          <${Icone} nome="mais" tam=${15} />Salvar e lançar item</button>
        <button class="btn btn-primario" onClick=${() => salvar(null)}>Salvar alterações</button>`}>

      <div class="aviso aviso-info"><${Icone} nome="informacao" tam=${16} />
        <span>A ordem continua com o mesmo número, a mesma hora de entrada e o mesmo checklist.
        Quem alterou e o quê fica registrado na auditoria.</span></div>

      <${Campo} rotulo="Acrescentar uma queixa" erro=${erros.queixa}
        ajuda="Entra no fim do relato com a data de hoje, sem apagar o que já estava escrito.">
        <div style="display:flex;gap:8px;align-items:flex-start">
          <input class="entrada" value=${queixa} style="flex:1;min-width:0"
            placeholder="Ex.: cliente avisou que o ar-condicionado parou de gelar"
            onInput=${e => setQueixa(e.target.value)}
            onKeyDown=${e => { if (e.key === 'Enter') { e.preventDefault(); juntarQueixa(); } }} />
          <button class="btn btn-neutro" onClick=${juntarQueixa} disabled=${!queixa.trim()}>
            <${Icone} nome="mais" tam=${15} />Juntar</button>
        </div>
      <//>

      <${Campo} rotulo="Relato do cliente" erro=${erros.relato}
        ajuda="É o que o mecânico lê na bancada. Pode ser editado à mão também.">
        <textarea class="entrada" style="min-height:110px" value=${f.relato}
          aria-invalid=${Boolean(erros.relato)}
          onInput=${e => setF(x => ({ ...x, relato: e.target.value }))}></textarea>
      <//>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <${Campo} rotulo="Quilometragem de entrada" erro=${erros.km}
          ajuda=${'Hodômetro do veículo: ' + inteiro(kmAtual) + ' km'}>
          <input class="entrada mono" type="text" inputmode="numeric" autocomplete="off" value=${f.km_entrada}
            aria-invalid=${Boolean(erros.km)} onInput=${e => setF(x => ({ ...x, km_entrada: e.target.value }))} />
        <//>
        <${Campo} rotulo="Garantia do serviço" ajuda=${'Em dias · padrão da oficina: ' + GARANTIA_PADRAO}>
          <input class="entrada mono" type="number" min="0" value=${f.garantia_dias}
            onInput=${e => setF(x => ({ ...x, garantia_dias: e.target.value }))} />
        <//>
      </div>

      ${kmDigitado > 0 && kmAtual > 0 && kmDigitado < kmAtual ? html`
        <div class="aviso aviso-alerta"><${Icone} nome="alerta" tam=${16} />
          <span>A leitura digitada é menor que a última registrada para este veículo
          (${inteiro(kmAtual)} km). Confira antes de salvar — o plano de revisão usa esse número.</span></div>` : null}

      ${comMecanicos(dados) ? html`
        <${Campo} rotulo="Mecânico responsável" ajuda="Pode mudar durante o serviço, sem refazer a ordem.">
          <select class="entrada" value=${f.mecanico} onInput=${e => setF(x => ({ ...x, mecanico: e.target.value }))}>
            <option value="">Definir depois</option>
            ${MECANICOS.map(m => html`<option key=${m.id} value=${m.id}>${m.nome}</option>`)}
          </select>
        <//>` : null}

      <${Campo} rotulo="Diagnóstico e observação técnica" ajuda="Fica no prontuário do veículo para sempre.">
        <textarea class="entrada" value=${f.obs_tecnica}
          placeholder="O que foi encontrado, o que foi feito e o que fica para a próxima."
          onInput=${e => setF(x => ({ ...x, obs_tecnica: e.target.value }))}></textarea>
      <//>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
        <${Campo} rotulo="Desconto" ajuda=${podeCusto ? 'Entra no cálculo da margem' : 'Abatido do total'}>
          <input class="entrada mono" type="text" inputmode="decimal" autocomplete="off" placeholder="0,00"
            value=${f.desconto} onInput=${e => setF(x => ({ ...x, desconto: e.target.value }))} />
        <//>
        <${Campo} rotulo="Validade do orçamento" ajuda="Dias a partir da abertura">
          <input class="entrada mono" type="number" min="1" value=${f.validade_dias}
            onInput=${e => setF(x => ({ ...x, validade_dias: e.target.value }))} />
        <//>
      </div>

      <${Campo} rotulo="Observações do orçamento" ajuda="Sai no documento enviado ao cliente.">
        <textarea class="entrada" value=${f.obs_orcamento}
          placeholder="Ex.: valor não inclui alinhamento; prazo de dois dias úteis após aprovação."
          onInput=${e => setF(x => ({ ...x, obs_orcamento: e.target.value }))}></textarea>
      <//>

      <div class="aviso aviso-info"><${Icone} nome="caixa" tam=${16} />
        <span>Peça e serviço se lançam na aba <b>Orçamento</b> — use <b>Salvar e lançar item</b>
        aqui embaixo para ir direto, com o que você escreveu já gravado.</span></div>
    <//>`;
}

/* ══ 18.2 CADASTRO DE CLIENTE E VEÍCULOS NUMA GRAVADA ══════════════════════
   A separação entre as duas tabelas é do banco, não do balcão. Quem chega na
   oficina chega com um carro; quem tem dois, tem dois no mesmo instante. O
   formulário aceita cliente novo ou já cadastrado e uma lista de veículos que
   cresce por botão — nenhum deles obrigatório, porque cadastrar o cliente
   antes do carro continua sendo legítimo.                                */

const veiculoEmBranco = () => ({ chave: novoId(), placa:'', marca:'', modelo:'',
  ano_modelo:'', cor:'', km_atual:'' });

/** Linha vazia é linha que a pessoa abriu e não usou: sai sem reclamar. */
const linhaVaziaDeVeiculo = (v) => !['placa','marca','modelo','ano_modelo','cor','km_atual']
  .some(k => String(v[k] || '').trim());

function FormCadastro({ aoFechar, aoCriar, clienteInicial }) {
  const { dados, acoes, avisar } = usar();
  const [modo, setModo] = useState(clienteInicial ? 'existente' : 'novo');
  const [clienteId, setClienteId] = useState(clienteInicial || '');
  const [buscaCliente, setBuscaCliente] = useState('');
  const [c, setC] = useState({ tipo:'fisica', nome:'', documento:'', telefone:'',
    email:'', cidade:'', uf:'SP' });
  const [veiculos, setVeiculos] = useState(() => [veiculoEmBranco()]);
  const [erros, setErros] = useState({});

  const mudarVeiculo = (chave, campo, valor) =>
    setVeiculos(l => l.map(v => v.chave === chave ? { ...v, [campo]: valor } : v));

  const clientesFiltrados = useMemo(() => {
    const q = buscaCliente.trim().toLowerCase();
    const base = dados.clientes.slice().sort((a, b) => String(a.nome).localeCompare(String(b.nome), 'pt-BR'));
    if (!q) return base.slice(0, 8);
    return base.filter(x => [x.nome, x.telefone, x.documento]
      .some(y => String(y || '').toLowerCase().includes(q))).slice(0, 8);
  }, [buscaCliente, dados.clientes]);

  const salvar = () => {
    const e = {};
    if (modo === 'novo') {
      if (!c.nome.trim()) e.nome = 'O nome é obrigatório.';
      if (!c.telefone.trim()) e.telefone = 'É como a oficina avisa que o carro ficou pronto.';
      else if (!telValido(c.telefone)) e.telefone = 'Faltam dígitos. Use DDD + número, como (11) 94019-8651.';
      if (c.documento && !validaDoc(c.documento)) e.documento = 'CPF tem 11 dígitos, CNPJ tem 14.';
    } else if (!clienteId) {
      e.cliente = 'Escolha o cliente que vai receber os veículos.';
    }

    /* As placas são conferidas contra a base E contra as outras linhas deste
       mesmo formulário: cadastrar o mesmo carro duas vezes de uma vez é um
       erro de digitação comum quando se lança a frota de uma empresa. */
    const usar_ = veiculos.filter(v => !linhaVaziaDeVeiculo(v));
    /* Cliente já cadastrado e nenhuma linha preenchida não é cadastro: é um
       botão que fecharia a janela dizendo "salvo" sem ter salvado nada. */
    if (modo === 'existente' && !usar_.length)
      e.veiculo = 'Preencha ao menos um veículo — o cliente já está cadastrado.';
    const vistas = new Set();
    usar_.forEach(v => {
      const placa = String(v.placa || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (!validaPlaca(placa)) e['placa-' + v.chave] = 'Use o formato ABC1234 ou ABC1D23.';
      else if (dados.veiculos.some(x => x.placa === placa)) e['placa-' + v.chave] = 'Esta placa já está cadastrada.';
      else if (vistas.has(placa)) e['placa-' + v.chave] = 'Placa repetida neste formulário.';
      else vistas.add(placa);
      if (!String(v.marca || '').trim()) e['marca-' + v.chave] = 'Informe a marca.';
      if (!String(v.modelo || '').trim()) e['modelo-' + v.chave] = 'Informe o modelo.';
    });

    setErros(e);
    if (Object.keys(e).length) return;

    /* O id sai daqui e não do `criarCliente`: os veículos precisam dele na
       mesma passada, e a ação não devolve nada. */
    const idCliente = modo === 'novo' ? novoId() : clienteId;
    if (modo === 'novo') {
      acoes.criarCliente({ id: idCliente, ...c,
        documento: digitos(c.documento), telefone: telNacional(c.telefone) });
    }

    const criados = usar_.map(v => {
      const id = novoId();
      acoes.criarVeiculo({ id, cliente_id: idCliente,
        placa: String(v.placa).toUpperCase().replace(/[^A-Z0-9]/g, ''),
        marca: String(v.marca).trim(), modelo: String(v.modelo).trim(),
        ano_modelo: Number(v.ano_modelo) || null, cor: String(v.cor || '').trim(),
        km_atual: inteiroBR(v.km_atual) });
      return id;
    });

    const nome = modo === 'novo' ? c.nome.trim()
      : (dados.clientes.find(x => x.id === idCliente)?.nome || 'Cliente');
    avisar(criados.length
      ? nome + ' cadastrado com ' + criados.length + (criados.length === 1 ? ' veículo.' : ' veículos.')
      : nome + ' cadastrado. Os veículos entram quando quiser.');
    if (aoCriar) aoCriar({ clienteId: idCliente, veiculoId: criados[0] || null });
    aoFechar();
  };

  const clienteEscolhido = dados.clientes.find(x => x.id === clienteId);

  return html`
    <${Modal} titulo="Novo cadastro" subtitulo="Cliente e veículos na mesma tela" aoFechar=${aoFechar} largura=${700}
      rodape=${html`
        <button class="btn btn-neutro" onClick=${aoFechar}>Cancelar</button>
        <button class="btn btn-primario" onClick=${salvar}>
          <${Icone} nome="check" tam=${15} />Salvar cadastro</button>`}>

      <div class="bloco-cadastro">
        <div class="titulo-bloco"><span class="conta">1</span><h3>Quem é o dono</h3></div>
        <div class="filtros">
          ${[['novo','Cliente novo'],['existente','Já é cliente']].map(([id, nome]) => html`
            <button key=${id} class="filtro" aria-pressed=${modo === id} onClick=${() => setModo(id)}>${nome}</button>`)}
        </div>

        ${modo === 'existente' ? html`
          <div style="margin-top:12px">
            ${erros.cliente ? html`<p class="erro-campo" style="margin-bottom:8px">${erros.cliente}</p>` : null}
            <div class="busca">
              <${Icone} nome="busca" tam=${15} cor="var(--tinta-3)" />
              <input value=${buscaCliente} onInput=${e => setBuscaCliente(e.target.value)}
                placeholder="Nome, telefone ou documento" aria-label="Buscar cliente" />
            </div>
            <div style="display:flex;flex-direction:column;gap:7px;margin-top:10px">
              ${clientesFiltrados.length === 0
                ? html`<p class="silencioso" style="padding:6px 0">Nenhum cliente com esse dado.
                    Use <b>Cliente novo</b> para cadastrar agora.</p>`
                : clientesFiltrados.map(x => {
                    const sel = clienteId === x.id;
                    return html`
                      <button key=${x.id} onClick=${() => { setClienteId(x.id); setErros(er => ({ ...er, cliente: null })); }}
                        style=${'display:flex;align-items:center;gap:11px;padding:10px;border-radius:var(--raio);text-align:left;width:100%;border:1px solid '
                          + (sel ? 'var(--azul-acao)' : 'var(--linha)') + ';background:' + (sel ? 'var(--info-fundo)' : 'var(--superficie)')}>
                        <span class="avatar" style="width:32px;height:32px;font-size:12px">${iniciais(x.nome)}</span>
                        <div style="flex:1;min-width:0">
                          <div class="corta" style="font-size:13.5px;font-weight:600">${x.nome}</div>
                          <div class="silencioso mono">${fmtTel(x.telefone)}</div>
                        </div>
                        ${sel ? html`<${Icone} nome="check" tam=${16} cor="var(--azul-acao)" />` : null}
                      </button>`;
                  })}
            </div>
          </div>` : html`
          <div style="margin-top:12px;display:flex;flex-direction:column;gap:12px">
            <div class="filtros">
              ${[['fisica','Pessoa física'],['juridica','Empresa']].map(([id, nome]) => html`
                <button key=${id} class="filtro" aria-pressed=${c.tipo === id} onClick=${() => setC(x => ({ ...x, tipo: id }))}>${nome}</button>`)}
            </div>
            <${Campo} rotulo=${c.tipo === 'fisica' ? 'Nome completo' : 'Razão social'} erro=${erros.nome}>
              <input class="entrada" value=${c.nome} aria-invalid=${Boolean(erros.nome)}
                onInput=${e => setC(x => ({ ...x, nome: e.target.value }))} />
            <//>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
              <${Campo} rotulo="Telefone" erro=${erros.telefone}
                ajuda=${c.telefone && telValido(c.telefone) && !telEhCelular(c.telefone) ? 'Fixo — não recebe WhatsApp' : 'Celular com WhatsApp'}>
                <input class="entrada mono" inputmode="tel" placeholder="(11) 90000-0000" maxlength="16"
                  value=${mascararTel(c.telefone)} aria-invalid=${Boolean(erros.telefone)}
                  onInput=${e => setC(x => ({ ...x, telefone: mascararTel(e.target.value) }))} />
              <//>
              <${Campo} rotulo=${c.tipo === 'fisica' ? 'CPF' : 'CNPJ'} erro=${erros.documento} ajuda="Opcional">
                <input class="entrada mono" inputmode="numeric" value=${c.documento}
                  aria-invalid=${Boolean(erros.documento)}
                  onInput=${e => setC(x => ({ ...x, documento: e.target.value }))} />
              <//>
            </div>
            <div style="display:grid;grid-template-columns:2fr 1fr;gap:12px">
              <${Campo} rotulo="Cidade" ajuda="Opcional">
                <input class="entrada" value=${c.cidade} onInput=${e => setC(x => ({ ...x, cidade: e.target.value }))} />
              <//>
              <${Campo} rotulo="UF">
                <input class="entrada" maxlength="2" value=${c.uf}
                  onInput=${e => setC(x => ({ ...x, uf: e.target.value.toUpperCase() }))} />
              <//>
            </div>
          </div>`}
      </div>

      <div class="bloco-cadastro">
        <div class="titulo-bloco">
          <span class="conta">2</span>
          <h3>Os veículos${clienteEscolhido ? ' de ' + String(clienteEscolhido.nome).split(' ')[0] : ''}</h3>
          <span class="silencioso" style="flex:1;text-align:right">${veiculos.filter(v => !linhaVaziaDeVeiculo(v)).length} para salvar</span>
        </div>
        <p class="silencioso" style="margin-bottom:12px">Deixe em branco se o carro entra depois.
          Para quem tem mais de um, acrescente quantos precisar aqui mesmo.</p>
        ${erros.veiculo ? html`<p class="erro-campo" style="margin-bottom:10px">${erros.veiculo}</p>` : null}

        <div style="display:flex;flex-direction:column;gap:12px">
          ${veiculos.map((v, i) => html`
            <div key=${v.chave} class="linha-veiculo">
              <div class="cabeca">
                <span class="rotulo">Veículo ${i + 1}</span>
                ${validaPlaca(String(v.placa || '').toUpperCase()) ? html`<${Placa} valor=${String(v.placa).toUpperCase()} tam="p" />` : null}
                <span style="flex:1"></span>
                ${veiculos.length > 1 ? html`
                  <button class="btn btn-fantasma btn-icone" aria-label=${'Remover o veículo ' + (i + 1)}
                    onClick=${() => setVeiculos(l => l.filter(x => x.chave !== v.chave))}>
                    <${Icone} nome="lixo" tam=${15} /></button>` : null}
              </div>
              <div class="grade-veiculo">
                <${Campo} rotulo="Placa" erro=${erros['placa-' + v.chave]} ajuda="Formato antigo ou Mercosul">
                  <input class="entrada mono" style="text-transform:uppercase" maxlength="7" value=${v.placa}
                    aria-invalid=${Boolean(erros['placa-' + v.chave])}
                    onInput=${e => mudarVeiculo(v.chave, 'placa', e.target.value)} />
                <//>
                <${Campo} rotulo="Marca" erro=${erros['marca-' + v.chave]}>
                  <input class="entrada" value=${v.marca} aria-invalid=${Boolean(erros['marca-' + v.chave])}
                    onInput=${e => mudarVeiculo(v.chave, 'marca', e.target.value)} />
                <//>
                <${Campo} rotulo="Modelo" erro=${erros['modelo-' + v.chave]}>
                  <input class="entrada" value=${v.modelo} aria-invalid=${Boolean(erros['modelo-' + v.chave])}
                    onInput=${e => mudarVeiculo(v.chave, 'modelo', e.target.value)} />
                <//>
                <${Campo} rotulo="Ano">
                  <input class="entrada mono" type="number" value=${v.ano_modelo}
                    onInput=${e => mudarVeiculo(v.chave, 'ano_modelo', e.target.value)} />
                <//>
                <${Campo} rotulo="Cor">
                  <input class="entrada" value=${v.cor}
                    onInput=${e => mudarVeiculo(v.chave, 'cor', e.target.value)} />
                <//>
                <${Campo} rotulo="KM atual">
                  <input class="entrada mono" type="text" inputmode="numeric" value=${v.km_atual}
                    onInput=${e => mudarVeiculo(v.chave, 'km_atual', e.target.value)} />
                <//>
              </div>
            </div>`)}
        </div>

        <button class="btn btn-neutro btn-bloco" style="margin-top:12px"
          onClick=${() => setVeiculos(l => [...l, veiculoEmBranco()])}>
          <${Icone} nome="mais" tam=${15} />Adicionar outro veículo</button>

        <p class="silencioso" style="margin-top:10px">As fotos do veículo entram pelo botão de editar,
          depois de salvo — assim o cadastro do balcão não espera o upload.</p>
      </div>
    <//>`;
}

/* ══ 18.3 A TELA ÚNICA ═════════════════════════════════════════════════════
   Uma barra só: a busca vale para os dois lados, e trocar de aba não faz
   redigitar o que já foi procurado. As listas continuam sendo as mesmas de
   antes, agora sem barra própria.                                        */
function TelaCadastros({ aba = 'clientes', aoTrocarAba }) {
  const { metricas, dados, papel } = usar();
  const [busca, setBusca] = useState('');
  const [form, setForm] = useState(false);
  const trocar = (id) => { if (aoTrocarAba) aoTrocarAba(id); };

  const ABAS = [
    { id:'clientes', nome:'Clientes', n: metricas.clientes.length },
    { id:'veiculos', nome:'Veículos', n: dados.veiculos.length },
  ];

  return html`
    <div style="display:flex;flex-direction:column;gap:14px">
      <${Cartao} nu>
        <div style="display:flex;flex-wrap:wrap;gap:11px;padding:14px">
          <div class="busca">
            <${Icone} nome="busca" tam=${15} cor="var(--tinta-3)" />
            <input value=${busca} onInput=${e => setBusca(e.target.value)}
              placeholder="Nome, telefone, documento, placa ou modelo"
              aria-label="Buscar clientes e veículos" />
          </div>
          ${pode(papel, 'criar') ? html`
            <button class="btn btn-primario" onClick=${() => setForm(true)}>
              <${Icone} nome="mais" tam=${15} />Novo cadastro</button>` : null}
        </div>
        <div class="abas" role="tablist" style="padding:0 14px">
          ${ABAS.map(a => html`
            <button key=${a.id} class="aba" role="tab" aria-selected=${aba === a.id} onClick=${() => trocar(a.id)}>
              ${a.nome} <span class="mono" style="opacity:.6">${a.n}</span></button>`)}
        </div>
      <//>

      ${busca.trim() ? html`
        <p class="silencioso">A busca vale nas duas abas — troque acima para ver o outro lado do resultado.</p>` : null}

      ${aba === 'veiculos'
        ? html`<${TelaVeiculos} embutida busca=${busca} aoNovo=${() => setForm(true)} />`
        : html`<${TelaClientes} embutida busca=${busca} aoNovo=${() => setForm(true)} />`}

      ${form ? html`<${FormCadastro} aoFechar=${() => setForm(false)} />` : null}
    </div>`;
}

/* ══ 18.4 REGISTRO ═════════════════════════════════════════════════════════
   O menu perde duas linhas e ganha uma. As rotas antigas continuam existindo
   porque o painel, os achados e o assistente apontam para elas — `irPara`
   traduz e escolhe a aba, então nenhum atalho de dentro do sistema quebra. */
Object.assign(TITULOS_EXTRA, {
  /* O subtítulo soma o que as duas telas antigas diziam separadas — a
     contagem de clientes sem retorno era a única informação que a unificação
     ameaçava deixar cair. */
  cadastros: (d, m) => {
    const frios = m.clientes.filter(c => c.inativo).length;
    return ['Clientes e veículos',
      m.clientes.length + ' clientes · ' + d.veiculos.length + ' veículos'
      + (frios ? ' · ' + frios + ' sem retorno' : '')];
  },
});

(() => {
  const iCli = NAV.findIndex(n => n.id === 'clientes');
  if (iCli >= 0) NAV.splice(iCli, 1, { id:'cadastros', nome:'Clientes e veículos', icone:'pessoas' });
  const iVei = NAV.findIndex(n => n.id === 'veiculos');
  if (iVei >= 0) NAV.splice(iVei, 1);
})();

/* ══ MONTAGEM ══ */
try {
  const alvo = document.getElementById('app');
  alvo.innerHTML = '';
  render(html`<${App} />`, alvo);
} catch (erro) {
  console.error(erro);
  const aviso = document.getElementById('aviso-carga');
  if (aviso) {
    aviso.textContent = 'Não foi possível carregar a interface. Verifique a conexão e recarregue a página.';
    aviso.style.color = '#C62A20';
  }
}
})();
