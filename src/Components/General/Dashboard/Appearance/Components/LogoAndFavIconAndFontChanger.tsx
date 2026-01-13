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
  const [updateFontMutation, { isLoading: isUpdatingFont }] =
    useUpdateAppearanceMutation();
  const [updateLogoMutation, { isLoading: isUploadingLogo }] =
    useUpdateAppearanceMutation();
  const [deleteLogoMutation, { isLoading: isDeletingLogo }] =
    useUpdateAppearanceMutation();
  const [updateFaviconMutation, { isLoading: isUploadingFavicon }] =
    useUpdateAppearanceMutation();
  const [deleteFaviconMutation, { isLoading: isDeletingFavicon }] =
    useUpdateAppearanceMutation();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [faviconPreview, setFaviconPreview] = useState<string>("");
  const [selectedFont, setSelectedFont] = useState<string>("");

  type FontOption = {
    value: string;
    label: string;
    cssFamily: string;
  };

  // Must stay in sync with backend AppearanceFontFamilyType (enum values)
  const fontOptions: FontOption[] = [
    {
      value: "ROBOTO",
      label: "Roboto",
      cssFamily: "'Roboto', system-ui, -apple-system, 'Segoe UI', sans-serif",
    },
    {
      value: "POPPINS",
      label: "Poppins",
      cssFamily: "'Poppins', system-ui, -apple-system, 'Segoe UI', sans-serif",
    },
    {
      value: "PLAYFAIR_DISPLAY",
      label: "Playfair Display",
      cssFamily: "'Playfair Display', 'Times New Roman', serif",
    },
    {
      value: "RALEWAY",
      label: "Raleway",
      cssFamily: "'Raleway', system-ui, -apple-system, 'Segoe UI', sans-serif",
    },
    {
      value: "SATISFY",
      label: "Satisfy",
      cssFamily: "'Satisfy', 'Comic Sans MS', cursive",
    },
    {
      value: "KARLA",
      label: "Karla",
      cssFamily: "'Karla', system-ui, -apple-system, 'Segoe UI', sans-serif",
    },
    {
      value: "MONTSERRAT",
      label: "Montserrat",
      cssFamily:
        "'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif",
    },
    {
      value: "INTER",
      label: "Inter",
      cssFamily: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
    },
    {
      value: "CAVEAT",
      label: "Caveat",
      cssFamily: "'Caveat', 'Comic Sans MS', cursive",
    },
    {
      value: "OPEN_SANS",
      label: "Open Sans",
      cssFamily:
        "'Open Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
    },
  ];

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
  const handleFaviconChange = async (e: ChangeEvent<HTMLInputElement>) => {
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

      // Validate file size (max 50KB for fav_icon)
      if (file.size > 50 * 1024) {
        toast.error("Favicon file size must be less than 50KB");
        return;
      }

      // Validate image dimensions (max 32x32 px). Some ICO files may not load in Image,
      // so for ICOs we'll skip strict dimension failure if the browser can't parse it.
      try {
        const objectUrl = URL.createObjectURL(file);
        const img = new Image();
        const canValidateDimensions = await new Promise<boolean>(
          (resolve, reject) => {
            img.onload = () => {
              const valid = img.width <= 48 && img.height <= 48;
              URL.revokeObjectURL(objectUrl);
              if (!valid) reject(new Error("dimensions"));
              else resolve(true);
            };
            img.onerror = () => {
              URL.revokeObjectURL(objectUrl);
              // If ICO failed to load, resolve false so we can decide to allow with a warning
              resolve(false);
            };
            img.src = objectUrl;
          }
        );

        if (!canValidateDimensions && isPng) {
          // PNG should be loadable; if not, treat as an error
          toast.error(
            "Failed to validate favicon image dimensions. Please ensure it's 48x48 px."
          );
          return;
        }

        if (canValidateDimensions === true) {
          // dimensions already checked in onload
        }
      } catch (err) {
        if ((err as Error).message === "dimensions") {
          toast.error("Favicon dimensions must be at most 48x48 pixels");
          return;
        }
        // Other errors fallthrough with a generic message
        toast.error(
          "Failed to validate favicon image. Please ensure it's a valid image (48x48 px, PNG or ICO)."
        );
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

  const handleDeleteLogo = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will remove the current logo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      try {
        await deleteLogoMutation({ payload: { logo: null } }).unwrap();

        Swal.fire({
          title: "Deleted",
          text: "Logo deleted successfully!",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
        });

        setLogoFile(null);
        setLogoPreview("");
        if (logoInputRef.current) logoInputRef.current.value = "";
      } catch (error) {
        console.error("Failed to delete logo", error);
        toast.error("Failed to delete logo");
      }
    }
  };

  const handleDeleteFavicon = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will remove the current favicon.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      try {
        await deleteFaviconMutation({ payload: { fav_icon: null } }).unwrap();

        Swal.fire({
          title: "Deleted",
          text: "Favicon deleted successfully!",
          icon: "success",
          timer: 2000,
          timerProgressBar: true,
        });

        setFaviconFile(null);
        setFaviconPreview("");
        if (faviconInputRef.current) faviconInputRef.current.value = "";
      } catch (error) {
        console.error("Failed to delete favicon", error);
        toast.error("Failed to delete favicon");
      }
    }
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
        <h5 className="mb-4">Font, Logo & Favicon</h5>

        {/* Font Family Section */}
        <FormGroup className="mb-5">
          <Label className="form-label">Font family</Label>
          <Row className="g-3">
            <Col md="6">
              <div className="d-flex flex-column gap-2">
                <Input
                  type="select"
                  value={selectedFont}
                  onChange={handleFontChange}
                  disabled={isUpdatingFont}
                  style={{
                    fontFamily: fontOptions.find(
                      (f) => f.value === selectedFont
                    )?.cssFamily,
                  }}
                >
                  <option value="">Select font</option>
                  {fontOptions.map((font) => (
                    <option
                      key={font.value}
                      value={font.value}
                      style={{ fontFamily: font.cssFamily }}
                    >
                      {font.label}
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
                <div
                  className="border rounded p-2 bg-dark-light d-flex align-items-center justify-content-center"
                  style={{
                    maxHeight: "100px",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      fontFamily:
                        fontOptions.find((f) => f.value === selectedFont)
                          ?.cssFamily || selectedFont,
                      fontSize: "1.1rem",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Error, atque...
                  </span>
                </div>
              )}
            </Col>
          </Row>
        </FormGroup>

        {/* Logo Upload Section */}
        <FormGroup className="mb-5">
          <Label className="form-label">
            Logo{" "}
            <small className="text-warning">
              (Preferred resolution: 420x150 px)
            </small>{" "}
          </Label>
          <Row className="g-3">
            <Col md="6">
              <div
                className="d-flex align-items-center gap-2 border rounded p-2"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <Input
                  innerRef={logoInputRef}
                  type="file"
                  accept=".png,image/png"
                  onChange={handleLogoChange}
                  disabled={isUploadingLogo}
                  style={{ display: "none" }}
                />
                <Button
                  color="secondary"
                  onClick={() => logoInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  style={{ whiteSpace: "nowrap" }}
                >
                  Choose File
                </Button>
                <span
                  className="text-muted"
                  style={{
                    fontSize: "0.9rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                  }}
                >
                  {logoFile
                    ? logoFile.name
                    : appearanceData?.logo
                    ? appearanceData.logo.split("/").pop()
                    : "No file chosen"}
                </span>
              </div>
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
                {(appearanceData?.logo || logoPreview) && !logoFile && (
                  <Button
                    color="danger"
                    onClick={handleDeleteLogo}
                    disabled={isDeletingLogo}
                  >
                    {isDeletingLogo ? "Deleting..." : "Delete Logo"}
                  </Button>
                )}
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
                    style={{ height: "100px", maxWidth: "100%" }}
                  />
                </div>
              )}
            </Col>
          </Row>
        </FormGroup>

        {/* Favicon Upload Section */}
        <FormGroup className="mb-5">
          <Label className="form-label">
            Favicon{" "}
            <small className="text-warning">(Max resolution: 48x48 px)</small>
          </Label>
          <Row className="g-3">
            <Col md="6">
              <div
                className="d-flex align-items-center gap-2 border rounded p-2"
                style={{ backgroundColor: "#f8f9fa" }}
              >
                <Input
                  innerRef={faviconInputRef}
                  type="file"
                  accept=".png,.ico,image/png"
                  onChange={handleFaviconChange}
                  disabled={isUploadingFavicon}
                  style={{ display: "none" }}
                />
                <Button
                  color="secondary"
                  onClick={() => faviconInputRef.current?.click()}
                  disabled={isUploadingFavicon}
                  style={{ whiteSpace: "nowrap" }}
                >
                  Choose File
                </Button>
                <span
                  className="text-muted"
                  style={{
                    fontSize: "0.9rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                  }}
                >
                  {faviconFile
                    ? faviconFile.name
                    : appearanceData?.fav_icon
                    ? appearanceData.fav_icon.split("/").pop()
                    : "No file chosen"}
                </span>
              </div>
              <small className="text-muted">
                Supported formats: PNG, ICO (Max 50KB)
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
                {(appearanceData?.fav_icon || faviconPreview) &&
                  !faviconFile && (
                    <Button
                      color="danger"
                      onClick={handleDeleteFavicon}
                      disabled={isDeletingFavicon}
                    >
                      {isDeletingFavicon ? "Deleting..." : "Delete Favicon"}
                    </Button>
                  )}
              </div>
            </Col>
            <Col md="6">
              {faviconPreview && (
                <div
                  className="border rounded p-2 bg-light text-center"
                  style={{ maxHeight: "100px" }}
                >
                  <img
                    src={faviconPreview}
                    alt="Favicon Preview"
                    style={{ maxHeight: "80px", maxWidth: "100%" }}
                  />
                </div>
              )}
            </Col>
          </Row>
        </FormGroup>
      </CardBody>
    </Card>
  );
};

export default LogoAndFavIconAndFontChanger;
