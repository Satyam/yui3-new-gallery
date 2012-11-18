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
_yuitest_coverage["build/gallery-timeline/gallery-timeline.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-timeline/gallery-timeline.js",
    code: []
};
_yuitest_coverage["build/gallery-timeline/gallery-timeline.js"].code=["YUI.add('gallery-timeline', function (Y, NAME) {","","/*global YUI*/","/**"," * Shows in the browser timeline files produced by the program from <a href=\"http://thetimelineproj.sourceforge.net/\">The Timeline Project</a>."," * @module timeline"," */","/**"," * Displays within a given container a timeline file from the given URL"," * @class Y.Timeline"," * @extends Y.Base"," * @constructor"," * @param config {Object} configuration options"," */","","\"use strict\";","","var Lang = Y.Lang,","	REGION = 'region',","	START = 'start',","	END = 'end',","	LEFT = 'left',","	URL = 'url',","	CONTAINER = 'container',","	LOADED = 'loaded',","	CHANGE = 'Change',","	EVENT = 'event',","	CATEGORIES = 'categories',","	TOP = 'top',","	CENTER = 'center',","	RIGHT = 'right',","	PX = 'px',","	STRINGS = 'strings',","	TIMELINE = 'timeline',","	SHOW_DESCR = 'showDescr',","	cName = function() {","		return Y.ClassNameManager.getClassName.apply(this, [TIMELINE].concat(Y.Array(arguments)));","	},","	BLOCK_TEMPLATE = Y.Node.create('<div class=\"' + cName('bar') + '\" />'),","	GRID_TEMPLATE = Y.Node.create('<div class=\"' + cName('grid') + '\"/>'),","	POINTER_TEMPLATE = Y.Node.create('<div class=\"' + cName('pointer') + '\" />'),","	CATEGORIES_TEMPLATE = '<div class=\"' + cName('cats') + '\">{categories}<p class=\"' + cName('noCat') + '\">{noCategory}</p></div>';","","Y.Timeline = Y.Base.create(","	TIMELINE,","	Y.Base,","	[],","	{","		/**","		 * Stores the events to display.It contains the following properties, those starting with underscore are used internally:<ul>","		 * <li><b>start</b>: {timestamp} start time in milliseconds</li>","		 * <li><b>end</b>: {timestamp} end time in milliseconds</li>","		 * <li><b>text</b>: {string} text to be shown on the bar</li>","		 * <li><b>fuzzy</b>: {Boolean} the start and end days are uncertain </li>","		 * <li><b>locked</b>: {Boolean} the event cannot be edited (not relevant for this viewer </li>","		 * <li><b>endsToday</b>: {Boolean} the end day is today</li>","		 * <li><b>description</b>: {string} extended description</li>","		 * <li><b>icon</b>: {string} Base64-encoded image to go along the extended description</li>","		 * <li><b>category</b>: {string} the category this event belongs to</li>","		 * <li><b>_bar</b>: {Y.Node} reference to the Node for the bar representing this event</li>","		 * <li><b>_pointer</b>: {Y.Node} for point events, reference to the Node for the date pointer</li>","		 * <li><b>_isPoint</b>: {Boolean} signals that the event is a point event or a range event","		 *      that has become too narrow to be displayed as a range</li>","		 * </ul>","		 * @property _events","		 * @type Object []","		 * @default null","		 */","		_events: null,","		/**","		 * Display mode for the bars, to help calculate its location and handle crowding.","		 * Can be standard (0), , compact (1) or overlappying (2)","		 * @property _mode","		 * @type {integer}","		 * @default 0","		 */","		_mode: 0,","		/**","		 * Sets up listeners to respond to setting the URL,the CONTAINER or to the arrival of the timeline file.","		 * @method initializer","		 * @param cfg {Object} configuration attributes","		 * @protected","		 */","		initializer: function (cfg) {","			this._events = [];","			this.set(STRINGS, Y.Intl.get('gallery-' + TIMELINE));","			this.after(URL + CHANGE, this._load);","			this.after(CONTAINER + CHANGE, this._render);","			this.after(LOADED + CHANGE, this._render);","			if (cfg && cfg[URL]) {","				this._load();","			}","			if (cfg && cfg[CONTAINER]) {","				this._render();","			}","			this.publish(SHOW_DESCR, {","				defaultFn: this._defShowDescr","			});","		},","		/**","		 * Returns the boolean value of a given tag in an XML document","		 * @method _readBoolean","		 * @param xml {XMLDocument} The XML document or fragment to parse","		 * @param tag {String} The tag for the value sought","		 * @return {Boolean} the value read or null if not found","		 * @private","		 */","		_readBoolean: function (xml, tag) {","			var val = this._readValue(xml, tag);","			return val?val.toLowerCase() === 'true':null;","		},","		/**","		 * Returns and parses a date from a given tag in an XML document","		 * @method _readDate","		 * @param xml {XMLDocument} The XML document or fragment to parse","		 * @param tag {String} The tag for the value sought","		 * @return {Date} the value read or null if not found","		 * @private","		 */","		_readDate: function (xml, tag) {","			var date, time,","				val = this._readValue(xml, tag);","			if (val) {","				val = val.split(' ');","				date = val[0].split('-');","				time = val[1].split(':');","				return new Date(date[0], date[1] -1 , date[2], time[0], time[1], time[2]).getTime();","			} else {","				return null;","			}","		},","		/**","		 * Returns and parses a color value from a given tag in an XML document","		 * @method _readColor","		 * @param xml {XMLDocument} The XML document or fragment to parse","		 * @param tag {String} The tag for the value sought","		 * @return {String} the RGB value as #rrggbb read or null if not found","		 * @private","		 */","		_readColor: function(xml, tag) {","			var c = this._readValue(xml, tag),","				pad = function(val) {","					return ('00' + parseInt(val,10).toString(16)).substr(-2);","				};","","			if (c) {","				c = c.split(',');","				return '#' + pad(c[0]) + pad(c[1]) + pad(c[2]);","			} else {","				return null;","			}","		},","		/**","		 * Returns the textual contents from a given tag in an XML document","		 * @method _readValue","		 * @param xml {XMLDocument} The XML document or fragment to parse","		 * @param tag {String} The tag for the value sought","		 * @return {String} the content read or null if not found","		 * @private","		 */","		_readValue: function(xml, tag) {","			var el = this._readEl(xml,tag);","			return el?el.textContent:null;","		},","		/**","		 * Returns the XML element from given tag in an XML document","		 * @method _readEl","		 * @param xml {XMLDocument} The XML document or fragment to parse","		 * @param tag {String} The tag for the value sought","		 * @return {XMLElement} the element read or null if not found","		 * @private","		 */","		_readEl: function (xml, tag) {","			var el = xml.getElementsByTagName(tag);","			return (el && el.length)?el[0]:null;","		},","		/**","		 * Reads the categories information","		 * @method _xmlReadCategories","		 * @param cats {XMLFragment} collection of categories","		 * @private","		 */","		_xmlReadCategories: function(cats) {","			var c = {};","			Y.each(cats.children, function (cat) {","				c[this._readValue(cat,'name')] = {","					color:this._readColor(cat,'color'),","					fontColor:this._readColor(cat,'font_color')","				};","			},this);","			this.set(CATEGORIES, c);","","		},","		/**","		 * Reads the view information","		 * @method _xmlReadView","		 * @param view {XMLFragment} view information","		 * @private","		 */","		_xmlReadView: function (view) {","			var range = this._readEl(view,'displayed_period'),","				cats = this.get(CATEGORIES),","				hiddenCat = this._readEl(view, 'hidden_categories').firstChild;","","			if (range) {","				this.set(START, this._readDate(range, START));","				this.set(END, this._readDate(range, END));","			}","			while (hiddenCat) {","				cats[hiddenCat.textContent].hidden = true;","				hiddenCat = hiddenCat.nextChild;","			}","		},","		/**","		 * Reads the events to show","		 * @method _xmlReadEvents","		 * @param cats {XMLFragment} collection of events","		 * @private","		 */","		_xmlReadEvents: function (events) {","			this._events = [];","			Y.each(events.children, function (event) {","				this._events.push({","					start: this._readDate(event, START),","					end: this._readDate(event,END),","					text: this._readValue(event,'text'),","					fuzzy: this._readBoolean(event,'fuzzy'),","					locked: this._readBoolean(event,'locked'),","					endsToday: this._readBoolean(event,'ends_today'),","					category: this._readValue(event, 'category'),","					description: this._readValue(event, 'description'),","					icon: this._readValue(event, 'icon')","				});","","			}, this);","","		},","		/**","		 * Sugar method to set the URL of the timeline file","		 * @method load","		 * @param url {String} URL of the timeline file","		 * @chainable","		 */","		load: function (url) {","			this.set(URL, url);","			return this;","		},","		/**","		 * Requests the timeline information from the configured URL and parses it when it arrives.","		 * Signals its arrival by setting the 'loaded' configuration attribute","		 * @method _load","		 * @private","		 */","		_load: function () {","			var self = this;","			self.set(LOADED, false);","			Y.io(self.get(URL), {","				on: {","					success: function (id, o) {","						var xml = o.responseXML;","						self._xmlReadCategories(self._readEl(xml,CATEGORIES));","						self._xmlReadView(self._readEl(xml,'view'));","						self._xmlReadEvents(self._readEl(xml,'events'));","						self.set(LOADED, true);","					}","				}","			});","","","		},","		/**","		 * Adjusts the region information for the given node to make it relative to the container position","		 * @method _getRegion","		 * @param node {Y.Node} node to find the region","		 * @return {Y.Region} region of the node relative to the container","		 * @private","		 */","		_getRegion: function (node) {","			var reg = node.get(REGION);","			reg.left -= this._left;","			reg.top -= this._top;","			return reg;","		},","		/**","		 * Draws the bars corresponding to the events in the container","		 * @method _resize","		 * @param container {Y.Node} optional, the container for the bars.  It reads the container attribute if none given","		 * @private","		 */","		_resize: function (container) {","			container = container || this.get(CONTAINER);","","			var start = this.get(START),","				end = this.get(END),","				rightEdge = this._width,","				height = this._height,","				scale = rightEdge / ( end - start),","				cats = this.get(CATEGORIES),","				bar, width, left, changed = false, region, pointer,hasNoCategory = false,","				TODAY = this.get(STRINGS).today,","				formatDate = function(date) {","					return Y.DataType.Date.format(new Date(date), {format:'%x'});","				};","","			Y.each(this._events, function(event) {","				if (event.category && cats[event.category].hidden) {","					return;","				}","				bar = event._bar || BLOCK_TEMPLATE.cloneNode();","				pointer = event._pointer;","				left = Math.round((event.start - start) * scale);","				width = Math.round(((event.endsToday?Date.now():event.end) - event.start) * scale);","				if (left + width < 0 || left > rightEdge) {","					if (event._bar) {","						event._bar.remove(true);","						event._bar = null;","						if (pointer) {","							pointer.remove(true);","							event._pointer = pointer = null;","						}","					}","					changed = true;","					return;","				}","				event._isPoint = width === 0;","				bar.setStyles({","					left: left +PX,","					width: width?width + PX:'auto'","				});","				if (!event._bar) {","					event._bar = bar;","					if (event.category) {","						bar.setStyles({","							backgroundColor: cats[event.category].color,","							color: cats[event.category].fontColor","						});","					} else {","						hasNoCategory = true;","					}","					bar.setContent(event.text);","					bar.set('title', event.text + ': ' + formatDate(event.start) + ' - ' +  (event.endsToday?TODAY:formatDate(event.end)));","					if (event.fuzzy) {","						bar.addClass(cName('fuzzy'));","					}","					if (event.description || event.icon) {","						bar.addClass(cName('hasDescr'));","					}","					bar.setData(EVENT,event);","				}","				if (!bar.inDoc()) {","					container.append(bar);","					changed = true;","				}","				if (event._isPoint) {","					region = this._getRegion(bar);","					bar.setStyle(LEFT, region.left - region.width / 2 + PX);","					if (!pointer) {","						event._pointer = pointer = POINTER_TEMPLATE.cloneNode();","						pointer.setStyle(TOP, height / 2 + PX);","					}","				} else {","					if (pointer) {","						pointer.remove(true);","						event._pointer = pointer = null;","						changed = true;","					}","				}","				if (pointer) {","					pointer.setStyle(LEFT, left + PX);","					if (!pointer.inDoc()) {","						container.append(pointer);","					}","				}","","			},this);","			if (changed) {","				this._locate();","			}","			container.one('.' + cName('noCat')).setStyle('display',hasNoCategory?'block':'none');","		},","		/**","		 * Locates the bars so that they don't overlap one another.  Range events are drawn above the middle line,","		 * point events below.  Range events may be moved below if the start and end dates are indistinguishable","		 * @method _locate","		 * @private","		 */","		_locate: function () {","			var width, left, region, pointer,","				middle = this._height / 2,","				points = [], ranges = [],levels, isPoint,","				mode = this._mode, highest = 0, lowest = 0,","				move = function(bar, levels, i, isPoint) {","					var top;","					switch (mode) {","						case 0:","							top = isPoint? 30 * i + 15:  -30 * (i+1) - 15;","							break;","						case 1:","							top = isPoint? 15 * i + 10:  -15 * (i+1) - 10;","							break;","						case 2:","							top = isPoint? 5 * i + 10:  -5 * (i+1) - 10;","							break;","					}","					highest = Math.min(highest, top);","					lowest = Math.max(lowest, top);","					bar.setStyle(TOP, middle + top + PX);","					if (!levels[i]) {","						levels[i] = [];","					}","					levels[i].push({left:left, width:width});","					pointer = bar.getData(EVENT)._pointer;","					if (pointer) {","						pointer.setStyle('height', 30 * i + 15);","					}","				};","			this.get(CONTAINER).all('div.' + cName('bar')).each(function(bar) {","				region = this._getRegion(bar);","				width = region.width;","				left = region.left;","				isPoint = bar.getData(EVENT)._isPoint;","				levels = (isPoint?points:ranges);","				// This is to determine container to place it so that it does not overlap with any existing bar","				if (!Y.some(levels, function (level, i) {","					if (!Y.some(level, function (existing) {","						return !(existing.left > (left + width) || left > (existing.left + existing.width));","					})) {","						move(bar, levels, i, isPoint);","						return true;","					}","					return false;","				},this)) {","					move(bar, levels, levels.length, isPoint);","				}","				","","			},this);","			highest = Math.max(-highest, lowest);","			if (highest > middle) {","				if (mode < 2) {","					this._mode += 1;","					this._locate();","					this.get(CONTAINER).addClass(cName('compact'));","				}","			} else if (highest < middle / 3 ) {","				if (mode) {","					this._mode -=1;","					if (this._mode === 0) {","						this.get(CONTAINER).removeClass(cName('compact'));","					}","					this._locate();","				}","			}","		},","		/**","		 * Draws the grid, adjusting the interval in between lines from an hour to ten thousand years","		 * depending on the zoom factor","		 * @method _grid","		 * @private","		 */","		_grid: function () {","			var start = this.get(START),","				end = this.get(END),","				container = this.get(CONTAINER),","				width = this._width,","				height = this._height,","				range = end - start,","				// this cover periods of 0:hours, 1:days, 2:months, 3:years, 4:decades, 5:centuries, 6:millenia, 7:tens of millenia","				// JavaScript's Date object cannot go any further anyway'","				periods = [1000*60*60, 24, 30, 12, 10, 10, 10, 10],","				period = 1, i, next, p, edge,label, date,","","			round = function (what, precision, add) {","				what = new Date(what);","				switch (precision) {","					case 0:","						return new Date(what.getFullYear(), what.getMonth(), what.getDate(), what.getHours() + add, 0, 0).getTime();","","					case 1:","						return new Date(what.getFullYear(), what.getMonth(), what.getDate() + add).getTime();","","					case 2:","						return new Date(what.getFullYear(), what.getMonth() + add, 1).getTime();","","					default:","						precision = Math.pow(10,precision - 3);","						return new Date(Math.floor(what.getFullYear() / precision) * precision + (add?precision:0), 0, 1).getTime();","","","","				}","			};","			container.all('div.' + cName('grid')).remove(true);","","			for (i = 0; i < periods.length; i+=1) {","				period *= periods[i];","				// check if the period is wider than 20 pixels in the current container","				if (width / range * period > 20) {","					break;","				}","			}","			edge = round(start, i, 0);","			while (edge < end) {","				next = round(edge, i, 1);","				date = new Date(edge);","				p = GRID_TEMPLATE.cloneNode();","				label = [date.getHours()];","				if (label[0] === 0) {","					label[1] = date.getDate();","					if (label[1] === 1) {","						label[2] = date.getMonth();","						if (label[2] === 0) {","							label[3] = date.getFullYear();","						}","						label[2] = Y.DataType.Date.format(date, {format: '%b'});","					}","				}","","				p.setContent(label.slice(Math.min(3,i)).join(', '));","				p.setStyles({","					width:Math.round((next - edge) / range * width) - 1  + PX,","					left:Math.round((edge - start)/ range * width) + PX,","					paddingTop: height/2  + PX,","					height: height/2 + PX","				});","				container.append(p);","				edge = next;","","			}","","","		},","		/**","		 * Sugar method to set the container attribute.","		 * @method render","		 * @param container {String | Node} CSS selector or reference to the container node.","		 * @chainable","		 */","		render: function (container) {","			this.set(CONTAINER, container);","			return this;","		},","		/**","		 * Renders the timeline in response to the container being set and the timeline file loaded","		 * @method _render","		 * @private","		 */","		_render:function() {","			var container = this.get(CONTAINER),","				region, cats;","			if (!( container && this.get(LOADED))) {","				return;","			}","			container.addClass(cName());","","			container.setContent('');","			Y.each(this._events, function (event) {","				delete event._pointer;","				delete event._bar;","				delete event._isPoint;","			});","","","			region = container.get(REGION);","			this._left = region.left;","			this._top = region.top;","			this._height = region.height;","			this._width = region.width;","","			container.append(Y.Node.create('<div class=\"' + cName('divider') + '\"/>'));","			cats = container.appendChild(Y.Node.create(Lang.sub(CATEGORIES_TEMPLATE,this.get(STRINGS))));","			Y.each(this.get(CATEGORIES), function (cat, name) {","				if (!cat.hidden) {","					cats.append(Y.Node.create('<p style=\"color:' + cat.fontColor + ';background-color:' + cat.color + '\">' + name + '</p>'));","				}","			});","			this._descr = container.appendChild(Y.Node.create('<div class=\"' + cName('descr') + '\"/>'));","","			this._grid();","			this._resize(container);","","			container.delegate('click',this._showDescr,'div.' + cName('bar'),this);","			container.delegate(","				'hover',","				function(ev) {","					ev.target.setStyle('zIndex', 9);","				},","				function(ev) {","					ev.target.setStyle('zIndex', 0);","				},","				'div.' + cName('bar')","			);","			container.on('gesturemovestart', this._startMove, {}, this);","			container.on('gesturemove', this._dragMove, {}, this);","			container.on('gesturemoveend', this._dragMove, {}, this);","			Y.on('mousewheel', this._mouseWheel, this);","			return;","		},","		/**","		 * Hides de extended description","		 * @method _hideDescr","		 * @private","		 */","		_hideDescr: function() {","			this._descr.setStyle('display', 'none');","		},","		/**","		 * Shows the extended description above the event bar clicked","		 * @method _showDescr","		 * @param ev {Event Façade} to help locate the bar clicked","		 * @private","		 */","		_showDescr: function(ev) {","			var bar = ev.target,","				event = bar.getData(EVENT);","			this.fire(SHOW_DESCR, {","				bar: bar,","				event: event,","				callback: this.showDescr","			});","		},","		_defShowDescr: function (ev) {","			var bar = ev.bar,","				event = ev.event;","			this.showDescr(bar, event);","		},","		showDescr: function (bar, event) {","			var	barRegion = this._getRegion(bar),","				descr = this._descr,","				descrRegion,","				barMidPoint = barRegion.left + barRegion.width /2,","				third = this._width / 3;","","			if (event.description || event.icon) {","				descr.setContent((event.icon? '<img src=\"data:image/png;base64,' + event.icon + '\">':'') + event.description);","				descr.setStyles({","					display:'block',","					top:0","				});","				descr.removeClass(cName(LEFT));","				descr.removeClass(cName(CENTER));","				descr.removeClass(cName(RIGHT));","				descrRegion = this._getRegion(descr);","","				if (barMidPoint < third) {","					descr.setStyle(LEFT, Math.max(barMidPoint,0) + PX);","					descr.addClass(cName(LEFT));","				} else if (barMidPoint < third * 2) {","					descr.setStyle(LEFT, barMidPoint - descrRegion.width / 2  + PX);","					descr.addClass(cName(CENTER));","				} else {","					descr.setStyle(LEFT, Math.min(barMidPoint,this._width - 30) - descrRegion.width + PX);","					descr.addClass(cName(RIGHT));","				}","				descr.setStyle(TOP, Math.round(barRegion.top - descrRegion.height - 20) + PX);","			}","		},","		/**","		 * Saves the initial position of a drag and the initial values of the start and end dates","		 * @method _startMove","		 * @param ev {Event Façade} information about the cursor at the start","		 * @private","		 */","		_startMove: function (ev) {","			ev.halt();","			this._hideDescr();","			this._pageX = ev.pageX;","			this._start = this.get(START);","			this._end = this.get(END);","		},","		/**","		 * Respondes to the movement of the cursor at whatever rate the system sends the signal","		 * by updating the start and end times of the display, either panning or zooming","		 * @method _dragMove","		 * @param ev {Event Façade} event information, specially cursor coordinates and state of the control key","		 * @private","		 */","		_dragMove: function (ev) {","","			var start = this._start,","				end = this._end,","				width = this._width,","				deltaX = Math.round((ev.pageX - this._pageX) / width * (end - start));","","			if (deltaX) {","				this.set(START,  start -  deltaX);","				if (ev.ctrlKey) {","					this.set(END,  end +  deltaX);","					this._locate();","				} else {","					this.set(END,  end -  deltaX);","				}","				this._resize();","				this._grid();","			}","		},","		/**","		 * Listener for the mouse wheel change.  It will zoom or pan depending on the state of the control key.","		 * @method _mouseWheel","		 * @param ev {Event Façade} the state of the control key and the direction of the mouse wheel roll is extracted from it","		 * @private","		 */","		_mouseWheel: function (ev) {","			if (ev.target.ancestor('#' + this.get(CONTAINER).get('id'),true)) {","				ev.halt();","","				this._hideDescr();","				var start = this.get(START),","					end = this.get(END),","					deltaX = (end - start) * 0.1 * (ev.wheelDelta > 0?-1:1);","","				this.set(START, start - deltaX);","				if (ev.ctrlKey) {","					this.set(END, end + deltaX);","					this._locate();","				} else {","					this.set(END, end - deltaX);","				}","				this._resize();","				this._grid();","			}","		}","	},","	{","		ATTRS: {","			/**","			 * Stores the categories, indexed by category name.  Each category contains:<ul>","			 * <li><b>color</b>: {string} Background color for the bar in #rrggbb format</li>","			 * <li><b>fontColor</b>: {string} Color for the text in the bar in #rrggbb format</li>","			 * <li><b>hidden</b>: {Boolean} Events in this category should not be shown</li>","			 * </ul>","			 * @attribute categories","			 * @type {Object}","			 * @default {}","			 */","				","			categories: {","				validator: Lang.isObject,","				value:{}","			},","			/**","			 * Start time (left edge) of the current timeline, in miliseconds","			 * @attribute start","			 * @type integer","			 * @default one month before current time","			 */","			start: {","				validator: Lang.isNumber,","				value: new Date(Date.now() - 1000*60*60*24*30).getTime() // previous month","			},","			/**","			 * End time (right edge) of the current timeline, in miliseconds","			 * @attribute end","			 * @type integer","			 * @default one month after current time","			 */","			end: {","				validator: Lang.isNumber,","				value: new Date(Date.now() + 1000*60*60*24*30).getTime() // next month","			},","			/**","			 * A reference to the HTML for rendering the timeline","			 * @attribute container","			 * @type {String | Y.Node}  A reference to a node or a CSS selector.  It will always be returned as a Node reference","			 */","			container: {","				setter: function (val) {","					return Y.one(val);","				}","			},","			/**","			 * URL of the timeline file to be displayed","			 * @attribute url","			 * @type {String}","			 */","			url: {","				validator: Lang.isString","			},","			/**","			 * Signals whether the timeline file has been loaded or not","			 * @attribute loaded","			 * @type {Boolean}","			 * @default false","			 */","			loaded: {","				validator: Lang.isBoolean,","				value: false","			},","			/**","			 * Localizable strings meant to be seen by the user","			 * @attribute strings","			 * @type {Object}","			 * @default English strings","			 */","			strings: {","				value: {","					categories:'Categories',","					noCategory: '-no category-',","					today: 'today'","				}","			}","","		}","	}",");","","","","","}, '@VERSION@', {","    \"requires\": [","        \"node\",","        \"io-base\",","        \"base\",","        \"event-mousewheel\",","        \"event-gestures\",","        \"classnamemanager\",","        \"datatype\",","        \"event-hover\"","    ],","    \"skinnable\": true","});"];
_yuitest_coverage["build/gallery-timeline/gallery-timeline.js"].lines = {"1":0,"16":0,"18":0,"37":0,"44":0,"85":0,"86":0,"87":0,"88":0,"89":0,"90":0,"91":0,"93":0,"94":0,"96":0,"109":0,"110":0,"121":0,"123":0,"124":0,"125":0,"126":0,"127":0,"129":0,"141":0,"143":0,"146":0,"147":0,"148":0,"150":0,"162":0,"163":0,"174":0,"175":0,"184":0,"185":0,"186":0,"191":0,"201":0,"205":0,"206":0,"207":0,"209":0,"210":0,"211":0,"221":0,"222":0,"223":0,"245":0,"246":0,"255":0,"256":0,"257":0,"260":0,"261":0,"262":0,"263":0,"264":0,"279":0,"280":0,"281":0,"282":0,"291":0,"293":0,"302":0,"305":0,"306":0,"307":0,"309":0,"310":0,"311":0,"312":0,"313":0,"314":0,"315":0,"316":0,"317":0,"318":0,"319":0,"322":0,"323":0,"325":0,"326":0,"330":0,"331":0,"332":0,"333":0,"338":0,"340":0,"341":0,"342":0,"343":0,"345":0,"346":0,"348":0,"350":0,"351":0,"352":0,"354":0,"355":0,"356":0,"357":0,"358":0,"359":0,"362":0,"363":0,"364":0,"365":0,"368":0,"369":0,"370":0,"371":0,"376":0,"377":0,"379":0,"388":0,"393":0,"394":0,"396":0,"397":0,"399":0,"400":0,"402":0,"403":0,"405":0,"406":0,"407":0,"408":0,"409":0,"411":0,"412":0,"413":0,"414":0,"417":0,"418":0,"419":0,"420":0,"421":0,"422":0,"424":0,"425":0,"426":0,"428":0,"429":0,"431":0,"433":0,"438":0,"439":0,"440":0,"441":0,"442":0,"443":0,"445":0,"446":0,"447":0,"448":0,"449":0,"451":0,"462":0,"474":0,"475":0,"477":0,"480":0,"483":0,"486":0,"487":0,"493":0,"495":0,"496":0,"498":0,"499":0,"502":0,"503":0,"504":0,"505":0,"506":0,"507":0,"508":0,"509":0,"510":0,"511":0,"512":0,"513":0,"515":0,"519":0,"520":0,"526":0,"527":0,"540":0,"541":0,"549":0,"551":0,"552":0,"554":0,"556":0,"557":0,"558":0,"559":0,"560":0,"564":0,"565":0,"566":0,"567":0,"568":0,"570":0,"571":0,"572":0,"573":0,"574":0,"577":0,"579":0,"580":0,"582":0,"583":0,"586":0,"589":0,"593":0,"594":0,"595":0,"596":0,"597":0,"605":0,"614":0,"616":0,"623":0,"625":0,"628":0,"634":0,"635":0,"636":0,"640":0,"641":0,"642":0,"643":0,"645":0,"646":0,"647":0,"648":0,"649":0,"650":0,"652":0,"653":0,"655":0,"665":0,"666":0,"667":0,"668":0,"669":0,"680":0,"685":0,"686":0,"687":0,"688":0,"689":0,"691":0,"693":0,"694":0,"704":0,"705":0,"707":0,"708":0,"712":0,"713":0,"714":0,"715":0,"717":0,"719":0,"720":0,"768":0};
_yuitest_coverage["build/gallery-timeline/gallery-timeline.js"].functions = {"cName:36":0,"initializer:84":0,"_readBoolean:108":0,"_readDate:120":0,"pad:142":0,"_readColor:140":0,"_readValue:161":0,"_readEl:173":0,"(anonymous 2):185":0,"_xmlReadCategories:183":0,"_xmlReadView:200":0,"(anonymous 3):222":0,"_xmlReadEvents:220":0,"load:244":0,"success:259":0,"_load:254":0,"_getRegion:278":0,"formatDate:301":0,"(anonymous 4):305":0,"_resize:290":0,"move:392":0,"(anonymous 7):425":0,"(anonymous 6):424":0,"(anonymous 5):417":0,"_locate:387":0,"round:473":0,"_grid:461":0,"render:539":0,"(anonymous 8):557":0,"(anonymous 9):572":0,"(anonymous 10):585":0,"(anonymous 11):588":0,"_render:548":0,"_hideDescr:604":0,"_showDescr:613":0,"_defShowDescr:622":0,"showDescr:627":0,"_startMove:664":0,"_dragMove:678":0,"_mouseWheel:703":0,"setter:767":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-timeline/gallery-timeline.js"].coveredLines = 269;
_yuitest_coverage["build/gallery-timeline/gallery-timeline.js"].coveredFunctions = 42;
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 1);
YUI.add('gallery-timeline', function (Y, NAME) {

/*global YUI*/
/**
 * Shows in the browser timeline files produced by the program from <a href="http://thetimelineproj.sourceforge.net/">The Timeline Project</a>.
 * @module timeline
 */
/**
 * Displays within a given container a timeline file from the given URL
 * @class Y.Timeline
 * @extends Y.Base
 * @constructor
 * @param config {Object} configuration options
 */

_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 16);
"use strict";

_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 18);
var Lang = Y.Lang,
	REGION = 'region',
	START = 'start',
	END = 'end',
	LEFT = 'left',
	URL = 'url',
	CONTAINER = 'container',
	LOADED = 'loaded',
	CHANGE = 'Change',
	EVENT = 'event',
	CATEGORIES = 'categories',
	TOP = 'top',
	CENTER = 'center',
	RIGHT = 'right',
	PX = 'px',
	STRINGS = 'strings',
	TIMELINE = 'timeline',
	SHOW_DESCR = 'showDescr',
	cName = function() {
		_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "cName", 36);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 37);
return Y.ClassNameManager.getClassName.apply(this, [TIMELINE].concat(Y.Array(arguments)));
	},
	BLOCK_TEMPLATE = Y.Node.create('<div class="' + cName('bar') + '" />'),
	GRID_TEMPLATE = Y.Node.create('<div class="' + cName('grid') + '"/>'),
	POINTER_TEMPLATE = Y.Node.create('<div class="' + cName('pointer') + '" />'),
	CATEGORIES_TEMPLATE = '<div class="' + cName('cats') + '">{categories}<p class="' + cName('noCat') + '">{noCategory}</p></div>';

_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 44);
Y.Timeline = Y.Base.create(
	TIMELINE,
	Y.Base,
	[],
	{
		/**
		 * Stores the events to display.It contains the following properties, those starting with underscore are used internally:<ul>
		 * <li><b>start</b>: {timestamp} start time in milliseconds</li>
		 * <li><b>end</b>: {timestamp} end time in milliseconds</li>
		 * <li><b>text</b>: {string} text to be shown on the bar</li>
		 * <li><b>fuzzy</b>: {Boolean} the start and end days are uncertain </li>
		 * <li><b>locked</b>: {Boolean} the event cannot be edited (not relevant for this viewer </li>
		 * <li><b>endsToday</b>: {Boolean} the end day is today</li>
		 * <li><b>description</b>: {string} extended description</li>
		 * <li><b>icon</b>: {string} Base64-encoded image to go along the extended description</li>
		 * <li><b>category</b>: {string} the category this event belongs to</li>
		 * <li><b>_bar</b>: {Y.Node} reference to the Node for the bar representing this event</li>
		 * <li><b>_pointer</b>: {Y.Node} for point events, reference to the Node for the date pointer</li>
		 * <li><b>_isPoint</b>: {Boolean} signals that the event is a point event or a range event
		 *      that has become too narrow to be displayed as a range</li>
		 * </ul>
		 * @property _events
		 * @type Object []
		 * @default null
		 */
		_events: null,
		/**
		 * Display mode for the bars, to help calculate its location and handle crowding.
		 * Can be standard (0), , compact (1) or overlappying (2)
		 * @property _mode
		 * @type {integer}
		 * @default 0
		 */
		_mode: 0,
		/**
		 * Sets up listeners to respond to setting the URL,the CONTAINER or to the arrival of the timeline file.
		 * @method initializer
		 * @param cfg {Object} configuration attributes
		 * @protected
		 */
		initializer: function (cfg) {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "initializer", 84);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 85);
this._events = [];
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 86);
this.set(STRINGS, Y.Intl.get('gallery-' + TIMELINE));
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 87);
this.after(URL + CHANGE, this._load);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 88);
this.after(CONTAINER + CHANGE, this._render);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 89);
this.after(LOADED + CHANGE, this._render);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 90);
if (cfg && cfg[URL]) {
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 91);
this._load();
			}
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 93);
if (cfg && cfg[CONTAINER]) {
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 94);
this._render();
			}
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 96);
this.publish(SHOW_DESCR, {
				defaultFn: this._defShowDescr
			});
		},
		/**
		 * Returns the boolean value of a given tag in an XML document
		 * @method _readBoolean
		 * @param xml {XMLDocument} The XML document or fragment to parse
		 * @param tag {String} The tag for the value sought
		 * @return {Boolean} the value read or null if not found
		 * @private
		 */
		_readBoolean: function (xml, tag) {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "_readBoolean", 108);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 109);
var val = this._readValue(xml, tag);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 110);
return val?val.toLowerCase() === 'true':null;
		},
		/**
		 * Returns and parses a date from a given tag in an XML document
		 * @method _readDate
		 * @param xml {XMLDocument} The XML document or fragment to parse
		 * @param tag {String} The tag for the value sought
		 * @return {Date} the value read or null if not found
		 * @private
		 */
		_readDate: function (xml, tag) {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "_readDate", 120);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 121);
var date, time,
				val = this._readValue(xml, tag);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 123);
if (val) {
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 124);
val = val.split(' ');
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 125);
date = val[0].split('-');
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 126);
time = val[1].split(':');
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 127);
return new Date(date[0], date[1] -1 , date[2], time[0], time[1], time[2]).getTime();
			} else {
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 129);
return null;
			}
		},
		/**
		 * Returns and parses a color value from a given tag in an XML document
		 * @method _readColor
		 * @param xml {XMLDocument} The XML document or fragment to parse
		 * @param tag {String} The tag for the value sought
		 * @return {String} the RGB value as #rrggbb read or null if not found
		 * @private
		 */
		_readColor: function(xml, tag) {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "_readColor", 140);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 141);
var c = this._readValue(xml, tag),
				pad = function(val) {
					_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "pad", 142);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 143);
return ('00' + parseInt(val,10).toString(16)).substr(-2);
				};

			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 146);
if (c) {
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 147);
c = c.split(',');
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 148);
return '#' + pad(c[0]) + pad(c[1]) + pad(c[2]);
			} else {
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 150);
return null;
			}
		},
		/**
		 * Returns the textual contents from a given tag in an XML document
		 * @method _readValue
		 * @param xml {XMLDocument} The XML document or fragment to parse
		 * @param tag {String} The tag for the value sought
		 * @return {String} the content read or null if not found
		 * @private
		 */
		_readValue: function(xml, tag) {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "_readValue", 161);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 162);
var el = this._readEl(xml,tag);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 163);
return el?el.textContent:null;
		},
		/**
		 * Returns the XML element from given tag in an XML document
		 * @method _readEl
		 * @param xml {XMLDocument} The XML document or fragment to parse
		 * @param tag {String} The tag for the value sought
		 * @return {XMLElement} the element read or null if not found
		 * @private
		 */
		_readEl: function (xml, tag) {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "_readEl", 173);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 174);
var el = xml.getElementsByTagName(tag);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 175);
return (el && el.length)?el[0]:null;
		},
		/**
		 * Reads the categories information
		 * @method _xmlReadCategories
		 * @param cats {XMLFragment} collection of categories
		 * @private
		 */
		_xmlReadCategories: function(cats) {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "_xmlReadCategories", 183);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 184);
var c = {};
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 185);
Y.each(cats.children, function (cat) {
				_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "(anonymous 2)", 185);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 186);
c[this._readValue(cat,'name')] = {
					color:this._readColor(cat,'color'),
					fontColor:this._readColor(cat,'font_color')
				};
			},this);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 191);
this.set(CATEGORIES, c);

		},
		/**
		 * Reads the view information
		 * @method _xmlReadView
		 * @param view {XMLFragment} view information
		 * @private
		 */
		_xmlReadView: function (view) {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "_xmlReadView", 200);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 201);
var range = this._readEl(view,'displayed_period'),
				cats = this.get(CATEGORIES),
				hiddenCat = this._readEl(view, 'hidden_categories').firstChild;

			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 205);
if (range) {
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 206);
this.set(START, this._readDate(range, START));
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 207);
this.set(END, this._readDate(range, END));
			}
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 209);
while (hiddenCat) {
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 210);
cats[hiddenCat.textContent].hidden = true;
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 211);
hiddenCat = hiddenCat.nextChild;
			}
		},
		/**
		 * Reads the events to show
		 * @method _xmlReadEvents
		 * @param cats {XMLFragment} collection of events
		 * @private
		 */
		_xmlReadEvents: function (events) {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "_xmlReadEvents", 220);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 221);
this._events = [];
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 222);
Y.each(events.children, function (event) {
				_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "(anonymous 3)", 222);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 223);
this._events.push({
					start: this._readDate(event, START),
					end: this._readDate(event,END),
					text: this._readValue(event,'text'),
					fuzzy: this._readBoolean(event,'fuzzy'),
					locked: this._readBoolean(event,'locked'),
					endsToday: this._readBoolean(event,'ends_today'),
					category: this._readValue(event, 'category'),
					description: this._readValue(event, 'description'),
					icon: this._readValue(event, 'icon')
				});

			}, this);

		},
		/**
		 * Sugar method to set the URL of the timeline file
		 * @method load
		 * @param url {String} URL of the timeline file
		 * @chainable
		 */
		load: function (url) {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "load", 244);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 245);
this.set(URL, url);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 246);
return this;
		},
		/**
		 * Requests the timeline information from the configured URL and parses it when it arrives.
		 * Signals its arrival by setting the 'loaded' configuration attribute
		 * @method _load
		 * @private
		 */
		_load: function () {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "_load", 254);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 255);
var self = this;
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 256);
self.set(LOADED, false);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 257);
Y.io(self.get(URL), {
				on: {
					success: function (id, o) {
						_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "success", 259);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 260);
var xml = o.responseXML;
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 261);
self._xmlReadCategories(self._readEl(xml,CATEGORIES));
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 262);
self._xmlReadView(self._readEl(xml,'view'));
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 263);
self._xmlReadEvents(self._readEl(xml,'events'));
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 264);
self.set(LOADED, true);
					}
				}
			});


		},
		/**
		 * Adjusts the region information for the given node to make it relative to the container position
		 * @method _getRegion
		 * @param node {Y.Node} node to find the region
		 * @return {Y.Region} region of the node relative to the container
		 * @private
		 */
		_getRegion: function (node) {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "_getRegion", 278);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 279);
var reg = node.get(REGION);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 280);
reg.left -= this._left;
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 281);
reg.top -= this._top;
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 282);
return reg;
		},
		/**
		 * Draws the bars corresponding to the events in the container
		 * @method _resize
		 * @param container {Y.Node} optional, the container for the bars.  It reads the container attribute if none given
		 * @private
		 */
		_resize: function (container) {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "_resize", 290);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 291);
container = container || this.get(CONTAINER);

			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 293);
var start = this.get(START),
				end = this.get(END),
				rightEdge = this._width,
				height = this._height,
				scale = rightEdge / ( end - start),
				cats = this.get(CATEGORIES),
				bar, width, left, changed = false, region, pointer,hasNoCategory = false,
				TODAY = this.get(STRINGS).today,
				formatDate = function(date) {
					_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "formatDate", 301);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 302);
return Y.DataType.Date.format(new Date(date), {format:'%x'});
				};

			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 305);
Y.each(this._events, function(event) {
				_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "(anonymous 4)", 305);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 306);
if (event.category && cats[event.category].hidden) {
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 307);
return;
				}
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 309);
bar = event._bar || BLOCK_TEMPLATE.cloneNode();
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 310);
pointer = event._pointer;
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 311);
left = Math.round((event.start - start) * scale);
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 312);
width = Math.round(((event.endsToday?Date.now():event.end) - event.start) * scale);
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 313);
if (left + width < 0 || left > rightEdge) {
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 314);
if (event._bar) {
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 315);
event._bar.remove(true);
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 316);
event._bar = null;
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 317);
if (pointer) {
							_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 318);
pointer.remove(true);
							_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 319);
event._pointer = pointer = null;
						}
					}
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 322);
changed = true;
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 323);
return;
				}
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 325);
event._isPoint = width === 0;
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 326);
bar.setStyles({
					left: left +PX,
					width: width?width + PX:'auto'
				});
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 330);
if (!event._bar) {
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 331);
event._bar = bar;
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 332);
if (event.category) {
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 333);
bar.setStyles({
							backgroundColor: cats[event.category].color,
							color: cats[event.category].fontColor
						});
					} else {
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 338);
hasNoCategory = true;
					}
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 340);
bar.setContent(event.text);
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 341);
bar.set('title', event.text + ': ' + formatDate(event.start) + ' - ' +  (event.endsToday?TODAY:formatDate(event.end)));
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 342);
if (event.fuzzy) {
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 343);
bar.addClass(cName('fuzzy'));
					}
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 345);
if (event.description || event.icon) {
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 346);
bar.addClass(cName('hasDescr'));
					}
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 348);
bar.setData(EVENT,event);
				}
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 350);
if (!bar.inDoc()) {
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 351);
container.append(bar);
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 352);
changed = true;
				}
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 354);
if (event._isPoint) {
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 355);
region = this._getRegion(bar);
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 356);
bar.setStyle(LEFT, region.left - region.width / 2 + PX);
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 357);
if (!pointer) {
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 358);
event._pointer = pointer = POINTER_TEMPLATE.cloneNode();
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 359);
pointer.setStyle(TOP, height / 2 + PX);
					}
				} else {
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 362);
if (pointer) {
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 363);
pointer.remove(true);
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 364);
event._pointer = pointer = null;
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 365);
changed = true;
					}
				}
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 368);
if (pointer) {
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 369);
pointer.setStyle(LEFT, left + PX);
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 370);
if (!pointer.inDoc()) {
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 371);
container.append(pointer);
					}
				}

			},this);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 376);
if (changed) {
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 377);
this._locate();
			}
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 379);
container.one('.' + cName('noCat')).setStyle('display',hasNoCategory?'block':'none');
		},
		/**
		 * Locates the bars so that they don't overlap one another.  Range events are drawn above the middle line,
		 * point events below.  Range events may be moved below if the start and end dates are indistinguishable
		 * @method _locate
		 * @private
		 */
		_locate: function () {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "_locate", 387);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 388);
var width, left, region, pointer,
				middle = this._height / 2,
				points = [], ranges = [],levels, isPoint,
				mode = this._mode, highest = 0, lowest = 0,
				move = function(bar, levels, i, isPoint) {
					_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "move", 392);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 393);
var top;
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 394);
switch (mode) {
						case 0:
							_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 396);
top = isPoint? 30 * i + 15:  -30 * (i+1) - 15;
							_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 397);
break;
						case 1:
							_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 399);
top = isPoint? 15 * i + 10:  -15 * (i+1) - 10;
							_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 400);
break;
						case 2:
							_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 402);
top = isPoint? 5 * i + 10:  -5 * (i+1) - 10;
							_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 403);
break;
					}
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 405);
highest = Math.min(highest, top);
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 406);
lowest = Math.max(lowest, top);
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 407);
bar.setStyle(TOP, middle + top + PX);
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 408);
if (!levels[i]) {
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 409);
levels[i] = [];
					}
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 411);
levels[i].push({left:left, width:width});
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 412);
pointer = bar.getData(EVENT)._pointer;
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 413);
if (pointer) {
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 414);
pointer.setStyle('height', 30 * i + 15);
					}
				};
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 417);
this.get(CONTAINER).all('div.' + cName('bar')).each(function(bar) {
				_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "(anonymous 5)", 417);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 418);
region = this._getRegion(bar);
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 419);
width = region.width;
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 420);
left = region.left;
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 421);
isPoint = bar.getData(EVENT)._isPoint;
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 422);
levels = (isPoint?points:ranges);
				// This is to determine container to place it so that it does not overlap with any existing bar
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 424);
if (!Y.some(levels, function (level, i) {
					_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "(anonymous 6)", 424);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 425);
if (!Y.some(level, function (existing) {
						_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "(anonymous 7)", 425);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 426);
return !(existing.left > (left + width) || left > (existing.left + existing.width));
					})) {
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 428);
move(bar, levels, i, isPoint);
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 429);
return true;
					}
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 431);
return false;
				},this)) {
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 433);
move(bar, levels, levels.length, isPoint);
				}
				

			},this);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 438);
highest = Math.max(-highest, lowest);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 439);
if (highest > middle) {
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 440);
if (mode < 2) {
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 441);
this._mode += 1;
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 442);
this._locate();
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 443);
this.get(CONTAINER).addClass(cName('compact'));
				}
			} else {_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 445);
if (highest < middle / 3 ) {
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 446);
if (mode) {
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 447);
this._mode -=1;
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 448);
if (this._mode === 0) {
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 449);
this.get(CONTAINER).removeClass(cName('compact'));
					}
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 451);
this._locate();
				}
			}}
		},
		/**
		 * Draws the grid, adjusting the interval in between lines from an hour to ten thousand years
		 * depending on the zoom factor
		 * @method _grid
		 * @private
		 */
		_grid: function () {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "_grid", 461);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 462);
var start = this.get(START),
				end = this.get(END),
				container = this.get(CONTAINER),
				width = this._width,
				height = this._height,
				range = end - start,
				// this cover periods of 0:hours, 1:days, 2:months, 3:years, 4:decades, 5:centuries, 6:millenia, 7:tens of millenia
				// JavaScript's Date object cannot go any further anyway'
				periods = [1000*60*60, 24, 30, 12, 10, 10, 10, 10],
				period = 1, i, next, p, edge,label, date,

			round = function (what, precision, add) {
				_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "round", 473);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 474);
what = new Date(what);
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 475);
switch (precision) {
					case 0:
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 477);
return new Date(what.getFullYear(), what.getMonth(), what.getDate(), what.getHours() + add, 0, 0).getTime();

					case 1:
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 480);
return new Date(what.getFullYear(), what.getMonth(), what.getDate() + add).getTime();

					case 2:
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 483);
return new Date(what.getFullYear(), what.getMonth() + add, 1).getTime();

					default:
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 486);
precision = Math.pow(10,precision - 3);
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 487);
return new Date(Math.floor(what.getFullYear() / precision) * precision + (add?precision:0), 0, 1).getTime();



				}
			};
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 493);
container.all('div.' + cName('grid')).remove(true);

			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 495);
for (i = 0; i < periods.length; i+=1) {
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 496);
period *= periods[i];
				// check if the period is wider than 20 pixels in the current container
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 498);
if (width / range * period > 20) {
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 499);
break;
				}
			}
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 502);
edge = round(start, i, 0);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 503);
while (edge < end) {
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 504);
next = round(edge, i, 1);
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 505);
date = new Date(edge);
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 506);
p = GRID_TEMPLATE.cloneNode();
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 507);
label = [date.getHours()];
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 508);
if (label[0] === 0) {
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 509);
label[1] = date.getDate();
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 510);
if (label[1] === 1) {
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 511);
label[2] = date.getMonth();
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 512);
if (label[2] === 0) {
							_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 513);
label[3] = date.getFullYear();
						}
						_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 515);
label[2] = Y.DataType.Date.format(date, {format: '%b'});
					}
				}

				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 519);
p.setContent(label.slice(Math.min(3,i)).join(', '));
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 520);
p.setStyles({
					width:Math.round((next - edge) / range * width) - 1  + PX,
					left:Math.round((edge - start)/ range * width) + PX,
					paddingTop: height/2  + PX,
					height: height/2 + PX
				});
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 526);
container.append(p);
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 527);
edge = next;

			}


		},
		/**
		 * Sugar method to set the container attribute.
		 * @method render
		 * @param container {String | Node} CSS selector or reference to the container node.
		 * @chainable
		 */
		render: function (container) {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "render", 539);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 540);
this.set(CONTAINER, container);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 541);
return this;
		},
		/**
		 * Renders the timeline in response to the container being set and the timeline file loaded
		 * @method _render
		 * @private
		 */
		_render:function() {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "_render", 548);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 549);
var container = this.get(CONTAINER),
				region, cats;
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 551);
if (!( container && this.get(LOADED))) {
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 552);
return;
			}
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 554);
container.addClass(cName());

			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 556);
container.setContent('');
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 557);
Y.each(this._events, function (event) {
				_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "(anonymous 8)", 557);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 558);
delete event._pointer;
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 559);
delete event._bar;
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 560);
delete event._isPoint;
			});


			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 564);
region = container.get(REGION);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 565);
this._left = region.left;
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 566);
this._top = region.top;
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 567);
this._height = region.height;
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 568);
this._width = region.width;

			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 570);
container.append(Y.Node.create('<div class="' + cName('divider') + '"/>'));
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 571);
cats = container.appendChild(Y.Node.create(Lang.sub(CATEGORIES_TEMPLATE,this.get(STRINGS))));
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 572);
Y.each(this.get(CATEGORIES), function (cat, name) {
				_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "(anonymous 9)", 572);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 573);
if (!cat.hidden) {
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 574);
cats.append(Y.Node.create('<p style="color:' + cat.fontColor + ';background-color:' + cat.color + '">' + name + '</p>'));
				}
			});
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 577);
this._descr = container.appendChild(Y.Node.create('<div class="' + cName('descr') + '"/>'));

			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 579);
this._grid();
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 580);
this._resize(container);

			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 582);
container.delegate('click',this._showDescr,'div.' + cName('bar'),this);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 583);
container.delegate(
				'hover',
				function(ev) {
					_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "(anonymous 10)", 585);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 586);
ev.target.setStyle('zIndex', 9);
				},
				function(ev) {
					_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "(anonymous 11)", 588);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 589);
ev.target.setStyle('zIndex', 0);
				},
				'div.' + cName('bar')
			);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 593);
container.on('gesturemovestart', this._startMove, {}, this);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 594);
container.on('gesturemove', this._dragMove, {}, this);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 595);
container.on('gesturemoveend', this._dragMove, {}, this);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 596);
Y.on('mousewheel', this._mouseWheel, this);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 597);
return;
		},
		/**
		 * Hides de extended description
		 * @method _hideDescr
		 * @private
		 */
		_hideDescr: function() {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "_hideDescr", 604);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 605);
this._descr.setStyle('display', 'none');
		},
		/**
		 * Shows the extended description above the event bar clicked
		 * @method _showDescr
		 * @param ev {Event Façade} to help locate the bar clicked
		 * @private
		 */
		_showDescr: function(ev) {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "_showDescr", 613);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 614);
var bar = ev.target,
				event = bar.getData(EVENT);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 616);
this.fire(SHOW_DESCR, {
				bar: bar,
				event: event,
				callback: this.showDescr
			});
		},
		_defShowDescr: function (ev) {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "_defShowDescr", 622);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 623);
var bar = ev.bar,
				event = ev.event;
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 625);
this.showDescr(bar, event);
		},
		showDescr: function (bar, event) {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "showDescr", 627);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 628);
var	barRegion = this._getRegion(bar),
				descr = this._descr,
				descrRegion,
				barMidPoint = barRegion.left + barRegion.width /2,
				third = this._width / 3;

			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 634);
if (event.description || event.icon) {
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 635);
descr.setContent((event.icon? '<img src="data:image/png;base64,' + event.icon + '">':'') + event.description);
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 636);
descr.setStyles({
					display:'block',
					top:0
				});
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 640);
descr.removeClass(cName(LEFT));
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 641);
descr.removeClass(cName(CENTER));
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 642);
descr.removeClass(cName(RIGHT));
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 643);
descrRegion = this._getRegion(descr);

				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 645);
if (barMidPoint < third) {
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 646);
descr.setStyle(LEFT, Math.max(barMidPoint,0) + PX);
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 647);
descr.addClass(cName(LEFT));
				} else {_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 648);
if (barMidPoint < third * 2) {
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 649);
descr.setStyle(LEFT, barMidPoint - descrRegion.width / 2  + PX);
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 650);
descr.addClass(cName(CENTER));
				} else {
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 652);
descr.setStyle(LEFT, Math.min(barMidPoint,this._width - 30) - descrRegion.width + PX);
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 653);
descr.addClass(cName(RIGHT));
				}}
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 655);
descr.setStyle(TOP, Math.round(barRegion.top - descrRegion.height - 20) + PX);
			}
		},
		/**
		 * Saves the initial position of a drag and the initial values of the start and end dates
		 * @method _startMove
		 * @param ev {Event Façade} information about the cursor at the start
		 * @private
		 */
		_startMove: function (ev) {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "_startMove", 664);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 665);
ev.halt();
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 666);
this._hideDescr();
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 667);
this._pageX = ev.pageX;
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 668);
this._start = this.get(START);
			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 669);
this._end = this.get(END);
		},
		/**
		 * Respondes to the movement of the cursor at whatever rate the system sends the signal
		 * by updating the start and end times of the display, either panning or zooming
		 * @method _dragMove
		 * @param ev {Event Façade} event information, specially cursor coordinates and state of the control key
		 * @private
		 */
		_dragMove: function (ev) {

			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "_dragMove", 678);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 680);
var start = this._start,
				end = this._end,
				width = this._width,
				deltaX = Math.round((ev.pageX - this._pageX) / width * (end - start));

			_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 685);
if (deltaX) {
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 686);
this.set(START,  start -  deltaX);
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 687);
if (ev.ctrlKey) {
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 688);
this.set(END,  end +  deltaX);
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 689);
this._locate();
				} else {
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 691);
this.set(END,  end -  deltaX);
				}
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 693);
this._resize();
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 694);
this._grid();
			}
		},
		/**
		 * Listener for the mouse wheel change.  It will zoom or pan depending on the state of the control key.
		 * @method _mouseWheel
		 * @param ev {Event Façade} the state of the control key and the direction of the mouse wheel roll is extracted from it
		 * @private
		 */
		_mouseWheel: function (ev) {
			_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "_mouseWheel", 703);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 704);
if (ev.target.ancestor('#' + this.get(CONTAINER).get('id'),true)) {
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 705);
ev.halt();

				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 707);
this._hideDescr();
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 708);
var start = this.get(START),
					end = this.get(END),
					deltaX = (end - start) * 0.1 * (ev.wheelDelta > 0?-1:1);

				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 712);
this.set(START, start - deltaX);
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 713);
if (ev.ctrlKey) {
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 714);
this.set(END, end + deltaX);
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 715);
this._locate();
				} else {
					_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 717);
this.set(END, end - deltaX);
				}
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 719);
this._resize();
				_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 720);
this._grid();
			}
		}
	},
	{
		ATTRS: {
			/**
			 * Stores the categories, indexed by category name.  Each category contains:<ul>
			 * <li><b>color</b>: {string} Background color for the bar in #rrggbb format</li>
			 * <li><b>fontColor</b>: {string} Color for the text in the bar in #rrggbb format</li>
			 * <li><b>hidden</b>: {Boolean} Events in this category should not be shown</li>
			 * </ul>
			 * @attribute categories
			 * @type {Object}
			 * @default {}
			 */
				
			categories: {
				validator: Lang.isObject,
				value:{}
			},
			/**
			 * Start time (left edge) of the current timeline, in miliseconds
			 * @attribute start
			 * @type integer
			 * @default one month before current time
			 */
			start: {
				validator: Lang.isNumber,
				value: new Date(Date.now() - 1000*60*60*24*30).getTime() // previous month
			},
			/**
			 * End time (right edge) of the current timeline, in miliseconds
			 * @attribute end
			 * @type integer
			 * @default one month after current time
			 */
			end: {
				validator: Lang.isNumber,
				value: new Date(Date.now() + 1000*60*60*24*30).getTime() // next month
			},
			/**
			 * A reference to the HTML for rendering the timeline
			 * @attribute container
			 * @type {String | Y.Node}  A reference to a node or a CSS selector.  It will always be returned as a Node reference
			 */
			container: {
				setter: function (val) {
					_yuitest_coverfunc("build/gallery-timeline/gallery-timeline.js", "setter", 767);
_yuitest_coverline("build/gallery-timeline/gallery-timeline.js", 768);
return Y.one(val);
				}
			},
			/**
			 * URL of the timeline file to be displayed
			 * @attribute url
			 * @type {String}
			 */
			url: {
				validator: Lang.isString
			},
			/**
			 * Signals whether the timeline file has been loaded or not
			 * @attribute loaded
			 * @type {Boolean}
			 * @default false
			 */
			loaded: {
				validator: Lang.isBoolean,
				value: false
			},
			/**
			 * Localizable strings meant to be seen by the user
			 * @attribute strings
			 * @type {Object}
			 * @default English strings
			 */
			strings: {
				value: {
					categories:'Categories',
					noCategory: '-no category-',
					today: 'today'
				}
			}

		}
	}
);




}, '@VERSION@', {
    "requires": [
        "node",
        "io-base",
        "base",
        "event-mousewheel",
        "event-gestures",
        "classnamemanager",
        "datatype",
        "event-hover"
    ],
    "skinnable": true
});
