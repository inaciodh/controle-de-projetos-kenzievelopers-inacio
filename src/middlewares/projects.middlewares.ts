import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const ensureProjectDevIdExist = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { developerId } = request.body;

  const queryString: string = `
     SELECT
          *
     FROM
        developers
     WHERE
        id= $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [developerId],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return response.status(404).json({
      message: "Developer not found.",
    });
  } else {
    return next();
  }
};

const ensureProjectIdExist = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { id } = request.params;

  const queryString: string = `
    SELECT
        *
    FROM
        projects
    WHERE
        id= $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount === 0) {
    return response.status(404).json({
      message: "Project not found.",
    });
  }

  response.locals.projects = queryResult.rows[0];

  return next();
};

export { ensureProjectDevIdExist, ensureProjectIdExist };
