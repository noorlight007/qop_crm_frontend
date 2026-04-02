import { useSendClientSurveyMutation } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/ClientSurvey/ClientSurveyApi";
import { SendSurveyToClientModalProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/ClientSurveyTypes";
import React from "react";
import { Send } from "react-feather";
import { toast } from "react-toastify";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "reactstrap";

const getErrorMessage = (err: any) => {
  const normalize = (raw: string): string => {
    const trimmed = raw.trim();
    // remove status code prefix variants.
    return trimmed
      .replace(/^status code\s*\d+\s*[:,]?\s*/i, "")
      .replace(/^\d+\s*[:,.-]?\s*/i, "")
      .trim();
  };

  if (!err) return "Unknown error";

  if (typeof err === "string") return normalize(err);

  if (typeof err?.data === "string") return normalize(err.data);

  const collect = (value: any): string[] => {
    if (value == null) return [];
    if (typeof value === "string") {
      const normalized = normalize(value);
      return normalized ? [normalized] : [];
    }
    if (typeof value === "number") {
      const normalized = normalize(String(value));
      return normalized ? [normalized] : [];
    }
    if (Array.isArray(value))
      return value
        .flatMap((v) =>
          typeof v === "string"
            ? normalize(v)
            : typeof v === "number"
              ? normalize(String(v))
              : collect(v),
        )
        .filter(Boolean) as string[];
    if (typeof value === "object") {
      try {
        return Object.values(value)
          .flatMap((v) => collect(v))
          .filter(Boolean) as string[];
      } catch {
        return [String(value)];
      }
    }
    const normalized = normalize(String(value));
    return normalized ? [normalized] : [];
  };

  if (err && typeof err === "object") {
    const msgs = collect(err);
    if (msgs.length) return msgs.join(", ");
  }

  if (err?.data?.message) return normalize(String(err.data.message));

  if (err?.data && typeof err.data === "object") {
    const msgs = collect(err.data);
    if (msgs.length) return msgs.join(", ");
  }

  if (err?.error) return normalize(String(err.error));
  if (err?.message) return normalize(String(err.message));

  try {
    return normalize(JSON.stringify(err));
  } catch {
    return normalize(String(err));
  }
};

const SendSurveyToClientModal: React.FC<SendSurveyToClientModalProps> = ({
  isOpen,
  toggle,
  caseAlias,
  onSuccess,
}) => {
  const normalizedCaseAlias =
    typeof caseAlias === "string"
      ? caseAlias
      : Array.isArray(caseAlias)
        ? caseAlias[0]
        : undefined;

  const [sendSurvey, { isLoading: isSendingSurvey }] =
    useSendClientSurveyMutation();

  const handleSend = React.useCallback(async () => {
    if (!normalizedCaseAlias) {
      toast.error("Case alias is missing.");
      return;
    }

    try {
      await sendSurvey({ case_alias: normalizedCaseAlias }).unwrap();
      toast.success("Survey sent successfully.");
      onSuccess?.();
      toggle();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }, [normalizedCaseAlias, onSuccess, sendSurvey, toggle]);

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle} className="bg-primary">
        Send Survey to Client
      </ModalHeader>
      <ModalBody className="text-center">
        Are you sure you want to send the survey form to the client? They will
        receive an email with a link to submit the survey.
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={handleSend}
          disabled={isSendingSurvey || !caseAlias}
        >
          {isSendingSurvey ? (
            <>
              <Spinner size="sm" className="me-2" />
              Sending...
            </>
          ) : (
            <>
              <Send size={14} className="me-2" />
              Yes, Send
            </>
          )}
        </Button>
        <Button
          color="secondary"
          outline
          onClick={toggle}
          disabled={isSendingSurvey}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SendSurveyToClientModal;
