**`stick-n-roll`** is a lightweight and user-friendly npm package that enables HTML elements to have functionality similar to position: sticky, with the added ability to scroll the block.

[`Preview`](https://devashtar.github.io/stick-n-roll/)

**Key Features**:
- **Easy Integration**: Simply install the package and add a few lines of code to activate the functionality.
- **Block Scrolling**: Unlike standard position: sticky, sticky-scroll allows the block to scroll while maintaining its "stickiness" as the user scrolls the page.
- **Customizable Options**: Easily configure the block's behavior with parameters such as `spaceBottom`, `spaceTop` to add margins and default `position` for `target` element.
- **Cross-Browser Support**: The package works seamlessly across all modern browsers, ensuring consistent behavior on different platforms.
- **Simplicity of Use**: Minimal code required for setup, providing maximum flexibility in usage.


## Table of contents

- [Installing](#installing)
- [Using](#using)
- [Links](#links)
- [Copyright and license](#copyright-and-license)

## Installing
```sh
npm install --save-dev stick-n-roll
```

## Using

### HTML example
```html
<body>
    <h1>Example</h1>
    <main>
        <aside id="container">
            <div id="target-element">Sidebar content...</div>
        </aside>
        <section>
            ...
        </section>
    </main>
    <script>
        const StickNRoll = require('stick-n-roll');
        const container = document.getElementById('container');
        const targetElement = document.getElementById('target-element');
        const stickNRoll = new StickNRoll(container, targetElement, { spaceBottom: 8, spaceTop: 64 });
        stickNRoll.enable();
    </script>
</body>
```

### Native javascript

```js
const StickNRoll = require('stick-n-roll');
const container = document.getElementById('container');
const targetElement = document.getElementById('target-element');
const stickNRoll = new StickNRoll(container, targetElement, { spaceBottom: 8, spaceTop: 64, position: 'relative' });
stickNRoll.enable(); // start
// stickNRoll.updateSpaces({ spaceTop: 96, spaceBottom: 16, }); // Change spaces dynamically
// stickNRoll.disable(); // disable listeners and stop running. You can start it again with help "enable()".
```

### React ts

```ts
import StickNRoll from 'stick-n-roll';

// ...
const ref = React.useRef<StickNRoll>(new StickNRoll(containerRef, targetElementRef, { spaceBottom: 8, spaceTop: 64 }));

React.useEffect(() => {
    if (ref.current) {
        ref.current.enable(); // add listeners
        return () => {
            ref.current.disable(); // delete listeners
        };
    }
}, []);
// ...
```

## Links

- [DOM](https://developer.mozilla.org/en-US/docs/Glossary/DOM)
- [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement)
- [dimensions of elements](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements)
- [coordinate systems](https://developer.mozilla.org/en-US/docs/Web/CSS/CSSOM_view/Coordinate_systems)
- [viewport](https://developer.mozilla.org/en-US/docs/Glossary/Viewport)
- [position](https://developer.mozilla.org/en-US/docs/Web/CSS/position)
- [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame)
- [resizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)
- [addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [removeEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)

## Copyright and license

Code copyright 2025 the [author](https://github.com/devashtar). Code released under the [MIT License](./README.MD).