import React, { useState } from "react";
import { TbCalendar } from "react-icons/tb";
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

const ScheduleSocialPost: React.FC = () => {
  // State for form inputs
  const [postContent, setPostContent] = useState<string>("");
  const [hashtags, setHashtags] = useState<string>("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");

  // Handle platform selection
  const handlePlatformChange = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  return (
    <Card>
      <CardBody>
        <div className="mb-3">
          <h3>
            <TbCalendar className="me-1" />
            Schedule Social Post
          </h3>
          <small>Create and schedule posts across multiple platforms</small>
        </div>
        <Form>
          {/* Post Content */}
          <FormGroup>
            <Label for="postContent">Post Content</Label>
            <Input
              type="textarea"
              name="postContent"
              id="postContent"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
            <small>
              {postContent.length}/2200 characters{" "}
              <span className="text-muted">(Platform limits vary)</span>
            </small>
          </FormGroup>

          {/* Hashtags */}
          <FormGroup>
            <Label for="hashtags">Hashtags</Label>
            <Input
              type="text"
              name="hashtags"
              id="hashtags"
              value={hashtags}
              placeholder="#mortgage #property #finance"
              onChange={(e) => setHashtags(e.target.value)}
            />
          </FormGroup>

          {/* Platforms */}
          <FormGroup>
            <Label>Platforms</Label>
            <div className="d-flex justify-content-between px-3">
              <div>
                {/* Facebook */}
                <div className="form-check">
                  <Input
                    type="checkbox"
                    id="facebook"
                    checked={selectedPlatforms.includes("facebook")}
                    onChange={() => handlePlatformChange("facebook")}
                  />
                  <Label check htmlFor="facebook">
                    <i className="fab fa-facebook-square me-1"></i> Facebook
                  </Label>
                </div>

                {/* LinkedIn */}
                <div className="form-check">
                  <Input
                    type="checkbox"
                    id="linkedin"
                    checked={selectedPlatforms.includes("linkedin")}
                    onChange={() => handlePlatformChange("linkedin")}
                  />
                  <Label check htmlFor="linkedin">
                    <i className="fab fa-linkedin-in me-1"></i> LinkedIn
                  </Label>
                </div>
              </div>
              <div>
                {/* Instagram */}
                <div className="form-check">
                  <Input
                    type="checkbox"
                    id="instagram"
                    checked={selectedPlatforms.includes("instagram")}
                    onChange={() => handlePlatformChange("instagram")}
                  />
                  <Label check htmlFor="instagram">
                    <i className="fab fa-instagram me-1"></i> Instagram
                  </Label>
                </div>

                {/* Twitter */}
                <div className="form-check">
                  <Input
                    type="checkbox"
                    id="twitter"
                    checked={selectedPlatforms.includes("twitter")}
                    onChange={() => handlePlatformChange("twitter")}
                  />
                  <Label check htmlFor="twitter">
                    <i className="fab fa-twitter me-1"></i> Twitter
                  </Label>
                </div>
              </div>
            </div>
          </FormGroup>

          {/* Date and Time */}
          <div className="row">
            <div className="col-md-6">
              <FormGroup>
                <Label for="date">Date</Label>
                <Input
                  type="date"
                  name="date"
                  id="date"
                  value={date}
                  className="p-2"
                  onChange={(e) => setDate(e.target.value)}
                />
              </FormGroup>
            </div>
            <div className="col-md-6">
              <FormGroup>
                <Label for="time">Time</Label>
                <Input
                  type="time"
                  name="time"
                  id="time"
                  value={time}
                  className="p-2"
                  onChange={(e) => setTime(e.target.value)}
                />
              </FormGroup>
            </div>
          </div>

          {/* Media Options */}
          <div className="d-flex gap-2 mt-3">
            <Button color="dark" className="btn-sm">
              <i className="fas fa-image me-1"></i> Add Image
            </Button>
            <Button color="success" className="btn-sm">
              <i className="fas fa-video me-1"></i> Add Video
            </Button>
            <Button color="secondary" className="btn-sm">
              <i className="far fa-laugh-beam me-1"></i> Emoji
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <Button outline color="secondary" className="w-75">
              <i className="fas fa-clock me-1"></i> Schedule Post
            </Button>
            <Button color="dark" className="ms-2 w-25">
              Post Now
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default ScheduleSocialPost;
