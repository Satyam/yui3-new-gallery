YUI.add('model-tests', function(Y) {
    var A = Y.Assert,
        NEW = 'isNew',
        MOD = 'isModified',
        PK = 'primaryKeys',
        F1 = 'fieldOne',
        F2 = 'fieldTwo',
        F3 = 'fieldThree',
        PKF = 'primaryKeyField',
        PKV = 'primaryKeyValue'
        DOT = '.',

        SynchedModel = Y.Base.create(
            'synched-model',
            Y.GalleryModel,
            [],
            {
                sync: function (action, options, callback) {
                    this.lastAction = action;
                    Y.later(100, this, function(){
                        if (options === false) {
                            callback('error requested');
                        }
                        switch (action) {
                            case 'read':
                                callback(null, Y.merge({fieldOne: 1, fieldTwo: 2}, options));
                                break;
                            case 'create':
                            case 'update':
                            case 'delete':
                                callback(null);
                                break;
                            default:
                                callback('operation not allowed');
                                break;
                        }
                    });
                }
            }
        ),

        suite = new Y.Test.Suite("GalleryModel Test Suite");

    suite.add(new Y.Test.Case({
        name: "Basic Model",

        testNewAndModifiedFlags : function () {
            var m = new Y.GalleryModel();
            A.isTrue(m.get(NEW),'New Record should have isNew == true');
            A.isFalse(m.get(MOD), 'New Record should not have anything modified');
            A.isTrue(m.get(NEW + DOT + F1),'before setting, new for fieldOne should be true');
            A.isFalse(m.get(MOD + DOT + F1),'before setting, modified for fieldOne should be false');

            m.setValue(F1,1);

            A.isTrue(m.get(NEW),'modified record should still be new');
            A.isTrue(m.get(MOD),'modified record should be marked as modified');
            A.isTrue(m.get(NEW + DOT + F1),'after setting, new for fieldOne should be true');
            A.isTrue(m.get(MOD + DOT + F1),'after setting, modified for fieldOne should be true');
            // The default sync() method does nothing, but does it synchronously so there is no need to set a callback.
            m.save();
            A.isFalse(m.get(NEW),'saved record should not be new');
            A.isFalse(m.get(MOD),'saved record should not be marked as modified');
            A.isFalse(m.get(NEW + DOT + F1),'after saving, new for fieldOne should be false');
            A.isFalse(m.get(MOD + DOT + F1),'after saving, modified for fieldOne should be false');

            m.set(NEW, true);
            m.set(MOD, true);
            A.isFalse(m.get(NEW),'isNew cannnot be set directly');
            A.isFalse(m.get(MOD),'isModified cannot be set directly');

        },
        testLoading: function() {
            var test = this;

            var m = new SynchedModel();
            A.isTrue(m.get(NEW),'New Record should have isNew == true');
            A.isFalse(m.get(MOD), 'New Record should not have anything modified');
            A.isTrue(m.get(NEW + DOT + F1),'before loading, new for fieldOne should be true');
            A.isFalse(m.get(MOD + DOT + F1),'before loading, modified for fieldOne should be false');
            A.isTrue(m.get(NEW + DOT + F2),'before loading, new for fieldTwo should be true');
            A.isFalse(m.get(MOD + DOT + F2),'before loading, modified for fieldTwo should be false');


            m.setValue(F3, 999);
            A.areEqual(999, m.getValue(F3), 'fieldThree should now contain 999');

            m.load({primaryKeyField: PKV}, function(err, response) {
                test.resume(function() {
                    A.isNull(err, 'there should be no error');
                    A.areEqual('read', m.lastAction, 'action should have been read');
                    A.isFalse(m.get(NEW),'Loaded record should have isNew == false');
                    A.isFalse(m.get(MOD), 'Loaded record should not have anything modified');
                    A.isFalse(m.get(NEW + DOT + F1),'after loading, new for fieldOne should be false');
                    A.isFalse(m.get(MOD + DOT + F1),'after loading, modified for fieldOne should be false');
                    A.isFalse(m.get(NEW + DOT + F2),'after loading, new for fieldTwo should be false');
                    A.isFalse(m.get(MOD + DOT + F2),'after loading, modified for fieldTwo should be false');
                    A.areEqual(1,m.getValue(F1), 'fieldOne should be 1');
                    A.areEqual(2,m.getValue(F2), 'fieldTwo should be 2');
                    A.areEqual(PKV,m.getValue(PKF), 'field PrimaryKeyField should be PrimaryKeyValue');
                    A.isUndefined(m.getValue(F3), 'fieldThree should be gone after load');
                });
            });
            this.wait(function () {
                A.fail('model should be loaded');
            },1000);


        },
        testSaving: function() {
            var test = this;

            var m = new SynchedModel();
            A.isTrue(m.get(NEW),'New Record should have isNew == true');
            A.isFalse(m.get(MOD), 'New Record should not have anything modified');
            A.isTrue(m.get(NEW + DOT + F1),'before saving, new for fieldOne should be true');
            A.isFalse(m.get(MOD + DOT + F1),'before saving, modified for fieldOne should be false');
            A.isTrue(m.get(NEW + DOT + F2),'before saving, new for fieldTwo should be true');
            A.isFalse(m.get(MOD + DOT + F2),'before saving, modified for fieldTwo should be false');

            m.setValue(F1,11);
            m.setValue(F2,22);
            A.isTrue(m.get(NEW),'modified record should still be new');
            A.isTrue(m.get(MOD),'modified record should be marked as modified');
            A.isTrue(m.get(NEW + DOT + F1),'after setting, new for fieldOne should be true');
            A.isTrue(m.get(MOD + DOT + F1),'after setting, modified for fieldOne should be true');
            A.isTrue(m.get(NEW + DOT + F2),'after setting, new for fieldTwo should be true');
            A.isTrue(m.get(MOD + DOT + F2),'after setting, modified for fieldTwo should be true');
            m.save(function(err, response) {
                test.resume(function() {
                    A.isNull(err, 'there should be no error');
                    A.areEqual('create', m.lastAction, 'action should have been create');
                    A.isFalse(m.get(NEW),'Saved record should have isNew == false');
                    A.isFalse(m.get(MOD), 'Saved record should not have anything modified');
                    A.isFalse(m.get(NEW + DOT + F1),'after saving, new for fieldOne should be false');
                    A.isFalse(m.get(MOD + DOT + F1),'after saving, modified for fieldOne should be false');
                    A.isFalse(m.get(NEW + DOT + F2),'after saving, new for fieldTwo should be false');
                    A.isFalse(m.get(MOD + DOT + F2),'after saving, modified for fieldTwo should be false');
                    A.areEqual(11, m.getValue(F1), 'fieldOne should be 11');
                    A.areEqual(22, m.getValue(F2), 'fieldTwo should be 22');
                });
            });
            this.wait(function () {
                A.fail('model should be saved');
            }, 1000);


        },
        testLoadingAndSaving: function() {
            var test = this;

            var m = new SynchedModel();
            A.isTrue(m.get(NEW),'New Record should have isNew == true');
            A.isFalse(m.get(MOD), 'New Record should not have anything modified');
            A.isTrue(m.get(NEW + DOT + F1),'before loading, new for fieldOne should be true');
            A.isFalse(m.get(MOD + DOT + F1),'before loading, modified for fieldOne should be false');
            A.isTrue(m.get(NEW + DOT + F2),'before loading, new for fieldTwo should be true');
            A.isFalse(m.get(MOD + DOT + F2),'before loading, modified for fieldTwo should be false');

            m.load({primaryKeyField: PKV}, function(err, response) {
                test.resume(function() {
                    A.isNull(err, 'there should be no error');
                    A.areEqual('read', m.lastAction, 'action should have been read');
                    A.isFalse(m.get(NEW),'Loaded record should have isNew == false');
                    A.isFalse(m.get(MOD), 'Loaded record should not have anything modified');
                    A.isFalse(m.get(NEW + DOT + F1),'after loading, new for fieldOne should be false');
                    A.isFalse(m.get(MOD + DOT + F1),'after loading, modified for fieldOne should be false');
                    A.isFalse(m.get(NEW + DOT + F2),'after loading, new for fieldTwo should be false');
                    A.isFalse(m.get(MOD + DOT + F2),'after loading, modified for fieldTwo should be false');
                    A.areEqual(1,m.getValue(F1), 'fieldOne should be 1');
                    A.areEqual(2,m.getValue(F2), 'fieldTwo should be 2');
                    A.areEqual(PKV,m.getValue(PKF), 'field PrimaryKeyField should be PrimaryKeyValue');

                    m.setValue(F1,11);
                    m.setValue(F2,22);
                    A.isFalse(m.get(NEW),'loaded record should still be new');
                    A.isTrue(m.get(MOD),'modified record should be marked as modified');
                    A.isFalse(m.get(NEW + DOT + F1),'after setting, new for fieldOne should be false');
                    A.isTrue(m.get(MOD + DOT + F1),'after setting, modified for fieldOne should be true');
                    A.isFalse(m.get(NEW + DOT + F2),'after setting, new for fieldTwo should be false');
                    A.isTrue(m.get(MOD + DOT + F2),'after setting, modified for fieldTwo should be true');
                    m.save(function(err, response) {
                        test.resume(function() {
                            A.isNull(err, 'there should be no error');
                            A.areEqual('update', m.lastAction, 'action should have been update');
                            A.isFalse(m.get(NEW),'Saved record should have isNew == false');
                            A.isFalse(m.get(MOD), 'Saved record should not have anything modified');
                            A.isFalse(m.get(NEW + DOT + F1),'after saving, new for fieldOne should be false');
                            A.isFalse(m.get(MOD + DOT + F1),'after saving, modified for fieldOne should be false');
                            A.isFalse(m.get(NEW + DOT + F2),'after saving, new for fieldTwo should be false');
                            A.isFalse(m.get(MOD + DOT + F2),'after saving, modified for fieldTwo should be false');
                            A.areEqual(11, m.getValue(F1), 'fieldOne should be 11');
                            A.areEqual(22, m.getValue(F2), 'fieldTwo should be 22');
                        });
                    });
                    this.wait(function () {
                        A.fail('model should be saved');
                    },1000);


                });
            });
            this.wait(function () {
                A.fail('model should be loaded');
            },1000);


        },
        testPrimaryKeys1: function() {
            var test = this;
            var LM = Y.Base.create(
                'loading model',
                SynchedModel,
                [],
                {
                },
                {
                    ATTRS: {
                        primaryKeys: {
                            value: PKF
                        }
                    }
                }
            );

            var m = new LM();
            A.isTrue(m.get(NEW),'New Record should have isNew == true');
            A.isFalse(m.get(MOD), 'New Record should not have anything modified');
            A.isTrue(m.get(NEW + DOT + F1),'before loading, new for fieldOne should be true');
            A.isFalse(m.get(MOD + DOT + F1),'before loading, modified for fieldOne should be false');
            A.isTrue(m.get(NEW + DOT + F2),'before loading, new for fieldTwo should be true');
            A.isFalse(m.get(MOD + DOT + F2),'before loading, modified for fieldTwo should be false');

            m.load({primaryKeyField: PKV}, function (err, response) {
                test.resume(function() {

                    A.isNull(err, 'there should be no error');
                    A.areEqual('read', m.lastAction, 'action should have been read');
                    A.isFalse(m.get(NEW),'Loaded record should have isNew == false');
                    A.isFalse(m.get(MOD), 'Loaded record should not have anything modified');
                    A.isFalse(m.get(NEW + DOT + F1),'after loading, new for fieldOne should be false');
                    A.isFalse(m.get(MOD + DOT + F1),'after loading, modified for fieldOne should be false');
                    A.isFalse(m.get(NEW + DOT + F2),'after loading, new for fieldTwo should be false');
                    A.isFalse(m.get(MOD + DOT + F2),'after loading, modified for fieldTwo should be false');
                    A.areEqual(1,m.getValue(F1), 'fieldOne should be 1');
                    A.areEqual(2,m.getValue(F2), 'fieldTwo should be 2');
                    A.areEqual(PKV,m.getValue(PKF), 'field PrimaryKeyField should be PrimaryKeyValue');

                    m.setValue(PKF, 'qqq');
                    A.areEqual(PKV,m.getValue(PKF), 'field PrimaryKeyField should still be PrimaryKeyValue,primarykeys cannot be changed');

                    m.setValue(F1,11);
                    A.areEqual(11,m.getValue(F1), 'fieldOne should be 11, non-primarykeys can be changed');
                    m.setValue(F2,22);
                    A.areEqual(22,m.getValue(F2), 'fieldTwo should be 22, non-primarykeys can be changed');
                });
            });
            this.wait(function () {
                A.fail('model should be loaded');
            },1000);


        },
        testPrimaryKeys2: function() {
            var test = this;
            var m = new SynchedModel({primaryKeys:PKF});

            A.isTrue(m.get(NEW),'New Record should have isNew == true');
            A.isFalse(m.get(MOD), 'New Record should not have anything modified');
            A.isTrue(m.get(NEW + DOT + F1),'before loading, new for fieldOne should be true');
            A.isFalse(m.get(MOD + DOT + F1),'before loading, modified for fieldOne should be false');
            A.isTrue(m.get(NEW + DOT + F2),'before loading, new for fieldTwo should be true');
            A.isFalse(m.get(MOD + DOT + F2),'before loading, modified for fieldTwo should be false');

            m.load({primaryKeyField: PKV}, function (err, response) {
                test.resume(function() {
                    A.isNull(err, 'there should be no error');
                    A.areEqual('read', m.lastAction, 'action should have been read');
                    A.isFalse(m.get(NEW),'Loaded record should have isNew == false');
                    A.isFalse(m.get(MOD), 'Loaded record should not have anything modified');
                    A.isFalse(m.get(NEW + DOT + F1),'after loading, new for fieldOne should be false');
                    A.isFalse(m.get(MOD + DOT + F1),'after loading, modified for fieldOne should be false');
                    A.isFalse(m.get(NEW + DOT + F2),'after loading, new for fieldTwo should be false');
                    A.isFalse(m.get(MOD + DOT + F2),'after loading, modified for fieldTwo should be false');
                    A.areEqual(1,m.getValue(F1), 'fieldOne should be 1');
                    A.areEqual(2,m.getValue(F2), 'fieldTwo should be 2');
                    A.areEqual(PKV,m.getValue(PKF), 'field PrimaryKeyField should be PrimaryKeyValue');

                    m.setValue(PKF, 'qqq');
                    A.areEqual(PKV, m.getValue(PKF), 'field PrimaryKeyField should still be PrimaryKeyValue,primarykeys cannot be changed');

                    m.setValue(F1, 11);
                    A.areEqual(11, m.getValue(F1), 'fieldOne should be 11, non-primarykeys can be changed');
                    m.setValue(F2, 22);
                    A.areEqual(22, m.getValue(F2), 'fieldTwo should be 22, non-primarykeys can be changed');
                });
            });
            this.wait(function () {
                A.fail('model should be loaded');
            },1000);


        },
        testPrimaryKeys3: function() {
            var test = this;
            var m = new SynchedModel();
            m.set(PK, PKF);
            A.isTrue(m.get(NEW),'New Record should have isNew == true');
            A.isFalse(m.get(MOD), 'New Record should not have anything modified');
            A.isTrue(m.get(NEW + DOT + F1),'before loading, new for fieldOne should be true');
            A.isFalse(m.get(MOD + DOT + F1),'before loading, modified for fieldOne should be false');
            A.isTrue(m.get(NEW + DOT + F2),'before loading, new for fieldTwo should be true');
            A.isFalse(m.get(MOD + DOT + F2),'before loading, modified for fieldTwo should be false');

            m.load({primaryKeyField: PKV}, function (err, response) {
                test.resume(function() {
                    A.isNull(err, 'there should be no error');
                    A.areEqual('read', m.lastAction, 'action should have been read');
                    A.isFalse(m.get(NEW),'Loaded record should have isNew == false');
                    A.isFalse(m.get(MOD), 'Loaded record should not have anything modified');
                    A.isFalse(m.get(NEW + DOT + F1),'after loading, new for fieldOne should be false');
                    A.isFalse(m.get(MOD + DOT + F1),'after loading, modified for fieldOne should be false');
                    A.isFalse(m.get(NEW + DOT + F2),'after loading, new for fieldTwo should be false');
                    A.isFalse(m.get(MOD + DOT + F2),'after loading, modified for fieldTwo should be false');
                    A.areEqual(1,m.getValue(F1), 'fieldOne should be 1');
                    A.areEqual(2,m.getValue(F2), 'fieldTwo should be 2');
                    A.areEqual(PKV,m.getValue(PKF), 'field PrimaryKeyField should be PrimaryKeyValue');

                    m.setValue(PKF, 'qqq');
                    A.areEqual(PKV,m.getValue(PKF), 'field PrimaryKeyField should still be PrimaryKeyValue,primarykeys cannot be changed');

                    m.setValue(F1,11);
                    A.areEqual(11,m.getValue(F1), 'fieldOne should be 11, non-primarykeys can be changed');
                    m.setValue(F2,22);
                    A.areEqual(22,m.getValue(F2), 'fieldTwo should be 22, non-primarykeys can be changed');

                    A.isTrue(m.get(PK + DOT + PKF), 'primary key should be primaryKeyField');
                    m.set(PK,F1);
                    A.isTrue(m.get(PK + DOT + PKF), 'primary key should still be primaryKeyField, it cannot be changed once set');
                });
            });
            this.wait(function () {
                A.fail('model should be loaded');
            },1000);


        },
        testSetEvent: function () {
            var m = new Y.GalleryModel();
            m.on('change', function(ev) {
                A.areEqual(F1,ev.name, 'field changed should be fieldOne');
                A.isUndefined(ev.prevVal,'field should have been undefined');
                A.areEqual(1,ev.newVal, 'field should now be 1');
            },this);
            A.isTrue(m.get(NEW),'New Record should have isNew == true');
            A.isFalse(m.get(MOD), 'New Record should not have anything modified');
            A.isTrue(m.get(NEW + DOT + F1),'before setting, new for fieldOne should be true');
            A.isFalse(m.get(MOD + DOT + F1),'before setting, modified for fieldOne should be false');

            m.setValue(F1,1);

            A.isTrue(m.get(NEW),'modified record should still be new');
            A.isTrue(m.get(MOD),'modified record should be marked as modified');
            A.isTrue(m.get(NEW + DOT + F1),'after setting, new for fieldOne should be true');
            A.isTrue(m.get(MOD + DOT + F1),'after setting, modified for fieldOne should be true');
            A.areEqual(1, m.getValue(F1), 'fieldOne should contain 1');
        },
        testNotSetEvent: function () {
            var m = new Y.GalleryModel();
            m.on('change', function(ev) {
                A.areEqual(F1,ev.name, 'field changed should be fieldOne');
                A.isUndefined(ev.prevVal,'field should have been undefined');
                A.areEqual(1,ev.newVal, 'field should now be 1');
                ev.halt();
            },this);
            A.isTrue(m.get(NEW),'New Record should have isNew == true');
            A.isFalse(m.get(MOD), 'New Record should not have anything modified');
            A.isTrue(m.get(NEW + DOT + F1),'before setting, new for fieldOne should be true');
            A.isFalse(m.get(MOD + DOT + F1),'before setting, modified for fieldOne should be false');

            m.setValue(F1,1);

            A.isUndefined(m.getValue(F1),'fieldOne should still be undefined');
            A.isTrue(m.get(NEW),'modified record should still be new');
            A.isFalse(m.get(MOD),'record should be marked as not modified, change rejected');
            A.isTrue(m.get(NEW + DOT + F1),'after setting, new for fieldOne should be true');
            A.isFalse(m.get(MOD + DOT + F1),'after setting, modified for fieldOne should be false, change rejected');
        },
        testSetEventValueChanged: function () {
            var m = new Y.GalleryModel();
            m.on('change', function(ev) {
                A.areEqual(F1,ev.name, 'field changed should be fieldOne');
                A.isUndefined(ev.prevVal,'field should have been undefined');
                A.areEqual(1,ev.newVal, 'field should now be 1');
                ev.newVal *= 2;
            },this);
            A.isTrue(m.get(NEW),'New Record should have isNew == true');
            A.isFalse(m.get(MOD), 'New Record should not have anything modified');
            A.isTrue(m.get(NEW + DOT + F1),'before setting, new for fieldOne should be true');
            A.isFalse(m.get(MOD + DOT + F1),'before setting, modified for fieldOne should be false');

            m.setValue(F1, 1);

            A.isTrue(m.get(NEW),'modified record should still be new');
            A.isTrue(m.get(MOD),'modified record should be marked as modified');
            A.isTrue(m.get(NEW + DOT + F1),'after setting, new for fieldOne should be true');
            A.isTrue(m.get(MOD + DOT + F1),'after setting, modified for fieldOne should be true');
            A.areEqual(2, m.getValue(F1), 'fieldOne should contain 2');
        },
        testMultiSetEvent: function () {
            var m = new Y.GalleryModel();
            m.on('change', function(ev) {
                if (ev.name) {
                    // The first call to setValues should not reach here,
                    // it should have been rejected at the multi-field level
                    A.isUndefined(ev.prevVal,'field should have been undefined');
                    if (ev.name === F1) {
                        A.areEqual(12, ev.newVal, 'fieldOne should be 11');
                    } else {
                        A.areEqual(33, ev.newVal, 'fieldTwo should be 33');
                    }
                    ev.newVal *= 2;
                } else {
                    if (ev.newVals[F1] * 2 === ev.newVals[F2] ) {
                        ev.halt();
                    }
                }
            },this);
            // this one should be rejected
            m.setValues({fieldOne:11, fieldTwo:22});

            A.isTrue(m.get(NEW),'modified record should still be new');
            A.isFalse(m.get(MOD),'modified record should still be marked as not modified');

            m.setValues({fieldOne:12, fieldTwo:33});

            A.isTrue(m.get(NEW),'modified record should still be new');
            A.isTrue(m.get(MOD),'modified record should now be marked modified');
            A.areEqual(24,m.getValue(F1), 'fieldOne should be twice the value set');
            A.areEqual(66,m.getValue(F2), 'fieldTwo should be twice the value set');

        },
        testConstructorSetValues: function () {
            var m = new Y.GalleryModel({values: {primaryKeyField:1, fieldOne:2, fieldTwo:3}, primaryKeys:PKF});

            A.areEqual(1, m.getValue(PKF), 'primaryKeyField should be 1');
            A.areEqual(2, m.getValue(F1), 'field one should be 2');
            A.areEqual(3, m.getValue(F2), 'field two should be 3');
            A.isTrue(m.get(PK + DOT + PKF), 'primaryKeyField should be a primaryKey');
            A.isFalse(m.get(MOD), 'record should not be marked as modified');
            A.isTrue(m.get(NEW), 'record should be new');


        },
        testSimpleUndo: function () {
            var SU = Y.Base.create('simple-undo-model', Y.GalleryModel, [Y.GalleryModelSimpleUndo]),
                m = new SU({values: {fieldOne:1, fieldTwo:2, fieldThree:3 }});

            A.areEqual(1, m.getValue(F1), 'field one should be 1');
            A.areEqual(2, m.getValue(F2), 'field two should be 2');
            A.areEqual(3, m.getValue(F3), 'field three should be 3');

            m.setValues({fieldOne:11, fieldTwo:22, fieldThree:33})
            m.setValue(F2,222);
            A.areEqual(11, m.getValue(F1), 'field one should be 11');
            A.areEqual(222, m.getValue(F2), 'field two should be 222');
            A.areEqual(33, m.getValue(F3), 'field three should be 33');

            m.undo(F1);
            A.areEqual(1, m.getValue(F1), 'field one should be 1');
            A.areEqual(222, m.getValue(F2), 'field two should be 222');
            A.areEqual(33, m.getValue(F3), 'field three should be 33');
            // a second undo on the same field should have no effect
            m.undo(F1);
            A.areEqual(1, m.getValue(F1), 'field one should be 1');
            A.areEqual(222, m.getValue(F2), 'field two should be 222');
            A.areEqual(33, m.getValue(F3), 'field three should be 33');

            m.undo();

            A.areEqual(1, m.getValue(F1), 'field one should be 1');
            A.areEqual(22, m.getValue(F2), 'field two should be 22');
            A.areEqual(3, m.getValue(F3), 'field three should be 3');
            // a second undo all should have no effect
            m.undo();
            A.areEqual(1, m.getValue(F1), 'field one should be 1');
            A.areEqual(22, m.getValue(F2), 'field two should be 22');
            A.areEqual(3, m.getValue(F3), 'field three should be 3');
        },
        testSimpleUndoLoad: function () {
            var test = this,
                SU = Y.Base.create('simple-undo-model', SynchedModel, [Y.GalleryModelSimpleUndo]),
                m = new SU({values: {fieldOne:1, fieldTwo:2, fieldThree:3 }});

            A.areEqual(1, m.getValue(F1), 'field one should be 1');
            A.areEqual(2, m.getValue(F2), 'field two should be 2');
            A.areEqual(3, m.getValue(F3), 'field three should be 3');

            m.setValues({fieldOne:11, fieldTwo:22, fieldThree:33})
            m.setValue(F2,222);
            A.areEqual(11, m.getValue(F1), 'field one should be 11');
            A.areEqual(222, m.getValue(F2), 'field two should be 222');
            A.areEqual(33, m.getValue(F3), 'field three should be 33');

            m.load({primaryKeyField: PKV}, function(err, response) {
                test.resume(function() {
                    A.isNull(err, 'there should be no error');
                    A.areEqual(1,m.getValue(F1), 'fieldOne should be 1');
                    A.areEqual(2,m.getValue(F2), 'fieldTwo should be 2');
                    A.isUndefined(m.getValue(F3), 'fieldThree should be undefined');
                    A.areEqual(PKV,m.getValue(PKF), 'field PrimaryKeyField should be PrimaryKeyValue');

                    // undo should have no effect
                    m.undo();

                    A.areEqual(1,m.getValue(F1), 'fieldOne should be 1');
                    A.areEqual(2,m.getValue(F2), 'fieldTwo should be 2');
                    A.isUndefined(m.getValue(F3), 'fieldThree should be undefined');
                    A.areEqual(PKV,m.getValue(PKF), 'field PrimaryKeyField should be PrimaryKeyValue');
                });
            });
            this.wait(function () {
                A.fail('model should be loaded');
            },1000);


        },
        testMultiRecord: function() {
            var MR = Y.Base.create('multi-record', Y.GalleryModel, [Y.GalleryModelMultiRecord, Y.GalleryModelSortedMultiRecord]),
                m = new MR({primaryKeys: PKF}),
                i, curr, prev = 0;

            for (i = 0; i < 20; i += 1) {
                m.add({primaryKeyField: Math.floor(Math.random() * 9999), fieldOne:i});
            }
            m.each(function() {
                curr = m.getValue(PKF);
                A.isTrue(curr >= prev, 'each element should be greater than the previous: ' + curr + ' >= ' +  prev);
                prev = curr;
            });

            m.set('sortDir', 'desc');
            prev = 1000000;
            m.each(function() {
                curr = m.getValue(PKF);
                A.isTrue(curr <= prev, 'each element should now be smaller than the previous ' + curr + ' <= ' +  prev);
                prev = curr;
            });

            m.setAttrs({sortField:F1, sortDir:'asc'});
            for (i = 0; i < 20; i += 1) {
                m.set('index',i);
                A.areEqual(i, m.getValue(F1), 'values should be successive');
                A.areEqual(i, m.get('index'), 'index should be successive');
            };
            A.areEqual(20,m.size(),'it should have 20 elements');
            m.empty();
            A.areEqual(0,m.size(),'it should now be empty');

            for (i = 0; i < 20; i += 2) {
                m.add({primaryKeyField: Math.floor(Math.random() * 9999), fieldOne:i});
            }
            m.set('index',5);
            m.setValue(F1, 5);
            // A.areEqual(3,m.get('index'), 'current record should now be at position 3')
            prev = 0;
            m.each(function() {
                curr = m.getValue(F1);
                A.isTrue(curr >= prev, 'each element should be greater than the previous: ' + curr + ' >= ' +  prev);
                prev = curr;
            });
            A.areEqual(2, m.find(4, false), 'index of record with fieldOne 4 should be 2');
            A.areNotEqual(2, m.get('index'), 'model should not be positioned on this record (by index)')
            A.areNotEqual(4, m.getValue(F1), 'model should not be positioned on this record (by value)');
            A.isNull(m.find(11), 'there should be no odd values in the model except 5 (see above) ');
            A.areEqual(3, m.find(5), 'record with fieldOne 5 should be at position 3');
            A.areEqual(5, m.getValue(F1), 'Record should be positioned on it');
        }

    }));
	Y.Test.Runner.add(suite);

},'', { requires: [ 'test', 'base-build' ] });
