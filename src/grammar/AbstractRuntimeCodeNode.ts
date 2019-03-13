import TreeUtils from "../base/TreeUtils"

import GrammarConstants from "./GrammarConstants"

import GrammarBackedCell from "./GrammarBackedCell"
import AbstractRuntimeNode from "./AbstractRuntimeNode"

abstract class AbstractRuntimeCodeNode extends AbstractRuntimeNode {
  getProgram() {
    return (<AbstractRuntimeNode>this.getParent()).getProgram()
  }

  getDefinition() {
    return (
      this.getProgram()
        .getGrammarProgram()
        // todo: do we need a relative to with this keyword path?
        .getDefinitionByKeywordPath(this.getKeywordPath())
    )
  }

  getCompilerNode(targetLanguage) {
    return this.getDefinition().getDefinitionCompilerNode(targetLanguage, this)
  }

  getParsedWords() {
    return this._getGrammarBackedCellArray().map(word => word.getParsed())
  }

  _getParameterMap() {
    const cells = this._getGrammarBackedCellArray()
    const parameterMap = {}
    cells.forEach(cell => {
      const type = cell.getType()
      if (!parameterMap[type]) parameterMap[type] = []
      parameterMap[type].push(cell.getWord())
    })
    return parameterMap
  }

  getCompiledIndentation(targetLanguage) {
    const compiler = this.getCompilerNode(targetLanguage)
    const indentCharacter = compiler.getIndentCharacter()
    const indent = this.getIndentation()
    return indentCharacter !== undefined ? indentCharacter.repeat(indent.length) : indent
  }

  getCompiledLine(targetLanguage) {
    const compiler = this.getCompilerNode(targetLanguage)
    const listDelimiter = compiler.getListDelimiter()
    const parameterMap = this._getParameterMap()
    const str = compiler.getTransformation()
    return str ? TreeUtils.formatStr(str, listDelimiter, parameterMap) : this.getLine()
  }

  compile(targetLanguage) {
    return this.getCompiledIndentation(targetLanguage) + this.getCompiledLine(targetLanguage)
  }

  getErrors() {
    // Not enough parameters
    // Too many parameters
    // Incorrect parameter

    return this._getGrammarBackedCellArray()
      .map(check => check.getErrorIfAny())
      .filter(i => i)
  }

  _getGrammarBackedCellArray() {
    const definition = this.getDefinition()
    const grammarProgram = definition.getProgram()
    const parameters = definition.getNodeColumnTypes()
    const expectedPattern = parameters.join(" ")
    const parameterLength = parameters.length
    const lastParameterType = parameters[parameterLength - 1]
    const lastParameterListType = lastParameterType && lastParameterType.endsWith("*") ? lastParameterType : undefined
    const words = this.getWordsFrom(1)
    const length = Math.max(words.length, parameterLength)
    const checks = []
    for (let wordIndex = 0; wordIndex < length; wordIndex++) {
      const word = words[wordIndex]
      const type = wordIndex >= parameterLength ? lastParameterListType : parameters[wordIndex]
      checks[wordIndex] = new GrammarBackedCell(word, type, this, wordIndex, expectedPattern, grammarProgram)
    }
    return checks
  }

  // todo: just make a fn that computes proper spacing and then is given a node to print
  getLineSyntax() {
    const parameterWords = this._getGrammarBackedCellArray().map(slot => slot.getType())
    return ["keyword"].concat(parameterWords).join(" ")
  }
}

export default AbstractRuntimeCodeNode