// Please don't change the pre-written code
// Import the necessary modules here

import mongoose from "mongoose";
import { createNewOrderRepo } from "../model/order.repository.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";
import {
  getProductDetailsRepo,
  reduceStockRepo,
} from "../../product/model/product.repository.js";

export const createNewOrder = async (req, res, next) => {
  const session = await mongoose.startSession(); // Start a Mongoose session
  session.startTransaction(); // Start a transaction

  try {
    const { orderedItems } = req.body;
    let getProducts = {};
    orderedItems.forEach((element) => {
      return (getProducts = element);
    });

    const verifyProduct = await getProductDetailsRepo({
      _id: getProducts.product,
    });
    if (!verifyProduct) {
      return next(new ErrorHandler(404, "Product not found"));
    }

    if (verifyProduct.stock >= getProducts.quantity) {
      req.body.user = req.user;

      const newOrder = await createNewOrderRepo(req.body, session); // Pass session to the repository function
      await reduceStockRepo(getProducts.product, getProducts.quantity, session); // Pass session to the repository function

      await session.commitTransaction(); // Commit the transaction
      session.endSession(); // End the session

      res.status(201).json({
        status: "success",
        msg: "Order has been placed successfully",
        response: newOrder,
      });
    } else {
      return next(new ErrorHandler(500, "Product has no stock."));
    }
  } catch (error) {
    await session.abortTransaction(); // Rollback the transaction if an error occurs
    session.endSession(); // End the session
    console.log(error);
    return next(new ErrorHandler(500, "Something went wrong"));
  }
};
