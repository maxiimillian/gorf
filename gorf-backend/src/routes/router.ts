import { NextFunction, Request, Response, Router } from 'express';
import HandlerResponse from '@/types/handlerResponse';
import { defaultHandler } from '../handlers/handler';
import { successResponse } from '../response';
import { errorResponse } from '../response';

export type handlerFunction = (...args: any) => Promise<any>;
export type modelFunction = (...args: any) => Promise<any>;
export type middlewareFunction = (req: Request, res: Response, next: NextFunction) => {};

export interface defaultRoute {
  path: string;
  args?: any[];
  message: string;
  handler?: handlerFunction;
  modelFunction?: modelFunction;
  middleware?: (...args: any) => any;
}

// Provides support for register default routes
// These are routes that don't do anything but call handlers / models
// TODO : sanitize path inputs to add '/' if they dont have
// TODO : return error if args are missing? need some system to determine which should get through...
export default class RouteHandler {
  router: Router;
  path: string;

  constructor(path: string, router: Router) {
    this.router = router;
    this.path = path;
  }

  sendResponse(handlerResponse: HandlerResponse, res: Response) {
    if (handlerResponse.success) handlerResponse = { ...successResponse, ...handlerResponse };
    else handlerResponse = { ...errorResponse, ...handlerResponse };

    console.log(handlerResponse);
    res.status(handlerResponse.statusCode).send(handlerResponse);
  }

  register(
    type: string,
    path: string,
    message: string,
    middleware: middlewareFunction,
    handler: handlerFunction,
    args: any[] = [],
  ) {
    // Keeps track of method specific information
    const methodFunctionMap: any = {
      get: {
        methodFunction: this.router.get,
        argSourceKey: 'query',
      },
      post: {
        methodFunction: this.router.post,
        argSourceKey: 'body',
      },
    };

    type = type.toLowerCase();
    const methodFunction = methodFunctionMap[type].methodFunction;
    const argSourceKey = methodFunctionMap[type].argSourceKey; // Depending on request, will need to extract from either params or body

    methodFunction.bind(this.router)(path, middleware, (req: any, res: any) => {
      const handlerArgs = args.map(
        arg => (typeof arg === 'function' && arg) || req[argSourceKey][arg],
      ); // Parse the arguments out of the request, including the model function

      const isMissingArguments = handlerArgs.some(arg => arg == undefined);

      if (isMissingArguments) {
        const missingArguments = args.filter(arg => handlerArgs.indexOf(arg) === -1);
        this.sendResponse(
          { ...errorResponse, message: `Missing Parameters: [${missingArguments.join(', ')}]` },
          res,
        );
        return;
      }

      handler(...handlerArgs)
        .then((handlerResponse: HandlerResponse) =>
          this.sendResponse({ ...handlerResponse, message }, res),
        )
        .catch(err => console.error('ERROR: ', err));
    });
  }

  // Takes in an array of default routes and adds them to the router
  registerDefaults(defaultRoutes: defaultRoute[]) {
    for (const route of defaultRoutes) {
      let args = []; // The model function is used by the default handler so it needs to be added to the args first
      if (route.modelFunction) args.push(route.modelFunction);
      if (route.args) args = args.concat(route.args);

      const explodedUrl = route.path.split('+');
      const method = explodedUrl[0];
      const path = explodedUrl[1];
      const blankMiddleware = (req: Request, res: Response, next: NextFunction) => {
        next();
      };

      this.register(
        method,
        path,
        route.message,
        route.middleware || blankMiddleware,
        route.handler || defaultHandler,
        args,
      );
    }
  }
}
