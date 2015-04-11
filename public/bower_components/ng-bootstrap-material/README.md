# ng-bootstrap-material
Let Angular play nicely with [bootstrap-material-design](https://github.com/FezVrasta/bootstrap-material-design)

ngBootstapMaterial, simple as it may be, provides glue between AngularJS and the [bootstrap-material-design](https://github.com/FezVrasta/bootstrap-material-design) theme. Normally, you'd need to call `$.material.init()` in a controller to enable the material design effects. However, due the multitude of DOM modifications the library makes, calling it will 'disconnect' any bindings your controller may have. To get around this you can wrap [bootstrap-material-design](https://github.com/FezVrasta/bootstrap-material-design)'s functions in compile directives.

The directives are:
`material-input`
`material-ripple`
`material-checkbox`
`material-radio`

Use like so:

`<input type="password" class="form-control floating-label" id="pass" placeholder="Password" ng-model="mypassword" material-input>`

And like magic, your model won't be unbound!

Install with

`bower install ng-bootstrap-material`
