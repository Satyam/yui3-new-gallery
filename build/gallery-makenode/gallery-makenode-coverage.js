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
_yuitest_coverage["build/gallery-makenode/gallery-makenode.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-makenode/gallery-makenode.js",
    code: []
};
_yuitest_coverage["build/gallery-makenode/gallery-makenode.js"].code=["YUI.add('gallery-makenode', function (Y, NAME) {","","/**"," * An extension for Widget to create markup from templates,"," * create CSS classNames, locating elements,"," * assist in attaching events to UI elements and to reflect attribute changes into the UI."," * All of its members are either protected or private."," * Developers using MakeNode should use only those marked protected."," * <b>Enable the Show Protected checkbox to see them</b>."," * @module gallery-makenode"," * @class MakeNode"," */","	\"use strict\";","	if (Y.version === '3.4.0') { (function () {","		// See: http://yuilibrary.com/projects/yui3/ticket/2531032","		var L = Y.Lang, DUMP = 'dump', SPACE = ' ', LBRACE = '{', RBRACE = '}',","			savedRegExp =  /(~-(\\d+)-~)/g, lBraceRegExp = /\\{LBRACE\\}/g, rBraceRegExp = /\\{RBRACE\\}/g;","","		Y.substitute = function(s, o, f, recurse) {","			var i, j, k, key, v, meta, saved = [], token, dump,","				lidx = s.length;","","			for (;;) {","				i = s.lastIndexOf(LBRACE, lidx);","				if (i < 0) {","					break;","				}","				j = s.indexOf(RBRACE, i);","				if (i + 1 >= j) {","					break;","				}","","				//Extract key and meta info","				token = s.substring(i + 1, j);","				key = token;","				meta = null;","				k = key.indexOf(SPACE);","				if (k > -1) {","					meta = key.substring(k + 1);","					key = key.substring(0, k);","				}","","				// lookup the value","				v = o[key];","","				// if a substitution function was provided, execute it","				if (f) {","					v = f(key, v, meta);","				}","","				if (L.isObject(v)) {","					if (!Y.dump) {","						v = v.toString();","					} else {","						if (L.isArray(v)) {","							v = Y.dump(v, parseInt(meta, 10));","						} else {","							meta = meta || '';","","							// look for the keyword 'dump', if found force obj dump","							dump = meta.indexOf(DUMP);","							if (dump > -1) {","								meta = meta.substring(4);","							}","","							// use the toString if it is not the Object toString","							// and the 'dump' meta info was not found","							if (v.toString === Object.prototype.toString ||","								dump > -1) {","								v = Y.dump(v, parseInt(meta, 10));","							} else {","								v = v.toString();","							}","						}","					}","				} else if (L.isUndefined(v)) {","					// This {block} has no replace string. Save it for later.","					v = '~-' + saved.length + '-~';","					saved.push(token);","","					// break;","				}","","				s = s.substring(0, i) + v + s.substring(j + 1);","","				if (!recurse) {","					lidx = i - 1;","				}","","			}","			// restore saved {block}s and replace escaped braces","","			return s","				.replace(savedRegExp, function (str, p1, p2) {","					return LBRACE + saved[parseInt(p2,10)] + RBRACE;","				})","				.replace(lBraceRegExp, LBRACE)","				.replace(rBraceRegExp, RBRACE)","			;","","		};","	})();}","	var WS = /\\s+/,","		NODE = 'Node',","		DOT = '.',","		BBX = 'boundingBox',","		Lang = Y.Lang,","		DUPLICATE = ' for \"{name}\" defined in class {recentDef} also defined in class {prevDef}',","		parsingRegExp = /^(?:([ \\t]+)|(\"[^\"\\\\]*(?:\\\\.[^\"\\\\]*)*\")|(true)|(false)|(null)|([\\-+]?[0-9]*(?:\\.[0-9]+)?))/,","		quotesRegExp = /\\\\\"/g,","","		/**","		 * Creates CSS classNames from suffixes listed in <a href=\"#property__CLASS_NAMES\"><code>_CLASS_NAMES</code></a>,","		 * stores them in <a href=\"#property__classNames\"><code>this._classNames</code></a>.","		 * Concatenates <a href=\"#property__ATTRS_2_UI\"><code>_ATTRS_2_UI</code></a> into <code>_UI_ATTRS</code>.","		 * Sets listeners to render and destroy events to attach/detach UI events.","		 * If there is no renderUI defined in this class or any of its ancestors (not counting Widget which has a dummy one)","		 * it will add a default one appending the result of processing _TEMPLATE and then call _locateNodes.","		 * @constructor","		 */","		MakeNode = function () {","			var self = this;","			self._eventHandles = [];","			self._makeClassNames();","			self._concatUIAttrs();","			self._publishEvents();","			self.after('render', self._attachEvents, self);","			self.after('destroy', self._detachEvents, self);","			if (self.renderUI === Y.Widget.prototype.renderUI) {","				self.renderUI = self._autoRenderUI;","			}","		};","	MakeNode.prototype = {","		/**","		 * Method to be used if no explicit renderUI method is defined.","		 * @method _autoRenderUI","		 * @private","		 */","		_autoRenderUI: function () {","			this.get('contentBox').append(this._makeNode());","			this._locateNodes();","		},","		/**","		 * An array of event handles returned when attaching listeners to events,","		 * meant to detach them all when destroying the instance.","		 * @property _eventHandles","		 * @type Array","		 * @private","		 */","		_eventHandles:null,","		/**","		 * Contains a hash of CSS classNames generated from the entries in <a href=\"#property__CLASS_NAMES\"><code>_CLASS_NAMES</code></a>","		 * indexed by those same values.","		 * It will also have the following entries added automatically: <ul>","		 * <li><code>boundingBox</code> The className for the boundingBox</li>","		 * <li><code>content</code> The className for the contentBox</li>","		 * <li><code>HEADER</code> The className for the header section of a StdMod if Y.WidgetStdMod has been loaded</li>","		 * <li><code>BODY</code> The className for the body section of a StdMod if Y.WidgetStdMod has been loaded</li>","		 * <li><code>FOOTER</code> The className for the footer section of a StdMod if Y.WidgetStdMod has been loaded</li>","		 * </ul>","		 * @property _classNames","		 * @type Object","		 * @protected","		 */","		_classNames:null,","		/**","		 * Hash listing the template processing codes and the functions to handle each.","		 * The processing functions will receive a string with the arguments that follow the processing code,","		 * and the extra, second argument passed on to _makeNode (or _substitute)","		 * and should return the replacement value for the placeholder.","		 * @property _templateHandlers","		 * @type Object","		 * @private","		 */","		_templateHandlers: {","			'@': function (arg) {","				return this.get(arg);","			},","			'p': function (arg) {","				return this[arg];","			},","			'm': function (args) {","				var method = args.split(WS)[0];","				args = args.substr(method.length);","				args = this._parseMakeNodeArgs(args);","				return this[method].apply(this, args);","			},","			'c': function (arg) {","				return this._classNames[arg];","			},","			's': function (arg, extras) {","				return this._substitute(this.get('strings')[arg], extras);","			},","			'?': function(args) {","				args = this._parseMakeNodeArgs(args);","				return (!!args[0])?args[1]:args[2];","			},","			'1': function (args) {","				args = this._parseMakeNodeArgs(args);","				return parseInt(args[0],10) ===1?args[1]:args[2];","			},","			'n': function (args, extras) {","				var fn, key, value = this;","				args = args.split(WS);","","				while (value && args.length) {","					key = args.shift();","					fn = this._templateHandlers[key.toLowerCase()];","					if (!fn) {","						return;","					}","					value =  fn.call(value, args.shift(), extras);","				}","				return value;","			}","","		},","		/**","		 * Parses the arguments received by the processor of the <code>{m}</code> placeholder.","		 * It recognizes numbers, <code>true</code>, <code>false</code>, <code>null</code>","         * and double quoted strings, each separated by whitespace.","		 * It skips over anything else.","		 * @method _parseMakeNodeArgs","		 * @param arg {String} String to be parsed for arguments","		 * @return {Array} Array of arguments found, each converted to its proper data type","		 * @private","		 */","		_parseMakeNodeArgs: function (arg) {","			var args = [],","				matcher = function (match, i) {","					if (match !== undefined && i) {","						switch (i) {","							case 1:","								break;","							case 2:","								args.push(match.substr(1, match.length - 2).replace(quotesRegExp,'\"'));","								break;","							case 3:","								args.push(true);","								break;","							case 4:","								args.push(false);","								break;","							case 5:","								args.push(null);","								break;","							case 6:","								if (match) {","									args.push(parseFloat(match));","								} else {","									// The last parenthesis of the RegExp succeeds on anything else since both the integer and decimal","									// parts of a number are optional, however, it captures nothing, just an empty string.","									// So, any string other than true, false, null or a properly quoted string will end up here.","									// I just consume it one character at a time to avoid looping forever on errors.","									arg = arg.substr(1);","								}","								break;","						}","						arg = arg.substr(match.length);","						return true;","					}","				};","			while (arg.length) {","","				Y.some(parsingRegExp.exec(arg), matcher);","			}","			return args;","		},","		/**","		 * Enumerates all the values and keys of a given static properties for all classes in the hierarchy,","		 * starting with the oldest ancestor (Base).","		 * @method _forAllXinClasses","		 * @param x {String} name of the static property to be enumerated","		 * @param fn {function} function to be called for each value.","		 * The function will receive a reference to the class where it occurs, the value of the property","		 * and the key or index.","		 * @private","		 */","","		_forAllXinClasses: function(x, fn) {","			var self = this,","				cs = this._getClasses(),","				l = cs.length,","				i, c,","				caller = function (v, k) {","					fn.call(self, c, v, k);","				};","			for (i = l -1;i >= 0;i--) {","				c = cs[i];","				if (c[x]) {","					Y.each(c[x], caller);","				}","			}","		},","		/**","		 * Processes the template given and returns a <code>Y.Node</code> instance.","		 * @method _makeNode","		 * @param template {String} (optional) Template to process.","		 *        If missing, it will use the first static","         *        <a href=\"#property__TEMPLATE\"><code>_TEMPLATE</code></a>","         *        property found in the inheritance chain.","		 * @param extras {Object} (optional) Hash of extra values to replace into","         *      the template, beyond MakeNode's processing codes.","		 * @return {Y.Node} Instance of <code>Y.Node</code> produced from the template","		 * @protected","		 */","		_makeNode: function(template, extras) {","			if (!template) {","				Y.some(this._getClasses(), function (c) {","					template = c._TEMPLATE;","					return !!template;","				});","			}","			return Y.Node.create(this._substitute(template, extras));","		},","		/**","		 * Processes the given template and returns a string","		 * @method _substitute","		 * @param template {String} Template to process.","		 * @param extras {Object} (optional) Hash of extra values to replace into","         *      the template, beyond MakeNode's processing codes.","		 * @return {String} Template with the placeholders replaced.","		 * @protected","		 */","		_substitute: function (template, extras) {","			var fn;","			return Y.substitute(template , extras || {}, Y.bind(function (key, suggested, arg) {","				if (arg) {","					fn = this._templateHandlers[key.toLowerCase()];","					if (fn) {","						return fn.call(this, arg, extras);","					}","				}","				return suggested;","			}, this),true);","		},","		/**","		 * Locates the nodes with the CSS classNames listed in the","         * <a href=\"#property__classNames\"><code>this._classNames</code></a> property,","		 * or those specifically requested in its arguments and stores references to them","		 * in properties named after each className key, prefixed with an underscore","		 * and followed by <code>\"Node\"</code>.","		 * If the className key contains a hyphen followed by a lowercase letter,","         * the hyphen will be dropped and the letter capitalized.","		 * Any other characters invalid for identifiers will be turned into underscores,","		 * thus for the <code>no-label-1</code> className key a <code>_noLabel_1Node</code>","         * property will be created.","		 * @method _locateNodes","		 * @param arg1,.... {String} (optional) If given, list of className keys of the nodes to be located.","		 *        If missing, all the classNames stored in","         *        <a href=\"#property__classNames\"><code>this._classNames</code></a> will be located.","		 * @protected","		 */","		_locateNodes: function () {","			var bbx = this.get(BBX),","				self = this,","				makeName = function (el, name) {","					if (el) {","						self['_' + name.replace(/\\-([a-z])/g,function (str, p1) {","							return p1.toUpperCase();","						}).replace(/\\W/g,'_') + NODE] = el;","					}","				};","			if (arguments.length) {","				Y.each(arguments, function (name) {","					makeName(bbx.one(DOT + self._classNames[name]),name);","				});","			} else {","				Y.each(self._classNames, function(selector, name) {","					makeName(bbx.one(DOT + selector), name);","				});","			}","		},","		/**","		 * Looks for static properties called","         * <a href=\"#property__CLASS_NAMES\"><code>_CLASS_NAMES</code></a>","         * in each of the classes of the inheritance chain","		 * and generates CSS classNames based on the <code>_cssPrefix</code> of each","         * class and each of the suffixes listed in each them.","		 * The classNames generated will be stored in","         * <a href=\"#property__classNames\"><code>this._classNames</code></a> indexed by the suffix.","		 * It will also store the classNames of the boundingBox ( boundingBox )and the contentBox ( content ).","		 * If the WidgetStdMod is used, it will also add the classNames for the","         * three sections ( HEADER, BODY, FOOTER )","		 * @method _makeClassNames","		 * @private","		 */","		_makeClassNames: function () {","			var YCM = Y.ClassNameManager.getClassName,","				defined = {},","				cns = this._classNames = {};","","			this._forAllXinClasses('_CLASS_NAMES', function(c, name) {","				if (defined[name]) {","				} else {","					cns[name] = YCM(c.NAME.toLowerCase(), name);","					defined[name] = c.NAME;","				}","			});","","			cns.content = (cns[BBX] = YCM(this.constructor.NAME.toLowerCase())) + '-content';","			if (this.getStdModNode) {","				cns.HEADER = 'yui3-widget-hd';","				cns.BODY = 'yui3-widget-bd';","				cns.FOOTER = 'yui3-widget-ft';","			}","		},","		/**","		 * Concatenates the entries of the <a href=\"#property__ATTRS_2_UI\"><code>_ATTRS_2_UI</code></a>","         * static property of each class in the inheritance chain","		 * into this instance _UI_ATTRS property for the benefit or Widget.  See Widget._UI_ATTRS","		 * @method _concatUIAttrs","		 * @private","		 */","		_concatUIAttrs: function () {","			var defined, u, U = {};","			Y.each(['BIND','SYNC'], function (which) {","				defined = {};","				Y.each(this._UI_ATTRS[which], function (name) {","					defined[name] = 'Widget';","				});","				Y.each(this._getClasses(), function (c) {","					u = c._ATTRS_2_UI;","					if (u) {","						Y.each(Y.Array(u[which]), function (name) {","							if (defined[name]) {","							} else {","								defined[name] = c.NAME;","							}","						});","					}","				});","				U[which]= Y.Object.keys(defined);","			},this);","			this._UI_ATTRS = U;","		},","		/**","		 * Attaches the events listed in the <a href=\"#property__EVENTS\"><code>_EVENTS</code></a>","         * static property of each class in the inheritance chain.","		 * @method _attachEvents","		 * @private","		 */","		_attachEvents: function () {","			var self = this,","				bbx = self.get(BBX),","				eh = [],","				type, fn, args, when, target, t,","				toInitialCap = function (name) {","					return name.charAt(0).toUpperCase() + name.substr(1);","				},","				equivalents = {","					boundingBox:bbx,","					document:bbx.get('ownerDocument'),","					THIS:self,","					Y:Y","				};","			self._forAllXinClasses('_EVENTS', function (c, handlers, key) {","				target = equivalents[key] || DOT + self._classNames[key];","				if (key === 'THIS') {key = 'This';}","				Y.each(Y.Array(handlers), function (handler) {","					if (Lang.isString(handler)) {","						handler = {type: handler};","					}","					if (Lang.isObject(handler)) {","						type = handler.type;","						when = (handler.when || 'after');","						fn = handler.fn || '_' + when + toInitialCap(key) + toInitialCap(type);","						args = handler.args;","					} else {","					}","					if (!/^(before|after|delegate)$/.test(when)) {","                    }","					when = when.replace('before','on');","					if (type) {","						if (self[fn]) {","							fn = self[fn];","						} else {","						}","						if (when === 'delegate') {","							if (Lang.isString(target)) {","								if (type === 'key') {","									eh.push(bbx.delegate(type, fn, args, target, self));","								} else {","									eh.push(bbx.delegate(type, fn, target, self, args));","								}","							} else {","							}","						} else {","							t = Lang.isString(target)?bbx.all(target):target;","							if ( type=== 'key') {","								eh.push(t[when](type, fn, args, self));","							} else {","								eh.push(t[when](type, fn, self, args));","							}","						}","					} else {","					}","				});","			});","			this._eventHandles = this._eventHandles.concat(eh);","		},","","		/**","		 * Publishes the events listed in the _PUBLISH static property of each of the classes in the inheritance chain.","		 * If an event has been publishes, the properties set in the descendants will override those in the original publisher.","		 * @method _publishEvents","		 * @private","		 */","		_publishEvents: function () {","			this._forAllXinClasses('_PUBLISH', function (c, options, name) {","				var opts = {};","				Y.each(options || {}, function (value, opt) {","					opts[opt] = opt.substr(opt.length - 2) === 'Fn'?this[value]:value;","				},this);","				this.publish(name,opts);","			});","		},","		/**","		 * Detaches all the events created by <a href=\"method__attachEvents\"><code>_attachEvents</code></a>","		 * @method _detachEvents","		 * @private","		 */","		_detachEvents: function () {","			Y.each(this._eventHandles, function (handle) {","				handle.detach();","			});","		}","","","	};","	/**","	 * <b>**</b> This is a documentation entry only.","	 * This property is not defined in this file, it can be defined by the developer. <b>**</b><br/><br/>","	 * Holds the default template to be used by <a href=\"#method__makeNode\"><code>_makeNode</code></a> when none is explicitly provided.<br/>","	 * The string should contain HTML code with placeholders made of a set of curly braces","	 * enclosing an initial processing code and arguments.","	 * Placeholders can be nested, any of the arguments in a placeholder can be another placeholder.<br/>","	 * The template may also contain regular placeholders as used by <code>Y.substitute</code>,","	 * whose values will be extracted from the second argument to <a href=\"#method__makeNode\"><code>_makeNode</code></a>.","	 * The processing codes are:","","		<ul>","			<li><code>{@ attributeName}</code> configuration attribute values</li>","			<li><code>{p propertyName}</code> instance property values</li>","			<li><code>{m methodName arg1 arg2 ....}</code> return value from instance method.","			The <code>m</code> code should be followed by the","			method name and any number of arguments. The","			placeholder is replaced by the return value or the named method.</li>","			<li><code>{c classNameKey}</code> CSS className generated from the <a href=\"#property__CLASS_NAMES\"><code>_CLASS_NAMES</code></a>","			static property </li>","			<li><code>{s key}</code> string from the <code>strings</code> attribute, using <code>key</code>	as the sub-attribute.</li>","			<li><code>{? arg1 arg2 arg3}</code> If arg1 evaluates to true it returns arg2 otherwise arg3.","			Argument arg1 is usually a nested placeholder.</li>","			<li><code>{1 arg1 arg2 arg3}</code> If arg1 is 1 it returns arg2 otherwise arg3. Used to produce singular/plural text.","			Argument arg1 is usually a nested placeholder.</li>","			<li><code>{n p1 arg1 .... pn argn}</code> It will read the value resulting from the processing code","            <code>p1</code> with argument <code>arg1</code>","			and use that as the object to process the following processing code.","			It takes any number of processing codes and arguments.","			It only works with processing codes that take simple identifiers as arguments, ie.: not {m}.","			<li><code>{}</code> any other value will be	handled just like <code>Y.substitute</code> does. </li>","		</ul>","	 * For placeholders containing several arguments they must be separated by white spaces.","	 * Strings must be enclosed in double quotes, no single quotes allowed.","	 * The backslash is the escape character within strings.","	 * Numbers, null, true and false will be recognized and converted to their native values.","	 * Any argument can be a further placeholder, enclosed in its own set of curly braces.","	 * @property _TEMPLATE","	 * @type String","	 * @static","	 * @protected","	 */","	/**","	 * <b>**</b> This is a documentation entry only.","	 * This property is not defined in this file, it can be defined by the developer. <b>**</b><br/><br/>","	 * Holds an array of strings, each the suffix used to define a CSS className using the","	 * _cssPrefix of each class.  The names listed here are used as the keys into","	 * <a href=\"#property__classNames\"><code>this._classNames</code></a>,","	 * as the argument to the <code>{c}</code> template placeholder","	 * and as keys for the entries in the <a href=\"#property__EVENTS\"><code>_EVENTS</code></a> property.","	 * They are also used by <a href=\"#method__locateNodes\"><code>_locateNodes</code></a> to create the private properties that hold","	 * references to the nodes created.","	 * @property _CLASS_NAMES","	 * @type [String]","	 * @static","	 * @protected","	 */","","	/**","	 * <b>**</b> This is a documentation entry only.","	 * This property is not defined in this file, it can be defined by the developer. <b>**</b><br/><br/>","	 * Lists the attributes whose value should be reflected in the UI.","	 * It contains an object with two properties, <code>BIND</code> and <code>SYNC</code>, each","	 * containing the name of an attribute or an array of names of attributes.","	 * Those listed in <code>BIND</code> will have listeners attached to their change event","	 * so every such change is refreshed in the UI.","	 * Those listed in <code>SYNC</code> will be refreshed when the UI is rendered.","	 * For each entry in either list there should be a method named using the <code>_uiSet</code> prefix, followed by","	 * the name of the attribute, with its first character in uppercase.","	 * This function will receive the value to be set and the source of the change.","	 * @property _ATTRS_2_UI","	 * @type Object","	 * @static","	 * @protected","	 */","","","	/**","	 * <b>**</b> This is a documentation entry only.","	 * This property is not defined in this file, it can be defined by the developer. <b>**</b><br/><br/>","	 * Contains a hash of elements to attach event listeners to.","	 * Each element is identified by the suffix of its generated className,","	 * as declared in the <a href=\"#property__CLASS_NAMES\"><code>_CLASS_NAMES</code></a> property.  <br/>","	 * There are seveal virtual element identifiers,<ul>","	 * <li><code>\"boundingBox\"</code> identifies the boundingBox of the Widget</li>","	 * <li><code>\"content\"</code> its contextBox</li>","	 * <li><code>\"document\"</code> identifies the document where the component is in</li>","	 * <li><code>\"THIS\"</code> identifies this instance</li>","	 * <li><code>\"Y\"</code> identifies the YUI instance of the sandbox</li>","	 * </ul>","	 * If the Y.WidgetStdMod extension is used the <code>\"HEADER\"</code>, <code>\"BODY\"</code>","	 * and <code>\"FOOTER\"</code> identifiers will also be available.<br/>","	 * Each entry contains a type of event to be listened to or an array of events.","	 * Each event can be described by its type (i.e.: <code>\"key\"</code>, <code>\"mousedown\"</code>, etc).","	 * MakeNode will set 'after' event listeners by default, but can be instructed to listen to 'before' ('on') events","	 * or do it by delegation on the boundingBox.","	 * MakeNode will associate this event with a method named <code>\"_after\"</code>,","     * <code>\"_before\"</code> or <code>\"_delegate\"</code> followed by the element identifier with the first character capitalized","	 * and the type of event with the first character capitalized","     * (i.e.: <code>_afterBoundingBoxClick</code>, <code>_afterInputBlur</code>,","     * <code>_afterThisValueChange</code>, <code>_beforeFormSubmit</code>, <code>_delegateListItemClick</code>, etc.).<br/>","	 * Alternatively, the event listener can be described by an object literal containing properties: <ul>","	 * <li><code>type</code> (mandatory) the type of event being listened to</li>","	 * <li><code>fn</code> the name of the method to handle the event.","	 * Since _EVENTS is static, it has no access to <code>this</code> so the name of the method must be specified</li>","	 * <li><code>args</code> extra arguments to be passed to the listener, useful,","	 * for example as a key descriptor for <code>key</code> events.</li>","	 * <li><code>when</code> either 'before', 'after' or 'delegate'.","	 * MakeNode defaults to set 'after' event listeners but can be told to set 'before' ('on') listeners","	 * or to delegate on the BoundingBox the capture of events on inner elements.  Only className keys can be used with 'delegate'.</li></ul>","	 * <pre>_EVENTS: {"," &nbsp; &nbsp; boundingBox: ["," &nbsp; &nbsp;  &nbsp; &nbsp; {"," &nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; &nbsp; type: 'key',"," &nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; &nbsp; fn:'_onDirectionKey',   // calls this._onDirectionKey"," &nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; &nbsp; args:((!Y.UA.opera) ? \"down:\" : \"press:\") + \"38, 40, 33, 34\""," &nbsp; &nbsp;  &nbsp; &nbsp; },"," &nbsp; &nbsp;  &nbsp; &nbsp; 'mousedown' &nbsp; &nbsp;  &nbsp; &nbsp; // calls this._afterBoundingBoxMousedown"," &nbsp; &nbsp; ],"," &nbsp; &nbsp; document: 'mouseup', &nbsp; &nbsp; // calls this._afterDocumentMouseup"," &nbsp; &nbsp; input: 'change', &nbsp; &nbsp;  &nbsp; &nbsp; // calls this._afterInputChange"," &nbsp; &nbsp; form: {type: 'submit', when:'before'}  &nbsp; &nbsp; // calls this._beforeFormSubmit","},</pre>","	 * @property _EVENTS","	 * @type Object","	 * @static","	 * @protected","	 */","","	/**","	 * <b>**</b> This is a documentation entry only.","	 * This property is not defined in this file, it can be defined by the developer. <b>**</b><br/><br/>","	 * Contains a hash of events to be published.","	 * Each element has the name of the event as its key","	 * and the configuration object as its value.","	 * If the event has already been published, the configuration of the event will be modified by the","	 * configuration set in the new definition.","	 * When setting functions use the name of the function, not a function reference.","	 * @property _PUBLISH","	 * @type Object","	 * @static","	 * @protected","	 */","","Y.MakeNode = MakeNode;","","","","}, '@VERSION@');"];
_yuitest_coverage["build/gallery-makenode/gallery-makenode.js"].lines = {"1":0,"13":0,"14":0,"16":0,"19":0,"20":0,"23":0,"24":0,"25":0,"26":0,"28":0,"29":0,"30":0,"34":0,"35":0,"36":0,"37":0,"38":0,"39":0,"40":0,"44":0,"47":0,"48":0,"51":0,"52":0,"53":0,"55":0,"56":0,"58":0,"61":0,"62":0,"63":0,"68":0,"70":0,"72":0,"76":0,"78":0,"79":0,"84":0,"86":0,"87":0,"93":0,"95":0,"103":0,"122":0,"123":0,"124":0,"125":0,"126":0,"127":0,"128":0,"129":0,"130":0,"133":0,"140":0,"141":0,"177":0,"180":0,"183":0,"184":0,"185":0,"186":0,"189":0,"192":0,"195":0,"196":0,"199":0,"200":0,"203":0,"204":0,"206":0,"207":0,"208":0,"209":0,"210":0,"212":0,"214":0,"229":0,"231":0,"232":0,"234":0,"236":0,"237":0,"239":0,"240":0,"242":0,"243":0,"245":0,"246":0,"248":0,"249":0,"255":0,"257":0,"259":0,"260":0,"263":0,"265":0,"267":0,"281":0,"286":0,"288":0,"289":0,"290":0,"291":0,"308":0,"309":0,"310":0,"311":0,"314":0,"326":0,"327":0,"328":0,"329":0,"330":0,"331":0,"334":0,"355":0,"358":0,"359":0,"360":0,"364":0,"365":0,"366":0,"369":0,"370":0,"389":0,"393":0,"394":0,"396":0,"397":0,"401":0,"402":0,"403":0,"404":0,"405":0,"416":0,"417":0,"418":0,"419":0,"420":0,"422":0,"423":0,"424":0,"425":0,"426":0,"428":0,"433":0,"435":0,"444":0,"449":0,"457":0,"458":0,"459":0,"460":0,"461":0,"462":0,"464":0,"465":0,"466":0,"467":0,"468":0,"471":0,"473":0,"474":0,"475":0,"476":0,"479":0,"480":0,"481":0,"482":0,"484":0,"489":0,"490":0,"491":0,"493":0,"500":0,"510":0,"511":0,"512":0,"513":0,"515":0,"524":0,"525":0,"675":0};
_yuitest_coverage["build/gallery-makenode/gallery-makenode.js"].functions = {"(anonymous 3):94":0,"substitute:19":0,"(anonymous 2):14":0,"MakeNode:121":0,"_autoRenderUI:139":0,"\'@\':176":0,"\'p\':179":0,"\'m\':182":0,"\'c\':188":0,"\'s\':191":0,"\'?\':194":0,"\'1\':198":0,"\'n\':202":0,"matcher:230":0,"_parseMakeNodeArgs:228":0,"caller:285":0,"_forAllXinClasses:280":0,"(anonymous 4):309":0,"_makeNode:307":0,"(anonymous 5):327":0,"_substitute:325":0,"(anonymous 6):359":0,"makeName:357":0,"(anonymous 7):365":0,"(anonymous 8):369":0,"_locateNodes:354":0,"(anonymous 9):393":0,"_makeClassNames:388":0,"(anonymous 11):419":0,"(anonymous 13):425":0,"(anonymous 12):422":0,"(anonymous 10):417":0,"_concatUIAttrs:415":0,"toInitialCap:448":0,"(anonymous 15):460":0,"(anonymous 14):457":0,"_attachEvents:443":0,"(anonymous 17):512":0,"(anonymous 16):510":0,"_publishEvents:509":0,"(anonymous 18):524":0,"_detachEvents:523":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-makenode/gallery-makenode.js"].coveredLines = 184;
_yuitest_coverage["build/gallery-makenode/gallery-makenode.js"].coveredFunctions = 43;
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 1);
YUI.add('gallery-makenode', function (Y, NAME) {

/**
 * An extension for Widget to create markup from templates,
 * create CSS classNames, locating elements,
 * assist in attaching events to UI elements and to reflect attribute changes into the UI.
 * All of its members are either protected or private.
 * Developers using MakeNode should use only those marked protected.
 * <b>Enable the Show Protected checkbox to see them</b>.
 * @module gallery-makenode
 * @class MakeNode
 */
	_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 13);
"use strict";
	_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 14);
if (Y.version === '3.4.0') { (function () {
		// See: http://yuilibrary.com/projects/yui3/ticket/2531032
		_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 2)", 14);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 16);
var L = Y.Lang, DUMP = 'dump', SPACE = ' ', LBRACE = '{', RBRACE = '}',
			savedRegExp =  /(~-(\d+)-~)/g, lBraceRegExp = /\{LBRACE\}/g, rBraceRegExp = /\{RBRACE\}/g;

		_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 19);
Y.substitute = function(s, o, f, recurse) {
			_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "substitute", 19);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 20);
var i, j, k, key, v, meta, saved = [], token, dump,
				lidx = s.length;

			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 23);
for (;;) {
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 24);
i = s.lastIndexOf(LBRACE, lidx);
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 25);
if (i < 0) {
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 26);
break;
				}
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 28);
j = s.indexOf(RBRACE, i);
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 29);
if (i + 1 >= j) {
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 30);
break;
				}

				//Extract key and meta info
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 34);
token = s.substring(i + 1, j);
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 35);
key = token;
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 36);
meta = null;
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 37);
k = key.indexOf(SPACE);
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 38);
if (k > -1) {
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 39);
meta = key.substring(k + 1);
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 40);
key = key.substring(0, k);
				}

				// lookup the value
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 44);
v = o[key];

				// if a substitution function was provided, execute it
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 47);
if (f) {
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 48);
v = f(key, v, meta);
				}

				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 51);
if (L.isObject(v)) {
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 52);
if (!Y.dump) {
						_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 53);
v = v.toString();
					} else {
						_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 55);
if (L.isArray(v)) {
							_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 56);
v = Y.dump(v, parseInt(meta, 10));
						} else {
							_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 58);
meta = meta || '';

							// look for the keyword 'dump', if found force obj dump
							_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 61);
dump = meta.indexOf(DUMP);
							_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 62);
if (dump > -1) {
								_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 63);
meta = meta.substring(4);
							}

							// use the toString if it is not the Object toString
							// and the 'dump' meta info was not found
							_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 68);
if (v.toString === Object.prototype.toString ||
								dump > -1) {
								_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 70);
v = Y.dump(v, parseInt(meta, 10));
							} else {
								_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 72);
v = v.toString();
							}
						}
					}
				} else {_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 76);
if (L.isUndefined(v)) {
					// This {block} has no replace string. Save it for later.
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 78);
v = '~-' + saved.length + '-~';
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 79);
saved.push(token);

					// break;
				}}

				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 84);
s = s.substring(0, i) + v + s.substring(j + 1);

				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 86);
if (!recurse) {
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 87);
lidx = i - 1;
				}

			}
			// restore saved {block}s and replace escaped braces

			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 93);
return s
				.replace(savedRegExp, function (str, p1, p2) {
					_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 3)", 94);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 95);
return LBRACE + saved[parseInt(p2,10)] + RBRACE;
				})
				.replace(lBraceRegExp, LBRACE)
				.replace(rBraceRegExp, RBRACE)
			;

		};
	})();}
	_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 103);
var WS = /\s+/,
		NODE = 'Node',
		DOT = '.',
		BBX = 'boundingBox',
		Lang = Y.Lang,
		DUPLICATE = ' for "{name}" defined in class {recentDef} also defined in class {prevDef}',
		parsingRegExp = /^(?:([ \t]+)|("[^"\\]*(?:\\.[^"\\]*)*")|(true)|(false)|(null)|([\-+]?[0-9]*(?:\.[0-9]+)?))/,
		quotesRegExp = /\\"/g,

		/**
		 * Creates CSS classNames from suffixes listed in <a href="#property__CLASS_NAMES"><code>_CLASS_NAMES</code></a>,
		 * stores them in <a href="#property__classNames"><code>this._classNames</code></a>.
		 * Concatenates <a href="#property__ATTRS_2_UI"><code>_ATTRS_2_UI</code></a> into <code>_UI_ATTRS</code>.
		 * Sets listeners to render and destroy events to attach/detach UI events.
		 * If there is no renderUI defined in this class or any of its ancestors (not counting Widget which has a dummy one)
		 * it will add a default one appending the result of processing _TEMPLATE and then call _locateNodes.
		 * @constructor
		 */
		MakeNode = function () {
			_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "MakeNode", 121);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 122);
var self = this;
			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 123);
self._eventHandles = [];
			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 124);
self._makeClassNames();
			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 125);
self._concatUIAttrs();
			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 126);
self._publishEvents();
			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 127);
self.after('render', self._attachEvents, self);
			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 128);
self.after('destroy', self._detachEvents, self);
			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 129);
if (self.renderUI === Y.Widget.prototype.renderUI) {
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 130);
self.renderUI = self._autoRenderUI;
			}
		};
	_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 133);
MakeNode.prototype = {
		/**
		 * Method to be used if no explicit renderUI method is defined.
		 * @method _autoRenderUI
		 * @private
		 */
		_autoRenderUI: function () {
			_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "_autoRenderUI", 139);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 140);
this.get('contentBox').append(this._makeNode());
			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 141);
this._locateNodes();
		},
		/**
		 * An array of event handles returned when attaching listeners to events,
		 * meant to detach them all when destroying the instance.
		 * @property _eventHandles
		 * @type Array
		 * @private
		 */
		_eventHandles:null,
		/**
		 * Contains a hash of CSS classNames generated from the entries in <a href="#property__CLASS_NAMES"><code>_CLASS_NAMES</code></a>
		 * indexed by those same values.
		 * It will also have the following entries added automatically: <ul>
		 * <li><code>boundingBox</code> The className for the boundingBox</li>
		 * <li><code>content</code> The className for the contentBox</li>
		 * <li><code>HEADER</code> The className for the header section of a StdMod if Y.WidgetStdMod has been loaded</li>
		 * <li><code>BODY</code> The className for the body section of a StdMod if Y.WidgetStdMod has been loaded</li>
		 * <li><code>FOOTER</code> The className for the footer section of a StdMod if Y.WidgetStdMod has been loaded</li>
		 * </ul>
		 * @property _classNames
		 * @type Object
		 * @protected
		 */
		_classNames:null,
		/**
		 * Hash listing the template processing codes and the functions to handle each.
		 * The processing functions will receive a string with the arguments that follow the processing code,
		 * and the extra, second argument passed on to _makeNode (or _substitute)
		 * and should return the replacement value for the placeholder.
		 * @property _templateHandlers
		 * @type Object
		 * @private
		 */
		_templateHandlers: {
			'@': function (arg) {
				_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "\'@\'", 176);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 177);
return this.get(arg);
			},
			'p': function (arg) {
				_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "\'p\'", 179);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 180);
return this[arg];
			},
			'm': function (args) {
				_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "\'m\'", 182);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 183);
var method = args.split(WS)[0];
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 184);
args = args.substr(method.length);
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 185);
args = this._parseMakeNodeArgs(args);
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 186);
return this[method].apply(this, args);
			},
			'c': function (arg) {
				_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "\'c\'", 188);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 189);
return this._classNames[arg];
			},
			's': function (arg, extras) {
				_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "\'s\'", 191);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 192);
return this._substitute(this.get('strings')[arg], extras);
			},
			'?': function(args) {
				_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "\'?\'", 194);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 195);
args = this._parseMakeNodeArgs(args);
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 196);
return (!!args[0])?args[1]:args[2];
			},
			'1': function (args) {
				_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "\'1\'", 198);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 199);
args = this._parseMakeNodeArgs(args);
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 200);
return parseInt(args[0],10) ===1?args[1]:args[2];
			},
			'n': function (args, extras) {
				_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "\'n\'", 202);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 203);
var fn, key, value = this;
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 204);
args = args.split(WS);

				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 206);
while (value && args.length) {
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 207);
key = args.shift();
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 208);
fn = this._templateHandlers[key.toLowerCase()];
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 209);
if (!fn) {
						_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 210);
return;
					}
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 212);
value =  fn.call(value, args.shift(), extras);
				}
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 214);
return value;
			}

		},
		/**
		 * Parses the arguments received by the processor of the <code>{m}</code> placeholder.
		 * It recognizes numbers, <code>true</code>, <code>false</code>, <code>null</code>
         * and double quoted strings, each separated by whitespace.
		 * It skips over anything else.
		 * @method _parseMakeNodeArgs
		 * @param arg {String} String to be parsed for arguments
		 * @return {Array} Array of arguments found, each converted to its proper data type
		 * @private
		 */
		_parseMakeNodeArgs: function (arg) {
			_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "_parseMakeNodeArgs", 228);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 229);
var args = [],
				matcher = function (match, i) {
					_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "matcher", 230);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 231);
if (match !== undefined && i) {
						_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 232);
switch (i) {
							case 1:
								_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 234);
break;
							case 2:
								_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 236);
args.push(match.substr(1, match.length - 2).replace(quotesRegExp,'"'));
								_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 237);
break;
							case 3:
								_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 239);
args.push(true);
								_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 240);
break;
							case 4:
								_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 242);
args.push(false);
								_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 243);
break;
							case 5:
								_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 245);
args.push(null);
								_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 246);
break;
							case 6:
								_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 248);
if (match) {
									_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 249);
args.push(parseFloat(match));
								} else {
									// The last parenthesis of the RegExp succeeds on anything else since both the integer and decimal
									// parts of a number are optional, however, it captures nothing, just an empty string.
									// So, any string other than true, false, null or a properly quoted string will end up here.
									// I just consume it one character at a time to avoid looping forever on errors.
									_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 255);
arg = arg.substr(1);
								}
								_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 257);
break;
						}
						_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 259);
arg = arg.substr(match.length);
						_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 260);
return true;
					}
				};
			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 263);
while (arg.length) {

				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 265);
Y.some(parsingRegExp.exec(arg), matcher);
			}
			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 267);
return args;
		},
		/**
		 * Enumerates all the values and keys of a given static properties for all classes in the hierarchy,
		 * starting with the oldest ancestor (Base).
		 * @method _forAllXinClasses
		 * @param x {String} name of the static property to be enumerated
		 * @param fn {function} function to be called for each value.
		 * The function will receive a reference to the class where it occurs, the value of the property
		 * and the key or index.
		 * @private
		 */

		_forAllXinClasses: function(x, fn) {
			_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "_forAllXinClasses", 280);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 281);
var self = this,
				cs = this._getClasses(),
				l = cs.length,
				i, c,
				caller = function (v, k) {
					_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "caller", 285);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 286);
fn.call(self, c, v, k);
				};
			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 288);
for (i = l -1;i >= 0;i--) {
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 289);
c = cs[i];
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 290);
if (c[x]) {
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 291);
Y.each(c[x], caller);
				}
			}
		},
		/**
		 * Processes the template given and returns a <code>Y.Node</code> instance.
		 * @method _makeNode
		 * @param template {String} (optional) Template to process.
		 *        If missing, it will use the first static
         *        <a href="#property__TEMPLATE"><code>_TEMPLATE</code></a>
         *        property found in the inheritance chain.
		 * @param extras {Object} (optional) Hash of extra values to replace into
         *      the template, beyond MakeNode's processing codes.
		 * @return {Y.Node} Instance of <code>Y.Node</code> produced from the template
		 * @protected
		 */
		_makeNode: function(template, extras) {
			_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "_makeNode", 307);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 308);
if (!template) {
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 309);
Y.some(this._getClasses(), function (c) {
					_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 4)", 309);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 310);
template = c._TEMPLATE;
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 311);
return !!template;
				});
			}
			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 314);
return Y.Node.create(this._substitute(template, extras));
		},
		/**
		 * Processes the given template and returns a string
		 * @method _substitute
		 * @param template {String} Template to process.
		 * @param extras {Object} (optional) Hash of extra values to replace into
         *      the template, beyond MakeNode's processing codes.
		 * @return {String} Template with the placeholders replaced.
		 * @protected
		 */
		_substitute: function (template, extras) {
			_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "_substitute", 325);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 326);
var fn;
			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 327);
return Y.substitute(template , extras || {}, Y.bind(function (key, suggested, arg) {
				_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 5)", 327);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 328);
if (arg) {
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 329);
fn = this._templateHandlers[key.toLowerCase()];
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 330);
if (fn) {
						_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 331);
return fn.call(this, arg, extras);
					}
				}
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 334);
return suggested;
			}, this),true);
		},
		/**
		 * Locates the nodes with the CSS classNames listed in the
         * <a href="#property__classNames"><code>this._classNames</code></a> property,
		 * or those specifically requested in its arguments and stores references to them
		 * in properties named after each className key, prefixed with an underscore
		 * and followed by <code>"Node"</code>.
		 * If the className key contains a hyphen followed by a lowercase letter,
         * the hyphen will be dropped and the letter capitalized.
		 * Any other characters invalid for identifiers will be turned into underscores,
		 * thus for the <code>no-label-1</code> className key a <code>_noLabel_1Node</code>
         * property will be created.
		 * @method _locateNodes
		 * @param arg1,.... {String} (optional) If given, list of className keys of the nodes to be located.
		 *        If missing, all the classNames stored in
         *        <a href="#property__classNames"><code>this._classNames</code></a> will be located.
		 * @protected
		 */
		_locateNodes: function () {
			_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "_locateNodes", 354);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 355);
var bbx = this.get(BBX),
				self = this,
				makeName = function (el, name) {
					_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "makeName", 357);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 358);
if (el) {
						_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 359);
self['_' + name.replace(/\-([a-z])/g,function (str, p1) {
							_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 6)", 359);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 360);
return p1.toUpperCase();
						}).replace(/\W/g,'_') + NODE] = el;
					}
				};
			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 364);
if (arguments.length) {
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 365);
Y.each(arguments, function (name) {
					_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 7)", 365);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 366);
makeName(bbx.one(DOT + self._classNames[name]),name);
				});
			} else {
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 369);
Y.each(self._classNames, function(selector, name) {
					_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 8)", 369);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 370);
makeName(bbx.one(DOT + selector), name);
				});
			}
		},
		/**
		 * Looks for static properties called
         * <a href="#property__CLASS_NAMES"><code>_CLASS_NAMES</code></a>
         * in each of the classes of the inheritance chain
		 * and generates CSS classNames based on the <code>_cssPrefix</code> of each
         * class and each of the suffixes listed in each them.
		 * The classNames generated will be stored in
         * <a href="#property__classNames"><code>this._classNames</code></a> indexed by the suffix.
		 * It will also store the classNames of the boundingBox ( boundingBox )and the contentBox ( content ).
		 * If the WidgetStdMod is used, it will also add the classNames for the
         * three sections ( HEADER, BODY, FOOTER )
		 * @method _makeClassNames
		 * @private
		 */
		_makeClassNames: function () {
			_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "_makeClassNames", 388);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 389);
var YCM = Y.ClassNameManager.getClassName,
				defined = {},
				cns = this._classNames = {};

			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 393);
this._forAllXinClasses('_CLASS_NAMES', function(c, name) {
				_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 9)", 393);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 394);
if (defined[name]) {
				} else {
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 396);
cns[name] = YCM(c.NAME.toLowerCase(), name);
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 397);
defined[name] = c.NAME;
				}
			});

			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 401);
cns.content = (cns[BBX] = YCM(this.constructor.NAME.toLowerCase())) + '-content';
			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 402);
if (this.getStdModNode) {
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 403);
cns.HEADER = 'yui3-widget-hd';
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 404);
cns.BODY = 'yui3-widget-bd';
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 405);
cns.FOOTER = 'yui3-widget-ft';
			}
		},
		/**
		 * Concatenates the entries of the <a href="#property__ATTRS_2_UI"><code>_ATTRS_2_UI</code></a>
         * static property of each class in the inheritance chain
		 * into this instance _UI_ATTRS property for the benefit or Widget.  See Widget._UI_ATTRS
		 * @method _concatUIAttrs
		 * @private
		 */
		_concatUIAttrs: function () {
			_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "_concatUIAttrs", 415);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 416);
var defined, u, U = {};
			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 417);
Y.each(['BIND','SYNC'], function (which) {
				_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 10)", 417);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 418);
defined = {};
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 419);
Y.each(this._UI_ATTRS[which], function (name) {
					_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 11)", 419);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 420);
defined[name] = 'Widget';
				});
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 422);
Y.each(this._getClasses(), function (c) {
					_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 12)", 422);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 423);
u = c._ATTRS_2_UI;
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 424);
if (u) {
						_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 425);
Y.each(Y.Array(u[which]), function (name) {
							_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 13)", 425);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 426);
if (defined[name]) {
							} else {
								_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 428);
defined[name] = c.NAME;
							}
						});
					}
				});
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 433);
U[which]= Y.Object.keys(defined);
			},this);
			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 435);
this._UI_ATTRS = U;
		},
		/**
		 * Attaches the events listed in the <a href="#property__EVENTS"><code>_EVENTS</code></a>
         * static property of each class in the inheritance chain.
		 * @method _attachEvents
		 * @private
		 */
		_attachEvents: function () {
			_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "_attachEvents", 443);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 444);
var self = this,
				bbx = self.get(BBX),
				eh = [],
				type, fn, args, when, target, t,
				toInitialCap = function (name) {
					_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "toInitialCap", 448);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 449);
return name.charAt(0).toUpperCase() + name.substr(1);
				},
				equivalents = {
					boundingBox:bbx,
					document:bbx.get('ownerDocument'),
					THIS:self,
					Y:Y
				};
			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 457);
self._forAllXinClasses('_EVENTS', function (c, handlers, key) {
				_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 14)", 457);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 458);
target = equivalents[key] || DOT + self._classNames[key];
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 459);
if (key === 'THIS') {key = 'This';}
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 460);
Y.each(Y.Array(handlers), function (handler) {
					_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 15)", 460);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 461);
if (Lang.isString(handler)) {
						_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 462);
handler = {type: handler};
					}
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 464);
if (Lang.isObject(handler)) {
						_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 465);
type = handler.type;
						_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 466);
when = (handler.when || 'after');
						_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 467);
fn = handler.fn || '_' + when + toInitialCap(key) + toInitialCap(type);
						_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 468);
args = handler.args;
					} else {
					}
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 471);
if (!/^(before|after|delegate)$/.test(when)) {
                    }
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 473);
when = when.replace('before','on');
					_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 474);
if (type) {
						_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 475);
if (self[fn]) {
							_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 476);
fn = self[fn];
						} else {
						}
						_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 479);
if (when === 'delegate') {
							_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 480);
if (Lang.isString(target)) {
								_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 481);
if (type === 'key') {
									_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 482);
eh.push(bbx.delegate(type, fn, args, target, self));
								} else {
									_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 484);
eh.push(bbx.delegate(type, fn, target, self, args));
								}
							} else {
							}
						} else {
							_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 489);
t = Lang.isString(target)?bbx.all(target):target;
							_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 490);
if ( type=== 'key') {
								_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 491);
eh.push(t[when](type, fn, args, self));
							} else {
								_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 493);
eh.push(t[when](type, fn, self, args));
							}
						}
					} else {
					}
				});
			});
			_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 500);
this._eventHandles = this._eventHandles.concat(eh);
		},

		/**
		 * Publishes the events listed in the _PUBLISH static property of each of the classes in the inheritance chain.
		 * If an event has been publishes, the properties set in the descendants will override those in the original publisher.
		 * @method _publishEvents
		 * @private
		 */
		_publishEvents: function () {
			_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "_publishEvents", 509);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 510);
this._forAllXinClasses('_PUBLISH', function (c, options, name) {
				_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 16)", 510);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 511);
var opts = {};
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 512);
Y.each(options || {}, function (value, opt) {
					_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 17)", 512);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 513);
opts[opt] = opt.substr(opt.length - 2) === 'Fn'?this[value]:value;
				},this);
				_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 515);
this.publish(name,opts);
			});
		},
		/**
		 * Detaches all the events created by <a href="method__attachEvents"><code>_attachEvents</code></a>
		 * @method _detachEvents
		 * @private
		 */
		_detachEvents: function () {
			_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "_detachEvents", 523);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 524);
Y.each(this._eventHandles, function (handle) {
				_yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 18)", 524);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 525);
handle.detach();
			});
		}


	};
	/**
	 * <b>**</b> This is a documentation entry only.
	 * This property is not defined in this file, it can be defined by the developer. <b>**</b><br/><br/>
	 * Holds the default template to be used by <a href="#method__makeNode"><code>_makeNode</code></a> when none is explicitly provided.<br/>
	 * The string should contain HTML code with placeholders made of a set of curly braces
	 * enclosing an initial processing code and arguments.
	 * Placeholders can be nested, any of the arguments in a placeholder can be another placeholder.<br/>
	 * The template may also contain regular placeholders as used by <code>Y.substitute</code>,
	 * whose values will be extracted from the second argument to <a href="#method__makeNode"><code>_makeNode</code></a>.
	 * The processing codes are:

		<ul>
			<li><code>{@ attributeName}</code> configuration attribute values</li>
			<li><code>{p propertyName}</code> instance property values</li>
			<li><code>{m methodName arg1 arg2 ....}</code> return value from instance method.
			The <code>m</code> code should be followed by the
			method name and any number of arguments. The
			placeholder is replaced by the return value or the named method.</li>
			<li><code>{c classNameKey}</code> CSS className generated from the <a href="#property__CLASS_NAMES"><code>_CLASS_NAMES</code></a>
			static property </li>
			<li><code>{s key}</code> string from the <code>strings</code> attribute, using <code>key</code>	as the sub-attribute.</li>
			<li><code>{? arg1 arg2 arg3}</code> If arg1 evaluates to true it returns arg2 otherwise arg3.
			Argument arg1 is usually a nested placeholder.</li>
			<li><code>{1 arg1 arg2 arg3}</code> If arg1 is 1 it returns arg2 otherwise arg3. Used to produce singular/plural text.
			Argument arg1 is usually a nested placeholder.</li>
			<li><code>{n p1 arg1 .... pn argn}</code> It will read the value resulting from the processing code
            <code>p1</code> with argument <code>arg1</code>
			and use that as the object to process the following processing code.
			It takes any number of processing codes and arguments.
			It only works with processing codes that take simple identifiers as arguments, ie.: not {m}.
			<li><code>{}</code> any other value will be	handled just like <code>Y.substitute</code> does. </li>
		</ul>
	 * For placeholders containing several arguments they must be separated by white spaces.
	 * Strings must be enclosed in double quotes, no single quotes allowed.
	 * The backslash is the escape character within strings.
	 * Numbers, null, true and false will be recognized and converted to their native values.
	 * Any argument can be a further placeholder, enclosed in its own set of curly braces.
	 * @property _TEMPLATE
	 * @type String
	 * @static
	 * @protected
	 */
	/**
	 * <b>**</b> This is a documentation entry only.
	 * This property is not defined in this file, it can be defined by the developer. <b>**</b><br/><br/>
	 * Holds an array of strings, each the suffix used to define a CSS className using the
	 * _cssPrefix of each class.  The names listed here are used as the keys into
	 * <a href="#property__classNames"><code>this._classNames</code></a>,
	 * as the argument to the <code>{c}</code> template placeholder
	 * and as keys for the entries in the <a href="#property__EVENTS"><code>_EVENTS</code></a> property.
	 * They are also used by <a href="#method__locateNodes"><code>_locateNodes</code></a> to create the private properties that hold
	 * references to the nodes created.
	 * @property _CLASS_NAMES
	 * @type [String]
	 * @static
	 * @protected
	 */

	/**
	 * <b>**</b> This is a documentation entry only.
	 * This property is not defined in this file, it can be defined by the developer. <b>**</b><br/><br/>
	 * Lists the attributes whose value should be reflected in the UI.
	 * It contains an object with two properties, <code>BIND</code> and <code>SYNC</code>, each
	 * containing the name of an attribute or an array of names of attributes.
	 * Those listed in <code>BIND</code> will have listeners attached to their change event
	 * so every such change is refreshed in the UI.
	 * Those listed in <code>SYNC</code> will be refreshed when the UI is rendered.
	 * For each entry in either list there should be a method named using the <code>_uiSet</code> prefix, followed by
	 * the name of the attribute, with its first character in uppercase.
	 * This function will receive the value to be set and the source of the change.
	 * @property _ATTRS_2_UI
	 * @type Object
	 * @static
	 * @protected
	 */


	/**
	 * <b>**</b> This is a documentation entry only.
	 * This property is not defined in this file, it can be defined by the developer. <b>**</b><br/><br/>
	 * Contains a hash of elements to attach event listeners to.
	 * Each element is identified by the suffix of its generated className,
	 * as declared in the <a href="#property__CLASS_NAMES"><code>_CLASS_NAMES</code></a> property.  <br/>
	 * There are seveal virtual element identifiers,<ul>
	 * <li><code>"boundingBox"</code> identifies the boundingBox of the Widget</li>
	 * <li><code>"content"</code> its contextBox</li>
	 * <li><code>"document"</code> identifies the document where the component is in</li>
	 * <li><code>"THIS"</code> identifies this instance</li>
	 * <li><code>"Y"</code> identifies the YUI instance of the sandbox</li>
	 * </ul>
	 * If the Y.WidgetStdMod extension is used the <code>"HEADER"</code>, <code>"BODY"</code>
	 * and <code>"FOOTER"</code> identifiers will also be available.<br/>
	 * Each entry contains a type of event to be listened to or an array of events.
	 * Each event can be described by its type (i.e.: <code>"key"</code>, <code>"mousedown"</code>, etc).
	 * MakeNode will set 'after' event listeners by default, but can be instructed to listen to 'before' ('on') events
	 * or do it by delegation on the boundingBox.
	 * MakeNode will associate this event with a method named <code>"_after"</code>,
     * <code>"_before"</code> or <code>"_delegate"</code> followed by the element identifier with the first character capitalized
	 * and the type of event with the first character capitalized
     * (i.e.: <code>_afterBoundingBoxClick</code>, <code>_afterInputBlur</code>,
     * <code>_afterThisValueChange</code>, <code>_beforeFormSubmit</code>, <code>_delegateListItemClick</code>, etc.).<br/>
	 * Alternatively, the event listener can be described by an object literal containing properties: <ul>
	 * <li><code>type</code> (mandatory) the type of event being listened to</li>
	 * <li><code>fn</code> the name of the method to handle the event.
	 * Since _EVENTS is static, it has no access to <code>this</code> so the name of the method must be specified</li>
	 * <li><code>args</code> extra arguments to be passed to the listener, useful,
	 * for example as a key descriptor for <code>key</code> events.</li>
	 * <li><code>when</code> either 'before', 'after' or 'delegate'.
	 * MakeNode defaults to set 'after' event listeners but can be told to set 'before' ('on') listeners
	 * or to delegate on the BoundingBox the capture of events on inner elements.  Only className keys can be used with 'delegate'.</li></ul>
	 * <pre>_EVENTS: {
 &nbsp; &nbsp; boundingBox: [
 &nbsp; &nbsp;  &nbsp; &nbsp; {
 &nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; &nbsp; type: 'key',
 &nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; &nbsp; fn:'_onDirectionKey',   // calls this._onDirectionKey
 &nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; &nbsp; args:((!Y.UA.opera) ? "down:" : "press:") + "38, 40, 33, 34"
 &nbsp; &nbsp;  &nbsp; &nbsp; },
 &nbsp; &nbsp;  &nbsp; &nbsp; 'mousedown' &nbsp; &nbsp;  &nbsp; &nbsp; // calls this._afterBoundingBoxMousedown
 &nbsp; &nbsp; ],
 &nbsp; &nbsp; document: 'mouseup', &nbsp; &nbsp; // calls this._afterDocumentMouseup
 &nbsp; &nbsp; input: 'change', &nbsp; &nbsp;  &nbsp; &nbsp; // calls this._afterInputChange
 &nbsp; &nbsp; form: {type: 'submit', when:'before'}  &nbsp; &nbsp; // calls this._beforeFormSubmit
},</pre>
	 * @property _EVENTS
	 * @type Object
	 * @static
	 * @protected
	 */

	/**
	 * <b>**</b> This is a documentation entry only.
	 * This property is not defined in this file, it can be defined by the developer. <b>**</b><br/><br/>
	 * Contains a hash of events to be published.
	 * Each element has the name of the event as its key
	 * and the configuration object as its value.
	 * If the event has already been published, the configuration of the event will be modified by the
	 * configuration set in the new definition.
	 * When setting functions use the name of the function, not a function reference.
	 * @property _PUBLISH
	 * @type Object
	 * @static
	 * @protected
	 */

_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 675);
Y.MakeNode = MakeNode;



}, '@VERSION@');
