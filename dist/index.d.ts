//#region src/index.d.ts
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
 * stick-n-roll - helps to give an element sticky scrolling capability.
 * @version 1.1.2
 * @link https://github.com/devashtar/stick-n-roll
 * @author devashtar <omg.michael.here@gmail.com>
 * @license The MIT License (MIT)
 */
declare class StickNRoll {
  /**
   * Parent element of {@link containerInner}.
   */
  private container;
  /**
   * Target element with sticky and scroll abilities.
   */
  private containerInner;
  /**
   * Triggered Event.
   */
  private events;
  /**
   * Indicates that a render request has already been initiated.
   * @default false
   */
  private isRunningRequest;
  /**
   * The Current Y-axis coordinates relative to the {@link container}.
   */
  private translateY;
  /**
   * The maximum allowed Y-axis coordinates relative to the {@link container}.
   */
  private maxTranslateY;
  /**
   * Previous {@link containerInner} height.
   */
  private prevElementHeight;
  /**
   * Height of the {@link container}.
   */
  private containerHeight;
  /**
   * Width of the {@link container}.
   */
  private containerWidth;
  /**
   * Coordinate by X-axis of the {@link container}.
   */
  private containerLeft;
  /**
   * Coordinate by Y-axis of the {@link container}.
   */
  private containerTop;
  /**
   * Previous width of the {@link container}.
   */
  private prevContainerWidth;
  /**
   * Previous coordinate by X-axis of the {@link container}.
   */
  private prevContainerLeft;
  /**
   * Previous coordinate by Y-axis of the {@link container}.
   */
  private prevContainerTop;
  /**
   * Height of the {@link collider}.
   */
  private colliderHeight;
  /**
   * Top coordinate of the {@link collider}.
   */
  private colliderTop;
  /**
   * Previous top coordinate of the {@link collider}.
   */
  private prevColliderTop;
  /**
   * Previous coordinate by X-axis of the {@link https://developer.mozilla.org/en-US/docs/Glossary/Viewport|viewport}.
   */
  private prevViewportScrollX;
  /**
   * Previous coordinate by Y-axis of the {@link https://developer.mozilla.org/en-US/docs/Glossary/Viewport|viewport}.
   */
  private prevViewportScrollY;
  /**
   * Space top.
   * @default 0
   */
  private spaceTop;
  /**
   * Previous space top.
   * @default 0
   */
  private prevSpaceTop;
  /**
   * Space bottom.
   * @default 0
   */
  private spaceBottom;
  /**
   * Previous space bottom.
   * @default 0
   */
  private prevSpaceBottom;
  /**
   *  Resize observer.
   */
  private resizeObserver;
  /**
   * Current strategy. Helps to detect {@link containerInner} behaviour.
   * @default Strategy.None
   */
  private strategy;
  /**
   * Previous strategy.
   * @default Strategy.None
   */
  private prevStrategy;
  /**
   * Previous state.
   * @default Variant.None
   */
  private prevState;
  /**
   * List of available CSS properties. Also is used as default values for rules.
   */
  private listOfRules;
  /**
   * List of css properties to be updated.
   */
  private rules;
  /**
   * @param {HTMLElement} container - The parent element({@link container}) of {@link containerInner}.
   * @param {HTMLElement} containerInner - The {@link containerInner} which will be endowed with stickiness and scrolling abilities relative to its parent element({@link container}).
   */
  constructor(container: HTMLElement, containerInner: HTMLElement, options?: OptionsType);
  /**
   * Enable sticky scrolling capability. Use {@link disable} method to deactivate sticky scrolling capability.
   */
  enable(): void;
  /**
   * Disable sticky scrolling capability. Use {@link enable} method to activate sticky scrolling capability again.
   */
  disable(): void;
  /**
   *  Update {@link spaceBottom} and {@link spaceTop}. It fires the render after changes of spaces.
   */
  updateSpaces(spaces: Pick<OptionsType, 'spaceBottom' | 'spaceTop'>): void;
  /**
   * Initialize(reset) properties to default values.
   */
  private _init;
  /**
   * Resize listener.
   */
  private _resizeListener;
  /**
   * Scroll listener.
   */
  private _scrollListener;
  /**
   * Get coordinates for passed element.
   */
  private _getCoords;
  /**
   * Update styles in {@link containerInner} and {@link container}.
   */
  private _render;
  /**
   * Get the scroll direction. `None` for horizontal scrolling or no scrolling.
   */
  private _getDirection;
  /**
   * Get state of {@link containerInner}.
   */
  private _getState;
  /**
   * Get a {@link strategy} that determines the further behavior of the {@link containerInner}.
   */
  private _getStrategy;
  /**
   * Calculate {@link https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements|dimensions}.
   */
  private _calcDims;
  /**
   * Calculate {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSSOM_view/Coordinate_systems|coordinates}.
   */
  private _calcScroll;
  /**
   * Helps apply DOM manipulation and synchronize processing with rendering. See {@link https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame|requestAnimationFrame}.
   */
  private _request;
  /**
   * Observe {@link https://developer.mozilla.org/en-US/docs/Web/API/Node|nodes} from {@link containerInner} to {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/body|document body} with help the {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver|ResizeObserver}.
   */
  private _observeTreeNodesFromCurrentToBody;
  /**
   * Add required event listeners. See {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener|addEventListener} and {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver|ResizeObserver}.
   */
  private _addListeners;
  /**
   * Remove all event listeners. See {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener|removeEventListener} and {@link https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver|ResizeObserver}.
   */
  private _removeListeners;
}
//#endregion
export { StickNRoll, StickNRoll as default };
//# sourceMappingURL=index.d.ts.map