import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "../Admin/Content-Management/postdetailmodal.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { CreditCard, Package } from "lucide-react";
import axios from "axios";

export default function AddPlanPopup({
  plandetails,
  show,
  onHide,
  refreshdata,
}) {
  const BackendServername = import.meta.env.VITE_BACKENDSERVERNAME;
  console.log(plandetails);

  const [planName, setPlanName] = useState("");
  const [features, setFeatures] = useState("");
  const [price, setPrice] = useState("");
  const [billingcycle, setbillingcycle] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Populate form if editing existing plan
  useEffect(() => {
    if (plandetails._id) {
      setPlanName(plandetails.planName || "");
      setFeatures(plandetails.features || "");
      setPrice(plandetails.price || "");
      setbillingcycle(plandetails.billingcycle || "");
    }
  }, [plandetails]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Convert price to a number and validate
    const numericPrice = Number(price);

    if (isNaN(numericPrice) || numericPrice <= 0) {
      alert("Price must be a valid number greater than zero");
      return;
    }

    setLoading(true);
    setMessage(null);
    const featuresArray = Array.isArray(features)
      ? features
      : (features || "").split(",").map((feature) => feature.trim());
    const planData = {
      planName,
      features: featuresArray,
      price: Number(price),
    };

    console.log(planData);

    try {
      if (plandetails && plandetails._id) {
        // Update existing plan
        const response = await axios.patch(
          `${BackendServername}/plans/${plandetails._id}`,
          planData,
          { withCredentials: true }
        );

        console.log("updated plan", response.data);
        alert("Plan updated successfully");
        refreshdata();

        // Close the modal
        onHide();
      } else {
        // Create new plan
        const response = await axios.post(
          `${BackendServername}/plans/create`,
          planData,
          { withCredentials: true }
        );

        console.log("added plan", response.data);
        alert("Plan added successfully");
      }

      onHide();
      refreshdata();
    } catch (error) {
      console.error("Error submitting data:", error);

      if (error.response && error.response.data && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert( `There was an error ${plandetails ? "updating" : "creating"} the plan.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      className="postdetailsmodal text-capitalize"
      show={show}
      onHide={onHide}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {plandetails._id ? "Update Plan" : "Create Subscription Plan"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="postdetailsmodalbody">
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <div className="px-8 py-6 bg-blue-900 text-white">
                <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                  <Package className="w-6 text-white  h-6" />{" "}
                  <h5 className="text-white">

                  {plandetails._id ? "Update Plan" : "Create Subscription Plan"}
                  </h5>
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="px-8 py-6 space-y-6">
                {loading && <p>Loading, please wait...</p>}
                {message && <p>{message}</p>}
                <div>
                  <label className="block text-sm font-medium  mb-2">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-3 rounded-lg border"
                    placeholder="e.g., Free, Basic, Platinum"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features (comma separated)
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-3 rounded-lg border"
                    placeholder="e.g., Feature 1, Feature 2, Feature 3"
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Billing Cycle
                  </label>
                  <select
                    className="block w-full px-4 py-3 rounded-lg border"
                    value={billingcycle}
                    onChange={(e) => setbillingcycle(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select Billing Cycle
                    </option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Price
                  </label>
                  <input
                    type="number"
                    className="block w-full px-4 py-3 rounded-lg border"
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-900 text-white px-6 py-3 rounded-lg"
                  disabled={loading}
                >
                  {loading
                    ? plandetails._id
                      ? "Updating Plan..."
                      : "Creating Plan..."
                    : plandetails._id
                    ? "Update Plan"
                    : "Create Plan"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}
