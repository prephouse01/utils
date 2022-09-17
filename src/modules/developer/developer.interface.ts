type User = {
  email: string;
  name: {
    first: string;
    last: string;
  };
  password: string;
  apiKey: string;
};

type Document = {
  _id: string;
  createdAt: string;
  updatedAt: string;
};

export type Developer = User & Document;
