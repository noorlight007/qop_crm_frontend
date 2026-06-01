import { useGetUserListQuery } from '@/Redux/Reducers/Common/Cases/UserFiltersListApi';
import { useUpdateNetworkCaseMutation } from '@/Redux/Reducers/SuperAdmin/Networks/NetworkCasesApi';
import {
  CaseInfoPrpos,
  UpdateNetworkCaseModalProps,
} from '@/Types/Common/Cases/CaseTypes';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';

const UpdateNetworkCaseModal: React.FC<UpdateNetworkCaseModalProps> = ({
  isOpen,
  toggle,
  caseData,
  networkSlug,
}) => {
  const { data: session } = useSession();

  // Initialize formData with proper assigned_to mapping
  const getInitialFormData = (data: CaseInfoPrpos | null) => {
    if (!data) return null;
    return {
      ...data,
      assigned_to: data.assigned_user?.id?.toString() || data.assigned_to || '',
      assigned_to_admin:
        data.assigned_admin?.id?.toString() || data.assigned_to_admin || '',
    };
  };

  const getChangedFields = (
    original: CaseInfoPrpos | null,
    current: CaseInfoPrpos | null,
  ): Partial<CaseInfoPrpos> => {
    if (!original || !current) return {};

    // Only diff fields that are editable in this modal.
    const editableKeys: Array<keyof CaseInfoPrpos> = [
      'case_stage',
      'assigned_to',
      'assigned_to_admin',
      'notes',
    ];

    const normalize = (value: unknown) => {
      if (value === null || value === undefined) return '';
      return String(value);
    };

    return editableKeys.reduce<Partial<CaseInfoPrpos>>((acc, key) => {
      const originalValue = normalize((original as any)[key]);
      const currentValue = normalize((current as any)[key]);

      if (originalValue !== currentValue) {
        (acc as any)[key] = (current as any)[key];
      }
      return acc;
    }, {});
  };

  const [formData, setFormData] = useState<CaseInfoPrpos | null>(
    getInitialFormData(caseData),
  );

  const [updateNetworkCaseDetails, { isLoading: isUpdating }] =
    useUpdateNetworkCaseMutation();

  const { data: userAdviserListData } = useGetUserListQuery({
    role: 'ADVISER',
    network_slug: networkSlug,
  });
  // console.log("User Adviser List Data:", userAdviserListData);

  const { data: userAdminListData } = useGetUserListQuery({
    role: 'ADMIN',
    network_slug: networkSlug,
  });
  // console.log("User Admin List Data:", userAdminListData);

  const baselineFormData = getInitialFormData(caseData);
  const changedFields = getChangedFields(baselineFormData, formData);
  const hasChanges = Object.keys(changedFields).length > 0;

  useEffect(() => {
    if (caseData) {
      // Set formData and ensure assigned_to reflects the current assigned_user
      setFormData(getInitialFormData(caseData));
    }
  }, [caseData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      if (!prevData) return prevData;
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleSubmit = async () => {
    try {
      if (!caseData?.alias || !formData) return;
      if (!hasChanges) return;

      const res = await updateNetworkCaseDetails({
        network_slug: networkSlug,
        case_alias: caseData?.alias,
        payload: changedFields,
      });
      if (res.data) {
        toast.success('Case updated successfully.');
        toggle();
      } else if (res.error) {
        const errorMessage =
          (res.error as any)?.data?.detail ||
          'Failed to update the case. Please try again.';
        toast.error(errorMessage);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Error updating case:', error);
      toast.error('Failed to update the case. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        <h3 className='text-primary'>Update Case</h3>
      </ModalHeader>
      <ModalBody>
        {formData ? (
          <Form>
            <FormGroup>
              <Label for='case_stage'>Case Stage</Label>
              <Input
                type='select'
                name='case_stage'
                id='case_stage'
                value={formData?.case_stage || ''}
                onChange={handleInputChange}
              >
                {formData?.case_category === 'MORTGAGE' ? (
                  <>
                    <option value=''>Select...</option>
                    <option value='ENQUIRY'>Enquiry</option>
                    <option value='FACT_FIND'>Fact Find</option>
                    <option value='RESEARCH_COMPLIANCE_CHECK'>
                      Research and Compliance Check
                    </option>
                    <option value='DECISION_IN_PRINCIPLE'>
                      Decision in Principle
                    </option>
                    <option value='FULL_MORTGAGE_APPLICATION'>
                      Full Mortgage Application
                    </option>
                    <option value='SUBMISSION'>Submission</option>
                    <option value='OFFER_FROM_BANK'>Offer From Bank</option>
                    <option value='LEGAL'>Legal</option>
                    <option value='COMPLETION'>Completion</option>
                    <option value='REFERRED'>
                      Referred(Packager/External)
                    </option>
                    <option value='FUTURE_OPPORTUNITY'>
                      Future Opportunity
                    </option>
                    <option value='NOT_PROCEED'>Not Proceed</option>
                  </>
                ) : (
                  <>
                    <option value=''>Select...</option>
                    <option value='ENQUIRY'>Enquiry</option>
                    <option value='FACT_FIND'>Fact Find</option>
                    <option value='SUBMISSION'>Submission</option>
                    <option value='ACCEPT_WAITING_START_DATE'>
                      Accept Awaiting Start Date
                    </option>
                    <option value='ACCEPTED_ON_RISK'>Accepted on Risk</option>
                    <option value='FURTHER_MEDICAL_REQUIRED'>
                      Further Medical Required
                    </option>
                    <option value='REFERRED'>
                      Referred(Packager/External)
                    </option>
                    <option value='FUTURE_OPPORTUNITY'>
                      Future Opportunity
                    </option>
                    <option value='NOT_PROCEED'>Not Proceed</option>
                  </>
                )}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for='adviser'>Assign Adviser</Label>
              <Input
                id='adviser'
                name='assigned_to'
                type='select'
                value={formData?.assigned_to || ''}
                onChange={handleInputChange}
              >
                <option value=''>Select...</option>
                {userAdviserListData?.length > 0 ? (
                  userAdviserListData?.map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {user?.name}
                    </option>
                  ))
                ) : (
                  <option value='' disabled>
                    No advisers available
                  </option>
                )}
              </Input>
            </FormGroup>

            {!session?.user?.is_network &&
              (session?.user?.role === 'DIRECTOR' ||
                session?.user?.role === 'ADVISER' ||
                session?.user?.role === 'ADMIN') && (
                <FormGroup>
                  <Label for='adviser'>Assign Admin</Label>
                  <Input
                    id='admin'
                    name='assigned_to_admin'
                    type='select'
                    value={formData?.assigned_to_admin || ''}
                    onChange={handleInputChange}
                  >
                    <option value=''>Select...</option>
                    {userAdminListData?.length > 0 ? (
                      userAdminListData?.map((user: any) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))
                    ) : (
                      <option value='' disabled>
                        No advisers available
                      </option>
                    )}
                  </Input>
                </FormGroup>
              )}

            <FormGroup>
              <Label for='notes'>Notes</Label>
              <Input
                type='textarea'
                name='notes'
                id='notes'
                value={formData?.notes || ''}
                onChange={handleInputChange}
              />
            </FormGroup>
          </Form>
        ) : (
          <div className='text-center p-3'>
            <p>Loading case data...</p>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button
          color='primary'
          onClick={handleSubmit}
          disabled={!hasChanges || isUpdating || !formData}
        >
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button color='secondary' onClick={toggle} disabled={isUpdating}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default UpdateNetworkCaseModal;
