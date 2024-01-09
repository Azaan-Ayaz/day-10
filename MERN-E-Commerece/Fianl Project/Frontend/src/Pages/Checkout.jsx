import { useEffect, useState } from "react";

import axios from "axios";
// import "./App.css";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const MainApp = () => {
  const [stripeApiKey, setStripeApiKey] = useState("");
  async function getStripApiKey() {
    const { data } = await axios.get("http://localhost:8080/payment-api");
    setStripeApiKey(data.stripeApiKey);
  }
  useEffect(() => {
    getStripApiKey();
  }, []);

  return (
    <>
      {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <App />
        </Elements>
      )}
    </>
  );
};
function App() {
  const options = {
    style: {
      base: {
        fontSize: "16px",
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };
  const user = {
    name: "Ahmed",
    email: "Ok@gmail.com",
  };

  const elements = useElements();
  const totalPrice = 20;
  const stripe = useStripe();
  const submitHandler = async (e) => {
    e.preventDefault();

    const paymentData = {
      amount: Math.round(totalPrice * 100),
    };
    const paymentResponse = await axios.post(
      "http://localhost:8080/payment",
      paymentData
    );
    const clientSecret = paymentResponse.data.client_secret;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardNumberElement),
        billing_details: {
          name: user.name,
          email: user.email,
        },
      },
    });
    console.log(result);
    alert(JSON.stringify(result));
  };

  return (
    <>
      <form className="shadow-lg" onSubmit={submitHandler}>
        <h1 className="mb-4">Card Info</h1>
        <div className="form-group">
          <label htmlFor="card_num_field">Card Number</label>
          <CardNumberElement
            type="text"
            id="card_num_field"
            className="form-control"
            options={options}
          />
        </div>

        <div className="form-group">
          <label htmlFor="card_exp_field">Card Expiry</label>
          <CardExpiryElement
            type="text"
            id="card_exp_field"
            className="form-control"
            options={options}
          />
        </div>

        <div className="form-group">
          <label htmlFor="card_cvc_field">Card CVC</label>
          <CardCvcElement
            type="text"
            id="card_cvc_field"
            className="form-control"
            options={options}
          />
        </div>

        <button id="pay_btn" type="submit" className="btn btn-block py-3">
          Pay {` - ${totalPrice}`}
        </button>
      </form>
    </>
  );
}

export default MainApp;
