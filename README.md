# 富士食譜工具與拍立得工作室

把富士相機食譜做成可瀏覽、可收藏的小工具，並附一套本機即可使用的拍立得風格邊框工作室。  
兩個入口互相連通，不必安裝、不必建置，用瀏覽器直接開 HTML 就能用。

| 入口 | 檔案 | 用途 |
| --- | --- | --- |
| 富士食譜工具 | `index.html` | 瀏覽、搜尋、收藏相機食譜 |
| 拍立得工作室 | `polaroid.html` | 匯入照片、套邊框、寫相機資訊、單張／批次輸出 |

線上示範（若已部署 GitHub Pages）：

- https://enweilo.github.io/fuji-recipes-polaroid/

---

## 快速開始

1. 保留專案相對路徑，至少要有：
   - `index.html`、`polaroid.html`
   - `fonts/`、`assets/`、`vendor/`（若有）
   - `manifest.webmanifest`、`icon-192.png`、`icon-512.png`、`sw.js`
2. 用瀏覽器直接開啟 `index.html` 或 `polaroid.html`（`file://` 可用）。
3. 若要用 PWA／離線快取，請用本機 HTTP 伺服器開啟，例如：

```bash
npx --yes serve .
```

然後連到提示的網址。`file://` 不會註冊 Service Worker。

兩頁頂部都有互相跳轉的連結。

---

## 拍立得工作室

把照片做成拍立得／社群比例輸出，每張照片各自記住裁切、文字與來源設定。

### 容量與比例

- 一次最多 **20 張**。
- 比例：
  - 原圖
  - Mini
  - 方框
  - Wide
  - Instagram 貼文（4:5）
  - Instagram 限時動態（1080 × 1920）

邊框、日期、同步設定、單張輸出與批次 ZIP 都保留。

### 文字資訊

介面分成三塊：

1. **顯示內容**
2. **相機資料**
3. **字體與外觀**

品牌、型號各自可選：

- 自動帶入（來自 EXIF／辨識）
- 預設項目
- 手動輸入
- 不顯示

手動欄位緊貼對應來源。窄螢幕改成單欄。

### EXIF 與顯示資料

匯入時會保存：

- 原始 `File`
- 解析後的 `rawExif`
- 另外一份「顯示用」資料

**不會改寫照片檔案裡的 EXIF。**

顯示規則：

- `NIKON CORPORATION` 顯示成 `NIKON`
- Nikon 型號字串裡重複的品牌文字會拿掉
- 內建預設機型含 **Z5 II、Z6、X-T50**

手機辨識走可擴充的 `PHONE_RULES`，同時比對品牌與型號（例如 Apple / iPhone、Google / Pixel，以及已列出的 Samsung、Sony、Xiaomi 等）。  
辨識只在匯入當下做一次，混合相簿裡每張各自保存結果。

手機的原始鏡頭資料會留下來，但欄位與 Canvas 上的鏡頭資訊會隱藏。  
認不出來的裝置走一般相機流程，**不會**只因為有鏡頭欄位就當成手機。

目前 EXIF 解析以 JPEG 為主。沒有 EXIF、或不支援的容器／機型，不保證能判成手機。  
曝光相關選項只有真的讀到曝光參數時才出現。

### 顏色與效能

- 顏色 `input` 只更新色票，用 `requestAnimationFrame` 合併密集事件。
- `change` 才提交最終顏色。
- 照片＋邊框背景只在照片、裁切、比例或邊框改變時重建，最多快取一張背景。
- 調色不會重跑 EXIF、手機判斷、品牌整理，也不會讀像素。

### 字體

本地字體由 `fonts/` 載入：

- jf open 粉圓（`jf-openhuninn-2.1.ttf`）
- 辰宇落雁（`ChenYuluoyan-2.0-Thin.ttf`）
- 源流明體各字重（`GenRyuMin2TW-*.otf`）

其餘保留字體走 Google Fonts，**需要網路**。

已從選單拿掉：Noto Sans、源流明體極細／細體／標準。舊紀錄會自動落到本地粉圓；字型檔仍留在資料夾。

目前約 12 種可選字體，各有 4 級尺寸表；辰宇落雁特別加大。  
備註、相機、鏡頭、曝光共用同一套尺寸邏輯，再依資訊層級縮放。

### 機型圖示

`assets/models/`：

- `xt50.svg`
- `z5ii.svg`
- `z6.svg`

依參考輪廓做成透明向量，保留字形比例並處理亞像素邊緣。X-T50 使用後續補正的字樣。

這些圖示也內嵌在 `polaroid.html`，避免 `file://` 載不到外部圖而讓 Canvas 匯出失敗。  
黑色字形跟隨使用者選色；Z5 II 的紅色細節保留。

需要重產向量時可用 `qa/build-models.cjs`（需當時的來源圖路徑）。

---

## 富士食譜工具

`index.html` 是食譜瀏覽端：搜尋、卡片、收藏與行動裝置版面。  
可安裝成 PWA（`manifest.webmanifest` + 圖示）。部分功能若接了雲端後端，需要網路。

兩頁視覺語彙一致（墨色底、紙色卡片、富士紅強調）。

---

## 目錄說明

```
.
├── index.html              食譜工具
├── polaroid.html           拍立得工作室
├── manifest.webmanifest
├── sw.js                   僅清理舊快取，不攔截請求
├── icon-192.png
├── icon-512.png
├── fonts/                  本地中文字型
├── assets/models/          機型 SVG
├── vendor/                 第三方函式庫（若有）
├── qa/                     驗證腳本、截圖、匯出樣本
├── backups/                改版前快照
└── original/               最初匯入的原始檔，請勿當工作複本改
```

移動整個資料夾時，請維持上述相對位置。

---

## 快取、PWA、備份

- `sw.js` **不**攔截資源。在 HTTP 環境更新時，只清掉 `fuji-recipe-v*` 舊快取，讓兩個入口吃到最新檔。
- `file://` 不註冊 Service Worker。
- 改版前的入口、README、manifest、SW 放在 `backups/2026-09-10-before-update/`。
- `original/` 與最初 ZIP 內容未改。

若要還原該次備份：先另存目前版本，再把備份目錄裡的五個檔案複製回專案根目錄。這會把「哪個檔是主入口」一併還原成修改前狀態。

---

## 驗證

這是直接跑的 HTML / Canvas 專案，沒有正式 build、lint 或單元測試套件。  
回歸檢查在 `qa/`：

| 腳本 / 產物 | 內容 |
| --- | --- |
| `qa/verify.cjs` | 真實 JPEG EXIF、手機＋相機混合、來源選單、舊字體 fallback、字體尺寸表、選色效能、響應式、雙向導航 |
| `qa/verify-exports.cjs` | 透明圖示、PNG／ZIP 下載與 CRC、批次輸出後還原、SW 快取範圍 |
| `qa/color-before.json`、`qa/verification.json`、`qa/export-verification.json` | 實測結果 |
| `qa/*fields.png`、`qa/font-size-sheet.png` 等 | 視覺對照 |

本機需已安裝 Node.js：

```bash
node qa/verify.cjs
node qa/verify-exports.cjs
```

測試使用本機 Edge 與 Playwright。可用環境變數指定路徑：

- `PLAYWRIGHT_MODULE`
- `STUDIO_ROOT`

這些套件只給驗證用，網站本身不依賴它們。

---

## 字型授權

`fonts/` 內檔案各有原授權（例如源流明體的 `GenRyu-OFL.txt`、粉圓／落雁的授權條款）。  
再散布專案時請一併保留授權檔，並遵守各字型的 OFL／原作者條件。

---

## 注意事項

- 建議用較新的 Chromium / Edge / Safari；Canvas 匯出與字型載入在舊瀏覽器可能有差。
- 批次匯出張數多、解析度高時，記憶體用量會明顯上升，建議分批處理。
- 非 JPEG、或被社群 App 洗掉 EXIF 的圖，自動帶入資料會不完整，可改手動輸入。
- 本 README 對應 2026-09-10 左右的專案快照（含 X-T50 機型圖與字級調整）。
