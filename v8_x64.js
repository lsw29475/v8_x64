"use scrict";

const PointerTag = host.Int64(0x1);
const PointerBaseAnd = host.Int64(0xFFFFFFFF00000000);
//JSString
const StringRepresentationAndEncodingMask = host.Int64(0xF);
const SeqOneByteStringTag = host.Int64(0x8);
const SeqTwoByteStringTag = host.Int64(0x0);
const ExternalOneByteStringTag = host.Int64(0xA);
const ExternalTwoByteStringTag = host.Int64(0x2);
const SliceOneByteStringTag = host.Int64(0xB);
const SliceTwoByteStringTag = host.Int64(0x3);
const ConsOneByteStringTag = host.Int64(0x9);
const ConsTwoByteStringTag = host.Int64(0x1);
const ThinOneByteStringTag = host.Int64(0xD);
const ThinTwoByteStringTag = host.Int64(0x5);

const NameRawHashFieldMask = host.Int64(0x3);

const CodeKindEncodingMask = host.Int64(0xF);

const TypeName = ["SMI"];

class PythonDictionary {
    constructor() {
        this.dictionary = {};
    }

    add(key, value) {
        this.dictionary[key] = value;
    }

    get(key) {
        return this.dictionary[key];
    }
}

function readPythonFile(filePath) {
    const fileContentArray = host.namespace.Debugger.Utility.FileSystem.CreateTextReader(filePath).ReadLineContents();
    let fileContent = "";

    for (let line of fileContentArray) {
        fileContent += line + "\n";
    }

    const regex = /INSTANCE_TYPES\s*=\s*{([\s\S]*?)}/;
    const match = fileContent.match(regex);

    if (match && match[1]) {
        const dictContent = match[1];
        const lines = dictContent.split(/\r?\n/);
        const pythonDict = new PythonDictionary();

        lines.forEach((line) => {
            const keyValueRegex = /^\s*(\d+)\s*:\s*"(.+)"\s*,?$/;
            const keyValueMatch = line.match(keyValueRegex);

            if (keyValueMatch && keyValueMatch[1] && keyValueMatch[2]) {
                const key = parseInt(keyValueMatch[1]);
                const value = keyValueMatch[2];
                pythonDict.add(key, value);
            }
        });

        return pythonDict;
    }

    return null;
}

function formatToJavaScriptDictionary(pythonDict) {
    const jsDict = {};

    for (const key in pythonDict.dictionary) {
        if (pythonDict.dictionary.hasOwnProperty(key)) {
            jsDict[key] = pythonDict.dictionary[key];
        }
    }

    return jsDict;
}

let MapInstanceTypeToName = {};

function generateMapInstanceTypeToName() {
    const filePath = "G:\\v8\\v8\\v8\\out.gn\\x64.debug\\gen\\tools\\debug_helper\\v8heapconst.py";
    const pythonDict = readPythonFile(filePath);

    if (pythonDict) {
        MapInstanceTypeToName = formatToJavaScriptDictionary(pythonDict);
    }
}

//JSString
const NameRawHashFieldEncodeToName = {
    0: "kIntegerIndex",
    1: "kForwardingIndex",
    2: "kHash",
    3: "kEmpty",
}

const JSStringTypeToName = {
    8: "SeqOneByteStringTag",
    0: "SeqTwoByteStringTag",
    0xA: "ExternalOneByteStringTag",
    2: "ExternalTwoByteStringTag",
    0xB: "SliceOneByteStringTag",
    3: "SliceTwoByteStringTag",
    9: "ConsOneByteStringTag",
    1: "ConsTwoByteStringTag",
    0xD: "ThinOneByteStringTag",
    5: "ThinTwoByteStringTag",
}

//LookupIterator
const LookupIteratorConfigurationValueToName = {
    1: "OWN/kInterceptor",
    2: "PROTOTYPE_CHAIN_SKIP_INTERCEPTOR/kPrototypeChain",
    0: "OWN_SKIP_INTERCEPTOR",
    3: "kPrototypeChain | kInterceptor",
}

const LookIteratorStateValueToName = {
    0: "ACCESS_CHECK",
    1: "INTEGER_INDEXED_EXOTIC",
    2: "INTERCEPTOR/BEFORE_PROPERTY",
    3: "JSPROXY",
    4: "NOT_FOUND",
    5: "ACCESSOR",
    6: "DATA",
    7: "TRANSITION",
}

const CodeKindToName = {
    0: "BYTECODE_HANDLER",
    1: "FOR_TESTING",
    2: "BUILTIN",
    3: "REGEXP",
    4: "WASM_FUNCTION",
    5: "WASM_TO_CAPI_FUNCTION",
    6: "WASM_TO_JS_FUNCTION",
    7: "JS_TO_WASM_FUNCTION",
    8: "JS_TO_JS_FUNCTION",
    9: "C_WASM_ENTRY",
    10: "INTERPRETED_FUNCTION",
    11: "BASELINE",
    12: "TURBOPROP",
    13: "TURBOFAN",
}

const MapFieldsNameToOffset = {
    "MetaMap": 0,
    "InstanceSize": 4,
    "InObjectPropertiesStartOrConstructorFunctionIndex": 5,
    "UsedOrUnusedInstanceSize": 6,
    "VisitorId": 7,
    //根据InstanceType来判断这个Map所属对象的具体类型
    "InstanceType": 8,
    "BitField": 0xA,
    "BitField2": 0xB,
    "BitField3": 0xC,
    "Prototype": 0x10,
    "ConstructorOrBackPointerOrNativeContext": 0x14,
    //InstanceDescriptors保存了对象的各种属性名以及属性的类型
    "InstanceDescriptors": 0x18,
    "DependentCode": 0x1C,
    "PrototypeValidityCell": 0x20,
    "TransitionsOrPrototypeInfo": 0x24,
}

const JSDescriptorArrayFieldsNameToOffset = {
    "Map": 0,
    //NumberOfAllDescriptors代表属性个数
    "NumberOfAllDescriptors": 4,
    "NumberOfDescriptors": 6,
    "RawNumberOfMarkedDescriptors": 8,
    "Filler16Bits": 0xA,
    "EnumCache": 0xC,
    //Descriptors开始为属性名
    "Descriptors": 0x10,
}

const JSFixedArrayBaseFieldsNameToOffset = {
    "Map": 0,
    "Length": 4,
    "Values": 8,
}

const JSArrayFieldsNameToOffset = {
    "Map": 0,
    "PropertiesOrHash": 4,
    "Elements": 8,
    "Length": 0xC,
}

const JSArrayBufferViewFieldsNameToOffset = {
    "Map": 0,
    "PropertiesOrHash": 4,
    "Elements": 8,
    "Buffer": 0xC,
    "ByteOffset": 0x10,
    "ByteLengthOffset": 0x18,
}

const JSTypedArrayFieldsNameToOffset = {
    "Map": 0,
    "PropertiesOrHash": 4,
    "Elements": 8,
    "Buffer": 0xC,
    "ByteOffset": 0x10,
    "ByteLengthOffset": 0x18,
    "Length": 0x20,
    "ExternalPointerOffset": 0x28,
    "BasePointerOffset": 0x30,
}

const JSStringFieldsNameToOffset = {
    "Map": 0,
    "RawHash": 4,
    "Length": 8,
    //SeqString
    "Values": 0xC,
    //ConsString
    "First": 0xC,
    "Second": 0x10,
    //SliceString
    "Parent": 0xC,
    "Offset": 0x10,
    //ExternalString
    "Resource": 0xC,
    "ResourceData": 0x10,
}

const JSFunctionFieldsNameToOffset = {
    "Map": 0,
    "PropertiesOrHash": 4,
    "Elements": 8,
    "SharedFunctionInfo": 0xC,
    "Context": 0x10,
    "FeedbackCell": 0x14,
    "Code": 0x18,
    "PrototypeOrInitialMap": 0x1C,
}

const JSFeedbackCellFieldsNameToOffset = {
    "Map": 0,
    "Value": 0x4,
}

const JSFeedbackVectorFieldsNamtToOffset = {
    "Map": 0,
    "Length": 0x4,
    "InvocationCount": 0x8,
    "ProfilerTicks": 0xC,
    "Flags": 0x10,
    "SharedFunctionInfo": 0x14,
    "MaybeOptimizedCode": 0x18,
    "ClosureFeedbackCellArray": 0x1C,
}

const JSScriptFieldsNameToOffset = {
    "Map": 0,
    "Source": 4,
}

const JSCodeFieldsNameToOffset = {
    "Map": 0,
    "RelocationInfo": 0x4,
    "DeoptimizationDataOrInterpreterData": 0x8,
    "PositionTable": 0xC,
    "CodeDataContainer": 0x10,
    "InstructionSize": 0x14,
    "MetadataSize": 0x18,
    "Flags": 0x1C,
    "BuiltinIdex": 0x20,
    "InlinedBytecodeSize": 0x24,
    "HandlerTableOffset": 0x28,
}

const JSSharedFunctionInfoFieldsNameToOffset = {
    "Map": 0,
    "FunctionData": 4,
    "NameOrScopeInfo": 8,
    "OuterScopeInfoOrFeedbackMetadata": 0xC,
    "ScriptOrDebugInfo": 0x10,
    "Length": 0x14,
    "FormalParameterCount": 0x16,
    "FunctionToken": 0x18,
    "ExpectedNofProperties": 0x1A,
    "Flags2": 0x1B,
    "Flags": 0x1C,
    "FunctionLiteralId": 0x20,
    "UniqueId": 0x24,
}

const JSHeapNumberFieldsNameToOffset = {
    "Map": 0,
    "ValueLow": 4,
    "ValueHigh": 8,
};

const JSRegularObjectFieldsNameToOffset = {
    "Map": 0,
    "properties": 4,
    "elements": 8,
    "InObject": 0xC,
}

const LookupIteratorObjectNameToOffset = {
    "configuration_": 0,
    "state_": 4,
    "has_property_": 8,
}

function printable(Byte) {
    return Byte >= 0x20 && Byte <= 0x7e;
}

function isnull(Byte) {
    return Byte == 0x00;
}

function byte_to_str(Byte) {
    if (printable(Byte)) {
        return String.fromCharCode(Byte);
    }

    if (isnull(Byte)) {
        return "";
    }

    return "\\x" + Byte.toString(16).padStart(2, "0");
}

const log = p => host.diagnostics.debugLog(p + "\n");

function fix_v8addr(Addr) {
    return Addr - Addr.bitwiseAnd(PointerTag);
}

//从内存中读取数据
function read_u64(Addr) {
    let Value = 0;
    try {
        Value = host.memory.readMemoryValues(Addr, 1, 8)[0];
    } catch (err) {
    }
    return Value;
}

function read_u32(Addr) {
    let Value = 0;
    try {
        Value = host.memory.readMemoryValues(Addr, 1, 4)[0];
    } catch (err) {
    }
    return Value;
}

function read_u16(Addr) {
    let Value = 0;
    try {
        Value = host.memory.readMemoryValues(Addr, 1, 2)[0];
    } catch (err) {
    }
    return Value;
}

function read_u8(Addr) {
    let Value = 0;
    try {
        Value = host.memory.readMemoryValues(Addr, 1, 1)[0];
    } catch (err) {
    }
    return Value;
}

//获取指定值，判断位压缩指针或是SMI
class __JSValue {
    constructor(Value) {
        this._Value = Value;
        this._IsSmi = Value.bitwiseAnd(PointerTag) == 0 ? true : false;
    }

    //返回SMI，或是压缩指针真实的地址
    get Payload() {
        if (this._IsSmi) {
            //返回值
            return this._Value.bitwiseShiftRight(PointerTag);
        } else {
            //返回压缩指针真实地址
            return this._Value = fix_v8addr(this._Value);
        }
    }

    get Tag() {
        if (this._IsSmi) {
            return "SMI";
        } else {
            return "Pointer";
        }
    }
}

class __JSDescriptorArray {
    constructor(Addr) {
        this._Addr = Addr;
        this._Base = this._Addr.bitwiseAnd(PointerBaseAnd);
        this._NumberOfDescriptors = read_u16(Addr + JSDescriptorArrayFieldsNameToOffset["NumberOfDescriptors"]);
        this._PropertyNames = [];

        for (let Idx = 0; Idx < this._NumberOfDescriptors; Idx++) {
            let Key = new __JSString(new __JSValue(this._Base + read_u32(this._Addr + JSDescriptorArrayFieldsNameToOffset["Descriptors"] + Idx * 0xC)).Payload);
            this._PropertyNames.push(Key._String);
        }
    }

    Data() {
        return this._PropertyNames;
    }

    Display() {
        log("NumberOfDescriptors: " + this._NumberOfDescriptors.toString(16));
        log("Properties: " + this._PropertyNames);
    }
}

class __Map {
    constructor(Addr) {
        this._Addr = Addr;
        this._Base = this._Addr.bitwiseAnd(PointerBaseAnd);
        this._MetaMap = read_u32(Addr + MapFieldsNameToOffset["MetaMap"]);
        this._InstanceSize = read_u32(Addr + MapFieldsNameToOffset["InstanceSize"]);
        this._InstanceType = read_u16(Addr + MapFieldsNameToOffset["InstanceType"]);
        this._BitField = read_u8(Addr + MapFieldsNameToOffset["BitField"]);
        this._InstanceDescriptor = new __JSDescriptorArray(new __JSValue(this._Base + read_u32(Addr + MapFieldsNameToOffset["InstanceDescriptors"])).Payload);
    }

    Display() {
        log("InstanceType: 0x" + this._InstanceType.toString(16));
        log("BitField: " + this._BitField.toString(16));
        log("Descriptor: " + this._InstanceDescriptor.Display());
    }
}

class __JSHeapObject {
    constructor(Addr) {
        this._Addr = Addr;
        this._Base = this._Addr.bitwiseAnd(PointerBaseAnd);
        this._Map = new __Map(this._Base + new __JSValue(read_u32(Addr + JSArrayFieldsNameToOffset["Map"])).Payload);
    }
}

class __JSReceiver extends __JSHeapObject {
    constructor(Addr) {
        super(Addr);
        this._PropertiesOrHash = this._Base + new __JSValue(read_u32(Addr + JSArrayFieldsNameToOffset["PropertiesOrHash"])).Payload;
    }
}

class __JSObject extends __JSReceiver {
    constructor(Addr) {
        super(Addr);
        this._Elements = this._Base + new __JSValue(read_u32(Addr + JSArrayFieldsNameToOffset["Elements"])).Payload;
    }
}

class __JSFixedArrayBase extends __JSHeapObject{
    constructor(Addr) {
        super(Addr);
        this._Length = new __JSValue(read_u32(Addr + JSFixedArrayBaseFieldsNameToOffset["Length"]));
    }

    Display() {
        const Content = [];
        for (let Idx = 0; Idx < this._Length.Payload; Idx++) {
            let Value = new __JSValue(read_u32(this._Addr + JSFixedArrayBaseFieldsNameToOffset["Values"] + Idx * 4));

            if (Value.Tag == "SMI") {
                Content.push(Value.Payload);
            } else {
                Content.push(this._Base + Value.Payload);
            }
        }

        log("Content: ")
        for (let Idx = 0; Idx < 2; Idx++) {
            log(Content[Idx].toString(16));
        }
    }
}

class __JSArray extends __JSObject{
    constructor(Addr) {
        super(Addr);
        this._Length = new __JSValue(read_u32(Addr + JSArrayFieldsNameToOffset["Length"]));
        this._ElementsData = new __JSFixedArrayBase(this._Elements);
    }

    Display() {
        log("ObjType: JSArray");
        log("JSArray.Map: " + this._Map.toString(16));
        log("JSArray.PropertiesOrHash: " + this._PropertiesOrHash.toString(16));
        log("JSArray.Elements: " + this._Elements.toString(16));
        log("JSArray.Length: " + this._Length.Payload);
        this._ElementsData.Display();
    }
}

class __JSArrayBufferView extends __JSObject{
    constructor(Addr) {
        super(Addr);
        this._Buffer = this._Base + new __JSValue(read_u32(Addr + JSArrayBufferViewFieldsNameToOffset["Buffer"])).Payload;
        this._ByteOffset = new __JSValue(read_u64(Addr + JSArrayBufferViewFieldsNameToOffset["ByteOffset"])).Payload;
        this._ByteLengthOffset = new __JSValue(read_u64(Addr + JSArrayBufferViewFieldsNameToOffset["ByteLengthOffset"])).Payload;
    }
}

class __JSTypedArray extends __JSArrayBufferView {
    constructor(Addr) {
        super(Addr);
        this._Length = read_u64(Addr + JSTypedArrayFieldsNameToOffset["Length"]);
        this._ExternalPointerOffset = read_u64(Addr + JSTypedArrayFieldsNameToOffset["ExternalPointerOffset"]);
        this._BasePointerOffset = new __JSValue(read_u64(Addr + JSTypedArrayFieldsNameToOffset["BasePointerOffset"])).Payload;
    }

    Display() {
        log("ObjType: JSTypedArray");
        log("JSTypedArray.Map: " + this._Map.toString(16));
        log("JSTypedArray.PropertiesOrHash: " + this._PropertiesOrHash.toString(16));
        log("JSTypedArray.Elements: " + this._Elements.toString(16));
        log("JSTypedArray:Length: 0x" + this._Length.toString(16));
        log("JSTypedArrayExternalPointerOffset: " + this._ExternalPointerOffset.toString(16));
    }
}

class __JSString extends __JSHeapObject{
    constructor(Addr) {
        super(Addr);
        this._RawHash = read_u32(Addr + JSStringFieldsNameToOffset["RawHash"])
        this._Length = read_u32(Addr + JSStringFieldsNameToOffset["Length"]);
        this._Type = this._Map._InstanceType.bitwiseAnd(StringRepresentationAndEncodingMask);
        this._NameType = this._RawHash.bitwiseAnd(NameRawHashFieldMask);

        if (this._Type == SeqOneByteStringTag) {
            this._String = Array.from(host.memory.readMemoryValues(this._Addr + JSStringFieldsNameToOffset["Values"], this._Length, 1)).map(p => byte_to_str(p)).join("");
        }
        else if (this._Type == SeqTwoByteStringTag) {

        }
        else if (this._Type == ExternalOneByteStringTag) {

        }
        else if (this._Type == ExternalTwoByteStringTag) {

        }
        else if (this._Type == SliceOneByteStringTag) {
            this._Parent = new __JSString(this._Base + new __JSValue(read_u32(Addr + JSStringFieldsNameToOffset["Parent"])).Payload);
            this._Offset = read_u32(Addr + JSStringFieldsNameToOffset["Offset"]) / 2;
            this._String = this._Parent._String.substring(this._Offset, this._Offset + this._Length);
        }
        else if (this._Type == SliceTwoByteStringTag) {

        }
        else if (this._Type == ConsOneByteStringTag) {
            this._First = new __JSString(this._Base + new __JSValue(read_u32(Addr + JSStringFieldsNameToOffset["First"])).Payload);
            this._Second = new __JSString(this._Base + new __JSValue(read_u32(Addr + JSStringFieldsNameToOffset["Second"])).Payload);
            this._String = this._First._String + this._Second._String;
        }
        else if (this._Type == ConsTwoByteStringTag) {

        }
    }

    Data() {
        return this._String;
    }

    Display() {
        log("ObjType: JSString");
        log("JSString Type: " + this._Type.toString(16) + " Desc: " + JSStringTypeToName[Number(this._Type)]);
        log("RawHash: 0x" + this._RawHash.toString(16) + " Type: " + NameRawHashFieldEncodeToName[Number(this._NameType)]);
        log("Data: " + this._String);
    }
}

class __JSScript {
    constructor(Addr) {
        this._Addr = Addr;
        this._Base = this._Addr.bitwiseAnd(PointerBaseAnd);
        this._Source = new __JSString(this._Base + new __JSValue(read_u32(Addr + JSScriptFieldsNameToOffset["Source"])).Payload);
    }
}

class __JSSharedFunctionInfo {
    constructor(Addr) {
        this._Addr = Addr;
        this._Base = this._Addr.bitwiseAnd(PointerBaseAnd);
        this._Name = new __JSString(this._Base + new __JSValue(read_u32(Addr + JSSharedFunctionInfoFieldsNameToOffset["NameOrScopeInfo"])).Payload);
        this._Script = new __JSScript(this._Base + new __JSValue(read_u32(Addr + JSSharedFunctionInfoFieldsNameToOffset["ScriptOrDebugInfo"])).Payload);
    }
}

class __JSFeedbackVector {
    constructor(Addr) {
        this._Addr = Addr;
        this._Base = this._Addr.bitwiseAnd(PointerBaseAnd);
        this._InvocationCount = read_u32(Addr + JSFeedbackVectorFieldsNamtToOffset["InvocationCount"]);
    }
}

class __JSFeedbackCell {
    constructor(Addr) {
        this._Addr = Addr;
        this._Base = this._Addr.bitwiseAnd(PointerBaseAnd);
        this._Value = read_u32(Addr + JSFeedbackCellFieldsNameToOffset["Value"]);
        this._ValueMap = new __Map(this._Base + read_u32(new __JSValue(this._Base + this._Value).Payload));
        this._Has_vector = false;

        if (MapInstanceTypeToName[this._ValueMap._InstanceType] == "FEEDBACK_VECTOR_TYPE") {
            this._Value = new __JSFeedbackVector(this._Base + new __JSValue(this._Value).Payload);
            this._Has_vector = true;
        }
    }
}

class __JSCode {
    constructor(Addr) {
        this._Addr = Addr;
        this._Base = this._Addr.bitwiseAnd(PointerBaseAnd);
        this._Flags = read_u32(Addr + JSCodeFieldsNameToOffset["Flags"]);
        this._Kind = Number(this._Flags.bitwiseAnd(CodeKindEncodingMask));
    }

    Display() {
        log("FunctionKind: " + CodeKindToName[this._Kind]);
    }
}

class __JSFunction {
    constructor(Addr) {
        this._Addr = Addr;
        this._Base = this._Addr.bitwiseAnd(PointerBaseAnd);
        this._SharedFunctionInfo = new __JSSharedFunctionInfo(this._Base + new __JSValue(read_u32(Addr + JSFunctionFieldsNameToOffset["SharedFunctionInfo"])).Payload);
        this._FeedbackCell = new __JSFeedbackCell(this._Base + new __JSValue(read_u32(Addr + JSFunctionFieldsNameToOffset["FeedbackCell"])).Payload);
        this._Code = new __JSCode(this._Base + new __JSValue(read_u32(Addr + JSFunctionFieldsNameToOffset["Code"])).Payload);
    }

    Display() {
        log("ObjType: JSFunction");
        log("FunctionName: " + this._SharedFunctionInfo._Name._String);
        log("FunctionScript: " + this._SharedFunctionInfo._Script._Source._String);
        log("FunctionKind: " + CodeKindToName[this._Code._Kind]);
        if (this._FeedbackCell._Has_vector == true) {
            log("FunctioinInvocation: " + this._FeedbackCell._Value._InvocationCount);
        }
    }
}

class __JSHeapNumber {
    constructor(Addr) {
        this._Addr = Addr;
        this._ValueLow = read_u32(Addr + JSHeapNumberFieldsNameToOffset["ValueLow"])
        this._ValueHigh = read_u32(Addr + JSHeapNumberFieldsNameToOffset["ValueHigh"])
    }

    Display() {
        log("ObjType: HeapNumber");
        log("HeapNumber High Part: " + this._ValueHigh.toString(16))
        log("HeapNumber Low Part: " + this._ValueLow.toString(16))
    }
}

class __JSRegularObject {
    constructor(Addr) {
        this._Addr = Addr;
        this._Base = this._Addr.bitwiseAnd(PointerBaseAnd);
        this._Map = new __Map(new __JSValue(this._Base + read_u32(this._Addr + JSRegularObjectFieldsNameToOffset["Map"])).Payload);
        this._Elements = read_u32(this._Addr + JSRegularObjectFieldsNameToOffset["elements"]);
        this._Properties = read_u32(this._Addr + JSRegularObjectFieldsNameToOffset["properties"]);
        this._Properties = this._Map._InstanceDescriptor.Data();
    }

    Display() {
        for (let Idx = 0; Idx < this._Map._InstanceDescriptor._NumberOfDescriptors; Idx++) {
            let Value = new __JSObject(new __JSValue(this._Base + read_u32(this._Addr + JSRegularObjectFieldsNameToOffset["InObject"] + Idx * 4)).Payload);
            log(this._Properties[Idx] + " : " + Value.Display());
        }

    }
}

const MapInstanceNameToObjectType = {
    "JS_ARRAY_TYPE": __JSArray,
    "JS_TYPED_ARRAY_TYPE": __JSTypedArray,
    "DESCRIPTOR_ARRAY_TYPE": __JSDescriptorArray,

    "ONE_BYTE_INTERNALIZED_STRING_TYPE": __JSString,
    "ONE_BYTE_STRING_TYPE": __JSString,
    "UNCACHED_EXTERNAL_ONE_BYTE_INTERNALIZED_STRING_TYPE": __JSString,
    "CONS_ONE_BYTE_STRING_TYPE": __JSString,
    "EXTERNAL_ONE_BYTE_STRING_TYPE": __JSString,
    "SLICED_ONE_BYTE_STRING_TYPE": __JSString,
    "THIN_ONE_BYTE_STRING_TYPE": __JSString,

    "CODE_TYPE": __JSCode,
    "JS_FUNCTION_TYPE": __JSFunction,
    "HEAP_NUMBER_TYPE": __JSHeapNumber,

    "JS_OBJECT_TYPE": __JSRegularObject,
};

class __Object {
    constructor(Addr) {
        this._Addr = Addr;
        this._Base = this._Addr.bitwiseAnd(PointerBaseAnd);
        this._Value = new __JSValue(read_u32(Addr));

        if (this._Value.Tag == "SMI") {
            return;
        }

        this._Map = new __Map(this._Base + this._Value.Payload);
        if (MapInstanceTypeToName.hasOwnProperty(this._Map._InstanceType)) {
            this._ObjectFields = new MapInstanceNameToObjectType[MapInstanceTypeToName[this._Map._InstanceType]](Addr);
        }
    }

    Display() {
        if (this._Value.Tag == "SMI") {
            log("SMI: " + this._Value.Payload);
        } else {
            this._ObjectFields.Display();
        }
    }
}

class __LookupIteratorObject {
    constructor(Addr) {
        this._Addr = Addr;
        this._configuration = read_u32(Addr + LookupIteratorObjectNameToOffset["configuration_"]);
        this._state = read_u32(Addr + LookupIteratorObjectNameToOffset["state_"]);
        this._has_property = read_u8(Addr + LookupIteratorObjectNameToOffset["has_property_"]) == 0 ? false : true;
    }

    Display() {
        log("Addr: " + this._Addr.toString(16));
        log("configuration_: " + LookupIteratorConfigurationValueToName[this._configuration]);
        log("state_: " + LookIteratorStateValueToName[this._state]);
        log("has_property_: " + this._has_property.toString(16));
    }
}

function v8dump_jsobject(Addr) {
    const JSObject = new __Object(Addr);

    JSObject.Display();
}

//打印值信息
function v8dump_jsvalue(Value) {
    if (Value == undefined) {
        log("!v8dump_jsvalue <jsvalue object addr>");
    }

    generateMapInstanceTypeToName();
    const JSValue = new __JSValue(Value);
    if (JSValue.Tag == "SMI") {
        log("SMI: " + JSValue.Payload);
    } else {
        log("Pointer: ");
        v8dump_jsobject(JSValue.Payload);
    }
}

function v8dump_lookupiterator(Value) {
    if (Value == undefined) {
        log("!v8dump_lookupiterator <lookupiterator object addr>");
    } else {
        log("LookupIteratorObject: ");
        const LookupIteratorObject = new __LookupIteratorObject(Value);
        LookupIteratorObject.Display();
    }
}

//打印map信息
function v8dump_jsmap(Value) {
    if (Value == undefined) {
        log("!v8dump_jsmap <jsmap object addr>");
    } else {
        const Addr = new __JSValue(Value);
        const MapObject = new __Map(Addr.Payload);

        MapObject.Display();
    }
}

function initializeScript() {
    return [
        new host.apiVersionSupport(1, 3),
        new host.functionAlias(v8dump_jsvalue, "v8dump_jsvalue"),
        new host.functionAlias(v8dump_lookupiterator, "v8dump_lookupiterator"),
        new host.functionAlias(v8dump_jsmap, "v8dump_jsmap")
    ];
}
