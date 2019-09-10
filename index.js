/**
 * The most important concept in developing a sketch is to not use any
 * fixed value that represents a dimension, like width, height, line thickness.
 *
 * Instead use the vw, vh functions that works like the similar CSS properies:
 * https://web-design-weekly.com/2014/11/18/viewport-units-vw-vh-vmin-vmax/
 */
import { vw, vh, setDimensions } from './lib/unit';
import Random from './lib/random';

/**
 * To improve readibility, destructure the default Math object
 */
const { PI, cos, sin, sqrt, abs } = Math;

/**
 * These libraries are provided to you:
 *
 *  - Simplex noise:
 *    https://github.com/jwagner/simplex-noise.js
 *    A wrapper function is provided in the Random class, see example.
 *
 *  - Three.js is mostly here for the Math functions:
 *    https://threejs.org/docs/index.html#api/en/math/Math
 *    https://threejs.org/docs/index.html#api/en/math/Vector2
 *    Simply import the required functions from Three, like below.
 */
import { Vector2 } from 'three';

/**
 * This is normally provided from a UI component to the random generator
 * but for development pruposes it's also set to random;
 */
const randomSeed = Math.random() * 10000;

/**
 * Keep all your code in the Design class
 */
class Design {
    constructor() {
        this.random = new Random(randomSeed);
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');
        setDimensions(this.canvas.width, this.canvas.height);
    }

    clear() {
        const { width, height } = this.canvas;
        this.ctx.clearRect(0, 0, width, height);
    }

    render() {
        this.clear();
        this.ctx.fillStyle = 'rgba(0, 70, 200)';
        this.ctx.fillRect(0, 0, vw(100), vh(100));

        // draw a simple vertical line
        this.ctx.fillStyle = 'white';
        const randomPos = this.random.intValue(100);
        this.ctx.fillRect(vw(randomPos), 0, vw(1), vh(100));

        // draw a noise line
        this.ctx.strokeStyle = 'rgba(200, 70, 0)';
        let pos = 0;
        this.ctx.beginPath();
        this.ctx.moveTo(0, vh(50));

        for (let i = 0; i < 100; i++) {
            pos += 0.1;
            const x = this.random.noise('1d', pos);
            this.ctx.lineTo(vw(i), vh(50) + x * vw(10));
        }
        this.ctx.stroke();
    }
}

const artwork = new Design();
artwork.render();
