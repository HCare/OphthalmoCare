angular.module('schemaForm').config(
['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
  function(schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider) {

    /*var tagsinput = function(name, schema, options) {
      if (schema.type === 'tagsinput') {
        var f = schemaFormProvider.stdFormObj(name, schema, options);
        f.key  = options.path;
        f.type = 'tagsinput';
        options.lookup[sfPathProvider.stringify(options.path)] = f;
        return f;
      }
    };

    schemaFormProvider.defaults.unshift(tagsinput);*/

    //Add to the bootstrap directive
    schemaFormDecoratorsProvider.addMapping(
      'bootstrapDecorator',
      'tagsinput',
      '/lib/angular-schema-form-tagsinput/src/tagsinput.html'
    );
    schemaFormDecoratorsProvider.createDirective(
      'tagsinput',
      '/lib/angular-schema-form-tagsinput/src/tagsinput.html'
    );
  }
]);
