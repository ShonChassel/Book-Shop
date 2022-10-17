'use strict'
var gMode;
var isShown = false

function onInit() {
    renderFilterByQueryStringParams()
    renderBooks()

    //!סיאר!!! למחוק כומנטים מיותרים
    // query-params
    // const queryStringParams = ``
    // const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    // window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderBooks() {


    var btnName = ['Read', 'Update', 'Delete']
    if (getLang() !== "en") {
        btnName = ['קריאה', 'עדכון', 'מחיקה']
    }

    // gMode = 'table'
    //!סיאר!! לשים בתור משתנה גלובלי כיוון שאתה משתמש בו בעוד מקום
    var elTable = document.querySelector('table')
    elTable.style.display = 'block'
    elTable.style.display = ''
    //!סיאר!! לשים בתור משתנה גלובלי כיוון שאתה משתמש בו בעוד מקום
    var elModes = document.querySelector('.modes-container')
    elModes.style.display = 'none'
    //!סיאר!! יכול להשתמש ישירות  באלמנט עצמו ולא להגדיר אותו  אתה משתמש בו פעם 1
    var elBooks = document.querySelector('.books-container')
    var books = getBooks()
    console.log(books);

    var strHTML = ''
    books.map((book) => {
        strHTML += `<tr>
            <td>${book.id}</td>
            <td>${book.name}</td>
            <td>${currencyChange(getLang(), book.price)}</td>
            <td><button class="Read" onclick="onReadBook('${book.id}')">${btnName[0]}</button></td>
            <td><button class="Update" onclick="onUpdateBook('${book.id}')">${btnName[1]}</button></td>
            <td><button class="Delete" onclick="onDeleteBook('${book.id}')">${btnName[2]}</button></td>
            <td>${book.rate}</td>
        </tr>`

    })

    //!סיאר!! יכול להשתמש ישירות  באלמנט עצמו ולא להגדיר אותו  אתה משתמש בו פעם 1
    elBooks.innerHTML = strHTML
    renderPagesBtns()
}

function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    renderMode()
    saveQueryParams()

}

function saveQueryParams(bookId) {
    var filterBy = getFilterBy()
   
    const queryStringParams = `?minPrice=${filterBy.minPrice}&txt=${filterBy.txt}${bookId ? `&openModal=${bookId}` : ''}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onSetSortBy() {
    const prop = document.querySelector('.sort-by').value
    const isDesc = document.querySelector('.sort-desc').checked
    //!למחוק קומנטים ורווחים מיותרים
    // const sortBy = {}
    // sortBy[prop] = (isDesc)? -1 : 1

    // Shorter Syntax:
    const sortBy = {
        [prop]: (isDesc) ? -1 : 1
    }
    setBookSort(sortBy)
    renderMode()

    // query-params
    const queryStringParams = `?price=${sortBy.maxPrice}&name=${sortBy.name}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onAddBook() {
    var elBookModal = document.querySelector('.add-book-modal')
    elBookModal.style.display = 'block'

    var bookName = document.getElementById('bookname').value
    var price = document.getElementById('price').value
    if (bookName) {
        const book = addBook(bookName, price)
        renderMode()
        flashMsg(`Book Added (id: ${book.id})`)

    }

}

function onCloseAddModal() {
    var elClose = document.querySelector('.add-book-modal')
    elClose.style.display = 'none'


}

function onReadBook(bookId) {
    showHamburger()
    var book = getBookById(bookId)

    var elModal = document.querySelector('.modal')
    elModal.querySelector('h3').innerText = book.name
    elModal.querySelector('h4 span').innerText = book.price + '$'
    elModal.querySelector('h6').innerHTML = book.img
    elModal.querySelector('p').innerText = book.desc
    elModal.classList.add('open')
    
    setQueryParams(bookId, true)
}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
    setQueryParams()
}

function onDeleteBook(bookId) {
    deleteBook(bookId)
    renderMode()
    flashMsg(`Book Deleted`)
}

function renderMode() {

    gMode === 'gallery' ? renderCards() : renderBooks();
}

function flashMsg(msg) {
    const el = document.querySelector('.user-msg')
    el.innerText = msg
    el.classList.add('open')
    setTimeout(() => {
        el.classList.remove('open')
    }, 3000)
}

function onUpdateBook(bookId) {
    const book = getBookById(bookId)
    var newPrice = +prompt('Price?', book.price)

    if (newPrice && book.price !== newPrice) {
        const book = updateBook(bookId, newPrice)
        renderBooks()
        flashMsg(`Price updated to: ${book.price}`)
    }
}

function onLoadAdmin() {
    renderCards()
    renderBooks()
}

function onChangeMode(mode) {
    gMode = mode
    renderMode()
}

function renderCards() {

    var btnName = ['Read', 'Update',]
    if (getLang() !== "en") {
        btnName = ['קריאה', 'עדכון',]
    }

    // gMode = 'gallery'
    var elTable = document.querySelector('table')
    elTable.style.display = 'none'

    var books = getBooks()
    var elModes = document.querySelector('.modes-container')
    elModes.style.display = 'flex'
    var strHTML = '';
    books.map(book => {
        strHTML += `
    <article class="books-preview">
        <button class="btn-remove" onclick="onDeleteBook('${book.id}')">X</button>
        <div class="img-gallery">${book.img}</div>
        <h5>${book.name}</h5>`
        for (let i = 0; i < book.rate; i++) {
            strHTML += '<img src="./img/star.png" alt="" class="star">'
        }
        strHTML += `<div ><button class="btn" onclick="onUpdateRate('${book.id}','${'-'}')">-</button>${book.rate}<button class="btn" onclick="onUpdateRate('${book.id}','${'+'}')">+</button></div>
        <div><span>${book.price}$</div>
        <button onclick="onReadBook('${book.id}')">${btnName[0]}</button>
        <button onclick="onUpdateBook('${book.id}')">${btnName[1]}</button>
    </article> 
    ` })
    elModes.innerHTML = strHTML
}

function onSetFilterByTxt(txt) {
    console.log('Filtering by txt', txt)
    setFilterByTxt(txt)
    renderMode()
}

function onUpdateRate(bookId, value) {

    console.log('value', value)
    // var book = getBookById(bookId)
    updateRate(bookId, value)
    renderMode()
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)

    const filterBy = {
        minPrice: +queryStringParams.get('minPrice') || 0,
        txt: queryStringParams.get('txt') || '',
        openModal: queryStringParams.get('openModal') || '',
    }

    if (
        !filterBy.minPrice &&
        !filterBy.txt &&
        filterBy.openModal === undefined
    ) return

    document.querySelector('.filter-txt-select').value = filterBy.txt
    document.querySelector('.filter-price-range').value = filterBy.minPrice
    setBookFilter(filterBy)
    if (filterBy.openModal) onReadBook(filterBy.openModal)
}

function onSetLang(lang) {
    setLang(lang)
    setDirection(lang)
    doTrans()
    renderMode()
}

function setDirection(lang) {
    if (lang === 'he') document.body.classList.add('rtl')
    else document.body.classList.remove('rtl')
}

function renderPagesBtns() {
    var currPage = getCurrentPage()
    document.querySelector('.pages').innerHTML = ''
    var pageNum = 1
    var numOfPages = getNumOfPages()

    for (let i = 0; i < numOfPages; i++) {
        document.querySelector('.pages').innerHTML +=
            `<button onclick="onNumberPageBtn(${pageNum - 1})" class"page-${pageNum}"
     ${currPage === i ? 'disabled' : ''}>${pageNum}</button>`
        pageNum++
    }
}

function onNumberPageBtn(id) {
    console.log(id);
    goToPage(id)
    renderMode()
}

function showHamburger() {
    var elSideBar = document.querySelector('.side-bar')
    if (isShown) {
        elSideBar.style.width = "200px"
        isShown = false
    } else {
        isShown = true
        elSideBar.style.width = "0px"
    }
}

function setQueryParams( bookId, isModal = false){
    var filterBy = getFilterBy()
    var currLang = getLang()
    const queryStringParams = `?lang=${currLang}&minPrice=${filterBy.minPrice}&txt=${filterBy.txt}${isModal ? `&openModal=${bookId}` : ''}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}