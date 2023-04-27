import { Request, Response } from "express";
import format from "pg-format";
import { QueryResult } from "pg";
import {
  TDeveleperInfosRequest,
  TDeveloperInfo,
} from "../interfaces/developers.interfaces";
import { client } from "../database";

const createDevInfo = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { id } = request.params;
  const devData: TDeveleperInfosRequest = request.body;
  devData.developerId = Number(id);

  const queryString: string = format(
    `
    INSERT INTO 
        developer_infos (%I)
    VALUES
        (%L)
    RETURNING 
        *;
    `,
    Object.keys(devData),
    Object.values(devData)
  );

  const queryResult: QueryResult<TDeveloperInfo> = await client.query(
    queryString
  );
  return response.status(201).json(queryResult.rows[0]);
};

export { createDevInfo };
