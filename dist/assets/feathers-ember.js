/* jshint ignore:start */

/* jshint ignore:end */

define('feathers-ember/adapters/application', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].RESTAdapter.extend({
    host: 'http://localhost:3030',
    namespace: 'api',
    authorizer: 'authorizer:application',
    // defaultSerializer: 'feathers-serializer',
    defaultSerializer: '-default'

  });
  // loopback
  // host: 'http://localhost:3000',
  // namespace: 'api',
  // defaultSerializer: 'JSONSerializer'

});
define('feathers-ember/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'feathers-ember/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  var App;

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('feathers-ember/authenticators/oauth2', ['exports', 'ember-simple-auth/authenticators/oauth2-password-grant'], function (exports, OAuth2PasswordGrant) {

  'use strict';

  exports['default'] = OAuth2PasswordGrant['default'].extend({
    // serverTokenEndpoint: 'http://localhost:3030/api/auth/local',
    // jwt
    // serverTokenEndpoint: 'http://localhost:3030/api/auth/token',
    serverTokenEndpoint: 'http://localhost:3030/auth/pass',

    // loopback
    // serverTokenEndpoint: 'http://localhost:3000/oauth/authorize',
    clientId: "ember-client"
  });

});
define('feathers-ember/authorizers/application', ['exports', 'ember-simple-auth/authorizers/oauth2-bearer'], function (exports, OAuth2Bearer) {

	'use strict';

	exports['default'] = OAuth2Bearer['default'].extend();

});
define('feathers-ember/components/flash-message', ['exports', 'ember-cli-flash/components/flash-message'], function (exports, flash_message) {

	'use strict';



	exports.default = flash_message.default;

});
define('feathers-ember/controllers/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var inject = Ember['default'].inject;

  exports['default'] = Ember['default'].Controller.extend({
    session: inject.service('session'),
    // sessionAccount: inject.service('session-account'),

    actions: {
      invalidateSession: function invalidateSession() {
        this.get('session').invalidate();
      }
    }
  });

});
define('feathers-ember/controllers/array', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('feathers-ember/controllers/login', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var inject = Ember['default'].inject;
  var set = Ember['default'].set;

  exports['default'] = Ember['default'].Controller.extend({

    session: inject.service('session'),
    flashMessages: inject.service(),

    email: '',
    password: '',

    actions: {
      authenticate: function authenticate() {
        var _this = this;

        var data = this.getProperties('email', 'password');
        var flashMessages = this.get('flashMessages');
        this.get('session').authenticate('authenticator:oauth2', data.email, data.password, 'User').then(function (response) {
          // set('session.data.authenticated.token', response.token);
          flashMessages.success('You are loged in');
          console.log(_this.get('session').data.authenticated.token);
        })['catch'](function (error) {
          var errorMsg = error.message ? error.message : error;
          errorMsg = error.responseJSON ? error.responseJSON.message : errorMsg;
          flashMessages.danger(errorMsg);
          console.error("Error:", errorMsg || "Login error");
        });
      }
    }
  });

});
define('feathers-ember/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('feathers-ember/controllers/register', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var inject = Ember['default'].inject;

  exports['default'] = Ember['default'].Controller.extend({

    flashMessages: inject.service(),

    actions: {
      registerUser: function registerUser() {
        var _this = this;

        var user = this.get('model');
        var flashMessages = this.get('flashMessages');
        user.save().then(function () {
          flashMessages.success('User created');
          _this.transitionTo('index');
        })['catch'](function (error) {
          flashMessages.danger(error.responseJSON.message);
          console.error(JSON.stringify(error.responseJSON));
        });
      }
    }
  });

});
define('feathers-ember/flash/object', ['exports', 'ember-cli-flash/flash/object'], function (exports, object) {

	'use strict';



	exports.default = object.default;

});
define('feathers-ember/initializers/app-version', ['exports', 'feathers-ember/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;
  var registered = false;

  exports['default'] = {
    name: 'App Version',
    initialize: function initialize(container, application) {
      if (!registered) {
        var appName = classify(application.toString());
        Ember['default'].libraries.register(appName, config['default'].APP.version);
        registered = true;
      }
    }
  };

});
define('feathers-ember/initializers/ember-simple-auth', ['exports', 'ember', 'feathers-ember/config/environment', 'ember-simple-auth/configuration', 'ember-simple-auth/initializers/setup-session', 'ember-simple-auth/initializers/setup-session-service'], function (exports, Ember, ENV, Configuration, setupSession, setupSessionService) {

  'use strict';

  exports['default'] = {
    name: 'ember-simple-auth',
    initialize: function initialize(registry) {
      var config = ENV['default']['ember-simple-auth'] || {};
      config.baseURL = ENV['default'].baseURL;
      Configuration['default'].load(config);

      setupSession['default'](registry);
      setupSessionService['default'](registry);
    }
  };

});
define('feathers-ember/initializers/export-application-global', ['exports', 'ember', 'feathers-ember/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (config['default'].exportApplicationGlobal !== false) {
      var value = config['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember['default'].String.classify(config['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('feathers-ember/initializers/flash-messages', ['exports', 'ember', 'feathers-ember/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  var deprecate = Ember['default'].deprecate;

  var merge = Ember['default'].assign || Ember['default'].merge;
  var INJECTION_FACTORIES_DEPRECATION_MESSAGE = '[ember-cli-flash] Future versions of ember-cli-flash will no longer inject the service automatically. Instead, you should explicitly inject it into your Route, Controller or Component with `Ember.inject.service`.';
  var addonDefaults = {
    timeout: 3000,
    extendedTimeout: 0,
    priority: 100,
    sticky: false,
    showProgress: false,
    type: 'info',
    types: ['success', 'info', 'warning', 'danger', 'alert', 'secondary'],
    injectionFactories: ['route', 'controller', 'view', 'component'],
    preventDuplicates: false
  };

  function initialize() {
    var application = arguments[1] || arguments[0];

    var _ref = config['default'] || {};

    var flashMessageDefaults = _ref.flashMessageDefaults;

    var _ref2 = flashMessageDefaults || [];

    var injectionFactories = _ref2.injectionFactories;

    var options = merge(addonDefaults, flashMessageDefaults);
    var shouldShowDeprecation = !(injectionFactories && injectionFactories.length);

    application.register('config:flash-messages', options, { instantiate: false });
    application.inject('service:flash-messages', 'flashMessageDefaults', 'config:flash-messages');

    deprecate(INJECTION_FACTORIES_DEPRECATION_MESSAGE, shouldShowDeprecation, {
      id: 'ember-cli-flash.deprecate-injection-factories',
      until: '2.0.0'
    });

    options.injectionFactories.forEach(function (factory) {
      application.inject(factory, 'flashMessages', 'service:flash-messages');
    });
  }

  exports['default'] = {
    name: 'flash-messages',
    initialize: initialize
  };

});
define('feathers-ember/instance-initializers/ember-simple-auth', ['exports', 'ember-simple-auth/instance-initializers/setup-session-restoration'], function (exports, setupSessionRestoration) {

  'use strict';

  exports['default'] = {
    name: 'ember-simple-auth',
    initialize: function initialize(instance) {
      setupSessionRestoration['default'](instance);
    }
  };

});
define('feathers-ember/models/message', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  var attr = DS['default'].attr;
  var belongsTo = DS['default'].belongsTo;

  exports['default'] = DS['default'].Model.extend({
    text: attr('string'),
    owner: belongsTo('user')
  });

});
define('feathers-ember/models/user', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    email: DS['default'].attr('string'),
    password: DS['default'].attr('string')
  });

});
define('feathers-ember/router', ['exports', 'ember', 'feathers-ember/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.route('login');
    this.route('users-list');
    this.route('register');
    this.route('messages');
  });

  exports['default'] = Router;

});
define('feathers-ember/routes/application', ['exports', 'ember-simple-auth/mixins/application-route-mixin', 'ember'], function (exports, ApplicationRouteMixin, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend(ApplicationRouteMixin['default'], //To handle authenticationSucceeded and invalidationSucceeded events
	{});

});
define('feathers-ember/routes/login', ['exports', 'ember', 'ember-simple-auth/mixins/unauthenticated-route-mixin'], function (exports, Ember, UnauthenticatedRouteMixin) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend(UnauthenticatedRouteMixin['default'], {});

});
define('feathers-ember/routes/messages', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin', 'ember'], function (exports, AuthenticatedRouteMixin, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(AuthenticatedRouteMixin['default'], //Only authenticated users
  {
    model: function model() {
      return this.store.findAll('message');
    }
  });

});
define('feathers-ember/routes/register', ['exports', 'ember', 'ember-simple-auth/mixins/unauthenticated-route-mixin'], function (exports, Ember, UnauthenticatedRouteMixin) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(UnauthenticatedRouteMixin['default'], {
    model: function model() {
      return this.store.createRecord('user');
    },

    actions: {
      redirect: function redirect(route) {
        this.transitionTo(route);
      }
    }
  });

});
define('feathers-ember/routes/users-list', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin', 'ember'], function (exports, AuthenticatedRouteMixin, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(AuthenticatedRouteMixin['default'], //Only authenticated users
  {
    model: function model() {
      return this.store.findAll('user');
    }
  });

});
define('feathers-ember/services/flash-messages', ['exports', 'ember-cli-flash/services/flash-messages'], function (exports, flash_messages) {

	'use strict';



	exports.default = flash_messages.default;

});
define('feathers-ember/services/session', ['exports', 'ember-simple-auth/services/session'], function (exports, SessionService) {

	'use strict';

	exports['default'] = SessionService['default'];

});
define('feathers-ember/session-stores/application', ['exports', 'ember-simple-auth/session-stores/adaptive'], function (exports, Adaptive) {

	'use strict';

	exports['default'] = Adaptive['default'].extend();

});
define('feathers-ember/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, get = hooks.get, inline = hooks.inline;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          set(env, context, "flash", blockArguments[0]);
          inline(env, morph0, context, "flash-message", [], {"flash": get(env, context, "flash")});
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("div");
        dom.setAttribute(el1,"class","container");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  \n");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, inline = hooks.inline, get = hooks.get, block = hooks.block, content = hooks.content;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(element0,1,1);
        var morph1 = dom.createMorphAt(element0,3,3);
        var morph2 = dom.createMorphAt(element0,5,5);
        inline(env, morph0, context, "partial", ["navbar"], {});
        block(env, morph1, context, "each", [get(env, context, "flashMessages.queue")], {}, child0, null);
        content(env, morph2, context, "outlet");
        return fragment;
      }
    };
  }()));

});
define('feathers-ember/templates/index', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Home Page");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        return fragment;
      }
    };
  }()));

});
define('feathers-ember/templates/login', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"class","btn btn-lg btn-info btn-block");
          dom.setAttribute(el1,"role","button");
          dom.setAttribute(el1,"href","");
          var el2 = dom.createTextNode("Register");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("form");
        dom.setAttribute(el1,"class","form-signin");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h2");
        dom.setAttribute(el2,"class","form-signin-heading");
        var el3 = dom.createTextNode("Please login");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("label");
        dom.setAttribute(el2,"for","inputEmail");
        dom.setAttribute(el2,"class","sr-only");
        var el3 = dom.createTextNode("Email address");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("label");
        dom.setAttribute(el2,"for","inputPassword");
        dom.setAttribute(el2,"class","sr-only");
        var el3 = dom.createTextNode("Password");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"class","btn btn-lg btn-primary btn-block");
        dom.setAttribute(el2,"type","submit");
        var el3 = dom.createTextNode("Login");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("br");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, get = hooks.get, inline = hooks.inline, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [1]);
        var morph0 = dom.createMorphAt(element0,5,5);
        var morph1 = dom.createMorphAt(element0,9,9);
        var morph2 = dom.createMorphAt(fragment,4,4,contextualElement);
        element(env, element0, context, "action", ["authenticate"], {"on": "submit"});
        inline(env, morph0, context, "input", [], {"placeholder": "Email address", "value": get(env, context, "email"), "class": "form-control", "type": "email", "id": "inputEmail"});
        inline(env, morph1, context, "input", [], {"placeholder": "Password", "value": get(env, context, "password"), "class": "form-control", "type": "password", "id": "inputPassword"});
        block(env, morph2, context, "link-to", ["register"], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('feathers-ember/templates/messages', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),0,0);
          var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),0,0);
          set(env, context, "message", blockArguments[0]);
          content(env, morph0, context, "message.firstName");
          content(env, morph1, context, "message.owner.email");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Messages");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("table");
        dom.setAttribute(el1,"class","table table-bordered table-striped");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("thead");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Text");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Owner email");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tbody");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [2, 3]),1,1);
        block(env, morph0, context, "each", [get(env, context, "model")], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('feathers-ember/templates/navbar', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("Feather & Ember test");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child1 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("      ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("p");
          dom.setAttribute(el1,"class","navbar-text pull-right");
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(dom.childAt(fragment, [1]),0,0);
          content(env, morph0, context, "sessionAcount.account.name");
          return fragment;
        }
      };
    }());
    var child2 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"href","");
          var el2 = dom.createTextNode("Home");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child3 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"href","");
          var el2 = dom.createTextNode("Users");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child4 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createElement("a");
          dom.setAttribute(el1,"href","");
          var el2 = dom.createTextNode("Mesagges");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          return fragment;
        }
      };
    }());
    var child5 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("              ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("a");
          var el3 = dom.createTextNode("Logout\n                ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          dom.setAttribute(el3,"class","glyphicon glyphicon-log-out");
          dom.setAttribute(el3,"aria-hidden","true");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n              ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, element = hooks.element;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1, 1]);
          element(env, element0, context, "action", ["invalidateSession"], {});
          return fragment;
        }
      };
    }());
    var child6 = (function() {
      var child0 = (function() {
        return {
          isHTMLBars: true,
          revision: "Ember@1.12.0",
          blockParams: 0,
          cachedFragment: null,
          hasRendered: false,
          build: function build(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createElement("a");
            dom.setAttribute(el1,"href","");
            var el2 = dom.createTextNode("Login\n              ");
            dom.appendChild(el1, el2);
            var el2 = dom.createElement("span");
            dom.setAttribute(el2,"class","glyphicon glyphicon-log-in");
            dom.setAttribute(el2,"aria-hidden","true");
            dom.appendChild(el1, el2);
            var el2 = dom.createTextNode("\n            ");
            dom.appendChild(el1, el2);
            dom.appendChild(el0, el1);
            return el0;
          },
          render: function render(context, env, contextualElement) {
            var dom = env.dom;
            dom.detectNamespace(contextualElement);
            var fragment;
            if (env.useFragmentCache && dom.canClone) {
              if (this.cachedFragment === null) {
                fragment = this.build(dom);
                if (this.hasRendered) {
                  this.cachedFragment = fragment;
                } else {
                  this.hasRendered = true;
                }
              }
              if (this.cachedFragment) {
                fragment = dom.cloneNode(this.cachedFragment, true);
              }
            } else {
              fragment = this.build(dom);
            }
            return fragment;
          }
        };
      }());
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 0,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createComment("");
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement) {
          var dom = env.dom;
          var hooks = env.hooks, block = hooks.block;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var morph0 = dom.createMorphAt(fragment,1,1,contextualElement);
          block(env, morph0, context, "link-to", ["login"], {"tagName": "li"}, child0, null);
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("nav");
        dom.setAttribute(el1,"class","navbar navbar-inverse");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","container-fluid");
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","navbar-header");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("button");
        dom.setAttribute(el4,"type","button");
        dom.setAttribute(el4,"class","navbar-toggle collapsed");
        dom.setAttribute(el4,"data-toggle","collapse");
        dom.setAttribute(el4,"data-target","#main-navbar");
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","sr-only");
        var el6 = dom.createTextNode("Toggle navigation");
        dom.appendChild(el5, el6);
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","icon-bar");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","icon-bar");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n        ");
        dom.appendChild(el4, el5);
        var el5 = dom.createElement("span");
        dom.setAttribute(el5,"class","icon-bar");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createComment("");
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("    ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","collapse navbar-collapse");
        dom.setAttribute(el3,"id","main-navbar");
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","nav navbar-nav navbar-right");
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n            ");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("      ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n    ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createComment(" /.navbar-collapse ");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n  ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createComment(" /.container-fluid ");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, block = hooks.block, get = hooks.get;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element1 = dom.childAt(fragment, [0, 1]);
        var element2 = dom.childAt(element1, [5, 1]);
        var morph0 = dom.createMorphAt(dom.childAt(element1, [1]),3,3);
        var morph1 = dom.createMorphAt(element1,3,3);
        var morph2 = dom.createMorphAt(element2,1,1);
        var morph3 = dom.createMorphAt(element2,3,3);
        var morph4 = dom.createMorphAt(element2,5,5);
        var morph5 = dom.createMorphAt(element2,7,7);
        block(env, morph0, context, "link-to", ["index"], {"class": "navbar-brand"}, child0, null);
        block(env, morph1, context, "if", [get(env, context, "session.isAuthenticated")], {}, child1, null);
        block(env, morph2, context, "link-to", ["index"], {"tagName": "li"}, child2, null);
        block(env, morph3, context, "link-to", ["users-list"], {"tagName": "li"}, child3, null);
        block(env, morph4, context, "link-to", ["messages"], {"tagName": "li"}, child4, null);
        block(env, morph5, context, "if", [get(env, context, "session.isAuthenticated")], {}, child5, child6);
        return fragment;
      }
    };
  }()));

});
define('feathers-ember/templates/register', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("form");
        dom.setAttribute(el1,"class","form-register");
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("h2");
        dom.setAttribute(el2,"class","form-register-heading");
        var el3 = dom.createTextNode("Please register");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("label");
        dom.setAttribute(el2,"for","inputEmail");
        dom.setAttribute(el2,"class","sr-only");
        var el3 = dom.createTextNode("Email address");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("label");
        dom.setAttribute(el2,"for","inputPassword");
        dom.setAttribute(el2,"class","sr-only");
        var el3 = dom.createTextNode("Password");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createComment("");
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n  ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("button");
        dom.setAttribute(el2,"class","btn btn-lg btn-primary btn-block");
        dom.setAttribute(el2,"type","submit");
        var el3 = dom.createTextNode("Register");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, element = hooks.element, get = hooks.get, inline = hooks.inline;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var element0 = dom.childAt(fragment, [0]);
        var morph0 = dom.createMorphAt(element0,5,5);
        var morph1 = dom.createMorphAt(element0,9,9);
        element(env, element0, context, "action", ["registerUser"], {"on": "submit"});
        inline(env, morph0, context, "input", [], {"placeholder": "Email address", "value": get(env, context, "model.email"), "class": "form-control", "type": "email", "id": "inputEmail"});
        inline(env, morph1, context, "input", [], {"placeholder": "Password", "value": get(env, context, "model.password"), "class": "form-control", "type": "password", "id": "inputPassword"});
        return fragment;
      }
    };
  }()));

});
define('feathers-ember/templates/users-list', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      return {
        isHTMLBars: true,
        revision: "Ember@1.12.0",
        blockParams: 1,
        cachedFragment: null,
        hasRendered: false,
        build: function build(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("        ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("tr");
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n            ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("td");
          var el3 = dom.createComment("");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n        ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        render: function render(context, env, contextualElement, blockArguments) {
          var dom = env.dom;
          var hooks = env.hooks, set = hooks.set, content = hooks.content;
          dom.detectNamespace(contextualElement);
          var fragment;
          if (env.useFragmentCache && dom.canClone) {
            if (this.cachedFragment === null) {
              fragment = this.build(dom);
              if (this.hasRendered) {
                this.cachedFragment = fragment;
              } else {
                this.hasRendered = true;
              }
            }
            if (this.cachedFragment) {
              fragment = dom.cloneNode(this.cachedFragment, true);
            }
          } else {
            fragment = this.build(dom);
          }
          var element0 = dom.childAt(fragment, [1]);
          var morph0 = dom.createMorphAt(dom.childAt(element0, [1]),0,0);
          var morph1 = dom.createMorphAt(dom.childAt(element0, [3]),0,0);
          var morph2 = dom.createMorphAt(dom.childAt(element0, [5]),0,0);
          set(env, context, "user", blockArguments[0]);
          content(env, morph0, context, "user.firstName");
          content(env, morph1, context, "user.lastName");
          content(env, morph2, context, "user.email");
          return fragment;
        }
      };
    }());
    return {
      isHTMLBars: true,
      revision: "Ember@1.12.0",
      blockParams: 0,
      cachedFragment: null,
      hasRendered: false,
      build: function build(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("h1");
        var el2 = dom.createTextNode("Users");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n\n");
        dom.appendChild(el0, el1);
        var el1 = dom.createElement("table");
        dom.setAttribute(el1,"class","table table-bordered table-striped");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("thead");
        var el3 = dom.createTextNode("\n      ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("tr");
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("First Name");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("Last Name");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n          ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("th");
        var el5 = dom.createTextNode("E-mail");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n      ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("tbody");
        var el3 = dom.createTextNode("\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        var el1 = dom.createTextNode("\n");
        dom.appendChild(el0, el1);
        return el0;
      },
      render: function render(context, env, contextualElement) {
        var dom = env.dom;
        var hooks = env.hooks, get = hooks.get, block = hooks.block;
        dom.detectNamespace(contextualElement);
        var fragment;
        if (env.useFragmentCache && dom.canClone) {
          if (this.cachedFragment === null) {
            fragment = this.build(dom);
            if (this.hasRendered) {
              this.cachedFragment = fragment;
            } else {
              this.hasRendered = true;
            }
          }
          if (this.cachedFragment) {
            fragment = dom.cloneNode(this.cachedFragment, true);
          }
        } else {
          fragment = this.build(dom);
        }
        var morph0 = dom.createMorphAt(dom.childAt(fragment, [2, 3]),1,1);
        block(env, morph0, context, "each", [get(env, context, "model")], {}, child0, null);
        return fragment;
      }
    };
  }()));

});
define('feathers-ember/tests/adapters/application.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/application.js should pass jshint', function() { 
    ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/authenticators/oauth2.jshint', function () {

  'use strict';

  module('JSHint - authenticators');
  test('authenticators/oauth2.js should pass jshint', function() { 
    ok(true, 'authenticators/oauth2.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/authorizers/application.jshint', function () {

  'use strict';

  module('JSHint - authorizers');
  test('authorizers/application.js should pass jshint', function() { 
    ok(true, 'authorizers/application.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/controllers/application.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/application.js should pass jshint', function() { 
    ok(true, 'controllers/application.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/controllers/login.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/login.js should pass jshint', function() { 
    ok(false, 'controllers/login.js should pass jshint.\ncontrollers/login.js: line 3, col 17, \'set\' is defined but never used.\ncontrollers/login.js: line 19, col 16, \'response\' is defined but never used.\n\n2 errors'); 
  });

});
define('feathers-ember/tests/controllers/register.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/register.js should pass jshint', function() { 
    ok(true, 'controllers/register.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/helpers/ember-simple-auth', ['exports', 'ember-simple-auth/authenticators/test'], function (exports, Test) {

  'use strict';

  exports.authenticateSession = authenticateSession;
  exports.currentSession = currentSession;
  exports.invalidateSession = invalidateSession;

  var TEST_CONTAINER_KEY = 'authenticator:test';

  function ensureAuthenticator(app, container) {
    var authenticator = container.lookup(TEST_CONTAINER_KEY);
    if (!authenticator) {
      app.register(TEST_CONTAINER_KEY, Test['default']);
    }
  }

  function authenticateSession(app, sessionData) {
    var container = app.__container__;

    var session = container.lookup('service:session');
    ensureAuthenticator(app, container);
    session.authenticate(TEST_CONTAINER_KEY, sessionData);
    return wait();
  }

  ;

  function currentSession(app) {
    return app.__container__.lookup('service:session');
  }

  ;

  function invalidateSession(app) {
    var session = app.__container__.lookup('service:session');
    if (session.get('isAuthenticated')) {
      session.invalidate();
    }
    return wait();
  }

  ;

});
define('feathers-ember/tests/helpers/flash-message', ['ember', 'ember-cli-flash/flash/object'], function (Ember, FlashObject) {

	'use strict';

	var K = Ember['default'].K;

	FlashObject['default'].reopen({ init: K });

});
define('feathers-ember/tests/helpers/flash-message.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/flash-message.js should pass jshint', function() { 
    ok(true, 'helpers/flash-message.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/helpers/resolver', ['exports', 'ember/resolver', 'feathers-ember/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('feathers-ember/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/helpers/start-app', ['exports', 'ember', 'feathers-ember/app', 'feathers-ember/router', 'feathers-ember/config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('feathers-ember/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/models/message.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/message.js should pass jshint', function() { 
    ok(true, 'models/message.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/models/user.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/user.js should pass jshint', function() { 
    ok(true, 'models/user.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/routes/application.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/application.js should pass jshint', function() { 
    ok(true, 'routes/application.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/routes/login.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/login.js should pass jshint', function() { 
    ok(true, 'routes/login.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/routes/messages.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/messages.js should pass jshint', function() { 
    ok(true, 'routes/messages.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/routes/register.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/register.js should pass jshint', function() { 
    ok(true, 'routes/register.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/routes/users-list.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/users-list.js should pass jshint', function() { 
    ok(true, 'routes/users-list.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/services/session.jshint', function () {

  'use strict';

  module('JSHint - services');
  test('services/session.js should pass jshint', function() { 
    ok(true, 'services/session.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/test-helper', ['feathers-ember/tests/helpers/resolver', 'feathers-ember/tests/helpers/flash-message', 'ember-qunit'], function (resolver, __dep1__, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('feathers-ember/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/unit/adapters/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('adapter:application', 'Unit | Adapter | application', {
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var adapter = this.subject();
    assert.ok(adapter);
  });

});
define('feathers-ember/tests/unit/adapters/application-test.jshint', function () {

  'use strict';

  module('JSHint - unit/adapters');
  test('unit/adapters/application-test.js should pass jshint', function() { 
    ok(true, 'unit/adapters/application-test.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/unit/controllers/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

});
define('feathers-ember/tests/unit/controllers/application-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers');
  test('unit/controllers/application-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/application-test.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/unit/controllers/login-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

});
define('feathers-ember/tests/unit/controllers/login-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers');
  test('unit/controllers/login-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/login-test.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/unit/controllers/register-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('controller:register', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var controller = this.subject();
    assert.ok(controller);
  });

});
define('feathers-ember/tests/unit/controllers/register-test.jshint', function () {

  'use strict';

  module('JSHint - unit/controllers');
  test('unit/controllers/register-test.js should pass jshint', function() { 
    ok(true, 'unit/controllers/register-test.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/unit/models/message-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('message', 'Unit | Model | message', {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test('it exists', function (assert) {
    var model = this.subject();
    // var store = this.store();
    assert.ok(!!model);
  });

});
define('feathers-ember/tests/unit/models/message-test.jshint', function () {

  'use strict';

  module('JSHint - unit/models');
  test('unit/models/message-test.js should pass jshint', function() { 
    ok(true, 'unit/models/message-test.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/unit/models/user-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel('user', 'Unit | Model | user', {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test('it exists', function (assert) {
    var model = this.subject();
    // var store = this.store();
    assert.ok(!!model);
  });

});
define('feathers-ember/tests/unit/models/user-test.jshint', function () {

  'use strict';

  module('JSHint - unit/models');
  test('unit/models/user-test.js should pass jshint', function() { 
    ok(true, 'unit/models/user-test.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/unit/routes/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:application', 'Unit | Route | application', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('feathers-ember/tests/unit/routes/application-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/application-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/application-test.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/unit/routes/login-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:login', 'Unit | Route | login', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('feathers-ember/tests/unit/routes/login-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/login-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/login-test.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/unit/routes/messages-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:messages', 'Unit | Route | messages', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('feathers-ember/tests/unit/routes/messages-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/messages-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/messages-test.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/unit/routes/register-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:register', 'Unit | Route | register', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('feathers-ember/tests/unit/routes/register-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/register-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/register-test.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/unit/routes/users-list-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('route:users-list', 'Unit | Route | users list', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  ember_qunit.test('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });

});
define('feathers-ember/tests/unit/routes/users-list-test.jshint', function () {

  'use strict';

  module('JSHint - unit/routes');
  test('unit/routes/users-list-test.js should pass jshint', function() { 
    ok(true, 'unit/routes/users-list-test.js should pass jshint.'); 
  });

});
define('feathers-ember/tests/unit/services/session-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor('service:session', 'Unit | Service | session', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  // Replace this with your real tests.
  ember_qunit.test('it exists', function (assert) {
    var service = this.subject();
    assert.ok(service);
  });

});
define('feathers-ember/tests/unit/services/session-test.jshint', function () {

  'use strict';

  module('JSHint - unit/services');
  test('unit/services/session-test.js should pass jshint', function() { 
    ok(true, 'unit/services/session-test.js should pass jshint.'); 
  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('feathers-ember/config/environment', ['ember'], function(Ember) {
  var prefix = 'feathers-ember';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("feathers-ember/tests/test-helper");
} else {
  require("feathers-ember/app")["default"].create({"LOG_ACTIVE_GENERATION":true,"LOG_TRANSITIONS":true,"LOG_TRANSITIONS_INTERNAL":true,"LOG_VIEW_LOOKUPS":true,"name":"feathers-ember","version":"0.0.0.0e2df8d7"});
}

/* jshint ignore:end */
//# sourceMappingURL=feathers-ember.map