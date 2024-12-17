import { ThemeProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
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
  const [staticOverhead, setStaticOverhead] = useLocalStorageState('staticOverhead', 0.30);
  const [relativeOverhead, setRelativeOverhead] = useLocalStorageState('relativeOverhead', .1275);

  const evaluatedTotalMarketValue = tryEval(totalMarketValue);
  const evaluatedNumberOfItems = tryEval(numberOfItems);
  const evaluatedStaticOverhead = tryEval(staticOverhead);
  const evaluatedRelativeOverhead = tryEval(relativeOverhead);

  const overhead = (evaluatedRelativeOverhead * evaluatedTotalMarketValue) + (evaluatedStaticOverhead * evaluatedNumberOfItems);
  const breakEven = evaluatedTotalMarketValue - overhead;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container>
        <Stack spacing={2} margin={2}>
          <Typography variant="h3">Offer Calculator</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField id="total-market-value" label="Total market value" variant="outlined" value={totalMarketValue} onChange={(e) => setTotalMarketValue(e.target.value)} fullWidth InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              endAdornment: <InputAdornment position="end">{evaluatedTotalMarketValue?.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</InputAdornment>,
            }} />
            <TextField id="number-of-cards" label="Number of cards" variant="outlined" value={numberOfItems} onChange={(e) => setNumberOfItems(e.target.value)} fullWidth InputProps={{
              endAdornment: <InputAdornment position="end">{evaluatedNumberOfItems?.toLocaleString()}</InputAdornment>,
            }} />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField id="relative-cost" label="Relative overhead" variant="outlined" value={relativeOverhead} onChange={(e) => setRelativeOverhead(e.target.value)} fullWidth InputProps={{
              endAdornment: <InputAdornment position="end">{evaluatedRelativeOverhead?.toLocaleString("en", { style: "percent", minimumFractionDigits: 0, maximumFractionDigits: 5 })}</InputAdornment>,
            }} />
            <TextField id="static-overhead-per-item" label="Static overhead per item" variant="outlined" value={staticOverhead} onChange={(e) => setStaticOverhead(e.target.value)} fullWidth InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              endAdornment: <InputAdornment position="end">{evaluatedStaticOverhead?.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</InputAdornment>,
            }} />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField id="total-overhead" label="Total overhead" variant="outlined" value={overhead} fullWidth InputProps={{
              endAdornment: <InputAdornment position="end">{overhead?.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</InputAdornment>,
            }} disabled />
            <TextField id="break-even" label="Break-even" variant="outlined" value={breakEven} fullWidth InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
              endAdornment: <InputAdornment position="end">{breakEven?.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</InputAdornment>,
            }} disabled />
          </Stack>
          <Tabs variant="scrollable" value={tabIndex} onChange={(_, i) => setTabIndex(i)}>
            <Tab label="By profit margin" />
            <Tab label="By offer %" />
            <Tab label="By Profit / Card" />
            <Tab label="By ROI" />
          </Tabs>
          <TabPanel value={tabIndex} index={0}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Margin %</TableCell>
                    <TableCell>ROI</TableCell>
                    <TableCell>Offer</TableCell>
                    <TableCell>Offer %</TableCell>
                    <TableCell>Profit</TableCell>
                    <TableCell>P/C</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array(11).fill().map((_, i) => {
                    const profitMargin = i * .05;
                    const offer = breakEven - (evaluatedTotalMarketValue * profitMargin);
                    const offerPercentage = offer / evaluatedTotalMarketValue;
                    const profit = breakEven - offer;
                    const profitPerCard = profit / evaluatedNumberOfItems;
                    const roi = profit / offer;
                    return (
                      <TableRow>
                        <TableCell component="th" scope="row">{profitMargin.toLocaleString("en", { style: "percent" })}</TableCell>
                        <TableCell>{roi.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{offer.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{offerPercentage.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{profit.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{profitPerCard.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
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
                    <TableCell>ROI</TableCell>
                    <TableCell>Profit</TableCell>
                    <TableCell>P/C</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array(11).fill().map((_, i) => {
                    const offerPercentage = i * .05 + 0.5;
                    const offer = evaluatedTotalMarketValue * offerPercentage;
                    const profit = breakEven - offer;
                    const margin = profit / evaluatedTotalMarketValue;
                    const profitPerCard = profit / evaluatedNumberOfItems;
                    const roi = profit / offer;
                    return (
                      <TableRow>
                        <TableCell component="th" scope="row">{offerPercentage.toLocaleString("en", { style: "percent" })}</TableCell>
                        <TableCell>{offer.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{margin.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{roi.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}</TableCell>
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
                    <TableCell>ROI</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array(11).fill().map((_, i) => {
                    const profitPerCard = i * 0.25;
                    const profit = profitPerCard * evaluatedNumberOfItems;
                    const profitMargin = profit / evaluatedTotalMarketValue;
                    const offer = breakEven - (evaluatedTotalMarketValue * profitMargin);
                    const offerPercentage = offer / evaluatedTotalMarketValue;
                    const roi = profit / offer;
                    return (
                      <TableRow>
                        <TableCell component="th" scope="row">{profitPerCard.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{profit.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{profitMargin.toLocaleString("en", { style: "percent" })}</TableCell>
                        <TableCell>{offer.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{offerPercentage.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{roi.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={tabIndex} index={3}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ROI</TableCell>
                    <TableCell>Offer</TableCell>
                    <TableCell>Offer %</TableCell>
                    <TableCell>Margin %</TableCell>
                    <TableCell>Profit</TableCell>
                    <TableCell>P/C</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Array(11).fill().map((_, i) => {
                    const roi = i * 0.05;
                    const offer = breakEven / (1 + roi);
                    const offerPercentage = offer / evaluatedTotalMarketValue;
                    const profit = breakEven - offer;
                    const profitMargin = profit / evaluatedTotalMarketValue;
                    const profitPerCard = profit / evaluatedNumberOfItems;
                    return (
                      <TableRow>
                        <TableCell component="th" scope="row">{roi.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{offer.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{offerPercentage.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{profitMargin.toLocaleString("en", { style: "percent", minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{profit.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{profitPerCard.toLocaleString("en", { style: "currency", currency: "USD", minimumFractionDigits: 2 })}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Stack>
      </Container>
    </ThemeProvider >
  );
}

export default App;