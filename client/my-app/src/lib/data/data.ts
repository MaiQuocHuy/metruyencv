import { HistoryEntry } from '@/types/history';

// Example history data (in a real app this would come from an API)
export const historyData: HistoryEntry[] = [
  {
    version: 10,
    content: 'Nội dung cập nhật truyện tại phiên bản 10',
    type: 'UpdateManga',
    changeLog: {
      timestamp: '2025-04-11T14:17:13.798Z',
      description: 'Update Manga',
      changes: [
        {
          field: 'manga_title',
          oldValue: 'string',
          newValue: 'strings'
        },
        {
          field: 'manga_slug',
          oldValue: 'string-1743771984',
          newValue: 'strings-1743771984'
        },
        {
          field: 'manga_thumb',
          oldValue:
            'bafybeibo453vt5yjwefio6glodxliqggemxwja4tottiq3ppybymejbdrm',
          newValue:
            'bafybeidpuw2qqh2hf4c3rwe4iizyw5lgf6pzmcf4ygb67ma2lrlabgxlcy'
        }
      ]
    },
    recentVersions: [
      {
        version: 9,
        cid: 'bafkreidc6a25faz745u2b332vslbvq3pwsl55xutr5zs44u44vgzkaxiqi'
      },
      {
        version: 8,
        cid: 'bafkreiadrlfjsrxbkythkls3nvq42pivmmnv2qv3nwioqi6nzg2ntstoya'
      },
      {
        version: 7,
        cid: 'bafkreibnu7t2fukqbhptw6rpxju7lwcve6ouow7mme2pp6ftx2xaixinoi'
      }
    ],
    previousVersion:
      'bafkreidc6a25faz745u2b332vslbvq3pwsl55xutr5zs44u44vgzkaxiqi'
  },
  {
    version: 4,
    content: 'Nội dung cập nhật truyện tại phiên bản 4',
    type: 'Delete',
    changeLog: {
      timestamp: '2025-03-15T09:32:57.550Z',
      description: 'Delete Manga',
      changes: []
    },
    recentVersions: [
      {
        version: 3,
        cid: 'bafkreiemf72dwuvgb2hvbbheoffn5pfdxblkzviqwoshucea7tzwbr342y'
      },
      {
        version: 2,
        cid: 'bafkreid64zeoswcwwzgfslx3fmhhigkw5gzu3l732kudtijgcqgkigbl4e'
      },
      {
        version: 1,
        cid: 'bafkreibhuvvmo3hdmgrodoamguuf2oirfc4xa77jevavpjuqhocfrnkj7y'
      }
    ],
    previousVersion:
      'bafkreiemf72dwuvgb2hvbbheoffn5pfdxblkzviqwoshucea7tzwbr342y'
  },
  {
    version: 2,
    content: 'Nội dung cập nhật truyện tại phiên bản 2',
    type: 'UnpublishManga',
    changeLog: {
      timestamp: '2025-03-29T09:13:23.430Z',
      description: 'Unpublish Manga',
      changes: []
    },
    recentVersions: [
      {
        version: 1,
        cid: 'bafkreigsgrdz2rytco3stebdwnuzhoaiufv454d3u3jywd63q54yyknau4'
      },
      {
        version: 0,
        cid: 'bafkreifog7jvleghofjj47pt25ihitgudmmid6hof4vm6e2bwxtee6ertu'
      }
    ],
    previousVersion:
      'bafkreigsgrdz2rytco3stebdwnuzhoaiufv454d3u3jywd63q54yyknau4'
  },
  {
    version: 1,
    content: 'Nội dung cập nhật truyện tại phiên bản 1',
    type: 'PublishManga',
    changeLog: {
      timestamp: '2025-03-29T09:13:23.430Z',
      description: 'Publish Manga',
      changes: []
    },
    recentVersions: [
      {
        version: 0,
        cid: 'bafkreifog7jvleghofjj47pt25ihitgudmmid6hof4vm6e2bwxtee6ertu'
      }
    ],
    previousVersion:
      'bafkreifog7jvleghofjj47pt25ihitgudmmid6hof4vm6e2bwxtee6ertu'
  },
  {
    version: 0,
    content: 'Nội dung cập nhật truyện tại phiên bản 0',
    type: 'CreateManga',
    changeLog: {
      timestamp: '2025-04-04T13:06:31.245Z',
      description: 'Create new Manga',
      changes: [
        {
          manga_title: 'string',
          manga_author: 'string',
          manga_description: 'string',
          manga_id: 1743771984553,
          manga_slug: 'string-1743771984',
          manga_thumb:
            'bafybeibo453vt5yjwefio6glodxliqggemxwja4tottiq3ppybymejbdrm',
          categories: [
            {
              field: 'category_id',
              categoryId: 1,
              categoryName: 'Action'
            },
            {
              field: 'category_id',
              categoryId: 2,
              categoryName: 'Romance'
            }
          ]
        }
      ]
    },
    recentVersions: [],
    previousVersion: ''
  },
  {
    version: 2,
    content: 'Nội dung cập nhật truyện tại phiên bản 2',
    type: 'CreateCategoryForManga',
    changeLog: {
      timestamp: '2025-03-29T09:13:46.518Z',
      description: 'Create new Category For Manga',
      changes: [
        {
          field: 'category_id',
          categoryId: 3,
          categoryName: 'Fantasy'
        },
        {
          field: 'category_id',
          categoryId: 4,
          categoryName: 'Adventure'
        }
      ]
    },
    recentVersions: [
      {
        version: 1,
        cid: 'bafkreigsgrdz2rytco3stebdwnuzhoaiufv454d3u3jywd63q54yyknau4'
      },
      {
        version: 0,
        cid: 'bafkreifog7jvleghofjj47pt25ihitgudmmid6hof4vm6e2bwxtee6ertu'
      }
    ],
    previousVersion:
      'bafkreigsgrdz2rytco3stebdwnuzhoaiufv454d3u3jywd63q54yyknau4'
  },
  {
    version: 3,
    content: 'Nội dung cập nhật truyện tại phiên bản 3',
    type: 'DeleteCategoryForMagna',
    changeLog: {
      timestamp: '2025-03-29T09:23:24.264Z',
      description: 'Delete Category For Manga',
      changes: [
        {
          field: 'category_id',
          categoryId: 4,
          categoryName: 'Adventure'
        }
      ]
    },
    recentVersions: [
      {
        version: 2,
        cid: 'bafkreifbwvhfjsl7wz2ctbah2h4fxr6dlxgngmxnpenidog267rserje3u'
      },
      {
        version: 1,
        cid: 'bafkreigsgrdz2rytco3stebdwnuzhoaiufv454d3u3jywd63q54yyknau4'
      }
    ],
    previousVersion:
      'bafkreifbwvhfjsl7wz2ctbah2h4fxr6dlxgngmxnpenidog267rserje3u'
  },
  {
    version: 5,
    content: 'Nội dung cập nhật truyện tại phiên bản 5',
    type: 'CreateChapter',
    changeLog: {
      timestamp: '2025-04-09T09:30:06.430Z',
      description: 'Create new Chapter',
      changes: [
        {
          chap_id: 1744191002476,
          chap_manga_id: '1743771984553',
          chap_title: 'Chapter 4: The Beginning',
          chap_number: 4,
          chap_content:
            'bafkreig5qq5wj4gczo3ygbzhhlezjihnqu5i7xyxbjqrq2mrnjscjl7qme'
        }
      ]
    },
    recentVersions: [
      {
        version: 4,
        cid: 'bafkreiblhc5chyeqyikadfbmizu47hiclc3y44mrvbypzsepissvihfrzy'
      },
      {
        version: 3,
        cid: 'bafkreicvinyzqy653uftztsi65vi4nosi5xhhxhs2pd7coh2whgxzkywfy'
      },
      {
        version: 2,
        cid: 'bafkreih527djctjliu2bznalhj5bsstexuzxo5airrcyetedx5hrtfz65y'
      }
    ],
    previousVersion:
      'bafkreiblhc5chyeqyikadfbmizu47hiclc3y44mrvbypzsepissvihfrzy'
  },
  {
    version: 9,
    content: 'Nội dung cập nhật truyện tại phiên bản 9',
    type: 'UpdateChapter',
    changeLog: {
      timestamp: '2025-04-09T09:40:19.443Z',
      description: 'Update Chapter',
      changes: [
        {
          field: 'chap_content',
          oldValue:
            'bafkreigubxhpngscvi6ybhtqx2rburjaui4aupjb2u2reexvvbwiwjgjnu',
          newValue:
            'bafkreiam2yk4jieb4sgirvqsd5lxjnfpn5ce3h3nuchabyi4ilo6uoa2gq'
        }
      ]
    },
    recentVersions: [
      {
        version: 8,
        cid: 'bafkreiadrlfjsrxbkythkls3nvq42pivmmnv2qv3nwioqi6nzg2ntstoya'
      },
      {
        version: 7,
        cid: 'bafkreibnu7t2fukqbhptw6rpxju7lwcve6ouow7mme2pp6ftx2xaixinoi'
      },
      {
        version: 6,
        cid: 'bafkreifzdtz7yqseml3m3in74fhceuzfp6gxo3fmamlvr5tc5bd5kpuesu'
      }
    ],
    previousVersion:
      'bafkreiadrlfjsrxbkythkls3nvq42pivmmnv2qv3nwioqi6nzg2ntstoya'
  },
  {
    version: 13,
    content: 'Nội dung cập nhật truyện tại phiên bản 13',
    type: 'DeleteChapter',
    changeLog: {
      timestamp: '2025-03-15T16:54:49.457Z',
      description: 'Delete Chapter',
      changes: []
    },
    recentVersions: [
      {
        version: 12,
        cid: 'bafkreidfm2ld4sbgcs2iwdwicxo535afid7ei353wsvbaqisrtyp3co3wm'
      },
      {
        version: 11,
        cid: 'bafkreihgdkqcz6ffqlnurfnewl6jat57xe7pl2srzk7zedvyir53hfgvzq'
      },
      {
        version: 10,
        cid: 'bafkreidps7cyqxtlzigth5hrqthchx2yii2geqnvncaps5menjq632tmli'
      }
    ],
    previousVersion:
      'bafkreidfm2ld4sbgcs2iwdwicxo535afid7ei353wsvbaqisrtyp3co3wm'
  },
  {
    version: 11,
    content: 'Nội dung cập nhật truyện tại phiên bản 11',
    type: 'DeleteImageInChapterContent',
    changeLog: {
      timestamp: '2025-04-11T14:47:00.932Z',
      description: 'Delete Image In Chapter Content',
      changes: [
        {
          field: 'chap_content',
          oldValue:
            'bafkreiam2yk4jieb4sgirvqsd5lxjnfpn5ce3h3nuchabyi4ilo6uoa2gq',
          newValue:
            'bafkreicc6g73c7a2kjx6zq7aniltpjqss2x34l776m7ecwpkseggdifw6u'
        }
      ]
    },
    recentVersions: [
      {
        version: 10,
        cid: 'bafkreidbbixwzpg2hf4kwslayhv5cwoevvaof4poyo77ckpxodpc33wt5y'
      },
      {
        version: 9,
        cid: 'bafkreidc6a25faz745u2b332vslbvq3pwsl55xutr5zs44u44vgzkaxiqi'
      },
      {
        version: 8,
        cid: 'bafkreiadrlfjsrxbkythkls3nvq42pivmmnv2qv3nwioqi6nzg2ntstoya'
      }
    ],
    previousVersion:
      'bafkreidbbixwzpg2hf4kwslayhv5cwoevvaof4poyo77ckpxodpc33wt5y'
  }
];
