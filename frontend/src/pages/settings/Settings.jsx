import React from "react";
import { Container, Tabs, Tab } from "react-bootstrap";
import { Person, CreditCard } from "react-bootstrap-icons";

import ProfileLayout from "../../components/layout/profilelayout";
import BillingLayout from "../../components/layout/BillingLayout";

const Settings = () => {
  return (
    <div className="mx-4"
      style={{
        background: "#020817",
        minHeight: "100vh",
        padding: "40px 0",
        color: "#fff",
      }}
    >
      <Container fluid="lg">
        {/* Header */}
        <div className="mb-4">
          <h1 className="fw-bold">Account Settings</h1>
          <p className="text-secondary">
            Manage your developer profile, verified identification, and plan
            subscriptions
          </p>
        </div>

        <Tabs
          defaultActiveKey="profile"
          id="settings-tabs"
          className="settings-tabs mb-4 border-0"
        >
          <Tab
            eventKey="profile"
            title={
              <>
                <Person className="me-2" />
                My Profile
              </>
            }
          >
            <ProfileLayout />
          </Tab>

          <Tab
            eventKey="billing"
            title={
              <>
                <CreditCard className="me-2" />
                Billing & Payments
              </>
            }
          >
            <BillingLayout />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default Settings;