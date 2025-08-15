import styles from "./EditableTable.module.less"
import "./EditableTable.css"
import { Table } from "antd"
import { Tooltip, Menu } from 'antd';
import { MoreOutlined } from '@ant-design/icons'
import { useRef, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { encodeToBase64 } from "@/commons/utils/formatters/encoderHandler";
// import { useDispatch } from "react-redux";
import { classNamesArgs } from "@/commons/utils/formatters/classNameHandler";

type ActionCallback = {
    "Preview"?: () => void;
    "Details"?: () => void;
    "Edit"?: () => void;
    "Share"?: () => void;
    "Archive"?: () => void;
}

type GenericTableProps<T> = {
    data: T[];
    loading: boolean;
    pagination?: boolean;
    name?: string;
    inputColumns: any;
    onRowClickCallback?: any;
    onRowDoubleClickCallback?: any;
    rowKey: string;
    action?: boolean;
    routing?: boolean;
    bordered?: boolean;
    actionOptions?: ActionOption[];
    actionOptionCallbacks?: ActionCallback;
}

export type ActionOption = "Preview" | "Details" | "Edit" | "Share" | "Archive"


function EditableTable<T extends object>(
    {
        data
        , loading
        , name
        , inputColumns
        , rowKey
        , onRowClickCallback
        , onRowDoubleClickCallback
        , actionOptions
        , pagination
        , action = true
        , routing = true
        , bordered = true
        , actionOptionCallbacks
    }: GenericTableProps<T>) {


    const [pageSize, setPageSize] = useState<number>(10);
    const [pageIndex, setPageIndex] = useState<number>(1);

    // const navigate = useNavigate();
    // const dispatch = useDispatch();

    const menuTooltipRef = useRef<any>();


    // const dateString = new Date().toLocaleString();

    const voidFunc = () => { }
    const actionOptionCallbacksFinal = { "Preview": voidFunc, "Details": voidFunc, "Edit": voidFunc, "Share": voidFunc, "Archive": voidFunc, ...actionOptionCallbacks, }


    const routingSwitch = (name: string | undefined, record: any, edit: boolean) => {
        // if (name === "seller") {
        //     const location = `/inquiries/seller/${encodeToBase64(record["id"] + dateString)}`;
        //     handleChangePageWithState(navigate, dispatch, location, { recordIdx: record["id"], row: record, edit })
        // } else if (name === "buyer") {
        //     const location = `/inquiries/buyer/${encodeToBase64(record["id"] + dateString)}`;
        //     handleChangePageWithState(navigate, dispatch, location,  { recordIdx: record["id"], row: record, edit})
        // } else if (name === "projectList") {
        //     const location = `/list/${encodeToBase64(record["id"] + dateString)}`;
        //     handleChangePageWithState(navigate, dispatch, location,  { recordIdx: record["sellerId"], row: record, edit})
        // } else if (name === "buyerPipeline") {
        //     const location = `/pipeline/${encodeToBase64(record["id"] + dateString)}`;
        //     handleChangePageWithState(navigate, dispatch, location, { recordIdx: record["buyerId"], row: record, edit})
        // } 
        console.log("routingSwitch", name, record, edit)
    }


    const menu = (row: T, _: number) => {
        return actionOptions &&
            <Menu onClick={(choice) => {
                const choiceIdx: number = +choice.key;
                if (actionOptions[choiceIdx] === "Details") {
                    routingSwitch(name, row, false);
                }
                if (actionOptions[choiceIdx] === "Edit") {
                    routingSwitch(name, row, true);
                }
                if (actionOptions[choiceIdx] === "Preview") {
                    if (name === "projectList") {
                        console.log(actionOptionCallbacksFinal["Preview"])
                        actionOptionCallbacksFinal["Preview"]();
                    } else if (name === "seller") {

                    }
                }
            }}>
                {actionOptions?.map((elem, index) => <Menu.Item key={`${index}`}>{elem}</Menu.Item>)}
            </Menu>
    }



    const MenuInTooltip = ({ row, rowIdx }: { row: T, rowIdx: number }) => (
        <Tooltip
            ref={menuTooltipRef}
            placement="bottom"
            title={menu(row, rowIdx)}
            trigger="click"
            color={"#fff"}
        >
            <MoreOutlined style={{ fontSize: '24px', cursor: 'pointer', transform: "rotate(90deg)" }} />
        </Tooltip>
    );

    const columns = action ? [
        ...inputColumns
        ,
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            fixed: "right",
            onCell: (_: any) => ({
                onClick: (e) => {
                    e.stopPropagation();
                },
            }),
            render: (_: any, row: T, index: number) => {
                return <MenuInTooltip row={row} rowIdx={index}></MenuInTooltip>
            },
        }
    ] : inputColumns;

    // const numPages = Math.floor(data.length / pageSize) + 1;
    // const showingNum = numPages == pageIndex ? data.length % pageSize : pageSize;

    return (
        <div className={classNamesArgs(styles.container, "self-table")}
            style={{
                border: bordered ? "0px":"none"
                , boxShadow: bordered ? "0px 3px 4px 0px rgba(107, 131, 171, 0.25)":"0px 3px 4px 0px rgba(107, 131, 171, 0) !important"
        }
            }
        >
            <Table<T>
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey={rowKey}
                onRow={(record, _) => {
                    return {
                        onClick: (e) => {
                            console.log(e);
                            e.stopPropagation();
                            onRowClickCallback(record);
                        },
                        onDoubleClick: () => {
                            routing ? routingSwitch(name, record, true) : onRowDoubleClickCallback();
                        }, // double click row
                    };
                }}
                scroll={{ x: "max-content" }}
                pagination={pagination && {
                    current: pageIndex,
                    pageSize: pageSize,
                    onChange: (page, _) => {
                        setPageIndex(page);
                    },
                    showSizeChanger: true,
                    onShowSizeChange: (_, newPageSize) => {
                        setPageIndex(1);
                        setPageSize(newPageSize);
                    },
                    pageSizeOptions: [5, 10, 50],
                    position: ['bottomRight']
                }}
            // summary={() => (
            //     <Table.Summary fixed={'bottom'}>
            //         <Table.Summary.Row >
            //             <Table.Summary.Cell index={2} colSpan={8}>
            //                 <span style={{ color: "black", fontWeight: 500 }}>Showing {showingNum} results of {data.length} results</span>
            //             </Table.Summary.Cell>
            //         </Table.Summary.Row>
            //     </Table.Summary>
            // )}
            >
            </Table>
        </div>
    );
};

export default EditableTable;