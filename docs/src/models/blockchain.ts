export interface Txin {
  n: number
  txid: string
  vout: number
  scriptSig: string
  sequence: string
}
export interface Txout {
  n: number
  value: number
  scriptPubkey: string
}

class BaseBlockchainEntity {
  async calculateHash(hex: string, isReverse: boolean = true): Promise<string> {
    const binaryData = this.hexToBytes(hex)
    const hash1 = await crypto.subtle.digest('SHA-256', binaryData as BufferSource)
    const hash2 = await crypto.subtle.digest('SHA-256', hash1)
    let hashHex = this.bytesToHex(new Uint8Array(hash2))
    if (isReverse) {
      hashHex = this.reverseHex(hashHex)
    }

    return hashHex
  }

  intToHex(d: number): string {
    const buffer = new ArrayBuffer(4)
    const view = new DataView(buffer)
    view.setUint32(0, d, true) // true = little endian
    const bytes = new Uint8Array(buffer)
    return this.bytesToHex(bytes)
  }

  private hexToBytes(hex: string): Uint8Array {
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
    }
    return bytes
  }

  private bytesToHex(bytes: Uint8Array): string {
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }

  reverseHex(hex: string): string {
    const bytes = this.hexToBytes(hex)
    return this.bytesToHex(bytes.reverse())
  }

  generateHex(byteLength: number): string {
    const bytes = new Uint8Array(byteLength)
    crypto.getRandomValues(bytes)
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }
}

export class BlockRequest extends BaseBlockchainEntity {
  constructor(
    public version: number,
    public previous_block_hash: string,
    public time: number,
    public bits: string,
    public nonce: number,
    public merkleroot: string,
    public txids: string[],
  ) {
    super()
  }

  clone(): BlockRequest {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this)
  }

  versionToInt() {
    return this.intToHex(this.version)
  }

  bitsToTarget(): string {
    const bitsNum = BigInt('0x' + this.bits)
    const exponent = Number(bitsNum >> 24n)
    const mantissa = bitsNum & 0x00ffffffn
    let target: bigint
    if (exponent <= 3) {
      target = mantissa >> BigInt(8 * (3 - exponent))
    } else {
      target = mantissa << BigInt(8 * (exponent - 3))
    }
    return target.toString(16).padStart(64, '0')
  }

  getBlockRawData() {
    // リトルエンディアン形式で変換
    const versionLe = this.intToHex(this.version)
    const timeLe = this.intToHex(this.time)
    const nonceLe = this.intToHex(this.nonce)

    // バイト順を反転
    const previousBlockHashLe = this.reverseHex(this.previous_block_hash)
    const bitsLe = this.reverseHex(this.bits)
    const merklerootLe = this.reverseHex(this.merkleroot)

    // 連結して返す
    return versionLe + previousBlockHashLe + merklerootLe + timeLe + bitsLe + nonceLe
  }

  async getHash() {
    const raw = this.getBlockRawData()
    const hash = await this.calculateHash(raw)
    return hash
  }

  selectDifficulty(difficulty: Difficulty) {
    if (difficulty == 'easy') {
      this.bits = '1f0fffff'
    } else if (difficulty == 'normal') {
      this.bits = '1f00ffff'
    } else if (difficulty == 'difficult') {
      this.bits = '1e0fffff'
    } else if (difficulty == 'very difficult') {
      this.bits = '1e00ffff'
    } else if (difficulty == 'impossible') {
      this.bits = '1d00ffff'
    } else {
      this.bits = '1f0fffff'
    }
  }
}

export type Difficulty = 'easy' | 'normal' | 'difficult' | 'very difficult' | 'impossible'

export type ResultStatus = 'success' | 'timeout' | 'cancelled' | null

export class Script {
  constructor() {}
}

// Bitcoin Script Opcodeマッピング表
export const OPCODE_MAP: Record<number, string> = {
  0x00: 'OP_0',
  0x01: 'OP_PUSHBYTES_1',
  0x02: 'OP_PUSHBYTES_2',
  0x03: 'OP_PUSHBYTES_3',
  0x04: 'OP_PUSHBYTES_4',
  0x05: 'OP_PUSHBYTES_5',
  0x06: 'OP_PUSHBYTES_6',
  0x07: 'OP_PUSHBYTES_7',
  0x08: 'OP_PUSHBYTES_8',
  0x09: 'OP_PUSHBYTES_9',
  0x0a: 'OP_PUSHBYTES_10',
  0x0b: 'OP_PUSHBYTES_11',
  0x0c: 'OP_PUSHBYTES_12',
  0x0d: 'OP_PUSHBYTES_13',
  0x0e: 'OP_PUSHBYTES_14',
  0x0f: 'OP_PUSHBYTES_15',
  0x10: 'OP_PUSHBYTES_16',
  0x11: 'OP_PUSHBYTES_17',
  0x12: 'OP_PUSHBYTES_18',
  0x13: 'OP_PUSHBYTES_19',
  0x14: 'OP_PUSHBYTES_20',
  0x15: 'OP_PUSHBYTES_21',
  0x16: 'OP_PUSHBYTES_22',
  0x17: 'OP_PUSHBYTES_23',
  0x18: 'OP_PUSHBYTES_24',
  0x19: 'OP_PUSHBYTES_25',
  0x1a: 'OP_PUSHBYTES_26',
  0x1b: 'OP_PUSHBYTES_27',
  0x1c: 'OP_PUSHBYTES_28',
  0x1d: 'OP_PUSHBYTES_29',
  0x1e: 'OP_PUSHBYTES_30',
  0x1f: 'OP_PUSHBYTES_31',
  0x20: 'OP_PUSHBYTES_32',
  0x21: 'OP_PUSHBYTES_33',
  0x22: 'OP_PUSHBYTES_34',
  0x23: 'OP_PUSHBYTES_35',
  0x24: 'OP_PUSHBYTES_36',
  0x25: 'OP_PUSHBYTES_37',
  0x26: 'OP_PUSHBYTES_38',
  0x27: 'OP_PUSHBYTES_39',
  0x28: 'OP_PUSHBYTES_40',
  0x29: 'OP_PUSHBYTES_41',
  0x2a: 'OP_PUSHBYTES_42',
  0x2b: 'OP_PUSHBYTES_43',
  0x2c: 'OP_PUSHBYTES_44',
  0x2d: 'OP_PUSHBYTES_45',
  0x2e: 'OP_PUSHBYTES_46',
  0x2f: 'OP_PUSHBYTES_47',
  0x30: 'OP_PUSHBYTES_48',
  0x31: 'OP_PUSHBYTES_49',
  0x32: 'OP_PUSHBYTES_50',
  0x33: 'OP_PUSHBYTES_51',
  0x34: 'OP_PUSHBYTES_52',
  0x35: 'OP_PUSHBYTES_53',
  0x36: 'OP_PUSHBYTES_54',
  0x37: 'OP_PUSHBYTES_55',
  0x38: 'OP_PUSHBYTES_56',
  0x39: 'OP_PUSHBYTES_57',
  0x3a: 'OP_PUSHBYTES_58',
  0x3b: 'OP_PUSHBYTES_59',
  0x3c: 'OP_PUSHBYTES_60',
  0x3d: 'OP_PUSHBYTES_61',
  0x3e: 'OP_PUSHBYTES_62',
  0x3f: 'OP_PUSHBYTES_63',
  0x40: 'OP_PUSHBYTES_64',
  0x41: 'OP_PUSHBYTES_65',
  0x42: 'OP_PUSHBYTES_66',
  0x43: 'OP_PUSHBYTES_67',
  0x44: 'OP_PUSHBYTES_68',
  0x45: 'OP_PUSHBYTES_69',
  0x46: 'OP_PUSHBYTES_70',
  0x47: 'OP_PUSHBYTES_71',
  0x48: 'OP_PUSHBYTES_72',
  0x49: 'OP_PUSHBYTES_73',
  0x4a: 'OP_PUSHBYTES_74',
  0x4b: 'OP_PUSHBYTES_75',
  0x4c: 'OP_PUSHDATA1',
  0x4d: 'OP_PUSHDATA2',
  0x4e: 'OP_PUSHDATA4',
  0x4f: 'OP_1NEGATE',
  0x50: 'OP_RESERVED',
  0x51: 'OP_1',
  0x52: 'OP_2',
  0x53: 'OP_3',
  0x54: 'OP_4',
  0x55: 'OP_5',
  0x56: 'OP_6',
  0x57: 'OP_7',
  0x58: 'OP_8',
  0x59: 'OP_9',
  0x5a: 'OP_10',
  0x5b: 'OP_11',
  0x5c: 'OP_12',
  0x5d: 'OP_13',
  0x5e: 'OP_14',
  0x5f: 'OP_15',
  0x60: 'OP_16',

  // Flow control
  0x61: 'OP_NOP',
  0x62: 'OP_VER',
  0x63: 'OP_IF',
  0x64: 'OP_NOTIF',
  0x65: 'OP_VERIF',
  0x66: 'OP_VERNOTIF',
  0x67: 'OP_ELSE',
  0x68: 'OP_ENDIF',
  0x69: 'OP_VERIFY',
  0x6a: 'OP_RETURN',

  // Stack operations
  0x6b: 'OP_TOALTSTACK',
  0x6c: 'OP_FROMALTSTACK',
  0x6d: 'OP_2DROP',
  0x6e: 'OP_2DUP',
  0x6f: 'OP_3DUP',
  0x70: 'OP_2OVER',
  0x71: 'OP_2ROT',
  0x72: 'OP_2SWAP',
  0x73: 'OP_IFDUP',
  0x74: 'OP_DEPTH',
  0x75: 'OP_DROP',
  0x76: 'OP_DUP',
  0x77: 'OP_NIP',
  0x78: 'OP_OVER',
  0x79: 'OP_PICK',
  0x7a: 'OP_ROLL',
  0x7b: 'OP_ROT',
  0x7c: 'OP_SWAP',
  0x7d: 'OP_TUCK',

  // Splice operations (disabled)
  0x7e: 'OP_CAT',
  0x7f: 'OP_SUBSTR',
  0x80: 'OP_LEFT',
  0x81: 'OP_RIGHT',
  0x82: 'OP_SIZE',

  // Bitwise logic (some disabled)
  0x83: 'OP_INVERT',
  0x84: 'OP_AND',
  0x85: 'OP_OR',
  0x86: 'OP_XOR',
  0x87: 'OP_EQUAL',
  0x88: 'OP_EQUALVERIFY',
  0x89: 'OP_RESERVED1',
  0x8a: 'OP_RESERVED2',

  // Arithmetic
  0x8b: 'OP_1ADD',
  0x8c: 'OP_1SUB',
  0x8d: 'OP_2MUL',
  0x8e: 'OP_2DIV',
  0x8f: 'OP_NEGATE',
  0x90: 'OP_ABS',
  0x91: 'OP_NOT',
  0x92: 'OP_0NOTEQUAL',
  0x93: 'OP_ADD',
  0x94: 'OP_SUB',
  0x95: 'OP_MUL',
  0x96: 'OP_DIV',
  0x97: 'OP_MOD',
  0x98: 'OP_LSHIFT',
  0x99: 'OP_RSHIFT',
  0x9a: 'OP_BOOLAND',
  0x9b: 'OP_BOOLOR',
  0x9c: 'OP_NUMEQUAL',
  0x9d: 'OP_NUMEQUALVERIFY',
  0x9e: 'OP_NUMNOTEQUAL',
  0x9f: 'OP_LESSTHAN',
  0xa0: 'OP_GREATERTHAN',
  0xa1: 'OP_LESSTHANOREQUAL',
  0xa2: 'OP_GREATERTHANOREQUAL',
  0xa3: 'OP_MIN',
  0xa4: 'OP_MAX',
  0xa5: 'OP_WITHIN',

  // Crypto
  0xa6: 'OP_RIPEMD160',
  0xa7: 'OP_SHA1',
  0xa8: 'OP_SHA256',
  0xa9: 'OP_HASH160',
  0xaa: 'OP_HASH256',
  0xab: 'OP_CODESEPARATOR',
  0xac: 'OP_CHECKSIG',
  0xad: 'OP_CHECKSIGVERIFY',
  0xae: 'OP_CHECKMULTISIG',
  0xaf: 'OP_CHECKMULTISIGVERIFY',

  // Locktime
  0xb0: 'OP_NOP1',
  0xb1: 'OP_CHECKLOCKTIMEVERIFY',
  0xb2: 'OP_CHECKSEQUENCEVERIFY',
  0xb3: 'OP_NOP4',
  0xb4: 'OP_NOP5',
  0xb5: 'OP_NOP6',
  0xb6: 'OP_NOP7',
  0xb7: 'OP_NOP8',
  0xb8: 'OP_NOP9',
  0xb9: 'OP_NOP10',
  0xba: 'OP_CHECKSIGADD',

  // Reserved opcodes (OP_RETURN_187 to OP_RETURN_254)
  0xbb: 'OP_RETURN_187',
  0xbc: 'OP_RETURN_188',
  0xbd: 'OP_RETURN_189',
  0xbe: 'OP_RETURN_190',
  0xbf: 'OP_RETURN_191',
  0xc0: 'OP_RETURN_192',
  0xc1: 'OP_RETURN_193',
  0xc2: 'OP_RETURN_194',
  0xc3: 'OP_RETURN_195',
  0xc4: 'OP_RETURN_196',
  0xc5: 'OP_RETURN_197',
  0xc6: 'OP_RETURN_198',
  0xc7: 'OP_RETURN_199',
  0xc8: 'OP_RETURN_200',
  0xc9: 'OP_RETURN_201',
  0xca: 'OP_RETURN_202',
  0xcb: 'OP_RETURN_203',
  0xcc: 'OP_RETURN_204',
  0xcd: 'OP_RETURN_205',
  0xce: 'OP_RETURN_206',
  0xcf: 'OP_RETURN_207',
  0xd0: 'OP_RETURN_208',
  0xd1: 'OP_RETURN_209',
  0xd2: 'OP_RETURN_210',
  0xd3: 'OP_RETURN_211',
  0xd4: 'OP_RETURN_212',
  0xd5: 'OP_RETURN_213',
  0xd6: 'OP_RETURN_214',
  0xd7: 'OP_RETURN_215',
  0xd8: 'OP_RETURN_216',
  0xd9: 'OP_RETURN_217',
  0xda: 'OP_RETURN_218',
  0xdb: 'OP_RETURN_219',
  0xdc: 'OP_RETURN_220',
  0xdd: 'OP_RETURN_221',
  0xde: 'OP_RETURN_222',
  0xdf: 'OP_RETURN_223',
  0xe0: 'OP_RETURN_224',
  0xe1: 'OP_RETURN_225',
  0xe2: 'OP_RETURN_226',
  0xe3: 'OP_RETURN_227',
  0xe4: 'OP_RETURN_228',
  0xe5: 'OP_RETURN_229',
  0xe6: 'OP_RETURN_230',
  0xe7: 'OP_RETURN_231',
  0xe8: 'OP_RETURN_232',
  0xe9: 'OP_RETURN_233',
  0xea: 'OP_RETURN_234',
  0xeb: 'OP_RETURN_235',
  0xec: 'OP_RETURN_236',
  0xed: 'OP_RETURN_237',
  0xee: 'OP_RETURN_238',
  0xef: 'OP_RETURN_239',
  0xf0: 'OP_RETURN_240',
  0xf1: 'OP_RETURN_241',
  0xf2: 'OP_RETURN_242',
  0xf3: 'OP_RETURN_243',
  0xf4: 'OP_RETURN_244',
  0xf5: 'OP_RETURN_245',
  0xf6: 'OP_RETURN_246',
  0xf7: 'OP_RETURN_247',
  0xf8: 'OP_RETURN_248',
  0xf9: 'OP_RETURN_249',
  0xfa: 'OP_RETURN_250',
  0xfb: 'OP_RETURN_251',
  0xfc: 'OP_RETURN_252',
  0xfd: 'OP_RETURN_253',
  0xfe: 'OP_RETURN_254',
  0xff: 'OP_INVALIDOPCODE',
} as const

// 逆引き用マッピング(opcodeから16進数へ)
export const REVERSE_OPCODE_MAP: Record<string, number> = Object.fromEntries(
  Object.entries(OPCODE_MAP).map(([key, value]) => [value, parseInt(key)]),
)

export function getOpcodeName(hex: number): string | undefined {
  return OPCODE_MAP[hex]
}

export function getOpcodeHex(name: string): number | undefined {
  return REVERSE_OPCODE_MAP[name]
}

export function getOpcodeHexString(name: string): string | undefined {
  const hex = REVERSE_OPCODE_MAP[name]
  return hex !== undefined ? hex.toString(16).padStart(2, '0') : undefined
}

/**
 * Bitcoin ScriptのASM形式を16進数に変換
 * @param script - スペース区切りのopcode文字列 (例: "OP_DUP OP_HASH160 OP_PUSHBYTES_20 89abcdef... OP_EQUALVERIFY OP_CHECKSIG")
 * @returns 16進数文字列
 */
/**
 * Bitcoin ScriptのASM形式を16進数に変換
 * @param script - スペース区切りのopcode文字列
 * @param includeLength - trueの場合、先頭にスクリプト長(VarInt)を含める
 * @returns 16進数文字列
 */
export function scriptToHex(script: string, includeLength: boolean = false): string {
  const tokens = script.trim().split(/\s+/)
  let hexResult = ''
  let i = 0

  while (i < tokens.length) {
    const token = tokens[i]
    const opcodeHex = getOpcodeHex(token)

    if (opcodeHex !== undefined) {
      const hexString = opcodeHex.toString(16).padStart(2, '0')
      hexResult += hexString

      // Push Data opcodeの場合、後続のデータを処理
      if (opcodeHex >= 0x01 && opcodeHex <= 0x4b) {
        // OP_PUSHBYTES_1 to OP_PUSHBYTES_75
        i++
        if (i < tokens.length) {
          const dataBytes = tokens[i]
          hexResult += dataBytes
        }
      } else if (opcodeHex === 0x4c) {
        // OP_PUSHDATA1
        i++
        if (i < tokens.length) {
          const lengthByte = tokens[i]
          hexResult += lengthByte
          i++
          if (i < tokens.length) {
            const dataBytes = tokens[i]
            hexResult += dataBytes
          }
        }
      } else if (opcodeHex === 0x4d) {
        // OP_PUSHDATA2
        i++
        if (i < tokens.length) {
          const lengthBytes = tokens[i]
          hexResult += lengthBytes
          i++
          if (i < tokens.length) {
            const dataBytes = tokens[i]
            hexResult += dataBytes
          }
        }
      } else if (opcodeHex === 0x4e) {
        // OP_PUSHDATA4
        i++
        if (i < tokens.length) {
          const lengthBytes = tokens[i]
          hexResult += lengthBytes
          i++
          if (i < tokens.length) {
            const dataBytes = tokens[i]
            hexResult += dataBytes
          }
        }
      }
    } else {
      // opcodeとして認識できない場合は16進数データとして扱う
      hexResult += token
    }

    i++
  }

  // スクリプト長を含める場合
  if (includeLength) {
    const scriptLength = hexResult.length / 2
    const lengthPrefix = encodeVarInt(scriptLength)
    return lengthPrefix + hexResult
  }

  return hexResult
}

/**
 * VarInt形式でエンコード
 * @param value - エンコードする値
 * @returns VarInt形式の16進数文字列
 */
export function encodeVarInt(value: number): string {
  if (value < 0xfd) {
    // 1バイト
    return value.toString(16).padStart(2, '0')
  } else if (value <= 0xffff) {
    // 0xfd + 2バイト(little-endian)
    const hex = value.toString(16).padStart(4, '0')
    return 'fd' + hex.slice(2, 4) + hex.slice(0, 2)
  } else if (value <= 0xffffffff) {
    // 0xfe + 4バイト(little-endian)
    const hex = value.toString(16).padStart(8, '0')
    return 'fe' + hex.slice(6, 8) + hex.slice(4, 6) + hex.slice(2, 4) + hex.slice(0, 2)
  } else {
    // 0xff + 8バイト(little-endian)
    const hex = value.toString(16).padStart(16, '0')
    return (
      'ff' +
      hex.slice(14, 16) +
      hex.slice(12, 14) +
      hex.slice(10, 12) +
      hex.slice(8, 10) +
      hex.slice(6, 8) +
      hex.slice(4, 6) +
      hex.slice(2, 4) +
      hex.slice(0, 2)
    )
  }
}

/**
 * VarIntをデコード
 * @param hex - VarInt形式の16進数文字列
 * @returns { value: デコードされた値, bytes: 消費したバイト数 }
 */
export function decodeVarInt(hex: string): { value: number; bytes: number } {
  const firstByte = parseInt(hex.slice(0, 2), 16)

  if (firstByte < 0xfd) {
    return { value: firstByte, bytes: 1 }
  } else if (firstByte === 0xfd) {
    // 2バイト(little-endian)
    const value = parseInt(hex.slice(4, 6) + hex.slice(2, 4), 16)
    return { value, bytes: 3 }
  } else if (firstByte === 0xfe) {
    // 4バイト(little-endian)
    const value = parseInt(
      hex.slice(8, 10) + hex.slice(6, 8) + hex.slice(4, 6) + hex.slice(2, 4),
      16,
    )
    return { value, bytes: 5 }
  } else {
    // 8バイト(little-endian)
    const value = parseInt(
      hex.slice(16, 18) +
        hex.slice(14, 16) +
        hex.slice(12, 14) +
        hex.slice(10, 12) +
        hex.slice(8, 10) +
        hex.slice(6, 8) +
        hex.slice(4, 6) +
        hex.slice(2, 4),
      16,
    )
    return { value, bytes: 9 }
  }
}

/**
 * データ長に応じて適切なPush Data opcodeを自動選択してスクリプトを生成
 * @param data - 16進数データ文字列
 * @returns ASM形式のスクリプト
 */
export function createPushDataScript(data: string): string {
  const dataLength = data.length / 2 // バイト数

  if (dataLength === 0) {
    return 'OP_0'
  }

  if (dataLength >= 1 && dataLength <= 75) {
    // OP_PUSHBYTES_X
    const opcodeNum = dataLength
    const opcodeName = getOpcodeName(opcodeNum)
    return `${opcodeName} ${data}`
  } else if (dataLength >= 76 && dataLength <= 255) {
    // OP_PUSHDATA1
    const lengthByte = dataLength.toString(16).padStart(2, '0')
    return `OP_PUSHDATA1 ${lengthByte} ${data}`
  } else if (dataLength >= 256 && dataLength <= 65535) {
    // OP_PUSHDATA2 (little-endian)
    const lengthHex = dataLength.toString(16).padStart(4, '0')
    const lengthLE = lengthHex.slice(2, 4) + lengthHex.slice(0, 2)
    return `OP_PUSHDATA2 ${lengthLE} ${data}`
  } else if (dataLength >= 65536 && dataLength <= 520) {
    // OP_PUSHDATA4 (little-endian)
    // 注: Bitcoinでは実際には520バイトまでしかpushできない
    const lengthHex = dataLength.toString(16).padStart(8, '0')
    const lengthLE =
      lengthHex.slice(6, 8) + lengthHex.slice(4, 6) + lengthHex.slice(2, 4) + lengthHex.slice(0, 2)
    return `OP_PUSHDATA4 ${lengthLE} ${data}`
  }

  throw new Error(`Data length ${dataLength} bytes exceeds maximum of 520 bytes`)
}

/**
 * 16進数をリトルエンディアンに変換
 * @param hex - 16進数文字列
 * @param bytes - バイト数 (2, 4, 8など)
 * @returns リトルエンディアン形式の16進数文字列
 */
export function toLittleEndian(value: number, bytes: number): string {
  const hex = value.toString(16).padStart(bytes * 2, '0')
  let result = ''
  for (let i = hex.length - 2; i >= 0; i -= 2) {
    result += hex.slice(i, i + 2)
  }
  return result
}


export async function generateKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256" // または "P-384", "P-521"
    },
    true, // extractable
    ["sign", "verify"]
  );
  
  // 秘密鍵をエクスポート
  const privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  const privateKeyHex = arrayBufferToHex(privateKey);
  
  // 公開鍵をエクスポート
  const publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
  const publicKeyHex = arrayBufferToHex(publicKey);
  
  return {
    privateKey: privateKeyHex,
    publicKey: publicKeyHex,
    privateKeyRaw: keyPair.privateKey,
    publicKeyRaw: keyPair.publicKey
  };
}

// ArrayBufferを16進数文字列に変換
function arrayBufferToHex(buffer:ArrayBuffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function generatePublicKeyHash(publicKeyHex: string): Promise<string> {
  const publicKeyBytes = hexToBytes(publicKeyHex);
  const inputBytes = new Uint8Array(publicKeyBytes);
  const hash1 = await crypto.subtle.digest('SHA-256', inputBytes);
  const hash2 = await crypto.subtle.digest('SHA-256', hash1);
  const hash160 = new Uint8Array(hash2).slice(0, 20);
  return bytesToHex(hash160);
}

export async function hash256Hex(hexString: string,isReverse:boolean=true): Promise<string> {
  const data = hexToBytes(hexString);
  const inputBytes = new Uint8Array(data);
  const hash1 = await crypto.subtle.digest('SHA-256', inputBytes );
  const hash2 = await crypto.subtle.digest('SHA-256', hash1);
  const hash256=isReverse?hexToLittleEndian(bytesToHex(new Uint8Array(hash2))):bytesToHex(new Uint8Array(hash2))

  return hash256;
}

// 16進数文字列 → Uint8Array
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

// Uint8Array → 16進数文字列
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export const hexToLittleEndian = (hex: string) => {
    if (hex.length % 2 !== 0) hex = '0' + hex;
    return hex.match(/.{2}/g)?.reverse().join('') ?? hex;
  }



//ここから
export class Base {
  /**
   * SHA-256を2回適用してハッシュ化
   */
  async hash256HexAsync(hexString: string, isLittle: boolean = true): Promise<string> {
    const data = this.hexToBuffer(hexString);
    const inputBytes = new Uint8Array(data);
    const hash1 = await crypto.subtle.digest('SHA-256', inputBytes);
    const hash2 = await crypto.subtle.digest('SHA-256', hash1);
    let hash256 = this.bufferToHex(hash2);
    
    if (isLittle) {
      hash256 = this.hexToLittleEndian(hash256);
    }
    return hash256;
  }


  /**
   * 16進数文字列をBufferに変換
   */
  private hexToBuffer(hexString: string): Uint8Array {
    const bytes = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
      bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }
    return bytes;
  }

  /**
   * BufferまたはArrayBufferを16進数文字列に変換
   */
  private bufferToHex(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * 16進数文字列をリトルエンディアンに変換
   */
  hexToLittleEndian(hexString: string): string {
    const bytes = this.hexToBuffer(hexString);
    return this.bufferToHex(bytes.reverse());
  }

  /**
   * 整数を16進数文字列に変換
   */
  intToHex(num: number, byteSize: number, isLittle: boolean = true): string {
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    view.setBigUint64(0, BigInt(num), isLittle);
    
    const bytes = new Uint8Array(buffer).slice(0, byteSize);
    return this.bufferToHex(bytes);
  }

  /**
   * 16進数文字列を整数に変換
   */
  hexToInt(hexString: string, isLittle: boolean = true): number {
    const bytes = this.hexToBuffer(hexString);
    const buffer = new ArrayBuffer(8);
    const view = new DataView(buffer);
    
    // パディング
    const paddedBytes = new Uint8Array(8);
    if (isLittle) {
      paddedBytes.set(bytes, 0);
    } else {
      paddedBytes.set(bytes, 8 - bytes.length);
    }
    
    for (let i = 0; i < 8; i++) {
      view.setUint8(i, paddedBytes[i]);
    }
    
    return Number(view.getBigUint64(0, isLittle));
  }

  /**
   * 整数をCompact Size形式に変換
   */
  intToCompactSize(value: number): string {
    if (value < 0) {
      throw new Error('値は0以上である必要があります');
    }
    
    if (value < 253) {
      return this.intToHex(value, 1);
    } else if (value <= 0xFFFF) {
      return 'fd' + this.intToHex(value, 2);
    } else if (value <= 0xFFFFFFFF) {
      return 'fe' + this.intToHex(value, 4);
    } else if (value <= 0xFFFFFFFFFFFFFFFF) {
      return 'ff' + this.intToHex(value, 8);
    } else {
      throw new Error(`値が大きすぎます: ${value}`);
    }
  }

  /**
   * Compact Size形式を整数に変換
   */
  compactSizeToInt(data: string): number {
    if (data.length === 0) {
      throw new Error('データが空です');
    }
    
    const leadingByte = parseInt(data.substring(0, 2), 16);
    
    if (data.length === 2) {
      if (leadingByte < 0xFD) {
        return leadingByte;
      } else {
        throw new Error(
          `compact sizeの形式が不正です。2桁の場合は0xFD未満である必要があります: ${data}`
        );
      }
    } else if (data.length === 6) {
      if (leadingByte !== 0xFD) {
        throw new Error(
          `compact sizeの形式が不正です。6桁の場合は先頭が0xFDである必要があります: ${data}`
        );
      }
      return this.hexToInt(data.substring(2));
    } else if (data.length === 10) {
      if (leadingByte !== 0xFE) {
        throw new Error(
          `compact sizeの形式が不正です。10桁の場合は先頭が0xFEである必要があります: ${data}`
        );
      }
      return this.hexToInt(data.substring(2));
    } else if (data.length === 18) {
      if (leadingByte !== 0xFF) {
        throw new Error(
          `compact sizeの形式が不正です。18桁の場合は先頭が0xFFである必要があります: ${data}`
        );
      }
      return this.hexToInt(data.substring(2));
    } else {
      throw new Error(
        `compact sizeの桁数は2,6,10,18桁である必要があります。実際: ${data.length}桁, データ: ${data}`
      );
    }
  }
}

export type ScriptType =
  | 'P2PK'
  | 'P2PKH'
  | 'P2MS'
  | 'P2SH'
  | 'OP_RETURN'
  | 'P2WPKH'
  | 'P2WSH'
  | 'P2TR'
  | 'CUSTOM'
  | 'COINBASE';

export interface TransactionVinData {
  utxoBlockHash?: string | null;
  utxoTxid: string;
  utxoVout: number;
  utxoScriptPubkey?: string | null;
  sequence: number;
  scriptSigAsm?: string | null;
  scriptSigHex?: string | null;
  scriptType?: ScriptType | null;
  spentBlockHash?: string | null;
  spentTxid?: string | null;
  spentWitness?: string | null;
  n?: number | null;
}

export class TransactionVin extends Base {
  utxoBlockHash?: string | null;
  utxoTxid: string;
  utxoVout: number;
  utxoScriptPubkey?: string | null;
  sequence: number;
  scriptSigAsm?: string | null;
  scriptSigHex?: string | null;
  scriptType?: ScriptType | null;
  spentBlockHash?: string | null;
  spentTxid?: string | null;
  spentWitness?: string | null;
  n?: number | null;

  constructor(data: TransactionVinData) {
    super();
    this.utxoBlockHash = data.utxoBlockHash;
    this.utxoTxid = data.utxoTxid;
    this.utxoVout = data.utxoVout;
    this.utxoScriptPubkey = data.utxoScriptPubkey;
    this.sequence = data.sequence;
    this.scriptSigAsm = data.scriptSigAsm;
    this.scriptSigHex = data.scriptSigHex;
    this.scriptType = data.scriptType;
    this.spentBlockHash = data.spentBlockHash;
    this.spentTxid = data.spentTxid;
    this.spentWitness = data.spentWitness;
    this.n = data.n;
  }

  isCoinbase(): boolean {
    return this.utxoTxid === '0'.repeat(64) && this.utxoVout === 0xFFFFFFFF;
  }

  getRawData(): string {
    const utxoTxidLe = this.hexToLittleEndian(this.utxoTxid);
    const utxoVoutLe = this.intToHex(this.utxoVout, 4);
    const scriptSize = this.intToCompactSize((this.scriptSigHex?.length ?? 0) / 2);
    const sequenceLe = this.intToHex(this.sequence, 4);

    return utxoTxidLe + utxoVoutLe + scriptSize + (this.scriptSigHex ?? '') + sequenceLe;
  }

  getUnsignedData(isTarget: boolean = true): string {
    if (isTarget && !this.utxoScriptPubkey) {
      throw new Error(
        `署名検証のためにutxo_script_pubkeyをセットしてください,txid:${this.spentTxid},vin_n:${this.n}`
      );
    }
    
    const utxoTxidLe = this.hexToLittleEndian(this.utxoTxid);
    const utxoVoutLe = this.intToHex(this.utxoVout, 4);
    const scriptSize = isTarget
      ? this.intToCompactSize((this.utxoScriptPubkey?.length ?? 0) / 2)
      : '00';
    const scriptPubkey = isTarget ? (this.utxoScriptPubkey ?? '') : '';
    const sequenceLe = this.intToHex(this.sequence, 4);

    return utxoTxidLe + utxoVoutLe + scriptSize + scriptPubkey + sequenceLe;
  }
}

export interface TransactionOutputData {
  value: number;
  scriptPubkeyAsm?: string | null;
  scriptPubkeyHex?: string | null;
  scriptType?: ScriptType | null;
  blockHash?: string | null;
  txid?: string | null;
  n?: number | null;
}

export class TransactionOutput extends Base {
  value: number;
  scriptPubkeyAsm?: string | null;
  scriptPubkeyHex?: string | null;
  scriptType?: ScriptType | null;
  blockHash?: string | null;
  txid?: string | null;
  n?: number | null;

  constructor(data: TransactionOutputData) {
    super();
    this.value = data.value;
    this.scriptPubkeyAsm = data.scriptPubkeyAsm;
    this.scriptPubkeyHex = data.scriptPubkeyHex;
    this.scriptType = data.scriptType;
    this.blockHash = data.blockHash;
    this.txid = data.txid;
    this.n = data.n;
  }

  getRawData(): string {
    const valueHex = this.intToHex(this.value, 8);
    const scriptSize = this.intToCompactSize((this.scriptPubkeyHex?.length ?? 0) / 2);

    return valueHex + scriptSize + (this.scriptPubkeyHex ?? '');
  }
}

export interface TransactionData {
  txid: string;
  blockHeight?: number | null;
  blockHash?: string | null;
  wtxid?: string | null;
  version: number;
  size?: number | null;
  weight?: number | null;
  locktime: number;
  vin?: TransactionVinData[];
  outputs?: TransactionOutputData[];
}

export class Transaction extends Base {
  txid: string;
  blockHeight?: number | null;
  blockHash?: string | null;
  wtxid?: string | null;
  version: number;
  size?: number | null;
  weight?: number | null;
  locktime: number;
  vin: TransactionVin[];
  outputs: TransactionOutput[];

  constructor(data: TransactionData) {
    super();
    this.txid = data.txid;
    this.blockHeight = data.blockHeight;
    this.blockHash = data.blockHash;
    this.wtxid = data.wtxid;
    this.version = data.version;
    this.size = data.size;
    this.weight = data.weight;
    this.locktime = data.locktime;
    this.vin = (data.vin ?? []).map(v => new TransactionVin(v));
    this.outputs = (data.outputs ?? []).map(o => new TransactionOutput(o));
    
    this.updateOptionalFields();
    this.validateHash();
  }

  private updateOptionalFields(): void {
    this.vin.forEach((vin, i) => {
      vin.spentTxid = this.txid;
      vin.n = i;
    });

    this.outputs.forEach((out, i) => {
      out.txid = this.txid;
      out.n = i;
    });
  }

  private async validateHash() {
    const raw = this.getRawData();
    const calHash =await this.hash256HexAsync(raw);
    
    if (this.txid !== calHash) {
      throw new Error(
        `txidが正しくないです。与えられたhash:${this.txid},計算されたhash:${calHash},計算元hash:${raw}`
      );
    }
  }

  getRawData(): string {
    const versionLe = this.intToHex(this.version, 4);
    const vinCount = this.intToCompactSize(this.vin.length);
    const vinRawData = this.vin.map(vin => vin.getRawData()).join('');
    const voutCount = this.intToCompactSize(this.outputs.length);
    const voutRawData = this.outputs.map(vout => vout.getRawData()).join('');
    const locktimeLe = this.intToHex(this.locktime, 4);

    return versionLe + vinCount + vinRawData + voutCount + voutRawData + locktimeLe;
  }

  isCoinbase(): boolean {
    return this.vin.length > 0 && this.vin[0].isCoinbase();
  }

  getHashRawMessage(targetIndex: number, sighash: number = 0x01): string {
    const versionLe = this.intToHex(this.version, 4);
    const vinCount = this.intToCompactSize(this.vin.length);
    const inputRaw = this.vin
      .map((vin, i) => vin.getUnsignedData(targetIndex === i))
      .join('');
    const voutCount = this.intToCompactSize(this.outputs.length);
    const voutRawData = this.outputs.map(vout => vout.getRawData()).join('');
    const locktimeLe = this.intToHex(this.locktime, 4);
    const sighashHex = this.intToHex(sighash, 4);

    return (
      versionLe +
      vinCount +
      inputRaw +
      voutCount +
      voutRawData +
      locktimeLe +
      sighashHex
    );
  }
}

export interface BlockData {
  hash: string;
  height?: number | null;
  version: number;
  previousHash: string;
  merkleRoot: string;
  timestamp: number;
  bits: string;
  nonce: number;
  transactionCount?: number | null;
  transactions: TransactionData[];
}

export class Block extends Base {
  hash: string;
  height?: number | null;
  version: number;
  previousHash: string;
  merkleRoot: string;
  timestamp: number;
  bits: string;
  nonce: number;
  transactionCount?: number | null;
  transactions: Transaction[];

  constructor(data: BlockData) {
    super();
    this.hash = data.hash;
    this.height = data.height;
    this.version = data.version;
    this.previousHash = data.previousHash;
    this.merkleRoot = data.merkleRoot;
    this.timestamp = data.timestamp;
    this.bits = data.bits;
    this.nonce = data.nonce;
    this.transactionCount = data.transactionCount;
    this.transactions = data.transactions.map(t => new Transaction(t));

    // this.validateHash();
    // this.validateMerkleRoot();
    // this.validateBits();
    // this.updateOptionalFields();
  }

   private async validateHash() {
    const raw = this.getRawData();
    const calHash = await this.hash256HexAsync(raw);
    
    if (this.hash !== calHash) {
      throw new Error(
        `hashが正しくないです。与えられたhash:${this.hash},計算されたhash:${calHash},計算元hash:${raw}`
      );
    }
  }

  private async validateMerkleRoot() {
    const txids = this.transactions.map(t => t.txid);
    const calMerkleRoot =await  this.getMerkleRoot(txids);
    
    if (this.merkleRoot !== calMerkleRoot) {
      const txidsStr = txids.join(' ');
      throw new Error(
        `merkle_rootが正しくないです。` +
        `与えられたmerkle_root:${this.merkleRoot}, ` +
        `計算されたmerkle_root:${calMerkleRoot}, ` +
        `計算元merkle_root:${txidsStr}`
      );
    }
  }

  private validateBits(): void {
    const target = this.bitsToTarget();
    const hashInt = BigInt('0x' + this.hash);
    const targetInt = BigInt('0x' + target);

    if (hashInt > targetInt) {
      throw new Error(
        `与えられたhashはtargetより高いです。` +
        `与えられたhash: ${this.hash}, target: ${target}`
      );
    }
  }

  private updateOptionalFields(): void {
    this.transactionCount = this.transactions.length;

    this.transactions.forEach(t => {
      t.blockHeight = this.height ?? undefined;
      t.blockHash = this.hash;

      t.vin.forEach(vin => {
        vin.spentBlockHash = this.hash;
      });

      t.outputs.forEach(out => {
        out.blockHash = this.hash;
      });
    });
  }

  getRawData(): string {
    const versionHex = this.intToHex(this.version, 4);
    const previousHashLe = this.hexToLittleEndian(this.previousHash);
    const merkleRootLe = this.hexToLittleEndian(this.merkleRoot);
    const bitsLe = this.hexToLittleEndian(this.bits);
    const nonceHex = this.intToHex(this.nonce, 4);
    const timeHex = this.intToHex(this.timestamp, 4);

    return (
      versionHex +
      previousHashLe +
      merkleRootLe +
      timeHex +
      bitsLe +
      nonceHex
    );
  }

  async getMerkleRoot(txids: string[]): Promise<string> {
  if (txids.length === 1) {
    return txids[0];
  }

  const result: string[] = [];

  for (let i = 0; i < txids.length; i += 2) {
    const one = this.hexToLittleEndian(txids[i]);
    let concat: string;
    
    if (i + 1 < txids.length) {
      const two = this.hexToLittleEndian(txids[i + 1]);
      concat = one + two;
    } else {
      concat = one + one;
    }

    const hash = await this.hash256HexAsync(concat);  // await を明示的に
    result.push(hash);
  }

  return this.getMerkleRoot(result);  // await 追加
}

  bitsToTarget(): string {
  const bitsNum = parseInt(this.bits, 16);
  const exponent = bitsNum >> 24;
  const mantissa = bitsNum & 0x00FFFFFF;

  let target: bigint;
  if (exponent <= 3) {
    target = BigInt(mantissa) >> BigInt(8 * (3 - exponent));
  } else {
    target = BigInt(mantissa) << BigInt(8 * (exponent - 3));
  }

  return target.toString(16).padStart(64, '0');
}

  toPostData() {
    return {
      hash: this.hash,
      version: this.version,
      previousHash: this.previousHash,
      merkleRoot: this.merkleRoot,
      timestamp: this.timestamp,
      bits: this.bits,
      nonce: this.nonce,
      transactions: this.transactions.map(t => ({
        txid: t.txid,
        version: t.version,
        locktime: t.locktime,
        vin: t.vin.map(vin => ({
          utxoTxid: vin.utxoTxid,
          utxoVout: vin.utxoVout,
          sequence: vin.sequence,
          scriptSigHex: vin.scriptSigHex,
        })),
        outputs: t.outputs.map(out => ({
          value: out.value,
          scriptPubkeyHex: out.scriptPubkeyHex,
        })),
      })),
    };
  }
}