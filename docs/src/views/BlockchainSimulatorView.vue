<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useBlockchainStore } from '../stores/blcokchain';
import { BlockRequest, type Difficulty, type ResultStatus, scriptToHex, type Txin, type Txout,generateKeyPair,hexToLittleEndian,generatePublicKeyHash,hash256Hex } from '../models/blockchain';

// const blockchainStore = useBlockchainStore();

const localStore = (() => {
  /*private */
  const iniTxin={ n: 0, txid: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", scriptSig: "", sequence: "ffffffff", vout: 0 } as Txin
  const iniTxout={ n: 0, value: 0, scriptPubkey: "" } as Txout

  /* state */
  const block = ref(new BlockRequest(
    1,
    "0000000000000000000000000000000000000000000000000000000000000000",
    Math.floor(Date.now() / 1000),
    "1f00ffff",
    0,
    "0000000000000000000000000000000000000000000000000000000000000000",
    ["0000000000000000000000000000000000000000000000000000000000000000"]
  ))
  // const merkleRoot = ref("")
  const hash = ref("0000000000000000000000000000000000000000000000000000000000000000")
  const isCalculating = ref(false)
  const calculationTime = ref(0)
  const maxCalculationTime = ref(60) // 計算時間の入力値
  const difficulty = ref<Difficulty>("normal") // 難易度
  const resultStatus = ref<ResultStatus>(null) // 計算結果のステータス
  const txins = ref<Txin[]>([iniTxin])
  const txouts = ref<Txout[]>([iniTxout])
  let intervalId: number | null = null
  const nextHeight=ref(0)

  const version = ref(1)
  const locktime = ref(0)
  const txidout=ref("")

  /* getter */
  const getRawTransactionData = computed(() => {
    const versionLE = decimalToHexLE(version.value)
    const txinCnt = decimalToHexLE(txins.value.length, 1)
    const txinHex = txins.value.map(x => hexToLittleEndian(x.txid) + decimalToHexLE(x.vout) + scriptToHex(x.scriptSig, true) + x.sequence).join("")
    const txoutCnt = decimalToHexLE(txouts.value.length, 1)
    const txoutHex = txouts.value.map(x => decimalToHexLE(x.value, 8) + scriptToHex(x.scriptPubkey, true)).join("")
    const locktimeLE = decimalToHexLE(locktime.value)

    return versionLE + txinCnt + txinHex + txoutCnt + txoutHex + locktimeLE
  })

  


  /* action */
  const initBlock = () => {
    block.value.time = Math.floor(Date.now() / 1000)
    block.value.selectDifficulty(difficulty.value)
    block.value.previous_block_hash = hash.value
    block.value.merkleroot = block.value.generateHex(32)
    if (block.value.previous_block_hash!=="0000000000000000000000000000000000000000000000000000000000000000" ) nextHeight.value++
  }


  const cancelCalculation = () => {
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
    isCalculating.value = false
    resultStatus.value = "cancelled"
  }

  const onDifficultyChange = (newDifficulty: Difficulty) => {
    block.value.selectDifficulty(newDifficulty)
  }

  const calculateBlockHash = async (sec: number = 60) => {
    isCalculating.value = true
    calculationTime.value = 0
    resultStatus.value = null

    const start = Date.now();

    // 1秒ごとに計算時間を更新
    intervalId = window.setInterval(() => {
      calculationTime.value = (Date.now() - start) / 1000
    }, 1000)

    try {
      const bk = block.value.clone()
      bk.nonce = 0
      const target = bk.bitsToTarget()

      while (Date.now() - start < sec * 1000 && isCalculating.value) {
        bk.nonce++;
        const calcHash = await bk.getHash()

        if (calcHash < target) {
          block.value = bk
          hash.value = calcHash
          calculationTime.value = (Date.now() - start) / 1000
          resultStatus.value = "success"
          console.log(block.value.getBlockRawData())
          return calcHash
        }

        if (bk.nonce % 1000 === 0) {
          await new Promise(resolve => setTimeout(resolve, 0))
        }
      }

      if (!isCalculating.value) {
        throw new Error('計算がキャンセルされました。')
      }

      resultStatus.value = "timeout"
      throw new Error(`指定した時間内 (${sec}秒) にハッシュ値が見つかりませんでした。`)
    } finally {
      if (intervalId !== null) {
        clearInterval(intervalId)
        intervalId = null
      }
      isCalculating.value = false
    }
  }

  const onClickCalculate = async () => {
    try {
      initBlock()
      //トランザクションビルダーに反映
      const heightHex=decimalToHexLE(nextHeight.value,3)
      const messageHex= stringToHex(`Mined by you on ${formatDateTime()}`)
      const scriptSig=`OP_PUSHBYTES_3 ${heightHex} OP_PUSHBYTES_35 ${messageHex}`
      const txin= {n:0,scriptSig:scriptSig,sequence:"ffffffff",txid:'0000000000000000000000000000000000000000000000000000000000000000',vout:4294967295} as Txin
      txins.value=[txin]

      const amount=5000000000
      const keypair=await generateKeyPair()
      const pkh=await generatePublicKeyHash(keypair.publicKey)
      const scriptPubkey=`OP_DUP OP_HASH160 OP_PUSHBYTES_20 ${pkh} OP_EQUALVERIFY OP_CHECKSIG`
      const txout={n:0,scriptPubkey:scriptPubkey,value:amount} as Txout
      txouts.value=[txout]
      block.value.merkleroot=await hash256Hex(getRawTransactionData.value)

      await calculateBlockHash(maxCalculationTime.value)


    } catch (error) {
      if (error instanceof Error) {
        // alert(error.message)
      }
    }
  }

  const decimalToHexLE = (decimal: number, bytes = 4) => {
    // バイト数に応じた最大値を計算
    const maxValue = Math.pow(256, bytes) - 1; // 2^(8*bytes) - 1
    if (decimal < 0 || decimal > maxValue) {
      throw new Error(`値は0から${maxValue}の範囲で指定してください (${bytes}バイト)`);
    }

    // 16進数文字列に変換(パディングなし)
    let hex = decimal.toString(16);

    // 必要なバイト数に合わせてゼロパディング(ビッグエンディアン形式)
    hex = hex.padStart(bytes * 2, '0');

    // リトルエンディアンに変換(バイト単位で逆順)
    const hexLE = hexToLittleEndian(hex)

    return hexLE;
  }

  

  const addInput = () => {
    const input = { n: txins.value.length, txid: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", scriptSig: "", sequence: "ffffffff", vout: 0 } as Txin
    txins.value.push(input)
  }
  const addOutput = () => {
    const output = { n: txouts.value.length, value: 0,  scriptPubkey: "" } as Txout
    txouts.value.push(output)
  }
  const removeInput = (n: number) => {
    txins.value.splice(n, 1)
    txins.value.forEach((x, i) => {
      x.n = i
    })
  }
  const removeOutput = (n: number) => {
    txouts.value.splice(n, 1)
    txouts.value.forEach((x, i) => {
      x.n = i
    })
  }

  const formatDateTime = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const stringToHex = (str: string) => {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      hex += charCode.toString(16).padStart(2, '0');
    }
    return hex;
  }

  //返り値
  return {
    state: {
      // merkleRoot,
      block,
      hash,
      isCalculating,
      calculationTime,
      maxCalculationTime,
      difficulty,
      resultStatus,
      version,
      txins,
      txouts,
      locktime,
      txidout,
      nextHeight

    },
    getter: {
      getRawTransactionData
    },
    action: {
      calculateBlockHash,
      onClickCalculate,
      cancelCalculation,
      onDifficultyChange,
      initBlock,
      decimalToHexLE,
      hexToLittleEndian,
      addInput,
      addOutput,
      removeInput,
      removeOutput
    },
  }
})()

// onMounted(async () => {
//   localStore.state.hash.value = await localStore.state.block.value.getHash()
// })

watchEffect(async ()=>{
  const rawtrandata=localStore.getter.getRawTransactionData.value
  localStore.state.txidout.value= await hash256Hex(rawtrandata)
})



</script>
<template>
  <div class="mining">
    <!-- 説明セクション -->
    <div class="description">
      <h2>ブロックチェーンマイニングシミュレーター</h2>
      <p>
        このツールは、ブロックチェーンのマイニングプロセスを体験できるシミュレーターです。
        マイニングとは、特定の条件を満たすハッシュ値を見つけるために、Nonce値を変えながら繰り返し計算を行う作業です。
      </p>
      <div class="how-to-use">
        <h3>使い方</h3>
        <ol>
          <li><strong>難易度を選択:</strong> Easy（簡単）からImpossible（不可能）まで5段階から選べます</li>
          <li><strong>最大計算時間を設定:</strong> 1〜600秒の範囲で指定できます</li>
          <li><strong>「ハッシュ値を計算」ボタンをクリック:</strong> マイニングが開始されます</li>
          <li><strong>結果を確認:</strong> Target値より小さいハッシュ値が見つかれば成功です</li>
        </ol>
      </div>
      <div class="info-box">
        <p><strong>💡 ポイント:</strong> 難易度が高いほど、条件を満たすハッシュ値を見つけるのが困難になります。実際のBitcoinマイニングでは、さらに高い難易度で競争が行われています。</p>
      </div>
    </div>



    <table class="mining-table">
      <tbody>
        <tr>
          <th>ハッシュ値</th>
          <td class="hash">
            <mark v-if="localStore.state.resultStatus.value === 'success'">
              {{ localStore.state.hash.value }}
            </mark>
            <span v-else>
              {{ localStore.state.hash.value }}
            </span>
          </td>
        </tr>
        <tr>
          <th>計算時間</th>
          <td>{{ localStore.state.isCalculating.value || localStore.state.calculationTime.value > 0 ?
            Math.floor(localStore.state.calculationTime.value) : '-' }} 秒</td>
        </tr>
      </tbody>
    </table>

    <div class="button-container">
      <div class="input-group">
        <label for="difficulty">難易度:</label>
        <select id="difficulty" v-model="localStore.state.difficulty.value"
          @change="localStore.action.onDifficultyChange(localStore.state.difficulty.value)"
          :disabled="localStore.state.isCalculating.value" class="difficulty-select">
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="difficult">Difficult</option>
          <option value="very difficult">Very Difficult</option>
          <option value="impossible">Impossible</option>
        </select>
      </div>

      <div class="input-group">
        <label for="calc-time">最大計算時間:</label>
        <input id="calc-time" type="number" v-model.number="localStore.state.maxCalculationTime.value"
          :disabled="localStore.state.isCalculating.value" min="1" max="600" class="time-input" />
        <span class="unit">秒</span>
      </div>
      <button
        @click="localStore.state.isCalculating.value ? localStore.action.cancelCalculation() : localStore.action.onClickCalculate()"
        :class="['calculate-button', { 'cancel-button': localStore.state.isCalculating.value }]">
        {{ localStore.state.isCalculating.value ? 'キャンセル' : 'ハッシュ値を計算' }}
      </button>
    </div>

    <!-- 結果メッセージ -->
    <div v-if="localStore.state.resultStatus.value"
      :class="['result-message', `result-${localStore.state.resultStatus.value}`]">
      <span v-if="localStore.state.resultStatus.value === 'success'">
        ✅ マイニング成功！
      </span>
      <span v-else-if="localStore.state.resultStatus.value === 'timeout'">
        ❌ 時間内にマイニングができませんでした
      </span>
      <span v-else-if="localStore.state.resultStatus.value === 'cancelled'">
        マイニングをキャンセルしました
      </span>
    </div>

    <table class="mining-table">
      <tbody>
        <tr>
          <th>Version</th>
          <td>{{ localStore.state.block.value.versionToInt() }}</td>
        </tr>
        <tr>
          <th>Previous Block</th>
          <td class="hash">{{ localStore.state.block.value.previous_block_hash }}</td>
        </tr>
        <tr>
          <th>Merkle Root</th>
          <td class="hash">{{ localStore.state.block.value.merkleroot }}</td>
        </tr>
        <tr>
          <th>Time</th>
          <td>{{ (new Date(localStore.state.block.value.time * 1000)).toLocaleString() }}</td>
        </tr>
        <tr>
          <th>Target</th>
          <td class="hash">{{ localStore.state.block.value.bitsToTarget() }}</td>
        </tr>
        <tr>
          <th>Nonce</th>
          <td>{{ localStore.state.block.value.nonce }}</td>
        </tr>
        <tr>
          <th>Next Height</th>
          <td>{{ localStore.state.nextHeight.value }}</td>
        </tr>
      </tbody>
    </table>


    <div class="description">
      <h2>トランザクションビルダー</h2>
      <p>
        トランザクション生データを生成します。
      </p>
    </div>

    <table class="mining-table">
      <tbody>
        <tr>
          <th>Type</th>
          <td>
            <div class="radio-group">
              <div class="radio-item">
                <input type="radio" name="blockType" value="legacy" id="typeLegacy" checked>
                <label for="typeLegacy">Legacy</label>
              </div>
              <div class="radio-item">
                <input type="radio" name="blockType" value="segwit" id="typeSegwit">
                <label for="typeSegwit">Segwit</label>
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <th>Version</th>
          <td><input type="number" name="version" max="4294967295" v-model="localStore.state.version.value" /></td>
        </tr>
        <tr>
          <th>Inputs</th>
          <td>
            <table class="nested-table">
              <tbody v-for="txin in localStore.state.txins.value" :key="txin.n">
                <tr>
                  <th rowspan="4">Input #{{ txin.n }} <br>
                    <button type="button" name="remove_input" @click="localStore.action.removeInput(txin.n)"
                      v-if="txin.n > 0">
                      ×
                    </button>
                  </th>
                  <th>TXID</th>
                  <td><input type="text" name="txid" maxlength="64" v-model="txin.txid" /></td>
                </tr>
                <tr>
                  <th>VOUT</th>
                  <td><input type="number" name="vout" max="4294967295" v-model="txin.vout" /></td>
                </tr>
                <tr>
                  <th>scriptSig (ASM)</th>
                  <td><textarea name="scriptsig" rows="5" v-model="txin.scriptSig"></textarea> </td>
                </tr>
                <tr>
                  <th>Sequence</th>
                  <td><input type="text" name="sequence" maxlength="8" v-model="txin.sequence" /></td>
                </tr>
                <tr>
                  <td colspan="2" class="separator"></td>
                </tr>
              </tbody>
            </table>

            <button type="button" name="add_input" @click="localStore.action.addInput">
              [+] Add Input
            </button>
          </td>
        </tr>
        <tr>
          <th>Outputs</th>
          <td>
            <table class="nested-table">
              <tbody v-for="txout in localStore.state.txouts.value" :key="txout.n">
                <!-- Output #0 -->
                <tr>
                  <th rowspan="3">Output #{{ txout.n }} <br>
                    <button type="button" name="remove_output" @click="localStore.action.removeOutput(txout.n)"
                      v-if="txout.n > 0">
                      ×
                    </button>
                  </th>
                  <th>Amount (satoshis)</th>
                  <td><input type="number" name="amount" v-model="txout.value" /></td>
                </tr>
                <tr>
                  <th>scriptPubKey (ASM)</th>
                  <td><textarea type="text" name="scriptpubkey" rows="5" v-model="txout.scriptPubkey"></textarea></td>
                </tr>
                <tr>
                  <th>Type</th>
                  <td><input type="text" name="type" /></td>
                </tr>
                <tr>
                  <td colspan="2" class="separator"></td>
                </tr>

              </tbody>
            </table>

            <button type="button" name="add_output" @click="localStore.action.addOutput">
              [+] Add Output
            </button>

          </td>
        </tr>
        <tr>
          <th>Locktime</th>
          <td><input type="number" name="locktime" v-model="localStore.state.locktime.value" /></td>
        </tr>
        <tr>
          <th>Raw<br>Transaction<br>Data</th>
          <td><textarea name="raw-transaction-data" readonly rows="5"
              :value="localStore.getter.getRawTransactionData.value"></textarea></td>
        </tr>
        <tr>
          <th>Transaction<br>Data</th>
          <td><input type="text" name="transaction-data" readonly   v-model="localStore.state.txidout.value"/></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style scoped>
.description {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
}

.description h2 {
  color: #333;
  font-size: 24px;
  margin-top: 0;
  margin-bottom: 12px;
}

.description p {
  color: #555;
  line-height: 1.6;
  margin-bottom: 16px;
}

.how-to-use {
  margin: 20px 0;
}

.how-to-use h3 {
  color: #444;
  font-size: 18px;
  margin-bottom: 12px;
}

.how-to-use ol {
  color: #555;
  line-height: 1.8;
  padding-left: 24px;
}

.how-to-use li {
  margin-bottom: 8px;
}

.how-to-use strong {
  color: #333;
}

.info-box {
  background-color: #e3f2fd;
  border-left: 4px solid #2196F3;
  padding: 16px;
  border-radius: 4px;
  margin-top: 16px;
}

.info-box p {
  margin: 0;
  color: #1565c0;
  line-height: 1.6;
}

.result-message {
  padding: 16px 24px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-success {
  background-color: #d4edda;
  color: #155724;
  border: 2px solid #c3e6cb;
}

.result-timeout {
  background-color: #fff3cd;
  color: #856404;
  border: 2px solid #ffeaa7;
}

.result-cancelled {
  background-color: #f8d7da;
  color: #721c24;
  border: 2px solid #f5c6cb;
}

.button-container {
  margin: 20px 0;
  text-align: center;
}

.input-group {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.input-group label {
  font-weight: 500;
  color: #666;
}

.difficulty-select {
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
}

.difficulty-select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.time-input {
  width: 100px;
  padding: 8px 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
}

.time-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.unit {
  color: #666;
}

.calculate-button {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  color: white;
  background-color: #4CAF50;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.calculate-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #f44336;
}

.cancel-button:hover {
  background-color: #da190b;
}

@keyframes highlightPulse {

  0%,
  100% {
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
  }

  50% {
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.8);
  }
}

/* Radio Group */
.radio-group {
  display: flex;
  gap: 20px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* Mining Table */
.mining-table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.mining-table {
  width: 100%;
  border-collapse: collapse;
}

.mining-table tbody tr {
  border-bottom: 1px solid #e0e0e0;
}

.mining-table tbody tr:last-child {
  border-bottom: none;
}

.mining-table tbody tr.dn {
  display: none;
}

.mining-table th {
  text-align: left;
  padding: 12px 16px;
  font-weight: 500;
  color: #666;
  white-space: nowrap;
  width: 1%;
}

.mining-table td {
  padding: 12px 16px;
  color: #333;
  word-break: break-all;
}

.mining-table td.hash {
  font-family: monospace;
  font-size: 14px;
}

.mining-table input[type="text"],
.mining-table input[type="number"] {
  box-sizing: border-box;
  padding: 10px;
  height: 40px;
  font-size: 16px;
  width: 100%;
}

.mining-table textarea {
  box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
  width: 100%;
  resize: vertical;
}

/* Nested Table */
.nested-table {
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  table-layout: auto;
}

.nested-table th,
.nested-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.nested-table th {
  background-color: #f8f8f8;
  font-weight: bold;
  width: 1%;
  white-space: nowrap;
}

.nested-table .hash {
  word-break: break-all;
  font-family: monospace;
  font-size: 0.9em;
}

.nested-table .separator {
  height: 10px;
  border: none;
  background-color: transparent;
}

.mining-table td input,
.mining-table td textarea {
  font-family: monospace;
  font-size: 14px;
}

.mining-table button {
  font-size: 14px;
}

/* レスポンシブ対応 */
@media screen and (max-width: 768px) {
  .description {
    padding: 16px;
  }

  .description h2 {
    font-size: 20px;
  }

  .result-message {
    font-size: 16px;
    padding: 12px 16px;
  }

  .input-group {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .input-group label {
    text-align: center;
  }

  .difficulty-select,
  .time-input,
  .calculate-button {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }

  /* テーブルをカード型レイアウトに */
  .mining-table {
    min-width: 100%;
  }

  .mining-table tbody tr {
    display: block;
    margin-bottom: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 12px;
  }

  .mining-table th,
  .mining-table td {
    display: block;
    width: 100%;
    padding: 8px;
    text-align: left;
  }

  .mining-table th {
    background-color: #f8f8f8;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
    margin-bottom: 8px;
  }

  .mining-table td {
    border: none;
  }

  /* ネストされたテーブルもカード型に */
  .nested-table {
    display: block;
  }

  .nested-table tbody {
    display: block;
    margin-bottom: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 8px;
  }

  .nested-table tr {
    display: block;
    margin-bottom: 8px;
  }

  .nested-table th,
  .nested-table td {
    display: block;
    width: 100%;
    border: none;
    padding: 4px 8px;
  }

  .nested-table th {
    background-color: #f0f0f0;
    font-weight: bold;
    margin-bottom: 4px;
  }

  .nested-table .separator {
    display: none;
  }

  /* ボタンのサイズ調整 */
  .mining-table button,
  .nested-table button {
    width: 100%;
    max-width: 200px;
    margin: 8px auto;
    display: block;
  }

  .radio-group {
    flex-direction: column;
    gap: 12px;
  }
}

@media screen and (max-width: 480px) {
  .description {
    padding: 12px;
  }

  .description h2 {
    font-size: 18px;
  }

  .how-to-use h3 {
    font-size: 16px;
  }

  .mining-table input[type="text"],
  .mining-table input[type="number"],
  .mining-table textarea {
    font-size: 14px;
  }

  .calculate-button {
    font-size: 14px;
    padding: 10px 20px;
  }
}
</style>