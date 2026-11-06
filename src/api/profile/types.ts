export type Profile = {
  name: string | null;
  date_of_birth: string | null;
  age: number | null;
  country: string | null;
  bio: string | null;
};

export type ProfileUpdate = Partial<{
  name: string;
  date_of_birth: string;
  country: string;
  bio: string;
}>;
