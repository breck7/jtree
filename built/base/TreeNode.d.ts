import AbstractNode from "./AbstractNode.node";
import types from "../types";
declare type int = types.int;
declare type word = types.word;
declare type cellFn = (str: string, rowIndex: int, colIndex: int) => any;
declare type mapFn = (value: any, index: int, array: any[]) => any;
declare class ImmutableNode extends AbstractNode {
    constructor(children?: types.children, line?: string, parent?: ImmutableNode);
    private _uid;
    private _words;
    private _parent;
    private _children;
    private _line;
    private _index;
    execute(context: any): Promise<any[]>;
    getErrors(): types.ParseError[];
    getLineCellTypes(): string;
    executeSync(context: any): any[];
    isNodeJs(): boolean;
    isBrowser(): boolean;
    getOlderSiblings(): ImmutableNode[];
    protected _getClosestOlderSibling(): ImmutableNode | undefined;
    getYoungerSiblings(): ImmutableNode[];
    getSiblings(): any[];
    protected _getUid(): number;
    getParent(): ImmutableNode;
    getPoint(): types.point;
    protected _getPoint(relativeTo?: ImmutableNode): types.point;
    getPointRelativeTo(relativeTo?: ImmutableNode): types.point;
    getIndentation(relativeTo?: ImmutableNode): string;
    protected _getTopDownArray(arr: TreeNode[]): void;
    getTopDownArray(): types.treeNode[];
    getTopDownArrayIterator(): IterableIterator<types.treeNode>;
    nodeAtLine(lineNumber: types.positiveInt): TreeNode | undefined;
    getNumberOfLines(): int;
    protected _getLineNumber(target: ImmutableNode): number;
    isBlankLine(): boolean;
    hasDuplicateFirstWords(): boolean;
    isEmpty(): boolean;
    protected _cachedLineNumber: int;
    protected _getYCoordinate(relativeTo?: ImmutableNode): number;
    isRoot(relativeTo?: ImmutableNode): boolean;
    getRootNode(): ImmutableNode | this;
    protected _getRootNode(relativeTo?: ImmutableNode): ImmutableNode | this;
    toString(indentCount?: number, language?: this): string;
    getWord(index: int): word;
    protected _toHtml(indentCount: int): string;
    protected _getWords(startFrom: int): string[];
    getWords(): word[];
    getWordsFrom(startFrom: int): string[];
    private _getWordIndexCharacterStartPosition;
    getNodeInScopeAtCharIndex(charIndex: types.positiveInt): ImmutableNode;
    getWordProperties(wordIndex: int): {
        startCharIndex: number;
        endCharIndex: number;
        word: string;
    };
    getAllWordBoundaryCoordinates(): types.point[];
    getWordBoundaryIndices(): types.positiveInt[];
    getWordIndexAtCharacterIndex(charIndex: types.positiveInt): int;
    getFirstWord(): word;
    getContent(): string;
    getContentWithChildren(): string;
    getStack(): ImmutableNode[];
    protected _getStack(relativeTo?: ImmutableNode): ImmutableNode[];
    getStackString(): string;
    getLine(language?: ImmutableNode): string;
    getColumnNames(): word[];
    getOneHot(column: string): TreeNode;
    protected _getFirstWordPath(relativeTo?: ImmutableNode): types.firstWordPath;
    getFirstWordPathRelativeTo(relativeTo?: ImmutableNode): types.firstWordPath;
    getFirstWordPath(): types.firstWordPath;
    getPathVector(): types.pathVector;
    getPathVectorRelativeTo(relativeTo?: ImmutableNode): types.pathVector;
    protected _getPathVector(relativeTo?: ImmutableNode): types.pathVector;
    getIndex(): int;
    isTerminal(): boolean;
    protected _getLineHtml(): string;
    protected _getXmlContent(indentCount: types.positiveInt): string;
    protected _toXml(indentCount: types.positiveInt): string;
    protected _toObjectTuple(): Object[];
    protected _indexOfNode(needleNode: ImmutableNode): number;
    getSlice(startIndexInclusive: int, stopIndexExclusive: int): TreeNode;
    protected _hasColumns(columns: string[]): boolean;
    hasWord(index: int, word: string): boolean;
    getNodeByColumns(...columns: string[]): ImmutableNode;
    getNodeByColumn(index: int, name: string): ImmutableNode;
    protected _getNodesByColumn(index: int, name: word): ImmutableNode[];
    getChildrenFirstArray(): ImmutableNode[];
    protected _getChildrenFirstArray(arr: ImmutableNode[]): void;
    protected _getXCoordinate(relativeTo: ImmutableNode): number;
    getParentFirstArray(): ImmutableNode[];
    protected _getLevels(): {
        [level: number]: ImmutableNode[];
    };
    protected _getChildrenArray(): ImmutableNode[];
    protected _getChildren(): ImmutableNode[];
    getLines(): string[];
    getChildren(): any[];
    readonly length: types.positiveInt;
    protected _nodeAt(index: int): ImmutableNode;
    nodeAt(indexOrIndexArray: int | int[]): ImmutableNode | undefined;
    protected _toObject(): types.stringMap;
    toHtml(): types.htmlString;
    protected _childrenToHtml(indentCount: int): string;
    protected _childrenToString(indentCount?: int, language?: this): string;
    childrenToString(): string;
    protected _getNodeJoinCharacter(): string;
    compile(targetExtension: types.fileExtension): string;
    toXml(): types.xmlString;
    toDisk(path: string): this;
    _lineToYaml(indentLevel: number, listTag?: string): string;
    _isYamlList(): boolean;
    toYaml(): string;
    _childrenToYaml(indentLevel: number): string[];
    _collapseYamlLine(): boolean;
    _toYamlListElement(indentLevel: number): string;
    _childrenToYamlList(indentLevel: number): string[];
    _toYamlAssociativeArrayElement(indentLevel: number): string;
    _childrenToYamlAssociativeArray(indentLevel: number): string[];
    _getDuplicateLinesMap(): types.stringMap;
    toJson(): types.jsonString;
    findNodes(firstWordPath: types.firstWordPath): TreeNode[];
    format(str: types.formatString): string;
    getColumn(path: word): string[];
    getFiltered(fn: types.filterFn): TreeNode;
    isLeafColumn(path: types.firstWordPath): boolean;
    getNode(firstWordPath: types.firstWordPath): ImmutableNode;
    get(firstWordPath: types.firstWordPath): string;
    getNodesByGlobPath(query: types.globPath): TreeNode[];
    private _getNodesByGlobPath;
    protected _getNodeByPath(firstWordPath: types.firstWordPath): ImmutableNode;
    getNext(): ImmutableNode;
    getPrevious(): ImmutableNode;
    protected _getUnionNames(): string[];
    getAncestorNodesByInheritanceViaExtendsKeyword(key: word): ImmutableNode[];
    getAncestorNodesByInheritanceViaColumnIndices(thisColumnNumber: int, extendsColumnNumber: int): ImmutableNode[];
    protected _getAncestorNodes(getPotentialParentNodesByIdFn: (thisParentNode: ImmutableNode, id: word) => ImmutableNode[], getParentIdFn: (thisNode: ImmutableNode) => word, cannotContainNode: ImmutableNode): ImmutableNode[];
    pathVectorToFirstWordPath(pathVector: types.pathVector): word[];
    toCsv(): string;
    toFlatTree(): TreeNode;
    protected _getTypes(header: string[]): string[];
    toDataTable(header?: string[]): types.dataTable;
    toDelimited(delimiter: types.delimiter, header?: string[]): string;
    protected _getMatrix(columns: string[]): string[][];
    protected _toArrays(header: string[], cellFn: cellFn): {
        rows: any[];
        header: any[];
    };
    protected _toDelimited(delimiter: types.delimiter, header: string[], cellFn: cellFn): string;
    toTable(): string;
    toFormattedTable(maxWidth: number, alignRight: boolean): string;
    protected _toTable(maxWidth: number, alignRight?: boolean): string;
    toSsv(): string;
    toOutline(): string;
    toMappedOutline(nodeFn: types.nodeToStringFn): string;
    protected _toOutline(nodeFn: types.nodeToStringFn): string;
    copyTo(node: TreeNode, index: int): any;
    split(firstWord: types.word): ImmutableNode[];
    toMarkdownTable(): string;
    toMarkdownTableAdvanced(columns: word[], formatFn: types.formatFunction): string;
    toTsv(): string;
    getYI(): string;
    getZI(): string;
    getYIRegex(): RegExp;
    getXI(): string;
    protected _textToContentAndChildrenTuple(text: string): string[];
    protected _getLine(): string;
    protected _setLine(line?: string): this;
    protected _clearChildren(): this;
    protected _setChildren(content: any, circularCheckArray?: any[]): this;
    protected _setFromObject(content: any, circularCheckArray: Object[]): this;
    protected _appendFromJavascriptObjectTuple(firstWord: types.word, content: any, circularCheckArray: Object[]): void;
    _setLineAndChildren(line: string, children?: types.children, index?: number): any;
    protected _parseString(str: string): this;
    protected _getIndex(): {
        [firstWord: string]: number;
    };
    getContentsArray(): any[];
    getChildrenByNodeConstructor(constructor: Function): any[];
    getNodeByType(constructor: Function): any;
    indexOfLast(firstWord: word): int;
    indexOf(firstWord: word): int;
    toObject(): Object;
    getFirstWords(): word[];
    protected _makeIndex(startAt?: number): {
        [firstWord: string]: number;
    };
    protected _childrenToXml(indentCount: types.positiveInt): string;
    protected _getIndentCount(str: string): number;
    clone(): TreeNode;
    has(firstWord: word): boolean;
    protected _hasFirstWord(firstWord: string): boolean;
    protected _getFirstWordByIndex(index: int): string;
    map(fn: mapFn): any[];
    filter(fn: types.filterFn): any[];
    find(fn: types.filterFn): any;
    every(fn: types.everyFn): boolean;
    forEach(fn: types.forEachFn): this;
    _clearIndex(): void;
    slice(start: int, end?: int): ImmutableNode[];
    getFirstWordMap(): types.firstWordToNodeConstructorMap;
    getCatchAllNodeConstructor(line: string): Function;
    getInheritanceTree(): TreeNode;
    protected _getGrandParent(): ImmutableNode | undefined;
    getNodeConstructor(line: string): Function;
    private static _uniqueId;
    static _makeUniqueId(): number;
    protected static _getFileFormat(path: string): string;
    static iris: string;
}
declare class TreeNode extends ImmutableNode {
    private _mtime;
    private _cmtime;
    getMTime(): int;
    protected _getChildrenMTime(): number;
    protected _getCMTime(): number;
    protected _setCMTime(value: number): this;
    getTreeMTime(): int;
    private _virtualParentTree;
    protected _setVirtualParentTree(tree: TreeNode): this;
    protected _getVirtualParentTreeNode(): TreeNode;
    private _setVirtualAncestorNodesByInheritanceViaColumnIndices;
    private _isVirtualExpanded;
    private _isExpanding;
    protected _expandFromVirtualParentTree(): this;
    extend(nodeOrStr: TreeNode | string): this;
    getExpanded(thisIdColumnNumber: int, extendsIdColumnNumber: int): TreeNode;
    macroExpand(macroDefinitionWord: string, macroUsageWord: string): TreeNode;
    setChildren(children: types.children): this;
    protected _updateMTime(): void;
    insertWord(index: int, word: string): this;
    deleteDuplicates(): this;
    setWord(index: int, word: string): this;
    deleteChildren(): this;
    setContent(content: string): TreeNode;
    setContentWithChildren(text: string): TreeNode;
    setFirstWord(firstWord: word): this;
    setLine(line: string): this;
    duplicate(): any;
    destroy(): void;
    set(firstWordPath: types.firstWordPath, text: string): TreeNode;
    setFromText(text: string): this;
    appendLine(line: string): any;
    appendLineAndChildren(line: string, children: types.children): any;
    getNodesByRegex(regex: RegExp | RegExp[]): ImmutableNode[];
    getNodesByLinePrefixes(columns: string[]): TreeNode[];
    protected _getNodesByLineRegex(matches: ImmutableNode[], regs: RegExp[]): void;
    concat(node: string | ImmutableNode): any[];
    protected _deleteByIndexes(indexesToDelete: int[]): this;
    protected _deleteNode(node: ImmutableNode): 0 | this;
    reverse(): this;
    shift(): any;
    sort(fn: types.sortFn): this;
    invert(): this;
    protected _rename(oldFirstWord: types.word, newFirstWord: types.word): this;
    remap(map: types.stringMap): this;
    rename(oldFirstWord: word, newFirstWord: word): this;
    renameAll(oldName: word, newName: word): this;
    protected _deleteAllChildNodesWithFirstWord(firstWord: word): this;
    delete(path?: types.firstWordPath): 0 | TreeNode;
    deleteColumn(firstWord?: string): this;
    protected _getNonMaps(): TreeNode[];
    replaceNode(fn: (thisStr: string) => string): TreeNode[];
    insertLineAndChildren(line: string, children: types.children, index: int): any;
    insertLine(line: string, index: int): any;
    prependLine(line: string): any;
    pushContentAndChildren(content?: types.line, children?: types.children): any;
    deleteBlanks(): this;
    firstWordSort(firstWordOrder: types.word[]): this;
    _firstWordSort(firstWordOrder: types.word[], secondarySortFn?: types.sortFn): this;
    protected _touchNode(firstWordPathArray: types.word[]): this;
    protected _touchNodeByString(str: string): this;
    touchNode(str: types.firstWordPath): this;
    hasLine(line: types.line): boolean;
    getNodesByLine(line: types.line): any[];
    toggleLine(line: types.line): TreeNode;
    sortByColumns(indexOrIndices: int | int[]): this;
    shiftLeft(): TreeNode;
    shiftRight(): TreeNode;
    shiftYoungerSibsRight(): TreeNode;
    sortBy(nameOrNames: types.word | types.word[]): this;
    static fromCsv(str: string): TreeNode;
    static fromJson(str: types.jsonString): TreeNode;
    static fromSsv(str: string): TreeNode;
    static fromTsv(str: string): TreeNode;
    static fromDelimited(str: string, delimiter: string, quoteChar: string): TreeNode;
    static _getEscapedRows(str: string, delimiter: string, quoteChar: string): string[][];
    static fromDelimitedNoHeaders(str: string, delimiter: string, quoteChar: string): TreeNode;
    static _strToRows(str: string, delimiter: string, quoteChar: string, newLineChar?: string): string[][];
    static multiply(nodeA: TreeNode, nodeB: TreeNode): TreeNode;
    static _rowsToTreeNode(rows: string[][], delimiter: string, hasHeaders: boolean): TreeNode;
    private static _xmlParser;
    static _initializeXmlParser(): void;
    static fromXml(str: string): ImmutableNode;
    static _zipObject(keys: string[], values: any): types.stringMap;
    static fromShape(shapeArr: int[], rootNode?: TreeNode): TreeNode;
    static fromDataTable(table: types.dataTable): TreeNode;
    static _parseXml2(str: string): HTMLDivElement;
    static _treeNodeFromXml(xml: any): TreeNode;
    static _getHeader(rows: string[][], hasHeaders: boolean): string[];
    static nest(str: string, xValue: int): string;
    static fromDisk(path: string): TreeNode;
}
export default TreeNode;
