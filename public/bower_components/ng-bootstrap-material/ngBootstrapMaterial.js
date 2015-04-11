'use strict';

angular.module('ngBootstrapMaterial', []).directive('materialInput', function() {
    return {
        compile: function(elem, attr, tr) {
          $.material.input(elem[0]);
        }
    };
}).directive('materialRipple', function() {
    return {
        compile: function(elem, attr, tr) {
          $.material.ripples(elem[0]);
        }
    };
}).directive('materialCheckbox', function() {
    return {
        compile: function(elem, attr, tr) {
          $.material.checkbox(elem[0]);
        }
    };
}).directive('materialRadio', function() {
    return {
        compile: function(elem, attr, tr) {
          $.material.radio(elem[0]);
        }
    };
});