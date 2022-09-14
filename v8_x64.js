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

const CodeKindEncodingMask = host.Int64(0xF);

const TypeName = ["SMI"];

//instance-types-tq.h
//instance-type.h
//v8heapconst.py
const MapInstanceTypeToName = {
    0: "INTERNALIZED_STRING_TYPE",
    8: "ONE_BYTE_INTERNALIZED_STRING_TYPE",
    26: "UNCACHED_EXTERNAL_ONE_BYTE_INTERNALIZED_STRING_TYPE",
    40: "ONE_BYTE_STRING_TYPE",
    66: "HEAP_NUMBER_TYPE",
    166: "FEEDBACK_VECTOR_TYPE",
    1057: "JS_OBJECT_TYPE",
    1085: "JS_ARRAY_TYPE",
    1059: "JS_FUNCTION_TYPE",
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
    "InstanceType": 8,
    "BitField": 0xA,
    "BitField2": 0xB,
    "BitField3": 0xC,
    "Prototype": 0x10,
    "ConstructorOrBackPointerOrNativeContext": 0x14,
    "InstanceDescriptors": 0x18,
    "DependentCode": 0x1C,
    "PrototypeValidityCell": 0x20,
    "TransitionsOrPrototypeInfo": 0x24,
}

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

const JSArrayFieldsNameToOffset = {
    "Map": 0,
    "PropertiesOrHash": 4,
    "Elements": 8,
    "Length": 0xC,
}

const JSFixedArrayBaseFieldsNameToOffset = {
    "Map": 0,
    "Length": 4,
    "Values": 8,
}

const JSStringFieldsNameToOffset = {
    "Map": 0,
    "RawHash": 4,
    "Length": 8,
    "Values": 0xC,
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

class __JSValue {
    constructor(Value) {
        this._Value = Value;
        this._IsSmi = Value.bitwiseAnd(PointerTag) == 0 ? true : false;
    }

    get Payload() {
        if (this._IsSmi) {
            return this._Value.bitwiseShiftRight(PointerTag);
        } else {
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

class __JSMap {
    constructor(Addr) {
        this._MetaMap = read_u32(Addr + MapFieldsNameToOffset["MetaMap"]);
        this._InstanceSize = read_u32(Addr + MapFieldsNameToOffset["InstanceSize"]);
        this._InstanceType = read_u16(Addr + MapFieldsNameToOffset["InstanceType"]);
        this._BitField = read_u8(Addr + MapFieldsNameToOffset["BitField"]);
    }

    Display() {
        log("InstanceType: " + this._InstanceType.toString(16));
        log("BitField: " + this._BitField.toString(16));
    }
}

class __JSFixedArrayBase {
    constructor(Addr) {
        this._Addr = Addr;
        this._Base = this._Addr.bitwiseAnd(PointerBaseAnd);
        this._Map = this._Base + new __JSValue(read_u32(Addr + JSFixedArrayBaseFieldsNameToOffset["Map"])).Payload;
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

class __JSArray {
    constructor(Addr) {
        this._Addr = Addr;
        this._Base = this._Addr.bitwiseAnd(PointerBaseAnd);
        this._Map = this._Base + new __JSValue(read_u32(Addr + JSArrayFieldsNameToOffset["Map"])).Payload;
        this._PropertiesOrHash = this._Base + new __JSValue(read_u32(Addr + JSArrayFieldsNameToOffset["PropertiesOrHash"])).Payload;
        this._Elements = this._Base + new __JSValue(read_u32(Addr + JSArrayFieldsNameToOffset["Elements"])).Payload;
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

class __JSString {
    constructor(Addr) {
        this._Addr = Addr;
        this._Base = this._Addr.bitwiseAnd(PointerBaseAnd);
        this._Map = new __JSMap(this._Base + new __JSValue(read_u32(Addr + JSStringFieldsNameToOffset["Map"])).Payload);
        this._Length = read_u32(Addr + JSStringFieldsNameToOffset["Length"]);
        this._Type = this._Map._InstanceType.bitwiseAnd(StringRepresentationAndEncodingMask);

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

        }
        else if (this._Type == SliceTwoByteStringTag) {

        }
        else if (this._Type == ConsOneByteStringTag) {

        }
        else if (this._Type == ConsTwoByteStringTag) {

        }
    }

    Display() {
        log("ObjType: JSString");
        log("JSString Type: " + this._Type.toString(16));
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
        this._ValueMap = new __JSMap(this._Base + read_u32(new __JSValue(this._Base + this._Value).Payload));
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

const MapInstanceNameToObjectType = {
    "JS_ARRAY_TYPE": __JSArray,
    "ONE_BYTE_INTERNALIZED_STRING_TYPE": __JSString,
    "ONE_BYTE_STRING_TYPE": __JSString,
    "UNCACHED_EXTERNAL_ONE_BYTE_INTERNALIZED_STRING_TYPE": __JSString,
    "JS_FUNCTION_TYPE": __JSFunction,
    "HEAP_NUMBER_TYPE": __JSHeapNumber,
};

class __JSObject {
    constructor(Addr) {
        this._Addr = Addr;
        this._Base = this._Addr.bitwiseAnd(PointerBaseAnd);
        this._Value = new __JSValue(read_u32(Addr));

        if (this._Value.Tag == "SMI") {
            return;
        }

        this._Map = new __JSMap(this._Base + this._Value.Payload);
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
    const JSObject = new __JSObject(Addr);

    JSObject.Display();
}

function v8dump_jsvalue(Value) {
    if (Value == undefined) {
        log("!v8dump_jsvalue <jsvalue object addr>");
    }

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
        log("!v8dump_lookupiterator <lookupiterator object addr");
    } else {
        log("LookupIteratorObject: ");
        const LookupIteratorObject = new __LookupIteratorObject(Value);
        LookupIteratorObject.Display();
    }
}

function v8dump_jsmap(Value) {
    if (Value == undefined) {
        log("!v8dump_jsmap <jsmap object addr");
    } else {
        const Addr = new __JSValue(Value);
        const MapObject = new __JSMap(Addr.Payload);

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