#! /usr/bin/env node
{
  const { Utils } = require("./Utils.js")
  const { TreeNode } = require("./TreeNode.js")
  const { HandGrammarProgram } = require("./GrammarLanguage.js")
  const { GrammarBackedNode } = require("./GrammarLanguage.js")

  class stampParser extends GrammarBackedNode {
    createParserCombinator() {
      return new TreeNode.ParserCombinator(errorParser, Object.assign(Object.assign({}, super.createParserCombinator()._getFirstWordMapAsObject()), { "#!": hashbangParser, file: fileParser, folder: folderParser }), undefined)
    }
    async executeSeries(parentDir) {
      const length = this.length
      for (let index = 0; index < length; index++) {
        const node = this.nodeAt(index)
        await node.execute(parentDir)
      }
      return parentDir
    }
    verbose = true
    silence() {
      this.verbose = false
      return this
    }
    log(message) {
      if (this.verbose) console.log(message)
    }
    async execute(parentDir = process.cwd()) {
      await this.executeSeries(parentDir)
    }
    static dirToStampWithContents(absPathWithoutEndingSlash) {
      return stampParser._dirToStampFn(absPathWithoutEndingSlash, "content")
    }
    static dirToStamp(absPathWithoutEndingSlash) {
      return stampParser._dirToStampFn(absPathWithoutEndingSlash, "list")
    }
    static _dirToStampFn(absPathWithoutEndingSlash, output) {
      const fs = require("fs")
      // todo: add chmod, file metadata
      if (absPathWithoutEndingSlash.startsWith(".")) absPathWithoutEndingSlash = Utils.resolvePath(absPathWithoutEndingSlash, process.cwd() + "/")
      const stat = fs.statSync(absPathWithoutEndingSlash)
      if (!stat.isDirectory()) throw new Error(`${absPath} is a file not a directory.`)
      const fns = {
        list: (file, reducedPath) => {
          const stat = fs.statSync(file)
          const isDir = stat.isDirectory()
          if (isDir) return `folder ` + reducedPath
          return `file ` + reducedPath
        },
        content: (file, reducedPath) => {
          const stat = fs.statSync(file)
          const isDir = stat.isDirectory()
          if (isDir) return `folder ` + reducedPath
          const content = fs.readFileSync(file, "utf8")
          return `file ${reducedPath}
 data${TreeNode.nest(content, 2)}`
        }
      }
      const fn = fns[output]
      return this._dirToStamp(absPathWithoutEndingSlash, fn)
    }
    static _dirToStamp(absPathWithoutEndingSlash, fileFn) {
      const files = require("recursive-readdir-sync")(absPathWithoutEndingSlash)
      const folderParts = absPathWithoutEndingSlash.split("/")
      const rootFolderName = folderParts.pop()
      const rootFolderPath = folderParts.join("/")
      const pathStartIndex = rootFolderPath.length + 1
      return files.map(file => fileFn(file, file.substr(pathStartIndex))).join("\n")
    }
    static cachedHandGrammarProgramRoot = new HandGrammarProgram(`// todo File permissions

// Cell parsers
anyCell
extraCell
 highlightScope invalid
anyCell
 highlightScope string
promptWordsCell
 highlightScope string
filepathCell
varNameCell
 highlightScope string
commentCell
 highlightScope comment
inputTypeCell
 enum string int any lowercase
keywordCell
 highlightScope keyword.control

// Line parsers
stampParser
 root
 description A prefix Tree Language for creating distributable text template files that expand to folders and files.
 catchAllParser errorParser
 javascript
  async executeSeries(parentDir) {
   const length = this.length
   for (let index = 0; index < length; index++) {
    const node = this.nodeAt(index)
    await node.execute(parentDir)
   }
   return parentDir
  }
  verbose = true
  silence(){
    this.verbose = false
    return this
  }
  log(message) {
    if (this.verbose)
      console.log(message)
  }
  async execute(parentDir = process.cwd()) {
   await this.executeSeries(parentDir)
  }
  static dirToStampWithContents(absPathWithoutEndingSlash) {
    return stampParser._dirToStampFn(absPathWithoutEndingSlash, "content")
  }
  static dirToStamp(absPathWithoutEndingSlash) {
    return stampParser._dirToStampFn(absPathWithoutEndingSlash, "list")
  }
  static _dirToStampFn(absPathWithoutEndingSlash, output) {
   const fs = require("fs")
   // todo: add chmod, file metadata
   if (absPathWithoutEndingSlash.startsWith(".")) absPathWithoutEndingSlash = Utils.resolvePath(absPathWithoutEndingSlash, process.cwd() + "/")
   const stat = fs.statSync(absPathWithoutEndingSlash)
   if (!stat.isDirectory()) throw new Error(\`\${absPath} is a file not a directory.\`)
   const fns = {
    list: (file, reducedPath) => {
     const stat = fs.statSync(file)
     const isDir = stat.isDirectory()
     if (isDir) return \`folder \` + reducedPath
     return \`file \` + reducedPath
    },
    content: (file, reducedPath) => {
     const stat = fs.statSync(file)
     const isDir = stat.isDirectory()
     if (isDir) return \`folder \` + reducedPath
     const content = fs.readFileSync(file, "utf8")
     return \`file \${reducedPath}
   data\${TreeNode.nest(content, 2)}\`
    }
   }
   const fn = fns[output]
   return this._dirToStamp(absPathWithoutEndingSlash, fn)
  }
  static _dirToStamp(absPathWithoutEndingSlash, fileFn) {
   const files = require("recursive-readdir-sync")(absPathWithoutEndingSlash)
   const folderParts = absPathWithoutEndingSlash.split("/")
   const rootFolderName = folderParts.pop()
   const rootFolderPath = folderParts.join("/")
   const pathStartIndex = rootFolderPath.length + 1
   return files.map(file => fileFn(file, file.substr(pathStartIndex))).join("\\n")
  }
 inScope hashbangParser folderParser fileParser
hashbangParser
 crux #!
 catchAllCellType commentCell
 cells commentCell
catchAllAnyLineParser
 catchAllCellType anyCell
 catchAllParser catchAllAnyLineParser
 cells anyCell
dataParser
 catchAllParser catchAllAnyLineParser
 cells keywordCell
 crux data
errorParser
 baseParser errorParser
executableParser
 cells keywordCell
 crux executable
fileParser
 cells keywordCell filepathCell
 javascript
  compileToBash(parentDir) {
   const filePath = this._getAbsolutePath(parentDir)
   return \`touch \${filePath}\\necho -e "\${this.childrenToString()}" >> \${filePath}\`
  }
  _getAbsolutePath(parentDir = process.cwd()) {
   return parentDir + "/" + this.cells.filepathCell
  }
  execute(parentDir) {
   const fs = require("fs")
   const fullPath = this._getAbsolutePath(parentDir)
   this.root.log(\`Creating file \${fullPath}\`)
   const data = this.getNode("data")
   const content = data ? data.childrenToString() : ""
   require("mkdirp").sync(require("path").dirname(fullPath))
   fs.writeFileSync(fullPath, content, "utf8")
   const isExecutable = this.has("executable") // todo: allow for all file permissions?
   if (isExecutable) fs.chmodSync(fullPath, "755")
  }
 inScope dataParser executableParser
 crux file
folderParser
 cells keywordCell filepathCell
 javascript
  compileToBash(parentDir) {
   return \`mkdir \${this._getAbsolutePath(parentDir)}\`
  }
  _getAbsolutePath(parentDir = process.cwd()) {
   return parentDir + "/" + this.cells.filepathCell
  }
  execute(parentDir) {
   const path = this._getAbsolutePath(parentDir)
   this.root.log(\`Creating folder \${path}\`)
   require("mkdirp").sync(path)
  }
 crux folder`)
    get handGrammarProgram() {
      return this.constructor.cachedHandGrammarProgramRoot
    }
    static rootParser = stampParser
  }

  class hashbangParser extends GrammarBackedNode {
    get commentCell() {
      return this.getWord(0)
    }
    get commentCell() {
      return this.getWordsFrom(1)
    }
  }

  class catchAllAnyLineParser extends GrammarBackedNode {
    createParserCombinator() {
      return new TreeNode.ParserCombinator(catchAllAnyLineParser, undefined, undefined)
    }
    get anyCell() {
      return this.getWord(0)
    }
    get anyCell() {
      return this.getWordsFrom(1)
    }
  }

  class dataParser extends GrammarBackedNode {
    createParserCombinator() {
      return new TreeNode.ParserCombinator(catchAllAnyLineParser, undefined, undefined)
    }
    get keywordCell() {
      return this.getWord(0)
    }
  }

  class errorParser extends GrammarBackedNode {
    getErrors() {
      return this._getErrorParserErrors()
    }
  }

  class executableParser extends GrammarBackedNode {
    get keywordCell() {
      return this.getWord(0)
    }
  }

  class fileParser extends GrammarBackedNode {
    createParserCombinator() {
      return new TreeNode.ParserCombinator(undefined, Object.assign(Object.assign({}, super.createParserCombinator()._getFirstWordMapAsObject()), { data: dataParser, executable: executableParser }), undefined)
    }
    get keywordCell() {
      return this.getWord(0)
    }
    get filepathCell() {
      return this.getWord(1)
    }
    compileToBash(parentDir) {
      const filePath = this._getAbsolutePath(parentDir)
      return `touch ${filePath}\necho -e "${this.childrenToString()}" >> ${filePath}`
    }
    _getAbsolutePath(parentDir = process.cwd()) {
      return parentDir + "/" + this.cells.filepathCell
    }
    execute(parentDir) {
      const fs = require("fs")
      const fullPath = this._getAbsolutePath(parentDir)
      this.root.log(`Creating file ${fullPath}`)
      const data = this.getNode("data")
      const content = data ? data.childrenToString() : ""
      require("mkdirp").sync(require("path").dirname(fullPath))
      fs.writeFileSync(fullPath, content, "utf8")
      const isExecutable = this.has("executable") // todo: allow for all file permissions?
      if (isExecutable) fs.chmodSync(fullPath, "755")
    }
  }

  class folderParser extends GrammarBackedNode {
    get keywordCell() {
      return this.getWord(0)
    }
    get filepathCell() {
      return this.getWord(1)
    }
    compileToBash(parentDir) {
      return `mkdir ${this._getAbsolutePath(parentDir)}`
    }
    _getAbsolutePath(parentDir = process.cwd()) {
      return parentDir + "/" + this.cells.filepathCell
    }
    execute(parentDir) {
      const path = this._getAbsolutePath(parentDir)
      this.root.log(`Creating folder ${path}`)
      require("mkdirp").sync(path)
    }
  }

  module.exports = stampParser
  stampParser

  if (!module.parent) new stampParser(TreeNode.fromDisk(process.argv[2]).toString()).execute()
}
