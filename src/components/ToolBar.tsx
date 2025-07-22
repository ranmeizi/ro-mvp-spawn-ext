import * as React from 'react';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import RefreshIcon from '@mui/icons-material/Refresh';
import DvrIcon from '@mui/icons-material/Dvr';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import CrueltyFreeIcon from '@mui/icons-material/CrueltyFree';
import MapIcon from '@mui/icons-material/Map';
import { t } from '@/locales';

type ToolBarProps = {
  type: 'momocord' | 'ragnaboard'
}

export default function ToolBar({ type }: ToolBarProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


const ragnaBoardsActions = [
  { icon: <RefreshIcon />, name: t(window.lang, 'refresh') },
  { icon: <CrueltyFreeIcon />, name: 'Discord' },
  { icon: <ContentPasteSearchIcon />, name: t(window.lang, 'navToDataQuery') },
  { icon: <DvrIcon />, name: t(window.lang, 'navToRanking') },
];

const momoCordActions = [
  { icon: <MapIcon />, name: t(window.lang, 'map') },
  { icon: <ContentPasteSearchIcon />, name: t(window.lang, 'navToDataQuery') },
  { icon: <DvrIcon />, name: t(window.lang, 'navToRanking') },
];


  const actions = type === 'momocord' ? momoCordActions : ragnaBoardsActions

  return (
    <Box sx={{ position: 'fixed', bottom: 0, right: 0, transform: 'translateZ(0px)', }}>
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon sx={{ fontSize: 18 }} />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={() => {
              handleClose()
              // 发送事件
              // 创建并派发自定义事件
              const event = new CustomEvent('CommandMessage', {
                detail: {
                  key: action.name
                }
              });
              window.dispatchEvent(event);
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}