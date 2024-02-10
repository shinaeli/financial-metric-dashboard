import React, { useState, useEffect } from 'react';
import axios from "axios";
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

const GrossProfitAndIncomeChart = ({ ticker, titleStyles, customStyles }) => {
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
                horizontal: false,
                columnWidth: '45%',
                endingShape: 'rounded'
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
                colors: ['transparent']
            },
            xaxis: {
                categories: [],
                type: 'datetime',
                title: {
                    text: "Year",
                    style: {
                        color: 'silver',
                    }
                },
                labels: {
                    show: true,
                    align: 'right',
                    style: {
                        colors: "silver",
                    }
                }
            },
            title: {
                text: 'Gross Profit, Net Income, Operating Expenses And Operating Income Loss Chart',
                align: 'center',
                style: titleStyles,
            },
            yaxis: {
                title: {
                text: '$ (billions)',
                style: {
                    color: 'silver',
                    }
                },
                labels: {
                    show: true,
                    align: 'right',
                    style: {
                        colors: ["silver"],
                    }
                }
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                formatter: function (val) {
                    return typeof val === "number" ? `$ ${val}` : "Not Available";
                }
                }
            }
        }
    }
  );

  useEffect(() => {
    fetchData(ticker);
    return () => console.log("Clean-up Ran");
}, [ticker]);

async function fetchData(testArg) {
    let grossProfitSeries = {
        name: 'Gross Profit',
        data: [],
        backgroundColor: "greenyellow",
        type: "column"
    };
    let operatingExpensesSeries = {
        name: 'Operating Expenses',
        data: [],
        backgroundColor: "coral",
        type: "column"
    };
    let operatingIncomeLossSeries = {
        name: 'Opearting Income Loss',
        data: [],
        backgroundColor: "khaki",
        type: "column"
    };
    let netIncomeLossSeries = {
        name: 'Net Income Loss',
        data: [],
        backgroundColor: "red",
        type: "column"
    };
    let xcategories = [];
    if(testArg !== "") {
      try {
        const response = await axios.get(`https://financialmodelingprep.com/api/v3/income-statement-as-reported/${testArg.toUpperCase()}?limit=120&apikey=${import.meta.env.VITE_FMP_PUBLIC_KEY}`);
        for(const {date, grossprofit, operatingexpenses, operatingincomeloss, netincomeloss} of response.data) {
            grossProfitSeries.data.push(grossprofit || "Not Available");
            operatingExpensesSeries.data.push(operatingexpenses || "Not Available");
            operatingIncomeLossSeries.data.push(operatingincomeloss || "Not Available");
            netIncomeLossSeries.data.push(netincomeloss || "Not Available");
            xcategories.push(date);
        }
        let updatedSeries = [grossProfitSeries, operatingExpensesSeries, operatingIncomeLossSeries, netIncomeLossSeries];
        // console.log(updatedSeries);
        setGraphOptions({...graphOptions, series: updatedSeries, options: {...graphOptions.options, xaxis: {...graphOptions.options.xaxis.categories, categories: xcategories}}});
      } catch(error) {
        //   console.log(error.message);
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

GrossProfitAndIncomeChart.propTypes = {
    ticker: PropTypes.string.isRequired,
    titleStyles: PropTypes.object.isRequired,
    customStyles: PropTypes.object.isRequired,
};

export default GrossProfitAndIncomeChart