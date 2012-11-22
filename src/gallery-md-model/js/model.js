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
            this._values = {};
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
            this.publish(EVT_SAVED, {
                preventable: false
            });
            cfg = cfg || {};
            if (Lang.isObject(cfg.values)) {
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
            this.setValues(ev.cfg.values, 'init');
            this._set(IS_MODIFIED, false);
            this._set(IS_NEW, true);
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
            if (Lang.isFunction(options)) {
                callback = options;
                options = {};
            } else if (!options) {
                options = {};
            }
            callback = callback || NULL_FN;
            var self = this,
                finish = function (err) {
                    if (!err) {
                        YArray.each(self.lists.concat(), function (list) {
                            list.remove(self, options);
                        });

                        Y.GalleryModel.superclass.destroy.call(self);
                    }

                    callback.apply(self, arguments);
                };

            if (options.remove) {
                this.sync('delete', options, finish);
            } else {
                finish();
            }

            return this;
        },
        /**
         * Returns the value of the field named
         * @method getValue
         * @param name {string}  Name of the field to return.
         * @return {Any} the value of the field requested.
         */
        getValue: function (name) {
            return this._values[name];
        },
        /**
         * Returns a hash with all values using the field names as keys.
         * @method getValues
         * @return {Object} a hash with all the fields with the field names as keys.
         */
        getValues: function() {
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
            var prevVal = this._values[name];
            if (prevVal !== value && (this._primaryKeys.indexOf(name) === -1 || Lang.isUndefined(prevVal))) {
                this.fire(EVT_CHANGE, {
                    name:name,
                    newVal:value,
                    prevVal:prevVal,
                    src: src
                });
            }
            return this;
        },
        /**
         * Default function for the change event, sets the value and marks the model as modified.
         * @method _defSetValue
         * @param ev {EventFacade} (see {{#crossLink "GalleryModel/change:event"}}{{/crossLink}} event)
         * @private
         */
        _defSetValue: function (ev) {
            var self = this;
            if (ev.name) {
                self._values[ev.name] = ev.newVal;
                self._set(IS_MODIFIED, true);
            } else {
                YObject.each(ev.newVals, function (value, name) {
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
            var self = this,
                prevVals = {};

            YObject.each(values, function (value, name) {
                prevVals[name] = self.getValue(name);
            });
            this.fire(EVT_CHANGE, {
                newVals:values,
                prevVals:prevVals,
                src: src
            });
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
            var changed = {},
                prev,
                loaded = this._loadedValues;

            YObject.each(this._values, function (value, name) {
                prev = loaded[name];
                if (prev !== value) {
                    changed[name] = {prevVal:prev, newVal: value};
                }
            });
            return changed;
        },
        /**
         * Returns a hash with the values of the primary key fields, indexed by their field names
         * @method getPKValues
         * @return {Object} Hash with the primary key values, indexed by their field names
         */
        getPKValues: function () {
            var pkValues = {},
                self = this;
            YArray.each(self._primaryKeys, function (name) {
                pkValues[name] = self._values[name];
            });
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
            var value = this.getValue(name);
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
            var value = this.getValue(name),
                url = [];
            if (name) {
                return encodeURIComponent(Lang.isValue(value) ? String(value) : '');
            }
            YObject.each(value, function (value, name) {
                if (Lang.isValue(value)) {
                    url.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
                }
            });
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
            var self = this;
            self.setValues(ev.parsed, ev.src);
            self._set(IS_MODIFIED, false);
            self._set(IS_NEW, false);
            self._loadedValues = Y.clone(self._values);
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
            var self = this;

            if (Lang.isFunction(options)) {
                callback = options;
                options = {};
            } else if (!options) {
                options = {};
            }
            callback = callback || NULL_FN;

            self.sync('read', options, function (err, response) {
                var facade = {
                        options : options,
                        response: response,
                        src: 'load',
                        callback: callback
                    };

                if (err) {
                    facade.error = err;

                    self.fire(EVT_ERROR, facade);
                    callback.apply(self, arguments);
                } else {
                    self._values = {};

                    facade.parsed = self.parse(response);
                    self.fire(EVT_LOADED, facade);
                }
            });

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
            if (typeof response === 'string') {
                try {
                    return Y.JSON.parse(response);
                } catch (ex) {
                    this.fire(EVT_ERROR, {
                        error : ex,
                        response: response,
                        src : 'parse'
                    });

                    return null;
                }
            }

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
            var self = this;

            if (Lang.isFunction(options)) {
                callback = options;
                options = {};
            } else if (!options) {
                options = {};
            }
            callback = callback || NULL_FN;

            self._validate(self.getValues(), function (err) {
                if (err) {
                    callback.call(self, err);
                    return;
                }

                self.sync(self.get(IS_NEW) ? 'create' : 'update', options, function (err, response) {
                    var facade = {
                            options : options,
                            response: response,
                            src: 'save'
                        };

                    if (err) {
                        facade.error = err;

                        self.fire(EVT_ERROR, facade);
                    } else {
                        facade.parsed = self.parse(response);
                        facade.callback = callback;
                        self._set(IS_MODIFIED, false);
                        self._set(IS_NEW, false);
                        self._loadedValues = Y.clone(self._values);
                        self.fire(EVT_SAVED, facade);
                        if (facade.parsed) {
                            self.fire(EVT_LOADED, facade);
                            return self; // the loaded event will take care of calling the callback
                        }
                    }
                    callback.apply(self, arguments);
                });
            });

            return self;
        },
        /**
         * Restores the values when last loaded, saved or created.
         * @method reset
         * @chainable
         */
        reset: function() {
            this._values = Y.clone(this._loadedValues);
            this.fire(EVT_RESET);
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
            var self = this;

            self.validate(attributes, function (err) {
                if (Lang.isValue(err)) {
                    // Validation failed. Fire an error.
                    self.fire(EVT_ERROR, {
                        attributes: attributes,
                        error : err,
                        src : 'validate'
                    });

                    callback.call(self, err);
                    return;
                }

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
            name = name.split(DOT);
            if (name.length > 1) {
                name = name[1];
                var ret = {};
                ret[name] = this._values[name] !== this._loadedValues[name];
                return ret;
            }
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
            name = name.split(DOT);
            if (name.length > 1) {
                name = name[1];
                var ret = {};
                ret[name] = !this._loadedValues.hasOwnProperty(name);
                return ret;
            }
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
            if (this._primaryKeys && this._primaryKeys.length) {
                return Y.Attribute.INVALID_VALUE;
            }
            value = new YArray(value);
            this._primaryKeys = value;
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
            name = name.split(DOT);
            if (name.length > 1) {
                name = name[1];
                var ret = {};
                ret[name] = value.indexOf(name) !== -1;
                return ret;
            }
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
