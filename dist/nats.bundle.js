var nats = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __require = /* @__PURE__ */ ((x2) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x2, {
    get: (a2, b2) => (typeof require !== "undefined" ? require : a2)[b2]
  }) : x2)(function(x2) {
    if (typeof require !== "undefined") return require.apply(this, arguments);
    throw Error('Dynamic require of "' + x2 + '" is not supported');
  });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod2) => __copyProps(__defProp({}, "__esModule", { value: true }), mod2);

  // node_modules/nats.ws/esm/nats.js
  var nats_exports = {};
  __export(nats_exports, {
    AckPolicy: () => AckPolicy,
    AdvisoryKind: () => AdvisoryKind,
    Bench: () => Bench,
    ConsumerDebugEvents: () => ConsumerDebugEvents,
    ConsumerEvents: () => ConsumerEvents,
    DebugEvents: () => DebugEvents,
    DeliverPolicy: () => DeliverPolicy,
    DirectMsgHeaders: () => DirectMsgHeaders,
    DiscardPolicy: () => DiscardPolicy,
    Empty: () => Empty,
    ErrorCode: () => ErrorCode,
    Events: () => Events,
    JSONCodec: () => JSONCodec,
    JsHeaders: () => JsHeaders,
    KvWatchInclude: () => KvWatchInclude,
    Match: () => Match,
    Metric: () => Metric,
    MsgHdrsImpl: () => MsgHdrsImpl,
    NatsError: () => NatsError,
    Nuid: () => Nuid,
    ReplayPolicy: () => ReplayPolicy,
    RepublishHeaders: () => RepublishHeaders,
    RequestStrategy: () => RequestStrategy,
    RetentionPolicy: () => RetentionPolicy,
    ServiceError: () => ServiceError,
    ServiceErrorCodeHeader: () => ServiceErrorCodeHeader,
    ServiceErrorHeader: () => ServiceErrorHeader,
    ServiceResponseType: () => ServiceResponseType,
    ServiceVerb: () => ServiceVerb,
    StorageType: () => StorageType,
    StoreCompression: () => StoreCompression,
    StringCodec: () => StringCodec,
    backoff: () => backoff,
    buildAuthenticator: () => buildAuthenticator,
    canonicalMIMEHeaderKey: () => canonicalMIMEHeaderKey,
    checkJsError: () => checkJsError,
    connect: () => connect,
    consumerOpts: () => consumerOpts,
    createInbox: () => createInbox,
    credsAuthenticator: () => credsAuthenticator,
    deadline: () => deadline,
    deferred: () => deferred,
    delay: () => delay,
    headers: () => headers,
    isFlowControlMsg: () => isFlowControlMsg,
    isHeartbeatMsg: () => isHeartbeatMsg,
    jwtAuthenticator: () => jwtAuthenticator,
    millis: () => millis,
    nanos: () => nanos,
    nkeyAuthenticator: () => nkeyAuthenticator,
    nkeys: () => mod,
    nuid: () => nuid,
    syncIterator: () => syncIterator,
    tokenAuthenticator: () => tokenAuthenticator,
    usernamePasswordAuthenticator: () => usernamePasswordAuthenticator
  });
  var Empty = new Uint8Array(0);
  var TE = new TextEncoder();
  var TD = new TextDecoder();
  function concat(...bufs) {
    let max = 0;
    for (let i2 = 0; i2 < bufs.length; i2++) {
      max += bufs[i2].length;
    }
    const out = new Uint8Array(max);
    let index = 0;
    for (let i2 = 0; i2 < bufs.length; i2++) {
      out.set(bufs[i2], index);
      index += bufs[i2].length;
    }
    return out;
  }
  function encode(...a2) {
    const bufs = [];
    for (let i2 = 0; i2 < a2.length; i2++) {
      bufs.push(TE.encode(a2[i2]));
    }
    if (bufs.length === 0) {
      return Empty;
    }
    if (bufs.length === 1) {
      return bufs[0];
    }
    return concat(...bufs);
  }
  function decode(a2) {
    if (!a2 || a2.length === 0) {
      return "";
    }
    return TD.decode(a2);
  }
  var digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var base = 36;
  var maxSeq = 3656158440062976;
  var minInc = 33;
  var maxInc = 333;
  var totalLen = 12 + 10;
  function _getRandomValues(a2) {
    for (let i2 = 0; i2 < a2.length; i2++) {
      a2[i2] = Math.floor(Math.random() * 255);
    }
  }
  function fillRandom(a2) {
    if (globalThis?.crypto?.getRandomValues) {
      globalThis.crypto.getRandomValues(a2);
    } else {
      _getRandomValues(a2);
    }
  }
  var Nuid = class {
    buf;
    seq;
    inc;
    inited;
    constructor() {
      this.buf = new Uint8Array(totalLen);
      this.inited = false;
    }
    init() {
      this.inited = true;
      this.setPre();
      this.initSeqAndInc();
      this.fillSeq();
    }
    initSeqAndInc() {
      this.seq = Math.floor(Math.random() * maxSeq);
      this.inc = Math.floor(Math.random() * (maxInc - minInc) + minInc);
    }
    setPre() {
      const cbuf = new Uint8Array(12);
      fillRandom(cbuf);
      for (let i2 = 0; i2 < 12; i2++) {
        const di = cbuf[i2] % 36;
        this.buf[i2] = digits.charCodeAt(di);
      }
    }
    fillSeq() {
      let n2 = this.seq;
      for (let i2 = totalLen - 1; i2 >= 12; i2--) {
        this.buf[i2] = digits.charCodeAt(n2 % base);
        n2 = Math.floor(n2 / base);
      }
    }
    next() {
      if (!this.inited) {
        this.init();
      }
      this.seq += this.inc;
      if (this.seq > 3656158440062976) {
        this.setPre();
        this.initSeqAndInc();
      }
      this.fillSeq();
      return String.fromCharCode.apply(String, this.buf);
    }
    reset() {
      this.init();
    }
  };
  var nuid = new Nuid();
  var Events;
  (function(Events2) {
    Events2["Disconnect"] = "disconnect";
    Events2["Reconnect"] = "reconnect";
    Events2["Update"] = "update";
    Events2["LDM"] = "ldm";
    Events2["Error"] = "error";
  })(Events || (Events = {}));
  var DebugEvents;
  (function(DebugEvents2) {
    DebugEvents2["Reconnecting"] = "reconnecting";
    DebugEvents2["PingTimer"] = "pingTimer";
    DebugEvents2["StaleConnection"] = "staleConnection";
    DebugEvents2["ClientInitiatedReconnect"] = "client initiated reconnect";
  })(DebugEvents || (DebugEvents = {}));
  var ErrorCode;
  (function(ErrorCode2) {
    ErrorCode2["ApiError"] = "BAD API";
    ErrorCode2["BadAuthentication"] = "BAD_AUTHENTICATION";
    ErrorCode2["BadCreds"] = "BAD_CREDS";
    ErrorCode2["BadHeader"] = "BAD_HEADER";
    ErrorCode2["BadJson"] = "BAD_JSON";
    ErrorCode2["BadPayload"] = "BAD_PAYLOAD";
    ErrorCode2["BadSubject"] = "BAD_SUBJECT";
    ErrorCode2["Cancelled"] = "CANCELLED";
    ErrorCode2["ConnectionClosed"] = "CONNECTION_CLOSED";
    ErrorCode2["ConnectionDraining"] = "CONNECTION_DRAINING";
    ErrorCode2["ConnectionRefused"] = "CONNECTION_REFUSED";
    ErrorCode2["ConnectionTimeout"] = "CONNECTION_TIMEOUT";
    ErrorCode2["Disconnect"] = "DISCONNECT";
    ErrorCode2["InvalidOption"] = "INVALID_OPTION";
    ErrorCode2["InvalidPayload"] = "INVALID_PAYLOAD";
    ErrorCode2["MaxPayloadExceeded"] = "MAX_PAYLOAD_EXCEEDED";
    ErrorCode2["NoResponders"] = "503";
    ErrorCode2["NotFunction"] = "NOT_FUNC";
    ErrorCode2["RequestError"] = "REQUEST_ERROR";
    ErrorCode2["ServerOptionNotAvailable"] = "SERVER_OPT_NA";
    ErrorCode2["SubClosed"] = "SUB_CLOSED";
    ErrorCode2["SubDraining"] = "SUB_DRAINING";
    ErrorCode2["Timeout"] = "TIMEOUT";
    ErrorCode2["Tls"] = "TLS";
    ErrorCode2["Unknown"] = "UNKNOWN_ERROR";
    ErrorCode2["WssRequired"] = "WSS_REQUIRED";
    ErrorCode2["JetStreamInvalidAck"] = "JESTREAM_INVALID_ACK";
    ErrorCode2["JetStream404NoMessages"] = "404";
    ErrorCode2["JetStream408RequestTimeout"] = "408";
    ErrorCode2["JetStream409MaxAckPendingExceeded"] = "409";
    ErrorCode2["JetStream409"] = "409";
    ErrorCode2["JetStreamNotEnabled"] = "503";
    ErrorCode2["JetStreamIdleHeartBeat"] = "IDLE_HEARTBEAT";
    ErrorCode2["AuthorizationViolation"] = "AUTHORIZATION_VIOLATION";
    ErrorCode2["AuthenticationExpired"] = "AUTHENTICATION_EXPIRED";
    ErrorCode2["ProtocolError"] = "NATS_PROTOCOL_ERR";
    ErrorCode2["PermissionsViolation"] = "PERMISSIONS_VIOLATION";
    ErrorCode2["AuthenticationTimeout"] = "AUTHENTICATION_TIMEOUT";
    ErrorCode2["AccountExpired"] = "ACCOUNT_EXPIRED";
  })(ErrorCode || (ErrorCode = {}));
  function isNatsError(err) {
    return typeof err.code === "string";
  }
  var Messages = class {
    messages;
    constructor() {
      this.messages = /* @__PURE__ */ new Map();
      this.messages.set(ErrorCode.InvalidPayload, "Invalid payload type - payloads can be 'binary', 'string', or 'json'");
      this.messages.set(ErrorCode.BadJson, "Bad JSON");
      this.messages.set(ErrorCode.WssRequired, "TLS is required, therefore a secure websocket connection is also required");
    }
    static getMessage(s2) {
      return messages.getMessage(s2);
    }
    getMessage(s2) {
      return this.messages.get(s2) || s2;
    }
  };
  var messages = new Messages();
  var NatsError = class _NatsError extends Error {
    name;
    message;
    code;
    permissionContext;
    chainedError;
    api_error;
    constructor(message, code, chainedError) {
      super(message);
      this.name = "NatsError";
      this.message = message;
      this.code = code;
      this.chainedError = chainedError;
    }
    static errorForCode(code, chainedError) {
      const m2 = Messages.getMessage(code);
      return new _NatsError(m2, code, chainedError);
    }
    isAuthError() {
      return this.code === ErrorCode.AuthenticationExpired || this.code === ErrorCode.AuthorizationViolation || this.code === ErrorCode.AccountExpired;
    }
    isAuthTimeout() {
      return this.code === ErrorCode.AuthenticationTimeout;
    }
    isPermissionError() {
      return this.code === ErrorCode.PermissionsViolation;
    }
    isProtocolError() {
      return this.code === ErrorCode.ProtocolError;
    }
    isJetStreamError() {
      return this.api_error !== void 0;
    }
    jsError() {
      return this.api_error ? this.api_error : null;
    }
  };
  var Match;
  (function(Match2) {
    Match2[Match2["Exact"] = 0] = "Exact";
    Match2[Match2["CanonicalMIME"] = 1] = "CanonicalMIME";
    Match2[Match2["IgnoreCase"] = 2] = "IgnoreCase";
  })(Match || (Match = {}));
  var RequestStrategy;
  (function(RequestStrategy2) {
    RequestStrategy2["Timer"] = "timer";
    RequestStrategy2["Count"] = "count";
    RequestStrategy2["JitterTimer"] = "jitterTimer";
    RequestStrategy2["SentinelMsg"] = "sentinelMsg";
  })(RequestStrategy || (RequestStrategy = {}));
  function syncIterator(src) {
    const iter = src[Symbol.asyncIterator]();
    return {
      async next() {
        const m2 = await iter.next();
        if (m2.done) {
          return Promise.resolve(null);
        }
        return Promise.resolve(m2.value);
      }
    };
  }
  var ServiceResponseType;
  (function(ServiceResponseType2) {
    ServiceResponseType2["STATS"] = "io.nats.micro.v1.stats_response";
    ServiceResponseType2["INFO"] = "io.nats.micro.v1.info_response";
    ServiceResponseType2["PING"] = "io.nats.micro.v1.ping_response";
  })(ServiceResponseType || (ServiceResponseType = {}));
  var ServiceErrorHeader = "Nats-Service-Error";
  var ServiceErrorCodeHeader = "Nats-Service-Error-Code";
  var ServiceError = class _ServiceError extends Error {
    code;
    constructor(code, message) {
      super(message);
      this.code = code;
    }
    static isServiceError(msg) {
      return _ServiceError.toServiceError(msg) !== null;
    }
    static toServiceError(msg) {
      const scode = msg?.headers?.get(ServiceErrorCodeHeader) || "";
      if (scode !== "") {
        const code = parseInt(scode) || 400;
        const description = msg?.headers?.get(ServiceErrorHeader) || "";
        return new _ServiceError(code, description.length ? description : scode);
      }
      return null;
    }
  };
  function createInbox(prefix = "") {
    prefix = prefix || "_INBOX";
    if (typeof prefix !== "string") {
      throw new Error("prefix must be a string");
    }
    prefix.split(".").forEach((v2) => {
      if (v2 === "*" || v2 === ">") {
        throw new Error(`inbox prefixes cannot have wildcards '${prefix}'`);
      }
    });
    return `${prefix}.${nuid.next()}`;
  }
  var DEFAULT_HOST = "127.0.0.1";
  var ServiceVerb;
  (function(ServiceVerb2) {
    ServiceVerb2["PING"] = "PING";
    ServiceVerb2["STATS"] = "STATS";
    ServiceVerb2["INFO"] = "INFO";
  })(ServiceVerb || (ServiceVerb = {}));
  function extend(a2, ...b2) {
    for (let i2 = 0; i2 < b2.length; i2++) {
      const o2 = b2[i2];
      Object.keys(o2).forEach(function(k2) {
        a2[k2] = o2[k2];
      });
    }
    return a2;
  }
  function render(frame) {
    const cr = "\u240D";
    const lf = "\u240A";
    return TD.decode(frame).replace(/\n/g, lf).replace(/\r/g, cr);
  }
  function timeout(ms, asyncTraces = true) {
    const err = asyncTraces ? NatsError.errorForCode(ErrorCode.Timeout) : null;
    let methods;
    let timer;
    const p2 = new Promise((_resolve, reject) => {
      const cancel = () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
      methods = {
        cancel
      };
      timer = setTimeout(() => {
        if (err === null) {
          reject(NatsError.errorForCode(ErrorCode.Timeout));
        } else {
          reject(err);
        }
      }, ms);
    });
    return Object.assign(p2, methods);
  }
  function delay(ms = 0) {
    let methods;
    const p2 = new Promise((resolve) => {
      const timer = setTimeout(() => {
        resolve();
      }, ms);
      const cancel = () => {
        if (timer) {
          clearTimeout(timer);
        }
      };
      methods = {
        cancel
      };
    });
    return Object.assign(p2, methods);
  }
  function deadline(p2, millis2 = 1e3) {
    const err = new Error(`deadline exceeded`);
    const d2 = deferred();
    const timer = setTimeout(() => d2.reject(err), millis2);
    return Promise.race([
      p2,
      d2
    ]).finally(() => clearTimeout(timer));
  }
  function deferred() {
    let methods = {};
    const p2 = new Promise((resolve, reject) => {
      methods = {
        resolve,
        reject
      };
    });
    return Object.assign(p2, methods);
  }
  function shuffle(a2) {
    for (let i2 = a2.length - 1; i2 > 0; i2--) {
      const j2 = Math.floor(Math.random() * (i2 + 1));
      [a2[i2], a2[j2]] = [
        a2[j2],
        a2[i2]
      ];
    }
    return a2;
  }
  var Perf = class {
    timers;
    measures;
    constructor() {
      this.timers = /* @__PURE__ */ new Map();
      this.measures = /* @__PURE__ */ new Map();
    }
    mark(key) {
      this.timers.set(key, performance.now());
    }
    measure(key, startKey, endKey) {
      const s2 = this.timers.get(startKey);
      if (s2 === void 0) {
        throw new Error(`${startKey} is not defined`);
      }
      const e2 = this.timers.get(endKey);
      if (e2 === void 0) {
        throw new Error(`${endKey} is not defined`);
      }
      this.measures.set(key, e2 - s2);
    }
    getEntries() {
      const values = [];
      this.measures.forEach((v2, k2) => {
        values.push({
          name: k2,
          duration: v2
        });
      });
      return values;
    }
  };
  function jitter(n2) {
    if (n2 === 0) {
      return 0;
    }
    return Math.floor(n2 / 2 + Math.random() * n2);
  }
  function backoff(policy = [
    0,
    250,
    250,
    500,
    500,
    3e3,
    5e3
  ]) {
    if (!Array.isArray(policy)) {
      policy = [
        0,
        250,
        250,
        500,
        500,
        3e3,
        5e3
      ];
    }
    const max = policy.length - 1;
    return {
      backoff(attempt) {
        return jitter(attempt > max ? policy[max] : policy[attempt]);
      }
    };
  }
  function nanos(millis2) {
    return millis2 * 1e6;
  }
  function millis(ns) {
    return Math.floor(ns / 1e6);
  }
  function canonicalMIMEHeaderKey(k2) {
    const dash = 45;
    const toLower = 97 - 65;
    let upper = true;
    const buf = new Array(k2.length);
    for (let i2 = 0; i2 < k2.length; i2++) {
      let c2 = k2.charCodeAt(i2);
      if (c2 === 58 || c2 < 33 || c2 > 126) {
        throw new NatsError(`'${k2[i2]}' is not a valid character for a header key`, ErrorCode.BadHeader);
      }
      if (upper && 97 <= c2 && c2 <= 122) {
        c2 -= toLower;
      } else if (!upper && 65 <= c2 && c2 <= 90) {
        c2 += toLower;
      }
      buf[i2] = c2;
      upper = c2 == dash;
    }
    return String.fromCharCode(...buf);
  }
  function headers(code = 0, description = "") {
    if (code === 0 && description !== "" || code > 0 && description === "") {
      throw new Error("setting status requires both code and description");
    }
    return new MsgHdrsImpl(code, description);
  }
  var HEADER = "NATS/1.0";
  var MsgHdrsImpl = class _MsgHdrsImpl {
    _code;
    headers;
    _description;
    constructor(code = 0, description = "") {
      this._code = code;
      this._description = description;
      this.headers = /* @__PURE__ */ new Map();
    }
    [Symbol.iterator]() {
      return this.headers.entries();
    }
    size() {
      return this.headers.size;
    }
    equals(mh) {
      if (mh && this.headers.size === mh.headers.size && this._code === mh._code) {
        for (const [k2, v2] of this.headers) {
          const a2 = mh.values(k2);
          if (v2.length !== a2.length) {
            return false;
          }
          const vv = [
            ...v2
          ].sort();
          const aa = [
            ...a2
          ].sort();
          for (let i2 = 0; i2 < vv.length; i2++) {
            if (vv[i2] !== aa[i2]) {
              return false;
            }
          }
        }
        return true;
      }
      return false;
    }
    static decode(a2) {
      const mh = new _MsgHdrsImpl();
      const s2 = TD.decode(a2);
      const lines = s2.split("\r\n");
      const h2 = lines[0];
      if (h2 !== HEADER) {
        let str = h2.replace(HEADER, "").trim();
        if (str.length > 0) {
          mh._code = parseInt(str, 10);
          if (isNaN(mh._code)) {
            mh._code = 0;
          }
          const scode = mh._code.toString();
          str = str.replace(scode, "");
          mh._description = str.trim();
        }
      }
      if (lines.length >= 1) {
        lines.slice(1).map((s3) => {
          if (s3) {
            const idx = s3.indexOf(":");
            if (idx > -1) {
              const k2 = s3.slice(0, idx);
              const v2 = s3.slice(idx + 1).trim();
              mh.append(k2, v2);
            }
          }
        });
      }
      return mh;
    }
    toString() {
      if (this.headers.size === 0 && this._code === 0) {
        return "";
      }
      let s2 = HEADER;
      if (this._code > 0 && this._description !== "") {
        s2 += ` ${this._code} ${this._description}`;
      }
      for (const [k2, v2] of this.headers) {
        for (let i2 = 0; i2 < v2.length; i2++) {
          s2 = `${s2}\r
${k2}: ${v2[i2]}`;
        }
      }
      return `${s2}\r
\r
`;
    }
    encode() {
      return TE.encode(this.toString());
    }
    static validHeaderValue(k2) {
      const inv = /[\r\n]/;
      if (inv.test(k2)) {
        throw new NatsError("invalid header value - \\r and \\n are not allowed.", ErrorCode.BadHeader);
      }
      return k2.trim();
    }
    keys() {
      const keys = [];
      for (const sk of this.headers.keys()) {
        keys.push(sk);
      }
      return keys;
    }
    findKeys(k2, match = Match.Exact) {
      const keys = this.keys();
      switch (match) {
        case Match.Exact:
          return keys.filter((v2) => {
            return v2 === k2;
          });
        case Match.CanonicalMIME:
          k2 = canonicalMIMEHeaderKey(k2);
          return keys.filter((v2) => {
            return v2 === k2;
          });
        default: {
          const lci = k2.toLowerCase();
          return keys.filter((v2) => {
            return lci === v2.toLowerCase();
          });
        }
      }
    }
    get(k2, match = Match.Exact) {
      const keys = this.findKeys(k2, match);
      if (keys.length) {
        const v2 = this.headers.get(keys[0]);
        if (v2) {
          return Array.isArray(v2) ? v2[0] : v2;
        }
      }
      return "";
    }
    last(k2, match = Match.Exact) {
      const keys = this.findKeys(k2, match);
      if (keys.length) {
        const v2 = this.headers.get(keys[0]);
        if (v2) {
          return Array.isArray(v2) ? v2[v2.length - 1] : v2;
        }
      }
      return "";
    }
    has(k2, match = Match.Exact) {
      return this.findKeys(k2, match).length > 0;
    }
    set(k2, v2, match = Match.Exact) {
      this.delete(k2, match);
      this.append(k2, v2, match);
    }
    append(k2, v2, match = Match.Exact) {
      const ck = canonicalMIMEHeaderKey(k2);
      if (match === Match.CanonicalMIME) {
        k2 = ck;
      }
      const keys = this.findKeys(k2, match);
      k2 = keys.length > 0 ? keys[0] : k2;
      const value = _MsgHdrsImpl.validHeaderValue(v2);
      let a2 = this.headers.get(k2);
      if (!a2) {
        a2 = [];
        this.headers.set(k2, a2);
      }
      a2.push(value);
    }
    values(k2, match = Match.Exact) {
      const buf = [];
      const keys = this.findKeys(k2, match);
      keys.forEach((v2) => {
        const values = this.headers.get(v2);
        if (values) {
          buf.push(...values);
        }
      });
      return buf;
    }
    delete(k2, match = Match.Exact) {
      const keys = this.findKeys(k2, match);
      keys.forEach((v2) => {
        this.headers.delete(v2);
      });
    }
    get hasError() {
      return this._code >= 300;
    }
    get status() {
      return `${this._code} ${this._description}`.trim();
    }
    toRecord() {
      const data = {};
      this.keys().forEach((v2) => {
        data[v2] = this.values(v2);
      });
      return data;
    }
    get code() {
      return this._code;
    }
    get description() {
      return this._description;
    }
    static fromRecord(r2) {
      const h2 = new _MsgHdrsImpl();
      for (const k2 in r2) {
        h2.headers.set(k2, r2[k2]);
      }
      return h2;
    }
  };
  function StringCodec() {
    return {
      encode(d2) {
        return TE.encode(d2);
      },
      decode(a2) {
        return TD.decode(a2);
      }
    };
  }
  function JSONCodec(reviver) {
    return {
      encode(d2) {
        try {
          if (d2 === void 0) {
            d2 = null;
          }
          return TE.encode(JSON.stringify(d2));
        } catch (err) {
          throw NatsError.errorForCode(ErrorCode.BadJson, err);
        }
      },
      decode(a2) {
        try {
          return JSON.parse(TD.decode(a2), reviver);
        } catch (err) {
          throw NatsError.errorForCode(ErrorCode.BadJson, err);
        }
      }
    };
  }
  function isRequestError(msg) {
    if (msg && msg.data.length === 0 && msg.headers?.code === 503) {
      return NatsError.errorForCode(ErrorCode.NoResponders);
    }
    return null;
  }
  var MsgImpl = class {
    _headers;
    _msg;
    _rdata;
    _reply;
    _subject;
    publisher;
    static jc;
    constructor(msg, data, publisher) {
      this._msg = msg;
      this._rdata = data;
      this.publisher = publisher;
    }
    get subject() {
      if (this._subject) {
        return this._subject;
      }
      this._subject = TD.decode(this._msg.subject);
      return this._subject;
    }
    get reply() {
      if (this._reply) {
        return this._reply;
      }
      this._reply = TD.decode(this._msg.reply);
      return this._reply;
    }
    get sid() {
      return this._msg.sid;
    }
    get headers() {
      if (this._msg.hdr > -1 && !this._headers) {
        const buf = this._rdata.subarray(0, this._msg.hdr);
        this._headers = MsgHdrsImpl.decode(buf);
      }
      return this._headers;
    }
    get data() {
      if (!this._rdata) {
        return new Uint8Array(0);
      }
      return this._msg.hdr > -1 ? this._rdata.subarray(this._msg.hdr) : this._rdata;
    }
    respond(data = Empty, opts) {
      if (this.reply) {
        this.publisher.publish(this.reply, data, opts);
        return true;
      }
      return false;
    }
    size() {
      const subj = this._msg.subject.length;
      const reply = this._msg.reply?.length || 0;
      const payloadAndHeaders = this._msg.size === -1 ? 0 : this._msg.size;
      return subj + reply + payloadAndHeaders;
    }
    json(reviver) {
      return JSONCodec(reviver).decode(this.data);
    }
    string() {
      return TD.decode(this.data);
    }
    requestInfo() {
      const v2 = this.headers?.get("Nats-Request-Info");
      if (v2) {
        return JSON.parse(v2, function(key, value) {
          if ((key === "start" || key === "stop") && value !== "") {
            return new Date(Date.parse(value));
          }
          return value;
        });
      }
      return null;
    }
  };
  function validateDurableName(name) {
    return minValidation("durable", name);
  }
  function validateStreamName(name) {
    return minValidation("stream", name);
  }
  function minValidation(context, name = "") {
    if (name === "") {
      throw Error(`${context} name required`);
    }
    const bad = [
      ".",
      "*",
      ">",
      "/",
      "\\",
      " ",
      "	",
      "\n",
      "\r"
    ];
    bad.forEach((v2) => {
      if (name.indexOf(v2) !== -1) {
        switch (v2) {
          case "\n":
            v2 = "\\n";
            break;
          case "\r":
            v2 = "\\r";
            break;
          case "	":
            v2 = "\\t";
            break;
          default:
        }
        throw Error(`invalid ${context} name - ${context} name cannot contain '${v2}'`);
      }
    });
    return "";
  }
  function validateName(context, name = "") {
    if (name === "") {
      throw Error(`${context} name required`);
    }
    const m2 = validName(name);
    if (m2.length) {
      throw new Error(`invalid ${context} name - ${context} name ${m2}`);
    }
  }
  function validName(name = "") {
    if (name === "") {
      throw Error(`name required`);
    }
    const RE = /^[-\w]+$/g;
    const m2 = name.match(RE);
    if (m2 === null) {
      for (const c2 of name.split("")) {
        const mm = c2.match(RE);
        if (mm === null) {
          return `cannot contain '${c2}'`;
        }
      }
    }
    return "";
  }
  function isFlowControlMsg(msg) {
    if (msg.data.length > 0) {
      return false;
    }
    const h2 = msg.headers;
    if (!h2) {
      return false;
    }
    return h2.code >= 100 && h2.code < 200;
  }
  function isHeartbeatMsg(msg) {
    return isFlowControlMsg(msg) && msg.headers?.description === "Idle Heartbeat";
  }
  function newJsErrorMsg(code, description, subject) {
    const h2 = headers(code, description);
    const arg = {
      hdr: 1,
      sid: 0,
      size: 0
    };
    const msg = new MsgImpl(arg, Empty, {});
    msg._headers = h2;
    msg._subject = subject;
    return msg;
  }
  function checkJsError(msg) {
    if (msg.data.length !== 0) {
      return null;
    }
    const h2 = msg.headers;
    if (!h2) {
      return null;
    }
    return checkJsErrorCode(h2.code, h2.description);
  }
  var Js409Errors;
  (function(Js409Errors2) {
    Js409Errors2["MaxBatchExceeded"] = "exceeded maxrequestbatch of";
    Js409Errors2["MaxExpiresExceeded"] = "exceeded maxrequestexpires of";
    Js409Errors2["MaxBytesExceeded"] = "exceeded maxrequestmaxbytes of";
    Js409Errors2["MaxMessageSizeExceeded"] = "message size exceeds maxbytes";
    Js409Errors2["PushConsumer"] = "consumer is push based";
    Js409Errors2["MaxWaitingExceeded"] = "exceeded maxwaiting";
    Js409Errors2["IdleHeartbeatMissed"] = "idle heartbeats missed";
    Js409Errors2["ConsumerDeleted"] = "consumer deleted";
  })(Js409Errors || (Js409Errors = {}));
  var MAX_WAITING_FAIL = false;
  function isTerminal409(err) {
    if (err.code !== ErrorCode.JetStream409) {
      return false;
    }
    const fatal = [
      Js409Errors.MaxBatchExceeded,
      Js409Errors.MaxExpiresExceeded,
      Js409Errors.MaxBytesExceeded,
      Js409Errors.MaxMessageSizeExceeded,
      Js409Errors.PushConsumer,
      Js409Errors.IdleHeartbeatMissed,
      Js409Errors.ConsumerDeleted
    ];
    if (MAX_WAITING_FAIL) {
      fatal.push(Js409Errors.MaxWaitingExceeded);
    }
    return fatal.find((s2) => {
      return err.message.indexOf(s2) !== -1;
    }) !== void 0;
  }
  function checkJsErrorCode(code, description = "") {
    if (code < 300) {
      return null;
    }
    description = description.toLowerCase();
    switch (code) {
      case 404:
        return new NatsError(description, ErrorCode.JetStream404NoMessages);
      case 408:
        return new NatsError(description, ErrorCode.JetStream408RequestTimeout);
      case 409: {
        const ec = description.startsWith(Js409Errors.IdleHeartbeatMissed) ? ErrorCode.JetStreamIdleHeartBeat : ErrorCode.JetStream409;
        return new NatsError(description, ec);
      }
      case 503:
        return NatsError.errorForCode(ErrorCode.JetStreamNotEnabled, new Error(description));
      default:
        if (description === "") {
          description = ErrorCode.Unknown;
        }
        return new NatsError(description, `${code}`);
    }
  }
  var QueuedIteratorImpl = class {
    inflight;
    processed;
    received;
    noIterator;
    iterClosed;
    done;
    signal;
    yields;
    filtered;
    pendingFiltered;
    ingestionFilterFn;
    protocolFilterFn;
    dispatchedFn;
    ctx;
    _data;
    err;
    time;
    yielding;
    constructor() {
      this.inflight = 0;
      this.filtered = 0;
      this.pendingFiltered = 0;
      this.processed = 0;
      this.received = 0;
      this.noIterator = false;
      this.done = false;
      this.signal = deferred();
      this.yields = [];
      this.iterClosed = deferred();
      this.time = 0;
      this.yielding = false;
    }
    [Symbol.asyncIterator]() {
      return this.iterate();
    }
    push(v2) {
      if (this.done) {
        return;
      }
      if (typeof v2 === "function") {
        this.yields.push(v2);
        this.signal.resolve();
        return;
      }
      const { ingest, protocol } = this.ingestionFilterFn ? this.ingestionFilterFn(v2, this.ctx || this) : {
        ingest: true,
        protocol: false
      };
      if (ingest) {
        if (protocol) {
          this.filtered++;
          this.pendingFiltered++;
        }
        this.yields.push(v2);
        this.signal.resolve();
      }
    }
    async *iterate() {
      if (this.noIterator) {
        throw new NatsError("unsupported iterator", ErrorCode.ApiError);
      }
      if (this.yielding) {
        throw new NatsError("already yielding", ErrorCode.ApiError);
      }
      this.yielding = true;
      try {
        while (true) {
          if (this.yields.length === 0) {
            await this.signal;
          }
          if (this.err) {
            throw this.err;
          }
          const yields = this.yields;
          this.inflight = yields.length;
          this.yields = [];
          for (let i2 = 0; i2 < yields.length; i2++) {
            if (typeof yields[i2] === "function") {
              const fn = yields[i2];
              try {
                fn();
              } catch (err) {
                throw err;
              }
              if (this.err) {
                throw this.err;
              }
              continue;
            }
            const ok = this.protocolFilterFn ? this.protocolFilterFn(yields[i2]) : true;
            if (ok) {
              this.processed++;
              const start = Date.now();
              yield yields[i2];
              this.time = Date.now() - start;
              if (this.dispatchedFn && yields[i2]) {
                this.dispatchedFn(yields[i2]);
              }
            } else {
              this.pendingFiltered--;
            }
            this.inflight--;
          }
          if (this.done) {
            break;
          } else if (this.yields.length === 0) {
            yields.length = 0;
            this.yields = yields;
            this.signal = deferred();
          }
        }
      } finally {
        this.stop();
      }
    }
    stop(err) {
      if (this.done) {
        return;
      }
      this.err = err;
      this.done = true;
      this.signal.resolve();
      this.iterClosed.resolve(err);
    }
    getProcessed() {
      return this.noIterator ? this.received : this.processed;
    }
    getPending() {
      return this.yields.length + this.inflight - this.pendingFiltered;
    }
    getReceived() {
      return this.received - this.filtered;
    }
  };
  var IdleHeartbeatMonitor = class {
    interval;
    maxOut;
    cancelAfter;
    timer;
    autoCancelTimer;
    last;
    missed;
    count;
    callback;
    constructor(interval, cb, opts = {
      maxOut: 2
    }) {
      this.interval = interval;
      this.maxOut = opts?.maxOut || 2;
      this.cancelAfter = opts?.cancelAfter || 0;
      this.last = Date.now();
      this.missed = 0;
      this.count = 0;
      this.callback = cb;
      this._schedule();
    }
    cancel() {
      if (this.autoCancelTimer) {
        clearTimeout(this.autoCancelTimer);
      }
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = 0;
      this.autoCancelTimer = 0;
      this.missed = 0;
    }
    work() {
      this.last = Date.now();
      this.missed = 0;
    }
    _change(interval, cancelAfter = 0, maxOut = 2) {
      this.interval = interval;
      this.maxOut = maxOut;
      this.cancelAfter = cancelAfter;
      this.restart();
    }
    restart() {
      this.cancel();
      this._schedule();
    }
    _schedule() {
      if (this.cancelAfter > 0) {
        this.autoCancelTimer = setTimeout(() => {
          this.cancel();
        }, this.cancelAfter);
      }
      this.timer = setInterval(() => {
        this.count++;
        if (Date.now() - this.last > this.interval) {
          this.missed++;
        }
        if (this.missed >= this.maxOut) {
          try {
            if (this.callback(this.missed) === true) {
              this.cancel();
            }
          } catch (err) {
            console.log(err);
          }
        }
      }, this.interval);
    }
  };
  var RetentionPolicy;
  (function(RetentionPolicy2) {
    RetentionPolicy2["Limits"] = "limits";
    RetentionPolicy2["Interest"] = "interest";
    RetentionPolicy2["Workqueue"] = "workqueue";
  })(RetentionPolicy || (RetentionPolicy = {}));
  var DiscardPolicy;
  (function(DiscardPolicy2) {
    DiscardPolicy2["Old"] = "old";
    DiscardPolicy2["New"] = "new";
  })(DiscardPolicy || (DiscardPolicy = {}));
  var StorageType;
  (function(StorageType2) {
    StorageType2["File"] = "file";
    StorageType2["Memory"] = "memory";
  })(StorageType || (StorageType = {}));
  var DeliverPolicy;
  (function(DeliverPolicy2) {
    DeliverPolicy2["All"] = "all";
    DeliverPolicy2["Last"] = "last";
    DeliverPolicy2["New"] = "new";
    DeliverPolicy2["StartSequence"] = "by_start_sequence";
    DeliverPolicy2["StartTime"] = "by_start_time";
    DeliverPolicy2["LastPerSubject"] = "last_per_subject";
  })(DeliverPolicy || (DeliverPolicy = {}));
  var AckPolicy;
  (function(AckPolicy2) {
    AckPolicy2["None"] = "none";
    AckPolicy2["All"] = "all";
    AckPolicy2["Explicit"] = "explicit";
    AckPolicy2["NotSet"] = "";
  })(AckPolicy || (AckPolicy = {}));
  var ReplayPolicy;
  (function(ReplayPolicy2) {
    ReplayPolicy2["Instant"] = "instant";
    ReplayPolicy2["Original"] = "original";
  })(ReplayPolicy || (ReplayPolicy = {}));
  var StoreCompression;
  (function(StoreCompression2) {
    StoreCompression2["None"] = "none";
    StoreCompression2["S2"] = "s2";
  })(StoreCompression || (StoreCompression = {}));
  var ConsumerApiAction;
  (function(ConsumerApiAction2) {
    ConsumerApiAction2["CreateOrUpdate"] = "";
    ConsumerApiAction2["Update"] = "update";
    ConsumerApiAction2["Create"] = "create";
  })(ConsumerApiAction || (ConsumerApiAction = {}));
  function defaultConsumer(name, opts = {}) {
    return Object.assign({
      name,
      deliver_policy: DeliverPolicy.All,
      ack_policy: AckPolicy.Explicit,
      ack_wait: nanos(30 * 1e3),
      replay_policy: ReplayPolicy.Instant
    }, opts);
  }
  var AdvisoryKind;
  (function(AdvisoryKind2) {
    AdvisoryKind2["API"] = "api_audit";
    AdvisoryKind2["StreamAction"] = "stream_action";
    AdvisoryKind2["ConsumerAction"] = "consumer_action";
    AdvisoryKind2["SnapshotCreate"] = "snapshot_create";
    AdvisoryKind2["SnapshotComplete"] = "snapshot_complete";
    AdvisoryKind2["RestoreCreate"] = "restore_create";
    AdvisoryKind2["RestoreComplete"] = "restore_complete";
    AdvisoryKind2["MaxDeliver"] = "max_deliver";
    AdvisoryKind2["Terminated"] = "terminated";
    AdvisoryKind2["Ack"] = "consumer_ack";
    AdvisoryKind2["StreamLeaderElected"] = "stream_leader_elected";
    AdvisoryKind2["StreamQuorumLost"] = "stream_quorum_lost";
    AdvisoryKind2["ConsumerLeaderElected"] = "consumer_leader_elected";
    AdvisoryKind2["ConsumerQuorumLost"] = "consumer_quorum_lost";
  })(AdvisoryKind || (AdvisoryKind = {}));
  var JsHeaders;
  (function(JsHeaders2) {
    JsHeaders2["StreamSourceHdr"] = "Nats-Stream-Source";
    JsHeaders2["LastConsumerSeqHdr"] = "Nats-Last-Consumer";
    JsHeaders2["LastStreamSeqHdr"] = "Nats-Last-Stream";
    JsHeaders2["ConsumerStalledHdr"] = "Nats-Consumer-Stalled";
    JsHeaders2["MessageSizeHdr"] = "Nats-Msg-Size";
    JsHeaders2["RollupHdr"] = "Nats-Rollup";
    JsHeaders2["RollupValueSubject"] = "sub";
    JsHeaders2["RollupValueAll"] = "all";
    JsHeaders2["PendingMessagesHdr"] = "Nats-Pending-Messages";
    JsHeaders2["PendingBytesHdr"] = "Nats-Pending-Bytes";
  })(JsHeaders || (JsHeaders = {}));
  var KvWatchInclude;
  (function(KvWatchInclude2) {
    KvWatchInclude2["LastValue"] = "";
    KvWatchInclude2["AllHistory"] = "history";
    KvWatchInclude2["UpdatesOnly"] = "updates";
  })(KvWatchInclude || (KvWatchInclude = {}));
  var DirectMsgHeaders;
  (function(DirectMsgHeaders2) {
    DirectMsgHeaders2["Stream"] = "Nats-Stream";
    DirectMsgHeaders2["Sequence"] = "Nats-Sequence";
    DirectMsgHeaders2["TimeStamp"] = "Nats-Time-Stamp";
    DirectMsgHeaders2["Subject"] = "Nats-Subject";
  })(DirectMsgHeaders || (DirectMsgHeaders = {}));
  var RepublishHeaders;
  (function(RepublishHeaders2) {
    RepublishHeaders2["Stream"] = "Nats-Stream";
    RepublishHeaders2["Subject"] = "Nats-Subject";
    RepublishHeaders2["Sequence"] = "Nats-Sequence";
    RepublishHeaders2["LastSequence"] = "Nats-Last-Sequence";
    RepublishHeaders2["Size"] = "Nats-Msg-Size";
  })(RepublishHeaders || (RepublishHeaders = {}));
  var kvPrefix = "KV_";
  var ConsumerOptsBuilderImpl = class {
    config;
    ordered;
    mack;
    stream;
    callbackFn;
    max;
    qname;
    isBind;
    filters;
    constructor(opts) {
      this.stream = "";
      this.mack = false;
      this.ordered = false;
      this.config = defaultConsumer("", opts || {});
    }
    getOpts() {
      const o2 = {};
      o2.config = Object.assign({}, this.config);
      if (o2.config.filter_subject) {
        this.filterSubject(o2.config.filter_subject);
        o2.config.filter_subject = void 0;
      }
      if (o2.config.filter_subjects) {
        o2.config.filter_subjects?.forEach((v2) => {
          this.filterSubject(v2);
        });
        o2.config.filter_subjects = void 0;
      }
      o2.mack = this.mack;
      o2.stream = this.stream;
      o2.callbackFn = this.callbackFn;
      o2.max = this.max;
      o2.queue = this.qname;
      o2.ordered = this.ordered;
      o2.config.ack_policy = o2.ordered ? AckPolicy.None : o2.config.ack_policy;
      o2.isBind = o2.isBind || false;
      if (this.filters) {
        switch (this.filters.length) {
          case 0:
            break;
          case 1:
            o2.config.filter_subject = this.filters[0];
            break;
          default:
            o2.config.filter_subjects = this.filters;
        }
      }
      return o2;
    }
    description(description) {
      this.config.description = description;
      return this;
    }
    deliverTo(subject) {
      this.config.deliver_subject = subject;
      return this;
    }
    durable(name) {
      validateDurableName(name);
      this.config.durable_name = name;
      return this;
    }
    startSequence(seq) {
      if (seq <= 0) {
        throw new Error("sequence must be greater than 0");
      }
      this.config.deliver_policy = DeliverPolicy.StartSequence;
      this.config.opt_start_seq = seq;
      return this;
    }
    startTime(time) {
      this.config.deliver_policy = DeliverPolicy.StartTime;
      this.config.opt_start_time = time.toISOString();
      return this;
    }
    deliverAll() {
      this.config.deliver_policy = DeliverPolicy.All;
      return this;
    }
    deliverLastPerSubject() {
      this.config.deliver_policy = DeliverPolicy.LastPerSubject;
      return this;
    }
    deliverLast() {
      this.config.deliver_policy = DeliverPolicy.Last;
      return this;
    }
    deliverNew() {
      this.config.deliver_policy = DeliverPolicy.New;
      return this;
    }
    startAtTimeDelta(millis2) {
      this.startTime(new Date(Date.now() - millis2));
      return this;
    }
    headersOnly() {
      this.config.headers_only = true;
      return this;
    }
    ackNone() {
      this.config.ack_policy = AckPolicy.None;
      return this;
    }
    ackAll() {
      this.config.ack_policy = AckPolicy.All;
      return this;
    }
    ackExplicit() {
      this.config.ack_policy = AckPolicy.Explicit;
      return this;
    }
    ackWait(millis2) {
      this.config.ack_wait = nanos(millis2);
      return this;
    }
    maxDeliver(max) {
      this.config.max_deliver = max;
      return this;
    }
    filterSubject(s2) {
      this.filters = this.filters || [];
      this.filters.push(s2);
      return this;
    }
    replayInstantly() {
      this.config.replay_policy = ReplayPolicy.Instant;
      return this;
    }
    replayOriginal() {
      this.config.replay_policy = ReplayPolicy.Original;
      return this;
    }
    sample(n2) {
      n2 = Math.trunc(n2);
      if (n2 < 0 || n2 > 100) {
        throw new Error(`value must be between 0-100`);
      }
      this.config.sample_freq = `${n2}%`;
      return this;
    }
    limit(n2) {
      this.config.rate_limit_bps = n2;
      return this;
    }
    maxWaiting(max) {
      this.config.max_waiting = max;
      return this;
    }
    maxAckPending(max) {
      this.config.max_ack_pending = max;
      return this;
    }
    idleHeartbeat(millis2) {
      this.config.idle_heartbeat = nanos(millis2);
      return this;
    }
    flowControl() {
      this.config.flow_control = true;
      return this;
    }
    deliverGroup(name) {
      this.queue(name);
      return this;
    }
    manualAck() {
      this.mack = true;
      return this;
    }
    maxMessages(max) {
      this.max = max;
      return this;
    }
    callback(fn) {
      this.callbackFn = fn;
      return this;
    }
    queue(n2) {
      this.qname = n2;
      this.config.deliver_group = n2;
      return this;
    }
    orderedConsumer() {
      this.ordered = true;
      return this;
    }
    bind(stream, durable) {
      this.stream = stream;
      this.config.durable_name = durable;
      this.isBind = true;
      return this;
    }
    bindStream(stream) {
      this.stream = stream;
      return this;
    }
    inactiveEphemeralThreshold(millis2) {
      this.config.inactive_threshold = nanos(millis2);
      return this;
    }
    maxPullBatch(n2) {
      this.config.max_batch = n2;
      return this;
    }
    maxPullRequestExpires(millis2) {
      this.config.max_expires = nanos(millis2);
      return this;
    }
    memory() {
      this.config.mem_storage = true;
      return this;
    }
    numReplicas(n2) {
      this.config.num_replicas = n2;
      return this;
    }
    consumerName(n2) {
      this.config.name = n2;
      return this;
    }
  };
  function consumerOpts(opts) {
    return new ConsumerOptsBuilderImpl(opts);
  }
  function isConsumerOptsBuilder(o2) {
    return typeof o2.getOpts === "function";
  }
  var Base64Codec = class {
    static encode(bytes) {
      if (typeof bytes === "string") {
        return btoa(bytes);
      }
      const a2 = Array.from(bytes);
      return btoa(String.fromCharCode(...a2));
    }
    static decode(s2, binary = false) {
      const bin = atob(s2);
      if (!binary) {
        return bin;
      }
      return Uint8Array.from(bin, (c2) => c2.charCodeAt(0));
    }
  };
  var Base64UrlPaddedCodec = class _Base64UrlPaddedCodec {
    static encode(bytes) {
      return _Base64UrlPaddedCodec.toB64URLEncoding(Base64Codec.encode(bytes));
    }
    static decode(s2, binary = false) {
      return _Base64UrlPaddedCodec.decode(_Base64UrlPaddedCodec.fromB64URLEncoding(s2), binary);
    }
    static toB64URLEncoding(b64str) {
      return b64str.replace(/\+/g, "-").replace(/\//g, "_");
    }
    static fromB64URLEncoding(b64str) {
      return b64str.replace(/_/g, "/").replace(/-/g, "+");
    }
  };
  var DataBuffer = class {
    buffers;
    byteLength;
    constructor() {
      this.buffers = [];
      this.byteLength = 0;
    }
    static concat(...bufs) {
      let max = 0;
      for (let i2 = 0; i2 < bufs.length; i2++) {
        max += bufs[i2].length;
      }
      const out = new Uint8Array(max);
      let index = 0;
      for (let i2 = 0; i2 < bufs.length; i2++) {
        out.set(bufs[i2], index);
        index += bufs[i2].length;
      }
      return out;
    }
    static fromAscii(m2) {
      if (!m2) {
        m2 = "";
      }
      return TE.encode(m2);
    }
    static toAscii(a2) {
      return TD.decode(a2);
    }
    reset() {
      this.buffers.length = 0;
      this.byteLength = 0;
    }
    pack() {
      if (this.buffers.length > 1) {
        const v2 = new Uint8Array(this.byteLength);
        let index = 0;
        for (let i2 = 0; i2 < this.buffers.length; i2++) {
          v2.set(this.buffers[i2], index);
          index += this.buffers[i2].length;
        }
        this.buffers.length = 0;
        this.buffers.push(v2);
      }
    }
    shift() {
      if (this.buffers.length) {
        const a2 = this.buffers.shift();
        if (a2) {
          this.byteLength -= a2.length;
          return a2;
        }
      }
      return new Uint8Array(0);
    }
    drain(n2) {
      if (this.buffers.length) {
        this.pack();
        const v2 = this.buffers.pop();
        if (v2) {
          const max = this.byteLength;
          if (n2 === void 0 || n2 > max) {
            n2 = max;
          }
          const d2 = v2.subarray(0, n2);
          if (max > n2) {
            this.buffers.push(v2.subarray(n2));
          }
          this.byteLength = max - n2;
          return d2;
        }
      }
      return new Uint8Array(0);
    }
    fill(a2, ...bufs) {
      if (a2) {
        this.buffers.push(a2);
        this.byteLength += a2.length;
      }
      for (let i2 = 0; i2 < bufs.length; i2++) {
        if (bufs[i2] && bufs[i2].length) {
          this.buffers.push(bufs[i2]);
          this.byteLength += bufs[i2].length;
        }
      }
    }
    peek() {
      if (this.buffers.length) {
        this.pack();
        return this.buffers[0];
      }
      return new Uint8Array(0);
    }
    size() {
      return this.byteLength;
    }
    length() {
      return this.buffers.length;
    }
  };
  function t(t2, e2) {
    return e2.forEach(function(e3) {
      e3 && "string" != typeof e3 && !Array.isArray(e3) && Object.keys(e3).forEach(function(r2) {
        if ("default" !== r2 && !(r2 in t2)) {
          var i2 = Object.getOwnPropertyDescriptor(e3, r2);
          Object.defineProperty(t2, r2, i2.get ? i2 : {
            enumerable: true,
            get: function() {
              return e3[r2];
            }
          });
        }
      });
    }), Object.freeze(t2);
  }
  var e = "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {};
  function r() {
    throw new Error("setTimeout has not been defined");
  }
  function i() {
    throw new Error("clearTimeout has not been defined");
  }
  var h = r;
  var s = i;
  function n(t2) {
    if (h === setTimeout) return setTimeout(t2, 0);
    if ((h === r || !h) && setTimeout) return h = setTimeout, setTimeout(t2, 0);
    try {
      return h(t2, 0);
    } catch (e2) {
      try {
        return h.call(null, t2, 0);
      } catch (e3) {
        return h.call(this, t2, 0);
      }
    }
  }
  "function" == typeof e.setTimeout && (h = setTimeout), "function" == typeof e.clearTimeout && (s = clearTimeout);
  var o;
  var a = [];
  var f = false;
  var u = -1;
  function c() {
    f && o && (f = false, o.length ? a = o.concat(a) : u = -1, a.length && l());
  }
  function l() {
    if (!f) {
      var t2 = n(c);
      f = true;
      for (var e2 = a.length; e2; ) {
        for (o = a, a = []; ++u < e2; ) o && o[u].run();
        u = -1, e2 = a.length;
      }
      o = null, f = false, function(t3) {
        if (s === clearTimeout) return clearTimeout(t3);
        if ((s === i || !s) && clearTimeout) return s = clearTimeout, clearTimeout(t3);
        try {
          return s(t3);
        } catch (e3) {
          try {
            return s.call(null, t3);
          } catch (e4) {
            return s.call(this, t3);
          }
        }
      }(t2);
    }
  }
  function y(t2, e2) {
    this.fun = t2, this.array = e2;
  }
  y.prototype.run = function() {
    this.fun.apply(null, this.array);
  };
  function p() {
  }
  var d = p;
  var w = p;
  var b = p;
  var v = p;
  var A = p;
  var g = p;
  var _ = p;
  var m = e.performance || {};
  var O = m.now || m.mozNow || m.msNow || m.oNow || m.webkitNow || function() {
    return (/* @__PURE__ */ new Date()).getTime();
  };
  var B = /* @__PURE__ */ new Date();
  var E = {
    nextTick: function(t2) {
      var e2 = new Array(arguments.length - 1);
      if (arguments.length > 1) for (var r2 = 1; r2 < arguments.length; r2++) e2[r2 - 1] = arguments[r2];
      a.push(new y(t2, e2)), 1 !== a.length || f || n(l);
    },
    title: "browser",
    browser: true,
    env: {},
    argv: [],
    version: "",
    versions: {},
    on: d,
    addListener: w,
    once: b,
    off: v,
    removeListener: A,
    removeAllListeners: g,
    emit: _,
    binding: function(t2) {
      throw new Error("process.binding is not supported");
    },
    cwd: function() {
      return "/";
    },
    chdir: function(t2) {
      throw new Error("process.chdir is not supported");
    },
    umask: function() {
      return 0;
    },
    hrtime: function(t2) {
      var e2 = 1e-3 * O.call(m), r2 = Math.floor(e2), i2 = Math.floor(e2 % 1 * 1e9);
      return t2 && (r2 -= t2[0], (i2 -= t2[1]) < 0 && (r2--, i2 += 1e9)), [
        r2,
        i2
      ];
    },
    platform: "browser",
    release: {},
    config: {},
    uptime: function() {
      return (/* @__PURE__ */ new Date() - B) / 1e3;
    }
  };
  var S = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
  function T(t2) {
    if (t2.__esModule) return t2;
    var e2 = Object.defineProperty({}, "__esModule", {
      value: true
    });
    return Object.keys(t2).forEach(function(r2) {
      var i2 = Object.getOwnPropertyDescriptor(t2, r2);
      Object.defineProperty(e2, r2, i2.get ? i2 : {
        enumerable: true,
        get: function() {
          return t2[r2];
        }
      });
    }), e2;
  }
  var k;
  var x = {
    exports: {}
  };
  var j = {};
  var N = T(t({
    __proto__: null,
    default: j
  }, [
    j
  ]));
  k = x, function() {
    var t2 = "input is invalid type", e2 = "object" == typeof window, r2 = e2 ? window : {};
    r2.JS_SHA256_NO_WINDOW && (e2 = false);
    var i2 = !e2 && "object" == typeof self, h2 = !r2.JS_SHA256_NO_NODE_JS && E.versions && E.versions.node;
    h2 ? r2 = S : i2 && (r2 = self);
    var s2 = !r2.JS_SHA256_NO_COMMON_JS && k.exports, n2 = !r2.JS_SHA256_NO_ARRAY_BUFFER && "undefined" != typeof ArrayBuffer, o2 = "0123456789abcdef".split(""), a2 = [
      -2147483648,
      8388608,
      32768,
      128
    ], f2 = [
      24,
      16,
      8,
      0
    ], u2 = [
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ], c2 = [
      "hex",
      "array",
      "digest",
      "arrayBuffer"
    ], l2 = [];
    !r2.JS_SHA256_NO_NODE_JS && Array.isArray || (Array.isArray = function(t3) {
      return "[object Array]" === Object.prototype.toString.call(t3);
    }), !n2 || !r2.JS_SHA256_NO_ARRAY_BUFFER_IS_VIEW && ArrayBuffer.isView || (ArrayBuffer.isView = function(t3) {
      return "object" == typeof t3 && t3.buffer && t3.buffer.constructor === ArrayBuffer;
    });
    var y2 = function(t3, e3) {
      return function(r3) {
        return new v2(e3, true).update(r3)[t3]();
      };
    }, p2 = function(t3) {
      var e3 = y2("hex", t3);
      h2 && (e3 = d2(e3, t3)), e3.create = function() {
        return new v2(t3);
      }, e3.update = function(t4) {
        return e3.create().update(t4);
      };
      for (var r3 = 0; r3 < c2.length; ++r3) {
        var i3 = c2[r3];
        e3[i3] = y2(i3, t3);
      }
      return e3;
    }, d2 = function(e3, i3) {
      var h3, s3 = N, n3 = N.Buffer, o3 = i3 ? "sha224" : "sha256";
      return h3 = n3.from && !r2.JS_SHA256_NO_BUFFER_FROM ? n3.from : function(t3) {
        return new n3(t3);
      }, function(r3) {
        if ("string" == typeof r3) return s3.createHash(o3).update(r3, "utf8").digest("hex");
        if (null == r3) throw new Error(t2);
        return r3.constructor === ArrayBuffer && (r3 = new Uint8Array(r3)), Array.isArray(r3) || ArrayBuffer.isView(r3) || r3.constructor === n3 ? s3.createHash(o3).update(h3(r3)).digest("hex") : e3(r3);
      };
    }, w2 = function(t3, e3) {
      return function(r3, i3) {
        return new A2(r3, e3, true).update(i3)[t3]();
      };
    }, b2 = function(t3) {
      var e3 = w2("hex", t3);
      e3.create = function(e4) {
        return new A2(e4, t3);
      }, e3.update = function(t4, r4) {
        return e3.create(t4).update(r4);
      };
      for (var r3 = 0; r3 < c2.length; ++r3) {
        var i3 = c2[r3];
        e3[i3] = w2(i3, t3);
      }
      return e3;
    };
    function v2(t3, e3) {
      e3 ? (l2[0] = l2[16] = l2[1] = l2[2] = l2[3] = l2[4] = l2[5] = l2[6] = l2[7] = l2[8] = l2[9] = l2[10] = l2[11] = l2[12] = l2[13] = l2[14] = l2[15] = 0, this.blocks = l2) : this.blocks = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ], t3 ? (this.h0 = 3238371032, this.h1 = 914150663, this.h2 = 812702999, this.h3 = 4144912697, this.h4 = 4290775857, this.h5 = 1750603025, this.h6 = 1694076839, this.h7 = 3204075428) : (this.h0 = 1779033703, this.h1 = 3144134277, this.h2 = 1013904242, this.h3 = 2773480762, this.h4 = 1359893119, this.h5 = 2600822924, this.h6 = 528734635, this.h7 = 1541459225), this.block = this.start = this.bytes = this.hBytes = 0, this.finalized = this.hashed = false, this.first = true, this.is224 = t3;
    }
    function A2(e3, r3, i3) {
      var h3, s3 = typeof e3;
      if ("string" === s3) {
        var o3, a3 = [], f3 = e3.length, u3 = 0;
        for (h3 = 0; h3 < f3; ++h3) (o3 = e3.charCodeAt(h3)) < 128 ? a3[u3++] = o3 : o3 < 2048 ? (a3[u3++] = 192 | o3 >>> 6, a3[u3++] = 128 | 63 & o3) : o3 < 55296 || o3 >= 57344 ? (a3[u3++] = 224 | o3 >>> 12, a3[u3++] = 128 | o3 >>> 6 & 63, a3[u3++] = 128 | 63 & o3) : (o3 = 65536 + ((1023 & o3) << 10 | 1023 & e3.charCodeAt(++h3)), a3[u3++] = 240 | o3 >>> 18, a3[u3++] = 128 | o3 >>> 12 & 63, a3[u3++] = 128 | o3 >>> 6 & 63, a3[u3++] = 128 | 63 & o3);
        e3 = a3;
      } else {
        if ("object" !== s3) throw new Error(t2);
        if (null === e3) throw new Error(t2);
        if (n2 && e3.constructor === ArrayBuffer) e3 = new Uint8Array(e3);
        else if (!(Array.isArray(e3) || n2 && ArrayBuffer.isView(e3))) throw new Error(t2);
      }
      e3.length > 64 && (e3 = new v2(r3, true).update(e3).array());
      var c3 = [], l3 = [];
      for (h3 = 0; h3 < 64; ++h3) {
        var y3 = e3[h3] || 0;
        c3[h3] = 92 ^ y3, l3[h3] = 54 ^ y3;
      }
      v2.call(this, r3, i3), this.update(l3), this.oKeyPad = c3, this.inner = true, this.sharedMemory = i3;
    }
    v2.prototype.update = function(e3) {
      if (!this.finalized) {
        var r3, i3 = typeof e3;
        if ("string" !== i3) {
          if ("object" !== i3) throw new Error(t2);
          if (null === e3) throw new Error(t2);
          if (n2 && e3.constructor === ArrayBuffer) e3 = new Uint8Array(e3);
          else if (!(Array.isArray(e3) || n2 && ArrayBuffer.isView(e3))) throw new Error(t2);
          r3 = true;
        }
        for (var h3, s3, o3 = 0, a3 = e3.length, u3 = this.blocks; o3 < a3; ) {
          if (this.hashed && (this.hashed = false, u3[0] = this.block, this.block = u3[16] = u3[1] = u3[2] = u3[3] = u3[4] = u3[5] = u3[6] = u3[7] = u3[8] = u3[9] = u3[10] = u3[11] = u3[12] = u3[13] = u3[14] = u3[15] = 0), r3) for (s3 = this.start; o3 < a3 && s3 < 64; ++o3) u3[s3 >>> 2] |= e3[o3] << f2[3 & s3++];
          else for (s3 = this.start; o3 < a3 && s3 < 64; ++o3) (h3 = e3.charCodeAt(o3)) < 128 ? u3[s3 >>> 2] |= h3 << f2[3 & s3++] : h3 < 2048 ? (u3[s3 >>> 2] |= (192 | h3 >>> 6) << f2[3 & s3++], u3[s3 >>> 2] |= (128 | 63 & h3) << f2[3 & s3++]) : h3 < 55296 || h3 >= 57344 ? (u3[s3 >>> 2] |= (224 | h3 >>> 12) << f2[3 & s3++], u3[s3 >>> 2] |= (128 | h3 >>> 6 & 63) << f2[3 & s3++], u3[s3 >>> 2] |= (128 | 63 & h3) << f2[3 & s3++]) : (h3 = 65536 + ((1023 & h3) << 10 | 1023 & e3.charCodeAt(++o3)), u3[s3 >>> 2] |= (240 | h3 >>> 18) << f2[3 & s3++], u3[s3 >>> 2] |= (128 | h3 >>> 12 & 63) << f2[3 & s3++], u3[s3 >>> 2] |= (128 | h3 >>> 6 & 63) << f2[3 & s3++], u3[s3 >>> 2] |= (128 | 63 & h3) << f2[3 & s3++]);
          this.lastByteIndex = s3, this.bytes += s3 - this.start, s3 >= 64 ? (this.block = u3[16], this.start = s3 - 64, this.hash(), this.hashed = true) : this.start = s3;
        }
        return this.bytes > 4294967295 && (this.hBytes += this.bytes / 4294967296 | 0, this.bytes = this.bytes % 4294967296), this;
      }
    }, v2.prototype.finalize = function() {
      if (!this.finalized) {
        this.finalized = true;
        var t3 = this.blocks, e3 = this.lastByteIndex;
        t3[16] = this.block, t3[e3 >>> 2] |= a2[3 & e3], this.block = t3[16], e3 >= 56 && (this.hashed || this.hash(), t3[0] = this.block, t3[16] = t3[1] = t3[2] = t3[3] = t3[4] = t3[5] = t3[6] = t3[7] = t3[8] = t3[9] = t3[10] = t3[11] = t3[12] = t3[13] = t3[14] = t3[15] = 0), t3[14] = this.hBytes << 3 | this.bytes >>> 29, t3[15] = this.bytes << 3, this.hash();
      }
    }, v2.prototype.hash = function() {
      var t3, e3, r3, i3, h3, s3, n3, o3, a3, f3 = this.h0, c3 = this.h1, l3 = this.h2, y3 = this.h3, p3 = this.h4, d3 = this.h5, w3 = this.h6, b3 = this.h7, v3 = this.blocks;
      for (t3 = 16; t3 < 64; ++t3) e3 = ((h3 = v3[t3 - 15]) >>> 7 | h3 << 25) ^ (h3 >>> 18 | h3 << 14) ^ h3 >>> 3, r3 = ((h3 = v3[t3 - 2]) >>> 17 | h3 << 15) ^ (h3 >>> 19 | h3 << 13) ^ h3 >>> 10, v3[t3] = v3[t3 - 16] + e3 + v3[t3 - 7] + r3 | 0;
      for (a3 = c3 & l3, t3 = 0; t3 < 64; t3 += 4) this.first ? (this.is224 ? (s3 = 300032, b3 = (h3 = v3[0] - 1413257819) - 150054599 | 0, y3 = h3 + 24177077 | 0) : (s3 = 704751109, b3 = (h3 = v3[0] - 210244248) - 1521486534 | 0, y3 = h3 + 143694565 | 0), this.first = false) : (e3 = (f3 >>> 2 | f3 << 30) ^ (f3 >>> 13 | f3 << 19) ^ (f3 >>> 22 | f3 << 10), i3 = (s3 = f3 & c3) ^ f3 & l3 ^ a3, b3 = y3 + (h3 = b3 + (r3 = (p3 >>> 6 | p3 << 26) ^ (p3 >>> 11 | p3 << 21) ^ (p3 >>> 25 | p3 << 7)) + (p3 & d3 ^ ~p3 & w3) + u2[t3] + v3[t3]) | 0, y3 = h3 + (e3 + i3) | 0), e3 = (y3 >>> 2 | y3 << 30) ^ (y3 >>> 13 | y3 << 19) ^ (y3 >>> 22 | y3 << 10), i3 = (n3 = y3 & f3) ^ y3 & c3 ^ s3, w3 = l3 + (h3 = w3 + (r3 = (b3 >>> 6 | b3 << 26) ^ (b3 >>> 11 | b3 << 21) ^ (b3 >>> 25 | b3 << 7)) + (b3 & p3 ^ ~b3 & d3) + u2[t3 + 1] + v3[t3 + 1]) | 0, e3 = ((l3 = h3 + (e3 + i3) | 0) >>> 2 | l3 << 30) ^ (l3 >>> 13 | l3 << 19) ^ (l3 >>> 22 | l3 << 10), i3 = (o3 = l3 & y3) ^ l3 & f3 ^ n3, d3 = c3 + (h3 = d3 + (r3 = (w3 >>> 6 | w3 << 26) ^ (w3 >>> 11 | w3 << 21) ^ (w3 >>> 25 | w3 << 7)) + (w3 & b3 ^ ~w3 & p3) + u2[t3 + 2] + v3[t3 + 2]) | 0, e3 = ((c3 = h3 + (e3 + i3) | 0) >>> 2 | c3 << 30) ^ (c3 >>> 13 | c3 << 19) ^ (c3 >>> 22 | c3 << 10), i3 = (a3 = c3 & l3) ^ c3 & y3 ^ o3, p3 = f3 + (h3 = p3 + (r3 = (d3 >>> 6 | d3 << 26) ^ (d3 >>> 11 | d3 << 21) ^ (d3 >>> 25 | d3 << 7)) + (d3 & w3 ^ ~d3 & b3) + u2[t3 + 3] + v3[t3 + 3]) | 0, f3 = h3 + (e3 + i3) | 0, this.chromeBugWorkAround = true;
      this.h0 = this.h0 + f3 | 0, this.h1 = this.h1 + c3 | 0, this.h2 = this.h2 + l3 | 0, this.h3 = this.h3 + y3 | 0, this.h4 = this.h4 + p3 | 0, this.h5 = this.h5 + d3 | 0, this.h6 = this.h6 + w3 | 0, this.h7 = this.h7 + b3 | 0;
    }, v2.prototype.hex = function() {
      this.finalize();
      var t3 = this.h0, e3 = this.h1, r3 = this.h2, i3 = this.h3, h3 = this.h4, s3 = this.h5, n3 = this.h6, a3 = this.h7, f3 = o2[t3 >>> 28 & 15] + o2[t3 >>> 24 & 15] + o2[t3 >>> 20 & 15] + o2[t3 >>> 16 & 15] + o2[t3 >>> 12 & 15] + o2[t3 >>> 8 & 15] + o2[t3 >>> 4 & 15] + o2[15 & t3] + o2[e3 >>> 28 & 15] + o2[e3 >>> 24 & 15] + o2[e3 >>> 20 & 15] + o2[e3 >>> 16 & 15] + o2[e3 >>> 12 & 15] + o2[e3 >>> 8 & 15] + o2[e3 >>> 4 & 15] + o2[15 & e3] + o2[r3 >>> 28 & 15] + o2[r3 >>> 24 & 15] + o2[r3 >>> 20 & 15] + o2[r3 >>> 16 & 15] + o2[r3 >>> 12 & 15] + o2[r3 >>> 8 & 15] + o2[r3 >>> 4 & 15] + o2[15 & r3] + o2[i3 >>> 28 & 15] + o2[i3 >>> 24 & 15] + o2[i3 >>> 20 & 15] + o2[i3 >>> 16 & 15] + o2[i3 >>> 12 & 15] + o2[i3 >>> 8 & 15] + o2[i3 >>> 4 & 15] + o2[15 & i3] + o2[h3 >>> 28 & 15] + o2[h3 >>> 24 & 15] + o2[h3 >>> 20 & 15] + o2[h3 >>> 16 & 15] + o2[h3 >>> 12 & 15] + o2[h3 >>> 8 & 15] + o2[h3 >>> 4 & 15] + o2[15 & h3] + o2[s3 >>> 28 & 15] + o2[s3 >>> 24 & 15] + o2[s3 >>> 20 & 15] + o2[s3 >>> 16 & 15] + o2[s3 >>> 12 & 15] + o2[s3 >>> 8 & 15] + o2[s3 >>> 4 & 15] + o2[15 & s3] + o2[n3 >>> 28 & 15] + o2[n3 >>> 24 & 15] + o2[n3 >>> 20 & 15] + o2[n3 >>> 16 & 15] + o2[n3 >>> 12 & 15] + o2[n3 >>> 8 & 15] + o2[n3 >>> 4 & 15] + o2[15 & n3];
      return this.is224 || (f3 += o2[a3 >>> 28 & 15] + o2[a3 >>> 24 & 15] + o2[a3 >>> 20 & 15] + o2[a3 >>> 16 & 15] + o2[a3 >>> 12 & 15] + o2[a3 >>> 8 & 15] + o2[a3 >>> 4 & 15] + o2[15 & a3]), f3;
    }, v2.prototype.toString = v2.prototype.hex, v2.prototype.digest = function() {
      this.finalize();
      var t3 = this.h0, e3 = this.h1, r3 = this.h2, i3 = this.h3, h3 = this.h4, s3 = this.h5, n3 = this.h6, o3 = this.h7, a3 = [
        t3 >>> 24 & 255,
        t3 >>> 16 & 255,
        t3 >>> 8 & 255,
        255 & t3,
        e3 >>> 24 & 255,
        e3 >>> 16 & 255,
        e3 >>> 8 & 255,
        255 & e3,
        r3 >>> 24 & 255,
        r3 >>> 16 & 255,
        r3 >>> 8 & 255,
        255 & r3,
        i3 >>> 24 & 255,
        i3 >>> 16 & 255,
        i3 >>> 8 & 255,
        255 & i3,
        h3 >>> 24 & 255,
        h3 >>> 16 & 255,
        h3 >>> 8 & 255,
        255 & h3,
        s3 >>> 24 & 255,
        s3 >>> 16 & 255,
        s3 >>> 8 & 255,
        255 & s3,
        n3 >>> 24 & 255,
        n3 >>> 16 & 255,
        n3 >>> 8 & 255,
        255 & n3
      ];
      return this.is224 || a3.push(o3 >>> 24 & 255, o3 >>> 16 & 255, o3 >>> 8 & 255, 255 & o3), a3;
    }, v2.prototype.array = v2.prototype.digest, v2.prototype.arrayBuffer = function() {
      this.finalize();
      var t3 = new ArrayBuffer(this.is224 ? 28 : 32), e3 = new DataView(t3);
      return e3.setUint32(0, this.h0), e3.setUint32(4, this.h1), e3.setUint32(8, this.h2), e3.setUint32(12, this.h3), e3.setUint32(16, this.h4), e3.setUint32(20, this.h5), e3.setUint32(24, this.h6), this.is224 || e3.setUint32(28, this.h7), t3;
    }, A2.prototype = new v2(), A2.prototype.finalize = function() {
      if (v2.prototype.finalize.call(this), this.inner) {
        this.inner = false;
        var t3 = this.array();
        v2.call(this, this.is224, this.sharedMemory), this.update(this.oKeyPad), this.update(t3), v2.prototype.finalize.call(this);
      }
    };
    var g2 = p2();
    g2.sha256 = g2, g2.sha224 = p2(true), g2.sha256.hmac = b2(), g2.sha224.hmac = b2(true), s2 ? k.exports = g2 : (r2.sha256 = g2.sha256, r2.sha224 = g2.sha224);
  }();
  var U = x.exports;
  var z = x.exports.sha224;
  var J = x.exports.sha256;
  function parseSha256(s2) {
    return toByteArray(s2);
  }
  function isHex(s2) {
    const hexRegex = /^[0-9A-Fa-f]+$/;
    if (!hexRegex.test(s2)) {
      return false;
    }
    const isAllUpperCase = /^[0-9A-F]+$/.test(s2);
    const isAllLowerCase = /^[0-9a-f]+$/.test(s2);
    if (!(isAllUpperCase || isAllLowerCase)) {
      return false;
    }
    return s2.length % 2 === 0;
  }
  function isBase64(s2) {
    return /^[A-Za-z0-9\-_]*(={0,2})?$/.test(s2) || /^[A-Za-z0-9+/]*(={0,2})?$/.test(s2);
  }
  function detectEncoding(input) {
    if (isHex(input)) {
      return "hex";
    } else if (isBase64(input)) {
      return "b64";
    }
    return "";
  }
  function hexToByteArray(s2) {
    if (s2.length % 2 !== 0) {
      throw new Error("hex string must have an even length");
    }
    const a2 = new Uint8Array(s2.length / 2);
    for (let i2 = 0; i2 < s2.length; i2 += 2) {
      a2[i2 / 2] = parseInt(s2.substring(i2, i2 + 2), 16);
    }
    return a2;
  }
  function base64ToByteArray(s2) {
    s2 = s2.replace(/-/g, "+");
    s2 = s2.replace(/_/g, "/");
    const sbin = atob(s2);
    return Uint8Array.from(sbin, (c2) => c2.charCodeAt(0));
  }
  function toByteArray(input) {
    const encoding = detectEncoding(input);
    switch (encoding) {
      case "hex":
        return hexToByteArray(input);
      case "b64":
        return base64ToByteArray(input);
    }
    return null;
  }
  function checkSha256(a2, b2) {
    const aBytes = typeof a2 === "string" ? parseSha256(a2) : a2;
    const bBytes = typeof b2 === "string" ? parseSha256(b2) : b2;
    if (aBytes === null || bBytes === null) {
      return false;
    }
    if (aBytes.length !== bBytes.length) {
      return false;
    }
    for (let i2 = 0; i2 < aBytes.length; i2++) {
      if (aBytes[i2] !== bBytes[i2]) {
        return false;
      }
    }
    return true;
  }
  var BaseRequest = class {
    token;
    received;
    ctx;
    requestSubject;
    mux;
    constructor(mux, requestSubject, asyncTraces = true) {
      this.mux = mux;
      this.requestSubject = requestSubject;
      this.received = 0;
      this.token = nuid.next();
      if (asyncTraces) {
        this.ctx = new Error();
      }
    }
  };
  var RequestMany = class extends BaseRequest {
    callback;
    done;
    timer;
    max;
    opts;
    constructor(mux, requestSubject, opts = {
      maxWait: 1e3
    }) {
      super(mux, requestSubject);
      this.opts = opts;
      if (typeof this.opts.callback !== "function") {
        throw new Error("callback is required");
      }
      this.callback = this.opts.callback;
      this.max = typeof opts.maxMessages === "number" && opts.maxMessages > 0 ? opts.maxMessages : -1;
      this.done = deferred();
      this.done.then(() => {
        this.callback(null, null);
      });
      this.timer = setTimeout(() => {
        this.cancel();
      }, opts.maxWait);
    }
    cancel(err) {
      if (err) {
        this.callback(err, null);
      }
      clearTimeout(this.timer);
      this.mux.cancel(this);
      this.done.resolve();
    }
    resolver(err, msg) {
      if (err) {
        if (this.ctx) {
          err.stack += `

${this.ctx.stack}`;
        }
        this.cancel(err);
      } else {
        this.callback(null, msg);
        if (this.opts.strategy === RequestStrategy.Count) {
          this.max--;
          if (this.max === 0) {
            this.cancel();
          }
        }
        if (this.opts.strategy === RequestStrategy.JitterTimer) {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.cancel();
          }, this.opts.jitter || 300);
        }
        if (this.opts.strategy === RequestStrategy.SentinelMsg) {
          if (msg && msg.data.length === 0) {
            this.cancel();
          }
        }
      }
    }
  };
  var RequestOne = class extends BaseRequest {
    deferred;
    timer;
    constructor(mux, requestSubject, opts = {
      timeout: 1e3
    }, asyncTraces = true) {
      super(mux, requestSubject, asyncTraces);
      this.deferred = deferred();
      this.timer = timeout(opts.timeout, asyncTraces);
    }
    resolver(err, msg) {
      if (this.timer) {
        this.timer.cancel();
      }
      if (err) {
        if (this.ctx) {
          err.stack += `

${this.ctx.stack}`;
        }
        this.deferred.reject(err);
      } else {
        this.deferred.resolve(msg);
      }
      this.cancel();
    }
    cancel(err) {
      if (this.timer) {
        this.timer.cancel();
      }
      this.mux.cancel(this);
      this.deferred.reject(err ? err : NatsError.errorForCode(ErrorCode.Cancelled));
    }
  };
  var defaultPrefix = "$JS.API";
  function defaultJsOptions(opts) {
    opts = opts || {};
    if (opts.domain) {
      opts.apiPrefix = `$JS.${opts.domain}.API`;
      delete opts.domain;
    }
    return extend({
      apiPrefix: defaultPrefix,
      timeout: 5e3
    }, opts);
  }
  var BaseApiClient = class {
    nc;
    opts;
    prefix;
    timeout;
    jc;
    constructor(nc, opts) {
      this.nc = nc;
      this.opts = defaultJsOptions(opts);
      this._parseOpts();
      this.prefix = this.opts.apiPrefix;
      this.timeout = this.opts.timeout;
      this.jc = JSONCodec();
    }
    getOptions() {
      return Object.assign({}, this.opts);
    }
    _parseOpts() {
      let prefix = this.opts.apiPrefix;
      if (!prefix || prefix.length === 0) {
        throw new Error("invalid empty prefix");
      }
      const c2 = prefix[prefix.length - 1];
      if (c2 === ".") {
        prefix = prefix.substr(0, prefix.length - 1);
      }
      this.opts.apiPrefix = prefix;
    }
    async _request(subj, data = null, opts) {
      opts = opts || {};
      opts.timeout = this.timeout;
      let a2 = Empty;
      if (data) {
        a2 = this.jc.encode(data);
      }
      let { retries } = opts;
      retries = retries || 1;
      retries = retries === -1 ? Number.MAX_SAFE_INTEGER : retries;
      const bo = backoff();
      for (let i2 = 0; i2 < retries; i2++) {
        try {
          const m2 = await this.nc.request(subj, a2, opts);
          return this.parseJsResponse(m2);
        } catch (err) {
          const ne = err;
          if ((ne.code === "503" || ne.code === ErrorCode.Timeout) && i2 + 1 < retries) {
            await delay(bo.backoff(i2));
          } else {
            throw err;
          }
        }
      }
    }
    async findStream(subject) {
      const q = {
        subject
      };
      const r2 = await this._request(`${this.prefix}.STREAM.NAMES`, q);
      const names = r2;
      if (!names.streams || names.streams.length !== 1) {
        throw new Error("no stream matches subject");
      }
      return names.streams[0];
    }
    getConnection() {
      return this.nc;
    }
    parseJsResponse(m2) {
      const v2 = this.jc.decode(m2.data);
      const r2 = v2;
      if (r2.error) {
        const err = checkJsErrorCode(r2.error.code, r2.error.description);
        if (err !== null) {
          err.api_error = r2.error;
          throw err;
        }
      }
      return v2;
    }
  };
  var ListerImpl = class {
    err;
    offset;
    pageInfo;
    subject;
    jsm;
    filter;
    payload;
    constructor(subject, filter, jsm, payload) {
      if (!subject) {
        throw new Error("subject is required");
      }
      this.subject = subject;
      this.jsm = jsm;
      this.offset = 0;
      this.pageInfo = {};
      this.filter = filter;
      this.payload = payload || {};
    }
    async next() {
      if (this.err) {
        return [];
      }
      if (this.pageInfo && this.offset >= this.pageInfo.total) {
        return [];
      }
      const offset = {
        offset: this.offset
      };
      if (this.payload) {
        Object.assign(offset, this.payload);
      }
      try {
        const r2 = await this.jsm._request(this.subject, offset, {
          timeout: this.jsm.timeout
        });
        this.pageInfo = r2;
        const count = this.countResponse(r2);
        if (count === 0) {
          return [];
        }
        this.offset += count;
        const a2 = this.filter(r2);
        return a2;
      } catch (err) {
        this.err = err;
        throw err;
      }
    }
    countResponse(r2) {
      switch (r2?.type) {
        case "io.nats.jetstream.api.v1.stream_names_response":
        case "io.nats.jetstream.api.v1.stream_list_response":
          return r2.streams?.length || 0;
        case "io.nats.jetstream.api.v1.consumer_list_response":
          return r2.consumers?.length || 0;
        default:
          console.error(`jslister.ts: unknown API response for paged output: ${r2?.type}`);
          return r2.streams?.length || 0;
      }
      return 0;
    }
    async *[Symbol.asyncIterator]() {
      let page = await this.next();
      while (page.length > 0) {
        for (const item of page) {
          yield item;
        }
        page = await this.next();
      }
    }
  };
  function parseSemVer(s2 = "") {
    const m2 = s2.match(/(\d+).(\d+).(\d+)/);
    if (m2) {
      return {
        major: parseInt(m2[1]),
        minor: parseInt(m2[2]),
        micro: parseInt(m2[3])
      };
    }
    throw new Error(`'${s2}' is not a semver value`);
  }
  function compare(a2, b2) {
    if (a2.major < b2.major) return -1;
    if (a2.major > b2.major) return 1;
    if (a2.minor < b2.minor) return -1;
    if (a2.minor > b2.minor) return 1;
    if (a2.micro < b2.micro) return -1;
    if (a2.micro > b2.micro) return 1;
    return 0;
  }
  var Feature;
  (function(Feature2) {
    Feature2["JS_KV"] = "js_kv";
    Feature2["JS_OBJECTSTORE"] = "js_objectstore";
    Feature2["JS_PULL_MAX_BYTES"] = "js_pull_max_bytes";
    Feature2["JS_NEW_CONSUMER_CREATE_API"] = "js_new_consumer_create";
    Feature2["JS_ALLOW_DIRECT"] = "js_allow_direct";
    Feature2["JS_MULTIPLE_CONSUMER_FILTER"] = "js_multiple_consumer_filter";
    Feature2["JS_SIMPLIFICATION"] = "js_simplification";
    Feature2["JS_STREAM_CONSUMER_METADATA"] = "js_stream_consumer_metadata";
    Feature2["JS_CONSUMER_FILTER_SUBJECTS"] = "js_consumer_filter_subjects";
    Feature2["JS_STREAM_FIRST_SEQ"] = "js_stream_first_seq";
    Feature2["JS_STREAM_SUBJECT_TRANSFORM"] = "js_stream_subject_transform";
    Feature2["JS_STREAM_SOURCE_SUBJECT_TRANSFORM"] = "js_stream_source_subject_transform";
    Feature2["JS_STREAM_COMPRESSION"] = "js_stream_compression";
    Feature2["JS_DEFAULT_CONSUMER_LIMITS"] = "js_default_consumer_limits";
    Feature2["JS_BATCH_DIRECT_GET"] = "js_batch_direct_get";
  })(Feature || (Feature = {}));
  var Features = class {
    server;
    features;
    disabled;
    constructor(v2) {
      this.features = /* @__PURE__ */ new Map();
      this.disabled = [];
      this.update(v2);
    }
    resetDisabled() {
      this.disabled.length = 0;
      this.update(this.server);
    }
    disable(f2) {
      this.disabled.push(f2);
      this.update(this.server);
    }
    isDisabled(f2) {
      return this.disabled.indexOf(f2) !== -1;
    }
    update(v2) {
      if (typeof v2 === "string") {
        v2 = parseSemVer(v2);
      }
      this.server = v2;
      this.set(Feature.JS_KV, "2.6.2");
      this.set(Feature.JS_OBJECTSTORE, "2.6.3");
      this.set(Feature.JS_PULL_MAX_BYTES, "2.8.3");
      this.set(Feature.JS_NEW_CONSUMER_CREATE_API, "2.9.0");
      this.set(Feature.JS_ALLOW_DIRECT, "2.9.0");
      this.set(Feature.JS_MULTIPLE_CONSUMER_FILTER, "2.10.0");
      this.set(Feature.JS_SIMPLIFICATION, "2.9.4");
      this.set(Feature.JS_STREAM_CONSUMER_METADATA, "2.10.0");
      this.set(Feature.JS_CONSUMER_FILTER_SUBJECTS, "2.10.0");
      this.set(Feature.JS_STREAM_FIRST_SEQ, "2.10.0");
      this.set(Feature.JS_STREAM_SUBJECT_TRANSFORM, "2.10.0");
      this.set(Feature.JS_STREAM_SOURCE_SUBJECT_TRANSFORM, "2.10.0");
      this.set(Feature.JS_STREAM_COMPRESSION, "2.10.0");
      this.set(Feature.JS_DEFAULT_CONSUMER_LIMITS, "2.10.0");
      this.set(Feature.JS_BATCH_DIRECT_GET, "2.11.0");
      this.disabled.forEach((f2) => {
        this.features.delete(f2);
      });
    }
    set(f2, requires) {
      this.features.set(f2, {
        min: requires,
        ok: compare(this.server, parseSemVer(requires)) >= 0
      });
    }
    get(f2) {
      return this.features.get(f2) || {
        min: "unknown",
        ok: false
      };
    }
    supports(f2) {
      return this.get(f2)?.ok || false;
    }
    require(v2) {
      if (typeof v2 === "string") {
        v2 = parseSemVer(v2);
      }
      return compare(this.server, v2) >= 0;
    }
  };
  var ConsumerAPIImpl = class extends BaseApiClient {
    constructor(nc, opts) {
      super(nc, opts);
    }
    async add(stream, cfg, action = ConsumerApiAction.Create) {
      validateStreamName(stream);
      if (cfg.deliver_group && cfg.flow_control) {
        throw new Error("jetstream flow control is not supported with queue groups");
      }
      if (cfg.deliver_group && cfg.idle_heartbeat) {
        throw new Error("jetstream idle heartbeat is not supported with queue groups");
      }
      const cr = {};
      cr.config = cfg;
      cr.stream_name = stream;
      cr.action = action;
      if (cr.config.durable_name) {
        validateDurableName(cr.config.durable_name);
      }
      const nci = this.nc;
      let { min, ok: newAPI } = nci.features.get(Feature.JS_NEW_CONSUMER_CREATE_API);
      const name = cfg.name === "" ? void 0 : cfg.name;
      if (name && !newAPI) {
        throw new Error(`consumer 'name' requires server ${min}`);
      }
      if (name) {
        try {
          minValidation("name", name);
        } catch (err) {
          const m2 = err.message;
          const idx = m2.indexOf("cannot contain");
          if (idx !== -1) {
            throw new Error(`consumer 'name' ${m2.substring(idx)}`);
          }
          throw err;
        }
      }
      let subj;
      let consumerName = "";
      if (Array.isArray(cfg.filter_subjects)) {
        const { min: min2, ok } = nci.features.get(Feature.JS_MULTIPLE_CONSUMER_FILTER);
        if (!ok) {
          throw new Error(`consumer 'filter_subjects' requires server ${min2}`);
        }
        newAPI = false;
      }
      if (cfg.metadata) {
        const { min: min2, ok } = nci.features.get(Feature.JS_STREAM_CONSUMER_METADATA);
        if (!ok) {
          throw new Error(`consumer 'metadata' requires server ${min2}`);
        }
      }
      if (newAPI) {
        consumerName = cfg.name ?? cfg.durable_name ?? "";
      }
      if (consumerName !== "") {
        let fs = cfg.filter_subject ?? void 0;
        if (fs === ">") {
          fs = void 0;
        }
        subj = fs !== void 0 ? `${this.prefix}.CONSUMER.CREATE.${stream}.${consumerName}.${fs}` : `${this.prefix}.CONSUMER.CREATE.${stream}.${consumerName}`;
      } else {
        subj = cfg.durable_name ? `${this.prefix}.CONSUMER.DURABLE.CREATE.${stream}.${cfg.durable_name}` : `${this.prefix}.CONSUMER.CREATE.${stream}`;
      }
      const r2 = await this._request(subj, cr);
      return r2;
    }
    async update(stream, durable, cfg) {
      const ci = await this.info(stream, durable);
      const changable = cfg;
      return this.add(stream, Object.assign(ci.config, changable), ConsumerApiAction.Update);
    }
    async info(stream, name) {
      validateStreamName(stream);
      validateDurableName(name);
      const r2 = await this._request(`${this.prefix}.CONSUMER.INFO.${stream}.${name}`);
      return r2;
    }
    async delete(stream, name) {
      validateStreamName(stream);
      validateDurableName(name);
      const r2 = await this._request(`${this.prefix}.CONSUMER.DELETE.${stream}.${name}`);
      const cr = r2;
      return cr.success;
    }
    list(stream) {
      validateStreamName(stream);
      const filter = (v2) => {
        const clr = v2;
        return clr.consumers;
      };
      const subj = `${this.prefix}.CONSUMER.LIST.${stream}`;
      return new ListerImpl(subj, filter, this);
    }
    pause(stream, name, until) {
      const subj = `${this.prefix}.CONSUMER.PAUSE.${stream}.${name}`;
      const opts = {
        pause_until: until.toISOString()
      };
      return this._request(subj, opts);
    }
    resume(stream, name) {
      return this.pause(stream, name, /* @__PURE__ */ new Date(0));
    }
  };
  function checkFn(fn, name, required = false) {
    if (required === true && !fn) {
      throw NatsError.errorForCode(ErrorCode.ApiError, new Error(`${name} is not a function`));
    }
    if (fn && typeof fn !== "function") {
      throw NatsError.errorForCode(ErrorCode.ApiError, new Error(`${name} is not a function`));
    }
  }
  var TypedSubscription = class extends QueuedIteratorImpl {
    sub;
    adapter;
    subIterDone;
    constructor(nc, subject, opts) {
      super();
      checkFn(opts.adapter, "adapter", true);
      this.adapter = opts.adapter;
      if (opts.callback) {
        checkFn(opts.callback, "callback");
      }
      this.noIterator = typeof opts.callback === "function";
      if (opts.ingestionFilterFn) {
        checkFn(opts.ingestionFilterFn, "ingestionFilterFn");
        this.ingestionFilterFn = opts.ingestionFilterFn;
      }
      if (opts.protocolFilterFn) {
        checkFn(opts.protocolFilterFn, "protocolFilterFn");
        this.protocolFilterFn = opts.protocolFilterFn;
      }
      if (opts.dispatchedFn) {
        checkFn(opts.dispatchedFn, "dispatchedFn");
        this.dispatchedFn = opts.dispatchedFn;
      }
      if (opts.cleanupFn) {
        checkFn(opts.cleanupFn, "cleanupFn");
      }
      let callback = (err, msg) => {
        this.callback(err, msg);
      };
      if (opts.callback) {
        const uh = opts.callback;
        callback = (err, msg) => {
          const [jer, tm] = this.adapter(err, msg);
          if (jer) {
            uh(jer, null);
            return;
          }
          const { ingest } = this.ingestionFilterFn ? this.ingestionFilterFn(tm, this) : {
            ingest: true
          };
          if (ingest) {
            const ok = this.protocolFilterFn ? this.protocolFilterFn(tm) : true;
            if (ok) {
              uh(jer, tm);
              if (this.dispatchedFn && tm) {
                this.dispatchedFn(tm);
              }
            }
          }
        };
      }
      const { max, queue, timeout: timeout2 } = opts;
      const sopts = {
        queue,
        timeout: timeout2,
        callback
      };
      if (max && max > 0) {
        sopts.max = max;
      }
      this.sub = nc.subscribe(subject, sopts);
      if (opts.cleanupFn) {
        this.sub.cleanupFn = opts.cleanupFn;
      }
      if (!this.noIterator) {
        this.iterClosed.then(() => {
          this.unsubscribe();
        });
      }
      this.subIterDone = deferred();
      Promise.all([
        this.sub.closed,
        this.iterClosed
      ]).then(() => {
        this.subIterDone.resolve();
      }).catch(() => {
        this.subIterDone.resolve();
      });
      (async (s2) => {
        await s2.closed;
        this.stop();
      })(this.sub).then().catch();
    }
    unsubscribe(max) {
      this.sub.unsubscribe(max);
    }
    drain() {
      return this.sub.drain();
    }
    isDraining() {
      return this.sub.isDraining();
    }
    isClosed() {
      return this.sub.isClosed();
    }
    callback(e2, msg) {
      this.sub.cancelTimeout();
      const [err, tm] = this.adapter(e2, msg);
      if (err) {
        this.stop(err);
      }
      if (tm) {
        this.push(tm);
      }
    }
    getSubject() {
      return this.sub.getSubject();
    }
    getReceived() {
      return this.sub.getReceived();
    }
    getProcessed() {
      return this.sub.getProcessed();
    }
    getPending() {
      return this.sub.getPending();
    }
    getID() {
      return this.sub.getID();
    }
    getMax() {
      return this.sub.getMax();
    }
    get closed() {
      return this.sub.closed;
    }
  };
  var transportConfig;
  function setTransportFactory(config) {
    transportConfig = config;
  }
  function defaultPort() {
    return transportConfig !== void 0 && transportConfig.defaultPort !== void 0 ? transportConfig.defaultPort : 4222;
  }
  function getUrlParseFn() {
    return transportConfig !== void 0 && transportConfig.urlParseFn ? transportConfig.urlParseFn : void 0;
  }
  function newTransport() {
    if (!transportConfig || typeof transportConfig.factory !== "function") {
      throw new Error("transport fn is not set");
    }
    return transportConfig.factory();
  }
  function getResolveFn() {
    return transportConfig !== void 0 && transportConfig.dnsResolveFn ? transportConfig.dnsResolveFn : void 0;
  }
  var CR_LF = "\r\n";
  CR_LF.length;
  var CRLF = DataBuffer.fromAscii(CR_LF);
  var CR = new Uint8Array(CRLF)[0];
  var LF = new Uint8Array(CRLF)[1];
  function protoLen(ba) {
    for (let i2 = 0; i2 < ba.length; i2++) {
      const n2 = i2 + 1;
      if (ba.byteLength > n2 && ba[i2] === CR && ba[n2] === LF) {
        return n2 + 1;
      }
    }
    return 0;
  }
  function extractProtocolMessage(a2) {
    const len = protoLen(a2);
    if (len > 0) {
      const ba = new Uint8Array(a2);
      const out = ba.slice(0, len);
      return TD.decode(out);
    }
    return "";
  }
  var IPv4LEN = 4;
  var ASCII0 = 48;
  var ASCIIA = 65;
  var ASCIIa = 97;
  function ipV4(a2, b2, c2, d2) {
    const ip = new Uint8Array(16);
    const prefix = [
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      255,
      255
    ];
    prefix.forEach((v2, idx) => {
      ip[idx] = v2;
    });
    ip[12] = a2;
    ip[13] = b2;
    ip[14] = c2;
    ip[15] = d2;
    return ip;
  }
  function isIP(h2) {
    return parseIP(h2) !== void 0;
  }
  function parseIP(h2) {
    for (let i2 = 0; i2 < h2.length; i2++) {
      switch (h2[i2]) {
        case ".":
          return parseIPv4(h2);
        case ":":
          return parseIPv6(h2);
      }
    }
    return;
  }
  function parseIPv4(s2) {
    const ip = new Uint8Array(4);
    for (let i2 = 0; i2 < 4; i2++) {
      if (s2.length === 0) {
        return void 0;
      }
      if (i2 > 0) {
        if (s2[0] !== ".") {
          return void 0;
        }
        s2 = s2.substring(1);
      }
      const { n: n2, c: c2, ok } = dtoi(s2);
      if (!ok || n2 > 255) {
        return void 0;
      }
      s2 = s2.substring(c2);
      ip[i2] = n2;
    }
    return ipV4(ip[0], ip[1], ip[2], ip[3]);
  }
  function parseIPv6(s2) {
    const ip = new Uint8Array(16);
    let ellipsis = -1;
    if (s2.length >= 2 && s2[0] === ":" && s2[1] === ":") {
      ellipsis = 0;
      s2 = s2.substring(2);
      if (s2.length === 0) {
        return ip;
      }
    }
    let i2 = 0;
    while (i2 < 16) {
      const { n: n2, c: c2, ok } = xtoi(s2);
      if (!ok || n2 > 65535) {
        return void 0;
      }
      if (c2 < s2.length && s2[c2] === ".") {
        if (ellipsis < 0 && i2 != 16 - 4) {
          return void 0;
        }
        if (i2 + 4 > 16) {
          return void 0;
        }
        const ip4 = parseIPv4(s2);
        if (ip4 === void 0) {
          return void 0;
        }
        ip[i2] = ip4[12];
        ip[i2 + 1] = ip4[13];
        ip[i2 + 2] = ip4[14];
        ip[i2 + 3] = ip4[15];
        s2 = "";
        i2 += IPv4LEN;
        break;
      }
      ip[i2] = n2 >> 8;
      ip[i2 + 1] = n2;
      i2 += 2;
      s2 = s2.substring(c2);
      if (s2.length === 0) {
        break;
      }
      if (s2[0] !== ":" || s2.length == 1) {
        return void 0;
      }
      s2 = s2.substring(1);
      if (s2[0] === ":") {
        if (ellipsis >= 0) {
          return void 0;
        }
        ellipsis = i2;
        s2 = s2.substring(1);
        if (s2.length === 0) {
          break;
        }
      }
    }
    if (s2.length !== 0) {
      return void 0;
    }
    if (i2 < 16) {
      if (ellipsis < 0) {
        return void 0;
      }
      const n2 = 16 - i2;
      for (let j2 = i2 - 1; j2 >= ellipsis; j2--) {
        ip[j2 + n2] = ip[j2];
      }
      for (let j2 = ellipsis + n2 - 1; j2 >= ellipsis; j2--) {
        ip[j2] = 0;
      }
    } else if (ellipsis >= 0) {
      return void 0;
    }
    return ip;
  }
  function dtoi(s2) {
    let i2 = 0;
    let n2 = 0;
    for (i2 = 0; i2 < s2.length && 48 <= s2.charCodeAt(i2) && s2.charCodeAt(i2) <= 57; i2++) {
      n2 = n2 * 10 + (s2.charCodeAt(i2) - ASCII0);
      if (n2 >= 16777215) {
        return {
          n: 16777215,
          c: i2,
          ok: false
        };
      }
    }
    if (i2 === 0) {
      return {
        n: 0,
        c: 0,
        ok: false
      };
    }
    return {
      n: n2,
      c: i2,
      ok: true
    };
  }
  function xtoi(s2) {
    let n2 = 0;
    let i2 = 0;
    for (i2 = 0; i2 < s2.length; i2++) {
      if (48 <= s2.charCodeAt(i2) && s2.charCodeAt(i2) <= 57) {
        n2 *= 16;
        n2 += s2.charCodeAt(i2) - ASCII0;
      } else if (97 <= s2.charCodeAt(i2) && s2.charCodeAt(i2) <= 102) {
        n2 *= 16;
        n2 += s2.charCodeAt(i2) - ASCIIa + 10;
      } else if (65 <= s2.charCodeAt(i2) && s2.charCodeAt(i2) <= 70) {
        n2 *= 16;
        n2 += s2.charCodeAt(i2) - ASCIIA + 10;
      } else {
        break;
      }
      if (n2 >= 16777215) {
        return {
          n: 0,
          c: i2,
          ok: false
        };
      }
    }
    if (i2 === 0) {
      return {
        n: 0,
        c: i2,
        ok: false
      };
    }
    return {
      n: n2,
      c: i2,
      ok: true
    };
  }
  function isIPV4OrHostname(hp) {
    if (hp.indexOf("[") !== -1 || hp.indexOf("::") !== -1) {
      return false;
    }
    if (hp.indexOf(".") !== -1) {
      return true;
    }
    if (hp.split(":").length <= 2) {
      return true;
    }
    return false;
  }
  function isIPV6(hp) {
    return !isIPV4OrHostname(hp);
  }
  function filterIpv6MappedToIpv4(hp) {
    const prefix = "::FFFF:";
    const idx = hp.toUpperCase().indexOf(prefix);
    if (idx !== -1 && hp.indexOf(".") !== -1) {
      let ip = hp.substring(idx + prefix.length);
      ip = ip.replace("[", "");
      return ip.replace("]", "");
    }
    return hp;
  }
  function hostPort(u2) {
    u2 = u2.trim();
    if (u2.match(/^(.*:\/\/)(.*)/m)) {
      u2 = u2.replace(/^(.*:\/\/)(.*)/gm, "$2");
    }
    u2 = filterIpv6MappedToIpv4(u2);
    if (isIPV6(u2) && u2.indexOf("[") === -1) {
      u2 = `[${u2}]`;
    }
    const op = isIPV6(u2) ? u2.match(/(]:)(\d+)/) : u2.match(/(:)(\d+)/);
    const port = op && op.length === 3 && op[1] && op[2] ? parseInt(op[2]) : 4222;
    const protocol = port === 80 ? "https" : "http";
    const url = new URL(`${protocol}://${u2}`);
    url.port = `${port}`;
    let hostname = url.hostname;
    if (hostname.charAt(0) === "[") {
      hostname = hostname.substring(1, hostname.length - 1);
    }
    const listen = url.host;
    return {
      listen,
      hostname,
      port
    };
  }
  var ServerImpl = class _ServerImpl {
    src;
    listen;
    hostname;
    port;
    didConnect;
    reconnects;
    lastConnect;
    gossiped;
    tlsName;
    resolves;
    constructor(u2, gossiped = false) {
      this.src = u2;
      this.tlsName = "";
      const v2 = hostPort(u2);
      this.listen = v2.listen;
      this.hostname = v2.hostname;
      this.port = v2.port;
      this.didConnect = false;
      this.reconnects = 0;
      this.lastConnect = 0;
      this.gossiped = gossiped;
    }
    toString() {
      return this.listen;
    }
    async resolve(opts) {
      if (!opts.fn || opts.resolve === false) {
        return [
          this
        ];
      }
      const buf = [];
      if (isIP(this.hostname)) {
        return [
          this
        ];
      } else {
        const ips = await opts.fn(this.hostname);
        if (opts.debug) {
          console.log(`resolve ${this.hostname} = ${ips.join(",")}`);
        }
        for (const ip of ips) {
          const proto = this.port === 80 ? "https" : "http";
          const url = new URL(`${proto}://${isIPV6(ip) ? "[" + ip + "]" : ip}`);
          url.port = `${this.port}`;
          const ss = new _ServerImpl(url.host, false);
          ss.tlsName = this.hostname;
          buf.push(ss);
        }
      }
      if (opts.randomize) {
        shuffle(buf);
      }
      this.resolves = buf;
      return buf;
    }
  };
  var Servers = class {
    firstSelect;
    servers;
    currentServer;
    tlsName;
    randomize;
    constructor(listens = [], opts = {}) {
      this.firstSelect = true;
      this.servers = [];
      this.tlsName = "";
      this.randomize = opts.randomize || false;
      const urlParseFn = getUrlParseFn();
      if (listens) {
        listens.forEach((hp) => {
          hp = urlParseFn ? urlParseFn(hp) : hp;
          this.servers.push(new ServerImpl(hp));
        });
        if (this.randomize) {
          this.servers = shuffle(this.servers);
        }
      }
      if (this.servers.length === 0) {
        this.addServer(`${DEFAULT_HOST}:${defaultPort()}`, false);
      }
      this.currentServer = this.servers[0];
    }
    clear() {
      this.servers.length = 0;
    }
    updateTLSName() {
      const cs = this.getCurrentServer();
      if (!isIP(cs.hostname)) {
        this.tlsName = cs.hostname;
        this.servers.forEach((s2) => {
          if (s2.gossiped) {
            s2.tlsName = this.tlsName;
          }
        });
      }
    }
    getCurrentServer() {
      return this.currentServer;
    }
    addServer(u2, implicit = false) {
      const urlParseFn = getUrlParseFn();
      u2 = urlParseFn ? urlParseFn(u2) : u2;
      const s2 = new ServerImpl(u2, implicit);
      if (isIP(s2.hostname)) {
        s2.tlsName = this.tlsName;
      }
      this.servers.push(s2);
    }
    selectServer() {
      if (this.firstSelect) {
        this.firstSelect = false;
        return this.currentServer;
      }
      const t2 = this.servers.shift();
      if (t2) {
        this.servers.push(t2);
        this.currentServer = t2;
      }
      return t2;
    }
    removeCurrentServer() {
      this.removeServer(this.currentServer);
    }
    removeServer(server) {
      if (server) {
        const index = this.servers.indexOf(server);
        this.servers.splice(index, 1);
      }
    }
    length() {
      return this.servers.length;
    }
    next() {
      return this.servers.length ? this.servers[0] : void 0;
    }
    getServers() {
      return this.servers;
    }
    update(info, encrypted) {
      const added = [];
      let deleted = [];
      const urlParseFn = getUrlParseFn();
      const discovered = /* @__PURE__ */ new Map();
      if (info.connect_urls && info.connect_urls.length > 0) {
        info.connect_urls.forEach((hp) => {
          hp = urlParseFn ? urlParseFn(hp, encrypted) : hp;
          const s2 = new ServerImpl(hp, true);
          discovered.set(hp, s2);
        });
      }
      const toDelete = [];
      this.servers.forEach((s2, index) => {
        const u2 = s2.listen;
        if (s2.gossiped && this.currentServer.listen !== u2 && discovered.get(u2) === void 0) {
          toDelete.push(index);
        }
        discovered.delete(u2);
      });
      toDelete.reverse();
      toDelete.forEach((index) => {
        const removed = this.servers.splice(index, 1);
        deleted = deleted.concat(removed[0].listen);
      });
      discovered.forEach((v2, k2) => {
        this.servers.push(v2);
        added.push(k2);
      });
      return {
        added,
        deleted
      };
    }
  };
  var MuxSubscription = class {
    baseInbox;
    reqs;
    constructor() {
      this.reqs = /* @__PURE__ */ new Map();
    }
    size() {
      return this.reqs.size;
    }
    init(prefix) {
      this.baseInbox = `${createInbox(prefix)}.`;
      return this.baseInbox;
    }
    add(r2) {
      if (!isNaN(r2.received)) {
        r2.received = 0;
      }
      this.reqs.set(r2.token, r2);
    }
    get(token) {
      return this.reqs.get(token);
    }
    cancel(r2) {
      this.reqs.delete(r2.token);
    }
    getToken(m2) {
      const s2 = m2.subject || "";
      if (s2.indexOf(this.baseInbox) === 0) {
        return s2.substring(this.baseInbox.length);
      }
      return null;
    }
    all() {
      return Array.from(this.reqs.values());
    }
    handleError(isMuxPermissionError, err) {
      if (err && err.permissionContext) {
        if (isMuxPermissionError) {
          this.all().forEach((r2) => {
            r2.resolver(err, {});
          });
          return true;
        }
        const ctx = err.permissionContext;
        if (ctx.operation === "publish") {
          const req = this.all().find((s2) => {
            return s2.requestSubject === ctx.subject;
          });
          if (req) {
            req.resolver(err, {});
            return true;
          }
        }
      }
      return false;
    }
    dispatcher() {
      return (err, m2) => {
        const token = this.getToken(m2);
        if (token) {
          const r2 = this.get(token);
          if (r2) {
            if (err === null && m2.headers) {
              err = isRequestError(m2);
            }
            r2.resolver(err, m2);
          }
        }
      };
    }
    close() {
      const err = NatsError.errorForCode(ErrorCode.Timeout);
      this.reqs.forEach((req) => {
        req.resolver(err, {});
      });
    }
  };
  var Heartbeat = class {
    ph;
    interval;
    maxOut;
    timer;
    pendings;
    constructor(ph, interval, maxOut) {
      this.ph = ph;
      this.interval = interval;
      this.maxOut = maxOut;
      this.pendings = [];
    }
    start() {
      this.cancel();
      this._schedule();
    }
    cancel(stale) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = void 0;
      }
      this._reset();
      if (stale) {
        this.ph.disconnect();
      }
    }
    _schedule() {
      this.timer = setTimeout(() => {
        this.ph.dispatchStatus({
          type: DebugEvents.PingTimer,
          data: `${this.pendings.length + 1}`
        });
        if (this.pendings.length === this.maxOut) {
          this.cancel(true);
          return;
        }
        const ping = deferred();
        this.ph.flush(ping).then(() => {
          this._reset();
        }).catch(() => {
          this.cancel();
        });
        this.pendings.push(ping);
        this._schedule();
      }, this.interval);
    }
    _reset() {
      this.pendings = this.pendings.filter((p2) => {
        const d2 = p2;
        d2.resolve();
        return false;
      });
    }
  };
  var AssertionError = class extends Error {
    constructor(msg) {
      super(msg);
      this.name = "AssertionError";
    }
  };
  function assert(cond, msg = "Assertion failed.") {
    if (!cond) {
      throw new AssertionError(msg);
    }
  }
  var MIN_READ = 32 * 1024;
  var MAX_SIZE = 2 ** 32 - 2;
  function copy(src, dst, off = 0) {
    const r2 = dst.byteLength - off;
    if (src.byteLength > r2) {
      src = src.subarray(0, r2);
    }
    dst.set(src, off);
    return src.byteLength;
  }
  var DenoBuffer = class {
    _buf;
    _off;
    constructor(ab) {
      this._off = 0;
      if (ab == null) {
        this._buf = new Uint8Array(0);
        return;
      }
      this._buf = new Uint8Array(ab);
    }
    bytes(options = {
      copy: true
    }) {
      if (options.copy === false) return this._buf.subarray(this._off);
      return this._buf.slice(this._off);
    }
    empty() {
      return this._buf.byteLength <= this._off;
    }
    get length() {
      return this._buf.byteLength - this._off;
    }
    get capacity() {
      return this._buf.buffer.byteLength;
    }
    truncate(n2) {
      if (n2 === 0) {
        this.reset();
        return;
      }
      if (n2 < 0 || n2 > this.length) {
        throw Error("bytes.Buffer: truncation out of range");
      }
      this._reslice(this._off + n2);
    }
    reset() {
      this._reslice(0);
      this._off = 0;
    }
    _tryGrowByReslice(n2) {
      const l2 = this._buf.byteLength;
      if (n2 <= this.capacity - l2) {
        this._reslice(l2 + n2);
        return l2;
      }
      return -1;
    }
    _reslice(len) {
      assert(len <= this._buf.buffer.byteLength);
      this._buf = new Uint8Array(this._buf.buffer, 0, len);
    }
    readByte() {
      const a2 = new Uint8Array(1);
      if (this.read(a2)) {
        return a2[0];
      }
      return null;
    }
    read(p2) {
      if (this.empty()) {
        this.reset();
        if (p2.byteLength === 0) {
          return 0;
        }
        return null;
      }
      const nread = copy(this._buf.subarray(this._off), p2);
      this._off += nread;
      return nread;
    }
    writeByte(n2) {
      return this.write(Uint8Array.of(n2));
    }
    writeString(s2) {
      return this.write(TE.encode(s2));
    }
    write(p2) {
      const m2 = this._grow(p2.byteLength);
      return copy(p2, this._buf, m2);
    }
    _grow(n2) {
      const m2 = this.length;
      if (m2 === 0 && this._off !== 0) {
        this.reset();
      }
      const i2 = this._tryGrowByReslice(n2);
      if (i2 >= 0) {
        return i2;
      }
      const c2 = this.capacity;
      if (n2 <= Math.floor(c2 / 2) - m2) {
        copy(this._buf.subarray(this._off), this._buf);
      } else if (c2 + n2 > MAX_SIZE) {
        throw new Error("The buffer cannot be grown beyond the maximum size.");
      } else {
        const buf = new Uint8Array(Math.min(2 * c2 + n2, MAX_SIZE));
        copy(this._buf.subarray(this._off), buf);
        this._buf = buf;
      }
      this._off = 0;
      this._reslice(Math.min(m2 + n2, MAX_SIZE));
      return m2;
    }
    grow(n2) {
      if (n2 < 0) {
        throw Error("Buffer._grow: negative count");
      }
      const m2 = this._grow(n2);
      this._reslice(m2);
    }
    readFrom(r2) {
      let n2 = 0;
      const tmp = new Uint8Array(MIN_READ);
      while (true) {
        const shouldGrow = this.capacity - this.length < MIN_READ;
        const buf = shouldGrow ? tmp : new Uint8Array(this._buf.buffer, this.length);
        const nread = r2.read(buf);
        if (nread === null) {
          return n2;
        }
        if (shouldGrow) this.write(buf.subarray(0, nread));
        else this._reslice(this.length + nread);
        n2 += nread;
      }
    }
  };
  var Kind;
  (function(Kind2) {
    Kind2[Kind2["OK"] = 0] = "OK";
    Kind2[Kind2["ERR"] = 1] = "ERR";
    Kind2[Kind2["MSG"] = 2] = "MSG";
    Kind2[Kind2["INFO"] = 3] = "INFO";
    Kind2[Kind2["PING"] = 4] = "PING";
    Kind2[Kind2["PONG"] = 5] = "PONG";
  })(Kind || (Kind = {}));
  function newMsgArg() {
    const ma = {};
    ma.sid = -1;
    ma.hdr = -1;
    ma.size = -1;
    return ma;
  }
  var ASCII_0 = 48;
  var Parser = class {
    dispatcher;
    state;
    as;
    drop;
    hdr;
    ma;
    argBuf;
    msgBuf;
    constructor(dispatcher) {
      this.dispatcher = dispatcher;
      this.state = State.OP_START;
      this.as = 0;
      this.drop = 0;
      this.hdr = 0;
    }
    parse(buf) {
      let i2;
      for (i2 = 0; i2 < buf.length; i2++) {
        const b2 = buf[i2];
        switch (this.state) {
          case State.OP_START:
            switch (b2) {
              case cc.M:
              case cc.m:
                this.state = State.OP_M;
                this.hdr = -1;
                this.ma = newMsgArg();
                break;
              case cc.H:
              case cc.h:
                this.state = State.OP_H;
                this.hdr = 0;
                this.ma = newMsgArg();
                break;
              case cc.P:
              case cc.p:
                this.state = State.OP_P;
                break;
              case cc.PLUS:
                this.state = State.OP_PLUS;
                break;
              case cc.MINUS:
                this.state = State.OP_MINUS;
                break;
              case cc.I:
              case cc.i:
                this.state = State.OP_I;
                break;
              default:
                throw this.fail(buf.subarray(i2));
            }
            break;
          case State.OP_H:
            switch (b2) {
              case cc.M:
              case cc.m:
                this.state = State.OP_M;
                break;
              default:
                throw this.fail(buf.subarray(i2));
            }
            break;
          case State.OP_M:
            switch (b2) {
              case cc.S:
              case cc.s:
                this.state = State.OP_MS;
                break;
              default:
                throw this.fail(buf.subarray(i2));
            }
            break;
          case State.OP_MS:
            switch (b2) {
              case cc.G:
              case cc.g:
                this.state = State.OP_MSG;
                break;
              default:
                throw this.fail(buf.subarray(i2));
            }
            break;
          case State.OP_MSG:
            switch (b2) {
              case cc.SPACE:
              case cc.TAB:
                this.state = State.OP_MSG_SPC;
                break;
              default:
                throw this.fail(buf.subarray(i2));
            }
            break;
          case State.OP_MSG_SPC:
            switch (b2) {
              case cc.SPACE:
              case cc.TAB:
                continue;
              default:
                this.state = State.MSG_ARG;
                this.as = i2;
            }
            break;
          case State.MSG_ARG:
            switch (b2) {
              case cc.CR:
                this.drop = 1;
                break;
              case cc.NL: {
                const arg = this.argBuf ? this.argBuf.bytes() : buf.subarray(this.as, i2 - this.drop);
                this.processMsgArgs(arg);
                this.drop = 0;
                this.as = i2 + 1;
                this.state = State.MSG_PAYLOAD;
                i2 = this.as + this.ma.size - 1;
                break;
              }
              default:
                if (this.argBuf) {
                  this.argBuf.writeByte(b2);
                }
            }
            break;
          case State.MSG_PAYLOAD:
            if (this.msgBuf) {
              if (this.msgBuf.length >= this.ma.size) {
                const data = this.msgBuf.bytes({
                  copy: false
                });
                this.dispatcher.push({
                  kind: Kind.MSG,
                  msg: this.ma,
                  data
                });
                this.argBuf = void 0;
                this.msgBuf = void 0;
                this.state = State.MSG_END;
              } else {
                let toCopy = this.ma.size - this.msgBuf.length;
                const avail = buf.length - i2;
                if (avail < toCopy) {
                  toCopy = avail;
                }
                if (toCopy > 0) {
                  this.msgBuf.write(buf.subarray(i2, i2 + toCopy));
                  i2 = i2 + toCopy - 1;
                } else {
                  this.msgBuf.writeByte(b2);
                }
              }
            } else if (i2 - this.as >= this.ma.size) {
              this.dispatcher.push({
                kind: Kind.MSG,
                msg: this.ma,
                data: buf.subarray(this.as, i2)
              });
              this.argBuf = void 0;
              this.msgBuf = void 0;
              this.state = State.MSG_END;
            }
            break;
          case State.MSG_END:
            switch (b2) {
              case cc.NL:
                this.drop = 0;
                this.as = i2 + 1;
                this.state = State.OP_START;
                break;
              default:
                continue;
            }
            break;
          case State.OP_PLUS:
            switch (b2) {
              case cc.O:
              case cc.o:
                this.state = State.OP_PLUS_O;
                break;
              default:
                throw this.fail(buf.subarray(i2));
            }
            break;
          case State.OP_PLUS_O:
            switch (b2) {
              case cc.K:
              case cc.k:
                this.state = State.OP_PLUS_OK;
                break;
              default:
                throw this.fail(buf.subarray(i2));
            }
            break;
          case State.OP_PLUS_OK:
            switch (b2) {
              case cc.NL:
                this.dispatcher.push({
                  kind: Kind.OK
                });
                this.drop = 0;
                this.state = State.OP_START;
                break;
            }
            break;
          case State.OP_MINUS:
            switch (b2) {
              case cc.E:
              case cc.e:
                this.state = State.OP_MINUS_E;
                break;
              default:
                throw this.fail(buf.subarray(i2));
            }
            break;
          case State.OP_MINUS_E:
            switch (b2) {
              case cc.R:
              case cc.r:
                this.state = State.OP_MINUS_ER;
                break;
              default:
                throw this.fail(buf.subarray(i2));
            }
            break;
          case State.OP_MINUS_ER:
            switch (b2) {
              case cc.R:
              case cc.r:
                this.state = State.OP_MINUS_ERR;
                break;
              default:
                throw this.fail(buf.subarray(i2));
            }
            break;
          case State.OP_MINUS_ERR:
            switch (b2) {
              case cc.SPACE:
              case cc.TAB:
                this.state = State.OP_MINUS_ERR_SPC;
                break;
              default:
                throw this.fail(buf.subarray(i2));
            }
            break;
          case State.OP_MINUS_ERR_SPC:
            switch (b2) {
              case cc.SPACE:
              case cc.TAB:
                continue;
              default:
                this.state = State.MINUS_ERR_ARG;
                this.as = i2;
            }
            break;
          case State.MINUS_ERR_ARG:
            switch (b2) {
              case cc.CR:
                this.drop = 1;
                break;
              case cc.NL: {
                let arg;
                if (this.argBuf) {
                  arg = this.argBuf.bytes();
                  this.argBuf = void 0;
                } else {
                  arg = buf.subarray(this.as, i2 - this.drop);
                }
                this.dispatcher.push({
                  kind: Kind.ERR,
                  data: arg
                });
                this.drop = 0;
                this.as = i2 + 1;
                this.state = State.OP_START;
                break;
              }
              default:
                if (this.argBuf) {
                  this.argBuf.write(Uint8Array.of(b2));
                }
            }
            break;
          case State.OP_P:
            switch (b2) {
              case cc.I:
              case cc.i:
                this.state = State.OP_PI;
                break;
              case cc.O:
              case cc.o:
                this.state = State.OP_PO;
                break;
              default:
                throw this.fail(buf.subarray(i2));
            }
            break;
          case State.OP_PO:
            switch (b2) {
              case cc.N:
              case cc.n:
                this.state = State.OP_PON;
                break;
              default:
                throw this.fail(buf.subarray(i2));
            }
            break;
          case State.OP_PON:
            switch (b2) {
              case cc.G:
              case cc.g:
                this.state = State.OP_PONG;
                break;
              default:
                throw this.fail(buf.subarray(i2));
            }
            break;
          case State.OP_PONG:
            switch (b2) {
              case cc.NL:
                this.dispatcher.push({
                  kind: Kind.PONG
                });
                this.drop = 0;
                this.state = State.OP_START;
                break;
            }
            break;
          case State.OP_PI:
            switch (b2) {
              case cc.N:
              case cc.n:
                this.state = State.OP_PIN;
                break;
              default:
                throw this.fail(buf.subarray(i2));
            }
            break;
          case State.OP_PIN:
            switch (b2) {
              case cc.G:
              case cc.g:
                this.state = State.OP_PING;
                break;
              default:
                throw this.fail(buf.subarray(i2));
            }
            break;
          case State.OP_PING:
            switch (b2) {
              case cc.NL:
                this.dispatcher.push({
                  kind: Kind.PING
                });
                this.drop = 0;
                this.state = State.OP_START;
                break;
            }
            break;
          case State.OP_I:
            switch (b2) {
              case cc.N:
              case cc.n:
                this.state = State.OP_IN;
                break;
              default:
                throw this.fail(buf.subarray(i2));
            }
            break;
          case State.OP_IN:
            switch (b2) {
              case cc.F:
              case cc.f:
                this.state = State.OP_INF;
                break;
              default:
                throw this.fail(buf.subarray(i2));
            }
            break;
          case State.OP_INF:
            switch (b2) {
              case cc.O:
              case cc.o:
                this.state = State.OP_INFO;
                break;
              default:
                throw this.fail(buf.subarray(i2));
            }
            break;
          case State.OP_INFO:
            switch (b2) {
              case cc.SPACE:
              case cc.TAB:
                this.state = State.OP_INFO_SPC;
                break;
              default:
                throw this.fail(buf.subarray(i2));
            }
            break;
          case State.OP_INFO_SPC:
            switch (b2) {
              case cc.SPACE:
              case cc.TAB:
                continue;
              default:
                this.state = State.INFO_ARG;
                this.as = i2;
            }
            break;
          case State.INFO_ARG:
            switch (b2) {
              case cc.CR:
                this.drop = 1;
                break;
              case cc.NL: {
                let arg;
                if (this.argBuf) {
                  arg = this.argBuf.bytes();
                  this.argBuf = void 0;
                } else {
                  arg = buf.subarray(this.as, i2 - this.drop);
                }
                this.dispatcher.push({
                  kind: Kind.INFO,
                  data: arg
                });
                this.drop = 0;
                this.as = i2 + 1;
                this.state = State.OP_START;
                break;
              }
              default:
                if (this.argBuf) {
                  this.argBuf.writeByte(b2);
                }
            }
            break;
          default:
            throw this.fail(buf.subarray(i2));
        }
      }
      if ((this.state === State.MSG_ARG || this.state === State.MINUS_ERR_ARG || this.state === State.INFO_ARG) && !this.argBuf) {
        this.argBuf = new DenoBuffer(buf.subarray(this.as, i2 - this.drop));
      }
      if (this.state === State.MSG_PAYLOAD && !this.msgBuf) {
        if (!this.argBuf) {
          this.cloneMsgArg();
        }
        this.msgBuf = new DenoBuffer(buf.subarray(this.as));
      }
    }
    cloneMsgArg() {
      const s2 = this.ma.subject.length;
      const r2 = this.ma.reply ? this.ma.reply.length : 0;
      const buf = new Uint8Array(s2 + r2);
      buf.set(this.ma.subject);
      if (this.ma.reply) {
        buf.set(this.ma.reply, s2);
      }
      this.argBuf = new DenoBuffer(buf);
      this.ma.subject = buf.subarray(0, s2);
      if (this.ma.reply) {
        this.ma.reply = buf.subarray(s2);
      }
    }
    processMsgArgs(arg) {
      if (this.hdr >= 0) {
        return this.processHeaderMsgArgs(arg);
      }
      const args = [];
      let start = -1;
      for (let i2 = 0; i2 < arg.length; i2++) {
        const b2 = arg[i2];
        switch (b2) {
          case cc.SPACE:
          case cc.TAB:
          case cc.CR:
          case cc.NL:
            if (start >= 0) {
              args.push(arg.subarray(start, i2));
              start = -1;
            }
            break;
          default:
            if (start < 0) {
              start = i2;
            }
        }
      }
      if (start >= 0) {
        args.push(arg.subarray(start));
      }
      switch (args.length) {
        case 3:
          this.ma.subject = args[0];
          this.ma.sid = this.protoParseInt(args[1]);
          this.ma.reply = void 0;
          this.ma.size = this.protoParseInt(args[2]);
          break;
        case 4:
          this.ma.subject = args[0];
          this.ma.sid = this.protoParseInt(args[1]);
          this.ma.reply = args[2];
          this.ma.size = this.protoParseInt(args[3]);
          break;
        default:
          throw this.fail(arg, "processMsgArgs Parse Error");
      }
      if (this.ma.sid < 0) {
        throw this.fail(arg, "processMsgArgs Bad or Missing Sid Error");
      }
      if (this.ma.size < 0) {
        throw this.fail(arg, "processMsgArgs Bad or Missing Size Error");
      }
    }
    fail(data, label = "") {
      if (!label) {
        label = `parse error [${this.state}]`;
      } else {
        label = `${label} [${this.state}]`;
      }
      return new Error(`${label}: ${TD.decode(data)}`);
    }
    processHeaderMsgArgs(arg) {
      const args = [];
      let start = -1;
      for (let i2 = 0; i2 < arg.length; i2++) {
        const b2 = arg[i2];
        switch (b2) {
          case cc.SPACE:
          case cc.TAB:
          case cc.CR:
          case cc.NL:
            if (start >= 0) {
              args.push(arg.subarray(start, i2));
              start = -1;
            }
            break;
          default:
            if (start < 0) {
              start = i2;
            }
        }
      }
      if (start >= 0) {
        args.push(arg.subarray(start));
      }
      switch (args.length) {
        case 4:
          this.ma.subject = args[0];
          this.ma.sid = this.protoParseInt(args[1]);
          this.ma.reply = void 0;
          this.ma.hdr = this.protoParseInt(args[2]);
          this.ma.size = this.protoParseInt(args[3]);
          break;
        case 5:
          this.ma.subject = args[0];
          this.ma.sid = this.protoParseInt(args[1]);
          this.ma.reply = args[2];
          this.ma.hdr = this.protoParseInt(args[3]);
          this.ma.size = this.protoParseInt(args[4]);
          break;
        default:
          throw this.fail(arg, "processHeaderMsgArgs Parse Error");
      }
      if (this.ma.sid < 0) {
        throw this.fail(arg, "processHeaderMsgArgs Bad or Missing Sid Error");
      }
      if (this.ma.hdr < 0 || this.ma.hdr > this.ma.size) {
        throw this.fail(arg, "processHeaderMsgArgs Bad or Missing Header Size Error");
      }
      if (this.ma.size < 0) {
        throw this.fail(arg, "processHeaderMsgArgs Bad or Missing Size Error");
      }
    }
    protoParseInt(a2) {
      if (a2.length === 0) {
        return -1;
      }
      let n2 = 0;
      for (let i2 = 0; i2 < a2.length; i2++) {
        if (a2[i2] < 48 || a2[i2] > 57) {
          return -1;
        }
        n2 = n2 * 10 + (a2[i2] - ASCII_0);
      }
      return n2;
    }
  };
  var State;
  (function(State2) {
    State2[State2["OP_START"] = 0] = "OP_START";
    State2[State2["OP_PLUS"] = 1] = "OP_PLUS";
    State2[State2["OP_PLUS_O"] = 2] = "OP_PLUS_O";
    State2[State2["OP_PLUS_OK"] = 3] = "OP_PLUS_OK";
    State2[State2["OP_MINUS"] = 4] = "OP_MINUS";
    State2[State2["OP_MINUS_E"] = 5] = "OP_MINUS_E";
    State2[State2["OP_MINUS_ER"] = 6] = "OP_MINUS_ER";
    State2[State2["OP_MINUS_ERR"] = 7] = "OP_MINUS_ERR";
    State2[State2["OP_MINUS_ERR_SPC"] = 8] = "OP_MINUS_ERR_SPC";
    State2[State2["MINUS_ERR_ARG"] = 9] = "MINUS_ERR_ARG";
    State2[State2["OP_M"] = 10] = "OP_M";
    State2[State2["OP_MS"] = 11] = "OP_MS";
    State2[State2["OP_MSG"] = 12] = "OP_MSG";
    State2[State2["OP_MSG_SPC"] = 13] = "OP_MSG_SPC";
    State2[State2["MSG_ARG"] = 14] = "MSG_ARG";
    State2[State2["MSG_PAYLOAD"] = 15] = "MSG_PAYLOAD";
    State2[State2["MSG_END"] = 16] = "MSG_END";
    State2[State2["OP_H"] = 17] = "OP_H";
    State2[State2["OP_P"] = 18] = "OP_P";
    State2[State2["OP_PI"] = 19] = "OP_PI";
    State2[State2["OP_PIN"] = 20] = "OP_PIN";
    State2[State2["OP_PING"] = 21] = "OP_PING";
    State2[State2["OP_PO"] = 22] = "OP_PO";
    State2[State2["OP_PON"] = 23] = "OP_PON";
    State2[State2["OP_PONG"] = 24] = "OP_PONG";
    State2[State2["OP_I"] = 25] = "OP_I";
    State2[State2["OP_IN"] = 26] = "OP_IN";
    State2[State2["OP_INF"] = 27] = "OP_INF";
    State2[State2["OP_INFO"] = 28] = "OP_INFO";
    State2[State2["OP_INFO_SPC"] = 29] = "OP_INFO_SPC";
    State2[State2["INFO_ARG"] = 30] = "INFO_ARG";
  })(State || (State = {}));
  var cc;
  (function(cc2) {
    cc2[cc2["CR"] = "\r".charCodeAt(0)] = "CR";
    cc2[cc2["E"] = "E".charCodeAt(0)] = "E";
    cc2[cc2["e"] = "e".charCodeAt(0)] = "e";
    cc2[cc2["F"] = "F".charCodeAt(0)] = "F";
    cc2[cc2["f"] = "f".charCodeAt(0)] = "f";
    cc2[cc2["G"] = "G".charCodeAt(0)] = "G";
    cc2[cc2["g"] = "g".charCodeAt(0)] = "g";
    cc2[cc2["H"] = "H".charCodeAt(0)] = "H";
    cc2[cc2["h"] = "h".charCodeAt(0)] = "h";
    cc2[cc2["I"] = "I".charCodeAt(0)] = "I";
    cc2[cc2["i"] = "i".charCodeAt(0)] = "i";
    cc2[cc2["K"] = "K".charCodeAt(0)] = "K";
    cc2[cc2["k"] = "k".charCodeAt(0)] = "k";
    cc2[cc2["M"] = "M".charCodeAt(0)] = "M";
    cc2[cc2["m"] = "m".charCodeAt(0)] = "m";
    cc2[cc2["MINUS"] = "-".charCodeAt(0)] = "MINUS";
    cc2[cc2["N"] = "N".charCodeAt(0)] = "N";
    cc2[cc2["n"] = "n".charCodeAt(0)] = "n";
    cc2[cc2["NL"] = "\n".charCodeAt(0)] = "NL";
    cc2[cc2["O"] = "O".charCodeAt(0)] = "O";
    cc2[cc2["o"] = "o".charCodeAt(0)] = "o";
    cc2[cc2["P"] = "P".charCodeAt(0)] = "P";
    cc2[cc2["p"] = "p".charCodeAt(0)] = "p";
    cc2[cc2["PLUS"] = "+".charCodeAt(0)] = "PLUS";
    cc2[cc2["R"] = "R".charCodeAt(0)] = "R";
    cc2[cc2["r"] = "r".charCodeAt(0)] = "r";
    cc2[cc2["S"] = "S".charCodeAt(0)] = "S";
    cc2[cc2["s"] = "s".charCodeAt(0)] = "s";
    cc2[cc2["SPACE"] = " ".charCodeAt(0)] = "SPACE";
    cc2[cc2["TAB"] = "	".charCodeAt(0)] = "TAB";
  })(cc || (cc = {}));
  (function(nacl2) {
    "use strict";
    var u64 = function(h2, l2) {
      this.hi = h2 | 0 >>> 0;
      this.lo = l2 | 0 >>> 0;
    };
    var gf = function(init) {
      var i2, r2 = new Float64Array(16);
      if (init) for (i2 = 0; i2 < init.length; i2++) r2[i2] = init[i2];
      return r2;
    };
    var randombytes = function() {
      throw new Error("no PRNG");
    };
    var _0 = new Uint8Array(16);
    var _9 = new Uint8Array(32);
    _9[0] = 9;
    var gf0 = gf(), gf1 = gf([
      1
    ]), _121665 = gf([
      56129,
      1
    ]), D = gf([
      30883,
      4953,
      19914,
      30187,
      55467,
      16705,
      2637,
      112,
      59544,
      30585,
      16505,
      36039,
      65139,
      11119,
      27886,
      20995
    ]), D2 = gf([
      61785,
      9906,
      39828,
      60374,
      45398,
      33411,
      5274,
      224,
      53552,
      61171,
      33010,
      6542,
      64743,
      22239,
      55772,
      9222
    ]), X = gf([
      54554,
      36645,
      11616,
      51542,
      42930,
      38181,
      51040,
      26924,
      56412,
      64982,
      57905,
      49316,
      21502,
      52590,
      14035,
      8553
    ]), Y = gf([
      26200,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214,
      26214
    ]), I = gf([
      41136,
      18958,
      6951,
      50414,
      58488,
      44335,
      6150,
      12099,
      55207,
      15867,
      153,
      11085,
      57099,
      20417,
      9344,
      11139
    ]);
    function L32(x2, c2) {
      return x2 << c2 | x2 >>> 32 - c2;
    }
    function ld32(x2, i2) {
      var u2 = x2[i2 + 3] & 255;
      u2 = u2 << 8 | x2[i2 + 2] & 255;
      u2 = u2 << 8 | x2[i2 + 1] & 255;
      return u2 << 8 | x2[i2 + 0] & 255;
    }
    function dl64(x2, i2) {
      var h2 = x2[i2] << 24 | x2[i2 + 1] << 16 | x2[i2 + 2] << 8 | x2[i2 + 3];
      var l2 = x2[i2 + 4] << 24 | x2[i2 + 5] << 16 | x2[i2 + 6] << 8 | x2[i2 + 7];
      return new u64(h2, l2);
    }
    function st32(x2, j2, u2) {
      var i2;
      for (i2 = 0; i2 < 4; i2++) {
        x2[j2 + i2] = u2 & 255;
        u2 >>>= 8;
      }
    }
    function ts64(x2, i2, u2) {
      x2[i2] = u2.hi >> 24 & 255;
      x2[i2 + 1] = u2.hi >> 16 & 255;
      x2[i2 + 2] = u2.hi >> 8 & 255;
      x2[i2 + 3] = u2.hi & 255;
      x2[i2 + 4] = u2.lo >> 24 & 255;
      x2[i2 + 5] = u2.lo >> 16 & 255;
      x2[i2 + 6] = u2.lo >> 8 & 255;
      x2[i2 + 7] = u2.lo & 255;
    }
    function vn(x2, xi, y2, yi, n2) {
      var i2, d2 = 0;
      for (i2 = 0; i2 < n2; i2++) d2 |= x2[xi + i2] ^ y2[yi + i2];
      return (1 & d2 - 1 >>> 8) - 1;
    }
    function crypto_verify_16(x2, xi, y2, yi) {
      return vn(x2, xi, y2, yi, 16);
    }
    function crypto_verify_32(x2, xi, y2, yi) {
      return vn(x2, xi, y2, yi, 32);
    }
    function core(out, inp, k2, c2, h2) {
      var w2 = new Uint32Array(16), x2 = new Uint32Array(16), y2 = new Uint32Array(16), t2 = new Uint32Array(4);
      var i2, j2, m2;
      for (i2 = 0; i2 < 4; i2++) {
        x2[5 * i2] = ld32(c2, 4 * i2);
        x2[1 + i2] = ld32(k2, 4 * i2);
        x2[6 + i2] = ld32(inp, 4 * i2);
        x2[11 + i2] = ld32(k2, 16 + 4 * i2);
      }
      for (i2 = 0; i2 < 16; i2++) y2[i2] = x2[i2];
      for (i2 = 0; i2 < 20; i2++) {
        for (j2 = 0; j2 < 4; j2++) {
          for (m2 = 0; m2 < 4; m2++) t2[m2] = x2[(5 * j2 + 4 * m2) % 16];
          t2[1] ^= L32(t2[0] + t2[3] | 0, 7);
          t2[2] ^= L32(t2[1] + t2[0] | 0, 9);
          t2[3] ^= L32(t2[2] + t2[1] | 0, 13);
          t2[0] ^= L32(t2[3] + t2[2] | 0, 18);
          for (m2 = 0; m2 < 4; m2++) w2[4 * j2 + (j2 + m2) % 4] = t2[m2];
        }
        for (m2 = 0; m2 < 16; m2++) x2[m2] = w2[m2];
      }
      if (h2) {
        for (i2 = 0; i2 < 16; i2++) x2[i2] = x2[i2] + y2[i2] | 0;
        for (i2 = 0; i2 < 4; i2++) {
          x2[5 * i2] = x2[5 * i2] - ld32(c2, 4 * i2) | 0;
          x2[6 + i2] = x2[6 + i2] - ld32(inp, 4 * i2) | 0;
        }
        for (i2 = 0; i2 < 4; i2++) {
          st32(out, 4 * i2, x2[5 * i2]);
          st32(out, 16 + 4 * i2, x2[6 + i2]);
        }
      } else {
        for (i2 = 0; i2 < 16; i2++) st32(out, 4 * i2, x2[i2] + y2[i2] | 0);
      }
    }
    function crypto_core_salsa20(out, inp, k2, c2) {
      core(out, inp, k2, c2, false);
      return 0;
    }
    function crypto_core_hsalsa20(out, inp, k2, c2) {
      core(out, inp, k2, c2, true);
      return 0;
    }
    var sigma = new Uint8Array([
      101,
      120,
      112,
      97,
      110,
      100,
      32,
      51,
      50,
      45,
      98,
      121,
      116,
      101,
      32,
      107
    ]);
    function crypto_stream_salsa20_xor(c2, cpos, m2, mpos, b2, n2, k2) {
      var z2 = new Uint8Array(16), x2 = new Uint8Array(64);
      var u2, i2;
      if (!b2) return 0;
      for (i2 = 0; i2 < 16; i2++) z2[i2] = 0;
      for (i2 = 0; i2 < 8; i2++) z2[i2] = n2[i2];
      while (b2 >= 64) {
        crypto_core_salsa20(x2, z2, k2, sigma);
        for (i2 = 0; i2 < 64; i2++) c2[cpos + i2] = (m2 ? m2[mpos + i2] : 0) ^ x2[i2];
        u2 = 1;
        for (i2 = 8; i2 < 16; i2++) {
          u2 = u2 + (z2[i2] & 255) | 0;
          z2[i2] = u2 & 255;
          u2 >>>= 8;
        }
        b2 -= 64;
        cpos += 64;
        if (m2) mpos += 64;
      }
      if (b2 > 0) {
        crypto_core_salsa20(x2, z2, k2, sigma);
        for (i2 = 0; i2 < b2; i2++) c2[cpos + i2] = (m2 ? m2[mpos + i2] : 0) ^ x2[i2];
      }
      return 0;
    }
    function crypto_stream_salsa20(c2, cpos, d2, n2, k2) {
      return crypto_stream_salsa20_xor(c2, cpos, null, 0, d2, n2, k2);
    }
    function crypto_stream(c2, cpos, d2, n2, k2) {
      var s2 = new Uint8Array(32);
      crypto_core_hsalsa20(s2, n2, k2, sigma);
      return crypto_stream_salsa20(c2, cpos, d2, n2.subarray(16), s2);
    }
    function crypto_stream_xor(c2, cpos, m2, mpos, d2, n2, k2) {
      var s2 = new Uint8Array(32);
      crypto_core_hsalsa20(s2, n2, k2, sigma);
      return crypto_stream_salsa20_xor(c2, cpos, m2, mpos, d2, n2.subarray(16), s2);
    }
    function add1305(h2, c2) {
      var j2, u2 = 0;
      for (j2 = 0; j2 < 17; j2++) {
        u2 = u2 + (h2[j2] + c2[j2] | 0) | 0;
        h2[j2] = u2 & 255;
        u2 >>>= 8;
      }
    }
    var minusp = new Uint32Array([
      5,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      252
    ]);
    function crypto_onetimeauth(out, outpos, m2, mpos, n2, k2) {
      var s2, i2, j2, u2;
      var x2 = new Uint32Array(17), r2 = new Uint32Array(17), h2 = new Uint32Array(17), c2 = new Uint32Array(17), g2 = new Uint32Array(17);
      for (j2 = 0; j2 < 17; j2++) r2[j2] = h2[j2] = 0;
      for (j2 = 0; j2 < 16; j2++) r2[j2] = k2[j2];
      r2[3] &= 15;
      r2[4] &= 252;
      r2[7] &= 15;
      r2[8] &= 252;
      r2[11] &= 15;
      r2[12] &= 252;
      r2[15] &= 15;
      while (n2 > 0) {
        for (j2 = 0; j2 < 17; j2++) c2[j2] = 0;
        for (j2 = 0; j2 < 16 && j2 < n2; ++j2) c2[j2] = m2[mpos + j2];
        c2[j2] = 1;
        mpos += j2;
        n2 -= j2;
        add1305(h2, c2);
        for (i2 = 0; i2 < 17; i2++) {
          x2[i2] = 0;
          for (j2 = 0; j2 < 17; j2++) x2[i2] = x2[i2] + h2[j2] * (j2 <= i2 ? r2[i2 - j2] : 320 * r2[i2 + 17 - j2] | 0) | 0 | 0;
        }
        for (i2 = 0; i2 < 17; i2++) h2[i2] = x2[i2];
        u2 = 0;
        for (j2 = 0; j2 < 16; j2++) {
          u2 = u2 + h2[j2] | 0;
          h2[j2] = u2 & 255;
          u2 >>>= 8;
        }
        u2 = u2 + h2[16] | 0;
        h2[16] = u2 & 3;
        u2 = 5 * (u2 >>> 2) | 0;
        for (j2 = 0; j2 < 16; j2++) {
          u2 = u2 + h2[j2] | 0;
          h2[j2] = u2 & 255;
          u2 >>>= 8;
        }
        u2 = u2 + h2[16] | 0;
        h2[16] = u2;
      }
      for (j2 = 0; j2 < 17; j2++) g2[j2] = h2[j2];
      add1305(h2, minusp);
      s2 = -(h2[16] >>> 7) | 0;
      for (j2 = 0; j2 < 17; j2++) h2[j2] ^= s2 & (g2[j2] ^ h2[j2]);
      for (j2 = 0; j2 < 16; j2++) c2[j2] = k2[j2 + 16];
      c2[16] = 0;
      add1305(h2, c2);
      for (j2 = 0; j2 < 16; j2++) out[outpos + j2] = h2[j2];
      return 0;
    }
    function crypto_onetimeauth_verify(h2, hpos, m2, mpos, n2, k2) {
      var x2 = new Uint8Array(16);
      crypto_onetimeauth(x2, 0, m2, mpos, n2, k2);
      return crypto_verify_16(h2, hpos, x2, 0);
    }
    function crypto_secretbox(c2, m2, d2, n2, k2) {
      var i2;
      if (d2 < 32) return -1;
      crypto_stream_xor(c2, 0, m2, 0, d2, n2, k2);
      crypto_onetimeauth(c2, 16, c2, 32, d2 - 32, c2);
      for (i2 = 0; i2 < 16; i2++) c2[i2] = 0;
      return 0;
    }
    function crypto_secretbox_open(m2, c2, d2, n2, k2) {
      var i2;
      var x2 = new Uint8Array(32);
      if (d2 < 32) return -1;
      crypto_stream(x2, 0, 32, n2, k2);
      if (crypto_onetimeauth_verify(c2, 16, c2, 32, d2 - 32, x2) !== 0) return -1;
      crypto_stream_xor(m2, 0, c2, 0, d2, n2, k2);
      for (i2 = 0; i2 < 32; i2++) m2[i2] = 0;
      return 0;
    }
    function set25519(r2, a2) {
      var i2;
      for (i2 = 0; i2 < 16; i2++) r2[i2] = a2[i2] | 0;
    }
    function car25519(o2) {
      var c2;
      var i2;
      for (i2 = 0; i2 < 16; i2++) {
        o2[i2] += 65536;
        c2 = Math.floor(o2[i2] / 65536);
        o2[(i2 + 1) * (i2 < 15 ? 1 : 0)] += c2 - 1 + 37 * (c2 - 1) * (i2 === 15 ? 1 : 0);
        o2[i2] -= c2 * 65536;
      }
    }
    function sel25519(p2, q, b2) {
      var t2, c2 = ~(b2 - 1);
      for (var i2 = 0; i2 < 16; i2++) {
        t2 = c2 & (p2[i2] ^ q[i2]);
        p2[i2] ^= t2;
        q[i2] ^= t2;
      }
    }
    function pack25519(o2, n2) {
      var i2, j2, b2;
      var m2 = gf(), t2 = gf();
      for (i2 = 0; i2 < 16; i2++) t2[i2] = n2[i2];
      car25519(t2);
      car25519(t2);
      car25519(t2);
      for (j2 = 0; j2 < 2; j2++) {
        m2[0] = t2[0] - 65517;
        for (i2 = 1; i2 < 15; i2++) {
          m2[i2] = t2[i2] - 65535 - (m2[i2 - 1] >> 16 & 1);
          m2[i2 - 1] &= 65535;
        }
        m2[15] = t2[15] - 32767 - (m2[14] >> 16 & 1);
        b2 = m2[15] >> 16 & 1;
        m2[14] &= 65535;
        sel25519(t2, m2, 1 - b2);
      }
      for (i2 = 0; i2 < 16; i2++) {
        o2[2 * i2] = t2[i2] & 255;
        o2[2 * i2 + 1] = t2[i2] >> 8;
      }
    }
    function neq25519(a2, b2) {
      var c2 = new Uint8Array(32), d2 = new Uint8Array(32);
      pack25519(c2, a2);
      pack25519(d2, b2);
      return crypto_verify_32(c2, 0, d2, 0);
    }
    function par25519(a2) {
      var d2 = new Uint8Array(32);
      pack25519(d2, a2);
      return d2[0] & 1;
    }
    function unpack25519(o2, n2) {
      var i2;
      for (i2 = 0; i2 < 16; i2++) o2[i2] = n2[2 * i2] + (n2[2 * i2 + 1] << 8);
      o2[15] &= 32767;
    }
    function A2(o2, a2, b2) {
      var i2;
      for (i2 = 0; i2 < 16; i2++) o2[i2] = a2[i2] + b2[i2] | 0;
    }
    function Z(o2, a2, b2) {
      var i2;
      for (i2 = 0; i2 < 16; i2++) o2[i2] = a2[i2] - b2[i2] | 0;
    }
    function M(o2, a2, b2) {
      var i2, j2, t2 = new Float64Array(31);
      for (i2 = 0; i2 < 31; i2++) t2[i2] = 0;
      for (i2 = 0; i2 < 16; i2++) {
        for (j2 = 0; j2 < 16; j2++) {
          t2[i2 + j2] += a2[i2] * b2[j2];
        }
      }
      for (i2 = 0; i2 < 15; i2++) {
        t2[i2] += 38 * t2[i2 + 16];
      }
      for (i2 = 0; i2 < 16; i2++) o2[i2] = t2[i2];
      car25519(o2);
      car25519(o2);
    }
    function S2(o2, a2) {
      M(o2, a2, a2);
    }
    function inv25519(o2, i2) {
      var c2 = gf();
      var a2;
      for (a2 = 0; a2 < 16; a2++) c2[a2] = i2[a2];
      for (a2 = 253; a2 >= 0; a2--) {
        S2(c2, c2);
        if (a2 !== 2 && a2 !== 4) M(c2, c2, i2);
      }
      for (a2 = 0; a2 < 16; a2++) o2[a2] = c2[a2];
    }
    function pow2523(o2, i2) {
      var c2 = gf();
      var a2;
      for (a2 = 0; a2 < 16; a2++) c2[a2] = i2[a2];
      for (a2 = 250; a2 >= 0; a2--) {
        S2(c2, c2);
        if (a2 !== 1) M(c2, c2, i2);
      }
      for (a2 = 0; a2 < 16; a2++) o2[a2] = c2[a2];
    }
    function crypto_scalarmult(q, n2, p2) {
      var z2 = new Uint8Array(32);
      var x2 = new Float64Array(80), r2, i2;
      var a2 = gf(), b2 = gf(), c2 = gf(), d2 = gf(), e2 = gf(), f2 = gf();
      for (i2 = 0; i2 < 31; i2++) z2[i2] = n2[i2];
      z2[31] = n2[31] & 127 | 64;
      z2[0] &= 248;
      unpack25519(x2, p2);
      for (i2 = 0; i2 < 16; i2++) {
        b2[i2] = x2[i2];
        d2[i2] = a2[i2] = c2[i2] = 0;
      }
      a2[0] = d2[0] = 1;
      for (i2 = 254; i2 >= 0; --i2) {
        r2 = z2[i2 >>> 3] >>> (i2 & 7) & 1;
        sel25519(a2, b2, r2);
        sel25519(c2, d2, r2);
        A2(e2, a2, c2);
        Z(a2, a2, c2);
        A2(c2, b2, d2);
        Z(b2, b2, d2);
        S2(d2, e2);
        S2(f2, a2);
        M(a2, c2, a2);
        M(c2, b2, e2);
        A2(e2, a2, c2);
        Z(a2, a2, c2);
        S2(b2, a2);
        Z(c2, d2, f2);
        M(a2, c2, _121665);
        A2(a2, a2, d2);
        M(c2, c2, a2);
        M(a2, d2, f2);
        M(d2, b2, x2);
        S2(b2, e2);
        sel25519(a2, b2, r2);
        sel25519(c2, d2, r2);
      }
      for (i2 = 0; i2 < 16; i2++) {
        x2[i2 + 16] = a2[i2];
        x2[i2 + 32] = c2[i2];
        x2[i2 + 48] = b2[i2];
        x2[i2 + 64] = d2[i2];
      }
      var x32 = x2.subarray(32);
      var x16 = x2.subarray(16);
      inv25519(x32, x32);
      M(x16, x16, x32);
      pack25519(q, x16);
      return 0;
    }
    function crypto_scalarmult_base(q, n2) {
      return crypto_scalarmult(q, n2, _9);
    }
    function crypto_box_keypair(y2, x2) {
      randombytes(x2, 32);
      return crypto_scalarmult_base(y2, x2);
    }
    function crypto_box_beforenm(k2, y2, x2) {
      var s2 = new Uint8Array(32);
      crypto_scalarmult(s2, x2, y2);
      return crypto_core_hsalsa20(k2, _0, s2, sigma);
    }
    var crypto_box_afternm = crypto_secretbox;
    var crypto_box_open_afternm = crypto_secretbox_open;
    function crypto_box(c2, m2, d2, n2, y2, x2) {
      var k2 = new Uint8Array(32);
      crypto_box_beforenm(k2, y2, x2);
      return crypto_box_afternm(c2, m2, d2, n2, k2);
    }
    function crypto_box_open(m2, c2, d2, n2, y2, x2) {
      var k2 = new Uint8Array(32);
      crypto_box_beforenm(k2, y2, x2);
      return crypto_box_open_afternm(m2, c2, d2, n2, k2);
    }
    function add64() {
      var a2 = 0, b2 = 0, c2 = 0, d2 = 0, m16 = 65535, l2, h2, i2;
      for (i2 = 0; i2 < arguments.length; i2++) {
        l2 = arguments[i2].lo;
        h2 = arguments[i2].hi;
        a2 += l2 & m16;
        b2 += l2 >>> 16;
        c2 += h2 & m16;
        d2 += h2 >>> 16;
      }
      b2 += a2 >>> 16;
      c2 += b2 >>> 16;
      d2 += c2 >>> 16;
      return new u64(c2 & m16 | d2 << 16, a2 & m16 | b2 << 16);
    }
    function shr64(x2, c2) {
      return new u64(x2.hi >>> c2, x2.lo >>> c2 | x2.hi << 32 - c2);
    }
    function xor64() {
      var l2 = 0, h2 = 0, i2;
      for (i2 = 0; i2 < arguments.length; i2++) {
        l2 ^= arguments[i2].lo;
        h2 ^= arguments[i2].hi;
      }
      return new u64(h2, l2);
    }
    function R(x2, c2) {
      var h2, l2, c1 = 32 - c2;
      if (c2 < 32) {
        h2 = x2.hi >>> c2 | x2.lo << c1;
        l2 = x2.lo >>> c2 | x2.hi << c1;
      } else if (c2 < 64) {
        h2 = x2.lo >>> c2 | x2.hi << c1;
        l2 = x2.hi >>> c2 | x2.lo << c1;
      }
      return new u64(h2, l2);
    }
    function Ch(x2, y2, z2) {
      var h2 = x2.hi & y2.hi ^ ~x2.hi & z2.hi, l2 = x2.lo & y2.lo ^ ~x2.lo & z2.lo;
      return new u64(h2, l2);
    }
    function Maj(x2, y2, z2) {
      var h2 = x2.hi & y2.hi ^ x2.hi & z2.hi ^ y2.hi & z2.hi, l2 = x2.lo & y2.lo ^ x2.lo & z2.lo ^ y2.lo & z2.lo;
      return new u64(h2, l2);
    }
    function Sigma0(x2) {
      return xor64(R(x2, 28), R(x2, 34), R(x2, 39));
    }
    function Sigma1(x2) {
      return xor64(R(x2, 14), R(x2, 18), R(x2, 41));
    }
    function sigma0(x2) {
      return xor64(R(x2, 1), R(x2, 8), shr64(x2, 7));
    }
    function sigma1(x2) {
      return xor64(R(x2, 19), R(x2, 61), shr64(x2, 6));
    }
    var K = [
      new u64(1116352408, 3609767458),
      new u64(1899447441, 602891725),
      new u64(3049323471, 3964484399),
      new u64(3921009573, 2173295548),
      new u64(961987163, 4081628472),
      new u64(1508970993, 3053834265),
      new u64(2453635748, 2937671579),
      new u64(2870763221, 3664609560),
      new u64(3624381080, 2734883394),
      new u64(310598401, 1164996542),
      new u64(607225278, 1323610764),
      new u64(1426881987, 3590304994),
      new u64(1925078388, 4068182383),
      new u64(2162078206, 991336113),
      new u64(2614888103, 633803317),
      new u64(3248222580, 3479774868),
      new u64(3835390401, 2666613458),
      new u64(4022224774, 944711139),
      new u64(264347078, 2341262773),
      new u64(604807628, 2007800933),
      new u64(770255983, 1495990901),
      new u64(1249150122, 1856431235),
      new u64(1555081692, 3175218132),
      new u64(1996064986, 2198950837),
      new u64(2554220882, 3999719339),
      new u64(2821834349, 766784016),
      new u64(2952996808, 2566594879),
      new u64(3210313671, 3203337956),
      new u64(3336571891, 1034457026),
      new u64(3584528711, 2466948901),
      new u64(113926993, 3758326383),
      new u64(338241895, 168717936),
      new u64(666307205, 1188179964),
      new u64(773529912, 1546045734),
      new u64(1294757372, 1522805485),
      new u64(1396182291, 2643833823),
      new u64(1695183700, 2343527390),
      new u64(1986661051, 1014477480),
      new u64(2177026350, 1206759142),
      new u64(2456956037, 344077627),
      new u64(2730485921, 1290863460),
      new u64(2820302411, 3158454273),
      new u64(3259730800, 3505952657),
      new u64(3345764771, 106217008),
      new u64(3516065817, 3606008344),
      new u64(3600352804, 1432725776),
      new u64(4094571909, 1467031594),
      new u64(275423344, 851169720),
      new u64(430227734, 3100823752),
      new u64(506948616, 1363258195),
      new u64(659060556, 3750685593),
      new u64(883997877, 3785050280),
      new u64(958139571, 3318307427),
      new u64(1322822218, 3812723403),
      new u64(1537002063, 2003034995),
      new u64(1747873779, 3602036899),
      new u64(1955562222, 1575990012),
      new u64(2024104815, 1125592928),
      new u64(2227730452, 2716904306),
      new u64(2361852424, 442776044),
      new u64(2428436474, 593698344),
      new u64(2756734187, 3733110249),
      new u64(3204031479, 2999351573),
      new u64(3329325298, 3815920427),
      new u64(3391569614, 3928383900),
      new u64(3515267271, 566280711),
      new u64(3940187606, 3454069534),
      new u64(4118630271, 4000239992),
      new u64(116418474, 1914138554),
      new u64(174292421, 2731055270),
      new u64(289380356, 3203993006),
      new u64(460393269, 320620315),
      new u64(685471733, 587496836),
      new u64(852142971, 1086792851),
      new u64(1017036298, 365543100),
      new u64(1126000580, 2618297676),
      new u64(1288033470, 3409855158),
      new u64(1501505948, 4234509866),
      new u64(1607167915, 987167468),
      new u64(1816402316, 1246189591)
    ];
    function crypto_hashblocks(x2, m2, n2) {
      var z2 = [], b2 = [], a2 = [], w2 = [], t2, i2, j2;
      for (i2 = 0; i2 < 8; i2++) z2[i2] = a2[i2] = dl64(x2, 8 * i2);
      var pos = 0;
      while (n2 >= 128) {
        for (i2 = 0; i2 < 16; i2++) w2[i2] = dl64(m2, 8 * i2 + pos);
        for (i2 = 0; i2 < 80; i2++) {
          for (j2 = 0; j2 < 8; j2++) b2[j2] = a2[j2];
          t2 = add64(a2[7], Sigma1(a2[4]), Ch(a2[4], a2[5], a2[6]), K[i2], w2[i2 % 16]);
          b2[7] = add64(t2, Sigma0(a2[0]), Maj(a2[0], a2[1], a2[2]));
          b2[3] = add64(b2[3], t2);
          for (j2 = 0; j2 < 8; j2++) a2[(j2 + 1) % 8] = b2[j2];
          if (i2 % 16 === 15) {
            for (j2 = 0; j2 < 16; j2++) {
              w2[j2] = add64(w2[j2], w2[(j2 + 9) % 16], sigma0(w2[(j2 + 1) % 16]), sigma1(w2[(j2 + 14) % 16]));
            }
          }
        }
        for (i2 = 0; i2 < 8; i2++) {
          a2[i2] = add64(a2[i2], z2[i2]);
          z2[i2] = a2[i2];
        }
        pos += 128;
        n2 -= 128;
      }
      for (i2 = 0; i2 < 8; i2++) ts64(x2, 8 * i2, z2[i2]);
      return n2;
    }
    var iv = new Uint8Array([
      106,
      9,
      230,
      103,
      243,
      188,
      201,
      8,
      187,
      103,
      174,
      133,
      132,
      202,
      167,
      59,
      60,
      110,
      243,
      114,
      254,
      148,
      248,
      43,
      165,
      79,
      245,
      58,
      95,
      29,
      54,
      241,
      81,
      14,
      82,
      127,
      173,
      230,
      130,
      209,
      155,
      5,
      104,
      140,
      43,
      62,
      108,
      31,
      31,
      131,
      217,
      171,
      251,
      65,
      189,
      107,
      91,
      224,
      205,
      25,
      19,
      126,
      33,
      121
    ]);
    function crypto_hash(out, m2, n2) {
      var h2 = new Uint8Array(64), x2 = new Uint8Array(256);
      var i2, b2 = n2;
      for (i2 = 0; i2 < 64; i2++) h2[i2] = iv[i2];
      crypto_hashblocks(h2, m2, n2);
      n2 %= 128;
      for (i2 = 0; i2 < 256; i2++) x2[i2] = 0;
      for (i2 = 0; i2 < n2; i2++) x2[i2] = m2[b2 - n2 + i2];
      x2[n2] = 128;
      n2 = 256 - 128 * (n2 < 112 ? 1 : 0);
      x2[n2 - 9] = 0;
      ts64(x2, n2 - 8, new u64(b2 / 536870912 | 0, b2 << 3));
      crypto_hashblocks(h2, x2, n2);
      for (i2 = 0; i2 < 64; i2++) out[i2] = h2[i2];
      return 0;
    }
    function add(p2, q) {
      var a2 = gf(), b2 = gf(), c2 = gf(), d2 = gf(), e2 = gf(), f2 = gf(), g2 = gf(), h2 = gf(), t2 = gf();
      Z(a2, p2[1], p2[0]);
      Z(t2, q[1], q[0]);
      M(a2, a2, t2);
      A2(b2, p2[0], p2[1]);
      A2(t2, q[0], q[1]);
      M(b2, b2, t2);
      M(c2, p2[3], q[3]);
      M(c2, c2, D2);
      M(d2, p2[2], q[2]);
      A2(d2, d2, d2);
      Z(e2, b2, a2);
      Z(f2, d2, c2);
      A2(g2, d2, c2);
      A2(h2, b2, a2);
      M(p2[0], e2, f2);
      M(p2[1], h2, g2);
      M(p2[2], g2, f2);
      M(p2[3], e2, h2);
    }
    function cswap(p2, q, b2) {
      var i2;
      for (i2 = 0; i2 < 4; i2++) {
        sel25519(p2[i2], q[i2], b2);
      }
    }
    function pack(r2, p2) {
      var tx = gf(), ty = gf(), zi = gf();
      inv25519(zi, p2[2]);
      M(tx, p2[0], zi);
      M(ty, p2[1], zi);
      pack25519(r2, ty);
      r2[31] ^= par25519(tx) << 7;
    }
    function scalarmult(p2, q, s2) {
      var b2, i2;
      set25519(p2[0], gf0);
      set25519(p2[1], gf1);
      set25519(p2[2], gf1);
      set25519(p2[3], gf0);
      for (i2 = 255; i2 >= 0; --i2) {
        b2 = s2[i2 / 8 | 0] >> (i2 & 7) & 1;
        cswap(p2, q, b2);
        add(q, p2);
        add(p2, p2);
        cswap(p2, q, b2);
      }
    }
    function scalarbase(p2, s2) {
      var q = [
        gf(),
        gf(),
        gf(),
        gf()
      ];
      set25519(q[0], X);
      set25519(q[1], Y);
      set25519(q[2], gf1);
      M(q[3], X, Y);
      scalarmult(p2, q, s2);
    }
    function crypto_sign_keypair(pk, sk, seeded) {
      var d2 = new Uint8Array(64);
      var p2 = [
        gf(),
        gf(),
        gf(),
        gf()
      ];
      var i2;
      if (!seeded) randombytes(sk, 32);
      crypto_hash(d2, sk, 32);
      d2[0] &= 248;
      d2[31] &= 127;
      d2[31] |= 64;
      scalarbase(p2, d2);
      pack(pk, p2);
      for (i2 = 0; i2 < 32; i2++) sk[i2 + 32] = pk[i2];
      return 0;
    }
    var L = new Float64Array([
      237,
      211,
      245,
      92,
      26,
      99,
      18,
      88,
      214,
      156,
      247,
      162,
      222,
      249,
      222,
      20,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      16
    ]);
    function modL(r2, x2) {
      var carry, i2, j2, k2;
      for (i2 = 63; i2 >= 32; --i2) {
        carry = 0;
        for (j2 = i2 - 32, k2 = i2 - 12; j2 < k2; ++j2) {
          x2[j2] += carry - 16 * x2[i2] * L[j2 - (i2 - 32)];
          carry = Math.floor((x2[j2] + 128) / 256);
          x2[j2] -= carry * 256;
        }
        x2[j2] += carry;
        x2[i2] = 0;
      }
      carry = 0;
      for (j2 = 0; j2 < 32; j2++) {
        x2[j2] += carry - (x2[31] >> 4) * L[j2];
        carry = x2[j2] >> 8;
        x2[j2] &= 255;
      }
      for (j2 = 0; j2 < 32; j2++) x2[j2] -= carry * L[j2];
      for (i2 = 0; i2 < 32; i2++) {
        x2[i2 + 1] += x2[i2] >> 8;
        r2[i2] = x2[i2] & 255;
      }
    }
    function reduce(r2) {
      var x2 = new Float64Array(64), i2;
      for (i2 = 0; i2 < 64; i2++) x2[i2] = r2[i2];
      for (i2 = 0; i2 < 64; i2++) r2[i2] = 0;
      modL(r2, x2);
    }
    function crypto_sign(sm, m2, n2, sk) {
      var d2 = new Uint8Array(64), h2 = new Uint8Array(64), r2 = new Uint8Array(64);
      var i2, j2, x2 = new Float64Array(64);
      var p2 = [
        gf(),
        gf(),
        gf(),
        gf()
      ];
      crypto_hash(d2, sk, 32);
      d2[0] &= 248;
      d2[31] &= 127;
      d2[31] |= 64;
      var smlen = n2 + 64;
      for (i2 = 0; i2 < n2; i2++) sm[64 + i2] = m2[i2];
      for (i2 = 0; i2 < 32; i2++) sm[32 + i2] = d2[32 + i2];
      crypto_hash(r2, sm.subarray(32), n2 + 32);
      reduce(r2);
      scalarbase(p2, r2);
      pack(sm, p2);
      for (i2 = 32; i2 < 64; i2++) sm[i2] = sk[i2];
      crypto_hash(h2, sm, n2 + 64);
      reduce(h2);
      for (i2 = 0; i2 < 64; i2++) x2[i2] = 0;
      for (i2 = 0; i2 < 32; i2++) x2[i2] = r2[i2];
      for (i2 = 0; i2 < 32; i2++) {
        for (j2 = 0; j2 < 32; j2++) {
          x2[i2 + j2] += h2[i2] * d2[j2];
        }
      }
      modL(sm.subarray(32), x2);
      return smlen;
    }
    function unpackneg(r2, p2) {
      var t2 = gf(), chk = gf(), num = gf(), den = gf(), den2 = gf(), den4 = gf(), den6 = gf();
      set25519(r2[2], gf1);
      unpack25519(r2[1], p2);
      S2(num, r2[1]);
      M(den, num, D);
      Z(num, num, r2[2]);
      A2(den, r2[2], den);
      S2(den2, den);
      S2(den4, den2);
      M(den6, den4, den2);
      M(t2, den6, num);
      M(t2, t2, den);
      pow2523(t2, t2);
      M(t2, t2, num);
      M(t2, t2, den);
      M(t2, t2, den);
      M(r2[0], t2, den);
      S2(chk, r2[0]);
      M(chk, chk, den);
      if (neq25519(chk, num)) M(r2[0], r2[0], I);
      S2(chk, r2[0]);
      M(chk, chk, den);
      if (neq25519(chk, num)) return -1;
      if (par25519(r2[0]) === p2[31] >> 7) Z(r2[0], gf0, r2[0]);
      M(r2[3], r2[0], r2[1]);
      return 0;
    }
    function crypto_sign_open(m2, sm, n2, pk) {
      var i2;
      var t2 = new Uint8Array(32), h2 = new Uint8Array(64);
      var p2 = [
        gf(),
        gf(),
        gf(),
        gf()
      ], q = [
        gf(),
        gf(),
        gf(),
        gf()
      ];
      if (n2 < 64) return -1;
      if (unpackneg(q, pk)) return -1;
      for (i2 = 0; i2 < n2; i2++) m2[i2] = sm[i2];
      for (i2 = 0; i2 < 32; i2++) m2[i2 + 32] = pk[i2];
      crypto_hash(h2, m2, n2);
      reduce(h2);
      scalarmult(p2, q, h2);
      scalarbase(q, sm.subarray(32));
      add(p2, q);
      pack(t2, p2);
      n2 -= 64;
      if (crypto_verify_32(sm, 0, t2, 0)) {
        for (i2 = 0; i2 < n2; i2++) m2[i2] = 0;
        return -1;
      }
      for (i2 = 0; i2 < n2; i2++) m2[i2] = sm[i2 + 64];
      return n2;
    }
    var crypto_secretbox_KEYBYTES = 32, crypto_secretbox_NONCEBYTES = 24, crypto_secretbox_ZEROBYTES = 32, crypto_secretbox_BOXZEROBYTES = 16, crypto_scalarmult_BYTES = 32, crypto_scalarmult_SCALARBYTES = 32, crypto_box_PUBLICKEYBYTES = 32, crypto_box_SECRETKEYBYTES = 32, crypto_box_BEFORENMBYTES = 32, crypto_box_NONCEBYTES = crypto_secretbox_NONCEBYTES, crypto_box_ZEROBYTES = crypto_secretbox_ZEROBYTES, crypto_box_BOXZEROBYTES = crypto_secretbox_BOXZEROBYTES, crypto_sign_BYTES = 64, crypto_sign_PUBLICKEYBYTES = 32, crypto_sign_SECRETKEYBYTES = 64, crypto_sign_SEEDBYTES = 32, crypto_hash_BYTES = 64;
    nacl2.lowlevel = {
      crypto_core_hsalsa20,
      crypto_stream_xor,
      crypto_stream,
      crypto_stream_salsa20_xor,
      crypto_stream_salsa20,
      crypto_onetimeauth,
      crypto_onetimeauth_verify,
      crypto_verify_16,
      crypto_verify_32,
      crypto_secretbox,
      crypto_secretbox_open,
      crypto_scalarmult,
      crypto_scalarmult_base,
      crypto_box_beforenm,
      crypto_box_afternm,
      crypto_box,
      crypto_box_open,
      crypto_box_keypair,
      crypto_hash,
      crypto_sign,
      crypto_sign_keypair,
      crypto_sign_open,
      crypto_secretbox_KEYBYTES,
      crypto_secretbox_NONCEBYTES,
      crypto_secretbox_ZEROBYTES,
      crypto_secretbox_BOXZEROBYTES,
      crypto_scalarmult_BYTES,
      crypto_scalarmult_SCALARBYTES,
      crypto_box_PUBLICKEYBYTES,
      crypto_box_SECRETKEYBYTES,
      crypto_box_BEFORENMBYTES,
      crypto_box_NONCEBYTES,
      crypto_box_ZEROBYTES,
      crypto_box_BOXZEROBYTES,
      crypto_sign_BYTES,
      crypto_sign_PUBLICKEYBYTES,
      crypto_sign_SECRETKEYBYTES,
      crypto_sign_SEEDBYTES,
      crypto_hash_BYTES,
      gf,
      D,
      L,
      pack25519,
      unpack25519,
      M,
      A: A2,
      S: S2,
      Z,
      pow2523,
      add,
      set25519,
      modL,
      scalarmult,
      scalarbase
    };
    function checkLengths(k2, n2) {
      if (k2.length !== crypto_secretbox_KEYBYTES) throw new Error("bad key size");
      if (n2.length !== crypto_secretbox_NONCEBYTES) throw new Error("bad nonce size");
    }
    function checkBoxLengths(pk, sk) {
      if (pk.length !== crypto_box_PUBLICKEYBYTES) throw new Error("bad public key size");
      if (sk.length !== crypto_box_SECRETKEYBYTES) throw new Error("bad secret key size");
    }
    function checkArrayTypes() {
      for (var i2 = 0; i2 < arguments.length; i2++) {
        if (!(arguments[i2] instanceof Uint8Array)) throw new TypeError("unexpected type, use Uint8Array");
      }
    }
    function cleanup(arr) {
      for (var i2 = 0; i2 < arr.length; i2++) arr[i2] = 0;
    }
    nacl2.randomBytes = function(n2) {
      var b2 = new Uint8Array(n2);
      randombytes(b2, n2);
      return b2;
    };
    nacl2.secretbox = function(msg, nonce, key) {
      checkArrayTypes(msg, nonce, key);
      checkLengths(key, nonce);
      var m2 = new Uint8Array(crypto_secretbox_ZEROBYTES + msg.length);
      var c2 = new Uint8Array(m2.length);
      for (var i2 = 0; i2 < msg.length; i2++) m2[i2 + crypto_secretbox_ZEROBYTES] = msg[i2];
      crypto_secretbox(c2, m2, m2.length, nonce, key);
      return c2.subarray(crypto_secretbox_BOXZEROBYTES);
    };
    nacl2.secretbox.open = function(box, nonce, key) {
      checkArrayTypes(box, nonce, key);
      checkLengths(key, nonce);
      var c2 = new Uint8Array(crypto_secretbox_BOXZEROBYTES + box.length);
      var m2 = new Uint8Array(c2.length);
      for (var i2 = 0; i2 < box.length; i2++) c2[i2 + crypto_secretbox_BOXZEROBYTES] = box[i2];
      if (c2.length < 32) return null;
      if (crypto_secretbox_open(m2, c2, c2.length, nonce, key) !== 0) return null;
      return m2.subarray(crypto_secretbox_ZEROBYTES);
    };
    nacl2.secretbox.keyLength = crypto_secretbox_KEYBYTES;
    nacl2.secretbox.nonceLength = crypto_secretbox_NONCEBYTES;
    nacl2.secretbox.overheadLength = crypto_secretbox_BOXZEROBYTES;
    nacl2.scalarMult = function(n2, p2) {
      checkArrayTypes(n2, p2);
      if (n2.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
      if (p2.length !== crypto_scalarmult_BYTES) throw new Error("bad p size");
      var q = new Uint8Array(crypto_scalarmult_BYTES);
      crypto_scalarmult(q, n2, p2);
      return q;
    };
    nacl2.scalarMult.base = function(n2) {
      checkArrayTypes(n2);
      if (n2.length !== crypto_scalarmult_SCALARBYTES) throw new Error("bad n size");
      var q = new Uint8Array(crypto_scalarmult_BYTES);
      crypto_scalarmult_base(q, n2);
      return q;
    };
    nacl2.scalarMult.scalarLength = crypto_scalarmult_SCALARBYTES;
    nacl2.scalarMult.groupElementLength = crypto_scalarmult_BYTES;
    nacl2.box = function(msg, nonce, publicKey, secretKey) {
      var k2 = nacl2.box.before(publicKey, secretKey);
      return nacl2.secretbox(msg, nonce, k2);
    };
    nacl2.box.before = function(publicKey, secretKey) {
      checkArrayTypes(publicKey, secretKey);
      checkBoxLengths(publicKey, secretKey);
      var k2 = new Uint8Array(crypto_box_BEFORENMBYTES);
      crypto_box_beforenm(k2, publicKey, secretKey);
      return k2;
    };
    nacl2.box.after = nacl2.secretbox;
    nacl2.box.open = function(msg, nonce, publicKey, secretKey) {
      var k2 = nacl2.box.before(publicKey, secretKey);
      return nacl2.secretbox.open(msg, nonce, k2);
    };
    nacl2.box.open.after = nacl2.secretbox.open;
    nacl2.box.keyPair = function() {
      var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
      var sk = new Uint8Array(crypto_box_SECRETKEYBYTES);
      crypto_box_keypair(pk, sk);
      return {
        publicKey: pk,
        secretKey: sk
      };
    };
    nacl2.box.keyPair.fromSecretKey = function(secretKey) {
      checkArrayTypes(secretKey);
      if (secretKey.length !== crypto_box_SECRETKEYBYTES) throw new Error("bad secret key size");
      var pk = new Uint8Array(crypto_box_PUBLICKEYBYTES);
      crypto_scalarmult_base(pk, secretKey);
      return {
        publicKey: pk,
        secretKey: new Uint8Array(secretKey)
      };
    };
    nacl2.box.publicKeyLength = crypto_box_PUBLICKEYBYTES;
    nacl2.box.secretKeyLength = crypto_box_SECRETKEYBYTES;
    nacl2.box.sharedKeyLength = crypto_box_BEFORENMBYTES;
    nacl2.box.nonceLength = crypto_box_NONCEBYTES;
    nacl2.box.overheadLength = nacl2.secretbox.overheadLength;
    nacl2.sign = function(msg, secretKey) {
      checkArrayTypes(msg, secretKey);
      if (secretKey.length !== crypto_sign_SECRETKEYBYTES) throw new Error("bad secret key size");
      var signedMsg = new Uint8Array(crypto_sign_BYTES + msg.length);
      crypto_sign(signedMsg, msg, msg.length, secretKey);
      return signedMsg;
    };
    nacl2.sign.open = function(signedMsg, publicKey) {
      checkArrayTypes(signedMsg, publicKey);
      if (publicKey.length !== crypto_sign_PUBLICKEYBYTES) throw new Error("bad public key size");
      var tmp = new Uint8Array(signedMsg.length);
      var mlen = crypto_sign_open(tmp, signedMsg, signedMsg.length, publicKey);
      if (mlen < 0) return null;
      var m2 = new Uint8Array(mlen);
      for (var i2 = 0; i2 < m2.length; i2++) m2[i2] = tmp[i2];
      return m2;
    };
    nacl2.sign.detached = function(msg, secretKey) {
      var signedMsg = nacl2.sign(msg, secretKey);
      var sig = new Uint8Array(crypto_sign_BYTES);
      for (var i2 = 0; i2 < sig.length; i2++) sig[i2] = signedMsg[i2];
      return sig;
    };
    nacl2.sign.detached.verify = function(msg, sig, publicKey) {
      checkArrayTypes(msg, sig, publicKey);
      if (sig.length !== crypto_sign_BYTES) throw new Error("bad signature size");
      if (publicKey.length !== crypto_sign_PUBLICKEYBYTES) throw new Error("bad public key size");
      var sm = new Uint8Array(crypto_sign_BYTES + msg.length);
      var m2 = new Uint8Array(crypto_sign_BYTES + msg.length);
      var i2;
      for (i2 = 0; i2 < crypto_sign_BYTES; i2++) sm[i2] = sig[i2];
      for (i2 = 0; i2 < msg.length; i2++) sm[i2 + crypto_sign_BYTES] = msg[i2];
      return crypto_sign_open(m2, sm, sm.length, publicKey) >= 0;
    };
    nacl2.sign.keyPair = function() {
      var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
      var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
      crypto_sign_keypair(pk, sk);
      return {
        publicKey: pk,
        secretKey: sk
      };
    };
    nacl2.sign.keyPair.fromSecretKey = function(secretKey) {
      checkArrayTypes(secretKey);
      if (secretKey.length !== crypto_sign_SECRETKEYBYTES) throw new Error("bad secret key size");
      var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
      for (var i2 = 0; i2 < pk.length; i2++) pk[i2] = secretKey[32 + i2];
      return {
        publicKey: pk,
        secretKey: new Uint8Array(secretKey)
      };
    };
    nacl2.sign.keyPair.fromSeed = function(seed) {
      checkArrayTypes(seed);
      if (seed.length !== crypto_sign_SEEDBYTES) throw new Error("bad seed size");
      var pk = new Uint8Array(crypto_sign_PUBLICKEYBYTES);
      var sk = new Uint8Array(crypto_sign_SECRETKEYBYTES);
      for (var i2 = 0; i2 < 32; i2++) sk[i2] = seed[i2];
      crypto_sign_keypair(pk, sk, true);
      return {
        publicKey: pk,
        secretKey: sk
      };
    };
    nacl2.sign.publicKeyLength = crypto_sign_PUBLICKEYBYTES;
    nacl2.sign.secretKeyLength = crypto_sign_SECRETKEYBYTES;
    nacl2.sign.seedLength = crypto_sign_SEEDBYTES;
    nacl2.sign.signatureLength = crypto_sign_BYTES;
    nacl2.hash = function(msg) {
      checkArrayTypes(msg);
      var h2 = new Uint8Array(crypto_hash_BYTES);
      crypto_hash(h2, msg, msg.length);
      return h2;
    };
    nacl2.hash.hashLength = crypto_hash_BYTES;
    nacl2.verify = function(x2, y2) {
      checkArrayTypes(x2, y2);
      if (x2.length === 0 || y2.length === 0) return false;
      if (x2.length !== y2.length) return false;
      return vn(x2, 0, y2, 0, x2.length) === 0 ? true : false;
    };
    nacl2.setPRNG = function(fn) {
      randombytes = fn;
    };
    (function() {
      var crypto1 = typeof globalThis !== "undefined" ? globalThis.crypto || globalThis.msCrypto : null;
      if (crypto1 && crypto1.getRandomValues) {
        var QUOTA = 65536;
        nacl2.setPRNG(function(x2, n2) {
          var i2, v2 = new Uint8Array(n2);
          for (i2 = 0; i2 < n2; i2 += QUOTA) {
            crypto1.getRandomValues(v2.subarray(i2, i2 + Math.min(n2 - i2, QUOTA)));
          }
          for (i2 = 0; i2 < n2; i2++) x2[i2] = v2[i2];
          cleanup(v2);
        });
      } else if (typeof __require !== "undefined") {
        crypto1 = __require("crypto");
        if (crypto1 && crypto1.randomBytes) {
          nacl2.setPRNG(function(x2, n2) {
            var i2, v2 = crypto1.randomBytes(n2);
            for (i2 = 0; i2 < n2; i2++) x2[i2] = v2[i2];
            cleanup(v2);
          });
        }
      }
    })();
  })(typeof module !== "undefined" && module.exports ? module.exports : globalThis.nacl = globalThis.nacl || {});
  var nacl = typeof module !== "undefined" && module.exports ? module.exports : globalThis.nacl;
  var denoHelper = {
    fromSeed: nacl.sign.keyPair.fromSeed,
    sign: nacl.sign.detached,
    verify: nacl.sign.detached.verify,
    randomBytes: nacl.randomBytes
  };
  var helper;
  function setEd25519Helper(lib) {
    helper = lib;
  }
  function getEd25519Helper() {
    return helper;
  }
  var crc16tab = new Uint16Array([
    0,
    4129,
    8258,
    12387,
    16516,
    20645,
    24774,
    28903,
    33032,
    37161,
    41290,
    45419,
    49548,
    53677,
    57806,
    61935,
    4657,
    528,
    12915,
    8786,
    21173,
    17044,
    29431,
    25302,
    37689,
    33560,
    45947,
    41818,
    54205,
    50076,
    62463,
    58334,
    9314,
    13379,
    1056,
    5121,
    25830,
    29895,
    17572,
    21637,
    42346,
    46411,
    34088,
    38153,
    58862,
    62927,
    50604,
    54669,
    13907,
    9842,
    5649,
    1584,
    30423,
    26358,
    22165,
    18100,
    46939,
    42874,
    38681,
    34616,
    63455,
    59390,
    55197,
    51132,
    18628,
    22757,
    26758,
    30887,
    2112,
    6241,
    10242,
    14371,
    51660,
    55789,
    59790,
    63919,
    35144,
    39273,
    43274,
    47403,
    23285,
    19156,
    31415,
    27286,
    6769,
    2640,
    14899,
    10770,
    56317,
    52188,
    64447,
    60318,
    39801,
    35672,
    47931,
    43802,
    27814,
    31879,
    19684,
    23749,
    11298,
    15363,
    3168,
    7233,
    60846,
    64911,
    52716,
    56781,
    44330,
    48395,
    36200,
    40265,
    32407,
    28342,
    24277,
    20212,
    15891,
    11826,
    7761,
    3696,
    65439,
    61374,
    57309,
    53244,
    48923,
    44858,
    40793,
    36728,
    37256,
    33193,
    45514,
    41451,
    53516,
    49453,
    61774,
    57711,
    4224,
    161,
    12482,
    8419,
    20484,
    16421,
    28742,
    24679,
    33721,
    37784,
    41979,
    46042,
    49981,
    54044,
    58239,
    62302,
    689,
    4752,
    8947,
    13010,
    16949,
    21012,
    25207,
    29270,
    46570,
    42443,
    38312,
    34185,
    62830,
    58703,
    54572,
    50445,
    13538,
    9411,
    5280,
    1153,
    29798,
    25671,
    21540,
    17413,
    42971,
    47098,
    34713,
    38840,
    59231,
    63358,
    50973,
    55100,
    9939,
    14066,
    1681,
    5808,
    26199,
    30326,
    17941,
    22068,
    55628,
    51565,
    63758,
    59695,
    39368,
    35305,
    47498,
    43435,
    22596,
    18533,
    30726,
    26663,
    6336,
    2273,
    14466,
    10403,
    52093,
    56156,
    60223,
    64286,
    35833,
    39896,
    43963,
    48026,
    19061,
    23124,
    27191,
    31254,
    2801,
    6864,
    10931,
    14994,
    64814,
    60687,
    56684,
    52557,
    48554,
    44427,
    40424,
    36297,
    31782,
    27655,
    23652,
    19525,
    15522,
    11395,
    7392,
    3265,
    61215,
    65342,
    53085,
    57212,
    44955,
    49082,
    36825,
    40952,
    28183,
    32310,
    20053,
    24180,
    11923,
    16050,
    3793,
    7920
  ]);
  var crc16 = class _crc16 {
    static checksum(data) {
      let crc = 0;
      for (let i2 = 0; i2 < data.byteLength; i2++) {
        let b2 = data[i2];
        crc = crc << 8 & 65535 ^ crc16tab[(crc >> 8 ^ b2) & 255];
      }
      return crc;
    }
    static validate(data, expected) {
      let ba = _crc16.checksum(data);
      return ba == expected;
    }
  };
  var b32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  var base32 = class {
    static encode(src) {
      let bits = 0;
      let value = 0;
      let a2 = new Uint8Array(src);
      let buf = new Uint8Array(src.byteLength * 2);
      let j2 = 0;
      for (let i2 = 0; i2 < a2.byteLength; i2++) {
        value = value << 8 | a2[i2];
        bits += 8;
        while (bits >= 5) {
          let index = value >>> bits - 5 & 31;
          buf[j2++] = b32Alphabet.charAt(index).charCodeAt(0);
          bits -= 5;
        }
      }
      if (bits > 0) {
        let index = value << 5 - bits & 31;
        buf[j2++] = b32Alphabet.charAt(index).charCodeAt(0);
      }
      return buf.slice(0, j2);
    }
    static decode(src) {
      let bits = 0;
      let __byte = 0;
      let j2 = 0;
      let a2 = new Uint8Array(src);
      let out = new Uint8Array(a2.byteLength * 5 / 8 | 0);
      for (let i2 = 0; i2 < a2.byteLength; i2++) {
        let v2 = String.fromCharCode(a2[i2]);
        let vv = b32Alphabet.indexOf(v2);
        if (vv === -1) {
          throw new Error("Illegal Base32 character: " + a2[i2]);
        }
        __byte = __byte << 5 | vv;
        bits += 5;
        if (bits >= 8) {
          out[j2++] = __byte >>> bits - 8 & 255;
          bits -= 8;
        }
      }
      return out.slice(0, j2);
    }
  };
  var NKeysError = class extends Error {
    name;
    code;
    chainedError;
    constructor(code, chainedError) {
      super(code);
      this.name = "NKeysError";
      this.code = code;
      this.chainedError = chainedError;
    }
  };
  function createOperator() {
    return createPair(Prefix.Operator);
  }
  function createAccount() {
    return createPair(Prefix.Account);
  }
  function createUser() {
    return createPair(Prefix.User);
  }
  var NKeysErrorCode;
  (function(NKeysErrorCode2) {
    NKeysErrorCode2["InvalidPrefixByte"] = "nkeys: invalid prefix byte";
    NKeysErrorCode2["InvalidKey"] = "nkeys: invalid key";
    NKeysErrorCode2["InvalidPublicKey"] = "nkeys: invalid public key";
    NKeysErrorCode2["InvalidSeedLen"] = "nkeys: invalid seed length";
    NKeysErrorCode2["InvalidSeed"] = "nkeys: invalid seed";
    NKeysErrorCode2["InvalidEncoding"] = "nkeys: invalid encoded key";
    NKeysErrorCode2["InvalidSignature"] = "nkeys: signature verification failed";
    NKeysErrorCode2["CannotSign"] = "nkeys: cannot sign, no private key available";
    NKeysErrorCode2["PublicKeyOnly"] = "nkeys: no seed or private key available";
    NKeysErrorCode2["InvalidChecksum"] = "nkeys: invalid checksum";
    NKeysErrorCode2["SerializationError"] = "nkeys: serialization error";
    NKeysErrorCode2["ApiError"] = "nkeys: api error";
    NKeysErrorCode2["ClearedPair"] = "nkeys: pair is cleared";
  })(NKeysErrorCode || (NKeysErrorCode = {}));
  var Prefix;
  (function(Prefix2) {
    Prefix2[Prefix2["Seed"] = 144] = "Seed";
    Prefix2[Prefix2["Private"] = 120] = "Private";
    Prefix2[Prefix2["Operator"] = 112] = "Operator";
    Prefix2[Prefix2["Server"] = 104] = "Server";
    Prefix2[Prefix2["Cluster"] = 16] = "Cluster";
    Prefix2[Prefix2["Account"] = 0] = "Account";
    Prefix2[Prefix2["User"] = 160] = "User";
  })(Prefix || (Prefix = {}));
  var Prefixes = class {
    static isValidPublicPrefix(prefix) {
      return prefix == Prefix.Server || prefix == Prefix.Operator || prefix == Prefix.Cluster || prefix == Prefix.Account || prefix == Prefix.User;
    }
    static startsWithValidPrefix(s2) {
      let c2 = s2[0];
      return c2 == "S" || c2 == "P" || c2 == "O" || c2 == "N" || c2 == "C" || c2 == "A" || c2 == "U";
    }
    static isValidPrefix(prefix) {
      let v2 = this.parsePrefix(prefix);
      return v2 != -1;
    }
    static parsePrefix(v2) {
      switch (v2) {
        case Prefix.Seed:
          return Prefix.Seed;
        case Prefix.Private:
          return Prefix.Private;
        case Prefix.Operator:
          return Prefix.Operator;
        case Prefix.Server:
          return Prefix.Server;
        case Prefix.Cluster:
          return Prefix.Cluster;
        case Prefix.Account:
          return Prefix.Account;
        case Prefix.User:
          return Prefix.User;
        default:
          return -1;
      }
    }
  };
  var Codec = class _Codec {
    static encode(prefix, src) {
      if (!src || !(src instanceof Uint8Array)) {
        throw new NKeysError(NKeysErrorCode.SerializationError);
      }
      if (!Prefixes.isValidPrefix(prefix)) {
        throw new NKeysError(NKeysErrorCode.InvalidPrefixByte);
      }
      return _Codec._encode(false, prefix, src);
    }
    static encodeSeed(role, src) {
      if (!src) {
        throw new NKeysError(NKeysErrorCode.ApiError);
      }
      if (!Prefixes.isValidPublicPrefix(role)) {
        throw new NKeysError(NKeysErrorCode.InvalidPrefixByte);
      }
      if (src.byteLength !== 32) {
        throw new NKeysError(NKeysErrorCode.InvalidSeedLen);
      }
      return _Codec._encode(true, role, src);
    }
    static decode(expected, src) {
      if (!Prefixes.isValidPrefix(expected)) {
        throw new NKeysError(NKeysErrorCode.InvalidPrefixByte);
      }
      const raw = _Codec._decode(src);
      if (raw[0] !== expected) {
        throw new NKeysError(NKeysErrorCode.InvalidPrefixByte);
      }
      return raw.slice(1);
    }
    static decodeSeed(src) {
      const raw = _Codec._decode(src);
      const prefix = _Codec._decodePrefix(raw);
      if (prefix[0] != Prefix.Seed) {
        throw new NKeysError(NKeysErrorCode.InvalidSeed);
      }
      if (!Prefixes.isValidPublicPrefix(prefix[1])) {
        throw new NKeysError(NKeysErrorCode.InvalidPrefixByte);
      }
      return {
        buf: raw.slice(2),
        prefix: prefix[1]
      };
    }
    static _encode(seed, role, payload) {
      const payloadOffset = seed ? 2 : 1;
      const payloadLen = payload.byteLength;
      const cap = payloadOffset + payloadLen + 2;
      const checkOffset = payloadOffset + payloadLen;
      const raw = new Uint8Array(cap);
      if (seed) {
        const encodedPrefix = _Codec._encodePrefix(Prefix.Seed, role);
        raw.set(encodedPrefix);
      } else {
        raw[0] = role;
      }
      raw.set(payload, payloadOffset);
      const checksum = crc16.checksum(raw.slice(0, checkOffset));
      const dv = new DataView(raw.buffer);
      dv.setUint16(checkOffset, checksum, true);
      return base32.encode(raw);
    }
    static _decode(src) {
      if (src.byteLength < 4) {
        throw new NKeysError(NKeysErrorCode.InvalidEncoding);
      }
      let raw;
      try {
        raw = base32.decode(src);
      } catch (ex) {
        throw new NKeysError(NKeysErrorCode.InvalidEncoding, ex);
      }
      const checkOffset = raw.byteLength - 2;
      const dv = new DataView(raw.buffer);
      const checksum = dv.getUint16(checkOffset, true);
      const payload = raw.slice(0, checkOffset);
      if (!crc16.validate(payload, checksum)) {
        throw new NKeysError(NKeysErrorCode.InvalidChecksum);
      }
      return payload;
    }
    static _encodePrefix(kind, role) {
      const b1 = kind | role >> 5;
      const b2 = (role & 31) << 3;
      return new Uint8Array([
        b1,
        b2
      ]);
    }
    static _decodePrefix(raw) {
      const b1 = raw[0] & 248;
      const b2 = (raw[0] & 7) << 5 | (raw[1] & 248) >> 3;
      return new Uint8Array([
        b1,
        b2
      ]);
    }
  };
  var KP = class {
    seed;
    constructor(seed) {
      this.seed = seed;
    }
    getRawSeed() {
      if (!this.seed) {
        throw new NKeysError(NKeysErrorCode.ClearedPair);
      }
      let sd = Codec.decodeSeed(this.seed);
      return sd.buf;
    }
    getSeed() {
      if (!this.seed) {
        throw new NKeysError(NKeysErrorCode.ClearedPair);
      }
      return this.seed;
    }
    getPublicKey() {
      if (!this.seed) {
        throw new NKeysError(NKeysErrorCode.ClearedPair);
      }
      const sd = Codec.decodeSeed(this.seed);
      const kp = getEd25519Helper().fromSeed(this.getRawSeed());
      const buf = Codec.encode(sd.prefix, kp.publicKey);
      return new TextDecoder().decode(buf);
    }
    getPrivateKey() {
      if (!this.seed) {
        throw new NKeysError(NKeysErrorCode.ClearedPair);
      }
      const kp = getEd25519Helper().fromSeed(this.getRawSeed());
      return Codec.encode(Prefix.Private, kp.secretKey);
    }
    sign(input) {
      if (!this.seed) {
        throw new NKeysError(NKeysErrorCode.ClearedPair);
      }
      const kp = getEd25519Helper().fromSeed(this.getRawSeed());
      return getEd25519Helper().sign(input, kp.secretKey);
    }
    verify(input, sig) {
      if (!this.seed) {
        throw new NKeysError(NKeysErrorCode.ClearedPair);
      }
      const kp = getEd25519Helper().fromSeed(this.getRawSeed());
      return getEd25519Helper().verify(input, sig, kp.publicKey);
    }
    clear() {
      if (!this.seed) {
        return;
      }
      this.seed.fill(0);
      this.seed = void 0;
    }
  };
  function createPair(prefix) {
    const rawSeed = getEd25519Helper().randomBytes(32);
    let str = Codec.encodeSeed(prefix, new Uint8Array(rawSeed));
    return new KP(str);
  }
  var PublicKey = class {
    publicKey;
    constructor(publicKey) {
      this.publicKey = publicKey;
    }
    getPublicKey() {
      if (!this.publicKey) {
        throw new NKeysError(NKeysErrorCode.ClearedPair);
      }
      return new TextDecoder().decode(this.publicKey);
    }
    getPrivateKey() {
      if (!this.publicKey) {
        throw new NKeysError(NKeysErrorCode.ClearedPair);
      }
      throw new NKeysError(NKeysErrorCode.PublicKeyOnly);
    }
    getSeed() {
      if (!this.publicKey) {
        throw new NKeysError(NKeysErrorCode.ClearedPair);
      }
      throw new NKeysError(NKeysErrorCode.PublicKeyOnly);
    }
    sign(_2) {
      if (!this.publicKey) {
        throw new NKeysError(NKeysErrorCode.ClearedPair);
      }
      throw new NKeysError(NKeysErrorCode.CannotSign);
    }
    verify(input, sig) {
      if (!this.publicKey) {
        throw new NKeysError(NKeysErrorCode.ClearedPair);
      }
      let buf = Codec._decode(this.publicKey);
      return getEd25519Helper().verify(input, sig, buf.slice(1));
    }
    clear() {
      if (!this.publicKey) {
        return;
      }
      this.publicKey.fill(0);
      this.publicKey = void 0;
    }
  };
  function fromPublic(src) {
    const ba = new TextEncoder().encode(src);
    const raw = Codec._decode(ba);
    const prefix = Prefixes.parsePrefix(raw[0]);
    if (Prefixes.isValidPublicPrefix(prefix)) {
      return new PublicKey(ba);
    }
    throw new NKeysError(NKeysErrorCode.InvalidPublicKey);
  }
  function fromSeed(src) {
    Codec.decodeSeed(src);
    return new KP(src);
  }
  function encode1(bytes) {
    return btoa(String.fromCharCode(...bytes));
  }
  function decode1(b64str) {
    const bin = atob(b64str);
    const bytes = new Uint8Array(bin.length);
    for (let i2 = 0; i2 < bin.length; i2++) {
      bytes[i2] = bin.charCodeAt(i2);
    }
    return bytes;
  }
  setEd25519Helper(denoHelper);
  var mod = {
    createAccount,
    createOperator,
    createPair,
    createUser,
    fromPublic,
    fromSeed,
    NKeysError,
    NKeysErrorCode,
    Prefix,
    decode: decode1,
    encode: encode1
  };
  function multiAuthenticator(authenticators) {
    return (nonce) => {
      let auth = {};
      authenticators.forEach((a2) => {
        const args = a2(nonce) || {};
        auth = Object.assign(auth, args);
      });
      return auth;
    };
  }
  function noAuthFn() {
    return () => {
      return;
    };
  }
  function usernamePasswordAuthenticator(user, pass) {
    return () => {
      const u2 = typeof user === "function" ? user() : user;
      const p2 = typeof pass === "function" ? pass() : pass;
      return {
        user: u2,
        pass: p2
      };
    };
  }
  function tokenAuthenticator(token) {
    return () => {
      const auth_token = typeof token === "function" ? token() : token;
      return {
        auth_token
      };
    };
  }
  function nkeyAuthenticator(seed) {
    return (nonce) => {
      const s2 = typeof seed === "function" ? seed() : seed;
      const kp = s2 ? mod.fromSeed(s2) : void 0;
      const nkey = kp ? kp.getPublicKey() : "";
      const challenge = TE.encode(nonce || "");
      const sigBytes = kp !== void 0 && nonce ? kp.sign(challenge) : void 0;
      const sig = sigBytes ? mod.encode(sigBytes) : "";
      return {
        nkey,
        sig
      };
    };
  }
  function jwtAuthenticator(ajwt, seed) {
    return (nonce) => {
      const jwt = typeof ajwt === "function" ? ajwt() : ajwt;
      const fn = nkeyAuthenticator(seed);
      const { nkey, sig } = fn(nonce);
      return {
        jwt,
        nkey,
        sig
      };
    };
  }
  function credsAuthenticator(creds) {
    const fn = typeof creds !== "function" ? () => creds : creds;
    const parse = () => {
      const CREDS = /\s*(?:(?:[-]{3,}[^\n]*[-]{3,}\n)(.+)(?:\n\s*[-]{3,}[^\n]*[-]{3,}\n))/ig;
      const s2 = TD.decode(fn());
      let m2 = CREDS.exec(s2);
      if (!m2) {
        throw NatsError.errorForCode(ErrorCode.BadCreds);
      }
      const jwt = m2[1].trim();
      m2 = CREDS.exec(s2);
      if (!m2) {
        throw NatsError.errorForCode(ErrorCode.BadCreds);
      }
      if (!m2) {
        throw NatsError.errorForCode(ErrorCode.BadCreds);
      }
      const seed = TE.encode(m2[1].trim());
      return {
        jwt,
        seed
      };
    };
    const jwtFn = () => {
      const { jwt } = parse();
      return jwt;
    };
    const nkeyFn = () => {
      const { seed } = parse();
      return seed;
    };
    return jwtAuthenticator(jwtFn, nkeyFn);
  }
  var DEFAULT_PING_INTERVAL = 2 * 60 * 1e3;
  var DEFAULT_MAX_PING_OUT = 2;
  var DEFAULT_RECONNECT_TIME_WAIT = 2 * 1e3;
  function defaultOptions() {
    return {
      maxPingOut: 2,
      maxReconnectAttempts: 10,
      noRandomize: false,
      pedantic: false,
      pingInterval: DEFAULT_PING_INTERVAL,
      reconnect: true,
      reconnectJitter: 100,
      reconnectJitterTLS: 1e3,
      reconnectTimeWait: DEFAULT_RECONNECT_TIME_WAIT,
      tls: void 0,
      verbose: false,
      waitOnFirstConnect: false,
      ignoreAuthErrorAbort: false
    };
  }
  function buildAuthenticator(opts) {
    const buf = [];
    if (typeof opts.authenticator === "function") {
      buf.push(opts.authenticator);
    }
    if (Array.isArray(opts.authenticator)) {
      buf.push(...opts.authenticator);
    }
    if (opts.token) {
      buf.push(tokenAuthenticator(opts.token));
    }
    if (opts.user) {
      buf.push(usernamePasswordAuthenticator(opts.user, opts.pass));
    }
    return buf.length === 0 ? noAuthFn() : multiAuthenticator(buf);
  }
  function parseOptions(opts) {
    const dhp = `${DEFAULT_HOST}:${defaultPort()}`;
    opts = opts || {
      servers: [
        dhp
      ]
    };
    opts.servers = opts.servers || [];
    if (typeof opts.servers === "string") {
      opts.servers = [
        opts.servers
      ];
    }
    if (opts.servers.length > 0 && opts.port) {
      throw new NatsError("port and servers options are mutually exclusive", ErrorCode.InvalidOption);
    }
    if (opts.servers.length === 0 && opts.port) {
      opts.servers = [
        `${DEFAULT_HOST}:${opts.port}`
      ];
    }
    if (opts.servers && opts.servers.length === 0) {
      opts.servers = [
        dhp
      ];
    }
    const options = extend(defaultOptions(), opts);
    options.authenticator = buildAuthenticator(options);
    [
      "reconnectDelayHandler",
      "authenticator"
    ].forEach((n2) => {
      if (options[n2] && typeof options[n2] !== "function") {
        throw new NatsError(`${n2} option should be a function`, ErrorCode.NotFunction);
      }
    });
    if (!options.reconnectDelayHandler) {
      options.reconnectDelayHandler = () => {
        let extra = options.tls ? options.reconnectJitterTLS : options.reconnectJitter;
        if (extra) {
          extra++;
          extra = Math.floor(Math.random() * extra);
        }
        return options.reconnectTimeWait + extra;
      };
    }
    if (options.inboxPrefix) {
      try {
        createInbox(options.inboxPrefix);
      } catch (err) {
        throw new NatsError(err.message, ErrorCode.ApiError);
      }
    }
    if (options.resolve === void 0) {
      options.resolve = typeof getResolveFn() === "function";
    }
    if (options.resolve) {
      if (typeof getResolveFn() !== "function") {
        throw new NatsError(`'resolve' is not supported on this client`, ErrorCode.InvalidOption);
      }
    }
    return options;
  }
  function checkOptions(info, options) {
    const { proto, tls_required: tlsRequired, tls_available: tlsAvailable } = info;
    if ((proto === void 0 || proto < 1) && options.noEcho) {
      throw new NatsError("noEcho", ErrorCode.ServerOptionNotAvailable);
    }
    const tls = tlsRequired || tlsAvailable || false;
    if (options.tls && !tls) {
      throw new NatsError("tls", ErrorCode.ServerOptionNotAvailable);
    }
  }
  var FLUSH_THRESHOLD = 1024 * 32;
  var INFO = /^INFO\s+([^\r\n]+)\r\n/i;
  var PONG_CMD = encode("PONG\r\n");
  var PING_CMD = encode("PING\r\n");
  var Connect = class {
    echo;
    no_responders;
    protocol;
    verbose;
    pedantic;
    jwt;
    nkey;
    sig;
    user;
    pass;
    auth_token;
    tls_required;
    name;
    lang;
    version;
    headers;
    constructor(transport, opts, nonce) {
      this.protocol = 1;
      this.version = transport.version;
      this.lang = transport.lang;
      this.echo = opts.noEcho ? false : void 0;
      this.verbose = opts.verbose;
      this.pedantic = opts.pedantic;
      this.tls_required = opts.tls ? true : void 0;
      this.name = opts.name;
      const creds = (opts && typeof opts.authenticator === "function" ? opts.authenticator(nonce) : {}) || {};
      extend(this, creds);
    }
  };
  var SubscriptionImpl = class extends QueuedIteratorImpl {
    sid;
    queue;
    draining;
    max;
    subject;
    drained;
    protocol;
    timer;
    info;
    cleanupFn;
    closed;
    requestSubject;
    constructor(protocol, subject, opts = {}) {
      super();
      extend(this, opts);
      this.protocol = protocol;
      this.subject = subject;
      this.draining = false;
      this.noIterator = typeof opts.callback === "function";
      this.closed = deferred();
      const asyncTraces = !(protocol.options?.noAsyncTraces || false);
      if (opts.timeout) {
        this.timer = timeout(opts.timeout, asyncTraces);
        this.timer.then(() => {
          this.timer = void 0;
        }).catch((err) => {
          this.stop(err);
          if (this.noIterator) {
            this.callback(err, {});
          }
        });
      }
      if (!this.noIterator) {
        this.iterClosed.then(() => {
          this.closed.resolve();
          this.unsubscribe();
        });
      }
    }
    setPrePostHandlers(opts) {
      if (this.noIterator) {
        const uc = this.callback;
        const ingestion = opts.ingestionFilterFn ? opts.ingestionFilterFn : () => {
          return {
            ingest: true,
            protocol: false
          };
        };
        const filter = opts.protocolFilterFn ? opts.protocolFilterFn : () => {
          return true;
        };
        const dispatched = opts.dispatchedFn ? opts.dispatchedFn : () => {
        };
        this.callback = (err, msg) => {
          const { ingest } = ingestion(msg);
          if (!ingest) {
            return;
          }
          if (filter(msg)) {
            uc(err, msg);
            dispatched(msg);
          }
        };
      } else {
        this.protocolFilterFn = opts.protocolFilterFn;
        this.dispatchedFn = opts.dispatchedFn;
      }
    }
    callback(err, msg) {
      this.cancelTimeout();
      err ? this.stop(err) : this.push(msg);
    }
    close() {
      if (!this.isClosed()) {
        this.cancelTimeout();
        const fn = () => {
          this.stop();
          if (this.cleanupFn) {
            try {
              this.cleanupFn(this, this.info);
            } catch (_err) {
            }
          }
          this.closed.resolve();
        };
        if (this.noIterator) {
          fn();
        } else {
          this.push(fn);
        }
      }
    }
    unsubscribe(max) {
      this.protocol.unsubscribe(this, max);
    }
    cancelTimeout() {
      if (this.timer) {
        this.timer.cancel();
        this.timer = void 0;
      }
    }
    drain() {
      if (this.protocol.isClosed()) {
        return Promise.reject(NatsError.errorForCode(ErrorCode.ConnectionClosed));
      }
      if (this.isClosed()) {
        return Promise.reject(NatsError.errorForCode(ErrorCode.SubClosed));
      }
      if (!this.drained) {
        this.draining = true;
        this.protocol.unsub(this);
        this.drained = this.protocol.flush(deferred()).then(() => {
          this.protocol.subscriptions.cancel(this);
        }).catch(() => {
          this.protocol.subscriptions.cancel(this);
        });
      }
      return this.drained;
    }
    isDraining() {
      return this.draining;
    }
    isClosed() {
      return this.done;
    }
    getSubject() {
      return this.subject;
    }
    getMax() {
      return this.max;
    }
    getID() {
      return this.sid;
    }
  };
  var Subscriptions = class {
    mux;
    subs;
    sidCounter;
    constructor() {
      this.sidCounter = 0;
      this.mux = null;
      this.subs = /* @__PURE__ */ new Map();
    }
    size() {
      return this.subs.size;
    }
    add(s2) {
      this.sidCounter++;
      s2.sid = this.sidCounter;
      this.subs.set(s2.sid, s2);
      return s2;
    }
    setMux(s2) {
      this.mux = s2;
      return s2;
    }
    getMux() {
      return this.mux;
    }
    get(sid) {
      return this.subs.get(sid);
    }
    resub(s2) {
      this.sidCounter++;
      this.subs.delete(s2.sid);
      s2.sid = this.sidCounter;
      this.subs.set(s2.sid, s2);
      return s2;
    }
    all() {
      return Array.from(this.subs.values());
    }
    cancel(s2) {
      if (s2) {
        s2.close();
        this.subs.delete(s2.sid);
      }
    }
    handleError(err) {
      if (err && err.permissionContext) {
        const ctx = err.permissionContext;
        const subs = this.all();
        let sub;
        if (ctx.operation === "subscription") {
          sub = subs.find((s2) => {
            return s2.subject === ctx.subject && s2.queue === ctx.queue;
          });
        }
        if (ctx.operation === "publish") {
          sub = subs.find((s2) => {
            return s2.requestSubject === ctx.subject;
          });
        }
        if (sub) {
          sub.callback(err, {});
          sub.close();
          this.subs.delete(sub.sid);
          return sub !== this.mux;
        }
      }
      return false;
    }
    close() {
      this.subs.forEach((sub) => {
        sub.close();
      });
    }
  };
  var ProtocolHandler = class _ProtocolHandler {
    connected;
    connectedOnce;
    infoReceived;
    info;
    muxSubscriptions;
    options;
    outbound;
    pongs;
    subscriptions;
    transport;
    noMorePublishing;
    connectError;
    publisher;
    _closed;
    closed;
    listeners;
    heartbeats;
    parser;
    outMsgs;
    inMsgs;
    outBytes;
    inBytes;
    pendingLimit;
    lastError;
    abortReconnect;
    whyClosed;
    servers;
    server;
    features;
    connectPromise;
    constructor(options, publisher) {
      this._closed = false;
      this.connected = false;
      this.connectedOnce = false;
      this.infoReceived = false;
      this.noMorePublishing = false;
      this.abortReconnect = false;
      this.listeners = [];
      this.pendingLimit = FLUSH_THRESHOLD;
      this.outMsgs = 0;
      this.inMsgs = 0;
      this.outBytes = 0;
      this.inBytes = 0;
      this.options = options;
      this.publisher = publisher;
      this.subscriptions = new Subscriptions();
      this.muxSubscriptions = new MuxSubscription();
      this.outbound = new DataBuffer();
      this.pongs = [];
      this.whyClosed = "";
      this.pendingLimit = options.pendingLimit || this.pendingLimit;
      this.features = new Features({
        major: 0,
        minor: 0,
        micro: 0
      });
      this.connectPromise = null;
      const servers = typeof options.servers === "string" ? [
        options.servers
      ] : options.servers;
      this.servers = new Servers(servers, {
        randomize: !options.noRandomize
      });
      this.closed = deferred();
      this.parser = new Parser(this);
      this.heartbeats = new Heartbeat(this, this.options.pingInterval || DEFAULT_PING_INTERVAL, this.options.maxPingOut || DEFAULT_MAX_PING_OUT);
    }
    resetOutbound() {
      this.outbound.reset();
      const pongs = this.pongs;
      this.pongs = [];
      const err = NatsError.errorForCode(ErrorCode.Disconnect);
      err.stack = "";
      pongs.forEach((p2) => {
        p2.reject(err);
      });
      this.parser = new Parser(this);
      this.infoReceived = false;
    }
    dispatchStatus(status) {
      this.listeners.forEach((q) => {
        q.push(status);
      });
    }
    status() {
      const iter = new QueuedIteratorImpl();
      this.listeners.push(iter);
      return iter;
    }
    prepare() {
      if (this.transport) {
        this.transport.discard();
      }
      this.info = void 0;
      this.resetOutbound();
      const pong = deferred();
      pong.catch(() => {
      });
      this.pongs.unshift(pong);
      this.connectError = (err) => {
        pong.reject(err);
      };
      this.transport = newTransport();
      this.transport.closed().then(async (_err) => {
        this.connected = false;
        if (!this.isClosed()) {
          await this.disconnected(this.transport.closeError || this.lastError);
          return;
        }
      });
      return pong;
    }
    disconnect() {
      this.dispatchStatus({
        type: DebugEvents.StaleConnection,
        data: ""
      });
      this.transport.disconnect();
    }
    reconnect() {
      if (this.connected) {
        this.dispatchStatus({
          type: DebugEvents.ClientInitiatedReconnect,
          data: ""
        });
        this.transport.disconnect();
      }
      return Promise.resolve();
    }
    async disconnected(err) {
      this.dispatchStatus({
        type: Events.Disconnect,
        data: this.servers.getCurrentServer().toString()
      });
      if (this.options.reconnect) {
        await this.dialLoop().then(() => {
          this.dispatchStatus({
            type: Events.Reconnect,
            data: this.servers.getCurrentServer().toString()
          });
          if (this.lastError?.code === ErrorCode.AuthenticationExpired) {
            this.lastError = void 0;
          }
        }).catch((err2) => {
          this._close(err2);
        });
      } else {
        await this._close(err);
      }
    }
    async dial(srv) {
      const pong = this.prepare();
      let timer;
      try {
        timer = timeout(this.options.timeout || 2e4);
        const cp = this.transport.connect(srv, this.options);
        await Promise.race([
          cp,
          timer
        ]);
        (async () => {
          try {
            for await (const b2 of this.transport) {
              this.parser.parse(b2);
            }
          } catch (err) {
            console.log("reader closed", err);
          }
        })().then();
      } catch (err) {
        pong.reject(err);
      }
      try {
        await Promise.race([
          timer,
          pong
        ]);
        if (timer) {
          timer.cancel();
        }
        this.connected = true;
        this.connectError = void 0;
        this.sendSubscriptions();
        this.connectedOnce = true;
        this.server.didConnect = true;
        this.server.reconnects = 0;
        this.flushPending();
        this.heartbeats.start();
      } catch (err) {
        if (timer) {
          timer.cancel();
        }
        await this.transport.close(err);
        throw err;
      }
    }
    async _doDial(srv) {
      const { resolve } = this.options;
      const alts = await srv.resolve({
        fn: getResolveFn(),
        debug: this.options.debug,
        randomize: !this.options.noRandomize,
        resolve
      });
      let lastErr = null;
      for (const a2 of alts) {
        try {
          lastErr = null;
          this.dispatchStatus({
            type: DebugEvents.Reconnecting,
            data: a2.toString()
          });
          await this.dial(a2);
          return;
        } catch (err) {
          lastErr = err;
        }
      }
      throw lastErr;
    }
    dialLoop() {
      if (this.connectPromise === null) {
        this.connectPromise = this.dodialLoop();
        this.connectPromise.then(() => {
        }).catch(() => {
        }).finally(() => {
          this.connectPromise = null;
        });
      }
      return this.connectPromise;
    }
    async dodialLoop() {
      let lastError;
      while (true) {
        if (this._closed) {
          this.servers.clear();
        }
        const wait = this.options.reconnectDelayHandler ? this.options.reconnectDelayHandler() : DEFAULT_RECONNECT_TIME_WAIT;
        let maxWait = wait;
        const srv = this.selectServer();
        if (!srv || this.abortReconnect) {
          if (lastError) {
            throw lastError;
          } else if (this.lastError) {
            throw this.lastError;
          } else {
            throw NatsError.errorForCode(ErrorCode.ConnectionRefused);
          }
        }
        const now = Date.now();
        if (srv.lastConnect === 0 || srv.lastConnect + wait <= now) {
          srv.lastConnect = Date.now();
          try {
            await this._doDial(srv);
            break;
          } catch (err) {
            lastError = err;
            if (!this.connectedOnce) {
              if (this.options.waitOnFirstConnect) {
                continue;
              }
              this.servers.removeCurrentServer();
            }
            srv.reconnects++;
            const mra = this.options.maxReconnectAttempts || 0;
            if (mra !== -1 && srv.reconnects >= mra) {
              this.servers.removeCurrentServer();
            }
          }
        } else {
          maxWait = Math.min(maxWait, srv.lastConnect + wait - now);
          await delay(maxWait);
        }
      }
    }
    static async connect(options, publisher) {
      const h2 = new _ProtocolHandler(options, publisher);
      await h2.dialLoop();
      return h2;
    }
    static toError(s2) {
      const t2 = s2 ? s2.toLowerCase() : "";
      if (t2.indexOf("permissions violation") !== -1) {
        const err = new NatsError(s2, ErrorCode.PermissionsViolation);
        const m2 = s2.match(/(Publish|Subscription) to "(\S+)"/);
        if (m2) {
          err.permissionContext = {
            operation: m2[1].toLowerCase(),
            subject: m2[2],
            queue: void 0
          };
          const qm = s2.match(/using queue "(\S+)"/);
          if (qm) {
            err.permissionContext.queue = qm[1];
          }
        }
        return err;
      } else if (t2.indexOf("authorization violation") !== -1) {
        return new NatsError(s2, ErrorCode.AuthorizationViolation);
      } else if (t2.indexOf("user authentication expired") !== -1) {
        return new NatsError(s2, ErrorCode.AuthenticationExpired);
      } else if (t2.indexOf("account authentication expired") != -1) {
        return new NatsError(s2, ErrorCode.AccountExpired);
      } else if (t2.indexOf("authentication timeout") !== -1) {
        return new NatsError(s2, ErrorCode.AuthenticationTimeout);
      } else {
        return new NatsError(s2, ErrorCode.ProtocolError);
      }
    }
    processMsg(msg, data) {
      this.inMsgs++;
      this.inBytes += data.length;
      if (!this.subscriptions.sidCounter) {
        return;
      }
      const sub = this.subscriptions.get(msg.sid);
      if (!sub) {
        return;
      }
      sub.received += 1;
      if (sub.callback) {
        sub.callback(null, new MsgImpl(msg, data, this));
      }
      if (sub.max !== void 0 && sub.received >= sub.max) {
        sub.unsubscribe();
      }
    }
    processError(m2) {
      const s2 = decode(m2);
      const err = _ProtocolHandler.toError(s2);
      const status = {
        type: Events.Error,
        data: err.code
      };
      if (err.isPermissionError()) {
        let isMuxPermissionError = false;
        if (err.permissionContext) {
          status.permissionContext = err.permissionContext;
          const mux = this.subscriptions.getMux();
          isMuxPermissionError = mux?.subject === err.permissionContext.subject;
        }
        this.subscriptions.handleError(err);
        this.muxSubscriptions.handleError(isMuxPermissionError, err);
        if (isMuxPermissionError) {
          this.subscriptions.setMux(null);
        }
      }
      this.dispatchStatus(status);
      this.handleError(err);
    }
    handleError(err) {
      if (err.isAuthError()) {
        this.handleAuthError(err);
      } else if (err.isProtocolError()) {
        this.lastError = err;
      } else if (err.isAuthTimeout()) {
        this.lastError = err;
      }
      if (!err.isPermissionError()) {
        this.lastError = err;
      }
    }
    handleAuthError(err) {
      if (this.lastError && err.code === this.lastError.code && this.options.ignoreAuthErrorAbort === false) {
        this.abortReconnect = true;
      }
      if (this.connectError) {
        this.connectError(err);
      } else {
        this.disconnect();
      }
    }
    processPing() {
      this.transport.send(PONG_CMD);
    }
    processPong() {
      const cb = this.pongs.shift();
      if (cb) {
        cb.resolve();
      }
    }
    processInfo(m2) {
      const info = JSON.parse(decode(m2));
      this.info = info;
      const updates = this.options && this.options.ignoreClusterUpdates ? void 0 : this.servers.update(info, this.transport.isEncrypted());
      if (!this.infoReceived) {
        this.features.update(parseSemVer(info.version));
        this.infoReceived = true;
        if (this.transport.isEncrypted()) {
          this.servers.updateTLSName();
        }
        const { version, lang } = this.transport;
        try {
          const c2 = new Connect({
            version,
            lang
          }, this.options, info.nonce);
          if (info.headers) {
            c2.headers = true;
            c2.no_responders = true;
          }
          const cs = JSON.stringify(c2);
          this.transport.send(encode(`CONNECT ${cs}${CR_LF}`));
          this.transport.send(PING_CMD);
        } catch (err) {
          this._close(err);
        }
      }
      if (updates) {
        this.dispatchStatus({
          type: Events.Update,
          data: updates
        });
      }
      const ldm = info.ldm !== void 0 ? info.ldm : false;
      if (ldm) {
        this.dispatchStatus({
          type: Events.LDM,
          data: this.servers.getCurrentServer().toString()
        });
      }
    }
    push(e2) {
      switch (e2.kind) {
        case Kind.MSG: {
          const { msg, data } = e2;
          this.processMsg(msg, data);
          break;
        }
        case Kind.OK:
          break;
        case Kind.ERR:
          this.processError(e2.data);
          break;
        case Kind.PING:
          this.processPing();
          break;
        case Kind.PONG:
          this.processPong();
          break;
        case Kind.INFO:
          this.processInfo(e2.data);
          break;
      }
    }
    sendCommand(cmd, ...payloads) {
      const len = this.outbound.length();
      let buf;
      if (typeof cmd === "string") {
        buf = encode(cmd);
      } else {
        buf = cmd;
      }
      this.outbound.fill(buf, ...payloads);
      if (len === 0) {
        queueMicrotask(() => {
          this.flushPending();
        });
      } else if (this.outbound.size() >= this.pendingLimit) {
        this.flushPending();
      }
    }
    publish(subject, payload = Empty, options) {
      let data;
      if (payload instanceof Uint8Array) {
        data = payload;
      } else if (typeof payload === "string") {
        data = TE.encode(payload);
      } else {
        throw NatsError.errorForCode(ErrorCode.BadPayload);
      }
      let len = data.length;
      options = options || {};
      options.reply = options.reply || "";
      let headers2 = Empty;
      let hlen = 0;
      if (options.headers) {
        if (this.info && !this.info.headers) {
          throw new NatsError("headers", ErrorCode.ServerOptionNotAvailable);
        }
        const hdrs = options.headers;
        headers2 = hdrs.encode();
        hlen = headers2.length;
        len = data.length + hlen;
      }
      if (this.info && len > this.info.max_payload) {
        throw NatsError.errorForCode(ErrorCode.MaxPayloadExceeded);
      }
      this.outBytes += len;
      this.outMsgs++;
      let proto;
      if (options.headers) {
        if (options.reply) {
          proto = `HPUB ${subject} ${options.reply} ${hlen} ${len}\r
`;
        } else {
          proto = `HPUB ${subject} ${hlen} ${len}\r
`;
        }
        this.sendCommand(proto, headers2, data, CRLF);
      } else {
        if (options.reply) {
          proto = `PUB ${subject} ${options.reply} ${len}\r
`;
        } else {
          proto = `PUB ${subject} ${len}\r
`;
        }
        this.sendCommand(proto, data, CRLF);
      }
    }
    request(r2) {
      this.initMux();
      this.muxSubscriptions.add(r2);
      return r2;
    }
    subscribe(s2) {
      this.subscriptions.add(s2);
      this._subunsub(s2);
      return s2;
    }
    _sub(s2) {
      if (s2.queue) {
        this.sendCommand(`SUB ${s2.subject} ${s2.queue} ${s2.sid}\r
`);
      } else {
        this.sendCommand(`SUB ${s2.subject} ${s2.sid}\r
`);
      }
    }
    _subunsub(s2) {
      this._sub(s2);
      if (s2.max) {
        this.unsubscribe(s2, s2.max);
      }
      return s2;
    }
    unsubscribe(s2, max) {
      this.unsub(s2, max);
      if (s2.max === void 0 || s2.received >= s2.max) {
        this.subscriptions.cancel(s2);
      }
    }
    unsub(s2, max) {
      if (!s2 || this.isClosed()) {
        return;
      }
      if (max) {
        this.sendCommand(`UNSUB ${s2.sid} ${max}\r
`);
      } else {
        this.sendCommand(`UNSUB ${s2.sid}\r
`);
      }
      s2.max = max;
    }
    resub(s2, subject) {
      if (!s2 || this.isClosed()) {
        return;
      }
      this.unsub(s2);
      s2.subject = subject;
      this.subscriptions.resub(s2);
      this._sub(s2);
    }
    flush(p2) {
      if (!p2) {
        p2 = deferred();
      }
      this.pongs.push(p2);
      this.outbound.fill(PING_CMD);
      this.flushPending();
      return p2;
    }
    sendSubscriptions() {
      const cmds = [];
      this.subscriptions.all().forEach((s2) => {
        const sub = s2;
        if (sub.queue) {
          cmds.push(`SUB ${sub.subject} ${sub.queue} ${sub.sid}${CR_LF}`);
        } else {
          cmds.push(`SUB ${sub.subject} ${sub.sid}${CR_LF}`);
        }
      });
      if (cmds.length) {
        this.transport.send(encode(cmds.join("")));
      }
    }
    async _close(err) {
      if (this._closed) {
        return;
      }
      this.whyClosed = new Error("close trace").stack || "";
      this.heartbeats.cancel();
      if (this.connectError) {
        this.connectError(err);
        this.connectError = void 0;
      }
      this.muxSubscriptions.close();
      this.subscriptions.close();
      this.listeners.forEach((l2) => {
        l2.stop();
      });
      this._closed = true;
      await this.transport.close(err);
      await this.closed.resolve(err);
    }
    close() {
      return this._close();
    }
    isClosed() {
      return this._closed;
    }
    drain() {
      const subs = this.subscriptions.all();
      const promises = [];
      subs.forEach((sub) => {
        promises.push(sub.drain());
      });
      return Promise.all(promises).then(async () => {
        this.noMorePublishing = true;
        await this.flush();
        return this.close();
      }).catch(() => {
      });
    }
    flushPending() {
      if (!this.infoReceived || !this.connected) {
        return;
      }
      if (this.outbound.size()) {
        const d2 = this.outbound.drain();
        this.transport.send(d2);
      }
    }
    initMux() {
      const mux = this.subscriptions.getMux();
      if (!mux) {
        const inbox = this.muxSubscriptions.init(this.options.inboxPrefix);
        const sub = new SubscriptionImpl(this, `${inbox}*`);
        sub.callback = this.muxSubscriptions.dispatcher();
        this.subscriptions.setMux(sub);
        this.subscribe(sub);
      }
    }
    selectServer() {
      const server = this.servers.selectServer();
      if (server === void 0) {
        return void 0;
      }
      this.server = server;
      return this.server;
    }
    getServer() {
      return this.server;
    }
  };
  var ServiceApiPrefix = "$SRV";
  var ServiceMsgImpl = class {
    msg;
    constructor(msg) {
      this.msg = msg;
    }
    get data() {
      return this.msg.data;
    }
    get sid() {
      return this.msg.sid;
    }
    get subject() {
      return this.msg.subject;
    }
    get reply() {
      return this.msg.reply || "";
    }
    get headers() {
      return this.msg.headers;
    }
    respond(data, opts) {
      return this.msg.respond(data, opts);
    }
    respondError(code, description, data, opts) {
      opts = opts || {};
      opts.headers = opts.headers || headers();
      opts.headers?.set(ServiceErrorCodeHeader, `${code}`);
      opts.headers?.set(ServiceErrorHeader, description);
      return this.msg.respond(data, opts);
    }
    json(reviver) {
      return this.msg.json(reviver);
    }
    string() {
      return this.msg.string();
    }
  };
  var ServiceGroupImpl = class _ServiceGroupImpl {
    subject;
    queue;
    srv;
    constructor(parent, name = "", queue = "") {
      if (name !== "") {
        validInternalToken("service group", name);
      }
      let root = "";
      if (parent instanceof ServiceImpl) {
        this.srv = parent;
        root = "";
      } else if (parent instanceof _ServiceGroupImpl) {
        const sg = parent;
        this.srv = sg.srv;
        if (queue === "" && sg.queue !== "") {
          queue = sg.queue;
        }
        root = sg.subject;
      } else {
        throw new Error("unknown ServiceGroup type");
      }
      this.subject = this.calcSubject(root, name);
      this.queue = queue;
    }
    calcSubject(root, name = "") {
      if (name === "") {
        return root;
      }
      return root !== "" ? `${root}.${name}` : name;
    }
    addEndpoint(name = "", opts) {
      opts = opts || {
        subject: name
      };
      const args = typeof opts === "function" ? {
        handler: opts,
        subject: name
      } : opts;
      validateName("endpoint", name);
      let { subject, handler, metadata, queue } = args;
      subject = subject || name;
      queue = queue || this.queue;
      validSubjectName("endpoint subject", subject);
      subject = this.calcSubject(this.subject, subject);
      const ne = {
        name,
        subject,
        queue,
        handler,
        metadata
      };
      return this.srv._addEndpoint(ne);
    }
    addGroup(name = "", queue = "") {
      return new _ServiceGroupImpl(this, name, queue);
    }
  };
  function validSubjectName(context, subj) {
    if (subj === "") {
      throw new Error(`${context} cannot be empty`);
    }
    if (subj.indexOf(" ") !== -1) {
      throw new Error(`${context} cannot contain spaces: '${subj}'`);
    }
    const tokens = subj.split(".");
    tokens.forEach((v2, idx) => {
      if (v2 === ">" && idx !== tokens.length - 1) {
        throw new Error(`${context} cannot have internal '>': '${subj}'`);
      }
    });
  }
  function validInternalToken(context, subj) {
    if (subj.indexOf(" ") !== -1) {
      throw new Error(`${context} cannot contain spaces: '${subj}'`);
    }
    const tokens = subj.split(".");
    tokens.forEach((v2) => {
      if (v2 === ">") {
        throw new Error(`${context} name cannot contain internal '>': '${subj}'`);
      }
    });
  }
  var ServiceImpl = class _ServiceImpl {
    nc;
    _id;
    config;
    handlers;
    internal;
    _stopped;
    _done;
    started;
    static controlSubject(verb, name = "", id = "", prefix) {
      const pre = prefix ?? ServiceApiPrefix;
      if (name === "" && id === "") {
        return `${pre}.${verb}`;
      }
      validateName("control subject name", name);
      if (id !== "") {
        validateName("control subject id", id);
        return `${pre}.${verb}.${name}.${id}`;
      }
      return `${pre}.${verb}.${name}`;
    }
    constructor(nc, config = {
      name: "",
      version: ""
    }) {
      this.nc = nc;
      this.config = Object.assign({}, config);
      if (!this.config.queue) {
        this.config.queue = "q";
      }
      validateName("name", this.config.name);
      validateName("queue", this.config.queue);
      parseSemVer(this.config.version);
      this._id = nuid.next();
      this.internal = [];
      this._done = deferred();
      this._stopped = false;
      this.handlers = [];
      this.started = (/* @__PURE__ */ new Date()).toISOString();
      this.reset();
      this.nc.closed().then(() => {
        this.close().catch();
      }).catch((err) => {
        this.close(err).catch();
      });
    }
    get subjects() {
      return this.handlers.filter((s2) => {
        return s2.internal === false;
      }).map((s2) => {
        return s2.subject;
      });
    }
    get id() {
      return this._id;
    }
    get name() {
      return this.config.name;
    }
    get description() {
      return this.config.description ?? "";
    }
    get version() {
      return this.config.version;
    }
    get metadata() {
      return this.config.metadata;
    }
    errorToHeader(err) {
      const h2 = headers();
      if (err instanceof ServiceError) {
        const se = err;
        h2.set(ServiceErrorHeader, se.message);
        h2.set(ServiceErrorCodeHeader, `${se.code}`);
      } else {
        h2.set(ServiceErrorHeader, err.message);
        h2.set(ServiceErrorCodeHeader, "500");
      }
      return h2;
    }
    setupHandler(h2, internal = false) {
      const queue = internal ? "" : h2.queue ? h2.queue : this.config.queue;
      const { name, subject, handler } = h2;
      const sv = h2;
      sv.internal = internal;
      if (internal) {
        this.internal.push(sv);
      }
      sv.stats = new NamedEndpointStatsImpl(name, subject, queue);
      sv.queue = queue;
      const callback = handler ? (err, msg) => {
        if (err) {
          this.close(err);
          return;
        }
        const start = Date.now();
        try {
          handler(err, new ServiceMsgImpl(msg));
        } catch (err2) {
          sv.stats.countError(err2);
          msg?.respond(Empty, {
            headers: this.errorToHeader(err2)
          });
        } finally {
          sv.stats.countLatency(start);
        }
      } : void 0;
      sv.sub = this.nc.subscribe(subject, {
        callback,
        queue
      });
      sv.sub.closed.then(() => {
        if (!this._stopped) {
          this.close(new Error(`required subscription ${h2.subject} stopped`)).catch();
        }
      }).catch((err) => {
        if (!this._stopped) {
          const ne = new Error(`required subscription ${h2.subject} errored: ${err.message}`);
          ne.stack = err.stack;
          this.close(ne).catch();
        }
      });
      return sv;
    }
    info() {
      return {
        type: ServiceResponseType.INFO,
        name: this.name,
        id: this.id,
        version: this.version,
        description: this.description,
        metadata: this.metadata,
        endpoints: this.endpoints()
      };
    }
    endpoints() {
      return this.handlers.map((v2) => {
        const { subject, metadata, name, queue } = v2;
        return {
          subject,
          metadata,
          name,
          queue_group: queue
        };
      });
    }
    async stats() {
      const endpoints = [];
      for (const h2 of this.handlers) {
        if (typeof this.config.statsHandler === "function") {
          try {
            h2.stats.data = await this.config.statsHandler(h2);
          } catch (err) {
            h2.stats.countError(err);
          }
        }
        endpoints.push(h2.stats.stats(h2.qi));
      }
      return {
        type: ServiceResponseType.STATS,
        name: this.name,
        id: this.id,
        version: this.version,
        started: this.started,
        metadata: this.metadata,
        endpoints
      };
    }
    addInternalHandler(verb, handler) {
      const v2 = `${verb}`.toUpperCase();
      this._doAddInternalHandler(`${v2}-all`, verb, handler);
      this._doAddInternalHandler(`${v2}-kind`, verb, handler, this.name);
      this._doAddInternalHandler(`${v2}`, verb, handler, this.name, this.id);
    }
    _doAddInternalHandler(name, verb, handler, kind = "", id = "") {
      const endpoint = {};
      endpoint.name = name;
      endpoint.subject = _ServiceImpl.controlSubject(verb, kind, id);
      endpoint.handler = handler;
      this.setupHandler(endpoint, true);
    }
    start() {
      const jc = JSONCodec();
      const statsHandler = (err, msg) => {
        if (err) {
          this.close(err);
          return Promise.reject(err);
        }
        return this.stats().then((s2) => {
          msg?.respond(jc.encode(s2));
          return Promise.resolve();
        });
      };
      const infoHandler = (err, msg) => {
        if (err) {
          this.close(err);
          return Promise.reject(err);
        }
        msg?.respond(jc.encode(this.info()));
        return Promise.resolve();
      };
      const ping = jc.encode(this.ping());
      const pingHandler = (err, msg) => {
        if (err) {
          this.close(err).then().catch();
          return Promise.reject(err);
        }
        msg.respond(ping);
        return Promise.resolve();
      };
      this.addInternalHandler(ServiceVerb.PING, pingHandler);
      this.addInternalHandler(ServiceVerb.STATS, statsHandler);
      this.addInternalHandler(ServiceVerb.INFO, infoHandler);
      this.handlers.forEach((h2) => {
        const { subject } = h2;
        if (typeof subject !== "string") {
          return;
        }
        if (h2.handler === null) {
          return;
        }
        this.setupHandler(h2);
      });
      return Promise.resolve(this);
    }
    close(err) {
      if (this._stopped) {
        return this._done;
      }
      this._stopped = true;
      let buf = [];
      if (!this.nc.isClosed()) {
        buf = this.handlers.concat(this.internal).map((h2) => {
          return h2.sub.drain();
        });
      }
      Promise.allSettled(buf).then(() => {
        this._done.resolve(err ? err : null);
      });
      return this._done;
    }
    get stopped() {
      return this._done;
    }
    get isStopped() {
      return this._stopped;
    }
    stop(err) {
      return this.close(err);
    }
    ping() {
      return {
        type: ServiceResponseType.PING,
        name: this.name,
        id: this.id,
        version: this.version,
        metadata: this.metadata
      };
    }
    reset() {
      this.started = (/* @__PURE__ */ new Date()).toISOString();
      if (this.handlers) {
        for (const h2 of this.handlers) {
          h2.stats.reset(h2.qi);
        }
      }
    }
    addGroup(name, queue) {
      return new ServiceGroupImpl(this, name, queue);
    }
    addEndpoint(name, handler) {
      const sg = new ServiceGroupImpl(this);
      return sg.addEndpoint(name, handler);
    }
    _addEndpoint(e2) {
      const qi = new QueuedIteratorImpl();
      qi.noIterator = typeof e2.handler === "function";
      if (!qi.noIterator) {
        e2.handler = (err, msg) => {
          err ? this.stop(err).catch() : qi.push(new ServiceMsgImpl(msg));
        };
        qi.iterClosed.then(() => {
          this.close().catch();
        });
      }
      const ss = this.setupHandler(e2, false);
      ss.qi = qi;
      this.handlers.push(ss);
      return qi;
    }
  };
  var NamedEndpointStatsImpl = class {
    name;
    subject;
    average_processing_time;
    num_requests;
    processing_time;
    num_errors;
    last_error;
    data;
    metadata;
    queue;
    constructor(name, subject, queue = "") {
      this.name = name;
      this.subject = subject;
      this.average_processing_time = 0;
      this.num_errors = 0;
      this.num_requests = 0;
      this.processing_time = 0;
      this.queue = queue;
    }
    reset(qi) {
      this.num_requests = 0;
      this.processing_time = 0;
      this.average_processing_time = 0;
      this.num_errors = 0;
      this.last_error = void 0;
      this.data = void 0;
      const qii = qi;
      if (qii) {
        qii.time = 0;
        qii.processed = 0;
      }
    }
    countLatency(start) {
      this.num_requests++;
      this.processing_time += nanos(Date.now() - start);
      this.average_processing_time = Math.round(this.processing_time / this.num_requests);
    }
    countError(err) {
      this.num_errors++;
      this.last_error = err.message;
    }
    _stats() {
      const { name, subject, average_processing_time, num_errors, num_requests, processing_time, last_error, data, queue } = this;
      return {
        name,
        subject,
        average_processing_time,
        num_errors,
        num_requests,
        processing_time,
        last_error,
        data,
        queue_group: queue
      };
    }
    stats(qi) {
      const qii = qi;
      if (qii?.noIterator === false) {
        this.processing_time = nanos(qii.time);
        this.num_requests = qii.processed;
        this.average_processing_time = this.processing_time > 0 && this.num_requests > 0 ? this.processing_time / this.num_requests : 0;
      }
      return this._stats();
    }
  };
  var ServiceClientImpl = class {
    nc;
    prefix;
    opts;
    constructor(nc, opts = {
      strategy: RequestStrategy.JitterTimer,
      maxWait: 2e3
    }, prefix) {
      this.nc = nc;
      this.prefix = prefix;
      this.opts = opts;
    }
    ping(name = "", id = "") {
      return this.q(ServiceVerb.PING, name, id);
    }
    stats(name = "", id = "") {
      return this.q(ServiceVerb.STATS, name, id);
    }
    info(name = "", id = "") {
      return this.q(ServiceVerb.INFO, name, id);
    }
    async q(v2, name = "", id = "") {
      const iter = new QueuedIteratorImpl();
      const jc = JSONCodec();
      const subj = ServiceImpl.controlSubject(v2, name, id, this.prefix);
      const responses = await this.nc.requestMany(subj, Empty, this.opts);
      (async () => {
        for await (const m2 of responses) {
          try {
            const s2 = jc.decode(m2.data);
            iter.push(s2);
          } catch (err) {
            iter.push(() => {
              iter.stop(err);
            });
          }
        }
        iter.push(() => {
          iter.stop();
        });
      })().catch((err) => {
        iter.stop(err);
      });
      return iter;
    }
  };
  var Metric = class {
    name;
    duration;
    date;
    payload;
    msgs;
    lang;
    version;
    bytes;
    asyncRequests;
    min;
    max;
    constructor(name, duration) {
      this.name = name;
      this.duration = duration;
      this.date = Date.now();
      this.payload = 0;
      this.msgs = 0;
      this.bytes = 0;
    }
    toString() {
      const sec = this.duration / 1e3;
      const mps = Math.round(this.msgs / sec);
      const label = this.asyncRequests ? "asyncRequests" : "";
      let minmax = "";
      if (this.max) {
        minmax = `${this.min}/${this.max}`;
      }
      return `${this.name}${label ? " [asyncRequests]" : ""} ${humanizeNumber(mps)} msgs/sec - [${sec.toFixed(2)} secs] ~ ${throughput(this.bytes, sec)} ${minmax}`;
    }
    toCsv() {
      return `"${this.name}",${new Date(this.date).toISOString()},${this.lang},${this.version},${this.msgs},${this.payload},${this.bytes},${this.duration},${this.asyncRequests ? this.asyncRequests : false}
`;
    }
    static header() {
      return `Test,Date,Lang,Version,Count,MsgPayload,Bytes,Millis,Async
`;
    }
  };
  var Bench = class {
    nc;
    callbacks;
    msgs;
    size;
    subject;
    asyncRequests;
    pub;
    sub;
    req;
    rep;
    perf;
    payload;
    constructor(nc, opts = {
      msgs: 1e5,
      size: 128,
      subject: "",
      asyncRequests: false,
      pub: false,
      sub: false,
      req: false,
      rep: false
    }) {
      this.nc = nc;
      this.callbacks = opts.callbacks || false;
      this.msgs = opts.msgs || 0;
      this.size = opts.size || 0;
      this.subject = opts.subject || nuid.next();
      this.asyncRequests = opts.asyncRequests || false;
      this.pub = opts.pub || false;
      this.sub = opts.sub || false;
      this.req = opts.req || false;
      this.rep = opts.rep || false;
      this.perf = new Perf();
      this.payload = this.size ? new Uint8Array(this.size) : Empty;
      if (!this.pub && !this.sub && !this.req && !this.rep) {
        throw new Error("no bench option selected");
      }
    }
    async run() {
      this.nc.closed().then((err) => {
        if (err) {
          throw new NatsError(`bench closed with an error: ${err.message}`, ErrorCode.Unknown, err);
        }
      });
      if (this.callbacks) {
        await this.runCallbacks();
      } else {
        await this.runAsync();
      }
      return this.processMetrics();
    }
    processMetrics() {
      const nc = this.nc;
      const { lang, version } = nc.protocol.transport;
      if (this.pub && this.sub) {
        this.perf.measure("pubsub", "pubStart", "subStop");
      }
      if (this.req && this.rep) {
        this.perf.measure("reqrep", "reqStart", "reqStop");
      }
      const measures = this.perf.getEntries();
      const pubsub = measures.find((m2) => m2.name === "pubsub");
      const reqrep = measures.find((m2) => m2.name === "reqrep");
      const req = measures.find((m2) => m2.name === "req");
      const rep = measures.find((m2) => m2.name === "rep");
      const pub = measures.find((m2) => m2.name === "pub");
      const sub = measures.find((m2) => m2.name === "sub");
      const stats = this.nc.stats();
      const metrics = [];
      if (pubsub) {
        const { name, duration } = pubsub;
        const m2 = new Metric(name, duration);
        m2.msgs = this.msgs * 2;
        m2.bytes = stats.inBytes + stats.outBytes;
        m2.lang = lang;
        m2.version = version;
        m2.payload = this.payload.length;
        metrics.push(m2);
      }
      if (reqrep) {
        const { name, duration } = reqrep;
        const m2 = new Metric(name, duration);
        m2.msgs = this.msgs * 2;
        m2.bytes = stats.inBytes + stats.outBytes;
        m2.lang = lang;
        m2.version = version;
        m2.payload = this.payload.length;
        metrics.push(m2);
      }
      if (pub) {
        const { name, duration } = pub;
        const m2 = new Metric(name, duration);
        m2.msgs = this.msgs;
        m2.bytes = stats.outBytes;
        m2.lang = lang;
        m2.version = version;
        m2.payload = this.payload.length;
        metrics.push(m2);
      }
      if (sub) {
        const { name, duration } = sub;
        const m2 = new Metric(name, duration);
        m2.msgs = this.msgs;
        m2.bytes = stats.inBytes;
        m2.lang = lang;
        m2.version = version;
        m2.payload = this.payload.length;
        metrics.push(m2);
      }
      if (rep) {
        const { name, duration } = rep;
        const m2 = new Metric(name, duration);
        m2.msgs = this.msgs;
        m2.bytes = stats.inBytes + stats.outBytes;
        m2.lang = lang;
        m2.version = version;
        m2.payload = this.payload.length;
        metrics.push(m2);
      }
      if (req) {
        const { name, duration } = req;
        const m2 = new Metric(name, duration);
        m2.msgs = this.msgs;
        m2.bytes = stats.inBytes + stats.outBytes;
        m2.lang = lang;
        m2.version = version;
        m2.payload = this.payload.length;
        metrics.push(m2);
      }
      return metrics;
    }
    async runCallbacks() {
      const jobs = [];
      if (this.sub) {
        const d2 = deferred();
        jobs.push(d2);
        let i2 = 0;
        this.nc.subscribe(this.subject, {
          max: this.msgs,
          callback: () => {
            i2++;
            if (i2 === 1) {
              this.perf.mark("subStart");
            }
            if (i2 === this.msgs) {
              this.perf.mark("subStop");
              this.perf.measure("sub", "subStart", "subStop");
              d2.resolve();
            }
          }
        });
      }
      if (this.rep) {
        const d2 = deferred();
        jobs.push(d2);
        let i2 = 0;
        this.nc.subscribe(this.subject, {
          max: this.msgs,
          callback: (_2, m2) => {
            m2.respond(this.payload);
            i2++;
            if (i2 === 1) {
              this.perf.mark("repStart");
            }
            if (i2 === this.msgs) {
              this.perf.mark("repStop");
              this.perf.measure("rep", "repStart", "repStop");
              d2.resolve();
            }
          }
        });
      }
      if (this.pub) {
        const job = (async () => {
          this.perf.mark("pubStart");
          for (let i2 = 0; i2 < this.msgs; i2++) {
            this.nc.publish(this.subject, this.payload);
          }
          await this.nc.flush();
          this.perf.mark("pubStop");
          this.perf.measure("pub", "pubStart", "pubStop");
        })();
        jobs.push(job);
      }
      if (this.req) {
        const job = (async () => {
          if (this.asyncRequests) {
            this.perf.mark("reqStart");
            const a2 = [];
            for (let i2 = 0; i2 < this.msgs; i2++) {
              a2.push(this.nc.request(this.subject, this.payload, {
                timeout: 2e4
              }));
            }
            await Promise.all(a2);
            this.perf.mark("reqStop");
            this.perf.measure("req", "reqStart", "reqStop");
          } else {
            this.perf.mark("reqStart");
            for (let i2 = 0; i2 < this.msgs; i2++) {
              await this.nc.request(this.subject);
            }
            this.perf.mark("reqStop");
            this.perf.measure("req", "reqStart", "reqStop");
          }
        })();
        jobs.push(job);
      }
      await Promise.all(jobs);
    }
    async runAsync() {
      const jobs = [];
      if (this.rep) {
        let first = false;
        const sub = this.nc.subscribe(this.subject, {
          max: this.msgs
        });
        const job = (async () => {
          for await (const m2 of sub) {
            if (!first) {
              this.perf.mark("repStart");
              first = true;
            }
            m2.respond(this.payload);
          }
          await this.nc.flush();
          this.perf.mark("repStop");
          this.perf.measure("rep", "repStart", "repStop");
        })();
        jobs.push(job);
      }
      if (this.sub) {
        let first = false;
        const sub = this.nc.subscribe(this.subject, {
          max: this.msgs
        });
        const job = (async () => {
          for await (const _m of sub) {
            if (!first) {
              this.perf.mark("subStart");
              first = true;
            }
          }
          this.perf.mark("subStop");
          this.perf.measure("sub", "subStart", "subStop");
        })();
        jobs.push(job);
      }
      if (this.pub) {
        const job = (async () => {
          this.perf.mark("pubStart");
          for (let i2 = 0; i2 < this.msgs; i2++) {
            this.nc.publish(this.subject, this.payload);
          }
          await this.nc.flush();
          this.perf.mark("pubStop");
          this.perf.measure("pub", "pubStart", "pubStop");
        })();
        jobs.push(job);
      }
      if (this.req) {
        const job = (async () => {
          if (this.asyncRequests) {
            this.perf.mark("reqStart");
            const a2 = [];
            for (let i2 = 0; i2 < this.msgs; i2++) {
              a2.push(this.nc.request(this.subject, this.payload, {
                timeout: 2e4
              }));
            }
            await Promise.all(a2);
            this.perf.mark("reqStop");
            this.perf.measure("req", "reqStart", "reqStop");
          } else {
            this.perf.mark("reqStart");
            for (let i2 = 0; i2 < this.msgs; i2++) {
              await this.nc.request(this.subject);
            }
            this.perf.mark("reqStop");
            this.perf.measure("req", "reqStart", "reqStop");
          }
        })();
        jobs.push(job);
      }
      await Promise.all(jobs);
    }
  };
  function throughput(bytes, seconds) {
    return `${humanizeBytes(bytes / seconds)}/sec`;
  }
  function humanizeBytes(bytes, si = false) {
    const base2 = si ? 1e3 : 1024;
    const pre = si ? [
      "k",
      "M",
      "G",
      "T",
      "P",
      "E"
    ] : [
      "K",
      "M",
      "G",
      "T",
      "P",
      "E"
    ];
    const post = si ? "iB" : "B";
    if (bytes < base2) {
      return `${bytes.toFixed(2)} ${post}`;
    }
    const exp = parseInt(Math.log(bytes) / Math.log(base2) + "");
    const index = parseInt(exp - 1 + "");
    return `${(bytes / Math.pow(base2, exp)).toFixed(2)} ${pre[index]}${post}`;
  }
  function humanizeNumber(n2) {
    return n2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  function NoopKvCodecs() {
    return {
      key: {
        encode(k2) {
          return k2;
        },
        decode(k2) {
          return k2;
        }
      },
      value: {
        encode(v2) {
          return v2;
        },
        decode(v2) {
          return v2;
        }
      }
    };
  }
  function defaultBucketOpts() {
    return {
      replicas: 1,
      history: 1,
      timeout: 2e3,
      max_bytes: -1,
      maxValueSize: -1,
      codec: NoopKvCodecs(),
      storage: StorageType.File
    };
  }
  var kvOperationHdr = "KV-Operation";
  var kvSubjectPrefix = "$KV";
  var validKeyRe = /^[-/=.\w]+$/;
  var validSearchKey = /^[-/=.>*\w]+$/;
  var validBucketRe = /^[-\w]+$/;
  function validateKey(k2) {
    if (k2.startsWith(".") || k2.endsWith(".") || !validKeyRe.test(k2)) {
      throw new Error(`invalid key: ${k2}`);
    }
  }
  function validateSearchKey(k2) {
    if (k2.startsWith(".") || k2.endsWith(".") || !validSearchKey.test(k2)) {
      throw new Error(`invalid key: ${k2}`);
    }
  }
  function hasWildcards(k2) {
    if (k2.startsWith(".") || k2.endsWith(".")) {
      throw new Error(`invalid key: ${k2}`);
    }
    const chunks = k2.split(".");
    let hasWildcards2 = false;
    for (let i2 = 0; i2 < chunks.length; i2++) {
      switch (chunks[i2]) {
        case "*":
          hasWildcards2 = true;
          break;
        case ">":
          if (i2 !== chunks.length - 1) {
            throw new Error(`invalid key: ${k2}`);
          }
          hasWildcards2 = true;
          break;
        default:
      }
    }
    return hasWildcards2;
  }
  function validateBucket(name) {
    if (!validBucketRe.test(name)) {
      throw new Error(`invalid bucket name: ${name}`);
    }
  }
  var PubHeaders;
  (function(PubHeaders2) {
    PubHeaders2["MsgIdHdr"] = "Nats-Msg-Id";
    PubHeaders2["ExpectedStreamHdr"] = "Nats-Expected-Stream";
    PubHeaders2["ExpectedLastSeqHdr"] = "Nats-Expected-Last-Sequence";
    PubHeaders2["ExpectedLastMsgIdHdr"] = "Nats-Expected-Last-Msg-Id";
    PubHeaders2["ExpectedLastSubjectSequenceHdr"] = "Nats-Expected-Last-Subject-Sequence";
  })(PubHeaders || (PubHeaders = {}));
  var Bucket = class _Bucket {
    js;
    jsm;
    stream;
    bucket;
    direct;
    codec;
    prefix;
    editPrefix;
    useJsPrefix;
    _prefixLen;
    constructor(bucket, js, jsm) {
      validateBucket(bucket);
      this.js = js;
      this.jsm = jsm;
      this.bucket = bucket;
      this.prefix = kvSubjectPrefix;
      this.editPrefix = "";
      this.useJsPrefix = false;
      this._prefixLen = 0;
    }
    static async create(js, name, opts = {}) {
      validateBucket(name);
      const jsm = await js.jetstreamManager();
      const bucket = new _Bucket(name, js, jsm);
      await bucket.init(opts);
      return bucket;
    }
    static async bind(js, name, opts = {}) {
      const jsm = await js.jetstreamManager();
      const info = {
        config: {
          allow_direct: opts.allow_direct
        }
      };
      validateBucket(name);
      const bucket = new _Bucket(name, js, jsm);
      info.config.name = opts.streamName ?? bucket.bucketName();
      Object.assign(bucket, info);
      bucket.stream = info.config.name;
      bucket.codec = opts.codec || NoopKvCodecs();
      bucket.direct = info.config.allow_direct ?? false;
      bucket.initializePrefixes(info);
      return bucket;
    }
    async init(opts = {}) {
      const bo = Object.assign(defaultBucketOpts(), opts);
      this.codec = bo.codec;
      const sc = {};
      this.stream = sc.name = opts.streamName ?? this.bucketName();
      sc.retention = RetentionPolicy.Limits;
      sc.max_msgs_per_subject = bo.history;
      if (bo.maxBucketSize) {
        bo.max_bytes = bo.maxBucketSize;
      }
      if (bo.max_bytes) {
        sc.max_bytes = bo.max_bytes;
      }
      sc.max_msg_size = bo.maxValueSize;
      sc.storage = bo.storage;
      const location = opts.placementCluster ?? "";
      if (location) {
        opts.placement = {};
        opts.placement.cluster = location;
        opts.placement.tags = [];
      }
      if (opts.placement) {
        sc.placement = opts.placement;
      }
      if (opts.republish) {
        sc.republish = opts.republish;
      }
      if (opts.description) {
        sc.description = opts.description;
      }
      if (opts.mirror) {
        const mirror = Object.assign({}, opts.mirror);
        if (!mirror.name.startsWith(kvPrefix)) {
          mirror.name = `${kvPrefix}${mirror.name}`;
        }
        sc.mirror = mirror;
        sc.mirror_direct = true;
      } else if (opts.sources) {
        const sources = opts.sources.map((s2) => {
          const c2 = Object.assign({}, s2);
          const srcBucketName = c2.name.startsWith(kvPrefix) ? c2.name.substring(kvPrefix.length) : c2.name;
          if (!c2.name.startsWith(kvPrefix)) {
            c2.name = `${kvPrefix}${c2.name}`;
          }
          if (!s2.external && srcBucketName !== this.bucket) {
            c2.subject_transforms = [
              {
                src: `$KV.${srcBucketName}.>`,
                dest: `$KV.${this.bucket}.>`
              }
            ];
          }
          return c2;
        });
        sc.sources = sources;
        sc.subjects = [
          this.subjectForBucket()
        ];
      } else {
        sc.subjects = [
          this.subjectForBucket()
        ];
      }
      if (opts.metadata) {
        sc.metadata = opts.metadata;
      }
      if (typeof opts.compression === "boolean") {
        sc.compression = opts.compression ? StoreCompression.S2 : StoreCompression.None;
      }
      const nci = this.js.nc;
      const have = nci.getServerVersion();
      const discardNew = have ? compare(have, parseSemVer("2.7.2")) >= 0 : false;
      sc.discard = discardNew ? DiscardPolicy.New : DiscardPolicy.Old;
      const { ok: direct, min } = nci.features.get(Feature.JS_ALLOW_DIRECT);
      if (!direct && opts.allow_direct === true) {
        const v2 = have ? `${have.major}.${have.minor}.${have.micro}` : "unknown";
        return Promise.reject(new Error(`allow_direct is not available on server version ${v2} - requires ${min}`));
      }
      opts.allow_direct = typeof opts.allow_direct === "boolean" ? opts.allow_direct : direct;
      sc.allow_direct = opts.allow_direct;
      this.direct = sc.allow_direct;
      sc.num_replicas = bo.replicas;
      if (bo.ttl) {
        sc.max_age = nanos(bo.ttl);
      }
      sc.allow_rollup_hdrs = true;
      let info;
      try {
        info = await this.jsm.streams.info(sc.name);
        if (!info.config.allow_direct && this.direct === true) {
          this.direct = false;
        }
      } catch (err) {
        if (err.message === "stream not found") {
          info = await this.jsm.streams.add(sc);
        } else {
          throw err;
        }
      }
      this.initializePrefixes(info);
    }
    initializePrefixes(info) {
      this._prefixLen = 0;
      this.prefix = `$KV.${this.bucket}`;
      this.useJsPrefix = this.js.apiPrefix !== "$JS.API";
      const { mirror } = info.config;
      if (mirror) {
        let n2 = mirror.name;
        if (n2.startsWith(kvPrefix)) {
          n2 = n2.substring(kvPrefix.length);
        }
        if (mirror.external && mirror.external.api !== "") {
          const mb = mirror.name.substring(kvPrefix.length);
          this.useJsPrefix = false;
          this.prefix = `$KV.${mb}`;
          this.editPrefix = `${mirror.external.api}.$KV.${n2}`;
        } else {
          this.editPrefix = this.prefix;
        }
      }
    }
    bucketName() {
      return this.stream ?? `${kvPrefix}${this.bucket}`;
    }
    subjectForBucket() {
      return `${this.prefix}.${this.bucket}.>`;
    }
    subjectForKey(k2, edit = false) {
      const builder = [];
      if (edit) {
        if (this.useJsPrefix) {
          builder.push(this.js.apiPrefix);
        }
        if (this.editPrefix !== "") {
          builder.push(this.editPrefix);
        } else {
          builder.push(this.prefix);
        }
      } else {
        if (this.prefix) {
          builder.push(this.prefix);
        }
      }
      builder.push(k2);
      return builder.join(".");
    }
    fullKeyName(k2) {
      if (this.prefix !== "") {
        return `${this.prefix}.${k2}`;
      }
      return `${kvSubjectPrefix}.${this.bucket}.${k2}`;
    }
    get prefixLen() {
      if (this._prefixLen === 0) {
        this._prefixLen = this.prefix.length + 1;
      }
      return this._prefixLen;
    }
    encodeKey(key) {
      const chunks = [];
      for (const t2 of key.split(".")) {
        switch (t2) {
          case ">":
          case "*":
            chunks.push(t2);
            break;
          default:
            chunks.push(this.codec.key.encode(t2));
            break;
        }
      }
      return chunks.join(".");
    }
    decodeKey(ekey) {
      const chunks = [];
      for (const t2 of ekey.split(".")) {
        switch (t2) {
          case ">":
          case "*":
            chunks.push(t2);
            break;
          default:
            chunks.push(this.codec.key.decode(t2));
            break;
        }
      }
      return chunks.join(".");
    }
    validateKey = validateKey;
    validateSearchKey = validateSearchKey;
    hasWildcards = hasWildcards;
    close() {
      return Promise.resolve();
    }
    dataLen(data, h2) {
      const slen = h2 ? h2.get(JsHeaders.MessageSizeHdr) || "" : "";
      if (slen !== "") {
        return parseInt(slen, 10);
      }
      return data.length;
    }
    smToEntry(sm) {
      return new KvStoredEntryImpl(this.bucket, this.prefixLen, sm);
    }
    jmToEntry(jm) {
      const key = this.decodeKey(jm.subject.substring(this.prefixLen));
      return new KvJsMsgEntryImpl(this.bucket, key, jm);
    }
    async create(k2, data) {
      let firstErr;
      try {
        const n2 = await this.put(k2, data, {
          previousSeq: 0
        });
        return Promise.resolve(n2);
      } catch (err) {
        firstErr = err;
        if (err?.api_error?.err_code !== 10071) {
          return Promise.reject(err);
        }
      }
      let rev = 0;
      try {
        const e2 = await this.get(k2);
        if (e2?.operation === "DEL" || e2?.operation === "PURGE") {
          rev = e2 !== null ? e2.revision : 0;
          return this.update(k2, data, rev);
        } else {
          return Promise.reject(firstErr);
        }
      } catch (err) {
        return Promise.reject(err);
      }
    }
    update(k2, data, version) {
      if (version <= 0) {
        throw new Error("version must be greater than 0");
      }
      return this.put(k2, data, {
        previousSeq: version
      });
    }
    async put(k2, data, opts = {}) {
      const ek = this.encodeKey(k2);
      this.validateKey(ek);
      const o2 = {};
      if (opts.previousSeq !== void 0) {
        const h2 = headers();
        o2.headers = h2;
        h2.set(PubHeaders.ExpectedLastSubjectSequenceHdr, `${opts.previousSeq}`);
      }
      try {
        const pa = await this.js.publish(this.subjectForKey(ek, true), data, o2);
        return pa.seq;
      } catch (err) {
        const ne = err;
        if (ne.isJetStreamError()) {
          ne.message = ne.api_error?.description;
          ne.code = `${ne.api_error?.code}`;
          return Promise.reject(ne);
        }
        return Promise.reject(err);
      }
    }
    async get(k2, opts) {
      const ek = this.encodeKey(k2);
      this.validateKey(ek);
      let arg = {
        last_by_subj: this.subjectForKey(ek)
      };
      if (opts && opts.revision > 0) {
        arg = {
          seq: opts.revision
        };
      }
      let sm;
      try {
        if (this.direct) {
          const direct = this.jsm.direct;
          sm = await direct.getMessage(this.bucketName(), arg);
        } else {
          sm = await this.jsm.streams.getMessage(this.bucketName(), arg);
        }
        const ke = this.smToEntry(sm);
        if (ke.key !== ek) {
          return null;
        }
        return ke;
      } catch (err) {
        if (err.code === ErrorCode.JetStream404NoMessages) {
          return null;
        }
        throw err;
      }
    }
    purge(k2, opts) {
      return this._deleteOrPurge(k2, "PURGE", opts);
    }
    delete(k2, opts) {
      return this._deleteOrPurge(k2, "DEL", opts);
    }
    async purgeDeletes(olderMillis = 30 * 60 * 1e3) {
      const done = deferred();
      const buf = [];
      const i2 = await this.watch({
        key: ">",
        initializedFn: () => {
          done.resolve();
        }
      });
      (async () => {
        for await (const e2 of i2) {
          if (e2.operation === "DEL" || e2.operation === "PURGE") {
            buf.push(e2);
          }
        }
      })().then();
      await done;
      i2.stop();
      const min = Date.now() - olderMillis;
      const proms = buf.map((e2) => {
        const subj = this.subjectForKey(e2.key);
        if (e2.created.getTime() >= min) {
          return this.jsm.streams.purge(this.stream, {
            filter: subj,
            keep: 1
          });
        } else {
          return this.jsm.streams.purge(this.stream, {
            filter: subj,
            keep: 0
          });
        }
      });
      const purged = await Promise.all(proms);
      purged.unshift({
        success: true,
        purged: 0
      });
      return purged.reduce((pv, cv) => {
        pv.purged += cv.purged;
        return pv;
      });
    }
    async _deleteOrPurge(k2, op, opts) {
      if (!this.hasWildcards(k2)) {
        return this._doDeleteOrPurge(k2, op, opts);
      }
      const iter = await this.keys(k2);
      const buf = [];
      for await (const k3 of iter) {
        buf.push(this._doDeleteOrPurge(k3, op));
        if (buf.length === 100) {
          await Promise.all(buf);
          buf.length = 0;
        }
      }
      if (buf.length > 0) {
        await Promise.all(buf);
      }
    }
    async _doDeleteOrPurge(k2, op, opts) {
      const ek = this.encodeKey(k2);
      this.validateKey(ek);
      const h2 = headers();
      h2.set(kvOperationHdr, op);
      if (op === "PURGE") {
        h2.set(JsHeaders.RollupHdr, JsHeaders.RollupValueSubject);
      }
      if (opts?.previousSeq) {
        h2.set(PubHeaders.ExpectedLastSubjectSequenceHdr, `${opts.previousSeq}`);
      }
      await this.js.publish(this.subjectForKey(ek, true), Empty, {
        headers: h2
      });
    }
    _buildCC(k2, content, opts = {}) {
      const a2 = !Array.isArray(k2) ? [
        k2
      ] : k2;
      let filter_subjects = a2.map((k3) => {
        const ek = this.encodeKey(k3);
        this.validateSearchKey(k3);
        return this.fullKeyName(ek);
      });
      let deliver_policy = DeliverPolicy.LastPerSubject;
      if (content === KvWatchInclude.AllHistory) {
        deliver_policy = DeliverPolicy.All;
      }
      if (content === KvWatchInclude.UpdatesOnly) {
        deliver_policy = DeliverPolicy.New;
      }
      let filter_subject = void 0;
      if (filter_subjects.length === 1) {
        filter_subject = filter_subjects[0];
        filter_subjects = void 0;
      }
      return Object.assign({
        deliver_policy,
        "ack_policy": AckPolicy.None,
        filter_subjects,
        filter_subject,
        "flow_control": true,
        "idle_heartbeat": nanos(5 * 1e3)
      }, opts);
    }
    remove(k2) {
      return this.purge(k2);
    }
    async history(opts = {}) {
      const k2 = opts.key ?? ">";
      const qi = new QueuedIteratorImpl();
      const co = {};
      co.headers_only = opts.headers_only || false;
      let fn;
      fn = () => {
        qi.stop();
      };
      let count = 0;
      const cc2 = this._buildCC(k2, KvWatchInclude.AllHistory, co);
      const subj = cc2.filter_subject;
      const copts = consumerOpts(cc2);
      copts.bindStream(this.stream);
      copts.orderedConsumer();
      copts.callback((err, jm) => {
        if (err) {
          qi.stop(err);
          return;
        }
        if (jm) {
          const e2 = this.jmToEntry(jm);
          qi.push(e2);
          qi.received++;
          if (fn && count > 0 && qi.received >= count || jm.info.pending === 0) {
            qi.push(fn);
            fn = void 0;
          }
        }
      });
      const sub = await this.js.subscribe(subj, copts);
      if (fn) {
        const { info: { last } } = sub;
        const expect = last.num_pending + last.delivered.consumer_seq;
        if (expect === 0 || qi.received >= expect) {
          try {
            fn();
          } catch (err) {
            qi.stop(err);
          } finally {
            fn = void 0;
          }
        } else {
          count = expect;
        }
      }
      qi._data = sub;
      qi.iterClosed.then(() => {
        sub.unsubscribe();
      });
      sub.closed.then(() => {
        qi.stop();
      }).catch((err) => {
        qi.stop(err);
      });
      return qi;
    }
    canSetWatcherName() {
      const jsi = this.js;
      const nci = jsi.nc;
      const { ok } = nci.features.get(Feature.JS_NEW_CONSUMER_CREATE_API);
      return ok;
    }
    async watch(opts = {}) {
      const k2 = opts.key ?? ">";
      const qi = new QueuedIteratorImpl();
      const co = {};
      co.headers_only = opts.headers_only || false;
      let content = KvWatchInclude.LastValue;
      if (opts.include === KvWatchInclude.AllHistory) {
        content = KvWatchInclude.AllHistory;
      } else if (opts.include === KvWatchInclude.UpdatesOnly) {
        content = KvWatchInclude.UpdatesOnly;
      }
      const ignoreDeletes = opts.ignoreDeletes === true;
      let fn = opts.initializedFn;
      let count = 0;
      const cc2 = this._buildCC(k2, content, co);
      const subj = cc2.filter_subject;
      const copts = consumerOpts(cc2);
      if (this.canSetWatcherName()) {
        copts.consumerName(nuid.next());
      }
      copts.bindStream(this.stream);
      if (opts.resumeFromRevision && opts.resumeFromRevision > 0) {
        copts.startSequence(opts.resumeFromRevision);
      }
      copts.orderedConsumer();
      copts.callback((err, jm) => {
        if (err) {
          qi.stop(err);
          return;
        }
        if (jm) {
          const e2 = this.jmToEntry(jm);
          if (ignoreDeletes && e2.operation === "DEL") {
            return;
          }
          qi.push(e2);
          qi.received++;
          if (fn && (count > 0 && qi.received >= count || jm.info.pending === 0)) {
            qi.push(fn);
            fn = void 0;
          }
        }
      });
      const sub = await this.js.subscribe(subj, copts);
      if (fn) {
        const { info: { last } } = sub;
        const expect = last.num_pending + last.delivered.consumer_seq;
        if (expect === 0 || qi.received >= expect) {
          try {
            fn();
          } catch (err) {
            qi.stop(err);
          } finally {
            fn = void 0;
          }
        } else {
          count = expect;
        }
      }
      qi._data = sub;
      qi.iterClosed.then(() => {
        sub.unsubscribe();
      });
      sub.closed.then(() => {
        qi.stop();
      }).catch((err) => {
        qi.stop(err);
      });
      return qi;
    }
    async keys(k2 = ">") {
      const keys = new QueuedIteratorImpl();
      const cc2 = this._buildCC(k2, KvWatchInclude.LastValue, {
        headers_only: true
      });
      const subj = Array.isArray(k2) ? ">" : cc2.filter_subject;
      const copts = consumerOpts(cc2);
      copts.bindStream(this.stream);
      copts.orderedConsumer();
      const sub = await this.js.subscribe(subj, copts);
      (async () => {
        for await (const jm of sub) {
          const op = jm.headers?.get(kvOperationHdr);
          if (op !== "DEL" && op !== "PURGE") {
            const key = this.decodeKey(jm.subject.substring(this.prefixLen));
            keys.push(key);
          }
          if (jm.info.pending === 0) {
            sub.unsubscribe();
          }
        }
      })().then(() => {
        keys.stop();
      }).catch((err) => {
        keys.stop(err);
      });
      const si = sub;
      if (si.info.last.num_pending === 0) {
        sub.unsubscribe();
      }
      return keys;
    }
    purgeBucket(opts) {
      return this.jsm.streams.purge(this.bucketName(), opts);
    }
    destroy() {
      return this.jsm.streams.delete(this.bucketName());
    }
    async status() {
      const nc = this.js.nc;
      const cluster = nc.info?.cluster ?? "";
      const bn = this.bucketName();
      const si = await this.jsm.streams.info(bn);
      return new KvStatusImpl(si, cluster);
    }
  };
  var KvStatusImpl = class {
    si;
    cluster;
    constructor(si, cluster = "") {
      this.si = si;
      this.cluster = cluster;
    }
    get bucket() {
      return this.si.config.name.startsWith(kvPrefix) ? this.si.config.name.substring(kvPrefix.length) : this.si.config.name;
    }
    get values() {
      return this.si.state.messages;
    }
    get history() {
      return this.si.config.max_msgs_per_subject;
    }
    get ttl() {
      return millis(this.si.config.max_age);
    }
    get bucket_location() {
      return this.cluster;
    }
    get backingStore() {
      return this.si.config.storage;
    }
    get storage() {
      return this.si.config.storage;
    }
    get replicas() {
      return this.si.config.num_replicas;
    }
    get description() {
      return this.si.config.description ?? "";
    }
    get maxBucketSize() {
      return this.si.config.max_bytes;
    }
    get maxValueSize() {
      return this.si.config.max_msg_size;
    }
    get max_bytes() {
      return this.si.config.max_bytes;
    }
    get placement() {
      return this.si.config.placement || {
        cluster: "",
        tags: []
      };
    }
    get placementCluster() {
      return this.si.config.placement?.cluster ?? "";
    }
    get republish() {
      return this.si.config.republish ?? {
        src: "",
        dest: ""
      };
    }
    get streamInfo() {
      return this.si;
    }
    get size() {
      return this.si.state.bytes;
    }
    get metadata() {
      return this.si.config.metadata ?? {};
    }
    get compression() {
      if (this.si.config.compression) {
        return this.si.config.compression !== StoreCompression.None;
      }
      return false;
    }
  };
  var osPrefix = "OBJ_";
  var digestType = "SHA-256=";
  function objectStoreStreamName(bucket) {
    validateBucket(bucket);
    return `${osPrefix}${bucket}`;
  }
  function objectStoreBucketName(stream) {
    if (stream.startsWith(osPrefix)) {
      return stream.substring(4);
    }
    return stream;
  }
  var ObjectStoreStatusImpl = class {
    si;
    backingStore;
    constructor(si) {
      this.si = si;
      this.backingStore = "JetStream";
    }
    get bucket() {
      return objectStoreBucketName(this.si.config.name);
    }
    get description() {
      return this.si.config.description ?? "";
    }
    get ttl() {
      return this.si.config.max_age;
    }
    get storage() {
      return this.si.config.storage;
    }
    get replicas() {
      return this.si.config.num_replicas;
    }
    get sealed() {
      return this.si.config.sealed;
    }
    get size() {
      return this.si.state.bytes;
    }
    get streamInfo() {
      return this.si;
    }
    get metadata() {
      return this.si.config.metadata;
    }
    get compression() {
      if (this.si.config.compression) {
        return this.si.config.compression !== StoreCompression.None;
      }
      return false;
    }
  };
  function convertStreamSourceDomain(s2) {
    if (s2 === void 0) {
      return void 0;
    }
    const { domain } = s2;
    if (domain === void 0) {
      return s2;
    }
    const copy2 = Object.assign({}, s2);
    delete copy2.domain;
    if (domain === "") {
      return copy2;
    }
    if (copy2.external) {
      throw new Error("domain and external are both set");
    }
    copy2.external = {
      api: `$JS.${domain}.API`
    };
    return copy2;
  }
  var PullConsumerType;
  (function(PullConsumerType2) {
    PullConsumerType2[PullConsumerType2["Unset"] = -1] = "Unset";
    PullConsumerType2[PullConsumerType2["Consume"] = 0] = "Consume";
    PullConsumerType2[PullConsumerType2["Fetch"] = 1] = "Fetch";
  })(PullConsumerType || (PullConsumerType = {}));
  var ConsumerEvents;
  (function(ConsumerEvents2) {
    ConsumerEvents2["HeartbeatsMissed"] = "heartbeats_missed";
    ConsumerEvents2["ConsumerNotFound"] = "consumer_not_found";
    ConsumerEvents2["StreamNotFound"] = "stream_not_found";
    ConsumerEvents2["ConsumerDeleted"] = "consumer_deleted";
    ConsumerEvents2["OrderedConsumerRecreated"] = "ordered_consumer_recreated";
    ConsumerEvents2["NoResponders"] = "no_responders";
  })(ConsumerEvents || (ConsumerEvents = {}));
  var ConsumerDebugEvents;
  (function(ConsumerDebugEvents2) {
    ConsumerDebugEvents2["DebugEvent"] = "debug";
    ConsumerDebugEvents2["Discard"] = "discard";
    ConsumerDebugEvents2["Reset"] = "reset";
    ConsumerDebugEvents2["Next"] = "next";
  })(ConsumerDebugEvents || (ConsumerDebugEvents = {}));
  var ACK = Uint8Array.of(43, 65, 67, 75);
  var NAK = Uint8Array.of(45, 78, 65, 75);
  var WPI = Uint8Array.of(43, 87, 80, 73);
  var NXT = Uint8Array.of(43, 78, 88, 84);
  var TERM = Uint8Array.of(43, 84, 69, 82, 77);
  var SPACE = Uint8Array.of(32);
  function toJsMsg(m2, ackTimeout = 5e3) {
    return new JsMsgImpl(m2, ackTimeout);
  }
  var PullConsumerMessagesImpl = class extends QueuedIteratorImpl {
    consumer;
    opts;
    sub;
    monitor;
    pending;
    inbox;
    refilling;
    pong;
    callback;
    timeout;
    cleanupHandler;
    listeners;
    statusIterator;
    forOrderedConsumer;
    resetHandler;
    abortOnMissingResource;
    bind;
    inBackOff;
    constructor(c2, opts, refilling = false) {
      super();
      this.consumer = c2;
      const copts = opts;
      this.opts = this.parseOptions(opts, refilling);
      this.callback = copts.callback || null;
      this.noIterator = typeof this.callback === "function";
      this.monitor = null;
      this.pong = null;
      this.pending = {
        msgs: 0,
        bytes: 0,
        requests: 0
      };
      this.refilling = refilling;
      this.timeout = null;
      this.inbox = createInbox(c2.api.nc.options.inboxPrefix);
      this.listeners = [];
      this.forOrderedConsumer = false;
      this.abortOnMissingResource = copts.abort_on_missing_resource === true;
      this.bind = copts.bind === true;
      this.inBackOff = false;
      this.start();
    }
    start() {
      const { max_messages, max_bytes, idle_heartbeat, threshold_bytes, threshold_messages } = this.opts;
      this.closed().then((err) => {
        if (this.cleanupHandler) {
          try {
            this.cleanupHandler(err);
          } catch (_err) {
          }
        }
      });
      const { sub } = this;
      if (sub) {
        sub.unsubscribe();
      }
      this.sub = this.consumer.api.nc.subscribe(this.inbox, {
        callback: (err, msg) => {
          if (err) {
            this.stop(err);
            return;
          }
          this.monitor?.work();
          const isProtocol = msg.subject === this.inbox;
          if (isProtocol) {
            if (isHeartbeatMsg(msg)) {
              return;
            }
            const code = msg.headers?.code;
            const description = msg.headers?.description?.toLowerCase() || "unknown";
            const { msgsLeft, bytesLeft } = this.parseDiscard(msg.headers);
            if (msgsLeft > 0 || bytesLeft > 0) {
              this.pending.msgs -= msgsLeft;
              this.pending.bytes -= bytesLeft;
              this.pending.requests--;
              this.notify(ConsumerDebugEvents.Discard, {
                msgsLeft,
                bytesLeft
              });
            } else {
              if (code === 400) {
                this.stop(new NatsError(description, `${code}`));
                return;
              } else if (code === 409 && description === "consumer deleted") {
                this.notify(ConsumerEvents.ConsumerDeleted, `${code} ${description}`);
                if (!this.refilling || this.abortOnMissingResource) {
                  const error = new NatsError(description, `${code}`);
                  this.stop(error);
                  return;
                }
              } else if (code === 503) {
                this.notify(ConsumerEvents.NoResponders, `${code} No Responders`);
                if (!this.refilling || this.abortOnMissingResource) {
                  const error = new NatsError("no responders", `${code}`);
                  this.stop(error);
                  return;
                }
              } else {
                this.notify(ConsumerDebugEvents.DebugEvent, `${code} ${description}`);
              }
            }
          } else {
            this._push(toJsMsg(msg, this.consumer.api.timeout));
            this.received++;
            if (this.pending.msgs) {
              this.pending.msgs--;
            }
            if (this.pending.bytes) {
              this.pending.bytes -= msg.size();
            }
          }
          if (this.pending.msgs === 0 && this.pending.bytes === 0) {
            this.pending.requests = 0;
          }
          if (this.refilling) {
            if (max_messages && this.pending.msgs <= threshold_messages || max_bytes && this.pending.bytes <= threshold_bytes) {
              const batch = this.pullOptions();
              this.pull(batch);
            }
          } else if (this.pending.requests === 0) {
            this._push(() => {
              this.stop();
            });
          }
        }
      });
      this.sub.closed.then(() => {
        if (this.sub.draining) {
          this._push(() => {
            this.stop();
          });
        }
      });
      if (idle_heartbeat) {
        this.monitor = new IdleHeartbeatMonitor(idle_heartbeat, (data) => {
          this.notify(ConsumerEvents.HeartbeatsMissed, data);
          this.resetPending().then(() => {
          }).catch(() => {
          });
          return false;
        }, {
          maxOut: 2
        });
      }
      (async () => {
        const status = this.consumer.api.nc.status();
        this.statusIterator = status;
        for await (const s2 of status) {
          switch (s2.type) {
            case Events.Disconnect:
              this.monitor?.cancel();
              break;
            case Events.Reconnect:
              this.resetPending().then((ok) => {
                if (ok) {
                  this.monitor?.restart();
                }
              }).catch(() => {
              });
              break;
            default:
          }
        }
      })();
      this.pull(this.pullOptions());
    }
    _push(r2) {
      if (!this.callback) {
        super.push(r2);
      } else {
        const fn = typeof r2 === "function" ? r2 : null;
        try {
          if (!fn) {
            this.callback(r2);
          } else {
            fn();
          }
        } catch (err) {
          this.stop(err);
        }
      }
    }
    notify(type, data) {
      if (this.listeners.length > 0) {
        (() => {
          this.listeners.forEach((l2) => {
            if (!l2.done) {
              l2.push({
                type,
                data
              });
            }
          });
        })();
      }
    }
    resetPending() {
      return this.bind ? this.resetPendingNoInfo() : this.resetPendingWithInfo();
    }
    resetPendingNoInfo() {
      this.pending.msgs = 0;
      this.pending.bytes = 0;
      this.pending.requests = 0;
      this.pull(this.pullOptions());
      return Promise.resolve(true);
    }
    async resetPendingWithInfo() {
      if (this.inBackOff) {
        return false;
      }
      let notFound = 0;
      let streamNotFound = 0;
      const bo = backoff([
        this.opts.expires
      ]);
      let attempt = 0;
      while (true) {
        if (this.done) {
          return false;
        }
        if (this.consumer.api.nc.isClosed()) {
          console.error("aborting resetPending - connection is closed");
          return false;
        }
        try {
          await this.consumer.info();
          this.inBackOff = false;
          notFound = 0;
          this.pending.msgs = 0;
          this.pending.bytes = 0;
          this.pending.requests = 0;
          this.pull(this.pullOptions());
          return true;
        } catch (err) {
          if (err.message === "stream not found") {
            streamNotFound++;
            this.notify(ConsumerEvents.StreamNotFound, streamNotFound);
            if (!this.refilling || this.abortOnMissingResource) {
              this.stop(err);
              return false;
            }
          } else if (err.message === "consumer not found") {
            notFound++;
            this.notify(ConsumerEvents.ConsumerNotFound, notFound);
            if (this.resetHandler) {
              try {
                this.resetHandler();
              } catch (_2) {
              }
            }
            if (!this.refilling || this.abortOnMissingResource) {
              this.stop(err);
              return false;
            }
            if (this.forOrderedConsumer) {
              return false;
            }
          } else {
            notFound = 0;
            streamNotFound = 0;
          }
          this.inBackOff = true;
          const to = bo.backoff(attempt);
          const de = delay(to);
          await Promise.race([
            de,
            this.consumer.api.nc.closed()
          ]);
          de.cancel();
          attempt++;
        }
      }
    }
    pull(opts) {
      this.pending.bytes += opts.max_bytes ?? 0;
      this.pending.msgs += opts.batch ?? 0;
      this.pending.requests++;
      const nc = this.consumer.api.nc;
      this._push(() => {
        nc.publish(`${this.consumer.api.prefix}.CONSUMER.MSG.NEXT.${this.consumer.stream}.${this.consumer.name}`, this.consumer.api.jc.encode(opts), {
          reply: this.inbox
        });
        this.notify(ConsumerDebugEvents.Next, opts);
      });
    }
    pullOptions() {
      const batch = this.opts.max_messages - this.pending.msgs;
      const max_bytes = this.opts.max_bytes - this.pending.bytes;
      const idle_heartbeat = nanos(this.opts.idle_heartbeat);
      const expires = nanos(this.opts.expires);
      return {
        batch,
        max_bytes,
        idle_heartbeat,
        expires
      };
    }
    parseDiscard(headers2) {
      const discard = {
        msgsLeft: 0,
        bytesLeft: 0
      };
      const msgsLeft = headers2?.get(JsHeaders.PendingMessagesHdr);
      if (msgsLeft) {
        discard.msgsLeft = parseInt(msgsLeft);
      }
      const bytesLeft = headers2?.get(JsHeaders.PendingBytesHdr);
      if (bytesLeft) {
        discard.bytesLeft = parseInt(bytesLeft);
      }
      return discard;
    }
    trackTimeout(t2) {
      this.timeout = t2;
    }
    close() {
      this.stop();
      return this.iterClosed;
    }
    closed() {
      return this.iterClosed;
    }
    clearTimers() {
      this.monitor?.cancel();
      this.monitor = null;
      this.timeout?.cancel();
      this.timeout = null;
    }
    setCleanupHandler(fn) {
      this.cleanupHandler = fn;
    }
    stop(err) {
      if (this.done) {
        return;
      }
      this.sub?.unsubscribe();
      this.clearTimers();
      this.statusIterator?.stop();
      this._push(() => {
        super.stop(err);
        this.listeners.forEach((n2) => {
          n2.stop();
        });
      });
    }
    parseOptions(opts, refilling = false) {
      const args = opts || {};
      args.max_messages = args.max_messages || 0;
      args.max_bytes = args.max_bytes || 0;
      if (args.max_messages !== 0 && args.max_bytes !== 0) {
        throw new Error(`only specify one of max_messages or max_bytes`);
      }
      if (args.max_messages === 0) {
        args.max_messages = 100;
      }
      args.expires = args.expires || 3e4;
      if (args.expires < 1e3) {
        throw new Error("expires should be at least 1000ms");
      }
      args.idle_heartbeat = args.idle_heartbeat || args.expires / 2;
      args.idle_heartbeat = args.idle_heartbeat > 3e4 ? 3e4 : args.idle_heartbeat;
      if (refilling) {
        const minMsgs = Math.round(args.max_messages * 0.75) || 1;
        args.threshold_messages = args.threshold_messages || minMsgs;
        const minBytes = Math.round(args.max_bytes * 0.75) || 1;
        args.threshold_bytes = args.threshold_bytes || minBytes;
      }
      return args;
    }
    status() {
      const iter = new QueuedIteratorImpl();
      this.listeners.push(iter);
      return Promise.resolve(iter);
    }
  };
  var OrderedConsumerMessages = class extends QueuedIteratorImpl {
    src;
    listeners;
    constructor() {
      super();
      this.listeners = [];
    }
    setSource(src) {
      if (this.src) {
        this.src.resetHandler = void 0;
        this.src.setCleanupHandler();
        this.src.stop();
      }
      this.src = src;
      this.src.setCleanupHandler((err) => {
        this.stop(err || void 0);
      });
      (async () => {
        const status = await this.src.status();
        for await (const s2 of status) {
          this.notify(s2.type, s2.data);
        }
      })().catch(() => {
      });
    }
    notify(type, data) {
      if (this.listeners.length > 0) {
        (() => {
          this.listeners.forEach((l2) => {
            if (!l2.done) {
              l2.push({
                type,
                data
              });
            }
          });
        })();
      }
    }
    stop(err) {
      if (this.done) {
        return;
      }
      this.src?.stop(err);
      super.stop(err);
      this.listeners.forEach((n2) => {
        n2.stop();
      });
    }
    close() {
      this.stop();
      return this.iterClosed;
    }
    closed() {
      return this.iterClosed;
    }
    status() {
      const iter = new QueuedIteratorImpl();
      this.listeners.push(iter);
      return Promise.resolve(iter);
    }
  };
  var PullConsumerImpl = class {
    api;
    _info;
    stream;
    name;
    constructor(api, info) {
      this.api = api;
      this._info = info;
      this.stream = info.stream_name;
      this.name = info.name;
    }
    consume(opts = {
      max_messages: 100,
      expires: 3e4
    }) {
      return Promise.resolve(new PullConsumerMessagesImpl(this, opts, true));
    }
    fetch(opts = {
      max_messages: 100,
      expires: 3e4
    }) {
      const m2 = new PullConsumerMessagesImpl(this, opts, false);
      const to = Math.round(m2.opts.expires * 1.05);
      const timer = timeout(to);
      m2.closed().catch(() => {
      }).finally(() => {
        timer.cancel();
      });
      timer.catch(() => {
        m2.close().catch();
      });
      m2.trackTimeout(timer);
      return Promise.resolve(m2);
    }
    next(opts = {
      expires: 3e4
    }) {
      const d2 = deferred();
      const fopts = opts;
      fopts.max_messages = 1;
      const iter = new PullConsumerMessagesImpl(this, fopts, false);
      const to = Math.round(iter.opts.expires * 1.05);
      if (to >= 6e4) {
        (async () => {
          for await (const s2 of await iter.status()) {
            if (s2.type === ConsumerEvents.HeartbeatsMissed && s2.data >= 2) {
              d2.reject(new Error("consumer missed heartbeats"));
              break;
            }
          }
        })().catch();
      }
      (async () => {
        for await (const m2 of iter) {
          d2.resolve(m2);
          break;
        }
      })().catch(() => {
      });
      const timer = timeout(to);
      iter.closed().then((err) => {
        err ? d2.reject(err) : d2.resolve(null);
      }).catch((err) => {
        d2.reject(err);
      }).finally(() => {
        timer.cancel();
      });
      timer.catch((_err) => {
        d2.resolve(null);
        iter.close().catch();
      });
      iter.trackTimeout(timer);
      return d2;
    }
    delete() {
      const { stream_name, name } = this._info;
      return this.api.delete(stream_name, name);
    }
    info(cached = false) {
      if (cached) {
        return Promise.resolve(this._info);
      }
      const { stream_name, name } = this._info;
      return this.api.info(stream_name, name).then((ci) => {
        this._info = ci;
        return this._info;
      });
    }
  };
  var OrderedPullConsumerImpl = class {
    api;
    consumerOpts;
    consumer;
    opts;
    cursor;
    stream;
    namePrefix;
    serial;
    currentConsumer;
    userCallback;
    iter;
    type;
    startSeq;
    maxInitialReset;
    constructor(api, stream, opts = {}) {
      this.api = api;
      this.stream = stream;
      this.cursor = {
        stream_seq: 1,
        deliver_seq: 0
      };
      this.namePrefix = nuid.next();
      if (typeof opts.name_prefix === "string") {
        minValidation("name_prefix", opts.name_prefix);
        this.namePrefix = opts.name_prefix + this.namePrefix;
      }
      this.serial = 0;
      this.currentConsumer = null;
      this.userCallback = null;
      this.iter = null;
      this.type = PullConsumerType.Unset;
      this.consumerOpts = opts;
      this.maxInitialReset = 30;
      this.startSeq = this.consumerOpts.opt_start_seq || 0;
      this.cursor.stream_seq = this.startSeq > 0 ? this.startSeq - 1 : 0;
    }
    getConsumerOpts(seq) {
      this.serial++;
      const name = `${this.namePrefix}_${this.serial}`;
      seq = seq === 0 ? 1 : seq;
      const config = {
        name,
        deliver_policy: DeliverPolicy.StartSequence,
        opt_start_seq: seq,
        ack_policy: AckPolicy.None,
        inactive_threshold: nanos(5 * 60 * 1e3),
        num_replicas: 1
      };
      if (this.consumerOpts.headers_only === true) {
        config.headers_only = true;
      }
      if (Array.isArray(this.consumerOpts.filterSubjects)) {
        config.filter_subjects = this.consumerOpts.filterSubjects;
      }
      if (typeof this.consumerOpts.filterSubjects === "string") {
        config.filter_subject = this.consumerOpts.filterSubjects;
      }
      if (this.consumerOpts.replay_policy) {
        config.replay_policy = this.consumerOpts.replay_policy;
      }
      if (seq === this.startSeq + 1) {
        config.deliver_policy = this.consumerOpts.deliver_policy || DeliverPolicy.StartSequence;
        if (this.consumerOpts.deliver_policy === DeliverPolicy.LastPerSubject || this.consumerOpts.deliver_policy === DeliverPolicy.New || this.consumerOpts.deliver_policy === DeliverPolicy.Last) {
          delete config.opt_start_seq;
          config.deliver_policy = this.consumerOpts.deliver_policy;
        }
        if (config.deliver_policy === DeliverPolicy.LastPerSubject) {
          if (typeof config.filter_subjects === "undefined" && typeof config.filter_subject === "undefined") {
            config.filter_subject = ">";
          }
        }
        if (this.consumerOpts.opt_start_time) {
          delete config.opt_start_seq;
          config.deliver_policy = DeliverPolicy.StartTime;
          config.opt_start_time = this.consumerOpts.opt_start_time;
        }
        if (this.consumerOpts.inactive_threshold) {
          config.inactive_threshold = nanos(this.consumerOpts.inactive_threshold);
        }
      }
      return config;
    }
    async resetConsumer(seq = 0) {
      nuid.next();
      const isNew = this.serial === 0;
      this.consumer?.delete().catch(() => {
      });
      seq = seq === 0 ? 1 : seq;
      this.cursor.deliver_seq = 0;
      const config = this.getConsumerOpts(seq);
      config.max_deliver = 1;
      config.mem_storage = true;
      const bo = backoff([
        this.opts?.expires || 3e4
      ]);
      let ci;
      for (let i2 = 0; ; i2++) {
        try {
          ci = await this.api.add(this.stream, config);
          this.iter?.notify(ConsumerEvents.OrderedConsumerRecreated, ci.name);
          break;
        } catch (err) {
          if (err.message === "stream not found") {
            this.iter?.notify(ConsumerEvents.StreamNotFound, i2);
            if (this.type === PullConsumerType.Fetch || this.opts.abort_on_missing_resource === true) {
              this.iter?.stop(err);
              return Promise.reject(err);
            }
          }
          if (isNew && i2 >= this.maxInitialReset) {
            throw err;
          } else {
            await delay(bo.backoff(i2 + 1));
          }
        }
      }
      return ci;
    }
    internalHandler(serial) {
      return (m2) => {
        if (this.serial !== serial) {
          return;
        }
        const dseq = m2.info.deliverySequence;
        if (dseq !== this.cursor.deliver_seq + 1) {
          this.notifyOrderedResetAndReset();
          return;
        }
        this.cursor.deliver_seq = dseq;
        this.cursor.stream_seq = m2.info.streamSequence;
        if (this.userCallback) {
          this.userCallback(m2);
        } else {
          this.iter?.push(m2);
        }
      };
    }
    async reset(opts = {
      max_messages: 100,
      expires: 3e4
    }, info) {
      info = info || {};
      const fromFetch = info.fromFetch || false;
      const orderedReset = info.orderedReset || false;
      if (this.type === PullConsumerType.Fetch && orderedReset) {
        this.iter?.src.stop();
        await this.iter?.closed();
        this.currentConsumer = null;
        return;
      }
      if (this.currentConsumer === null || orderedReset) {
        this.currentConsumer = await this.resetConsumer(this.cursor.stream_seq + 1);
      }
      if (this.iter === null || fromFetch) {
        this.iter = new OrderedConsumerMessages();
      }
      this.consumer = new PullConsumerImpl(this.api, this.currentConsumer);
      const copts = opts;
      copts.callback = this.internalHandler(this.serial);
      let msgs = null;
      if (this.type === PullConsumerType.Fetch && fromFetch) {
        msgs = await this.consumer.fetch(opts);
      } else if (this.type === PullConsumerType.Consume) {
        msgs = await this.consumer.consume(opts);
      }
      const msgsImpl = msgs;
      msgsImpl.forOrderedConsumer = true;
      msgsImpl.resetHandler = () => {
        this.notifyOrderedResetAndReset();
      };
      this.iter.setSource(msgsImpl);
    }
    notifyOrderedResetAndReset() {
      this.iter?.notify(ConsumerDebugEvents.Reset, "");
      this.reset(this.opts, {
        orderedReset: true
      });
    }
    async consume(opts = {
      max_messages: 100,
      expires: 3e4
    }) {
      const copts = opts;
      if (copts.bind) {
        return Promise.reject(new Error("bind is not supported"));
      }
      if (this.type === PullConsumerType.Fetch) {
        return Promise.reject(new Error("ordered consumer initialized as fetch"));
      }
      if (this.type === PullConsumerType.Consume) {
        return Promise.reject(new Error("ordered consumer doesn't support concurrent consume"));
      }
      const { callback } = opts;
      if (callback) {
        this.userCallback = callback;
      }
      this.type = PullConsumerType.Consume;
      this.opts = opts;
      await this.reset(opts);
      return this.iter;
    }
    async fetch(opts = {
      max_messages: 100,
      expires: 3e4
    }) {
      const copts = opts;
      if (copts.bind) {
        return Promise.reject(new Error("bind is not supported"));
      }
      if (this.type === PullConsumerType.Consume) {
        return Promise.reject(new Error("ordered consumer already initialized as consume"));
      }
      if (this.iter?.done === false) {
        return Promise.reject(new Error("ordered consumer doesn't support concurrent fetch"));
      }
      const { callback } = opts;
      if (callback) {
        this.userCallback = callback;
      }
      this.type = PullConsumerType.Fetch;
      this.opts = opts;
      await this.reset(opts, {
        fromFetch: true
      });
      return this.iter;
    }
    async next(opts = {
      expires: 3e4
    }) {
      const copts = opts;
      if (copts.bind) {
        return Promise.reject(new Error("bind is not supported"));
      }
      copts.max_messages = 1;
      const d2 = deferred();
      copts.callback = (m2) => {
        this.userCallback = null;
        d2.resolve(m2);
      };
      const iter = await this.fetch(copts);
      iter.iterClosed.then((err) => {
        if (err) {
          d2.reject(err);
        }
        d2.resolve(null);
      }).catch((err) => {
        d2.reject(err);
      });
      return d2;
    }
    delete() {
      if (!this.currentConsumer) {
        return Promise.resolve(false);
      }
      return this.api.delete(this.stream, this.currentConsumer.name).then((tf) => {
        return Promise.resolve(tf);
      }).catch((err) => {
        return Promise.reject(err);
      }).finally(() => {
        this.currentConsumer = null;
      });
    }
    async info(cached) {
      if (this.currentConsumer == null) {
        this.currentConsumer = await this.resetConsumer(this.startSeq);
        return Promise.resolve(this.currentConsumer);
      }
      if (cached && this.currentConsumer) {
        return Promise.resolve(this.currentConsumer);
      }
      return this.api.info(this.stream, this.currentConsumer.name);
    }
  };
  var ConsumersImpl = class {
    api;
    notified;
    constructor(api) {
      this.api = api;
      this.notified = false;
    }
    checkVersion() {
      const fv = this.api.nc.features.get(Feature.JS_SIMPLIFICATION);
      if (!fv.ok) {
        return Promise.reject(new Error(`consumers framework is only supported on servers ${fv.min} or better`));
      }
      return Promise.resolve();
    }
    getPullConsumerFor(ci) {
      if (ci.config.deliver_subject !== void 0) {
        throw new Error("push consumer not supported");
      }
      return new PullConsumerImpl(this.api, ci);
    }
    async get(stream, name = {}) {
      if (typeof name === "object") {
        return this.ordered(stream, name);
      }
      await this.checkVersion();
      return this.api.info(stream, name).then((ci) => {
        if (ci.config.deliver_subject !== void 0) {
          return Promise.reject(new Error("push consumer not supported"));
        }
        return new PullConsumerImpl(this.api, ci);
      }).catch((err) => {
        return Promise.reject(err);
      });
    }
    async ordered(stream, opts) {
      await this.checkVersion();
      const impl = this.api;
      const sapi = new StreamAPIImpl(impl.nc, impl.opts);
      return sapi.info(stream).then((_si) => {
        return Promise.resolve(new OrderedPullConsumerImpl(this.api, stream, opts));
      }).catch((err) => {
        return Promise.reject(err);
      });
    }
  };
  var StreamImpl = class _StreamImpl {
    api;
    _info;
    constructor(api, info) {
      this.api = api;
      this._info = info;
    }
    get name() {
      return this._info.config.name;
    }
    alternates() {
      return this.info().then((si) => {
        return si.alternates ? si.alternates : [];
      });
    }
    async best() {
      await this.info();
      if (this._info.alternates) {
        const asi = await this.api.info(this._info.alternates[0].name);
        return new _StreamImpl(this.api, asi);
      } else {
        return this;
      }
    }
    info(cached = false, opts) {
      if (cached) {
        return Promise.resolve(this._info);
      }
      return this.api.info(this.name, opts).then((si) => {
        this._info = si;
        return this._info;
      });
    }
    getConsumerFromInfo(ci) {
      return new ConsumersImpl(new ConsumerAPIImpl(this.api.nc, this.api.opts)).getPullConsumerFor(ci);
    }
    getConsumer(name) {
      return new ConsumersImpl(new ConsumerAPIImpl(this.api.nc, this.api.opts)).get(this.name, name);
    }
    getMessage(query) {
      return this.api.getMessage(this.name, query);
    }
    deleteMessage(seq, erase) {
      return this.api.deleteMessage(this.name, seq, erase);
    }
  };
  var StreamAPIImpl = class extends BaseApiClient {
    constructor(nc, opts) {
      super(nc, opts);
    }
    checkStreamConfigVersions(cfg) {
      const nci = this.nc;
      if (cfg.metadata) {
        const { min, ok } = nci.features.get(Feature.JS_STREAM_CONSUMER_METADATA);
        if (!ok) {
          throw new Error(`stream 'metadata' requires server ${min}`);
        }
      }
      if (cfg.first_seq) {
        const { min, ok } = nci.features.get(Feature.JS_STREAM_FIRST_SEQ);
        if (!ok) {
          throw new Error(`stream 'first_seq' requires server ${min}`);
        }
      }
      if (cfg.subject_transform) {
        const { min, ok } = nci.features.get(Feature.JS_STREAM_SUBJECT_TRANSFORM);
        if (!ok) {
          throw new Error(`stream 'subject_transform' requires server ${min}`);
        }
      }
      if (cfg.compression) {
        const { min, ok } = nci.features.get(Feature.JS_STREAM_COMPRESSION);
        if (!ok) {
          throw new Error(`stream 'compression' requires server ${min}`);
        }
      }
      if (cfg.consumer_limits) {
        const { min, ok } = nci.features.get(Feature.JS_DEFAULT_CONSUMER_LIMITS);
        if (!ok) {
          throw new Error(`stream 'consumer_limits' requires server ${min}`);
        }
      }
      function validateStreamSource(context, src) {
        const count = src?.subject_transforms?.length || 0;
        if (count > 0) {
          const { min, ok } = nci.features.get(Feature.JS_STREAM_SOURCE_SUBJECT_TRANSFORM);
          if (!ok) {
            throw new Error(`${context} 'subject_transforms' requires server ${min}`);
          }
        }
      }
      if (cfg.sources) {
        cfg.sources.forEach((src) => {
          validateStreamSource("stream sources", src);
        });
      }
      if (cfg.mirror) {
        validateStreamSource("stream mirror", cfg.mirror);
      }
    }
    async add(cfg = {}) {
      this.checkStreamConfigVersions(cfg);
      validateStreamName(cfg.name);
      cfg.mirror = convertStreamSourceDomain(cfg.mirror);
      cfg.sources = cfg.sources?.map(convertStreamSourceDomain);
      const r2 = await this._request(`${this.prefix}.STREAM.CREATE.${cfg.name}`, cfg);
      const si = r2;
      this._fixInfo(si);
      return si;
    }
    async delete(stream) {
      validateStreamName(stream);
      const r2 = await this._request(`${this.prefix}.STREAM.DELETE.${stream}`);
      const cr = r2;
      return cr.success;
    }
    async update(name, cfg = {}) {
      if (typeof name === "object") {
        const sc = name;
        name = sc.name;
        cfg = sc;
        console.trace(`\x1B[33m >> streams.update(config: StreamConfig) api changed to streams.update(name: string, config: StreamUpdateConfig) - this shim will be removed - update your code.  \x1B[0m`);
      }
      this.checkStreamConfigVersions(cfg);
      validateStreamName(name);
      const old = await this.info(name);
      const update = Object.assign(old.config, cfg);
      update.mirror = convertStreamSourceDomain(update.mirror);
      update.sources = update.sources?.map(convertStreamSourceDomain);
      const r2 = await this._request(`${this.prefix}.STREAM.UPDATE.${name}`, update);
      const si = r2;
      this._fixInfo(si);
      return si;
    }
    async info(name, data) {
      validateStreamName(name);
      const subj = `${this.prefix}.STREAM.INFO.${name}`;
      const r2 = await this._request(subj, data);
      let si = r2;
      let { total, limit } = si;
      let have = si.state.subjects ? Object.getOwnPropertyNames(si.state.subjects).length : 1;
      if (total && total > have) {
        const infos = [
          si
        ];
        const paged = data || {};
        let i2 = 0;
        while (total > have) {
          i2++;
          paged.offset = limit * i2;
          const r3 = await this._request(subj, paged);
          total = r3.total;
          infos.push(r3);
          const count = Object.getOwnPropertyNames(r3.state.subjects).length;
          have += count;
          if (count < limit) {
            break;
          }
        }
        let subjects = {};
        for (let i3 = 0; i3 < infos.length; i3++) {
          si = infos[i3];
          if (si.state.subjects) {
            subjects = Object.assign(subjects, si.state.subjects);
          }
        }
        si.offset = 0;
        si.total = 0;
        si.limit = 0;
        si.state.subjects = subjects;
      }
      this._fixInfo(si);
      return si;
    }
    list(subject = "") {
      const payload = subject?.length ? {
        subject
      } : {};
      const listerFilter = (v2) => {
        const slr = v2;
        slr.streams.forEach((si) => {
          this._fixInfo(si);
        });
        return slr.streams;
      };
      const subj = `${this.prefix}.STREAM.LIST`;
      return new ListerImpl(subj, listerFilter, this, payload);
    }
    _fixInfo(si) {
      si.config.sealed = si.config.sealed || false;
      si.config.deny_delete = si.config.deny_delete || false;
      si.config.deny_purge = si.config.deny_purge || false;
      si.config.allow_rollup_hdrs = si.config.allow_rollup_hdrs || false;
    }
    async purge(name, opts) {
      if (opts) {
        const { keep, seq } = opts;
        if (typeof keep === "number" && typeof seq === "number") {
          throw new Error("can specify one of keep or seq");
        }
      }
      validateStreamName(name);
      const v2 = await this._request(`${this.prefix}.STREAM.PURGE.${name}`, opts);
      return v2;
    }
    async deleteMessage(stream, seq, erase = true) {
      validateStreamName(stream);
      const dr = {
        seq
      };
      if (!erase) {
        dr.no_erase = true;
      }
      const r2 = await this._request(`${this.prefix}.STREAM.MSG.DELETE.${stream}`, dr);
      const cr = r2;
      return cr.success;
    }
    async getMessage(stream, query) {
      validateStreamName(stream);
      const r2 = await this._request(`${this.prefix}.STREAM.MSG.GET.${stream}`, query);
      const sm = r2;
      return new StoredMsgImpl(sm);
    }
    find(subject) {
      return this.findStream(subject);
    }
    listKvs() {
      const filter = (v2) => {
        const slr = v2;
        const kvStreams = slr.streams.filter((v3) => {
          return v3.config.name.startsWith(kvPrefix);
        });
        kvStreams.forEach((si) => {
          this._fixInfo(si);
        });
        let cluster = "";
        if (kvStreams.length) {
          cluster = this.nc.info?.cluster ?? "";
        }
        const status = kvStreams.map((si) => {
          return new KvStatusImpl(si, cluster);
        });
        return status;
      };
      const subj = `${this.prefix}.STREAM.LIST`;
      return new ListerImpl(subj, filter, this);
    }
    listObjectStores() {
      const filter = (v2) => {
        const slr = v2;
        const objStreams = slr.streams.filter((v3) => {
          return v3.config.name.startsWith(osPrefix);
        });
        objStreams.forEach((si) => {
          this._fixInfo(si);
        });
        const status = objStreams.map((si) => {
          return new ObjectStoreStatusImpl(si);
        });
        return status;
      };
      const subj = `${this.prefix}.STREAM.LIST`;
      return new ListerImpl(subj, filter, this);
    }
    names(subject = "") {
      const payload = subject?.length ? {
        subject
      } : {};
      const listerFilter = (v2) => {
        const sr = v2;
        return sr.streams;
      };
      const subj = `${this.prefix}.STREAM.NAMES`;
      return new ListerImpl(subj, listerFilter, this, payload);
    }
    async get(name) {
      const si = await this.info(name);
      return Promise.resolve(new StreamImpl(this, si));
    }
  };
  var DirectStreamAPIImpl = class extends BaseApiClient {
    constructor(nc, opts) {
      super(nc, opts);
    }
    async getMessage(stream, query) {
      validateStreamName(stream);
      let qq = query;
      const { last_by_subj } = qq;
      if (last_by_subj) {
        qq = null;
      }
      const payload = qq ? this.jc.encode(qq) : Empty;
      const pre = this.opts.apiPrefix || "$JS.API";
      const subj = last_by_subj ? `${pre}.DIRECT.GET.${stream}.${last_by_subj}` : `${pre}.DIRECT.GET.${stream}`;
      const r2 = await this.nc.request(subj, payload, {
        timeout: this.timeout
      });
      const err = checkJsError(r2);
      if (err) {
        return Promise.reject(err);
      }
      const dm = new DirectMsgImpl(r2);
      return Promise.resolve(dm);
    }
    async getBatch(stream, opts) {
      validateStreamName(stream);
      const pre = this.opts.apiPrefix || "$JS.API";
      const subj = `${pre}.DIRECT.GET.${stream}`;
      if (!Array.isArray(opts.multi_last) || opts.multi_last.length === 0) {
        return Promise.reject("multi_last is required");
      }
      const payload = JSON.stringify(opts, (key, value) => {
        if (key === "up_to_time" && value instanceof Date) {
          return value.toISOString();
        }
        return value;
      });
      const iter = new QueuedIteratorImpl();
      const raw = await this.nc.requestMany(subj, payload, {
        strategy: RequestStrategy.SentinelMsg
      });
      (async () => {
        let gotFirst = false;
        let badServer = false;
        let badRequest;
        for await (const m2 of raw) {
          if (!gotFirst) {
            gotFirst = true;
            const code = m2.headers?.code || 0;
            if (code !== 0 && code < 200 || code > 299) {
              badRequest = m2.headers?.description.toLowerCase();
              break;
            }
            const v2 = m2.headers?.get("Nats-Num-Pending");
            if (v2 === "") {
              badServer = true;
              break;
            }
          }
          if (m2.data.length === 0) {
            break;
          }
          iter.push(new DirectMsgImpl(m2));
        }
        iter.push(() => {
          if (badServer) {
            throw new Error("batch direct get not supported by the server");
          }
          if (badRequest) {
            throw new Error(`bad request: ${badRequest}`);
          }
          iter.stop();
        });
      })();
      return Promise.resolve(iter);
    }
  };
  var DirectMsgImpl = class {
    data;
    header;
    static jc;
    constructor(m2) {
      if (!m2.headers) {
        throw new Error("headers expected");
      }
      this.data = m2.data;
      this.header = m2.headers;
    }
    get subject() {
      return this.header.last(DirectMsgHeaders.Subject);
    }
    get seq() {
      const v2 = this.header.last(DirectMsgHeaders.Sequence);
      return typeof v2 === "string" ? parseInt(v2) : 0;
    }
    get time() {
      return new Date(Date.parse(this.timestamp));
    }
    get timestamp() {
      return this.header.last(DirectMsgHeaders.TimeStamp);
    }
    get stream() {
      return this.header.last(DirectMsgHeaders.Stream);
    }
    json(reviver) {
      return JSONCodec(reviver).decode(this.data);
    }
    string() {
      return TD.decode(this.data);
    }
  };
  var JetStreamManagerImpl = class extends BaseApiClient {
    streams;
    consumers;
    direct;
    constructor(nc, opts) {
      super(nc, opts);
      this.streams = new StreamAPIImpl(nc, opts);
      this.consumers = new ConsumerAPIImpl(nc, opts);
      this.direct = new DirectStreamAPIImpl(nc, opts);
    }
    async getAccountInfo() {
      const r2 = await this._request(`${this.prefix}.INFO`);
      return r2;
    }
    jetstream() {
      return this.nc.jetstream(this.getOptions());
    }
    advisories() {
      const iter = new QueuedIteratorImpl();
      this.nc.subscribe(`$JS.EVENT.ADVISORY.>`, {
        callback: (err, msg) => {
          if (err) {
            throw err;
          }
          try {
            const d2 = this.parseJsResponse(msg);
            const chunks = d2.type.split(".");
            const kind = chunks[chunks.length - 1];
            iter.push({
              kind,
              data: d2
            });
          } catch (err2) {
            iter.stop(err2);
          }
        }
      });
      return iter;
    }
  };
  var StoredMsgImpl = class {
    _header;
    smr;
    static jc;
    constructor(smr) {
      this.smr = smr;
    }
    get subject() {
      return this.smr.message.subject;
    }
    get seq() {
      return this.smr.message.seq;
    }
    get timestamp() {
      return this.smr.message.time;
    }
    get time() {
      return new Date(Date.parse(this.timestamp));
    }
    get data() {
      return this.smr.message.data ? this._parse(this.smr.message.data) : Empty;
    }
    get header() {
      if (!this._header) {
        if (this.smr.message.hdrs) {
          const hd = this._parse(this.smr.message.hdrs);
          this._header = MsgHdrsImpl.decode(hd);
        } else {
          this._header = headers();
        }
      }
      return this._header;
    }
    _parse(s2) {
      const bs = atob(s2);
      const len = bs.length;
      const bytes = new Uint8Array(len);
      for (let i2 = 0; i2 < len; i2++) {
        bytes[i2] = bs.charCodeAt(i2);
      }
      return bytes;
    }
    json(reviver) {
      return JSONCodec(reviver).decode(this.data);
    }
    string() {
      return TD.decode(this.data);
    }
  };
  var StreamsImpl = class {
    api;
    constructor(api) {
      this.api = api;
    }
    get(stream) {
      return this.api.info(stream).then((si) => {
        return new StreamImpl(this.api, si);
      });
    }
  };
  var ObjectInfoImpl = class {
    info;
    hdrs;
    constructor(oi) {
      this.info = oi;
    }
    get name() {
      return this.info.name;
    }
    get description() {
      return this.info.description ?? "";
    }
    get headers() {
      if (!this.hdrs) {
        this.hdrs = MsgHdrsImpl.fromRecord(this.info.headers || {});
      }
      return this.hdrs;
    }
    get options() {
      return this.info.options;
    }
    get bucket() {
      return this.info.bucket;
    }
    get chunks() {
      return this.info.chunks;
    }
    get deleted() {
      return this.info.deleted ?? false;
    }
    get digest() {
      return this.info.digest;
    }
    get mtime() {
      return this.info.mtime;
    }
    get nuid() {
      return this.info.nuid;
    }
    get size() {
      return this.info.size;
    }
    get revision() {
      return this.info.revision;
    }
    get metadata() {
      return this.info.metadata || {};
    }
    isLink() {
      return this.info.options?.link !== void 0 && this.info.options?.link !== null;
    }
  };
  function toServerObjectStoreMeta(meta) {
    const v2 = {
      name: meta.name,
      description: meta.description ?? "",
      options: meta.options,
      metadata: meta.metadata
    };
    if (meta.headers) {
      const mhi = meta.headers;
      v2.headers = mhi.toRecord();
    }
    return v2;
  }
  function emptyReadableStream() {
    return new ReadableStream({
      pull(c2) {
        c2.enqueue(new Uint8Array(0));
        c2.close();
      }
    });
  }
  var ObjectStoreImpl = class _ObjectStoreImpl {
    jsm;
    js;
    stream;
    name;
    constructor(name, jsm, js) {
      this.name = name;
      this.jsm = jsm;
      this.js = js;
    }
    _checkNotEmpty(name) {
      if (!name || name.length === 0) {
        return {
          name,
          error: new Error("name cannot be empty")
        };
      }
      return {
        name
      };
    }
    async info(name) {
      const info = await this.rawInfo(name);
      return info ? new ObjectInfoImpl(info) : null;
    }
    async list() {
      const buf = [];
      const iter = await this.watch({
        ignoreDeletes: true,
        includeHistory: true
      });
      for await (const info of iter) {
        if (info === null) {
          break;
        }
        buf.push(info);
      }
      return Promise.resolve(buf);
    }
    async rawInfo(name) {
      const { name: obj, error } = this._checkNotEmpty(name);
      if (error) {
        return Promise.reject(error);
      }
      const meta = this._metaSubject(obj);
      try {
        const m2 = await this.jsm.streams.getMessage(this.stream, {
          last_by_subj: meta
        });
        const jc = JSONCodec();
        const soi = jc.decode(m2.data);
        soi.revision = m2.seq;
        return soi;
      } catch (err) {
        if (err.code === "404") {
          return null;
        }
        return Promise.reject(err);
      }
    }
    async _si(opts) {
      try {
        return await this.jsm.streams.info(this.stream, opts);
      } catch (err) {
        const nerr = err;
        if (nerr.code === "404") {
          return null;
        }
        return Promise.reject(err);
      }
    }
    async seal() {
      let info = await this._si();
      if (info === null) {
        return Promise.reject(new Error("object store not found"));
      }
      info.config.sealed = true;
      info = await this.jsm.streams.update(this.stream, info.config);
      return Promise.resolve(new ObjectStoreStatusImpl(info));
    }
    async status(opts) {
      const info = await this._si(opts);
      if (info === null) {
        return Promise.reject(new Error("object store not found"));
      }
      return Promise.resolve(new ObjectStoreStatusImpl(info));
    }
    destroy() {
      return this.jsm.streams.delete(this.stream);
    }
    async _put(meta, rs, opts) {
      const jsopts = this.js.getOptions();
      opts = opts || {
        timeout: jsopts.timeout
      };
      opts.timeout = opts.timeout || jsopts.timeout;
      opts.previousRevision = opts.previousRevision ?? void 0;
      const { timeout: timeout2, previousRevision } = opts;
      const si = this.js.nc.info;
      const maxPayload = si?.max_payload || 1024;
      meta = meta || {};
      meta.options = meta.options || {};
      let maxChunk = meta.options?.max_chunk_size || 128 * 1024;
      maxChunk = maxChunk > maxPayload ? maxPayload : maxChunk;
      meta.options.max_chunk_size = maxChunk;
      const old = await this.info(meta.name);
      const { name: n2, error } = this._checkNotEmpty(meta.name);
      if (error) {
        return Promise.reject(error);
      }
      const id = nuid.next();
      const chunkSubj = this._chunkSubject(id);
      const metaSubj = this._metaSubject(n2);
      const info = Object.assign({
        bucket: this.name,
        nuid: id,
        size: 0,
        chunks: 0
      }, toServerObjectStoreMeta(meta));
      const d2 = deferred();
      const proms = [];
      const db = new DataBuffer();
      try {
        const reader = rs ? rs.getReader() : null;
        const sha = J.create();
        while (true) {
          const { done, value } = reader ? await reader.read() : {
            done: true,
            value: void 0
          };
          if (done) {
            if (db.size() > 0) {
              const payload = db.drain();
              sha.update(payload);
              info.chunks++;
              info.size += payload.length;
              proms.push(this.js.publish(chunkSubj, payload, {
                timeout: timeout2
              }));
            }
            await Promise.all(proms);
            proms.length = 0;
            info.mtime = (/* @__PURE__ */ new Date()).toISOString();
            const digest = Base64UrlPaddedCodec.encode(sha.digest());
            info.digest = `${digestType}${digest}`;
            info.deleted = false;
            const h2 = headers();
            if (typeof previousRevision === "number") {
              h2.set(PubHeaders.ExpectedLastSubjectSequenceHdr, `${previousRevision}`);
            }
            h2.set(JsHeaders.RollupHdr, JsHeaders.RollupValueSubject);
            const pa = await this.js.publish(metaSubj, JSONCodec().encode(info), {
              headers: h2,
              timeout: timeout2
            });
            info.revision = pa.seq;
            if (old) {
              try {
                await this.jsm.streams.purge(this.stream, {
                  filter: `$O.${this.name}.C.${old.nuid}`
                });
              } catch (_err) {
              }
            }
            d2.resolve(new ObjectInfoImpl(info));
            break;
          }
          if (value) {
            db.fill(value);
            while (db.size() > maxChunk) {
              info.chunks++;
              info.size += maxChunk;
              const payload = db.drain(meta.options.max_chunk_size);
              sha.update(payload);
              proms.push(this.js.publish(chunkSubj, payload, {
                timeout: timeout2
              }));
            }
          }
        }
      } catch (err) {
        await this.jsm.streams.purge(this.stream, {
          filter: chunkSubj
        });
        d2.reject(err);
      }
      return d2;
    }
    putBlob(meta, data, opts) {
      function readableStreamFrom(data2) {
        return new ReadableStream({
          pull(controller) {
            controller.enqueue(data2);
            controller.close();
          }
        });
      }
      if (data === null) {
        data = new Uint8Array(0);
      }
      return this.put(meta, readableStreamFrom(data), opts);
    }
    put(meta, rs, opts) {
      if (meta?.options?.link) {
        return Promise.reject(new Error("link cannot be set when putting the object in bucket"));
      }
      return this._put(meta, rs, opts);
    }
    async getBlob(name) {
      async function fromReadableStream(rs) {
        const buf = new DataBuffer();
        const reader = rs.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            return buf.drain();
          }
          if (value && value.length) {
            buf.fill(value);
          }
        }
      }
      const r2 = await this.get(name);
      if (r2 === null) {
        return Promise.resolve(null);
      }
      const vs = await Promise.all([
        r2.error,
        fromReadableStream(r2.data)
      ]);
      if (vs[0]) {
        return Promise.reject(vs[0]);
      } else {
        return Promise.resolve(vs[1]);
      }
    }
    async get(name) {
      const info = await this.rawInfo(name);
      if (info === null) {
        return Promise.resolve(null);
      }
      if (info.deleted) {
        return Promise.resolve(null);
      }
      if (info.options && info.options.link) {
        const ln = info.options.link.name || "";
        if (ln === "") {
          throw new Error("link is a bucket");
        }
        const os = info.options.link.bucket !== this.name ? await _ObjectStoreImpl.create(this.js, info.options.link.bucket) : this;
        return os.get(ln);
      }
      if (!info.digest.startsWith(digestType)) {
        return Promise.reject(new Error(`unknown digest type: ${info.digest}`));
      }
      const digest = parseSha256(info.digest.substring(8));
      if (digest === null) {
        return Promise.reject(new Error(`unable to parse digest: ${info.digest}`));
      }
      const d2 = deferred();
      const r2 = {
        info: new ObjectInfoImpl(info),
        error: d2
      };
      if (info.size === 0) {
        r2.data = emptyReadableStream();
        d2.resolve(null);
        return Promise.resolve(r2);
      }
      let controller;
      const oc = consumerOpts();
      oc.orderedConsumer();
      const sha = J.create();
      const subj = `$O.${this.name}.C.${info.nuid}`;
      const sub = await this.js.subscribe(subj, oc);
      (async () => {
        for await (const jm of sub) {
          if (jm.data.length > 0) {
            sha.update(jm.data);
            controller.enqueue(jm.data);
          }
          if (jm.info.pending === 0) {
            if (!checkSha256(digest, sha.digest())) {
              controller.error(new Error(`received a corrupt object, digests do not match received: ${info.digest} calculated ${digest}`));
            } else {
              controller.close();
            }
            sub.unsubscribe();
          }
        }
      })().then(() => {
        d2.resolve();
      }).catch((err) => {
        controller.error(err);
        d2.reject(err);
      });
      r2.data = new ReadableStream({
        start(c2) {
          controller = c2;
        },
        cancel() {
          sub.unsubscribe();
        }
      });
      return r2;
    }
    linkStore(name, bucket) {
      if (!(bucket instanceof _ObjectStoreImpl)) {
        return Promise.reject("bucket required");
      }
      const osi = bucket;
      const { name: n2, error } = this._checkNotEmpty(name);
      if (error) {
        return Promise.reject(error);
      }
      const meta = {
        name: n2,
        options: {
          link: {
            bucket: osi.name
          }
        }
      };
      return this._put(meta, null);
    }
    async link(name, info) {
      const { name: n2, error } = this._checkNotEmpty(name);
      if (error) {
        return Promise.reject(error);
      }
      if (info.deleted) {
        return Promise.reject(new Error("src object is deleted"));
      }
      if (info.isLink()) {
        return Promise.reject(new Error("src object is a link"));
      }
      const dest = await this.rawInfo(name);
      if (dest !== null && !dest.deleted) {
        return Promise.reject(new Error("an object already exists with that name"));
      }
      const link = {
        bucket: info.bucket,
        name: info.name
      };
      const mm = {
        name: n2,
        bucket: info.bucket,
        options: {
          link
        }
      };
      await this.js.publish(this._metaSubject(name), JSON.stringify(mm));
      const i2 = await this.info(name);
      return Promise.resolve(i2);
    }
    async delete(name) {
      const info = await this.rawInfo(name);
      if (info === null) {
        return Promise.resolve({
          purged: 0,
          success: false
        });
      }
      info.deleted = true;
      info.size = 0;
      info.chunks = 0;
      info.digest = "";
      const jc = JSONCodec();
      const h2 = headers();
      h2.set(JsHeaders.RollupHdr, JsHeaders.RollupValueSubject);
      await this.js.publish(this._metaSubject(info.name), jc.encode(info), {
        headers: h2
      });
      return this.jsm.streams.purge(this.stream, {
        filter: this._chunkSubject(info.nuid)
      });
    }
    async update(name, meta = {}) {
      const info = await this.rawInfo(name);
      if (info === null) {
        return Promise.reject(new Error("object not found"));
      }
      if (info.deleted) {
        return Promise.reject(new Error("cannot update meta for a deleted object"));
      }
      meta.name = meta.name ?? info.name;
      const { name: n2, error } = this._checkNotEmpty(meta.name);
      if (error) {
        return Promise.reject(error);
      }
      if (name !== meta.name) {
        const i2 = await this.info(meta.name);
        if (i2 && !i2.deleted) {
          return Promise.reject(new Error("an object already exists with that name"));
        }
      }
      meta.name = n2;
      const ii = Object.assign({}, info, toServerObjectStoreMeta(meta));
      const ack = await this.js.publish(this._metaSubject(ii.name), JSON.stringify(ii));
      if (name !== meta.name) {
        await this.jsm.streams.purge(this.stream, {
          filter: this._metaSubject(name)
        });
      }
      return Promise.resolve(ack);
    }
    async watch(opts = {}) {
      opts.includeHistory = opts.includeHistory ?? false;
      opts.ignoreDeletes = opts.ignoreDeletes ?? false;
      let initialized = false;
      const qi = new QueuedIteratorImpl();
      const subj = this._metaSubjectAll();
      try {
        await this.jsm.streams.getMessage(this.stream, {
          last_by_subj: subj
        });
      } catch (err) {
        if (err.code === "404") {
          qi.push(null);
          initialized = true;
        } else {
          qi.stop(err);
        }
      }
      const jc = JSONCodec();
      const copts = consumerOpts();
      copts.orderedConsumer();
      if (opts.includeHistory) {
        copts.deliverLastPerSubject();
      } else {
        initialized = true;
        copts.deliverNew();
      }
      copts.callback((err, jm) => {
        if (err) {
          qi.stop(err);
          return;
        }
        if (jm !== null) {
          const oi = jc.decode(jm.data);
          if (oi.deleted && opts.ignoreDeletes === true) {
          } else {
            qi.push(oi);
          }
          if (jm.info?.pending === 0 && !initialized) {
            initialized = true;
            qi.push(null);
          }
        }
      });
      const sub = await this.js.subscribe(subj, copts);
      qi._data = sub;
      qi.iterClosed.then(() => {
        sub.unsubscribe();
      });
      sub.closed.then(() => {
        qi.stop();
      }).catch((err) => {
        qi.stop(err);
      });
      return qi;
    }
    _chunkSubject(id) {
      return `$O.${this.name}.C.${id}`;
    }
    _metaSubject(n2) {
      return `$O.${this.name}.M.${Base64UrlPaddedCodec.encode(n2)}`;
    }
    _metaSubjectAll() {
      return `$O.${this.name}.M.>`;
    }
    async init(opts = {}) {
      try {
        this.stream = objectStoreStreamName(this.name);
      } catch (err) {
        return Promise.reject(err);
      }
      const max_age = opts?.ttl || 0;
      delete opts.ttl;
      const sc = Object.assign({
        max_age
      }, opts);
      sc.name = this.stream;
      sc.num_replicas = opts.replicas ?? 1;
      sc.allow_direct = true;
      sc.allow_rollup_hdrs = true;
      sc.discard = DiscardPolicy.New;
      sc.subjects = [
        `$O.${this.name}.C.>`,
        `$O.${this.name}.M.>`
      ];
      if (opts.placement) {
        sc.placement = opts.placement;
      }
      if (opts.metadata) {
        sc.metadata = opts.metadata;
      }
      if (typeof opts.compression === "boolean") {
        sc.compression = opts.compression ? StoreCompression.S2 : StoreCompression.None;
      }
      try {
        await this.jsm.streams.info(sc.name);
      } catch (err) {
        if (err.message === "stream not found") {
          await this.jsm.streams.add(sc);
        }
      }
    }
    static async create(js, name, opts = {}) {
      const jsm = await js.jetstreamManager();
      const os = new _ObjectStoreImpl(name, jsm, js);
      await os.init(opts);
      return Promise.resolve(os);
    }
  };
  var ViewsImpl = class {
    js;
    constructor(js) {
      this.js = js;
    }
    kv(name, opts = {}) {
      const jsi = this.js;
      const { ok, min } = jsi.nc.features.get(Feature.JS_KV);
      if (!ok) {
        return Promise.reject(new Error(`kv is only supported on servers ${min} or better`));
      }
      if (opts.bindOnly) {
        return Bucket.bind(this.js, name, opts);
      }
      return Bucket.create(this.js, name, opts);
    }
    os(name, opts = {}) {
      if (typeof crypto?.subtle?.digest !== "function") {
        return Promise.reject(new Error("objectstore: unable to calculate hashes - crypto.subtle.digest with sha256 support is required"));
      }
      const jsi = this.js;
      const { ok, min } = jsi.nc.features.get(Feature.JS_OBJECTSTORE);
      if (!ok) {
        return Promise.reject(new Error(`objectstore is only supported on servers ${min} or better`));
      }
      return ObjectStoreImpl.create(this.js, name, opts);
    }
  };
  var JetStreamClientImpl = class _JetStreamClientImpl extends BaseApiClient {
    consumers;
    streams;
    consumerAPI;
    streamAPI;
    constructor(nc, opts) {
      super(nc, opts);
      this.consumerAPI = new ConsumerAPIImpl(nc, opts);
      this.streamAPI = new StreamAPIImpl(nc, opts);
      this.consumers = new ConsumersImpl(this.consumerAPI);
      this.streams = new StreamsImpl(this.streamAPI);
    }
    jetstreamManager(checkAPI) {
      if (checkAPI === void 0) {
        checkAPI = this.opts.checkAPI;
      }
      const opts = Object.assign({}, this.opts, {
        checkAPI
      });
      return this.nc.jetstreamManager(opts);
    }
    get apiPrefix() {
      return this.prefix;
    }
    get views() {
      return new ViewsImpl(this);
    }
    async publish(subj, data = Empty, opts) {
      opts = opts || {};
      opts.expect = opts.expect || {};
      const mh = opts?.headers || headers();
      if (opts) {
        if (opts.msgID) {
          mh.set(PubHeaders.MsgIdHdr, opts.msgID);
        }
        if (opts.expect.lastMsgID) {
          mh.set(PubHeaders.ExpectedLastMsgIdHdr, opts.expect.lastMsgID);
        }
        if (opts.expect.streamName) {
          mh.set(PubHeaders.ExpectedStreamHdr, opts.expect.streamName);
        }
        if (typeof opts.expect.lastSequence === "number") {
          mh.set(PubHeaders.ExpectedLastSeqHdr, `${opts.expect.lastSequence}`);
        }
        if (typeof opts.expect.lastSubjectSequence === "number") {
          mh.set(PubHeaders.ExpectedLastSubjectSequenceHdr, `${opts.expect.lastSubjectSequence}`);
        }
      }
      const to = opts.timeout || this.timeout;
      const ro = {};
      if (to) {
        ro.timeout = to;
      }
      if (opts) {
        ro.headers = mh;
      }
      let { retries, retry_delay } = opts;
      retries = retries || 1;
      retry_delay = retry_delay || 250;
      let r2;
      for (let i2 = 0; i2 < retries; i2++) {
        try {
          r2 = await this.nc.request(subj, data, ro);
          break;
        } catch (err) {
          const ne = err;
          if (ne.code === "503" && i2 + 1 < retries) {
            await delay(retry_delay);
          } else {
            throw err;
          }
        }
      }
      const pa = this.parseJsResponse(r2);
      if (pa.stream === "") {
        throw NatsError.errorForCode(ErrorCode.JetStreamInvalidAck);
      }
      pa.duplicate = pa.duplicate ? pa.duplicate : false;
      return pa;
    }
    async pull(stream, durable, expires = 0) {
      validateStreamName(stream);
      validateDurableName(durable);
      let timeout2 = this.timeout;
      if (expires > timeout2) {
        timeout2 = expires;
      }
      expires = expires < 0 ? 0 : nanos(expires);
      const pullOpts = {
        batch: 1,
        no_wait: expires === 0,
        expires
      };
      const msg = await this.nc.request(`${this.prefix}.CONSUMER.MSG.NEXT.${stream}.${durable}`, this.jc.encode(pullOpts), {
        noMux: true,
        timeout: timeout2
      });
      const err = checkJsError(msg);
      if (err) {
        throw err;
      }
      return toJsMsg(msg, this.timeout);
    }
    fetch(stream, durable, opts = {}) {
      validateStreamName(stream);
      validateDurableName(durable);
      let timer = null;
      const trackBytes = (opts.max_bytes ?? 0) > 0;
      let receivedBytes = 0;
      const max_bytes = trackBytes ? opts.max_bytes : 0;
      let monitor = null;
      const args = {};
      args.batch = opts.batch || 1;
      if (max_bytes) {
        const fv = this.nc.features.get(Feature.JS_PULL_MAX_BYTES);
        if (!fv.ok) {
          throw new Error(`max_bytes is only supported on servers ${fv.min} or better`);
        }
        args.max_bytes = max_bytes;
      }
      args.no_wait = opts.no_wait || false;
      if (args.no_wait && args.expires) {
        args.expires = 0;
      }
      const expires = opts.expires || 0;
      if (expires) {
        args.expires = nanos(expires);
      }
      if (expires === 0 && args.no_wait === false) {
        throw new Error("expires or no_wait is required");
      }
      const hb = opts.idle_heartbeat || 0;
      if (hb) {
        args.idle_heartbeat = nanos(hb);
        if (opts.delay_heartbeat === true) {
          args.idle_heartbeat = nanos(hb * 4);
        }
      }
      const qi = new QueuedIteratorImpl();
      const wants = args.batch;
      let received = 0;
      qi.protocolFilterFn = (jm, _ingest = false) => {
        const jsmi = jm;
        if (isHeartbeatMsg(jsmi.msg)) {
          monitor?.work();
          return false;
        }
        return true;
      };
      qi.dispatchedFn = (m2) => {
        if (m2) {
          if (trackBytes) {
            receivedBytes += m2.data.length;
          }
          received++;
          if (timer && m2.info.pending === 0) {
            return;
          }
          if (qi.getPending() === 1 && m2.info.pending === 0 || wants === received || max_bytes > 0 && receivedBytes >= max_bytes) {
            qi.stop();
          }
        }
      };
      const inbox = createInbox(this.nc.options.inboxPrefix);
      const sub = this.nc.subscribe(inbox, {
        max: opts.batch,
        callback: (err, msg) => {
          if (err === null) {
            err = checkJsError(msg);
          }
          if (err !== null) {
            if (timer) {
              timer.cancel();
              timer = null;
            }
            if (isNatsError(err)) {
              qi.stop(hideNonTerminalJsErrors(err) === null ? void 0 : err);
            } else {
              qi.stop(err);
            }
          } else {
            monitor?.work();
            qi.received++;
            qi.push(toJsMsg(msg, this.timeout));
          }
        }
      });
      if (expires) {
        timer = timeout(expires);
        timer.catch(() => {
          if (!sub.isClosed()) {
            sub.drain().catch(() => {
            });
            timer = null;
          }
          if (monitor) {
            monitor.cancel();
          }
        });
      }
      (async () => {
        try {
          if (hb) {
            monitor = new IdleHeartbeatMonitor(hb, (v2) => {
              qi.push(() => {
                qi.err = new NatsError(`${Js409Errors.IdleHeartbeatMissed}: ${v2}`, ErrorCode.JetStreamIdleHeartBeat);
              });
              return true;
            });
          }
        } catch (_err) {
        }
        await sub.closed;
        if (timer !== null) {
          timer.cancel();
          timer = null;
        }
        if (monitor) {
          monitor.cancel();
        }
        qi.stop();
      })().catch();
      this.nc.publish(`${this.prefix}.CONSUMER.MSG.NEXT.${stream}.${durable}`, this.jc.encode(args), {
        reply: inbox
      });
      return qi;
    }
    async pullSubscribe(subject, opts = consumerOpts()) {
      const cso = await this._processOptions(subject, opts);
      if (cso.ordered) {
        throw new Error("pull subscribers cannot be be ordered");
      }
      if (cso.config.deliver_subject) {
        throw new Error("consumer info specifies deliver_subject - pull consumers cannot have deliver_subject set");
      }
      const ackPolicy = cso.config.ack_policy;
      if (ackPolicy === AckPolicy.None || ackPolicy === AckPolicy.All) {
        throw new Error("ack policy for pull consumers must be explicit");
      }
      const so = this._buildTypedSubscriptionOpts(cso);
      const sub = new JetStreamPullSubscriptionImpl(this, cso.deliver, so);
      sub.info = cso;
      try {
        await this._maybeCreateConsumer(cso);
      } catch (err) {
        sub.unsubscribe();
        throw err;
      }
      return sub;
    }
    async subscribe(subject, opts = consumerOpts()) {
      const cso = await this._processOptions(subject, opts);
      if (!cso.isBind && !cso.config.deliver_subject) {
        throw new Error("push consumer requires deliver_subject");
      }
      const so = this._buildTypedSubscriptionOpts(cso);
      const sub = new JetStreamSubscriptionImpl(this, cso.deliver, so);
      sub.info = cso;
      try {
        await this._maybeCreateConsumer(cso);
      } catch (err) {
        sub.unsubscribe();
        throw err;
      }
      sub._maybeSetupHbMonitoring();
      return sub;
    }
    async _processOptions(subject, opts = consumerOpts()) {
      const jsi = isConsumerOptsBuilder(opts) ? opts.getOpts() : opts;
      jsi.isBind = isConsumerOptsBuilder(opts) ? opts.isBind : false;
      jsi.flow_control = {
        heartbeat_count: 0,
        fc_count: 0,
        consumer_restarts: 0
      };
      if (jsi.ordered) {
        jsi.ordered_consumer_sequence = {
          stream_seq: 0,
          delivery_seq: 0
        };
        if (jsi.config.ack_policy !== AckPolicy.NotSet && jsi.config.ack_policy !== AckPolicy.None) {
          throw new NatsError("ordered consumer: ack_policy can only be set to 'none'", ErrorCode.ApiError);
        }
        if (jsi.config.durable_name && jsi.config.durable_name.length > 0) {
          throw new NatsError("ordered consumer: durable_name cannot be set", ErrorCode.ApiError);
        }
        if (jsi.config.deliver_subject && jsi.config.deliver_subject.length > 0) {
          throw new NatsError("ordered consumer: deliver_subject cannot be set", ErrorCode.ApiError);
        }
        if (jsi.config.max_deliver !== void 0 && jsi.config.max_deliver > 1) {
          throw new NatsError("ordered consumer: max_deliver cannot be set", ErrorCode.ApiError);
        }
        if (jsi.config.deliver_group && jsi.config.deliver_group.length > 0) {
          throw new NatsError("ordered consumer: deliver_group cannot be set", ErrorCode.ApiError);
        }
        jsi.config.deliver_subject = createInbox(this.nc.options.inboxPrefix);
        jsi.config.ack_policy = AckPolicy.None;
        jsi.config.max_deliver = 1;
        jsi.config.flow_control = true;
        jsi.config.idle_heartbeat = jsi.config.idle_heartbeat || nanos(5e3);
        jsi.config.ack_wait = nanos(22 * 60 * 60 * 1e3);
        jsi.config.mem_storage = true;
        jsi.config.num_replicas = 1;
      }
      if (jsi.config.ack_policy === AckPolicy.NotSet) {
        jsi.config.ack_policy = AckPolicy.All;
      }
      jsi.api = this;
      jsi.config = jsi.config || {};
      jsi.stream = jsi.stream ? jsi.stream : await this.findStream(subject);
      jsi.attached = false;
      if (jsi.config.durable_name) {
        try {
          const info = await this.consumerAPI.info(jsi.stream, jsi.config.durable_name);
          if (info) {
            if (info.config.filter_subject && info.config.filter_subject !== subject) {
              throw new Error("subject does not match consumer");
            }
            const qn = jsi.config.deliver_group ?? "";
            if (qn === "" && info.push_bound === true) {
              throw new Error(`duplicate subscription`);
            }
            const rqn = info.config.deliver_group ?? "";
            if (qn !== rqn) {
              if (rqn === "") {
                throw new Error(`durable requires no queue group`);
              } else {
                throw new Error(`durable requires queue group '${rqn}'`);
              }
            }
            jsi.last = info;
            jsi.config = info.config;
            jsi.attached = true;
            if (!jsi.config.durable_name) {
              jsi.name = info.name;
            }
          }
        } catch (err) {
          if (err.code !== "404") {
            throw err;
          }
        }
      }
      if (!jsi.attached && jsi.config.filter_subject === void 0 && jsi.config.filter_subjects === void 0) {
        jsi.config.filter_subject = subject;
      }
      jsi.deliver = jsi.config.deliver_subject || createInbox(this.nc.options.inboxPrefix);
      return jsi;
    }
    _buildTypedSubscriptionOpts(jsi) {
      const so = {};
      so.adapter = msgAdapter(jsi.callbackFn === void 0, this.timeout);
      so.ingestionFilterFn = _JetStreamClientImpl.ingestionFn(jsi.ordered);
      so.protocolFilterFn = (jm, ingest = false) => {
        const jsmi = jm;
        if (isFlowControlMsg(jsmi.msg)) {
          if (!ingest) {
            jsmi.msg.respond();
          }
          return false;
        }
        return true;
      };
      if (!jsi.mack && jsi.config.ack_policy !== AckPolicy.None) {
        so.dispatchedFn = autoAckJsMsg;
      }
      if (jsi.callbackFn) {
        so.callback = jsi.callbackFn;
      }
      so.max = jsi.max || 0;
      so.queue = jsi.queue;
      return so;
    }
    async _maybeCreateConsumer(jsi) {
      if (jsi.attached) {
        return;
      }
      if (jsi.isBind) {
        throw new Error(`unable to bind - durable consumer ${jsi.config.durable_name} doesn't exist in ${jsi.stream}`);
      }
      jsi.config = Object.assign({
        deliver_policy: DeliverPolicy.All,
        ack_policy: AckPolicy.Explicit,
        ack_wait: nanos(30 * 1e3),
        replay_policy: ReplayPolicy.Instant
      }, jsi.config);
      const ci = await this.consumerAPI.add(jsi.stream, jsi.config);
      if (Array.isArray(jsi.config.filter_subjects && !Array.isArray(ci.config.filter_subjects))) {
        throw new Error(`jetstream server doesn't support consumers with multiple filter subjects`);
      }
      jsi.name = ci.name;
      jsi.config = ci.config;
      jsi.last = ci;
    }
    static ingestionFn(ordered) {
      return (jm, ctx) => {
        const jsub = ctx;
        if (!jm) return {
          ingest: false,
          protocol: false
        };
        const jmi = jm;
        if (!checkJsError(jmi.msg)) {
          jsub.monitor?.work();
        }
        if (isHeartbeatMsg(jmi.msg)) {
          const ingest2 = ordered ? jsub._checkHbOrderConsumer(jmi.msg) : true;
          if (!ordered) {
            jsub.info.flow_control.heartbeat_count++;
          }
          return {
            ingest: ingest2,
            protocol: true
          };
        } else if (isFlowControlMsg(jmi.msg)) {
          jsub.info.flow_control.fc_count++;
          return {
            ingest: true,
            protocol: true
          };
        }
        const ingest = ordered ? jsub._checkOrderedConsumer(jm) : true;
        return {
          ingest,
          protocol: false
        };
      };
    }
  };
  var NatsConnectionImpl = class _NatsConnectionImpl {
    options;
    protocol;
    draining;
    listeners;
    _services;
    constructor(opts) {
      this.draining = false;
      this.options = parseOptions(opts);
      this.listeners = [];
    }
    static connect(opts = {}) {
      return new Promise((resolve, reject) => {
        const nc = new _NatsConnectionImpl(opts);
        ProtocolHandler.connect(nc.options, nc).then((ph) => {
          nc.protocol = ph;
          (async function() {
            for await (const s2 of ph.status()) {
              nc.listeners.forEach((l2) => {
                l2.push(s2);
              });
            }
          })();
          resolve(nc);
        }).catch((err) => {
          reject(err);
        });
      });
    }
    closed() {
      return this.protocol.closed;
    }
    async close() {
      await this.protocol.close();
    }
    _check(subject, sub, pub) {
      if (this.isClosed()) {
        throw NatsError.errorForCode(ErrorCode.ConnectionClosed);
      }
      if (sub && this.isDraining()) {
        throw NatsError.errorForCode(ErrorCode.ConnectionDraining);
      }
      if (pub && this.protocol.noMorePublishing) {
        throw NatsError.errorForCode(ErrorCode.ConnectionDraining);
      }
      subject = subject || "";
      if (subject.length === 0) {
        throw NatsError.errorForCode(ErrorCode.BadSubject);
      }
    }
    publish(subject, data, options) {
      this._check(subject, false, true);
      this.protocol.publish(subject, data, options);
    }
    publishMessage(msg) {
      return this.publish(msg.subject, msg.data, {
        reply: msg.reply,
        headers: msg.headers
      });
    }
    respondMessage(msg) {
      if (msg.reply) {
        this.publish(msg.reply, msg.data, {
          reply: msg.reply,
          headers: msg.headers
        });
        return true;
      }
      return false;
    }
    subscribe(subject, opts = {}) {
      this._check(subject, true, false);
      const sub = new SubscriptionImpl(this.protocol, subject, opts);
      this.protocol.subscribe(sub);
      return sub;
    }
    _resub(s2, subject, max) {
      this._check(subject, true, false);
      const si = s2;
      si.max = max;
      if (max) {
        si.max = max + si.received;
      }
      this.protocol.resub(si, subject);
    }
    requestMany(subject, data = Empty, opts = {
      maxWait: 1e3,
      maxMessages: -1
    }) {
      const asyncTraces = !(this.protocol.options.noAsyncTraces || false);
      try {
        this._check(subject, true, true);
      } catch (err) {
        return Promise.reject(err);
      }
      opts.strategy = opts.strategy || RequestStrategy.Timer;
      opts.maxWait = opts.maxWait || 1e3;
      if (opts.maxWait < 1) {
        return Promise.reject(new NatsError("timeout", ErrorCode.InvalidOption));
      }
      const qi = new QueuedIteratorImpl();
      function stop(err) {
        qi.push(() => {
          qi.stop(err);
        });
      }
      function callback(err, msg) {
        if (err || msg === null) {
          stop(err === null ? void 0 : err);
        } else {
          qi.push(msg);
        }
      }
      if (opts.noMux) {
        const stack = asyncTraces ? new Error().stack : null;
        let max = typeof opts.maxMessages === "number" && opts.maxMessages > 0 ? opts.maxMessages : -1;
        const sub = this.subscribe(createInbox(this.options.inboxPrefix), {
          callback: (err, msg) => {
            if (msg?.data?.length === 0 && msg?.headers?.status === ErrorCode.NoResponders) {
              err = NatsError.errorForCode(ErrorCode.NoResponders);
            }
            if (err) {
              if (stack) {
                err.stack += `

${stack}`;
              }
              cancel(err);
              return;
            }
            callback(null, msg);
            if (opts.strategy === RequestStrategy.Count) {
              max--;
              if (max === 0) {
                cancel();
              }
            }
            if (opts.strategy === RequestStrategy.JitterTimer) {
              clearTimers();
              timer = setTimeout(() => {
                cancel();
              }, 300);
            }
            if (opts.strategy === RequestStrategy.SentinelMsg) {
              if (msg && msg.data.length === 0) {
                cancel();
              }
            }
          }
        });
        sub.requestSubject = subject;
        sub.closed.then(() => {
          stop();
        }).catch((err) => {
          qi.stop(err);
        });
        const cancel = (err) => {
          if (err) {
            qi.push(() => {
              throw err;
            });
          }
          clearTimers();
          sub.drain().then(() => {
            stop();
          }).catch((_err) => {
            stop();
          });
        };
        qi.iterClosed.then(() => {
          clearTimers();
          sub?.unsubscribe();
        }).catch((_err) => {
          clearTimers();
          sub?.unsubscribe();
        });
        try {
          this.publish(subject, data, {
            reply: sub.getSubject()
          });
        } catch (err) {
          cancel(err);
        }
        let timer = setTimeout(() => {
          cancel();
        }, opts.maxWait);
        const clearTimers = () => {
          if (timer) {
            clearTimeout(timer);
          }
        };
      } else {
        const rmo = opts;
        rmo.callback = callback;
        qi.iterClosed.then(() => {
          r2.cancel();
        }).catch((err) => {
          r2.cancel(err);
        });
        const r2 = new RequestMany(this.protocol.muxSubscriptions, subject, rmo);
        this.protocol.request(r2);
        try {
          this.publish(subject, data, {
            reply: `${this.protocol.muxSubscriptions.baseInbox}${r2.token}`,
            headers: opts.headers
          });
        } catch (err) {
          r2.cancel(err);
        }
      }
      return Promise.resolve(qi);
    }
    request(subject, data, opts = {
      timeout: 1e3,
      noMux: false
    }) {
      try {
        this._check(subject, true, true);
      } catch (err) {
        return Promise.reject(err);
      }
      const asyncTraces = !(this.protocol.options.noAsyncTraces || false);
      opts.timeout = opts.timeout || 1e3;
      if (opts.timeout < 1) {
        return Promise.reject(new NatsError("timeout", ErrorCode.InvalidOption));
      }
      if (!opts.noMux && opts.reply) {
        return Promise.reject(new NatsError("reply can only be used with noMux", ErrorCode.InvalidOption));
      }
      if (opts.noMux) {
        const inbox = opts.reply ? opts.reply : createInbox(this.options.inboxPrefix);
        const d2 = deferred();
        const errCtx = asyncTraces ? new Error() : null;
        const sub = this.subscribe(inbox, {
          max: 1,
          timeout: opts.timeout,
          callback: (err, msg) => {
            if (err) {
              if (errCtx && err.code !== ErrorCode.Timeout) {
                err.stack += `

${errCtx.stack}`;
              }
              sub.unsubscribe();
              d2.reject(err);
            } else {
              err = isRequestError(msg);
              if (err) {
                if (errCtx) {
                  err.stack += `

${errCtx.stack}`;
                }
                d2.reject(err);
              } else {
                d2.resolve(msg);
              }
            }
          }
        });
        sub.requestSubject = subject;
        this.protocol.publish(subject, data, {
          reply: inbox,
          headers: opts.headers
        });
        return d2;
      } else {
        const r2 = new RequestOne(this.protocol.muxSubscriptions, subject, opts, asyncTraces);
        this.protocol.request(r2);
        try {
          this.publish(subject, data, {
            reply: `${this.protocol.muxSubscriptions.baseInbox}${r2.token}`,
            headers: opts.headers
          });
        } catch (err) {
          r2.cancel(err);
        }
        const p2 = Promise.race([
          r2.timer,
          r2.deferred
        ]);
        p2.catch(() => {
          r2.cancel();
        });
        return p2;
      }
    }
    flush() {
      if (this.isClosed()) {
        return Promise.reject(NatsError.errorForCode(ErrorCode.ConnectionClosed));
      }
      return this.protocol.flush();
    }
    drain() {
      if (this.isClosed()) {
        return Promise.reject(NatsError.errorForCode(ErrorCode.ConnectionClosed));
      }
      if (this.isDraining()) {
        return Promise.reject(NatsError.errorForCode(ErrorCode.ConnectionDraining));
      }
      this.draining = true;
      return this.protocol.drain();
    }
    isClosed() {
      return this.protocol.isClosed();
    }
    isDraining() {
      return this.draining;
    }
    getServer() {
      const srv = this.protocol.getServer();
      return srv ? srv.listen : "";
    }
    status() {
      const iter = new QueuedIteratorImpl();
      iter.iterClosed.then(() => {
        const idx = this.listeners.indexOf(iter);
        this.listeners.splice(idx, 1);
      });
      this.listeners.push(iter);
      return iter;
    }
    get info() {
      return this.protocol.isClosed() ? void 0 : this.protocol.info;
    }
    async context() {
      const r2 = await this.request(`$SYS.REQ.USER.INFO`);
      return r2.json((key, value) => {
        if (key === "time") {
          return new Date(Date.parse(value));
        }
        return value;
      });
    }
    stats() {
      return {
        inBytes: this.protocol.inBytes,
        outBytes: this.protocol.outBytes,
        inMsgs: this.protocol.inMsgs,
        outMsgs: this.protocol.outMsgs
      };
    }
    async jetstreamManager(opts = {}) {
      const adm = new JetStreamManagerImpl(this, opts);
      if (opts.checkAPI !== false) {
        try {
          await adm.getAccountInfo();
        } catch (err) {
          const ne = err;
          if (ne.code === ErrorCode.NoResponders) {
            ne.code = ErrorCode.JetStreamNotEnabled;
          }
          throw ne;
        }
      }
      return adm;
    }
    jetstream(opts = {}) {
      return new JetStreamClientImpl(this, opts);
    }
    getServerVersion() {
      const info = this.info;
      return info ? parseSemVer(info.version) : void 0;
    }
    async rtt() {
      if (!this.protocol._closed && !this.protocol.connected) {
        throw NatsError.errorForCode(ErrorCode.Disconnect);
      }
      const start = Date.now();
      await this.flush();
      return Date.now() - start;
    }
    get features() {
      return this.protocol.features;
    }
    get services() {
      if (!this._services) {
        this._services = new ServicesFactory(this);
      }
      return this._services;
    }
    reconnect() {
      if (this.isClosed()) {
        return Promise.reject(NatsError.errorForCode(ErrorCode.ConnectionClosed));
      }
      if (this.isDraining()) {
        return Promise.reject(NatsError.errorForCode(ErrorCode.ConnectionDraining));
      }
      return this.protocol.reconnect();
    }
  };
  var ServicesFactory = class {
    nc;
    constructor(nc) {
      this.nc = nc;
    }
    add(config) {
      try {
        const s2 = new ServiceImpl(this.nc, config);
        return s2.start();
      } catch (err) {
        return Promise.reject(err);
      }
    }
    client(opts, prefix) {
      return new ServiceClientImpl(this.nc, opts, prefix);
    }
  };
  var KvStoredEntryImpl = class {
    bucket;
    sm;
    prefixLen;
    constructor(bucket, prefixLen, sm) {
      this.bucket = bucket;
      this.prefixLen = prefixLen;
      this.sm = sm;
    }
    get key() {
      return this.sm.subject.substring(this.prefixLen);
    }
    get value() {
      return this.sm.data;
    }
    get delta() {
      return 0;
    }
    get created() {
      return this.sm.time;
    }
    get revision() {
      return this.sm.seq;
    }
    get operation() {
      return this.sm.header.get(kvOperationHdr) || "PUT";
    }
    get length() {
      const slen = this.sm.header.get(JsHeaders.MessageSizeHdr) || "";
      if (slen !== "") {
        return parseInt(slen, 10);
      }
      return this.sm.data.length;
    }
    json() {
      return this.sm.json();
    }
    string() {
      return this.sm.string();
    }
  };
  var KvJsMsgEntryImpl = class {
    bucket;
    key;
    sm;
    constructor(bucket, key, sm) {
      this.bucket = bucket;
      this.key = key;
      this.sm = sm;
    }
    get value() {
      return this.sm.data;
    }
    get created() {
      return new Date(millis(this.sm.info.timestampNanos));
    }
    get revision() {
      return this.sm.seq;
    }
    get operation() {
      return this.sm.headers?.get(kvOperationHdr) || "PUT";
    }
    get delta() {
      return this.sm.info.pending;
    }
    get length() {
      const slen = this.sm.headers?.get(JsHeaders.MessageSizeHdr) || "";
      if (slen !== "") {
        return parseInt(slen, 10);
      }
      return this.sm.data.length;
    }
    json() {
      return this.sm.json();
    }
    string() {
      return this.sm.string();
    }
  };
  var JetStreamSubscriptionImpl = class extends TypedSubscription {
    js;
    monitor;
    constructor(js, subject, opts) {
      super(js.nc, subject, opts);
      this.js = js;
      this.monitor = null;
      this.sub.closed.then(() => {
        if (this.monitor) {
          this.monitor.cancel();
        }
      });
    }
    set info(info) {
      this.sub.info = info;
    }
    get info() {
      return this.sub.info;
    }
    _resetOrderedConsumer(sseq) {
      if (this.info === null || this.sub.isClosed()) {
        return;
      }
      const newDeliver = createInbox(this.js.nc.options.inboxPrefix);
      const nci = this.js.nc;
      nci._resub(this.sub, newDeliver);
      const info = this.info;
      info.config.name = nuid.next();
      info.ordered_consumer_sequence.delivery_seq = 0;
      info.flow_control.heartbeat_count = 0;
      info.flow_control.fc_count = 0;
      info.flow_control.consumer_restarts++;
      info.deliver = newDeliver;
      info.config.deliver_subject = newDeliver;
      info.config.deliver_policy = DeliverPolicy.StartSequence;
      info.config.opt_start_seq = sseq;
      const req = {};
      req.stream_name = this.info.stream;
      req.config = info.config;
      const subj = `${info.api.prefix}.CONSUMER.CREATE.${info.stream}`;
      this.js._request(subj, req, {
        retries: -1
      }).then((v2) => {
        const ci = v2;
        const jinfo = this.sub.info;
        jinfo.last = ci;
        this.info.config = ci.config;
        this.info.name = ci.name;
      }).catch((err) => {
        const nerr = new NatsError(`unable to recreate ordered consumer ${info.stream} at seq ${sseq}`, ErrorCode.RequestError, err);
        this.sub.callback(nerr, {});
      });
    }
    _maybeSetupHbMonitoring() {
      const ns = this.info?.config?.idle_heartbeat || 0;
      if (ns) {
        this._setupHbMonitoring(millis(ns));
      }
    }
    _setupHbMonitoring(millis2, cancelAfter = 0) {
      const opts = {
        cancelAfter: 0,
        maxOut: 2
      };
      if (cancelAfter) {
        opts.cancelAfter = cancelAfter;
      }
      const sub = this.sub;
      const handler = (v2) => {
        const msg = newJsErrorMsg(409, `${Js409Errors.IdleHeartbeatMissed}: ${v2}`, this.sub.subject);
        const ordered = this.info?.ordered;
        if (!ordered) {
          this.sub.callback(null, msg);
        } else {
          if (!this.js.nc.protocol.connected) {
            return false;
          }
          const seq = this.info?.ordered_consumer_sequence?.stream_seq || 0;
          this._resetOrderedConsumer(seq + 1);
          this.monitor?.restart();
          return false;
        }
        return !sub.noIterator;
      };
      this.monitor = new IdleHeartbeatMonitor(millis2, handler, opts);
    }
    _checkHbOrderConsumer(msg) {
      const rm = msg.headers.get(JsHeaders.ConsumerStalledHdr);
      if (rm !== "") {
        const nci = this.js.nc;
        nci.publish(rm);
      }
      const lastDelivered = parseInt(msg.headers.get(JsHeaders.LastConsumerSeqHdr), 10);
      const ordered = this.info.ordered_consumer_sequence;
      this.info.flow_control.heartbeat_count++;
      if (lastDelivered !== ordered.delivery_seq) {
        this._resetOrderedConsumer(ordered.stream_seq + 1);
      }
      return false;
    }
    _checkOrderedConsumer(jm) {
      const ordered = this.info.ordered_consumer_sequence;
      const sseq = jm.info.streamSequence;
      const dseq = jm.info.deliverySequence;
      if (dseq != ordered.delivery_seq + 1) {
        this._resetOrderedConsumer(ordered.stream_seq + 1);
        return false;
      }
      ordered.delivery_seq = dseq;
      ordered.stream_seq = sseq;
      return true;
    }
    async destroy() {
      if (!this.isClosed()) {
        await this.drain();
      }
      const jinfo = this.sub.info;
      const name = jinfo.config.durable_name || jinfo.name;
      const subj = `${jinfo.api.prefix}.CONSUMER.DELETE.${jinfo.stream}.${name}`;
      await jinfo.api._request(subj);
    }
    async consumerInfo() {
      const jinfo = this.sub.info;
      const name = jinfo.config.durable_name || jinfo.name;
      const subj = `${jinfo.api.prefix}.CONSUMER.INFO.${jinfo.stream}.${name}`;
      const ci = await jinfo.api._request(subj);
      jinfo.last = ci;
      return ci;
    }
  };
  var JetStreamPullSubscriptionImpl = class extends JetStreamSubscriptionImpl {
    constructor(js, subject, opts) {
      super(js, subject, opts);
    }
    pull(opts = {
      batch: 1
    }) {
      const { stream, config, name } = this.sub.info;
      const consumer = config.durable_name ?? name;
      const args = {};
      args.batch = opts.batch || 1;
      args.no_wait = opts.no_wait || false;
      if ((opts.max_bytes ?? 0) > 0) {
        const fv = this.js.nc.features.get(Feature.JS_PULL_MAX_BYTES);
        if (!fv.ok) {
          throw new Error(`max_bytes is only supported on servers ${fv.min} or better`);
        }
        args.max_bytes = opts.max_bytes;
      }
      let expires = 0;
      if (opts.expires && opts.expires > 0) {
        expires = opts.expires;
        args.expires = nanos(expires);
      }
      let hb = 0;
      if (opts.idle_heartbeat && opts.idle_heartbeat > 0) {
        hb = opts.idle_heartbeat;
        args.idle_heartbeat = nanos(hb);
      }
      if (hb && expires === 0) {
        throw new Error("idle_heartbeat requires expires");
      }
      if (hb > expires) {
        throw new Error("expires must be greater than idle_heartbeat");
      }
      if (this.info) {
        if (this.monitor) {
          this.monitor.cancel();
        }
        if (expires && hb) {
          if (!this.monitor) {
            this._setupHbMonitoring(hb, expires);
          } else {
            this.monitor._change(hb, expires);
          }
        }
        const api = this.info.api;
        const subj = `${api.prefix}.CONSUMER.MSG.NEXT.${stream}.${consumer}`;
        const reply = this.sub.subject;
        api.nc.publish(subj, api.jc.encode(args), {
          reply
        });
      }
    }
  };
  function msgAdapter(iterator, ackTimeout) {
    if (iterator) {
      return iterMsgAdapter(ackTimeout);
    } else {
      return cbMsgAdapter(ackTimeout);
    }
  }
  function cbMsgAdapter(ackTimeout) {
    return (err, msg) => {
      if (err) {
        return [
          err,
          null
        ];
      }
      err = checkJsError(msg);
      if (err) {
        return [
          err,
          null
        ];
      }
      return [
        null,
        toJsMsg(msg, ackTimeout)
      ];
    };
  }
  function iterMsgAdapter(ackTimeout) {
    return (err, msg) => {
      if (err) {
        return [
          err,
          null
        ];
      }
      const ne = checkJsError(msg);
      if (ne !== null) {
        return [
          hideNonTerminalJsErrors(ne),
          null
        ];
      }
      return [
        null,
        toJsMsg(msg, ackTimeout)
      ];
    };
  }
  function hideNonTerminalJsErrors(ne) {
    if (ne !== null) {
      switch (ne.code) {
        case ErrorCode.JetStream404NoMessages:
        case ErrorCode.JetStream408RequestTimeout:
          return null;
        case ErrorCode.JetStream409:
          if (isTerminal409(ne)) {
            return ne;
          }
          return null;
        default:
          return ne;
      }
    }
    return null;
  }
  function autoAckJsMsg(data) {
    if (data) {
      data.ack();
    }
  }
  function parseInfo(s2) {
    const tokens = s2.split(".");
    if (tokens.length === 9) {
      tokens.splice(2, 0, "_", "");
    }
    if (tokens.length < 11 || tokens[0] !== "$JS" || tokens[1] !== "ACK") {
      throw new Error(`not js message`);
    }
    const di = {};
    di.domain = tokens[2] === "_" ? "" : tokens[2];
    di.account_hash = tokens[3];
    di.stream = tokens[4];
    di.consumer = tokens[5];
    di.deliveryCount = parseInt(tokens[6], 10);
    di.redeliveryCount = di.deliveryCount;
    di.redelivered = di.deliveryCount > 1;
    di.streamSequence = parseInt(tokens[7], 10);
    di.deliverySequence = parseInt(tokens[8], 10);
    di.timestampNanos = parseInt(tokens[9], 10);
    di.pending = parseInt(tokens[10], 10);
    return di;
  }
  var JsMsgImpl = class {
    msg;
    di;
    didAck;
    timeout;
    constructor(msg, timeout2) {
      this.msg = msg;
      this.didAck = false;
      this.timeout = timeout2;
    }
    get subject() {
      return this.msg.subject;
    }
    get sid() {
      return this.msg.sid;
    }
    get data() {
      return this.msg.data;
    }
    get headers() {
      return this.msg.headers;
    }
    get info() {
      if (!this.di) {
        this.di = parseInfo(this.reply);
      }
      return this.di;
    }
    get redelivered() {
      return this.info.deliveryCount > 1;
    }
    get reply() {
      return this.msg.reply || "";
    }
    get seq() {
      return this.info.streamSequence;
    }
    doAck(payload) {
      if (!this.didAck) {
        this.didAck = !this.isWIP(payload);
        this.msg.respond(payload);
      }
    }
    isWIP(p2) {
      return p2.length === 4 && p2[0] === WPI[0] && p2[1] === WPI[1] && p2[2] === WPI[2] && p2[3] === WPI[3];
    }
    async ackAck(opts) {
      opts = opts || {};
      opts.timeout = opts.timeout || this.timeout;
      const d2 = deferred();
      if (!this.didAck) {
        this.didAck = true;
        if (this.msg.reply) {
          const mi = this.msg;
          const proto = mi.publisher;
          const trace = !(proto.options?.noAsyncTraces || false);
          const r2 = new RequestOne(proto.muxSubscriptions, this.msg.reply, {
            timeout: opts.timeout
          }, trace);
          proto.request(r2);
          try {
            proto.publish(this.msg.reply, ACK, {
              reply: `${proto.muxSubscriptions.baseInbox}${r2.token}`
            });
          } catch (err) {
            r2.cancel(err);
          }
          try {
            await Promise.race([
              r2.timer,
              r2.deferred
            ]);
            d2.resolve(true);
          } catch (err) {
            r2.cancel(err);
            d2.reject(err);
          }
        } else {
          d2.resolve(false);
        }
      } else {
        d2.resolve(false);
      }
      return d2;
    }
    ack() {
      this.doAck(ACK);
    }
    nak(millis2) {
      let payload = NAK;
      if (millis2) {
        payload = StringCodec().encode(`-NAK ${JSON.stringify({
          delay: nanos(millis2)
        })}`);
      }
      this.doAck(payload);
    }
    working() {
      this.doAck(WPI);
    }
    next(subj, opts = {
      batch: 1
    }) {
      const args = {};
      args.batch = opts.batch || 1;
      args.no_wait = opts.no_wait || false;
      if (opts.expires && opts.expires > 0) {
        args.expires = nanos(opts.expires);
      }
      const data = JSONCodec().encode(args);
      const payload = DataBuffer.concat(NXT, SPACE, data);
      const reqOpts = subj ? {
        reply: subj
      } : void 0;
      this.msg.respond(payload, reqOpts);
    }
    term(reason = "") {
      let term = TERM;
      if (reason?.length > 0) {
        term = StringCodec().encode(`+TERM ${reason}`);
      }
      this.doAck(term);
    }
    json() {
      return this.msg.json();
    }
    string() {
      return this.msg.string();
    }
  };
  var VERSION = "1.30.3";
  var LANG = "nats.ws";
  var WsTransport = class {
    version;
    lang;
    closeError;
    connected;
    done;
    socket;
    options;
    socketClosed;
    encrypted;
    peeked;
    yields;
    signal;
    closedNotification;
    constructor() {
      this.version = VERSION;
      this.lang = LANG;
      this.connected = false;
      this.done = false;
      this.socketClosed = false;
      this.encrypted = false;
      this.peeked = false;
      this.yields = [];
      this.signal = deferred();
      this.closedNotification = deferred();
    }
    async connect(server, options) {
      const connected = false;
      const connLock = deferred();
      if (options.tls) {
        connLock.reject(new NatsError("tls", ErrorCode.InvalidOption));
        return connLock;
      }
      this.options = options;
      const u2 = server.src;
      if (options.wsFactory) {
        const { socket, encrypted } = await options.wsFactory(server.src, options);
        this.socket = socket;
        this.encrypted = encrypted;
      } else {
        this.encrypted = u2.indexOf("wss://") === 0;
        this.socket = new WebSocket(u2);
      }
      this.socket.binaryType = "arraybuffer";
      this.socket.onopen = () => {
        if (this.isDiscarded()) {
          return;
        }
      };
      this.socket.onmessage = (me) => {
        if (this.isDiscarded()) {
          return;
        }
        this.yields.push(new Uint8Array(me.data));
        if (this.peeked) {
          this.signal.resolve();
          return;
        }
        const t2 = DataBuffer.concat(...this.yields);
        const pm = extractProtocolMessage(t2);
        if (pm !== "") {
          const m2 = INFO.exec(pm);
          if (!m2) {
            if (options.debug) {
              console.error("!!!", render(t2));
            }
            connLock.reject(new Error("unexpected response from server"));
            return;
          }
          try {
            const info = JSON.parse(m2[1]);
            checkOptions(info, this.options);
            this.peeked = true;
            this.connected = true;
            this.signal.resolve();
            connLock.resolve();
          } catch (err) {
            connLock.reject(err);
            return;
          }
        }
      };
      this.socket.onclose = (evt) => {
        if (this.isDiscarded()) {
          return;
        }
        this.socketClosed = true;
        let reason;
        if (this.done) return;
        if (!evt.wasClean) {
          reason = new Error(evt.reason);
        }
        this._closed(reason);
      };
      this.socket.onerror = (e2) => {
        if (this.isDiscarded()) {
          return;
        }
        const evt = e2;
        const err = new NatsError(evt.message, ErrorCode.Unknown, new Error(evt.error));
        if (!connected) {
          connLock.reject(err);
        } else {
          this._closed(err);
        }
      };
      return connLock;
    }
    disconnect() {
      this._closed(void 0, true);
    }
    async _closed(err, internal = true) {
      if (this.isDiscarded()) {
        return;
      }
      if (!this.connected) return;
      if (this.done) return;
      this.closeError = err;
      if (!err) {
        while (!this.socketClosed && this.socket.bufferedAmount > 0) {
          await delay(100);
        }
      }
      this.done = true;
      try {
        this.socket.close(err ? 1002 : 1e3, err ? err.message : void 0);
      } catch (err2) {
      }
      if (internal) {
        this.closedNotification.resolve(err);
      }
    }
    get isClosed() {
      return this.done;
    }
    [Symbol.asyncIterator]() {
      return this.iterate();
    }
    async *iterate() {
      while (true) {
        if (this.isDiscarded()) {
          return;
        }
        if (this.yields.length === 0) {
          await this.signal;
        }
        const yields = this.yields;
        this.yields = [];
        for (let i2 = 0; i2 < yields.length; i2++) {
          if (this.options.debug) {
            console.info(`> ${render(yields[i2])}`);
          }
          yield yields[i2];
        }
        if (this.done) {
          break;
        } else if (this.yields.length === 0) {
          yields.length = 0;
          this.yields = yields;
          this.signal = deferred();
        }
      }
    }
    isEncrypted() {
      return this.connected && this.encrypted;
    }
    send(frame) {
      if (this.isDiscarded()) {
        return;
      }
      try {
        this.socket.send(frame.buffer);
        if (this.options.debug) {
          console.info(`< ${render(frame)}`);
        }
        return;
      } catch (err) {
        if (this.options.debug) {
          console.error(`!!! ${render(frame)}: ${err}`);
        }
      }
    }
    close(err) {
      return this._closed(err, false);
    }
    closed() {
      return this.closedNotification;
    }
    isDiscarded() {
      if (this.done) {
        this.discard();
        return true;
      }
      return false;
    }
    discard() {
      this.done = true;
      try {
        this.socket?.close();
      } catch (_err) {
      }
    }
  };
  function wsUrlParseFn(u2, encrypted) {
    const ut = /^(.*:\/\/)(.*)/;
    if (!ut.test(u2)) {
      if (typeof encrypted === "boolean") {
        u2 = `${encrypted === true ? "https" : "http"}://${u2}`;
      } else {
        u2 = `https://${u2}`;
      }
    }
    let url = new URL(u2);
    const srcProto = url.protocol.toLowerCase();
    if (srcProto === "ws:") {
      encrypted = false;
    }
    if (srcProto === "wss:") {
      encrypted = true;
    }
    if (srcProto !== "https:" && srcProto !== "http") {
      u2 = u2.replace(/^(.*:\/\/)(.*)/gm, "$2");
      url = new URL(`http://${u2}`);
    }
    let protocol;
    let port;
    const host = url.hostname;
    const path = url.pathname;
    const search = url.search || "";
    switch (srcProto) {
      case "http:":
      case "ws:":
      case "nats:":
        port = url.port || "80";
        protocol = "ws:";
        break;
      case "https:":
      case "wss:":
      case "tls:":
        port = url.port || "443";
        protocol = "wss:";
        break;
      default:
        port = url.port || encrypted === true ? "443" : "80";
        protocol = encrypted === true ? "wss:" : "ws:";
        break;
    }
    return `${protocol}//${host}:${port}${path}${search}`;
  }
  function connect(opts = {}) {
    setTransportFactory({
      defaultPort: 443,
      urlParseFn: wsUrlParseFn,
      factory: () => {
        return new WsTransport();
      }
    });
    return NatsConnectionImpl.connect(opts);
  }
  return __toCommonJS(nats_exports);
})();
