import { Avalanche, BinTools, BN, Buffer } from "@c4tplatform/caminojs/dist"
import {
  AmountOutput,
  AVMAPI,
  BaseTx,
  KeyChain,
  SECPTransferInput,
  SECPTransferOutput,
  TransferableInput,
  TransferableOutput,
  Tx,
  UnsignedTx,
  UTXO,
  UTXOSet
} from "@c4tplatform/caminojs/dist/apis/avm"
import { GetBalanceResponse } from "@c4tplatform/caminojs/dist/apis/avm/interfaces"
import {
  DefaultLocalGenesisPrivateKey,
  PrivateKeyPrefix
} from "@c4tplatform/caminojs/dist/utils"
import { ExamplesConfig } from "../common/examplesConfig"

const config: ExamplesConfig = require("../common/examplesConfig.json")
const bintools: BinTools = BinTools.getInstance()
const avalanche: Avalanche = new Avalanche(
  config.host,
  config.port,
  config.protocol,
  config.networkID
)
const outputs: TransferableOutput[] = []
const inputs: TransferableInput[] = []
const threshold: number = 3
const locktime: BN = new BN(0)
const memo: Buffer = Buffer.from(
  "AVM manual create multisig BaseTx to send AVAX"
)
// Uncomment for codecID 00 01
// const codecID: number = 1

let xchain: AVMAPI
let xKeychain: KeyChain
let xAddresses: Buffer[]
let xAddressStrings: string[]
let avaxAssetID: string
let fee: BN
let xBlockchainID: string
let avaxAssetIDBuf: Buffer
let xBlockchainIDBuf: Buffer

const InitAvalanche = async () => {
  await avalanche.fetchNetworkSettings()
  xchain = avalanche.XChain()
  xKeychain = xchain.keyChain()
  let privKey: string = `${PrivateKeyPrefix}${DefaultLocalGenesisPrivateKey}`
  // X-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p
  xKeychain.importKey(privKey)
  privKey = "PrivateKey-R6e8f5QSa89DjpvL9asNdhdJ4u8VqzMJStPV8VVdDmLgPd8a4"
  // X-local15s7p7mkdev0uajrd0pzxh88kr8ryccztnlmzvj
  xKeychain.importKey(privKey)
  privKey = "PrivateKey-24b2s6EqkBp9bFG5S3Xxi4bjdxFqeRk56ck7QdQArVbwKkAvxz"
  // X-local1aekly2mwnsz6lswd6u0jqvd9u6yddt5884pyuc
  xKeychain.importKey(privKey)
  xAddresses = xKeychain.getAddresses()
  xAddressStrings = xKeychain.getAddressStrings()
  avaxAssetID = avalanche.getNetwork().X.avaxAssetID
  avaxAssetIDBuf = bintools.cb58Decode(avaxAssetID)
  fee = xchain.getDefaultTxFee()
  xBlockchainID = avalanche.getNetwork().X.blockchainID
  xBlockchainIDBuf = bintools.cb58Decode(xBlockchainID)
}

const main = async (): Promise<any> => {
  await InitAvalanche()

  const getBalanceResponse: GetBalanceResponse = await xchain.getBalance(
    xAddressStrings[0],
    avaxAssetID
  )
  const balance: BN = new BN(getBalanceResponse.balance)
  const secpTransferOutput: SECPTransferOutput = new SECPTransferOutput(
    balance.sub(fee),
    xAddresses,
    locktime,
    threshold
  )
  // Uncomment for codecID 00 01
  //   secpTransferOutput.setCodecID(codecID)
  const transferableOutput: TransferableOutput = new TransferableOutput(
    avaxAssetIDBuf,
    secpTransferOutput
  )
  outputs.push(transferableOutput)

  const avmUTXOResponse: any = await xchain.getUTXOs(xAddressStrings)
  const utxoSet: UTXOSet = avmUTXOResponse.utxos
  const utxos: UTXO[] = utxoSet.getAllUTXOs()
  utxos.forEach((utxo: UTXO): void => {
    const amountOutput: AmountOutput = utxo.getOutput() as AmountOutput
    const amt: BN = amountOutput.getAmount().clone()
    const txid: Buffer = utxo.getTxID()
    const outputidx: Buffer = utxo.getOutputIdx()

    const secpTransferInput: SECPTransferInput = new SECPTransferInput(amt)
    // Uncomment for codecID 00 01
    // secpTransferInput.setCodecID(codecID)
    secpTransferInput.addSignatureIdx(0, xAddresses[0])

    const input: TransferableInput = new TransferableInput(
      txid,
      outputidx,
      avaxAssetIDBuf,
      secpTransferInput
    )
    inputs.push(input)
  })

  const baseTx: BaseTx = new BaseTx(
    config.networkID,
    xBlockchainIDBuf,
    outputs,
    inputs,
    memo
  )
  // Uncomment for codecID 00 01
  // baseTx.setCodecID(codecID)
  const unsignedTx: UnsignedTx = new UnsignedTx(baseTx)
  const tx: Tx = unsignedTx.sign(xKeychain)
  const txid: string = await xchain.issueTx(tx)
  console.log(`Success! TXID: ${txid}`)
}
main()
