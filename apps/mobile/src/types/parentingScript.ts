export type ParentingScriptRequest = {
  childName:       string;
  childAge:        number;
  message:         string;
  userId?:         string;
  childProfileId?: string;
  neurotype?:      string | null;  // Phase B — premium only
};

export type ParentingScriptResponse = {
  situation_summary: string;
  regulate:          string;
  connect:           string;
  guide:             string;
};
