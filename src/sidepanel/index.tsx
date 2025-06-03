import { AppBar, Box, createTheme, CssBaseline, Fab, IconButton, styled, Tab, Tabs, ThemeProvider, Toolbar, Typography, useMediaQuery } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useEffect, useMemo, useState } from "react";
import Ranking from "./views/ranking";
import Search from "./views/search";

const StyledFab = styled(Fab)({
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
});

export default function () {
    const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

    const [active, setActive] = useState(0)

    const view = useMemo(() => {
        switch (active) {
            case 0:
                return <Search />
            case 1:
                return <Ranking />
            default:
                return 'empty'
        }
    }, [active])

    function getSerch() {
        const params = new URLSearchParams(location.search)
        const type = params.get('type')

        if (type === 'search') {
            setActive(0)
        } else if (type === 'ranking') {
            setActive(1)
        }
    }

    useEffect(() => {
        getSerch()
    }, [])


    return <ThemeProvider theme={createTheme({ palette: { mode: prefersDarkMode ? 'dark' : 'light' } })}>
        <CssBaseline />
        <Box>
            <Box sx={{ padding: 2, pb: '64px' }}>
                <Typography variant="h5" gutterBottom component="div" sx={{ p: 2, pb: 0 }}>
                    IngameNews 小助手
                </Typography>
                <Tabs value={active} onChange={(e, v) => setActive(v)} centered>
                    <Tab label="数据查询" />
                    <Tab label="掉落排名" />
                </Tabs>
                {view}
            </Box>

            <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
                <Toolbar>
                    <IconButton color="inherit" aria-label="open drawer">
                        <MenuIcon />
                    </IconButton>
                    <Box sx={{ flexGrow: 1 }} />
                </Toolbar>
            </AppBar>
        </Box>
    </ThemeProvider>
}