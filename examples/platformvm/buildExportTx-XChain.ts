import { Avalanche, BN, Buffer } from "caminojs/index"
import { AVMAPI, KeyChain as AVMKeyChain } from "caminojs/apis/avm"
import {
  PlatformVMAPI,
  KeyChain,
  UTXOSet,
  UnsignedTx,
  Tx
} from "caminojs/apis/platformvm"
import { PrivateKeyPrefix, DefaultLocalGenesisPrivateKey } from "caminojs/utils"
import { ExamplesConfig } from "../common/examplesConfig"

const config: ExamplesConfig = require("../common/examplesConfig.json")
const avalanche: Avalanche = new Avalanche(
  config.host,
  config.port,
  config.protocol,
  config.networkID
)

const privKey: string = `${PrivateKeyPrefix}${DefaultLocalGenesisPrivateKey}`
const threshold: number = 1
const locktime: BN = new BN(0)
const memo: Buffer = Buffer.from(
  "PlatformVM utility method buildExportTx to export AVAX from the P-Chain to the X-Chain"
)
const asOf: BN = new BN(0)

let pchain: PlatformVMAPI
let pKeychain: KeyChain
let pAddressStrings: string[]
let fee: BN

let xchain: AVMAPI
let xKeychain: AVMKeyChain
let xAddressStrings: string[]
let xChainBlockchainID: string

const InitAvalanche = async () => {
  await avalanche.fetchNetworkSettings()
  pchain = avalanche.PChain()
  pKeychain = pchain.keyChain()
  pKeychain.importKey(privKey)
  pAddressStrings = pchain.keyChain().getAddressStrings()
  fee = pchain.getDefaultTxFee()

  xchain = avalanche.XChain()
  xChainBlockchainID = avalanche.getNetwork().X.blockchainID
  xKeychain = xchain.keyChain()
  xKeychain.importKey(privKey)
  xAddressStrings = xchain.keyChain().getAddressStrings()
}

const main = async (): Promise<any> => {
  await InitAvalanche()

  const platformVMUTXOResponse: any = await pchain.getUTXOs(pAddressStrings)
  const utxoSet: UTXOSet = platformVMUTXOResponse.utxos
  const unsignedTx: UnsignedTx = await pchain.buildExportTx(
    utxoSet,
    new BN(1000000000),
    xChainBlockchainID,
    xAddressStrings,
    pAddressStrings,
    pAddressStrings,
    memo,
    asOf,
    locktime,
    threshold
  )
  const tx: Tx = unsignedTx.sign(pKeychain)
  const txid: string = await pchain.issueTx(tx)
  console.log(`Success! TXID: ${txid}`)
}

main()
