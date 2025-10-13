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

  generateHex(byteLength:number): string {
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

  selectDifficulty(difficulty:Difficulty) {
        if (difficulty=="easy"){
          this.bits="1f0fffff"
        }else if(difficulty=="normal"){
          this.bits="1f00ffff"
        }else if(difficulty=="difficult"){
          this.bits="1e0fffff"
        }else if(difficulty=="very difficult"){
          this.bits="1e00ffff"
        }else if(difficulty=="impossible"){
          this.bits="1d00ffff"
        }else{
          this.bits="1f0fffff"
        }
      }
}

export type Difficulty = 'easy' | 'normal' | 'difficult' | 'very difficult' | 'impossible'

export type ResultStatus = "success" | "timeout" | "cancelled" | null