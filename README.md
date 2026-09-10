# 富士食譜工具與拍立得工作室

## 開啟方式與檔案角色

- `index.html`：富士食譜工具，從使用者提供的原始 ZIP 恢復。
- `polaroid.html`：目前的拍立得工作室。請開啟此檔繼續編輯照片。
- 兩頁上方分別提供「拍立得工作室」與「富士食譜工具」連結。
- 可直接開啟本地 HTML。移動專案時請保留 `fonts/`、`vendor/`、`assets/`、圖示與 manifest 的相對位置。
- 本地粉圓、辰宇落雁、源流明體可由 `fonts/` 載入；其他保留字體由 Google Fonts 載入，需要網路。

## 拍立得工作室

最多 20 張照片，每張分別保留裁切、文字與來源選擇。照片比例包含原圖、Mini、方框、Wide、Instagram 貼文（4:5）、Instagram 限時動態（1080 × 1920）。保留既有邊框、日期、同步設定、單張與批次輸出功能。

文字資訊分成「顯示內容／相機資料／字體與外觀」。品牌和型號各自支援自動帶入、預設項目、手動輸入與不顯示。手動欄位緊鄰對應來源，手機寬度下改成單欄。

## 顯示資料與原始 EXIF

匯入後保留原始 File 與解析所得 `rawExif`，另外建立顯示資料，不改寫照片 EXIF。NIKON CORPORATION 僅在顯示時改為 NIKON，NIKON 型號中的品牌文字會移除。新增 Z5 II、Z6、X-T50 預設。

手機辨識使用可擴充的 `PHONE_RULES`，同時比對 EXIF 品牌與型號。例如 Apple/iPhone、Google/Pixel，以及已列出的 Samsung、Sony、Xiaomi 等手機型號模式。辨識只在匯入執行；混合照片各自保存結果。手機的原始鏡頭資料保留，但欄位及 Canvas 鏡頭資訊隱藏。無法識別的裝置沿用一般相機行為，不以鏡頭欄位是否存在推測手機。

現有 EXIF 解析器處理 JPEG EXIF。沒有 EXIF、或目前未支援的容器／型號，不保證能辨識為手機。曝光顯示選項只在讀到曝光參數時出現。

## 選色與字體

選色 `input` 只更新顏色，透過 requestAnimationFrame 合併密集事件；`change` 立即提交最終顏色。照片與邊框背景僅在照片、裁切、比例或邊框改變時重建，快取最多一張背景。選色不解析 EXIF、不判斷手機、不整理品牌型號，也不讀取照片像素。

移除的字體選項：Noto Sans、源流明體極細／細體／標準。舊選擇自動改用本地 jf open 粉圓；原字體檔保留。12 種可選字體各有 4 級尺寸表，辰宇落雁特別加大。備註、相機、鏡頭與曝光使用同一份字體尺寸設定邏輯，再依資訊層級調整比例。

## 型號素材

`assets/models/z5ii.svg`、`z6.svg`、`xt50.svg` 均沿使用者提供的型號參考圖輪廓建立透明向量，保留字形比例並平滑亞像素邊緣。X-T50 使用後續補充的正確字樣圖片。

素材同步內嵌於 `polaroid.html`，避免 file:// 外部圖片讓 Canvas 無法輸出。黑色字形跟隨使用者選色，Z5 II 的紅色細節保留。`qa/build-models.cjs` 可由當時提供的三個來源路徑重新產生型號向量並更新內嵌內容。

## 快取與備份

`sw.js` 不攔截資源請求；在 HTTP 環境更新時只清理 `fuji-recipe-v數字` 舊快取，使兩個入口使用目前檔案。file:// 不註冊 Service Worker。

修改前的入口、README、manifest 與 SW 保存在 `backups/2026-09-10-before-update/`。`original/` 與既有 ZIP 未改動。若要回復，先另存目前版本，再將該備份目錄五個檔案複製回專案根目錄。此回復會還原成修改前的入口角色。

## 驗證

本專案為直接執行的 HTML/Canvas，沒有建置程序或原有 Lint／測試設定。新增瀏覽器回歸測試：

- `qa/verify.cjs`：真實 JPEG EXIF 測試資料、手機與相機混合、來源選單、舊字體 fallback、48 組字體尺寸、選色效能與最終顏色、響應式排列、雙向導航。
- `qa/verify-exports.cjs`：透明圖示、PNG 與 ZIP 下載及 CRC、批次輸出後還原、Service Worker 快取範圍。
- `qa/color-before.json`、`qa/verification.json`、`qa/export-verification.json`：實際結果。
- `qa/*fields.png`、`qa/font-size-sheet.png` 等為視覺檢查圖。

在本機 Node.js 執行 `node qa/verify.cjs` 與 `node qa/verify-exports.cjs`。測試使用已安裝的 Edge 與 Codex bundled Playwright；第一支可用 PLAYWRIGHT_MODULE、STUDIO_ROOT 指定對應路徑。這些工具不屬於網站執行時相依套件。
