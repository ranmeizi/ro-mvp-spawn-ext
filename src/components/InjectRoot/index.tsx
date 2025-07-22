import createCache from '@emotion/cache';
import { CacheProvider } from "@emotion/react"
import { Button, styled } from '@mui/material';
import * as React from 'react';


export default function InjectRoot({ children }: React.PropsWithChildren) {
    const cache = createCache({
        key: "mui",
        container: document.querySelector('plasmo-csui').shadowRoot
    })

    return (
        <CacheProvider value={cache}>
            <div style={{height:'max-content',width:'max-content',pointerEvents:'none'}}>
                {children}
            </div>
        </CacheProvider>
    );
}