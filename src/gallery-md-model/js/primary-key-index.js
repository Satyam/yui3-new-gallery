/**
 * Extension to store the records in the GalleryModel using the field in the
 * {{#crossLink "GalleryModel/primaryKeys:attribute"}}{{/crossLink}} attribute as its index.
 * The primary key __must__ be a __single__ __unique__ __integer__ field.
 * It should be used along {{#crossLink "GalleryModelMultiRecord"}}{{/crossLink}}.
 * It is incompatible with {{#crossLink "GalleryModelSortedMultiRecord"}}{{/crossLink}}.
 * @class GalleryModelPrimaryKeyIndex
 */
PKI = function () {};
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
        if (Lang.isArray(values)) {
            YArray.each(values, this.add, this);
            return this;
        }
        if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {
            this._shelve();
        }
        this._currentIndex = values[this._primaryKeys[0]];
        this._initNew();
        this.setValues(values, ADD);
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
        var self = this,
            shelves = self._shelves,
            pk = self._primaryKeys[0];

        if (Lang.isUndefined(pk)) {
            return;
        }
        if (self.get(IS_MODIFIED) || !self.get(IS_NEW)) {
            self._shelve();
        }
        YArray.each(new YArray(ev.parsed), function (values) {
            shelves[values[pk]] = {
                _values: values,
                _loadedValues: Y.clone(values),
                isNew: false,
                isModified:false
            };
        });
        YArray.some(shelves, function (shelf, index) {
            self._fetch(index);
            return true;
        });
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
        if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {
            this._shelve();
        }
        var shelves = this._shelves,
            index = this._currentIndex + 1,
            l = shelves.length;
        while (index < l && !shelves.hasOwnProperty(index)) {
            index +=1;
        }
        if (index === l) {
            return null;
        }
        this._fetch(index);
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
        if (this.get(IS_MODIFIED) || !this.get(IS_NEW)) {
            this._shelve();
        }
        var shelves = this._shelves,
            index = this._currentIndex - 1;
        while (index >= 0 && !shelves.hasOwnProperty(index)) {
            index -=1;
        }
        if (index === -1) {
            return null;
        }
        this._fetch(index);
        return index;
    }

};
Y.GalleryModelPrimaryKeyIndex = PKI;

