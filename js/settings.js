/**
 * 設定管理モジュール
 */
class SettingsManager {
    constructor() {
        this.defaults = {
            username: '',
            theme: 'purple',
            font: 'inter',
        };

        this.themes = {
            purple: {
                label: '💜 パープル',
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
            ocean: {
                label: '🌊 オーシャン',
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
            emerald: {
                label: '🌿 エメラルド',
                primary: '#10b981',
                primaryLight: '#34d399',
                primaryGlow: 'rgba(16, 185, 129, 0.3)',
                secondary: '#8b5cf6',
                secondaryGlow: 'rgba(139, 92, 246, 0.3)',
                bg: '#0a1a14',
                bgCard: '#122a20',
                bgCardBack: '#0e2318',
                surface: '#163028',
                surfaceHover: '#1e4038',
                border: 'rgba(16, 185, 129, 0.15)',
            },
            sakura: {
                label: '🌸 さくら',
                primary: '#ec4899',
                primaryLight: '#f472b6',
                primaryGlow: 'rgba(236, 72, 153, 0.3)',
                secondary: '#f59e0b',
                secondaryGlow: 'rgba(245, 158, 11, 0.3)',
                bg: '#1a0f18',
                bgCard: '#2e1a2a',
                bgCardBack: '#261520',
                surface: '#351e30',
                surfaceHover: '#452a40',
                border: 'rgba(236, 72, 153, 0.15)',
            },
            midnight: {
                label: '🌙 ミッドナイト',
                primary: '#a78bfa',
                primaryLight: '#c4b5fd',
                primaryGlow: 'rgba(167, 139, 250, 0.3)',
                secondary: '#fbbf24',
                secondaryGlow: 'rgba(251, 191, 36, 0.3)',
                bg: '#09090b',
                bgCard: '#18181b',
                bgCardBack: '#131316',
                surface: '#1f1f23',
                surfaceHover: '#2a2a30',
                border: 'rgba(167, 139, 250, 0.15)',
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
        localStorage.removeItem('masteredWords');
        localStorage.removeItem('speechRate');
    }

    resetAll() {
        localStorage.clear();
        this.settings = { ...this.defaults };
    }
}
