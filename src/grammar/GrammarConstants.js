const GrammarConstants = {}

// node types
GrammarConstants.grammar = "@grammar"
GrammarConstants.keyword = "@keyword"
GrammarConstants.wordType = "@wordType"

// word parsing
GrammarConstants.regex = "@regex" // temporary?
GrammarConstants.keywordTable = "@keywordTable" // temporary?
GrammarConstants.enum = "@enum" // temporary?

// parsing
GrammarConstants.keywords = "@keywords"
GrammarConstants.columns = "@columns"
GrammarConstants.catchAllKeyword = "@catchAllKeyword"
GrammarConstants.defaults = "@defaults"
GrammarConstants.constants = "@constants"

// parser/vm instantiating and executing
GrammarConstants.parser = "@parser"
GrammarConstants.parserJs = "js"

// compiling
GrammarConstants.compilerKeyword = "@compiler"
GrammarConstants.compiler = {}
GrammarConstants.compiler.sub = "@sub" // replacement instructions
GrammarConstants.compiler.indentCharacter = "@indentCharacter"
GrammarConstants.compiler.listDelimiter = "@listDelimiter"
GrammarConstants.compiler.openChildren = "@openChildren"
GrammarConstants.compiler.closeChildren = "@closeChildren"

// developing
GrammarConstants.description = "@description"
GrammarConstants.frequency = "@frequency"

module.exports = GrammarConstants
