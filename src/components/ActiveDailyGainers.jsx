import React, { useState, useEffect } from 'react';
import axios from "axios";
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

const ActiveDailyGainers = ({ ticker, titleStyles, customStyles }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [graphOptions, setGraphOptions] = useState(
    {
        series: [],
        options: {
          chart: {
            type: 'bar',
            height: 350
          },
          plotOptions: {
            bar: {
              distributed: true,
              borderRadius: 2,
              horizontal: false,
            }
          },
          dataLabels: {
            enabled: false,
          },
          xaxis: {
            categories: [],
            rotate: -45,
            labels: {
              show: true,
              style: {
                  colors: "silver",
              }
            },
          },
          yaxis: {
            labels: {
              show: true,
              align: 'right',
              style: {
                  colors: ["silver"],
              }
            }
          },
          title: {
            text: 'Current Active Most Stock Gainers Companies',
            align: 'center',
            style: titleStyles,
          },
          tooltip: {
            enabled: true,
          }
        },
      }
  );

  useEffect(() => {
    getActiveGainers();
    return () => console.log("Active Gainers Effect Ran!");
  }, [ticker]);

  async function getActiveGainers() {
    let tickersSeries = []; 
    let changesPercentageSeries = {
        data: [],
        backgroundColor: "coral",
        type: "column"
    };
    try {
        const response = await axios.get(`https://financialmodelingprep.com/api/v3/gainers?apikey=${import.meta.env.VITE_FMP_PUBLIC_KEY}`);
        for(const {ticker, changesPercentage} of response.data) {
            tickersSeries.push(ticker);
            changesPercentageSeries.data.push(Number(changesPercentage));
        };
        let seriesData = [changesPercentageSeries];
        setGraphOptions({...graphOptions, series: seriesData, options: {...graphOptions.options, xaxis: {...graphOptions.options.xaxis, categories: tickersSeries}}});
    } catch (error) {
        alert(error.message);
    }
  };

  const openModal = () => {
    setModalOpen(true);
    console.log(modalOpen);
  };

  const closeModal = () => {
    setModalOpen(false);
    console.log(modalOpen);
  };

  return (
    <main className="chart">
        <Chart onClick={openModal} series={graphOptions.series} options={graphOptions.options} width="100%" />
        <Modal isOpen={modalOpen} ariaHideApp={false} onRequestClose={() => setModalOpen(false)} styles={customStyles}>
          <Chart options={graphOptions.options} width="100%" series={graphOptions.series} />
          <button type="button" onClick={closeModal} className="close_btn">
            <img src="Icons/211652_close_icon.svg" alt="close icon" />
          </button>
        </Modal>
    </main>
  )
}

ActiveDailyGainers.propTypes = {
    ticker: PropTypes.string.isRequired,
    titleStyles: PropTypes.object.isRequired,
    customStyles: PropTypes.object.isRequired,
};

export default ActiveDailyGainers