// @ts-nocheck

// Shared live-office UI language helpers.
var uiLang = localStorage.getItem('uiLang') || 'en';
var I18N = {
    zh: {
        controlTitle: 'Star 状态',
        btnIdle: '待命', btnWork: '工作', btnSync: '同步', btnError: '报警', btnDecor: '装修房间',
        drawerTitle: '装修房间 · 资产侧边栏', drawerClose: '关闭',
        authTitle: '请输入装修验证码', authPlaceholder: '输入验证码', authVerify: '验证', authDefaultPassHint: '默认密码：1234（可随时让我帮你改，建议改成强密码）',
        drawerVisibilityTip: '可见性：点击条目右侧眼睛按钮切换该资产显示',
        hideDrawer: '👁 隐藏侧边栏', showDrawer: '👁 显示侧边栏',
        assetHide: '隐藏', assetShow: '显示',
        resetToDefault: '重置为默认资产', restorePrevAsset: '用上一版',
        btnMove: '📦 搬新家', btnHome: '🐚 回老家', btnHomeLast: '↩️ 回上一个家', btnHomeFavorite: '⭐ 收藏这个家', btnBroker: '🤝 找中介', btnDIY: '🪚 自己装', btnBrokerGo: '听中介的',
        homeFavTitle: '🏠 收藏的家', homeFavEmpty: '还没有收藏，先点“⭐ 收藏这个家”', homeFavApply: '替换到当前地图', homeFavDelete: '删除', homeFavSaved: '✅ 已收藏当前地图', homeFavApplied: '✅ 已替换为收藏地图', homeFavDeleted: '🗑️ 已删除收藏',
        brokerHint: '你会给龙虾推荐什么样的房子',
        brokerPromptPh: '例如：故宫主题、莫奈风格、地牢主题、兵马俑主题……',
        brokerNeedPrompt: '请先输入中介方案描述',
        brokerGenerating: '🏘️ 正在按中介方案生成底图，请稍候（约20-90秒）...',
        brokerDone: '✅ 已按中介方案生成并替换底图，正在刷新房间...',
        moveSuccess: '✅ 搬家成功！',
        brokerMissingKey: '❌ 生图失败：缺少 GEMINI API Key，请在下方填写并保存后重试',
        geminiPanelTitle: '🔐 API 设置（可折叠）', geminiHint: '可选：填写你的生图 API Key（留空不影响基础功能）', geminiApiDoc: '📘 如何申请 Google API Key', geminiInputPh: '粘贴 GEMINI_API_KEY（不会回显）', geminiSaveKey: '保存 Key', geminiMaskNoKey: '当前状态：未配置 Key', geminiMaskHasKey: '当前已配置：',
        speedModeLabel: '生成模式', speedFast: '🍌2', speedQuality: '🍌Pro',
        searchPlaceholder: '搜索资产名（如 desk / sofa / star）', loaded: '已加载', allAssets: '全部资产',
        chooseImage: '上传素材', confirmUpload: '确认刷新', resetToDefault: '重置默认', restorePrevAsset: '恢复上版', uploadPending: '待上传', uploadTarget: '目标',
        assetHintNotInScene: '当前场景未检测到此对象，仍可替换文件（刷新后生效）',
        assetHintDefault: '通用素材：建议保持原图尺寸、透明通道与视觉重心一致，避免错位或失真',
        showCoords: '显示坐标', hideCoords: '隐藏坐标', moveView: '移动视野', lockView: '锁定视野',
        memoTitle: '昨 日 小 记', actionsTitle: '测 试 导 航', actionHint: '这里不再显示 guest。右侧面板改成主页与测试相关入口。', navHome: '返回主页', navRuns: '运行列表', navStart: '开始测试', navReport: '查看报告', modalHomeTitle: '主页', modalRunsTitle: '运行列表', modalStartTitle: '开始测试', modalReportTitle: '完整评估报告', modalClose: '关闭', officeTitle: '海辛小龙虾的办公室',
        loadingOffice: '正在加载 Star 的像素办公室...'
    },
    en: {
        controlTitle: 'Star Status',
        btnIdle: 'Idle', btnWork: 'Work', btnSync: 'Sync', btnError: 'Alert', btnDecor: 'Decorate Room',
        drawerTitle: 'Decorate Room · Asset Sidebar', drawerClose: 'Close',
        authTitle: 'Enter Decor Passcode', authPlaceholder: 'Enter passcode', authVerify: 'Verify', authDefaultPassHint: 'Default passcode: 1234 (ask me anytime to change it; stronger passcode recommended)',
        drawerVisibilityTip: 'Visibility: use the eye button on each row to hide/show that asset',
        hideDrawer: '👁 Hide Drawer', showDrawer: '👁 Show Drawer',
        assetHide: 'Hide', assetShow: 'Show',
        resetToDefault: 'Reset to Default', restorePrevAsset: 'Use Previous',
        btnMove: '📦 New Home', btnHome: '🐚 Go Home', btnHomeLast: '↩️ Last One', btnHomeFavorite: '⭐ Save This Home', btnBroker: '🤝 Broker', btnDIY: '🪚 DIY', btnBrokerGo: 'Follow Broker',
        homeFavTitle: '🏠 Saved Homes', homeFavEmpty: 'No saved homes yet. Tap “⭐ Save This Home” first.', homeFavApply: 'Apply to Current Map', homeFavDelete: 'Delete', homeFavSaved: '✅ Current map saved', homeFavApplied: '✅ Applied saved home', homeFavDeleted: '🗑️ Saved home deleted',
        brokerHint: 'What kind of house would you recommend for Lobster?',
        brokerPromptPh: 'e.g. Forbidden City theme, Monet style, dungeon theme, Terracotta Warriors theme...',
        brokerNeedPrompt: 'Please enter broker style prompt first',
        brokerGenerating: '🏘️ Generating room background from broker plan, please wait (20-90s)...',
        brokerDone: '✅ Broker plan applied and background replaced, refreshing room...',
        moveSuccess: '✅ Move successful!',
        brokerMissingKey: '❌ Generation failed: missing GEMINI API key. Fill it below and retry.',
        geminiPanelTitle: '🔐 API Settings (collapsible)', geminiHint: 'Optional: set your image API key (base features work without it)', geminiApiDoc: '📘 How to get a Google API Key', geminiInputPh: 'Paste GEMINI_API_KEY (input hidden)', geminiSaveKey: 'Save Key', geminiMaskNoKey: 'Current: no key configured', geminiMaskHasKey: 'Configured key:',
        speedModeLabel: 'Render Mode', speedFast: '🍌2', speedQuality: '🍌Pro',
        searchPlaceholder: 'Search assets (desk / sofa / star)', loaded: 'Loaded', allAssets: 'All Assets',
        chooseImage: 'Upload Asset', confirmUpload: 'Apply Refresh', resetToDefault: 'Reset Default', restorePrevAsset: 'Restore Prev', uploadPending: 'Pending Upload', uploadTarget: 'Target',
        assetHintNotInScene: 'This object is not detected in current scene; you can still replace file (effective after refresh)',
        assetHintDefault: 'Generic asset: keep source size, alpha channel, and visual anchor to avoid drift/distortion',
        showCoords: 'Show Coords', hideCoords: 'Hide Coords', moveView: 'Pan View', lockView: 'Lock View',
        memoTitle: 'YESTERDAY NOTES', actionsTitle: 'BENCHMARK NAV', actionHint: 'Guest mode is removed here. This panel now links back to home, runs, and reports.', navHome: 'Back Home', navRuns: 'Run List', navStart: 'Start Test', navReport: 'View Report', modalHomeTitle: 'Home', modalRunsTitle: 'Run List', modalStartTitle: 'Start Test', modalReportTitle: 'Evaluation Report', modalClose: 'Close', officeTitle: 'Haixin Lobster Office',
        loadingOffice: 'Loading Star’s pixel office...'
    },
    ja: {
        controlTitle: 'Star ステータス',
        btnIdle: '待機', btnWork: '作業', btnSync: '同期', btnError: '警報', btnDecor: '部屋を編集',
        drawerTitle: '部屋編集・アセットサイドバー', drawerClose: '閉じる',
        authTitle: '編集パスコードを入力', authPlaceholder: 'パスコード入力', authVerify: '認証', authDefaultPassHint: '初期パスコード：1234（いつでも変更を相談可。強固なパス推奨）',
        drawerVisibilityTip: '表示切替：各行右側の目ボタンで資産を表示/非表示',
        hideDrawer: '👁 サイドバーを隠す', showDrawer: '👁 サイドバーを表示',
        assetHide: '非表示', assetShow: '表示',
        resetToDefault: 'デフォルトへ戻す', restorePrevAsset: '前の版へ戻す',
        btnMove: '📦 引っ越し', btnHome: '🐚 実家に戻る', btnHomeLast: '↩️ ひとつ前へ', btnHomeFavorite: '⭐ この家を保存', btnBroker: '🤝 仲介', btnDIY: '🪚 自分で装飾', btnBrokerGo: '仲介に任せる',
        homeFavTitle: '🏠 保存した家', homeFavEmpty: 'まだ保存がありません。先に「⭐ この家を保存」を押してください。', homeFavApply: '現在のマップに適用', homeFavDelete: '削除', homeFavSaved: '✅ 現在のマップを保存しました', homeFavApplied: '✅ 保存した家を適用しました', homeFavDeleted: '🗑️ 保存した家を削除しました',
        brokerHint: 'ロブスターにはどんな家をおすすめしますか',
        brokerPromptPh: '例：故宮テーマ、モネ風、ダンジョン風、兵馬俑テーマ…',
        brokerNeedPrompt: '先に仲介プランの説明を入力してください',
        brokerGenerating: '🏘️ 仲介プランで背景を生成中（20〜90秒）...',
        brokerDone: '✅ 仲介プランを適用して背景を更新しました。部屋を更新中...',
        moveSuccess: '✅ 引っ越し成功！',
        brokerMissingKey: '❌ 生成失敗：GEMINI APIキーが未設定です。下で入力して保存してください。',
        geminiPanelTitle: '🔐 API設定（折りたたみ）', geminiHint: '任意：画像生成APIキーを設定（未設定でも基本機能は利用可）', geminiApiDoc: '📘 Google API Keyの取得方法', geminiInputPh: 'GEMINI_API_KEY を貼り付け（入力は非表示）', geminiSaveKey: 'Keyを保存', geminiMaskNoKey: '現在：キー未設定', geminiMaskHasKey: '設定済みキー：',
        speedModeLabel: '生成モード', speedFast: '🍌2', speedQuality: '🍌Pro',
        searchPlaceholder: 'アセット検索（desk / sofa / star）', loaded: '読み込み済み', allAssets: '全アセット',
        chooseImage: '素材アップロード', confirmUpload: '確定して更新', resetToDefault: '初期に戻す', restorePrevAsset: '前版に戻す', uploadPending: 'アップロード待ち', uploadTarget: '対象',
        assetHintNotInScene: '現在のシーンでこのオブジェクトは未検出です。ファイル差し替えは可能（更新後に反映）',
        assetHintDefault: '汎用素材：元サイズ・透過・視覚アンカーを維持し、ズレや崩れを防いでください',
        showCoords: '座標表示', hideCoords: '座標非表示', moveView: '視点移動', lockView: '視点固定',
        memoTitle: '昨日のメモ', actionsTitle: 'テスト案内', actionHint: 'ここでは guest を表示しません。右パネルはホームとテスト導線です。', navHome: 'ホームへ', navRuns: '実行一覧', navStart: 'テスト開始', navReport: 'レポート', modalHomeTitle: 'ホーム', modalRunsTitle: '実行一覧', modalStartTitle: 'テスト開始', modalReportTitle: '評価レポート', modalClose: '閉じる', officeTitle: 'ハイシン・ロブスターのオフィス',
        loadingOffice: 'Star のピクセルオフィスを読み込み中...'
    }
};

function t(key) { return (I18N[uiLang] && I18N[uiLang][key]) || key; }

function renderBootLoadingText(percent) {
    const loadingEl = document.getElementById('loading-text');
    if (!loadingEl) return;
    const base = t('loadingOffice');
    const p = Number.isFinite(percent) ? ` ${Math.max(0, Math.min(100, Math.round(percent)))}%` : '';
    loadingEl.textContent = `${base}${p}`;
}

function ensureMemoBgVisible() {
    const panel = document.getElementById('memo-panel');
    if (!panel) return;
    panel.style.backgroundImage = "url('/live-office/static/memo-bg.webp?v={{VERSION_TIMESTAMP}}')";
    panel.classList.remove('no-bg');
}

function applyLanguage() {
    const setText = (id, key) => { const el = document.getElementById(id); if (el) el.textContent = t(key); };
    const setPh = (id, key) => { const el = document.getElementById(id); if (el) el.placeholder = t(key); };

    setText('control-bar-title', 'controlTitle');
    setText('btn-state-idle', 'btnIdle');
    setText('btn-state-writing', 'btnWork');
    setText('btn-state-syncing', 'btnSync');
    setText('btn-state-error', 'btnError');
    setText('btn-open-drawer', 'btnDecor');
    const langButtons = [
        { id: 'lang-btn-en', lang: 'en' },
        { id: 'lang-btn-jp', lang: 'ja' },
        { id: 'lang-btn-cn', lang: 'zh' }
    ];
    langButtons.forEach(({ id, lang }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const active = (uiLang === lang);
        el.style.background = active ? '#22c55e' : '#333';
        el.style.borderColor = active ? '#22c55e' : '#333';
        el.style.color = '#fff';
    });

    const drawerTitle = document.querySelector('#asset-drawer-header span');
    if (drawerTitle) drawerTitle.textContent = t('drawerTitle');
    const drawerClose = document.getElementById('btn-close-drawer');
    if (drawerClose) drawerClose.textContent = t('drawerClose');

    const authTitle = document.querySelector('#asset-auth-gate .asset-preview-title');
    if (authTitle) authTitle.textContent = t('authTitle');
    setPh('asset-pass-input', 'authPlaceholder');
    const authVerifyBtn = document.querySelector('#asset-auth-gate .asset-toolbar button');
    if (authVerifyBtn) authVerifyBtn.textContent = t('authVerify');

    setText('btn-move-house', 'btnMove');
    setText('btn-back-home', 'btnHome');
    const brokerBtn = document.querySelector('#asset-broker-row .btn-broker'); if (brokerBtn) brokerBtn.textContent = t('btnBroker');
    const diyBtn = document.querySelector('#asset-broker-row .btn-diy'); if (diyBtn) diyBtn.textContent = t('btnDIY');
    const backLastBtn = document.getElementById('btn-back-last-bg'); if (backLastBtn) backLastBtn.textContent = t('btnHomeLast');
    const favHomeBtn = document.getElementById('btn-favorite-home'); if (favHomeBtn) favHomeBtn.textContent = t('btnHomeFavorite');
    const favTitle = document.getElementById('asset-home-favorites-title'); if (favTitle) favTitle.textContent = t('homeFavTitle');
    const brokerHint = document.querySelector('#asset-broker-panel .asset-sub'); if (brokerHint) brokerHint.textContent = t('brokerHint');
    const brokerPrompt = document.getElementById('asset-broker-prompt'); if (brokerPrompt) brokerPrompt.placeholder = t('brokerPromptPh');
    const brokerGoBtn = document.querySelector('#asset-broker-actions button'); if (brokerGoBtn) brokerGoBtn.textContent = t('btnBrokerGo');
    const speedLbl = document.getElementById('speed-mode-label'); if (speedLbl) speedLbl.textContent = t('speedModeLabel');
    const speedFastBtn = document.getElementById('speed-fast-btn'); if (speedFastBtn) speedFastBtn.textContent = t('speedFast');
    const speedQualityBtn = document.getElementById('speed-quality-btn'); if (speedQualityBtn) speedQualityBtn.textContent = t('speedQuality');
    const geminiPanelSummary = document.getElementById('gemini-panel-summary'); if (geminiPanelSummary) geminiPanelSummary.textContent = t('geminiPanelTitle');
    const geminiHint = document.getElementById('gemini-config-hint'); if (geminiHint) geminiHint.textContent = t('geminiHint');
    const geminiDocLink = document.getElementById('gemini-api-doc-link'); if (geminiDocLink) geminiDocLink.textContent = t('geminiApiDoc');
    const geminiInput = document.getElementById('gemini-api-key-input'); if (geminiInput) geminiInput.placeholder = t('geminiInputPh');
    const geminiSaveBtn = document.getElementById('btn-save-gemini-key'); if (geminiSaveBtn) geminiSaveBtn.textContent = t('geminiSaveKey');

    setPh('asset-search', 'searchPlaceholder');

    setText('asset-choose-btn', 'chooseImage');
    setText('asset-commit-refresh-btn', 'confirmUpload');
    setText('asset-reset-default-btn', 'resetToDefault');
    setText('asset-restore-prev-btn', 'restorePrevAsset');

    const memoTitle = document.getElementById('memo-title');
    if (memoTitle) memoTitle.textContent = t('memoTitle');
    const actionsTitle = document.getElementById('guest-agent-panel-title');
    if (actionsTitle) actionsTitle.textContent = t('actionsTitle');
    const actionHint = document.getElementById('office-action-hint');
    if (actionHint) actionHint.textContent = t('actionHint');
    setText('nav-home', 'navHome');
    setText('nav-runs', 'navRuns');
    setText('nav-start-test', 'navStart');
    setText('nav-report', 'navReport');
    const modalTitle = document.getElementById('app-modal-title');
    if (modalTitle && !modalTitle.dataset.dynamic) {
        modalTitle.textContent = t('modalReportTitle');
    }
    setText('app-modal-close', 'modalClose');
    const plaqueTitle = (typeof window.officeNameFromServer !== 'undefined' && window.officeNameFromServer) || t('officeTitle');
    if (window.officePlaqueText && window.officePlaqueText.setText) {
        window.officePlaqueText.setText(plaqueTitle);
    }

    const coordsBtn = document.getElementById('coords-toggle');
    if (coordsBtn) coordsBtn.textContent = showCoords ? t('hideCoords') : t('showCoords');
    const panBtn = document.getElementById('pan-toggle');
    if (panBtn) {
        const on = panBtn.dataset.on === '1';
        panBtn.textContent = on ? t('lockView') : t('moveView');
    }
    ensureMemoBgVisible();
    renderBootLoadingText(Number(loadingProgressBar?.style?.width?.replace('%','') || 0));
}

function setUILanguage(lang) {
    if (!['zh', 'en', 'ja'].includes(lang)) return;
    uiLang = lang;
    localStorage.setItem('uiLang', uiLang);
    applyLanguage();
    updateSpeedModeUI();
    renderAssetDrawerList();

    if (selectedAssetInfo && selectedAssetInfo.path) {
        const inScene = !!mapAssetPathToSprite(selectedAssetInfo.path);
        renderSelectedAssetGuidance(selectedAssetInfo.path, inScene);
    }

    const overlay = document.getElementById('room-loading-overlay');
    if (overlay && overlay.style.display === 'flex') {
        showRoomLoadingOverlay();
    }
}
