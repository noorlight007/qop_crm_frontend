"use client";
import {
  CalculationResults,
  MortgageInputs,
  MortgageType,
  RemortgageCalculatorState,
} from "@/Types/Common/Calculators/RemortgageCalculatorTypes";
import React, { useMemo, useState } from "react";

const toNumber = (value: number | string) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const clampInt = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Math.trunc(value)));

const formatInt = (value: number) => {
  if (!Number.isFinite(value)) return "—";
  return Math.round(value).toLocaleString("en-GB");
};

const monthsFromYearsMonths = (years: number, months: number) =>
  clampInt(years, 0, 100) * 12 + clampInt(months, 0, 11);

const calculateMonthlyPayment = (
  principal: number,
  annualRatePct: number,
  termMonths: number,
  mortgageType: Exclude<MortgageType, "">,
) => {
  const monthlyRate = annualRatePct / 100 / 12;

  if (termMonths <= 0 || principal <= 0) return 0;

  if (mortgageType === "interest-only") {
    return principal * monthlyRate;
  }

  if (monthlyRate === 0) {
    return principal / termMonths;
  }

  const pow = Math.pow(1 + monthlyRate, termMonths);
  return (principal * monthlyRate * pow) / (pow - 1);
};

const calculateOverPeriod = (params: {
  principal: number;
  annualRatePct: number;
  termMonths: number;
  mortgageType: Exclude<MortgageType, "">;
  compareMonths: number;
}): CalculationResults => {
  const { principal, annualRatePct, termMonths, mortgageType, compareMonths } =
    params;

  const monthlyRate = annualRatePct / 100 / 12;
  const monthsToSimulate = Math.min(termMonths, compareMonths);

  if (principal <= 0 || termMonths <= 0 || compareMonths <= 0) {
    return {
      monthlyPayment: 0,
      totalPaid: 0,
      totalInterest: 0,
      totalRepayments: 0,
    };
  }

  const monthlyPayment = calculateMonthlyPayment(
    principal,
    annualRatePct,
    termMonths,
    mortgageType,
  );

  if (mortgageType === "interest-only") {
    const totalPaid = monthlyPayment * monthsToSimulate;
    return {
      monthlyPayment,
      totalPaid,
      totalInterest: totalPaid,
      totalRepayments: 0,
    };
  }

  let balance = principal;
  let totalPaid = 0;
  let totalInterest = 0;
  let totalRepayments = 0;

  for (let i = 0; i < monthsToSimulate; i++) {
    const interest = monthlyRate === 0 ? 0 : balance * monthlyRate;
    let principalPaid = monthlyPayment - interest;

    if (principalPaid > balance) {
      principalPaid = balance;
    }

    const paymentThisMonth = interest + principalPaid;

    totalPaid += paymentThisMonth;
    totalInterest += interest;
    totalRepayments += principalPaid;

    balance -= principalPaid;
    if (balance <= 0) break;
  }

  return {
    monthlyPayment,
    totalPaid,
    totalInterest,
    totalRepayments,
  };
};

const RemortgageCalculator: React.FC = () => {
  const [state, setState] = useState<RemortgageCalculatorState>({
    current: {
      amount: "",
      mortgageType: "",
      interestRate: "",
      termYears: "",
      termMonths: "",
    },
    newMortgage: {
      amount: "",
      arrangementFeeAdded: "",
      otherCosts: "",
      mortgageType: "",
      interestRate: "",
      termYears: "",
      termMonths: "",
    },
    compareYears: "",
    compareMonths: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [calculated, setCalculated] = useState(false);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    const currentAmount = toNumber(state.current.amount);
    if (!state.current.amount || currentAmount <= 0) {
      nextErrors.currentAmount = "Enter a mortgage amount greater than 0";
    }

    if (!state.current.mortgageType) {
      nextErrors.currentMortgageType = "Select a mortgage type";
    }

    const currentRate = toNumber(state.current.interestRate);
    if (state.current.interestRate === "" || currentRate < 0) {
      nextErrors.currentInterestRate = "Enter a valid interest rate";
    }

    const currentTermMonths = monthsFromYearsMonths(
      toNumber(state.current.termYears),
      toNumber(state.current.termMonths),
    );
    if (currentTermMonths <= 0) {
      nextErrors.currentTerm = "Term must be greater than 0";
    }

    const newAmount = toNumber(state.newMortgage.amount);
    if (!state.newMortgage.amount || newAmount <= 0) {
      nextErrors.newAmount = "Enter a mortgage amount greater than 0";
    }

    if (!state.newMortgage.mortgageType) {
      nextErrors.newMortgageType = "Select a mortgage type";
    }

    const newRate = toNumber(state.newMortgage.interestRate);
    if (state.newMortgage.interestRate === "" || newRate < 0) {
      nextErrors.newInterestRate = "Enter a valid interest rate";
    }

    const newTermMonths = monthsFromYearsMonths(
      toNumber(state.newMortgage.termYears),
      toNumber(state.newMortgage.termMonths),
    );
    if (newTermMonths <= 0) {
      nextErrors.newTerm = "Term must be greater than 0";
    }

    const compareMonthsRaw = monthsFromYearsMonths(
      toNumber(state.compareYears),
      toNumber(state.compareMonths),
    );
    if (compareMonthsRaw <= 0) {
      nextErrors.compare = "Comparison period must be greater than 0";
    }

    const otherCosts = toNumber(state.newMortgage.otherCosts);
    if (otherCosts < 0) {
      nextErrors.otherCosts = "Enter valid other costs";
    }

    const arrangementFeeAdded = toNumber(state.newMortgage.arrangementFeeAdded);
    if (arrangementFeeAdded < 0) {
      nextErrors.arrangementFeeAdded = "Enter a valid arrangement fee";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const derived = useMemo(() => {
    const currentPrincipal = toNumber(state.current.amount);
    const newPrincipal =
      toNumber(state.newMortgage.amount) +
      toNumber(state.newMortgage.arrangementFeeAdded);
    const otherCosts = toNumber(state.newMortgage.otherCosts);

    const currentTermMonths = monthsFromYearsMonths(
      toNumber(state.current.termYears),
      toNumber(state.current.termMonths),
    );
    const newTermMonths = monthsFromYearsMonths(
      toNumber(state.newMortgage.termYears),
      toNumber(state.newMortgage.termMonths),
    );

    const compareMonthsBase = monthsFromYearsMonths(
      toNumber(state.compareYears),
      toNumber(state.compareMonths),
    );

    const compareMonths = compareMonthsBase > 0 ? compareMonthsBase + 1 : 0;

    const currentRate = toNumber(state.current.interestRate);
    const newRate = toNumber(state.newMortgage.interestRate);

    return {
      currentPrincipal,
      newPrincipal,
      otherCosts,
      currentTermMonths,
      newTermMonths,
      compareMonths,
      currentRate,
      newRate,
    };
  }, [state]);

  const [currentResults, setCurrentResults] = useState<CalculationResults>({
    monthlyPayment: 0,
    totalPaid: 0,
    totalInterest: 0,
    totalRepayments: 0,
  });
  const [newResults, setNewResults] = useState<CalculationResults>({
    monthlyPayment: 0,
    totalPaid: 0,
    totalInterest: 0,
    totalRepayments: 0,
  });

  const [costDifference, setCostDifference] = useState(0);

  const handleCalculate = () => {
    if (!validate()) {
      setCalculated(false);
      return;
    }

    const current = calculateOverPeriod({
      principal: derived.currentPrincipal,
      annualRatePct: derived.currentRate,
      termMonths: derived.currentTermMonths,
      mortgageType: state.current.mortgageType as Exclude<MortgageType, "">,
      compareMonths: derived.compareMonths,
    });

    const next = calculateOverPeriod({
      principal: derived.newPrincipal,
      annualRatePct: derived.newRate,
      termMonths: derived.newTermMonths,
      mortgageType: state.newMortgage.mortgageType as Exclude<MortgageType, "">,
      compareMonths: derived.compareMonths,
    });

    setCurrentResults(current);
    setNewResults(next);
    setCostDifference(next.totalPaid + derived.otherCosts - current.totalPaid);
    setCalculated(true);
  };

  const setCurrentField = (field: keyof MortgageInputs, value: any) => {
    setState((prev) => ({
      ...prev,
      current: {
        ...prev.current,
        [field]: value,
      },
    }));
  };

  const setNewField = (
    field: keyof RemortgageCalculatorState["newMortgage"],
    value: any,
  ) => {
    setState((prev) => ({
      ...prev,
      newMortgage: {
        ...prev.newMortgage,
        [field]: value,
      },
    }));
  };

  const ResultsCard = ({
    title,
    results,
  }: {
    title: string;
    results: CalculationResults;
  }) => {
    return (
      <div className="bg-white p-4 rounded border h-100">
        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
          <span className="text-muted small">{title}</span>
        </div>

        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
          <span className="text-muted small">Monthly payment</span>
          <span
            className="h5 bg-light-dark p-2 rounded m-0"
            style={{ minWidth: "150px", textAlign: "right" }}
          >
            {calculated ? formatInt(results.monthlyPayment) : "—"}
          </span>
        </div>

        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
          <span className="text-muted small">Total paid</span>
          <span
            className="h5 bg-light-dark p-2 rounded m-0"
            style={{ minWidth: "150px", textAlign: "right" }}
          >
            {calculated ? formatInt(results.totalPaid) : "—"}
          </span>
        </div>

        <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
          <span className="text-muted small">Total interest</span>
          <span
            className="h5 bg-light-dark p-2 rounded m-0"
            style={{ minWidth: "150px", textAlign: "right" }}
          >
            {calculated ? formatInt(results.totalInterest) : "—"}
          </span>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <span className="text-muted small">Total repayments</span>
          <span
            className="h5 bg-light-dark p-2 rounded m-0"
            style={{ minWidth: "150px", textAlign: "right" }}
          >
            {calculated ? formatInt(results.totalRepayments) : "—"}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid p-4 bg-light-primary rounded">
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="bg-white p-4 rounded border h-100">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
              <span className="text-muted small">Current mortgage</span>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Mortgage amount<span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">£</span>
                <input
                  type="number"
                  className={`form-control ${errors.currentAmount ? "is-invalid" : ""} rounded-start-0`}
                  value={state.current.amount}
                  onChange={(e) => setCurrentField("amount", e.target.value)}
                  min="0"
                />
              </div>
              {errors.currentAmount && (
                <div className="invalid-feedback d-block">
                  {errors.currentAmount}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">
                Mortgage type<span className="text-danger">*</span>
              </label>
              <select
                className={`form-select ${errors.currentMortgageType ? "is-invalid" : ""}`}
                value={state.current.mortgageType}
                onChange={(e) =>
                  setCurrentField("mortgageType", e.target.value)
                }
              >
                <option value="">Choose...</option>
                <option value="repayment">Repayment</option>
                <option value="interest-only">Interest only</option>
              </select>
              {errors.currentMortgageType && (
                <div className="invalid-feedback d-block">
                  {errors.currentMortgageType}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">
                Interest rate<span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <input
                  type="number"
                  className={`form-control ${errors.currentInterestRate ? "is-invalid" : ""} rounded-end-0`}
                  value={state.current.interestRate}
                  onChange={(e) =>
                    setCurrentField("interestRate", e.target.value)
                  }
                  min="0"
                  step="0.01"
                />
                <span className="input-group-text rounded-start-0">%</span>
              </div>
              {errors.currentInterestRate && (
                <div className="invalid-feedback d-block">
                  {errors.currentInterestRate}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">
                Mortgage term<span className="text-danger">*</span>
              </label>
              <div className="row g-2">
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    value={state.current.termYears}
                    onChange={(e) =>
                      setCurrentField("termYears", e.target.value)
                    }
                    min="0"
                  />
                  <small className="form-text text-muted">years</small>
                </div>
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    value={state.current.termMonths}
                    onChange={(e) =>
                      setCurrentField("termMonths", e.target.value)
                    }
                    min="0"
                    max="11"
                  />
                  <small className="form-text text-muted">months</small>
                </div>
              </div>
              {errors.currentTerm && (
                <div className="text-danger small mt-2">
                  {errors.currentTerm}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="bg-white p-4 rounded border h-100">
            <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
              <span className="text-muted small">New mortgage</span>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Mortgage amount<span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">£</span>
                <input
                  type="number"
                  className={`form-control ${errors.newAmount ? "is-invalid" : ""} rounded-start-0`}
                  value={state.newMortgage.amount}
                  onChange={(e) => setNewField("amount", e.target.value)}
                  min="0"
                />
              </div>
              {errors.newAmount && (
                <div className="invalid-feedback d-block">
                  {errors.newAmount}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Arrangement fee added</label>
              <div className="input-group">
                <span className="input-group-text">£</span>
                <input
                  type="number"
                  className={`form-control ${errors.arrangementFeeAdded ? "is-invalid" : ""} rounded-start-0`}
                  value={state.newMortgage.arrangementFeeAdded}
                  onChange={(e) =>
                    setNewField("arrangementFeeAdded", e.target.value)
                  }
                  min="0"
                />
              </div>
              {errors.arrangementFeeAdded && (
                <div className="invalid-feedback d-block">
                  {errors.arrangementFeeAdded}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Other costs</label>
              <div className="input-group">
                <span className="input-group-text">£</span>
                <input
                  type="number"
                  className={`form-control ${errors.otherCosts ? "is-invalid" : ""} rounded-start-0`}
                  value={state.newMortgage.otherCosts}
                  onChange={(e) => setNewField("otherCosts", e.target.value)}
                  min="0"
                />
              </div>
              {errors.otherCosts && (
                <div className="invalid-feedback d-block">
                  {errors.otherCosts}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">
                Mortgage type<span className="text-danger">*</span>
              </label>
              <select
                className={`form-select ${errors.newMortgageType ? "is-invalid" : ""}`}
                value={state.newMortgage.mortgageType}
                onChange={(e) => setNewField("mortgageType", e.target.value)}
              >
                <option value="">Choose...</option>
                <option value="repayment">Repayment</option>
                <option value="interest-only">Interest only</option>
              </select>
              {errors.newMortgageType && (
                <div className="invalid-feedback d-block">
                  {errors.newMortgageType}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">
                Interest rate<span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <input
                  type="number"
                  className={`form-control ${errors.newInterestRate ? "is-invalid" : ""} rounded-end-0`}
                  value={state.newMortgage.interestRate}
                  onChange={(e) => setNewField("interestRate", e.target.value)}
                  min="0"
                  step="0.01"
                />
                <span className="input-group-text rounded-start-0">%</span>
              </div>
              {errors.newInterestRate && (
                <div className="invalid-feedback d-block">
                  {errors.newInterestRate}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">
                Mortgage term<span className="text-danger">*</span>
              </label>
              <div className="row g-2">
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    value={state.newMortgage.termYears}
                    onChange={(e) => setNewField("termYears", e.target.value)}
                    min="0"
                  />
                  <small className="form-text text-muted">years</small>
                </div>
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    value={state.newMortgage.termMonths}
                    onChange={(e) => setNewField("termMonths", e.target.value)}
                    min="0"
                    max="11"
                  />
                  <small className="form-text text-muted">months</small>
                </div>
              </div>
              {errors.newTerm && (
                <div className="text-danger small mt-2">{errors.newTerm}</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12">
          <div
            className="bg-white p-4 rounded border"
            style={{ maxWidth: 720, margin: "0 auto" }}
          >
            <label className="form-label">
              Compare mortgages over<span className="text-danger">*</span>
            </label>
            <div className="row g-2">
              <div className="col">
                <input
                  type="number"
                  className="form-control"
                  value={state.compareYears}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      compareYears: e.target.value,
                    }))
                  }
                  min="0"
                />
                <small className="form-text text-muted">years</small>
              </div>
              <div className="col">
                <input
                  type="number"
                  className="form-control"
                  value={state.compareMonths}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      compareMonths: e.target.value,
                    }))
                  }
                  min="0"
                  max="11"
                />
                <small className="form-text text-muted">months</small>
              </div>
            </div>
            {errors.compare && (
              <div className="text-danger small mt-2">{errors.compare}</div>
            )}

            <button
              onClick={handleCalculate}
              className="btn btn-danger btn-lg rounded-pill w-100 mt-3"
            >
              Calculate
            </button>
          </div>
        </div>

        <div className="col-lg-6">
          <ResultsCard
            title="Current mortgage results"
            results={currentResults}
          />
        </div>
        <div className="col-lg-6">
          <ResultsCard title="New mortgage results" results={newResults} />
        </div>

        <div className="col-12">
          <div
            className="bg-white p-4 rounded border"
            style={{ maxWidth: 720, margin: "0 auto" }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted small">Cost difference</span>
              <span
                className="h5 bg-light-dark p-2 rounded m-0"
                style={{ minWidth: "150px", textAlign: "right" }}
              >
                {calculated ? formatInt(costDifference) : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemortgageCalculator;
