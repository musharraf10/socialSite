import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AlertMessage from "../Alert/AlertMessage";

const CheckoutForm = () => {
  const { planId } = useParams();
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientSecret, setClientSecret] = useState(null);
  const [processing, setProcessing] = useState(false);
  const BackendServername = import.meta.env.VITE_BACKENDSERVERNAME;

  // Fetch plan details
  useEffect(() => {
    const fetchPlanDetails = async () => {
      try {
        console.log("plan", planId)
        const { data } = await axios.get(`${BackendServername}/plans/${planId}`,{
          withCredentials:true
        });
        setPlanData(data);
      } catch (error) {
        console.error("Error fetching plan:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlanDetails();
  }, [planId]);

  console.log("data", planData)
  // Fetch payment intent
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data } = await axios.post(`${BackendServername}/stripe/create-payment`, { planId },{
          withCredentials:true
        });
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    };
    if (planId) createPaymentIntent();
  }, [planId]);

  // Handle payment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!elements || !stripe || processing) return;

    setProcessing(true);
    const { error: submitErr } = await elements.submit();
    if (submitErr) {
      setErrorMessage(submitErr.message);
      setProcessing(false);
      return;
    }

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: "http://localhost:5173/success",
        },
      });
      if (error) setErrorMessage(error.message);
    } catch (error) {
      setErrorMessage(error?.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="bg-gray-900 h-screen flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="w-96 mx-auto my-4 p-6 bg-white rounded-lg shadow-md"
      >
        {/* Show loading */}
        {loading ? (
          <p className="text-gray-700 text-center">Loading plan details...</p>
        ) : (
          <div className="mb-4 text-center">
            <h2 className="text-lg font-semibold">{planData?.name}</h2>
            <p className="text-gray-600 text-sm">
              {planData?.billingCycle === "monthly" ? "Monthly Plan" : "Yearly Plan"}
            </p>
            <p className="text-xl font-bold text-green-600">${planData?.price}</p>
          </div>
        )}

        {/* Stripe payment element */}
        <div className="mb-4">
          <PaymentElement />
        </div>

        {/* Display errors */}
        {errorMessage && <AlertMessage type="error" message={errorMessage} />}

        {/* Pay button */}
        <button
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={processing}
        >
          {processing ? "Processing..." : `Pay $${planData?.price}`}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
