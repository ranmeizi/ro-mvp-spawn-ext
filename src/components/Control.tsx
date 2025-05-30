import { Button, styled } from '@mui/material';
import * as React from 'react';
import Test from './Test';

const Root = styled("div")(() => ({
    color: 'red'
}));

export default function Control() {
    const [count, setCount] = React.useState(0)

    React.useEffect(() => {
        setInterval(() => {
            setCount(x => x + 1)
        }, 1000);
    }, [])

    return (
        <Root>
            <div style={{ color: 'white' }}>{count}</div>
            hi
            <div style={{ position: 'fixed' }}>
                <Test></Test>
            </div>
        </Root>
    );
}