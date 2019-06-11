"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GrammarConstants_1 = require("./GrammarConstants");
const GrammarConstantsNode_1 = require("./GrammarConstantsNode");
const GrammarExampleNode_1 = require("./GrammarExampleNode");
const AbstractGrammarDefinitionNode_1 = require("./AbstractGrammarDefinitionNode");
class GrammarNodeTypeDefinitionNode extends AbstractGrammarDefinitionNode_1.default {
    // todo: protected?
    _getRunTimeCatchAllNodeTypeId() {
        return this.get(GrammarConstants_1.GrammarConstants.catchAllNodeType) || this.getParent()._getRunTimeCatchAllNodeTypeId();
    }
    getExpectedLineCellTypes() {
        const req = [this.getFirstCellType()].concat(this.getRequiredCellTypeNames());
        const catchAllCellType = this.getCatchAllCellTypeName();
        if (catchAllCellType)
            req.push(catchAllCellType + "*");
        return req.join(" ");
    }
    isOrExtendsANodeTypeInScope(firstWordsInScope) {
        const chain = this.getNodeTypeInheritanceSet();
        return firstWordsInScope.some(firstWord => chain.has(firstWord));
    }
    getSublimeSyntaxContextId() {
        return this.getNodeTypeIdFromDefinition().replace(/\#/g, "HASH"); // # is not allowed in sublime context names
    }
    _getFirstCellHighlightScope() {
        const program = this.getProgram();
        const cellTypeDefinition = program.getCellTypeDefinition(this.getFirstCellType());
        // todo: standardize error/capture error at grammar time
        if (!cellTypeDefinition)
            throw new Error(`No ${GrammarConstants_1.GrammarConstants.cellType} ${this.getFirstCellType()} found`);
        return cellTypeDefinition.getHighlightScope();
    }
    getMatchBlock() {
        const defaultHighlightScope = "source";
        const program = this.getProgram();
        const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const firstWordHighlightScope = (this._getFirstCellHighlightScope() || defaultHighlightScope) + "." + this.getNodeTypeIdFromDefinition();
        const match = `'^ *${escapeRegExp(this.getNodeTypeIdFromDefinition())}(?: |$)'`;
        const topHalf = ` '${this.getSublimeSyntaxContextId()}':
  - match: ${match}
    scope: ${firstWordHighlightScope}`;
        const requiredCellTypeNames = this.getRequiredCellTypeNames();
        const catchAllCellTypeName = this.getCatchAllCellTypeName();
        if (catchAllCellTypeName)
            requiredCellTypeNames.push(catchAllCellTypeName);
        if (!requiredCellTypeNames.length)
            return topHalf;
        const captures = requiredCellTypeNames
            .map((typeName, index) => {
            const cellTypeDefinition = program.getCellTypeDefinition(typeName); // todo: cleanup
            if (!cellTypeDefinition)
                throw new Error(`No ${GrammarConstants_1.GrammarConstants.cellType} ${typeName} found`); // todo: standardize error/capture error at grammar time
            return `        ${index + 1}: ${(cellTypeDefinition.getHighlightScope() || defaultHighlightScope) + "." + cellTypeDefinition.getCellTypeId()}`;
        })
            .join("\n");
        const cellTypesToRegex = (cellTypeNames) => cellTypeNames.map((cellTypeName) => `({{${cellTypeName}}})?`).join(" ?");
        return `${topHalf}
    push:
     - match: ${cellTypesToRegex(requiredCellTypeNames)}
       captures:
${captures}
     - match: $
       pop: true`;
    }
    getNodeTypeInheritanceSet() {
        this._initNodeTypeInheritanceCache();
        return this._cache_nodeTypeInheritanceSet;
    }
    _getIdOfNodeTypeThatThisExtends() {
        return this.getWord(2);
    }
    getAncestorNodeTypeNamesArray() {
        this._initNodeTypeInheritanceCache();
        return this._cache_ancestorNodeTypeIdsArray;
    }
    _initNodeTypeInheritanceCache() {
        if (this._cache_nodeTypeInheritanceSet)
            return undefined;
        let nodeTypeNames = [];
        const extendedNodeTypeId = this._getIdOfNodeTypeThatThisExtends();
        if (extendedNodeTypeId) {
            const defs = this._getProgramNodeTypeDefinitionCache();
            const parentDef = defs[extendedNodeTypeId];
            if (!parentDef)
                throw new Error(`${extendedNodeTypeId} not found`);
            nodeTypeNames = nodeTypeNames.concat(parentDef.getAncestorNodeTypeNamesArray());
        }
        nodeTypeNames.push(this.getNodeTypeIdFromDefinition());
        this._cache_nodeTypeInheritanceSet = new Set(nodeTypeNames);
        this._cache_ancestorNodeTypeIdsArray = nodeTypeNames;
    }
    // todo: protected?
    _getProgramNodeTypeDefinitionCache() {
        return this.getProgram()._getProgramNodeTypeDefinitionCache();
    }
    getDoc() {
        return this.getNodeTypeIdFromDefinition();
    }
    _getDefaultsNode() {
        return this.getNode(GrammarConstants_1.GrammarConstants.defaults);
    }
    // todo: deprecate?
    getDefaultFor(name) {
        const defaults = this._getDefaultsNode();
        return defaults ? defaults.get(name) : undefined;
    }
    getDescription() {
        return this.get(GrammarConstants_1.GrammarConstants.description) || "";
    }
    getExamples() {
        return this.getChildrenByNodeConstructor(GrammarExampleNode_1.default);
    }
    getConstantsObject() {
        const constantsNode = this.getNodeByType(GrammarConstantsNode_1.default);
        return constantsNode ? constantsNode.getConstantsObj() : {};
    }
    getFrequency() {
        const val = this.get(GrammarConstants_1.GrammarConstants.frequency);
        return val ? parseFloat(val) : 0;
    }
    toJavascript() {
        const ancestorClasses = this.getAncestorNodeTypeNamesArray();
        const extendsClass = ancestorClasses.length > 1
            ? this.getNodeTypeDefinitionByName(ancestorClasses[ancestorClasses.length - 2]).getGeneratedClassName()
            : "jtree.NonTerminalNode";
        const components = [this.getNodeConstructorToJavascript(), this.getGetters().join("\n")].filter(code => code);
        return `class ${this.getGeneratedClassName()} extends ${extendsClass} {
      ${components.join("\n")}
    }`;
    }
}
exports.default = GrammarNodeTypeDefinitionNode;
