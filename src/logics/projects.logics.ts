import { Request, Response } from "express";
import { TProjetcs, TProjetcsRequest } from "../interfaces/projects.interfaces";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "../database";

const createProjects = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const projectData: Partial<TProjetcsRequest> = request.body;

  const queryString: string = format(
    `
    INSERT INTO
        projects(%I)
    VALUES 
        (%L)
    RETURNING *; 
    
    `,
    Object.keys(projectData),
    Object.values(projectData)
  );

  const queryResult: QueryResult<TProjetcs> = await client.query(queryString);

  return response.status(201).json(queryResult.rows[0]);
};

const getProjectById = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { id } = request.params;

  const queryString: string = `
  
  SELECT
      pj.id "projectId",
      pj.name "projectName",
      pj.description "projectDescription",
      pj."estimatedTime" "projectEstimatedTime",
      pj.repository "projectRepository",
      pj."startDate" "projectStartDate",
      pj."endDate" "projectEndDate",
      pj."developerId" "projectDeveloperId",
      pt."technologyId" "technologyId" ,
      tec.name "technologyName"
  FROM 
      projects pj
  LEFT JOIN 
      projects_technologies pt ON pj.id = pt."projectId"
  LEFT JOIN 
      technologies tec ON tec.id = pt."technologyId"
  WHERE 
      pj.id = $1 ;
  `;

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  return response.status(200).json(queryResult.rows);
};

const updateProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { id } = request.params;
  const projectData: Partial<TProjetcsRequest> = request.body;

  const queryString: string = format(
    `
    UPDATE 
       projects 
    SET (%I) = ROW (%L)
    WHERE 
       id = $1
    RETURNING * ;
    `,
    Object.keys(projectData),
    Object.values(projectData)
  );

  const queryConfig: QueryConfig = {
    text: queryString,
    values: [id],
  };

  const queryResult: QueryResult = await client.query(queryConfig);

  return response.status(200).json(queryResult.rows[0]);
};

const deleteProject = async (
  request: Request,
  response: Response
): Promise<Response> => {
  const { id } = request.params;

  const queryString: string = `
    DELETE FROM
        projects
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

export { createProjects, getProjectById, updateProject, deleteProject };
