if (typeof SereniX === 'undefined') {
	;(function(root, name, factory) {
		if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
			module.exports = factory();
		} else if (typeof define === 'function' && define.amd) {
			define([name], factory);
		} else {
			root[name] = factory();
		}    
	})(this, 'SereniX', function() {
		return {};
	});
}

if (typeof Math.sign === 'undefined') {
	Math.sign = function(x) {
		return x < 0 ? -1 : 1;
	}
}

;(function(root, name, factory) {
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([name], factory);
    } else {
        root[name] = factory();
    }    
})(this, 'ColorMatrix', function() {
	
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
	
	// https://observablehq.com/@danburzo/color-matrix-calculator
	var LINEAR_RGB_D65_TO_XYZ = [
	  [0.4123907992659593, 0.357584339383878, 0.1804807884018343],
	  [0.2126390058715102, 0.715168678767756, 0.0721923153607337],
	  [0.0193308187155918, 0.119194779794626, 0.9505321522496607],
	];
	var XYZ_TO_LINEAR_RGB_D65 = [
	  [3.2409699419045221, -1.5373831775700939, -0.4986107602930034],
	  [-0.9692436362808793, 1.8759675015077202, 0.0415550574071756],
	  [0.0556300796969937, -0.2039769588889766, 1.0569715142428782],
	];
	
	var LMS_TO_OKLAB = [
	  [0.2104542553, 0.793617785, -0.0040720468],
	  [1.9779984951, -2.428592205, 0.4505937099],
	  [0.0259040371, 0.7827717662, -0.808675766],
	];
	var LMS_TO_LINEAR_RGB = [
	  [4.0767416621, -3.3077115913, 0.2309699292],
	  [-1.2684380046, 2.6097574011, -0.3413193965],
	  [-0.0041960863, -0.7034186147, 1.707614701],
	];
	var LINEAR_RGB_TO_LMS = [
	  [0.4122214708, 0.5363325363, 0.0514459929],
	  [0.2119034982, 0.6806995451, 0.1073969566],
	  [0.0883024619, 0.2817188376, 0.6299787005],
	];
	var OKLAB_TO_LMS = [
	  [1, 0.39633779217376774, 0.2158037580607588],
	  [1, -0.10556134232365633, -0.0638541747717059],
	  [1, -0.08948418209496574, -1.2914855378640917],
	];
	
	/** sRGB transfer function (D65 illuminant) */
	function sRGBTransfer(value) {
	  var abs = Math.abs(value);
	  return abs <= 0.0031308 ? value * 12.92 : 1.055 * Math.pow(abs, 1 / 2.4) - 0.055;
	}
	
	/**
	 * Finds intersection of the line defined by
	 * L = L0 * (1 - t) + t * L1;
	 * C = t * C1;
	 * a and b must be normalized so a^2 + b^2 == 1
	 */
	function findGamutIntersection(a, b, L1, C1, L0) {
	  // Find the cusp of the gamut triangle
	  var cusp = findCusp(a, b);

	  // Find the intersection for upper and lower half seprately

	  if ((L1 - L0) * cusp.C - (cusp.L - L0) * C1 <= 0) {
		// Lower half

		return (cusp.C * L0) / (C1 * cusp.L + cusp.C * (L0 - L1));
	  }
	  // Upper half

	  // First intersect with triangle
	  var t = (cusp.C * (L0 - 1)) / (C1 * (cusp.L - 1) + cusp.C * (L0 - L1));

	  // Then one step Halley's method

	  var dL = L1 - L0;
	  var dC = C1;

	  var k_l = 0.3963377774 * a + 0.2158037573 * b;
	  var k_m = -0.1055613458 * a - 0.0638541728 * b;
	  var k_s = -0.0894841775 * a - 1.291485548 * b;

	  var l_dt = dL + dC * k_l;
	  var m_dt = dL + dC * k_m;
	  var s_dt = dL + dC * k_s;

	  // If higher accuracy is required, 2 or 3 iterations of the following block can be used:

	  var L = L0 * (1 - t) + t * L1;
	  var C = t * C1;

	  var l_ = L + C * k_l;
	  var m_ = L + C * k_m;
	  var s_ = L + C * k_s;

	  var lms = [
		[l_ ** 3, m_ ** 3, s_ ** 3],
		[3 * l_dt * l_ ** 2, 3 * m_dt * m_ ** 2, 3 * s_dt * s_ ** 2],
		[6 * l_dt ** 2 * l_, 6 * m_dt ** 2 * m_, 6 * s_dt ** 2 * s_],
	  ];

	  var red = LMS_TO_LINEAR_RGB[0][0] * lms[0][0] + LMS_TO_LINEAR_RGB[0][1] * lms[0][1] + LMS_TO_LINEAR_RGB[0][2] * lms[0][2] - 1;
	  var red1 = LMS_TO_LINEAR_RGB[0][0] * lms[1][0] + LMS_TO_LINEAR_RGB[0][1] * lms[1][1] + LMS_TO_LINEAR_RGB[0][2] * lms[1][2];
	  var red2 = LMS_TO_LINEAR_RGB[0][0] * lms[2][0] + LMS_TO_LINEAR_RGB[0][1] * lms[2][1] + LMS_TO_LINEAR_RGB[0][2] * lms[2][2];
	  var u_red = red1 / (red1 * red1 - 0.5 * red * red2);
	  var t_red = u_red >= 0 ? -red * u_red : Infinity;

	  var green = LMS_TO_LINEAR_RGB[1][0] * lms[0][0] + LMS_TO_LINEAR_RGB[1][1] * lms[0][1] + LMS_TO_LINEAR_RGB[1][2] * lms[0][2] - 1;
	  var green1 = LMS_TO_LINEAR_RGB[1][0] * lms[1][0] + LMS_TO_LINEAR_RGB[1][1] * lms[1][1] + LMS_TO_LINEAR_RGB[1][2] * lms[1][2];
	  var green2 = LMS_TO_LINEAR_RGB[1][0] * lms[2][0] + LMS_TO_LINEAR_RGB[1][1] * lms[2][1] + LMS_TO_LINEAR_RGB[1][2] * lms[2][2];
	  var u_green = green1 / (green1 * green1 - 0.5 * green * green2);
	  var t_green = u_green >= 0 ? -green * u_green : Infinity;

	  var blue = LMS_TO_LINEAR_RGB[2][0] * lms[0][0] + LMS_TO_LINEAR_RGB[2][1] * lms[0][1] + LMS_TO_LINEAR_RGB[2][2] * lms[0][2] - 1;
	  var blue1 = LMS_TO_LINEAR_RGB[2][0] * lms[1][0] + LMS_TO_LINEAR_RGB[2][1] * lms[1][1] + LMS_TO_LINEAR_RGB[2][2] * lms[1][2];
	  var blue2 = LMS_TO_LINEAR_RGB[2][0] * lms[2][0] + LMS_TO_LINEAR_RGB[2][1] * lms[2][1] + LMS_TO_LINEAR_RGB[2][2] * lms[2][2];
	  var u_blue = blue1 / (blue1 * blue1 - 0.5 * blue * blue2);
	  var t_blue = u_blue >= 0 ? -blue * u_blue : Infinity;

	  return t + Math.min(t_red, t_green, t_blue);
	}
	
	/**
	 * Finds the maximum saturation possible for a given hue that fits in sRGB
	 * Saturation here is defined as S = C/L
	 * a and b must be normalized so a^2 + b^2 == 1
	 */
	function computeMaxSaturation(a, b) {
	  // Max saturation will be when one of r, g or b goes below zero.

	  // Select different coefficients depending on which component goes below zero first
	  var k = [Infinity, Infinity, Infinity, Infinity, Infinity];
	  var wl = Infinity;
	  var wm = Infinity;
	  var ws = Infinity;

	  if (-1.88170328 * a - 0.80936493 * b > 1) {
		// Red component
		k = [1.19086277, 1.76576728, 0.59662641, 0.75515197, 0.56771245];
		wl = 4.0767416621;
		wm = -3.3077115913;
		ws = 0.2309699292;
	  } else if (1.81444104 * a - 1.19445276 * b > 1) {
		// Green component
		k = [0.73956515, -0.45954404, 0.08285427, 0.1254107, 0.14503204];
		wl = -1.2684380046;
		wm = 2.6097574011;
		ws = -0.3413193965;
	  } else {
		// Blue component
		k = [1.35733652, -0.00915799, -1.1513021, -0.50559606, 0.00692167];
		wl = -0.0041960863;
		wm = -0.7034186147;
		ws = 1.707614701;
	  }

	  // Approximate max saturation using a polynomial:
	  var S = k[0] + k[1] * a + k[2] * b + k[3] * a * a + k[4] * a * b;

	  // Do one step Halley's method to get closer
	  // this gives an error less than 10e6, except for some blue hues where the dS/dh is close to infinite
	  // this should be sufficient for most applications, otherwise do two/three steps
	  var k_l = 0.3963377774 * a + 0.2158037573 * b;
	  var k_m = -0.1055613458 * a - 0.0638541728 * b;
	  var k_s = -0.0894841775 * a - 1.291485548 * b;

	  {
		var l_ = 1 + S * k_l;
		var m_ = 1 + S * k_m;
		var s_ = 1 + S * k_s;

		var l = l_ ** 3;
		var m = m_ ** 3;
		var s = s_ ** 3;

		var l_dS = 3 * k_l * l_ ** 2;
		var m_dS = 3 * k_m * m_ ** 2;
		var s_dS = 3 * k_s * s_ ** 2;

		var l_dS2 = 6 * k_l ** 2 * l_;
		var m_dS2 = 6 * k_m ** 2 * m_;
		var s_dS2 = 6 * k_s ** 2 * s_;

		var f = wl * l + wm * m + ws * s;
		var f1 = wl * l_dS + wm * m_dS + ws * s_dS;
		var f2 = wl * l_dS2 + wm * m_dS2 + ws * s_dS2;

		S = S - (f * f1) / (f1 * f1 - 0.5 * f * f2);
	  }

	  return S;
	}
	
	function lmsToLinearRGBD65(lms) {
	  var [l, m, s, a] = lms;
	  var [r, g, b] = multiply([l ** 3, m ** 3, s ** 3, a], LMS_TO_LINEAR_RGB);
	  return [
		r, // r
		g, // g
		b, // b
		a, // alpha
	  ];
	}

	/**
	 * finds lCusp and cCusp for a given hue
	 * a and b must be normalized so a^2 + b^2 == 1
	 */
	 function findCusp(a, b) {
	  // First, find the maximum saturation (saturation S = C/L)
	  var sCusp = computeMaxSaturation(a, b);

	  // Convert to linear RGB (D65) to find the first point where at least one of r,g or b >= 1:
	  var [R, G, B] = lmsToLinearRGBD65(oklabToLMS([1, sCusp * a, sCusp * b, 1]));
	  var lCusp = cbrt(1 / max(R, G, B));
	  var cCusp = lCusp * sCusp;

	  return { L: lCusp, C: cCusp };
	}
	
	var cbrt = Math.cbrt,
		max = Math.max;
		
	function _array(arr) {
		var a = [arr[0], arr[1], arr[2]];
		if (arr.length > 3)
			a[3] = arr[3];
		return a;
	}
	
	var names = [
		['l', 'r', 'x'],
		['a', 'c', 'g', 'y'],
		['b', 'h', 'z']
	]
	
	function _objToArray(o) {
		var a = [];	
	    var cs;
		names.forEach(function(ns, j) {
			var v;
			var i = 0, n = ns.length;
			for (; i < n; i++) {
				v = o[ns[i]];
				if (v != undefined) {
					a.push(v);
					break;
				}
			}
		})
		cs = colorspace(o);
		v = /lab$/.test(cs) ? o.alpha : (o.alpha == undefined ? o.a : o.alpha);
		if (v != undefined)
			a.push(v);
		return a;
	}
	
	function multiply(color, matrix) {
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
	
	function oklabToLMS(oklab) {
	  return multiply(oklab, OKLAB_TO_LMS);
	}
	
	function oklabTosRGB(oklab) {
		if (isPlainObj(oklab))
			oklab = _objToArray(oklab);
	  var x = lmsToLinearRGBD65(oklabToLMS(oklab));
	  
	  var r = x[0], g = x[1], b = x[2], alpha = x[3]

	  if (r > 1.001 || r < -0.001 || g > 1.001 || g < -0.001 || b > 1.001 || b < -0.001) {
		// “Preserve light, clamp Chroma” method from https://bottosson.github.io/posts/gamutclipping/
		var ε = 0.00001;
		var [l, a, b] = oklab;
		var c = Math.max(ε, Math.sqrt(a ** 2 + b ** 2));
		var lgamut = clamp(l, 0, 1);
		var aNorm = a / c;
		var bNorm = b / c;
		var t = findGamutIntersection(aNorm, bNorm, l, c, lgamut);

		return linearRGBD65TosRGB(
		  lmsToLinearRGBD65(
			oklabToLMS([
			  lgamut * (1 - t) + t * l, // l
			  aNorm * (t * c), // a
			  bNorm * (t * c), // b
			  alpha,
			])
		  )
		);
	  }
	  return linearRGBD65TosRGB([r, g, b, alpha]);
	}
	
	/** 
	 * Converts Linear RGB D65 to sRGB
	 */
	function linearRGBD65TosRGB(rgb) {
	  var $ = rgbFromArgs.call(this, arguments);
	  return {
		colorspace: 'srgb',
		r: sRGBTransfer($.r||$.red||0), // r
		g: sRGBTransfer($.g||$.green||0), // g
		b: sRGBTransfer($.b||$.blue||0), // b
		alpha: $.a // alpha
	  };
	}
	function clamp(x, min, max) {
	  return Math.min(Math.max(x, min), max);
	}
	
	
	function oklchToOklab(oklch) {
		var result = {
			colorspace: 'oklab',
			l: (oklch = arrayFromArgs.call(this, arguments, ['l', 'c', 'h']))[0], // L is still L
			a: oklch[1] * Math.cos(oklch[2] * Math.PI / 180), // a
			b: oklch[1] * Math.sin(oklch[2] * Math.PI / 180)  // b
		};
		if (oklch[3]) {
			result.alpha = oklch[3];
		}
		return result;
	}
	
	function oklchTosRGB(oklch) {
		if (isPlainObj(oklch))
			oklch = _objToArray(oklch);
		return oklabTosRGB(oklchToOklab(oklch));
	}

	/** Linear RGB D65 -> LMS */
	function linearRGBD65ToLMS(lrgb) {
	  var [l, m, s, a] = multiply(lrgb, LINEAR_RGB_TO_LMS);
	  return [
		Math.cbrt(l), // L
		Math.cbrt(m), // M
		Math.cbrt(s), // S
		a, // alpha
	  ];
	}

	/** Linear RGB D65 -> XYZ */
	function linearRGBD65ToXYZ(rgb) {
	  return multiply(rgb, LINEAR_RGB_D65_TO_XYZ);
	}
	
	function colorspace(color) {
		return color.colorspace||color.colorSpace||color.space||color.name||'';
	}
	
	var slice = Array.prototype.slice;
	
	function _getComponents(arr, newArray) {
		var a;
		if (newArray) {
			a = [];
			arr.forEach(function(v) {
				if (typeof v === 'number') {
					a.push(v);
				} else {
					throw new Error('Number expected but found: ' + v);
				}
			})
			return a;
		}
		arr.forEach(function(v) {
			if (typeof v !== 'number') {
				throw new Error('Number expected but found: ' + v);
			}
		})
		return arr;
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
		rgb: [['r', 'red', 'R', 'Red'], ['g', 'green', 'G', 'Green'], ['b', 'blue', 'B', 'Blue']],
		lab: [['l', 'lightness', 'L', 'Lightness'], ['a', 'A'], ['b', 'B'], ['alpha']],
		lch: [['l', 'lightness', 'L', 'Lightness'], ['c', 'C'], ['h', 'hue', 'H', 'Hue']],
		xyz: [['x', 'X'], ['y', 'Y'], ['z', 'Z']],
		hwb: [['h', 'hue', 'H', 'Hue'], ['w', 'whiteness', 'W', 'Whiteness'], ['b', 'brightness', 'B']],
		hsl: [['h', 'hue', 'H', 'Hue'], ['s', 'saturation', 'S', 'Saturation'], ['l', 'lightness', 'L', 'Lightness']],
		hsv: [['h', 'hue', 'H', 'Hue'], ['s', 'saturation', 'S', 'Saturation'], ['v', 'value', 'V', 'Value']],
		hsb: [['h', 'hue', 'H', 'Hue'], ['s', 'saturation', 'S', 'Saturation'], ['b', 'brightness', 'B', 'Brightness']],
		cmyk: [['c', 'cyan', 'C', 'Cyan'], ['m', 'magenta', 'M', 'Magenta'], ['y', 'yellow', 'Y', 'Yellow'], ['k', 'key', 'K', 'Key']],
		cmy: [['c', 'cyan', 'C', 'Cyan'], ['m', 'magenta', 'M', 'Magenta'], ['y', 'yellow', 'Y', 'Yellow']]
	}
	
	function __getCs($) {
		var i, v, j, n, a, k, l, count;
		var found;
		var name;
		var cs = colorSpace($);
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
					if (v != undefined) {
						found++;
						break;
					}
				}
			}
			if (found === l)
				return name;
		}
		throw new Error('Incorrect color matrix arguments');
	}
	
	function _setArrayComps(self, arr) {
		var $ = arr[0];
		if (typeof $ === 'string') {
			self.__colorspace = $; //set the color space
			arr.splice(0, 1); //remove the color space
		} else {
			self.__colorspace = 'rgb';
		}
		if (arr.length === 1) {
			if (isArray($ = arr[0])) {
				self.__components = _getComponents($, true);
			} else if (isPlainObj($)) {
				self.__colorspace = __getCs($);
				self.__components = _getComponents(_objToArray($));
			}
		} else {
			self.__components = _getComponents(arr);
		}
	}
	
	function round(number, precision) {
	  var factor = Math.pow(10, precision == undefined ? 2 : precision);
	  return Math.round(number * factor) / factor;
	}
	
	
	var A98_TO_XYX65 = [
			[0.5766690429101305, 0.1855582379065463, 0.1882286462349947],
			[0.297344975250536, 0.6273635662554661, 0.0752914584939979],
			[0.0270313613864123, 0.0706888525358272,0.9913375368376386]
	];
	/**
	 * 
	 * @param {Array|Object} a98
	 * @return {Array}
	 */
	function a98ToXyz65(a98) {
		function linearize(v) {
			return Math.pow(Math.abs(v), 563 / 256) * Math.sign(v);
		}
		if (typeof a98 === 'number') {
			a98 = slice.call(arguments);
		} else if (isPlainObj(a98)) {
			a98 = [a98.r, a98.g, a98.b, a98.a == undefined ? a98.alpha : a98.a];
		}
		var res = multiply([linearize(a98[0]), linearize(a98[1]), linearize(a98[2])], A98_TO_XYX65);
		if (a98[3] != undefined) {
			res[3] = a98[3];
		}
		return res;
	}
	
	/**
	 * 
	 * @param {Array|Object} $
	 * @return {Object}
	 */
	function xyz65ToA98($) {
		function gamma(v) {
			return Math.pow(Math.abs(v), 256 / 563) * Math.sign(v);
		}
		var x, y, z, a, res;
		x = slice.call(arguments);
		if (isArray($)) {
			x =  $;
		}
		
		if (isPlainObj($)) {
			x = $.x;
			y = $.y;
			z = $.z;
			a = $.alpha == undefined ? $.a : $.alpha;
		} else {
			y = x[1];
			z = x[2];
			a = x[3];
			x = x[0];
		}
		res = {
			colorspace: 'a98-rgb',
			r: gamma(
				x * 2.0415879038107465 -
					y * 0.5650069742788597 -
					0.3447313507783297 * z
			),
			g: gamma(
				x * -0.9692436362808798 +
					y * 1.8759675015077206 +
					0.0415550574071756 * z
			),
			b: gamma(
				x * 0.0134442806320312 -
					y * 0.1183623922310184 +
					1.0151749943912058 * z
			)
		};
		if (a != undefined) {
			res.alpha = a;
		}
		return res;
	}
	/*
		Convert sRGB values to CIE XYZ D65

		References:
			* https://drafts.csswg.org/css-color/#color-conversion-code
			* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
			* https://observablehq.com/@danburzo/color-matrix-calculator
	*/
	/**
	 * Converts sRGB color to CIE XYZ D65 color
	 * @memberOf SereniX.ColorMatrix
	 * @param {Object|Array} rgb
	 * @returns {Object}
	 */
	function srgbToXyz65(rgb) {
		var r, g, b, a, res
		rgb = rgbToLrgb.apply(this, arguments);
		r = rgb.r;
		g = rgb.g;
		b = rgb.b;
		a = rgb.alpha != undefined ? rgb.alpha : rgb.a;
		res = {
			colorspace: 'xyz-d65',
			x:
				0.4123907992659593 * r +
				0.357584339383878 * g +
				0.1804807884018343 * b,
			y:
				0.2126390058715102 * r +
				0.715168678767756 * g +
				0.0721923153607337 * b,
			z:
				0.0193308187155918 * r +
				0.119194779794626 * g +
				0.9505321522496607 * b
		};
		if (a !== undefined) {
			res.alpha = a;
		}
		return res;
	};
	
	var rgbToXyz65 = srgbToXyz65;
	/*
		Chromatic adaptation of CIE XYZ from D50 to D65 white point
		using the Bradford method.

		References:
			* https://drafts.csswg.org/css-color/#color-conversion-code
			* http://www.brucelindbloom.com/index.html?Eqn_ChromAdapt.html	
	*/
	/**
	 * Converts CIE XYZ D50 color to CIE XYZ D65 color
	 * @memberOf SereniX.ColorMatrix
	 * @param {Object|Array} rgb
	 * @returns {Object}
	 */
	function xyz50ToXyz65(xyz50) {
		var x, y, z, a, res;
		x = slice.call(arguments);
		if (isArray(xyz50)) {
			x =  xyz50;
		}
		
		if (isPlainObj(xyz50)) {
			x = xyz50.x;
			y = xyz50.y;
			z = xyz50.z;
			a = xyz50.a == undefined ? xyz50.alpha : xyz50.a;
		} else {
			y = x[1];
			z = x[2];
			a = x[3];
			x = x[0];
		}
		res = {
			colorspace: 'xyz-d65',
			x:
				0.9554734527042182 * x -
				0.0230985368742614 * y +
				0.0632593086610217 * z,
			y:
				-0.0283697069632081 * x +
				1.0099954580058226 * y +
				0.021041398966943 * z,
			z:
				0.0123140016883199 * x -
				0.0205076964334779 * y +
				1.3303659366080753 * z
		};
		if (a !== undefined) {
			res.alpha = a;
		}
		return res;
	}

	/*
		CIE XYZ D65 values to sRGB.

		References:
			* https://drafts.csswg.org/css-color/#color-conversion-code
			* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
			* https://observablehq.com/@danburzo/color-matrix-calculator
	*/
	/**
	 * Converts CIE XYZ D65 color to sRGB color
	 * @memberOf SereniX.ColorMatrix
	 * @param {Object|Array} rgb
	 * @returns {Object}
	 */
	function xyz65TosRgb($) {
		var x, y, z, a, res;
		x = slice.call(arguments);
		if (isArray($)) {
			x =  $;
		}
		
		if (isPlainObj($)) {
			x = $.x;
			y = $.y;
			z = $.z;
			a = $.a == undefined ? $.alpha : $.a;
		} else {
			y = x[1];
			z = x[2];
			a = x[3];
			x = x[0];
		}
		res = lrgbToRgb({
			colorspace: 'srgb',
			r:
				x * 3.2409699419045226 -
				y * 1.5373831775700939 -
				0.4986107602930034 * z,
			g:
				x * -0.9692436362808796 +
				y * 1.8759675015077204 +
				0.0415550574071756 * z,
			b:
				x * 0.0556300796969936 -
				y * 0.2039769588889765 +
				1.0569715142428784 * z
		});
		if (a !== undefined) {
			res.alpha = a;
		}
		return res;
	}

	/*
		Chromatic adaptation of CIE XYZ from D65 to D50 white point
		using the Bradford method.

		References:
			* https://drafts.csswg.org/css-color/#color-conversion-code
			* http://www.brucelindbloom.com/index.html?Eqn_ChromAdapt.html	
	*/
	/**
	 * Converts CIE XYZ D65 color to CIE XYZ D50 color
	 * @memberOf SereniX.ColorMatrix
	 * @param {Object|Array} rgb
	 * @returns {Object}
	 */
	function xyz65ToXyz50(xyz65) {
		var x, y, z, a, res;
		x = slice.call(arguments);
		if (isArray(xyz65)) {
			x =  xyz65;
		}
		
		if (isPlainObj(xyz65)) {
			x = xyz65.x;
			y = xyz65.y;
			z = xyz65.z;
			a = xyz65.a == undefined ? xyz65.alpha : xyz65.a;
		} else {
			y = x[1];
			z = x[2];
			a = x[3];
			x = x[0];
		}
		var res = {
			colorspace: 'xyz-d50',
			x:
				1.0479298208405488 * x +
				0.0229467933410191 * y -
				0.0501922295431356 * z,
			y:
				0.0296278156881593 * x +
				0.990434484573249 * y -
				0.0170738250293851 * z,
			z:
				-0.0092430581525912 * x +
				0.0150551448965779 * y +
				0.7518742899580008 * z
		};
		if (a !== undefined) {
			res.alpha = a;
		}
		return res;
	}

	function lrgbToRgb($, cs) {
		var r, g, b, a, res;
		x = slice.call(arguments);
		if (isArray($)) {
			x =  $;
		}
		
		if (isPlainObj($)) {
			r = $.r;
			g = $.g;
			b = $.b;
			a = $.a == undefined ? $.alpha : $.a;
			cs = cs||$.space||$.colorspace||$.colorSpace||$.cs||$.mode;
		} else {
			cs = cs||x[4];
			g = x[1];
			b = x[2];
			a = x[3];
			r = x[0];
		}
		function fn(c) {
			var abs = Math.abs(c);
			if (abs > 0.0031308) {
				return (Math.sign(c) || 1) * (1.055 * Math.pow(abs, 1 / 2.4) - 0.055);
			}
			return c * 12.92;
		}
		cs = cs||'srgb';
		res = {
			colorspace: cs,
			r: fn(r),
			g: fn(g),
			b: fn(b)
		};
		if (a !== undefined) res.alpha = a;
		return res;
	}



	function rgbToLrgb($) {
		var r, g, b, a, res;
		var x = slice.call(arguments);
		if (isArray($)) {
			x =  $;
		}
		
		if (isPlainObj($)) {
			r = $.r;
			g = $.g;
			b = $.b;
			a = $.a == undefined ? $.alpha : $.a;
		} else {
			g = x[1];
			b = x[2];
			a = x[3];
			r = x[0];
		}
		function fn(c) {
			var abs = Math.abs(c);
			if (abs < 0.04045) {
				return c / 12.92;
			}
			return (Math.sign(c) || 1) * Math.pow((abs + 0.055) / 1.055, 2.4);
		}
		var res = {
			colorspace: 'srgb-linear',
			r: fn(r),
			g: fn(g),
			b: fn(b)
		};
		if (a !== undefined) res.alpha = a;
		return res;
	}
	
	var srgbToLrgb = rgbToLrgb;
	
	function xyz65ToP3() {
		var x, y, y, a, res;
		var $ = slice.call(arguments);
		if (isArray($)) {
			$ =  $;
		}
		
		if (isPlainObj($)) {
			x = $.x;
			y = $.y;
			z = $.z;
			a = $.a == undefined ? $.alpha : $.a;
		} else {
			y = $[1];
			z = $[2];
			a = $[3];
			x = $[0];
		}
		res = lrgbToRgb(
			{
				r:
					x * 2.4934969119414263 -
					y * 0.9313836179191242 -
					0.402710784450717 * z,
				g:
					x * -0.8294889695615749 +
					y * 1.7626640603183465 +
					0.0236246858419436 * z,
				b:
					x * 0.0358458302437845 -
					y * 0.0761723892680418 +
					0.9568845240076871 * z
			},
			'display-p3'
		);
		if (a !== undefined) {
			res.alpha = a;
		}
		return res;
	};
	
	function p3ToXyz65(rgb) {
		var res;
		var r, g, g, a;
		rgb = rgbToLrgb.apply(this, arguments);
		r = rgb.r;
		g = rgb.g;
		b = rgb.b;
		res = {
			colorspace: 'xyz-d65',
			x:
				0.486570948648216 * r +
				0.265667693169093 * g +
				0.1982172852343625 * b,
			y:
				0.2289745640697487 * r +
				0.6917385218365062 * g +
				0.079286914093745 * b,
			z: 0.0 * r + 0.0451133818589026 * g + 1.043944368900976 * b
		};
		if (a !== undefined) {
			res.alpha = a;
		}
		return res;
	};
	
	
	/*
		Convert ProPhoto RGB values to CIE XYZ D50

		References:
			* https://drafts.csswg.org/css-color/#color-conversion-code
			* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
	*/

	function prophotoToXyz50($) {
		var r, g, b, a;
		function linearize(v) {
			var abs = Math.abs(v);
			if (abs >= 16 / 512) {
				return Math.sign(v) * Math.pow(abs, 1.8);
			}
			return v / 16;
		}
		$ = rgbFromArgs.call(this, arguments);
		r = linearize($.r);
		g = linearize($.g);
		b = linearize($.b);
		a = $.alpha != undefined ? $.alpha : $.a;
		res = {
			colorspace: 'xyz-d50',
			x:
				0.7977666449006423 * r +
				0.1351812974005331 * g +
				0.0313477341283922 * b,
			y:
				0.2880748288194013 * r +
				0.7118352342418731 * g +
				0.0000899369387256 * b,
			z: 0 * r + 0 * g + 0.8251046025104602 * b
		};
		if (a !== undefined) {
			res.alpha = a;
		}
		return res;
	};
	
	
	function prophotoToXyz65($) {
		return xyz50ToXyz65(prophotoToXyz50.apply(this, arguments))
	}
	/*
		Convert CIE XYZ D50 values to ProPhoto RGB

		References:
			* https://drafts.csswg.org/css-color/#color-conversion-code
			* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
	*/

	function xyz50ToProphoto($) {
		var x, y, z, a, res;
		function gamma(v) {
			var abs = Math.abs(v);
			if (abs >= 1 / 512) {
				return Math.sign(v) * Math.pow(abs, 1 / 1.8);
			}
			return 16 * v;
		};
		$ = xyzFromArgs.call(this, arguments);
		a = $.alpha == undefined ? $.a : $.alpha;
		x =  $.x;
		y = $.y;
		z = $.z;
		res = {
			colorspace: 'prophoto-rgb',
			r: gamma(
				x * 1.3457868816471585 -
					y * 0.2555720873797946 -
					0.0511018649755453 * z
			),
			g: gamma(
				x * -0.5446307051249019 +
					y * 1.5082477428451466 +
					0.0205274474364214 * z
			),
			b: gamma(x * 0.0 + y * 0.0 + 1.2119675456389452 * z)
		};
		if (a !== undefined) {
			res.alpha = a;
		}
		return res;
	};
	
	
	var rec2020ToXyz65;
	var xyz65ToRec2020;

	(function() {

		/*
			Convert Rec. 2020 values to CIE XYZ D65

			References:
				* https://drafts.csswg.org/css-color/#color-conversion-code
				* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
				* https://www.itu.int/rec/R-REC-BT.2020/en
		*/

		var ALPHA = 1.09929682680944;
		var BETA = 0.018053968510807;



		rec2020ToXyz65 = function rec2020ToXyz65(rec2020) {
			function linearize(v) {
				var abs = Math.abs(v);
				if (abs < BETA * 4.5) {
					return v / 4.5;
				}
				return (Math.sign(v) || 1) * Math.pow((abs + ALPHA - 1) / ALPHA, 1 / 0.45);
			};
			
			var r = linearize((rec2020 = rgbFromArgs.call(this, arguments)).r);
			var g = linearize(rec2020.g);
			var b = linearize(rec2020.b);
			var a = rec2020.alpha != undefined ? rec2020.alpha : rec2020.a;
			var res = {
				mode: 'xyz65',
				x:
					0.6369580483012911 * r +
					0.1446169035862083 * g +
					0.1688809751641721 * b,
				y:
					0.262700212011267 * r +
					0.6779980715188708 * g +
					0.059301716469862 * b,
				z: 0 * r + 0.0280726930490874 * g + 1.0609850577107909 * b
			};
			if (a !== undefined) {
				res.alpha = a;
			}
			return res;
		};

		/*
			Convert CIE XYZ D65 values to Rec. 2020

			References:
				* https://drafts.csswg.org/css-color/#color-conversion-code
				* http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
				* https://www.itu.int/rec/R-REC-BT.2020/en
		*/



		xyz65ToRec2020 = function xyz65ToRec2020($) {
			var x, y, z, a, res;
			function gamma(v) {
				var abs = Math.abs(v);
				if (abs > BETA) {
					return (Math.sign(v) || 1) * (ALPHA * Math.pow(abs, 0.45) - (ALPHA - 1));
				}
				return 4.5 * v;
			};
			
			x = arrayFromArgs.call(this, arguments);
			y = x[1]
			z = x[2]
			a = x[3]
			x = x[0]

			res = {
				mode: 'rec2020',
				r: gamma(
					x * 1.7166511879712683 -
						y * 0.3556707837763925 -
						0.2533662813736599 * z
				),
				g: gamma(
					x * -0.6666843518324893 +
						y * 1.6164812366349395 +
						0.0157685458139111 * z
				),
				b: gamma(
					x * 0.0176398574453108 -
						y * 0.0427706132578085 +
						0.9421031212354739 * z
				)
			};
			if (a !== undefined) {
				res.alpha = a;
			}
			return res;
		};
		
	})();
	
	
	var COLOR_SPACE_KEYS = {
		'a98-rgb': 'a98',
		'srgb-linear': 'lrgb',
		'xyz-d65': 'xyz65',
		'xyz-d50': 'xyz50',
		'display-p3': 'p3',
		'prophoto-rgb': 'prophoto'
	};
	
	
	
	
	function ColorMatrix($) {
		var args = slice.call(arguments);
		var cs;
		if (isArray($)) {
			_setArrayComps(this, $);
		} else if (isPlainObj($)) {
			this.__components = _getComponents(_objToArray($));
		} else if (args.length > 1) {
			_setArrayComps(this, args);
			this.__components = _getComponents(args);
		}
	}
	
	var CM = ColorMatrix;
	
	var p = CM.prototype;
	
	CM.__CLASS__ = p.__CLASS__ = CM;
	
	CM.__CLASS_NAME__ = p.__CLASS_NAME__ = 'ColorMatrix';
	
	CM.__NAMESPACE_NAME__ = 'SereniX';
	
	CM.__ALIAS_NAMES__ = ['CM'];
	
	CM.round = round;
	
	CM.COLOR_SPACE_KEYS;
	
	function _csKey(cs) {
		return cs.replace(/[ \t-]+([a-zA-Z])?/g, function($0, $1) {
			return $1 ? $1.toUpperCase() : '';
		})
	}
	
	function toXyz65($, cs) {
		var key, _key, fn;
		cs = cs||colorspace($);
		if (cs) {
			key = COLOR_SPACE_KEYS[cs];
			_key = _csKey(cs);
			fn = key ? CM[key + 'ToXyz65']||CM[key + 'ToXyzD65']||CM[_key + 'ToXyz65']||CM[_key + 'ToXyzD65'] : CM[_key + 'ToXyz65']||CM[_key + 'ToXyzD65'];
			if (fn) {
				return fn.call(CM, $)
			}
		}
	}
	
	CM.toXyz65 = toXyz65;
	CM.toXyzD65 = toXyz65;
	CM.toXyzd65 = toXyz65;
	
	p.getColorspace = function() {
		return this.__colorspace;
	}
	
	p.setColorspace = function(cs) {
		return this.__colorspace = cs;
		return this;
	}
	
	p.getComponents = function() {
		return this.__components;
	}
	
	p.setComponents = function(components) {
		this.__components = _getComponents(components);
		return this;
	}
	
	p.getAlpha = function() {
		return  this.__components[3];
	}
	
	p.setAlpha = function(alpha) {
		var t = typeof alpha;
		var m, a;
		if (t === 'number') {
			if (alpha < 0 || alpha > 1)
				throw new Error('Out of bounds alpha channel\'s value: ' + alpha)
			this.__components[3] = alpha;
			return this;
		} else if (t === 'string') {
			if ((m = /^(\d+(?:\.\d+)?)(%)?|(\.\d+)$/.exec(alpha))) {
				a = m[1] ? parseFloat(m[1], 10)/(m[2] ? 100 : 1) : parseFloat(m[3], 10);
				if (a < 0 || a > 1)
					throw new Error('Alpha channel\'s invali string  value: ' + alpha)
				this.__components[3] = a;
				return this;
			}
		}
		throw new Error('Incorrect argument');
	}
	
	function _noComponent(cs) {
		switch (cs||'') {
			case 'rgb':
			case 'rgba':
			case '':
				return 'rgb()';
			case 'lab':
			case 'lch':
			case 'oklab':
			case 'oklch':
				return cs + '()'
			default:
				return 'color(' + cs + ')'
		}
	}
	
	p.toString = function() {
	  var comps = this.__components;
	  var x, y, z, a, alphaSlash;
	  if (!comps) {
		  return _noComponent(this.__colorspace);
	  }
	  x = comps[0];
	  y = comps[1];
	  z = comps[2];
	  a = comps[3];
	  alphaSlash = a < 1 ? '/' + round(a, 5) : '';

	  // note: JavaScript abbreviates anything > 6 decimal places as 1e-7, etc.

	  switch (this.__colorspace) {
		case 'rgb':
		case 'rgba':
		case '': {
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
		case 'lab':
		case 'lch': { 
		  return colorSpace + '(' + round(x, 6) + '% ' + round(y, 6) + ' ' + round(z, 6) + alphaSlash + ')';
		}
		case 'oklab':
		case 'oklch': { //example: oklab(54.0% -0.10 -0.02)
		  return colorSpace + '(' + round(x * 100, 6) + '% ' + round(y, 6) + ' ' + round(z, 6) + alphaSlash + ')';
		}		
		default: // color(display-p3 0.4 0.2 0.6)
				// color(xyz-d65 0.4 0.2 0.6)
		  return 'color(' + colorSpace + ' '+ round(x, 6) + ' '+ round(y, 6) + ' '+ round(z, 6) + alphaSlash + ')';
	  }
	}
	
	function _prop(p) {
		p.configurable = true;
		p.enumerable = true;
		return p;
	}
	Object.defineProperties(p, {
		colorspace: _prop({
			name: 'colorspace',
			get: p.getColorspace,
			set: p.setColorspace
		}),
		alpha: _prop({
			name: 'alpha',
			get: p.getAlpha,
			set: p.setAlpha
		}),
		components: _prop({
			name: 'components',
			get: p.getComponents,
			set: p.setComponents
		})
		,
		values: _prop({
			name: 'values',
			aliasOf: 'components',
			get: p.getComponents,
			set: p.setComponents
		})
	});
	
	
	/*export default xyz65ToXyz50;
	export default xyz65TosRgb;
	export default rgbToXyz65;*/
	
	
	/**
	 * Returns the color space of the given color.
	 * @static
	 * @memberOf SereniX.ColorMatrix
	 * @param {Object} color
	 * @return {String}
	 */
	CM.colorspace = colorspace;
	/**
	 * Returns the color space of the given color. SereniX.ColorMatrix.cs is an alias of SereniX.ColorMatrix.colorspace.
	 * @static
	 * @memberOf SereniX.ColorMatrix
	 * @param {Object} color
	 * @return {String}
	 */
	CM.cs = colorspace;
	
	CM.findGamutIntersection =  findGamutIntersection;
	
	CM.multiply = multiply;
	
	CM.oklabTosRGB = oklabTosRGB;
	
	CM.oklchTosRGB = oklchTosRGB;
	
	CM.oklabTosRgb = oklabTosRGB;
	
	CM.oklchTosRgb = oklchTosRGB;
	
	CM.oklchToOklab = oklchToOklab;
	
	CM.linearRGBD65ToXYZ = linearRGBD65ToXYZ;
	
	CM.linearRGBD65ToLMS = linearRGBD65ToLMS;
	
	CM.xyz65TosRgb = xyz65TosRgb;
	CM.xyz65ToSRgb = xyz65TosRgb;
	CM.xyz65ToSrgb = xyz65TosRgb;
	CM.xyz65ToSRGB = xyz65TosRgb;
	
	CM.a98ToXyz65 = a98ToXyz65
	CM.xyz65ToA98 = xyz65ToA98
	CM.a98RgbToXyz65 = a98ToXyz65
	CM.a98RgbToXyzD65 = a98ToXyz65
	CM.a98RgbToXyzd65 = a98ToXyz65
	CM.xyz65ToA98Rgb = xyz65ToA98
	
	CM.srgbToXyz65 = srgbToXyz65;
	CM.srgbToXyzD65 = srgbToXyz65;
	CM.srgbToXyzd65 = srgbToXyz65;
	
	CM.rgbToXyz65 = rgbToXyz65
	CM.xyz50ToXyz65 = xyz50ToXyz65
	CM.rgbToXyzD65 = rgbToXyz65
	CM.xyz50ToXyz65 = xyz50ToXyz65
	CM.rgbToXyzd65 = rgbToXyz65
	CM.xyz50ToXyzd65 = xyz50ToXyz65
	CM.xyz65TosRgb = xyz65TosRgb
	CM.xyz65ToXyz50 = xyz65ToXyz50
	CM.lrgbToRgb = lrgbToRgb
	CM.rgbToLrgb = rgbToLrgb 
	CM.p3ToXyz65 = p3ToXyz65
	CM.xyz65ToP3 = xyz65ToP3
	CM.rec2020ToXyz65 = rec2020ToXyz65;
	CM.xyz65ToRec2020 = xyz65ToRec2020;
	
	CM.rec2020ToXyzD65 = rec2020ToXyz65;
	CM.xyzD65ToRec2020 = xyz65ToRec2020;
	CM.rec2020ToXyzd65 = rec2020ToXyz65;
	CM.xyzd65ToRec2020 = xyz65ToRec2020;
	
	
	CM.displayP3ToXyz65 = p3ToXyz65
	CM.xyz65ToDisplayP3 = xyz65ToP3	
	CM.p3ToXyzd65 = p3ToXyz65
	CM.xyzd65ToP3 = xyz65ToP3
	CM.displayP3ToXyzd65 = p3ToXyz65
	CM.xyzd65ToDisplayP3 = xyz65ToP3	
	CM.p3ToXyzD65 = p3ToXyz65
	CM.xyzD65ToP3 = xyz65ToP3
	CM.displayP3ToXyzD65 = p3ToXyz65
	CM.xyzD65ToDisplayP3 = xyz65ToP3
	
	CM.prophotoToXyz50 = prophotoToXyz50;
	CM.xyz50ToProphoto = xyz50ToProphoto;
	CM.prophotoToXyz65 = prophotoToXyz65;
	CM.prophotoToXyzD65 = prophotoToXyz65;
	CM.prophotoToXyzs65 = prophotoToXyz65;
	
	CM.arrayFromArgs = arrayFromArgs;
	
	CM.rgbFromArgs = rgbFromArgs;
	
	CM.xyzFromArgs = xyzFromArgs;
	
	CM.srgbToLrgb = srgbToLrgb;
	
	
	
	var lrgbTosRgb = lrgbToRgb;
	
	CM.lrgbTosRgb = lrgbTosRgb;
	CM.lrgbToSRgb = lrgbTosRgb;
	CM.lrgbTosRGB = lrgbTosRgb;
	CM.lrgbTosrgb = lrgbTosRgb;
	CM.lrgbToSRGB = lrgbTosRgb;
	
	
	if (SereniX.addChild) {
		SereniX.addChild(CM);
	} else {
		SereniX.ColorMatrix = CM;
	}
	
	
	/*--------------------------------------------*/
	/*           CssColorUtils extension          */
	/*--------------------------------------------*/
	
	var CCU;
	//if serenix_css_color_utils.js loaded before this file, extends SereniX.CssColorUtils
	//and also exports CssColorUtils static methods to ColorMatrix.
	if ((CCU = SereniX.CssColorUtils)) {	
		CCU.oklabTosRGB = oklabTosRGB;
		CCU.oklchTosRGB = oklchTosRGB;
		CCU.oklabToSRGB = oklabTosRGB;
		CCU.oklchToSRGB = oklchTosRGB;
		
		CCU.oklabToSRGB = oklabTosRGB;
		CCU.oklchToSRGB = oklchTosRGB;
		CCU.oklabToSRgb = oklabTosRGB;
		CCU.oklchToSRgb = oklchTosRGB;
		CCU.oklabToSrgb = oklabTosRGB;
		CCU.oklchToSrgb = oklchTosRGB;
		
		CCU.srgbToLrgb = srgbToLrgb;
		CCU.lrgbTosRgb = lrgbTosRgb
		CCU.lrgbToSRgb = lrgbTosRgb
		CCU.lrgbToSrgb = lrgbTosRgb
		CCU.lrgbToSRGB = lrgbTosRgb;
		
		CCU.srgbToXyz65 = srgbToXyz65;
		CCU.srgbToXyzD65 = srgbToXyz65;
		CCU.srgbToXyzd65 = srgbToXyz65;
		
		CCU.toXyz65 = toXyz65;
		
		CCU.toXyzD65 = toXyz65;
		
		CCU.toXyzd65 = toXyz65;
		
		/*-----------------------------------------------------------*/
		/*     Exports CssColorUtils static methods to ColorMatrix   */
		/*-----------------------------------------------------------*/
		CM.rgbToSRgb = CM.rgbToSRgb;
		
		CM.rgbToSrgb = CM.rgbToSRgb;
		CM.rgbToSRGB = CM.rgbToSRgb;
	
		CM.srgbToRgb = CM.srgbToRgb;
		
		CM.srgbToRgbSys = CM.srgbToRgbSys;
		
		CM.prophotoToXyz50 = prophotoToXyz50;
		CM.xyz50ToProphoto = xyz50ToProphoto;
		CM.prophotoToXyz65 = prophotoToXyz65;
		CM.prophotoToXyzD65 = prophotoToXyz65;
		CM.prophotoToXyzs65 = prophotoToXyz65;
		
		
		CM.supportsLch = CCU.supportsLch;	
		CM.supportsLab = CCU.supportsLab;
		/**
		 * Supports LAB color with a and/or b values with percent?
		 * @static
		 * @property {Boolean} supportsPercentABLab
		 */
		CM.supportsPercentABLab = CCU.supportsPercentABLab;
		/**
		 * Supports LCH color with a and/or b values with percent?
		 * @static
		 * @property {Boolean} supportsPercentABLab
		 */
		CM.supportsPercentCHLch = CCU.supportsPercentCHLch
		
		/**
		 * Supports OKLCH color?
		 * @static
		 * @property {Boolean} supportsOKLch
		 */
		CM.supportsOKLch = CCU.supportsOKLch;
		/**
		 * Supports OKLAB color?
		 * @static
		 * @property {Boolean} supportsOKLab
		 */
		CM.supportsOKLab = CCU.supportsOKLab;
		/**
		 * Supports OKLAB color with a and/or b values with percent?
		 * @static
		 * @property {Boolean} supportsPercentABOKLab
		 */
		CM.supportsPercentABOKLab = CCU.supportsPercentABOKLab;
		/**
		 * Supports OKLCH color with a and/or b values with percent?
		 * @static
		 * @property {Boolean} supportsPercentCHOKLch
		 */
		CM.supportsPercentCHOKLch = CCU.supportsPercentCHOKLch
	}
	
	return (SereniX.CM = CM);
});

var findGamutIntersection = ColorMatrix.findGamutIntersection;
