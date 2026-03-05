/**
 * iOS対応 音声エンジン
 * Web Speech API を使用し、iOS/Safari での音声品質問題に対処
 */
class SpeechEngine {
    constructor() {
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.selectedVoice = null;
        this.isPrimed = false;
        this.isSupported = 'speechSynthesis' in window;
        this.platform = this._detectPlatform();
        this.defaultRate = 0.85;
        this.defaultPitch = 1.0;
        this.isSpeaking = false;

        // 音声設定のデフォルト値（プラットフォーム別）
        this._setPlatformDefaults();

        // 音声リストの読み込み
        if (this.isSupported) {
            this._loadVoices();
            // Chrome等では非同期で音声リストが読み込まれる
            this.synth.addEventListener('voiceschanged', () => this._loadVoices());
        }
    }

    /**
     * プラットフォーム検出
     */
    _detectPlatform() {
        const ua = navigator.userAgent;
        if (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
            return 'ios';
        }
        if (/Mac/.test(navigator.platform)) {
            return 'mac';
        }
        if (/Edg\//.test(ua)) {
            return 'edge';
        }
        if (/Chrome/.test(ua)) {
            return 'chrome';
        }
        return 'other';
    }

    /**
     * プラットフォーム別デフォルト設定
     */
    _setPlatformDefaults() {
        switch (this.platform) {
            case 'ios':
                this.defaultRate = 0.5;   // iOS は rate スケールが異なる（0-1が通常範囲）
                this.defaultPitch = 1.0;
                break;
            case 'mac':
                this.defaultRate = 0.85;
                this.defaultPitch = 1.0;
                break;
            case 'chrome':
                this.defaultRate = 0.9;
                this.defaultPitch = 1.0;
                break;
            case 'edge':
                this.defaultRate = 0.9;
                this.defaultPitch = 1.0;
                break;
            default:
                this.defaultRate = 0.9;
                this.defaultPitch = 1.0;
        }
    }

    /**
     * 音声リストを読み込み、最適な英語音声を選択
     */
    _loadVoices() {
        this.voices = this.synth.getVoices();
        this.selectedVoice = this._selectBestVoice();

        // デバッグ用：利用可能な英語音声をログ出力
        const englishVoices = this.voices.filter(v => v.lang.startsWith('en'));
        console.log(`[SpeechEngine] Platform: ${this.platform}`);
        console.log(`[SpeechEngine] Available English voices:`, englishVoices.map(v => `${v.name} (${v.lang})`));
        console.log(`[SpeechEngine] Selected voice:`, this.selectedVoice?.name || 'default');
    }

    /**
     * 最適な英語音声を選択（プラットフォーム別優先順位）
     */
    _selectBestVoice() {
        const englishVoices = this.voices.filter(v => v.lang.startsWith('en'));

        if (englishVoices.length === 0) return null;

        // プラットフォーム別の優先音声リスト
        const priorities = this._getVoicePriorities();

        // 優先リストから順に検索
        for (const priority of priorities) {
            const found = englishVoices.find(v =>
                v.name.toLowerCase().includes(priority.toLowerCase())
            );
            if (found) return found;
        }

        // 優先音声が見つからない場合、en-US を優先
        const usVoice = englishVoices.find(v => v.lang === 'en-US');
        if (usVoice) return usVoice;

        // 最終フォールバック
        return englishVoices[0];
    }

    /**
     * プラットフォーム別の音声優先リスト
     */
    _getVoicePriorities() {
        switch (this.platform) {
            case 'ios':
            case 'mac':
                return [
                    // Apple Neural / Enhanced 音声を優先
                    'Samantha (Enhanced)',
                    'Samantha',
                    'Karen (Enhanced)',
                    'Karen',
                    'Daniel (Enhanced)',
                    'Daniel',
                    'Ava (Enhanced)',
                    'Ava',
                    'Alex',
                    'Allison',
                    'Moira'
                ];
            case 'chrome':
                return [
                    'Google US English',
                    'Google UK English Female',
                    'Google UK English Male'
                ];
            case 'edge':
                return [
                    'Microsoft Aria Online (Natural)',
                    'Microsoft Jenny Online (Natural)',
                    'Microsoft Guy Online (Natural)',
                    'Microsoft Aria',
                    'Microsoft Jenny',
                    'Microsoft Zira',
                    'Microsoft David'
                ];
            default:
                return [
                    'Google US English',
                    'Microsoft Aria',
                    'Samantha'
                ];
        }
    }

    /**
     * プライミング（初回ユーザーインタラクション時に呼ぶ）
     * iOS では必須：ユーザーアクション起点でないと音声が再生されない
     */
    prime() {
        if (this.isPrimed || !this.isSupported) return;

        const utterance = new SpeechSynthesisUtterance('');
        utterance.volume = 0;
        utterance.rate = 1;
        this.synth.speak(utterance);
        this.isPrimed = true;
        console.log('[SpeechEngine] Primed successfully');
    }

    /**
     * テキストを読み上げる
     * @param {string} text - 読み上げるテキスト
     * @param {Object} options - オプション
     * @param {number} options.rate - 速度 (0.1 - 2.0)
     * @param {number} options.pitch - ピッチ (0 - 2)
     * @param {Function} options.onStart - 開始時コールバック
     * @param {Function} options.onEnd - 終了時コールバック
     * @param {Function} options.onError - エラー時コールバック
     */
    speak(text, options = {}) {
        if (!this.isSupported) {
            console.warn('[SpeechEngine] Speech synthesis not supported');
            if (options.onError) options.onError(new Error('Speech synthesis not supported'));
            return;
        }

        // 既存の発話をキャンセル（iOS二重再生バグ対策）
        this.synth.cancel();

        // 少し遅延を入れる（iOS cancel後の安定化）
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(text);

            // 音声設定
            if (this.selectedVoice) {
                utterance.voice = this.selectedVoice;
            }
            utterance.lang = 'en-US';
            utterance.rate = options.rate ?? this.defaultRate;
            utterance.pitch = options.pitch ?? this.defaultPitch;
            utterance.volume = 1;

            // イベントハンドラ
            utterance.onstart = () => {
                this.isSpeaking = true;
                if (options.onStart) options.onStart();
            };

            utterance.onend = () => {
                this.isSpeaking = false;
                if (options.onEnd) options.onEnd();
            };

            utterance.onerror = (event) => {
                this.isSpeaking = false;
                // 'interrupted' はキャンセル時の正常動作
                if (event.error !== 'interrupted') {
                    console.error('[SpeechEngine] Error:', event.error);
                    if (options.onError) options.onError(event);
                }
            };

            this.synth.speak(utterance);

            // iOS のバグ対策: 長文の場合、15秒ごとにresume()を呼ぶ
            // iOS Safari はバックグラウンドで一定時間経つと音声が停止するバグがある
            if (this.platform === 'ios') {
                this._startIosKeepAlive();
            }
        }, 50);
    }

    /**
     * 発話を停止
     */
    stop() {
        if (this.isSupported) {
            this.synth.cancel();
            this.isSpeaking = false;
            this._stopIosKeepAlive();
        }
    }

    /**
     * iOS用キープアライブ（長文読み上げ時の途切れ防止）
     */
    _startIosKeepAlive() {
        this._stopIosKeepAlive();
        this._iosKeepAliveInterval = setInterval(() => {
            if (this.synth.speaking && !this.synth.paused) {
                this.synth.pause();
                this.synth.resume();
            } else {
                this._stopIosKeepAlive();
            }
        }, 10000);
    }

    _stopIosKeepAlive() {
        if (this._iosKeepAliveInterval) {
            clearInterval(this._iosKeepAliveInterval);
            this._iosKeepAliveInterval = null;
        }
    }

    /**
     * 現在の音声情報を取得（デバッグ/UI表示用）
     */
    getVoiceInfo() {
        return {
            platform: this.platform,
            isSupported: this.isSupported,
            isPrimed: this.isPrimed,
            selectedVoice: this.selectedVoice ? {
                name: this.selectedVoice.name,
                lang: this.selectedVoice.lang,
                localService: this.selectedVoice.localService
            } : null,
            availableEnglishVoices: this.voices
                .filter(v => v.lang.startsWith('en'))
                .map(v => ({ name: v.name, lang: v.lang })),
            defaultRate: this.defaultRate,
            defaultPitch: this.defaultPitch
        };
    }

    /**
     * iOSでNeural/Enhanced音声が利用可能かチェック
     */
    hasHighQualityVoice() {
        if (!this.selectedVoice) return false;
        const name = this.selectedVoice.name.toLowerCase();
        return name.includes('enhanced') ||
            name.includes('premium') ||
            name.includes('neural') ||
            name.includes('natural') ||
            name.includes('google');
    }
}
