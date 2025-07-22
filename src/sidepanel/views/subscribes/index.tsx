import { Box, Button, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import RefreshIcon from '@mui/icons-material/Refresh';
import { getRewardRank } from "@/services/momoro";
import { getSubscribes } from "@/utils/contents/renderMvpTarget";
import MvpConfig from '@/datas/mvp'
import { useI18n } from "@/locales";


export default function () {

    const [data, setData] = useState([])

    const { t } = useI18n()

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
    const columns: GridColDef<any>[] = [
        { field: 'map', headerName: t('tableCols.map') },
        { field: 'name', headerName: t('tableCols.mvpName')},
        {
            field: 'option', headerName: t('option')
        },
    ];
    columns[columns.length - 1] = {
        ...columns[columns.length - 1],
        renderCell(params) {
            return <Button onClick={async () => {
                if (window.confirm(t('tab.MVPSubscribe.unsubscribe.confirm'))) {
                    const subscribes = await getSubscribes()
                    await chrome.storage.local.set({ mvp_subscribes: subscribes.filter(item => item !== `${params.row.map}-${params.row.id}`) })
                    getData()
                    chrome.runtime.sendMessage({ type: "mvp_refresh" })
                }
            }}>{t('tab.MVPSubscribe.unsubscribe')}</Button>
        }
    }

    return <Box>
        <Typography variant='h6' gutterBottom component="div" sx={{ p: 2 }}>
            {t('tab.MVPSubscribe.title')}
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
            {t('refresh')}
        </Button>
        <DataGrid
            getRowId={row => row.map + '-' + row.id}
            rows={data}
            columns={columns}
        />
    </Box>
}