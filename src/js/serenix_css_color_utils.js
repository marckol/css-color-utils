/* 
 * The MIT License
 *
 * Copyright 2023 Marc KAMGA Olivier <kamga_marco@yahoo.com;mkamga.olivier@gmail.com>.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 
 
/**
  * 
  * @param {Number|Array|Object} $0
  * @param {Number|Boolean} $1
  * @param {Number} $2
  * @param {Boolean} obj
  * @returns {Array|Object}
  */
function rgbToHsb($0, $1, $2, obj) {
	var hsb = { h: 0, s: 0, b: 0 }
	var rgb;
	var obj;
	if (typeof $0 === 'string' || $0 instanceof String) {
		obj = arguments[1];
		if ($0.indexOf('#') === 0) {
		  $0 = $0.substring(1)
		}
		if ($0.length === 3) {
		  $0 = $0
			.split('')
			.map(function(s) { return s + s})
			.join('')
		}
		if ($0.length !== 6) return false
		$0 = [$0.substr(0, 2), $0.substr(2, 2), $0.substr(4, 2)].map(function(s) {
		  return parseInt(s, 16)
		})
		rgb = {
		  r: $0[0],
		  g: $0[1],
		  b: $0[2]
		}
	} else if (isPlainObj($0)) {
		$0.r = $0.r||$0.red||0;
		$0.g = $0.g||$0.green||0;
		$0.b = $0.b||$0.blue||0;
		rgb = $0;
		$0 = [rgb.r, rgb.g, rgb.b]
		obj = $1;
	} else if (isArray($0)) {
		rgb = {
		  r: $0[0],
		  g: $0[1],
		  b: $0[2]
		}
		obj = $1;
	}
	var MAX = Math.max.apply(this, $0)
	var MIN = Math.min.apply(this, $0)
	//H start
	if (MAX === MIN) {
	  hsb.h = 0
	} else if (MAX === rgb.r && rgb.g >= rgb.b) {
	  hsb.h = (60 * (rgb.g - rgb.b)) / (MAX - MIN) + 0
	} else if (MAX === rgb.r && rgb.g < rgb.b) {
	  hsb.h = (60 * (rgb.g - rgb.b)) / (MAX - MIN) + 360
	} else if (MAX === rgb.g) {
	  hsb.h = (60 * (rgb.b - rgb.r)) / (MAX - MIN) + 120
	} else if (MAX === rgb.b) {
	  hsb.h = (60 * (rgb.r - rgb.g)) / (MAX - MIN) + 240
	}
	//H end
	if (MAX === 0) {
	  hsb.s = 0
	} else {
	  hsb.s = 1 - MIN / MAX
	}
	hsb.b = MAX / 255
	return obj ? hsb : [hsb.h, hsb.s, hsb.b];
  }
var hexToRgb;

function rgbToHex(r, g, b) {
	function toHex(i) {
		var t, u, digits = "0123456789abcdef";
		i = parseInt(i, 10);
		if (i >= 0 && i <= 255) {
			u = i%16;
			return digits[(i - u)/16] + digits[u];
		}
		throw new Error("Incorrect argument");
	}
	if (isArray(r)) {
		b = r[2];
		g = r[1];
		r = r[0];
	} else if (typeof r === 'object' && r) {
		b = r.b;
		if (b == undefined) {
			b = r.blue;
			g = r.green;
			r = r.red;
		} else {
			g = r.g;
			r = r.r;
		}
	}
	if (r == undefined && r == undefined && r == undefined)
		return '';
	return '#' + toHex(r) + toHex(g) + toHex(b);
}


function arrayRgbToHex(rgb) {
	if (rgb == undefined)
		return;
	if (rgb[0] == undefined && rgb[1] == undefined && rgb[2] == undefined)
		return '';
	return (
	  Math.floor(rgb[0]||0)
		.toString(16)
		.padStart(2, '0') +
	  Math.floor(rgb[1]||0)
		.toString(16)
		.padStart(2, '0') +
	  Math.floor(rgb[2]||0)
		.toString(16)
		.padStart(2, '0')
	)
}

/**
 * 
 * Assumes that arguments in the range 0 to 1
 * @param {Number} h Hue
 * @param {Number} w Whiteness
 * @param {Number} b blackness
 * @returns {Array}
 */
function hwbToRgb (h, w, b) {
	if (isArray(h)){
		w = h[1];
		b = h[2];
		h = h[0];
	} else if (isPlainObj(h)) {
		w = h.w||h.whiteness||0;
		b = h.b||h.brightness||0;
		h = h.h||h.red||0;
	}
	var rgb = hslToRgb(h, 1, 0.5)

	for (var i = 0; i < 3; ++i) {
		var c = rgb[i] / 255

		c *= 1 - w - b
		c += w
		
		rgb[i] = Math.round(c * 255)
	}

	return rgb
}

/**
 * 
 * Assumes that arguments in the range 0 to 1
 * @param {Number} h 
 * @param {Number} w 
 * @param {Number} b 
 * @returns {Object}
 */
function hwb2Rgb(h, w, b) {
  
	h *= 6;
  
	var v = 1 - b, n, f, i;
	if (!h) return {r:v, g:v, b:v};
	i = h|0;
	f = h - i;
	if (i & 1) f = 1 - f;
	n = w + f * (v - w);
	v = (v * 255)|0;
	n = (n * 255)|0;
	w = (w * 255)|0;

	switch(i) {
		case 6:
		case 0: return {r:v, g:n, b: w};
		case 1: return {r:n, g:v, b: w};
		case 2: return {r:w, g:v, b: n};
		case 3: return {r:w, g:n, b: v};
		case 4: return {r:n, g:w, b: v};
		case 5: return {r:v, g:w, b: n};
	}
}

/**
 * 
 * Assumes that h in the range 0 to 360, w and b in the range 0 to 100
 * @param {Number} h 
 * @param {Number} w 
 * @param {Number} b 
 * @returns {Object}
 */
function hwbaToRgba(h, w, b, a) {
	if (isArray(h)){
		a = h[3];
		b = h[2];
		w = h[1];
		h = h[0];
	} else if (isPlainObj(h)) {
		a = h.a||h.alpha||0;
		b = h.b||h.blackness||0;
		w = h.w||h.whiteness||0;
		h = h.h||h.hue||0;
	}
	var rgba = hwbToRgb(h, w, b);
	rgba.a = a;
	return rgba;
}
var hwbToRgba = hwbaToRgba;
/**
 * 
 * Assumes that arguments in the range 0 to 1
 * @param {Number} h 
 * @param {Number} w 
 * @param {Number} b 
 * @param {Number} a
 * @returns {Object}
 */
function hwba2Rgba(h, w, b, a) {
	if (isArray(h)){
		a = h[3];
		b = h[2];
		w = h[1];
		h = h[0];
	} else if (isPlainObj(h)) {
		a = h.a||h.alpha||0;
		b = h.b||h.blackness||0;
		w = h.w||h.whiteness||0;
		h = h.h||h.hue||0;
	}
	var rgba = hwb2Rgb(h, w, b);
	rgba.a = a;
	return rgba;
}

;(function(root, name, factory) {
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([name], factory);
    } else {
        root[name] = factory();
    }    
})(this, 'CssColorUtils', function() {
	
	var slice = Array.prototype.slice;

	

	
	function _toHex(i) {
        var t, u, digits = "0123456789abcdef";
		i = parseInt(i, 10);
        if (i >= 0 && i <= 255) {
            u = i%16;
            return digits[(i - u)/16] + digits[u];
        }
        throw new Error("Incorrect argument");
    }
	
	var COLOR_SPACE_KEYS = {
		'a98-rgb': 'a98',
		'srgb-linear': 'lrgb',
		'xyz-d65': 'xyz65',
		'xyz-d50': 'xyz50',
		'display-p3': 'p3',
		'prophoto-rgb': 'prophoto'
	};
	
	function rgbFromArgs(args) {
		if (isPlainObj(x = args[0])) {
			return x.r !== undefined ? x : { r: x.red||0, g: x.green||0, b: x.green||0, a: x.alpha == undefined ? x.a : x.alpha};
		}
		if (!isArray(x))
			x = args;
		return { r: x[0], g: x[1], b: x[2], a: x[3]};
	}
	
	function xyzFromArgs(args) {
		if (isPlainObj(x = args[0])) {
			return x.r !== undefined ? x : { x: 0, g: 0, b: 0, a: x.alpha == undefined ? x.a : x.alpha};
		}
		if (!isArray(x))
			x = args;
		return { x: x[0], y: x[1], z: x[2], a: x[3]};
	}
	
	function arrayFromArgs(args, fields) {
		var x, $;
		if (isPlainObj(x=args[0])) {
			$ = [];
			fields.forEach(function(f) {
				$.push(x[f]);
			})
			$.push(x.alpha != undefined ? $.alpha : $.a);
			return $;
		}
		return isArray(x) ? x : args;
	}
	
	/**
	 * 
	 * @static
	 * @class {SereniX.ColorUtils}
	 */
	function CssColorUtils() {};
	var CCU = CssColorUtils;
	CCU.__CLASS__ = CCU;
	CCU.__CLASS_NAME__ = 'CssColorUtils';
	
	CCU.COLOR_SPACE_KEYS = {};
	
	CCU.int2Hex = _toHex;
	
	CCU.ubyte2Hex = _toHex;
	
	CCU.ubyteToHex = _toHex;
	
	CCU.hwbToRgb = hwbToRgb;
	CCU.hwbToRgba = hwbToRgba;
	CCU.hwbaToRgba = hwbaToRgba;
	
	var supportsLch, supportsLab, supportsPercentABLab, supportsPercentCHLch;
	
	var supportsOkLch, supportsOkLab, supportsPercentABOkLab, supportsPercentCHOkLch;
	
	function _testColorSupports() {
		var b = document.getElementsByTagName('body')[0];
		supportsLch = (function() {			
			var el = document.createElement('div');
			b.appendChild(el);
			el.style.backgroundColor = 'lch(100 100 360)';
			var supports = !!el.style.backgroundColor;
			b.removeChild(el);
			return supports;
		})();

		
		supportsLab = (function() {
			var el = document.createElement('div');
			el.style.backgroundColor = 'lab(80 0 0)';
			b.appendChild(el);
			var supports = !!el.style.backgroundColor;
			b.removeChild(el);
			return supports;
		})();
		
		supportsPercentABLab = (function() {
			var el = document.createElement('div');
			b.appendChild(el);
			el.style.backgroundColor = 'lab(29.69% 44.888% -29.04%)';
			var supports = !!el.style.backgroundColor;
			b.removeChild(el);
			return supports;
		})();
		
		supportsPercentCHLch = (function() {
			var el = document.createElement('div');
			el.style.backgroundColor = 'lch(29.69% 45.553% 327.1)';
			b.appendChild(el);
			var supports = !!el.style.backgroundColor;
			b.removeChild(el);
			return supports;
		})();
		
		supportsOkLch = (function() {			
			var el = document.createElement('div');
			b.appendChild(el);
			el.style.backgroundColor = 'oklch(40.101% 0.12332 21.555)';
			var supports = !!el.style.backgroundColor;
			b.removeChild(el);
			return supports;
		})();

		
		supportsOkLab = (function() {
			var el = document.createElement('div');
			el.style.backgroundColor = 'oklab(40.101% 0.1147 0.0453)';
			b.appendChild(el);
			var supports = !!el.style.backgroundColor;
			b.removeChild(el);
			return supports;
		})();
		
		supportsPercentABOkLab = (function() {
			var el = document.createElement('div');
			b.appendChild(el);
			el.style.backgroundColor = 'oklab(42.1% 41% -25%)';
			var supports = !!el.style.backgroundColor;
			b.removeChild(el);
			return supports;
		})();
		
		supportsPercentCHOkLch = (function() {
			var el = document.createElement('div');
			el.style.backgroundColor = 'oklch(42.1% 48.25% 328.4)';
			b.appendChild(el);
			var supports = !!el.style.backgroundColor;
			b.removeChild(el);
			return supports;
		})();
		
		/**
		 * Supports LCH color?
		 * @static
		 * @property {Boolean} supportsPercentABLab
		 */
		CCU.supportsLch = supportsLch;
		/**
		 * Supports LAB color?
		 * @static
		 * @property {Boolean} supportsPercentABLab
		 */
		CCU.supportsLab = supportsLab;
		/**
		 * Supports LAB color with a and/or b values with percent?
		 * @static
		 * @property {Boolean} supportsPercentABLab
		 */
		CCU.supportsPercentABLab = supportsPercentABLab;
		/**
		 * Supports LCH color with a and/or b values with percent?
		 * @static
		 * @property {Boolean} supportsPercentABLab
		 */
		CCU.supportsPercentCHLch = supportsPercentCHLch
		
		/**
		 * Supports OKLCH color?
		 * @static
		 * @property {Boolean} supportsOkLch
		 */
		CCU.supportsOkLch = supportsOkLch;
		/**
		 * Supports OKLAB color?
		 * @static
		 * @property {Boolean} supportsOkLab
		 */
		CCU.supportsOkLab = supportsOkLab;
		/**
		 * Supports OKLAB color with a and/or b values with percent?
		 * @static
		 * @property {Boolean} supportsPercentABOkLab
		 */
		CCU.supportsPercentABOkLab = supportsPercentABOkLab;
		/**
		 * Supports OKLCH color with a and/or b values with percent?
		 * @static
		 * @property {Boolean} supportsPercentCHOkLch
		 */
		CCU.supportsPercentCHOkLch = supportsPercentCHOkLch
		
		var CM = SereniX.ColorMatrix;
		if (CM) {		
			/**
			 * Supports LCH color?
			 * @static
			 * @property {Boolean} supportsPercentABLab
			 */
			CM.supportsLch = supportsLch;
			/**
			 * Supports LAB color?
			 * @static
			 * @property {Boolean} supportsPercentABLab
			 */
			CM.supportsLab = supportsLab;
			/**
			 * Supports LAB color with a and/or b values with percent?
			 * @static
			 * @property {Boolean} supportsPercentABLab
			 */
			CM.supportsPercentABLab = supportsPercentABLab;
			/**
			 * Supports LCH color with a and/or b values with percent?
			 * @static
			 * @property {Boolean} supportsPercentABLab
			 */
			CM.supportsPercentCHLch = supportsPercentCHLch
			
			/**
			 * Supports OKLCH color?
			 * @static
			 * @property {Boolean} supportsOkLch
			 */
			CM.supportsOkLch = supportsOkLch;
			/**
			 * Supports OKLAB color?
			 * @static
			 * @property {Boolean} supportsOkLab
			 */
			CM.supportsOkLab = supportsOkLab;
			/**
			 * Supports OKLAB color with a and/or b values with percent?
			 * @static
			 * @property {Boolean} supportsPercentABOkLab
			 */
			CM.supportsPercentABOkLab = supportsPercentABOkLab;
			/**
			 * Supports OKLCH color with a and/or b values with percent?
			 * @static
			 * @property {Boolean} supportsPercentCHOkLch
			 */
			CM.supportsPercentCHOkLch = supportsPercentCHOkLch
		}
	}
	if (!/loading/.test(document.readyState||'')) {
		_testColorSupports();
	} else if (document.addEventListener) {
		document.addEventListener('DOMContentLoaded', _testColorSupports);
	} else {
		window.attachEvent('onload', _testColorSupports)
	}
	
	/**
	 * Each key (hex, hex value, name, ...) must represents a valid CSS color and each, represents the class
	 * @name SereniX.CssColorUtils.colorClasses
	 * @property {Object} colorClasses 
	 */
	CCU.colorClasses = {};
	
	var nativeColorNames = {};
	
	var nativeNames = {
		'aliceblue': '#f0f8ff',
		'antiquewhite': '#faebd7',
		'aqua': '#00ffff',
		'aquamarine': '#7fffd4',
		'azure': '#f0ffff',
		'beige': '#f5f5dc',
		'bisque': '#ffe4c4',
		'black': '#000000',
		'blanchedalmond': '#ffebcd',
		'blue': '#0000ff',
		'blueviolet': '#8a2be2',
		'brown': '#a52a2a',
		'burlywood': '#deb887',
		'cadetblue': '#5f9ea0',
		'chartreuse': '#7fff00',
		'chocolate': '#d2691e',
		'coral': '#ff7f50',
		'cornflowerblue': '#6495ed',
		'cornsilk': '#fff8dc',
		'crimson': '#dc143c',
		'cyan': '#00ffff',
		'darkblue': '#00008b',
		'darkcyan': '#008b8b',
		'darkgoldenrod': '#b8860b',
		'darkgray': '#a9a9a9',
		'darkgrey': '#a9a9a9',
		'darkgreen': '#006400',
		'darkkhaki': '#bdb76b',
		'darkmagenta': '#8b008b',
		'darkolivegreen': '#556b2f',
		'darkorange': '#ff8c00',
		'darkorchid': '#9932cc',
		'darkred': '#8b0000',
		'darksalmon': '#e9967a',
		'darkseagreen': '#8fbc8f',
		'darkslateblue': '#483d8b',
		'darkslategray': '#2f4f4f',
		'darkslategrey': '#2f4f4f',
		'darkturquoise': '#00ced1',
		'darkviolet': '#9400d3',
		'deeppink': '#ff1493',
		'deepskyblue': '#00bfff',
		'dimgray': '#696969',
		'dimgrey': '#696969',
		'dodgerblue': '#1e90ff',
		'firebrick': '#b22222',
		'floralwhite': '#fffaf0',
		'forestgreen': '#228b22',
		'fuchsia': '#ff00ff',
		'gainsboro': '#dcdcdc',
		'ghostwhite': '#f8f8ff',
		'gold': '#ffd700',
		'goldenrod': '#daa520',
		'gray': '#808080',
		'grey': '#808080',
		'green': '#008000',
		'greenyellow': '#adff2f',
		'honeydew': '#f0fff0',
		'hotpink': '#ff69b4',
		'indianred': '#cd5c5c',
		'indigo': '#4b0082',
		'ivory': '#fffff0',
		'khaki': '#f0e68c',
		'lavender': '#e6e6fa',
		'lavenderblush': '#fff0f5',
		'lawngreen': '#7cfc00',
		'lemonchiffon': '#fffacd',
		'lightblue': '#add8e6',
		'lightcoral': '#f08080',
		'lightcyan': '#e0ffff',
		'lightgoldenrodyellow': '#fafad2',
		'lightgray': '#d3d3d3',
		'lightgrey': '#d3d3d3',
		'lightgreen': '#90ee90',
		'lightpink': '#ffb6c1',
		'lightsalmon': '#ffa07a',
		'lightseagreen': '#20b2aa',
		'lightskyblue': '#87cefa',
		'lightslategray': '#778899',
		'lightslategrey': '#778899',
		'lightsteelblue': '#b0c4de',
		'lightyellow': '#ffffe0',
		'lime': '#00ff00',
		'limegreen': '#32cd32',
		'linen': '#faf0e6',
		'magenta': '#ff00ff',
		'maroon': '#800000',
		'mediumaquamarine': '#66cdaa',
		'mediumblue': '#0000cd',
		'mediumorchid': '#ba55d3',
		'mediumpurple': '#9370d8',
		'mediumseagreen': '#3cb371',
		'mediumslateblue': '#7b68ee',
		'mediumspringgreen': '#00fa9a',
		'mediumturquoise': '#48d1cc',
		'mediumvioletred': '#c71585',
		'midnightblue': '#191970',
		'mintcream': '#f5fffa',
		'mistyrose': '#ffe4e1',
		'moccasin': '#ffe4b5',
		'navajowhite': '#ffdead',
		'navy': '#000080',
		'oldlace': '#fdf5e6',
		'olive': '#808000',
		'olivedrab': '#6b8e23',
		'orange': '#ffa500',
		'orangered': '#ff4500',
		'orchid': '#da70d6',
		'palegoldenrod': '#eee8aa',
		'palegreen': '#98fb98',
		'paleturquoise': '#afeeee',
		'palevioletred': '#d87093',
		'papayawhip': '#ffefd5',
		'peachpuff': '#ffdab9',
		'peru': '#cd853f',
		'pink': '#ffc0cb',
		'plum': '#dda0dd',
		'powderblue': '#b0e0e6',
		'purple': '#800080',
		'red': '#ff0000',
		'rosybrown': '#bc8f8f',
		'royalblue': '#4169e1',
		'saddlebrown': '#8b4513',
		'salmon': '#fa8072',
		'sandybrown': '#f4a460',
		'seagreen': '#2e8b57',
		'seashell': '#fff5ee',
		'sienna': '#a0522d',
		'silver': '#c0c0c0',
		'skyblue': '#87ceeb',
		'slateblue': '#6a5acd',
		'slategray': '#708090',
		'slategrey': '#708090',
		'snow': '#fffafa',
		'springgreen': '#00ff7f',
		'steelblue': '#4682b4',
		'tan': '#d2b48c',
		'teal': '#008080',
		'thistle': '#d8bfd8',
		'tomato': '#ff6347',
		'turquoise': '#40e0d0',
		'violet': '#ee82ee',
		'wheat': '#f5deb3',
		'white': '#ffffff',
		'whitesmoke': '#f5f5f5',
		'yellow': '#ffff00',
		'yellowgreen': '#9acd32'
	};
	
	var nativeNamesList = [];
	
	(function() {
		var n, c;
		for (n in nativeNames) {
			nativeColorNames[c=nativeNames[n]] = n;
			nativeColorNames[c.substring(1)] = 
			nativeColorNames[c.substring(1).toUpperCase()] = 
			nativeColorNames[c.toUpperCase()] = n;
			nativeNamesList.push(n);
		}
	})();
	
	function lpad(i, len) {
        var s = "" + i;
		if (len == undefined)
			len = 2;
        for (var k = 0, n = len - s.length; k < n; k++) {
            s = "0" + s;
        }
        return s;
    }
	
	function hex2Int(h) {
		return parseInt(h, 16);
	}
	
	function getAlpha(a, pct) {
		var v;
		if (!a)
			return;
		if (a[0] === '.')
			a = '0' + a;
		if (pct) {
			return parseFloat(a, 10)/100;
		} else if (arguments.length > 1) {
			return parseFloat(a, 10);
		} else if (a !== undefined && a !== null && a !== '') {
			if (a[a.length-1] === '%') {
				v = parseFloat(a.substring(0, a.length-1));
				if (v > 100)
					throw new Error('Incorrect alpha value: ' + a);
				return v/100;
			}
			return parseFloat(a);
		}
	}
	
	function rgbComponentVal(c) {
		var v = '' +c;
		if (v[v.length-1] === '%') {
			v = Math.floor(parseFloat(v.substring(0, v.length - 1), 10)*255/100);
		} else {		
			v = parseInt(c, 10);
		}
		if (v < 0 || v > 255 || isNaN(v))
			throw new Error('Incorrect RGB color component value: ' + c);
		return v;
	}
	
	CCU.rgbComponentVal = rgbComponentVal;
	
	function alphaVal(c) {
		var v = '' +c;
		if (v[v.length-1] === '%') {
			v = Math.floor(parseFloat(v.substring(0, v.length - 1), 10)/100);
		} else {		
			v = parseInt(c, 10);
		}
		if (v < 0 || v > 1 || isNaN(v))
			throw new Error('Incorrect RGB color component value: ' + c);
		return v;
	}
	
	CCU.alphaVal = alphaVal;
	
	function toHexValue(c) {
		if (c === 'transparent')
			return '';
		c = toHex(c);
		return c[0] === '#' ? c: '#' + c;
	}
	
	var _cmykRe = /^(cmyk?)\(\s*(\d+(?:\.\d+)?)%[ \t]*,[ \t]*(\d+(?:\.\d+)?)%[ \t]*,[ \t]*(\d+(?:\.\d+)?)%(?:[ \t]*,[ \t]*(\d+(?:\.\d+)?)%)\s*\)$/;
	var _rgbRe = /^(rgb(a)?)\(\s*(\d{1,3}(?:(?:\.\d+)?%)?)[ \t]*,[ \t]*(\d{1,3}(?:(?:\.\d+)?%)?)[ \t]*,[ \t]*(\d{1,3}(?:(?:\.\d+)?%)?)(?:(?:[ \t]*,[ \t]*|(?:[ \t]*\/[ \t]*)|[ \t]+)(?:(\d+(?:\.\d+)?)(%)?|(\.\d+)))?\s*\)$/;
	var _hColorRe = /^(h(?:s(?:l|v|b)|wb)(a)?)\(\s*(?:(\d+(?:\.\d+)?|\.\d+)(deg|rad|turn|grad|%)?|none)(?:[ \t]*?(?:,[ \t]*|[ \t]+))(?:(\d+(?:\.\d+)?|\.\d+)(%)?|none)(?:[ \t]*?(?:,[ \t]*|[ \t]+))(?:(\d+(?:\.\d+)?|\.\d+)(%)?|none)(?:(?:[ \t]*,[ \t]*|(?:[ \t]*\/[ \t]*)|[ \t]+)(?:(\d+(?:\.\d+)?|\.\d+)(%)?|(\.\d+)))?\s*\)$/;
	var _cmyRe = /^(cmyk?)\(\s*(\d+(?:\.\d+)?)%[ \t]*,[ \t]*(\d+(?:\.\d+)?)%[ \t]*,[ \t]*(\d+(?:\.\d+)?)%\s*\)$/;
	var _labRe = /^lab\(\s*(?:(\d+(?:\.\d+)?)(%)?|(none))[ \t]+(?:((?:\+|[-])?(?:\d+(?:\.\d+)?|\.\d+))(%)?|(none))[ \t]+(?:((?:\+|[-])?(?:\d+(?:\.\d+)?|\.\d+))(%)?|(none))(?:[ \t]+\/[ \t]+(?:(\d+(?:\.\d+)?|\.\d+)(%)?|(none|(\.\d+))))?[ \t]*\)$/;
	var _oklabRe = /^oklab\(\s*(?:(\d+(?:\.\d+)?|\.\d+)(%)?|(none))[ \t]+(?:((?:\+|[-])?(?:\d+(?:\.\d+)?|\.\d+))(%)?|(none))[ \t]+(?:((?:\+|[-])?(?:\d+(?:\.\d+)?|\.\d+))(%)?|(none))(?:[ \t]+\/[ \t]+(?:(\d+(?:\.\d+)?|\.\d+)(%)?|(none|(\.\d+))))?[ \t]*\)$/;
	var _lchRe = /^lch\(\s*(?:(\d+(?:\.\d+)?)(%)?|(none))[ \t]+(?:(\d+(?:\.\d+)?)(%)?|(none))[ \t]+(?:(\d+(?:\.\d+)?)(deg|rad|turn|grad|%)?|(none))(?:[ \t]+\/[ \t]+(?:(\d+(?:\.\d+)?)(%)?|(none|(\.\d+))))?[ \t]*\)$/;
	var _oklchRe = /^oklch\(\s*(?:(\d+(?:\.\d+)?|\.\d+)(%)?|(none))[ \t]+(?:(\d+(?:\.\d+)?|\.\d+)(%)?|(none))[ \t]+(?:(\d+(?:\.\d+)?)(deg|rad|turn|grad|%)?|(none))(?:[ \t]+\/[ \t]+(?:(\d+(?:\.\d+)?)(%)?|(none)|(\.\d+)))?[ \t]*\)$/;
	var _yuvRe = /^yuv\(\)$/;
	//var _yuvRe = /^yuv\(\s*(\d+(?:\.\d+)?)(%)?\s*,\s*((?:+|-)?\d+(?:\.\d+)?)\s*,\s*((?:+|-)?\d+(?:\.\d+)?)\s*\)$/;
	var _xyzRe = /^xyz\(\)$/;
	
	var _yiqRe = /^yiq\(\)$/;
	/*
	color() = color( [from <color>]? <colorspace-params> [ / [ <alpha-value> | none ] ]? )
	<color> = <absolute-color-base> | currentcolor | <system-color> 

	<absolute-color-base> = <hex-color> | <absolute-color-function> | <named-color> | transparent
	<absolute-color-function> = <rgb()> | <rgba()> |
                            <hsl()> | <hsla()> | <hwb()> |
                            <lab()> | <lch()> | <oklab()> | <oklch()> |
                            <color()>
	<colorspace-params> = [<custom-params> | <predefined-rgb-params> | <xyz-params>]
	<custom-params> = <dashed-ident> [ <number> | <percentage> | none ]#
	<predefined-rgb-params> = <predefined-rgb> [ <number> | <percentage> | none ]{3}
	<predefined-rgb> = srgb | srgb-linear | display-p3 | a98-rgb | prophoto-rgb | rec2020
	<xyz-params> = <xyz> [ <number> | <percentage> | none ]{3}
	<xyz> = xyz | xyz-d50 | xyz-d65
	The <dashed-ident> production is a <custom-ident>, with all the case-sensitivity that implies, with the additional restriction that it must start with two dashes (U+002D HYPHEN-MINUS).
	*/
	var _css5ColorRe = /^color\([ \t]*(?:from[ \t]+(?:(#[0-9a-fA-F]+)|([a-zA-A]{a-zA-Z0-9-]*)(?:\(([^\(|)]*)\))?)[ \t]+)?(?:(srgb|srgb-linear|display-p3|a98-rgb|prophoto-rgb|rec2020|xyz|xyz-d50|xyz-d65)|([a-zA-Z-][a-zA-Z0-9-]*))[ \t]+(?:(\d+(?:\.\d+)?)(%)?|(\.\d+)|(none))[ \t]+(?:(\d+(?:\.\d+)?)(%)?|(\.\d+)|(none))[ \t]+(?:(\d+(?:\.\d+)?)(%)?|(\.\d+)|(none))(?:[ \t]*\/[ \t]*(?:(\d+(?:\.\d+)?|\.\d+)(%)?|(\.\d+)))?[ \t]*\)$/;
	function hueAngleRatio(angle) {
		if (!angle || angle === 'deg')
			return 1;
		if (angle === 'rad')
			return 180/Math.PI;
		if (angle === 'turn')
			return 360;
		if (angle === 'grad')
			return 360/400;
		if (angle === '%')
			return 3.6;
		throw new Error('Incorrect angle');
	}
	
	function _toHObj(match, fields, pct) {
		var o = {};
		o[fields[0]] = match[3] ? parseFloat(match[3], 10)*hueAngleRatio(match[4]) : /*none case*/0;
		o[fields[1]] = match[5] ? parseFloat(match[5], 10)/(match[6] ? (pct ? 1 : 100) : 1) : /*none case*/0;
		o[fields[2]] = match[7] ? parseFloat(match[7])/(match[8] ? (pct ? 1 : 100) : 1) : /*none case*/0
		if (fields.length > 3)
			o[fields[3]] = parseFloat(match[9])/(match[10] ? 100 : 1)
		return o;
	}
	function _normalizeHex(hex) {
		if (hex[0] === '#')
			hex = hex.substring(1);
		hex = hex.toUpperCase();
		if (hex.length === 3) {
			hex = hex[0]+hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
		} else if (hex.length === 4) {
			hex = hex[0]+hex[0] + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
		} else if (hex.length === 1) {
			hex = hex[0]+hex[0] + hex[0] + hex[0] + hex[0] + hex[0]
		} else if (hex.length === 2) {
			hex = hex[0]+hex[0] + hex[0] + hex[1] + hex[1] + hex[1]
		}
		
		return hex;
	}
	function _hexFromStr(c, map, nameAskey) {
		var match;
		var a;
		if ((match = _rgbRe.exec(c))) {
			if (match[2]) { //if alpha component exists
				if ((a = getAlpha(match[6]||match[8], match[7])) == undefined || a === 1) {
					return rgbToHex({r: rgbComponentVal(match[3]), g: rgbComponentVal(match[4]), b: rgbComponentVal(match[5])});
				} else {
					return rgbToHex(rgbaToRgb({r: rgbComponentVal(match[3]), g: rgbComponentVal(match[4]), b: rgbComponentVal(match[5])}));
				}
			} else {
				return rgbToHex({r: rgbComponentVal(match[3]), g: rgbComponentVal(match[4]), b: rgbComponentVal(match[5]), a: a});
			}
		} else if ((match = _hColorRe.exec(c))) {
			if (match[2]) { //if alpha component exists
				if ((a = getAlpha(match[8])) == undefined || a === 1) {
					return _hMatchToHex(match);
				} else {
					var rgb;
					switch(match[1]) {
						case 'hsl':
						case 'hsla':
							rgb = rgbaToRgb(hsla2Rgba(_toHObj(match, ['h', 's', 'l', 'a'], true)))
						case 'hsv':
						case 'hsva':
							rgb = rgbaToRgb(hsva2Rgba(_toHObj(match, ['h', 's', 'v', 'a'])))
						case 'hsb':
						case 'hsba':
							rgb = rgbaToRgb(hsba2Rgba(_toHObj(match, ['h', 's', 'b', 'a'])))
						case 'hwb':
						case 'hwba':
							rgb = rgbaToRgb(hwba2Rgba(_toHObj(match, ['h', 'w', 'b', 'a'])))
						default:
							throw new Error('Incorrect color');
					}
					return rgbToHex(rgb);
				}
			} else {
				return _hMatchToHex(match);
			}
			throw new Error((match[1] + (match[2]||'')).toUpperCase() 
				+ ' Color\'s string value not yet supported: ' + c);
		} else if ((match = _cmykRe.exec(c))) {
			throw new Error('CMYK Color\'s string value not yet supported: ' + c);
		} else {
			return nameToHex(c, map, nameAskey);
		}
	}
	
	function toHex(c, map, nameAskey) {
		function _hMatchToHex(match) {			
			switch(match[1]) {
				case 'hsl':
					return rgbToHex(hslToRgb(_toHObj(match, ['h', 's', 'l'], true)));
				case 'hsv':
					return rgbToHex(hsvToRgb(_toHObj(match, ['h', 's', 'v'], true)))
				case 'hsb':
					return rgbToHex(hsbToRgb(_toHObj(match, ['h', 's', 'b'], true)))
				case 'hwb':
					return rgbToHex(hwbToRgb(_toHObj(match, ['h', 'w', 'b'], true)))
				default:
					throw new Error('Not yet supported');
			}
		}
		var match;
		var hex, s; x;
		var a;
		if (typeof c === 'string') {
			if (c === 'transparent')
				return '';
			if ((match = /^(#)?([0-9a-fA-F]+)$/.exec(c))) {
				switch((hex = match[2]).length) {
					case 6:
						return hex.toUpperCase();
					case 3:
						return (hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]).toUpperCase();
					case 8:
						return rgbToHex(rgbaToRgb({
							r: hex2Int(hex.substring(0,2), 10),
							g: hex2Int(hex.substring(2,4), 10),
							b: hex2Int(hex.substring(4,6), 10),
							a: hex2Int(hex.substring(6), 10)/255
						}));
					case 4:
						return rgbToHex(rgbaToRgb({
							r: hex2Int(hex[0] + hex[0], 10),
							g: hex2Int(hex[1] + hex[1], 10),
							b: hex2Int(hex[2] + hex[2], 10),
							a: hex2Int(hex[3] + hex[3], 10)/255
						}));
					case 1:
						return (hex[0] + hex[0] + hex[0] + hex[0] + hex[0] + hex[0]).toUpperCase();
					case 2:
						return (hex[0] + hex[0] + hex[0] + hex[1] + hex[1] + hex[1]).toUpperCase();
					default:
						throw new Error('Incorrect color hexadecimal value: ' + c);
				}
			} else {
				return _hexFromStr(c, map, nameAskey);
			}
		}  else if (isPlainObj(c)) {
			var a = c.a === undefined ? c.alpha : c.a;
			var x, l;
			keys = Object.keys(c);
			if (keys.length === 0)
				return '';
			if (keys.indexOf('r') >= 0) {
				if (a === undefined || a === 1) {
					hex = rgbToHex(c);
				} else {
					hex = rgbToHex(rgbaToRgb(c));
				}
			} else if (keys.indexOf('red') >= 0) {
				if (a === undefined || a === 1) {
					hex = toHexValue({r: c.red, g: c.green, b: c.blue});
				} else {
					hex = rgbToHex(rgbaToRgb(c));
				}
			} else if (keys.indexOf('h') >= 0) {
				if (typeof (l = cVal(c, ['l', 'L', 'lightness', 'Lightness'])) !== 'undefined') {
					if (typeof (x = cVal(c, ['c', 'C', 'chroma', 'Chroma'])) !== 'undefined') {
						hex = rgbToHex(lchToRgb(l, x, cVal(c, ['h', 'H', 'hue', 'Hue'])))
					} else if (a === undefined || a === 1) {
						hex = rgbToHex(hslToRgb(c));
					} else {
						hex = rgbToHex(rgbaToRgb(hslaToRgba(c)));
					}
				} else if (keys.indexOf('w') >= 0) {
					if (a === undefined || a === 1) {
						hex = rgbToHex(hwbToRgb(c));
					} else {
						hex = rgbToHex(rgbaToRgb(hwbaToRgba(c)));
					}
				} else if (keys.indexOf('b') >= 0) {
					if (a === undefined || a === 1) {
						hex = rgbToHex(hsbToRgb(c));
					} else {
						hex = rgbToHex(rgbaToRgb(hsbaToRgba(c)));
					}
				} else if (keys.indexOf('v') >= 0) {
					if (a === undefined || a === 1) {
						hex = rgbToHex(h(c));
					} else {
						hex = rgbToHex(rgbaToRgb(hsvaToRgba(c)));
					}
				}
			} else if (keys.indexOf('hue') >= 0) {
				if (typeof (l = cVal(c, ['l', 'L', 'lightness', 'Lightness'])) !== 'undefined') {
					if (typeof (x = cVal(c, ['c', 'C', 'chroma', 'Chroma'])) !== 'undefined') {
						hex = rgbToHex(lchToRgb(l, x, cVal(c, ['h', 'H', 'hue', 'Hue'])))
					} else if (a === undefined || a === 1) {
						hex = rgbToHex(hslToRgb(c));
					} else {
						hex = rgbToHex(rgbaToRgb(hslaToRgba(c)));
					}
				} else if (keys.indexOf('whiteness') >= 0) {
					if (a === undefined || a === 1) {
						hex = rgbToHex(hwbToRgb(c));
					} else {
						hex = rgbToHex(rgbaToRgb(hwbaToRgba(c)));
					}
				} else if (keys.indexOf('brightness') >= 0) {
					if (a === undefined || a === 1) {
						hex = rgbToHex(hsbToRgb(c));
					} else {
						hex = rgbToHex(rgbaToRgb(hsbaToRgba(c)));
					}
				} else if (keys.indexOf('value') >= 0) {
					if (a === undefined || a === 1) {
						hex = rgbToHex(h(c));
					} else {
						hex = rgbToHex(rgbaToRgb(hsvaToRgba(c)));
					}
				}
			} else if ((typeof (x = c.b) !== 'undefined')
				&& (typeof (l = cVal(c, ['l', 'L', 'lightness', 'Lightness'])) !== 'undefined')) {
				hex = rgbToHex(labToRgb(l, c.a, x))
			} else if ((keys.indexOf('c') >= 0 && keys.indexOf('k') >= 0)
					|| (keys.indexOf('cyan') >= 0 && keys.indexOf('key') >= 0)) {
				hex = cmykToHex(c).toUpperCase();
			} else if ((hex=c.hex||c.hexCode||c.hexVal||c.hexValue||c.hexColor||c.hexString)) {
				hex = _normalizeHex(hex);
			} else if (typeof (s=c.color||c.value) === 'string') {
				if ((match = /^#?([0-9a-fA-F]+)$/.exec(s))) {
					hex = _normalizeHex(match[1]);
				} else {
					return _hexFromStr(s, map, nameAskey);
				}
			}
		} else if (isArray(c)) {
			switch (c.length) {
				case 0:
					return '';
				default:
					if (a === undefined || a === 1) {
						hex = arrayRgbToHex(c).toUpperCase();
					} else {
						hex = rgbToHex(rgbaToRgb({r: c[0], g: c[1], b: c[2], a: a}));
					}
			}
		} else if (c == undefined) {
			return;
		} else {
			throw new Error('Incorrect c');
		}
		return hex;
	}
	/**
	 * 
	 * @static
	 * @memberOf SereniX.CssColorUtils
	 * <p>The commponent values are in the range 0 to 255. 
	 *  If the given srgb color has alpha channel a conversion from rgba to rgb is applied.</p>
	 * @param {Array|Object} srgb
	 * @returns {Object}
	 */
	function srgbToRgb(srgb) {
		var a, c;
		if (isArray(srgb)) {
			c = {
				colorspace: 'rgb',
				r: Math.round(srgb[0]*255),
				g: Math.round(srgb[1]*255),
				b: Math.round(srgb[2]*255)
			};
			a = srgb[3];
		} else {
			c = {
				colorspace: 'rgb',
				r: Math.round((srgb.r||srgb.red||0)*255),
				g: Math.round((srgb.g||srgb.green||0)*255),
				b: Math.round((srgb.b||srgb.blue||0)*255)
			};
			a = srgb.alpha != undefined ? srgb.alpha : srgb.a;
		}
		if (a == undefined) {
			return c;
		}
		c.a = a;
		return rgbaToRgb(c);
	}
	/**
	 * 
	 * <p>The component values are in the range 0 to 1.</p>
	 * @static
	 * @memberOf SereniX.CssColorUtils
	 * @param {Array|Object} srgb
	 * @returns {Object}
	 */
	function rgbToSRgb(rgb) {
		var a, c;
		if (isArray(rgb)) {
			c = {
				colorspace: 'srgb',
				r: Math.round((rgb[0]||0)/255),
				g: Math.round((rgb[1]||0)/255),
				b: Math.round((rgb[2]||0)/255)
			};
			a = rgb[3];
		} else {
			c = {
				colorspace: 'srgb',
				r: Math.round((rgb.r||rgb.red||0)/255),
				g: Math.round((rgb.g||rgb.green||0)/255),
				b: Math.round((rgb.b||rgb.blue||0)/255)
			};
			a = rgb.alpha != undefined ? rgb.alpha : rgb.a;
		}
		if (a != undefined)
			c.a = a;
		return c;
	}
	
	
	var rgbToSrgb = rgbToSRgb;
	
	var rgbToSRGB = rgbToSRgb;
	/**
	 * 
	 * <p>The commponent values are in the range 0 to 255. If the given srgb color has alpha channel, the result also have alpha channel.</p>
	 * @memberOf SereniX.CssColorUtils
	 * @static
	 * @param {Array|Object} srgb
	 * @returns {Object}
	 */
	function srgbToRgbSys(srgb) {
		var a, c;
		if (isArray(srgb)) {
			c = {
				colorspace: 'rgb',
				r: Math.round(srgb[0]*255),
				g: Math.round(srgb[1]*255),
				b: Math.round(srgb[2]*255)
			};
			a = srgb[3];
		} else {
			c = {
				colorspace: 'rgb',
				r: Math.round((srgb.r||srgb.red||0)*255),
				g: Math.round((srgb.g||srgb.green||0)*255),
				b: Math.round((srgb.b||srgb.blue||0)*255)
			};
			a = srgb.alpha != undefined ? srgb.alpha : srgb.a;
		}
		if (a != undefined)
			c.a = a;
		return c;
	}
	
	function css4ColorToRgb(color, cs, arrayOrResultType, preserveAlpha) {
		var rgb;
		var x;
		if (arguments.length === 2 && (['array', 'string', 'object'].indexOf(cs) >= 0)) {
			arrayOrResultType = cs;
			cs = colorspace(color);
		} else if ((typeof arrayOrResultType === 'boolean') && (typeof preserveAlpha === 'string')) {
			x = preserveAlpha;
			preserveAlpha = arrayOrResultType;
			arrayOrResultType = x;
		}
		switch(cs||colorspace(color)||'') {
			case 'lab':
				return labToRgb(color, arrayOrResultType, preserveAlpha);
			case 'lch':
				return lchToRgb(color, arrayOrResultType, preserveAlpha);
			case 'oklab':
				return oklabToRgb(color, arrayOrResultType, preserveAlpha);
			case 'oklch':				
				return oklchToRgb(color, arrayOrResultType, preserveAlpha);
			case 'srgb':				
				rgb = srgbToRgb(color);
				break;
			case 'srgb-linear':
				rgb = srgbToRgb(CCU.lrgbToSRgb(color));
				break;
			case 'a98-rgb':
				rgb = srgbToRgb(CCU.xyz65ToSrgb(CCU.a98ToXyz65(color)));
				break;
			case 'prophoto-rgb':
				rgb = srgbToRgb(CCU.xyz65ToSrgb(CCU.prophotoToXyz65(color)));
				break;
			case 'display-p3':
				rgb = srgbToRgb(CCU.xyz65ToSrgb(CCU.p3ToXyzD65(color)));
				break;
			case 'xyz-d65':
				rgb = srgbToRgb(CCU.xyz65ToSrgb(color));
				break;
			case 'xyz-d50': 
				rgb = srgbToRgb(CCU.xyz65ToSrgb(CCU.xyz50ToXyz65(color)));
				break;
			case 'xyz':
				var _xyz = arrayFromArgs.call(this, [color], ['x', 'y', 'z']);
				var a;
				a = isPlainObj(color) ? color.alpha != undefined ? color.alpha : color.a : color[3];
				if (a != undefined)
					_xyz[3] = a;
				rgb = xyzToRgb(_xyz.map(function(x, i) { return i > 2 ? x : x*100; }), preserveAlpha);
				break;
			case '':
				return;
			default:
				rgb = srgbToRgb(CCU.xyz65ToSrgb(CCU.toXyz65(color)));
				break;
		}
		if (arrayOrResultType === true || arrayOrResultType === 'array') {
			return [rgb.r, rgb.g, rgb.b];
		}
		if (arrayOrResultType === 'string') {
			return 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
		}
		return rgb;
	}
	
	
	/**
	 * Converts the given color to rgb string.
	 * @memberOf SereniX.CssColorUtils
	 * @static
	 * @param {String|Object|Array} color
	 * @param {Boolean} [preserveAlpha=false]
	 * @returns {String}
	 */
	function toRgbString(color, preserveAlpha) {
		var match;
		var x, y, z;
		if (typeof color === 'string') {
			if (color === 'transparent')
				return 'transparent';
			if ((match = /^(?:#)?([0-9a-fA-F]+)$/.exec(color))) {
				x = match[1];
				if (x.length === 6) {
					return 'rgb(' + parseInt(x.substring(0, 2), 16)
						+ ',' + parseInt(x.substring(2,4), 16)
						+ ',' + parseInt(x.substring(4), 16)
						+ ')';
				} else if (x.length === 3) {
					return 'rgb(' + parseInt(x[0]+x[0], 16)
						+ ',' + parseInt(x[1]+x[1], 16)
						+ ',' + parseInt(x[2]+x[2], 16)
						+ ')';
				} else if (x.length === 8) {
					x = [
						parseInt(x.substring(0, 2), 16),
						parseInt(x.substring(2, 4), 16),
						parseInt(x.substring(4, 6), 16),
						parseInt(x.substring(6), 16)/255
					]
					if (preserveAlpha) {
						return 'rgb(' + x.join(',') + ')';
					}
					x = rgbaToRgb(x);
				} else if (x.length === 4) {
					x = [parseInt(x[0]+x[0], 16), 
							parseInt(x[1]+x[1], 16),
							parseInt(x[2]+x[2], 16),
							parseInt(x[3]+x[3], 16)/255];
					if (preserveAlpha) {
						return 'rgb(' + x.join(',') + ')';
					}
					x = rgbaToRgb(x);
				} else if (x.length === 1) {
					return 'rgb(' + (x = parseInt(x + x, 16))
						+ ',' + x
						+ ',' + x
						+ ')';
				} else if (x.length === 2) {
					y = x[1];
					x = x[0];
					return 'rgb(' + parseInt(x+x, 16)
						+ ',' + parseInt(x+y, 16)
						+ ',' + parseInt(y+y, 16)
						+ ')';
				} else {
					throw new Error('Incorrect hex x: ' + x);
				}
				return 'rgb(' + x[0] + ',' + x[1] + ',' + x[2] + ')';
			}
			if (/^rgb\s*\(/.test(color))
				return color;
			x = toRgb(color, preserveAlpha);
			if (isPlainObj(x)) {
				if (typeof (y = x.alpha != undefined ? x.alpha : x.a) === 'number') {
					if (preserveAlpha) {
						return 'rgb(' + x.r
							+ ',' + x.g
							+ ',' + x.b
							+ ',' + y //alpha channel value
							+ ')';
					}
					x = rgbaToRgb(x);
				}
				if (isArray(x)) {
					return 'rgb(' + x.join(',') + ')';
				}
				return 'rgb(' + x.r
						+ ',' + x.g
						+ ',' + x.b
						+ ')';
			} else if (isArray(x)) {
				if (x[3] != undefined) {
					if (!preserveAlpha) {
						x = rgbaToRgb(x);
					}
				}
				if (isArray(x))					
					return 'rgb(' + x.join(',') + ')';
				return 'rgb(' + x.r
						+ ',' + x.g
						+ ',' + x.b
						+ ')';
			}
		} else if (isPlainObj(color)) {
			x = cVal(color, ['l', 'L', 'lightness', 'Lightness']);
			if (x != undefined && (y = color.a) != undefined && (z = color.b) != undefined) {
				if (color.alpha != undefined) {
					x = colorspace(color) === 'oklab' ? oklabToRgb([x, y, z]) : labToRgb([x, y, z]);
					x.a = color.alpha;
					x = rgbaToRgb(x);
					return 'rgb(' + (isArray(x) ? x.join(',') : x.r + ',' + x.g + ',' + x.b ) + ')';
				}
				return colorspace(color) === 'oklab' ? oklabToRgb([x, y, z], 'string') : labToRgb([x, y, z], 'string');
			}
			if (x != undefined 
					&& (y = cVal(color,['c', 'chroma', 'C', 'Chroma'])) != undefined
					&& (z = cVal(color, ['h', 'H', 'hue', 'Hue'])) != undefined) {
				if (color.alpha != undefined) {
					x = colorspace(color) === 'oklab' ? oklchToRgb([x, y, z]) : lchToRgb([x, y, z]);
					x.a = color.alpha;
					x = rgbaToRgb(x);
					return 'rgb(' + (isArray(x) ? x.join(',') : x.r + ',' + x.g + ',' + x.b ) + ')';
				}
				return colorspace(color) === 'oklch' ? oklchToRgb([x, y, z], 'string') : lchToRgb([x, y, z], 'string');
			}
			if ((x = color.x) != undefined && (y = color.y) != undefined && (z = color.z) != undefined) {
				return xyzToRgb([x, y, z], 'string');
			}
			var c, m, y, k;
			switch(cs) {
				case 'cmyk':					
					return cmykToRgb(color);
				case 'cmy':
					return cmyToRgb(color);
			}
			if ((x = cVal(color, ['r', 'red'])) != undefined) {
				return 'rgb(' + x + ',' + cVal(color, ['g', 'green']) + ',' + cVal(color, ['b', 'blue']) + ')';
			}
			if ((c = cVal(color, ['c', 'cyan'])) != undefined 
					&& (m = cVal(color, ['m', 'magenta'])) != undefined
					&& (k = cVal(color, ['y', 'yellow'])) != undefined) {
				if ((k = cVal(color, ['k', 'key'])) != undefined) {
					return cmykToRgb(color);
				}
				return cmyToRgb(color);
			}
			var cs = color.colorspace||color.colorSpace||color.space||color.cs||color.name||'';
			var c = css4ColorToRgb(color, cs, 'string');
			if (c) {
				return c;
			}
		} else if (isArray(color)) {
			var percent = typeof color[0] === 'string' && /%$/.test(color[0]);
			if (color.length > 3) {
				if (percent) {
					color = color.map(function(c) {
						if (/%$/.test(c))
							throw new Error('Incorrect color value');
						return Math.floor(parseFloat(c, 10));
					})
					color[3] = color[3]/100;
				} else {
					color = color.map(function(c) {
						return parseInt(c, 10);
					})
				}
				color = rgbaToRgb(color);
				return 'rgb(' + color.join(', ') + ')';
			} else {
				return 'rgb(' + color.join(percent ? ' ' : ', ') + ')';
			}
		}
	}
	
	function percentToByte(c) {
		return Math.floor(parseFloat(c.substring(0, c.length - 1), 10)*255/100);
	}
	/**
	 * 
	 * @param {String|Object|Array} color
	 * @param {Object} [cn] 
	 * @param {Object} [nameAskey] 
	 * @returns {Object}
	 */
	function toRgb(color, cns, nameAskey, preserveAlpha) {
		function _hMatchToRgb(match) {
			var hc;
			switch(match[1]) {
				case 'hsl':
					return hslToRgb(hc = _toHObj(match, ['h', 's', 'l'], true))
				case 'hsv':
					return hsvToRgb(_toHObj(match, ['h', 's', 'v'], true))
				case 'hsb':
					return hsbToRgb(_toHObj(match, ['h', 's', 'b'], true))
				case 'hwb':
					return hwbToRgb(_toHObj(match, ['h', 'w', 'b'], true))
				default:
					throw new Error('Not yet supported');
			}
		}
		var match;
		var c;
		var keys;
		if (typeof cns === 'boolean') {
			c = cns;
			cns = nameAskey;
			nameAskey = preserveAlpha;
			preserveAlpha = c;
		} else if (isPlainObj(cns)) {
			if (typeof (c = cns.preserveAlpha) === 'boolean') {
				preserveAlpha = c;
				if (typeof nameAskey === 'undefined') {
					nameAskey = cns.nameAskey;
				}
				cns = cns.colorNamingSystem||cns.colorNameSystem
						||cns.nameColors||cns.namedColors||cns.cns;
			}
		}
		if (typeof color === 'string') {
			if (color === 'transparent')
				return {};
			if ((match = /^(?:#)?([0-9a-fA-F]+)$/.exec(color))) {
				c = match[1];
				if (c.length === 6) {
					return {
						r: parseInt(c.substring(0, 2), 16),
						g: parseInt(c.substring(2, 4), 16),
						b: parseInt(c.substring(4, 6), 16)
					}
				} else if (match[1].length === 3) {
					return {
						r: parseInt(c[0] + c[0], 16),
						g: parseInt(c[1] + c[1], 16),
						b: parseInt(c[2] + c[2], 16)
					}
				} else if (match[1].length === 8) {
					return rgbaToRgb({
						r: parseInt(c.substring(0, 2), 16),
						g: parseInt(c.substring(2, 4), 16),
						b: parseInt(c.substring(4, 6), 16),
						a: parseInt(c.substring(6, 8), 16)/255
					})
				} else if (match[1].length === 4) {
					return rgbaToRgb({
						r: parseInt(c[0] + c[0], 16),
						g: parseInt(c[1] + c[1], 16),
						b: parseInt(c[2] + c[2], 16),
						a: parseInt(c[2] + c[2], 16)/255
					})
				}
			} else if ((match = _rgbRe.exec(color))) {
				if ((a = getAlpha(match[6]||match[8], match[7])) == undefined || a === 1) {
					return {
						r: rgbComponentVal(match[3]),
						g: rgbComponentVal(match[4]),
						b: rgbComponentVal(match[5])
					};
				} else {
					return rgbaToRgb({
						r: rgbComponentVal(match[3]),
						g: rgbComponentVal(match[4]),
						b: rgbComponentVal(match[5]),
						a: a
					});
				}
			} else if ((match = _hColorRe.exec(color))) { 
				if ((a = getAlpha(match[9], match[10])) == undefined || a === 1) { //if alpha component exists
					return _hMatchToRgb(match);
				} else if (preserveAlpha) {
					c = _hMatchToRgb(match);
					c.a = a;
					return c;
				} else {
					switch(match[1]) {
						case 'hsl':
						case 'hsla':
							return rgbaToRgb(hslaToRgba(_toHObj(match, ['h', 's', 'l', 'a'], true)))
						case 'hsv':
						case 'hsva':
							return rgbaToRgb(hsvaToRgba(_toHObj(match, ['h', 's', 'v', 'a'], true)))
						case 'hsb':
						case 'hsba':
							return rgbaToRgb(hsbaToRgba(_toHObj(match, ['h', 's', 'b', 'a'], true)))
						case 'hwb':
						case 'hwba':
							return rgbaToRgb(hwbaToRgba(_toHObj(match, ['h', 'w', 'b', 'a'], true)))
						default:
							throw new Error('Incorrect color');
					}
				}
				//throw new Error((match[1] + (match[2]||'')).toUpperCase() 
				//	+ ' Color\'s string value not yet supported: ' + c);
			} else if ((match = _cmykRe.exec(color))) {
				throw new Error('CMYK Color\'s string value not yet supported: ' + c);
			} else if ((match = _cmyRe.exec(color))) {
				throw new Error('CMY Color\'s string value not yet supported: ' + c);
			} else if ((c = _getExtRgb(color, preserveAlpha))) {
				return c;
			} else {
				if (!cns) {
					cns = nativeNames;
					if (nameAskey == undefined) {
						nameAskey = true;
					}
				}
				c = nameToHex(color, cns, nameAskey)
				return {
					r: parseInt(c.substring(0, 2), 16),
					g: parseInt(c.substring(2, 4), 16),
					b: parseInt(c.substring(4, 6), 16)
				}
			}
		} else if (isPlainObj(color)) {
			var a = color.a === undefined ? color.alpha : color.a;
			var r = color.r === undefined ? color.red : color.r;
			var g = color.g === undefined ? color.green : color.g;
			var b = color.b === undefined ? color.blue : color.b;
			var x;
			if (r == undefined && g == undefined && b == undefined && a == undefined)
				return {};
			if (r != undefined){
				return a != undefined ? rgbaToRgb(color) : color;
			}
			if ((x = cVal(color,['l', 'lightness', 'L', 'Lightness'])) !== undefined) {
				if ((a = color.a) !== undefined && (b = color.b) !== undefined) { //lab
					return labToRgb(x, a, b);
				} else if ((a = cVal(color,['c', 'chroma', 'C', 'Chroma'])) !== undefined && (b = color.h) !== undefined) { //lab
					return lchToRgb(x, a, b);
				} else {
					return (a = color.a == undefined ? color.alpha : color.a) != undefined ? rgbaToRgb(hslaToRgba(color)) : hslToRgb(color);
				}
			} else if (color.v !== undefined) { //hsv
				return a != undefined ? rgbaToRgb(hsvaToRgba(color)) : h(color);
			} else if (color.h !== undefined && color.b !== undefined) { //hsb
				return a != undefined ? hsbaToRgb(hsbaToRgba(color)) : hsbToRgb(color);
			} else if (color.w !== undefined) { //hwb
				return a != undefined ? rgbaToRgb(hwbaToRgba(color)) : hwbToRgb(color);
			} else if (color.c !== undefined && color.k !== undefined) { //cmyk
				return cmykToRgb(color);
			} else if (color.c !== undefined && color.y !== undefined) { //cmy
				return cmyToRgb(color);
			}
			
		} else if (isArray(color)) {
			var percent = typeof color[0] === 'string' && /%$/.test(color[0]);
			if (color.length > 3) {
				if (percent) {
					color = color.map(function(c) {
						if (/%$/.test(c))
							throw new Error('Incorrect color value');
						return percentToByte(c);
					})
					color[3] = color[3]/100;
				} else {
					color = color.map(function(c) {
						return parseInt(c, 10);
					})
				}
				return rgbaToRgb(color);
			} else if (percent) {
				return { r: percentToByte(color[0]), g: percentToByte(color[1]), b: percentToByte(color[2])}
			} else {
				return { 
					r: parseInt(color[0], 10),
					g: parseInt(color[1], 10),
					b: parseInt(color[2], 10)
				}
			}
		}
	}

	var _hslRe = /^hsl\(\s*(\d+(?:\.\d+)?|\.\d+)(deg|rad|turn|grad|%)?(?:[ \t]*?(?:,[ \t]*|[ \t]+))(?:(\d+(?:\.\d+)?)(%)?)(?:[ \t]*?(?:,[ \t]*|[ \t]+))(?:(\d+(?:\.\d+)?)(%)?)\s*\)$/;
	
	var _hslaRe = /^hsla\(\s*(\d+(?:\.\d+)?|\.\d+)(deg|rad|turn|grad|%)?(?:[ \t]*?(?:,[ \t]*|[ \t]+))(?:(\d+(?:\.\d+)?)(%)?)(?:[ \t]*?(?:,[ \t]*|[ \t]+))(?:(\d+(?:\.\d+)?)(%)?)(?:(?:[ \t]*?(?:,[ \t]*|[ \t]+?)(?:\/[ \t]*)?)(?:(\d+(?:\.\d+)?)(%)?))?\s*\)$/;;
	
	function opacity(a, p) {
		var o = parseFloat(a, 10);
		if (p) {
			o /= 100;
		}
		if (o < 0 || o > 1) {
			throw new Error('Out of bounds opacity');
		}
		return o;
	}
	function _hue(h, u) {
		h = parseFloat(h);
		var f;
		if (u === 'deg') {
			f = 1;
		} else if (u === 'grad') {
			f = 400/360;
		} else if (u === 'turn') {
			f = 360;
		} else if (u === 'rad') {
			f = 2*Math.PI;
		} else if (u === '%') {
			f = 3.6;
		}
		return h*f;
	}
	
	function _percent(v, symbol) {
		v = parseFloat(v);
		if (!symbol)
			return v*100;
		return v;
	}
	/**
	 * 
	 * @param {String|Object|Array} color
	 * @param {Object} [cn] 
	 * @param {Object} [nameAskey] 
	 * @returns {Object}
	 */
	function toHsl(color, cns, nameAskey, alpha) {
		var m;
		var c;
		var unit;
		var h, s, l, a;
		if (typeof cns === 'boolean') {
			m = cns;
			cns = nameAskey;
			nameAskey = alpha;
			alpha = m;
		}
		if (typeof color === 'string') {
			if ((m = _hslRe.exec(color)) || (m = _hslaRe.exec(color))) {
				h = _hue(m[1], m[2]||'deg');
				s = _percent(m[3], m[4]);
				l = _percent(m[5], m[6]);
				c = { h: h, s: s, l: l };
				if (m[7]) {
					c.a = opacity(m[7], m[8])
					if (!alpha) c = hslaToHsl(c)
				}
				return c;
			}
		} else if (isPlainObj(color) && (l = cVal(color, ['l', 'lightness', 'luminance', 'luminence'])) !== undefined){
			h = cVal(color, ['h', 'hue']);
			s = cVal(color, ['h', 'hue']);
			a = cVal(color, ['a', 'alpha']);
			return a == undefined ? { h: h, s: s, l: l } : hslaToHsl({ h: h, s: s, l: l, a: a })
		}
		rgb = toRgb.call(this, arguments);
		return rgbToHsl(rgb);
	}
	function toRgbaString(color) {
		if (typeof color === 'string') {
			if (color === 'transparent')
				return 'transparent';
		}
		if (isArray(color)) {
			return 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3] === 0 ? 0 : color[3]||1) + ')';
		}
		if (Object.keys(color).length === 0)
			return 'transparent'
		
		color = toRgba(color);
		if (isArray(color)) {
			return 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3] === 0 ? 0 : color[3]||1) + ')';
		}
		return 'rgba(' + (color.r||color.red||0) + ',' 
				+ (color.g||color.green||0) + ','
				+ (color.b||color.blue||0) + ',' 
				+ (color.a === 0 || color.alpha === 0 ? 0 : color.a||color.alpha||1) + ')';
	}
	
	function _hFromArray(hsl) {
		return '(' + (hsl[0]*360) + ', ' + (hsl[1]*100) + '%' + ', ' + (hsl[2]*100) + '%)';
	}
	
	function _hFromObj(hsl) {
		return '(' + (hsl.h*360) + ', ' + (hsl.s*100) + '%' + ', ' + (hsl.l*100) + '%)';
	}

	function toHslString(color) {
		if (typeof color === 'string') {
			if (color === 'transparent')
				return 'transparent';
		}
		if (isArray(color))
			return color.length ? 'hsl' + _hFromArray(color) : 'transparent';
		if (Object.keys(color).length === 0)
			return 'transparent'
		if (h.l !== undefined) { //hsl
			return 'hsl' + _hFromObj(color);
		} else if (h.r !== undefined) { //rgb
			color = rgbToHsl(color);
		} else if (h.v !== undefined) { //hsv
			
		} else if (h.w !== undefined) { //hwb
			
		} else if (h.s !== undefined) { //hsb
			
		}
	}

	function toHslaString(color) {
		var h = toHsla.apply(arguments);
		return 'hsla(' + h.h + ',' + h.s + ',' + h.l + ',' + h.a + ')';
	}

	function toHsvString(color) {
		if (typeof color === 'string') {
			if (color === 'transparent')
				return 'transparent';
		}
		if (isArray(color))
			return color.length ? 'hsv' + _hFromArray(color) : 'transparent';
		if (Object.keys(color).length === 0)
			return 'transparent'
		if (h.v !== undefined) { //hsl
			return 'hsv' + _hFromObj(color);
		} else if (h.r !== undefined) { //rgb
			color = rgbToHsl(color);
		} else if (h.l !== undefined) { //hsl
			
		} else if (h.w !== undefined) { //hwb
			
		} else if (h.s !== undefined) { //hsb
			
		}
	}

	function toHsbString(color) {
		if (typeof color === 'string') {
			if (color === 'transparent')
				return 'transparent';
		}
		if (isArray(color))
			return color.length ? 'hsb' + _hFromArray(color) : 'transparent';
		if (Object.keys(color).length === 0)
			return 'transparent'
		if (h.w !== undefined) { //hsl
			return 'hsb' + _hFromObj(color);
		} else if (h.r !== undefined) { //rgb
			color = rgbToHwb(color);
		} else if (h.l !== undefined) { //hsl
			
		} else if (h.v !== undefined) { //hsv
			
		} else if (h.s !== undefined) { //hsb
			
		}
		if (isArray(color)) {
			return 'hsb' + _hFromArray(color);
		}
		if (isPlainObj(color)) {
			return 'hsb' + _hFromObj(color);
		}
	}

	function toHwbString(color) {
		if (typeof color === 'string') {
			if (color === 'transparent')
				return 'transparent';
		}
		if (isArray(color))
			return color.length ? 'hwb' + _hFromArray(color) : 'transparent';
		if (Object.keys(color).length === 0)
			return 'transparent'
		if (h.w !== undefined) { //hsl
			return 'hwb' + _hFromObj(color);
		} else if (h.r !== undefined) { //rgb
			color = rgbToHwb(color);
		} else if (h.l !== undefined) { //hsl
			
		} else if (h.v !== undefined) { //hsv
			
		} else if (h.s !== undefined) { //hsb
			
		}
		if (isArray(color)) {
			return 'hwb' + _hFromArray(color);
		}
		if (isPlainObj(color)) {
			return 'hwb' + _hFromObj(color);
		}
	}

	function toCmykString(color) {
		if (isArray(color)) {
			return 'cmyk(' + color.join(', ') + ')';
		} 
		return 'cmyk(' + (color.c||color.cyan||0) + ', ' + (c.m||c.magenta||0) + ', ' + (c.y||c.yellow||0) + ', ' + (c.k||c.key||c.black||0) + ')';
	}
	
	function nameToHexValue(colorName, ncs, nameAskey) {
		var hex;
		var keys;
		var i, n, k;
		var fn;
		if (colorName === 'transparent')
			return '';
		if (ncs && ncs.toHex) {
			hex = ncs.toHex(colorName);
		} else if (ncs && ncs.toHexValue) {
			hex = ncs.toHexValue(colorName);
		} else if (isPlainObj(ncs)) {
			if (typeof (fn = ncs.toHexString||ncs.getHexValue||ncs.getHexString) === 'function') {
				hex = fn.call(ncs, colorName);
			} else if (nameAskey == undefined || nameAskey === '') {
				if (ncs['black']) {
					hex = ncs[colorName];
				} else {
					keys = Object.keys(ncs);
					if (/^#/.test(keys[0]) || /^[a-fA-F0-9]/.test(keys[0])) {
						i = 0;
						n = keys.length;
						for (; i < n; i++) {
							k = keys[i];
							if (ncs[k] === colorName) {
								hex = k;
								break;
							}							
						}
					} else {
						hex = ncs[colorName];
					}
				}
			} else if (nameAskey) {
				hex = ncs[colorName];
			} else {
				keys = Object.keys(ncs);
				i = 0;
				n = keys.length;
				for (; i < n; i++) {
					k = keys[i];
					if (ncs[k] === colorName) {
						hex = k;
						break;
					}							
				}
			}
		}
		if (hex && hex[0] != '#')
			return '#' + hex;
		return hex;
	}
	/*!*
	 * 
	 * @private
	 * @param {String} colorName
	 * @param {Object} [ncs] Color naming system or name colors map
	 * @param {Boolean} [nameAskey] name colors map keys represents color names?
	 * @returns {String}
	 */
	function nameToHex(colorName, ncs, nameAskey) {
		var hex;
		var keys;
		var i, n, k;
		var fn;
		if (colorName === 'transparent')
			return '';
		if (ncs && ncs.toHex) {
			hex = ncs.toHex(colorName);
		} else if (ncs && ncs.toHexValue) {
			hex = ncs.toHexValue(colorName);
		} else if (isPlainObj(ncs)) {
			if (typeof (fn = ncs.toHexString||ncs.getHexValue||ncs.getHexString) === 'function') {
				hex = fn.call(ncs, colorName);
			} else if (nameAskey == undefined || nameAskey === '') {
				if (ncs['black']) {
					hex = ncs[colorName];
				} else {
					keys = Object.keys(ncs);
					if (/^#/.test(keys[0]) || /^[a-fA-F0-9]/.test(keys[0])) {
						i = 0;
						n = keys.length;
						for (; i < n; i++) {
							k = keys[i];
							if (ncs[k] === colorName) {
								hex = k;
								break;
							}							
						}
					} else {
						hex = ncs[colorName];
					}
				}
			} else if (nameAskey) {
				hex = ncs[colorName];
			} else {
				keys = Object.keys(ncs);
				i = 0;
				n = keys.length;
				for (; i < n; i++) {
					k = keys[i];
					if (ncs[k] === colorName) {
						hex = k;
						break;
					}							
				}
			}
		} else {
			
		}
		//- if color naming system and the name does not match a hex value
		//  in that system, try fallback to check in native css/web color names
		//- if no color naming system, check in native css/web color names
		hex = hex||nativeNames[colorName.toLowerCase()];
		if (hex)
			return (hex[0] == '#' ? hex.substring(1) : hex).toUpperCase();
		throw new Error('No matching/found color for the given name: ' + colorName);
	}
	/**
	 * Returns the name of the given color
	 * @name SereniX.CssColorUtils.getColorName
	 * @param {String} color
	 * @param {Object|Function} [cns] The color naming system object or function to get the color name of the given color.
	 * 		When no color naming not specified, the web/native color names is used.
	 * @param {Boolean} [nameAskey] The keys of the color name system object represents the names of the colors?
	 * @returns {String}
	 */
	function getColorName(color, cns, nameAskey) {
		var keys;
		var a, hex, n;
		var match;
		if (color === 'transparent' || color === 'Transparent')
			return 'transparent';
		if (typeof color === 'string') {
			if (cns && cns.getColorName) {
				n = cns.getColorName(color);
			} else if (cns && cns.getName) {
				n = cns.getName(color);
			} else if (cns && (typeof cns.name === 'function')) {
				n = cns.name(color);
			} else if (typeof cns === 'function') {
				n = cns(color);
			} else if (isPlainObj(cns)) {
				n = cns[color];
			} else {
				if ((match = /^(#)?([0-9a-fA-F]{3,8})$/.exec(color))) {
					match = match[1];
					if (match.length === 6) {
						n = nativeColorNames['#' + match];
					} else if (match.length === 3) {
						n = nativeColorNames['#' + match[0]+match[0]+match[1]+match[1]+match[2]+match[2]];
					}					
				}				
			}
			if (n != undefined)
				return n;
			if (!/^(#?[0-9a-fA-F]{3,8}$|(?:(?:rgb|hs[lvb]|hwb)a?|cmyk)\s*\()/.test(color))
				return color;
		} else if (isPlainObj(color)) {
			var a = color.a === undefined ? color.alpha : color.a;
			keys = Object.keys(color);
			if (keys.length === 0)
				return 'transparent';
			if (keys.indexOf('r') >= 0) {
				if (a === undefined || a === 1) {
					hex = rgbToHex(color);
				}
			} else if (keys.indexOf('red') >= 0) {
				if (a === undefined || a === 1) {
					hex = toHexValue({r: color.red, g: color.green, b: color.blue});
				}
			} else if (keys.indexOf('h') >= 0) {
				if (a === undefined || a === 1) {
					
				}
			} else if (keys.indexOf('hue') >= 0) {
				if (a === undefined || a === 1) {
					
				}
			} else if (keys.indexOf('c') >= 0) {
				hex = cmykToHex(color);
			}
		} else if (isArray(color)) {
			switch (color.length) {
				case 0:
					return 'transparent';
				default:
					if (a === undefined || a === 1) {
						hex = arrayRgbToHex(color);
					} else {
						hex = rgbToHex(rgbaToRgb({r: color[0], g: color[1], b: color[2], a: a}));
					}
			}
		}
		
	}
	
	/**
	 * 
	 * Assumes that h in the range 0 to 360, w and b in the range 0 to 100
	 * @param {Number} h 
	 * @param {Number} w 
	 * @param {Number} b 
	 * @returns {Object}
	 */
	function hwbToRgb(h, w, b, arrayOrResultType) {
		if (isArray(h)){
			w = h[1];
			b = h[2];
			h = h[0];
		} else if (isPlainObj(h)) {
			w = h.w||h.whiteness||0;
			b = h.b||h.blackness||0;
			h = h.h||h.hue||0;
		}
		var i, rgb, rgbArr = [];
		rgb = hslToRgb(h, 100, 50);
		h /= 360;
		w /= 100;
		b /= 100;
		rgb[0] /= 255;
		rgb[1] /= 255;
		rgb[2] /= 255;
		for (i = 0; i < 3; i++) {
			rgb[i] *= (1 - w - b);
			rgb[i] += w;
			rgb[i] = Math.round(rgb[i] * 255);
		}
		if (arrayOrResultType === true || arrayOrResultType === 1 || arrayOrResultType === 'array')
			return rgb;
		if (arrayOrResultType === 'array')
			return 'rgb(' + rgb.join(',') + ')';
		return {r : rgb[0], g : rgb[1], b : rgb[2] };
	}
	
	
	function rgbToHex(r, g, b) {
		function toHex(i) {
			var t, u, digits = "0123456789ABCDEF";
			if (i >= 0 && i <= 255) {
				u = i%16;
				return digits[(i - u)/16] + digits[u];
			}
			throw new Error("Incorrect argument");
		}
		if (isArray(r)) {
			b = r[2];
			g = r[1];
			r = r[0];
		} else if (typeof r === 'object' && r) {
			b = r.b;
			if (b == undefined) {
				b = r.blue;
				g = r.green;
				r = r.red;
			} else {
				g = r.g;
				r = r.r;
			}
		}
		return toHex(r) + toHex(g) + toHex(b);
	};
	
	function rgbToHexValue(r, g, b) {
		return '#' + rgbToHex.apply(this, arguments);
	}
	
	
	var rgbToHexVal = rgbToHexValue;

	/**
	   * Converts the CMYK colors to RGB colors
	   * @param {Number|Object|Array} c 
	   * @param {Number|Object} [m] 
	   * @param {Number} [y] 
	   * @param {Number} [k] 
	   * @returns {Object}
	   */
	function cmykToRgb(c, m, y, k, arrayOrResultType) {
		var len = arguments.length, o;
		if (len === 4) {
			arrayOrResultType = 'object';
		} else if (len > 4) {
			if (typeof arrayOrResultType === 'number')
				arrayOrResultType = !!arrayOrResultType;
		} else if (isArray(c)) {
			arrayOrResultType = m == undefined ? 'array' : m;
			m = c[1];
			y = c[2];
			k = c[3];
			c = c[0];
		} else if (typeof c === 'object' && c) {
			arrayOrResultType = m == undefined ? 'object' : m;
			if ((m = c.m) == undefined) {
				m = c.magenta;
				y = c.yellow;
				k = c.key;
				c = c.cyan;
			} else {
				y = c.y;
				k = c.k;
				c = c.c;
			}
		} else {
			throw new Error("Incorrect arguments");
		}
		
		c /= 100;
		m /= 100;
		y /= 100;
		k /= 100;
		var r = Math.round((1 - Math.min( 1, c * ( 1 - k ) + k ))*255);
		var g = Math.round((1 - Math.min( 1, m * ( 1 - k ) + k ))*255);
		var b = Math.round((1 - Math.min( 1, y * ( 1 - k ) + k ))*255);
		if (arrayOrResultType === true 
				|| (arrayOrResultType != undefined) 
				|| arrayOrResultType === 'object') {
			return { r: r, g: g, b: b };
		}
		if (arrayOrResultType === 'array') {
			return [r, g, b ];
		}
		if (arrayOrResultType === 'string') {
			return 'rgb(' + [r, g, b ].join(',') + ')';
		}
		return { r: r, g: g, b: b };
	};
	
	function cmykToRgba(c, m, y, k, arrayOrResultType) {
		var r = cmykToRgb.apply(this, arguments);
		if (isArray(r))
			r[3] = 1;
		else if (isPlainObj(r))
			r.a = 1;
		else
			r = 'rgba(' + r.substring(4, r.length - 1) + ',1)';
		return r;
	}

	cmykToHex = function() {
		return rgbToHex(cmykToRgb.apply(this, arguments));
	};
	function cmykToHexValue() {
		return rgbToHexValue(cmykToRgb.apply(this, arguments));
	};
	/**
	 * Converts the RGB colors to CMYK colors
	 * @param {Number|Object|Array} r 
	 * @param {Number|Object} [g] 
	 * @param {Number} [b] 
	 * @param {Object} [o] 
	 * @returns {Object}
	 */
	function rgbToCmyk(r, g, b, o) {
		var c, m, y, k, len = arguments.length;
		if (len === 1 || (typeof g === 'object' && g)) {
			o = g||{};
			if (isArray(r)) {
				b = r[2];
				g = b[1];
				r = r[0];
			} else if (typeof r === 'object' && r) {
				b = r.b;
				if (b == undefined) {
					b = r.blue;
					g = r.green;
					r = r.red;
				} else {
					g = r.g;
					r = r.r;
				}
			} else {
				throw new Error("Incorrect arguments");
			}
		} else {
			o = o||{};
		}
		r /= 255;
		g /= 255;
		b /= 255;
	 
		k = Math.min( 1 - r, 1 - g, 1 - b );
		if ((1 - k) == 0 ){
		  c = 0 ;
		  m = 0 ;
		  y = 0 ;
		} else {
		c = ( 1 - r - k ) / ( 1 - k );
		m = ( 1 - g - k ) / ( 1 - k );
		y = ( 1 - b - k ) / ( 1 - k );
		}
		c = Math.round( c * 100 );
		m = Math.round( m * 100 );
		y = Math.round( y * 100 );
		k = Math.round( k * 100 );

		o.c = c;
		o.m = m;
		o.y = y,
		o.k = k;
		return o;
	};
	/**
	 * 
	 * @param {unsigned byte} r The rgba color red component
	 * @param {unsigned byte} g The rgba color green component
	 * @param {unsigned byte} b The rgba color blue component
	 * @param {Number} a  The rgba color alpha value between 0 and 1
	 * @param {unsigned byte} r2  The background color red component
	 * @param {unsigned byte} g2  The background color green component
	 * @param {unsigned byte} b2  The background color blue component
	 * @returns {Array}
	 */
	function rgbaToRgb(r, g, b, a, r2,g2,b2){
		function defaultBg() {
			var defBg = CCU.backgroundColor||CCU.defaultBackgroundColor;
			if (isPlainObj(defBg)) {
				r2 = defBg.r != undefined ? defBg.r : defBg.red === 0 ? 0 : defBg.red||255;
				g2 = defBg.g != undefined ? defBg.g : defBg.green === 0 ? 0 : defBg.green||255;
				b2 = defBg.b != undefined ? defBg.b : defBg.blue === 0 ? 0 : defBg.blue||255;
				return;
			} else if (isArray(defBg)) {
				r2 = defBg[0] === 0 ? 0 : defBg[0]||255;
				g2 = defBg[1] === 0 ? 0 : defBg[1]||255;
				b2 = defBg[2] === 0 ? 0 : defBg[2]||255;
				return;
			}
			r2=255;
			g2=255;
			b2=255;
		}
		var $ = arguments, l = $.length,c;
		if (l === 1) {
			defaultBg()
			if (Array.isArray(r)) {
				g = r[1];
				b = r[2];
				a = r[3];
				r = r[0];
			} else {
				a = r.a == undefined ? r.alpha : r.a;
				b = r.b == undefined ? r.blue : r.b;
				g = r.g == undefined ? r.green : r.g;
				r = r.r == undefined ? r.red : r.r;
			}
		} else if (l === 2) {
			c = $[0];
			if (Array.isArray(c)) {
				r = c[0], g = c[1], b = c[2], a = c[3];
				c = $[1];
				if (typeof c === 'number') {
					r2=c,g2=c,b2=c;
				} else {
					r2 = c[0], g2 = c[1], b2 = c[2];
				}
			} else if (typeof c === 'object' && c) {
				r = c.red, g = c.green, b = c.blue, a = c.alpha;
				c = $[1];
				if (typeof c === 'number') {
					r2=c,g2=c,b2=c;
				} else {
					r2 = c.red, g2 = c.green, b2 = c.blue;
				}
			}
		} else if (arguments.length === 4) {
			_defaultBg();
		} else {
			if (g2 === undefined) g2 = r2;
			if (b2 === undefined) b2 = r2;
		}
		return [ Math.round(((1 - a) * r2) + (a * r)) , Math.round(((1 - a) * g2) + (a * g)) , Math.round(((1 - a) * b2) + (a * b)) ];
	}

	function rgb2hex(rgb) {
        rbg = rgb.match(rgbRegex);
        function lpad(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "#" + lpad(rgb[1]) + lpad(rgb[2]) + lpad(rgb[3]);
    }
    
    /**
     * Converts an RGB color value to HSL. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes r, g, and b are contained in the range 0 to 255 and
     * returns h, s, and l in the range 0 to 1.
     *
     * @param   {Number}  r  The red color value
     * @param   {Number}  g  The green color value
     * @param   {Number}  b  The blue color value
	 * @param   {Boolean}  obj  Result as object?
     * @returns {Array|Object}   The HSL representation
     */
    function rgbToHsl(r, g, b, obj) {
		if (isArray(r)){
			obj = g;
			g = r[1];
			b = r[2];
			r = r[0];
		} else if (isPlainObj(r)) {
			obj = g;
			g = r.g||r.green||0;
			b = r.b||r.blue||0;
			r = r.r||r.red||0;
		}
      r /= 255, g /= 255, b /= 255;

      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;

      if (max == min) {
        h = s = 0; // achromatic
      } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
      }

      return [ h, s, l ];
    }
    
    /**
     * Converts an HSL color value to RGB. Conversion formula
     * Assumes h in the range 0 to 360, s in the range 0 to 100, and l in the range 0 to 100
     * returns r, g, and b in the range 0 to 255.
     *
     * @param   {Number}  h       The hue
     * @param   {Number}  s       The saturation
     * @param   {Number}  l       The lightness
	 * @param   {Boolean} object
     * @return  {Array|Object}   The RGB representation
     */
    function hslToRgb(h, s, l, object) {
      var r, g, b;
	  if (isArray(h)){
		s = h[1];
		l = h[2];
		h = h[0];
		object = s;
	  } else if (isPlainObj(h)) {
		s = (h.s||h.saturation||0);
		l = (h.l||h.lightness||h.luminence||h.luminance||0);
		h = (h.h||h.hue||0);
		object = s;
	  }
	  
	  s /= 100;
	  l /= 100;
	  h /= 360;

      if (s == 0) {
        r = g = b = l; // achromatic
      } else {
        function hue2rgb(p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1/6) return p + (q - p) * 6 * t;
          if (t < 1/2) return q;
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
          return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
      }
	  r = Math.round(r * 255)
	  g = Math.round(g * 255)
	  b = Math.round(b * 255)
      return object ? {r: r, g: g, b: b} : [ r, g, b ];
    }
	
	
	/**
	 * 
	 * @param {Number} h
	 * @param {Number} s
	 * @param {Number} l
	 * @param {Boolean} [array=false]  Return the result as an array?
	 * @returns {String|Array}
	 */
	function hslToRgb2(h, s, l, array) {
		if (isArray(h)) {
			array = s;
			s = h[1]||0;
			l = h[2]||0;
			h = h[0];
		} else if (typeof h === 'string') {
			array = s;
			var sep = h.indexOf(",") > -1 ? "," : " ";
			h = h.substr(4).split(")")[0].split(sep);        
			s = h[1].substr(0,h[1].length - 1) / 100, //remove '%' in the s component
			l = h[2].substr(0,h[2].length - 1) / 100; //remove '%' in the l component
			h = h[0];
		} else {
			array = s;
			s = h.saturation||h.s||h.Saturation||h.S||0;
			l = h.luminence||h.l||h.Luminence||h.L||0;
			h = h.hue||h.h||h.Hue||h.H||0;
		}
		// Must be fractions of 1
		s /= 100;
		l /= 100;

		var c = (1 - Math.abs(2 * l - 1)) * s,
			x = c * (1 - Math.abs((h / 60) % 2 - 1)),
			m = l - c/2,
			r = 0,
			g = 0,
			b = 0;
		if (0 <= h && h < 60) {
		  r = c; g = x; b = 0;  
		} else if (60 <= h && h < 120) {
		  r = x; g = c; b = 0;
		} else if (120 <= h && h < 180) {
		  r = 0; g = c; b = x;
		} else if (180 <= h && h < 240) {
		  r = 0; g = x; b = c;
		} else if (240 <= h && h < 300) {
		  r = x; g = 0; b = c;
		} else if (300 <= h && h < 360) {
		  r = c; g = 0; b = x;
		}
		r = Math.round((r + m) * 255);
		g = Math.round((g + m) * 255);
		b = Math.round((b + m) * 255);

		return array ? [r, g, b] : "rgb(" + r + "," + g + "," + b + ")";
		  
	}

    /**
     * Converts an RGB color value to HSV. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
     * Assumes r, g, and b are contained in the range 0 to 255 and
     * returns h, s, and v in the range 0 to 255.
     *
     * @param   {Number}  r       The red color value
     * @param   {Number}  g       The green color value
     * @param   {Number}  b       The blue color value
	 * @param   {Boolean}  obj  Result as plain object?
     * @returns {Array}            The HSV representation
     */
    function rgbToHsv(r, g, b, obj) {
		if (isArray(r)){
			obj = g;
			g = r[1];
			b = r[2];
			r = r[0];
	    } else if (isPlainObj(r)) {
			obj = g;
			g = r.g||h.green||0;
			b = r.b||r.blue||0;
			r = r.r||r.red||0;
	    }
        r /= 255, g /= 255, b /= 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, v = max;

        var d = max - min;
        s = max == 0 ? 0 : d / max;

        if (max == min) {
          h = 0; // achromatic
        } else {
			switch (max) {
			  case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			  case g: h = (b - r) / d + 2; break;
			  case b: h = (r - g) / d + 4; break;
			}

			h /= 6;
        }

        return obj ? {h: h, s: s, v: v} : [ h, s, v ];
    }

    /**
     * Converts an HSV color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
     * Assumes h, s, and v are contained in the range 0 to 255 and
     * returns r, g, and b in the range 0 to 255.
     *
     * @param   {Number}  h       The hue
     * @param   {Number}  s       The saturation
     * @param   {Number}  v       The value
	 * @param {Boolean} [obj] Result as object?
     * @return  {Array|Object}  The RGB representation
     */
    function h(h, s, v, obj) {
        function val(v) {
            return Math.max(0, Math.min(Math.round(v), 255));
        }
        var r, g, b;
		
		if (isArray(h)){
			obj = s;
			s = h[1];
			l = h[2];
			h = h[0];
		} else if (isPlainObj(h)) {
			obj = s;
			s = h.s||h.saturation||0;
			v = h.v||r.value||0;
			h = h.h||h.hue||0;
		}

        var i = Math.floor(h * 6);
        var f = h * 6 - i;
        var p = v * (1 - s);
        var q = v * (1 - f * s);
        var t = v * (1 - (1 - f) * s);

        switch (i % 6) {
            case 0: r = v; g = t; b = p; break;
            case 1: r = q; g = v; b = p; break;
            case 2: r = p; g = v; b = t; break;
            case 3: r = p; g = q; b = v; break;
            case 4: r = t; g = p; b = v; break;
            case 5: r = v; g = p; b = q; break;
        }
		r = val(r * 255);
		g = val(g * 255);
		b = val(b * 255);
        return obj ? { r: r, g: g, b: b} : [ r, g, b ];
    }
	
	/**
	 * 
	 * @param {Number|String|Array|Object} r
	 * @param {Number} g
	 * @param {Number} b
	 * @param {Number} a
	 * @param {Boolean} array
	 * @returns {Array|String}
	 */
	function rgbaToHsla(r, g, b, a, array) {
		if (isArray(r)) {
			array = g;
			g = r[1]||0;
			b = r[2]||0;
			a = r[3]||0;
			r = r[0];
		} else if (typeof r === 'string') {
			array = g;
			var rgb = r, v,
				sep = rgb.indexOf(",") > -1 ? "," : " ";
			rgb = rgb.substr(5).split(")")[0].split(sep);

			for (var i = 0, n = rgb.length; i < n; i++) {
			  v = rgb[i];
			  if (r.indexOf("%") > -1) 
				rgb[i] = (i === 3 ? 1  : 255) *Math.round(r.substr(0,r.length - 1) / 100);
			}
			r = rgb[0];
			g = rgb[1];
			b = rgb[2];
			a = rgb[3];
		} else {
			g = r.green||r.g||r.Green||r.G||0; 
			b = r.blue||r.b||r.Blue||r.B||0; 
			a = r.alpha||r.Alpha||r.a||r.A||r.opacity||r.Opacity||r.o||r.O;
			r = r.red||r.r||r.Red||r.R||0;
		}
		var rgba = rgbToHsl(r, g, b, true);
		rgba[3] = a;
		return array ? rgba : 'rgba(' + rgba.join(',') + ')';
	}
	/**
	 * 
	 * @param {Number} h
	 * @param {Number} s
	 * @param {Number} l
	 * @param {Boolean} [array=false]  Return the result as an array?
	 * @returns {String|Array}
	 */
	function hsl2Rgb(h, s, l, array) {
		if (isArray(h)) {
			array = s;
			s = h[1]||0;
			l = h[2]||0;
			h = h[0];
		} else if (typeof h === 'string') {
			array = s;
			var sep = h.indexOf(",") > -1 ? "," : " ";
			h = h.substr(4).split(")")[0].split(sep);        
			s = h[1].substr(0,h[1].length - 1) / 100, //remove '%' in the s component
			l = h[2].substr(0,h[2].length - 1) / 100; //remove '%' in the l component
			h = h[0];
		} else {
			array = s;
			s = h.s||h.saturation||h.Saturation||h.S||0;
			l = h.l||h.lightness||h.luminence||h.luminance||h.Luminence||h.L||0;
			h = h.h||h.hue||h.Hue||h.H||0;
		}
		// Must be fractions of 1
		s /= 100;
		l /= 100;

		var c = (1 - Math.abs(2 * l - 1)) * s,
			x = c * (1 - Math.abs((h / 60) % 2 - 1)),
			m = l - c/2,
			r = 0,
			g = 0,
			b = 0;
		if (0 <= h && h < 60) {
		  r = c; g = x; b = 0;  
		} else if (60 <= h && h < 120) {
		  r = x; g = c; b = 0;
		} else if (120 <= h && h < 180) {
		  r = 0; g = c; b = x;
		} else if (180 <= h && h < 240) {
		  r = 0; g = x; b = c;
		} else if (240 <= h && h < 300) {
		  r = x; g = 0; b = c;
		} else if (300 <= h && h < 360) {
		  r = c; g = 0; b = x;
		}
		r = Math.round((r + m) * 255);
		g = Math.round((g + m) * 255);
		b = Math.round((b + m) * 255);

		return array ? [r, g, b] : "rgb(" + r + "," + g + "," + b + ")";
		  
	}

	/**
	 * 
	 * @param {Number} h
	 * @param {Number} s
	 * @param {Number} l
	 * @param {Number} a
	 * @param {Boolean} [array=false]  Return the result as an array?
	 * @returns {String|Array}
	 */
	function hsla2Rgba(h, s, l, a, array) {
		if (isArray(h)) {
			array = s;
			s = h[1]||0;
			l = h[2]||0;
			a = (h[3]== undefined ? 1 : h[3]||0);
			h = h[0];
		} else if (typeof h === 'string') {
			array = s;
			var sep = h.indexOf(",") > -1 ? "," : " ";
			h = h.substr(4).split(")")[0].split(sep);        
			s = h[1].substr(0,h[1].length - 1) / 100, //remove '%' in the s component
			l = h[2].substr(0,h[2].length - 1) / 100; //remove '%' in the l component
			a = (h[3]== undefined ? 1 : h[3]||0);
			h = h[0];
		} else {
			array = s;
			s = h.saturation||h.s||h.Saturation||h.S||0;
			l = h.lightness||h.luminence||h.l||h.Luminence||h.L||0;
			a = (h.alpha||h.Alpha||h.a||h.A||h.opacity||h.Opacity||h.o||h.O||0);
			h = h.hue||h.h||h.Hue||h.H||0;
		}
		var _a = "" + a;
		if (_a.endsWith('%')) {
			a = parseFloat(_a.substr(0,_a.length - 1)) / 100;
		}
		var r;
		if (array || array === 'array') {
			r = hslToRgb(h, s, l, false);
			r[3] = a;
			return r;
		} else if (array === 'string') {
			r = hslToRgb(h, s, l, false);
			r[3] = a;
			return "rgba(" + r.join(',') + ")";
		} else {
			r = hslToRgb(h, s, l, true);
			r.a = a;
			return r;
		}
		
	}
	/**
	 * 
	 * @param {Number} h
	 * @param {Number} s
	 * @param {Number} l
	 * @param {Number} a
	 * @param {Boolean} Result as object ?
	 * @returns {Array|Object}
	 */
	function hslaToRgba(h, s, l, a, obj) {
		var c = hsla2Rgba.apply(this, arguments);
		return obj ? { r: c[0], g: c[1], b: c[2], a: c[3]} : c;
	}
	
	function colorEquals(c1, c2) {		
		return (c1 === c2) || (toHex(c1) === toHex(c2));
	}
	
	function isLightColor($) {
        var match;
        if (arguments.length > 1) {
            $ = slice.call(arguments);
        } else {
            if ($ instanceof String || $ instanceof Number || $ instanceof Boolean || $ instanceof Function) {
                $ = $.valueOf();
            }
            if (typeof $ === 'string') {
                $ = getColorFromString($);
            } else if (isPlainObj($)) {
                $ = [$.red||$.r||0, $.green||$.g||0, $.blue||$.b||0];
            } else if (!Array.isArray($)) {
                throw new Error('Incorrect argument: ' + $);
            }
        }
        //return (0.299 * red) + (0.587 * green) + (0.114 * blue) > 127 ;
        return (0.299 * ($[0]||0)) + (0.587 * ($[1]||0)) + (0.114 * ($[2]||0)) > 127 ;
    }
	
	var hexRe = /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})(?:[0-9a-fA-F]{2})?$/;
	/**
	 * Returns the color class of the given color
	 * @param {String} color CSS color value
	 * @param {Object} [classes] Defined color classes
	 * @return {String}
	 */
	function colorClass(color, classes) {
		function _getLightClass(match) {
			if (!match) return '';
			return ' ' + (isLightColor(parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)) ?
					'light-color' : 'dark-color');
		}
		var h = color.toLowerCase(),
			match,
			cls,
			lightClass;
			name,
			_classes =  CCU.colorClasses||{};
			
		classes = classes||{};
		if (h === 'transparent')
			return h;
		//get predefined class of the given color
		cls = classes[color];
		if (cls)
			return cls;
		if (color[0] === '#') {
			h = color.substring(1);			
		} else if (h.indexOf('(')) {
			h = toHex(h);
			return classes[h]||_classes[h]||(/^0+$/.test(h) ? 'black' : /^f+$/.test(h) ? 'white' : 'hex-' + h) + _getLightClass(hexRe.exec(h));
		} else if (/\d/.test(color)) {
			h = 'hex-' + toHex(color);
		} else {
			cls = classes[h]||_classes[h]||h;
			if (cls)
				return cls;
			name = h;
		}
		if (/^0+$/.test(h))
			return 'black dark-color';
		if (/^f+$/.test(h))
			return 'white light-color';
		if (/^ff0000$/.test(h))
			return 'green'  + _getLightClass(hexRe.exec('ff0000'));
		if (/^ff0000$/.test(h))
			return 'red' + _getLightClass(hexRe.exec('ff0000'));
		if (/^0000ff$/.test(h))
			return 'blue' + _getLightClass(hexRe.exec('0000ff'));
		if ((match=hexRe.exec(h))) { 
			lightClass = _getLightClass(match);
		    if (match[1] === match[2] && match[2] === match[3])
				return 'gray' + lightClass;
		}
		return (classes[h]||_classes[h]||name||('hex-' + h)) + (lightClass||'');
	}
	
	CCU.colorClass = colorClass;
	/**
	 * Compares the given color to CSS hex value representation.</p>
	 * @name SereniX.CssColorUtils.toHexValue
	 * @function
	 * @param {String|Object|Array} c Color to convert
	 */
	CCU.toHexValue = toHexValue;
	/**
	 * Compares the given color to CSS hex value representation.</p>
	 * @name SereniX.CssColorUtils.toHexValue
	 * @function
	 * @param {String|Object|Array} c Color to convert
	 */
	CCU.toHexVal = toHexValue;
	/**
	 * Compares the given color to hex representation.</p>
	 * @name SereniX.CssColorUtils.toHex
	 * @function
	 * @param {String|Object|Array} c Color to convert
	 */
	CCU.toHex = toHex;
	
	CCU.hex2Int = hex2Int;
	
	CCU.hexToInt = hex2Int;
	/**
	 * Compares the two given colors and returns true if the two colors are equals or false otherwise.
	 * <p>The colors are first of all, converted to hex representation and the two converted hex representations are compared.</p>
	 * @name SereniX.CssColorUtils.colorEquals
	 * @function
	 * @param {String|Object|Array} c1 First color to compare
	 * @param {String|Object|Array} c2 Second color to compare
	 */
	CCU.colorEquals = colorEquals;
	/**
	 * @param {Array} color rgb or rgba color
	 * @returns {String}
	 */
	function arrayToRgb(color, offset) {
		var rgb = 'rgb';
		var a;
		var n = color.length;
		
		offset = offset||0;
		a=color[offset + 3];
		if (n - offset >= 4 && (a != undefined)) {
			n = offset + 3;
			a = parseFloat(a, 10);
			if (a < 0 || a > 1 || isNaN(a))
				throw new Error('Alpha component out of bounds: ' + color[offset + 4]);
			a = ', ' + a;
			rgb += 'a(';
		} else {
			a = '';
			n = offset + 3;
			rgb += '(';
		}
		for (var i = offset; i < n; i++) {
			rgb += (i > offset ? ', ' : '') + color[i];
		}
		return rgb + a + ')';
	}
	
	function arrayToHsl(color, offset) {
		var hsl = 'hsl';
		var a;
		var n = color.length;
		var units = ['', '%', '%'];
		
		offset = offset||0;
		a=color[offset + 3];
		if (n - offset >= 4 && (a != undefined)) {
			n = offset + 3;
			a = parseFloat(a, 10);
			if (a < 0 || a > 1 || isNaN(a))
				throw new Error('Alpha component out of bounds: ' + color[offset + 4]);
			a = ', ' + a;
			hsl += 'a(';
		} else {
			a = '';
			n = offset + 3;
			hsl += '(';
		}
		for (var i = offset; i < n; i++) {
			hsl += (i > offset ? ', ' : '') + color[i] + units[i];
		}
		return hsl + a + ')';
	}
	/**
	 * 
	 * @param {String|Array} c Hex color starting with hexadecimal digit 
	 * @returns {String}
	 */
	function toHexColor(c) {
		if (c.length === 3) {
			return '#' + c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
		}
		if (c.length === 4) {
			return '#' + c[0] + c[0] + c[1] + c[1] + c[2] + c[2] + c[4] + c[4];
		}
		if (c.length === 6 || c.length === 8) {
			return '#' + c;
		}
	}
	/**
	 * 
	 * @param {String} hex Hex color starting with '#'
	 * @returns {String}
	 */
	function normalizeHexColor(hex) {
		if (hex.length === 4) {
			return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
		}
		if (hex.length === 5) {
			return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3] + hex[4] + hex[4];
		}
		if (hex.length === 7 || hex.length === 9) {
			return hex;
		}
	}
	
	var rgbRe = /^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d+(?:\.\d+)?))?/;
	
	function getCssColor(c) {
		var match, h, x, y, k, v, _c, t, a;
		if (typeof c === 'string' || c instanceof String) {
			return (match = rgbRe.exec(c)) ? arrayToRgb(match, 1) : 
				/^[0-9a-fA-F]+$/.test(c) ? toHexColor(c) : 
				/^#[0-9a-fA-F]+$/.test(c) ? normalizeHexColor(c) : c;
		}
		if (isArray(c))
			return arrayToRgb(c);
		if (isPlainObj(c)) {
			if ((t = typeof (x = c.r == undefined ? c.red : c.r)) === 'number' || t === 'string') {
				return  arrayToRgb([
					x, 
					c.g == undefined ? c.green : c.g,
					c.b == undefined ? c.blue : c.b,
					c.a == undefined ? c.alpha : c.a
				]);
			} else if (typeof (h = c.h) === 'number') {
				if (typeof (x = c.s) === 'number') {
					if (typeof (x = c.l) === 'number') {
						return arrayToHsl([h, x, c.l, c.a == undefined ? c.alpha : c.a]);
					} else if (typeof (x = c.b == undefined ? c.v : c.b) === 'number') { //hsv or hsb
						return getHsvCssString(h, c.s, x, c.a == undefined ? c.alpha : c.a);
					} else if (typeof (x = c.v) === 'number') {
						
					} else {
						throw new Error('Incorrect color: ' + c);
					}					
				} else if (typeof (x = c.w) === 'number') {
					return 'hwb(' + h + ' ' + (x + '%') + ' ' + (c.b+ '%')
						+ ((t = typeof (x =  c.a == undefined ? c.alpha : c.a)) === 'number' ? 
							' /' + x :
							t === 'string' ? ' /' + x : '')
						+ ')';
				} else if ((typeof (_c = c.c) === 'number') && (typeof (x = c.l) === 'number')) { //lch case
					return getLchCssString(x, _c, h, c.a == undefined ? c.alpha : c.a)
				}
			} else if (typeof (h = c.h) === 'string') {
				if (typeof (x = c.s) === 'string') {
					if (typeof (x = c.l) === 'string') {
						arrayToHsl([h, x, c.l, c.a == undefined ? c.alpha : c.a]);
					} else if (typeof (x = c.b) === 'string') {
						
					} else if (typeof (x = c.v) === 'string') {
						
					} else if ((typeof (_c = c.c) === 'string') && (typeof (x = c.l) === 'string')) { //lch case
						if (supportsLch) {
							
						} else {
							
						}
					} else {
						throw new Error('Incorrect color: ' + c);
					}					
				} else if (typeof (x = c.w) === 'string') {
					return 'hwb(' + h + ' ' + (x + '%') + ' ' + (c.b+ '%')
						+ ((t = typeof (x =  c.a == undefined ? c.alpha : c.a)) === 'number' ? 
							' /' + x :
							t === 'string' ? ' /' + x : '')
						+ ')';
				}				
			} else if (typeof (x = c.c) === 'number') {
				if (typeof (k = c.k) === 'number') { //cmyk
					
				} else if (typeof (y = c.y) === 'number') { //cmy
					
				}
			} else if ((typeof (x = c.l) === 'number' || ((typeof x === 'string' ) && /^\d+(?:\.\d+)?%?$/.test(x))) && typeof (y = c.b) === 'number') {
				return getLabCssString(x, c.a, y, c.alpha);
			}  else if ((x = c.hexValue||c.hexVal||c.hex)) {
				return /^[0-9a-fA-F]+$/.test(x) ? toHexColor(x) : 
						/^#[0-9a-fA-F]+$/.test(x) ? normalizeHexColor(x) : 
						(function() {
							throw new Error('Incorrect hex color: ' + x);
						})();
			} else if (typeof (x = c.color||c.value) === 'string') {
				return /^[0-9a-fA-F]+$/.test(x) ? toHexColor(x) : 
						/^#[0-9a-fA-F]+$/.test(x) ? normalizeHexColor(x) : 
						/^(rgb|hsl|hsv|hsb|hwb)a?\(/.test(x) ? x :
						/^cmyk\(/.test(x) ? x: 
						(function() {
							throw new Error('Incorrect hex color: ' + x);
						})();
			}
		}
	}
	
	function getHsvCssString(h, s, v, a) {
		if (a != undefined) {
			return arrayToRgb(hsbaToRgba(h, s, v, a));
		} else {
			return arrayToRgb(hsbToRgb(h, s, v));
		}
	}
	
	function getHsbCssString(h, s, b, a) {
		if (a != undefined) {
			return arrayToRgb(hsbaToRgba(h, s, v, a));
		} else {
			return arrayToRgb(hsbToRgb(h, s, v));
		}
	}
	
	function getLabCssString(l, a, b, alpha) {
		if (isArray(l)) {
			alpha = l[3];
			b = l[2];
			a = l[1];
			l = l[0];
		} else if (isPlainObj(l)) {
			alpha = l.alpha;
			b = l.b;
			a = l.a;
			l = l.l == undefined ? l.lightness : l.l;
		}
		if (supportsLab) {
			if (alpha != undefined) {
				return 'lab(' + l + ' ' + a + ' ' + b + ' / ' + alpha + ')';
			} else {
				return 'lab(' + l + ' ' + a + ' ' + b + ')';
			}
		} else {
			var rgb = labToRgb(l, a, b);
			if (alpha != undefined) {
				return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alpha + ')';
			} else {
				return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
			}
		}
	}
	
	function getLchCssString(l, c, h, alpha) {
		if (isArray(l)) {
			alpha = l[3];
			h = l[2];
			c = l[1];
			l = l[0];
		} else if (isPlainObj(l)) {
			alpha = l.alpha == undefined ? l.a : l.alpha;
			h = l.h;
			c = l.c;
			l = l.l == undefined ? l.lightness : l.l;
		}
		if (supportsLch) {
			if (alpha != undefined) {
				return 'lch(' + l + ' ' + c + ' ' + h + ' / ' + alpha + ')';
			} else {
				return 'lch(' + l + ' ' + c + ' ' + h + ')';
			}
		} else {
			var rgb = lchToRgb(l, c, h);
			if (alpha != undefined) {
				return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + alpha + ')';
			} else {
				return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
			}
		}
	}
	
	CCU.getLabCssString = getLabCssString;
	
	CCU.getLchCssString = getLchCssString;
	
	CCU.getHsvCssString = getHsvCssString;
	
	CCU.getHsbCssString = getHsbCssString;
	
	CCU.hslaToRgba = hslaToRgba;
	
	CCU.hsla2Rgba = hsla2Rgba;
	/**
	 * Returns true if the given color is light. Otherwise, returns false.
	 * @memberOf SereniX.CssColorUtils
	 * @static
	 * @param {Object|Array|String} color
	 * @returns {String}
	 */
	CCU.isLightColor = isLightColor;
	/**
	 * Returns true if the given color is dark. Otherwise, returns false.
	 * @memberOf SereniX.CssColorUtils
	 * @static
	 * @param {Object|Array|String} color
	 * @returns {String}
	 */
	CCU.isDarkColor = function(color) {
		return !isLightColor(color);
	}
	/**
	 * Converts the given color to a valid CSS color string representation
	 * @memberOf SereniX.CssColorUtils
	 * @static
	 * @param {Object|Array|String} color
	 * @returns {String}
	 */
	CCU.getCssColor = getCssColor;
	/**
	 * Converts the given array color to rgb or rgba string representation
	 * @memberOf SereniX.CssColorUtils
	 * @static
	 * @param {Object|Array|String} color
	 * @returns {String}
	 */
	CCU.arrayToRgb = arrayToRgb;
	/**
	 * Converts the given array color to hsl or hsla string representation
	 * @memberOf SereniX.CssColorUtils
	 * @static
	 * @param {Object|Array|String} color
	 * @returns {String}
	 */
	CCU.arrayToHsl = arrayToHsl;
	CCU.toHexColor = toHexColor;
	CCU.normalizeHexColor = normalizeHexColor;
	CCU.getColorName = getColorName;
	/**
	 * Returns the hex value that corresponds to given color name. <b>The result not starts with '#'</b>.
	 * @param {String} colorName
	 * @param {Object} [ncs] Color naming system or name colors map
	 * @param {Boolean} [nameAskey] name colors map keys represents color names?
	 * @returns {String}
	 */
	CCU.nameToHex = nameToHex;
	/**
	 * Returns the hex value that corresponds to given color name. <b>The result starts with '#'</b>.
	 * @param {String} colorName
	 * @param {Object} [ncs] Color naming system or name colors map
	 * @param {Boolean} [nameAskey] name colors map keys represents color names?
	 * @returns {String}
	 */
	CCU.nameToHexValue = nameToHexValue;
	
	CCU.nameToHexColor = nameToHexValue;
	
	CCU.hueAngleRatio = hueAngleRatio;
	
	CCU.rgbToHex = rgbToHex;
	
	CCU.rgbToHexVal = rgbToHexValue;
	
	CCU.rgbToHexValue = rgbToHexValue;
	
	CCU.toRgb = toRgb;
	
	CCU.toRgba = toRgba;
	
	CCU.toRgbString = toRgbString;
	
	CCU.toRgbaString = toRgbaString;
	
	CCU.toCmykString = toCmykString;
	/**
	 * 
	 * @property {Array} WEB_COLOR_NAMES_LIST List of color names: names are in lower case format
	 */
	CCU.WEB_COLOR_NAMES_LIST = nativeNamesList;
	/**
	 * Keys represents color names and  values represents color hex values in lower case.
	 * @property {Object} WEB_COLORS_MAP
	 */
	CCU.WEB_COLOR_NAMES = nativeNames;
	/**
	 * Keys represents color hex values (with '#' or not) and  values represents color names.
	 * <p>Keys are in lower case strings and in upper case strings.</p>
	 * @property {Object} WEB_COLORS_MAP
	 */
	CCU.WEB_COLORS_MAP = nativeColorNames;
	
	/**
	 * Keys represents color hex values and  values represents color names.
	 * @property {Object} WEB_COLORS_MAP
	 */
	CCU.WEB_HEX_VALUE_NAMES = nativeColorNames;
	
	/**
	 * Keys represents color names and  values represents color hex values.
	 * @property {Object} WEB_COLORS_MAP
	 */
	CCU.WEB_NAMED_COLORS = nativeNames;
	
	function isColor(x, namedColors) {
		namedColors = namedColors||nativeNames;
		try {
			if (x === 'transparent' || toHex(x, namedColors))
				return true;
		} catch (err) {}
		return false;
	}
	
	
	
	CCU.isColor = isColor;
	
	function isTrue(v) {
		return !v ? false : !/^(false|n(?:ok?)?|off|(?:\+|-)?0|ko)$/i.test('' + v);
	}
	/**
	 * 
	 * @param {String|Object|Array} col
	 * @param {Number} pct  value in range from -100 to 100 representing a percent
	 * @param {Boolean} pound
	 * @returns {String}
	 */
	function lightenDarkenCol(col, pct, pound) {
		return lightenDarkenHex(pound == undefined || pound === '' || isTrue(pound) ? toHexValue(col) : toHex(col), pct);
	}
	/**
	 * 
	 * @param {String} hexCol RGB Color in hex format (with pound symbol or not) to lighten or darken
	 * @param {Number} pct value in range from -100 to 100 representing a percent
	 * @returns {String}
	 */
	function lightenDarkenHex(hexCol, pct) {  
		var usePound = false;
	  
		if (hexCol[0] == "#") {
			hexCol = hexCol.slice(1);
			usePound = true;
		}
		if (hexCol.length === 3) {
			hexCol = hexCol[0]+hexCol[0] + hexCol[1] + hexCol[1] + hexCol[2] + hexCol[2]
		}
		
		var amt = Math.round(2.55*pct)
	 
		var num = parseInt(hexCol,16);
	 
		var r = (num >> 16) + amt;
	 
		if (r > 255) r = 255;
		else if  (r < 0) r = 0;
	 
		var b = ((num >> 8) & 0x00FF) + amt;
	 
		if (b > 255) b = 255;
		else if  (b < 0) b = 0;
	 
		var g = (num & 0x0000FF) + amt;
	 
		if (g > 255) g = 255;
		else if (g < 0) g = 0;
	 
		return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
	  
	}
	
	function lightenHex(color, pct) {
		return lightenDarkenHex(color, -pct);
	}
	
	function darkenHex(color, pct) {
		return lightenDarkenHex(color, pct);
	}
	
	function lighten(color, pct, pound) {
		return lightenDarkenCol(color, pct, pound);
	}
	
	function darken(color, pct, pound) {
		return lightenDarkenCol(color, -pct);
	}
	
	CCU.darken = darken;
	
	CCU.lighten = lighten;
	
	CCU.lightenDarkenCol = lightenDarkenCol;
	
	CCU.lightenDarkenHex = lightenDarkenHex;
	
	
	function hexToColor(hex) {
		var m;
		if ((m = /^(#)?([0-9a-fA-F]+)$/.exec(hex))) {
			m = m[2];
			switch (m.length) {
				case 6:
					return { r: parseInt(m.substring(0,2), 16), g: parseInt(m.substring(2,4), 16), b: parseInt(m.substring(4,6), 16) }
				case 3:
					return {r: parseInt(m[0] + m[0], 16), g: parseInt(m[1] + m[1], 16), b: parseInt(m[2] + m[2], 16)}
				case 8:
					return { r: parseInt(m.substring(0,2), 16), g: parseInt(m.substring(2,4), 16), b: parseInt(m.substring(4,6), 16), a: parseInt(m.substring(6, 8), 16)/255}
				case 4:
					return {r: parseInt(m[0] + m[0], 16), g: parseInt(m[1] + m[1], 16), b: parseInt(m[2] + m[2], 16), a: parseInt(m[3] + m[3], 16)/255}
				case 1:
					return {r: parseInt(m[0] + m[0], 16), g: parseInt(m[0] + m[0], 16), b: parseInt(m[0] + m[0], 16)}
				case 2:
					return {r: parseInt(m[0] + m[0], 16), g: parseInt(m[0] + m[1], 16), b: parseInt(m[1] + m[1], 16)}
				default:
					throw new Error('Incorrect hex color: ' + color)
			}
		}
	}
	CCU.hexToColor = hexToColor;
	
	
	var toHsba = toHsva;
	
	function toHwb() {
		return rgbToHwb(toRgb.apply(this, arguments));
	}
	
	function toHwba() {
		return rgbaToHwba(toRgba.apply(this, arguments));
	}
	
	/**
	 * 
	 * 
	 * @return {Object}
	 */
	function toHsla() {
		var x, h, s, l, a, c, m, y, k;
		var $ = slice.call(arguments);
		if (isArray($[0])) {
			$ = $[0];
		} else if ((typeof $[0]) === 'string') {
			$ = toColor($[0], /*map*/$[1], /*nameAskey*/ $[2]);
			if ((typeof $.h) === 'number' && (typeof $.l) === 'number') {
				if ($.a == undefined)
					$a = 1;
				return $;
			}
			$ = [$];
		}
		if ($.length === 3) {
			return { h: $[0], s: $[1], l: $[2], a: 1};
		} else if ($.length > 3) {
			return { h: $[0], s: $[1], l: $[2], a: $[3] == undefined ? 1 : $[3]};
		} else if (typeof (h = $.h == undefined ? $.hue : $.h) === 'number'){
			s = $.s == undefined ? $.saturation : $.s;
			l = $.l == undefined ? $.lightness : $.l;
			a= ($.a == undefined ? $.alpha : $.a)||1;
			return { h: h, s: s, l: l, a: a }
		} else if (typeof (h = $.h == undefined ? $.hue : $.h) === 'string'){
			s = $.s == undefined ? $.saturation : $.s;
			l = $.l == undefined ? $.lightness : $.l;
			a= ($.a == undefined ? $.alpha : $.a)||1;
		} else if (typeof (x = $.r == undefined ? $.red : $.r) === 'number'){
			x = rgbToHsl({ r: x, g: $.g == undefined ? r.green : r.g, l: r.b == undefined ? r.blue : r.b });
			x.a = ($.a == undefined ? $.alpha : $.a)||1;
			return x;
		} else if (typeof (c = $.c == undefined ? $.cyan : $.c) === 'number') {
			if (typeof (k = $.k == undefined ? $.key : $.k) === 'number') {
				x = rgbToHsl(cmykToRgb($))
			} else {
				x = rgbToHsl(cmyToRgb($))
			}
			x.a = 1;
			return x;
		}
		
	}
	
	function getDegreeRatio(unit) {
		return !unit || unit === 'deg' ? 1 :
			unit === '%' ? 3.60 : 
			unit === 'turn' ? 360 : 
			unit === 'rad' ? 180/Math.PI :
			unit === 'grad' ? 360/400 :
			(function() {
				throw new Error('Incorrect unit: ' + unit);
			})()
			
	}
	/**
	 * 
	 * @param {String} sc String color
	 * @param {Object} [map]
	 * @param {Boolean} [nameAskey]
	 * @returns {Object}
	 */
	function toColor(sc, map, nameAskey) {
		var c;
		var a;
		if ((c = hexToColor(sc))) {
			return c;
		} else if ((c = _hColorRe.exec(sc))) { 
			if ((a = getAlpha(c[8], c[10])) == undefined) {//if alpha component exists
				return _hMatchToHex(c);
			} else {
				switch(c[1]) {
					case 'hsl':
					case 'hsla':
						return hsla2Rgba(_toHObj(c, ['h', 's', 'l', 'a'], true))
					case 'hsv':
					case 'hsva':
						return _toHObj(c, ['h', 's', 'v', 'a'])
					case 'hsb':
					case 'hsba':
						return _toHObj(c, ['h', 's', 'b', 'a'])
					case 'hwb':
					case 'hwba':
						return _toHObj(c, ['h', 'w', 'b', 'a'])
					default:
						throw new Error('Incorrect color');
						//throw new Error((c[1] + (c[2]||'')).toUpperCase() 
						//	+ ' Color\'s string value not yet supported: ' + sc);
				}
			}
			
				
		} else if ((c = _cmykRe.exec(sc))) {
			throw new Error('CMYK Color\'s string value not yet supported: ' + sc);
		} else if ((c = _cmyRe.exec(sc))) {
			throw new Error('CMY Color\'s string value not yet supported: ' + sc);
		} else if (c = _getExtColor(sc)) {
			return c;
		} else {
			return hexToColor(nameToHex(sc, map, nameAskey));
		}
	}
	
	function _objRgb(rgb, ) {
		var o;
		if (rgb.r != undefined)
			return rgb;
		o = {r: Math.round(rgb[0]*255), g: Math.round(rgb[1]*255), b: Math.round(rgb[2]*255)}
		if (isAlpha(rgb[3]))
			o.a = rgb[3];
		return o;
	}
	
	function _objRgb255(rgb, ) {
		var o;
		if (rgb.r != undefined)
			return rgb;
		o = {r: Math.round(rgb[0]), g: Math.round(rgb[1]), b: Math.round(rgb[2])}
		if (isAlpha(rgb[3]))
			o.a = rgb[3];
		return o;
	}
	
	function _getExtRgb(sc, preserveAlpha) {
		var c = _getExtColor(sc);
		var cs = c.colorSpace||c.colorspace||c.name;
		if (cs === 'lab') {
			return labToRgb(c);
		} else if (cs === 'lch') {
			return lchToRgb(c);
		} else if (cs === 'oklab') {
			return _objRgb255(oklabToRgb(c));
		} else if (cs === 'oklch') {
			return _objRgb255(CCU.oklchToRgb(c));
		}
		return css4ColorToRgb(c, preserveAlpha);
	}
	
	function _setColor(_color, _from, c) {
		var putComponent, _setAlpha;
		var components, fields, v;
		if (space = c[4]) {
			_color.colorspace = space;
		} else { //custom color space: (space = match[5])
			//TODO
		}
		if ((fields = fields||_fields(space))) {
			putComponent = function(v, j) {
				_color[fields[j]] = v;
			}
			_setAlpha = function(a, sval) {
				if (a < 0 || a > 1) {
					throw new Error('Alpha value out of bounds: ' + (sval||a))
				}
				_color.alpha = a;
			}
		} else {
			_color.component = components = [];
			putComponent = function(v, j) {
				components[j] = v;
			}
			_setAlpha = function(a, sval) {
				if (a < 0 || a > 1) {
					throw new Error('Alpha value out of bounds: ' + (sval||a))
				}
				components.push(a);
			}
		}
		if (_from) {
			_color.from = _from;
		}
		
		var j = 0;
		var step = 0;
		for (; j < 3; j++) {
			if ((v = c[6 + step])) { //number
				v = parseFloat(v, 10);
				if (c[7 + step]) { //percent
					v /= 100;
				}
			} else if ((v = c[8+ step])) { //decimal stating with '.'
				v = parseFloat('0' + v, 10);
			} else { //c[9 + step] ==> 'none'
				v = 0;
			}
			putComponent(v, j);
			step += 4;
		}
		
		if ((v = c[18])) { //number for alpha channel
			v = parseFloat(v, 10);
			if (c[19]) {  //percent
				v /= 100;
			}
			_setAlpha(v, c[17] + (c[18]||''));
		} else if ((v = c[20])) {// stating with '.' decimal number for alpha channel
			_setAlpha(parseFloat('0' + v, 10), v);
		}
	}
	
	function _getExtColor(sc) {
		var c, space;
		if (/^color\(display-p3/.test(sc))
			console.log(sc);
		if ((c = _labRe.exec(sc))) {
			var lab = {
				colorSpace: 'lab',
				colorspace: 'lab',
				name: 'lab',
				l: parseFloat(c[1]||0), //for L: 0% = 0.0, 100% = 100.0 see https://www.w3.org/TR/css-color-4/#specifying-lab-lch
				a: c[6] ? 0 : parseFloat(c[4])*(c[5] ? 1.25: 1), //for a and b: -100% = -125, 100% = 125 : see https://www.w3.org/TR/css-color-4/#specifying-lab-lch
				b: c[9] ? 0 : parseFloat(c[7])*(c[8] ? 1.25: 1) //for a and b: -100% = -125, 100% = 125 : see https://www.w3.org/TR/css-color-4/#specifying-lab-lch
			};
			if (c[10] && c[10] !== 'none') {
				lab.alpha = parseFloat(c[10])/(c[11] ? 100 : 1);
			} else if (c[13]) {
				lab.alpha = parseFloat('0' + c[13], 10)
			}
			return lab;
		} else if ((c = _lchRe.exec(sc))) {
			var lch = {
				colorSpace: 'lch',
				colorspace: 'lch',
				name: 'lch',
				l: parseFloat(c[1]||0), //for L: 0% = 0.0, 100% = 100.0 see https://www.w3.org/TR/css-color-4/#specifying-lab-lch
				c: c[6] ? 0 : parseFloat(c[4])*(c[5] ? 1.5: 1), //for C: 0% = 0, 100% = 150 : see https://www.w3.org/TR/css-color-4/#specifying-lab-lch
				h: c[9] ? 0 : parseFloat(c[7])*getDegreeRatio(c[8]) //see https://www.w3.org/TR/css-color-4/#typedef-hue
			}
			if (c[10] && c[10] !== 'none') {
				lch.alpha = parseFloat(c[10])/(c[11] ? 100 : 1);
			} else if (c[13]) {
				lch.alpha = parseFloat('0' + c[13], 10)
			}
			return lch;
		} else if ((c = _oklabRe.exec(sc))) {
			var lab = {
				colorSpace: 'oklab',
				colorspace: 'oklab',
				name: 'oklab',
				l: c[3] ? 0 : parseFloat(c[1])/(c[2] ? 100: 1), //see https://www.w3.org/TR/css-color-4/#specifying-oklab-oklch
				a: c[6] ? 0 : parseFloat(c[4])*(c[5] ? 0.004: 1), //for a and b: -100% = -0.4, 100% = 0.4 : see https://www.w3.org/TR/css-color-4/#specifying-oklab-oklch
				b: c[9] ? 0 : parseFloat(c[7])*(c[8] ? 0.004: 1) //for a and b: -100% = -0.4, 100% = 0.4 : see https://www.w3.org/TR/css-color-4/#specifying-oklab-oklch
			};
			if (c[10] && c[10] !== 'none') {
				lab.alpha = parseFloat(c[10])/(c[11] ? 100 : 1);
			} else if (c[13]) {
				lab.alpha = parseFloat('0' + c[13], 10)
			}
			return lab;
		} else if ((c = _oklchRe.exec(sc))) {
			var lch = {
				colorSpace: 'oklch',
				colorspace: 'oklch',
				name: 'oklch',
				l: c[3] ? 0 : parseFloat(c[1], 10)/(c[2] ? 100 : 1), //for L: 0% = 0.0, 100% = 1.0 see https://www.w3.org/TR/css-color-4/#specifying-oklab-oklch
				c: c[6] ? 0 : parseFloat(c[4], 10)*(c[5] ? 0.004: 1), //for C: 0% = 0.0 100% = 0.4 : see https://www.w3.org/TR/css-color-4/#specifying-oklab-oklch
				h: c[9] ? 0 : parseFloat(c[7], 10)*getDegreeRatio(c[8]) //see https://www.w3.org/TR/css-color-4/#typedef-hue
			}
			if (c[10] && c[10] !== 'none') {
				lch.alpha = parseFloat(c[10], 10)/(c[11] ? 100 : 1);
			} else if (c[13]) {
				lch.alpha = parseFloat('0' + c[13], 10)
			}
			return lch;
		} else if ((c = _css5ColorRe.exec(sc))) {
			var _color = {};
			var _from;
			if (c[1]) { //from hex
				_from = { hex: c[1]}
			} else if (c[2]) { //name
				if (c[3]) { //color function's arguments 
					_from = { color: toColor(name + '(' + c[3] + ')')};
				} else { //color name
					_from = { name: c[2] }
				}
			}
			_setColor(_color, _from,  c);
			return _color;
		} else if ((c = _yuvRe.exec(sc))) {
			throw new Error('YUV Color\'s string value not yet supported: ' + sc);
		} else if ((c = _xyzRe.exec(sc))) {
			throw new Error('XYZ Color\'s string value not yet supported: ' + sc);
		} else if ((c = _yiqRe.exec(sc))) {
			throw new Error('YIQ Color\'s string value not yet supported: ' + sc);
		} else {
			throw new Error('Color\'s string not yet supported: ' + sc);
		}
	}
	CCU.toColor = toColor;
	
	CCU.strToColor = toColor;
	
	CCU.toHsla = toHsla;
	/**
	 * 
	 * @param {String|Object|Array} color
	 * @returns {Array}
	 */
	function toRgba(color) {
		var h, s, b;
		var a;
		var x;
		var c;
		if (typeof color === 'string') {
			if ((c = /^(#)?([0-9a-fA-F]+)$/.exec(color))) {
				c = c[2];
				switch (c.length) {
					case 6:
						return [parseInt(c.substring(0,2), 16), parseInt(c.substring(2,4), 16), parseInt(c.substring(4,6), 16), 1]
					case 3:
						return [parseInt(c[0] + c[0], 16), parseInt(c[1] + c[1], 16), parseInt(c[2] + c[2], 16), 1]
					case 8:
						return [parseInt(c.substring(0,2), 16), parseInt(c.substring(2,4), 16), parseInt(c.substring(4,6), 16), parseInt(c.substring(6, 8), 16)/255]
					case 4:
						return [parseInt(c[0] + c[0], 16), parseInt(c[1] + c[1], 16), parseInt(c[2] + c[2], 16), parseInt(c[3] + c[3], 16)/255]
					default:
						throw new Error('Incorrect hex color: ' + color)
				}
			}
			color = toColor(color);
		}
		if (isArray(color)) {
			return color.length < 4 ? [color[0], color[1], color[2], 1] : color;
		}
		if (isPlainObj(color)) {
			a = cVal(color, ['a', 'alpha']);
			if ((x = cVal(color, ['r', 'red'])) != undefined) {
				return [ x, cVal(color, ['g', 'green']), cVal(color, ['b', 'blue']), a == undefined ? 1 : a]
			} else if ((x = cVal(color, ['c', 'cyan'])) != undefined || (x = cVal(color, ['key', 'k'])) != undefined) {
				c = cmykToRgb(color);
				return [ c.r, c.g, c.b, a == undefined ? 1 : a]
			} else if ((x = cVal(color, ['c', 'cyan'])) != undefined ) {
				c = cmyToRgb(color);
				return [ c.r, c.g, c.b, a == undefined ? 1 : a]
			} else if ((h = cVal(color, ['h', 'hue'])) != undefined) {
				if ((x = cVal(color, ['w', 'whiteness'])) != undefined) {
					if (a == undefined) {
						c = hwbToRgb(color)
						c.alpha = 1;
					} else {
						c = hwbaToRgba(color)
					}
				} else if ((x = cVal(color, ['l', 'lightness', 'luminence', 'luminance'])) != undefined) {
					if (a == undefined) {
						c = hslToRgb(color)
						c.alpha = 1;
					} else {
						c = hslaToRgba(color)
					}
				} else if ((x = cVal(color, ['v', 'value', 'b', 'brightness'])) != undefined) {
					if (a == undefined) {
						c = hsvToRgb(color)
						c.alpha = 1;
					} else {
						c = hsvaToRgba(color)
					}
				} else {
					throw new Error('Color not supported')
				}
				return c;
			}
		}
		throw new Error('Color not supported')
	}
	
	CCU.toRgba = toRgba;
	
	function cVal(o, names) {
		var i = 0;
		var n = names.length;
		var v;
		for (; i < n; i++) {
			v = o[names[i]];
			if (v != undefined)
				return v;
		}
	}
	
	//Inspired from http://matthaynes.net/blog/2008/08/07/javascript-colour-functions/
    function rgbaToHsva(rgba) {
		var r, g, b, a;
		var s, h;
		if (isArray(rgba)) {
			r = rgba[0];
			g = rgba[1];
			b = rgba[2];
			a = rgba[3];
		} else if (isPlainObj(rgba)) {
			r = cVal(rgba, ['r', 'red']);
			g = cVal(rgba, ['g', 'green']);
			b = cVal(rgba, ['b', 'blue']);
			a = cVal(rgba, ['a', 'alpha']);
		} else {
			throw new Error('Incorrect arguments');
		}

        var min = Math.min(Math.min(r, g), b),
			max = Math.max(Math.max(r, g), b),
			delta = max - min;

        var v = max;

        // Hue
        if (max == min) {
            h = 0;
        } else if (max == r) {
            h = (60 * ((g - b) / (max - min))) % 360;
        } else if (max == g) {
            h = 60 * ((b - r) / (max - min)) + 120;
        } else if (max == b) {
            h = 60 * ((r - g) / (max - min)) + 240;
        }

        if (h < 0) {
            h += 360;
        }

        // Saturation
        if (max == 0) {
            s = 0;
        } else {
            s = 1 - (min / max);
        }
        return {
            h: Math.round(h), 
            s: Math.round(s * 100), 
            v: Math.round(v * 100),
            a: a
        };
    }
    CCU.rgbaToHsva = rgbaToHsva;
	
	function normalizeDeg(v) {
        v = v % 360;
        return (v < 0) ? 360 + v : v;
    }
	
	/**
	 * 
	 * Assumes that h in the range 0 to 360, s and v in the range 0 to 100
	 * @param {Number} h 
	 * @param {Number} w 
	 * @param {Number} b 
	 * @param {Boolean|String} [arrayOrResultType] 
	 * @returns {Object|Array|String}
	 */
	function hsvToRgb(h, s, v, arrayOrResultType) {
		if (isArray(h)){
			arrayOrResultType = s;
			v = h[2];
			s = h[1];
			h = h[0];
		} else if (isPlainObj(h)) {
			arrayOrResultType = s;
			v = h.v||h.value||h.b||h.brightness||0;
			s = h.s||h.saturation||0;
			h = h.h||h.hue||0;
		}

		h = normalizeDeg(h)/360;
		s /= 100;
		v /= 100;
		var r, g, b, a,
			i = Math.floor(h * 6),
			f = h * 6 - i,
			p = v * (1 - s),
			q = v * (1 - f * s),
			t = v * (1 - (1 - f) * s);

		switch (i % 6) {
			case 0: r = v, g = t, b = p; break;
			case 1: r = q, g = v, b = p; break;
			case 2: r = p, g = v, b = t; break;
			case 3: r = p, g = q, b = v; break;
			case 4: r = t, g = p, b = v; break;
			case 5: r = v, g = p, b = q; break;
		}

		r = Math.round(r*255);
		g = Math.round(g*255);
		b = Math.round(b*255);

		return arrayOrResultType === true || arrayOrResultType === 'array' ? [r, g, b] :
				arrayOrResultType === false || arrayOrResultType === undefined || arrayOrResultType === 'object' ? {r: r, g: g, b: b} :
				arrayOrResultType === 'string' ? 'rgb(' + [r, g, b].join(',') + ')' : [r, g, b];
	}
	function hsvaToRgba2(h, s, v, a, arrayOrResultType) {
		var rgb = [];
		var hi, f, p, q, t;
		
		if (isArray(h)) {
			s = s[1];
			v = v[2];
			a = a[3];
			h = h[0];
		} else if (isPlainObj(h)) {
			s = cVal(h, ['s', 'saturation']);
			v = cVal(h, ['v', 'value']);
			a = cVal(h, ['a', 'alpha']);
			h = cVal(h, ['h', 'hue']);
		}
        h = normalizeDeg(h);

        s = s / 100;
        v = v / 100;

        hi = Math.floor((h / 60) % 6);
        f = (h / 60) - hi;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);

        

        switch (hi) {
            case 0: rgb = [v, t, p]; break;
            case 1: rgb = [q, v, p]; break;
            case 2: rgb = [p, v, t]; break;
            case 3: rgb = [p, q, v]; break;
            case 4: rgb = [t, p, v]; break;
            case 5: rgb = [v, p, q]; break;
        }
		
		if (arrayOrResultType === true || arrayOrResultType === 'array') {
			rgb[3] = a;
			return rgb;
		}
		
        return 
			arrayOrResultType === 'string' ? 'rgba(' + rgb.join(',') + ',' + a +  ')' : {
            r: Math.round(rgb[0]*255),
            g: Math.round(rgb[1]*255),
            b: Math.round(rgb[2]*255),
            a: a 
        };
    }


	/**
	 * 
	 * Assumes that h in the range 0 to 360, s and v in the range 0 to 100
	 * @param {Number} h 
	 * @param {Number} w 
	 * @param {Number} b
	 * @param {Number} a 
	 * @param {Boolean|String} [arrayOrResultType]
	 * @returns {Objec|Array|String}
	 */
	function hsvaToRgba(h, s, v, a, arrayOrResultType) {
		var args = Array.prototype.slice.call(arguments);
		if (typeof s ==='boolean' || typeof s === 'string') {
			args.splice(2);
		}
		if (isPlainObj(h)) {
			a = h.a||h.alpha||0;
		} else if (isArray(h)) {
			a = h[3]||0;
		}
		if (a == undefined)
			a = 1;
		var r = hsvToRgb.apply(this, args);
		if (isArray(r)) {
			r[3] = a;
		} else if (isPlainObj(r)) {
			r.a = a;
		} else {
			r = r.substring(0, r.length - 1) + ',' + a + ')';
		}
		return r;
	}
	
	function toHsva(color) {
		var h, s, v, a;
		if (isArray(color)) {
			if (typeof (h = color.h == undefined ? color.hue: color.h) === 'number') {
				if (typeof (v = color.v == undefined ? color.value == undefined ? color.b == undefined ? color.brightness: color.b : color.value : color.v) === 'number') {
					return {
						h: h,
						s: color.s == undefined ? color.saturation : color.s,
						v: v,
						a: (color.a == undefined ? color.alpha == undefined ? 1 : color.alpha : color.a)
					}
				}
				
			} else if (typeof h === 'string') {
				throw new Error('Not yet supported');
			}
		}
		return rgbaToHsva(toRgba.apply(this, arguments));
	}
	
	function toHsba(color) {
		var h, s, v, a;
		if (isArray(color)) {
			if (typeof (h = color.h == undefined ? color.hue: color.h) === 'number') {
				if (typeof (v = color.v == undefined ? color.value == undefined ? color.b == undefined ? color.brightness: color.b : color.value : color.v) === 'number') {
					return {
						h: h,
						s: color.s == undefined ? color.saturation : color.s,
						b: v,
						a: (color.a == undefined ? color.alpha == undefined ? 1 : color.alpha : color.a)
					}
				}
				
			} else if (typeof h === 'string') {
				throw new Error('Not yet supported');
			}
		}
		return rgbaToHsba(toRgba.apply(this, arguments));
	}
	
	CCU.toHsva = toHsva;
	
	CCU.cVal = cVal;
	
	CCU.rgbToSRgb = rgbToSRgb;
	
	CCU.rgbToSRGB = rgbToSRGB;
	
	CCU.rgbToSrgb = rgbToSrgb;
	
	CCU.srgbToRgb = srgbToRgb;
	
	CCU.srgbToRgbSys = srgbToRgbSys;
	
	/**
	 * Creates a new color of color with the given alpha channel.
	 * <p>For example, rgba('#7fffd4', '30%'); returns rgba(127, 255, 212, 0.3)</p>
	 * @param {String|Object|Array} color
	 * @param {Number|String} a
	 * @param {Object} [cn] 
	 * @param {Object} [nameAskey] 
	 * @param {Boolean} [rgbaString=true]
	 * @returns {Object}
	 */
	function rgba(color, a, cns, nameAskey, rgbaString) {
		var m, rgb;
		if (typeof cns === 'boolean') {
			m = cns;
			cns = nameAskey;
			nameAskey = rgbaString;
			rgbaString = m;
		}
		rgb = toRgb(color, cns, nameAskey, string);
		rgb.a = opacity(a);
		if (typeof color === 'string') {
			if ((rgbaString != undefined && !rgbaString) && (m=/^(#)?([0-9a-fA-F]+)$/.exec(color))) {
				return (m[1] ?  '#' : '') + _toHex(rgb.r) + _toHex(rgb.g) + _toHex(rgb.b) + _toHex(Math.round(rgb.a*255));
			} else {
				return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')'
			}
		}
		return rgb;
	}
	
	CCU.rgba = rgba;
	
	/**
	 * Convert CMY color values to RGB.
	 * @param {number} c The cyan value. (0, 100)
	 * @param {number} m The magenta value. (0, 100)
	 * @param {number} y The yellow value. (0, 100)
	 * @return {number[]} An array containing the RGB values.
	 */
	function cmy2rgb(c, m, y, array) {
		if (isArray(c)) {
			y = c[2];
			m = c[1]
			c = c[0];
		} else if (isPlainObj(c)) {
			y = cVal(c, ['y', 'yellow']);
			m = cVal(c, ['m', 'magenta'])
			c = cVal(c, ['c', 'cyan']);
		}
		var r = round((1 - c / 100) * 255);
		var g = round((1 - m / 100) * 255);
		var b = round((1 - y / 100) * 255)
		return array ? [
			r,
			g,
			b,
		] : {
			r: r,
			g: g,
			b: b
		};
	};

	var cmyToRgb = cmy2rgb;

	/**
	 * Convert CMYK color values to CMY.
	 * @param {number} c The cyan value. (0, 100)
	 * @param {number} m The magenta value. (0, 100)
	 * @param {number} y The yellow value. (0, 100)
	 * @param {number} k The key value. (0, 100)
	 * @return {number[]} An array containing the CMY values.
	 */
	function cmyk2cmy(c, m, y, k, array) {
		if (isArray(c)) {
			k = c[3];
			y = c[2];
			m = c[1]
			c = c[0];
		} else if (isPlainObj(c)) {
			k = cVal(c, ['k', 'key']);
			y = cVal(c, ['y', 'yellow']);
			m = cVal(c, ['m', 'magenta'])
			c = cVal(c, ['c', 'cyan']);
		}
		k /= 100;
		
		c = round((c / 100 * (1 - k) + k) * 100)
		m = round((m / 100 * (1 - k) + k) * 100)
		y = round((y / 100 * (1 - k) + k) * 100)

		return array ? [
			c,
			m,
			y,
		] : {
			c: c,
			m: m,
			y: y
		};
	};

	var cmykToCmy = cmyk2cmy;
	
	function cmykToHsl(cmyk) {
		var rgb = cmykToRgb.call(this, arguments);
		return rgbToHsl(rgb);
	}
	
	function cmyToHsl(cmyk) {
		var rgb = cmyToRgb.call(this, arguments);
		return rgbToHsl(rgb);
	}
	
	function cmykToHsla(cmyk) {
		var rgb = cmykToRgb.call(this, arguments);
		var h = rgbToHsl(rgb);
		if (isArray(h)) {
			h[3] = 1;
		} else
			h.a = 1;
		return h;
	}
	
	function cmyToHsla(cmyk) {
		var rgb = cmyToRgb.call(this, arguments);
		var h = rgbToHsl(rgb);
		if (isArray(h)) {
			h[3] = 1;
		} else
			h.a = 1;
		return h;
	}
	
	var rgb = {};
	
	var lab = {
		name: 'lab',
		min: [0,-100,-100],
		max: [100,100,100],
		channel: ['lightness', 'a', 'b'],
		alias: ['LAB', 'cielab'],

		xyz: function(lab) {
			var l = lab[0],
					a = lab[1],
					b = lab[2],
					x, y, z, y2;

			if (l <= 8) {
				y = (l * 100) / 903.3;
				y2 = (7.787 * (y / 100)) + (16 / 116);
			} else {
				y = 100 * Math.pow((l + 16) / 116, 3);
				y2 = Math.pow(y / 100, 1/3);
			}

			x = x / 95.047 <= 0.008856 ? x = (95.047 * ((a / 500) + y2 - (16 / 116))) / 7.787 : 95.047 * Math.pow((a / 500) + y2, 3);

			z = z / 108.883 <= 0.008859 ? z = (108.883 * (y2 - (b / 200) - (16 / 116))) / 7.787 : 108.883 * Math.pow(y2 - (b / 200), 3);
			x = [x, y, z];
			if (lab.length > 3) {
				x[3] = lab[3];
			}
			return x;
		}
	};
	
	function xyzToLab() {
		var x,
			y,
			z,
			l, a, b;
		var arrayOrResultType;
		var $ = slice.call(arguments);
		var l,
			a,
			b,
			x, y, z, y2;
		if (isArray($[0])) {
			if (typeof $[1] === 'boolean' || typeof $[1] === 'string')
				arrayOrResultType = $[1];
			$ = $[0];
			x = $[0],
			y = $[1],
			z = $[2];
		} else if (isPlainObj($[0])) {
			if (typeof $[1] === 'boolean' || typeof $[1] === 'string')
				arrayOrResultType = $[1];
			x = $.x,
			y = $.y,
			z = $.z;
		} else if ($.length > 1) {
			x = $[0],
			y = $[1],
			z = $[2];
			arrayOrResultType = $[3];
		}
		x /= 95.047;
		y /= 100;
		z /= 108.883;

		x = x > 0.008856 ? Math.pow(x, 1/3) : (7.787 * x) + (16 / 116);
		y = y > 0.008856 ? Math.pow(y, 1/3) : (7.787 * y) + (16 / 116);
		z = z > 0.008856 ? Math.pow(z, 1/3) : (7.787 * z) + (16 / 116);

		l = (116 * y) - 16;
		a = 500 * (x - y);
		b = 200 * (y - z);

		if (arrayOrResultType === true || arrayOrResultType === 'array' || arrayOrResultType === 1)
			return [l, a, b];
		if (arrayOrResultType === 'string') {
			return 'lab(' + l + ' ' + a + ' ' + b + ')';
		}
		return { l: l, a: a, b: b }
	}
	
	function labToXyz() {
		var arrayOrResultType;
		var $ = slice.call(arguments);
		var l,
			a,
			b,
			alpha,
			x, y, z, y2;
		if (isArray($[0])) {
			if (typeof $[1] === 'boolean' || typeof $[1] === 'string')
				arrayOrResultType = $[1];
			$ = $[0];
			l = $[0],
			a = $[1],
			b = $[2];
			alpha = $[3];
		} else if (isPlainObj($[0])) {
			if (typeof $[1] === 'boolean' || typeof $[1] === 'string')
				arrayOrResultType = $[1];
			$ = $[0];
			l = $.l,
			a = $.a,
			b = $.b;
			alpha = $.alpha;
		} else if ($.length > 1) {
			l = $[0],
			a = $[1],
			b = $[2];
			if (typeof $[3] === 'number') {
				alpha = $[3];
				arrayOrResultType = $[4];
			} else {
				arrayOrResultType = $[3];
			}
		}

		if (l <= 8) {
			y = (l * 100) / 903.3;
			y2 = (7.787 * (y / 100)) + (16 / 116);
		} else {
			y = 100 * Math.pow((l + 16) / 116, 3);
			y2 = Math.pow(y / 100, 1/3);
		}

		x = x / 95.047 <= 0.008856 ? x = (95.047 * ((a / 500) + y2 - (16 / 116))) / 7.787 : 95.047 * Math.pow((a / 500) + y2, 3);

		z = z / 108.883 <= 0.008859 ? z = (108.883 * (y2 - (b / 200) - (16 / 116))) / 7.787 : 108.883 * Math.pow(y2 - (b / 200), 3);

		if (arrayOrResultType === true || arrayOrResultType === 'array' || arrayOrResultType === 1) {
			x = [x, y, z];
			if (alpha != undefined)
				x[3] = alpha;
			return x;
		}
		if (arrayOrResultType === 'string') {
			return 'xyz(' + x + ',' + y + ',' + z + (alpha != undefined ? '/' + alpha : '') + ')';
		}
		x = { x: x, y: y, z: z };
		if (alpha != undefined)
			x.alpha = alpha;
		return x
	}
	
	
	var xyz = {
		name: 'xyz',
		min: [0,0,0],
		channel: ['X','Y','Z'],
		alias: ['XYZ', 'ciexyz', 'cie1931'],
	};
	
	var yuv = {
		name: 'yuv',
		min: [0,-0.5,-0.5],
		max: [1, 0.5, 0.5],
		channel: ['Y','U','V'],
		alias: ['YUV', 'EBU'],
	};
	
	var yiq = {
		name: 'yiq',
		min: [0,-0.5957,-0.5226],
		max: [1, 0.5957, 0.5226],
		channel: ['Y','I','Q'],
		alias: ['YIQ']
	};
	
	xyz.components = xyz.channel;
	xyz.values = {
		X: {min: 0},
		Y: {min: 0},
		Z: {min: 0}
	}
	
	/**
     * Whitepoint reference values with observer/illuminant
     *
     * http://en.wikipedia.org/wiki/Standard_illuminant
    */
	xyz.whitepoint = {
		//1931 2°
		2: {
			//incadescent
			A:[109.85, 100, 35.585],
			// B:[],
			C: [98.074, 100, 118.232],
			D50: [96.422, 100, 82.521],
			D55: [95.682, 100, 92.149],
			//daylight
			D65: [95.045592705167, 100, 108.9057750759878],
			D75: [94.972, 100, 122.638],
			//flourescent
			// F1: [],
			F2: [99.187, 100, 67.395],
			// F3: [],
			// F4: [],
			// F5: [],
			// F6:[],
			F7: [95.044, 100, 108.755],
			// F8: [],
			// F9: [],
			// F10: [],
			F11: [100.966, 100, 64.370],
			// F12: [],
			E: [100,100,100]
		},

		//1964  10°
		10: {
			//incadescent
			A:[111.144, 100, 35.200],
			C: [97.285, 100, 116.145],
			D50: [96.720, 100, 81.427],
			D55: [95.799, 100, 90.926],
			//daylight
			D65: [94.811, 100, 107.304],
			D75: [94.416, 100, 120.641],
			//flourescent
			F2: [103.280, 100, 69.026],
			F7: [95.792, 100, 107.687],
			F11: [103.866, 100, 65.627],
			E: [100,100,100]
		}
	};


	/**
	 * Top values are the whitepoint’s top values, default are D65
	 */
	xyz.max = xyz.whitepoint[2].D65;


	/**
	 * Transform xyz to rgb
	 *
	 * @param {Array} xyz Array of xyz values
	 *
	 * @return {Array} RGB values
	 */
	xyz.srgb = function (_xyz, white) {
		//FIXME: make sure we have to divide like this. Probably we have to replace matrix as well then
		white = white || xyz.whitepoint[2].E;

		var x = _xyz[0] / white[0],
			y = _xyz[1] / white[1],
			z = _xyz[2] / white[2],
			r, g, b,
			a = _xyz[3];

		// assume sRGB
		// http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
		r = (x * 3.240969941904521) + (y * -1.537383177570093) + (z * -0.498610760293);
		g = (x * -0.96924363628087) + (y * 1.87596750150772) + (z * 0.041555057407175);
		b = (x * 0.055630079696993) + (y * -0.20397695888897) + (z * 1.056971514242878);

		r = r > 0.0031308 ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
			: r = (r * 12.92);

		g = g > 0.0031308 ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
			: g = (g * 12.92);

		b = b > 0.0031308 ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
			: b = (b * 12.92);

		r = [
			Math.min(Math.max(0, r), 1),
			Math.min(Math.max(0, g), 1),
			Math.min(Math.max(0, b), 1)
		];
		if (a != undefined)
			r[3] = a;
		return r;
	}
	
	xyz.rgb = function(xyz) {
		var rgb = this.srgb.apply(this, arguments);
		rgb[0] = Math.round(rgb[0] * 255);
		rgb[1] = Math.round(rgb[1] * 255);
		rgb[2] = Math.round(rgb[2] * 255);
		return rgb;
	}
	
	//cylindrical lab
	var lchab = {
		name: 'lchab',
		min: [0,0,0],
		max: [100,100,360],
		channel: ['lightness', 'chroma', 'hue'],
		alias: ['LCHab', 'cielch', 'LCH', 'HLC', 'LSH'],

		xyz: function($) {
			return lab.xyz(lchab.lab($));
		},

		lab: function(lch) {
			var l = lch[0],
					c = lch[1],
					h = lch[2],
					a, b, hr;

			hr = h / 360 * 2 * Math.PI;
			a = c * Math.cos(hr);
			b = c * Math.sin(hr);
			l = [l, a, b];
			if (lch.length > 3)
				l[3] = lch[3];
			return l;
		}
	};


	//extend lab
	lab.lchab = function(lab) {
		var l = lab[0],
				a = lab[1],
				b = lab[2],
				hr, h, c;

		hr = Math.atan2(b, a);
		h = hr * 360 / 2 / Math.PI;
		if (h < 0) {
			h += 360;
		}
		c = Math.sqrt(a * a + b * b);
		l = [l, c, h];
		if (lab.length > 3)
			l[3] = lab[3];
		return l;
	};
	
	lab.lch = lab.lchab;

	xyz.lchab = function(arg){
		return lab.lchab(xyz.lab(arg));
	};
	
	xyz.lch = xyz.lchab;
	
	function labToLch() {
		var arrayOrResultType;
		var $ = slice.call(arguments);
		if ($.length > 3) {
			arrayOrResultType = $[3];
		} else if ($.length === 3) {
			arrayOrResultType = false;
		} else if (isArray($[0])) {
			arrayOrResultType = $[1];
			$ = $[0];
		} else if (isPlainObj($[0])) {
			$ = $[0];	
			arrayOrResultType = $[1];
			$ = [$.l, $.a, $b];
		}
		var lch = lab.lchab(_lab);
		if (arrayOrResultType === false || arrayOrResultType === 'array')
			return lch;
		if (arrayOrResultType === 'string') {
			return 'lch(' + lch[0] + ' ' + lch[1] + ' ' + lch[2] + ')';
		}
		return { l : lch[0], c: lch[1], h: lch[2] }
	}
	
	var labToLchab = labToLch
	
	function lchToLab(lch) {
		var alpha;
		var arrayOrResultType;
		var $ = slice.call(arguments);
		if ($.length > 3) {
			if (typeof $[3] === 'number') {
				alpha = $[3];
				arrayOrResultType = $[4];
			} else {
				arrayOrResultType = $[3];
			}
		} else if ($.length === 3) {
			arrayOrResultType = false;
		} else if (isArray($[0])) {
			arrayOrResultType = $[1];
			$ = $[0];
			alpha = $[3];
		} else if (isPlainObj($[0])) {
			$ = $[0];	
			arrayOrResultType = $[1];
			$ = [$.l, $.a, $b];
			alpha = $.alpha;
		}
	  var l = $[0];
	  var c = $[1];
	  var h = $[2];
	  // treat l === 0 as pure black
	  if (l === 0) {
		return [0, 0, 0, alpha];
	  }
	  while (h < 0) h += 360;
	  while (h >= 360) h -= 360;
	  var h2 = degToRad(h);
	  var x = [
		l, // l
		Math.cos(h2) * c, // a
		Math.sin(h2) * c // b,
	  ];
	  if (arrayOrResultType === false || arrayOrResultType === 'array') {
		  if (isAlpha(alpha))
			  x[3] = alpha;
			return x;
	  }
		if (arrayOrResultType === 'string') {
			return 'lab(' + x.join(' ') +  (isAlpha(alpha) ? ' / ' + alpha : '') + ')';
		}
		x = { l : x[0], a: x[1], b: x[2] };
		if (isAlpha(alpha)) {
			x.alpha = alpha;
		}
		return x
	} //end lchToLab function
	
	CCU.lchToLab = lchToLab;
	
	function isAlpha(a) {
		return a != undefined  && a !== 'none' && a !== ''
	}
	
	function lchToXyz() {
		var a;
		var arrayOrResultType;
		var $ = slice.call(arguments);
		if ($.length > 3) {
			arrayOrResultType = $[3];
		} else if ($.length === 3) {
			arrayOrResultType = false;
		} else if (isArray($[0])) {
			arrayOrResultType = $[1];
			$ = $[0];
		} else if (isPlainObj($[0])) {
			arrayOrResultType = $[1];
			$ = $[0];	
			a = $.alpha != undefined ? $.alpha : $.a;
			$ = [$.l, $.c, $.h];
			if (a != undefined)
				$[3] = a;
		}
		var xyz = lchab.xyz($);
		if (arrayOrResultType === false || arrayOrResultType === 'array')
			return xyz;
		if (arrayOrResultType === 'string') {
			return 'xyz(' + xyz[0] + ' ' + xyz[1] + ' ' + xyz[2] + (xyz[3] != undefined ? '/' + xyz[3] : '') + ')';
		}
		$ = { x : xyz[0], y: xyz[1], z: xyz[2] };
		if (xyz.length > 3)
			$.alpha = xyz[3];
		return $;
	}
	
	
	function xyzToLch() {
		var arrayOrResultType;
		var $ = slice.call(arguments);
		if ($.length > 3) {
			arrayOrResultType = $[3];
		} else if ($.length === 3) {
			arrayOrResultType = false;
		} else if (isArray($[0])) {
			arrayOrResultType = $[1];
			$ = $[0];
		} else if (isPlainObj($[0])) {
			$ = $[0];	
			arrayOrResultType = $[1];
			$ = [$.x, $.y, $z];
		}
		var lch = xyz.lchab(_lab);
		if (arrayOrResultType === false || arrayOrResultType === 'array')
			return lch;
		if (arrayOrResultType === 'string') {
			return 'lch(' + lch[0] + ' ' + lch[1] + ' ' + lch[2] + ')';
		}
		return { l : lch[0], c: lch[1], h: lch[2] }
	}
	
	var xyzToLchab = xyzToLch;

	/**
	 * Converts XYZ color to RGB color.
	 * <p><b>Assumes x, y and z values are in the range 0 to 100 representing percentages.</b></p>
	 * @memberOf {SereniX.CssColorUtils
	 * @static
	 * @param {Array|Object} xyz values.
	 * @return {Object} RGB values in the range 0 to 255
	 */
	function xyzToRgb() {
		var arrayOrResultType;
		var _xyz, white;
		var $ = slice.call(arguments);
		if ($.length > 3) {
			if (typeof $[3] === 'boolean' || typeof $[3] === 'string') {
				arrayOrResultType = $[3];
			} else {
				white = $[3];
				arrayOrResultType = $[4];
			}
		} else if ($.length === 3) {
			_xyz = $;
		} else if (isArray($[0])) {
			_xyz = $[0];
			arrayOrResultType = $[1];
		} else if (isPlainObj($[0])) {
			$ = $[0];			
			_xyz = [$.x, $.y, $.z];
			arrayOrResultType = $[1];
		}
		var r = xyz.rgb(_xyz, white);
		if (arrayOrResultType == true || arrayOrResultType === 'array'|| arrayOrResultType === 1)
			return r;
		if (arrayOrResultType === 'string')
			return 'rgb(' + r.join(',') + ')';
		$ = {
			r: r[0],
			g: r[1],
			b: r[2]
		}
		if (r[3] != undefined && !isNaN(r[3]))
			$.a = r[3];
		return $;
	}


	/**
	 * RGB to XYZ
	 *
	 * @param {Array} rgb RGB channels
	 *
	 * @return {Array} XYZ channels
	 */
	rgb.xyz = function(rgb, white) {
		var r = rgb[0] / 255,
				g = rgb[1] / 255,
				b = rgb[2] / 255;

		// assume sRGB
		r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
		g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
		b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

		var x = (r * 0.41239079926595) + (g * 0.35758433938387) + (b * 0.18048078840183);
		var y = (r * 0.21263900587151) + (g * 0.71516867876775) + (b * 0.072192315360733);
		var z = (r * 0.019330818715591) + (g * 0.11919477979462) + (b * 0.95053215224966);

		white = white || xyz.whitepoint[2].E;

		return [x * white[0], y * white[1], z * white[2]];
	};
	/**
	 * Converts RGB color to XYZ color.
	 * <p><b>Assumes r, g and b values are in the range 0 to 255 representing percentages.</b></p>
	 * @memberOf {SereniX.CssColorUtils
	 * @static
	 * @param {Array|Object} xyz values.
	 * @return {Object} XYZ values in the range 0 to 100
	 */
	function rgbToXyz() {
		var arrayOrResultType;
		var _rgb, white, _xyz;
		var $ = slice.call(arguments);
		if ($.length > 3) {
			if (typeof $[3] === 'boolean' || typeof $[3] === 'string') {
				arrayOrResultType = $[3];
			} else {
				white = $[3];
				arrayOrResultType = $[4];
			}
		} else if ($.length === 3) {
			_rgb = $;
		}
		_xyz = rgb.xyz(rgb, white);
		if (arrayOrResultType == true || arrayOrResultType === 'array'|| arrayOrResultType === 1)
			return _xyz;
		if (arrayOrResultType === 'string')
			return 'xyz(' + _xyz.join(',') + ')';
		return {
			x: _xyz[0],
			y: _xyz[1],
			z: _xyz[2]
		}
	}

	yuv.rgb = function(yuv) {
		var y = yuv[0],
			u = yuv[1],
			v = yuv[2],
			r, g, b;

		r = (y * 1) + (u *  0) + (v * 1.13983);
		g = (y * 1) + (u * -0.39465) + (v * -0.58060);
		b = (y * 1) + (u * 2.02311) + (v * 0);

		r = Math.min(Math.max(0, r), 1);
		g = Math.min(Math.max(0, g), 1);
		b = Math.min(Math.max(0, b), 1);

		return [r * 255, g * 255, b * 255];
	}
	
	function yuvToRgb() {
		var arrayOrResultType;
		var r, _yiq;
		var $ = slice.call(arguments);
		if ($.length > 3) {
			if (typeof $[3] === 'boolean' || typeof $[3] === 'string') {
				arrayOrResultType = $[3];
			} else {
				white = $[3];
				arrayOrResultType = $[4];
			}
			_yiq = $;
		} else if ($.length === 3) {
			_yiq = $;
		} else if (isArray($[0])) {
			_yiq = $[0];
		} else if (isPlainObj($[0])) {
			$ = $[0];
			_yiq = [$.y == undefined ? $.Y : $.y, $.u == undefined ? $.U : $.u, $.v == undefined ? $.V : $.v]
		}
		
		r = yuv.rgb(_yiq);
		if (arrayOrResultType == true || arrayOrResultType === 'array'|| arrayOrResultType === 1)
			return r;
		if (arrayOrResultType === 'string')
			return 'rgb(' + r.join(',') + ')';
		return {
			r: r[0],
			g: r[1],
			b: r[2]
		}
	}


	//extend rgb
	rgb.yuv = function(rgb) {
		var r = rgb[0] / 255,
			g = rgb[1] / 255,
			b = rgb[2] / 255;

		var y = (r * 0.299) + (g * 0.587) + (b * 0.114);
		var u = (r * -0.14713) + (g * -0.28886) + (b * 0.436);
		var v = (r * 0.615) + (g * -0.51499) + (b * -0.10001);

		return [y, u, v];
	};
	
	function rgbToYuv() {
		var arrayOrResultType;
		var _rgb, white, _yuv;
		var $ = slice.call(arguments);
		if ($.length > 3) {
			if (typeof $[3] === 'boolean' || typeof $[3] === 'string') {
				arrayOrResultType = $[3];
			} else {
				white = $[3];
				arrayOrResultType = $[4];
			}
		} else if ($.length === 3) {
			_rgb = $;
		} else if (isArray($[0])) {
			_rgb = $[0];
			arrayOrResultType = $[1];
		} else if (isPlainObj($[0])) {
			_rgb = $[0];
			_rgb = _rgb.r == undefined ? [_rgb.red, _rgb.green, _rgb.blue] : [_rgb.r, _rgb.g, _rgb.b];
			arrayOrResultType = $[1];
		}
		_yuv = rgb.yuv(rgb, white);
		if (arrayOrResultType == true || arrayOrResultType === 'array'|| arrayOrResultType === 1)
			return _yuv;
		if (arrayOrResultType === 'string')
			return 'yuv(' + _yuv.join(',') + ')';
		return {
			y: _yuv[0],
			u: _yuv[1],
			v: _yuv[2]
		}
	}
	

	yiq.rgb = function(yiq) {
		var y = yiq[0],
			i = yiq[1],
			q = yiq[2],
			r, g, b;

		r = (y * 1) + (i *  0.956) + (q * 0.621);
		g = (y * 1) + (i * -0.272) + (q * -0.647);
		b = (y * 1) + (i * -1.108) + (q * 1.705);

		r = Math.min(Math.max(0, r), 1);
		g = Math.min(Math.max(0, g), 1);
		b = Math.min(Math.max(0, b), 1);

		return [r * 255, g * 255, b * 255];
	};
	
	function yiqToRgb() {
		var arrayOrResultType;
		var r, _yiq;
		var $ = slice.call(arguments);
		if ($.length > 3) {
			if (typeof $[3] === 'boolean' || typeof $[3] === 'string') {
				arrayOrResultType = $[3];
			} else {
				white = $[3];
				arrayOrResultType = $[4];
			}
			_yiq = $;
		} else if ($.length === 3) {
			_yiq = $;
		} else if (isArray($[0])) {
			_yiq = $[0];
		} else if (isPlainObj($[0])) {
			$ = $[0];
			_yiq = [$.y == undefined ? $.Y : $.y, $.i == undefined ? $.I : $.i, $.q == undefined ? $.Q : $.q]
		}
		
		r = yiq.rgb(_yiq);
		if (arrayOrResultType == true || arrayOrResultType === 'array'|| arrayOrResultType === 1)
			return r;
		if (arrayOrResultType === 'string')
			return 'rgb(' + r.join(',') + ')';
		return {
			r: r[0],
			g: r[1],
			b: r[2]
		}
	}


	//extend rgb
	rgb.yiq = function(rgb) {
		var r = rgb[0] / 255,
			g = rgb[1] / 255,
			b = rgb[2] / 255;


		var y = (r * 0.299) + (g * 0.587) + (b * 0.114);
		var i = 0, q = 0;
		if (r !== g || g !== b) {
			i = (r * 0.596) + (g * -0.275) + (b * -0.321);
			q = (r * 0.212) + (g * -0.528) + (b * 0.311);
		}
		return [y, i, q];
	}
	
	function rgbToYiq() {
		var arrayOrResultType;
		var _rgb, white, _yiq;
		var $ = slice.call(arguments);
		if ($.length > 3) {
			if (typeof $[3] === 'boolean' || typeof $[3] === 'string') {
				arrayOrResultType = $[3];
			} else {
				white = $[3];
				arrayOrResultType = $[4];
			}
		} else if ($.length === 3) {
			_rgb = $;
		} else if (isArray($[0])) {
			_rgb = $[0];
			arrayOrResultType = $[1];
		} else if (isPlainObj($[0])) {
			_rgb = $[0];
			_rgb = _rgb.r == undefined ? [_rgb.red, _rgb.green, _rgb.blue] : [_rgb.r, _rgb.g, _rgb.b];
			arrayOrResultType = $[1];
		}
		_yiq = rgb.yiq(rgb, white);
		if (arrayOrResultType == true || arrayOrResultType === 'array'|| arrayOrResultType === 1)
			return _yiq;
		if (arrayOrResultType === 'string')
			return 'xyz(' + _yiq.join(',') + ')';
		return {
			y: _yiq[0],
			i: _yiq[1],
			q: _yiq[2]
		}
	}
	
	function labToRgb() {
		var $ = slice.call(arguments);
		var arrayOrResultType;
		if (isArray($[0]) || isPlainObj($[0])) {
			arrayOrResultType = $[1];
			$[1] = 'array'
		} else {
			arrayOrResultType = $[3];
			$[3] = 'array'
		}
		return xyzToRgb(labToXyz.apply(this, $), arrayOrResultType)
	}
	/*
	function labToRgb(lab){
		var $ = slice.call(arguments);
		var arrayOrResultType;
		if (isArray(lab = $[0])) {
			arrayOrResultType = $[1];
		} else if (isPlainObj($[0])) {
			arrayOrResultType = $[1];
			$[1] = 'array'
		} else {
			arrayOrResultType = $[3];
			lab = $.slice(0, $.length - 1);
		}
	  var y = (lab[0] + 16) / 116,
		  x = lab[1] / 500 + y,
		  z = y - lab[2] / 200,
		  r, g, b;

		  x = 0.95047 * ((x * x * x > 0.008856) ? x * x * x : (x - 16/116) / 7.787);
		  y = 1.00000 * ((y * y * y > 0.008856) ? y * y * y : (y - 16/116) / 7.787);
		  z = 1.08883 * ((z * z * z > 0.008856) ? z * z * z : (z - 16/116) / 7.787);

		  r = x *  3.2406 + y * -1.5372 + z * -0.4986;
		  g = x * -0.9689 + y *  1.8758 + z *  0.0415;
		  b = x *  0.0557 + y * -0.2040 + z *  1.0570;

		  r = (r > 0.0031308) ? (1.055 * Math.pow(r, 1/2.4) - 0.055) : 12.92 * r;
		  g = (g > 0.0031308) ? (1.055 * Math.pow(g, 1/2.4) - 0.055) : 12.92 * g;
		  b = (b > 0.0031308) ? (1.055 * Math.pow(b, 1/2.4) - 0.055) : 12.92 * b;

		  r = [Math.round(Math.max(0, Math.min(1, r)) * 255), 
				  Math.round(Math.max(0, Math.min(1, g)) * 255), 
				  Math.round(Math.max(0, Math.min(1, b)) * 255)]
		  if (arrayOrResultType === true || arrayOrResultType === 'array') {
			  return r;
		  }
		  if (arrayOrResultType === 'string')
			  return 'rgb(' + r.join(',') + ')'
		  return { r: r[0], g: r[1], b: r[2]}
	}*/
	
	function oklabToRgb() {
		var $ = slice.call(arguments);
		var arrayOrResultType;
		if (isArray($[0]) || isPlainObj($[0])) {
			arrayOrResultType = $[1];
			$[1] = 'array'
		} else {
			arrayOrResultType = $[3];
			$[3] = 'array'
		}
		return xyzToRgb(oklabToXyz.apply(this, $), arrayOrResultType);
	}
	
	function lchToRgb() {
		var $ = slice.call(arguments);
		var arrayOrResultType;
		if (isArray(c = $[0]) || isPlainObj(c = $[0])) {
			arrayOrResultType = $[1];
			$[1] = 'array'
		} else {
			arrayOrResultType = $[3];
			$[3] = 'array'
		}
		return xyzToRgb(lchToXyz.apply(this, $), arrayOrResultType);
	}
	
	function oklchToRgb() {
		var $ = slice.call(arguments);
		var arrayOrResultType;
		if (isArray($[0]) || isPlainObj($[0])) {
			arrayOrResultType = $[1];
			$[1] = 'array'
		} else {
			arrayOrResultType = $[3];
			$[3] = 'array'
		}
		return xyzToRgb(oklchToXyz.apply(this, $), arrayOrResultType);
	}
	
	function labToRgbString() {
		var $ = slice.call(arguments);
		var arrayOrResultType = true;
		if (isArray($[0]) || isPlainObj($[0])) {
			arrayOrResultType = $[1];
		}
		return 'rgb(' + xyzToRgb(labToXyz($, 'array'), arrayOrResultType).join(' ') + ')';
	}
	
	function oklabToRgbString() {
		var $ = slice.call(arguments);
		var arrayOrResultType = true;
		if (isArray($[0]) || isPlainObj($[0])) {
			arrayOrResultType = $[1];
		}
		return 'rgb(' + xyzToRgb(oklabToXyz($, 'array'), arrayOrResultType).join(' ') + ')';
	}
	
	function lchToRgbString() {
		var $ = slice.call(arguments);
		var arrayOrResultType = true;
		if (isArray($[0]) || isPlainObj($[0])) {
			arrayOrResultType = $[1];
		}
		return 'rgb(' + xyzToRgb(lchToXyz($, 'array'), arrayOrResultType).join(' ') + ')';
	}
	
	
	CCU.labToRgb = labToRgb;
	
	// oklab and oklch
	// https://bottosson.github.io/posts/oklab/

	// XYZ <-> LMS matrices recalculated for consistent reference white
	// see https://github.com/w3c/csswg-drafts/issues/6642#issuecomment-943521484

	function xyzToOklab(xyz) {
		// Given xyz relative to D65, convert to oklab
		var xyzToLMS = [
			[ 0.8190224432164319,    0.3619062562801221,   -0.12887378261216414  ],
			[ 0.0329836671980271,    0.9292868468965546,     0.03614466816999844 ],
			[ 0.048177199566046255,  0.26423952494422764,    0.6335478258136937  ]
		];
		var lmsToOklab = [
			[  0.2104542553,   0.7936177850,  -0.0040720468 ],
			[  1.9779984951,  -2.4285922050,   0.4505937099 ],
			[  0.0259040371,   0.7827717662,  -0.8086757660 ]
		];

		var lms = multiplyMatrices(xyztoLMS, xyz);
		return multiplyMatrices(lmsToOklab, lms.map(function(c) { return Math.cbrt(c);}));
		// L in range [0,1]. For use in CSS, multiply by 100 and add a percent
	}
	
	CCU.xyzToOklab = xyzToOklab;
	
	function _array(c) {
		if (isArray(c)) {
			return c.slice();
		}
		var x = [];
		var a;
		if (c.r != undefined || c.red != undefined) {
			a = col.a != undefined ? c.a : c.alpha;
			x = [
				c.r||c.red||0,
				c.g||c.green||0,
				c.b||c.blue||0
			]
			if (a != undefined)
				c.push(a);
		} else if (c.b != undefined) {
			a = c.alpha;
			x = [
				c.l||c.lightness||0,
				c.a,
				c.b
			]
			if (a != undefined)
				x.push(a);
		} else if (c.c != undefined && c.l) {
			a = col.a != undefined ? c.a : c.alpha;
			x = [
				c.l||c.lightness||0,
				c.c,
				c.h
			]
			if (a != undefined)
				x.push(a);
		} else {
			a = col.a != undefined ? c.a : c.alpha;
			x = [
				c.x,
				c.y,
				c.z
			]
			if (a != undefined)
				x.push(a);
		}
		return x;			
	}
	
	function multiplyMatrices(matrix, color) {
	  var product = _array(color);
	  for (var y = 0; y < matrix.length; y++) {
		var sum = 0;
		for (var x = 0; x < matrix[y].length; x++) {
		  sum += color[x] * matrix[y][x];
		}
		product[y] = sum;
	  }
	  return product;
	}

	function oklabToXyz(oklab) {
		var a;
		var lmsMult, result;
				
		// Given oklab, convert to XYZ relative to D65
		var lmsToXyz =  [
			[  1.2268798733741557,  -0.5578149965554813,   0.28139105017721583 ],
			[ -0.04057576262431372,  1.1122868293970594,  -0.07171106666151701 ],
			[ -0.07637294974672142, -0.4214933239627914,   1.5869240244272418  ]
		];
		var oklabToLms = [
			[ 0.99999999845051981432,  0.39633779217376785678,   0.21580375806075880339  ],
			[ 1.0000000088817607767,  -0.1055613423236563494,   -0.063854174771705903402 ],
			[ 1.0000000546724109177,  -0.089484182094965759684, -1.2914855378640917399   ]
		];
		if (oklab.length > 3) {
			a = oklab[3];
			oklab = oklab.slice(0, oklab.length - 1);
		}
		lmsMult = multiplyMatrices(oklabToLms, oklab);
		result = multiplyMatrices(lmsToXyz, lmsMult.map(function(c) {return c*c*c;}));
		if (a != undefined)
			result[3] = a;
		return result;
	}
	
	CCU.oklabToXyz = oklabToXyz;
	
	function round(number, precision) {
	  var factor = Math.pow(10, precision == undefined ? 2 : precision);
	  return Math.round(number * factor) / factor;
	}
	
	CCU.round = round;
	
	function degToRad(degrees) {
	  return degrees * (Math.PI / 180);
	}
	CCU.degToRad = degToRad;

	function oklabToOklch(oklab) {
		var hue = Math.atan2(oklab[2], oklab[1]) * 180 / Math.PI;
		var result = [
			oklab[0], // L is still L
			Math.sqrt(oklab[1] ** 2 + oklab[2] ** 2), // Chroma
			hue >= 0 ? hue : hue + 360 // Hue, in degrees [0 to 360)
		];
		if (oklab[3])
			result[3] = oklab[3];
		return result;
	}
	
	CCU.oklabToOklch = oklabToOklch;

	function oklchToOklab(oklch) {
		var result = [
			oklch[0], // L is still L
			oklch[1] * Math.cos(oklch[2] * Math.PI / 180), // a
			oklch[1] * Math.sin(oklch[2] * Math.PI / 180)  // b
		];
		if (oklch[3]) {
			result[3] = oklch[3];
		}
		return result;
	}
	
	CCU.oklchToOklab = oklchToOklab;
	
	function oklchToRgb(oklch) {
		return oklabToRgb(oklchToOklab(oklch));
	}
	CCU.oklchToRgb = oklchToRgb;
	
	function colorspace(color) {
		return (color.colorspace||color.colorSpace||color.space||color.cs||color.name)||'';
	}
	
	var __defaultCsKeys = [
		'rgb',
		'lab',
		'lch',
		'xyz',
		'hwb',
		'hsl',
		'hsv',
		'hsb',
		'cmyk',
		'cmy'
	]
	
	var __defaultCs = {
		rgb: [['r', 'red'], ['g', 'green'], ['b', 'blue']],
		lab: [['l', 'lightness', 'L', 'Lightness'], ['a', 'A'], ['b', 'B'], ['alpha']],
		lch: [['l', 'lightness', 'L', 'Lightness'], ['c', 'C'], ['h', 'hue', 'H', 'Hue']],
		xyz: [['x', 'X'], ['y', 'Y'], ['z', 'Z']],
		hwb: [['h', 'hue', 'H', 'Hue'], ['w', 'whiteness', 'W', 'Whiteness'], ['b', 'B']],
		hsl: [['h', 'hue', 'H', 'Hue'], ['s', 'saturation', 'S', 'Saturation'], ['l', 'lightness', 'L', 'Lightness']],
		hsv: [['h', 'hue', 'H', 'Hue'], ['s', 'saturation', 'S', 'Saturation'], ['v', 'value', 'V', 'Value']],
		hsb: [['h', 'hue', 'H', 'Hue'], ['s', 'saturation', 'S', 'Saturation'], ['b', 'brightness', 'B', 'Brightness']],
		cmyk: [['c', 'cyan'], ['m', 'magenta'], ['k', 'key']],
		cmy: [['c', 'cyan'], ['m', 'magenta']]
	}
	
	function __getCs($) {
		var i, v, j, n, a, k, l, count;
		var found;
		var name;
		var cs = colorSpace($);
		var fields = [];
		if (cs)
			return cs;
		count = __defaultCsKeys.length;
		for (k = 0; k < count; k++) {
			name = __defaultCsKeys[k];
			cs = __defaultCs[name];
			for (i = 0, n = cs.length; i < n; i++) {
				a = cs[i];
				l = a.length;
				found = 0;
				for (j = 0; j < l; j++) {
					v = $[a[j]]
					fields.push(a[j]);
					if (v != undefined) {
						found++;
						break;
					}
				}
			}
			if (found === l)
				return { colorspace: name, fields : fields };
		}
		throw new Error('Incorrect color matrix arguments');
	}
	
	
	function _fields(cs) {
		return ({
			lab: ['l', 'a', 'b'],
			oklab: ['l', 'a', 'b'],
			lch: ['l', 'c', 'h'],
			oklch: ['l', 'c', 'h'],
			rgb: ['r', 'g', 'b' ],
			srgb: ['r', 'g', 'b' ],
			lrgb: ['r', 'g', 'b' ],
			'srgb-linear': ['r', 'g', 'b' ],
			a98: ['r', 'g', 'b' ],
			'a98-rgb': ['r', 'g', 'b' ],
			'rec2020': ['r', 'g', 'b' ],
			'prophoto-rgb': ['r', 'g', 'b' ],
			'display-p3': ['r', 'g', 'b'],
			hsl: ['h', 's', 'l' ],
			hsb: ['h', 's', 'b' ],
			hsv: ['h', 's', 'v' ],
			hwb: ['h', 'w', 'b' ],
			cmyk: ['c', 'm', 'y', 'k' ],
			cmy: ['c', 'm', 'y' ],
			xyz: ['x', 'y', 'z'],
			'xyz-d50': ['x', 'y', 'z'],
			'xyz-d65': ['x', 'y', 'z'],
			xyz50: ['x', 'y', 'z'],
			xyz65: ['x', 'y', 'z'],
			xyzd50: ['x', 'y', 'z'],
			xyzd65: ['x', 'y', 'z']
		})[(/a$/.test(cs) ? cs.substring(0, cs.length -1) : cs).toLowerCase()];
	}
	function toColorString(color, cs) {
		var a, alphaSlash;
		var x, y, z;
		var space;
		var components;
		var fields;
		var args = slice.call(arguments);
		if (isPlainObj(color)) {
			space = cs||colorspace(color)||'';
			components = color.components||color.color||color.data;
		} else if (isArray(color)) {
			space = cs||'rgb';
			if (space === 'rgb' || space === 'rgba') {
				return 'rgb' + (color.length > 3 ? 'a' : '') + '(' + color.join(',') + ')';
			}
		} else {
			if (typeof args[3] === 'number') {
				space = args[4]||'rgb';
			} else {
				if (typeof args[3] === 'string') {
					space = args[3];					
				}
				args.splice(3, args.length - 3);				
			}
			color = args;
		}
		if (isArray(components)) {
			a = components[3];
			x = components[0];
			y = components[1];
			z = components[2];
			alphaSlash = a == undefined ? '' :  '/' + a;
		    switch (space = isPlainObj(cs) ? cs.colorspace : cs) {
				case 'rgb':
				case 'rgba': {
				  if (a < 1) {
					return 'rgba(' 
						+ Math.round(x * 255)
						+ ', '
						+ Math.round(y * 255)
						+ ', '
						+ Math.round(z * 255)
						+ ', '
						+ round(a, 5)
						+ ')';
				  }
				  return 'rgb(' + Math.round(x * 255) + ', ' + Math.round(y * 255) + ', ' + Math.round(z * 255) + ')';
				}
				case 'hsl':
				case 'hsv':
				case 'hsb':
				case 'hwb':
				case 'hsla':
				case 'hsva':
				case 'hsba':
				case 'hwba':
					if (a < 1) {
						return space.substring(0, 3) + 'a('
							+ x
							+ ','
							+ y
							+ '%,'
							+ z
							+ '%,'
							+ round(a, 5)
							+ ')';
					}
					return space.substring(0, 3) + '('
						+ x
						+ ','
						+ y
						+ '%,'
						+ z
						+ '%'
						+ ')';					
				case 'lab':
				case 'lch':{ //example: lab(54.0% -0.10 -0.02)
				  return space + '(' + round(x, 6) + '% ' + round(y, 6) + ' ' + round(z, 6) + alphaSlash + ')';
				}			
				case 'oklab':
				case 'oklch': { //example: oklab(54.0% -0.10 -0.02)
				  return space + '(' + round(x * 100, 6) + '% ' + round(y, 6) + ' ' + round(z, 6) + alphaSlash + ')';
				}		
				default: // color(display-p3 0.4 0.2 0.6)
						// color(xyz-d65 0.4 0.2 0.6)
				  return 'color(' + space + ' '+ round(x, 6) + ' '+ round(y, 6) + ' '+ round(z, 6) + alphaSlash + ')';
		    }
		} else {
			space = space||(isPlainObj(cs) ? cs.colorspace||cs.colorSPace||cs.space : cs)||'';
			alphaSlash = a == undefined ? '' :  '/' + a;
			if (isArray(color)) {
				x = color[0];
				y = color[1];
				z = color[2];
				a= color[3];
			} else {
				fields = _fields(space)||['r', 'g', 'b'];
				x = color[fields[0]];
				y = color[fields[1]];
				z = color[fields[2]];
				a = /lab$/.test(space||'') ? color.alpha : (color.alpha == undefined ? color.a : color.alpha);
			}
		    switch (space) {
				case 'rgb':
				case 'rgba': {
				  if (a < 1) {
					return 'rgba(' 
						+ x + ', '
						+ y + ', '
						+ z + ', '
						+ round(a, 5)
						+ ')';
				  }
				  return 'rgb(' + x+ ', ' + y+ ', ' + z+ ')';
				}
				case 'hsl':
				case 'hsv':
				case 'hsb':
				case 'hwb':
				case 'hsla':
				case 'hsva':
				case 'hsba':
				case 'hwba':
					if (a < 1) {
						return space.substring(0, 3) + 'a('
							+ x+ ','
							+ y+ '%,'
							+ z+ '%,'
							+ round(a, 5)
							+ ')';
					}
					return space.substring(0, 3) + '('
						+ x+ ',' 
						+ y+ '%,'
						+ z+ '%'
						+ ')';
				case 'lab':
				case 'lch': { //example: oklab(54.0% -0.10 -0.02)
					return space + '(' + x+ '% ' + y+ ' ' + z+ alphaSlash + ')';
				}
				case 'oklab':
				case 'oklch': { //example: oklab(54.0% -0.10 -0.02)
					return space + '(' + (x*100) + '% ' + y+ ' ' + z+ alphaSlash + ')';
				}		
				default: // color(display-p3 0.4 0.2 0.6)
						// color(xyz-d65 0.4 0.2 0.6)
				    return 'color(' + space + ' '+ x+ ' '+ y+ ' '+ z+ alphaSlash + ')';
			}
		}
	}
	CCU.colorspace = colorspace;
	
	CCU.cs = colorspace;
	
	CCU.toColorString = toColorString;
	/**
	 * Mutiplies matrix and vector.
	 * @memberOf SereniX.CssColorUtils
	 * @static
	 * @param {Array&lt;Array&gt;} matrix 2-dimensional array matrix
	 * @param {Array&lt;Array&gt;} vector 1-dimensional array matrix
	 * @returns {Array} 1-dimensional array matrix
	 */
	function multiplyMatrices(matrix, vector) {
		var n = matrix.length;
		var i = 0, j;
		if (isPlainObj(vector)) {
			vector = _array(vector);
		}
		var vlen = vector.length;
		var m;
		var result = [];
		for (j = 0; j < vlen; j++) {
			result[j] = 0;
		}
		if (isArray(matrix[0])) {
			for (; i < n; i++) {
				m = matrix[i];
				j = 0;
				if (vlen !== m.length) {
					throw new Error('');
				}
				for (; j < vlen; j++) {
					result[j] += m[j]*vector[j];
				}
			}
		} else {
			n = Math.floor(matrix.length/vlen);
			for (; i < n; i++) {
				for (j = 0; j < vlen; j++) {
					result[j] += matrix[vlen*i + j]*vector[j];
				}
			}
		}
		return result;
	}
	/**
	 * 
	 * @memberOf SereniX.CssColorUtils
	 * @static
	 * @param {Array&lt;Array&gt;} a 2-dimensional array matrix
	 * @param {Array&lt;Array&gt;} a 2-dimensional array matrix
	 * @returns {Array&lt;Array&gt;} a 2-dimensional array matrix
	 */
	function mult(a, b) {
		var productRow, product;
		var x, y, z, p;
		var i, j, k;
	   if (!Array.isArray(a) || !Array.isArray(b) || !a.length || !b.length) {
		  throw new Error('arguments should be in 2-dimensional array format');
	   }
	   x = a.length;
	   z = a[0].length;
	   y = b[0].length;
	   if (b.length !== z) {
		  // XxZ & ZxY => XxY
		  throw new Error('number of columns in the first matrix should be the same as the number of rows in the second');
	   }
	   productRow = Array.apply(null, new Array(y)).map(Number.prototype.valueOf, 0);
	   product = new Array(x);
	   for (p = 0; p < x; p++) {
		  product[p] = productRow.slice();
	   }
	   for (i = 0; i < x; i++) {
		  for (j = 0; j < y; j++) {
			 for (k = 0; k < z; k++) {
				product[i][j] += a[i][k] * b[k][j];
			 }
		  }
	   }
	   return product;
	}
	
	CCU.multiplyMatrices = multiplyMatrices;
	
	CCU.mult = mult;
	
	function oklabToRgb2(oklab) {
		return srgbToRgb(CCU.oklabTosRGB(oklab));
	}
	
	function oklchToRgb2(oklab) {
		return srgbToRgb(CCU.oklchTosRGB(oklab));
	}
	
	function _csKey(cs) {
		return cs.replace(/[ \t-]+([a-zA-Z])?/g, function($0, $1) {
			return $1 ? $1.toUpperCase() : '';
		})
	}
	/**
	 * Hex To RGB
	 * @param {string} hex
	 */
	hexToRgb = function hexToRgb(hex) {
		return _hexToRgb(hex[0] === '#' ? hex.substring(1) : hex)
	}
	function _hexToRgb(hexDigits) {
		var rgb, x;
		switch(hexDigits.length) {
			case 6:
				rgb = {
					r : parseFloat(hexDigits.substring(0, 2), 16),
					g : parseFloat(hexDigits.substring(2, 4), 16),
					b : parseFloat(hexDigits.substring(4), 16)
				}
				break;
			case 3:
				rgb = {
					r : parseFloat(hexDigits[0] + hexDigits[0], 16),
					g : parseFloat(hexDigits[1] + hexDigits[1], 16),
					b : parseFloat(hexDigits[2] + hexDigits[2], 16)
				}
				break;
			case 8:
				rgb = {
					r : parseFloat(hexDigits.substring(0, 2), 16),
					g : parseFloat(hexDigits.substring(2, 4), 16),
					b : parseFloat(hexDigits.substring(4, 6), 16),
					a : parseFloat(hexDigits.substring(6), 16)/255
				}
				break;
			case 4:
				rgb = {
					r : parseFloat(hexDigits[0] + hexDigits[0], 16),
					g : parseFloat(hexDigits[1] + hexDigits[1], 16),
					b : parseFloat(hexDigits[2] + hexDigits[2], 16),
					a : parseFloat(hexDigits[3] + hexDigits[3], 16)/255
				}
				break;
			case 2:
				rgb = {
					r : parseFloat(hexDigits[0] + hexDigits[0], 16),
					g : parseFloat(hexDigits[0] + hexDigits[1], 16),
					b : parseFloat(hexDigits[1] + hexDigits[1], 16)
				}
				break;
			case 1:
				rgb = {
					r : x = parseFloat(hexDigits[0] + hexDigits[0], 16),
					g : x,
					b : x
				}
				break;
			default: 
				throw new Error('Incorrect color\'s hex digits: ' + hexDigits);
		}
		rgb.colorspace = 'rgb';
		return rgb;
	}
	/**
	 * Converts the given source color to a color value in destination's color space.
	 * <p>When the source color is an array, the source color space argument is mandatory/required.</p>
	 * <p>When source color space not specified, it's extracted/computed from
	 * the given source color using 'colorspace', 'colorSpace', 'space', 'cs'
	 * or 'name' field when the source color is a plain object. When the
	 * source color is a string, the name of source color function is used as
	 * source color space.</p>
	 * @memberOf SereniX.CssColorUtils
	 * @static
	 * @function
	 * @param {String|Object|Array} color Source color
	 * @param {String} to  Destination's color space
	 * @param {String} [cs] Source color space.
	 * @returns {String|Object} Coverted color
	 *		<p>When the source color is a string, the result is also a string.
	 *		Otherwise, the result is a plain object.</p>
	 */
	function convert(color, to, cs) {
		var fn;
		var c = color;
		var _string;
		var _cs;
		var rgb;
		var key, destKey;
		var CM;
		var match;
		if (typeof c === 'string') {
			if (!cs) {
				if ((match = /^([a-zA-Z][[a-zA-Z0-9-]*)\[ \t]*\(/.exec(c)))
					cs = match[1];
				else if ((match = /#?([0-9a-fA-F]+)$/.exec(c))) {
					if (/^hex/i.test(to))
						return '#' + match[1];
					cs = 'rgb';
					c = _hexToRgb(match[1]);
				} else { //get color from name
					c = nativeNames[c.toLowerCase()];
					if (!c)
						throw new Error('Incorrect or unknown color name: ' + c);
					if (/^hex/i.test(to))
						return c;
					c = hexToRgb(c);
					cs = 'rgb';
				}
			} else {
				c = toColor(c);
			}
			_string = true;
		}
		cs = cs||colorspace(c);
		if ((cs === to) || (to == 'rgb' && !cs)) {
			return color;
		}
		key = COLOR_SPACE_KEYS[cs]||_csKey(cs);
		destKey = COLOR_SPACE_KEYS[to]||_csKey(to);
		name = key + 'To' + destKey[0].toUpperCase() + destKey.substring(1);
		fn = CCU[name];
		if (fn)
			return fn.call(CCU, c);
		if ((CM = SereniX.ColorMatrix) && (fn = CM[name])) {
			return fn.call(CM, c);
		}
		if (to === 'rgb') {
			c = toRgb(c);
		} else if (['hsl', 'hwb', 'hsv', 'hsb', 'cmyk', 'cmy'].indexOf(to) >= 0) {
			c = CCU['rgbTo' + to[0] + to.substring(1)](toRgb(c));
		} else if ((rgb = cs === 'rgb' ? c : 
			['hsl', 'hwb', 'hsv', 'hsb', 'cmyk', 'cmy'].indexOf(cs) >= 0 ? CCU[cs + 'ToRgb'](c) : 
			false)) {
			if (to === 'lab') {
				
			} else if (to === 'lch') {
				
			} else if (to === 'oklab') {
				
			} else if (to === 'oklch') {
				
			} else if (to === 'srgb') {
				c = rgbToSrgb(rgb);
			} else if (to === 'srgb-linear' || to === 'lrgb') {
				c = srgbToLrgb(rgbToSrgb(rgb))
			} else {
				c = _fromXyz65(rgb, cs, to);
			}
		} else {
			c = CCU[key + 'ToXyz65'](c);
			fn = CCU['xyz65To' + destKey[0].toUpperCase() + destKey.substring(1)];
			if (!fn)
				throw new Error('Colorspace not yet supported: ' + to)
			c = fn.call(CCU, c);
		}
		return _string ? toColorString(c) : c;
	}
	
	function _fromXyz65(rgb, cs, to) {
		var _to = 'xyz65To' + (COLOR_SPACE_KEYS[to]||_csKey(to));
		var fn = CCU[_to];
		var o;
		if (fn)
			o = CCU;
		else {
			o = SereniX.ColorMatrix;
			if (!o || !(fn = o[_to])) {
				throw new Error('Color not convertible from the color space xyz65 to ' + to);
			}					
		}
		return fn.call(o, srgbToXyz65(rgbToSrgb(rgb)));
	}
	CCU.convert = convert;
	
	var BLACK = CCU.BLACK = '#000000';
	var WHITE = CCU.WHITE = '#ffffff';
	var GRAY = CCU.GRAY = CCU.GREY = '#808080';
	
	CCU.rgbToXyz = rgbToXyz;
	CCU.xyzToRgb = xyzToRgb;
	CCU.labToXyz = labToXyz;
	CCU.xyzToLab = xyzToLab;
	CCU.lchToXyz = lchToXyz;
	CCU.labToRgb = labToRgb;
	CCU.lchToRgb = lchToRgb;
	
	CCU.hsvaToRgba2 = hsvaToRgba2;
	
	CCU.opacity = opacity;
	
	CCU.cmykToCmy = cmykToCmy;
	
	CCU.cmyk2cmy = cmyk2cmy;
	
	CCU.cmy2rgb = cmy2rgb;
	
	CCU.cmyToRgb = cmy2rgb;
	
	CCU.cmykToRgb = cmykToRgb;
	
	CCU.cmykToHex = cmykToHex;
	
	CCU.cmykToHexValue = cmykToHexValue;
	
	CCU.cmykToRgba = cmykToRgba;
	
	CCU.cmykToHsl = cmykToHsl;
	
	CCU.cmyToHsl = cmyToHsl;
	
	CCU.cmykToHsla = cmykToHsla;
	
	CCU.cmyToHsla = cmyToHsla;
	
	CCU.hsvToRgb = hsvToRgb;
	
	CCU.hsbToRgb = hsvToRgb;
	
	CCU.hsvaToRgba = hsvaToRgba;
	
	CCU.hsbaToRgba = CCU.hsvaToRgba;
	
	var hsbaToRgba = hsvaToRgba;
	
	var hsbToRgb = hsvToRgb;
	
	CCU.yiqToRgb = yiqToRgb;
	
	CCU.rgbToYiq = rgbToYiq;
	
	CCU.toHslaString = toHslaString;
	
	CCU.arrayFromArgs = arrayFromArgs;
	
	CCU.rgbFromArgs = rgbFromArgs;
	
	CCU.xyzFromArgs = xyzFromArgs;
	
	CCU.srgbToRgbSys = srgbToRgbSys;
	
	CCU.srgbToRgb = srgbToRgb;
	
	CCU.rgbToSrgb = rgbToSRgb;
	CCU.rgbToSRgb = rgbToSRgb;
	CCU.rgbToSRGB = rgbToSRgb;
	
	CCU.oklabToRgb2 = oklabToRgb2;
	
	oklabToRgb = oklabToRgb2;
	
	CCU.oklabToRgb = oklabToRgb;
	
	
	CCU.oklchToRgb2 = oklchToRgb2;
	
	oklchToRgb = oklchToRgb2;
	
	CCU.oklchToRgb = oklchToRgb;
	
	CCU.objRgb = _objRgb;
	
	CCU.hslToRgb2 = hslToRgb2;
	
	/**
	  * 
	  * @param {Number|Array|Object} $0
	  * @param {Number|Boolean} $1
	  * @param {Number} $2
	  * @param {Boolean} obj
	  * @returns {Array|Object}
	  */
	CCU.rgbToHsb = rgbToHsb;
	/**
	 * Hex To RGB
	 * @param {string} hex
	 */
	CCU.hexToRgb = hexToRgb;
	
	CCU.rgbToHex = rgbToHex;


	CCU.arrayRgbToHex = arrayRgbToHex;

	/**
	 * 
	 * Assumes that arguments in the range 0 to 1
	 * @param {Number} h Hue
	 * @param {Number} w Whiteness
	 * @param {Number} b blackness
	 * @returns {Array}
	 */
	CCU.hwbToRgb = hwbToRgb;

	/**
	 * 
	 * Assumes that arguments in the range 0 to 1
	 * @param {Number} h 
	 * @param {Number} w 
	 * @param {Number} b 
	 * @returns {Object}
	 */
	CCU.hwb2Rgb = hwb2Rgb

	/**
	 * 
	 * Assumes that h in the range 0 to 360, w and b in the range 0 to 100
	 * @param {Number} h 
	 * @param {Number} w 
	 * @param {Number} b 
	 * @returns {Object}
	 */
	CCU.hwbaToRgba = hwbaToRgba
	CCU.hwbToRgba = hwbaToRgba;
	/**
	 * 
	 * Assumes that arguments in the range 0 to 1
	 * @param {Number} h 
	 * @param {Number} w 
	 * @param {Number} b 
	 * @param {Number} a
	 * @returns {Object}
	 */
	CCU.hwba2Rgba = hwba2Rgba
	/**
	 * Converts color hex digits (not starts with '#') to RGB object.
	 * @memberOf SereniX.CssColorUtils
	 * @static
	 * @param {String} digits Hexadecimal digits string 
	 * 		<b>with length equals to 6, 3, 8, 4, 2 or 1</b>.
	 * @returns {Object}
	 */
	CCU.hexDigitsToRgb = _hexToRgb;
	/**
	 * Converts hex color (<b>starts with '#' and with length
	 * equals to 7, 4, 9, 5, 3 or 2</b>) or color hex digits
	 * (<b>not starts with '#' and with length equals to 6, 3, 8, 4, 2 or 1</b>)
	 * to RGB object.
	 * @memberOf SereniX.CssColorUtils
	 * @static
	 * @param {String} digits Hexadecimal digits string
	 * @returns {Object}
	 */
	CCU.hexToRgb = hexToRgb;
	
	CCU.parse = toColor;
	
	CCU.format = toColorString;
	
	CCU.serialize = toColorString;
	
	/**
	 * @memberOf SereniX.CssColorUtils
	 * @static
	 * @see SereniX.CssColorUtils.backgroundColor
	 * @property {Object|Array|String} defaultBackgroundColor The background color used when executing rgbaToRgb function and background color argument(s) not setted and SereniX.CssColorUtils.backgroundColor not setted, undefined or null.
	 */
	CCU.defaultBackgroundColor = [255,255,255];
	
	/**
	 * @memberOf SereniX.CssColorUtils
	 * @static
	 * @see SereniX.CssColorUtils.defaultBackgroundColor
	 * @property {Object|Array|String|Boolean|undefined} backgroundColor The background color used when executing rgbaToRgb function and background color argument(s) not setted and SereniX.CssColorUtils.backgroundColor not null and not undefined. <p>To used  SereniX.CssColorUtils.defaultBackgroundColor when when executing rgbaToRgb function and background color argument(s) not setted, set the value of a falsy value (undefined, null, false, 0 for example) or delete SereniX.CssColorUtils.defaultBackgroundColor.</p>
	 */
	CCU.backgroundColor = undefined;
	
	if (typeof SereniX === 'undefined') {
		SereniX = { CssColorUtils: CCU};
	} else if (typeof SereniX.addChild === 'function') {
		SereniX.addChild(CCU);
	} else {
		SereniX.CssColorUtils = CCU;
	}
	
	
	
	var WCAG = SereniX.WCAG;
	if (WCAG) {
		CCU.mostReadable = WCAG.mostReadable;
		CCU.isReadable = WCAG.isReadable;
		CCU.readability = WCAG.readability;
	}
	
	/*------------------------------------------*/
	/*          Color Matrix extension          */
	/*------------------------------------------*/
	
	var srgbToXyz65;
	
	var CM;
	//if serenix_color_matrix loaded before this file, extends SereniX.ColorMatrix.
	//and also exports ColorMatrix static methods to CssColorUtils.
	if ((CM = SereniX.ColorMatrix)) {	
	
		CCU.a98ToXyz65 = CM.a98ToXyz65
		CCU.xyz65ToA98 = CM.xyz65ToA98
		CCU.a98RgbToXyz65 = CM.a98ToXyz65
		CCU.a98RgbToXyzD65 = CM.a98ToXyz65
		CCU.a98RgbToXyzd65 = CM.a98ToXyz65
		CCU.xyz65ToA98Rgb = CM.xyz65ToA98
		CCU.rgbToXyz65 = CM.rgbToXyz65
		CCU.xyz50ToXyz65 = CM.xyz50ToXyz65
		CCU.rgbToXyzD65 = CM.rgbToXyz65
		CCU.xyz50ToXyz65 = CM.xyz50ToXyz65
		CCU.rgbToXyzd65 = CM.rgbToXyz65
		CCU.xyz50ToXyzd65 = CM.xyz50ToXyz65
		CCU.xyz65ToRgb = CM.xyz65ToRgb
		CCU.xyz65ToXyz50 = CM.xyz65ToXyz50
		CCU.lrgbToRgb = CM.lrgbToRgb
		CCU.rgbToLrgb = CM.rgbToLrgb 
		CCU.p3ToXyz65 = CM.p3ToXyz65
		CCU.xyz65ToP3 = CM.xyz65ToP3
		CCU.displayP3ToXyz65 = CM.p3ToXyz65
		CCU.xyz65ToDisplayP3 = CM.xyz65ToP3	
		CCU.p3ToXyzd65 = CM.p3ToXyz65
		CCU.xyzd65ToP3 = CM.xyz65ToP3
		CCU.displayP3ToXyzd65 = CM.p3ToXyz65
		CCU.xyzd65ToDisplayP3 = CM.xyz65ToP3	
		CCU.p3ToXyzD65 = CM.p3ToXyz65
		CCU.xyzD65ToP3 = CM.xyz65ToP3
		CCU.displayP3ToXyzD65 = CM.p3ToXyz65
		CCU.xyzD65ToDisplayP3 = CM.xyz65ToP3
		
		CCU.prophotoToXyz50 = CM.prophotoToXyz50;
		CCU.xyz50ToProphoto = CM.xyz50ToProphoto;
		CCU.prophotoToXyz65 = CM.prophotoToXyz65;
		CCU.prophotoToXyzD65 = CM.prophotoToXyz65;
		CCU.prophotoToXyzs65 = CM.prophotoToXyz65;
		
		CCU.srgbToLrgb = CM.srgbToLrgb;
		CCU.lrgbTosRgb = CM.lrgbTosRgb
		CCU.lrgbToSRgb = CM.lrgbTosRgb
		CCU.lrgbToSrgb = CM.lrgbTosRgb
		
		
		CCU.xyz65TosRgb = CM.xyz65TosRgb;
		CCU.xyz65ToSRgb = CM.xyz65TosRgb;
		CCU.xyz65ToSrgb = CM.xyz65TosRgb;
		CCU.xyz65ToSRGB = CM.xyz65TosRgb;
		
		CCU.srgbToXyz65 = CM.srgbToXyz65;
		CCU.srgbToXyzD65 = CM.srgbToXyz65;
		CCU.srgbToXyzd65 = CM.srgbToXyz65;
		srgbToXyz65 = CM.srgbToXyz65;
	
		CCU.oklabTosRGB = CM.oklabTosRGB;
		CCU.oklchTosRGB = CM.oklchTosRGB;
		CCU.oklabTosRgb = CM.oklabTosRGB;
		CCU.oklchTosRgb = CM.oklchTosRGB;
		CCU.oklabToSRGB = CM.oklabTosRGB;
		CCU.oklchToSRGB = CM.oklchTosRGB;
		CCU.oklabToSRgb = CM.oklabTosRGB;
		CCU.oklchToSRgb = CM.oklchTosRGB;
		
		CCU.toXyz65 = CM.toXyz65;
		
		CCU.toXyzD65 = CM.toXyz65;
		
		CCU.toXyzd65 = CM.toXyz65;
		
		
		CM.supportsLch = supportsLch;	
		CM.supportsLab = supportsLab;
		
		CM.rgbToSRgb = rgbToSRgb;
	
		CM.srgbToRgb = srgbToRgb;
		
		CM.srgbToRgbSys = srgbToRgbSys;
		
		CM.rgbToSrgb = rgbToSRgb;
		CM.rgbToSRGB = rgbToSRgb;
		
	}
	
	return CCU;
});
	
	
