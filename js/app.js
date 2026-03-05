/**
 * 英検準一級 単語暗記アプリ - メインアプリケーション
 */
class VocabularyApp {
    constructor() {
        this.speech = new SpeechEngine();
        this.words = [...VOCABULARY_DATA];
        this.currentIndex = 0;
        this.isFlipped = false;
        this.masteredWords = new Set(JSON.parse(localStorage.getItem('masteredWords') || '[]'));
        this.showOnlyUnmastered = false;
        this.filteredWords = this.words;
        this.customRate = parseFloat(localStorage.getItem('speechRate') || '1.0');

        this._initElements();
        this._bindEvents();
        this._updateDisplay();
        this._updateProgress();
        this._checkSpeechSupport();
        this._updateSpeedDisplay();
    }

    _initElements() {
        // カード
        this.cardInner = document.getElementById('cardInner');
        this.wordEl = document.getElementById('word');
        this.phoneticEl = document.getElementById('phonetic');
        this.partOfSpeechEl = document.getElementById('partOfSpeech');
        this.meaningEl = document.getElementById('meaning');
        this.exampleEl = document.getElementById('example');
        this.exampleTranslationEl = document.getElementById('exampleTranslation');

        // ボタン
        this.speakWordBtn = document.getElementById('speakWord');
        this.speakExampleBtn = document.getElementById('speakExample');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.masterBtn = document.getElementById('masterBtn');
        this.flipBtn = document.getElementById('flipBtn');
        this.filterBtn = document.getElementById('filterBtn');
        this.speedDownBtn = document.getElementById('speedDown');
        this.speedUpBtn = document.getElementById('speedUp');
        this.speedDisplay = document.getElementById('speedDisplay');

        // 表示要素
        this.progressBar = document.getElementById('progressBar');
        this.progressText = document.getElementById('progressText');
        this.counterEl = document.getElementById('counter');
        this.iosNotice = document.getElementById('iosNotice');
        this.iosNoticeClose = document.getElementById('iosNoticeClose');
        this.voiceInfoEl = document.getElementById('voiceInfo');

        // モーダル
        this.voiceModal = document.getElementById('voiceModal');
        this.voiceModalClose = document.getElementById('voiceModalClose');
        this.voiceSettingsBtn = document.getElementById('voiceSettingsBtn');
        this.voiceListEl = document.getElementById('voiceList');
    }

    _bindEvents() {
        // カードフリップ
        this.cardInner.addEventListener('click', () => this._flipCard());
        this.flipBtn.addEventListener('click', () => this._flipCard());

        // 音声ボタン（プライミングも兼ねる）
        this.speakWordBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.speech.prime();
            this._speakWord();
        });

        this.speakExampleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.speech.prime();
            this._speakExample();
        });

        // ナビゲーション
        this.prevBtn.addEventListener('click', () => this._prev());
        this.nextBtn.addEventListener('click', () => this._next());

        // 暗記済みトグル
        this.masterBtn.addEventListener('click', () => this._toggleMastered());

        // フィルター
        this.filterBtn.addEventListener('click', () => this._toggleFilter());

        // 速度変更
        this.speedDownBtn.addEventListener('click', () => this._changeSpeed(-0.2));
        this.speedUpBtn.addEventListener('click', () => this._changeSpeed(0.2));

        // iOSお知らせ閉じる
        if (this.iosNoticeClose) {
            this.iosNoticeClose.addEventListener('click', () => {
                this.iosNotice.style.display = 'none';
                localStorage.setItem('iosNoticeDismissed', 'true');
            });
        }

        // 音声設定モーダル
        if (this.voiceSettingsBtn) {
            this.voiceSettingsBtn.addEventListener('click', () => this._openVoiceModal());
        }
        if (this.voiceModalClose) {
            this.voiceModalClose.addEventListener('click', () => this._closeVoiceModal());
        }
        if (this.voiceModal) {
            this.voiceModal.addEventListener('click', (e) => {
                if (e.target === this.voiceModal) this._closeVoiceModal();
            });
        }

        // キーボードショートカット
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowRight': this._next(); break;
                case 'ArrowLeft': this._prev(); break;
                case ' ':
                    e.preventDefault();
                    this._flipCard();
                    break;
                case 'Enter':
                    e.preventDefault();
                    this.speech.prime();
                    if (this.isFlipped) {
                        this._speakExample();
                    } else {
                        this._speakWord();
                    }
                    break;
            }
        });

        // スワイプ対応
        let touchStartX = 0;
        let touchEndX = 0;
        const card = document.getElementById('card');

        card.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        card.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) this._next();
                else this._prev();
            }
        }, { passive: true });

        // 最初のインタラクションでプライミング
        document.addEventListener('click', () => {
            this.speech.prime();
        }, { once: true });

        document.addEventListener('touchstart', () => {
            this.speech.prime();
        }, { once: true });
    }

    _flipCard() {
        this.isFlipped = !this.isFlipped;
        this.cardInner.classList.toggle('flipped', this.isFlipped);
        this.flipBtn.innerHTML = this.isFlipped
            ? '<span class="btn-icon">🔄</span> 表に戻す'
            : '<span class="btn-icon">🔄</span> 意味を見る';
    }

    _speakWord() {
        const word = this.filteredWords[this.currentIndex];
        if (!word) return;

        this.speakWordBtn.classList.add('speaking');
        this.speech.speak(word.word, {
            rate: this._getRate(),
            onEnd: () => this.speakWordBtn.classList.remove('speaking'),
            onError: () => this.speakWordBtn.classList.remove('speaking')
        });
    }

    _speakExample() {
        const word = this.filteredWords[this.currentIndex];
        if (!word) return;

        this.speakExampleBtn.classList.add('speaking');
        this.speech.speak(word.example, {
            rate: this._getRate(),
            onEnd: () => this.speakExampleBtn.classList.remove('speaking'),
            onError: () => this.speakExampleBtn.classList.remove('speaking')
        });
    }

    _getRate() {
        return this.customRate;
    }

    _changeSpeed(delta) {
        this.customRate = Math.round((this.customRate + delta) * 10) / 10;
        // 範囲制限: 0.2 〜 2.0
        this.customRate = Math.max(0.2, Math.min(2.0, this.customRate));
        localStorage.setItem('speechRate', this.customRate.toString());
        this._updateSpeedDisplay();
    }

    _updateSpeedDisplay() {
        this.speedDisplay.textContent = `×${this.customRate.toFixed(1)}`;
        this.speedDownBtn.disabled = this.customRate <= 0.2;
        this.speedUpBtn.disabled = this.customRate >= 2.0;
    }

    _prev() {
        if (this.filteredWords.length === 0) return;
        this.speech.stop();
        this.currentIndex = (this.currentIndex - 1 + this.filteredWords.length) % this.filteredWords.length;
        this.isFlipped = false;
        this.cardInner.classList.remove('flipped');
        this._updateDisplay();
        this._animateCard('slide-right');
    }

    _next() {
        if (this.filteredWords.length === 0) return;
        this.speech.stop();
        this.currentIndex = (this.currentIndex + 1) % this.filteredWords.length;
        this.isFlipped = false;
        this.cardInner.classList.remove('flipped');
        this._updateDisplay();
        this._animateCard('slide-left');
    }

    _animateCard(className) {
        const card = document.getElementById('card');
        card.classList.add(className);
        setTimeout(() => card.classList.remove(className), 300);
    }

    _toggleMastered() {
        const word = this.filteredWords[this.currentIndex];
        if (!word) return;

        if (this.masteredWords.has(word.id)) {
            this.masteredWords.delete(word.id);
        } else {
            this.masteredWords.add(word.id);
        }

        localStorage.setItem('masteredWords', JSON.stringify([...this.masteredWords]));
        this._updateDisplay();
        this._updateProgress();

        // フィルタ中に暗記済みにした場合、次のカードへ
        if (this.showOnlyUnmastered && this.masteredWords.has(word.id)) {
            this._applyFilter();
            if (this.currentIndex >= this.filteredWords.length) {
                this.currentIndex = 0;
            }
            this._updateDisplay();
        }
    }

    _toggleFilter() {
        this.showOnlyUnmastered = !this.showOnlyUnmastered;
        this.filterBtn.classList.toggle('active', this.showOnlyUnmastered);
        this.filterBtn.innerHTML = this.showOnlyUnmastered
            ? '<span class="btn-icon">📋</span> すべて表示'
            : '<span class="btn-icon">📋</span> 未暗記のみ';
        this._applyFilter();
        this.currentIndex = 0;
        this._updateDisplay();
    }

    _applyFilter() {
        if (this.showOnlyUnmastered) {
            this.filteredWords = this.words.filter(w => !this.masteredWords.has(w.id));
        } else {
            this.filteredWords = this.words;
        }
    }

    _updateDisplay() {
        const word = this.filteredWords[this.currentIndex];

        if (!word) {
            this.wordEl.textContent = '🎉';
            this.phoneticEl.textContent = '';
            this.meaningEl.textContent = 'すべて暗記済みです！';
            this.exampleEl.textContent = '';
            this.exampleTranslationEl.textContent = '';
            this.partOfSpeechEl.textContent = '';
            this.counterEl.textContent = '0 / 0';
            this.speakWordBtn.disabled = true;
            this.speakExampleBtn.disabled = true;
            return;
        }

        // 表面
        this.wordEl.textContent = word.word;
        this.phoneticEl.textContent = word.phonetic;

        // 裏面
        this.partOfSpeechEl.textContent = word.partOfSpeech;
        this.meaningEl.textContent = word.meaning;
        this.exampleEl.textContent = word.example;
        this.exampleTranslationEl.textContent = word.exampleTranslation;

        // カウンター
        this.counterEl.textContent = `${this.currentIndex + 1} / ${this.filteredWords.length}`;

        // 暗記ボタン
        const isMastered = this.masteredWords.has(word.id);
        this.masterBtn.classList.toggle('mastered', isMastered);
        this.masterBtn.innerHTML = isMastered
            ? '<span class="btn-icon">✅</span> 暗記済み'
            : '<span class="btn-icon">⬜</span> 暗記する';

        // 音声ボタン有効化
        this.speakWordBtn.disabled = false;
        this.speakExampleBtn.disabled = false;

        // フリップボタンリセット
        this.flipBtn.innerHTML = '<span class="btn-icon">🔄</span> 意味を見る';
    }

    _updateProgress() {
        const total = this.words.length;
        const mastered = this.masteredWords.size;
        const percentage = total > 0 ? (mastered / total) * 100 : 0;

        this.progressBar.style.width = `${percentage}%`;
        this.progressText.textContent = `${mastered} / ${total} 暗記完了`;
    }

    _checkSpeechSupport() {
        if (!this.speech.isSupported) {
            this.voiceInfoEl.textContent = '⚠️ この環境では音声合成がサポートされていません';
            this.voiceInfoEl.style.color = 'var(--color-warning)';
            return;
        }

        // プラットフォーム情報表示
        setTimeout(() => {
            const info = this.speech.getVoiceInfo();
            if (info.selectedVoice) {
                this.voiceInfoEl.textContent = `🔊 ${info.selectedVoice.name}`;
            } else {
                this.voiceInfoEl.textContent = '🔊 デフォルト音声';
            }

            // iOSでの通知表示
            if (this.speech.platform === 'ios' && !localStorage.getItem('iosNoticeDismissed')) {
                if (!this.speech.hasHighQualityVoice()) {
                    this.iosNotice.style.display = 'block';
                }
            }
        }, 500);
    }

    _openVoiceModal() {
        const info = this.speech.getVoiceInfo();
        this.voiceListEl.innerHTML = '';

        if (info.availableEnglishVoices.length === 0) {
            this.voiceListEl.innerHTML = '<p class="no-voices">英語音声が見つかりません</p>';
        } else {
            info.availableEnglishVoices.forEach(v => {
                const item = document.createElement('button');
                item.className = 'voice-item';
                if (info.selectedVoice && v.name === info.selectedVoice.name) {
                    item.classList.add('selected');
                }
                item.textContent = `${v.name} (${v.lang})`;
                item.addEventListener('click', () => {
                    const voice = this.speech.voices.find(sv => sv.name === v.name);
                    if (voice) {
                        this.speech.selectedVoice = voice;
                        this.voiceInfoEl.textContent = `🔊 ${voice.name}`;
                        this._closeVoiceModal();
                        // テスト発話
                        this.speech.speak('Hello, this is a test.', { rate: this.speech.defaultRate });
                    }
                });
                this.voiceListEl.appendChild(item);
            });
        }

        this.voiceModal.classList.add('show');
    }

    _closeVoiceModal() {
        this.voiceModal.classList.remove('show');
    }
}

// アプリ起動
document.addEventListener('DOMContentLoaded', () => {
    window.app = new VocabularyApp();
});
