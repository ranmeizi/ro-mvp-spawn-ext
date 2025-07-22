import { Box, Button, FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Select, TextField, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import RefreshIcon from '@mui/icons-material/Refresh';
import { getRewardRank, rewardsStatistic, searchNews } from "@/services/momoro";
import { EnumMsgType } from "@/datas/note";
import { useI18n } from "@/locales";


export default function () {

    const [data, setData] = useState([])

    const [loading, setLoading] = useState(false)

    const { t } = useI18n()

    const [search, setSearch] = useState('')
    const [type, setType] = useState<'1' | '2'>('1')

    async function getData() {
        setLoading(true)
        try {
            const res = await rewardsStatistic({ search, type })
            setData(res?.data || [])
        } finally {
            setLoading(false)
        }
    }

    const columns: GridColDef<any>[] = [
        { field: 'subject', headerName: t('tableCol.object'), width: 200 },
        { field: 'cnt', headerName: t('tableCols.cnt'), width: 200 },
    ];

    return <Box>
        <Typography variant='h6' gutterBottom component="div" sx={{ p: 2 }}>
            {t('tab.newsStatistic.title')}
        </Typography>
        <Box display='flex' sx={{
            containerType: 'inline-size',
            containerName: 'sidebar',
            gap: '16px',

            '@container sidebar(width < 400px)': {
                '.form-item': {
                    width: '100%'
                }
            },

            '.form-item': {
                width: '50%'
            }
        }}
        >
            <Box className='form-item' sx={{ mb: 2 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">{t('tab.newsStatistic.groupBy')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={type}
                        size='small'
                        label={t('tab.newsStatistic.groupBy')}
                        onChange={(e) => {
                            const value = e.target.value
                            setType(value);
                        }}
                    >
                        <MenuItem value={'1'}>
                            {t('tab.newsStatistic.groupBy.object')}
                        </MenuItem>
                        <MenuItem value={'2'}>
                            {t('tab.newsStatistic.groupBy.subject')}
                        </MenuItem>
                    </Select>
                </FormControl>

            </Box>
            <Box className='form-item'>
                <TextField
                    id="outlined-basic"
                    size='small'
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    label={type === '1'
                        ? t('tab.newsStatistic.input.label.whenObject')
                        : t('tab.newsStatistic.input.label.whenSubject')}
                    placeholder={type === '1'
                        ? t('tab.newsStatistic.input.placeholder.whenObject')
                        : t('tab.newsStatistic.input.placeholder.whenSubject')}
                    variant="outlined"
                    sx={{ width: '100%' }}
                />
            </Box>
        </Box>
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
            {t('query')}
        </Button>
        <DataGrid
            getRowId={row => row.subject}
            rows={data}
            columns={columns}
            paginationMode='server'

        />
    </Box>
}