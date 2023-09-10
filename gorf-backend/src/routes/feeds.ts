import express from 'express';
import RouteHandler, { defaultRoute } from './router';
import Database from '../database/feeds';
import Handler from '../handlers/feeds';
import { parseJWT } from '../middlewares';

const router = new RouteHandler('/feeds', express.Router());

const defaultRoutes: defaultRoute[] = [];

const authenticatedRoutes: defaultRoute[] = [
  {
    path: 'POST+/create',
    message: 'Successfully created feed',
    handler: Handler.createFeed,
    args: ['name', 'description', 'parentId'],
    passRequestContext: true
  },
];

authenticatedRoutes.map(route => {
  route.middleware = parseJWT;
});

router.registerDefaults(authenticatedRoutes);

export default router;
