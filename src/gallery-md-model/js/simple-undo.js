/**
 * An extension for GalleryModel that provides a single level of undo for each field.
 * It will never undo a field to `undefined` since it assumes an undefined field had not been set.
 * @class GalleryModelSimpleUndo
 */
Y.GalleryModelSimpleUndo = function () {};

Y.GalleryModelSimpleUndo.prototype = {
    initializer: function () {
        this._lastChange = {};
        if (this._addPreserve) {
            this._addPreserve('_lastChange');
        }
        this.after(EVT_CHANGE, this._trackChange);
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
        if (ev.name && ev.src !== UNDO) {
            this._lastChange[ev.name] = ev.prevVal;
        }
    },
    /**
     * After load or save operations, it drops any changes it might have tracked.
     * @method _resetUndo
     * @private
     */
    _resetUndo: function () {
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
        var self = this;
        if (name) {
            if (self._lastChange[name] !== undefined) {
                self.setValue(name, self._lastChange[name], UNDO);
                delete self._lastChange[name];
            }
        } else {
            YObject.each(self._lastChange, function (value, name) {
                if (value !== undefined) {
                    self.setValue(name, value, UNDO);
                }
            });
            self._lastChange = {};
        }
        return self;
    }
};
