# Hilja Laadija
Lazy Loader for Dynamic Servers

This lazy loader was developed out of a need to introduce Lazy Loading to websites that used a FatWire Content Management System. Because of this system, all paths in HTML were required to be relative URLs and each content page would go through a number of different locations from initial build, to QA, to live. Images that were uploaded would only advance through the system when referenced in the src attribute of an img tag or as a background image in CSS. This meant Lazy Loading using other available libraries was not possible.

This library works by loading a placeholder image, the server location of which is automatically injected by the FatWire system, and that CSS background images are not loaded UNTIL the browser knows they are needed (the only exception being Firefox). By having the system pull the images through to the live server by the CSS, and the script detecting which server the images were available, Lazy Loading using this script would now work on the websites.

## Features:

- Works on all images
- Applies images as a background to non-image tags
- Works automatically with an image and script tag dropped in

## TODOs

- Add customisability, i.e. offset distance

## Usage on dynamic server sites

In HTML before any other images:
```
<img id="lazyloaderPlaceholder" src="/path-to-a-placeholder-image.jpg" style="display:none;" />
<script type="text/javascript" src="/path-to-the-lazy-loader-script.js"></script>
```

On HTML tags to be lazy loaded:
```
<img data-lazy-src="image_to_be_lazyLoaded.jpg" src="/path-to-a-placeholder-image.jpg" />
<!-- or as a background image -->
<div data-lazy-src="image_to_be_lazyLoaded.jpg"></div>
```

Then in a CSS file, a list of all the images to be lazy loaded:
```
#DoNotUseThisID {
    background-image:
        url('/path-to/image_one.jpg'),
        url('/path-to/image_two.png'),
        url('/path-to/image/image_three.jpg'),
        ...ad infinitum;
}
```