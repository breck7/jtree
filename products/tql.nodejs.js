#! /usr/bin/env node
{
  const { Utils } = require("./Utils.js")
  const { TreeNode } = require("./TreeNode.js")
  const { HandGrammarProgram } = require("./GrammarLanguage.js")
  const { GrammarBackedNode } = require("./GrammarLanguage.js")

  class tqlNode extends GrammarBackedNode {
    createParser() {
      return new TreeNode.Parser(
        catchAllErrorNode,
        Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {
          has: includesTextNode,
          hasNo: doesNotIncludeTextNode,
          where: whereNode,
          missing: fieldIsMissingNode,
          notMissing: fieldIsNotMissingNode,
          matching: matchesNode,
          notMatching: doesNotMatchNode,
          "#": commentNode
        }),
        [{ regex: /^$/, nodeConstructor: blankLineNode }]
      )
    }
    get tests() {
      const tests = this.filter(node => node.toPredicate).map(node => {
        const predicate = node.toPredicate()
        return node.flip ? file => !predicate(file) : predicate
      })
      return tests
    }
    filterFolder(treeBaseFolder) {
      const { tests } = this
      const predicate = file => tests.every(fn => fn(file))
      return treeBaseFolder.filter(file => predicate(file))
    }
    static cachedHandGrammarProgramRoot = new HandGrammarProgram(`keywordCell
 highlightScope keyword
comparisonCell
 enum < > = != has hasNo
stringCell
 highlightScope string
permalinkCell
 highlightScope string
regexCell
 highlightScope string
numberCell
 highlightScope constant.numeric
numberOrStringCell
 highlightScope constant.numeric
commentCell
 highlightScope comment
columnNameCell
 description The field to search on.
 highlightScope constant.numeric
blankCell
tqlNode
 root
 description Tree Query Language (TQL) is a new language for searching a TreeBase.
 catchAllNodeType catchAllErrorNode
 inScope abstractQueryNode blankLineNode commentNode
 javascript
  get tests() {
    const tests = this.filter(node => node.toPredicate).map(node => {
        const predicate = node.toPredicate()
        return node.flip ? (file) => !predicate(file)  : predicate
    })
    return tests
  }
  filterFolder(treeBaseFolder) {
    const {tests} = this
    const predicate = file => tests.every(fn => fn(file))
    return treeBaseFolder.filter(file => predicate(file))
  }
abstractQueryNode
 cells keywordCell
 inScope abstractQueryNode commentNode
 javascript
  toPredicate() {
    return () => true
  }
catchAllErrorNode
 baseNodeType errorNode
blankLineNode
 description Blank lines are ignored.
 cells blankCell
 compiler
  stringTemplate 
 pattern ^$
 tags doNotSynthesize
 boolean shouldSerialize false
includesTextNode
 extends abstractQueryNode
 description Global text search against each file. Case insensitive.
 catchAllCellType stringCell
 crux has
 javascript
  toPredicate() {
    const query = (this.getContent() ?? "").toLowerCase()
    return file => file.lowercase.includes(query)
  }
doesNotIncludeTextNode
 description Reverse of global text search against each file. Case insensitive.
 extends includesTextNode
 crux hasNo
 boolean flip true
whereNode
 description Find files whose value in the given column meet this condition.
 extends abstractQueryNode
 cells keywordCell columnNameCell comparisonCell
 catchAllCellType numberOrStringCell
 crux where
 javascript
  get columnName() {
    return this.getWord(1)
  }
  get operator() {
    return this.getWord(2)
  }
  get numericValue() {
    return parseFloat(this.getWord(3))
  }
  toPredicate() {
    const {columnName, operator} = this
    if (operator === ">")
      return file => file.typed[columnName] > this.numericValue
    if (operator === "<")
      return file => file.typed[columnName] < this.numericValue
    const stringValue = this.getWordsFrom(3).join(" ")
    if (operator === "=")
      return file => file.typed[columnName] == this.numericValue
    if (operator === "!=")
      return file => file.typed[columnName] != this.numericValue
    if (operator === "has")
      return file => file.typed[columnName].includes(stringValue)
    if (operator === "hasNo")
      return file => !file.typed[columnName].includes(stringValue)
  }
fieldIsMissingNode
 description Find files whose value in the given column is missing.
 extends abstractQueryNode
 cells keywordCell columnNameCell
 crux missing
 javascript
  toPredicate() {
    const columnName = this.getWord(1)
    return file => !file.has(columnName)
  }
fieldIsNotMissingNode
 description Find files whose value in the given column is not missing.
 extends fieldIsMissingNode
 crux notMissing
 boolean flip true
matchesNode
 description Search by regex.
 extends abstractQueryNode
 catchAllCellType regexCell
 crux matching
 javascript
  toPredicate() {
    const regex = new RegExp(this.getContent() ?? "")
    return file => regex.test(file.toString())
  }
doesNotMatchNode
 description Find files that do NOT match this regex.
 extends matchesNode
 crux notMatching
 boolean flip true
commentNode
 description Comments are ignored.
 crux #
 cells commentCell
 catchAllCellType commentCell
 catchAllNodeType commentNode`)
    getHandGrammarProgram() {
      return this.constructor.cachedHandGrammarProgramRoot
    }
    static getNodeTypeMap() {
      return {
        tqlNode: tqlNode,
        abstractQueryNode: abstractQueryNode,
        catchAllErrorNode: catchAllErrorNode,
        blankLineNode: blankLineNode,
        includesTextNode: includesTextNode,
        doesNotIncludeTextNode: doesNotIncludeTextNode,
        whereNode: whereNode,
        fieldIsMissingNode: fieldIsMissingNode,
        fieldIsNotMissingNode: fieldIsNotMissingNode,
        matchesNode: matchesNode,
        doesNotMatchNode: doesNotMatchNode,
        commentNode: commentNode
      }
    }
  }

  class abstractQueryNode extends GrammarBackedNode {
    createParser() {
      return new TreeNode.Parser(
        undefined,
        Object.assign(Object.assign({}, super.createParser()._getFirstWordMapAsObject()), {
          has: includesTextNode,
          hasNo: doesNotIncludeTextNode,
          where: whereNode,
          missing: fieldIsMissingNode,
          notMissing: fieldIsNotMissingNode,
          matching: matchesNode,
          notMatching: doesNotMatchNode,
          "#": commentNode
        }),
        undefined
      )
    }
    get keywordCell() {
      return this.getWord(0)
    }
    toPredicate() {
      return () => true
    }
  }

  class catchAllErrorNode extends GrammarBackedNode {
    getErrors() {
      return this._getErrorNodeErrors()
    }
  }

  class blankLineNode extends GrammarBackedNode {
    get blankCell() {
      return this.getWord(0)
    }
    get shouldSerialize() {
      return false
    }
  }

  class includesTextNode extends abstractQueryNode {
    get stringCell() {
      return this.getWordsFrom(0)
    }
    toPredicate() {
      const query = (this.getContent() ?? "").toLowerCase()
      return file => file.lowercase.includes(query)
    }
  }

  class doesNotIncludeTextNode extends includesTextNode {
    get flip() {
      return true
    }
  }

  class whereNode extends abstractQueryNode {
    get keywordCell() {
      return this.getWord(0)
    }
    get columnNameCell() {
      return this.getWord(1)
    }
    get comparisonCell() {
      return this.getWord(2)
    }
    get numberOrStringCell() {
      return this.getWordsFrom(3)
    }
    get columnName() {
      return this.getWord(1)
    }
    get operator() {
      return this.getWord(2)
    }
    get numericValue() {
      return parseFloat(this.getWord(3))
    }
    toPredicate() {
      const { columnName, operator } = this
      if (operator === ">") return file => file.typed[columnName] > this.numericValue
      if (operator === "<") return file => file.typed[columnName] < this.numericValue
      const stringValue = this.getWordsFrom(3).join(" ")
      if (operator === "=") return file => file.typed[columnName] == this.numericValue
      if (operator === "!=") return file => file.typed[columnName] != this.numericValue
      if (operator === "has") return file => file.typed[columnName].includes(stringValue)
      if (operator === "hasNo") return file => !file.typed[columnName].includes(stringValue)
    }
  }

  class fieldIsMissingNode extends abstractQueryNode {
    get keywordCell() {
      return this.getWord(0)
    }
    get columnNameCell() {
      return this.getWord(1)
    }
    toPredicate() {
      const columnName = this.getWord(1)
      return file => !file.has(columnName)
    }
  }

  class fieldIsNotMissingNode extends fieldIsMissingNode {
    get flip() {
      return true
    }
  }

  class matchesNode extends abstractQueryNode {
    get regexCell() {
      return this.getWordsFrom(0)
    }
    toPredicate() {
      const regex = new RegExp(this.getContent() ?? "")
      return file => regex.test(file.toString())
    }
  }

  class doesNotMatchNode extends matchesNode {
    get flip() {
      return true
    }
  }

  class commentNode extends GrammarBackedNode {
    createParser() {
      return new TreeNode.Parser(commentNode, undefined, undefined)
    }
    get commentCell() {
      return this.getWord(0)
    }
    get commentCell() {
      return this.getWordsFrom(1)
    }
  }

  module.exports = tqlNode
  tqlNode

  if (!module.parent) new tqlNode(TreeNode.fromDisk(process.argv[2]).toString()).execute()
}