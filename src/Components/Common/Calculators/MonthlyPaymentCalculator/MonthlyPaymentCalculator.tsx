"use client";
import {
  CalculationResults,
  CalculatorState,
} from "@/Types/Common/Calculators/MonthlyPaymentCalculatorTypes";
import React, { useState } from "react";
import { getCurrencySign } from "../../../../utils/currency";

const MonthlyPaymentCalculator: React.FC = () => {
  // Start with empty user-driven inputs (no pre-filled defaults)
  const [state, setState] = useState<CalculatorState>({
    mortgageAmount: "",
    arrangementFee: "",
    mortgageType: "",
    interestRate: "",
    years: "",
    months: "",
  });

  const [results, setResults] = useState<CalculationResults>({
    monthlyPayment: 0,
    totalPaid: 0,
    totalInterest: 0,
    totalRepayments: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [calculated, setCalculated] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};

    const mortgageAmountNum = Number(state.mortgageAmount);
    if (
      !state.mortgageAmount ||
      isNaN(mortgageAmountNum) ||
      mortgageAmountNum <= 0
    ) {
      e.mortgageAmount = "Enter a mortgage amount greater than 0";
    }

    const interestRateNum = Number(state.interestRate);
    if (
      state.interestRate === "" ||
      isNaN(interestRateNum) ||
      interestRateNum < 0
    ) {
      e.interestRate = "Enter a valid interest rate";
    }

    const yearsNum = Number(state.years);
    const monthsNum = Number(state.months);
    if (isNaN(yearsNum) || yearsNum < 0 || isNaN(monthsNum) || monthsNum < 0) {
      e.term = "Enter a valid mortgage term";
    } else if (yearsNum === 0 && monthsNum === 0) {
      e.term = "Term must be greater than 0";
    }

    if (!state.mortgageType) {
      e.mortgageType = "Select a mortgage type";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const calculatePayment = () => {
    // parse values (safe default to 0 where appropriate)
    const mortgageAmount = Number(state.mortgageAmount) || 0;
    const arrangementFee = Number(state.arrangementFee) || 0;
    const mortgageType = state.mortgageType as "interest-only" | "repayment";
    const interestRate = Number(state.interestRate) || 0;
    const years = Number(state.years) || 0;
    const months = Number(state.months) || 0;

    const principal = mortgageAmount + arrangementFee;
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = years * 12 + months;

    let monthlyPayment = 0;
    let totalInterest = 0;
    let totalRepayments = 0;

    if (mortgageType === "interest-only") {
      monthlyPayment = principal * monthlyRate;
      totalInterest = monthlyPayment * totalMonths; // interest-only: interest paid over term
      totalRepayments = 0; // principal not repaid
    } else {
      // Repayment mortgage using standard formula
      if (monthlyRate === 0) {
        monthlyPayment = principal / totalMonths;
        totalInterest = 0;
      } else {
        monthlyPayment =
          (principal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) /
          (Math.pow(1 + monthlyRate, totalMonths) - 1);
        totalInterest = monthlyPayment * totalMonths - principal;
        totalRepayments = principal;
      }
    }

    const totalPaid = monthlyPayment * totalMonths;

    setResults({
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalRepayments: Math.round(totalRepayments * 100) / 100,
    });

    setCalculated(true);
  };

  // Only calculate when user hits Calculate (so initial state is empty)
  const handleCalculate = () => {
    if (!validate()) {
      setCalculated(false);
      return;
    }

    calculatePayment();
  };

  const handleInputChange = (field: keyof CalculatorState, value: any) => {
    setState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="container-fluid p-4 bg-light-primary rounded">
      <div className="row g-4">
        {/* Left Column - Input Fields */}
        <div className="col-lg-6">
          <div className="mb-3">
            <label htmlFor="mortgageAmount" className="form-label">
              Mortgage amount<span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">{getCurrencySign()}</span>
              <input
                id="mortgageAmount"
                type="number"
                value={state.mortgageAmount}
                onChange={(e) =>
                  handleInputChange("mortgageAmount", e.target.value)
                }
                className={`form-control ${errors.mortgageAmount ? "is-invalid" : ""} rounded-start-0`}
                min="0"
              />
              {errors.mortgageAmount && (
                <div className="invalid-feedback d-block">
                  {errors.mortgageAmount}
                </div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="arrangementFee" className="form-label">
              Arrangement fee
            </label>
            <div className="input-group">
              <span className="input-group-text">{getCurrencySign()}</span>
              <input
                id="arrangementFee"
                type="number"
                value={state.arrangementFee}
                onChange={(e) =>
                  handleInputChange("arrangementFee", Number(e.target.value))
                }
                className="form-control rounded-start-0"
                min="0"
              />
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="mortgageType" className="form-label">
              Mortgage type<span className="text-danger">*</span>
            </label>
            <select
              id="mortgageType"
              value={state.mortgageType}
              onChange={(e) =>
                handleInputChange("mortgageType", e.target.value)
              }
              className={`form-select ${errors.mortgageType ? "is-invalid" : ""}`}
            >
              <option value="">Choose...</option>
              <option value="interest-only">Interest only</option>
              <option value="repayment">Repayment</option>
            </select>
            {errors.mortgageType && (
              <div className="invalid-feedback d-block">
                {errors.mortgageType}
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="interestRate" className="form-label">
              Interest rate<span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <input
                id="interestRate"
                type="number"
                value={state.interestRate}
                onChange={(e) =>
                  handleInputChange("interestRate", e.target.value)
                }
                className={`form-control ${errors.interestRate ? "is-invalid" : ""} rounded-end-0`}
                min="0"
                step="0.01"
              />
              <span className="input-group-text rounded-start-0">%</span>
              {errors.interestRate && (
                <div className="invalid-feedback d-block">
                  {errors.interestRate}
                </div>
              )}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">
              Mortgage term<span className="text-danger">*</span>
            </label>
            <div className="row g-2">
              <div className="col">
                <input
                  type="number"
                  value={state.years}
                  onChange={(e) => handleInputChange("years", e.target.value)}
                  className={`form-control`}
                  min="0"
                />
                <small className="form-text text-muted">years</small>
              </div>
              <div className="col">
                <input
                  type="number"
                  value={state.months}
                  onChange={(e) => handleInputChange("months", e.target.value)}
                  className={`form-control`}
                  min="0"
                  max="11"
                />
                <small className="form-text text-muted">months</small>
              </div>
            </div>
            {errors.term && (
              <div className="text-danger small mt-2">{errors.term}</div>
            )}
          </div>

          <button
            onClick={handleCalculate}
            className="btn btn-danger btn-lg rounded-pill w-100 mt-3"
          >
            Calculate
          </button>
        </div>

        {/* Right Column - Results */}
        <div className="col-lg-6">
          <div className="bg-white p-4 rounded h-100">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
              <span className="text-muted small">Monthly payment</span>
              <span
                className="h5 bg-light-dark p-2 rounded"
                style={{ minWidth: "150px", textAlign: "right" }}
              >
                {calculated
                  ? `${getCurrencySign()}${results.monthlyPayment.toFixed(2)}`
                  : "—"}
              </span>
            </div>

            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
              <span className="text-muted small">Total paid</span>
              <span
                className="h5 bg-light-dark p-2 rounded"
                style={{ minWidth: "150px", textAlign: "right" }}
              >
                {calculated
                  ? `${getCurrencySign()}${results.totalPaid.toFixed(2)}`
                  : "—"}
              </span>
            </div>

            <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
              <span className="text-muted small">Total interest</span>
              <span
                className="h5 bg-light-dark p-2 rounded"
                style={{ minWidth: "150px", textAlign: "right" }}
              >
                {calculated
                  ? `${getCurrencySign()}${results.totalInterest.toFixed(2)}`
                  : "—"}
              </span>
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted small">Total repayments</span>
              <span
                className="h5 bg-light-dark p-2 rounded"
                style={{ minWidth: "150px", textAlign: "right" }}
              >
                {calculated
                  ? `${getCurrencySign()}${results.totalRepayments.toFixed(2)}`
                  : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyPaymentCalculator;
