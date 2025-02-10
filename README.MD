# stick-n-roll

[![GitHub license](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![npm version](https://badge.fury.io/js/stick-n-roll.svg)](https://www.npmjs.com/package/stick-n-roll)

**`stick-n-roll`** is a lightweight and user-friendly npm package that enables HTML elements to have functionality similar to position: sticky, with the added ability to scroll the block.

### [Demo](https://devashtar.github.io/stick-n-roll/)

## Features

- 🌟 **Simple Integration**: Install the package and add a few lines of code
- 🔄 **Block Scrolling**: Unlike native CSS sticky positioning, allows scrolling while maintaining stickiness
- ⚙️ **Customizable Behavior**: Configure spacing and positioning through options
- 📱 **Cross-browser Compatible**: Works seamlessly across modern browsers
- 💻 **Minimal Setup**: Maximum flexibility with minimal configuration


## Table of contents

- [Installing](#installing)
- [Using](#using)
- [Links](#links)
- [Copyright and license](#copyright-and-license)

## Installing
```sh
npm install stick-n-roll
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
    <script type="module">
        import StickNRoll from 'stick-n-roll';
        const container = document.getElementById('container');
        const targetElement = document.getElementById('target-element');
        const stickNRoll = new StickNRoll(container, targetElement, { spaceBottom: 8, spaceTop: 64 });
        stickNRoll.enable();
        // stickNRoll.updateSpaces({ spaceTop: 96, spaceBottom: 16, }); // Change spaces dynamically
        // stickNRoll.disable(); // disable listeners and stop running. You can start it again with help "enable()".
    </script>
</body>
```

### React typescript

See also: [tailwind](https://tailwindcss.com/docs/) (version 4)

```ts
import React from "react"
import StickNRoll from 'stick-n-roll';

export const App:React.FunctionComponent = () => {
  const [enableSpaces, setEnableSpaces] = React.useState<boolean>(true); 
  const stickNRoll = React.useRef<StickNRoll>(null);

  const refCallback = React.useCallback((node: HTMLDivElement) => {
    if (node) {
        stickNRoll.current = new StickNRoll(node.parentElement!, node, { spaceBottom: 8, spaceTop: 64 });
    }
  }, [])

  React.useEffect(() => {
    if (stickNRoll.current) {
      stickNRoll.current.enable()

      return () => {
        stickNRoll.current?.disable()
      }
    }
  }, [])

  const changeSpaces = () => {
    if (enableSpaces) {
      stickNRoll.current?.updateSpaces({ spaceTop: 0, spaceBottom: 0 });
      setEnableSpaces(false)
    } else {
      stickNRoll.current?.updateSpaces({ spaceTop: 64, spaceBottom: 8 });
      setEnableSpaces(true)
    }
  }

  // See https://tailwindcss.com/docs/ (version 4.0) to style elements with utility classes

  return (
    <>
      <header className="sticky top-0 text-center bg-gray-500 z-1 max-h-14 h-14 p-2 shadow-lg" style={{ height: 64 }}>
        <button 
          className="rounded-full cursor-pointer bg-sky-500 px-5 py-2 text-sm leading-5 font-semibold text-white hover:bg-sky-700"
          onClick={changeSpaces}>
          Click to change spaces
        </button>
        Header content
      </header>
      
      <main className="my-12 max-w-7xl w-full mx-auto grid grid-cols-12 gap-5">
        <aside className="col-span-3">
          <div ref={refCallback} className="rounded bg-blue-200">
            {Array(50).fill(null).map((_, idx) => <p key={idx}>Sidebar content - {idx}</p>)}
          </div>
        </aside>

        <div className="col-span-9 p-3 border rounded">
          {Array(140).fill(null).map((_, idx) => <p key={idx}>General content - {idx}</p>)}
        </div>
      </main>

      <footer className="min-h-96 bg-gray-500">Footer Content</footer>
    </>
  )
}
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

Code copyright 2025 the [author](https://github.com/devashtar). Code released under the [MIT License](./LICENSE).