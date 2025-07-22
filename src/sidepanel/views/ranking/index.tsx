import { Box, Button, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import RefreshIcon from '@mui/icons-material/Refresh';
import { getRewardRank } from "@/services/momoro";
import { useI18n } from "@/locales";


export default function () {

    const [data, setData] = useState([])

    const [loading, setLoading] = useState(false)

    const {t} = useI18n()

    useEffect(() => {
        getData()
    }, [])

    async function getData() {
        setLoading(true)
        try {
            const res = await getRewardRank()
            setData(res.data || [])
        } finally {
            setLoading(false)
        }
    }

    const columns: GridColDef<any>[] = [
    { field: 'subject', headerName: t('tableCol.id'), width: 200 },
    {
        field: 'cnt',
        headerName: t('tableCols.cnt'),
        width: 100,
    },
];

    return <Box>
        <Typography variant='h6' gutterBottom component="div" sx={{ p: 2 }}>
            {t('tab.itemObtainRank.title')}
        </Typography>
        {/* 刷新按钮 */}
        <Button
            fullWidth
            loading={loading}
            loadingPosition="start"
            startIcon={<RefreshIcon />}
            variant="outlined"
            onClick={() => getData()}
            sx={{ mb: 2 }}
        >
            {t('refresh')}
        </Button>
        <DataGrid
            getRowId={row => row.subject}
            rows={data}
            columns={columns}
        />
    </Box>
}