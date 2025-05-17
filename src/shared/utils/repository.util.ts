import dataSource from '../../data-source';
import { EntityTarget, ObjectLiteral } from 'typeorm';

export const getRepository = <T extends ObjectLiteral>(entity: EntityTarget<T>) => {
  if (!dataSource.isInitialized) {
    throw new Error('Base de datos no inicializada');
  }
  return dataSource.getRepository(entity);
};