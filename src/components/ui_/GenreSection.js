import React from 'react'
import BookGrid from './BookGrid' // หรือ path ตามที่คุณเก็บ

export default function GenreSection({ genre, label, books, loading, currentPage, fetchBooksForGenre }) {
  if (books.length === 0) return null

  return React.createElement(
    'section',
    { className: 'mb-10' },
    React.createElement('h2', { className: 'text-white text-2xl font-bold mb-4' }, label),

    loading
      ? React.createElement('div', { className: 'text-white' }, 'Loading...')
      : React.createElement(
          React.Fragment,
          null,
          React.createElement(BookGrid, { books: books }),
          books.length > 20 &&
            React.createElement(
              'div',
              { className: 'mt-4 flex gap-2' },
              React.createElement(
                'button',
                {
                  disabled: currentPage === 1,
                  onClick: () => fetchBooksForGenre(genre, currentPage - 1),
                  className:
                    'px-3 py-1 rounded ' +
                    (currentPage === 1
                      ? 'bg-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700') +
                    ' text-white',
                },
                'Previous'
              ),
              React.createElement('span', { className: 'text-white px-3 py-1' }, `Page ${currentPage}`),
              React.createElement(
                'button',
                {
                  onClick: () => fetchBooksForGenre(genre, currentPage + 1),
                  className: 'px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white',
                },
                'Next'
              )
            )
        )
  )
}
