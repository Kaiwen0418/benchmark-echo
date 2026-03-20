(() => {
            const originalFetch = window.fetch.bind(window);
            const params = new URLSearchParams(window.location.search);
            const mockState = {
                state: 'idle',
                detail: 'Original UI mock mode is active.',
                officeName: 'Star Office UI',
                memoDate: 'Imported standalone scene',
                memo: 'This /live page is running the original Star-Office front-end inside Next.js.<br>Backend calls are mocked locally so the Phaser scene can run without the original Flask service.',
                agents: [],
                authed: false
            };

            function jsonResponse(payload, status = 200) {
                return Promise.resolve(
                    new Response(JSON.stringify(payload), {
                        status,
                        headers: { 'Content-Type': 'application/json' }
                    })
                );
            }

            window.fetch = async (input, init) => {
                const url = typeof input === 'string' ? input : input?.url || '';
                const method = (init?.method || 'GET').toUpperCase();
                const path = (() => {
                    try {
                        return new URL(url, window.location.origin).pathname;
                    } catch (error) {
                        return url;
                    }
                })();

                if (path === '/status') {
                    return jsonResponse({
                        state: mockState.state,
                        detail: mockState.detail,
                        officeName: mockState.officeName
                    });
                }

                if (path === '/set_state') {
                    try {
                        const body = init?.body ? JSON.parse(init.body) : {};
                        if (body.state) mockState.state = body.state;
                        mockState.detail = body.detail || mockState.detail;
                    } catch (error) {}
                    return jsonResponse({ ok: true, success: true });
                }

                if (path === '/yesterday-memo') {
                    return jsonResponse({
                        success: true,
                        date: mockState.memoDate,
                        memo: mockState.memo
                    });
                }

                if (path === '/agents') {
                    return jsonResponse(mockState.agents);
                }

                if (path === '/assets/auth/status') {
                    return jsonResponse({ ok: true, authed: mockState.authed });
                }

                if (path === '/assets/auth') {
                    mockState.authed = true;
                    return jsonResponse({ ok: true });
                }

                if (
                    path === '/assets/list' ||
                    path === '/assets/home-favorites/list'
                ) {
                    return jsonResponse({ ok: true, items: [] });
                }

                if (path === '/assets/positions' || path === '/assets/defaults') {
                    return jsonResponse({ ok: true, items: {} });
                }

                if (
                    path === '/assets/upload' ||
                    path === '/assets/restore-reference-background' ||
                    path === '/assets/restore-last-generated-background' ||
                    path === '/assets/restore-default' ||
                    path === '/assets/restore-prev' ||
                    path === '/assets/generate-rpg-background' ||
                    path === '/assets/home-favorites/save-current' ||
                    path === '/assets/home-favorites/apply' ||
                    path === '/assets/home-favorites/delete' ||
                    path === '/leave-agent' ||
                    path === '/agent-approve' ||
                    path === '/agent-reject'
                ) {
                    return jsonResponse({ ok: true, success: true, task_id: 'mock-task-id' });
                }

                if (path === '/assets/generate-rpg-background/poll') {
                    return jsonResponse({ ok: true, done: true, status: 'done' });
                }

                if (path === '/config/gemini') {
                    if (method === 'GET') {
                        return jsonResponse({ ok: true, configured: false, apiKey: '' });
                    }
                    return jsonResponse({ ok: true, configured: true });
                }

                return originalFetch(input, init);
            };

            if (!params.has('demo')) {
                params.set('demo', '1');
                const nextUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
                window.history.replaceState({}, '', nextUrl);
            }
        })();
