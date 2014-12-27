Squire
======

Squire is an HTML5 rich text editor, which provides powerful cross-browser normalisation, whilst being supremely lightweight and flexible. It is built for the present and the future, and as such does not support truly ancient browsers. It should work fine back to around Opera 12, Firefox 3.5, Safari 5, Chrome 9 and IE9.

An example UI integration can be tried at http://neilj.github.io/Squire/.

Unlike other HTML5 rich text editors, Squire was written as a component for writing documents (emails, essays, etc.), not doing wysiwyg websites. If you are looking for support for inserting form controls or flash components or the like, you'll need to look elsewhere. However for many purposes, Squire may be just what you need, providing the power without the bloat. The key features are:

### Lightweight ###

* Only 11.5KB of JS after minification and gzip (35KB before gzip).
* Does not include its own XHR wrapper, widget library or lightbox overlays.
* No dependencies.
* No UI for a toolbar is supplied, allowing you to integrate seamlessly with the rest of your application and lose the bloat of having two UI toolkits loaded. Instead, you get a component you can drop in in place of a `<textarea>` and manipulate programatically.

### Powerful ###

Squire provides an engine that handles the heavy work for you, making it easy to add extra features. With the `changeFormat` method you can easily add or remove any inline formatting you wish. And the `modifyBlocks` method can be used to make complicated block-level changes in a relatively easy manner.

If you need more commands than in the simple API, I suggest you check out the source code (it's not very long), and see how a lot of the other API methods are implemented in terms of these two methods.

The general philosophy of Squire is to allow the browser to do as much as it can (which unfortunately is not very much), but take control anywhere it deviates from what is required, or there are significant cross-browser differences. As such, the `document.execCommand` method is not used at all; instead all formatting is done via custom functions, and certain keys, such as 'enter' and 'backspace' are handled by the editor.

Installation and usage
----------------------

1. Copy the contents of the `build/` directory onto your server.
2. Edit the `<style>` block in document.html to add the default styles you
   would like the editor to use (or link to an external stylesheet).
3. In your application, instead of a `<textarea>`, use an
   `<iframe src="path/to/document.html">`.
4. In your JS, attach an event listener to the `load` event of the iframe. When
   this fires you can grab a reference to the editor object through
   `iframe.contentWindow.editor`.
5. Use the API below with the `editor` object to set and get data and integrate
   with your application or framework.

Advanced usage
--------------

If you load the library into a top-level document (rather than an iframe), it will not turn the page into an editable document, but will instead add a function named `Squire` to the global scope. Call `new Squire( document )`, with the `document` from an iframe to instantiate multiple rich text areas on the same page efficiently.

### Setting the default block style

By default, the editor will use a `<div>` for blank lines, as most users have been conditioned by Microsoft Word to expect <kbd>Enter</kbd> to act like pressing <kbd>return</kbd> on a typewriter. If you would like to use `<p>` tags (or anything else) for the default block type instead, then after calling `var editor = new Squire( document )` (or getting your reference to the ready-made `editor` instance if using the simple setup), set `editor.defaultBlockTag = 'P';`.

You can also set an object of attributes to apply to each default block node by setting the *defaultBlockProperties* property, e.g. `editor.defaultBlockProperties = { style: 'font-size: 16px;' }`.

License
-------

Squire is released under the MIT license. See LICENSE for full license.

API
---

### addEventListener

Attach an event listener to the editor. The handler can be either a function or an object with a `handleEvent` method. This function or method will be called whenever the event fires, with an event object as the sole argument. The following events may be observed:

* **focus**: The editor gained focus.
* **blur**: The editor lost focus
* **keydown**: Standard DOM keydown event.
* **keypress**: Standard DOM keypress event.
* **keyup**: Standard DOM keyup event.
* **input**: The user inserted, deleted or changed the style of some text; in other words, the result for `editor.getHTML()` will have changed.
* **pathChange**: The path (see getPath documentation) to the cursor has changed. The new path is available as the `path` property on the event object.
* **select**: The user selected some text.
* **undoStateChange**: The availability of undo and/or redo has changed. The event object has two boolean properties, `canUndo` and `canRedo` to let you know the new state.
* **willPaste**: The user is pasting content into the document. The content that will be inserted is available as the `fragment` property on the event object. You can modify this fragment in your event handler to change what will be pasted. You can also call the `preventDefault` on the event object to cancel the paste operation.

The method takes two arguments:

* **type**: The event to listen for. e.g. 'focus'.
* **handler**: The callback function to invoke

Returns self (the Squire instance).

### removeEventListener

Remove an event listener attached via the addEventListener method.

The method takes two arguments:

* **type**: The event type the handler was registered for.
* **handler**: The handler to remove.

Returns self (the Squire instance).

### focus

Focuses the editor.

The method takes no arguments.

Returns self (the Squire instance).

### blur

Removes focus from the editor.

The method takes no arguments.

Returns self (the Squire instance).

### getDocument

Returns the `document` object of the editable area. May be useful to do transformations outside the realm of the API.

### getHTML

Returns the HTML value of the editor in its current state. This value is equivalent to the contents of the `<body>` tag and does not include any surrounding boilerplate.

### setHTML

Sets the HTML value for the editor. The value supplied should not contain `<body>` tags or anything outside of that.

The method takes one argument:

* **html**: The html to set.

Returns self (the Squire instance).

### getSelectedText

Returns the text currently selected in the editor.

### insertImage

Inserts an image at the current cursor location.

The method takes one argument:

* **src**: The source path for the image.

Returns a reference to the newly inserted image element.

### getPath

Returns the path through the DOM tree from the `<body>` element to the current current cursor position. This is a string consisting of the tag, id and class names in CSS format. For example `BODY>BLOCKQUOTE>DIV#id>STRONG>SPAN.font>EM`. If a selection has been made, so different parts of the selection may have different paths, the value will be `(selection)`. The path is useful for efficiently determining the current formatting for bold, italic, underline etc, and thus determining button state. If a selection has been made, you can has the `hasFormat` method instead to get the current state for the properties you care about.

### getSelection

Returns a W3C Range object representing the current selection/cursor position.

### setSelection

Changes the current selection/cursor position.

The method takes one argument:

* **range**: The W3C Range object representing the desired selection.

Returns self (the Squire instance).

### undo

Undoes the most recent change.

Returns self (the Squire instance).

### redo

If the user has just undone a change, this will reapply that change.

Returns self (the Squire instance).

### hasFormat

Queries the editor for whether a particular format is applied anywhere in the current selection.

The method takes two arguments:

* **tag**: The tag of the format
* **attributes**: (optional) Any attributes the format.

Returns `true` if any of the selection is contained within an element with the specified tag and attributes, otherwise returns `false`.

### bold

Makes any non-bold currently selected text bold (by wrapping it in a `<b>` tag).

Returns self (the Squire instance).

### italic

Makes any non-italic currently selected text italic (by wrapping it in an `<i>` tag).

Returns self (the Squire instance).

### underline

Makes any non-underlined currently selected text underlined (by wrapping it in a `<u>` tag).

Returns self (the Squire instance).

### removeBold

Removes any bold formatting from the selected text.

Returns self (the Squire instance).

### removeItalic

Removes any italic formatting from the selected text.

Returns self.

### removeUnderline

Removes any underline formatting from the selected text.

Returns self.

### makeLink

Makes the currently selected text a link. If no text is selected, the URL or email will be inserted as text at the current cursor point and made into a link.

This method takes two arguments:

* **url**: The url or email to link to.
* **attributes**: (optional) An object containing other attributes to set on the `<a>` node. e.g. `{ target: '_blank' }`. Any `href` attribute will be overwritten by the url given as the first argument.

Returns self (the Squire instance).

### removeLink

Removes any link that is currently at least partially selected.

Returns self (the Squire instance).

### setFontFace

Sets the font face for the selected text.

This method takes one argument:

* **font**: A comma-separated list of fonts (in order of preference) to set.

Returns self (the Squire instance).

### setFontSize

Sets the font size for the selected text.

This method takes one argument:

* **size**: A size to set. Any CSS size value is accepted, e.g. '13px', or 'small'.

Returns self (the Squire instance).

### setTextColour

Sets the colour of the selected text.

This method takes one argument:

* **colour**: The colour to set. Any CSS colour value is accepted, e.g. '#f00', or 'hsl(0,0,0)'.

Returns self (the Squire instance).

### setHighlightColour

Sets the colour of the background of the selected text.

This method takes one argument:

* **colour**: The colour to set. Any CSS colour value is accepted, e.g. '#f00', or 'hsl(0,0,0)'.

Returns self (the Squire instance).

### setTextAlignment

Sets the text alignment in all blocks at least partially contained by the selection.

This method takes one argument:

* **alignment**: The direction to align to. Can be 'left', 'right', 'center' or 'justify'.

Returns self (the Squire instance).

### setTextDirection

Sets the text direction in all blocks at least partially contained by the selection.

This method takes one argument:

* **direction**: The text direction. Can be 'ltr' or 'rtl'.

Returns self (the Squire instance).

### forEachBlock

Executes a function on each block in the current selection, or until the function returns a truthy value.

This method takes two arguments:

* **fn** The function to execute on each block node at least partially contained in the current selection. The function will be called with the block node as the only argument.
* **mutates** A boolean indicating whether your function may modify anything in the document in any way.

Returns self (the Squire instance).

### modifyBlocks

Extracts a portion of the DOM tree (up to the block boundaries of the current selection), modifies it and then reinserts it and merges the edges. See the code for examples if you're interested in using this function.

This method takes one argument:

* **modify** The function to apply to the extracted DOM tree; gets a document fragment as a sole argument. `this` is bound to the Squire instance. Should return the node or fragment to be reinserted in the DOM.

Returns self (the Squire instance).

### increaseQuoteLevel

Increases by 1 the quote level (number of `<blockquote>` tags wrapping) all blocks at least partially selected.

Returns self (the Squire instance).

### decreaseQuoteLevel

Decreases by 1 the quote level (number of `<blockquote>` tags wrapping) all blocks at least partially selected.

Returns self (the Squire instance).

### makeUnorderedList

Changes all at-least-partially selected blocks to be part of an unordered list.

Returns self (the Squire instance).

### makeOrderedList

Changes all at-least-partially selected blocks to be part of an ordered list.

Returns self (the Squire instance).

### removeList

Changes any at-least-partially selected blocks which are part of a list to no longer be part of a list.

Returns self (the Squire instance).

### increaseListLevel

Increases by 1 the nesting level of any at-least-partially selected blocks which are part of a list.

Returns self (the Squire instance).

### decreaseListLevel

Decreases by 1 the nesting level of any at-least-partially selected blocks which are part of a list.

Returns self (the Squire instance).
