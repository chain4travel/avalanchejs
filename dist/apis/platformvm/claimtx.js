"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimTx = exports.ClaimType = void 0;
/**
 * @packageDocumentation
 * @module API-PlatformVM-ClaimTx
 */
const buffer_1 = require("buffer/");
const bintools_1 = __importDefault(require("../../utils/bintools"));
const constants_1 = require("./constants");
const outputs_1 = require("./outputs");
const basetx_1 = require("./basetx");
const constants_2 = require("../../utils/constants");
const serialization_1 = require("../../utils/serialization");
const bn_js_1 = __importDefault(require("bn.js"));
const common_1 = require("../../common");
const credentials_1 = require("./credentials");
/**
 * @ignore
 */
const bintools = bintools_1.default.getInstance();
const serialization = serialization_1.Serialization.getInstance();
exports.ClaimType = {
    VALIDATOR_REWARD: new bn_js_1.default("1"),
    EXPIRED_DEPOSIT_REWARD: new bn_js_1.default("2"),
    ALL: new bn_js_1.default("3")
};
/**
 * Class representing an unsigned ClaimTx transaction.
 */
class ClaimTx extends basetx_1.BaseTx {
    /**
     * Class representing an unsigned RegisterNode transaction.
     *
     * @param networkID Optional networkID, [[DefaultNetworkID]]
     * @param blockchainID Optional blockchainID, default Buffer.alloc(32, 16)
     * @param outs Optional array of the [[TransferableOutput]]s
     * @param ins Optional array of the [[TransferableInput]]s
     * @param depositTxIDs Optional array of the deposit tx ids
     * @param claimableOwnerIDs Optional array of the claimable owner ids
     * @param claimedAmounts Optional array of the claimed amounts
     * @param claimType Optional the type of the claim
     * @param claimTo Optional the owner of the rewards
     */
    constructor(networkID = constants_2.DefaultNetworkID, blockchainID = buffer_1.Buffer.alloc(32, 16), outs = undefined, ins = undefined, memo = undefined, depositTxIDs = undefined, claimableOwnerIDs = undefined, claimedAmounts = undefined, claimType = undefined, claimTo = undefined) {
        super(networkID, blockchainID, outs, ins, memo);
        this._typeName = "ClaimTx";
        this._typeID = constants_1.PlatformVMConstants.CLAIMTX;
        this.numDepositTxs = buffer_1.Buffer.alloc(4);
        this.depositTxs = [];
        this.numClaimableOwnerIDs = buffer_1.Buffer.alloc(4);
        this.claimableOwnerIDs = [];
        this.numClaimedAmounts = buffer_1.Buffer.alloc(4);
        this.claimedAmounts = [];
        this.claimType = buffer_1.Buffer.alloc(8);
        // Deposit rewards outputs will be minted to this owner, unless all of its fields has zero-values.
        // If it is empty, deposit rewards will be minted for depositTx.RewardsOwner.
        this.claimTo = undefined;
        this.sigCount = buffer_1.Buffer.alloc(4);
        this.sigIdxs = []; // idxs of claimableIn signers
        if (typeof depositTxIDs != "undefined") {
            this.numDepositTxs.writeUInt32BE(depositTxIDs.length, 0);
            const depositTxBufs = [];
            depositTxIDs.forEach((txID) => {
                if (typeof txID === "string") {
                    depositTxBufs.push(bintools.cb58Decode(txID));
                }
                else {
                    depositTxBufs.push(txID);
                }
            });
            this.depositTxs = depositTxBufs;
        }
        if (typeof claimableOwnerIDs != "undefined") {
            this.numClaimableOwnerIDs.writeUInt32BE(claimableOwnerIDs.length, 0);
            const claimableOwnerIDBufs = [];
            claimableOwnerIDs.forEach((ownerID) => {
                if (typeof ownerID === "string") {
                    claimableOwnerIDBufs.push(bintools.cb58Decode(ownerID));
                }
                else {
                    claimableOwnerIDBufs.push(ownerID);
                }
            });
            this.claimableOwnerIDs = claimableOwnerIDBufs;
        }
        if (typeof claimedAmounts != "undefined") {
            this.numClaimedAmounts.writeUInt32BE(claimedAmounts.length, 0);
            const claimedAmountBufs = [];
            claimedAmounts.forEach((amount) => {
                claimedAmountBufs.push(bintools.fromBNToBuffer(amount, 8));
            });
            this.claimedAmounts = claimedAmountBufs;
        }
        this.claimType = bintools.fromBNToBuffer(claimType, 8);
        this.claimTo = claimTo;
    }
    deserialize(fields, encoding = "hex") {
        super.deserialize(fields, encoding);
        this.depositTxs = fields["depositTxs"].map((txID) => serialization.decoder(txID, encoding, "cb58", "Buffer"));
        this.claimableOwnerIDs = fields["claimableOwnerIDs"].map((ownerID) => serialization.decoder(ownerID, encoding, "cb58", "Buffer"));
        this.claimedAmounts = fields["claimedAmounts"].map((amount) => serialization.decoder(amount, encoding, "decimalString", "Buffer"));
        this.claimType = serialization.decoder(fields["claimType"], encoding, "decimalString", "Buffer", 8);
        this.claimTo.deserialize(fields["claimTo"], encoding);
        // initialize other num fields
        this.numDepositTxs.writeUInt32BE(this.numDepositTxs.length, 0);
        this.numClaimableOwnerIDs.writeUInt32BE(this.numClaimableOwnerIDs.length, 0);
        this.numClaimedAmounts.writeUInt32BE(this.numClaimedAmounts.length, 0);
    }
    serialize(encoding = "hex") {
        let fields = super.serialize(encoding);
        return Object.assign(Object.assign({}, fields), { depositTxs: this.depositTxs.map((txID) => serialization.encoder(txID, encoding, "Buffer", "cb58")), claimableOwnerIDs: this.claimableOwnerIDs.map((ownerID) => serialization.encoder(ownerID, encoding, "Buffer", "cb58")), claimedAmounts: this.claimedAmounts.map((amount) => serialization.encoder(amount, encoding, "Buffer", "decimalString")), claimType: serialization.encoder(this.claimType, encoding, "Buffer", "decimalString"), claimTo: this.claimTo.serialize(encoding) });
    }
    /**
     * Returns the id of the [[RegisterNodeTx]]
     */
    getTxType() {
        return this._typeID;
    }
    /**
     * Returns the array of claimed owner ids
     */
    getClaimableOwnerIDs() {
        return this.claimableOwnerIDs;
    }
    /**
     * Returns the array of claimed amounts
     */
    getClaimedAmounts() {
        return this.claimedAmounts;
    }
    /**
     * Returns the array of deposit tx ids
     */
    getDepositTxs() {
        return this.depositTxs;
    }
    /**
     * Returns the claimTo
     */
    getClaimTo() {
        return this.claimTo;
    }
    getClaimType() {
        return this.claimType;
    }
    /**
     * Takes a {@link https://github.com/feross/buffer|Buffer} containing a [[ClaimTx]], parses it, populates the class, and returns the length of the [[ClaimTx]] in bytes.
     *
     * @param bytes A {@link https://github.com/feross/buffer|Buffer} containing a raw [[ClaimTx]]
     *
     * @returns The length of the raw [[ClaimTx]]
     *
     * @remarks assume not-checksummed
     */
    fromBuffer(bytes, offset = 0) {
        offset = super.fromBuffer(bytes, offset);
        this.numDepositTxs = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        const txCount = this.numDepositTxs.readUInt32BE(0);
        this.depositTxs = [];
        for (let i = 0; i < txCount; i++) {
            const txid = bintools.copyFrom(bytes, offset, offset + 32);
            offset += 32;
            this.depositTxs.push(txid);
        }
        this.numClaimableOwnerIDs = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        const ownerCount = this.numClaimableOwnerIDs.readUInt32BE(0);
        this.claimableOwnerIDs = [];
        for (let i = 0; i < ownerCount; i++) {
            const ownerid = bintools.copyFrom(bytes, offset, offset + 32);
            offset += 32;
            this.claimableOwnerIDs.push(ownerid);
        }
        this.numClaimedAmounts = bintools.copyFrom(bytes, offset, offset + 4);
        offset += 4;
        const amountCount = this.numClaimedAmounts.readUInt32BE(0);
        this.claimedAmounts = [];
        for (let i = 0; i < amountCount; i++) {
            const amount = bintools.copyFrom(bytes, offset, offset + 8);
            offset += 8;
            this.claimedAmounts.push(amount);
        }
        this.claimType = bintools.copyFrom(bytes, offset, offset + 8);
        offset += 8;
        this.claimTo = new outputs_1.ParseableOutput();
        offset = this.claimTo.fromBuffer(bytes, offset);
        return offset;
    }
    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} representation of the [[ClaimTx]].
     */
    toBuffer() {
        const superbuff = super.toBuffer();
        let bsize = superbuff.length;
        const barr = [superbuff];
        barr.push(this.numDepositTxs);
        bsize += this.numDepositTxs.length;
        this.depositTxs.forEach((depositTx) => {
            bsize += depositTx.length;
            barr.push(depositTx);
        });
        barr.push(this.numClaimableOwnerIDs);
        bsize += this.numClaimableOwnerIDs.length;
        this.claimableOwnerIDs.forEach((claimableOwnerID) => {
            barr.push(claimableOwnerID);
            bsize += claimableOwnerID.length;
        });
        barr.push(this.numClaimedAmounts);
        bsize += this.numClaimedAmounts.length;
        this.claimedAmounts.forEach((claimedAmount) => {
            barr.push(claimedAmount);
            bsize += claimedAmount.length;
        });
        barr.push(this.claimType);
        bsize += this.claimType.length;
        barr.push(this.claimTo.toBuffer());
        bsize += this.claimTo.toBuffer().length;
        return buffer_1.Buffer.concat(barr, bsize);
    }
    clone() {
        const newClaimTx = new ClaimTx();
        newClaimTx.fromBuffer(this.toBuffer());
        return newClaimTx;
    }
    create(...args) {
        return new ClaimTx(...args);
    }
    /**
     * Creates and adds a [[SigIdx]] to the [[ClaimTx]].
     *
     * @param addressIdx The index of the address to reference in the signatures
     * @param address The address of the source of the signature
     */
    addSignatureIdx(addressIdx, address) {
        const sigidx = new common_1.SigIdx();
        const b = buffer_1.Buffer.alloc(4);
        b.writeUInt32BE(addressIdx, 0);
        sigidx.fromBuffer(b);
        sigidx.setSource(address);
        this.sigIdxs.push(sigidx);
        this.sigCount.writeUInt32BE(this.sigIdxs.length, 0);
    }
    /**
     * Returns the array of [[SigIdx]] for this [[TX]]
     */
    getSigIdxs() {
        return this.sigIdxs;
    }
    /**
     * Set the array of [[SigIdx]] for this [[TX]]
     */
    setSigIdxs(sigIdxs) {
        this.sigIdxs = sigIdxs;
        this.sigCount.writeUInt32BE(this.sigIdxs.length, 0);
    }
    /**
     * Takes the bytes of an [[UnsignedTx]] and returns an array of [[Credential]]s
     *
     * @param msg A Buffer for the [[UnsignedTx]]
     * @param kc An [[KeyChain]] used in signing
     *
     * @returns An array of [[Credential]]s
     */
    sign(msg, kc) {
        const creds = super.sign(msg, kc);
        const sigidxs = this.getSigIdxs();
        const cred = (0, credentials_1.SelectCredentialClass)(constants_1.PlatformVMConstants.SECPCREDENTIAL);
        for (let i = 0; i < sigidxs.length; i++) {
            const keypair = kc.getKey(sigidxs[`${i}`].getSource());
            const signval = keypair.sign(msg);
            const sig = new common_1.Signature();
            sig.fromBuffer(signval);
            cred.addSignature(sig);
        }
        creds.push(cred);
        return creds;
    }
}
exports.ClaimTx = ClaimTx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhaW10eC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcGlzL3BsYXRmb3Jtdm0vY2xhaW10eC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7O0dBR0c7QUFDSCxvQ0FBZ0M7QUFDaEMsb0VBQTJDO0FBQzNDLDJDQUFpRDtBQUNqRCx1Q0FBK0Q7QUFFL0QscUNBQWlDO0FBQ2pDLHFEQUF3RDtBQUN4RCw2REFBNkU7QUFDN0Usa0RBQXNCO0FBQ3RCLHlDQUE0RDtBQUU1RCwrQ0FBcUQ7QUFFckQ7O0dBRUc7QUFDSCxNQUFNLFFBQVEsR0FBYSxrQkFBUSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBQ2pELE1BQU0sYUFBYSxHQUFrQiw2QkFBYSxDQUFDLFdBQVcsRUFBRSxDQUFBO0FBRW5ELFFBQUEsU0FBUyxHQUFHO0lBQ3ZCLGdCQUFnQixFQUFFLElBQUksZUFBRSxDQUFDLEdBQUcsQ0FBQztJQUM3QixzQkFBc0IsRUFBRSxJQUFJLGVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDbkMsR0FBRyxFQUFFLElBQUksZUFBRSxDQUFDLEdBQUcsQ0FBQztDQUNSLENBQUE7QUFFVjs7R0FFRztBQUNILE1BQWEsT0FBUSxTQUFRLGVBQU07SUE4T2pDOzs7Ozs7Ozs7Ozs7T0FZRztJQUNILFlBQ0UsWUFBb0IsNEJBQWdCLEVBQ3BDLGVBQXVCLGVBQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUMzQyxPQUE2QixTQUFTLEVBQ3RDLE1BQTJCLFNBQVMsRUFDcEMsT0FBZSxTQUFTLEVBQ3hCLGVBQW9DLFNBQVMsRUFDN0Msb0JBQXlDLFNBQVMsRUFDbEQsaUJBQXVCLFNBQVMsRUFDaEMsWUFBZ0IsU0FBUyxFQUN6QixVQUEyQixTQUFTO1FBRXBDLEtBQUssQ0FBQyxTQUFTLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUE7UUF0UXZDLGNBQVMsR0FBRyxT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QUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ3pDLE1BQU0sR0FBRyxHQUFjLElBQUksa0JBQVMsRUFBRSxDQUFBO1lBQ3RDLEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDdkIsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQTtTQUN2QjtRQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDaEIsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDO0NBQ0Y7QUF4VUQsMEJBd1VDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqIEBtb2R1bGUgQVBJLVBsYXRmb3JtVk0tQ2xhaW1UeFxuICovXG5pbXBvcnQgeyBCdWZmZXIgfSBmcm9tIFwiYnVmZmVyL1wiXG5pbXBvcnQgQmluVG9vbHMgZnJvbSBcIi4uLy4uL3V0aWxzL2JpbnRvb2xzXCJcbmltcG9ydCB7IFBsYXRmb3JtVk1Db25zdGFudHMgfSBmcm9tIFwiLi9jb25zdGFudHNcIlxuaW1wb3J0IHsgUGFyc2VhYmxlT3V0cHV0LCBUcmFuc2ZlcmFibGVPdXRwdXQgfSBmcm9tIFwiLi9vdXRwdXRzXCJcbmltcG9ydCB7IFRyYW5zZmVyYWJsZUlucHV0IH0gZnJvbSBcIi4vaW5wdXRzXCJcbmltcG9ydCB7IEJhc2VUeCB9IGZyb20gXCIuL2Jhc2V0eFwiXG5pbXBvcnQgeyBEZWZhdWx0TmV0d29ya0lEIH0gZnJvbSBcIi4uLy4uL3V0aWxzL2NvbnN0YW50c1wiXG5pbXBvcnQgeyBTZXJpYWxpemF0aW9uLCBTZXJpYWxpemVkRW5jb2RpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvc2VyaWFsaXphdGlvblwiXG5pbXBvcnQgQk4gZnJvbSBcImJuLmpzXCJcbmltcG9ydCB7IENyZWRlbnRpYWwsIFNpZ0lkeCwgU2lnbmF0dXJlIH0gZnJvbSBcIi4uLy4uL2NvbW1vblwiXG5pbXBvcnQgeyBLZXlDaGFpbiwgS2V5UGFpciB9IGZyb20gXCJjYW1pbm9qcy9hcGlzL3BsYXRmb3Jtdm0va2V5Y2hhaW5cIlxuaW1wb3J0IHsgU2VsZWN0Q3JlZGVudGlhbENsYXNzIH0gZnJvbSBcIi4vY3JlZGVudGlhbHNcIlxuXG4vKipcbiAqIEBpZ25vcmVcbiAqL1xuY29uc3QgYmludG9vbHM6IEJpblRvb2xzID0gQmluVG9vbHMuZ2V0SW5zdGFuY2UoKVxuY29uc3Qgc2VyaWFsaXphdGlvbjogU2VyaWFsaXphdGlvbiA9IFNlcmlhbGl6YXRpb24uZ2V0SW5zdGFuY2UoKVxuXG5leHBvcnQgY29uc3QgQ2xhaW1UeXBlID0ge1xuICBWQUxJREFUT1JfUkVXQVJEOiBuZXcgQk4oXCIxXCIpLFxuICBFWFBJUkVEX0RFUE9TSVRfUkVXQVJEOiBuZXcgQk4oXCIyXCIpLFxuICBBTEw6IG5ldyBCTihcIjNcIilcbn0gYXMgY29uc3RcblxuLyoqXG4gKiBDbGFzcyByZXByZXNlbnRpbmcgYW4gdW5zaWduZWQgQ2xhaW1UeCB0cmFuc2FjdGlvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIENsYWltVHggZXh0ZW5kcyBCYXNlVHgge1xuICBwcm90ZWN0ZWQgX3R5cGVOYW1lID0gXCJDbGFpbVR4XCJcbiAgcHJvdGVjdGVkIF90eXBlSUQgPSBQbGF0Zm9ybVZNQ29uc3RhbnRzLkNMQUlNVFhcblxuICBkZXNlcmlhbGl6ZShmaWVsZHM6IG9iamVjdCwgZW5jb2Rpbmc6IFNlcmlhbGl6ZWRFbmNvZGluZyA9IFwiaGV4XCIpIHtcbiAgICBzdXBlci5kZXNlcmlhbGl6ZShmaWVsZHMsIGVuY29kaW5nKVxuXG4gICAgdGhpcy5kZXBvc2l0VHhzID0gZmllbGRzW1wiZGVwb3NpdFR4c1wiXS5tYXAoKHR4SUQ6IHN0cmluZykgPT5cbiAgICAgIHNlcmlhbGl6YXRpb24uZGVjb2Rlcih0eElELCBlbmNvZGluZywgXCJjYjU4XCIsIFwiQnVmZmVyXCIpXG4gICAgKVxuICAgIHRoaXMuY2xhaW1hYmxlT3duZXJJRHMgPSBmaWVsZHNbXCJjbGFpbWFibGVPd25lcklEc1wiXS5tYXAoXG4gICAgICAob3duZXJJRDogc3RyaW5nKSA9PlxuICAgICAgICBzZXJpYWxpemF0aW9uLmRlY29kZXIob3duZXJJRCwgZW5jb2RpbmcsIFwiY2I1OFwiLCBcIkJ1ZmZlclwiKVxuICAgIClcbiAgICB0aGlzLmNsYWltZWRBbW91bnRzID0gZmllbGRzW1wiY2xhaW1lZEFtb3VudHNcIl0ubWFwKChhbW91bnQ6IHN0cmluZykgPT5cbiAgICAgIHNlcmlhbGl6YXRpb24uZGVjb2RlcihhbW91bnQsIGVuY29kaW5nLCBcImRlY2ltYWxTdHJpbmdcIiwgXCJCdWZmZXJcIilcbiAgICApXG5cbiAgICB0aGlzLmNsYWltVHlwZSA9IHNlcmlhbGl6YXRpb24uZGVjb2RlcihcbiAgICAgIGZpZWxkc1tcImNsYWltVHlwZVwiXSxcbiAgICAgIGVuY29kaW5nLFxuICAgICAgXCJkZWNpbWFsU3RyaW5nXCIsXG4gICAgICBcIkJ1ZmZlclwiLFxuICAgICAgOFxuICAgIClcbiAgICB0aGlzLmNsYWltVG8uZGVzZXJpYWxpemUoZmllbGRzW1wiY2xhaW1Ub1wiXSwgZW5jb2RpbmcpXG5cbiAgICAvLyBpbml0aWFsaXplIG90aGVyIG51bSBmaWVsZHNcbiAgICB0aGlzLm51bURlcG9zaXRUeHMud3JpdGVVSW50MzJCRSh0aGlzLm51bURlcG9zaXRUeHMubGVuZ3RoLCAwKVxuICAgIHRoaXMubnVtQ2xhaW1hYmxlT3duZXJJRHMud3JpdGVVSW50MzJCRSh0aGlzLm51bUNsYWltYWJsZU93bmVySURzLmxlbmd0aCwgMClcbiAgICB0aGlzLm51bUNsYWltZWRBbW91bnRzLndyaXRlVUludDMyQkUodGhpcy5udW1DbGFpbWVkQW1vdW50cy5sZW5ndGgsIDApXG4gIH1cblxuICBzZXJpYWxpemUoZW5jb2Rpbmc6IFNlcmlhbGl6ZWRFbmNvZGluZyA9IFwiaGV4XCIpOiBvYmplY3Qge1xuICAgIGxldCBmaWVsZHM6IG9iamVjdCA9IHN1cGVyLnNlcmlhbGl6ZShlbmNvZGluZylcbiAgICByZXR1cm4ge1xuICAgICAgLi4uZmllbGRzLFxuICAgICAgZGVwb3NpdFR4czogdGhpcy5kZXBvc2l0VHhzLm1hcCgodHhJRCkgPT5cbiAgICAgICAgc2VyaWFsaXphdGlvbi5lbmNvZGVyKHR4SUQsIGVuY29kaW5nLCBcIkJ1ZmZlclwiLCBcImNiNThcIilcbiAgICAgICksXG4gICAgICBjbGFpbWFibGVPd25lcklEczogdGhpcy5jbGFpbWFibGVPd25lcklEcy5tYXAoKG93bmVySUQpID0+XG4gICAgICAgIHNlcmlhbGl6YXRpb24uZW5jb2Rlcihvd25lcklELCBlbmNvZGluZywgXCJCdWZmZXJcIiwgXCJjYjU4XCIpXG4gICAgICApLFxuICAgICAgY2xhaW1lZEFtb3VudHM6IHRoaXMuY2xhaW1lZEFtb3VudHMubWFwKChhbW91bnQpID0+XG4gICAgICAgIHNlcmlhbGl6YXRpb24uZW5jb2RlcihhbW91bnQsIGVuY29kaW5nLCBcIkJ1ZmZlclwiLCBcImRlY2ltYWxTdHJpbmdcIilcbiAgICAgICksXG4gICAgICBjbGFpbVR5cGU6IHNlcmlhbGl6YXRpb24uZW5jb2RlcihcbiAgICAgICAgdGhpcy5jbGFpbVR5cGUsXG4gICAgICAgIGVuY29kaW5nLFxuICAgICAgICBcIkJ1ZmZlclwiLFxuICAgICAgICBcImRlY2ltYWxTdHJpbmdcIlxuICAgICAgKSxcbiAgICAgIGNsYWltVG86IHRoaXMuY2xhaW1Uby5zZXJpYWxpemUoZW5jb2RpbmcpXG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIG51bURlcG9zaXRUeHM6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg0KVxuICBwcm90ZWN0ZWQgZGVwb3NpdFR4czogQnVmZmVyW10gPSBbXVxuXG4gIHByb3RlY3RlZCBudW1DbGFpbWFibGVPd25lcklEczogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpXG4gIHByb3RlY3RlZCBjbGFpbWFibGVPd25lcklEczogQnVmZmVyW10gPSBbXVxuXG4gIHByb3RlY3RlZCBudW1DbGFpbWVkQW1vdW50czogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpXG4gIHByb3RlY3RlZCBjbGFpbWVkQW1vdW50czogQnVmZmVyW10gPSBbXVxuXG4gIHByb3RlY3RlZCBjbGFpbVR5cGU6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyg4KVxuXG4gIC8vIERlcG9zaXQgcmV3YXJkcyBvdXRwdXRzIHdpbGwgYmUgbWludGVkIHRvIHRoaXMgb3duZXIsIHVubGVzcyBhbGwgb2YgaXRzIGZpZWxkcyBoYXMgemVyby12YWx1ZXMuXG4gIC8vIElmIGl0IGlzIGVtcHR5LCBkZXBvc2l0IHJld2FyZHMgd2lsbCBiZSBtaW50ZWQgZm9yIGRlcG9zaXRUeC5SZXdhcmRzT3duZXIuXG4gIHByb3RlY3RlZCBjbGFpbVRvOiBQYXJzZWFibGVPdXRwdXQgPSB1bmRlZmluZWRcbiAgcHJvdGVjdGVkIHNpZ0NvdW50OiBCdWZmZXIgPSBCdWZmZXIuYWxsb2MoNClcbiAgcHJvdGVjdGVkIHNpZ0lkeHM6IFNpZ0lkeFtdID0gW10gLy8gaWR4cyBvZiBjbGFpbWFibGVJbiBzaWduZXJzXG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGlkIG9mIHRoZSBbW1JlZ2lzdGVyTm9kZVR4XV1cbiAgICovXG4gIGdldFR4VHlwZSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl90eXBlSURcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBhcnJheSBvZiBjbGFpbWVkIG93bmVyIGlkc1xuICAgKi9cbiAgZ2V0Q2xhaW1hYmxlT3duZXJJRHMoKTogQnVmZmVyW10ge1xuICAgIHJldHVybiB0aGlzLmNsYWltYWJsZU93bmVySURzXG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYXJyYXkgb2YgY2xhaW1lZCBhbW91bnRzXG4gICAqL1xuICBnZXRDbGFpbWVkQW1vdW50cygpOiBCdWZmZXJbXSB7XG4gICAgcmV0dXJuIHRoaXMuY2xhaW1lZEFtb3VudHNcbiAgfVxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYXJyYXkgb2YgZGVwb3NpdCB0eCBpZHNcbiAgICovXG4gIGdldERlcG9zaXRUeHMoKTogQnVmZmVyW10ge1xuICAgIHJldHVybiB0aGlzLmRlcG9zaXRUeHNcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjbGFpbVRvXG4gICAqL1xuICBnZXRDbGFpbVRvKCk6IFBhcnNlYWJsZU91dHB1dCB7XG4gICAgcmV0dXJuIHRoaXMuY2xhaW1Ub1xuICB9XG5cbiAgZ2V0Q2xhaW1UeXBlKCk6IEJ1ZmZlciB7XG4gICAgcmV0dXJuIHRoaXMuY2xhaW1UeXBlXG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgYSB7QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXJ8QnVmZmVyfSBjb250YWluaW5nIGEgW1tDbGFpbVR4XV0sIHBhcnNlcyBpdCwgcG9wdWxhdGVzIHRoZSBjbGFzcywgYW5kIHJldHVybnMgdGhlIGxlbmd0aCBvZiB0aGUgW1tDbGFpbVR4XV0gaW4gYnl0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBieXRlcyBBIHtAbGluayBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlcnxCdWZmZXJ9IGNvbnRhaW5pbmcgYSByYXcgW1tDbGFpbVR4XV1cbiAgICpcbiAgICogQHJldHVybnMgVGhlIGxlbmd0aCBvZiB0aGUgcmF3IFtbQ2xhaW1UeF1dXG4gICAqXG4gICAqIEByZW1hcmtzIGFzc3VtZSBub3QtY2hlY2tzdW1tZWRcbiAgICovXG4gIGZyb21CdWZmZXIoYnl0ZXM6IEJ1ZmZlciwgb2Zmc2V0OiBudW1iZXIgPSAwKTogbnVtYmVyIHtcbiAgICBvZmZzZXQgPSBzdXBlci5mcm9tQnVmZmVyKGJ5dGVzLCBvZmZzZXQpXG5cbiAgICB0aGlzLm51bURlcG9zaXRUeHMgPSBiaW50b29scy5jb3B5RnJvbShieXRlcywgb2Zmc2V0LCBvZmZzZXQgKyA0KVxuICAgIG9mZnNldCArPSA0XG4gICAgY29uc3QgdHhDb3VudDogbnVtYmVyID0gdGhpcy5udW1EZXBvc2l0VHhzLnJlYWRVSW50MzJCRSgwKVxuICAgIHRoaXMuZGVwb3NpdFR4cyA9IFtdXG4gICAgZm9yIChsZXQgaTogbnVtYmVyID0gMDsgaSA8IHR4Q291bnQ7IGkrKykge1xuICAgICAgY29uc3QgdHhpZDogQnVmZmVyID0gYmludG9vbHMuY29weUZyb20oYnl0ZXMsIG9mZnNldCwgb2Zmc2V0ICsgMzIpXG4gICAgICBvZmZzZXQgKz0gMzJcbiAgICAgIHRoaXMuZGVwb3NpdFR4cy5wdXNoKHR4aWQpXG4gICAgfVxuXG4gICAgdGhpcy5udW1DbGFpbWFibGVPd25lcklEcyA9IGJpbnRvb2xzLmNvcHlGcm9tKGJ5dGVzLCBvZmZzZXQsIG9mZnNldCArIDQpXG4gICAgb2Zmc2V0ICs9IDRcbiAgICBjb25zdCBvd25lckNvdW50OiBudW1iZXIgPSB0aGlzLm51bUNsYWltYWJsZU93bmVySURzLnJlYWRVSW50MzJCRSgwKVxuICAgIHRoaXMuY2xhaW1hYmxlT3duZXJJRHMgPSBbXVxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBvd25lckNvdW50OyBpKyspIHtcbiAgICAgIGNvbnN0IG93bmVyaWQ6IEJ1ZmZlciA9IGJpbnRvb2xzLmNvcHlGcm9tKGJ5dGVzLCBvZmZzZXQsIG9mZnNldCArIDMyKVxuICAgICAgb2Zmc2V0ICs9IDMyXG4gICAgICB0aGlzLmNsYWltYWJsZU93bmVySURzLnB1c2gob3duZXJpZClcbiAgICB9XG5cbiAgICB0aGlzLm51bUNsYWltZWRBbW91bnRzID0gYmludG9vbHMuY29weUZyb20oYnl0ZXMsIG9mZnNldCwgb2Zmc2V0ICsgNClcbiAgICBvZmZzZXQgKz0gNFxuICAgIGNvbnN0IGFtb3VudENvdW50OiBudW1iZXIgPSB0aGlzLm51bUNsYWltZWRBbW91bnRzLnJlYWRVSW50MzJCRSgwKVxuICAgIHRoaXMuY2xhaW1lZEFtb3VudHMgPSBbXVxuICAgIGZvciAobGV0IGk6IG51bWJlciA9IDA7IGkgPCBhbW91bnRDb3VudDsgaSsrKSB7XG4gICAgICBjb25zdCBhbW91bnQ6IEJ1ZmZlciA9IGJpbnRvb2xzLmNvcHlGcm9tKGJ5dGVzLCBvZmZzZXQsIG9mZnNldCArIDgpXG4gICAgICBvZmZzZXQgKz0gOFxuICAgICAgdGhpcy5jbGFpbWVkQW1vdW50cy5wdXNoKGFtb3VudClcbiAgICB9XG5cbiAgICB0aGlzLmNsYWltVHlwZSA9IGJpbnRvb2xzLmNvcHlGcm9tKGJ5dGVzLCBvZmZzZXQsIG9mZnNldCArIDgpXG4gICAgb2Zmc2V0ICs9IDhcbiAgICB0aGlzLmNsYWltVG8gPSBuZXcgUGFyc2VhYmxlT3V0cHV0KClcbiAgICBvZmZzZXQgPSB0aGlzLmNsYWltVG8uZnJvbUJ1ZmZlcihieXRlcywgb2Zmc2V0KVxuICAgIHJldHVybiBvZmZzZXRcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEge0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyfEJ1ZmZlcn0gcmVwcmVzZW50YXRpb24gb2YgdGhlIFtbQ2xhaW1UeF1dLlxuICAgKi9cbiAgdG9CdWZmZXIoKTogQnVmZmVyIHtcbiAgICBjb25zdCBzdXBlcmJ1ZmY6IEJ1ZmZlciA9IHN1cGVyLnRvQnVmZmVyKClcblxuICAgIGxldCBic2l6ZTogbnVtYmVyID0gc3VwZXJidWZmLmxlbmd0aFxuICAgIGNvbnN0IGJhcnI6IEJ1ZmZlcltdID0gW3N1cGVyYnVmZl1cblxuICAgIGJhcnIucHVzaCh0aGlzLm51bURlcG9zaXRUeHMpXG4gICAgYnNpemUgKz0gdGhpcy5udW1EZXBvc2l0VHhzLmxlbmd0aFxuXG4gICAgdGhpcy5kZXBvc2l0VHhzLmZvckVhY2goKGRlcG9zaXRUeDogQnVmZmVyKTogdm9pZCA9PiB7XG4gICAgICBic2l6ZSArPSBkZXBvc2l0VHgubGVuZ3RoXG4gICAgICBiYXJyLnB1c2goZGVwb3NpdFR4KVxuICAgIH0pXG4gICAgYmFyci5wdXNoKHRoaXMubnVtQ2xhaW1hYmxlT3duZXJJRHMpXG4gICAgYnNpemUgKz0gdGhpcy5udW1DbGFpbWFibGVPd25lcklEcy5sZW5ndGhcbiAgICB0aGlzLmNsYWltYWJsZU93bmVySURzLmZvckVhY2goKGNsYWltYWJsZU93bmVySUQ6IEJ1ZmZlcik6IHZvaWQgPT4ge1xuICAgICAgYmFyci5wdXNoKGNsYWltYWJsZU93bmVySUQpXG4gICAgICBic2l6ZSArPSBjbGFpbWFibGVPd25lcklELmxlbmd0aFxuICAgIH0pXG5cbiAgICBiYXJyLnB1c2godGhpcy5udW1DbGFpbWVkQW1vdW50cylcbiAgICBic2l6ZSArPSB0aGlzLm51bUNsYWltZWRBbW91bnRzLmxlbmd0aFxuICAgIHRoaXMuY2xhaW1lZEFtb3VudHMuZm9yRWFjaCgoY2xhaW1lZEFtb3VudDogQnVmZmVyKTogdm9pZCA9PiB7XG4gICAgICBiYXJyLnB1c2goY2xhaW1lZEFtb3VudClcbiAgICAgIGJzaXplICs9IGNsYWltZWRBbW91bnQubGVuZ3RoXG4gICAgfSlcblxuICAgIGJhcnIucHVzaCh0aGlzLmNsYWltVHlwZSlcbiAgICBic2l6ZSArPSB0aGlzLmNsYWltVHlwZS5sZW5ndGhcbiAgICBiYXJyLnB1c2godGhpcy5jbGFpbVRvLnRvQnVmZmVyKCkpXG4gICAgYnNpemUgKz0gdGhpcy5jbGFpbVRvLnRvQnVmZmVyKCkubGVuZ3RoXG5cbiAgICByZXR1cm4gQnVmZmVyLmNvbmNhdChiYXJyLCBic2l6ZSlcbiAgfVxuXG4gIGNsb25lKCk6IHRoaXMge1xuICAgIGNvbnN0IG5ld0NsYWltVHg6IENsYWltVHggPSBuZXcgQ2xhaW1UeCgpXG4gICAgbmV3Q2xhaW1UeC5mcm9tQnVmZmVyKHRoaXMudG9CdWZmZXIoKSlcbiAgICByZXR1cm4gbmV3Q2xhaW1UeCBhcyB0aGlzXG4gIH1cblxuICBjcmVhdGUoLi4uYXJnczogYW55W10pOiB0aGlzIHtcbiAgICByZXR1cm4gbmV3IENsYWltVHgoLi4uYXJncykgYXMgdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW5kIGFkZHMgYSBbW1NpZ0lkeF1dIHRvIHRoZSBbW0NsYWltVHhdXS5cbiAgICpcbiAgICogQHBhcmFtIGFkZHJlc3NJZHggVGhlIGluZGV4IG9mIHRoZSBhZGRyZXNzIHRvIHJlZmVyZW5jZSBpbiB0aGUgc2lnbmF0dXJlc1xuICAgKiBAcGFyYW0gYWRkcmVzcyBUaGUgYWRkcmVzcyBvZiB0aGUgc291cmNlIG9mIHRoZSBzaWduYXR1cmVcbiAgICovXG4gIGFkZFNpZ25hdHVyZUlkeChhZGRyZXNzSWR4OiBudW1iZXIsIGFkZHJlc3M6IEJ1ZmZlcik6IHZvaWQge1xuICAgIGNvbnN0IHNpZ2lkeDogU2lnSWR4ID0gbmV3IFNpZ0lkeCgpXG4gICAgY29uc3QgYjogQnVmZmVyID0gQnVmZmVyLmFsbG9jKDQpXG4gICAgYi53cml0ZVVJbnQzMkJFKGFkZHJlc3NJZHgsIDApXG4gICAgc2lnaWR4LmZyb21CdWZmZXIoYilcbiAgICBzaWdpZHguc2V0U291cmNlKGFkZHJlc3MpXG4gICAgdGhpcy5zaWdJZHhzLnB1c2goc2lnaWR4KVxuICAgIHRoaXMuc2lnQ291bnQud3JpdGVVSW50MzJCRSh0aGlzLnNpZ0lkeHMubGVuZ3RoLCAwKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGFycmF5IG9mIFtbU2lnSWR4XV0gZm9yIHRoaXMgW1tUWF1dXG4gICAqL1xuICBnZXRTaWdJZHhzKCk6IFNpZ0lkeFtdIHtcbiAgICByZXR1cm4gdGhpcy5zaWdJZHhzXG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBhcnJheSBvZiBbW1NpZ0lkeF1dIGZvciB0aGlzIFtbVFhdXVxuICAgKi9cbiAgc2V0U2lnSWR4cyhzaWdJZHhzOiBTaWdJZHhbXSkge1xuICAgIHRoaXMuc2lnSWR4cyA9IHNpZ0lkeHNcbiAgICB0aGlzLnNpZ0NvdW50LndyaXRlVUludDMyQkUodGhpcy5zaWdJZHhzLmxlbmd0aCwgMClcbiAgfVxuICAvKipcbiAgICogQ2xhc3MgcmVwcmVzZW50aW5nIGFuIHVuc2lnbmVkIFJlZ2lzdGVyTm9kZSB0cmFuc2FjdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIG5ldHdvcmtJRCBPcHRpb25hbCBuZXR3b3JrSUQsIFtbRGVmYXVsdE5ldHdvcmtJRF1dXG4gICAqIEBwYXJhbSBibG9ja2NoYWluSUQgT3B0aW9uYWwgYmxvY2tjaGFpbklELCBkZWZhdWx0IEJ1ZmZlci5hbGxvYygzMiwgMTYpXG4gICAqIEBwYXJhbSBvdXRzIE9wdGlvbmFsIGFycmF5IG9mIHRoZSBbW1RyYW5zZmVyYWJsZU91dHB1dF1dc1xuICAgKiBAcGFyYW0gaW5zIE9wdGlvbmFsIGFycmF5IG9mIHRoZSBbW1RyYW5zZmVyYWJsZUlucHV0XV1zXG4gICAqIEBwYXJhbSBkZXBvc2l0VHhJRHMgT3B0aW9uYWwgYXJyYXkgb2YgdGhlIGRlcG9zaXQgdHggaWRzXG4gICAqIEBwYXJhbSBjbGFpbWFibGVPd25lcklEcyBPcHRpb25hbCBhcnJheSBvZiB0aGUgY2xhaW1hYmxlIG93bmVyIGlkc1xuICAgKiBAcGFyYW0gY2xhaW1lZEFtb3VudHMgT3B0aW9uYWwgYXJyYXkgb2YgdGhlIGNsYWltZWQgYW1vdW50c1xuICAgKiBAcGFyYW0gY2xhaW1UeXBlIE9wdGlvbmFsIHRoZSB0eXBlIG9mIHRoZSBjbGFpbVxuICAgKiBAcGFyYW0gY2xhaW1UbyBPcHRpb25hbCB0aGUgb3duZXIgb2YgdGhlIHJld2FyZHNcbiAgICovXG4gIGNvbnN0cnVjdG9yKFxuICAgIG5ldHdvcmtJRDogbnVtYmVyID0gRGVmYXVsdE5ldHdvcmtJRCxcbiAgICBibG9ja2NoYWluSUQ6IEJ1ZmZlciA9IEJ1ZmZlci5hbGxvYygzMiwgMTYpLFxuICAgIG91dHM6IFRyYW5zZmVyYWJsZU91dHB1dFtdID0gdW5kZWZpbmVkLFxuICAgIGluczogVHJhbnNmZXJhYmxlSW5wdXRbXSA9IHVuZGVmaW5lZCxcbiAgICBtZW1vOiBCdWZmZXIgPSB1bmRlZmluZWQsXG4gICAgZGVwb3NpdFR4SURzOiBzdHJpbmdbXSB8IEJ1ZmZlcltdID0gdW5kZWZpbmVkLFxuICAgIGNsYWltYWJsZU93bmVySURzOiBzdHJpbmdbXSB8IEJ1ZmZlcltdID0gdW5kZWZpbmVkLFxuICAgIGNsYWltZWRBbW91bnRzOiBCTltdID0gdW5kZWZpbmVkLFxuICAgIGNsYWltVHlwZTogQk4gPSB1bmRlZmluZWQsXG4gICAgY2xhaW1UbzogUGFyc2VhYmxlT3V0cHV0ID0gdW5kZWZpbmVkXG4gICkge1xuICAgIHN1cGVyKG5ldHdvcmtJRCwgYmxvY2tjaGFpbklELCBvdXRzLCBpbnMsIG1lbW8pXG5cbiAgICBpZiAodHlwZW9mIGRlcG9zaXRUeElEcyAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aGlzLm51bURlcG9zaXRUeHMud3JpdGVVSW50MzJCRShkZXBvc2l0VHhJRHMubGVuZ3RoLCAwKVxuICAgICAgY29uc3QgZGVwb3NpdFR4QnVmczogQnVmZmVyW10gPSBbXVxuICAgICAgZGVwb3NpdFR4SURzLmZvckVhY2goKHR4SUQ6IHN0cmluZyB8IEJ1ZmZlcik6IHZvaWQgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIHR4SUQgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICBkZXBvc2l0VHhCdWZzLnB1c2goYmludG9vbHMuY2I1OERlY29kZSh0eElEKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZXBvc2l0VHhCdWZzLnB1c2godHhJRClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHRoaXMuZGVwb3NpdFR4cyA9IGRlcG9zaXRUeEJ1ZnNcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNsYWltYWJsZU93bmVySURzICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMubnVtQ2xhaW1hYmxlT3duZXJJRHMud3JpdGVVSW50MzJCRShjbGFpbWFibGVPd25lcklEcy5sZW5ndGgsIDApXG4gICAgICBjb25zdCBjbGFpbWFibGVPd25lcklEQnVmczogQnVmZmVyW10gPSBbXVxuICAgICAgY2xhaW1hYmxlT3duZXJJRHMuZm9yRWFjaCgob3duZXJJRDogc3RyaW5nIHwgQnVmZmVyKTogdm9pZCA9PiB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3duZXJJRCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgIGNsYWltYWJsZU93bmVySURCdWZzLnB1c2goYmludG9vbHMuY2I1OERlY29kZShvd25lcklEKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjbGFpbWFibGVPd25lcklEQnVmcy5wdXNoKG93bmVySUQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0aGlzLmNsYWltYWJsZU93bmVySURzID0gY2xhaW1hYmxlT3duZXJJREJ1ZnNcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGNsYWltZWRBbW91bnRzICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMubnVtQ2xhaW1lZEFtb3VudHMud3JpdGVVSW50MzJCRShjbGFpbWVkQW1vdW50cy5sZW5ndGgsIDApXG4gICAgICBjb25zdCBjbGFpbWVkQW1vdW50QnVmczogQnVmZmVyW10gPSBbXVxuICAgICAgY2xhaW1lZEFtb3VudHMuZm9yRWFjaCgoYW1vdW50OiBCTik6IHZvaWQgPT4ge1xuICAgICAgICBjbGFpbWVkQW1vdW50QnVmcy5wdXNoKGJpbnRvb2xzLmZyb21CTlRvQnVmZmVyKGFtb3VudCwgOCkpXG4gICAgICB9KVxuICAgICAgdGhpcy5jbGFpbWVkQW1vdW50cyA9IGNsYWltZWRBbW91bnRCdWZzXG4gICAgfVxuXG4gICAgdGhpcy5jbGFpbVR5cGUgPSBiaW50b29scy5mcm9tQk5Ub0J1ZmZlcihjbGFpbVR5cGUsIDgpXG4gICAgdGhpcy5jbGFpbVRvID0gY2xhaW1Ub1xuICB9XG5cbiAgLyoqXG4gICAqIFRha2VzIHRoZSBieXRlcyBvZiBhbiBbW1Vuc2lnbmVkVHhdXSBhbmQgcmV0dXJucyBhbiBhcnJheSBvZiBbW0NyZWRlbnRpYWxdXXNcbiAgICpcbiAgICogQHBhcmFtIG1zZyBBIEJ1ZmZlciBmb3IgdGhlIFtbVW5zaWduZWRUeF1dXG4gICAqIEBwYXJhbSBrYyBBbiBbW0tleUNoYWluXV0gdXNlZCBpbiBzaWduaW5nXG4gICAqXG4gICAqIEByZXR1cm5zIEFuIGFycmF5IG9mIFtbQ3JlZGVudGlhbF1dc1xuICAgKi9cbiAgc2lnbihtc2c6IEJ1ZmZlciwga2M6IEtleUNoYWluKTogQ3JlZGVudGlhbFtdIHtcbiAgICBjb25zdCBjcmVkczogQ3JlZGVudGlhbFtdID0gc3VwZXIuc2lnbihtc2csIGtjKVxuICAgIGNvbnN0IHNpZ2lkeHM6IFNpZ0lkeFtdID0gdGhpcy5nZXRTaWdJZHhzKClcbiAgICBjb25zdCBjcmVkOiBDcmVkZW50aWFsID0gU2VsZWN0Q3JlZGVudGlhbENsYXNzKFxuICAgICAgUGxhdGZvcm1WTUNvbnN0YW50cy5TRUNQQ1JFREVOVElBTFxuICAgIClcbiAgICBmb3IgKGxldCBpOiBudW1iZXIgPSAwOyBpIDwgc2lnaWR4cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qga2V5cGFpcjogS2V5UGFpciA9IGtjLmdldEtleShzaWdpZHhzW2Ake2l9YF0uZ2V0U291cmNlKCkpXG4gICAgICBjb25zdCBzaWdudmFsOiBCdWZmZXIgPSBrZXlwYWlyLnNpZ24obXNnKVxuICAgICAgY29uc3Qgc2lnOiBTaWduYXR1cmUgPSBuZXcgU2lnbmF0dXJlKClcbiAgICAgIHNpZy5mcm9tQnVmZmVyKHNpZ252YWwpXG4gICAgICBjcmVkLmFkZFNpZ25hdHVyZShzaWcpXG4gICAgfVxuICAgIGNyZWRzLnB1c2goY3JlZClcbiAgICByZXR1cm4gY3JlZHNcbiAgfVxufVxuIl19