/*
Lazy Loader Module (hilja laadija - Late Loader)
Developed by Mark Holden
Version 1.0.0
*/
var hlOptions = hlOptions || {};
var hiljaLaadija = (function hiljaLaadija(options) {
    var _data = {
        placeholderTarget: options.hasOwnProperty('placeholderTarget') ? options.placeholderTarget : '#lazyloaderPlaceholder',
        placeholderTargetEl: null,
        serverLocation: null,
        imageArr: null,
        offset: options.hasOwnProperty('offset') ? options.offset : 500,
        negOffset: options.hasOwnProperty('negOffset') ? options.negOffset : -500,
        scrolling: false,
        high_bound: window.innerHeight
    };
    function _test(test, message) {
        if (test) {
            console.log(message);
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
                    imgSrc = _data.serverLocation + imgSrc;
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
    function _run() {
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
    function _init() {
        // * Initialise variables before running
        console.log('Beginning lazy load...');
        _data.placeholderTargetEl = document.querySelector(_data.placeholderTarget);
        // * Requires placeholder image
        if (_test(!_data.placeholderTargetEl, 'Lazy Load Placeholder not found!')) {
            return;
        }
        // * Get path
        var path = _data.placeholderTargetEl.getAttribute('src');
        _data.serverLocation = path.slice(0, path.indexOf('/repo'));
    }
    return {
        init: _init,
        run: _run
    };
})(hlOptions);
hiljaLaadija.init();
(function initAction() {
    function ready(fn) { if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
        fn();
    }
    else {
        document.addEventListener('DOMContentLoaded', fn);
    } }
    ready(function run() {
        // Now do stuff...
        hiljaLaadija.run();
    });
})();