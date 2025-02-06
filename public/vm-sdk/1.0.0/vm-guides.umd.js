!(function (t, e) {
  'object' == typeof exports && 'undefined' != typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd
    ? define(e)
    : ((t =
        'undefined' != typeof globalThis ? globalThis : t || self).VMGuides =
        e())
})(this, function () {
  'use strict'
  /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */ function t(
    t,
    e,
    i,
    s
  ) {
    var o,
      r = arguments.length,
      n =
        r < 3 ? e : null === s ? (s = Object.getOwnPropertyDescriptor(e, i)) : s
    if ('object' == typeof Reflect && 'function' == typeof Reflect.decorate)
      n = Reflect.decorate(t, e, i, s)
    else
      for (var a = t.length - 1; a >= 0; a--)
        (o = t[a]) && (n = (r < 3 ? o(n) : r > 3 ? o(e, i, n) : o(e, i)) || n)
    return r > 3 && n && Object.defineProperty(e, i, n), n
    /**
     * @license
     * Copyright 2019 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
  }
  const e = globalThis,
    i =
      e.ShadowRoot &&
      (void 0 === e.ShadyCSS || e.ShadyCSS.nativeShadow) &&
      'adoptedStyleSheets' in Document.prototype &&
      'replace' in CSSStyleSheet.prototype,
    s = Symbol(),
    o = new WeakMap()
  class r {
    constructor(t, e, i) {
      if (((this._$cssResult$ = !0), i !== s))
        throw Error(
          'CSSResult is not constructable. Use `unsafeCSS` or `css` instead.'
        )
      ;(this.cssText = t), (this.t = e)
    }
    get styleSheet() {
      let t = this.o
      const e = this.t
      if (i && void 0 === t) {
        const i = void 0 !== e && 1 === e.length
        i && (t = o.get(e)),
          void 0 === t &&
            ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText),
            i && o.set(e, t))
      }
      return t
    }
    toString() {
      return this.cssText
    }
  }
  const n = i
      ? (t) => t
      : (t) =>
          t instanceof CSSStyleSheet
            ? ((t) => {
                let e = ''
                for (const i of t.cssRules) e += i.cssText
                return ((t) =>
                  new r('string' == typeof t ? t : t + '', void 0, s))(e)
              })(t)
            : t,
    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */ {
      is: a,
      defineProperty: l,
      getOwnPropertyDescriptor: h,
      getOwnPropertyNames: c,
      getOwnPropertySymbols: d,
      getPrototypeOf: p,
    } = Object,
    u = globalThis,
    m = u.trustedTypes,
    f = m ? m.emptyScript : '',
    v = u.reactiveElementPolyfillSupport,
    g = (t, e) => t,
    b = {
      toAttribute(t, e) {
        switch (e) {
          case Boolean:
            t = t ? f : null
            break
          case Object:
          case Array:
            t = null == t ? t : JSON.stringify(t)
        }
        return t
      },
      fromAttribute(t, e) {
        let i = t
        switch (e) {
          case Boolean:
            i = null !== t
            break
          case Number:
            i = null === t ? null : Number(t)
            break
          case Object:
          case Array:
            try {
              i = JSON.parse(t)
            } catch (t) {
              i = null
            }
        }
        return i
      },
    },
    $ = (t, e) => !a(t, e),
    _ = {
      attribute: !0,
      type: String,
      converter: b,
      reflect: !1,
      hasChanged: $,
    }
  ;(Symbol.metadata ??= Symbol('metadata')),
    (u.litPropertyMetadata ??= new WeakMap())
  class y extends HTMLElement {
    static addInitializer(t) {
      this._$Ei(), (this.l ??= []).push(t)
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()]
    }
    static createProperty(t, e = _) {
      if (
        (e.state && (e.attribute = !1),
        this._$Ei(),
        this.elementProperties.set(t, e),
        !e.noAccessor)
      ) {
        const i = Symbol(),
          s = this.getPropertyDescriptor(t, i, e)
        void 0 !== s && l(this.prototype, t, s)
      }
    }
    static getPropertyDescriptor(t, e, i) {
      const { get: s, set: o } = h(this.prototype, t) ?? {
        get() {
          return this[e]
        },
        set(t) {
          this[e] = t
        },
      }
      return {
        get() {
          return s?.call(this)
        },
        set(e) {
          const r = s?.call(this)
          o.call(this, e), this.requestUpdate(t, r, i)
        },
        configurable: !0,
        enumerable: !0,
      }
    }
    static getPropertyOptions(t) {
      return this.elementProperties.get(t) ?? _
    }
    static _$Ei() {
      if (this.hasOwnProperty(g('elementProperties'))) return
      const t = p(this)
      t.finalize(),
        void 0 !== t.l && (this.l = [...t.l]),
        (this.elementProperties = new Map(t.elementProperties))
    }
    static finalize() {
      if (this.hasOwnProperty(g('finalized'))) return
      if (
        ((this.finalized = !0),
        this._$Ei(),
        this.hasOwnProperty(g('properties')))
      ) {
        const t = this.properties,
          e = [...c(t), ...d(t)]
        for (const i of e) this.createProperty(i, t[i])
      }
      const t = this[Symbol.metadata]
      if (null !== t) {
        const e = litPropertyMetadata.get(t)
        if (void 0 !== e)
          for (const [t, i] of e) this.elementProperties.set(t, i)
      }
      this._$Eh = new Map()
      for (const [t, e] of this.elementProperties) {
        const i = this._$Eu(t, e)
        void 0 !== i && this._$Eh.set(i, t)
      }
      this.elementStyles = this.finalizeStyles(this.styles)
    }
    static finalizeStyles(t) {
      const e = []
      if (Array.isArray(t)) {
        const i = new Set(t.flat(1 / 0).reverse())
        for (const t of i) e.unshift(n(t))
      } else void 0 !== t && e.push(n(t))
      return e
    }
    static _$Eu(t, e) {
      const i = e.attribute
      return !1 === i
        ? void 0
        : 'string' == typeof i
        ? i
        : 'string' == typeof t
        ? t.toLowerCase()
        : void 0
    }
    constructor() {
      super(),
        (this._$Ep = void 0),
        (this.isUpdatePending = !1),
        (this.hasUpdated = !1),
        (this._$Em = null),
        this._$Ev()
    }
    _$Ev() {
      ;(this._$ES = new Promise((t) => (this.enableUpdating = t))),
        (this._$AL = new Map()),
        this._$E_(),
        this.requestUpdate(),
        this.constructor.l?.forEach((t) => t(this))
    }
    addController(t) {
      ;(this._$EO ??= new Set()).add(t),
        void 0 !== this.renderRoot && this.isConnected && t.hostConnected?.()
    }
    removeController(t) {
      this._$EO?.delete(t)
    }
    _$E_() {
      const t = new Map(),
        e = this.constructor.elementProperties
      for (const i of e.keys())
        this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i])
      t.size > 0 && (this._$Ep = t)
    }
    createRenderRoot() {
      const t =
        this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions)
      return (
        ((t, s) => {
          if (i)
            t.adoptedStyleSheets = s.map((t) =>
              t instanceof CSSStyleSheet ? t : t.styleSheet
            )
          else
            for (const i of s) {
              const s = document.createElement('style'),
                o = e.litNonce
              void 0 !== o && s.setAttribute('nonce', o),
                (s.textContent = i.cssText),
                t.appendChild(s)
            }
        })(t, this.constructor.elementStyles),
        t
      )
    }
    connectedCallback() {
      ;(this.renderRoot ??= this.createRenderRoot()),
        this.enableUpdating(!0),
        this._$EO?.forEach((t) => t.hostConnected?.())
    }
    enableUpdating(t) {}
    disconnectedCallback() {
      this._$EO?.forEach((t) => t.hostDisconnected?.())
    }
    attributeChangedCallback(t, e, i) {
      this._$AK(t, i)
    }
    _$EC(t, e) {
      const i = this.constructor.elementProperties.get(t),
        s = this.constructor._$Eu(t, i)
      if (void 0 !== s && !0 === i.reflect) {
        const o = (
          void 0 !== i.converter?.toAttribute ? i.converter : b
        ).toAttribute(e, i.type)
        ;(this._$Em = t),
          null == o ? this.removeAttribute(s) : this.setAttribute(s, o),
          (this._$Em = null)
      }
    }
    _$AK(t, e) {
      const i = this.constructor,
        s = i._$Eh.get(t)
      if (void 0 !== s && this._$Em !== s) {
        const t = i.getPropertyOptions(s),
          o =
            'function' == typeof t.converter
              ? { fromAttribute: t.converter }
              : void 0 !== t.converter?.fromAttribute
              ? t.converter
              : b
        ;(this._$Em = s),
          (this[s] = o.fromAttribute(e, t.type)),
          (this._$Em = null)
      }
    }
    requestUpdate(t, e, i) {
      if (void 0 !== t) {
        if (
          ((i ??= this.constructor.getPropertyOptions(t)),
          !(i.hasChanged ?? $)(this[t], e))
        )
          return
        this.P(t, e, i)
      }
      !1 === this.isUpdatePending && (this._$ES = this._$ET())
    }
    P(t, e, i) {
      this._$AL.has(t) || this._$AL.set(t, e),
        !0 === i.reflect && this._$Em !== t && (this._$Ej ??= new Set()).add(t)
    }
    async _$ET() {
      this.isUpdatePending = !0
      try {
        await this._$ES
      } catch (t) {
        Promise.reject(t)
      }
      const t = this.scheduleUpdate()
      return null != t && (await t), !this.isUpdatePending
    }
    scheduleUpdate() {
      return this.performUpdate()
    }
    performUpdate() {
      if (!this.isUpdatePending) return
      if (!this.hasUpdated) {
        if (((this.renderRoot ??= this.createRenderRoot()), this._$Ep)) {
          for (const [t, e] of this._$Ep) this[t] = e
          this._$Ep = void 0
        }
        const t = this.constructor.elementProperties
        if (t.size > 0)
          for (const [e, i] of t)
            !0 !== i.wrapped ||
              this._$AL.has(e) ||
              void 0 === this[e] ||
              this.P(e, this[e], i)
      }
      let t = !1
      const e = this._$AL
      try {
        ;(t = this.shouldUpdate(e)),
          t
            ? (this.willUpdate(e),
              this._$EO?.forEach((t) => t.hostUpdate?.()),
              this.update(e))
            : this._$EU()
      } catch (e) {
        throw ((t = !1), this._$EU(), e)
      }
      t && this._$AE(e)
    }
    willUpdate(t) {}
    _$AE(t) {
      this._$EO?.forEach((t) => t.hostUpdated?.()),
        this.hasUpdated || ((this.hasUpdated = !0), this.firstUpdated(t)),
        this.updated(t)
    }
    _$EU() {
      ;(this._$AL = new Map()), (this.isUpdatePending = !1)
    }
    get updateComplete() {
      return this.getUpdateComplete()
    }
    getUpdateComplete() {
      return this._$ES
    }
    shouldUpdate(t) {
      return !0
    }
    update(t) {
      ;(this._$Ej &&= this._$Ej.forEach((t) => this._$EC(t, this[t]))),
        this._$EU()
    }
    updated(t) {}
    firstUpdated(t) {}
  }
  ;(y.elementStyles = []),
    (y.shadowRootOptions = { mode: 'open' }),
    (y[g('elementProperties')] = new Map()),
    (y[g('finalized')] = new Map()),
    v?.({ ReactiveElement: y }),
    (u.reactiveElementVersions ??= []).push('2.0.4')
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const A = globalThis,
    x = A.trustedTypes,
    w = x ? x.createPolicy('lit-html', { createHTML: (t) => t }) : void 0,
    E = '$lit$',
    S = `lit$${(Math.random() + '').slice(9)}$`,
    C = '?' + S,
    P = `<${C}>`,
    O = document,
    U = () => O.createComment(''),
    k = (t) => null === t || ('object' != typeof t && 'function' != typeof t),
    T = Array.isArray,
    R = '[ \t\n\f\r]',
    H = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,
    z = /-->/g,
    M = />/g,
    N = RegExp(
      `>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,
      'g'
    ),
    j = /'/g,
    L = /"/g,
    I = /^(?:script|style|textarea|title)$/i,
    D = (
      (t) =>
      (e, ...i) => ({ _$litType$: t, strings: e, values: i })
    )(1),
    q = Symbol.for('lit-noChange'),
    B = Symbol.for('lit-nothing'),
    V = new WeakMap(),
    W = O.createTreeWalker(O, 129)
  function J(t, e) {
    if (!Array.isArray(t) || !t.hasOwnProperty('raw'))
      throw Error('invalid template strings array')
    return void 0 !== w ? w.createHTML(e) : e
  }
  const K = (t, e) => {
    const i = t.length - 1,
      s = []
    let o,
      r = 2 === e ? '<svg>' : '',
      n = H
    for (let e = 0; e < i; e++) {
      const i = t[e]
      let a,
        l,
        h = -1,
        c = 0
      for (; c < i.length && ((n.lastIndex = c), (l = n.exec(i)), null !== l); )
        (c = n.lastIndex),
          n === H
            ? '!--' === l[1]
              ? (n = z)
              : void 0 !== l[1]
              ? (n = M)
              : void 0 !== l[2]
              ? (I.test(l[2]) && (o = RegExp('</' + l[2], 'g')), (n = N))
              : void 0 !== l[3] && (n = N)
            : n === N
            ? '>' === l[0]
              ? ((n = o ?? H), (h = -1))
              : void 0 === l[1]
              ? (h = -2)
              : ((h = n.lastIndex - l[2].length),
                (a = l[1]),
                (n = void 0 === l[3] ? N : '"' === l[3] ? L : j))
            : n === L || n === j
            ? (n = N)
            : n === z || n === M
            ? (n = H)
            : ((n = N), (o = void 0))
      const d = n === N && t[e + 1].startsWith('/>') ? ' ' : ''
      r +=
        n === H
          ? i + P
          : h >= 0
          ? (s.push(a), i.slice(0, h) + E + i.slice(h) + S + d)
          : i + S + (-2 === h ? e : d)
    }
    return [J(t, r + (t[i] || '<?>') + (2 === e ? '</svg>' : '')), s]
  }
  class Z {
    constructor({ strings: t, _$litType$: e }, i) {
      let s
      this.parts = []
      let o = 0,
        r = 0
      const n = t.length - 1,
        a = this.parts,
        [l, h] = K(t, e)
      if (
        ((this.el = Z.createElement(l, i)),
        (W.currentNode = this.el.content),
        2 === e)
      ) {
        const t = this.el.content.firstChild
        t.replaceWith(...t.childNodes)
      }
      for (; null !== (s = W.nextNode()) && a.length < n; ) {
        if (1 === s.nodeType) {
          if (s.hasAttributes())
            for (const t of s.getAttributeNames())
              if (t.endsWith(E)) {
                const e = h[r++],
                  i = s.getAttribute(t).split(S),
                  n = /([.?@])?(.*)/.exec(e)
                a.push({
                  type: 1,
                  index: o,
                  name: n[2],
                  strings: i,
                  ctor:
                    '.' === n[1]
                      ? Y
                      : '?' === n[1]
                      ? tt
                      : '@' === n[1]
                      ? et
                      : X,
                }),
                  s.removeAttribute(t)
              } else
                t.startsWith(S) &&
                  (a.push({ type: 6, index: o }), s.removeAttribute(t))
          if (I.test(s.tagName)) {
            const t = s.textContent.split(S),
              e = t.length - 1
            if (e > 0) {
              s.textContent = x ? x.emptyScript : ''
              for (let i = 0; i < e; i++)
                s.append(t[i], U()),
                  W.nextNode(),
                  a.push({ type: 2, index: ++o })
              s.append(t[e], U())
            }
          }
        } else if (8 === s.nodeType)
          if (s.data === C) a.push({ type: 2, index: o })
          else {
            let t = -1
            for (; -1 !== (t = s.data.indexOf(S, t + 1)); )
              a.push({ type: 7, index: o }), (t += S.length - 1)
          }
        o++
      }
    }
    static createElement(t, e) {
      const i = O.createElement('template')
      return (i.innerHTML = t), i
    }
  }
  function G(t, e, i = t, s) {
    if (e === q) return e
    let o = void 0 !== s ? i._$Co?.[s] : i._$Cl
    const r = k(e) ? void 0 : e._$litDirective$
    return (
      o?.constructor !== r &&
        (o?._$AO?.(!1),
        void 0 === r ? (o = void 0) : ((o = new r(t)), o._$AT(t, i, s)),
        void 0 !== s ? ((i._$Co ??= [])[s] = o) : (i._$Cl = o)),
      void 0 !== o && (e = G(t, o._$AS(t, e.values), o, s)),
      e
    )
  }
  class F {
    constructor(t, e) {
      ;(this._$AV = []), (this._$AN = void 0), (this._$AD = t), (this._$AM = e)
    }
    get parentNode() {
      return this._$AM.parentNode
    }
    get _$AU() {
      return this._$AM._$AU
    }
    u(t) {
      const {
          el: { content: e },
          parts: i,
        } = this._$AD,
        s = (t?.creationScope ?? O).importNode(e, !0)
      W.currentNode = s
      let o = W.nextNode(),
        r = 0,
        n = 0,
        a = i[0]
      for (; void 0 !== a; ) {
        if (r === a.index) {
          let e
          2 === a.type
            ? (e = new Q(o, o.nextSibling, this, t))
            : 1 === a.type
            ? (e = new a.ctor(o, a.name, a.strings, this, t))
            : 6 === a.type && (e = new it(o, this, t)),
            this._$AV.push(e),
            (a = i[++n])
        }
        r !== a?.index && ((o = W.nextNode()), r++)
      }
      return (W.currentNode = O), s
    }
    p(t) {
      let e = 0
      for (const i of this._$AV)
        void 0 !== i &&
          (void 0 !== i.strings
            ? (i._$AI(t, i, e), (e += i.strings.length - 2))
            : i._$AI(t[e])),
          e++
    }
  }
  class Q {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv
    }
    constructor(t, e, i, s) {
      ;(this.type = 2),
        (this._$AH = B),
        (this._$AN = void 0),
        (this._$AA = t),
        (this._$AB = e),
        (this._$AM = i),
        (this.options = s),
        (this._$Cv = s?.isConnected ?? !0)
    }
    get parentNode() {
      let t = this._$AA.parentNode
      const e = this._$AM
      return void 0 !== e && 11 === t?.nodeType && (t = e.parentNode), t
    }
    get startNode() {
      return this._$AA
    }
    get endNode() {
      return this._$AB
    }
    _$AI(t, e = this) {
      ;(t = G(this, t, e)),
        k(t)
          ? t === B || null == t || '' === t
            ? (this._$AH !== B && this._$AR(), (this._$AH = B))
            : t !== this._$AH && t !== q && this._(t)
          : void 0 !== t._$litType$
          ? this.$(t)
          : void 0 !== t.nodeType
          ? this.T(t)
          : ((t) => T(t) || 'function' == typeof t?.[Symbol.iterator])(t)
          ? this.k(t)
          : this._(t)
    }
    S(t) {
      return this._$AA.parentNode.insertBefore(t, this._$AB)
    }
    T(t) {
      this._$AH !== t && (this._$AR(), (this._$AH = this.S(t)))
    }
    _(t) {
      this._$AH !== B && k(this._$AH)
        ? (this._$AA.nextSibling.data = t)
        : this.T(O.createTextNode(t)),
        (this._$AH = t)
    }
    $(t) {
      const { values: e, _$litType$: i } = t,
        s =
          'number' == typeof i
            ? this._$AC(t)
            : (void 0 === i.el &&
                (i.el = Z.createElement(J(i.h, i.h[0]), this.options)),
              i)
      if (this._$AH?._$AD === s) this._$AH.p(e)
      else {
        const t = new F(s, this),
          i = t.u(this.options)
        t.p(e), this.T(i), (this._$AH = t)
      }
    }
    _$AC(t) {
      let e = V.get(t.strings)
      return void 0 === e && V.set(t.strings, (e = new Z(t))), e
    }
    k(t) {
      T(this._$AH) || ((this._$AH = []), this._$AR())
      const e = this._$AH
      let i,
        s = 0
      for (const o of t)
        s === e.length
          ? e.push((i = new Q(this.S(U()), this.S(U()), this, this.options)))
          : (i = e[s]),
          i._$AI(o),
          s++
      s < e.length && (this._$AR(i && i._$AB.nextSibling, s), (e.length = s))
    }
    _$AR(t = this._$AA.nextSibling, e) {
      for (this._$AP?.(!1, !0, e); t && t !== this._$AB; ) {
        const e = t.nextSibling
        t.remove(), (t = e)
      }
    }
    setConnected(t) {
      void 0 === this._$AM && ((this._$Cv = t), this._$AP?.(t))
    }
  }
  class X {
    get tagName() {
      return this.element.tagName
    }
    get _$AU() {
      return this._$AM._$AU
    }
    constructor(t, e, i, s, o) {
      ;(this.type = 1),
        (this._$AH = B),
        (this._$AN = void 0),
        (this.element = t),
        (this.name = e),
        (this._$AM = s),
        (this.options = o),
        i.length > 2 || '' !== i[0] || '' !== i[1]
          ? ((this._$AH = Array(i.length - 1).fill(new String())),
            (this.strings = i))
          : (this._$AH = B)
    }
    _$AI(t, e = this, i, s) {
      const o = this.strings
      let r = !1
      if (void 0 === o)
        (t = G(this, t, e, 0)),
          (r = !k(t) || (t !== this._$AH && t !== q)),
          r && (this._$AH = t)
      else {
        const s = t
        let n, a
        for (t = o[0], n = 0; n < o.length - 1; n++)
          (a = G(this, s[i + n], e, n)),
            a === q && (a = this._$AH[n]),
            (r ||= !k(a) || a !== this._$AH[n]),
            a === B ? (t = B) : t !== B && (t += (a ?? '') + o[n + 1]),
            (this._$AH[n] = a)
      }
      r && !s && this.j(t)
    }
    j(t) {
      t === B
        ? this.element.removeAttribute(this.name)
        : this.element.setAttribute(this.name, t ?? '')
    }
  }
  class Y extends X {
    constructor() {
      super(...arguments), (this.type = 3)
    }
    j(t) {
      this.element[this.name] = t === B ? void 0 : t
    }
  }
  class tt extends X {
    constructor() {
      super(...arguments), (this.type = 4)
    }
    j(t) {
      this.element.toggleAttribute(this.name, !!t && t !== B)
    }
  }
  class et extends X {
    constructor(t, e, i, s, o) {
      super(t, e, i, s, o), (this.type = 5)
    }
    _$AI(t, e = this) {
      if ((t = G(this, t, e, 0) ?? B) === q) return
      const i = this._$AH,
        s =
          (t === B && i !== B) ||
          t.capture !== i.capture ||
          t.once !== i.once ||
          t.passive !== i.passive,
        o = t !== B && (i === B || s)
      s && this.element.removeEventListener(this.name, this, i),
        o && this.element.addEventListener(this.name, this, t),
        (this._$AH = t)
    }
    handleEvent(t) {
      'function' == typeof this._$AH
        ? this._$AH.call(this.options?.host ?? this.element, t)
        : this._$AH.handleEvent(t)
    }
  }
  class it {
    constructor(t, e, i) {
      ;(this.element = t),
        (this.type = 6),
        (this._$AN = void 0),
        (this._$AM = e),
        (this.options = i)
    }
    get _$AU() {
      return this._$AM._$AU
    }
    _$AI(t) {
      G(this, t)
    }
  }
  const st = A.litHtmlPolyfillSupport
  st?.(Z, Q), (A.litHtmlVersions ??= []).push('3.1.2')
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  class ot extends y {
    constructor() {
      super(...arguments),
        (this.renderOptions = { host: this }),
        (this._$Do = void 0)
    }
    createRenderRoot() {
      const t = super.createRenderRoot()
      return (this.renderOptions.renderBefore ??= t.firstChild), t
    }
    update(t) {
      const e = this.render()
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected),
        super.update(t),
        (this._$Do = ((t, e, i) => {
          const s = i?.renderBefore ?? e
          let o = s._$litPart$
          if (void 0 === o) {
            const t = i?.renderBefore ?? null
            s._$litPart$ = o = new Q(e.insertBefore(U(), t), t, void 0, i ?? {})
          }
          return o._$AI(t), o
        })(e, this.renderRoot, this.renderOptions))
    }
    connectedCallback() {
      super.connectedCallback(), this._$Do?.setConnected(!0)
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this._$Do?.setConnected(!1)
    }
    render() {
      return q
    }
  }
  ;(ot._$litElement$ = !0),
    (ot.finalized = !0),
    globalThis.litElementHydrateSupport?.({ LitElement: ot })
  const rt = globalThis.litElementPolyfillSupport
  rt?.({ LitElement: ot }), (globalThis.litElementVersions ??= []).push('4.0.4')
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const nt = {
      attribute: !0,
      type: String,
      converter: b,
      reflect: !1,
      hasChanged: $,
    },
    at = (t = nt, e, i) => {
      const { kind: s, metadata: o } = i
      let r = globalThis.litPropertyMetadata.get(o)
      if (
        (void 0 === r && globalThis.litPropertyMetadata.set(o, (r = new Map())),
        r.set(i.name, t),
        'accessor' === s)
      ) {
        const { name: s } = i
        return {
          set(i) {
            const o = e.get.call(this)
            e.set.call(this, i), this.requestUpdate(s, o, t)
          },
          init(e) {
            return void 0 !== e && this.P(s, void 0, t), e
          },
        }
      }
      if ('setter' === s) {
        const { name: s } = i
        return function (i) {
          const o = this[s]
          e.call(this, i), this.requestUpdate(s, o, t)
        }
      }
      throw Error('Unsupported decorator location: ' + s)
    }
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */ function lt(t) {
    return (e, i) =>
      'object' == typeof i
        ? at(t, e, i)
        : ((t, e, i) => {
            const s = e.hasOwnProperty(i)
            return (
              e.constructor.createProperty(i, s ? { ...t, wrapped: !0 } : t),
              s ? Object.getOwnPropertyDescriptor(e, i) : void 0
            )
          })(t, e, i)
    /**
     * @license
     * Copyright 2017 Google LLC
     * SPDX-License-Identifier: BSD-3-Clause
     */
  }
  const ht = ((t, ...e) => {
    const i =
      1 === t.length
        ? t[0]
        : e.reduce(
            (e, i, s) =>
              e +
              ((t) => {
                if (!0 === t._$cssResult$) return t.cssText
                if ('number' == typeof t) return t
                throw Error(
                  "Value passed to 'css' function must be a 'css' function result: " +
                    t +
                    ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security."
                )
              })(i) +
              t[s + 1],
            t[0]
          )
    return new r(i, t, s)
  })`html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,main,menu,nav,output,ruby,section,summary,time,mark,audio,video{margin:0;padding:0;border:0;font-size:100%;font:inherit;vertical-align:baseline}article,aside,details,figcaption,figure,footer,header,hgroup,main,menu,nav,section{display:block}*[hidden]{display:none}body{line-height:1}menu,ol,ul{list-style:none}blockquote,q{quotes:none}blockquote:before,blockquote:after,q:before,q:after{content:"";content:none}table{border-collapse:collapse;border-spacing:0}:host{display:block;-webkit-box-sizing:border-box;box-sizing:border-box;height:100%;overflow:auto;--vm-inner-box-sizing:border-box;--vm-font-size:14px;--vm-margin:12px;--vm-control-margin-horizontal:8px;--vm-control-margin-vertical:12px;--vm-padding:8px;--vm-box-padding:16px;--vm-table-padding:4px 8px;--vm-control-padding-horizontal:12px;--vm-control-padding-vertical:6px;--vm-color-bg-base:#fff;--vm-color-bg-mask:rgba(0,0,0,0.45),--vm-color-primary:#1677ff;--vm-color-primary-hover:#4096ff;--vm-color-success:#52c41a;--vm-color-warning:#faad14;--vm-color-error:#ff4d4f;--vm-color-text-base:#000;--vm-color-text-secondary:rgba(0,0,0,0.65);--vm-color-text-tertiary:rgba(0,0,0,0.45);--vm-color-text-disabled:rgba(0,0,0,0.25);--vm-color-link:#1677ff;--vm-color-link-hover:#69b1ff;--vm-color-highlight:#ff4d4f;--vm-color-border:#d9d9d9;--vm-color-fill-primary:#4096ff;--vm-color-fill:rgba(0,0,0,0.15);--vm-color-fill-secondary:rgba(0,0,0,0.04);--vm-color-fill-tertiary:rgba(0,0,0,0.04);--vm-color-fill-quaternary:rgba(0,0,0,0.02);--vm-color-fill-icon:rgba(0,0,0,0.45);--vm-border-radius:8px;--vm-font-family:inherit;--vm-font-size:14px;--vm-font-size-heading5:16px;--vm-font-weight-strong:600;--vm-line-height:1.5714285714285714;--vm-box-shadow:0 6px 16px 0 rgba(0,0,0,0.05),0 3px 6px -4px rgba(0,0,0,0.12),0 9px 28px 8px rgba(0,0,0,0.05);--vm-box-shadow-secondary:0 6px 16px 0 rgba(0,0,0,0.03),0 3px 6px -4px rgba(0,0,0,0.08),0 9px 28px 8px rgba(0,0,0,0.02);--vm-box-shadow-tertiary:0 1px 2px 0 rgba(0,0,0,0.01),0 1px 6px -1px rgba(0,0,0,0.02),0 2px 4px 0 rgba(0,0,0,0.02)}:host *{-webkit-box-sizing:border-box;box-sizing:border-box}.vm-guides{height:100%;overflow:auto;font-size:var(--vm-font-size,14px);line-height:var(--vm-line-height,1.5);padding:var(--vm-box-padding,16px);background:var(--vm-color-bg-base,#fff);border-radius:var(--vm-border-radius,12px);-webkit-box-shadow:var(--vm-box-shadow-secondary,none);box-shadow:var(--vm-box-shadow-secondary,none)}.tip{font-size:var(--vm-font-size-heading5,16px)}.guides{margin-top:var(--vm-control-margin-vertical,16px)}.item{background:var(--vm-color-fill-tertiary,#eee);border-radius:var(--vm-border-radius,6px);-webkit-box-shadow:var(--vm-box-shadow-tertiary,0 0 2px 0 rgba(0,0,0,0.0666666667));box-shadow:var(--vm-box-shadow-tertiary,0 0 2px 0 rgba(0,0,0,0.0666666667));padding:var(--vm-control-padding-vertical) var(--vm-control-padding-horizontal);cursor:pointer}.item:hover{-webkit-box-shadow:var(--vm-box-shadow-secondary,0 0 4px 0 rgba(0,0,0,0.0666666667));box-shadow:var(--vm-box-shadow-secondary,0 0 4px 0 rgba(0,0,0,0.0666666667))}.item+.item{margin-top:var(--vm-control-margin-vertical,8px)}.rows .item{display:inline-block}.rows .item+.item{margin-top:0;margin-left:var(--vm-control-margin-horizontal,8px)}`
  var ct
  !(function (t) {
    ;(t.vmConnected = 'vm-inside-connected'),
      (t.vmDisconnected = 'vm-inside-disconnected'),
      (t.asrInsideEvent = 'vm-inside-asr'),
      (t.nlpInsideEvent = 'vm-inside-nlp'),
      (t.interruptInsideEvent = 'vm-inside-interact-by-text'),
      (t.interactByTextEvent = 'vm-inside-interact-by-text'),
      (t.startRecordInsideEvent = 'vm-inside-start-record'),
      (t.stopRecordInsideEvent = 'vm-inside-stop-record')
  })(ct || (ct = {}))
  const dt = (t, e, i) =>
    new CustomEvent(
      t,
      Object.assign({ detail: e, bubbles: !0, composed: !0 }, i)
    )
  let pt = class extends ot {
    constructor() {
      super(...arguments),
        Object.defineProperty(this, 'guideTip', {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: '',
        }),
        Object.defineProperty(this, 'guideLayout', {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: 'rows',
        }),
        Object.defineProperty(this, 'guideList', {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: [],
        })
    }
    connectedCallback() {
      super.connectedCallback(),
        (this.guideList = [
          { content: '你是谁' },
          { content: '你会什么' },
          { content: '介绍一下' },
        ])
    }
    disconnectedCallback() {
      super.disconnectedCallback()
    }
    _onClick(t) {
      var e, i
      ;(null == t ? void 0 : t.content) &&
        (this.dispatchEvent(
          dt(
            'choise',
            {
              text: null == t ? void 0 : t.content,
              extend: Object.assign({}, t),
            },
            { bubbles: !1 }
          )
        ),
        (e = (null == t ? void 0 : t.content) || ''),
        globalThis.dispatchEvent(
          dt(ct.interactByTextEvent, { text: e, extend: i })
        ))
    }
    render() {
      return D` ${
        this.guideList.length
          ? D`
          <div class="vm-guides">
            <p class="tip">${this.guideTip}</p>
            <div class="guides ${'rows' === this.guideLayout ? 'rows' : ''}">
              ${this.guideList.map(
                (t) => D`<div class="item" @click=${() => this._onClick(t)}>
                    ${t.content}
                  </div>`
              )}
            </div>
          </div>
        `
          : B
      }`
    }
  }
  return (
    Object.defineProperty(pt, 'styles', {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: [ht],
    }),
    Object.defineProperty(pt, 'shadowRootOptions', {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: Object.assign(Object.assign({}, ot.shadowRootOptions), {
        mode: 'closed',
      }),
    }),
    t([lt()], pt.prototype, 'guideTip', void 0),
    t([lt()], pt.prototype, 'guideLayout', void 0),
    t(
      [
        (function (t) {
          return lt({ ...t, state: !0, attribute: !1 })
        })(),
      ],
      pt.prototype,
      'guideList',
      void 0
    ),
    (pt = t(
      [
        ((t) => (e, i) => {
          void 0 !== i
            ? i.addInitializer(() => {
                customElements.define(t, e)
              })
            : customElements.define(t, e)
        })('vm-guides'),
      ],
      pt
    )),
    pt
  )
})
