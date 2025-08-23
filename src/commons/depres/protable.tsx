// const waitTime = (time: number = 100) => {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve(true)
//         }, time)
//     })
// }

// const addMultipleRows = (count: number) => {
//     console.log(`Adding ${count} rows, current dataSource length:`, dataSource.length);

//     const newRows: User[] = [];
//     for (let i = 0; i < count; i++) {
//         newRows.push(DEFAULT_NEW_ROW);
//     }

//     // Always add to bottom
//     const newDataSource = [...dataSource, ...newRows];
//     console.log('New dataSource length:', newDataSource.length);
//     setDataSource(newDataSource);

//     // Set all new rows as editable
//     const newEditableKeys = newRows.map(row => row.employeeNo);
//     setEditableRowKeys([...editableKeys, ...newEditableKeys]);
//     console.log('New editable keys:', newEditableKeys);
// }


// <EditableProTable<User>
        //     rowKey="employeeNo"
        //     headerTitle="用户列表"
        //     scroll={{
        //         x: 960,
        //     }}
        //     recordCreatorProps={false}
        //     loading={false}
        //     toolBarRender={() => [
        //         <Button
        //             key="addOne"
        //             type="primary"
        //             onClick={() => addMultipleRows(1)}
        //         >
        //             添加一行
        //         </Button>,
        //         <Button
        //             key="addFive"
        //             onClick={() => addMultipleRows(5)}
        //         >
        //             添加5行
        //         </Button>,
        //         <Button
        //             key="addTen"
        //             onClick={() => addMultipleRows(10)}
        //         >
        //             添加10行
        //         </Button>,
        //     ]}
        //     columns={PROCOLUMNS_CONFIGS}
        //     value={dataSource.length > 0 ? dataSource : []}
        //     onChange={(value) => setDataSource([...value])}
        //     editable={{
        //         type: 'multiple',
        //         editableKeys,
        //         onSave: async (rowKey, data, row) => {
        //             console.log('Saving row:', rowKey, data, row);
        //             await waitTime(1000);
        //         },
        //         onChange: setEditableRowKeys,
        //         actionRender: (row, _, dom) => [
        //             dom.save,
        //             dom.cancel,
        //             <Button
        //                 key="delete"
        //                 size="small"
        //                 danger
        //                 onClick={() => {
        //                     setDataSource(dataSource.filter(item => item.employeeNo !== row.employeeNo));
        //                     setEditableRowKeys(editableKeys.filter(key => key !== row.employeeNo));
        //                 }}
        //             >
        //                 删除
        //             </Button>,
        //         ],
        //     }}
        // />