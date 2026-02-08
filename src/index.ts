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
   * Default {@link https://developer.mozilla.org/en-US/docs/Web/CSS/position|position} for the target {@link StickNRoll.containerInner|containerInner}. This property is set when the disable method is called.
   * @default 'initial'
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
 * @enum {number} Position variant of target {@link StickNRoll.containerInner|containerInner}.
 */
enum State {
  /**
   * {@link StickNRoll.containerInner|containerInner} affixed at the bottom of the {@link StickNRoll.container|container}.
   */
  ContainerBottom,
  /**
   * {@link StickNRoll.containerInner|containerInner} fixed at the top of the window viewport area (including {@link OptionsType.spaceTop|spaceTop}).
   */
  ColliderTop,
  /**
   * {@link StickNRoll.containerInner|containerInner} fixed at the bottom of the window viewport area (including {@link OptionsType.spaceBottom|spaceBottom}).
   */
  ColliderBottom,
  /**
   * Default {@link StickNRoll.containerInner|containerInner} behavior. Case without specific {@link Rules|rules}.
   */
  None,
  /**
   * The {@link StickNRoll.containerInner|containerInner} is offset along the Y axis relative to the {@link StickNRoll.container|container}.
   */
  TranslateY,
  /**
   * Indicates that rendering should be skipped until the state changes.
   */
  Rest,
}

type Rules = Pick<CSSStyleDeclaration, 'width' | 'left' | 'top' | 'position' | 'transform'>;

/**
 * stick-n-roll is a lightweight, dependency-free npm package that adds sticky-like behavior with scrolling for elements like sidebars.
 * @version 1.1.2
 * @link https://github.com/devashtar/stick-n-roll
 * @author devashtar <omg.michael.here@gmail.com>
 * @license The MIT License (MIT)
 */
export class StickNRoll {
  /**
   * Parent element of {@link containerInner}.
   */
  private container: HTMLElement;

  /**
   * Target element with sticky and scroll abilities.
   */
  private containerInner: HTMLElement;

  /**
   * Triggered Event.
   */
  private events: [Boolean, Boolean];

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
   * Previous {@link containerInner} height.
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
   * Previous top coordinate of the {@link collider}.
   */
  private prevColliderTop: number;

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
   * Previous space top.
   * @default 0
   */
  private prevSpaceTop: number;

  /**
   * Space bottom.
   * @default 0
   */
  private spaceBottom: number;

  /**
   * Previous space bottom.
   * @default 0
   */
  private prevSpaceBottom: number;

  /**
   *  Resize observer.
   */
  private resizeObserver: ResizeObserver;

  /**
   * Current strategy. Helps to detect {@link containerInner} behaviour.
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
   * List of available CSS properties. Also is used as default values for rules.
   */
  private listOfRules: Rules;

  /**
   * List of css properties to be updated.
   */
  private rules: Partial<Rules>;

  /**
   * @param {HTMLElement} container - The parent element({@link container}) of {@link containerInner}.
   * @param {HTMLElement} containerInner - The {@link containerInner} which will be endowed with stickiness and scrolling abilities relative to its parent element({@link container}).
   */
  constructor(container: HTMLElement, containerInner: HTMLElement, options?: OptionsType) {
    this.container = container;
    this.containerInner = containerInner;
    this.prevSpaceBottom = options?.spaceBottom ?? 0;
    this.prevSpaceTop = options?.spaceTop ?? 0;
    this.spaceBottom = options?.spaceBottom ?? 0;
    this.spaceTop = options?.spaceTop ?? 0;
    this.listOfRules = {
      width: 'initial',
      left: 'initial',
      top: 'initial',
      position: options?.position ?? 'initial',
      transform: 'initial',
    };

    this.colliderHeight = 0;
    this.colliderTop = 0;
    this.containerHeight = 0;
    this.containerLeft = 0;
    this.containerTop = 0;
    this.containerWidth = 0;
    this.events = [false, false];
    this.isRunningRequest = false;
    this.maxTranslateY = 0;
    this.prevColliderTop = 0;
    this.prevContainerLeft = 0;
    this.prevContainerTop = 0;
    this.prevContainerWidth = 0;
    this.prevElementHeight = 0;
    this.prevState = State.None;
    this.prevStrategy = Strategy.None;
    this.prevViewportScrollX = 0;
    this.prevViewportScrollY = 0;
    this.rules = {};
    this.strategy = Strategy.None;
    this.translateY = 0;

    this._calcDims = this._calcDims.bind(this);
    this._calcScroll = this._calcScroll.bind(this);
    this._resizeListener = this._resizeListener.bind(this);
    this._scrollListener = this._scrollListener.bind(this);
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
    this._init();
    this._render(State.None);
  }

  /**
   *  Update {@link spaceBottom} and {@link spaceTop}. It fires the render after changes of spaces.
   */
  public updateSpaces(spaces: Pick<OptionsType, 'spaceBottom' | 'spaceTop'>): void {
    this.spaceBottom = spaces.spaceBottom ?? 0;
    this.spaceTop = spaces.spaceTop ?? 0;
    this._init();
    this._resizeListener();
  }

  /**
   * Initialize(reset) properties to default values.
   */
  private _init(): void {
    this.colliderHeight = 0;
    this.colliderTop = 0;
    this.containerHeight = 0;
    this.containerLeft = 0;
    this.containerTop = 0;
    this.containerWidth = 0;
    this.events = [false, false];
    this.isRunningRequest = false;
    this.maxTranslateY = 0;
    this.prevColliderTop = 0;
    this.prevContainerLeft = 0;
    this.prevContainerTop = 0;
    this.prevContainerWidth = 0;
    this.prevElementHeight = 0;
    this.prevState = State.None;
    this.prevStrategy = Strategy.None;
    this.prevViewportScrollX = 0;
    this.prevViewportScrollY = 0;
    this.rules = {};
    this.strategy = Strategy.None;
    this.translateY = 0;
  }

  /**
   * Resize listener.
   */
  private _resizeListener(): void {
    if (this.events[Item.Resize] === false) this.events[Item.Resize] = true;
    this._request();
  }

  /**
   * Scroll listener.
   */
  private _scrollListener(): void {
    if (this.events[Item.Scroll] === false) this.events[Item.Scroll] = true;
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
   * Update styles in {@link containerInner} and {@link container}.
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
        top: this.colliderHeight + this.spaceTop - this.containerInner.offsetHeight + 'px',
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
        this.translateY = this.prevColliderTop - this.containerTop;
      } else if (this.prevState === State.ColliderBottom) {
        this.translateY = this.prevColliderTop + this.colliderHeight - this.containerTop - this.prevElementHeight;
      } else if (this.prevState === State.ContainerBottom) {
        this.translateY = this.containerHeight - this.containerInner.offsetHeight;
      }
      this.rules = {
        position: 'relative',
        transform: `translate3d(0px, ${this.translateY}px, 0px)`,
      };
    }

    this.container.style.position = state === State.ContainerBottom ? 'relative' : 'initial';

    for (const key in this.listOfRules) {
      this.containerInner.style[key as keyof Rules] =
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
   * Get state of {@link containerInner}.
   */
  private _getState(direction: Direction): State {
    if (this.prevState === State.ColliderTop) {
      if (this.colliderTop <= this.containerTop) {
        return State.None;
      }
      if (this.colliderTop + this.containerInner.offsetHeight >= this.containerTop + this.containerHeight) {
        return State.ContainerBottom;
      }
      if (this.prevStrategy === Strategy.Top && this.containerInner.offsetHeight > this.colliderHeight) {
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
        this.prevContainerTop !== this.containerTop ||
        this.prevSpaceBottom !== this.spaceBottom ||
        this.prevSpaceTop !== this.spaceTop
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
      if (this.containerInner.offsetHeight <= this.colliderHeight) {
        return State.ColliderTop;
      }
      if (direction === Direction.Up || this.prevElementHeight !== this.containerInner.offsetHeight) {
        return State.TranslateY;
      }
      if (
        this.prevViewportScrollX !== window.scrollX ||
        this.prevContainerLeft !== this.containerLeft ||
        this.prevContainerWidth !== this.containerWidth ||
        this.prevContainerTop !== this.containerTop ||
        this.prevSpaceBottom !== this.spaceBottom ||
        this.prevSpaceTop !== this.spaceTop
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
      if (this.containerInner.offsetHeight < this.containerTop + this.containerHeight - this.colliderTop) {
        return State.ColliderTop;
      }
      if (this.prevContainerWidth !== this.containerWidth) {
        return State.ContainerBottom;
      }
    } else if (this.prevState === State.None) {
      if (this.colliderTop + this.containerInner.offsetHeight >= this.containerTop + this.containerHeight) {
        return State.ContainerBottom;
      }
      if (this.containerInner.offsetHeight < this.colliderHeight && this.colliderTop >= this.containerTop) {
        return State.ColliderTop;
      }
      if (
        this.strategy === Strategy.Both &&
        this.colliderTop + this.colliderHeight >= this.containerTop + this.containerInner.offsetHeight
      ) {
        return State.ColliderBottom;
      }
    } else if (this.prevState === State.TranslateY) {
      if (this.containerHeight - this.translateY < this.containerInner.offsetHeight) {
        return State.ContainerBottom;
      }
      if (
        this.containerInner.offsetHeight < this.colliderHeight ||
        this.colliderTop <= this.containerTop + this.translateY
      ) {
        return State.ColliderTop;
      }
      if (
        this.translateY < this.maxTranslateY &&
        this.colliderTop + this.colliderHeight > this.containerTop + this.translateY + this.containerInner.offsetHeight
      ) {
        return State.ColliderBottom;
      }
    }

    return State.Rest;
  }

  /**
   * Get a {@link strategy} that determines the further behavior of the {@link containerInner}.
   */
  private _getStrategy(): Strategy {
    if (this.containerHeight <= this.containerInner.offsetHeight) return Strategy.None;
    if (this.colliderHeight < this.containerInner.offsetHeight) return Strategy.Both;
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
    this.maxTranslateY = this.container.clientHeight - this.containerInner.offsetHeight;

    this.strategy = this._getStrategy();

    if (this.strategy === Strategy.None) {
      if (this.prevStrategy !== this.strategy) this._render(State.None);
    } else {
      this._calcScroll();
    }

    this.prevContainerWidth = this.containerWidth;
    this.prevContainerLeft = this.containerLeft;
    this.prevContainerTop = this.containerTop;
    this.prevElementHeight = this.containerInner.offsetHeight;
    this.prevStrategy = this.strategy;
    this.prevSpaceBottom = this.spaceBottom;
    this.prevSpaceTop = this.spaceTop;
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

    this.prevColliderTop = this.colliderTop;
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
      if (this.events[Item.Resize]) {
        this.events[Item.Resize] = false;
        this._calcDims();
      } else if (this.events[Item.Scroll]) {
        this.events[Item.Scroll] = false;
        this._calcScroll();
      }
      this.isRunningRequest = false;
    });
  }

  /**
   * Observe {@link https://developer.mozilla.org/en-US/docs/Web/API/Node|nodes} from {@link containerInner} to {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/body|document body} with help the {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver|ResizeObserver}.
   */
  private _observeTreeNodesFromCurrentToBody(containerInner: HTMLElement): void {
    while (containerInner) {
      this.resizeObserver.observe(containerInner);
      if (containerInner.tagName === 'BODY') break;
      (containerInner as unknown) = containerInner.parentElement;
    }
  }

  /**
   * Add required event listeners. See {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener|addEventListener} and {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver|ResizeObserver}.
   */
  private _addListeners(): void {
    window.addEventListener('scroll', this._scrollListener, {
      capture: false,
      passive: true,
    });
    this._observeTreeNodesFromCurrentToBody(this.containerInner);
  }

  /**
   * Remove all event listeners. See {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener|removeEventListener} and {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver|ResizeObserver}.
   */
  private _removeListeners(): void {
    window.removeEventListener('scroll', this._scrollListener, {
      capture: false,
    });
    this.resizeObserver.disconnect();
  }
}

export default StickNRoll;
