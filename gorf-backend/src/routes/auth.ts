import express from 'express';
import RouteHandler, { defaultRoute } from './router';
import Database from '../database/auth';
import handler from '../handlers/auth';
import { parseJWT } from '../middlewares';

const router = new RouteHandler('/auth', express.Router());

const defaultRoutes: defaultRoute[] = [
  {
    path: 'GET+/profile',
    message: 'Successfully returned profile',
    middleware: parseJWT,
    modelFunction: Database.getProfile,
    args: ['username'],
  },
  {
    path: 'POST+/login',
    message: 'Successfully logged in',
    handler: handler.login,
    args: ['username', 'password'],
  },
  {
    path: 'POST+/register',
    message: 'Successfully registered',
    handler: handler.register,
    args: ['username', 'password', 'email'],
  },
];

router.registerDefaults(defaultRoutes);

export default router;
