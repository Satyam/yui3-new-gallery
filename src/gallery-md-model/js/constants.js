'use strict';
/*jslint white: true */
/**
Record-based data model with APIs for getting, setting, validating, and
syncing attribute values, as well as events for being notified of model changes.

@module gallery-md-model
**/

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
    NULL_FN = function (){},
    // for multi-record
    INDEX = 'index',
    MR,
    // for multi-record-sorted
    SFIELD = 'sortField',
    SDIR = 'sortDir',
    ASC = 'asc',
    DESC = 'desc',
    SMR,
    // for primary-key-index
    PKI;
