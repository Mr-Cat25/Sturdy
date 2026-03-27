// apps/mobile/src/types/parentingScript.ts

export type ParentingScriptRequest = {
  childName:       string;
  childAge:        number;
  message:         string;
  userId?:         string;
  childProfileId?: string;
  neurotype?:      string | null;
  intensity?:      number | null;  // 1–5, optional
};

export type ParentingScriptResponse = {
  situation_summary: string;
  regulate:          string;
  connect:           string;
  guide:             string;
};

export type SavedScriptInput = {
  situation_summary: string;
  regulate:          string;
  connect:           string;
  guide:             string;
  childAge?:         number | null;
};

export type SavedScript = SavedScriptInput & {
  id:        string;
  createdAt: string;
};

