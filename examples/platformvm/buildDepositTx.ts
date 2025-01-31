import { Avalanche, Buffer } from "caminojs/index"
import {
  PlatformVMAPI,
  KeyChain,
  UnsignedTx,
  Tx
} from "caminojs/apis/platformvm"
import { OutputOwners } from "caminojs/common/output"
import { PrivateKeyPrefix, DefaultLocalGenesisPrivateKey } from "caminojs/utils"
import { ExamplesConfig } from "../common/examplesConfig"
import BN from "bn.js"

const config: ExamplesConfig = require("../common/examplesConfig.json")
const avalanche: Avalanche = new Avalanche(
  config.host,
  config.port,
  config.protocol,
  config.networkID
)

/**
 * @ignore
 */
let privKey: string = `${PrivateKeyPrefix}${DefaultLocalGenesisPrivateKey}`

let pchain: PlatformVMAPI
let pKeychain: KeyChain
let pAddressStrings: string[]

const InitAvalanche = async () => {
  await avalanche.fetchNetworkSettings()
  pchain = avalanche.PChain()
  pKeychain = pchain.keyChain()
  // P-local18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p
  pKeychain.importKey(privKey)

  pAddressStrings = pchain.keyChain().getAddressStrings()
}

const main = async (): Promise<any> => {
  await InitAvalanche()

  const amountToLock = new BN(1000000000)
  const depositOfferID = "wVVZinZkN9x6e9dh3DNNfrmdXaHPPwKWt3Zerx2vD8Ccuo6E7"
  const depositDuration = 110376000
  const memo: Buffer = Buffer.from(
    "Utility function to create a DepositTx transaction"
  )
  const owners = new OutputOwners(
    pchain.keyChain().getAddresses(),
    undefined,
    1
  )

  const unsignedTx: UnsignedTx = await pchain.buildDepositTx(
    0,
    undefined,
    pAddressStrings,
    pAddressStrings,
    depositOfferID,
    depositDuration,
    owners,
    Buffer.alloc(20),
    [],
    [],
    [],
    memo,
    new BN(0),
    amountToLock
  )

  const tx: Tx = unsignedTx.sign(pKeychain)
  const txid: string = await pchain.issueTx(tx)
  console.log(`Success! TXID: ${txid}`)
}

main()
