type TProjetcs = {
  id: number;
  name: string;
  description: string;
  estimatedTime: string;
  repository: string;
  startDate: Date;
  endDate: Date | null;
  developerId: number;
};

type TProjetcsRequest = Omit<TProjetcs, "id">;

export { TProjetcs, TProjetcsRequest };
