'use strict'

let gCurrLang = 'en'

const gTrans = {
    title: {
        en: 'Welcome to Books Shop',
        he: 'ברוכים הבאים לחנות ספרים'
    },
    'filter-price': {
        en: 'price:',
        he: 'מחיר'
    },
    'Add-Book': {
        en: 'Add Book',
        he: 'הוסף ספר'
    },
    'text-placeholder': {
        en: 'Search...',
        he: 'חפש'
    },
    'Descending-box': {
        en: 'Descending',
        he: 'סדר'
    },
    'Sort-by': {
        en: 'Sort by',
        he: 'מיין לפי'
    },
    'select': {
        en: 'Select Sorting',
        he: 'בחר מיון'
    },
    'name': {
        en: 'By Name',
        he: 'לפי שם'
    },
    'price': {
        en: 'Price',
        he: 'מחיר'
    },
    'rate': {
        en: 'Rate',
        he: 'דירוג'
    },
    'Id': {
        en: 'Id',
        he: 'ברקוד'
    },
    'Title': {
        en: 'Title',
        he: 'שם'
    },
    'Price': {
        en: 'Price',
        he: 'מחיר'
    },
    'Actions': {
        en: 'Actions',
        he: 'פעולות'
    },
    'Read': {
        en: 'Read',
        he: 'קריאה'
    },
    
}

function getTrans(transKey) {
    const transMap = gTrans[transKey]
    const trans = transMap[gCurrLang]
    return trans
}

function doTrans() {
    const els = document.querySelectorAll('[data-trans]')
    console.log(els);
    els.forEach(el => {
        const transKey = el.dataset.trans
        const trans = getTrans(transKey)
        console.log('trans', trans)
        el.innerText = trans
        if (el.placeholder) el.placeholder = trans
    })
}

function setLang(lang) {
    gCurrLang = lang
}

function getLang() {
    return gCurrLang
}
