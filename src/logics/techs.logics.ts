import { Request, Response } from "express";
import {
  TProjetcTech,
  TTechnologiesRequest,
} from "../interfaces/ttechnologies.interfaces";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const createTechnology = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { name } = request.body;
  const { id } = request.params;
  const techData: TTechnologiesRequest = request.body;

  const queryStringTech: string = `
    SELECT
        *
    FROM
        technologies
    WHERE 
        name = $1 ;
    `;

  const queryConfigTech: QueryConfig = {
    text: queryStringTech,
    values: [name],
  };

  const queryResultTech: QueryResult = await client.query(queryConfigTech);

  const projTech = {
    addedIn: new Date(),
    technologyId: queryResultTech.rows[0].id,
    projectId: response.locals.projects.id,
  };

  const queryStringProTech: string = format(
    `
  INSERT INTO
    projects_technologies(%I)
  VALUES 
    (%L)
   RETURNING *; 
  `,
    Object.keys(projTech),
    Object.values(projTech)
  );

  const queryResultProTech: QueryResult = await client.query(
    queryStringProTech
  );

  const projTechnoligies: TProjetcTech = {
    technologyId: queryResultTech.rows[0].id,
    technologyName: queryResultTech.rows[0].name,
    projectId: response.locals.projects.id,
    projectName: response.locals.projects.name,
    projectDescription: response.locals.projects.description,
    projectEstimatedTime: response.locals.projects.estimatedTime,
    projectRepository: response.locals.projects.repository,
    projectStartDate: response.locals.projects.startDate,
    projectEndDate: response.locals.projects.endDate,
  };

  console.log(queryResultProTech.rows[0]);

  return response.status(201).json(projTechnoligies);
};

const deleteTechnology = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { name } = request.params;
  const { id } = request.params;

  const queryStringTech: string = `
    SELECT
      *
    FROM
      technologies
    WHERE
      name= $1;
  `;

  const queryConfigTech: QueryConfig = {
    text: queryStringTech,
    values: [name],
  };

  const queryResultTech: QueryResult = await client.query(queryConfigTech);

  const queryString: string = `
    DELETE
    FROM
        projects_technologies
    WHERE
        "technologyId" = $1 AND "projectId" = $2;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [queryResultTech.rows[0].id, id],
  };

  await client.query(queryConfig);

  return response.status(204).send();
};

export { createTechnology, deleteTechnology };
