/**
 * Options type.
 */
type OptionsType = {
    /**
     * The space between bottom of the {@link https://developer.mozilla.org/en-US/docs/Glossary/Viewport|viewport} and bottom of the `visible area`.
     * @default 0
     */
    spaceBottom?: number;
    /**
     * The space between top of the {@link https://developer.mozilla.org/en-US/docs/Glossary/Viewport|viewport} and top of the `visible area`.
     * @default 0
     */
    spaceTop?: number;
    /**
     * Default {@link https://developer.mozilla.org/en-US/docs/Web/CSS/position|position} for the target `element`.
     * @default ''
     */
    position?: CSSStyleDeclaration['position'];
};

/**
 * The element coordinates.
 */
type TypeElementCoords = {
    left: number;
    top: number;
};

/**
 * Indexes of events in the events array.
 */
enum Item {
    Resize = 0,
    Scroll = 1,
}

enum Event {
    None,
    Resize,
    Scroll,
}

/**
 * Defines `viewport` direction.
 */
enum Direction {
    Down,
    None,
    Up,
}

/**
 * Strategy.
 */
enum Strategy {
    /**
     * Sticky both sides by Y-axis.
     */
    Both,
    /**
     * Nothing do.
     */
    None,
    /**
     * Sticky only top side.
     */
    Top,
}

/**
 * @enum {number} Position variant of target `element`.
 */
enum State {
    /**
     * Element affixed at the bottom of the container.
     */
    ContainerBottom,
    /**
     * Element fixed at the top of the window viewport area (including top padding).
     */
    ColliderTop,
    /**
     * Element fixed at the bottom of the window viewport area (including bottom padding).
     */
    ColliderBottom,
    /**
     * Default element behavior. Case without specific rules.
     */
    None,
    /**
     * The element is offset along the Y axis relative to the container.
     */
    TranslateY,
    /**
     * Indicates that rendering should be skipped until the state changes.
     */
    Rest,
}

type Rules = Pick<CSSStyleDeclaration, 'width' | 'left' | 'top' | 'position' | 'transform'>;

/**
 * Stick-N-Roll.
 * Helps to give an element sticky scrolling capability.
 * @version 1.0.3
 * @author devashtar <omg.michael.here@gmail.com>
 * @license The MIT License (MIT)
 */
export class StickNRoll {
    /**
     * Parent element of target {@link element}.
     */
    private container: HTMLElement;

    /**
     * Target element with sticky and scroll abilities.
     */
    private element: HTMLElement;

    /**
     * Triggered Event.
     */
    private events: [Event.Resize | Event.None, Event.Scroll | Event.None];

    /**
     * Indicates that a render request has already been initiated.
     * @default false
     */
    private isRunningRequest: boolean;

    /**
     * The Current Y-axis coordinates relative to the {@link container}.
     */
    private translateY: number;

    /**
     * The maximum allowed Y-axis coordinates relative to the {@link container}.
     */
    private maxTranslateY: number;

    /**
     * Previous element height.
     */
    private prevElementHeight: number;

    /**
     * Height of the {@link container}.
     */
    private containerHeight: number;

    /**
     * Width of the {@link container}.
     */
    private containerWidth: number;

    /**
     * Coordinate by X-axis of the {@link container}.
     */
    private containerLeft: number;

    /**
     * Coordinate by Y-axis of the {@link container}.
     */
    private containerTop: number;

    /**
     * Previous width of the {@link container}.
     */
    private prevContainerWidth: number;

    /**
     * Previous coordinate by X-axis of the {@link container}.
     */
    private prevContainerLeft: number;

    /**
     * Previous coordinate by Y-axis of the {@link container}.
     */
    private prevContainerTop: number;

    /**
     * Height of the {@link collider}.
     */
    private colliderHeight: number;

    /**
     * Top coordinate of the {@link collider}.
     */
    private colliderTop: number;

    /**
     * Previous coordinate by X-axis of the {@link https://developer.mozilla.org/en-US/docs/Glossary/Viewport|viewport}.
     */
    private prevViewportScrollX: number;

    /**
     * Previous coordinate by Y-axis of the {@link https://developer.mozilla.org/en-US/docs/Glossary/Viewport|viewport}.
     */
    private prevViewportScrollY: number;

    /**
     * Space top.
     * @default 0
     */
    private spaceTop: number;

    /**
     * Space bottom.
     * @default 0
     */
    private spaceBottom: number;

    /**
     *  Resize observer.
     */
    private resizeObserver: ResizeObserver;

    /**
     * Current strategy. Helps to detect element behaviour.
     * @default Strategy.None
     */
    private strategy: Strategy;

    /**
     * Previous strategy.
     * @default Strategy.None
     */
    private prevStrategy: Strategy;

    /**
     * Previous state.
     * @default Variant.None
     */
    private prevState: State;

    /**
     * List of available CSS properties.
     */
    private listOfRules: Rules;

    /**
     * List of css properties to be updated.
     */
    private rules: Partial<Rules>;

    /**
     * @param {HTMLElement} container - The parent element ({@link container}) of {@link element}.
     * @param {HTMLElement} element - The target {@link element} which will be endowed with stickiness and scrolling abilities relative to its parent element ({@link container}).
     */
    constructor(container: HTMLElement, element: HTMLElement, options?: OptionsType) {
        this.container = container;
        this.element = element;

        this.isRunningRequest = false;

        this.colliderHeight = 0;
        this.colliderTop = 0;

        this.containerHeight = 0;
        this.containerWidth = 0;
        this.containerLeft = 0;
        this.containerTop = 0;
        this.prevContainerWidth = 0;
        this.prevContainerLeft = 0;
        this.prevContainerTop = 0;

        this.prevElementHeight = 0;

        this.maxTranslateY = 0;
        this.translateY = 0;

        this.prevViewportScrollX = 0;
        this.prevViewportScrollY = 0;

        this.events = [Event.None, Event.None];

        this.strategy = Strategy.None;
        this.prevStrategy = Strategy.None;

        this.prevState = State.None;

        this.listOfRules = { width: '', left: '', top: '', position: options?.position ?? '', transform: '' };
        this.rules = {};

        this.spaceBottom = options?.spaceBottom ?? 0;
        this.spaceTop = options?.spaceTop ?? 0;

        // Binds "this" context to the following class methods.
        this._calcDims = this._calcDims.bind(this);
        this._calcScroll = this._calcScroll.bind(this);
        this._resizeListener = this._resizeListener.bind(this);
        this._scrollListener = this._scrollListener.bind(this);

        // Create resize observer.
        this.resizeObserver = new ResizeObserver(this._resizeListener);
    }

    /**
     * Enable sticky scrolling capability. Use {@link disable} method to deactivate sticky scrolling capability.
     */
    public enable(): void {
        this._addListeners(); // calls _calcDims method by default, cause is used ResizeObserver
    }

    /**
     * Disable sticky scrolling capability. Use {@link enable} method to activate sticky scrolling capability again.
     */
    public disable(): void {
        this._removeListeners();
        this.isRunningRequest = false;
        this.events.fill(Event.None);
    }

    /**
     *  Update {@link spaceBottom} and {@link spaceTop}. It fires the render after changes of spaces.
     */
    public updateSpaces(spaces: Pick<OptionsType, 'spaceBottom' | 'spaceTop'>): void {
        this.spaceBottom = spaces.spaceBottom ?? 0;
        this.spaceTop = spaces.spaceTop ?? 0;
        this._resizeListener();
    }

    /**
     * Resize listener.
     */
    private _resizeListener(): void {
        if (this.events[Item.Resize] === Event.None) this.events[Item.Resize] = Event.Resize;
        this._request();
    }

    /**
     * Scroll listener.
     */
    private _scrollListener(): void {
        if (this.events[Item.Scroll] === Event.None) this.events[Item.Scroll] = Event.Scroll;
        this._request();
    }

    /**
     * Get coordinates for passed element.
     */
    private _getCoords(element: HTMLElement): TypeElementCoords {
        const coords = { left: element.offsetLeft, top: element.offsetTop };
        while (((element as unknown) = 'BODY' === element.tagName ? element.parentElement : element.offsetParent)) {
            coords.top += element.offsetTop;
            coords.left += element.offsetLeft;
        }
        return coords;
    }

    /**
     * Update styles in target {@link element} and {@link container}.
     */
    private _render(state: State): void {
        if (state === State.ContainerBottom) {
            this.translateY = this.maxTranslateY;
            this.rules = {
                top: this.spaceTop + 'px',
                left: '0px',
                position: 'sticky',
                width: this.container.clientWidth + 'px',
            };
        } else if (state === State.ColliderBottom) {
            this.translateY = 0;
            this.rules = {
                top: this.colliderHeight + this.spaceTop - this.element.offsetHeight + 'px',
                left: this.containerLeft - window.scrollX + 'px',
                position: 'fixed',
                width: this.container.clientWidth + 'px',
            };
        } else if (state === State.ColliderTop) {
            this.translateY = 0;
            this.rules = {
                top: this.spaceTop + 'px',
                left: this.containerLeft - window.scrollX + 'px',
                position: 'fixed',
                width: this.container.clientWidth + 'px',
            };
        } else if (state === State.None) {
            this.translateY = 0;
            this.rules = {};
        } else if (state === State.TranslateY) {
            if (this.prevState === State.ColliderTop) {
                this.translateY = this.colliderTop - this.containerTop;
            } else if (this.prevState === State.ColliderBottom) {
                this.translateY = this.colliderTop + this.colliderHeight - this.containerTop - this.prevElementHeight;
            } else if (this.prevState === State.ContainerBottom) {
                this.translateY = this.containerHeight - this.element.offsetHeight;
            }
            this.rules = { position: 'relative', transform: `translate3d(0px, ${this.translateY}px, 0px)` };
        }

        this.container.style.position = state === State.ContainerBottom ? 'relative' : '';

        for (const key in this.listOfRules) {
            this.element.style[key as keyof Rules] =
                this.rules[key as unknown as keyof Rules] ?? this.listOfRules[key as unknown as keyof Rules];
        }
    }

    /**
     * Get the scroll direction. `None` for horizontal scrolling or no scrolling.
     */
    private _getDirection(): Direction {
        if (this.prevViewportScrollY === window.scrollY) return Direction.None;
        return this.prevViewportScrollY < window.scrollY ? Direction.Down : Direction.Up;
    }

    /**
     * Get state of target element.
     */
    private _getState(direction: Direction): State {
        if (this.prevState === State.ColliderTop) {
            if (this.colliderTop <= this.containerTop) {
                return State.None;
            }
            if (this.colliderTop + this.element.offsetHeight >= this.containerTop + this.containerHeight) {
                return State.ContainerBottom;
            }
            if (this.prevStrategy === Strategy.Top && this.element.offsetHeight > this.colliderHeight) {
                this.prevStrategy = this.strategy;
                return State.TranslateY;
            }
            if (this.strategy === Strategy.Both && direction === Direction.Down) {
                return State.TranslateY;
            }
            if (
                this.prevViewportScrollX !== window.scrollX ||
                this.prevContainerLeft !== this.containerLeft ||
                this.prevContainerWidth !== this.containerWidth ||
                this.prevContainerTop !== this.containerTop
            ) {
                return State.ColliderTop;
            }
        } else if (this.prevState === State.ColliderBottom) {
            if (this.colliderTop <= this.containerTop) {
                return State.None;
            }
            if (this.colliderTop + this.colliderHeight >= this.containerTop + this.containerHeight) {
                return State.ContainerBottom;
            }
            if (this.element.offsetHeight <= this.colliderHeight) {
                return State.ColliderTop;
            }
            if (direction === Direction.Up || this.prevElementHeight !== this.element.offsetHeight) {
                return State.TranslateY;
            }
            if (
                this.prevViewportScrollX !== window.scrollX ||
                this.prevContainerLeft !== this.containerLeft ||
                this.prevContainerWidth !== this.containerWidth ||
                this.prevContainerTop !== this.containerTop
            ) {
                return State.ColliderBottom;
            }
        } else if (this.prevState === State.ContainerBottom) {
            if (this.colliderTop <= this.containerTop) {
                return State.None;
            }
            if (direction === Direction.Up && this.colliderTop <= this.containerTop + this.maxTranslateY) {
                return State.ColliderTop;
            }
            if (this.element.offsetHeight < this.containerTop + this.containerHeight - this.colliderTop) {
                return State.ColliderTop;
            }
            if (this.prevContainerWidth !== this.containerWidth) {
                return State.ContainerBottom;
            }
        } else if (this.prevState === State.None) {
            if (this.colliderTop + this.element.offsetHeight >= this.containerTop + this.containerHeight) {
                return State.ContainerBottom;
            }
            if (this.element.offsetHeight < this.colliderHeight && this.colliderTop >= this.containerTop) {
                return State.ColliderTop;
            }
            if (
                this.strategy === Strategy.Both &&
                this.colliderTop + this.colliderHeight >= this.containerTop + this.element.offsetHeight
            ) {
                return State.ColliderBottom;
            }
        } else if (this.prevState === State.TranslateY) {
            if (this.containerHeight - this.translateY < this.element.offsetHeight) {
                return State.ContainerBottom;
            }
            if (this.element.offsetHeight < this.colliderHeight || this.colliderTop <= this.containerTop + this.translateY) {
                return State.ColliderTop;
            }
            if (
                this.translateY < this.maxTranslateY &&
                this.colliderTop + this.colliderHeight > this.containerTop + this.translateY + this.element.offsetHeight
            ) {
                return State.ColliderBottom;
            }
        }

        return State.Rest;
    }

    /**
     * Get a {@link strategy} that determines the further behavior of the target {@link element}.
     */
    private _getStrategy(): Strategy {
        if (this.containerHeight <= this.element.offsetHeight) return Strategy.None;
        if (this.colliderHeight < this.element.offsetHeight) return Strategy.Both;
        return Strategy.Top;
    }

    /**
     * Calculate {@link https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements|dimensions}.
     */
    private _calcDims(): void {
        const containerCoords = this._getCoords(this.container);
        this.containerLeft = containerCoords.left;
        this.containerTop = containerCoords.top;
        this.containerHeight = this.container.clientHeight;
        this.containerWidth = this.container.clientWidth;
        this.colliderHeight = window.innerHeight - this.spaceTop - this.spaceBottom;
        this.maxTranslateY = this.container.clientHeight - this.element.offsetHeight;

        this.strategy = this._getStrategy();

        if (this.strategy === Strategy.None) {
            if (this.prevStrategy !== this.strategy) this._render(State.None);
        } else {
            this._calcScroll();
        }

        this.prevContainerWidth = this.containerWidth;
        this.prevContainerLeft = this.containerLeft;
        this.prevContainerTop = this.containerTop;
        this.prevElementHeight = this.element.offsetHeight;
        this.prevStrategy = this.strategy;
    }

    /**
     * Calculate {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSSOM_view/Coordinate_systems|coordinates}.
     */
    private _calcScroll(): void {
        this.colliderTop = window.scrollY + this.spaceTop;

        const state = this._getState(this._getDirection());

        if (state !== State.Rest) {
            this._render(state);
            this.prevState = state;
        }

        this.prevViewportScrollX = window.scrollX;
        this.prevViewportScrollY = window.scrollY;
    }

    /**
     * Helps apply DOM manipulation and synchronize processing with rendering. See {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame|requestAnimationFrame}.
     */
    private _request(): void {
        if (this.isRunningRequest) return;
        this.isRunningRequest = true;
        window.requestAnimationFrame(() => {
            if (this.events[Item.Resize] === Event.Resize) {
                this.events[Item.Resize] = Event.None;
                this._calcDims();
            } else if (this.events[Item.Scroll] === Event.Scroll) {
                this.events[Item.Scroll] = Event.None;
                this._calcScroll();
            }
            this.isRunningRequest = false;
        });
    }

    /**
     * Observe {@link https://developer.mozilla.org/en-US/docs/Web/API/Node|nodes} from target {@link element} to {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/body|document body} with help the {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver|ResizeObserver}.
     */
    private _observeTreeNodesFromCurrentToBody(element: HTMLElement): void {
        while (element) {
            this.resizeObserver.observe(element);
            if (element.tagName === 'BODY') break;
            (element as unknown) = element.parentElement;
        }
    }

    /**
     * Add required event listeners. See {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener|addEventListener} and {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver|ResizeObserver}.
     */
    private _addListeners(): void {
        window.addEventListener('scroll', this._scrollListener, { capture: false, passive: true });
        this._observeTreeNodesFromCurrentToBody(this.element);
    }

    /**
     * Remove all event listeners. See {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener|removeEventListener} and {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver|ResizeObserver}.
     */
    private _removeListeners(): void {
        window.removeEventListener('scroll', this._scrollListener, { capture: false }); // window
        this.resizeObserver.disconnect();
    }
}

export default StickNRoll;