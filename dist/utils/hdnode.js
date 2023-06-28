"use strict";
/**
 * @packageDocumentation
 * @module Utils-HDNode
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const buffer_1 = require("buffer/");
const hdkey_1 = __importDefault(require("hdkey"));
const bintools_1 = __importDefault(require("./bintools"));
const bintools = bintools_1.default.getInstance();
/**
 * BIP32 hierarchical deterministic keys.
 */
class HDNode {
    /**
     * Derives the HDNode at path from the current HDNode.
     * @param path
     * @returns derived child HDNode
     */
    derive(path) {
        const hdKey = this.hdkey.derive(path);
        let hdNode;
        if (hdKey.privateExtendedKey != null) {
            hdNode = new HDNode(hdKey.privateExtendedKey);
        }
        else {
            hdNode = new HDNode(hdKey.publicExtendedKey);
        }
        return hdNode;
    }
    /**
     * Signs the buffer hash with the private key using secp256k1 and returns the signature as a buffer.
     * @param hash
     * @returns signature as a Buffer
     */
    sign(hash) {
        const sig = this.hdkey.sign(hash);
        return buffer_1.Buffer.from(sig);
    }
    /**
     * Verifies that the signature is valid for hash and the HDNode's public key using secp256k1.
     * @param hash
     * @param signature
     * @returns true for valid, false for invalid.
     * @throws if the hash or signature is the wrong length.
     */
    verify(hash, signature) {
        return this.hdkey.verify(hash, signature);
    }
    /**
     * Wipes all record of the private key from the HDNode instance.
     * After calling this method, the instance will behave as if it was created via an xpub.
     */
    wipePrivateData() {
        this.privateKey = null;
        this.privateExtendedKey = null;
        this.privateKeyCB58 = null;
        this.hdkey.wipePrivateData();
    }
    /**
     * Creates an HDNode from a master seed or an extended public/private key
     * @param from seed or key to create HDNode from
     */
    constructor(from) {
        if (typeof from === "string" && from.substring(0, 2) === "xp") {
            this.hdkey = hdkey_1.default.fromExtendedKey(from);
        }
        else if (buffer_1.Buffer.isBuffer(from)) {
            this.hdkey = hdkey_1.default.fromMasterSeed(from);
        }
        else {
            this.hdkey = hdkey_1.default.fromMasterSeed(buffer_1.Buffer.from(from));
        }
        this.publicKey = this.hdkey.publicKey;
        this.privateKey = this.hdkey.privateKey;
        if (this.privateKey) {
            this.privateKeyCB58 = `PrivateKey-${bintools.cb58Encode(this.privateKey)}`;
        }
        else {
            this.privateExtendedKey = null;
        }
        this.chainCode = this.hdkey.chainCode;
        this.privateExtendedKey = this.hdkey.privateExtendedKey;
        this.publicExtendedKey = this.hdkey.publicExtendedKey;
    }
}
exports.default = HDNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGRub2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL2hkbm9kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztHQUdHOzs7OztBQUVILG9DQUFnQztBQUNoQyxrREFBMEI7QUFDMUIsMERBQWlDO0FBQ2pDLE1BQU0sUUFBUSxHQUFhLGtCQUFRLENBQUMsV0FBVyxFQUFFLENBQUE7QUFFakQ7O0dBRUc7QUFFSCxNQUFxQixNQUFNO0lBU3pCOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsSUFBWTtRQUNqQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNyQyxJQUFJLE1BQWMsQ0FBQTtRQUNsQixJQUFJLEtBQUssQ0FBQyxrQkFBa0IsSUFBSSxJQUFJLEVBQUU7WUFDcEMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO1NBQzlDO2FBQU07WUFDTCxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUE7U0FDN0M7UUFDRCxPQUFPLE1BQU0sQ0FBQTtJQUNmLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsSUFBSSxDQUFDLElBQVk7UUFDZixNQUFNLEdBQUcsR0FBVyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUN6QyxPQUFPLGVBQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDekIsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILE1BQU0sQ0FBQyxJQUFZLEVBQUUsU0FBaUI7UUFDcEMsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUE7SUFDM0MsQ0FBQztJQUVEOzs7T0FHRztJQUNILGVBQWU7UUFDYixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQTtRQUN0QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFBO1FBQzlCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFBO1FBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUE7SUFDOUIsQ0FBQztJQUVEOzs7T0FHRztJQUNILFlBQVksSUFBcUI7UUFDL0IsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQzdELElBQUksQ0FBQyxLQUFLLEdBQUcsZUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtTQUMxQzthQUFNLElBQUksZUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNoQyxJQUFJLENBQUMsS0FBSyxHQUFHLGVBQU0sQ0FBQyxjQUFjLENBQUMsSUFBb0MsQ0FBQyxDQUFBO1NBQ3pFO2FBQU07WUFDTCxJQUFJLENBQUMsS0FBSyxHQUFHLGVBQU0sQ0FBQyxjQUFjLENBQ2hDLGVBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFpQyxDQUNsRCxDQUFBO1NBQ0Y7UUFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFBO1FBQ3JDLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUE7UUFDdkMsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLElBQUksQ0FBQyxjQUFjLEdBQUcsY0FBYyxRQUFRLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFBO1NBQzNFO2FBQU07WUFDTCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFBO1NBQy9CO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQTtRQUNyQyxJQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQTtRQUN2RCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQTtJQUN2RCxDQUFDO0NBQ0Y7QUFsRkQseUJBa0ZDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAcGFja2FnZURvY3VtZW50YXRpb25cbiAqIEBtb2R1bGUgVXRpbHMtSEROb2RlXG4gKi9cblxuaW1wb3J0IHsgQnVmZmVyIH0gZnJvbSBcImJ1ZmZlci9cIlxuaW1wb3J0IGhkbm9kZSBmcm9tIFwiaGRrZXlcIlxuaW1wb3J0IEJpblRvb2xzIGZyb20gXCIuL2JpbnRvb2xzXCJcbmNvbnN0IGJpbnRvb2xzOiBCaW5Ub29scyA9IEJpblRvb2xzLmdldEluc3RhbmNlKClcblxuLyoqXG4gKiBCSVAzMiBoaWVyYXJjaGljYWwgZGV0ZXJtaW5pc3RpYyBrZXlzLlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhETm9kZSB7XG4gIHByaXZhdGUgaGRrZXk6IGFueVxuICBwdWJsaWNLZXk6IEJ1ZmZlclxuICBwcml2YXRlS2V5OiBCdWZmZXJcbiAgcHJpdmF0ZUtleUNCNTg6IHN0cmluZ1xuICBjaGFpbkNvZGU6IEJ1ZmZlclxuICBwcml2YXRlRXh0ZW5kZWRLZXk6IHN0cmluZ1xuICBwdWJsaWNFeHRlbmRlZEtleTogc3RyaW5nXG5cbiAgLyoqXG4gICAqIERlcml2ZXMgdGhlIEhETm9kZSBhdCBwYXRoIGZyb20gdGhlIGN1cnJlbnQgSEROb2RlLlxuICAgKiBAcGFyYW0gcGF0aFxuICAgKiBAcmV0dXJucyBkZXJpdmVkIGNoaWxkIEhETm9kZVxuICAgKi9cbiAgZGVyaXZlKHBhdGg6IHN0cmluZyk6IEhETm9kZSB7XG4gICAgY29uc3QgaGRLZXkgPSB0aGlzLmhka2V5LmRlcml2ZShwYXRoKVxuICAgIGxldCBoZE5vZGU6IEhETm9kZVxuICAgIGlmIChoZEtleS5wcml2YXRlRXh0ZW5kZWRLZXkgIT0gbnVsbCkge1xuICAgICAgaGROb2RlID0gbmV3IEhETm9kZShoZEtleS5wcml2YXRlRXh0ZW5kZWRLZXkpXG4gICAgfSBlbHNlIHtcbiAgICAgIGhkTm9kZSA9IG5ldyBIRE5vZGUoaGRLZXkucHVibGljRXh0ZW5kZWRLZXkpXG4gICAgfVxuICAgIHJldHVybiBoZE5vZGVcbiAgfVxuXG4gIC8qKlxuICAgKiBTaWducyB0aGUgYnVmZmVyIGhhc2ggd2l0aCB0aGUgcHJpdmF0ZSBrZXkgdXNpbmcgc2VjcDI1NmsxIGFuZCByZXR1cm5zIHRoZSBzaWduYXR1cmUgYXMgYSBidWZmZXIuXG4gICAqIEBwYXJhbSBoYXNoXG4gICAqIEByZXR1cm5zIHNpZ25hdHVyZSBhcyBhIEJ1ZmZlclxuICAgKi9cbiAgc2lnbihoYXNoOiBCdWZmZXIpOiBCdWZmZXIge1xuICAgIGNvbnN0IHNpZzogQnVmZmVyID0gdGhpcy5oZGtleS5zaWduKGhhc2gpXG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKHNpZylcbiAgfVxuXG4gIC8qKlxuICAgKiBWZXJpZmllcyB0aGF0IHRoZSBzaWduYXR1cmUgaXMgdmFsaWQgZm9yIGhhc2ggYW5kIHRoZSBIRE5vZGUncyBwdWJsaWMga2V5IHVzaW5nIHNlY3AyNTZrMS5cbiAgICogQHBhcmFtIGhhc2hcbiAgICogQHBhcmFtIHNpZ25hdHVyZVxuICAgKiBAcmV0dXJucyB0cnVlIGZvciB2YWxpZCwgZmFsc2UgZm9yIGludmFsaWQuXG4gICAqIEB0aHJvd3MgaWYgdGhlIGhhc2ggb3Igc2lnbmF0dXJlIGlzIHRoZSB3cm9uZyBsZW5ndGguXG4gICAqL1xuICB2ZXJpZnkoaGFzaDogQnVmZmVyLCBzaWduYXR1cmU6IEJ1ZmZlcik6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmhka2V5LnZlcmlmeShoYXNoLCBzaWduYXR1cmUpXG4gIH1cblxuICAvKipcbiAgICogV2lwZXMgYWxsIHJlY29yZCBvZiB0aGUgcHJpdmF0ZSBrZXkgZnJvbSB0aGUgSEROb2RlIGluc3RhbmNlLlxuICAgKiBBZnRlciBjYWxsaW5nIHRoaXMgbWV0aG9kLCB0aGUgaW5zdGFuY2Ugd2lsbCBiZWhhdmUgYXMgaWYgaXQgd2FzIGNyZWF0ZWQgdmlhIGFuIHhwdWIuXG4gICAqL1xuICB3aXBlUHJpdmF0ZURhdGEoKSB7XG4gICAgdGhpcy5wcml2YXRlS2V5ID0gbnVsbFxuICAgIHRoaXMucHJpdmF0ZUV4dGVuZGVkS2V5ID0gbnVsbFxuICAgIHRoaXMucHJpdmF0ZUtleUNCNTggPSBudWxsXG4gICAgdGhpcy5oZGtleS53aXBlUHJpdmF0ZURhdGEoKVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gSEROb2RlIGZyb20gYSBtYXN0ZXIgc2VlZCBvciBhbiBleHRlbmRlZCBwdWJsaWMvcHJpdmF0ZSBrZXlcbiAgICogQHBhcmFtIGZyb20gc2VlZCBvciBrZXkgdG8gY3JlYXRlIEhETm9kZSBmcm9tXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihmcm9tOiBzdHJpbmcgfCBCdWZmZXIpIHtcbiAgICBpZiAodHlwZW9mIGZyb20gPT09IFwic3RyaW5nXCIgJiYgZnJvbS5zdWJzdHJpbmcoMCwgMikgPT09IFwieHBcIikge1xuICAgICAgdGhpcy5oZGtleSA9IGhkbm9kZS5mcm9tRXh0ZW5kZWRLZXkoZnJvbSlcbiAgICB9IGVsc2UgaWYgKEJ1ZmZlci5pc0J1ZmZlcihmcm9tKSkge1xuICAgICAgdGhpcy5oZGtleSA9IGhkbm9kZS5mcm9tTWFzdGVyU2VlZChmcm9tIGFzIHVua25vd24gYXMgZ2xvYmFsVGhpcy5CdWZmZXIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGRrZXkgPSBoZG5vZGUuZnJvbU1hc3RlclNlZWQoXG4gICAgICAgIEJ1ZmZlci5mcm9tKGZyb20pIGFzIHVua25vd24gYXMgZ2xvYmFsVGhpcy5CdWZmZXJcbiAgICAgIClcbiAgICB9XG4gICAgdGhpcy5wdWJsaWNLZXkgPSB0aGlzLmhka2V5LnB1YmxpY0tleVxuICAgIHRoaXMucHJpdmF0ZUtleSA9IHRoaXMuaGRrZXkucHJpdmF0ZUtleVxuICAgIGlmICh0aGlzLnByaXZhdGVLZXkpIHtcbiAgICAgIHRoaXMucHJpdmF0ZUtleUNCNTggPSBgUHJpdmF0ZUtleS0ke2JpbnRvb2xzLmNiNThFbmNvZGUodGhpcy5wcml2YXRlS2V5KX1gXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucHJpdmF0ZUV4dGVuZGVkS2V5ID0gbnVsbFxuICAgIH1cbiAgICB0aGlzLmNoYWluQ29kZSA9IHRoaXMuaGRrZXkuY2hhaW5Db2RlXG4gICAgdGhpcy5wcml2YXRlRXh0ZW5kZWRLZXkgPSB0aGlzLmhka2V5LnByaXZhdGVFeHRlbmRlZEtleVxuICAgIHRoaXMucHVibGljRXh0ZW5kZWRLZXkgPSB0aGlzLmhka2V5LnB1YmxpY0V4dGVuZGVkS2V5XG4gIH1cbn1cbiJdfQ==