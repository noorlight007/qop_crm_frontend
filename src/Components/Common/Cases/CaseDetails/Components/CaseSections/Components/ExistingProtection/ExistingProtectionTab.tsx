import { LoadingSpinner2 } from "@/app/loading";
import { useGetExistingProtectionDetailsQuery } from "@/Redux/Reducers/Common/Cases/CaseDetails/CaseSections/ExistingProtection/ExistingProtectionDetailsApi";
import { ExistingProtectionDetailsProps } from "@/Types/Common/Cases/CaseDetails/CaseSections/ExistingProtectionTypes";
import getCurrencySign from "@/utils/currency";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import ExistingProtectionContent from "./ExistingProtectionContent";

const ExistingProtectionTab: React.FC = () => {
  const [activeUser, setActiveUser] = useState<number | null>(null); // State for active customer
  const [activeTab, setActiveTab] = useState<string | null>(null); // State for active existingProtection tab
  // Cache for unsaved edits keyed by existingProtection alias
  const [editsCache, setEditsCache] = useState<
    Record<string, Partial<ExistingProtectionDetailsProps>>
  >({});

  type Customer = ExistingProtectionDetailsProps["customer"];

  // Get case alias from URL params
  const params = useParams();
  const { casealias } = params;

  // Fetch data
  const { data: existingProtectionDetails, isLoading } =
    useGetExistingProtectionDetailsQuery({
      case_alias: casealias,
    });

  // Add this function after groupByUserId
  // Calculate sum assured for each customer
  const calculateUserSumAssured = (
    existingProtections: ExistingProtectionDetailsProps[],
  ) => {
    const userSums = existingProtections.reduce(
      (acc, existingProtection) => {
        const userId = existingProtection.customer.id;
        // Convert to number and handle null/undefined
        const sumAssured = Number(existingProtection.sum_assured) || 0;

        if (!acc[userId]) {
          acc[userId] = {
            total: 0,
            name: `${existingProtection.customer.first_name} ${existingProtection.customer.last_name}`,
          };
        }
        // Add the current existingProtection's sum_assured to the customer's total
        acc[userId].total = acc[userId].total + sumAssured;
        return acc;
      },
      {} as Record<number, { total: number; name: string }>,
    );

    return userSums;
  };

  // Get all customer sums
  const userSumAssured = calculateUserSumAssured(
    existingProtectionDetails || [],
  );

  // Get unique customers from existing protections
  const uniqueCustomers: Customer[] = Array.from(
    new Map<number, Customer>(
      (existingProtectionDetails || []).map(
        (ep: ExistingProtectionDetailsProps) => [ep.customer.id, ep.customer],
      ),
    ).values(),
  );

  // Set the first customer and their first existingProtection as default when data is fetched
  useEffect(() => {
    if (existingProtectionDetails && existingProtectionDetails.length > 0) {
      const firstUserId = existingProtectionDetails[0]?.customer.id;
      setActiveUser(firstUserId);
      setActiveTab(existingProtectionDetails[0]?.alias || null);
    }
  }, [existingProtectionDetails]);

  // Update cache for a particular alias and field
  const handleCacheUpdate = (
    alias: string | null,
    name: keyof ExistingProtectionDetailsProps,
    value: any,
  ) => {
    if (!alias) return;
    setEditsCache((prev) => ({
      ...prev,
      [alias]: {
        ...(prev[alias] || {}),
        [name]: value,
      },
    }));
  };

  // Clear cache for an alias (e.g., after successful save)
  const clearCacheForAlias = (alias: string | undefined | null) => {
    if (!alias) return;
    setEditsCache((prev) => {
      const copy = { ...prev };
      delete copy[alias];
      return copy;
    });
  };

  if (isLoading) {
    return <LoadingSpinner2 />;
  }

  return (
    <Col xxl="12" className="px-5">
      <Card>
        <CardBody>
          {/* Outer Navigation Tabs (Users) */}
          <CardHeader className="d-flex justify-content-center align-items-center flex-wrap gap-2 pb-2 p-0">
            <Nav
              className="nav-warning d-flex flex-wrap gap-2 justify-content-center"
              pills
            >
              {uniqueCustomers.map((customer) => {
                // Get the first existingProtection for this customer
                const firstProtectionForCustomer =
                  existingProtectionDetails?.find(
                    (ep: ExistingProtectionDetailsProps) =>
                      ep.customer.id === customer.id,
                  );

                return (
                  <NavItem key={customer.id}>
                    <NavLink
                      className={`${activeUser === customer.id ? "active" : ""}`}
                      onClick={() => {
                        setActiveUser(customer.id);
                        setActiveTab(firstProtectionForCustomer?.alias || null);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {`${
                        customer.title
                          ? customer?.title[0].toUpperCase() +
                            customer?.title.slice(1).toLowerCase() +
                            ""
                          : ""
                      } ${customer.first_name} ${customer.middle_name} ${
                        customer.last_name
                      } (${getCurrencySign()}${
                        userSumAssured[customer.id]?.total
                          ? parseFloat(
                              userSumAssured[customer.id].total.toString(),
                            ).toLocaleString("en-GB", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                              useGrouping: true,
                            })
                          : "0.00"
                      })`}
                    </NavLink>
                  </NavItem>
                );
              })}
            </Nav>
          </CardHeader>

          {/* Inner Navigation Tabs (Properties for the selected customer) */}
          {activeUser && (
            <CardHeader className="d-flex justify-content-center align-items-center flex-wrap gap-3 pt-3 pb-0">
              <Nav
                tabs
                className="border-tab mb-0 d-flex flex-wrap gap-2 justify-content-center"
              >
                {existingProtectionDetails
                  ?.filter(
                    (ep: ExistingProtectionDetailsProps) =>
                      ep.customer.id === activeUser,
                  )
                  .map(
                    (
                      existingProtection: ExistingProtectionDetailsProps,
                      index: number,
                    ) => (
                      <NavItem key={existingProtection.alias}>
                        <NavLink
                          className={`nav-border text-info tab-info ${
                            activeTab === existingProtection.alias
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            setActiveTab(existingProtection.alias || null)
                          }
                          style={{ cursor: "pointer", fontSize: "0.7rem" }}
                        >
                          Security {index + 1}
                        </NavLink>
                      </NavItem>
                    ),
                  )}
              </Nav>
            </CardHeader>
          )}

          {/* Tab Content */}
          {activeTab && activeUser && (
            <ExistingProtectionContent
              activeTab={activeTab}
              activeUser={activeUser}
              groupedData={
                existingProtectionDetails?.reduce(
                  (
                    acc: Record<number, ExistingProtectionDetailsProps[]>,
                    ep: ExistingProtectionDetailsProps,
                  ) => {
                    if (!acc[ep.customer.id]) {
                      acc[ep.customer.id] = [];
                    }
                    acc[ep.customer.id].push(ep);
                    return acc;
                  },
                  {} as Record<number, ExistingProtectionDetailsProps[]>,
                ) || {}
              }
              // pass cached edits for the active tab so the inner component can merge unsaved changes
              cachedEdits={editsCache[activeTab || ""] || null}
              // handler for inner component to update the cache
              onCacheUpdate={(
                name: keyof ExistingProtectionDetailsProps,
                value: any,
              ) => handleCacheUpdate(activeTab, name, value)}
              // clear cached edits for alias after save
              clearCachedEdits={(alias: string) => clearCacheForAlias(alias)}
            />
          )}
        </CardBody>
      </Card>
    </Col>
  );
};

export default ExistingProtectionTab;
