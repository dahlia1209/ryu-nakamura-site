<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useBlockchainStore } from '../stores/blcokchain';
import { BlockRequest, type Difficulty, type ResultStatus } from '../models/blockchain';

const blockchainStore = useBlockchainStore();

const localStore = (() => {
  /* state */
  const merkleRoot = ref("")
  const hash = ref("")
  const isCalculating = ref(false)
  const calculationTime = ref(0)
  const maxCalculationTime = ref(60) // 計算時間の入力値
  const difficulty = ref<Difficulty>("normal") // 難易度
  const resultStatus = ref<ResultStatus>(null) // 計算結果のステータス
  let intervalId: number | null = null

  /* getter */


  /* action */
  const initBlock = (block: BlockRequest) => {
    block.time = Math.floor(Date.now() / 1000)
    block.selectDifficulty(difficulty.value)
    block.previous_block_hash = "00000000" + block.generateHex(28)
    block.merkleroot = block.generateHex(32)
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
    blockchainStore.block.selectDifficulty(newDifficulty)
  }

  const calculateBlockHash = async (block: BlockRequest, sec: number = 60) => {
    isCalculating.value = true
    calculationTime.value = 0
    resultStatus.value = null

    const start = Date.now();

    // 1秒ごとに計算時間を更新
    intervalId = window.setInterval(() => {
      calculationTime.value = (Date.now() - start) / 1000
    }, 1000)

    try {
      const bk = block.clone()
      bk.nonce = 0
      const target = bk.bitsToTarget()

      while (Date.now() - start < sec * 1000 && isCalculating.value) {
        bk.nonce++;
        const calcHash = await bk.getHash()

        if (calcHash < target) {
          blockchainStore.block = bk
          hash.value = calcHash
          calculationTime.value = (Date.now() - start) / 1000
          resultStatus.value = "success"
          console.log(blockchainStore.block.getBlockRawData())
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
      initBlock(blockchainStore.block as BlockRequest)
      await calculateBlockHash(blockchainStore.block as BlockRequest, maxCalculationTime.value)
    } catch (error) {
      if (error instanceof Error) {
        // alert(error.message)
      }
    }
  }


  //返り値
  return {
    state: {
      merkleRoot,
      hash,
      isCalculating,
      calculationTime,
      maxCalculationTime,
      difficulty,
      resultStatus
    },
    getter: {

    },
    action: {
      calculateBlockHash,
      onClickCalculate,
      cancelCalculation,
      onDifficultyChange,
      initBlock
    },
  }
})()

onMounted(async () => {
  localStore.state.hash.value = await blockchainStore.block.getHash()
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
        <tr class="dn">
          <th>Version</th>
          <td>{{ blockchainStore.block.versionToInt() }}</td>
        </tr>
        <tr>
          <th>Previous Block</th>
          <td class="hash">{{ blockchainStore.block.previous_block_hash }}</td>
        </tr>
        <tr>
          <th>Merkle Root</th>
          <td class="hash">{{ blockchainStore.block.merkleroot }}</td>
        </tr>
        <tr>
          <th>Time</th>
          <td>{{ (new Date(blockchainStore.block.time * 1000)).toLocaleString() }}</td>
        </tr>
        <tr>
          <th>Target</th>
          <td class="hash">{{ blockchainStore.block.bitsToTarget() }}</td>
        </tr>
        <tr>
          <th>Nonce</th>
          <td>{{ blockchainStore.block.nonce }}</td>
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
  /* display: none; */
}

.mining-table th {
  text-align: left;
  padding: 12px 16px;
  font-weight: 500;
  color: #666;
  white-space: nowrap;
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

.calculate-button:hover:not(:disabled) {
  /* background-color: #45a049; */
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

.mining-table td.hash mark {
  background-color: #ffff00;
  padding: 2px 4px;
  border-radius: 2px;
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
</style>