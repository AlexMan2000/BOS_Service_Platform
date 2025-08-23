import { User } from "@/commons/types/user"
import { EditableProTable, ProColumns } from "@ant-design/pro-components"
import { Button } from "antd"
import React from "react"

export type GenericEditableTableProps<T extends object> = {
    columns: ProColumns<T>[]
    dataSource: readonly T[]
    setDataSource: (dataSource: T[]) => void
    editableKeys: React.Key[]
    setEditableRowKeys: (editableKeys: React.Key[]) => void
    defaultNewRow: T
    rowKey: string
    recordCreatorProps?: false | {
        creatorButtonText?: React.ReactNode
        record: () => T
        position?: "top" | "bottom"
    }
    editable?: {
        type?: "single" | "multiple"
        editableKeys: React.Key[]
        onChange: (editableKeys: React.Key[]) => void
        actionRender?: (
            row: T,
            config: any,
            dom: {
                save: React.ReactNode
                cancel: React.ReactNode
                delete?: React.ReactNode
            }
        ) => React.ReactNode[]
    }
    loading?: boolean
    scroll?: { x?: number | string; y?: number | string }
    headerTitle?: React.ReactNode
    onChange: (value: readonly T[]) => void
    onSave?: (rowKey: React.Key, data: T, row: T) => Promise<void>
}

export const GenericEditableTable = <T extends object>(props: GenericEditableTableProps<T>) => {
    const {
        columns,
        dataSource,
        setDataSource,
        editableKeys,
        setEditableRowKeys,
        defaultNewRow,
        rowKey,
        recordCreatorProps,
        editable,
        loading,
        scroll,
        headerTitle,
        onChange,
        onSave,

    } = props


    const addMultipleRows = (count: number) => {
        console.log(`Adding ${count} rows, current dataSource length:`, dataSource.length);

        const newRows: T[] = [];
        for (let i = 0; i < count; i++) {
            newRows.push(defaultNewRow);
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
            scroll={scroll}
            recordCreatorProps={recordCreatorProps as any}
            loading={!!loading}
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
            columns={columns}
            value={dataSource}
            onChange={onChange}
            editable={{
                type: editable?.type ?? "multiple",
                editableKeys: editable?.editableKeys ?? [],
                onSave: async (rowKeyParam, data, row) => {
                    if (onSave) {
                        await onSave(rowKeyParam as unknown as React.Key, data, row)
                    }
                },
                onChange: editable?.onChange ?? (() => {}),
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
        />
    )
}