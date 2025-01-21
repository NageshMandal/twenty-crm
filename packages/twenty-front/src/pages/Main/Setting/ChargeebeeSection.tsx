import React, { useEffect } from "react";
import { toast } from "react-toastify";

import Button from "src/components/base/Button";
import axios from "src/utils/functions/axios";

declare global {
  interface Window {
    Chargebee: any;
    cbInstance: any;
  }
}

const ChargeebeeSection: React.FC = () => {
  const handleOpenPortal = async () => {
    try {
      // Create chargebee portal
      // const cbPortal = window.cbInstance.createChargebeePortal();
      // const cbPortal = window.cbInstance.setPortalSession(function () {
      //   // We will discuss on how to implement this end point below.
      //   return $.ajax({
      //     url: "/chargebee/self-service-portal",
      //     method: "POST",
      //     data: data,
      //   });
      // });
      // // Open portal
      // cbPortal.open();
      // Make a POST request to your backend endpoint to create the portal session
      // const response = await axios(true).post(
      //   `${process.env.REACT_APP_DEMAND_API_URL}/chargebee/self-service-portal`,
      //   {}
      // ); // Replace `data` with your actual data
      // const sessionData = response as any;
      // console.log("sessionData: ", sessionData);

      // const cbPortal = await window.cbInstance.createChargebeePortal();
      await window.cbInstance.setPortalSession(async () => {
        // we have used axios for performing http requests
        // Hit your end point that returns portal session object as response
        // This sample end point will call the below api
        // https://apidocs.chargebee.com/docs/api/portal_sessions#create_a_portal_session
        return axios(true)
          .post(`${process.env.REACT_APP_DEMAND_API_URL}/chargebee/self-service-portal`, {})
          .then((response) => response);
      });

      // Open the portal
      // cbPortal.open();
      await window.cbInstance.createChargebeePortal().open();
    } catch (error) {
      console.log(error);
      toast.error(
        "Failed to open customer portal. Please try again later." + JSON.stringify(error)
      );
      // console.log("error: ", error);
    }
  };

  return (
    <div className='title-1'>
      <div className='flex flex-col gap-20 pt-20'>
        <Button
          type='button'
          className='w-full'
          buttonClassName='pt-16'
          buttonStyle={"primary"}
          onClick={handleOpenPortal}
        >
          Manage Subscription / Upgrade / Cancelation
        </Button>
      </div>
    </div>
  );
};

export default ChargeebeeSection;
