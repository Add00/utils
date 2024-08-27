# Collision utilities

**CDN**: https://unpkg.com/@litecanvas/utils/dist/collision.js

## intersection

Returns the resulting rectangle of the intersection between two rectangles.

Syntax: `intersection(x1, y1, w1, h1, x2, y2, w2, h2): number[]`

```js
import litecanvas from "litecanvas"
import { intersection } from "@litecanvas/utils"

litecanvas({
  loop: { init, draw },
})

function init() {
  // rect = [x, y, width, height]
  rect1 = [0, 0, 50, 50]
  rect2 = [25, 25, 80, 80]
}

function draw() {
  cls(0)
  rectfill(...rect1, 4) // draw the red rectangle
  rectfill(...rect2, 6) // draw the blue rectangle

  // check the collision
  if (colrect(...rect1, ...rect2)) {
    // intersection() returns an array with 4 numbers (x, y, width, height)
    const rect3 = intersection(...rect1, ...rect2)
    rectfill(...rect3, 5) // draw the yellow rectangle
  }
}
```

## resolve

Syntax: `resolve(x1, y1, w1, h1, x2, y2, w2, h2): { direction: string, x: number, y: number }`

```js
import litecanvas from "litecanvas"
import { resolve } from "@litecanvas/utils"

litecanvas({
  loop: { init, draw },
})

function init() {
  // rect = [x, y, width, height]
  rect1 = [300, 170, 50, 50]
  rect2 = [300, 200, 80, 80]

  // check the collision
  if (colrect(...rect1, ...rect2)) {
    const { direction, x, y } = resolve(...rect1, ...rect2)

    // which side of rect1 is colliding with rect2
    console.log(direction) // outputs "bottom"

    // fixes the position of rect1 to
    // no longer collides with rect2
    rect1[0] = x
    rect1[1] = y
  }
}

function draw() {
  cls(0)
  rectfill(...rect2, 6) // blue rectangle
  rectfill(...rect1, 4) // red rectangle
}
```