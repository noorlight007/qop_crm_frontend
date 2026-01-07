"use client";
import {
  useGetAppranceQuery,
  useUpdateAppearanceMutation,
} from "@/Redux/Reducers/Appearance/AppearanceApi";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  Col,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import Swal from "sweetalert2";

const LogoAndFavIconAndFontChanger: React.FC = () => {
  const { data: appearanceData } = useGetAppranceQuery(undefined);
  const [updateAppearance, { isLoading }] = useUpdateAppearanceMutation();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [faviconPreview, setFaviconPreview] = useState<string>("");

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  // Initialize previews from API data
  useEffect(() => {
    if (appearanceData) {
      if (appearanceData.logo) {
        setLogoPreview(appearanceData.logo);
      }
      if (appearanceData.fav_icon) {
        setFaviconPreview(appearanceData.fav_icon);
      }
    }
  }, [appearanceData]);

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== "image/png") {
        toast.error("Please select a PNG file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleFaviconChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const name = file.name.toLowerCase();
      const isPng = file.type === "image/png" || name.endsWith(".png");
      const isIco =
        file.type === "image/x-icon" ||
        file.type === "image/vnd.microsoft.icon" ||
        name.endsWith(".ico");

      if (!isPng && !isIco) {
        toast.error("Please select a PNG or ICO file");
        return;
      }

      // Validate file size (max 100KB for fav_icon)
      if (file.size > 100 * 1024) {
        toast.error("Favicon file size must be less than 100KB");
        return;
      }

      setFaviconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaviconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!logoFile && !faviconFile) {
      toast.warning("Please select at least one file to upload");
      return;
    }

    const formData = new FormData();
    if (logoFile) {
      formData.append("logo", logoFile);
    }
    if (faviconFile) {
      formData.append("fav_icon", faviconFile);
    }

    try {
      await updateAppearance({
        payload: formData,
      }).unwrap();

      Swal.fire({
        title: "Success",
        text: "Logo and fav_icon updated successfully!",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
      });

      // Reset file states after successful upload
      setLogoFile(null);
      setFaviconFile(null);
      if (logoInputRef.current) logoInputRef.current.value = "";
      if (faviconInputRef.current) faviconInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to update logo and favicon", error);
      toast.error("Failed to update logo and favicon");
    }
  };

  const resetLogo = () => {
    setLogoFile(null);
    setLogoPreview(appearanceData?.logo || "");
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  const resetFavicon = () => {
    setFaviconFile(null);
    setFaviconPreview(appearanceData?.fav_icon || "");
    if (faviconInputRef.current) faviconInputRef.current.value = "";
  };

  return (
    <Card>
      <CardBody>
        <h5 className="mb-4">Logo & Favicon</h5>

        {/* Logo Upload Section */}
        <FormGroup className="mb-4">
          <Label className="form-label">
            Logo{" "}
            <small className="text-warning">
              (Preferred resolution: 350x120 px)
            </small>{" "}
          </Label>
          <Row className="g-3">
            <Col md="6">
              <div className="d-flex flex-column gap-2">
                <Input
                  innerRef={logoInputRef}
                  type="file"
                  accept=".png,image/png"
                  onChange={handleLogoChange}
                  disabled={isLoading}
                />
                <small className="text-muted">
                  Supported format: PNG (Max 5MB)
                </small>
              </div>
            </Col>
            <Col md="6">
              {logoPreview && (
                <div
                  className="border rounded p-2 bg-light text-center"
                  style={{ maxHeight: "120px" }}
                >
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    style={{ maxHeight: "100px", maxWidth: "100%" }}
                  />
                </div>
              )}
            </Col>
          </Row>
        </FormGroup>

        {/* Favicon Upload Section */}
        <FormGroup className="mb-4">
          <Label className="form-label">
            Favicon{" "}
            <small className="text-warning">
              (Preferred resolution: 32x32 px)
            </small>
          </Label>
          <Row className="g-3">
            <Col md="6">
              <div className="d-flex flex-column gap-2">
                <Input
                  innerRef={faviconInputRef}
                  type="file"
                  accept=".png,.ico,image/png"
                  onChange={handleFaviconChange}
                  disabled={isLoading}
                />
                <small className="text-muted">
                  Supported formats: PNG, ICO (Max 100KB)
                </small>
              </div>
            </Col>
            <Col md="6">
              {faviconPreview && (
                <div
                  className="border rounded p-2 bg-light text-center"
                  style={{ maxHeight: "120px" }}
                >
                  <img
                    src={faviconPreview}
                    alt="Favicon Preview"
                    style={{ maxHeight: "100px", maxWidth: "100%" }}
                  />
                </div>
              )}
            </Col>
          </Row>
        </FormGroup>

        {/* Action Buttons */}
        <div className="d-flex gap-2">
          <Button
            color="primary"
            onClick={handleUpload}
            disabled={isLoading || (!logoFile && !faviconFile)}
          >
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
          {(logoFile || faviconFile) && (
            <Button
              color="secondary"
              onClick={() => {
                resetLogo();
                resetFavicon();
              }}
            >
              Reset
            </Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default LogoAndFavIconAndFontChanger;
