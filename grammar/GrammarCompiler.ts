const fs = require("fs")
const path = require("path")

const { Utils } = require("../products/Utils.js")
const { TreeNode } = require("../products/TreeNode.js")
const { HandGrammarProgram } = require("./GrammarLanguage.js")
import { scrollNotationTypes } from "../products/scrollNotationTypes"

enum CompileTarget {
  nodejs = "nodejs",
  browser = "browser"
}

class GrammarCompiler {
  static compileGrammarAndCreateProgram = (programPath: scrollNotationTypes.filepath, grammarPath: scrollNotationTypes.filepath) => {
    // tod: remove?
    const rootParser = this.compileGrammarFileAtPathAndReturnRootParser(grammarPath)
    return new rootParser(fs.readFileSync(programPath, "utf8"))
  }

  static compileGrammarForNodeJs(pathToGrammar: scrollNotationTypes.absoluteFilePath, outputFolder: scrollNotationTypes.absoluteFolderPath, usePrettier = true, scrollsdkProductsPath = __dirname) {
    return this._compileGrammar(pathToGrammar, outputFolder, CompileTarget.nodejs, usePrettier, scrollsdkProductsPath)
  }

  static formatCode = (programCode: string, grammarPath: scrollNotationTypes.filepath) => {
    // tod: remove?
    const rootParser = this.compileGrammarFileAtPathAndReturnRootParser(grammarPath)
    const program = new rootParser(programCode)
    return program.format().toString()
  }

  static formatFileInPlace = (programPath: scrollNotationTypes.filepath, grammarPath: scrollNotationTypes.filepath) => {
    // tod: remove?
    const original = TreeNode.fromDisk(programPath)
    const formatted = this.formatCode(original.toString(), grammarPath)
    if (original === formatted) return false
    new TreeNode(formatted).toDisk(programPath)
    return true
  }

  private static _compileGrammar(
    pathToGrammar: scrollNotationTypes.absoluteFilePath,
    outputFolder: scrollNotationTypes.absoluteFolderPath,
    target: CompileTarget,
    usePrettier: boolean,
    scrollsdkProductsPath?: scrollNotationTypes.requirePath
  ) {
    const isNodeJs = CompileTarget.nodejs === target
    const grammarCode = TreeNode.fromDisk(pathToGrammar)
    const program = new HandGrammarProgram(grammarCode.toString())
    const outputFilePath = path.join(outputFolder, `${program.grammarName}.${target}.js`)

    let result = isNodeJs ? program.toNodeJsJavascript(scrollsdkProductsPath) : program.toBrowserJavascript()

    if (isNodeJs)
      result =
        "#! /usr/bin/env node\n" +
        result.replace(
          /}\s*$/,
          `
if (!module.parent) new ${program.rootParserId}(TreeNode.fromDisk(process.argv[2]).toString()).execute()
}
`
        )

    if (usePrettier) result = require("prettier").format(result, require("../package.json").prettier)

    fs.writeFileSync(outputFilePath, result, "utf8")

    if (isNodeJs) fs.chmodSync(outputFilePath, 0o755)
    return outputFilePath
  }

  static compileGrammarForBrowser(pathToGrammar: scrollNotationTypes.absoluteFilePath, outputFolder: scrollNotationTypes.absoluteFolderPath, usePrettier = true) {
    return this._compileGrammar(pathToGrammar, outputFolder, CompileTarget.browser, usePrettier)
  }

  static compileGrammarFileAtPathAndReturnRootParser = (grammarPath: scrollNotationTypes.filepath) => {
    // todo: remove
    if (!fs.existsSync(grammarPath)) throw new Error(`Grammar file does not exist: ${grammarPath}`)
    const grammarCode = fs.readFileSync(grammarPath, "utf8")
    const grammarProgram = new HandGrammarProgram(grammarCode)
    return <any>grammarProgram.compileAndReturnRootParser()
  }

  static combineFiles = (globPatterns: scrollNotationTypes.globPattern[]) => {
    const glob = require("glob")
    const files = Utils.flatten(<any>globPatterns.map(pattern => glob.sync(pattern)))
    const content = files.map((path: scrollNotationTypes.filepath) => fs.readFileSync(path, "utf8")).join("\n")

    return new TreeNode(content)
  }
}

export { GrammarCompiler }
