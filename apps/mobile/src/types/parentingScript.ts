export type ParentingScriptRequest = {
  childName: string;
  childAge: number;
  message: string;
};

export type ParentingScriptResponse = {
  situation_summary: string;
  regulate: string;
  connect: string;
  guide: string;
};

export type SavedScriptInput = {
  situation_summary: string;
  regulate: string;
  connect: string;
  guide: string;
};

export type SavedScript = SavedScriptInput & {
  id: string;
  createdAt: string;
};