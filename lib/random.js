import SimplexNoise from 'simplex-noise';
import Poisson from './poisson';

/**
 * Randomness helper class
 */
export default class Random {
    constructor(seed) {
        this.seed = seed;
        this._randomBuffer = seed;
        this._hasNextGaussian = false;
        this._nextGaussian = null;
        this.simplex = new SimplexNoise(this.seed + 1);
    }

    value() {
        var t = this._randomBuffer += 0xABAD1DEA;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }

    intValue(max) {
        return Math.round(this.value() * max);
    }

    onCircle(radius = 1, out) {
        out = out || [];
        var theta = this.value() * 2.0 * Math.PI;
        out[0] = radius * Math.cos(theta);
        out[1] = radius * Math.sin(theta);
        return out;
    }

    insideCircle(radius = 1, out) {
        out = out || [];
        this.onCircle(1, out);
        var r = radius * Math.sqrt(this.value());
        out[0] *= r;
        out[1] *= r;
        return out;
    }

    gaussian(mean = 0, standardDerivation = 1) {
        // https://github.com/openjdk-mirror/jdk7u-jdk/blob/f4d80957e89a19a29bb9f9807d2a28351ed7f7df/src/share/classes/java/util/Random.java#L496
        if (this._hasNextGaussian) {
            this._hasNextGaussian = false;
            var result = this._nextGaussian;
            this._nextGaussian = null;
            return mean + standardDerivation * result;
        } else {
            var v1 = 0;
            var v2 = 0;
            var s = 0;
            do {
                v1 = this.value() * 2 - 1; // between -1 and 1
                v2 = this.value() * 2 - 1; // between -1 and 1
                s = v1 * v1 + v2 * v2;
            } while (s >= 1 || s === 0);
            var multiplier = Math.sqrt(-2 * Math.log(s) / s);
            this._nextGaussian = (v2 * multiplier);
            this._hasNextGaussian = true;
            return mean + standardDerivation * (v1 * multiplier);
        }
    }

    noise(dimension, ...params) {
        let noise;
        switch (dimension) {
            case '1d':
                noise = this.simplex.noise2D(params[0], 0);
                break;
            case '2d':
                noise = this.simplex.noise2D(params[0], params[1]);
                break;
            case '3d':
                noise = this.simplex.noise3D(params);
                break;
            case '4d':
                noise = this.simplex.noise4D(params);
                break;
            default:
                throw new Error('Dimensionality of the noise is not supported: ' + dimension);
        }
        return noise;
    }

    poisson(width, height, spacing) {
        Poisson.init(width, height, spacing, this.value.bind(this));
        return Poisson.generatePoints();
    }

    /**
     * @param {array} inputArray array to be shuffled
     * @returns new array of shuffled items
     */
    shuffle(inputArray) {
        const array = Array.from(inputArray);
        let counter = array.length;
        // While there are elements in the array
        while (counter > 0) {
            // Pick a random index
            let index = Math.floor(this.value() * counter);
            // Decrease counter by 1
            counter--;
            // And swap the last element with it
            let temp = array[counter];
            array[counter] = array[index];
            array[index] = temp;
        }
        return array;
    }

}
