YUI.add('treeview-tests', function(Y) {
    var A = Y.Assert,
        DOT = '.',


        suite = new Y.Test.Suite("FWTreeView Test Suite");

    suite.add(new Y.Test.Case({
        name: "FWTreeView",

        'Test focused node gets expanded': function () {

            var tv = new Y.FWTreeView({
               tree: [
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
                    }
               ]
            });
        tv.render('#container');
        tv.forSomeNodes(function (node) {
            A.isFalse(node.hasChildren() && node.get('expanded'), 'All nodes should be collapsed:' + node.get('label'));
        });
        var focusedTest = function (label) {
            var focusedNode = tv.getNodeBy('label', label);
            tv.set('focusedNode', focusedNode);

            var ancestor = focusedNode, ancestry = [];
            while ((ancestor = ancestor.getParent())) {
                ancestry.push(ancestor.get('id'));
            }
            tv.forSomeNodes(function (node) {
                if (ancestry.indexOf(node.get('id')) !== -1) {
                    A.isTrue(node.get('expanded'), 'Ancestors of ' + label + ' should be expanded: ' + node.get('label'));
                } else {
                    A.isFalse(node.hasChildren() && node.get('expanded'), 'Only the ancestors of ' + label + ' should be expanded:' + node.get('label'));
                }
            });
            focusedNode.release();
        };
        focusedTest('label 1-1-1');
        tv.collapseAll();
        focusedTest('label 1-1');
        tv.destroy();

    }}));
	Y.Test.Runner.add(suite);

},'', { requires: ['gallery-fwt-treeview', 'test', 'base-build' ] });
