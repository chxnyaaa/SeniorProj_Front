"use client"
import React from "react"
import { useTable } from "react-table"

export default function TableCoins({ transactions = [] }) {
  const columns = React.useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Type",
        accessor: "type",
        Cell: ({ value }) => value === "earn" ? "Earn" : "Spend",
      },
      {
        Header: "Amount",
        accessor: "amount",
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: ({ value }) =>
          value ? new Date(value).toLocaleDateString() : "-",
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value }) => value || "-",
      },
    ],
    []
  )

  const data = React.useMemo(() => Array.isArray(transactions) ? transactions : [], [transactions])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data })

  return (
    <div className="overflow-x-auto bg-white rounded-md shadow-md">
      <table {...getTableProps()} className="min-w-full text-gray-800">
        <thead className="bg-gray-100">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  key={column.id}
                  className="px-4 py-2 border-b text-left font-semibold"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                No transactions found.
              </td>
            </tr>
          ) : (
            rows.map(row => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} key={row.id} className="hover:bg-gray-50">
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      key={cell.column.id}
                      className="px-4 py-2 border-b"
                    >
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
