export class Vector {
  x
  y

  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  toString() {
    return `Vector (${this.x}, ${this.y})`
  }
}

/**
 * Creates a new vector.
 *
 * @param {number} x
 * @param {number} y
 * @returns {Vector}
 */
export const vec = (x = 0, y = 0) => new Vector(x, y)

/**
 * Copy a vector.
 *
 * @param {Vector} v The original vector
 * @returns {Vector} The clone
 */
export const veccopy = (v) => vec(v.x, v.y)

/**
 * Set new values to a vector.
 *
 * @param {Vector} v The vector
 * @param {number} x
 * @param {number} y
 */
export const vecset = (v, x, y) => {
  v.x = x
  v.y = y || x
}

/**
 * Add values to a vector.
 *
 * @param {Vector} v The vector
 * @param {number} x
 * @param {number} y
 */
export const vecadd = (v, x, y) => {
  v.x += x
  v.y += y || x
}

/**
 * Subtracts values from to a vector.
 *
 * @param {Vector} v The vector
 * @param {number} x
 * @param {number} y
 */
export const vecsub = (v, x, y) => {
  v.x -= x
  v.y -= y || x
}

/**
 * Multiplies (scale) a vector.
 *
 * @param {Vector} v
 * @param {number} x
 * @param {number} y
 */
export const vecmult = (v, x, y) => {
  v.x *= x
  v.y *= y || x
}

/**
 * Divides a vector.
 *
 * @param {Vector} v
 * @param {number} x
 * @param {number} y
 */
export const vecdiv = (v, x, y) => {
  v.x /= x
  v.y /= y || x
}

/**
 * Rotates a vector by an angle (in radians) without changing its magnitude.
 *
 * @param {Vector} v
 * @param {number} radians
 */
export const vecrot = (v, radians) => {
  const cos = Math.cos(radians),
    sin = Math.sin(radians)

  v.x = cos * v.x - sin * v.y
  v.y = sin * v.x + cos * v.y
}

/**
 * Calculates the magnitude (length) of the vector.
 *
 * @param {Vector} v
 * @returns {number}
 */
export const vecmag = (v) => Math.sqrt(v.x * v.x + v.y * v.y)

/**
 * Calculates the magnitude (length) of the vector squared.
 *
 * @param {Vector} v
 * @returns {number}
 */
export const vecmag2 = (v) => v.x * v.x + v.y * v.y

/**
 * Scales the components of a vector so that its magnitude is 1.
 *
 * @param {Vector} v
 * @param {boolean} [copy] If `true` return a cloned vector (default: `false`)
 * @returns
 */
export const vecnorm = (v, copy = false) => {
  v = copy ? veccopy(v) : v
  const length = vecmag(v)
  return length > 0 ? vecdiv(v, length, length) : v
}

/**
 * Limits (clamp) a vector's magnitude to a maximum value.
 *
 * @param {Vector} v
 * @param {number} max
 */
export const veclimit = (v, max) => {
  const sq = this.vecmag2(v)
  if (sq > max * max) {
    vecdiv(v, Math.sqrt(sq)) //normalize it
    vecmult(v, max)
  }
}

/**
 * Calculates the distance between two points represented by vectors.
 *
 * @param {Vector} a
 * @param {Vector} b
 * @returns {number}
 */
export const vecdist = (a, b) => {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Calculates the distance between two points represented by vectors squared.
 *
 * @param {Vector} a
 * @param {Vector} b
 * @returns {number}
 */
export const vecdist2 = (a, b) => {
  const dx = a.x - b.x
  const dy = a.y - b.y
  return dx * dx + dy * dy
}

/**
 * Calculates the angle a vector makes with the positive x-axis.
 *
 * @param {Vector} v
 * @returns {number}
 */
export const vecdir = (v) => Math.atan2(v.y, v.x)

/**
 * Calculates the dot product of two vectors.
 *
 * The dot product is a number that describes the overlap between two vectors.
 * Visually, the dot product can be thought of as the "shadow" one vector casts
 * on another. The dot product's magnitude is largest when two vectors point
 * in the same or opposite directions. Its magnitude is 0 when two vectors
 * form a right angle.
 *
 * @param {Vector} a
 * @param {Vector} b
 * @returns {number}
 */
export const vecdot = (a, b) => a.x * b.x + a.y * b.y

/**
 * Calculates the cross product of two vectors.
 *
 * The cross product is a vector that points straight out of the plane created
 * by two vectors. The cross product's magnitude is the area of the parallelogram
 * formed by the original two vectors.
 *
 * @param {Vector} a
 * @param {Vector} b
 * @returns {number}
 */
export const veccross = (a, b) => a.x * b.y - a.y * b.x

/**
 * Calculates new vector values that are proportionally the same distance between two vectors.
 * The `t` parameter is the amount to interpolate between the old vector and the new vector:
 * `0.0` keeps all values equal to the old vector's, `0.5` is halfway between, and `1.0` sets all
 * values equal to the new vector's.
 *
 * @param {Vector} a
 * @param {Vector} b
 * @param {number} t
 * @returns
 */
export const lerp = (a, b, t) => {
  a.x += (b.x - a.x) * t || 0
  a.y += (b.y - a.y) * t || 0
}

/**
 * Sample a vector with random direction and (optional) length.
 *
 * If the `litecanvas#rand()` not is globally explosed, uses `Math.random()`.
 * You can set `vecconfig.random` to set your own "random" function.
 *
 * @param {number} minlength
 * @param {number} maxlength
 * @param {() => number} randomFn
 * @returns
 */
export const vecrand = (minlength = 1, maxlength = minlength) => {
  const angle = vecconfig.random() * 2 * Math.PI
  const radius = vecconfig.random() * (maxlength - minlength) + minlength
  return vec(Math.cos(angle) * radius, Math.sin(angle) * radius)
}

export const vecconfig = {
  random: () => {
    return globalThis.rand ? rand() : Math.random()
  },
}
