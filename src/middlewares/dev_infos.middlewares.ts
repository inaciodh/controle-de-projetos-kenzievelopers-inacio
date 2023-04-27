import { NextFunction, Request, Response } from "express";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";
import { TDeveleperInfosRequest } from "../interfaces/developers.interfaces";

const ensureDevInfoExist = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response | void> => {
  const { id } = request.params;

  const queryString: string = `
    
  SELECT
   *
  FROM
        developer_infos
  WHERE 
        "developerId" = $1;
    `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  if (queryResult.rowCount > 0) {
    return response.status(409).json({
      message: "Developer infos already exists.",
    });
  } else {
    return next();
  }
};

const validatePreferredOS = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void | Response<TDeveleperInfosRequest>> => {
  const { preferredOS } = request.body;

  const validOS = ["Windows", "Linux", "MacOS"];

  if (!validOS.includes(preferredOS)) {
    return response.status(400).json({
      message: "Invalid OS option.",
      options: validOS,
    });
  }

  return next();
};

export { ensureDevInfoExist, validatePreferredOS };
