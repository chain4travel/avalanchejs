import Mnemonic from "src/utils/mnemonic"
import { Buffer } from "buffer/"
import rdb from "randombytes"

const randomBytes = (size: number) => {
  return Buffer.from(rdb(size))
}
const mnemonic = Mnemonic.getInstance()
const entropy: string =
  "9d7c99e77261acb88a5ed717f625d5d3ed5569e0f60429cc6eb9c4e91f48fb7c"
const langs: string[] = [
  "japanese",
  "spanish",
  "italian",
  "french",
  "korean",
  "czech",
  "portuguese",
  "chinese_traditional",
  "chinese_simplified"
]

const mnemnonics: string[] = [
  "ていし　みっか　せんせい　みっか　えいぶん　さつたば　かいよう　へんたい　うやまう　にちじょう　せっかく　とける　ぶどう　にんぷ　たいうん　はいそう　かえる　したて　なめらか　だじゃれ　だんれつ　てんぼうだい　もくようび　そむく",
  "nueve tenis lágrima tenis baile folleto canica sonoro autor perla jardín oxígeno sensor piscina lonja rabo cañón germen pegar marrón molino opuesto trébol llaga",
  "pergamena tensione maratona tensione becco geco cena srotolato badilata regola lumaca prelievo somma rifasare motivato sarcasmo ceramica ibernato randagio ninfa orafo polmonite tuffato modulo",
  "mobile surface héron surface batterie éthanol capsule serein bafouer pangolin gravir nuisible salive peintre intense préfixe carabine fatal orque label lucide neurone toucher informer",
  "운반 특별 시인 특별 귀신 빗물 농민 취업 구입 작년 스님 이윽고 체험 장애인 아흔 제작 농장 상추 입사 언덕 염려 의외로 학급 씨름",
  "pohnutka vize nikam vize datum ledvina export uklidnit cirkus revolver naslepo procento traverza rozjezd odliv slavnost fajfka lyra rande omluva panovat poukaz vyrvat ochladit",
  "mesada surdina guincho surdina aumentar escrita brilho sediado assador ostentar goela nevoeiro rouco panqueca inovador postal brochura faceta ontem judoca linhagem munido torque indeciso",
  "烯 逮 岩 逮 資 衛 走 賦 料 默 膠 辛 杯 挑 戶 陶 議 劉 拍 謀 浮 休 煩 慮",
  "烯 逮 岩 逮 资 卫 走 赋 料 默 胶 辛 杯 挑 户 陶 议 刘 拍 谋 浮 休 烦 虑"
]

const seeds: string[] = [
  "2ed50c99aa2ee350f0a46c8427d69f9f5c7c5864be7a64ae96695374a0a5a02a3c5075312234f05f8f4c840aa486c99131f84b81c56daff5c31a89cdc7b50424",
  "04c6cfd9337642f47e21e28632f9744fd1b56c57454ebae5c627c2a4b16e47c0948b9c582041bbb1590e128a25ae79d7055ed8aecdbc030920a67205da24846d",
  "c4274544eb6c375d2caa70af8c6a67e3b751c518cbb35244891c7b74a12a5e06d5ce5b925f134930e17f5e86b21146d096715c7645a250dbba1d2ba35bc07317",
  "00e5b5e4785763d6f92fe1ad7c5a7e7dd0fd375bd441473198d2486990ca5a924b5cb6b6831dc94d446c9b3180eefe2d799887bcfc1ee6d8f4f0650e594c9d1b",
  "d8dcc049712867ba7d1bc0e2874d8ec38ee26088d1e2affa10ffac30cf1d0b915bbb6c79bfafbb1db0e8cd66880bf4ba52c53b949f6a3adbba1821dd3045c7cb",
  "a81d8a917861cb8a1ffd2e94452e08fd6dc4d2577bad3ac089f56279521b1c95caebe57ac6c3d126d8abd4d6a3f2c3d8c207bd36fbf75a5e797c5a8f1992c651",
  "b9fc39d7f138a95b8f31436e02a8711b3164cd45a211673f7137429b45faf77a1604682b51803a983638c46a8b2c13237c87ab4b685a1fa5c65700dc7136ccfc",
  "1a5f3eab01276bf7d9b06c42be90fb4b8106b278b4bbaf922f3da6821a63b4d69fa9285fec0936e0f04a1b2a25a65064cd51c111c75063dbe59e4de336b35f85",
  "53bcb9fe403a4a45bee2a2a04dabfa3f2018db349d0e5200175bd345aaa3a3bd45a88a6fb7244914ad156961742f7b4ea7f8ffd83fcae5b1166b73b2ad943f76"
]

interface Vector {
  entropy: string
  mnemonic: string
  seed: string
}

const vectors: Vector[] = [
  {
    entropy: "00000000000000000000000000000000",
    mnemonic:
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about",
    seed: "c55257c360c07c72029aebc1b53c05ed0362ada38ead3e3e9efa3708e53495531f09a6987599d18264c1e1c92f2cf141630c7a3c4ab7c81b2f001698e7463b04"
  },
  {
    entropy: "7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f",
    mnemonic:
      "legal winner thank year wave sausage worth useful legal winner thank yellow",
    seed: "2e8905819b8723fe2c1d161860e5ee1830318dbf49a83bd451cfb8440c28bd6fa457fe1296106559a3c80937a1c1069be3a3a5bd381ee6260e8d9739fce1f607"
  },
  {
    entropy: "80808080808080808080808080808080",
    mnemonic:
      "letter advice cage absurd amount doctor acoustic avoid letter advice cage above",
    seed: "d71de856f81a8acc65e6fc851a38d4d7ec216fd0796d0a6827a3ad6ed5511a30fa280f12eb2e47ed2ac03b5c462a0358d18d69fe4f985ec81778c1b370b652a8"
  },
  {
    entropy: "ffffffffffffffffffffffffffffffff",
    mnemonic: "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong",
    seed: "ac27495480225222079d7be181583751e86f571027b0497b5b5d11218e0a8a13332572917f0f8e5a589620c6f15b11c61dee327651a14c34e18231052e48c069"
  },
  {
    entropy: "000000000000000000000000000000000000000000000000",
    mnemonic:
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon agent",
    seed: "035895f2f481b1b0f01fcf8c289c794660b289981a78f8106447707fdd9666ca06da5a9a565181599b79f53b844d8a71dd9f439c52a3d7b3e8a79c906ac845fa"
  },
  {
    entropy: "7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f",
    mnemonic:
      "legal winner thank year wave sausage worth useful legal winner thank year wave sausage worth useful legal will",
    seed: "f2b94508732bcbacbcc020faefecfc89feafa6649a5491b8c952cede496c214a0c7b3c392d168748f2d4a612bada0753b52a1c7ac53c1e93abd5c6320b9e95dd"
  },
  {
    entropy: "808080808080808080808080808080808080808080808080",
    mnemonic:
      "letter advice cage absurd amount doctor acoustic avoid letter advice cage absurd amount doctor acoustic avoid letter always",
    seed: "107d7c02a5aa6f38c58083ff74f04c607c2d2c0ecc55501dadd72d025b751bc27fe913ffb796f841c49b1d33b610cf0e91d3aa239027f5e99fe4ce9e5088cd65"
  },
  {
    entropy: "ffffffffffffffffffffffffffffffffffffffffffffffff",
    mnemonic:
      "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo when",
    seed: "0cd6e5d827bb62eb8fc1e262254223817fd068a74b5b449cc2f667c3f1f985a76379b43348d952e2265b4cd129090758b3e3c2c49103b5051aac2eaeb890a528"
  },
  {
    entropy: "0000000000000000000000000000000000000000000000000000000000000000",
    mnemonic:
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art",
    seed: "bda85446c68413707090a52022edd26a1c9462295029f2e60cd7c4f2bbd3097170af7a4d73245cafa9c3cca8d561a7c3de6f5d4a10be8ed2a5e608d68f92fcc8"
  },
  {
    entropy: "7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f7f",
    mnemonic:
      "legal winner thank year wave sausage worth useful legal winner thank year wave sausage worth useful legal winner thank year wave sausage worth title",
    seed: "bc09fca1804f7e69da93c2f2028eb238c227f2e9dda30cd63699232578480a4021b146ad717fbb7e451ce9eb835f43620bf5c514db0f8add49f5d121449d3e87"
  },
  {
    entropy: "8080808080808080808080808080808080808080808080808080808080808080",
    mnemonic:
      "letter advice cage absurd amount doctor acoustic avoid letter advice cage absurd amount doctor acoustic avoid letter advice cage absurd amount doctor acoustic bless",
    seed: "c0c519bd0e91a2ed54357d9d1ebef6f5af218a153624cf4f2da911a0ed8f7a09e2ef61af0aca007096df430022f7a2b6fb91661a9589097069720d015e4e982f"
  },
  {
    entropy: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    mnemonic:
      "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo vote",
    seed: "dd48c104698c30cfe2b6142103248622fb7bb0ff692eebb00089b32d22484e1613912f0a5b694407be899ffd31ed3992c456cdf60f5d4564b8ba3f05a69890ad"
  },
  {
    entropy: "77c2b00716cec7213839159e404db50d",
    mnemonic:
      "jelly better achieve collect unaware mountain thought cargo oxygen act hood bridge",
    seed: "b5b6d0127db1a9d2226af0c3346031d77af31e918dba64287a1b44b8ebf63cdd52676f672a290aae502472cf2d602c051f3e6f18055e84e4c43897fc4e51a6ff"
  },
  {
    entropy: "b63a9c59a6e641f288ebc103017f1da9f8290b3da6bdef7b",
    mnemonic:
      "renew stay biology evidence goat welcome casual join adapt armor shuffle fault little machine walk stumble urge swap",
    seed: "9248d83e06f4cd98debf5b6f010542760df925ce46cf38a1bdb4e4de7d21f5c39366941c69e1bdbf2966e0f6e6dbece898a0e2f0a4c2b3e640953dfe8b7bbdc5"
  },
  {
    entropy: "3e141609b97933b66a060dcddc71fad1d91677db872031e85f4c015c5e7e8982",
    mnemonic:
      "dignity pass list indicate nasty swamp pool script soccer toe leaf photo multiply desk host tomato cradle drill spread actor shine dismiss champion exotic",
    seed: "ff7f3184df8696d8bef94b6c03114dbee0ef89ff938712301d27ed8336ca89ef9635da20af07d4175f2bf5f3de130f39c9d9e8dd0472489c19b1a020a940da67"
  },
  {
    entropy: "0460ef47585604c5660618db2e6a7e7f",
    mnemonic:
      "afford alter spike radar gate glance object seek swamp infant panel yellow",
    seed: "65f93a9f36b6c85cbe634ffc1f99f2b82cbb10b31edc7f087b4f6cb9e976e9faf76ff41f8f27c99afdf38f7a303ba1136ee48a4c1e7fcd3dba7aa876113a36e4"
  },
  {
    entropy: "72f60ebac5dd8add8d2a25a797102c3ce21bc029c200076f",
    mnemonic:
      "indicate race push merry suffer human cruise dwarf pole review arch keep canvas theme poem divorce alter left",
    seed: "3bbf9daa0dfad8229786ace5ddb4e00fa98a044ae4c4975ffd5e094dba9e0bb289349dbe2091761f30f382d4e35c4a670ee8ab50758d2c55881be69e327117ba"
  },
  {
    entropy: "2c85efc7f24ee4573d2b81a6ec66cee209b2dcbd09d8eddc51e0215b0b68e416",
    mnemonic:
      "clutch control vehicle tonight unusual clog visa ice plunge glimpse recipe series open hour vintage deposit universe tip job dress radar refuse motion taste",
    seed: "fe908f96f46668b2d5b37d82f558c77ed0d69dd0e7e043a5b0511c48c2f1064694a956f86360c93dd04052a8899497ce9e985ebe0c8c52b955e6ae86d4ff4449"
  },
  {
    entropy: "eaebabb2383351fd31d703840b32e9e2",
    mnemonic:
      "turtle front uncle idea crush write shrug there lottery flower risk shell",
    seed: "bdfb76a0759f301b0b899a1e3985227e53b3f51e67e3f2a65363caedf3e32fde42a66c404f18d7b05818c95ef3ca1e5146646856c461c073169467511680876c"
  },
  {
    entropy: "7ac45cfe7722ee6c7ba84fbc2d5bd61b45cb2fe5eb65aa78",
    mnemonic:
      "kiss carry display unusual confirm curtain upgrade antique rotate hello void custom frequent obey nut hole price segment",
    seed: "ed56ff6c833c07982eb7119a8f48fd363c4a9b1601cd2de736b01045c5eb8ab4f57b079403485d1c4924f0790dc10a971763337cb9f9c62226f64fff26397c79"
  },
  {
    entropy: "4fa1a8bc3e6d80ee1316050e862c1812031493212b7ec3f3bb1b08f168cabeef",
    mnemonic:
      "exile ask congress lamp submit jacket era scheme attend cousin alcohol catch course end lucky hurt sentence oven short ball bird grab wing top",
    seed: "095ee6f817b4c2cb30a5a797360a81a40ab0f9a4e25ecd672a3f58a0b5ba0687c096a6b14d2c0deb3bdefce4f61d01ae07417d502429352e27695163f7447a8c"
  },
  {
    entropy: "18ab19a9f54a9274f03e5209a2ac8a91",
    mnemonic:
      "board flee heavy tunnel powder denial science ski answer betray cargo cat",
    seed: "6eff1bb21562918509c73cb990260db07c0ce34ff0e3cc4a8cb3276129fbcb300bddfe005831350efd633909f476c45c88253276d9fd0df6ef48609e8bb7dca8"
  },
  {
    entropy: "18a2e1d81b8ecfb2a333adcb0c17a5b9eb76cc5d05db91a4",
    mnemonic:
      "board blade invite damage undo sun mimic interest slam gaze truly inherit resist great inject rocket museum chief",
    seed: "f84521c777a13b61564234bf8f8b62b3afce27fc4062b51bb5e62bdfecb23864ee6ecf07c1d5a97c0834307c5c852d8ceb88e7c97923c0a3b496bedd4e5f88a9"
  },
  {
    entropy: "15da872c95a13dd738fbf50e427583ad61f18fd99f628c417a61cf8343c90419",
    mnemonic:
      "beyond stage sleep clip because twist token leaf atom beauty genius food business side grid unable middle armed observe pair crouch tonight away coconut",
    seed: "b15509eaa2d09d3efd3e006ef42151b30367dc6e3aa5e44caba3fe4d3e352e65101fbdb86a96776b91946ff06f8eac594dc6ee1d3e82a42dfe1b40fef6bcc3fd"
  }
]

interface BadMnemonic {
  mnemonic: string
}

const badMnemonics: BadMnemonic[] = [
  {
    mnemonic:
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon"
  },
  {
    mnemonic:
      "legal winner thank year wave sausage worth useful legal winner thank yellow yellow"
  },
  {
    mnemonic:
      "letter advice cage absurd amount doctor acoustic avoid letter advice caged above"
  },
  { mnemonic: "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo, wrong" },
  {
    mnemonic:
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon"
  },
  {
    mnemonic:
      "legal winner thank year wave sausage worth useful legal winner thank year wave sausage worth useful legal will will will"
  },
  {
    mnemonic:
      "letter advice cage absurd amount doctor acoustic avoid letter advice cage absurd amount doctor acoustic avoid letter always."
  },
  {
    mnemonic:
      "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo why"
  },
  {
    mnemonic:
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon art art"
  },
  {
    mnemonic:
      "legal winner thank year wave sausage worth useful legal winner thanks year wave worth useful legal winner thank year wave sausage worth title"
  },
  {
    mnemonic:
      "letter advice cage absurd amount doctor acoustic avoid letters advice cage absurd amount doctor acoustic avoid letter advice cage absurd amount doctor acoustic bless"
  },
  {
    mnemonic:
      "zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo voted"
  },
  {
    mnemonic:
      "jello better achieve collect unaware mountain thought cargo oxygen act hood bridge"
  },
  {
    mnemonic:
      "renew, stay, biology, evidence, goat, welcome, casual, join, adapt, armor, shuffle, fault, little, machine, walk, stumble, urge, swap"
  },
  { mnemonic: "dignity pass list indicate nasty" },

  // From issue 32
  {
    mnemonic:
      "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon letter"
  }
]

const malformedMnemonics: string[] = [
  "a a a a a a a a a a a a a a a a a a a a a a a a a", // Too many words
  "a", // Too few
  "a a a a a a a a a a a a a a" // Not multiple of 3
]

describe("Mnemonic", () => {
  test("vectors", (): void => {
    vectors.forEach(async (vector: Vector, index: number): Promise<void> => {
      const wordlist = mnemonic.getWordlists("english") as string[]
      const entropyToMnemonic: string = mnemonic.entropyToMnemonic(
        vector.entropy,
        wordlist
      )
      expect(vector.mnemonic).toBe(entropyToMnemonic)
      const mnemonicToEntropy: string = mnemonic.mnemonicToEntropy(
        vector.mnemonic,
        wordlist
      )
      expect(mnemonicToEntropy).toBe(vector.entropy)
      const password: string = "TREZOR"
      const mnemonicToSeed: Buffer = Buffer.from(
        await mnemonic.mnemonicToSeed(vector.mnemonic, password)
      )
      expect(mnemonicToSeed.toString("hex")).toBe(vector.seed)
    })
  })

  test("badMnemonics", (): void => {
    const wordlist = mnemonic.getWordlists("english") as string[]
    badMnemonics.forEach((badMnemonic: BadMnemonic, index: number): void => {
      const validateMnemonic: boolean = mnemonic.validateMnemonic(
        badMnemonic.mnemonic,
        wordlist
      )
      expect(validateMnemonic).toBeFalsy()
    })
  })

  test("malformedMnemonics", (): void => {
    const wordlist = mnemonic.getWordlists("english") as string[]
    malformedMnemonics.forEach(
      (malformedMnemonic: string, index: number): void => {
        const validateMnemonic = mnemonic.validateMnemonic(
          malformedMnemonic,
          wordlist
        )
        expect(validateMnemonic).toBeFalsy()
      }
    )
  })

  test("entropyToMnemonic", (): void => {
    langs.forEach((lang: string, index: number): void => {
      const wordlist = mnemonic.getWordlists(lang) as string[]
      const entropyToMnemonic: string = mnemonic.entropyToMnemonic(
        entropy,
        wordlist
      )
      expect(mnemnonics[index]).toBe(entropyToMnemonic)
    })
  })

  test("generateMnemonic", (): void => {
    const strength: number = 256
    langs.forEach((lang: string): void => {
      const wordlist = mnemonic.getWordlists(lang) as string[]
      const m: string = mnemonic.generateMnemonic(
        strength,
        randomBytes,
        wordlist
      )
      expect(typeof m === "string").toBeTruthy()
    })
  })

  test("test mnemonic lengths", (): void => {
    const wordlist = mnemonic.getWordlists("english") as string[]
    let strength: number = 128
    let mnemnnic: string = mnemonic.generateMnemonic(
      strength,
      randomBytes,
      wordlist
    )
    expect(mnemnnic.split(" ").length).toBe(12)
    strength = 160
    mnemnnic = mnemonic.generateMnemonic(strength, randomBytes, wordlist)
    expect(mnemnnic.split(" ").length).toBe(15)
    strength = 192
    mnemnnic = mnemonic.generateMnemonic(strength, randomBytes, wordlist)
    expect(mnemnnic.split(" ").length).toBe(18)
    strength = 224
    mnemnnic = mnemonic.generateMnemonic(strength, randomBytes, wordlist)
    expect(mnemnnic.split(" ").length).toBe(21)
    strength = 256
    mnemnnic = mnemonic.generateMnemonic(strength, randomBytes, wordlist)
    expect(mnemnnic.split(" ").length).toBe(24)
  })

  test("getWordlists", (): void => {
    langs.forEach((lang: string): void => {
      const wordlist = mnemonic.getWordlists(lang) as string[]
      expect(typeof wordlist === "object").toBeTruthy()
    })
  })

  test("mnemonicToEntropy", (): void => {
    mnemnonics.forEach((mnemnnic: string, index: number): void => {
      const wordlist = mnemonic.getWordlists(langs[index]) as string[]
      const mnemonicToEntropy: string = mnemonic.mnemonicToEntropy(
        mnemnnic,
        wordlist
      )
      expect(mnemonicToEntropy).toBe(entropy)
    })
  })

  test("mnemonicToSeed", async (): Promise<void> => {
    mnemnonics.forEach(async (mnemnnic: string): Promise<any> => {
      const password: string = "password"
      const mnemonicToSeed: Buffer = Buffer.from(
        await mnemonic.mnemonicToSeed(mnemnnic, password)
      )
      expect(typeof mnemonicToSeed === "object").toBeTruthy()
    })
  })

  test("mnemonicToSeedSync", (): void => {
    mnemnonics.forEach((mnemnnic: string, index: number): void => {
      const password: string = "password"
      const mnemonicToSeedSync: Buffer = Buffer.from(
        mnemonic.mnemonicToSeedSync(mnemnnic, password)
      )
      expect(mnemonicToSeedSync.toString("hex")).toBe(seeds[index])
    })
  })

  test("validateMnemonic", (): void => {
    mnemnonics.forEach((mnemnnic: string, index: number): void => {
      const wordlist = mnemonic.getWordlists(langs[index]) as string[]
      const validateMnemonic = mnemonic.validateMnemonic(mnemnnic, wordlist)
      expect(validateMnemonic).toBeTruthy()
    })
  })

  test("setDefaultWordlist", (): void => {
    langs.forEach((lang: string, index: number): void => {
      mnemonic.setDefaultWordlist(lang)
      const getDefaultWordlist: string = mnemonic.getDefaultWordlist()
      const wordlist = mnemonic.getWordlists(lang) as string[]
      const m: string = mnemonic.generateMnemonic(256, randomBytes, wordlist)
      expect(getDefaultWordlist).toBe(lang)
      expect(typeof wordlist === "object").toBeTruthy()
      expect(typeof m === "string").toBeTruthy()
    })
  })
})
