type TTechnologies = {
  id: number;
  name: string;
};

type TTechnologiesRequest = Omit<TTechnologies, "id">;

type TProjetcTech = {
  technologyId: number;
  technologyName: string;
  projectId: number;
  projectName: string;
  projectDescription: string;
  projectEstimatedTime: string;
  projectRepository: string;
  projectStartDate: Date;
  projectEndDate: Date;
};

export { TTechnologies, TTechnologiesRequest, TProjetcTech };
