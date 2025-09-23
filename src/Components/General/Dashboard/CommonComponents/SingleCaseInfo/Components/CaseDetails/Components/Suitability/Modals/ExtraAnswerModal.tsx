import { useAddExtraAnswerMutation } from "@/Redux/Reducers/CommonComponents/SingleCaseInfo/CaseDetails/Suitability/SuitabilityApi";
import { ExtraAnswerModalProps } from "@/Types/CommonComponents/SingleCaseInfo/CaseDetails/SuitabilityTypes";
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
  ModalFooter,
  ModalHeader,
} from "reactstrap";

const ExtraAnswerModal: React.FC<ExtraAnswerModalProps> = ({
  isOpen,
  toggle,
}) => {
  const { casealias } = useParams();
  const [formData, setFormData] = useState({
    section_choices: "",
    answer: "",
  });

  // rtk hook
  const [AddExtraAnswer, { isLoading: isUpdating }] =
    useAddExtraAnswerMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await AddExtraAnswer({
        case_alias: casealias,
        payload: {
          section_choices: formData.section_choices,
          answer: formData.answer,
        },
      });
      if (res.data) {
        // Reset form and close modal on success
        setFormData({ section_choices: "", answer: "" });
        toggle();
        toast.success("Answer added successfully");
      } else if (res.error) {
        const errorMessage =
          (res.error as any)?.data?.detail || "Failed to add extra answer";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to add extra answer");
      }
    } catch (error) {
      console.error("Failed to add extra answer:", error);
      toast.error("Failed to add extra answer");
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggle}>
          <h4 className="text-info">Add Extra Answer</h4>
        </ModalHeader>
        <ModalBody>
          <Col md={8}>
            <Label for="section_choices">Question Type*</Label>
            <FormGroup>
              <Input
                type="select"
                name="section_choices"
                value={formData.section_choices}
                onChange={handleChange}
                required
              >
                <option value="">Select...</option>
                <option value="YOUR_CIRCUMSTANCES_AND_OBJECTIVES">
                  Your circumstances and objectives
                </option>
                <option value="BUDGET_AND_AFFORDABILITY">
                  Budget and affordability
                </option>
                <option value="NEW_MORTGAGE_DETAILS">
                  New mortgage details
                </option>
                <option value="RECOMMENDED_REPAYMENT_METHOD">
                  Why are we recommending this repayment method?
                </option>
                <option value="RECOMMENDED_MORTGAGE_TYPE">
                  Why are we recommending this mortgage type?
                </option>
                <option value="RECOMMENDED_TERM">
                  Why are we recommending this term?
                </option>
                <option value="RECOMMENDED_LENDER">
                  Why are we recommending this mortgage lender?
                </option>
                <option value="RECOMMENDED_AMOUNT">
                  Why are we recommending this mortgage amount?
                </option>
                <option value="COSTS_AND_FEES">
                  What are the costs and fees?
                </option>
                <option value="DISADVANTAGES_AND_RISKS">
                  What are the disadvantages and risks?
                </option>
                <option value="COST_OF_ADVICE">
                  What is the cost of our advice?
                </option>
                <option value="PROTECTION">What is the protection?</option>
                <option value="BUILDINGS_INSURANCE">
                  What is the buildings insurance?
                </option>
                <option value="WILLS">What is the wills?</option>
              </Input>
            </FormGroup>
          </Col>

          <FormGroup>
            <Label for="answer">Answer*</Label>
            <Input
              type="textarea"
              id="answer"
              name="answer"
              rows={8}
              value={formData.answer}
              onChange={handleChange}
              placeholder="Enter your answer here..."
              required
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" type="submit">
            {isUpdating ? "Saving..." : "Save Answer"}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default ExtraAnswerModal;
