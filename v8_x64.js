"use scrict";

const PointerTag = host.Int64(0x1);
const SmiShiftRight = host.Int64(0x32);

const TypeName = ["SMI"];

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

class __JSObject {
    constructor(Addr) {
        this._Addr = Addr;
        this._Value = new __JSValue(read_u32(Addr));
    }

    Display() {
        if (this._Value.Tag == "SMI") {
            log("SMI: " + this._Value.Payload);
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