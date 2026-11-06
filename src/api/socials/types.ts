export type Social = {
  id: number;
  platform_name: string;
  url: string;
};

export type SocialInput = {
  platform_name: string;
  url: string;
};

export type SocialUpdate = Partial<SocialInput>;
