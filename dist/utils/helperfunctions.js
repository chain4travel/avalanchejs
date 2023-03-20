"use strict";
/**
 * @packageDocumentation
 * @module Utils-HelperFunctions
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.costExportTx = exports.calcBytesCost = exports.costImportTx = exports.NodeIDStringToBuffer = exports.bufferToNodeIDString = exports.privateKeyStringToBuffer = exports.bufferToPrivateKeyString = exports.UnixNow = exports.MaxWeightFormula = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const bintools_1 = __importDefault(require("../utils/bintools"));
const errors_1 = require("../utils/errors");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
function MaxWeightFormula(staked, cap) {
    return bn_js_1.default.min(staked.mul(new bn_js_1.default(5)), cap);
}
exports.MaxWeightFormula = MaxWeightFormula;
/**
 * Function providing the current UNIX time using a {@link https://github.com/indutny/bn.js/|BN}.
 */
function UnixNow() {
    return new bn_js_1.default(Math.round(new Date().getTime() / 1000));
}
exports.UnixNow = UnixNow;
/**
 * Takes a private key buffer and produces a private key string with prefix.
 *
 * @param pk A {@link https://github.com/feross/buffer|Buffer} for the private key.
 */
function bufferToPrivateKeyString(pk) {
    return `PrivateKey-${bintools.cb58Encode(pk)}`;
}
exports.bufferToPrivateKeyString = bufferToPrivateKeyString;
/**
 * Takes a private key string and produces a private key {@link https://github.com/feross/buffer|Buffer}.
 *
 * @param pk A string for the private key.
 */
function privateKeyStringToBuffer(pk) {
    if (!pk.startsWith("PrivateKey-")) {
        throw new errors_1.PrivateKeyError("Error - privateKeyStringToBuffer: private keys must start with 'PrivateKey-'");
    }
    const pksplit = pk.split("-");
    return bintools.cb58Decode(pksplit[pksplit.length - 1]);
}
exports.privateKeyStringToBuffer = privateKeyStringToBuffer;
/**
 * Takes a nodeID buffer and produces a nodeID string with prefix.
 *
 * @param pk A {@link https://github.com/feross/buffer|Buffer} for the nodeID.
 */
function bufferToNodeIDString(pk) {
    return `NodeID-${bintools.cb58Encode(pk)}`;
}
exports.bufferToNodeIDString = bufferToNodeIDString;
/**
 * Takes a nodeID string and produces a nodeID {@link https://github.com/feross/buffer|Buffer}.
 *
 * @param pk A string for the nodeID.
 */
function NodeIDStringToBuffer(pk) {
    if (!pk.startsWith("NodeID-")) {
        throw new errors_1.NodeIdError("Error - privateNodeIDToBuffer: nodeID must start with 'NodeID-'");
    }
    const pksplit = pk.split("-");
    return bintools.cb58Decode(pksplit[pksplit.length - 1]);
}
exports.NodeIDStringToBuffer = NodeIDStringToBuffer;
function costImportTx(c, tx) {
    let bytesCost = calcBytesCost(c, tx.toBuffer().byteLength);
    const importTx = tx.getTransaction();
    importTx.getImportInputs().forEach((input) => {
        const inCost = input.getCost(c);
        bytesCost += inCost;
    });
    const fixedFee = 10000;
    return bytesCost + fixedFee;
}
exports.costImportTx = costImportTx;
function calcBytesCost(c, len) {
    return len * c.txBytesGas;
}
exports.calcBytesCost = calcBytesCost;
function costExportTx(c, tx) {
    const bytesCost = calcBytesCost(c, tx.toBuffer().byteLength);
    const exportTx = tx.getTransaction();
    const numSigs = exportTx.getInputs().length;
    const sigCost = numSigs * c.costPerSignature;
    const fixedFee = 10000;
    return bytesCost + sigCost + fixedFee;
}
exports.costExportTx = costExportTx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyZnVuY3Rpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3V0aWxzL2hlbHBlcmZ1bmN0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztHQUdHOzs7Ozs7QUFFSCxrREFBc0I7QUFHdEIsaUVBQXdDO0FBQ3hDLDRDQUE4RDtBQUc5RDs7R0FFRztBQUNILE1BQU0sUUFBUSxHQUFhLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7QUFFakQsU0FBZ0IsZ0JBQWdCLENBQUMsTUFBVSxFQUFFLEdBQU87SUFDbEQsT0FBTyxlQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxlQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQTtBQUMzQyxDQUFDO0FBRkQsNENBRUM7QUFFRDs7R0FFRztBQUNILFNBQWdCLE9BQU87SUFDckIsT0FBTyxJQUFJLGVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQTtBQUN4RCxDQUFDO0FBRkQsMEJBRUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBZ0Isd0JBQXdCLENBQUMsRUFBVTtJQUNqRCxPQUFPLGNBQWMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFBO0FBQ2hELENBQUM7QUFGRCw0REFFQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQix3QkFBd0IsQ0FBQyxFQUFVO0lBQ2pELElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxFQUFFO1FBQ2pDLE1BQU0sSUFBSSx3QkFBZSxDQUN2Qiw4RUFBOEUsQ0FDL0UsQ0FBQTtLQUNGO0lBQ0QsTUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUN2QyxPQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6RCxDQUFDO0FBUkQsNERBUUM7QUFFRDs7OztHQUlHO0FBQ0gsU0FBZ0Isb0JBQW9CLENBQUMsRUFBVTtJQUM3QyxPQUFPLFVBQVUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFBO0FBQzVDLENBQUM7QUFGRCxvREFFQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixvQkFBb0IsQ0FBQyxFQUFVO0lBQzdDLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQzdCLE1BQU0sSUFBSSxvQkFBVyxDQUNuQixpRUFBaUUsQ0FDbEUsQ0FBQTtLQUNGO0lBQ0QsTUFBTSxPQUFPLEdBQWEsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUN2QyxPQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUN6RCxDQUFDO0FBUkQsb0RBUUM7QUFFRCxTQUFnQixZQUFZLENBQUMsQ0FBSSxFQUFFLEVBQWM7SUFDL0MsSUFBSSxTQUFTLEdBQVcsYUFBYSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDbEUsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLGNBQWMsRUFBYyxDQUFBO0lBQ2hELFFBQVEsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUF3QixFQUFRLEVBQUU7UUFDcEUsTUFBTSxNQUFNLEdBQVcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN2QyxTQUFTLElBQUksTUFBTSxDQUFBO0lBQ3JCLENBQUMsQ0FBQyxDQUFBO0lBQ0YsTUFBTSxRQUFRLEdBQVcsS0FBSyxDQUFBO0lBQzlCLE9BQU8sU0FBUyxHQUFHLFFBQVEsQ0FBQTtBQUM3QixDQUFDO0FBVEQsb0NBU0M7QUFFRCxTQUFnQixhQUFhLENBQUMsQ0FBSSxFQUFFLEdBQVc7SUFDN0MsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQTtBQUMzQixDQUFDO0FBRkQsc0NBRUM7QUFFRCxTQUFnQixZQUFZLENBQUMsQ0FBSSxFQUFFLEVBQWM7SUFDL0MsTUFBTSxTQUFTLEdBQVcsYUFBYSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDcEUsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLGNBQWMsRUFBYyxDQUFBO0lBQ2hELE1BQU0sT0FBTyxHQUFXLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxNQUFNLENBQUE7SUFDbkQsTUFBTSxPQUFPLEdBQVcsT0FBTyxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQTtJQUNwRCxNQUFNLFFBQVEsR0FBVyxLQUFLLENBQUE7SUFDOUIsT0FBTyxTQUFTLEdBQUcsT0FBTyxHQUFHLFFBQVEsQ0FBQTtBQUN2QyxDQUFDO0FBUEQsb0NBT0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxuICogQG1vZHVsZSBVdGlscy1IZWxwZXJGdW5jdGlvbnNcbiAqL1xuXG5pbXBvcnQgQk4gZnJvbSBcImJuLmpzXCJcbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJidWZmZXIvXCJcbmltcG9ydCB7IEMgfSBmcm9tIFwiLi9uZXR3b3Jrc1wiXG5pbXBvcnQgQmluVG9vbHMgZnJvbSBcIi4uL3V0aWxzL2JpbnRvb2xzXCJcbmltcG9ydCB7IFByaXZhdGVLZXlFcnJvciwgTm9kZUlkRXJyb3IgfSBmcm9tIFwiLi4vdXRpbHMvZXJyb3JzXCJcbmltcG9ydCB7IEV4cG9ydFR4LCBJbXBvcnRUeCwgVHJhbnNmZXJhYmxlSW5wdXQsIFVuc2lnbmVkVHggfSBmcm9tIFwiLi4vYXBpcy9ldm1cIlxuXG4vKipcbiAqIEBpZ25vcmVcbiAqL1xuY29uc3QgYmludG9vbHM6IEJpblRvb2xzID0gQmluVG9vbHMuZ2V0SW5zdGFuY2UoKVxuXG5leHBvcnQgZnVuY3Rpb24gTWF4V2VpZ2h0Rm9ybXVsYShzdGFrZWQ6IEJOLCBjYXA6IEJOKTogQk4ge1xuICByZXR1cm4gQk4ubWluKHN0YWtlZC5tdWwobmV3IEJOKDUpKSwgY2FwKVxufVxuXG4vKipcbiAqIEZ1bmN0aW9uIHByb3ZpZGluZyB0aGUgY3VycmVudCBVTklYIHRpbWUgdXNpbmcgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2luZHV0bnkvYm4uanMvfEJOfS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFVuaXhOb3coKTogQk4ge1xuICByZXR1cm4gbmV3IEJOKE1hdGgucm91bmQobmV3IERhdGUoKS5nZXRUaW1lKCkgLyAxMDAwKSlcbn1cblxuLyoqXG4gKiBUYWtlcyBhIHByaXZhdGUga2V5IGJ1ZmZlciBhbmQgcHJvZHVjZXMgYSBwcml2YXRlIGtleSBzdHJpbmcgd2l0aCBwcmVmaXguXG4gKlxuICogQHBhcmFtIHBrIEEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gZm9yIHRoZSBwcml2YXRlIGtleS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1ZmZlclRvUHJpdmF0ZUtleVN0cmluZyhwazogQnVmZmVyKTogc3RyaW5nIHtcbiAgcmV0dXJuIGBQcml2YXRlS2V5LSR7YmludG9vbHMuY2I1OEVuY29kZShwayl9YFxufVxuXG4vKipcbiAqIFRha2VzIGEgcHJpdmF0ZSBrZXkgc3RyaW5nIGFuZCBwcm9kdWNlcyBhIHByaXZhdGUga2V5IHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9LlxuICpcbiAqIEBwYXJhbSBwayBBIHN0cmluZyBmb3IgdGhlIHByaXZhdGUga2V5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gcHJpdmF0ZUtleVN0cmluZ1RvQnVmZmVyKHBrOiBzdHJpbmcpOiBCdWZmZXIge1xuICBpZiAoIXBrLnN0YXJ0c1dpdGgoXCJQcml2YXRlS2V5LVwiKSkge1xuICAgIHRocm93IG5ldyBQcml2YXRlS2V5RXJyb3IoXG4gICAgICBcIkVycm9yIC0gcHJpdmF0ZUtleVN0cmluZ1RvQnVmZmVyOiBwcml2YXRlIGtleXMgbXVzdCBzdGFydCB3aXRoICdQcml2YXRlS2V5LSdcIlxuICAgIClcbiAgfVxuICBjb25zdCBwa3NwbGl0OiBzdHJpbmdbXSA9IHBrLnNwbGl0KFwiLVwiKVxuICByZXR1cm4gYmludG9vbHMuY2I1OERlY29kZShwa3NwbGl0W3Brc3BsaXQubGVuZ3RoIC0gMV0pXG59XG5cbi8qKlxuICogVGFrZXMgYSBub2RlSUQgYnVmZmVyIGFuZCBwcm9kdWNlcyBhIG5vZGVJRCBzdHJpbmcgd2l0aCBwcmVmaXguXG4gKlxuICogQHBhcmFtIHBrIEEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gZm9yIHRoZSBub2RlSUQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWZmZXJUb05vZGVJRFN0cmluZyhwazogQnVmZmVyKTogc3RyaW5nIHtcbiAgcmV0dXJuIGBOb2RlSUQtJHtiaW50b29scy5jYjU4RW5jb2RlKHBrKX1gXG59XG5cbi8qKlxuICogVGFrZXMgYSBub2RlSUQgc3RyaW5nIGFuZCBwcm9kdWNlcyBhIG5vZGVJRCB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfS5cbiAqXG4gKiBAcGFyYW0gcGsgQSBzdHJpbmcgZm9yIHRoZSBub2RlSUQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBOb2RlSURTdHJpbmdUb0J1ZmZlcihwazogc3RyaW5nKTogQnVmZmVyIHtcbiAgaWYgKCFway5zdGFydHNXaXRoKFwiTm9kZUlELVwiKSkge1xuICAgIHRocm93IG5ldyBOb2RlSWRFcnJvcihcbiAgICAgIFwiRXJyb3IgLSBwcml2YXRlTm9kZUlEVG9CdWZmZXI6IG5vZGVJRCBtdXN0IHN0YXJ0IHdpdGggJ05vZGVJRC0nXCJcbiAgICApXG4gIH1cbiAgY29uc3QgcGtzcGxpdDogc3RyaW5nW10gPSBway5zcGxpdChcIi1cIilcbiAgcmV0dXJuIGJpbnRvb2xzLmNiNThEZWNvZGUocGtzcGxpdFtwa3NwbGl0Lmxlbmd0aCAtIDFdKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29zdEltcG9ydFR4KGM6IEMsIHR4OiBVbnNpZ25lZFR4KTogbnVtYmVyIHtcbiAgbGV0IGJ5dGVzQ29zdDogbnVtYmVyID0gY2FsY0J5dGVzQ29zdChjLCB0eC50b0J1ZmZlcigpLmJ5dGVMZW5ndGgpXG4gIGNvbnN0IGltcG9ydFR4ID0gdHguZ2V0VHJhbnNhY3Rpb24oKSBhcyBJbXBvcnRUeFxuICBpbXBvcnRUeC5nZXRJbXBvcnRJbnB1dHMoKS5mb3JFYWNoKChpbnB1dDogVHJhbnNmZXJhYmxlSW5wdXQpOiB2b2lkID0+IHtcbiAgICBjb25zdCBpbkNvc3Q6IG51bWJlciA9IGlucHV0LmdldENvc3QoYylcbiAgICBieXRlc0Nvc3QgKz0gaW5Db3N0XG4gIH0pXG4gIGNvbnN0IGZpeGVkRmVlOiBudW1iZXIgPSAxMDAwMFxuICByZXR1cm4gYnl0ZXNDb3N0ICsgZml4ZWRGZWVcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhbGNCeXRlc0Nvc3QoYzogQywgbGVuOiBudW1iZXIpOiBudW1iZXIge1xuICByZXR1cm4gbGVuICogYy50eEJ5dGVzR2FzXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb3N0RXhwb3J0VHgoYzogQywgdHg6IFVuc2lnbmVkVHgpOiBudW1iZXIge1xuICBjb25zdCBieXRlc0Nvc3Q6IG51bWJlciA9IGNhbGNCeXRlc0Nvc3QoYywgdHgudG9CdWZmZXIoKS5ieXRlTGVuZ3RoKVxuICBjb25zdCBleHBvcnRUeCA9IHR4LmdldFRyYW5zYWN0aW9uKCkgYXMgRXhwb3J0VHhcbiAgY29uc3QgbnVtU2lnczogbnVtYmVyID0gZXhwb3J0VHguZ2V0SW5wdXRzKCkubGVuZ3RoXG4gIGNvbnN0IHNpZ0Nvc3Q6IG51bWJlciA9IG51bVNpZ3MgKiBjLmNvc3RQZXJTaWduYXR1cmVcbiAgY29uc3QgZml4ZWRGZWU6IG51bWJlciA9IDEwMDAwXG4gIHJldHVybiBieXRlc0Nvc3QgKyBzaWdDb3N0ICsgZml4ZWRGZWVcbn1cbiJdfQ==