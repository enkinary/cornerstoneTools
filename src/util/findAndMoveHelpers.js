import { state } from '../store/index.js';
import getHandleNearImagePoint from '../manipulators/getHandleNearImagePoint.js';
import { moveHandle, moveAllHandles } from './../manipulators/index.js';

// TODO this should just be in manipulators? They are just manipulator wrappers anyway.

/**
 * Moves a handle near the image point.
 * @public
 * @function moveHandleNearImagePoint
 * @memberof Util
 *
 * @param  {Event} evt      The event.
 * @param  {string} toolName The name of the tool the handle corrosponds to.
 * @param  {Object} toolData     The toolData that corresponds to the handle.
 * @param  {Object} handle  The handle to be moved.
 * @param  {string} interactionType
 * @returns {undefined}
 */
const moveHandleNearImagePoint = function(
  evt,
  toolName,
  toolData,
  handle,
  interactionType
) {
  toolData.active = true;
  state.isToolLocked = true;

  moveHandle(
    evt.detail,
    toolName,
    toolData,
    handle,
    // TODO: Options that aren't static / can't be overridden
    {
      preventHandleOutsideImage: true,
      doneMovingCallback: () => {
        toolData.active = false;
        state.isToolLocked = false;
      },
    },
    interactionType
  );

  evt.stopImmediatePropagation();
  evt.stopPropagation();
  evt.preventDefault();

  return;
};

/**
 * Finds the handle near the image point and its corresponding data.
 *
 * @public
 * @function findHandleDataNearImagePoint
 * @memberof Util
 *
 * @param  {HTMLElement} element  The elment.
 * @param  {Object} toolState     The state of the tool.
 * @param  {string} toolName The name of the tool the handle corrosponds to.
 * @param  {Object} coords The coordinates that need to be checked.
 * @returns {*}
 */
const findHandleDataNearImagePoint = function(
  element,
  toolState,
  toolName,
  coords
) {
  for (let i = 0; i < toolState.data.length; i++) {
    const data = toolState.data[i];
    const handle = getHandleNearImagePoint(
      element,
      data.handles,
      coords,
      state.clickProximity
    );

    if (handle) {
      return {
        handle,
        data,
      };
    }
  }
};

/**
 * Moves an entire annotation near the click.
 *
 * @public
 * @function moveAnnotation
 * @memberof Util
 *
 * @param  {Event}   evt           The event.
 * @param  {Object}  tool The tool that the annotation belongs to.
 * @param  {string}  tool.name
 * @param  {Object}  [tool.options={}]
 * @param  {Boolean} [tool.options.preventHandleOutsideImage]
 * @param  {Boolean} [tool.options.deleteIfHandleOutsideImage]
 * @param  {Object}  annotation The toolData that corresponds to the annotation.
 * @param  {String}  [interactionType=mouse]
 * @returns {undefined}
 */
const moveAnnotation = function(
  evt,
  tool,
  annotation,
  interactionType = 'mouse'
) {
  const options = Object.assign(
    {},
    {
      deleteIfHandleOutsideImage: true,
      preventHandleOutsideImage: false,
      doneMovingCallback: () => {
        annotation.active = false;
        state.isToolLocked = false;
      },
    },
    tool.options
  );

  annotation.active = true;
  state.isToolLocked = true;

  moveAllHandles(
    evt.detail,
    tool.name,
    annotation,
    null,
    options,
    interactionType
  );

  evt.stopImmediatePropagation();
  evt.stopPropagation();
  evt.preventDefault();

  return;
};

export {
  moveHandleNearImagePoint,
  findHandleDataNearImagePoint,
  moveAnnotation,
};

// TouchMoveAllHandles(
//   Evt,
//   FirstAnnotationNearPoint,
//   ToolState,
//   FirstToolNearPoint.name,
//   True,
//   (lastEvent, lastEventData) => {
//     FirstAnnotationNearPoint.active = false;
//     FirstAnnotationNearPoint.invalidated = true;
//     //   If (anyHandlesOutsideImage(eventData, data.handles)) {
//     //     // Delete the measurement
//     //     RemoveToolState(
//     //       EventData.element,
//     //       TouchToolInterface.toolType,
//     //       Data
//     //     );
//     //   }

//     External.cornerstone.updateImage(element);
//     // Todo: LISTEN: TAP, START, PRESS

//     If (lastEvent && lastEvent.type === EVENTS.TOUCH_PRESS) {
//       TriggerEvent(element, lastEvent.type, lastEventData);
//     }
//   }
// );
// Evt.stopImmediatePropagation();
// Evt.preventDefault();
// Evt.stopPropagation();
