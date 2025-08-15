import { defectColorMap, DefectSeverity } from "@/commons/types/defect";
import { DefectRankingTableDataRow } from "@/commons/types/report";
import defectRankingTableStyles from "@/pages/ReportPages/ReportDetailPage/DailyReportDetailPage/components/DefectRankingTable.module.less";
import { Tag } from "antd";

export const useColumns = () => {



    const getDefectRankingTableColumns = () => {
    return [
        {
            title: 'Defects',
            dataIndex: 'defect',
            key: 'defect',
            align: 'left' as const,
            width: '25%', 
            render: (text: string, record: DefectRankingTableDataRow) => (
              <div className={defectRankingTableStyles.defectName}>   
                <span className={defectRankingTableStyles.defectId}>{record.id}</span>
                <span>{text}</span>
              </div>
            ),
          },
          {
            title: 'Level',
            dataIndex: 'level',
            key: 'level',
            align: 'center' as const,
            render: (level: DefectSeverity) => {
              const color = defectColorMap[level];
      
              return (
                <Tag color={color} className={defectRankingTableStyles.levelTag}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Tag>
              );
            },
          },
          {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            sorter: (a: DefectRankingTableDataRow, b: DefectRankingTableDataRow) => a.quantity - b.quantity,
            defaultSortOrder: 'descend',
            align: 'center' as const,
            render: (quantity: number) => (
              <div className={defectRankingTableStyles.quantityCell}>
                {quantity}
              </div>
            ),
          },
          { 
            title: 'Percentage',
            dataIndex: 'percentage',
            key: 'percentage',
            align: 'center' as const,
            render: (percentage: number) => (
              <div className={defectRankingTableStyles.percentageCell}>
                {percentage.toFixed(2) + "%"}
              </div>
            ),
          },
          {
            title: 'Production Lines',
            dataIndex: 'production_line',
            key: 'production_line',
            align: 'center' as const,
            render: (lines: string[]) => (
              <div className={defectRankingTableStyles.assemblyLineCell}>
                {lines.map((line, index) => (
                  <div className={defectRankingTableStyles.assemblyLineCircle} key={line + index}>
                    {line}
                  </div>
                ))}
              </div>
            ),
          },
        ]
    }


    return {
        getDefectRankingTableColumns
    }
}
