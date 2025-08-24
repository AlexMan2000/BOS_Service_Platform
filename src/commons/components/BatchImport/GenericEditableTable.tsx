import { EditableProTable, ProColumns } from "@ant-design/pro-components"
import { Button } from "antd"
import React, { useState } from "react"

export type GenericEditableTableProps<T extends object> = {
    dataSource: T[]
    setDataSource: (dataSource: T[]) => void
    columns: ProColumns<T>[]
    defaultNewRow: T
    rowKey: string
    recordCreatorProps?: false | {
        creatorButtonText?: React.ReactNode
        record: () => T
        position?: "top" | "bottom"
    }
    editable?: {
        type?: "single" | "multiple"
    }
    loading?: boolean
    scroll?: { x?: number | string; y?: number | string }
    headerTitle?: React.ReactNode
    onSave?: (rowKey: React.Key, data: T, row: T) => Promise<void>
    size?: 'small' | 'middle' | 'large'
    pagination?: false | object
}

export const GenericEditableTable = <T extends object>(props: GenericEditableTableProps<T>) => {
    const {
        dataSource,
        setDataSource,
        columns,
        defaultNewRow,
        rowKey,
        recordCreatorProps,
        editable,
        loading,
        scroll,
        headerTitle,
        onSave,
        size,
        pagination,
        } = props


    const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])


    const PROCOLUMNS_CONFIGS: ProColumns<T>[] = [
        ...columns,
        {
            title: '操作',
            valueType: 'option',
            width: 200,
            render: (_, record, __, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        action?.startEditable?.(record[rowKey]);
                    }}
                >
                    编辑
                </a>,
                <a
                    key="delete"
                    onClick={() => {
                        setDataSource(dataSource.filter((item) => item[rowKey] !== record[rowKey]));
                    }}
                >
                    删除
                </a>,
            ]
        },
    ]


    const addMultipleRows = (count: number) => {
        console.log(`Adding ${count} rows, current dataSource length:`, dataSource.length);

        const newRows: T[] = [];
        for (let i = 0; i < count; i++) {
            newRows.push({ ...defaultNewRow, [rowKey]: (Math.random() * 1000000).toFixed(0) });
        }

        // Always add to bottom
        const newDataSource = [...dataSource, ...newRows];
        console.log('New dataSource length:', newDataSource.length);
        setDataSource(newDataSource);

        // Set all new rows as editable
        const newEditableKeys = newRows.map(row => row[rowKey]);
        setEditableRowKeys([...editableKeys, ...newEditableKeys]);
        console.log('New editable keys:', newEditableKeys);
    }

    return (
        <EditableProTable<T>
            rowKey={rowKey as any}
            headerTitle={headerTitle}
            scroll={scroll || { x: 'max-content', y: 400 }}
            recordCreatorProps={recordCreatorProps as any}
            loading={!!loading}
            size={size || 'small'}
            pagination={pagination ?? false}
            toolBarRender={() => [
                <Button
                    key="addOne"
                    type="primary"
                    onClick={() => addMultipleRows(1)}
                >
                    添加一行
                </Button>,
                <Button
                    key="addFive"
                    onClick={() => addMultipleRows(5)}
                >
                    添加5行
                </Button>,
                <Button
                    key="addTen"
                    onClick={() => addMultipleRows(10)}
                >
                    添加10行
                </Button>,
            ]}
            columns={PROCOLUMNS_CONFIGS}
            value={dataSource}
            onChange={(value) => setDataSource([...value])}
            editable={{
                type: editable?.type ?? "multiple",
                editableKeys: editableKeys,
                onSave: async (rowKeyParam, data, row) => {
                    if (onSave) {
                        await onSave(rowKeyParam as unknown as React.Key, data, row)
                    }
                },
                onChange: setEditableRowKeys,
                actionRender: (row, _, dom) => [
                    dom.save,
                    dom.cancel,
                    <Button
                        key="delete"
                        size="small"
                        danger
                        onClick={() => {
                            setDataSource(dataSource.filter(item => item[rowKey] !== row[rowKey]));
                            setEditableRowKeys(editableKeys.filter(key => key !== row[rowKey]));
                        }}
                    >
                        删除
                    </Button>,
                ],
            }}
            request={async () => ({
                data: dataSource,
                total: dataSource.length,
                success: true,
            })}
            onSubmit={async (values) => {
                console.log(values)
            }}

        />
    )
}