import { SetMetadata } from '@nestjs/common';

export const ARCHIVED_RESOURCE_ACCESS = 'archived_resource_access';

export const ArchivedResourceAccess = (isArchivedResource: boolean = true) =>
  SetMetadata(ARCHIVED_RESOURCE_ACCESS, isArchivedResource);
