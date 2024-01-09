const express = require("express");
const stripe = require("stripe")(
  "sk_test_51OKL3aSAycECGZuN6OW8u1mzuF2WjoUJ3smNQNyeAkoWHmsNIJpLLnDMbOSVQo3Lg965DonZiJaPDeVIAUmZsG0e00Zintpvkj"
);
const formidableMiddleware = require("express-formidable"); // <-- Add this line
const { requireSignIn, isAdmin } = require("../middleware/middleware");
const {
  createProductController,
  getProducts,
  getSingleProduct,
  productImageController,
  deleteProduct,
  updateProduct,
  filterController,
  productCount,
  productListController,
  searchProductController,
  relatedProduct,
  paymentMethod,
  getAPI,
} = require("../controller/productController");

const router = express.Router();

router.use(formidableMiddleware());

// Define routes
router.post("/create-product", createProductController);
router.get("/get-product", getProducts);
router.get("/get-product/:slug", getSingleProduct);
router.delete("/delete-product/:id", deleteProduct);
router.put("/update-product/:id", updateProduct);

// filter product
router.post("/product-filter", filterController);

// get Photo
router.get("/product-image/:pid", productImageController);

// product count
router.get("/product-count", productCount);

// product per page
router.get("/product-list/:page", productListController);

// search Product
router.get("/search/:keyword", searchProductController);

// Corrected route definition
router.get("/related-product/:pid/:cid", relatedProduct);

// Payments Route
// token
// router.get("/braintree/token", braintreeTokenController);

// // Payments
// router.post("/payment", braintreePayment);

// Stripe

router.get("/publishable-key", (req, res) => {
  res.json({
    publishable_key:
      "pk_test_51OKL3aSAycECGZuN4OACFsnIEfarWEBNzDFWystkAuc4Bw12ZA9loN6yRBDfs2kzNPV0mbbKVVFJ29tpa6hiiXxD00cKA3nO3k",
  });
});

// router.post("/create-payment-intent", async (req, res) => {
//   try {
//     // Check if the customer 'Amir' exists or create
//     const { price, email, name, address } = req.body;
//     let customer = await stripe.customers.list({ email: email, limit: 1 });

//     if (customer.data.length === 0) {
//       // Customer does not exist, create a new customer
//       customer = await stripe.customers.create({
//         name: name,
//         email: email,
//         address: address,
//       });
//     } else {
//       // Customer already exists, use the existing customer
//       customer = customer.data[0];
//     }

//     // Now create the PaymentIntent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: price * 100,
//       currency: "usd",
//       payment_method_types: ["card"],
//       description: "Tour Booking - City Explorer Package",
//       customer: customer.id, // Use the customer ID, not the name
//       shipping: {
//         name: name,
//         address: {
//           line1: "123 Main St",
//           city: "Cityville",
//           state: "CA",
//           postal_code: "12345",
//           country: "US",
//         },
//       },
//     });

//     // Respond with the client secret
//     res.json({ client_secret: paymentIntent.client_secret });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.post("/payment", paymentMethod);

router.get("/payment-api", getAPI);

module.exports = router;
