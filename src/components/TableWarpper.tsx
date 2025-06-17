import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo } from 'react'
import Table from './Table'
import { Trash2 } from 'lucide-react'
import router from 'next/router'
import { Activity, Category } from '@/lib/types'

type DataType = Activity | Category

type TableWrapperProps = {
  data: DataType[]
  onRemove: (id: number) => void
  destination: string
}

function TableWrapper({ data, onRemove, destination }: TableWrapperProps) {
  const columnHelper = createColumnHelper<DataType>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('title', {
        cell: (info) => info.getValue(),
        header: 'Title',
      }),
      columnHelper.accessor('description', {
        cell: (info) => info.getValue(),
        header: 'Description',
      }),
      columnHelper.display({
        id: 'remove',
        header: '',
        cell: (info) => (
          <button
            className="hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation()
              onRemove?.(+info.row.original.id)
            }}
          >
            <Trash2 size={18} />
          </button>
        ),
      }),
    ],
    [router],
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id.toString(),
  })
  return <Table table={table} destination={destination} />
}
export default TableWrapper
