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
 
//requires serenix_css_color_utils.js
 
;(function(root, name, factory) {
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define([name], factory);
    } else {
        root[name] = factory();
    }    
})(this, 'WCAG', function() {
	
	function getLuminance(r, g, b) {
		return _getLuminance(isPlainObj(r) ? [r.r, r.g, r.b] : isArray(r) ? r : [r, g, b]);
	}

	function _getLuminance(rgb) {
        //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
        var RsRGB, GsRGB, BsRGB, R, G, B;
        RsRGB = rgb[0]/255;
        GsRGB = rgb[1]/255;
        BsRGB = rgb[2]/255;

        if (RsRGB <= 0.03928) {R = RsRGB / 12.92;} else {R = Math.pow(((RsRGB + 0.055) / 1.055), 2.4);}
        if (GsRGB <= 0.03928) {G = GsRGB / 12.92;} else {G = Math.pow(((GsRGB + 0.055) / 1.055), 2.4);}
        if (BsRGB <= 0.03928) {B = BsRGB / 12.92;} else {B = Math.pow(((BsRGB + 0.055) / 1.055), 2.4);}
        return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
    }
	
	/**
	 *
	 * @static
	 * @class SereniX.WCAG
	 */
	function WCAG() {}
	
	WCAG.__CLASS__ = WCAG;
	
	WCAG.__CLASS_NAME__ = 'WCAG';
	
	WCAG.__NAMESPACE_NAME__ = 'SereniX';
	
	WCAG.getLuminance = getLuminance;

	// Readability Functions
	// ---------------------
	// <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)

	// `contrast`
	// Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
	function readability(color1, color2) {
		var l1 = _getLuminance(rgb(c1));
		var l2 = _getLuminance(rgb(c2));
		return (Math.max(l1,l2)+0.05) / (Math.min(l1,l2)+0.05);
	}
	WCAG.readability = readability;
	
	function validateWCAG2Parms(parms) {
		// return valid WCAG2 parms for isReadable.
		// If input parms are invalid, return {"level":"AA", "size":"small"}
		var level, size;
		parms = parms || {"level":"AA", "size":"small"};
		level = (parms.level || "AA").toUpperCase();
		size = (parms.size || "small").toLowerCase();
		if (level !== "AA" && level !== "AAA") {
			level = "AA";
		}
		if (size !== "small" && size !== "large") {
			size = "small";
		}
		return {"level":level, "size":size};
	}

	// `isReadable`
	// Ensure that foreground and background color combinations meet WCAG2 guidelines.
	// The third argument is an optional Object.
	//      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
	//      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
	// If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.

	// *Example*
	//    isReadable("#000", "#111") => false
	//   isReadable("#000", "#111",{level:"AA",size:"large"}) => false
	function isReadable(color1, color2, wcag2) {
		var readability = readability(color1, color2);
		var wcag2Parms, out;

		out = false;

		wcag2Parms = validateWCAG2Parms(wcag2);
		switch (wcag2Parms.level + wcag2Parms.size) {
			case "AAsmall":
			case "AAAlarge":
				out = readability >= 4.5;
				break;
			case "AAlarge":
				out = readability >= 3;
				break;
			case "AAAsmall":
				out = readability >= 7;
				break;
		}
		return out;

	};
	
	WCAG.isReadable = isReadable;
	
	
	
	function rgbFromString(color) {
		function fromHex(match) {
			var x;
			switch(match.length) {
				case 6:
					return [parseInt(match.substring(0,2), 16), parseInt(match.substring(2,4), 16), parseInt(match.substring(4), 16)]
				case 3:
					return [parseInt(match[0] + match[0], 16), parseInt(match[1] + match[1], 16), parseInt(match[2] + match[2], 16)]
				case 2:
					return [parseInt(match[0] + match[0], 16), parseInt(match[0] + match[1], 16), parseInt(match[1] + match[1], 16)]
				case 1:
					return [x = parseInt(match[0] + match[0], 16), x, x]
			}
			throw new Error('Incorrect color hex string: ' + color);
		}
		if ((match=/^#?([0-9a-fA-F]+)$/.exec(color))) {
			return fromHex(match[1]);
		}
		throw new Error('Incorrect string color: ' + color)
	}
	
	function rgb(color) {
		if (typeof color === 'string' || color instanceof String) {
			return rgbFromString(color);
		}
		if (isArray(color))
			return color;
		if (isPlainObj(color)) {
			return [color.r, color.g, color.b];
		}
	}
	/**
	 * Returns an array representing an RGB color.
	 * memberOf SereniX.WCAG
	 * @static
	 * @function
	 * @param {Object|Array} color;
	 * @returns {Array}
	 */
	WCAG.rgb = rgb;

	// `mostReadable`
	// Given a base color and a list of possible foreground or background
	// colors for that base, returns the most readable color.
	// Optionally returns Black or White if the most readable color is unreadable.
	// *Example*
	//    mostReadable(mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
	//    mostReadable(mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
	//    mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
	//    mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
	function mostReadable(baseColor, colorList, opts) {
		var bestColor = null;
		var bestScore = 0;
		var readability;
		var includeFallbackColors, level, size ;
		var color;
		opts = opts || {};
		includeFallbackColors = opts.includeFallbackColors ;
		level = opts.level;
		size = opts.size;
		baseColor = rgb(baseColor);

		for (var i= 0; i < colorList.length ; i++) {
			readability = readability(baseColor, rgb(color = colorList[i]));
			if (readability > bestScore) {
				bestScore = readability;
				bestColor = color;
			}
		}

		if (isReadable(baseColor, bestColor, {"level":level,"size":size}) || !includeFallbackColors) {
			return bestColor;
		} else {
			opts.includeFallbackColors=false;
			return mostReadable(baseColor,["#fff", "#000"], opts);
		}
	};
	
	WCAG.mostReadable = mostReadable;
	var CCU = SereniX.CssColorUtils;
	if (CCU) {
		CCU.mostReadable = mostReadable;
		CCU.isReadable = isReadable;
		CCU.readability = readability;
	}
	
	if (SereniX.addChild) {
		SereniX.addChild(WCAG);
	} else {
		SereniX.WCAG = WCAG;
	}
	
	return WCAG;
});
