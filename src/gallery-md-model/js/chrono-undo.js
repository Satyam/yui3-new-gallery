/**
 * Provides multiple levels of undo in strict chronological order
 * whatever the field was at each stage.
 * Changes done on multiple fields via setValues
 * will also be undone in one step.
 * @class GalleryModelChronologicalUndo
 */
Y.GalleryModelChronologicalUndo = function () {};

Y.GalleryModelChronologicalUndo.prototype = {
    initializer: function () {
        this._changes = [];
        if (this._addPreserve) {
            this._addPreserve('_changes');
        }
        this.after(EVT_CHANGE, this._trackChange);
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
        if (ev.src !== UNDO) {
            this._changes.push(ev.details);
        }
    },
    /**
     * After load or save operations, it drops any changes it might have tracked.
     * @method _resetUndo
     * @private
     */
    _resetUndo: function () {
        this._changes = [];
    },
    /**
     * Reverts one level of field changes.
     * @method undo
     * @chainable
     */
    undo: function () {
        var ev = this._changes.pop();
        if (ev) {
            if (ev.name) {
                this.setValue(ev.name, ev.prevVal, UNDO);
            } else {
                this.setValues(ev.prevVals, UNDO);
            }
        }
        if (this._changes.length === 0) {
            this._set(IS_MODIFIED, false);
        }
        return this;
    }
};
