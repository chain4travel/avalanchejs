"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandardTx = exports.StandardUnsignedTx = exports.StandardBaseTx = void 0;
/**
 * @packageDocumentation
 * @module Common-Transactions
 */
const buffer_1 = require("buffer/");
const bintools_1 = __importDefault(require("../utils/bintools"));
const bn_js_1 = __importDefault(require("bn.js"));
const input_1 = require("./input");
const output_1 = require("./output");
const constants_1 = require("../utils/constants");
const serialization_1 = require("../utils/serialization");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serialization = serialization_1.Serialization.getInstance();
const cb58 = "cb58";
const hex = "hex";
const decimalString = "decimalString";
const buffer = "Buffer";
/**
 * Class representing a base for all transactions.
 */
class StandardBaseTx extends serialization_1.Serializable {
    serialize(encoding = "hex") {
        const fields = super.serialize(encoding);
        return Object.assign(Object.assign({}, fields), { networkID: serialization.encoder(this.networkID, encoding, buffer, decimalString), blockchainID: serialization.encoder(this.blockchainID, encoding, buffer, cb58), outs: this.outs.map((o) => o.serialize(encoding)), ins: this.ins.map((i) => i.serialize(encoding)), memo: serialization.encoder(this.memo, encoding, buffer, hex) });
    }
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        this.networkID = serialization.decoder(fields["networkID"], encoding, decimalString, buffer, 4);
        this.blockchainID = serialization.decoder(fields["blockchainID"], encoding, cb58, buffer, 32);
        this.memo = serialization.decoder(fields["memo"], encoding, hex, buffer);
    }
    /**
     * Returns the NetworkID as a number
     */
    getNetworkID() {
        return this.networkID.readUInt32BE(0);
    }
    /**
     * Returns the Buffer representation of the BlockchainID
     */
    getBlockchainID() {
        return this.blockchainID;
    }
    /**
     * Returns the {@link https://github.com/feross/buffer|Buffer} representation of the memo
     */
    getMemo() {
        return this.memo;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[StandardBaseTx]].
     */
    toBuffer() {
        this.outs.sort(output_1.StandardTransferableOutput.comparator());
        this.ins.sort(input_1.StandardTransferableInput.comparator());
        this.numouts.writeUInt32BE(this.outs.length, 0);
        this.numins.writeUInt32BE(this.ins.length, 0);
        let bsize = this.networkID.length + this.blockchainID.length + this.numouts.length;
        const barr = [this.networkID, this.blockchainID, this.numouts];
        for (let i = 0; i < this.outs.length; i++) {
            const b = this.outs[`${i}`].toBuffer();
            barr.push(b);
            bsize += b.length;
        }
        barr.push(this.numins);
        bsize += this.numins.length;
        for (let i = 0; i < this.ins.length; i++) {
            const b = this.ins[`${i}`].toBuffer();
            barr.push(b);
            bsize += b.length;
        }
        let memolen = buffer_1.Buffer.alloc(4);
        memolen.writeUInt32BE(this.memo.length, 0);
        barr.push(memolen);
        bsize += 4;
        barr.push(this.memo);
        bsize += this.memo.length;
        const buff = buffer_1.Buffer.concat(barr, bsize);
        return buff;
    }
    /**
     * Returns a base-58 representation of the [[StandardBaseTx]].
     */
    toString() {
        return bintools.bufferToB58(this.toBuffer());
    }
    toStringHex() {
        return `0x${bintools.addChecksum(this.toBuffer()).toString("hex")}`;
    }
    /**
     * Class representing a StandardBaseTx which is the foundation for all transactions.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param outs Optional array of the [[TransferableOutput]]s
     * @param ins Optional array of the [[TransferableInput]]s
     * @param memo Optional {@link https://github.com/feross/buffer|Buffer} for the memo field
     */
    constructor(networkID = constants_1.DefaultNetworkID, blockchainID = buffer_1.Buffer.alloc(32, 16), outs = undefined, ins = undefined, memo = undefined) {
        super();
        this._typeName = "StandardBaseTx";
        this._typeID = undefined;
        this.networkID = buffer_1.Buffer.alloc(4);
        this.blockchainID = buffer_1.Buffer.alloc(32);
        this.numouts = buffer_1.Buffer.alloc(4);
        this.numins = buffer_1.Buffer.alloc(4);
        this.memo = buffer_1.Buffer.alloc(0);
        this.networkID.writeUInt32BE(networkID, 0);
        this.blockchainID = blockchainID;
        if (typeof memo != "undefined") {
            this.memo = memo;
        }
        if (typeof ins !== "undefined" && typeof outs !== "undefined") {
            this.numouts.writeUInt32BE(outs.length, 0);
            this.outs = outs.sort(output_1.StandardTransferableOutput.comparator());
            this.numins.writeUInt32BE(ins.length, 0);
            this.ins = ins.sort(input_1.StandardTransferableInput.comparator());
        }
    }
}
exports.StandardBaseTx = StandardBaseTx;
/**
 * Class representing an unsigned transaction.
 */
class StandardUnsignedTx extends serialization_1.Serializable {
    serialize(encoding = "hex") {
        let fields = super.serialize(encoding);
        return Object.assign(Object.assign({}, fields), { codecID: serialization.encoder(this.codecID, encoding, "number", "decimalString", 2), transaction: this.transaction.serialize(encoding) });
    }
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        this.codecID = serialization.decoder(fields["codecID"], encoding, "decimalString", "number");
    }
    /**
     * Returns the CodecID as a number
     */
    getCodecID() {
        return this.codecID;
    }
    /**
     * Returns the {@link https://github.com/feross/buffer|Buffer} representation of the CodecID
     */
    getCodecIDBuffer() {
        let codecBuf = buffer_1.Buffer.alloc(2);
        codecBuf.writeUInt16BE(this.codecID, 0);
        return codecBuf;
    }
    /**
     * Returns the inputTotal as a BN
     */
    getInputTotal(assetID) {
        const ins = this.getTransaction().getIns();
        const aIDHex = assetID.toString("hex");
        let total = new bn_js_1.default(0);
        for (let i = 0; i < ins.length; i++) {
            // only check StandardAmountInputs
            if (ins[`${i}`].getInput() instanceof input_1.StandardAmountInput &&
                aIDHex === ins[`${i}`].getAssetID().toString("hex")) {
                const input = ins[`${i}`].getInput();
                total = total.add(input.getAmount());
            }
        }
        return total;
    }
    /**
     * Returns the outputTotal as a BN
     */
    getOutputTotal(assetID) {
        const outs = this.getTransaction().getTotalOuts();
        const aIDHex = assetID.toString("hex");
        let total = new bn_js_1.default(0);
        for (let i = 0; i < outs.length; i++) {
            const inner = outs[`${i}`].getOutput();
            const innerOut = inner instanceof output_1.StandardParseableOutput ? inner.getOutput() : inner;
            // only check StandardAmountOutput
            if (innerOut instanceof output_1.StandardAmountOutput &&
                aIDHex === outs[`${i}`].getAssetID().toString("hex")) {
                total = total.add(innerOut.getAmount());
            }
        }
        return total;
    }
    /**
     * Returns the number of burned tokens as a BN
     */
    getBurn(assetID) {
        return this.getInputTotal(assetID).sub(this.getOutputTotal(assetID));
    }
    toBuffer() {
        const codecBuf = buffer_1.Buffer.alloc(2);
        codecBuf.writeUInt16BE(this.transaction.getCodecID(), 0);
        const txtype = buffer_1.Buffer.alloc(4);
        txtype.writeUInt32BE(this.transaction.getTxType(), 0);
        const basebuff = this.transaction.toBuffer();
        return buffer_1.Buffer.concat([codecBuf, txtype, basebuff], codecBuf.length + txtype.length + basebuff.length);
    }
    constructor(transaction = undefined, codecID = 0) {
        super();
        this._typeName = "StandardUnsignedTx";
        this._typeID = undefined;
        this.codecID = 0;
        this.codecID = codecID;
        this.transaction = transaction;
    }
}
exports.StandardUnsignedTx = StandardUnsignedTx;
/**
 * Class representing a signed transaction.
 */
class StandardTx extends serialization_1.Serializable {
    serialize(encoding = "hex") {
        let fields = super.serialize(encoding);
        return Object.assign(Object.assign({}, fields), { unsignedTx: this.unsignedTx.serialize(encoding), credentials: this.credentials.map((c) => c.serialize(encoding)) });
    }
    /**
     * Returns the [[Credential[]]]
     */
    getCredentials() {
        return this.credentials;
    }
    /**
     * Returns the [[StandardUnsignedTx]]
     */
    getUnsignedTx() {
        return this.unsignedTx;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[StandardTx]].
     */
    toBuffer() {
        const tx = this.unsignedTx.getTransaction();
        const codecID = tx.getCodecID();
        const txbuff = this.unsignedTx.toBuffer();
        let bsize = txbuff.length;
        const credlen = buffer_1.Buffer.alloc(4);
        credlen.writeUInt32BE(this.credentials.length, 0);
        const barr = [txbuff, credlen];
        bsize += credlen.length;
        for (let i = 0; i < this.credentials.length; i++) {
            this.credentials[`${i}`].setCodecID(codecID);
            const credID = buffer_1.Buffer.alloc(4);
            credID.writeUInt32BE(this.credentials[`${i}`].getCredentialID(), 0);
            barr.push(credID);
            bsize += credID.length;
            const credbuff = this.credentials[`${i}`].toBuffer();
            bsize += credbuff.length;
            barr.push(credbuff);
        }
        const buff = buffer_1.Buffer.concat(barr, bsize);
        return buff;
    }
    /**
     * Takes a base-58 string containing an [[StandardTx]], parses it, populates the class, and returns the length of the Tx in bytes.
     *
     * @param serialized A base-58 string containing a raw [[StandardTx]]
     *
     * @returns The length of the raw [[StandardTx]]
     *
     * @remarks
     * unlike most fromStrings, it expects the string to be serialized in cb58 format
     */
    fromString(serialized) {
        return this.fromBuffer(bintools.cb58Decode(serialized));
    }
    /**
     * Returns a cb58 representation of the [[StandardTx]].
     *
     * @remarks
     * unlike most toStrings, this returns in cb58 serialization format
     */
    toString() {
        return bintools.cb58Encode(this.toBuffer());
    }
    toStringHex() {
        return `0x${bintools.addChecksum(this.toBuffer()).toString("hex")}`;
    }
    /**
     * Class representing a signed transaction.
     *
     * @param unsignedTx Optional [[StandardUnsignedTx]]
     * @param signatures Optional array of [[Credential]]s
     */
    constructor(unsignedTx = undefined, credentials = undefined) {
        super();
        this._typeName = "StandardTx";
        this._typeID = undefined;
        this.unsignedTx = undefined;
        this.credentials = [];
        if (typeof unsignedTx !== "undefined") {
            this.unsignedTx = unsignedTx;
            if (typeof credentials !== "undefined") {
                this.credentials = credentials;
            }
        }
    }
}
exports.StandardTx = StandardTx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvY29tbW9uL3R4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7R0FHRztBQUNILG9DQUFnQztBQUNoQyxpRUFBd0M7QUFFeEMsa0RBQXNCO0FBRXRCLG1DQUF3RTtBQUN4RSxxQ0FJaUI7QUFDakIsa0RBQXFEO0FBQ3JELDBEQUsrQjtBQUUvQjs7R0FFRztBQUNILE1BQU0sUUFBUSxHQUFhLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDakQsTUFBTSxhQUFhLEdBQWtCLDZCQUFhLENBQUMsV0FBVyxFQUFFLENBQUE7QUFDaEUsTUFBTSxJQUFJLEdBQW1CLE1BQU0sQ0FBQTtBQUNuQyxNQUFNLEdBQUcsR0FBbUIsS0FBSyxDQUFBO0FBQ2pDLE1BQU0sYUFBYSxHQUFtQixlQUFlLENBQUE7QUFDckQsTUFBTSxNQUFNLEdBQW1CLFFBQVEsQ0FBQTtBQUV2Qzs7R0FFRztBQUNILE1BQXNCLGNBR3BCLFNBQVEsNEJBQVk7SUFJcEIsU0FBUyxDQUFDLFdBQStCLEtBQUs7UUFDNUMsTUFBTSxNQUFNLEdBQVcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNoRCx1Q0FDSyxNQUFNLEtBQ1QsU0FBUyxFQUFFLGFBQWEsQ0FBQyxPQUFPLENBQzlCLElBQUksQ0FBQyxTQUFTLEVBQ2QsUUFBUSxFQUNSLE1BQU0sRUFDTixhQUFhLENBQ2QsRUFDRCxZQUFZLEVBQUUsYUFBYSxDQUFDLE9BQU8sQ0FDakMsSUFBSSxDQUFDLFlBQVksRUFDakIsUUFBUSxFQUNSLE1BQU0sRUFDTixJQUFJLENBQ0wsRUFDRCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsRUFDakQsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMs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LENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQTtJQUN6RCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxRQUFRO1FBQ04sT0FBTyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFBO0lBQzdDLENBQUM7SUFFRCxXQUFXO1FBQ1QsT0FBTyxLQUFLLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUE7SUFDckUsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsWUFDRSxhQUFvQixTQUFTLEVBQzdCLGNBQTRCLFNBQVM7UUFFckMsS0FBSyxFQUFFLENBQUE7UUFoR0MsY0FBUyxHQUFHLFlBQVksQ0FBQTtRQUN4QixZQUFPLEdBQUcsU0FBUyxDQUFBO1FBV25CLGVBQVUsR0FBVSxTQUFTLENBQUE7UUFDN0IsZ0JBQVcsR0FBaUIsRUFBRSxDQUFBO1FBb0Z0QyxJQUFJLE9BQU8sVUFBVSxLQUFLLFdBQVcsRUFBRTtZQUNyQyxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQTtZQUM1QixJQUFJLE9BQU8sV0FBVyxLQUFLLFdBQVcsRUFBRTtnQkFDdEMsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUE7YUFDL0I7U0FDRjtJQUNILENBQUM7Q0FDRjtBQWpIRCxnQ0FpSEMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBwYWNrYWdlRG9jdW1lbnRhdGlvblxuICogQG1vZHVsZSBDb21tb24tVHJhbnNhY3Rpb25zXG4gKi9cbmltcG9ydCB7IEJ1ZmZlciB9IGZyb20gXCJidWZmZXIvXCJcbmltcG9ydCBCaW5Ub29scyBmcm9tIFwiLi4vdXRpbHMvYmludG9vbHNcIlxuaW1wb3J0IHsgQ3JlZGVudGlhbCB9IGZyb20gXCIuL2NyZWRlbnRpYWxzXCJcbmltcG9ydCBCTiBmcm9tIFwiYm4uanNcIlxuaW1wb3J0IHsgU2lnbmVyS2V5Q2hhaW4sIFNpZ25lcktleVBhaXIgfSBmcm9tIFwiLi9rZXljaGFpblwiXG5pbXBvcnQgeyBTdGFuZGFyZEFtb3VudElucHV0LCBTdGFuZGFyZFRyYW5zZmVyYWJsZUlucHV0IH0gZnJvbSBcIi4vaW5wdXRcIlxuaW1wb3J0IHtcbiAgU3RhbmRhcmRBbW91bnRPdXRwdXQsXG4gIFN0YW5kYXJkUGFyc2VhYmxlT3V0cHV0LFxuICBTdGFuZGFyZFRyYW5zZmVyYWJsZU91dHB1dFxufSBmcm9tIFwiLi9vdXRwdXRcIlxuaW1wb3J0IHsgRGVmYXVsdE5ldHdvcmtJRCB9IGZyb20gXCIuLi91dGlscy9jb25zdGFudHNcIlxuaW1wb3J0IHtcbiAgU2VyaWFsaXphYmxlLFxuICBTZXJpYWxpemF0aW9uLFxuICBTZXJpYWxpemVkRW5jb2RpbmcsXG4gIFNlcmlhbGl6ZWRUeXBlXG59IGZyb20gXCIuLi91dGlscy9zZXJpYWxpemF0aW9uXCJcblxuLyoqXG4gKiBAaWdub3JlXG4gKi9cbmNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKClcbmNvbnN0IHNlcmlhbGl6YXRpb246IFNlcmlhbGl6YXRpb24gPSBTZXJpYWxpemF0aW9uLmdldEluc3RhbmNlKClcbmNvbnN0IGNiNTg6IFNlcmlhbGl6ZWRUeXBlID0gXCJjYjU4XCJcbmNvbnN0IGhleDogU2VyaWFsaXplZFR5cGUgPSBcImhleFwiXG5jb25zdCBkZWNpbWFsU3RyaW5nOiBTZXJpYWxpemVkVHlwZSA9IFwiZGVjaW1hbFN0cmluZ1wiXG5jb25zdCBidWZmZXI6IFNlcmlhbGl6ZWRUeXBlID0gXCJCdWZmZXJcIlxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhIGJhc2UgZm9yIGFsbCB0cmFuc2FjdGlvbnMuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTdGFuZGFyZEJhc2VUeDxcbiAgS1BDbGFzcyBleHRlbmRzIFNpZ25lcktleVBhaXIsXG4gIEtDQ2xhc3MgZXh0ZW5kcyBTaWduZXJLZXlDaGFpblxuPiBleHRlbmRzIFNlcmlhbGl6YWJsZSB7XG4gIHByb3RlY3RlZCBfdHlwZU5hbWUgPSBcIlN0YW5kYXJkQmFzZVR4XCJcbiAgcHJvdGVjdGVkIF90eXBlSUQgPSB1bmRlZmluZWRcblxuICBzZXJpYWxpemUoZW5jb2Rpbmc6IFNlcmlhbGl6ZWRFbmNvZGluZyA9IFwiaGV4XCIpOiBvYmplY3Qge1xuICAgIGNvbnN0IGZpZWxkczogb2JqZWN0ID0gc3VwZXIuc2VyaWFsaXplKGVuY29kaW5nKVxuICAgIHJldHVybiB7XG4gICAgICAuLi5maWVsZHMsXG4gICAgICBuZXR3b3JrSUQ6IHNlcmlhbGl6YXRpb24uZW5jb2RlcihcbiAgICAgICAgdGhpcy5uZXR3b3JrSUQsXG4gICAgICAgIGVuY29kaW5nLFxuICAgICAgICBidWZmZXIsXG4gICAgICAgIGRlY2ltYWxTdHJpbmdcbiAgICAgICksXG4gICAgICBibG9ja2NoYWluSUQ6IHNlcmlhbGl6YXRpb24uZW5jb2RlcihcbiAgICAgICAgdGhpcy5ibG9ja2NoYWluSUQsXG4gICAgICAgIGVuY29kaW5nLFxuICAgICAgICBidWZmZXIsXG4gICAgICAgIGNiNThcbiAgICAgICksXG4gICAgICBvdXRzOiB0aGlzLm91dHMubWFwKChvKSA9PiBvLnNlcmlhbGl6ZShlbmNvZGluZykpLFxuICAgICAgaW5zOiB0aGlzLmlucy5tYXAoKGkpID0+IGkuc2VyaWFsaXplKGVuY29kaW5nKSksXG4gICAgICBtZW1vOiBzZXJpYWxpemF0aW9uLmVuY29kZXIodGhpcy5tZW1vLCBlbmNvZGluZywgYnVmZmVyLCBoZXgpXG4gICAgfVxuICB9XG5cbiAgZGVzZXJpYWxpemUoZmllbGRzOiBvYmplY3QsIGVuY29kaW5nOiBTZXJpYWxpemVkRW5jb2RpbmcgPSBcImhleFwiKSB7XG4gICAgc3VwZXIuZGVzZXJpYWxpemUoZmllbGRzLCBlbmNvZGluZylcbiAgICB0aGlzLm5ldHdvcmtJRCA9IHNlcmlhbGl6YXRpb24uZGVjb2RlcihcbiAgICAgIGZpZWxkc1tcIm5ldHdvcmtJRFwiXSxcbiAgICAgIGVuY29kaW5nLFxuICAgICAgZGVjaW1hbFN0cmluZyxcbiAgICAgIGJ1ZmZlcixcbiAgICAgIDRcbiAgICApXG4gICAgdGhpcy5ibG9ja2NoYWluSUQgPSBzZXJpYWxpemF0aW9uLmRlY29kZXIoXG4gICAgICBmaWVsZHNbXCJibG9ja2NoYWluSURcIl0sXG4gICAgICBlbmNvZGluZyxcbiAgICAgIGNiNTgsXG4gICAgICBidWZmZXIsXG4gICAgICAzMlxuICAgIClcbiAgICB0aGlzLm1lbW8gPSBzZXJpYWxpemF0aW9uLmRlY29kZXIoZmllbGRzW1wibWVtb1wiXSwgZW5jb2RpbmcsIGhleCwgYnVmZmVyKVxuICB9XG5cbiAgcHJvdGVjdGVkIG5ldHdvcmtJRDogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpXG4gIHByb3RlY3RlZCBibG9ja2NoYWluSUQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygzMilcbiAgcHJvdGVjdGVkIG51bW91dHM6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg0KVxuICBwcm90ZWN0ZWQgb3V0czogU3RhbmRhcmRUcmFuc2ZlcmFibGVPdXRwdXRbXVxuICBwcm90ZWN0ZWQgbnVtaW5zOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcbiAgcHJvdGVjdGVkIGluczogU3RhbmRhcmRUcmFuc2ZlcmFibGVJbnB1dFtdXG4gIHByb3RlY3RlZCBtZW1vOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoMClcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgaWQgb2YgdGhlIFtbU3RhbmRhcmRCYXNlVHhdXVxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0VHhUeXBlKCk6IG51bWJlclxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBOZXR3b3JrSUQgYXMgYSBudW1iZXJcbiAgICovXG4gIGdldE5ldHdvcmtJRCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm5ldHdvcmtJRC5yZWFkVUludDMyQkUoMClcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBCdWZmZXIgcmVwcmVzZW50YXRpb24gb2YgdGhlIEJsb2NrY2hhaW5JRFxuICAgKi9cbiAgZ2V0QmxvY2tjaGFpbklEKCk6IEJ1ZmZlciB7XG4gICAgcmV0dXJuIHRoaXMuYmxvY2tjaGFpbklEXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYXJyYXkgb2YgW1tTdGFuZGFyZFRyYW5zZmVyYWJsZUlucHV0XV1zXG4gICAqL1xuICBhYnN0cmFjdCBnZXRJbnMoKTogU3RhbmRhcmRUcmFuc2ZlcmFibGVJbnB1dFtdXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGFycmF5IG9mIFtbU3RhbmRhcmRUcmFuc2ZlcmFibGVPdXRwdXRdXXNcbiAgICovXG4gIGFic3RyYWN0IGdldE91dHMoKTogU3RhbmRhcmRUcmFuc2ZlcmFibGVPdXRwdXRbXVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBhcnJheSBvZiBjb21iaW5lZCB0b3RhbCBbW1N0YW5kYXJkVHJhbnNmZXJhYmxlT3V0cHV0XV1zXG4gICAqL1xuICBhYnN0cmFjdCBnZXRUb3RhbE91dHMoKTogU3RhbmRhcmRUcmFuc2ZlcmFibGVPdXRwdXRbXVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSByZXByZXNlbnRhdGlvbiBvZiB0aGUgbWVtb1xuICAgKi9cbiAgZ2V0TWVtbygpOiBCdWZmZXIge1xuICAgIHJldHVybiB0aGlzLm1lbW9cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gcmVwcmVzZW50YXRpb24gb2YgdGhlIFtbU3RhbmRhcmRCYXNlVHhdXS5cbiAgICovXG4gIHRvQnVmZmVyKCk6IEJ1ZmZlciB7XG4gICAgdGhpcy5vdXRzLnNvcnQoU3RhbmRhcmRUcmFuc2ZlcmFibGVPdXRwdXQuY29tcGFyYXRvcigpKVxuICAgIHRoaXMuaW5zLnNvcnQoU3RhbmRhcmRUcmFuc2ZlcmFibGVJbnB1dC5jb21wYXJhdG9yKCkpXG4gICAgdGhpcy5udW1vdXRzLndyaXRlVUludDMyQkUodGhpcy5vdXRzLmxlbmd0aCwgMClcbiAgICB0aGlzLm51bWlucy53cml0ZVVJbnQzMkJFKHRoaXMuaW5zLmxlbmd0aCwgMClcbiAgICBsZXQgYnNpemU6IG51bWJlciA9XG4gICAgICB0aGlzLm5ldHdvcmtJRC5sZW5ndGggKyB0aGlzLmJsb2NrY2hhaW5JRC5sZW5ndGggKyB0aGlzLm51bW91dHMubGVuZ3RoXG4gICAgY29uc3QgYmFycjogQnVmZmVyW10gPSBbdGhpcy5uZXR3b3JrSUQsIHRoaXMuYmxvY2tjaGFpbklELCB0aGlzLm51bW91dHNdXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMub3V0cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYjogQnVmZmVyID0gdGhpcy5vdXRzW2Ake2l9YF0udG9CdWZmZXIoKVxuICAgICAgYmFyci5wdXNoKGIpXG4gICAgICBic2l6ZSArPSBiLmxlbmd0aFxuICAgIH1cbiAgICBiYXJyLnB1c2godGhpcy5udW1pbnMpXG4gICAgYnNpemUgKz0gdGhpcy5udW1pbnMubGVuZ3RoXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMuaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBiOiBCdWZmZXIgPSB0aGlzLmluc1tgJHtpfWBdLnRvQnVmZmVyKClcbiAgICAgIGJhcnIucHVzaChiKVxuICAgICAgYnNpemUgKz0gYi5sZW5ndGhcbiAgICB9XG4gICAgbGV0IG1lbW9sZW46IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg0KVxuICAgIG1lbW9sZW4ud3JpdGVVSW50MzJCRSh0aGlzLm1lbW8ubGVuZ3RoLCAwKVxuICAgIGJhcnIucHVzaChtZW1vbGVuKVxuICAgIGJzaXplICs9IDRcbiAgICBiYXJyLnB1c2godGhpcy5tZW1vKVxuICAgIGJzaXplICs9IHRoaXMubWVtby5sZW5ndGhcbiAgICBjb25zdCBidWZmOiBCdWZmZXIgPSBCdWZmZXIuY29uY2F0KGJhcnIsIGJzaXplKVxuICAgIHJldHVybiBidWZmXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIGJhc2UtNTggcmVwcmVzZW50YXRpb24gb2YgdGhlIFtbU3RhbmRhcmRCYXNlVHhdXS5cbiAgICovXG4gIHRvU3RyaW5nKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGJpbnRvb2xzLmJ1ZmZlclRvQjU4KHRoaXMudG9CdWZmZXIoKSlcbiAgfVxuXG4gIHRvU3RyaW5nSGV4KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGAweCR7YmludG9vbHMuYWRkQ2hlY2tzdW0odGhpcy50b0J1ZmZlcigpKS50b1N0cmluZyhcImhleFwiKX1gXG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgdGhlIGJ5dGVzIG9mIGFuIFtbVW5zaWduZWRUeF1dIGFuZCByZXR1cm5zIGFuIGFycmF5IG9mIFtbQ3JlZGVudGlhbF1dc1xuICAgKlxuICAgKiBAcGFyYW0gbXNnIEEgQnVmZmVyIGZvciB0aGUgW1tVbnNpZ25lZFR4XV1cbiAgICogQHBhcmFtIGtjIEFuIFtbS2V5Q2hhaW5dXSB1c2VkIGluIHNpZ25pbmdcbiAgICpcbiAgICogQHJldHVybnMgQW4gYXJyYXkgb2YgW1tDcmVkZW50aWFsXV1zXG4gICAqL1xuICBhYnN0cmFjdCBzaWduKG1zZzogQnVmZmVyLCBrYzogU2lnbmVyS2V5Q2hhaW4pOiBDcmVkZW50aWFsW11cblxuICBhYnN0cmFjdCBjbG9uZSgpOiB0aGlzXG5cbiAgYWJzdHJhY3QgY3JlYXRlKC4uLmFyZ3M6IGFueVtdKTogdGhpc1xuXG4gIGFic3RyYWN0IHNlbGVjdChpZDogbnVtYmVyLCAuLi5hcmdzOiBhbnlbXSk6IHRoaXNcblxuICAvKipcbiAgICogQ2xhc3MgcmVwcmVzZW50aW5nIGEgU3RhbmRhcmRCYXNlVHggd2hpY2ggaXMgdGhlIGZvdW5kYXRpb24gZm9yIGFsbCB0cmFuc2FjdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSBuZXR3b3JrSUQgT3B0aW9uYWwgbmV0d29ya0lELCBbW0RlZmF1bHROZXR3b3JrSURdXVxuICAgKiBAcGFyYW0gYmxvY2tjaGFpbklEIE9wdGlvbmFsIGJsb2NrY2hhaW5JRCwgZGVmYXVsdCBCdWZmZXIuYWxsb2MoMzIsIDE2KVxuICAgKiBAcGFyYW0gb3V0cyBPcHRpb25hbCBhcnJheSBvZiB0aGUgW1tUcmFuc2ZlcmFibGVPdXRwdXRdXXNcbiAgICogQHBhcmFtIGlucyBPcHRpb25hbCBhcnJheSBvZiB0aGUgW1tUcmFuc2ZlcmFibGVJbnB1dF1dc1xuICAgKiBAcGFyYW0gbWVtbyBPcHRpb25hbCB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBmb3IgdGhlIG1lbW8gZmllbGRcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIG5ldHdvcmtJRDogbnVtYmVyID0gRGVmYXVsdE5ldHdvcmtJRCxcbiAgICBibG9ja2NoYWluSUQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygzMiwgMTYpLFxuICAgIG91dHM6IFN0YW5kYXJkVHJhbnNmZXJhYmxlT3V0cHV0W10gPSB1bmRlZmluZWQsXG4gICAgaW5zOiBTdGFuZGFyZFRyYW5zZmVyYWJsZUlucHV0W10gPSB1bmRlZmluZWQsXG4gICAgbWVtbzogQnVmZmVyID0gdW5kZWZpbmVkXG4gICkge1xuICAgIHN1cGVyKClcbiAgICB0aGlzLm5ldHdvcmtJRC53cml0ZVVJbnQzMkJFKG5ldHdvcmtJRCwgMClcbiAgICB0aGlzLmJsb2NrY2hhaW5JRCA9IGJsb2NrY2hhaW5JRFxuICAgIGlmICh0eXBlb2YgbWVtbyAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aGlzLm1lbW8gPSBtZW1vXG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBpbnMgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIG91dHMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMubnVtb3V0cy53cml0ZVVJbnQzMkJFKG91dHMubGVuZ3RoLCAwKVxuICAgICAgdGhpcy5vdXRzID0gb3V0cy5zb3J0KFN0YW5kYXJkVHJhbnNmZXJhYmxlT3V0cHV0LmNvbXBhcmF0b3IoKSlcbiAgICAgIHRoaXMubnVtaW5zLndyaXRlVUludDMyQkUoaW5zLmxlbmd0aCwgMClcbiAgICAgIHRoaXMuaW5zID0gaW5zLnNvcnQoU3RhbmRhcmRUcmFuc2ZlcmFibGVJbnB1dC5jb21wYXJhdG9yKCkpXG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogQ2xhc3MgcmVwcmVzZW50aW5nIGFuIHVuc2lnbmVkIHRyYW5zYWN0aW9uLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU3RhbmRhcmRVbnNpZ25lZFR4PFxuICBLUENsYXNzIGV4dGVuZHMgU2lnbmVyS2V5UGFpcixcbiAgS0NDbGFzcyBleHRlbmRzIFNpZ25lcktleUNoYWluLFxuICBTQlR4IGV4dGVuZHMgU3RhbmRhcmRCYXNlVHg8S1BDbGFzcywgS0NDbGFzcz5cbj4gZXh0ZW5kcyBTZXJpYWxpemFibGUge1xuICBwcm90ZWN0ZWQgX3R5cGVOYW1lID0gXCJTdGFuZGFyZFVuc2lnbmVkVHhcIlxuICBwcm90ZWN0ZWQgX3R5cGVJRCA9IHVuZGVmaW5lZFxuXG4gIHNlcmlhbGl6ZShlbmNvZGluZzogU2VyaWFsaXplZEVuY29kaW5nID0gXCJoZXhcIik6IG9iamVjdCB7XG4gICAgbGV0IGZpZWxkczogb2JqZWN0ID0gc3VwZXIuc2VyaWFsaXplKGVuY29kaW5nKVxuICAgIHJldHVybiB7XG4gICAgICAuLi5maWVsZHMsXG4gICAgICBjb2RlY0lEOiBzZXJpYWxpemF0aW9uLmVuY29kZXIoXG4gICAgICAgIHRoaXMuY29kZWNJRCxcbiAgICAgICAgZW5jb2RpbmcsXG4gICAgICAgIFwibnVtYmVyXCIsXG4gICAgICAgIFwiZGVjaW1hbFN0cmluZ1wiLFxuICAgICAgICAyXG4gICAgICApLFxuICAgICAgdHJhbnNhY3Rpb246IHRoaXMudHJhbnNhY3Rpb24uc2VyaWFsaXplKGVuY29kaW5nKVxuICAgIH1cbiAgfVxuXG4gIGRlc2VyaWFsaXplKGZpZWxkczogb2JqZWN0LCBlbmNvZGluZzogU2VyaWFsaXplZEVuY29kaW5nID0gXCJoZXhcIikge1xuICAgIHN1cGVyLmRlc2VyaWFsaXplKGZpZWxkcywgZW5jb2RpbmcpXG4gICAgdGhpcy5jb2RlY0lEID0gc2VyaWFsaXphdGlvbi5kZWNvZGVyKFxuICAgICAgZmllbGRzW1wiY29kZWNJRFwiXSxcbiAgICAgIGVuY29kaW5nLFxuICAgICAgXCJkZWNpbWFsU3RyaW5nXCIsXG4gICAgICBcIm51bWJlclwiXG4gICAgKVxuICB9XG5cbiAgcHJvdGVjdGVkIGNvZGVjSUQ6IG51bWJlciA9IDBcbiAgcHJvdGVjdGVkIHRyYW5zYWN0aW9uOiBTQlR4XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIENvZGVjSUQgYXMgYSBudW1iZXJcbiAgICovXG4gIGdldENvZGVjSUQoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5jb2RlY0lEXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gcmVwcmVzZW50YXRpb24gb2YgdGhlIENvZGVjSURcbiAgICovXG4gIGdldENvZGVjSURCdWZmZXIoKTogQnVmZmVyIHtcbiAgICBsZXQgY29kZWNCdWY6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygyKVxuICAgIGNvZGVjQnVmLndyaXRlVUludDE2QkUodGhpcy5jb2RlY0lELCAwKVxuICAgIHJldHVybiBjb2RlY0J1ZlxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGlucHV0VG90YWwgYXMgYSBCTlxuICAgKi9cbiAgZ2V0SW5wdXRUb3RhbChhc3NldElEOiBCdWZmZXIpOiBCTiB7XG4gICAgY29uc3QgaW5zOiBTdGFuZGFyZFRyYW5zZmVyYWJsZUlucHV0W10gPSB0aGlzLmdldFRyYW5zYWN0aW9uKCkuZ2V0SW5zKClcbiAgICBjb25zdCBhSURIZXg6IHN0cmluZyA9IGFzc2V0SUQudG9TdHJpbmcoXCJoZXhcIilcbiAgICBsZXQgdG90YWw6IEJOID0gbmV3IEJOKDApXG5cbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgaW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBvbmx5IGNoZWNrIFN0YW5kYXJkQW1vdW50SW5wdXRzXG4gICAgICBpZiAoXG4gICAgICAgIGluc1tgJHtpfWBdLmdldElucHV0KCkgaW5zdGFuY2VvZiBTdGFuZGFyZEFtb3VudElucHV0ICYmXG4gICAgICAgIGFJREhleCA9PT0gaW5zW2Ake2l9YF0uZ2V0QXNzZXRJRCgpLnRvU3RyaW5nKFwiaGV4XCIpXG4gICAgICApIHtcbiAgICAgICAgY29uc3QgaW5wdXQ6IFN0YW5kYXJkQW1vdW50SW5wdXQgPSBpbnNbXG4gICAgICAgICAgYCR7aX1gXG4gICAgICAgIF0uZ2V0SW5wdXQoKSBhcyBTdGFuZGFyZEFtb3VudElucHV0XG4gICAgICAgIHRvdGFsID0gdG90YWwuYWRkKGlucHV0LmdldEFtb3VudCgpKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG90YWxcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBvdXRwdXRUb3RhbCBhcyBhIEJOXG4gICAqL1xuICBnZXRPdXRwdXRUb3RhbChhc3NldElEOiBCdWZmZXIpOiBCTiB7XG4gICAgY29uc3Qgb3V0czogU3RhbmRhcmRUcmFuc2ZlcmFibGVPdXRwdXRbXSA9XG4gICAgICB0aGlzLmdldFRyYW5zYWN0aW9uKCkuZ2V0VG90YWxPdXRzKClcbiAgICBjb25zdCBhSURIZXg6IHN0cmluZyA9IGFzc2V0SUQudG9TdHJpbmcoXCJoZXhcIilcbiAgICBsZXQgdG90YWw6IEJOID0gbmV3IEJOKDApXG5cbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgb3V0cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgaW5uZXIgPSBvdXRzW2Ake2l9YF0uZ2V0T3V0cHV0KClcbiAgICAgIGNvbnN0IGlubmVyT3V0ID1cbiAgICAgICAgaW5uZXIgaW5zdGFuY2VvZiBTdGFuZGFyZFBhcnNlYWJsZU91dHB1dCA/IGlubmVyLmdldE91dHB1dCgpIDogaW5uZXJcbiAgICAgIC8vIG9ubHkgY2hlY2sgU3RhbmRhcmRBbW91bnRPdXRwdXRcbiAgICAgIGlmIChcbiAgICAgICAgaW5uZXJPdXQgaW5zdGFuY2VvZiBTdGFuZGFyZEFtb3VudE91dHB1dCAmJlxuICAgICAgICBhSURIZXggPT09IG91dHNbYCR7aX1gXS5nZXRBc3NldElEKCkudG9TdHJpbmcoXCJoZXhcIilcbiAgICAgICkge1xuICAgICAgICB0b3RhbCA9IHRvdGFsLmFkZChpbm5lck91dC5nZXRBbW91bnQoKSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRvdGFsXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGJ1cm5lZCB0b2tlbnMgYXMgYSBCTlxuICAgKi9cbiAgZ2V0QnVybihhc3NldElEOiBCdWZmZXIpOiBCTiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0SW5wdXRUb3RhbChhc3NldElEKS5zdWIodGhpcy5nZXRPdXRwdXRUb3RhbChhc3NldElEKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBUcmFuc2FjdGlvblxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0VHJhbnNhY3Rpb24oKTogU0JUeFxuXG4gIGFic3RyYWN0IGZyb21CdWZmZXIoYnl0ZXM6IEJ1ZmZlciwgb2Zmc2V0PzogbnVtYmVyKTogbnVtYmVyXG5cbiAgdG9CdWZmZXIoKTogQnVmZmVyIHtcbiAgICBjb25zdCBjb2RlY0J1ZjogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDIpXG4gICAgY29kZWNCdWYud3JpdGVVSW50MTZCRSh0aGlzLnRyYW5zYWN0aW9uLmdldENvZGVjSUQoKSwgMClcbiAgICBjb25zdCB0eHR5cGU6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg0KVxuICAgIHR4dHlwZS53cml0ZVVJbnQzMkJFKHRoaXMudHJhbnNhY3Rpb24uZ2V0VHhUeXBlKCksIDApXG4gICAgY29uc3QgYmFzZWJ1ZmYgPSB0aGlzLnRyYW5zYWN0aW9uLnRvQnVmZmVyKClcbiAgICByZXR1cm4gQnVmZmVyLmNvbmNhdChcbiAgICAgIFtjb2RlY0J1ZiwgdHh0eXBlLCBiYXNlYnVmZl0sXG4gICAgICBjb2RlY0J1Zi5sZW5ndGggKyB0eHR5cGUubGVuZ3RoICsgYmFzZWJ1ZmYubGVuZ3RoXG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIFNpZ25zIHRoaXMgW1tVbnNpZ25lZFR4XV0gYW5kIHJldHVybnMgc2lnbmVkIFtbU3RhbmRhcmRUeF1dXG4gICAqXG4gICAqIEBwYXJhbSBrYyBBbiBbW0tleUNoYWluXV0gdXNlZCBpbiBzaWduaW5nXG4gICAqXG4gICAqIEByZXR1cm5zIEEgc2lnbmVkIFtbU3RhbmRhcmRUeF1dXG4gICAqL1xuICBhYnN0cmFjdCBzaWduKFxuICAgIGtjOiBLQ0NsYXNzXG4gICk6IFN0YW5kYXJkVHg8S1BDbGFzcywgS0NDbGFzcywgU3RhbmRhcmRVbnNpZ25lZFR4PEtQQ2xhc3MsIEtDQ2xhc3MsIFNCVHg+PlxuXG4gIGNvbnN0cnVjdG9yKHRyYW5zYWN0aW9uOiBTQlR4ID0gdW5kZWZpbmVkLCBjb2RlY0lEOiBudW1iZXIgPSAwKSB7XG4gICAgc3VwZXIoKVxuICAgIHRoaXMuY29kZWNJRCA9IGNvZGVjSURcbiAgICB0aGlzLnRyYW5zYWN0aW9uID0gdHJhbnNhY3Rpb25cbiAgfVxufVxuXG4vKipcbiAqIENsYXNzIHJlcHJlc2VudGluZyBhIHNpZ25lZCB0cmFuc2FjdGlvbi5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFN0YW5kYXJkVHg8XG4gIEtQQ2xhc3MgZXh0ZW5kcyBTaWduZXJLZXlQYWlyLFxuICBLQ0NsYXNzIGV4dGVuZHMgU2lnbmVyS2V5Q2hhaW4sXG4gIFNVQlR4IGV4dGVuZHMgU3RhbmRhcmRVbnNpZ25lZFR4PFxuICAgIEtQQ2xhc3MsXG4gICAgS0NDbGFzcyxcbiAgICBTdGFuZGFyZEJhc2VUeDxLUENsYXNzLCBLQ0NsYXNzPlxuICA+XG4+IGV4dGVuZHMgU2VyaWFsaXphYmxlIHtcbiAgcHJvdGVjdGVkIF90eXBlTmFtZSA9IFwiU3RhbmRhcmRUeFwiXG4gIHByb3RlY3RlZCBfdHlwZUlEID0gdW5kZWZpbmVkXG5cbiAgc2VyaWFsaXplKGVuY29kaW5nOiBTZXJpYWxpemVkRW5jb2RpbmcgPSBcImhleFwiKTogb2JqZWN0IHtcbiAgICBsZXQgZmllbGRzOiBvYmplY3QgPSBzdXBlci5zZXJpYWxpemUoZW5jb2RpbmcpXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmZpZWxkcyxcbiAgICAgIHVuc2lnbmVkVHg6IHRoaXMudW5zaWduZWRUeC5zZXJpYWxpemUoZW5jb2RpbmcpLFxuICAgICAgY3JlZGVudGlhbHM6IHRoaXMuY3JlZGVudGlhbHMubWFwKChjKSA9PiBjLnNlcmlhbGl6ZShlbmNvZGluZykpXG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIHVuc2lnbmVkVHg6IFNVQlR4ID0gdW5kZWZpbmVkXG4gIHByb3RlY3RlZCBjcmVkZW50aWFsczogQ3JlZGVudGlhbFtdID0gW11cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgW1tDcmVkZW50aWFsW11dXVxuICAgKi9cbiAgZ2V0Q3JlZGVudGlhbHMoKTogQ3JlZGVudGlhbFtdIHtcbiAgICByZXR1cm4gdGhpcy5jcmVkZW50aWFsc1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIFtbU3RhbmRhcmRVbnNpZ25lZFR4XV1cbiAgICovXG4gIGdldFVuc2lnbmVkVHgoKTogU1VCVHgge1xuICAgIHJldHVybiB0aGlzLnVuc2lnbmVkVHhcbiAgfVxuXG4gIGFic3RyYWN0IGZyb21CdWZmZXIoYnl0ZXM6IEJ1ZmZlciwgb2Zmc2V0PzogbnVtYmVyKTogbnVtYmVyXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSByZXByZXNlbnRhdGlvbiBvZiB0aGUgW1tTdGFuZGFyZFR4XV0uXG4gICAqL1xuICB0b0J1ZmZlcigpOiBCdWZmZXIge1xuICAgIGNvbnN0IHR4OiBTdGFuZGFyZEJhc2VUeDxLUENsYXNzLCBLQ0NsYXNzPiA9XG4gICAgICB0aGlzLnVuc2lnbmVkVHguZ2V0VHJhbnNhY3Rpb24oKVxuICAgIGNvbnN0IGNvZGVjSUQ6IG51bWJlciA9IHR4LmdldENvZGVjSUQoKVxuICAgIGNvbnN0IHR4YnVmZjogQnVmZmVyID0gdGhpcy51bnNpZ25lZFR4LnRvQnVmZmVyKClcbiAgICBsZXQgYnNpemU6IG51bWJlciA9IHR4YnVmZi5sZW5ndGhcbiAgICBjb25zdCBjcmVkbGVuOiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcbiAgICBjcmVkbGVuLndyaXRlVUludDMyQkUodGhpcy5jcmVkZW50aWFscy5sZW5ndGgsIDApXG4gICAgY29uc3QgYmFycjogQnVmZmVyW10gPSBbdHhidWZmLCBjcmVkbGVuXVxuICAgIGJzaXplICs9IGNyZWRsZW4ubGVuZ3RoXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMuY3JlZGVudGlhbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuY3JlZGVudGlhbHNbYCR7aX1gXS5zZXRDb2RlY0lEKGNvZGVjSUQpXG4gICAgICBjb25zdCBjcmVkSUQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg0KVxuICAgICAgY3JlZElELndyaXRlVUludDMyQkUodGhpcy5jcmVkZW50aWFsc1tgJHtpfWBdLmdldENyZWRlbnRpYWxJRCgpLCAwKVxuICAgICAgYmFyci5wdXNoKGNyZWRJRClcbiAgICAgIGJzaXplICs9IGNyZWRJRC5sZW5ndGhcbiAgICAgIGNvbnN0IGNyZWRidWZmOiBCdWZmZXIgPSB0aGlzLmNyZWRlbnRpYWxzW2Ake2l9YF0udG9CdWZmZXIoKVxuICAgICAgYnNpemUgKz0gY3JlZGJ1ZmYubGVuZ3RoXG4gICAgICBiYXJyLnB1c2goY3JlZGJ1ZmYpXG4gICAgfVxuICAgIGNvbnN0IGJ1ZmY6IEJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoYmFyciwgYnNpemUpXG4gICAgcmV0dXJuIGJ1ZmZcbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyBhIGJhc2UtNTggc3RyaW5nIGNvbnRhaW5pbmcgYW4gW1tTdGFuZGFyZFR4XV0sIHBhcnNlcyBpdCwgcG9wdWxhdGVzIHRoZSBjbGFzcywgYW5kIHJldHVybnMgdGhlIGxlbmd0aCBvZiB0aGUgVHggaW4gYnl0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBzZXJpYWxpemVkIEEgYmFzZS01OCBzdHJpbmcgY29udGFpbmluZyBhIHJhdyBbW1N0YW5kYXJkVHhdXVxuICAgKlxuICAgKiBAcmV0dXJucyBUaGUgbGVuZ3RoIG9mIHRoZSByYXcgW1tTdGFuZGFyZFR4XV1cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICogdW5saWtlIG1vc3QgZnJvbVN0cmluZ3MsIGl0IGV4cGVjdHMgdGhlIHN0cmluZyB0byBiZSBzZXJpYWxpemVkIGluIGNiNTggZm9ybWF0XG4gICAqL1xuICBmcm9tU3RyaW5nKHNlcmlhbGl6ZWQ6IHN0cmluZyk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbUJ1ZmZlcihiaW50b29scy5jYjU4RGVjb2RlKHNlcmlhbGl6ZWQpKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBjYjU4IHJlcHJlc2VudGF0aW9uIG9mIHRoZSBbW1N0YW5kYXJkVHhdXS5cbiAgICpcbiAgICogQHJlbWFya3NcbiAgICogdW5saWtlIG1vc3QgdG9TdHJpbmdzLCB0aGlzIHJldHVybnMgaW4gY2I1OCBzZXJpYWxpemF0aW9uIGZvcm1hdFxuICAgKi9cbiAgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYmludG9vbHMuY2I1OEVuY29kZSh0aGlzLnRvQnVmZmVyKCkpXG4gIH1cblxuICB0b1N0cmluZ0hleCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBgMHgke2JpbnRvb2xzLmFkZENoZWNrc3VtKHRoaXMudG9CdWZmZXIoKSkudG9TdHJpbmcoXCJoZXhcIil9YFxuICB9XG5cbiAgLyoqXG4gICAqIENsYXNzIHJlcHJlc2VudGluZyBhIHNpZ25lZCB0cmFuc2FjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHVuc2lnbmVkVHggT3B0aW9uYWwgW1tTdGFuZGFyZFVuc2lnbmVkVHhdXVxuICAgKiBAcGFyYW0gc2lnbmF0dXJlcyBPcHRpb25hbCBhcnJheSBvZiBbW0NyZWRlbnRpYWxdXXNcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIHVuc2lnbmVkVHg6IFNVQlR4ID0gdW5kZWZpbmVkLFxuICAgIGNyZWRlbnRpYWxzOiBDcmVkZW50aWFsW10gPSB1bmRlZmluZWRcbiAgKSB7XG4gICAgc3VwZXIoKVxuICAgIGlmICh0eXBlb2YgdW5zaWduZWRUeCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy51bnNpZ25lZFR4ID0gdW5zaWduZWRUeFxuICAgICAgaWYgKHR5cGVvZiBjcmVkZW50aWFscyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICB0aGlzLmNyZWRlbnRpYWxzID0gY3JlZGVudGlhbHNcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==