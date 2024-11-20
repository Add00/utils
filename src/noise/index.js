// further adapted from p5 Noise module
// https://github.com/processing/p5.js/blob/v1.11.1/src/math/noise.js

// http://mrl.nyu.edu/~perlin/noise/
// Adapting from PApplet.java
// which was adapted from toxi
// which was adapted from the german demo group farbrausch
// as used in their demo "art": http://www.farb-rausch.de/fr010src.zip

/**
 * Constants for Perlin noise calculations.
 */
const PERLIN_YWRAPB = 4;
const PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
const PERLIN_ZWRAPB = 8;
const PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
const PERLIN_SIZE = 4095;

/**
 * Scaled cosine function used for smoothing transitions in Perlin noise.
 * @param {number} i - Input value.
 * @returns {number} Scaled cosine value.
 */
const scaled_cosine = i => 0.5 * (1.0 - Math.cos(i * Math.PI));

/**
 * Class for generating Perlin noise, a type of gradient noise often used in procedural generation.
 */
export class Noise {
  /**
   * Array to store Perlin noise values, initialized lazily.
   * @type {number[] | null}
   * @private
   */
  _perlin = null;

  /**
   * Number of octaves for the Perlin noise. Higher values create more detail.
   * @type {number}
   * @private
   */
  _perlin_octaves = 4;

  /**
   * Amplitude falloff factor for Perlin noise. Determines the reduction of amplitude per octave.
   * @type {number}
   * @private
   */
  _perlin_amp_falloff = 0.5;

  /**
   * Generates Perlin noise for the given coordinates.
   * @param {number} x - X-coordinate.
   * @param {number} [y=0] - Y-coordinate (default is 0).
   * @param {number} [z=0] - Z-coordinate (default is 0).
   * @returns {number} A noise value in the range [0, 1).
   */
  noise(x, y = 0, z = 0) {
    if (this._perlin == null) {
      this._perlin = new Array(PERLIN_SIZE + 1);
      for (let i = 0; i < PERLIN_SIZE + 1; i++) {
        this._perlin[i] = Math.random();
      }
    }

    if (x < 0) {
      x = -x;
    }
    if (y < 0) {
      y = -y;
    }
    if (z < 0) {
      z = -z;
    }

    let xi = Math.floor(x),
      yi = Math.floor(y),
      zi = Math.floor(z);
    let xf = x - xi;
    let yf = y - yi;
    let zf = z - zi;
    let rxf, ryf;

    let r = 0;
    let ampl = 0.5;

    let n1, n2, n3;

    for (let o = 0; o < this._perlin_octaves; o++) {
      let of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);

      rxf = scaled_cosine(xf);
      ryf = scaled_cosine(yf);

      n1 = this._perlin[of & PERLIN_SIZE];
      n1 += rxf * (this._perlin[(of + 1) & PERLIN_SIZE] - n1);
      n2 = this._perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
      n2 += rxf * (this._perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
      n1 += ryf * (n2 - n1);

      of += PERLIN_ZWRAP;
      n2 = this._perlin[of & PERLIN_SIZE];
      n2 += rxf * (this._perlin[(of + 1) & PERLIN_SIZE] - n2);
      n3 = this._perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
      n3 += rxf * (this._perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
      n2 += ryf * (n3 - n2);

      n1 += scaled_cosine(zf) * (n2 - n1);

      r += n1 * ampl;
      ampl *= this._perlin_amp_falloff;
      xi <<= 1;
      xf *= 2;
      yi <<= 1;
      yf *= 2;
      zi <<= 1;
      zf *= 2;

      if (xf >= 1.0) {
        xi++;
        xf--;
      }
      if (yf >= 1.0) {
        yi++;
        yf--;
      }
      if (zf >= 1.0) {
        zi++;
        zf--;
      }
    }
    return r;
  }

  /**
   * Adjusts the detail level of the noise by setting the number of octaves and amplitude falloff.
   * @param {number} lod - Level of detail (number of octaves).
   * @param {number} falloff - Amplitude falloff per octave.
   */
  noiseDetail(lod, falloff) {
    if (lod > 0) {
      this._perlin_octaves = lod;
    }
    if (falloff > 0) {
      this._perlin_amp_falloff = falloff;
    }
  }

  /**
   * Sets a seed for the Perlin noise generator, ensuring deterministic results.
   * @param {number} seed - Seed value.
   */
  noiseSeed(seed) {
    // Linear Congruential Generator
    // Variant of a Lehman Generator
    const lcg = (() => {
      // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
      // m is basically chosen to be large (as it is the max period)
      // and for its relationships to a and c
      const m = 4294967296;
      // a - 1 should be divisible by m's prime factors
      const a = 1664525;
      // c and m should be co-prime
      const c = 1013904223;
      let seed, z;
      return {
        setSeed(val) {
          // pick a random seed if val is undefined or null
          // the >>> 0 casts the seed to an unsigned 32-bit integer
          z = seed = (val == null ? Math.random() * m : val) >>> 0;
        },
        getSeed() {
          return seed;
        },
        rand() {
          // define the recurrence relationship
          z = (a * z + c) % m;
          // return a float in [0, 1)
          // if z = m then z / m = 0 therefore (z % m) / m < 1 always
          return z / m;
        }
      };
    })();

    lcg.setSeed(seed);
    this._perlin = new Array(PERLIN_SIZE + 1);
    for (let i = 0; i < PERLIN_SIZE + 1; i++) {
      this._perlin[i] = lcg.rand();
    }
  }
}