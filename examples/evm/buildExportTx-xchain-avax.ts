import { Avalanche, BN } from "caminojs/index"
import { AVMAPI, KeyChain as AVMKeyChain } from "caminojs/apis/avm"
import {
  EVMAPI,
  KeyChain as EVMKeyChain,
  Tx,
  UnsignedTx
} from "caminojs/apis/evm"
import { DefaultLocalGenesisPrivateKey, PrivateKeyPrefix } from "caminojs/utils"
import { ExamplesConfig } from "../common/examplesConfig"

const config: ExamplesConfig = require("../common/examplesConfig.json")
const avalanche: Avalanche = new Avalanche(
  config.host,
  config.port,
  config.protocol,
  config.networkID
)
const privKey: string = `${PrivateKeyPrefix}${DefaultLocalGenesisPrivateKey}`
const avaxAssetID: string = avalanche.getNetwork().X.avaxAssetID
const cHexAddress: string = "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC"
const Web3 = require("web3")
const path: string = "/ext/bc/C/rpc"
const web3 = new Web3(
  `${config.protocol}://${config.host}:${config.port}${path}`
)
const threshold: number = 1

let xchain: AVMAPI
let cchain: EVMAPI
let xKeychain: AVMKeyChain
let cKeychain: EVMKeyChain
let xAddressStrings: string[]
let cAddressStrings: string[]
let xChainBlockchainIdStr: string

const InitAvalanche = async () => {
  await avalanche.fetchNetworkSettings()
  xchain = avalanche.XChain()
  cchain = avalanche.CChain()
  xKeychain = xchain.keyChain()
  cKeychain = cchain.keyChain()
  xKeychain.importKey(privKey)
  cKeychain.importKey(privKey)
  xAddressStrings = xchain.keyChain().getAddressStrings()
  cAddressStrings = cchain.keyChain().getAddressStrings()
  xChainBlockchainIdStr = avalanche.getNetwork().X.blockchainID
}

const main = async (): Promise<any> => {
  await InitAvalanche()

  let balance: BN = await web3.eth.getBalance(cHexAddress)
  balance = new BN(balance.toString().substring(0, 17))
  const baseFeeResponse: string = await cchain.getBaseFee()
  const baseFee = new BN(parseInt(baseFeeResponse, 16))
  const txcount = await web3.eth.getTransactionCount(cHexAddress)
  const nonce: number = txcount
  const locktime: BN = new BN(0)
  let avaxAmount: BN = new BN(1e7)
  let fee: BN = baseFee.div(new BN(1e9))
  fee = fee.add(new BN(1e6))

  let unsignedTx: UnsignedTx = await cchain.buildExportTx(
    avaxAmount,
    avaxAssetID,
    xChainBlockchainIdStr,
    cHexAddress,
    cAddressStrings[0],
    xAddressStrings,
    nonce,
    locktime,
    threshold,
    fee
  )

  const tx: Tx = unsignedTx.sign(cKeychain)
  const txid: string = await cchain.issueTx(tx)
  console.log(`Success! TXID: ${txid}`)
}

main()
