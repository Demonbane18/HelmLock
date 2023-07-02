import { apiHandler } from '../../../../utils/api/api-handler';
import { lockersRepo } from '../../../../utils/api/lockers-repo';
import Locker from '../../../../models/Locker';
import { NextRequest, NextResponse } from 'next/server';

// export async function GET(req) {

//   const locker = await Locker.findById(req.query);
//   await db.disconnect();
//   NextResponse.send(locker);
// }

// export default apiHandler({
//   get: getById,
// });
// async function getById(req, res) {
//   const locker = await lockersRepo.getById(req.query.id);

//   if (!locker) throw 'Locker Not Found';

//   return res.status(200).json(locker);
// }

// export async function GET(request, [params]) {
//   try {

//     if (error) throw new Error(error);
//     NextResponse.send(locker);
//   } catch (error) {
//     return NextResponse.json({ errror: error.message }, { status: 500 });
//   }
// }
