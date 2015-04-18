ui-select add-on
=================

This ui-select add-on uses as the name implies the ui-select plugin to provide a select dropdown interface. [ui-select](https://github.com/angular-ui/ui-select) is used.

Installation
------------
The editor is an add-on to the Bootstrap decorator. To use it, just include
`bootstrape-ui-select.min.js`.

Easiest way is to install is with bower, this will also include dependencies:
```bash
$ bower install angular-schema-form-ui-select
```

You'll need to load a few additional files to use the editor:

**Be sure to load this projects files after you load angular schema form**

Example

```HTML
<script type="text/javascript" src="/bower_components/angular/angular.min.js"></script>
<script src="bower_components/angular-sanitize/angular-sanitize.min.js"></script>
<script src="bower_components/angular-translate/angular-translate.min.js"></script>
<script src='bower_components/angular-ui-select/dist/select.js'></script>
<script src="bower_components/tv4/tv4.js"></script>
<script src="bower_components/objectpath/lib/ObjectPath.js"></script>
<script src="bower_components/angular-schema-form/dist/schema-form.min.js"></script>
<script src="bower_components/angular-schema-form/dist/bootstrap-decorator.min.js"></script>
<script src="schema-form-strapselect.js"></script>
```

When you create your module, be sure to depend on this project's module as well.

```javascript
angular.module('yourModule', ['schemaForm']);
```

Usage
-----
The add-on adds a new form type, `uiselect`, and a new default mapping.

| Schema             |   Default Form type  |
|:-------------------|:------------:|
| "type": "string" and "format": "uiselect"   |   uiselect   |
| "type": "array" and "format": "uiselect"    |   uimultiselect   |

### Schema Definintion
```javascript
person_list: {
  title: 'Person List',
  type: 'string',
  format: 'uiselect',
  items: [
    { value: '1', label: 'Person 1' },
    { value: '2', label: 'Person 2' }
  ]
},
persons_list: {
  title: 'Persons List',
  type: 'array',
  format: 'uiselect',
  items: [
    { value: '1', label: 'Person 1' },
    { value: '2', label: 'Person 2' },
    { value: '3', label: 'Person 3' }
  ]
}
```

Options
-------
The add-on provides some of the options available in ui-select: 

* To specify a class for select
```javascript
{
  key: 'person_list',
  placeholder: 'Some Place Holder', //default will translate placeholder.select
  options: {
    uiClass: 'short_select'
  }
}
```
* To update the list dynamically on change of the search term.

```javascript
{
       key: 'dynamicmultiselect',
       options: {
         uiClass: 'short',
         refreshDelay: 100,
         callback: $scope.refreshSelect
       }
      },
```

* To use the tagging feature of ui select (allowing new values to be added) - see full description [here](https://github.com/angular-ui/ui-select/wiki/ui-select)
```javascript
{
  key: 'person_list',
  placeholder: 'Some Place Holder', //default will translate placeholder.select
  options : {
          tagging: tagFunction ,
          taggingLabel: '(new)',
          taggingTokens: 'SPACE|ENTER|,'
  }
}
```

* To use the grouping feature of ui-select the grouping attribute or function can be declared like this. 
* Note that at the present time grouping is not supported at the same time as tagging as there is a bug in the ui select library.

```javascript
     {
       key: 'another',
       options:{
          groupBy : 'label', //Add the name of the attribute here
       }
     }
```

* If a description field is declared in the schema then this will be shown in the drop-down list. 

* searchDescriptions can be turned on and off - for example:
  - If description is provided for context, search may not be desirable due to short / common words / repetition between items.
  - If the description is used for synonyms of the label, search is necessary.

```javascript
     {
       key: 'another',
       options:{
          searchDescriptions : true
       }
     }
```