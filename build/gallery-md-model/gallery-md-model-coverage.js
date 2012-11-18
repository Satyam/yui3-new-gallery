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
_yuitest_coverage["build/gallery-md-model/gallery-md-model.js"] = {
    lines: {},
    functions: {},
    coveredLines: 0,
    calledLines: 0,
    coveredFunctions: 0,
    calledFunctions: 0,
    path: "build/gallery-md-model/gallery-md-model.js",
    code: []
};
_yuitest_coverage["build/gallery-md-model/gallery-md-model.js"].code=["YUI.add('gallery-md-model', function (Y, NAME) {","","'use strict';","/*jslint white: true */","/**","Record-based data model with APIs for getting, setting, validating, and","syncing attribute values, as well as events for being notified of model changes.","","@module gallery-md-model","**/","","/**","Record-based data model with APIs for getting, setting, validating, and","syncing attribute values, as well as events for being notified of model changes.","","In most cases, you'll want to create your own subclass of GalleryModel and","customize it to meet your needs. In particular, the sync() and validate()","methods are meant to be overridden by custom implementations. You may also want","to override the parse() method to parse non-generic server responses.","","@class GalleryModel","@constructor","@param [cfg] {Object} Initial configuration attribute plus:","@param [cfg.values] {Object}  Sets initial values for the model.","	Model will be marked as new and not modified (as if just loaded).","	If GalleryModel is extended with any of the multi-record extensions,","	this will not work until <a href=\"http://yuilibrary.com/projects/yui3/ticket/2529898\">this bug</a> is fixed:","	Use `new Y.GalleryModel().add(values)` instead.","@extends Base","**/","","	var Lang = Y.Lang,","		YArray = Y.Array,","		YObject = Y.Object,","		EVT_CHANGE = 'change',","		EVT_LOADED = 'loaded',","		EVT_ERROR = 'error',","		EVT_SAVED = 'saved',","		EVT_RESET = 'reset',","		IS_MODIFIED = 'isModified',","		IS_NEW = 'isNew',","		DOT = '.',","		CHANGE = 'Change',","		ADD = 'add',","		UNDO = 'undo',","		NULL_FN = function (){};","","","	Y.GalleryModel = Y.Base.create(","		NAME,","		Y.Base,","		[],","		{","			/**","			 * Hash of values indexed by field name","			 * @property _values","			 * @type Object","			 * @private","			 */","			_values: null,","			/**","			 * Hash of values as loaded from the remote source,","			 * presumed to be the current value there.","			 * @property _loadedValues","			 * @type Object","			 * @private","			 */","			_loadedValues: null,","			/**","			 * Array of field names that make up the primary key for this record","			 * @property _primaryKeys","			 * @type Array","			 * @private","			 */","			_primaryKeys: null,","			/*","			 * Y.Base lifecycle method","			 */","			initializer: function  (cfg) {","				this._values = {};","				this._loadedValues = {};","				/**","				 * Fired whenever a value or values are changed.","				 * If changed via {{#crossLink \"GalleryModel/setValues\"}}{{/crossLink}} the facade will not contain a __name__.","				 * Instead, __prevVals__ and __newVals__ (both plural) properties will contain","				 * hashes with the names and values of the fields changed.","				 * After firing the event for a group of fields changed via {{#crossLink \"GalleryModel/setValues\"}}{{/crossLink}},","				 * a new change event will be fired for each individual field changed.","				 * For individual field changes via {{#crossLink \"GalleryModel/setValue\"}}{{/crossLink}}, the __name__, __prevVal__ and __newVal__","				 * will be provided.","				 * The event can be prevented on a per group change basis or per individual field change.","				 * Preventing the change on a particular field will not prevent the others from being changed.","				 * @event change","				 * @param ev {EventFacade} containing:","				 * @param [ev.name] {String} Name of the field changed","				 * @param [ev.newVal] {Any} New value of the field.","				 * @param [ev.prevVal] {Any} Previous value of the field.","				 * @param [ev.newVals] {Object} Hash with the new values for the listed fields.","				 * @param [ev.prevVals] {Object} Hash with the previous values for the listed fields.","				 * @param ev.src {String|null} Source of the change event, if any.","				 */","				this.publish(EVT_CHANGE, {","					defaultFn: this._defSetValue","				});","				/**","				 * Fired when new data has been received from the remote source.","				 * It will also be fired even on a {{#crossLink \"GalleryModel/save\"}}{{/crossLink}} operation if the response contains values.","				 * The parsed values can be altered on the before (on) listener.","				 * @event loaded","				 * @param ev {EventFacade} containing:","				 * @param ev.response {Object} Response data as received from the remote source","				 * @param ev.parsed {Object} Data as returned from the parse method.","				 * @param ev.options {Object} Options as received by the {{#crossLink \"GalleryModel/load\"}}{{/crossLink}} method.","				 * @param ev.callback {Function} Function to call at the end of the load process","				 * @param ev.src {String} the source of the load, usually `'load'`","				 */","				this.publish(EVT_LOADED, {","					defaultFn:this._defDataLoaded,","					preventedFn: this._stoppedDataLoaded,","					stoppedFn: this._stoppedDataLoaded","				});","				/**","				 * Fired when the data has been saved to the remote source","				 * The event cannot be prevented.","				 * The developer has full control of what is","				 * about to be saved and when it is saved so it would be pointless","				 * to try to prevent it at this stage.  This is in contrast to","				 * the {{#crossLink \"GalleryModel/loaded:event\"}}{{/crossLink}} event where the developer has no control of what might","				 * come from the server and might wish to do something about it.","				 * If in reply to the save operation the server replies with data,","				 * the __response__ and __parsed__ properties will be filled.","				 * @event saved","				 * @param ev {EventFacade} containing:","				 * @param [ev.response] {Object} Response data as received from the remote source, if any.","				 * @param [ev.parsed] {Object} Data as returned from the parse method, if any.","				 * @param ev.options {Object} Options as received by the {{#crossLink \"GalleryModel/save\"}}{{/crossLink}} method.","				 * @param ev.callback {Function} Function to call at the end of the load process","				 * @param ev.src {String} the source of the save, usually `'save'`","				 */","				this.publish(EVT_SAVED, {","					preventable: false","				});","				cfg = cfg || {};","				if (Lang.isObject(cfg.values)) {","					this.after('init',this._setInitialValues);","				}","			},","			/**","			 * Sets the initial values if any were provided to the constructor.","			 * It is only ever called after the initialization of this class and all its extensions","			 * and only if the arguments to the constructor had a `values` attribute","			 * @method _setInitialValues","			 * @param ev {EventFacade} in particular:","			 * @param ev.cfg.values {Object} values to be set","			 * @private","			 */","			_setInitialValues: function (ev) {","				this.setValues(ev.cfg.values, 'init');","				this._set(IS_MODIFIED, false);","				this._set(IS_NEW, true);","				this._loadedValues = Y.clone(this._values);","			},","			/**","			 * Destroys this model instance and removes it from its containing lists, if","			 * any.","","			 * If __options.remove__ is true then this method also delegates to the","			 * {{#crossLink \"GalleryModel/sync\"}}{{/crossLink}} method to delete the model from the persistence layer.","","			 * @method destroy","			 * @param [options] {Object} Options passed on to the {{#crossLink \"GalleryModel/sync\"}}{{/crossLink}} method, if required.","			 * @param [options.remove=false] {Boolean} if true, the data will also be erased from the server.","			 * @param [callback] {function} function to be called when the sync operation finishes.","			 *		@param callback.err {string|null} Error message, if any or null.","			 *		@param callback.response {Any} The server response as received by {{#crossLink \"GalleryModel/sync\"}}{{/crossLink}}.","			 * @chainable","			 */","			destroy: function (options, callback) {","				if (Lang.isFunction(options)) {","					callback = options;","					options = {};","				} else if (!options) {","					options = {};","				}","				callback = callback || NULL_FN;","				var self = this,","					finish = function (err) {","						if (!err) {","							YArray.each(self.lists.concat(), function (list) {","								list.remove(self, options);","							});","","							Y.GalleryModel.superclass.destroy.call(self);","						}","","						callback.apply(self, arguments);","					};","","				if (options.remove) {","					this.sync('delete', options, finish);","				} else {","					finish();","				}","","				return this;","			},","			/**","			 * Returns the value of the field named","			 * @method getValue","			 * @param name {string}  Name of the field to return.","			 * @return {Any} the value of the field requested.","			 */","			getValue: function (name) {","				return this._values[name];","			},","			/**","			 * Returns a hash with all values using the field names as keys.","			 * @method getValues","			 * @return {Object} a hash with all the fields with the field names as keys.","			 */","			getValues: function() {","				return Y.clone(this._values);","			},","			/**","			 * Sets the value of the named field.","			 * Fires the {{#crossLink \"GalleryModel/change:event\"}}{{/crossLink}} event if the new value is different from the current one.","			 * Primary key fields cannot be changed unless still `undefined`.","			 * @method setValue","			 * @param name {string} Name of the field to be set","			 * @param value {Any} Value to be assigned to the field","			 * @param [src] {Any} Source of the change in the value.","			 * @chainable","			 */","			setValue: function (name, value, src) {","				var prevVal = this._values[name];","				if (prevVal !== value && (this._primaryKeys.indexOf(name) === -1 || Lang.isUndefined(prevVal))) {","					this.fire(EVT_CHANGE, {","						name:name,","						newVal:value,","						prevVal:prevVal,","						src: src","					});","				}","				return this;","			},","			/**","			 * Default function for the change event, sets the value and marks the model as modified.","			 * @method _defSetValue","			 * @param ev {EventFacade} (see {{#crossLink \"GalleryModel/change:event\"}}{{/crossLink}} event)","			 * @private","			 */","			_defSetValue: function (ev) {","				var self = this;","				if (ev.name) {","					self._values[ev.name] = ev.newVal;","					self._set(IS_MODIFIED, true);","				} else {","					YObject.each(ev.newVals, function (value, name) {","						self.setValue(name, value, ev.src);","					});","				}","			},","			/**","			 * Sets a series of values.","			 * It simply loops over the hash of values provided calling {{#crossLink \"GalleryModel/setValue\"}}{{/crossLink}} on each.","			 * Fires the {{#crossLink \"GalleryModel/change:event\"}}{{/crossLink}} event.","			 * @method setValues","			 * @param values {Object} hash of values to change","			 * @param [src] {Any} Source of the changes","			 * @chainable","			 */","			setValues: function (values, src) {","				var self = this,","					prevVals = {};","","				YObject.each(values, function (value, name) {","					prevVals[name] = self.getValue(name);","				});","				this.fire(EVT_CHANGE, {","					newVals:values,","					prevVals:prevVals,","					src: src","				});","				return self;","			},","			/**","			 * Returns a hash indexed by field name, of all the values in the model that have changed since the last time","			 * they were synchornized with the remote source.   Each entry has a __prevVal__ and __newVal__ entry.","			 * @method getChangedValues","			 * @return {Object} Hash of all entries changed since last synched.","			 * Each entry has a __newVal__ and __prevVal__ property contaning original and changed values.","			 */","			getChangedValues: function() {","				var changed = {},","					prev,","					loaded = this._loadedValues;","","				YObject.each(this._values, function (value, name) {","					prev = loaded[name];","					if (prev !== value) {","						changed[name] = {prevVal:prev, newVal: value};","					}","				});","				return changed;","			},","			/**","			 * Returns a hash with the values of the primary key fields, indexed by their field names","			 * @method getPKValues","			 * @return {Object} Hash with the primary key values, indexed by their field names","			 */","			getPKValues: function () {","				var pkValues = {},","					self = this;","				YArray.each(self._primaryKeys, function (name) {","					pkValues[name] = self._values[name];","				});","				return pkValues;","			},","			/**","				Returns an HTML-escaped version of the value of the specified string","				attribute. The value is escaped using Y.Escape.html().","","				@method getAsHTML","				@param {String} name Attribute name or object property path.","				@return {String} HTML-escaped attribute value.","			**/","			getAsHTML: function (name) {","				var value = this.getValue(name);","				return Y.Escape.html(Lang.isValue(value) ? String(value) : '');","			},","","			/**","			 * Returns a URL-encoded version of the value of the specified field,","			 * or a full URL with `name=value` sets for all fields if no name is given.","			 * The names and values are encoded using the native `encodeURIComponent()`","			 * function.","","			 * @method getAsURL","			 * @param [name] {String}  Field name.","			 * @return {String} URL-encoded field value if name is given or URL encoded set of `name=value` pairs for all fields.","			 */","			getAsURL: function (name) {","				var value = this.getValue(name),","					url = [];","				if (name) {","					return encodeURIComponent(Lang.isValue(value) ? String(value) : '');","				}","				YObject.each(value, function (value, name) {","					if (Lang.isValue(value)) {","						url.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));","					}","				});","				return url.join('&');","			},","","			/**","			 * Default function for the {{#crossLink \"GalleryModel/loaded:event\"}}{{/crossLink}} event.","			 * Does the actual setting of the values just loaded and calls the callback function.","			 * @method _defDataLoaded","			 * @param ev {EventFacade} see loaded event","			 * @private","			 */","			_defDataLoaded: function (ev) {","				var self = this;","				self.setValues(ev.parsed, ev.src);","				self._set(IS_MODIFIED, false);","				self._set(IS_NEW, false);","				self._loadedValues = Y.clone(self._values);","				ev.callback.call(self,null, ev.response);","			},","			/**","			 * Function called when the {{#crossLink \"GalleryModel/loaded:event\"}}{{/crossLink}} event is prevented, stopped or halted","			 * so that the callback is called with a suitable error","			 * @method _stoppedDataLoaded","			 * @param ev {EventFacade}","			 * @private","			 */","			_stoppedDataLoaded: function (ev) {","				ev.details[0].callback.call(this, 'Load event halted');","			},","			/**","				Loads this model from the server.","","				This method delegates to the {{#crossLink \"GalleryModel/sync\"}}{{/crossLink}} method to perform the actual load","				operation, which is an asynchronous action. Specify a __callback__ function to","				be notified of success or failure.","","				A successful load operation will fire a {{#crossLink \"GalleryModel/loaded:event\"}}{{/crossLink}} event, while an unsuccessful","				load operation will fire an {{#crossLink \"GalleryModel/error:event\"}}{{/crossLink}} event with the `src` set to `\"load\"`.","","				@method load","				@param [options] {Object} Options to be passed to {{#crossLink \"GalleryModel/sync\"}}{{/crossLink}}.","					Usually these will be or will include the keys used by the remote source","					to locate the data to be loaded.","					They will be passed on unmodified to the {{#crossLink \"GalleryModel/sync\"}}{{/crossLink}} method.","					It is up to {{#crossLink \"GalleryModel/sync\"}}{{/crossLink}} to determine what they mean.","				@param [callback] {callback} <span class=\"flag deprecated\">deprecated</span>","					Use `this.load(options).after('loaded', callback)` instead.","","					Called when the sync operation finishes. Callback will receive:","					@param callback.err {string|null} Error message, if any or null.","					@param callback.response {Any} The server response as received by sync(),","				@chainable","			**/","			load: function (options, callback) {","				var self = this;","","				if (Lang.isFunction(options)) {","					callback = options;","					options = {};","				} else if (!options) {","					options = {};","				}","				callback = callback || NULL_FN;","","				self.sync('read', options, function (err, response) {","					var facade = {","							options : options,","							response: response,","							src: 'load',","							callback: callback","						};","","					if (err) {","						facade.error = err;","","						self.fire(EVT_ERROR, facade);","						callback.apply(self, arguments);","					} else {","						self._values = {};","","						facade.parsed = self.parse(response);","						self.fire(EVT_LOADED, facade);","					}","				});","","				return self;","			},","","			/**","				Called to parse the __response__ when a response is received from the server.","				This method receives a server __response__ and is expected to return a","				value hash.","","				The default implementation assumes that __response__ is either an attribute","				hash or a JSON string that can be parsed into an attribute hash. If","				__response__ is a JSON string and either Y.JSON or the native JSON object","				are available, it will be parsed automatically. If a parse error occurs, an","				error event will be fired and the model will not be updated.","","				You may override this method to implement custom parsing logic if necessary.","","				@method parse","				@param {Any} response Server response.","				@return {Object} Values hash.","			**/","			parse: function (response) {","				if (typeof response === 'string') {","					try {","						return Y.JSON.parse(response);","					} catch (ex) {","						this.fire(EVT_ERROR, {","							error : ex,","							response: response,","							src : 'parse'","						});","","						return null;","					}","				}","","				return response;","			},","","","","			/**","				Saves this model to the server.","","				This method delegates to the {{#crossLink \"GalleryModel/sync\"}}{{/crossLink}} method to perform the actual save","				operation, which is an asynchronous action. Specify a __callback__ function to","				be notified of success or failure.","","				A successful save operation will fire a {{#crossLink \"GalleryModel/saved:event\"}}{{/crossLink}} event, while an unsuccessful","				load operation will fire an {{#crossLink \"GalleryModel/error:event\"}}{{/crossLink}} event with the 'src' property set to `\"save\"`.","","				If the save operation succeeds and the {{#crossLink \"GalleryModel/parse\"}}{{/crossLink}} method returns non-empty values","				from the response received from the server a {{#crossLink \"GalleryModel/loaded:event\"}}{{/crossLink}}","                event will also be fired to read those values.","","				@method save","				@param {Object} [options] Options to be passed to {{#crossLink \"GalleryModel/sync\"}}{{/crossLink}}.","					It's up to the custom sync implementation","					to determine what options it supports or requires, if any.","				@param {Function} [callback] Called when the sync operation finishes.","					@param callback.err {string|null} Error message, if any or null.","					@param callback.response {Any} The server response as received by {{#crossLink \"GalleryModel/sync\"}}{{/crossLink}},","				@chainable","			**/","			save: function (options, callback) {","				var self = this;","","				if (Lang.isFunction(options)) {","					callback = options;","					options = {};","				} else if (!options) {","					options = {};","				}","				callback = callback || NULL_FN;","","				self._validate(self.getValues(), function (err) {","					if (err) {","						callback.call(self, err);","						return;","					}","","					self.sync(self.get(IS_NEW) ? 'create' : 'update', options, function (err, response) {","						var facade = {","								options : options,","								response: response,","								src: 'save'","							};","","						if (err) {","							facade.error = err;","","							self.fire(EVT_ERROR, facade);","						} else {","							facade.parsed = self.parse(response);","							facade.callback = callback;","							self._set(IS_MODIFIED, false);","							self._set(IS_NEW, false);","							self._loadedValues = Y.clone(self._values);","							self.fire(EVT_SAVED, facade);","							if (facade.parsed) {","								self.fire(EVT_LOADED, facade);","								return self; // the loaded event will take care of calling the callback","							}","						}","						callback.apply(self, arguments);","					});","				});","","				return self;","			},","			/**","			 * Restores the values when last loaded, saved or created.","			 * @method reset","			 * @chainable","			 */","			reset: function() {","				this._values = Y.clone(this._loadedValues);","				this.fire(EVT_RESET);","				return this;","			},","			/**","				Override this method to provide a custom persistence implementation for this","				model. The default just calls the callback without actually doing anything.","","				This method is called internally by {{#crossLink \"GalleryModel/load\"}}{{/crossLink}},","				{{#crossLink \"GalleryModel/save\"}}{{/crossLink}},","				and {{#crossLink \"GalleryModel/destroy\"}}{{/crossLink}} (when `options.remove==true).","","				@method sync","				@param {String} action Sync action to perform. May be one of the following:","","					* create: Store a newly-created model for the first time.","					* read  : Load an existing model.","					* update: Update an existing model.","					* delete: Delete an existing model.","","				@param {Object} [options] Sync options. It's up to the custom sync","					implementation to determine what options it supports or requires, if any.","				@param {Function} [callback] Called when the sync operation finishes.","					@param {Error|null} callback.err If an error occurred, this parameter will","						contain the error. If the sync operation succeeded, __err__ will be","						falsy.","					@param {Any} [callback.response] The server's response. This value will","						be passed to the {{#crossLink \"GalleryModel/parse\"}}{{/crossLink}} method, which is expected to parse it and","						return an attribute hash.","			**/","			sync: function (action, options, callback) {","				(callback || NULL_FN).call(this);","			},","			/**","				Override this method to provide custom validation logic for this model.","","				This method gives you a hook to validate a hash of all","				attributes before the model is saved. This method is called automatically","				before {{#crossLink \"GalleryModel/save\"}}{{/crossLink}} takes any action.","				If validation fails, the {{#crossLink \"GalleryModel/save\"}}{{/crossLink}} call","				will be aborted.","","				In your validation method, call the provided callback function with no","				arguments to indicate success. To indicate failure, pass a single argument,","				which may contain an error message, an array of error messages, or any other","				value. This value will be passed along to the error event.","","				@example","","					model.validate = function (attrs, callback) {","						if (attrs.pie !== true) {","							// No pie?! Invalid!","							callback('Must provide pie.');","							return;","						}","","						// Success!","						callback();","					};","","				@method validate","				@param {Object} attrs Hash containing all model attributes to","				be validated.","				@param {Function} callback Validation callback. Call this function when your","				validation logic finishes. To trigger a validation failure, pass any","				value as the first argument to the callback (ideally a meaningful","				validation error of some kind).","","				@param {Any} [callback.err] Validation error. Don't provide this","				argument if validation succeeds. If validation fails, set this to an","				error message or some other meaningful value. It will be passed","				along to the resulting error event.","			**/","			validate: function (attrs, callback) {","				(callback || NULL_FN).call(this);","			},","			/**","				Calls the public, overridable validate() method and fires an error event","				if validation fails.","","				@method _validate","				@param {Object} attributes Attribute hash.","				@param {Function} callback Validation callback.","				@param {Any} [callback.err] Value on failure, non-value on success.","				@protected","			**/","			_validate: function (attributes, callback) {","				var self = this;","","				self.validate(attributes, function (err) {","					if (Lang.isValue(err)) {","						// Validation failed. Fire an error.","						self.fire(EVT_ERROR, {","							attributes: attributes,","							error : err,","							src : 'validate'","						});","","						callback.call(self, err);","						return;","					}","","					callback.call(self);","				});","","			},","			/**","			 * The default implementation calls {{#crossLink \"GalleryModel/getValues\"}}{{/crossLink}}","			 * so that it returns a copy of the record.","			 * The developer may redefine this method to serialize this object","			 * in any way that might be needed.","			 * For example, it might be desirable to call","			 * {{#crossLink \"GalleryModel/getChangedValues\"}}{{/crossLink}}","			 * to return only changed fields, along with","			 * {{#crossLink \"GalleryModel/getPKValues\"}}{{/crossLink}}","			 * to identify the record with the changes.","			 * @method toJSON","			 * @return {Object} Copy of this model field values.","			 */","			toJSON: function () {","				return this.getValues();","			},","			/**","			 * Getter for the {{#crossLink \"GalleryModel/isModified:attribute\"}}{{/crossLink}} attribute.","			 * If the value contains a dot (`'.'`) the modified state of the field named as a sub-attribute will be returned.","			 * Otherwise, the modified status of the whole record will be returned.","			 * @method _isModifiedGetter","			 * @param value {Any} Value stored for the attribute.","			 * @value name {String} Name of the attribute/sub-attribute being modified","			 * @return {Boolean} State of the record/field","			 * @protected","			 */","			_isModifiedGetter: function (value, name) {","				name = name.split(DOT);","				if (name.length > 1) {","					name = name[1];","					var ret = {};","					ret[name] = this._values[name] !== this._loadedValues[name];","					return ret;","				}","				return value;","			},","			/**","			 * Getter for the {{#crossLink \"GalleryModel/isNew:attribute\"}}{{/crossLink}} attribute.","			 * If the value contains a dot (`'.'`) the 'new' state of the field named as a sub-attribute will be returned.","			 * Otherwise, the 'new' status of the whole record will be returned.","			 * @method _isNewGetter","			 * @param value {Any} Value stored for the attribute.","			 * @value name {String} Name of the attribute/sub-attribute being modified","			 * @return {Boolean} State of the record/field","			 * @protected","			 */","			_isNewGetter: function (value, name) {","				name = name.split(DOT);","				if (name.length > 1) {","					name = name[1];","					var ret = {};","					ret[name] = !this._loadedValues.hasOwnProperty(name);","					return ret;","				}","				return value;","			},","			/**","			 * Setter for the {{#crossLink \"GalleryModel/primaryKeys:attribute\"}}{{/crossLink}} attribute.","			 * If the value is already set, no further changes will be allowed.","			 * If the value is not an array, it will be converted to one.","			 * @method _primaryKeysSetter","			 * @param value {Any} Value stored for the attribute.","			 * @return {Array} Primary keys","			 * @protected","			 */","			_primaryKeysSetter: function (value) {","				if (this._primaryKeys && this._primaryKeys.length) {","					return Y.Attribute.INVALID_VALUE;","				}","				value = new YArray(value);","				this._primaryKeys = value;","				return value;","			},","			/**","			 * Getter for the {{#crossLink \"GalleryModel/primaryKeys:attribute\"}}{{/crossLink}} attribute.","			 * If the name contains a dot (`'.'`) it will return a boolean indicating","			 * whether the field named as a sub-attribute is part of the primary key.","			 * Otherwise, it returns the array of primary key fields.","			 * @method  _primaryKeysGetter","			 * @param value {Array} Names of the primary key fields","			 * @param name {String} Name of the attribute/sub-attribute requested.","			 * @return {Array|Boolean} Array of the primary key field names or Boolean indicating if the asked for field is part of it.","			 * @private","			 */","			_primaryKeysGetter: function (value, name) {","				name = name.split(DOT);","				if (name.length > 1) {","					name = name[1];","					var ret = {};","					ret[name] = value.indexOf(name) !== -1;","					return ret;","				}","				return (value || []).concat();  // makes sure to return a copy, not the original.","			}","		},","		{","			ATTRS: {","				/**","				 * Indicates whether any of the fields has been changed since created or loaded.","				 * Field names can be given as sub-attributes to indicate if any particular field has beeen changed.","				 * `model.get('isModified.name')` returns `true` if the field `name` has been modified.","				 * <b>Note:</b> contrary to common practice in Attributes with sub-attributes,","				 * requesting the state of the record does not","				 * return an object with the state of each individual field keyed by field name,","				 * but the state of the record as a whole, which is far more useful.","				 * @attribute isModified","				 * @type Boolean","				 * @readonly","				 * @default false","				 */","				isModified: {","					readOnly: true,","					value:false,","					validator:Lang.isBoolean,","					getter: '_isModifiedGetter'","				},","				/**","				 * Indicates that the model is new and has not been modified since creation.","				 * Field names can be given as sub-attributes to indicate if any particular field is new.","				 * `model.get('isNew.name')` returns `true` if the field `name` is new.","				 * <b>Note:</b> contrary to common practice in Attributes with sub-attributes,","				 * requesting the state of the record does not","				 * return an object with the state of each individual field keyed by field name,","				 * but the state of the record as a whole, which is far more useful.","				 * @attribute isNew","				 * @type Boolean","				 * @readonly","				 * @default true","				 */","				isNew: {","					readOnly: true,","					value:true,","					validator:Lang.isBoolean,","					getter: '_isNewGetter'","				},","				/**","				 * List of fields making the primary key of this model.","				 * Primary Key fields cannot be modified once initially loaded.","				 * It can be set as an array of field names or, if the key is made of a single field, a string with the name of that field.","				 * It will always be returned as an array.","				 * Field names can be given as a sub-attribute to ask whether a particular field is a primary key, thus:","				 * `model.get('primaryKeys.name')` returns `true` if the field `name` is a primary key.","				 * It can only be set once.","				 * @attribute primaryKeys","				 * @writeonce","				 * @type array","				 * @default []","				 */","				primaryKeys: {","					setter:'_primaryKeysSetter',","					getter:'_primaryKeysGetter',","					lazyAdd: false,","					value: []","				}","			}","","		}","	);","","	/**","	 * An extension for GalleryModel that provides a single level of undo for each field.","	 * It will never undo a field to `undefined` since it assumes an undefined field had not been set.","	 * @class GalleryModelSimpleUndo","	 */","	Y.GalleryModelSimpleUndo = function () {};","","	Y.GalleryModelSimpleUndo.prototype = {","		initializer: function () {","			this._lastChange = {};","			if (this._addPreserve) {","				this._addPreserve('_lastChange');","			}","			this.after(EVT_CHANGE, this._trackChange);","			this.on([EVT_LOADED, EVT_SAVED, EVT_RESET], this._resetUndo);","		},","		/**","		 * Event listener for the after value change event, it tracks changes for each field.","		 * It retains only the last change for each field.","		 * @method _trackChange","		 * @param ev {EventFacade} As provided by the {{#crossLink \"GalleryModel/change:event\"}}{{/crossLink}} event","		 * @private","		 */","		_trackChange: function (ev) {","			if (ev.name && ev.src !== UNDO) {","				this._lastChange[ev.name] = ev.prevVal;","			}","		},","		/**","		 * After load or save operations, it drops any changes it might have tracked.","		 * @method _resetUndo","		 * @private","		 */","		_resetUndo: function () {","			this._lastChange = {};","		},","		/**","		 * Reverts one level of change for a specific field or all fields","		 * @method undo","		 * @param [name] {String} If provided it will undo that particular field,","		 *	otherwise, it undoes the whole record.","		 * @chainable","		 */","		undo: function (name) {","			var self = this;","			if (name) {","				if (self._lastChange[name] !== undefined) {","					self.setValue(name, self._lastChange[name], UNDO);","					delete self._lastChange[name];","				}","			} else {","				YObject.each(self._lastChange, function (value, name) {","					if (value !== undefined) {","						self.setValue(name, value, UNDO);","					}","				});","				self._lastChange = {};","			}","			return self;","		}","	};","","	/**","	 * Provides multiple levels of undo in strict chronological order","	 * whatever the field was at each stage.","	 * Changes done on multiple fields via setValues","	 * will also be undone in one step.","	 * @class GalleryModelChronologicalUndo","	 */","	Y.GalleryModelChronologicalUndo = function () {};","","	Y.GalleryModelChronologicalUndo.prototype = {","		initializer: function () {","			this._changes = [];","			if (this._addPreserve) {","				this._addPreserve('_changes');","			}","			this.after(EVT_CHANGE, this._trackChange);","			this.on([EVT_LOADED,EVT_SAVED,EVT_RESET], this._resetUndo);","		},","		/**","		 * Event listener for the after value change event, it tracks changes for each field.","		 * It keeps a stack of each change.","		 * @method _trackChange","		 * @param ev {EventFacade} As provided by the {{#crossLink \"GalleryModel/change:event\"}}{{/crossLink}} event","		 * @private","		 */","		_trackChange: function (ev) {","			if (ev.src !== UNDO) {","				this._changes.push(ev.details);","			}","		},","		/**","		 * After load or save operations, it drops any changes it might have tracked.","		 * @method _resetUndo","		 * @private","		 */","		_resetUndo: function () {","			this._changes = [];","		},","		/**","		 * Reverts one level of field changes.","		 * @method undo","		 * @chainable","		 */","		undo: function () {","			var ev = this._changes.pop();","			if (ev) {","				if (ev.name) {","					this.setValue(ev.name, ev.prevVal, UNDO);","				} else {","					this.setValues(ev.prevVals, UNDO);","				}","			}","			if (this._changes.length === 0) {","				this._set(IS_MODIFIED, false);","			}","			return this;","		}","	};","","	/**","	 * Allows GalleryModel to handle a set of records using the Flyweight pattern.","	 * It exposes one record at a time from a shelf of records.","	 * Exposed records can be selected by setting the {{#crossLink \"GalleryModel/index:attribute\"}}{{/crossLink}} attribute.","	 * @class GalleryModelMultiRecord","	 */","","	var INDEX = 'index',","		MR = function () {};","","	MR.prototype = {","		/**","		 * Added this property to have `ModelSync.REST getURL()` return the proper URL.","		 * @property _isYUIModelList","		 * @type Boolean","		 * @value true","		 * @private","		 */","		_isYUIModelList: true,","		initializer: function () {","			this._shelves = [];","			this._currentIndex = 0;","			this._addPreserve('_values','_loadedValues','_isNew','_isModified');","		},","		/**","		 * Sets the initial values if any were provided to the constructor.","		 * It is only ever called after the initialization of this class and all its extensions","		 * and only if the arguments to the constructor had a `values` attribute.","		 * It overrides the {{#crossLink \"GalleryModel/_setInitialValues\"}}{{/crossLink}}","		 * so as to handle arrays.","		 * @method _setInitialValues","		 * @param ev {EventFacade} in particular:","		 * @param ev.cfg.values {Object} values to be set","		 * @private","		 */","		_setInitialValues: function (ev) {","			this.add(ev.cfg.values);","		},","","		/**","		 * Index of the shelf for the record being exposed.","		 * Use {{#crossLink \"GalleryModel/index:attribute\"}}{{/crossLink}} attribute to check/set the index value.","		 * @property _currentIndex","		 * @type integer","		 * @default 0","		 * @private","		 */","		_currentIndex: 0,","		/**","		 * Storage for the records when not exposed.","		 * @property _shelves","		 * @type Array","		 * @private","		 */","		_shelves: null,","		/**","		 * Saves the exposed record into the shelves at the position specified or given by","         * {{#crossLink \"GalleryModelMultiRecord/_currentIndex\"}}{{/crossLink}}","		 * @method _shelve","		 * @param [index=this._currentIndex] {Integer} Position to shelve it in","		 * @private","		 */","		_shelve: function(index) {","			if (index === undefined) {","				index = this._currentIndex;","			}","			var self = this,","				current = {};","			YArray.each(self._preserve, function (name) {","				current[name] = self[name];","			});","			self._shelves[index] = current;","","		},","		/**","		 * Retrives and exposes the record from the shelf at the position specified or given by","         * {{#crossLink \"GalleryModelMultiRecord/_currentIndex\"}}{{/crossLink}}","		 * @method _fetch","		 * @param [index=this._currentIndex] {Integer} Position to fetch it from.","		 * @private","		 */","		_fetch: function (index) {","			if (index === undefined) {","				index = this._currentIndex;","			} else {","				this._currentIndex = index;","			}","			var self = this,","				current = self._shelves[index];","","			if (Lang.isUndefined(current)) {","				this._initNew();","			} else {","				YArray.each(self._preserve, function (name) {","					self[name] = current[name];","				});","			}","","		},","		/**","		 * Adds the names of properties that are to be preserved in the shelf when moving,","		 * and taken out of the shelf when fetching.","		 * @method _addPreserve","		 * @param name* {String} any number of names or array of names of properties to be preserved.","		 * @protected","		 */","		_addPreserve: function () {","			this._preserve = (this._preserve || []).concat(Array.prototype.slice.call(arguments));","		},","","		/**","		 * Initializes an exposed record","		 * @method _initNew","		 * @private","		 */","		_initNew: function () {","			this._values = {};","			this._loadedValues = {};","			this._isNew = true;","			this._isModified = false;","		},","		/**","		 * Adds a new record at the index position given or at the end.","		 * The new record becomes the current.","		 * @method add","		 * @param values {Object|Array} set of values to set.","		 * If it is an array, it will call itself for each of the items in it.","		 * @param [index] {Integer} position to add the values at or at the end if not provided.","		 * @chainable","		 */","		add: function(values, index) {","			var self = this;","			if (Lang.isArray(values)) {","				YArray.each(values, function (value, i) {","					self.add(value, (index?index + i:undefined));","				});","				return self;","			}","			if (self.get(IS_MODIFIED) || !self.get(IS_NEW)) {","				self._shelve();","			}","			if (index === undefined) {","				index = self._shelves.length;","			}","			self._shelves.splice(index, 0, {});","			self._currentIndex = index;","			self._initNew();","			self.setValues(values, ADD);","			return self;","		},","		/**","		 * Executes the given function for each record in the set.","		 * The function will run in the scope of the model so it can use","		 * `this.{{#crossLink \"GalleryModel/getValue\"}}{{/crossLink}}()`","		 * or any such method to access the values of the current record.","		 * Returning exactly `false` from the function spares shelving the record.","		 * If the callback function does not modify the record,","		 * returning `false` will improve performance.","		 * @method each","		 * @param fn {function} function to execute, it will be provided with:","		 * @param fn.index {integer} index of the record exposed","		 * @chainable","		 */","		each: function(fn) {","			var self = this;","			self._shelve();","			YArray.each(self._shelves, function (shelf, index) {","				self._currentIndex = index;","				self._fetch(index);","				if (fn.call(self, index) !== false) {","					self._shelve(index);","				}","			});","			return self;","		},","		/**","		 * Executes the given function for each record in the set.","		 * The function will run in the scope of the model so it can use","		 * `this.{{#crossLink \"GalleryModel/getValue\"}}{{/crossLink}}`","		 * or any such method to access the values of the current record.","		 * It is faster than using {{#crossLink \"GalleryModelMultiRecord/each\"}}{{/crossLink}}","		 * and then checking the {{#crossLink \"GalleryModel/isModified:attribute\"}}{{/crossLink}} attribute","		 * Returning exactly `false` from the function spares shelving the record.","		 * If the callback function does not modify the record,","		 * returning `false` will improve performance.","		 * @method eachModified","		 * @param fn {function} function to execute, it will be provided with:","		 * @param fn.index {integer} index of the record exposed","		 * @chainable","		 */","		eachModified:function(fn) {","			var self = this;","			self._shelve();","			YArray.each(self._shelves,  function (shelf, index) {","				if (self._shelves[index][IS_MODIFIED]) {","					self._currentIndex = index;","					self._fetch(index);","					if (fn.call(self, index) !== false) {","						self._shelve(index);","					}","				}","			});","			return self;","		},","		/**","		 * Calls {{#crossLink \"GalleryModel/save\"}}{{/crossLink}} on each record modified.","		 * This is not the best saving strategy for saving batches of records,","		 * but it is the easiest and safest.  Implementors are encouraged to","		 * design their own.","		 * @method saveAllModified","		 * @chainable","		 */","		saveAllModified: function () {","			this.eachModified(this.save);","			return this;","		},","		/**","		 * This is a documentation entry only, this method does not define `load`.","		 * This extension redefines the default action for the {{#crossLink \"GalleryModel/loaded:event\"}}{{/crossLink}} event so","		 * that if a load returns an array of records, they will be added to the shelves.","		 * Existing records are kept, call {{#crossLink \"GalleryModelMultiRecord/empty\"}}{{/crossLink}} if they should be discarded.","		 * See method {{#crossLink \"GalleryModel/load\"}}{{/crossLink}} of {{#crossLink \"GalleryModel\"}}{{/crossLink}} for further info.","		 * @method load","		 */","		/**","		 * Default action for the loaded event, checks if the parsed response is an array","		 * and saves it into the shelves, otherwise it calls the default loader for single records.","		 * @method _defDataLoaded","		 * @param ev {EventFacade} facade produced by load.","		 * @private","		 */","		_defDataLoaded: function (ev) {","			var self = this,","				shelves = self._shelves;","			if (Lang.isArray(ev.parsed)) {","				if (shelves.length && (self.get(IS_MODIFIED) || !self.get(IS_NEW))) {","					self._shelve();","				}","				YArray.each(ev.parsed, function (values) {","					shelves.push({","						_values: values,","						_loadedValues: Y.clone(values),","						isNew: false,","						isModified:false","					});","				});","				self._fetch();","				if (self._sort) {","					self._sort();","				}","				ev.callback.call(self,null, ev.response);","			} else {","				Y.GalleryModel.prototype._defDataLoaded.apply(self, arguments);","			}","","		},","		/**","		 * Returns the number of records stored, skipping over empty slots.","		 * @method size","		 * @return {Integer} number of records in the shelves","		 */","		size: function() {","			var count = 0;","			YArray.each(this._shelves, function () {","				count +=1;","			});","			return count;","		},","		/**","		 * Empties the shelves of any records as well as the exposed record","		 * @method empty","		 * @chainable","		 */","		empty: function () {","			this._shelves = [];","			this._currentIndex = 0;","			this.reset();","			return this;","		},","		/**","		 * Setter for the {{#crossLink \"GalleryModelMultiRecord/index:attribute\"}}{{/crossLink}} attribute.","		 * Validates and copies the current index value into {{#crossLink \"GalleryModel/_currentIndex\"}}{{/crossLink}}.","		 * It shelves the current record and fetches the requested one.","		 * @method _indexSetter","		 * @param value {integer} new value for the index","		 * @return {integer|INVALID_VALUE} new value for the index or INVALID_VALUE if invalid.","		 * @private","		 */","		_indexSetter: function (value) {","			if (Lang.isNumber(value) && value >= 0 && value < this._shelves.length) {","				this._shelve(this._currentIndex);","				this._currentIndex = value = parseInt(value,10);","				this._fetch(value);","				return value;","			}","			return Y.Attribute.INVALID_VALUE;","		},","		/**","		 * Getter for the {{#crossLink \"GalleryModelMultiRecord/index:attribute\"}}{{/crossLink}} attribute","		 * Returns the value from {{#crossLink \"GalleryModelMultiRecord/_currentIndex\"}}{{/crossLink}}","		 * @method _indexGetter","		 * @return {integer} value of the index","		 * @private","		 */","		_indexGetter: function () {","			return this._currentIndex;","		},","		/**","		 * Getter for the {{#crossLink \"GalleryModel/isNew:attribute\"}}{{/crossLink}} attribute used only for GalleryModelMultiRecord","		 * so that it is read from the shelf and not from the actual attribute,","		 * which is expensive to shelve","		 * @method _isNewGetter","		 * @param value {Boolean} value stored in the attribute, it is ignored.","		 * @param name {String} name of the attribute.","		 *		If it contains a dot, the original getter is called.","		 * @return {Boolean} state of the attribute","		 * @private","		 */","		_isNewGetter: function (value, name) {","			if (name.split(DOT).length > 1) {","				return Y.GalleryModel.prototype._isNewGetter.apply(this, arguments);","			}","			return this._isNew;","","		},","		/**","		 * Setter for the {{#crossLink \"GalleryModel/isNew:attribute\"}}{{/crossLink}} attribute used only for GalleryModelMultiRecord","		 * so that it is written into the shelf and not into the actual attribute,","		 * which is expensive to shelve","		 * @method _isNewSetter","		 * @param value {Boolean} value stored in the attribute.","		 * @return {Boolean} the same value as received.","		 * @private","		 */","		_isNewSetter: function (value) {","			return (this._isNew = value);","		},","		/**","		 * Getter for the {{#crossLink \"GalleryModel/isModified:attribute\"}}{{/crossLink}} attribute used only for GalleryModelMultiRecord","		 * so that it is read from the shelf and not from the actual attribute,","		 * which is expensive to shelve","		 * @method _isModifiedGetter","		 * @param value {Boolean} value stored in the attribute, it is ignored.","		 * @param name {String} name of the attribute.","		 *		If it contains a dot, the original getter is called.","		 * @return {Boolean} state of the attribute","		 * @private","		 */","		_isModifiedGetter:  function (value, name) {","			if (name.split(DOT).length > 1) {","				return Y.GalleryModel.prototype._isModifiedGetter.apply(this, arguments);","			}","			return this._isModified;","","		},","		/**","		 * Setter for the {{#crossLink \"GalleryModel/isModified:attribute\"}}{{/crossLink}} attribute used only for GalleryModelMultiRecord","		 * so that it is written into the shelf and not into the actual attribute,","		 * which is expensive to shelve","		 * @method _isModifiedSetter","		 * @param value {Boolean} value stored in the attribute.","		 * @return {Boolean} the same value as received.","		 * @private","		 */","		_isModifiedSetter:  function (value) {","			return (this._isModified = value);","		}","","","	};","","	MR.ATTRS = {","		/**","		 * Index of the record exposed.","		 * @attribute index","		 * @type Integer","		 * @default 0","		 */","		index: {","			value: 0,","			setter:'_indexSetter',","			getter:'_indexGetter'","		},","		/**","		 * Merges the new setter into the existing {{#crossLink \"GalleryModel/isNew:attribute\"}}{{/crossLink}} attribute","		 * @attribute isNew","		 */","		isNew: {","			setter:'_isNewSetter'","		},","		/**","		 * Merges the new setter into the existing {{#crossLink \"GalleryModel/isModified:attribute\"}}{{/crossLink}} attribute.","		 * @attribute isModified","		 */","		isModified: {","			setter: '_isModifiedSetter'","		}","	};","","	Y.GalleryModelMultiRecord = MR;","","	/**","	 * Extension to sort records stored in {{#crossLink \"GalleryModel\"}}{{/crossLink}},","     * extended with {{#crossLink \"GalleryModelMultiRecord\"}}{{/crossLink}}","	 * It is incompatible with {{#crossLink \"GalleryModelPrimaryKeyIndex\"}}{{/crossLink}}","	 * @class GalleryModelSortedMultiRecord","	 */","	var SFIELD = 'sortField',","		SDIR = 'sortDir',","		ASC = 'asc',","		DESC = 'desc',","		SMR = function () {};","","	SMR.prototype = {","		/**","		 * Compare function used in sorting.","		 * @method _compare","		 * @param a {object} shelf to compare","		 * @param b {object} shelf to compare","		 * @return {integer} -1, 0 or 1 as required by Array.sort","		 * @private","		 */","		_compare: null,","		/**","		 * Initializer lifecycle method.","		 * Ensures proper defaults, sets the compare method and","		 * sets listeners for relevant events","		 * @method initializer","		 * @protected","		 */","		initializer: function () {","			if (this.get(SFIELD) === undefined) {","				this._set(SFIELD, this.get('primaryKeys')[0]);","			}","			this._setCompare();","			this.after([SFIELD + CHANGE, SDIR + CHANGE], this._sort);","			this.after(EVT_CHANGE, this._afterChange);","		},","		/**","		 * Sets the compare function to be used in sorting the records","		 * based on the {{#crossLink \"GalleryModelSortedMultiRecord/sortField:attribute\"}}{{/crossLink}}","		 * and {{#crossLink \"GalleryModelSortedMultiRecord/sortDir:attribute\"}}{{/crossLink}}","		 * attributes and stores it into this._compare","		 * @method _setCompare","		 * @private","		 */","		_setCompare: function () {","			var sortField = this.get(SFIELD),","				sortAsc = this.get(SDIR) === ASC?1:-1,","				compareValue = (Lang.isFunction(sortField)?","					sortField:","					function(values) {","						return values[sortField];","					}","				);","			this._compare = function(a, b) {","				var aValue = compareValue(a._values),","					bValue = compareValue(b._values);","","				return (aValue < bValue ? -1 : (aValue > bValue ? 1 : 0)) * sortAsc;","			};","		},","		/**","		 * Sorts the shelves whenever the","		 * {{#crossLink \"GalleryModelSortedMultiRecord/sortField:attribute\"}}{{/crossLink}}","		 * or {{#crossLink \"GalleryModelSortedMultiRecord/sortDir:attribute\"}}{{/crossLink}}","		 * attributes change.","		 * @method _sort","		 * @private","		 */","		_sort: function() {","			this._setCompare();","			this._shelve();","			this._shelves.sort(this._compare);","			this._shelves.splice(this.size());","			this._fetch(0);","		},","		/**","		 * Listens to value changes and if the name of the field is that of the","		 * {{#crossLink \"GalleryModelSortedMultiRecord/sortField:attribute\"}}{{/crossLink}} attribute","		 * or if {{#crossLink \"GalleryModelSortedMultiRecord/sortField:attribute\"}}{{/crossLink}}","		 * is a function, it will relocate the record to its proper sort order","		 * @method _afterChange","		 * @param ev {EventFacade} Event façade as produced by the {{#crossLink \"GalleryModel/change:event\"}}{{/crossLink}}  event","		 * @private","		 */","		_afterChange: function (ev) {","			var fieldName = ev.name,","				sField = this.get(SFIELD),","				index,","				currentIndex = this._currentIndex,","				shelves = this._shelves,","				currentShelf;","","			if (fieldName && ev.src !== ADD && (Lang.isFunction(sField) || fieldName === sField)) {","				// The shelf has to be emptied otherwise _findIndex may match itself.","				currentShelf = shelves.splice(currentIndex,1)[0];","				index = this._findIndex(currentShelf._values);","				shelves.splice(index,0,currentShelf);","				this._currentIndex = index;","			}","		},","		/**","		 * Finds the correct index position of a record within the shelves","		 * according to the current","		 * {{#crossLink \"GalleryModelSortedMultiRecord/sortField:attribute\"}}{{/crossLink}}","		 * or {{#crossLink \"GalleryModelSortedMultiRecord/sortDir:attribute\"}}{{/crossLink}}","		 * attributes","		 * @method _findIndex","		 * @param values {Object} values of the record to be located","		 * @return {Integer} location for the record","		 * @private","		 */","		_findIndex: function (values) {","			var shelves = this._shelves,","				low = 0,","				high = shelves.length,","				index = 0,","				cmp = this._compare,","				vals = {_values: values};","","			while (low < high) {","				index = Math.floor((high + low) / 2);","				switch(cmp(vals, shelves[index])) {","					case 1:","						low = index + 1;","						break;","					case -1:","						high = index;","						break;","					default:","						low = high = index;","				}","","			}","			return low;","","		},","		/**","		 * Adds a new record at its proper position according to the sort configuration.","		 * It overrides","		 * {{#crossLink \"GalleryModelMultiRecord\"}}{{/crossLink}}'s own","		 * {{#crossLink \"GalleryModelMultiRecord/add\"}}{{/crossLink}}","		 * method, ignoring the index position requested, if any.","		 * The new record becomes the current.","		 * @method add","		 * @param values {Object|Array} set of values to set.","		 * If it is an array, it will call itself for each of the items in it.","		 * @chainable","		 */","		add: function(values) {","			if (Lang.isArray(values)) {","				YArray.each(values, this.add, this);","				return this;","			}","			var shelves = this._shelves,","				index = 0;","","			index = this._findIndex(values);","			this._currentIndex = index;","			shelves.splice(index, 0, {});","			this._initNew();","			this.setValues(values, ADD);","			this._shelve(index);","			return this;","		},","		/**","		 * Locates a record by value.  The record will be located by the field","		 * given in the {{#crossLink \"GalleryModelSortedMultiRecord/sortField:attribute\"}}{{/crossLink}}","		 *  attribute.   It will return the index of the","		 * record in the shelves or `null` if not found.","		 * By default it will expose that record.","		 * If {{#crossLink \"GalleryModelSortedMultiRecord/sortField:attribute\"}}{{/crossLink}}","		 * contains a function, it will return `null` and do nothing.","		 * Since sort fields need not be unique, find may return any of the records","		 * with the same value for that field.","		 * @method find","		 * @param value {Any} value to be found","		 * @param [move] {Boolean} exposes the record found, defaults to `true`","		 * @return {integer | null} index of the record found or `null` if not found.","		 * Be sure to differentiate a return of `0`, a valid index, from `null`, a failed search.","		 */","		find: function (value, move) {","			var sfield = this.get(SFIELD),","				index,","				values = {};","			if (Lang.isFunction(sfield)) {","				return null;","			}","			values[sfield] = value;","			index = this._findIndex(values);","			if (this._shelves[index]._values[sfield] !== value) {","				return null;","			}","			if (move || arguments.length < 2) {","				this.set(INDEX, index);","			}","			return index;","		}","	};","	SMR.ATTRS = {","		/**","		 * Name of the field to sort by or function to build the value used for comparisson.","		 * If a function, it will receive a reference to the record to be sorted;","		 * it should return the value to be used for comparisson.  Functions are","		 * used when sorting on multiple keys, which the function should return","		 * concatenated, or when any of the fields needs some pre-processing.","		 * @attribute sortField","		 * @type String | Function","		 * @default first primary key field","		 */","		sortField: {","			validator: function (value){","				return Lang.isString(value) || Lang.isFunction(value);","			}","		},","		/**","		 * Sort direction either `\"asc\"` for ascending or `\"desc\"` for descending","		 * @attribute sortDir","		 * @type String","		 * @default \"asc\"","		 */","		sortDir: {","			validator: function (value) {","				return value === DESC || value === ASC;","			},","			value: ASC","		}","	};","	Y.GalleryModelSortedMultiRecord = SMR;","","	/**","	 * Extension to store the records in the GalleryModel using the field in the","	 * {{#crossLink \"GalleryModel/primaryKeys:attribute\"}}{{/crossLink}} attribute as its index.","	 * The primary key __must__ be a __single__ __unique__ __integer__ field.","	 * It should be used along {{#crossLink \"GalleryModelMultiRecord\"}}{{/crossLink}}.","	 * It is incompatible with {{#crossLink \"GalleryModelSortedMultiRecord\"}}{{/crossLink}}.","	 * @class GalleryModelPrimaryKeyIndex","	 */","	var PKI = function () {};","	PKI.prototype = {","		/**","		 * Adds a new record at the index position given by its primary key.","		 * The new record becomes the current.","		 * @method add","		 * @param values {Object|Array} set of values to set.","		 * If it is an array, it will call itself for each of the items in it.","		 * @chainable","		 */","		add: function(values) {","			if (Lang.isArray(values)) {","				YArray.each(values, this.add, this);","				return this;","			}","			if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {","				this._shelve();","			}","			this._currentIndex = values[this._primaryKeys[0]];","			this._initNew();","			this.setValues(values, ADD);","			return this;","		},","		/**","		 * Default action for the {{#crossLink \"GalleryModel/loaded:event\"}}{{/crossLink}} event,","		 * checks if the parsed response is an array","		 * and saves it into the shelves using the value of the primary key field for its index.","		 * The model will be left positioned at the item with the lowest key value.","		 * If the primary key field has not been declared, items will not be loaded.","		 * If the primary key field is not unique, the duplicate will overwrite the previous.","		 * @method _defDataLoaded","		 * @param ev {EventFacade} facade produced by the {{#crossLink \"GalleryModel/loaded:event\"}}{{/crossLink}} event,","		 * @private","		 */","		_defDataLoaded: function (ev) {","			var self = this,","				shelves = self._shelves,","				pk = self._primaryKeys[0];","","			if (Lang.isUndefined(pk)) {","				return;","			}","			if (self.get(IS_MODIFIED) || !self.get(IS_NEW)) {","				self._shelve();","			}","			YArray.each(new YArray(ev.parsed), function (values) {","				shelves[values[pk]] = {","					_values: values,","					_loadedValues: Y.clone(values),","					isNew: false,","					isModified:false","				};","			});","			YArray.some(shelves, function (shelf, index) {","				self._fetch(index);","				return true;","			});","			ev.callback.call(self,null, ev.response);","","		},","		/**","		 * Sugar method added because items might not be contiguous so","		 * adding one to the index does not always get you to the next item.","		 * If there is no next element, `null` will be returned and the","		 * collection will still point to the last item.","		 * @method next","		 * @return {integer} index of the next item or `null` if none found","		 */","		next: function () {","			if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {","				this._shelve();","			}","			var shelves = this._shelves,","				index = this._currentIndex + 1,","				l = shelves.length;","			while (index < l && !shelves.hasOwnProperty(index)) {","				index +=1;","			}","			if (index === l) {","				return null;","			}","			this._fetch(index);","			return index;","		},","		/**","		 * Sugar method added because items might not be contiguous so","		 * subtracting one to the index does not always get you to the previous item.","		 * If there is no next element, `null` will be returned and the","		 * collection will still point to the first item.","		 * @method previous","		 * @return {integer} index of the previous item or `null` if none found","		 */","		previous: function () {","			if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {","				this._shelve();","			}","			var shelves = this._shelves,","				index = this._currentIndex - 1;","			while (index >= 0 && !shelves.hasOwnProperty(index)) {","				index -=1;","			}","			if (index === -1) {","				return null;","			}","			this._fetch(index);","			return index;","		}","","	};","	Y.GalleryModelPrimaryKeyIndex = PKI;","","","","}, '@VERSION@', {\"requires\": [\"base\"], \"skinnable\": false});"];
_yuitest_coverage["build/gallery-md-model/gallery-md-model.js"].lines = {"1":0,"3":0,"32":0,"49":0,"80":0,"81":0,"102":0,"117":0,"140":0,"143":0,"144":0,"145":0,"158":0,"159":0,"160":0,"161":0,"179":0,"180":0,"181":0,"182":0,"183":0,"185":0,"186":0,"188":0,"189":0,"190":0,"193":0,"196":0,"199":0,"200":0,"202":0,"205":0,"214":0,"222":0,"235":0,"236":0,"237":0,"244":0,"253":0,"254":0,"255":0,"256":0,"258":0,"259":0,"273":0,"276":0,"277":0,"279":0,"284":0,"294":0,"298":0,"299":0,"300":0,"301":0,"304":0,"312":0,"314":0,"315":0,"317":0,"328":0,"329":0,"343":0,"345":0,"346":0,"348":0,"349":0,"350":0,"353":0,"364":0,"365":0,"366":0,"367":0,"368":0,"369":0,"379":0,"406":0,"408":0,"409":0,"410":0,"411":0,"412":0,"414":0,"416":0,"417":0,"424":0,"425":0,"427":0,"428":0,"430":0,"432":0,"433":0,"437":0,"458":0,"459":0,"460":0,"462":0,"468":0,"472":0,"501":0,"503":0,"504":0,"505":0,"506":0,"507":0,"509":0,"511":0,"512":0,"513":0,"514":0,"517":0,"518":0,"524":0,"525":0,"527":0,"529":0,"530":0,"531":0,"532":0,"533":0,"534":0,"535":0,"536":0,"537":0,"540":0,"544":0,"552":0,"553":0,"554":0,"583":0,"626":0,"639":0,"641":0,"642":0,"644":0,"650":0,"651":0,"654":0,"672":0,"685":0,"686":0,"687":0,"688":0,"689":0,"690":0,"692":0,"705":0,"706":0,"707":0,"708":0,"709":0,"710":0,"712":0,"724":0,"725":0,"727":0,"728":0,"729":0,"743":0,"744":0,"745":0,"746":0,"747":0,"748":0,"750":0,"822":0,"824":0,"826":0,"827":0,"828":0,"830":0,"831":0,"841":0,"842":0,"851":0,"861":0,"862":0,"863":0,"864":0,"865":0,"868":0,"869":0,"870":0,"873":0,"875":0,"886":0,"888":0,"890":0,"891":0,"892":0,"894":0,"895":0,"905":0,"906":0,"915":0,"923":0,"924":0,"925":0,"926":0,"928":0,"931":0,"932":0,"934":0,"945":0,"948":0,"958":0,"959":0,"960":0,"974":0,"1001":0,"1002":0,"1004":0,"1006":0,"1007":0,"1009":0,"1020":0,"1021":0,"1023":0,"1025":0,"1028":0,"1029":0,"1031":0,"1032":0,"1045":0,"1054":0,"1055":0,"1056":0,"1057":0,"1069":0,"1070":0,"1071":0,"1072":0,"1074":0,"1076":0,"1077":0,"1079":0,"1080":0,"1082":0,"1083":0,"1084":0,"1085":0,"1086":0,"1102":0,"1103":0,"1104":0,"1105":0,"1106":0,"1107":0,"1108":0,"1111":0,"1129":0,"1130":0,"1131":0,"1132":0,"1133":0,"1134":0,"1135":0,"1136":0,"1140":0,"1151":0,"1152":0,"1170":0,"1172":0,"1173":0,"1174":0,"1176":0,"1177":0,"1184":0,"1185":0,"1186":0,"1188":0,"1190":0,"1200":0,"1201":0,"1202":0,"1204":0,"1212":0,"1213":0,"1214":0,"1215":0,"1227":0,"1228":0,"1229":0,"1230":0,"1231":0,"1233":0,"1243":0,"1257":0,"1258":0,"1260":0,"1273":0,"1287":0,"1288":0,"1290":0,"1303":0,"1309":0,"1337":0,"1345":0,"1351":0,"1369":0,"1370":0,"1372":0,"1373":0,"1374":0,"1385":0,"1390":0,"1393":0,"1394":0,"1397":0,"1409":0,"1410":0,"1411":0,"1412":0,"1413":0,"1425":0,"1432":0,"1434":0,"1435":0,"1436":0,"1437":0,"1452":0,"1459":0,"1460":0,"1461":0,"1463":0,"1464":0,"1466":0,"1467":0,"1469":0,"1473":0,"1489":0,"1490":0,"1491":0,"1493":0,"1496":0,"1497":0,"1498":0,"1499":0,"1500":0,"1501":0,"1502":0,"1521":0,"1524":0,"1525":0,"1527":0,"1528":0,"1529":0,"1530":0,"1532":0,"1533":0,"1535":0,"1538":0,"1551":0,"1562":0,"1567":0,"1577":0,"1578":0,"1588":0,"1589":0,"1590":0,"1592":0,"1593":0,"1595":0,"1596":0,"1597":0,"1598":0,"1612":0,"1616":0,"1617":0,"1619":0,"1620":0,"1622":0,"1623":0,"1630":0,"1631":0,"1632":0,"1634":0,"1646":0,"1647":0,"1649":0,"1652":0,"1653":0,"1655":0,"1656":0,"1658":0,"1659":0,"1670":0,"1671":0,"1673":0,"1675":0,"1676":0,"1678":0,"1679":0,"1681":0,"1682":0,"1686":0};
_yuitest_coverage["build/gallery-md-model/gallery-md-model.js"].functions = {"initializer:79":0,"_setInitialValues:157":0,"(anonymous 2):189":0,"finish:187":0,"destroy:178":0,"getValue:213":0,"getValues:221":0,"setValue:234":0,"(anonymous 3):258":0,"_defSetValue:252":0,"(anonymous 4):276":0,"setValues:272":0,"(anonymous 5):298":0,"getChangedValues:293":0,"(anonymous 6):314":0,"getPKValues:311":0,"getAsHTML:327":0,"(anonymous 7):348":0,"getAsURL:342":0,"_defDataLoaded:363":0,"_stoppedDataLoaded:378":0,"(anonymous 8):416":0,"load:405":0,"parse:457":0,"(anonymous 10):517":0,"(anonymous 9):511":0,"save:500":0,"reset:551":0,"sync:582":0,"validate:625":0,"(anonymous 11):641":0,"_validate:638":0,"toJSON:671":0,"_isModifiedGetter:684":0,"_isNewGetter:704":0,"_primaryKeysSetter:723":0,"_primaryKeysGetter:742":0,"initializer:825":0,"_trackChange:840":0,"_resetUndo:850":0,"(anonymous 12):868":0,"undo:860":0,"initializer:889":0,"_trackChange:904":0,"_resetUndo:914":0,"undo:922":0,"initializer:957":0,"_setInitialValues:973":0,"(anonymous 13):1006":0,"_shelve:1000":0,"(anonymous 14):1031":0,"_fetch:1019":0,"_addPreserve:1044":0,"_initNew:1053":0,"(anonymous 15):1071":0,"add:1068":0,"(anonymous 16):1104":0,"each:1101":0,"(anonymous 17):1131":0,"eachModified:1128":0,"saveAllModified:1150":0,"(anonymous 18):1176":0,"_defDataLoaded:1169":0,"(anonymous 19):1201":0,"size:1199":0,"empty:1211":0,"_indexSetter:1226":0,"_indexGetter:1242":0,"_isNewGetter:1256":0,"_isNewSetter:1272":0,"_isModifiedGetter:1286":0,"_isModifiedSetter:1302":0,"initializer:1368":0,"sortField:1389":0,"_compare:1393":0,"_setCompare:1384":0,"_sort:1408":0,"_afterChange:1424":0,"_findIndex:1451":0,"add:1488":0,"find:1520":0,"validator:1550":0,"validator:1561":0,"add:1587":0,"(anonymous 20):1622":0,"(anonymous 21):1630":0,"_defDataLoaded:1611":0,"next:1645":0,"previous:1669":0,"(anonymous 1):1":0};
_yuitest_coverage["build/gallery-md-model/gallery-md-model.js"].coveredLines = 395;
_yuitest_coverage["build/gallery-md-model/gallery-md-model.js"].coveredFunctions = 90;
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1);
YUI.add('gallery-md-model', function (Y, NAME) {

_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "(anonymous 1)", 1);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 3);
'use strict';
/*jslint white: true */
/**
Record-based data model with APIs for getting, setting, validating, and
syncing attribute values, as well as events for being notified of model changes.

@module gallery-md-model
**/

/**
Record-based data model with APIs for getting, setting, validating, and
syncing attribute values, as well as events for being notified of model changes.

In most cases, you'll want to create your own subclass of GalleryModel and
customize it to meet your needs. In particular, the sync() and validate()
methods are meant to be overridden by custom implementations. You may also want
to override the parse() method to parse non-generic server responses.

@class GalleryModel
@constructor
@param [cfg] {Object} Initial configuration attribute plus:
@param [cfg.values] {Object}  Sets initial values for the model.
	Model will be marked as new and not modified (as if just loaded).
	If GalleryModel is extended with any of the multi-record extensions,
	this will not work until <a href="http://yuilibrary.com/projects/yui3/ticket/2529898">this bug</a> is fixed:
	Use `new Y.GalleryModel().add(values)` instead.
@extends Base
**/

	_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 32);
var Lang = Y.Lang,
		YArray = Y.Array,
		YObject = Y.Object,
		EVT_CHANGE = 'change',
		EVT_LOADED = 'loaded',
		EVT_ERROR = 'error',
		EVT_SAVED = 'saved',
		EVT_RESET = 'reset',
		IS_MODIFIED = 'isModified',
		IS_NEW = 'isNew',
		DOT = '.',
		CHANGE = 'Change',
		ADD = 'add',
		UNDO = 'undo',
		NULL_FN = function (){};


	_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 49);
Y.GalleryModel = Y.Base.create(
		NAME,
		Y.Base,
		[],
		{
			/**
			 * Hash of values indexed by field name
			 * @property _values
			 * @type Object
			 * @private
			 */
			_values: null,
			/**
			 * Hash of values as loaded from the remote source,
			 * presumed to be the current value there.
			 * @property _loadedValues
			 * @type Object
			 * @private
			 */
			_loadedValues: null,
			/**
			 * Array of field names that make up the primary key for this record
			 * @property _primaryKeys
			 * @type Array
			 * @private
			 */
			_primaryKeys: null,
			/*
			 * Y.Base lifecycle method
			 */
			initializer: function  (cfg) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "initializer", 79);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 80);
this._values = {};
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 81);
this._loadedValues = {};
				/**
				 * Fired whenever a value or values are changed.
				 * If changed via {{#crossLink "GalleryModel/setValues"}}{{/crossLink}} the facade will not contain a __name__.
				 * Instead, __prevVals__ and __newVals__ (both plural) properties will contain
				 * hashes with the names and values of the fields changed.
				 * After firing the event for a group of fields changed via {{#crossLink "GalleryModel/setValues"}}{{/crossLink}},
				 * a new change event will be fired for each individual field changed.
				 * For individual field changes via {{#crossLink "GalleryModel/setValue"}}{{/crossLink}}, the __name__, __prevVal__ and __newVal__
				 * will be provided.
				 * The event can be prevented on a per group change basis or per individual field change.
				 * Preventing the change on a particular field will not prevent the others from being changed.
				 * @event change
				 * @param ev {EventFacade} containing:
				 * @param [ev.name] {String} Name of the field changed
				 * @param [ev.newVal] {Any} New value of the field.
				 * @param [ev.prevVal] {Any} Previous value of the field.
				 * @param [ev.newVals] {Object} Hash with the new values for the listed fields.
				 * @param [ev.prevVals] {Object} Hash with the previous values for the listed fields.
				 * @param ev.src {String|null} Source of the change event, if any.
				 */
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 102);
this.publish(EVT_CHANGE, {
					defaultFn: this._defSetValue
				});
				/**
				 * Fired when new data has been received from the remote source.
				 * It will also be fired even on a {{#crossLink "GalleryModel/save"}}{{/crossLink}} operation if the response contains values.
				 * The parsed values can be altered on the before (on) listener.
				 * @event loaded
				 * @param ev {EventFacade} containing:
				 * @param ev.response {Object} Response data as received from the remote source
				 * @param ev.parsed {Object} Data as returned from the parse method.
				 * @param ev.options {Object} Options as received by the {{#crossLink "GalleryModel/load"}}{{/crossLink}} method.
				 * @param ev.callback {Function} Function to call at the end of the load process
				 * @param ev.src {String} the source of the load, usually `'load'`
				 */
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 117);
this.publish(EVT_LOADED, {
					defaultFn:this._defDataLoaded,
					preventedFn: this._stoppedDataLoaded,
					stoppedFn: this._stoppedDataLoaded
				});
				/**
				 * Fired when the data has been saved to the remote source
				 * The event cannot be prevented.
				 * The developer has full control of what is
				 * about to be saved and when it is saved so it would be pointless
				 * to try to prevent it at this stage.  This is in contrast to
				 * the {{#crossLink "GalleryModel/loaded:event"}}{{/crossLink}} event where the developer has no control of what might
				 * come from the server and might wish to do something about it.
				 * If in reply to the save operation the server replies with data,
				 * the __response__ and __parsed__ properties will be filled.
				 * @event saved
				 * @param ev {EventFacade} containing:
				 * @param [ev.response] {Object} Response data as received from the remote source, if any.
				 * @param [ev.parsed] {Object} Data as returned from the parse method, if any.
				 * @param ev.options {Object} Options as received by the {{#crossLink "GalleryModel/save"}}{{/crossLink}} method.
				 * @param ev.callback {Function} Function to call at the end of the load process
				 * @param ev.src {String} the source of the save, usually `'save'`
				 */
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 140);
this.publish(EVT_SAVED, {
					preventable: false
				});
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 143);
cfg = cfg || {};
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 144);
if (Lang.isObject(cfg.values)) {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 145);
this.after('init',this._setInitialValues);
				}
			},
			/**
			 * Sets the initial values if any were provided to the constructor.
			 * It is only ever called after the initialization of this class and all its extensions
			 * and only if the arguments to the constructor had a `values` attribute
			 * @method _setInitialValues
			 * @param ev {EventFacade} in particular:
			 * @param ev.cfg.values {Object} values to be set
			 * @private
			 */
			_setInitialValues: function (ev) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_setInitialValues", 157);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 158);
this.setValues(ev.cfg.values, 'init');
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 159);
this._set(IS_MODIFIED, false);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 160);
this._set(IS_NEW, true);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 161);
this._loadedValues = Y.clone(this._values);
			},
			/**
			 * Destroys this model instance and removes it from its containing lists, if
			 * any.

			 * If __options.remove__ is true then this method also delegates to the
			 * {{#crossLink "GalleryModel/sync"}}{{/crossLink}} method to delete the model from the persistence layer.

			 * @method destroy
			 * @param [options] {Object} Options passed on to the {{#crossLink "GalleryModel/sync"}}{{/crossLink}} method, if required.
			 * @param [options.remove=false] {Boolean} if true, the data will also be erased from the server.
			 * @param [callback] {function} function to be called when the sync operation finishes.
			 *		@param callback.err {string|null} Error message, if any or null.
			 *		@param callback.response {Any} The server response as received by {{#crossLink "GalleryModel/sync"}}{{/crossLink}}.
			 * @chainable
			 */
			destroy: function (options, callback) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "destroy", 178);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 179);
if (Lang.isFunction(options)) {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 180);
callback = options;
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 181);
options = {};
				} else {_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 182);
if (!options) {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 183);
options = {};
				}}
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 185);
callback = callback || NULL_FN;
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 186);
var self = this,
					finish = function (err) {
						_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "finish", 187);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 188);
if (!err) {
							_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 189);
YArray.each(self.lists.concat(), function (list) {
								_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "(anonymous 2)", 189);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 190);
list.remove(self, options);
							});

							_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 193);
Y.GalleryModel.superclass.destroy.call(self);
						}

						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 196);
callback.apply(self, arguments);
					};

				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 199);
if (options.remove) {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 200);
this.sync('delete', options, finish);
				} else {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 202);
finish();
				}

				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 205);
return this;
			},
			/**
			 * Returns the value of the field named
			 * @method getValue
			 * @param name {string}  Name of the field to return.
			 * @return {Any} the value of the field requested.
			 */
			getValue: function (name) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "getValue", 213);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 214);
return this._values[name];
			},
			/**
			 * Returns a hash with all values using the field names as keys.
			 * @method getValues
			 * @return {Object} a hash with all the fields with the field names as keys.
			 */
			getValues: function() {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "getValues", 221);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 222);
return Y.clone(this._values);
			},
			/**
			 * Sets the value of the named field.
			 * Fires the {{#crossLink "GalleryModel/change:event"}}{{/crossLink}} event if the new value is different from the current one.
			 * Primary key fields cannot be changed unless still `undefined`.
			 * @method setValue
			 * @param name {string} Name of the field to be set
			 * @param value {Any} Value to be assigned to the field
			 * @param [src] {Any} Source of the change in the value.
			 * @chainable
			 */
			setValue: function (name, value, src) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "setValue", 234);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 235);
var prevVal = this._values[name];
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 236);
if (prevVal !== value && (this._primaryKeys.indexOf(name) === -1 || Lang.isUndefined(prevVal))) {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 237);
this.fire(EVT_CHANGE, {
						name:name,
						newVal:value,
						prevVal:prevVal,
						src: src
					});
				}
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 244);
return this;
			},
			/**
			 * Default function for the change event, sets the value and marks the model as modified.
			 * @method _defSetValue
			 * @param ev {EventFacade} (see {{#crossLink "GalleryModel/change:event"}}{{/crossLink}} event)
			 * @private
			 */
			_defSetValue: function (ev) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_defSetValue", 252);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 253);
var self = this;
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 254);
if (ev.name) {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 255);
self._values[ev.name] = ev.newVal;
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 256);
self._set(IS_MODIFIED, true);
				} else {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 258);
YObject.each(ev.newVals, function (value, name) {
						_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "(anonymous 3)", 258);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 259);
self.setValue(name, value, ev.src);
					});
				}
			},
			/**
			 * Sets a series of values.
			 * It simply loops over the hash of values provided calling {{#crossLink "GalleryModel/setValue"}}{{/crossLink}} on each.
			 * Fires the {{#crossLink "GalleryModel/change:event"}}{{/crossLink}} event.
			 * @method setValues
			 * @param values {Object} hash of values to change
			 * @param [src] {Any} Source of the changes
			 * @chainable
			 */
			setValues: function (values, src) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "setValues", 272);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 273);
var self = this,
					prevVals = {};

				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 276);
YObject.each(values, function (value, name) {
					_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "(anonymous 4)", 276);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 277);
prevVals[name] = self.getValue(name);
				});
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 279);
this.fire(EVT_CHANGE, {
					newVals:values,
					prevVals:prevVals,
					src: src
				});
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 284);
return self;
			},
			/**
			 * Returns a hash indexed by field name, of all the values in the model that have changed since the last time
			 * they were synchornized with the remote source.   Each entry has a __prevVal__ and __newVal__ entry.
			 * @method getChangedValues
			 * @return {Object} Hash of all entries changed since last synched.
			 * Each entry has a __newVal__ and __prevVal__ property contaning original and changed values.
			 */
			getChangedValues: function() {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "getChangedValues", 293);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 294);
var changed = {},
					prev,
					loaded = this._loadedValues;

				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 298);
YObject.each(this._values, function (value, name) {
					_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "(anonymous 5)", 298);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 299);
prev = loaded[name];
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 300);
if (prev !== value) {
						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 301);
changed[name] = {prevVal:prev, newVal: value};
					}
				});
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 304);
return changed;
			},
			/**
			 * Returns a hash with the values of the primary key fields, indexed by their field names
			 * @method getPKValues
			 * @return {Object} Hash with the primary key values, indexed by their field names
			 */
			getPKValues: function () {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "getPKValues", 311);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 312);
var pkValues = {},
					self = this;
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 314);
YArray.each(self._primaryKeys, function (name) {
					_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "(anonymous 6)", 314);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 315);
pkValues[name] = self._values[name];
				});
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 317);
return pkValues;
			},
			/**
				Returns an HTML-escaped version of the value of the specified string
				attribute. The value is escaped using Y.Escape.html().

				@method getAsHTML
				@param {String} name Attribute name or object property path.
				@return {String} HTML-escaped attribute value.
			**/
			getAsHTML: function (name) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "getAsHTML", 327);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 328);
var value = this.getValue(name);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 329);
return Y.Escape.html(Lang.isValue(value) ? String(value) : '');
			},

			/**
			 * Returns a URL-encoded version of the value of the specified field,
			 * or a full URL with `name=value` sets for all fields if no name is given.
			 * The names and values are encoded using the native `encodeURIComponent()`
			 * function.

			 * @method getAsURL
			 * @param [name] {String}  Field name.
			 * @return {String} URL-encoded field value if name is given or URL encoded set of `name=value` pairs for all fields.
			 */
			getAsURL: function (name) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "getAsURL", 342);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 343);
var value = this.getValue(name),
					url = [];
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 345);
if (name) {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 346);
return encodeURIComponent(Lang.isValue(value) ? String(value) : '');
				}
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 348);
YObject.each(value, function (value, name) {
					_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "(anonymous 7)", 348);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 349);
if (Lang.isValue(value)) {
						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 350);
url.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
					}
				});
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 353);
return url.join('&');
			},

			/**
			 * Default function for the {{#crossLink "GalleryModel/loaded:event"}}{{/crossLink}} event.
			 * Does the actual setting of the values just loaded and calls the callback function.
			 * @method _defDataLoaded
			 * @param ev {EventFacade} see loaded event
			 * @private
			 */
			_defDataLoaded: function (ev) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_defDataLoaded", 363);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 364);
var self = this;
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 365);
self.setValues(ev.parsed, ev.src);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 366);
self._set(IS_MODIFIED, false);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 367);
self._set(IS_NEW, false);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 368);
self._loadedValues = Y.clone(self._values);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 369);
ev.callback.call(self,null, ev.response);
			},
			/**
			 * Function called when the {{#crossLink "GalleryModel/loaded:event"}}{{/crossLink}} event is prevented, stopped or halted
			 * so that the callback is called with a suitable error
			 * @method _stoppedDataLoaded
			 * @param ev {EventFacade}
			 * @private
			 */
			_stoppedDataLoaded: function (ev) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_stoppedDataLoaded", 378);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 379);
ev.details[0].callback.call(this, 'Load event halted');
			},
			/**
				Loads this model from the server.

				This method delegates to the {{#crossLink "GalleryModel/sync"}}{{/crossLink}} method to perform the actual load
				operation, which is an asynchronous action. Specify a __callback__ function to
				be notified of success or failure.

				A successful load operation will fire a {{#crossLink "GalleryModel/loaded:event"}}{{/crossLink}} event, while an unsuccessful
				load operation will fire an {{#crossLink "GalleryModel/error:event"}}{{/crossLink}} event with the `src` set to `"load"`.

				@method load
				@param [options] {Object} Options to be passed to {{#crossLink "GalleryModel/sync"}}{{/crossLink}}.
					Usually these will be or will include the keys used by the remote source
					to locate the data to be loaded.
					They will be passed on unmodified to the {{#crossLink "GalleryModel/sync"}}{{/crossLink}} method.
					It is up to {{#crossLink "GalleryModel/sync"}}{{/crossLink}} to determine what they mean.
				@param [callback] {callback} <span class="flag deprecated">deprecated</span>
					Use `this.load(options).after('loaded', callback)` instead.

					Called when the sync operation finishes. Callback will receive:
					@param callback.err {string|null} Error message, if any or null.
					@param callback.response {Any} The server response as received by sync(),
				@chainable
			**/
			load: function (options, callback) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "load", 405);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 406);
var self = this;

				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 408);
if (Lang.isFunction(options)) {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 409);
callback = options;
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 410);
options = {};
				} else {_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 411);
if (!options) {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 412);
options = {};
				}}
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 414);
callback = callback || NULL_FN;

				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 416);
self.sync('read', options, function (err, response) {
					_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "(anonymous 8)", 416);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 417);
var facade = {
							options : options,
							response: response,
							src: 'load',
							callback: callback
						};

					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 424);
if (err) {
						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 425);
facade.error = err;

						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 427);
self.fire(EVT_ERROR, facade);
						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 428);
callback.apply(self, arguments);
					} else {
						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 430);
self._values = {};

						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 432);
facade.parsed = self.parse(response);
						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 433);
self.fire(EVT_LOADED, facade);
					}
				});

				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 437);
return self;
			},

			/**
				Called to parse the __response__ when a response is received from the server.
				This method receives a server __response__ and is expected to return a
				value hash.

				The default implementation assumes that __response__ is either an attribute
				hash or a JSON string that can be parsed into an attribute hash. If
				__response__ is a JSON string and either Y.JSON or the native JSON object
				are available, it will be parsed automatically. If a parse error occurs, an
				error event will be fired and the model will not be updated.

				You may override this method to implement custom parsing logic if necessary.

				@method parse
				@param {Any} response Server response.
				@return {Object} Values hash.
			**/
			parse: function (response) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "parse", 457);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 458);
if (typeof response === 'string') {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 459);
try {
						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 460);
return Y.JSON.parse(response);
					} catch (ex) {
						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 462);
this.fire(EVT_ERROR, {
							error : ex,
							response: response,
							src : 'parse'
						});

						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 468);
return null;
					}
				}

				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 472);
return response;
			},



			/**
				Saves this model to the server.

				This method delegates to the {{#crossLink "GalleryModel/sync"}}{{/crossLink}} method to perform the actual save
				operation, which is an asynchronous action. Specify a __callback__ function to
				be notified of success or failure.

				A successful save operation will fire a {{#crossLink "GalleryModel/saved:event"}}{{/crossLink}} event, while an unsuccessful
				load operation will fire an {{#crossLink "GalleryModel/error:event"}}{{/crossLink}} event with the 'src' property set to `"save"`.

				If the save operation succeeds and the {{#crossLink "GalleryModel/parse"}}{{/crossLink}} method returns non-empty values
				from the response received from the server a {{#crossLink "GalleryModel/loaded:event"}}{{/crossLink}}
                event will also be fired to read those values.

				@method save
				@param {Object} [options] Options to be passed to {{#crossLink "GalleryModel/sync"}}{{/crossLink}}.
					It's up to the custom sync implementation
					to determine what options it supports or requires, if any.
				@param {Function} [callback] Called when the sync operation finishes.
					@param callback.err {string|null} Error message, if any or null.
					@param callback.response {Any} The server response as received by {{#crossLink "GalleryModel/sync"}}{{/crossLink}},
				@chainable
			**/
			save: function (options, callback) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "save", 500);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 501);
var self = this;

				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 503);
if (Lang.isFunction(options)) {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 504);
callback = options;
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 505);
options = {};
				} else {_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 506);
if (!options) {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 507);
options = {};
				}}
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 509);
callback = callback || NULL_FN;

				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 511);
self._validate(self.getValues(), function (err) {
					_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "(anonymous 9)", 511);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 512);
if (err) {
						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 513);
callback.call(self, err);
						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 514);
return;
					}

					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 517);
self.sync(self.get(IS_NEW) ? 'create' : 'update', options, function (err, response) {
						_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "(anonymous 10)", 517);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 518);
var facade = {
								options : options,
								response: response,
								src: 'save'
							};

						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 524);
if (err) {
							_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 525);
facade.error = err;

							_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 527);
self.fire(EVT_ERROR, facade);
						} else {
							_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 529);
facade.parsed = self.parse(response);
							_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 530);
facade.callback = callback;
							_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 531);
self._set(IS_MODIFIED, false);
							_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 532);
self._set(IS_NEW, false);
							_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 533);
self._loadedValues = Y.clone(self._values);
							_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 534);
self.fire(EVT_SAVED, facade);
							_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 535);
if (facade.parsed) {
								_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 536);
self.fire(EVT_LOADED, facade);
								_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 537);
return self; // the loaded event will take care of calling the callback
							}
						}
						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 540);
callback.apply(self, arguments);
					});
				});

				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 544);
return self;
			},
			/**
			 * Restores the values when last loaded, saved or created.
			 * @method reset
			 * @chainable
			 */
			reset: function() {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "reset", 551);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 552);
this._values = Y.clone(this._loadedValues);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 553);
this.fire(EVT_RESET);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 554);
return this;
			},
			/**
				Override this method to provide a custom persistence implementation for this
				model. The default just calls the callback without actually doing anything.

				This method is called internally by {{#crossLink "GalleryModel/load"}}{{/crossLink}},
				{{#crossLink "GalleryModel/save"}}{{/crossLink}},
				and {{#crossLink "GalleryModel/destroy"}}{{/crossLink}} (when `options.remove==true).

				@method sync
				@param {String} action Sync action to perform. May be one of the following:

					* create: Store a newly-created model for the first time.
					* read  : Load an existing model.
					* update: Update an existing model.
					* delete: Delete an existing model.

				@param {Object} [options] Sync options. It's up to the custom sync
					implementation to determine what options it supports or requires, if any.
				@param {Function} [callback] Called when the sync operation finishes.
					@param {Error|null} callback.err If an error occurred, this parameter will
						contain the error. If the sync operation succeeded, __err__ will be
						falsy.
					@param {Any} [callback.response] The server's response. This value will
						be passed to the {{#crossLink "GalleryModel/parse"}}{{/crossLink}} method, which is expected to parse it and
						return an attribute hash.
			**/
			sync: function (action, options, callback) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "sync", 582);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 583);
(callback || NULL_FN).call(this);
			},
			/**
				Override this method to provide custom validation logic for this model.

				This method gives you a hook to validate a hash of all
				attributes before the model is saved. This method is called automatically
				before {{#crossLink "GalleryModel/save"}}{{/crossLink}} takes any action.
				If validation fails, the {{#crossLink "GalleryModel/save"}}{{/crossLink}} call
				will be aborted.

				In your validation method, call the provided callback function with no
				arguments to indicate success. To indicate failure, pass a single argument,
				which may contain an error message, an array of error messages, or any other
				value. This value will be passed along to the error event.

				@example

					model.validate = function (attrs, callback) {
						if (attrs.pie !== true) {
							// No pie?! Invalid!
							callback('Must provide pie.');
							return;
						}

						// Success!
						callback();
					};

				@method validate
				@param {Object} attrs Hash containing all model attributes to
				be validated.
				@param {Function} callback Validation callback. Call this function when your
				validation logic finishes. To trigger a validation failure, pass any
				value as the first argument to the callback (ideally a meaningful
				validation error of some kind).

				@param {Any} [callback.err] Validation error. Don't provide this
				argument if validation succeeds. If validation fails, set this to an
				error message or some other meaningful value. It will be passed
				along to the resulting error event.
			**/
			validate: function (attrs, callback) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "validate", 625);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 626);
(callback || NULL_FN).call(this);
			},
			/**
				Calls the public, overridable validate() method and fires an error event
				if validation fails.

				@method _validate
				@param {Object} attributes Attribute hash.
				@param {Function} callback Validation callback.
				@param {Any} [callback.err] Value on failure, non-value on success.
				@protected
			**/
			_validate: function (attributes, callback) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_validate", 638);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 639);
var self = this;

				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 641);
self.validate(attributes, function (err) {
					_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "(anonymous 11)", 641);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 642);
if (Lang.isValue(err)) {
						// Validation failed. Fire an error.
						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 644);
self.fire(EVT_ERROR, {
							attributes: attributes,
							error : err,
							src : 'validate'
						});

						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 650);
callback.call(self, err);
						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 651);
return;
					}

					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 654);
callback.call(self);
				});

			},
			/**
			 * The default implementation calls {{#crossLink "GalleryModel/getValues"}}{{/crossLink}}
			 * so that it returns a copy of the record.
			 * The developer may redefine this method to serialize this object
			 * in any way that might be needed.
			 * For example, it might be desirable to call
			 * {{#crossLink "GalleryModel/getChangedValues"}}{{/crossLink}}
			 * to return only changed fields, along with
			 * {{#crossLink "GalleryModel/getPKValues"}}{{/crossLink}}
			 * to identify the record with the changes.
			 * @method toJSON
			 * @return {Object} Copy of this model field values.
			 */
			toJSON: function () {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "toJSON", 671);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 672);
return this.getValues();
			},
			/**
			 * Getter for the {{#crossLink "GalleryModel/isModified:attribute"}}{{/crossLink}} attribute.
			 * If the value contains a dot (`'.'`) the modified state of the field named as a sub-attribute will be returned.
			 * Otherwise, the modified status of the whole record will be returned.
			 * @method _isModifiedGetter
			 * @param value {Any} Value stored for the attribute.
			 * @value name {String} Name of the attribute/sub-attribute being modified
			 * @return {Boolean} State of the record/field
			 * @protected
			 */
			_isModifiedGetter: function (value, name) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_isModifiedGetter", 684);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 685);
name = name.split(DOT);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 686);
if (name.length > 1) {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 687);
name = name[1];
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 688);
var ret = {};
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 689);
ret[name] = this._values[name] !== this._loadedValues[name];
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 690);
return ret;
				}
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 692);
return value;
			},
			/**
			 * Getter for the {{#crossLink "GalleryModel/isNew:attribute"}}{{/crossLink}} attribute.
			 * If the value contains a dot (`'.'`) the 'new' state of the field named as a sub-attribute will be returned.
			 * Otherwise, the 'new' status of the whole record will be returned.
			 * @method _isNewGetter
			 * @param value {Any} Value stored for the attribute.
			 * @value name {String} Name of the attribute/sub-attribute being modified
			 * @return {Boolean} State of the record/field
			 * @protected
			 */
			_isNewGetter: function (value, name) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_isNewGetter", 704);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 705);
name = name.split(DOT);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 706);
if (name.length > 1) {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 707);
name = name[1];
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 708);
var ret = {};
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 709);
ret[name] = !this._loadedValues.hasOwnProperty(name);
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 710);
return ret;
				}
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 712);
return value;
			},
			/**
			 * Setter for the {{#crossLink "GalleryModel/primaryKeys:attribute"}}{{/crossLink}} attribute.
			 * If the value is already set, no further changes will be allowed.
			 * If the value is not an array, it will be converted to one.
			 * @method _primaryKeysSetter
			 * @param value {Any} Value stored for the attribute.
			 * @return {Array} Primary keys
			 * @protected
			 */
			_primaryKeysSetter: function (value) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_primaryKeysSetter", 723);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 724);
if (this._primaryKeys && this._primaryKeys.length) {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 725);
return Y.Attribute.INVALID_VALUE;
				}
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 727);
value = new YArray(value);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 728);
this._primaryKeys = value;
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 729);
return value;
			},
			/**
			 * Getter for the {{#crossLink "GalleryModel/primaryKeys:attribute"}}{{/crossLink}} attribute.
			 * If the name contains a dot (`'.'`) it will return a boolean indicating
			 * whether the field named as a sub-attribute is part of the primary key.
			 * Otherwise, it returns the array of primary key fields.
			 * @method  _primaryKeysGetter
			 * @param value {Array} Names of the primary key fields
			 * @param name {String} Name of the attribute/sub-attribute requested.
			 * @return {Array|Boolean} Array of the primary key field names or Boolean indicating if the asked for field is part of it.
			 * @private
			 */
			_primaryKeysGetter: function (value, name) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_primaryKeysGetter", 742);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 743);
name = name.split(DOT);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 744);
if (name.length > 1) {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 745);
name = name[1];
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 746);
var ret = {};
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 747);
ret[name] = value.indexOf(name) !== -1;
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 748);
return ret;
				}
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 750);
return (value || []).concat();  // makes sure to return a copy, not the original.
			}
		},
		{
			ATTRS: {
				/**
				 * Indicates whether any of the fields has been changed since created or loaded.
				 * Field names can be given as sub-attributes to indicate if any particular field has beeen changed.
				 * `model.get('isModified.name')` returns `true` if the field `name` has been modified.
				 * <b>Note:</b> contrary to common practice in Attributes with sub-attributes,
				 * requesting the state of the record does not
				 * return an object with the state of each individual field keyed by field name,
				 * but the state of the record as a whole, which is far more useful.
				 * @attribute isModified
				 * @type Boolean
				 * @readonly
				 * @default false
				 */
				isModified: {
					readOnly: true,
					value:false,
					validator:Lang.isBoolean,
					getter: '_isModifiedGetter'
				},
				/**
				 * Indicates that the model is new and has not been modified since creation.
				 * Field names can be given as sub-attributes to indicate if any particular field is new.
				 * `model.get('isNew.name')` returns `true` if the field `name` is new.
				 * <b>Note:</b> contrary to common practice in Attributes with sub-attributes,
				 * requesting the state of the record does not
				 * return an object with the state of each individual field keyed by field name,
				 * but the state of the record as a whole, which is far more useful.
				 * @attribute isNew
				 * @type Boolean
				 * @readonly
				 * @default true
				 */
				isNew: {
					readOnly: true,
					value:true,
					validator:Lang.isBoolean,
					getter: '_isNewGetter'
				},
				/**
				 * List of fields making the primary key of this model.
				 * Primary Key fields cannot be modified once initially loaded.
				 * It can be set as an array of field names or, if the key is made of a single field, a string with the name of that field.
				 * It will always be returned as an array.
				 * Field names can be given as a sub-attribute to ask whether a particular field is a primary key, thus:
				 * `model.get('primaryKeys.name')` returns `true` if the field `name` is a primary key.
				 * It can only be set once.
				 * @attribute primaryKeys
				 * @writeonce
				 * @type array
				 * @default []
				 */
				primaryKeys: {
					setter:'_primaryKeysSetter',
					getter:'_primaryKeysGetter',
					lazyAdd: false,
					value: []
				}
			}

		}
	);

	/**
	 * An extension for GalleryModel that provides a single level of undo for each field.
	 * It will never undo a field to `undefined` since it assumes an undefined field had not been set.
	 * @class GalleryModelSimpleUndo
	 */
	_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 822);
Y.GalleryModelSimpleUndo = function () {};

	_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 824);
Y.GalleryModelSimpleUndo.prototype = {
		initializer: function () {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "initializer", 825);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 826);
this._lastChange = {};
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 827);
if (this._addPreserve) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 828);
this._addPreserve('_lastChange');
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 830);
this.after(EVT_CHANGE, this._trackChange);
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 831);
this.on([EVT_LOADED, EVT_SAVED, EVT_RESET], this._resetUndo);
		},
		/**
		 * Event listener for the after value change event, it tracks changes for each field.
		 * It retains only the last change for each field.
		 * @method _trackChange
		 * @param ev {EventFacade} As provided by the {{#crossLink "GalleryModel/change:event"}}{{/crossLink}} event
		 * @private
		 */
		_trackChange: function (ev) {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_trackChange", 840);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 841);
if (ev.name && ev.src !== UNDO) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 842);
this._lastChange[ev.name] = ev.prevVal;
			}
		},
		/**
		 * After load or save operations, it drops any changes it might have tracked.
		 * @method _resetUndo
		 * @private
		 */
		_resetUndo: function () {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_resetUndo", 850);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 851);
this._lastChange = {};
		},
		/**
		 * Reverts one level of change for a specific field or all fields
		 * @method undo
		 * @param [name] {String} If provided it will undo that particular field,
		 *	otherwise, it undoes the whole record.
		 * @chainable
		 */
		undo: function (name) {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "undo", 860);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 861);
var self = this;
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 862);
if (name) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 863);
if (self._lastChange[name] !== undefined) {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 864);
self.setValue(name, self._lastChange[name], UNDO);
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 865);
delete self._lastChange[name];
				}
			} else {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 868);
YObject.each(self._lastChange, function (value, name) {
					_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "(anonymous 12)", 868);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 869);
if (value !== undefined) {
						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 870);
self.setValue(name, value, UNDO);
					}
				});
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 873);
self._lastChange = {};
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 875);
return self;
		}
	};

	/**
	 * Provides multiple levels of undo in strict chronological order
	 * whatever the field was at each stage.
	 * Changes done on multiple fields via setValues
	 * will also be undone in one step.
	 * @class GalleryModelChronologicalUndo
	 */
	_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 886);
Y.GalleryModelChronologicalUndo = function () {};

	_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 888);
Y.GalleryModelChronologicalUndo.prototype = {
		initializer: function () {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "initializer", 889);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 890);
this._changes = [];
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 891);
if (this._addPreserve) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 892);
this._addPreserve('_changes');
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 894);
this.after(EVT_CHANGE, this._trackChange);
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 895);
this.on([EVT_LOADED,EVT_SAVED,EVT_RESET], this._resetUndo);
		},
		/**
		 * Event listener for the after value change event, it tracks changes for each field.
		 * It keeps a stack of each change.
		 * @method _trackChange
		 * @param ev {EventFacade} As provided by the {{#crossLink "GalleryModel/change:event"}}{{/crossLink}} event
		 * @private
		 */
		_trackChange: function (ev) {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_trackChange", 904);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 905);
if (ev.src !== UNDO) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 906);
this._changes.push(ev.details);
			}
		},
		/**
		 * After load or save operations, it drops any changes it might have tracked.
		 * @method _resetUndo
		 * @private
		 */
		_resetUndo: function () {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_resetUndo", 914);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 915);
this._changes = [];
		},
		/**
		 * Reverts one level of field changes.
		 * @method undo
		 * @chainable
		 */
		undo: function () {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "undo", 922);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 923);
var ev = this._changes.pop();
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 924);
if (ev) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 925);
if (ev.name) {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 926);
this.setValue(ev.name, ev.prevVal, UNDO);
				} else {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 928);
this.setValues(ev.prevVals, UNDO);
				}
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 931);
if (this._changes.length === 0) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 932);
this._set(IS_MODIFIED, false);
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 934);
return this;
		}
	};

	/**
	 * Allows GalleryModel to handle a set of records using the Flyweight pattern.
	 * It exposes one record at a time from a shelf of records.
	 * Exposed records can be selected by setting the {{#crossLink "GalleryModel/index:attribute"}}{{/crossLink}} attribute.
	 * @class GalleryModelMultiRecord
	 */

	_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 945);
var INDEX = 'index',
		MR = function () {};

	_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 948);
MR.prototype = {
		/**
		 * Added this property to have `ModelSync.REST getURL()` return the proper URL.
		 * @property _isYUIModelList
		 * @type Boolean
		 * @value true
		 * @private
		 */
		_isYUIModelList: true,
		initializer: function () {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "initializer", 957);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 958);
this._shelves = [];
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 959);
this._currentIndex = 0;
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 960);
this._addPreserve('_values','_loadedValues','_isNew','_isModified');
		},
		/**
		 * Sets the initial values if any were provided to the constructor.
		 * It is only ever called after the initialization of this class and all its extensions
		 * and only if the arguments to the constructor had a `values` attribute.
		 * It overrides the {{#crossLink "GalleryModel/_setInitialValues"}}{{/crossLink}}
		 * so as to handle arrays.
		 * @method _setInitialValues
		 * @param ev {EventFacade} in particular:
		 * @param ev.cfg.values {Object} values to be set
		 * @private
		 */
		_setInitialValues: function (ev) {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_setInitialValues", 973);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 974);
this.add(ev.cfg.values);
		},

		/**
		 * Index of the shelf for the record being exposed.
		 * Use {{#crossLink "GalleryModel/index:attribute"}}{{/crossLink}} attribute to check/set the index value.
		 * @property _currentIndex
		 * @type integer
		 * @default 0
		 * @private
		 */
		_currentIndex: 0,
		/**
		 * Storage for the records when not exposed.
		 * @property _shelves
		 * @type Array
		 * @private
		 */
		_shelves: null,
		/**
		 * Saves the exposed record into the shelves at the position specified or given by
         * {{#crossLink "GalleryModelMultiRecord/_currentIndex"}}{{/crossLink}}
		 * @method _shelve
		 * @param [index=this._currentIndex] {Integer} Position to shelve it in
		 * @private
		 */
		_shelve: function(index) {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_shelve", 1000);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1001);
if (index === undefined) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1002);
index = this._currentIndex;
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1004);
var self = this,
				current = {};
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1006);
YArray.each(self._preserve, function (name) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "(anonymous 13)", 1006);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1007);
current[name] = self[name];
			});
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1009);
self._shelves[index] = current;

		},
		/**
		 * Retrives and exposes the record from the shelf at the position specified or given by
         * {{#crossLink "GalleryModelMultiRecord/_currentIndex"}}{{/crossLink}}
		 * @method _fetch
		 * @param [index=this._currentIndex] {Integer} Position to fetch it from.
		 * @private
		 */
		_fetch: function (index) {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_fetch", 1019);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1020);
if (index === undefined) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1021);
index = this._currentIndex;
			} else {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1023);
this._currentIndex = index;
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1025);
var self = this,
				current = self._shelves[index];

			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1028);
if (Lang.isUndefined(current)) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1029);
this._initNew();
			} else {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1031);
YArray.each(self._preserve, function (name) {
					_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "(anonymous 14)", 1031);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1032);
self[name] = current[name];
				});
			}

		},
		/**
		 * Adds the names of properties that are to be preserved in the shelf when moving,
		 * and taken out of the shelf when fetching.
		 * @method _addPreserve
		 * @param name* {String} any number of names or array of names of properties to be preserved.
		 * @protected
		 */
		_addPreserve: function () {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_addPreserve", 1044);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1045);
this._preserve = (this._preserve || []).concat(Array.prototype.slice.call(arguments));
		},

		/**
		 * Initializes an exposed record
		 * @method _initNew
		 * @private
		 */
		_initNew: function () {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_initNew", 1053);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1054);
this._values = {};
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1055);
this._loadedValues = {};
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1056);
this._isNew = true;
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1057);
this._isModified = false;
		},
		/**
		 * Adds a new record at the index position given or at the end.
		 * The new record becomes the current.
		 * @method add
		 * @param values {Object|Array} set of values to set.
		 * If it is an array, it will call itself for each of the items in it.
		 * @param [index] {Integer} position to add the values at or at the end if not provided.
		 * @chainable
		 */
		add: function(values, index) {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "add", 1068);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1069);
var self = this;
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1070);
if (Lang.isArray(values)) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1071);
YArray.each(values, function (value, i) {
					_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "(anonymous 15)", 1071);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1072);
self.add(value, (index?index + i:undefined));
				});
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1074);
return self;
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1076);
if (self.get(IS_MODIFIED) || !self.get(IS_NEW)) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1077);
self._shelve();
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1079);
if (index === undefined) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1080);
index = self._shelves.length;
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1082);
self._shelves.splice(index, 0, {});
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1083);
self._currentIndex = index;
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1084);
self._initNew();
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1085);
self.setValues(values, ADD);
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1086);
return self;
		},
		/**
		 * Executes the given function for each record in the set.
		 * The function will run in the scope of the model so it can use
		 * `this.{{#crossLink "GalleryModel/getValue"}}{{/crossLink}}()`
		 * or any such method to access the values of the current record.
		 * Returning exactly `false` from the function spares shelving the record.
		 * If the callback function does not modify the record,
		 * returning `false` will improve performance.
		 * @method each
		 * @param fn {function} function to execute, it will be provided with:
		 * @param fn.index {integer} index of the record exposed
		 * @chainable
		 */
		each: function(fn) {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "each", 1101);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1102);
var self = this;
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1103);
self._shelve();
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1104);
YArray.each(self._shelves, function (shelf, index) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "(anonymous 16)", 1104);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1105);
self._currentIndex = index;
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1106);
self._fetch(index);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1107);
if (fn.call(self, index) !== false) {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1108);
self._shelve(index);
				}
			});
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1111);
return self;
		},
		/**
		 * Executes the given function for each record in the set.
		 * The function will run in the scope of the model so it can use
		 * `this.{{#crossLink "GalleryModel/getValue"}}{{/crossLink}}`
		 * or any such method to access the values of the current record.
		 * It is faster than using {{#crossLink "GalleryModelMultiRecord/each"}}{{/crossLink}}
		 * and then checking the {{#crossLink "GalleryModel/isModified:attribute"}}{{/crossLink}} attribute
		 * Returning exactly `false` from the function spares shelving the record.
		 * If the callback function does not modify the record,
		 * returning `false` will improve performance.
		 * @method eachModified
		 * @param fn {function} function to execute, it will be provided with:
		 * @param fn.index {integer} index of the record exposed
		 * @chainable
		 */
		eachModified:function(fn) {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "eachModified", 1128);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1129);
var self = this;
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1130);
self._shelve();
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1131);
YArray.each(self._shelves,  function (shelf, index) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "(anonymous 17)", 1131);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1132);
if (self._shelves[index][IS_MODIFIED]) {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1133);
self._currentIndex = index;
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1134);
self._fetch(index);
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1135);
if (fn.call(self, index) !== false) {
						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1136);
self._shelve(index);
					}
				}
			});
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1140);
return self;
		},
		/**
		 * Calls {{#crossLink "GalleryModel/save"}}{{/crossLink}} on each record modified.
		 * This is not the best saving strategy for saving batches of records,
		 * but it is the easiest and safest.  Implementors are encouraged to
		 * design their own.
		 * @method saveAllModified
		 * @chainable
		 */
		saveAllModified: function () {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "saveAllModified", 1150);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1151);
this.eachModified(this.save);
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1152);
return this;
		},
		/**
		 * This is a documentation entry only, this method does not define `load`.
		 * This extension redefines the default action for the {{#crossLink "GalleryModel/loaded:event"}}{{/crossLink}} event so
		 * that if a load returns an array of records, they will be added to the shelves.
		 * Existing records are kept, call {{#crossLink "GalleryModelMultiRecord/empty"}}{{/crossLink}} if they should be discarded.
		 * See method {{#crossLink "GalleryModel/load"}}{{/crossLink}} of {{#crossLink "GalleryModel"}}{{/crossLink}} for further info.
		 * @method load
		 */
		/**
		 * Default action for the loaded event, checks if the parsed response is an array
		 * and saves it into the shelves, otherwise it calls the default loader for single records.
		 * @method _defDataLoaded
		 * @param ev {EventFacade} facade produced by load.
		 * @private
		 */
		_defDataLoaded: function (ev) {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_defDataLoaded", 1169);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1170);
var self = this,
				shelves = self._shelves;
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1172);
if (Lang.isArray(ev.parsed)) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1173);
if (shelves.length && (self.get(IS_MODIFIED) || !self.get(IS_NEW))) {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1174);
self._shelve();
				}
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1176);
YArray.each(ev.parsed, function (values) {
					_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "(anonymous 18)", 1176);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1177);
shelves.push({
						_values: values,
						_loadedValues: Y.clone(values),
						isNew: false,
						isModified:false
					});
				});
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1184);
self._fetch();
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1185);
if (self._sort) {
					_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1186);
self._sort();
				}
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1188);
ev.callback.call(self,null, ev.response);
			} else {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1190);
Y.GalleryModel.prototype._defDataLoaded.apply(self, arguments);
			}

		},
		/**
		 * Returns the number of records stored, skipping over empty slots.
		 * @method size
		 * @return {Integer} number of records in the shelves
		 */
		size: function() {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "size", 1199);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1200);
var count = 0;
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1201);
YArray.each(this._shelves, function () {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "(anonymous 19)", 1201);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1202);
count +=1;
			});
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1204);
return count;
		},
		/**
		 * Empties the shelves of any records as well as the exposed record
		 * @method empty
		 * @chainable
		 */
		empty: function () {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "empty", 1211);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1212);
this._shelves = [];
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1213);
this._currentIndex = 0;
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1214);
this.reset();
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1215);
return this;
		},
		/**
		 * Setter for the {{#crossLink "GalleryModelMultiRecord/index:attribute"}}{{/crossLink}} attribute.
		 * Validates and copies the current index value into {{#crossLink "GalleryModel/_currentIndex"}}{{/crossLink}}.
		 * It shelves the current record and fetches the requested one.
		 * @method _indexSetter
		 * @param value {integer} new value for the index
		 * @return {integer|INVALID_VALUE} new value for the index or INVALID_VALUE if invalid.
		 * @private
		 */
		_indexSetter: function (value) {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_indexSetter", 1226);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1227);
if (Lang.isNumber(value) && value >= 0 && value < this._shelves.length) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1228);
this._shelve(this._currentIndex);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1229);
this._currentIndex = value = parseInt(value,10);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1230);
this._fetch(value);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1231);
return value;
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1233);
return Y.Attribute.INVALID_VALUE;
		},
		/**
		 * Getter for the {{#crossLink "GalleryModelMultiRecord/index:attribute"}}{{/crossLink}} attribute
		 * Returns the value from {{#crossLink "GalleryModelMultiRecord/_currentIndex"}}{{/crossLink}}
		 * @method _indexGetter
		 * @return {integer} value of the index
		 * @private
		 */
		_indexGetter: function () {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_indexGetter", 1242);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1243);
return this._currentIndex;
		},
		/**
		 * Getter for the {{#crossLink "GalleryModel/isNew:attribute"}}{{/crossLink}} attribute used only for GalleryModelMultiRecord
		 * so that it is read from the shelf and not from the actual attribute,
		 * which is expensive to shelve
		 * @method _isNewGetter
		 * @param value {Boolean} value stored in the attribute, it is ignored.
		 * @param name {String} name of the attribute.
		 *		If it contains a dot, the original getter is called.
		 * @return {Boolean} state of the attribute
		 * @private
		 */
		_isNewGetter: function (value, name) {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_isNewGetter", 1256);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1257);
if (name.split(DOT).length > 1) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1258);
return Y.GalleryModel.prototype._isNewGetter.apply(this, arguments);
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1260);
return this._isNew;

		},
		/**
		 * Setter for the {{#crossLink "GalleryModel/isNew:attribute"}}{{/crossLink}} attribute used only for GalleryModelMultiRecord
		 * so that it is written into the shelf and not into the actual attribute,
		 * which is expensive to shelve
		 * @method _isNewSetter
		 * @param value {Boolean} value stored in the attribute.
		 * @return {Boolean} the same value as received.
		 * @private
		 */
		_isNewSetter: function (value) {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_isNewSetter", 1272);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1273);
return (this._isNew = value);
		},
		/**
		 * Getter for the {{#crossLink "GalleryModel/isModified:attribute"}}{{/crossLink}} attribute used only for GalleryModelMultiRecord
		 * so that it is read from the shelf and not from the actual attribute,
		 * which is expensive to shelve
		 * @method _isModifiedGetter
		 * @param value {Boolean} value stored in the attribute, it is ignored.
		 * @param name {String} name of the attribute.
		 *		If it contains a dot, the original getter is called.
		 * @return {Boolean} state of the attribute
		 * @private
		 */
		_isModifiedGetter:  function (value, name) {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_isModifiedGetter", 1286);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1287);
if (name.split(DOT).length > 1) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1288);
return Y.GalleryModel.prototype._isModifiedGetter.apply(this, arguments);
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1290);
return this._isModified;

		},
		/**
		 * Setter for the {{#crossLink "GalleryModel/isModified:attribute"}}{{/crossLink}} attribute used only for GalleryModelMultiRecord
		 * so that it is written into the shelf and not into the actual attribute,
		 * which is expensive to shelve
		 * @method _isModifiedSetter
		 * @param value {Boolean} value stored in the attribute.
		 * @return {Boolean} the same value as received.
		 * @private
		 */
		_isModifiedSetter:  function (value) {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_isModifiedSetter", 1302);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1303);
return (this._isModified = value);
		}


	};

	_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1309);
MR.ATTRS = {
		/**
		 * Index of the record exposed.
		 * @attribute index
		 * @type Integer
		 * @default 0
		 */
		index: {
			value: 0,
			setter:'_indexSetter',
			getter:'_indexGetter'
		},
		/**
		 * Merges the new setter into the existing {{#crossLink "GalleryModel/isNew:attribute"}}{{/crossLink}} attribute
		 * @attribute isNew
		 */
		isNew: {
			setter:'_isNewSetter'
		},
		/**
		 * Merges the new setter into the existing {{#crossLink "GalleryModel/isModified:attribute"}}{{/crossLink}} attribute.
		 * @attribute isModified
		 */
		isModified: {
			setter: '_isModifiedSetter'
		}
	};

	_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1337);
Y.GalleryModelMultiRecord = MR;

	/**
	 * Extension to sort records stored in {{#crossLink "GalleryModel"}}{{/crossLink}},
     * extended with {{#crossLink "GalleryModelMultiRecord"}}{{/crossLink}}
	 * It is incompatible with {{#crossLink "GalleryModelPrimaryKeyIndex"}}{{/crossLink}}
	 * @class GalleryModelSortedMultiRecord
	 */
	_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1345);
var SFIELD = 'sortField',
		SDIR = 'sortDir',
		ASC = 'asc',
		DESC = 'desc',
		SMR = function () {};

	_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1351);
SMR.prototype = {
		/**
		 * Compare function used in sorting.
		 * @method _compare
		 * @param a {object} shelf to compare
		 * @param b {object} shelf to compare
		 * @return {integer} -1, 0 or 1 as required by Array.sort
		 * @private
		 */
		_compare: null,
		/**
		 * Initializer lifecycle method.
		 * Ensures proper defaults, sets the compare method and
		 * sets listeners for relevant events
		 * @method initializer
		 * @protected
		 */
		initializer: function () {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "initializer", 1368);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1369);
if (this.get(SFIELD) === undefined) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1370);
this._set(SFIELD, this.get('primaryKeys')[0]);
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1372);
this._setCompare();
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1373);
this.after([SFIELD + CHANGE, SDIR + CHANGE], this._sort);
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1374);
this.after(EVT_CHANGE, this._afterChange);
		},
		/**
		 * Sets the compare function to be used in sorting the records
		 * based on the {{#crossLink "GalleryModelSortedMultiRecord/sortField:attribute"}}{{/crossLink}}
		 * and {{#crossLink "GalleryModelSortedMultiRecord/sortDir:attribute"}}{{/crossLink}}
		 * attributes and stores it into this._compare
		 * @method _setCompare
		 * @private
		 */
		_setCompare: function () {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_setCompare", 1384);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1385);
var sortField = this.get(SFIELD),
				sortAsc = this.get(SDIR) === ASC?1:-1,
				compareValue = (Lang.isFunction(sortField)?
					sortField:
					function(values) {
						_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "sortField", 1389);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1390);
return values[sortField];
					}
				);
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1393);
this._compare = function(a, b) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_compare", 1393);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1394);
var aValue = compareValue(a._values),
					bValue = compareValue(b._values);

				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1397);
return (aValue < bValue ? -1 : (aValue > bValue ? 1 : 0)) * sortAsc;
			};
		},
		/**
		 * Sorts the shelves whenever the
		 * {{#crossLink "GalleryModelSortedMultiRecord/sortField:attribute"}}{{/crossLink}}
		 * or {{#crossLink "GalleryModelSortedMultiRecord/sortDir:attribute"}}{{/crossLink}}
		 * attributes change.
		 * @method _sort
		 * @private
		 */
		_sort: function() {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_sort", 1408);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1409);
this._setCompare();
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1410);
this._shelve();
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1411);
this._shelves.sort(this._compare);
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1412);
this._shelves.splice(this.size());
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1413);
this._fetch(0);
		},
		/**
		 * Listens to value changes and if the name of the field is that of the
		 * {{#crossLink "GalleryModelSortedMultiRecord/sortField:attribute"}}{{/crossLink}} attribute
		 * or if {{#crossLink "GalleryModelSortedMultiRecord/sortField:attribute"}}{{/crossLink}}
		 * is a function, it will relocate the record to its proper sort order
		 * @method _afterChange
		 * @param ev {EventFacade} Event façade as produced by the {{#crossLink "GalleryModel/change:event"}}{{/crossLink}}  event
		 * @private
		 */
		_afterChange: function (ev) {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_afterChange", 1424);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1425);
var fieldName = ev.name,
				sField = this.get(SFIELD),
				index,
				currentIndex = this._currentIndex,
				shelves = this._shelves,
				currentShelf;

			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1432);
if (fieldName && ev.src !== ADD && (Lang.isFunction(sField) || fieldName === sField)) {
				// The shelf has to be emptied otherwise _findIndex may match itself.
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1434);
currentShelf = shelves.splice(currentIndex,1)[0];
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1435);
index = this._findIndex(currentShelf._values);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1436);
shelves.splice(index,0,currentShelf);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1437);
this._currentIndex = index;
			}
		},
		/**
		 * Finds the correct index position of a record within the shelves
		 * according to the current
		 * {{#crossLink "GalleryModelSortedMultiRecord/sortField:attribute"}}{{/crossLink}}
		 * or {{#crossLink "GalleryModelSortedMultiRecord/sortDir:attribute"}}{{/crossLink}}
		 * attributes
		 * @method _findIndex
		 * @param values {Object} values of the record to be located
		 * @return {Integer} location for the record
		 * @private
		 */
		_findIndex: function (values) {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_findIndex", 1451);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1452);
var shelves = this._shelves,
				low = 0,
				high = shelves.length,
				index = 0,
				cmp = this._compare,
				vals = {_values: values};

			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1459);
while (low < high) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1460);
index = Math.floor((high + low) / 2);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1461);
switch(cmp(vals, shelves[index])) {
					case 1:
						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1463);
low = index + 1;
						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1464);
break;
					case -1:
						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1466);
high = index;
						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1467);
break;
					default:
						_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1469);
low = high = index;
				}

			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1473);
return low;

		},
		/**
		 * Adds a new record at its proper position according to the sort configuration.
		 * It overrides
		 * {{#crossLink "GalleryModelMultiRecord"}}{{/crossLink}}'s own
		 * {{#crossLink "GalleryModelMultiRecord/add"}}{{/crossLink}}
		 * method, ignoring the index position requested, if any.
		 * The new record becomes the current.
		 * @method add
		 * @param values {Object|Array} set of values to set.
		 * If it is an array, it will call itself for each of the items in it.
		 * @chainable
		 */
		add: function(values) {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "add", 1488);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1489);
if (Lang.isArray(values)) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1490);
YArray.each(values, this.add, this);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1491);
return this;
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1493);
var shelves = this._shelves,
				index = 0;

			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1496);
index = this._findIndex(values);
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1497);
this._currentIndex = index;
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1498);
shelves.splice(index, 0, {});
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1499);
this._initNew();
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1500);
this.setValues(values, ADD);
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1501);
this._shelve(index);
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1502);
return this;
		},
		/**
		 * Locates a record by value.  The record will be located by the field
		 * given in the {{#crossLink "GalleryModelSortedMultiRecord/sortField:attribute"}}{{/crossLink}}
		 *  attribute.   It will return the index of the
		 * record in the shelves or `null` if not found.
		 * By default it will expose that record.
		 * If {{#crossLink "GalleryModelSortedMultiRecord/sortField:attribute"}}{{/crossLink}}
		 * contains a function, it will return `null` and do nothing.
		 * Since sort fields need not be unique, find may return any of the records
		 * with the same value for that field.
		 * @method find
		 * @param value {Any} value to be found
		 * @param [move] {Boolean} exposes the record found, defaults to `true`
		 * @return {integer | null} index of the record found or `null` if not found.
		 * Be sure to differentiate a return of `0`, a valid index, from `null`, a failed search.
		 */
		find: function (value, move) {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "find", 1520);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1521);
var sfield = this.get(SFIELD),
				index,
				values = {};
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1524);
if (Lang.isFunction(sfield)) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1525);
return null;
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1527);
values[sfield] = value;
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1528);
index = this._findIndex(values);
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1529);
if (this._shelves[index]._values[sfield] !== value) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1530);
return null;
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1532);
if (move || arguments.length < 2) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1533);
this.set(INDEX, index);
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1535);
return index;
		}
	};
	_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1538);
SMR.ATTRS = {
		/**
		 * Name of the field to sort by or function to build the value used for comparisson.
		 * If a function, it will receive a reference to the record to be sorted;
		 * it should return the value to be used for comparisson.  Functions are
		 * used when sorting on multiple keys, which the function should return
		 * concatenated, or when any of the fields needs some pre-processing.
		 * @attribute sortField
		 * @type String | Function
		 * @default first primary key field
		 */
		sortField: {
			validator: function (value){
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "validator", 1550);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1551);
return Lang.isString(value) || Lang.isFunction(value);
			}
		},
		/**
		 * Sort direction either `"asc"` for ascending or `"desc"` for descending
		 * @attribute sortDir
		 * @type String
		 * @default "asc"
		 */
		sortDir: {
			validator: function (value) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "validator", 1561);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1562);
return value === DESC || value === ASC;
			},
			value: ASC
		}
	};
	_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1567);
Y.GalleryModelSortedMultiRecord = SMR;

	/**
	 * Extension to store the records in the GalleryModel using the field in the
	 * {{#crossLink "GalleryModel/primaryKeys:attribute"}}{{/crossLink}} attribute as its index.
	 * The primary key __must__ be a __single__ __unique__ __integer__ field.
	 * It should be used along {{#crossLink "GalleryModelMultiRecord"}}{{/crossLink}}.
	 * It is incompatible with {{#crossLink "GalleryModelSortedMultiRecord"}}{{/crossLink}}.
	 * @class GalleryModelPrimaryKeyIndex
	 */
	_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1577);
var PKI = function () {};
	_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1578);
PKI.prototype = {
		/**
		 * Adds a new record at the index position given by its primary key.
		 * The new record becomes the current.
		 * @method add
		 * @param values {Object|Array} set of values to set.
		 * If it is an array, it will call itself for each of the items in it.
		 * @chainable
		 */
		add: function(values) {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "add", 1587);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1588);
if (Lang.isArray(values)) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1589);
YArray.each(values, this.add, this);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1590);
return this;
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1592);
if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1593);
this._shelve();
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1595);
this._currentIndex = values[this._primaryKeys[0]];
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1596);
this._initNew();
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1597);
this.setValues(values, ADD);
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1598);
return this;
		},
		/**
		 * Default action for the {{#crossLink "GalleryModel/loaded:event"}}{{/crossLink}} event,
		 * checks if the parsed response is an array
		 * and saves it into the shelves using the value of the primary key field for its index.
		 * The model will be left positioned at the item with the lowest key value.
		 * If the primary key field has not been declared, items will not be loaded.
		 * If the primary key field is not unique, the duplicate will overwrite the previous.
		 * @method _defDataLoaded
		 * @param ev {EventFacade} facade produced by the {{#crossLink "GalleryModel/loaded:event"}}{{/crossLink}} event,
		 * @private
		 */
		_defDataLoaded: function (ev) {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "_defDataLoaded", 1611);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1612);
var self = this,
				shelves = self._shelves,
				pk = self._primaryKeys[0];

			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1616);
if (Lang.isUndefined(pk)) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1617);
return;
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1619);
if (self.get(IS_MODIFIED) || !self.get(IS_NEW)) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1620);
self._shelve();
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1622);
YArray.each(new YArray(ev.parsed), function (values) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "(anonymous 20)", 1622);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1623);
shelves[values[pk]] = {
					_values: values,
					_loadedValues: Y.clone(values),
					isNew: false,
					isModified:false
				};
			});
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1630);
YArray.some(shelves, function (shelf, index) {
				_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "(anonymous 21)", 1630);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1631);
self._fetch(index);
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1632);
return true;
			});
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1634);
ev.callback.call(self,null, ev.response);

		},
		/**
		 * Sugar method added because items might not be contiguous so
		 * adding one to the index does not always get you to the next item.
		 * If there is no next element, `null` will be returned and the
		 * collection will still point to the last item.
		 * @method next
		 * @return {integer} index of the next item or `null` if none found
		 */
		next: function () {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "next", 1645);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1646);
if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1647);
this._shelve();
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1649);
var shelves = this._shelves,
				index = this._currentIndex + 1,
				l = shelves.length;
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1652);
while (index < l && !shelves.hasOwnProperty(index)) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1653);
index +=1;
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1655);
if (index === l) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1656);
return null;
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1658);
this._fetch(index);
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1659);
return index;
		},
		/**
		 * Sugar method added because items might not be contiguous so
		 * subtracting one to the index does not always get you to the previous item.
		 * If there is no next element, `null` will be returned and the
		 * collection will still point to the first item.
		 * @method previous
		 * @return {integer} index of the previous item or `null` if none found
		 */
		previous: function () {
			_yuitest_coverfunc("build/gallery-md-model/gallery-md-model.js", "previous", 1669);
_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1670);
if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1671);
this._shelve();
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1673);
var shelves = this._shelves,
				index = this._currentIndex - 1;
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1675);
while (index >= 0 && !shelves.hasOwnProperty(index)) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1676);
index -=1;
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1678);
if (index === -1) {
				_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1679);
return null;
			}
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1681);
this._fetch(index);
			_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1682);
return index;
		}

	};
	_yuitest_coverline("build/gallery-md-model/gallery-md-model.js", 1686);
Y.GalleryModelPrimaryKeyIndex = PKI;



}, '@VERSION@', {"requires": ["base"], "skinnable": false});
