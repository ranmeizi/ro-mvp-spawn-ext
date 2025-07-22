import { AppBar, Box, createTheme, CssBaseline, Fab, IconButton, styled, Tab, Tabs, ThemeProvider, Toolbar, Typography, useMediaQuery } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useEffect, useMemo, useState } from "react";
import Ranking from "./views/ranking";
import Search from "./views/search";
import Subscribes from "./views/subscribes";
import Group from "./views/group";
import { I18nProvider, useI18n } from "@/locales";
import { Menu } from "@mui/material";
import { MenuItem } from "@mui/material";
import { Button } from "@mui/material";

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

    return <ThemeProvider theme={createTheme({ palette: { mode: prefersDarkMode ? 'dark' : 'light' } })}>
        <CssBaseline />
        <I18nProvider>
            <SidePanelApp />
        </I18nProvider>
    </ThemeProvider>
}

function SidePanelApp() {
    const [active, setActive] = useState(0)

    const { t, lang, setLang } = useI18n()

    const [menuAnchor, setMenuAnchor] = useState(undefined)

    const view = useMemo(() => {
        switch (active) {
            case 0:
                return <Search />
            case 1:
                return <Ranking />
            case 2:
                return <Group />
            case 3:
                return <Subscribes />
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

    const langName = useMemo(() => {
        switch (lang) {
            case "zh":
                return '中文'
            case "en":
                return 'English'
        }
    }, [lang])

    const open = !!menuAnchor

    return <Box>
        <Box sx={{ padding: 2, pb: '64px' }}>
            <Box display={'flex'} justifyContent={'space-between'}>
                <Typography variant="h5" gutterBottom component="div" sx={{ p: 2, pb: 0 }}>
                    {t('panel.title')}
                </Typography>
                <Box display={'flex'}>
                    <Typography gutterBottom component="div" sx={{ p: 2, pb: 0 }}>
                        {t('language')}:
                    </Typography>
                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={e => setMenuAnchor(e.currentTarget)}
                    >
                        {langName}
                    </Button>
                </Box>

                <Menu
                    id="basic-menu"
                    anchorEl={menuAnchor}
                    open={open}
                    onClose={() => setMenuAnchor(undefined)}

                >
                    <MenuItem onClick={() => {
                        setLang('zh')
                        chrome.storage.local.set({ lang: 'zh' })
                        setMenuAnchor(undefined)
                    }}>中文</MenuItem>
                    <MenuItem onClick={() => {
                        setLang('en')
                        chrome.storage.local.set({ lang: 'en' })
                        setMenuAnchor(undefined)
                    }}>English</MenuItem>
                </Menu>
            </Box>

            <Tabs value={active} onChange={(e, v) => setActive(v)} centered>
                <Tab label={t('tab.dataQuery')} />
                <Tab label={t('tab.itemObtainRank')} />
                <Tab label={t('tab.newsStatistic')} />
                <Tab label={t('tab.MVPSubscribe')} />
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
}   