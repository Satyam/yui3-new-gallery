YUI.add('fw-tree-tests', function(Y) {
    var A = Y.Assert,
        TV = Y.Base.create(
            'fw-test',
            Y.FlyweightTreeManager,
            [],
            {
                initializer: function (config) {
                    this._loadConfig(config.tree);
                }
            }
        ),
        LABEL = 'label',
        ID = 'id',

        treeDef = [
           {
                label: 'label 0',
                expanded: false,
                children: [
                    {
                        label: 'label 0-0',
                        expanded: false,
                        children: [
                            'label 0-0-0',
                            'label 0-0-1',
                            'label 0-0-2'
                        ]
                    },
                    {
                        label: 'label 0-1',
                        expanded: false,
                        children: [
                            'label 0-1-0',
                            'label 0-1-1',
                            'label 0-1-2'
                        ]
                    },
                    {
                        label: 'label 0-2',
                        expanded: false,
                        children: [
                            'label 0-2-0',
                            'label 0-2-1',
                            'label 0-2-2'
                        ]
                    },
                ]
            },
            {
                label: 'label 1',
                expanded: false,
                children: [
                    {
                        label: 'label 1-0',
                        expanded: false,
                        children: [
                            'label 1-0-0',
                            'label 1-0-1',
                            'label 1-0-2'
                        ]
                    },
                    {
                        label: 'label 1-1',
                        expanded: false,
                        children: [
                            'label 1-1-0',
                            'label 1-1-1',
                            'label 1-1-2'
                        ]
                    },
                    {
                        label: 'label 1-2',
                        expanded: false,
                        children: [
                            'label 1-2-0',
                            'label 1-2-1',
                            'label 1-2-2'
                        ]
                    },
                ]
            },
            {
                label: 'label 2',
                expanded: false,
                children: [
                    {
                        label: 'label 2-0',
                        expanded: false,
                        children: [
                            'label 2-0-0',
                            'label 2-0-1',
                            'label 2-0-2'
                        ]
                    },
                    {
                        label: 'label 2-1',
                        expanded: false,
                        children: [
                            'label 2-1-0',
                            'label 2-1-1',
                            'label 2-1-2'
                        ]
                    },
                    {
                        label: 'label 2-2',
                        expanded: false,
                        children: [
                            'label 2-2-0',
                            'label 2-2-1',
                            'label 2-2-2'
                        ]
                    },
                ]
            }
        ],

        suite = new Y.Test.Suite("FWTreeView Test Suite");

    suite.add(new Y.Test.Case({
        name: "FWTreeView",
        'Test dynamic Loading': function () {
            var node, other, tv = new TV({
                tree: [
                    'label 0',
                    'label 1',
                    'label 2'
                ],
                dynamicLoader: function (node, callback) {
                    var i, branch = [],
                       label = node.get(LABEL);

                    for (i = 0; i < 3; i += 1) {
                        branch[i] = label + '-' + i;
                    }

                    callback(branch);
                }
            });
            tv.render();
            tv.getNodeBy(LABEL,'label 1').expand().release();
            tv.getNodeBy(LABEL,'label 1-1').expand().release();
            tv.getNodeBy(LABEL,'label 1-1-0').expand().release();
            tv.getNodeBy(LABEL,'label 2').expand().release();
            node = tv.getNodeBy(LABEL,'label 1-1-0-1');
            A.areEqual(3, node.get('depth'), 'node 1-1-0-1 should be at depth 3');
            A.areEqual('label 1-1-0-1', node.get(LABEL), 'node should be labeled label 1-1-0-1');
            other = node.getNextSibling();
            A.areEqual(3, other.get('depth'), 'node 1-1-0-2 should be at depth 3');
            A.areEqual('label 1-1-0-2', other.get(LABEL), 'node should be labeled label 1-1-0-2');
            A.isNull(other.getNextSibling(),' there should be no next to 1-1-0-2');
            other.release();
            other = node.getPreviousSibling();
            A.areEqual(3, other.get('depth'), 'node 1-1-0-0 should be at depth 3');
            A.areEqual('label 1-1-0-0', other.get(LABEL), 'node should be labeled label 1-1-0-0');
            A.isNull(other.getPreviousSibling(),' there should be no next to 1-1-0-0');
            other.release();
            other = node.getParent();
            A.areEqual(2, other.get('depth'), 'node 1-1-0 should be at depth 2');
            A.areEqual('label 1-1-0', other.get(LABEL), 'node should be labeled label 1-1-0');
            other.release();
            node.release();
            tv.destroy();
        },
        'Test focused node gets expanded': function () {

            var tv = new TV({tree: treeDef});
            tv.render('#container');
            tv.forSomeNodes(function (node) {
                A.isFalse(node.hasChildren() && node.get('expanded'), 'All nodes should be collapsed:' + node.get(LABEL));
            });
            var focusedTest = function (label) {
                var focusedNode = tv.getNodeBy(LABEL, label);
                tv.set('focusedNode', focusedNode);

                var node , ancestor = focusedNode , ancestry = [];
                while (ancestor) {
                    node = ancestor;
                    ancestor = ancestor.getParent();
                    node.release();
                    if (!ancestor) {
                        break;
                    }
                    ancestry.push(ancestor.get(ID));
                }
                tv.forSomeNodes(function (node) {
                    if (ancestry.indexOf(node.get(ID)) !== -1) {
                        A.isTrue(node.get('expanded'), 'Ancestors of ' + label + ' should be expanded: ' + node.get(LABEL));
                    } else {
                        A.isFalse(node.hasChildren() && node.get('expanded'), 'Only the ancestors of ' + label + ' should be expanded:' + node.get(LABEL));
                    }
                });
                focusedNode.release();
            };
            focusedTest('label 1-1-1');
            tv.collapseAll();
            focusedTest('label 1-1');
            tv.destroy();

        },
        'Requesting a held node should return the same reference': function () {
            var tv = new TV({tree:treeDef}),
                node = tv.getNodeBy(LABEL, 'label 1'),
                other = tv.getNodeBy(LABEL, 'label 1');

            A.areSame(node, other, 'Node references should be the same');
            node.release();
            other.release();
            tv.destroy();
        },
        'is depth correct': function () {
            var tv = new TV({tree:treeDef});
            tv.forSomeNodes(function(node, depth) {
                A.areEqual(depth, node.get('depth'), 'depth should be equal: ' + node.get(LABEL));
            });
            tv.destroy();

        }
    }));
	Y.Test.Runner.add(suite);

},'', { requires: ['gallery-flyweight-tree', 'test', 'base-build', 'node-event-simulate' ] });
