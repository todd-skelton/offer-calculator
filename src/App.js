import { ThemeProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { createTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useState } from 'react';

import './App.css';

function calculateBreakEven(totalMarketValue, numberOfCards, staticCost, relativeCost) {
  return totalMarketValue - (relativeCost * totalMarketValue) - (staticCost * numberOfCards);
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Typography>{children}</Typography>
      )}
    </div>
  );
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
  const [tabIndex, setTabIndex] = React.useState(0);
  const [totalMarketValue, setTotalMarketValue] = useState(100);
  const [numberOfItems, setNumberOfItems] = useState(10);
  const [staticCost, setStaticCost] = useState(0.50);
  const [relativeCost, setRelativeCost] = useState(.1275);
  const breakEven = calculateBreakEven(totalMarketValue, numberOfItems, staticCost, relativeCost);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack spacing={2} margin={2}>
        <Typography variant="h3">Offer Calculator</Typography>
        <TextField id="total-market-value" label="Total market value" variant="outlined" value={totalMarketValue} onChange={(e) => setTotalMarketValue(e.target.value)} InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }} />
        <TextField id="number-of-cards" label="Number of cards" variant="outlined" value={numberOfItems} onChange={(e) => setNumberOfItems(e.target.value)} />
        <TextField id="static-cost-per-card" label="Static cost per card" variant="outlined" value={staticCost} onChange={(e) => setStaticCost(e.target.value)} InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
        }} />
        <TextField id="relative-cost" label="Relative cost" variant="outlined" value={relativeCost} onChange={(e) => setRelativeCost(e.target.value)} />
        <Tabs value={tabIndex} onChange={(_, i) => setTabIndex(i)}>
          <Tab label="By profit margin" />
          <Tab label="By offer %" />
        </Tabs>
        <TabPanel value={tabIndex} index={0}>
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
                {Array(11).fill().map((_, i) => {
                  const percent = i * .05;
                  return (
                    <TableRow>
                      <TableCell component="th" scope="row">{percent.toLocaleString("en", { style: "percent" })}</TableCell>
                      <TableCell>{(breakEven - (totalMarketValue * percent)).toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{((breakEven - (totalMarketValue * percent)) / totalMarketValue).toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Offer (%)</TableCell>
                  <TableCell>Offer ($)</TableCell>
                  <TableCell>Profit Margin</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array(11).fill().map((_, i) => {
                  const percent = i * .05 + 0.5;
                  const offer = totalMarketValue * percent;
                  return (
                    <TableRow>
                      <TableCell component="th" scope="row">{percent.toLocaleString("en", { style: "percent" })}</TableCell>
                      <TableCell>{offer.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{((breakEven - percent * totalMarketValue) / totalMarketValue).toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

      </Stack>
    </ThemeProvider>
  );
}

export default App;
