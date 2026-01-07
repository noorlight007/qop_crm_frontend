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
  // Use two separate mutation hook instances so each upload has its own loading flag
  const [updateLogoMutation, { isLoading: isUploadingLogo }] =
    useUpdateAppearanceMutation();
  const [updateFaviconMutation, { isLoading: isUploadingFavicon }] =
    useUpdateAppearanceMutation();
  const [updateFontMutation, { isLoading: isUpdatingFont }] =
    useUpdateAppearanceMutation();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [faviconPreview, setFaviconPreview] = useState<string>("");
  const [selectedFont, setSelectedFont] = useState<string>("");

  // Must stay in sync with backend AppearanceFontFamilyType
  const fontOptions = ["Inter", "Roboto", "Open Sans", "Lato", "Montserrat", "Poppins"];

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
      if (appearanceData.font_family) {
        setSelectedFont(appearanceData.font_family);
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

  const handleUploadLogo = async () => {
    if (!logoFile) {
      toast.warning("Please select a logo file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("logo", logoFile);

    try {
      await updateLogoMutation({ payload: formData }).unwrap();

      Swal.fire({
        title: "Success",
        text: "Logo updated successfully!",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
      });

      setLogoFile(null);
      setLogoPreview(appearanceData?.logo || "");
      if (logoInputRef.current) logoInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to update logo", error);
      toast.error("Failed to update logo");
    }
  };

  const handleUploadFavicon = async () => {
    if (!faviconFile) {
      toast.warning("Please select a favicon file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("fav_icon", faviconFile);

    try {
      await updateFaviconMutation({ payload: formData }).unwrap();

      Swal.fire({
        title: "Success",
        text: "Favicon updated successfully!",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
      });

      setFaviconFile(null);
      setFaviconPreview(appearanceData?.fav_icon || "");
      if (faviconInputRef.current) faviconInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to update favicon", error);
      toast.error("Failed to update favicon");
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

  const handleFontChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSelectedFont(value);
  };

  const handleApplyFont = async () => {
    if (!selectedFont) {
      toast.warning("Please select a font to apply");
      return;
    }

    try {
      await updateFontMutation({
        payload: { font_family: selectedFont },
      }).unwrap();

      Swal.fire({
        title: "Success",
        text: "Font updated successfully!",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Failed to update font", error);
      toast.error("Failed to update font");
    }
  };

  return (
    <Card>
      <CardBody>
        <h5 className="mb-4">Logo & Favicon</h5>

        {/* Font Family Section */}
        <FormGroup className="mb-4">
          <Label className="form-label">Font family</Label>
          <Row className="g-3">
            <Col md="6">
              <div className="d-flex flex-column gap-2">
                <Input
                  type="select"
                  value={selectedFont}
                  onChange={handleFontChange}
                  disabled={isUpdatingFont}
                >
                  <option value="">Select font</option>
                  {fontOptions.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </Input>
                <div className="d-flex gap-2 mt-2">
                  <Button
                    color="primary"
                    onClick={handleApplyFont}
                    disabled={isUpdatingFont || !selectedFont}
                  >
                    {isUpdatingFont ? "Applying..." : "Apply Font"}
                  </Button>
                </div>
                <small className="text-muted">
                  Choose one of the available fonts for the application.
                </small>
              </div>
            </Col>
            <Col md="6">
              {selectedFont && (
                <div className="border rounded p-2 bg-dark-light h-100 d-flex align-items-center justify-content-center">
                  <span
                    style={{ fontFamily: selectedFont, fontSize: "1.1rem" }}
                  >
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Nodi neque quae porro facilis laboriosam consectetur ea
                    accusantium inventore dolor amet! ...
                  </span>
                </div>
              )}
            </Col>
          </Row>
        </FormGroup>

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
                  disabled={isUploadingLogo}
                />
                <small className="text-muted">
                  Supported format: PNG (Max 5MB)
                </small>
                <div className="d-flex gap-2 mt-2">
                  <Button
                    color="primary"
                    onClick={handleUploadLogo}
                    disabled={isUploadingLogo || !logoFile}
                  >
                    {isUploadingLogo ? "Uploading..." : "Upload Logo"}
                  </Button>
                  {logoFile && (
                    <Button
                      color="danger"
                      onClick={resetLogo}
                      disabled={isUploadingLogo}
                    >
                      Reset Logo
                    </Button>
                  )}
                </div>
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
                  disabled={isUploadingFavicon}
                />
                <small className="text-muted">
                  Supported formats: PNG, ICO (Max 100KB)
                </small>
                <div className="d-flex gap-2 mt-2">
                  <Button
                    color="primary"
                    onClick={handleUploadFavicon}
                    disabled={isUploadingFavicon || !faviconFile}
                  >
                    {isUploadingFavicon ? "Uploading..." : "Upload Favicon"}
                  </Button>
                  {faviconFile && (
                    <Button
                      color="danger"
                      onClick={resetFavicon}
                      disabled={isUploadingFavicon}
                    >
                      Reset Favicon
                    </Button>
                  )}
                </div>
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

        {/* Individual upload buttons are provided in each section above */}
      </CardBody>
    </Card>
  );
};

export default LogoAndFavIconAndFontChanger;
