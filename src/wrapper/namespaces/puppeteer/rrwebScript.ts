export const rrwebScript = `
//# https://cdn.jsdelivr.net/npm/rrweb-snapshot@2.0.0-alpha.11/dist/rrweb-snapshot.min.js
var rrwebSnapshot = (function (e) {
  "use strict";
  var t;
  function r(e) {
    return e.nodeType === e.ELEMENT_NODE;
  }
  function n(e) {
    var t = null == e ? void 0 : e.host;
    return Boolean((null == t ? void 0 : t.shadowRoot) === e);
  }
  function a(e) {
    return "[object ShadowRoot]" === Object.prototype.toString.call(e);
  }
  function o(e) {
    var t = e.cssText;
    if (t.split('"').length < 3) return t;
    var r = ["@import", "url(".concat(JSON.stringify(e.href), ")")];
    return (
      "" === e.layerName
        ? r.push("layer")
        : e.layerName && r.push("layer(".concat(e.layerName, ")")),
      e.supportsText && r.push("supports(".concat(e.supportsText, ")")),
      e.media.length && r.push(e.media.mediaText),
      r.join(" ") + ";"
    );
  }
  function i(e) {
    try {
      var t = e.rules || e.cssRules;
      return t
        ? ((r = Array.from(t).map(s).join("")).includes(
            " background-clip: text;"
          ) &&
            !r.includes(" -webkit-background-clip: text;") &&
            (r = r.replace(
              " background-clip: text;",
              " -webkit-background-clip: text; background-clip: text;"
            )),
          r)
        : null;
    } catch (e) {
      return null;
    }
    var r;
  }
  function s(e) {
    var t;
    if (l(e))
      try {
        t = i(e.styleSheet) || o(e);
      } catch (e) {}
    return c(t || e.cssText);
  }
  function c(e) {
    if (e.includes(":")) {
      return e.replace(/(\\[(?:[\\w-]+)[^\\\\])(:(?:[\\w-]+)\\])/gm, "$1\\\\$2");
    }
    return e;
  }
  function l(e) {
    return "styleSheet" in e;
  }
  (e.NodeType = void 0),
    ((t = e.NodeType || (e.NodeType = {}))[(t.Document = 0)] = "Document"),
    (t[(t.DocumentType = 1)] = "DocumentType"),
    (t[(t.Element = 2)] = "Element"),
    (t[(t.Text = 3)] = "Text"),
    (t[(t.CDATA = 4)] = "CDATA"),
    (t[(t.Comment = 5)] = "Comment");
  var u = (function () {
    function e() {
      (this.idNodeMap = new Map()), (this.nodeMetaMap = new WeakMap());
    }
    return (
      (e.prototype.getId = function (e) {
        var t;
        if (!e) return -1;
        var r = null === (t = this.getMeta(e)) || void 0 === t ? void 0 : t.id;
        return null != r ? r : -1;
      }),
      (e.prototype.getNode = function (e) {
        return this.idNodeMap.get(e) || null;
      }),
      (e.prototype.getIds = function () {
        return Array.from(this.idNodeMap.keys());
      }),
      (e.prototype.getMeta = function (e) {
        return this.nodeMetaMap.get(e) || null;
      }),
      (e.prototype.removeNodeFromMap = function (e) {
        var t = this,
          r = this.getId(e);
        this.idNodeMap.delete(r),
          e.childNodes &&
            e.childNodes.forEach(function (e) {
              return t.removeNodeFromMap(e);
            });
      }),
      (e.prototype.has = function (e) {
        return this.idNodeMap.has(e);
      }),
      (e.prototype.hasNode = function (e) {
        return this.nodeMetaMap.has(e);
      }),
      (e.prototype.add = function (e, t) {
        var r = t.id;
        this.idNodeMap.set(r, e), this.nodeMetaMap.set(e, t);
      }),
      (e.prototype.replace = function (e, t) {
        var r = this.getNode(e);
        if (r) {
          var n = this.nodeMetaMap.get(r);
          n && this.nodeMetaMap.set(t, n);
        }
        this.idNodeMap.set(e, t);
      }),
      (e.prototype.reset = function () {
        (this.idNodeMap = new Map()), (this.nodeMetaMap = new WeakMap());
      }),
      e
    );
  })();
  function d(e) {
    var t = e.element,
      r = e.maskInputOptions,
      n = e.tagName,
      a = e.type,
      o = e.value,
      i = e.maskInputFn,
      s = o || "",
      c = a && p(a);
    return (
      (r[n.toLowerCase()] || (c && r[c])) &&
        (s = i ? i(s, t) : "*".repeat(s.length)),
      s
    );
  }
  function p(e) {
    return e.toLowerCase();
  }
  var f = "__rrweb_original__";
  function m(e) {
    var t = e.getContext("2d");
    if (!t) return !0;
    for (var r = 0; r < e.width; r += 50)
      for (var n = 0; n < e.height; n += 50) {
        var a = t.getImageData,
          o = f in a ? a.__rrweb_original__ : a;
        if (
          new Uint32Array(
            o.call(
              t,
              r,
              n,
              Math.min(50, e.width - r),
              Math.min(50, e.height - n)
            ).data.buffer
          ).some(function (e) {
            return 0 !== e;
          })
        )
          return !1;
      }
    return !0;
  }
  function h(t, r) {
    return (
      !(!t || !r || t.type !== r.type) &&
      (t.type === e.NodeType.Document
        ? t.compatMode === r.compatMode
        : t.type === e.NodeType.DocumentType
          ? t.name === r.name &&
            t.publicId === r.publicId &&
            t.systemId === r.systemId
          : t.type === e.NodeType.Comment ||
              t.type === e.NodeType.Text ||
              t.type === e.NodeType.CDATA
            ? t.textContent === r.textContent
            : t.type === e.NodeType.Element &&
              t.tagName === r.tagName &&
              JSON.stringify(t.attributes) === JSON.stringify(r.attributes) &&
              t.isSVG === r.isSVG &&
              t.needBlock === r.needBlock)
    );
  }
  function v(e) {
    var t = e.type;
    return e.hasAttribute("data-rr-is-password") ? "password" : t ? p(t) : null;
  }
  var y,
    g,
    T = 1,
    b = new RegExp("[^a-z0-9-_:]");
  function k() {
    return T++;
  }
  var N = /url\\((?:(')([^']*)'|(")(.*?)"|([^)]*))\\)/gm,
    C = /^(?:[a-z+]+:)?\\/\\//i,
    S = /^www\\..*/i,
    w = /^(data:)([^,]*),(.*)/i;
  function x(e, t) {
    return (e || "").replace(N, function (e, r, n, a, o, i) {
      var s,
        c = n || o || i,
        l = r || a || "";
      if (!c) return e;
      if (C.test(c) || S.test(c))
        return "url(".concat(l).concat(c).concat(l, ")");
      if (w.test(c)) return "url(".concat(l).concat(c).concat(l, ")");
      if ("/" === c[0])
        return "url("
          .concat(l)
          .concat(
            ((s = t),
            (s.indexOf("//") > -1
              ? s.split("/").slice(0, 3).join("/")
              : s.split("/")[0]
            ).split("?")[0] + c)
          )
          .concat(l, ")");
      var u = t.split("/"),
        d = c.split("/");
      u.pop();
      for (var p = 0, f = d; p < f.length; p++) {
        var m = f[p];
        "." !== m && (".." === m ? u.pop() : u.push(m));
      }
      return "url(".concat(l).concat(u.join("/")).concat(l, ")");
    });
  }
  var I = /^[^ \\t\\n\\r\\u000c]+/,
    E = /^[, \\t\\n\\r\\u000c]+/;
  function L(e, t) {
    if (!t || "" === t.trim()) return t;
    var r = e.createElement("a");
    return (r.href = t), r.href;
  }
  function M(e) {
    return Boolean("svg" === e.tagName || e.ownerSVGElement);
  }
  function O() {
    var e = document.createElement("a");
    return (e.href = ""), e.href;
  }
  function D(e, t, r, n) {
    return n
      ? "src" === r ||
        ("href" === r && ("use" !== t || "#" !== n[0])) ||
        ("xlink:href" === r && "#" !== n[0])
        ? L(e, n)
        : "background" !== r || ("table" !== t && "td" !== t && "th" !== t)
          ? "srcset" === r
            ? (function (e, t) {
                if ("" === t.trim()) return t;
                var r = 0;
                function n(e) {
                  var n,
                    a = e.exec(t.substring(r));
                  return a ? ((n = a[0]), (r += n.length), n) : "";
                }
                for (var a = []; n(E), !(r >= t.length); ) {
                  var o = n(I);
                  if ("," === o.slice(-1))
                    (o = L(e, o.substring(0, o.length - 1))), a.push(o);
                  else {
                    var i = "";
                    o = L(e, o);
                    for (var s = !1; ; ) {
                      var c = t.charAt(r);
                      if ("" === c) {
                        a.push((o + i).trim());
                        break;
                      }
                      if (s) ")" === c && (s = !1);
                      else {
                        if ("," === c) {
                          (r += 1), a.push((o + i).trim());
                          break;
                        }
                        "(" === c && (s = !0);
                      }
                      (i += c), (r += 1);
                    }
                  }
                }
                return a.join(", ");
              })(e, n)
            : "style" === r
              ? x(n, O())
              : "object" === t && "data" === r
                ? L(e, n)
                : n
          : L(e, n)
      : n;
  }
  function _(e, t, r) {
    return ("video" === e || "audio" === e) && "autoplay" === t;
  }
  function A(e, t, r) {
    if (!e) return !1;
    if (e.nodeType !== e.ELEMENT_NODE) return !!r && A(e.parentNode, t, r);
    for (var n = e.classList.length; n--; ) {
      var a = e.classList[n];
      if (t.test(a)) return !0;
    }
    return !!r && A(e.parentNode, t, r);
  }
  function R(e, t, r) {
    try {
      var n = e.nodeType === e.ELEMENT_NODE ? e : e.parentElement;
      if (null === n) return !1;
      if ("string" == typeof t) {
        if (n.classList.contains(t)) return !0;
        if (n.closest(".".concat(t))) return !0;
      } else if (A(n, t, !0)) return !0;
      if (r) {
        if (n.matches(r)) return !0;
        if (n.closest(r)) return !0;
      }
    } catch (e) {}
    return !1;
  }
  function F(t, r) {
    var n = r.doc,
      a = r.mirror,
      o = r.blockClass,
      s = r.blockSelector,
      c = r.maskTextClass,
      l = r.maskTextSelector,
      u = r.inlineStylesheet,
      f = r.maskInputOptions,
      h = void 0 === f ? {} : f,
      T = r.maskTextFn,
      k = r.maskInputFn,
      N = r.dataURLOptions,
      C = void 0 === N ? {} : N,
      S = r.inlineImages,
      w = r.recordCanvas,
      I = r.keepIframeSrcFn,
      E = r.newlyAddedElement,
      L = void 0 !== E && E,
      A = (function (e, t) {
        if (!t.hasNode(e)) return;
        var r = t.getId(e);
        return 1 === r ? void 0 : r;
      })(n, a);
    switch (t.nodeType) {
      case t.DOCUMENT_NODE:
        return "CSS1Compat" !== t.compatMode
          ? {
              type: e.NodeType.Document,
              childNodes: [],
              compatMode: t.compatMode,
            }
          : { type: e.NodeType.Document, childNodes: [] };
      case t.DOCUMENT_TYPE_NODE:
        return {
          type: e.NodeType.DocumentType,
          name: t.name,
          publicId: t.publicId,
          systemId: t.systemId,
          rootId: A,
        };
      case t.ELEMENT_NODE:
        return (function (t, r) {
          for (
            var n = r.doc,
              a = r.blockClass,
              o = r.blockSelector,
              s = r.inlineStylesheet,
              c = r.maskInputOptions,
              l = void 0 === c ? {} : c,
              u = r.maskInputFn,
              f = r.dataURLOptions,
              h = void 0 === f ? {} : f,
              T = r.inlineImages,
              k = r.recordCanvas,
              N = r.keepIframeSrcFn,
              C = r.newlyAddedElement,
              S = void 0 !== C && C,
              w = r.rootId,
              I = (function (e, t, r) {
                try {
                  if ("string" == typeof t) {
                    if (e.classList.contains(t)) return !0;
                  } else
                    for (var n = e.classList.length; n--; ) {
                      var a = e.classList[n];
                      if (t.test(a)) return !0;
                    }
                  if (r) return e.matches(r);
                } catch (e) {}
                return !1;
              })(t, a, o),
              E = (function (e) {
                if (e instanceof HTMLFormElement) return "form";
                var t = p(e.tagName);
                return b.test(t) ? "div" : t;
              })(t),
              L = {},
              A = t.attributes.length,
              R = 0;
            R < A;
            R++
          ) {
            var F = t.attributes[R];
            _(E, F.name, F.value) || (L[F.name] = D(n, E, p(F.name), F.value));
          }
          if ("link" === E && s) {
            var U = Array.from(n.styleSheets).find(function (e) {
                return e.href === t.href;
              }),
              W = null;
            U && (W = i(U)),
              W && (delete L.rel, delete L.href, (L._cssText = x(W, U.href)));
          }
          if (
            "style" === E &&
            t.sheet &&
            !(t.innerText || t.textContent || "").trim().length
          ) {
            (W = i(t.sheet)) && (L._cssText = x(W, O()));
          }
          if ("input" === E || "textarea" === E || "select" === E) {
            var j = t.value,
              B = t.checked;
            if (
              "radio" !== L.type &&
              "checkbox" !== L.type &&
              "submit" !== L.type &&
              "button" !== L.type &&
              j
            ) {
              var P = v(t);
              L.value = d({
                element: t,
                type: P,
                tagName: E,
                value: j,
                maskInputOptions: l,
                maskInputFn: u,
              });
            } else B && (L.checked = B);
          }
          "option" === E &&
            (t.selected && !l.select ? (L.selected = !0) : delete L.selected);
          if ("canvas" === E && k)
            if ("2d" === t.__context)
              m(t) || (L.rr_dataURL = t.toDataURL(h.type, h.quality));
            else if (!("__context" in t)) {
              var G = t.toDataURL(h.type, h.quality),
                H = document.createElement("canvas");
              (H.width = t.width),
                (H.height = t.height),
                G !== H.toDataURL(h.type, h.quality) && (L.rr_dataURL = G);
            }
          if ("img" === E && T) {
            y || ((y = n.createElement("canvas")), (g = y.getContext("2d")));
            var z = t,
              V = z.crossOrigin;
            z.crossOrigin = "anonymous";
            var q = function () {
              z.removeEventListener("load", q);
              try {
                (y.width = z.naturalWidth),
                  (y.height = z.naturalHeight),
                  g.drawImage(z, 0, 0),
                  (L.rr_dataURL = y.toDataURL(h.type, h.quality));
              } catch (e) {
                console.warn(
                  "Cannot inline img src="
                    .concat(z.currentSrc, "! Error: ")
                    .concat(e)
                );
              }
              V ? (L.crossOrigin = V) : z.removeAttribute("crossorigin");
            };
            z.complete && 0 !== z.naturalWidth
              ? q()
              : z.addEventListener("load", q);
          }
          ("audio" !== E && "video" !== E) ||
            ((L.rr_mediaState = t.paused ? "paused" : "played"),
            (L.rr_mediaCurrentTime = t.currentTime));
          S ||
            (t.scrollLeft && (L.rr_scrollLeft = t.scrollLeft),
            t.scrollTop && (L.rr_scrollTop = t.scrollTop));
          if (I) {
            var $ = t.getBoundingClientRect(),
              Y = $.width,
              J = $.height;
            L = {
              class: L.class,
              rr_width: "".concat(Y, "px"),
              rr_height: "".concat(J, "px"),
            };
          }
          "iframe" !== E ||
            N(L.src) ||
            (t.contentDocument || (L.rr_src = L.src), delete L.src);
          return {
            type: e.NodeType.Element,
            tagName: E,
            attributes: L,
            childNodes: [],
            isSVG: M(t) || void 0,
            needBlock: I,
            rootId: w,
          };
        })(t, {
          doc: n,
          blockClass: o,
          blockSelector: s,
          inlineStylesheet: u,
          maskInputOptions: h,
          maskInputFn: k,
          dataURLOptions: C,
          inlineImages: S,
          recordCanvas: w,
          keepIframeSrcFn: I,
          newlyAddedElement: L,
          rootId: A,
        });
      case t.TEXT_NODE:
        return (function (t, r) {
          var n,
            a = r.maskTextClass,
            o = r.maskTextSelector,
            s = r.maskTextFn,
            c = r.rootId,
            l = t.parentNode && t.parentNode.tagName,
            u = t.textContent,
            d = "STYLE" === l || void 0,
            p = "SCRIPT" === l || void 0;
          if (d && u) {
            try {
              t.nextSibling ||
                t.previousSibling ||
                ((null === (n = t.parentNode.sheet) || void 0 === n
                  ? void 0
                  : n.cssRules) &&
                  (u = i(t.parentNode.sheet)));
            } catch (e) {
              console.warn(
                "Cannot get CSS styles from text's parentNode. Error: ".concat(
                  e
                ),
                t
              );
            }
            u = x(u, O());
          }
          p && (u = "SCRIPT_PLACEHOLDER");
          !d &&
            !p &&
            u &&
            R(t, a, o) &&
            (u = s ? s(u) : u.replace(/[\\S]/g, "*"));
          return {
            type: e.NodeType.Text,
            textContent: u || "",
            isStyle: d,
            rootId: c,
          };
        })(t, {
          maskTextClass: c,
          maskTextSelector: l,
          maskTextFn: T,
          rootId: A,
        });
      case t.CDATA_SECTION_NODE:
        return { type: e.NodeType.CDATA, textContent: "", rootId: A };
      case t.COMMENT_NODE:
        return {
          type: e.NodeType.Comment,
          textContent: t.textContent || "",
          rootId: A,
        };
      default:
        return !1;
    }
  }
  function U(e) {
    return null == e ? "" : e.toLowerCase();
  }
  function W(t, o) {
    var i,
      s = o.doc,
      c = o.mirror,
      l = o.blockClass,
      u = o.blockSelector,
      d = o.maskTextClass,
      p = o.maskTextSelector,
      f = o.skipChild,
      m = void 0 !== f && f,
      h = o.inlineStylesheet,
      v = void 0 === h || h,
      y = o.maskInputOptions,
      g = void 0 === y ? {} : y,
      T = o.maskTextFn,
      b = o.maskInputFn,
      N = o.slimDOMOptions,
      C = o.dataURLOptions,
      S = void 0 === C ? {} : C,
      w = o.inlineImages,
      x = void 0 !== w && w,
      I = o.recordCanvas,
      E = void 0 !== I && I,
      L = o.onSerialize,
      M = o.onIframeLoad,
      O = o.iframeLoadTimeout,
      D = void 0 === O ? 5e3 : O,
      _ = o.onStylesheetLoad,
      A = o.stylesheetLoadTimeout,
      R = void 0 === A ? 5e3 : A,
      j = o.keepIframeSrcFn,
      B =
        void 0 === j
          ? function () {
              return !1;
            }
          : j,
      P = o.newlyAddedElement,
      G = void 0 !== P && P,
      H = o.preserveWhiteSpace,
      z = void 0 === H || H,
      V = F(t, {
        doc: s,
        mirror: c,
        blockClass: l,
        blockSelector: u,
        maskTextClass: d,
        maskTextSelector: p,
        inlineStylesheet: v,
        maskInputOptions: g,
        maskTextFn: T,
        maskInputFn: b,
        dataURLOptions: S,
        inlineImages: x,
        recordCanvas: E,
        keepIframeSrcFn: B,
        newlyAddedElement: G,
      });
    if (!V) return console.warn(t, "not serialized"), null;
    i = c.hasNode(t)
      ? c.getId(t)
      : !(function (t, r) {
            if (r.comment && t.type === e.NodeType.Comment) return !0;
            if (t.type === e.NodeType.Element) {
              if (
                r.script &&
                ("script" === t.tagName ||
                  ("link" === t.tagName &&
                    ("preload" === t.attributes.rel ||
                      "modulepreload" === t.attributes.rel) &&
                    "script" === t.attributes.as) ||
                  ("link" === t.tagName &&
                    "prefetch" === t.attributes.rel &&
                    "string" == typeof t.attributes.href &&
                    t.attributes.href.endsWith(".js")))
              )
                return !0;
              if (
                r.headFavicon &&
                (("link" === t.tagName &&
                  "shortcut icon" === t.attributes.rel) ||
                  ("meta" === t.tagName &&
                    (U(t.attributes.name).match(
                      /^msapplication-tile(image|color)$/
                    ) ||
                      "application-name" === U(t.attributes.name) ||
                      "icon" === U(t.attributes.rel) ||
                      "apple-touch-icon" === U(t.attributes.rel) ||
                      "shortcut icon" === U(t.attributes.rel))))
              )
                return !0;
              if ("meta" === t.tagName) {
                if (
                  r.headMetaDescKeywords &&
                  U(t.attributes.name).match(/^description|keywords$/)
                )
                  return !0;
                if (
                  r.headMetaSocial &&
                  (U(t.attributes.property).match(/^(og|twitter|fb):/) ||
                    U(t.attributes.name).match(/^(og|twitter):/) ||
                    "pinterest" === U(t.attributes.name))
                )
                  return !0;
                if (
                  r.headMetaRobots &&
                  ("robots" === U(t.attributes.name) ||
                    "googlebot" === U(t.attributes.name) ||
                    "bingbot" === U(t.attributes.name))
                )
                  return !0;
                if (
                  r.headMetaHttpEquiv &&
                  void 0 !== t.attributes["http-equiv"]
                )
                  return !0;
                if (
                  r.headMetaAuthorship &&
                  ("author" === U(t.attributes.name) ||
                    "generator" === U(t.attributes.name) ||
                    "framework" === U(t.attributes.name) ||
                    "publisher" === U(t.attributes.name) ||
                    "progid" === U(t.attributes.name) ||
                    U(t.attributes.property).match(/^article:/) ||
                    U(t.attributes.property).match(/^product:/))
                )
                  return !0;
                if (
                  r.headMetaVerification &&
                  ("google-site-verification" === U(t.attributes.name) ||
                    "yandex-verification" === U(t.attributes.name) ||
                    "csrf-token" === U(t.attributes.name) ||
                    "p:domain_verify" === U(t.attributes.name) ||
                    "verify-v1" === U(t.attributes.name) ||
                    "verification" === U(t.attributes.name) ||
                    "shopify-checkout-api-token" === U(t.attributes.name))
                )
                  return !0;
              }
            }
            return !1;
          })(V, N) &&
          (z ||
            V.type !== e.NodeType.Text ||
            V.isStyle ||
            V.textContent.replace(/^\\s+|\\s+$/gm, "").length)
        ? k()
        : -2;
    var q = Object.assign(V, { id: i });
    if ((c.add(t, q), -2 === i)) return null;
    L && L(t);
    var $ = !m;
    if (q.type === e.NodeType.Element) {
      ($ = $ && !q.needBlock), delete q.needBlock;
      var Y = t.shadowRoot;
      Y && a(Y) && (q.isShadowHost = !0);
    }
    if (
      (q.type === e.NodeType.Document || q.type === e.NodeType.Element) &&
      $
    ) {
      N.headWhitespace &&
        q.type === e.NodeType.Element &&
        "head" === q.tagName &&
        (z = !1);
      for (
        var J = {
            doc: s,
            mirror: c,
            blockClass: l,
            blockSelector: u,
            maskTextClass: d,
            maskTextSelector: p,
            skipChild: m,
            inlineStylesheet: v,
            maskInputOptions: g,
            maskTextFn: T,
            maskInputFn: b,
            slimDOMOptions: N,
            dataURLOptions: S,
            inlineImages: x,
            recordCanvas: E,
            preserveWhiteSpace: z,
            onSerialize: L,
            onIframeLoad: M,
            iframeLoadTimeout: D,
            onStylesheetLoad: _,
            stylesheetLoadTimeout: R,
            keepIframeSrcFn: B,
          },
          X = 0,
          K = Array.from(t.childNodes);
        X < K.length;
        X++
      ) {
        (ee = W(K[X], J)) && q.childNodes.push(ee);
      }
      if (r(t) && t.shadowRoot)
        for (
          var Q = 0, Z = Array.from(t.shadowRoot.childNodes);
          Q < Z.length;
          Q++
        ) {
          var ee;
          (ee = W(Z[Q], J)) &&
            (a(t.shadowRoot) && (ee.isShadow = !0), q.childNodes.push(ee));
        }
    }
    return (
      t.parentNode && n(t.parentNode) && a(t.parentNode) && (q.isShadow = !0),
      q.type === e.NodeType.Element &&
        "iframe" === q.tagName &&
        (function (e, t, r) {
          var n = e.contentWindow;
          if (n) {
            var a,
              o = !1;
            try {
              a = n.document.readyState;
            } catch (e) {
              return;
            }
            if ("complete" === a) {
              var i = "about:blank";
              if (n.location.href !== i || e.src === i || "" === e.src)
                return setTimeout(t, 0), e.addEventListener("load", t);
              e.addEventListener("load", t);
            } else {
              var s = setTimeout(function () {
                o || (t(), (o = !0));
              }, r);
              e.addEventListener("load", function () {
                clearTimeout(s), (o = !0), t();
              });
            }
          }
        })(
          t,
          function () {
            var e = t.contentDocument;
            if (e && M) {
              var r = W(e, {
                doc: e,
                mirror: c,
                blockClass: l,
                blockSelector: u,
                maskTextClass: d,
                maskTextSelector: p,
                skipChild: !1,
                inlineStylesheet: v,
                maskInputOptions: g,
                maskTextFn: T,
                maskInputFn: b,
                slimDOMOptions: N,
                dataURLOptions: S,
                inlineImages: x,
                recordCanvas: E,
                preserveWhiteSpace: z,
                onSerialize: L,
                onIframeLoad: M,
                iframeLoadTimeout: D,
                onStylesheetLoad: _,
                stylesheetLoadTimeout: R,
                keepIframeSrcFn: B,
              });
              r && M(t, r);
            }
          },
          D
        ),
      q.type === e.NodeType.Element &&
        "link" === q.tagName &&
        "stylesheet" === q.attributes.rel &&
        (function (e, t, r) {
          var n,
            a = !1;
          try {
            n = e.sheet;
          } catch (e) {
            return;
          }
          if (!n) {
            var o = setTimeout(function () {
              a || (t(), (a = !0));
            }, r);
            e.addEventListener("load", function () {
              clearTimeout(o), (a = !0), t();
            });
          }
        })(
          t,
          function () {
            if (_) {
              var e = W(t, {
                doc: s,
                mirror: c,
                blockClass: l,
                blockSelector: u,
                maskTextClass: d,
                maskTextSelector: p,
                skipChild: !1,
                inlineStylesheet: v,
                maskInputOptions: g,
                maskTextFn: T,
                maskInputFn: b,
                slimDOMOptions: N,
                dataURLOptions: S,
                inlineImages: x,
                recordCanvas: E,
                preserveWhiteSpace: z,
                onSerialize: L,
                onIframeLoad: M,
                iframeLoadTimeout: D,
                onStylesheetLoad: _,
                stylesheetLoadTimeout: R,
                keepIframeSrcFn: B,
              });
              e && _(t, e);
            }
          },
          R
        ),
      q
    );
  }
  var j = /\\/\\*[^*]*\\*+([^/*][^*]*\\*+)*\\//g;
  function B(e, t) {
    void 0 === t && (t = {});
    var r = 1,
      n = 1;
    function a(e) {
      var t = e.match(/\\n/g);
      t && (r += t.length);
      var a = e.lastIndexOf("\\n");
      n = -1 === a ? n + e.length : e.length - a;
    }
    function o() {
      var e = { line: r, column: n };
      return function (t) {
        return (t.position = new i(e)), f(), t;
      };
    }
    var i = function (e) {
      (this.start = e),
        (this.end = { line: r, column: n }),
        (this.source = t.source);
    };
    i.prototype.content = e;
    var s = [];
    function c(a) {
      var o = new Error(
        ""
          .concat(t.source || "", ":")
          .concat(r, ":")
          .concat(n, ": ")
          .concat(a)
      );
      if (
        ((o.reason = a),
        (o.filename = t.source),
        (o.line = r),
        (o.column = n),
        (o.source = e),
        !t.silent)
      )
        throw o;
      s.push(o);
    }
    function l() {
      return p(/^{\\s*/);
    }
    function u() {
      return p(/^}/);
    }
    function d() {
      var t,
        r = [];
      for (f(), m(r); e.length && "}" !== e.charAt(0) && (t = w() || x()); )
        t && (r.push(t), m(r));
      return r;
    }
    function p(t) {
      var r = t.exec(e);
      if (r) {
        var n = r[0];
        return a(n), (e = e.slice(n.length)), r;
      }
    }
    function f() {
      p(/^\\s*/);
    }
    function m(e) {
      var t;
      for (void 0 === e && (e = []); (t = h()); ) t && e.push(t), (t = h());
      return e;
    }
    function h() {
      var t = o();
      if ("/" === e.charAt(0) && "*" === e.charAt(1)) {
        for (
          var r = 2;
          "" !== e.charAt(r) &&
          ("*" !== e.charAt(r) || "/" !== e.charAt(r + 1));

        )
          ++r;
        if (((r += 2), "" === e.charAt(r - 1)))
          return c("End of comment missing");
        var i = e.slice(2, r - 2);
        return (
          (n += 2),
          a(i),
          (e = e.slice(r)),
          (n += 2),
          t({ type: "comment", comment: i })
        );
      }
    }
    function v() {
      var e = p(/^([^{]+)/);
      if (e)
        return P(e[0])
          .replace(/\\/\\*([^*]|[\\r\\n]|(\\*+([^*/]|[\\r\\n])))*\\*\\/+/g, "")
          .replace(/"(?:\\\\"|[^"])*"|'(?:\\\\'|[^'])*'/g, function (e) {
            return e.replace(/,/g, "‌");
          })
          .split(/\\s*(?![^(]*\\)),\\s*/)
          .map(function (e) {
            return e.replace(/\\u200C/g, ",");
          });
    }
    function y() {
      var e = o(),
        t = p(/^(\\*?[-#\\/\\*\\\\\\w]+(\\[[0-9a-z_-]+\\])?)\\s*/);
      if (t) {
        var r = P(t[0]);
        if (!p(/^:\\s*/)) return c("property missing ':'");
        var n = p(/^((?:'(?:\\\\'|.)*?'|"(?:\\\\"|.)*?"|\\([^\\)]*?\\)|[^};])+)/),
          a = e({
            type: "declaration",
            property: r.replace(j, ""),
            value: n ? P(n[0]).replace(j, "") : "",
          });
        return p(/^[;\\s]*/), a;
      }
    }
    function g() {
      var e,
        t = [];
      if (!l()) return c("missing '{'");
      for (m(t); (e = y()); ) !1 !== e && (t.push(e), m(t)), (e = y());
      return u() ? t : c("missing '}'");
    }
    function T() {
      for (
        var e, t = [], r = o();
        (e = p(/^((\\d+\\.\\d+|\\.\\d+|\\d+)%?|[a-z]+)\\s*/));

      )
        t.push(e[1]), p(/^,\\s*/);
      if (t.length)
        return r({ type: "keyframe", values: t, declarations: g() });
    }
    var b,
      k = S("import"),
      N = S("charset"),
      C = S("namespace");
    function S(e) {
      var t = new RegExp("^@" + e + "\\\\s*([^;]+);");
      return function () {
        var r = o(),
          n = p(t);
        if (n) {
          var a = { type: e };
          return (a[e] = n[1].trim()), r(a);
        }
      };
    }
    function w() {
      if ("@" === e[0])
        return (
          (function () {
            var e = o(),
              t = p(/^@([-\\w]+)?keyframes\\s*/);
            if (t) {
              var r = t[1];
              if (!(t = p(/^([-\\w]+)\\s*/))) return c("@keyframes missing name");
              var n,
                a = t[1];
              if (!l()) return c("@keyframes missing '{'");
              for (var i = m(); (n = T()); ) i.push(n), (i = i.concat(m()));
              return u()
                ? e({ type: "keyframes", name: a, vendor: r, keyframes: i })
                : c("@keyframes missing '}'");
            }
          })() ||
          (function () {
            var e = o(),
              t = p(/^@media *([^{]+)/);
            if (t) {
              var r = P(t[1]);
              if (!l()) return c("@media missing '{'");
              var n = m().concat(d());
              return u()
                ? e({ type: "media", media: r, rules: n })
                : c("@media missing '}'");
            }
          })() ||
          (function () {
            var e = o(),
              t = p(/^@custom-media\\s+(--[^\\s]+)\\s*([^{;]+);/);
            if (t)
              return e({ type: "custom-media", name: P(t[1]), media: P(t[2]) });
          })() ||
          (function () {
            var e = o(),
              t = p(/^@supports *([^{]+)/);
            if (t) {
              var r = P(t[1]);
              if (!l()) return c("@supports missing '{'");
              var n = m().concat(d());
              return u()
                ? e({ type: "supports", supports: r, rules: n })
                : c("@supports missing '}'");
            }
          })() ||
          k() ||
          N() ||
          C() ||
          (function () {
            var e = o(),
              t = p(/^@([-\\w]+)?document *([^{]+)/);
            if (t) {
              var r = P(t[1]),
                n = P(t[2]);
              if (!l()) return c("@document missing '{'");
              var a = m().concat(d());
              return u()
                ? e({ type: "document", document: n, vendor: r, rules: a })
                : c("@document missing '}'");
            }
          })() ||
          (function () {
            var e = o();
            if (p(/^@page */)) {
              var t = v() || [];
              if (!l()) return c("@page missing '{'");
              for (var r, n = m(); (r = y()); ) n.push(r), (n = n.concat(m()));
              return u()
                ? e({ type: "page", selectors: t, declarations: n })
                : c("@page missing '}'");
            }
          })() ||
          (function () {
            var e = o();
            if (p(/^@host\\s*/)) {
              if (!l()) return c("@host missing '{'");
              var t = m().concat(d());
              return u()
                ? e({ type: "host", rules: t })
                : c("@host missing '}'");
            }
          })() ||
          (function () {
            var e = o();
            if (p(/^@font-face\\s*/)) {
              if (!l()) return c("@font-face missing '{'");
              for (var t, r = m(); (t = y()); ) r.push(t), (r = r.concat(m()));
              return u()
                ? e({ type: "font-face", declarations: r })
                : c("@font-face missing '}'");
            }
          })()
        );
    }
    function x() {
      var e = o(),
        t = v();
      return t
        ? (m(), e({ type: "rule", selectors: t, declarations: g() }))
        : c("selector missing");
    }
    return G(
      ((b = d()),
      {
        type: "stylesheet",
        stylesheet: { source: t.source, rules: b, parsingErrors: s },
      })
    );
  }
  function P(e) {
    return e ? e.replace(/^\\s+|\\s+$/g, "") : "";
  }
  function G(e, t) {
    for (
      var r = e && "string" == typeof e.type,
        n = r ? e : t,
        a = 0,
        o = Object.keys(e);
      a < o.length;
      a++
    ) {
      var i = e[o[a]];
      Array.isArray(i)
        ? i.forEach(function (e) {
            G(e, n);
          })
        : i && "object" == typeof i && G(i, n);
    }
    return (
      r &&
        Object.defineProperty(e, "parent", {
          configurable: !0,
          writable: !0,
          enumerable: !1,
          value: t || null,
        }),
      e
    );
  }
  var H = {
    script: "noscript",
    altglyph: "altGlyph",
    altglyphdef: "altGlyphDef",
    altglyphitem: "altGlyphItem",
    animatecolor: "animateColor",
    animatemotion: "animateMotion",
    animatetransform: "animateTransform",
    clippath: "clipPath",
    feblend: "feBlend",
    fecolormatrix: "feColorMatrix",
    fecomponenttransfer: "feComponentTransfer",
    fecomposite: "feComposite",
    feconvolvematrix: "feConvolveMatrix",
    fediffuselighting: "feDiffuseLighting",
    fedisplacementmap: "feDisplacementMap",
    fedistantlight: "feDistantLight",
    fedropshadow: "feDropShadow",
    feflood: "feFlood",
    fefunca: "feFuncA",
    fefuncb: "feFuncB",
    fefuncg: "feFuncG",
    fefuncr: "feFuncR",
    fegaussianblur: "feGaussianBlur",
    feimage: "feImage",
    femerge: "feMerge",
    femergenode: "feMergeNode",
    femorphology: "feMorphology",
    feoffset: "feOffset",
    fepointlight: "fePointLight",
    fespecularlighting: "feSpecularLighting",
    fespotlight: "feSpotLight",
    fetile: "feTile",
    feturbulence: "feTurbulence",
    foreignobject: "foreignObject",
    glyphref: "glyphRef",
    lineargradient: "linearGradient",
    radialgradient: "radialGradient",
  };
  var z = /([^\\\\]):hover/,
    V = new RegExp(z.source, "g");
  function q(e, t) {
    var r = null == t ? void 0 : t.stylesWithHoverClass.get(e);
    if (r) return r;
    var n = B(e, { silent: !0 });
    if (!n.stylesheet) return e;
    var a = [];
    if (
      (n.stylesheet.rules.forEach(function (e) {
        "selectors" in e &&
          (e.selectors || []).forEach(function (e) {
            z.test(e) && a.push(e);
          });
      }),
      0 === a.length)
    )
      return e;
    var o = new RegExp(
        a
          .filter(function (e, t) {
            return a.indexOf(e) === t;
          })
          .sort(function (e, t) {
            return t.length - e.length;
          })
          .map(function (e) {
            return e.replace(/[.*+?^\${}()|[\\]\\\\]/g, "\\\\$&");
          })
          .join("|"),
        "g"
      ),
      i = e.replace(o, function (e) {
        var t = e.replace(V, "$1.\\\\:hover");
        return "".concat(e, ", ").concat(t);
      });
    return null == t || t.stylesWithHoverClass.set(e, i), i;
  }
  function $(t, r) {
    var n = r.doc,
      a = r.hackCss,
      o = r.cache;
    switch (t.type) {
      case e.NodeType.Document:
        return n.implementation.createDocument(null, "", null);
      case e.NodeType.DocumentType:
        return n.implementation.createDocumentType(
          t.name || "html",
          t.publicId,
          t.systemId
        );
      case e.NodeType.Element:
        var i,
          s = (function (e) {
            var t = H[e.tagName] ? H[e.tagName] : e.tagName;
            return "link" === t && e.attributes._cssText && (t = "style"), t;
          })(t);
        i = t.isSVG
          ? n.createElementNS("http://www.w3.org/2000/svg", s)
          : n.createElement(s);
        var c = {};
        for (var l in t.attributes)
          if (Object.prototype.hasOwnProperty.call(t.attributes, l)) {
            var u = t.attributes[l];
            if (("option" !== s || "selected" !== l || !1 !== u) && null !== u)
              if ((!0 === u && (u = ""), l.startsWith("rr_"))) c[l] = u;
              else {
                var d = "textarea" === s && "value" === l,
                  p = "style" === s && "_cssText" === l;
                if (
                  (p && a && "string" == typeof u && (u = q(u, o)),
                  (!d && !p) || "string" != typeof u)
                )
                  try {
                    if (t.isSVG && "xlink:href" === l)
                      i.setAttributeNS(
                        "http://www.w3.org/1999/xlink",
                        l,
                        u.toString()
                      );
                    else if (
                      "onload" === l ||
                      "onclick" === l ||
                      "onmouse" === l.substring(0, 7)
                    )
                      i.setAttribute("_" + l, u.toString());
                    else {
                      if (
                        "meta" === s &&
                        "Content-Security-Policy" ===
                          t.attributes["http-equiv"] &&
                        "content" === l
                      ) {
                        i.setAttribute("csp-content", u.toString());
                        continue;
                      }
                      ("link" !== s ||
                        ("preload" !== t.attributes.rel &&
                          "modulepreload" !== t.attributes.rel) ||
                        "script" !== t.attributes.as) &&
                        (("link" === s &&
                          "prefetch" === t.attributes.rel &&
                          "string" == typeof t.attributes.href &&
                          t.attributes.href.endsWith(".js")) ||
                          ("img" === s &&
                          t.attributes.srcset &&
                          t.attributes.rr_dataURL
                            ? i.setAttribute(
                                "rrweb-original-srcset",
                                t.attributes.srcset
                              )
                            : i.setAttribute(l, u.toString())));
                    }
                  } catch (e) {}
                else {
                  for (
                    var f = n.createTextNode(u),
                      m = 0,
                      h = Array.from(i.childNodes);
                    m < h.length;
                    m++
                  ) {
                    var v = h[m];
                    v.nodeType === i.TEXT_NODE && i.removeChild(v);
                  }
                  i.appendChild(f);
                }
              }
          }
        var y = function (e) {
          var r = c[e];
          if ("canvas" === s && "rr_dataURL" === e) {
            var n = document.createElement("img");
            (n.onload = function () {
              var e = i.getContext("2d");
              e && e.drawImage(n, 0, 0, n.width, n.height);
            }),
              (n.src = r.toString()),
              i.RRNodeType && (i.rr_dataURL = r.toString());
          } else if ("img" === s && "rr_dataURL" === e) {
            var a = i;
            a.currentSrc.startsWith("data:") ||
              (a.setAttribute("rrweb-original-src", t.attributes.src),
              (a.src = r.toString()));
          }
          if ("rr_width" === e) i.style.width = r.toString();
          else if ("rr_height" === e) i.style.height = r.toString();
          else if ("rr_mediaCurrentTime" === e && "number" == typeof r)
            i.currentTime = r;
          else if ("rr_mediaState" === e)
            switch (r) {
              case "played":
                i.play().catch(function (e) {
                  return console.warn("media playback error", e);
                });
                break;
              case "paused":
                i.pause();
            }
        };
        for (var g in c) y(g);
        if (t.isShadowHost)
          if (i.shadowRoot)
            for (; i.shadowRoot.firstChild; )
              i.shadowRoot.removeChild(i.shadowRoot.firstChild);
          else i.attachShadow({ mode: "open" });
        return i;
      case e.NodeType.Text:
        return n.createTextNode(
          t.isStyle && a ? q(t.textContent, o) : t.textContent
        );
      case e.NodeType.CDATA:
        return n.createCDATASection(t.textContent);
      case e.NodeType.Comment:
        return n.createComment(t.textContent);
      default:
        return null;
    }
  }
  function Y(t, n) {
    var a = n.doc,
      o = n.mirror,
      i = n.skipChild,
      s = void 0 !== i && i,
      c = n.hackCss,
      l = void 0 === c || c,
      u = n.afterAppend,
      d = n.cache;
    if (o.has(t.id)) {
      var p = o.getNode(t.id);
      if (h(o.getMeta(p), t)) return o.getNode(t.id);
    }
    var f = $(t, { doc: a, hackCss: l, cache: d });
    if (!f) return null;
    if (
      (t.rootId && o.getNode(t.rootId) !== a && o.replace(t.rootId, a),
      t.type === e.NodeType.Document &&
        (a.close(),
        a.open(),
        "BackCompat" === t.compatMode &&
          t.childNodes &&
          t.childNodes[0].type !== e.NodeType.DocumentType &&
          (t.childNodes[0].type === e.NodeType.Element &&
          "xmlns" in t.childNodes[0].attributes &&
          "http://www.w3.org/1999/xhtml" === t.childNodes[0].attributes.xmlns
            ? a.write(
                '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "">'
              )
            : a.write(
                '<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" "">'
              )),
        (f = a)),
      o.add(f, t),
      (t.type === e.NodeType.Document || t.type === e.NodeType.Element) && !s)
    )
      for (
        var m = function (n) {
            var i = Y(n, {
              doc: a,
              mirror: o,
              skipChild: !1,
              hackCss: l,
              afterAppend: u,
              cache: d,
            });
            if (!i) return console.warn("Failed to rebuild", n), "continue";
            if (n.isShadow && r(f) && f.shadowRoot) f.shadowRoot.appendChild(i);
            else if (
              t.type === e.NodeType.Document &&
              n.type == e.NodeType.Element
            ) {
              var s = i,
                c = null;
              s.childNodes.forEach(function (e) {
                "BODY" === e.nodeName && (c = e);
              }),
                c
                  ? (s.removeChild(c), f.appendChild(i), s.appendChild(c))
                  : f.appendChild(i);
            } else f.appendChild(i);
            u && u(i, n.id);
          },
          v = 0,
          y = t.childNodes;
        v < y.length;
        v++
      ) {
        m(y[v]);
      }
    return f;
  }
  return (
    (e.IGNORED_NODE = -2),
    (e.Mirror = u),
    (e.addHoverClass = q),
    (e.buildNodeWithSN = Y),
    (e.classMatchesRegex = A),
    (e.cleanupSnapshot = function () {
      T = 1;
    }),
    (e.createCache = function () {
      return { stylesWithHoverClass: new Map() };
    }),
    (e.createMirror = function () {
      return new u();
    }),
    (e.escapeImportStatement = o),
    (e.genId = k),
    (e.getInputType = v),
    (e.ignoreAttribute = _),
    (e.is2DCanvasBlank = m),
    (e.isCSSImportRule = l),
    (e.isElement = r),
    (e.isNativeShadowDom = a),
    (e.isNodeMetaEqual = h),
    (e.isShadowRoot = n),
    (e.maskInputValue = d),
    (e.needMaskingText = R),
    (e.rebuild = function (t, r) {
      var n = r.doc,
        a = r.onVisit,
        o = r.hackCss,
        i = void 0 === o || o,
        s = r.afterAppend,
        c = r.cache,
        l = r.mirror,
        d = void 0 === l ? new u() : l,
        p = Y(t, {
          doc: n,
          mirror: d,
          skipChild: !1,
          hackCss: i,
          afterAppend: s,
          cache: c,
        });
      return (
        (function (e, t) {
          for (var r = 0, n = e.getIds(); r < n.length; r++) {
            var a = n[r];
            e.has(a) && t(e.getNode(a));
          }
        })(d, function (t) {
          a && a(t),
            (function (t, r) {
              var n = r.getMeta(t);
              if ((null == n ? void 0 : n.type) === e.NodeType.Element) {
                var a = t;
                for (var o in n.attributes)
                  if (
                    Object.prototype.hasOwnProperty.call(n.attributes, o) &&
                    o.startsWith("rr_")
                  ) {
                    var i = n.attributes[o];
                    "rr_scrollLeft" === o && (a.scrollLeft = i),
                      "rr_scrollTop" === o && (a.scrollTop = i);
                  }
              }
            })(t, d);
        }),
        p
      );
    }),
    (e.serializeNodeWithId = W),
    (e.snapshot = function (e, t) {
      var r = t || {},
        n = r.mirror,
        a = void 0 === n ? new u() : n,
        o = r.blockClass,
        i = void 0 === o ? "rr-block" : o,
        s = r.blockSelector,
        c = void 0 === s ? null : s,
        l = r.maskTextClass,
        d = void 0 === l ? "rr-mask" : l,
        p = r.maskTextSelector,
        f = void 0 === p ? null : p,
        m = r.inlineStylesheet,
        h = void 0 === m || m,
        v = r.inlineImages,
        y = void 0 !== v && v,
        g = r.recordCanvas,
        T = void 0 !== g && g,
        b = r.maskAllInputs,
        k = void 0 !== b && b,
        N = r.maskTextFn,
        C = r.maskInputFn,
        S = r.slimDOM,
        w = void 0 !== S && S,
        x = r.dataURLOptions,
        I = r.preserveWhiteSpace,
        E = r.onSerialize,
        L = r.onIframeLoad,
        M = r.iframeLoadTimeout,
        O = r.onStylesheetLoad,
        D = r.stylesheetLoadTimeout,
        _ = r.keepIframeSrcFn;
      return W(e, {
        doc: e,
        mirror: a,
        blockClass: i,
        blockSelector: c,
        maskTextClass: d,
        maskTextSelector: f,
        skipChild: !1,
        inlineStylesheet: h,
        maskInputOptions:
          !0 === k
            ? {
                color: !0,
                date: !0,
                "datetime-local": !0,
                email: !0,
                month: !0,
                number: !0,
                range: !0,
                search: !0,
                tel: !0,
                text: !0,
                time: !0,
                url: !0,
                week: !0,
                textarea: !0,
                select: !0,
                password: !0,
              }
            : !1 === k
              ? { password: !0 }
              : k,
        maskTextFn: N,
        maskInputFn: C,
        slimDOMOptions:
          !0 === w || "all" === w
            ? {
                script: !0,
                comment: !0,
                headFavicon: !0,
                headWhitespace: !0,
                headMetaDescKeywords: "all" === w,
                headMetaSocial: !0,
                headMetaRobots: !0,
                headMetaHttpEquiv: !0,
                headMetaAuthorship: !0,
                headMetaVerification: !0,
              }
            : !1 === w
              ? {}
              : w,
        dataURLOptions: x,
        inlineImages: y,
        recordCanvas: T,
        preserveWhiteSpace: I,
        onSerialize: E,
        onIframeLoad: L,
        iframeLoadTimeout: M,
        onStylesheetLoad: O,
        stylesheetLoadTimeout: D,
        keepIframeSrcFn:
          void 0 === _
            ? function () {
                return !1;
              }
            : _,
        newlyAddedElement: !1,
      });
    }),
    (e.stringifyRule = s),
    (e.stringifyStylesheet = i),
    (e.toLowerCase = p),
    (e.transformAttribute = D),
    (e.validateStringifiedCssRule = c),
    (e.visitSnapshot = function (t, r) {
      !(function t(n) {
        r(n),
          (n.type !== e.NodeType.Document && n.type !== e.NodeType.Element) ||
            n.childNodes.forEach(t);
      })(t);
    }),
    Object.defineProperty(e, "__esModule", { value: !0 }),
    e
  );
})({});
//# sourceMappingURL=rrweb-snapshot.min.js.map
`;