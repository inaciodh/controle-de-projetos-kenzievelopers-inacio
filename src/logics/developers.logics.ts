import { Request, Response, request } from "express";
import {
  TDevInfos,
  TDevelopers,
  TDevelopersRequest,
} from "../interfaces/developers.interfaces";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const createDeveloper = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const devData: TDevelopersRequest = request.body;

  const queryString: string = format(
    `
    INSERT INTO
        developers(%I)
    VALUES 
        (%L)
    RETURNING *; 

  `,
    Object.keys(devData),
    Object.values(devData)
  );

  const queryResult: QueryResult<TDevelopers> = await client.query(queryString);

  return response.status(201).json(queryResult.rows[0]);
};

const getDeveloperById = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { id } = request.params;

  const queryString: string = `
    SELECT 
        dv.id "developerId",
        dv.name "developerName",
        dv.email "developerEmail",
        dinf."developerSince" "developerInfoDeveloperSince",
        dinf."preferredOS" "developerInfoPreferredOS"
    FROM
        developers dv
    LEFT JOIN 
        developer_infos dinf
    ON 
        dv.id = dinf."developerId"
    WHERE 
        dv.id = $1 ;
  `;
  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TDevInfos> = await client.query(queryConfig);

  return response.status(200).json(queryResult.rows[0]);
};

const updateDeveloper = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { id } = request.params;
  const devData: Partial<TDevelopersRequest> = request.body;

  const queryString: string = format(
    `
    UPDATE 
          developers 
    SET (%I) = ROW (%L)
    WHERE id = $1
    RETURNING * ;
  `,
    Object.keys(devData),
    Object.values(devData)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult<TDevelopersRequest> = await client.query(
    queryConfig
  );

  return response.status(200).json(queryResult.rows[0]);
};

const deleteDeveloper = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { id } = request.params;

  const queryString: string = `

    DELETE FROM
        developers
    WHERE
        id = $1;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  await client.query(queryConfig);

  return response.status(204).send();
};

export { createDeveloper, getDeveloperById, updateDeveloper, deleteDeveloper };
