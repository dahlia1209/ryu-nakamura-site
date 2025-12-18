<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useBlockchainStore } from '../stores/blcokchain';
import { BlockRequest, type Difficulty, type ResultStatus, scriptToHex, type Txin, type Txout, generateKeyPair, hexToLittleEndian, generatePublicKeyHash, hash256Hex } from '../models/blockchain';
import { type BlockData,Block } from '../models/blockchain';
import { useBlockchainService } from '../services/blockchainService';

const blockchainService = useBlockchainService();

const localStore = (() => {
  /*private */
  const iniTxin = { n: 0, txid: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", scriptSig: "", sequence: "ffffffff", vout: 0 } as Txin
  const iniTxout = { n: 0, value: 0, scriptPubkey: "" } as Txout

  /* state */
  const block = ref(
    {
      version: 1,
      hash: "0000000000000000000000000000000000000000000000000000000000000000",
      previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
      merkleRoot:"0000000000000000000000000000000000000000000000000000000000000000",
      timestamp: Math.floor(Date.now() / 1000),
      bits: "1f00ffff",
      nonce: 0,
      transactions: []
    } as BlockData
  )
  // const merkleRoot = ref("")
  const target = ref("00000000ffff0000000000000000000000000000000000000000000000000000")
  const hash = ref("0000000000000000000000000000000000000000000000000000000000000000")
  const isCalculating = ref(false)
  const calculationTime = ref(0)
  const maxCalculationTime = ref(60) // 計算時間の入力値
  const difficulty = ref<Difficulty>("normal") // 難易度
  const resultStatus = ref<ResultStatus>(null) // 計算結果のステータス
  const txins = ref<Txin[]>([iniTxin])
  const txouts = ref<Txout[]>([iniTxout])
  let intervalId: number | null = null
  const nextHeight = ref(0)

  const version = ref(1)
  const locktime = ref(0)
  const txidout = ref("")

  /* getter */



  //返り値
  return {
    state: {
      // merkleRoot,
      block,
      target,
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
    },
    action: {
      hexToLittleEndian,
    },
  }
})()

onMounted(async () => {
  const currentBlock=await blockchainService.getCurrentBlock()
  Object.assign(localStore.state.block.value,currentBlock)
  const b=new Block(currentBlock)
  localStore.state.target.value=b.bitsToTarget()
})

// watchEffect(async () => {
//   const rawtrandata = localStore.getter.getRawTransactionData.value
//   localStore.state.txidout.value = await hash256Hex(rawtrandata)
// })



</script>
<template>
  <div class="mining">
    <!-- 説明セクション -->
    <div class="description">
      <h2>ブロックチェーン</h2>
      <h3>現在のブロック情報</h3>
    </div>

    <table class="mining-table">
      <tbody>
        <tr>
          <th>Height</th>
          <td>{{ localStore.state.block.value.height }}</td>
        </tr>
        <tr>
          <th>Hash</th>
          <td class="hash">{{ localStore.state.block.value.hash }}</td>
        </tr>
        <tr>
          <th>Version</th>
          <td>{{ localStore.state.block.value.version }}</td>
        </tr>
        <tr>
          <th>Previous Block</th>
          <td class="hash">{{ localStore.state.block.value.previousHash }}</td>
        </tr>
        <tr>
          <th>Merkle Root</th>
          <td class="hash">{{ localStore.state.block.value.merkleRoot }}</td>
        </tr>
        <tr>
          <th>Time</th>
          <td>{{ (new Date(localStore.state.block.value.timestamp * 1000)).toLocaleString() }}</td>
        </tr>
        <tr>
          <th>Bits / Target</th>
          <td class="hash">{{ localStore.state.block.value.bits }} / {{ localStore.state.target.value }}</td>
        </tr>
        <tr>
          <th>Nonce</th>
          <td>{{ localStore.state.block.value.nonce }}</td>
        </tr>
      </tbody>
    </table>

    <div class="description">
      <h3>マイニング</h3>
      マイニング状況は<a href="/mining_log.html">こちら</a>
    </div>

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