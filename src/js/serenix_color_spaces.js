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
		return { color: {}}
	});
} else if (!SereniX.color) {
	if ((typeof SereniX.Namespace === 'function') && (typeof SereniX.Namespace.ns === 'function')) {
		SereniX.Namespace.ns('SereniX.color');
	} else {
		SereniX.color = {};
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
})(this, 'ColorSpaces', function() {
	var spaces =  {
		hwb: { 
			components: [ 'Hue', 'Whiteness', 'Blackness' ],
			fields: [ 'h', 'w', 'b' ],
			values: {
				Hue: { min: 0, max: 360, unit: 'deg', symbol: '°' },
				Whiteness: { min: 0, max: 100, unit: '%' },
				Blackness: { min: 0, max: 100, unit: '%' }
			}
		},
		hsl: { 
			components: [ 'Hue', 'Saturation', 'Lightness' ],
			fields: [ 'h', 's', 'l' ],
			values: {
				Hue: { min: 0, max: 360, unit: 'deg', symbol: '°' },
				Saturation: { min: 0, max: 100, unit: '%' },
				Lightness: { min: 0, max: 100, unit: '%' }
			}
		},
		hsv: { 
			components: [ 'Hue', 'Saturation', 'Value' ],
			fields: [ 'h', 's', 'v' ],
			values: {
				Hue: { min: 0, max: 360, unit: 'deg', symbol: '°' },
				Saturation: { min: 0, max: 100, unit: '%' },
				Value: { min: 0, max: 100, unit: '%' }
			}
		},
		hsb: { 
			components: [ 'Hue', 'Saturation', 'Brightness' ],
			fields: [ 'h', 's', 'b' ],
			values: {
				Hue: { min: 0, max: 360, unit: 'deg', symbol: '°' },
				Saturation: { min: 0, max: 100, unit: '%' },
				Brightness: { min: 0, max: 100, unit: '%' }
			}
		},
		rgb: {
			components: [ 'Red', 'Green', 'Blue' ],
			fields: [ 'r', 'g', 'b' ],
			values: {
				Red: { min: 0, max: 255, unit: '' },
				Green: { min: 0, max: 255, unit: '' },
				Blue: { min: 0, max: 255, unit: '' }
			}
		},
		yuv: {
			components: [ 'Y', 'U', 'V' ],
			values: {
				Y: { min: 0, max: 100, unit: '%' }, //Brightness
				U: { min: -0.5, max: 0.5, unit: '' }, //Chrominance
				V: { min: -0.5, max: 0.5, unit: '' } //Chrominance
			},
			allowAlpha: false
		},
		cmyk: {
			components: [ 'Cyan', 'Magenta', 'Yellow', 'Key' ],
			fields: [ 'c', 'm', 'y', 'k' ],
			values: { 
				'Cyan': { min: 0, max: 100, unit: '%'},
				'Magenta': { min: 0, max: 100, unit: '%'},
				'Yellow': { min: 0, max: 100, unit: '%'},
				'Key': { min: 0, max: 100, unit: '%'}
			}
		},
		cmy: {
			components: [ 'Cyan', 'Magenta', 'Yellow'],
			fields: [ 'c', 'm', 'y' ],
			values: { 
				'Cyan': { min: 0, max: 100, unit: '%'},
				'Magenta': { min: 0, max: 100, unit: '%'},
				'Yellow': { min: 0, max: 100, unit: '%'}
			}
		},
		lab: {
			name: 'lab',
			components: [ 'Lightness', 'a', 'b' ],
			fields: [ 'l', 'a', 'b' ],
			aliases: [ 'l', 'a', 'b' ],
			values: { 
				'Lightness': { min: 0, max: 100, unit: '%'}, //can go up to 400% for extra whites
				'a': { min: -100, max: 100, unit: ''},
				'b': { min: -100, max: 100, unit: ''}
			},
			/*
			 <p>The second and third arguments are the distances along the "a" and "b" axes in the Lab color space, as described in the previous section. These values are signed (allow both positive and negative values) and theoretically unbounded (but in practice do not exceed ±160).</p>
			 <p>source: https://www.w3.org/TR/css-color-4/#cie-lab</p>
			 */
			unbounded: {
				a: { max: true, min: true },
				b: { max: true, min: true }
			}
		},
		lab100: { //specific lab wcolorspace ith a and b axes bounded from -100 to +100.
			name: 'lab',
			components: [ 'Lightness', 'a', 'b' ],
			fields: [ 'l', 'a', 'b' ],
			aliases: [ 'l', 'a', 'b' ],
			values: { 
				'Lightness': { min: 0, max: 100, unit: '%'}, //can go up to 400% for extra whites
				'a': { min: -100, max: 100, unit: ''},
				'b': { min: -100, max: 100, unit: ''}
			},
			/*
			 <p>The second and third arguments are the distances along the "a" and "b" axes in the Lab color space, as described in the previous section. These values are signed (allow both positive and negative values) and theoretically unbounded (but in practice do not exceed ±160).</p>
			 <p>source: https://www.w3.org/TR/css-color-4/#cie-lab</p>
			 */
			unbounded: {
				a: { max: true, min: true },
				b: { max: true, min: true }
			}
		},
		lab160: { //specific lab wcolorspace ith a and b axes bounded from -160 to +160.
			name: 'lab',
			components: [ 'Lightness', 'a', 'b' ],
			fields: [ 'l', 'a', 'b' ],
			aliases: [ 'l', 'a', 'b' ],
			values: { 
				'Lightness': { min: 0, max: 100, unit: '%'}, //can go up to 400% for extra whites
				'a': { min: -160, max: 160, unit: ''},
				'b': { min: -160, max: 160, unit: ''}
			},
			/*
			 <p>The second and third arguments are the distances along the "a" and "b" axes in the Lab color space, as described in the previous section. These values are signed (allow both positive and negative values) and theoretically unbounded (but in practice do not exceed ±160).</p>
			 <p>source: https://www.w3.org/TR/css-color-4/#cie-lab</p>
			 */
			unbounded: {
				a: { max: true, min: true },
				b: { max: true, min: true }
			}
		},
		lch: {
			name: 'lch',
			components: [ 'Lightness', 'Chroma', 'Hue' ],
			fields: [ 'l', 'c', 'h' ],
			aliases: [ 'l', 'c', 'h' ],
			values: { 
				'Lightness': { min: 0, max: 100, unit: '%'},
				'Chroma': { min: 0, max: 230, unit: ''}, //theoriticaly unbounded max but in practice bounded to 230
				'Hue': { min: 0, max: 360, unit: 'deg', symbol: '°'}
			},
			unbounded: {
				Chroma: { max: true, min: false }
			}
		},
		oklab: {
			name: 'oklab',
			components: [ 'Lightness', 'a', 'b' ],
			fields: [ 'l', 'a', 'b' ],
			aliases: [ 'l', 'a', 'b' ],
			values: { 
				'Lightness': { min: 0, max: 1, unit: '%', displayMultiplicator: 100}, //can go up to 400% for extra whites
				'a': { min: -0.5, max: 0.5, unit: '', step: 0.01},
				'b': { min: -0.5, max: 0.5, unit: '', step: 0.01}
			},
			/*
			 <p>The second and third arguments are the distances along the "a" and "b" axes in the Lab color space, as described in the previous section. These values are signed (allow both positive and negative values) and theoretically unbounded (but in practice do not exceed ±160).</p>
			 <p>source: https://www.w3.org/TR/css-color-4/#cie-lab</p>
			 */
			unbounded: {
				a: { max: true, min: true },
				b: { max: true, min: true }
			}
		},
		oklpab: {
			name: 'oklab',
			components: [ 'Lightness', 'a', 'b' ],
			fields: [ 'l', 'a', 'b' ],
			aliases: [ 'l', 'a', 'b' ],
			values: { 
				'Lightness': { min: 0, max: 1, unit: '%', displayMultiplicator: 100}, //can go up to 400% for extra whites
				'a': { min: -0.5, max: 0.5, displayUnit: '%', displayMultiplicator: 200},
				'b': { min: -0.5, max: 0.5, displayUnit: '%', displayMultiplicator: 200}
			},
			/*
			 <p>The second and third arguments are the distances along the "a" and "b" axes in the Lab color space, as described in the previous section. These values are signed (allow both positive and negative values) and theoretically unbounded (but in practice do not exceed ±160).</p>
			 <p>source: https://www.w3.org/TR/css-color-4/#cie-lab</p>
			 */
			unbounded: {
				a: { max: true, min: true },
				b: { max: true, min: true }
			}
		},
		oklch: {
			name: 'oklch',
			components: [ 'Lightness', 'Chroma', 'Hue' ],
			fields: [ 'l', 'c', 'h' ],
			aliases: [ 'l', 'c', 'h' ],
			values: { 
				'Lightness': { min: 0, max: 1, unit: '%', displayMultiplicator: 100},
				'Chroma': { min: 0, max: 0.5, unit: '', step: 0.01}, //theoriticaly unbounded max but in practice bounded from 0 to 0.5
				'Hue': { min: 0, max: 360, unit: 'deg', symbol: '°'}
			},
			unbounded: {
				Chroma: { max: true, min: false }
			}
		},
		oklpch: {
			name: 'oklch',
			components: [ 'Lightness', 'Chroma', 'Hue' ],
			fields: [ 'l', 'c', 'h' ],
			aliases: [ 'l', 'c', 'h' ],
			values: { 
				'Lightness': { min: 0, max: 1, unit: '%', displayMultiplicator: 100},
				'Chroma': { min: 0, max: 0.5, unit: '', displayMultiplicator: 100}, //theoriticaly unbounded max but in practice bounded from 0 to 0.5
				'Hue': { min: 0, max: 360, unit: 'deg', symbol: '°'}
			},
			unbounded: {
				Chroma: { max: true, min: false }
			}
		},
		xyz: {
			name: 'xyz',
			colorspace: 'xyz',
			min: [0,0,0],
			components: ['x', 'y', 'z'],
			values: {
				x: {min: 0},
				y: {min: 0},
				z: {min: 0}
			},
			allowAlpha: false
		},
		xyz65: {
			name: 'xyz-d65',
			colorspace: 'xyz-d65',
			values: {
				x: {min: 0, max: 0.95, step: 0.001},
				y: {min: 0, max: 1, step: 0.001},
				z: {min: 0, max: 1.088, step: 0.001}
			},
			components: ['x', 'y', 'z'],
		},
		a98: {
			name: 'a98-rgb',
			colorspace: 'a98-rgb',
			values: {
				Red: {min: 0, max: 1, displayUnit: '%', displayMultiplicator: 100},
				Green: {min: 0, max: 1, displayUnit: '%', displayMultiplicator: 100},
				Blue: {min: 0, max: 1, displayUnit: '%', displayMultiplicator: 100}
			},
			components: ['Red', 'Green', 'Blue'],
			fields: ['r', 'g', 'b']
		},
		'prophoto-rgb': {
			name: 'prophoto-rgb',
			colorspace: 'prophoto-rgb',
			values: {
				Red: {min: 0, max: 1, displayUnit: '%', displayMultiplicator: 100},
				Green: {min: 0, max: 1, displayUnit: '%', displayMultiplicator: 100},
				Blue: {min: 0, max: 1, displayUnit: '%', displayMultiplicator: 100}
			},
			components: ['Red', 'Green', 'Blue'],
			fields: ['r', 'g', 'b']
		},
		srgb: {
			name: 'srgb',
			colorspace: 'srgb',
			values: {
				Red: {min: 0, max: 1, displayUnit: '%', displayMultiplicator: 100},
				Green: {min: 0, max: 1, displayUnit: '%', displayMultiplicator: 100},
				Blue: {min: 0, max: 1, displayUnit: '%', displayMultiplicator: 100}
			},
			components: ['Red', 'Green', 'Blue'],
			fields: ['r', 'g', 'b']
		},
		'srgb-linear': {
			name: 'srgb-linear',
			colorspace: 'srgb-linear',
			values: {
				Red: {min: 0, max: 1, displayUnit: '%', displayMultiplicator: 100},
				Green: {min: 0, max: 1, displayUnit: '%', displayMultiplicator: 100},
				Blue: {min: 0, max: 1, displayUnit: '%', displayMultiplicator: 100}
			},
			components: ['Red', 'Green', 'Blue'],
			fields: ['r', 'g', 'b']
		},
		rec2020: {
			name: 'rec2020',
			colorspace: 'a98-rgb',
			values: {
				r: {min: 0, max: 1, displayUnit: '%', displayMultiplicator: 100},
				g: {min: 0, max: 1, displayUnit: '%', displayMultiplicator: 100},
				b: {min: 0, max: 1, displayUnit: '%', displayMultiplicator: 100}
			},
			components: ['r', 'g', 'b'],
		},
		displayp3: {
			name: 'display-p3',
			colorspace: 'display-p3',
			values: {
				r: {min: 0, max: 1, displayUnit: '%', displayMultiplicator: 100},
				g: {min: 0, max: 1, displayUnit: '%', displayMultiplicator: 100},
				b: {min: 0, max: 1, displayUnit: '%', displayMultiplicator: 100}
			},
			components: ['r', 'g', 'b'],
		},
		acescg: {
			colorspace: "acescg",
			name: "ACEScg",
			components: ['r', 'g', 'b'],
			// ACEScg – A scene-referred, linear-light encoding of ACES Data
			// https://docs.acescentral.com/specifications/acescg/
			// uses the AP1 primaries, see section 4.3.1 Color primaries
			values: {
				r: {
					min: 0,
					max: 65504,
					name: "Red"
				},
				g: {
					min: 0,
					max: 65504,
					name: "Green"
				},
				b: {
					min: 0, 
					max: 65504,
					name: "Blue"
				}
			}
		}
	}
	var aliases = ['XYZ', 'ciexyz', 'cie1931'];
	aliases.forEach(function(a) {
		spaces[a] = spaces.xyz;
	})
	
	spaces.xyzd65 = spaces.xyz65;
	
	spaces['xyz-d65'] = spaces.xyz65;
	
	spaces['xyz-D65'] = spaces.xyz65;
	
	spaces['XYZ-D65'] = spaces.xyz65;
	
	spaces['a98-rgb'] = spaces.a98;
	
	spaces['display-p3'] = spaces.displayp3;
	
	spaces['p3'] = spaces.displayp3;
	
	spaces.lrgb = spaces['srgb-linear'];
	spaces['sRGB-linear'] = spaces['srgb-linear'];
	spaces['sRGB-Linear'] = spaces['srgb-linear'];
	
	spaces.sRgb = spaces.srgb;
	
	spaces.sRGB = spaces.srgb;
	
	spaces.Lab = spaces.lab;
	
	spaces.LAB = spaces.lab;
	
	spaces.Lab100 = spaces.lab100;
	
	spaces.LAB100 = spaces.lab100;
	
	spaces.Lab160 = spaces.lab160;
	
	spaces.LAB160 = spaces.lab160;
	
	spaces.Lch = spaces.lch;
	
	spaces.LCH = spaces.lch;
	
	spaces.EBU = spaces.yuv;
	
	spaces.YUV = spaces.yuv;
	
	function isHwbSys(cs) {
		var sys = cs.system||cs.sys;
		if (sys)
			return sys.toLowerCase() === 'hwb'
		return cs.Whiteness && cs.Brightness
	}
	
	function isRgbSys(cs) {
		var sys = cs.system||cs.sys;
		if (sys)
			return sys.toLowerCase() === 'rgb'
		return cs.Red && cs.Green;
	}
	
	function isHsbSys(cs) {
		var sys = cs.system||cs.sys;
		if (sys)
			return sys.toLowerCase() === 'hsb'
		return cs.Saturation && cs.Brightness;
	}
	
	function isHsvSys(cs) {
		var sys = cs.system||cs.sys;
		if (sys)
			return sys.toLowerCase() === 'hsb'
		return cs.Saturation && cs.Value;
	}
	
	function isCmykSys(cs) {
		var sys = cs.system||cs.sys;
		if (sys)
			return sys.toLowerCase() === 'cmyk'
		return cs.Cyan && cs.Magenta && cs.Yello && (cs.Key||cs.Black);
	}
	
	function isCmySys(cs) {
		var sys = cs.system||cs.sys;
		if (sys)
			return sys.toLowerCase() === 'cmy'
		return cs.Cyan && cs.Magenta && cs.Yello && !(cs.Key||cs.Black);
	}
	
	function isHslSys(cs) {
		var sys = cs.system||cs.sys;
		if (sys)
			return sys.toLowerCase() === 'hsl'
		return cs.Saturation && (cs.Lightness || cs.Luminance);
	}
	
	function isYuvSys(cs) {
		var sys = cs.system||cs.sys;
		if (sys)
			return sys.toLowerCase() === 'yuv'
		return cs.Y && cs.U  && cs.V;
	}
	
	function isHwbKeys(keys) {
		return isKeys(keys, ['Hue', 'Whiteness', 'Brightness']);
	}
	
	function isRgbKeys(keys) {
		return isKeys(keys, ['Red', 'Green', 'Blue']);
	}
	
	function isHsbKeys(keys) {
		return isKeys(keys, ['Hue', 'Saturation', 'Brightness']);
	}
	
	function isHsvKeys(keys) {
		return isKeys(keys, ['Hue', 'Saturation', 'Value']);
	}
	
	function isCmykKeys(keys) {
		return isKeys(keys, ['Cyan', 'Magenta', 'Yello', keys.indexOf('Key') >= 0 ? 'Key' : 'Black' ]);
	}
	
	function isCmyKeys(keys) {
		return isKeys(keys, ['Cyan', 'Magenta', 'Yello']);
	}
	
	function isHslKeys(keys) {
		return isKeys(keys, ['Hue', 'Saturation', keys.indexOf('Lightness') >= 0 ? 'Lightness' :  'Luminance']);
	}
	
	function isYuvKeys(keys) {
		return isKeys(keys, ['Y', 'U ', 'V']);
	}
	
	function isKeys(keys, components) {
		var i = 0;
		var n = keys.length;
		var c, p;
		var j, count;
		var idx = [];
		if (n !== components.length)
			return false;
		for (; i < n; i++) {
			c = components[i];
			if (typeof c === 'string') {
				if ((p = keys.indexOf(c)) < 0 || idx.indexOf(p) >= 0) {
					return false;
				} else {
					idx.push(p);
				}
			} else {
				throw new Error('Incorrect arguments');
			}
		}
		return true;
	}
	
	function ColorSpaces() {}
	
	
	var CS = ColorSpaces;
	
	CS.__CLASS__ = ColorSpaces;
	
	CS.__CLASS_NAME__ = 'ColorSpaces';
	
	CS.__NAMESPACE_NAME__ = 'SereniX.color';
	
	CS.getNames = function() {
		return Object.keys(sys);
	}
	
	CS.get = function(cs) {
		return spaces[cs];
	}
	
	CS.set = function(cs, $) {
		var sys;
		var components;
		var values;
		var vals;
		function _isVals() {
			var x;
			if (isArray(values) && !components)
				return true;
			if (isArray(components) && !values) {
				x = components;
				components = values;
				values = x;
				return true;
			}
		}
		if (typeof cs === 'string') {
			sys = cs;
			if (isPlainObj($)) {
				components = $.components;
				values = $.values;
				if ((isArray(components) && typeof components[0] === 'string') && isPlainObj(values)) {
					spaces[sys] = cs;
					return;
				}
			}
		} else if (isPlainObj(cs)) {
			components = cs.components;
			values = cs.values;
			if (typeof $ === 'string') {
				sys = $;
			} else {
				sys = $.colorspace||$.colorSpace||$.system||$.sys;
			}
			if ((isArray(components) && typeof components[0] === 'string') && isPlainObj(values)) {
				spaces[sys] = cs;
				return;
			}
		}
		if (_isVals()) {
			components = [];
			vals = {};
			values.forEach(function(c) {
				components.push(c.name||c.field);
				vals[c.name||c.field] = c;
			})
			spaces[sys] = {
				components: components,
				values: vals
			}
		}
	}
	
	function normalize($0, name) {
		if (isPlainObj(
	}
	
	CS.register = function($0, $1) {
		function _set(name, v) {
			switch(name.toLowerCase()) {
				case 'ranges':
					if (isArray(v)) {
						v.forEach(function(x) {
							
						})
					} else if (isPlainObj(v)) {
						
					}
					break;
				case 'components':
					if (isArray(v)) {
						v.forEach(function(x) {
							if (typeof x === 'string') {
								
							} else if (isPlainObj(x)) {
								
							}
						})
					} else if (isPlainObj(v)) {
						
					}
					break;
				case 'coords':
				case 'coordinates'
					if (isArray(v)) {
						
					} else if (isPlainObj(v)) {
						
					}
					break;
				case 'values':
					if (isArray(v)) {
						
					} else if (isPlainObj(v)) {
						
					}
					break;
				case 'fields':
					if (isArray(v)) {
						
					} else if (isPlainObj(v)) {
						
					}
					break;
				case 'aliases':
					if (isArray(v)) {
						
					} else if (isPlainObj(v)) {
						
					}
					break;
			}
		}
		function _setCs(cs, $) {
			if (isArray($1)) {
				spaces[cs] = space = { colorspace: cs, components: comps = [], fields: fields = [], values: values = {}}
				if (isArray($1[0])) {
					n = $.length;
					for (i = 0; i < n; i++) {
						_set(name = $[i][0], v = $[i][1]);						
					}
				} else if (isPlainObj($0[0])) {
					n = $.length;
					for (i = 0; i < n; i++) {
						_set(name = (v = $[i]).name, v);						
					}
				} else if (typeof $[0] === 'string') {
					n = Math.floor($0.length/2);
					for (i = 0; i < n; i++) {
						_set(name = $[2*i], v = $[2*i + 1]);						
					}
				}
			} else {
				spaces[cs] = normalize($, cs)
			}
		}
		var space;
		var i, n, name, v, cs;
		var comps, fields, values, axes;
		if (isPlainObj($0)) {
			_setCs(typeof $1 === 'string' ? $1 : $0.colorspace||$0.colorSpace||$0.space||$0.name, $0);
		} else if (isArray($0)) {
			space = {components: comps = [], fields: fields = [], values: values = {}};
			if (typeof $1 === 'string' && $1) {
				space.colorspace = $1;
				spaces[$1] = space;
			}			
			if (typeof $0[0] === 'string') {
				n = Math.floor($0.length/2);
				for (i = 0; i < n; i++) {
					name = $0[2*i]
					v = $0[2*i + 1]
					if (/^(color)?space$/i.test(name)) {
						spaces[v] = space;
						space.colorspace = v;
					} else {
						_set(name, v);
					}
				}
			} else if (isArray($0[0])) {
				n = $0.length;
				for (i = 0; i < n; i++) {
					name = $0[i][0]
					v = $0[i][1]
					if (/^(color)?space$/i.test(name)) {
						spaces[v] = space;
						space.colorspace = v;
					} else {
						_set(name, v);
					}
				}
			} else if (isPlainObj($0[0])) {
				n = $0.length;
				for (i = 0; i < n; i++) {
					name = $0[i].name
					v = $0[i].value;
					if (/^(color)?space$/i.test(name)) {
						spaces[v] = space;
						space.colorspace = v;
					} else {
						_set(name, v);
					}
				}
			}
		} else if (typeof $0 === 'string') {			
			_setCs($0, $1);
		}
	}
	
	
	
	CS.isHslSys = isHslSys
	CS.isHwbSys = isHwbSys
	CS.isHsbSys = isHsbSys
	CS.isHsvSys = isHsvSys
	CS.isCmykSys = isCmykSys
	CS.isCmySys = isCmySys
	CS.isYuvSys = isYuvSys
	
	CS.isHslKeys = isHslKeys
	CS.isHwbKeys = isHwbKeys
	CS.isHsbKeys = isHsbKeys
	CS.isHsvKeys = isHsvKeys
	CS.isCmykKeys = isCmykKeys
	CS.isCmyKeys = isCmyKeys
	CS.isYuvKeys = isYuvKeys
	
	if (typeof SereniX.color.addChild === 'function') {
		SereniX.color.addChild(CS);
	} else {
		SereniX.color.ColorSpaces = CS;
	}
	
	SereniX.ColorSpaces = CS;
	
	
	return CS;
});
