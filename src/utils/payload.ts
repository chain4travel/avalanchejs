/**
 * @packageDocumentation
 * @module Payload
 */

import { Buffer } from "buffer/";
import BinTools  from './bintools';
import BN from "bn.js";

/**
 * @ignore
 */
const bintools = BinTools.getInstance();

/**
 * Class for determining payload types and managing the lookup table.
 */
export class PayloadTypes {
    private static instance: PayloadTypes;
    protected types:Array<string> = [];

    /**
     * Given a type string returns a the proper TypeID.
     */
    lookupID(typestr:string) {
        return this.types.indexOf(typestr);
    }

    /**
     * Given a TypeID returns a string describing the payload type.
     */
    lookupType(value:number):string {
        return this.types[value];
    }

    /**
     * Given a TypeID returns a the proper [[PayloadBase]].
     */
    select(typeid:number, ...args:Array<any>):PayloadBase {
        switch(typeid) {
            case 0:
                return new BINPayload(...args);
            case 1:
                return new UTF8Payload(...args);
            case 2:
                return new HEXSTRPayload(...args);
            case 3:
                return new B58STRPayload(...args);
            case 4:
                return new B64STRPayload(...args);
            case 5:
                return new BIGNUMPayload(...args);
            case 6:
                return new XCHAINPayload(...args);
            case 7:
                return new PCHAINPayload(...args);
            case 8:
                return new CCHAINPayload(...args);
            case 9:
                return new TXIDPayload(...args);
            case 10:
                return new ASSETIDPayload(...args);
            case 11:
                return new UTXOIDPayload(...args);
            case 12:
                return new NFTIDPayload(...args);
            case 13:
                return new SUBNETIDPayload(...args);
            case 14:
                return new CHAINIDPayload(...args);
            case 15:
                return new NODEIDPayload(...args);
            case 16:
                return new SECPSIGPayload(...args);
            case 17:
                return new SECPENCPayload(...args);
            case 18:
                return new JPEGPayload(...args);
            case 19:
                return new PNGPayload(...args);
            case 20:
                return new BMPPayload(...args);
            case 21:
                return new ICOPayload(...args);
            case 22:
                return new SVGPayload(...args);
            case 23:
                return new CSVPayload(...args);
            case 24:
                return new JSONPayload(...args);
            case 25:
                return new PROTOBUFPayload(...args);
            case 26:
                return new YAMLPayload(...args);
            case 27:
                return new EMAILPayload(...args);
            case 28:
                return new URLPayload(...args);
            case 29:
                return new IPFSPayload(...args);
            case 30:
                return new ONIONPayload(...args);
            case 31:
                return new MAGNETPayload(...args);
        }
        throw new Error("Error - PayloadTypes.select: unknown typeid " + typeid);
    }

    /**
     * Given a [[PayloadBase]] which may not be cast properly, returns a properly cast [[PayloadBase]].
     */
    recast(unknowPayload:PayloadBase):PayloadBase {
        return this.select(unknowPayload.typeID(), unknowPayload.returnType());
    }

    /**
     * Returns the [[PayloadTypes]] singleton.
     */
    static getInstance(): PayloadTypes {
        if (!PayloadTypes.instance) {
            PayloadTypes.instance = new PayloadTypes();
        }
    
        return PayloadTypes.instance;
      }

    private constructor() {
        this.types = [
            "BIN", "UTF8", "HEXSTR", "B58STR", "B64STR", "BIGNUM", "XCHAINADDR", "PCHAINADDR", "CCHAINADDR", "TXID", 
            "ASSETID", "UTXOID",  "NFTID", "SUBNETID", "CHAINID", "NODEID", "SECPSIG", "SECPENC", "JPEG", "PNG", 
            "BMP", "ICO", "SVG", "CSV", "JSON", "PROTOBUF", "YAML", "EMAIL", "URL", "IPFS", "ONION", "MAGNET"
        ];
    }
}

/**
 * Base class for payloads.
 */
export abstract class PayloadBase {
    protected payload:Buffer = Buffer.alloc(0);
    protected typeid:number = undefined;
    
    /**
     * Returns the TypeID for the payload.
     */
    typeID():number {
        return this.typeid;
    }

    /**
     * Returns the string name for the payload's type.
     */
    typeName():string {
        return PayloadTypes.getInstance().lookupType(this.typeid);
    }

    /**
     * Decodes the payload as a {@link https://github.com/feross/buffer|Buffer} including 4 bytes for the length and TypeID.
     */
    fromBuffer(bytes:Buffer, offset:number = 0):number {
        let size:number = bintools.copyFrom(bytes, offset, offset + 4).readUInt32BE(0);
        offset += 4;
        this.typeid = bintools.copyFrom(bytes, offset, offset + 1).readUInt8(0);
        offset += 1
        this.payload = bintools.copyFrom(bytes, offset, offset + size - 1);
        return offset + this.payload.length - 1;
    }

    /**
     * Encodes the payload as a {@link https://github.com/feross/buffer|Buffer} including 4 bytes for the length and TypeID.
     */
    toBuffer():Buffer {
        let sizebuff:Buffer = Buffer.alloc(4);
        sizebuff.writeUInt32BE(this.payload.length + 1, 0);
        let typebuff:Buffer = Buffer.alloc(1);
        typebuff.writeUInt8(this.typeid, 0);
        return Buffer.concat([sizebuff, typebuff, this.payload]);
    }

    /**
     * Returns the expected type for the payload.
     */
    abstract returnType():any;

    constructor(){}

}

/**
 * Class for payloads representing simple binary blobs.
 */
export class BINPayload extends PayloadBase {
    protected typeid = 0;

    /**
     * Returns a {@link https://github.com/feross/buffer|Buffer} for the payload.
     */
    returnType():Buffer {
        return this.payload;
    }

    constructor(payload:Buffer = undefined){
        super();
        if(payload) {
            this.payload = payload;
        }
    }
}

/**
 * Class for payloads representing UTF8 encoding.
 */
export class UTF8Payload extends PayloadBase {
    protected typeid = 1;

    /**
     * Returns a string for the payload.
     */
    returnType():string {
        return this.payload.toString("utf8");
    }

    constructor(payload:string|Buffer = undefined){
        super();
        if(payload instanceof Buffer){
            this.payload = payload;
        } else if(payload) {
            this.payload = Buffer.from(payload, "utf8");
        }
    }
}

/**
 * Class for payloads representing Hexadecimal encoding.
 */
export class HEXSTRPayload extends PayloadBase {
    protected typeid = 2;

    /**
     * Returns a hex string for the payload.
     */
    returnType():string {
        return this.payload.toString("hex");
    }

    constructor(payload:string|Buffer = undefined){
        super();
        if(payload instanceof Buffer){
            this.payload = payload;
        } else if(payload) {
            this.payload = Buffer.from(payload, "hex");
        }
    }
}

/**
 * Class for payloads representing Base58 encoding (Bitcoin standard).
 */
export class B58STRPayload extends PayloadBase {
    protected typeid = 3;

    /**
     * Returns a base58 string for the payload.
     */
    returnType():string {
        return bintools.bufferToB58(this.payload);
    }

    constructor(payload:string|Buffer = undefined){
        super();
        if(payload instanceof Buffer){
            this.payload = payload;
        } else if(payload) {
            this.payload = bintools.b58ToBuffer(payload);
        }
    }
}

/**
 * Class for payloads representing Base64 encoding.
 */
export class B64STRPayload extends PayloadBase {
    protected typeid = 4;

    /**
     * Returns a base64 string for the payload.
     */
    returnType():string {
        return this.payload.toString("base64");
    }

    constructor(payload:string|Buffer = undefined){
        super();
        if(payload instanceof Buffer){
            this.payload = payload;
        } else if(payload) {
            this.payload = Buffer.from(payload, "base64");
        }
    }
}

/**
 * Class for payloads representing Big Numbers.
 */
export class BIGNUMPayload extends PayloadBase {
    protected typeid = 5;

    /**
     * Returns a {@link https://github.com/indutny/bn.js/|BN} for the payload.
     */
    returnType():BN {
        return bintools.fromBufferToBN(this.payload);
    }

    constructor(payload:string|Buffer = undefined){
        super();
        if(payload instanceof Buffer){
            this.payload = payload;
        } else if(payload) {
            this.payload = Buffer.from(payload, "base64");
        }
    }
}

/**
 * Class for payloads representing chain addresses.
 */
export abstract class ChainAddressPayload extends PayloadBase {
    protected typeid = 6;
    protected chainid:string = "";

    /**
     * Returns the chainid.
     */
    returnChainID():string {
        return this.chainid;
    }

    /**
     * Returns an address string for the payload.
     */
    returnType():string {
        return bintools.addressToString(this.chainid, this.payload);
    }

    constructor(payload:string|Buffer = undefined){
        super();
        if(payload instanceof Buffer){
            this.payload = payload;
        } else if(payload) {
            this.payload = bintools.stringToAddress(payload);
        }
    }
}

/**
 * Class for payloads representing X-Chin addresses.
 */
export class XCHAINPayload extends ChainAddressPayload {
    protected typeid = 6;
    protected chainid = "X";
}

/**
 * Class for payloads representing P-Chain addresses.
 */
export class PCHAINPayload extends ChainAddressPayload {
    protected typeid = 7;
    protected chainid = "P";
}

/**
 * Class for payloads representing C-Chain addresses.
 */
export class CCHAINPayload extends ChainAddressPayload {
    protected typeid = 8;
    protected chainid = "C";
}

/**
 * Class for payloads representing data serialized by bintools.avaSerialize().
 */
export abstract class AvaSerializedPayload extends PayloadBase {

    /**
     * Returns a bintools.avaSerialized string for the payload.
     */
    returnType():string {
        return bintools.avaSerialize(this.payload);
    }

    constructor(payload:string|Buffer = undefined){
        super();
        if(payload instanceof Buffer){
            this.payload = payload;
        } else if(payload) {
            this.payload = bintools.avaDeserialize(payload);
        }
    }
}

/**
 * Class for payloads representing TxIDs.
 */
export class TXIDPayload extends AvaSerializedPayload {
    protected typeid = 9;
}

/**
 * Class for payloads representing AssetIDs.
 */
export class ASSETIDPayload extends AvaSerializedPayload {
    protected typeid = 10;
}

/**
 * Class for payloads representing NODEIDs.
 */
export class UTXOIDPayload extends AvaSerializedPayload {
    protected typeid = 11;
}

/**
 * Class for payloads representing NFTIDs (UTXOIDs in an NFT context).
 */
export class NFTIDPayload extends UTXOIDPayload {
    protected typeid = 12;
}

/**
 * Class for payloads representing SubnetIDs.
 */
export class SUBNETIDPayload extends AvaSerializedPayload {
    protected typeid = 13;
}

/**
 * Class for payloads representing ChainIDs.
 */
export class CHAINIDPayload extends AvaSerializedPayload {
    protected typeid = 14;
}

/**
 * Class for payloads representing NodeIDs.
 */
export class NODEIDPayload extends AvaSerializedPayload {
    protected typeid = 15;
}

/**
 * Class for payloads representing secp256k1 signatures.
 * convention: secp256k1 signature (130 bytes)
 */
export class SECPSIGPayload extends B58STRPayload {
    protected typeid = 16;
}

/**
 * Class for payloads representing secp256k1 encrypted messages.
 * convention: public key (65 bytes) + secp256k1 encrypted message for that public key
 */
export class SECPENCPayload extends B58STRPayload {
    protected typeid = 17;
}

/**
 * Class for payloads representing JPEG images.
 */
export class JPEGPayload extends BINPayload {
    protected typeid = 18;
}

export class PNGPayload extends BINPayload {
    protected typeid = 19;
}

/**
 * Class for payloads representing BMP images.
 */
export class BMPPayload extends BINPayload {
    protected typeid = 20;
}

/**
 * Class for payloads representing ICO images.
 */
export class ICOPayload extends BINPayload {
    protected typeid = 21;
}

/**
 * Class for payloads representing SVG images.
 */
export class SVGPayload extends UTF8Payload {
    protected typeid = 22;
}

/**
 * Class for payloads representing CSV files.
 */
export class CSVPayload extends UTF8Payload {
    protected typeid = 23;
}

/**
 * Class for payloads representing JSON strings.
 */
export class JSONPayload extends PayloadBase {
    protected typeid = 24;

    /**
     * Returns a JSON-decoded object for the payload.
     */
    returnType():any {
        return JSON.parse(this.payload.toString("utf8"));
    }

    constructor(payload:any|string|Buffer = undefined){
        super();
        if(payload instanceof Buffer){
            this.payload = payload;
        } else if(typeof payload === "string") {
            this.payload = Buffer.from(payload, "utf8");
        } else if(payload) {
            let jsonstr:string = JSON.stringify(payload);
            this.payload = Buffer.from(jsonstr, "utf8");
        }
    }
}

/**
 * Class for payloads representing protobuf definitions.
 */
export class PROTOBUFPayload extends BINPayload {
    protected typeid = 25;
}

/**
 * Class for payloads representing YAML definitions.
 */
export class YAMLPayload extends UTF8Payload {
    protected typeid = 26;
}

/**
 * Class for payloads representing email addresses.
 */
export class EMAILPayload extends UTF8Payload {
    protected typeid = 27;
}

/**
 * Class for payloads representing URL strings.
 */
export class URLPayload extends UTF8Payload {
    protected typeid = 28;
}

/**
 * Class for payloads representing IPFS addresses.
 */
export class IPFSPayload extends B58STRPayload {
    protected typeid = 29;
}

/**
 * Class for payloads representing onion URLs.
 */
export class ONIONPayload extends UTF8Payload {
    protected typeid = 30;
}

/**
 * Class for payloads representing torrent magnet links.
 */
export class MAGNETPayload extends UTF8Payload {
    protected typeid = 31;
}