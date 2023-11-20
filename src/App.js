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
import React from 'react';
import { usePersistedState } from './usePersistedState';
import TabPanel from './TabPanel';
import './App.css';

function calculateBreakEven(totalMarketValue, numberOfCards, staticCost, relativeCost) {
  return totalMarketValue - (relativeCost * totalMarketValue) - (staticCost * numberOfCards);
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

  const [tabIndex, setTabIndex] = usePersistedState('tabIndex', 0);
  const [totalMarketValue, setTotalMarketValue] = usePersistedState('totalMarketValue', 100);
  const [numberOfItems, setNumberOfItems] = usePersistedState('numberOfItems', 10);
  const [staticCost, setStaticCost] = usePersistedState('staticCost', 0.50);
  const [relativeCost, setRelativeCost] = usePersistedState('relativeCost', .15);
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
          <Tab label="By Profit / Card" />
        </Tabs>
        <TabPanel value={tabIndex} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Margin %</TableCell>
                  <TableCell>Profit</TableCell>
                  <TableCell>P/C</TableCell>
                  <TableCell>Offer</TableCell>
                  <TableCell>Offer %</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array(11).fill().map((_, i) => {
                  const profitMargin = i * .05;
                  const offer = breakEven - (totalMarketValue * profitMargin);
                  const profit = breakEven - offer;
                  const profitPerCard = profit / numberOfItems;
                  return (
                    <TableRow>
                      <TableCell component="th" scope="row">{profitMargin.toLocaleString("en", { style: "percent" })}</TableCell>
                      <TableCell>{profit.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{profitPerCard.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{offer.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{(offer / totalMarketValue).toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}</TableCell>
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
                  <TableCell>Offer %</TableCell>
                  <TableCell>Offer</TableCell>
                  <TableCell>Margin %</TableCell>
                  <TableCell>Profit</TableCell>
                  <TableCell>P/C</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array(11).fill().map((_, i) => {
                  const offerPercentage = i * .05 + 0.5;
                  const offer = totalMarketValue * offerPercentage;
                  const profit = breakEven - offer;
                  const profitPerCard = profit / numberOfItems;
                  return (
                    <TableRow>
                      <TableCell component="th" scope="row">{offerPercentage.toLocaleString("en", { style: "percent" })}</TableCell>
                      <TableCell>{offer.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{(profit / totalMarketValue).toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{profit.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{profitPerCard.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>P/C</TableCell>
                  <TableCell>Profit</TableCell>
                  <TableCell>Margin %</TableCell>
                  <TableCell>Offer</TableCell>
                  <TableCell>Offer %</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array(11).fill().map((_, i) => {
                  const profitPerCard = i * 0.25;
                  const profit = profitPerCard * numberOfItems;
                  const profitMargin = profit / totalMarketValue;
                  const offer = breakEven - (totalMarketValue * profitMargin);
                  return (
                    <TableRow>
                      <TableCell component="th" scope="row">{profitPerCard.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{profit.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{profitMargin.toLocaleString("en", { style: "percent" })}</TableCell>
                      <TableCell>{offer.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{(offer / totalMarketValue).toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}</TableCell>
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
