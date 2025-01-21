import { generatedMockObjectMetadataItems } from '~/testing/mock-data/generatedMockObjectMetadataItems';
import { mockedViewsData } from './views';

const companyObjectMetadata = generatedMockObjectMetadataItems.find(
  (item) => item.nameSingular === 'company',
);

const personObjectMetadata = generatedMockObjectMetadataItems.find(
  (item) => item.nameSingular === 'person',
);

const opportunityObjectMetadata = generatedMockObjectMetadataItems.find(
  (item) => item.nameSingular === 'opportunity',
);

export const mockedViewFieldsData = [
  // Companies
  {
    id: '79035310-e955-4986-a4a4-73f9d9949c6a',
    fieldMetadataId: companyObjectMetadata?.fields.find(
      (field) => field.name === 'name',
    )?.id,
    viewId: mockedViewsData[0].id,
    position: 0,
    isVisible: true,
    size: 180,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: '2a96bbc8-d86d-439a-8e50-4b07ebd27750',
    fieldMetadataId: companyObjectMetadata?.fields.find(
      (field) => field.name === 'domainName',
    )?.id,
    viewId: mockedViewsData[0].id,
    position: 1,
    isVisible: true,
    size: 100,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: '0c1b4c7b-6a3d-4fb0-bf2b-5d7c8fb844ed',
    fieldMetadataId: companyObjectMetadata?.fields.find(
      (field) => field.name === 'accountOwner',
    )?.id,
    viewId: mockedViewsData[0].id,
    position: 2,
    isVisible: true,
    size: 150,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: 'cc7f9560-32b5-4b82-8fd9-b05fe77c8cf7',
    fieldMetadataId: companyObjectMetadata?.fields.find(
      (field) => field.name === 'createdAt',
    )?.id,
    viewId: mockedViewsData[0].id,
    position: 3,
    isVisible: true,
    size: 150,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: '3de4d078-3396-4480-be2d-6f3b1a228b0d',
    fieldMetadataId: companyObjectMetadata?.fields.find(
      (field) => field.name === 'employees',
    )?.id,
    viewId: mockedViewsData[0].id,
    position: 4,
    isVisible: true,
    size: 150,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: '4650c8fb-0f1e-4342-88dc-adedae1445f9',
    fieldMetadataId: companyObjectMetadata?.fields.find(
      (field) => field.name === 'linkedinLink',
    )?.id,
    viewId: mockedViewsData[0].id,
    position: 5,
    isVisible: true,
    size: 170,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: '727430bf-6ff8-4c85-9828-cbe72ac0fc27',
    fieldMetadataId: companyObjectMetadata?.fields.find(
      (field) => field.name === 'address',
    )?.id,
    viewId: mockedViewsData[0].id,
    position: 6,
    isVisible: true,
    size: 170,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },

  // Companies v2
  {
    id: '79035310-e955-4986-a4a4-73f9d9949c6a',
    fieldMetadataId: companyObjectMetadata?.fields.find(
      (field) => field.name === 'name',
    )?.id,
    viewId: mockedViewsData[3].id,
    position: 0,
    isVisible: true,
    size: 180,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: '2a96bbc8-d86d-439a-8e50-4b07ebd27750',
    fieldMetadataId: companyObjectMetadata?.fields.find(
      (field) => field.name === 'domainName',
    )?.id,
    viewId: mockedViewsData[3].id,
    position: 1,
    isVisible: true,
    size: 100,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: '0c1b4c7b-6a3d-4fb0-bf2b-5d7c8fb844ed',
    fieldMetadataId: companyObjectMetadata?.fields.find(
      (field) => field.name === 'accountOwner',
    )?.id,
    viewId: mockedViewsData[3].id,
    position: 2,
    isVisible: true,
    size: 150,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: 'cc7f9560-32b5-4b82-8fd9-b05fe77c8cf7',
    fieldMetadataId: companyObjectMetadata?.fields.find(
      (field) => field.name === 'createdAt',
    )?.id,
    viewId: mockedViewsData[3].id,
    position: 3,
    isVisible: true,
    size: 150,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: '3de4d078-3396-4480-be2d-6f3b1a228b0d',
    fieldMetadataId: companyObjectMetadata?.fields.find(
      (field) => field.name === 'employees',
    )?.id,
    viewId: mockedViewsData[3].id,
    position: 4,
    isVisible: true,
    size: 150,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: '4650c8fb-0f1e-4342-88dc-adedae1445f9',
    fieldMetadataId: companyObjectMetadata?.fields.find(
      (field) => field.name === 'linkedinLink',
    )?.id,
    viewId: mockedViewsData[3].id,
    position: 5,
    isVisible: true,
    size: 170,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: '727430bf-6ff8-4c85-9828-cbe72ac0fc27',
    fieldMetadataId: companyObjectMetadata?.fields.find(
      (field) => field.name === 'address',
    )?.id,
    viewId: mockedViewsData[3].id,
    position: 6,
    isVisible: true,
    size: 170,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },

  // People
  {
    id: '28894146-4fde-4a16-a9ca-1a31b5b788b4',
    fieldMetadataId: personObjectMetadata?.fields.find(
      (field) => field.name === 'name',
    )?.id,
    viewId: mockedViewsData[1].id,
    position: 0,
    isVisible: true,
    size: 210,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: 'e1e24864-8601-4cd8-8a63-09c1285f2e39',
    fieldMetadataId: personObjectMetadata?.fields.find(
      (field) => field.name === 'emails',
    )?.id,
    viewId: mockedViewsData[1].id,
    position: 1,
    isVisible: true,
    size: 150,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: '5a1df716-7211-445a-9f16-9783a00998a7',
    fieldMetadataId: personObjectMetadata?.fields.find(
      (field) => field.name === 'company',
    )?.id,
    viewId: mockedViewsData[1].id,
    position: 2,
    isVisible: true,
    size: 150,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: 'a6e1197a-7e84-4d92-ace2-367c0bc46c49',
    fieldMetadataId: personObjectMetadata?.fields.find(
      (field) => field.name === 'phones',
    )?.id,
    viewId: mockedViewsData[1].id,
    position: 3,
    isVisible: true,
    size: 150,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: 'c9343097-d14b-4559-a5fa-626c1527d39f',
    fieldMetadataId: personObjectMetadata?.fields.find(
      (field) => field.name === 'createdAt',
    )?.id,
    viewId: mockedViewsData[1].id,
    position: 4,
    isVisible: true,
    size: 150,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: 'a873e5f0-fed6-47e9-a712-6854eab3ec77',
    fieldMetadataId: personObjectMetadata?.fields.find(
      (field) => field.name === 'city',
    )?.id,
    viewId: mockedViewsData[1].id,
    position: 5,
    isVisible: true,
    size: 150,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: '66f134b8-5329-422f-b88e-83e6bb707eb5',
    fieldMetadataId: personObjectMetadata?.fields.find(
      (field) => field.name === 'jobTitle',
    )?.id,
    viewId: mockedViewsData[1].id,
    position: 6,
    isVisible: true,
    size: 150,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: '648faa24-cabb-482a-8578-ba3f09906017',
    fieldMetadataId: personObjectMetadata?.fields.find(
      (field) => field.name === 'linkedinLink',
    )?.id,
    viewId: mockedViewsData[1].id,
    position: 7,
    isVisible: true,
    size: 150,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: '3a9e7f0d-a4ce-4ad5-aac7-3a24eb1a412d',
    fieldMetadataId: personObjectMetadata?.fields.find(
      (field) => field.name === 'xLink',
    )?.id,
    viewId: mockedViewsData[1].id,
    position: 8,
    isVisible: true,
    size: 150,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },

  // Opportunities
  {
    id: '35a42e2d-83dd-4b57-ada6-f90616da706d',
    fieldMetadataId: opportunityObjectMetadata?.fields.find(
      (field) => field.name === 'name',
    )?.id,
    viewId: mockedViewsData[2].id,
    position: 0,
    isVisible: true,
    size: 180,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: '3159acd8-463f-458d-bf9a-af8ac6f57dc0',
    fieldMetadataId: opportunityObjectMetadata?.fields.find(
      (field) => field.name === 'closeDate',
    )?.id,
    viewId: mockedViewsData[2].id,
    position: 2,
    isVisible: true,
    size: 100,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: 'afc0819d-b694-4e3c-a2e6-25261aa3ed2c',
    fieldMetadataId: opportunityObjectMetadata?.fields.find(
      (field) => field.name === 'company',
    )?.id,
    viewId: mockedViewsData[2].id,
    position: 3,
    isVisible: true,
    size: 150,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: 'ec0507bb-aedc-4695-ba96-d81bdeb9db83',
    fieldMetadataId: opportunityObjectMetadata?.fields.find(
      (field) => field.name === 'createdAt',
    )?.id,
    viewId: mockedViewsData[2].id,
    position: 4,
    isVisible: true,
    size: 150,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
  {
    id: '3f1585f6-44f6-45c5-b840-bc05af5d0008',
    fieldMetadataId: opportunityObjectMetadata?.fields.find(
      (field) => field.name === 'pointOfContact',
    )?.id,
    viewId: mockedViewsData[2].id,
    position: 5,
    isVisible: true,
    size: 150,
    createdAt: '2021-09-01T00:00:00.000Z',
    updatedAt: '2021-09-01T00:00:00.000Z',
    deletedAt: null,
    __typename: 'ViewField',
  },
];
