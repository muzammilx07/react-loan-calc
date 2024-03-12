import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import './App.css';

const LoanCalculator = () => {
  const [totalAmount, setTotalAmount] = useState(10000);
  const [loanAmount, setLoanAmount] = useState(5000);
  const [downPayment, setDownPayment] = useState(5000);
  const [interestRate, setInterestRate] = useState(0.01);
  const [tenure, setTenure] = useState(6);
  const [monthlyInstallment, setMonthlyInstallment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  const chartRef = React.useRef(null);

  useEffect(() => {
    const loanAmountCalculated = totalAmount - downPayment;
    const totalLoanMonths = tenure;
    const interestPerMonth = interestRate / 12;

    const monthlyPayment =
      (loanAmountCalculated * interestPerMonth * (1 + interestPerMonth) ** totalLoanMonths) /
      ((1 + interestPerMonth) ** totalLoanMonths - 1);

    const calculatedTotalInterest = monthlyPayment * totalLoanMonths - loanAmountCalculated;

    setLoanAmount(loanAmountCalculated);
    setMonthlyInstallment(monthlyPayment.toFixed(2));
    setTotalInterest(calculatedTotalInterest.toFixed(2));

    // Update or create Chart instance
    if (chartRef.current) {
      chartRef.current.data.labels = ['Loan Amount', 'Total Interest'];
      chartRef.current.data.datasets[0].data = [loanAmountCalculated, calculatedTotalInterest];
      chartRef.current.update();
    } else {
      // Create new ChartJS instance
      const ctx = document.getElementById('loanChart');
      if (ctx) {
        chartRef.current = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: ['Loan Amount', 'Total Interest'],
            datasets: [{
              label: 'Amount in $',
              data: [loanAmountCalculated, calculatedTotalInterest],
              backgroundColor: ['#3498db', '#e74c3c'],
            }]
          },
        });
      }
    }
  }, [totalAmount, downPayment, tenure, interestRate]);

  return (
    <div className="loan-calculator-container">
      <div className="input-section">
        <div>
          <label>Total Amount: ${totalAmount}</label>
          <input
            type="range"
            min="1000"
            max="10000"
            step="1000"
            value={totalAmount}
            onChange={(e) => {
              setTotalAmount(parseInt(e.target.value));
              setLoanAmount(parseInt(e.target.value) / 2);
              setDownPayment(parseInt(e.target.value) / 2);
            }}
          />
        </div>
        <div>
          <label>Loan Amount: ${loanAmount}</label>
          <input
            type="range"
            min="0"
            max={totalAmount}
            step="100"
            value={loanAmount}
            onChange={(e) => {
              const newLoanAmount = parseInt(e.target.value);
              setLoanAmount(newLoanAmount);
              setDownPayment(totalAmount - newLoanAmount);
            }}
          />
        </div>
        <div>
          <label>Down Payment: ${downPayment}</label>
          <input
            type="range"
            min="0"
            max={totalAmount}
            step="1000"
            value={downPayment}
            onChange={(e) => setDownPayment(parseInt(e.target.value))}
          />
        </div>
        <div>
          <label>Interest Rate: {interestRate * 100}%</label>
          <input
            type="range"
            min="0.01"
            max="0.05"
            step="0.01"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label>Loan Tenure: {tenure} months</label>
          <select
            value={tenure}
            onChange={(e) => setTenure(parseInt(e.target.value))}
          >
            {[6, 12, 18, 24, 30, 36].map((months) => (
              <option key={months} value={months}>
                {months} months
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="output-section">
        <div>
          <h3>Monthly Installment: ${monthlyInstallment}</h3>
          <h3>Total Interest: ${totalInterest}</h3>
        </div>
        <canvas id="loanChart" width="400" height="200"></canvas>
      </div>
    </div>
  );
};

export default LoanCalculator;
