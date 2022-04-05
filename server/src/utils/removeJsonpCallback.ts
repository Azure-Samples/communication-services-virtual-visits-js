// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { NextFunction, Request, Response } from 'express';

export const removeJsonpCallback = (req: Request, res: Response, next: NextFunction): any => {
  delete req.query.callback;
  next();
};

export default removeJsonpCallback;
