import React from 'react'

export default function GenreFilter({ genreOptions, selectedGenres, toggleGenre, clearSelection }) {
  return React.createElement(
    'div',
    { className: 'mb-6 flex flex-wrap' },
    genreOptions.map(({ value, label }) =>
      React.createElement(
        'button',
        {
          key: value,
          onClick: () => toggleGenre(value),
          className:
            'mr-2 mb-2 px-4 py-2 rounded ' +
            (selectedGenres.includes(value)
              ? 'bg-teal-500 text-white'
              : 'bg-gray-700 text-white'),
        },
        label
      )
    ).concat(
      React.createElement(
        'button',
        {
          key: 'all',
          onClick: clearSelection,
          className:
            'mr-2 mb-2 px-4 py-2 rounded ' +
            (selectedGenres.length === 0
              ? 'bg-teal-500 text-white'
              : 'bg-gray-700 text-white'), 
        },
        'All'
      )
    )
  )
}
