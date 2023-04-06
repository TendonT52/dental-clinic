import { SpaciallistOfDentist } from './spaciallist.dto';

export class GetDentistRes {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  email: string;
  firstName: string;
  lastName: string;
  telephone: string;
  dateOfBirth: Date;
  specialist: SpaciallistOfDentist[];
}
