import { flexRender, Table as ReactTableType } from '@tanstack/react-table'

type Props = {
  table: ReactTableType<any>
  destination: string
}

export default function Table({ table, destination }: Props) {
  return (
    <table className="min-w-full border border-gray-200 rounded-md overflow-hidden">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="bg-gray-50">
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="px-4 py-2 border-b border-gray-200">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr
            key={row.id}
            className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition"
            onClick={() => (window.location.href = `/${destination}/${row.original.id}`)}
          >
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="px-4 py-2 border-r last:border-r-0">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
