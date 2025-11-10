import { Module } from '@nestjs/common';
import { AuthProxyController } from './auth.proxy.controller';
import { ConversationsProxyController } from './conversations.proxy.controller';
import { UsersProxyController } from './users.proxy.controller';
import { SystemsProxyController } from './systems.proxy.controller';
import { PoliciesProxyController } from './policies.proxy.controller';
import { EntityCategoriesProxyController } from './entity-categories.proxy.controller';
import { DepartmentsProxyController } from './departments.proxy.controller';
import { RolesProxyController } from './roles.proxy.controller';

@Module({
  controllers: [
    AuthProxyController,
    ConversationsProxyController,
    UsersProxyController,
    SystemsProxyController,
    PoliciesProxyController,
    EntityCategoriesProxyController,
    DepartmentsProxyController,
    RolesProxyController
  ],
})
export class ProxyModule {}
