import React from 'react';
import { Card, CardBody, Badge, Row, Col } from 'reactstrap';
import { FileText } from 'react-feather';

interface Document {
  title: string;
  company: string;
  updatedTime: string;
  status: 'Approved' | 'Pending Review' | 'In Progress';
}

const DocumentStatus: React.FC = () => {
  const documents: Document[] = [
    {
      title: 'Investment Proposal - Tech Solutions',
      company: 'Tech Solutions Ltd',
      updatedTime: '1 hour ago',
      status: 'Approved'
    },
    {
      title: 'Risk Assessment - Global Investments',
      company: 'Global Investments',
      updatedTime: '3 hours ago',
      status: 'Pending Review'
    },
    {
      title: 'Compliance Report - Innovation Corp',
      company: 'Innovation Corp',
      updatedTime: '1 day ago',
      status: 'In Progress'
    }
  ];

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Pending Review':
        return 'warning';
      case 'In Progress':
        return 'info';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="border-0 shadow-sm mt-4">
      <CardBody>
        <h4 className="mb-4">Document Upload & Status</h4>
        {documents.map((doc, index) => (
          <Row 
            key={index}
            className="mb-3 p-3 bg-light rounded align-items-center"
            style={{ cursor: 'pointer' }}
          >
            <Col xs="auto">
              <div className="bg-white rounded-circle p-2 d-flex align-items-center justify-content-center">
                <FileText size={20} className="text-primary" />
              </div>
            </Col>
            <Col>
              <h5 className="mb-1 text-dark">{doc.title}</h5>
              <small className="text-muted">
                Updated {doc.updatedTime}
              </small>
            </Col>
            <Col xs="auto">
              <Badge 
                color={getStatusColor(doc.status)}
                
                className="px-3 py-2"
              >
                {doc.status}
              </Badge>
            </Col>
          </Row>
        ))}
      </CardBody>
    </Card>
  );
};

export default DocumentStatus;