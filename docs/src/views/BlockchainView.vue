<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Block, type BlockData } from '../models/blockchain'
import { useBlockchainService } from '../services/blockchainService'
import HomeHeadline from '../components/HomeHeadline.vue'
import { Headline } from '../models/page'

const blockchainService = useBlockchainService();

const localStore = (() => {
  /* state */
  const header_html = `<div class="blockchain-label"><img src="/blockchain_logo.svg" alt="blockchain_logo">ブロックチェーン</div>`
  const block = ref(
    {
      version: 1,
      hash: "0000000000000000000000000000000000000000000000000000000000000000",
      previousHash: "0000000000000000000000000000000000000000000000000000000000000000",
      merkleRoot: "0000000000000000000000000000000000000000000000000000000000000000",
      timestamp: Math.floor(Date.now() / 1000),
      bits: "1f00ffff",
      nonce: 0,
      transactions: []
    } as BlockData
  )
  const target = ref("00000000ffff0000000000000000000000000000000000000000000000000000")
  const isLoading = ref(true)
  const error = ref<string | null>(null)
  const miningLog = ref<string[]>([])
  const blockList = ref([] as BlockData[])

  /* getter */


  /* action */
  const hexToLittleEndian = (hex: string) => {
    if (hex.length % 2 !== 0) hex = '0' + hex;
    return hex.match(/.{2}/g)?.reverse().join('') ?? hex;
  }

  const truncateHash = (hash: string, start: number = 8, end: number = 8) => {
    if (hash.length <= start + end) return hash;
    return `${hash.slice(0, start)}...${hash.slice(-end)}`;
  }

  const formattedTimestamp = (timestamp: number) => {
    const date: string = new Date(timestamp * 1000).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
    return date
  }

  const updateBlockInfo=async (hash:string)=>{
    const block = await blockchainService.getBlock(hash)
    Object.assign(localStore.state.block.value, block)
    const b = new Block(block)
    localStore.state.target.value = b.bitsToTarget()
    window.scrollTo({top: 0, behavior: 'smooth'})
    return block
  }

  return {
    state: {
      block,
      target,
      isLoading,
      error,
      miningLog,
      header_html,
      blockList
    },
    getter: {
    },
    action: {
      hexToLittleEndian,
      truncateHash,
      formattedTimestamp,
      updateBlockInfo

    },
  }
})()

onMounted(async () => {
  try {
    //現在のブロック取得
    const currentBlock = await blockchainService.getCurrentBlock()
    Object.assign(localStore.state.block.value, currentBlock)
    const b = new Block(currentBlock)
    localStore.state.target.value = b.bitsToTarget()

    //マイニングログ取得
    localStore.state.miningLog.value = (await blockchainService.getMiningLog()).slice(0, 10);

    //ブロック一覧取得
    const allBlocks = await blockchainService.listBlock()
    localStore.state.blockList.value = allBlocks
      .sort((a, b) => (b.height ?? 0) - (a.height ?? 0))
      .slice(0, 20)

  } catch (err) {
    localStore.state.error.value = 'ブロック情報の取得に失敗しました'
    console.error('Error loading block:', err)
  } finally {
    localStore.state.isLoading.value = false
  }
})
</script>

<template>
  <div class="blockchain-view">
    <!-- ヘッダーセクション -->

    <HomeHeadline :headline="new Headline('blockchain', localStore.state.header_html, 'h1')" />
    <div class="page-header">
      <h1 class="page-title">

      </h1>
      <p class="page-subtitle">本サイトオリジナルブロックチェーンの情報</p>
    </div>

    <!-- ローディング状態 -->
    <div v-if="localStore.state.isLoading.value" class="loading-container">
      <div class="loading-spinner"></div>
      <p>ブロック情報を読み込み中...</p>
    </div>

    <!-- エラー状態 -->
    <div v-else-if="localStore.state.error.value" class="error-container">
      <svg class="error-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p>{{ localStore.state.error.value }}</p>
    </div>

    <!-- ブロック情報 -->
    <div v-else class="content-container">
      <!-- ブロック情報テーブル -->
      <HomeHeadline :headline="new Headline('blockchain', 'ブロック', 'h2')" />
      <div class="table-card">
        <table class="block-table">
          <tbody>
            <tr>
              <th>Height</th>
              <td>{{ localStore.state.block.value.height }}</td>
            </tr>
            <tr>
              <th>Hash</th>
              <td class="hash-cell">
                <code class="hash-value">{{ localStore.state.block.value.hash }}</code>
              </td>
            </tr>
            <tr>
              <th>Version</th>
              <td>{{ localStore.state.block.value.version }}</td>
            </tr>
            <tr>
              <th>Previous Hash</th>
              <td class="hash-cell">
                <code class="hash-value">{{ localStore.state.block.value.previousHash }}</code>
              </td>
            </tr>
            <tr>
              <th>Merkle Root</th>
              <td class="hash-cell">
                <code class="hash-value">{{ localStore.state.block.value.merkleRoot }}</code>

              </td>
            </tr>
            <tr>
              <th>Time(JST)</th>
              <td>{{ localStore.action.formattedTimestamp(localStore.state.block.value.timestamp) }}</td>
            </tr>
            <tr>
              <th>Bits / Target</th>
              <td class="hash-cell">
                <div class="hash-value">{{ localStore.state.block.value.bits }}</div>
                <code class="hash-value">{{ localStore.state.target.value }}</code>
              </td>
            </tr>
            <tr>
              <th>Nonce</th>
              <td>{{ localStore.state.block.value.nonce.toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- トランザクション情報 -->
      <HomeHeadline :headline="new Headline('blockchain', 'トランザクション', 'h2')" />
      <div class="table-card">
        <table v-for="(t, i) in localStore.state.block.value.transactions" :key="i" class="transaction-table">
          <tbody>
            <tr>
              <th rowspan="6" class="transaction-index"># {{ i }}</th>
              <th>txid</th>
              <td>{{ t.txid }}</td>
            </tr>
            <tr>
              <th>Version</th>
              <td>{{ t.version }}</td>
            </tr>
            <tr>
              <th>Locktime</th>
              <td>{{ t.locktime }}</td>
            </tr>
            <tr>
              <th>Inputs</th>
              <td>
                <table v-for="(vin, j) in t.vin" :key="j" class="nested-table">
                  <tbody>
                    <tr v-if="t.vin!.length > 1">
                      <th colspan="2" class="input-index">Input {{ j }}</th>
                    </tr>
                    <tr>
                      <th>TXID</th>
                      <td class="hash-cell">
                        <code class="hash-value">{{ vin.utxoTxid }}</code>
                      </td>
                    </tr>
                    <tr>
                      <th>VOUT</th>
                      <td>{{ vin.utxoVout }}</td>
                    </tr>
                    <tr>
                      <th>scriptSig</th>
                      <td>{{ vin.scriptSigAsm }}</td>
                    </tr>
                    <tr>
                      <th>Sequence</th>
                      <td>{{ vin.sequence }}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <th>Outputs</th>
              <td>
                <table v-for="(output, j) in t.outputs" :key="j" class="nested-table">
                  <tbody>
                    <tr v-if="t.outputs!.length > 1">
                      <th colspan="2" class="output-index">Output {{ j }}</th>
                    </tr>
                    <tr>
                      <th>Amount<br>(stoshis)</th>
                      <td>
                        <code class="hash-value">{{ output.value }}</code>
                      </td>
                    </tr>
                    <tr>
                      <th>script<br>PubKey</th>
                      <td>{{ output.scriptPubkeyAsm }}</td>
                    </tr>
                    <tr>
                      <th>Type</th>
                      <td>{{ output.scriptType }}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ブロック一覧 -->
      <HomeHeadline :headline="new Headline('blockchain', 'ブロック一覧 (直近20件)', 'h2')" />
      <div>
        <table class="block-list-table">
          <thead>
            <tr>
              <th>Height</th>
              <th>Block Hash</th>
              <th>Txs</th>
              <th>Time(JST)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="block in localStore.state.blockList.value" :key="block.height!" 
              :class="{'current-height':block.height==localStore.state.block.value.height}"
              class="block-row"
              @click="block.height==localStore.state.block.value.height?null: localStore.action.updateBlockInfo(block.hash)">
              <th class="hash-cell">
                <code class="hash-value" >{{ block.height }}</code>
              </th>
              <th class="hash-cell">
                <code class="hash-value">{{ block.hash }}</code>
              </th>
              <th class="hash-cell">
                <code class="hash-value">{{ block.transactionCount }}</code>
              </th>
              <th class="hash-cell">
                <code class="hash-value">{{ localStore.action.formattedTimestamp(block.timestamp) }}</code>
              </th>
            </tr>
          </tbody>
        </table>
      </div>


      <!-- マイニング情報 -->
      <HomeHeadline :headline="new Headline('blockchain', 'マイニング', 'h2')" />
      <div class="mining-info-card">
        <h3 class="mining-title">マイニング状況</h3>
        <div v-for="l in localStore.state.miningLog.value">
          {{ l }}
        </div>
        <p>マイニングの進行状況詳細は<a href="/mining_log.html" class="mining-link">こちら</a>からご確認いただけます。</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ベーススタイル */
.blockchain-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem 1rem;
  min-height: 100vh;
}

/* ヘッダーセクション */
.page-header {
  margin-bottom: 3rem;
}

.page-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.icon-blockchain {
  width: 2.5rem;
  height: 2.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  margin: 0;
}

/* ローディング状態 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid var(--vp-c-gray-soft);
  border-top-color: var(--vp-c-green-3);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* エラー状態 */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  color: #e74c3c;
}

.error-icon {
  width: 4rem;
  height: 4rem;
  color: #e74c3c;
}

/* コンテンツコンテナ */
.content-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* テーブルカード */
.table-card {
  border: 1px solid var(--vp-c-gray-soft);
  /* border-radius: 12px; */
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* ブロックテーブル */
.block-table {
  width: 100%;
  border-collapse: collapse;
}

.block-table tbody tr {
  border-bottom: 1px solid var(--vp-c-gray-soft);
  transition: background-color 0.2s ease;
}

.block-table tbody tr:last-child {
  border-bottom: none;
}

.block-table th {
  text-align: left;
  padding: 0.5rem 1rem;
  font-weight: 600;
  color: var(--vp-c-green-2);
  background-color: var(--vp-c-gray-soft);
  width: 180px;
  white-space: nowrap;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.block-table td {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

/* トランザクションテーブル */
.transaction-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--vp-c-gray-soft);
  table-layout: auto;
}

.transaction-table tbody tr {
  border-bottom: 1px solid var(--vp-c-gray-soft);
  transition: background-color 0.2s ease;
}


.transaction-table th {
  text-align: left;
  padding: 0.5rem 1rem;
  font-weight: 600;
  color: var(--vp-c-green-2);
  background-color: var(--vp-c-gray-soft);
  width: 1%;
  white-space: nowrap;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.transaction-table td {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  word-break: break-all;
  overflow-wrap: break-word;
}

.transaction-index {
  border: 1px solid var(--vp-c-gray-soft);
  width: 1%;
}

/* Input/Output インデックス */
.input-index,
.output-index {
  text-align: center !important;
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.5rem !important;
  background-color: var(--vp-c-gray-soft);
  word-break: normal;
}

.input-index {
  color: var(--vp-c-blue-2);
}

.output-index {
  color: var(--vp-c-purple-2);
}

/* ネストされたテーブル */
.nested-table {
  width: 100%;
  margin: 0.5rem 0;
  border: 1px solid var(--vp-c-gray-soft);
  border-collapse: collapse;
  table-layout: auto;
}

.nested-table:first-child {
  margin-top: 0;
}

.nested-table:last-child {
  margin-bottom: 0;
}

.nested-table th {
  width: 1%;
  white-space: nowrap;
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
}

.nested-table td {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  word-break: break-all;
  overflow-wrap: break-word;
}

/* トランザクションインデックス */
.transaction-index {
  vertical-align: middle;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--vp-c-green-3);
  background-color: var(--vp-c-gray-soft);
  width: 1%;
  white-space: nowrap;
}

/* ハイライト行 */
.highlight-row {
  background: linear-gradient(90deg,
      rgba(65, 184, 131, 0.08) 0%,
      rgba(65, 184, 131, 0.02) 100%);
}

.highlight-row th {
  /* color: var(--vp-c-green-3); */
  font-weight: 700;
}

/* ハッシュセル */
.hash-cell {
  position: relative;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  transition: all 0.2s ease;
}


.hash-value {
  display: block;
  word-break: break-all;
  font-size: 0.85rem;
  line-height: 1.6;
  overflow-wrap: break-word;
}





/* マイニング情報カード */
.mining-info-card {
  border: 1px solid var(--vp-c-gray-soft);
  padding: 1.0rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.mining-title {
  font-size: 1.2rem;
  font-weight: 600;
  /* color: var(--vp-c-text-1); */
  margin: 0 0 0.75rem 0;
}

.mining-info-card p {
  margin: 0;
  font-size: 1rem;
  /* color: var(--vp-c-text-2); */
  line-height: 1.6;
}

.mining-link {
  color: var(--vp-c-green-3);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
}

.mining-link:hover {
  border-bottom-color: var(--vp-c-green-3);
}

/* レスポンシブデザイン - スマートフォン */
@media (max-width: 480px) {
  .blockchain-view {
    padding: 0.5rem 0.75rem;
  }

  .page-title {
    font-size: 1.75rem;
    gap: 0.5rem;
  }

  .icon-blockchain {
    width: 1.75rem;
    height: 1.75rem;
  }

  .page-subtitle {
    font-size: 0.95rem;
  }


  .block-table th {
    width: 110px;
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }

  .block-table td {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }

  .hash-value {
    font-size: 0.7rem;
    line-height: 1.5;
  }

  .mining-info-card {
    padding: 1.0rem;
    /* border-radius: 8px; */
  }

  .mining-title {
    font-size: 1.1rem;
  }

  .mining-info-card p {
    font-size: 0.9rem;
  }
}

/* レスポンシブデザイン - スマートフォン */
@media (max-width: 480px) {
  .blockchain-view {
    padding: 0.5rem 0.75rem;
  }

  .page-title {
    font-size: 1.75rem;
    gap: 0.5rem;
  }

  .icon-blockchain {
    width: 1.75rem;
    height: 1.75rem;
  }

  .page-subtitle {
    font-size: 0.95rem;
  }

  .block-table th {
    width: 110px;
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }

  .block-table td {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }

  /* トランザクションテーブル - スマートフォン */
  .transaction-table th {
    padding: 0.5rem 0.5rem;
    font-size: 0.75rem;
    width: 1%;
    white-space: nowrap;
    border: 1px solid var(--vp-c-gray-soft);
  }

  .transaction-table td {
    padding: 0.5rem 0.5rem;
    font-size: 0.85rem;
  }

  .transaction-index {
    min-width: 40px;
    font-size: 0.9rem;
    padding: 0.5rem 0.25rem;
    width: 1%;
    white-space: nowrap;
  }

  .nested-table {
    margin: 0.25rem 0;
  }

  .nested-table th {
    width: 1%;
    white-space: nowrap;
    padding: 0.5rem 0.5rem;
    font-size: 0.75rem;
  }

  .nested-table td {
    padding: 0.5rem 0.5rem;
    font-size: 0.8rem;
  }

  .input-index,
  .output-index {
    font-size: 0.8rem;
    padding: 0.4rem !important;
  }

  .hash-value {
    font-size: 0.7rem;
    line-height: 1.5;
  }

  .mining-info-card {
    padding: 1.0rem;
  }

  .mining-title {
    font-size: 1.1rem;
  }

  .mining-info-card p {
    font-size: 0.9rem;
  }
}

.block-list-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--vp-c-gray-soft);
}

.block-list-table thead {
  background-color: var(--vp-c-gray-soft);
}

.block-list-table thead tr {
  border: 2px solid var(--vp-c-gray-soft);
}

.block-list-table thead th {
  text-align: left;
  padding: 0.25rem 0.5rem;
  font-weight: 600;
  color: var(--vp-c-green-2);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.block-list-table tbody tr {
  border: 1px solid var(--vp-c-gray-soft);
  transition: background-color 0.2s ease;
}

.block-list-table tbody tr:last-child {
  border: none;
}

.block-list-table tbody th {
  text-align: left;
  font-weight: 400;
}

.current-height{
  background-color: #fef9c3;
}

.block-row{
  cursor: pointer;
}
.block-row:hover{
  background-color: var(--vp-c-gray-soft);
}

.block-row.current-height:hover{
  background-color: rgb(245, 232, 97);
}

/* レスポンシブデザイン - スマートフォン */
@media (max-width: 480px) {
  .block-list-table thead th {
    font-size: 0.75rem;
  }

  .block-list-table tbody th {
    padding: 0 0.25rem;
    font-size: 0.85rem;
  }
}

:deep(.blockchain-label) {
  display: flex;
  align-items: center;
  gap: 0.3em;
}

:deep(.blockchain-label img) {
  height: 1em;
  width: auto;
}
</style>