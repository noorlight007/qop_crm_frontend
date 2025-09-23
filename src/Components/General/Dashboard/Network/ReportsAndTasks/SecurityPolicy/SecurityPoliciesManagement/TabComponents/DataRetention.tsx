import React from "react";
import { Button, Input } from "reactstrap";

const DataRetention: React.FC = () => {
  return (
    <div>
      <h5 className="mb-4">Data Retention Policies</h5>
      <div className="data-retention-list">
        <div className="retention-item border rounded p-3 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-1">Client Personal Data</h6>
              <p className="text-muted mb-0">
                Data will be automatically purged after retention period
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Input
                type="select"
                className="form-select"
                style={{ width: "100px" }}
              >
                <option>7</option>
                <option>6</option>
                <option>5</option>
              </Input>
              <span>Years</span>
              <Button color="link" className="p-0">
                <i className="fas fa-edit"></i>
              </Button>
            </div>
          </div>
        </div>

        <div className="retention-item border rounded p-3 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-1">Case Documents</h6>
              <p className="text-muted mb-0">
                Data will be automatically purged after retention period
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Input
                type="select"
                className="form-select"
                style={{ width: "100px" }}
              >
                <option>6</option>
                <option>5</option>
                <option>4</option>
              </Input>
              <span>Years</span>
              <Button color="link" className="p-0">
                <i className="fas fa-edit"></i>
              </Button>
            </div>
          </div>
        </div>

        <div className="retention-item border rounded p-3 mb-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-1">Audit Logs</h6>
              <p className="text-muted mb-0">
                Data will be automatically purged after retention period
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <Input
                type="select"
                className="form-select"
                style={{ width: "100px" }}
              >
                <option>3</option>
                <option>2</option>
                <option>1</option>
              </Input>
              <span>Years</span>
              <Button color="link" className="p-0">
                <i className="fas fa-edit"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataRetention;
