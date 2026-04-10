import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { basicTabIndicator } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/CaseDetailsTabIndicatorSlice";
import { useUpdateDIPHistoryDetailsMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/DIPHistoryDetails/DIPHistoryDetailsApi";
import { useGetSingleCaseQuery } from "@/Redux/Reducers/Common/Cases/CasesApi";
import LoadingSpinner from "@/app/loading";
import { getNextTabNav } from "@/utils/Helper/nextTabUtils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button, Col, FormGroup, Input, Label, Row } from "reactstrap";
import AddNewLenderHistoryModal from "./Modals/AddNewLenderHistoryModal";

const DIPHistoryContent: React.FC<{ dipData: any }> = ({ dipData }) => {
  const { data: session } = useSession();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const submitActionRef = useRef<"save" | "next">("save");
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    is_this_application_had_a_decision_in_principle:
      dipData?.is_this_application_had_a_decision_in_principle || false,
    lender: dipData?.lender || "",
    dip_date: dipData?.dip_date || null,
    dip_decision: dipData?.dip_decision || "",
    dip_reference_number: dipData?.dip_reference_number || "",
    notes: dipData?.notes || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Add useEffect to update form data when dipData changes
  useEffect(() => {
    setFormData({
      is_this_application_had_a_decision_in_principle:
        dipData?.is_this_application_had_a_decision_in_principle || false,
      lender: dipData?.lender || "",
      dip_date: dipData?.dip_date || null,
      dip_decision: dipData?.dip_decision || "",
      dip_reference_number: dipData?.dip_reference_number || "",
      notes: dipData?.notes || "",
    });
  }, [dipData]);

  const [updateDIPHistoryDetails, { isLoading }] =
    useUpdateDIPHistoryDetailsMutation();
  const { casealias } = useParams();
  const dispatch = useAppDispatch();
  const { data: caseData, isLoading: isCaseFetching } = useGetSingleCaseQuery(
    { case_alias: casealias },
    { skip: !casealias },
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => {
      if (!prev || !name) return prev;
      const copy = { ...prev };
      if (copy[name]) delete copy[name];
      return copy;
    });
  };

  const parseApiErrors = (err: any): Record<string, string> => {
    const out: Record<string, string> = {};
    const src = err?.data || err || {};

    const sanitize = (s: any) => String(s ?? "").replace(/^\s*\d+,\s*/g, "");

    const walk = (obj: any) => {
      if (!obj) return;
      if (typeof obj === "string") {
        out.detail = sanitize(obj);
        return;
      }
      if (Array.isArray(obj)) {
        obj.forEach((item) => {
          if (typeof item === "string") out.detail = sanitize(item);
          else walk(item);
        });
        return;
      }
      if (typeof obj === "object") {
        Object.entries(obj).forEach(([k, v]) => {
          if (typeof v === "string" || typeof v === "number") {
            out[k] = sanitize(v);
          } else if (Array.isArray(v)) {
            out[k] = v.map((it) => sanitize(it)).join(" ");
          } else if (typeof v === "object") {
            // flatten nested objects one level: key.subkey
            Object.entries(v as any).forEach(([k2, v2]) => {
              if (Array.isArray(v2))
                out[`${k}.${k2}`] = v2.map(sanitize).join(" ");
              else out[`${k}.${k2}`] = sanitize(v2);
            });
          }
        });
      }
    };

    walk(src);
    return out;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await updateDIPHistoryDetails({
        case_alias: casealias,
        dipHistory_alias: dipData?.alias,
        payload: formData,
      });
      if (res.data) {
        setErrors({});
        toast.success("DIP History updated successfully!");
        // Only go to next tab if this was a Save & Next action
        if (submitActionRef.current === "next") {
          handleNextTab();
        }
      } else if (res.error) {
        const parsed = parseApiErrors(res.error);
        setErrors(parsed);
        const firstMsg =
          Object.values(parsed)[0] ||
          (res.error as any)?.data?.detail ||
          "Failed to update DIP History";
        toast.error(firstMsg);
      } else {
        toast.error("Failed to update DIP History");
      }
    } catch (error) {
      const parsed = parseApiErrors(error);
      if (Object.keys(parsed).length) setErrors(parsed);
      toast.error("Failed to update DIP History");
    }
  };

  const currentTab: string | null = useAppSelector(
    (state) => state.caseSections.basicTabId,
  );

  const handleNextTab = () => {
    const nextTabNav = getNextTabNav(
      caseData?.case_stage,
      caseData?.case_category,
      currentTab!,
    );
    if (nextTabNav) {
      dispatch(basicTabIndicator(nextTabNav));
    } else {
      toast.warning("This is the last tab.");
    }
  };

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="border rounded p-3 mb-3">
        <form ref={formRef} id="dip-form" onSubmit={handleSubmit}>
          <Row>
            <Col>
              <FormGroup className="mb-4">
                <Label className="mb-2">
                  Has this application had a Decision in Principle?
                </Label>
                <div>
                  {["yes", "no"].map((option) => (
                    <FormGroup key={option.toLowerCase()} check inline>
                      <Input
                        type="radio"
                        id={`radio-${option}`}
                        name="is_this_application_had_a_decision_in_principle"
                        checked={
                          option === "yes"
                            ? formData.is_this_application_had_a_decision_in_principle
                            : !formData.is_this_application_had_a_decision_in_principle
                        }
                        onChange={() => {
                          setFormData((prev) => ({
                            ...prev,
                            is_this_application_had_a_decision_in_principle:
                              option === "yes",
                          }));
                          setErrors((prev) => {
                            const copy = { ...prev };
                            delete copy[
                              "is_this_application_had_a_decision_in_principle"
                            ];
                            return copy;
                          });
                        }}
                      />
                      <Label check for={`radio-${option}`}>
                        {option.charAt(0).toUpperCase() +
                          option.slice(1).toLowerCase()}
                      </Label>
                    </FormGroup>
                  ))}
                  {errors.is_this_application_had_a_decision_in_principle && (
                    <div className="text-danger">
                      {errors.is_this_application_had_a_decision_in_principle}
                    </div>
                  )}
                </div>
              </FormGroup>
            </Col>
          </Row>
          {formData?.is_this_application_had_a_decision_in_principle && (
            <>
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
                      <option value="BANK_OF_CYPRUS_UK">
                        Bank of Cyprus UK
                      </option>
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
                      <option value="DIGITAL_MORTGAGES">
                        Digital Mortgages
                      </option>
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
                      <option value="PARAGON_MORTGAGES">
                        Paragon Mortgages
                      </option>
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
                      value={formData.dip_date}
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
                      <option value="REFERED">Refered</option>
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
            </>
          )}
          <Row>
            <Col className="mt-4 d-flex justify-content-between align-items-center gap-2">
              <div>
                <Button
                  color="success"
                  type="button"
                  className="border-success"
                  onClick={() => setModalIsOpen(true)}
                  disabled={session?.user?.role === "APPLICANT"}
                >
                  Add New Lender History
                </Button>
              </div>
              <div className="d-flex gap-2">
                <Button
                  color="primary"
                  type="submit"
                  onClick={() => {
                    submitActionRef.current = "save";
                  }}
                  disabled={session?.user?.role === "APPLICANT"}
                >
                  Save History
                </Button>
                <Button
                  color="secondary"
                  onClick={async (e) => {
                    e.preventDefault();
                    if (session?.user?.role === "APPLICANT") {
                      handleNextTab();
                    } else {
                      submitActionRef.current = "next";
                      formRef.current?.requestSubmit();
                    }
                  }}
                >
                  {session?.user?.role === "APPLICANT"
                    ? "Go To Next"
                    : "Save & Next"}
                </Button>
              </div>
            </Col>
          </Row>
        </form>
      </div>
      {/* Modal Component */}
      <AddNewLenderHistoryModal
        isOpen={modalIsOpen}
        toggle={() => setModalIsOpen(!modalIsOpen)}
      />
    </div>
  );
};

export default DIPHistoryContent;
