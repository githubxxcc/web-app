import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./ElectionReminder.scss";

export default function ElectionReminder() {
  //get the information for the challenger who referred the player
  const location = useLocation();
  /*get the referring challenger's id from the query params. This logic should really be called only when a player initially lands on the web page,
  and then saved in context. The only time a challenger's id (or a hash of it), should appear as a param in the URL is the initial link generated by the challenger. 
  Just leaving this here since it's a good blueprint for how to get that information from the shared link so that it can then be saved in context.*/
  const uid = location.search.split("?referrer=")[1];

  //get the information for the user
  const { currentUser } = useAuth();

  const onSubmit = (
    firstNameInput,
    lastNameInput,
    addressLine1Input,
    zipCodeInput,
    emailAddressInput
  ) => {
    if (
      !firstNameInput.value ||
      !lastNameInput.value ||
      !addressLine1Input.value ||
      !zipCodeInput.value.match(/^[0-9]{5}(?:-[0-9]{4})?$/) ||
      !emailAddressInput.value.match(
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
      )
    ) {
      console.log("Please complete all of the required fields.");
      return;
    } else {
      //make a call to a firebase function to update referring challenger's record
      //make a call to a firebase function to update the player's record if the player is a challenger
      console.log("This is where the attributable actions will be called.");
    }
  };

  useEffect(() => {
    //first set up an observer to listen for mutations to the ngp-form div
    const targetNode = document.getElementsByClassName("ngp-form")[0];

    // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true, subtree: true };

    //callback function that the observer will invoke upon observed mutations
    const mutationCallback = (mutationsList, observer) => {
      //empty variables to hold input elements
      let firstNameInput,
        lastNameInput,
        addressLine1Input,
        zipCodeInput,
        emailAddressInput,
        submitBtn,
        thankYouDiv;

      //when changes to the DOM occur, loop through them and check if the appropriate inputs have been created
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          firstNameInput = document.getElementsByName("FirstName")[0];
          lastNameInput = document.getElementsByName("LastName")[0];
          addressLine1Input = document.getElementsByName("AddressLine1")[0];
          zipCodeInput = document.getElementsByName("PostalCode")[0];
          emailAddressInput = document.getElementsByName("EmailAddress")[0];
          submitBtn = document.getElementsByClassName("at-submit")[0];
          thankYouDiv = document.getElementsByClassName("thankYou")[0];

          //if all input elements have loaded
          if (
            firstNameInput &&
            lastNameInput &&
            addressLine1Input &&
            zipCodeInput &&
            emailAddressInput &&
            submitBtn
          ) {
            //a back button and recaptcha could be added to the DOM here
            //attach the onsubmit function to the submit button
            submitBtn.onclick = () =>
              onSubmit(
                firstNameInput,
                lastNameInput,
                addressLine1Input,
                zipCodeInput,
                emailAddressInput
              );
          }

          //if the thankYouDiv has been created, the user has successfully submitted the form.
          if (thankYouDiv) {
            const fbShareBtn = document.getElementById("fbShareBtn");
            const twShareBtn = document.getElementById("twShareBtn");
            if (fbShareBtn) fbShareBtn.remove(); //for now remove these share buttons as they do not share the 8by8 challenge link
            if (twShareBtn) twShareBtn.remove();
          }
        }
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(mutationCallback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    /*dynamically load the RTV script once the page is rendered and the observer instance is created, 
    so the RTV script can find the ngp-form div and the observer is listening for DOM changes*/
    const rtvScript = document.createElement("script");
    rtvScript.src = "https://d1aqhv4sn5kxtx.cloudfront.net/actiontag/at.js";
    document.body.appendChild(rtvScript);

    //when the page unmounts, remove the script so it can be loaded again when the component mounts again
    return () => {
      rtvScript.remove();
    };
  }, []);

  //if the player has already set up an election reminder, this should instead return a message indicating that this action is already complete
  return (
    <div
      class="ngp-form"
      data-form-url="https://actions.everyaction.com/v1/Forms/7VylZ7q7eEGLlwKVNb-MqQ2"
      data-fastaction-endpoint="https://fastaction.ngpvan.com"
      data-inline-errors="true"
      data-fastaction-nologin="true"
      data-databag="everybody"
    ></div>
  );
}