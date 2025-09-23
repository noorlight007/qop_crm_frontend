export interface FeesTabContentProps {
  tabId: string;
  setTabId: (id: string) => void;
}

export interface FeeDataProps {
  fee: string;
  feeType: string;
  method: string;
  notes: string;
  feeDate: string;
}

export interface AddFeeInModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSubmit: (feeData: FeeDataProps) => void;
  feeTypes: { title: string; value: string }[];
  methods: { title: string; value: string }[];
  caseAlias: string | string[];
}

export interface FeeDataProps {
  fee: string;
  feeType: string;
  method: string;
  notes: string;
  feeDate: string;
}

export interface AddFeeOutModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSubmit: (feeData: FeeDataProps) => void;
  feeTypes: { title: string; value: string }[];
  methods: { title: string; value: string }[];
  caseAlias: string | string[];
}
