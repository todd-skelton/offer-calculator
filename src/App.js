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
import { useLocalStorageState } from './useLocalStorageState';
import TabPanel from './TabPanel';
import './App.css';


function calculateBreakEven(totalMarketValue, numberOfCards, staticCost, relativeCost) {
  return totalMarketValue - (relativeCost * totalMarketValue) - (staticCost * numberOfCards);
}

function tryEval(value) {
  try {
    return eval(value);
  }
  catch {
    return NaN;
  }
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

  const [tabIndex, setTabIndex] = useLocalStorageState('tabIndex', 0);
  const [totalMarketValue, setTotalMarketValue] = useLocalStorageState('totalMarketValue', 100);
  const [numberOfItems, setNumberOfItems] = useLocalStorageState('numberOfItems', 10);
  const [staticCost, setStaticCost] = useLocalStorageState('staticCost', 0.30);
  const [relativeCost, setRelativeCost] = useLocalStorageState('relativeCost', .1275);
  
  const evaluatedTotalMarketValue = tryEval(totalMarketValue);
  const evaluatedNumberOfItems = tryEval(numberOfItems);
  const evaluatedStaticCost = tryEval(staticCost);
  const evaluatedRelativeCost = tryEval(relativeCost);

  const breakEven = calculateBreakEven(evaluatedTotalMarketValue, evaluatedNumberOfItems, evaluatedStaticCost, evaluatedRelativeCost);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack spacing={2} margin={2}>
        <Typography variant="h3">Offer Calculator</Typography>
        <TextField id="total-market-value" label="Total market value" variant="outlined" value={totalMarketValue} onChange={(e) => setTotalMarketValue(e.target.value)} InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
          endAdornment: <InputAdornment position="end">{evaluatedTotalMarketValue?.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</InputAdornment>,
        }} />
        <TextField id="number-of-cards" label="Number of cards" variant="outlined" value={numberOfItems} onChange={(e) => setNumberOfItems(e.target.value)} InputProps={{
          endAdornment: <InputAdornment position="end">{evaluatedNumberOfItems?.toLocaleString()}</InputAdornment>,
        }} />
        <TextField id="static-cost-per-card" label="Static cost per card" variant="outlined" value={staticCost} onChange={(e) => setStaticCost(e.target.value)} InputProps={{
          startAdornment: <InputAdornment position="start">$</InputAdornment>,
          endAdornment: <InputAdornment position="end">{evaluatedStaticCost?.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</InputAdornment>,
        }} />
        <TextField id="relative-cost" label="Relative cost" variant="outlined" value={relativeCost} onChange={(e) => setRelativeCost(e.target.value)} InputProps={{
          endAdornment: <InputAdornment position="end">{evaluatedRelativeCost?.toLocaleString("en", { style: "percent", minimumFractionDigits: 0, maximumFractionDigits: 5 })}</InputAdornment>,
        }} />
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
                  const offer = breakEven - (evaluatedTotalMarketValue * profitMargin);
                  const profit = breakEven - offer;
                  const profitPerCard = profit / evaluatedNumberOfItems;
                  return (
                    <TableRow>
                      <TableCell component="th" scope="row">{profitMargin.toLocaleString("en", { style: "percent" })}</TableCell>
                      <TableCell>{profit.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{profitPerCard.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{offer.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{(offer / evaluatedTotalMarketValue).toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}</TableCell>
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
                  const offer = evaluatedTotalMarketValue * offerPercentage;
                  const profit = breakEven - offer;
                  const profitPerCard = profit / evaluatedNumberOfItems;
                  return (
                    <TableRow>
                      <TableCell component="th" scope="row">{offerPercentage.toLocaleString("en", { style: "percent" })}</TableCell>
                      <TableCell>{offer.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{(profit / evaluatedTotalMarketValue).toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}</TableCell>
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
                  const profit = profitPerCard * evaluatedNumberOfItems;
                  const profitMargin = profit / evaluatedTotalMarketValue;
                  const offer = breakEven - (evaluatedTotalMarketValue * profitMargin);
                  return (
                    <TableRow>
                      <TableCell component="th" scope="row">{profitPerCard.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{profit.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{profitMargin.toLocaleString("en", { style: "percent" })}</TableCell>
                      <TableCell>{offer.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                      <TableCell>{(offer / evaluatedTotalMarketValue).toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}</TableCell>
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
