if (typeof _yuitest_coverage == "undefined"){
    _yuitest_coverage = {};
    _yuitest_coverline = function(src, line){
        var coverage = _yuitest_coverage[src];
        if (!coverage.lines[line]){
            coverage.calledLines++;
        }
        coverage.lines[line]++;
    };
    _yuitest_coverfunc = function(src, name, line){
        var coverage = _yuitest_coverage[src],
            funcId = name + ":" + line;
        if (!coverage.functions[funcId]){
            coverage.calledFunctions++;
        }
        coverage.functions[funcId]++;
    };
}
_yuitest_coverage["build/gallery-stdmod/gallery-stdmod.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-stdmod/gallery-stdmod.js",
    code: []
};
_yuitest_coverage["build/gallery-stdmod/gallery-stdmod.js"].code=["YUI.add('gallery-stdmod', function (Y, NAME) {","","/**","* A version of Widget-StdMod that uses the ContentBox of the Widget as its Body section and adds","* the Header and Footer sections on each side of it instead of having the three of them under the contentBox.","* This turns quite handy when used along WidgetParent since the later assumes children will be added in the contentBox","* and thus conflicts with the StdMod sections. (this can also be solved using the property","* <a href=\"http://yuilibrary.com/yui/docs/api/classes/WidgetParent.html#property__childrenContainer\">_childrenContainer</a>)<br/><br/>","* For further documentation see <a href=\"http://yuilibrary.com/yui/docs/api/classes/WidgetStdMod.html\">WidgetStdMod</a>","*","* @module gallery-stdmod","* @class StdMod","* @constructor","* @extends WidgetStdMod","*/","","\"use strict\";","var BBX = 'boundingBox',","	CBX = 'contentBox',","	WStdMod = Y.WidgetStdMod,","	HEADER = WStdMod.HEADER,","	BODY = WStdMod.BODY,","	FOOTER = WStdMod.FOOTER,","","	StdMod = function () {","		WStdMod.apply(this, arguments);","		this._stdModNode = this.get(BBX);","	};","","	","StdMod.prototype = {","	_renderUIStdMod : function () {","		var cbx = this.get(CBX);","		","		cbx.addClass(WStdMod.SECTION_CLASS_NAMES[BODY]);","		this.bodyNode = cbx;","		WStdMod.prototype._renderUIStdMod.apply(this,arguments);","	},","	_renderStdMod : function(section) {","","		var contentBox = this.get(CBX),","			sectionNode = this._findStdModSection(section);","","		if (!sectionNode) {","			if (section === BODY) {","				sectionNode = contentBox;","			} else {","				sectionNode = this._getStdModTemplate(section);","			}","		}","","		this._insertStdModSection(contentBox, section, sectionNode);","","		return (this[section + 'Node'] = sectionNode);","	},","	_insertStdModSection : function(contentBox, section, sectionNode) {"," ","		switch (section) {","			case FOOTER:","				contentBox.insert(sectionNode, 'after');","				break;","			case HEADER:","				contentBox.insert(sectionNode, 'before');","				break;","		}","	},","	_findStdModSection: function(section) {","		return this.get(BBX).one(\"> .\" + WStdMod.SECTION_CLASS_NAMES[section]);","	}","};","","Y.StdMod = Y.mix(StdMod, WStdMod, false, undefined, 2);","","","}, '@VERSION@');"];
_yuitest_coverage["build/gallery-stdmod/gallery-stdmod.js"].lines = {"1":0,"17":0,"18":0,"26":0,"27":0,"31":0,"33":0,"35":0,"36":0,"37":0,"41":0,"44":0,"45":0,"46":0,"48":0,"52":0,"54":0,"58":0,"60":0,"61":0,"63":0,"64":0,"68":0,"72":0};
_yuitest_coverage["build/gallery-stdmod/gallery-stdmod.js"].functions = {"StdMod:25":0,"_renderUIStdMod:32":0,"_renderStdMod:39":0,"_insertStdModSection:56":0,"_findStdModSection:67":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-stdmod/gallery-stdmod.js"].coveredLines = 24;
_yuitest_coverage["build/gallery-stdmod/gallery-stdmod.js"].coveredFunctions = 6;
_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 1);
YUI.add('gallery-stdmod', function (Y, NAME) {

/**
* A version of Widget-StdMod that uses the ContentBox of the Widget as its Body section and adds
* the Header and Footer sections on each side of it instead of having the three of them under the contentBox.
* This turns quite handy when used along WidgetParent since the later assumes children will be added in the contentBox
* and thus conflicts with the StdMod sections. (this can also be solved using the property
* <a href="http://yuilibrary.com/yui/docs/api/classes/WidgetParent.html#property__childrenContainer">_childrenContainer</a>)<br/><br/>
* For further documentation see <a href="http://yuilibrary.com/yui/docs/api/classes/WidgetStdMod.html">WidgetStdMod</a>
*
* @module gallery-stdmod
* @class StdMod
* @constructor
* @extends WidgetStdMod
*/

_yuitest_coverfunc("build/gallery-stdmod/gallery-stdmod.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 17);
"use strict";
_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 18);
var BBX = 'boundingBox',
	CBX = 'contentBox',
	WStdMod = Y.WidgetStdMod,
	HEADER = WStdMod.HEADER,
	BODY = WStdMod.BODY,
	FOOTER = WStdMod.FOOTER,

	StdMod = function () {
		_yuitest_coverfunc("build/gallery-stdmod/gallery-stdmod.js", "StdMod", 25);
_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 26);
WStdMod.apply(this, arguments);
		_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 27);
this._stdModNode = this.get(BBX);
	};

	
_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 31);
StdMod.prototype = {
	_renderUIStdMod : function () {
		_yuitest_coverfunc("build/gallery-stdmod/gallery-stdmod.js", "_renderUIStdMod", 32);
_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 33);
var cbx = this.get(CBX);
		
		_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 35);
cbx.addClass(WStdMod.SECTION_CLASS_NAMES[BODY]);
		_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 36);
this.bodyNode = cbx;
		_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 37);
WStdMod.prototype._renderUIStdMod.apply(this,arguments);
	},
	_renderStdMod : function(section) {

		_yuitest_coverfunc("build/gallery-stdmod/gallery-stdmod.js", "_renderStdMod", 39);
_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 41);
var contentBox = this.get(CBX),
			sectionNode = this._findStdModSection(section);

		_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 44);
if (!sectionNode) {
			_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 45);
if (section === BODY) {
				_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 46);
sectionNode = contentBox;
			} else {
				_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 48);
sectionNode = this._getStdModTemplate(section);
			}
		}

		_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 52);
this._insertStdModSection(contentBox, section, sectionNode);

		_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 54);
return (this[section + 'Node'] = sectionNode);
	},
	_insertStdModSection : function(contentBox, section, sectionNode) {
 
		_yuitest_coverfunc("build/gallery-stdmod/gallery-stdmod.js", "_insertStdModSection", 56);
_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 58);
switch (section) {
			case FOOTER:
				_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 60);
contentBox.insert(sectionNode, 'after');
				_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 61);
break;
			case HEADER:
				_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 63);
contentBox.insert(sectionNode, 'before');
				_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 64);
break;
		}
	},
	_findStdModSection: function(section) {
		_yuitest_coverfunc("build/gallery-stdmod/gallery-stdmod.js", "_findStdModSection", 67);
_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 68);
return this.get(BBX).one("> ." + WStdMod.SECTION_CLASS_NAMES[section]);
	}
};

_yuitest_coverline("build/gallery-stdmod/gallery-stdmod.js", 72);
Y.StdMod = Y.mix(StdMod, WStdMod, false, undefined, 2);


}, '@VERSION@');
