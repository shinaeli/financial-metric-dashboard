import React, { useState, useEffect } from 'react';
import axios from "axios";
import FinancialGrowthChart from './components/FinancialGrowthChart';
import GrossProfitAndIncomeChart from './components/GrossProfitAndIncomeChart';
import ActiveDailyGainers from './components/ActiveDailyGainers';
import StockChart from './components/StockChart';


function App() {
  const [companyName, setCompanyName] = useState('');
  const [search, setSearch] = useState('');
  const [ticker, setTicker] = useState('');

  const titleStyles = {
    fontSize: '18px',
    fontFamily: "Raleway",
    fontWeight: 'bold',
    color: 'silver',
  };

  const customStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'midnightblue',
    },
    content: {
      position: "absolute",
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "darkslateblue",
      width: 400,
    }
  };

async function checkCompany(testName) {
  const response = await axios.get(`https://financialmodelingprep.com/api/v3/stock/list?apikey=${import.meta.env.VITE_FMP_PUBLIC_KEY}`);
  // console.log(response.data);
  for(const {symbol, name} of response.data) {
    if(testName.toUpperCase() === symbol) {
      setCompanyName(name);
      // console.log(companyName);
     }
  }
};

useEffect(() => {
  checkCompany(ticker);
  return () => console.log("Check Company's Name Clean-Up Ran");
}, [ticker]);

  function handleSubmit(e) {
    e.preventDefault();
    setTicker(search);
    setSearch("");
  };

  return (
    <main className="container">
      <form onSubmit={handleSubmit}>
        <div className="label-container">
          <label htmlFor="company">Ticker Symbol:</label>
          <input type="text" name="company" id="company" placeholder="Provide a ticker..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className='form-button' type="submit">Get Details</button>
      </form>
      {companyName && <h1 className="company_name">{companyName} Financial Analysis Charts</h1>}
      <section className="full-chart">
        <StockChart ticker={ticker} titleStyles={titleStyles} customStyles={customStyles} />
        <FinancialGrowthChart ticker={ticker} titleStyles={titleStyles} customStyles={customStyles} />
        <GrossProfitAndIncomeChart ticker={ticker} titleStyles={titleStyles} customStyles={customStyles} />
        <ActiveDailyGainers ticker={ticker} titleStyles={titleStyles} customStyles={customStyles} />
      </section>
      <footer>
        <p>&copy;2024 Copyright. Made by <a href="https://github.com/shinaeli">Omotosho E. Oluwasina</a>.</p>
      </footer>
    </main>
  )
}

export default App
