export type BeanStatus = "current" | "finished" | "archived";

export type Bean = {
  id: string;
  name: string;
  roaster: string;

  origin?: string;
  region?: string;
  farm?: string;
  producer?: string;
  altitude?: string;
  variety?: string;
  process?: string;

  roastDate?: string;
  openedDate?: string;
  bagSize?: string;
  remaining?: string;

  tastingNotes?: string[];
  status: BeanStatus;
};