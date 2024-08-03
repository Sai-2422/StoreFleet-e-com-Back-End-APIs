import ProductModel from "./product.schema.js";

export const addNewProductRepo = async (product) => {
  return await new ProductModel(product).save();
};

export const getAllProductsRepo = async () => {
  return await ProductModel.find({});
};

export const updateProductRepo = async (_id, updatedData) => {
  return await ProductModel.findByIdAndUpdate(_id, updatedData, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });
};

export const deleProductRepo = async (_id) => {
  return await ProductModel.findByIdAndDelete(_id);
};

export const getProductDetailsRepo = async (_id) => {
  return await ProductModel.findById(_id);
};

export const getTotalCountsOfProduct = async () => {
  return await ProductModel.countDocuments();
};

export const findProductRepo = async (productId) => {
  return await ProductModel.findById(productId);
};

// This function is responsible for the keyword search and pagination limit
export const findProductByFilter = async (filterQuery, page, pageLimit) => {
  try {
    const skip = (page - 1) * pageLimit;
    const products = await ProductModel.find(filterQuery)
      .skip(skip)
      .limit(pageLimit);
    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Reduce the stock after placing the order
export const reduceStockRepo = async (productID, orderQty, session) => {
  try {
    const reduceQty = await findProductRepo(productID);
    reduceQty.stock -= orderQty;
    await reduceQty.save({ session }); // Pass session to the save method
    return;
  } catch (error) {
    throw new ErrorHandler(500, "Something went wrong with database"); // Throw the error to handle it in the calling function
  }
};
