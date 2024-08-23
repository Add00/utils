class Grid {
  constructor(width, height) {
    this._width = Math.abs(width)
    this._height = Math.abs(height)
    this.clear()
  }

  set(x, y, value) {
    this.__cells[this.__getIndex(x, y)] = value
    return this
  }

  get(x, y) {
    return this.__cells[this.__getIndex(x, y)] || null
  }

  has(x, y) {
    return this.get(x, y) != null
  }

  get width() {
    return this._width
  }

  get height() {
    return this._height
  }

  get length() {
    return this._width * this._height
  }

  forEach(callback, reverse = false) {
    const cells = this.__cells,
      w = this._width,
      h = this._height,
      limitX = !reverse ? w : -1,
      limitY = !reverse ? h : -1
    let x = !reverse ? 0 : w - 1,
      y = !reverse ? 0 : h - 1

    while (y != limitY) {
      let proceed
      x = !reverse ? 0 : w - 1
      while (x != limitX) {
        proceed = callback(cells[this.__getIndex(x, y)], x, y, this)
        if (false === proceed) break
        x += reverse ? -1 : 1
      }
      if (false === proceed) break
      y += reverse ? -1 : 1
    }
    return this
  }

  clone() {
    return Grid.fromArray(this._width, this._height, this.__cells)
  }

  clear() {
    this.__cells = Array(this._width * this._height)
    return this
  }

  clipX(x) {
    return this.__clip(x, 0, this._width - 1)
  }

  clipY(y) {
    return this.__clip(y, 0, this._height - 1)
  }

  toArray() {
    return this.__cells.slice(0)
  }

  toString() {
    return this.__cells.join(",")
  }

  // internals
  __getIndex(x, y) {
    x = this.clipX(x)
    y = this.clipY(y)
    return x + y * this._width
  }

  __clip(n, min, max) {
    return Math.min(Math.max(n, min), max)
  }
}
