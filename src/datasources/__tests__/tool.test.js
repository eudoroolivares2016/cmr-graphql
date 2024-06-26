import nock from 'nock'

import {
  deleteTool as toolSourceDelete,
  restoreToolRevision as toolSourceRestoreRevision,
  fetchTools as toolSourceFetch
} from '../tool'

let requestInfo

describe('tool#fetch', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'

    // Default requestInfo
    requestInfo = {
      name: 'tools',
      alias: 'tools',
      args: {},
      fieldsByTypeName: {
        ToolList: {
          items: {
            name: 'items',
            alias: 'items',
            args: {},
            fieldsByTypeName: {
              Tool: {
                conceptId: {
                  name: 'conceptId',
                  alias: 'conceptId',
                  args: {},
                  fieldsByTypeName: {}
                }
              }
            }
          }
        }
      }
    }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('cursor', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'tools',
        alias: 'tools',
        args: {},
        fieldsByTypeName: {
          ToolList: {
            cursor: {
              name: 'cursor',
              alias: 'cursor',
              args: {},
              fieldsByTypeName: {}
            },
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Tool: {
                  conceptId: {
                    name: 'conceptId',
                    alias: 'conceptId',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  type: {
                    name: 'type',
                    alias: 'type',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }
    })

    test('returns a cursor', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678',
          'CMR-Search-After': '["xyz", 789, 999]'
        })
        .get(/tools\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'T100000-EDSC'
            },
            umm: {
              Type: 'Downloadable Tool'
            }
          }]
        })

      const response = await toolSourceFetch({}, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: 'eyJ1bW0iOiJbXCJ4eXpcIiwgNzg5LCA5OTldIn0=',
        items: [{
          conceptId: 'T100000-EDSC',
          type: 'Downloadable Tool'
        }]
      })
    })

    describe('when a cursor is requested', () => {
      test('requests a cursor', async () => {
        nock(/example-cmr/)
          .defaultReplyHeaders({
            'CMR-Hits': 84,
            'CMR-Took': 7,
            'CMR-Request-Id': 'abcd-1234-efgh-5678',
            'CMR-Search-After': '["xyz", 789, 999]'
          })
          .get(/tools\.umm_json/)
          .reply(200, {
            items: [{
              meta: {
                'concept-id': 'T100000-EDSC'
              },
              umm: {
                Type: 'Downloadable Tool'
              }
            }]
          })

        const response = await toolSourceFetch({}, {
          headers: {
            'Client-Id': 'eed-test-graphql',
            'CMR-Request-Id': 'abcd-1234-efgh-5678'
          }
        }, requestInfo)

        expect(response).toEqual({
          count: 84,
          cursor: 'eyJ1bW0iOiJbXCJ4eXpcIiwgNzg5LCA5OTldIn0=',
          items: [{
            conceptId: 'T100000-EDSC',
            type: 'Downloadable Tool'
          }]
        })
      })
    })
  })

  describe('without params', () => {
    test('returns the parsed tool results', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/tools\.json/)
        .reply(200, {
          items: [{
            concept_id: 'T100000-EDSC'
          }]
        })

      const response = await toolSourceFetch({}, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: null,
        items: [{
          conceptId: 'T100000-EDSC'
        }]
      })
    })
  })

  describe('with params', () => {
    test('returns the parsed tool results', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get('/search/tools.json?concept_id=T100000-EDSC')
        .reply(200, {
          items: [{
            concept_id: 'T100000-EDSC'
          }]
        })

      const response = await toolSourceFetch({
        params: {
          concept_id: 'T100000-EDSC'
        }
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: null,
        items: [{
          conceptId: 'T100000-EDSC'
        }]
      })
    })
  })

  describe('with only umm keys', () => {
    beforeEach(() => {
      // Overwrite default requestInfo
      requestInfo = {
        name: 'tools',
        alias: 'tools',
        args: {},
        fieldsByTypeName: {
          ToolList: {
            items: {
              name: 'items',
              alias: 'items',
              args: {},
              fieldsByTypeName: {
                Tool: {
                  type: {
                    name: 'type',
                    alias: 'type',
                    args: {},
                    fieldsByTypeName: {}
                  },
                  toolKeywords: {
                    name: 'toolKeywords',
                    alias: 'toolKeywords',
                    args: {},
                    fieldsByTypeName: {}
                  }
                }
              }
            }
          }
        }
      }
    })

    test('returns the parsed tool results', async () => {
      nock(/example-cmr/)
        .defaultReplyHeaders({
          'CMR-Hits': 84,
          'CMR-Took': 7,
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        })
        .get(/tools\.umm_json/)
        .reply(200, {
          items: [{
            meta: {
              'concept-id': 'T100000-EDSC'
            },
            umm: {
              Type: 'Downloadable Tool'
            }
          }]
        })

      const response = await toolSourceFetch({
        params: {
          concept_id: 'T100000-EDSC'
        }
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)

      expect(response).toEqual({
        count: 84,
        cursor: null,
        items: [{
          type: 'Downloadable Tool'
        }]
      })
    })
  })

  test('catches errors received from queryCmrTools', async () => {
    nock(/example-cmr/)
      .get(/tools/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      toolSourceFetch({
        params: {
          conceptId: 'T100000-EDSC'
        }
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)
    ).rejects.toThrow(Error)
  })
})

describe('restoreToolRevision', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'

    // Default requestInfo
    requestInfo = {
      name: 'toolDelete',
      alias: 'toolDelete',
      args: {
        conceptId: 'T100000-EDSC',
        revisionId: '1'
      },
      fieldsByTypeName: {
        ToolMutationResponse: {
          conceptId: {
            name: 'conceptId',
            alias: 'conceptId',
            args: {},
            fieldsByTypeName: {}
          },
          revisionId: {
            name: 'revisionId',
            alias: 'revisionId',
            args: {},
            fieldsByTypeName: {}
          }
        }
      }
    }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('returns the CMR results', async () => {
    nock(/example-cmr/)
      .defaultReplyHeaders({
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      })
      .get('/search/tools.umm_json?concept_id=T100000-EDSC&all_revisions=true')
      .reply(200, {
        items: [{
          meta: {
            'concept-id': 'T100000-EDSC',
            'native-id': '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
            'revision-id': 1
          },
          umm: {
            LongName: 'Tortor Elit Fusce Quam Risus'
          }
        }, {
          meta: {
            'concept-id': 'T100000-EDSC',
            'native-id': '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed',
            'revision-id': 2
          },
          umm: {
            LongName: 'Adipiscing Cras Etiam Venenatis'
          }
        }]
      })

    nock(/example-cmr/)
      .defaultReplyHeaders({
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      })
      .put('/ingest/providers/EDSC/tools/1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed')
      .reply(200, {
        'concept-id': 'T100000-EDSC',
        'revision-id': '3'
      })

    const response = await toolSourceRestoreRevision({
      revisionId: '1',
      conceptId: 'T100000-EDSC'
    }, {
      headers: {
        'Client-Id': 'eed-test-graphql',
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      }
    }, requestInfo)

    expect(response).toEqual({
      conceptId: 'T100000-EDSC',
      revisionId: '3'
    })
  })
})

describe('tool#delete', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()

    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example-cmr.com'

    // Default requestInfo
    requestInfo = {
      name: 'deleteTool',
      alias: 'deleteTool',
      args: {
        conceptId: 'T100000-EDSC',
        nativeId: 'test-guid'
      },
      fieldsByTypeName: {
        ToolMutationResponse: {
          conceptId: {
            name: 'conceptId',
            alias: 'conceptId',
            args: {},
            fieldsByTypeName: {}
          },
          revisionId: {
            name: 'revisionId',
            alias: 'revisionId',
            args: {},
            fieldsByTypeName: {}
          }
        }
      }
    }
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  test('returns the CMR results', async () => {
    nock(/example-cmr/)
      .defaultReplyHeaders({
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      })
      .delete(/ingest\/providers\/EDSC\/tools\/test-guid/)
      .reply(201, {
        'concept-id': 'T100000-EDSC',
        'revision-id': '2'
      })

    const response = await toolSourceDelete({
      nativeId: 'test-guid',
      providerId: 'EDSC'
    }, {
      headers: {
        'Client-Id': 'eed-test-graphql',
        'CMR-Request-Id': 'abcd-1234-efgh-5678'
      }
    }, requestInfo)

    expect(response).toEqual({
      conceptId: 'T100000-EDSC',
      revisionId: '2'
    })
  })

  test('catches errors received from cmrDelete', async () => {
    nock(/example-cmr/)
      .delete(/ingest\/providers\/EDSC\/tools\/test-guid/)
      .reply(500, {
        errors: ['HTTP Error']
      }, {
        'cmr-request-id': 'abcd-1234-efgh-5678'
      })

    await expect(
      toolSourceDelete({
        nativeId: 'test-guid',
        providerId: 'EDSC'
      }, {
        headers: {
          'Client-Id': 'eed-test-graphql',
          'CMR-Request-Id': 'abcd-1234-efgh-5678'
        }
      }, requestInfo)
    ).rejects.toThrow(Error)
  })
})
