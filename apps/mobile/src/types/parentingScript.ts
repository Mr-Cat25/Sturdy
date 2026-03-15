export type ParentingScriptRequest = {
  message: string;
  childAge: number;
  neurotype: string[];
};

export type ParentingScriptResponse = {
  situation_summary: string;
  regulate: string;
  connect: string;
  guide: string;
};