let width = 0;
let height = 0;

/**
 * Helps to get a pixel value based on a percentage of the actual width
 * @param {float} percent: A number representing a position on a normalized (0-100) range
 */
export function vw(percent) {
    return width * (percent / 100);
}

/**
 * Helps to get a pixel value based on a percentage of the actual height
 * @param {float} percent: A number representing a position on a normalized (0-100) range
 */
export function vh(percent) {
    return height * (percent / 100);
}

/**
 * Setup the unit lib with canvas dimensions
 * @param {int} _width
 * @param {int} _height
 */
export function setDimensions(_width, _height) {
    width = _width;
    height = _height;
}
