import { AppConfig, appRegToken, IAppConfig } from './app.config';
import { IRedisConfig, RedisConfig, redisRegToken } from './redis.config';

export * from './app.config';
export * from './redis.config';

export interface AllConfigType {
  [appRegToken]: IAppConfig;
  [redisRegToken]: IRedisConfig;
}

export type ConfigKeyPaths = RecordNamePaths<AllConfigType>;

export default {
  AppConfig,
  RedisConfig,
};
