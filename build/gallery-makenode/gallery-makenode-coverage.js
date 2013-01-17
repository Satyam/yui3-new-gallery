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
_yuitest_coverage["build/gallery-makenode/gallery-makenode.js"].code=["YUI.add('gallery-makenode', function (Y, NAME) {","","/**","An extension for Widget to create markup from templates,","create CSS classNames, locating elements,","assist in attaching events to UI elements and to reflect attribute changes into the UI.","All of its members are either protected or private.","Developers using MakeNode should use only those marked protected.","<b>Enable the Show Protected checkbox to see them</b>.","@module gallery-makenode","@class MakeNode"," */","    \"use strict\";","    var WS = /\\s+/,","        NODE = 'Node',","        DOT = '.',","        BBX = 'boundingBox',","        Lang = Y.Lang,","        DUPLICATE = ' for \"{name}\" defined in class {recentDef} also defined in class {prevDef}',","        bracesRegExp = /\\{\\s*([^{}]+)\\s*\\}/g,","        parsingRegExp = /^(?:([ \\t]+)|(\"[^\"\\\\]*(?:\\\\.[^\"\\\\]*)*\")|(true)|(false)|(null)|([\\-+]?[0-9]*(?:\\.[0-9]+)?))/,","        quotesRegExp = /\\\\\"/g,","","        /**","        Creates CSS classNames from suffixes listed in <a href=\"#property__CLASS_NAMES\">`_CLASS_NAMES`</a>,","        stores them in <a href=\"#property__classNames\">`this._classNames`</a>.","        Concatenates <a href=\"#property__ATTRS_2_UI\">`_ATTRS_2_UI`</a> into `_UI_ATTRS`.","        Sets listeners to render and destroy events to attach/detach UI events.","        If there is no renderUI defined in this class or any of its ancestors (not counting Widget which has a dummy one)","        it will add a default one appending the result of processing _TEMPLATE and then call _locateNodes.","        @constructor","         */","        MakeNode = function () {","            var self = this;","            self._eventHandles = [];","            self._makeClassNames();","            self._concatUIAttrs();","            self._publishEvents();","            self.after('render', self._attachEvents, self);","            self.after('destroy', self._detachEvents, self);","            if (self.renderUI === Y.Widget.prototype.renderUI) {","                self.renderUI = self._autoRenderUI;","            }","        };","    MakeNode.prototype = {","        /**","        Method to be used if no explicit renderUI method is defined.","        @method _autoRenderUI","        @private","         */","        _autoRenderUI: function () {","            this.get('contentBox').append(this._makeNode());","            this._locateNodes();","        },","        /**","        An array of event handles returned when attaching listeners to events,","        meant to detach them all when destroying the instance.","        @property _eventHandles","        @type Array","        @private","         */","        _eventHandles:null,","        /**","        Contains a hash of CSS classNames generated from the entries in <a href=\"#property__CLASS_NAMES\">`_CLASS_NAMES`</a>","        indexed by those same values.","        It will also have the following entries added automatically:","","        * `boundingBox` The className for the boundingBox","        * `content` The className for the contentBox","        * `HEADER` The className for the header section of a StdMod if Y.WidgetStdMod has been loaded","        * `BODY` The className for the body section of a StdMod if Y.WidgetStdMod has been loaded","        * `FOOTER` The className for the footer section of a StdMod if Y.WidgetStdMod has been loaded","","","        @property _classNames","        @type Object","        @protected","         */","        _classNames:null,","        /**","        Hash listing the template processing codes and the functions to handle each.","        The processing functions will receive a string with the arguments that follow the processing code,","        and the extra, second argument passed on to _makeNode (or _substitute)","        and should return the replacement value for the placeholder.","        @property _templateHandlers","        @type Object","        @private","         */","        _templateHandlers: {","            '@': function (arg) {","                return this.get(arg);","            },","            'p': function (arg) {","                return this[arg];","            },","            'm': function (args) {","                var method = args.split(WS)[0];","                args = args.substr(method.length);","                args = this._parseMakeNodeArgs(args);","                return this[method].apply(this, args);","            },","            'c': function (arg) {","                return this._classNames[arg];","            },","            's': function (arg, extras) {","                return this._substitute(this.get('strings')[arg], extras);","            },","            '?': function(args) {","                args = this._parseMakeNodeArgs(args);","                return (!!args[0])?args[1]:args[2];","            },","            '1': function (args) {","                args = this._parseMakeNodeArgs(args);","                return parseInt(args[0],10) ===1?args[1]:args[2];","            },","            'n': function (args, extras) {","                var fn, key, value = this;","                args = args.split(WS);","","                while (value && args.length) {","                    key = args.shift();","                    fn = this._templateHandlers[key.toLowerCase()];","                    if (!fn) {","                        return undefined;","                    }","                    value =  fn.call(value, args.shift(), extras);","                }","                return value;","            }","","        },","        /**","        Parses the arguments received by the processor of the `{m}` placeholder.","        It recognizes numbers, `true`, `false`, `null`","        and double quoted strings, each separated by whitespace.","        It skips over anything else.","        @method _parseMakeNodeArgs","        @param arg {String} String to be parsed for arguments","        @return {Array} Array of arguments found, each converted to its proper data type","        @private","         */","        _parseMakeNodeArgs: function (arg) {","            var args = [],","                matcher = function (match, i) {","                    if (match !== undefined && i) {","                        switch (i) {","                            case 1:","                                break;","                            case 2:","                                args.push(match.substr(1, match.length - 2).replace(quotesRegExp,'\"'));","                                break;","                            case 3:","                                args.push(true);","                                break;","                            case 4:","                                args.push(false);","                                break;","                            case 5:","                                args.push(null);","                                break;","                            case 6:","                                if (match) {","                                    args.push(parseFloat(match));","                                } else {","                                    // The last parenthesis of the RegExp succeeds on anything else since both the integer and decimal","                                    // parts of a number are optional, however, it captures nothing, just an empty string.","                                    // So, any string other than true, false, null or a properly quoted string will end up here.","                                    // I just consume it one character at a time to avoid looping forever on errors.","                                    arg = arg.substr(1);","                                }","                                break;","                        }","                        arg = arg.substr(match.length);","                        return true;","                    }","                };","            while (arg.length) {","","                Y.some(parsingRegExp.exec(arg), matcher);","            }","            return args;","        },","        /**","        Enumerates all the values and keys of a given static properties for all classes in the hierarchy,","        starting with the oldest ancestor (Base).","        @method _forAllXinClasses","        @param x {String} name of the static property to be enumerated","        @param fn {function} function to be called for each value.","        The function will receive a reference to the class where it occurs, the value of the property","        and the key or index.","        @private","         */","","        _forAllXinClasses: function(x, fn) {","            var self = this,","                cs = this._getClasses(),","                l = cs.length,","                i, c,","                caller = function (v, k) {","                    fn.call(self, c, v, k);","                };","            for (i = l -1;i >= 0;i--) {","                c = cs[i];","                if (c[x]) {","                    Y.each(c[x], caller);","                }","            }","        },","        /**","        Processes the template given and returns a `Y.Node` instance.","        @method _makeNode","        @param template {String} (optional) Template to process.","               If missing, it will use the first static","               <a href=\"#property__TEMPLATE\">`_TEMPLATE`</a>","               property found in the inheritance chain.","        @param extras {Object} (optional) Hash of extra values to replace into","             the template, beyond MakeNode's processing codes.","        @return {Y.Node} Instance of `Y.Node` produced from the template","        @protected","         */","        _makeNode: function(template, extras) {","            if (!template) {","                Y.some(this._getClasses(), function (c) {","                    template = c._TEMPLATE;","                    return !!template;","                });","            }","            return Y.Node.create(this._substitute(template, extras));","        },","        /**","        Processes the given template and returns a string","        @method _substitute","        @param template {String} Template to process.","        @param extras {Object} (optional) Hash of extra values to replace into","             the template, beyond MakeNode's processing codes.","        @return {String} Template with the placeholders replaced.","        @protected","         */","        _substitute: function (template, extras) {","            var self = this,","                subs = function (s, count) {","                    s = s.replace(bracesRegExp, function(match, token) {","                        var args = null,","                            index = token.indexOf(' '),","                            fn, value;","                        if (index > -1) {","                            args = token.substring(index + 1);","                            token = token.substring(0, index);","                        }","                        if (args) {","                            fn = self._templateHandlers[token.toLowerCase()];","                            if (fn) {","                                value = fn.call(self, args, extras);","                            }","                        } else {","                            value = extras[token];","                        }","                        if (value === undefined) {","                            value = match;","                        }","                        return value;","","                    });","                    if (count && s.indexOf('{') > -1) {","                        s = subs(s, count -1);","                    }","                    return s;","","                };","           extras = extras || {};","           return subs(template, 3).replace('{LBRACE}','{').replace('{RBRACE}','}');","        },","        /**","        Locates the nodes with the CSS classNames listed in the","        <a href=\"#property__classNames\">`this._classNames`</a> property,","        or those specifically requested in its arguments and stores references to them","        in properties named after each className key, prefixed with an underscore","        and followed by `\"Node\"`.","        If the className key contains a hyphen followed by a lowercase letter,","        the hyphen will be dropped and the letter capitalized.","        Any other characters invalid for identifiers will be turned into underscores,","        thus for the `no-label-1` className key a `_noLabel_1Node`","        property will be created.","        @method _locateNodes","        @param arg1,.... {String} (optional) If given, list of className keys of the nodes to be located.","               If missing, all the classNames stored in","               <a href=\"#property__classNames\">`this._classNames`</a> will be located.","        @protected","         */","        _locateNodes: function () {","            var bbx = this.get(BBX),","                self = this,","                makeName = function (el, name) {","                    if (el) {","                        self['_' + name.replace(/\\-([a-z])/g,function (str, p1) {","                            return p1.toUpperCase();","                        }).replace(/\\W/g,'_') + NODE] = el;","                    }","                };","            if (arguments.length) {","                Y.each(arguments, function (name) {","                    makeName(bbx.one(DOT + self._classNames[name]),name);","                });","            } else {","                Y.each(self._classNames, function(selector, name) {","                    makeName(bbx.one(DOT + selector), name);","                });","            }","        },","        /**","        Looks for static properties called","        <a href=\"#property__CLASS_NAMES\">`_CLASS_NAMES`</a>","        in each of the classes of the inheritance chain","        and generates CSS classNames based on the `_cssPrefix` of each","        class and each of the suffixes listed in each them.","        The classNames generated will be stored in","        <a href=\"#property__classNames\">`this._classNames`</a> indexed by the suffix.","        It will also store the classNames of the boundingBox ( boundingBox )and the contentBox ( content ).","        If the WidgetStdMod is used, it will also add the classNames for the","        three sections ( HEADER, BODY, FOOTER )","        @method _makeClassNames","        @private","         */","        _makeClassNames: function () {","            var YCM = Y.ClassNameManager.getClassName,","                defined = {},","                cns = this._classNames = {};","","            this._forAllXinClasses('_CLASS_NAMES', function(c, name) {","                if (defined[name]) {","                } else {","                    cns[name] = YCM(c.NAME.toLowerCase(), name);","                    defined[name] = c.NAME;","                }","            });","","            cns.content = (cns[BBX] = YCM(this.constructor.NAME.toLowerCase())) + '-content';","            if (this.getStdModNode) {","                cns.HEADER = 'yui3-widget-hd';","                cns.BODY = 'yui3-widget-bd';","                cns.FOOTER = 'yui3-widget-ft';","            }","        },","        /**","        Concatenates the entries of the <a href=\"#property__ATTRS_2_UI\">`_ATTRS_2_UI`</a>","        static property of each class in the inheritance chain","        into this instance _UI_ATTRS property for the benefit or Widget.  See Widget._UI_ATTRS","        @method _concatUIAttrs","        @private","         */","        _concatUIAttrs: function () {","            var defined, u, U = {};","            Y.each(['BIND','SYNC'], function (which) {","                defined = {};","                Y.each(this._UI_ATTRS[which], function (name) {","                    defined[name] = 'Widget';","                });","                Y.each(this._getClasses(), function (c) {","                    u = c._ATTRS_2_UI;","                    if (u) {","                        Y.each(Y.Array(u[which]), function (name) {","                            if (defined[name]) {","                            } else {","                                defined[name] = c.NAME;","                            }","                        });","                    }","                });","                U[which]= Y.Object.keys(defined);","            },this);","            this._UI_ATTRS = U;","        },","        /**","        Attaches the events listed in the <a href=\"#property__EVENTS\">`_EVENTS`</a>","        static property of each class in the inheritance chain.","        @method _attachEvents","        @private","         */","        _attachEvents: function () {","            var self = this,","                bbx = self.get(BBX),","                eh = [],","                type, fn, args, when, target, t,","                toInitialCap = function (name) {","                    return name.charAt(0).toUpperCase() + name.substr(1);","                },","                equivalents = {","                    boundingBox:bbx,","                    document:bbx.get('ownerDocument'),","                    THIS:self,","                    Y:Y","                };","            self._forAllXinClasses('_EVENTS', function (c, handlers, key) {","                target = equivalents[key] || DOT + self._classNames[key];","                if (key === 'THIS') {key = 'This';}","                Y.each(Y.Array(handlers), function (handler) {","                    if (Lang.isString(handler)) {","                        handler = {type: handler};","                    }","                    if (Lang.isObject(handler)) {","                        type = handler.type;","                        when = (handler.when || 'after');","                        fn = handler.fn || '_' + when + toInitialCap(key) + toInitialCap(type);","                        args = handler.args;","                    } else {","                    }","                    if (!/^(before|after|delegate)$/.test(when)) {","                    }","                    when = when.replace('before','on');","                    if (type) {","                        if (self[fn]) {","                            fn = self[fn];","                        } else {","                        }","                        if (when === 'delegate') {","                            if (Lang.isString(target)) {","                                if (type === 'key') {","                                    eh.push(bbx.delegate(type, fn, args, target, self));","                                } else {","                                    eh.push(bbx.delegate(type, fn, target, self, args));","                                }","                            } else {","                            }","                        } else {","                            t = Lang.isString(target)?bbx.all(target):target;","                            if ( type=== 'key') {","                                eh.push(t[when](type, fn, args, self));","                            } else {","                                eh.push(t[when](type, fn, self, args));","                            }","                        }","                    } else {","                    }","                });","            });","            this._eventHandles = this._eventHandles.concat(eh);","        },","","        /**","        Publishes the events listed in the _PUBLISH static property of each of the classes in the inheritance chain.","        If an event has been publishes, the properties set in the descendants will override those in the original publisher.","        @method _publishEvents","        @private","         */","        _publishEvents: function () {","            this._forAllXinClasses('_PUBLISH', function (c, options, name) {","                var opts = {};","                Y.each(options || {}, function (value, opt) {","                    opts[opt] = opt.substr(opt.length - 2) === 'Fn'?this[value]:value;","                },this);","                this.publish(name,opts);","            });","        },","        /**","        Detaches all the events created by <a href=\"method__attachEvents\">`_attachEvents`</a>","        @method _detachEvents","        @private","         */","        _detachEvents: function () {","            Y.each(this._eventHandles, function (handle) {","                handle.detach();","            });","        }","","","    };","    /**","    __This is a documentation entry only.","    This property is not defined in this file, it can be defined by the developer.__","","","    Holds the default template to be used by [`_makeNode`](#method\\_\\_makeNode) when none is explicitly provided.","","    The string should contain HTML code with placeholders made of a set of curly braces","    enclosing an initial processing code and arguments.","    Placeholders can be nested, any of the arguments in a placeholder can be another placeholder.","","    The template may also contain regular placeholders as used by `Y.substitute`,","    whose values will be extracted from the second argument to [`_makeNode`](#method\\_\\_makeNode).","    The processing codes are:","","","","    * `{@ attributeName}` configuration attribute values","    * `{p propertyName}` instance property values","    * `{m methodName arg1 arg2 ....}` return value from instance method.","      The `m` code should be followed by the","      method name and any number of arguments. The","      placeholder is replaced by the return value or the named method.","    * `{c classNameKey}` CSS className generated from the <a href=\"#property__CLASS_NAMES\">`_CLASS_NAMES`</a>","      static property","    * `{s key}` string from the `strings` attribute, using `key`    as the sub-attribute.","    * `{? arg1 arg2 arg3}` If arg1 evaluates to true it returns arg2 otherwise arg3.","      Argument arg1 is usually a nested placeholder.","    * `{1 arg1 arg2 arg3}` If arg1 is 1 it returns arg2 otherwise arg3. Used to produce singular/plural text.","      Argument arg1 is usually a nested placeholder.","    * `{n p1 arg1 .... pn argn}` It will read the value resulting from the processing code","      `p1` with argument `arg1`","      and use that as the object to process the following processing code.","      It takes any number of processing codes and arguments.","      It only works with processing codes that take simple identifiers as arguments, ie.: not {m}.","    * `{}` any other value will be    handled just like `Y.substitute` does.","","","    For placeholders containing several arguments they must be separated by white spaces.","    Strings must be enclosed in double quotes, no single quotes allowed.","    The backslash is the escape character within strings.","    Numbers, null, true and false will be recognized and converted to their native values.","    Any argument can be a further placeholder, enclosed in its own set of curly braces.","    @property _TEMPLATE","    @type String","    @static","    @protected","     */","    /**","    __This is a documentation entry only.","    This property is not defined in this file, it can be defined by the developer.__","","","    Holds an array of strings, each the suffix used to define a CSS className using the","    _cssPrefix of each class.  The names listed here are used as the keys into","    <a href=\"#property__classNames\">`this._classNames`</a>,","    as the argument to the `{c}` template placeholder","    and as keys for the entries in the <a href=\"#property__EVENTS\">`_EVENTS`</a> property.","    They are also used by <a href=\"#method__locateNodes\">`_locateNodes`</a> to create the private properties that hold","    references to the nodes created.","    @property _CLASS_NAMES","    @type [String]","    @static","    @protected","     */","","    /**","    __This is a documentation entry only.","    This property is not defined in this file, it can be defined by the developer.__","","","    Lists the attributes whose value should be reflected in the UI.","    It contains an object with two properties, `BIND` and `SYNC`, each","    containing the name of an attribute or an array of names of attributes.","    Those listed in `BIND` will have listeners attached to their change event","    so every such change is refreshed in the UI.","    Those listed in `SYNC` will be refreshed when the UI is rendered.","    For each entry in either list there should be a method named using the `_uiSet` prefix, followed by","    the name of the attribute, with its first character in uppercase.","    This function will receive the value to be set and the source of the change.","    @property _ATTRS_2_UI","    @type Object","    @static","    @protected","     */","","","    /**","    __This is a documentation entry only.","    This property is not defined in this file, it can be defined by the developer.__","","","    Contains a hash of elements to attach event listeners to.","    Each element is identified by the suffix of its generated className,","    as declared in the <a href=\"#property__CLASS_NAMES\">`_CLASS_NAMES`</a> property.","","    There are seveal virtual element identifiers,","","    * `\"boundingBox\"` identifies the boundingBox of the Widget","    * `\"content\"` its contextBox","    * `\"document\"` identifies the document where the component is in","    * `\"THIS\"` identifies this instance","    * `\"Y\"` identifies the YUI instance of the sandbox","","","    If the Y.WidgetStdMod extension is used the `\"HEADER\"`, `\"BODY\"`","    and `\"FOOTER\"` identifiers will also be available.","","    Each entry contains a type of event to be listened to or an array of events.","    Each event can be described by its type (i.e.: `\"key\"`, `\"mousedown\"`, etc).","    MakeNode will set 'after' event listeners by default, but can be instructed to listen to 'before' ('on') events","    or do it by delegation on the boundingBox.","    MakeNode will associate this event with a method named `\"_after\"`,","    `\"_before\"` or `\"_delegate\"` followed by the element identifier with the first character capitalized","    and the type of event with the first character capitalized","    (i.e.: `_afterBoundingBoxClick`, `_afterInputBlur`,","    `_afterThisValueChange`, `_beforeFormSubmit`, `_delegateListItemClick`, etc.).","","    Alternatively, the event listener can be described by an object literal containing properties:","","    * `type` (mandatory) the type of event being listened to","    * `fn` the name of the method to handle the event.","      Since _EVENTS is static, it has no access to `this` so the name of the method must be specified","    * `args` extra arguments to be passed to the listener, useful,","      for example as a key descriptor for `key` events.","    * `when` either 'before', 'after' or 'delegate'.","      MakeNode defaults to set 'after' event listeners but can be told to set 'before' ('on') listeners","      or to delegate on the BoundingBox the capture of events on inner elements.","      Only className keys can be used with 'delegate'.","","            _EVENTS: {","                 boundingBox: [","                      {","                           type: 'key',","                           fn:'_onDirectionKey',   // calls this._onDirectionKey","                           args:((!Y.UA.opera) ? \"down:\" : \"press:\") + \"38, 40, 33, 34\"","                      },","                      'mousedown'          // calls this._afterBoundingBoxMousedown","                 ],","                 document: 'mouseup',     // calls this._afterDocumentMouseup","                 input: 'change',          // calls this._afterInputChange","                 form: {type: 'submit', when:'before'}      // calls this._beforeFormSubmit","            },","","    @property _EVENTS","    @type Object","    @static","    @protected","     */","","    /**","    __This is a documentation entry only.","    This property is not defined in this file, it can be defined by the developer.__","","","    Contains a hash of events to be published.","    Each element has the name of the event as its key","    and the configuration object as its value.","    If the event has already been published, the configuration of the event will be modified by the","    configuration set in the new definition.","    When setting functions use the name of the function, not a function reference.","    @property _PUBLISH","    @type Object","    @static","    @protected","     */","","Y.MakeNode = MakeNode;","","","","}, '@VERSION@', {\"requires\": [\"classnamemanager\"]});"];
_yuitest_coverage["build/gallery-makenode/gallery-makenode.js"].lines = {"1":0,"13":0,"14":0,"34":0,"35":0,"36":0,"37":0,"38":0,"39":0,"40":0,"41":0,"42":0,"45":0,"52":0,"53":0,"91":0,"94":0,"97":0,"98":0,"99":0,"100":0,"103":0,"106":0,"109":0,"110":0,"113":0,"114":0,"117":0,"118":0,"120":0,"121":0,"122":0,"123":0,"124":0,"126":0,"128":0,"143":0,"145":0,"146":0,"148":0,"150":0,"151":0,"153":0,"154":0,"156":0,"157":0,"159":0,"160":0,"162":0,"163":0,"169":0,"171":0,"173":0,"174":0,"177":0,"179":0,"181":0,"195":0,"200":0,"202":0,"203":0,"204":0,"205":0,"222":0,"223":0,"224":0,"225":0,"228":0,"240":0,"242":0,"243":0,"246":0,"247":0,"248":0,"250":0,"251":0,"252":0,"253":0,"256":0,"258":0,"259":0,"261":0,"264":0,"265":0,"267":0,"270":0,"271":0,"291":0,"294":0,"295":0,"296":0,"300":0,"301":0,"302":0,"305":0,"306":0,"325":0,"329":0,"330":0,"332":0,"333":0,"337":0,"338":0,"339":0,"340":0,"341":0,"352":0,"353":0,"354":0,"355":0,"356":0,"358":0,"359":0,"360":0,"361":0,"362":0,"364":0,"369":0,"371":0,"380":0,"385":0,"393":0,"394":0,"395":0,"396":0,"397":0,"398":0,"400":0,"401":0,"402":0,"403":0,"404":0,"407":0,"409":0,"410":0,"411":0,"412":0,"415":0,"416":0,"417":0,"418":0,"420":0,"425":0,"426":0,"427":0,"429":0,"436":0,"446":0,"447":0,"448":0,"449":0,"451":0,"460":0,"461":0,"634":0};
_yuitest_coverage["build/gallery-makenode/gallery-makenode.js"].functions = {"MakeNode:33":0,"_autoRenderUI:51":0,"\'@\':90":0,"\'p\':93":0,"\'m\':96":0,"\'c\':102":0,"\'s\':105":0,"\'?\':108":0,"\'1\':112":0,"\'n\':116":0,"matcher:144":0,"_parseMakeNodeArgs:142":0,"caller:199":0,"_forAllXinClasses:194":0,"(anonymous 2):223":0,"_makeNode:221":0,"(anonymous 3):242":0,"subs:241":0,"_substitute:239":0,"(anonymous 4):295":0,"makeName:293":0,"(anonymous 5):301":0,"(anonymous 6):305":0,"_locateNodes:290":0,"(anonymous 7):329":0,"_makeClassNames:324":0,"(anonymous 9):355":0,"(anonymous 11):361":0,"(anonymous 10):358":0,"(anonymous 8):353":0,"_concatUIAttrs:351":0,"toInitialCap:384":0,"(anonymous 13):396":0,"(anonymous 12):393":0,"_attachEvents:379":0,"(anonymous 15):448":0,"(anonymous 14):446":0,"_publishEvents:445":0,"(anonymous 16):460":0,"_detachEvents:459":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-makenode/gallery-makenode.js"].coveredLines = 155;
_yuitest_coverage["build/gallery-makenode/gallery-makenode.js"].coveredFunctions = 41;
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 1);
YUI.add('gallery-makenode', function (Y, NAME) {

/**
An extension for Widget to create markup from templates,
create CSS classNames, locating elements,
assist in attaching events to UI elements and to reflect attribute changes into the UI.
All of its members are either protected or private.
Developers using MakeNode should use only those marked protected.
<b>Enable the Show Protected checkbox to see them</b>.
@module gallery-makenode
@class MakeNode
 */
    _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 13);
"use strict";
    _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 14);
var WS = /\s+/,
        NODE = 'Node',
        DOT = '.',
        BBX = 'boundingBox',
        Lang = Y.Lang,
        DUPLICATE = ' for "{name}" defined in class {recentDef} also defined in class {prevDef}',
        bracesRegExp = /\{\s*([^{}]+)\s*\}/g,
        parsingRegExp = /^(?:([ \t]+)|("[^"\\]*(?:\\.[^"\\]*)*")|(true)|(false)|(null)|([\-+]?[0-9]*(?:\.[0-9]+)?))/,
        quotesRegExp = /\\"/g,

        /**
        Creates CSS classNames from suffixes listed in <a href="#property__CLASS_NAMES">`_CLASS_NAMES`</a>,
        stores them in <a href="#property__classNames">`this._classNames`</a>.
        Concatenates <a href="#property__ATTRS_2_UI">`_ATTRS_2_UI`</a> into `_UI_ATTRS`.
        Sets listeners to render and destroy events to attach/detach UI events.
        If there is no renderUI defined in this class or any of its ancestors (not counting Widget which has a dummy one)
        it will add a default one appending the result of processing _TEMPLATE and then call _locateNodes.
        @constructor
         */
        MakeNode = function () {
            _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "MakeNode", 33);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 34);
var self = this;
            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 35);
self._eventHandles = [];
            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 36);
self._makeClassNames();
            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 37);
self._concatUIAttrs();
            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 38);
self._publishEvents();
            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 39);
self.after('render', self._attachEvents, self);
            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 40);
self.after('destroy', self._detachEvents, self);
            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 41);
if (self.renderUI === Y.Widget.prototype.renderUI) {
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 42);
self.renderUI = self._autoRenderUI;
            }
        };
    _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 45);
MakeNode.prototype = {
        /**
        Method to be used if no explicit renderUI method is defined.
        @method _autoRenderUI
        @private
         */
        _autoRenderUI: function () {
            _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "_autoRenderUI", 51);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 52);
this.get('contentBox').append(this._makeNode());
            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 53);
this._locateNodes();
        },
        /**
        An array of event handles returned when attaching listeners to events,
        meant to detach them all when destroying the instance.
        @property _eventHandles
        @type Array
        @private
         */
        _eventHandles:null,
        /**
        Contains a hash of CSS classNames generated from the entries in <a href="#property__CLASS_NAMES">`_CLASS_NAMES`</a>
        indexed by those same values.
        It will also have the following entries added automatically:

        * `boundingBox` The className for the boundingBox
        * `content` The className for the contentBox
        * `HEADER` The className for the header section of a StdMod if Y.WidgetStdMod has been loaded
        * `BODY` The className for the body section of a StdMod if Y.WidgetStdMod has been loaded
        * `FOOTER` The className for the footer section of a StdMod if Y.WidgetStdMod has been loaded


        @property _classNames
        @type Object
        @protected
         */
        _classNames:null,
        /**
        Hash listing the template processing codes and the functions to handle each.
        The processing functions will receive a string with the arguments that follow the processing code,
        and the extra, second argument passed on to _makeNode (or _substitute)
        and should return the replacement value for the placeholder.
        @property _templateHandlers
        @type Object
        @private
         */
        _templateHandlers: {
            '@': function (arg) {
                _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "\'@\'", 90);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 91);
return this.get(arg);
            },
            'p': function (arg) {
                _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "\'p\'", 93);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 94);
return this[arg];
            },
            'm': function (args) {
                _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "\'m\'", 96);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 97);
var method = args.split(WS)[0];
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 98);
args = args.substr(method.length);
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 99);
args = this._parseMakeNodeArgs(args);
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 100);
return this[method].apply(this, args);
            },
            'c': function (arg) {
                _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "\'c\'", 102);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 103);
return this._classNames[arg];
            },
            's': function (arg, extras) {
                _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "\'s\'", 105);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 106);
return this._substitute(this.get('strings')[arg], extras);
            },
            '?': function(args) {
                _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "\'?\'", 108);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 109);
args = this._parseMakeNodeArgs(args);
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 110);
return (!!args[0])?args[1]:args[2];
            },
            '1': function (args) {
                _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "\'1\'", 112);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 113);
args = this._parseMakeNodeArgs(args);
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 114);
return parseInt(args[0],10) ===1?args[1]:args[2];
            },
            'n': function (args, extras) {
                _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "\'n\'", 116);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 117);
var fn, key, value = this;
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 118);
args = args.split(WS);

                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 120);
while (value && args.length) {
                    _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 121);
key = args.shift();
                    _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 122);
fn = this._templateHandlers[key.toLowerCase()];
                    _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 123);
if (!fn) {
                        _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 124);
return undefined;
                    }
                    _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 126);
value =  fn.call(value, args.shift(), extras);
                }
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 128);
return value;
            }

        },
        /**
        Parses the arguments received by the processor of the `{m}` placeholder.
        It recognizes numbers, `true`, `false`, `null`
        and double quoted strings, each separated by whitespace.
        It skips over anything else.
        @method _parseMakeNodeArgs
        @param arg {String} String to be parsed for arguments
        @return {Array} Array of arguments found, each converted to its proper data type
        @private
         */
        _parseMakeNodeArgs: function (arg) {
            _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "_parseMakeNodeArgs", 142);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 143);
var args = [],
                matcher = function (match, i) {
                    _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "matcher", 144);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 145);
if (match !== undefined && i) {
                        _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 146);
switch (i) {
                            case 1:
                                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 148);
break;
                            case 2:
                                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 150);
args.push(match.substr(1, match.length - 2).replace(quotesRegExp,'"'));
                                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 151);
break;
                            case 3:
                                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 153);
args.push(true);
                                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 154);
break;
                            case 4:
                                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 156);
args.push(false);
                                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 157);
break;
                            case 5:
                                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 159);
args.push(null);
                                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 160);
break;
                            case 6:
                                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 162);
if (match) {
                                    _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 163);
args.push(parseFloat(match));
                                } else {
                                    // The last parenthesis of the RegExp succeeds on anything else since both the integer and decimal
                                    // parts of a number are optional, however, it captures nothing, just an empty string.
                                    // So, any string other than true, false, null or a properly quoted string will end up here.
                                    // I just consume it one character at a time to avoid looping forever on errors.
                                    _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 169);
arg = arg.substr(1);
                                }
                                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 171);
break;
                        }
                        _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 173);
arg = arg.substr(match.length);
                        _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 174);
return true;
                    }
                };
            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 177);
while (arg.length) {

                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 179);
Y.some(parsingRegExp.exec(arg), matcher);
            }
            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 181);
return args;
        },
        /**
        Enumerates all the values and keys of a given static properties for all classes in the hierarchy,
        starting with the oldest ancestor (Base).
        @method _forAllXinClasses
        @param x {String} name of the static property to be enumerated
        @param fn {function} function to be called for each value.
        The function will receive a reference to the class where it occurs, the value of the property
        and the key or index.
        @private
         */

        _forAllXinClasses: function(x, fn) {
            _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "_forAllXinClasses", 194);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 195);
var self = this,
                cs = this._getClasses(),
                l = cs.length,
                i, c,
                caller = function (v, k) {
                    _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "caller", 199);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 200);
fn.call(self, c, v, k);
                };
            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 202);
for (i = l -1;i >= 0;i--) {
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 203);
c = cs[i];
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 204);
if (c[x]) {
                    _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 205);
Y.each(c[x], caller);
                }
            }
        },
        /**
        Processes the template given and returns a `Y.Node` instance.
        @method _makeNode
        @param template {String} (optional) Template to process.
               If missing, it will use the first static
               <a href="#property__TEMPLATE">`_TEMPLATE`</a>
               property found in the inheritance chain.
        @param extras {Object} (optional) Hash of extra values to replace into
             the template, beyond MakeNode's processing codes.
        @return {Y.Node} Instance of `Y.Node` produced from the template
        @protected
         */
        _makeNode: function(template, extras) {
            _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "_makeNode", 221);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 222);
if (!template) {
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 223);
Y.some(this._getClasses(), function (c) {
                    _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 2)", 223);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 224);
template = c._TEMPLATE;
                    _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 225);
return !!template;
                });
            }
            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 228);
return Y.Node.create(this._substitute(template, extras));
        },
        /**
        Processes the given template and returns a string
        @method _substitute
        @param template {String} Template to process.
        @param extras {Object} (optional) Hash of extra values to replace into
             the template, beyond MakeNode's processing codes.
        @return {String} Template with the placeholders replaced.
        @protected
         */
        _substitute: function (template, extras) {
            _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "_substitute", 239);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 240);
var self = this,
                subs = function (s, count) {
                    _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "subs", 241);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 242);
s = s.replace(bracesRegExp, function(match, token) {
                        _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 3)", 242);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 243);
var args = null,
                            index = token.indexOf(' '),
                            fn, value;
                        _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 246);
if (index > -1) {
                            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 247);
args = token.substring(index + 1);
                            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 248);
token = token.substring(0, index);
                        }
                        _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 250);
if (args) {
                            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 251);
fn = self._templateHandlers[token.toLowerCase()];
                            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 252);
if (fn) {
                                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 253);
value = fn.call(self, args, extras);
                            }
                        } else {
                            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 256);
value = extras[token];
                        }
                        _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 258);
if (value === undefined) {
                            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 259);
value = match;
                        }
                        _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 261);
return value;

                    });
                    _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 264);
if (count && s.indexOf('{') > -1) {
                        _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 265);
s = subs(s, count -1);
                    }
                    _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 267);
return s;

                };
           _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 270);
extras = extras || {};
           _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 271);
return subs(template, 3).replace('{LBRACE}','{').replace('{RBRACE}','}');
        },
        /**
        Locates the nodes with the CSS classNames listed in the
        <a href="#property__classNames">`this._classNames`</a> property,
        or those specifically requested in its arguments and stores references to them
        in properties named after each className key, prefixed with an underscore
        and followed by `"Node"`.
        If the className key contains a hyphen followed by a lowercase letter,
        the hyphen will be dropped and the letter capitalized.
        Any other characters invalid for identifiers will be turned into underscores,
        thus for the `no-label-1` className key a `_noLabel_1Node`
        property will be created.
        @method _locateNodes
        @param arg1,.... {String} (optional) If given, list of className keys of the nodes to be located.
               If missing, all the classNames stored in
               <a href="#property__classNames">`this._classNames`</a> will be located.
        @protected
         */
        _locateNodes: function () {
            _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "_locateNodes", 290);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 291);
var bbx = this.get(BBX),
                self = this,
                makeName = function (el, name) {
                    _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "makeName", 293);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 294);
if (el) {
                        _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 295);
self['_' + name.replace(/\-([a-z])/g,function (str, p1) {
                            _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 4)", 295);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 296);
return p1.toUpperCase();
                        }).replace(/\W/g,'_') + NODE] = el;
                    }
                };
            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 300);
if (arguments.length) {
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 301);
Y.each(arguments, function (name) {
                    _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 5)", 301);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 302);
makeName(bbx.one(DOT + self._classNames[name]),name);
                });
            } else {
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 305);
Y.each(self._classNames, function(selector, name) {
                    _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 6)", 305);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 306);
makeName(bbx.one(DOT + selector), name);
                });
            }
        },
        /**
        Looks for static properties called
        <a href="#property__CLASS_NAMES">`_CLASS_NAMES`</a>
        in each of the classes of the inheritance chain
        and generates CSS classNames based on the `_cssPrefix` of each
        class and each of the suffixes listed in each them.
        The classNames generated will be stored in
        <a href="#property__classNames">`this._classNames`</a> indexed by the suffix.
        It will also store the classNames of the boundingBox ( boundingBox )and the contentBox ( content ).
        If the WidgetStdMod is used, it will also add the classNames for the
        three sections ( HEADER, BODY, FOOTER )
        @method _makeClassNames
        @private
         */
        _makeClassNames: function () {
            _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "_makeClassNames", 324);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 325);
var YCM = Y.ClassNameManager.getClassName,
                defined = {},
                cns = this._classNames = {};

            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 329);
this._forAllXinClasses('_CLASS_NAMES', function(c, name) {
                _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 7)", 329);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 330);
if (defined[name]) {
                } else {
                    _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 332);
cns[name] = YCM(c.NAME.toLowerCase(), name);
                    _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 333);
defined[name] = c.NAME;
                }
            });

            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 337);
cns.content = (cns[BBX] = YCM(this.constructor.NAME.toLowerCase())) + '-content';
            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 338);
if (this.getStdModNode) {
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 339);
cns.HEADER = 'yui3-widget-hd';
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 340);
cns.BODY = 'yui3-widget-bd';
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 341);
cns.FOOTER = 'yui3-widget-ft';
            }
        },
        /**
        Concatenates the entries of the <a href="#property__ATTRS_2_UI">`_ATTRS_2_UI`</a>
        static property of each class in the inheritance chain
        into this instance _UI_ATTRS property for the benefit or Widget.  See Widget._UI_ATTRS
        @method _concatUIAttrs
        @private
         */
        _concatUIAttrs: function () {
            _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "_concatUIAttrs", 351);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 352);
var defined, u, U = {};
            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 353);
Y.each(['BIND','SYNC'], function (which) {
                _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 8)", 353);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 354);
defined = {};
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 355);
Y.each(this._UI_ATTRS[which], function (name) {
                    _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 9)", 355);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 356);
defined[name] = 'Widget';
                });
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 358);
Y.each(this._getClasses(), function (c) {
                    _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 10)", 358);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 359);
u = c._ATTRS_2_UI;
                    _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 360);
if (u) {
                        _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 361);
Y.each(Y.Array(u[which]), function (name) {
                            _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 11)", 361);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 362);
if (defined[name]) {
                            } else {
                                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 364);
defined[name] = c.NAME;
                            }
                        });
                    }
                });
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 369);
U[which]= Y.Object.keys(defined);
            },this);
            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 371);
this._UI_ATTRS = U;
        },
        /**
        Attaches the events listed in the <a href="#property__EVENTS">`_EVENTS`</a>
        static property of each class in the inheritance chain.
        @method _attachEvents
        @private
         */
        _attachEvents: function () {
            _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "_attachEvents", 379);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 380);
var self = this,
                bbx = self.get(BBX),
                eh = [],
                type, fn, args, when, target, t,
                toInitialCap = function (name) {
                    _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "toInitialCap", 384);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 385);
return name.charAt(0).toUpperCase() + name.substr(1);
                },
                equivalents = {
                    boundingBox:bbx,
                    document:bbx.get('ownerDocument'),
                    THIS:self,
                    Y:Y
                };
            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 393);
self._forAllXinClasses('_EVENTS', function (c, handlers, key) {
                _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 12)", 393);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 394);
target = equivalents[key] || DOT + self._classNames[key];
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 395);
if (key === 'THIS') {key = 'This';}
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 396);
Y.each(Y.Array(handlers), function (handler) {
                    _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 13)", 396);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 397);
if (Lang.isString(handler)) {
                        _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 398);
handler = {type: handler};
                    }
                    _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 400);
if (Lang.isObject(handler)) {
                        _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 401);
type = handler.type;
                        _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 402);
when = (handler.when || 'after');
                        _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 403);
fn = handler.fn || '_' + when + toInitialCap(key) + toInitialCap(type);
                        _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 404);
args = handler.args;
                    } else {
                    }
                    _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 407);
if (!/^(before|after|delegate)$/.test(when)) {
                    }
                    _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 409);
when = when.replace('before','on');
                    _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 410);
if (type) {
                        _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 411);
if (self[fn]) {
                            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 412);
fn = self[fn];
                        } else {
                        }
                        _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 415);
if (when === 'delegate') {
                            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 416);
if (Lang.isString(target)) {
                                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 417);
if (type === 'key') {
                                    _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 418);
eh.push(bbx.delegate(type, fn, args, target, self));
                                } else {
                                    _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 420);
eh.push(bbx.delegate(type, fn, target, self, args));
                                }
                            } else {
                            }
                        } else {
                            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 425);
t = Lang.isString(target)?bbx.all(target):target;
                            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 426);
if ( type=== 'key') {
                                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 427);
eh.push(t[when](type, fn, args, self));
                            } else {
                                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 429);
eh.push(t[when](type, fn, self, args));
                            }
                        }
                    } else {
                    }
                });
            });
            _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 436);
this._eventHandles = this._eventHandles.concat(eh);
        },

        /**
        Publishes the events listed in the _PUBLISH static property of each of the classes in the inheritance chain.
        If an event has been publishes, the properties set in the descendants will override those in the original publisher.
        @method _publishEvents
        @private
         */
        _publishEvents: function () {
            _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "_publishEvents", 445);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 446);
this._forAllXinClasses('_PUBLISH', function (c, options, name) {
                _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 14)", 446);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 447);
var opts = {};
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 448);
Y.each(options || {}, function (value, opt) {
                    _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 15)", 448);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 449);
opts[opt] = opt.substr(opt.length - 2) === 'Fn'?this[value]:value;
                },this);
                _yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 451);
this.publish(name,opts);
            });
        },
        /**
        Detaches all the events created by <a href="method__attachEvents">`_attachEvents`</a>
        @method _detachEvents
        @private
         */
        _detachEvents: function () {
            _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "_detachEvents", 459);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 460);
Y.each(this._eventHandles, function (handle) {
                _yuitest_coverfunc("build/gallery-makenode/gallery-makenode.js", "(anonymous 16)", 460);
_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 461);
handle.detach();
            });
        }


    };
    /**
    __This is a documentation entry only.
    This property is not defined in this file, it can be defined by the developer.__


    Holds the default template to be used by [`_makeNode`](#method\_\_makeNode) when none is explicitly provided.

    The string should contain HTML code with placeholders made of a set of curly braces
    enclosing an initial processing code and arguments.
    Placeholders can be nested, any of the arguments in a placeholder can be another placeholder.

    The template may also contain regular placeholders as used by `Y.substitute`,
    whose values will be extracted from the second argument to [`_makeNode`](#method\_\_makeNode).
    The processing codes are:



    * `{@ attributeName}` configuration attribute values
    * `{p propertyName}` instance property values
    * `{m methodName arg1 arg2 ....}` return value from instance method.
      The `m` code should be followed by the
      method name and any number of arguments. The
      placeholder is replaced by the return value or the named method.
    * `{c classNameKey}` CSS className generated from the <a href="#property__CLASS_NAMES">`_CLASS_NAMES`</a>
      static property
    * `{s key}` string from the `strings` attribute, using `key`    as the sub-attribute.
    * `{? arg1 arg2 arg3}` If arg1 evaluates to true it returns arg2 otherwise arg3.
      Argument arg1 is usually a nested placeholder.
    * `{1 arg1 arg2 arg3}` If arg1 is 1 it returns arg2 otherwise arg3. Used to produce singular/plural text.
      Argument arg1 is usually a nested placeholder.
    * `{n p1 arg1 .... pn argn}` It will read the value resulting from the processing code
      `p1` with argument `arg1`
      and use that as the object to process the following processing code.
      It takes any number of processing codes and arguments.
      It only works with processing codes that take simple identifiers as arguments, ie.: not {m}.
    * `{}` any other value will be    handled just like `Y.substitute` does.


    For placeholders containing several arguments they must be separated by white spaces.
    Strings must be enclosed in double quotes, no single quotes allowed.
    The backslash is the escape character within strings.
    Numbers, null, true and false will be recognized and converted to their native values.
    Any argument can be a further placeholder, enclosed in its own set of curly braces.
    @property _TEMPLATE
    @type String
    @static
    @protected
     */
    /**
    __This is a documentation entry only.
    This property is not defined in this file, it can be defined by the developer.__


    Holds an array of strings, each the suffix used to define a CSS className using the
    _cssPrefix of each class.  The names listed here are used as the keys into
    <a href="#property__classNames">`this._classNames`</a>,
    as the argument to the `{c}` template placeholder
    and as keys for the entries in the <a href="#property__EVENTS">`_EVENTS`</a> property.
    They are also used by <a href="#method__locateNodes">`_locateNodes`</a> to create the private properties that hold
    references to the nodes created.
    @property _CLASS_NAMES
    @type [String]
    @static
    @protected
     */

    /**
    __This is a documentation entry only.
    This property is not defined in this file, it can be defined by the developer.__


    Lists the attributes whose value should be reflected in the UI.
    It contains an object with two properties, `BIND` and `SYNC`, each
    containing the name of an attribute or an array of names of attributes.
    Those listed in `BIND` will have listeners attached to their change event
    so every such change is refreshed in the UI.
    Those listed in `SYNC` will be refreshed when the UI is rendered.
    For each entry in either list there should be a method named using the `_uiSet` prefix, followed by
    the name of the attribute, with its first character in uppercase.
    This function will receive the value to be set and the source of the change.
    @property _ATTRS_2_UI
    @type Object
    @static
    @protected
     */


    /**
    __This is a documentation entry only.
    This property is not defined in this file, it can be defined by the developer.__


    Contains a hash of elements to attach event listeners to.
    Each element is identified by the suffix of its generated className,
    as declared in the <a href="#property__CLASS_NAMES">`_CLASS_NAMES`</a> property.

    There are seveal virtual element identifiers,

    * `"boundingBox"` identifies the boundingBox of the Widget
    * `"content"` its contextBox
    * `"document"` identifies the document where the component is in
    * `"THIS"` identifies this instance
    * `"Y"` identifies the YUI instance of the sandbox


    If the Y.WidgetStdMod extension is used the `"HEADER"`, `"BODY"`
    and `"FOOTER"` identifiers will also be available.

    Each entry contains a type of event to be listened to or an array of events.
    Each event can be described by its type (i.e.: `"key"`, `"mousedown"`, etc).
    MakeNode will set 'after' event listeners by default, but can be instructed to listen to 'before' ('on') events
    or do it by delegation on the boundingBox.
    MakeNode will associate this event with a method named `"_after"`,
    `"_before"` or `"_delegate"` followed by the element identifier with the first character capitalized
    and the type of event with the first character capitalized
    (i.e.: `_afterBoundingBoxClick`, `_afterInputBlur`,
    `_afterThisValueChange`, `_beforeFormSubmit`, `_delegateListItemClick`, etc.).

    Alternatively, the event listener can be described by an object literal containing properties:

    * `type` (mandatory) the type of event being listened to
    * `fn` the name of the method to handle the event.
      Since _EVENTS is static, it has no access to `this` so the name of the method must be specified
    * `args` extra arguments to be passed to the listener, useful,
      for example as a key descriptor for `key` events.
    * `when` either 'before', 'after' or 'delegate'.
      MakeNode defaults to set 'after' event listeners but can be told to set 'before' ('on') listeners
      or to delegate on the BoundingBox the capture of events on inner elements.
      Only className keys can be used with 'delegate'.

            _EVENTS: {
                 boundingBox: [
                      {
                           type: 'key',
                           fn:'_onDirectionKey',   // calls this._onDirectionKey
                           args:((!Y.UA.opera) ? "down:" : "press:") + "38, 40, 33, 34"
                      },
                      'mousedown'          // calls this._afterBoundingBoxMousedown
                 ],
                 document: 'mouseup',     // calls this._afterDocumentMouseup
                 input: 'change',          // calls this._afterInputChange
                 form: {type: 'submit', when:'before'}      // calls this._beforeFormSubmit
            },

    @property _EVENTS
    @type Object
    @static
    @protected
     */

    /**
    __This is a documentation entry only.
    This property is not defined in this file, it can be defined by the developer.__


    Contains a hash of events to be published.
    Each element has the name of the event as its key
    and the configuration object as its value.
    If the event has already been published, the configuration of the event will be modified by the
    configuration set in the new definition.
    When setting functions use the name of the function, not a function reference.
    @property _PUBLISH
    @type Object
    @static
    @protected
     */

_yuitest_coverline("build/gallery-makenode/gallery-makenode.js", 634);
Y.MakeNode = MakeNode;



}, '@VERSION@', {"requires": ["classnamemanager"]});
