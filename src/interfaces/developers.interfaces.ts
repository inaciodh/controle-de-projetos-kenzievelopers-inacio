type TDevelopers = {
  id: number;
  email: string;
  name: string;
};

type TDevelopersRequest = Omit<TDevelopers, "id">;

type TDevInfos = {
  developerId: number;
  developerName: string;
  developerEmail: string;
  developerInfoDeveloperSince?: Date;
  developerInfoPreferredOS?: "Windows" | "Linux" | "MacOS";
};

type TDeveloperInfo = {
  id: number;
  developerSince: Date;
  preferredOS: "Windows" | "Linux" | "MacOS";
  developerId?: number;
};

type TDeveleperInfosRequest = Omit<TDeveloperInfo, "id">;

export {
  TDevelopers,
  TDevelopersRequest,
  TDevInfos,
  TDeveloperInfo,
  TDeveleperInfosRequest,
};
