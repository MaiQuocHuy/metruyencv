import { HistoryType } from './enums.util';

export default class CommonUtil {
  // static getConditionForSequelize(fields: object[], option: object = {}) {
  //   const condition = [];
  //   Object.keys(fields).forEach((key) => {
  //     if (fields[key]) {
  //       condition.push({ [key]: fields[key] });
  //     }
  //   });
  // }

  static createDataHistoryUpdateManga(
    type: HistoryType,
    cidOfLatestVersion: string,
    data: { dataToUpdate: object[]; dataOfLatestVersion?: object } = {
      dataToUpdate: [],
      dataOfLatestVersion: {},
    },
  ): { jsonBufferHistory: Buffer<ArrayBuffer>; newVersion: number } {
    let newVersion: number;
    if (type === HistoryType.CreateManga) {
      newVersion = 0;
    }
    // get latest version
    const latestVersion = data.dataOfLatestVersion['data']['version'];
    newVersion = latestVersion + 1;

    // create recent versions
    const recentVersions = data.dataOfLatestVersion['data']['recentVersions'];
    const twoRecentVersions = recentVersions.slice(0, 2);
    const newRecentVersions = [
      { version: latestVersion, cid: cidOfLatestVersion },
      ...twoRecentVersions,
    ];

    // create json buffer
    const jsonBufferHistory = this.createMangaJsonBufferHistory(
      type,
      newVersion,
      {
        changes: data.dataToUpdate,
        recentVersions: newRecentVersions,
      },
    );

    return { jsonBufferHistory, newVersion };
  }

  static createMangaJsonBufferHistory(
    type: HistoryType,
    newVersion: number,
    data: {
      changes?: object[];
      recentVersions?: object[];
    } = {
      changes: [],
      recentVersions: [],
    },
  ): Buffer<ArrayBuffer> {
    const { changes, recentVersions = [] } = data;
    // Get key of enum
    const typeOfHistory = Object.entries(HistoryType).find(
      ([key, val]) => val === type,
    )?.[0];
    // Create json buffer
    const jsonBufferHistory = Buffer.from(
      JSON.stringify({
        version: newVersion,
        content: `Nội dung cập nhật truyện tại phiên bản ${newVersion}`,
        type: typeOfHistory,
        changeLog: {
          timestamp: new Date().toISOString(),
          description: type,
          changes: changes,
        },
        recentVersions: recentVersions,
        previousVersion:
          recentVersions.length != 0 ? recentVersions[0]['cid'] : '',
      }),
    );
    return jsonBufferHistory;
  }
}
