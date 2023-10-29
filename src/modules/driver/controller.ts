import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Driver } from './model';
import QueryBuilder, { OrderQuery } from '../../utils/queryBuilder';

const drivers = async (req: Request, res: Response) => {
  const db = new QueryBuilder('drivers');
  const { order, by } = req.query;
  if (order && by) {
    if (typeof order === 'string' && typeof by === 'string') {
      db.orderBy([[order, by] as OrderQuery]);
    }
    if (Array.isArray(order) && Array.isArray(by) && order.length === by.length) {
      const orderByData = order.map((field, i) => {
        return [field, by[i]];
      }) as OrderQuery[];
      db.orderBy(orderByData);
    }
  }

  const drivers = await db.select<Driver[]>();

  return res.json({
    drivers: drivers,
  });
};

const driver = async (req: Request, res: Response) => {
  const db = new QueryBuilder('drivers');
  const { alphabetize } = req.query;
  const drivers = await db.where([['id', '=', req.params.id]]).select<Driver[]>();

  if (alphabetize && drivers && drivers.length > 0) {
    const driver = drivers[0];
    const alphabetizedFirstName = driver.firstName.split('').sort().join('');
    const alphabetizedLastName = driver.lastName.split('').sort().join('');
    return res.json({
      driver: {
        ...driver,
        alphabetizedFirstName,
        alphabetizedLastName,
        alphabetizedFullName: `${alphabetizedFirstName} ${alphabetizedLastName}`,
      },
    });
  }

  return res.json({
    driver: drivers && drivers.length > 0 ? drivers[0] : null,
  });
};

const create = async (req: Request, res: Response) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).json(
      validationResult(req).formatWith((error) => {
        return error.msg;
      }),
    );
  }
  const db = new QueryBuilder('drivers');
  await db.insert(['firstName', 'lastName', 'email', 'phoneNumber'], [[req.body.firstName, req.body.lastName, req.body.email, req.body.phoneNumber]]);

  res.json({
    message: 'success',
  });
};

const update = async (req: Request, res: Response) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).json(
      validationResult(req).formatWith((error) => {
        return error.msg;
      }),
    );
  }

  if (Object.keys(req.body).length > 0) {
    const db = new QueryBuilder('drivers');
    await db.where([['id', '=', req.params.id]]).update(req.body);
  }

  res.json({
    message: 'success',
  });
};

const deleteOne = async (req: Request, res: Response) => {
  const validation = validationResult(req);
  if (!validation.isEmpty()) {
    return res.status(400).json(
      validationResult(req).formatWith((error) => {
        return error.msg;
      }),
    );
  }
  const db = new QueryBuilder('drivers');
  await db.where([['id', '=', req.params.id]]).delete();

  res.json({
    message: 'success',
  });
};

export const controller = {
  driver,
  drivers,
  create,
  update,
  deleteOne,
};
