import { ThemeProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { createTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useState } from 'react';

import './App.css';

function calculateBreakEven(totalSalesPrice, numberOfItems, staticCost, relativeCost) {
  return totalSalesPrice - (relativeCost * totalSalesPrice) - (staticCost * numberOfItems);
}

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode],
  );
  const [totalSalesPrice, setTotalSalesPrice] = useState(100);
  const [numberOfItems, setNumberOfItems] = useState(10);
  const [staticCost, setStaticCost] = useState(0.30);
  const [relativeCost, setRelativeCost] = useState(.1275);
  const breakEven = calculateBreakEven(totalSalesPrice, numberOfItems, staticCost, relativeCost);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack spacing={2} margin={2}>
        <Typography variant="h3">Offer Calculator</Typography>
        <TextField id="outlined-basic" label="Total Sales Price" variant="outlined" value={totalSalesPrice} onChange={(e) => setTotalSalesPrice(e.target.value)} InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }} />
        <TextField id="outlined-basic" label="Number of Items" variant="outlined" value={numberOfItems} onChange={(e) => setNumberOfItems(e.target.value)} />
        <TextField id="outlined-basic" label="Static Cost per Item" variant="outlined" value={staticCost} onChange={(e) => setStaticCost(e.target.value)} InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }} />
        <TextField id="outlined-basic" label="Relative Cost" variant="outlined" value={relativeCost} onChange={(e) => setRelativeCost(e.target.value)} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Profit Margin</TableCell>
                <TableCell>Offer ($)</TableCell>
                <TableCell>Offer (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Array(21).fill().map((_, i) => {
                const percent = i * .05;
                return (
                  <TableRow>
                    <TableCell component="th" scope="row">{percent.toLocaleString("en", { style: "percent" })}</TableCell>
                    <TableCell>{(breakEven - (totalSalesPrice * percent)).toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>{((breakEven - (totalSalesPrice * percent)) / totalSalesPrice).toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </ThemeProvider>
  );
}

export default App;
