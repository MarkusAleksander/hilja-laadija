/*
Lazy Loader Module (hilja laadija - Late Loader)
Developed by Mark Holden
Version 1.1.0
*/
var hiljaLaadija = (function hiljaLaadija() {
    var _data = {
        placeholderTarget: '#lazyloaderPlaceholder',
        placeholderTargetEl: null,
        serverLocation: null,
        imageArr: null,
        offset: 500,
        negOffset: -500,
        scrolling: false,
        high_bound: window.innerHeight,
        debugMode: false,
        relativeSystemFileRoot: '/repo',
        initialised: false,
        relativePathsToHTML: false
    };
    function _test(test, message) {
        if (test == null && test == undefined) {
            _debugConsole(message);
            return true;
        }
        return false;
    }
    function _loadImages() {
        _data.high_bound = window.innerHeight + _data.offset;
        for (var i = 0; i < _data.imageArr.length; i++) {
            var bounds = _data.imageArr[i].getBoundingClientRect();
            if ((bounds.top < _data.high_bound) && ((bounds.top + bounds.height) > _data.negOffset)) {
                var imgSrc = _data.imageArr[i].getAttribute('data-lazy-src');
                if (imgSrc.indexOf(_data.serverLocation) == -1) {
                    imgSrc = _data.relativePathsToHTML ? imgSrc : _data.serverLocation + imgSrc;
                }
                if (_data.imageArr[i].tagName == "IMG") {
                    _data.imageArr[i].setAttribute('src', imgSrc);
                }
                else {
                    _data.imageArr[i].style.backgroundImage = "url('" + imgSrc + "')";
                }
                _data.imageArr[i].classList.add('lazy-loaded');
            }
        }
    }
    function _debugConsole (str) {
        if(_data.debugMode) {
            console.log(str);
        }
    }
    function _isInitialised () {
        return _data.initialised;
    }
    function _run() {
        if(!_isInitialised) return;
        // * Get lazy loadable images when document has loaded
        _data.imageArr = document.querySelectorAll('[data-lazy-src]:not(.lazy-loaded)');
        if (_test(_data.imageArr.length == 0, 'No lazy loadable images found')) {
            return;
        }
        _loadImages();
        // * Attach window scroll event
        window.addEventListener('scroll', function onWindowScroll() {
            _data.scrolling = true;
        });
        // * Run through images and update SRC
        window.setInterval(function _checkImages() {
            if (_data.scrolling) {
                _data.scrolling = false;
                _data.imageArr = document.querySelectorAll('[data-lazy-src]:not(.lazy-loaded)');
                _loadImages();
            }
        }, 150);
    }
    function _init(options) {
        if(options && typeof options == 'object' && options.constructor === Object) {
            Object.keys(options).forEach(function (prop) {
                _data[prop] = options[prop];
            });
        }

        // * Initialise variables before running
        _debugConsole('Beginning lazy load...');
        _data.placeholderTargetEl = document.querySelector(_data.placeholderTarget);
        // * Requires placeholder image
        if (_test(!_data.placeholderTargetEl, 'Lazy Load Placeholder not found!')) {
            return;
        }
        // * Get path
        var path = _data.placeholderTargetEl.getAttribute('src');
        _data.serverLocation = path.indexOf(_data.relativeSystemFileRoot) > -1 && !_data.relativePathsToHTML
            ? path.slice(0, path.indexOf(_data.relativeSystemFileRoot))
            : '';

        _data.initialised = true;
    }
    return {
        init: _init,
        run: _run,
        isInitialised: _isInitialised
    };
})();
(function initAction() {
    function ready(fn) { if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    }
    else {
        document.addEventListener('DOMContentLoaded', fn);
    } }
    ready(function run() {
        // Now do stuff...
        hiljaLaadija.isInitialised() ? hiljaLaadija.run() : hiljaLaadija.init(), hiljaLaadija.run();
    });
})();