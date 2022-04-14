
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.47.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var page = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
    	module.exports = factory() ;
    }(commonjsGlobal, (function () {
    var isarray = Array.isArray || function (arr) {
      return Object.prototype.toString.call(arr) == '[object Array]';
    };

    /**
     * Expose `pathToRegexp`.
     */
    var pathToRegexp_1 = pathToRegexp;
    var parse_1 = parse;
    var compile_1 = compile;
    var tokensToFunction_1 = tokensToFunction;
    var tokensToRegExp_1 = tokensToRegExp;

    /**
     * The main path matching regexp utility.
     *
     * @type {RegExp}
     */
    var PATH_REGEXP = new RegExp([
      // Match escaped characters that would otherwise appear in future matches.
      // This allows the user to escape special characters that won't transform.
      '(\\\\.)',
      // Match Express-style parameters and un-named parameters with a prefix
      // and optional suffixes. Matches appear as:
      //
      // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
      // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
      // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
      '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
    ].join('|'), 'g');

    /**
     * Parse a string for the raw tokens.
     *
     * @param  {String} str
     * @return {Array}
     */
    function parse (str) {
      var tokens = [];
      var key = 0;
      var index = 0;
      var path = '';
      var res;

      while ((res = PATH_REGEXP.exec(str)) != null) {
        var m = res[0];
        var escaped = res[1];
        var offset = res.index;
        path += str.slice(index, offset);
        index = offset + m.length;

        // Ignore already escaped sequences.
        if (escaped) {
          path += escaped[1];
          continue
        }

        // Push the current path onto the tokens.
        if (path) {
          tokens.push(path);
          path = '';
        }

        var prefix = res[2];
        var name = res[3];
        var capture = res[4];
        var group = res[5];
        var suffix = res[6];
        var asterisk = res[7];

        var repeat = suffix === '+' || suffix === '*';
        var optional = suffix === '?' || suffix === '*';
        var delimiter = prefix || '/';
        var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?');

        tokens.push({
          name: name || key++,
          prefix: prefix || '',
          delimiter: delimiter,
          optional: optional,
          repeat: repeat,
          pattern: escapeGroup(pattern)
        });
      }

      // Match any characters still remaining.
      if (index < str.length) {
        path += str.substr(index);
      }

      // If the path exists, push it onto the end.
      if (path) {
        tokens.push(path);
      }

      return tokens
    }

    /**
     * Compile a string to a template function for the path.
     *
     * @param  {String}   str
     * @return {Function}
     */
    function compile (str) {
      return tokensToFunction(parse(str))
    }

    /**
     * Expose a method for transforming tokens into the path function.
     */
    function tokensToFunction (tokens) {
      // Compile all the tokens into regexps.
      var matches = new Array(tokens.length);

      // Compile all the patterns before compilation.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] === 'object') {
          matches[i] = new RegExp('^' + tokens[i].pattern + '$');
        }
      }

      return function (obj) {
        var path = '';
        var data = obj || {};

        for (var i = 0; i < tokens.length; i++) {
          var token = tokens[i];

          if (typeof token === 'string') {
            path += token;

            continue
          }

          var value = data[token.name];
          var segment;

          if (value == null) {
            if (token.optional) {
              continue
            } else {
              throw new TypeError('Expected "' + token.name + '" to be defined')
            }
          }

          if (isarray(value)) {
            if (!token.repeat) {
              throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
            }

            if (value.length === 0) {
              if (token.optional) {
                continue
              } else {
                throw new TypeError('Expected "' + token.name + '" to not be empty')
              }
            }

            for (var j = 0; j < value.length; j++) {
              segment = encodeURIComponent(value[j]);

              if (!matches[i].test(segment)) {
                throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
              }

              path += (j === 0 ? token.prefix : token.delimiter) + segment;
            }

            continue
          }

          segment = encodeURIComponent(value);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
          }

          path += token.prefix + segment;
        }

        return path
      }
    }

    /**
     * Escape a regular expression string.
     *
     * @param  {String} str
     * @return {String}
     */
    function escapeString (str) {
      return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
    }

    /**
     * Escape the capturing group by escaping special characters and meaning.
     *
     * @param  {String} group
     * @return {String}
     */
    function escapeGroup (group) {
      return group.replace(/([=!:$\/()])/g, '\\$1')
    }

    /**
     * Attach the keys as a property of the regexp.
     *
     * @param  {RegExp} re
     * @param  {Array}  keys
     * @return {RegExp}
     */
    function attachKeys (re, keys) {
      re.keys = keys;
      return re
    }

    /**
     * Get the flags for a regexp from the options.
     *
     * @param  {Object} options
     * @return {String}
     */
    function flags (options) {
      return options.sensitive ? '' : 'i'
    }

    /**
     * Pull out keys from a regexp.
     *
     * @param  {RegExp} path
     * @param  {Array}  keys
     * @return {RegExp}
     */
    function regexpToRegexp (path, keys) {
      // Use a negative lookahead to match only capturing groups.
      var groups = path.source.match(/\((?!\?)/g);

      if (groups) {
        for (var i = 0; i < groups.length; i++) {
          keys.push({
            name: i,
            prefix: null,
            delimiter: null,
            optional: false,
            repeat: false,
            pattern: null
          });
        }
      }

      return attachKeys(path, keys)
    }

    /**
     * Transform an array into a regexp.
     *
     * @param  {Array}  path
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function arrayToRegexp (path, keys, options) {
      var parts = [];

      for (var i = 0; i < path.length; i++) {
        parts.push(pathToRegexp(path[i], keys, options).source);
      }

      var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

      return attachKeys(regexp, keys)
    }

    /**
     * Create a path regexp from string input.
     *
     * @param  {String} path
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function stringToRegexp (path, keys, options) {
      var tokens = parse(path);
      var re = tokensToRegExp(tokens, options);

      // Attach keys back to the regexp.
      for (var i = 0; i < tokens.length; i++) {
        if (typeof tokens[i] !== 'string') {
          keys.push(tokens[i]);
        }
      }

      return attachKeys(re, keys)
    }

    /**
     * Expose a function for taking tokens and returning a RegExp.
     *
     * @param  {Array}  tokens
     * @param  {Array}  keys
     * @param  {Object} options
     * @return {RegExp}
     */
    function tokensToRegExp (tokens, options) {
      options = options || {};

      var strict = options.strict;
      var end = options.end !== false;
      var route = '';
      var lastToken = tokens[tokens.length - 1];
      var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken);

      // Iterate over the tokens and create our regexp string.
      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];

        if (typeof token === 'string') {
          route += escapeString(token);
        } else {
          var prefix = escapeString(token.prefix);
          var capture = token.pattern;

          if (token.repeat) {
            capture += '(?:' + prefix + capture + ')*';
          }

          if (token.optional) {
            if (prefix) {
              capture = '(?:' + prefix + '(' + capture + '))?';
            } else {
              capture = '(' + capture + ')?';
            }
          } else {
            capture = prefix + '(' + capture + ')';
          }

          route += capture;
        }
      }

      // In non-strict mode we allow a slash at the end of match. If the path to
      // match already ends with a slash, we remove it for consistency. The slash
      // is valid at the end of a path match, not in the middle. This is important
      // in non-ending mode, where "/test/" shouldn't match "/test//route".
      if (!strict) {
        route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?';
      }

      if (end) {
        route += '$';
      } else {
        // In non-ending mode, we need the capturing groups to match as much as
        // possible by using a positive lookahead to the end or next path segment.
        route += strict && endsWithSlash ? '' : '(?=\\/|$)';
      }

      return new RegExp('^' + route, flags(options))
    }

    /**
     * Normalize the given path string, returning a regular expression.
     *
     * An empty array can be passed in for the keys, which will hold the
     * placeholder key descriptions. For example, using `/user/:id`, `keys` will
     * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
     *
     * @param  {(String|RegExp|Array)} path
     * @param  {Array}                 [keys]
     * @param  {Object}                [options]
     * @return {RegExp}
     */
    function pathToRegexp (path, keys, options) {
      keys = keys || [];

      if (!isarray(keys)) {
        options = keys;
        keys = [];
      } else if (!options) {
        options = {};
      }

      if (path instanceof RegExp) {
        return regexpToRegexp(path, keys)
      }

      if (isarray(path)) {
        return arrayToRegexp(path, keys, options)
      }

      return stringToRegexp(path, keys, options)
    }

    pathToRegexp_1.parse = parse_1;
    pathToRegexp_1.compile = compile_1;
    pathToRegexp_1.tokensToFunction = tokensToFunction_1;
    pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

    /**
       * Module dependencies.
       */

      

      /**
       * Short-cuts for global-object checks
       */

      var hasDocument = ('undefined' !== typeof document);
      var hasWindow = ('undefined' !== typeof window);
      var hasHistory = ('undefined' !== typeof history);
      var hasProcess = typeof process !== 'undefined';

      /**
       * Detect click event
       */
      var clickEvent = hasDocument && document.ontouchstart ? 'touchstart' : 'click';

      /**
       * To work properly with the URL
       * history.location generated polyfill in https://github.com/devote/HTML5-History-API
       */

      var isLocation = hasWindow && !!(window.history.location || window.location);

      /**
       * The page instance
       * @api private
       */
      function Page() {
        // public things
        this.callbacks = [];
        this.exits = [];
        this.current = '';
        this.len = 0;

        // private things
        this._decodeURLComponents = true;
        this._base = '';
        this._strict = false;
        this._running = false;
        this._hashbang = false;

        // bound functions
        this.clickHandler = this.clickHandler.bind(this);
        this._onpopstate = this._onpopstate.bind(this);
      }

      /**
       * Configure the instance of page. This can be called multiple times.
       *
       * @param {Object} options
       * @api public
       */

      Page.prototype.configure = function(options) {
        var opts = options || {};

        this._window = opts.window || (hasWindow && window);
        this._decodeURLComponents = opts.decodeURLComponents !== false;
        this._popstate = opts.popstate !== false && hasWindow;
        this._click = opts.click !== false && hasDocument;
        this._hashbang = !!opts.hashbang;

        var _window = this._window;
        if(this._popstate) {
          _window.addEventListener('popstate', this._onpopstate, false);
        } else if(hasWindow) {
          _window.removeEventListener('popstate', this._onpopstate, false);
        }

        if (this._click) {
          _window.document.addEventListener(clickEvent, this.clickHandler, false);
        } else if(hasDocument) {
          _window.document.removeEventListener(clickEvent, this.clickHandler, false);
        }

        if(this._hashbang && hasWindow && !hasHistory) {
          _window.addEventListener('hashchange', this._onpopstate, false);
        } else if(hasWindow) {
          _window.removeEventListener('hashchange', this._onpopstate, false);
        }
      };

      /**
       * Get or set basepath to `path`.
       *
       * @param {string} path
       * @api public
       */

      Page.prototype.base = function(path) {
        if (0 === arguments.length) return this._base;
        this._base = path;
      };

      /**
       * Gets the `base`, which depends on whether we are using History or
       * hashbang routing.

       * @api private
       */
      Page.prototype._getBase = function() {
        var base = this._base;
        if(!!base) return base;
        var loc = hasWindow && this._window && this._window.location;

        if(hasWindow && this._hashbang && loc && loc.protocol === 'file:') {
          base = loc.pathname;
        }

        return base;
      };

      /**
       * Get or set strict path matching to `enable`
       *
       * @param {boolean} enable
       * @api public
       */

      Page.prototype.strict = function(enable) {
        if (0 === arguments.length) return this._strict;
        this._strict = enable;
      };


      /**
       * Bind with the given `options`.
       *
       * Options:
       *
       *    - `click` bind to click events [true]
       *    - `popstate` bind to popstate [true]
       *    - `dispatch` perform initial dispatch [true]
       *
       * @param {Object} options
       * @api public
       */

      Page.prototype.start = function(options) {
        var opts = options || {};
        this.configure(opts);

        if (false === opts.dispatch) return;
        this._running = true;

        var url;
        if(isLocation) {
          var window = this._window;
          var loc = window.location;

          if(this._hashbang && ~loc.hash.indexOf('#!')) {
            url = loc.hash.substr(2) + loc.search;
          } else if (this._hashbang) {
            url = loc.search + loc.hash;
          } else {
            url = loc.pathname + loc.search + loc.hash;
          }
        }

        this.replace(url, null, true, opts.dispatch);
      };

      /**
       * Unbind click and popstate event handlers.
       *
       * @api public
       */

      Page.prototype.stop = function() {
        if (!this._running) return;
        this.current = '';
        this.len = 0;
        this._running = false;

        var window = this._window;
        this._click && window.document.removeEventListener(clickEvent, this.clickHandler, false);
        hasWindow && window.removeEventListener('popstate', this._onpopstate, false);
        hasWindow && window.removeEventListener('hashchange', this._onpopstate, false);
      };

      /**
       * Show `path` with optional `state` object.
       *
       * @param {string} path
       * @param {Object=} state
       * @param {boolean=} dispatch
       * @param {boolean=} push
       * @return {!Context}
       * @api public
       */

      Page.prototype.show = function(path, state, dispatch, push) {
        var ctx = new Context(path, state, this),
          prev = this.prevContext;
        this.prevContext = ctx;
        this.current = ctx.path;
        if (false !== dispatch) this.dispatch(ctx, prev);
        if (false !== ctx.handled && false !== push) ctx.pushState();
        return ctx;
      };

      /**
       * Goes back in the history
       * Back should always let the current route push state and then go back.
       *
       * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
       * @param {Object=} state
       * @api public
       */

      Page.prototype.back = function(path, state) {
        var page = this;
        if (this.len > 0) {
          var window = this._window;
          // this may need more testing to see if all browsers
          // wait for the next tick to go back in history
          hasHistory && window.history.back();
          this.len--;
        } else if (path) {
          setTimeout(function() {
            page.show(path, state);
          });
        } else {
          setTimeout(function() {
            page.show(page._getBase(), state);
          });
        }
      };

      /**
       * Register route to redirect from one path to other
       * or just redirect to another route
       *
       * @param {string} from - if param 'to' is undefined redirects to 'from'
       * @param {string=} to
       * @api public
       */
      Page.prototype.redirect = function(from, to) {
        var inst = this;

        // Define route from a path to another
        if ('string' === typeof from && 'string' === typeof to) {
          page.call(this, from, function(e) {
            setTimeout(function() {
              inst.replace(/** @type {!string} */ (to));
            }, 0);
          });
        }

        // Wait for the push state and replace it with another
        if ('string' === typeof from && 'undefined' === typeof to) {
          setTimeout(function() {
            inst.replace(from);
          }, 0);
        }
      };

      /**
       * Replace `path` with optional `state` object.
       *
       * @param {string} path
       * @param {Object=} state
       * @param {boolean=} init
       * @param {boolean=} dispatch
       * @return {!Context}
       * @api public
       */


      Page.prototype.replace = function(path, state, init, dispatch) {
        var ctx = new Context(path, state, this),
          prev = this.prevContext;
        this.prevContext = ctx;
        this.current = ctx.path;
        ctx.init = init;
        ctx.save(); // save before dispatching, which may redirect
        if (false !== dispatch) this.dispatch(ctx, prev);
        return ctx;
      };

      /**
       * Dispatch the given `ctx`.
       *
       * @param {Context} ctx
       * @api private
       */

      Page.prototype.dispatch = function(ctx, prev) {
        var i = 0, j = 0, page = this;

        function nextExit() {
          var fn = page.exits[j++];
          if (!fn) return nextEnter();
          fn(prev, nextExit);
        }

        function nextEnter() {
          var fn = page.callbacks[i++];

          if (ctx.path !== page.current) {
            ctx.handled = false;
            return;
          }
          if (!fn) return unhandled.call(page, ctx);
          fn(ctx, nextEnter);
        }

        if (prev) {
          nextExit();
        } else {
          nextEnter();
        }
      };

      /**
       * Register an exit route on `path` with
       * callback `fn()`, which will be called
       * on the previous context when a new
       * page is visited.
       */
      Page.prototype.exit = function(path, fn) {
        if (typeof path === 'function') {
          return this.exit('*', path);
        }

        var route = new Route(path, null, this);
        for (var i = 1; i < arguments.length; ++i) {
          this.exits.push(route.middleware(arguments[i]));
        }
      };

      /**
       * Handle "click" events.
       */

      /* jshint +W054 */
      Page.prototype.clickHandler = function(e) {
        if (1 !== this._which(e)) return;

        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        if (e.defaultPrevented) return;

        // ensure link
        // use shadow dom when available if not, fall back to composedPath()
        // for browsers that only have shady
        var el = e.target;
        var eventPath = e.path || (e.composedPath ? e.composedPath() : null);

        if(eventPath) {
          for (var i = 0; i < eventPath.length; i++) {
            if (!eventPath[i].nodeName) continue;
            if (eventPath[i].nodeName.toUpperCase() !== 'A') continue;
            if (!eventPath[i].href) continue;

            el = eventPath[i];
            break;
          }
        }

        // continue ensure link
        // el.nodeName for svg links are 'a' instead of 'A'
        while (el && 'A' !== el.nodeName.toUpperCase()) el = el.parentNode;
        if (!el || 'A' !== el.nodeName.toUpperCase()) return;

        // check if link is inside an svg
        // in this case, both href and target are always inside an object
        var svg = (typeof el.href === 'object') && el.href.constructor.name === 'SVGAnimatedString';

        // Ignore if tag has
        // 1. "download" attribute
        // 2. rel="external" attribute
        if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;

        // ensure non-hash for the same path
        var link = el.getAttribute('href');
        if(!this._hashbang && this._samePath(el) && (el.hash || '#' === link)) return;

        // Check for mailto: in the href
        if (link && link.indexOf('mailto:') > -1) return;

        // check target
        // svg target is an object and its desired value is in .baseVal property
        if (svg ? el.target.baseVal : el.target) return;

        // x-origin
        // note: svg links that are not relative don't call click events (and skip page.js)
        // consequently, all svg links tested inside page.js are relative and in the same origin
        if (!svg && !this.sameOrigin(el.href)) return;

        // rebuild path
        // There aren't .pathname and .search properties in svg links, so we use href
        // Also, svg href is an object and its desired value is in .baseVal property
        var path = svg ? el.href.baseVal : (el.pathname + el.search + (el.hash || ''));

        path = path[0] !== '/' ? '/' + path : path;

        // strip leading "/[drive letter]:" on NW.js on Windows
        if (hasProcess && path.match(/^\/[a-zA-Z]:\//)) {
          path = path.replace(/^\/[a-zA-Z]:\//, '/');
        }

        // same page
        var orig = path;
        var pageBase = this._getBase();

        if (path.indexOf(pageBase) === 0) {
          path = path.substr(pageBase.length);
        }

        if (this._hashbang) path = path.replace('#!', '');

        if (pageBase && orig === path && (!isLocation || this._window.location.protocol !== 'file:')) {
          return;
        }

        e.preventDefault();
        this.show(orig);
      };

      /**
       * Handle "populate" events.
       * @api private
       */

      Page.prototype._onpopstate = (function () {
        var loaded = false;
        if ( ! hasWindow ) {
          return function () {};
        }
        if (hasDocument && document.readyState === 'complete') {
          loaded = true;
        } else {
          window.addEventListener('load', function() {
            setTimeout(function() {
              loaded = true;
            }, 0);
          });
        }
        return function onpopstate(e) {
          if (!loaded) return;
          var page = this;
          if (e.state) {
            var path = e.state.path;
            page.replace(path, e.state);
          } else if (isLocation) {
            var loc = page._window.location;
            page.show(loc.pathname + loc.search + loc.hash, undefined, undefined, false);
          }
        };
      })();

      /**
       * Event button.
       */
      Page.prototype._which = function(e) {
        e = e || (hasWindow && this._window.event);
        return null == e.which ? e.button : e.which;
      };

      /**
       * Convert to a URL object
       * @api private
       */
      Page.prototype._toURL = function(href) {
        var window = this._window;
        if(typeof URL === 'function' && isLocation) {
          return new URL(href, window.location.toString());
        } else if (hasDocument) {
          var anc = window.document.createElement('a');
          anc.href = href;
          return anc;
        }
      };

      /**
       * Check if `href` is the same origin.
       * @param {string} href
       * @api public
       */
      Page.prototype.sameOrigin = function(href) {
        if(!href || !isLocation) return false;

        var url = this._toURL(href);
        var window = this._window;

        var loc = window.location;

        /*
           When the port is the default http port 80 for http, or 443 for
           https, internet explorer 11 returns an empty string for loc.port,
           so we need to compare loc.port with an empty string if url.port
           is the default port 80 or 443.
           Also the comparition with `port` is changed from `===` to `==` because
           `port` can be a string sometimes. This only applies to ie11.
        */
        return loc.protocol === url.protocol &&
          loc.hostname === url.hostname &&
          (loc.port === url.port || loc.port === '' && (url.port == 80 || url.port == 443)); // jshint ignore:line
      };

      /**
       * @api private
       */
      Page.prototype._samePath = function(url) {
        if(!isLocation) return false;
        var window = this._window;
        var loc = window.location;
        return url.pathname === loc.pathname &&
          url.search === loc.search;
      };

      /**
       * Remove URL encoding from the given `str`.
       * Accommodates whitespace in both x-www-form-urlencoded
       * and regular percent-encoded form.
       *
       * @param {string} val - URL component to decode
       * @api private
       */
      Page.prototype._decodeURLEncodedURIComponent = function(val) {
        if (typeof val !== 'string') { return val; }
        return this._decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
      };

      /**
       * Create a new `page` instance and function
       */
      function createPage() {
        var pageInstance = new Page();

        function pageFn(/* args */) {
          return page.apply(pageInstance, arguments);
        }

        // Copy all of the things over. In 2.0 maybe we use setPrototypeOf
        pageFn.callbacks = pageInstance.callbacks;
        pageFn.exits = pageInstance.exits;
        pageFn.base = pageInstance.base.bind(pageInstance);
        pageFn.strict = pageInstance.strict.bind(pageInstance);
        pageFn.start = pageInstance.start.bind(pageInstance);
        pageFn.stop = pageInstance.stop.bind(pageInstance);
        pageFn.show = pageInstance.show.bind(pageInstance);
        pageFn.back = pageInstance.back.bind(pageInstance);
        pageFn.redirect = pageInstance.redirect.bind(pageInstance);
        pageFn.replace = pageInstance.replace.bind(pageInstance);
        pageFn.dispatch = pageInstance.dispatch.bind(pageInstance);
        pageFn.exit = pageInstance.exit.bind(pageInstance);
        pageFn.configure = pageInstance.configure.bind(pageInstance);
        pageFn.sameOrigin = pageInstance.sameOrigin.bind(pageInstance);
        pageFn.clickHandler = pageInstance.clickHandler.bind(pageInstance);

        pageFn.create = createPage;

        Object.defineProperty(pageFn, 'len', {
          get: function(){
            return pageInstance.len;
          },
          set: function(val) {
            pageInstance.len = val;
          }
        });

        Object.defineProperty(pageFn, 'current', {
          get: function(){
            return pageInstance.current;
          },
          set: function(val) {
            pageInstance.current = val;
          }
        });

        // In 2.0 these can be named exports
        pageFn.Context = Context;
        pageFn.Route = Route;

        return pageFn;
      }

      /**
       * Register `path` with callback `fn()`,
       * or route `path`, or redirection,
       * or `page.start()`.
       *
       *   page(fn);
       *   page('*', fn);
       *   page('/user/:id', load, user);
       *   page('/user/' + user.id, { some: 'thing' });
       *   page('/user/' + user.id);
       *   page('/from', '/to')
       *   page();
       *
       * @param {string|!Function|!Object} path
       * @param {Function=} fn
       * @api public
       */

      function page(path, fn) {
        // <callback>
        if ('function' === typeof path) {
          return page.call(this, '*', path);
        }

        // route <path> to <callback ...>
        if ('function' === typeof fn) {
          var route = new Route(/** @type {string} */ (path), null, this);
          for (var i = 1; i < arguments.length; ++i) {
            this.callbacks.push(route.middleware(arguments[i]));
          }
          // show <path> with [state]
        } else if ('string' === typeof path) {
          this['string' === typeof fn ? 'redirect' : 'show'](path, fn);
          // start [options]
        } else {
          this.start(path);
        }
      }

      /**
       * Unhandled `ctx`. When it's not the initial
       * popstate then redirect. If you wish to handle
       * 404s on your own use `page('*', callback)`.
       *
       * @param {Context} ctx
       * @api private
       */
      function unhandled(ctx) {
        if (ctx.handled) return;
        var current;
        var page = this;
        var window = page._window;

        if (page._hashbang) {
          current = isLocation && this._getBase() + window.location.hash.replace('#!', '');
        } else {
          current = isLocation && window.location.pathname + window.location.search;
        }

        if (current === ctx.canonicalPath) return;
        page.stop();
        ctx.handled = false;
        isLocation && (window.location.href = ctx.canonicalPath);
      }

      /**
       * Escapes RegExp characters in the given string.
       *
       * @param {string} s
       * @api private
       */
      function escapeRegExp(s) {
        return s.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1');
      }

      /**
       * Initialize a new "request" `Context`
       * with the given `path` and optional initial `state`.
       *
       * @constructor
       * @param {string} path
       * @param {Object=} state
       * @api public
       */

      function Context(path, state, pageInstance) {
        var _page = this.page = pageInstance || page;
        var window = _page._window;
        var hashbang = _page._hashbang;

        var pageBase = _page._getBase();
        if ('/' === path[0] && 0 !== path.indexOf(pageBase)) path = pageBase + (hashbang ? '#!' : '') + path;
        var i = path.indexOf('?');

        this.canonicalPath = path;
        var re = new RegExp('^' + escapeRegExp(pageBase));
        this.path = path.replace(re, '') || '/';
        if (hashbang) this.path = this.path.replace('#!', '') || '/';

        this.title = (hasDocument && window.document.title);
        this.state = state || {};
        this.state.path = path;
        this.querystring = ~i ? _page._decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
        this.pathname = _page._decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
        this.params = {};

        // fragment
        this.hash = '';
        if (!hashbang) {
          if (!~this.path.indexOf('#')) return;
          var parts = this.path.split('#');
          this.path = this.pathname = parts[0];
          this.hash = _page._decodeURLEncodedURIComponent(parts[1]) || '';
          this.querystring = this.querystring.split('#')[0];
        }
      }

      /**
       * Push state.
       *
       * @api private
       */

      Context.prototype.pushState = function() {
        var page = this.page;
        var window = page._window;
        var hashbang = page._hashbang;

        page.len++;
        if (hasHistory) {
            window.history.pushState(this.state, this.title,
              hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
        }
      };

      /**
       * Save the context state.
       *
       * @api public
       */

      Context.prototype.save = function() {
        var page = this.page;
        if (hasHistory) {
            page._window.history.replaceState(this.state, this.title,
              page._hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
        }
      };

      /**
       * Initialize `Route` with the given HTTP `path`,
       * and an array of `callbacks` and `options`.
       *
       * Options:
       *
       *   - `sensitive`    enable case-sensitive routes
       *   - `strict`       enable strict matching for trailing slashes
       *
       * @constructor
       * @param {string} path
       * @param {Object=} options
       * @api private
       */

      function Route(path, options, page) {
        var _page = this.page = page || globalPage;
        var opts = options || {};
        opts.strict = opts.strict || _page._strict;
        this.path = (path === '*') ? '(.*)' : path;
        this.method = 'GET';
        this.regexp = pathToRegexp_1(this.path, this.keys = [], opts);
      }

      /**
       * Return route middleware with
       * the given callback `fn()`.
       *
       * @param {Function} fn
       * @return {Function}
       * @api public
       */

      Route.prototype.middleware = function(fn) {
        var self = this;
        return function(ctx, next) {
          if (self.match(ctx.path, ctx.params)) {
            ctx.routePath = self.path;
            return fn(ctx, next);
          }
          next();
        };
      };

      /**
       * Check if this route matches `path`, if so
       * populate `params`.
       *
       * @param {string} path
       * @param {Object} params
       * @return {boolean}
       * @api private
       */

      Route.prototype.match = function(path, params) {
        var keys = this.keys,
          qsIndex = path.indexOf('?'),
          pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
          m = this.regexp.exec(decodeURIComponent(pathname));

        if (!m) return false;

        delete params[0];

        for (var i = 1, len = m.length; i < len; ++i) {
          var key = keys[i - 1];
          var val = this.page._decodeURLEncodedURIComponent(m[i]);
          if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
            params[key.name] = val;
          }
        }

        return true;
      };


      /**
       * Module exports.
       */

      var globalPage = createPage();
      var page_js = globalPage;
      var default_1 = globalPage;

    page_js.default = default_1;

    return page_js;

    })));
    });

    /* src/components/Navbar.svelte generated by Svelte v3.47.0 */

    const { console: console_1 } = globals;
    const file$8 = "src/components/Navbar.svelte";

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    // (88:36) 
    function create_if_block_18(ctx) {
    	let div1;
    	let div0;
    	let each_value_3 = /*tabs*/ ctx[2];
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "tab-container svelte-ufl8pl");
    			add_location(div0, file$8, 89, 12, 4800);
    			attr_dev(div1, "class", "container svelte-ufl8pl");
    			set_style(div1, "border-top", "2px solid #2DB4D8");
    			add_location(div1, file$8, 88, 8, 4724);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*clicked, tabs, current_site, color*/ 7) {
    				each_value_3 = /*tabs*/ ctx[2];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_3.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_18.name,
    		type: "if",
    		source: "(88:36) ",
    		ctx
    	});

    	return block;
    }

    // (64:37) 
    function create_if_block_12(ctx) {
    	let div1;
    	let div0;
    	let each_value_2 = /*tabs*/ ctx[2];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "tab-container svelte-ufl8pl");
    			add_location(div0, file$8, 65, 12, 3322);
    			attr_dev(div1, "class", "container svelte-ufl8pl");
    			set_style(div1, "border-top", "2px solid #F68802");
    			add_location(div1, file$8, 64, 8, 3246);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*clicked, tabs, current_site, color*/ 7) {
    				each_value_2 = /*tabs*/ ctx[2];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(64:37) ",
    		ctx
    	});

    	return block;
    }

    // (40:37) 
    function create_if_block_6(ctx) {
    	let div1;
    	let div0;
    	let each_value_1 = /*tabs*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "tab-container svelte-ufl8pl");
    			add_location(div0, file$8, 41, 12, 1843);
    			attr_dev(div1, "class", "container svelte-ufl8pl");
    			set_style(div1, "border-top", "2px solid #33AB5F");
    			add_location(div1, file$8, 40, 8, 1767);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*clicked, tabs, current_site, color*/ 7) {
    				each_value_1 = /*tabs*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(40:37) ",
    		ctx
    	});

    	return block;
    }

    // (16:8) {#if color == "#F49D9A"}
    function create_if_block(ctx) {
    	let div1;
    	let div0;
    	let each_value = /*tabs*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "tab-container svelte-ufl8pl");
    			add_location(div0, file$8, 17, 12, 364);
    			attr_dev(div1, "class", "container svelte-ufl8pl");
    			set_style(div1, "border-top", "2px solid #F49D9A");
    			add_location(div1, file$8, 16, 8, 289);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*clicked, tabs, current_site, color*/ 7) {
    				each_value = /*tabs*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(16:8) {#if color == \\\"#F49D9A\\\"}",
    		ctx
    	});

    	return block;
    }

    // (96:16) {:else}
    function create_else_block_3(ctx) {
    	let t0;
    	let p;
    	let t1_value = /*tab*/ ctx[7] + "";
    	let t1;

    	function select_block_type_8(ctx, dirty) {
    		if (/*color*/ ctx[0] == "#F49D9A") return create_if_block_20;
    		if (/*color*/ ctx[0] == "#F68802") return create_if_block_21;
    		if (/*color*/ ctx[0] == "#33AB5F") return create_if_block_22;
    		if (/*color*/ ctx[0] == "#2DB4D8") return create_if_block_23;
    	}

    	let current_block_type = select_block_type_8(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			set_style(p, "color", /*color*/ ctx[0]);
    			attr_dev(p, "class", "svelte-ufl8pl");
    			add_location(p, file$8, 105, 20, 6025);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_8(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(p, "color", /*color*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(96:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (93:16) {#if tab == current_site}
    function create_if_block_19(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let p;
    	let t1_value = /*tab*/ ctx[7] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			attr_dev(img, "id", /*tab*/ ctx[7]);
    			if (!src_url_equal(img.src, img_src_value = "media/" + /*tab*/ ctx[7] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-ufl8pl");
    			add_location(img, file$8, 93, 20, 4982);
    			attr_dev(p, "class", "svelte-ufl8pl");
    			add_location(p, file$8, 94, 20, 5048);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_19.name,
    		type: "if",
    		source: "(93:16) {#if tab == current_site}",
    		ctx
    	});

    	return block;
    }

    // (103:49) 
    function create_if_block_23(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			set_style(img, "filter", "invert(60%) sepia(99%) saturate(468%) hue-rotate(156deg) brightness(89%) contrast(88%)");
    			attr_dev(img, "id", /*tab*/ ctx[7]);
    			if (!src_url_equal(img.src, img_src_value = "media/" + /*tab*/ ctx[7] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-ufl8pl");
    			add_location(img, file$8, 103, 24, 5829);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_23.name,
    		type: "if",
    		source: "(103:49) ",
    		ctx
    	});

    	return block;
    }

    // (101:49) 
    function create_if_block_22(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			set_style(img, "filter", "invert(50%) sepia(9%) saturate(5940%) hue-rotate(98deg) brightness(110%) contrast(60%)");
    			attr_dev(img, "id", /*tab*/ ctx[7]);
    			if (!src_url_equal(img.src, img_src_value = "media/" + /*tab*/ ctx[7] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-ufl8pl");
    			add_location(img, file$8, 101, 24, 5605);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_22.name,
    		type: "if",
    		source: "(101:49) ",
    		ctx
    	});

    	return block;
    }

    // (99:49) 
    function create_if_block_21(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			set_style(img, "filter", "invert(51%) sepia(94%) saturate(1584%) hue-rotate(3deg) brightness(101%) contrast(99%)");
    			attr_dev(img, "id", /*tab*/ ctx[7]);
    			if (!src_url_equal(img.src, img_src_value = "media/" + /*tab*/ ctx[7] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-ufl8pl");
    			add_location(img, file$8, 99, 24, 5381);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_21.name,
    		type: "if",
    		source: "(99:49) ",
    		ctx
    	});

    	return block;
    }

    // (97:20) {#if color == "#F49D9A"}
    function create_if_block_20(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			set_style(img, "filter", "invert(58%) sepia(10%) saturate(1173%) hue-rotate(314deg) brightness(109%) contrast(127%)");
    			attr_dev(img, "id", /*tab*/ ctx[7]);
    			if (!src_url_equal(img.src, img_src_value = "media/" + /*tab*/ ctx[7] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-ufl8pl");
    			add_location(img, file$8, 97, 24, 5154);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_20.name,
    		type: "if",
    		source: "(97:20) {#if color == \\\"#F49D9A\\\"}",
    		ctx
    	});

    	return block;
    }

    // (91:12) {#each tabs as tab}
    function create_each_block_3(ctx) {
    	let div;
    	let t;
    	let mounted;
    	let dispose;

    	function select_block_type_7(ctx, dirty) {
    		if (/*tab*/ ctx[7] == /*current_site*/ ctx[1]) return create_if_block_19;
    		return create_else_block_3;
    	}

    	let current_block_type = select_block_type_7(ctx);
    	let if_block = current_block_type(ctx);

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[6](/*tab*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			t = space();
    			attr_dev(div, "class", "tab svelte-ufl8pl");
    			add_location(div, file$8, 91, 12, 4872);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_3, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (current_block_type === (current_block_type = select_block_type_7(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, t);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(91:12) {#each tabs as tab}",
    		ctx
    	});

    	return block;
    }

    // (72:16) {:else}
    function create_else_block_2(ctx) {
    	let t0;
    	let p;
    	let t1_value = /*tab*/ ctx[7] + "";
    	let t1;

    	function select_block_type_6(ctx, dirty) {
    		if (/*color*/ ctx[0] == "#F49D9A") return create_if_block_14;
    		if (/*color*/ ctx[0] == "#F68802") return create_if_block_15;
    		if (/*color*/ ctx[0] == "#33AB5F") return create_if_block_16;
    		if (/*color*/ ctx[0] == "#2DB4D8") return create_if_block_17;
    	}

    	let current_block_type = select_block_type_6(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			set_style(p, "color", /*color*/ ctx[0]);
    			attr_dev(p, "class", "svelte-ufl8pl");
    			add_location(p, file$8, 81, 20, 4547);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_6(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(p, "color", /*color*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(72:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (69:16) {#if tab == current_site}
    function create_if_block_13(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let p;
    	let t1_value = /*tab*/ ctx[7] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			attr_dev(img, "id", /*tab*/ ctx[7]);
    			if (!src_url_equal(img.src, img_src_value = "media/" + /*tab*/ ctx[7] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-ufl8pl");
    			add_location(img, file$8, 69, 20, 3504);
    			attr_dev(p, "class", "svelte-ufl8pl");
    			add_location(p, file$8, 70, 20, 3570);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(69:16) {#if tab == current_site}",
    		ctx
    	});

    	return block;
    }

    // (79:49) 
    function create_if_block_17(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			set_style(img, "filter", "invert(60%) sepia(99%) saturate(468%) hue-rotate(156deg) brightness(89%) contrast(88%)");
    			attr_dev(img, "id", /*tab*/ ctx[7]);
    			if (!src_url_equal(img.src, img_src_value = "media/" + /*tab*/ ctx[7] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-ufl8pl");
    			add_location(img, file$8, 79, 24, 4351);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_17.name,
    		type: "if",
    		source: "(79:49) ",
    		ctx
    	});

    	return block;
    }

    // (77:49) 
    function create_if_block_16(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			set_style(img, "filter", "invert(50%) sepia(9%) saturate(5940%) hue-rotate(98deg) brightness(110%) contrast(60%)");
    			attr_dev(img, "id", /*tab*/ ctx[7]);
    			if (!src_url_equal(img.src, img_src_value = "media/" + /*tab*/ ctx[7] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-ufl8pl");
    			add_location(img, file$8, 77, 24, 4127);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(77:49) ",
    		ctx
    	});

    	return block;
    }

    // (75:49) 
    function create_if_block_15(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			set_style(img, "filter", "invert(51%) sepia(94%) saturate(1584%) hue-rotate(3deg) brightness(101%) contrast(99%)");
    			attr_dev(img, "id", /*tab*/ ctx[7]);
    			if (!src_url_equal(img.src, img_src_value = "media/" + /*tab*/ ctx[7] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-ufl8pl");
    			add_location(img, file$8, 75, 24, 3903);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(75:49) ",
    		ctx
    	});

    	return block;
    }

    // (73:20) {#if color == "#F49D9A"}
    function create_if_block_14(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			set_style(img, "filter", "invert(58%) sepia(10%) saturate(1173%) hue-rotate(314deg) brightness(109%) contrast(127%)");
    			attr_dev(img, "id", /*tab*/ ctx[7]);
    			if (!src_url_equal(img.src, img_src_value = "media/" + /*tab*/ ctx[7] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-ufl8pl");
    			add_location(img, file$8, 73, 24, 3676);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(73:20) {#if color == \\\"#F49D9A\\\"}",
    		ctx
    	});

    	return block;
    }

    // (67:12) {#each tabs as tab}
    function create_each_block_2(ctx) {
    	let div;
    	let t;
    	let mounted;
    	let dispose;

    	function select_block_type_5(ctx, dirty) {
    		if (/*tab*/ ctx[7] == /*current_site*/ ctx[1]) return create_if_block_13;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type_5(ctx);
    	let if_block = current_block_type(ctx);

    	function click_handler_2() {
    		return /*click_handler_2*/ ctx[5](/*tab*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			t = space();
    			attr_dev(div, "class", "tab svelte-ufl8pl");
    			add_location(div, file$8, 67, 12, 3394);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_2, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (current_block_type === (current_block_type = select_block_type_5(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, t);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(67:12) {#each tabs as tab}",
    		ctx
    	});

    	return block;
    }

    // (48:16) {:else}
    function create_else_block_1(ctx) {
    	let t0;
    	let p;
    	let t1_value = /*tab*/ ctx[7] + "";
    	let t1;

    	function select_block_type_4(ctx, dirty) {
    		if (/*color*/ ctx[0] == "#F49D9A") return create_if_block_8;
    		if (/*color*/ ctx[0] == "#33AB5F") return create_if_block_9;
    		if (/*color*/ ctx[0] == "#F68802") return create_if_block_10;
    		if (/*color*/ ctx[0] == "#2DB4D8") return create_if_block_11;
    	}

    	let current_block_type = select_block_type_4(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			set_style(p, "color", /*color*/ ctx[0]);
    			attr_dev(p, "class", "svelte-ufl8pl");
    			add_location(p, file$8, 57, 20, 3068);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_4(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(p, "color", /*color*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(48:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (45:16) {#if tab == current_site}
    function create_if_block_7(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let p;
    	let t1_value = /*tab*/ ctx[7] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			attr_dev(img, "id", /*tab*/ ctx[7]);
    			if (!src_url_equal(img.src, img_src_value = "media/" + /*tab*/ ctx[7] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-ufl8pl");
    			add_location(img, file$8, 45, 20, 2025);
    			attr_dev(p, "class", "svelte-ufl8pl");
    			add_location(p, file$8, 46, 20, 2091);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(45:16) {#if tab == current_site}",
    		ctx
    	});

    	return block;
    }

    // (55:49) 
    function create_if_block_11(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			set_style(img, "filter", "invert(60%) sepia(99%) saturate(468%) hue-rotate(156deg) brightness(89%) contrast(88%)");
    			attr_dev(img, "id", /*tab*/ ctx[7]);
    			if (!src_url_equal(img.src, img_src_value = "media/" + /*tab*/ ctx[7] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-ufl8pl");
    			add_location(img, file$8, 55, 24, 2872);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(55:49) ",
    		ctx
    	});

    	return block;
    }

    // (53:49) 
    function create_if_block_10(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			set_style(img, "filter", "invert(51%) sepia(94%) saturate(1584%) hue-rotate(3deg) brightness(101%) contrast(99%)");
    			attr_dev(img, "id", /*tab*/ ctx[7]);
    			if (!src_url_equal(img.src, img_src_value = "media/" + /*tab*/ ctx[7] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-ufl8pl");
    			add_location(img, file$8, 53, 24, 2648);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(53:49) ",
    		ctx
    	});

    	return block;
    }

    // (51:49) 
    function create_if_block_9(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			set_style(img, "filter", "invert(50%) sepia(9%) saturate(5940%) hue-rotate(98deg) brightness(110%) contrast(60%)");
    			attr_dev(img, "id", /*tab*/ ctx[7]);
    			if (!src_url_equal(img.src, img_src_value = "media/" + /*tab*/ ctx[7] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-ufl8pl");
    			add_location(img, file$8, 51, 24, 2424);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(51:49) ",
    		ctx
    	});

    	return block;
    }

    // (49:20) {#if color == "#F49D9A"}
    function create_if_block_8(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			set_style(img, "filter", "invert(58%) sepia(10%) saturate(1173%) hue-rotate(314deg) brightness(109%) contrast(127%)");
    			attr_dev(img, "id", /*tab*/ ctx[7]);
    			if (!src_url_equal(img.src, img_src_value = "media/" + /*tab*/ ctx[7] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-ufl8pl");
    			add_location(img, file$8, 49, 24, 2197);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(49:20) {#if color == \\\"#F49D9A\\\"}",
    		ctx
    	});

    	return block;
    }

    // (43:12) {#each tabs as tab}
    function create_each_block_1(ctx) {
    	let div;
    	let t;
    	let mounted;
    	let dispose;

    	function select_block_type_3(ctx, dirty) {
    		if (/*tab*/ ctx[7] == /*current_site*/ ctx[1]) return create_if_block_7;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_3(ctx);
    	let if_block = current_block_type(ctx);

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[4](/*tab*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			t = space();
    			attr_dev(div, "class", "tab svelte-ufl8pl");
    			add_location(div, file$8, 43, 12, 1915);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler_1, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (current_block_type === (current_block_type = select_block_type_3(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, t);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(43:12) {#each tabs as tab}",
    		ctx
    	});

    	return block;
    }

    // (24:16) {:else}
    function create_else_block(ctx) {
    	let t0;
    	let p;
    	let t1_value = /*tab*/ ctx[7] + "";
    	let t1;

    	function select_block_type_2(ctx, dirty) {
    		if (/*color*/ ctx[0] == "#F49D9A") return create_if_block_2;
    		if (/*color*/ ctx[0] == "#33AB5F") return create_if_block_3;
    		if (/*color*/ ctx[0] == "#F68802") return create_if_block_4;
    		if (/*color*/ ctx[0] == "#2DB4D8") return create_if_block_5;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			set_style(p, "color", /*color*/ ctx[0]);
    			attr_dev(p, "class", "svelte-ufl8pl");
    			add_location(p, file$8, 33, 20, 1589);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(t0.parentNode, t0);
    				}
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(p, "color", /*color*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(24:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (21:16) {#if tab == current_site}
    function create_if_block_1(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let p;
    	let t1_value = /*tab*/ ctx[7] + "";
    	let t1;

    	const block = {
    		c: function create() {
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			t1 = text(t1_value);
    			attr_dev(img, "id", /*tab*/ ctx[7]);
    			if (!src_url_equal(img.src, img_src_value = "media/" + /*tab*/ ctx[7] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-ufl8pl");
    			add_location(img, file$8, 21, 20, 546);
    			attr_dev(p, "class", "svelte-ufl8pl");
    			add_location(p, file$8, 22, 20, 612);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(21:16) {#if tab == current_site}",
    		ctx
    	});

    	return block;
    }

    // (31:49) 
    function create_if_block_5(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			set_style(img, "filter", "invert(60%) sepia(99%) saturate(468%) hue-rotate(156deg) brightness(89%) contrast(88%)");
    			attr_dev(img, "id", /*tab*/ ctx[7]);
    			if (!src_url_equal(img.src, img_src_value = "media/" + /*tab*/ ctx[7] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-ufl8pl");
    			add_location(img, file$8, 31, 24, 1393);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(31:49) ",
    		ctx
    	});

    	return block;
    }

    // (29:49) 
    function create_if_block_4(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			set_style(img, "filter", "invert(51%) sepia(94%) saturate(1584%) hue-rotate(3deg) brightness(101%) contrast(99%)");
    			attr_dev(img, "id", /*tab*/ ctx[7]);
    			if (!src_url_equal(img.src, img_src_value = "media/" + /*tab*/ ctx[7] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-ufl8pl");
    			add_location(img, file$8, 29, 24, 1169);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(29:49) ",
    		ctx
    	});

    	return block;
    }

    // (27:49) 
    function create_if_block_3(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			set_style(img, "filter", "invert(50%) sepia(9%) saturate(5940%) hue-rotate(98deg) brightness(110%) contrast(60%)");
    			attr_dev(img, "id", /*tab*/ ctx[7]);
    			if (!src_url_equal(img.src, img_src_value = "media/" + /*tab*/ ctx[7] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-ufl8pl");
    			add_location(img, file$8, 27, 24, 945);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(27:49) ",
    		ctx
    	});

    	return block;
    }

    // (25:20) {#if color == "#F49D9A"}
    function create_if_block_2(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			set_style(img, "filter", "invert(58%) sepia(10%) saturate(1173%) hue-rotate(314deg) brightness(109%) contrast(127%)");
    			attr_dev(img, "id", /*tab*/ ctx[7]);
    			if (!src_url_equal(img.src, img_src_value = "media/" + /*tab*/ ctx[7] + ".png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-ufl8pl");
    			add_location(img, file$8, 25, 24, 718);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(25:20) {#if color == \\\"#F49D9A\\\"}",
    		ctx
    	});

    	return block;
    }

    // (19:12) {#each tabs as tab}
    function create_each_block$2(ctx) {
    	let div;
    	let t;
    	let mounted;
    	let dispose;

    	function select_block_type_1(ctx, dirty) {
    		if (/*tab*/ ctx[7] == /*current_site*/ ctx[1]) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	function click_handler() {
    		return /*click_handler*/ ctx[3](/*tab*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			t = space();
    			attr_dev(div, "class", "tab svelte-ufl8pl");
    			add_location(div, file$8, 19, 12, 436);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block.m(div, null);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div, t);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(19:12) {#each tabs as tab}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*color*/ ctx[0] == "#F49D9A") return create_if_block;
    		if (/*color*/ ctx[0] == "#33AB5F") return create_if_block_6;
    		if (/*color*/ ctx[0] == "#F68802") return create_if_block_12;
    		if (/*color*/ ctx[0] = "#2DB4D8") return create_if_block_18;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function clicked$1(site) {
    	window.location.replace("/" + site);
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navbar', slots, []);
    	let { color } = $$props;
    	let { current_site } = $$props;
    	let tabs = ["discover", "podcast", "gave", "info"];
    	console.log(current_site);
    	const writable_props = ['color', 'current_site'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Navbar> was created with unknown prop '${key}'`);
    	});

    	const click_handler = tab => clicked$1(tab);
    	const click_handler_1 = tab => clicked$1(tab);
    	const click_handler_2 = tab => clicked$1(tab);
    	const click_handler_3 = tab => clicked$1(tab);

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('current_site' in $$props) $$invalidate(1, current_site = $$props.current_site);
    	};

    	$$self.$capture_state = () => ({ color, current_site, tabs, clicked: clicked$1 });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    		if ('current_site' in $$props) $$invalidate(1, current_site = $$props.current_site);
    		if ('tabs' in $$props) $$invalidate(2, tabs = $$props.tabs);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		color,
    		current_site,
    		tabs,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3
    	];
    }

    class Navbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { color: 0, current_site: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navbar",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*color*/ ctx[0] === undefined && !('color' in props)) {
    			console_1.warn("<Navbar> was created without expected prop 'color'");
    		}

    		if (/*current_site*/ ctx[1] === undefined && !('current_site' in props)) {
    			console_1.warn("<Navbar> was created without expected prop 'current_site'");
    		}
    	}

    	get color() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get current_site() {
    		throw new Error("<Navbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set current_site(value) {
    		throw new Error("<Navbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Calendar/Top.svelte generated by Svelte v3.47.0 */

    const file$7 = "src/components/Calendar/Top.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (38:8) {#each images as image, i}
    function create_each_block$1(ctx) {
    	let span;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", "dot svelte-oe89b7");
    			add_location(span, file$7, 38, 12, 1236);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*slideTo*/ ctx[2](/*i*/ ctx[6]), false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(38:8) {#each images as image, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let div1;
    	let svg;
    	let path;
    	let t0;
    	let h3;
    	let t2;
    	let h2;
    	let t4;
    	let img;
    	let img_src_value;
    	let t5;
    	let div0;
    	let each_value = /*images*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			h3 = element("h3");
    			h3.textContent = "DISCOVER";
    			t2 = space();
    			h2 = element("h2");
    			h2.textContent = "Finn ut hva som skjer på FilaUng";
    			t4 = space();
    			img = element("img");
    			t5 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(path, "d", "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z");
    			attr_dev(path, "class", "shape-fill svelte-oe89b7");
    			add_location(path, file$7, 31, 8, 817);
    			attr_dev(svg, "data-name", "Layer 1");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 1200 120");
    			attr_dev(svg, "preserveAspectRatio", "none");
    			attr_dev(svg, "class", "svelte-oe89b7");
    			add_location(svg, file$7, 30, 4, 698);
    			attr_dev(h3, "class", "svelte-oe89b7");
    			add_location(h3, file$7, 33, 4, 1062);
    			attr_dev(h2, "class", "svelte-oe89b7");
    			add_location(h2, file$7, 34, 4, 1084);
    			if (!src_url_equal(img.src, img_src_value = /*images*/ ctx[1][/*idx*/ ctx[0]])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-oe89b7");
    			add_location(img, file$7, 35, 4, 1130);
    			attr_dev(div0, "class", "dotList svelte-oe89b7");
    			add_location(div0, file$7, 36, 4, 1167);
    			attr_dev(div1, "class", "top svelte-oe89b7");
    			add_location(div1, file$7, 29, 0, 676);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, svg);
    			append_dev(svg, path);
    			append_dev(div1, t0);
    			append_dev(div1, h3);
    			append_dev(div1, t2);
    			append_dev(div1, h2);
    			append_dev(div1, t4);
    			append_dev(div1, img);
    			append_dev(div1, t5);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*idx*/ 1 && !src_url_equal(img.src, img_src_value = /*images*/ ctx[1][/*idx*/ ctx[0]])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*slideTo*/ 4) {
    				each_value = /*images*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Top', slots, []);

    	let images = [
    		"https://lensire.com/275919041_817167405884328_2531714923431134668_n.jpeg",
    		"https://i.pinimg.com/originals/6d/51/d3/6d51d3f9f63b5de77b2e8190c95c2646.jpg",
    		"https://i.swncdn.com/media/900w/via/7711-congregation-hands-up-in-worship-gettyimages-.jpg",
    		"https://i.pinimg.com/736x/85/54/dc/8554dc76e548a38e2e40d95a046bb134.jpg"
    	];

    	let idx = 0;

    	function slideImage() {
    		if (idx + 1 >= images.length) {
    			$$invalidate(0, idx = 0);
    		} else {
    			$$invalidate(0, idx++, idx);
    		}

    		setTimeout(slideImage, 5000);
    	}

    	slideImage();

    	function slideTo(slide) {
    		$$invalidate(0, idx = slide);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Top> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ images, idx, slideImage, slideTo });

    	$$self.$inject_state = $$props => {
    		if ('images' in $$props) $$invalidate(1, images = $$props.images);
    		if ('idx' in $$props) $$invalidate(0, idx = $$props.idx);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [idx, images, slideTo];
    }

    class Top extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Top",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src/components/Calendar/News.svelte generated by Svelte v3.47.0 */

    const file$6 = "src/components/Calendar/News.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (17:2) {#each images as image, i}
    function create_each_block(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t0;
    	let h3;
    	let t1_value = /*titles*/ ctx[1][/*i*/ ctx[4]] + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t0 = space();
    			h3 = element("h3");
    			t1 = text(t1_value);
    			t2 = space();
    			attr_dev(img, "class", "image svelte-1s26aq0");
    			if (!src_url_equal(img.src, img_src_value = /*image*/ ctx[2])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$6, 18, 6, 7535);
    			attr_dev(h3, "class", "svelte-1s26aq0");
    			add_location(h3, file$6, 19, 6, 7583);
    			attr_dev(div, "class", "news svelte-1s26aq0");
    			add_location(div, file$6, 17, 4, 7510);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t0);
    			append_dev(div, h3);
    			append_dev(h3, t1);
    			append_dev(div, t2);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(17:2) {#each images as image, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let h2;
    	let t1;
    	let div;
    	let each_value = /*images*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "New Events";
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "svelte-1s26aq0");
    			add_location(h2, file$6, 14, 0, 7433);
    			attr_dev(div, "class", "container svelte-1s26aq0");
    			add_location(div, file$6, 15, 0, 7453);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*titles, images*/ 3) {
    				each_value = /*images*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('News', slots, []);

    	let images = [
    		"https://lensire.com/275919041_817167405884328_2531714923431134668_n.jpeg",
    		"https://i.pinimg.com/originals/6d/51/d3/6d51d3f9f63b5de77b2e8190c95c2646.jpg",
    		"https://i.swncdn.com/media/900w/via/7711-congregation-hands-up-in-worship-gettyimages-.jpg",
    		"data:image/jpeg;base64,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",
    		"https://i.pinimg.com/736x/85/54/dc/8554dc76e548a38e2e40d95a046bb134.jpg"
    	];

    	let titles = [
    		"Hett med Bordtennis",
    		"Fleo Market",
    		"Andreas taler",
    		"Musikk samling",
    		"Hangout"
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<News> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ images, titles });

    	$$self.$inject_state = $$props => {
    		if ('images' in $$props) $$invalidate(0, images = $$props.images);
    		if ('titles' in $$props) $$invalidate(1, titles = $$props.titles);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [images, titles];
    }

    class News extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "News",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src/components/Logo.svelte generated by Svelte v3.47.0 */

    const file$5 = "src/components/Logo.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = "media/logo.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-7s6du6");
    			add_location(img, file$5, 3, 4, 30);
    			attr_dev(div, "class", "container svelte-7s6du6");
    			add_location(div, file$5, 2, 0, 2);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Logo', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Logo> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Logo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Logo",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/components/Menu.svelte generated by Svelte v3.47.0 */

    const file$4 = "src/components/Menu.svelte";

    function create_fragment$6(ctx) {
    	let div4;
    	let input;
    	let t0;
    	let label;
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let t3;
    	let div3;
    	let h20;
    	let t5;
    	let h21;
    	let t7;
    	let h22;
    	let t9;
    	let h23;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			input = element("input");
    			t0 = space();
    			label = element("label");
    			div0 = element("div");
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			t3 = space();
    			div3 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Discover";
    			t5 = space();
    			h21 = element("h2");
    			h21.textContent = "Podcast";
    			t7 = space();
    			h22 = element("h2");
    			h22.textContent = "Gave";
    			t9 = space();
    			h23 = element("h2");
    			h23.textContent = "Info";
    			attr_dev(input, "type", "checkbox");
    			attr_dev(input, "id", "menu_checkbox");
    			attr_dev(input, "class", "svelte-lu40i8");
    			add_location(input, file$4, 8, 4, 133);
    			set_style(div0, "background-color", /*color*/ ctx[0]);
    			attr_dev(div0, "class", "svelte-lu40i8");
    			add_location(div0, file$4, 10, 8, 216);
    			set_style(div1, "background-color", /*color*/ ctx[0]);
    			attr_dev(div1, "class", "svelte-lu40i8");
    			add_location(div1, file$4, 11, 8, 271);
    			set_style(div2, "background-color", /*color*/ ctx[0]);
    			attr_dev(div2, "class", "svelte-lu40i8");
    			add_location(div2, file$4, 12, 8, 326);
    			attr_dev(label, "for", "menu_checkbox");
    			attr_dev(label, "class", "svelte-lu40i8");
    			add_location(label, file$4, 9, 4, 180);
    			set_style(h20, "color", "#F49D9A");
    			attr_dev(h20, "class", "svelte-lu40i8");
    			add_location(h20, file$4, 15, 8, 422);
    			set_style(h21, "color", "#27AE60");
    			attr_dev(h21, "class", "svelte-lu40i8");
    			add_location(h21, file$4, 16, 8, 507);
    			set_style(h22, "color", "#F39C12");
    			attr_dev(h22, "class", "svelte-lu40i8");
    			add_location(h22, file$4, 17, 8, 590);
    			set_style(h23, "color", "#2DB4D8");
    			attr_dev(h23, "class", "svelte-lu40i8");
    			add_location(h23, file$4, 18, 8, 667);
    			attr_dev(div3, "class", "container svelte-lu40i8");
    			add_location(div3, file$4, 14, 4, 390);
    			attr_dev(div4, "class", "total");
    			add_location(div4, file$4, 7, 0, 109);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, input);
    			append_dev(div4, t0);
    			append_dev(div4, label);
    			append_dev(label, div0);
    			append_dev(label, t1);
    			append_dev(label, div1);
    			append_dev(label, t2);
    			append_dev(label, div2);
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, h20);
    			append_dev(div3, t5);
    			append_dev(div3, h21);
    			append_dev(div3, t7);
    			append_dev(div3, h22);
    			append_dev(div3, t9);
    			append_dev(div3, h23);

    			if (!mounted) {
    				dispose = [
    					listen_dev(h20, "click", /*click_handler*/ ctx[1], false, false, false),
    					listen_dev(h21, "click", /*click_handler_1*/ ctx[2], false, false, false),
    					listen_dev(h22, "click", /*click_handler_2*/ ctx[3], false, false, false),
    					listen_dev(h23, "click", /*click_handler_3*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color*/ 1) {
    				set_style(div0, "background-color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div1, "background-color", /*color*/ ctx[0]);
    			}

    			if (dirty & /*color*/ 1) {
    				set_style(div2, "background-color", /*color*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function toPage(site) {
    	window.location.replace("/" + site);
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menu', slots, []);
    	let { color } = $$props;
    	const writable_props = ['color'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => toPage("discover");
    	const click_handler_1 = () => toPage("podcast");
    	const click_handler_2 = () => toPage("gave");
    	const click_handler_3 = () => toPage("info");

    	$$self.$$set = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    	};

    	$$self.$capture_state = () => ({ color, toPage });

    	$$self.$inject_state = $$props => {
    		if ('color' in $$props) $$invalidate(0, color = $$props.color);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [color, click_handler, click_handler_1, click_handler_2, click_handler_3];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { color: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*color*/ ctx[0] === undefined && !('color' in props)) {
    			console.warn("<Menu> was created without expected prop 'color'");
    		}
    	}

    	get color() {
    		throw new Error("<Menu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Menu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/sites/Calendar.svelte generated by Svelte v3.47.0 */

    function create_fragment$5(ctx) {
    	let menu;
    	let t0;
    	let logo;
    	let t1;
    	let top;
    	let t2;
    	let news;
    	let t3;
    	let navbar;
    	let current;

    	menu = new Menu({
    			props: { color: "white" },
    			$$inline: true
    		});

    	logo = new Logo({ $$inline: true });
    	top = new Top({ $$inline: true });
    	news = new News({ $$inline: true });

    	navbar = new Navbar({
    			props: {
    				current_site: "discover",
    				color: "#F49D9A"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(menu.$$.fragment);
    			t0 = space();
    			create_component(logo.$$.fragment);
    			t1 = space();
    			create_component(top.$$.fragment);
    			t2 = space();
    			create_component(news.$$.fragment);
    			t3 = space();
    			create_component(navbar.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(menu, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(logo, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(top, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(news, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(navbar, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu.$$.fragment, local);
    			transition_in(logo.$$.fragment, local);
    			transition_in(top.$$.fragment, local);
    			transition_in(news.$$.fragment, local);
    			transition_in(navbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menu.$$.fragment, local);
    			transition_out(logo.$$.fragment, local);
    			transition_out(top.$$.fragment, local);
    			transition_out(news.$$.fragment, local);
    			transition_out(navbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menu, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(logo, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(top, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(news, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(navbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Calendar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Calendar> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Top, News, Logo, Navbar, Menu });
    	return [];
    }

    class Calendar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Calendar",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/Podcast/PodMain.svelte generated by Svelte v3.47.0 */

    const file$3 = "src/components/Podcast/PodMain.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let iframe;
    	let iframe_src_value;
    	let t0;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			iframe = element("iframe");
    			t0 = space();
    			button = element("button");
    			button.textContent = "ALLE PODCASTER";
    			attr_dev(iframe, "class", "radio svelte-12k0t6z");
    			if (!src_url_equal(iframe.src, iframe_src_value = "https://anchor.fm/filadelfiakirken/embed")) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "height", "102px");
    			attr_dev(iframe, "width", "400px");
    			attr_dev(iframe, "frameborder", "0");
    			attr_dev(iframe, "scrolling", "no");
    			add_location(iframe, file$3, 10, 4, 155);
    			attr_dev(button, "class", "svelte-12k0t6z");
    			add_location(button, file$3, 11, 4, 298);
    			attr_dev(div, "class", "container svelte-12k0t6z");
    			add_location(div, file$3, 9, 0, 127);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, iframe);
    			append_dev(div, t0);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", clicked, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function clicked() {
    	window.location.assign("https://anchor.fm/filadelfiakirken");
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PodMain', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PodMain> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ clicked });
    	return [];
    }

    class PodMain extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PodMain",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/sites/Podcast.svelte generated by Svelte v3.47.0 */
    const file$2 = "src/sites/Podcast.svelte";

    function create_fragment$3(ctx) {
    	let logo;
    	let t0;
    	let menu;
    	let t1;
    	let img;
    	let img_src_value;
    	let t2;
    	let h2;
    	let t4;
    	let div;
    	let svg;
    	let path;
    	let t5;
    	let podmain;
    	let t6;
    	let navbar;
    	let current;
    	logo = new Logo({ $$inline: true });

    	menu = new Menu({
    			props: { color: "black" },
    			$$inline: true
    		});

    	podmain = new PodMain({ $$inline: true });

    	navbar = new Navbar({
    			props: {
    				current_site: "podcast",
    				color: "#33AB5F"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(logo.$$.fragment);
    			t0 = space();
    			create_component(menu.$$.fragment);
    			t1 = space();
    			img = element("img");
    			t2 = space();
    			h2 = element("h2");
    			h2.textContent = "PODCAST";
    			t4 = space();
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t5 = space();
    			create_component(podmain.$$.fragment);
    			t6 = space();
    			create_component(navbar.$$.fragment);
    			if (!src_url_equal(img.src, img_src_value = "media/podcast.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-q4rew1");
    			add_location(img, file$2, 11, 0, 258);
    			attr_dev(h2, "class", "svelte-q4rew1");
    			add_location(h2, file$2, 12, 0, 296);
    			attr_dev(path, "d", "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z");
    			attr_dev(path, "class", "shape-fill svelte-q4rew1");
    			add_location(path, file$2, 15, 8, 454);
    			attr_dev(svg, "data-name", "Layer 1");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 1200 120");
    			attr_dev(svg, "preserveAspectRatio", "none");
    			attr_dev(svg, "class", "svelte-q4rew1");
    			add_location(svg, file$2, 14, 4, 335);
    			attr_dev(div, "class", "top svelte-q4rew1");
    			add_location(div, file$2, 13, 0, 313);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(logo, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(menu, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, img, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    			insert_dev(target, t5, anchor);
    			mount_component(podmain, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(navbar, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);
    			transition_in(menu.$$.fragment, local);
    			transition_in(podmain.$$.fragment, local);
    			transition_in(navbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logo.$$.fragment, local);
    			transition_out(menu.$$.fragment, local);
    			transition_out(podmain.$$.fragment, local);
    			transition_out(navbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(logo, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(menu, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t5);
    			destroy_component(podmain, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(navbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Podcast', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Podcast> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Logo, Menu, Navbar, PodMain });
    	return [];
    }

    class Podcast extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Podcast",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/sites/Giving.svelte generated by Svelte v3.47.0 */
    const file$1 = "src/sites/Giving.svelte";

    function create_fragment$2(ctx) {
    	let logo;
    	let t0;
    	let menu;
    	let t1;
    	let h2;
    	let t3;
    	let div;
    	let svg;
    	let path;
    	let t4;
    	let img0;
    	let img0_src_value;
    	let t5;
    	let img1;
    	let img1_src_value;
    	let t6;
    	let navbar;
    	let current;
    	logo = new Logo({ $$inline: true });

    	menu = new Menu({
    			props: { color: "white" },
    			$$inline: true
    		});

    	navbar = new Navbar({
    			props: { current_site: "gave", color: "#F68802" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(logo.$$.fragment);
    			t0 = space();
    			create_component(menu.$$.fragment);
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "Gave";
    			t3 = space();
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t4 = space();
    			img0 = element("img");
    			t5 = space();
    			img1 = element("img");
    			t6 = space();
    			create_component(navbar.$$.fragment);
    			attr_dev(h2, "class", "svelte-1ycpp2d");
    			add_location(h2, file$1, 10, 0, 206);
    			attr_dev(path, "d", "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z");
    			attr_dev(path, "class", "shape-fill svelte-1ycpp2d");
    			add_location(path, file$1, 13, 8, 361);
    			attr_dev(svg, "data-name", "Layer 1");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 1200 120");
    			attr_dev(svg, "preserveAspectRatio", "none");
    			attr_dev(svg, "class", "svelte-1ycpp2d");
    			add_location(svg, file$1, 12, 4, 242);
    			attr_dev(div, "class", "top svelte-1ycpp2d");
    			add_location(div, file$1, 11, 0, 220);
    			attr_dev(img0, "class", "icon svelte-1ycpp2d");
    			if (!src_url_equal(img0.src, img0_src_value = "media/gave.png")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file$1, 16, 0, 606);
    			if (!src_url_equal(img1.src, img1_src_value = "media/vipps.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "class", "svelte-1ycpp2d");
    			add_location(img1, file$1, 17, 0, 647);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(logo, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(menu, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, img0, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, img1, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(navbar, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);
    			transition_in(menu.$$.fragment, local);
    			transition_in(navbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logo.$$.fragment, local);
    			transition_out(menu.$$.fragment, local);
    			transition_out(navbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(logo, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(menu, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(img0);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(img1);
    			if (detaching) detach_dev(t6);
    			destroy_component(navbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Giving', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Giving> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Logo, Menu, Navbar });
    	return [];
    }

    class Giving extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Giving",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/sites/Info.svelte generated by Svelte v3.47.0 */
    const file = "src/sites/Info.svelte";

    function create_fragment$1(ctx) {
    	let logo;
    	let t0;
    	let menu;
    	let t1;
    	let img;
    	let img_src_value;
    	let t2;
    	let h2;
    	let t4;
    	let div;
    	let svg;
    	let path;
    	let t5;
    	let navbar;
    	let current;
    	logo = new Logo({ $$inline: true });

    	menu = new Menu({
    			props: { color: "white" },
    			$$inline: true
    		});

    	navbar = new Navbar({
    			props: { current_site: "info", color: "#2DB4D8" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(logo.$$.fragment);
    			t0 = space();
    			create_component(menu.$$.fragment);
    			t1 = space();
    			img = element("img");
    			t2 = space();
    			h2 = element("h2");
    			h2.textContent = "om filaung";
    			t4 = space();
    			div = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t5 = space();
    			create_component(navbar.$$.fragment);
    			if (!src_url_equal(img.src, img_src_value = "media/info.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-ynuo79");
    			add_location(img, file, 10, 0, 206);
    			attr_dev(h2, "class", "svelte-ynuo79");
    			add_location(h2, file, 11, 0, 241);
    			attr_dev(path, "d", "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z");
    			attr_dev(path, "class", "shape-fill svelte-ynuo79");
    			add_location(path, file, 14, 8, 402);
    			attr_dev(svg, "data-name", "Layer 1");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 1200 120");
    			attr_dev(svg, "preserveAspectRatio", "none");
    			attr_dev(svg, "class", "svelte-ynuo79");
    			add_location(svg, file, 13, 4, 283);
    			attr_dev(div, "class", "top svelte-ynuo79");
    			add_location(div, file, 12, 0, 261);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(logo, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(menu, target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, img, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			append_dev(svg, path);
    			insert_dev(target, t5, anchor);
    			mount_component(navbar, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(logo.$$.fragment, local);
    			transition_in(menu.$$.fragment, local);
    			transition_in(navbar.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(logo.$$.fragment, local);
    			transition_out(menu.$$.fragment, local);
    			transition_out(navbar.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(logo, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(menu, detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t5);
    			destroy_component(navbar, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Info', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Info> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Logo, Menu, Navbar });
    	return [];
    }

    class Info extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Info",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.47.0 */

    function create_fragment(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*current_page*/ ctx[0];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (switch_value !== (switch_value = /*current_page*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let current_page = Calendar;
    	page('/', () => $$invalidate(0, current_page = Calendar));
    	page('/calendar', () => $$invalidate(0, current_page = Calendar));
    	page('/podcast', () => $$invalidate(0, current_page = Podcast));
    	page('/gave', () => $$invalidate(0, current_page = Giving));
    	page('/info', () => $$invalidate(0, current_page = Info));
    	page.start();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		router: page,
    		Navbar,
    		Calendar,
    		Podcast,
    		Giving,
    		Info,
    		current_page
    	});

    	$$self.$inject_state = $$props => {
    		if ('current_page' in $$props) $$invalidate(0, current_page = $$props.current_page);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [current_page];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
