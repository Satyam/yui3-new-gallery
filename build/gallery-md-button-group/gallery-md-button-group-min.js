YUI.add("gallery-md-button-group",function(e,t){"use strict";var n=e.Lang,r="boundingBox",i="press",s="label";e.ButtonSeparator=e.Base.create("buttonSeparator",e.Widget,[],{BOUNDING_TEMPLATE:"<span />"},{}),e.ButtonGroup=e.Base.create("buttonGroup",e.Widget,[e.WidgetParent,e.MakeNode],{BOUNDING_TEMPLATE:"<fieldset />",initializer:function(){this.on("addChild",function(t){var n=t.child,r=e.WidgetChild;n&&(n instanceof e.Button||n instanceof e.ButtonSeparator?n.ancestor||(e.augment(n,r),n.addAttrs(n._protectAttrs(r.ATTRS)),r.constructor.apply(n)):t.preventDefault())})},bindUI:function(){this.on(["button:press","buttonToggle:press"],this._onButtonPress,this)},_onButtonPress:function(t){if(this.get("alwaysSelected")){var n=this.get("selection"),r=t.target;if(n===r||n instanceof e.ArrayList&&n.size()===1&&n.item(0)===r){t.preventDefault();return}}this.fire(i,{pressed:t.target})},_uiSetLabel:function(e){this._labelNode||(this.get(r).prepend(this._makeNode()),this._locateNodes()),this._labelNode.setContent(e)}},{_TEMPLATE:'<legend class="{c label}">{@ label}</legend>',_CLASS_NAMES:[s],_ATTRS_2_UI:{BIND:s,SYNC:s},_PUBLISH:{press:null},ATTRS:{label:{value:"",validator:n.isString},defaultChildType:{value:e.Button},alwaysSelected:{value:!1,validator:n.isBoolean}}})},"@VERSION@");
