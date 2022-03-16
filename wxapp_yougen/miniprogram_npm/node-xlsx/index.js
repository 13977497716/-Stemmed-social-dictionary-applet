module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1636965223539, function(require, module, exports) {


var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = exports.build = exports.parseMetadata = exports.parse = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _xlsx = _interopRequireDefault(require("xlsx"));

var _bufferFrom = _interopRequireDefault(require("buffer-from"));

var _helpers = require("./helpers");

var _workbook = _interopRequireDefault(require("./workbook"));

var parse = function parse(mixed, options) {
  if (options === void 0) {
    options = {};
  }

  var workSheet = _xlsx.default[(0, _helpers.isString)(mixed) ? 'readFile' : 'read'](mixed, options);

  return Object.keys(workSheet.Sheets).map(function (name) {
    var sheet = workSheet.Sheets[name];
    return {
      name,
      data: _xlsx.default.utils.sheet_to_json(sheet, {
        header: 1,
        raw: options.raw !== false,
        range: options.range ? options.range[name] : null
      })
    };
  });
};

exports.parse = parse;

var parseMetadata = function parseMetadata(mixed, options) {
  if (options === void 0) {
    options = {};
  }

  var workSheet = _xlsx.default[(0, _helpers.isString)(mixed) ? 'readFile' : 'read'](mixed, options);

  return Object.keys(workSheet.Sheets).map(function (name) {
    var sheet = workSheet.Sheets[name];
    return {
      name,
      data: sheet["!ref"] ? _xlsx.default.utils.decode_range(sheet["!ref"]) : null
    };
  });
};

exports.parseMetadata = parseMetadata;

var build = function build(worksheets, options) {
  if (options === void 0) {
    options = {};
  }

  var defaults = {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  };
  var workBook = new _workbook.default();
  worksheets.forEach(function (worksheet) {
    var sheetName = worksheet.name || 'Sheet';
    var sheetOptions = worksheet.options || {};
    var sheetData = (0, _helpers.buildSheetFromMatrix)(worksheet.data || [], (0, _extends2.default)({}, options, sheetOptions));
    workBook.SheetNames.push(sheetName);
    workBook.Sheets[sheetName] = sheetData;
  });

  var excelData = _xlsx.default.write(workBook, (0, _extends2.default)({}, defaults, options));

  return excelData instanceof Buffer ? excelData : (0, _bufferFrom.default)(excelData, 'binary');
};

exports.build = build;
var _default = {
  parse,
  parseMetadata,
  build
};
exports.default = _default;
//# sourceMappingURL=index.js.map
}, function(modId) {var map = {"./helpers":1636965223540,"./workbook":1636965223541}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1636965223540, function(require, module, exports) {


var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.buildSheetFromMatrix = exports.buildExcelDate = exports.isCellDescriptor = exports.isObject = exports.isString = exports.isNumber = exports.isBoolean = void 0;

var _xlsx = _interopRequireDefault(require("xlsx"));

var ORIGIN_DATE = new Date(Date.UTC(1899, 11, 30));

var isBoolean = function isBoolean(maybeBoolean) {
  return typeof maybeBoolean === 'boolean';
};

exports.isBoolean = isBoolean;

var isNumber = function isNumber(maybeNumber) {
  return typeof maybeNumber === 'number';
};

exports.isNumber = isNumber;

var isString = function isString(maybeString) {
  return typeof maybeString === 'string';
};

exports.isString = isString;

var isObject = function isObject(maybeObject) {
  return maybeObject !== null && typeof maybeObject === 'object';
};

exports.isObject = isObject;

var isCellDescriptor = function isCellDescriptor(maybeCell) {
  return isObject(maybeCell) && 'v' in maybeCell;
};

exports.isCellDescriptor = isCellDescriptor;
var SUPPORTED_WS_OPTIONS = ['!cols', '!rows', '!merges', '!autofilter', '!protect'];

var buildExcelDate = function buildExcelDate(value, is1904) {
  var epoch = Date.parse(value + (is1904 ? 1462 : 0));
  return (epoch - ORIGIN_DATE) / 864e5;
};

exports.buildExcelDate = buildExcelDate;

var buildSheetFromMatrix = function buildSheetFromMatrix(data, options) {
  if (options === void 0) {
    options = {};
  }

  var workSheet = {};
  var range = {
    s: {
      c: 1e7,
      r: 1e7
    },
    e: {
      c: 0,
      r: 0
    }
  };
  if (!Array.isArray(data)) throw new Error('sheet data is not array');

  for (var R = 0; R !== data.length; R += 1) {
    for (var C = 0; C !== data[R].length; C += 1) {
      if (!Array.isArray(data[R])) throw new Error(`${R}th row data is not array`);
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;

      if (data[R][C] === null) {
        continue; // eslint-disable-line
      }

      var cell = isCellDescriptor(data[R][C]) ? data[R][C] : {
        v: data[R][C]
      };

      var cellRef = _xlsx.default.utils.encode_cell({
        c: C,
        r: R
      });

      if (isNumber(cell.v)) {
        cell.t = 'n';
      } else if (isBoolean(cell.v)) {
        cell.t = 'b';
      } else if (cell.v instanceof Date) {
        cell.t = 'n';
        cell.v = buildExcelDate(cell.v);
        cell.z = cell.z || _xlsx.default.SSF._table[14]; // eslint-disable-line no-underscore-dangle

        /* eslint-disable spaced-comment, no-trailing-spaces */

        /***
         * Allows for an non-abstracted representation of the data
         *
         * example: {t:'n', z:10, f:'=AVERAGE(A:A)'}
         *
         * Documentation:
         * - Cell Object: https://sheetjs.gitbooks.io/docs/#cell-object
         * - Data Types: https://sheetjs.gitbooks.io/docs/#data-types
         * - Format: https://sheetjs.gitbooks.io/docs/#number-formats
         **/

        /* eslint-disable spaced-comment, no-trailing-spaces */
      } else if (isObject(cell.v)) {
        cell.t = cell.v.t;
        cell.f = cell.v.f;
        cell.F = cell.v.F;
        cell.z = cell.v.z;
      } else {
        cell.t = 's';
      }

      if (isNumber(cell.z)) cell.z = _xlsx.default.SSF._table[cell.z]; // eslint-disable-line no-underscore-dangle

      workSheet[cellRef] = cell;
    }
  }

  if (range.s.c < 1e7) {
    workSheet['!ref'] = _xlsx.default.utils.encode_range(range);
  }

  SUPPORTED_WS_OPTIONS.forEach(function (option) {
    if (options[option]) {
      workSheet[option] = options[option];
    }
  });
  return workSheet;
};

exports.buildSheetFromMatrix = buildSheetFromMatrix;
//# sourceMappingURL=helpers.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1636965223541, function(require, module, exports) {


var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var Workbook = function Workbook() {
  (0, _defineProperty2.default)(this, "SheetNames", []);
  (0, _defineProperty2.default)(this, "Sheets", {});
};

exports.default = Workbook;
//# sourceMappingURL=workbook.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1636965223539);
})()
//miniprogram-npm-outsideDeps=["@babel/runtime/helpers/interopRequireDefault","@babel/runtime/helpers/extends","xlsx","buffer-from","@babel/runtime/helpers/defineProperty"]
//# sourceMappingURL=index.js.map