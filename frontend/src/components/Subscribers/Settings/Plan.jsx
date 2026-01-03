import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import { getUserPlanAPI } from "../../../APIServices/stripe/plans";

export default function Plan() {
  const [plan, setPlan] = useState({
    planName: "Loading...",
    price: "Loading...",
    expirationDate: "Loading...",
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["userPlan"],
    queryFn: getUserPlanAPI,
  });

  useEffect(() => {
    if (data) {
      setPlan({
        planName: data.plan.planName || "No Plan",
        price: data.plan.price ? `$${data.plan.price}` : "0",
        expirationDate: data.plan.expirationDate ? new Date(data.plan.expirationDate).toISOString().split("T")[0] : "N/A",
      });
    }
  }, [data]); 

  const isExpiringSoon = () => {
    if (!data?.plan?.expirationDate) return false; 

    const today = new Date();
    const renewalDate = new Date(data.plan.expirationDate); 
    const diffTime = renewalDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays <= 10
  };

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Failed to load plan</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography level="h3">Current Plan Details</Typography>
      <Card sx={{ p: 3 }}>
        <FormControl>
          <FormLabel>Plan Name</FormLabel>
          <Input value={plan.planName} readOnly />
        </FormControl>
        <FormControl sx={{ mt: 2 }}>
          <FormLabel>Price</FormLabel>
          <Input value={plan.price} readOnly />
        </FormControl>
        <FormControl sx={{ mt: 2 }}>
          <FormLabel>Expiration Date</FormLabel>
          <Input value={plan.expirationDate} readOnly />
        </FormControl>
        {isExpiringSoon() && (
          <Typography sx={{ color: "red", mt: 2 }}>
            Your plan is expiring within 10 days! Renew now.
          </Typography>
        )}
        <Button className="bg-success" sx={{ mt: 2 }} onClick={() => console.log("Buying plan...")}>
         {isExpiringSoon() ? "Renew now" : "Your plan is active"}
        </Button>
      </Card>
    </Box>
  );
}