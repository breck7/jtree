//tooling product jtree.node.js
//tooling product jtree.browser.js

abstract class AbstractNode {
  protected _getProcessTimeInMilliseconds() {
    const hrtime = process.hrtime()
    return (hrtime[0] * 1e9 + hrtime[1]) / 1e6
  }
}

export default AbstractNode
