/**
 * レベル設定 - 全レベルのメタデータとデータの紐づけ
 */
const LEVEL_CONFIG = {
    'eiken5': {
        id: 'eiken5',
        name: '英検5級',
        subtitle: 'Elementary',
        description: '小学校高学年〜中学1年レベル',
        color: '#4ade80',
        icon: '🌱',
        difficulty: 1,
        getData: () => EIKEN5_DATA,
    },
    'eiken4': {
        id: 'eiken4',
        name: '英検4級',
        subtitle: 'Pre-Intermediate',
        description: '中学2年レベル',
        color: '#60a5fa',
        icon: '📘',
        difficulty: 2,
        getData: () => EIKEN4_DATA,
    },
    'eiken3': {
        id: 'eiken3',
        name: '英検3級',
        subtitle: 'Intermediate',
        description: '中学卒業レベル',
        color: '#a78bfa',
        icon: '📗',
        difficulty: 3,
        getData: () => EIKEN3_DATA,
    },
    'eiken-pre2': {
        id: 'eiken-pre2',
        name: '英検準2級',
        subtitle: 'Upper-Intermediate',
        description: '高校中級レベル',
        color: '#f59e0b',
        icon: '📙',
        difficulty: 4,
        getData: () => EIKENPRE2_DATA,
    },
    'eiken2': {
        id: 'eiken2',
        name: '英検2級',
        subtitle: 'Advanced',
        description: '高校卒業レベル',
        color: '#f97316',
        icon: '📕',
        difficulty: 5,
        getData: () => EIKEN2_DATA,
    },
    'eiken-pre1': {
        id: 'eiken-pre1',
        name: '英検準1級',
        subtitle: 'Proficient',
        description: '大学中級レベル',
        color: '#ef4444',
        icon: '📓',
        difficulty: 6,
        getData: () => EIKENPRE1_DATA,
    },
};

// レベルIDの順番リスト
const LEVEL_ORDER = ['eiken5', 'eiken4', 'eiken3', 'eiken-pre2', 'eiken2', 'eiken-pre1'];
