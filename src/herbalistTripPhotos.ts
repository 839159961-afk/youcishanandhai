import { publicAssetUrl } from './constants';
import manifest from './herbalistTripPhotos.manifest.json';

/** 按序号排列的游历/图鉴插图（由 scripts/sync-herbalist-trip-photos.mjs 生成 manifest） */
export const HERBALIST_TRIP_PHOTO_URLS: string[] = manifest.map((rel) =>
  publicAssetUrl(rel)
);
