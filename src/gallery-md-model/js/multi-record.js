/**
 * Allows GalleryModel to handle a set of records using the Flyweight pattern.
 * It exposes one record at a time from a shelf of records.
 * Exposed records can be selected by setting the {{#crossLink "GalleryModel/index:attribute"}}{{/crossLink}} attribute.
 * @class GalleryModelMultiRecord
 */

MR = function () {};

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
        this._shelves = [];
        this._currentIndex = 0;
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
        if (index === undefined) {
            index = this._currentIndex;
        }
        var self = this,
            current = {};
        YArray.each(self._preserve, function (name) {
            current[name] = self[name];
        });
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
        if (index === undefined) {
            index = this._currentIndex;
        } else {
            this._currentIndex = index;
        }
        var self = this,
            current = self._shelves[index];

        if (Lang.isUndefined(current)) {
            this._initNew();
        } else {
            YArray.each(self._preserve, function (name) {
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
        this._preserve = (this._preserve || []).concat(Array.prototype.slice.call(arguments));
    },

    /**
     * Initializes an exposed record
     * @method _initNew
     * @private
     */
    _initNew: function () {
        this._values = {};
        this._loadedValues = {};
        this._isNew = true;
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
        var self = this;
        if (Lang.isArray(values)) {
            YArray.each(values, function (value, i) {
                self.add(value, (index?index + i:undefined));
            });
            return self;
        }
        if (self.get(IS_MODIFIED) || !self.get(IS_NEW)) {
            self._shelve();
        }
        if (index === undefined) {
            index = self._shelves.length;
        }
        self._shelves.splice(index, 0, {});
        self._currentIndex = index;
        self._initNew();
        self.setValues(values, ADD);
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
        var self = this;
        self._shelve();
        YArray.each(self._shelves, function (shelf, index) {
            self._currentIndex = index;
            self._fetch(index);
            if (fn.call(self, index) !== false) {
                self._shelve(index);
            }
        });
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
        var self = this;
        self._shelve();
        YArray.each(self._shelves,  function (shelf, index) {
            if (self._shelves[index][IS_MODIFIED]) {
                self._currentIndex = index;
                self._fetch(index);
                if (fn.call(self, index) !== false) {
                    self._shelve(index);
                }
            }
        });
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
        this.eachModified(this.save);
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
        var self = this,
            shelves = self._shelves;
        if (Lang.isArray(ev.parsed)) {
            if (shelves.length && (self.get(IS_MODIFIED) || !self.get(IS_NEW))) {
                self._shelve();
            }
            YArray.each(ev.parsed, function (values) {
                shelves.push({
                    _values: values,
                    _loadedValues: Y.clone(values),
                    isNew: false,
                    isModified:false
                });
            });
            self._fetch();
            if (self._sort) {
                self._sort();
            }
            ev.callback.call(self,null, ev.response);
        } else {
            Y.GalleryModel.prototype._defDataLoaded.apply(self, arguments);
        }

    },
    /**
     * Returns the number of records stored, skipping over empty slots.
     * @method size
     * @return {Integer} number of records in the shelves
     */
    size: function() {
        var count = 0;
        YArray.each(this._shelves, function () {
            count +=1;
        });
        return count;
    },
    /**
     * Empties the shelves of any records as well as the exposed record
     * @method empty
     * @chainable
     */
    empty: function () {
        this._shelves = [];
        this._currentIndex = 0;
        this.reset();
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
        if (Lang.isNumber(value) && value >= 0 && value < this._shelves.length) {
            this._shelve(this._currentIndex);
            this._currentIndex = value = parseInt(value,10);
            this._fetch(value);
            return value;
        }
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
        if (name.split(DOT).length > 1) {
            return Y.GalleryModel.prototype._isNewGetter.apply(this, arguments);
        }
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
        if (name.split(DOT).length > 1) {
            return Y.GalleryModel.prototype._isModifiedGetter.apply(this, arguments);
        }
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
        return (this._isModified = value);
    }


};

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

Y.GalleryModelMultiRecord = MR;
