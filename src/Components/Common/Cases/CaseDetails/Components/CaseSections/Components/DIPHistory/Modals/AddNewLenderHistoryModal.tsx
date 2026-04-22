import { LoadingSpinner2 } from "@/app/loading";
import { useAddDIPHistoryDetailsMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/DIPHistoryDetails/DIPHistoryDetailsApi";
import { useUpdateSectionCompleteStatusMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/SectionCompleteApi";
import { AddNewLenderHistoryModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/DIPHistoryTypes";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "reactstrap";

const AddNewLenderHistoryModal: React.FC<AddNewLenderHistoryModalProps> = ({
  isOpen,
  toggle,
}) => {
  const { casealias } = useParams();
  //Rtk hooks
  const [addDIPHistoryDetails, { isLoading }] =
    useAddDIPHistoryDetailsMutation();
  const [updateSectionCompleteStatus] =
    useUpdateSectionCompleteStatusMutation();

  const [formData, setFormData] = useState({
    is_this_application_had_a_decision_in_principle: true,
    lender: "",
    dip_date: Date,
    dip_decision: "",
    dip_reference_number: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await addDIPHistoryDetails({
        case_alias: casealias,
        payload: formData,
      });

      if ((res as any)?.data) {
        setErrors({});
        // Clear form data after successful submission
        setFormData({
          is_this_application_had_a_decision_in_principle: true,
          lender: "",
          dip_date: Date,
          dip_decision: "",
          dip_reference_number: "",
          notes: "",
        });
        toast.success("DIP History added successfully");
        toggle();
        try {
          await updateSectionCompleteStatus({
            case_alias: casealias,
            section_data: { is_dip_history: true },
          });
        } catch (err) {
          console.error("Failed to update section complete status:", err);
        }
      } else if ((res as any)?.error) {
        const errData = (res as any).error?.data || (res as any).error || {};
        const parsed = parseApiErrors(errData);
        setErrors(parsed);
        const first = Object.values(parsed)[0] || "Failed to add DIP History";
        toast.error(String(first));
      } else {
        toast.error("Failed to add DIP History");
      }
    } catch (error) {
      const parsed = parseApiErrors(
        (error as any)?.data || (error as any) || error,
      );
      setErrors(parsed);
      const first = Object.values(parsed)[0] || "Failed to add DIP History";
      toast.error(String(first));
    }
  };

  const parseApiErrors = (err: any): Record<string, string> => {
    const out: Record<string, string> = {};
    if (!err) return out;

    const sanitize = (msg: any) => {
      if (msg == null) return "";
      let s = String(msg);
      s = s.replace(/^\s*\d+,\s*/g, "");
      return s;
    };

    if (typeof err === "string") {
      out["non_field_errors"] = sanitize(err);
      return out;
    }

    if (err && typeof err === "object") {
      if (err.detail) out["non_field_errors"] = sanitize(err.detail);
      for (const [k, v] of Object.entries(err)) {
        if (v == null) continue;
        if (typeof v === "string") out[k] = sanitize(v);
        else if (Array.isArray(v))
          out[k] = sanitize(
            v
              .map((x) => (typeof x === "string" ? x : JSON.stringify(x)))
              .join(", "),
          );
        else if (typeof v === "object") {
          const vals: string[] = [];
          for (const vv of Object.values(v)) {
            if (vv == null) continue;
            if (Array.isArray(vv)) vals.push(...vv.map((x) => String(x)));
            else vals.push(String(vv));
          }
          if (vals.length) out[k] = sanitize(vals.join(", "));
        } else out[k] = sanitize(String(v));
      }
      return out;
    }

    out["non_field_errors"] = sanitize(String(err));
    return out;
  };

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner2 />
      </div>
    );
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        <span className="fs-4 text-primary">Add New Lender History</span>{" "}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>
                  Lender<span className="text-danger">*</span>
                </Label>
                <Input
                  type="select"
                  name="lender"
                  value={formData.lender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select...</option>
                  <option value="ACCORD_MORTGAGES">Accord Mortgages</option>
                  <option value="AHLI_UNITED_BANK">Ahli United Bank</option>
                  <option value="AL_RAYAN_BANK">Al Rayan Bank</option>
                  <option value="ALDERMORE_MORTGAGES">
                    Aldermore Mortgages
                  </option>
                  <option value="AMICUS_PLC">Amicus PLC</option>
                  <option value="ASSETZ_CAPITAL">Assetz Capital</option>
                  <option value="ATOM_BANK">Atom Bank</option>
                  <option value="AVIVA_EQUITY_RELEASE">
                    Aviva Equity Release
                  </option>
                  <option value="AXIS_BANK">Axis Bank</option>
                  <option value="BANK_AND_CLIENTS_PLC">
                    Bank & Clients PLC
                  </option>
                  <option value="BANK_OF_CHINA">Bank of China</option>
                  <option value="BANK_OF_CYPRUS_UK">Bank of Cyprus UK</option>
                  <option value="BANK_OF_IRELAND">Bank of Ireland</option>
                  <option value="BARCLAYS">Barclays</option>
                  <option value="BARCLAYS_COMMERCIAL">
                    Barclays Commercial
                  </option>
                  <option value="BATH_BUILDING_SOCIETY">
                    Bath Building Society
                  </option>
                  <option value="BEVERLEY_BUILDING_SOCIETY">
                    Beverley Building Society
                  </option>
                  <option value="BLUESTONE_MORTGAGES">
                    Bluestone Mortgages
                  </option>
                  <option value="BLUEZEST">BlueZest</option>
                  <option value="BM_SOLUTIONS">BM Solutions</option>
                  <option value="BOOST_CAPITAL">Boost Capital</option>
                  <option value="BRIDGEWATER_EQUITY_RELEASE">
                    Bridgewater Equity Release
                  </option>
                  <option value="BUCKINGHAMSHIRE_BUILDING_SOCIETY">
                    Buckinghamshire Building Society
                  </option>
                  <option value="CAMBRIDGE_AND_COUNTIES_BANK">
                    Cambridge and Counties Bank
                  </option>
                  <option value="CAMBRIDGE_BUILDING_SOCIETY">
                    Cambridge Building Society
                  </option>
                  <option value="CENTRAL_TRUST">Central Trust</option>
                  <option value="CHARTERBANK">Charterbank</option>
                  <option value="CHL_MORTGAGES">CHL Mortgages</option>
                  <option value="CHORLEY_DISTRICT_BUILDING_SOCIETY">
                    Chorley & District Building Society
                  </option>
                  <option value="CLEARLY_LOANS">Clearly Loans</option>
                  <option value="COUTTS">Coutts</option>
                  <option value="COVENTRY_BUILDING_SOCIETY">
                    Coventry Building Society
                  </option>
                  <option value="CROWN_EQUITY_RELEASE">
                    Crown Equity Release
                  </option>
                  <option value="CUMBERLAND_BUILDING_SOCIETY">
                    Cumberland Building Society
                  </option>
                  <option value="DANSKE_BANK">Danske Bank</option>
                  <option value="DARLINGTON_BUILDING_SOCIETY">
                    Darlington Building Society
                  </option>
                  <option value="DIGITAL_MORTGAGES">Digital Mortgages</option>
                  <option value="DUDLEY_BUILDING_SOCIETY">
                    Dudley Building Society
                  </option>
                  <option value="EARL_SHILTON_BUILDING_SOCIETY">
                    Earl Shilton Building Society
                  </option>
                  <option value="ECOLOGY_BUILDING_SOCIETY">
                    Ecology Building Society
                  </option>
                  <option value="EQUIFINANCE">Equifinance</option>
                  <option value="FAMILY_BUILDING_SOCIETY">
                    Family Building Society
                  </option>
                  <option value="FINSEC">FinSec</option>
                  <option value="FIRST_TRUST_BANK">First Trust Bank</option>
                  <option value="FLEET_MORTGAGES">Fleet Mortgages</option>
                  <option value="FOUNDATION_HOME_LOANS">
                    Foundation Home Loans
                  </option>
                  <option value="FURNESS_BUILDING_SOCIETY">
                    Furness Building Society
                  </option>
                  <option value="GATEHOUSE_BANK">Gatehouse Bank</option>
                  <option value="GENERATION_HOME">Generation Home</option>
                  <option value="GODIVA_MORTGAGES">Godiva Mortgages</option>
                  <option value="HALIFAX">Halifax</option>
                  <option value="HAMPSHIRE_TRUST_BANK">
                    Hampshire Trust Bank
                  </option>
                  <option value="HANDELSBANKEN">Handelsbanken</option>
                  <option value="HANLEY_ECONOMIC_BUILDING_SOCIETY">
                    Hanley Economic Building Society
                  </option>
                  <option value="HARPDEN_BUILDING_SOCIETY">
                    Harpenden Building Society
                  </option>
                  <option value="HSBC">HSBC</option>
                  <option value="ICICI_BANK">ICICI Bank</option>
                  <option value="INTERBAY_COMMERCIAL">
                    Interbay Commercial
                  </option>
                  <option value="INVESTEC">Investec</option>
                  <option value="IPSWICH_BUILDING_SOCIETY">
                    Ipswich Building Society
                  </option>
                  <option value="JUST_RETIREMENT_SOLUTIONS">
                    Just Retirement Solutions
                  </option>
                  <option value="KENSINGTON_MORTGAGES">
                    Kensington Mortgages
                  </option>
                  <option value="KENT_RELIANCE">Kent Reliance</option>
                  <option value="KEYSTONE_PROPERTY_FINANCE">
                    Keystone Property Finance
                  </option>
                  <option value="LEEDS_BUILDING_SOCIETY">
                    Leeds Building Society
                  </option>
                  <option value="LEEK_UNITED_BUILDING_SOCIETY">
                    Leek United Building Society
                  </option>
                  <option value="METRO_BANK">Metro Bank</option>
                  <option value="MONMOUTHSHIRE_BUILDING_SOCIETY">
                    Monmouthshire Building Society
                  </option>
                  <option value="NATIONWIDE">Nationwide</option>
                  <option value="NATWEST">NatWest</option>
                  <option value="NOTTINGHAM_BUILDING_SOCIETY">
                    Nottingham Building Society
                  </option>
                  <option value="PARAGON_MORTGAGES">Paragon Mortgages</option>
                  <option value="PEPPER_MONEY">Pepper Money</option>
                  <option value="POST_OFFICE_MORTGAGES">
                    Post Office Mortgages
                  </option>
                  <option value="PRINCIPALITY_BUILDING_SOCIETY">
                    Principality Building Society
                  </option>
                  <option value="SANTANDER">Santander</option>
                  <option value="SKIPTON_BUILDING_SOCIETY">
                    Skipton Building Society
                  </option>
                  <option value="TSB">TSB</option>
                  <option value="ULSTER_BANK">Ulster Bank</option>
                  <option value="UNKNOWN">Unknown</option>
                  <option value="UNKNOWN_DEFAULT">Unknown (Default)</option>
                  <option value="VIDA_HOMELOANS">Vida Homeloans</option>
                  <option value="WEST_BROMWICH_BUILDING_SOCIETY">
                    West Bromwich Building Society
                  </option>
                  <option value="WEST_ONE_LOANS">West One Loans</option>
                </Input>
                {errors.lender && (
                  <div className="text-danger">{errors.lender}</div>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>DIP Date</Label>
                <Input
                  type="date"
                  name="dip_date"
                  value={formData.dip_date as unknown as string}
                  onChange={handleInputChange}
                />
                {errors.dip_date && (
                  <div className="text-danger">{errors.dip_date}</div>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>
                  DIP Decision<span className="text-danger">*</span>
                </Label>
                <Input
                  type="select"
                  name="dip_decision"
                  value={formData.dip_decision}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select...</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="DECLINED">Declined</option>
                  <option value="REFERED">Referred</option>
                </Input>
                {errors.dip_decision && (
                  <div className="text-danger">{errors.dip_decision}</div>
                )}
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>DIP Reference Number</Label>
                <Input
                  type="text"
                  name="dip_reference_number"
                  value={formData.dip_reference_number}
                  onChange={handleInputChange}
                />
                {errors.dip_reference_number && (
                  <div className="text-danger">
                    {errors.dip_reference_number}
                  </div>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <FormGroup>
                <Label>Notes</Label>
                <Input
                  type="textarea"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                />
                {errors.notes && (
                  <div className="text-danger">{errors.notes}</div>
                )}
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col className="mt-4 d-flex justify-content-end gap-2">
              <Button color="secondary" onClick={toggle}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Save History
              </Button>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default AddNewLenderHistoryModal;
