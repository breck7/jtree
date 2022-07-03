{
  class dugNode extends jtree.GrammarBackedNode {
    createParser() {
      return new jtree.TreeNode.Parser(
        errorNode,
        Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {
          null: nullNode,
          number: numberNode,
          string: stringNode,
          boolean: booleanNode,
          object: objectNode,
          array: arrayNode
        }),
        undefined
      )
    }
    compile() {
      const res = super.compile()
      return JSON.stringify(JSON.parse(res), null, 2)
    }
    getHandGrammarProgram() {
      if (!this._cachedHandGrammarProgramRoot)
        this._cachedHandGrammarProgramRoot = new jtree.HandGrammarProgram(`tooling onsave jtree build produceLang dug
todo Add swarm tests for top scenarios, including the scalar at root level scenario.
todo Create a new language, similar to this, except using pattern matching instead of prefix notation.
anyCell
keywordCell
 highlightScope keyword
stringCell
 highlightScope string
booleanCell
 enum true false
 highlightScope constant.numeric
numberCell
 highlightScope constant.numeric
dugNode
 root
 description A demonstration prefix Tree Language that compiles to JSON.
 inScope abstractValueNode
 catchAllNodeType errorNode
 javascript
  compile() {
   const res = super.compile()
   return JSON.stringify(JSON.parse(res), null, 2)
  }
abstractValueNode
 cells keywordCell
 abstract
nullNode
 compiler
  stringTemplate null
 extends abstractValueNode
 crux null
numberNode
 crux number
 extends abstractValueNode
 cells keywordCell numberCell
 compiler
  stringTemplate {numberCell}
stringNode
 crux string
 catchAllCellType stringCell
 compiler
  stringTemplate "{stringCell}"
 extends abstractValueNode
booleanNode
 crux boolean
 extends abstractValueNode
 cells keywordCell booleanCell
 compiler
  stringTemplate {booleanCell}
objectNode
 crux object
 catchAllNodeType memberNode
 extends abstractValueNode
 compiler
  stringTemplate  
  joinChildrenWith , 
  openChildren {
  closeChildren }
arrayNode
 crux array
 extends abstractValueNode
 inScope abstractValueNode
 compiler
  stringTemplate  
  joinChildrenWith , 
  openChildren [
  closeChildren ]
memberNode
 inScope abstractValueNode
 compiler
  stringTemplate "{stringCell}" :
 cells stringCell
errorNode
 baseNodeType errorNode`)
      return this._cachedHandGrammarProgramRoot
    }
    static getNodeTypeMap() {
      return {
        dugNode: dugNode,
        abstractValueNode: abstractValueNode,
        nullNode: nullNode,
        numberNode: numberNode,
        stringNode: stringNode,
        booleanNode: booleanNode,
        objectNode: objectNode,
        arrayNode: arrayNode,
        memberNode: memberNode,
        errorNode: errorNode
      }
    }
  }

  class abstractValueNode extends jtree.GrammarBackedNode {
    get keywordCell() {
      return this.getWord(0)
    }
  }

  class nullNode extends abstractValueNode {}

  class numberNode extends abstractValueNode {
    get keywordCell() {
      return this.getWord(0)
    }
    get numberCell() {
      return parseFloat(this.getWord(1))
    }
  }

  class stringNode extends abstractValueNode {
    get stringCell() {
      return this.getWordsFrom(0)
    }
  }

  class booleanNode extends abstractValueNode {
    get keywordCell() {
      return this.getWord(0)
    }
    get booleanCell() {
      return this.getWord(1)
    }
  }

  class objectNode extends abstractValueNode {
    createParser() {
      return new jtree.TreeNode.Parser(memberNode, undefined, undefined)
    }
  }

  class arrayNode extends abstractValueNode {
    createParser() {
      return new jtree.TreeNode.Parser(
        undefined,
        Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {
          null: nullNode,
          number: numberNode,
          string: stringNode,
          boolean: booleanNode,
          object: objectNode,
          array: arrayNode
        }),
        undefined
      )
    }
  }

  class memberNode extends jtree.GrammarBackedNode {
    createParser() {
      return new jtree.TreeNode.Parser(
        undefined,
        Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {
          null: nullNode,
          number: numberNode,
          string: stringNode,
          boolean: booleanNode,
          object: objectNode,
          array: arrayNode
        }),
        undefined
      )
    }
    get stringCell() {
      return this.getWord(0)
    }
  }

  class errorNode extends jtree.GrammarBackedNode {
    getErrors() {
      return this._getErrorNodeErrors()
    }
  }

  window.dugNode = dugNode
}
