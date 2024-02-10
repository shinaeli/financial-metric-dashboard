import React, { useState, useEffect } from 'react';
import axios from "axios";
import Chart from "react-apexcharts";
import PropTypes from 'prop-types';
import Modal from 'react-modal';

const StockChart = ({ ticker, titleStyles, customStyles }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [graphOptions, setGraphOptions] = useState({
        series: [], 
        options: {
        chart: {
          type: 'candlestick',
          height: 350,
        },
        title: {
          text:  'Stock Price Analysis',
          align: 'center',
          style: titleStyles,
        },
        xaxis: {
          title: {
            text: "Date",
            style: {
              color: "silver",
          }
          },
          type: 'datetime',
          labels: {
            show: true,
            style: {
                colors: "silver",
            }
          }
        },
        yaxis: {
          tooltip: {
            enabled: true,
          },
          labels: {
            show: true,
            align: 'right',
            style: {
                colors: "silver",
            }
          },
          title: {
            text: 'Stock Price',
            style: {
              color: 'silver',
            }
          }
        },
        noData: {
          title: 'Loading...',
        }
      }
    }
    );

    useEffect(() => {
        fetchData(ticker);
        return () => console.log("Stock Data Clean-Up Ran");
    }, [ticker]);

      async function fetchData(testArg) {
        let testings = [{data: []}];
        if(testArg !== "") {
          try {
            const response = await axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/${testArg.toUpperCase()}?from=2024-1-1&to=${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDay()}&apikey=${import.meta.env.VITE_FMP_PUBLIC_KEY}`);
            // console.log(response.data.historical);
            for(const {close, date, high, low, open } of response.data.historical) {
              let outputObj = {
                x: new Date(date),
                y: [Number(open), Number(high), Number(low), Number(close)],
            };
            testings[0].data.push(outputObj);
            }
            setGraphOptions({...graphOptions, series: testings});
          } catch(error) {
              // console.error(error.message);
              alert(error.message);
          }
        }
      };

      const openModal = () => {
        setModalOpen(true);
      };
    
      const closeModal = () => {
        setModalOpen(false);
      };

  return (
    <main className="chart">
      <Chart onClick={openModal} options={graphOptions.options} width="100%" series={graphOptions.series} />
      <Modal isOpen={modalOpen} ariaHideApp={false} onRequestClose={() => setModalOpen(false)} styles={customStyles}>
          <Chart options={graphOptions.options} width="100%" series={graphOptions.series} />
          <button type="button" onClick={closeModal} className="close_btn">
            <img src="Icons/211652_close_icon.svg" alt="close icon" />
          </button>
      </Modal>
    </main>
  )
}

StockChart.propTypes = {
    ticker: PropTypes.string.isRequired,
    titleStyles: PropTypes.object.isRequired,
    customStyles: PropTypes.object.isRequired,
};

export default StockChart