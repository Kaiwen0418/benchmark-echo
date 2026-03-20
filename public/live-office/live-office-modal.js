// @ts-nocheck
function openAppModal(src, titleKey) {
    const modal = document.getElementById('app-modal');
    const frame = document.getElementById('app-modal-frame');
    const title = document.getElementById('app-modal-title');
    if (!modal || !frame || !title)
        return;
    let finalSrc = src;
    try {
        const url = new URL(src, window.location.origin);
        if (!url.searchParams.has('lang')) {
            url.searchParams.set('lang', uiLang);
        }
        finalSrc = `${url.pathname}${url.search}${url.hash}`;
    }
    catch (e) { }
    title.dataset.dynamic = titleKey || '';
    title.textContent = t(titleKey || 'modalReportTitle');
    frame.src = finalSrc;
    modal.classList.add('open');
}
function closeAppModal() {
    const modal = document.getElementById('app-modal');
    const frame = document.getElementById('app-modal-frame');
    const title = document.getElementById('app-modal-title');
    if (!modal || !frame)
        return;
    modal.classList.remove('open');
    frame.src = 'about:blank';
    if (title) {
        title.dataset.dynamic = '';
        title.textContent = t('modalReportTitle');
    }
}
