"use scrict";

const PointerTag = host.Int64(0x1);
const PointerBaseAnd = host.Int64(0xFFFFFFFF00000000);

const TypeName = ["SMI"];

const MapInstanceTypeToName = {
    0: "INTERNALIZED_STRING_TYPE",
    8: "ONE_BYTE_INTERNALIZED_STRING_TYPE",
    2101: "JS_ARRAY_TYPE"

};

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

const JSArrayFieldsNameToOffset = {
    "Map": 0,
    "PropertiesOrHash": 4,
    "Elements": 8,
    "Length": 0xC,
};

const JSFixedArrayBaseFieldsNameToOffset = {
    "Map": 0,
    "Length": 4,
    "Values": 8,
}

const JSStringFieldsNameToOffset = {
    "Map": 0,
    "RawHash": 4,
    "Length": 8,
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

class __JSValue {
    constructor(Value) {
        this._Value = Value;
        this._IsSmi = Value.bitwiseAnd(PointerTag) == 0 ? true : false;
    }

    get Payload() {
        if (this._IsSmi) {
            return this._Value.bitwiseShiftRight(PointerTag);
        }
        else {
            return this._Value = fix_v8addr(this._Value);
        }
    }

    get Tag() {
        if (this._IsSmi) {
            return "SMI";
        }
        else {
            return "Pointer";
        }
    }
}

class __JSMap {
    constructor(Addr) {
        this._MetaMap = read_u32(Addr + MapFieldsNameToOffset["MetaMap"]);
        this._InstanceSize = read_u32(Addr + MapFieldsNameToOffset["InstanceSize"]);
        this._InstanceType = read_u16(Addr + MapFieldsNameToOffset["InstanceType"]);
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
            }
            else {
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
        this._Length = new __JSValue(read_u32(Addr + JSStringFieldsNameToOffset["Length"]));
    }

    Display() {
        log("ObjType: JSString");
    }
}

const MapInstanceNameToObjectType = {
    "JS_ARRAY_TYPE": __JSArray,
    "ONE_BYTE_INTERNALIZED_STRING_TYPE": __JSString,
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
        }
        else {
            this._ObjectFields.Display();
        }
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
    }
    else {
        log("Pointer: ");
        v8dump_jsobject(JSValue.Payload);
    }
}

function initializeScript() {
    return [
        new host.apiVersionSupport(1, 3),
        new host.functionAlias(v8dump_jsvalue, "v8dump_jsvalue")
    ];
}
