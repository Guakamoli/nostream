import { NextFunction, Request, Response, Status, RouterContext } from '../../@types/controllers.ts'

import { path, pathEq } from 'ramda'
import { readFileSync } from 'node:fs'

import { createSettings } from '../../factories/settings-factory.ts'
import { FeeSchedule } from '../../@types/settings.ts'

let pageCache: string

export const getInvoiceRequestHandler = async (ctx: RouterContext<string>, next: NextFunction) => {
  const res: Response = ctx.response
  const settings = createSettings()

  if (pathEq(['payments', 'enabled'], true, settings)
   && pathEq(['payments', 'feeSchedules', 'admission', '0', 'enabled'], true, settings)) {
    if (!pageCache) {
      const name = path<string>(['info', 'name'])(settings)
      const feeSchedule = path<FeeSchedule>(['payments', 'feeSchedules', 'admission', '0'], settings)
      pageCache = readFileSync('./resources/index.html', 'utf8')
        .replaceAll('{{name}}', name)
        .replaceAll('{{amount}}', (BigInt(feeSchedule.amount) / 1000n).toString())
    }
    res.status = Status.OK
    res.headers.set('content-type', 'text/html; charset=utf8')
    res.body = pageCache
 
  } else {
    res.status = Status.NotFound
    res.headers.set('content-type', 'text/html; charset=utf8')
    res.body = ''
  }

  await next()
}
