Squire
======

Squire is an HTML5 rich text editor, which provides powerful cross-browser normalisation, whilst being supremely lightweight and flexible. It is built for the present and the future, and as such does not support truly ancient browsers. It should work fine back to around Opera 12, Firefox 3.5, Safari 5, Chrome 9 and IE9.

An example UI integration can be tried at http://neilj.github.io/Squire/.

Unlike other HTML5 rich text editors, Squire was written as a component for writing documents (emails, essays, etc.), not doing wysiwyg websites. If you are looking for support for inserting form controls or flash components or the like, you'll need to look elsewhere. However for many purposes, Squire may be just what you need, providing the power without the bloat. The key features are:

### Lightweight ###

* Only 11.5KB of JS after minification and gzip (35KB before gzip).
* Does not include its own XHR wrapper, widget library or lightbox overlays.
* No dependencies.
* No UI for a toolbar is supplied, allowing you to integrate seamlessly with the rest of your application and lose the bloat of having two UI toolkits loaded. Instead, you get a component you can insert in place of a `<textarea>` and manipulate programatically.

### Powerful ###

Squire provides an engine that handles the heavy work for you, making it easy to add extra features. With the `changeFormat` method you can easily add or remove any inline formatting you wish. And the `modifyBlocks` method can be used to make complicated block-level changes in a relatively easy manner.

If you need more commands than in the simple API, I suggest you check out the source code (it's not very long), and see how a lot of the other API methods are implemented in terms of these two methods.

The general philosophy of Squire is to allow the browser to do as much as it can (which unfortunately is not very much), but take control anywhere it deviates from what is required, or there are significant cross-browser differences. As such, the [`document.execCommand`](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand) method is not used at all; instead all formatting is done via custom functions, and certain keys, such as 'enter' and 'backspace' are handled by the editor.

Installation and usage
----------------------

1. Copy the contents of the `build/` directory onto your server.
2. Edit the `<style>` block in document.html to add the default styles you
   would like the editor to use (or link to an external stylesheet).
3. In your application, instead of a `<textarea>`, use an
   `<iframe src="path/to/document.html">`.
4. In your JS, attach an event listener to the [`load` event](https://developer.mozilla.org/en-US/docs/Web/Events/load) of the iframe. When
   this fires you can grab a reference to the editor object through
   `iframe.contentWindow.editor`.
5. Use the API below with the `editor` object to set and get data and integrate
   with your application or framework.

Advanced usage
--------------

If you load the library into a top-level document (rather than an iframe), or load it in an iframe without the `data-squireinit="true"` attribute on its `<html>` element, it will not turn the page into an editable document, but will instead add a constructor named `Squire` to the global scope.

You can also require the NPM package [squire-rte](https://www.npmjs.com/package/squire-rte) to import `Squire` in a modular program without adding names to the global namespace.

Call `new Squire( document )`, with the `document` from an iframe to instantiate multiple rich text areas on the same page efficiently. Note, for compatibility with all browsers (particularly Firefox), you MUST wait for the iframe's `onload` event to fire before instantiating Squire.

### Setting the default block style

By default, the editor will use a `<div>` for blank lines, as most users have been conditioned by Microsoft Word to expect <kbd>Enter</kbd> to act like pressing <kbd>return</kbd> on a typewriter. If you would like to use `<p>` tags (or anything else) for the default block type instead, you can pass a config object as the second parameter to the squire constructor. You can also
pass a set of attributes to apply to each default block:

    var editor = new Squire( document, {
        blockTag: 'P',
        blockAttributes: { style: 'font-size: 16px;' }
    })

If using the simple setup, call `editor.setConfig(…);` with your
config object instead. Be sure to do this *before* calling `editor.setHTML()`.

### Determining button state

If you are adding a UI to Squire, you'll probably want to show a button in different states depending on whether a particular style is active in the current selection or not. For example, a "Bold" button would be in a depressed state if the text under the cursor is already bold.

The efficient way to determine the state for most buttons is to monitor the "pathChange" event in the editor, and determine the state from the new path. If the selection goes across nodes, you will need to call the `hasFormat` method for each of your buttons to determine whether the styles are active. See the `getPath` and `hasFormat` documentation for more information.

License
-------

Squire is released under the MIT license. See LICENSE for full license.

API
---

### addEventListener

Attach an event listener to the editor. The handler can be either a function or an object with a `handleEvent` method. This function or method will be called whenever the event fires, with an event object as the sole argument. The following events may be observed:

* **focus**: The editor gained focus.
* **blur**: The editor lost focus
* **keydown**: Standard [DOM keydown event](https://developer.mozilla.org/en-US/docs/Web/Events/keydown).
* **keypress**: Standard [DOM keypress event](https://developer.mozilla.org/en-US/docs/Web/Events/keypress).
* **keyup**: Standard [DOM keyup event](https://developer.mozilla.org/en-US/docs/Web/Events/keyup).
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

### setKeyHandler

Adds or removes a keyboard shortcut. You can use this to override the default keyboard shortcuts (e.g. Ctrl-B for bold – see the bottom of KeyHandlers.js for the list).

This method takes two arguments:

* **key**: The key to handle, including any modifiers in alphabetical order. e.g. `"alt-ctrl-meta-shift-enter"`
* **fn**: The function to be called when this key is pressed, or `null` if removing a key handler. The function will be passed three arguments when called:
  * **self**: A reference to the Squire instance.
  * **event**: The key event object.
  * **range**: A Range object representing the current selection.

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

### insertHTML

Inserts an HTML fragment at the current cursor location, or replaces the selection if selected. The value supplied should not contain `<body>` tags or anything outside of that.

The method takes one argument:

* **html**: The html to insert.

Returns self (the Squire instance).

### getPath

Returns the path through the DOM tree from the `<body>` element to the current current cursor position. This is a string consisting of the tag, id and class names in CSS format. For example `BODY>BLOCKQUOTE>DIV#id>STRONG>SPAN.font>EM`. If a selection has been made, so different parts of the selection may have different paths, the value will be `(selection)`. The path is useful for efficiently determining the current formatting for bold, italic, underline etc, and thus determining button state. If a selection has been made, you can has the `hasFormat` method instead to get the current state for the properties you care about.

### getFontInfo

Returns an object containing the active font family, size, colour and background colour for the the current cursor position, if any are set. The property names are respectively `family`, `size`, `color` and `backgroundColor`. It looks at style attributes to detect this, so will not detect `<FONT>` tags or non-inline styles. If a selection across multiple elements has been made, it will return an empty object.

### getCursorPosition

Returns a bounding client rect (top/left/right/bottom properties relative to
the viewport) for the current selection/cursor.

### getSelection

Returns a [W3C Range object](https://developer.mozilla.org/en-US/docs/Web/API/Range) representing the current selection/cursor position.

### setSelection

Changes the current selection/cursor position.

The method takes one argument:

* **range**: The [W3C Range object](https://developer.mozilla.org/en-US/docs/Web/API/Range) representing the desired selection.

Returns self (the Squire instance).

### moveCursorToStart

Removes any current selection and moves the cursor to the very beginning of the
document.

Returns self (the Squire instance).

### moveCursorToEnd

Removes any current selection and moves the cursor to the very end of the
document.

Returns self (the Squire instance).

### saveUndoState

Saves an undo checkpoint with the current editor state. Methods that modify the
state (e.g. bold/setHighlightColour/modifyBlocks) will automatically save undo
checkpoints; you only need this method if you want to modify the DOM outside of
one of these methods, and you want to save an undo checkpoint first.

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

Returns self (the Squire instance).

### removeUnderline

Removes any underline formatting from the selected text.

Returns self (the Squire instance).

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

* **size**: A size to set. Any CSS [length value](https://developer.mozilla.org/en-US/docs/Web/CSS/length) or [absolute-size value](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_values_syntax#syntax-absolute-size) is accepted, e.g. '13px', or 'small'.

Returns self (the Squire instance).

### setTextColour

Sets the colour of the selected text.

This method takes one argument:

* **colour**: The colour to set. Any [CSS colour value](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) is accepted, e.g. '#f00', or 'hsl(0,0,0)'.

Returns self (the Squire instance).

### setHighlightColour

Sets the colour of the background of the selected text.

This method takes one argument:

* **colour**: The colour to set. Any [CSS colour value](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) is accepted, e.g. '#f00', or 'hsl(0,0,0)'.

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

### removeAllFormatting

Removes all formatting from the selection. Block elements (list items, table cells, etc.) are kept as separate blocks.

Returns self (the Squire instance).

### changeFormat

Change the **inline** formatting of the current selection. This is a high-level method which is used to implement the bold, italic etc. helper methods. THIS METHOD IS ONLY FOR USE WITH INLINE TAGS, NOT BLOCK TAGS. It takes 4 arguments:

1. An object describing the formatting to add, or `null` if you only wish to remove formatting. If supplied, this object should have a `tag` property with the string name of the tag to wrap around the selected text (e.g. `"STRONG"`) and optionally an `attributes` property, consisting of an object of attributes to apply to the tag (e.g. `{"class": "bold"}`).
2. An object describing the formatting to remove, in the same format as the object given to add formatting, or `null` if you only wish to add formatting.
3. A Range object with the range to apply the formatting changes to (or `null`/omit to apply to current selection).
4. A boolean (defaults to `false` if omitted). If `true`, any formatting nodes that cover at least part of the selected range will be removed entirely (so will potentially be removed from text outside the selected range as well). If `false`, the formatting nodes will continue to apply to any text outside the selection. This is useful, for example, when removing links. If any of the text in the selection is part of a link, the whole link is removed, rather than the link continuing to apply to bits of text outside the selection.

### modifyDocument

Takes in a function that can modify the document without the modifications being treated as input.

This is useful when the document needs to be changed programmatically, but those changes should not raise input events or modify the undo state.
