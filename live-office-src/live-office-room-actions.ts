// @ts-nocheck

function placeOverlayAndStatusAtCanvasBottomLeft() {
    const canvasEl = game?.canvas || document.querySelector('#game-container canvas');
    const fallbackBox = document.getElementById('game-container');
    const rect = canvasEl?.getBoundingClientRect?.() || fallbackBox?.getBoundingClientRect?.();

    const overlay = document.getElementById('room-loading-overlay');
    if (overlay) {
        if (!rect || !(rect.width > 0 && rect.height > 0)) {
            overlay.style.left = '0px';
            overlay.style.top = '0px';
            overlay.style.width = window.innerWidth + 'px';
            overlay.style.height = window.innerHeight + 'px';
        } else {
            overlay.style.left = rect.left + 'px';
            overlay.style.top = rect.top + 'px';
            overlay.style.width = rect.width + 'px';
            overlay.style.height = rect.height + 'px';
        }
    }

    const st = document.getElementById('status-text');
    const gameContainer = document.getElementById('game-container');
    if (st && gameContainer) {
        if (rect && rect.width > 0 && rect.height > 0) {
            const localLeft = Math.max(8, Math.round(rect.left - gameContainer.getBoundingClientRect().left + 14));
            const localBottom = 14;
            st.style.left = localLeft + 'px';
            st.style.bottom = localBottom + 'px';
            st.style.maxWidth = Math.max(120, Math.floor(rect.width - 28)) + 'px';
        } else {
            st.style.left = '14px';
            st.style.bottom = '14px';
            st.style.maxWidth = 'calc(100% - 28px)';
        }
    }
}

function showRoomLoadingOverlay(baseText) {
    const overlay = document.getElementById('room-loading-overlay');
    const textEl = document.getElementById('room-loading-text');
    const emojiEl = document.getElementById('room-loading-emoji');
    if (!overlay || !textEl || !emojiEl) return;

    placeOverlayAndStatusAtCanvasBottomLeft();
    const loadingTexts = {
        zh: [
            '正在打包今天的灵感行李……',
            '正在抽取下一站数字坐标……',
            '正在查看本次漂流目的地……',
            '正在把办公室折叠成随身模式……',
            '正在给钳子装上远行 Buff……',
            '正在匹配下一段创作气候……',
            '正在把时差调成冒险模式……',
            '正在接收陌生街区的 Wi‑Fi 心跳……',
            '正在试播下一站的海风 BGM……',
            '正在加载“也许会爱上”的新房间……',
            '正在为未知邻居准备自我介绍……',
            '正在解锁下一片数字海域……',
            '正在把好奇心调到满格……',
            '正在等待旅程投递下一张门牌号……'
        ],
        en: [
            'Packing today’s luggage of inspiration…',
            'Drawing the digital coordinates for the next stop…',
            'Checking the destination of this drift…',
            'Folding the office into portable mode…',
            'Installing a travel buff on the claws…',
            'Matching the creative climate for the next chapter…',
            'Switching the time zone to adventure mode…',
            'Receiving Wi‑Fi heartbeats from an unfamiliar block…',
            'Previewing the sea-breeze BGM of the next stop…',
            'Loading a new room you might just fall in love with…',
            'Preparing an intro for unknown neighbors…',
            'Unlocking the next digital sea…',
            'Turning curiosity up to max…',
            'Waiting for the journey to deliver the next door number…'
        ],
        ja: [
            '今日のひらめき荷物を梱包しています……',
            '次の目的地のデジタル座標を抽出しています……',
            '今回の漂流先を確認しています……',
            'オフィスを携帯モードに折りたたんでいます……',
            'ハサミに遠征 Buff を装着しています……',
            '次の創作区間の気候をマッチングしています……',
            '時差を冒険モードに切り替えています……',
            '見知らぬ街区の Wi‑Fi ハートビートを受信しています……',
            '次の目的地の潮風 BGM を試聴しています……',
            '「好きになるかもしれない」新しい部屋を読み込んでいます……',
            '未知のご近所さん向けに自己紹介を準備しています……',
            '次のデジタル海域をアンロックしています……',
            '好奇心を最大値まで上げています……',
            '旅が次の番地を届けるのを待っています……'
        ]
    };
    const steps = loadingTexts[uiLang] || loadingTexts.zh;
    const emojis = ['🦞','🦀','🦐','🦑','🐙','🐟','🐠','🐡','🦪','🍣','🍤','🍱','🍲','🍜','🍝','🌊','🐚','🪸'];

    roomLoadingIndex = 0;
    roomLoadingEmojiIndex = 0;
    textEl.textContent = baseText || steps[0];
    emojiEl.textContent = emojis[0];
    overlay.style.display = 'flex';
    if (roomLoadingTimer) clearInterval(roomLoadingTimer);
    roomLoadingTimer = setInterval(() => {
        roomLoadingIndex = (roomLoadingIndex + 1) % steps.length;
        roomLoadingEmojiIndex = (roomLoadingEmojiIndex + 1) % emojis.length;
        textEl.textContent = steps[roomLoadingIndex];
        emojiEl.textContent = emojis[roomLoadingEmojiIndex];
    }, 900);
}

function hideRoomLoadingOverlay() {
    const overlay = document.getElementById('room-loading-overlay');
    if (roomLoadingTimer) {
        clearInterval(roomLoadingTimer);
        roomLoadingTimer = null;
    }
    if (overlay) overlay.style.display = 'none';
}

async function refreshOfficeBackgroundOnly() {
    return await refreshSceneObjectByAssetPath('office_bg_small.webp');
}

function markMoveSuccess(outEl, btnEl = null) {
    if (outEl) outEl.textContent = t('moveSuccess');
    if (btnEl) setButtonDone(btnEl);
    try { setState('idle', t('moveSuccess').replace('✅ ', '')); } catch (e) {}
}

function setWorkingStatus(detail = '工作中') {
    try { setState('writing', detail); } catch (e) {}
}

async function ensureGeminiConfigLoaded() {
    try {
        const authRes = await fetch('/assets/auth/status', { cache: 'no-store' });
        const authData = await authRes.json();
        assetDrawerAuthed = !!(authData && authData.ok && authData.authed);
        updateAssetAuthUI();
        if (!assetDrawerAuthed) return;

        const res = await fetch('/config/gemini', { cache: 'no-store' });
        const data = await res.json();
        if (data && data.ok) {
            window.geminiConfig = {
                hasKey: !!data.has_api_key,
                model: data.gemini_model || 'nanobanana-pro'
            };
            const box = document.getElementById('asset-gemini-config');
            if (box) box.style.display = 'block';
            const ms = document.getElementById('gemini-mask-status');
            if (ms) {
                ms.textContent = data.has_api_key
                    ? `${t('geminiMaskHasKey')} ${data.api_key_masked || ''}`
                    : t('geminiMaskNoKey');
            }
        }
    } catch (e) {}
}

async function saveGeminiConfigFromUI() {
    const input = document.getElementById('gemini-api-key-input');
    const msg = document.getElementById('gemini-config-msg');
    const key = (input?.value || '').trim();
    if (!key) {
        if (msg) msg.textContent = '请输入有效 API Key';
        return;
    }
    try {
        const res = await fetch('/config/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ api_key: key, model: 'nanobanana-pro' })
        });
        const data = await res.json();
        if (!data.ok) {
            if (msg) msg.textContent = `保存失败：${data.msg || res.status}`;
            return;
        }
        if (msg) msg.textContent = '✅ 已保存，可重新点击搬家/中介';
        const box = document.getElementById('asset-gemini-config');
        if (box) box.style.display = 'none';
        await ensureGeminiConfigLoaded();
    } catch (e) {
        if (msg) msg.textContent = `保存失败：${e}`;
    }
}

function flashButtonActive(el, ms = 180) {
    if (!el) return;
    el.classList.add('is-active');
    setTimeout(() => el.classList.remove('is-active'), ms);
}

function setButtonDone(el, holdMs = 1200) {
    if (!el) return;
    el.classList.remove('is-active');
    el.classList.add('is-done');
    setTimeout(() => el.classList.remove('is-done'), holdMs);
}

async function _startAndPollGeneration(body, out, progressMsg) {
    const res = await fetch('/assets/generate-rpg-background', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!data.ok) return data;
    if (!data.async || !data.task_id) return data;

    const taskId = data.task_id;
    const maxPollTime = 300000;
    const pollInterval = 3000;
    const startTime = Date.now();
    let dots = 0;

    while (Date.now() - startTime < maxPollTime) {
        await new Promise(r => setTimeout(r, pollInterval));
        dots = (dots + 1) % 4;
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        out.textContent = progressMsg + '（已等待 ' + elapsed + '秒）' + '.'.repeat(dots);
        try {
            const pollRes = await fetch('/assets/generate-rpg-background/poll?task_id=' + encodeURIComponent(taskId));
            const pollData = await pollRes.json();
            if (pollData.status === 'pending') continue;
            return pollData;
        } catch (pollErr) {
            continue;
        }
    }
    return { ok: false, msg: '生图超时（超过5分钟），请重试' };
}

function _handleGenError(data, out) {
    if (data.code === 'MISSING_API_KEY') {
        out.textContent = t('brokerMissingKey');
        const box = document.getElementById('asset-gemini-config');
        if (box) box.style.display = 'block';
    } else if (data.code === 'API_KEY_REVOKED_OR_LEAKED') {
        out.textContent = '❌ 当前 API Key 已失效/疑似泄露，请更换新 Key 后重试';
        const box = document.getElementById('asset-gemini-config');
        if (box) box.style.display = 'block';
    } else if (data.code === 'MODEL_NOT_AVAILABLE') {
        out.textContent = '❌ 当前模型在此通道不可用，请切换可用模型后重试' + (data.detail ? ('\n\n详情：' + data.detail) : '');
    } else {
        out.textContent = `❌ 生成失败：${data.msg || 'unknown error'}`;
    }
}

async function generateCustomRpgBackground() {
    const brokerBtn = document.querySelector('#asset-broker-row .btn-broker');
    flashButtonActive(brokerBtn);
    setWorkingStatus('正在处理中介装修方案');
    const out = document.getElementById('asset-move-result') || document.getElementById('asset-upload-result');
    const prompt = (document.getElementById('asset-broker-prompt')?.value || '').trim();
    if (!prompt) {
        out.textContent = t('brokerNeedPrompt');
        return;
    }
    showRoomLoadingOverlay();
    out.textContent = t('brokerGenerating');
    try {
        const data = await _startAndPollGeneration(
            { prompt, speed_mode: speedMode },
            out,
            '🏘️ 正在按中介方案生成底图'
        );
        if (!data.ok) {
            _handleGenError(data, out);
            return;
        }
        out.textContent = t('brokerDone');
        const ok = await refreshOfficeBackgroundOnly();
        if (ok) {
            markMoveSuccess(out, brokerBtn);
        } else {
            out.textContent = '✅ 已生成并替换底图（局部刷新失败，可手动刷新页面）';
        }
    } catch (e) {
        out.textContent = `❌ 生成失败：${e}`;
    } finally {
        hideRoomLoadingOverlay();
    }
}

async function generateRpgBackground() {
    const moveBtn = document.getElementById('btn-move-house');
    flashButtonActive(moveBtn);
    setWorkingStatus('正在搬新家');
    const out = document.getElementById('asset-move-result') || document.getElementById('asset-upload-result');
    showRoomLoadingOverlay();
    out.textContent = '🧳 正在打包行李，请稍后（约30~120秒）';
    try {
        const data = await _startAndPollGeneration(
            { speed_mode: speedMode },
            out,
            '🧳 正在生成新房间'
        );
        if (!data.ok) {
            _handleGenError(data, out);
            return;
        }
        out.textContent = '✅ 已生成并替换底图，正在刷新房间...';
        const ok = await refreshOfficeBackgroundOnly();
        if (ok) {
            markMoveSuccess(out, moveBtn);
        } else {
            out.textContent = '✅ 已生成并替换底图（局部刷新失败，可手动刷新页面）';
        }
    } catch (e) {
        out.textContent = `❌ 生成失败：${e}`;
    } finally {
        hideRoomLoadingOverlay();
    }
}

async function restoreHomeBackground() {
    const homeBtn = document.getElementById('btn-back-home');
    flashButtonActive(homeBtn);
    const out = document.getElementById('asset-move-result') || document.getElementById('asset-upload-result');

    const confirmMsg = '⚠️ 回老家会覆盖当前自定义房间背景（可从 bg-history 恢复历史图）。\n确定继续吗？';
    if (!window.confirm(confirmMsg)) {
        out.textContent = '已取消回老家';
        return;
    }

    setWorkingStatus('正在回老家');
    showRoomLoadingOverlay();
    out.textContent = '🏡 正在回老家（恢复初始底图）...';
    try {
        const res = await fetch('/assets/restore-reference-background', { method: 'POST' });
        const data = await res.json();
        if (!data.ok) {
            out.textContent = `❌ 恢复失败：${data.msg || res.status}`;
            return;
        }
        out.textContent = '✅ 已恢复初始底图';
        const ok = await refreshOfficeBackgroundOnly();
        if (ok) {
            markMoveSuccess(out, homeBtn);
        } else {
            out.textContent = '✅ 已恢复初始底图（局部刷新失败，可手动刷新页面）';
        }
    } catch (e) {
        out.textContent = `❌ 恢复失败：${e}`;
    } finally {
        hideRoomLoadingOverlay();
    }
}

async function restoreLastGeneratedBackground() {
    const btn = document.getElementById('btn-back-last-bg');
    flashButtonActive(btn);
    const out = document.getElementById('asset-move-result') || document.getElementById('asset-upload-result');

    const confirmMsg = '⚠️ 将回退到最近一次生成的房间背景，确定继续吗？';
    if (!window.confirm(confirmMsg)) {
        out.textContent = '已取消回退';
        return;
    }

    setWorkingStatus('正在回退到上一次背景');
    showRoomLoadingOverlay();
    out.textContent = '↩️ 正在回退到最近一次生成底图...';
    try {
        const res = await fetch('/assets/restore-last-generated-background', { method: 'POST' });
        const data = await res.json();
        if (!data.ok) {
            out.textContent = `❌ 回退失败：${data.msg || res.status}`;
            return;
        }
        const ok = await refreshOfficeBackgroundOnly();
        if (ok) {
            out.textContent = '✅ 已回退到上一次背景';
        } else {
            out.textContent = '✅ 已回退到上一次背景（局部刷新失败，可手动刷新页面）';
        }
        try { setState('idle', '已回退到上一次背景'); } catch (e) {}
    } catch (e) {
        out.textContent = `❌ 回退失败：${e}`;
    } finally {
        hideRoomLoadingOverlay();
    }
}

async function fetchJsonSafe(url, options = {}) {
    const res = await fetch(url, options);
    const ct = (res.headers.get('content-type') || '').toLowerCase();
    if (!ct.includes('application/json')) {
        const txt = await res.text();
        const brief = (txt || '').replace(/\s+/g, ' ').slice(0, 120);
        throw new Error(`接口未返回 JSON（${res.status}）: ${brief || 'empty response'}`);
    }
    return await res.json();
}

async function renderHomeFavorites(force = false) {
    const box = document.getElementById('asset-home-favorites-list');
    if (!box) return;
    const now = Date.now();
    if (force || homeFavoritesCache.length === 0 || (now - homeFavoritesLoadedAt) >= 30000) {
        try {
            const data = await fetchJsonSafe('/assets/home-favorites/list', { cache: 'no-store' });
            if (data && data.ok && Array.isArray(data.items)) {
                homeFavoritesCache = data.items;
                homeFavoritesLoadedAt = now;
            }
        } catch (e) {
            const out = document.getElementById('asset-move-result') || document.getElementById('asset-upload-result');
            if (out) out.textContent = `❌ 收藏列表加载失败：${e.message || e}`;
        }
    }

    if (!homeFavoritesCache.length) {
        box.innerHTML = `<div class="asset-sub" style="padding:4px 2px;">${t('homeFavEmpty')}</div>`;
        return;
    }

    box.innerHTML = homeFavoritesCache.map((it) => {
        const id = (it.id || '').replace(/'/g, "\\'");
        const thumb = it.thumb_url || it.url || '';
        const time = it.created_at || '';
        return `<div class="home-fav-item">
            <img src="${thumb}" loading="lazy" alt="favorite-home" />
            <div class="home-fav-meta">${time}</div>
            <button onclick="applyHomeFavorite('${id}')">${t('homeFavApply')}</button>
            <button class="home-fav-del" onclick="deleteHomeFavorite('${id}')">${t('homeFavDelete')}</button>
        </div>`;
    }).join('');
}

async function saveCurrentHomeFavorite() {
    const btn = document.getElementById('btn-favorite-home');
    flashButtonActive(btn);
    const out = document.getElementById('asset-move-result') || document.getElementById('asset-upload-result');
    try {
        const data = await fetchJsonSafe('/assets/home-favorites/save-current', { method: 'POST' });
        if (!data.ok) {
            out.textContent = `❌ 收藏失败：${data.msg || 'unknown error'}`;
            return;
        }
        out.textContent = t('homeFavSaved');
        await renderHomeFavorites(true);
    } catch (e) {
        out.textContent = `❌ 收藏失败：${e.message || e}`;
    }
}

async function applyHomeFavorite(id) {
    const out = document.getElementById('asset-move-result') || document.getElementById('asset-upload-result');
    if (!id) return;
    showRoomLoadingOverlay();
    setWorkingStatus('正在替换收藏地图');
    try {
        const data = await fetchJsonSafe('/assets/home-favorites/apply', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if (!data.ok) {
            out.textContent = `❌ 替换失败：${data.msg || 'unknown error'}`;
            return;
        }
        const ok = await refreshOfficeBackgroundOnly();
        out.textContent = ok ? t('homeFavApplied') : `${t('homeFavApplied')}（局部刷新失败，可手动刷新页面）`;
        try { setState('idle', '已应用收藏地图'); } catch (e) {}
    } catch (e) {
        out.textContent = `❌ 替换失败：${e.message || e}`;
    } finally {
        hideRoomLoadingOverlay();
    }
}

async function deleteHomeFavorite(id) {
    const out = document.getElementById('asset-move-result') || document.getElementById('asset-upload-result');
    if (!id) return;
    if (!window.confirm('确定删除这个收藏吗？删除后不可恢复。')) return;
    try {
        const data = await fetchJsonSafe('/assets/home-favorites/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        if (!data.ok) {
            out.textContent = `❌ 删除失败：${data.msg || 'unknown error'}`;
            return;
        }
        out.textContent = t('homeFavDeleted');
        await renderHomeFavorites(true);
    } catch (e) {
        out.textContent = `❌ 删除失败：${e.message || e}`;
    }
}
