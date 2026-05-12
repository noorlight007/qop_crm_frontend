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

export interface FeeDataDeleteProps {
  alias?: string;
  fee?: number | string;
  amount?: number | string;
  [key: string]: any;
}

export interface DeleteFeeModalProps {
  isOpen: boolean;
  toggle: () => void;
  feeData: FeeDataDeleteProps | null;
}

export interface FeeEditInitialDataProps {
  alias?: string;
  fee?: number | string;
  amount?: number | string;
  feeType?: string;
  method?: string;
  notes?: string;
  feeDate?: string;
  [key: string]: any;
}

export interface EditFeeInModalProps {
  isOpen: boolean;
  toggle: () => void;
  onSubmit: (feeData: FeeDataProps) => void;
  feeTypes: { title: string; value: string }[];
  methods: { title: string; value: string }[];
  caseAlias: string | string[];
  initialData: FeeEditInitialDataProps | null;
}
