import { Box, Button, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import RefreshIcon from '@mui/icons-material/Refresh';
import { getRewardRank } from "@/services/momoro";
import { getSubscribes } from "@/utils/contents/renderMvpTarget";
import MvpConfig from '@/datas/mvp'

const columns: GridColDef<any>[] = [
    { field: 'map', headerName: '地图' },
    { field: 'name', headerName: 'MVP名称' },
    {
        field: 'option', headerName: '操作'
    },
];


export default function () {

    const [data, setData] = useState([])

    useEffect(() => {
        getData()
    }, [])

    async function getData() {

        try {
            const res = (await getSubscribes()).map(item => {
                const [map, id] = item.split('-')
                return {
                    id,
                    map,
                    name: MvpConfig[id].name_CN
                }
            })
            console.log('可能啊看', res)
            setData(res || [])
        } finally {

        }
    }
    columns[columns.length - 1] = {
        ...columns[columns.length - 1],
        renderCell(params) {
            return <Button onClick={async () => {
                if (window.confirm('确定要取消订阅吗')) {
                    const subscribes = await getSubscribes()
                    await chrome.storage.local.set({ mvp_subscribes: subscribes.filter(item => item !== `${params.row.map}-${params.row.id}`) })
                    getData()
                    chrome.runtime.sendMessage({ type: "mvp_refresh" })
                }
            }}>取消订阅</Button>
        }
    }

    return <Box>
        <Typography variant='h6' gutterBottom component="div" sx={{ p: 2 }}>
            订阅列表
        </Typography>
        {/* 刷新按钮 */}
        <Button
            fullWidth
            loadingPosition="start"
            startIcon={<RefreshIcon />}
            variant="outlined"
            onClick={() => getData()}
            sx={{ mb: 2 }}
        >
            刷新
        </Button>
        <DataGrid
            getRowId={row => row.map + '-' + row.id}
            rows={data}
            columns={columns}
        />
    </Box>
}