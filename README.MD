# stick-n-roll

[![GitHub license](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![npm version](https://badge.fury.io/js/stick-n-roll.svg)](https://www.npmjs.com/package/stick-n-roll)

**`stick-n-roll`** is a lightweight and user-friendly npm package that enables HTML elements to have functionality similar to position: sticky, with the added ability to scroll the block.

## [Demo](https://devashtar.github.io/stick-n-roll/) 👈

![Preview](./docs/demonstration.gif)

## Table of contents

- [Installation](#installation-️)
- [Available Methods and Options](#available-methods-and-options-️)
- [Example Usage](#example-usage-)
- [Copyright and license](#copyright-and-license)

---

## Installation 🛠️

```sh
npm install stick-n-roll
```

---

## Available Methods and Options ⚙️

### Constructor

**`new StickNRoll(container, containerInner, options)`**

Creates a new instance of StickNRoll. Parameters:

- **container** (HTMLElement): The parent block that serves as the guide for the inner container.
- **containerInner** (HTMLElement): The child block that will move along the parent.
- **options** (object, optional):
  - **spaceTop** (number, optional): Top margin for the collider.
  - **spaceBottom** (number, optional): Bottom margin for the collider.
  - **position** (any, optional): Default property value assigned when the block is deactivated or returned to its initial position.

### Important Notes ⚠️

- The **container** must have a fixed width; this is required for the **containerInner** to inherit this property.
- Do not set horizontal padding for the **container**.
- Do not set margins for the **containerInner**.

### Methods 📝

- **`enable()`** 🔓

  Activates the sticky block, allowing it to stick during scrolling.

- **`disable()`** 🔒

  Deactivates the sticky block, returning it to normal behavior.

- **`updateSpaces(options)`** ✏️

  Updates the margins for the collider, which acts as a boundary for the sticky block. Parameters:
  - **options** (object, optional):
    - **spaceBottom** (number, optional): New bottom margin for the collider.
    - **spaceTop** (number, optional): New top margin for the collider.

---

## Example Usage 💻

### HTML JavaScript

```html
<body>
  <h1>Example</h1>
  <main>
    <aside id="container">
      <div id="container_inner">Sidebar content...</div>
    </aside>
    <section>...</section>
  </main>
  <script type="module">
    import StickNRoll from 'stick-n-roll';
    const stickNRoll = new StickNRoll(
      document.getElementById('container'),
      document.getElementById('container_inner'),
      { spaceBottom: 8, spaceTop: 64 },
    );
    stickNRoll.enable();
    // stickNRoll.updateSpaces({ spaceTop: 96, spaceBottom: 16, }); // Change spaces dynamically
    // stickNRoll.disable(); // disables listeners, resets styles, and stops running. To order start again stickNRoll.enable().
  </script>
</body>
```

### React Typescript Tailwind

```ts
import React from 'react';
import StickNRoll from 'stick-n-roll';
// See https://tailwindcss.com/docs/ (version 4.1) to style elements with utility classes

export const App: React.FunctionComponent = () => {
  return (
    <>
      <header
        className="sticky top-0 text-center bg-gray-500 z-1 max-h-14 h-14 p-2 shadow-lg"
        style={{ height: 64 }}
      >
        Header content
      </header>

      <main className="my-12 max-w-7xl w-full mx-auto grid grid-cols-12">
        <StickNRollContainer>
          <TextContent count={10} />
        </StickNRollContainer>

        <div className="col-span-9 p-3 border rounded bg-gray-500">
          <TextContent count={50} />
        </div>
      </main>

      <footer className="min-h-96 text-center bg-gray-500">Footer Content</footer>
    </>
  );
};

const TextContent: React.FC<{ count: number }> = ({ count }) => {
  return Array(count)
    .fill(null)
    .map((_, idx) => (
      <p
        key={idx}
        className="py-2 text-gray-800"
      >
        <b>{idx}.</b> Lorem ipsum dolor sit amet consectetur, adipisicing elit. Perferendis delectus dicta eligendi
        beatae qui laborum consequatur, ipsam fuga expedita esse ex provident et saepe sit incidunt soluta nulla
        accusamus dolor?
      </p>
    ));
};

const StickNRollContainer: React.FunctionComponent<React.PropsWithChildren> = ({ children }) => {
  const stickNRoll = React.useRef<StickNRoll>(null);

  const refCallback = React.useCallback((node: HTMLDivElement) => {
    if (node) {
      stickNRoll.current = new StickNRoll(node.parentElement!, node, { spaceBottom: 8, spaceTop: 64 });
    }
  }, []);

  React.useEffect(() => {
    if (stickNRoll.current) {
      stickNRoll.current.enable();

      return () => {
        stickNRoll.current?.disable();
      };
    }
  }, []);

  return (
    <aside className="col-span-3 me-3">
      <div ref={refCallback} className="rounded bg-blue-200 p-4">
        {children}
      </div>
    </aside>
  );
};
```

---

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

Code copyright 2025-2026 the [author](https://github.com/devashtar). Code released under the [MIT License](./LICENSE).
