/**
 * 設定管理モジュール
 */
class SettingsManager {
    constructor() {
        this.defaults = {
            username: '',
            theme: 'midnight',
            font: 'inter',
        };

        this.themes = {
            // ── Z世代向け ──
            neon: {
                label: '⚡ ネオン',
                category: 'Z世代',
                primary: '#00f5d4',
                primaryLight: '#00ffe0',
                primaryGlow: 'rgba(0, 245, 212, 0.3)',
                secondary: '#f15bb5',
                secondaryGlow: 'rgba(241, 91, 181, 0.3)',
                bg: '#0a0a12',
                bgCard: '#111125',
                bgCardBack: '#0d0d22',
                surface: '#15152d',
                surfaceHover: '#1e1e40',
                border: 'rgba(0, 245, 212, 0.15)',
            },
            retrowave: {
                label: '🌆 レトロウェーブ',
                category: 'Z世代',
                primary: '#ff6ec7',
                primaryLight: '#ff9de2',
                primaryGlow: 'rgba(255, 110, 199, 0.3)',
                secondary: '#7df9ff',
                secondaryGlow: 'rgba(125, 249, 255, 0.3)',
                bg: '#120821',
                bgCard: '#1e1038',
                bgCardBack: '#180c30',
                surface: '#241445',
                surfaceHover: '#301a58',
                border: 'rgba(255, 110, 199, 0.15)',
            },
            sunset: {
                label: '🔥 サンセット',
                category: 'Z世代',
                primary: '#ff6b35',
                primaryLight: '#ff8f65',
                primaryGlow: 'rgba(255, 107, 53, 0.3)',
                secondary: '#ffd166',
                secondaryGlow: 'rgba(255, 209, 102, 0.3)',
                bg: '#120c08',
                bgCard: '#1f150d',
                bgCardBack: '#1a110a',
                surface: '#261a10',
                surfaceHover: '#332215',
                border: 'rgba(255, 107, 53, 0.15)',
            },
            aurora: {
                label: '🦋 オーロラ',
                category: 'Z世代',
                primary: '#a855f7',
                primaryLight: '#c084fc',
                primaryGlow: 'rgba(168, 85, 247, 0.3)',
                secondary: '#22d3ee',
                secondaryGlow: 'rgba(34, 211, 238, 0.3)',
                bg: '#0c0a1a',
                bgCard: '#161230',
                bgCardBack: '#110e28',
                surface: '#1c1740',
                surfaceHover: '#251f55',
                border: 'rgba(168, 85, 247, 0.15)',
            },

            // ── 上品・落ち着き ──
            mocha: {
                label: '🤎 モカ',
                category: 'エレガント',
                primary: '#c4a882',
                primaryLight: '#d4bc9a',
                primaryGlow: 'rgba(196, 168, 130, 0.25)',
                secondary: '#8fbc8f',
                secondaryGlow: 'rgba(143, 188, 143, 0.25)',
                bg: '#15120e',
                bgCard: '#221e18',
                bgCardBack: '#1d1a14',
                surface: '#2a2520',
                surfaceHover: '#353028',
                border: 'rgba(196, 168, 130, 0.15)',
            },
            ivory: {
                label: '🕊️ アイボリー',
                category: 'エレガント',
                primary: '#8b7355',
                primaryLight: '#a0896d',
                primaryGlow: 'rgba(139, 115, 85, 0.25)',
                secondary: '#7c9885',
                secondaryGlow: 'rgba(124, 152, 133, 0.25)',
                bg: '#f5f0e8',
                bgCard: '#ebe5d9',
                bgCardBack: '#e6dfce',
                surface: '#ddd6c6',
                surfaceHover: '#d0c8b5',
                border: 'rgba(139, 115, 85, 0.2)',
                textColor: '#3d3427',
                textMuted: '#7a6e5d',
                textDim: '#a09580',
                isLight: true,
            },
            slate: {
                label: '🩶 スレート',
                category: 'エレガント',
                primary: '#7c8db0',
                primaryLight: '#9aadd0',
                primaryGlow: 'rgba(124, 141, 176, 0.25)',
                secondary: '#94a3b8',
                secondaryGlow: 'rgba(148, 163, 184, 0.25)',
                bg: '#111318',
                bgCard: '#1a1d25',
                bgCardBack: '#161920',
                surface: '#21252e',
                surfaceHover: '#2a2f3a',
                border: 'rgba(124, 141, 176, 0.15)',
            },
            rosegold: {
                label: '🌹 ローズゴールド',
                category: 'エレガント',
                primary: '#d4a0a0',
                primaryLight: '#e0b5b5',
                primaryGlow: 'rgba(212, 160, 160, 0.25)',
                secondary: '#b8a9c9',
                secondaryGlow: 'rgba(184, 169, 201, 0.25)',
                bg: '#161012',
                bgCard: '#241a1e',
                bgCardBack: '#1e1519',
                surface: '#2c2024',
                surfaceHover: '#38282e',
                border: 'rgba(212, 160, 160, 0.15)',
            },

            // ── ダーク系 ──
            midnight: {
                label: '🌙 ミッドナイト',
                category: 'ダーク',
                primary: '#6c63ff',
                primaryLight: '#8b85ff',
                primaryGlow: 'rgba(108, 99, 255, 0.3)',
                secondary: '#00d4aa',
                secondaryGlow: 'rgba(0, 212, 170, 0.3)',
                bg: '#0f0f1a',
                bgCard: '#1a1a2e',
                bgCardBack: '#16213e',
                surface: '#1e1e35',
                surfaceHover: '#2a2a45',
                border: 'rgba(108, 99, 255, 0.15)',
            },
            amoled: {
                label: '⬛ ピュアブラック',
                category: 'ダーク',
                primary: '#6366f1',
                primaryLight: '#818cf8',
                primaryGlow: 'rgba(99, 102, 241, 0.3)',
                secondary: '#34d399',
                secondaryGlow: 'rgba(52, 211, 153, 0.3)',
                bg: '#000000',
                bgCard: '#0a0a0a',
                bgCardBack: '#050505',
                surface: '#111111',
                surfaceHover: '#1a1a1a',
                border: 'rgba(99, 102, 241, 0.12)',
            },
            ocean: {
                label: '🌊 ディープオーシャン',
                category: 'ダーク',
                primary: '#0ea5e9',
                primaryLight: '#38bdf8',
                primaryGlow: 'rgba(14, 165, 233, 0.3)',
                secondary: '#06d6a0',
                secondaryGlow: 'rgba(6, 214, 160, 0.3)',
                bg: '#0c1222',
                bgCard: '#132035',
                bgCardBack: '#0f1d30',
                surface: '#172a45',
                surfaceHover: '#1e3a5f',
                border: 'rgba(14, 165, 233, 0.15)',
            },
            carbon: {
                label: '🖤 カーボン',
                category: 'ダーク',
                primary: '#a3a3a3',
                primaryLight: '#d4d4d4',
                primaryGlow: 'rgba(163, 163, 163, 0.2)',
                secondary: '#fbbf24',
                secondaryGlow: 'rgba(251, 191, 36, 0.25)',
                bg: '#0e0e0e',
                bgCard: '#1a1a1a',
                bgCardBack: '#151515',
                surface: '#222222',
                surfaceHover: '#2c2c2c',
                border: 'rgba(163, 163, 163, 0.1)',
            },
        };

        this.fonts = {
            inter: { label: 'Inter (デフォルト)', family: "'Inter', 'Noto Sans JP', -apple-system, sans-serif" },
            rounded: { label: 'M PLUS Rounded', family: "'M PLUS Rounded 1c', 'Noto Sans JP', sans-serif" },
            serif: { label: 'Noto Serif JP', family: "'Noto Serif JP', serif" },
            mono: { label: 'Source Code Pro', family: "'Source Code Pro', 'Noto Sans JP', monospace" },
        };

        this.settings = this._load();
    }

    _load() {
        try {
            const saved = JSON.parse(localStorage.getItem('appSettings') || '{}');
            return { ...this.defaults, ...saved };
        } catch {
            return { ...this.defaults };
        }
    }

    _save() {
        localStorage.setItem('appSettings', JSON.stringify(this.settings));
    }

    get(key) {
        return this.settings[key] ?? this.defaults[key];
    }

    set(key, value) {
        this.settings[key] = value;
        this._save();
    }

    applyTheme(themeId) {
        const theme = this.themes[themeId];
        if (!theme) return;
        this.set('theme', themeId);
        const root = document.documentElement;
        root.style.setProperty('--color-primary', theme.primary);
        root.style.setProperty('--color-primary-light', theme.primaryLight);
        root.style.setProperty('--color-primary-glow', theme.primaryGlow);
        root.style.setProperty('--color-secondary', theme.secondary);
        root.style.setProperty('--color-secondary-glow', theme.secondaryGlow);
        root.style.setProperty('--color-bg', theme.bg);
        root.style.setProperty('--color-bg-card', theme.bgCard);
        root.style.setProperty('--color-bg-card-back', theme.bgCardBack);
        root.style.setProperty('--color-surface', theme.surface);
        root.style.setProperty('--color-surface-hover', theme.surfaceHover);
        root.style.setProperty('--color-border', theme.border);
        document.body.style.background = theme.bg;

        // ライトテーマ対応
        if (theme.isLight) {
            root.style.setProperty('--color-text', theme.textColor || '#e8e8f0');
            root.style.setProperty('--color-text-muted', theme.textMuted || '#8888aa');
            root.style.setProperty('--color-text-dim', theme.textDim || '#555577');
        } else {
            root.style.setProperty('--color-text', '#e8e8f0');
            root.style.setProperty('--color-text-muted', '#8888aa');
            root.style.setProperty('--color-text-dim', '#555577');
        }
    }

    applyFont(fontId) {
        const font = this.fonts[fontId];
        if (!font) return;
        this.set('font', fontId);
        document.documentElement.style.setProperty('--font-main', font.family);
    }

    applyAll() {
        this.applyTheme(this.get('theme'));
        this.applyFont(this.get('font'));
    }

    resetProgress() {
        // レベル別の暗記記録を全て削除
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('masteredWords')) localStorage.removeItem(key);
        });
        localStorage.removeItem('speechRate');
    }

    resetAll() {
        localStorage.clear();
        this.settings = { ...this.defaults };
    }
}
