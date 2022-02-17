"use scrict";

const PointerTag = host.Int64(0x1);
const SmiTag = host.Int64(0xFFFFFFFF);
const SmiShiftRight = host.Int64(0x32);

const TypeName = ["SMI"];

const log = p => host.diagnostics.debugLog(p + "\n");

function fix_v8addr(Addr) {
    return Addr.bitwiseAnd(PointerTag);
}

class __JSValue {
    constructor(Value) {
        this._Value = Value;
        this._IsSmi = !Value.bitwiseAnd(SmiTag);
    }

    get Pagload() {
        if (this._IsSmi) {
            return this._Value.bitwiseShiftRight(SmiShiftRight);
        }
    }

    get Tag() {
        if (this._IsSmi) {
            return "SMI";
        }
    }
}

function v8dump_jsvalue(Value) {
    if (Value == undefined) {
        log("!v8dump_jsvalue <jsvalue object addr>");
    }

    const JSValue = new __JSValue(Value);

}

function initializeScript() {
    return [
        new host.apiVersionSupport(1, 3),
        new host.functionAlias(v8dump_jsvalue, "v8dump_jsvalue")
    ];
}