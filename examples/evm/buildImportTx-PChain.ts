import { Avalanche, BN } from "@c4tplatform/caminojs/dist"
import { PlatformVMAPI } from "@c4tplatform/caminojs/dist/apis/platformvm"
import {
  EVMAPI,
  KeyChain as EVMKeyChain,
  UnsignedTx,
  Tx,
  UTXOSet
} from "@c4tplatform/caminojs/dist/apis/evm"
import {
  PrivateKeyPrefix,
  DefaultLocalGenesisPrivateKey,
  costImportTx
} from "@c4tplatform/caminojs/dist/utils"
import { ExamplesConfig } from "../common/examplesConfig"
import { KeyChain as PlatformKeyChain } from "@c4tplatform/caminojs/dist/apis/platformvm/keychain"

const config: ExamplesConfig = require("../common/examplesConfig.json")
const avalanche: Avalanche = new Avalanche(
  config.host,
  config.port,
  config.protocol,
  config.networkID
)
const cHexAddress: string = "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC"
const privKey: string = `${PrivateKeyPrefix}${DefaultLocalGenesisPrivateKey}`

let pchain: PlatformVMAPI
let cchain: EVMAPI
let pKeychain: PlatformKeyChain
let cKeychain: EVMKeyChain
let cAddressStrings: string[]
let pChainBlockchainId: string

const InitAvalanche = async () => {
  await avalanche.fetchNetworkSettings()
  pchain = avalanche.PChain()
  cchain = avalanche.CChain()
  pKeychain = pchain.keyChain()
  cKeychain = cchain.keyChain()
  pKeychain.importKey(privKey)
  cKeychain.importKey(privKey)
  cAddressStrings = cchain.keyChain().getAddressStrings()
  pChainBlockchainId = avalanche.getNetwork().P.blockchainID
}

const main = async (): Promise<any> => {
  await InitAvalanche()

  const baseFeeResponse: string = await cchain.getBaseFee()
  const baseFee = new BN(parseInt(baseFeeResponse, 16) / 1e9)
  let fee: BN = baseFee
  const evmUTXOResponse: any = await cchain.getUTXOs(
    cAddressStrings,
    pChainBlockchainId
  )
  const utxoSet: UTXOSet = evmUTXOResponse.utxos
  let unsignedTx: UnsignedTx = await cchain.buildImportTx(
    utxoSet,
    cHexAddress,
    cAddressStrings,
    pChainBlockchainId,
    fee
  )
  const importCost: number = costImportTx(avalanche.getNetwork().C, unsignedTx)
  fee = baseFee.mul(new BN(importCost))

  unsignedTx = await cchain.buildImportTx(
    utxoSet,
    cHexAddress,
    cAddressStrings,
    pChainBlockchainId,
    fee
  )

  const tx: Tx = unsignedTx.sign(cKeychain)
  const txid: string = await cchain.issueTx(tx)
  console.log(`Success! TXID: ${txid}`)
}

main()
