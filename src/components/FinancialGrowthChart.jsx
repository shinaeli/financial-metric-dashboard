import React, { useEffect, useState } from 'react';
import axios from "axios";
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

const FinancialGrowthChart = ({ ticker, titleStyles, customStyles }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [graphOptions, setGraphOptions] = useState(
        {
            series: [],
            options: {
              chart: {
                height: 350,
                type: 'line',
                dropShadow: {
                  enabled: true,
                  color: '#000',
                  top: 18,
                  left: 7,
                  blur: 10,
                  opacity: 0.2
                },
                toolbar: {
                  show: false
                }
              },
              colors: ['#FF6347', '#8B008B', '#800000'],
              dataLabels: {
                enabled: true,
              },
              stroke: {
                curve: 'smooth'
              },
              title: {
                text: 'Financial Growth Trend From 2019 To 2023',
                align: 'center',
                style: titleStyles,
              },
              grid: {
                borderColor: '#e7e7e7',
                row: {
                  colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                  opacity: 0.5
                },
              },
              markers: {
                size: 1
              },
              xaxis: {
                categories: ["2019", "2020", "2021", "2022", "2023"],
                title: {
                  text: 'Year',
                  align: "center",
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
              yaxis: {
                title: {
                  text: 'Amount',
                  align: 'center',
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
              },
                min: -100,
                max: 100,
              },
              legend: {
                position: 'top',
                horizontalAlign: 'right',
                floating: true,
                offsetY: -25,
                offsetX: -5
              }
            }
        }
    );
    useEffect(() => {
        fetchData(ticker);
        return () => console.log("Financial Growth Clean-up Ran");
    }, [ticker]);

    async function fetchData(testArg) {
        let grossProfitGrowthSeries = {
            name: "Gross Profit Growth",
            data: []
        };
        let operatingIncomeGrowthSeries = {
            name: "Operating Income Growth",
            data: [],
        };
        let netIncomeGrowthSeries = {
            name: "Net Income Growth",
            data: [],
        };
        if(testArg !== "") {
          try {
            const response = await axios.get(`https://financialmodelingprep.com/api/v3/financial-growth/${testArg.toUpperCase()}?limit=20&apikey=${import.meta.env.VITE_FMP_PUBLIC_KEY}`);
            for(const {grossProfitGrowth, operatingIncomeGrowth, netIncomeGrowth} of response.data) {
                grossProfitGrowthSeries.data.push(grossProfitGrowth);
                operatingIncomeGrowthSeries.data.push(operatingIncomeGrowth);
                netIncomeGrowthSeries.data.push(netIncomeGrowth);
            }
            let updatedSeries = [grossProfitGrowthSeries, operatingIncomeGrowthSeries, netIncomeGrowthSeries];
            setGraphOptions({...graphOptions, series: [...updatedSeries]});
          } catch(error) {
              // console.log(error.message);
              alert(error.message);
          }
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

FinancialGrowthChart.propTypes = {
  ticker: PropTypes.string.isRequired,
  titleStyles: PropTypes.object.isRequired,
  customStyles: PropTypes.object.isRequired,
};

export default FinancialGrowthChart