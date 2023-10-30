// import { useState } from 'react'

import logo from 'assets/logo.png'
import { AppBar, Button, IconButton, Link, Toolbar, Typography } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'

export function ServiceHeader({ version }: { version: string }) {
  return (
    <>
      <AppBar position={'static'} color={'transparent'}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <img src={logo} height="55px" />
            <span style={{ verticalAlign: 'super', fontSize: '0.75rem' }}>{version}</span>
          </Typography>
          <Link href={'https://github.com/evidentlyai/evidently'}>
            <IconButton>
              <GitHubIcon />
            </IconButton>
          </Link>
          <Link href={'https://docs.evidentlyai.com/'}>
            <Button>Docs</Button>
          </Link>
        </Toolbar>
      </AppBar>
    </>
  )
}
