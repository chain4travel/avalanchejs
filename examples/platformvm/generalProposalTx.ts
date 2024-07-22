import {
  AddProposalTx,
  GeneralProposal,
  KeyChain,
  PlatformVMAPI,
  UnsignedTx
} from "caminojs/apis/platformvm"
import { Avalanche, BinTools, Buffer } from "caminojs/index"
import { DefaultLocalGenesisPrivateKey, PrivateKeyPrefix } from "caminojs/utils"
import { ExamplesConfig } from "../common/examplesConfig"

const config: ExamplesConfig = require("../common/examplesConfig.json")
const avalanche: Avalanche = new Avalanche(
  config.host,
  config.port,
  config.protocol,
  config.networkID
)
// BEFORE RUNNING THIS EXAMPLE:
// crateUser, importKey to PlatformVM and setAddressState
/**
 * @ignore
 */
let privKey: string = `${PrivateKeyPrefix}${DefaultLocalGenesisPrivateKey}`

let pchain: PlatformVMAPI
let pKeychain: KeyChain
let pAddressStrings: string[]
const bintools: BinTools = BinTools.getInstance()
const InitAvalanche = async () => {
  await avalanche.fetchNetworkSettings()
  pchain = avalanche.PChain()
  pKeychain = pchain.keyChain()
  pKeychain.importKey(privKey)

  pAddressStrings = pchain.keyChain().getAddressStrings()
}

const main = async (): Promise<any> => {
  await InitAvalanche()
  let startDate = new Date()
  startDate.setDate(startDate.getDate() + 1)
  let endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 60)

  let startTimestamp: number = Math.floor(startDate.getTime() / 1000)
  let endTimestamp = Math.floor(endDate.getTime() / 1000)
  const txs = await pchain.getUTXOs(pAddressStrings)
  const proposal = new GeneralProposal(
    startTimestamp,
    endTimestamp,
    1,
    2,
    false
  )
  proposal.addGeneralOption(
    "THIS STRING IS 256 CHARACTERS xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  )
  proposal.addGeneralOption(
    "THIS STRING IS 256 CHARACTERS xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  )
  proposal.addGeneralOption(
    "THIS STRING IS 256 CHARACTERS xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  )

  //proposal.addGeneralOptions(1, 2, 3, 4)

  try {
    let buffer = proposal.toBuffer()
    console.log(buffer)
  } catch (e) {
    console.log(e)
  }

  try {
    let unsignedTx = await pchain.buildAddProposalTx(
      txs.utxos, // utxoset
      pAddressStrings, // fromAddresses
      pAddressStrings, // changeAddresses
      bintools.stringToBuffer("hello world"), // description
      proposal, // proposal
      pKeychain.getAddresses()[0], // proposerAddress
      0, // version
      Buffer.alloc(20) // memo
    )

    const tx = unsignedTx.sign(pKeychain)
    const hex = tx.toStringHex().slice(2)
    const unsignedTx2 = new UnsignedTx()
    unsignedTx2.fromBuffer(Buffer.from(hex, "hex"))

    const addProposalTx = unsignedTx2.getTransaction() as AddProposalTx
    const addProposalTxTypeName: string = addProposalTx.getTypeName()
    const addProposalTxTypeID: number = addProposalTx.getTypeID()

    const generalProposal = addProposalTx.getProposalPayload()

    console.log(addProposalTxTypeID, addProposalTxTypeName)
    console.log(hex)
    //TODO : @VjeraTurk resolve buffer problem
    //couldn't issue tx: bad proposal: trailing buffer space: read 41 provided 44
    //couldn't issue tx: bad proposal: trailing buffer space: read 41 provided 84
    /*    const hex = unsignedTx.getTransaction().toStringHex().slice(2)
    const type = unsignedTx.getTransaction().getTypeID()
    console.log(type)
    console.log(hex)
    try {
      const unsignedTx2 = new UnsignedTx()
      unsignedTx2.fromBuffer(Buffer.from(hex, "hex"))

      const addProposalTx = unsignedTx2.getTransaction() as AddProposalTx
      const generalProposal = addProposalTx
        .getProposalPayload()
        .getProposal() as GeneralProposal

      let allowEarlyFinish = generalProposal.getAllowEarlyFinish()
      console.log(allowEarlyFinish)
    } catch (e) {
      console.log(e)
    }

    const tx = unsignedTx.sign(pKeychain)*/
    //const txid: string = await pchain.issueTx(tx)
    //console.log(`Success! TXID: ${txid}`)
  } catch (e) {
    console.log(e)
  }
}

main()
