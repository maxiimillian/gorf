import express from 'express';
import RouteHandler, { defaultRoute } from './router';
import Database from '../database/feeds';
import handler from '../handlers/feeds';
import { parseJWT } from '../middlewares';

const router = new RouteHandler('/feeds', express.Router());

const defaultRoutes: defaultRoute[] = [];

const authenticatedRoutes: defaultRoute[] = [
  {
    path: 'POST+/create',
    message: 'Successfully created feed',
    modelFunction: Database.,
    args: ['username', 'password', 'email'],
  },
];

authenticatedRoutes.map(route => {
  route.middleware = parseJWT;
});

router.registerDefaults(defaultRoutes);

export default router;
