"use scrict";

const PointerTag = host.Int64(0x1);
const SmiShiftRight = host.Int64(0x32);

const TypeName = ["SMI"];

const log = p => host.diagnostics.debugLog(p + "\n");

function fix_v8addr(Addr) {
    return Addr.bitwiseAnd(PointerTag);
}

class __JSValue {
    constructor(Value) {
        this._Value = Value;
        this._IsSmi = !(!Value.bitwiseAnd(PointerTag));
        log(this._IsSmi);
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
    }
}

function v8dump_jsobject(Addr) {
    const JSObject = new __JSObject(Addr);
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
        v8dump_jsobject(JSValue.Payload);
    }
}

function initializeScript() {
    return [
        new host.apiVersionSupport(1, 3),
        new host.functionAlias(v8dump_jsvalue, "v8dump_jsvalue")
    ];
}