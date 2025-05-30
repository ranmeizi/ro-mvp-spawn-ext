import { Box, Button, Grid, MenuItem, OutlinedInput, Select, TextField, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import { useEffect, useState } from "react";
import RefreshIcon from '@mui/icons-material/Refresh';
import { getRewardRank, searchNews } from "@/services/momoro";

const columns: GridColDef<any>[] = [
    { field: 'subject', headerName: '游戏id', width: 300 },
    { field: 'object', headerName: '对象', width: 300 },
    { field: 'objectId', headerName: '对象id', width: 100 },
    { field: 'type', headerName: '类型', width: 100 },
];


export default function () {

    const [data, setData] = useState([])

    const [loading, setLoading] = useState(false)

    const [{ total, ...pagination }, setPagination] = useState({
        page: 1,
        pageSize: 20,
        total: 0
    })

    const [search, setSearch] = useState('')
    const [type, setType] = useState('1,2')

    useEffect(() => {
        getData(pagination)
    }, [])

    async function getData({ page, pageSize }) {
        setLoading(true)
        try {
            const res = await searchNews({
                current: page,
                pageSize: pageSize,
                search,
                type
            })
            setData(res.data?.list || [])
            setPagination({
                page,
                pageSize,
                total: res.data?.total
            })
        } finally {
            setLoading(false)
        }
    }

    return <Box>
        <Typography variant='h6' gutterBottom component="div" sx={{ p: 2 }}>
            获取 discord ingame news 查询删选 news
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
            <Box className='form-item'>
                <TextField
                    id="outlined-basic"
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    label="关键字搜索"
                    placeholder="游戏ID/物品名称/MVP名称/物品id"
                    variant="outlined"
                    sx={{ width: '100%' }}
                />
            </Box>
            <Box className='form-item' sx={{ mb: 2 }}>
                <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={type.split(',')}
                    onChange={(e) => {
                        const value = e.target.value
                        console.log('vvvvvvv',value)
                        setType(typeof value === 'string' ? value : value.join(','));
                    }}
                    input={<OutlinedInput label="Name" />}
                    sx={{ width: '100%' }}
                >
                    <MenuItem value={'0'}>
                        Mvp击杀
                    </MenuItem>
                    <MenuItem value={'1'}>
                        获取
                    </MenuItem>
                    <MenuItem value={'2'}>
                        偷窃
                    </MenuItem>
                </Select>
            </Box>
        </Box>
        {/* 刷新按钮 */}
        <Button
            fullWidth
            loading={loading}
            loadingPosition="start"
            startIcon={<RefreshIcon />}
            variant="outlined"
            onClick={() => getData(pagination)}
            sx={{ mb: 2 }}
        >
            查询
        </Button>
        <DataGrid
            getRowId={row => row.key}
            rows={data}
            columns={columns}
            rowCount={total}
            paginationMode='server'
            paginationModel={pagination}
            onPaginationModelChange={(p) => getData(p)}
        />
    </Box>
}