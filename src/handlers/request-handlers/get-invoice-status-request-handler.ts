import { Request, Response, RouterContext, NextFunction } from '../../@types/controllers.ts'

import { createGetInvoiceStatusController } from '../../factories/get-invoice-status-controller-factory.ts'

export const getInvoiceStatusRequestHandler = async (ctx: RouterContext<string>, next: NextFunction) => {
  const req : Request = ctx.request
  const res : Response = ctx.response
  const controller = createGetInvoiceStatusController()
  await controller.handleRequest(req, res, ctx)
  await next();
}
