import Service from '../service'

process.env.cmrRootUrl = 'http://example.com'

describe('Service concept', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()

    vi.restoreAllMocks()
  })

  describe('Service concept', () => {
    describe('retrieve the parent collection', () => {
      describe('if a parent collection is passed into the service', () => {
        test('Ensure that the parentCollectionConceptId can be passed to child queries', () => {
          const service = new Service({}, {}, {}, 'C1234567889')
          service.associationDetails = {}
          const items = { meta: { 'association-details': {} } }
          service.setEssentialUmmValues('S1234', items)
          expect(service.parentCollectionConceptId).toEqual('C1234567889')
        })
      })
    })
  })
})
