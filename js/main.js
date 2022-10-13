'use strict'
var gMode;

function onInit() {
    renderFilterByQueryStringParams()
    renderBooks()


    // query-params
    // const queryStringParams = ``
    // const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    // window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderBooks() {
   
    // gMode = 'table'
    var elTable = document.querySelector('table')
    elTable.style.display = 'block'
    elTable.style.display = ''

    var elModes = document.querySelector('.modes-container')
    elModes.style.display = 'none'

    var elBooks = document.querySelector('.books-container')
    var books = getBooks()
    console.log(books);

    var strHTML = ''
    books.map((book) => {
        strHTML += `<tr>
            <td>${book.id}</td>
            <td>${book.name}</td>
            <td>${book.price}$</td>
            <td><button class="Read" onclick="onReadBook('${book.id}')">Read</button></td>
            <td><button class="Update" onclick="onUpdateBook('${book.id}')">Update</button></td>
            <td><button class="Delete" onclick="onDeleteBook('${book.id}')">Delete</button></td>
        </tr>`

    })
    elBooks.innerHTML = strHTML
}

function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)


    renderMode()

    // query-params
    const queryStringParams = `?minPrice=${filterBy.minPrice}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onSetSortBy() {
    const prop = document.querySelector('.sort-by').value
    const isDesc = document.querySelector('.sort-desc').checked

    // const sortBy = {}
    // sortBy[prop] = (isDesc)? -1 : 1

    // Shorter Syntax:
    const sortBy = {
        [prop]: (isDesc) ? -1 : 1
    }
    console.log('', sortBy)
    setBookSort(sortBy)
    renderMode()

    // query-params
    const queryStringParams = `?price=${sortBy.maxPrice}&name=${sortBy.name}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onAddBook() {
    var name = prompt('name?', 'My Policeman')
    if (name) {
        const book = addBook(name)
        renderMode()
        flashMsg(`Book Added (id: ${book.id})`)
    }
}

function onNextPage() {
    nextPage()
    renderMode()
}

function onReadBook(bookId) {
    var book = getBookById(bookId)
   
    var elModal = document.querySelector('.modal')
    elModal.querySelector('h3').innerText = book.name
    elModal.querySelector('h4 span').innerText = book.price + '$'
    elModal.querySelector('h6').innerHTML = book.img
    elModal.querySelector('p').innerText = book.desc
    elModal.classList.add('open')

}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
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
    // gMode = 'gallery'
    var elTable = document.querySelector('table')
    elTable.style.display = 'none'

    var books = getBooks()
    var elModes = document.querySelector('.modes-container')
    elModes.style.display = 'flex'

    var strHTML = books.map(book => `
    <article class="books-preview">
        <button class="btn-remove" onclick="onDeleteBook('${book.id}')">X</button>
        <div class="img-gallery">${book.img}</div>
        <h5>${book.name}</h5>
        <div ><button class="btn" onclick="onUpdateRate('${book.id}','${'-'}')">-</button>${book.rate}<button class="btn" onclick="onUpdateRate('${book.id}','${'+'}')">+</button></div>
        <div><span>${book.price}$</div>
        <button onclick="onReadBook('${book.id}')">Read</button>
        <button onclick="onUpdateBook('${book.id}')">Update</button>
    </article> 
    ` )
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
    }

    if (!filterBy.minPrice && !filterBy.txt) return

    document.querySelector('.filter-txt-select').value = filterBy.txt
    document.querySelector('.filter-price-range').value = filterBy.minPrice
    setBookFilter(filterBy)
}
