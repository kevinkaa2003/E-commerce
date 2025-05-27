import React, { useEffect, useState, useRef } from 'react';
import './StockCarousel.css';

const StockCarousel = () => {
    const [stockData, setStockData] = useState([]);
    const [currentStockIndex, setCurrentStockIndex] = useState(0);
    const [companyLogo, setCompanyLogo] = useState('');
    const stockSymbols = ["MSFT", "AAPL", "GOOGL", "GOOG", "AMZN", "META", "NFLX", "NVDA", "TSLA", "ADBE", "INTC", "CSCO", "PYPL", "SQ", "HOOD", "MRNA", "BIIB", "GILD", "REGN", "EBAY", "PDD", "AMD", "AVGO", "QCOM", "RIVN", "LCID"]; //Change for different stocks

    //Fetch stock data for selected symbols
    useEffect(() => {
       const fetchStockData = async () => {
        let allStockData = [];

        for (const symbol of stockSymbols) {
            try {
                const response = await fetch(`http://localhost:5000/stocks?symbol=${symbol}`, 
                    { mode: 'cors',
                        method: 'GET', 
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',

                 });
                const data = await response.json();

                if (data.stockPrices) {
                    allStockData.push({
                        symbol: symbol,
                        prices: data.stockPrices, // Use all prices for this stock
                    });

                } else {
                    console.error(`Stock data not found for ${symbol}`, data);
                } 

                
                } catch (error) {
                    console.error(`Error fetching stock data for ${symbol}`, error);
            }
       };

       setStockData(allStockData);
    }

    fetchStockData();

}, []); //Runs only once on mount. 


    //Fetch company logo for the current stock
    useEffect(() => {
        if (stockData.length === 0) return;

        const currentSymbol = stockData[currentStockIndex].symbol;
        const logoUrl = `https://logo.clearbit.com/${currentSymbol.toLowerCase()}.com`;

        fetch(logoUrl)
            .then((response) => {
                if(response.ok) {
                    setCompanyLogo(logoUrl);
                } else {
                    setCompanyLogo(''); //Default company logo
                }
            })
            .catch(() => setCompanyLogo(''));
    }, [currentStockIndex, stockData]);

    //Automatic Carousel Effect
    useEffect(() => {
        if (stockData.length === 0) return; //Prevent running if no data exists\

        const interval = setInterval(() => {
            setCurrentStockIndex((prevIndex) => (prevIndex + 1) % stockData.length)
        }, 5000) //Change every 5 seconds

        return () => clearInterval(interval);
    }, [stockData]);

    return (
        <div className="stock-carousel">
            <h2>Stock Prices</h2>
            {stockData.length > 0 ? (
                <div className="stock-item">
                    {companyLogo && <img src={companyLogo} alt="Company Logo" className="stock-logo" />}
                    <h3>{stockData[currentStockIndex].symbol}</h3>
                    <p>{`Price: $${stockData[currentStockIndex].prices[0].price}`}</p>
                    <p>{`Time: ${stockData[currentStockIndex].prices[0].time}`}</p>
                </div>
            ) : (
                <p>Loading stock data...</p>
            )}
        </div>
      );
};
 
export default StockCarousel;