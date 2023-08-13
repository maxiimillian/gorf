import HandlerResponse from '@/types/handlerResponse';
import { modelFunction } from '../routes/router';
import { successResponse, errorResponse } from '../response';

// Handles promise and response creation database interactions that
// don't need any extra steps
export function defaultModelHandler(modelPromise: Promise<any>, includeData = true) {
  return new Promise((resolve, reject) => {
    modelPromise
      .then(modelResponse => {
        resolve({ success: true, data: modelResponse });
      })
      .catch(err => {
        const failedResponse = { ...errorResponse };
        failedResponse.data = { message: err.toString() };
        resolve(failedResponse);
      });
  });
}

// Default handler function for routes that don't need
// anything extra besides querying the db
export function defaultHandler(modelFunction: modelFunction, ...args: any) {
  const modelPromise = modelFunction(...args);
  return defaultModelHandler(modelPromise);
}
