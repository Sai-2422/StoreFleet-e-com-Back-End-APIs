import OrderModel from "./order.schema.js";

export const createNewOrderRepo = async (data, session) => {
  return await OrderModel.create([data], { session }); // Pass session to the create method
};
