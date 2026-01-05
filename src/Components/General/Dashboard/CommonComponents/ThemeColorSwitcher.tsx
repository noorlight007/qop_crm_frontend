"use client";
import { UnlimitedColorOptions } from "@/Data/Layout/ThemeCustomizer";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import {
  useGetAppranceQuery,
  useUpdateAppearanceMutation,
} from "@/Redux/Reducers/Appearance/AppearanceApi";
import { addColor } from "@/Redux/Reducers/ThemeCustomizerReducer";
import { ChangeEvent, useEffect, useState } from "react";
import { ChromePicker, ColorResult } from "react-color";
import { Card, CardBody, Col, Input, Label } from "reactstrap";

const ThemeColorSwitcher = () => {
  const dispatch = useAppDispatch();
  const { primary_color, secondary_color } = useAppSelector(
    (state) => state.themeCustomizer.colors
  );

  const { data: appearanceData } = useGetAppranceQuery(undefined);
  const [updateAppearance] = useUpdateAppearanceMutation();

  const [customPrimary, setCustomPrimary] = useState<string>("#308e87");
  const [customSecondary, setCustomSecondary] = useState<string>("#f39159");

  // Sync initial colors from API into theme state and CSS variables
  useEffect(() => {
    if (appearanceData?.primary_color && appearanceData?.secondary_color) {
      const apiPrimary = appearanceData.primary_color as string;
      const apiSecondary = appearanceData.secondary_color as string;

      if (apiPrimary && apiSecondary) {
        if (apiPrimary !== primary_color || apiSecondary !== secondary_color) {
          dispatch(addColor({ primary: apiPrimary, secondary: apiSecondary }));
        }
        setCustomPrimary(apiPrimary);
        setCustomSecondary(apiSecondary);
      }
    }
  }, [appearanceData, primary_color, secondary_color, dispatch]);

  const handleChange = async (primary: string, secondary: string) => {
    // Optimistically update local theme
    dispatch(addColor({ primary, secondary }));

    // Persist to backend for this user
    try {
      await updateAppearance({
        payload: {
          primary_color: primary,
          secondary_color: secondary,
        },
      }).unwrap();
    } catch (error) {
      // You can add toast/error handling here if needed
      console.error("Failed to update appearance settings", error);
    }
  };

  const onPrimaryInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomPrimary(value);
  };

  const onSecondaryInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomSecondary(value);
  };

  const applyCustomColors = () => {
    if (!customPrimary || !customSecondary) return;
    handleChange(customPrimary, customSecondary);
  };

  return (
    <Col xl="4" lg="6" md="6">
      <Card>
        <CardBody>
          <h5 className="mb-3">Theme colors</h5>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {UnlimitedColorOptions.map((option) => {
              const isActive =
                option.primary === primary_color &&
                option.secondary === secondary_color;

              return (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => handleChange(option.primary, option.secondary)}
                  className={`btn btn-light-dark d-flex align-items-center gap-2 ${
                    isActive ? "border border-2 border-primary" : "border"
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      backgroundColor: option.primary,
                      display: "inline-block",
                    }}
                  />
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      backgroundColor: option.secondary,
                      display: "inline-block",
                    }}
                  />
                  <span className="ms-1">Theme {option.name}</span>
                </button>
              );
            })}
          </div>

          {/* Custom colors */}
          <div className="mt-2">
            <h6 className="mb-2">Custom colors</h6>
            <div className="d-flex flex-wrap gap-4">
              <div style={{ minWidth: 220 }}>
                <Label className="form-label mb-2">Primary</Label>
                <ChromePicker
                  color={customPrimary}
                  onChange={(color: ColorResult) => setCustomPrimary(color.hex)}
                  disableAlpha
                />
                <Input
                  type="text"
                  className="mt-2"
                  value={customPrimary}
                  onChange={onPrimaryInputChange}
                  placeholder="#308e87"
                />
              </div>
              <div style={{ minWidth: 220 }}>
                <Label className="form-label mb-2">Secondary</Label>
                <ChromePicker
                  color={customSecondary}
                  onChange={(color: ColorResult) =>
                    setCustomSecondary(color.hex)
                  }
                  disableAlpha
                />
                <Input
                  type="text"
                  className="mt-2"
                  value={customSecondary}
                  onChange={onSecondaryInputChange}
                  placeholder="#f39159"
                />
              </div>
            </div>
            <button
              type="button"
              className="btn btn-primary mt-3"
              onClick={applyCustomColors}
            >
              Apply
            </button>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default ThemeColorSwitcher;
