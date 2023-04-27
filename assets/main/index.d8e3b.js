window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
        o = b;
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  1: [ function(require, module, exports) {
    (function(global, factory) {
      "object" === typeof exports && "undefined" !== typeof module ? module.exports = factory() : "function" === typeof define && define.amd ? define(factory) : global.moment = factory();
    })(this, function() {
      "use strict";
      var hookCallback;
      function hooks() {
        return hookCallback.apply(null, arguments);
      }
      function setHookCallback(callback) {
        hookCallback = callback;
      }
      function isArray(input) {
        return input instanceof Array || "[object Array]" === Object.prototype.toString.call(input);
      }
      function isObject(input) {
        return null != input && "[object Object]" === Object.prototype.toString.call(input);
      }
      function hasOwnProp(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b);
      }
      function isObjectEmpty(obj) {
        if (Object.getOwnPropertyNames) return 0 === Object.getOwnPropertyNames(obj).length;
        var k;
        for (k in obj) if (hasOwnProp(obj, k)) return false;
        return true;
      }
      function isUndefined(input) {
        return void 0 === input;
      }
      function isNumber(input) {
        return "number" === typeof input || "[object Number]" === Object.prototype.toString.call(input);
      }
      function isDate(input) {
        return input instanceof Date || "[object Date]" === Object.prototype.toString.call(input);
      }
      function map(arr, fn) {
        var res = [], i;
        for (i = 0; i < arr.length; ++i) res.push(fn(arr[i], i));
        return res;
      }
      function extend(a, b) {
        for (var i in b) hasOwnProp(b, i) && (a[i] = b[i]);
        hasOwnProp(b, "toString") && (a.toString = b.toString);
        hasOwnProp(b, "valueOf") && (a.valueOf = b.valueOf);
        return a;
      }
      function createUTC(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, true).utc();
      }
      function defaultParsingFlags() {
        return {
          empty: false,
          unusedTokens: [],
          unusedInput: [],
          overflow: -2,
          charsLeftOver: 0,
          nullInput: false,
          invalidEra: null,
          invalidMonth: null,
          invalidFormat: false,
          userInvalidated: false,
          iso: false,
          parsedDateParts: [],
          era: null,
          meridiem: null,
          rfc2822: false,
          weekdayMismatch: false
        };
      }
      function getParsingFlags(m) {
        null == m._pf && (m._pf = defaultParsingFlags());
        return m._pf;
      }
      var some;
      some = Array.prototype.some ? Array.prototype.some : function(fun) {
        var t = Object(this), len = t.length >>> 0, i;
        for (i = 0; i < len; i++) if (i in t && fun.call(this, t[i], i, t)) return true;
        return false;
      };
      function isValid(m) {
        if (null == m._isValid) {
          var flags = getParsingFlags(m), parsedParts = some.call(flags.parsedDateParts, function(i) {
            return null != i;
          }), isNowValid = !isNaN(m._d.getTime()) && flags.overflow < 0 && !flags.empty && !flags.invalidEra && !flags.invalidMonth && !flags.invalidWeekday && !flags.weekdayMismatch && !flags.nullInput && !flags.invalidFormat && !flags.userInvalidated && (!flags.meridiem || flags.meridiem && parsedParts);
          m._strict && (isNowValid = isNowValid && 0 === flags.charsLeftOver && 0 === flags.unusedTokens.length && void 0 === flags.bigHour);
          if (null != Object.isFrozen && Object.isFrozen(m)) return isNowValid;
          m._isValid = isNowValid;
        }
        return m._isValid;
      }
      function createInvalid(flags) {
        var m = createUTC(NaN);
        null != flags ? extend(getParsingFlags(m), flags) : getParsingFlags(m).userInvalidated = true;
        return m;
      }
      var momentProperties = hooks.momentProperties = [], updateInProgress = false;
      function copyConfig(to, from) {
        var i, prop, val;
        isUndefined(from._isAMomentObject) || (to._isAMomentObject = from._isAMomentObject);
        isUndefined(from._i) || (to._i = from._i);
        isUndefined(from._f) || (to._f = from._f);
        isUndefined(from._l) || (to._l = from._l);
        isUndefined(from._strict) || (to._strict = from._strict);
        isUndefined(from._tzm) || (to._tzm = from._tzm);
        isUndefined(from._isUTC) || (to._isUTC = from._isUTC);
        isUndefined(from._offset) || (to._offset = from._offset);
        isUndefined(from._pf) || (to._pf = getParsingFlags(from));
        isUndefined(from._locale) || (to._locale = from._locale);
        if (momentProperties.length > 0) for (i = 0; i < momentProperties.length; i++) {
          prop = momentProperties[i];
          val = from[prop];
          isUndefined(val) || (to[prop] = val);
        }
        return to;
      }
      function Moment(config) {
        copyConfig(this, config);
        this._d = new Date(null != config._d ? config._d.getTime() : NaN);
        this.isValid() || (this._d = new Date(NaN));
        if (false === updateInProgress) {
          updateInProgress = true;
          hooks.updateOffset(this);
          updateInProgress = false;
        }
      }
      function isMoment(obj) {
        return obj instanceof Moment || null != obj && null != obj._isAMomentObject;
      }
      function warn(msg) {
        false === hooks.suppressDeprecationWarnings && "undefined" !== typeof console && console.warn && console.warn("Deprecation warning: " + msg);
      }
      function deprecate(msg, fn) {
        var firstTime = true;
        return extend(function() {
          null != hooks.deprecationHandler && hooks.deprecationHandler(null, msg);
          if (firstTime) {
            var args = [], arg, i, key;
            for (i = 0; i < arguments.length; i++) {
              arg = "";
              if ("object" === typeof arguments[i]) {
                arg += "\n[" + i + "] ";
                for (key in arguments[0]) hasOwnProp(arguments[0], key) && (arg += key + ": " + arguments[0][key] + ", ");
                arg = arg.slice(0, -2);
              } else arg = arguments[i];
              args.push(arg);
            }
            warn(msg + "\nArguments: " + Array.prototype.slice.call(args).join("") + "\n" + new Error().stack);
            firstTime = false;
          }
          return fn.apply(this, arguments);
        }, fn);
      }
      var deprecations = {};
      function deprecateSimple(name, msg) {
        null != hooks.deprecationHandler && hooks.deprecationHandler(name, msg);
        if (!deprecations[name]) {
          warn(msg);
          deprecations[name] = true;
        }
      }
      hooks.suppressDeprecationWarnings = false;
      hooks.deprecationHandler = null;
      function isFunction(input) {
        return "undefined" !== typeof Function && input instanceof Function || "[object Function]" === Object.prototype.toString.call(input);
      }
      function set(config) {
        var prop, i;
        for (i in config) if (hasOwnProp(config, i)) {
          prop = config[i];
          isFunction(prop) ? this[i] = prop : this["_" + i] = prop;
        }
        this._config = config;
        this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source);
      }
      function mergeConfigs(parentConfig, childConfig) {
        var res = extend({}, parentConfig), prop;
        for (prop in childConfig) if (hasOwnProp(childConfig, prop)) if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
          res[prop] = {};
          extend(res[prop], parentConfig[prop]);
          extend(res[prop], childConfig[prop]);
        } else null != childConfig[prop] ? res[prop] = childConfig[prop] : delete res[prop];
        for (prop in parentConfig) hasOwnProp(parentConfig, prop) && !hasOwnProp(childConfig, prop) && isObject(parentConfig[prop]) && (res[prop] = extend({}, res[prop]));
        return res;
      }
      function Locale(config) {
        null != config && this.set(config);
      }
      var keys;
      keys = Object.keys ? Object.keys : function(obj) {
        var i, res = [];
        for (i in obj) hasOwnProp(obj, i) && res.push(i);
        return res;
      };
      var defaultCalendar = {
        sameDay: "[Today at] LT",
        nextDay: "[Tomorrow at] LT",
        nextWeek: "dddd [at] LT",
        lastDay: "[Yesterday at] LT",
        lastWeek: "[Last] dddd [at] LT",
        sameElse: "L"
      };
      function calendar(key, mom, now) {
        var output = this._calendar[key] || this._calendar["sameElse"];
        return isFunction(output) ? output.call(mom, now) : output;
      }
      function zeroFill(number, targetLength, forceSign) {
        var absNumber = "" + Math.abs(number), zerosToFill = targetLength - absNumber.length, sign = number >= 0;
        return (sign ? forceSign ? "+" : "" : "-") + Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
      }
      var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g, localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, formatFunctions = {}, formatTokenFunctions = {};
      function addFormatToken(token, padded, ordinal, callback) {
        var func = callback;
        "string" === typeof callback && (func = function() {
          return this[callback]();
        });
        token && (formatTokenFunctions[token] = func);
        padded && (formatTokenFunctions[padded[0]] = function() {
          return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
        });
        ordinal && (formatTokenFunctions[ordinal] = function() {
          return this.localeData().ordinal(func.apply(this, arguments), token);
        });
      }
      function removeFormattingTokens(input) {
        if (input.match(/\[[\s\S]/)) return input.replace(/^\[|\]$/g, "");
        return input.replace(/\\/g, "");
      }
      function makeFormatFunction(format) {
        var array = format.match(formattingTokens), i, length;
        for (i = 0, length = array.length; i < length; i++) formatTokenFunctions[array[i]] ? array[i] = formatTokenFunctions[array[i]] : array[i] = removeFormattingTokens(array[i]);
        return function(mom) {
          var output = "", i;
          for (i = 0; i < length; i++) output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
          return output;
        };
      }
      function formatMoment(m, format) {
        if (!m.isValid()) return m.localeData().invalidDate();
        format = expandFormat(format, m.localeData());
        formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);
        return formatFunctions[format](m);
      }
      function expandFormat(format, locale) {
        var i = 5;
        function replaceLongDateFormatTokens(input) {
          return locale.longDateFormat(input) || input;
        }
        localFormattingTokens.lastIndex = 0;
        while (i >= 0 && localFormattingTokens.test(format)) {
          format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
          localFormattingTokens.lastIndex = 0;
          i -= 1;
        }
        return format;
      }
      var defaultLongDateFormat = {
        LTS: "h:mm:ss A",
        LT: "h:mm A",
        L: "MM/DD/YYYY",
        LL: "MMMM D, YYYY",
        LLL: "MMMM D, YYYY h:mm A",
        LLLL: "dddd, MMMM D, YYYY h:mm A"
      };
      function longDateFormat(key) {
        var format = this._longDateFormat[key], formatUpper = this._longDateFormat[key.toUpperCase()];
        if (format || !formatUpper) return format;
        this._longDateFormat[key] = formatUpper.match(formattingTokens).map(function(tok) {
          if ("MMMM" === tok || "MM" === tok || "DD" === tok || "dddd" === tok) return tok.slice(1);
          return tok;
        }).join("");
        return this._longDateFormat[key];
      }
      var defaultInvalidDate = "Invalid date";
      function invalidDate() {
        return this._invalidDate;
      }
      var defaultOrdinal = "%d", defaultDayOfMonthOrdinalParse = /\d{1,2}/;
      function ordinal(number) {
        return this._ordinal.replace("%d", number);
      }
      var defaultRelativeTime = {
        future: "in %s",
        past: "%s ago",
        s: "a few seconds",
        ss: "%d seconds",
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        w: "a week",
        ww: "%d weeks",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years"
      };
      function relativeTime(number, withoutSuffix, string, isFuture) {
        var output = this._relativeTime[string];
        return isFunction(output) ? output(number, withoutSuffix, string, isFuture) : output.replace(/%d/i, number);
      }
      function pastFuture(diff, output) {
        var format = this._relativeTime[diff > 0 ? "future" : "past"];
        return isFunction(format) ? format(output) : format.replace(/%s/i, output);
      }
      var aliases = {};
      function addUnitAlias(unit, shorthand) {
        var lowerCase = unit.toLowerCase();
        aliases[lowerCase] = aliases[lowerCase + "s"] = aliases[shorthand] = unit;
      }
      function normalizeUnits(units) {
        return "string" === typeof units ? aliases[units] || aliases[units.toLowerCase()] : void 0;
      }
      function normalizeObjectUnits(inputObject) {
        var normalizedInput = {}, normalizedProp, prop;
        for (prop in inputObject) if (hasOwnProp(inputObject, prop)) {
          normalizedProp = normalizeUnits(prop);
          normalizedProp && (normalizedInput[normalizedProp] = inputObject[prop]);
        }
        return normalizedInput;
      }
      var priorities = {};
      function addUnitPriority(unit, priority) {
        priorities[unit] = priority;
      }
      function getPrioritizedUnits(unitsObj) {
        var units = [], u;
        for (u in unitsObj) hasOwnProp(unitsObj, u) && units.push({
          unit: u,
          priority: priorities[u]
        });
        units.sort(function(a, b) {
          return a.priority - b.priority;
        });
        return units;
      }
      function isLeapYear(year) {
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
      }
      function absFloor(number) {
        return number < 0 ? Math.ceil(number) || 0 : Math.floor(number);
      }
      function toInt(argumentForCoercion) {
        var coercedNumber = +argumentForCoercion, value = 0;
        0 !== coercedNumber && isFinite(coercedNumber) && (value = absFloor(coercedNumber));
        return value;
      }
      function makeGetSet(unit, keepTime) {
        return function(value) {
          if (null != value) {
            set$1(this, unit, value);
            hooks.updateOffset(this, keepTime);
            return this;
          }
          return get(this, unit);
        };
      }
      function get(mom, unit) {
        return mom.isValid() ? mom._d["get" + (mom._isUTC ? "UTC" : "") + unit]() : NaN;
      }
      function set$1(mom, unit, value) {
        if (mom.isValid() && !isNaN(value)) if ("FullYear" === unit && isLeapYear(mom.year()) && 1 === mom.month() && 29 === mom.date()) {
          value = toInt(value);
          mom._d["set" + (mom._isUTC ? "UTC" : "") + unit](value, mom.month(), daysInMonth(value, mom.month()));
        } else mom._d["set" + (mom._isUTC ? "UTC" : "") + unit](value);
      }
      function stringGet(units) {
        units = normalizeUnits(units);
        if (isFunction(this[units])) return this[units]();
        return this;
      }
      function stringSet(units, value) {
        if ("object" === typeof units) {
          units = normalizeObjectUnits(units);
          var prioritized = getPrioritizedUnits(units), i;
          for (i = 0; i < prioritized.length; i++) this[prioritized[i].unit](units[prioritized[i].unit]);
        } else {
          units = normalizeUnits(units);
          if (isFunction(this[units])) return this[units](value);
        }
        return this;
      }
      var match1 = /\d/, match2 = /\d\d/, match3 = /\d{3}/, match4 = /\d{4}/, match6 = /[+-]?\d{6}/, match1to2 = /\d\d?/, match3to4 = /\d\d\d\d?/, match5to6 = /\d\d\d\d\d\d?/, match1to3 = /\d{1,3}/, match1to4 = /\d{1,4}/, match1to6 = /[+-]?\d{1,6}/, matchUnsigned = /\d+/, matchSigned = /[+-]?\d+/, matchOffset = /Z|[+-]\d\d:?\d\d/gi, matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi, matchTimestamp = /[+-]?\d+(\.\d{1,3})?/, matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i, regexes;
      regexes = {};
      function addRegexToken(token, regex, strictRegex) {
        regexes[token] = isFunction(regex) ? regex : function(isStrict, localeData) {
          return isStrict && strictRegex ? strictRegex : regex;
        };
      }
      function getParseRegexForToken(token, config) {
        if (!hasOwnProp(regexes, token)) return new RegExp(unescapeFormat(token));
        return regexes[token](config._strict, config._locale);
      }
      function unescapeFormat(s) {
        return regexEscape(s.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(matched, p1, p2, p3, p4) {
          return p1 || p2 || p3 || p4;
        }));
      }
      function regexEscape(s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      }
      var tokens = {};
      function addParseToken(token, callback) {
        var i, func = callback;
        "string" === typeof token && (token = [ token ]);
        isNumber(callback) && (func = function(input, array) {
          array[callback] = toInt(input);
        });
        for (i = 0; i < token.length; i++) tokens[token[i]] = func;
      }
      function addWeekParseToken(token, callback) {
        addParseToken(token, function(input, array, config, token) {
          config._w = config._w || {};
          callback(input, config._w, config, token);
        });
      }
      function addTimeToArrayFromToken(token, input, config) {
        null != input && hasOwnProp(tokens, token) && tokens[token](input, config._a, config, token);
      }
      var YEAR = 0, MONTH = 1, DATE = 2, HOUR = 3, MINUTE = 4, SECOND = 5, MILLISECOND = 6, WEEK = 7, WEEKDAY = 8;
      function mod(n, x) {
        return (n % x + x) % x;
      }
      var indexOf;
      indexOf = Array.prototype.indexOf ? Array.prototype.indexOf : function(o) {
        var i;
        for (i = 0; i < this.length; ++i) if (this[i] === o) return i;
        return -1;
      };
      function daysInMonth(year, month) {
        if (isNaN(year) || isNaN(month)) return NaN;
        var modMonth = mod(month, 12);
        year += (month - modMonth) / 12;
        return 1 === modMonth ? isLeapYear(year) ? 29 : 28 : 31 - modMonth % 7 % 2;
      }
      addFormatToken("M", [ "MM", 2 ], "Mo", function() {
        return this.month() + 1;
      });
      addFormatToken("MMM", 0, 0, function(format) {
        return this.localeData().monthsShort(this, format);
      });
      addFormatToken("MMMM", 0, 0, function(format) {
        return this.localeData().months(this, format);
      });
      addUnitAlias("month", "M");
      addUnitPriority("month", 8);
      addRegexToken("M", match1to2);
      addRegexToken("MM", match1to2, match2);
      addRegexToken("MMM", function(isStrict, locale) {
        return locale.monthsShortRegex(isStrict);
      });
      addRegexToken("MMMM", function(isStrict, locale) {
        return locale.monthsRegex(isStrict);
      });
      addParseToken([ "M", "MM" ], function(input, array) {
        array[MONTH] = toInt(input) - 1;
      });
      addParseToken([ "MMM", "MMMM" ], function(input, array, config, token) {
        var month = config._locale.monthsParse(input, token, config._strict);
        null != month ? array[MONTH] = month : getParsingFlags(config).invalidMonth = input;
      });
      var defaultLocaleMonths = "January_February_March_April_May_June_July_August_September_October_November_December".split("_"), defaultLocaleMonthsShort = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"), MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/, defaultMonthsShortRegex = matchWord, defaultMonthsRegex = matchWord;
      function localeMonths(m, format) {
        if (!m) return isArray(this._months) ? this._months : this._months["standalone"];
        return isArray(this._months) ? this._months[m.month()] : this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? "format" : "standalone"][m.month()];
      }
      function localeMonthsShort(m, format) {
        if (!m) return isArray(this._monthsShort) ? this._monthsShort : this._monthsShort["standalone"];
        return isArray(this._monthsShort) ? this._monthsShort[m.month()] : this._monthsShort[MONTHS_IN_FORMAT.test(format) ? "format" : "standalone"][m.month()];
      }
      function handleStrictParse(monthName, format, strict) {
        var i, ii, mom, llc = monthName.toLocaleLowerCase();
        if (!this._monthsParse) {
          this._monthsParse = [];
          this._longMonthsParse = [];
          this._shortMonthsParse = [];
          for (i = 0; i < 12; ++i) {
            mom = createUTC([ 2e3, i ]);
            this._shortMonthsParse[i] = this.monthsShort(mom, "").toLocaleLowerCase();
            this._longMonthsParse[i] = this.months(mom, "").toLocaleLowerCase();
          }
        }
        if (strict) {
          if ("MMM" === format) {
            ii = indexOf.call(this._shortMonthsParse, llc);
            return -1 !== ii ? ii : null;
          }
          ii = indexOf.call(this._longMonthsParse, llc);
          return -1 !== ii ? ii : null;
        }
        if ("MMM" === format) {
          ii = indexOf.call(this._shortMonthsParse, llc);
          if (-1 !== ii) return ii;
          ii = indexOf.call(this._longMonthsParse, llc);
          return -1 !== ii ? ii : null;
        }
        ii = indexOf.call(this._longMonthsParse, llc);
        if (-1 !== ii) return ii;
        ii = indexOf.call(this._shortMonthsParse, llc);
        return -1 !== ii ? ii : null;
      }
      function localeMonthsParse(monthName, format, strict) {
        var i, mom, regex;
        if (this._monthsParseExact) return handleStrictParse.call(this, monthName, format, strict);
        if (!this._monthsParse) {
          this._monthsParse = [];
          this._longMonthsParse = [];
          this._shortMonthsParse = [];
        }
        for (i = 0; i < 12; i++) {
          mom = createUTC([ 2e3, i ]);
          if (strict && !this._longMonthsParse[i]) {
            this._longMonthsParse[i] = new RegExp("^" + this.months(mom, "").replace(".", "") + "$", "i");
            this._shortMonthsParse[i] = new RegExp("^" + this.monthsShort(mom, "").replace(".", "") + "$", "i");
          }
          if (!strict && !this._monthsParse[i]) {
            regex = "^" + this.months(mom, "") + "|^" + this.monthsShort(mom, "");
            this._monthsParse[i] = new RegExp(regex.replace(".", ""), "i");
          }
          if (strict && "MMMM" === format && this._longMonthsParse[i].test(monthName)) return i;
          if (strict && "MMM" === format && this._shortMonthsParse[i].test(monthName)) return i;
          if (!strict && this._monthsParse[i].test(monthName)) return i;
        }
      }
      function setMonth(mom, value) {
        var dayOfMonth;
        if (!mom.isValid()) return mom;
        if ("string" === typeof value) if (/^\d+$/.test(value)) value = toInt(value); else {
          value = mom.localeData().monthsParse(value);
          if (!isNumber(value)) return mom;
        }
        dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
        mom._d["set" + (mom._isUTC ? "UTC" : "") + "Month"](value, dayOfMonth);
        return mom;
      }
      function getSetMonth(value) {
        if (null != value) {
          setMonth(this, value);
          hooks.updateOffset(this, true);
          return this;
        }
        return get(this, "Month");
      }
      function getDaysInMonth() {
        return daysInMonth(this.year(), this.month());
      }
      function monthsShortRegex(isStrict) {
        if (this._monthsParseExact) {
          hasOwnProp(this, "_monthsRegex") || computeMonthsParse.call(this);
          return isStrict ? this._monthsShortStrictRegex : this._monthsShortRegex;
        }
        hasOwnProp(this, "_monthsShortRegex") || (this._monthsShortRegex = defaultMonthsShortRegex);
        return this._monthsShortStrictRegex && isStrict ? this._monthsShortStrictRegex : this._monthsShortRegex;
      }
      function monthsRegex(isStrict) {
        if (this._monthsParseExact) {
          hasOwnProp(this, "_monthsRegex") || computeMonthsParse.call(this);
          return isStrict ? this._monthsStrictRegex : this._monthsRegex;
        }
        hasOwnProp(this, "_monthsRegex") || (this._monthsRegex = defaultMonthsRegex);
        return this._monthsStrictRegex && isStrict ? this._monthsStrictRegex : this._monthsRegex;
      }
      function computeMonthsParse() {
        function cmpLenRev(a, b) {
          return b.length - a.length;
        }
        var shortPieces = [], longPieces = [], mixedPieces = [], i, mom;
        for (i = 0; i < 12; i++) {
          mom = createUTC([ 2e3, i ]);
          shortPieces.push(this.monthsShort(mom, ""));
          longPieces.push(this.months(mom, ""));
          mixedPieces.push(this.months(mom, ""));
          mixedPieces.push(this.monthsShort(mom, ""));
        }
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        for (i = 0; i < 12; i++) {
          shortPieces[i] = regexEscape(shortPieces[i]);
          longPieces[i] = regexEscape(longPieces[i]);
        }
        for (i = 0; i < 24; i++) mixedPieces[i] = regexEscape(mixedPieces[i]);
        this._monthsRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp("^(" + longPieces.join("|") + ")", "i");
        this._monthsShortStrictRegex = new RegExp("^(" + shortPieces.join("|") + ")", "i");
      }
      addFormatToken("Y", 0, 0, function() {
        var y = this.year();
        return y <= 9999 ? zeroFill(y, 4) : "+" + y;
      });
      addFormatToken(0, [ "YY", 2 ], 0, function() {
        return this.year() % 100;
      });
      addFormatToken(0, [ "YYYY", 4 ], 0, "year");
      addFormatToken(0, [ "YYYYY", 5 ], 0, "year");
      addFormatToken(0, [ "YYYYYY", 6, true ], 0, "year");
      addUnitAlias("year", "y");
      addUnitPriority("year", 1);
      addRegexToken("Y", matchSigned);
      addRegexToken("YY", match1to2, match2);
      addRegexToken("YYYY", match1to4, match4);
      addRegexToken("YYYYY", match1to6, match6);
      addRegexToken("YYYYYY", match1to6, match6);
      addParseToken([ "YYYYY", "YYYYYY" ], YEAR);
      addParseToken("YYYY", function(input, array) {
        array[YEAR] = 2 === input.length ? hooks.parseTwoDigitYear(input) : toInt(input);
      });
      addParseToken("YY", function(input, array) {
        array[YEAR] = hooks.parseTwoDigitYear(input);
      });
      addParseToken("Y", function(input, array) {
        array[YEAR] = parseInt(input, 10);
      });
      function daysInYear(year) {
        return isLeapYear(year) ? 366 : 365;
      }
      hooks.parseTwoDigitYear = function(input) {
        return toInt(input) + (toInt(input) > 68 ? 1900 : 2e3);
      };
      var getSetYear = makeGetSet("FullYear", true);
      function getIsLeapYear() {
        return isLeapYear(this.year());
      }
      function createDate(y, m, d, h, M, s, ms) {
        var date;
        if (y < 100 && y >= 0) {
          date = new Date(y + 400, m, d, h, M, s, ms);
          isFinite(date.getFullYear()) && date.setFullYear(y);
        } else date = new Date(y, m, d, h, M, s, ms);
        return date;
      }
      function createUTCDate(y) {
        var date, args;
        if (y < 100 && y >= 0) {
          args = Array.prototype.slice.call(arguments);
          args[0] = y + 400;
          date = new Date(Date.UTC.apply(null, args));
          isFinite(date.getUTCFullYear()) && date.setUTCFullYear(y);
        } else date = new Date(Date.UTC.apply(null, arguments));
        return date;
      }
      function firstWeekOffset(year, dow, doy) {
        var fwd = 7 + dow - doy, fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;
        return -fwdlw + fwd - 1;
      }
      function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
        var localWeekday = (7 + weekday - dow) % 7, weekOffset = firstWeekOffset(year, dow, doy), dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset, resYear, resDayOfYear;
        if (dayOfYear <= 0) {
          resYear = year - 1;
          resDayOfYear = daysInYear(resYear) + dayOfYear;
        } else if (dayOfYear > daysInYear(year)) {
          resYear = year + 1;
          resDayOfYear = dayOfYear - daysInYear(year);
        } else {
          resYear = year;
          resDayOfYear = dayOfYear;
        }
        return {
          year: resYear,
          dayOfYear: resDayOfYear
        };
      }
      function weekOfYear(mom, dow, doy) {
        var weekOffset = firstWeekOffset(mom.year(), dow, doy), week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1, resWeek, resYear;
        if (week < 1) {
          resYear = mom.year() - 1;
          resWeek = week + weeksInYear(resYear, dow, doy);
        } else if (week > weeksInYear(mom.year(), dow, doy)) {
          resWeek = week - weeksInYear(mom.year(), dow, doy);
          resYear = mom.year() + 1;
        } else {
          resYear = mom.year();
          resWeek = week;
        }
        return {
          week: resWeek,
          year: resYear
        };
      }
      function weeksInYear(year, dow, doy) {
        var weekOffset = firstWeekOffset(year, dow, doy), weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
        return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
      }
      addFormatToken("w", [ "ww", 2 ], "wo", "week");
      addFormatToken("W", [ "WW", 2 ], "Wo", "isoWeek");
      addUnitAlias("week", "w");
      addUnitAlias("isoWeek", "W");
      addUnitPriority("week", 5);
      addUnitPriority("isoWeek", 5);
      addRegexToken("w", match1to2);
      addRegexToken("ww", match1to2, match2);
      addRegexToken("W", match1to2);
      addRegexToken("WW", match1to2, match2);
      addWeekParseToken([ "w", "ww", "W", "WW" ], function(input, week, config, token) {
        week[token.substr(0, 1)] = toInt(input);
      });
      function localeWeek(mom) {
        return weekOfYear(mom, this._week.dow, this._week.doy).week;
      }
      var defaultLocaleWeek = {
        dow: 0,
        doy: 6
      };
      function localeFirstDayOfWeek() {
        return this._week.dow;
      }
      function localeFirstDayOfYear() {
        return this._week.doy;
      }
      function getSetWeek(input) {
        var week = this.localeData().week(this);
        return null == input ? week : this.add(7 * (input - week), "d");
      }
      function getSetISOWeek(input) {
        var week = weekOfYear(this, 1, 4).week;
        return null == input ? week : this.add(7 * (input - week), "d");
      }
      addFormatToken("d", 0, "do", "day");
      addFormatToken("dd", 0, 0, function(format) {
        return this.localeData().weekdaysMin(this, format);
      });
      addFormatToken("ddd", 0, 0, function(format) {
        return this.localeData().weekdaysShort(this, format);
      });
      addFormatToken("dddd", 0, 0, function(format) {
        return this.localeData().weekdays(this, format);
      });
      addFormatToken("e", 0, 0, "weekday");
      addFormatToken("E", 0, 0, "isoWeekday");
      addUnitAlias("day", "d");
      addUnitAlias("weekday", "e");
      addUnitAlias("isoWeekday", "E");
      addUnitPriority("day", 11);
      addUnitPriority("weekday", 11);
      addUnitPriority("isoWeekday", 11);
      addRegexToken("d", match1to2);
      addRegexToken("e", match1to2);
      addRegexToken("E", match1to2);
      addRegexToken("dd", function(isStrict, locale) {
        return locale.weekdaysMinRegex(isStrict);
      });
      addRegexToken("ddd", function(isStrict, locale) {
        return locale.weekdaysShortRegex(isStrict);
      });
      addRegexToken("dddd", function(isStrict, locale) {
        return locale.weekdaysRegex(isStrict);
      });
      addWeekParseToken([ "dd", "ddd", "dddd" ], function(input, week, config, token) {
        var weekday = config._locale.weekdaysParse(input, token, config._strict);
        null != weekday ? week.d = weekday : getParsingFlags(config).invalidWeekday = input;
      });
      addWeekParseToken([ "d", "e", "E" ], function(input, week, config, token) {
        week[token] = toInt(input);
      });
      function parseWeekday(input, locale) {
        if ("string" !== typeof input) return input;
        if (!isNaN(input)) return parseInt(input, 10);
        input = locale.weekdaysParse(input);
        if ("number" === typeof input) return input;
        return null;
      }
      function parseIsoWeekday(input, locale) {
        if ("string" === typeof input) return locale.weekdaysParse(input) % 7 || 7;
        return isNaN(input) ? null : input;
      }
      function shiftWeekdays(ws, n) {
        return ws.slice(n, 7).concat(ws.slice(0, n));
      }
      var defaultLocaleWeekdays = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), defaultLocaleWeekdaysShort = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"), defaultLocaleWeekdaysMin = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"), defaultWeekdaysRegex = matchWord, defaultWeekdaysShortRegex = matchWord, defaultWeekdaysMinRegex = matchWord;
      function localeWeekdays(m, format) {
        var weekdays = isArray(this._weekdays) ? this._weekdays : this._weekdays[m && true !== m && this._weekdays.isFormat.test(format) ? "format" : "standalone"];
        return true === m ? shiftWeekdays(weekdays, this._week.dow) : m ? weekdays[m.day()] : weekdays;
      }
      function localeWeekdaysShort(m) {
        return true === m ? shiftWeekdays(this._weekdaysShort, this._week.dow) : m ? this._weekdaysShort[m.day()] : this._weekdaysShort;
      }
      function localeWeekdaysMin(m) {
        return true === m ? shiftWeekdays(this._weekdaysMin, this._week.dow) : m ? this._weekdaysMin[m.day()] : this._weekdaysMin;
      }
      function handleStrictParse$1(weekdayName, format, strict) {
        var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
        if (!this._weekdaysParse) {
          this._weekdaysParse = [];
          this._shortWeekdaysParse = [];
          this._minWeekdaysParse = [];
          for (i = 0; i < 7; ++i) {
            mom = createUTC([ 2e3, 1 ]).day(i);
            this._minWeekdaysParse[i] = this.weekdaysMin(mom, "").toLocaleLowerCase();
            this._shortWeekdaysParse[i] = this.weekdaysShort(mom, "").toLocaleLowerCase();
            this._weekdaysParse[i] = this.weekdays(mom, "").toLocaleLowerCase();
          }
        }
        if (strict) {
          if ("dddd" === format) {
            ii = indexOf.call(this._weekdaysParse, llc);
            return -1 !== ii ? ii : null;
          }
          if ("ddd" === format) {
            ii = indexOf.call(this._shortWeekdaysParse, llc);
            return -1 !== ii ? ii : null;
          }
          ii = indexOf.call(this._minWeekdaysParse, llc);
          return -1 !== ii ? ii : null;
        }
        if ("dddd" === format) {
          ii = indexOf.call(this._weekdaysParse, llc);
          if (-1 !== ii) return ii;
          ii = indexOf.call(this._shortWeekdaysParse, llc);
          if (-1 !== ii) return ii;
          ii = indexOf.call(this._minWeekdaysParse, llc);
          return -1 !== ii ? ii : null;
        }
        if ("ddd" === format) {
          ii = indexOf.call(this._shortWeekdaysParse, llc);
          if (-1 !== ii) return ii;
          ii = indexOf.call(this._weekdaysParse, llc);
          if (-1 !== ii) return ii;
          ii = indexOf.call(this._minWeekdaysParse, llc);
          return -1 !== ii ? ii : null;
        }
        ii = indexOf.call(this._minWeekdaysParse, llc);
        if (-1 !== ii) return ii;
        ii = indexOf.call(this._weekdaysParse, llc);
        if (-1 !== ii) return ii;
        ii = indexOf.call(this._shortWeekdaysParse, llc);
        return -1 !== ii ? ii : null;
      }
      function localeWeekdaysParse(weekdayName, format, strict) {
        var i, mom, regex;
        if (this._weekdaysParseExact) return handleStrictParse$1.call(this, weekdayName, format, strict);
        if (!this._weekdaysParse) {
          this._weekdaysParse = [];
          this._minWeekdaysParse = [];
          this._shortWeekdaysParse = [];
          this._fullWeekdaysParse = [];
        }
        for (i = 0; i < 7; i++) {
          mom = createUTC([ 2e3, 1 ]).day(i);
          if (strict && !this._fullWeekdaysParse[i]) {
            this._fullWeekdaysParse[i] = new RegExp("^" + this.weekdays(mom, "").replace(".", "\\.?") + "$", "i");
            this._shortWeekdaysParse[i] = new RegExp("^" + this.weekdaysShort(mom, "").replace(".", "\\.?") + "$", "i");
            this._minWeekdaysParse[i] = new RegExp("^" + this.weekdaysMin(mom, "").replace(".", "\\.?") + "$", "i");
          }
          if (!this._weekdaysParse[i]) {
            regex = "^" + this.weekdays(mom, "") + "|^" + this.weekdaysShort(mom, "") + "|^" + this.weekdaysMin(mom, "");
            this._weekdaysParse[i] = new RegExp(regex.replace(".", ""), "i");
          }
          if (strict && "dddd" === format && this._fullWeekdaysParse[i].test(weekdayName)) return i;
          if (strict && "ddd" === format && this._shortWeekdaysParse[i].test(weekdayName)) return i;
          if (strict && "dd" === format && this._minWeekdaysParse[i].test(weekdayName)) return i;
          if (!strict && this._weekdaysParse[i].test(weekdayName)) return i;
        }
      }
      function getSetDayOfWeek(input) {
        if (!this.isValid()) return null != input ? this : NaN;
        var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        if (null != input) {
          input = parseWeekday(input, this.localeData());
          return this.add(input - day, "d");
        }
        return day;
      }
      function getSetLocaleDayOfWeek(input) {
        if (!this.isValid()) return null != input ? this : NaN;
        var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return null == input ? weekday : this.add(input - weekday, "d");
      }
      function getSetISODayOfWeek(input) {
        if (!this.isValid()) return null != input ? this : NaN;
        if (null != input) {
          var weekday = parseIsoWeekday(input, this.localeData());
          return this.day(this.day() % 7 ? weekday : weekday - 7);
        }
        return this.day() || 7;
      }
      function weekdaysRegex(isStrict) {
        if (this._weekdaysParseExact) {
          hasOwnProp(this, "_weekdaysRegex") || computeWeekdaysParse.call(this);
          return isStrict ? this._weekdaysStrictRegex : this._weekdaysRegex;
        }
        hasOwnProp(this, "_weekdaysRegex") || (this._weekdaysRegex = defaultWeekdaysRegex);
        return this._weekdaysStrictRegex && isStrict ? this._weekdaysStrictRegex : this._weekdaysRegex;
      }
      function weekdaysShortRegex(isStrict) {
        if (this._weekdaysParseExact) {
          hasOwnProp(this, "_weekdaysRegex") || computeWeekdaysParse.call(this);
          return isStrict ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
        }
        hasOwnProp(this, "_weekdaysShortRegex") || (this._weekdaysShortRegex = defaultWeekdaysShortRegex);
        return this._weekdaysShortStrictRegex && isStrict ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
      }
      function weekdaysMinRegex(isStrict) {
        if (this._weekdaysParseExact) {
          hasOwnProp(this, "_weekdaysRegex") || computeWeekdaysParse.call(this);
          return isStrict ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
        }
        hasOwnProp(this, "_weekdaysMinRegex") || (this._weekdaysMinRegex = defaultWeekdaysMinRegex);
        return this._weekdaysMinStrictRegex && isStrict ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
      }
      function computeWeekdaysParse() {
        function cmpLenRev(a, b) {
          return b.length - a.length;
        }
        var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [], i, mom, minp, shortp, longp;
        for (i = 0; i < 7; i++) {
          mom = createUTC([ 2e3, 1 ]).day(i);
          minp = regexEscape(this.weekdaysMin(mom, ""));
          shortp = regexEscape(this.weekdaysShort(mom, ""));
          longp = regexEscape(this.weekdays(mom, ""));
          minPieces.push(minp);
          shortPieces.push(shortp);
          longPieces.push(longp);
          mixedPieces.push(minp);
          mixedPieces.push(shortp);
          mixedPieces.push(longp);
        }
        minPieces.sort(cmpLenRev);
        shortPieces.sort(cmpLenRev);
        longPieces.sort(cmpLenRev);
        mixedPieces.sort(cmpLenRev);
        this._weekdaysRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;
        this._weekdaysStrictRegex = new RegExp("^(" + longPieces.join("|") + ")", "i");
        this._weekdaysShortStrictRegex = new RegExp("^(" + shortPieces.join("|") + ")", "i");
        this._weekdaysMinStrictRegex = new RegExp("^(" + minPieces.join("|") + ")", "i");
      }
      function hFormat() {
        return this.hours() % 12 || 12;
      }
      function kFormat() {
        return this.hours() || 24;
      }
      addFormatToken("H", [ "HH", 2 ], 0, "hour");
      addFormatToken("h", [ "hh", 2 ], 0, hFormat);
      addFormatToken("k", [ "kk", 2 ], 0, kFormat);
      addFormatToken("hmm", 0, 0, function() {
        return "" + hFormat.apply(this) + zeroFill(this.minutes(), 2);
      });
      addFormatToken("hmmss", 0, 0, function() {
        return "" + hFormat.apply(this) + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
      });
      addFormatToken("Hmm", 0, 0, function() {
        return "" + this.hours() + zeroFill(this.minutes(), 2);
      });
      addFormatToken("Hmmss", 0, 0, function() {
        return "" + this.hours() + zeroFill(this.minutes(), 2) + zeroFill(this.seconds(), 2);
      });
      function meridiem(token, lowercase) {
        addFormatToken(token, 0, 0, function() {
          return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
        });
      }
      meridiem("a", true);
      meridiem("A", false);
      addUnitAlias("hour", "h");
      addUnitPriority("hour", 13);
      function matchMeridiem(isStrict, locale) {
        return locale._meridiemParse;
      }
      addRegexToken("a", matchMeridiem);
      addRegexToken("A", matchMeridiem);
      addRegexToken("H", match1to2);
      addRegexToken("h", match1to2);
      addRegexToken("k", match1to2);
      addRegexToken("HH", match1to2, match2);
      addRegexToken("hh", match1to2, match2);
      addRegexToken("kk", match1to2, match2);
      addRegexToken("hmm", match3to4);
      addRegexToken("hmmss", match5to6);
      addRegexToken("Hmm", match3to4);
      addRegexToken("Hmmss", match5to6);
      addParseToken([ "H", "HH" ], HOUR);
      addParseToken([ "k", "kk" ], function(input, array, config) {
        var kInput = toInt(input);
        array[HOUR] = 24 === kInput ? 0 : kInput;
      });
      addParseToken([ "a", "A" ], function(input, array, config) {
        config._isPm = config._locale.isPM(input);
        config._meridiem = input;
      });
      addParseToken([ "h", "hh" ], function(input, array, config) {
        array[HOUR] = toInt(input);
        getParsingFlags(config).bigHour = true;
      });
      addParseToken("hmm", function(input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
        getParsingFlags(config).bigHour = true;
      });
      addParseToken("hmmss", function(input, array, config) {
        var pos1 = input.length - 4, pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
        getParsingFlags(config).bigHour = true;
      });
      addParseToken("Hmm", function(input, array, config) {
        var pos = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos));
        array[MINUTE] = toInt(input.substr(pos));
      });
      addParseToken("Hmmss", function(input, array, config) {
        var pos1 = input.length - 4, pos2 = input.length - 2;
        array[HOUR] = toInt(input.substr(0, pos1));
        array[MINUTE] = toInt(input.substr(pos1, 2));
        array[SECOND] = toInt(input.substr(pos2));
      });
      function localeIsPM(input) {
        return "p" === (input + "").toLowerCase().charAt(0);
      }
      var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i, getSetHour = makeGetSet("Hours", true);
      function localeMeridiem(hours, minutes, isLower) {
        return hours > 11 ? isLower ? "pm" : "PM" : isLower ? "am" : "AM";
      }
      var baseConfig = {
        calendar: defaultCalendar,
        longDateFormat: defaultLongDateFormat,
        invalidDate: defaultInvalidDate,
        ordinal: defaultOrdinal,
        dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
        relativeTime: defaultRelativeTime,
        months: defaultLocaleMonths,
        monthsShort: defaultLocaleMonthsShort,
        week: defaultLocaleWeek,
        weekdays: defaultLocaleWeekdays,
        weekdaysMin: defaultLocaleWeekdaysMin,
        weekdaysShort: defaultLocaleWeekdaysShort,
        meridiemParse: defaultLocaleMeridiemParse
      };
      var locales = {}, localeFamilies = {}, globalLocale;
      function commonPrefix(arr1, arr2) {
        var i, minl = Math.min(arr1.length, arr2.length);
        for (i = 0; i < minl; i += 1) if (arr1[i] !== arr2[i]) return i;
        return minl;
      }
      function normalizeLocale(key) {
        return key ? key.toLowerCase().replace("_", "-") : key;
      }
      function chooseLocale(names) {
        var i = 0, j, next, locale, split;
        while (i < names.length) {
          split = normalizeLocale(names[i]).split("-");
          j = split.length;
          next = normalizeLocale(names[i + 1]);
          next = next ? next.split("-") : null;
          while (j > 0) {
            locale = loadLocale(split.slice(0, j).join("-"));
            if (locale) return locale;
            if (next && next.length >= j && commonPrefix(split, next) >= j - 1) break;
            j--;
          }
          i++;
        }
        return globalLocale;
      }
      function loadLocale(name) {
        var oldLocale = null, aliasedRequire;
        if (void 0 === locales[name] && "undefined" !== typeof module && module && module.exports) try {
          oldLocale = globalLocale._abbr;
          aliasedRequire = require;
          aliasedRequire("./locale/" + name);
          getSetGlobalLocale(oldLocale);
        } catch (e) {
          locales[name] = null;
        }
        return locales[name];
      }
      function getSetGlobalLocale(key, values) {
        var data;
        if (key) {
          data = isUndefined(values) ? getLocale(key) : defineLocale(key, values);
          data ? globalLocale = data : "undefined" !== typeof console && console.warn && console.warn("Locale " + key + " not found. Did you forget to load it?");
        }
        return globalLocale._abbr;
      }
      function defineLocale(name, config) {
        if (null !== config) {
          var locale, parentConfig = baseConfig;
          config.abbr = name;
          if (null != locales[name]) {
            deprecateSimple("defineLocaleOverride", "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info.");
            parentConfig = locales[name]._config;
          } else if (null != config.parentLocale) if (null != locales[config.parentLocale]) parentConfig = locales[config.parentLocale]._config; else {
            locale = loadLocale(config.parentLocale);
            if (null == locale) {
              localeFamilies[config.parentLocale] || (localeFamilies[config.parentLocale] = []);
              localeFamilies[config.parentLocale].push({
                name: name,
                config: config
              });
              return null;
            }
            parentConfig = locale._config;
          }
          locales[name] = new Locale(mergeConfigs(parentConfig, config));
          localeFamilies[name] && localeFamilies[name].forEach(function(x) {
            defineLocale(x.name, x.config);
          });
          getSetGlobalLocale(name);
          return locales[name];
        }
        delete locales[name];
        return null;
      }
      function updateLocale(name, config) {
        if (null != config) {
          var locale, tmpLocale, parentConfig = baseConfig;
          if (null != locales[name] && null != locales[name].parentLocale) locales[name].set(mergeConfigs(locales[name]._config, config)); else {
            tmpLocale = loadLocale(name);
            null != tmpLocale && (parentConfig = tmpLocale._config);
            config = mergeConfigs(parentConfig, config);
            null == tmpLocale && (config.abbr = name);
            locale = new Locale(config);
            locale.parentLocale = locales[name];
            locales[name] = locale;
          }
          getSetGlobalLocale(name);
        } else if (null != locales[name]) if (null != locales[name].parentLocale) {
          locales[name] = locales[name].parentLocale;
          name === getSetGlobalLocale() && getSetGlobalLocale(name);
        } else null != locales[name] && delete locales[name];
        return locales[name];
      }
      function getLocale(key) {
        var locale;
        key && key._locale && key._locale._abbr && (key = key._locale._abbr);
        if (!key) return globalLocale;
        if (!isArray(key)) {
          locale = loadLocale(key);
          if (locale) return locale;
          key = [ key ];
        }
        return chooseLocale(key);
      }
      function listLocales() {
        return keys(locales);
      }
      function checkOverflow(m) {
        var overflow, a = m._a;
        if (a && -2 === getParsingFlags(m).overflow) {
          overflow = a[MONTH] < 0 || a[MONTH] > 11 ? MONTH : a[DATE] < 1 || a[DATE] > daysInMonth(a[YEAR], a[MONTH]) ? DATE : a[HOUR] < 0 || a[HOUR] > 24 || 24 === a[HOUR] && (0 !== a[MINUTE] || 0 !== a[SECOND] || 0 !== a[MILLISECOND]) ? HOUR : a[MINUTE] < 0 || a[MINUTE] > 59 ? MINUTE : a[SECOND] < 0 || a[SECOND] > 59 ? SECOND : a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND : -1;
          getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE) && (overflow = DATE);
          getParsingFlags(m)._overflowWeeks && -1 === overflow && (overflow = WEEK);
          getParsingFlags(m)._overflowWeekday && -1 === overflow && (overflow = WEEKDAY);
          getParsingFlags(m).overflow = overflow;
        }
        return m;
      }
      var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, tzRegex = /Z|[+-]\d\d(?::?\d\d)?/, isoDates = [ [ "YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/ ], [ "YYYY-MM-DD", /\d{4}-\d\d-\d\d/ ], [ "GGGG-[W]WW-E", /\d{4}-W\d\d-\d/ ], [ "GGGG-[W]WW", /\d{4}-W\d\d/, false ], [ "YYYY-DDD", /\d{4}-\d{3}/ ], [ "YYYY-MM", /\d{4}-\d\d/, false ], [ "YYYYYYMMDD", /[+-]\d{10}/ ], [ "YYYYMMDD", /\d{8}/ ], [ "GGGG[W]WWE", /\d{4}W\d{3}/ ], [ "GGGG[W]WW", /\d{4}W\d{2}/, false ], [ "YYYYDDD", /\d{7}/ ], [ "YYYYMM", /\d{6}/, false ], [ "YYYY", /\d{4}/, false ] ], isoTimes = [ [ "HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/ ], [ "HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/ ], [ "HH:mm:ss", /\d\d:\d\d:\d\d/ ], [ "HH:mm", /\d\d:\d\d/ ], [ "HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/ ], [ "HHmmss,SSSS", /\d\d\d\d\d\d,\d+/ ], [ "HHmmss", /\d\d\d\d\d\d/ ], [ "HHmm", /\d\d\d\d/ ], [ "HH", /\d\d/ ] ], aspNetJsonRegex = /^\/?Date\((-?\d+)/i, rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/, obsOffsets = {
        UT: 0,
        GMT: 0,
        EDT: -240,
        EST: -300,
        CDT: -300,
        CST: -360,
        MDT: -360,
        MST: -420,
        PDT: -420,
        PST: -480
      };
      function configFromISO(config) {
        var i, l, string = config._i, match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string), allowTime, dateFormat, timeFormat, tzFormat;
        if (match) {
          getParsingFlags(config).iso = true;
          for (i = 0, l = isoDates.length; i < l; i++) if (isoDates[i][1].exec(match[1])) {
            dateFormat = isoDates[i][0];
            allowTime = false !== isoDates[i][2];
            break;
          }
          if (null == dateFormat) {
            config._isValid = false;
            return;
          }
          if (match[3]) {
            for (i = 0, l = isoTimes.length; i < l; i++) if (isoTimes[i][1].exec(match[3])) {
              timeFormat = (match[2] || " ") + isoTimes[i][0];
              break;
            }
            if (null == timeFormat) {
              config._isValid = false;
              return;
            }
          }
          if (!allowTime && null != timeFormat) {
            config._isValid = false;
            return;
          }
          if (match[4]) {
            if (!tzRegex.exec(match[4])) {
              config._isValid = false;
              return;
            }
            tzFormat = "Z";
          }
          config._f = dateFormat + (timeFormat || "") + (tzFormat || "");
          configFromStringAndFormat(config);
        } else config._isValid = false;
      }
      function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
        var result = [ untruncateYear(yearStr), defaultLocaleMonthsShort.indexOf(monthStr), parseInt(dayStr, 10), parseInt(hourStr, 10), parseInt(minuteStr, 10) ];
        secondStr && result.push(parseInt(secondStr, 10));
        return result;
      }
      function untruncateYear(yearStr) {
        var year = parseInt(yearStr, 10);
        if (year <= 49) return 2e3 + year;
        if (year <= 999) return 1900 + year;
        return year;
      }
      function preprocessRFC2822(s) {
        return s.replace(/\([^)]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "");
      }
      function checkWeekday(weekdayStr, parsedInput, config) {
        if (weekdayStr) {
          var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr), weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();
          if (weekdayProvided !== weekdayActual) {
            getParsingFlags(config).weekdayMismatch = true;
            config._isValid = false;
            return false;
          }
        }
        return true;
      }
      function calculateOffset(obsOffset, militaryOffset, numOffset) {
        if (obsOffset) return obsOffsets[obsOffset];
        if (militaryOffset) return 0;
        var hm = parseInt(numOffset, 10), m = hm % 100, h = (hm - m) / 100;
        return 60 * h + m;
      }
      function configFromRFC2822(config) {
        var match = rfc2822.exec(preprocessRFC2822(config._i)), parsedArray;
        if (match) {
          parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);
          if (!checkWeekday(match[1], parsedArray, config)) return;
          config._a = parsedArray;
          config._tzm = calculateOffset(match[8], match[9], match[10]);
          config._d = createUTCDate.apply(null, config._a);
          config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
          getParsingFlags(config).rfc2822 = true;
        } else config._isValid = false;
      }
      function configFromString(config) {
        var matched = aspNetJsonRegex.exec(config._i);
        if (null !== matched) {
          config._d = new Date(+matched[1]);
          return;
        }
        configFromISO(config);
        if (false !== config._isValid) return;
        delete config._isValid;
        configFromRFC2822(config);
        if (false !== config._isValid) return;
        delete config._isValid;
        config._strict ? config._isValid = false : hooks.createFromInputFallback(config);
      }
      hooks.createFromInputFallback = deprecate("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.", function(config) {
        config._d = new Date(config._i + (config._useUTC ? " UTC" : ""));
      });
      function defaults(a, b, c) {
        if (null != a) return a;
        if (null != b) return b;
        return c;
      }
      function currentDateArray(config) {
        var nowValue = new Date(hooks.now());
        if (config._useUTC) return [ nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate() ];
        return [ nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate() ];
      }
      function configFromArray(config) {
        var i, date, input = [], currentDate, expectedWeekday, yearToUse;
        if (config._d) return;
        currentDate = currentDateArray(config);
        config._w && null == config._a[DATE] && null == config._a[MONTH] && dayOfYearFromWeekInfo(config);
        if (null != config._dayOfYear) {
          yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);
          (config._dayOfYear > daysInYear(yearToUse) || 0 === config._dayOfYear) && (getParsingFlags(config)._overflowDayOfYear = true);
          date = createUTCDate(yearToUse, 0, config._dayOfYear);
          config._a[MONTH] = date.getUTCMonth();
          config._a[DATE] = date.getUTCDate();
        }
        for (i = 0; i < 3 && null == config._a[i]; ++i) config._a[i] = input[i] = currentDate[i];
        for (;i < 7; i++) config._a[i] = input[i] = null == config._a[i] ? 2 === i ? 1 : 0 : config._a[i];
        if (24 === config._a[HOUR] && 0 === config._a[MINUTE] && 0 === config._a[SECOND] && 0 === config._a[MILLISECOND]) {
          config._nextDay = true;
          config._a[HOUR] = 0;
        }
        config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
        expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();
        null != config._tzm && config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
        config._nextDay && (config._a[HOUR] = 24);
        config._w && "undefined" !== typeof config._w.d && config._w.d !== expectedWeekday && (getParsingFlags(config).weekdayMismatch = true);
      }
      function dayOfYearFromWeekInfo(config) {
        var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow, curWeek;
        w = config._w;
        if (null != w.GG || null != w.W || null != w.E) {
          dow = 1;
          doy = 4;
          weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
          week = defaults(w.W, 1);
          weekday = defaults(w.E, 1);
          (weekday < 1 || weekday > 7) && (weekdayOverflow = true);
        } else {
          dow = config._locale._week.dow;
          doy = config._locale._week.doy;
          curWeek = weekOfYear(createLocal(), dow, doy);
          weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);
          week = defaults(w.w, curWeek.week);
          if (null != w.d) {
            weekday = w.d;
            (weekday < 0 || weekday > 6) && (weekdayOverflow = true);
          } else if (null != w.e) {
            weekday = w.e + dow;
            (w.e < 0 || w.e > 6) && (weekdayOverflow = true);
          } else weekday = dow;
        }
        if (week < 1 || week > weeksInYear(weekYear, dow, doy)) getParsingFlags(config)._overflowWeeks = true; else if (null != weekdayOverflow) getParsingFlags(config)._overflowWeekday = true; else {
          temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
          config._a[YEAR] = temp.year;
          config._dayOfYear = temp.dayOfYear;
        }
      }
      hooks.ISO_8601 = function() {};
      hooks.RFC_2822 = function() {};
      function configFromStringAndFormat(config) {
        if (config._f === hooks.ISO_8601) {
          configFromISO(config);
          return;
        }
        if (config._f === hooks.RFC_2822) {
          configFromRFC2822(config);
          return;
        }
        config._a = [];
        getParsingFlags(config).empty = true;
        var string = "" + config._i, i, parsedInput, tokens, token, skipped, stringLength = string.length, totalParsedInputLength = 0, era;
        tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];
        for (i = 0; i < tokens.length; i++) {
          token = tokens[i];
          parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
          if (parsedInput) {
            skipped = string.substr(0, string.indexOf(parsedInput));
            skipped.length > 0 && getParsingFlags(config).unusedInput.push(skipped);
            string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
            totalParsedInputLength += parsedInput.length;
          }
          if (formatTokenFunctions[token]) {
            parsedInput ? getParsingFlags(config).empty = false : getParsingFlags(config).unusedTokens.push(token);
            addTimeToArrayFromToken(token, parsedInput, config);
          } else config._strict && !parsedInput && getParsingFlags(config).unusedTokens.push(token);
        }
        getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
        string.length > 0 && getParsingFlags(config).unusedInput.push(string);
        config._a[HOUR] <= 12 && true === getParsingFlags(config).bigHour && config._a[HOUR] > 0 && (getParsingFlags(config).bigHour = void 0);
        getParsingFlags(config).parsedDateParts = config._a.slice(0);
        getParsingFlags(config).meridiem = config._meridiem;
        config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);
        era = getParsingFlags(config).era;
        null !== era && (config._a[YEAR] = config._locale.erasConvertYear(era, config._a[YEAR]));
        configFromArray(config);
        checkOverflow(config);
      }
      function meridiemFixWrap(locale, hour, meridiem) {
        var isPm;
        if (null == meridiem) return hour;
        if (null != locale.meridiemHour) return locale.meridiemHour(hour, meridiem);
        if (null != locale.isPM) {
          isPm = locale.isPM(meridiem);
          isPm && hour < 12 && (hour += 12);
          isPm || 12 !== hour || (hour = 0);
          return hour;
        }
        return hour;
      }
      function configFromStringAndArray(config) {
        var tempConfig, bestMoment, scoreToBeat, i, currentScore, validFormatFound, bestFormatIsValid = false;
        if (0 === config._f.length) {
          getParsingFlags(config).invalidFormat = true;
          config._d = new Date(NaN);
          return;
        }
        for (i = 0; i < config._f.length; i++) {
          currentScore = 0;
          validFormatFound = false;
          tempConfig = copyConfig({}, config);
          null != config._useUTC && (tempConfig._useUTC = config._useUTC);
          tempConfig._f = config._f[i];
          configFromStringAndFormat(tempConfig);
          isValid(tempConfig) && (validFormatFound = true);
          currentScore += getParsingFlags(tempConfig).charsLeftOver;
          currentScore += 10 * getParsingFlags(tempConfig).unusedTokens.length;
          getParsingFlags(tempConfig).score = currentScore;
          if (bestFormatIsValid) {
            if (currentScore < scoreToBeat) {
              scoreToBeat = currentScore;
              bestMoment = tempConfig;
            }
          } else if (null == scoreToBeat || currentScore < scoreToBeat || validFormatFound) {
            scoreToBeat = currentScore;
            bestMoment = tempConfig;
            validFormatFound && (bestFormatIsValid = true);
          }
        }
        extend(config, bestMoment || tempConfig);
      }
      function configFromObject(config) {
        if (config._d) return;
        var i = normalizeObjectUnits(config._i), dayOrDate = void 0 === i.day ? i.date : i.day;
        config._a = map([ i.year, i.month, dayOrDate, i.hour, i.minute, i.second, i.millisecond ], function(obj) {
          return obj && parseInt(obj, 10);
        });
        configFromArray(config);
      }
      function createFromConfig(config) {
        var res = new Moment(checkOverflow(prepareConfig(config)));
        if (res._nextDay) {
          res.add(1, "d");
          res._nextDay = void 0;
        }
        return res;
      }
      function prepareConfig(config) {
        var input = config._i, format = config._f;
        config._locale = config._locale || getLocale(config._l);
        if (null === input || void 0 === format && "" === input) return createInvalid({
          nullInput: true
        });
        "string" === typeof input && (config._i = input = config._locale.preparse(input));
        if (isMoment(input)) return new Moment(checkOverflow(input));
        isDate(input) ? config._d = input : isArray(format) ? configFromStringAndArray(config) : format ? configFromStringAndFormat(config) : configFromInput(config);
        isValid(config) || (config._d = null);
        return config;
      }
      function configFromInput(config) {
        var input = config._i;
        if (isUndefined(input)) config._d = new Date(hooks.now()); else if (isDate(input)) config._d = new Date(input.valueOf()); else if ("string" === typeof input) configFromString(config); else if (isArray(input)) {
          config._a = map(input.slice(0), function(obj) {
            return parseInt(obj, 10);
          });
          configFromArray(config);
        } else isObject(input) ? configFromObject(config) : isNumber(input) ? config._d = new Date(input) : hooks.createFromInputFallback(config);
      }
      function createLocalOrUTC(input, format, locale, strict, isUTC) {
        var c = {};
        if (true === format || false === format) {
          strict = format;
          format = void 0;
        }
        if (true === locale || false === locale) {
          strict = locale;
          locale = void 0;
        }
        (isObject(input) && isObjectEmpty(input) || isArray(input) && 0 === input.length) && (input = void 0);
        c._isAMomentObject = true;
        c._useUTC = c._isUTC = isUTC;
        c._l = locale;
        c._i = input;
        c._f = format;
        c._strict = strict;
        return createFromConfig(c);
      }
      function createLocal(input, format, locale, strict) {
        return createLocalOrUTC(input, format, locale, strict, false);
      }
      var prototypeMin = deprecate("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
        var other = createLocal.apply(null, arguments);
        return this.isValid() && other.isValid() ? other < this ? this : other : createInvalid();
      }), prototypeMax = deprecate("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
        var other = createLocal.apply(null, arguments);
        return this.isValid() && other.isValid() ? other > this ? this : other : createInvalid();
      });
      function pickBy(fn, moments) {
        var res, i;
        1 === moments.length && isArray(moments[0]) && (moments = moments[0]);
        if (!moments.length) return createLocal();
        res = moments[0];
        for (i = 1; i < moments.length; ++i) moments[i].isValid() && !moments[i][fn](res) || (res = moments[i]);
        return res;
      }
      function min() {
        var args = [].slice.call(arguments, 0);
        return pickBy("isBefore", args);
      }
      function max() {
        var args = [].slice.call(arguments, 0);
        return pickBy("isAfter", args);
      }
      var now = function() {
        return Date.now ? Date.now() : +new Date();
      };
      var ordering = [ "year", "quarter", "month", "week", "day", "hour", "minute", "second", "millisecond" ];
      function isDurationValid(m) {
        var key, unitHasDecimal = false, i;
        for (key in m) if (hasOwnProp(m, key) && !(-1 !== indexOf.call(ordering, key) && (null == m[key] || !isNaN(m[key])))) return false;
        for (i = 0; i < ordering.length; ++i) if (m[ordering[i]]) {
          if (unitHasDecimal) return false;
          parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]]) && (unitHasDecimal = true);
        }
        return true;
      }
      function isValid$1() {
        return this._isValid;
      }
      function createInvalid$1() {
        return createDuration(NaN);
      }
      function Duration(duration) {
        var normalizedInput = normalizeObjectUnits(duration), years = normalizedInput.year || 0, quarters = normalizedInput.quarter || 0, months = normalizedInput.month || 0, weeks = normalizedInput.week || normalizedInput.isoWeek || 0, days = normalizedInput.day || 0, hours = normalizedInput.hour || 0, minutes = normalizedInput.minute || 0, seconds = normalizedInput.second || 0, milliseconds = normalizedInput.millisecond || 0;
        this._isValid = isDurationValid(normalizedInput);
        this._milliseconds = +milliseconds + 1e3 * seconds + 6e4 * minutes + 1e3 * hours * 60 * 60;
        this._days = +days + 7 * weeks;
        this._months = +months + 3 * quarters + 12 * years;
        this._data = {};
        this._locale = getLocale();
        this._bubble();
      }
      function isDuration(obj) {
        return obj instanceof Duration;
      }
      function absRound(number) {
        return number < 0 ? -1 * Math.round(-1 * number) : Math.round(number);
      }
      function compareArrays(array1, array2, dontConvert) {
        var len = Math.min(array1.length, array2.length), lengthDiff = Math.abs(array1.length - array2.length), diffs = 0, i;
        for (i = 0; i < len; i++) (dontConvert && array1[i] !== array2[i] || !dontConvert && toInt(array1[i]) !== toInt(array2[i])) && diffs++;
        return diffs + lengthDiff;
      }
      function offset(token, separator) {
        addFormatToken(token, 0, 0, function() {
          var offset = this.utcOffset(), sign = "+";
          if (offset < 0) {
            offset = -offset;
            sign = "-";
          }
          return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~offset % 60, 2);
        });
      }
      offset("Z", ":");
      offset("ZZ", "");
      addRegexToken("Z", matchShortOffset);
      addRegexToken("ZZ", matchShortOffset);
      addParseToken([ "Z", "ZZ" ], function(input, array, config) {
        config._useUTC = true;
        config._tzm = offsetFromString(matchShortOffset, input);
      });
      var chunkOffset = /([\+\-]|\d\d)/gi;
      function offsetFromString(matcher, string) {
        var matches = (string || "").match(matcher), chunk, parts, minutes;
        if (null === matches) return null;
        chunk = matches[matches.length - 1] || [];
        parts = (chunk + "").match(chunkOffset) || [ "-", 0, 0 ];
        minutes = 60 * parts[1] + toInt(parts[2]);
        return 0 === minutes ? 0 : "+" === parts[0] ? minutes : -minutes;
      }
      function cloneWithOffset(input, model) {
        var res, diff;
        if (model._isUTC) {
          res = model.clone();
          diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
          res._d.setTime(res._d.valueOf() + diff);
          hooks.updateOffset(res, false);
          return res;
        }
        return createLocal(input).local();
      }
      function getDateOffset(m) {
        return -Math.round(m._d.getTimezoneOffset());
      }
      hooks.updateOffset = function() {};
      function getSetOffset(input, keepLocalTime, keepMinutes) {
        var offset = this._offset || 0, localAdjust;
        if (!this.isValid()) return null != input ? this : NaN;
        if (null != input) {
          if ("string" === typeof input) {
            input = offsetFromString(matchShortOffset, input);
            if (null === input) return this;
          } else Math.abs(input) < 16 && !keepMinutes && (input *= 60);
          !this._isUTC && keepLocalTime && (localAdjust = getDateOffset(this));
          this._offset = input;
          this._isUTC = true;
          null != localAdjust && this.add(localAdjust, "m");
          if (offset !== input) if (!keepLocalTime || this._changeInProgress) addSubtract(this, createDuration(input - offset, "m"), 1, false); else if (!this._changeInProgress) {
            this._changeInProgress = true;
            hooks.updateOffset(this, true);
            this._changeInProgress = null;
          }
          return this;
        }
        return this._isUTC ? offset : getDateOffset(this);
      }
      function getSetZone(input, keepLocalTime) {
        if (null != input) {
          "string" !== typeof input && (input = -input);
          this.utcOffset(input, keepLocalTime);
          return this;
        }
        return -this.utcOffset();
      }
      function setOffsetToUTC(keepLocalTime) {
        return this.utcOffset(0, keepLocalTime);
      }
      function setOffsetToLocal(keepLocalTime) {
        if (this._isUTC) {
          this.utcOffset(0, keepLocalTime);
          this._isUTC = false;
          keepLocalTime && this.subtract(getDateOffset(this), "m");
        }
        return this;
      }
      function setOffsetToParsedOffset() {
        if (null != this._tzm) this.utcOffset(this._tzm, false, true); else if ("string" === typeof this._i) {
          var tZone = offsetFromString(matchOffset, this._i);
          null != tZone ? this.utcOffset(tZone) : this.utcOffset(0, true);
        }
        return this;
      }
      function hasAlignedHourOffset(input) {
        if (!this.isValid()) return false;
        input = input ? createLocal(input).utcOffset() : 0;
        return (this.utcOffset() - input) % 60 === 0;
      }
      function isDaylightSavingTime() {
        return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
      }
      function isDaylightSavingTimeShifted() {
        if (!isUndefined(this._isDSTShifted)) return this._isDSTShifted;
        var c = {}, other;
        copyConfig(c, this);
        c = prepareConfig(c);
        if (c._a) {
          other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
          this._isDSTShifted = this.isValid() && compareArrays(c._a, other.toArray()) > 0;
        } else this._isDSTShifted = false;
        return this._isDSTShifted;
      }
      function isLocal() {
        return !!this.isValid() && !this._isUTC;
      }
      function isUtcOffset() {
        return !!this.isValid() && this._isUTC;
      }
      function isUtc() {
        return !!this.isValid() && (this._isUTC && 0 === this._offset);
      }
      var aspNetRegex = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/, isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
      function createDuration(input, key) {
        var duration = input, match = null, sign, ret, diffRes;
        if (isDuration(input)) duration = {
          ms: input._milliseconds,
          d: input._days,
          M: input._months
        }; else if (isNumber(input) || !isNaN(+input)) {
          duration = {};
          key ? duration[key] = +input : duration.milliseconds = +input;
        } else if (match = aspNetRegex.exec(input)) {
          sign = "-" === match[1] ? -1 : 1;
          duration = {
            y: 0,
            d: toInt(match[DATE]) * sign,
            h: toInt(match[HOUR]) * sign,
            m: toInt(match[MINUTE]) * sign,
            s: toInt(match[SECOND]) * sign,
            ms: toInt(absRound(1e3 * match[MILLISECOND])) * sign
          };
        } else if (match = isoRegex.exec(input)) {
          sign = "-" === match[1] ? -1 : 1;
          duration = {
            y: parseIso(match[2], sign),
            M: parseIso(match[3], sign),
            w: parseIso(match[4], sign),
            d: parseIso(match[5], sign),
            h: parseIso(match[6], sign),
            m: parseIso(match[7], sign),
            s: parseIso(match[8], sign)
          };
        } else if (null == duration) duration = {}; else if ("object" === typeof duration && ("from" in duration || "to" in duration)) {
          diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));
          duration = {};
          duration.ms = diffRes.milliseconds;
          duration.M = diffRes.months;
        }
        ret = new Duration(duration);
        isDuration(input) && hasOwnProp(input, "_locale") && (ret._locale = input._locale);
        isDuration(input) && hasOwnProp(input, "_isValid") && (ret._isValid = input._isValid);
        return ret;
      }
      createDuration.fn = Duration.prototype;
      createDuration.invalid = createInvalid$1;
      function parseIso(inp, sign) {
        var res = inp && parseFloat(inp.replace(",", "."));
        return (isNaN(res) ? 0 : res) * sign;
      }
      function positiveMomentsDifference(base, other) {
        var res = {};
        res.months = other.month() - base.month() + 12 * (other.year() - base.year());
        base.clone().add(res.months, "M").isAfter(other) && --res.months;
        res.milliseconds = +other - +base.clone().add(res.months, "M");
        return res;
      }
      function momentsDifference(base, other) {
        var res;
        if (!(base.isValid() && other.isValid())) return {
          milliseconds: 0,
          months: 0
        };
        other = cloneWithOffset(other, base);
        if (base.isBefore(other)) res = positiveMomentsDifference(base, other); else {
          res = positiveMomentsDifference(other, base);
          res.milliseconds = -res.milliseconds;
          res.months = -res.months;
        }
        return res;
      }
      function createAdder(direction, name) {
        return function(val, period) {
          var dur, tmp;
          if (null !== period && !isNaN(+period)) {
            deprecateSimple(name, "moment()." + name + "(period, number) is deprecated. Please use moment()." + name + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.");
            tmp = val;
            val = period;
            period = tmp;
          }
          dur = createDuration(val, period);
          addSubtract(this, dur, direction);
          return this;
        };
      }
      function addSubtract(mom, duration, isAdding, updateOffset) {
        var milliseconds = duration._milliseconds, days = absRound(duration._days), months = absRound(duration._months);
        if (!mom.isValid()) return;
        updateOffset = null == updateOffset || updateOffset;
        months && setMonth(mom, get(mom, "Month") + months * isAdding);
        days && set$1(mom, "Date", get(mom, "Date") + days * isAdding);
        milliseconds && mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
        updateOffset && hooks.updateOffset(mom, days || months);
      }
      var add = createAdder(1, "add"), subtract = createAdder(-1, "subtract");
      function isString(input) {
        return "string" === typeof input || input instanceof String;
      }
      function isMomentInput(input) {
        return isMoment(input) || isDate(input) || isString(input) || isNumber(input) || isNumberOrStringArray(input) || isMomentInputObject(input) || null === input || void 0 === input;
      }
      function isMomentInputObject(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input), propertyTest = false, properties = [ "years", "year", "y", "months", "month", "M", "days", "day", "d", "dates", "date", "D", "hours", "hour", "h", "minutes", "minute", "m", "seconds", "second", "s", "milliseconds", "millisecond", "ms" ], i, property;
        for (i = 0; i < properties.length; i += 1) {
          property = properties[i];
          propertyTest = propertyTest || hasOwnProp(input, property);
        }
        return objectTest && propertyTest;
      }
      function isNumberOrStringArray(input) {
        var arrayTest = isArray(input), dataTypeTest = false;
        arrayTest && (dataTypeTest = 0 === input.filter(function(item) {
          return !isNumber(item) && isString(input);
        }).length);
        return arrayTest && dataTypeTest;
      }
      function isCalendarSpec(input) {
        var objectTest = isObject(input) && !isObjectEmpty(input), propertyTest = false, properties = [ "sameDay", "nextDay", "lastDay", "nextWeek", "lastWeek", "sameElse" ], i, property;
        for (i = 0; i < properties.length; i += 1) {
          property = properties[i];
          propertyTest = propertyTest || hasOwnProp(input, property);
        }
        return objectTest && propertyTest;
      }
      function getCalendarFormat(myMoment, now) {
        var diff = myMoment.diff(now, "days", true);
        return diff < -6 ? "sameElse" : diff < -1 ? "lastWeek" : diff < 0 ? "lastDay" : diff < 1 ? "sameDay" : diff < 2 ? "nextDay" : diff < 7 ? "nextWeek" : "sameElse";
      }
      function calendar$1(time, formats) {
        if (1 === arguments.length) if (isMomentInput(arguments[0])) {
          time = arguments[0];
          formats = void 0;
        } else if (isCalendarSpec(arguments[0])) {
          formats = arguments[0];
          time = void 0;
        }
        var now = time || createLocal(), sod = cloneWithOffset(now, this).startOf("day"), format = hooks.calendarFormat(this, sod) || "sameElse", output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);
        return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
      }
      function clone() {
        return new Moment(this);
      }
      function isAfter(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) return false;
        units = normalizeUnits(units) || "millisecond";
        return "millisecond" === units ? this.valueOf() > localInput.valueOf() : localInput.valueOf() < this.clone().startOf(units).valueOf();
      }
      function isBefore(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input);
        if (!(this.isValid() && localInput.isValid())) return false;
        units = normalizeUnits(units) || "millisecond";
        return "millisecond" === units ? this.valueOf() < localInput.valueOf() : this.clone().endOf(units).valueOf() < localInput.valueOf();
      }
      function isBetween(from, to, units, inclusivity) {
        var localFrom = isMoment(from) ? from : createLocal(from), localTo = isMoment(to) ? to : createLocal(to);
        if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) return false;
        inclusivity = inclusivity || "()";
        return ("(" === inclusivity[0] ? this.isAfter(localFrom, units) : !this.isBefore(localFrom, units)) && (")" === inclusivity[1] ? this.isBefore(localTo, units) : !this.isAfter(localTo, units));
      }
      function isSame(input, units) {
        var localInput = isMoment(input) ? input : createLocal(input), inputMs;
        if (!(this.isValid() && localInput.isValid())) return false;
        units = normalizeUnits(units) || "millisecond";
        if ("millisecond" === units) return this.valueOf() === localInput.valueOf();
        inputMs = localInput.valueOf();
        return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
      }
      function isSameOrAfter(input, units) {
        return this.isSame(input, units) || this.isAfter(input, units);
      }
      function isSameOrBefore(input, units) {
        return this.isSame(input, units) || this.isBefore(input, units);
      }
      function diff(input, units, asFloat) {
        var that, zoneDelta, output;
        if (!this.isValid()) return NaN;
        that = cloneWithOffset(input, this);
        if (!that.isValid()) return NaN;
        zoneDelta = 6e4 * (that.utcOffset() - this.utcOffset());
        units = normalizeUnits(units);
        switch (units) {
         case "year":
          output = monthDiff(this, that) / 12;
          break;

         case "month":
          output = monthDiff(this, that);
          break;

         case "quarter":
          output = monthDiff(this, that) / 3;
          break;

         case "second":
          output = (this - that) / 1e3;
          break;

         case "minute":
          output = (this - that) / 6e4;
          break;

         case "hour":
          output = (this - that) / 36e5;
          break;

         case "day":
          output = (this - that - zoneDelta) / 864e5;
          break;

         case "week":
          output = (this - that - zoneDelta) / 6048e5;
          break;

         default:
          output = this - that;
        }
        return asFloat ? output : absFloor(output);
      }
      function monthDiff(a, b) {
        if (a.date() < b.date()) return -monthDiff(b, a);
        var wholeMonthDiff = 12 * (b.year() - a.year()) + (b.month() - a.month()), anchor = a.clone().add(wholeMonthDiff, "months"), anchor2, adjust;
        if (b - anchor < 0) {
          anchor2 = a.clone().add(wholeMonthDiff - 1, "months");
          adjust = (b - anchor) / (anchor - anchor2);
        } else {
          anchor2 = a.clone().add(wholeMonthDiff + 1, "months");
          adjust = (b - anchor) / (anchor2 - anchor);
        }
        return -(wholeMonthDiff + adjust) || 0;
      }
      hooks.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
      hooks.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
      function toString() {
        return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
      }
      function toISOString(keepOffset) {
        if (!this.isValid()) return null;
        var utc = true !== keepOffset, m = utc ? this.clone().utc() : this;
        if (m.year() < 0 || m.year() > 9999) return formatMoment(m, utc ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ");
        if (isFunction(Date.prototype.toISOString)) return utc ? this.toDate().toISOString() : new Date(this.valueOf() + 60 * this.utcOffset() * 1e3).toISOString().replace("Z", formatMoment(m, "Z"));
        return formatMoment(m, utc ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ");
      }
      function inspect() {
        if (!this.isValid()) return "moment.invalid(/* " + this._i + " */)";
        var func = "moment", zone = "", prefix, year, datetime, suffix;
        if (!this.isLocal()) {
          func = 0 === this.utcOffset() ? "moment.utc" : "moment.parseZone";
          zone = "Z";
        }
        prefix = "[" + func + '("]';
        year = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY";
        datetime = "-MM-DD[T]HH:mm:ss.SSS";
        suffix = zone + '[")]';
        return this.format(prefix + year + datetime + suffix);
      }
      function format(inputString) {
        inputString || (inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat);
        var output = formatMoment(this, inputString);
        return this.localeData().postformat(output);
      }
      function from(time, withoutSuffix) {
        return this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid()) ? createDuration({
          to: this,
          from: time
        }).locale(this.locale()).humanize(!withoutSuffix) : this.localeData().invalidDate();
      }
      function fromNow(withoutSuffix) {
        return this.from(createLocal(), withoutSuffix);
      }
      function to(time, withoutSuffix) {
        return this.isValid() && (isMoment(time) && time.isValid() || createLocal(time).isValid()) ? createDuration({
          from: this,
          to: time
        }).locale(this.locale()).humanize(!withoutSuffix) : this.localeData().invalidDate();
      }
      function toNow(withoutSuffix) {
        return this.to(createLocal(), withoutSuffix);
      }
      function locale(key) {
        var newLocaleData;
        if (void 0 === key) return this._locale._abbr;
        newLocaleData = getLocale(key);
        null != newLocaleData && (this._locale = newLocaleData);
        return this;
      }
      var lang = deprecate("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function(key) {
        return void 0 === key ? this.localeData() : this.locale(key);
      });
      function localeData() {
        return this._locale;
      }
      var MS_PER_SECOND = 1e3, MS_PER_MINUTE = 60 * MS_PER_SECOND, MS_PER_HOUR = 60 * MS_PER_MINUTE, MS_PER_400_YEARS = 3506328 * MS_PER_HOUR;
      function mod$1(dividend, divisor) {
        return (dividend % divisor + divisor) % divisor;
      }
      function localStartOfDate(y, m, d) {
        return y < 100 && y >= 0 ? new Date(y + 400, m, d) - MS_PER_400_YEARS : new Date(y, m, d).valueOf();
      }
      function utcStartOfDate(y, m, d) {
        return y < 100 && y >= 0 ? Date.UTC(y + 400, m, d) - MS_PER_400_YEARS : Date.UTC(y, m, d);
      }
      function startOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (void 0 === units || "millisecond" === units || !this.isValid()) return this;
        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;
        switch (units) {
         case "year":
          time = startOfDate(this.year(), 0, 1);
          break;

         case "quarter":
          time = startOfDate(this.year(), this.month() - this.month() % 3, 1);
          break;

         case "month":
          time = startOfDate(this.year(), this.month(), 1);
          break;

         case "week":
          time = startOfDate(this.year(), this.month(), this.date() - this.weekday());
          break;

         case "isoWeek":
          time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
          break;

         case "day":
         case "date":
          time = startOfDate(this.year(), this.month(), this.date());
          break;

         case "hour":
          time = this._d.valueOf();
          time -= mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR);
          break;

         case "minute":
          time = this._d.valueOf();
          time -= mod$1(time, MS_PER_MINUTE);
          break;

         case "second":
          time = this._d.valueOf();
          time -= mod$1(time, MS_PER_SECOND);
        }
        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
      }
      function endOf(units) {
        var time, startOfDate;
        units = normalizeUnits(units);
        if (void 0 === units || "millisecond" === units || !this.isValid()) return this;
        startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;
        switch (units) {
         case "year":
          time = startOfDate(this.year() + 1, 0, 1) - 1;
          break;

         case "quarter":
          time = startOfDate(this.year(), this.month() - this.month() % 3 + 3, 1) - 1;
          break;

         case "month":
          time = startOfDate(this.year(), this.month() + 1, 1) - 1;
          break;

         case "week":
          time = startOfDate(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
          break;

         case "isoWeek":
          time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
          break;

         case "day":
         case "date":
          time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
          break;

         case "hour":
          time = this._d.valueOf();
          time += MS_PER_HOUR - mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR) - 1;
          break;

         case "minute":
          time = this._d.valueOf();
          time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
          break;

         case "second":
          time = this._d.valueOf();
          time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
        }
        this._d.setTime(time);
        hooks.updateOffset(this, true);
        return this;
      }
      function valueOf() {
        return this._d.valueOf() - 6e4 * (this._offset || 0);
      }
      function unix() {
        return Math.floor(this.valueOf() / 1e3);
      }
      function toDate() {
        return new Date(this.valueOf());
      }
      function toArray() {
        var m = this;
        return [ m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond() ];
      }
      function toObject() {
        var m = this;
        return {
          years: m.year(),
          months: m.month(),
          date: m.date(),
          hours: m.hours(),
          minutes: m.minutes(),
          seconds: m.seconds(),
          milliseconds: m.milliseconds()
        };
      }
      function toJSON() {
        return this.isValid() ? this.toISOString() : null;
      }
      function isValid$2() {
        return isValid(this);
      }
      function parsingFlags() {
        return extend({}, getParsingFlags(this));
      }
      function invalidAt() {
        return getParsingFlags(this).overflow;
      }
      function creationData() {
        return {
          input: this._i,
          format: this._f,
          locale: this._locale,
          isUTC: this._isUTC,
          strict: this._strict
        };
      }
      addFormatToken("N", 0, 0, "eraAbbr");
      addFormatToken("NN", 0, 0, "eraAbbr");
      addFormatToken("NNN", 0, 0, "eraAbbr");
      addFormatToken("NNNN", 0, 0, "eraName");
      addFormatToken("NNNNN", 0, 0, "eraNarrow");
      addFormatToken("y", [ "y", 1 ], "yo", "eraYear");
      addFormatToken("y", [ "yy", 2 ], 0, "eraYear");
      addFormatToken("y", [ "yyy", 3 ], 0, "eraYear");
      addFormatToken("y", [ "yyyy", 4 ], 0, "eraYear");
      addRegexToken("N", matchEraAbbr);
      addRegexToken("NN", matchEraAbbr);
      addRegexToken("NNN", matchEraAbbr);
      addRegexToken("NNNN", matchEraName);
      addRegexToken("NNNNN", matchEraNarrow);
      addParseToken([ "N", "NN", "NNN", "NNNN", "NNNNN" ], function(input, array, config, token) {
        var era = config._locale.erasParse(input, token, config._strict);
        era ? getParsingFlags(config).era = era : getParsingFlags(config).invalidEra = input;
      });
      addRegexToken("y", matchUnsigned);
      addRegexToken("yy", matchUnsigned);
      addRegexToken("yyy", matchUnsigned);
      addRegexToken("yyyy", matchUnsigned);
      addRegexToken("yo", matchEraYearOrdinal);
      addParseToken([ "y", "yy", "yyy", "yyyy" ], YEAR);
      addParseToken([ "yo" ], function(input, array, config, token) {
        var match;
        config._locale._eraYearOrdinalRegex && (match = input.match(config._locale._eraYearOrdinalRegex));
        config._locale.eraYearOrdinalParse ? array[YEAR] = config._locale.eraYearOrdinalParse(input, match) : array[YEAR] = parseInt(input, 10);
      });
      function localeEras(m, format) {
        var i, l, date, eras = this._eras || getLocale("en")._eras;
        for (i = 0, l = eras.length; i < l; ++i) {
          switch (typeof eras[i].since) {
           case "string":
            date = hooks(eras[i].since).startOf("day");
            eras[i].since = date.valueOf();
          }
          switch (typeof eras[i].until) {
           case "undefined":
            eras[i].until = Infinity;
            break;

           case "string":
            date = hooks(eras[i].until).startOf("day").valueOf();
            eras[i].until = date.valueOf();
          }
        }
        return eras;
      }
      function localeErasParse(eraName, format, strict) {
        var i, l, eras = this.eras(), name, abbr, narrow;
        eraName = eraName.toUpperCase();
        for (i = 0, l = eras.length; i < l; ++i) {
          name = eras[i].name.toUpperCase();
          abbr = eras[i].abbr.toUpperCase();
          narrow = eras[i].narrow.toUpperCase();
          if (strict) switch (format) {
           case "N":
           case "NN":
           case "NNN":
            if (abbr === eraName) return eras[i];
            break;

           case "NNNN":
            if (name === eraName) return eras[i];
            break;

           case "NNNNN":
            if (narrow === eraName) return eras[i];
          } else if ([ name, abbr, narrow ].indexOf(eraName) >= 0) return eras[i];
        }
      }
      function localeErasConvertYear(era, year) {
        var dir = era.since <= era.until ? 1 : -1;
        return void 0 === year ? hooks(era.since).year() : hooks(era.since).year() + (year - era.offset) * dir;
      }
      function getEraName() {
        var i, l, val, eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
          val = this.startOf("day").valueOf();
          if (eras[i].since <= val && val <= eras[i].until) return eras[i].name;
          if (eras[i].until <= val && val <= eras[i].since) return eras[i].name;
        }
        return "";
      }
      function getEraNarrow() {
        var i, l, val, eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
          val = this.startOf("day").valueOf();
          if (eras[i].since <= val && val <= eras[i].until) return eras[i].narrow;
          if (eras[i].until <= val && val <= eras[i].since) return eras[i].narrow;
        }
        return "";
      }
      function getEraAbbr() {
        var i, l, val, eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
          val = this.startOf("day").valueOf();
          if (eras[i].since <= val && val <= eras[i].until) return eras[i].abbr;
          if (eras[i].until <= val && val <= eras[i].since) return eras[i].abbr;
        }
        return "";
      }
      function getEraYear() {
        var i, l, dir, val, eras = this.localeData().eras();
        for (i = 0, l = eras.length; i < l; ++i) {
          dir = eras[i].since <= eras[i].until ? 1 : -1;
          val = this.startOf("day").valueOf();
          if (eras[i].since <= val && val <= eras[i].until || eras[i].until <= val && val <= eras[i].since) return (this.year() - hooks(eras[i].since).year()) * dir + eras[i].offset;
        }
        return this.year();
      }
      function erasNameRegex(isStrict) {
        hasOwnProp(this, "_erasNameRegex") || computeErasParse.call(this);
        return isStrict ? this._erasNameRegex : this._erasRegex;
      }
      function erasAbbrRegex(isStrict) {
        hasOwnProp(this, "_erasAbbrRegex") || computeErasParse.call(this);
        return isStrict ? this._erasAbbrRegex : this._erasRegex;
      }
      function erasNarrowRegex(isStrict) {
        hasOwnProp(this, "_erasNarrowRegex") || computeErasParse.call(this);
        return isStrict ? this._erasNarrowRegex : this._erasRegex;
      }
      function matchEraAbbr(isStrict, locale) {
        return locale.erasAbbrRegex(isStrict);
      }
      function matchEraName(isStrict, locale) {
        return locale.erasNameRegex(isStrict);
      }
      function matchEraNarrow(isStrict, locale) {
        return locale.erasNarrowRegex(isStrict);
      }
      function matchEraYearOrdinal(isStrict, locale) {
        return locale._eraYearOrdinalRegex || matchUnsigned;
      }
      function computeErasParse() {
        var abbrPieces = [], namePieces = [], narrowPieces = [], mixedPieces = [], i, l, eras = this.eras();
        for (i = 0, l = eras.length; i < l; ++i) {
          namePieces.push(regexEscape(eras[i].name));
          abbrPieces.push(regexEscape(eras[i].abbr));
          narrowPieces.push(regexEscape(eras[i].narrow));
          mixedPieces.push(regexEscape(eras[i].name));
          mixedPieces.push(regexEscape(eras[i].abbr));
          mixedPieces.push(regexEscape(eras[i].narrow));
        }
        this._erasRegex = new RegExp("^(" + mixedPieces.join("|") + ")", "i");
        this._erasNameRegex = new RegExp("^(" + namePieces.join("|") + ")", "i");
        this._erasAbbrRegex = new RegExp("^(" + abbrPieces.join("|") + ")", "i");
        this._erasNarrowRegex = new RegExp("^(" + narrowPieces.join("|") + ")", "i");
      }
      addFormatToken(0, [ "gg", 2 ], 0, function() {
        return this.weekYear() % 100;
      });
      addFormatToken(0, [ "GG", 2 ], 0, function() {
        return this.isoWeekYear() % 100;
      });
      function addWeekYearFormatToken(token, getter) {
        addFormatToken(0, [ token, token.length ], 0, getter);
      }
      addWeekYearFormatToken("gggg", "weekYear");
      addWeekYearFormatToken("ggggg", "weekYear");
      addWeekYearFormatToken("GGGG", "isoWeekYear");
      addWeekYearFormatToken("GGGGG", "isoWeekYear");
      addUnitAlias("weekYear", "gg");
      addUnitAlias("isoWeekYear", "GG");
      addUnitPriority("weekYear", 1);
      addUnitPriority("isoWeekYear", 1);
      addRegexToken("G", matchSigned);
      addRegexToken("g", matchSigned);
      addRegexToken("GG", match1to2, match2);
      addRegexToken("gg", match1to2, match2);
      addRegexToken("GGGG", match1to4, match4);
      addRegexToken("gggg", match1to4, match4);
      addRegexToken("GGGGG", match1to6, match6);
      addRegexToken("ggggg", match1to6, match6);
      addWeekParseToken([ "gggg", "ggggg", "GGGG", "GGGGG" ], function(input, week, config, token) {
        week[token.substr(0, 2)] = toInt(input);
      });
      addWeekParseToken([ "gg", "GG" ], function(input, week, config, token) {
        week[token] = hooks.parseTwoDigitYear(input);
      });
      function getSetWeekYear(input) {
        return getSetWeekYearHelper.call(this, input, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy);
      }
      function getSetISOWeekYear(input) {
        return getSetWeekYearHelper.call(this, input, this.isoWeek(), this.isoWeekday(), 1, 4);
      }
      function getISOWeeksInYear() {
        return weeksInYear(this.year(), 1, 4);
      }
      function getISOWeeksInISOWeekYear() {
        return weeksInYear(this.isoWeekYear(), 1, 4);
      }
      function getWeeksInYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
      }
      function getWeeksInWeekYear() {
        var weekInfo = this.localeData()._week;
        return weeksInYear(this.weekYear(), weekInfo.dow, weekInfo.doy);
      }
      function getSetWeekYearHelper(input, week, weekday, dow, doy) {
        var weeksTarget;
        if (null == input) return weekOfYear(this, dow, doy).year;
        weeksTarget = weeksInYear(input, dow, doy);
        week > weeksTarget && (week = weeksTarget);
        return setWeekAll.call(this, input, week, weekday, dow, doy);
      }
      function setWeekAll(weekYear, week, weekday, dow, doy) {
        var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy), date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);
        this.year(date.getUTCFullYear());
        this.month(date.getUTCMonth());
        this.date(date.getUTCDate());
        return this;
      }
      addFormatToken("Q", 0, "Qo", "quarter");
      addUnitAlias("quarter", "Q");
      addUnitPriority("quarter", 7);
      addRegexToken("Q", match1);
      addParseToken("Q", function(input, array) {
        array[MONTH] = 3 * (toInt(input) - 1);
      });
      function getSetQuarter(input) {
        return null == input ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (input - 1) + this.month() % 3);
      }
      addFormatToken("D", [ "DD", 2 ], "Do", "date");
      addUnitAlias("date", "D");
      addUnitPriority("date", 9);
      addRegexToken("D", match1to2);
      addRegexToken("DD", match1to2, match2);
      addRegexToken("Do", function(isStrict, locale) {
        return isStrict ? locale._dayOfMonthOrdinalParse || locale._ordinalParse : locale._dayOfMonthOrdinalParseLenient;
      });
      addParseToken([ "D", "DD" ], DATE);
      addParseToken("Do", function(input, array) {
        array[DATE] = toInt(input.match(match1to2)[0]);
      });
      var getSetDayOfMonth = makeGetSet("Date", true);
      addFormatToken("DDD", [ "DDDD", 3 ], "DDDo", "dayOfYear");
      addUnitAlias("dayOfYear", "DDD");
      addUnitPriority("dayOfYear", 4);
      addRegexToken("DDD", match1to3);
      addRegexToken("DDDD", match3);
      addParseToken([ "DDD", "DDDD" ], function(input, array, config) {
        config._dayOfYear = toInt(input);
      });
      function getSetDayOfYear(input) {
        var dayOfYear = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
        return null == input ? dayOfYear : this.add(input - dayOfYear, "d");
      }
      addFormatToken("m", [ "mm", 2 ], 0, "minute");
      addUnitAlias("minute", "m");
      addUnitPriority("minute", 14);
      addRegexToken("m", match1to2);
      addRegexToken("mm", match1to2, match2);
      addParseToken([ "m", "mm" ], MINUTE);
      var getSetMinute = makeGetSet("Minutes", false);
      addFormatToken("s", [ "ss", 2 ], 0, "second");
      addUnitAlias("second", "s");
      addUnitPriority("second", 15);
      addRegexToken("s", match1to2);
      addRegexToken("ss", match1to2, match2);
      addParseToken([ "s", "ss" ], SECOND);
      var getSetSecond = makeGetSet("Seconds", false);
      addFormatToken("S", 0, 0, function() {
        return ~~(this.millisecond() / 100);
      });
      addFormatToken(0, [ "SS", 2 ], 0, function() {
        return ~~(this.millisecond() / 10);
      });
      addFormatToken(0, [ "SSS", 3 ], 0, "millisecond");
      addFormatToken(0, [ "SSSS", 4 ], 0, function() {
        return 10 * this.millisecond();
      });
      addFormatToken(0, [ "SSSSS", 5 ], 0, function() {
        return 100 * this.millisecond();
      });
      addFormatToken(0, [ "SSSSSS", 6 ], 0, function() {
        return 1e3 * this.millisecond();
      });
      addFormatToken(0, [ "SSSSSSS", 7 ], 0, function() {
        return 1e4 * this.millisecond();
      });
      addFormatToken(0, [ "SSSSSSSS", 8 ], 0, function() {
        return 1e5 * this.millisecond();
      });
      addFormatToken(0, [ "SSSSSSSSS", 9 ], 0, function() {
        return 1e6 * this.millisecond();
      });
      addUnitAlias("millisecond", "ms");
      addUnitPriority("millisecond", 16);
      addRegexToken("S", match1to3, match1);
      addRegexToken("SS", match1to3, match2);
      addRegexToken("SSS", match1to3, match3);
      var token, getSetMillisecond;
      for (token = "SSSS"; token.length <= 9; token += "S") addRegexToken(token, matchUnsigned);
      function parseMs(input, array) {
        array[MILLISECOND] = toInt(1e3 * ("0." + input));
      }
      for (token = "S"; token.length <= 9; token += "S") addParseToken(token, parseMs);
      getSetMillisecond = makeGetSet("Milliseconds", false);
      addFormatToken("z", 0, 0, "zoneAbbr");
      addFormatToken("zz", 0, 0, "zoneName");
      function getZoneAbbr() {
        return this._isUTC ? "UTC" : "";
      }
      function getZoneName() {
        return this._isUTC ? "Coordinated Universal Time" : "";
      }
      var proto = Moment.prototype;
      proto.add = add;
      proto.calendar = calendar$1;
      proto.clone = clone;
      proto.diff = diff;
      proto.endOf = endOf;
      proto.format = format;
      proto.from = from;
      proto.fromNow = fromNow;
      proto.to = to;
      proto.toNow = toNow;
      proto.get = stringGet;
      proto.invalidAt = invalidAt;
      proto.isAfter = isAfter;
      proto.isBefore = isBefore;
      proto.isBetween = isBetween;
      proto.isSame = isSame;
      proto.isSameOrAfter = isSameOrAfter;
      proto.isSameOrBefore = isSameOrBefore;
      proto.isValid = isValid$2;
      proto.lang = lang;
      proto.locale = locale;
      proto.localeData = localeData;
      proto.max = prototypeMax;
      proto.min = prototypeMin;
      proto.parsingFlags = parsingFlags;
      proto.set = stringSet;
      proto.startOf = startOf;
      proto.subtract = subtract;
      proto.toArray = toArray;
      proto.toObject = toObject;
      proto.toDate = toDate;
      proto.toISOString = toISOString;
      proto.inspect = inspect;
      "undefined" !== typeof Symbol && null != Symbol.for && (proto[Symbol.for("nodejs.util.inspect.custom")] = function() {
        return "Moment<" + this.format() + ">";
      });
      proto.toJSON = toJSON;
      proto.toString = toString;
      proto.unix = unix;
      proto.valueOf = valueOf;
      proto.creationData = creationData;
      proto.eraName = getEraName;
      proto.eraNarrow = getEraNarrow;
      proto.eraAbbr = getEraAbbr;
      proto.eraYear = getEraYear;
      proto.year = getSetYear;
      proto.isLeapYear = getIsLeapYear;
      proto.weekYear = getSetWeekYear;
      proto.isoWeekYear = getSetISOWeekYear;
      proto.quarter = proto.quarters = getSetQuarter;
      proto.month = getSetMonth;
      proto.daysInMonth = getDaysInMonth;
      proto.week = proto.weeks = getSetWeek;
      proto.isoWeek = proto.isoWeeks = getSetISOWeek;
      proto.weeksInYear = getWeeksInYear;
      proto.weeksInWeekYear = getWeeksInWeekYear;
      proto.isoWeeksInYear = getISOWeeksInYear;
      proto.isoWeeksInISOWeekYear = getISOWeeksInISOWeekYear;
      proto.date = getSetDayOfMonth;
      proto.day = proto.days = getSetDayOfWeek;
      proto.weekday = getSetLocaleDayOfWeek;
      proto.isoWeekday = getSetISODayOfWeek;
      proto.dayOfYear = getSetDayOfYear;
      proto.hour = proto.hours = getSetHour;
      proto.minute = proto.minutes = getSetMinute;
      proto.second = proto.seconds = getSetSecond;
      proto.millisecond = proto.milliseconds = getSetMillisecond;
      proto.utcOffset = getSetOffset;
      proto.utc = setOffsetToUTC;
      proto.local = setOffsetToLocal;
      proto.parseZone = setOffsetToParsedOffset;
      proto.hasAlignedHourOffset = hasAlignedHourOffset;
      proto.isDST = isDaylightSavingTime;
      proto.isLocal = isLocal;
      proto.isUtcOffset = isUtcOffset;
      proto.isUtc = isUtc;
      proto.isUTC = isUtc;
      proto.zoneAbbr = getZoneAbbr;
      proto.zoneName = getZoneName;
      proto.dates = deprecate("dates accessor is deprecated. Use date instead.", getSetDayOfMonth);
      proto.months = deprecate("months accessor is deprecated. Use month instead", getSetMonth);
      proto.years = deprecate("years accessor is deprecated. Use year instead", getSetYear);
      proto.zone = deprecate("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/", getSetZone);
      proto.isDSTShifted = deprecate("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information", isDaylightSavingTimeShifted);
      function createUnix(input) {
        return createLocal(1e3 * input);
      }
      function createInZone() {
        return createLocal.apply(null, arguments).parseZone();
      }
      function preParsePostFormat(string) {
        return string;
      }
      var proto$1 = Locale.prototype;
      proto$1.calendar = calendar;
      proto$1.longDateFormat = longDateFormat;
      proto$1.invalidDate = invalidDate;
      proto$1.ordinal = ordinal;
      proto$1.preparse = preParsePostFormat;
      proto$1.postformat = preParsePostFormat;
      proto$1.relativeTime = relativeTime;
      proto$1.pastFuture = pastFuture;
      proto$1.set = set;
      proto$1.eras = localeEras;
      proto$1.erasParse = localeErasParse;
      proto$1.erasConvertYear = localeErasConvertYear;
      proto$1.erasAbbrRegex = erasAbbrRegex;
      proto$1.erasNameRegex = erasNameRegex;
      proto$1.erasNarrowRegex = erasNarrowRegex;
      proto$1.months = localeMonths;
      proto$1.monthsShort = localeMonthsShort;
      proto$1.monthsParse = localeMonthsParse;
      proto$1.monthsRegex = monthsRegex;
      proto$1.monthsShortRegex = monthsShortRegex;
      proto$1.week = localeWeek;
      proto$1.firstDayOfYear = localeFirstDayOfYear;
      proto$1.firstDayOfWeek = localeFirstDayOfWeek;
      proto$1.weekdays = localeWeekdays;
      proto$1.weekdaysMin = localeWeekdaysMin;
      proto$1.weekdaysShort = localeWeekdaysShort;
      proto$1.weekdaysParse = localeWeekdaysParse;
      proto$1.weekdaysRegex = weekdaysRegex;
      proto$1.weekdaysShortRegex = weekdaysShortRegex;
      proto$1.weekdaysMinRegex = weekdaysMinRegex;
      proto$1.isPM = localeIsPM;
      proto$1.meridiem = localeMeridiem;
      function get$1(format, index, field, setter) {
        var locale = getLocale(), utc = createUTC().set(setter, index);
        return locale[field](utc, format);
      }
      function listMonthsImpl(format, index, field) {
        if (isNumber(format)) {
          index = format;
          format = void 0;
        }
        format = format || "";
        if (null != index) return get$1(format, index, field, "month");
        var i, out = [];
        for (i = 0; i < 12; i++) out[i] = get$1(format, i, field, "month");
        return out;
      }
      function listWeekdaysImpl(localeSorted, format, index, field) {
        if ("boolean" === typeof localeSorted) {
          if (isNumber(format)) {
            index = format;
            format = void 0;
          }
          format = format || "";
        } else {
          format = localeSorted;
          index = format;
          localeSorted = false;
          if (isNumber(format)) {
            index = format;
            format = void 0;
          }
          format = format || "";
        }
        var locale = getLocale(), shift = localeSorted ? locale._week.dow : 0, i, out = [];
        if (null != index) return get$1(format, (index + shift) % 7, field, "day");
        for (i = 0; i < 7; i++) out[i] = get$1(format, (i + shift) % 7, field, "day");
        return out;
      }
      function listMonths(format, index) {
        return listMonthsImpl(format, index, "months");
      }
      function listMonthsShort(format, index) {
        return listMonthsImpl(format, index, "monthsShort");
      }
      function listWeekdays(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, "weekdays");
      }
      function listWeekdaysShort(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, "weekdaysShort");
      }
      function listWeekdaysMin(localeSorted, format, index) {
        return listWeekdaysImpl(localeSorted, format, index, "weekdaysMin");
      }
      getSetGlobalLocale("en", {
        eras: [ {
          since: "0001-01-01",
          until: Infinity,
          offset: 1,
          name: "Anno Domini",
          narrow: "AD",
          abbr: "AD"
        }, {
          since: "0000-12-31",
          until: -Infinity,
          offset: 1,
          name: "Before Christ",
          narrow: "BC",
          abbr: "BC"
        } ],
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function(number) {
          var b = number % 10, output = 1 === toInt(number % 100 / 10) ? "th" : 1 === b ? "st" : 2 === b ? "nd" : 3 === b ? "rd" : "th";
          return number + output;
        }
      });
      hooks.lang = deprecate("moment.lang is deprecated. Use moment.locale instead.", getSetGlobalLocale);
      hooks.langData = deprecate("moment.langData is deprecated. Use moment.localeData instead.", getLocale);
      var mathAbs = Math.abs;
      function abs() {
        var data = this._data;
        this._milliseconds = mathAbs(this._milliseconds);
        this._days = mathAbs(this._days);
        this._months = mathAbs(this._months);
        data.milliseconds = mathAbs(data.milliseconds);
        data.seconds = mathAbs(data.seconds);
        data.minutes = mathAbs(data.minutes);
        data.hours = mathAbs(data.hours);
        data.months = mathAbs(data.months);
        data.years = mathAbs(data.years);
        return this;
      }
      function addSubtract$1(duration, input, value, direction) {
        var other = createDuration(input, value);
        duration._milliseconds += direction * other._milliseconds;
        duration._days += direction * other._days;
        duration._months += direction * other._months;
        return duration._bubble();
      }
      function add$1(input, value) {
        return addSubtract$1(this, input, value, 1);
      }
      function subtract$1(input, value) {
        return addSubtract$1(this, input, value, -1);
      }
      function absCeil(number) {
        return number < 0 ? Math.floor(number) : Math.ceil(number);
      }
      function bubble() {
        var milliseconds = this._milliseconds, days = this._days, months = this._months, data = this._data, seconds, minutes, hours, years, monthsFromDays;
        if (!(milliseconds >= 0 && days >= 0 && months >= 0 || milliseconds <= 0 && days <= 0 && months <= 0)) {
          milliseconds += 864e5 * absCeil(monthsToDays(months) + days);
          days = 0;
          months = 0;
        }
        data.milliseconds = milliseconds % 1e3;
        seconds = absFloor(milliseconds / 1e3);
        data.seconds = seconds % 60;
        minutes = absFloor(seconds / 60);
        data.minutes = minutes % 60;
        hours = absFloor(minutes / 60);
        data.hours = hours % 24;
        days += absFloor(hours / 24);
        monthsFromDays = absFloor(daysToMonths(days));
        months += monthsFromDays;
        days -= absCeil(monthsToDays(monthsFromDays));
        years = absFloor(months / 12);
        months %= 12;
        data.days = days;
        data.months = months;
        data.years = years;
        return this;
      }
      function daysToMonths(days) {
        return 4800 * days / 146097;
      }
      function monthsToDays(months) {
        return 146097 * months / 4800;
      }
      function as(units) {
        if (!this.isValid()) return NaN;
        var days, months, milliseconds = this._milliseconds;
        units = normalizeUnits(units);
        if ("month" === units || "quarter" === units || "year" === units) {
          days = this._days + milliseconds / 864e5;
          months = this._months + daysToMonths(days);
          switch (units) {
           case "month":
            return months;

           case "quarter":
            return months / 3;

           case "year":
            return months / 12;
          }
        } else {
          days = this._days + Math.round(monthsToDays(this._months));
          switch (units) {
           case "week":
            return days / 7 + milliseconds / 6048e5;

           case "day":
            return days + milliseconds / 864e5;

           case "hour":
            return 24 * days + milliseconds / 36e5;

           case "minute":
            return 1440 * days + milliseconds / 6e4;

           case "second":
            return 86400 * days + milliseconds / 1e3;

           case "millisecond":
            return Math.floor(864e5 * days) + milliseconds;

           default:
            throw new Error("Unknown unit " + units);
          }
        }
      }
      function valueOf$1() {
        if (!this.isValid()) return NaN;
        return this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * toInt(this._months / 12);
      }
      function makeAs(alias) {
        return function() {
          return this.as(alias);
        };
      }
      var asMilliseconds = makeAs("ms"), asSeconds = makeAs("s"), asMinutes = makeAs("m"), asHours = makeAs("h"), asDays = makeAs("d"), asWeeks = makeAs("w"), asMonths = makeAs("M"), asQuarters = makeAs("Q"), asYears = makeAs("y");
      function clone$1() {
        return createDuration(this);
      }
      function get$2(units) {
        units = normalizeUnits(units);
        return this.isValid() ? this[units + "s"]() : NaN;
      }
      function makeGetter(name) {
        return function() {
          return this.isValid() ? this._data[name] : NaN;
        };
      }
      var milliseconds = makeGetter("milliseconds"), seconds = makeGetter("seconds"), minutes = makeGetter("minutes"), hours = makeGetter("hours"), days = makeGetter("days"), months = makeGetter("months"), years = makeGetter("years");
      function weeks() {
        return absFloor(this.days() / 7);
      }
      var round = Math.round, thresholds = {
        ss: 44,
        s: 45,
        m: 45,
        h: 22,
        d: 26,
        w: null,
        M: 11
      };
      function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
        return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
      }
      function relativeTime$1(posNegDuration, withoutSuffix, thresholds, locale) {
        var duration = createDuration(posNegDuration).abs(), seconds = round(duration.as("s")), minutes = round(duration.as("m")), hours = round(duration.as("h")), days = round(duration.as("d")), months = round(duration.as("M")), weeks = round(duration.as("w")), years = round(duration.as("y")), a = seconds <= thresholds.ss && [ "s", seconds ] || seconds < thresholds.s && [ "ss", seconds ] || minutes <= 1 && [ "m" ] || minutes < thresholds.m && [ "mm", minutes ] || hours <= 1 && [ "h" ] || hours < thresholds.h && [ "hh", hours ] || days <= 1 && [ "d" ] || days < thresholds.d && [ "dd", days ];
        null != thresholds.w && (a = a || weeks <= 1 && [ "w" ] || weeks < thresholds.w && [ "ww", weeks ]);
        a = a || months <= 1 && [ "M" ] || months < thresholds.M && [ "MM", months ] || years <= 1 && [ "y" ] || [ "yy", years ];
        a[2] = withoutSuffix;
        a[3] = +posNegDuration > 0;
        a[4] = locale;
        return substituteTimeAgo.apply(null, a);
      }
      function getSetRelativeTimeRounding(roundingFunction) {
        if (void 0 === roundingFunction) return round;
        if ("function" === typeof roundingFunction) {
          round = roundingFunction;
          return true;
        }
        return false;
      }
      function getSetRelativeTimeThreshold(threshold, limit) {
        if (void 0 === thresholds[threshold]) return false;
        if (void 0 === limit) return thresholds[threshold];
        thresholds[threshold] = limit;
        "s" === threshold && (thresholds.ss = limit - 1);
        return true;
      }
      function humanize(argWithSuffix, argThresholds) {
        if (!this.isValid()) return this.localeData().invalidDate();
        var withSuffix = false, th = thresholds, locale, output;
        if ("object" === typeof argWithSuffix) {
          argThresholds = argWithSuffix;
          argWithSuffix = false;
        }
        "boolean" === typeof argWithSuffix && (withSuffix = argWithSuffix);
        if ("object" === typeof argThresholds) {
          th = Object.assign({}, thresholds, argThresholds);
          null != argThresholds.s && null == argThresholds.ss && (th.ss = argThresholds.s - 1);
        }
        locale = this.localeData();
        output = relativeTime$1(this, !withSuffix, th, locale);
        withSuffix && (output = locale.pastFuture(+this, output));
        return locale.postformat(output);
      }
      var abs$1 = Math.abs;
      function sign(x) {
        return (x > 0) - (x < 0) || +x;
      }
      function toISOString$1() {
        if (!this.isValid()) return this.localeData().invalidDate();
        var seconds = abs$1(this._milliseconds) / 1e3, days = abs$1(this._days), months = abs$1(this._months), minutes, hours, years, s, total = this.asSeconds(), totalSign, ymSign, daysSign, hmsSign;
        if (!total) return "P0D";
        minutes = absFloor(seconds / 60);
        hours = absFloor(minutes / 60);
        seconds %= 60;
        minutes %= 60;
        years = absFloor(months / 12);
        months %= 12;
        s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, "") : "";
        totalSign = total < 0 ? "-" : "";
        ymSign = sign(this._months) !== sign(total) ? "-" : "";
        daysSign = sign(this._days) !== sign(total) ? "-" : "";
        hmsSign = sign(this._milliseconds) !== sign(total) ? "-" : "";
        return totalSign + "P" + (years ? ymSign + years + "Y" : "") + (months ? ymSign + months + "M" : "") + (days ? daysSign + days + "D" : "") + (hours || minutes || seconds ? "T" : "") + (hours ? hmsSign + hours + "H" : "") + (minutes ? hmsSign + minutes + "M" : "") + (seconds ? hmsSign + s + "S" : "");
      }
      var proto$2 = Duration.prototype;
      proto$2.isValid = isValid$1;
      proto$2.abs = abs;
      proto$2.add = add$1;
      proto$2.subtract = subtract$1;
      proto$2.as = as;
      proto$2.asMilliseconds = asMilliseconds;
      proto$2.asSeconds = asSeconds;
      proto$2.asMinutes = asMinutes;
      proto$2.asHours = asHours;
      proto$2.asDays = asDays;
      proto$2.asWeeks = asWeeks;
      proto$2.asMonths = asMonths;
      proto$2.asQuarters = asQuarters;
      proto$2.asYears = asYears;
      proto$2.valueOf = valueOf$1;
      proto$2._bubble = bubble;
      proto$2.clone = clone$1;
      proto$2.get = get$2;
      proto$2.milliseconds = milliseconds;
      proto$2.seconds = seconds;
      proto$2.minutes = minutes;
      proto$2.hours = hours;
      proto$2.days = days;
      proto$2.weeks = weeks;
      proto$2.months = months;
      proto$2.years = years;
      proto$2.humanize = humanize;
      proto$2.toISOString = toISOString$1;
      proto$2.toString = toISOString$1;
      proto$2.toJSON = toISOString$1;
      proto$2.locale = locale;
      proto$2.localeData = localeData;
      proto$2.toIsoString = deprecate("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", toISOString$1);
      proto$2.lang = lang;
      addFormatToken("X", 0, 0, "unix");
      addFormatToken("x", 0, 0, "valueOf");
      addRegexToken("x", matchSigned);
      addRegexToken("X", matchTimestamp);
      addParseToken("X", function(input, array, config) {
        config._d = new Date(1e3 * parseFloat(input));
      });
      addParseToken("x", function(input, array, config) {
        config._d = new Date(toInt(input));
      });
      hooks.version = "2.26.0";
      setHookCallback(createLocal);
      hooks.fn = proto;
      hooks.min = min;
      hooks.max = max;
      hooks.now = now;
      hooks.utc = createUTC;
      hooks.unix = createUnix;
      hooks.months = listMonths;
      hooks.isDate = isDate;
      hooks.locale = getSetGlobalLocale;
      hooks.invalid = createInvalid;
      hooks.duration = createDuration;
      hooks.isMoment = isMoment;
      hooks.weekdays = listWeekdays;
      hooks.parseZone = createInZone;
      hooks.localeData = getLocale;
      hooks.isDuration = isDuration;
      hooks.monthsShort = listMonthsShort;
      hooks.weekdaysMin = listWeekdaysMin;
      hooks.defineLocale = defineLocale;
      hooks.updateLocale = updateLocale;
      hooks.locales = listLocales;
      hooks.weekdaysShort = listWeekdaysShort;
      hooks.normalizeUnits = normalizeUnits;
      hooks.relativeTimeRounding = getSetRelativeTimeRounding;
      hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
      hooks.calendarFormat = getCalendarFormat;
      hooks.prototype = proto;
      hooks.HTML5_FMT = {
        DATETIME_LOCAL: "YYYY-MM-DDTHH:mm",
        DATETIME_LOCAL_SECONDS: "YYYY-MM-DDTHH:mm:ss",
        DATETIME_LOCAL_MS: "YYYY-MM-DDTHH:mm:ss.SSS",
        DATE: "YYYY-MM-DD",
        TIME: "HH:mm",
        TIME_SECONDS: "HH:mm:ss",
        TIME_MS: "HH:mm:ss.SSS",
        WEEK: "GGGG-[W]WW",
        MONTH: "YYYY-MM"
      };
      hooks.defineLocale("zh-cn", {
        months: "\u4e00\u6708_\u4e8c\u6708_\u4e09\u6708_\u56db\u6708_\u4e94\u6708_\u516d\u6708_\u4e03\u6708_\u516b\u6708_\u4e5d\u6708_\u5341\u6708_\u5341\u4e00\u6708_\u5341\u4e8c\u6708".split("_"),
        monthsShort: "1\u6708_2\u6708_3\u6708_4\u6708_5\u6708_6\u6708_7\u6708_8\u6708_9\u6708_10\u6708_11\u6708_12\u6708".split("_"),
        weekdays: "\u661f\u671f\u65e5_\u661f\u671f\u4e00_\u661f\u671f\u4e8c_\u661f\u671f\u4e09_\u661f\u671f\u56db_\u661f\u671f\u4e94_\u661f\u671f\u516d".split("_"),
        weekdaysShort: "\u5468\u65e5_\u5468\u4e00_\u5468\u4e8c_\u5468\u4e09_\u5468\u56db_\u5468\u4e94_\u5468\u516d".split("_"),
        weekdaysMin: "\u65e5_\u4e00_\u4e8c_\u4e09_\u56db_\u4e94_\u516d".split("_"),
        longDateFormat: {
          LT: "HH:mm",
          LTS: "HH:mm:ss",
          L: "YYYY/MM/DD",
          LL: "YYYY\u5e74M\u6708D\u65e5",
          LLL: "YYYY\u5e74M\u6708D\u65e5Ah\u70b9mm\u5206",
          LLLL: "YYYY\u5e74M\u6708D\u65e5ddddAh\u70b9mm\u5206",
          l: "YYYY/M/D",
          ll: "YYYY\u5e74M\u6708D\u65e5",
          lll: "YYYY\u5e74M\u6708D\u65e5 HH:mm",
          llll: "YYYY\u5e74M\u6708D\u65e5dddd HH:mm"
        },
        meridiemParse: /\u51cc\u6668|\u65e9\u4e0a|\u4e0a\u5348|\u4e2d\u5348|\u4e0b\u5348|\u665a\u4e0a/,
        meridiemHour: function(hour, meridiem) {
          12 === hour && (hour = 0);
          return "\u51cc\u6668" === meridiem || "\u65e9\u4e0a" === meridiem || "\u4e0a\u5348" === meridiem ? hour : "\u4e0b\u5348" === meridiem || "\u665a\u4e0a" === meridiem ? hour + 12 : hour >= 11 ? hour : hour + 12;
        },
        meridiem: function(hour, minute, isLower) {
          var hm = 100 * hour + minute;
          return hm < 600 ? "\u51cc\u6668" : hm < 900 ? "\u65e9\u4e0a" : hm < 1130 ? "\u4e0a\u5348" : hm < 1230 ? "\u4e2d\u5348" : hm < 1800 ? "\u4e0b\u5348" : "\u665a\u4e0a";
        },
        calendar: {
          sameDay: "[\u4eca\u5929]LT",
          nextDay: "[\u660e\u5929]LT",
          nextWeek: "[\u4e0b]ddddLT",
          lastDay: "[\u6628\u5929]LT",
          lastWeek: "[\u4e0a]ddddLT",
          sameElse: "L"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(\u65e5|\u6708|\u5468)/,
        ordinal: function(number, period) {
          switch (period) {
           case "d":
           case "D":
           case "DDD":
            return number + "\u65e5";

           case "M":
            return number + "\u6708";

           case "w":
           case "W":
            return number + "\u5468";

           default:
            return number;
          }
        },
        relativeTime: {
          future: "%s\u5185",
          past: "%s\u524d",
          s: "\u51e0\u79d2",
          ss: "%d \u79d2",
          m: "1 \u5206\u949f",
          mm: "%d \u5206\u949f",
          h: "1 \u5c0f\u65f6",
          hh: "%d \u5c0f\u65f6",
          d: "1 \u5929",
          dd: "%d \u5929",
          M: "1 \u4e2a\u6708",
          MM: "%d \u4e2a\u6708",
          y: "1 \u5e74",
          yy: "%d \u5e74"
        },
        week: {
          dow: 1,
          doy: 4
        }
      });
      return hooks;
    });
  }, {} ],
  AccountView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d53486WbwVLz5W9EyipDLXv", "AccountView");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var BaseWindows_1 = require("../../../framework/base/BaseWindows");
    var ViewConst_1 = require("../../../framework/const/ViewConst");
    var GameGlobal_1 = require("../../../framework/GameGlobal");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var AccountView = function(_super) {
      __extends(AccountView, _super);
      function AccountView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.isClickRect = true;
        return _this;
      }
      AccountView.prototype.initUI = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        _super.prototype.initUI.apply(this, args);
        this.initSelfUI();
      };
      AccountView.prototype.initSelfUI = function() {};
      AccountView.prototype.onBtnClick = function(event, customEventData) {
        var userInfo = GameGlobal_1.GameGlobal.DataManager.userInfo;
        if (!userInfo && 0 != customEventData) {
          GameGlobal_1.GameGlobal.TipManager.showTip("User is not login");
          return;
        }
        0 == customEventData ? GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.ACCOUNT_VIEW) : 1 == customEventData ? GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.CHANGE_HEAD_VIEW) : 2 == customEventData ? GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.CHANGE_NICK_VIEW) : 3 == customEventData && GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.CHANGE_PASSWORD_VIEW);
      };
      AccountView.prototype.onEnterBegin = function(event, customEventData) {};
      AccountView.TAG = "AccountView";
      AccountView = __decorate([ ccclass ], AccountView);
      return AccountView;
    }(BaseWindows_1.BaseWindows);
    exports.default = AccountView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ViewConst": "ViewConst"
  } ],
  AdConst: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9df63e/lxJGgZjzZS1Tz1UQ", "AdConst");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.AdConst = void 0;
    var AdConst = function() {
      function AdConst() {}
      AdConst.FileName = "adConfig";
      AdConst.Banner = {
        FRE: 2,
        CLICK: 3,
        START_CNT: 2
      };
      AdConst.Video = {
        FRE: 2,
        CLICK: 3,
        START_CNT: 1e3
      };
      return AdConst;
    }();
    exports.AdConst = AdConst;
    cc._RF.pop();
  }, {} ],
  AdManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1def7vE5FlCdLt8aB2mOv2F", "AdManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.AdManager = void 0;
    var Singleton_1 = require("../base/Singleton");
    var AdConst_1 = require("../const/AdConst");
    var GameGlobal_1 = require("../GameGlobal");
    var TextUtil_1 = require("../utils/TextUtil");
    var AdManager = function(_super) {
      __extends(AdManager, _super);
      function AdManager() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._jsonData = {
          gameCnt: 0,
          bannerClick: 0,
          videoClick: 0,
          date: ""
        };
        return _this;
      }
      AdManager.getInstance = function() {
        return _super.getInstance.call(this);
      };
      AdManager.prototype.init = function() {
        var today = new Date().toDateString();
        var str = GameGlobal_1.GameGlobal.Store.getItem(AdConst_1.AdConst.FileName);
        if (TextUtil_1.TextUtil.isEmpty(str)) {
          this._jsonData.date = today;
          str = JSON.stringify(this._jsonData);
          GameGlobal_1.GameGlobal.Store.setItem(AdConst_1.AdConst.FileName, str);
        } else {
          var obj = JSON.parse(str);
          if (obj["date"] != today) {
            this._jsonData.date = today;
            str = JSON.stringify(this._jsonData);
            GameGlobal_1.GameGlobal.Store.setItem(AdConst_1.AdConst.FileName, str);
          }
        }
      };
      AdManager.prototype.addGameCnt = function() {
        this._jsonData.gameCnt = this._jsonData.gameCnt + 1;
        var str = JSON.stringify(this._jsonData);
        GameGlobal_1.GameGlobal.Store.setItem(AdConst_1.AdConst.FileName, str);
      };
      AdManager.prototype.addBannerClick = function() {
        this._jsonData.bannerClick = this._jsonData.bannerClick + 1;
        var str = JSON.stringify(this._jsonData);
        GameGlobal_1.GameGlobal.Store.setItem(AdConst_1.AdConst.FileName, str);
      };
      AdManager.prototype.addVideoClick = function() {
        this._jsonData.videoClick = this._jsonData.videoClick + 1;
        var str = JSON.stringify(this._jsonData);
        GameGlobal_1.GameGlobal.Store.setItem(AdConst_1.AdConst.FileName, str);
      };
      Object.defineProperty(AdManager.prototype, "bVideoShow", {
        get: function() {
          var click = this._jsonData.videoClick;
          var gameCnt = this._jsonData.gameCnt;
          return click < AdConst_1.AdConst.Video.CLICK && gameCnt > AdConst_1.AdConst.Video.START_CNT && gameCnt % AdConst_1.AdConst.Video.FRE == 0;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(AdManager.prototype, "bBannerShow", {
        get: function() {
          var click = this._jsonData.bannerClick;
          var gameCnt = this._jsonData.gameCnt;
          return click < AdConst_1.AdConst.Banner.CLICK && gameCnt > AdConst_1.AdConst.Banner.START_CNT && gameCnt % AdConst_1.AdConst.Banner.FRE == 0;
        },
        enumerable: false,
        configurable: true
      });
      AdManager.TAG = "AdManager";
      return AdManager;
    }(Singleton_1.Singleton);
    exports.AdManager = AdManager;
    cc._RF.pop();
  }, {
    "../GameGlobal": "GameGlobal",
    "../base/Singleton": "Singleton",
    "../const/AdConst": "AdConst",
    "../utils/TextUtil": "TextUtil"
  } ],
  Adapter: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "677a93Dik5LaqdSAYbr+guZ", "Adapter");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Adapter = void 0;
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Adapter = function(_super) {
      __extends(Adapter, _super);
      function Adapter() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.nodes = [];
        _this._originTops = [];
        return _this;
      }
      Adapter.prototype.onLoad = function() {
        this._originTops = [];
        for (var i = 0; i < this.nodes.length; i++) this._originTops.push(this._getNodeTop(this.nodes[i]));
        var dy = cc.winSize.height - 1280;
        for (var i = 0; i < this.nodes.length; i++) {
          var widget = this.nodes[i].getComponent(cc.Widget);
          if (widget && widget.isAlignTop) {
            widget.top = dy / 3 + widget.top;
            widget.updateAlignment();
          } else if (widget && widget.isAbsoluteVerticalCenter) {
            widget.verticalCenter = dy / 3 + widget.verticalCenter;
            widget.updateAlignment();
          }
        }
      };
      Adapter.prototype._getNodeTop = function(node) {
        var widget = node.getComponent(cc.Widget);
        return widget ? widget.top : null;
      };
      __decorate([ property([ cc.Node ]) ], Adapter.prototype, "nodes", void 0);
      Adapter = __decorate([ ccclass ], Adapter);
      return Adapter;
    }(cc.Component);
    exports.Adapter = Adapter;
    cc._RF.pop();
  }, {} ],
  AddCoinNumView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b50bbeKQdNHxp5mLAb8lLVb", "AddCoinNumView");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var AddCoinNumView = function(_super) {
      __extends(AddCoinNumView, _super);
      function AddCoinNumView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.label = null;
        return _this;
      }
      AddCoinNumView.prototype.Init = function(coin, pos, parentNode) {
        this.label.string = "+" + coin.toString();
        this.node.setParent(parentNode);
        this.node.position = pos;
        var animCtrl = this.node.getComponent(cc.Animation);
        animCtrl.on("stop", this.onAnimStop, this);
        animCtrl.play();
      };
      AddCoinNumView.prototype.onAnimStop = function() {
        this.node.destroy();
      };
      __decorate([ property(cc.Label) ], AddCoinNumView.prototype, "label", void 0);
      AddCoinNumView = __decorate([ ccclass ], AddCoinNumView);
      return AddCoinNumView;
    }(cc.Component);
    exports.default = AddCoinNumView;
    cc._RF.pop();
  }, {} ],
  ArcMask: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ea035EHDvxPrrn9Wg5I80Uk", "ArcMask");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ArcMask = void 0;
    var LogUtil_1 = require("../utils/LogUtil");
    var property = cc._decorator.property;
    var ccclass = cc._decorator.ccclass;
    var executeInEditMode = cc._decorator.executeInEditMode;
    var disallowMultiple = cc._decorator.disallowMultiple;
    var menu = cc._decorator.menu;
    cc.macro.ENABLE_WEBGL_ANTIALIAS = true;
    var ArcMask = function(_super) {
      __extends(ArcMask, _super);
      function ArcMask() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._startArc = 1.57;
        _this._endArc = 1.56;
        return _this;
      }
      ArcMask_1 = ArcMask;
      Object.defineProperty(ArcMask.prototype, "startArc", {
        get: function() {
          return this._startArc;
        },
        set: function(arc) {
          if (this._startArc != arc) {
            this._startArc = arc;
            this._updateGraphics();
          }
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(ArcMask.prototype, "endArc", {
        get: function() {
          return this._endArc;
        },
        set: function(arc) {
          if (this._endArc != arc) {
            this._endArc = arc;
            this._updateGraphics();
          }
        },
        enumerable: false,
        configurable: true
      });
      ArcMask.prototype._updateGraphics = function(g) {
        void 0 === g && (g = null);
        var graphics = g || this._graphics;
        if (!graphics) {
          LogUtil_1.LogUtil.info(ArcMask_1.TAG, "_updateGraphics==>graphics is null");
          return;
        }
        graphics.clear(false);
        var radius = Math.max(this.node.width, this.node.height) / 2;
        var unit_vector_start = cc.v2(Math.cos(this._startArc), Math.sin(this._startArc));
        var unit_vector_end = cc.v2(Math.cos(this._endArc), Math.sin(this._endArc));
        graphics.arc(0, 0, radius, this._startArc, this._endArc, true);
        graphics.lineTo(0, 0);
        graphics.lineTo(unit_vector_start.x * radius, unit_vector_start.y * radius);
        cc.game.renderType === cc.game.RENDER_TYPE_CANVAS ? graphics.stroke() : graphics.fill();
        graphics.close();
      };
      ArcMask.prototype.onDraw = function(graphics) {
        this._updateGraphics(graphics);
      };
      var ArcMask_1;
      ArcMask.TAG = "ArcMask";
      __decorate([ property(Number) ], ArcMask.prototype, "startArc", null);
      __decorate([ property(Number) ], ArcMask.prototype, "endArc", null);
      ArcMask = ArcMask_1 = __decorate([ ccclass(), executeInEditMode(true), disallowMultiple(true), menu("Arc\u906e\u7f69\u7ec4\u4ef6") ], ArcMask);
      return ArcMask;
    }(cc.Mask);
    exports.ArcMask = ArcMask;
    cc._RF.pop();
  }, {
    "../utils/LogUtil": "LogUtil"
  } ],
  BackpackView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7a14buBTVxJypVyjlxoTOzA", "BackpackView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var BackpackView_1;
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const BaseWindows_1 = require("../../../framework/base/BaseWindows");
    const EventConst_1 = require("../../../framework/const/EventConst");
    const ResConst_1 = require("../../../framework/const/ResConst");
    const SceneConst_1 = require("../../../framework/const/SceneConst");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const LogUtil_1 = require("../../../framework/utils/LogUtil");
    const UIUtil_1 = require("../../../framework/utils/UIUtil");
    const FortItemDetailComp_1 = require("../../comps/hall/FortItemDetailComp");
    const PropsItemDetailComp_1 = require("../../comps/hall/PropsItemDetailComp");
    const FortConst_1 = require("../../const/FortConst");
    const HallHttpConst_1 = require("../../const/HallHttpConst");
    const PropConst_1 = require("../../const/PropConst");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let BackpackView = BackpackView_1 = class BackpackView extends BaseWindows_1.BaseWindows {
      constructor() {
        super(...arguments);
        this.isClickRect = true;
        this.fortList = [];
        this.propsList = [];
        this.fortDetailComp = null;
        this.propDetailComp = null;
        this.checkIdx = 0;
        this.selectFortIdx = -1;
        this.selectPropIdx = -1;
      }
      initUI(...args) {
        super.initUI(...args);
        this.initSelfUI();
        try {
          GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetUserFortList, {
            page: 1,
            size: 10
          }, this.onFortListResp, this);
          GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetUserPropList, {
            page: 1,
            size: 10
          }, this.onPropsListResp, this);
        } catch (error) {
          LogUtil_1.LogUtil.info(BackpackView_1.TAG, `${error}`);
        }
      }
      addAllListeners() {
        super.addAllListeners();
        GameGlobal_1.GameGlobal.Eventer.addListener(EventConst_1.EventConst.EventId.REFLESH_BACK_FORT, this.onRefleshBackFort, this);
      }
      onRefleshBackFort() {
        this.fortList.length = 0;
        this.selectFortIdx = -1;
        this.fortDetailComp && this.fortDetailComp.node.removeFromParent();
        this.fortDetailComp = null;
        this.fortContent.removeAllChildren();
        GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetUserFortList, {
          page: 1,
          size: 10
        }, this.onFortListResp, this);
      }
      initSelfUI() {
        this.fortRoot.active = 0 == this.checkIdx;
        this.propsRoot.active = !this.fortRoot.active;
        for (let i = 0; i < this.container.toggleItems.length; i++) {
          let item = this.container.toggleItems[i];
          item.isChecked = this.checkIdx == i;
        }
      }
      onCheckChange(container, customEventData) {
        for (let i = 0; i < this.container.toggleItems.length; i++) {
          let item = this.container.toggleItems[i];
          if (item.isChecked) {
            this.checkIdx = i;
            break;
          }
        }
        this.fortRoot.active = 0 == this.checkIdx;
        this.propsRoot.active = !this.fortRoot.active;
        this.fortDetailRoot.active = 0 == this.checkIdx;
        this.propsDetailRoot.active = !this.fortDetailRoot.active;
      }
      onFortListResp(data) {
        if (data && 200 == data.code) {
          data = data.data;
          if (data) {
            if (data.list && data.list.length > 0) {
              this.fortList = this.fortList.concat(data.list);
              this.refleshForts();
            }
            let total = data.total ? data.total : 0;
            if (this.fortList < total) {
              let page = Math.floor(this.fortList.length / 10) + 1;
              GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetUserFortList, {
                page: page,
                size: 10
              }, this.onFortListResp, this);
            }
          }
        }
      }
      onPropsListResp(data) {
        if (data && 200 == data.code) {
          data = data.data;
          if (data) {
            if (data.list && data.list.length > 0) {
              this.propsList = this.propsList.concat(data.list);
              this.refleshProps();
            }
            let total = data.total ? data.total : 0;
            if (this.propsList < total) {
              let page = Math.floor(this.propsList.length / 10) + 1;
              GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetUserPropList, {
                page: page,
                size: 10
              }, this.onPropsListResp, this);
            }
          }
        }
      }
      refleshForts() {
        let curIdx = this.fortContent.childrenCount;
        for (let i = curIdx; i < this.fortList.length; i++) {
          let item = cc.instantiate(this.smallFortItem);
          item.addComponent(cc.Button);
          let idx = i;
          UIUtil_1.UIUtil.addClickListener(item, this.onFortItemClick.bind(this, idx, item), this);
          this.fortContent.addChild(item);
          let name = item.getChildByName("txtName");
          let num = item.getChildByName("txtCount");
          let prop = item.getChildByName("fort");
          let txtName = name.getComponent(cc.Label);
          let txtNum = num.getComponent(cc.Label);
          let sFort = prop.getComponent(cc.Sprite);
          txtName.string = this.fortList[i].name + "";
          txtNum.string = this.fortList[i].numbers + "";
          let grade = this.fortList[i].grade;
          let index = grade;
          index %= FortConst_1.default.Fort60.length;
          GameGlobal_1.GameGlobal.Resource.setFrame("", sFort, ResConst_1.ResConst.PLIST_PATH.FORTPROP, FortConst_1.default.Fort60[index]);
        }
      }
      refleshProps() {
        let curIdx = this.propsContent.childrenCount;
        for (let i = curIdx; i < this.propsList.length; i++) {
          let item = cc.instantiate(this.smallFortItem);
          item.addComponent(cc.Button);
          let idx = i;
          UIUtil_1.UIUtil.addClickListener(item, this.onPropItemClick.bind(this, idx, item), this);
          this.propsContent.addChild(item);
          let name = item.getChildByName("txtName");
          let num = item.getChildByName("txtCount");
          let fort = item.getChildByName("fort");
          let txtName = name.getComponent(cc.Label);
          let txtNum = num.getComponent(cc.Label);
          let sFort = fort.getComponent(cc.Sprite);
          txtName.string = this.propsList[i].propName + "";
          txtNum.string = this.propsList[i].propCount + "";
          let propType = this.propsList[i].propType;
          let index = propType;
          index %= PropConst_1.default.Prop60.length;
          GameGlobal_1.GameGlobal.Resource.setFrame("", sFort, ResConst_1.ResConst.PLIST_PATH.FORTPROP, PropConst_1.default.Prop60[index]);
        }
      }
      onFortItemClick(idx, item) {
        this.selectFortIdx = idx;
        for (let i = 0; i < this.fortContent.childrenCount; i++) {
          let select = this.fortContent.children[i].getChildByName("fortSelect");
          select.active = idx == i;
        }
        if (!this.fortDetailComp) {
          let node = cc.instantiate(this.detailFort);
          this.fortDetailComp = node.getComponent(FortItemDetailComp_1.default);
          this.fortDetailRoot.addChild(node);
        }
        this.fortDetailComp.init(this.fortList[idx]);
      }
      onPropItemClick(idx, item) {
        this.selectPropIdx = idx;
        for (let i = 0; i < this.propsContent.childrenCount; i++) {
          let select = this.propsContent.children[i].getChildByName("fortSelect");
          select.active = idx == i;
        }
        if (!this.propDetailComp) {
          let node = cc.instantiate(this.detailProps);
          this.propDetailComp = node.getComponent(PropsItemDetailComp_1.default);
          this.propsDetailRoot.addChild(node);
        }
        this.propDetailComp.init(this.propsList[idx]);
      }
      onUpdateClick(event, customEventData) {
        LogUtil_1.LogUtil.info(BackpackView_1.TAG, "onUpdateClick==>idx");
      }
      onBtnClick(event, customEventData) {
        if (0 == customEventData) GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.BACKPACK_VIEW); else if (1 == customEventData) {
          if (-1 != this.selectFortIdx) {
            let item = this.fortList[this.selectFortIdx];
            GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.FORT_UPDATE_VIEW, item);
          }
        } else 2 == customEventData && -1 != this.selectPropIdx && cc.director.loadScene("fish", () => {
          GameGlobal_1.GameGlobal.Viewer.initLayers();
          GameGlobal_1.GameGlobal.Scene.openScene(SceneConst_1.SceneConst.SceneType.FishGameScene);
          GameGlobal_1.GameGlobal.Eventer.dispatch(EventConst_1.EventConst.EventId.ON_SCENE_CHANGED);
        });
      }
    };
    BackpackView.TAG = "BackpackView";
    __decorate([ property(cc.Node) ], BackpackView.prototype, "fortRoot", void 0);
    __decorate([ property(cc.Node) ], BackpackView.prototype, "fortContent", void 0);
    __decorate([ property(cc.Node) ], BackpackView.prototype, "propsRoot", void 0);
    __decorate([ property(cc.Node) ], BackpackView.prototype, "propsContent", void 0);
    __decorate([ property(cc.Button) ], BackpackView.prototype, "btnUpdate", void 0);
    __decorate([ property(cc.ToggleContainer) ], BackpackView.prototype, "container", void 0);
    __decorate([ property(cc.Node) ], BackpackView.prototype, "fortDetailRoot", void 0);
    __decorate([ property(cc.Node) ], BackpackView.prototype, "propsDetailRoot", void 0);
    __decorate([ property(cc.Prefab) ], BackpackView.prototype, "smallFortItem", void 0);
    __decorate([ property(cc.Prefab) ], BackpackView.prototype, "detailFort", void 0);
    __decorate([ property(cc.Prefab) ], BackpackView.prototype, "detailProps", void 0);
    BackpackView = BackpackView_1 = __decorate([ ccclass ], BackpackView);
    exports.default = BackpackView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/EventConst": "EventConst",
    "../../../framework/const/ResConst": "ResConst",
    "../../../framework/const/SceneConst": "SceneConst",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../../framework/utils/LogUtil": "LogUtil",
    "../../../framework/utils/UIUtil": "UIUtil",
    "../../comps/hall/FortItemDetailComp": "FortItemDetailComp",
    "../../comps/hall/PropsItemDetailComp": "PropsItemDetailComp",
    "../../const/FortConst": "FortConst",
    "../../const/HallHttpConst": "HallHttpConst",
    "../../const/PropConst": "PropConst"
  } ],
  BaseClass: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "84697WOh6xBo4Laekxx+hZ5", "BaseClass");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.BaseClass = void 0;
    var BaseClass = function() {
      function BaseClass() {}
      BaseClass.prototype.checkSame = function(cls) {
        return this.hashCode == cls.hashCode;
      };
      return BaseClass;
    }();
    exports.BaseClass = BaseClass;
    cc._RF.pop();
  }, {} ],
  BaseCtrl: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c6093ZMx2FHO4IK6a2DsMdE", "BaseCtrl");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.BaseCtrl = void 0;
    var BaseModel_1 = require("./BaseModel");
    var BaseCtrl = function() {
      function BaseCtrl() {}
      BaseCtrl.prototype.init = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
      };
      BaseCtrl.prototype.initModel = function(modelClass) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) args[_i - 1] = arguments[_i];
        modelClass instanceof BaseModel_1.BaseModel ? this.model = modelClass : this.model = new modelClass(this);
        (_a = this.model).init.apply(_a, args);
      };
      return BaseCtrl;
    }();
    exports.BaseCtrl = BaseCtrl;
    cc._RF.pop();
  }, {
    "./BaseModel": "BaseModel"
  } ],
  BaseModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9caa4MWbpxO7bSpVAG8VL4F", "BaseModel");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.BaseModel = void 0;
    var BaseModel = function() {
      function BaseModel(ctrl) {
        this._ctrl = ctrl;
      }
      BaseModel.prototype.init = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
      };
      return BaseModel;
    }();
    exports.BaseModel = BaseModel;
    cc._RF.pop();
  }, {} ],
  BasePanel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "407794vDxtMCZtQrWb2Auo8", "BasePanel");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BasePanel = function(_super) {
      __extends(BasePanel, _super);
      function BasePanel() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      BasePanel.prototype.start = function() {};
      BasePanel = __decorate([ ccclass ], BasePanel);
      return BasePanel;
    }(cc.Component);
    exports.default = BasePanel;
    cc._RF.pop();
  }, {} ],
  BasePlatform: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8abe6xq6o5HLZ4DfeXbNIeD", "BasePlatform");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.BasePlatform = void 0;
    var BasePlatform = function() {
      function BasePlatform() {}
      return BasePlatform;
    }();
    exports.BasePlatform = BasePlatform;
    cc._RF.pop();
  }, {} ],
  BaseScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "97d2acy3t5OQKvioBv1NJiz", "BaseScene");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.BaseScene = void 0;
    var BaseScene = function() {
      function BaseScene() {}
      BaseScene.prototype.init = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
      };
      BaseScene.prototype.onEnter = function() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      };
      BaseScene.prototype.onExit = function() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      };
      BaseScene.checkOpen = function() {
        return true;
      };
      BaseScene.prototype.onKeyDown = function(event) {
        switch (event.keyCode) {
         case cc.macro.KEY.backspace:
         case cc.macro.KEY.escape:
          this.onBackKeyDown();
        }
      };
      BaseScene.prototype.onBackKeyDown = function() {};
      return BaseScene;
    }();
    exports.BaseScene = BaseScene;
    cc._RF.pop();
  }, {} ],
  BaseView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "51246OGkjpAl7YT8JenSEOC", "BaseView");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.BaseView = void 0;
    var ResConst_1 = require("../const/ResConst");
    var SoundConst_1 = require("../const/SoundConst");
    var GameGlobal_1 = require("../GameGlobal");
    var LogUtil_1 = require("../utils/LogUtil");
    var UIUtil_1 = require("../utils/UIUtil");
    var BaseView = function(_super) {
      __extends(BaseView, _super);
      function BaseView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.isNeedRect = false;
        _this.isClickRect = false;
        _this.isEffect = false;
        _this.isCenter = true;
        _this.isFastUpdate = false;
        _this.isSecondUpdate = false;
        _this.bCloseing = false;
        return _this;
      }
      BaseView.prototype.onLoad = function() {
        this.onEnter();
      };
      BaseView.prototype.onEnable = function() {};
      BaseView.prototype.start = function() {
        LogUtil_1.LogUtil.info("BaseView", "start==>isEffect:", this.isEffect);
        this.isEffect && this.openEffect();
        this.addAllListeners();
        this.makeFullScreen();
      };
      BaseView.prototype.onDestroy = function() {
        this.onRelease();
      };
      BaseView.prototype.onDisable = function() {
        GameGlobal_1.GameGlobal.Timer.offAllCall(this);
        GameGlobal_1.GameGlobal.Eventer.removeAllTargetEvents(this);
        GameGlobal_1.GameGlobal.Http.cancelByTarget(this);
      };
      BaseView.prototype.onRect = function() {
        if (this.isNeedRect) {
          this.rect = cc.find("rect", this.node);
          if (this.rect) this.rectSp = this.rect.getComponent(cc.Sprite); else {
            this.rect = new cc.Node("rect");
            this.rectSp = this.rect.addComponent(cc.Sprite);
            this.node.insertChild(this.rect, 0);
            var widget = this.rect.addComponent(cc.Widget);
            widget.left = widget.right = widget.top = widget.bottom = 0;
            widget.alignMode = cc.Widget.AlignMode.ON_WINDOW_RESIZE;
            widget.updateAlignment();
            GameGlobal_1.GameGlobal.Resource.setFrame("", this.rect, ResConst_1.ResConst.PLIST_PATH.FISH_GAME, "bg_black");
            this.rectSp.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            this.rectSp.type = cc.Sprite.Type.SLICED;
          }
          this.rectSp.node.color = cc.color(0, 0, 0, 255);
          this.rect.opacity = 200;
          this.rect.width = cc.winSize.width;
          this.rect.height = cc.winSize.height;
          this.rect.setPosition(new cc.Vec3(0, 0, 0));
          var blockEvent = this.rect.getComponent(cc.BlockInputEvents);
          blockEvent || this.rect.addComponent(cc.BlockInputEvents);
          UIUtil_1.UIUtil.addSpriteClickListenter(this.rect, this.onClickRect, this);
        }
      };
      BaseView.prototype.onClickRect = function() {
        if (this.isClickRect) {
          GameGlobal_1.GameGlobal.Sound.playSound(SoundConst_1.SoundConst.AudioEffectType.BTN_CLICK);
          this.isEffect ? this.closeEffect() : this.close();
        }
      };
      BaseView.prototype.addAllListeners = function() {
        this.isFastUpdate && GameGlobal_1.GameGlobal.Timer.on(this.onFastUpdate, this, 17);
        this.isSecondUpdate && GameGlobal_1.GameGlobal.Timer.on(this.onSlowUpdate, this, 1e3);
        this.onResize();
      };
      BaseView.prototype.removeAllListeners = function() {
        GameGlobal_1.GameGlobal.Timer.offAllCall(this);
        GameGlobal_1.GameGlobal.Http.cancelByTarget(this);
        this.isNeedRect && this.rect && UIUtil_1.UIUtil.removeSpriteClickListenter(this.rect, this.onClickRect, this);
      };
      BaseView.prototype.onFastUpdate = function() {};
      BaseView.prototype.onSlowUpdate = function() {};
      BaseView.prototype.onResize = function() {};
      BaseView.prototype.onEnter = function() {
        this.onRect();
      };
      BaseView.prototype.onExit = function() {};
      BaseView.prototype.onRelease = function() {
        if (this.resModule) {
          var time_1 = Date.now();
          var resId_1 = this.resModule;
          GameGlobal_1.GameGlobal.Timer.once(function() {
            GameGlobal_1.GameGlobal.Resource.releaseResByModule(resId_1, time_1);
          }, this, 3e3);
        }
      };
      BaseView.prototype.initUI = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
      };
      BaseView.prototype.updateUI = function() {};
      BaseView.prototype.show = function() {
        this.node.active = true;
        GameGlobal_1.GameGlobal.Viewer.$onViewShow(this);
      };
      BaseView.prototype.hide = function() {
        this.node.active = false;
        GameGlobal_1.GameGlobal.Viewer.$onViewHide(this);
      };
      BaseView.prototype.close = function() {
        if (this.node) {
          var node = cc.find("aniNode", this.node);
          null == node && (node = this.node);
          cc.Tween.stopAllByTarget(node);
          this.removeAllListeners();
          GameGlobal_1.GameGlobal.Viewer.$onViewClose(this);
          this.onExit();
          this.node.destroy();
        }
      };
      BaseView.prototype.openEffect = function() {
        var node = cc.find("aniNode", this.node);
        null == node && (node = this.node);
        if (node) {
          cc.Tween.stopAllByTarget(node);
          node.scale = .6;
          node.opacity = 128;
          cc.tween(node).to(.18, {
            scale: 1.05,
            opacity: 255
          }, {
            easing: "sineIn"
          }).to(.06, {
            scale: 1
          }, {
            easing: "sineOut"
          }).call(function() {
            node.opacity = 255;
          }).start();
        }
      };
      BaseView.prototype.closeEffect = function() {
        var _this = this;
        if (this.bCloseing) {
          LogUtil_1.LogUtil.info("BaseView", this.viewName, "is Closeing");
          return;
        }
        LogUtil_1.LogUtil.info("BaseView", "closeEffect");
        this.bCloseing = true;
        var node = cc.find("aniNode", this.node);
        null == node && (node = this.node);
        if (node) {
          cc.Tween.stopAllByTarget(node);
          node.scale = 1;
          node.opacity = 255;
          cc.tween(node).to(.1, {
            scale: .9
          }).call(function() {
            _this.close();
          }).start();
        }
      };
      BaseView.prototype.center = function() {};
      BaseView.prototype.makeFullScreen = function() {
        this.center();
        var widget = this.node.getComponent(cc.Widget);
        widget || (widget = this.node.addComponent(cc.Widget));
        this.node.width = cc.winSize.width;
        this.node.height = cc.winSize.height;
        widget.alignMode = cc.Widget.AlignMode.ALWAYS;
        widget.bottom = 0;
        widget.top = 0;
        widget.right = 0;
        widget.left = 0;
        widget.updateAlignment();
      };
      BaseView.checkExist = function() {
        return true;
      };
      BaseView.checkOpen = function() {
        return true;
      };
      BaseView.prototype.onPause = function() {};
      BaseView.prototype.onResume = function() {};
      Object.defineProperty(BaseView.prototype, "rectAlpha", {
        set: function(value) {
          this.rectSp.node.color = cc.color(0, 0, 0, value);
        },
        enumerable: false,
        configurable: true
      });
      return BaseView;
    }(cc.Component);
    exports.BaseView = BaseView;
    cc._RF.pop();
  }, {
    "../GameGlobal": "GameGlobal",
    "../const/ResConst": "ResConst",
    "../const/SoundConst": "SoundConst",
    "../utils/LogUtil": "LogUtil",
    "../utils/UIUtil": "UIUtil"
  } ],
  BaseWindows: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f512fKg65ZAeKoFHpZhRaLv", "BaseWindows");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.BaseWindows = void 0;
    var BaseView_1 = require("./BaseView");
    var BaseWindows = function(_super) {
      __extends(BaseWindows, _super);
      function BaseWindows() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.isEffect = true;
        _this.isNeedRect = true;
        _this.isClickRect = true;
        return _this;
      }
      BaseWindows.prototype.initUI = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        _super.prototype.initUI.apply(this, args);
        if (args.length >= 2 && args[args.length - 2] instanceof Function) {
          this.func = args[args.length - 2];
          this.obj = args[args.length - 1];
        }
      };
      BaseWindows.prototype.onCloseParams = function() {
        return [ this.viewName ];
      };
      BaseWindows.prototype.close = function() {
        _super.prototype.close.call(this);
        this.obj && this.func && this.func.call(this.obj, this.onCloseParams());
      };
      return BaseWindows;
    }(BaseView_1.BaseView);
    exports.BaseWindows = BaseWindows;
    cc._RF.pop();
  }, {
    "./BaseView": "BaseView"
  } ],
  BatteryView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "55ca7EE6s9EXpI/07GWyMM5", "BatteryView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const BaseWindows_1 = require("../../../framework/base/BaseWindows");
    const ResConst_1 = require("../../../framework/const/ResConst");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const EventManager_1 = require("../../../framework/manager/EventManager");
    const SocketManager_1 = require("../../../framework/manager/SocketManager");
    const FortConst_1 = require("../../const/FortConst");
    const ChangeBatteryItemView_1 = require("./ChangeBatteryItemView");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let BatteryView = class BatteryView extends BaseWindows_1.BaseWindows {
      constructor() {
        super(...arguments);
        this.isClickRect = true;
        this.batteryScrollView = null;
        this.batteryNode = null;
        this.nameLabel = null;
        this.icon = null;
        this.jinduBar = null;
        this.biliLabel = null;
        this.desLabel = null;
        this.enegryNode = null;
        this.fuelNode = null;
        this.fuelJinduBar = null;
        this.fuelBiliLabel = null;
        this.fortData = null;
        this.fortList = [];
        this.equmentBtn = null;
      }
      start() {
        this.batteryNode.active = false;
        GameGlobal_1.GameGlobal.Socket.sendMsg(SocketManager_1.EVENTMSG.Req_GetFortConf, {});
        EventManager_1.EventManager.getInstance().addListener(SocketManager_1.EVENTMSG.Res_GetFortConf, this.GetFortConf, this);
        EventManager_1.EventManager.getInstance().addListener(SocketManager_1.EVENTMSG.Res_ReplaceFort, this.ReplaceFortSuccess, this);
      }
      ClickEqument() {
        GameGlobal_1.GameGlobal.Socket.sendMsg(SocketManager_1.EVENTMSG.Req_ReplaceFort, {
          Id: this.fortData.id
        });
      }
      ReplaceFortSuccess() {
        GameGlobal_1.GameGlobal.Socket.sendMsg(SocketManager_1.EVENTMSG.Req_GetFortConf, {});
      }
      onDestroy() {
        EventManager_1.EventManager.getInstance().removeAllTargetEvents(this);
      }
      ClearState() {
        for (var i = 0; i < this.fortList.length; i++) this.fortList[i].ClearState();
      }
      CbClick(fortData) {
        this.fortData = fortData;
        this.ClearState();
        this.nameLabel.string = this.fortData.fort_name;
        this.enegryNode.active = false;
        this.fuelNode.active = false;
        if (0 == this.fortData.expend_type) this.enegryNode.active = true; else if (1 == this.fortData.expend_type) this.fuelNode.active = true; else if (2 == this.fortData.expend_type) {
          this.fuelNode.active = true;
          this.enegryNode.active = true;
        }
        this.desLabel.string = GameGlobal_1.GameGlobal.Lang.t("Fish.origin_type" + this.fortData.origin_type);
        cc.log(this.fortData.origin_type);
        this.biliLabel.string = this.fortData.energy + "/" + this.fortData.max_energy;
        this.jinduBar.progress = this.fortData.energy / this.fortData.max_energy;
        this.fuelBiliLabel.string = this.fortData.fuel + "/" + this.fortData.max_fuel;
        this.fuelJinduBar.progress = this.fortData.fuel / this.fortData.max_fuel;
        let grade = this.fortData.grade;
        let index = grade;
        index %= FortConst_1.default.Fort180.length;
        GameGlobal_1.GameGlobal.Resource.setFrame("", this.icon, ResConst_1.ResConst.PLIST_PATH.FORTPROP, FortConst_1.default.Fort180[index]);
        1 == fortData.use_fort ? this.equmentBtn.active = false : this.equmentBtn.active = true;
      }
      GetFortConf(data) {
        this.batteryScrollView.content.destroyAllChildren();
        this.fortList = [];
        cc.log("GetFortConf========");
        var flag = false;
        for (var i = 0; i < data.length; i++) {
          var battery = data[i];
          var batteryNode = cc.instantiate(this.batteryNode);
          batteryNode.setParent(this.batteryScrollView.content);
          var batteryItemView = batteryNode.getComponent(ChangeBatteryItemView_1.default);
          batteryItemView.Init(battery, this.CbClick.bind(this));
          1 == battery.use_fort && (flag = true);
          this.fortList.push(batteryItemView);
        }
        flag || this.fortList[0].CbClick();
      }
      CloseView() {
        GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.BATTERY_VIEW);
      }
    };
    BatteryView.TAG = "BatteryView";
    __decorate([ property(cc.ScrollView) ], BatteryView.prototype, "batteryScrollView", void 0);
    __decorate([ property(cc.Node) ], BatteryView.prototype, "batteryNode", void 0);
    __decorate([ property(cc.Label) ], BatteryView.prototype, "nameLabel", void 0);
    __decorate([ property(cc.Node) ], BatteryView.prototype, "icon", void 0);
    __decorate([ property(cc.ProgressBar) ], BatteryView.prototype, "jinduBar", void 0);
    __decorate([ property(cc.Label) ], BatteryView.prototype, "biliLabel", void 0);
    __decorate([ property(cc.Label) ], BatteryView.prototype, "desLabel", void 0);
    __decorate([ property(cc.Node) ], BatteryView.prototype, "enegryNode", void 0);
    __decorate([ property(cc.Node) ], BatteryView.prototype, "fuelNode", void 0);
    __decorate([ property(cc.ProgressBar) ], BatteryView.prototype, "fuelJinduBar", void 0);
    __decorate([ property(cc.Label) ], BatteryView.prototype, "fuelBiliLabel", void 0);
    __decorate([ property(cc.Node) ], BatteryView.prototype, "equmentBtn", void 0);
    BatteryView = __decorate([ ccclass ], BatteryView);
    exports.default = BatteryView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ResConst": "ResConst",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../../framework/manager/EventManager": "EventManager",
    "../../../framework/manager/SocketManager": "SocketManager",
    "../../const/FortConst": "FortConst",
    "./ChangeBatteryItemView": "ChangeBatteryItemView"
  } ],
  BindPhoneView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d5585Hfqq9FJq5awHc7MQwM", "BindPhoneView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var BindPhoneView_1;
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const BaseWindows_1 = require("../../../framework/base/BaseWindows");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const LogUtil_1 = require("../../../framework/utils/LogUtil");
    const UIUtil_1 = require("../../../framework/utils/UIUtil");
    const Utils_1 = require("../../../framework/utils/Utils");
    const HallConst_1 = require("../../const/HallConst");
    const HallHttpConst_1 = require("../../const/HallHttpConst");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let BindPhoneView = BindPhoneView_1 = class BindPhoneView extends BaseWindows_1.BaseWindows {
      constructor() {
        super(...arguments);
        this.isClickRect = true;
        this.timeCnt = 60;
      }
      initUI(...args) {
        super.initUI(...args);
        this.initSelfUI();
      }
      initSelfUI() {
        this.areasRoot.active = false;
        this.areasRoot.active = false;
        this.txtGetCode.node.active = true;
        this.txtTime.node.active = false;
        this.btnCode.interactable = true;
        UIUtil_1.UIUtil.setGray(this.btnCode.node, !this.btnCode.interactable, true);
        this.txtPhoneHead.string = HallConst_1.default.PhoneHeads[0] + "";
        for (let i = 0; i < HallConst_1.default.PhoneHeads.length; i++) {
          let node = cc.instantiate(this.phoneItem);
          node.addComponent(cc.Button);
          let label = node.getComponent(cc.Label);
          label.string = HallConst_1.default.PhoneHeads[i] + "";
          let idx = i;
          UIUtil_1.UIUtil.addClickListener(node, this.onPhoneItemClick.bind(this, idx), this);
          this.scrollContent.addChild(node);
        }
      }
      onPhoneItemClick(idx) {
        this.txtPhoneHead.string = HallConst_1.default.PhoneHeads[idx] + "";
        this.startPhoneAni(false);
      }
      onSendCodeResp(data) {
        LogUtil_1.LogUtil.info(BindPhoneView_1.TAG, JSON.stringify(data));
        if (null != data && 200 == data.code) {
          this.txtGetCode.node.active = false;
          this.txtTime.node.active = !this.txtGetCode.node.active;
          this.btnCode.interactable = false;
          UIUtil_1.UIUtil.setGray(this.btnCode.node, !this.btnCode.interactable, true);
          this.startTime();
          GameGlobal_1.GameGlobal.Timer.once(() => {
            this.codeInput.string = "123456";
          }, this, 2e3);
        }
      }
      onBindPhoneResp(data) {
        this.btnConfirm.interactable = true;
        UIUtil_1.UIUtil.setGray(this.btnConfirm.node, !this.btnConfirm.interactable, true);
        if (null != data && 200 == data.code) {
          GameGlobal_1.GameGlobal.TipManager.showTip("Bind phone sucess");
          GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.BIND_PHONE_VIEW);
          if (data.data && data.data.accessToken) {
            GameGlobal_1.GameGlobal.Http.token = data.data.accessToken;
            GameGlobal_1.GameGlobal.Store.setItem("token", GameGlobal_1.GameGlobal.Http.token);
            LogUtil_1.LogUtil.info(BindPhoneView_1.TAG, "Save Token:", GameGlobal_1.GameGlobal.Http.token);
          }
        } else GameGlobal_1.GameGlobal.TipManager.showTip("Bind phone Error");
      }
      onBtnClick(event, customEventData) {
        if (0 == customEventData) GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.BIND_PHONE_VIEW); else if (1 == customEventData) {
          this.areasRoot.active && this.startPhoneAni(false);
          let phone = this.phoneInput.string;
          if (Utils_1.Utils.isPhoneNumber(phone)) {
            let phone = this.phoneInput.string;
            let area = this.txtPhoneHead.string;
            area = area.replace("+", "");
            let newArea = Number.parseInt(area);
            let type = 2;
            GameGlobal_1.GameGlobal.Http.post(HallHttpConst_1.default.PostUserCode, {
              phone: phone,
              area: newArea,
              type: type
            }, this.onSendCodeResp, this);
          } else {
            let str = GameGlobal_1.GameGlobal.Lang.t("InvalidPhone");
            GameGlobal_1.GameGlobal.TipManager.showTip(str);
          }
        } else if (2 == customEventData) {
          this.areasRoot.active && this.startPhoneAni(false);
          let result = this.checkInput();
          if (1 == result) {
            let str = GameGlobal_1.GameGlobal.Lang.t("InvalidPhone");
            GameGlobal_1.GameGlobal.TipManager.showTip(str);
          } else if (2 == result) {
            let str = GameGlobal_1.GameGlobal.Lang.t("InvalidCode");
            GameGlobal_1.GameGlobal.TipManager.showTip(str);
          } else if (3 == result) {
            let str = GameGlobal_1.GameGlobal.Lang.t("InvalidPassWord");
            GameGlobal_1.GameGlobal.TipManager.showTip(str);
          } else {
            let phone = this.phoneInput.string;
            let area = this.txtPhoneHead.string.replace("+", "");
            let newArea = Number.parseInt(area);
            let code = this.codeInput.string;
            let pass = this.passWordInput.string;
            let inviteCode = this.inviteInput.string;
            this.btnConfirm.interactable = false;
            UIUtil_1.UIUtil.setGray(this.btnConfirm.node, !this.btnConfirm.interactable, true);
            GameGlobal_1.GameGlobal.Http.post(HallHttpConst_1.default.PostUserBindPhone, {
              phone: phone,
              area: newArea,
              phoneCode: code,
              pass: pass,
              invitationCode: inviteCode
            }, this.onBindPhoneResp, this);
          }
        } else 3 == customEventData ? this.startPhoneAni(!this.areasRoot.active) : 4 == customEventData && this.areasRoot.active && this.startPhoneAni(false);
      }
      onTime() {
        this.timeCnt--;
        if (this.timeCnt >= 0) this.txtTime.string = this.timeCnt + "s"; else {
          GameGlobal_1.GameGlobal.Timer.offAllCall(this);
          this.txtGetCode.node.active = true;
          this.txtTime.node.active = !this.txtGetCode.node.active;
          this.btnCode.interactable = true;
          UIUtil_1.UIUtil.setGray(this.btnCode.node, !this.btnCode.interactable, true);
        }
      }
      startTime() {
        GameGlobal_1.GameGlobal.Timer.offAllCall(this);
        this.timeCnt = 60;
        GameGlobal_1.GameGlobal.Timer.on(this.onTime, this, 1e3, -1);
      }
      onEnterBegin(event, customEventData) {
        this.areasRoot.active && this.startPhoneAni(false);
      }
      checkInput() {
        let phone = this.phoneInput.string;
        let code = this.codeInput.string;
        let pw = this.passWordInput.string;
        if (!Utils_1.Utils.isPhoneNumber(phone)) return 1;
        if (4 != code.length && 6 != code.length) return 2;
        if (pw.length < 8) return 3;
      }
      startPhoneAni(bOut) {
        this.areasRoot.active = true;
        cc.Tween.stopAllByTarget(this.areasRoot);
        if (bOut) {
          this.mask.height = 0;
          cc.tween(this.mask).to(.15, {
            height: 250
          }, {
            easing: "sineIn"
          }).start();
        } else cc.tween(this.mask).to(.15, {
          height: 0
        }, {
          easing: "sineOut"
        }).call(() => {
          this.areasRoot.active = false;
        }).start();
      }
    };
    BindPhoneView.TAG = "BindPhoneView";
    __decorate([ property(cc.EditBox) ], BindPhoneView.prototype, "codeInput", void 0);
    __decorate([ property(cc.EditBox) ], BindPhoneView.prototype, "phoneInput", void 0);
    __decorate([ property(cc.EditBox) ], BindPhoneView.prototype, "passWordInput", void 0);
    __decorate([ property(cc.EditBox) ], BindPhoneView.prototype, "inviteInput", void 0);
    __decorate([ property(cc.Prefab) ], BindPhoneView.prototype, "phoneItem", void 0);
    __decorate([ property(cc.Node) ], BindPhoneView.prototype, "areasRoot", void 0);
    __decorate([ property(cc.Node) ], BindPhoneView.prototype, "scrollContent", void 0);
    __decorate([ property(cc.Label) ], BindPhoneView.prototype, "txtPhoneHead", void 0);
    __decorate([ property(cc.Node) ], BindPhoneView.prototype, "mask", void 0);
    __decorate([ property(cc.Label) ], BindPhoneView.prototype, "txtTime", void 0);
    __decorate([ property(cc.Label) ], BindPhoneView.prototype, "txtGetCode", void 0);
    __decorate([ property(cc.Button) ], BindPhoneView.prototype, "btnCode", void 0);
    __decorate([ property(cc.Button) ], BindPhoneView.prototype, "btnConfirm", void 0);
    BindPhoneView = BindPhoneView_1 = __decorate([ ccclass ], BindPhoneView);
    exports.default = BindPhoneView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../../framework/utils/LogUtil": "LogUtil",
    "../../../framework/utils/UIUtil": "UIUtil",
    "../../../framework/utils/Utils": "Utils",
    "../../const/HallConst": "HallConst",
    "../../const/HallHttpConst": "HallHttpConst"
  } ],
  BitUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "80226L2fVNEjqxzOL5cWQ51", "BitUtil");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.BitUtil = void 0;
    var BitUtil = function() {
      function BitUtil() {}
      BitUtil.has = function(value, bit) {
        return (value & 1 << bit) > 0;
      };
      BitUtil.set = function(value, bit, state) {
        state ? value |= 1 << (255 & bit) : value &= ~(1 << (255 & bit));
        return value;
      };
      BitUtil.decoderError = function(fatal, opt_code_point) {
        fatal && console.log("\u89e3\u5305\u51fa\u9519");
        return opt_code_point || 65533;
      };
      BitUtil.encoderError = function(code_point) {
        console.log("\u5c01\u5305\u51fa\u9519:" + code_point);
      };
      BitUtil.inRange = function(a, min, max) {
        return min <= a && a <= max;
      };
      BitUtil.div = function(n, d) {
        return Math.floor(n / d);
      };
      BitUtil.decodeUTF8 = function(data) {
        var fatal = false;
        var pos = 0;
        var result = "";
        var code_point;
        var utf8_code_point = 0;
        var utf8_bytes_needed = 0;
        var utf8_bytes_seen = 0;
        var utf8_lower_boundary = 0;
        while (data.length > pos) {
          var _byte = data[pos++];
          if (_byte == this.EOF_byte) code_point = 0 != utf8_bytes_needed ? this.decoderError(fatal) : this.EOF_code_point; else if (0 == utf8_bytes_needed) if (this.inRange(_byte, 0, 127)) code_point = _byte; else {
            if (this.inRange(_byte, 194, 223)) {
              utf8_bytes_needed = 1;
              utf8_lower_boundary = 128;
              utf8_code_point = _byte - 192;
            } else if (this.inRange(_byte, 224, 239)) {
              utf8_bytes_needed = 2;
              utf8_lower_boundary = 2048;
              utf8_code_point = _byte - 224;
            } else if (this.inRange(_byte, 240, 244)) {
              utf8_bytes_needed = 3;
              utf8_lower_boundary = 65536;
              utf8_code_point = _byte - 240;
            } else this.decoderError(fatal);
            utf8_code_point *= Math.pow(64, utf8_bytes_needed);
            code_point = null;
          } else if (this.inRange(_byte, 128, 191)) {
            utf8_bytes_seen += 1;
            utf8_code_point += (_byte - 128) * Math.pow(64, utf8_bytes_needed - utf8_bytes_seen);
            if (utf8_bytes_seen !== utf8_bytes_needed) code_point = null; else {
              var cp = utf8_code_point;
              var lower_boundary = utf8_lower_boundary;
              utf8_code_point = 0;
              utf8_bytes_needed = 0;
              utf8_bytes_seen = 0;
              utf8_lower_boundary = 0;
              code_point = this.inRange(cp, lower_boundary, 1114111) && !this.inRange(cp, 55296, 57343) ? cp : this.decoderError(fatal, _byte);
            }
          } else {
            utf8_code_point = 0;
            utf8_bytes_needed = 0;
            utf8_bytes_seen = 0;
            utf8_lower_boundary = 0;
            pos--;
            code_point = this.decoderError(fatal, _byte);
          }
          if (null !== code_point && code_point !== this.EOF_code_point) if (code_point <= 65535) code_point > 0 && (result += String.fromCharCode(code_point)); else {
            code_point -= 65536;
            result += String.fromCharCode(55296 + (code_point >> 10 & 1023));
            result += String.fromCharCode(56320 + (1023 & code_point));
          }
        }
        return result;
      };
      BitUtil.encodeUTF8 = function(str) {
        var pos = 0;
        var codePoints = BitUtil.stringToCodePoints(str);
        var outputBytes = [];
        while (codePoints.length > pos) {
          var code_point = codePoints[pos++];
          if (BitUtil.inRange(code_point, 55296, 57343)) BitUtil.encoderError(code_point); else if (BitUtil.inRange(code_point, 0, 127)) outputBytes.push(code_point); else {
            var count = void 0, offset = void 0;
            if (BitUtil.inRange(code_point, 128, 2047)) {
              count = 1;
              offset = 192;
            } else if (BitUtil.inRange(code_point, 2048, 65535)) {
              count = 2;
              offset = 224;
            } else if (BitUtil.inRange(code_point, 65536, 1114111)) {
              count = 3;
              offset = 240;
            }
            outputBytes.push(BitUtil.div(code_point, Math.pow(64, count)) + offset);
            while (count > 0) {
              var temp = BitUtil.div(code_point, Math.pow(64, count - 1));
              outputBytes.push(128 + temp % 64);
              count -= 1;
            }
          }
        }
        return new Uint8Array(outputBytes);
      };
      BitUtil.UTF8ByteCount = function(str) {
        return this.encodeUTF8(str).length;
      };
      BitUtil.stringToCodePoints = function(string) {
        var cps = [];
        var i = 0, n = string.length;
        while (i < string.length) {
          var c = string.charCodeAt(i);
          if (BitUtil.inRange(c, 55296, 57343)) if (BitUtil.inRange(c, 56320, 57343)) cps.push(65533); else if (i == n - 1) cps.push(65533); else {
            var d = string.charCodeAt(i + 1);
            if (BitUtil.inRange(d, 56320, 57343)) {
              var a = 1023 & c;
              var b = 1023 & d;
              i += 1;
              cps.push(65536 + (a << 10) + b);
            } else cps.push(65533);
          } else cps.push(c);
          i += 1;
        }
        return cps;
      };
      BitUtil.EOF_byte = -1;
      BitUtil.EOF_code_point = -1;
      return BitUtil;
    }();
    exports.BitUtil = BitUtil;
    cc._RF.pop();
  }, {} ],
  BonusTortoiseView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8af061WRfVL4bQRxCiIb76K", "BonusTortoiseView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const BaseView_1 = require("../../../framework/base/BaseView");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let BonusTortoiseView = class BonusTortoiseView extends BaseView_1.BaseView {
      constructor() {
        super(...arguments);
        this.isClickRect = true;
      }
      CloseView() {
        GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.BONUSTORTOISE_VIEW);
      }
    };
    BonusTortoiseView.TAG = "BonusTortoiseView";
    BonusTortoiseView = __decorate([ ccclass ], BonusTortoiseView);
    exports.default = BonusTortoiseView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseView": "BaseView",
    "../../../framework/const/ViewConst": "ViewConst"
  } ],
  BonusTurtleRuleView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "05a92OS+RBMtq2eDyOoC8b/", "BonusTurtleRuleView");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var BaseWindows_1 = require("../../../framework/base/BaseWindows");
    var ViewConst_1 = require("../../../framework/const/ViewConst");
    var GameGlobal_1 = require("../../../framework/GameGlobal");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BonusTurtleView = function(_super) {
      __extends(BonusTurtleView, _super);
      function BonusTurtleView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.isClickRect = true;
        return _this;
      }
      BonusTurtleView.prototype.initUI = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        _super.prototype.initUI.apply(this, args);
        this.initSelfUI();
      };
      BonusTurtleView.prototype.initSelfUI = function() {};
      BonusTurtleView.prototype.onBtnClick = function(event, customEventData) {
        0 == customEventData ? GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.BONUS_TURTLE_RULE_VIEW) : 1 == customEventData;
      };
      BonusTurtleView.prototype.onEnterBegin = function(event, customEventData) {};
      BonusTurtleView.TAG = "BonusTurtleView";
      __decorate([ property(cc.Label) ], BonusTurtleView.prototype, "txtRule", void 0);
      BonusTurtleView = __decorate([ ccclass ], BonusTurtleView);
      return BonusTurtleView;
    }(BaseWindows_1.BaseWindows);
    exports.default = BonusTurtleView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ViewConst": "ViewConst"
  } ],
  BonusTurtleView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b3a782ZJiFONYGHibNdDBaQ", "BonusTurtleView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const BaseWindows_1 = require("../../../framework/base/BaseWindows");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const HallHttpConst_1 = require("../../const/HallHttpConst");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let BonusTurtleView = class BonusTurtleView extends BaseWindows_1.BaseWindows {
      constructor() {
        super(...arguments);
        this.isClickRect = true;
      }
      initUI(...args) {
        super.initUI(...args);
        GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetBonusTurtle, {}, this.onBonusTurtleResp, this);
        this.initSelfUI();
      }
      initSelfUI() {}
      onBonusTurtleResp(data) {
        if (data && 200 == data.code) {
          data = data.data;
          this.respData = data;
          let ownNorCount = data.own.normal;
          let ownAdvCount = data.own.advanced;
          let upgradeNorCount = data.normalUpgrade.normal;
          let upgradeAdvCount = data.normalUpgrade.advanced;
          let txt = GameGlobal_1.GameGlobal.Lang.t("Turtle.TxtTurtleInstrution");
          let replaceData = [ data.grade, data.dividend ];
          txt = txt.replace("{0}", data.grade);
          txt = txt.replace("{1}", data.dividend);
          this.txtMaterial.string = "baby turtle";
          this.txtCount.string = "x" + ownNorCount;
          this.txtCount1.string = ownNorCount;
          this.txtInstruction.string = txt;
          this.txtUpdateCount.string = "x" + upgradeNorCount;
        } else GameGlobal_1.GameGlobal.TipManager.showTip("Get Turtle Info Error!");
      }
      onBtnClick(event, customEventData) {
        0 == customEventData ? GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.BONUS_TURTLE_VIEW) : 1 == customEventData ? GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.BONUS_TURTLE_RULE_VIEW) : 2 == customEventData ? GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.SYNTH_GENERAL_VIEW, this.respData) : 3 == customEventData && GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.SYNTH_ADVANCE_VIEW, this.respData);
      }
      onEnterBegin(event, customEventData) {}
    };
    BonusTurtleView.TAG = "BonusTurtleView";
    __decorate([ property(cc.Label) ], BonusTurtleView.prototype, "txtMaterial", void 0);
    __decorate([ property(cc.Label) ], BonusTurtleView.prototype, "txtCount", void 0);
    __decorate([ property(cc.Label) ], BonusTurtleView.prototype, "txtCount1", void 0);
    __decorate([ property(cc.Label) ], BonusTurtleView.prototype, "txtInstruction", void 0);
    __decorate([ property(cc.Label) ], BonusTurtleView.prototype, "txtUpdateCount", void 0);
    BonusTurtleView = __decorate([ ccclass ], BonusTurtleView);
    exports.default = BonusTurtleView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../const/HallHttpConst": "HallHttpConst"
  } ],
  BoomView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c568aboQalNipnJJeUUBcPl", "BoomView");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var BoomView = function(_super) {
      __extends(BoomView, _super);
      function BoomView() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      BoomView.prototype.start = function() {
        var animCtrl = this.node.getComponent(cc.Animation);
        animCtrl.on("stop", this.onAnimStop, this);
        animCtrl.play();
      };
      BoomView.prototype.onAnimStop = function() {
        this.node.destroy();
      };
      BoomView = __decorate([ ccclass ], BoomView);
      return BoomView;
    }(cc.Component);
    exports.default = BoomView;
    cc._RF.pop();
  }, {} ],
  BulletView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "28222I2HRxNi4YN5/iPX8AR", "BulletView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.REBOUND_LINES = void 0;
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const {ccclass: ccclass, property: property} = cc._decorator;
    exports.REBOUND_LINES = {
      TOP_LINE: 1,
      LEFT_LINE: 2,
      BOTTOM_LINE: 3,
      RIGHT_LINE: 4
    };
    let BulletView = class BulletView extends cc.Component {
      constructor() {
        super(...arguments);
        this._isRebound = true;
        this._speedX = -1;
        this._speedY = -1;
        this.fort_id = null;
      }
      Init(data, angle, fort_id) {
        this.data = data;
        this.fort_id = fort_id;
        this._speed = 1e3;
        this.ChangeAngle(angle);
      }
      ChangeAngle(INDegree) {
        this.node.angle = -INDegree;
        var tmpValue = -this.node.angle;
        tmpValue = Math.PI / 180 * tmpValue;
        this._speedX = this._speed * Math.sin(tmpValue);
        this._speedY = this._speed * Math.cos(tmpValue);
      }
      Boom(boomEffectParent) {
        var pos = this.node.getPosition();
        this.CreateBoomEffect(boomEffectParent, pos);
        this.node.destroy();
      }
      CreateBoomEffect(boomEffectParent, pos) {
        return __awaiter(this, void 0, void 0, function*() {
          var boomEffectPrefab = yield GameGlobal_1.GameGlobal.getPrefabFromUrl("mainRes/prefabs/boom/" + this.fort_id);
          var flyView = cc.instantiate(boomEffectPrefab);
          flyView.setParent(boomEffectParent);
          flyView.position = pos;
        });
      }
      GetWorldPosition() {
        var pos = this.node.convertToWorldSpace(cc.v2(0, 0));
        return pos;
      }
      updateFrame(dt) {
        let boundRtn = this._isBoundary();
        boundRtn && this._isRebound && this._reboundNode(boundRtn);
        this._doMoveBullet(dt);
      }
      _calIncident() {
        let curPos = cc.v2(this.node.position.x, this.node.position.y);
        let newX = curPos.x + .1 * this._speedX;
        let newY = curPos.y + .1 * this._speedY;
        var pos = cc.v2(newX, newY).subSelf(curPos).normalizeSelf();
        return pos;
      }
      _reboundNode(INBoundValue) {
        let vecNormal = null;
        let vecIncident = null;
        INBoundValue == exports.REBOUND_LINES.TOP_LINE ? vecNormal = cc.v2(0, 1) : INBoundValue == exports.REBOUND_LINES.LEFT_LINE ? vecNormal = cc.v2(1, 0) : INBoundValue == exports.REBOUND_LINES.BOTTOM_LINE ? vecNormal = cc.v2(0, 1) : INBoundValue == exports.REBOUND_LINES.RIGHT_LINE && (vecNormal = cc.v2(1, 0));
        vecIncident = this._calIncident();
        let vecRebound = vecIncident.sub(vecNormal.mul(2 * vecIncident.dot(vecNormal)));
        let tmpRadian = vecRebound.signAngle(cc.v2(1, 0));
        let newAngle = Math.floor(cc.misc.radiansToDegrees(tmpRadian)) + 90;
        newAngle = newAngle > 360 ? newAngle - 360 : newAngle;
        this.ChangeAngle(newAngle);
      }
      _doMoveBullet(dt) {
        let curPos = this.node.position;
        let newX = curPos.x + dt * this._speedX;
        let newY = curPos.y + dt * this._speedY;
        if (this._isRebound) {
          var width = 1280;
          var heigth = 720;
          newX = Math.max(newX, -width / 2);
          newX = Math.min(newX, width / 2);
          newY = Math.max(newY, -heigth / 2);
          newY = Math.min(newY, heigth / 2);
        }
        this.node.position = cc.v3(newX, newY, 0);
      }
      _isBoundary() {
        var width = 1280;
        var heigth = 720;
        return this.node.y >= heigth / 2 ? exports.REBOUND_LINES.TOP_LINE : this.node.x <= -width / 2 ? exports.REBOUND_LINES.LEFT_LINE : this.node.y <= -heigth / 2 ? exports.REBOUND_LINES.BOTTOM_LINE : this.node.x >= width / 2 ? exports.REBOUND_LINES.RIGHT_LINE : 0;
      }
    };
    BulletView = __decorate([ ccclass ], BulletView);
    exports.default = BulletView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal"
  } ],
  BuyDetailView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c6f76vXmS9CF5NP2k7fC33+", "BuyDetailView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const BaseWindows_1 = require("../../../framework/base/BaseWindows");
    const ResConst_1 = require("../../../framework/const/ResConst");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const FortConst_1 = require("../../const/FortConst");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let BuyDetailView = class BuyDetailView extends BaseWindows_1.BaseWindows {
      constructor() {
        super(...arguments);
        this.isClickRect = true;
      }
      initUI(...args) {
        super.initUI(...args);
        this.buyFunc = args[0];
        this.target = args[1];
        let info = args[2];
        this.initSelfUI(info);
      }
      initSelfUI(info) {
        let curHave = info && info.haveOwned ? info.haveOwned : 0;
        let price = info && info.commodityPrice ? info.commodityPrice : 0;
        let power = info && info.commodityEnergy ? info.commodityEnergy : 0;
        let maxCount = info && info.maxOwned ? info.maxOwned : 0;
        let name = info && info.commodityName ? info.commodityName : "";
        let grade = info && info.commodityGrade ? info.commodityGrade : 0;
        this.txtPrice.string = price + "";
        this.txtName.string = name + "";
        this.txtPower.string = power + "";
        this.txtCurHave.string = curHave + "";
        this.txtMostHave.string = maxCount + "";
        let index = grade;
        index %= FortConst_1.default.Fort30.length;
        GameGlobal_1.GameGlobal.Resource.setFrame("", this.sIconCurHave, ResConst_1.ResConst.PLIST_PATH.FORTPROP, FortConst_1.default.Fort30[index]);
        GameGlobal_1.GameGlobal.Resource.setFrame("", this.sIconMostHave, ResConst_1.ResConst.PLIST_PATH.FORTPROP, FortConst_1.default.Fort30[index]);
        index %= FortConst_1.default.Fort60.length;
        GameGlobal_1.GameGlobal.Resource.setFrame("", this.sGoods, ResConst_1.ResConst.PLIST_PATH.FORTPROP, FortConst_1.default.Fort60[index]);
      }
      onBtnClick(event, customEventData) {
        if (0 == customEventData) GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.BUY_DETAIL_VIEW); else if (1 == customEventData) {
          let userInfo = GameGlobal_1.GameGlobal.DataManager.userInfo;
          let officiaUser = userInfo && userInfo.officia_user;
          officiaUser ? this.buyFunc && this.target && this.buyFunc.call(this.target) : GameGlobal_1.GameGlobal.TipManager.showTip("You must login!");
        }
      }
      onEnterBegin(event, customEventData) {}
    };
    BuyDetailView.TAG = "BuyDetailView";
    __decorate([ property(cc.Sprite) ], BuyDetailView.prototype, "sGoods", void 0);
    __decorate([ property(cc.Label) ], BuyDetailView.prototype, "txtName", void 0);
    __decorate([ property(cc.Label) ], BuyDetailView.prototype, "txtPrice", void 0);
    __decorate([ property(cc.Label) ], BuyDetailView.prototype, "txtPower", void 0);
    __decorate([ property(cc.Label) ], BuyDetailView.prototype, "txtCurHave", void 0);
    __decorate([ property(cc.Label) ], BuyDetailView.prototype, "txtMostHave", void 0);
    __decorate([ property(cc.Button) ], BuyDetailView.prototype, "btnBuy", void 0);
    __decorate([ property(cc.Sprite) ], BuyDetailView.prototype, "sIconCurHave", void 0);
    __decorate([ property(cc.Sprite) ], BuyDetailView.prototype, "sIconMostHave", void 0);
    BuyDetailView = __decorate([ ccclass ], BuyDetailView);
    exports.default = BuyDetailView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ResConst": "ResConst",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../const/FortConst": "FortConst"
  } ],
  BuyPropDetailView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8e355vUCbVG5YDEcaNypV5j", "BuyPropDetailView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const BaseWindows_1 = require("../../../framework/base/BaseWindows");
    const ResConst_1 = require("../../../framework/const/ResConst");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const PropConst_1 = require("../../const/PropConst");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let BuyPropDetailView = class BuyPropDetailView extends BaseWindows_1.BaseWindows {
      constructor() {
        super(...arguments);
        this.isClickRect = true;
      }
      initUI(...args) {
        super.initUI(...args);
        this.buyFunc = args[0];
        this.target = args[1];
        let info = args[2];
        this.initSelfUI(info);
      }
      initSelfUI(info) {
        let curHave = info && info.haveOwned ? info.haveOwned : 0;
        let price = info && info.commodityPrice ? info.commodityPrice : 0;
        let power = info && info.commodityEnergy ? info.commodityEnergy : 0;
        let maxCount = info && info.maxOwned ? info.maxOwned : 0;
        let name = info && info.commodityName ? info.commodityName : "";
        let image = info && info.commodityImages ? info.commodityImages : 0;
        this.txtPrice.string = price + "";
        this.txtName.string = name + "";
        this.txtPower.string = power + "";
        this.txtCurHave.string = curHave + "";
        this.txtMostHave.string = maxCount + "";
        let index = info && info.commodityType ? info.commodityType : 0;
        index %= PropConst_1.default.Prop60.length;
        GameGlobal_1.GameGlobal.Resource.setFrame("", this.sGoods, ResConst_1.ResConst.PLIST_PATH.FORTPROP, PropConst_1.default.Prop60[index]);
      }
      onBtnClick(event, customEventData) {
        if (0 == customEventData) GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.BUY_PROP_DETAIL_VIEW); else if (1 == customEventData) {
          let userInfo = GameGlobal_1.GameGlobal.DataManager.userInfo;
          let officiaUser = userInfo && userInfo.officia_user;
          officiaUser ? this.buyFunc && this.target && this.buyFunc.call(this.target) : GameGlobal_1.GameGlobal.TipManager.showTip("You must login!");
        }
      }
      onEnterBegin(event, customEventData) {}
    };
    BuyPropDetailView.TAG = "BuyPropDetailView";
    __decorate([ property(cc.Sprite) ], BuyPropDetailView.prototype, "sGoods", void 0);
    __decorate([ property(cc.Label) ], BuyPropDetailView.prototype, "txtName", void 0);
    __decorate([ property(cc.Label) ], BuyPropDetailView.prototype, "txtPrice", void 0);
    __decorate([ property(cc.Label) ], BuyPropDetailView.prototype, "txtPower", void 0);
    __decorate([ property(cc.Label) ], BuyPropDetailView.prototype, "txtCurHave", void 0);
    __decorate([ property(cc.Label) ], BuyPropDetailView.prototype, "txtMostHave", void 0);
    __decorate([ property(cc.Button) ], BuyPropDetailView.prototype, "btnBuy", void 0);
    BuyPropDetailView = __decorate([ ccclass ], BuyPropDetailView);
    exports.default = BuyPropDetailView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ResConst": "ResConst",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../const/PropConst": "PropConst"
  } ],
  CallLater: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1d6b84oO7lN15QDzAJZqaLW", "CallLater");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.CallLater = void 0;
    var TimerManager_1 = require("../manager/TimerManager");
    var LaterHandler_1 = require("./LaterHandler");
    var CallLater = function() {
      function CallLater() {
        this._pool = [];
        this._map = [];
        this._laters = [];
      }
      CallLater.prototype._update = function() {
        var e = this._laters, t = e.length;
        if (t > 0) {
          for (var i = 0, n = t - 1; i <= n; i++) {
            var s = e[i];
            this._map[s.key] = null, null !== s.method && (s.run(), s.clear()), this._pool.push(s), 
            i === n && (n = e.length - 1);
          }
          e.length = 0;
        }
      };
      CallLater.prototype._getHandler = function(e, t) {
        var i = e ? e.$_GID || (e.$_GID = TimerManager_1.TimerManager._gid++) : 0, n = t.$_TID || (t.$_TID = 1e5 * TimerManager_1.TimerManager._mid++);
        return this._map[i + n];
      };
      CallLater.prototype.callLater = function(e, t, i) {
        if (null == this._getHandler(e, t)) {
          if (this._pool.length) var n = this._pool.pop(); else n = new LaterHandler_1.LaterHandler();
          n.caller = e, n.method = t, n.args = i;
          var s = e ? e.$_GID : 0, a = t.$_TID;
          n.key = s + a, this._map[n.key] = n, this._laters.push(n);
        }
      };
      CallLater.prototype.runCallLater = function(e, t) {
        var i = this._getHandler(e, t);
        i && null != i.method && (this._map[i.key] = null, i.run(), i.clear());
      };
      return CallLater;
    }();
    exports.CallLater = CallLater;
    cc._RF.pop();
  }, {
    "../manager/TimerManager": "TimerManager",
    "./LaterHandler": "LaterHandler"
  } ],
  ChangeBatteryItemView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9d34ePOuy1BDL5W7bHFu3kl", "ChangeBatteryItemView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const ResConst_1 = require("../../../framework/const/ResConst");
    const FortConst_1 = require("../../const/FortConst");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let ChangeBatteryItemView = class ChangeBatteryItemView extends cc.Component {
      constructor() {
        super(...arguments);
        this.NameLabel = null;
        this.IconSprite = null;
        this.currentSprite = null;
        this.data = null;
        this.CbClickBack = null;
      }
      ClearState() {
        this.currentSprite.active = false;
      }
      CbClick() {
        this.CbClickBack(this.data);
        this.currentSprite.active = true;
      }
      GetTimeString(time) {
        cc.log("time:" + time);
        if (time < 0) return "0h";
        var day = parseInt((time / 86400).toFixed(0));
        time %= 86400;
        var hour = parseInt((time / 1440).toFixed(0));
        time %= 1440;
        var minutes = parseInt((time / 60).toFixed(0));
        time %= 60;
        var s = time;
        var str = day > 0 ? day + "d " : "";
        str += hour > 0 ? hour + "h " : "";
        str += minutes > 0 ? minutes + "m" : "";
        str += s > 0 ? s + "s" : "";
        cc.log("str:" + str);
        return str;
      }
      Init(data, CbClickBack) {
        this.CbClickBack = CbClickBack;
        this.data = data;
        this.ClearState();
        1 == data.use_fort && this.CbClick();
        this.node.active = true;
        this.NameLabel.string = this.GetTimeString(data.valid_time);
        let grade = data.grade;
        let index = grade;
        index %= FortConst_1.default.Fort60.length;
        GameGlobal_1.GameGlobal.Resource.setFrame("", this.IconSprite.node, ResConst_1.ResConst.PLIST_PATH.FORTPROP, FortConst_1.default.Fort60[index]);
      }
    };
    __decorate([ property(cc.Label) ], ChangeBatteryItemView.prototype, "NameLabel", void 0);
    __decorate([ property(cc.Sprite) ], ChangeBatteryItemView.prototype, "IconSprite", void 0);
    __decorate([ property(cc.Node) ], ChangeBatteryItemView.prototype, "currentSprite", void 0);
    ChangeBatteryItemView = __decorate([ ccclass ], ChangeBatteryItemView);
    exports.default = ChangeBatteryItemView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/const/ResConst": "ResConst",
    "../../const/FortConst": "FortConst"
  } ],
  ChangeHeadView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "65161Ip6fBDq5505b0jO11B", "ChangeHeadView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const BaseWindows_1 = require("../../../framework/base/BaseWindows");
    const ResConst_1 = require("../../../framework/const/ResConst");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const UIUtil_1 = require("../../../framework/utils/UIUtil");
    const HallConst_1 = require("../../const/HallConst");
    const HallHttpConst_1 = require("../../const/HallHttpConst");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let ChangeHeadView = class ChangeHeadView extends BaseWindows_1.BaseWindows {
      constructor() {
        super(...arguments);
        this.isClickRect = true;
        this.selectIdx = 0;
        this.curIdx = 0;
      }
      initUI(...args) {
        super.initUI(...args);
        let userInfo = GameGlobal_1.GameGlobal.DataManager.userInfo;
        let headIdx = Number.parseInt(userInfo.headurl);
        headIdx = isNaN(headIdx) ? 0 : headIdx % HallConst_1.default.Heads.length;
        this.selectIdx = headIdx;
        this.curIdx = headIdx;
        this.btnConfirm.interactable = this.curIdx != this.selectIdx;
        UIUtil_1.UIUtil.setGray(this.btnConfirm.node, !this.btnConfirm.interactable, true);
        this.initSelfUI(...args);
      }
      initSelfUI(...args) {
        this.headRoot.removeAllChildren();
        for (let i = 0; i < HallConst_1.default.Heads.length; i++) {
          let head = cc.instantiate(this.headPrefab);
          this.headRoot.addChild(head);
          let spriteHead = head.getChildByName("head");
          GameGlobal_1.GameGlobal.Resource.setFrame("", spriteHead, ResConst_1.ResConst.PLIST_PATH.HEAD, HallConst_1.default.Heads[i]);
          let select = head.getChildByName("select");
          let bg = head.getChildByName("bg");
          select && (select.active = i == this.selectIdx);
          bg && (bg.active = i != this.selectIdx);
          head.addComponent(cc.Button);
          let tmpIdx = i;
          UIUtil_1.UIUtil.addClickListener(head, this.onHeadItemClick.bind(this, tmpIdx), this);
        }
      }
      onHeadItemClick(idx, event, customEventData) {
        if (idx != this.selectIdx) {
          let oldHead = this.headRoot.children[this.selectIdx];
          let newHead = this.headRoot.children[idx];
          let select = oldHead.getChildByName("select");
          let bg = oldHead.getChildByName("bg");
          select && (select.active = false);
          bg && (bg.active = !select.active);
          select = newHead.getChildByName("select");
          bg = newHead.getChildByName("bg");
          select && (select.active = true);
          bg && (bg.active = !select.active);
          this.selectIdx = idx;
          this.btnConfirm.interactable = this.curIdx != this.selectIdx;
          UIUtil_1.UIUtil.setGray(this.btnConfirm.node, !this.btnConfirm.interactable, true);
        }
      }
      onBtnClick(event, customEventData) {
        if (0 == customEventData) GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.CHANGE_HEAD_VIEW); else if (1 == customEventData) {
          let userInfo = GameGlobal_1.GameGlobal.DataManager.userInfo;
          let nick = userInfo.nickname;
          this.btnConfirm.interactable = false;
          UIUtil_1.UIUtil.setGray(this.btnConfirm.node, !this.btnConfirm.interactable, true);
          GameGlobal_1.GameGlobal.Http.post(HallHttpConst_1.default.PostUserInfo, {
            headUrl: this.selectIdx,
            nickname: nick
          }, this.onModifyUserInfoResp, this);
        }
      }
      onModifyUserInfoResp(data) {
        this.btnConfirm.interactable = true;
        UIUtil_1.UIUtil.setGray(this.btnConfirm.node, !this.btnConfirm.interactable, true);
        if (data && 200 == data.code) {
          GameGlobal_1.GameGlobal.DataManager.startRefleshUser(false);
          GameGlobal_1.GameGlobal.TipManager.showTip("Change Sucess");
          GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.CHANGE_HEAD_VIEW);
        }
      }
      onEnterBegin(event, customEventData) {}
    };
    ChangeHeadView.TAG = "ChangeHeadView";
    __decorate([ property(cc.Prefab) ], ChangeHeadView.prototype, "headPrefab", void 0);
    __decorate([ property(cc.Node) ], ChangeHeadView.prototype, "headRoot", void 0);
    __decorate([ property(cc.Button) ], ChangeHeadView.prototype, "btnConfirm", void 0);
    ChangeHeadView = __decorate([ ccclass ], ChangeHeadView);
    exports.default = ChangeHeadView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ResConst": "ResConst",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../../framework/utils/UIUtil": "UIUtil",
    "../../const/HallConst": "HallConst",
    "../../const/HallHttpConst": "HallHttpConst"
  } ],
  ChangeNickView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "347c2TSwFtO9Ic1giqhLIdp", "ChangeNickView");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var BaseWindows_1 = require("../../../framework/base/BaseWindows");
    var ViewConst_1 = require("../../../framework/const/ViewConst");
    var GameGlobal_1 = require("../../../framework/GameGlobal");
    var TextUtil_1 = require("../../../framework/utils/TextUtil");
    var UIUtil_1 = require("../../../framework/utils/UIUtil");
    var HallHttpConst_1 = require("../../const/HallHttpConst");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ChangeNickView = function(_super) {
      __extends(ChangeNickView, _super);
      function ChangeNickView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.isClickRect = true;
        return _this;
      }
      ChangeNickView.prototype.initUI = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        _super.prototype.initUI.apply(this, args);
        this.initSelfUI.apply(this, args);
      };
      ChangeNickView.prototype.initSelfUI = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        var userInfo = GameGlobal_1.GameGlobal.DataManager.userInfo;
        var curNick = userInfo && userInfo.nickname ? userInfo.nickname : "";
        this.btnConfirm.interactable = false;
        UIUtil_1.UIUtil.setGray(this.btnConfirm.node, !this.btnConfirm.interactable, true);
        this.nickInput.placeholderLabel.string = curNick;
      };
      ChangeNickView.prototype.onBtnClick = function(event, customEventData) {
        if (0 == customEventData) GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.CHANGE_NICK_VIEW); else if (1 == customEventData) if (0 == this.checkInput()) {
          var userInfo = GameGlobal_1.GameGlobal.DataManager.userInfo;
          var headUrl = TextUtil_1.TextUtil.isEmpty(userInfo.headurl) ? 0 : userInfo.headurl;
          this.btnConfirm.interactable = false;
          var nick = this.nickInput.string;
          UIUtil_1.UIUtil.setGray(this.btnConfirm.node, !this.btnConfirm.interactable, true);
          GameGlobal_1.GameGlobal.Http.post(HallHttpConst_1.default.PostUserInfo, {
            headUrl: headUrl,
            nickname: nick
          }, this.onModifyUserInfoResp, this);
        } else {
          var str = GameGlobal_1.GameGlobal.Lang.t("InvalidNick");
          GameGlobal_1.GameGlobal.TipManager.showTip(str);
        }
      };
      ChangeNickView.prototype.onModifyUserInfoResp = function(data) {
        this.btnConfirm.interactable = true;
        UIUtil_1.UIUtil.setGray(this.btnConfirm.node, !this.btnConfirm.interactable, true);
        if (data && 200 == data.code) {
          GameGlobal_1.GameGlobal.DataManager.startRefleshUser(false);
          GameGlobal_1.GameGlobal.TipManager.showTip("Change Sucess");
          GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.CHANGE_NICK_VIEW);
        }
      };
      ChangeNickView.prototype.onEnterBegin = function(event, customEventData) {};
      ChangeNickView.prototype.onEnterChange = function(event, customEventData) {
        var nick = this.nickInput.string;
        var userInfo = GameGlobal_1.GameGlobal.DataManager.userInfo;
        var curNick = userInfo && userInfo.nickname ? userInfo.nickname : "";
        if (0 == this.checkInput() && nick != curNick) {
          this.btnConfirm.interactable = true;
          UIUtil_1.UIUtil.setGray(this.btnConfirm.node, !this.btnConfirm.interactable, true);
        }
      };
      ChangeNickView.prototype.checkInput = function() {
        var nick = this.nickInput.string;
        if (nick.length < 4) return 1;
        return 0;
      };
      ChangeNickView.TAG = "ChangeNickView";
      __decorate([ property(cc.EditBox) ], ChangeNickView.prototype, "nickInput", void 0);
      __decorate([ property(cc.Button) ], ChangeNickView.prototype, "btnConfirm", void 0);
      ChangeNickView = __decorate([ ccclass ], ChangeNickView);
      return ChangeNickView;
    }(BaseWindows_1.BaseWindows);
    exports.default = ChangeNickView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../../framework/utils/TextUtil": "TextUtil",
    "../../../framework/utils/UIUtil": "UIUtil",
    "../../const/HallHttpConst": "HallHttpConst"
  } ],
  ChangePassWordView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "36d0dm+EQpIRKFTZmcyZ0jJ", "ChangePassWordView");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var BaseWindows_1 = require("../../../framework/base/BaseWindows");
    var ViewConst_1 = require("../../../framework/const/ViewConst");
    var GameGlobal_1 = require("../../../framework/GameGlobal");
    var LogUtil_1 = require("../../../framework/utils/LogUtil");
    var UIUtil_1 = require("../../../framework/utils/UIUtil");
    var HallHttpConst_1 = require("../../const/HallHttpConst");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ChangePassWordView = function(_super) {
      __extends(ChangePassWordView, _super);
      function ChangePassWordView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.isClickRect = true;
        _this.timeCnt = 60;
        return _this;
      }
      ChangePassWordView_1 = ChangePassWordView;
      ChangePassWordView.prototype.initUI = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        _super.prototype.initUI.apply(this, args);
        this.initSelfUI();
      };
      ChangePassWordView.prototype.initSelfUI = function() {
        this.txtGetCode.node.active = true;
        this.txtTime.node.active = false;
        this.btnCode.interactable = true;
        var userInfo = GameGlobal_1.GameGlobal.DataManager.userInfo;
        var phone = userInfo && userInfo.phone ? userInfo.phone : "";
        this.txtPhone.string = phone;
        UIUtil_1.UIUtil.setGray(this.btnCode.node, !this.btnCode.interactable, true);
      };
      ChangePassWordView.prototype.onBtnClick = function(event, customEventData) {
        if (0 == customEventData) GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.CHANGE_PASSWORD_VIEW); else if (1 == customEventData) {
          this.txtGetCode.node.active = false;
          this.txtTime.node.active = !this.txtGetCode.node.active;
          this.btnCode.interactable = false;
          UIUtil_1.UIUtil.setGray(this.btnCode.node, !this.btnCode.interactable, true);
          var userInfo = GameGlobal_1.GameGlobal.DataManager.userInfo;
          var phone = userInfo && userInfo.phone ? userInfo.phone : "";
          var area = userInfo && userInfo.area ? userInfo.area : "+86";
          area = area.replace("+", "");
          var newArea = Number.parseInt(area);
          var type = 1;
          GameGlobal_1.GameGlobal.Http.post(HallHttpConst_1.default.PostUserCode, {
            phone: phone,
            area: newArea,
            type: type
          }, this.onSendCodeResp, this);
        } else if (2 == customEventData) {
          var result = this.checkInput();
          if (1 == result) {
            var str = GameGlobal_1.GameGlobal.Lang.t("InvalidCode");
            GameGlobal_1.GameGlobal.TipManager.showTip(str);
          } else if (2 == result) {
            var str = GameGlobal_1.GameGlobal.Lang.t("InvalidPassWord");
            GameGlobal_1.GameGlobal.TipManager.showTip(str);
          } else if (0 == result) {
            var userInfo = GameGlobal_1.GameGlobal.DataManager.userInfo;
            var phone = userInfo && userInfo.phone ? userInfo.phone : "";
            var area = userInfo && userInfo.area ? userInfo.area : "+86";
            area = area.replace("+", "");
            var newArea = Number.parseInt(area);
            var code = this.codeInput.string;
            var pass = this.passWordInput.string;
            this.btnConfirm.interactable = false;
            UIUtil_1.UIUtil.setGray(this.btnConfirm.node, !this.btnConfirm.interactable, true);
            GameGlobal_1.GameGlobal.Http.post(HallHttpConst_1.default.PostUserPas, {
              phone: phone,
              area: newArea,
              messageCode: code,
              pass: pass
            }, this.onChangePasswordResp, this);
          }
        }
      };
      ChangePassWordView.prototype.onEnterBegin = function(event, customEventData) {};
      ChangePassWordView.prototype.onTime = function() {
        this.timeCnt--;
        if (this.timeCnt >= 0) this.txtTime.string = this.timeCnt + "s"; else {
          GameGlobal_1.GameGlobal.Timer.offAllCall(this);
          this.txtGetCode.node.active = true;
          this.txtTime.node.active = !this.txtGetCode.node.active;
          this.btnCode.interactable = true;
          UIUtil_1.UIUtil.setGray(this.btnCode.node, !this.btnCode.interactable, true);
        }
      };
      ChangePassWordView.prototype.onSendCodeResp = function(data) {
        var _this = this;
        LogUtil_1.LogUtil.info(ChangePassWordView_1.TAG, JSON.stringify(data));
        if (null != data && 200 == data.code) {
          this.txtGetCode.node.active = false;
          this.txtTime.node.active = !this.txtGetCode.node.active;
          this.btnCode.interactable = false;
          UIUtil_1.UIUtil.setGray(this.btnCode.node, !this.btnCode.interactable, true);
          this.startTime();
          GameGlobal_1.GameGlobal.Timer.once(function() {
            _this.codeInput.string = "123456";
          }, this, 2e3);
        }
      };
      ChangePassWordView.prototype.onChangePasswordResp = function(data) {
        this.btnConfirm.interactable = true;
        UIUtil_1.UIUtil.setGray(this.btnConfirm.node, !this.btnConfirm.interactable, true);
        if (null != data && 200 == data.code) {
          GameGlobal_1.GameGlobal.TipManager.showTip("Change password sucess");
          GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.CHANGE_PASSWORD_VIEW);
        }
      };
      ChangePassWordView.prototype.startTime = function() {
        GameGlobal_1.GameGlobal.Timer.offAllCall(this);
        this.timeCnt = 60;
        GameGlobal_1.GameGlobal.Timer.on(this.onTime, this, 1e3, -1);
      };
      ChangePassWordView.prototype.checkInput = function() {
        var code = this.codeInput.string;
        var pw = this.passWordInput.string;
        if (4 != code.length && 6 != code.length) return 1;
        if (pw.length < 8) return 2;
        return 0;
      };
      var ChangePassWordView_1;
      ChangePassWordView.TAG = "ChangePassWordView";
      __decorate([ property(cc.EditBox) ], ChangePassWordView.prototype, "codeInput", void 0);
      __decorate([ property(cc.EditBox) ], ChangePassWordView.prototype, "passWordInput", void 0);
      __decorate([ property(cc.Label) ], ChangePassWordView.prototype, "txtPhone", void 0);
      __decorate([ property(cc.Label) ], ChangePassWordView.prototype, "txtTime", void 0);
      __decorate([ property(cc.Label) ], ChangePassWordView.prototype, "txtGetCode", void 0);
      __decorate([ property(cc.Button) ], ChangePassWordView.prototype, "btnCode", void 0);
      __decorate([ property(cc.Button) ], ChangePassWordView.prototype, "btnConfirm", void 0);
      ChangePassWordView = ChangePassWordView_1 = __decorate([ ccclass ], ChangePassWordView);
      return ChangePassWordView;
    }(BaseWindows_1.BaseWindows);
    exports.default = ChangePassWordView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../../framework/utils/LogUtil": "LogUtil",
    "../../../framework/utils/UIUtil": "UIUtil",
    "../../const/HallHttpConst": "HallHttpConst"
  } ],
  CoinFlyToSeat: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ad576CbXNVIEphRQ4um8xeg", "CoinFlyToSeat");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var CoinFlyToSeat = function(_super) {
      __extends(CoinFlyToSeat, _super);
      function CoinFlyToSeat() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.startPoint = null;
        _this.endPoint = null;
        _this.coinPrefab = null;
        _this.coinPool = null;
        _this.parentNode = null;
        return _this;
      }
      CoinFlyToSeat.prototype.init = function(startPoint, endPoint, parentNode, count) {
        void 0 === count && (count = 20);
        this.startPoint = startPoint;
        this.parentNode = parentNode;
        this.endPoint = endPoint;
        this.coinPool = new cc.NodePool();
        this.playAnim(count);
      };
      CoinFlyToSeat.prototype.initCoinPool = function(count) {
        for (var i = 0; i < count; i++) {
          var coin = cc.instantiate(this.coinPrefab);
          this.coinPool.put(coin);
        }
      };
      CoinFlyToSeat.prototype.playAnim = function(count) {
        this.playCoinFlyAnim(count, this.startPoint, this.endPoint);
      };
      CoinFlyToSeat.prototype.playCoinFlyAnim = function(count, stPos, edPos, r) {
        var _this = this;
        void 0 === r && (r = 130);
        cc.log("playCoinFlyAnim:" + count + stPos + edPos);
        var poolSize = this.coinPool.size();
        var reCreateCoinCount = poolSize > count ? 0 : count - poolSize;
        this.initCoinPool(reCreateCoinCount);
        var points = this.getCirclePoints(r, stPos, count);
        var coinNodeList = points.map(function(pos) {
          var coin = _this.coinPool.get();
          _this.parentNode.addChild(coin);
          coin.setPosition(stPos);
          return {
            node: coin,
            stPos: stPos,
            mdPos: pos,
            edPos: edPos,
            dis: pos.sub(edPos).mag()
          };
        });
        coinNodeList = coinNodeList.sort(function(a, b) {
          if (a.dis - b.dis > 0) return 1;
          if (a.dis - b.dis < 0) return -1;
          return 0;
        });
        var index = coinNodeList.length;
        var completeIndex = 0;
        coinNodeList.forEach(function(item, idx) {
          item.node.runAction(cc.sequence(cc.moveTo(.2, item.mdPos), cc.delayTime(.01 * idx), cc.moveTo(.5, item.edPos), cc.callFunc(function() {
            _this.coinPool.put(item.node);
            completeIndex++;
            if (completeIndex == index) {
              cc.log("\u5b8c\u6210\u98de\u884c----------");
              _this.node.destroy();
            }
          })));
        });
      };
      CoinFlyToSeat.prototype.getCirclePoints = function(r, pos, count, randomScope) {
        void 0 === randomScope && (randomScope = 60);
        var points = [];
        var radians = Math.PI / 180 * Math.round(360 / count);
        for (var i = 0; i < count; i++) {
          var x = pos.x + r * Math.sin(radians * i);
          var y = pos.y + r * Math.cos(radians * i);
          points.unshift(cc.v3(x + Math.random() * randomScope, y + Math.random() * randomScope, 0));
        }
        return points;
      };
      __decorate([ property(cc.Prefab) ], CoinFlyToSeat.prototype, "coinPrefab", void 0);
      CoinFlyToSeat = __decorate([ ccclass ], CoinFlyToSeat);
      return CoinFlyToSeat;
    }(cc.Component);
    exports.default = CoinFlyToSeat;
    cc._RF.pop();
  }, {} ],
  CommonTipsView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7e9009yUPRCtqUFFOUEtETE", "CommonTipsView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const BaseWindows_1 = require("../../../framework/base/BaseWindows");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let CommonTipsView = class CommonTipsView extends BaseWindows_1.BaseWindows {
      constructor() {
        super(...arguments);
        this.isClickRect = true;
      }
      initUI(...args) {
        cc.log(args);
        super.initUI(...args);
        let content = args.length > 0 ? args[0] : "";
        this.onOkFunc = args.length > 1 ? args[1] : null;
        this.onCanncelFunc = args.length > 2 ? args[2] : null;
        this.thisObj = args.length > 3 ? args[3] : null;
        this.initSelfUI(content);
      }
      initSelfUI(content) {
        this.txtTipsContent.string = content;
      }
      onBtnClick(event, customEventData) {
        GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.EXIT_TIPS_VIEW);
        0 == customEventData ? this.onCanncelFunc && this.onCanncelFunc.call(this.thisObj) : 1 == customEventData ? this.onCanncelFunc && this.onCanncelFunc.call(this.thisObj) : 2 == customEventData && this.onOkFunc && this.onOkFunc.call(this.thisObj);
      }
      onEnterBegin(event, customEventData) {}
    };
    CommonTipsView.TAG = "CommonTipsView";
    __decorate([ property(cc.Label) ], CommonTipsView.prototype, "txtTipsContent", void 0);
    CommonTipsView = __decorate([ ccclass ], CommonTipsView);
    exports.default = CommonTipsView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ViewConst": "ViewConst"
  } ],
  ConfigConst: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e802a3v7ddCC7XMCSGka9XQ", "ConfigConst");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ConfigConst = void 0;
    var ConfigConst = function() {
      function ConfigConst() {}
      ConfigConst.ConfigName = {
        Sound: "",
        KEY_CONFIG: "IdiomConfig"
      };
      return ConfigConst;
    }();
    exports.ConfigConst = ConfigConst;
    cc._RF.pop();
  }, {} ],
  ConfigManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1807axmKQ9FKL6Au7RmZXUV", "ConfigManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ConfigManager = void 0;
    var Singleton_1 = require("../base/Singleton");
    var GameGlobal_1 = require("../GameGlobal");
    var XXTEA_1 = require("../utils/crypt/XXTEA");
    var LogUtil_1 = require("../utils/LogUtil");
    var ConfigManager = function(_super) {
      __extends(ConfigManager, _super);
      function ConfigManager() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._allConfigData = {};
        return _this;
      }
      ConfigManager.getInstance = function() {
        return _super.getInstance.call(this);
      };
      ConfigManager.prototype.init = function() {
        this._allCfgData = null;
        this._allConfigData = {};
      };
      ConfigManager.prototype.loadConfig = function(callback, target) {
        var _this = this;
        cc.loader.loadRes("config/config", function(err, data) {
          if (null == err) {
            data = XXTEA_1.XXTEA.decrypt(new Uint8Array(data._nativeAsset), "a1b2c3d4");
            JSZip.loadAsync(data).then(function(zipdata) {
              return zipdata.file("config.json").async("text");
            }).then(function(text) {
              _this.parseConfig(text);
              callback && callback.call(target);
            });
          } else console.log("\u52a0\u8f7d\u914d\u7f6e\u9519\u8bef");
        });
      };
      ConfigManager.prototype.loadConfigEx = function(callback, target) {
        var _this = this;
        LogUtil_1.LogUtil.info(ConfigManager.TAG, "loadConfigEx");
        GameGlobal_1.GameGlobal.Resource.loadRes("mainRes/datas/configure", cc.JsonAsset, null, function(error, asset) {
          if (!error) {
            var tmpData = asset.json;
            for (var key in tmpData) {
              var value = tmpData[key];
              "string" == typeof value && (value = JSON.parse(value));
              _this._allConfigData[key] = value;
            }
          }
          callback && callback.call(target);
        });
      };
      ConfigManager.prototype.parseConfig = function(data) {
        this._allCfgData = {};
        if ("object" == typeof data) for (var key in data) this._allCfgData[key] = data[key]; else if ("string" == typeof data) {
          data = JSON.parse(data);
          for (var key in data) this._allCfgData[key] = data[key];
        }
      };
      ConfigManager.prototype.getConfig = function(cfgName) {
        var cfgData = this._allConfigData && this._allConfigData[cfgName];
        return cfgData;
      };
      ConfigManager.TAG = "ConfigManager";
      return ConfigManager;
    }(Singleton_1.Singleton);
    exports.ConfigManager = ConfigManager;
    cc._RF.pop();
  }, {
    "../GameGlobal": "GameGlobal",
    "../base/Singleton": "Singleton",
    "../utils/LogUtil": "LogUtil",
    "../utils/crypt/XXTEA": "XXTEA"
  } ],
  CustomMask: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "68276JWWFxIxLGAl8HvPzOu", "CustomMask");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.CustomMask = void 0;
    var LogUtil_1 = require("../utils/LogUtil");
    var ccclass = cc._decorator.ccclass;
    var executeInEditMode = cc._decorator.executeInEditMode;
    var disallowMultiple = cc._decorator.disallowMultiple;
    var menu = cc._decorator.menu;
    cc.macro.ENABLE_WEBGL_ANTIALIAS = true;
    var CustomMask = function(_super) {
      __extends(CustomMask, _super);
      function CustomMask() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._heightLights = [];
        return _this;
      }
      CustomMask_1 = CustomMask;
      CustomMask.prototype.setHightLights = function(ns) {
        cc.Mask.Type.ELLIPSE;
        this._heightLights = [].concat(ns);
        this._updateGraphics();
      };
      CustomMask.prototype._updateGraphics = function() {
        var graphics = this._graphics;
        if (!graphics) {
          LogUtil_1.LogUtil.info(CustomMask_1.TAG, "_updateGraphics==>graphics is null");
          return;
        }
        graphics.clear(false);
        for (var i = 0; i < this._heightLights.length; i++) {
          var node = this._heightLights[i];
          var pos = node.convertToWorldSpaceAR(new cc.Vec3());
          pos = this.node.convertToNodeSpaceAR(pos);
          var width = node.width;
          var height = node.height;
          var x = pos.x - width * node.anchorX;
          var y = pos.y - height * node.anchorY;
          graphics.rect(x, y, width, height);
          cc.game.renderType === cc.game.RENDER_TYPE_CANVAS ? graphics.stroke() : graphics.fill();
          graphics.close();
        }
      };
      CustomMask.prototype.onDraw = function(graphics) {
        this._heightLights && this._heightLights.length || (this._heightLights = [ this.node ]);
        graphics.clear(false);
        for (var i = 0; i < this._heightLights.length; i++) {
          var node = this._heightLights[i];
          var pos = node.convertToWorldSpaceAR(new cc.Vec3());
          pos = this.node.convertToNodeSpaceAR(pos);
          var width = node.width;
          var height = node.height;
          var x = pos.x - width * node.anchorX;
          var y = pos.y - height * node.anchorY;
          graphics.rect(x, y, width, height);
          graphics.circle;
          cc.game.renderType === cc.game.RENDER_TYPE_CANVAS ? graphics.stroke() : graphics.fill();
        }
      };
      var CustomMask_1;
      CustomMask.TAG = "CustomMask";
      CustomMask = CustomMask_1 = __decorate([ ccclass(), executeInEditMode(true), disallowMultiple(true), menu("\u81ea\u5b9a\u4e49\u906e\u7f69\u7ec4\u4ef6") ], CustomMask);
      return CustomMask;
    }(cc.Mask);
    exports.CustomMask = CustomMask;
    cc._RF.pop();
  }, {
    "../utils/LogUtil": "LogUtil"
  } ],
  Dictionary: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "950b955x71PGYFgQqkkxk6a", "Dictionary");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Dictionary = void 0;
    var Dictionary = function() {
      function Dictionary(isCache) {
        void 0 === isCache && (isCache = false);
        this.keys = [];
        this.values = [];
        this.isCache = isCache;
      }
      Object.defineProperty(Dictionary.prototype, "count", {
        get: function() {
          return this.Count();
        },
        enumerable: false,
        configurable: true
      });
      Dictionary.prototype.Add = function(key, value) {
        this.isCache && (this[key] = value);
        this.keys.push(key);
        return this.values.push(value);
      };
      Dictionary.prototype.Remove = function(key) {
        var index = this.keys.indexOf(key, 0);
        this.keys.splice(index, 1);
        this.values.splice(index, 1);
        this.isCache && delete this[key];
      };
      Dictionary.prototype.Count = function() {
        return this.keys.length;
      };
      Dictionary.prototype.SetDicValue = function(key, value) {
        var index = this.keys.indexOf(key, 0);
        if (-1 != index) {
          this.keys[index] = key;
          this.values[index] = value;
          this.isCache && (this[key] = value);
        } else this.Add(key, value);
      };
      Dictionary.prototype.TryGetValue = function(key) {
        var index = this.keys.indexOf(key, 0);
        if (-1 != index) return this.values[index];
        return null;
      };
      Dictionary.prototype.ContainsKey = function(key) {
        var ks = this.keys;
        for (var i = 0; i < ks.length; ++i) if (ks[i] == key) return true;
        return false;
      };
      Dictionary.prototype.GetKeys = function() {
        return this.keys;
      };
      Dictionary.prototype.GetValues = function() {
        return this.values;
      };
      return Dictionary;
    }();
    exports.Dictionary = Dictionary;
    cc._RF.pop();
  }, {} ],
  DividedTurtleView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "54d32EPK1lOC7T0XMlezBpk", "DividedTurtleView");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var BaseView_1 = require("../../../framework/base/BaseView");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var DividedTurtleView = function(_super) {
      __extends(DividedTurtleView, _super);
      function DividedTurtleView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.isClickRect = false;
        _this.closeBtn = null;
        return _this;
      }
      DividedTurtleView.prototype.CloseView = function() {};
      __decorate([ property(cc.Button) ], DividedTurtleView.prototype, "closeBtn", void 0);
      DividedTurtleView = __decorate([ ccclass ], DividedTurtleView);
      return DividedTurtleView;
    }(BaseView_1.BaseView);
    exports.default = DividedTurtleView;
    cc._RF.pop();
  }, {
    "../../../framework/base/BaseView": "BaseView"
  } ],
  EmailView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "39fbcz8VbJNj4f361QJlBCB", "EmailView");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var BaseWindows_1 = require("../../../framework/base/BaseWindows");
    var ViewConst_1 = require("../../../framework/const/ViewConst");
    var GameGlobal_1 = require("../../../framework/GameGlobal");
    var Utils_1 = require("../../../framework/utils/Utils");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var EmailView = function(_super) {
      __extends(EmailView, _super);
      function EmailView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.isClickRect = true;
        return _this;
      }
      EmailView.prototype.initUI = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        _super.prototype.initUI.apply(this, args);
        this.initSelfUI();
      };
      EmailView.prototype.initSelfUI = function() {
        var count = Utils_1.Utils.randomInt(10, 5);
        for (var i = 0; i < count; i++) {
          var node = cc.instantiate(this.fortItem);
          this.fortContent.addChild(node);
        }
        count = Utils_1.Utils.randomInt(10, 5);
        for (var i = 0; i < count; i++) {
          var node = cc.instantiate(this.limmiteGoodsItem);
          this.limmiteGoodsContent.addChild(node);
        }
        count = Utils_1.Utils.randomInt(10, 5);
        for (var i = 0; i < count; i++) {
          var node = cc.instantiate(this.toolItem);
          this.toolContent.addChild(node);
        }
      };
      EmailView.prototype.onBtnClick = function(event, customEventData) {
        0 == customEventData && GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.SHOP_VIEW);
      };
      EmailView.prototype.onPageChange = function(event, customEventData) {
        var pageIdx = this.pageView.getCurrentPageIndex();
        this.toggleGroup.toggleItems[pageIdx].isChecked = true;
      };
      EmailView.prototype.onCheckChange = function(event, customEventData) {
        this.toggleGroup.toggleItems;
        0 == customEventData ? this.pageView.scrollToPage(0, .5) : 1 == customEventData ? this.pageView.scrollToPage(1, .5) : 2 == customEventData && this.pageView.scrollToPage(2, .5);
      };
      EmailView.TAG = "EmailView";
      __decorate([ property(cc.Label) ], EmailView.prototype, "txtCoin", void 0);
      __decorate([ property(cc.Node) ], EmailView.prototype, "fortContent", void 0);
      __decorate([ property(cc.Node) ], EmailView.prototype, "limmiteGoodsContent", void 0);
      __decorate([ property(cc.Node) ], EmailView.prototype, "toolContent", void 0);
      __decorate([ property(require("NestablePageView_Outer")) ], EmailView.prototype, "pageView", void 0);
      __decorate([ property(cc.ToggleContainer) ], EmailView.prototype, "toggleGroup", void 0);
      __decorate([ property(cc.Prefab) ], EmailView.prototype, "fortItem", void 0);
      __decorate([ property(cc.Prefab) ], EmailView.prototype, "limmiteGoodsItem", void 0);
      __decorate([ property(cc.Prefab) ], EmailView.prototype, "toolItem", void 0);
      EmailView = __decorate([ ccclass ], EmailView);
      return EmailView;
    }(BaseWindows_1.BaseWindows);
    exports.default = EmailView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../../framework/utils/Utils": "Utils",
    NestablePageView_Outer: "NestablePageView_Outer"
  } ],
  EventConst: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a6c27TocvpFn4AXcCDtjavf", "EventConst");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.EventConst = void 0;
    class EventConst {}
    exports.EventConst = EventConst;
    EventConst.Event = {
      GAME_START: 0
    };
    EventConst.EventId = {
      INIT_DATA_LOADED: 101,
      FIRST_WEB_SOCKET_TIME_OUT: 102,
      TEST_EVENT: 103,
      ON_APP_SHOW: 104,
      ON_NETWORK_CONNECT: 105,
      HIDE_NET_LOADING: 106,
      SHOW_NET_LOADING: 107,
      SHOW_WAITING: 108,
      HIDE_WAITING: 109,
      SHOW_SHAREDDIALOG: 110,
      HIDE_SHAREDDIALOG: 111,
      SHOW_TIPS: 112,
      SHOW_GETMONEYTIPS: 113,
      ACTIVESCENE: 114,
      PUSH_TO_POPUPSEQ: 115,
      SHIFT_FROM_POPUPSEQ: 116,
      ON_SCENE_CHANGED: 117,
      REFLESH_USER_INFO: 1e3,
      TOKEN_EXPIRATTION: 1001,
      REFLESH_BACK_FORT: 1002,
      REFLESH_YLB_MYCOINN: 1003
    };
    cc._RF.pop();
  }, {} ],
  EventManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e3501Bz/2NG7aoqTowhds7C", "EventManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.EventManager = void 0;
    var Singleton_1 = require("../base/Singleton");
    var LogUtil_1 = require("../utils/LogUtil");
    var EventManager = function(_super) {
      __extends(EventManager, _super);
      function EventManager() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      EventManager.getInstance = function() {
        return _super.getInstance.call(this);
      };
      EventManager.prototype.init = function() {
        this._callbackDict = {};
      };
      EventManager.prototype.addListener = function(msgKey, callFunc, callObj) {
        msgKey = "" + msgKey;
        var callbackList = this._callbackDict[msgKey];
        if (null == callbackList) {
          callbackList = new Array();
          this._callbackDict[msgKey] = callbackList;
        }
        for (var i = 0; i < callbackList.length; i++) {
          var callItem = callbackList[i];
          if (callItem[0] == callFunc && callItem[1] == callObj) {
            LogUtil_1.LogUtil.warn("GameMessager", "ignore same listener: " + msgKey);
            return;
          }
        }
        callbackList.push([ callFunc, callObj ]);
      };
      EventManager.prototype.removeAllTargetEvents = function(callObj) {
        for (var msgKey in this._callbackDict) {
          var callbackList = this._callbackDict[msgKey];
          for (var i = callbackList.length - 1; i >= 0; i--) {
            var callItem = callbackList[i];
            callItem[1] == callObj && callbackList.splice(i, 1);
          }
        }
      };
      EventManager.prototype.removeListener = function(msgKey, callFunc, callObj) {
        msgKey = "" + msgKey;
        var callbackList = this._callbackDict[msgKey];
        if (callbackList) {
          for (var i = 0; i < callbackList.length; i++) {
            var callItem = callbackList[i];
            if (callItem[0] == callFunc && callItem[1] == callObj) {
              callbackList.splice(i, 1);
              break;
            }
          }
          0 == callbackList.length && delete this._callbackDict[msgKey];
        }
      };
      EventManager.prototype.removeAllListener = function(exceptList) {
        exceptList = exceptList || [];
        for (var msgKey in this._callbackDict) {
          var exceptFlag = false;
          for (var _i = 0, exceptList_1 = exceptList; _i < exceptList_1.length; _i++) {
            var excKey = exceptList_1[_i];
            if (excKey.toString() == msgKey) {
              exceptFlag = true;
              break;
            }
          }
          exceptFlag || delete this._callbackDict[msgKey];
        }
      };
      EventManager.prototype.dispatch = function(msgKey) {
        var msgDatas = [];
        for (var _i = 1; _i < arguments.length; _i++) msgDatas[_i - 1] = arguments[_i];
        msgKey = "" + msgKey;
        var callbackList = this._callbackDict[msgKey];
        if (callbackList) for (var i = 0; i < callbackList.length; i++) {
          var callItem = callbackList[i];
          callItem[0].apply(callItem[1], msgDatas);
        }
      };
      return EventManager;
    }(Singleton_1.Singleton);
    exports.EventManager = EventManager;
    cc._RF.pop();
  }, {
    "../base/Singleton": "Singleton",
    "../utils/LogUtil": "LogUtil"
  } ],
  ExitTipsView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c22f5bbagpCqpzRFJviVHcC", "ExitTipsView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const BaseWindows_1 = require("../../../framework/base/BaseWindows");
    const EventConst_1 = require("../../../framework/const/EventConst");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let ExitTipsView = class ExitTipsView extends BaseWindows_1.BaseWindows {
      constructor() {
        super(...arguments);
        this.isClickRect = true;
      }
      initUI(...args) {
        super.initUI(...args);
        this.initSelfUI();
      }
      initSelfUI() {}
      onBtnClick(event, customEventData) {
        GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.EXIT_TIPS_VIEW);
        if (0 == customEventData) ; else if (1 == customEventData) ; else if (2 == customEventData) {
          GameGlobal_1.GameGlobal.Store.removeItem("token");
          GameGlobal_1.GameGlobal.Http.token = null;
          GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.EXIT_TIPS_VIEW);
          let userInfo = GameGlobal_1.GameGlobal.DataManager.userInfo;
          let officiaUser = userInfo && userInfo.officia_user;
          if (officiaUser) {
            GameGlobal_1.GameGlobal.DataManager.userInfo = {};
            GameGlobal_1.GameGlobal.Eventer.dispatch(EventConst_1.EventConst.EventId.REFLESH_USER_INFO, GameGlobal_1.GameGlobal.DataManager.userInfo);
            GameGlobal_1.GameGlobal.DataManager.vistiorLogin();
          }
        }
      }
      onEnterBegin(event, customEventData) {}
    };
    ExitTipsView.TAG = "ExitTipsView";
    ExitTipsView = __decorate([ ccclass ], ExitTipsView);
    exports.default = ExitTipsView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/EventConst": "EventConst",
    "../../../framework/const/ViewConst": "ViewConst"
  } ],
  FishCommonTipsView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d70cbHViR1BlI3ZIcmJGJ/W", "FishCommonTipsView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const BaseView_1 = require("../../../framework/base/BaseView");
    const EventConst_1 = require("../../../framework/const/EventConst");
    const SceneConst_1 = require("../../../framework/const/SceneConst");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let FishCommonTipsView = class FishCommonTipsView extends BaseView_1.BaseView {
      CbExit() {
        cc.director.loadScene("hall", () => {
          GameGlobal_1.GameGlobal.Viewer.initLayers();
          GameGlobal_1.GameGlobal.Scene.openScene(SceneConst_1.SceneConst.SceneType.HallScene);
          GameGlobal_1.GameGlobal.Eventer.dispatch(EventConst_1.EventConst.EventId.ON_SCENE_CHANGED);
        });
      }
    };
    FishCommonTipsView = __decorate([ ccclass ], FishCommonTipsView);
    exports.default = FishCommonTipsView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseView": "BaseView",
    "../../../framework/const/EventConst": "EventConst",
    "../../../framework/const/SceneConst": "SceneConst"
  } ],
  FishGameScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0f2ed0egOhGL6pabWy5GYth", "FishGameScene");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.FishGameScene = void 0;
    var BaseScene_1 = require("../../framework/base/BaseScene");
    var ViewConst_1 = require("../../framework/const/ViewConst");
    var GameGlobal_1 = require("../../framework/GameGlobal");
    var LogUtil_1 = require("../../framework/utils/LogUtil");
    var FishGameScene = function(_super) {
      __extends(FishGameScene, _super);
      function FishGameScene() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      FishGameScene.prototype.init = function() {
        LogUtil_1.LogUtil.info(FishGameScene.TAG, "==>init");
        cc.log("====init======");
      };
      FishGameScene.prototype.onEnter = function() {
        _super.prototype.onEnter.call(this);
        LogUtil_1.LogUtil.info(FishGameScene.TAG, "onEnter");
        GameGlobal_1.GameGlobal.Viewer.closeLoadingUI();
        GameGlobal_1.GameGlobal.Viewer.closeAllViews();
        GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.FISH_GAME_VIEW);
      };
      FishGameScene.prototype.onExit = function() {
        _super.prototype.onExit.call(this);
        LogUtil_1.LogUtil.info(FishGameScene.TAG, "onExit");
      };
      FishGameScene.prototype.onBackKeyDown = function() {
        _super.prototype.onBackKeyDown.call(this);
      };
      FishGameScene.TAG = "FishGameScene";
      return FishGameScene;
    }(BaseScene_1.BaseScene);
    exports.FishGameScene = FishGameScene;
    cc._RF.pop();
  }, {
    "../../framework/GameGlobal": "GameGlobal",
    "../../framework/base/BaseScene": "BaseScene",
    "../../framework/const/ViewConst": "ViewConst",
    "../../framework/utils/LogUtil": "LogUtil"
  } ],
  FishGameView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2c482aCEOxBBb025uYNRzvS", "FishGameView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const BaseView_1 = require("../../../framework/base/BaseView");
    const EventConst_1 = require("../../../framework/const/EventConst");
    const SceneConst_1 = require("../../../framework/const/SceneConst");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const EventManager_1 = require("../../../framework/manager/EventManager");
    const SocketManager_1 = require("../../../framework/manager/SocketManager");
    const PathMoveUtil_1 = require("../../../framework/utils/PathMoveUtil");
    const UIUtil_1 = require("../../../framework/utils/UIUtil");
    const BulletView_1 = require("./BulletView");
    const SeatView_1 = require("./SeatView");
    var RoomState;
    (function(RoomState) {
      RoomState[RoomState["Idle"] = 0] = "Idle";
      RoomState[RoomState["frost"] = 1] = "frost";
    })(RoomState || (RoomState = {}));
    const {ccclass: ccclass, property: property} = cc._decorator;
    let FishGameView = class FishGameView extends BaseView_1.BaseView {
      constructor() {
        super(...arguments);
        this.seats = [];
        this.bullets = [];
        this.fishs = [];
        this.bgSprite = null;
        this.boxRoot = null;
        this.boxContet = null;
        this.btnExpand = null;
        this.CoinEffects = null;
        this.lockToggle = null;
        this.autoToggle = null;
        this.propLayout = null;
        this.lockFishView = null;
        this.roomstate = RoomState.Idle;
        this.NoCannonMaskNode = null;
        this.fishJsonData = null;
        this.pathJsonData = null;
        this.clickTime = 0;
      }
      onEnter() {
        super.onEnter();
        this.propLayout.active = false;
        this.fishJsonData = this.fishJsonData.json;
        this.pathJsonData = this.pathJsonData.json;
        cc.log(this.fishJsonData);
        cc.log(this.fishJsonData);
        GameGlobal_1.GameGlobal.Socket.connect("ws://8.130.92.102:7777/echo");
        EventManager_1.EventManager.getInstance().addListener(SocketManager_1.EVENTMSG.Res_JoinRoom, this.JoinRoomSuc, this);
        EventManager_1.EventManager.getInstance().addListener(SocketManager_1.EVENTMSG.BroadcastOutFish, this.BroadcastOutFish, this);
        EventManager_1.EventManager.getInstance().addListener(SocketManager_1.EVENTMSG.Res_LoginGame, this.LoginSuc, this);
        EventManager_1.EventManager.getInstance().addListener(SocketManager_1.EVENTMSG.BroadcastJoinRoom, this.BroadcastJoinRoom, this);
        EventManager_1.EventManager.getInstance().addListener(SocketManager_1.EVENTMSG.SocketOpen, this.SocketOpen, this);
        EventManager_1.EventManager.getInstance().addListener(SocketManager_1.EVENTMSG.BroadcastLaunch, this.BroadcastLaunch, this);
        EventManager_1.EventManager.getInstance().addListener(SocketManager_1.EVENTMSG.Res_GetRoomFishInfo, this.GetRoomFishInfo, this);
        EventManager_1.EventManager.getInstance().addListener(SocketManager_1.EVENTMSG.Res_BroadcastFishHit, this.BroadcastFishHit, this);
        EventManager_1.EventManager.getInstance().addListener(SocketManager_1.EVENTMSG.BroadcastLeaveRoom, this.BroadcastLeaveRoom, this);
        EventManager_1.EventManager.getInstance().addListener(SocketManager_1.EVENTMSG.Res_BroadcastReplaceFort, this.BroadcastReplaceFort, this);
        EventManager_1.EventManager.getInstance().addListener(SocketManager_1.EVENTMSG.SocketClose, this.SocketClose, this);
        EventManager_1.EventManager.getInstance().addListener("BulletCollisionFish", this.BulletCollisionFish, this);
        EventManager_1.EventManager.getInstance().addListener("BulletBoom", this.BulletBoom, this);
        EventManager_1.EventManager.getInstance().addListener("FishArrive", this.FishArrive, this);
        EventManager_1.EventManager.getInstance().addListener("RemoveNoCannonMaskNode", this.RemoveNoCannonMaskNode, this);
        cc.director.getCollisionManager().enabled = true;
        this.lockToggle.isChecked = this.isLock;
        this.autoToggle.isChecked = this.isAuto;
        this.schedule(this.AutoLaunch, .3);
        cc.game.on(cc.game.EVENT_HIDE, this.EventHide, this);
        cc.game.on(cc.game.EVENT_SHOW, this.EventShow, this);
        EventManager_1.EventManager.getInstance().addListener("Shake", this.Shake, this);
      }
      SocketClose() {
        GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.Fish_COMMON_TIPS_VIEW);
      }
      CbSpecial() {}
      EventHide() {
        console.log("\u6e38\u620f\u8fdb\u5165\u540e\u53f0");
        GameGlobal_1.GameGlobal.EVENT_HIDE = true;
        GameGlobal_1.GameGlobal.EVENT_HIDE_TIME = Date.now();
      }
      EventShow() {
        console.log("\u6e38\u620f\u8fdb\u5165\u524d\u53f0");
        GameGlobal_1.GameGlobal.EVENT_HIDE = false;
        var time = Date.now();
        if (time - GameGlobal_1.GameGlobal.EVENT_HIDE_TIME > 3e4) this.CbExit(); else {
          for (var i = 0; i < this.fishs.length; i++) this.fishs[i].node.destroy();
          this.fishs = [];
          GameGlobal_1.GameGlobal.Socket.sendMsg(SocketManager_1.EVENTMSG.Req_GetRoomFishInfo, {});
        }
      }
      BulletCollisionFish(data) {
        var bulletView = data.bullet;
        var fish = data.fish;
        if (null != this.lockFishView && fish != this.lockFishView) return;
        fish.BulletHit();
        GameGlobal_1.GameGlobal.Socket.sendMsg(SocketManager_1.EVENTMSG.Req_FishHit, {
          BulletId: bulletView.data.bullet_id,
          FishNum: fish.fish_num
        });
        this.BulletBoom(bulletView.data.bullet_id);
      }
      RemoveNoCannonMaskNode(flag) {
        this.NoCannonMaskNode.active = flag;
      }
      SocketOpen() {
        this.session = GameGlobal_1.GameGlobal.Store.getItem("token");
        GameGlobal_1.GameGlobal.Socket.sendMsg(SocketManager_1.EVENTMSG.Ret_LoginGame, {
          Token: this.session
        });
      }
      CbExit() {
        cc.director.loadScene("hall", () => {
          GameGlobal_1.GameGlobal.Viewer.initLayers();
          GameGlobal_1.GameGlobal.Scene.openScene(SceneConst_1.SceneConst.SceneType.HallScene);
          GameGlobal_1.GameGlobal.Eventer.dispatch(EventConst_1.EventConst.EventId.ON_SCENE_CHANGED);
        });
      }
      onPullClick(event, customEventData) {
        if (this.boxRoot.active) this.onPushClick(null, null); else {
          UIUtil_1.UIUtil.stopAllAnimation(this.boxContet);
          this.boxRoot.active = true;
          let dx0 = this.btnExpand.width / 2;
          let pos = this.btnExpand.convertToWorldSpaceAR(new cc.Vec2(dx0, 0));
          pos = this.boxRoot.convertToNodeSpaceAR(pos);
          this.boxContet.x = pos.x;
          this.boxContet.y = pos.y;
          this.boxContet.width = 0;
          let padLeft = this.btnExpand.width + 10;
          let padRight = 10;
          let dy = 2;
          let itemWidth = this.boxContet.children[0].width;
          cc.tween(this.boxContet).to(.2, {
            width: 430
          }, {
            easing: "sineIn"
          }).call(() => {}).start();
          for (let i = 0; i < this.boxContet.childrenCount; i++) {
            let node = this.boxContet.children[i];
            let destX = padRight + itemWidth / 2 + (itemWidth + dy) * i;
            cc.tween(node).to(.2, {
              x: destX
            }, {
              easing: "sineOut"
            }).start();
          }
        }
      }
      onPushClick(event, customEventData, start = false) {
        UIUtil_1.UIUtil.stopAllAnimation(this.boxContet);
        var time = .2;
        start && (time = 0);
        cc.tween(this.boxContet).to(time, {
          width: 0
        }, {
          easing: "sineIn"
        }).call(() => {
          this.boxRoot.active = false;
        }).start();
        let itemWidth = this.boxContet.children[0].width;
        let destX = itemWidth / 2;
        for (let i = 0; i < this.boxContet.childrenCount; i++) {
          let node = this.boxContet.children[i];
          cc.tween(node).to(time, {
            x: -destX
          }, {
            easing: "sineOut"
          }).start();
        }
      }
      Shake() {
        let x = cc.Camera.main.node.x;
        let y = cc.Camera.main.node.y;
        let offset = 20;
        var time = .15;
        let action = cc.sequence(cc.moveTo(time, cc.v2(x + Math.random() * offset), y), cc.moveTo(time, cc.v2(x - Math.random() * offset), y), cc.moveTo(time, cc.v2(x + Math.random() * offset), y), cc.moveTo(time, cc.v2(x - Math.random() * offset), y), cc.moveTo(time, cc.v2(x + Math.random() * offset), y), cc.moveTo(time, cc.v2(x - Math.random() * offset), y), cc.moveTo(time, cc.v2(x + Math.random() * offset), y), cc.moveTo(time, cc.v2(x - Math.random() * offset), y), cc.moveTo(time, cc.v2(x + Math.random() * offset), y));
        cc.Camera.main.node.runAction(action);
        setTimeout(() => {
          this.node.stopAction(action);
          this.node.x = x;
          this.node.y = y;
        }, 1e3);
      }
      ChangeAutoState(event) {
        this.isAuto = event.isChecked;
      }
      ChangeLockState(event) {
        this.isLock = event.isChecked;
        this.isLock || this.ChangeLockFishView(null);
      }
      AutoLaunch() {
        if (this.isAuto) {
          if (this.isLock && null == this.lockFishView) {
            this.fishs.sort((a, b) => {
              var aCoint = a.fishJsonData.coin[a.fishJsonData.coin.length - 1];
              var bCoint = b.fishJsonData.coin[b.fishJsonData.coin.length - 1];
              return bCoint - aCoint;
            });
            this.ChangeLockFishView(this.fishs[0]);
          }
          this.FortLaunch();
        } else if (this.isLock) {
          if (null == this.lockFishView) return;
          this.FortLaunch();
        }
      }
      BroadcastReplaceFort(data) {
        var seatView = this.GetSeat(data.user_id);
        null === seatView || void 0 === seatView ? void 0 : seatView.ChangeFort(data.fort_info);
      }
      ShowIllustratedHandBoolView() {
        GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.ILLUSTRATED_HANDBOOK_VIEW);
      }
      ShowTortoise() {
        GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.BONUSTORTOISE_VIEW);
      }
      BroadcastLeaveRoom(data) {
        var seatView = this.GetSeat(data.user_id);
        null === seatView || void 0 === seatView ? void 0 : seatView.PlayerLeavel();
      }
      ChangeBatteryView() {
        GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.BATTERY_VIEW);
      }
      BulletBoom(bullet_id) {
        var bulletView = this.GetBullet(bullet_id);
        if (null != bulletView) {
          var index = this.bullets.indexOf(bulletView, 0);
          bulletView.Boom(this.EffectsParent);
          this.bullets.splice(index, 1);
        } else cc.log("\u627e\u4e0d\u5230\u5b50\u5f39:" + bullet_id);
      }
      BroadcastFishHit(data) {
        cc.log("\u5b50\u5f39\u6253\u4e2d\u9c7c" + data.bullet_id);
        data.destroy_bullet && this.BulletBoom(data.bullet_id);
        0 != data.coin && this.FishDie(data);
      }
      CreateAddCoinNum(coinEffectParent, pos, coin) {
        return __awaiter(this, void 0, void 0, function*() {
          if (coin <= 0) return;
          var coinEffectPrefab = yield GameGlobal_1.GameGlobal.getPrefabFromUrl("mainRes/prefabs/effects/AddCoinNum");
          var numObject = cc.instantiate(coinEffectPrefab);
          var numView = numObject.getComponent("AddCoinNumView");
          numView.Init(coin, pos, coinEffectParent);
        });
      }
      FishDie(data) {
        var seatView = this.GetSeat(data.user_id);
        this.RemoveFish(data.fish_num, data.coin, seatView);
      }
      RemoveFish(fish_num, coin = 0, seatView = null) {
        var fishview = this.GetFish(fish_num);
        if (null != fishview) {
          this.CreateAddCoinNum(this.EffectsParent, fishview.node.position, coin);
          null != seatView && this.CreateCoinFlyToSeat(fishview.node.position, seatView.GetCoinPosition(), coin);
          fishview.Die(coin, this.EffectsParent, seatView);
          var index = this.fishs.indexOf(fishview, 0);
          this.fishs.splice(index, 1);
          this.lockFishView == fishview && this.ChangeLockFishView(null);
        }
      }
      AddCoinNum() {}
      CreateCoinFlyToSeat(startPos, targetPos, coin) {
        return __awaiter(this, void 0, void 0, function*() {
          var num = coin / 100;
          if (num > 0) {
            var flyPrefab = yield GameGlobal_1.GameGlobal.getPrefabFromUrl("mainRes/prefabs/effects/CoinFlyToSeat");
            var flyView = cc.instantiate(flyPrefab);
            var CoinFlyToSeat = flyView.getComponent("CoinFlyToSeat");
            flyView.setParent(this.CoinEffects);
            CoinFlyToSeat.init(startPos, targetPos, this.EffectsParent, num);
          }
        });
      }
      GetRoomFishInfo(data) {
        var fish_list = data.fish_list;
        this.CreateFishs(fish_list);
      }
      CreateFishs(fish_list) {
        for (var i = 0; i < fish_list.length; i++) {
          var fish = fish_list[i];
          this.CreateFish(fish);
        }
      }
      GetBullet(bulletUUID) {
        for (var i = 0; i < this.bullets.length; i++) {
          var bulletview = this.bullets[i];
          if (bulletview.data.bullet_id == bulletUUID) return bulletview;
        }
        return null;
      }
      GetFish(fish_num) {
        for (var i = 0; i < this.fishs.length; i++) {
          var fishview = this.fishs[i];
          if (fishview.fishData.fish_num == fish_num) return fishview;
        }
        return null;
      }
      FishArrive(fish_num) {
        this.RemoveFish(fish_num);
      }
      CreateFish(data) {
        return __awaiter(this, void 0, void 0, function*() {
          var fish_num = data.fish_num;
          var fishview = this.GetFish(fish_num);
          if (null == fishview) {
            var fishPrefab = yield GameGlobal_1.GameGlobal.getPrefabFromUrl("mainRes/prefabs/fish/" + data.fish_id);
            var fishView = cc.instantiate(fishPrefab);
            fishView.setParent(this.FishsParent);
            var fishControl = fishView.addComponent("FishView");
            fishControl.Init(data, this.clientIndex == this.serverIndex, this.fishJsonData[data.fish_id], this.pathJsonData[data.combination_number]);
            this.fishs.push(fishControl);
          } else fishview.CalibrationInfo();
        });
      }
      BroadcastOutFish(data) {
        if (GameGlobal_1.GameGlobal.EVENT_HIDE) return;
        var fish_list = data.fish_list;
        this.CreateFishs(fish_list);
      }
      GetSeat(user_id) {
        for (var i = 0; i < this.seats.length; i++) {
          var seat = this.seats[i];
          if (seat.GetUserID() == user_id) return seat;
        }
      }
      BroadcastLaunch(data) {
        var seat = this.GetSeat(data.user_id);
        if (null != seat) {
          var angle = seat.ChangeBulletAngle(data.angle);
          seat.ChangeAngle(angle);
          cc.log("\u53d1\u5c04\u5b50\u5f39:" + data.bullet_id);
          this.CreateBullet(seat, angle, data);
        }
      }
      angle_to_radian(angle) {
        let radian = Math.PI / 180 * angle;
        return radian;
      }
      CreateBullet(seat, angle, data) {
        return __awaiter(this, void 0, void 0, function*() {
          var bulletPrefab = yield GameGlobal_1.GameGlobal.getPrefabFromUrl("mainRes/prefabs/bullet/" + seat.fort_info.fort_id);
          var bulletView = cc.instantiate(bulletPrefab);
          bulletView.setParent(this.BulletsParent);
          var nodePos = seat.GePosition();
          cc.log("angle:" + angle);
          let radian = this.angle_to_radian(360 - angle + 90);
          let x = 80 * Math.cos(radian);
          let y = 80 * Math.sin(radian);
          cc.log(x + ",y:" + y);
          nodePos = cc.v2(x + nodePos.x, y + nodePos.y);
          bulletView.position = new cc.Vec3(nodePos.x, nodePos.y, 0);
          var bulletControl = bulletView.addComponent(BulletView_1.default);
          bulletControl.Init(data, angle, seat.fort_info.fort_id);
          this.bullets.push(bulletControl);
        });
      }
      BroadcastJoinRoom(data) {
        for (var i = 0; i < data.length; i++) {
          var seatInfo = data[i];
          var clientIndex = this.GetSeatIndex(seatInfo.seat_id);
          var seat = this.SeatsParent.getChildByName("Seat" + clientIndex);
          var seatView = seat.getComponent(SeatView_1.default);
          var isMine = null != seatInfo.user_info && seatInfo.user_info.user_id == GameGlobal_1.GameGlobal.playerUUID;
          if (isMine) {
            this.mySeat = seatView;
            this.SetDown();
            cc.log("\u6211\u6709\u5ea7\u4f4d\u5566");
          }
          seatView.Init(seatInfo, clientIndex, isMine);
          -1 == this.seats.indexOf(seatView) && this.seats.push(seatView);
        }
      }
      DestoryFish(Fish) {}
      BulletDestoryAndPlayAnim() {}
      GetSeatIndex(serverIndex) {
        var clientIndex = serverIndex;
        var isChange = this.IsChangeSeat();
        if (isChange) switch (serverIndex) {
         case 0:
          clientIndex = 2;
          break;

         case 1:
          clientIndex = 3;
          break;

         case 2:
          clientIndex = 0;
          break;

         case 3:
          clientIndex = 1;
        }
        return clientIndex;
      }
      IsChangeSeat() {
        var isChange = this.serverIndex != this.clientIndex;
        return isChange;
      }
      LoginSuc(data) {
        GameGlobal_1.GameGlobal.playerUUID = data.user_id;
        GameGlobal_1.GameGlobal.Socket.sendMsg(SocketManager_1.EVENTMSG.Req_JoinRoom, {});
      }
      JoinRoomSuc(data) {
        GameGlobal_1.GameGlobal.Socket.sendMsg(SocketManager_1.EVENTMSG.Req_GetRoomFishInfo, {});
        GameGlobal_1.GameGlobal.Socket.sendMsg(SocketManager_1.EVENTMSG.Req_GetPropConf, {});
        var serverIndex = data.seat_id;
        var clientIndex = serverIndex;
        2 == serverIndex ? clientIndex = 0 : 3 == serverIndex && (clientIndex = 1);
        this.serverIndex = serverIndex;
        this.clientIndex = clientIndex;
        var x = 0 == clientIndex ? 80 : -80;
        cc.log("\u52a0\u5165\u623f\u95f4\u6210\u529f");
        this.propLayout.position = new cc.Vec3(x, this.propLayout.position.y, 0);
        this.propLayout.active = true;
      }
      LeaveSeat() {
        this.mySeat = null;
        this.bgSprite.off(cc.Node.EventType.TOUCH_END, this.ClickIphoneDown, this);
        this.bgSprite.off(cc.Node.EventType.TOUCH_MOVE, this.MouseMove, this);
      }
      update(dt) {
        var _a, _b;
        if (this.roomstate == RoomState.Idle) {
          for (let i = 0; i < this.fishs.length; ++i) null === (_a = this.fishs[i]) || void 0 === _a ? void 0 : _a.updateFrame(dt);
          for (let i = 0; i < this.bullets.length; ++i) null === (_b = this.bullets[i]) || void 0 === _b ? void 0 : _b.updateFrame(dt);
        }
        if (null != this.lockFishView) {
          var fishPos = this.lockFishView.GetWorldPos();
          let seatpos = this.mySeat.GetWorldPosition();
          var angle = PathMoveUtil_1.default.GetAngle(seatpos, fishPos);
          this.mySeat.ChangeAngle(angle);
        }
      }
      ChangeLockFishView(fish) {
        var _a, _b;
        if (fish == this.lockFishView) return;
        null === (_a = this.lockFishView) || void 0 === _a ? void 0 : _a.UnLock();
        this.lockFishView = fish;
        null === (_b = this.lockFishView) || void 0 === _b ? void 0 : _b.Lock();
      }
      ClickIphoneDown(touch) {
        if (this.isLock) {
          var point = touch.getLocation();
          for (let i = 0; i < this.fishs.length; ++i) {
            var fish = this.fishs[i];
            var flag = fish.polygonHitTest(point);
            if (flag) {
              this.ChangeLockFishView(fish);
              return;
            }
          }
        }
        if (null != this.lockFishView) return;
        var currentTime = Date.now();
        if (currentTime - this.clickTime < 300) return;
        this.clickTime = currentTime;
        this.MouseMove(touch);
        this.FortLaunch();
        cc.log("ClickIphoneDown==========");
      }
      TouchStart() {}
      SetDown() {
        this.bgSprite.on(cc.Node.EventType.TOUCH_START, this.TouchStart, this);
        this.bgSprite.on(cc.Node.EventType.TOUCH_END, this.ClickIphoneDown, this);
        this.bgSprite.on(cc.Node.EventType.TOUCH_MOVE, this.MouseMove, this);
      }
      FortLaunch() {
        var angle = parseInt(this.mySeat.angle.toString());
        this.IsChangeSeat() && (angle = 360 - angle);
        GameGlobal_1.GameGlobal.Socket.sendMsg(SocketManager_1.EVENTMSG.Req_FortLaunch, {
          angle: angle
        });
      }
      MouseMove(event) {
        if (null != this.lockFishView) return;
        let pos = event.getLocation();
        let seatpos = this.mySeat.GetWorldPosition();
        var angle = PathMoveUtil_1.default.GetAngle(seatpos, pos);
        this.mySeat.ChangeAngle(angle);
      }
      onExit() {
        super.onExit();
      }
      onRelease() {
        super.onRelease();
      }
      initUI(...args) {
        super.initUI(...args);
        this.initSelfUI();
      }
      initSelfUI() {
        this.boxRoot.active = false;
      }
      onLoad() {
        super.onLoad();
      }
      start() {
        super.start();
      }
      onBtnClick(event, customEventData) {
        0 == customEventData;
      }
    };
    __decorate([ property(cc.Node) ], FishGameView.prototype, "bgSprite", void 0);
    __decorate([ property(cc.Node) ], FishGameView.prototype, "EffectsParent", void 0);
    __decorate([ property(cc.Node) ], FishGameView.prototype, "SeatsParent", void 0);
    __decorate([ property(cc.Node) ], FishGameView.prototype, "FishsParent", void 0);
    __decorate([ property(cc.Node) ], FishGameView.prototype, "boxRoot", void 0);
    __decorate([ property(cc.Node) ], FishGameView.prototype, "boxContet", void 0);
    __decorate([ property(cc.Node) ], FishGameView.prototype, "btnExpand", void 0);
    __decorate([ property(cc.Node) ], FishGameView.prototype, "CoinEffects", void 0);
    __decorate([ property(cc.Node) ], FishGameView.prototype, "BulletsParent", void 0);
    __decorate([ property(cc.Toggle) ], FishGameView.prototype, "lockToggle", void 0);
    __decorate([ property(cc.Toggle) ], FishGameView.prototype, "autoToggle", void 0);
    __decorate([ property(cc.Node) ], FishGameView.prototype, "propLayout", void 0);
    __decorate([ property(cc.Node) ], FishGameView.prototype, "NoCannonMaskNode", void 0);
    __decorate([ property(cc.JsonAsset) ], FishGameView.prototype, "fishJsonData", void 0);
    __decorate([ property(cc.JsonAsset) ], FishGameView.prototype, "pathJsonData", void 0);
    FishGameView = __decorate([ ccclass ], FishGameView);
    exports.default = FishGameView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseView": "BaseView",
    "../../../framework/const/EventConst": "EventConst",
    "../../../framework/const/SceneConst": "SceneConst",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../../framework/manager/EventManager": "EventManager",
    "../../../framework/manager/SocketManager": "SocketManager",
    "../../../framework/utils/PathMoveUtil": "PathMoveUtil",
    "../../../framework/utils/UIUtil": "UIUtil",
    "./BulletView": "BulletView",
    "./SeatView": "SeatView"
  } ],
  FishView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f6a4eCQyAFFoYnhAM58M06W", "FishView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const EventManager_1 = require("../../../framework/manager/EventManager");
    const PathMoveUtil_1 = require("../../../framework/utils/PathMoveUtil");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let FishView = class FishView extends cc.Component {
      constructor() {
        super(...arguments);
        this.fish_num = 0;
        this.Index = 0;
        this.offsetPos = cc.Vec2.ZERO;
        this.lock = null;
      }
      polygonHitTest(point) {
        if (1 != this.fishJsonData.isLock) return false;
        var polygonCollider = this.node.getComponent(cc.PolygonCollider);
        point = this.node.convertToNodeSpaceAR(point);
        var flag = cc.Intersection.pointInPolygon(point, polygonCollider.points);
        return flag;
      }
      GetWorldPos() {
        return this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
      }
      Lock() {
        return __awaiter(this, void 0, void 0, function*() {
          if (null == this.lock) {
            var lockEffectPrefab = yield GameGlobal_1.GameGlobal.getPrefabFromUrl("mainRes/prefabs/effects/LockFish");
            this.lock = cc.instantiate(lockEffectPrefab);
            this.node.addChild(this.lock);
          }
        });
      }
      UnLock() {
        cc.log("UnLock:" + this.lock);
        if (null != this.lock) {
          this.lock.destroy();
          this.lock = null;
        }
      }
      Init(fishData, isChangeSeat, fishJsonData, pathJsonData) {
        this.fishData = fishData;
        this.fish_num = fishData.fish_num;
        this.isChangeSeat = isChangeSeat;
        this.fishJsonData = fishJsonData;
        this.pathJsonData = pathJsonData;
        if (null != this.pathJsonData.offsetSingle) {
          var offsetSingleStr = this.pathJsonData.offsetSingle;
          var offsetSingle = offsetSingleStr.split(";");
          if (this.fishData.fish_index > 0) {
            var offsetItem = offsetSingle[this.fishData.fish_index - 1].split(",");
            this.offsetPos = new cc.Vec2(parseInt(offsetItem[0]), parseInt(offsetItem[1]));
          }
        }
        this.Index = fishData.index;
        this.node.active = false;
        this.node.zIndex = this.fishJsonData.layer;
        this.InitJsonData();
      }
      SpeacialFish() {}
      lightingFish() {}
      Die(coin = 0, coinEffectParent = null, seatview = null) {
        var pos = this.node.getPosition();
        null != seatview && this.CreateDieEffect(coinEffectParent, pos, seatview.node.position);
        this.node.destroy();
      }
      CreateDieEffect(boomEffectParent, pos, targetPos) {
        return __awaiter(this, void 0, void 0, function*() {});
      }
      InitJsonData() {
        return __awaiter(this, void 0, void 0, function*() {
          var data = yield GameGlobal_1.GameGlobal.getJsonFromUrl("mainRes/json/locus/" + this.pathJsonData.path_id);
          this.fish_track = data["points"];
          var pos = this.fish_track[this.Index];
          var x = pos.x + this.offsetPos.x;
          var y = pos.y + this.offsetPos.y;
          this.node.position = this.ChangePosition(x, y);
          this.node.active = true;
          var length = this.fish_track.length;
          this.time = this.fishData.time / 1e3 / length;
          this.RefreshNextPosition();
        });
      }
      onCollisionEnter(other, self) {
        var bullet = other.node;
        var bulletView = bullet.getComponent("BulletView");
        if (null != bulletView && bulletView.data.user_id == GameGlobal_1.GameGlobal.playerUUID) {
          cc.log("\u662f\u6211\u7684\u5b50\u5f39");
          var data = {
            bullet: bulletView,
            fish: this
          };
          EventManager_1.EventManager.getInstance().dispatch("BulletCollisionFish", data);
        }
      }
      ResetColor() {
        null != this.node && (this.node.children[0].color = cc.color(255, 255, 255, 255));
      }
      BulletHit() {
        this.unschedule(this.ResetColor);
        this.node.children[0].color = cc.color(255, 0, 0, 255);
        this.schedule(this.ResetColor, .2);
      }
      CalibrationInfo() {}
      RefreshNextPosition() {
        if (this.fish_track.length > this.Index + 1) {
          var pos = this.fish_track[this.Index + 1];
          var x = pos.x + this.offsetPos.x;
          var y = pos.y + this.offsetPos.y;
          this.targetPos = this.ChangePosition(x, y);
          var angle = PathMoveUtil_1.default.GetAngle(this.node.position, this.targetPos);
          this.node.angle = -angle;
          this.GetSpeed();
        } else EventManager_1.EventManager.getInstance().dispatch("FishArrive", this.fish_num);
      }
      GetSpeed() {
        var dist = PathMoveUtil_1.default.GetDist(this.node.position, this.targetPos);
        this.speed = dist / this.time;
      }
      ChangePosition(x, y) {
        if (this.isChangeSeat) return new cc.Vec3(x, -1 * y, 0);
        return new cc.Vec3(x, y, 0);
      }
      updateFrame(dt) {
        if (null == this.targetPos) return;
        var nextpos = PathMoveUtil_1.default.GetNextPosition(this.node.position, this.targetPos, this.speed * dt);
        this.node.position = nextpos;
        var dist = PathMoveUtil_1.default.GetDist(nextpos, this.targetPos);
        if (dist <= .2) {
          this.Index++;
          this.RefreshNextPosition();
        }
      }
    };
    FishView = __decorate([ ccclass ], FishView);
    exports.default = FishView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/manager/EventManager": "EventManager",
    "../../../framework/utils/PathMoveUtil": "PathMoveUtil"
  } ],
  FontLabel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5959bkk8KJKZ7fZmMiaMM6Z", "FontLabel");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.FontLabel = void 0;
    var GameGlobal_1 = require("../GameGlobal");
    var TextUtil_1 = require("../utils/TextUtil");
    function debounce(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          immediate || func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        callNow && func.apply(context, args);
      };
    }
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var FontLabel = function(_super) {
      __extends(FontLabel, _super);
      function FontLabel() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._atlas = "mainRes/plist/game";
        _this._text = "0";
        _this._headName = "fonts-pveImgNumber_";
        return _this;
      }
      Object.defineProperty(FontLabel.prototype, "atlas", {
        get: function() {
          return this._atlas;
        },
        set: function(value) {
          this._atlas != value && (this._atlas = value);
          false;
          this.updateLabel();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(FontLabel.prototype, "text", {
        get: function() {
          return this._text;
        },
        set: function(s) {
          this._text != s && (this._text = s);
          false;
          this.updateLabel();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(FontLabel.prototype, "fontColor", {
        get: function() {
          return this._fontColor;
        },
        set: function(s) {
          this._fontColor != s && (this._fontColor = s);
          false;
          this.updateLabel();
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(FontLabel.prototype, "headName", {
        get: function() {
          return this._headName;
        },
        set: function(s) {
          this._headName != s && (this._headName = s);
          false;
          this.updateLabel();
        },
        enumerable: false,
        configurable: true
      });
      FontLabel.prototype.onLoad = function() {
        false;
        this.fetchRender();
      };
      FontLabel.prototype.fetchRender = function() {
        this.updateLabel();
      };
      FontLabel.prototype.updateLabel = function() {
        if (TextUtil_1.TextUtil.isEmpty(this._atlas) || TextUtil_1.TextUtil.isEmpty(this._headName)) {
          var label = this.node.getComponent(cc.Label) ? this.node.getComponent(cc.Label) : this.node.addComponent(cc.Label);
          label.string = this._text;
          this._fontColor && (label.node.color = this._fontColor);
        } else {
          this.node.removeComponent(cc.Label);
          var layout = this.node.getComponent(cc.Layout) ? this.node.getComponent(cc.Layout) : this.node.addComponent(cc.Layout);
          layout.type = cc.Layout.Type.HORIZONTAL;
          layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
          var max = Math.max(this.node.childrenCount, this.text.length);
          var min = Math.min(this.node.childrenCount, this.text.length);
          var bAdd = this.node.childrenCount < this.text.length;
          for (var i = max - 1; i >= min; i--) if (bAdd) {
            var node = new cc.Node();
            this.node.addChild(node);
          } else {
            var child = this.node.children[i];
            this.node.removeChild(child);
          }
          for (var i = 0; i < this.node.childrenCount; i++) {
            var txt = this._text.charAt(i);
            GameGlobal_1.GameGlobal.Resource.setFrame("", this.node.children[i], this._atlas, this._headName + txt);
            this._fontColor && (this.node.children[i].color = this._fontColor);
          }
        }
      };
      __decorate([ property(cc.String) ], FontLabel.prototype, "atlas", null);
      __decorate([ property(cc.String) ], FontLabel.prototype, "text", null);
      __decorate([ property(cc.Color) ], FontLabel.prototype, "fontColor", null);
      __decorate([ property(cc.String) ], FontLabel.prototype, "headName", null);
      FontLabel = __decorate([ ccclass ], FontLabel);
      return FontLabel;
    }(cc.Component);
    exports.FontLabel = FontLabel;
    cc._RF.pop();
  }, {
    "../GameGlobal": "GameGlobal",
    "../utils/TextUtil": "TextUtil"
  } ],
  ForgetPassWordView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a41b2J3auRJdIK1bvj8FDIK", "ForgetPassWordView");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var BaseWindows_1 = require("../../../framework/base/BaseWindows");
    var ViewConst_1 = require("../../../framework/const/ViewConst");
    var GameGlobal_1 = require("../../../framework/GameGlobal");
    var LogUtil_1 = require("../../../framework/utils/LogUtil");
    var UIUtil_1 = require("../../../framework/utils/UIUtil");
    var Utils_1 = require("../../../framework/utils/Utils");
    var HallConst_1 = require("../../const/HallConst");
    var HallHttpConst_1 = require("../../const/HallHttpConst");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var ForgetPassWordView = function(_super) {
      __extends(ForgetPassWordView, _super);
      function ForgetPassWordView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.isClickRect = true;
        _this.timeCnt = 60;
        return _this;
      }
      ForgetPassWordView_1 = ForgetPassWordView;
      ForgetPassWordView.prototype.initUI = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        _super.prototype.initUI.apply(this, args);
        this.initSelfUI();
      };
      ForgetPassWordView.prototype.initSelfUI = function() {
        this.areasRoot.active = false;
        this.txtGetCode.node.active = true;
        this.txtTime.node.active = false;
        this.btnCode.interactable = true;
        UIUtil_1.UIUtil.setGray(this.btnCode.node, !this.btnCode.interactable, true);
        this.txtPhoneHead.string = HallConst_1.default.PhoneHeads[0] + "";
        for (var i = 0; i < HallConst_1.default.PhoneHeads.length; i++) {
          var node = cc.instantiate(this.phoneItem);
          node.addComponent(cc.Button);
          var label = node.getComponent(cc.Label);
          label.string = HallConst_1.default.PhoneHeads[i] + "";
          var idx = i;
          UIUtil_1.UIUtil.addClickListener(node, this.onPhoneItemClick.bind(this, idx), this);
          this.scrollContent.addChild(node);
        }
      };
      ForgetPassWordView.prototype.onPhoneItemClick = function(idx) {
        this.txtPhoneHead.string = HallConst_1.default.PhoneHeads[idx] + "";
        this.startPhoneAni(false);
      };
      ForgetPassWordView.prototype.onBtnClick = function(event, customEventData) {
        if (0 == customEventData) GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.FORGET_PASSWORD_VIEW); else if (1 == customEventData) {
          this.areasRoot.active && this.startPhoneAni(false);
          var phone = this.phoneInput.string;
          if (Utils_1.Utils.isPhoneNumber(phone)) {
            this.btnCode.interactable = false;
            UIUtil_1.UIUtil.setGray(this.btnCode.node, !this.btnCode.interactable, true);
            var area = this.txtPhoneHead.string;
            area = area.replace("+", "");
            var phone_1 = this.phoneInput.string;
            var newArea = Number.parseInt(area);
            var type = 1;
            GameGlobal_1.GameGlobal.Http.post(HallHttpConst_1.default.PostUserCode, {
              phone: phone_1,
              area: newArea,
              type: type
            }, this.onSendCodeResp, this);
          } else {
            var str = GameGlobal_1.GameGlobal.Lang.t("InvalidPhone");
            GameGlobal_1.GameGlobal.TipManager.showTip(str);
          }
        } else if (2 == customEventData) {
          this.areasRoot.active && this.startPhoneAni(false);
          var result = this.checkInput();
          if (1 == result) {
            var str = GameGlobal_1.GameGlobal.Lang.t("InvalidPhone");
            GameGlobal_1.GameGlobal.TipManager.showTip(str);
          } else if (2 == result) {
            var str = GameGlobal_1.GameGlobal.Lang.t("InvalidCode");
            GameGlobal_1.GameGlobal.TipManager.showTip(str);
          } else if (3 == result) {
            var str = GameGlobal_1.GameGlobal.Lang.t("InvalidPassWord");
            GameGlobal_1.GameGlobal.TipManager.showTip(str);
          } else if (0 == result) {
            this.btnConfirm.interactable = false;
            UIUtil_1.UIUtil.setGray(this.btnConfirm.node, !this.btnConfirm.interactable, true);
            var area = this.txtPhoneHead.string;
            area = area.replace("+", "");
            var phone = this.phoneInput.string;
            var pass = this.passWordInput.string;
            var code = this.codeInput.string;
            GameGlobal_1.GameGlobal.Http.post(HallHttpConst_1.default.PostUserPas, {
              messageCode: code,
              phone: phone,
              pass: pass,
              area: area
            }, this.onModifyUserPassResp, this);
          }
        } else if (3 == customEventData) this.startPhoneAni(!this.areasRoot.active); else if (4 == customEventData) this.areasRoot.active && this.startPhoneAni(false); else if (5 == customEventData) {
          GameGlobal_1.GameGlobal.Viewer.closeView(ViewConst_1.ViewConst.ViewName.FORGET_PASSWORD_VIEW);
          GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.LOGIN_VIEW);
        }
      };
      ForgetPassWordView.prototype.onSendCodeResp = function(data) {
        var _this = this;
        LogUtil_1.LogUtil.info(ForgetPassWordView_1.TAG, JSON.stringify(data));
        this.btnCode.interactable = false;
        UIUtil_1.UIUtil.setGray(this.btnCode.node, !this.btnCode.interactable, true);
        if (null != data && 200 == data.code) {
          this.txtGetCode.node.active = false;
          this.txtTime.node.active = !this.txtGetCode.node.active;
          this.startTime();
          GameGlobal_1.GameGlobal.Timer.once(function() {
            _this.codeInput.string = "123456";
          }, this, 2e3);
        }
      };
      ForgetPassWordView.prototype.onModifyUserPassResp = function(data) {
        this.btnConfirm.interactable = true;
        UIUtil_1.UIUtil.setGray(this.btnConfirm.node, !this.btnConfirm.interactable, true);
        if (data && 200 == data.code) {
          GameGlobal_1.GameGlobal.TipManager.showTip("Modify Sucess");
          GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.FORGET_PASSWORD_VIEW);
        }
      };
      ForgetPassWordView.prototype.onEnterBegin = function(event, customEventData) {
        this.areasRoot.active && this.startPhoneAni(false);
      };
      ForgetPassWordView.prototype.onTime = function() {
        this.timeCnt--;
        if (this.timeCnt >= 0) this.txtTime.string = this.timeCnt + "s"; else {
          GameGlobal_1.GameGlobal.Timer.offAllCall(this);
          this.txtGetCode.node.active = true;
          this.txtTime.node.active = !this.txtGetCode.node.active;
          this.btnCode.interactable = true;
          UIUtil_1.UIUtil.setGray(this.btnCode.node, !this.btnCode.interactable, true);
        }
      };
      ForgetPassWordView.prototype.startTime = function() {
        GameGlobal_1.GameGlobal.Timer.offAllCall(this);
        this.timeCnt = 60;
        GameGlobal_1.GameGlobal.Timer.on(this.onTime, this, 1e3, -1);
      };
      ForgetPassWordView.prototype.checkInput = function() {
        var phone = this.phoneInput.string;
        var code = this.codeInput.string;
        var pw = this.passWordInput.string;
        if (!Utils_1.Utils.isPhoneNumber(phone)) return 1;
        if (4 != code.length && 6 != code.length) return 2;
        if (pw.length < 8) return 3;
        return 0;
      };
      ForgetPassWordView.prototype.startPhoneAni = function(bOut) {
        var _this = this;
        this.areasRoot.active = true;
        cc.Tween.stopAllByTarget(this.areasRoot);
        if (bOut) {
          this.mask.height = 0;
          cc.tween(this.mask).to(.15, {
            height: 250
          }, {
            easing: "sineIn"
          }).start();
        } else cc.tween(this.mask).to(.15, {
          height: 0
        }, {
          easing: "sineOut"
        }).call(function() {
          _this.areasRoot.active = false;
        }).start();
      };
      var ForgetPassWordView_1;
      ForgetPassWordView.TAG = "ForgetPassWordView";
      __decorate([ property(cc.EditBox) ], ForgetPassWordView.prototype, "codeInput", void 0);
      __decorate([ property(cc.EditBox) ], ForgetPassWordView.prototype, "phoneInput", void 0);
      __decorate([ property(cc.EditBox) ], ForgetPassWordView.prototype, "passWordInput", void 0);
      __decorate([ property(cc.Prefab) ], ForgetPassWordView.prototype, "phoneItem", void 0);
      __decorate([ property(cc.Node) ], ForgetPassWordView.prototype, "areasRoot", void 0);
      __decorate([ property(cc.Node) ], ForgetPassWordView.prototype, "scrollContent", void 0);
      __decorate([ property(cc.Label) ], ForgetPassWordView.prototype, "txtPhoneHead", void 0);
      __decorate([ property(cc.Node) ], ForgetPassWordView.prototype, "mask", void 0);
      __decorate([ property(cc.Label) ], ForgetPassWordView.prototype, "txtTime", void 0);
      __decorate([ property(cc.Label) ], ForgetPassWordView.prototype, "txtGetCode", void 0);
      __decorate([ property(cc.Button) ], ForgetPassWordView.prototype, "btnCode", void 0);
      __decorate([ property(cc.Button) ], ForgetPassWordView.prototype, "btnConfirm", void 0);
      ForgetPassWordView = ForgetPassWordView_1 = __decorate([ ccclass ], ForgetPassWordView);
      return ForgetPassWordView;
    }(BaseWindows_1.BaseWindows);
    exports.default = ForgetPassWordView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../../framework/utils/LogUtil": "LogUtil",
    "../../../framework/utils/UIUtil": "UIUtil",
    "../../../framework/utils/Utils": "Utils",
    "../../const/HallConst": "HallConst",
    "../../const/HallHttpConst": "HallHttpConst"
  } ],
  FortConst: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d9cabORDOhNSY9H7S4GtVPw", "FortConst");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    class FortConst {}
    exports.default = FortConst;
    FortConst.Fort30 = [ "fort_1_30", "fort_1_30", "fort_2_30", "fort_3_30", "fort_4_30", "fort_5_30", "fort_5_30", "fort_5_30", "fort_5_30", "fort_5_30", "fort_5_30" ];
    FortConst.Fort60 = [ "fort_1_60", "fort_1_60", "fort_2_60", "fort_3_60", "fort_4_60", "fort_5_60", "fort_5_60", "fort_5_60", "fort_5_60", "fort_5_60", "fort_5_60" ];
    FortConst.Fort80 = [ "fort_1_80", "fort_1_80", "fort_2_80", "fort_3_80", "fort_4_80", "fort_5_80", "fort_5_80", "fort_5_80", "fort_5_80", "fort_5_80", "fort_5_80" ];
    FortConst.Fort100 = [ "fort_1_100", "fort_1_100", "fort_2_100", "fort_3_100", "fort_4_100", "fort_5_100", "fort_5_100", "fort_5_100", "fort_5_100", "fort_5_100", "fort_5_100" ];
    FortConst.Fort180 = [ "fort_1_180", "fort_1_180", "fort_2_180", "fort_3_180", "fort_4_180", "fort_5_180", "fort_5_180", "fort_5_180", "fort_5_180", "fort_5_180", "fort_5_180" ];
    cc._RF.pop();
  }, {} ],
  FortDetailView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f9bf64JQ6NMwoebqq8lOzDz", "FortDetailView");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var BaseWindows_1 = require("../../../framework/base/BaseWindows");
    var ViewConst_1 = require("../../../framework/const/ViewConst");
    var GameGlobal_1 = require("../../../framework/GameGlobal");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var FortDetailView = function(_super) {
      __extends(FortDetailView, _super);
      function FortDetailView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.isClickRect = true;
        return _this;
      }
      FortDetailView.prototype.initUI = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        _super.prototype.initUI.apply(this, args);
        this.initSelfUI();
      };
      FortDetailView.prototype.initSelfUI = function() {};
      FortDetailView.prototype.onBtnClick = function(event, customEventData) {
        0 == customEventData ? GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.FORT_DETAIL_VIEW) : 1 == customEventData || 2 == customEventData && GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.FORT_UPDATE_VIEW);
      };
      FortDetailView.prototype.onEnterBegin = function(event, customEventData) {};
      FortDetailView.TAG = "FortDetailView";
      __decorate([ property(cc.Label) ], FortDetailView.prototype, "txtFortName", void 0);
      __decorate([ property(cc.Sprite) ], FortDetailView.prototype, "sFort", void 0);
      __decorate([ property(cc.Label) ], FortDetailView.prototype, "txtGrade", void 0);
      __decorate([ property(cc.Label) ], FortDetailView.prototype, "txtPrice", void 0);
      __decorate([ property(cc.Label) ], FortDetailView.prototype, "txtPower", void 0);
      __decorate([ property(cc.Label) ], FortDetailView.prototype, "txtResPower", void 0);
      __decorate([ property(cc.Label) ], FortDetailView.prototype, "txtBulletPower", void 0);
      __decorate([ property(cc.Label) ], FortDetailView.prototype, "txtBulletFuel", void 0);
      __decorate([ property(cc.Label) ], FortDetailView.prototype, "txtRarity", void 0);
      __decorate([ property(cc.Label) ], FortDetailView.prototype, "txtBonus", void 0);
      __decorate([ property(cc.Label) ], FortDetailView.prototype, "txtExpireDate", void 0);
      FortDetailView = __decorate([ ccclass ], FortDetailView);
      return FortDetailView;
    }(BaseWindows_1.BaseWindows);
    exports.default = FortDetailView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ViewConst": "ViewConst"
  } ],
  FortItemDetailComp: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b4ad6xxlV5PSpYnxS/S7v2N", "FortItemDetailComp");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const ResConst_1 = require("../../../framework/const/ResConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const FortConst_1 = require("../../const/FortConst");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let FortItemDetailComp = class FortItemDetailComp extends cc.Component {
      init(data) {
        this.data = data;
        this.initSelfUI(data);
      }
      initSelfUI(data) {
        let power = data && data.energy ? data.energy : 0;
        let maxCount = data && data.maxCount ? data.maxCount : 0;
        let name = data && data.name ? data.name : 0;
        let fuel = data && data.fuel ? data.fuel : 0;
        let grade = data && data.grade ? data.grade : 0;
        let upgradeConditions = data.upgradeConditions;
        let friendsCount = upgradeConditions && upgradeConditions.friends_number ? upgradeConditions.friends_number : 0;
        let lockUp = upgradeConditions && upgradeConditions.lock_up ? upgradeConditions.lock_up : 0;
        let topUp = upgradeConditions && upgradeConditions.top_up ? upgradeConditions.top_up : 0;
        let con = GameGlobal_1.GameGlobal.Lang.t("Fort.UpdateCon");
        con = con.replace("{0}", topUp);
        con = con.replace("{1}", lockUp);
        con = con.replace("{2}", friendsCount);
        this.txtMost.string = maxCount + "";
        this.txtName.string = name + "";
        this.txtPower.string = power + "";
        this.txtCon.string = con;
        let index = grade;
        index %= FortConst_1.default.Fort80.length;
        GameGlobal_1.GameGlobal.Resource.setFrame("", this.sFort, ResConst_1.ResConst.PLIST_PATH.FORTPROP, FortConst_1.default.Fort80[index]);
        GameGlobal_1.GameGlobal.Resource.setFrame("", this.sFortSmall, ResConst_1.ResConst.PLIST_PATH.FORTPROP, FortConst_1.default.Fort30[index]);
      }
    };
    __decorate([ property(cc.Label) ], FortItemDetailComp.prototype, "txtName", void 0);
    __decorate([ property(cc.Button) ], FortItemDetailComp.prototype, "btnUpdate", void 0);
    __decorate([ property(cc.Label) ], FortItemDetailComp.prototype, "txtPrice", void 0);
    __decorate([ property(cc.Label) ], FortItemDetailComp.prototype, "txtPower", void 0);
    __decorate([ property(cc.Label) ], FortItemDetailComp.prototype, "txtMost", void 0);
    __decorate([ property(cc.Label) ], FortItemDetailComp.prototype, "txtCon", void 0);
    __decorate([ property(cc.Sprite) ], FortItemDetailComp.prototype, "sFort", void 0);
    __decorate([ property(cc.Sprite) ], FortItemDetailComp.prototype, "sFortSmall", void 0);
    FortItemDetailComp = __decorate([ ccclass ], FortItemDetailComp);
    exports.default = FortItemDetailComp;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/const/ResConst": "ResConst",
    "../../const/FortConst": "FortConst"
  } ],
  FortUpdateView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d8a61svE5xG2YOoV74zxDVd", "FortUpdateView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const BaseWindows_1 = require("../../../framework/base/BaseWindows");
    const EventConst_1 = require("../../../framework/const/EventConst");
    const ResConst_1 = require("../../../framework/const/ResConst");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const FortConst_1 = require("../../const/FortConst");
    const HallHttpConst_1 = require("../../const/HallHttpConst");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let FortUpdateView = class FortUpdateView extends BaseWindows_1.BaseWindows {
      constructor() {
        super(...arguments);
        this.isClickRect = true;
      }
      initUI(...args) {
        super.initUI(...args);
        let data = args[0];
        this.data = data;
        this.initSelfUI(data);
      }
      initSelfUI(data) {
        let power = data && data.energy ? data.energy : 0;
        let maxCount = data && data.maxCount ? data.maxCount : 0;
        let haveCount = data && data.numbers ? data.numbers : 0;
        let name = data && data.name ? data.name : 0;
        let fuel = data && data.fuel ? data.fuel : 0;
        let upgradeConditions = data.upgradeConditions;
        let friendsCount = upgradeConditions && upgradeConditions.friends_number ? upgradeConditions.friends_number : 0;
        let lockUp = upgradeConditions && upgradeConditions.lock_up ? upgradeConditions.lock_up : 0;
        let topUp = upgradeConditions && upgradeConditions.top_up ? upgradeConditions.top_up : 0;
        let con = GameGlobal_1.GameGlobal.Lang.t("Fort.UpdateCon");
        con = con.replace("{0}", topUp);
        con = con.replace("{1}", lockUp);
        con = con.replace("{2}", friendsCount);
        let con1 = GameGlobal_1.GameGlobal.Lang.t("Fort.UpdateCon");
        con1 = con1.replace("{0}", "0");
        con1 = con1.replace("{1}", "0");
        con1 = con1.replace("{2}", "0");
        this.txtCurName.string = name + "";
        this.txtPower.string = power + "";
        this.txtCurHave.string = "x" + haveCount;
        this.txtMostHave.string = "x" + maxCount;
        this.txtConditions.string = con;
        this.txtSatisfy.string = con1;
        let index = data.grade;
        index %= FortConst_1.default.Fort80.length;
        GameGlobal_1.GameGlobal.Resource.setFrame("", this.sCurFort, ResConst_1.ResConst.PLIST_PATH.FORTPROP, FortConst_1.default.Fort80[index]);
        GameGlobal_1.GameGlobal.Resource.setFrame("", this.sIconCurHave, ResConst_1.ResConst.PLIST_PATH.FORTPROP, FortConst_1.default.Fort30[index]);
        GameGlobal_1.GameGlobal.Resource.setFrame("", this.sIconMostHave, ResConst_1.ResConst.PLIST_PATH.FORTPROP, FortConst_1.default.Fort30[index]);
      }
      onFortUpdateResp(data) {
        this.btnUpdate.interactable = true;
        let bSucess = false;
        if (data && 200 == data.code) {
          data = data.data;
          bSucess = data.isUpgrade;
        }
        if (bSucess) {
          GameGlobal_1.GameGlobal.TipManager.showTip("Update sucess");
          GameGlobal_1.GameGlobal.Viewer.closeView(ViewConst_1.ViewConst.ViewName.FORT_UPDATE_VIEW);
          GameGlobal_1.GameGlobal.Eventer.dispatch(EventConst_1.EventConst.EventId.REFLESH_BACK_FORT);
        } else GameGlobal_1.GameGlobal.TipManager.showTip("Update error");
      }
      onBtnClick(event, customEventData) {
        let userInfo = GameGlobal_1.GameGlobal.DataManager.userInfo;
        if (!userInfo && 0 != customEventData) {
          GameGlobal_1.GameGlobal.TipManager.showTip("User is not login");
          return;
        }
        if (0 == customEventData) GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.FORT_UPDATE_VIEW); else if (1 == customEventData) {
          this.btnUpdate.interactable = false;
          let id = this.data.id;
          GameGlobal_1.GameGlobal.Http.post(HallHttpConst_1.default.PostFortUpdate, {
            type: 0,
            id: id
          }, this.onFortUpdateResp, this);
        }
      }
      onEnterBegin(event, customEventData) {}
    };
    FortUpdateView.TAG = "FortUpdateView";
    __decorate([ property(cc.Sprite) ], FortUpdateView.prototype, "sCurFort", void 0);
    __decorate([ property(cc.Sprite) ], FortUpdateView.prototype, "sToFort", void 0);
    __decorate([ property(cc.Label) ], FortUpdateView.prototype, "txtCurName", void 0);
    __decorate([ property(cc.Label) ], FortUpdateView.prototype, "txtToName", void 0);
    __decorate([ property(cc.Label) ], FortUpdateView.prototype, "txtPower", void 0);
    __decorate([ property(cc.Label) ], FortUpdateView.prototype, "txtCurHave", void 0);
    __decorate([ property(cc.Label) ], FortUpdateView.prototype, "txtMostHave", void 0);
    __decorate([ property(cc.Label) ], FortUpdateView.prototype, "txtConditions", void 0);
    __decorate([ property(cc.Label) ], FortUpdateView.prototype, "txtSatisfy", void 0);
    __decorate([ property(cc.Sprite) ], FortUpdateView.prototype, "sIconCurHave", void 0);
    __decorate([ property(cc.Sprite) ], FortUpdateView.prototype, "sIconMostHave", void 0);
    __decorate([ property(cc.Button) ], FortUpdateView.prototype, "btnUpdate", void 0);
    FortUpdateView = __decorate([ ccclass ], FortUpdateView);
    exports.default = FortUpdateView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/EventConst": "EventConst",
    "../../../framework/const/ResConst": "ResConst",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../const/FortConst": "FortConst",
    "../../const/HallHttpConst": "HallHttpConst"
  } ],
  FriendAccountDetailView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dd7d9GVMuBO4qg6ClaCTIm+", "FriendAccountDetailView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var FriendAccountDetailView_1;
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const BaseWindows_1 = require("../../../framework/base/BaseWindows");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const LogUtil_1 = require("../../../framework/utils/LogUtil");
    const HallHttpConst_1 = require("../../const/HallHttpConst");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let FriendAccountDetailView = FriendAccountDetailView_1 = class FriendAccountDetailView extends BaseWindows_1.BaseWindows {
      constructor() {
        super(...arguments);
        this.isClickRect = true;
        this.detailList = [];
        this.total = 0;
      }
      initUI(...args) {
        super.initUI(...args);
        this.initSelfUI();
        let id = args[0];
        try {
          GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetSubFriendDetail, {
            userId: id
          }, this.onSubFriendDetailResp, this);
        } catch (error) {
          LogUtil_1.LogUtil.info(FriendAccountDetailView_1.TAG, `${error}`);
        }
      }
      initSelfUI() {}
      onSubFriendDetailResp(data) {
        if (data && 200 == data.code) {
          data = data.data;
          if (data) {
            if (data.list && data.list.length > 0) {
              this.detailList = this.detailList.concat(data.list);
              this.refleshFriendAccount();
            }
            let total = data.total ? data.total : 0;
            this.total = total;
          }
        }
      }
      refleshFriendAccount() {
        let curIdx = this.friendContent.childrenCount;
        for (let i = curIdx; i < this.detailList.length; i++) {
          let item = cc.instantiate(this.friendAccountItemPrefab);
          item.addComponent(cc.Button);
          this.friendContent.addChild(item);
          let txtName = item.getChildByName("txtName").getComponent(cc.Label);
          let txtPhone = item.getChildByName("txtPhone").getComponent(cc.Label);
          let txtType = item.getChildByName("txtType").getComponent(cc.Label);
          let txtAccount = item.getChildByName("txtAccount").getComponent(cc.Label);
          let txtBonus = item.getChildByName("txtBonus").getComponent(cc.Label);
          let txtTime = item.getChildByName("txtTime").getComponent(cc.Label);
          let itemData = this.detailList[i];
          let name = itemData.nickName;
          let coin = itemData.coin;
          let bonus = itemData.shareOfDividends;
          let time = itemData.time;
          let type = itemData.type;
          txtName.string = "name: " + name;
          txtPhone.string = "phone: +86130570375032954";
          txtType.string = "type: " + type;
          txtAccount.string = "account: " + coin;
          txtBonus.string = "bonus: " + bonus;
          txtTime.string = "time: " + time;
        }
      }
      onBtnClick(event, customEventData) {
        0 == customEventData && GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.FRIEND_ACCOUNT_DETAIL);
      }
    };
    FriendAccountDetailView.TAG = "FriendAccountDetailView";
    __decorate([ property(cc.Node) ], FriendAccountDetailView.prototype, "friendContent", void 0);
    __decorate([ property(cc.Prefab) ], FriendAccountDetailView.prototype, "friendAccountItemPrefab", void 0);
    FriendAccountDetailView = FriendAccountDetailView_1 = __decorate([ ccclass ], FriendAccountDetailView);
    exports.default = FriendAccountDetailView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../../framework/utils/LogUtil": "LogUtil",
    "../../const/HallHttpConst": "HallHttpConst"
  } ],
  FriendCongrateTipsView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "811543AWntEkr3YabTW7nVA", "FriendCongrateTipsView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const BaseWindows_1 = require("../../../framework/base/BaseWindows");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let FriendCongrateTipsView = class FriendCongrateTipsView extends BaseWindows_1.BaseWindows {
      constructor() {
        super(...arguments);
        this.isClickRect = true;
        this.timeCnt = 3;
      }
      initUI(...args) {
        super.initUI(...args);
        let coin = args[0];
        coin = coin || 3e6;
        this.initSelfUI(coin);
      }
      onExit() {
        super.onExit();
        cc.Tween.stopAllByTarget(this.sLight);
      }
      initSelfUI(coin) {
        this.txtCoin.string = coin;
        let tw0 = cc.tween(this.sLight).to(6, {
          angle: -360
        });
        let tw1 = cc.tween(this.sLight).call(() => {
          this.sLight.angle = 0;
        });
        let tw = cc.tween(this.sLight).sequence(tw0, tw1);
        cc.tween(this.sLight).repeatForever(tw).start();
        GameGlobal_1.GameGlobal.Timer.once(this.startTimer, this, 500);
      }
      startTimer() {
        GameGlobal_1.GameGlobal.Timer.offAllCall(this);
        GameGlobal_1.GameGlobal.Timer.on(this.onTime, this, 1e3, -1);
      }
      onTime() {
        this.timeCnt--;
        if (this.timeCnt < 0) {
          GameGlobal_1.GameGlobal.Timer.offAllCall(this);
          GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.FRIEND_CONGRATE_TIPS_VIEW);
        } else this.txtTimeCount.string = this.timeCnt + "";
      }
    };
    FriendCongrateTipsView.TAG = "FriendCongrateTipsView";
    __decorate([ property(cc.Label) ], FriendCongrateTipsView.prototype, "txtCoin", void 0);
    __decorate([ property(cc.Node) ], FriendCongrateTipsView.prototype, "sLight", void 0);
    __decorate([ property(cc.Label) ], FriendCongrateTipsView.prototype, "txtTimeCount", void 0);
    FriendCongrateTipsView = __decorate([ ccclass ], FriendCongrateTipsView);
    exports.default = FriendCongrateTipsView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ViewConst": "ViewConst"
  } ],
  FriendInstructionView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b8dcbYyfQdOGoY8ZTBwsULI", "FriendInstructionView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const BaseWindows_1 = require("../../../framework/base/BaseWindows");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let FriendInvateInstructionView = class FriendInvateInstructionView extends BaseWindows_1.BaseWindows {
      constructor() {
        super(...arguments);
        this.isClickRect = true;
      }
      initUI(...args) {
        super.initUI(...args);
        this.initSelfUI();
      }
      initSelfUI() {}
      onBtnClick(event, customEventData) {
        0 == customEventData && GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.FRIEND_INSTRUCTION_VIEW);
      }
    };
    FriendInvateInstructionView.TAG = "FriendInvateInstructionView";
    __decorate([ property(cc.Label) ], FriendInvateInstructionView.prototype, "txtInstruction", void 0);
    FriendInvateInstructionView = __decorate([ ccclass ], FriendInvateInstructionView);
    exports.default = FriendInvateInstructionView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ViewConst": "ViewConst"
  } ],
  FriendInviteView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "70849/vWHVOKqSfvgzjrv5C", "FriendInviteView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var FriendInviteView_1;
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const moment = require("moment");
    const BaseView_1 = require("../../../framework/base/BaseView");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const LogUtil_1 = require("../../../framework/utils/LogUtil");
    const UIUtil_1 = require("../../../framework/utils/UIUtil");
    const Utils_1 = require("../../../framework/utils/Utils");
    const RedpackItemComp_1 = require("../../comps/hall/RedpackItemComp");
    const HallHttpConst_1 = require("../../const/HallHttpConst");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let FriendInviteView = FriendInviteView_1 = class FriendInviteView extends BaseView_1.BaseView {
      constructor() {
        super(...arguments);
        this.subList = [];
        this.proList = [];
        this.proRedpackList = [];
      }
      initUI(...args) {
        super.initUI(...args);
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this.onViewSizeChange, this);
        this.initSelfUI();
        try {
          GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetSubFriendList, {
            page: 1,
            pageSize: 10
          }, this.onSubFriendListResp, this);
          GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetProFriendList, {
            page: 1,
            pageSize: 10
          }, this.onProFriendListResp, this);
          GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetFriendAccount, {}, this.onFriendAccoutResp, this);
        } catch (error) {
          LogUtil_1.LogUtil.info(FriendInviteView_1.TAG, `${error}`);
        }
      }
      initSelfUI() {
        this.container.toggleItems[0].isChecked = true;
        this.proRoot.active = this.container.toggleItems[0].isChecked;
        this.subRoot.active = !this.proRoot.active;
      }
      onViewSizeChange() {
        let width = this.node.width;
        LogUtil_1.LogUtil.info(FriendInviteView_1.TAG, "onViewSizeChange width==>" + width);
        let widget = this.txtEffectPro.getComponent(cc.Widget);
        widget.left = width / 1280 * 432;
        widget.updateAlignment();
        widget = this.txtInfoProRule.getComponent(cc.Widget);
        widget.left = width / 1280 * 432;
        widget.updateAlignment();
        widget = this.txtActValue.getComponent(cc.Widget);
        widget.left = width / 1280 * 432;
        widget.updateAlignment();
      }
      onToggleChange(target, customEventData) {
        let checkIdx = 0;
        for (let i = 0; i < this.container.toggleItems.length; i++) {
          let item = this.container.toggleItems[i];
          if (item.isChecked) {
            checkIdx = i;
            break;
          }
        }
        this.proRoot.active = 0 == checkIdx;
        this.subRoot.active = !this.proRoot.active;
      }
      onSubFriendListResp(data) {
        if (data && 200 == data.code) {
          data = data.data;
          if (data) {
            if (data.list && data.list.length > 0) {
              this.subList = this.subList.concat(data.list);
              this.refleshSubFriend();
            }
            let total = data.total ? data.total : 0;
            if (this.subList < total) {
              let page = Math.floor(this.subList.length / 10) + 1;
              GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetFriendAccount, {
                page: page,
                pageSize: 10
              }, this.onSubFriendListResp, this);
            }
          }
        }
      }
      onProRedpackListResp(data) {
        if (data && 200 == data.code) {
          data = data.data;
          if (data.list && data.list.length > 0) {
            this.proRedpackList = this.proRedpackList.concat(data.list);
            this.refleshProRedpack();
          }
        }
      }
      refleshProRedpack() {
        let curIdx = this.redpackContent.childrenCount;
        for (let i = curIdx; i < this.proRedpackList.length; i++) {
          let item = cc.instantiate(this.redpackPrefab);
          item.addComponent(cc.Button);
          this.subContent.addChild(item);
          let redpackItem = item.getComponent(RedpackItemComp_1.default);
          redpackItem.init(this.proRedpackList[i]);
          let idx = i;
          UIUtil_1.UIUtil.addClickListener(item, this.onRedpackClick.bind(this, idx), this);
        }
      }
      onRedpackClick(idx) {}
      onProFriendListResp(data) {
        if (data && 200 == data.code) {
          data = data.data;
          if (data) {
            data.list && data.list.length > 0 && (this.proList = this.proList.concat(data.list));
            let total = data.total ? data.total : 0;
            if (this.proList < total) {
              let page = Math.floor(this.proList.length / 10) + 1;
              GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetFriendAccount, {
                page: page,
                pageSize: 10
              }, this.onSubFriendListResp, this);
            }
            let userInfo = GameGlobal_1.GameGlobal.DataManager.userInfo;
            let code = userInfo && userInfo.self_code ? userInfo.self_code : "0000";
            let id = GameGlobal_1.GameGlobal.DataManager.userInfo.userId;
            let link = document.URL.split("?")[0] + "?code=" + code;
            this.txtLink.string = link;
          }
        }
      }
      onFriendAccoutResp(data) {
        if (data && 200 == data.code) {
          data = data.data;
          if (data) {
            let curCount = data.currentNumberOfSubordinates;
            let effectCount = data.effectivePromotionNumber;
            let actCount = data.activitYesterday;
            let actSubCount = data.yesterdayctiveSubordinate;
            let str = GameGlobal_1.GameGlobal.Lang.t("Friend.InfoSub");
            this.txtCurSub.string = str + curCount;
            this.txtEffectPro.string = GameGlobal_1.GameGlobal.Lang.t("Friend.InfoEffectPro") + effectCount;
            this.txtActSubYes.string = GameGlobal_1.GameGlobal.Lang.t("Friend.InfoAct") + actSubCount;
            this.txtActValue.string = GameGlobal_1.GameGlobal.Lang.t("Friend.InfoActValue") + actCount;
          }
        }
      }
      refleshSubFriend() {
        let curIdx = this.subContent.childrenCount;
        for (let i = curIdx; i < this.subList.length; i++) {
          let item = cc.instantiate(this.subItemPrefab);
          item.addComponent(cc.Button);
          this.subContent.addChild(item);
          let txtNo = item.getChildByName("txtNo").getComponent(cc.Label);
          let txtName = item.getChildByName("txtName").getComponent(cc.Label);
          let txtRecharge = item.getChildByName("txtRecharge").getComponent(cc.Label);
          let txtConsumption = item.getChildByName("txtConsumption").getComponent(cc.Label);
          let txtActive = item.getChildByName("txtActive").getComponent(cc.Label);
          let txtDividends = item.getChildByName("txtDividends").getComponent(cc.Label);
          let txtRegister = item.getChildByName("txtRegister").getComponent(cc.Label);
          let txtLogin = item.getChildByName("txtLogin").getComponent(cc.Label);
          let btnOperate = item.getChildByName("btnOperate");
          let itemData = this.subList[i];
          let time = Date.parse(itemData.registrationime);
          const now = moment(time);
          const registrationime = moment(time).format("YYYY-MM-DD");
          time = Date.parse(itemData.loginTime);
          const loginTime = moment(time).format("YYYY-MM-DD");
          txtNo.string = i + "";
          txtName.string = itemData.nickName;
          txtRecharge.string = itemData.amountfRecharge;
          txtConsumption.string = itemData.amountOfConsumption;
          txtActive.string = itemData.activityValue;
          txtDividends.string = itemData.sharefDividends;
          txtRegister.string = registrationime;
          txtLogin.string = loginTime;
          let idx = i;
          UIUtil_1.UIUtil.addClickListener(btnOperate, this.onSubItemClick.bind(this, idx), this);
        }
      }
      onSubItemClick(idx) {
        LogUtil_1.LogUtil.info(FriendInviteView_1.TAG, "onSubItemClick");
        let item = this.subList[idx];
        let id = item.id ? item.id : "10212";
        GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.FRIEND_ACCOUNT_DETAIL, id);
      }
      onProItemAddClick(idx) {
        LogUtil_1.LogUtil.info(FriendInviteView_1.TAG, "onProItemAddClick");
      }
      onBtnClick(event, customEventData) {
        if (0 == customEventData) GameGlobal_1.GameGlobal.Viewer.closeView(ViewConst_1.ViewConst.ViewName.FRIEND_INVITE_VIEW); else if (1 == customEventData) {
          let bSucess = Utils_1.Utils.setPasteBoardContent(this.txtLink.string);
          GameGlobal_1.GameGlobal.TipManager.showTip(bSucess ? "Copy sucess" : "Copy error");
        } else 2 == customEventData && GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.FRIEND_INSTRUCTION_VIEW);
      }
    };
    FriendInviteView.TAG = "FriendInviteView";
    __decorate([ property(cc.ToggleContainer) ], FriendInviteView.prototype, "container", void 0);
    __decorate([ property(cc.Node) ], FriendInviteView.prototype, "subRoot", void 0);
    __decorate([ property(cc.Node) ], FriendInviteView.prototype, "proRoot", void 0);
    __decorate([ property(cc.Node) ], FriendInviteView.prototype, "subContent", void 0);
    __decorate([ property(cc.Prefab) ], FriendInviteView.prototype, "subItemPrefab", void 0);
    __decorate([ property(cc.Node) ], FriendInviteView.prototype, "redpackContent", void 0);
    __decorate([ property(cc.Prefab) ], FriendInviteView.prototype, "redpackPrefab", void 0);
    __decorate([ property(cc.Label) ], FriendInviteView.prototype, "txtLink", void 0);
    __decorate([ property(cc.Label) ], FriendInviteView.prototype, "txtCurSub", void 0);
    __decorate([ property(cc.Label) ], FriendInviteView.prototype, "txtEffectPro", void 0);
    __decorate([ property(cc.Label) ], FriendInviteView.prototype, "txtActSubYes", void 0);
    __decorate([ property(cc.Label) ], FriendInviteView.prototype, "txtActValue", void 0);
    __decorate([ property(cc.Label) ], FriendInviteView.prototype, "txtInfoProRule", void 0);
    FriendInviteView = FriendInviteView_1 = __decorate([ ccclass ], FriendInviteView);
    exports.default = FriendInviteView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseView": "BaseView",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../../framework/utils/LogUtil": "LogUtil",
    "../../../framework/utils/UIUtil": "UIUtil",
    "../../../framework/utils/Utils": "Utils",
    "../../comps/hall/RedpackItemComp": "RedpackItemComp",
    "../../const/HallHttpConst": "HallHttpConst",
    moment: 1
  } ],
  GameCtrl: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "62d31OWxjpHRaMwjYgkLddD", "GameCtrl");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.GameCtrl = void 0;
    var BaseCtrl_1 = require("../../framework/base/BaseCtrl");
    var LogUtil_1 = require("../../framework/utils/LogUtil");
    var HallModel_1 = require("../model/HallModel");
    var GameCtrl = function(_super) {
      __extends(GameCtrl, _super);
      function GameCtrl() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      GameCtrl.prototype.init = function() {
        LogUtil_1.LogUtil.info(GameCtrl.TAG, "init");
        this.initModel(HallModel_1.HallModel);
      };
      GameCtrl.TAG = "GameCtrl";
      return GameCtrl;
    }(BaseCtrl_1.BaseCtrl);
    exports.GameCtrl = GameCtrl;
    cc._RF.pop();
  }, {
    "../../framework/base/BaseCtrl": "BaseCtrl",
    "../../framework/utils/LogUtil": "LogUtil",
    "../model/HallModel": "HallModel"
  } ],
  GameDataManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d8d7c+U/69Faay60s5yKher", "GameDataManager");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.GameDataManager = void 0;
    const HallHttpConst_1 = require("../const/HallHttpConst");
    const Singleton_1 = require("../../framework/base/Singleton");
    const EventConst_1 = require("../../framework/const/EventConst");
    const GameGlobal_1 = require("../../framework/GameGlobal");
    const LogUtil_1 = require("../../framework/utils/LogUtil");
    class GameDataManager extends Singleton_1.Singleton {
      static getInstance() {
        return super.getInstance();
      }
      init() {
        cc.game.on(cc.game.EVENT_SHOW, this.onGameResume, this);
      }
      onGameResume() {
        this.startRefleshUser();
      }
      generateGuestAccount() {
        return `${Date.now()}${0 | (1e3 * Math.random(), 10)}`;
      }
      startRefleshUser(bDelay = true) {
        GameGlobal_1.GameGlobal.Timer.off(this.onRefleshUserTime, this);
        GameGlobal_1.GameGlobal.Timer.once(this.onRefleshUserTime, this, bDelay ? 3e3 : 0);
      }
      onRefleshUserTime() {
        GameGlobal_1.GameGlobal.Http.token ? GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetUserInfo, null, this.onUserInfoResp, this) : GameGlobal_1.GameGlobal.Timer.once(this.onRefleshUserTime, this, 3e3);
      }
      onUserInfoResp(data) {
        if (data && 200 == data.code && data.data) {
          this.userInfo = data.data;
          GameGlobal_1.GameGlobal.Eventer.dispatch(EventConst_1.EventConst.EventId.REFLESH_USER_INFO, this.userInfo);
        } else {
          let officiaUser = this.userInfo && this.userInfo.officia_user;
          officiaUser && GameGlobal_1.GameGlobal.Eventer.dispatch(EventConst_1.EventConst.EventId.TOKEN_EXPIRATTION);
        }
        GameGlobal_1.GameGlobal.Timer.once(this.onRefleshUserTime, this, 3e3);
      }
      onPing(data) {
        LogUtil_1.LogUtil.info(GameDataManager.TAG, data);
      }
      onPingTime() {
        GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetPing, null, this.onPing, this);
      }
      startPingTimer() {
        GameGlobal_1.GameGlobal.Timer.off(this.onPingTime, this);
        GameGlobal_1.GameGlobal.Timer.on(this.onPingTime, this, 5e3, -1);
      }
      vistiorLogin() {
        GameGlobal_1.GameGlobal.Http.post(HallHttpConst_1.default.PostVistorLogin, null, this.onVisitorLoginResp, this);
      }
      onVisitorLoginResp(data) {
        LogUtil_1.LogUtil.info(GameDataManager.TAG, "onVisitorLoginResp==>" + data);
        if (-1 != data && 200 == data.code && data.data) {
          let userInfo = data.data;
          let token = userInfo["accessToken"];
          if (token) {
            GameGlobal_1.GameGlobal.Store.setItem("token", token);
            let str = GameGlobal_1.GameGlobal.Store.getItem("token");
            LogUtil_1.LogUtil.info(GameDataManager.TAG, "str==>" + str);
            GameGlobal_1.GameGlobal.Http.token = token;
            this.startRefleshUser(false);
          }
        }
      }
    }
    exports.GameDataManager = GameDataManager;
    GameDataManager.TAG = "GameDataManager";
    cc._RF.pop();
  }, {
    "../../framework/GameGlobal": "GameGlobal",
    "../../framework/base/Singleton": "Singleton",
    "../../framework/const/EventConst": "EventConst",
    "../../framework/utils/LogUtil": "LogUtil",
    "../const/HallHttpConst": "HallHttpConst"
  } ],
  GameEngine: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "abe32zmcv9JSJdRdjEfrVih", "GameEngine");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var GameEngine_1;
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.GameEngine = void 0;
    const GameGlobal_1 = require("./GameGlobal");
    const SceneConst_1 = require("./const/SceneConst");
    const SystemConst_1 = require("./const/SystemConst");
    const EventConst_1 = require("./const/EventConst");
    const LogUtil_1 = require("./utils/LogUtil");
    const LoadingScene_1 = require("../game/scene/LoadingScene");
    const HallScene_1 = require("../game/scene/HallScene");
    const LoadingCtrl_1 = require("../game/control/LoadingCtrl");
    const HallCtrl_1 = require("../game/control/HallCtrl");
    const GameCtrl_1 = require("../game/control/GameCtrl");
    const FishGameScene_1 = require("../game/scene/FishGameScene");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let GameEngine = GameEngine_1 = class GameEngine extends cc.Component {
      constructor() {
        super(...arguments);
        this.waitPrefab = null;
      }
      onEnable() {}
      updateSize() {
        this.node.setContentSize(cc.winSize);
        LogUtil_1.LogUtil.info(GameEngine_1.TAG, "updateSize" + `cc.visibleRect:(${cc.visibleRect.width}, ${cc.visibleRect.height}), cc.winSize:(${cc.winSize.width}, ${cc.winSize.height})`);
        GameGlobal_1.GameGlobal.Viewer.windowSizeChange();
      }
      onDisable() {
        cc.view.off("canvas-resize", this.updateSize, this);
      }
      start() {
        cc.view.on("canvas-resize", this.updateSize, this);
        window.addEventListener("resize", this.onResize.bind(this));
        cc.game.addPersistRootNode(this.node);
        this.initGame();
        this.runGame();
      }
      onResize() {
        LogUtil_1.LogUtil.info(GameEngine_1.TAG, "cc.sys.os:" + cc.sys.os);
        {
          let width = 1280;
          let height = 720;
          let winSize = cc.view.getCanvasSize();
          if (winSize.width / winSize.height > 1280 / 720) {
            width = 1280 * winSize.width / winSize.height;
            cc.view.setDesignResolutionSize(width, height, cc.ResolutionPolicy.FIXED_HEIGHT);
            LogUtil_1.LogUtil.info(GameEngine_1.TAG, "fixHeight===> width:" + width + ", height = " + height);
          } else {
            height = 1280 * winSize.height / winSize.width;
            cc.view.setDesignResolutionSize(width, height, cc.ResolutionPolicy.FIXED_WIDTH);
            LogUtil_1.LogUtil.info(GameEngine_1.TAG, "fixWidth===> width:" + width + ", height = " + height);
          }
        }
        GameGlobal_1.GameGlobal.Viewer.windowSizeChange();
      }
      initGame() {
        this.initEngine();
        this.initModule();
        this.initScene();
        this.initCtrl();
      }
      runGame() {
        GameGlobal_1.GameGlobal.Eventer.dispatch(EventConst_1.EventConst.Event.GAME_START);
        GameGlobal_1.GameGlobal.Scene.openScene(SceneConst_1.SceneConst.SceneType.LoadingScene);
      }
      initEngine() {
        this.onResize();
        this.registerError();
        GameGlobal_1.GameGlobal.gameRoot = this.node;
        cc.assetManager.downloader.maxConcurrency = 10;
        cc.debug.setDisplayStats(false);
        cc._BaseNode.prototype.removeAllChildren = function(isDestroy = true) {
          const children = this._children;
          for (let i = children.length - 1; i >= 0; i--) {
            const node = children[i];
            if (node) {
              isDestroy && node.destroy();
              node.parent = null;
            }
          }
          this._children.length = 0;
        };
      }
      initModule() {
        GameGlobal_1.GameGlobal.Timer.init();
        GameGlobal_1.GameGlobal.Eventer.init();
        GameGlobal_1.GameGlobal.Config.init();
        GameGlobal_1.GameGlobal.Language.init();
        GameGlobal_1.GameGlobal.Lang.initLanguage();
        GameGlobal_1.GameGlobal.Platform.init();
        GameGlobal_1.GameGlobal.Resource.init();
        GameGlobal_1.GameGlobal.Socket.init();
        GameGlobal_1.GameGlobal.Sound.init();
        GameGlobal_1.GameGlobal.Viewer.init(this.waitPrefab);
        GameGlobal_1.GameGlobal.System.init();
        GameGlobal_1.GameGlobal.Scene.init();
        GameGlobal_1.GameGlobal.TipManager.init();
        GameGlobal_1.GameGlobal.DataManager.init();
        GameGlobal_1.GameGlobal.AD.init();
        GameGlobal_1.GameGlobal.Viewer.windowSizeChange();
      }
      update(dt) {
        GameGlobal_1.GameGlobal.Timer.update(dt);
        GameGlobal_1.GameGlobal.TipManager.update();
      }
      initScene() {
        GameGlobal_1.GameGlobal.Scene.register(SceneConst_1.SceneConst.SceneType.LoadingScene, LoadingScene_1.LoadingScene);
        GameGlobal_1.GameGlobal.Scene.register(SceneConst_1.SceneConst.SceneType.FishGameScene, FishGameScene_1.FishGameScene);
        GameGlobal_1.GameGlobal.Scene.register(SceneConst_1.SceneConst.SceneType.HallScene, HallScene_1.HallScene);
      }
      initCtrl() {
        GameGlobal_1.GameGlobal.System.register(SystemConst_1.SystemConst.SystemType.Loading, LoadingCtrl_1.LoadingCtrl, true);
        GameGlobal_1.GameGlobal.System.register(SystemConst_1.SystemConst.SystemType.Hall, HallCtrl_1.HallCtrl, true);
        GameGlobal_1.GameGlobal.System.register(SystemConst_1.SystemConst.SystemType.Game, GameCtrl_1.GameCtrl, true);
      }
      registerError() {
        window.onerror = function(msg, url, line, column, detail) {
          if (GameGlobal_1.GameGlobal.Platform.isLocal()) return;
          GameGlobal_1.GameGlobal.errorCnt++;
          if (GameGlobal_1.GameGlobal.errorCnt > 2) return;
          var errMsg = "ERROR:" + msg + "\n";
          try {
            errMsg += detail ? detail.stack || detail : "";
          } catch (e) {
            errMsg += "stack\u89e3\u6790\u5931\u8d25";
          }
          GameGlobal_1.GameGlobal.callJsFunc("reportError", errMsg);
        };
      }
    };
    GameEngine.TAG = "GameEngine";
    __decorate([ property(cc.Prefab) ], GameEngine.prototype, "waitPrefab", void 0);
    GameEngine = GameEngine_1 = __decorate([ ccclass ], GameEngine);
    exports.GameEngine = GameEngine;
    cc._RF.pop();
  }, {
    "../game/control/GameCtrl": "GameCtrl",
    "../game/control/HallCtrl": "HallCtrl",
    "../game/control/LoadingCtrl": "LoadingCtrl",
    "../game/scene/FishGameScene": "FishGameScene",
    "../game/scene/HallScene": "HallScene",
    "../game/scene/LoadingScene": "LoadingScene",
    "./GameGlobal": "GameGlobal",
    "./const/EventConst": "EventConst",
    "./const/SceneConst": "SceneConst",
    "./const/SystemConst": "SystemConst",
    "./utils/LogUtil": "LogUtil"
  } ],
  GameGlobal: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "55a0dHhNOxPvoDdLeqTrDHT", "GameGlobal");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.GameGlobal = void 0;
    const TimerManager_1 = require("./manager/TimerManager");
    const LanguageManager_1 = require("./manager/LanguageManager");
    const TipManager_1 = require("./manager/TipManager");
    const SoundManager_1 = require("./manager/SoundManager");
    const ResourceManager_1 = require("./manager/ResourceManager");
    const SocketManager_1 = require("./manager/SocketManager");
    const PlatformManager_1 = require("./manager/PlatformManager");
    const SceneManager_1 = require("./manager/SceneManager");
    const ConfigManager_1 = require("./manager/ConfigManager");
    const SystemManager_1 = require("./manager/SystemManager");
    const LocalManager_1 = require("./manager/LocalManager");
    const PoolManager_1 = require("./manager/PoolManager");
    const EventManager_1 = require("./manager/EventManager");
    const ViewManager_1 = require("./manager/ViewManager");
    const GameDataManager_1 = require("../game/manager/GameDataManager");
    const LanguageMgr_1 = require("../../i18n/runtime-scripts/LanguageMgr");
    const AdManager_1 = require("./manager/AdManager");
    const HttpManager_1 = require("./manager/HttpManager");
    const Dictionary_1 = require("./utils/Dictionary");
    class GameGlobal {
      static get fontFamily() {
        return window["font_family"] || "YuanTi";
      }
      static get _GAME_DATA_() {
        return window["_GAME_DATA_"] || {};
      }
      static get _GAME_FUNC_() {
        return window["_GAME_FUNC_"] || {};
      }
      static hasJsFunc(funcName) {
        if (GameGlobal._GAME_FUNC_[funcName]) return true;
        return false;
      }
      static BuildDecendantsBag(father, decendantsBag = null) {
        null == decendantsBag && (decendantsBag = new Dictionary_1.Dictionary());
        for (var i = 0; i < father.children.length; i++) {
          var child = father.children[i];
          decendantsBag.ContainsKey(child.name) || decendantsBag.Add(child.name, child);
          this.BuildDecendantsBag(child, decendantsBag);
        }
        return decendantsBag;
      }
      static callJsFunc(funcName, ...args) {
        if (GameGlobal._GAME_FUNC_[funcName]) return GameGlobal._GAME_FUNC_[funcName].apply(GameGlobal._GAME_FUNC_, args);
      }
      static getJsonFromUrl(url) {
        return new Promise((resolve, resject) => {
          this.Resource.loadRes(url, cc.JsonAsset, function(err, res) {
            if (err) {
              resject(err);
              return;
            }
            var jsonData = res.json;
            resolve(jsonData);
          });
        });
      }
      static getPrefabFromUrl(url) {
        return new Promise((resolve, resject) => {
          this.Resource.loadRes(url, cc.Prefab, function(err, prefab) {
            if (err) {
              resject(err);
              return;
            }
            resolve(prefab);
          });
        });
      }
      static setSpriteFormResourcesUrl(targetNode, url, callback) {
        this.Resource.loadRes(url, cc.SpriteFrame, function(err, spriteFrame) {
          if (err) {
            cc.warn(err);
            return;
          }
          if (!targetNode) {
            cc.warn("\u68c0\u67e5\u662f\u5426\u6709\u4f20\u76ee\u6807\u8282\u70b9!!!!");
            return;
          }
          targetNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
          callback && callback();
        });
      }
      static get Config() {
        return ConfigManager_1.ConfigManager.getInstance();
      }
      static get Eventer() {
        return EventManager_1.EventManager.getInstance();
      }
      static get Platform() {
        return PlatformManager_1.PlatformManager.getInstance();
      }
      static get Socket() {
        return SocketManager_1.SocketManager.getInstance();
      }
      static get Sound() {
        return SoundManager_1.SoundManager.getInstance();
      }
      static get Viewer() {
        return ViewManager_1.ViewManager.getInstance();
      }
      static get Scene() {
        return SceneManager_1.SceneManager.getInstance();
      }
      static get Resource() {
        return ResourceManager_1.ResourceManager.getInstance();
      }
      static get Language() {
        return LanguageManager_1.LanguageManager.getInstance();
      }
      static get Lang() {
        return LanguageMgr_1.default.Lang;
      }
      static get System() {
        return SystemManager_1.SystemManager.getInstance();
      }
      static get TipManager() {
        return TipManager_1.TipManager.getInstance();
      }
      static get Timer() {
        return TimerManager_1.TimerManager.getInstance();
      }
      static get Store() {
        return LocalManager_1.LocalManager.getInstance();
      }
      static get DataManager() {
        return GameDataManager_1.GameDataManager.getInstance();
      }
      static get AD() {
        return AdManager_1.AdManager.getInstance();
      }
      static get Http() {
        return HttpManager_1.HttpManager.getInstance();
      }
      static get Pool() {
        return PoolManager_1.PoolManager.getInstance();
      }
    }
    exports.GameGlobal = GameGlobal;
    GameGlobal.EVENT_HIDE = false;
    GameGlobal.EVENT_HIDE_TIME = 0;
    GameGlobal.downPx = 60;
    GameGlobal.errorCnt = 0;
    cc._RF.pop();
  }, {
    "../../i18n/runtime-scripts/LanguageMgr": "LanguageMgr",
    "../game/manager/GameDataManager": "GameDataManager",
    "./manager/AdManager": "AdManager",
    "./manager/ConfigManager": "ConfigManager",
    "./manager/EventManager": "EventManager",
    "./manager/HttpManager": "HttpManager",
    "./manager/LanguageManager": "LanguageManager",
    "./manager/LocalManager": "LocalManager",
    "./manager/PlatformManager": "PlatformManager",
    "./manager/PoolManager": "PoolManager",
    "./manager/ResourceManager": "ResourceManager",
    "./manager/SceneManager": "SceneManager",
    "./manager/SocketManager": "SocketManager",
    "./manager/SoundManager": "SoundManager",
    "./manager/SystemManager": "SystemManager",
    "./manager/TimerManager": "TimerManager",
    "./manager/TipManager": "TipManager",
    "./manager/ViewManager": "ViewManager",
    "./utils/Dictionary": "Dictionary"
  } ],
  GameModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b5a27wxHxFK84oBx99gLFrg", "GameModel");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.GameModel = void 0;
    var BaseModel_1 = require("../../framework/base/BaseModel");
    var LogUtil_1 = require("../../framework/utils/LogUtil");
    var GameModel = function(_super) {
      __extends(GameModel, _super);
      function GameModel() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      GameModel.prototype.init = function() {
        LogUtil_1.LogUtil.info(GameModel.TAG, "==>init");
      };
      GameModel.TAG = "GameModel";
      return GameModel;
    }(BaseModel_1.BaseModel);
    exports.GameModel = GameModel;
    cc._RF.pop();
  }, {
    "../../framework/base/BaseModel": "BaseModel",
    "../../framework/utils/LogUtil": "LogUtil"
  } ],
  GameScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e5a029YohhHaZKg+2/NO72M", "GameScene");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.GameScene = void 0;
    var BaseScene_1 = require("../../framework/base/BaseScene");
    var ViewConst_1 = require("../../framework/const/ViewConst");
    var GameGlobal_1 = require("../../framework/GameGlobal");
    var LogUtil_1 = require("../../framework/utils/LogUtil");
    var GameScene = function(_super) {
      __extends(GameScene, _super);
      function GameScene() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      GameScene.prototype.init = function() {
        LogUtil_1.LogUtil.info(GameScene.TAG, "==>init");
      };
      GameScene.prototype.onEnter = function() {
        _super.prototype.onEnter.call(this);
        LogUtil_1.LogUtil.info(GameScene.TAG, "onEnter");
        GameGlobal_1.GameGlobal.Viewer.closeLoadingUI();
        GameGlobal_1.GameGlobal.Viewer.closeAllViews();
        GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.FISH_GAME_VIEW);
      };
      GameScene.prototype.onExit = function() {
        _super.prototype.onExit.call(this);
        LogUtil_1.LogUtil.info(GameScene.TAG, "onExit");
      };
      GameScene.prototype.onBackKeyDown = function() {
        _super.prototype.onBackKeyDown.call(this);
        cc.sys.isNative && cc.sys.platform == cc.sys.ANDROID ? jsb.reflection.callStaticMethod("com/cocos/game/AppActivity", "exitApp", "()V") : cc.game.end();
      };
      GameScene.TAG = "GameScene";
      return GameScene;
    }(BaseScene_1.BaseScene);
    exports.GameScene = GameScene;
    cc._RF.pop();
  }, {
    "../../framework/GameGlobal": "GameGlobal",
    "../../framework/base/BaseScene": "BaseScene",
    "../../framework/const/ViewConst": "ViewConst",
    "../../framework/utils/LogUtil": "LogUtil"
  } ],
  GuideConst: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0d040mDU19P2o/U1GFm/TL7", "GuideConst");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.GuideConst = void 0;
    var GuideConst = function() {
      function GuideConst() {}
      GuideConst.HandleType = {
        None: 0,
        Focus: 1
      };
      GuideConst.GuideViewEnum = {
        Finger: "Finger",
        MoveFinger: "guideMoveFinger",
        Dialog: "Dialog",
        MaskLayer: "GuideMaskLayer"
      };
      GuideConst.DialogHeroName = {
        XS_nvshenxiang: "MSZ_xinshou_masha",
        XS_yase: "MSZ_xinshou_yase",
        XS_anheizhilong: "MSZ_xinshou_anheizhiwang"
      };
      GuideConst.GuideLayer = {
        Dialog: "prefab/Guide/GuideDialogView"
      };
      GuideConst.GuideId = {
        PveGuideId: 1e3,
        FirstMainPanel: 1001,
        GachaGuideId: 1004,
        EndlessGuideId: 1011,
        LoginGiftGuideId: 1012,
        PveLightSkillId: 1500,
        TreasureRob: 9e4,
        TreasureCompose: 90001,
        BattleFriend: 1e5,
        HuntGem: 11e4,
        PickGem: 110001
      };
      GuideConst.GuideGateId = 1;
      GuideConst.GuideWaveId = 10008;
      GuideConst.GuideEvent = {
        Pve_Battle_Pause: 1,
        Pve_Battle_Resume: 2,
        Pve_Show_Inspire: 3,
        Pve_Show_Storm: 4,
        Pve_Fight_Result: 5,
        Pve_Open_Build_Switch: 6,
        Pve_Close_Build_Switch: 7,
        Pve_Create_tmp_platform_flag: 8,
        Pve_show_tmp_platform_flag: 9,
        Pve_show_play_special_skill: 10,
        Pve_Line_Up_Hero: 11,
        Pve_Start_Battle: 12,
        Pve_Show_Create_Role: 13,
        Pve_GRIL_MOVING: 14,
        Pve_Full_Anger_Power: 20,
        Pve_Light_Skill_Guide: 21,
        Pvp_Battle_Pause: 30,
        Pvp_Battle_Resume: 31,
        Pvp_Show_Hero: 32,
        Fly_Hero: 33,
        Disable_Scroll: 34,
        Enable_Scroll: 35,
        Chapter_Fly_Hero: 36
      };
      GuideConst.GuideCustomCond = {
        ImmortalTask: 1,
        ImmortalUpgrade: 2,
        WithEquip: 3,
        FightReady: 4,
        FightEnd: 5,
        GachaAniEnd: 6,
        WithoutHero: 7,
        PveSpeedUnlock: 8,
        TreasureCanRob: 9,
        TreasureCanCompose: 10,
        WillShowLevelUp: 11,
        MainSceneLoaded: 12,
        PveChapterId: 13,
        PveLightSkillUnlock: 14,
        PveLightSkillGuideBegin: 15,
        CanEmbattle: 16,
        AfterHeroFly: 17,
        TaskReward: 18,
        SmeltTask: 19,
        SmeltTask1: 20,
        SmeltTaskEvent: 21,
        NewChapterEvent: 22
      };
      GuideConst.MaskTag = 12121;
      GuideConst.NewSystemKey = "NewSystemKey";
      return GuideConst;
    }();
    exports.GuideConst = GuideConst;
    cc._RF.pop();
  }, {} ],
  HallConst: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f79e06XyL9LxKEC6jb+MHg2", "HallConst");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    class HallConst {}
    exports.default = HallConst;
    HallConst.PhoneHeads = [ "+86", "+55", "+91", "+84", "+63", "+60", "+66", "+62", "+007" ];
    HallConst.Heads = [ "head_0", "head_1", "head_2", "head_3", "head_4", "head_5", "head_6", "head_7", "head_8", "head_9" ];
    cc._RF.pop();
  }, {} ],
  HallCtrl: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "48157emC25J/5BzBrm3fJj/", "HallCtrl");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.HallCtrl = void 0;
    var BaseCtrl_1 = require("../../framework/base/BaseCtrl");
    var LogUtil_1 = require("../../framework/utils/LogUtil");
    var GameModel_1 = require("../model/GameModel");
    var HallCtrl = function(_super) {
      __extends(HallCtrl, _super);
      function HallCtrl() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      HallCtrl.prototype.init = function() {
        LogUtil_1.LogUtil.info(HallCtrl.TAG, "init");
        this.initModel(GameModel_1.GameModel);
      };
      HallCtrl.TAG = "HallCtrl";
      return HallCtrl;
    }(BaseCtrl_1.BaseCtrl);
    exports.HallCtrl = HallCtrl;
    cc._RF.pop();
  }, {
    "../../framework/base/BaseCtrl": "BaseCtrl",
    "../../framework/utils/LogUtil": "LogUtil",
    "../model/GameModel": "GameModel"
  } ],
  HallHttpConst: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3ac48no6plFEqJOrZ9CUnE/", "HallHttpConst");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    class HallHttpConst {}
    exports.default = HallHttpConst;
    HallHttpConst.URL = "http://8.130.92.102:8888";
    HallHttpConst.GetUserInfo = HallHttpConst.URL + "/user/info";
    HallHttpConst.PostUserInfo = HallHttpConst.URL + "/user/head";
    HallHttpConst.PostUserPas = HallHttpConst.URL + "/user/pass";
    HallHttpConst.PostUserCode = HallHttpConst.URL + "/user/sendcode";
    HallHttpConst.PostUserBindPhone = HallHttpConst.URL + "/user/bingphone";
    HallHttpConst.GetPing = HallHttpConst.URL + "/ping";
    HallHttpConst.PostVistorLogin = HallHttpConst.URL + "/visitor/login";
    HallHttpConst.PostLogin = HallHttpConst.URL + "/user/login";
    HallHttpConst.GetUserFortList = HallHttpConst.URL + "/user/knapsack/fort";
    HallHttpConst.PostFortUpdate = HallHttpConst.URL + "/user/knapsack/upgrade-fort";
    HallHttpConst.GetUserPropList = HallHttpConst.URL + "/user/knapsack/prop";
    HallHttpConst.GetShopFortList = HallHttpConst.URL + "/mall/fort";
    HallHttpConst.GetShopPropList = HallHttpConst.URL + "/mall/prop";
    HallHttpConst.PostPurchaseFort = HallHttpConst.URL + "/mall/purchase_fort";
    HallHttpConst.PostPurchaseProp = HallHttpConst.URL + "/mall/purchase_prop";
    HallHttpConst.GetFriendAccount = HallHttpConst.URL + "/invite/aggregation";
    HallHttpConst.GetProFriendList = HallHttpConst.URL + "/invite/promotion";
    HallHttpConst.GetSubFriendList = HallHttpConst.URL + "/invite/subordinateist";
    HallHttpConst.GetSubFriendDetail = HallHttpConst.URL + "/invite/subordinateist/details";
    HallHttpConst.GetBonusTurtle = HallHttpConst.URL + "/turtle/dividends";
    HallHttpConst.PostUpgradeTurtle = HallHttpConst.URL + "/turtle/upgrade";
    HallHttpConst.GetMoneyHistoryLock = HallHttpConst.URL + "/user/history-manage-money";
    HallHttpConst.GetMoneyLockWarehouse = HallHttpConst.URL + "/user/manage-money";
    HallHttpConst.GetMoneyMyCoin = HallHttpConst.URL + "/user/self-manage-money";
    HallHttpConst.PostMoneyBuy = HallHttpConst.URL + "/user/purchase-manage";
    cc._RF.pop();
  }, {} ],
  HallModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0c9ad5LUuZANbVTYS9aAZch", "HallModel");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.HallModel = void 0;
    var BaseModel_1 = require("../../framework/base/BaseModel");
    var LogUtil_1 = require("../../framework/utils/LogUtil");
    var HallModel = function(_super) {
      __extends(HallModel, _super);
      function HallModel() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      HallModel.prototype.init = function() {
        LogUtil_1.LogUtil.info(HallModel.TAG, "==>init");
      };
      HallModel.TAG = "HallModel";
      return HallModel;
    }(BaseModel_1.BaseModel);
    exports.HallModel = HallModel;
    cc._RF.pop();
  }, {
    "../../framework/base/BaseModel": "BaseModel",
    "../../framework/utils/LogUtil": "LogUtil"
  } ],
  HallScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fcc81q3m5xGpbPXgwtbj+1O", "HallScene");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.HallScene = void 0;
    var BaseScene_1 = require("../../framework/base/BaseScene");
    var ViewConst_1 = require("../../framework/const/ViewConst");
    var GameGlobal_1 = require("../../framework/GameGlobal");
    var LogUtil_1 = require("../../framework/utils/LogUtil");
    var HallScene = function(_super) {
      __extends(HallScene, _super);
      function HallScene() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      HallScene.prototype.init = function() {
        LogUtil_1.LogUtil.info(HallScene.TAG, "==>init");
      };
      HallScene.prototype.onEnter = function() {
        _super.prototype.onEnter.call(this);
        LogUtil_1.LogUtil.info(HallScene.TAG, "onEnter");
        GameGlobal_1.GameGlobal.Viewer.closeLoadingUI();
        GameGlobal_1.GameGlobal.Viewer.closeAllViews();
        GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.HALL_VIEW);
      };
      HallScene.prototype.onExit = function() {
        _super.prototype.onExit.call(this);
        LogUtil_1.LogUtil.info(HallScene.TAG, "onExit");
      };
      HallScene.prototype.onBackKeyDown = function() {
        _super.prototype.onBackKeyDown.call(this);
        cc.sys.isNative && cc.sys.platform == cc.sys.ANDROID ? jsb.reflection.callStaticMethod("com/cocos/game/AppActivity", "exitApp", "()V") : cc.game.end();
      };
      HallScene.TAG = "PveScene";
      return HallScene;
    }(BaseScene_1.BaseScene);
    exports.HallScene = HallScene;
    cc._RF.pop();
  }, {
    "../../framework/GameGlobal": "GameGlobal",
    "../../framework/base/BaseScene": "BaseScene",
    "../../framework/const/ViewConst": "ViewConst",
    "../../framework/utils/LogUtil": "LogUtil"
  } ],
  HallView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3fb9a8DGlRFt6LNHLupYT4z", "HallView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var HallView_1;
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const BaseView_1 = require("../../../framework/base/BaseView");
    const EventConst_1 = require("../../../framework/const/EventConst");
    const ResConst_1 = require("../../../framework/const/ResConst");
    const SceneConst_1 = require("../../../framework/const/SceneConst");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const LogUtil_1 = require("../../../framework/utils/LogUtil");
    const TextUtil_1 = require("../../../framework/utils/TextUtil");
    const UIUtil_1 = require("../../../framework/utils/UIUtil");
    const Utils_1 = require("../../../framework/utils/Utils");
    const HallConst_1 = require("../../const/HallConst");
    const HallHttpConst_1 = require("../../const/HallHttpConst");
    const NoticeVo_1 = require("../../logic/hall/NoticeVo");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let HallView = HallView_1 = class HallView extends BaseView_1.BaseView {
      constructor() {
        super(...arguments);
        this.notices = [];
        this.noticeIdx = 0;
      }
      onEnter() {
        super.onEnter();
        this.userLogin();
        this.initNotices([ "alfjdlafjlasjflajfdla", "jlajf;afvdafvlasjf;dsak", "lajfdlasjflsajfq", "qpwuftprqejf;'admfv;'da", "flafjd;asjf;afjoaghow[" ]);
      }
      onExit() {
        super.onExit();
      }
      onRelease() {
        super.onRelease();
      }
      initUI(...args) {
        super.initUI(...args);
        this.initSelfUI(args[0]);
      }
      initSelfUI(power) {
        this.boxRoot.active = false;
      }
      onLoad() {
        super.onLoad();
      }
      start() {
        super.start();
      }
      addAllListeners() {
        super.addAllListeners();
        GameGlobal_1.GameGlobal.Eventer.addListener(EventConst_1.EventConst.EventId.REFLESH_USER_INFO, this.onRefleshUserInfo, this);
        GameGlobal_1.GameGlobal.Eventer.addListener(EventConst_1.EventConst.EventId.TOKEN_EXPIRATTION, this.onTokenExpiration, this);
        this.node.on(cc.Node.EventType.SIZE_CHANGED, this.onViewSizeChange, this);
      }
      adapterUp() {
        let width = this.node.width;
        let originUpW = this.btnLogin.active ? 736 : 620;
        let btnLoginW = this.btnLogin.active ? 132 : 0;
        let topCount = this.btnLogin.active ? 3 : 2;
        let upW = width / 1280 * originUpW;
        let upDx = (upW - 180 - 190 - 210 - btnLoginW) / topCount;
        this.upLayout.spacingX = upDx;
        this.upLayout.updateLayout();
      }
      adapterBottom() {
        let width = this.node.width;
        let bottomW = width / 1280 * 622;
        let bottomDx = (bottomW - 440) / 4;
        this.bottomLayout.spacingX = bottomDx;
        this.bottomLayout.updateLayout();
      }
      onViewSizeChange(event, customEventData) {
        this.adapterUp();
        this.adapterBottom();
      }
      userLogin() {
        let token = GameGlobal_1.GameGlobal.Store.getItem("token");
        if (TextUtil_1.TextUtil.isEmpty(token)) GameGlobal_1.GameGlobal.Http.post(HallHttpConst_1.default.PostVistorLogin, null, this.onVisitorLoginResp, this); else {
          GameGlobal_1.GameGlobal.Http.token = token;
          GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetUserInfo, null, this.onFirstUserInfoResp, this);
        }
      }
      onBtnCloseClick(event, customEventData) {}
      onBtnClick(event, customEventData) {
        this.boxRoot.active && this.onPushClick(null, null);
        0 == customEventData ? cc.director.loadScene("fish", () => {
          GameGlobal_1.GameGlobal.Viewer.initLayers();
          GameGlobal_1.GameGlobal.Scene.openScene(SceneConst_1.SceneConst.SceneType.FishGameScene);
          GameGlobal_1.GameGlobal.Eventer.dispatch(EventConst_1.EventConst.EventId.ON_SCENE_CHANGED);
        }) : 1 == customEventData ? GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.BACKPACK_VIEW) : 2 == customEventData ? GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.SHOP_VIEW) : 3 == customEventData ? GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.BIND_PHONE_VIEW) : 4 == customEventData ? GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.MAIL_VIEW) : 5 == customEventData || (6 == customEventData ? GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.YLB_VIEW) : 7 == customEventData || 8 == customEventData || (9 == customEventData ? GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.FRIEND_INVITE_VIEW) : 10 == customEventData || 11 == customEventData || 12 == customEventData || 13 == customEventData || 14 == customEventData || 15 == customEventData || (16 == customEventData ? GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.CHANGE_PASSWORD_VIEW) : 17 == customEventData ? GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.EXIT_TIPS_VIEW) : 18 == customEventData ? GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.USER_INFO_VIEW) : 19 == customEventData ? GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.BONUS_TURTLE_VIEW) : 20 == customEventData ? GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.LOGIN_VIEW) : 21 == customEventData && GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.BIND_PHONE_VIEW))));
      }
      onPullClick(event, customEventData) {
        if (this.boxRoot.active) this.onPushClick(null, null); else {
          UIUtil_1.UIUtil.stopAllAnimation(this.boxContet);
          this.boxRoot.active = true;
          let dy0 = this.btnExpand.height / 2;
          let pos = this.btnExpand.convertToWorldSpaceAR(new cc.Vec2(0, dy0));
          pos = this.boxRoot.convertToNodeSpaceAR(pos);
          this.boxContet.x = pos.x;
          this.boxContet.y = pos.y;
          this.boxContet.height = 90;
          let padTop = this.btnExpand.height + 10;
          let padBottom = 10;
          let dy = 10;
          let itemHeight = this.boxContet.children[0].height;
          let height = padBottom + padTop + dy * (this.boxContet.childrenCount - 1) + this.boxContet.childrenCount * itemHeight;
          GameGlobal_1.GameGlobal.Resource.setFrame("", this.btnExpand, ResConst_1.ResConst.PLIST_PATH.HALL, "hall_btn_more_up");
          cc.tween(this.boxContet).to(.2, {
            height: height
          }, {
            easing: "sineOut"
          }).start();
          for (let i = 0; i < this.boxContet.childrenCount; i++) {
            let node = this.boxContet.children[i];
            let destY = padTop + itemHeight / 2 + (itemHeight + dy) * i;
            let y = itemHeight / 2;
            node.y = -y;
            cc.tween(node).to(.2, {
              y: -destY
            }, {
              easing: "sineOut"
            }).start();
          }
        }
      }
      onPushClick(event, customEventData) {
        UIUtil_1.UIUtil.stopAllAnimation(this.boxContet);
        cc.tween(this.boxContet).to(.2, {
          height: 0
        }, {
          easing: "sineIn"
        }).call(() => {
          this.boxRoot.active = false;
          GameGlobal_1.GameGlobal.Resource.setFrame("", this.btnExpand, ResConst_1.ResConst.PLIST_PATH.HALL, "hall_btn_more_down");
        }).start();
        let itemHeight = this.boxContet.children[0].height;
        let destY = itemHeight / 2;
        for (let i = 0; i < this.boxContet.childrenCount; i++) {
          let node = this.boxContet.children[i];
          cc.tween(node).to(.2, {
            y: -destY
          }, {
            easing: "sineOut"
          }).start();
        }
      }
      initNotices(notices) {
        for (let i = 0; i < notices.length; i++) {
          let flag = false;
          for (let j = 0; j < this.notices.length; j++) if (this.notices[j].text == notices[i]) {
            flag = true;
            break;
          }
          if (!flag) {
            let vo = new NoticeVo_1.default();
            vo.text = notices[i];
            vo.times = Utils_1.Utils.randomInt(1, 5);
            this.notices.push(vo);
          }
        }
        this.startOneNoticeAni(this.notices.length - 1);
      }
      startOneNoticeAni(idx) {
        if (idx < this.notices.length && idx >= 0) {
          let vo = this.notices[idx];
          this.txtNotice.string = vo.text;
          this.txtNotice.node.x = this.txtNotice.node.parent.width;
          this.txtNotice["_forceUpdateRenderData"]();
          let width = this.txtNotice.node.width;
          cc.tween(this.txtNotice.node).to(5, {
            x: -width
          }).call(() => {
            vo.times--;
            if (vo.times <= 0) {
              let tmpIdx = this.notices.indexOf(vo);
              -1 != tmpIdx && this.notices.splice(tmpIdx, 1);
            }
            let newIdx = idx - 1;
            newIdx < 0 && (newIdx = this.notices.length - 1);
            this.startOneNoticeAni(newIdx);
          }).start();
        }
      }
      refreshUserInfo(userInfo) {
        if (!userInfo) {
          LogUtil_1.LogUtil.info(HallView_1.TAG, "refreshUserInfo but userInfo is null");
          return;
        }
        let coin = userInfo["coin"];
        let power = userInfo["energy"];
        let fuel = userInfo["fuel"];
        let act = userInfo["brisk"];
        let income = userInfo["income"];
        let nick = userInfo["nickname"];
        let headUrl = userInfo["headurl"];
        let phone = userInfo["phone"];
        let officiaUser = userInfo["officia_user"];
        this.txtNick.string = nick || "Unknow Name";
        this.txtCoin.string = coin ? Utils_1.Utils.getShowCoin(coin) : "0";
        this.txtPower.string = power ? `${power}` : "0";
        this.txtFuel.string = fuel ? `${fuel}` : "0";
        this.txtAct.string = act ? `${act}` : "0";
        this.txtIncome.string = income ? `${income}/min` : "0/min";
        this.btnBind.active = TextUtil_1.TextUtil.isEmpty(phone);
        let oldLoginActive = this.btnLogin.active;
        this.btnLogin.active = !!!officiaUser;
        oldLoginActive != this.btnLogin.active && this.adapterUp();
        headUrl = Number.parseInt(headUrl);
        let headIdx = isNaN(headUrl) ? 0 : headUrl % HallConst_1.default.Heads.length;
        GameGlobal_1.GameGlobal.Resource.setFrame("", this.sHead.node, ResConst_1.ResConst.PLIST_PATH.HEAD, HallConst_1.default.Heads[headIdx]);
      }
      onFirstUserInfoResp(data) {
        LogUtil_1.LogUtil.info(HallView_1.TAG, "onFirstUserInfoResp===>" + JSON.stringify(data));
        if (200 == data.code && data.data) {
          this.refreshUserInfo(data.data);
          GameGlobal_1.GameGlobal.DataManager.startRefleshUser();
          GameGlobal_1.GameGlobal.DataManager.userInfo = data.data;
        } else if (200 != data.code) {
          GameGlobal_1.GameGlobal.Store.removeItem("token");
          GameGlobal_1.GameGlobal.Http.token = null;
          GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.LOGIN_TIPS_VIEW);
        }
      }
      onRefleshUserInfo() {
        let userInfo = GameGlobal_1.GameGlobal.DataManager.userInfo;
        this.refreshUserInfo(userInfo);
      }
      onTokenExpiration() {
        let userInfo = GameGlobal_1.GameGlobal.DataManager.userInfo;
        let officiaUser = userInfo && userInfo.officia_user;
        if (officiaUser) {
          GameGlobal_1.GameGlobal.DataManager.userInfo = {};
          GameGlobal_1.GameGlobal.Eventer.dispatch(EventConst_1.EventConst.EventId.REFLESH_USER_INFO, GameGlobal_1.GameGlobal.DataManager.userInfo);
          GameGlobal_1.GameGlobal.DataManager.vistiorLogin();
        }
        GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.LOGIN_TIPS_VIEW);
      }
      onVisitorLoginResp(data) {
        LogUtil_1.LogUtil.info(HallView_1.TAG, "onVisitorLoginResp==>" + data);
        if (-1 != data && 200 == data.code && data.data) {
          let userInfo = data.data;
          let token = userInfo["accessToken"];
          if (token) {
            GameGlobal_1.GameGlobal.Store.setItem("token", token);
            let str = GameGlobal_1.GameGlobal.Store.getItem("token");
            LogUtil_1.LogUtil.info(HallView_1.TAG, "str==>" + str);
            GameGlobal_1.GameGlobal.Http.token = token;
            GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetUserInfo, null, this.onFirstUserInfoResp, this);
          }
        }
      }
    };
    HallView.TAG = "HallView";
    HallView.DEBUG = true;
    __decorate([ property(cc.Node) ], HallView.prototype, "boxRoot", void 0);
    __decorate([ property(cc.Node) ], HallView.prototype, "boxContet", void 0);
    __decorate([ property(cc.Node) ], HallView.prototype, "btnExpand", void 0);
    __decorate([ property(cc.Label) ], HallView.prototype, "txtNotice", void 0);
    __decorate([ property(cc.Label) ], HallView.prototype, "txtNick", void 0);
    __decorate([ property(cc.Sprite) ], HallView.prototype, "sHead", void 0);
    __decorate([ property(cc.Label) ], HallView.prototype, "txtFuel", void 0);
    __decorate([ property(cc.Label) ], HallView.prototype, "txtIncome", void 0);
    __decorate([ property(cc.Label) ], HallView.prototype, "txtCoin", void 0);
    __decorate([ property(cc.Label) ], HallView.prototype, "txtPower", void 0);
    __decorate([ property(cc.Label) ], HallView.prototype, "txtAct", void 0);
    __decorate([ property(cc.Layout) ], HallView.prototype, "bottomLayout", void 0);
    __decorate([ property(cc.Layout) ], HallView.prototype, "upLayout", void 0);
    __decorate([ property(cc.Widget) ], HallView.prototype, "midLeft", void 0);
    __decorate([ property(cc.Widget) ], HallView.prototype, "midRight0", void 0);
    __decorate([ property(cc.Widget) ], HallView.prototype, "midRight1", void 0);
    __decorate([ property(cc.Node) ], HallView.prototype, "btnLogin", void 0);
    __decorate([ property(cc.Node) ], HallView.prototype, "btnBind", void 0);
    HallView = HallView_1 = __decorate([ ccclass ], HallView);
    exports.default = HallView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseView": "BaseView",
    "../../../framework/const/EventConst": "EventConst",
    "../../../framework/const/ResConst": "ResConst",
    "../../../framework/const/SceneConst": "SceneConst",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../../framework/utils/LogUtil": "LogUtil",
    "../../../framework/utils/TextUtil": "TextUtil",
    "../../../framework/utils/UIUtil": "UIUtil",
    "../../../framework/utils/Utils": "Utils",
    "../../const/HallConst": "HallConst",
    "../../const/HallHttpConst": "HallHttpConst",
    "../../logic/hall/NoticeVo": "NoticeVo"
  } ],
  HttpManagerOld: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9bcf4C2JQNHtJHPe8fWBXLX", "HttpManagerOld");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.HttpManagerOld = void 0;
    var Singleton_1 = require("../base/Singleton");
    var HttpManagerOld = function(_super) {
      __extends(HttpManagerOld, _super);
      function HttpManagerOld() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.timeOut = 5e3;
        _this._token = null;
        return _this;
      }
      HttpManagerOld.getInstance = function() {
        return _super.getInstance.call(this);
      };
      Object.defineProperty(HttpManagerOld.prototype, "token", {
        set: function(t) {
          this._token = t;
        },
        enumerable: false,
        configurable: true
      });
      HttpManagerOld.prototype.sendRequest = function(url, params, callback) {
        if (null == url) return;
        var request = new XMLHttpRequest();
        request.timeout = this.timeOut;
        var r = "?";
        for (var c in params) {
          "?" != r && (r += "&");
          r += c + "=" + params[c];
        }
        null != params && "" !== params || (r = "");
        var s = url + encodeURI(r);
        request.open("GET", s, true);
        this._token && request.setRequestHeader("Authorization", this._token);
        request.setRequestHeader("Accept", "application/json");
        request.onerror = function(t) {
          callback && callback(-1);
        };
        request.ontimeout = function() {
          callback && callback(-1);
        };
        request.onreadystatechange = function() {
          if (4 === request.readyState && request.status >= 200 && request.status < 300) try {
            var t = JSON.parse(request.responseText);
            callback && callback(t);
          } catch (err) {
            callback && callback(-1);
          } else 4 === request.readyState && callback && callback(-1);
        };
        request.send();
        return request;
      };
      HttpManagerOld.prototype.sendPost = function(url, body, callback) {
        var request = new XMLHttpRequest();
        request.onerror = function(t) {
          callback && callback(-1);
        }, request.ontimeout = function() {
          callback && callback(-1);
        }, request.onreadystatechange = function() {
          if (4 === request.readyState && request.status >= 200 && request.status < 300) try {
            var t = request.responseText;
            t = JSON.parse(t);
            callback && callback(t);
          } catch (t) {
            null != callback && callback(-1);
          } else 4 === request.readyState && null != callback && callback(-1);
        };
        request.open("POST", url, true);
        this._token && request.setRequestHeader("Authorization", this._token);
        request.setRequestHeader("Accept", "application/json");
        cc.sys.isNative && request.setRequestHeader("Accept-Encoding", "gzip,deflate");
        request.timeout = this.timeOut;
        request.send(body);
      };
      return HttpManagerOld;
    }(Singleton_1.Singleton);
    exports.HttpManagerOld = HttpManagerOld;
    cc._RF.pop();
  }, {
    "../base/Singleton": "Singleton"
  } ],
  HttpManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2b5b5541O9MFo5mrl6dywaf", "HttpManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.HttpManager = void 0;
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Singleton_1 = require("../base/Singleton");
    var TextUtil_1 = require("../utils/TextUtil");
    var HttpVo_1 = require("./HttpVo");
    var HttpManager = function(_super) {
      __extends(HttpManager, _super);
      function HttpManager() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._httpVos = [];
        _this._token = null;
        _this._selfHttpVos = [];
        return _this;
      }
      HttpManager.getInstance = function() {
        return _super.getInstance.call(this);
      };
      Object.defineProperty(HttpManager.prototype, "token", {
        get: function() {
          return this._token;
        },
        set: function(token) {
          this._token = token;
        },
        enumerable: false,
        configurable: true
      });
      HttpManager.prototype.onError = function(xhr) {
        for (var i = 0; i < this._httpVos.length; i++) {
          var vo = this._httpVos[i];
          if (vo.xhr === xhr) {
            if (vo.thisObj && vo.callBack && xhr) if (xhr.responseText) {
              var json = null;
              try {
                json = JSON.parse(xhr.responseText);
              } catch (e) {
                cc.log("00000==>xhr.responseText:", xhr.responseText);
                json = {
                  code: "-9999",
                  message: "" + (xhr.responseText ? xhr.responseText : "\u5ba2\u6237\u7aefHTTP\u8fd4\u56de\u9519\u8bef!"),
                  data: null
                };
              }
              vo.callBack.call(vo.thisObj, json);
            } else vo.callBack.call(vo.thisObj, {
              code: "-9998",
              message: "\u7f51\u7edc\u8fde\u63a5\u9519\u8bef!",
              data: null
            });
            this._httpVos.splice(i, 1);
            break;
          }
        }
      };
      HttpManager.prototype.onTimeOut = function(xhr) {
        for (var i = 0; i < this._httpVos.length; i++) {
          var vo = this._httpVos[i];
          if (vo.xhr === xhr) {
            this._httpVos.splice(i, 1);
            if (vo.thisObj && vo.callBack) {
              cc.log(">>>>>onTimeOut url = " + vo.url);
              vo.callBack.call(vo.thisObj, -1);
            }
            break;
          }
        }
      };
      HttpManager.prototype.onReadStateChange = function(xhr) {
        for (var i = 0; i < this._httpVos.length; i++) {
          var vo = this._httpVos[i];
          if (vo.xhr === xhr) {
            if (4 == xhr.readyState && xhr.status >= 200 && xhr.status < 300) {
              this._httpVos.splice(i, 1);
              if (vo.thisObj && vo.callBack) {
                var json = null;
                try {
                  json = JSON.parse(xhr.responseText);
                } catch (e) {
                  cc.log("11111==>xhr.responseText:", xhr.responseText);
                  json = {
                    code: "-9999",
                    message: "" + (xhr.responseText ? xhr.responseText : "\u5ba2\u6237\u7aefHTTP\u8fd4\u56de\u9519\u8bef!"),
                    data: null
                  };
                }
                json && vo.callBack.call(vo.thisObj, json);
              }
            } else if (4 == xhr.readyState && (xhr.status < 200 || xhr.status >= 300)) {
              this._httpVos.splice(i, 1);
              if (vo.thisObj) {
                var json = null;
                try {
                  json = JSON.parse(xhr.responseText);
                } catch (e) {
                  cc.log("22222==>xhr.responseText:", xhr.responseText);
                  json = {
                    code: "-9999",
                    message: "" + (xhr.responseText ? xhr.responseText : "\u5ba2\u6237\u7aefHTTP\u8fd4\u56de\u9519\u8bef!"),
                    data: null
                  };
                }
                vo.callBack.call(vo.thisObj, json);
              }
            }
            break;
          }
        }
      };
      HttpManager.prototype.httpPartInit = function(xhr, url, callback, thisObj, fTime) {
        var vo = new HttpVo_1.HttpVo();
        vo.callBack = callback;
        vo.thisObj = thisObj;
        vo.xhr = xhr;
        vo.url = url;
        this._httpVos.push(vo);
        xhr.timeout = fTime;
        var self = this;
        xhr.ontimeout = function(data) {
          self.onTimeOut(xhr);
          xhr.abort();
        };
        xhr.onerror = function() {
          self.onError(xhr);
          xhr.abort();
        };
        xhr.onreadystatechange = function() {
          self.onReadStateChange(xhr);
        };
      };
      HttpManager.prototype.selfPost = function(url, params, callback, thisObj, bSigned, fTime) {
        void 0 === bSigned && (bSigned = true);
        void 0 === fTime && (fTime = 3e4);
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("POST", url, true);
        var dataStr = this.dataToString(params);
        this.httpPartInit(xhr, url, callback, thisObj, fTime);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        this._token && bSigned && xhr.setRequestHeader("Authorization", this._token);
        xhr.send(dataStr);
      };
      HttpManager.prototype.post = function(url, params, callback, thisObj, bSigned, fTime) {
        void 0 === bSigned && (bSigned = true);
        void 0 === fTime && (fTime = 5e3);
        this.selfPost(url, params, callback, thisObj, bSigned, fTime);
      };
      HttpManager.prototype.get = function(url, params, callback, thisObj, bSigned, fTime) {
        void 0 === bSigned && (bSigned = true);
        void 0 === fTime && (fTime = 5e3);
        this.selfGet(url, params, callback, thisObj, bSigned, fTime);
      };
      HttpManager.prototype.selfGet = function(url, params, callback, thisObj, bSigned, fTime) {
        void 0 === bSigned && (bSigned = true);
        void 0 === fTime && (fTime = 5e3);
        var xhr = cc.loader.getXMLHttpRequest();
        null == params && (params = {});
        var dataStr = this.dataToString(params);
        var newUrl = url;
        TextUtil_1.TextUtil.isEmpty(dataStr) || (newUrl += "?" + dataStr);
        xhr.open("GET", newUrl, true);
        this.httpPartInit(xhr, newUrl, callback, thisObj, fTime);
        xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        this._token && bSigned && xhr.setRequestHeader("Authorization", this._token);
        xhr.send();
      };
      HttpManager.prototype.cancelAll = function() {
        for (var i = 0; i < this._httpVos.length; i++) {
          var vo = this._httpVos[i];
          vo.xhr.onreadystatechange = null;
          vo.xhr.onerror = null;
          vo.xhr.onreadystatechange = null;
        }
        this._httpVos.length = 0;
      };
      HttpManager.prototype.cancelByTarget = function(thisObj) {
        for (var i = this._httpVos.length - 1; i >= 0; i--) {
          var vo = this._httpVos[i];
          if (vo.thisObj == thisObj) {
            vo.xhr.onreadystatechange = null;
            vo.xhr.onerror = null;
            vo.xhr.onreadystatechange = null;
            this._httpVos.splice(i, 1);
          }
        }
      };
      HttpManager.prototype.dataToString = function(data) {
        var result = "";
        var tmp = "";
        for (var key in data) {
          result += tmp + encodeURI(key) + "=" + encodeURI(data[key]);
          tmp = "&";
        }
        return result;
      };
      HttpManager.prototype.dataToStringEx = function(data) {
        var result = "";
        var tmp = "";
        for (var key in data) {
          result += tmp + key + "=" + data[key];
          tmp = "&";
        }
        return result;
      };
      return HttpManager;
    }(Singleton_1.Singleton);
    exports.HttpManager = HttpManager;
    var SelfHttpVo = function() {
      function SelfHttpVo(url, params, callback, thisObj, fTime, type) {
        this.url = url;
        this.params = params;
        this.callback = callback;
        this.thisObj = thisObj;
        this.fTime = fTime;
        this.type = type;
      }
      return SelfHttpVo;
    }();
    cc._RF.pop();
  }, {
    "../base/Singleton": "Singleton",
    "../utils/TextUtil": "TextUtil",
    "./HttpVo": "HttpVo"
  } ],
  HttpVo: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "21710mKgBFC7Jxpslro5gW+", "HttpVo");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.HttpVo = void 0;
    var HttpVo = function() {
      function HttpVo() {}
      return HttpVo;
    }();
    exports.HttpVo = HttpVo;
    cc._RF.pop();
  }, {} ],
  IllustratedHandbookView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "06c30aikcVHX5HTxIvdIyAR", "IllustratedHandbookView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const BaseView_1 = require("../../../framework/base/BaseView");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let IllustratedHandbookView = class IllustratedHandbookView extends BaseView_1.BaseView {
      constructor() {
        super(...arguments);
        this.isClickRect = true;
        this.pubFish = null;
        this.rewardFish = null;
        this.pubFishItem = null;
        this.rewardFishItem = null;
        this.FishItemParent = null;
        this.fishJsonData = null;
      }
      start() {
        this.initUI();
      }
      CloseView() {
        GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.ILLUSTRATED_HANDBOOK_VIEW);
      }
      initUI() {
        return __awaiter(this, void 0, void 0, function*() {
          this.fishJsonData = yield GameGlobal_1.GameGlobal.getJsonFromUrl("mainRes/json/Fish");
          this.pubFish.isChecked = true;
        });
      }
      ChangeShowPubFish() {
        this.FishItemParent.destroyAllChildren();
        var keys = Object.keys(this.fishJsonData);
        cc.log(keys.length);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var fish = this.fishJsonData[key];
          if (5 != fish.type) {
            var fishItem = cc.instantiate(this.pubFishItem);
            fishItem.setParent(this.FishItemParent);
            GameGlobal_1.GameGlobal.setSpriteFormResourcesUrl(fishItem.getChildByName("IconSprite"), "mainRes/images/fishIcon/" + fish.id);
            fishItem.getChildByName("CoinLabel").getComponent(cc.Label).string = fish.coin.toString();
            fishItem.active = true;
          }
        }
      }
      ChangeShowAwardFish() {
        this.FishItemParent.destroyAllChildren();
        var keys = Object.keys(this.fishJsonData);
        cc.log(keys.length);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          var fish = this.fishJsonData[key];
          if (5 == fish.type) {
            var fishItem = cc.instantiate(this.pubFishItem);
            fishItem.active = true;
            GameGlobal_1.GameGlobal.setSpriteFormResourcesUrl(fishItem.getChildByName("IconSprite"), "mainRes/images/fishIcon/" + fish.id);
            fishItem.getChildByName("CoinLabel").getComponent(cc.Label).string = fish.coin.toString();
            fishItem.setParent(this.FishItemParent);
          }
        }
      }
    };
    IllustratedHandbookView.TAG = "BonusTortoiseView";
    __decorate([ property(cc.Toggle) ], IllustratedHandbookView.prototype, "pubFish", void 0);
    __decorate([ property(cc.Toggle) ], IllustratedHandbookView.prototype, "rewardFish", void 0);
    __decorate([ property(cc.Node) ], IllustratedHandbookView.prototype, "pubFishItem", void 0);
    __decorate([ property(cc.Node) ], IllustratedHandbookView.prototype, "rewardFishItem", void 0);
    __decorate([ property(cc.Node) ], IllustratedHandbookView.prototype, "FishItemParent", void 0);
    IllustratedHandbookView = __decorate([ ccclass ], IllustratedHandbookView);
    exports.default = IllustratedHandbookView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseView": "BaseView",
    "../../../framework/const/ViewConst": "ViewConst"
  } ],
  LanguageConst: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dfa2fxUF5RPDYbeL0cMf2AR", "LanguageConst");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.LanguageConst = void 0;
    var LanguageConst = function() {
      function LanguageConst() {}
      LanguageConst.StrKey = {};
      return LanguageConst;
    }();
    exports.LanguageConst = LanguageConst;
    cc._RF.pop();
  }, {} ],
  LanguageData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "61de062n4dJ7ZM9/Xdumozn", "LanguageData");
    "use strict";
    var Polyglot = require("polyglot.min");
    var polyInst = null;
    window.i18n || (window.i18n = {
      languages: {
        zh: require("../i18n/zh"),
        en: require("../i18n/en")
      },
      curLang: "en"
    });
    window.i18n.curLang = "en";
    initPolyglot(loadLanguageData(window.i18n.curLang) || {});
    function loadLanguageData(language) {
      return window.i18n.languages[language];
    }
    function initPolyglot(data) {
      data && (polyInst ? polyInst.replace(data) : polyInst = new Polyglot({
        phrases: data,
        allowMissing: true
      }));
    }
    module.exports = {
      init: function init(language) {
        if (language === window.i18n.curLang) return;
        var data = loadLanguageData(language) || {};
        cc.log("data:", data);
        window.i18n.curLang = language;
        initPolyglot(data);
        this.inst = polyInst;
      },
      t: function t(key, opt) {
        if (polyInst) return polyInst.t(key, opt);
      },
      inst: polyInst,
      updateSceneRenderers: function updateSceneRenderers() {
        var rootNodes = cc.director.getScene().children;
        var allLocalizedLabels = [];
        for (var i = 0; i < rootNodes.length; ++i) {
          var labels = rootNodes[i].getComponentsInChildren("LocalizedLabel");
          Array.prototype.push.apply(allLocalizedLabels, labels);
        }
        for (var _i = 0; _i < allLocalizedLabels.length; ++_i) {
          var label = allLocalizedLabels[_i];
          if (!label.node.active) continue;
          label.updateLabel();
        }
        var allLocalizedSprites = [];
        for (var _i2 = 0; _i2 < rootNodes.length; ++_i2) {
          var sprites = rootNodes[_i2].getComponentsInChildren("LocalizedSprite");
          Array.prototype.push.apply(allLocalizedSprites, sprites);
        }
        for (var _i3 = 0; _i3 < allLocalizedSprites.length; ++_i3) {
          var sprite = allLocalizedSprites[_i3];
          if (!sprite.node.active) continue;
          sprite.updateSprite(window.i18n.curLang);
        }
      }
    };
    cc._RF.pop();
  }, {
    "../i18n/en": "en",
    "../i18n/zh": "zh",
    "polyglot.min": "polyglot.min"
  } ],
  LanguageManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2ade3Mr3DlI75O14Fykscw7", "LanguageManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.LanguageManager = void 0;
    var Singleton_1 = require("../base/Singleton");
    var GameGlobal_1 = require("../GameGlobal");
    var TextUtil_1 = require("../utils/TextUtil");
    var LanguageManager = function(_super) {
      __extends(LanguageManager, _super);
      function LanguageManager() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      LanguageManager.getInstance = function() {
        return _super.getInstance.call(this);
      };
      LanguageManager.prototype.init = function() {
        this._strCfgData = null;
      };
      LanguageManager.prototype.loadConfig = function(cfgName, callback, target) {
        var _this = this;
        GameGlobal_1.GameGlobal.Resource.loadRes(cfgName, cc.Asset, null, function(err, data) {
          if (null == err) {
            _this.parseConfig(data);
            callback && callback.call(target);
          }
        });
      };
      LanguageManager.prototype.parseConfig = function(data) {
        this._strCfgData = this._strCfgData || {};
        if ("object" == typeof data) for (var key in data) this._strCfgData[key] = data[key]; else if ("string" == typeof data) {
          data = JSON.parse(data);
          for (var key in data) this._strCfgData[key] = data[key];
        }
      };
      LanguageManager.prototype.getStr = function(strKey) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) params[_i - 1] = arguments[_i];
        strKey = "" + strKey;
        var text = this._strCfgData && this._strCfgData[strKey];
        text = TextUtil_1.TextUtil.formatString.apply(TextUtil_1.TextUtil, __spreadArrays([ text ], params));
        return text;
      };
      return LanguageManager;
    }(Singleton_1.Singleton);
    exports.LanguageManager = LanguageManager;
    cc._RF.pop();
  }, {
    "../GameGlobal": "GameGlobal",
    "../base/Singleton": "Singleton",
    "../utils/TextUtil": "TextUtil"
  } ],
  LanguageMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2b1d31mOVJDBbd1A9fWgeFr", "LanguageMgr");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var LanguageMgr = function() {
      function LanguageMgr() {
        this.curLang = "en";
        this.i18n = null;
      }
      Object.defineProperty(LanguageMgr, "Lang", {
        get: function() {
          this.lang || (this.lang = new LanguageMgr());
          return this.lang;
        },
        enumerable: false,
        configurable: true
      });
      LanguageMgr.prototype.initLanguage = function() {
        this.i18n = require("LanguageData");
        this.changeLanguage("en");
      };
      LanguageMgr.prototype.changeLanguage = function(lang) {
        if (lang === this.curLang) return;
        this.i18n.init(lang);
        this.updateLanguageRender();
        this.curLang = lang;
      };
      LanguageMgr.prototype.updateLanguageRender = function() {
        this.i18n.updateSceneRenderers();
      };
      LanguageMgr.prototype.t = function(id) {
        return this.i18n.t(id);
      };
      LanguageMgr.lang = null;
      return LanguageMgr;
    }();
    exports.default = LanguageMgr;
    cc._RF.pop();
  }, {
    LanguageData: "LanguageData"
  } ],
  LaterHandler: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "08a29k4+E5Ex457Wn+uh19h", "LaterHandler");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.LaterHandler = void 0;
    var LaterHandler = function() {
      function LaterHandler() {
        this.key = 0;
        this.caller = null;
        this.method = null;
        this.args = null;
      }
      LaterHandler.prototype.clear = function() {
        this.caller = null;
        this.method = null;
        this.args = null;
      };
      LaterHandler.prototype.run = function() {
        var e = this.caller;
        if (e && e.destroyed) return this.clear();
        var t = this.method, i = this.args;
        null != t && (i ? t.apply(e, i) : t.call(e));
      };
      return LaterHandler;
    }();
    exports.LaterHandler = LaterHandler;
    cc._RF.pop();
  }, {} ],
  LayerType: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fe345UNT0VJ8Ig4KlVureKI", "LayerType");
    var LayerType;
    (function(LayerType) {
      LayerType[LayerType["floorLayer"] = 0] = "floorLayer";
      LayerType[LayerType["viewLayer"] = 1] = "viewLayer";
      LayerType[LayerType["menuLayer"] = 2] = "menuLayer";
      LayerType[LayerType["popupLayer"] = 3] = "popupLayer";
      LayerType[LayerType["popMenuLayer"] = 4] = "popMenuLayer";
      LayerType[LayerType["messageLayer"] = 5] = "messageLayer";
      LayerType[LayerType["guideLayer"] = 6] = "guideLayer";
      LayerType[LayerType["toolTipLayer"] = 7] = "toolTipLayer";
      LayerType[LayerType["waitingLayer"] = 8] = "waitingLayer";
      LayerType[LayerType["loadingLayer"] = 9] = "loadingLayer";
      LayerType[LayerType["systemPopLayer"] = 10] = "systemPopLayer";
      LayerType[LayerType["debugLayer"] = 11] = "debugLayer";
    })(LayerType || (LayerType = {}));
    cc._RF.pop();
  }, {} ],
  LightningSprite: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "35cbeHzjNRPr4VWLBPMqIov", "LightningSprite");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var WJMultiAssembler_1 = require("./WJMultiAssembler");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var LightningSprite = function(_super) {
      __extends(LightningSprite, _super);
      function LightningSprite() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._EndPos = cc.v2(800, 0);
        return _this;
      }
      Object.defineProperty(LightningSprite.prototype, "EndPos", {
        get: function() {
          return this._EndPos;
        },
        set: function(value) {
          this._EndPos = value;
          this.FlushProperties();
        },
        enumerable: false,
        configurable: true
      });
      LightningSprite.prototype.FlushProperties = function() {
        var assembler = this._assembler;
        if (!assembler) return;
        assembler.m_endPos = this._EndPos;
        assembler.genSegs();
        this.setVertsDirty();
      };
      LightningSprite.prototype.onEnable = function() {
        _super.prototype.onEnable.call(this);
      };
      LightningSprite.prototype._resetAssembler = function() {
        this.setVertsDirty();
        var assembler = this._assembler = new WJMultiAssembler_1.default();
        this.FlushProperties();
        assembler.init(this);
        this._updateColor();
      };
      __decorate([ property ], LightningSprite.prototype, "EndPos", null);
      __decorate([ property ], LightningSprite.prototype, "_EndPos", void 0);
      LightningSprite = __decorate([ ccclass ], LightningSprite);
      return LightningSprite;
    }(cc.Sprite);
    exports.default = LightningSprite;
    cc._RF.pop();
  }, {
    "./WJMultiAssembler": "WJMultiAssembler"
  } ],
  LoadingCtrl: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d7288Z9dgxOc5rTDP68zNXq", "LoadingCtrl");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.LoadingCtrl = void 0;
    var BaseCtrl_1 = require("../../framework/base/BaseCtrl");
    var LogUtil_1 = require("../../framework/utils/LogUtil");
    var LoadingModel_1 = require("../model/LoadingModel");
    var LoadingCtrl = function(_super) {
      __extends(LoadingCtrl, _super);
      function LoadingCtrl() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      LoadingCtrl.prototype.init = function() {
        LogUtil_1.LogUtil.info(LoadingCtrl.TAG, "init");
        this.initModel(LoadingModel_1.LoadingModel);
      };
      LoadingCtrl.TAG = "LoadingCtrl";
      return LoadingCtrl;
    }(BaseCtrl_1.BaseCtrl);
    exports.LoadingCtrl = LoadingCtrl;
    cc._RF.pop();
  }, {
    "../../framework/base/BaseCtrl": "BaseCtrl",
    "../../framework/utils/LogUtil": "LogUtil",
    "../model/LoadingModel": "LoadingModel"
  } ],
  LoadingModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0ae14RL5nxDPKB418r2nMWN", "LoadingModel");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.LoadingModel = void 0;
    var BaseModel_1 = require("../../framework/base/BaseModel");
    var LogUtil_1 = require("../../framework/utils/LogUtil");
    var LoadingModel = function(_super) {
      __extends(LoadingModel, _super);
      function LoadingModel() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      LoadingModel.prototype.init = function() {
        LogUtil_1.LogUtil.info(LoadingModel.TAG, "==>init");
      };
      LoadingModel.TAG = "LoadingModel";
      return LoadingModel;
    }(BaseModel_1.BaseModel);
    exports.LoadingModel = LoadingModel;
    cc._RF.pop();
  }, {
    "../../framework/base/BaseModel": "BaseModel",
    "../../framework/utils/LogUtil": "LogUtil"
  } ],
  LoadingScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7a683WrvdBDqKn57DGqXJT9", "LoadingScene");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.LoadingScene = void 0;
    var BaseScene_1 = require("../../framework/base/BaseScene");
    var EventConst_1 = require("../../framework/const/EventConst");
    var ResConst_1 = require("../../framework/const/ResConst");
    var SceneConst_1 = require("../../framework/const/SceneConst");
    var GameGlobal_1 = require("../../framework/GameGlobal");
    var LogUtil_1 = require("../../framework/utils/LogUtil");
    var LoadingScene = function(_super) {
      __extends(LoadingScene, _super);
      function LoadingScene() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      LoadingScene.prototype.init = function() {
        LogUtil_1.LogUtil.info(LoadingScene.TAG, "==>init");
      };
      LoadingScene.prototype.onEnter = function() {
        _super.prototype.onEnter.call(this);
        LogUtil_1.LogUtil.info(LoadingScene.TAG, "onEnter");
        var taskList = this.getLoadingTask();
        GameGlobal_1.GameGlobal.Viewer.showLoadingUI(taskList);
        GameGlobal_1.GameGlobal.Viewer.closeAllViews();
      };
      LoadingScene.prototype.onExit = function() {
        _super.prototype.onExit.call(this);
        LogUtil_1.LogUtil.info(LoadingScene.TAG, "onExit");
      };
      LoadingScene.prototype.onBackKeyDown = function() {
        _super.prototype.onBackKeyDown.call(this);
        cc.sys.isNative && cc.sys.platform == cc.sys.ANDROID ? jsb.reflection.callStaticMethod("com/cocos/game/AppActivity", "exitApp", "()V") : cc.game.end();
      };
      LoadingScene.prototype.getLoadingTask = function() {
        var taskList = [ {
          callFunc: this.loadResource,
          callObj: this,
          start: 0,
          end: 40,
          time: 2e3,
          text: "Load Game Resource"
        }, {
          callFunc: this.loadHallModule,
          callObj: this,
          start: 40,
          end: 50,
          time: 2e3,
          text: "Load Hall Resource"
        }, {
          callFunc: this.preloadPrefabs,
          callObj: this,
          start: 50,
          end: 70,
          time: 2e3,
          text: "Load Prefabs"
        }, {
          callFunc: this.loadScene,
          callObj: this,
          start: 90,
          end: 95,
          time: 2e3,
          text: "Load Game Scene"
        }, {
          callFunc: this.sendEnterGame,
          callObj: this,
          start: 95,
          end: 99,
          time: 2e3,
          text: "Load Game"
        } ];
        return taskList;
      };
      LoadingScene.prototype.loadStrConfig = function(loadingUI) {
        loadingUI.loadNextTask();
      };
      LoadingScene.prototype.loadSubPackage = function(loadingUI) {
        cc.assetManager.loadBundle("subPack", null, function(error, bundle) {
          null == error ? loadingUI.loadNextTask() : LogUtil_1.LogUtil.error("\u52a0\u8f7d\u4ee3\u7801\u5206\u5305\u5931\u8d25");
        });
      };
      LoadingScene.prototype.loadResource = function(loadingUI) {
        var bunbleList = ResConst_1.ResConst.preBundleList;
        if (bunbleList && bunbleList.length > 0) {
          bunbleList = bunbleList.slice();
          this.loadMainBundle(bunbleList, loadingUI);
        } else loadingUI.loadNextTask();
      };
      LoadingScene.prototype.loadMainBundle = function(bundleName, loadingUI) {
        if (bundleName && bundleName.length > 0) {
          var curBundle = bundleName.shift();
          var thiz = this;
          cc.assetManager.loadBundle(curBundle, null, function(error, bundle) {
            null == error ? thiz.loadMainBundle(bundleName, loadingUI) : LogUtil_1.LogUtil.error("\u52a0\u8f7d" + curBundle + "\u5931\u8d25");
          });
        } else loadingUI.loadNextTask();
      };
      LoadingScene.prototype.loadCommonModule = function(loadingUI) {
        var resPlists = ResConst_1.ResConst.commonResList;
        if (resPlists && resPlists.length > 0) {
          resPlists = resPlists.slice();
          this.loadCommonPlist(resPlists, loadingUI);
        } else loadingUI.loadNextTask();
      };
      LoadingScene.prototype.loadHallModule = function(loadingUI) {
        var resPlists = ResConst_1.ResConst.hallResList;
        if (resPlists && resPlists.length > 0) {
          resPlists = resPlists.slice();
          this.loadHallPlist(resPlists, loadingUI);
        } else loadingUI.loadNextTask();
      };
      LoadingScene.prototype.loadCommonPlist = function(resPaths, loadingUI) {
        if (resPaths && resPaths.length > 0) {
          var curPath = resPaths.shift();
          var thiz = this;
          GameGlobal_1.GameGlobal.Resource.loadRes(curPath, cc.SpriteAtlas, null, function() {
            thiz.loadCommonPlist(resPaths, loadingUI);
          });
        } else loadingUI.loadNextTask();
      };
      LoadingScene.prototype.loadHallPlist = function(resPaths, loadingUI) {
        if (resPaths && resPaths.length > 0) {
          var curPath = resPaths.shift();
          var thiz = this;
          GameGlobal_1.GameGlobal.Resource.loadRes(curPath, cc.SpriteAtlas, null, function() {
            thiz.loadHallPlist(resPaths, loadingUI);
          });
        } else loadingUI.loadNextTask();
      };
      LoadingScene.prototype.preloadPrefabs = function(loadingUI) {
        var prefabList = ResConst_1.ResConst.preLoadPrefabList;
        if (prefabList && prefabList.length > 0) {
          prefabList = prefabList.slice();
          var resList = [];
          resList.push({
            type: cc.Prefab,
            resList: ResConst_1.ResConst.preLoadPrefabList.concat()
          });
          GameGlobal_1.GameGlobal.Resource.loadResList("preLoad", resList, null, function(error, assets) {
            loadingUI.loadNextTask();
          });
        } else loadingUI.loadNextTask();
      };
      LoadingScene.prototype.preloadNextPrefab = function(prefabList, loadingUI) {
        if (prefabList && prefabList.length > 0) {
          var curPath = prefabList.shift();
          var thiz = this;
          GameGlobal_1.GameGlobal.Resource.preLoadRes(curPath, cc.Prefab, null, function(error, res) {
            thiz.preloadNextPrefab(prefabList, loadingUI);
            error || GameGlobal_1.GameGlobal.Resource.addAssetRef("", res);
          });
        } else loadingUI.loadNextTask();
      };
      LoadingScene.prototype.preloadJsons = function(loadingUI) {
        LogUtil_1.LogUtil.info(LoadingScene.TAG, "preloadJsons");
        var jsonList = ResConst_1.ResConst.preLoadJsonList;
        if (jsonList && jsonList.length > 0) {
          jsonList = jsonList.slice();
          this.preloadNextJson(jsonList, loadingUI);
        } else loadingUI.loadNextTask();
      };
      LoadingScene.prototype.preloadNextJson = function(jsonList, loadingUI) {
        LogUtil_1.LogUtil.info(LoadingScene.TAG, "preloadNextJson");
        if (jsonList && jsonList.length > 0) {
          var curPath = jsonList.shift();
          var thiz = this;
          GameGlobal_1.GameGlobal.Resource.loadRes(curPath, cc.JsonAsset, null, function(error, res) {
            if (error) LogUtil_1.LogUtil.info(LoadingScene.TAG, "preloadNextJson===>error"); else {
              LogUtil_1.LogUtil.info(LoadingScene.TAG, "preloadNextJson, res:", res);
              var idx = ResConst_1.ResConst.preLoadJsonList.indexOf(curPath);
              for (var p in res[0]) if (res[0].hasOwnProperty(p)) {
                LogUtil_1.LogUtil.info(LoadingScene.TAG, "res[0][" + p + "]:", res[0][p]);
                if ("file" == p && "object" == typeof res[0][p]) for (var key in res[0][p]) LogUtil_1.LogUtil.info(LoadingScene.TAG, "res[0][" + p + "][" + key + "]:", res[0][p][key]);
              }
              var tmpDatas = res.json;
              LogUtil_1.LogUtil.info(LoadingScene.TAG, "preloadNextJson, tmpDatas:", null == tmpDatas);
              var datas = [];
              for (var k = 0; k < tmpDatas.length; k++) datas.push(tmpDatas[k][0]);
            }
            thiz.preloadNextJson(jsonList, loadingUI);
          });
        } else loadingUI.loadNextTask();
      };
      LoadingScene.prototype.loadConfig = function(loadingUI) {};
      LoadingScene.prototype.loadProtoConfig = function(loadingUI) {};
      LoadingScene.prototype.loadLanguageConfig = function(loadingUI) {
        GameGlobal_1.GameGlobal.Language.loadConfig("mainRes/config/language_main", function() {
          loadingUI.loadNextTask();
        });
      };
      LoadingScene.prototype.loadScene = function(loadingUI) {
        var targetScene = "hall";
        cc.director.preloadScene(targetScene, function(err) {
          err || loadingUI.loadNextTask();
        });
      };
      LoadingScene.prototype.sendEnterGame = function(loadingUI) {
        var targetScene = "hall";
        GameGlobal_1.GameGlobal.Viewer.closeAllViews();
        cc.director.loadScene(targetScene, function() {
          GameGlobal_1.GameGlobal.Viewer.initLayers();
          console.log("\u53d1\u9001\u8fdb\u5165\u6e38\u620f");
          GameGlobal_1.GameGlobal.Scene.openScene(SceneConst_1.SceneConst.SceneType.HallScene);
          GameGlobal_1.GameGlobal.Eventer.dispatch(EventConst_1.EventConst.EventId.ON_SCENE_CHANGED);
        });
      };
      LoadingScene.TAG = "LoadingScene";
      return LoadingScene;
    }(BaseScene_1.BaseScene);
    exports.LoadingScene = LoadingScene;
    cc._RF.pop();
  }, {
    "../../framework/GameGlobal": "GameGlobal",
    "../../framework/base/BaseScene": "BaseScene",
    "../../framework/const/EventConst": "EventConst",
    "../../framework/const/ResConst": "ResConst",
    "../../framework/const/SceneConst": "SceneConst",
    "../../framework/utils/LogUtil": "LogUtil"
  } ],
  LoadingUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "73bd8QX7YxJAakS6xYPAy+p", "LoadingUI");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.LoadingUI = void 0;
    var GameGlobal_1 = require("../GameGlobal");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var LoadingUI = function(_super) {
      __extends(LoadingUI, _super);
      function LoadingUI() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._updateDt = 0;
        _this._progressCheckCount = 0;
        _this._tipsTimeCount = 0;
        _this._showProgress = 0;
        return _this;
      }
      LoadingUI.prototype.onLoad = function() {
        this.loadingText = cc.find("loadingText", this.node).getComponent(cc.Label);
        this.tipText = cc.find("tipText", this.node).getComponent(cc.Label);
        this.loadingBar1 = cc.find("loadingBar1", this.node).getComponent(cc.ProgressBar);
        this.loadingBar2 = cc.find("loadingBar2", this.node).getComponent(cc.ProgressBar);
      };
      LoadingUI.prototype.initUI = function(taskList) {
        this._taskList = taskList;
        this.loadingBar1.progress = 0;
        this.loadNextTask();
      };
      LoadingUI.prototype.onDestroy = function() {
        cc.director.getScheduler().unscheduleUpdate(this);
        this.prefab.decRef();
        this.prefab = null;
      };
      LoadingUI.prototype.update = function(dt) {
        this._updateDt += dt;
        this.loadingBar2.progress = Math.floor(644 * this._updateDt) % 100 / 100;
        this._tipsTimeCount += dt;
        if (this._tipsTimeCount >= 6) {
          this._setTipsLabel();
          this._tipsTimeCount = 0;
        }
        this._progressCheckCount += dt;
        if (this._progressCheckCount >= 1) {
          this._progressCheckCount = 0;
          this._setLoadingBarInfo(0);
        }
      };
      LoadingUI.prototype._setLoadingBarInfo = function(e) {
        void 0 === e && (e = 0);
        if ((e = Math.max(e, this._showProgress)) <= this._showProgress && this._showProgress < 100) {
          this._showProgress += 1;
          this._showProgress = Math.min(this._showProgress, 99);
        } else this._showProgress = e;
        this.loadingBar1.progress = this._showProgress / 100;
        this.loadingText.string = Math.floor(this._showProgress) + "%";
      };
      LoadingUI.prototype._setTipsLabel = function() {};
      LoadingUI.prototype.loadNextTask = function() {
        var task = this._taskList && this._taskList.shift();
        if (task) {
          this.updateLoading(task.start, task.end, task.time, task.text);
          GameGlobal_1.GameGlobal.callJsFunc("logStep", "loading" + task.end);
          task.callFunc.call(task.callObj, this);
        }
      };
      LoadingUI.prototype.updateLoading = function(start, end, time, text) {
        this._setLoadingBarInfo(end);
        this.tipText.node.getComponent(cc.Label).string = text;
      };
      LoadingUI.prototype.clearCacheClick = function() {
        GameGlobal_1.GameGlobal.Resource.releaseAll();
        cc.game.end();
      };
      LoadingUI = __decorate([ ccclass ], LoadingUI);
      return LoadingUI;
    }(cc.Component);
    exports.LoadingUI = LoadingUI;
    cc._RF.pop();
  }, {
    "../GameGlobal": "GameGlobal"
  } ],
  LocalManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9869fDM7gJJ963XPeSAE7Qc", "LocalManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.LocalManager = void 0;
    var Singleton_1 = require("../base/Singleton");
    var TextUtil_1 = require("../utils/TextUtil");
    var LocalManager = function(_super) {
      __extends(LocalManager, _super);
      function LocalManager() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      LocalManager.getInstance = function() {
        return _super.getInstance.call(this);
      };
      LocalManager.prototype.setItem = function(key, value) {
        localStorage.setItem(key, value);
      };
      LocalManager.prototype.getItem = function(key) {
        return localStorage.getItem(key);
      };
      LocalManager.prototype.getBoolean = function(key, defaultValue) {
        void 0 === defaultValue && (defaultValue = false);
        defaultValue = !!defaultValue;
        var tmpValue = this.getItem(key);
        if (!TextUtil_1.TextUtil.isEmpty(tmpValue)) return JSON.parse(tmpValue);
        this.setItem(key, defaultValue + "");
      };
      LocalManager.prototype.getNumber = function(key, defaultValue) {
        void 0 === defaultValue && (defaultValue = 0);
        defaultValue = null == defaultValue ? 0 : defaultValue;
        var tmpValue = this.getItem(key);
        if (TextUtil_1.TextUtil.isEmpty(tmpValue)) {
          this.setItem(key, defaultValue + "");
          return defaultValue;
        }
        return JSON.parse(tmpValue);
      };
      LocalManager.prototype.removeItem = function(key) {
        localStorage.removeItem(key);
      };
      LocalManager.prototype.clearAllItems = function() {
        localStorage.clear();
      };
      return LocalManager;
    }(Singleton_1.Singleton);
    exports.LocalManager = LocalManager;
    cc._RF.pop();
  }, {
    "../base/Singleton": "Singleton",
    "../utils/TextUtil": "TextUtil"
  } ],
  LocalizedLabel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "744dcs4DCdNprNhG0xwq6FK", "LocalizedLabel");
    "use strict";
    var i18n = require("LanguageData");
    function debounce(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function later() {
          timeout = null;
          immediate || func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        callNow && func.apply(context, args);
      };
    }
    cc.Class({
      extends: cc.Component,
      editor: {
        executeInEditMode: true,
        menu: "i18n/LocalizedLabel"
      },
      properties: {
        dataID: {
          get: function get() {
            return this._dataID;
          },
          set: function set(val) {
            if (this._dataID !== val) {
              this._dataID = val;
              false;
              this.updateLabel();
            }
          }
        },
        _dataID: ""
      },
      onLoad: function onLoad() {
        false;
        i18n.inst || i18n.init();
        this.fetchRender();
      },
      fetchRender: function fetchRender() {
        var label = this.getComponent(cc.Label);
        if (label) {
          this.label = label;
          this.updateLabel();
          return;
        }
      },
      updateLabel: function updateLabel() {
        if (!this.label) {
          cc.error("Failed to update localized label, label component is invalid!");
          return;
        }
        var localizedString = i18n.t(this.dataID);
        localizedString && (this.label.string = localizedString);
      }
    });
    cc._RF.pop();
  }, {
    LanguageData: "LanguageData"
  } ],
  LocalizedSize: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c824aiICaxH26Yh+DojYYaO", "LocalizedSize");
    "use strict";
    var NodeSizeSet = require("NodeSizeSet");
    var SpriteFrameSet = require("SpriteFrameSet");
    function debounce(func, wait, immediate) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function later() {
          timeout = null;
          immediate || func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        callNow && func.apply(context, args);
      };
    }
    cc.Class({
      extends: cc.Component,
      editor: {
        executeInEditMode: true,
        inspector: "packages://i18n/inspector/localized-size.js",
        menu: "i18n/LocalizedSize"
      },
      properties: {
        nodeSizeSet: {
          default: [],
          type: NodeSizeSet
        }
      },
      onLoad: function onLoad() {
        false;
        this.fetchRender();
      },
      fetchRender: function fetchRender() {
        this.updateSize(window.i18n.curLang);
      },
      getSizeByLang: function getSizeByLang(lang) {
        for (var i = 0; i < this.nodeSizeSet.length; ++i) if (this.nodeSizeSet[i].language === lang) return {
          width: this.nodeSizeSet[i].width,
          height: this.nodeSizeSet[i].height
        };
      },
      updateSize: function updateSize(language) {
        var size = this.getSizeByLang(language);
        if (size && size.width) {
          this.node.width = size.width;
          cc.log("this.node.width = " + this.node.width);
        }
        size && size.height && (this.node.height = size.height);
        false;
      }
    });
    cc._RF.pop();
  }, {
    NodeSizeSet: "NodeSizeSet",
    SpriteFrameSet: "SpriteFrameSet"
  } ],
  LocalizedSprite: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f34ac2GGiVOBbG6XlfvgYP4", "LocalizedSprite");
    "use strict";
    var SpriteFrameSet = require("SpriteFrameSet");
    cc.Class({
      extends: cc.Component,
      editor: {
        executeInEditMode: true,
        menu: "i18n/LocalizedSprite"
      },
      properties: {
        spriteFrameSet: {
          default: [],
          type: SpriteFrameSet
        }
      },
      onLoad: function onLoad() {
        this.fetchRender();
      },
      fetchRender: function fetchRender() {
        var sprite = this.getComponent(cc.Sprite);
        if (sprite) {
          this.sprite = sprite;
          this.updateSprite(window.i18n.curLang);
          return;
        }
      },
      getSpriteFrameByLang: function getSpriteFrameByLang(lang) {
        for (var i = 0; i < this.spriteFrameSet.length; ++i) if (this.spriteFrameSet[i].language == lang) return this.spriteFrameSet[i].spriteFrame;
      },
      updateSprite: function updateSprite(language) {
        if (!this.sprite) {
          cc.error("Failed to update localized sprite, sprite component is invalid!");
          return;
        }
        var spriteFrame = this.getSpriteFrameByLang(language);
        !spriteFrame && this.spriteFrameSet[0] && (spriteFrame = this.spriteFrameSet[0].spriteFrame);
        this.sprite.spriteFrame = spriteFrame;
      }
    });
    cc._RF.pop();
  }, {
    SpriteFrameSet: "SpriteFrameSet"
  } ],
  LogUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fed4exVzKhHVa4Zs+ShXQgL", "LogUtil");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.LogUtil = exports.LogLevel = void 0;
    var PlatformManager_1 = require("../manager/PlatformManager");
    var LogLevel = function() {
      function LogLevel() {}
      LogLevel.DEBUG = 0;
      LogLevel.INFO = 1;
      LogLevel.WARN = 2;
      LogLevel.ERROR = 3;
      LogLevel.OFF = 9;
      return LogLevel;
    }();
    exports.LogLevel = LogLevel;
    var LogUtil = function() {
      function LogUtil() {}
      LogUtil.log = function(level, tag) {
        var data = [];
        for (var _i = 2; _i < arguments.length; _i++) data[_i - 2] = arguments[_i];
        this.logLevel <= level && PlatformManager_1.PlatformManager.getInstance().isLocal() && console.log.apply(console, __spreadArrays([ tag ], data));
      };
      LogUtil.debug = function(tag) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) data[_i - 1] = arguments[_i];
        this.log.apply(this, __spreadArrays([ LogLevel.DEBUG, tag ], data));
      };
      LogUtil.info = function(tag) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) data[_i - 1] = arguments[_i];
        this.log.apply(this, __spreadArrays([ LogLevel.INFO, tag ], data));
      };
      LogUtil.warn = function(tag) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) data[_i - 1] = arguments[_i];
        this.log.apply(this, __spreadArrays([ LogLevel.WARN, tag ], data));
      };
      LogUtil.error = function(tag) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) data[_i - 1] = arguments[_i];
        this.log.apply(this, __spreadArrays([ LogLevel.ERROR, tag ], data));
      };
      LogUtil.ChangeLevel = function() {
        if (this.logLevel == LogLevel.DEBUG) {
          this.logLevel = LogLevel.OFF;
          return false;
        }
        if (this.logLevel == LogLevel.OFF) {
          this.logLevel = LogLevel.DEBUG;
          return true;
        }
        return true;
      };
      LogUtil.logError = function(tag) {
        var data = [];
        for (var _i = 1; _i < arguments.length; _i++) data[_i - 1] = arguments[_i];
        console.log.apply(console, __spreadArrays([ tag ], data));
      };
      LogUtil.logLevel = LogLevel.DEBUG;
      LogUtil.isLogBattle = false;
      return LogUtil;
    }();
    exports.LogUtil = LogUtil;
    cc._RF.pop();
  }, {
    "../manager/PlatformManager": "PlatformManager"
  } ],
  LoginCtrl: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fdb95U4RdZKMoMMlu7uomBJ", "LoginCtrl");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.LoginCtrl = void 0;
    var BaseCtrl_1 = require("../../framework/base/BaseCtrl");
    var LogUtil_1 = require("../../framework/utils/LogUtil");
    var LoginModel_1 = require("../model/LoginModel");
    var LoginCtrl = function(_super) {
      __extends(LoginCtrl, _super);
      function LoginCtrl() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      LoginCtrl.prototype.init = function() {
        LogUtil_1.LogUtil.info(LoginCtrl.TAG, "init");
        this.initModel(LoginModel_1.LoginModel);
      };
      LoginCtrl.TAG = "LoginCtrl";
      return LoginCtrl;
    }(BaseCtrl_1.BaseCtrl);
    exports.LoginCtrl = LoginCtrl;
    cc._RF.pop();
  }, {
    "../../framework/base/BaseCtrl": "BaseCtrl",
    "../../framework/utils/LogUtil": "LogUtil",
    "../model/LoginModel": "LoginModel"
  } ],
  LoginModel: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "db47cSbOrFEAYGjN9L+UWMD", "LoginModel");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.LoginModel = void 0;
    var BaseModel_1 = require("../../framework/base/BaseModel");
    var LogUtil_1 = require("../../framework/utils/LogUtil");
    var LoginModel = function(_super) {
      __extends(LoginModel, _super);
      function LoginModel() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      LoginModel.prototype.init = function() {
        LogUtil_1.LogUtil.info(LoginModel.TAG, "==>init");
      };
      LoginModel.TAG = "LoginModel";
      return LoginModel;
    }(BaseModel_1.BaseModel);
    exports.LoginModel = LoginModel;
    cc._RF.pop();
  }, {
    "../../framework/base/BaseModel": "BaseModel",
    "../../framework/utils/LogUtil": "LogUtil"
  } ],
  LoginScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ba23cNM+6RCQoCcE3gmGjBm", "LoginScene");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.LoginScene = void 0;
    var BaseScene_1 = require("../../framework/base/BaseScene");
    var SoundConst_1 = require("../../framework/const/SoundConst");
    var ViewConst_1 = require("../../framework/const/ViewConst");
    var GameGlobal_1 = require("../../framework/GameGlobal");
    var LogUtil_1 = require("../../framework/utils/LogUtil");
    var LoginScene = function(_super) {
      __extends(LoginScene, _super);
      function LoginScene() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      LoginScene.prototype.init = function() {
        LogUtil_1.LogUtil.info(LoginScene.TAG, "==>init");
      };
      LoginScene.prototype.onEnter = function() {
        _super.prototype.onEnter.call(this);
        LogUtil_1.LogUtil.info(LoginScene.TAG, "onEnter");
        GameGlobal_1.GameGlobal.Viewer.closeAllViews();
        GameGlobal_1.GameGlobal.Viewer.initLayers();
        GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.LOGIN_VIEW);
        GameGlobal_1.GameGlobal.Sound.playMusic(SoundConst_1.SoundConst.AudioMusicType.BACKGROUND);
      };
      LoginScene.prototype.onExit = function() {
        _super.prototype.onExit.call(this);
        LogUtil_1.LogUtil.info(LoginScene.TAG, "onExit");
      };
      LoginScene.prototype.onBackKeyDown = function() {
        _super.prototype.onBackKeyDown.call(this);
        cc.sys.isNative && cc.sys.platform == cc.sys.ANDROID ? jsb.reflection.callStaticMethod("com/cocos/game/AppActivity", "exitApp", "()V") : cc.game.end();
      };
      LoginScene.TAG = "LoginScene";
      return LoginScene;
    }(BaseScene_1.BaseScene);
    exports.LoginScene = LoginScene;
    cc._RF.pop();
  }, {
    "../../framework/GameGlobal": "GameGlobal",
    "../../framework/base/BaseScene": "BaseScene",
    "../../framework/const/SoundConst": "SoundConst",
    "../../framework/const/ViewConst": "ViewConst",
    "../../framework/utils/LogUtil": "LogUtil"
  } ],
  LoginTipsView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a5e48lTLcNKOITxxug6HJZQ", "LoginTipsView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const BaseWindows_1 = require("../../../framework/base/BaseWindows");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let CommonTipsView = class CommonTipsView extends BaseWindows_1.BaseWindows {
      constructor() {
        super(...arguments);
        this.isClickRect = true;
      }
      initUI(...args) {
        super.initUI(...args);
      }
      onEnter() {
        super.onEnter();
        GameGlobal_1.GameGlobal.Http.token || GameGlobal_1.GameGlobal.DataManager.vistiorLogin();
      }
      initSelfUI(content) {}
      onBtnClick(event, customEventData) {
        GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.LOGIN_TIPS_VIEW);
        0 == customEventData || 1 == customEventData || 2 == customEventData && GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.LOGIN_VIEW);
      }
      onEnterBegin(event, customEventData) {}
    };
    CommonTipsView.TAG = "CommonTipsView";
    CommonTipsView = __decorate([ ccclass ], CommonTipsView);
    exports.default = CommonTipsView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ViewConst": "ViewConst"
  } ],
  LoginView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b1fcdApqKhI0rnM/hSU4/kF", "LoginView");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var BaseWindows_1 = require("../../../framework/base/BaseWindows");
    var ViewConst_1 = require("../../../framework/const/ViewConst");
    var GameGlobal_1 = require("../../../framework/GameGlobal");
    var UIUtil_1 = require("../../../framework/utils/UIUtil");
    var Utils_1 = require("../../../framework/utils/Utils");
    var HallConst_1 = require("../../const/HallConst");
    var HallHttpConst_1 = require("../../const/HallHttpConst");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var LoginView = function(_super) {
      __extends(LoginView, _super);
      function LoginView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.isClickRect = true;
        return _this;
      }
      LoginView.prototype.initUI = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        _super.prototype.initUI.apply(this, args);
        this.initSelfUI();
      };
      LoginView.prototype.initSelfUI = function() {
        this.areasRoot.active = false;
        this.txtPhoneHead.string = HallConst_1.default.PhoneHeads[0] + "";
        for (var i = 0; i < HallConst_1.default.PhoneHeads.length; i++) {
          var node = cc.instantiate(this.phoneItem);
          node.addComponent(cc.Button);
          var label = node.getComponent(cc.Label);
          label.string = HallConst_1.default.PhoneHeads[i] + "";
          var idx = i;
          UIUtil_1.UIUtil.addClickListener(node, this.onPhoneItemClick.bind(this, idx), this);
          this.scrollContent.addChild(node);
        }
      };
      LoginView.prototype.onPhoneItemClick = function(idx) {
        this.txtPhoneHead.string = HallConst_1.default.PhoneHeads[idx] + "";
        this.startPhoneAni(false);
      };
      LoginView.prototype.onBtnClick = function(event, customEventData) {
        if (0 == customEventData) GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.LOGIN_VIEW); else if (1 == customEventData) {
          this.areasRoot.active && this.startPhoneAni(false);
          var result = this.checkInput();
          if (1 == result) {
            var str = GameGlobal_1.GameGlobal.Lang.t("InvalidPhone");
            GameGlobal_1.GameGlobal.TipManager.showTip(str);
          } else if (2 == result) {
            var str = GameGlobal_1.GameGlobal.Lang.t("InvalidPassWord");
            GameGlobal_1.GameGlobal.TipManager.showTip(str);
          } else if (0 == result) {
            this.btnLogin.interactable = false;
            UIUtil_1.UIUtil.setGray(this.btnLogin.node, !this.btnLogin.interactable, true);
            var area = this.txtPhoneHead.string.replace("+", "");
            var phone = this.phoneInput.string;
            var pass = this.passWordInput.string;
            GameGlobal_1.GameGlobal.Http.post(HallHttpConst_1.default.PostLogin, {
              area: area,
              phone: phone,
              pass: pass
            }, this.onUserLoginResp, this, false);
          }
        } else if (3 == customEventData) this.startPhoneAni(!this.areasRoot.active); else if (4 == customEventData) this.areasRoot.active && this.startPhoneAni(false); else if (5 == customEventData) {
          GameGlobal_1.GameGlobal.Viewer.closeView(ViewConst_1.ViewConst.ViewName.LOGIN_VIEW);
          GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.FORGET_PASSWORD_VIEW);
        }
      };
      LoginView.prototype.onUserLoginResp = function(data) {
        this.btnLogin.interactable = true;
        UIUtil_1.UIUtil.setGray(this.btnLogin.node, !this.btnLogin.interactable, true);
        if (data && 200 == data.code) {
          GameGlobal_1.GameGlobal.TipManager.showTip("Login Sucess");
          GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.LOGIN_VIEW);
          data = data.data;
          if (data.accessToken) {
            var token = data.accessToken;
            GameGlobal_1.GameGlobal.Http.token = token;
            GameGlobal_1.GameGlobal.Store.setItem("token", token);
            GameGlobal_1.GameGlobal.DataManager.startRefleshUser(false);
          }
        } else GameGlobal_1.GameGlobal.TipManager.showTip("Login error!");
      };
      LoginView.prototype.onEnterBegin = function(event, customEventData) {
        this.areasRoot.active && this.startPhoneAni(false);
      };
      LoginView.prototype.checkInput = function() {
        var phone = this.phoneInput.string;
        var pw = this.passWordInput.string;
        if (!Utils_1.Utils.isPhoneNumber(phone)) return 1;
        if (pw.length < 8) return 2;
        return 0;
      };
      LoginView.prototype.startPhoneAni = function(bOut) {
        var _this = this;
        this.areasRoot.active = true;
        cc.Tween.stopAllByTarget(this.areasRoot);
        if (bOut) {
          this.mask.height = 0;
          cc.tween(this.mask).to(.15, {
            height: 250
          }, {
            easing: "sineIn"
          }).start();
        } else cc.tween(this.mask).to(.15, {
          height: 0
        }, {
          easing: "sineOut"
        }).call(function() {
          _this.areasRoot.active = false;
        }).start();
      };
      LoginView.TAG = "LoginView";
      __decorate([ property(cc.EditBox) ], LoginView.prototype, "phoneInput", void 0);
      __decorate([ property(cc.EditBox) ], LoginView.prototype, "passWordInput", void 0);
      __decorate([ property(cc.Prefab) ], LoginView.prototype, "phoneItem", void 0);
      __decorate([ property(cc.Node) ], LoginView.prototype, "areasRoot", void 0);
      __decorate([ property(cc.Node) ], LoginView.prototype, "scrollContent", void 0);
      __decorate([ property(cc.Label) ], LoginView.prototype, "txtPhoneHead", void 0);
      __decorate([ property(cc.Node) ], LoginView.prototype, "mask", void 0);
      __decorate([ property(cc.Button) ], LoginView.prototype, "btnLogin", void 0);
      LoginView = __decorate([ ccclass ], LoginView);
      return LoginView;
    }(BaseWindows_1.BaseWindows);
    exports.default = LoginView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../../framework/utils/UIUtil": "UIUtil",
    "../../../framework/utils/Utils": "Utils",
    "../../const/HallConst": "HallConst",
    "../../const/HallHttpConst": "HallHttpConst"
  } ],
  MailView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b84ef4KfhpJn6BEJ80n4Jgr", "MailView");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var BaseWindows_1 = require("../../../framework/base/BaseWindows");
    var ViewConst_1 = require("../../../framework/const/ViewConst");
    var GameGlobal_1 = require("../../../framework/GameGlobal");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var MailView = function(_super) {
      __extends(MailView, _super);
      function MailView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.isClickRect = true;
        return _this;
      }
      MailView.prototype.initUI = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        _super.prototype.initUI.apply(this, args);
        this.initSelfUI.apply(this, args);
      };
      MailView.prototype.initSelfUI = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        var bEmpty = args[0];
        this.haveRoot.active = !bEmpty;
        this.emptyRoot.active = !this.haveRoot.active;
        var checkIdx = 0;
        for (var i = 0; i < this.container.toggleItems.length; i++) if (this.container.toggleItems[i].isChecked) {
          checkIdx = i;
          break;
        }
        this.systemRoot.active = 0 == checkIdx;
        this.dailyRoot.active = 1 == checkIdx;
        this.leaderRoot.active = 2 == checkIdx;
      };
      MailView.prototype.onToggleChange = function(target, customEventData) {
        var checkIdx = 0;
        for (var i = 0; i < this.container.toggleItems.length; i++) if (this.container.toggleItems[i].isChecked) {
          checkIdx = i;
          break;
        }
        this.systemRoot.active = 0 == checkIdx;
        this.dailyRoot.active = 1 == checkIdx;
        this.leaderRoot.active = 2 == checkIdx;
      };
      MailView.prototype.onBtnClick = function(event, customEventData) {
        0 == customEventData ? GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.MAIL_VIEW) : 1 == customEventData || (2 == customEventData ? this.receiveRoot.active = true : 3 == customEventData || 4 == customEventData || 5 == customEventData);
      };
      MailView.TAG = "MailView";
      __decorate([ property(cc.Node) ], MailView.prototype, "emptyRoot", void 0);
      __decorate([ property(cc.Node) ], MailView.prototype, "haveRoot", void 0);
      __decorate([ property(cc.Node) ], MailView.prototype, "systemRoot", void 0);
      __decorate([ property(cc.Node) ], MailView.prototype, "dailyRoot", void 0);
      __decorate([ property(cc.Node) ], MailView.prototype, "leaderRoot", void 0);
      __decorate([ property(cc.Label) ], MailView.prototype, "txtSystem", void 0);
      __decorate([ property(cc.Label) ], MailView.prototype, "txtDaily", void 0);
      __decorate([ property(cc.Label) ], MailView.prototype, "txtLeader", void 0);
      __decorate([ property(cc.ToggleContainer) ], MailView.prototype, "container", void 0);
      __decorate([ property(cc.Node) ], MailView.prototype, "receiveRoot", void 0);
      MailView = __decorate([ ccclass ], MailView);
      return MailView;
    }(BaseWindows_1.BaseWindows);
    exports.default = MailView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ViewConst": "ViewConst"
  } ],
  MessageBoxView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "23e84WIpShB1ou9h5zglig7", "MessageBoxView");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var BaseWindows_1 = require("../base/BaseWindows");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var MessageBoxView = function(_super) {
      __extends(MessageBoxView, _super);
      function MessageBoxView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.isClickRect = false;
        _this.lbContent = null;
        return _this;
      }
      MessageBoxView.prototype.initUI = function() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
        this.lbContent.string = args[0];
        this.confirmCallback = args[1];
        this.cancelCallback = args[2];
      };
      MessageBoxView.prototype.onBtnConfirmClick = function() {
        this.confirmCallback && this.confirmCallback();
        this.myClose();
      };
      MessageBoxView.prototype.onBtnCloseClick = function() {
        this.cancelCallback && this.cancelCallback();
        this.myClose();
      };
      MessageBoxView.prototype.myClose = function() {};
      __decorate([ property(cc.Label) ], MessageBoxView.prototype, "lbContent", void 0);
      MessageBoxView = __decorate([ ccclass ], MessageBoxView);
      return MessageBoxView;
    }(BaseWindows_1.BaseWindows);
    exports.default = MessageBoxView;
    cc._RF.pop();
  }, {
    "../base/BaseWindows": "BaseWindows"
  } ],
  MiddleFishDieView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "352d4sr/LFNg6aSPI7nu89R", "MiddleFishDieView");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var MiddleFishDieView = function(_super) {
      __extends(MiddleFishDieView, _super);
      function MiddleFishDieView() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      MiddleFishDieView.prototype.Init = function(boomEffectParent, pos, targetPos) {
        this.targetPos = targetPos;
        this.node.setParent(boomEffectParent);
        this.node.position = pos;
        var animCtrl = this.node.getComponent(cc.Animation);
        animCtrl.on("stop", this.OnAnimStop, this);
        animCtrl.play();
      };
      MiddleFishDieView.prototype.OnAnimStop = function() {
        var _this = this;
        var action = cc.moveTo(.2, this.targetPos);
        this.node.runAction(cc.sequence(action, cc.callFunc(function() {
          _this.node.destroy();
        })));
      };
      MiddleFishDieView = __decorate([ ccclass ], MiddleFishDieView);
      return MiddleFishDieView;
    }(cc.Component);
    exports.default = MiddleFishDieView;
    cc._RF.pop();
  }, {} ],
  MyFormData: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fbac941GvJG7ZVPPmgtDDvC", "MyFormData");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.MyFormData = void 0;
    var MyFormData = function() {
      function MyFormData() {
        this._boundary_key = "myformdata";
        this._boundary = "--" + this._boundary_key;
        this._end_boundary = this._boundary + "--";
        this._result = "";
      }
      MyFormData.prototype.append = function(key, value, filename) {
        this._result += this._boundary + "\r\n";
        this._result += filename ? 'Content-Disposition: form-data; name="' + key + '"; filename="' + filename + '"\r\n\r\n' : 'Content-Disposition: form-data; name="' + key + '"\r\n\r\n';
        this._result += value + "\r\n";
      };
      Object.defineProperty(MyFormData.prototype, "arrayBuffer", {
        get: function() {
          this._result += "\r\n" + this._end_boundary;
          var charArr = [];
          for (var i = 0; i < this._result.length; i++) charArr.push(this._result.charCodeAt(i));
          var array = new Uint8Array(charArr);
          return array.buffer;
        },
        enumerable: false,
        configurable: true
      });
      return MyFormData;
    }();
    exports.MyFormData = MyFormData;
    cc._RF.pop();
  }, {} ],
  NestablePageView_Outer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "43555xVExVIkZZaGeWNfJA3", "NestablePageView_Outer");
    "use strict";
    cc.Class({
      extends: cc.PageView,
      properties: {
        m_InnerScrollViews: [ require("NestableScrollView_Inner") ],
        m_PlanDir: {
          default: null,
          visible: false
        },
        m_ScrollingInnerSv: {
          default: null,
          visible: false
        }
      },
      onLoad: function onLoad() {
        var _this = this;
        this._super();
        this.m_PlanDir = null;
        this.m_InnerScrollViews.forEach(function(inner) {
          inner.setOuterScrollView(_this);
        });
      },
      _isHisChild: function _isHisChild(child, undeterminedParent) {
        if (child == undeterminedParent) return true;
        if (null != child.parent) return child.parent == undeterminedParent || this._isHisChild(child.parent, undeterminedParent);
        return false;
      },
      _findScrollingInnerSv: function _findScrollingInnerSv(target) {
        for (var i = 0; i < this.m_InnerScrollViews.length; i++) {
          var isHisChild = this._isHisChild(target, this.m_InnerScrollViews[i].node);
          if (isHisChild) return this.m_InnerScrollViews[i];
        }
        return null;
      },
      isDifferentBetweenSettingAndPlan: function isDifferentBetweenSettingAndPlan(sv) {
        if (0 == this.m_PlanDir) return false;
        if (1 == this.m_PlanDir && sv.horizontal) return false;
        if (-1 == this.m_PlanDir && sv.vertical) return false;
        return true;
      },
      hasNestedViewGroup: function hasNestedViewGroup(event, captureListeners) {
        if (event.eventPhase !== cc.Event.CAPTURING_PHASE) return;
        return false;
      },
      _onTouchBegan: function _onTouchBegan(event, captureListeners) {
        this._touchBeganPosition = event.touch.getLocation();
        if (!this.enabledInHierarchy) return;
        if (this.hasNestedViewGroup(event, captureListeners)) return;
        this.m_PlanDir = null;
        this.m_ScrollingInnerSv = null;
        var touch = event.touch;
        this.content && this._handlePressLogic(touch);
        this._touchMoved = false;
        this._stopPropagationIfTargetIsMe(event);
      },
      _onTouchMoved: function _onTouchMoved(event, captureListeners) {
        if (!this.enabledInHierarchy) return;
        if (this.hasNestedViewGroup(event, captureListeners)) return;
        var touch = event.touch;
        var deltaMove = touch.getLocation().sub(touch.getStartLocation());
        if (null == this.m_PlanDir && deltaMove.mag() > 7) {
          this.m_ScrollingInnerSv = this._findScrollingInnerSv(event.target);
          if (null != this.m_ScrollingInnerSv) {
            var contentSize = this.m_ScrollingInnerSv.content.getContentSize();
            var scrollViewSize = this.m_ScrollingInnerSv.node.getContentSize();
            this.m_ScrollingInnerSv.vertical && contentSize.height > scrollViewSize.height || this.m_ScrollingInnerSv.horizontal && contentSize.width > scrollViewSize.width ? this.m_PlanDir = Math.abs(deltaMove.x) > Math.abs(deltaMove.y) ? 1 : -1 : this.m_PlanDir = 0;
          } else this.m_PlanDir = 0;
        }
        this.content && (this.isDifferentBetweenSettingAndPlan(this) || this._handleMoveLogic(touch));
        if (!this.cancelInnerEvents) return;
        if (null == this.m_ScrollingInnerSv) {
          if (deltaMove.mag() > 7 && !this._touchMoved && event.target !== this.node) {
            var cancelEvent = new cc.Event.EventTouch(event.getTouches(), event.bubbles);
            cancelEvent.type = cc.Node.EventType.TOUCH_CANCEL;
            cancelEvent.touch = event.touch;
            cancelEvent.simulate = true;
            event.target.dispatchEvent(cancelEvent);
            this._touchMoved = true;
          }
          this._stopPropagationIfTargetIsMe(event);
        }
      }
    });
    cc._RF.pop();
  }, {
    NestableScrollView_Inner: "NestableScrollView_Inner"
  } ],
  NestableScrollView_Inner: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3770etpsdpK4KiQAwSc8hBh", "NestableScrollView_Inner");
    "use strict";
    cc.Class({
      extends: cc.ScrollView,
      properties: {
        m_OuterScrollView: {
          default: null,
          visible: false
        }
      },
      setOuterScrollView: function setOuterScrollView(outer) {
        this.m_OuterScrollView = outer;
      },
      _onTouchMoved: function _onTouchMoved(event, captureListeners) {
        if (!this.enabledInHierarchy) return;
        if (this.hasNestedViewGroup(event, captureListeners)) return;
        var touch = event.touch;
        var deltaMove = touch.getLocation().sub(touch.getStartLocation());
        this.content && (this.m_OuterScrollView.isDifferentBetweenSettingAndPlan(this) || this._handleMoveLogic(touch));
        if (!this.cancelInnerEvents) return;
        if (deltaMove.mag() > 7 && !this._touchMoved && event.target !== this.node) {
          var cancelEvent = new cc.Event.EventTouch(event.getTouches(), event.bubbles);
          cancelEvent.type = cc.Node.EventType.TOUCH_CANCEL;
          cancelEvent.touch = event.touch;
          cancelEvent.simulate = true;
          event.target.dispatchEvent(cancelEvent);
          this._touchMoved = true;
        }
        this._stopPropagationIfTargetIsMe(event);
      }
    });
    cc._RF.pop();
  }, {} ],
  NestableScrollView_Outer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cf479BP95xBxbLSGJP029QO", "NestableScrollView_Outer");
    "use strict";
    cc.Class({
      extends: cc.ScrollView,
      properties: {
        m_InnerScrollViews: [ require("NestableScrollView_Inner") ],
        m_PlanDir: {
          default: null,
          visible: false
        },
        m_ScrollingInnerSv: {
          default: null,
          visible: false
        }
      },
      onLoad: function onLoad() {
        var _this = this;
        this.m_PlanDir = null;
        this.m_InnerScrollViews.forEach(function(inner) {
          inner.setOuterScrollView(_this);
        });
      },
      _isHisChild: function _isHisChild(child, undeterminedParent) {
        if (child == undeterminedParent) return true;
        if (null != child.parent) return child.parent == undeterminedParent || this._isHisChild(child.parent, undeterminedParent);
        return false;
      },
      _findScrollingInnerSv: function _findScrollingInnerSv(target) {
        for (var i = 0; i < this.m_InnerScrollViews.length; i++) {
          var isHisChild = this._isHisChild(target, this.m_InnerScrollViews[i].node);
          if (isHisChild) return this.m_InnerScrollViews[i];
        }
        return null;
      },
      isDifferentBetweenSettingAndPlan: function isDifferentBetweenSettingAndPlan(sv) {
        if (0 == this.m_PlanDir) return false;
        if (1 == this.m_PlanDir && sv.horizontal) return false;
        if (-1 == this.m_PlanDir && sv.vertical) return false;
        return true;
      },
      hasNestedViewGroup: function hasNestedViewGroup(event, captureListeners) {
        if (event.eventPhase !== cc.Event.CAPTURING_PHASE) return;
        return false;
      },
      _onTouchBegan: function _onTouchBegan(event, captureListeners) {
        if (!this.enabledInHierarchy) return;
        if (this.hasNestedViewGroup(event, captureListeners)) return;
        this.m_PlanDir = null;
        this.m_ScrollingInnerSv = null;
        var touch = event.touch;
        this.content && this._handlePressLogic(touch);
        this._touchMoved = false;
        this._stopPropagationIfTargetIsMe(event);
      },
      _onTouchMoved: function _onTouchMoved(event, captureListeners) {
        if (!this.enabledInHierarchy) return;
        if (this.hasNestedViewGroup(event, captureListeners)) return;
        var touch = event.touch;
        var deltaMove = touch.getLocation().sub(touch.getStartLocation());
        if (null == this.m_PlanDir && deltaMove.mag() > 7) {
          this.m_ScrollingInnerSv = this._findScrollingInnerSv(event.target);
          if (null != this.m_ScrollingInnerSv) {
            var contentSize = this.m_ScrollingInnerSv.content.getContentSize();
            var scrollViewSize = this.m_ScrollingInnerSv.node.getContentSize();
            this.m_ScrollingInnerSv.vertical && contentSize.height > scrollViewSize.height || this.m_ScrollingInnerSv.horizontal && contentSize.width > scrollViewSize.width ? this.m_PlanDir = Math.abs(deltaMove.x) > Math.abs(deltaMove.y) ? 1 : -1 : this.m_PlanDir = 0;
          } else this.m_PlanDir = 0;
        }
        this.content && (this.isDifferentBetweenSettingAndPlan(this) || this._handleMoveLogic(touch));
        if (!this.cancelInnerEvents) return;
        if (null == this.m_ScrollingInnerSv) {
          if (deltaMove.mag() > 7 && !this._touchMoved && event.target !== this.node) {
            var cancelEvent = new cc.Event.EventTouch(event.getTouches(), event.bubbles);
            cancelEvent.type = cc.Node.EventType.TOUCH_CANCEL;
            cancelEvent.touch = event.touch;
            cancelEvent.simulate = true;
            event.target.dispatchEvent(cancelEvent);
            this._touchMoved = true;
          }
          this._stopPropagationIfTargetIsMe(event);
        }
      }
    });
    cc._RF.pop();
  }, {
    NestableScrollView_Inner: "NestableScrollView_Inner"
  } ],
  NodeSizeSet: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8b02azvZshBCrmi9wTuegwJ", "NodeSizeSet");
    "use strict";
    var NodeSizeSet = cc.Class({
      name: "NodeSizeSet",
      properties: {
        language: "",
        width: cc.Float,
        height: cc.Float
      }
    });
    module.exports = NodeSizeSet;
    cc._RF.pop();
  }, {} ],
  NoticeVo: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0dcdaRpHjdAArmli31Y65VZ", "NoticeVo");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var NoticeVo = function() {
      function NoticeVo() {}
      return NoticeVo;
    }();
    exports.default = NoticeVo;
    cc._RF.pop();
  }, {} ],
  PathMoveUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "aae69a22RtLuJ1WaBUl9S9D", "PathMoveUtil");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var PathMoveUtil = function() {
      function PathMoveUtil() {}
      PathMoveUtil.GetAngle = function(start, end) {
        var dx = end.x - start.x;
        var dy = end.y - start.y;
        var dir = cc.v2(dx, dy);
        var angle = dir.signAngle(cc.v2(1, 0));
        var degree = angle / Math.PI * 180;
        return degree + 90;
      };
      PathMoveUtil.GetDirection = function(angle) {
        var radian = angle * Math.PI / 180;
        var dir = cc.v2(Math.sin(radian), Math.cos(radian));
        dir.normalizeSelf();
        return dir;
      };
      PathMoveUtil.GetNextPositionByAngle = function(currentPos, angle, speed, dt) {
        var dir = this.GetDirection(angle);
        currentPos.x += dt * dir.x * speed;
        currentPos.y += dt * dir.y * speed;
      };
      PathMoveUtil.GetDist = function(currentPos, targetPos) {
        var offX = targetPos.x - currentPos.x;
        var offY = targetPos.y - currentPos.y;
        var dist = Math.sqrt(offX * offX + offY * offY);
        return dist;
      };
      PathMoveUtil.GetNextPosition = function(currentPos, targetPos, speed) {
        var offX = targetPos.x - currentPos.x;
        var offY = targetPos.y - currentPos.y;
        var dx = offX;
        var dy = offY;
        var dist = Math.sqrt(offX * offX + offY * offY);
        if (dist > speed) {
          dx = speed * offX / dist;
          dy = speed * offY / dist;
        }
        var nextPos = cc.v3(currentPos.x + dx, currentPos.y + dy, 0);
        return nextPos;
      };
      PathMoveUtil = __decorate([ ccclass ], PathMoveUtil);
      return PathMoveUtil;
    }();
    exports.default = PathMoveUtil;
    cc._RF.pop();
  }, {} ],
  PlatformManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "05124D+JQROdIA71MKsskKx", "PlatformManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.PlatformManager = void 0;
    var Singleton_1 = require("../base/Singleton");
    var PlatformManager = function(_super) {
      __extends(PlatformManager, _super);
      function PlatformManager() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      PlatformManager.prototype.isLocal = function() {
        return true;
      };
      PlatformManager.prototype.isShowRecharge = function() {
        return true;
      };
      PlatformManager.prototype.isMiniGame = function() {
        return false;
      };
      PlatformManager.prototype.init = function() {};
      return PlatformManager;
    }(Singleton_1.Singleton);
    exports.PlatformManager = PlatformManager;
    cc._RF.pop();
  }, {
    "../base/Singleton": "Singleton"
  } ],
  PoolManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "eb638QZ5WdK5Zok/4oVSmkR", "PoolManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.PoolManager = void 0;
    var Singleton_1 = require("../base/Singleton");
    var GameGlobal_1 = require("../GameGlobal");
    var LogUtil_1 = require("../utils/LogUtil");
    var PoolManager = function(_super) {
      __extends(PoolManager, _super);
      function PoolManager() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.dictPool = {};
        _this.dictPrefab = {};
        _this.objMap = {};
        return _this;
      }
      PoolManager.getInstance = function() {
        return _super.getInstance.call(this);
      };
      PoolManager.prototype.getPrefab = function(prefabPath, parent) {
        if (this.dictPrefab[prefabPath]) {
          var prefab = this.dictPrefab[prefabPath];
          return this.getNode(prefab, parent);
        }
        var thiz_1 = this;
        GameGlobal_1.GameGlobal.Resource.loadRes(prefabPath, cc.Prefab, null, function(error, asset) {
          if (null == error) {
            thiz_1.dictPrefab[prefabPath] = asset;
            return thiz_1.getNode(asset, parent);
          }
          LogUtil_1.LogUtil.error("\u52a0\u8f7dprefab\u8d44\u6e90\u5931\u8d25\uff1a" + error);
        });
      };
      PoolManager.prototype.getNode = function(prefab, parent) {
        var name = prefab.data.name;
        var node;
        if (this.dictPool.hasOwnProperty(name)) {
          var pool = this.dictPool[name];
          node = pool.size() > 0 ? pool.get() : cc.instantiate(prefab);
        } else {
          var pool = new cc.NodePool();
          this.dictPool[name] = pool;
          node = cc.instantiate(prefab);
        }
        node.parent = parent;
        node.active = true;
        return node;
      };
      PoolManager.prototype.putNode = function(node) {
        if (!node || "" == node.name || !node.isValid) return;
        var name = node.name;
        var pool = null;
        if (this.dictPool.hasOwnProperty(name)) pool = this.dictPool[name]; else {
          pool = new cc.NodePool();
          this.dictPool[name] = pool;
        }
        pool.put(node);
      };
      PoolManager.prototype.getSpriteNode = function(name, parent) {
        var node;
        if (this.dictPool.hasOwnProperty(name)) {
          var pool = this.dictPool[name];
          if (pool.size() > 0) node = pool.get(); else {
            node = new cc.Node(name);
            node.addComponent(cc.Sprite);
          }
        } else {
          var pool = new cc.NodePool();
          this.dictPool[name] = pool;
          node = new cc.Node(name);
          node.addComponent(cc.Sprite);
        }
        node.parent = parent;
        return node;
      };
      PoolManager.prototype.clearPool = function(name) {
        if (this.dictPool.hasOwnProperty(name)) {
          var pool = this.dictPool[name];
          pool.clear();
        }
      };
      PoolManager.prototype.push = function(objData, objName) {
        objName = objName;
        var objList = this.objMap[objName];
        objList || (objList = this.objMap[objName] = []);
        -1 == objList.indexOf(objData) && objList.push(objData);
      };
      PoolManager.prototype.pop = function(objClaz, objName) {
        objName = objName;
        var objList = this.objMap[objName];
        if (objList && objList.length > 0) return objList.pop();
        var newObj = new objClaz();
        return newObj;
      };
      return PoolManager;
    }(Singleton_1.Singleton);
    exports.PoolManager = PoolManager;
    cc._RF.pop();
  }, {
    "../GameGlobal": "GameGlobal",
    "../base/Singleton": "Singleton",
    "../utils/LogUtil": "LogUtil"
  } ],
  PropConst: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "721c4VOEPdKuKfJKF6cRlFK", "PropConst");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    class PropConst {}
    exports.default = PropConst;
    PropConst.Prop60 = [ "prop_lock_60", "prop_freeze_60", "prop_sign_60", "prop_synthesis_60", "prop_special_60" ];
    PropConst.Prop80 = [ "prop_lock_80", "prop_freeze_80", "prop_sign_80", "prop_synthesis_80", "prop_special_80" ];
    cc._RF.pop();
  }, {} ],
  PropLayoutView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f976848rJVAxqz3zoZRHrn/", "PropLayoutView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const EventManager_1 = require("../../../framework/manager/EventManager");
    const SocketManager_1 = require("../../../framework/manager/SocketManager");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let PropLayoutView = class PropLayoutView extends cc.Component {
      constructor() {
        super(...arguments);
        this.SpeacialNode = null;
        this.SpeacialCheckNode = null;
        this.SpeacialData = null;
        this.SpeacialState = false;
      }
      start() {
        EventManager_1.EventManager.getInstance().addListener(SocketManager_1.EVENTMSG.Res_PropConf, this.Res_PropConf, this);
        this.SpeacialCheckNode.active = this.SpeacialState;
      }
      Res_PropConf(data) {
        cc.log(data);
        for (var i = 0; i < data.length; i++) {
          var prop = data[i];
          4 == prop.prop_type && (this.SpeacialData = prop);
        }
      }
      CbProp(event) {
        cc.log(!this.SpeacialState);
        if (!this.SpeacialState) {
          if (null == this.SpeacialData) {
            GameGlobal_1.GameGlobal.TipManager.showTip("There are no props to use\uff01");
            return;
          }
          GameGlobal_1.GameGlobal.Socket.sendMsg(SocketManager_1.EVENTMSG.Req_PropTrigger, {
            id: this.SpeacialData.id
          });
        }
      }
    };
    __decorate([ property(cc.Node) ], PropLayoutView.prototype, "SpeacialNode", void 0);
    __decorate([ property(cc.Node) ], PropLayoutView.prototype, "SpeacialCheckNode", void 0);
    PropLayoutView = __decorate([ ccclass ], PropLayoutView);
    exports.default = PropLayoutView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/manager/EventManager": "EventManager",
    "../../../framework/manager/SocketManager": "SocketManager"
  } ],
  PropsItemDetailComp: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cb5b3XJV0xOZpJHPmI31++x", "PropsItemDetailComp");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const ResConst_1 = require("../../../framework/const/ResConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const PropConst_1 = require("../../const/PropConst");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let PropsItemDetailComp = class PropsItemDetailComp extends cc.Component {
      init(data) {
        this.data = data;
        this.initSelfUI(data);
      }
      initSelfUI(data) {
        let maxCount = data && data.maxCount ? data.maxCount : 0;
        let name = data && data.propName ? data.propName : 0;
        let propDoc = data && data.propDoc ? data.propDoc : "";
        this.txtMost.string = "infinite";
        this.txtName.string = name + "";
        this.txtProps.string = propDoc;
        let image = data.propType;
        let index = data && data.propType ? data.propType : 0;
        index %= PropConst_1.default.Prop80.length;
        GameGlobal_1.GameGlobal.Resource.setFrame("", this.sPropSmall, ResConst_1.ResConst.PLIST_PATH.FORTPROP, PropConst_1.default.Prop80[index]);
        GameGlobal_1.GameGlobal.Resource.setFrame("", this.sPops, ResConst_1.ResConst.PLIST_PATH.FORTPROP, PropConst_1.default.Prop80[index]);
      }
    };
    __decorate([ property(cc.Label) ], PropsItemDetailComp.prototype, "txtName", void 0);
    __decorate([ property(cc.Sprite) ], PropsItemDetailComp.prototype, "sPops", void 0);
    __decorate([ property(cc.Label) ], PropsItemDetailComp.prototype, "txtPrice", void 0);
    __decorate([ property(cc.Label) ], PropsItemDetailComp.prototype, "txtMost", void 0);
    __decorate([ property(cc.Label) ], PropsItemDetailComp.prototype, "txtProps", void 0);
    __decorate([ property(cc.Sprite) ], PropsItemDetailComp.prototype, "sPropSmall", void 0);
    PropsItemDetailComp = __decorate([ ccclass ], PropsItemDetailComp);
    exports.default = PropsItemDetailComp;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/const/ResConst": "ResConst",
    "../../const/PropConst": "PropConst"
  } ],
  ProtocolFunDict: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e9bc0LuElxPdq4pE79UNscF", "ProtocolFunDict");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ProtocolFunDict = void 0;
    var ProtocolFunDict = function() {
      function ProtocolFunDict() {
        this._metaDictionary = {};
      }
      ProtocolFunDict.prototype._getMeta = function(tag) {
        var data = this._metaDictionary[tag];
        if (null == data) {
          data = new MetaInfo();
          data.protocolType = tag;
          this._metaDictionary[tag] = data;
        }
        return data;
      };
      ProtocolFunDict.prototype.set = function(tag, request, response) {
        var data = this._getMeta(tag);
        data.requestType = request;
        data.responseType = response;
      };
      ProtocolFunDict.prototype.get = function(tag) {
        return this._metaDictionary[tag];
      };
      return ProtocolFunDict;
    }();
    exports.ProtocolFunDict = ProtocolFunDict;
    var MetaInfo = function() {
      function MetaInfo() {}
      return MetaInfo;
    }();
    cc._RF.pop();
  }, {} ],
  RedpackItemComp: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f7064addy5HIYQHnIQ/FiRp", "RedpackItemComp");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const {ccclass: ccclass, property: property} = cc._decorator;
    let RedpackItemComp = class RedpackItemComp extends cc.Component {
      constructor() {
        super(...arguments);
        this.status = 0;
        this.proCount = 3;
      }
      init(data) {
        this.initSelfUI(data);
      }
      initSelfUI(data) {
        this.moneyRoot.active = 0 == this.status;
        this.openRoot.active = !this.moneyRoot.active;
        this.iconLock.active = 2 == this.status;
        this.txtMoney.string = this.money ? this.money + "" : "0";
      }
    };
    __decorate([ property(cc.Label) ], RedpackItemComp.prototype, "txtOpt", void 0);
    __decorate([ property(cc.Node) ], RedpackItemComp.prototype, "iconLock", void 0);
    __decorate([ property(cc.Node) ], RedpackItemComp.prototype, "openRoot", void 0);
    __decorate([ property(cc.Label) ], RedpackItemComp.prototype, "txtMoney", void 0);
    __decorate([ property(cc.Node) ], RedpackItemComp.prototype, "moneyRoot", void 0);
    RedpackItemComp = __decorate([ ccclass ], RedpackItemComp);
    exports.default = RedpackItemComp;
    cc._RF.pop();
  }, {} ],
  ResConst: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "19649gCOGdHZaZJ4hIHM5/G", "ResConst");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ResConst = void 0;
    class ResConst {}
    exports.ResConst = ResConst;
    ResConst.AUTO_RELEASE_TIME = 30;
    ResConst.ANIM_AUTO_RELEASE_TIME = 60;
    ResConst.BUNDLE_RESOURCES = "resources";
    ResConst.BundleMap = {
      mainRes: true,
      resources: true
    };
    ResConst.preBundleList = [ "mainRes", "resources" ];
    ResConst.commonResList = [ "mainRes/plist/game" ];
    ResConst.hallResList = [ "mainRes/plist/fish_hall", "mainRes/plist/head", "mainRes/plist/FortProp" ];
    ResConst.preLoadPrefabList = [ "mainRes/prefabs/view/hall/HallView", "mainRes/prefabs/view/hall/BindPhoneView" ];
    ResConst.preLoadJsonList = [ "mainRes/datas/configure", "mainRes/datas/map", "mainRes/datas/role_upgrade" ];
    ResConst.ModuleName = {
      LoadingView: "LoadingView",
      FishGameView: "FishGameView",
      HallView: "HallView",
      SettingView: "SettingView"
    };
    ResConst.moduleRes = {
      [ResConst.ModuleName.LoadingView]: {
        prefabs: {
          type: cc.Prefab,
          resList: []
        },
        plists: {
          type: cc.SpriteAtlas,
          resList: []
        },
        spriteframes: {
          type: cc.SpriteFrame,
          resList: []
        }
      },
      [ResConst.ModuleName.HallView]: {
        prefabs: {
          type: cc.Prefab,
          resList: []
        },
        plists: {
          type: cc.SpriteAtlas,
          resList: []
        },
        spriteframes: {
          type: cc.SpriteFrame,
          resList: []
        }
      },
      [ResConst.ModuleName.SettingView]: {
        prefabs: {
          type: cc.Prefab,
          resList: []
        },
        plists: {
          type: cc.SpriteAtlas,
          resList: []
        },
        spriteframes: {
          type: cc.SpriteFrame,
          resList: []
        }
      },
      [ResConst.ModuleName.FishGameView]: {
        prefabs: {
          type: cc.Prefab,
          resList: []
        },
        plists: {
          type: cc.SpriteAtlas,
          resList: []
        },
        spriteframes: {
          type: cc.SpriteFrame,
          resList: []
        }
      },
      [ResConst.ModuleName.LoadingView]: {
        prefabs: {
          type: cc.Prefab,
          resList: []
        },
        plists: {
          type: cc.SpriteAtlas,
          resList: []
        },
        spriteframes: {
          type: cc.SpriteFrame
        }
      }
    };
    ResConst.PLIST_PATH = {
      HALL: "mainRes/plist/fish_hall",
      FISH_GAME: "mainRes/plist/fish_game",
      HEAD: "mainRes/plist/head",
      FORTPROP: "mainRes/plist/FortProp"
    };
    cc._RF.pop();
  }, {} ],
  ResourceManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1649cDBMKVBIKx3XJqztmqc", "ResourceManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ResourceManager = exports.ResourceLoader = void 0;
    var ResConst_1 = require("../const/ResConst");
    var LogUtil_1 = require("../utils/LogUtil");
    var GameGlobal_1 = require("../GameGlobal");
    var ViewConst_1 = require("../const/ViewConst");
    var Singleton_1 = require("../base/Singleton");
    var ResourceLoader = function() {
      function ResourceLoader() {
        this.allResList = [];
        this.allNum = 0;
        this.curAssets = [];
        this.curNum = 0;
        this.isPreLoad = false;
      }
      ResourceLoader.prototype.reset = function() {
        this._progressCallback = null;
        this._finishCallback = null;
        this.allResList = null;
        this.allNum = 0;
        this.curAssets = null;
        this.curNum = 0;
        this.isPreLoad = false;
      };
      ResourceLoader.prototype.load = function(resList, progressCallback, completeCallback) {
        void 0 === completeCallback && (completeCallback = null);
        this._progressCallback = progressCallback;
        this._finishCallback = completeCallback;
        var num = 0;
        for (var i = 0, len = resList.length; i < len; i++) {
          var resItem = resList[i];
          num += resItem.resList.length;
        }
        this._progressCallback = progressCallback;
        this._finishCallback = completeCallback;
        this.allResList = resList;
        this.allNum = num;
        this.curAssets = [];
        GameGlobal_1.GameGlobal.Timer.once(this.loadingRes, this, 1);
      };
      ResourceLoader.prototype.preLoad = function(resList, progressCallback, completeCallback) {
        this.isPreLoad = true;
        this.load(resList, progressCallback, completeCallback);
      };
      ResourceLoader.prototype.loadingRes = function() {
        var _this = this;
        if (this.allResList.length > 0) {
          var resItem_1 = this.allResList.shift();
          if (resItem_1.resList && resItem_1.resList.length > 0) {
            var bundleName = GameGlobal_1.GameGlobal.Resource.getBundleNameByPath(resItem_1.resList[0]);
            var pathList_1 = [];
            for (var index = resItem_1.resList.length - 1; index >= 0; index--) {
              var resPath = resItem_1.resList[index];
              bundleName != ResConst_1.ResConst.BUNDLE_RESOURCES && (resPath = resPath.substring(bundleName.length + 1));
              resPath && "" != resPath && pathList_1.push(resPath);
            }
            if (pathList_1.length > 0) {
              var bundle = cc.assetManager.getBundle(bundleName);
              bundle ? this.isPreLoad ? bundle.preload(pathList_1, resItem_1.type, this.loadProgress.bind(this), this.loadCurItemFinished.bind(this)) : bundle.load(pathList_1, resItem_1.type, this.loadProgress.bind(this), this.loadCurItemFinished.bind(this)) : cc.assetManager.loadBundle(bundleName, function(err, bundle) {
                err ? LogUtil_1.LogUtil.debug("\u52a0\u8f7d\u5206\u5305\u51fa\u9519:" + err) : _this.isPreLoad ? bundle.preload(pathList_1, resItem_1.type, _this.loadProgress.bind(_this), _this.loadCurItemFinished.bind(_this)) : bundle.load(pathList_1, resItem_1.type, _this.loadProgress.bind(_this), _this.loadCurItemFinished.bind(_this));
              });
              return;
            }
          }
        }
        GameGlobal_1.GameGlobal.Timer.once(this.loadCurItemFinished, this, 1);
      };
      ResourceLoader.prototype.loadProgress = function(finishCount, totalCount, requestItem) {
        if (finishCount == totalCount) {
          this.curNum++;
          var percent = this.curNum / this.allNum * 100 | 0;
          if (this._progressCallback) {
            percent = Math.min(percent, 100);
            this._progressCallback(percent);
          }
        }
      };
      ResourceLoader.prototype.loadCurItemFinished = function(err, assets) {
        if (err) {
          LogUtil_1.LogUtil.error("\u52a0\u8f7d\u8d44\u6e90\u51fa\u9519:" + err);
          this._finishCallback && this._finishCallback(err, null);
        }
        if (assets) {
          (assets instanceof cc.Asset || assets instanceof Array) && (this.curAssets = this.curAssets.concat(assets));
          if (this.allResList.length > 0) GameGlobal_1.GameGlobal.Timer.once(this.loadingRes, this, 1); else if (this._finishCallback) {
            this._finishCallback(err, this.curAssets);
            this.reset();
          }
        }
      };
      return ResourceLoader;
    }();
    exports.ResourceLoader = ResourceLoader;
    var ResourceManager = function(_super) {
      __extends(ResourceManager, _super);
      function ResourceManager() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      ResourceManager.getInstance = function() {
        return _super.getInstance.call(this);
      };
      ResourceManager.prototype.init = function() {
        this._loadMap = {};
        this.openViewTime = {};
        this.loadingNum = 0;
        this.preLoadList = [];
        this.clear();
      };
      ResourceManager.prototype.clear = function() {};
      ResourceManager.prototype.getBundleNameByPath = function(resPath) {
        var bundleName = ResConst_1.ResConst.BUNDLE_RESOURCES;
        if (!resPath) return bundleName;
        var str = resPath.split("/");
        if (str.length > 0) {
          var subPath = str[0];
          ResConst_1.ResConst.BundleMap && ResConst_1.ResConst.BundleMap[subPath] && (bundleName = subPath);
        }
        return bundleName;
      };
      ResourceManager.prototype.getResByUrl = function(resPath, type) {
        var bundleName = this.getBundleNameByPath(resPath);
        var bundle = cc.assetManager.getBundle(bundleName);
        bundleName != ResConst_1.ResConst.BUNDLE_RESOURCES && (resPath = resPath.substring(bundleName.length + 1));
        if (bundle) return bundle.get(resPath, type);
        return null;
      };
      ResourceManager.prototype.loadRes = function(resPath, type, onProgress, onComplete) {
        var bundleName = this.getBundleNameByPath(resPath);
        var bundle = cc.assetManager.getBundle(bundleName);
        bundleName != ResConst_1.ResConst.BUNDLE_RESOURCES && (resPath = resPath.substring(bundleName.length + 1));
        if (bundle) {
          var asset = bundle.get(resPath, type);
          if (asset && asset.isValid && onComplete) {
            onComplete(null, asset);
            return;
          }
          return bundle.load(resPath, type, onProgress, onComplete);
        }
        cc.assetManager.loadBundle(bundleName, function(error, bundle) {
          if (!error) return bundle.load(resPath, type, onProgress, onComplete);
          LogUtil_1.LogUtil.debug("\u52a0\u8f7d\u5206\u5305\u51fa\u9519:" + error);
        });
      };
      ResourceManager.prototype.preLoadRes = function(resPath, type, onProgress, onComplete) {
        var bundleName = this.getBundleNameByPath(resPath);
        var bundle = cc.assetManager.getBundle(bundleName);
        bundleName != ResConst_1.ResConst.BUNDLE_RESOURCES && (resPath = resPath.substring(bundleName.length + 1));
        if (bundle) return bundle.preload(resPath, type, onProgress, onComplete);
        cc.assetManager.loadBundle(bundleName, function(error, bundle) {
          if (!error) return bundle.preload(resPath, type, onProgress, onComplete);
          LogUtil_1.LogUtil.error("\u52a0\u8f7d\u5206\u5305\u51fa\u9519:" + error);
        });
      };
      ResourceManager.prototype.loadViewRes = function(viewName, progressCallback, finishCallback) {
        var viewConf = ViewConst_1.ViewConst.ViewConf[viewName];
        if (!viewConf) return;
        var moduleConf = ResConst_1.ResConst.moduleRes[viewConf.resModule];
        var resList = [];
        if (moduleConf) {
          moduleConf.prefabs && -1 != moduleConf.prefabs.resList.indexOf(viewConf.prefab) || resList.push({
            type: cc.Prefab,
            resList: [ viewConf.prefab ]
          });
          for (var key in moduleConf) resList.push(moduleConf[key]);
        } else resList.push({
          type: cc.Prefab,
          resList: [ viewConf.prefab ]
        });
        this.loadResList(viewConf.resModule, resList, progressCallback, finishCallback);
      };
      ResourceManager.prototype.loadModuleRes = function(moduleName, moduleList, progressBack, finishCallback) {
        var resList = [];
        if (!moduleList || moduleList.length <= 0) {
          var moduleConf = ResConst_1.ResConst.moduleRes[moduleName];
          if (moduleConf) for (var key in moduleConf) resList.push(moduleConf[key]);
        } else for (var i = 0, len = moduleList.length; i < len; i++) if ("string" == typeof moduleList[i]) {
          var moduleConf = ResConst_1.ResConst.moduleRes[moduleList[i]];
          if (moduleConf) for (var key in moduleConf) resList.push(moduleConf[key]);
        } else resList.push(moduleList[i]);
        resList && resList.length > 0 && this.loadResList(moduleName, resList, progressBack, finishCallback);
      };
      ResourceManager.prototype.loadResList = function(moduleName, resList, progressBack, finishCallback) {
        for (var i = 0, len = resList.length; i < len; i++) {
          var index = this.preLoadList.indexOf(resList[i]);
          -1 != index && this.preLoadList.splice(index, 1);
        }
        var resLoader = new ResourceLoader();
        this.loadingNum++;
        var thiz = this;
        LogUtil_1.LogUtil.info("ResourceManager", "res:", resList);
        resLoader.load(resList, progressBack, function(err, assets) {
          finishCallback && finishCallback(err, assets);
          if (!err) for (var i = 0, len = assets.length; i < len; i++) GameGlobal_1.GameGlobal.Resource.addAssetRef(moduleName, assets[i]);
          thiz.loadingNum--;
          GameGlobal_1.GameGlobal.Timer.once(thiz.startLoadPreRes, thiz, 1);
        });
      };
      ResourceManager.prototype.preloadModuleRes = function(moduleList) {
        if (moduleList && moduleList.length > 0) {
          var resList = [];
          for (var i = 0, len = moduleList.length; i < len; i++) if ("string" == typeof moduleList[i]) {
            var moduleConf = ResConst_1.ResConst.moduleRes[moduleList[i]];
            if (moduleConf) for (var key in moduleConf) resList.push(moduleConf[key]);
          } else resList.push(moduleList[i]);
          for (var i = 0, len = resList.length; i < len; i++) this.preLoadList.indexOf(resList[i]) < 0 && this.preLoadList.push(resList[i]);
        }
      };
      ResourceManager.prototype.startLoadPreRes = function() {
        var _this = this;
        if (this.loadingNum > 0) return;
        if (!this.preLoadList || this.preLoadList.length <= 0) return;
        var resLoader = new ResourceLoader();
        var resItem = this.preLoadList.shift();
        resLoader.preLoad([ resItem ], null, function(err, assets) {
          GameGlobal_1.GameGlobal.Timer.once(_this.startLoadPreRes, _this, 1);
        });
      };
      ResourceManager.prototype.setTexture = function(resModule, node, imagePath) {
        if (node) {
          var sprite = node.getComponent(cc.Sprite);
          sprite || (sprite = node.addComponent(cc.Sprite));
          this.setSingleFrame(resModule, sprite, imagePath);
        }
      };
      ResourceManager.prototype.setSingleFrame = function(resModule, sprite, imagePath, callBack) {
        this.loadRes(imagePath, cc.SpriteFrame, null, function(error, asset) {
          if (null == error) {
            if (asset) {
              sprite && null != sprite.node && sprite.node.isValid && (sprite.spriteFrame = asset);
              GameGlobal_1.GameGlobal.Resource.addAssetRef(resModule, asset);
            }
            callBack && callBack();
          } else LogUtil_1.LogUtil.error("\u52a0\u8f7d\u56fe\u7247\u5931\u8d25:" + error);
        });
      };
      ResourceManager.prototype.setFrame = function(resModule, node, altaPath, frameName) {
        if (node) {
          var sprite = node instanceof cc.Sprite ? node : node.getComponent(cc.Sprite);
          sprite || (sprite = node.addComponent(cc.Sprite));
          this.setSpriteFrame(resModule, sprite, altaPath, frameName);
        }
      };
      ResourceManager.prototype.setSpriteFrame = function(resModule, sprite, altaPath, frameName) {
        this.loadRes(altaPath, cc.SpriteAtlas, null, function(error, asset) {
          if (null == error) {
            if (asset) {
              var spriteFrame = asset.getSpriteFrame(frameName);
              spriteFrame ? sprite && null != sprite.node && sprite.isValid && (sprite.spriteFrame = spriteFrame) : LogUtil_1.LogUtil.error("\u56fe\u96c6" + altaPath + "\u4e2d\u4e0d\u5b58\u5728\uff1a" + frameName);
              GameGlobal_1.GameGlobal.Resource.addAssetRef(resModule, asset);
            }
          } else LogUtil_1.LogUtil.error("\u52a0\u8f7d\u56fe\u96c6\u5931\u8d25:" + error);
        });
      };
      ResourceManager.prototype.setNumberFont = function(resModule, label, fontPath, callback, target) {
        this.loadRes(fontPath, cc.LabelAtlas, null, function(error, asset) {
          if (null == error) {
            if (asset) {
              label && (label.font = asset);
              GameGlobal_1.GameGlobal.Resource.addAssetRef(resModule, asset);
            }
            callback && callback(target);
          } else LogUtil_1.LogUtil.error("\u52a0\u8f7d\u827a\u672f\u6570\u5b57\u5b57\u4f53\u51fa\u9519\uff1a" + error);
        });
      };
      ResourceManager.prototype.setBitmapFont = function(resModule, label, fontPath, callback, target) {
        this.loadRes(fontPath, cc.BitmapFont, null, function(error, asset) {
          if (null == error) {
            if (asset) {
              label && (label.font = asset);
              GameGlobal_1.GameGlobal.Resource.addAssetRef(resModule, asset);
            }
            callback && callback(target);
          } else LogUtil_1.LogUtil.error("\u52a0\u8f7d\u4f4d\u56fe\u5b57\u4f53\u51fa\u9519\uff1a" + error);
        });
      };
      ResourceManager.prototype.setSpineData = function(resModule, spine, spinePath, callback, isHide) {
        void 0 === isHide && (isHide = false);
        spine && spine.node && (spine.node.active = false);
        this.loadRes(spinePath, sp.SkeletonData, null, function(error, asset) {
          if (null == error) if (asset) {
            if (spine && spine.node && spine.isValid) {
              spine.node.active = false;
              spine.skeletonData = asset;
              spine.node.active = true;
              callback && callback(spine);
            }
            GameGlobal_1.GameGlobal.Resource.addAssetRef(resModule, asset);
          } else LogUtil_1.LogUtil.error("\u65e0\u6cd5\u6b63\u786e\u52a0\u8f7dSpine\u52a8\u753b\uff1a" + spinePath); else LogUtil_1.LogUtil.error("\u52a0\u8f7dSpine\u52a8\u753b\u51fa\u9519\uff1a" + error);
        });
      };
      ResourceManager.prototype.instantiatePrefab = function(resModule, prefabPath, pafrent, callback) {
        this.loadRes(prefabPath, cc.Prefab, function(error, asset) {
          if (error) LogUtil_1.LogUtil.debug("\u52a0\u8f7d\u8d44\u6e90\u9519\u8bef:" + error); else {
            var curNode = cc.instantiate(asset);
            curNode.parent = pafrent;
            GameGlobal_1.GameGlobal.Resource.addAssetRef(resModule, asset);
            callback && callback(curNode);
          }
        });
      };
      ResourceManager.prototype.loadServerRes = function(url, complete) {
        cc.assetManager.loadRemote(url, function(error, asset) {
          null == error ? complete && complete(asset) : LogUtil_1.LogUtil.error("\u52a0\u8f7d\u7f51\u7edc\u8d44\u6e90\u51fa\u9519:" + error);
        });
      };
      ResourceManager.prototype.addAssetRef = function(moduleName, asset) {
        if (!moduleName || "" == moduleName) return;
        var uuid = asset["_uuid"];
        this._loadMap[moduleName] || (this._loadMap[moduleName] = {});
        var item = this._loadMap[moduleName][uuid];
        if (!item) {
          this._loadMap[moduleName][uuid] = asset;
          asset.addRef();
        }
      };
      ResourceManager.prototype.releaseAll = function() {
        for (var moduleName in this._loadMap) this.releaseResByModule(moduleName);
      };
      ResourceManager.prototype.releaseResByModule = function(moduleName, time) {
        void 0 === time && (time = 0);
        var assetItems = this._loadMap[moduleName];
        if (assetItems) {
          var openTime = this.openViewTime[moduleName];
          if (time > 0 && time <= openTime) ; else {
            for (var key in assetItems) assetItems[key].decRef();
            delete this._loadMap[moduleName];
            this.openViewTime[moduleName] && delete this.openViewTime[moduleName];
            console.log("\u91ca\u653e\u8d44\u6e90\u6a21\u5757:" + moduleName);
          }
        }
      };
      ResourceManager.prototype.forceReleaseRes = function(asset) {
        cc.assetManager.releaseAsset(asset);
      };
      ResourceManager.prototype.clearCache = function() {};
      ResourceManager.prototype.getJsonData = function(fileName, cb) {
        cc.loader.loadRes("mainRes/datas/" + fileName, function(err, content) {
          if (err) {
            cc.error(err.message || err);
            return;
          }
          content.json ? cb(err, content.json) : cb("failed!!!");
        });
      };
      ResourceManager.prototype.getData = function(fileName, cb) {
        cc.loader.loadRes("mainRes/datas/" + fileName, function(err, content) {
          if (err) {
            cc.error(err.message || err);
            return;
          }
          var text = content.text;
          if (!text) {
            cc.loader.load(content.nativeUrl, function(err, content) {
              text = content;
              cb(err, text);
            });
            return;
          }
          cb(err, text);
        });
      };
      return ResourceManager;
    }(Singleton_1.Singleton);
    exports.ResourceManager = ResourceManager;
    cc._RF.pop();
  }, {
    "../GameGlobal": "GameGlobal",
    "../base/Singleton": "Singleton",
    "../const/ResConst": "ResConst",
    "../const/ViewConst": "ViewConst",
    "../utils/LogUtil": "LogUtil"
  } ],
  RollNumber: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "aaeb2fRkwRBLLhJ2byO7v7O", "RollNumber");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var RollNumber = function(_super) {
      __extends(RollNumber, _super);
      function RollNumber() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.fSpeed = 1;
        _this.iAddUnit = 1;
        _this.iSubUnit = 1;
        _this.lCurrNumber = 0;
        _this.lTargetNumber = 0;
        _this.bAdd = false;
        return _this;
      }
      RollNumber.prototype.onLoad = function() {
        this.lCurrNumber = 0;
        this.lTargetNumber = 0;
        this.bChangeing = false;
      };
      RollNumber.prototype.initNumber = function(lNumber) {
        this.lCurrNumber = lNumber;
        this.LabelNumber && (this.OnConversionFun ? this.LabelNumber.string = this.OnConversionFun(lNumber) : this.LabelNumber.string = lNumber + "");
      };
      RollNumber.prototype.setNumber = function(lNumber) {
        this.LabelNumber && (this.OnConversionFun ? this.LabelNumber.string = this.OnConversionFun(lNumber) : this.LabelNumber.string = lNumber);
      };
      RollNumber.prototype.setNumberChange = function(lNumber) {
        lNumber = parseInt(lNumber);
        this.lTargetNumber = lNumber;
        if (this.lCurrNumber != this.lTargetNumber) {
          this.bAdd = this.lTargetNumber > this.lCurrNumber;
          this.unschedule(this.onNumberChangeTime);
          this.schedule(this.onNumberChangeTime, this.fSpeed);
        }
      };
      RollNumber.prototype.onNumberChangeTime = function() {
        if (this.bAdd) {
          if (this.lTargetNumber > this.lCurrNumber) {
            this.lCurrNumber += this.iAddUnit;
            if (this.lCurrNumber >= this.lTargetNumber) {
              this.lCurrNumber = this.lTargetNumber;
              this.unschedule(this.onNumberChangeTime);
              this.bChangeing = false;
            }
          }
        } else if (this.lTargetNumber < this.lCurrNumber) {
          this.lCurrNumber -= this.iSubUnit;
          if (this.lCurrNumber <= this.lTargetNumber) {
            this.lCurrNumber = this.lTargetNumber;
            this.unschedule(this.onNumberChangeTime);
          }
        }
        this.setNumber(this.lCurrNumber);
      };
      RollNumber.prototype.onSetRunSpeed = function() {
        var nNum = this.lTargetNumber - this.lCurrNumber;
        this.iAddUnit = 1;
      };
      __decorate([ property(cc.Label) ], RollNumber.prototype, "LabelNumber", void 0);
      __decorate([ property(cc.Float) ], RollNumber.prototype, "fSpeed", void 0);
      __decorate([ property(cc.Float) ], RollNumber.prototype, "iAddUnit", void 0);
      __decorate([ property(cc.Float) ], RollNumber.prototype, "iSubUnit", void 0);
      RollNumber = __decorate([ ccclass ], RollNumber);
      return RollNumber;
    }(cc.Component);
    exports.default = RollNumber;
    cc._RF.pop();
  }, {} ],
  RoundRectMask: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "159ac2AUNpGGowJZxR0JM3w", "RoundRectMask");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.RoundRectMask = void 0;
    var property = cc._decorator.property;
    var ccclass = cc._decorator.ccclass;
    var executeInEditMode = cc._decorator.executeInEditMode;
    var disallowMultiple = cc._decorator.disallowMultiple;
    var requireComponent = cc._decorator.requireComponent;
    var menu = cc._decorator.menu;
    cc.macro.ENABLE_WEBGL_ANTIALIAS = true;
    var RoundRectMask = function(_super) {
      __extends(RoundRectMask, _super);
      function RoundRectMask() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._radius = 50;
        _this.mask = null;
        return _this;
      }
      Object.defineProperty(RoundRectMask.prototype, "radius", {
        get: function() {
          return this._radius;
        },
        set: function(r) {
          this._radius = r;
          this.updateMask(r);
        },
        enumerable: false,
        configurable: true
      });
      RoundRectMask.prototype.onEnable = function() {
        this.mask = this.getComponent(cc.Mask);
        this.updateMask(this.radius);
      };
      RoundRectMask.prototype.updateMask = function(r) {
        var _radius = r >= 0 ? r : 0;
        _radius < 1 && (_radius = Math.min(this.node.width, this.node.height) * _radius);
        this.mask["radius"] = _radius;
        this.mask["onDraw"] = this.onDraw.bind(this.mask);
        this.mask["_updateGraphics"] = this._updateGraphics.bind(this.mask);
        this.mask.type = cc.Mask.Type.RECT;
      };
      RoundRectMask.prototype._updateGraphics = function() {
        var graphics = this._graphics;
        if (!graphics) return;
        this.onDraw(graphics);
      };
      RoundRectMask.prototype.onDraw = function(graphics) {
        graphics.clear(false);
        var node = this.node;
        var width = node.width;
        var height = node.height;
        var x = -width * node.anchorX;
        var y = -height * node.anchorY;
        graphics.roundRect(x, y, width, height, this.radius || 0);
        cc.game.renderType === cc.game.RENDER_TYPE_CANVAS ? graphics.stroke() : graphics.fill();
      };
      __decorate([ property() ], RoundRectMask.prototype, "_radius", void 0);
      __decorate([ property({
        tooltip: "\u5706\u89d2\u534a\u5f84:\n0-1\u4e4b\u95f4\u4e3a\u6700\u5c0f\u8fb9\u957f\u6bd4\u4f8b\u503c, \n>1\u4e3a\u5177\u4f53\u50cf\u7d20\u503c"
      }) ], RoundRectMask.prototype, "radius", null);
      RoundRectMask = __decorate([ ccclass(), executeInEditMode(true), disallowMultiple(true), requireComponent(cc.Mask), menu("\u6e32\u67d3\u7ec4\u4ef6/\u5706\u89d2\u906e\u7f69") ], RoundRectMask);
      return RoundRectMask;
    }(cc.Component);
    exports.RoundRectMask = RoundRectMask;
    cc._RF.pop();
  }, {} ],
  SByteArray: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d0ec1ReLzFDxo+dOA+iBkkM", "SByteArray");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SByteArray = void 0;
    var SprotoConst_1 = require("./SprotoConst");
    var SByteArray = function() {
      function SByteArray() {
        this._data = new DataView(new ArrayBuffer(0));
      }
      Object.defineProperty(SByteArray.prototype, "Position", {
        get: function() {
          return this._position;
        },
        set: function(value) {
          this._position = value;
          this._writePosition = value > this._writePosition ? value : this._writePosition;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(SByteArray.prototype, "Buffer", {
        get: function() {
          return this._data.buffer;
        },
        set: function(value) {
          this._data = new DataView(value);
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(SByteArray.prototype, "Length", {
        get: function() {
          return this._writePosition;
        },
        set: function(value) {
          this._writePosition = value;
          var tmp = new Uint8Array(new ArrayBuffer(value));
          var byteLength = this._data.buffer.byteLength;
          byteLength > value && (this._position = value);
          var length = Math.min(byteLength, value);
          tmp.set(new Uint8Array(this._data.buffer, 0, length));
          this.Buffer = tmp.buffer;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(SByteArray.prototype, "mBytesAvailable", {
        get: function() {
          return this._data.byteLength - this._position;
        },
        enumerable: false,
        configurable: true
      });
      SByteArray.prototype.seek = function(pos, seekOrigin) {
        switch (seekOrigin) {
         case SprotoConst_1.SeekOrigin.Begin:
          this.Position = pos;
          break;

         case SprotoConst_1.SeekOrigin.Current:
          this.Position += pos;
          break;

         case SprotoConst_1.SeekOrigin.End:
          this.Position = this.Length + pos;
        }
      };
      SByteArray.prototype.writeByte = function(value) {
        this.validateBuffer(1);
        this._data.setInt8(this.Position++, value);
      };
      SByteArray.prototype.validateBuffer = function(len, needReplace) {
        void 0 === needReplace && (needReplace = false);
        this._writePosition = len > this._writePosition ? len : this._writePosition;
        len += this._position;
        if (this._data.byteLength < len || needReplace) {
          var tmp = new Uint8Array(new ArrayBuffer(len));
          var length = Math.min(this._data.buffer.byteLength, len);
          tmp.set(new Uint8Array(this._data.buffer, 0, length));
          this.Buffer = tmp.buffer;
        }
      };
      SByteArray.prototype.writeBytes = function(bytes, offset, length) {
        void 0 === offset && (offset = 0);
        void 0 === length && (length = 0);
        var writeLength;
        if (offset < 0) return;
        if (length < 0) return;
        writeLength = 0 == length ? bytes.length - offset : Math.min(bytes.length - offset, length);
        if (writeLength > 0) {
          this.validateBuffer(writeLength);
          var tmp_data = new DataView(bytes.buffer);
          var length_1 = writeLength;
          var BYTES_OF_UINT32 = 4;
          for (;length_1 > BYTES_OF_UINT32; length_1 -= BYTES_OF_UINT32) {
            this._data.setUint32(this._position, tmp_data.getUint32(offset));
            this.Position += BYTES_OF_UINT32;
            offset += BYTES_OF_UINT32;
          }
          for (;length_1 > 0; length_1--) this._data.setUint8(this.Position++, tmp_data.getUint8(offset++));
        }
      };
      SByteArray.prototype.readBytes = function(bytes, offset, length) {
        void 0 === offset && (offset = 0);
        void 0 === length && (length = 0);
        if (0 == length) length = this.mBytesAvailable; else if (!this.validate(length)) return null;
        for (var i = 0; i < length; i++) bytes[i + offset] = this._data.getUint8(this.Position++);
      };
      SByteArray.prototype.validate = function(len) {
        if (this._data.byteLength > 0 && this._position + len <= this._data.byteLength) return true;
      };
      return SByteArray;
    }();
    exports.SByteArray = SByteArray;
    cc._RF.pop();
  }, {
    "./SprotoConst": "SprotoConst"
  } ],
  SceneConst: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4a273muN9BJ/5HZYBgLw6Bu", "SceneConst");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SceneConst = void 0;
    var SceneConst = function() {
      function SceneConst() {}
      SceneConst.SceneType = {
        LoadingScene: 1,
        HallScene: 2,
        FishGameScene: 3
      };
      return SceneConst;
    }();
    exports.SceneConst = SceneConst;
    cc._RF.pop();
  }, {} ],
  SceneManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "533414TVrlHsqR+/yKddZbJ", "SceneManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SceneManager = void 0;
    var Singleton_1 = require("../base/Singleton");
    var SceneManager = function(_super) {
      __extends(SceneManager, _super);
      function SceneManager() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      SceneManager.getInstance = function() {
        return _super.getInstance.call(this);
      };
      SceneManager.prototype.init = function() {
        if (this._currScene) {
          this._currScene.onExit();
          this._currScene = null;
        }
        this._sceneClassDict = {};
      };
      SceneManager.prototype.register = function(sceneType, sceneClass) {
        sceneType = "" + sceneType;
        this._sceneClassDict[sceneType] = sceneClass;
      };
      SceneManager.prototype.unregister = function(sceneType) {
        sceneType = "" + sceneType;
        this._sceneClassDict[sceneType] && delete this._sceneClassDict[sceneType];
      };
      SceneManager.prototype.openScene = function(sceneType) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) params[_i - 1] = arguments[_i];
        sceneType = "" + sceneType;
        var sceneClass = this._sceneClassDict[sceneType];
        if (sceneClass && sceneClass.checkOpen()) {
          var newScene = new sceneClass();
          newScene.sceneType = sceneType;
          newScene.init.apply(newScene, params);
          this._currScene && this._currScene.onExit();
          newScene.onEnter();
          this._currScene = newScene;
          return newScene;
        }
      };
      Object.defineProperty(SceneManager.prototype, "currentScene", {
        get: function() {
          return this._currScene;
        },
        enumerable: false,
        configurable: true
      });
      return SceneManager;
    }(Singleton_1.Singleton);
    exports.SceneManager = SceneManager;
    cc._RF.pop();
  }, {
    "../base/Singleton": "Singleton"
  } ],
  SeatPlayerInfoView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fcb94LVZI9EpZg+/nxGfIVV", "SeatPlayerInfoView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const ResConst_1 = require("../../../framework/const/ResConst");
    const Utils_1 = require("../../../framework/utils/Utils");
    const HallConst_1 = require("../../const/HallConst");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let SeatPlayerInfoView = class SeatPlayerInfoView extends cc.Component {
      constructor() {
        super(...arguments);
        this.UIBag = null;
        this.bgSprite = null;
      }
      Init(data) {
        cc.log(this.node.name + "refresh-----Init " + data);
        null == this.UIBag && (this.UIBag = GameGlobal_1.GameGlobal.BuildDecendantsBag(this.node));
        if (null == data) {
          this.node.active = false;
          this.bgSprite.active = false;
        } else {
          this.node.active = true;
          this.bgSprite.active = true;
          var flag = GameGlobal_1.GameGlobal.playerUUID == data.user_id;
          this.UIBag.TryGetValue("addButton").active = flag;
          this.UIBag.TryGetValue("reduceButton").active = flag;
          this.UIBag.TryGetValue("infoNode").active = flag;
          var headUrl = Number.parseInt(data.head_url || 1);
          let headIdx = isNaN(headUrl) ? 0 : headUrl % HallConst_1.default.Heads.length;
          GameGlobal_1.GameGlobal.Resource.setFrame("", this.UIBag.TryGetValue("headSprite"), ResConst_1.ResConst.PLIST_PATH.HEAD, HallConst_1.default.Heads[headIdx]);
          this.UIBag.TryGetValue("coinLabel").getComponent("cc.Label").string = Utils_1.Utils.getShowCoin(data.coin);
          this.UIBag.TryGetValue("userName").getComponent("cc.Label").string = data.nick_name.toString();
        }
      }
    };
    __decorate([ property(cc.Node) ], SeatPlayerInfoView.prototype, "bgSprite", void 0);
    SeatPlayerInfoView = __decorate([ ccclass ], SeatPlayerInfoView);
    exports.default = SeatPlayerInfoView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/const/ResConst": "ResConst",
    "../../../framework/utils/Utils": "Utils",
    "../../const/HallConst": "HallConst"
  } ],
  SeatView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e1e12LkoD9Oqb4QMX+pAcRm", "SeatView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __awaiter = this && this.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const EventManager_1 = require("../../../framework/manager/EventManager");
    const SeatPlayerInfoView_1 = require("./SeatPlayerInfoView");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let SeatView = class SeatView extends cc.Component {
      constructor() {
        super(...arguments);
        this.serverIndex = 0;
        this.clientIndex = 0;
        this.angle = 0;
      }
      start() {
        this.waitInfoNode.active = false;
        this.RefreshPlayerInfo();
      }
      GetCoinPosition() {
        var pos = this.playerInfoNode.node.position;
        return pos;
      }
      GetUserID() {
        if (null == this.user_info) return null;
        return this.user_info.user_id;
      }
      PlayerLeavel() {
        this.user_info = null;
        this.fort_info = null;
        this.RefreshPlayerInfo();
      }
      GetWorldPosition() {
        var pos = this.node.convertToWorldSpaceAR(cc.v2(0, 0));
        return pos;
      }
      GePosition() {
        var pos = this.node.getPosition();
        return pos;
      }
      GetLanuchPosition() {
        var node = this.battery.getChildByName("lanuchNode");
        var pos = node.convertToWorldSpaceAR(cc.v2(0, 0));
        return pos;
      }
      HasSameIndex() {
        return this.serverIndex == this.clientIndex;
      }
      PopBattery() {
        if (null != this.battery) {
          this.battery.destroy();
          this.battery = null;
        }
      }
      RefreshFortInfo() {
        return __awaiter(this, void 0, void 0, function*() {
          this.PopBattery();
          var portID = this.fort_info.grade;
          0 == portID && (portID = 1);
          cc.log("portID:" + portID);
          var batteryPrefab = yield GameGlobal_1.GameGlobal.getPrefabFromUrl("mainRes/prefabs/battery/" + portID);
          this.battery = cc.instantiate(batteryPrefab);
          2 != this.clientIndex && 3 != this.clientIndex || this.ChangeAngle(180);
          this.node.addChild(this.battery);
          this.battery.getChildByName("ServelLabel").getComponent("cc.Label").string = "S:" + this.serverIndex.toString();
          this.battery.getChildByName("ClientLabel").getComponent("cc.Label").string = "C:" + this.clientIndex.toString();
        });
      }
      RefreshPlayerInfo() {
        this.playerInfoNode.Init(this.user_info);
        null == this.user_info && this.PopBattery();
      }
      ChangeBulletAngle(angle) {
        if (this.HasSameIndex()) {
          2 != this.serverIndex && 3 != this.serverIndex || (angle += 180);
          return angle;
        }
        angle = this.serverIndex > this.clientIndex ? 360 - angle : 180 - angle;
        return angle;
      }
      ChangeFort(data) {
        this.fort_info = data;
        this.RefreshFortInfo();
      }
      Init(seatInfo, clientIndex, isMine) {
        this.user_info = seatInfo.user_info;
        this.clientIndex = clientIndex;
        this.serverIndex = seatInfo.seat_id;
        this.fort_info = seatInfo.fort_info;
        if (isMine) {
          var isHas = null == this.fort_info || 0 == this.fort_info.grade;
          cc.log("isHas" + isHas);
          EventManager_1.EventManager.getInstance().dispatch("RemoveNoCannonMaskNode", isHas);
        }
        this.RefreshFortInfo();
        this.RefreshPlayerInfo();
      }
      ChangeAngle(angle) {
        this.angle = angle;
        null != this.battery && (this.battery.getChildByName("barrel").angle = -angle);
      }
    };
    __decorate([ property(SeatPlayerInfoView_1.default) ], SeatView.prototype, "playerInfoNode", void 0);
    __decorate([ property(cc.Node) ], SeatView.prototype, "waitInfoNode", void 0);
    __decorate([ property(cc.Integer) ], SeatView.prototype, "serverIndex", void 0);
    __decorate([ property(cc.Integer) ], SeatView.prototype, "clientIndex", void 0);
    SeatView = __decorate([ ccclass ], SeatView);
    exports.default = SeatView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/manager/EventManager": "EventManager",
    "./SeatPlayerInfoView": "SeatPlayerInfoView"
  } ],
  ShopView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "01976en7fdBiYM1kdlFUMVd", "ShopView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var ShopView_1;
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const BaseWindows_1 = require("../../../framework/base/BaseWindows");
    const ResConst_1 = require("../../../framework/const/ResConst");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const LogUtil_1 = require("../../../framework/utils/LogUtil");
    const UIUtil_1 = require("../../../framework/utils/UIUtil");
    const FortConst_1 = require("../../const/FortConst");
    const HallHttpConst_1 = require("../../const/HallHttpConst");
    const PropConst_1 = require("../../const/PropConst");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let ShopView = ShopView_1 = class ShopView extends BaseWindows_1.BaseWindows {
      constructor() {
        super(...arguments);
        this.isClickRect = true;
        this.fortList = [];
        this.propsList = [];
        this.checkIdx = 0;
      }
      initUI(...args) {
        super.initUI(...args);
        this.initSelfUI();
        try {
          GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetShopFortList, {
            page: 1,
            pageSize: 10
          }, this.onFortListResp, this);
          GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetShopPropList, {
            page: 1,
            pageSize: 10
          }, this.onPropsListResp, this);
        } catch (error) {
          LogUtil_1.LogUtil.info(ShopView_1.TAG, `${error}`);
        }
      }
      initSelfUI() {
        this.fortRoot.active = 0 == this.checkIdx;
        this.propsRoot.active = !this.fortRoot.active;
        for (let i = 0; i < this.container.toggleItems.length; i++) {
          let item = this.container.toggleItems[i];
          item.isChecked = this.checkIdx == i;
        }
      }
      onCheckChange(container, customEventData) {
        for (let i = 0; i < this.container.toggleItems.length; i++) {
          let item = this.container.toggleItems[i];
          if (item.isChecked) {
            this.checkIdx = i;
            break;
          }
        }
        this.fortRoot.active = 0 == this.checkIdx;
        this.propsRoot.active = !this.fortRoot.active;
      }
      onFortListResp(data) {
        if (data && 200 == data.code) {
          data = data.data;
          if (data) {
            if (data.list && data.list.length > 0) {
              this.fortList = this.fortList.concat(data.list);
              this.refleshForts();
            }
            let total = data.total ? data.total : 0;
            if (this.fortList < total) {
              let page = Math.floor(this.fortList.length / 10) + 1;
              GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetShopFortList, {
                page: page,
                pageSize: 10
              }, this.onFortListResp, this);
            }
          }
        }
      }
      onPropsListResp(data) {
        if (data && 200 == data.code) {
          data = data.data;
          if (data) {
            if (data.list && data.list.length > 0) {
              this.propsList = this.propsList.concat(data.list);
              this.refleshProps();
            }
            let total = data.total ? data.total : 0;
            if (this.propsList < total) {
              let page = Math.floor(this.propsList.length / 10) + 1;
              GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetShopPropList, {
                page: page,
                pageSize: 10
              }, this.onPropsListResp, this);
            }
          }
        }
      }
      refleshForts() {
        let curIdx = this.fortContent.childrenCount;
        for (let i = curIdx; i < this.fortList.length; i++) {
          let item = cc.instantiate(this.fortItemPrefab);
          item.addComponent(cc.Button);
          let idx = i;
          UIUtil_1.UIUtil.addClickListener(item, this.onFortItemClick.bind(this, idx, item), this);
          this.fortContent.addChild(item);
          let name = item.getChildByName("txtName");
          let num = item.getChildByName("txtCount");
          let fort = item.getChildByName("fort");
          let price = item.getChildByName("priceRoot").getChildByName("txtPrice");
          let txtName = name.getComponent(cc.Label);
          let txtNum = num.getComponent(cc.Label);
          let sFort = fort.getComponent(cc.Sprite);
          let txtPrice = price.getComponent(cc.Label);
          let image = this.fortList[i].commodityImages;
          let index = this.fortList[i].commodityGrade ? this.fortList[i].commodityGrade : 0;
          index %= FortConst_1.default.Fort80.length;
          GameGlobal_1.GameGlobal.Resource.setFrame("", sFort, ResConst_1.ResConst.PLIST_PATH.FORTPROP, FortConst_1.default.Fort80[index]);
          txtName.string = this.fortList[i].commodityName + "";
          txtNum.string = this.fortList[i].haveOwned + "/" + this.fortList[i].maxOwned;
          txtPrice.string = this.fortList[i].commodityPrice + "";
        }
      }
      refleshProps() {
        let curIdx = this.propsContent.childrenCount;
        for (let i = curIdx; i < this.propsList.length; i++) {
          let item = cc.instantiate(this.propItemPrefab);
          item.addComponent(cc.Button);
          let idx = i;
          UIUtil_1.UIUtil.addClickListener(item, this.onPropItemClick.bind(this, idx, item), this);
          this.propsContent.addChild(item);
          let txtName = item.getChildByName("txtName").getComponent(cc.Label);
          let txtNum = item.getChildByName("txtCount").getComponent(cc.Label);
          let sProp = item.getChildByName("prop").getComponent(cc.Sprite);
          let txtPrice = item.getChildByName("priceRoot").getChildByName("txtPrice").getComponent(cc.Label);
          let itemData = this.propsList[i];
          let commodityName = itemData.commodityName;
          let commodityBeforeStock = itemData.commodityBeforeStock;
          let commodityPrice = itemData.commodityPrice;
          let commodityTotalStock = itemData.commodityTotalStock;
          let image = itemData.propId;
          txtName.string = commodityName + "";
          txtPrice.string = commodityPrice + "";
          txtNum.string = commodityBeforeStock + "";
          let index = itemData.commodityType;
          index %= PropConst_1.default.Prop80.length;
          GameGlobal_1.GameGlobal.Resource.setFrame("", sProp, ResConst_1.ResConst.PLIST_PATH.FORTPROP, PropConst_1.default.Prop80[index]);
        }
      }
      onBuyFortResp(data) {
        LogUtil_1.LogUtil.info(ShopView_1.TAG, `${JSON.stringify(data)}`);
        if (data && 200 == data.code) {
          data = data.data;
          if (data && data.buysCode) {
            GameGlobal_1.GameGlobal.TipManager.showTip("Buy Fort Sucess!");
            this.fortList.length = 0;
            this.fortContent.removeAllChildren();
            GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetShopFortList, {
              page: 1,
              pageSize: 10
            }, this.onFortListResp, this);
          }
        } else GameGlobal_1.GameGlobal.TipManager.showTip("Buy Fort Error!");
      }
      onBuyPropResp(data) {
        LogUtil_1.LogUtil.info(ShopView_1.TAG, `${JSON.stringify(data)}`);
        let bSucess = false;
        if (data && 200 == data.code) {
          data = data.data;
          data && data.buysCode && (bSucess = true);
        }
        if (bSucess) {
          this.propsList.length = 0;
          this.propsContent.removeAllChildren();
          GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetShopPropList, {
            page: 1,
            pageSize: 10
          }, this.onPropsListResp, this);
          GameGlobal_1.GameGlobal.TipManager.showTip("Buy Prop Sucess!");
        } else GameGlobal_1.GameGlobal.TipManager.showTip("Buy Prop Error!");
      }
      onFortItemClick(idx, item) {
        GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.BUY_DETAIL_VIEW, this.onToBuyFort.bind(this, idx), this, this.fortList[idx]);
      }
      onPropItemClick(idx, item) {
        let tips = GameGlobal_1.GameGlobal.Lang.t("Shop.TipsBuy");
        GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.BUY_PROP_DETAIL_VIEW, this.onToBuyProp.bind(this, idx), this, this.propsList[idx]);
      }
      onToBuyFort(idx) {
        let coin = GameGlobal_1.GameGlobal.DataManager.userInfo.coin;
        coin = coin || 0;
        let commodityId = this.fortList[idx].commodityId;
        let price = this.fortList[idx].commodityPrice;
        coin < price ? GameGlobal_1.GameGlobal.TipManager.showTip("Coin is not enough") : GameGlobal_1.GameGlobal.Http.post(HallHttpConst_1.default.PostPurchaseFort, {
          commodityId: commodityId
        }, this.onBuyFortResp, this);
      }
      onToBuyProp(idx) {
        let commodityId = this.propsList[idx].commodityId;
        let coin = GameGlobal_1.GameGlobal.DataManager.userInfo.coin;
        coin = coin || 0;
        let price = this.fortList[idx].commodityPrice;
        coin < price ? GameGlobal_1.GameGlobal.TipManager.showTip("Coin is not enough") : GameGlobal_1.GameGlobal.Http.post(HallHttpConst_1.default.PostPurchaseProp, {
          commodityId: commodityId
        }, this.onBuyPropResp, this);
      }
      closeTipsView() {
        GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.COMMON_TIPS_VIEW);
      }
      onBtnClick(event, customEventData) {
        0 == customEventData ? GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.SHOP_VIEW) : 1 == customEventData || 2 == customEventData;
      }
    };
    ShopView.TAG = "ShopView";
    __decorate([ property(cc.Node) ], ShopView.prototype, "fortRoot", void 0);
    __decorate([ property(cc.Node) ], ShopView.prototype, "fortContent", void 0);
    __decorate([ property(cc.Node) ], ShopView.prototype, "propsRoot", void 0);
    __decorate([ property(cc.Node) ], ShopView.prototype, "propsContent", void 0);
    __decorate([ property(cc.ToggleContainer) ], ShopView.prototype, "container", void 0);
    __decorate([ property(cc.Prefab) ], ShopView.prototype, "fortItemPrefab", void 0);
    __decorate([ property(cc.Prefab) ], ShopView.prototype, "propItemPrefab", void 0);
    ShopView = ShopView_1 = __decorate([ ccclass ], ShopView);
    exports.default = ShopView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ResConst": "ResConst",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../../framework/utils/LogUtil": "LogUtil",
    "../../../framework/utils/UIUtil": "UIUtil",
    "../../const/FortConst": "FortConst",
    "../../const/HallHttpConst": "HallHttpConst",
    "../../const/PropConst": "PropConst"
  } ],
  Singleton: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5a18cg7vCBJdKv0PnjHqskv", "Singleton");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Singleton = void 0;
    var Singleton = function() {
      function Singleton() {}
      Singleton.getInstance = function() {
        var cls = this;
        cls._instance || (cls._instance = new cls());
        return cls._instance;
      };
      return Singleton;
    }();
    exports.Singleton = Singleton;
    cc._RF.pop();
  }, {} ],
  SocketManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e5fd25RdKBJ3q3z8smP16I/", "SocketManager");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SocketManager = exports.EVENTMSG = void 0;
    const Singleton_1 = require("../base/Singleton");
    const GameGlobal_1 = require("../GameGlobal");
    const SprotoParser_1 = require("../net/SprotoParser");
    const EventManager_1 = require("./EventManager");
    var EVENTMSG;
    (function(EVENTMSG) {
      EVENTMSG["SocketOpen"] = "SocketOpen";
      EVENTMSG["SocketClose"] = "SocketClose";
      EVENTMSG["Req_GetFortConf"] = "GetFortConfReq";
      EVENTMSG["Res_GetFortConf"] = "GetUserFortInfoRes";
      EVENTMSG["Req_ReplaceFort"] = "ReplaceFortReq";
      EVENTMSG["Res_ReplaceFort"] = "ReplaceFortRes";
      EVENTMSG["Res_BroadcastReplaceFort"] = "BroadcastReplaceFortRes";
      EVENTMSG["BroadcastLaunch"] = "BroadcastLaunch";
      EVENTMSG["Req_FortLaunch"] = "FortLaunchReq";
      EVENTMSG["Ret_InitAccess"] = "InitAccess";
      EVENTMSG["Rep_SendSession"] = "SendSession";
      EVENTMSG["Ret_LoginGame"] = "LoginGameReq";
      EVENTMSG["Res_LoginGame"] = "LoginGameRes";
      EVENTMSG["BroadcastJoinRoom"] = "BroadcastJoinRoom";
      EVENTMSG["Req_JoinRoom"] = "JoinRoomReq";
      EVENTMSG["Res_JoinRoom"] = "JoinGameRes";
      EVENTMSG["BroadcastOutFish"] = "BroadcastOutFish";
      EVENTMSG["Req_FishHit"] = "FishHitReq";
      EVENTMSG["Req_GetPropConf"] = "GetPropConfReq";
      EVENTMSG["BroadcastPropConf"] = "BroadcastPropConf";
      EVENTMSG["Res_PropConf"] = "PropConfRes";
      EVENTMSG["Req_PropTrigger"] = "PropTriggerReq";
      EVENTMSG["Req_GetRoomFishInfo"] = "GetRoomFishInfoReq";
      EVENTMSG["Res_GetRoomFishInfo"] = "GetRoomFishInfoRes";
      EVENTMSG["Res_BroadcastFishHit"] = "BroadcastFishHit";
      EVENTMSG["BroadcastLeaveRoom"] = "BroadcastLeaveRoom";
    })(EVENTMSG = exports.EVENTMSG || (exports.EVENTMSG = {}));
    class SocketManager extends Singleton_1.Singleton {
      static getInstance() {
        return super.getInstance();
      }
      init() {
        cc.log("Init=========");
        this._protoParser = new SprotoParser_1.SprotoParser();
        this._protoParser.init();
        this._cmdCallDict = {};
        this.isConnect = false;
        this.isConnectFinish = false;
      }
      close() {
        cc.log("close=========");
        if (this._socket) {
          this._socket.close();
          this._socket = null;
          this.isConnect = false;
          this.isConnectFinish = false;
        }
      }
      connect(url) {
        this.close();
        this._socket = new WebSocket(url, "b!PoYK9Wn22f4b7Ys$qN6");
        this._socket.binaryType = "arraybuffer";
        this._socket.onopen = this.onSocketOpen;
        this._socket.onmessage = this.onSocketData;
        this._socket.onclose = this.onSocketClose;
        this._socket.onerror = this.onSocketError;
        this._connectUrl = url;
      }
      reconnect() {
        this._connectUrl && this.connect(this._connectUrl);
      }
      sendMsg(mid, data) {
        if (null != this._socket && this._socket.readyState === WebSocket.OPEN) {
          data = data || {};
          let sdata = {
            Command: mid,
            Data: data
          };
          this._socket.send(JSON.stringify(sdata));
        } else {
          cc.log("send error\uff1aWebSocket \u65ad\u5f00\uff0c\u9700\u8981\u91cd\u65b0\u8fde\u63a5\uff01");
          EventManager_1.EventManager.getInstance().dispatch(EVENTMSG.SocketClose);
        }
      }
      onSocketOpen(event) {
        this.isConnect = true;
        this.isConnectFinish = true;
        EventManager_1.EventManager.getInstance().dispatch(EVENTMSG.SocketOpen);
      }
      onSocketClose(event) {
        this.close();
      }
      onSocketError(event) {
        this.close();
      }
      onSocketData(event) {
        let rdata = JSON.parse(event.data);
        let mid = rdata.data.command;
        let data = rdata.data.data;
        200 == rdata.code ? EventManager_1.EventManager.getInstance().dispatch(mid, data) : cc.log(rdata.msg);
      }
      diposeMessage(cmd, data) {
        let callbackList = this._cmdCallDict[cmd];
        if (callbackList) for (let i = 0; i < callbackList.length; i++) {
          let callItem = callbackList[i];
          callItem[0].call(callItem[1], data);
        }
      }
      addListener(cmd, callback, target) {
        this._protoParser.addListener(cmd, callback, target);
      }
      removeListener(cmd, callback, target) {
        cmd = "" + cmd;
        let callbackList = this._cmdCallDict[cmd];
        if (callbackList) {
          for (let i = 0; i < callbackList.length; i++) {
            let callItem = callbackList[i];
            if (callItem[0] == callback && callItem[1] == target) {
              callbackList.splice(i, 1);
              break;
            }
          }
          0 == callbackList.length && delete this._cmdCallDict[cmd];
        }
      }
      loadProtoConfig(protoName, callback, target) {
        console.log("\u5f00\u59cb\u52a0\u8f7d\u534f\u8bae");
        GameGlobal_1.GameGlobal.Resource.loadRes(protoName, cc.Asset, null, data => {
          SocketManager.getInstance().curParse.loadProto(data.json);
          callback && callback.call(target);
        });
      }
      isConnectComplete() {
        return this.isConnectFinish;
      }
      get curParse() {
        return this._protoParser;
      }
    }
    exports.SocketManager = SocketManager;
    cc._RF.pop();
  }, {
    "../GameGlobal": "GameGlobal",
    "../base/Singleton": "Singleton",
    "../net/SprotoParser": "SprotoParser",
    "./EventManager": "EventManager"
  } ],
  SoundConst: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6b439mWdzhJto4qVXzCpESt", "SoundConst");
    var _a, _b;
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SoundConst = void 0;
    var SoundConst = function() {
      function SoundConst() {}
      SoundConst.Key = {
        KeyMusicOpen: "Key.Music.Open",
        KeySoundOpen: "Key.Sound.Open"
      };
      SoundConst.AudioMusicType = {
        BACKGROUND: 0,
        FIGHT: 1
      };
      SoundConst.AudioEffectType = {
        CLICK: 0,
        COIN_1: 1,
        COIN_3: 2,
        GAME_COMPLETE: 3,
        GAME_START: 4,
        PAGE: 5,
        TOOL_1: 6,
        TOOL_2: 7,
        TOOL_3: 8,
        UNLOCK: 9,
        UPGRADE: 10,
        WORD_COMPLETE: 11,
        WORD_CORRECT: 12,
        WORD_ERROR: 13,
        BTN_CLICK: 14
      };
      SoundConst.AudioMusicName = (_a = {}, _a[SoundConst.AudioMusicType.BACKGROUND] = "audios/game_bgm", 
      _a);
      SoundConst.AudioEffectName = (_b = {}, _b[SoundConst.AudioEffectType.CLICK] = "mainRes/audios/click", 
      _b[SoundConst.AudioEffectType.COIN_1] = "mainRes/audios/coin1", _b[SoundConst.AudioEffectType.COIN_3] = "mainRes/audios/coin3", 
      _b[SoundConst.AudioEffectType.GAME_COMPLETE] = "mainRes/audios/game_over", _b[SoundConst.AudioEffectType.GAME_START] = "mainRes/audios/game_start_new", 
      _b[SoundConst.AudioEffectType.PAGE] = "mainRes/audios/page", _b[SoundConst.AudioEffectType.TOOL_1] = "mainRes/audios/tool_1", 
      _b[SoundConst.AudioEffectType.TOOL_2] = "mainRes/audios/tool_2", _b[SoundConst.AudioEffectType.TOOL_3] = "mainRes/audios/props_3", 
      _b[SoundConst.AudioEffectType.UNLOCK] = "mainRes/audios/unlock", _b[SoundConst.AudioEffectType.UPGRADE] = "mainRes/audios/upgrade", 
      _b[SoundConst.AudioEffectType.WORD_COMPLETE] = "mainRes/audios/idiom_complete", 
      _b[SoundConst.AudioEffectType.WORD_CORRECT] = "mainRes/audios/idiom_correct", _b[SoundConst.AudioEffectType.WORD_ERROR] = "mainRes/audios/idiom_wrong", 
      _b[SoundConst.AudioEffectType.BTN_CLICK] = "audios/game_sound_btn_click", _b);
      return SoundConst;
    }();
    exports.SoundConst = SoundConst;
    cc._RF.pop();
  }, {} ],
  SoundManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "adcb9HMv8BBeLtT70z5n82L", "SoundManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SoundManager = void 0;
    var Singleton_1 = require("../base/Singleton");
    var SoundConst_1 = require("../const/SoundConst");
    var GameGlobal_1 = require("../GameGlobal");
    var LogUtil_1 = require("../utils/LogUtil");
    var SoundManager = function(_super) {
      __extends(SoundManager, _super);
      function SoundManager() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      SoundManager.getInstance = function() {
        return _super.getInstance.call(this);
      };
      SoundManager.prototype.init = function() {
        this.volume = 1;
        this.curSoundIds = {};
        this.isOnMusic = GameGlobal_1.GameGlobal.Store.getBoolean(SoundConst_1.SoundConst.Key.KeyMusicOpen, true);
        this.isOnSound = GameGlobal_1.GameGlobal.Store.getBoolean(SoundConst_1.SoundConst.Key.KeySoundOpen, true);
        cc.game.on(cc.game.EVENT_HIDE, this.onGamePause, this);
        cc.game.on(cc.game.EVENT_SHOW, this.onGameResume, this);
      };
      SoundManager.prototype.onGamePause = function() {
        this.isPause = true;
        cc.audioEngine.setEffectsVolume(0);
        cc.audioEngine.stopAllEffects();
        cc.audioEngine.setMusicVolume(0);
        cc.audioEngine.pauseMusic();
      };
      SoundManager.prototype.onGameResume = function() {
        this.isPause = false;
        cc.audioEngine.setEffectsVolume(this.volume);
        cc.audioEngine.setMusicVolume(this.volume);
        cc.audioEngine.resumeMusic();
      };
      SoundManager.prototype.openMusic = function() {
        this.isOnMusic = true;
        GameGlobal_1.GameGlobal.Store.setItem(SoundConst_1.SoundConst.Key.KeyMusicOpen, this.isOnMusic + "");
        this.curMusicIdEx && this.playMusic(this.curMusicIdEx);
        return !!this.curMusicIdEx;
      };
      SoundManager.prototype.stopMusic = function() {
        this.isOnMusic = false;
        GameGlobal_1.GameGlobal.Store.setItem(SoundConst_1.SoundConst.Key.KeyMusicOpen, this.isOnMusic + "");
        cc.audioEngine.stopMusic();
      };
      SoundManager.prototype.openSound = function() {
        this.isOnSound = true;
        GameGlobal_1.GameGlobal.Store.setItem(SoundConst_1.SoundConst.Key.KeySoundOpen, this.isOnSound + "");
      };
      SoundManager.prototype.stopSound = function() {
        this.isOnSound = false;
        GameGlobal_1.GameGlobal.Store.setItem(SoundConst_1.SoundConst.Key.KeySoundOpen, this.isOnSound + "");
        cc.audioEngine.stopAllEffects();
      };
      SoundManager.prototype.playMusic = function(musicId, loop) {
        void 0 === musicId && (musicId = null);
        void 0 === loop && (loop = true);
        this.curMusicIdEx = musicId;
        if (cc.game.isPaused()) return;
        if (!this.isOnMusic) return;
        if (musicId == this.curMusicId) this.musicAudio && cc.audioEngine.playMusic(this.musicAudio, true); else {
          var thiz_1 = this;
          var musicPath = SoundConst_1.SoundConst.AudioMusicName[musicId];
          GameGlobal_1.GameGlobal.Resource.loadRes(musicPath, cc.AudioClip, null, function(err, audio) {
            if (null == err) {
              cc.audioEngine.stopMusic();
              thiz_1.musicAudio = audio;
              thiz_1.curMusicId = musicId;
              cc.audioEngine.playMusic(audio, loop);
              cc.audioEngine.setFinishCallback(audio, function() {
                thiz_1.musicAudio = null;
              });
            } else LogUtil_1.LogUtil.debug("\u52a0\u8f7d\u80cc\u666f\u97f3\u4e50\u5931\u8d25:" + err);
          });
        }
      };
      SoundManager.prototype.playSound = function(soundId, loop) {
        void 0 === loop && (loop = false);
        if (cc.game.isPaused()) return;
        if (!this.isOnSound) return;
        var thiz = this;
        var soundPath = SoundConst_1.SoundConst.AudioEffectName[soundId];
        if (this.curSoundIds[soundPath]) return;
        GameGlobal_1.GameGlobal.Resource.loadRes(soundPath, cc.AudioClip, null, function(err, audio) {
          if (null == err) {
            var audioID = cc.audioEngine.playEffect(audio, loop);
            thiz.curSoundIds[soundPath] = audioID;
            cc.audioEngine.setFinishCallback(audioID, function() {
              thiz.curSoundIds[soundPath] = null;
            });
          } else LogUtil_1.LogUtil.debug("\u52a0\u8f7d\u97f3\u6548\u5931\u8d25:" + err);
        });
      };
      SoundManager.prototype.setVolume = function(soundId, volume) {
        var soundPath = SoundConst_1.SoundConst.AudioEffectName[soundId];
        var audioId = this.curMusicId == soundId ? this.musicAudio : this.curSoundIds[soundPath];
        var state = cc.audioEngine.getState(audioId);
        console.log("### audioId " + audioId + " state is: " + state);
        cc.audioEngine.setVolume(audioId, volume);
      };
      return SoundManager;
    }(Singleton_1.Singleton);
    exports.SoundManager = SoundManager;
    cc._RF.pop();
  }, {
    "../GameGlobal": "GameGlobal",
    "../base/Singleton": "Singleton",
    "../const/SoundConst": "SoundConst",
    "../utils/LogUtil": "LogUtil"
  } ],
  Spackage: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6acc3GIiMNC67cbkpcT69gL", "Spackage");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Spackage = void 0;
    var SprotoCore_1 = require("./SprotoCore");
    var Spackage = function() {
      function Spackage() {}
      Spackage.decodeSpackage = function(dser, pkg) {
        var tag = -1;
        while (-1 != (tag = dser.rt())) switch (tag) {
         case 0:
          pkg.type = dser.ri();
          break;

         case 1:
          pkg.session = dser.ri();
          break;

         default:
          dser.nod();
        }
        return pkg;
      };
      Spackage.encodeSpackage = function(pkg, st, n) {
        void 0 === n && (n = 2);
        var ser = SprotoCore_1.SprotoCore.getSerialize(st, n);
        void 0 != pkg.type && ser.wi(pkg.type, 0);
        void 0 != pkg.session && ser.wi(pkg.session, 1);
        return SprotoCore_1.SprotoCore.closeSerialize(ser);
      };
      return Spackage;
    }();
    exports.Spackage = Spackage;
    cc._RF.pop();
  }, {
    "./SprotoCore": "SprotoCore"
  } ],
  SpriteFrameSet: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "97019Q80jpE2Yfz4zbuCZBq", "SpriteFrameSet");
    "use strict";
    var SpriteFrameSet = cc.Class({
      name: "SpriteFrameSet",
      properties: {
        language: "",
        spriteFrame: cc.SpriteFrame
      }
    });
    module.exports = SpriteFrameSet;
    cc._RF.pop();
  }, {} ],
  SprotoConst: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "53548HcJLNBZ5qhjDVMjfdq", "SprotoConst");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SprotoTypeSize = exports.SeekOrigin = exports.SprotoConst = void 0;
    var ProtocolFunDict_1 = require("./ProtocolFunDict");
    var SprotoConst = function() {
      function SprotoConst() {}
      SprotoConst.C2S_PROTOCOL = new ProtocolFunDict_1.ProtocolFunDict();
      SprotoConst.S2C_PROTOCOL = new ProtocolFunDict_1.ProtocolFunDict();
      SprotoConst.TRANSCODE_DICT = {};
      return SprotoConst;
    }();
    exports.SprotoConst = SprotoConst;
    var SeekOrigin;
    (function(SeekOrigin) {
      SeekOrigin[SeekOrigin["Begin"] = 0] = "Begin";
      SeekOrigin[SeekOrigin["Current"] = 1] = "Current";
      SeekOrigin[SeekOrigin["End"] = 2] = "End";
    })(SeekOrigin = exports.SeekOrigin || (exports.SeekOrigin = {}));
    var SprotoTypeSize = function() {
      function SprotoTypeSize() {}
      SprotoTypeSize.error = function(info) {
        console.log(info);
      };
      SprotoTypeSize.SIZEOF_HEADER = 2;
      SprotoTypeSize.SIZEOF_LENGTH = 4;
      SprotoTypeSize.SIZEOF_FIELD = 2;
      SprotoTypeSize.ENCODE_MAX_SIZE = 16777216;
      return SprotoTypeSize;
    }();
    exports.SprotoTypeSize = SprotoTypeSize;
    cc._RF.pop();
  }, {
    "./ProtocolFunDict": "ProtocolFunDict"
  } ],
  SprotoCore: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e7d95MDTOVJKYh0gh+jJdou", "SprotoCore");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SprotoCore = void 0;
    var SprotoTypeSerialize_1 = require("./SprotoTypeSerialize");
    var SprotoTypeDeserialize_1 = require("./SprotoTypeDeserialize");
    var SprotoPack_1 = require("./SprotoPack");
    var Spackage_1 = require("./Spackage");
    var SprotoSender_1 = require("./SprotoSender");
    var SprotoReceiver_1 = require("./SprotoReceiver");
    var SprotoConst_1 = require("./SprotoConst");
    var SprotoCore = function() {
      function SprotoCore() {}
      SprotoCore.init = function() {
        SprotoCore._parserPack = new SprotoPack_1.SprotoPack();
        SprotoCore._pkg = new Spackage_1.Spackage();
      };
      SprotoCore.getSerialize = function(st, max) {
        var ser = SprotoCore.mSerialize.pop();
        null == ser && (ser = new SprotoTypeSerialize_1.SprotoTypeSerialize());
        ser.open(st, max);
        return ser;
      };
      SprotoCore.closeSerialize = function(ser) {
        var n = ser.close();
        SprotoCore.mSerialize.push(ser);
        return n;
      };
      SprotoCore.getDeserialize = function(byteArray, offset, size) {
        var ser = SprotoCore.mDeserialize.pop();
        null == ser && (ser = new SprotoTypeDeserialize_1.SprotoTypeDeserialize());
        ser.init(byteArray, offset, size);
        return ser;
      };
      SprotoCore.closeDeserialize = function(ser) {
        ser.Clear();
        SprotoCore.mDeserialize.push(ser);
      };
      SprotoCore.dispatch = function(byteArray) {
        var pack = SprotoCore._parserPack;
        var data = pack.unpack(byteArray);
        var sp = SprotoCore.getDeserialize(data, 0, data.length);
        var packet = SprotoCore._pkg;
        packet.type = void 0;
        packet.session = void 0;
        Spackage_1.Spackage.decodeSpackage(sp, packet);
        var offset = sp.Size();
        if (packet.type) {
          var rpcRsp = SprotoReceiver_1.SprotoReceiver.handlerType(packet.type, packet.session, data, offset);
          if (null != rpcRsp) return SprotoSender_1.SprotoSender.sendData(rpcRsp, packet.session, packet.type);
        } else SprotoSender_1.SprotoSender.handlerSession(packet.session, data, offset);
        SprotoCore.closeDeserialize(sp);
        return null;
      };
      SprotoCore.encodeObj = function(protocolName, data, stream) {
        var enObj = SprotoConst_1.SprotoConst.TRANSCODE_DICT[protocolName];
        if (enObj && enObj.e) {
          var ser = SprotoCore.getSerialize(stream, enObj.e.c);
          var encode = enObj.e.m;
          for (var key in encode) if ("undefined" != typeof data[key]) {
            var fun = encode[key];
            3 == fun.length ? ser[fun[0]].call(ser, fun[1], data[key], fun[2]) : ser[fun[0]].call(ser, data[key], fun[1]);
          }
          return SprotoCore.closeSerialize(ser);
        }
        return 0;
      };
      SprotoCore.decodeObj = function(protocolName, buffer, offset, size) {
        void 0 === offset && (offset = 0);
        void 0 === size && (size = buffer.length);
        var obj = {};
        var deObj = SprotoConst_1.SprotoConst.TRANSCODE_DICT[protocolName];
        if (deObj && deObj.d) {
          var deser = SprotoCore.getDeserialize(buffer, offset, size);
          var decode = deObj.d;
          var tag = -1;
          while (-1 != (tag = deser.rt())) {
            var fun = decode[tag];
            fun ? 3 == fun.length ? obj[fun[0]] = deser[fun[1]].call(deser, fun[2]) : obj[fun[0]] = deser[fun[1]].call(deser) : deser.nod;
          }
        }
        return obj;
      };
      SprotoCore.mSerialize = [];
      SprotoCore.mDeserialize = [];
      return SprotoCore;
    }();
    exports.SprotoCore = SprotoCore;
    cc._RF.pop();
  }, {
    "./Spackage": "Spackage",
    "./SprotoConst": "SprotoConst",
    "./SprotoPack": "SprotoPack",
    "./SprotoReceiver": "SprotoReceiver",
    "./SprotoSender": "SprotoSender",
    "./SprotoTypeDeserialize": "SprotoTypeDeserialize",
    "./SprotoTypeSerialize": "SprotoTypeSerialize"
  } ],
  SprotoPack: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a0de2focxhFubPM3NvNnwCV", "SprotoPack");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SprotoPack = void 0;
    var SByteArray_1 = require("./SByteArray");
    var SprotoConst_1 = require("./SprotoConst");
    var SprotoPack = function() {
      function SprotoPack() {
        this._buffer = new SByteArray_1.SByteArray();
        this._tmp = new Uint8Array([ 0, 0, 0, 0, 0, 0, 0, 0 ]);
      }
      SprotoPack.prototype._writeff = function(src, offset, pos, n) {
        var align8_n = n + 7 & -8;
        var curPos = this._buffer.Position;
        this._buffer.seek(pos, SprotoConst_1.SeekOrigin.Begin);
        this._buffer.writeByte(255);
        this._buffer.writeByte(align8_n / 8 - 1);
        this._buffer.writeBytes(src, offset, n);
        for (var i = 0; i < align8_n - n; i++) this._buffer.writeByte(0);
        this._buffer.seek(curPos, SprotoConst_1.SeekOrigin.Begin);
      };
      SprotoPack.prototype.packSeg = function(src, offset, ff_n) {
        var header = 0;
        var notzero = 0;
        var header_pos = this._buffer.Position;
        this._buffer.seek(1, SprotoConst_1.SeekOrigin.Current);
        for (var i = 0; i < 8; i++) if (0 != src[offset + i]) {
          notzero++;
          header |= 1 << i;
          this._buffer.writeByte(src[offset + i]);
        }
        (7 == notzero || 6 == notzero) && ff_n > 0 && (notzero = 8);
        if (8 == notzero) {
          if (ff_n > 0) {
            this._buffer.seek(header_pos, SprotoConst_1.SeekOrigin.Begin);
            return 8;
          }
          this._buffer.seek(header_pos, SprotoConst_1.SeekOrigin.Begin);
          return 10;
        }
        this._buffer.seek(header_pos, SprotoConst_1.SeekOrigin.Begin);
        this._buffer.writeByte(header);
        this._buffer.seek(header_pos, SprotoConst_1.SeekOrigin.Begin);
        return notzero + 1;
      };
      SprotoPack.prototype.pack = function(data, len) {
        void 0 === len && (len = 0);
        this.clear();
        var srcsz = 0 == len ? data.length : len;
        var ff_src = null;
        var ff_srcstart = 0;
        var ff_desstart = 0;
        var ff_n = 0;
        var src = data;
        var offset = 0;
        for (var i = 0; i < srcsz; i += 8) {
          offset = i;
          var padding = i + 8 - srcsz;
          if (padding > 0) {
            for (var j = 0; j < 8 - padding; j++) this._tmp[j] = src[i + j];
            for (var j = 0; j < padding; j++) this._tmp[7 - j] = 0;
            src = this._tmp;
            offset = 0;
          }
          var n = this.packSeg(src, offset, ff_n);
          if (10 == n) {
            ff_src = src;
            ff_srcstart = offset;
            ff_desstart = this._buffer.Position;
            ff_n = 1;
          } else if (8 == n && ff_n > 0) {
            ++ff_n;
            if (256 == ff_n) {
              this._writeff(ff_src, ff_srcstart, ff_desstart, 2048);
              ff_n = 0;
            }
          } else if (ff_n > 0) {
            this._writeff(ff_src, ff_srcstart, ff_desstart, 8 * ff_n);
            ff_n = 0;
          }
          this._buffer.seek(n, SprotoConst_1.SeekOrigin.Current);
        }
        if (1 == ff_n) this._writeff(ff_src, ff_srcstart, ff_desstart, 8); else if (ff_n > 1) {
          var length = ff_src == data ? srcsz : ff_src.length;
          this._writeff(ff_src, ff_srcstart, ff_desstart, length - ff_srcstart);
        }
        var maxsz = (srcsz + 2047) / 2048 * 2 + srcsz + 2;
        maxsz < this._buffer.Position && SprotoConst_1.SprotoTypeSize.error("packing error, return size=" + this._buffer.Position);
        var pack_buffer = new Uint8Array(this._buffer.Position);
        this._buffer.seek(0, SprotoConst_1.SeekOrigin.Begin);
        this._buffer.readBytes(pack_buffer, 0, pack_buffer.length);
        return pack_buffer;
      };
      SprotoPack.prototype.unpack = function(data, len) {
        void 0 === len && (len = 0);
        this.clear();
        len = 0 == len ? data.length : len;
        var srcsz = len;
        while (srcsz > 0) {
          var header = data[len - srcsz];
          --srcsz;
          if (255 == header) {
            srcsz < 0 && SprotoConst_1.SprotoTypeSize.error("invalid unpack stream.");
            var n = 8 * (data[len - srcsz] + 1);
            srcsz < n + 1 && SprotoConst_1.SprotoTypeSize.error("invalid unpack stream.");
            this._buffer.writeBytes(data, len - srcsz + 1, n);
            srcsz -= n + 1;
          } else for (var i = 0; i < 8; i++) {
            var nz = header >> i & 1;
            if (1 == nz) {
              srcsz < 0 && SprotoConst_1.SprotoTypeSize.error("invalid unpack stream.");
              this._buffer.writeByte(data[len - srcsz]);
              --srcsz;
            } else this._buffer.writeByte(0);
          }
        }
        var unpack_data = new Uint8Array(this._buffer.Position);
        this._buffer.seek(0, SprotoConst_1.SeekOrigin.Begin);
        this._buffer.readBytes(unpack_data, 0, unpack_data.length);
        return unpack_data;
      };
      SprotoPack.prototype.clear = function() {
        this._buffer.seek(0, SprotoConst_1.SeekOrigin.Begin);
        for (var i = 0; i < this._tmp.length; i++) this._tmp[i] = 0;
      };
      return SprotoPack;
    }();
    exports.SprotoPack = SprotoPack;
    cc._RF.pop();
  }, {
    "./SByteArray": "SByteArray",
    "./SprotoConst": "SprotoConst"
  } ],
  SprotoParser: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2242dEwm5hPy7vgqqgU2j99", "SprotoParser");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SprotoParser = void 0;
    var Sproto_1 = require("./sproto/Sproto");
    var SprotoParser = function() {
      function SprotoParser() {}
      SprotoParser.prototype.init = function(cryptType, cryptKey) {
        this._cryptType = cryptType;
        this._cryptKey = cryptKey;
        Sproto_1.Sproto.init();
      };
      SprotoParser.prototype.loadProto = function(data) {
        this.setStruct(data.protocol.struct);
        this.setProtocol(data.protocol.c2s);
        this.setProtocol(data.protocol.s2c, false);
      };
      SprotoParser.prototype.read = function(data) {
        Sproto_1.Sproto.dispatch(data);
      };
      SprotoParser.prototype.write = function(socket, cmd, data, rpcRspHandler, thisObj) {
        void 0 === rpcRspHandler && (rpcRspHandler = null);
        void 0 === thisObj && (thisObj = null);
        var sendBytes = Sproto_1.Sproto.pack(cmd, data, rpcRspHandler, thisObj);
        socket.send(sendBytes);
      };
      SprotoParser.prototype.addListener = function(cmd, rpcHandler, thisObj) {
        void 0 === thisObj && (thisObj = null);
        Sproto_1.Sproto.addHandler(cmd, rpcHandler, thisObj);
      };
      SprotoParser.prototype.setStruct = function(obj) {
        for (var key in obj) {
          var struct = obj[key];
          var fun = {
            e: this.genEncodeFun(struct),
            d: this.genDecodeFun(struct)
          };
          Sproto_1.Sproto.setTransCodeDict1(key, fun);
        }
      };
      SprotoParser.prototype.setProtocol = function(obj, isC2s) {
        void 0 === isC2s && (isC2s = true);
        for (var key in obj) {
          var protoObj = obj[key];
          var cmd = protoObj["cmd"];
          var reqStr = "";
          var rspStr = "";
          if (protoObj["request"]) {
            reqStr = isC2s ? "c2s_" + key + "_req" : "s2c_" + key + "_req";
            var reqObj = protoObj["request"];
            var encode = this.genEncodeFun(reqObj);
            var decode = this.genDecodeFun(reqObj);
            var reqFun = {
              e: encode,
              d: decode
            };
            Sproto_1.Sproto.setTransCodeDict1(reqStr, reqFun);
          }
          if (protoObj["response"]) {
            rspStr = isC2s ? "c2s_" + key + "_rsp" : "s2c_" + key + "_rsp";
            var rspObj = protoObj["response"];
            var encode = this.genEncodeFun(rspObj);
            var decode = this.genDecodeFun(rspObj);
            var rspFun = {
              e: encode,
              d: decode
            };
            Sproto_1.Sproto.setTransCodeDict1(rspStr, rspFun);
          }
          isC2s ? Sproto_1.Sproto.setC2sProtocol(cmd, reqStr, rspStr) : Sproto_1.Sproto.setS2cProtocol(cmd, reqStr, rspStr);
        }
      };
      SprotoParser.prototype.genEncodeFun = function(obj) {
        var result = {
          c: 0,
          m: {}
        };
        var count = 0;
        for (var fieldName in obj) {
          var field = obj[fieldName];
          var types = this.genTypeFun(field[0]);
          var fieldArr = [];
          for (var i = 0; i < types.length; i++) fieldArr.push(types[i]);
          fieldArr.push(field[1]);
          result["m"][fieldName] = fieldArr;
          count++;
        }
        result["c"] = count;
        return result;
      };
      SprotoParser.prototype.genDecodeFun = function(obj) {
        var result = {};
        for (var fieldName in obj) {
          var field = obj[fieldName];
          var types = this.genTypeFun(field[0], false);
          var fieldArr = [];
          fieldArr.push(fieldName);
          for (var i = 0; i < types.length; i++) fieldArr.push(types[i]);
          result[field[1]] = fieldArr;
        }
        return result;
      };
      SprotoParser.prototype.genTypeFun = function(type, isWrite) {
        void 0 === isWrite && (isWrite = true);
        var result;
        if (type.indexOf("*") > -1) {
          var tmpType = type.substr(1);
          result = this.genTypeFun(tmpType, isWrite);
          result[0] = result[0] + "a";
          return result;
        }
        switch (type) {
         case "int":
          result = isWrite ? [ "wi" ] : [ "ri" ];
          break;

         case "boolean":
          result = isWrite ? [ "wb" ] : [ "rb" ];
          break;

         case "string":
          result = isWrite ? [ "ws" ] : [ "rs" ];
          break;

         default:
          result = (isWrite, [ "ro", type ]);
        }
        return result;
      };
      return SprotoParser;
    }();
    exports.SprotoParser = SprotoParser;
    cc._RF.pop();
  }, {
    "./sproto/Sproto": "Sproto"
  } ],
  SprotoReceiver: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "18643tZBdBPCZ9CGHD5dQ+F", "SprotoReceiver");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SprotoReceiver = void 0;
    var SprotoConst_1 = require("./SprotoConst");
    var SprotoCore_1 = require("./SprotoCore");
    var SprotoReceiver = function() {
      function SprotoReceiver() {}
      SprotoReceiver.init = function() {
        SprotoReceiver._rpcReqHandlerDict = {};
      };
      SprotoReceiver.addHandler = function(cmd, rpc, thisObj) {
        if (!rpc) return;
        SprotoReceiver._rpcReqHandlerDict[cmd] && console.info("\u534f\u8bae\u76d1\u542c\u91cd\u590d\uff01cmd:" + cmd);
        SprotoReceiver._rpcReqHandlerDict[cmd] = {
          HandlerFunc: rpc,
          thisObject: thisObj
        };
      };
      SprotoReceiver.addHandlers = function(cmd, rpc, thisObj) {
        if (!rpc) return;
        var data = SprotoReceiver._rpcReqHandlerDict[cmd];
        if (null == data) {
          data = {};
          data.HandlerFunc = function(rsp) {
            for (var _i = 0, _a = this.list; _i < _a.length; _i++) {
              var listData = _a[_i];
              listData.func.call(listData.obj, rsp);
            }
          };
          data.thisObject = data;
          data.list = [];
          SprotoReceiver._rpcReqHandlerDict[cmd] = data;
        }
        data.list.push({
          func: rpc,
          obj: thisObj
        });
      };
      SprotoReceiver.removeHandler = function(cmd) {
        SprotoReceiver._rpcReqHandlerDict[cmd] ? delete SprotoReceiver._rpcReqHandlerDict[cmd] : console.error("Sproto Receiver Handler is not! cmd:" + cmd);
      };
      SprotoReceiver.handlerType = function(tag, session, buffer, offset) {
        var funcObj = SprotoReceiver._rpcReqHandlerDict[tag];
        if (null == funcObj) {
          console.log("\u6b64\u6d88\u606f\u6ca1\u6709\u6dfb\u52a0\u76d1\u542c\u65b9\u6cd5\uff0ctag:", tag);
          return null;
        }
        null == SprotoConst_1.SprotoConst.S2C_PROTOCOL.get(tag) && console.log("**** tag:" + tag);
        var reqType = SprotoConst_1.SprotoConst.S2C_PROTOCOL.get(tag).requestType;
        if (null == reqType) {
          console.log("\u6b64\u6d88\u606f\u89e3\u7801\u5931\u8d25\uff0ctag:", tag);
          return null;
        }
        var obj = SprotoCore_1.SprotoCore.decodeObj(reqType, buffer, offset);
        this.logRecData(tag, obj);
        var rpcRsp = funcObj.HandlerFunc.call(funcObj.thisObject, obj);
        if (null != session) return rpcRsp;
        return null;
      };
      SprotoReceiver.logRecData = function(tag, data) {
        var reqType = SprotoConst_1.SprotoConst.S2C_PROTOCOL.get(tag).requestType;
        console.log("\u6536\u5230\u5305:" + tag + ", " + reqType);
        console.log(data);
      };
      return SprotoReceiver;
    }();
    exports.SprotoReceiver = SprotoReceiver;
    cc._RF.pop();
  }, {
    "./SprotoConst": "SprotoConst",
    "./SprotoCore": "SprotoCore"
  } ],
  SprotoSender: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "511ceKaox5Hmrtygm6JCpAt", "SprotoSender");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SprotoSender = void 0;
    var Spackage_1 = require("./Spackage");
    var SprotoConst_1 = require("./SprotoConst");
    var SprotoCore_1 = require("./SprotoCore");
    var SprotoPack_1 = require("./SprotoPack");
    var SprotoStream_1 = require("./SprotoStream");
    var SprotoSender = function() {
      function SprotoSender() {}
      SprotoSender.init = function() {
        SprotoSender._session = 0;
        SprotoSender._rpcRspHandlerDict = {};
        SprotoSender._sessionDict = {};
        SprotoSender._sendPack = new SprotoPack_1.SprotoPack();
        SprotoSender._sendStream = new SprotoStream_1.SprotoStream();
      };
      SprotoSender.pack = function(tag, rpcReq, rpcRspHandler, thisObj) {
        void 0 === rpcReq && (rpcReq = null);
        void 0 === rpcRspHandler && (rpcRspHandler = null);
        void 0 === thisObj && (thisObj = null);
        if (null != rpcRspHandler) {
          var session = ++SprotoSender._session;
          SprotoSender._rpcRspHandlerDict[session] = thisObj && rpcRspHandler.bind(thisObj) || rpcRspHandler;
          SprotoSender._sessionDict[session] = SprotoConst_1.SprotoConst.C2S_PROTOCOL.get(tag).responseType;
          return SprotoSender.sendData(rpcReq, session, tag);
        }
        return SprotoSender.sendData(rpcReq, null, tag);
      };
      SprotoSender.sendData = function(rpc, session, tag) {
        this.logSendData(rpc, session, tag);
        var pkg = new Spackage_1.Spackage();
        pkg.type = tag;
        null != session && (pkg.session = session);
        var stream = SprotoSender._sendStream;
        stream.seek(0, SprotoConst_1.SeekOrigin.Begin);
        var len = Spackage_1.Spackage.encodeSpackage(pkg, stream);
        if (null != rpc) {
          var reqType = SprotoConst_1.SprotoConst.C2S_PROTOCOL.get(tag).requestType;
          len += SprotoCore_1.SprotoCore.encodeObj(reqType, rpc, stream);
        }
        var data = SprotoSender._sendPack.pack(stream.Buffer, len);
        if (data.length > SprotoSender.MAX_PACK_LEN) {
          console.log("data.Length > " + SprotoSender.MAX_PACK_LEN + " => " + data.length);
          return null;
        }
        return data.buffer;
      };
      SprotoSender.handlerSession = function(session, buffer, offset) {
        var respType = SprotoSender._sessionDict[session];
        var responseFunc = SprotoSender._rpcRspHandlerDict[session];
        if (respType && responseFunc) {
          var obj = SprotoCore_1.SprotoCore.decodeObj(respType, buffer, offset);
          this.logSessionData(session, obj, respType);
          responseFunc(obj);
        } else console.warn("SprotoSender.Handler not found => " + session);
        SprotoSender._sessionDict[session] = null;
        SprotoSender._rpcRspHandlerDict[session] = null;
        delete SprotoSender._sessionDict[session];
        delete SprotoSender._rpcRspHandlerDict[session];
      };
      SprotoSender.logSendData = function(data, session, tag) {
        var reqType = SprotoConst_1.SprotoConst.C2S_PROTOCOL.get(tag).requestType;
        reqType ? console.log("\u53d1\u9001\u5305:" + tag + ", " + reqType) : console.log("\u53d1\u9001\u5305:" + tag);
        console.log(data);
      };
      SprotoSender.logSessionData = function(session, data, type) {
        console.log("\u6536\u5230\u5305:" + type);
        console.log(data);
      };
      SprotoSender.MAX_PACK_LEN = 65535;
      return SprotoSender;
    }();
    exports.SprotoSender = SprotoSender;
    cc._RF.pop();
  }, {
    "./Spackage": "Spackage",
    "./SprotoConst": "SprotoConst",
    "./SprotoCore": "SprotoCore",
    "./SprotoPack": "SprotoPack",
    "./SprotoStream": "SprotoStream"
  } ],
  SprotoStream: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ff9b4P509hAJZM/e29oSd8Y", "SprotoStream");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SprotoStream = void 0;
    var SprotoConst_1 = require("./SprotoConst");
    var SprotoStream = function() {
      function SprotoStream() {
        this.size = 128;
        this.pos = 0;
        this.buffer = new Uint8Array(this.size);
      }
      Object.defineProperty(SprotoStream.prototype, "Position", {
        get: function() {
          return this.pos;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(SprotoStream.prototype, "Buffer", {
        get: function() {
          return this.buffer;
        },
        enumerable: false,
        configurable: true
      });
      SprotoStream.prototype._expand = function(sz) {
        void 0 === sz && (sz = 0);
        if (this.size - this.pos < sz) {
          var bak_sz = this.size;
          while (this.size - this.pos < sz) this.size = 2 * this.size;
          this.size >= SprotoConst_1.SprotoTypeSize.ENCODE_MAX_SIZE && SprotoConst_1.SprotoTypeSize.error("object is too large (>" + SprotoConst_1.SprotoTypeSize.ENCODE_MAX_SIZE + ")");
          var new_buffer = new Uint8Array(this.size);
          for (var i = 0; i < bak_sz; i++) new_buffer[i] = this.buffer[i];
          this.buffer = new_buffer;
        }
      };
      SprotoStream.prototype.writeByte = function(v) {
        this._expand(1);
        this.buffer[this.pos++] = v;
      };
      SprotoStream.prototype.write = function(data, offset, count) {
        this._expand(count);
        for (var i = 0; i < count; i++) this.buffer[this.pos++] = data[offset + i];
      };
      SprotoStream.prototype.seek = function(offset, loc) {
        switch (loc) {
         case SprotoConst_1.SeekOrigin.Begin:
          this.pos = offset;
          break;

         case SprotoConst_1.SeekOrigin.Current:
          this.pos += offset;
          break;

         case SprotoConst_1.SeekOrigin.End:
          this.pos = this.size + offset;
        }
        this._expand();
        return this.pos;
      };
      SprotoStream.prototype.read = function(buffer, offset, count) {
        for (var i = 0; i < count; i++) buffer[offset + i] = this.buffer[this.pos++];
      };
      SprotoStream.prototype.moveUp = function(position, up_count) {
        if (up_count <= 0) return;
        var count = this.pos - position;
        for (var i = 0; i < count; i++) this.buffer[position - up_count + i] = this.buffer[position + i];
        this.pos -= up_count;
      };
      SprotoStream.prototype.get = function(i) {
        (i < 0 || i >= this.size) && console.log("invalid idx:" + i + "@get");
        return this.buffer[i];
      };
      SprotoStream.prototype.set = function(i, value) {
        (i < 0 || i >= this.size) && console.log("invalid idx:" + i + "@set");
        this.buffer[i] = value;
      };
      return SprotoStream;
    }();
    exports.SprotoStream = SprotoStream;
    cc._RF.pop();
  }, {
    "./SprotoConst": "SprotoConst"
  } ],
  SprotoTypeBase: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "79cb56UNMxPQbdq25B/cptI", "SprotoTypeBase");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    cc._RF.pop();
  }, {} ],
  SprotoTypeDeserialize: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a4508V60otO9YwNnWhHYdRY", "SprotoTypeDeserialize");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SprotoTypeDeserialize = void 0;
    var BitUtil_1 = require("./BitUtil");
    var SprotoConst_1 = require("./SprotoConst");
    var SprotoCore_1 = require("./SprotoCore");
    var SprotoTypeReader_1 = require("./SprotoTypeReader");
    var SprotoTypeDeserialize = function() {
      function SprotoTypeDeserialize() {
        this.tag = -1;
        this.reader = new SprotoTypeReader_1.SprotoTypeReader();
      }
      SprotoTypeDeserialize.prototype.init = function(byteArray, offset, size) {
        this.Clear();
        this.reader.init(byteArray, offset, size);
        this._doInit();
      };
      SprotoTypeDeserialize.prototype._doInit = function() {
        this.fn = this._readWord();
        var header_length = SprotoConst_1.SprotoTypeSize.SIZEOF_HEADER + this.fn * SprotoConst_1.SprotoTypeSize.SIZEOF_FIELD;
        this.begin_data_pos = header_length;
        this.cur_field_pos = this.reader.Position;
        this.reader.Length < header_length && SprotoConst_1.SprotoTypeSize.error("invalid decode header.");
        this.reader.seek(this.begin_data_pos);
      };
      SprotoTypeDeserialize.prototype._expand64 = function(v) {
        var value = v;
        0 != (2147483648 & value) && (value |= 0xffffffff00000000);
        return value;
      };
      SprotoTypeDeserialize.prototype._readWord = function() {
        var v1 = this.reader.readByte();
        var v2 = this.reader.readByte();
        return Math.pow(2, 8) * v2 + v1;
      };
      SprotoTypeDeserialize.prototype._readDword = function() {
        var v1 = this.reader.readByte();
        var v2 = this.reader.readByte();
        var v3 = this.reader.readByte();
        var v4 = this.reader.readByte();
        return v4 * Math.pow(2, 24) + v3 * Math.pow(2, 16) + v2 * Math.pow(2, 8) + v1;
      };
      SprotoTypeDeserialize.prototype._readDouble = function() {
        var v1 = this.reader.readByte();
        var v2 = this.reader.readByte();
        var v3 = this.reader.readByte();
        var v4 = this.reader.readByte();
        var v5 = this.reader.readByte();
        var v6 = this.reader.readByte();
        var v7 = this.reader.readByte();
        var v8 = this.reader.readByte();
        return v8 * Math.pow(2, 56) + v7 * Math.pow(2, 48) + v6 * Math.pow(2, 40) + v5 * Math.pow(2, 32) + v4 * Math.pow(2, 24) + v3 * Math.pow(2, 16) + v2 * Math.pow(2, 8) + v1;
      };
      SprotoTypeDeserialize.prototype._readArraySize = function() {
        this.value >= 0 && SprotoConst_1.SprotoTypeSize.error("invalid array value.");
        var sz = this._readDword();
        sz < 0 && SprotoConst_1.SprotoTypeSize.error("error array size(" + sz + ")");
        return sz;
      };
      SprotoTypeDeserialize.prototype._readElement = function(clsName, sz) {
        var read_size = 0;
        sz < SprotoConst_1.SprotoTypeSize.SIZEOF_LENGTH && SprotoConst_1.SprotoTypeSize.error("error array size.");
        var hsz = this._readDword();
        sz -= SprotoConst_1.SprotoTypeSize.SIZEOF_LENGTH;
        read_size += SprotoConst_1.SprotoTypeSize.SIZEOF_LENGTH;
        hsz > sz && SprotoConst_1.SprotoTypeSize.error("error array object.");
        var obj = SprotoCore_1.SprotoCore.decodeObj(clsName, this.reader.Buffer, this.reader.Offset, hsz);
        this.reader.seek(this.reader.Position + hsz);
        read_size += hsz;
        return [ obj, read_size ];
      };
      SprotoTypeDeserialize.prototype.rt = function() {
        var pos = this.reader.Position;
        this.reader.seek(this.cur_field_pos);
        while (this.reader.Position < this.begin_data_pos) {
          this.tag++;
          var value = this._readWord();
          if (0 == (1 & value)) {
            this.cur_field_pos = this.reader.Position;
            this.reader.seek(pos);
            this.value = Math.floor(.5 * value) - 1;
            return this.tag;
          }
          this.tag += Math.floor(.5 * value);
        }
        this.reader.seek(pos);
        return -1;
      };
      SprotoTypeDeserialize.prototype.ri = function() {
        if (this.value >= 0) return this.value;
        var sz = this._readDword();
        if (sz == SprotoTypeDeserialize.sizeof_uint32) {
          var v = this._expand64(this._readDword());
          return v;
        }
        if (sz == SprotoTypeDeserialize.sizeof_uint64) return this._readDouble();
        SprotoConst_1.SprotoTypeSize.error("read invalid integer size (" + sz + ")");
        return 0;
      };
      SprotoTypeDeserialize.prototype.ria = function() {
        var integer_list = null;
        var sz = this._readArraySize();
        if (0 == sz) return [];
        var len = this.reader.readByte();
        sz--;
        if (len == SprotoTypeDeserialize.sizeof_uint32) {
          sz % SprotoTypeDeserialize.sizeof_uint32 != 0 && SprotoConst_1.SprotoTypeSize.error("error array size(" + sz + ")@sizeof(Uint32)");
          integer_list = [];
          for (var i = 0; i < sz / SprotoTypeDeserialize.sizeof_uint32; i++) {
            var v = this._expand64(this._readDword());
            integer_list.push(v);
          }
        } else if (len == SprotoTypeDeserialize.sizeof_uint64) {
          sz % SprotoTypeDeserialize.sizeof_uint64 != 0 && SprotoConst_1.SprotoTypeSize.error("error array size(" + sz + ")@sizeof(Uint64)");
          integer_list = [];
          for (var i = 0; i < sz / SprotoTypeDeserialize.sizeof_uint64; i++) {
            var v_1 = this._readDouble();
            integer_list.push(v_1);
          }
        } else SprotoConst_1.SprotoTypeSize.error("error intlen(" + len + ")");
        return integer_list;
      };
      SprotoTypeDeserialize.prototype.rb = function() {
        if (this.value < 0) {
          SprotoConst_1.SprotoTypeSize.error("read invalid boolean.");
          return false;
        }
        return 0 != this.value;
      };
      SprotoTypeDeserialize.prototype.rba = function() {
        var sz = this._readArraySize();
        var boolean_list = [];
        for (var i = 0; i < sz; i++) {
          var v = 0 != this.reader.readByte();
          boolean_list.push(v);
        }
        return boolean_list;
      };
      SprotoTypeDeserialize.prototype.rs = function() {
        var sz = this._readDword();
        var buffer = new Uint8Array(sz);
        this.reader.read(buffer, 0, buffer.length);
        return BitUtil_1.BitUtil.decodeUTF8(buffer);
      };
      SprotoTypeDeserialize.prototype.rsa = function() {
        var sz = this._readArraySize();
        var stringList = [];
        for (var i = 0; sz > 0; i++) {
          sz < SprotoConst_1.SprotoTypeSize.SIZEOF_LENGTH && SprotoConst_1.SprotoTypeSize.error("error array size.");
          var hsz = this._readDword();
          sz -= SprotoConst_1.SprotoTypeSize.SIZEOF_LENGTH;
          hsz > sz && SprotoConst_1.SprotoTypeSize.error("error array object.");
          var buffer = new Uint8Array(hsz);
          this.reader.read(buffer, 0, buffer.length);
          var v = BitUtil_1.BitUtil.decodeUTF8(buffer);
          stringList.push(v);
          sz -= hsz;
        }
        return stringList;
      };
      SprotoTypeDeserialize.prototype.ro = function(clsName) {
        var sz = this._readDword();
        var obj = SprotoCore_1.SprotoCore.decodeObj(clsName, this.reader.Buffer, this.reader.Offset, sz);
        this.reader.seek(this.reader.Position + sz);
        return obj;
      };
      SprotoTypeDeserialize.prototype.roa = function(clsName) {
        var sz = this._readArraySize();
        var obj_list = [];
        for (var i = 0; sz > 0; i++) {
          var _a = this._readElement(clsName, sz), obj = _a[0], read_size = _a[1];
          obj_list.push(obj);
          sz -= read_size;
        }
        return obj_list;
      };
      SprotoTypeDeserialize.prototype.ReadMap = function(clsName, func) {
        var sz = this._readArraySize();
        var map = {};
        for (var i = 0; sz > 0; i++) {
          var _a = this._readElement(clsName, sz), v = _a[0], read_size = _a[1];
          var k = func(v);
          map[k] = v;
          sz -= read_size;
        }
        return map;
      };
      SprotoTypeDeserialize.prototype.nod = function() {
        if (this.value < 0) {
          var sz = this._readDword();
          this.reader.seek(sz + this.reader.Position);
        }
      };
      SprotoTypeDeserialize.prototype.Size = function() {
        return this.reader.Position;
      };
      SprotoTypeDeserialize.prototype.Clear = function() {
        this.fn = 0;
        this.tag = -1;
        this.value = 0;
        this.reader && this.reader.clear();
      };
      SprotoTypeDeserialize.sizeof_uint64 = 8;
      SprotoTypeDeserialize.sizeof_uint32 = 4;
      return SprotoTypeDeserialize;
    }();
    exports.SprotoTypeDeserialize = SprotoTypeDeserialize;
    cc._RF.pop();
  }, {
    "./BitUtil": "BitUtil",
    "./SprotoConst": "SprotoConst",
    "./SprotoCore": "SprotoCore",
    "./SprotoTypeReader": "SprotoTypeReader"
  } ],
  SprotoTypeReader: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3ef9bXOSO5EyrEmQtFNLQst", "SprotoTypeReader");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SprotoTypeReader = void 0;
    var SprotoConst_1 = require("./SprotoConst");
    var SprotoTypeReader = function() {
      function SprotoTypeReader() {}
      Object.defineProperty(SprotoTypeReader.prototype, "Buffer", {
        get: function() {
          return this.buffer;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(SprotoTypeReader.prototype, "Position", {
        get: function() {
          return this.pos - this.begin;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(SprotoTypeReader.prototype, "Offset", {
        get: function() {
          return this.pos;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(SprotoTypeReader.prototype, "Length", {
        get: function() {
          return this.size - this.begin;
        },
        enumerable: false,
        configurable: true
      });
      SprotoTypeReader.prototype.init = function(buffer, offset, size) {
        this.begin = offset;
        this.pos = offset;
        this.buffer = buffer;
        this.size = offset + size;
        this.check();
      };
      SprotoTypeReader.prototype.check = function() {
        (this.pos > this.size || this.begin > this.pos) && SprotoConst_1.SprotoTypeSize.error("invalid pos.");
      };
      SprotoTypeReader.prototype.readByte = function() {
        this.check();
        return this.buffer[this.pos++];
      };
      SprotoTypeReader.prototype.seek = function(offset) {
        this.pos = this.begin + offset;
        this.check();
      };
      SprotoTypeReader.prototype.read = function(data, offset, size) {
        var cur_pos = this.pos;
        this.pos += size;
        this.check();
        for (var i = cur_pos; i < this.pos; i++) data[offset + i - cur_pos] = this.buffer[i];
      };
      SprotoTypeReader.prototype.clear = function() {
        this.pos = this.begin = 0;
        this.buffer = null;
      };
      return SprotoTypeReader;
    }();
    exports.SprotoTypeReader = SprotoTypeReader;
    cc._RF.pop();
  }, {
    "./SprotoConst": "SprotoConst"
  } ],
  SprotoTypeSerialize: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a1000bcSChBoK/44TjnGCBE", "SprotoTypeSerialize");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SprotoTypeSerialize = void 0;
    var BitUtil_1 = require("./BitUtil");
    var SprotoConst_1 = require("./SprotoConst");
    var SprotoCore_1 = require("./SprotoCore");
    var SprotoTypeSerialize = function() {
      function SprotoTypeSerialize() {
        this.m_HeaderCap = SprotoConst_1.SprotoTypeSize.SIZEOF_HEADER;
        this.m_Lasttag = -1;
        this.m_Index = 0;
        this.m_DataView = new DataView(new ArrayBuffer(8));
      }
      SprotoTypeSerialize.prototype._setHeaderFn = function(fn) {
        this.m_Data.set(this.m_HeaderIdx - 2, 255 & fn);
        this.m_Data.set(this.m_HeaderIdx - 1, fn >> 8 & 255);
      };
      SprotoTypeSerialize.prototype._writeHeaderRecord = function(record) {
        this.m_Data.set(this.m_HeaderIdx + this.m_HeaderCap - 2, 255 & record);
        this.m_Data.set(this.m_HeaderIdx + this.m_HeaderCap - 1, record >> 8 & 255);
        this.m_HeaderCap += 2;
        this.m_Index++;
      };
      SprotoTypeSerialize.prototype._writeUint32ToUint64Sign = function(is_negative) {
        var v = is_negative ? 255 : 0;
        this.m_Data.writeByte(v);
        this.m_Data.writeByte(v);
        this.m_Data.writeByte(v);
        this.m_Data.writeByte(v);
      };
      SprotoTypeSerialize.prototype._writeTag = function(tag, value) {
        var stag = tag - this.m_Lasttag - 1;
        if (stag > 0) {
          stag = 2 * (stag - 1) + 1;
          stag > 65535 && SprotoConst_1.SprotoTypeSize.error("tag is too big.");
          this._writeHeaderRecord(stag);
        }
        this._writeHeaderRecord(value);
        this.m_Lasttag = tag;
      };
      SprotoTypeSerialize.prototype._writeInt32 = function(v) {
        this.m_DataView.setInt32(0, v);
        this.m_Data.writeByte(this.m_DataView.getUint8(3));
        this.m_Data.writeByte(this.m_DataView.getUint8(2));
        this.m_Data.writeByte(this.m_DataView.getUint8(1));
        this.m_Data.writeByte(this.m_DataView.getUint8(0));
      };
      SprotoTypeSerialize.prototype._writeUint64 = function(v) {
        this.m_Data.writeByte(255 & v);
        this.m_Data.writeByte(v / Math.pow(2, 8) & 255);
        this.m_Data.writeByte(v / Math.pow(2, 16) & 255);
        this.m_Data.writeByte(v / Math.pow(2, 24) & 255);
        this.m_Data.writeByte(v / Math.pow(2, 32) & 255);
        this.m_Data.writeByte(v / Math.pow(2, 40) & 255);
        this.m_Data.writeByte(v / Math.pow(2, 48) & 255);
        this.m_Data.writeByte(v / Math.pow(2, 56) & 255);
      };
      SprotoTypeSerialize.prototype._fillSize = function(sz) {
        sz < 0 && SprotoConst_1.SprotoTypeSize.error("fill invaild size.");
        this._writeInt32(sz);
      };
      SprotoTypeSerialize.prototype._encodeInteger = function(v) {
        this._fillSize(4);
        this._writeInt32(v);
        return SprotoConst_1.SprotoTypeSize.SIZEOF_LENGTH + 4;
      };
      SprotoTypeSerialize.prototype._encodeUint64 = function(v) {
        this._fillSize(SprotoTypeSerialize.sizeof_uint64);
        this._writeUint64(v);
        return SprotoConst_1.SprotoTypeSize.SIZEOF_LENGTH + SprotoTypeSerialize.sizeof_uint64;
      };
      SprotoTypeSerialize.prototype._encodeString = function(str) {
        var sArray = BitUtil_1.BitUtil.encodeUTF8(str);
        this._fillSize(sArray.length);
        this.m_Data.write(sArray, 0, sArray.length);
        return SprotoConst_1.SprotoTypeSize.SIZEOF_LENGTH + sArray.length;
      };
      SprotoTypeSerialize.prototype._encodeStruct = function(clsName, obj) {
        var szPos = this.m_Data.Position;
        var len = SprotoCore_1.SprotoCore.encodeObj(clsName, obj, this.m_Data);
        this.m_Data.seek(SprotoConst_1.SprotoTypeSize.SIZEOF_LENGTH, SprotoConst_1.SeekOrigin.Current);
        var curPos = this.m_Data.Position;
        this.m_Data.seek(szPos, SprotoConst_1.SeekOrigin.Begin);
        this._fillSize(len);
        this.m_Data.seek(curPos, SprotoConst_1.SeekOrigin.Begin);
        return SprotoConst_1.SprotoTypeSize.SIZEOF_LENGTH + len;
      };
      SprotoTypeSerialize.prototype._clear = function() {
        this.m_Index = 0;
        this.m_HeaderIdx = 2;
        this.m_Lasttag = -1;
        this.m_Data = null;
        this.m_HeaderCap = SprotoConst_1.SprotoTypeSize.SIZEOF_HEADER;
      };
      SprotoTypeSerialize.prototype.wi = function(integer, tag) {
        this.m_DataView.setInt32(0, integer);
        var sz = this.m_DataView.getInt32(0) == integer ? SprotoTypeSerialize.sizeof_uint32 : SprotoTypeSerialize.sizeof_uint64;
        var value = 0;
        if (sz == SprotoTypeSerialize.sizeof_uint32) {
          var v = integer;
          if (0 == v || 1 == v) {
            value = 2 * (v + 1);
            sz = 2;
          } else sz = this._encodeInteger(v);
        } else if (sz == SprotoTypeSerialize.sizeof_uint64) {
          var v = integer;
          sz = this._encodeUint64(v);
        } else SprotoConst_1.SprotoTypeSize.error("invaild integer size.");
        this._writeTag(tag, value);
      };
      SprotoTypeSerialize.prototype.wia = function(integer_list, tag) {
        if (null == integer_list || integer_list.length <= 0) return;
        var sz_pos = this.m_Data.Position;
        this.m_Data.seek(sz_pos + SprotoConst_1.SprotoTypeSize.SIZEOF_LENGTH, SprotoConst_1.SeekOrigin.Begin);
        var begin_pos = this.m_Data.Position;
        var intlen = SprotoTypeSerialize.sizeof_uint32;
        this.m_Data.seek(begin_pos + 1, SprotoConst_1.SeekOrigin.Begin);
        for (var index = 0; index < integer_list.length; index++) {
          var v = integer_list[index];
          var integer = v;
          this.m_DataView.setInt32(0, integer);
          var sz = this.m_DataView.getInt32(0) == integer ? SprotoTypeSerialize.sizeof_uint32 : SprotoTypeSerialize.sizeof_uint64;
          if (sz == SprotoTypeSerialize.sizeof_uint32) {
            this._writeInt32(v);
            if (intlen == SprotoTypeSerialize.sizeof_uint64) {
              var is_negative = 0 != (2147483648 & v);
              this._writeUint32ToUint64Sign(is_negative);
            }
          } else if (sz == SprotoTypeSerialize.sizeof_uint64) {
            if (intlen == SprotoTypeSerialize.sizeof_uint32) {
              this.m_Data.seek(begin_pos + 1, SprotoConst_1.SeekOrigin.Begin);
              for (var i = 0; i < index; i++) {
                var value = integer_list[i];
                this._writeUint64(value);
              }
              intlen = SprotoTypeSerialize.sizeof_uint64;
            }
            this._writeUint64(v);
          } else SprotoConst_1.SprotoTypeSize.error("invalid integer size(" + sz + ")");
        }
        var cur_pos = this.m_Data.Position;
        this.m_Data.seek(begin_pos, SprotoConst_1.SeekOrigin.Begin);
        this.m_Data.writeByte(intlen);
        var size = cur_pos - begin_pos;
        this.m_Data.seek(sz_pos, SprotoConst_1.SeekOrigin.Begin);
        this._fillSize(size);
        this.m_Data.seek(cur_pos, SprotoConst_1.SeekOrigin.Begin);
        this._writeTag(tag, 0);
      };
      SprotoTypeSerialize.prototype.wb = function(b, tag) {
        var v = b ? 1 : 0;
        this.wi(v, tag);
      };
      SprotoTypeSerialize.prototype.wba = function(b_list, tag) {
        if (null == b_list || b_list.length <= 0) return;
        this._fillSize(b_list.length);
        for (var i = 0; i < b_list.length; i++) {
          var v = b_list[i] ? 1 : 0;
          this.m_Data.writeByte(v);
        }
        this._writeTag(tag, 0);
      };
      SprotoTypeSerialize.prototype.ws = function(str, tag) {
        this._encodeString(str);
        this._writeTag(tag, 0);
      };
      SprotoTypeSerialize.prototype.wsa = function(str_list, tag) {
        if (null == str_list || str_list.length <= 0) return;
        var sz = 0;
        for (var v in str_list) sz += SprotoConst_1.SprotoTypeSize.SIZEOF_LENGTH + BitUtil_1.BitUtil.UTF8ByteCount(v);
        this._fillSize(sz);
        for (var v in str_list) this._encodeString(v);
        this._writeTag(tag, 0);
      };
      SprotoTypeSerialize.prototype.wo = function(clsName, obj, tag) {
        this._encodeStruct(clsName, obj);
        this._writeTag(tag, 0);
      };
      SprotoTypeSerialize.prototype.writeSet = function(func, tag) {
        var sz_pos = this.m_Data.Position;
        this.m_Data.seek(SprotoConst_1.SprotoTypeSize.SIZEOF_LENGTH, SprotoConst_1.SeekOrigin.Current);
        func();
        var cur_pos = this.m_Data.Position;
        var sz = cur_pos - sz_pos - SprotoConst_1.SprotoTypeSize.SIZEOF_LENGTH;
        this.m_Data.seek(sz_pos, SprotoConst_1.SeekOrigin.Begin);
        this._fillSize(sz);
        this.m_Data.seek(cur_pos, SprotoConst_1.SeekOrigin.Begin);
        this._writeTag(tag, 0);
      };
      SprotoTypeSerialize.prototype.woa = function(clsName, obj_list, tag) {
        var _this = this;
        if (null == obj_list || obj_list.length <= 0) return;
        var func = function() {
          for (var _i = 0, obj_list_1 = obj_list; _i < obj_list_1.length; _i++) {
            var v = obj_list_1[_i];
            _this._encodeStruct(clsName, v);
          }
        };
        this.writeSet(func, tag);
      };
      SprotoTypeSerialize.prototype.wod = function(clsName, map, tag) {
        var _this = this;
        if (null == map || map.length <= 0) return;
        var func = function() {
          for (var _i = 0, map_1 = map; _i < map_1.length; _i++) {
            var pair = map_1[_i];
            _this._encodeStruct(clsName, map[pair]);
          }
        };
        this.writeSet(func, tag);
      };
      SprotoTypeSerialize.prototype.open = function(stream, max_field_count) {
        this._clear();
        this.m_HeaderSz = SprotoConst_1.SprotoTypeSize.SIZEOF_HEADER + max_field_count * SprotoConst_1.SprotoTypeSize.SIZEOF_FIELD;
        this.m_Data = stream;
        this.m_HeaderIdx = stream.Position + this.m_HeaderCap;
        this.m_DataIdx = this.m_Data.seek(this.m_HeaderSz, SprotoConst_1.SeekOrigin.Current);
      };
      SprotoTypeSerialize.prototype.close = function() {
        this._setHeaderFn(this.m_Index);
        var up_count = this.m_HeaderSz - this.m_HeaderCap;
        this.m_Data.moveUp(this.m_DataIdx, up_count);
        var count = this.m_Data.Position - this.m_HeaderIdx + SprotoConst_1.SprotoTypeSize.SIZEOF_HEADER;
        this._clear();
        return count;
      };
      SprotoTypeSerialize.sizeof_uint64 = 8;
      SprotoTypeSerialize.sizeof_uint32 = 4;
      return SprotoTypeSerialize;
    }();
    exports.SprotoTypeSerialize = SprotoTypeSerialize;
    cc._RF.pop();
  }, {
    "./BitUtil": "BitUtil",
    "./SprotoConst": "SprotoConst",
    "./SprotoCore": "SprotoCore"
  } ],
  Sproto: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "96fa59XoIxGqYMKZ0meYb9W", "Sproto");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Sproto = void 0;
    var SprotoConst_1 = require("./SprotoConst");
    var SprotoCore_1 = require("./SprotoCore");
    var SprotoReceiver_1 = require("./SprotoReceiver");
    var SprotoSender_1 = require("./SprotoSender");
    var Sproto;
    (function(Sproto) {
      function init() {
        SprotoCore_1.SprotoCore.init();
        SprotoSender_1.SprotoSender.init();
        SprotoReceiver_1.SprotoReceiver.init();
      }
      Sproto.init = init;
      function setC2sProtocol(cmd, reqName, rspName) {
        SprotoConst_1.SprotoConst.C2S_PROTOCOL.set(cmd, reqName, rspName);
      }
      Sproto.setC2sProtocol = setC2sProtocol;
      function setS2cProtocol(cmd, reqName, rspName) {
        SprotoConst_1.SprotoConst.S2C_PROTOCOL.set(cmd, reqName, rspName);
      }
      Sproto.setS2cProtocol = setS2cProtocol;
      function setTransCodeDict(data) {
        for (var key in data) SprotoConst_1.SprotoConst.TRANSCODE_DICT[key] = data[key];
      }
      Sproto.setTransCodeDict = setTransCodeDict;
      function setTransCodeDict1(key, data) {
        SprotoConst_1.SprotoConst.TRANSCODE_DICT[key] = data;
      }
      Sproto.setTransCodeDict1 = setTransCodeDict1;
      function pack(cmd, data, rpcHandler, thisObj) {
        void 0 === thisObj && (thisObj = null);
        var bytes = SprotoSender_1.SprotoSender.pack(cmd, data, rpcHandler, thisObj);
        return bytes;
      }
      Sproto.pack = pack;
      function dispatch(byte) {
        var bytes = SprotoCore_1.SprotoCore.dispatch(byte);
        return bytes;
      }
      Sproto.dispatch = dispatch;
      function addHandler(cmd, rpcHandler, thisObj) {
        void 0 === thisObj && (thisObj = null);
        SprotoReceiver_1.SprotoReceiver.addHandler(cmd, rpcHandler, thisObj);
      }
      Sproto.addHandler = addHandler;
      function addHandlers(cmd, rpcHandler, thisObj) {
        void 0 === thisObj && (thisObj = null);
        SprotoReceiver_1.SprotoReceiver.addHandlers(cmd, rpcHandler, thisObj);
      }
      Sproto.addHandlers = addHandlers;
      function removeHandler(cmd) {
        SprotoReceiver_1.SprotoReceiver.removeHandler(cmd);
      }
      Sproto.removeHandler = removeHandler;
    })(Sproto = exports.Sproto || (exports.Sproto = {}));
    cc._RF.pop();
  }, {
    "./SprotoConst": "SprotoConst",
    "./SprotoCore": "SprotoCore",
    "./SprotoReceiver": "SprotoReceiver",
    "./SprotoSender": "SprotoSender"
  } ],
  SynthesisAdvanceView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1e972wdJDlIrJd5lGXaqu11", "SynthesisAdvanceView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const BaseWindows_1 = require("../../../framework/base/BaseWindows");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const HallHttpConst_1 = require("../../const/HallHttpConst");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let SynthesisAdvanceView = class SynthesisAdvanceView extends BaseWindows_1.BaseWindows {
      constructor() {
        super(...arguments);
        this.isClickRect = true;
      }
      initUI(...args) {
        super.initUI(...args);
        this.data = args[0];
        this.initSelfUI();
      }
      initSelfUI() {
        let name = this.data && this.data.name ? this.data.name : "";
        let grade = this.data && this.data.grade ? this.data.grade : 0;
        let dividend = this.data && this.data.dividend ? this.data.dividend : 0;
        let ownNorCount = this.data && this.data.own && this.data.own.normal ? this.data.own.normal : 0;
        let ownAdvCount = this.data && this.data.own && this.data.own.advanced ? this.data.own.advanced : 0;
        let upgradeNorCount = this.data && this.data.normalUpgrade && this.data.normalUpgrade.normal ? this.data.normalUpgrade.normal : 0;
        let probability = 100;
        let upgradeAdvCount = this.data && this.data.normalUpgrade && this.data.normalUpgrade.advanced ? this.data.normalUpgrade.advanced : 0;
        let gradeStr = GameGlobal_1.GameGlobal.Lang.t("Turtle.Grade");
        gradeStr = gradeStr.replace("{0}", grade);
        this.txtTurtle.string = gradeStr + name;
        let perStr = GameGlobal_1.GameGlobal.Lang.t("Turtle.Per");
        perStr = perStr.replace("{0}", probability + "");
        this.txtProbability.string = perStr;
        this.txtBabyName.string = "baby turtle";
        this.txtBabyCount.string = upgradeNorCount + "";
        this.txtCard.string = "sythelic card";
        this.txtCardCount.string = upgradeAdvCount + "";
      }
      onSynthResp(data) {
        let bSucess = false;
        if (data && 200 == data.code) {
          data = data.data;
          data.stateComposition && (bSucess = true);
        }
        if (bSucess) {
          GameGlobal_1.GameGlobal.TipManager.showTip("Synth Sucess");
          GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.SYNTH_ADVANCE_VIEW);
        } else GameGlobal_1.GameGlobal.TipManager.showTip("Synth Error");
      }
      onBtnClick(event, customEventData) {
        0 == customEventData ? GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.SYNTH_ADVANCE_VIEW) : 1 == customEventData && GameGlobal_1.GameGlobal.Http.post(HallHttpConst_1.default.PostUpgradeTurtle, {
          type: 1
        }, this.onSynthResp, this);
      }
      onEnterBegin(event, customEventData) {}
    };
    SynthesisAdvanceView.TAG = "SynthesisAdvanceView";
    __decorate([ property(cc.Sprite) ], SynthesisAdvanceView.prototype, "sTurtle", void 0);
    __decorate([ property(cc.Label) ], SynthesisAdvanceView.prototype, "txtTurtle", void 0);
    __decorate([ property(cc.Label) ], SynthesisAdvanceView.prototype, "txtProbability", void 0);
    __decorate([ property(cc.Sprite) ], SynthesisAdvanceView.prototype, "sBaby", void 0);
    __decorate([ property(cc.Label) ], SynthesisAdvanceView.prototype, "txtBabyName", void 0);
    __decorate([ property(cc.Label) ], SynthesisAdvanceView.prototype, "txtBabyCount", void 0);
    __decorate([ property(cc.Sprite) ], SynthesisAdvanceView.prototype, "sCard", void 0);
    __decorate([ property(cc.Label) ], SynthesisAdvanceView.prototype, "txtCard", void 0);
    __decorate([ property(cc.Label) ], SynthesisAdvanceView.prototype, "txtCardCount", void 0);
    SynthesisAdvanceView = __decorate([ ccclass ], SynthesisAdvanceView);
    exports.default = SynthesisAdvanceView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../const/HallHttpConst": "HallHttpConst"
  } ],
  SynthesisGeneralView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "879d3xf88ZBq4EVHFQrDGUF", "SynthesisGeneralView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const BaseWindows_1 = require("../../../framework/base/BaseWindows");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const HallHttpConst_1 = require("../../const/HallHttpConst");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let SynthesisGeneralView = class SynthesisGeneralView extends BaseWindows_1.BaseWindows {
      constructor() {
        super(...arguments);
        this.isClickRect = true;
      }
      initUI(...args) {
        super.initUI(...args);
        this.data = args[0];
        this.initSelfUI();
      }
      initSelfUI() {
        let name = this.data && this.data.name ? this.data.name : "";
        let grade = this.data && this.data.grade ? this.data.grade : 0;
        let dividend = this.data && this.data.dividend ? this.data.dividend : 0;
        let ownNorCount = this.data && this.data.own && this.data.own.normal ? this.data.own.normal : 0;
        let ownAdvCount = this.data && this.data.own && this.data.own.advanced ? this.data.own.advanced : 0;
        let upgradeNorCount = this.data && this.data.normalUpgrade && this.data.normalUpgrade.normal ? this.data.normalUpgrade.normal : 0;
        let probability = this.data && this.data.normalUpgrade && this.data.normalUpgrade.probability ? this.data.normalUpgrade.probability : 0;
        let upgradeAdvCount = this.data && this.data.normalUpgrade && this.data.normalUpgrade.advanced ? this.data.normalUpgrade.advanced : 0;
        let gradeStr = GameGlobal_1.GameGlobal.Lang.t("Turtle.Grade");
        gradeStr = gradeStr.replace("{0}", grade);
        this.txtTurtle.string = gradeStr + name;
        let perStr = GameGlobal_1.GameGlobal.Lang.t("Turtle.Per");
        perStr = perStr.replace("{0}", probability);
        this.txtProbability.string = perStr;
        this.txtBabyName.string = "baby turtle";
        this.txtBabyCount.string = upgradeNorCount + "";
      }
      onSynthResp(data) {
        let bSucess = false;
        if (data && 200 == data.code) {
          data = data.data;
          data.stateComposition && (bSucess = true);
        }
        if (bSucess) {
          GameGlobal_1.GameGlobal.TipManager.showTip("Synth Sucess");
          GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.SYNTH_GENERAL_VIEW);
        } else GameGlobal_1.GameGlobal.TipManager.showTip("Synth Error");
      }
      onBtnClick(event, customEventData) {
        0 == customEventData ? GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.SYNTH_GENERAL_VIEW) : 1 == customEventData && GameGlobal_1.GameGlobal.Http.post(HallHttpConst_1.default.PostUpgradeTurtle, {
          type: 0
        }, this.onSynthResp, this);
      }
      onEnterBegin(event, customEventData) {}
    };
    SynthesisGeneralView.TAG = "SynthesisGeneralView";
    __decorate([ property(cc.Sprite) ], SynthesisGeneralView.prototype, "sTurtle", void 0);
    __decorate([ property(cc.Label) ], SynthesisGeneralView.prototype, "txtTurtle", void 0);
    __decorate([ property(cc.Label) ], SynthesisGeneralView.prototype, "txtProbability", void 0);
    __decorate([ property(cc.Sprite) ], SynthesisGeneralView.prototype, "sBaby", void 0);
    __decorate([ property(cc.Label) ], SynthesisGeneralView.prototype, "txtBabyName", void 0);
    __decorate([ property(cc.Label) ], SynthesisGeneralView.prototype, "txtBabyCount", void 0);
    SynthesisGeneralView = __decorate([ ccclass ], SynthesisGeneralView);
    exports.default = SynthesisGeneralView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../const/HallHttpConst": "HallHttpConst"
  } ],
  SystemConst: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "10119EIVapFNpgn3oNmNhJj", "SystemConst");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SystemConst = void 0;
    var SystemConst = function() {
      function SystemConst() {}
      SystemConst.SystemType = {
        Login: 0,
        Loading: 1,
        Hall: 2,
        Game: 3
      };
      return SystemConst;
    }();
    exports.SystemConst = SystemConst;
    cc._RF.pop();
  }, {} ],
  SystemManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "39bb9TN34tL2rSOcW8YASBY", "SystemManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SystemManager = void 0;
    var Singleton_1 = require("../base/Singleton");
    var SystemManager = function(_super) {
      __extends(SystemManager, _super);
      function SystemManager() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      SystemManager.getInstance = function() {
        return _super.getInstance.call(this);
      };
      SystemManager.prototype.init = function() {
        this._ctrlObjDict = {};
        this._ctrlClassDict = {};
        this.isLoadSubPack = false;
      };
      SystemManager.prototype.register = function(sysType, sysClass, newClass) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) args[_i - 3] = arguments[_i];
        sysType = "" + sysType;
        this._ctrlClassDict[sysType] = sysClass;
        newClass && this.initCtrl.apply(this, __spreadArrays([ sysType ], args));
      };
      SystemManager.prototype.unregister = function(sysType) {
        sysType = "" + sysType;
        this._ctrlClassDict[sysType] && delete this._ctrlClassDict[sysType];
      };
      SystemManager.prototype.initCtrl = function(sysType) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) args[_i - 1] = arguments[_i];
        sysType = "" + sysType;
        var ctrlClass = this._ctrlClassDict[sysType];
        if (ctrlClass) {
          var ctrl = new ctrlClass();
          ctrl.init.apply(ctrl, args);
          this._ctrlObjDict[sysType] = ctrl;
          return ctrl;
        }
      };
      SystemManager.prototype.getCtrl = function(sysType) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) args[_i - 1] = arguments[_i];
        sysType = "" + sysType;
        var ctrl = this._ctrlObjDict[sysType];
        ctrl || (ctrl = this.initCtrl.apply(this, __spreadArrays([ sysType ], args)));
        return ctrl;
      };
      SystemManager.prototype.getModel = function(sysType) {
        var ctrl = this.getCtrl(sysType);
        if (ctrl) {
          var model = ctrl.model;
          return model;
        }
      };
      SystemManager.prototype.LoadSubPackSuccess = function() {};
      SystemManager.prototype.loadDataSucc = function() {
        this.isLoadData = true;
        this.enterGame();
      };
      SystemManager.prototype.enterGame = function(e) {};
      return SystemManager;
    }(Singleton_1.Singleton);
    exports.SystemManager = SystemManager;
    cc._RF.pop();
  }, {
    "../base/Singleton": "Singleton"
  } ],
  TextUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "32b95p1ZZ1G76bonk9eZWK+", "TextUtil");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.TextUtil = void 0;
    var TextUtil = function() {
      function TextUtil() {}
      TextUtil.formatString = function(text) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) params[_i - 1] = arguments[_i];
        if (text && params.length > 0) for (var i = 0; i < params.length; i++) text = text.replace("[" + (i + 1) + "]", params[i]);
        return text;
      };
      TextUtil.isChinese = function(text) {
        var re = /[^\u4e00-\u9fa5]/;
        if (re.test(text)) return false;
        return true;
      };
      TextUtil.changetoRichText = function(originalString, color, outlineColor, outlineWidth) {
        var result = "<color=" + color + ">" + originalString + "</color>";
        outlineColor && (result = "<outline color=" + outlineColor + "width=" + (outlineWidth || 1) + ">" + result + "</outline>");
        return result;
      };
      TextUtil.isEmpty = function(text) {
        return null == text || "" == text;
      };
      return TextUtil;
    }();
    exports.TextUtil = TextUtil;
    cc._RF.pop();
  }, {} ],
  TimeUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7c026ilLmZHxK35G0QocLwS", "TimeUtil");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.TimeUtil = void 0;
    var TimeUtil = function() {
      function TimeUtil() {}
      TimeUtil.getTime = function() {};
      return TimeUtil;
    }();
    exports.TimeUtil = TimeUtil;
    cc._RF.pop();
  }, {} ],
  TimerHandler: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "442d36jN2hFgJiVjWXImqRZ", "TimerHandler");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.TimerHandler = void 0;
    var TimerHandler = function() {
      function TimerHandler() {
        this.key = 0;
        this.repeat = false;
        this.delay = 0;
        this.userFrame = false;
        this.exeTime = 0;
        this.caller = null;
        this.method = null;
        this.args = null;
        this.jumpFrame = false;
      }
      TimerHandler.prototype.clear = function() {
        this.caller = null;
        this.method = null;
        this.args = null;
      };
      TimerHandler.prototype.run = function(e) {
        var t = this.caller;
        if (t && t.destroyed) return this.clear();
        var i = this.method, n = this.args;
        e && this.clear(), null != i && (n ? i.apply(t, n) : i.call(t));
      };
      return TimerHandler;
    }();
    exports.TimerHandler = TimerHandler;
    cc._RF.pop();
  }, {} ],
  TimerManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "84976O2ekZAoL/Llv/lUWfg", "TimerManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.TimerManager = void 0;
    var Singleton_1 = require("../base/Singleton");
    var GameGlobal_1 = require("../GameGlobal");
    var LogUtil_1 = require("../utils/LogUtil");
    var TimerManager = function(_super) {
      __extends(TimerManager, _super);
      function TimerManager() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      TimerManager.getInstance = function() {
        return _super.getInstance.call(this);
      };
      TimerManager.prototype.init = function() {
        this.clear();
      };
      TimerManager.prototype.clear = function() {
        this._timerList = [];
        this._tickIndex = null;
      };
      TimerManager.prototype.update = function(dt) {
        if (!this._timerList) return false;
        var curTimer;
        var flag = false;
        for (var i = 0; i < this._timerList.length; i++) {
          curTimer = this._timerList[i];
          curTimer._tik = (curTimer._tik || 0) + 1e3 * dt;
          if (curTimer._rmv) flag = true; else if (curTimer.real) {
            for (var B = curTimer.delay; this.callTimerFunc(curTimer, B); ) if (curTimer._rmv) {
              flag = true;
              break;
            }
          } else {
            B = curTimer._tik;
            this.callTimerFunc(curTimer, B) && curTimer._rmv && (flag = true);
          }
        }
        if (flag) for (var j = this._timerList.length - 1; j >= 0; j--) {
          curTimer = this._timerList[j];
          if (curTimer._rmv) {
            curTimer.clear();
            this._timerList.splice(j, 1);
          }
        }
        return false;
      };
      TimerManager.prototype.callTimerFunc = function(timer, deltaTime) {
        if (timer._tik >= timer.delay) {
          timer._tik -= deltaTime;
          timer.func.call(timer.obj, timer.data, deltaTime);
          if (timer.times >= 0) {
            timer._cnt = (timer._cnt || 0) + 1;
            timer._cnt >= timer.times && (timer._rmv = true);
          }
          return true;
        }
        return false;
      };
      TimerManager.prototype.callLater = function(obj, func, data) {
        return this.once(func, obj, 0, data);
      };
      TimerManager.prototype.on = function(func, obj, delay, times, data, real) {
        void 0 === times && (times = -1), this.off(func, obj), this._tickIndex = (this._tickIndex || 0) + 1;
        var timer = GameGlobal_1.GameGlobal.Pool.pop(TimerData, "TimerData");
        timer.init(func, obj, delay, times, data, this._tickIndex, real);
        this._timerList.push(timer);
        return this._tickIndex;
      };
      TimerManager.prototype.once = function(func, obj, delay, data) {
        return this.on(func, obj, delay, 1, data);
      };
      TimerManager.prototype.off = function(func, obj) {
        for (var i = 0; i < this._timerList.length; i++) {
          var timer = this._timerList[i];
          timer.func == func && timer.obj == obj && (timer._rmv = true);
        }
      };
      TimerManager.prototype.offAllCall = function(obj) {
        for (var i = 0; i < this._timerList.length; i++) {
          var timer = this._timerList[i];
          timer.obj == obj && (timer._rmv = !0);
          timer.obj == obj && LogUtil_1.LogUtil.info("TimerManager", "off all " + obj.name);
        }
      };
      TimerManager.prototype.offIndex = function(index) {
        for (var i = 0; i < this._timerList.length; i++) {
          var timer = this._timerList[i];
          timer._idx == index && (timer._rmv = true);
        }
      };
      TimerManager._gid = 0;
      TimerManager._mid = 0;
      return TimerManager;
    }(Singleton_1.Singleton);
    exports.TimerManager = TimerManager;
    var TimerData = function() {
      function TimerData() {
        this.clear = function() {
          this.delay = 0, this.times = 0, this.func = null, this.obj = null, this.data = null, 
          GameGlobal_1.GameGlobal.Pool.push(this, "TimerData");
        };
      }
      TimerData.prototype.init = function(func, obj, delay, times, data, index, real) {
        this.func = func, this.obj = obj, this.delay = delay, this.times = times, this.data = data, 
        this.real = real, this._idx = index, this._tik = 0, this._cnt = 0, this._rmv = false;
      };
      return TimerData;
    }();
    cc._RF.pop();
  }, {
    "../GameGlobal": "GameGlobal",
    "../base/Singleton": "Singleton",
    "../utils/LogUtil": "LogUtil"
  } ],
  TipManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2b7bbnee49FzKoYB7lYPBF6", "TipManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.TipManager = void 0;
    var GameGlobal_1 = require("../GameGlobal");
    var TextUtil_1 = require("../utils/TextUtil");
    var LogUtil_1 = require("../utils/LogUtil");
    var Singleton_1 = require("../base/Singleton");
    var i18n = require("LanguageData");
    var TipManager = function(_super) {
      __extends(TipManager, _super);
      function TipManager() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._messageVos = [];
        return _this;
      }
      TipManager.getInstance = function() {
        return _super.getInstance.call(this);
      };
      TipManager.prototype.init = function() {
        this._items = [];
        this._itemContainer = null;
        this._lastTime = null;
        this._frameCount = 0;
        this._maxItemTipCnt = 5;
        this._needNewItemGroup = false;
        this._tips = [];
        this._tipContainer = null;
        this._tipLastTime = null;
        this._tipFrameCount = 0;
        this._maxTipCnt = 3;
        this._needNewTipGroup = false;
        var thiz = this;
        GameGlobal_1.GameGlobal.Resource.loadRes("prefabs/Tips", cc.Prefab, null, function(error, asset) {
          null == error ? thiz.tipPrefab = asset : LogUtil_1.LogUtil.error("\u52a0\u8f7d\u9884\u8bbe\u5931\u8d25:" + error);
        });
        GameGlobal_1.GameGlobal.Resource.loadRes("prefabs/Toast", cc.Prefab, null, function(error, asset) {
          null == error ? thiz.messagePrefab = asset : LogUtil_1.LogUtil.error("\u52a0\u8f7d\u9884\u8bbe\u5931\u8d25:" + error);
        });
        thiz.initLayer();
        this._isInitNotice = false;
        this._notices = [];
      };
      TipManager.prototype.initLayer = function() {
        this._tipsLayer = GameGlobal_1.GameGlobal.gameRoot.getChildByName("tipLayer");
      };
      TipManager.prototype.update = function() {
        this.updateContentTip();
        this.updateItemTip();
      };
      TipManager.prototype.updateContentTip = function() {
        if (!this._tipLastTime || !this.tipPrefab) return;
        this._tipContainer || this.initTipUI();
        var childNum = this._tipContainer.children.length;
        this._tipFrameCount++;
        if (this._tipFrameCount % 4 == 0 && this._tips.length > 0) {
          var child = this._tipContainer.children[childNum - 1];
          if (child.children.length > this._maxTipCnt) {
            var childNode = child.children[0];
            child.removeChild(childNode);
            GameGlobal_1.GameGlobal.Pool.putNode(childNode);
          }
          var tipNode = GameGlobal_1.GameGlobal.Pool.getNode(this.tipPrefab, child);
          var data = this._tips.shift();
          tipNode.getChildByName("tipsLab").getComponent(cc.Label).string = data;
          this._tipFrameCount = 0;
        }
        !this._needNewTipGroup && this._tipFrameCount >= 16 && (this._needNewTipGroup = true);
        childNum = this._needNewTipGroup ? childNum : childNum - 1;
        var now = Date.now();
        var dt = (now - this._tipLastTime) / 1500;
        this._tipLastTime = now;
        var bottomMax = 460;
        for (var i = 0; i < childNum; i++) {
          var child = this._tipContainer.children[i];
          child.setPosition(new cc.Vec3(0, child.position.y + 200 * dt | 0, 0));
          child.opacity -= 255 * dt;
          if (child.position.y >= bottomMax || child.opacity <= 0) {
            for (var j = 0; j < child.children.length; j++) {
              var childNode = child.children[j];
              child.removeChild(childNode);
              GameGlobal_1.GameGlobal.Pool.putNode(childNode);
            }
            child.destroy();
            childNum--;
            i--;
          }
        }
        0 == this._tipContainer.children.length && (this._tipLastTime = null);
      };
      TipManager.prototype.showInfo = function(tip, color) {
        this._tips || (this._tips = []);
        var info = tip;
        this._tips.push(info);
        this._tips.length > 10 && (this._tips = this._tips.splice(this._tips.length - 10));
        this._tipContainer || this.initTipUI();
        if (!this._tipLastTime) {
          this._tipLastTime = Date.now();
          this._tipFrameCount = 0;
          this._needNewTipGroup = true;
        }
        if (this._needNewTipGroup) {
          var group = new cc.Node("tipGrp");
          var layout = group.addComponent(cc.Layout);
          layout.type = cc.Layout.Type.VERTICAL;
          layout.spacingY = 4;
          this._tipContainer.addChild(group);
          this._needNewTipGroup = false;
          this._tipFrameCount %= 4;
        }
      };
      TipManager.prototype.initTipUI = function() {
        this._tipContainer = new cc.Node("tipContainer");
        this._tipContainer.width = 1280;
        this._tipContainer.height = 720;
        this._tipsLayer && this._tipsLayer.isValid || this.initLayer();
        this._tipsLayer.addChild(this._tipContainer);
        this._maxTipCnt = 3;
        this._needNewTipGroup = true;
      };
      TipManager.prototype.showTip = function(text, colorValue) {
        void 0 === colorValue && (colorValue = "#ffffff");
        this._tipsLayer && this._tipsLayer.isValid || this.initLayer();
        this.showInfo(text, colorValue);
      };
      TipManager.prototype.showTipEx = function(id, colorValue) {
        void 0 === colorValue && (colorValue = "#ffffff");
        var str = i18n.t(id);
        TextUtil_1.TextUtil.isEmpty(str) && (str = id);
        this.showTip(str, colorValue);
      };
      TipManager.prototype.showErrorTip = function(text, colorValue) {
        void 0 === colorValue && (colorValue = "#ff0000");
        this._tipsLayer && this._tipsLayer.isValid || this.initLayer();
        this.showInfo(text, colorValue);
      };
      TipManager.prototype.showLanguage = function(constKey) {
        this.showTip(GameGlobal_1.GameGlobal.Language.getStr(constKey));
      };
      TipManager.prototype.showErrorLanguage = function(constKey) {
        this.showErrorTip(GameGlobal_1.GameGlobal.Language.getStr(constKey));
      };
      TipManager.prototype.showConfigLanguage = function(id) {};
      TipManager.prototype.ShowErrorConfigLanguage = function(id) {};
      TipManager.prototype.showSystemOpenTip = function(systemId, color) {};
      TipManager.prototype.message = function(id, isId) {
        var _this = this;
        void 0 === isId && (isId = true);
        var toastH = 80;
        var nodeName = "message";
        var layer = this._tipsLayer;
        var tmpNode = layer.getChildByName(nodeName);
        if (null == tmpNode) {
          var prefab = this.messagePrefab;
          if (prefab) {
            var node = cc.instantiate(prefab);
            node.name = nodeName;
            layer.addChild(node);
            var width = cc.winSize.width;
            var heigth = cc.winSize.height;
            if (isId) {
              var i18nLabel = node.getComponentInChildren("LocalizedLabel");
              i18nLabel.Key = id;
            } else {
              var label = node.getComponentInChildren(cc.Label);
              label.string = id;
            }
            node.setPosition(new cc.Vec3(0, -heigth / 2 - toastH / 2, 0));
            cc.tween(node).to(.3, {
              position: new cc.Vec3(0, -heigth / 2 + toastH / 2, 0)
            }).delay(2).to(.2, {
              position: new cc.Vec3(0, -heigth / 2 - toastH / 2, 0)
            }).removeSelf().call(function() {
              if (_this._messageVos.length > 0) {
                var vo = _this._messageVos.shift();
                _this.message(vo.label, vo.isId);
              }
            }).start();
          }
        } else {
          var vo = new MessageVo();
          vo.label = id;
          vo.isId = isId;
          this._messageVos.push(vo);
        }
      };
      TipManager.prototype.showGetItemTip = function(propId, num, isHero) {};
      TipManager.prototype.initItemTipUI = function() {
        this._itemContainer = new cc.Node("itemContainer");
        this._itemContainer.width = 720;
        this._itemContainer.height = 1280;
        this._tipsLayer && this._tipsLayer.isValid || this.initLayer();
        this._tipsLayer.addChild(this._itemContainer);
        this._maxItemTipCnt = (4 + (this._itemContainer.height >> 1)) / 40 | 0;
        this._needNewItemGroup = true;
      };
      TipManager.prototype.showGetItemTipText = function(info) {
        this._items || (this._items = []);
        this._items.push(info);
        this._items.length > 10 && (this._items = this._items.slice(this._items.length - 10));
        this._itemContainer || this.initItemTipUI();
        if (!this._lastTime) {
          this._lastTime = Date.now();
          this._frameCount = 0;
          this._needNewItemGroup = true;
        }
        if (this._needNewItemGroup) {
          var group = new cc.Node("itemGrp");
          this._itemContainer.addChild(group);
          var layout = group.addComponent(cc.Layout);
          layout.type = cc.Layout.Type.VERTICAL;
          layout.spacingY = 4;
          group.setPosition(new cc.Vec3(0, 300, 0));
          this._needNewItemGroup = false;
          this._frameCount %= 4;
        }
      };
      TipManager.prototype.updateItemTip = function() {
        if (!this._lastTime || !this.tipPrefab) return;
        var childNum = this._itemContainer.children.length;
        this._frameCount++;
        if (this._frameCount % 4 == 0 && this._items.length > 0) {
          var child = this._itemContainer.children[childNum - 1];
          if (child.children.length > this._maxItemTipCnt) {
            var childNode = child.children[0];
            child.removeChild(childNode);
            GameGlobal_1.GameGlobal.Pool.putNode(childNode);
          }
          var tipNode = GameGlobal_1.GameGlobal.Pool.getNode(this.tipPrefab, child);
          var data = this._items.shift();
          tipNode.getChildByName("tipsLab").getComponent(cc.Label).string = data;
          this._frameCount = 0;
        }
        !this._needNewItemGroup && this._frameCount >= 16 && (this._needNewItemGroup = true);
        childNum = this._needNewItemGroup ? childNum : childNum - 1;
        var now = Date.now();
        var dt = (now - this._lastTime) / 1e3;
        this._lastTime = now;
        var bottomMax = cc.winSize.height / 2 + cc.winSize.height / 4 | 0;
        for (var i = 0; i < childNum; i++) {
          var child = this._itemContainer.children[i];
          child.setPosition(new cc.Vec3(0, child.position.y + 200 * dt | 0, 0));
          child.opacity -= 255 * dt;
          if (child.position.y >= bottomMax || child.opacity <= 0) {
            for (var j = 0; j < child.children.length; j++) {
              var childNode = child.children[j];
              child.removeChild(childNode);
              GameGlobal_1.GameGlobal.Pool.putNode(childNode);
            }
            child.destroy();
            childNum--;
            i--;
          }
        }
        0 == this._itemContainer.children.length && (this._lastTime = null);
      };
      TipManager.prototype.initNotice = function() {
        var _this = this;
        var thiz = this;
        thiz._isInitNotice = true;
        GameGlobal_1.GameGlobal.Resource.loadRes("prefab/NoticeItem", cc.Prefab, null, function(err, prefab) {
          if (!err) {
            thiz._noticeObj = cc.instantiate(prefab);
            thiz._tipsLayer.addChild(_this._noticeObj);
            thiz._noticeLab = thiz._noticeObj.getChildByName("Label").getComponent(cc.RichText);
            thiz._isInitNotice = false;
            thiz.showNoticeText1();
          }
        });
      };
      TipManager.prototype.showNotice = function(notice, id, isSpecial) {
        if (!notice || notice.length <= 0) return;
        void 0 === isSpecial && (isSpecial = false);
        this._tipsLayer && this._tipsLayer.isValid || this.initLayer();
        var module = isSpecial ? 2 : 0;
        this._notices.push({
          text: TextUtil_1.TextUtil.changetoRichText(notice, "#ffffff"),
          module: module
        });
        var max = 10;
        while (this._notices.length > max) this._notices.shift();
        this.showNoticeText();
      };
      TipManager.prototype.showNoticeText = function() {
        if (this._notices.length <= 0) return;
        this._noticeObj && this._noticeObj.isValid ? this.showNoticeText1() : this.initNotice();
      };
      TipManager.prototype.showNoticeText1 = function() {
        var noticeInfo = this._notices.shift();
        this._noticeLab.string = noticeInfo && noticeInfo.text;
        this._noticeLab["_updateRichText"]();
        this._noticeLab.node.setPosition(0, 4.5, 0);
        this._noticeObj.active = true;
        var totalLength = this._noticeLab.node.width;
        var speed = 100;
        var useTime = totalLength / speed;
        var thiz = this;
        cc.tween(this._noticeLab.node).to(useTime, {
          position: new cc.Vec3(-totalLength - cc.winSize.width / 2, 4.5, 0)
        }).call(function() {
          thiz._noticeObj.active = false;
          cc.Tween.stopAllByTarget(thiz._noticeLab.node);
          thiz.showNoticeText();
        }).start();
      };
      TipManager.prototype.showChargeNotice = function(notice) {};
      return TipManager;
    }(Singleton_1.Singleton);
    exports.TipManager = TipManager;
    var MessageVo = function() {
      function MessageVo() {}
      return MessageVo;
    }();
    cc._RF.pop();
  }, {
    "../GameGlobal": "GameGlobal",
    "../base/Singleton": "Singleton",
    "../utils/LogUtil": "LogUtil",
    "../utils/TextUtil": "TextUtil",
    LanguageData: "LanguageData"
  } ],
  UIUtil: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4d7142kOCNNLK7VfE/hjPVe", "UIUtil");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.UIUtil = void 0;
    var ResConst_1 = require("../const/ResConst");
    var GameGlobal_1 = require("../GameGlobal");
    var UIUtil = function() {
      function UIUtil() {}
      UIUtil.onClickListener = function(node, clickFunc, target) {
        node && node.on(cc.Node.EventType.MOUSE_DOWN, clickFunc, target);
      };
      UIUtil.offClicklistener = function(node, clickFunc, target) {
        node && node.off(cc.Node.EventType.MOUSE_DOWN, clickFunc, target);
      };
      UIUtil.addClickListener = function(uiNode, callFunc, callObj, soundType) {
        uiNode && uiNode.on("click", callFunc, callObj);
      };
      UIUtil.removeClickListener = function(uiNode, callFunc, callObj) {
        uiNode && uiNode.isValid && uiNode.off("click", callFunc, callObj);
      };
      UIUtil.addToggleListener = function(uiNode, callFunc, callObj) {
        uiNode && uiNode.on("toggle", callFunc, callObj);
      };
      UIUtil.removeToggleListener = function(uiNode, callFunc, callObj) {
        uiNode && uiNode.off("toggle", callFunc, callObj);
      };
      UIUtil.addSliderListener = function(uiNode, callFunc, callObj) {
        uiNode && uiNode.on("slider", callFunc, callObj);
      };
      UIUtil.removeSliderListener = function(uiNode, callFunc, callObj) {
        uiNode && uiNode.off("slider", callFunc, callObj);
      };
      UIUtil.addSpriteClickListenter = function(uiNode, callFunc, callObj) {
        uiNode && uiNode.on(cc.Node.EventType.TOUCH_END, callFunc, callObj);
      };
      UIUtil.removeSpriteClickListenter = function(uiNode, callFunc, callObj) {
        uiNode && uiNode.off(cc.Node.EventType.TOUCH_END, callFunc, callObj);
      };
      UIUtil.randomInt = function(min, max) {
        return Math.round(Math.random() * (max - min) + min);
      };
      UIUtil.addRedPoint = function(root, top, right) {};
      UIUtil.removeRedPoint = function(root) {
        if (root && root.isValid) {
          var redImg = root.getChildByName("redPoint");
          redImg && (redImg.active = false);
        }
      };
      UIUtil.setCakeIcon = function(cake, sprite) {
        var picPath = "gamePackages-textures-icons-cakes-" + cake;
        GameGlobal_1.GameGlobal.Resource.setFrame("", sprite, ResConst_1.ResConst.PLIST_PATH.FISH_GAME, picPath);
      };
      UIUtil.setPropIcon = function(prop, sprite) {
        var picPath = "gamePackages-textures-icons-props-" + prop;
        GameGlobal_1.GameGlobal.Resource.setFrame("", sprite, ResConst_1.ResConst.PLIST_PATH.FISH_GAME, picPath);
      };
      UIUtil.setGameIcon = function(game, sprite) {
        if (game.startsWith("http")) this.setAvatar(game, sprite); else {
          var picPath = "gamePackages-textures-icons-props-" + game;
          GameGlobal_1.GameGlobal.Resource.setFrame("", sprite, ResConst_1.ResConst.PLIST_PATH.FISH_GAME, picPath);
        }
      };
      UIUtil.setAvatar = function(avatarUrl, sprite) {
        if (!avatarUrl || !avatarUrl.startsWith("http")) return;
        var suffix = "png";
        cc.loader.load({
          url: avatarUrl,
          type: suffix
        }, function(err, tex) {
          if (err) {
            console.error("set avatar failed! err:", avatarUrl, err);
            return;
          }
          var spriteFrame = new cc.SpriteFrame(tex, new cc.Rect(0, 0, tex.width, tex.height));
          sprite && cc.isValid(sprite) && (sprite.spriteFrame = spriteFrame);
        });
      };
      UIUtil.stopAllAnimation = function(node) {
        cc.Tween.stopAllByTarget(node);
        for (var i = 0; i < node.childrenCount; i++) this.stopAllAnimation(node.children[i]);
      };
      UIUtil.setGray = function(node, gray, children) {
        void 0 === children && (children = true);
        var target = node;
        cc.Material.BUILTIN_NAME.GRAY_SPRITE;
        var material = cc.Material.getBuiltinMaterial(gray ? cc.Material.BUILTIN_NAME.GRAY_SPRITE + "" : cc.Material.BUILTIN_NAME.SPRITE + "");
        if (node instanceof cc.Node) {
          var sprite = node.getComponent(cc.Sprite);
          sprite && sprite.setMaterial(0, material);
          var label = node.getComponent(cc.Label);
          label && label.setMaterial(0, material);
          children && node.children.forEach(function(subNode) {
            var sprite = subNode.getComponent(cc.Sprite);
            sprite && sprite.setMaterial(0, material);
            var label = subNode.getComponent(cc.Label);
            label && label.setMaterial(0, material);
          });
        } else node instanceof cc.Sprite && target && target.setMaterial(0, material);
      };
      UIUtil.setGray2 = function(node, gray, children) {
        void 0 === children && (children = true);
        var target = node;
        node instanceof cc.Sprite && (target = node.node);
        cc.Material.BUILTIN_NAME.GRAY_SPRITE;
        var material = cc.Material.getBuiltinMaterial(gray ? cc.Material.BUILTIN_NAME.GRAY_SPRITE + "" : cc.Material.BUILTIN_NAME.SPRITE + "");
        if (target instanceof cc.Node) {
          target.color = new cc.Color(100, 100, 100);
          children && target.children.forEach(function(subNode) {
            subNode.color = new cc.Color(100, 100, 100);
          });
        }
      };
      return UIUtil;
    }();
    exports.UIUtil = UIUtil;
    cc._RF.pop();
  }, {
    "../GameGlobal": "GameGlobal",
    "../const/ResConst": "ResConst"
  } ],
  UserInfoView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "22b41kyx5pM4ZSPyZCucoOF", "UserInfoView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var UserInfoView_1;
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const BaseWindows_1 = require("../../../framework/base/BaseWindows");
    const EventConst_1 = require("../../../framework/const/EventConst");
    const ResConst_1 = require("../../../framework/const/ResConst");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const LogUtil_1 = require("../../../framework/utils/LogUtil");
    const FortConst_1 = require("../../const/FortConst");
    const HallConst_1 = require("../../const/HallConst");
    const HallHttpConst_1 = require("../../const/HallHttpConst");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let UserInfoView = UserInfoView_1 = class UserInfoView extends BaseWindows_1.BaseWindows {
      constructor() {
        super(...arguments);
        this.isClickRect = true;
        this.fortList = [];
      }
      initUI(...args) {
        super.initUI(...args);
        this.initSelfUI();
      }
      initSelfUI() {
        let info = GameGlobal_1.GameGlobal.DataManager.userInfo;
        this.onRefleshUserInfo(info);
        GameGlobal_1.GameGlobal.Eventer.addListener(EventConst_1.EventConst.EventId.REFLESH_USER_INFO, this.onRefleshUserInfo, this);
        GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetUserFortList, {
          page: 1,
          size: 10
        }, this.onFortListResp, this);
      }
      onRefleshUserInfo(data) {
        let userInfo = data;
        if (!userInfo) {
          LogUtil_1.LogUtil.info(UserInfoView_1.TAG, "refreshUserInfo but userInfo is null");
          return;
        }
        let coin = userInfo["coin"];
        let power = userInfo["energy"];
        let fuel = userInfo["fuel"];
        let act = userInfo["brisk"];
        let income = userInfo["income"];
        let nick = userInfo["nickname"];
        let headUrl = userInfo["headurl"];
        let phone = userInfo["phone"];
        let id = userInfo["userId"];
        let invite = userInfo["bing_code"];
        this.txtPhone.string = phone || "0000000000";
        this.txtId.string = id || "";
        this.txtInvite.string = invite || "";
        this.txtNick.string = nick || "Unknow Name";
        this.txtCoin.string = coin;
        this.txtPower.string = power ? `${power}` : "0";
        this.txtFuel.string = fuel ? `${fuel}` : "0";
        this.txtAct.string = act ? `${act}` : "0";
        headUrl = Number.parseInt(headUrl);
        let headIdx = isNaN(headUrl) ? 0 : headUrl % HallConst_1.default.Heads.length;
        GameGlobal_1.GameGlobal.Resource.setFrame("", this.sHead.node, ResConst_1.ResConst.PLIST_PATH.HEAD, HallConst_1.default.Heads[headIdx]);
      }
      onFortListResp(data) {
        if (data && 200 == data.code) {
          data = data.data;
          if (data && data.list && data.list.length > 0) {
            this.fortList = this.fortList.concat(data.list);
            this.refleshForts();
          }
          let total = data.total ? data.total : 0;
          if (this.fortList < total) {
            let page = Math.floor(this.fortList.length / 10) + 1;
            GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetUserFortList, {
              page: page,
              size: 10
            }, this.onFortListResp, this);
          }
        }
      }
      refleshForts() {
        let curIdx = this.fortContent.childrenCount;
        for (let i = curIdx; i < this.fortList.length; i++) {
          let item = cc.instantiate(this.fortItem);
          this.fortContent.addChild(item);
          let name = item.getChildByName("txtName");
          let num = item.getChildByName("txtCount");
          let fort = item.getChildByName("fort");
          let txtName = name.getComponent(cc.Label);
          let txtNum = num.getComponent(cc.Label);
          let sFort = fort.getComponent(cc.Sprite);
          txtName.string = this.fortList[i].name + "";
          txtNum.string = this.fortList[i].numbers + "";
          let image = this.fortList[i].images;
          let index = this.fortList[i].grade;
          index %= FortConst_1.default.Fort60.length;
          GameGlobal_1.GameGlobal.Resource.setFrame("", sFort, ResConst_1.ResConst.PLIST_PATH.FORTPROP, FortConst_1.default.Fort60[index]);
        }
      }
      onBtnClick(event, customEventData) {
        0 == customEventData ? GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.USER_INFO_VIEW) : 1 == customEventData ? GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.CHANGE_HEAD_VIEW) : 2 == customEventData ? GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.CHANGE_NICK_VIEW) : 3 == customEventData && GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.ACCOUNT_VIEW);
      }
    };
    UserInfoView.TAG = "UserInfoView";
    __decorate([ property(cc.Sprite) ], UserInfoView.prototype, "sHead", void 0);
    __decorate([ property(cc.Label) ], UserInfoView.prototype, "txtNick", void 0);
    __decorate([ property(cc.Label) ], UserInfoView.prototype, "txtPhone", void 0);
    __decorate([ property(cc.Label) ], UserInfoView.prototype, "txtId", void 0);
    __decorate([ property(cc.Label) ], UserInfoView.prototype, "txtInvite", void 0);
    __decorate([ property(cc.Label) ], UserInfoView.prototype, "txtCoin", void 0);
    __decorate([ property(cc.Label) ], UserInfoView.prototype, "txtPower", void 0);
    __decorate([ property(cc.Label) ], UserInfoView.prototype, "txtAct", void 0);
    __decorate([ property(cc.Label) ], UserInfoView.prototype, "txtFuel", void 0);
    __decorate([ property(cc.Node) ], UserInfoView.prototype, "fortContent", void 0);
    __decorate([ property(cc.Prefab) ], UserInfoView.prototype, "fortItem", void 0);
    UserInfoView = UserInfoView_1 = __decorate([ ccclass ], UserInfoView);
    exports.default = UserInfoView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/EventConst": "EventConst",
    "../../../framework/const/ResConst": "ResConst",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../../framework/utils/LogUtil": "LogUtil",
    "../../const/FortConst": "FortConst",
    "../../const/HallConst": "HallConst",
    "../../const/HallHttpConst": "HallHttpConst"
  } ],
  Utils: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5c878MS5IBPKqftune5lpUg", "Utils");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Utils = void 0;
    class Utils {
      static isArrayContains(list, vaule) {
        for (let i = 0; i < list.length; i++) if (list[i] == vaule) return true;
        return false;
      }
      static getCountOneOfValue(value) {
        let count = 0;
        while (value > 0) {
          count++;
          value &= value - 1;
        }
        return count;
      }
      static toHexStr(n) {
        n = Math.floor(n);
        let s = [];
        do {
          let m = n % 16;
          s.unshift(`${m}`);
          n = Math.floor(n / 16);
        } while (n > 0);
        return "0x" + s.join("");
      }
      static formatTime(t, bHour = false) {
        let s = t % 60;
        let m = Math.floor(t % 3600 / 60);
        let h = Math.floor(t / 3600);
        let strH = h > 0 ? (h >= 10 ? h + "" : "0" + h) + ":" : "";
        let strM = m >= 10 ? m + "" : "0" + m;
        let strS = s >= 10 ? s + "" : "0" + s;
        if (bHour || h) return `${strH}${strM}:${strS}`;
        return `${strM}:${strS}`;
      }
      static getLevelStr(level) {
        let l = level;
        let l0 = Math.floor(l / 7) + 1;
        let l1 = l % 7 + 1;
        let levelStr = `\u7b2c${l0}-${l1}\u95dc`;
        return levelStr;
      }
      static randomInt(max, min = 0) {
        let dn = max - min;
        let n = Math.floor(dn * Math.random());
        return n + min;
      }
      static getShowCoin(coin) {
        if (coin >= 1e6) {
          let tmpCoin = coin / 1e6;
          return tmpCoin.toFixed(2) + "M";
        }
        return coin + "";
      }
      static isChinesePhoneNumber(phoneNumber) {
        const regex = /^1[3456789]\d{9}$/;
        return regex.test(phoneNumber);
      }
      static isVietnamesePhoneNumber(phoneNumber) {
        const regex = /^0\d{9}$/;
        return regex.test(phoneNumber);
      }
      static isMyanmarPhoneNumber(phoneNumber) {
        const regex = /^(09|\+?950?9|\+?95950?9)\d{7,9}$/;
        return regex.test(phoneNumber);
      }
      static isPhoneNumber(phone) {
        return this.isChinesePhoneNumber(phone) || this.isVietnamesePhoneNumber(phone) || this.isMyanmarPhoneNumber(phone);
      }
      static setPasteBoardContent(content) {
        cc.log("setPasteBoardContent===>" + content);
        let success = false;
        if (cc.sys.isNative) cc.sys.os == cc.sys.OS_IOS ? success = jsb.reflection.callStaticMethod("AppController", "setClipBoard:", content) : cc.sys.os == cc.sys.OS_ANDROID && (success = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "setClipBoard", "(Ljava/lang/String;I)Z", content)); else {
          var input = content;
          const el = document.createElement("textarea");
          el.value = input;
          el.setAttribute("readonly", "");
          el.style.position = "absolute";
          el.style.left = "-9999px";
          el.style.fontSize = "12pt";
          const selection = getSelection();
          var originalRange;
          selection.rangeCount > 0 && (originalRange = selection.getRangeAt(0));
          document.body.appendChild(el);
          el.select();
          el.selectionStart = 0;
          el.selectionEnd = input.length;
          try {
            success = document.execCommand("copy");
          } catch (err) {}
          document.body.removeChild(el);
          if (originalRange) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
          }
        }
        return success;
      }
      static getNumber(s) {
        let nss = s.match("\\d+");
        if (nss.length > 0) return Number.parseInt(nss[0]);
        return 0;
      }
    }
    exports.Utils = Utils;
    Utils.HEX = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F" ];
    cc._RF.pop();
  }, {} ],
  ViewConst: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "19cb82p+5xEY6HijmdMQHPV", "ViewConst");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ViewConst = void 0;
    const ResConst_1 = require("./ResConst");
    class ViewConst {}
    exports.ViewConst = ViewConst;
    ViewConst.LayerType = {
      BOTTOM: 0,
      MIDDLE: 1,
      TOP: 2,
      TOPUP: 3,
      LOADING: 4,
      ERROR: 5,
      GUIDE: 6
    };
    ViewConst.NormalAction = {
      OPEN: "open",
      CLOSE: "close",
      SHOW: "show",
      HIDE: "hide"
    };
    ViewConst.ExtraAction = {
      CLOSE_ALL: "close_all",
      HIDE_ALL: "hide_all",
      SHOW_ALL: "show_all",
      CLOSE_OTHER: "close_other",
      HIDE_OTHER: "hide_other",
      SHOW_OTHER: "show_other",
      MOVE_TOP: "move_top",
      MOVE_BOTTOM: "move_bottom",
      PAUSE_CUR: "pause_cur",
      RESUME_LAST: "resume_last"
    };
    ViewConst.ViewName = {
      LOGIN_VIEW: "LoginView",
      LOADING_UI: "LoadingUI",
      HALL_VIEW: "HallView",
      SETTING_VIEW: "SettingView",
      FISH_GAME_VIEW: "FishGameView",
      BIND_PHONE_VIEW: "BindPhoneView",
      FORGET_PASSWORD_VIEW: "ForgetPassWordView",
      ACCOUNT_VIEW: "AccountView",
      CHANGE_PASSWORD_VIEW: "ChangePassWordView",
      CHANGE_HEAD_VIEW: "ChangeHeadView",
      CHANGE_NICK_VIEW: "ChangeNickView",
      SHOP_VIEW: "ShopView",
      EXIT_TIPS_VIEW: "ExitTipsView",
      USER_INFO_VIEW: "UserInfoView",
      BATTERY_VIEW: "BatteryView",
      BONUSTORTOISE_VIEW: "BonusTortoiseView",
      BACKPACK_VIEW: "BackpackView",
      FORT_UPDATE_VIEW: "FortUpdateView",
      COMMON_TIPS_VIEW: "CommonTipsView",
      Fish_COMMON_TIPS_VIEW: "FishCommonTipsView",
      LOGIN_TIPS_VIEW: "LoginTipsView",
      FRIEND_ACCOUNT_DETAIL: "FriendAccountDetail",
      FRIEND_INSTRUCTION_VIEW: "FriendInstructionView",
      FRIEND_INVITE_VIEW: "FriendInviteView",
      FRIEND_CONGRATE_TIPS_VIEW: "FriendCongrateTipsView",
      MAIL_VIEW: "MailView",
      BONUS_TURTLE_VIEW: "BonusTurtleView",
      BONUS_TURTLE_RULE_VIEW: "BonusTurtleRuleView",
      BUY_DETAIL_VIEW: "BuyDetailView",
      BUY_PROP_DETAIL_VIEW: "BuyPropDetailView",
      SYNTH_ADVANCE_VIEW: "SynthAdvanceView",
      SYNTH_GENERAL_VIEW: "SynthGeneralView",
      TURTLE_INSTRUCTION_VIEW: "BonusTurtleInstructionView",
      FORT_DETAIL_VIEW: "FortDetailView",
      YLB_APPLY_VIEW: "YlbApplyView",
      YLB_INSTRUCTION_VIEW: "YlbInstructionView",
      YLB_VIEW: "YlbView",
      ILLUSTRATED_HANDBOOK_VIEW: "IllustratedHandbookView"
    };
    ViewConst.ViewConf = {
      [ViewConst.ViewName.LOGIN_VIEW]: {
        layer: ViewConst.LayerType.MIDDLE,
        prefab: "mainRes/prefabs/view/hall/LoginView"
      },
      [ViewConst.ViewName.LOADING_UI]: {
        layer: ViewConst.LayerType.MIDDLE,
        prefab: "prefab/LoadingView",
        resModule: ResConst_1.ResConst.ModuleName.LoadingView
      },
      [ViewConst.ViewName.HALL_VIEW]: {
        layer: ViewConst.LayerType.MIDDLE,
        prefab: "mainRes/prefabs/view/hall/HallView",
        resModule: ResConst_1.ResConst.ModuleName.HallView
      },
      [ViewConst.ViewName.SETTING_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/views/SettingView",
        resModule: ResConst_1.ResConst.ModuleName.SettingView
      },
      [ViewConst.ViewName.FISH_GAME_VIEW]: {
        layer: ViewConst.LayerType.MIDDLE,
        prefab: "mainRes/prefabs/view/fish/FishGameView",
        resModule: ResConst_1.ResConst.ModuleName.FishGameView
      },
      [ViewConst.ViewName.BATTERY_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/fish/BatteryView"
      },
      [ViewConst.ViewName.BONUSTORTOISE_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/fish/BonusTortoiseView"
      },
      [ViewConst.ViewName.Fish_COMMON_TIPS_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/fish/FishCommonTipsView"
      },
      [ViewConst.ViewName.ILLUSTRATED_HANDBOOK_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/fish/IllustratedHandbookView"
      },
      [ViewConst.ViewName.BIND_PHONE_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/BindPhoneView"
      },
      [ViewConst.ViewName.FORGET_PASSWORD_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/ForgetPassWordView"
      },
      [ViewConst.ViewName.ACCOUNT_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/AccountView"
      },
      [ViewConst.ViewName.CHANGE_PASSWORD_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/ChangePassWordView"
      },
      [ViewConst.ViewName.CHANGE_HEAD_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/ChangeHeadView"
      },
      [ViewConst.ViewName.CHANGE_NICK_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/ChangeNickView"
      },
      [ViewConst.ViewName.SHOP_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/ShopView"
      },
      [ViewConst.ViewName.EXIT_TIPS_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/ExitTipsView"
      },
      [ViewConst.ViewName.USER_INFO_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/UserInfoView"
      },
      [ViewConst.ViewName.BACKPACK_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/BackpackView"
      },
      [ViewConst.ViewName.FORT_UPDATE_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/FortUpdateView"
      },
      [ViewConst.ViewName.COMMON_TIPS_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/common/CommonTipsView"
      },
      [ViewConst.ViewName.LOGIN_TIPS_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/LoginTipsView"
      },
      [ViewConst.ViewName.FRIEND_ACCOUNT_DETAIL]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/FriendAccountDetailView"
      },
      [ViewConst.ViewName.FRIEND_INSTRUCTION_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/FriendInstructiomView"
      },
      [ViewConst.ViewName.FRIEND_INVITE_VIEW]: {
        layer: ViewConst.LayerType.MIDDLE,
        prefab: "mainRes/prefabs/view/hall/FriendInviteView"
      },
      [ViewConst.ViewName.FRIEND_CONGRATE_TIPS_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/FriendCongrateTipsView"
      },
      [ViewConst.ViewName.MAIL_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/MailView"
      },
      [ViewConst.ViewName.BONUS_TURTLE_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/BonusTurtleView"
      },
      [ViewConst.ViewName.BONUS_TURTLE_RULE_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/BonusTurtleRuleView"
      },
      [ViewConst.ViewName.BUY_DETAIL_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/BuyDetailView"
      },
      [ViewConst.ViewName.BUY_PROP_DETAIL_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/BuyPropDetailView"
      },
      [ViewConst.ViewName.SYNTH_ADVANCE_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/SynthesisAdvanceView"
      },
      [ViewConst.ViewName.SYNTH_GENERAL_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/SynthesisGeneralView"
      },
      [ViewConst.ViewName.TURTLE_INSTRUCTION_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/BonusTurtleInstructionView"
      },
      [ViewConst.ViewName.FORT_DETAIL_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/FortDetailView"
      },
      [ViewConst.ViewName.YLB_APPLY_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/YlbApplyView"
      },
      [ViewConst.ViewName.YLB_INSTRUCTION_VIEW]: {
        layer: ViewConst.LayerType.TOP,
        prefab: "mainRes/prefabs/view/hall/YlbInstructionView"
      },
      [ViewConst.ViewName.YLB_VIEW]: {
        layer: ViewConst.LayerType.MIDDLE,
        prefab: "mainRes/prefabs/view/hall/YlbView"
      }
    };
    ViewConst.ViewExtraAction = {
      [ViewConst.ViewName.LOADING_UI]: {
        [ViewConst.NormalAction.OPEN]: [ ViewConst.ExtraAction.CLOSE_OTHER ]
      },
      [ViewConst.ViewName.SYNTH_GENERAL_VIEW]: {
        [ViewConst.NormalAction.OPEN]: [ ViewConst.ExtraAction.PAUSE_CUR ],
        [ViewConst.NormalAction.CLOSE]: [ ViewConst.ExtraAction.PAUSE_CUR ]
      },
      [ViewConst.ViewName.FISH_GAME_VIEW]: {
        [ViewConst.NormalAction.OPEN]: ViewConst.ExtraAction.CLOSE_OTHER
      }
    };
    cc._RF.pop();
  }, {
    "./ResConst": "ResConst"
  } ],
  ViewManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3d4beLW7vlF1bnW7JlCvGie", "ViewManager");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ViewManager = void 0;
    var ViewConst_1 = require("../const/ViewConst");
    var LogUtil_1 = require("../utils/LogUtil");
    var GameGlobal_1 = require("../GameGlobal");
    var Singleton_1 = require("../base/Singleton");
    var WaitingUI_1 = require("../component/WaitingUI");
    var LoadingUI_1 = require("../component/LoadingUI");
    var BaseView_1 = require("../base/BaseView");
    var ViewManager = function(_super) {
      __extends(ViewManager, _super);
      function ViewManager() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this._bRing = false;
        return _this;
      }
      ViewManager.getInstance = function() {
        return _super.getInstance.call(this);
      };
      Object.defineProperty(ViewManager.prototype, "uiRoot", {
        get: function() {
          return this._uiRoot;
        },
        enumerable: false,
        configurable: true
      });
      ViewManager.prototype.init = function(waitPra) {
        this._viewOpenDict = {};
        this._openingDict = [];
        this.isOpening = false;
        this.waitPrefab = waitPra;
      };
      ViewManager.prototype.windowSizeChange = function() {
        GameGlobal_1.GameGlobal.gameRoot && GameGlobal_1.GameGlobal.gameRoot.setContentSize(cc.winSize);
        GameGlobal_1.GameGlobal.gameRoot && GameGlobal_1.GameGlobal.gameRoot.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        for (var n in this._layers) {
          this._layers[n].setContentSize(cc.winSize);
          this._layers[n].getComponent(cc.Widget).updateAlignment();
        }
      };
      ViewManager.prototype.initLayers = function() {
        GameGlobal_1.GameGlobal.gameRoot && GameGlobal_1.GameGlobal.gameRoot.setContentSize(cc.winSize);
        GameGlobal_1.GameGlobal.gameRoot && GameGlobal_1.GameGlobal.gameRoot.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        this._uiRoot = cc.find("Canvas");
        this._layers = [];
        for (var typeName in ViewConst_1.ViewConst.LayerType) {
          var layerType = ViewConst_1.ViewConst.LayerType[typeName];
          var layer = new cc.Node();
          layer.name = "LAYER_" + typeName;
          this._layers[layerType] = layer;
          this._uiRoot.addChild(layer);
          layer.width = cc.winSize.width;
          layer.height = cc.winSize.height;
          var widget = layer.addComponent(cc.Widget);
          widget.alignMode = cc.Widget.AlignMode.ALWAYS;
          widget.bottom = 0;
          widget.top = 0;
          widget.left = 0;
          widget.right = 0;
          widget.updateAlignment();
        }
      };
      ViewManager.prototype.getLayer = function(layerType) {
        return this._layers[layerType];
      };
      ViewManager.prototype.getAllOpenView = function() {
        var names = [ ViewConst_1.ViewConst.LayerType.MIDDLE, ViewConst_1.ViewConst.LayerType.TOP, ViewConst_1.ViewConst.LayerType.TOPUP ];
        var nodes = [];
        for (var i = 0; i < names.length; i++) {
          var layer = this.getLayer(names[i]);
          nodes = nodes.concat(layer.children);
        }
        for (var i = nodes.length - 1; i >= 0; i--) nodes[i].active || nodes.splice(i);
        return nodes;
      };
      ViewManager.prototype.getViewLayerType = function(viewName) {
        var layerType = ViewConst_1.ViewConst.ViewConf[viewName].layer;
        return layerType;
      };
      ViewManager.prototype.getViewExtraAction = function(viewName) {
        var extAction = ViewConst_1.ViewConst.ViewExtraAction[viewName];
        return extAction;
      };
      ViewManager.prototype.openView = function(viewName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) args[_i - 1] = arguments[_i];
        LogUtil_1.LogUtil.info("Viewer:", "viewName==>" + viewName);
        if (this.isOpening) {
          if (this.viewIsOpening(viewName)) {
            LogUtil_1.LogUtil.warn(viewName + "\u754c\u9762\u5df2\u7ecf\u5728\u6253\u5f00\u5217\u8868\u4e2d\uff0c\u8bf7\u4e0d\u8981\u91cd\u590d\u6253\u5f00");
            return;
          }
          var ob = {};
          ob.viewName = viewName;
          ob.args = args;
          this._openingDict.push(ob);
        } else this.openingView.apply(this, __spreadArrays([ viewName, null ], args));
      };
      ViewManager.prototype.viewIsOpening = function(viewName) {
        for (var i = 0; i < this._openingDict.length; i++) if (this._openingDict[i].viewName == viewName) return true;
        return false;
      };
      ViewManager.prototype.switchView = function(curView, lastView) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) args[_i - 2] = arguments[_i];
        var callBack = function() {
          GameGlobal_1.GameGlobal.Viewer.closeView(lastView, true);
        };
        if (this.isOpening) {
          if (this.viewIsOpening(curView)) {
            LogUtil_1.LogUtil.warn(curView + "\u754c\u9762\u5df2\u7ecf\u5728\u6253\u5f00\u5217\u8868\u4e2d\uff0c\u8bf7\u4e0d\u8981\u91cd\u590d\u6253\u5f00");
            return;
          }
          var ob = {};
          ob.viewName = curView;
          ob.callback = callBack;
          ob.args = args;
          this._openingDict.push(ob);
        } else this.openingView.apply(this, __spreadArrays([ curView, callBack ], args));
      };
      ViewManager.prototype.checkNextView = function() {
        GameGlobal_1.GameGlobal.Viewer.openComplete();
        if (this._openingDict.length > 0) {
          var ob = this._openingDict[0];
          this._openingDict.splice(0, 1);
          this.openingView.apply(this, __spreadArrays([ ob.viewName, ob.callback ], ob.args));
        }
      };
      ViewManager.prototype.openingView = function(viewName, callback) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) args[_i - 2] = arguments[_i];
        var lastTime = Date.now();
        this.isOpening = true;
        this.showWaitView("loading...", 1.5);
        var view = this.getOpenView(viewName);
        if (view) {
          LogUtil_1.LogUtil.info("GameViewer", "openView -> view allready exist : " + viewName);
          view.initUI.apply(view, args);
          view.updateUI();
          this.checkNextView();
        } else {
          LogUtil_1.LogUtil.info("GameViewer", "openView -> create new view : " + viewName);
          var layerConf_1 = ViewConst_1.ViewConst.ViewConf[viewName];
          if (layerConf_1) {
            var loadTime = Date.now();
            layerConf_1.resModule && (GameGlobal_1.GameGlobal.Resource.openViewTime[layerConf_1.resModule] = loadTime);
            GameGlobal_1.GameGlobal.Resource.loadViewRes(viewName, null, function(error, assets) {
              if (null == error) {
                var data = GameGlobal_1.GameGlobal.Resource.getResByUrl(layerConf_1.prefab, cc.Prefab);
                var loadedTime = Date.now();
                LogUtil_1.LogUtil.debug("ViewManager", "\u52a0\u8f7d\u8d44\u6e90" + layerConf_1.prefab + "\u8017\u65f6:" + (loadedTime - loadTime) + "ms");
                var node = cc.instantiate(data);
                var instTime = Date.now();
                LogUtil_1.LogUtil.info("ViewManager", "instTime = ", instTime - loadedTime, "ms");
                view = node.getComponent(BaseView_1.BaseView);
                view.viewName = viewName;
                GameGlobal_1.GameGlobal.Viewer.$onViewOpen(view);
                layerConf_1.resModule && (view.resModule = layerConf_1.resModule);
                var layer = GameGlobal_1.GameGlobal.Viewer.getLayer(layerConf_1.layer);
                layer.addChild(node);
                var widget = node.getComponent(cc.Widget);
                widget || (widget = node.addComponent(cc.Widget));
                widget.top = widget.bottom = widget.left = widget.right = 0;
                view.isCenter && view.center();
                view.initUI.apply(view, args);
                view.updateUI();
                var curTime = Date.now();
                LogUtil_1.LogUtil.debug("\u6253\u5f00\u754c\u9762" + viewName + "\u8017\u65f6:" + (curTime - lastTime) + "ms");
                callback && callback();
                GameGlobal_1.GameGlobal.Viewer.checkNextView();
              } else {
                LogUtil_1.LogUtil.debug("\u52a0\u8f7d\u754c\u9762\u51fa\u9519:" + layerConf_1.prefab + " " + error);
                GameGlobal_1.GameGlobal.Viewer.openComplete();
              }
            });
          } else {
            GameGlobal_1.GameGlobal.Viewer.openComplete();
            LogUtil_1.LogUtil.debug("\u672a\u914d\u7f6e\u754c\u9762\u5c42\u7ea7\u548c\u8def\u5f84\uff1a" + viewName);
          }
        }
        return view;
      };
      ViewManager.prototype.openComplete = function() {
        GameGlobal_1.GameGlobal.Viewer.isOpening = false;
        GameGlobal_1.GameGlobal.Viewer.hideWaitView();
      };
      ViewManager.prototype.closeView = function(viewName, closeAll) {
        void 0 === closeAll && (closeAll = false);
        LogUtil_1.LogUtil.info("GameViewer", "closeView -> viewName : " + viewName);
        var viewList = this.getOpenViewList(viewName);
        if (viewList && viewList.length > 0) for (var index = viewList.length - 1; index >= 0; index--) {
          var viewObj = viewList[index];
          viewObj.close();
          if (!closeAll) return;
        }
      };
      ViewManager.prototype.closeViewEffect = function(viewName, closeAll) {
        void 0 === closeAll && (closeAll = false);
        LogUtil_1.LogUtil.info("GameViewer", "closeViewEffect -> viewName : " + viewName);
        var viewList = this.getOpenViewList(viewName);
        if (viewList && viewList.length > 0) for (var index = viewList.length - 1; index >= 0; index--) {
          var viewObj = viewList[index];
          viewObj.closeEffect();
          if (!closeAll) return;
        }
      };
      ViewManager.prototype.toggleView = function(viewName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) args[_i - 1] = arguments[_i];
        LogUtil_1.LogUtil.info("GameViewer", "toggleView -> viewName : " + viewName);
        var view = this.getOpenView(viewName);
        view ? view.close() : this.openView.apply(this, __spreadArrays([ viewName ], args));
      };
      ViewManager.prototype.hideView = function(viewName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) args[_i - 1] = arguments[_i];
        var view = this.getOpenView(viewName);
        view && view.hide();
      };
      ViewManager.prototype.showView = function(viewName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) args[_i - 1] = arguments[_i];
        var view = this.getOpenView(viewName);
        view ? view.updateUI() : this.openView.apply(this, __spreadArrays([ viewName ], args));
      };
      ViewManager.prototype.getOpenView = function(viewName) {
        var viewList = this.getOpenViewList(viewName);
        if (viewList && viewList.length > 0) return viewList[viewList.length - 1];
        return null;
      };
      ViewManager.prototype.getOpenViewList = function(viewName) {
        var viewList = [];
        var viewConf = ViewConst_1.ViewConst.ViewConf[viewName];
        if (viewConf) {
          var layerType = viewConf.layer;
          var checkList = this._viewOpenDict[layerType];
          if (checkList) for (var _i = 0, checkList_1 = checkList; _i < checkList_1.length; _i++) {
            var viewObj = checkList_1[_i];
            viewObj.viewName == viewName && viewList.push(viewObj);
          }
        }
        return viewList;
      };
      ViewManager.prototype.getAllHideViewList = function(exceptList) {
        var views = [];
        for (var layerType in this._viewOpenDict) {
          var checkList = this._viewOpenDict[layerType];
          if (checkList) for (var _i = 0, checkList_2 = checkList; _i < checkList_2.length; _i++) {
            var viewObj = checkList_2[_i];
            (!exceptList || exceptList.indexOf(viewObj.viewName) < 0) && viewObj.node && !viewObj.node.active && views.push(viewObj.viewName);
          }
        }
        return views;
      };
      ViewManager.prototype.getAllViews = function(layerType, exceptList) {
        var viewList = [];
        exceptList = exceptList || [];
        if (layerType) {
          var checkList = this._viewOpenDict[layerType];
          if (checkList) for (var _i = 0, checkList_3 = checkList; _i < checkList_3.length; _i++) {
            var viewObj = checkList_3[_i];
            exceptList.indexOf(viewObj.viewName) < 0 && viewList.push(viewObj);
          }
        } else for (var layerType_1 in this._viewOpenDict) {
          var checkList = this._viewOpenDict[layerType_1];
          if (checkList) for (var _a = 0, checkList_4 = checkList; _a < checkList_4.length; _a++) {
            var viewObj = checkList_4[_a];
            exceptList.indexOf(viewObj.viewName) < 0 && viewList.push(viewObj);
          }
        }
        return viewList;
      };
      ViewManager.prototype.closeAllViews = function(layerType, exceptList) {
        var viewList = this.getAllViews(layerType, exceptList);
        for (var _i = 0, viewList_1 = viewList; _i < viewList_1.length; _i++) {
          var viewObj = viewList_1[_i];
          viewObj.close();
        }
      };
      ViewManager.prototype.showAllViews = function(layerType, exceptList) {
        var viewList = this.getAllViews(layerType, exceptList);
        for (var _i = 0, viewList_2 = viewList; _i < viewList_2.length; _i++) {
          var viewObj = viewList_2[_i];
          viewObj.updateUI();
        }
      };
      ViewManager.prototype.hideAllViews = function(layerType, exceptList) {
        var viewList = this.getAllViews(layerType, exceptList);
        for (var _i = 0, viewList_3 = viewList; _i < viewList_3.length; _i++) {
          var viewObj = viewList_3[_i];
          viewObj.hide();
        }
      };
      ViewManager.prototype.hideAllShowViews = function(exceptList) {
        for (var layerType in this._viewOpenDict) {
          var checkList = this._viewOpenDict[layerType];
          if (checkList) for (var _i = 0, checkList_5 = checkList; _i < checkList_5.length; _i++) {
            var viewObj = checkList_5[_i];
            (!exceptList || exceptList.indexOf(viewObj.viewName) < 0) && viewObj.node && viewObj.node.active && viewObj.hide();
          }
        }
      };
      ViewManager.prototype.showAllHideViews = function(exceptList) {
        for (var layerType in this._viewOpenDict) {
          var checkList = this._viewOpenDict[layerType];
          if (checkList) for (var _i = 0, checkList_6 = checkList; _i < checkList_6.length; _i++) {
            var viewObj = checkList_6[_i];
            (!exceptList || exceptList.indexOf(viewObj.viewName) < 0) && viewObj.node && viewObj.node && !viewObj.node.active && viewObj.updateUI();
          }
        }
      };
      ViewManager.prototype.closeAllHideViews = function(exceptList) {
        for (var layerType in this._viewOpenDict) {
          var checkList = this._viewOpenDict[layerType];
          if (checkList) for (var _i = 0, checkList_7 = checkList; _i < checkList_7.length; _i++) {
            var viewObj = checkList_7[_i];
            (!exceptList || exceptList.indexOf(viewObj.viewName) < 0) && viewObj.node && !viewObj.node.active && viewObj.close();
          }
        }
      };
      ViewManager.prototype.checkExtraAction = function(viewObj, actType) {
        var viewName = viewObj.viewName;
        var layerType = ViewConst_1.ViewConst.ViewConf[viewName].layer;
        var extAction = ViewConst_1.ViewConst.ViewExtraAction[viewName];
        var action = extAction && extAction[actType];
        action instanceof Array || (action = [ action ]);
        for (var _i = 0, action_1 = action; _i < action_1.length; _i++) {
          var subAct = action_1[_i];
          if (subAct == ViewConst_1.ViewConst.ExtraAction.CLOSE_ALL) this.closeAllViews(); else if (subAct == ViewConst_1.ViewConst.ExtraAction.CLOSE_OTHER) this.closeAllViews(null, [ viewName ]); else if (subAct == ViewConst_1.ViewConst.ExtraAction.SHOW_ALL) this.showAllViews(); else if (subAct == ViewConst_1.ViewConst.ExtraAction.SHOW_OTHER) this.showAllViews(null, [ viewName ]); else if (subAct == ViewConst_1.ViewConst.ExtraAction.HIDE_ALL) this.hideAllViews(); else if (subAct == ViewConst_1.ViewConst.ExtraAction.HIDE_OTHER) this.hideAllViews(null, [ viewName ]); else if (subAct == ViewConst_1.ViewConst.ExtraAction.MOVE_TOP) {
            var layer = this.getLayer(layerType);
            layer.insertChild(viewObj.node, layer.children.length - 1);
          } else if (subAct == ViewConst_1.ViewConst.ExtraAction.MOVE_BOTTOM) {
            var layer = this.getLayer(layerType);
            layer.insertChild(viewObj.node, 0);
          } else if (subAct == ViewConst_1.ViewConst.ExtraAction.PAUSE_CUR) {
            var layer = this.getLayer(layerType);
            if (layer.children.length > 0) {
              var curView = layer.children[layer.children.length - 1].getComponent(BaseView_1.BaseView);
              curView.onPause();
            }
          } else if (subAct == ViewConst_1.ViewConst.ExtraAction.RESUME_LAST) {
            var layer = this.getLayer(layerType);
            if (layer.children.length > 1) {
              var curView = layer.children[layer.children.length - 2].getComponent(BaseView_1.BaseView);
              curView.onResume();
            }
          }
        }
      };
      ViewManager.prototype.$onViewOpen = function(viewObj) {
        var viewName = viewObj.viewName;
        LogUtil_1.LogUtil.info("GameViewer", "onViewOpen -> viewName : " + viewName);
        var viewConf = ViewConst_1.ViewConst.ViewConf[viewName];
        if (!viewConf) return;
        var layerType = viewConf.layer;
        var viewList = this._viewOpenDict[layerType];
        viewList || (viewList = this._viewOpenDict[layerType] = []);
        viewList.push(viewObj);
        this.checkExtraAction(viewObj, ViewConst_1.ViewConst.NormalAction.OPEN);
      };
      ViewManager.prototype.$onViewClose = function(viewObj) {
        var viewName = viewObj.viewName;
        LogUtil_1.LogUtil.info("GameViewer", "onViewClose -> viewName : " + viewName);
        var viewConf = ViewConst_1.ViewConst.ViewConf[viewName];
        if (!viewConf) return;
        var layerType = viewConf.layer;
        var viewList = this._viewOpenDict[layerType];
        if (viewList) for (var index = 0, len = viewList.length; index < len; index++) {
          var element = viewList[index];
          if (element === viewObj) {
            viewList.splice(index, 1);
            break;
          }
        }
        this.checkExtraAction(viewObj, ViewConst_1.ViewConst.NormalAction.CLOSE);
      };
      ViewManager.prototype.$onViewShow = function(viewObj) {
        var viewName = viewObj.viewName;
        LogUtil_1.LogUtil.info("GameViewer", "onViewShow -> viewName : " + viewName);
        viewObj.updateUI();
        this.checkExtraAction(viewObj, ViewConst_1.ViewConst.NormalAction.SHOW);
      };
      ViewManager.prototype.$onViewHide = function(viewObj) {
        var viewName = viewObj.viewName;
        LogUtil_1.LogUtil.info("GameViewer", "onViewHide -> viewName : " + viewName);
        this.checkExtraAction(viewObj, ViewConst_1.ViewConst.NormalAction.HIDE);
      };
      ViewManager.prototype.isTopView = function(viewName, isCur, exceptLayers, exceptViews) {
        var view = this.getOpenView(viewName);
        if (view) {
          var layer = this.getViewLayerType(viewName);
          var topView = void 0;
          topView = isCur ? this.getTopView(layer, exceptLayers, exceptViews) : this.getTopView(null, exceptLayers, exceptViews);
          if (topView && topView.viewName == viewName) return view;
        }
        return null;
      };
      ViewManager.prototype.getTopView = function(layerType, exceptLayers, exceptViews) {
        if (null != layerType && layerType >= 0) {
          var layer = this.getLayer(layerType);
          for (var num = layer.children.length - 1; num >= 0; num--) {
            var view = layer.children[num].getComponent(BaseView_1.BaseView);
            if (view && !(exceptViews && -1 < exceptViews.indexOf(view.viewName)) && view.node.active) return view;
          }
        } else for (layerType = ViewConst_1.ViewConst.LayerType.ERROR; layerType >= 0; layerType--) if (!(exceptLayers && -1 < exceptLayers.indexOf(layerType)) && (view = this.getTopView(layerType, exceptLayers, exceptViews))) return view;
      };
      ViewManager.prototype.showWaitView = function(waitTip, time) {
        void 0 === time && (time = 0);
        if (this.waitObj && this.waitObj.isValid) {
          this.waitObj.active = true;
          this.waitObj.getComponent(WaitingUI_1.WaitingUI).initUI(waitTip, time);
        } else {
          this.waitObj = cc.instantiate(this.waitPrefab);
          var layer = GameGlobal_1.GameGlobal.Viewer.getLayer(ViewConst_1.ViewConst.LayerType.LOADING);
          layer.addChild(this.waitObj);
          this.waitObj.active = true;
          this.waitObj.getComponent(WaitingUI_1.WaitingUI).initUI(waitTip, time);
        }
      };
      ViewManager.prototype.hideWaitView = function() {
        this.waitObj && this.waitObj.isValid && (this.waitObj.active = false);
      };
      ViewManager.prototype.showLoadingUI = function(taskList) {
        var _this = this;
        this.loadingObj && this.loadingObj.isValid || GameGlobal_1.GameGlobal.Resource.loadRes("prefabs/LoadingView", cc.Prefab, null, function(error, prefab) {
          if (!error) {
            _this.loadingObj = cc.instantiate(prefab);
            GameGlobal_1.GameGlobal.gameRoot.addChild(_this.loadingObj);
            var loadUI = _this.loadingObj.getComponent(LoadingUI_1.LoadingUI);
            prefab.addRef();
            loadUI.prefab = prefab;
            loadUI.initUI(taskList);
          }
        });
      };
      ViewManager.prototype.closeLoadingUI = function() {
        if (this.loadingObj && this.loadingObj.isValid) {
          this.loadingObj.destroy();
          this.loadingObj = null;
        }
      };
      ViewManager.prototype.ring = function() {
        var _this = this;
        var layer = this.getLayer(ViewConst_1.ViewConst.LayerType.MIDDLE);
        this._bRing && cc.Tween.stopAllByTarget(layer);
        this._bRing = true;
        var widget = layer.getComponent(cc.Widget);
        widget && widget.destroy();
        var tw0 = cc.tween(layer).to(.1, {
          position: new cc.Vec3(-5, -8, 0)
        });
        var tw1 = cc.tween(layer).to(.1, {
          position: new cc.Vec3(7, 8, 0)
        });
        var tw2 = cc.tween(layer).to(.1, {
          position: new cc.Vec3(-3, -6, 0)
        });
        var tw3 = cc.tween(layer).to(.1, {
          position: new cc.Vec3(9, 6, 0)
        });
        var tw4 = cc.tween(layer).to(.1, {
          position: new cc.Vec3(-2, 4, 0)
        });
        var tw5 = cc.tween(layer).to(.1, {
          position: new cc.Vec3(3, -4, 0)
        });
        var tw6 = cc.tween(layer).to(.1, {
          position: new cc.Vec3(-1, 2, 0)
        });
        var tw7 = cc.tween(layer).to(.1, {
          position: new cc.Vec3(1, -2, 0)
        });
        var tw8 = cc.tween(layer).to(.1, {
          position: new cc.Vec3(0, 0, 0)
        });
        var tw = cc.tween(layer).sequence(tw0, tw1, tw2, tw3, tw4, tw5, tw6, tw7, tw8);
        tw = cc.tween(layer).repeat(1, tw).call(function() {
          cc.Tween.stopAllByTarget(layer);
          layer.setPosition(0, 0);
          _this._bRing = false;
          widget = layer.addComponent(cc.Widget);
          widget.left = widget.right = widget.top = widget.bottom = 0;
        }).start();
      };
      ViewManager.prototype.getCurrentView = function() {
        var layer = this.getLayer(ViewConst_1.ViewConst.LayerType.MIDDLE);
        if (layer.children.length > 0) return layer.children[layer.children.length - 1];
      };
      ViewManager.TAG = "ViewManager";
      return ViewManager;
    }(Singleton_1.Singleton);
    exports.ViewManager = ViewManager;
    cc._RF.pop();
  }, {
    "../GameGlobal": "GameGlobal",
    "../base/BaseView": "BaseView",
    "../base/Singleton": "Singleton",
    "../component/LoadingUI": "LoadingUI",
    "../component/WaitingUI": "WaitingUI",
    "../const/ViewConst": "ViewConst",
    "../utils/LogUtil": "LogUtil"
  } ],
  WJAssembler2D: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "07217Y67PhOrZzOrof3eelb", "WJAssembler2D");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var WJAssembler2D = function(_super) {
      __extends(WJAssembler2D, _super);
      function WJAssembler2D() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.verticesCount = 4;
        _this.indicesCount = 6;
        _this.floatsPerVert = 5;
        _this.uvOffset = 2;
        _this.colorOffset = 4;
        _this._renderData = null;
        _this._local = null;
        return _this;
      }
      WJAssembler2D.prototype.init = function(comp) {
        _super.prototype.init.call(this, comp);
        this._renderData = new cc.RenderData();
        this._renderData.init(this);
        this.initLocal();
        this.initData(comp);
      };
      Object.defineProperty(WJAssembler2D.prototype, "verticesFloats", {
        get: function() {
          return this.verticesCount * this.floatsPerVert;
        },
        enumerable: false,
        configurable: true
      });
      WJAssembler2D.prototype.initData = function(comp) {
        var data = this._renderData;
        data.createQuadData(0, this.verticesFloats, this.indicesCount);
      };
      WJAssembler2D.prototype.initLocal = function() {
        this._local = [];
        this._local.length = 4;
      };
      WJAssembler2D.prototype.updateColor = function(comp, color) {
        var uintVerts = this._renderData.uintVDatas[0];
        if (!uintVerts) return;
        color = null != color ? color : comp.node.color._val;
        var floatsPerVert = this.floatsPerVert;
        var colorOffset = this.colorOffset;
        for (var i = colorOffset, l = uintVerts.length; i < l; i += floatsPerVert) uintVerts[i] = color;
      };
      WJAssembler2D.prototype.getBuffer = function() {
        return cc.renderer._handle._meshBuffer;
      };
      WJAssembler2D.prototype.updateWorldVerts = function(comp) {
        false;
        this.updateWorldVertsWebGL(comp);
      };
      WJAssembler2D.prototype.updateWorldVertsWebGL = function(comp) {
        var local = this._local;
        var verts = this._renderData.vDatas[0];
        var matrix = comp.node._worldMatrix;
        var matrixm = matrix.m, a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5], tx = matrixm[12], ty = matrixm[13];
        var vl = local[0], vr = local[2], vb = local[1], vt = local[3];
        var justTranslate = 1 === a && 0 === b && 0 === c && 1 === d;
        var index = 0;
        var floatsPerVert = this.floatsPerVert;
        if (justTranslate) {
          verts[index] = vl + tx;
          verts[index + 1] = vb + ty;
          index += floatsPerVert;
          verts[index] = vr + tx;
          verts[index + 1] = vb + ty;
          index += floatsPerVert;
          verts[index] = vl + tx;
          verts[index + 1] = vt + ty;
          index += floatsPerVert;
          verts[index] = vr + tx;
          verts[index + 1] = vt + ty;
        } else {
          var al = a * vl, ar = a * vr, bl = b * vl, br = b * vr, cb = c * vb, ct = c * vt, db = d * vb, dt = d * vt;
          verts[index] = al + cb + tx;
          verts[index + 1] = bl + db + ty;
          index += floatsPerVert;
          verts[index] = ar + cb + tx;
          verts[index + 1] = br + db + ty;
          index += floatsPerVert;
          verts[index] = al + ct + tx;
          verts[index + 1] = bl + dt + ty;
          index += floatsPerVert;
          verts[index] = ar + ct + tx;
          verts[index + 1] = br + dt + ty;
        }
      };
      WJAssembler2D.prototype.updateWorldVertsNative = function(comp) {
        var local = this._local;
        var verts = this._renderData.vDatas[0];
        var floatsPerVert = this.floatsPerVert;
        var vl = local[0], vr = local[2], vb = local[1], vt = local[3];
        var index = 0;
        verts[index] = vl;
        verts[index + 1] = vb;
        index += floatsPerVert;
        verts[index] = vr;
        verts[index + 1] = vb;
        index += floatsPerVert;
        verts[index] = vl;
        verts[index + 1] = vt;
        index += floatsPerVert;
        verts[index] = vr;
        verts[index + 1] = vt;
      };
      WJAssembler2D.prototype.packToDynamicAtlas = function(comp, frame) {
        false;
        if (!frame._original && cc.dynamicAtlasManager && frame._texture.packable) {
          var packedFrame = cc.dynamicAtlasManager.insertSpriteFrame(frame);
          packedFrame && frame._setDynamicAtlasFrame(packedFrame);
        }
        var material = comp._materials[0];
        if (!material) return;
        if (material.getProperty("texture") !== frame._texture) {
          comp._vertsDirty = true;
          comp._activateMaterial();
        }
      };
      WJAssembler2D.prototype.updateUVs = function(comp) {
        var uv = [ 0, 0, 1, 0, 0, 1, 1, 1 ];
        var uvOffset = this.uvOffset;
        var floatsPerVert = this.floatsPerVert;
        var verts = this._renderData.vDatas[0];
        for (var i = 0; i < 4; i++) {
          var srcOffset = 2 * i;
          var dstOffset = floatsPerVert * i + uvOffset;
          verts[dstOffset] = uv[srcOffset];
          verts[dstOffset + 1] = uv[srcOffset + 1];
        }
      };
      WJAssembler2D.prototype.updateVerts = function(comp) {
        var node = comp.node, cw = node.width, ch = node.height, appx = node.anchorX * cw, appy = node.anchorY * ch, l, b, r, t;
        l = -appx;
        b = -appy;
        r = cw - appx;
        t = ch - appy;
        var local = this._local;
        local[0] = l;
        local[1] = b;
        local[2] = r;
        local[3] = t;
        this.updateWorldVerts(comp);
      };
      WJAssembler2D.prototype.updateRenderData = function(comp) {
        if (comp._vertsDirty) {
          this.updateUVs(comp);
          this.updateVerts(comp);
          comp._vertsDirty = false;
        }
      };
      return WJAssembler2D;
    }(cc.Assembler);
    exports.default = WJAssembler2D;
    cc._RF.pop();
  }, {} ],
  WJMultiAssembler: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "978b7WO3CdFpKYYTt4QHKoj", "WJMultiAssembler");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var WJAssembler2D_1 = require("WJAssembler2D");
    var WJMultiAssembler = function(_super) {
      __extends(WJMultiAssembler, _super);
      function WJMultiAssembler() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.segCount = 1;
        _this.m_segList = [];
        _this.m_mainSegLen = 13;
        _this.m_lightningLen = 800;
        _this.m_endPos = cc.v2(800, 0);
        _this.offset_factor = .3;
        return _this;
      }
      Object.defineProperty(WJMultiAssembler.prototype, "verticesFloats", {
        get: function() {
          return this.verticesCount * this.floatsPerVert * this.segCount;
        },
        enumerable: false,
        configurable: true
      });
      WJMultiAssembler.prototype.initData = function() {
        this.genSegs();
        var data = this._renderData;
        var _verticesFloats = this.verticesCount * this.floatsPerVert * this.m_segList.length;
        data.createQuadData(0, _verticesFloats, this.indicesCount * this.m_segList.length);
      };
      WJMultiAssembler.prototype.initLocal = function() {
        this._local = [];
        this._local.length = 4 * this.segCount;
      };
      WJMultiAssembler.prototype.updateRenderData = function(sprite) {
        var frame = sprite._spriteFrame;
        if (!frame) return;
        this.packToDynamicAtlas(sprite, frame);
        if (sprite._vertsDirty) {
          this.updateUVs(sprite);
          this.updateVerts(sprite);
          sprite._vertsDirty = false;
        }
      };
      WJMultiAssembler.prototype.fillBuffers = function(comp, renderer) {
        renderer.worldMatDirty && this.updateWorldVerts(comp);
        var renderData = this._renderData;
        var vData = renderData.vDatas[0];
        var iData = renderData.iDatas[0];
        var buffer = this.getBuffer();
        var offsetInfo = buffer.request(this.verticesCount * this.m_segList.length, this.indicesCount * this.m_segList.length);
        var vertexOffset = offsetInfo.byteOffset >> 2, vbuf = buffer._vData;
        vData.length + vertexOffset > vbuf.length ? vbuf.set(vData.subarray(0, vbuf.length - vertexOffset), vertexOffset) : vbuf.set(vData, vertexOffset);
        var ibuf = buffer._iData, indiceOffset = offsetInfo.indiceOffset, vertexId = offsetInfo.vertexOffset;
        for (var i = 0, l = iData.length; i < l; i++) ibuf[indiceOffset++] = vertexId + iData[i];
      };
      WJMultiAssembler.prototype.genVerts = function() {
        var local = this._local;
        for (var i = 0; i < this.m_segList.length; i++) {
          var segInfo = this.m_segList[i];
          var segVec = segInfo[1].sub(segInfo[0]);
          var segMidPoint = cc.v2(.5 * (segInfo[0].x + segInfo[1].x), .5 * (segInfo[0].y + segInfo[1].y));
          var outNormal = cc.v2(segVec.y, -segVec.x).normalize();
          var segWidth = this.m_mainSegLen;
          var p0 = segInfo[0].add(outNormal.mul(segWidth / 2));
          var p1 = segInfo[1].add(outNormal.mul(segWidth / 2));
          var p2 = segInfo[0].add(outNormal.mul(-segWidth / 2));
          var p3 = segInfo[1].add(outNormal.mul(-segWidth / 2));
          local[4 * i] = segMidPoint.add(p0.sub(segMidPoint).mul(8.05));
          local[4 * i + 1] = segMidPoint.add(p1.sub(segMidPoint).mul(8.05));
          local[4 * i + 2] = segMidPoint.add(p2.sub(segMidPoint).mul(8.05));
          local[4 * i + 3] = segMidPoint.add(p3.sub(segMidPoint).mul(8.05));
        }
      };
      WJMultiAssembler.prototype.calcSegCount = function() {
        var count = 0;
        this.m_lightningLen = this.m_endPos.mag();
        var totalLen = this.m_lightningLen;
        while (totalLen > this.m_mainSegLen) {
          totalLen /= 2;
          count++;
        }
        this.segCount = count;
      };
      WJMultiAssembler.prototype.genSegs = function() {
        this.calcSegCount();
        this.m_segList = [];
        var segInfo = [ cc.v2(0, 0), this.m_endPos ];
        this.m_segList[this.m_segList.length] = segInfo;
        if (0 == this.segCount) return;
        this.m_segList = this.genSegsFromBranch(segInfo, this.segCount);
      };
      WJMultiAssembler.prototype.genSegsFromBranch = function(__branchSeg, __count) {
        var segList = [];
        __branchSeg && (segList[segList.length] = __branchSeg);
        for (var i = 1; i < __count + 1; i++) {
          var tmpList = [];
          for (var j = 0; j < segList.length; j++) {
            var segInfo = segList[j];
            if (segInfo) {
              var subSegs = this.splitSeg(segInfo, i);
              for (var k = 0; k < subSegs.length; k++) tmpList[tmpList.length] = subSegs[k];
            }
          }
          segList = tmpList;
        }
        return segList;
      };
      WJMultiAssembler.prototype.splitSeg = function(__seg, __createID) {
        var segList = [];
        var segVec = __seg[1].sub(__seg[0]);
        var segLen = segVec.mag();
        var maxOffest = segLen * this.offset_factor;
        var offSet = Math.random() * maxOffest - maxOffest / 2;
        var outNormal = cc.v2(segVec.y, -segVec.x).normalize().mul(offSet);
        var segMidPoint = cc.v2(.5 * (__seg[0].x + __seg[1].x), .5 * (__seg[0].y + __seg[1].y));
        var midPos = segMidPoint.add(outNormal);
        var seg0 = [ __seg[0], midPos ];
        var seg1 = [ midPos, __seg[1] ];
        segList[segList.length] = seg0;
        segList[segList.length] = seg1;
        return segList;
      };
      WJMultiAssembler.prototype.updateVerts = function(sprite) {
        this.genVerts();
        this.updateWorldVerts(sprite);
      };
      WJMultiAssembler.prototype.updateUVs = function(comp) {
        var uv = comp._spriteFrame.uv;
        var uvOffset = this.uvOffset;
        var floatsPerVert = this.floatsPerVert;
        var verts = this._renderData.vDatas[0];
        for (var i = 0; i < 4 * this.m_segList.length; i++) {
          var srcOffset = 2 * i % 8;
          var dstOffset = floatsPerVert * i + uvOffset;
          verts[dstOffset] = uv[srcOffset];
          verts[dstOffset + 1] = uv[srcOffset + 1];
        }
      };
      WJMultiAssembler.prototype.updateWorldVerts = function(comp) {
        false;
        this.updateWorldVertsWebGL(comp);
      };
      WJMultiAssembler.prototype.updateWorldVertsWebGL = function(comp) {
        var matrix = comp.node._worldMatrix;
        var matrixm = matrix.m, a = matrixm[0], b = matrixm[1], c = matrixm[4], d = matrixm[5], tx = matrixm[12], ty = matrixm[13];
        var worldIndex = 0;
        var local = this._local;
        var world = this._renderData.vDatas[0];
        var floatsPerVert = this.floatsPerVert;
        for (var count = 0; count < this.m_segList.length; count++) for (var i = 0; i < 4; i++) {
          var p0 = local[4 * count + i];
          world[worldIndex] = p0.x * a + p0.y * c + tx;
          world[worldIndex + 1] = p0.x * b + p0.y * d + ty;
          worldIndex += floatsPerVert;
        }
      };
      WJMultiAssembler.prototype.updateWorldVertsNative = function(comp) {
        var local = this._local;
        var world = this._renderData.vDatas[0];
        var floatsPerVert = this.floatsPerVert;
        var worldIndex = 0;
        for (var count = 0; count < this.m_segList.length; count++) for (var i = 0; i < 4; i++) {
          var p0 = local[4 * count + i];
          world[worldIndex] = p0.x;
          world[worldIndex + 1] = p0.y;
          worldIndex += floatsPerVert;
        }
      };
      return WJMultiAssembler;
    }(WJAssembler2D_1.default);
    exports.default = WJMultiAssembler;
    cc._RF.pop();
  }, {
    WJAssembler2D: "WJAssembler2D"
  } ],
  WaitingUI: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "5e372oiXxFNxKYf7jVf5Anb", "WaitingUI");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.WaitingUI = void 0;
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var WaitingUI = function(_super) {
      __extends(WaitingUI, _super);
      function WaitingUI() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.tip = "";
        return _this;
      }
      WaitingUI.prototype.onLoad = function() {
        this.animSp = this.node.getChildByName("animSp");
        this.waitTipNode = this.node.getChildByName("waitTip");
        this.rect = this.node.getChildByName("rect");
        this.waitTip = this.waitTipNode.getComponent(cc.Label);
        this.waitTip.string = this.tip;
        cc.tween(this.animSp).by(1, {
          angle: 180
        }).repeatForever().start();
      };
      WaitingUI.prototype.initUI = function(tip, time) {
        var _this = this;
        void 0 === time && (time = 0);
        this.tip = tip;
        this.waitTip && (this.waitTip.string = this.tip);
        if (time > 0) {
          this.animSp.active = false;
          this.waitTipNode.active = false;
          this.rect.active = false;
          this.scheduleOnce(function() {
            _this.animSp.active = true;
            _this.waitTipNode.active = true;
            _this.rect.active = true;
          }, time);
        } else {
          this.animSp.active = true;
          this.waitTipNode.active = true;
          this.rect.active = true;
        }
      };
      WaitingUI.prototype.onDisable = function() {
        this.unscheduleAllCallbacks();
      };
      WaitingUI = __decorate([ ccclass ], WaitingUI);
      return WaitingUI;
    }(cc.Component);
    exports.WaitingUI = WaitingUI;
    cc._RF.pop();
  }, {} ],
  XXTEA: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f2297Ur+v5Nb7Yb6oOsJ8Lo", "XXTEA");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.XXTEA = void 0;
    var XXTEA = function() {
      function XXTEA() {}
      XXTEA.toUint8Array = function(v, includeLength) {
        var length = v.length;
        var n = length << 2;
        if (includeLength) {
          var m = v[length - 1];
          n -= 4;
          if (m < n - 3 || m > n) return null;
          n = m;
        }
        var bytes = new Uint8Array(n);
        for (var i = 0; i < n; ++i) bytes[i] = v[i >> 2] >> ((3 & i) << 3);
        return bytes;
      };
      XXTEA.toUint32Array = function(bytes, includeLength) {
        var length = bytes.length;
        var n = length >> 2;
        0 !== (3 & length) && ++n;
        var v;
        if (includeLength) {
          v = new Uint32Array(n + 1);
          v[n] = length;
        } else v = new Uint32Array(n);
        for (var i = 0; i < length; ++i) v[i >> 2] |= bytes[i] << ((3 & i) << 3);
        return v;
      };
      XXTEA.mx = function(sum, y, z, p, e, k) {
        return (z >>> 5 ^ y << 2) + (y >>> 3 ^ z << 4) ^ (sum ^ y) + (k[3 & p ^ e] ^ z);
      };
      XXTEA.fixk = function(k) {
        if (k.length < 16) {
          var key = new Uint8Array(16);
          key.set(k);
          k = key;
        }
        return k;
      };
      XXTEA.encryptUint32Array = function(v, k) {
        var length = v.length;
        var n = length - 1;
        var y, z, sum, e, p, q;
        z = v[n];
        sum = 0;
        for (q = 0 | Math.floor(6 + 52 / length); q > 0; --q) {
          sum += this.delta;
          e = sum >>> 2 & 3;
          for (p = 0; p < n; ++p) {
            y = v[p + 1];
            z = v[p] += this.mx(sum, y, z, p, e, k);
          }
          y = v[0];
          z = v[n] += this.mx(sum, y, z, p, e, k);
        }
        return v;
      };
      XXTEA.decryptUint32Array = function(v, k) {
        var length = v.length;
        var n = length - 1;
        var y, z, sum, e, p, q;
        y = v[0];
        q = Math.floor(6 + 52 / length);
        for (sum = q * this.delta; 0 !== sum; sum -= this.delta) {
          e = sum >>> 2 & 3;
          for (p = n; p > 0; --p) {
            z = v[p - 1];
            y = v[p] -= this.mx(sum, y, z, p, e, k);
          }
          z = v[n];
          y = v[0] -= this.mx(sum, y, z, p, e, k);
        }
        return v;
      };
      XXTEA.toBytes = function(str) {
        var n = str.length;
        var bytes = new Uint8Array(3 * n);
        var length = 0;
        for (var i = 0; i < n; i++) {
          var codeUnit = str.charCodeAt(i);
          if (codeUnit < 128) bytes[length++] = codeUnit; else if (codeUnit < 2048) {
            bytes[length++] = 192 | codeUnit >> 6;
            bytes[length++] = 128 | 63 & codeUnit;
          } else {
            if (!(codeUnit < 55296 || codeUnit > 57343)) {
              if (i + 1 < n) {
                var nextCodeUnit = str.charCodeAt(i + 1);
                if (codeUnit < 56320 && 56320 <= nextCodeUnit && nextCodeUnit <= 57343) {
                  var rune = 65536 + ((1023 & codeUnit) << 10 | 1023 & nextCodeUnit);
                  bytes[length++] = 240 | rune >> 18;
                  bytes[length++] = 128 | rune >> 12 & 63;
                  bytes[length++] = 128 | rune >> 6 & 63;
                  bytes[length++] = 128 | 63 & rune;
                  i++;
                  continue;
                }
              }
              throw new Error("Malformed string");
            }
            bytes[length++] = 224 | codeUnit >> 12;
            bytes[length++] = 128 | codeUnit >> 6 & 63;
            bytes[length++] = 128 | 63 & codeUnit;
          }
        }
        return bytes.subarray(0, length);
      };
      XXTEA.toShortString = function(bytes, n) {
        var charCodes = new Uint16Array(n);
        var i = 0, off = 0;
        for (var len = bytes.length; i < n && off < len; i++) {
          var unit = bytes[off++];
          switch (unit >> 4) {
           case 0:
           case 1:
           case 2:
           case 3:
           case 4:
           case 5:
           case 6:
           case 7:
            charCodes[i] = unit;
            break;

           case 12:
           case 13:
            if (!(off < len)) throw new Error("Unfinished UTF-8 octet sequence");
            charCodes[i] = (31 & unit) << 6 | 63 & bytes[off++];
            break;

           case 14:
            if (!(off + 1 < len)) throw new Error("Unfinished UTF-8 octet sequence");
            charCodes[i] = (15 & unit) << 12 | (63 & bytes[off++]) << 6 | 63 & bytes[off++];
            break;

           case 15:
            if (!(off + 2 < len)) throw new Error("Unfinished UTF-8 octet sequence");
            var rune = ((7 & unit) << 18 | (63 & bytes[off++]) << 12 | (63 & bytes[off++]) << 6 | 63 & bytes[off++]) - 65536;
            if (!(0 <= rune && rune <= 1048575)) throw new Error("Character outside valid Unicode range: 0x" + rune.toString(16));
            charCodes[i++] = rune >> 10 & 1023 | 55296;
            charCodes[i] = 1023 & rune | 56320;
            break;

           default:
            throw new Error("Bad UTF-8 encoding 0x" + unit.toString(16));
          }
        }
        i < n && (charCodes = charCodes.subarray(0, i));
        return String.fromCharCode.apply(String, charCodes);
      };
      XXTEA.toLongString = function(bytes, n) {
        var buf = [];
        var charCodes = new Uint16Array(32768);
        var i = 0, off = 0;
        for (var len = bytes.length; i < n && off < len; i++) {
          var unit = bytes[off++];
          switch (unit >> 4) {
           case 0:
           case 1:
           case 2:
           case 3:
           case 4:
           case 5:
           case 6:
           case 7:
            charCodes[i] = unit;
            break;

           case 12:
           case 13:
            if (!(off < len)) throw new Error("Unfinished UTF-8 octet sequence");
            charCodes[i] = (31 & unit) << 6 | 63 & bytes[off++];
            break;

           case 14:
            if (!(off + 1 < len)) throw new Error("Unfinished UTF-8 octet sequence");
            charCodes[i] = (15 & unit) << 12 | (63 & bytes[off++]) << 6 | 63 & bytes[off++];
            break;

           case 15:
            if (!(off + 2 < len)) throw new Error("Unfinished UTF-8 octet sequence");
            var rune = ((7 & unit) << 18 | (63 & bytes[off++]) << 12 | (63 & bytes[off++]) << 6 | 63 & bytes[off++]) - 65536;
            if (!(0 <= rune && rune <= 1048575)) throw new Error("Character outside valid Unicode range: 0x" + rune.toString(16));
            charCodes[i++] = rune >> 10 & 1023 | 55296;
            charCodes[i] = 1023 & rune | 56320;
            break;

           default:
            throw new Error("Bad UTF-8 encoding 0x" + unit.toString(16));
          }
          if (i >= 32766) {
            var size = i + 1;
            buf.push(String.fromCharCode.apply(String, charCodes.subarray(0, size)));
            n -= size;
            i = -1;
          }
        }
        i > 0 && buf.push(String.fromCharCode.apply(String, charCodes.subarray(0, i)));
        return buf.join("");
      };
      XXTEA.toString = function(bytes) {
        var n = bytes.length;
        if (0 === n) return "";
        return n < 32767 ? this.toShortString(bytes, n) : this.toLongString(bytes, n);
      };
      XXTEA.encrypt = function(data, key) {
        "string" === typeof data && (data = this.toBytes(data));
        "string" === typeof key && (key = this.toBytes(key));
        if (void 0 === data || null === data || 0 === data.length) return data;
        return this.toUint8Array(this.encryptUint32Array(this.toUint32Array(data, true), this.toUint32Array(this.fixk(key), false)), false);
      };
      XXTEA.encryptToString = function(data, key) {
        return this.Uint8ArraytoBase64(this.encrypt(data, key));
      };
      XXTEA.decrypt = function(data, key) {
        "string" === typeof data && (data = this.Base64ToUint8Array(data));
        "string" === typeof key && (key = this.toBytes(key));
        if (void 0 === data || null === data || 0 === data.length) return data;
        return this.toUint8Array(this.decryptUint32Array(this.toUint32Array(data, false), this.toUint32Array(this.fixk(key), false)), true);
      };
      XXTEA.decryptToString = function(data, key) {
        return this.toString(this.decrypt(data, key));
      };
      XXTEA.Uint8ArraytoBase64 = function(u8) {
        return btoa(String.fromCharCode.apply(null, u8));
      };
      XXTEA.Base64ToUint8Array = function(b64) {
        return new Uint8Array(atob(b64).split("").map(function(c) {
          return c.charCodeAt(0);
        }));
      };
      XXTEA.delta = 2654435769;
      return XXTEA;
    }();
    exports.XXTEA = XXTEA;
    cc._RF.pop();
  }, {} ],
  YlbApplyView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "7662dZG3r9DWrbzOBnATapu", "YlbApplyView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const BaseWindows_1 = require("../../../framework/base/BaseWindows");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const UIUtil_1 = require("../../../framework/utils/UIUtil");
    const HallHttpConst_1 = require("../../const/HallHttpConst");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let YlbApplyView = class YlbApplyView extends BaseWindows_1.BaseWindows {
      constructor() {
        super(...arguments);
        this.isClickRect = true;
      }
      initUI(...args) {
        super.initUI(...args);
        let data = args[0];
        this.data = data;
        this.initSelfUI(data);
      }
      initSelfUI(data) {
        let availableForPurchase = data.availableForPurchase;
        let initialInvestment = data.initialInvestment;
        let Annualized = data.considerAnnualization;
        this.txtCurQuota.string = availableForPurchase + "";
        this.txtAppQuota.string = initialInvestment + "";
        this.txtAnnualized.string = Annualized + "%";
        this.txtStartAmount.string = GameGlobal_1.GameGlobal.Lang.t("Ylb.HeadStartAmount") + initialInvestment;
        this.txtBuyAmount.string = "";
      }
      onBuyResp(data) {
        let bSucess = false;
        if (data && 200 == data.code) {
          data = data.data;
          bSucess = data.purchaseStatus;
        }
        this.btnBuy.interactable = true;
        UIUtil_1.UIUtil.setGray(this.btnBuy.node, !this.btnBuy.interactable);
        if (bSucess) {
          GameGlobal_1.GameGlobal.TipManager.showTip("Buy Sucess");
          GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.YLB_APPLY_VIEW);
        } else GameGlobal_1.GameGlobal.TipManager.showTip("Buy Error");
      }
      onBtnClick(event, customEventData) {
        if (0 == customEventData) GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.YLB_APPLY_VIEW); else if (1 == customEventData) {
          let coinStr = this.txtBuyAmount.string;
          let coin = Number.parseInt(coinStr);
          let availableForPurchase = this.data.availableForPurchase;
          let initialInvestment = this.data.initialInvestment;
          let id = this.data.id;
          let info = GameGlobal_1.GameGlobal.DataManager.userInfo;
          let userCoin = info && info.coin ? info.coin : 0;
          if (coin >= initialInvestment && coin <= availableForPurchase && coin <= userCoin) {
            this.btnBuy.interactable = false;
            UIUtil_1.UIUtil.setGray(this.btnBuy.node, !this.btnBuy.interactable);
            GameGlobal_1.GameGlobal.Http.post(HallHttpConst_1.default.PostMoneyBuy, {
              coin: coin,
              id: id
            }, this.onBuyResp, this);
          } else coin > userCoin ? GameGlobal_1.GameGlobal.TipManager.showTip("You have not " + coin + " coin") : coin < initialInvestment ? GameGlobal_1.GameGlobal.TipManager.showTip("You have not start amount") : coin > availableForPurchase ? GameGlobal_1.GameGlobal.TipManager.showTip("subscripbe to much") : isNaN(coin) && GameGlobal_1.GameGlobal.TipManager.showTip("input yout subscripbe amount");
        } else if (2 == customEventData) {
          let info = GameGlobal_1.GameGlobal.DataManager.userInfo;
          let userCoin = info && info.coin ? info.coin : 0;
          let availableForPurchase = this.data.availableForPurchase;
          this.txtBuyAmount.string = userCoin > availableForPurchase ? availableForPurchase : userCoin;
        }
      }
      onEnterBegin(event, customEventData) {}
    };
    YlbApplyView.TAG = "YlbApplyView";
    __decorate([ property(cc.Label) ], YlbApplyView.prototype, "txtCurQuota", void 0);
    __decorate([ property(cc.Label) ], YlbApplyView.prototype, "txtAppQuota", void 0);
    __decorate([ property(cc.Label) ], YlbApplyView.prototype, "txtAnnualized", void 0);
    __decorate([ property(cc.EditBox) ], YlbApplyView.prototype, "txtBuyAmount", void 0);
    __decorate([ property(cc.Button) ], YlbApplyView.prototype, "btnBuy", void 0);
    __decorate([ property(cc.Label) ], YlbApplyView.prototype, "txtStartAmount", void 0);
    YlbApplyView = __decorate([ ccclass ], YlbApplyView);
    exports.default = YlbApplyView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../../framework/utils/UIUtil": "UIUtil",
    "../../const/HallHttpConst": "HallHttpConst"
  } ],
  YlbInstructionView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "27323iN5P9FrI1fh4nSFGWN", "YlbInstructionView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const BaseWindows_1 = require("../../../framework/base/BaseWindows");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let YlbInstructionView = class YlbInstructionView extends BaseWindows_1.BaseWindows {
      constructor() {
        super(...arguments);
        this.isClickRect = true;
      }
      initUI(...args) {
        super.initUI(...args);
        this.initSelfUI();
      }
      initSelfUI() {}
      onBtnClick(event, customEventData) {
        0 == customEventData ? GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.YLB_INSTRUCTION_VIEW) : 1 == customEventData;
      }
      onEnterBegin(event, customEventData) {}
    };
    YlbInstructionView.TAG = "YlbInstructionView";
    YlbInstructionView = __decorate([ ccclass ], YlbInstructionView);
    exports.default = YlbInstructionView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseWindows": "BaseWindows",
    "../../../framework/const/ViewConst": "ViewConst"
  } ],
  YlbView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "263e9A2utdNJaVzuIMUSauX", "YlbView");
    "use strict";
    var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
      var c = arguments.length, r = c < 3 ? target : null === desc ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
      if ("object" === typeof Reflect && "function" === typeof Reflect.decorate) r = Reflect.decorate(decorators, target, key, desc); else for (var i = decorators.length - 1; i >= 0; i--) (d = decorators[i]) && (r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r);
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    const BaseView_1 = require("../../../framework/base/BaseView");
    const EventConst_1 = require("../../../framework/const/EventConst");
    const ResConst_1 = require("../../../framework/const/ResConst");
    const ViewConst_1 = require("../../../framework/const/ViewConst");
    const GameGlobal_1 = require("../../../framework/GameGlobal");
    const UIUtil_1 = require("../../../framework/utils/UIUtil");
    const HallHttpConst_1 = require("../../const/HallHttpConst");
    const {ccclass: ccclass, property: property} = cc._decorator;
    let YlbView = class YlbView extends BaseView_1.BaseView {
      constructor() {
        super(...arguments);
        this.rightRoots = [];
        this.warehouseList = [];
        this.warehouseIdx = 0;
        this.myCoinList = [];
        this.myCoinIdx = 0;
        this.historyList = [];
        this.historyIdx = 0;
      }
      initUI(...args) {
        super.initUI(...args);
        this.getDatas();
        this.initSelfUI();
      }
      addAllListeners() {
        super.addAllListeners();
        GameGlobal_1.GameGlobal.Eventer.addListener(EventConst_1.EventConst.EventId.REFLESH_YLB_MYCOINN, this.onRefleshMyCoin, this);
      }
      getDatas() {
        GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetMoneyHistoryLock, {
          page: 1,
          pageSize: 10
        }, this.onMoneyHistoryLockResp, this);
        GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetMoneyLockWarehouse, {
          page: 1,
          pageSize: 10
        }, this.onLockWarehouseResp, this);
        GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetMoneyMyCoin, {
          page: 1,
          pageSize: 10
        }, this.onMoneyMyCoinResp, this);
      }
      onRefleshMyCoin() {
        this.myCoinIdx = 0;
        this.myCoinList.length = 0;
        this.myCoinContent.removeAllChildren();
        GameGlobal_1.GameGlobal.Http.get(HallHttpConst_1.default.GetMoneyMyCoin, {
          page: 1,
          pageSize: 10
        }, this.onMoneyMyCoinResp, this);
      }
      onMoneyHistoryLockResp(data) {
        if (data && 200 == data.code) {
          data = data.data;
          if (data.list && data.list.length > 0) {
            this.historyList = this.historyList.concat(data.list);
            this.refleshHistoryLock();
          }
        }
      }
      onLockWarehouseResp(data) {
        if (data && 200 == data.code) {
          data = data.data;
          if (data.list && data.list.length > 0) {
            this.warehouseList = this.warehouseList.concat(data.list);
            this.refleshLockWarehouse();
          }
        }
      }
      onMoneyMyCoinResp(data) {
        if (data && 200 == data.code) {
          data = data.data;
          if (data.list && data.list.length > 0) {
            this.myCoinList = this.myCoinList.concat(data.list);
            this.refleshMyCoin();
          }
        }
      }
      refleshLockWarehouse() {
        let curIdx = this.wareHouseContent.childrenCount;
        for (let i = curIdx; i < this.warehouseList.length; i++) {
          let itemData = this.warehouseList[i];
          let item = cc.instantiate(this.wareHouseItemPre);
          item.addComponent(cc.Button);
          let idx = i;
          UIUtil_1.UIUtil.addClickListener(item, this.onWareHouseItemClick.bind(this, idx), this);
          this.wareHouseContent.addChild(item);
          let txtName = item.getChildByName("itemBg").getChildByName("txtProduct").getComponent(cc.Label);
          let txtAnnualization = item.getChildByName("itemBg").getChildByName("txtIncome").getComponent(cc.Label);
          let txtDuration = item.getChildByName("itemBg").getChildByName("txtTern").getComponent(cc.Label);
          let button = item.getChildByName("itemBg").getChildByName("btn");
          let txtOpt = button.getChildByName("txtOperate").getComponent(cc.Label);
          button.addComponent(cc.Button);
          UIUtil_1.UIUtil.addClickListener(button, this.onWareBtnClick.bind(this, idx), this);
          let status = itemData.status;
          let statusStr = 0 == status ? GameGlobal_1.GameGlobal.Lang.t("Ylb.Subscribe") : GameGlobal_1.GameGlobal.Lang.t("Ylb.SoldOut");
          txtDuration.string = itemData.duration + "days";
          txtName.string = itemData.name;
          txtAnnualization.string = itemData.considerAnnualization + "%";
          txtOpt.string = statusStr;
          let btnFrameName = 0 == status ? "hall_btn_bg_1" : "ylb-btn_bg_red";
          GameGlobal_1.GameGlobal.Resource.setFrame("", button, ResConst_1.ResConst.PLIST_PATH.HALL, btnFrameName);
          button.getComponent(cc.Button).interactable = 0 == status;
          let color = 0 == status ? new cc.Color(255, 255, 255) : new cc.Color(247, 73, 95);
          txtOpt.node.color = color;
          let outLine = txtOpt.node.getComponent(cc.LabelOutline);
          outLine && (outLine.enabled = 0 == status);
        }
        for (let i = 0; i < this.warehouseList.length; i++) {
          let item = this.wareHouseContent.children[i];
          let bg = item.getChildByName("bg");
          let bg1 = item.getChildByName("bg1");
          bg.active = i != this.warehouseIdx;
          bg1.active = !bg.active;
        }
        if (this.warehouseIdx < this.warehouseList.length && this.warehouseIdx < this.wareHouseContent.childrenCount) {
          let itemData = this.warehouseList[this.warehouseIdx];
          let availableCount = itemData.availableForPurchase;
          let annualization = itemData.considerAnnualization;
          let duration = itemData.duration;
          let initialInvestment = itemData.initialInvestment;
          let name = itemData.name;
          let redemptionPeriod = itemData.redemptionPeriod;
          let startAndRestTime = itemData.startAndRestTime;
          let status = itemData.status;
          let timeOfExpiration = itemData.timeOfExpiration;
          let timeOfPurchase = itemData.timeOfPurchase;
          let timeOfSettlement = itemData.timeOfSettlement;
          this.txtWareHouseAnnual.string = annualization + "%";
          this.txtWareHouseDuration.string = duration + "days";
          this.txtWareHouseState.string = status + "";
          this.txtWareHouseAvailSub.string = availableCount + "";
          this.txtWareHouseStartAmount.string = initialInvestment + "";
          this.txtWareHouseSubTime.string = timeOfPurchase + "";
          this.txtWareHouseInterestTime.string = startAndRestTime + "";
          this.txtWareHouseIncomeDis.string = "";
          this.txtWareHouseMaturityTime.string = timeOfExpiration + "";
          this.txtWareHouseSettleTime.string = timeOfSettlement + "";
          this.txtWareHouseRedempTime.string = redemptionPeriod + "";
        }
      }
      refleshMyCoin() {
        let curIdx = this.myCoinContent.childrenCount;
        for (let i = curIdx; i < this.myCoinList.length; i++) {
          let itemData = this.myCoinList[i];
          let item = cc.instantiate(this.myCoinItemPre);
          item.addComponent(cc.Button);
          let idx = i;
          UIUtil_1.UIUtil.addClickListener(item, this.onMyCoinItemClick.bind(this, idx), this);
          this.myCoinContent.addChild(item);
          let txtName = item.getChildByName("itemBg").getChildByName("txtProduct").getComponent(cc.Label);
          let txtAnnualization = item.getChildByName("itemBg").getChildByName("txtIncome").getComponent(cc.Label);
          let txtDuration = item.getChildByName("itemBg").getChildByName("txtTern").getComponent(cc.Label);
          let txtStatus = item.getChildByName("itemBg").getChildByName("txtStatus").getComponent(cc.Label);
          txtDuration.string = itemData.duration + "days";
          txtName.string = itemData.name;
          txtAnnualization.string = itemData.considerAnnualization + "%";
          let status = itemData.status;
          let statusStr = 0 == status ? GameGlobal_1.GameGlobal.Lang.t("Ylb.Progress") : GameGlobal_1.GameGlobal.Lang.t("Ylb.Redeemed");
          txtStatus.string = statusStr;
        }
        for (let i = 0; i < this.myCoinList.length; i++) {
          let item = this.myCoinContent.children[i];
          let bg = item.getChildByName("bg");
          let bg1 = item.getChildByName("bg1");
          bg.active = i != this.myCoinIdx;
          bg1.active = !bg.active;
        }
        if (this.myCoinIdx < this.myCoinList.length && this.myCoinIdx < this.wareHouseContent.childrenCount) {
          let itemData = this.myCoinList[this.myCoinIdx];
          let amountOfInput = itemData.amountOfInput;
          let considerAnnualization = itemData.considerAnnualization;
          let currentIncome = itemData.currentIncome;
          let duration = itemData.duration;
          let id = itemData.id;
          let incomeDistribution = itemData.incomeDistribution;
          let name = itemData.name;
          let redemptionPeriod = itemData.redemptionPeriod;
          let startAndRestTime = itemData.startAndRestTime;
          let status = itemData.status;
          let timeOfExpiration = itemData.timeOfExpiration;
          let timeOfPurchase = itemData.timeOfPurchase;
          let timeOfSettlement = itemData.timeOfSettlement;
          this.txtMycoinAnnual.string = considerAnnualization + "%";
          this.txtMycoinTerm.string = duration + "days";
          this.txtMycoinState.string = status + "";
          this.txtMycoinCurEarning.string = currentIncome + "";
          this.txtMycoinAmount.string = amountOfInput + "";
          this.txtMycoinPurchaseTime.string = timeOfPurchase;
          this.txtMycoinRiseTime.string = startAndRestTime;
          this.txtMycoinIncomeDis.string = incomeDistribution;
          this.txtMycoinMaturityTime.string = timeOfExpiration;
          this.txtMycoinSettleTime.string = timeOfSettlement;
          this.txtMycoinCycleTime.string = redemptionPeriod;
        }
      }
      refleshHistoryLock() {
        let curIdx = this.hisLockContent.childrenCount;
        for (let i = curIdx; i < this.historyList.length; i++) {
          let itemData = this.historyList[i];
          let item = cc.instantiate(this.HisLockItemPre);
          item.addComponent(cc.Button);
          let idx = i;
          UIUtil_1.UIUtil.addClickListener(item, this.onHistoryItemClick.bind(this, idx), this);
          this.hisLockContent.addChild(item);
          let txtName = item.getChildByName("itemBg").getChildByName("txtProduct").getComponent(cc.Label);
          let txtAnnualization = item.getChildByName("itemBg").getChildByName("txtIncome").getComponent(cc.Label);
          let txtDuration = item.getChildByName("itemBg").getChildByName("txtTern").getComponent(cc.Label);
          let txtStatus = item.getChildByName("itemBg").getChildByName("txtRedeemed").getComponent(cc.Label);
          txtName.string = itemData.name;
          txtAnnualization.string = itemData.considerAnnualization + "%";
          txtDuration.string = itemData.duration + "days";
          let status = itemData.status;
          let statusStr = 0 == status ? GameGlobal_1.GameGlobal.Lang.t("Ylb.Progress") : GameGlobal_1.GameGlobal.Lang.t("Ylb.Redeemed");
          txtStatus.string = statusStr;
        }
        for (let i = 0; i < this.historyList.length; i++) {
          let item = this.hisLockContent.children[i];
          let bg = item.getChildByName("bg");
          let bg1 = item.getChildByName("bg1");
          bg.active = i != this.historyIdx;
          bg1.active = !bg.active;
        }
        if (this.historyIdx < this.historyList.length && this.historyIdx < this.hisLockContent.childrenCount) {
          let itemData = this.historyList[this.historyIdx];
          let amountOfInput = itemData.amountOfInput;
          let considerAnnualization = itemData.considerAnnualization;
          let currentIncome = itemData.currentIncome;
          let duration = itemData.duration;
          let id = itemData.id;
          let incomeDistribution = itemData.incomeDistribution;
          let name = itemData.name;
          let redemptionPeriod = itemData.redemptionPeriod;
          let startAndRestTime = itemData.startAndRestTime;
          let status = itemData.status;
          let timeOfExpiration = itemData.timeOfExpiration;
          let timeOfPurchase = itemData.timeOfPurchase;
          let timeOfSettlement = itemData.timeOfSettlement;
          this.txtHisLockAnnual.string = considerAnnualization + "%";
          this.txtHisLockDuration.string = duration + "days";
          this.txtHisLockState.string = status + "";
          this.txtHisLockCanApply.string = amountOfInput + "";
          this.txtHisLockCurIncome.string = currentIncome + "";
          this.txtHisLockPurchaseTime.string = timeOfPurchase + "";
          this.txtHisLockRiseTime.string = startAndRestTime + "";
          this.txtHisLockIncomeDis.string = incomeDistribution + "";
          this.txtHisLockMaturityTime.string = timeOfExpiration + "";
          this.txtHisLockSettleTime.string = timeOfSettlement + "";
          this.txtHisLockCycleTime.string = redemptionPeriod + "";
        }
      }
      onWareHouseItemClick(idx) {
        this.warehouseIdx = idx;
        this.refleshLockWarehouse();
      }
      onMyCoinItemClick(idx) {
        this.myCoinIdx = idx;
        this.refleshMyCoin();
      }
      onHistoryItemClick(idx) {
        this.historyIdx = idx;
        this.refleshHistoryLock();
      }
      onWareBtnClick(idx) {
        let item = this.warehouseList[idx];
        GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.YLB_APPLY_VIEW, item);
      }
      initSelfUI() {
        let checkIdx = 0;
        this.container.toggleItems[checkIdx].isChecked = true;
        let items = this.container.toggleItems;
        for (let i = 0; i < items.length; i++) {
          this.container.toggleItems[i].isChecked = checkIdx == i;
          this.rightRoots[i].active = this.container.toggleItems[i].isChecked;
        }
        this.txtWareHouseAnnual.string = "";
        this.txtWareHouseDuration.string = "";
        this.txtWareHouseState.string = "";
        this.txtWareHouseAvailSub.string = "";
        this.txtWareHouseStartAmount.string = "";
        this.txtWareHouseSubTime.string = "";
        this.txtWareHouseInterestTime.string = "";
        this.txtWareHouseIncomeDis.string = "";
        this.txtWareHouseMaturityTime.string = "";
        this.txtWareHouseSettleTime.string = "";
        this.txtWareHouseRedempTime.string = "";
        this.txtMycoinAnnual.string = "";
        this.txtMycoinTerm.string = "";
        this.txtMycoinState.string = "";
        this.txtMycoinCurEarning.string = "";
        this.txtMycoinAmount.string = "";
        this.txtMycoinPurchaseTime.string = "";
        this.txtMycoinRiseTime.string = "";
        this.txtMycoinIncomeDis.string = "";
        this.txtMycoinMaturityTime.string = "";
        this.txtMycoinSettleTime.string = "";
        this.txtMycoinCycleTime.string = "";
        this.txtHisLockAnnual.string = "";
        this.txtHisLockDuration.string = "";
        this.txtHisLockState.string = "";
        this.txtHisLockCanApply.string = "";
        this.txtHisLockCurIncome.string = "";
        this.txtHisLockPurchaseTime.string = "";
        this.txtHisLockRiseTime.string = "";
        this.txtHisLockIncomeDis.string = "";
        this.txtHisLockMaturityTime.string = "";
        this.txtHisLockSettleTime.string = "";
        this.txtHisLockCycleTime.string = "";
      }
      onCheckChange(target, customEventData) {
        let items = this.container.toggleItems;
        for (let i = 0; i < items.length; i++) {
          this.rightRoots[i].active = items[i].isChecked;
          items[i].isChecked && (0 == i ? this.refleshLockWarehouse() : 1 == i ? this.refleshMyCoin() : this.refleshHistoryLock());
        }
      }
      onViewChange() {
        let width = this.node.width;
      }
      onBtnClick(event, customEventData) {
        0 == customEventData ? GameGlobal_1.GameGlobal.Viewer.closeViewEffect(ViewConst_1.ViewConst.ViewName.YLB_VIEW) : 1 == customEventData && GameGlobal_1.GameGlobal.Viewer.openView(ViewConst_1.ViewConst.ViewName.YLB_INSTRUCTION_VIEW);
      }
      onEnterBegin(event, customEventData) {}
    };
    YlbView.TAG = "YlbView";
    __decorate([ property(cc.ToggleContainer) ], YlbView.prototype, "container", void 0);
    __decorate([ property([ cc.Node ]) ], YlbView.prototype, "rightRoots", void 0);
    __decorate([ property(cc.Node) ], YlbView.prototype, "wareHouseContent", void 0);
    __decorate([ property(cc.Node) ], YlbView.prototype, "myCoinContent", void 0);
    __decorate([ property(cc.Node) ], YlbView.prototype, "hisLockContent", void 0);
    __decorate([ property(cc.Prefab) ], YlbView.prototype, "wareHouseItemPre", void 0);
    __decorate([ property(cc.Prefab) ], YlbView.prototype, "myCoinItemPre", void 0);
    __decorate([ property(cc.Prefab) ], YlbView.prototype, "HisLockItemPre", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtWareHouseAnnual", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtWareHouseDuration", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtWareHouseState", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtWareHouseAvailSub", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtWareHouseStartAmount", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtWareHouseSubTime", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtWareHouseInterestTime", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtWareHouseIncomeDis", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtWareHouseMaturityTime", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtWareHouseSettleTime", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtWareHouseRedempTime", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtMycoinAnnual", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtMycoinTerm", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtMycoinState", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtMycoinCurEarning", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtMycoinAmount", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtMycoinPurchaseTime", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtMycoinRiseTime", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtMycoinIncomeDis", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtMycoinMaturityTime", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtMycoinSettleTime", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtMycoinCycleTime", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtHisLockAnnual", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtHisLockDuration", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtHisLockState", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtHisLockCanApply", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtHisLockCurIncome", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtHisLockPurchaseTime", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtHisLockRiseTime", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtHisLockIncomeDis", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtHisLockMaturityTime", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtHisLockSettleTime", void 0);
    __decorate([ property(cc.Label) ], YlbView.prototype, "txtHisLockCycleTime", void 0);
    YlbView = __decorate([ ccclass ], YlbView);
    exports.default = YlbView;
    cc._RF.pop();
  }, {
    "../../../framework/GameGlobal": "GameGlobal",
    "../../../framework/base/BaseView": "BaseView",
    "../../../framework/const/EventConst": "EventConst",
    "../../../framework/const/ResConst": "ResConst",
    "../../../framework/const/ViewConst": "ViewConst",
    "../../../framework/utils/UIUtil": "UIUtil",
    "../../const/HallHttpConst": "HallHttpConst"
  } ],
  buttonEx: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "389f8dam5JK77GOIWXBfeJe", "buttonEx");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var SoundConst_1 = require("../const/SoundConst");
    var GameGlobal_1 = require("../GameGlobal");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var buttonEx = function(_super) {
      __extends(buttonEx, _super);
      function buttonEx() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.isPreventSecondClick = false;
        _this.preventTime = 2;
        _this.zoomScale = .9;
        _this.isPlaySound = true;
        return _this;
      }
      buttonEx.prototype.start = function() {
        _super.prototype.start && _super.prototype.start.call(this);
        var button = this.node.getComponent(cc.Button);
        this.node.on("click", function(event) {
          if (this.isPreventSecondClick) {
            button.interactable = false;
            this.scheduleOnce(function() {
              button.node && (button.interactable = true);
            }, this.preventTime);
          }
          GameGlobal_1.GameGlobal.Sound.playSound(SoundConst_1.SoundConst.AudioEffectType.BTN_CLICK);
        }, this);
      };
      buttonEx.prototype.onDisable = function() {
        _super.prototype.onDisable && _super.prototype.onDisable.call(this);
        this.unscheduleAllCallbacks();
      };
      __decorate([ property(cc.Boolean) ], buttonEx.prototype, "isPreventSecondClick", void 0);
      __decorate([ property(cc.Integer) ], buttonEx.prototype, "preventTime", void 0);
      __decorate([ property({
        override: true
      }) ], buttonEx.prototype, "_N$transition", void 0);
      __decorate([ property({
        override: true,
        type: cc.Float
      }) ], buttonEx.prototype, "zoomScale", void 0);
      __decorate([ property(cc.Boolean) ], buttonEx.prototype, "isPlaySound", void 0);
      buttonEx = __decorate([ ccclass ], buttonEx);
      return buttonEx;
    }(cc.Button);
    exports.default = buttonEx;
    cc._RF.pop();
  }, {
    "../GameGlobal": "GameGlobal",
    "../const/SoundConst": "SoundConst"
  } ],
  elasticLimit: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cad33aLu5lGpY9kxRqQAXUn", "elasticLimit");
    "use strict";
    cc.Class({
      extends: cc.ScrollView,
      properties: {
        elasticValueX: .5,
        elasticValueY: .5
      },
      onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, true);
      },
      _onTouchMoved: function _onTouchMoved(event, captureListeners) {
        if (!this.enabledInHierarchy) return;
        if (this._hasNestedViewGroup(event, captureListeners)) return;
        var touch = event.touch;
        this.content && this._handleMoveLogic(touch);
        if (!this.cancelInnerEvents) return;
        var deltaMove = touch.getLocation().sub(touch.getStartLocation());
        if (deltaMove.mag() > 7 && !this._touchMoved && event.target !== this.node) {
          var cancelEvent = new cc.Event.EventTouch(event.getTouches(), event.bubbles);
          cancelEvent.type = cc.Node.EventType.TOUCH_CANCEL;
          cancelEvent.touch = event.touch;
          cancelEvent.simulate = true;
          event.target.dispatchEvent(cancelEvent);
          this._touchMoved = true;
        }
        this._stopPropagationIfTargetIsMe(event);
      },
      _handleMoveLogic: function _handleMoveLogic(touch) {
        var deltaMove = touch.getDelta();
        this._processDeltaMove(deltaMove);
      },
      _processDeltaMove: function _processDeltaMove(deltaMove) {
        this._scrollChildren(deltaMove);
        this._gatherTouchMove(deltaMove);
      },
      _scrollChildren: function _scrollChildren(deltaMove) {
        deltaMove = this._clampDelta(deltaMove);
        var realMove = deltaMove;
        var outOfBoundary;
        if (this.elastic) {
          outOfBoundary = this._getHowMuchOutOfBoundary();
          realMove.x *= 0 === outOfBoundary.x ? 1 : this.elasticValueX;
          realMove.y *= 0 === outOfBoundary.y ? 1 : this.elasticValueY;
        }
        if (!this.elastic) {
          outOfBoundary = this._getHowMuchOutOfBoundary(realMove);
          realMove = realMove.add(outOfBoundary);
        }
        var scrollEventType = -1;
        if (realMove.y > 0) {
          var icBottomPos = this.content.y - this.content.anchorY * this.content.height;
          icBottomPos + realMove.y > this._bottomBoundary && (scrollEventType = "scroll-to-bottom");
        } else if (realMove.y < 0) {
          var icTopPos = this.content.y - this.content.anchorY * this.content.height + this.content.height;
          icTopPos + realMove.y <= this._topBoundary && (scrollEventType = "scroll-to-top");
        } else if (realMove.x < 0) {
          var icRightPos = this.content.x - this.content.anchorX * this.content.width + this.content.width;
          icRightPos + realMove.x <= this._rightBoundary && (scrollEventType = "scroll-to-right");
        } else if (realMove.x > 0) {
          var icLeftPos = this.content.x - this.content.anchorX * this.content.width;
          icLeftPos + realMove.x >= this._leftBoundary && (scrollEventType = "scroll-to-left");
        }
        this._moveContent(realMove, false);
        if (0 !== realMove.x || 0 !== realMove.y) {
          if (!this._scrolling) {
            this._scrolling = true;
            this._dispatchEvent("scroll-began");
          }
          this._dispatchEvent("scrolling");
        }
        -1 !== scrollEventType && this._dispatchEvent(scrollEventType);
      }
    });
    cc._RF.pop();
  }, {} ],
  en: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9aa60zB+m9JWZOcymkYOzTF", "en");
    "use strict";
    var _Ylb, _module$exports;
    module.exports = (_module$exports = {
      Tips: {
        Tips: "Tips",
        LoginTips: "your token is old, are you sure to login?",
        ExitTips: "Are you sure you want to log out?"
      },
      Canncel: "Canncel",
      Account: "Account",
      ChangeHead: "Modify avatar",
      ChangeNick: "change username",
      ChangePassWord: "Change login password",
      ChangeConfirm: "Change Confirm",
      Login: "Login",
      Phone: "phone",
      EnterPhone: "Enter Phone",
      Code0: "verification code:",
      Code: "verification",
      HintCode: "verification",
      PassWord: "password:",
      HintPassWord: "Enter 8-20 bit Pass Word",
      InviteCode: "Invite Code:",
      HintInviteCode: "Enter Invite Code",
      ChangeNickTips: "The nickname cannot exceed 30 characters, and the first modification is free",
      Shop: {
        Fort: "Fort",
        Tool: "Tool",
        Shop: "Shop",
        LimitedTimeGoods: "Limited Time Goods",
        TipsBuy: "Are you sure to buy?",
        Buy: "Buy"
      },
      Email: {
        Email: "Email",
        SystemEmail: "System notification",
        DayDividend: "Daily dividend",
        RankingRewards: "Ranking Rewards",
        Receive: "Receive",
        ClickOneDelete: "One-click delete\nread messages",
        Delete: "Delete",
        Empty: "You have no mail yet!"
      },
      UserInfo: {
        Phone: "phone:",
        ID: "ID:",
        Invite: "invite:"
      },
      Fish: {
        origin_type1: "Limited-time Cannon, obtained through purchasing from the store",
        origin_type2: "Limited-time Cannon, obtained through synthesis and upgrade",
        origin_type3: "Limited-time Cannon, obtained through invitation activities",
        origin_type4: "Limited-time Cannon, obtained through limited-time purchases",
        BonusTortoiseContent: "Explanation: The red tortoise of the upper-level friends can additionally get a certain amount of profit dividends from the lower-level players, which can be obtained by inviting friends to obtain special missiles and catching the red tortoise in the game!"
      },
      Friend: {
        InviteInstruction: "Friend Invitation Instruction",
        Promote: "promote",
        Subordinate: "subordinate",
        InfoSub: "Current Subordinate Count:",
        InfoSubRule: "(Register Users Through Invitation Links)",
        InfoProRule: "(Recharge Requirements 1000, Consumption Requirements1000)",
        InfoAct: "Active Subordinates Yesterday: ",
        InfoActValue: "Yesterday Activity Value:",
        InfoEffectPro: "Current Valid Promoter Count: ",
        No: "No",
        Name: "Name",
        recharge: "recharge",
        Consumption: "Consumption",
        active: "active",
        dividends: "dividends",
        register: "register",
        login: "login",
        operate: "operate"
      },
      Turtle: {
        AdvanceSynth: "advanced synthesis",
        GeneralSynth: "general synthesis",
        TxtTurtleInstrution: "Level {0} diviends turtle can get {1}% of the income of the lower level every day",
        Grade: "Lv{0} ",
        Per: "(Synthesis rate {0}%)"
      },
      Fort: {
        ChangeFort: "Change fort",
        Update: "update",
        GradeHead: "Grade:",
        PriceHead: "Selling price:",
        PowerHead: "Energy value:",
        ResidualPowerHead: "Residual energy:",
        BulletHead: "Bullet consume:",
        RarityHead: "Rarity:",
        DailyBonusHead: "Daily income:",
        ExpireDateHead: "Expire date:",
        UpdateCon: "recharge {0},lockout amount {1},invite {2}"
      },
      Hall: {
        BindPhone: "Bind Mobile",
        Login: "Login"
      },
      Ylb: (_Ylb = {
        Apply: "Apply",
        Subscribe: "Subscribe",
        curQuota: "currently available quota: ",
        ApplicationQuota: "Application quota: ",
        Application: "Application: ",
        Annualized: "annualized: ",
        All: "all",
        LockWarehouse: "Lock Coins to Earn",
        MyCoins: "My Earnings",
        HistoricalLock: "Historical Locking",
        ProductList: "Product List",
        Name: "name"
      }, _Ylb["Annualized"] = "Annualized Rate", _Ylb.Product = "Product", _Ylb.Income = "income", 
      _Ylb.Term = "term", _Ylb.Operate = "Operate", _Ylb.Status = "Status", _Ylb.Purchase = "purchase", 
      _Ylb.SoldOut = "sold out", _Ylb.ProductDetails = "Product Details", _Ylb.Yulibao = "Yulibao", 
      _Ylb.HeadAnnualized = "Annualized Rate:", _Ylb.HeadTerm = "term:", _Ylb.HeadState = "Status:", 
      _Ylb.HeadAvailableSub = "Available Subscription:", _Ylb.HeadStartAmount = "Starting Amount:", 
      _Ylb.HeadSubTime = "Subscription Time:", _Ylb.HeadAccTime = "Interest Accrual Time:", 
      _Ylb.HeadEarnDistribution = "Earnings Distribution:", _Ylb.HeadMaturityDate = "Maturity Date:", 
      _Ylb.HeadSettlementTime = "Settlement Time:", _Ylb.HeadRedemptionTime = "Redemption Period:", 
      _Ylb.HeadCurEaring = "Current Earnings:", _Ylb.HeadInvestmentAmount = "Investment Amount:", 
      _Ylb["HeadStartAmount"] = "Starting Amount ", _Ylb.State = "state", _Ylb["Subscribe"] = "Subscribe", 
      _Ylb["SoldOut"] = "Sold out", _Ylb.Progress = "Earnings in Progress", _Ylb.Redeemed = "Redeemed", 
      _Ylb),
      Confirm: "Confirm",
      GetCode: "Get Code",
      ResetPassW: "Reset"
    }, _module$exports["Login"] = "Login", _module$exports.ForgetPw = "forget password?", 
    _module$exports.BindPhone = "Bind Phone", _module$exports.InvalidPhone = "Invalid Phone", 
    _module$exports.InvalidCode = "Invalid Code", _module$exports.InvalidPassWord = "Invalid PassWord", 
    _module$exports.InvalidNick = "Invalid Nick", _module$exports);
    cc._RF.pop();
  }, {} ],
  eventListener: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "52af6tRwp9Od5G0CUJ6MP/R", "eventListener");
    "use strict";
    var oneToOneListener = cc.Class({
      ctor: function ctor() {
        this.supportEvent = null;
      },
      on: function on(eventName, handler, target) {
        this[eventName] = {
          handler: handler,
          target: target
        };
      },
      off: function off(eventName, handler) {
        var oldObj = this[eventName];
        oldObj && oldObj.handler && oldObj.handler === handler && (this[eventName] = null);
      },
      dispatchEvent: function dispatchEvent(eventName) {
        if (null !== this.supportEvent && !this.supportEvent.hasOwnProperty(eventName)) {
          cc.error("please add the event into clientEvent.js");
          return;
        }
        var objHandler = this[eventName];
        var args = [];
        for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
        objHandler.handler ? objHandler.handler.apply(objHandler.target, args) : cc.log("not register " + eventName + "    callback func");
      },
      setSupportEventList: function setSupportEventList(arrSupportEvent) {
        if (!(arrSupportEvent instanceof Array)) {
          cc.error("supportEvent was not array");
          return false;
        }
        this.supportEvent = {};
        for (var i in arrSupportEvent) {
          var eventName = arrSupportEvent[i];
          this.supportEvent[eventName] = i;
        }
        return true;
      }
    });
    var oneToMultiListener = cc.Class({
      ctor: function ctor() {
        this.handlers = {};
        this.supportEvent = null;
      },
      on: function on(eventName, handler, target) {
        var objHandler = {
          handler: handler,
          target: target
        };
        var handlerList = this.handlers[eventName];
        if (!handlerList) {
          handlerList = [];
          this.handlers[eventName] = handlerList;
        }
        for (var i = 0; i < handlerList.length; i++) if (!handlerList[i]) {
          handlerList[i] = objHandler;
          return i;
        }
        handlerList.push(objHandler);
        return handlerList.length;
      },
      off: function off(eventName, handler, target) {
        var handlerList = this.handlers[eventName];
        if (!handlerList) return;
        for (var i = 0; i < handlerList.length; i++) {
          var oldObj = handlerList[i];
          if (oldObj.handler === handler && (!target || target === oldObj.target)) {
            handlerList.splice(i, 1);
            break;
          }
        }
      },
      dispatchEvent: function dispatchEvent(eventName) {
        if (null !== this.supportEvent && !this.supportEvent.hasOwnProperty(eventName)) {
          cc.error("please add the event into clientEvent.js");
          return;
        }
        var handlerList = this.handlers[eventName];
        var args = [];
        var i;
        for (i = 1; i < arguments.length; i++) args.push(arguments[i]);
        if (!handlerList) return;
        for (i = 0; i < handlerList.length; i++) {
          var objHandler = handlerList[i];
          objHandler.handler && objHandler.handler.apply(objHandler.target, args);
        }
      },
      setSupportEventList: function setSupportEventList(arrSupportEvent) {
        if (!(arrSupportEvent instanceof Array)) {
          cc.error("supportEvent was not array");
          return false;
        }
        this.supportEvent = {};
        for (var i in arrSupportEvent) {
          var eventName = arrSupportEvent[i];
          this.supportEvent[eventName] = i;
        }
        return true;
      }
    });
    var eventListener = {
      getBaseClass: function getBaseClass(type) {
        var newEventListener = {};
        newEventListener = "multi" === type ? oneToMultiListener : oneToOneListener;
        return newEventListener;
      }
    };
    module.exports = eventListener;
    cc._RF.pop();
  }, {} ],
  gridView: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8bc648JBWpJrrPyX6O/H3ab", "gridView");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.gridView = exports.Type = void 0;
    var i18n = require("LanguageData");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var Type;
    (function(Type) {
      Type[Type["HORIZONTAL"] = 1] = "HORIZONTAL";
      Type[Type["VERTICAL"] = 2] = "VERTICAL";
    })(Type = exports.Type || (exports.Type = {}));
    var gridView = function(_super) {
      __extends(gridView, _super);
      function gridView() {
        var _this = null !== _super && _super.apply(this, arguments) || this;
        _this.prefab = null;
        _this.scrollView = null;
        _this.type = Type.VERTICAL;
        _this.prefabScale = 1;
        _this.paddingLeft = 10;
        _this.paddingRight = 10;
        _this.paddingTop = 10;
        _this.paddingBottom = 10;
        _this.spacingX = 5;
        _this.spacingY = 5;
        _this.countPerRow = 5;
        return _this;
      }
      gridView.prototype.onLoad = function() {
        this.updateTimer = 0;
        this.updateInterval = .2;
        this.pool = new cc.NodePool();
        var initCount = this.countPerRow;
        for (var i = 0; i < initCount; ++i) {
          var item = cc.instantiate(this.prefab);
          this.pool.put(item);
        }
        this.contents = [];
      };
      gridView.prototype.init = function(contents) {
        this.isChange = true;
        this.positions = [];
        this.contents = contents instanceof Array ? contents : [];
        var size = this.node.getContentSize();
        this.type === Type.HORIZONTAL && (this.countPerCol = this.countPerRow);
        for (var i = 0; i < this.contents.length; i++) {
          var widthIndex;
          var heightIndex;
          if (this.type === Type.VERTICAL) {
            widthIndex = i % this.countPerRow;
            heightIndex = Math.floor(i / this.countPerRow);
          } else {
            widthIndex = Math.floor(i / this.countPerCol);
            heightIndex = i % this.countPerCol;
          }
          var width = this.getPrefabWidth();
          var height = this.getPrefabHeight();
          this.positions.push(cc.v2(this.paddingLeft + this.spacingX * widthIndex + width * (widthIndex + .5), -(this.paddingTop + this.spacingY * heightIndex + height * (heightIndex + .5))));
        }
        var sizeWidthIndex = Math.ceil(i / this.countPerCol);
        var sizeWidth = this.getPrefabWidth();
        var sizeHeightIndex = Math.ceil(i / this.countPerRow);
        var sizeHeight = this.getPrefabHeight();
        this.type === Type.VERTICAL ? this.node.setContentSize(cc.size(size.width, this.paddingTop + this.spacingY * sizeHeightIndex + sizeHeight * sizeHeightIndex)) : this.node.setContentSize(cc.size(this.paddingLeft + this.spacingX * sizeWidthIndex + sizeWidth * sizeWidthIndex, size.height));
      };
      gridView.prototype.addNode = function() {
        var child;
        var num = [];
        for (var i = 0; i < this.contents.length; i++) {
          var viewPos = this.getPositionInView(this.positions[i]);
          if (this.isOverBorder(viewPos)) {
            child = this.node.getChildByName(i + "");
            child && this.remove(child);
          } else {
            num.push(i);
            child = this.node.getChildByName(i + "");
            if (child) {
              if (this.isChange) {
                this.node.emit("show", {
                  index: i,
                  node: child,
                  content: this.contents[i]
                });
                child.setPosition(this.positions[i]);
                child.tag = i;
              }
            } else this.create(child, i);
          }
        }
        if (this.isChange) {
          var children = this.node.children;
          cc.log("num" + num);
          for (i = 0; i < children.length; ) {
            child = children[i];
            if (-1 === num.indexOf(child.tag)) {
              cc.log("remove" + child.tag);
              this.remove(child);
            } else i++;
          }
        }
        this.isChange = false;
      };
      gridView.prototype.create = function(child, index) {
        child = this.pool.size() > 0 ? this.pool.get() : cc.instantiate(this.prefab);
        child.setScale(this.prefabScale, this.prefabScale);
        this.node.emit("show", {
          index: index,
          node: child,
          content: this.contents[index]
        });
        child.setPosition(this.positions[index]);
        this.node.addChild(child, 0, index);
      };
      gridView.prototype.remove = function(child) {
        this.pool.put(child);
        this.node.removeChild(child, false);
      };
      gridView.prototype.getPositionInView = function(position) {
        var worldPos = this.node.convertToWorldSpaceAR(position);
        var viewPos = this.scrollView.convertToNodeSpaceAR(worldPos);
        return viewPos;
      };
      gridView.prototype.getPrefabHeight = function() {
        return this.prefab.data.height * this.prefabScale;
      };
      gridView.prototype.getPrefabWidth = function() {
        return this.prefab.data.width * this.prefabScale;
      };
      gridView.prototype.isOverBorder = function(viewPos) {
        var height = this.scrollView.height;
        var itemHeight = this.getPrefabHeight();
        var width = this.scrollView.width;
        var itemWidth = this.getPrefabWidth();
        var borderHeight = height / 2 + itemHeight / 2;
        var borderWidth = width + itemWidth / 2;
        return this.type === Type.VERTICAL ? viewPos.y > borderHeight || viewPos.y < -borderHeight : viewPos.x > borderWidth;
      };
      gridView.prototype.update = function(dt) {
        this.updateTimer += dt;
        if (this.updateTimer < this.updateInterval) return;
        this.updateTimer = 0;
        this.addNode();
      };
      gridView.prototype.onDestory = function() {
        this.pool.clear();
      };
      __decorate([ property(cc.Prefab) ], gridView.prototype, "prefab", void 0);
      __decorate([ property(cc.Node) ], gridView.prototype, "scrollView", void 0);
      __decorate([ property(cc.Integer) ], gridView.prototype, "type", void 0);
      __decorate([ property(cc.Float) ], gridView.prototype, "prefabScale", void 0);
      __decorate([ property(cc.Float) ], gridView.prototype, "paddingLeft", void 0);
      __decorate([ property(cc.Float) ], gridView.prototype, "paddingRight", void 0);
      __decorate([ property(cc.Float) ], gridView.prototype, "paddingTop", void 0);
      __decorate([ property(cc.Float) ], gridView.prototype, "paddingBottom", void 0);
      __decorate([ property(cc.Float) ], gridView.prototype, "spacingX", void 0);
      __decorate([ property(cc.Float) ], gridView.prototype, "spacingY", void 0);
      __decorate([ property(cc.Integer) ], gridView.prototype, "countPerRow", void 0);
      gridView = __decorate([ ccclass ], gridView);
      return gridView;
    }(cc.Component);
    exports.gridView = gridView;
    cc._RF.pop();
  }, {
    LanguageData: "LanguageData"
  } ],
  id: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1111doI+TZB173RjqaqTHMx", "id");
    "use strict";
    var _module$exports;
    module.exports = (_module$exports = {
      current: "Current language: ",
      create_language: "New language",
      language: "Language",
      create: "Create",
      cancel: "Cancel",
      startgame: "Memulai permainan",
      unlock_props: "Buka kunci alat peraga",
      get_boosters: "dapatkan booster",
      lottery_turntable: "Meja putar lotere",
      out_of_moves: "diluar pergerakan",
      moves: "bergerak",
      sets: "set",
      ok: "Oke",
      buy: "membeli",
      daily_reward: "hadiah harian",
      get_double: "mendapatkan dua kali lipat",
      receive0: "menerima",
      go: "Pergilah"
    }, _module$exports["cancel"] = "membatalkan", _module$exports.next_level = "tingkat berikutnya", 
    _module$exports.guide = "memandu", _module$exports.receive1 = "menerima", _module$exports.score = "skor", 
    _module$exports.get = "Dapatkan", _module$exports.friend = "teman", _module$exports["login"] = {
      noAccount: "Tidak ada akun, silakan buat!"
    }, _module$exports["sign"] = {
      "double rewards": "Penghargaan Berbagi X2",
      "day%{value}": "Day%{value}"
    }, _module$exports["fight"] = {
      fightStartAdAsk: "Tonton iklan untuk mendapatkan bonus?",
      fightOverAdAsk: "tonton iklan untuk mendapatkan 5 langkah ekstra?",
      highest: "tertinggi:",
      propExceedMaxTimes: "Mencapai batas. Tidak ada lagi efek untuk putaran ini.",
      propNoEnough: "Alat peraga telah digunakan!",
      needCollect: "Anda masih perlu mengumpulkan"
    }, _module$exports["lottery"] = {
      lotteryNotEnoughGetLotteries: "Tiket tidak cukup! Klik tombol di bawah untuk mendapatkan lebih banyak tiket.",
      noChargePleaseWait: "Segera hadir",
      waitForLoadingAds: "Iklan sedang dimuat...",
      "still%{value}winLottery": "<color=#ffffff><color=#7dd5ff>%{value}</color>peluang lebih besar untuk memenangkan kupon</color>"
    }, _module$exports["pve"] = {
      cannotSkipLastLevel: "Harap selesaikan dulu pos pemeriksaan sebelumnya!",
      highest: "Tertinggi",
      unLockProp: "Selamat telah membuka kunci penyangga."
    }, _module$exports["task"] = {
      notExist: "Tugas tidak ada",
      succeed: "Tugas selesai",
      fail: "Tugas belum selesai"
    }, _module$exports["prop"] = {
      prop: "Dapatkan alat peraga",
      lackGold: "kekurangan emas",
      hammer: "Palu",
      magic: "Sihir",
      refresh: "Menyegarkan",
      infinite: "Tak terbatas",
      get: "dapatkan %{name} x%{num}"
    }, _module$exports["table_prop"] = {
      "\u9524\u5b50": "Palu",
      "\u9b54\u6cd5\u68d2": "Sihir",
      "\u5237\u65b0": "Menyegarkan",
      "\u65e0\u9650": "Tak terbatas",
      "\u6d88\u9664\u9009\u62e9\u76841\u4e2a\u86cb\u7cd5\uff0c\u6bcf\u5c40\u9650\u75283\u4e2a.": "Hapus kue yang dipilih. 3 kali setiap pertandingan.",
      "\u8d4b\u4e88\u9009\u62e9\u76841\u4e2a\u86cb\u7cd5\u76f4\u7ebf\u7279\u6548\uff0c\u6bcf\u5c40\u9650\u75281\u4e2a.": "Beri kue efek garis lurus. 1 kali setiap permainan.",
      "\u91cd\u65b0\u6392\u5217\u6e38\u620f\u533a\u5185\u6240\u6709\u86cb\u7cd5\uff0c\u6bcf\u5c40\u9650\u75283\u6b21.": "Segarkan. 3 kali setiap permainan.",
      "\u4f7f\u7528\u540e\u672c\u5173\u4e0d\u518d\u9650\u5236\u6e38\u620f\u6b65\u6570,\u6bcf\u5c40\u9650\u75281\u4e2a.": "Langkahnya tidak terbatas, 1 kali setiap permainan."
    }, _module$exports["rank"] = {
      shareTitle: "Cake Crush"
    }, _module$exports["onlineReward"] = {
      receive: "Terimalah"
    }, _module$exports["shop"] = {
      receive: "Terimalah"
    }, _module$exports);
    cc._RF.pop();
  }, {} ],
  lodash: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f3c895O5ZtGk4v3lPi3O5mJ", "lodash");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var lodash = function() {
      function lodash() {}
      lodash.find = function(collection, predicate) {
        var result;
        Array.isArray(collection) || (collection = this.toArray(collection));
        result = collection.filter(predicate);
        if (result.length) return result[0];
        return;
      };
      lodash.forEach = function(collection, iteratee) {
        if (Array.isArray(collection)) collection.forEach(iteratee); else {
          var array = this.toArrayKey(collection);
          array.forEach(function(value, index, arr) {
            var key1 = value["key"];
            var value1 = value["value"];
            iteratee(value1, key1, collection);
          });
        }
      };
      lodash.cloneDeep = function(sObj) {
        if (null === sObj || "object" !== typeof sObj) return sObj;
        var s = {};
        sObj.constructor === Array && (s = []);
        for (var i in sObj) sObj.hasOwnProperty(i) && (s[i] = this.cloneDeep(sObj[i]));
        return s;
      };
      lodash.map = function(collection, iteratee) {
        Array.isArray(collection) || (collection = this.toArray(collection));
        var arr = [];
        collection.forEach(function(value, index, array) {
          arr.push(iteratee(value, index, array));
        });
        return arr;
      };
      lodash.random = function(min, max) {
        var r = Math.random();
        var rr = r * (max - min + 1) + min;
        return Math.floor(rr);
      };
      lodash.toArrayKey = function(srcObj) {
        var resultArr = [];
        for (var key in srcObj) {
          if (!srcObj.hasOwnProperty(key)) continue;
          resultArr.push({
            key: key,
            value: srcObj[key]
          });
        }
        return resultArr;
      };
      lodash.toArray = function(srcObj) {
        var resultArr = [];
        for (var key in srcObj) {
          if (!srcObj.hasOwnProperty(key)) continue;
          resultArr.push(srcObj[key]);
        }
        return resultArr;
      };
      lodash.filter = function(collection, iteratees) {
        Array.isArray(collection) || (collection = this.toArray(collection));
        return collection.filter(iteratees);
      };
      lodash.isEqual = function(x, y) {
        var in1 = x instanceof Object;
        var in2 = y instanceof Object;
        if (!in1 || !in2) return x === y;
        if (Object.keys(x).length !== Object.keys(y).length) return false;
        for (var p in x) {
          var a = x[p] instanceof Object;
          var b = y[p] instanceof Object;
          if (a && b) return this.isEqual(x[p], y[p]);
          if (x[p] !== y[p]) return false;
        }
        return true;
      };
      lodash.pullAllWith = function(array, value, comparator) {
        value.forEach(function(item) {
          var res = array.filter(function(n) {
            return comparator(n, item);
          });
          res.forEach(function(item) {
            var index = array.indexOf(item);
            -1 !== array.indexOf(item) && array.splice(index, 1);
          });
        });
        return array;
      };
      lodash.now = function() {
        return Date.now();
      };
      lodash.pullAll = function(array, value) {
        value.forEach(function(item) {
          var index = array.indexOf(item);
          -1 !== array.indexOf(item) && array.splice(index, 1);
        });
        return array;
      };
      lodash.forEachRight = function(collection, iteratee) {
        Array.isArray(collection) || (collection = this.toArray(collection));
        for (var i = collection.length - 1; i >= 0; i--) {
          var ret = iteratee(collection[i]);
          if (!ret) break;
        }
      };
      lodash.startsWith = function(str, target, position) {
        str = str.substr(position);
        return str.startsWith(target);
      };
      lodash.endsWith = function(str, target, position) {
        str = str.substr(position);
        return str.endsWith(target);
      };
      lodash.remove = function(array, predicate) {
        var result = [];
        var indexes = [];
        array.forEach(function(item, index) {
          if (predicate(item)) {
            result.push(item);
            indexes.push(index);
          }
        });
        this.basePullAt(array, indexes);
        return result;
      };
      lodash.basePullAt = function(array, indexes) {
        var length = array ? indexes.length : 0;
        var lastIndex = length - 1;
        var previous;
        while (length--) {
          var index = indexes[length];
          if (length === lastIndex || index !== previous) {
            previous = index;
            Array.prototype.splice.call(array, index, 1);
          }
        }
        return array;
      };
      lodash.findIndex = function(array, predicate, fromIndex) {
        array = array.slice(fromIndex);
        var i;
        if ("function" === typeof predicate) {
          for (i = 0; i < array.length; i++) if (predicate(array[i])) return i;
        } else if (Array.isArray(predicate)) for (i = 0; i < array.length; i++) {
          var key = predicate[0];
          var vaule = true;
          predicate.length > 1 && (vaule = predicate[1]);
          if (array[i][key] === vaule) return i;
        } else for (i = 0; i < array.length; i++) if (array[i] === predicate) return i;
        return -1;
      };
      lodash.concat = function() {
        var length = arguments.length;
        if (!length) return [];
        var array = arguments[0];
        var index = 1;
        while (index < length) {
          array = array.concat(arguments[index]);
          index++;
        }
        return array;
      };
      lodash.isNumber = function(value) {
        return "number" === typeof value;
      };
      lodash.prototype.indexOf = function(array, value, fromIndex) {
        array = array.slice(fromIndex);
        return array.indexOf(value);
      };
      lodash.join = function(array, separator) {
        if (null === array) return "";
        var result = "";
        array.forEach(function(item) {
          result += item + separator;
        });
        return result.substr(0, result.length - 1);
      };
      lodash.split = function(string, separator, limit) {
        return string.split(separator, limit);
      };
      lodash.max = function(array) {
        if (array && array.length) {
          var result;
          for (var i = 0; i < array.length; i++) 0 === i ? result = array[0] : result < array[i] && (result = array[i]);
          return result;
        }
        return;
      };
      lodash.drop = function(array, n) {
        var length = null === array ? 0 : array.length;
        if (!length) return [];
        return array.slice(n);
      };
      lodash.flattenDeep = function(arr) {
        return arr.reduce(function(prev, cur) {
          return prev.concat(Array.isArray(cur) ? this.flattenDeep(cur) : cur);
        }, []);
      };
      lodash.uniq = function(array) {
        var result = [];
        array.forEach(function(item) {
          -1 === result.indexOf(item) && result.push(item);
        });
        return result;
      };
      lodash.isNaN = function(value) {
        return this.isNumber(value) && value !== +value;
      };
      lodash.chunk = function(array, size) {
        var length = null === array ? 0 : array.length;
        if (!length || size < 1) return [];
        var result = [];
        while (array.length > size) {
          result.push(array.slice(0, size));
          array = array.slice(size);
        }
        result.push(array);
        return result;
      };
      lodash.toFinite = function(value) {
        var INFINITY = 1 / 0;
        var MAX_INTEGER = 17976931348623157e292;
        if (!value) return 0 === value ? value : 0;
        value = Number(value);
        if (value === INFINITY || value === -INFINITY) {
          var sign = value < 0 ? -1 : 1;
          return sign * MAX_INTEGER;
        }
        return value === value ? value : 0;
      };
      lodash.baseRange = function(start, end, step, fromRight) {
        var nativeMax = Math.max;
        var nativeCeil = Math.ceil;
        var index = -1, length = nativeMax(nativeCeil((end - start) / (step || 1)), 0), result = Array(length);
        while (length--) {
          result[fromRight ? length : ++index] = start;
          start += step;
        }
        return result;
      };
      lodash.isObject = function(value) {
        var type = typeof value;
        return null !== value && ("object" === type || "function" === type);
      };
      lodash.isLength = function(value) {
        return "number" === typeof value && value > -1 && value % 1 === 0 && value <= this.MAX_SAFE_INTEGER;
      };
      lodash.isArrayLike = function(value) {
        return null !== value && this.isLength(value.length);
      };
      lodash.eq = function(value, other) {
        return value === other || value !== value && other !== other;
      };
      lodash.isIndex = function(value, length) {
        var type = typeof value;
        length = null === length ? this.MAX_SAFE_INTEGER : length;
        var reIsUint = /^(?:0|[1-9]\d*)$/;
        return !!length && ("number" === type || "symbol" !== type && reIsUint.test(value)) && value > -1 && value % 1 === 0 && value < length;
      };
      lodash.isIterateeCall = function(value, index, object) {
        if (!this.isObject(object)) return false;
        var type = typeof index;
        if ("number" === type ? this.isArrayLike(object) && this.isIndex(index, object.length) : "string" === type && index in object) return this.eq(object[index], value);
        return false;
      };
      lodash.createRange = function(fromRight) {
        return function(start, end, step) {
          step && "number" !== typeof step && this.isIterateeCall(start, end, step) && (end = step = void 0);
          start = this.toFinite(start);
          if (void 0 === end) {
            end = start;
            start = 0;
          } else end = this.toFinite(end);
          step = void 0 === step ? start < end ? 1 : -1 : this.toFinite(step);
          return this.baseRange(start, end, step, fromRight);
        };
      };
      lodash.maxBy = function(array, predicate) {
        if (array && array.length) {
          var result;
          var objResult;
          for (var i = 0; i < array.length; i++) if (0 === i) {
            result = predicate(array[0]);
            objResult = array[0];
          } else if (result < array[i]) {
            result = array[i];
            objResult = array[i];
          }
          return objResult;
        }
        return;
      };
      lodash.minBy = function(array, predicate) {
        if (array && array.length) {
          var result;
          var objResult;
          for (var i = 0; i < array.length; i++) if (0 === i) {
            result = predicate(array[0]);
            objResult = array[0];
          } else if (result > array[i]) {
            result = predicate(array[i]);
            objResult = array[i];
          }
          return objResult;
        }
        return;
      };
      lodash.sumBy = function(collection, predicate) {
        var sum = 0;
        for (var key in collection) sum += predicate(collection[key]);
        return sum;
      };
      lodash.countBy = function(collection, predicate) {
        var objRet = {};
        for (var key in collection) {
          var value = collection[key];
          objRet.hasOwnProperty(value) ? objRet[value] += 1 : objRet[value] = 1;
        }
        return objRet;
      };
      lodash.MAX_SAFE_INTEGER = 9007199254740991;
      return lodash;
    }();
    exports.default = lodash;
    cc._RF.pop();
  }, {} ],
  ms: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "232a9t0dP1D6qIQO26oxGir", "ms");
    "use strict";
    var _module$exports;
    module.exports = (_module$exports = {
      current: "Current language: ",
      create_language: "New language",
      language: "Language",
      create: "Create",
      cancel: "Cancel",
      startgame: "Mula permainan",
      unlock_props: "Buka kunci alat peraga",
      get_boosters: "dapatkan penggalak",
      lottery_turntable: "Meja putar loteri",
      out_of_moves: "daripada bergerak",
      moves: "bergerak",
      sets: "set",
      ok: "okey",
      buy: "beli",
      daily_reward: "ganjaran harian",
      get_double: "mendapat dua kali ganda",
      receive0: "menerima",
      go: "pergi"
    }, _module$exports["cancel"] = "batalkan", _module$exports.next_level = "peringkat seterusnya", 
    _module$exports.guide = "panduan", _module$exports.receive1 = "menerima", _module$exports.score = "skor", 
    _module$exports.get = "dapatkan", _module$exports.friend = "kawan", _module$exports["login"] = {
      noAccount: "Tiada akaun, sila buat!"
    }, _module$exports["sign"] = {
      "double rewards": "Perkongsian Anugerah X2",
      "day%{value}": "Day%{value}"
    }, _module$exports["fight"] = {
      fightStartAdAsk: "Tonton iklan untuk mendapatkan bonus?",
      fightOverAdAsk: "tonton iklan untuk mendapatkan 5 langkah tambahan?",
      highest: "tertinggi: ",
      propExceedMaxTimes: "Mencapai had. Tiada lagi kesan untuk pusingan ini.",
      propNoEnough: "Prop telah habis!",
      needCollect: "Anda masih perlu mengumpul"
    }, _module$exports["lottery"] = {
      lotteryNotEnoughGetLotteries: "Tiket tidak mencukupi! Klik butang di bawah untuk mendapatkan lebih banyak tiket.",
      noChargePleaseWait: "Akan datang",
      waitForLoadingAds: "Iklan dimuatkan...",
      "still%{value}winLottery": "<color=#ffffff><color=#7dd5ff>%{value}</color>lebih banyak peluang untuk memenangi kupon</color>"
    }, _module$exports["pve"] = {
      cannotSkipLastLevel: "Sila selesaikan pusat pemeriksaan sebelum ini dahulu!",
      highest: "Tertinggi",
      unLockProp: "Tahniah kerana membuka kunci prop."
    }, _module$exports["task"] = {
      notExist: "Tugas tidak wujud",
      succeed: "Tugas selesai",
      fail: "Tugas belum selesai"
    }, _module$exports["prop"] = {
      prop: "Dapatkan alat peraga",
      lackGold: "kekurangan emas",
      hammer: "tukul",
      magic: "sihir",
      refresh: "segarkan semula",
      infinite: "tak terhingga",
      get: "dapat %{name} x%{num}"
    }, _module$exports["table_prop"] = {
      "\u9524\u5b50": "Tukul",
      "\u9b54\u6cd5\u68d2": "Sihir",
      "\u5237\u65b0": "Refresh",
      "\u65e0\u9650": "Infinite",
      "\u6d88\u9664\u9009\u62e9\u76841\u4e2a\u86cb\u7cd5\uff0c\u6bcf\u5c40\u9650\u75283\u4e2a.": "Keluarkan kek yang dipilih. 3 kali setiap permainan.",
      "\u8d4b\u4e88\u9009\u62e9\u76841\u4e2a\u86cb\u7cd5\u76f4\u7ebf\u7279\u6548\uff0c\u6bcf\u5c40\u9650\u75281\u4e2a.": "Beri kek kesan garis lurus. 1 kali setiap permainan.",
      "\u91cd\u65b0\u6392\u5217\u6e38\u620f\u533a\u5185\u6240\u6709\u86cb\u7cd5\uff0c\u6bcf\u5c40\u9650\u75283\u6b21.": "Segarkan semula. 3 kali setiap perlawanan.",
      "\u4f7f\u7528\u540e\u672c\u5173\u4e0d\u518d\u9650\u5236\u6e38\u620f\u6b65\u6570,\u6bcf\u5c40\u9650\u75281\u4e2a.": "Langkahnya akan menjadi tidak terhingga, 1 kali setiap perlawanan."
    }, _module$exports["rank"] = {
      shareTitle: "Cake Crush"
    }, _module$exports["onlineReward"] = {
      receive: "Terimalah"
    }, _module$exports["shop"] = {
      receive: "Terimalah"
    }, _module$exports);
    cc._RF.pop();
  }, {} ],
  "polyglot.min": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e26fd9yy65A4q3/JkpVnFYg", "polyglot.min");
    "use strict";
    (function(e, t) {
      "function" == typeof define && define.amd ? define([], function() {
        return t(e);
      }) : "object" == typeof exports ? module.exports = t(e) : e.Polyglot = t(e);
    })(void 0, function(e) {
      function t(e) {
        e = e || {}, this.phrases = {}, this.extend(e.phrases || {}), this.currentLocale = e.locale || "en", 
        this.allowMissing = !!e.allowMissing, this.warn = e.warn || c;
      }
      function s(e) {
        var t, n, r, i = {};
        for (t in e) if (e.hasOwnProperty(t)) {
          n = e[t];
          for (r in n) i[n[r]] = t;
        }
        return i;
      }
      function o(e) {
        var t = /^\s+|\s+$/g;
        return e.replace(t, "");
      }
      function u(e, t, r) {
        var i, s, u;
        return null != r && e ? (s = e.split(n), u = s[f(t, r)] || s[0], i = o(u)) : i = e, 
        i;
      }
      function a(e) {
        var t = s(i);
        return t[e] || t.en;
      }
      function f(e, t) {
        return r[a(e)](t);
      }
      function l(e, t) {
        for (var n in t) "_" !== n && t.hasOwnProperty(n) && (e = e.replace(new RegExp("%\\{" + n + "\\}", "g"), t[n]));
        return e;
      }
      function c(t) {
        e.console && e.console.warn && e.console.warn("WARNING: " + t);
      }
      function h(e) {
        var t = {};
        for (var n in e) t[n] = e[n];
        return t;
      }
      t.VERSION = "0.4.3", t.prototype.locale = function(e) {
        return e && (this.currentLocale = e), this.currentLocale;
      }, t.prototype.extend = function(e, t) {
        var n;
        for (var r in e) e.hasOwnProperty(r) && (n = e[r], t && (r = t + "." + r), "object" == typeof n ? this.extend(n, r) : this.phrases[r] = n);
      }, t.prototype.clear = function() {
        this.phrases = {};
      }, t.prototype.replace = function(e) {
        this.clear(), this.extend(e);
      }, t.prototype.t = function(e, t) {
        var n, r;
        return t = null == t ? {} : t, "number" == typeof t && (t = {
          smart_count: t
        }), "string" == typeof this.phrases[e] ? n = this.phrases[e] : "string" == typeof t._ ? n = t._ : this.allowMissing ? n = e : (this.warn('Missing translation for key: "' + e + '"'), 
        r = e), "string" == typeof n && (t = h(t), r = u(n, this.currentLocale, t.smart_count), 
        r = l(r, t)), r;
      }, t.prototype.has = function(e) {
        return e in this.phrases;
      };
      var n = "||||", r = {
        chinese: function chinese(e) {
          return 0;
        },
        german: function german(e) {
          return 1 !== e ? 1 : 0;
        },
        french: function french(e) {
          return e > 1 ? 1 : 0;
        },
        russian: function russian(e) {
          return e % 10 === 1 && e % 100 !== 11 ? 0 : e % 10 >= 2 && e % 10 <= 4 && (e % 100 < 10 || e % 100 >= 20) ? 1 : 2;
        },
        czech: function czech(e) {
          return 1 === e ? 0 : e >= 2 && e <= 4 ? 1 : 2;
        },
        polish: function polish(e) {
          return 1 === e ? 0 : e % 10 >= 2 && e % 10 <= 4 && (e % 100 < 10 || e % 100 >= 20) ? 1 : 2;
        },
        icelandic: function icelandic(e) {
          return e % 10 !== 1 || e % 100 === 11 ? 1 : 0;
        }
      }, i = {
        chinese: [ "fa", "id", "ja", "ko", "lo", "ms", "th", "tr", "zh" ],
        german: [ "da", "de", "en", "es", "fi", "el", "he", "hu", "it", "nl", "no", "pt", "sv" ],
        french: [ "fr", "tl", "pt-br" ],
        russian: [ "hr", "ru" ],
        czech: [ "cs" ],
        polish: [ "pl" ],
        icelandic: [ "is" ]
      };
      return t;
    });
    cc._RF.pop();
  }, {} ],
  stopPropagation: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "99cb6OUHm9Ad6tPff7r5c5v", "stopPropagation");
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var i18n = require("LanguageData");
    var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
    var stopPropagation = function(_super) {
      __extends(stopPropagation, _super);
      function stopPropagation() {
        return null !== _super && _super.apply(this, arguments) || this;
      }
      stopPropagation.prototype.onLoad = function() {};
      stopPropagation.prototype.onEnable = function() {
        this.node.on("touchstart", function(event) {
          event.stopPropagation();
        });
        this.node.on("touchend", function(event) {
          event.stopPropagation();
        });
        this.node.on("touchmove", function(event) {
          event.stopPropagation();
        });
        this.node.on("touchcancel", function(event) {
          event.stopPropagation();
        });
        this.node.on("mousedown", function(event) {
          event.stopPropagation();
        });
        this.node.on("mouseenter", function(event) {
          event.stopPropagation();
        });
        this.node.on("mousemove", function(event) {
          event.stopPropagation();
        });
        this.node.on("mouseleave", function(event) {
          event.stopPropagation();
        });
        this.node.on("mouseup", function(event) {
          event.stopPropagation();
        });
        this.node.on("mousewheel", function(event) {
          event.stopPropagation();
        });
      };
      stopPropagation.prototype.onDisable = function() {
        this.node.off("touchstart", function(event) {
          event.stopPropagation();
        });
        this.node.off("touchend", function(event) {
          event.stopPropagation();
        });
        this.node.off("touchmove", function(event) {
          event.stopPropagation();
        });
        this.node.off("touchcancel", function(event) {
          event.stopPropagation();
        });
        this.node.off("mousedown", function(event) {
          event.stopPropagation();
        });
        this.node.off("mouseenter", function(event) {
          event.stopPropagation();
        });
        this.node.off("mousemove", function(event) {
          event.stopPropagation();
        });
        this.node.off("mouseleave", function(event) {
          event.stopPropagation();
        });
        this.node.off("mouseup", function(event) {
          event.stopPropagation();
        });
        this.node.off("mousewheel", function(event) {
          event.stopPropagation();
        });
      };
      stopPropagation = __decorate([ ccclass ], stopPropagation);
      return stopPropagation;
    }(cc.Component);
    exports.default = stopPropagation;
    cc._RF.pop();
  }, {
    LanguageData: "LanguageData"
  } ],
  th: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "773c7k6Q4lDZrII0sSEgSbw", "th");
    "use strict";
    var _module$exports;
    module.exports = (_module$exports = {
      current: "Current language: ",
      create_language: "New language",
      language: "Language",
      create: "Create",
      cancel: "Cancel",
      startgame: "\u0e40\u0e23\u0e34\u0e48\u0e21\u0e40\u0e01\u0e21\u0e2a\u0e4c",
      unlock_props: "\u0e1b\u0e25\u0e14\u0e25\u0e47\u0e2d\u0e01\u0e2d\u0e38\u0e1b\u0e01\u0e23\u0e13\u0e4c\u0e1b\u0e23\u0e30\u0e01\u0e2d\u0e1a\u0e09\u0e32\u0e01",
      get_boosters: "\u0e23\u0e31\u0e1a\u0e14\u0e35\u0e40\u0e14\u0e48\u0e19",
      lottery_turntable: "\u0e40\u0e04\u0e23\u0e37\u0e48\u0e2d\u0e07\u0e40\u0e25\u0e48\u0e19\u0e41\u0e1c\u0e48\u0e19\u0e40\u0e2a\u0e35\u0e22\u0e07",
      out_of_moves: "\u0e2d\u0e2d\u0e01\u0e08\u0e32\u0e01\u0e01\u0e32\u0e23\u0e40\u0e04\u0e25\u0e37\u0e48\u0e2d\u0e19\u0e44\u0e2b\u0e27",
      moves: "\u0e40\u0e04\u0e25\u0e37\u0e48\u0e2d\u0e19\u0e44\u0e2b\u0e27",
      sets: "\u0e0a\u0e38\u0e14",
      ok: "\u0e15\u0e01\u0e25\u0e07",
      buy: "\u0e0b\u0e37\u0e49\u0e2d",
      daily_reward: "\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e1b\u0e23\u0e30\u0e08\u0e33\u0e27\u0e31\u0e19",
      get_double: "\u0e23\u0e31\u0e1a\u0e2a\u0e2d\u0e07\u0e40\u0e17\u0e48\u0e32",
      receive0: "\u0e23\u0e31\u0e1a",
      go: "\u0e44\u0e1b"
    }, _module$exports["cancel"] = "\u0e22\u0e01\u0e40\u0e25\u0e34\u0e01", _module$exports.next_level = "\u0e23\u0e30\u0e14\u0e31\u0e1a\u0e16\u0e31\u0e14\u0e44\u0e1b", 
    _module$exports.guide = "\u0e41\u0e19\u0e30\u0e19\u0e33", _module$exports.receive1 = "\u0e23\u0e31\u0e1a", 
    _module$exports.score = "\u0e04\u0e30\u0e41\u0e19\u0e19", _module$exports.get = "\u0e23\u0e31\u0e1a", 
    _module$exports.friend = "\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e19", _module$exports["login"] = {
      noAccount: "\u0e44\u0e21\u0e48\u0e21\u0e35\u0e1a\u0e31\u0e0d\u0e0a\u0e35 \u0e42\u0e1b\u0e23\u0e14\u0e2a\u0e23\u0e49\u0e32\u0e07!"
    }, _module$exports["sign"] = {
      "double rewards": "\u0e23\u0e32\u0e07\u0e27\u0e31\u0e25\u0e41\u0e2b\u0e48\u0e07\u0e01\u0e32\u0e23\u0e41\u0e1a\u0e48\u0e07\u0e1b\u0e31\u0e19 X2",
      "day%{value}": "Day%{value}"
    }, _module$exports["fight"] = {
      fightStartAdAsk: "\u0e14\u0e39\u0e42\u0e06\u0e29\u0e13\u0e32\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e23\u0e31\u0e1a\u0e42\u0e1a\u0e19\u0e31\u0e2a?",
      fightOverAdAsk: "\u0e14\u0e39\u0e42\u0e06\u0e29\u0e13\u0e32\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e23\u0e31\u0e1a 5 \u0e02\u0e31\u0e49\u0e19\u0e15\u0e2d\u0e19\u0e1e\u0e34\u0e40\u0e28\u0e29?",
      highest: "\u0e2a\u0e39\u0e07\u0e2a\u0e38\u0e14:",
      propExceedMaxTimes: "\u0e16\u0e36\u0e07\u0e02\u0e35\u0e14\u0e08\u0e33\u0e01\u0e31\u0e14 \u0e44\u0e21\u0e48\u0e21\u0e35\u0e40\u0e2d\u0e1f\u0e40\u0e1f\u0e01\u0e15\u0e4c\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e40\u0e15\u0e34\u0e21\u0e2a\u0e33\u0e2b\u0e23\u0e31\u0e1a\u0e23\u0e2d\u0e1a\u0e19\u0e35\u0e49",
      propNoEnough: "\u0e2d\u0e38\u0e1b\u0e01\u0e23\u0e13\u0e4c\u0e1b\u0e23\u0e30\u0e01\u0e2d\u0e1a\u0e09\u0e32\u0e01\u0e16\u0e39\u0e01\u0e43\u0e0a\u0e49\u0e2b\u0e21\u0e14\u0e41\u0e25\u0e49\u0e27!",
      needCollect: "\u0e04\u0e38\u0e13\u0e22\u0e31\u0e07\u0e15\u0e49\u0e2d\u0e07\u0e23\u0e27\u0e1a\u0e23\u0e27\u0e21"
    }, _module$exports["lottery"] = {
      lotteryNotEnoughGetLotteries: "\u0e15\u0e31\u0e4b\u0e27\u0e44\u0e21\u0e48\u0e1e\u0e2d! \u0e04\u0e25\u0e34\u0e01\u0e1b\u0e38\u0e48\u0e21\u0e14\u0e49\u0e32\u0e19\u0e25\u0e48\u0e32\u0e07\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e23\u0e31\u0e1a\u0e15\u0e31\u0e4b\u0e27\u0e40\u0e1e\u0e34\u0e48\u0e21",
      noChargePleaseWait: "\u0e40\u0e23\u0e47\u0e27\u0e46 \u0e19\u0e35\u0e49",
      waitForLoadingAds: "\u0e01\u0e33\u0e25\u0e31\u0e07\u0e42\u0e2b\u0e25\u0e14\u0e42\u0e06\u0e29\u0e13\u0e32...",
      "still%{value}winLottery": "<color=#ffffff>\u0e21\u0e35\u0e42\u0e2d\u0e01\u0e32\u0e2a <color=#7dd5ff>%{value}</color> \u0e17\u0e35\u0e48\u0e08\u0e30\u0e16\u0e39\u0e01\u0e25\u0e2d\u0e15\u0e40\u0e15\u0e2d\u0e23\u0e35\u0e48</color>"
    }, _module$exports["pve"] = {
      cannotSkipLastLevel: "Please finish the previous checkpoints first!",
      highest: "\u0e2a\u0e39\u0e07\u0e2a\u0e38\u0e14",
      unLockProp: "\u0e0a\u0e48\u0e27\u0e22\u0e17\u0e33\u0e14\u0e48\u0e32\u0e19\u0e01\u0e48\u0e2d\u0e19\u0e2b\u0e19\u0e49\u0e32\u0e43\u0e2b\u0e49\u0e40\u0e2a\u0e23\u0e47\u0e08\u0e01\u0e48\u0e2d\u0e19!"
    }, _module$exports["task"] = {
      notExist: "\u0e44\u0e21\u0e48\u0e21\u0e35\u0e07\u0e32\u0e19",
      succeed: "\u0e07\u0e32\u0e19\u0e40\u0e2a\u0e23\u0e47\u0e08\u0e2a\u0e34\u0e49\u0e19",
      fail: "\u0e07\u0e32\u0e19\u0e44\u0e21\u0e48\u0e40\u0e2a\u0e23\u0e47\u0e08"
    }, _module$exports["prop"] = {
      prop: "\u0e23\u0e31\u0e1a\u0e2d\u0e38\u0e1b\u0e01\u0e23\u0e13\u0e4c\u0e1b\u0e23\u0e30\u0e01\u0e2d\u0e1a\u0e09\u0e32\u0e01",
      lackGold: "\u0e02\u0e32\u0e14\u0e17\u0e2d\u0e07",
      hammer: "\u0e04\u0e49\u0e2d\u0e19",
      magic: "\u0e21\u0e32\u0e22\u0e32\u0e01\u0e25",
      refresh: "\u0e23\u0e35\u0e40\u0e1f\u0e23\u0e0a",
      infinite: "\u0e44\u0e21\u0e48\u0e21\u0e35\u0e17\u0e35\u0e48\u0e2a\u0e34\u0e49\u0e19\u0e2a\u0e38\u0e14",
      get: "\u0e44\u0e14\u0e49\u0e23\u0e31\u0e1a %{name} x%{num}"
    }, _module$exports["table_prop"] = {
      "\u9524\u5b50": "\u0e04\u0e49\u0e2d\u0e19",
      "\u9b54\u6cd5\u68d2": "\u0e21\u0e32\u0e22\u0e32\u0e01\u0e25",
      "\u5237\u65b0": "\u0e23\u0e35\u0e40\u0e1f\u0e23\u0e0a",
      "\u65e0\u9650": "\u0e44\u0e21\u0e48\u0e21\u0e35\u0e17\u0e35\u0e48\u0e2a\u0e34\u0e49\u0e19\u0e2a\u0e38\u0e14",
      "\u6d88\u9664\u9009\u62e9\u76841\u4e2a\u86cb\u7cd5\uff0c\u6bcf\u5c40\u9650\u75283\u4e2a.": "\u0e19\u0e33\u0e40\u0e04\u0e49\u0e01\u0e17\u0e35\u0e48\u0e40\u0e25\u0e37\u0e2d\u0e01\u0e2d\u0e2d\u0e01 3 \u0e04\u0e23\u0e31\u0e49\u0e07\u0e15\u0e48\u0e2d\u0e40\u0e01\u0e21",
      "\u8d4b\u4e88\u9009\u62e9\u76841\u4e2a\u86cb\u7cd5\u76f4\u7ebf\u7279\u6548\uff0c\u6bcf\u5c40\u9650\u75281\u4e2a.": "\u0e43\u0e2b\u0e49\u0e40\u0e2d\u0e1f\u0e40\u0e1f\u0e01\u0e15\u0e4c\u0e40\u0e04\u0e49\u0e01\u0e40\u0e1b\u0e47\u0e19\u0e40\u0e2a\u0e49\u0e19\u0e15\u0e23\u0e07 \u0e40\u0e01\u0e21\u0e25\u0e30 1 \u0e04\u0e23\u0e31\u0e49\u0e07",
      "\u91cd\u65b0\u6392\u5217\u6e38\u620f\u533a\u5185\u6240\u6709\u86cb\u7cd5\uff0c\u6bcf\u5c40\u9650\u75283\u6b21.": "\u0e23\u0e35\u0e40\u0e1f\u0e23\u0e0a 3 \u0e04\u0e23\u0e31\u0e49\u0e07\u0e15\u0e48\u0e2d\u0e40\u0e01\u0e21",
      "\u4f7f\u7528\u540e\u672c\u5173\u4e0d\u518d\u9650\u5236\u6e38\u620f\u6b65\u6570,\u6bcf\u5c40\u9650\u75281\u4e2a.": "\u0e02\u0e31\u0e49\u0e19\u0e15\u0e2d\u0e19\u0e08\u0e30\u0e44\u0e21\u0e48\u0e21\u0e35\u0e17\u0e35\u0e48\u0e2a\u0e34\u0e49\u0e19\u0e2a\u0e38\u0e14 1 \u0e04\u0e23\u0e31\u0e49\u0e07\u0e15\u0e48\u0e2d\u0e40\u0e01\u0e21"
    }, _module$exports["rank"] = {
      shareTitle: "Cake Crush"
    }, _module$exports["onlineReward"] = {
      receive: "\u0e44\u0e14\u0e49\u0e23\u0e31\u0e1a\u0e21\u0e31\u0e19"
    }, _module$exports["shop"] = {
      receive: "\u0e44\u0e14\u0e49\u0e23\u0e31\u0e1a\u0e21\u0e31\u0e19"
    }, _module$exports);
    cc._RF.pop();
  }, {} ],
  tl: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "24ffcptsUVFgZ8Y9bftNhXb", "tl");
    "use strict";
    var _module$exports;
    module.exports = (_module$exports = {
      current: "Current language: ",
      create_language: "New language",
      language: "Language",
      create: "Create",
      cancel: "Cancel",
      startgame: "Simulan ang Laro",
      unlock_props: "I-unlock ang mga props",
      get_boosters: "kumuha ng boosters",
      lottery_turntable: "Turntable ng lottery",
      out_of_moves: "wala ng galaw",
      moves: "gumagalaw",
      sets: "set",
      ok: "ok",
      buy: "bumili",
      daily_reward: "araw-araw na gantimpala",
      get_double: "makakuha ng doble",
      receive0: "tumanggap",
      go: "pumunta ka"
    }, _module$exports["cancel"] = "kanselahin", _module$exports.next_level = "susunod na antas", 
    _module$exports.guide = "gabay", _module$exports.receive1 = "tumanggap", _module$exports.score = "puntos", 
    _module$exports.get = "makuha", _module$exports.friend = "kaibigan", _module$exports["login"] = {
      noAccount: "Walang account, mangyaring lumikha!"
    }, _module$exports["sign"] = {
      "double rewards": "Pagbabahagi ng Award X2",
      "day%{value}": "Day%{value}"
    }, _module$exports["fight"] = {
      fightStartAdAsk: "Manood ng mga ad para makakuha ng mga bonus?",
      fightOverAdAsk: "manood ng mga ad para makakuha ng 5 karagdagang hakbang?",
      highest: "pinakamataas: ",
      propExceedMaxTimes: "Abutin ang limitasyon. Wala nang mga epekto para sa round na ito.",
      propNoEnough: "Naubos na ang props!",
      needCollect: "Kailangan mo pang mangolekta"
    }, _module$exports["lottery"] = {
      lotteryNotEnoughGetLotteries: "Walang sapat na mga tiket! I-click ang button sa ibaba upang makakuha ng higit pang mga tiket.",
      noChargePleaseWait: "Malapit na",
      waitForLoadingAds: "Naglo-load ang mga ad...",
      "still%{value}winLottery": "<color=#ffffff>Mayroong <color=#7dd5ff>%{value}</color> pang pagkakataong makakuha ng tiket sa lottery</color>"
    }, _module$exports["pve"] = {
      cannotSkipLastLevel: "Pakitapusin muna ang mga nakaraang checkpoint!",
      highest: "Pinakamataas",
      unLockProp: "Binabati kita sa pag-unlock ng prop."
    }, _module$exports["task"] = {
      notExist: "Walang gawain",
      succeed: "Natapos na ang gawain",
      fail: "Hindi natapos ang gawain"
    }, _module$exports["prop"] = {
      prop: "Kumuha ng props",
      lackGold: "kakulangan ng ginto",
      hammer: "martilyo",
      magic: "mahika",
      refresh: "refresh",
      infinite: "walang hanggan",
      get: "makakuha ng %{name} x%{num}"
    }, _module$exports["table_prop"] = {
      "\u9524\u5b50": "Martilyo",
      "\u9b54\u6cd5\u68d2": "Magic",
      "\u5237\u65b0": "Refresh",
      "\u65e0\u9650": "Walang katapusan",
      "\u6d88\u9664\u9009\u62e9\u76841\u4e2a\u86cb\u7cd5\uff0c\u6bcf\u5c40\u9650\u75283\u4e2a.": "Alisin ang napiling cake. 3 beses bawat laro.",
      "\u8d4b\u4e88\u9009\u62e9\u76841\u4e2a\u86cb\u7cd5\u76f4\u7ebf\u7279\u6548\uff0c\u6bcf\u5c40\u9650\u75281\u4e2a.": "Bigyan ng straight line effect ang cake. 1 beses bawat laro.",
      "\u91cd\u65b0\u6392\u5217\u6e38\u620f\u533a\u5185\u6240\u6709\u86cb\u7cd5\uff0c\u6bcf\u5c40\u9650\u75283\u6b21.": "I-refresh. 3 beses bawat laro.",
      "\u4f7f\u7528\u540e\u672c\u5173\u4e0d\u518d\u9650\u5236\u6e38\u620f\u6b65\u6570,\u6bcf\u5c40\u9650\u75281\u4e2a.": "Ang mga hakbang ay magiging walang hanggan, 1 beses sa bawat laro."
    }, _module$exports["rank"] = {
      shareTitle: "Cake Crush"
    }, _module$exports["onlineReward"] = {
      receive: "Tanggapin mo"
    }, _module$exports["shop"] = {
      receive: "Tanggapin mo"
    }, _module$exports);
    cc._RF.pop();
  }, {} ],
  tw: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "811dfif1rpBcK4J5w8rJiyP", "tw");
    "use strict";
    var _module$exports;
    module.exports = (_module$exports = {
      current: "\u7576\u524d\u8a9e\u8a00\uff1a",
      create_language: "\u5275\u5efa\u65b0\u8a9e\u8a00",
      language: "\u8a9e\u8a00\u540d\u7a31",
      create: "\u5275\u5efa",
      cancel: "\u53d6\u6d88",
      startgame: "\u958b\u59cb\u904a\u6232",
      unlock_props: "\u89e3\u9396\u9053\u5177",
      get_boosters: "\u7372\u5f97\u7279\u6548",
      lottery_turntable: "\u5e78\u904b\u5927\u8f49\u76e4",
      out_of_moves: "\u6b65\u6578\u4e0d\u8db3",
      moves: "\u6b65\u6578",
      sets: "\u8a2d\u7f6e",
      ok: "\u78ba\u5b9a",
      buy: "\u8cfc\u8cb7",
      daily_reward: "\u6bcf\u65e5\u767b\u9678",
      get_double: "\u96d9\u500d\u9818\u53d6",
      receive0: "\u666e\u901a\u9818\u53d6",
      go: "\u62bd\u734e"
    }, _module$exports["cancel"] = "\u53d6\u6d88", _module$exports.next_level = "\u4e0b\u4e00\u95dc", 
    _module$exports.guide = "\u5f15\u5c0e", _module$exports.receive1 = "\u9818\u53d6", 
    _module$exports.score = "\u5206\u6578", _module$exports.get = "\u88dc\u7c3d", _module$exports.friend = "\u597d\u53cb", 
    _module$exports["login"] = {
      noAccount: "\u6c92\u6709\u8cec\u6236,\u8acb\u5275\u5efa"
    }, _module$exports["sign"] = {
      "double rewards": "\u5206\u4eab\u734e\u52f5\u6578\u91cfX2",
      "day%{value}": " \u7b2c%{value}\u5929"
    }, _module$exports["fight"] = {
      fightStartAdAsk: "\u89c0\u770b\u5ee3\u544a\u53ef\u7372\u5f972\u500b\u96a8\u6a5f\u6548\u679c\uff0c\u662f\u5426\u89c0\u770b\uff1f",
      fightOverAdAsk: "\u6b65\u6578\u4e0d\u8db3!\u89c0\u770b\u5ee3\u544a\u53ef\u984d\u5916\u7372\u5f975\u6b65\uff0c\u662f\u5426\u89c0\u770b\uff1f",
      highest: "\u6700\u9ad8\u5206: ",
      propExceedMaxTimes: "\u8a72\u9053\u5177\u5df2\u7d93\u8d85\u904e\u672c\u5c40\u6700\u5927\u53ef\u7528\u6b21\u6578",
      propNoEnough: "\u8a72\u9053\u5177\u5df2\u7528\u5b8c\uff0c\u5feb\u53bb\u8cfc\u8cb7\u5427!",
      needCollect: "\u4f60\u9084\u9700\u6536\u96c6"
    }, _module$exports["lottery"] = {
      lotteryNotEnoughGetLotteries: "\u734e\u5238\u4e0d\u8db3!\u9ede\u64ca\u4e0b\u65b9\u6309\u9215\u7372\u5f97\u66f4\u591a\u734e\u5238",
      noChargePleaseWait: "\u66ab\u672a\u958b\u653e\u5145\u503c\u529f\u80fd\uff0c\u656c\u8acb\u671f\u5f85",
      waitForLoadingAds: "\u6b63\u5728\u52a0\u8f09\u5ee3\u544a\uff0c\u8acb\u9a37\u7b49",
      "still%{value}winLottery": "<color=#ffffff>\u9084\u6709<color=#7dd5ff>%{value}</color>\u6b21\u7372\u5f97\u734e\u5238\u7684\u6a5f\u6703</color>"
    }, _module$exports["pve"] = {
      cannotSkipLastLevel: "\u4e0d\u80fd\u8df3\u904e\u672a\u901a\u95dc\u7684\u95dc\u5361",
      highest: "\u6700\u9ad8\u5206",
      unLockProp: "\u606d\u559c\u89e3\u9396\u9053\u5177"
    }, _module$exports["task"] = {
      notExist: "\u4efb\u52d9\u4e0d\u5b58\u5728",
      succeed: "\u4efb\u52d9\u9818\u53d6\u6210\u529f",
      fail: "\u4efb\u52d9\u672a\u5b8c\u6210"
    }, _module$exports["prop"] = {
      prop: "\u9053\u5177",
      lackGold: "\u91d1\u5e63\u4e0d\u8db3",
      hammer: "\u9318\u5b50",
      magic: "\u9b54\u6cd5\u68d2",
      refresh: "\u5237\u65b0",
      infinite: "\u7121\u9650",
      get: "\u7372\u5f97%{name}x%{num}"
    }, _module$exports["table_prop"] = {
      "\u9524\u5b50": "\u9318\u5b50",
      "\u9b54\u6cd5\u68d2": "\u9b54\u6cd5\u68d2",
      "\u5237\u65b0": "\u5237\u65b0",
      "\u65e0\u9650": "\u7121\u9650",
      "\u6d88\u9664\u9009\u62e9\u76841\u4e2a\u86cb\u7cd5\uff0c\u6bcf\u5c40\u9650\u75283\u4e2a.": "\u6d88\u9664\u9078\u64c7\u76841\u500b\u86cb\u7cd5\uff0c\u6bcf\u5c40\u9650\u75283\u500b.",
      "\u8d4b\u4e88\u9009\u62e9\u76841\u4e2a\u86cb\u7cd5\u76f4\u7ebf\u7279\u6548\uff0c\u6bcf\u5c40\u9650\u75281\u4e2a.": "\u8ce6\u4e88\u9078\u64c7\u76841\u500b\u86cb\u7cd5\u76f4\u7dda\u7279\u6548\uff0c\u6bcf\u5c40\u9650\u75281\u500b.",
      "\u91cd\u65b0\u6392\u5217\u6e38\u620f\u533a\u5185\u6240\u6709\u86cb\u7cd5\uff0c\u6bcf\u5c40\u9650\u75283\u6b21.": "\u91cd\u65b0\u6392\u5217\u904a\u6232\u5340\u5167\u6240\u6709\u86cb\u7cd5\uff0c\u6bcf\u5c40\u9650\u75283\u6b21.",
      "\u4f7f\u7528\u540e\u672c\u5173\u4e0d\u518d\u9650\u5236\u6e38\u620f\u6b65\u6570,\u6bcf\u5c40\u9650\u75281\u4e2a.": "\u4f7f\u7528\u5f8c\u672c\u95dc\u4e0d\u518d\u9650\u5236\u904a\u6232\u6b65\u6578,\u6bcf\u5c40\u9650\u75281\u500b."
    }, _module$exports["rank"] = {
      shareTitle: "\u86cb\u7cd5\u9023\u63a5"
    }, _module$exports["onlineReward"] = {
      receive: "\u7acb\u5373\u9818\u53d6"
    }, _module$exports["shop"] = {
      receive: "\u7acb\u5373\u9818\u53d6"
    }, _module$exports);
    cc._RF.pop();
  }, {} ],
  "use_v2.1-2.2.1_cc.Toggle_event": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8f80904ZXRP+YEk1vrJmPj+", "use_v2.1-2.2.1_cc.Toggle_event");
    "use strict";
    cc.Toggle && (cc.Toggle._triggerEventInScript_isChecked = true);
    cc._RF.pop();
  }, {} ],
  vi: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "83529ttr6FLJ4/PBJC2HHQR", "vi");
    "use strict";
    var _module$exports;
    module.exports = (_module$exports = {
      current: "Current language: ",
      create_language: "New language",
      language: "Language",
      create: "Create",
      cancel: "Cancel",
      startgame: "B\u1eaft \u0111\u1ea7u tr\xf2 ch\u01a1i",
      unlock_props: "M\u1edf kh\xf3a \u0111\u1ea1o c\u1ee5",
      get_boosters: "l\u1ea5y t\xean l\u1eeda \u0111\u1ea9y",
      lottery_turntable: "B\xe0n quay x\u1ed5 s\u1ed1",
      out_of_moves: "ngo\xe0i t\u1ea7m di chuy\u1ec3n",
      moves: "di chuy\u1ec3n",
      sets: "b\u1ed9",
      ok: "V\xe2ng",
      buy: "mua",
      daily_reward: "ph\u1ea7n th\u01b0\u1edfng h\xe0ng ng\xe0y",
      get_double: "nh\u1eadn \u0111\u01b0\u1ee3c g\u1ea5p \u0111\xf4i",
      receive0: "nh\u1eadn",
      go: "\u0111i"
    }, _module$exports["cancel"] = "s\u1ef1 h\u1ee7y b\u1ecf", _module$exports.next_level = "c\u1ea5p \u0111\u1ed9 ti\u1ebfp theo", 
    _module$exports.guide = "h\u01b0\u1edbng d\u1eabn", _module$exports.receive1 = "nh\u1eadn", 
    _module$exports.score = "ghi b\xe0n", _module$exports.get = "l\u1ea5y", _module$exports.friend = "b\u1ea1n b\xe8", 
    _module$exports["login"] = {
      noAccount: "Kh\xf4ng c\xf3 t\xe0i kho\u1ea3n, vui l\xf2ng t\u1ea1o!"
    }, _module$exports["sign"] = {
      "double rewards": "Gi\u1ea3i th\u01b0\u1edfng chia s\u1ebb X2",
      "day%{value}": "Day%{value}"
    }, _module$exports["fight"] = {
      fightStartAdAsk: "Xem qu\u1ea3ng c\xe1o \u0111\u1ec3 nh\u1eadn ti\u1ec1n th\u01b0\u1edfng?",
      fightOverAdAsk: "xem qu\u1ea3ng c\xe1o \u0111\u1ec3 c\xf3 th\xeam 5 b\u01b0\u1edbc?",
      highest: "cao nh\u1ea5t: ",
      propExceedMaxTimes: "\u0110\u1ea1t \u0111\u1ebfn gi\u1edbi h\u1ea1n. Kh\xf4ng c\xf2n hi\u1ec7u \u1ee9ng cho v\xf2ng n\xe0y.",
      propNoEnough: "C\xe1c \u0111\u1ea1o c\u1ee5 \u0111\xe3 \u0111\u01b0\u1ee3c s\u1eed d\u1ee5ng h\u1ebft!",
      needCollect: "B\u1ea1n v\u1eabn c\u1ea7n thu th\u1eadp"
    }, _module$exports["lottery"] = {
      lotteryNotEnoughGetLotteries: "Kh\xf4ng \u0111\u1ee7 v\xe9! Nh\u1ea5p v\xe0o n\xfat b\xean d\u01b0\u1edbi \u0111\u1ec3 nh\u1eadn th\xeam v\xe9.",
      noChargePleaseWait: "S\u1eafp c\xf3",
      waitForLoadingAds: "\u0110ang t\u1ea3i qu\u1ea3ng c\xe1o...",
      "still%{value}winLottery": "<color=#ffffff>C\xf3 th\xeam <color=#7dd5ff>%{value}</color> c\u01a1 h\u1ed9i nh\u1eadn \u0111\u01b0\u1ee3c v\xe9 s\u1ed1</color>"
    }, _module$exports["pve"] = {
      cannotSkipLastLevel: "Vui l\xf2ng ho\xe0n th\xe0nh c\xe1c \u0111i\u1ec3m ki\u1ec3m tra tr\u01b0\u1edbc \u0111\xf3 tr\u01b0\u1edbc!",
      highest: "Cao nh\u1ea5t",
      unLockProp: "Ch\xfac m\u1eebng b\u1ea1n \u0111\xe3 m\u1edf kh\xf3a ch\u1ed7 d\u1ef1a."
    }, _module$exports["task"] = {
      notExist: "Nhi\u1ec7m v\u1ee5 kh\xf4ng t\u1ed3n t\u1ea1i",
      succeed: "Nhi\u1ec7m v\u1ee5 ho\xe0n th\xe0nh",
      fail: "Nhi\u1ec7m v\u1ee5 ch\u01b0a ho\xe0n th\xe0nh"
    }, _module$exports["prop"] = {
      prop: "Nh\u1eadn \u0111\u1ea1o c\u1ee5",
      lackGold: "thi\u1ebfu v\xe0ng",
      hammer: "c\xe2y b\xfaa",
      magic: "ma thu\u1eadt",
      refresh: "L\xe0m t\u01b0\u01a1i",
      infinite: "v\xf4 h\u1ea1n",
      get: "l\u1ea5y %{name} x%{num}"
    }, _module$exports["table_prop"] = {
      "\u9524\u5b50": "C\xe2y b\xfaa",
      "\u9b54\u6cd5\u68d2": "\u1ea2o thu\u1eadt",
      "\u5237\u65b0": "L\xe0m m\u1edbi",
      "\u65e0\u9650": "v\xf4 h\u1ea1n",
      "\u6d88\u9664\u9009\u62e9\u76841\u4e2a\u86cb\u7cd5\uff0c\u6bcf\u5c40\u9650\u75283\u4e2a.": "B\u1ecf chi\u1ebfc b\xe1nh \u0111\xe3 ch\u1ecdn. 3 l\u1ea7n m\u1ed7i v\xe1n.",
      "\u8d4b\u4e88\u9009\u62e9\u76841\u4e2a\u86cb\u7cd5\u76f4\u7ebf\u7279\u6548\uff0c\u6bcf\u5c40\u9650\u75281\u4e2a.": "T\u1ea1o hi\u1ec7u \u1ee9ng \u0111\u01b0\u1eddng th\u1eb3ng cho chi\u1ebfc b\xe1nh. 1 l\u1ea7n m\u1ed7i tr\xf2 ch\u01a1i.",
      "\u91cd\u65b0\u6392\u5217\u6e38\u620f\u533a\u5185\u6240\u6709\u86cb\u7cd5\uff0c\u6bcf\u5c40\u9650\u75283\u6b21.": "L\xe0m m\u1edbi. 3 l\u1ea7n m\u1ed7i tr\xf2 ch\u01a1i.",
      "\u4f7f\u7528\u540e\u672c\u5173\u4e0d\u518d\u9650\u5236\u6e38\u620f\u6b65\u6570,\u6bcf\u5c40\u9650\u75281\u4e2a.": "C\xe1c b\u01b0\u1edbc s\u1ebd l\xe0 v\xf4 h\u1ea1n, 1 l\u1ea7n m\u1ed7i tr\xf2 ch\u01a1i."
    }, _module$exports["rank"] = {
      shareTitle: "Cake Crush"
    }, _module$exports["onlineReward"] = {
      receive: "Nh\u1eadn n\xf3"
    }, _module$exports["shop"] = {
      receive: "Nh\u1eadn n\xf3"
    }, _module$exports);
    cc._RF.pop();
  }, {} ],
  zh: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "50a61pPsYlIoIFvhG9GLTbm", "zh");
    "use strict";
    var _module$exports;
    module.exports = (_module$exports = {
      Tips: {
        Tips: "\u63d0\u793a",
        LoginTips: "\u4f60\u7684\u767b\u5f55\u4fe1\u606f\u5df2\u7ecf\u8fc7\u671f, \u4f60\u9700\u8981\u91cd\u65b0\u767b\u5f55\u5417?",
        ExitTips: "\u4f60\u662f\u5426\u786e\u5b9a\u9000\u51fa?"
      },
      Canncel: "\u53d6\u6d88",
      Account: "\u8d26\u53f7\u7ba1\u7406",
      ChangeHead: "\u4fee\u6539\u5934\u50cf",
      ChangeNick: "\u4fee\u6539\u6635\u79f0",
      ChangePassWord: "\u4fee\u6539\u767b\u5f55\u5bc6\u7801",
      ChangeConfirm: "\u786e\u5b9a\u4fee\u6539",
      Login: "\u767b\u9646",
      Phone: "\u624b\u673a:",
      EnterPhone: "\u8bf7\u8f93\u5165\u624b\u673a",
      Code0: "\u9a8c\u8bc1\u7801:",
      Code: "\u9a8c\u8bc1\u7801",
      HintCode: "\u9a8c\u8bc1\u7801",
      PassWord: "\u5bc6\u7801:",
      HintPassWord: "\u8bf7\u8f93\u51658-20\u4f4d\u5bc6\u7801",
      InviteCode: "\u9080\u8bf7\u7801:",
      HintInviteCode: "\u8bf7\u8f93\u5165\u9080\u8bf7\u7801",
      ChangeNickTips: "\u6635\u79f0\u4e0d\u80fd\u8d85\u8fc730\u4e2a\u5b57\u7b26\uff0c\u9996\u6b21\u4fee\u6539\u514d\u8d39",
      Shop: {
        Fort: "\u70ae\u53f0",
        Tool: "\u9053\u5177",
        Shop: "\u5546\u57ce",
        LimitedTimeGoods: "\u9650\u65f6\u8d2d\u4e70",
        TipsBuy: "\u60a8\u786e\u5b9a\u8981\u8d2d\u4e70?",
        Buy: "\u8d2d\u4e70"
      },
      Email: {
        Email: "Email",
        SystemEmail: "\u7cfb\u7edf\u901a\u77e5",
        DayDividend: "\u6bcf\u65e5\u5206\u7ea2",
        Leaderboard: "Leaderboard reward",
        Receive: "\u9886\u53d6",
        ClickOneDelete: "\u4e00\u952e\u5220\u9664",
        Delete: "\u5220\u9664"
      },
      UserInfo: {
        Phone: "\u624b\u673a:",
        ID: "ID:",
        Invite: "\u9080\u8bf7\u7801:"
      },
      Friend: {
        InviteInstruction: "\u9080\u8bf7\u597d\u53cb\u8bf4\u660e",
        Promote: "\u63a8\u5e7f",
        Subordinate: "\u4e0b\u7ea7",
        InfoSub: "\u5f53\u524d\u4e0b\u7ea7:",
        InfoSubRule: "\u901a\u8fc7\u9080\u8bf7\u94fe\u63a5\u6ce8\u518c\u7528\u6237",
        InfoProRule: "\u5145\u503c\u8981\u6c421000\uff0c\u6d88\u8d39\u8981\u6c421000",
        InfoEffectPro: "effective promotion: ",
        InfoAct: "\u6628\u65e5\u6d3b\u8dc3\u4e0b\u7ea7",
        InfoActValue: "\u6d3b\u8dc3\u503c",
        No: "\u5e8f\u53f7",
        Name: "\u540d\u5b57",
        recharge: "\u5151\u6362",
        Consumption: "\u6d88\u8d39",
        active: "\u6d3b\u8dc3",
        dividends: "\u5206\u7ea2",
        register: "\u8fd9\u518c",
        login: "\u767b\u5f55",
        operate: "\u64cd\u4f5c"
      },
      Turtle: {
        AdvanceSynth: "\u9ad8\u7ea7\u5408\u6210",
        GeneralSynth: "\u666e\u901a\u5408\u6210",
        TxtTurtleInstrution: "Level {0} diviends turtle can get {1}% of the income of the lower level every day",
        Grade: "Lv{0} ",
        Per: "(Synthesis rate {0}%)"
      },
      Fort: {
        ChangeFort: "\u66f4\u6362",
        Update: "\u5347\u7ea7",
        GradeHead: "\u7b49\u7ea7:",
        PriceHead: "\u4ef7\u683c:",
        PowerHead: "\u80fd\u91cf\u503c:",
        ResidualPowerHead: "Residual energy:",
        BulletHead: "\u5b50\u5f39\u6d88\u8017:",
        RarityHead: "Rarity:",
        DailyBonusHead: "\u6bcf\u65e5\u6536\u76ca:",
        ExpireDateHead: "\u6709\u6548\u671f:",
        UpdateCon: "recharge {0},lockout amount {1},invite {2}"
      },
      Hall: {
        BindPhone: "\u7ed1\u5b9a\u53f7\u7801",
        Login: "\u767b\u5f55"
      },
      Ylb: {
        Apply: "Apply",
        Subscribe: "Subscribe",
        curQuota: "currently available quota: ",
        ApplicationQuota: "Application quota: ",
        Application: "Application: ",
        Annualized: "annualized: ",
        All: "all",
        LockWarehouse: "Lock Coins to Earn",
        MyCoins: "My coins",
        HistoricalLock: "Historical lock",
        ProductList: "Product List",
        Product: "Product",
        Income: "income",
        Term: "term",
        Operate: "operate",
        Purchase: "purchase",
        SoldOut: "sold out",
        ProductDetails: "Product Details",
        Yulibao: "Yulibao",
        HeadAnnualized: "Reference annualized:",
        HeadTerm: "term:",
        HeadState: "State:",
        HeadApply: "Can apply:",
        HeadProsecute: "Prosecute:",
        HeadPurchaseTime: "Purchase time:",
        HeadRiseTime: "Rise time:",
        HeadIncomeDistribution: "Income distribution:",
        HeadMaturityTime: "Maturity time:",
        HeadSettlementTime: "Settlement time:",
        HeadRedemptionCycleTime: "Redemption cycle time:",
        HeadCurEaring: "Current earnings:",
        HeadInvestmentAmount: "Investment amount:",
        State: "state"
      },
      Confirm: "\u786e\u5b9a",
      GetCode: "\u83b7\u53d6\u9a8c\u8bc1\u7801",
      ResetPassW: "\u91cd\u7f6e\u5bc6\u7801"
    }, _module$exports["Login"] = "\u767b\u9646", _module$exports.ForgetPw = "\u5fd8\u8bb0\u5bc6\u7801?", 
    _module$exports.BindPhone = "\u7ed1\u5b9a\u624b\u673a", _module$exports.InvalidPhone = "\u8f93\u5165\u65e0\u6548\u53f7\u7801", 
    _module$exports.InvalidCode = "\u8f93\u5165\u65e0\u6548\u9a8c\u8bc1\u7801", _module$exports.InvalidPassWord = "\u8f93\u5165\u65e0\u6548\u5bc6\u7801", 
    _module$exports.InvalidNick = "\u8f93\u5165\u65e0\u6548\u6635\u79f0", _module$exports);
    cc._RF.pop();
  }, {} ]
}, {}, [ "GameEngine", "GameGlobal", "BaseClass", "BaseCtrl", "BaseModel", "BasePanel", "BasePlatform", "BaseScene", "BaseView", "BaseWindows", "Singleton", "Adapter", "ArcMask", "CustomMask", "FontLabel", "LoadingUI", "MessageBoxView", "NestablePageView_Outer", "NestableScrollView_Inner", "NestableScrollView_Outer", "RollNumber", "RoundRectMask", "WaitingUI", "buttonEx", "elasticLimit", "gridView", "AdConst", "ConfigConst", "EventConst", "GuideConst", "LanguageConst", "ResConst", "SceneConst", "SoundConst", "SystemConst", "ViewConst", "LayerType", "AdManager", "ConfigManager", "EventManager", "HttpManager", "HttpManagerOld", "HttpVo", "LanguageManager", "LocalManager", "PlatformManager", "PoolManager", "ResourceManager", "SceneManager", "SocketManager", "SoundManager", "SystemManager", "TimerManager", "TipManager", "ViewManager", "SprotoParser", "BitUtil", "ProtocolFunDict", "SByteArray", "Spackage", "Sproto", "SprotoConst", "SprotoCore", "SprotoPack", "SprotoReceiver", "SprotoSender", "SprotoStream", "SprotoTypeBase", "SprotoTypeDeserialize", "SprotoTypeReader", "SprotoTypeSerialize", "CallLater", "LaterHandler", "TimerHandler", "Dictionary", "LogUtil", "PathMoveUtil", "TextUtil", "TimeUtil", "UIUtil", "Utils", "XXTEA", "lodash", "stopPropagation", "FortItemDetailComp", "PropsItemDetailComp", "RedpackItemComp", "FortConst", "HallConst", "HallHttpConst", "PropConst", "GameCtrl", "HallCtrl", "LoadingCtrl", "LoginCtrl", "eventListener", "NoticeVo", "GameDataManager", "GameModel", "HallModel", "LoadingModel", "LoginModel", "FishGameScene", "GameScene", "HallScene", "LoadingScene", "LoginScene", "CommonTipsView", "AddCoinNumView", "BatteryView", "BonusTortoiseView", "BoomView", "BulletView", "ChangeBatteryItemView", "CoinFlyToSeat", "DividedTurtleView", "FishCommonTipsView", "FishGameView", "FishView", "IllustratedHandbookView", "MiddleFishDieView", "PropLayoutView", "SeatPlayerInfoView", "SeatView", "LightningSprite", "WJAssembler2D", "WJMultiAssembler", "AccountView", "BackpackView", "BindPhoneView", "BonusTurtleRuleView", "BonusTurtleView", "BuyDetailView", "BuyPropDetailView", "ChangeHeadView", "ChangeNickView", "ChangePassWordView", "EmailView", "ExitTipsView", "ForgetPassWordView", "FortDetailView", "FortUpdateView", "FriendAccountDetailView", "FriendCongrateTipsView", "FriendInstructionView", "FriendInviteView", "HallView", "LoginTipsView", "LoginView", "MailView", "MyFormData", "ShopView", "SynthesisAdvanceView", "SynthesisGeneralView", "UserInfoView", "YlbApplyView", "YlbInstructionView", "YlbView", "en", "id", "ms", "th", "tl", "tw", "vi", "zh", "LanguageData", "LanguageMgr", "LocalizedLabel", "LocalizedSize", "LocalizedSprite", "NodeSizeSet", "SpriteFrameSet", "polyglot.min", "use_v2.1-2.2.1_cc.Toggle_event" ]);