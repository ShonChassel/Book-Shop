'use strict'

const STORAGE_KEY = 'bookDB'
const gNames = ['Ugly Love', 'My Policeman', 'Im Glad My Mom Died', 'puki', 'Dad sleep', 'Bibi', 'Make money']
const PAGE_SIZE = 6
const STAR = `<img src="./img/star.png" alt=""></img>`

var gImg1 = `<img src="./img/3.jpg" alt=""></img>`
var gImg2 = `<img src="./img/2.jpg" alt=""></img>`
var gImg3 = `<img src="./img/1.jpg" alt=""></img>`
var gImg4 = `<img src="./img/4.jpg" alt=""></img>`
var gImg5 = `<img src="./img/5.jpg" alt=""></img>`
var gImg6 = `<img src="./img/6.jpg" alt=""></img>`
var gImg7 = `<img src="./img/7.jpg" alt=""></img>`
const gImgs = [gImg1, gImg2, gImg3, gImg4, gImg5, gImg6, gImg7]

var gCurrent_page = 0

var gFilterBy = {
    minPrice: 0,
    txt: '',
}
var gBooks = []

_createBooks()

function getBooks() {

    // console.log(gPageIdx);
    var books = gBooks
    console.log(gFilterBy);
    if (gFilterBy.minPrice) {
        console.log(gFilterBy.minPrice);
        books = books.filter(book => book.price >= gFilterBy.minPrice)
        console.log(books);

    } else if (gFilterBy.txt) {
        books = books.filter(book => book.name.toLowerCase().includes(gFilterBy.txt.toLowerCase()))
    }

    // Paging:
    const startIdx = gCurrent_page * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)
    return books
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)

    if (!books || !books.length) {
        books = []
        for (let i = 0; i < 7; i++) {
            var name = gNames[i]
            console.log('name', name)
            var img = gImgs[i]
            console.log('img', img)
            books.push(_createBook(name, img))
        }
    }
    gBooks = books
    _saveBooksToStorage()
}

function _createBook(name, img = gImgs[getRandomIntInclusive(0, 3)]) {
    return {
        id: generateId(5),
        name: name,
        price: getRandomIntInclusive(50, 250),
        desc: makeLorem(),
        img: img,
        rate: 0,
    }
}

function setBookFilter(filterBy = {}) {
    console.log(filterBy);
    if (filterBy.minPrice !== undefined) gFilterBy.minPrice = filterBy.minPrice
    console.log('gFilterBy', gFilterBy)
    return gFilterBy
}

function setBookSort(sortBy = {}) {
    console.log(sortBy);
    if (sortBy.maxPrice !== undefined) {
        console.log(sortBy.maxPrice);
        gBooks.sort((book1, book2) => (book1.price - book2.price) * sortBy.maxPrice)
    } else if (sortBy.name !== undefined) {
        gBooks.sort((b1, b2) => b1.name.localeCompare(b2.name) * sortBy.name)
    } else if (sortBy.rate !== undefined) {
        gBooks.sort((book1, book2) => (book1.rate - book2.rate) * sortBy.rate)
    }
}

function setFilterByTxt(txt) {

    gFilterBy.txt = txt
}

function addBook(name) {
    const book = _createBook(name)
    gBooks.unshift(book)
    _saveBooksToStorage()
    console.log(gBooks)
    return book
}

function nextPage() {

    gCurrent_page++
    if (gCurrent_page * PAGE_SIZE >= gBooks.length) {
        gCurrent_page = 0
    }
    console.log(gCurrent_page);
}

function getBookById(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    return book
}

function deleteBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function updateBook(bookId, newPrice) {
    const book = gBooks.find(book => book.id === bookId)
    book.price = newPrice
    _saveBooksToStorage()
    return book
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function getFilterBy() {
    return gFilterBy
}

function updateRate(bookId, value) {
    var bookIdx = gBooks.findIndex(book => book.id === bookId)
    if (value === '+' && gBooks[bookIdx].rate < 10) {
        gBooks[bookIdx].rate++
        createStars(gBooks[bookIdx].rate)
        console.log(gBooks[bookIdx].rate)
    } else if (value === '-' && gBooks[bookIdx].rate > 0) {
        gBooks[bookIdx].rate--
    }

    _saveBooksToStorage()

}

function createStars(number) {
    var elStar = document.querySelector('.star')
    console.log(STAR)
    elStar.innerHTML = STAR * number
}

function getCurrentPage() {
    gCurrent_page
}

function getNumOfPages() {
    console.group(getNumOfPages)
    console.log(gBooks.length)
    console.log(PAGE_SIZE)
    var chek = Math.ceil(gBooks.length / PAGE_SIZE)
    console.log('chek',chek )
    console.groupEnd()
    return chek
}

function goToPage(id) {
    gCurrent_page = id
}

