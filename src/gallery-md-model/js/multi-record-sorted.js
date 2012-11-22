
/**
 * Extension to sort records stored in {{#crossLink "GalleryModel"}}{{/crossLink}},
 * extended with {{#crossLink "GalleryModelMultiRecord"}}{{/crossLink}}
 * It is incompatible with {{#crossLink "GalleryModelPrimaryKeyIndex"}}{{/crossLink}}
 * @class GalleryModelSortedMultiRecord
 */
SMR = function () {};

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
        if (this.get(SFIELD) === undefined) {
            this._set(SFIELD, this.get('primaryKeys')[0]);
        }
        this._setCompare();
        this.after([SFIELD + CHANGE, SDIR + CHANGE], this._sort);
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
        var sortField = this.get(SFIELD),
            sortAsc = this.get(SDIR) === ASC?1:-1,
            compareValue = (Lang.isFunction(sortField)?
                sortField:
                function(values) {
                    return values[sortField];
                }
            );
        this._compare = function(a, b) {
            var aValue = compareValue(a._values),
                bValue = compareValue(b._values);

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
        this._setCompare();
        this._shelve();
        this._shelves.sort(this._compare);
        this._shelves.splice(this.size());
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
        var fieldName = ev.name,
            sField = this.get(SFIELD),
            index,
            currentIndex = this._currentIndex,
            shelves = this._shelves,
            currentShelf;

        if (fieldName && ev.src !== ADD && (Lang.isFunction(sField) || fieldName === sField)) {
            // The shelf has to be emptied otherwise _findIndex may match itself.
            currentShelf = shelves.splice(currentIndex,1)[0];
            index = this._findIndex(currentShelf._values);
            shelves.splice(index,0,currentShelf);
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
        var shelves = this._shelves,
            low = 0,
            high = shelves.length,
            index = 0,
            cmp = this._compare,
            vals = {_values: values};

        while (low < high) {
            index = Math.floor((high + low) / 2);
            switch(cmp(vals, shelves[index])) {
                case 1:
                    low = index + 1;
                    break;
                case -1:
                    high = index;
                    break;
                default:
                    low = high = index;
            }

        }
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
        if (Lang.isArray(values)) {
            YArray.each(values, this.add, this);
            return this;
        }
        var shelves = this._shelves,
            index = 0;

        index = this._findIndex(values);
        this._currentIndex = index;
        shelves.splice(index, 0, {});
        this._initNew();
        this.setValues(values, ADD);
        this._shelve(index);
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
        var sfield = this.get(SFIELD),
            index,
            values = {};
        if (Lang.isFunction(sfield)) {
            return null;
        }
        values[sfield] = value;
        index = this._findIndex(values);
        if (this._shelves[index]._values[sfield] !== value) {
            return null;
        }
        if (move || arguments.length < 2) {
            this.set(INDEX, index);
        }
        return index;
    }
};
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
            return value === DESC || value === ASC;
        },
        value: ASC
    }
};
Y.GalleryModelSortedMultiRecord = SMR;
