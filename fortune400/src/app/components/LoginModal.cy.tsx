import React from "react";
import { mount } from "cypress/react";
import LoginModal from "@/app/components/LoginModal";
import SuccessModal from "@/app/components/SuccessModal";

describe("LoginModal Component", () => {
  it("renders correctly when open", () => {
    const onCloseMock = cy.stub();
    mount(<LoginModal open={true} onClose={onCloseMock} />);
    cy.contains("Log In").should("be.visible");
    cy.get("input[name='email']").should("exist");
    cy.get("input[name='password']").should("exist");
  });

  it("calls onClose when close button is clicked", () => {
    const onCloseMock = cy.stub();
    mount(<LoginModal open={true} onClose={onCloseMock} />);
    cy.get("button").contains("×").click();
    cy.wrap(onCloseMock).should("have.been.calledOnce");
  });

  it("displays success message on successful login", () => {
    const onCloseMock = cy.stub();

    // Stub the fetch call for the API
    cy.stub(window, "fetch")
      .withArgs("/api/getCustomer")
      .resolves({
        json: () =>
          Promise.resolve({
            customer: { firstName: "John", lastName: "Doe", cID: "123" },
          }),
      });

    mount(<LoginModal open={true} onClose={onCloseMock} />);
    cy.get("input[name='email']").type("test@example.com");
    cy.get("input[name='password']").type("password123");
    cy.get("button[type='submit']").click();

    cy.contains("Welcome back, John!").should("be.visible");
  });

  it("displays error message on failed login", () => {
    const onCloseMock = cy.stub();

    // Stub the fetch call to simulate a failure
    cy.stub(window, "fetch").rejects(new Error("Login failed"));

    mount(<LoginModal open={true} onClose={onCloseMock} />);
    cy.get("input[name='email']").type("test@example.com");
    cy.get("input[name='password']").type("wrongpassword");
    cy.get("button[type='submit']").click();

    cy.contains("Unable to sign in").should("be.visible");
  });

  it("closes SuccessModal when close button is clicked", () => {
    const onCloseMock = cy.stub();
    mount(
      <SuccessModal
        message="Welcome back, John!"
        onClose={onCloseMock}
      />
    );
    cy.contains("Welcome back, John!").should("be.visible");
    cy.get("button").contains("×").click();
    cy.wrap(onCloseMock).should("have.been.calledOnce");
  });
});